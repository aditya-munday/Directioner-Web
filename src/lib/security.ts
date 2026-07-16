/**
 * security.ts — centralised client-side security utilities
 *
 * Covers:
 *  • Input sanitisation & validation
 *  • Client-side rate limiting (brute-force mitigation)
 *  • Auth error normalisation (prevents information leakage)
 *  • Safe redirect validation
 *  • Content-length guards
 */

// ─── Constants ────────────────────────────────────────────────────────────────

export const LIMITS = {
  USERNAME_MAX: 32,
  USERNAME_MIN: 2,
  SERVER_NAME_MAX: 100,
  DISCORD_ID_MAX: 20,
  MEMORY_CONTENT_MAX: 2000,
  ACTIVITY_DETAILS_MAX: 500,
  ACTIVITY_ACTOR_MAX: 64,
  ACTIVITY_EVENT_TYPE_MAX: 48,
  ACTIVITY_CHANNEL_MAX: 64,
  PASSWORD_MIN: 8,
  EMAIL_MAX: 254,
} as const;

// ─── Sanitisation ─────────────────────────────────────────────────────────────

/**
 * Strip control characters and null bytes, then trim and clamp length.
 * Safe for any free-text field going into the DB.
 */
export function sanitizeText(input: string, maxLength: number): string {
  return input
    // remove null bytes and non-printable control characters (keep tab/newline)
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
    // collapse repeated whitespace sequences
    .replace(/\s{2,}/g, ' ')
    .trim()
    .slice(0, maxLength);
}

/**
 * Username: alphanumeric, underscores, hyphens, dots only.
 * Prevents injection through usernames and ensures consistent display.
 */
export function sanitizeUsername(input: string): string {
  return input
    .replace(/[^a-zA-Z0-9_.\-]/g, '')
    .slice(0, LIMITS.USERNAME_MAX);
}

/**
 * Discord server ID: digits only (Snowflake format).
 */
export function sanitizeDiscordId(input: string): string {
  return input.replace(/\D/g, '').slice(0, LIMITS.DISCORD_ID_MAX);
}

/**
 * Event type keys: lowercase letters, underscores, hyphens only.
 */
export function sanitizeEventType(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9_\-]/g, '')
    .slice(0, LIMITS.ACTIVITY_EVENT_TYPE_MAX);
}

// ─── Validation ───────────────────────────────────────────────────────────────

/** RFC 5322-ish email check. Not perfect but catches all common mistakes. */
export function isValidEmail(email: string): boolean {
  if (!email || email.length > LIMITS.EMAIL_MAX) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
}

/** Username rules: 2–32 chars, alphanumeric/underscore/hyphen/dot. */
export function isValidUsername(username: string): boolean {
  if (username.length < LIMITS.USERNAME_MIN || username.length > LIMITS.USERNAME_MAX) return false;
  return /^[a-zA-Z0-9_.\-]+$/.test(username);
}

export type PasswordStrength = 'weak' | 'fair' | 'strong' | 'very-strong';

export interface PasswordCheck {
  valid: boolean;
  strength: PasswordStrength;
  issues: string[];
}

/**
 * Password strength checker.
 * Minimum: 8 chars with at least one letter and one number.
 * Bonus score for uppercase, special chars, longer length.
 */
export function checkPassword(password: string): PasswordCheck {
  const issues: string[] = [];
  let score = 0;

  if (password.length < LIMITS.PASSWORD_MIN) {
    issues.push(`At least ${LIMITS.PASSWORD_MIN} characters required.`);
  } else {
    score += 1;
    if (password.length >= 12) score += 1;
    if (password.length >= 16) score += 1;
  }

  if (!/[a-zA-Z]/.test(password)) {
    issues.push('Must contain at least one letter.');
  } else {
    score += 1;
  }

  if (!/[0-9]/.test(password)) {
    issues.push('Must contain at least one number.');
  } else {
    score += 1;
  }

  if (/[A-Z]/.test(password)) score += 1;
  if (/[^a-zA-Z0-9]/.test(password)) score += 1;

  const strength: PasswordStrength =
    score >= 6 ? 'very-strong' :
    score >= 4 ? 'strong' :
    score >= 2 ? 'fair' : 'weak';

  return { valid: issues.length === 0, strength, issues };
}

// ─── Auth error normalisation ─────────────────────────────────────────────────
// Supabase returns raw error messages that can reveal implementation detail.
// We map known messages to safe user-facing ones.

const AUTH_ERROR_MAP: Record<string, string> = {
  'invalid login credentials':    'Incorrect email or password.',
  'invalid credentials':          'Incorrect email or password.',
  'email not confirmed':          'Please verify your email address before signing in.',
  'user already registered':      'An account with this email already exists.',
  'email already in use':         'An account with this email already exists.',
  'password should be at least':  `Password must be at least ${LIMITS.PASSWORD_MIN} characters.`,
  'signup is disabled':           'New registrations are temporarily disabled. Please try again later.',
  'rate limit':                   'Too many attempts. Please wait a moment and try again.',
  'email rate limit exceeded':    'Too many email requests. Please wait a few minutes.',
  'invalid email':                'Please enter a valid email address.',
  'weak password':                'Your password is too weak. Add numbers, uppercase letters, or symbols.',
  'jwt expired':                  'Your session has expired. Please sign in again.',
  'token expired':                'Your verification link has expired. Please request a new one.',
  'invalid token':                'This verification link is invalid or has already been used.',
  'user not found':               'No account found with this email address.',
  'oauth error':                  'Sign-in with this provider failed. Please try again.',
  'provider disabled':            'This sign-in method is not available right now.',
  'network':                      'Network error. Please check your connection and try again.',
};

export function normalizeAuthError(error: unknown): string {
  const raw = (error instanceof Error ? error.message : String(error)).toLowerCase();

  for (const [pattern, friendly] of Object.entries(AUTH_ERROR_MAP)) {
    if (raw.includes(pattern)) return friendly;
  }

  // Generic fallback — never expose raw server messages
  if (raw.includes('fetch') || raw.includes('network') || raw.includes('failed to fetch')) {
    return 'Network error. Please check your connection and try again.';
  }

  return 'Something went wrong. Please try again.';
}

// ─── Client-side rate limiter ─────────────────────────────────────────────────
// In-memory, per-key tracking. Resets on page reload (intentional — persistent
// rate limiting is done server-side by Supabase; this is a UX guard layer).

interface RateLimitEntry {
  attempts: number;
  lockedUntil: number | null;
  lastAttempt: number;
}

const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const RATE_LIMIT_MAX = 5;                      // max attempts per window
const BACKOFF_BASE_MS = 30_000;               // 30 s for first lockout

class ClientRateLimiterImpl {
  private store = new Map<string, RateLimitEntry>();

  /** Returns null if allowed, or an error string with seconds remaining if locked. */
  check(key: string): { allowed: boolean; secondsRemaining: number } {
    const now = Date.now();
    const entry = this.store.get(key);

    if (!entry) return { allowed: true, secondsRemaining: 0 };

    // If locked, check if lockout has expired
    if (entry.lockedUntil !== null) {
      if (now < entry.lockedUntil) {
        return {
          allowed: false,
          secondsRemaining: Math.ceil((entry.lockedUntil - now) / 1000),
        };
      }
      // Lockout expired — reset
      this.store.delete(key);
      return { allowed: true, secondsRemaining: 0 };
    }

    // Outside window — allow and reset
    if (now - entry.lastAttempt > RATE_LIMIT_WINDOW_MS) {
      this.store.delete(key);
      return { allowed: true, secondsRemaining: 0 };
    }

    return { allowed: true, secondsRemaining: 0 };
  }

  /** Record a failed attempt. Call this after a failed auth operation. */
  recordFailure(key: string): void {
    const now = Date.now();
    const entry = this.store.get(key) ?? { attempts: 0, lockedUntil: null, lastAttempt: now };
    entry.attempts += 1;
    entry.lastAttempt = now;

    if (entry.attempts >= RATE_LIMIT_MAX) {
      // Exponential backoff: 30s, 60s, 120s …
      const backoffMultiplier = Math.pow(2, entry.attempts - RATE_LIMIT_MAX);
      entry.lockedUntil = now + BACKOFF_BASE_MS * backoffMultiplier;
    }

    this.store.set(key, entry);
  }

  /** Call after a successful auth to reset the counter. */
  reset(key: string): void {
    this.store.delete(key);
  }
}

export const loginRateLimiter = new ClientRateLimiterImpl();

// ─── Safe redirect validation ─────────────────────────────────────────────────

const ALLOWED_PATHS = new Set(['/dashboard', '/auth/callback', '/login', '/register', '/']);

/**
 * Validates that an OAuth redirect URL uses the same origin and a known safe path.
 * Prevents open-redirect attacks where an attacker crafts a malicious redirectTo.
 */
export function safeOAuthRedirect(path = '/auth/callback'): string {
  // Always enforce same origin — never allow external redirects
  const safePath = ALLOWED_PATHS.has(path) ? path : '/auth/callback';
  return `${window.location.origin}${safePath}`;
}

// ─── Realtime payload validator ───────────────────────────────────────────────

/**
 * Validates a realtime payload has the expected shape before processing.
 * Guards against crafted WebSocket messages or prototype pollution.
 */
export function isValidRealtimePayload<T extends Record<string, unknown>>(
  payload: unknown,
  requiredKeys: (keyof T)[],
): payload is { new: T } {
  if (
    typeof payload !== 'object' ||
    payload === null ||
    !Object.prototype.hasOwnProperty.call(payload, 'new') ||
    typeof (payload as { new: unknown }).new !== 'object' ||
    (payload as { new: unknown }).new === null
  ) {
    return false;
  }

  const record = (payload as { new: Record<string, unknown> }).new;

  // Block prototype pollution
  if (Object.prototype.hasOwnProperty.call(record, '__proto__') ||
      Object.prototype.hasOwnProperty.call(record, 'constructor') ||
      Object.prototype.hasOwnProperty.call(record, 'prototype')) {
    return false;
  }

  return requiredKeys.every(k => k in record);
}

// ─── Whitelisted DB update fields ────────────────────────────────────────────

/** Fields a user is permitted to update on their own server record. */
export const SERVER_UPDATE_WHITELIST = new Set([
  'server_name', 'ai_mode', 'status',
] as const);

export type SafeServerUpdate = { server_name?: string; ai_mode?: string; status?: 'online' | 'offline' | 'maintenance' };

/** Strip any fields not in the whitelist before sending to Supabase. */
export function sanitizeServerUpdate(updates: Record<string, unknown>): SafeServerUpdate {
  const safe: SafeServerUpdate = {};
  if (typeof updates.server_name === 'string') {
    safe.server_name = sanitizeText(updates.server_name, LIMITS.SERVER_NAME_MAX);
  }
  if (typeof updates.ai_mode === 'string') {
    safe.ai_mode = sanitizeText(updates.ai_mode, 64);
  }
  if (updates.status === 'online' || updates.status === 'offline' || updates.status === 'maintenance') {
    safe.status = updates.status;
  }
  return safe;
}
