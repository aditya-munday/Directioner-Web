import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from './supabase';
import type { Profile } from './supabase';
import type { User as SupabaseUser, Session, Provider } from '@supabase/supabase-js';

export type User = Profile & { email: string };

export type AuthContextType = {
  user: User | null;
  session: Session | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithOAuth: (provider: Provider) => Promise<void>;
  logout: () => Promise<void>;
  register: (data: { username: string; email: string; password: string }) => Promise<{ needsVerification: boolean }>;
  updateProfile: (updates: Partial<Profile>) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

async function fetchProfile(supabaseUser: SupabaseUser): Promise<User | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', supabaseUser.id)
      .single();

  // Profile row may not exist yet (first sign-in / delayed sync).
  // Don't block auth — fall back to the Supabase user's metadata so the
  // session is still treated as authenticated.
  if (error || !data) {
    return {
      id: supabaseUser.id,
      username: (supabaseUser.user_metadata?.username as string) || supabaseUser.email?.split('@')[0] || 'User',
      full_name: (supabaseUser.user_metadata?.full_name as string) || null,
      avatar_url: (supabaseUser.user_metadata?.avatar_url as string) || null,
      tier: 'free',
      credits_used: 0,
      credits_limit: 0,
      created_at: supabaseUser.created_at ?? new Date().toISOString(),
      updated_at: supabaseUser.created_at ?? new Date().toISOString(),
      email: supabaseUser.email ?? '',
    };
  }

  return { ...data, email: supabaseUser.email ?? '' };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  // Seed demo data for a new user
  const seedIfNeeded = useCallback(async (userId: string) => {
    // Non-fatal: seed function may not exist yet in some environments.
    try {
      await supabase.rpc('seed_demo_data', { p_user_id: userId });
    } catch {
      // ignore
    }
  }, []);


  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(async ({ data: { session: s } }: { data: { session: Session | null } }) => {
      setSession(s);
      if (s?.user) {
        const profile = await fetchProfile(s.user);
        setUser(profile);
      }
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event: string, s: Session | null) => {
      setSession(s);
      if (s?.user) {
        const profile = await fetchProfile(s.user);
        setUser(profile);
        // Seed demo data on first sign-in
        if (event === 'SIGNED_IN' || event === 'USER_UPDATED') {
          await seedIfNeeded(s.user.id);
          // Re-fetch profile after potential seed update
          const updated = await fetchProfile(s.user);
          setUser(updated);
        }
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, [seedIfNeeded]);

  const login = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw new Error(error.message);
  };

  const loginWithOAuth = async (provider: Provider) => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        scopes: provider === 'discord' ? 'identify email' : undefined,
      },
    });
    if (error) throw new Error(error.message);
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
  };

  const register = async ({ username, email, password }: { username: string; email: string; password: string }) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { username },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) throw new Error(error.message);

    // If the user's session is null after sign-up, email verification is required
    const needsVerification = !data.session;
    if (needsVerification) {
      sessionStorage.setItem('pending_verification_email', email);
    }
    return { needsVerification };
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) return;
    const { error } = await supabase
      .from('profiles')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', user.id);
    if (error) throw new Error(error.message);
    setUser(prev => prev ? { ...prev, ...updates } : null);
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, login, loginWithOAuth, logout, register, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}