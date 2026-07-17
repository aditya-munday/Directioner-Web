import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from './supabase';
import type { Profile } from './supabase';
import type { User as SupabaseUser, Session, Provider } from '@supabase/supabase-js';
import {
  sanitizeUsername,
  isValidEmail,
  isValidUsername,
  checkPassword,
  normalizeAuthError,
  loginRateLimiter,
  safeOAuthRedirect,
  LIMITS,
} from './security';

export type User = Profile & { email: string };

export type AuthContextType = {
  user: User | null;
  session: Session | null;
  loading: boolean;
  configured: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithOAuth: (provider: Provider) => Promise<void>;
  logout: () => Promise<void>;
  register: (data: { username: string; email: string; password: string }) => Promise<{ needsVerification: boolean }>;
  updateProfile: (updates: Partial<Pick<Profile, 'username' | 'full_name' | 'avatar_url'>>) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ─── Safe profile builder ─────────────────────────────────────────────────────
// Never read arbitrary user_metadata fields directly — only pull known-safe keys
// through explicit access to prevent metadata injection via crafted OAuth tokens.
function buildFallbackUser(supabaseUser: SupabaseUser): User {
  const rawUsername = typeof supabaseUser.user_metadata?.username === 'string'
    ? supabaseUser.user_metadata.username
    : '';
  const rawFullName = typeof supabaseUser.user_metadata?.full_name === 'string'
    ? supabaseUser.user_metadata.full_name
    : null;
  const rawAvatarUrl = typeof supabaseUser.user_metadata?.avatar_url === 'string'
    ? supabaseUser.user_metadata.avatar_url
    : null;

  // Sanitize metadata before using it
  const safeUsername = sanitizeUsername(rawUsername || supabaseUser.email?.split('@')[0] || 'user');
  const safeFullName = rawFullName
    ? rawFullName.replace(/[<>"'&]/g, '').slice(0, 128) || null
    : null;
  // Avatar URL: only allow https:// URLs to prevent javascript: XSS
  const safeAvatarUrl =
    rawAvatarUrl && /^https:\/\//i.test(rawAvatarUrl) ? rawAvatarUrl : null;

  return {
    id: supabaseUser.id,
    username: safeUsername,
    full_name: safeFullName,
    avatar_url: safeAvatarUrl,
    tier: 'free',
    credits_used: 0,
    credits_limit: 0,
    created_at: supabaseUser.created_at ?? new Date().toISOString(),
    updated_at: supabaseUser.created_at ?? new Date().toISOString(),
    email: supabaseUser.email ?? '',
  };
}

async function fetchProfile(supabaseUser: SupabaseUser): Promise<User | null> {
  if (!supabase) return null;

  const { data, error } = await supabase
    .from('profiles')
    // Explicitly select only the columns we need — avoids leaking any future
    // sensitive columns that might be added to the table
    .select('id, username, full_name, avatar_url, tier, credits_used, credits_limit, created_at, updated_at')
    .eq('id', supabaseUser.id)
    .single();

  if (error || !data) {
    return buildFallbackUser(supabaseUser);
  }

  return { ...data, email: supabaseUser.email ?? '' };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const configured = supabase !== null && supabase !== undefined;

  // Track seeded user IDs in-memory to avoid firing the RPC on every auth event
  const seededIds = useRef(new Set<string>());

  const seedIfNeeded = useCallback(async (userId: string) => {
    if (!supabase || seededIds.current.has(userId)) return;
    seededIds.current.add(userId);
    try {
      await supabase.rpc('seed_demo_data', { p_user_id: userId });
    } catch {
      // Non-fatal — seed function may not exist in all environments
      seededIds.current.delete(userId); // allow retry if it was a transient error
    }
  }, []);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    supabase.auth.getSession().then(async ({ data: { session: s } }) => {
      setSession(s);
      if (s?.user) {
        const profile = await fetchProfile(s.user);
        setUser(profile);
      }
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, s) => {
        setSession(s);
        if (s?.user) {
          const profile = await fetchProfile(s.user);
          setUser(profile);
          // Only seed on genuine first sign-in, not on token refresh
          if (event === 'SIGNED_IN') {
            await seedIfNeeded(s.user.id);
          }
        } else {
          setUser(null);
        }
      },
    );

    return () => subscription.unsubscribe();
  }, [seedIfNeeded]);

  // ── login ─────────────────────────────────────────────────────────────────
  const login = async (email: string, password: string) => {
    if (!supabase) {
      throw new Error('Authentication is not configured. Add your Supabase secrets to enable login.');
    }

    // Client-side rate limiting — complements Supabase server-side limits
    const rateLimitKey = `login:${email.toLowerCase()}`;
    const { allowed, secondsRemaining } = loginRateLimiter.check(rateLimitKey);
    if (!allowed) {
      throw new Error(
        `Too many login attempts. Please wait ${secondsRemaining} seconds before trying again.`,
      );
    }

    // Basic client-side validation before hitting the network
    if (!isValidEmail(email)) {
      throw new Error('Please enter a valid email address.');
    }
    if (!password || password.length < LIMITS.PASSWORD_MIN) {
      throw new Error(`Password must be at least ${LIMITS.PASSWORD_MIN} characters.`);
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      loginRateLimiter.recordFailure(rateLimitKey);
      throw new Error(normalizeAuthError(error));
    }

    // Success — reset the rate limiter for this email
    loginRateLimiter.reset(rateLimitKey);
  };

  // ── OAuth login ───────────────────────────────────────────────────────────
  const loginWithOAuth = async (provider: Provider) => {
    if (!supabase) {
      throw new Error('Authentication is not configured.');
    }

    // safeOAuthRedirect validates the origin and path to prevent open-redirect
    const redirectTo = safeOAuthRedirect('/auth/callback');

    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo,
        scopes: provider === 'discord' ? 'identify email' : undefined,
        // Skip browser redirect prompt (reduces phishing surface)
        skipBrowserRedirect: false,
      },
    });

    if (error) throw new Error(normalizeAuthError(error));
  };

  // ── logout ────────────────────────────────────────────────────────────────
  const logout = async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    // Clear any auth-adjacent session storage entries
    sessionStorage.removeItem('pending_verification_email');
    seededIds.current.clear();
  };

  // ── register ──────────────────────────────────────────────────────────────
  const register = async ({
    username,
    email,
    password,
  }: {
    username: string;
    email: string;
    password: string;
  }) => {
    if (!supabase) {
      throw new Error('Authentication is not configured. Add your Supabase secrets to enable registration.');
    }

    // ── Input validation ────────────────────────────────────────────────────
    const cleanUsername = sanitizeUsername(username);
    if (!isValidUsername(cleanUsername)) {
      throw new Error(
        `Username must be ${LIMITS.USERNAME_MIN}–${LIMITS.USERNAME_MAX} characters and contain only letters, numbers, underscores, hyphens, or dots.`,
      );
    }

    if (!isValidEmail(email)) {
      throw new Error('Please enter a valid email address.');
    }

    const { valid: pwValid, issues: pwIssues } = checkPassword(password);
    if (!pwValid) {
      throw new Error(pwIssues[0] ?? 'Password does not meet requirements.');
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { username: cleanUsername },
        emailRedirectTo: safeOAuthRedirect('/auth/callback'),
      },
    });

    if (error) throw new Error(normalizeAuthError(error));

    const needsVerification = !data.session;
    if (needsVerification) {
      // Store only the sanitized email — no raw user input in storage
      sessionStorage.setItem('pending_verification_email', email.toLowerCase().trim());
    }

    return { needsVerification };
  };

  // ── updateProfile ─────────────────────────────────────────────────────────
  // Accepts only a strict subset of fields — never allows updating id, tier,
  // credits, or any admin-only field from the client.
  const updateProfile = async (
    updates: Partial<Pick<Profile, 'username' | 'full_name' | 'avatar_url'>>,
  ) => {
    if (!user || !supabase) {
      throw new Error('You must be signed in to update your profile.');
    }

    // Sanitize each permitted field individually
    const safe: Record<string, string | null> = {};

    if (updates.username !== undefined) {
      const cleanUsername = sanitizeUsername(updates.username);
      if (!isValidUsername(cleanUsername)) {
        throw new Error('Invalid username. Use only letters, numbers, underscores, hyphens, or dots.');
      }
      safe.username = cleanUsername;
    }

    if (updates.full_name !== undefined) {
      safe.full_name = updates.full_name
        ? updates.full_name.replace(/[<>"'&]/g, '').slice(0, 128) || null
        : null;
    }

    if (updates.avatar_url !== undefined) {
      // Enforce https:// only to block javascript: / data: XSS vectors
      if (updates.avatar_url && !/^https:\/\//i.test(updates.avatar_url)) {
        throw new Error('Avatar URL must be a secure https:// URL.');
      }
      safe.avatar_url = updates.avatar_url || null;
    }

    if (Object.keys(safe).length === 0) return;

    const { error } = await supabase
      .from('profiles')
      .update({ ...safe, updated_at: new Date().toISOString() })
      .eq('id', user.id);

    if (error) throw new Error(normalizeAuthError(error));

    setUser(prev => prev ? { ...prev, ...safe } : null);
  };

  return (
    <AuthContext.Provider
      value={{ user, session, loading, configured, login, loginWithOAuth, logout, register, updateProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
