import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { env } from "./env";

let supabaseInstance: SupabaseClient | null = null;

if (env.VITE_SUPABASE_URL && env.VITE_SUPABASE_ANON_KEY) {
  supabaseInstance = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY);
}

export const supabase = supabaseInstance;
export const supabaseConfigured = supabaseInstance !== null;
