/**
 * Database query hooks — all real data from Supabase.
 * Each hook returns { data, loading, error } and re-fetches when userId changes.
 * Real-time hooks also subscribe to Supabase Realtime channels.
 */
import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from './supabase';
import type { Server, AnalyticsDaily, MemoryNode, ActivityFeedItem, BillingRecord } from './supabase';

// ─── Generic fetch hook ───────────────────────────────────────────────────────
function useQuery<T extends unknown[]>(
  fetcher: () => Promise<T>,
  deps: unknown[],
) {
  // Default to an EMPTY ARRAY (not null) so consumers that destructure
  // `const { data = [] }` actually receive [] on the initial render.
  // Initializing to null made every dashboard page crash with
  // `null.map` / `null.reduce` / `null.length` before the fetch resolved.
  const [data, setData] = useState<T>([] as unknown as T);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetch = useCallback(fetcher, deps);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetch()
      .then(d => { if (!cancelled) { setData(d); setError(null); } })
      .catch(e => { if (!cancelled) { setError(e.message); setData([] as unknown as T); } })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [fetch]);

  return { data, loading, error, refetch: fetch };
}

// ─── Servers ──────────────────────────────────────────────────────────────────
export function useServers(userId: string | undefined) {
  return useQuery<Server[]>(
    async () => {
      if (!userId) return [];
      const { data, error } = await supabase
        .from('servers')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: true });
      if (error) throw error;
      return data ?? [];
    },
    [userId],
  );
}

export async function addServer(userId: string, serverName: string, discordServerId: string) {
  const { data, error } = await supabase
    .from('servers')
    .insert({
      user_id: userId,
      server_name: serverName,
      discord_server_id: discordServerId,
      member_count: 0,
      channel_count: 0,
      status: 'online',
    })
    .select()
    .single();
  if (error) throw error;
  return data as Server;
}

export async function updateServer(serverId: string, updates: Partial<Server>) {
  const { error } = await supabase.from('servers').update(updates).eq('id', serverId);
  if (error) throw error;
}

export async function deleteServer(serverId: string) {
  const { error } = await supabase.from('servers').delete().eq('id', serverId);
  if (error) throw error;
}

// ─── Analytics (with real-time updates) ──────────────────────────────────────
export type AnalyticsRange = '7d' | '30d' | '90d';

export function useAnalytics(userId: string | undefined, range: AnalyticsRange) {
  const [data, setData] = useState<AnalyticsDaily[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

  const days = range === '7d' ? 7 : range === '30d' ? 30 : 90;
  const since = new Date(Date.now() - days * 86400000).toISOString().split('T')[0];

  const loadData = useCallback(async () => {
    if (!userId) { setLoading(false); return; }
    setLoading(true);
    const { data: rows, error: err } = await supabase
      .from('analytics_daily')
      .select('*')
      .eq('user_id', userId)
      .gte('date', since)
      .order('date', { ascending: true });
    if (err) { setError(err.message); } else { setData(rows ?? []); setError(null); }
    setLoading(false);
  }, [userId, since]);

  useEffect(() => {
    loadData();

    // Subscribe to real-time inserts/updates for this user's analytics
    if (userId) {
      channelRef.current = supabase
        .channel(`analytics:${userId}`)
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'analytics_daily', filter: `user_id=eq.${userId}` },
          () => { loadData(); },
        )
        .subscribe();
    }

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [loadData, userId]);

  return { data, loading, error, refetch: loadData };
}

// Aggregate stats across all analytics rows
export function computeAnalyticsStats(data: AnalyticsDaily[]) {
  return {
    totalMessages: data.reduce((s, d) => s + d.text_messages, 0),
    totalVoice: data.reduce((s, d) => s + d.voice_minutes, 0),
    totalCredits: data.reduce((s, d) => s + d.credits, 0),
    avgMessages: data.length ? Math.round(data.reduce((s, d) => s + d.text_messages, 0) / data.length) : 0,
    peakMessages: data.length ? Math.max(...data.map(d => d.text_messages)) : 0,
  };
}

// ─── Memory Nodes ─────────────────────────────────────────────────────────────
export function useMemoryNodes(userId: string | undefined, serverId?: string) {
  return useQuery<MemoryNode[]>(
    async () => {
      if (!userId) return [];
      let q = supabase.from('memory_nodes').select('*').eq('user_id', userId);
      if (serverId) q = q.eq('server_id', serverId);
      const { data, error } = await q.order('created_at', { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
    [userId, serverId],
  );
}

export async function addMemoryNode(userId: string, serverId: string | null, content: string, scope: 'user' | 'server' | 'global' = 'server', targetUser?: string) {
  const { data, error } = await supabase
    .from('memory_nodes')
    .insert({ user_id: userId, server_id: serverId, content, scope, target_user: targetUser ?? null })
    .select()
    .single();
  if (error) throw error;
  return data as MemoryNode;
}

export async function deleteMemoryNode(nodeId: string) {
  const { error } = await supabase.from('memory_nodes').delete().eq('id', nodeId);
  if (error) throw error;
}

// ─── Activity Feed (real-time) ────────────────────────────────────────────────
export function useActivityFeed(userId: string | undefined, limit = 12) {
  const [data, setData] = useState<ActivityFeedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

  const loadData = useCallback(async () => {
    if (!userId) { setLoading(false); return; }
    const { data: rows } = await supabase
      .from('activity_feed')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);
    setData(rows ?? []);
    setLoading(false);
  }, [userId, limit]);

  useEffect(() => {
    loadData();

    if (userId) {
      channelRef.current = supabase
        .channel(`activity:${userId}`)
        .on(
          'postgres_changes',
          { event: 'INSERT', schema: 'public', table: 'activity_feed', filter: `user_id=eq.${userId}` },
          (payload: any) => {
            setData(prev => [payload.new as ActivityFeedItem, ...prev].slice(0, limit));
          },
        )
        .subscribe();
    }

    return () => {
      if (channelRef.current) { supabase.removeChannel(channelRef.current); }
    };
  }, [loadData, userId, limit]);

  return { data, loading, refetch: loadData };
}

// ─── Billing History ──────────────────────────────────────────────────────────
export function useBilling(userId: string | undefined) {
  return useQuery<BillingRecord[]>(
    async () => {
      if (!userId) return [];
      const { data, error } = await supabase
        .from('billing_history')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
    [userId],
  );
}

// ─── Dashboard overview stats ─────────────────────────────────────────────────
export function useDashboardStats(userId: string | undefined, servers: Server[] | null, analyticsData: AnalyticsDaily[] | null) {
  const safeServers = servers ?? [];
  const safeAnalytics = analyticsData ?? [];
  const today = new Date().toISOString().split('T')[0];
  const todayRows = safeAnalytics.filter(d => d.date === today);

  const totalMembers = safeServers.reduce((s, sv) => s + sv.member_count, 0);
  const messagesToday = todayRows.reduce((s, d) => s + d.text_messages, 0);

  const [memoryCount, setMemoryCount] = useState(0);

  useEffect(() => {
    if (!userId) return;
    supabase
      .from('memory_nodes')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId)
      .then(({ count }: { count: number | null }) => setMemoryCount(count ?? 0))
      .catch(() => { /* non-fatal: memory count is best-effort */ });
  }, [userId]);

  return {
    totalServers: safeServers.length,
    totalMembers,
    messagesToday,
    memoryCount,
  };
}

// ─── Simulated realtime: insert a new activity event ─────────────────────────
export async function pushActivityEvent(
  userId: string,
  serverId: string | null,
  eventType: string,
  channel: string | null,
  actor: string | null,
  details: string,
) {
  await supabase.from('activity_feed').insert({
    user_id: userId,
    server_id: serverId,
    event_type: eventType,
    channel,
    actor,
    details,
  });
}

// ─── Increment analytics for today ───────────────────────────────────────────
export async function trackMessage(userId: string, serverId: string, isVoice = false) {
  const today = new Date().toISOString().split('T')[0];
  await supabase.rpc('increment_analytics', {
    p_user_id: userId,
    p_server_id: serverId,
    p_date: today,
    p_text_messages: isVoice ? 0 : 1,
    p_voice_minutes: isVoice ? 1 : 0,
    p_credits: isVoice ? 5 : 2,
  }).then(() => {}).catch(() => {}); // fire-and-forget
}
