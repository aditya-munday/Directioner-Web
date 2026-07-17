import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

let supabaseInstance: SupabaseClient | null = null;

try {
  if (supabaseUrl && supabaseAnonKey) {
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
      },
      realtime: {
        params: { eventsPerSecond: 10 },
      },
    });
  }
} catch (e) {
  console.warn('Failed to initialize Supabase client:', e);
}

// Export as SupabaseClient so consumers get full type safety.
// Callers must guard against null (supabase configured = true) before use.
export const supabase = supabaseInstance as SupabaseClient;

// ─── Database Types ──────────────────────────────────────────────────────────

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
  scope: 'user' | 'server' | 'global';
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