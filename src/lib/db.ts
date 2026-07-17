/**
 * Database query hooks — all real data from Supabase.
 *
 * Security hardening applied:
 *  • All text inputs are sanitised and length-clamped before insert
 *  • select() columns are explicit — never select('*')
 *  • updateServer() uses a whitelist — user_id / tier / credits are not writable
 *  • addMemoryNode() blocks scope:'global' from the client
 *  • Realtime payloads are validated before state mutations
 *  • Error messages are normalised — raw DB errors never surface to UI state
 *  • deleteServer / deleteMemoryNode assert ownership in JS layer (belt-and-suspenders with RLS)
 */
import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from './supabase';
import type { Server, AnalyticsDaily, MemoryNode, ActivityFeedItem, BillingRecord } from './supabase';
import {
  sanitizeText,
  sanitizeDiscordId,
  sanitizeEventType,
  sanitizeServerUpdate,
  isValidRealtimePayload,
  normalizeAuthError,
  LIMITS,
} from './security';

// ─── Safe error message ───────────────────────────────────────────────────────
function safeDbError(e: unknown): string {
  // normalizeAuthError covers DB errors too — prevents raw Postgres messages
  return normalizeAuthError(e);
}

// ─── Generic fetch hook ───────────────────────────────────────────────────────
function useQuery<T extends unknown[]>(
  fetcher: () => Promise<T>,
  deps: unknown[],
) {
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
      .catch(e => {
        if (!cancelled) {
          // Sanitize error before storing in state — never expose raw DB messages
          setError(safeDbError(e));
          setData([] as unknown as T);
        }
      })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [fetch]);

  return { data, loading, error, refetch: fetch };
}

// ─── Servers ──────────────────────────────────────────────────────────────────
export function useServers(userId: string | undefined) {
  return useQuery<Server[]>(
    async () => {
      if (!userId || !supabase) return [];
      const { data, error } = await supabase
        .from('servers')
        // Explicit column list — never select('*') to avoid leaking future cols
        .select('id, user_id, server_name, discord_server_id, member_count, channel_count, status, tier, ai_mode, created_at')
        .eq('user_id', userId)
        .order('created_at', { ascending: true });
      if (error) throw error;
      return data ?? [];
    },
    [userId],
  );
}

export async function addServer(userId: string, serverName: string, discordServerId: string) {
  if (!supabase) throw new Error('Database not configured.');

  // Sanitise inputs before they reach the DB
  const safeName = sanitizeText(serverName, LIMITS.SERVER_NAME_MAX);
  const safeDiscordId = sanitizeDiscordId(discordServerId);

  if (!safeName) throw new Error('Server name cannot be empty.');
  if (!safeDiscordId) throw new Error('Please provide a valid Discord server ID (numbers only).');

  const { data, error } = await supabase
    .from('servers')
    .insert({
      user_id: userId,
      server_name: safeName,
      discord_server_id: safeDiscordId,
      member_count: 0,
      channel_count: 0,
      status: 'online' as const,
    })
    .select('id, user_id, server_name, discord_server_id, member_count, channel_count, status, tier, ai_mode, created_at')
    .single();
  if (error) throw new Error(safeDbError(error));
  return data as Server;
}

export async function updateServer(
  serverId: string,
  userId: string,
  updates: Record<string, unknown>,
) {
  if (!supabase) throw new Error('Database not configured.');

  // Strip any fields not in the whitelist — prevents client from overwriting
  // user_id, tier, credits, or other privileged columns
  const safe = sanitizeServerUpdate(updates);

  if (Object.keys(safe).length === 0) return;

  const { error } = await supabase
    .from('servers')
    .update(safe)
    .eq('id', serverId)
    // JS-layer ownership check (belt-and-suspenders with RLS)
    .eq('user_id', userId);

  if (error) throw new Error(safeDbError(error));
}

export async function deleteServer(serverId: string, userId: string) {
  if (!supabase) throw new Error('Database not configured.');

  // Ownership assertion in JS layer — prevents accidental cross-user deletes
  // if RLS policies are misconfigured on the DB side
  const { error } = await supabase
    .from('servers')
    .delete()
    .eq('id', serverId)
    .eq('user_id', userId);   // must own the server

  if (error) throw new Error(safeDbError(error));
}

// ─── Analytics (with real-time updates) ──────────────────────────────────────
export type AnalyticsRange = '7d' | '30d' | '90d';

export function useAnalytics(userId: string | undefined, range: AnalyticsRange) {
  const [data, setData] = useState<AnalyticsDaily[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const channelRef = useRef<ReturnType<NonNullable<typeof supabase>['channel']> | null>(null);

  const days = range === '7d' ? 7 : range === '30d' ? 30 : 90;
  const since = new Date(Date.now() - days * 86400000).toISOString().split('T')[0];

  const loadData = useCallback(async () => {
    if (!userId || !supabase) { setLoading(false); return; }
    setLoading(true);
    const { data: rows, error: err } = await supabase
      .from('analytics_daily')
      .select('id, user_id, server_id, date, text_messages, voice_minutes, credits, created_at')
      .eq('user_id', userId)
      .gte('date', since)
      .order('date', { ascending: true });
    if (err) {
      setError(safeDbError(err));
    } else {
      setData(rows ?? []);
      setError(null);
    }
    setLoading(false);
  }, [userId, since]);

  useEffect(() => {
    loadData();

    if (userId && supabase) {
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
      if (channelRef.current && supabase) {
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
      if (!userId || !supabase) return [];
      let q = supabase
        .from('memory_nodes')
        .select('id, user_id, server_id, content, scope, target_user, created_at')
        .eq('user_id', userId);
      if (serverId) q = q.eq('server_id', serverId);
      const { data, error } = await q.order('created_at', { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
    [userId, serverId],
  );
}

export async function addMemoryNode(
  userId: string,
  serverId: string | null,
  content: string,
  // 'global' scope is reserved for server-side operations only
  scope: 'user' | 'server' = 'server',
  targetUser?: string,
) {
  if (!supabase) throw new Error('Database not configured.');

  const safeContent = sanitizeText(content, LIMITS.MEMORY_CONTENT_MAX);
  if (!safeContent) throw new Error('Memory content cannot be empty.');

  // Explicitly block 'global' scope from client
  const safeScope: 'user' | 'server' = scope === 'user' ? 'user' : 'server';

  const safeTargetUser = targetUser
    ? sanitizeText(targetUser, 64)
    : null;

  const { data, error } = await supabase
    .from('memory_nodes')
    .insert({
      user_id: userId,
      server_id: serverId,
      content: safeContent,
      scope: safeScope,
      target_user: safeTargetUser,
    })
    .select('id, user_id, server_id, content, scope, target_user, created_at')
    .single();
  if (error) throw new Error(safeDbError(error));
  return data as MemoryNode;
}

export async function deleteMemoryNode(nodeId: string, userId: string) {
  if (!supabase) throw new Error('Database not configured.');

  // Ownership assertion — must provide userId to prevent cross-user deletes
  const { error } = await supabase
    .from('memory_nodes')
    .delete()
    .eq('id', nodeId)
    .eq('user_id', userId);

  if (error) throw new Error(safeDbError(error));
}

// ─── Activity Feed (real-time) ────────────────────────────────────────────────
export function useActivityFeed(userId: string | undefined, limit = 12) {
  const [data, setData] = useState<ActivityFeedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const channelRef = useRef<ReturnType<NonNullable<typeof supabase>['channel']> | null>(null);

  const loadData = useCallback(async () => {
    if (!userId || !supabase) { setLoading(false); return; }
    const { data: rows } = await supabase
      .from('activity_feed')
      .select('id, user_id, server_id, event_type, channel, actor, details, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(Math.min(limit, 50)); // cap at 50 regardless of caller
    setData(rows ?? []);
    setLoading(false);
  }, [userId, limit]);

  useEffect(() => {
    loadData();

    if (userId && supabase) {
      channelRef.current = supabase
        .channel(`activity:${userId}`)
        .on(
          'postgres_changes',
          { event: 'INSERT', schema: 'public', table: 'activity_feed', filter: `user_id=eq.${userId}` },
          (payload: unknown) => {
            // Validate realtime payload shape before mutating state
            // Guards against prototype pollution / crafted WS messages
            if (
              !isValidRealtimePayload<ActivityFeedItem>(payload, [
                'id', 'user_id', 'event_type', 'details', 'created_at',
              ])
            ) {
              if (import.meta.env.DEV) {
                console.warn('[Directioner] Ignored invalid realtime payload', payload);
              }
              return;
            }

            const item = payload.new as ActivityFeedItem;

            // Extra safety: only accept events for the subscribed user
            if (item.user_id !== userId) return;

            setData(prev => [item, ...prev].slice(0, Math.min(limit, 50)));
          },
        )
        .subscribe();
    }

    return () => {
      if (channelRef.current && supabase) {
        supabase.removeChannel(channelRef.current);
      }
    };
  }, [loadData, userId, limit]);

  return { data, loading, refetch: loadData };
}

// ─── Billing History ──────────────────────────────────────────────────────────
export function useBilling(userId: string | undefined) {
  return useQuery<BillingRecord[]>(
    async () => {
      if (!userId || !supabase) return [];
      const { data, error } = await supabase
        .from('billing_history')
        .select('id, user_id, amount, status, description, invoice_url, created_at')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
    [userId],
  );
}

// ─── Dashboard overview stats ─────────────────────────────────────────────────
export function useDashboardStats(
  userId: string | undefined,
  servers: Server[] | null,
  analyticsData: AnalyticsDaily[] | null,
) {
  const safeServers = servers ?? [];
  const safeAnalytics = analyticsData ?? [];
  const today = new Date().toISOString().split('T')[0];
  const todayRows = safeAnalytics.filter(d => d.date === today);

  const totalMembers = safeServers.reduce((s, sv) => s + sv.member_count, 0);
  const messagesToday = todayRows.reduce((s, d) => s + d.text_messages, 0);

  const [memoryCount, setMemoryCount] = useState(0);

  useEffect(() => {
    if (!userId || !supabase) return;
    supabase
      .from('memory_nodes')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId)
      .then(({ count }: { count: number | null }) => setMemoryCount(count ?? 0))
      .catch(() => { /* best-effort count — non-fatal */ });
  }, [userId]);

  return {
    totalServers: safeServers.length,
    totalMembers,
    messagesToday,
    memoryCount,
  };
}

// ─── Activity event push ──────────────────────────────────────────────────────
export async function pushActivityEvent(
  userId: string,
  serverId: string | null,
  eventType: string,
  channel: string | null,
  actor: string | null,
  details: string,
) {
  if (!supabase) return;

  // Sanitise all free-text fields before inserting
  await supabase.from('activity_feed').insert({
    user_id: userId,
    server_id: serverId,
    event_type: sanitizeEventType(eventType),
    channel: channel ? sanitizeText(channel, LIMITS.ACTIVITY_CHANNEL_MAX) : null,
    actor: actor ? sanitizeText(actor, LIMITS.ACTIVITY_ACTOR_MAX) : null,
    details: sanitizeText(details, LIMITS.ACTIVITY_DETAILS_MAX),
  });
}

// ─── Increment analytics for today ───────────────────────────────────────────
export async function trackMessage(userId: string, serverId: string, isVoice = false) {
  if (!supabase) return;
  const today = new Date().toISOString().split('T')[0];
  try {
    await supabase.rpc('increment_analytics', {
      p_user_id: userId,
      p_server_id: serverId,
      p_date: today,
      p_text_messages: isVoice ? 0 : 1,
      p_voice_minutes: isVoice ? 1 : 0,
      p_credits: isVoice ? 5 : 2,
    });
  } catch (e) {
    // Log in dev, swallow silently in production — analytics failure should not
    // surface as a visible error to the user
    if (import.meta.env.DEV) {
      console.warn('[Directioner] trackMessage failed:', safeDbError(e));
    }
  }
}
