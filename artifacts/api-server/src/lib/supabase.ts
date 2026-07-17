import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { env } from "./env";

/**
 * Auth client — used ONLY to verify user JWTs in requireAuth.
 *
 * Prefer the service-role key when available (skips RLS and is the secure
 * server-side pattern). Fall back to the anon key for local dev without a
 * service role secret.
 */
let supabaseInstance: SupabaseClient | null = null;

const supabaseUrl = env.SUPABASE_URL || env.VITE_SUPABASE_URL;
const supabaseKey =
  env.SUPABASE_SERVICE_ROLE_KEY ||
  env.SUPABASE_ANON_KEY ||
  env.VITE_SUPABASE_ANON_KEY;

if (supabaseUrl && supabaseKey) {
  supabaseInstance = createClient(supabaseUrl, supabaseKey, {
    auth: {
      // Server-side: never persist sessions
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
}

export const supabase = supabaseInstance;
export const supabaseConfigured = supabaseInstance !== null;
