import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

// ─── Typed database schema ────────────────────────────────────────────────────
// Defining the DB shape lets TypeScript catch mis-named columns and wrong types
// at compile time, preventing a whole class of runtime query bugs.

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Update: Partial<Omit<Profile, 'id' | 'created_at'>>;
      };
      servers: {
        Row: Server;
        Insert: Omit<Server, 'id' | 'created_at'>;
        Update: Partial<Omit<Server, 'id' | 'user_id' | 'created_at'>>;
      };
      analytics_daily: {
        Row: AnalyticsDaily;
      };
      memory_nodes: {
        Row: MemoryNode;
        Insert: Omit<MemoryNode, 'id' | 'created_at'>;
      };
      activity_feed: {
        Row: ActivityFeedItem;
        Insert: Omit<ActivityFeedItem, 'id' | 'created_at'>;
      };
      billing_history: {
        Row: BillingRecord;
      };
    };
  };
}

let supabaseInstance: SupabaseClient<Database> | null = null;

try {
  if (supabaseUrl && supabaseAnonKey) {
    supabaseInstance = createClient<Database>(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
        // PKCE prevents authorization-code interception attacks on OAuth flows
        flowType: 'pkce',
        // Namespaced storage key — harder to guess/target than the default
        storageKey: 'dir_auth_v1',
      },
      realtime: {
        // Tighter events-per-second limit reduces amplification via realtime abuse
        params: { eventsPerSecond: 2 },
      },
      global: {
        headers: {
          // Identify client version — useful for server-side audit logs
          'x-client-info': 'directioner-web/1.0',
        },
      },
    });
  }
} catch (e) {
  // Log to console in development only — never surface to end users
  if (import.meta.env.DEV) {
    console.warn('[Directioner] Supabase init failed:', e);
  }
}

// Exported as the typed client — no `as any` escape hatch
export const supabase = supabaseInstance as SupabaseClient<Database> | null;

// ─── Database types ───────────────────────────────────────────────────────────

export interface Profile {
  id: string;
  username: string;
  full_name: string | null;
  avatar_url: string | null;
  tier: 'free' | 'basic' | 'pro' | 'max';
  credits_used: number;
  credits_limit: number;
  created_at: string;
  updated_at: string;
}

export interface Server {
  id: string;
  user_id: string;
  server_name: string;
  discord_server_id: string;
  member_count: number;
  channel_count: number;
  status: 'online' | 'offline' | 'maintenance';
  tier: string;
  ai_mode: string;
  created_at: string;
}

export interface AnalyticsDaily {
  id: string;
  user_id: string;
  server_id: string | null;
  date: string;
  text_messages: number;
  voice_minutes: number;
  credits: number;
  created_at: string;
}

export interface MemoryNode {
  id: string;
  user_id: string;
  server_id: string | null;
  content: string;
  scope: 'user' | 'server';   // 'global' scope is server-side only — never from client
  target_user: string | null;
  created_at: string;
}

export interface ActivityFeedItem {
  id: string;
  user_id: string;
  server_id: string | null;
  event_type: string;
  channel: string | null;
  actor: string | null;
  details: string;
  created_at: string;
}

export interface BillingRecord {
  id: string;
  user_id: string;
  amount: number;
  status: 'paid' | 'pending' | 'failed' | 'refunded';
  description: string | null;
  invoice_url: string | null;
  created_at: string;
}
