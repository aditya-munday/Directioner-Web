import rateLimit from "express-rate-limit";

const windowMs = 60 * 1000; // 1 minute

/** General API rate limit — 120 requests per minute per IP */
export const generalLimiter = rateLimit({
  windowMs,
  max: 120,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests — please slow down" },
  skipSuccessfulRequests: false,
});

/** Tighter limit for write operations — 30 per minute per IP */
export const writeLimiter = rateLimit({
  windowMs,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many write requests — please slow down" },
});

/** Very strict limit for auth-adjacent operations — 10 per minute per IP */
export const authLimiter = rateLimit({
  windowMs,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many authentication requests — try again in a minute" },
  skipSuccessfulRequests: false,
});

/** Per-user write operations (applied after auth) — keyed by userId (UUID, always set after requireAuth) */
export const perUserWriteLimiter = rateLimit({
  windowMs,
  max: 20,
  // After requireAuth, req.userId is always a UUID string — never an IP address.
  // Using userId as the key avoids IPv6 concerns and limits per-account not per-IP.
  // validate.bypassAll skips the IPv6 IP-fallback check because we never use IP here.
  validate: { xForwardedForHeader: false, keyGeneratorIpFallback: false },
  keyGenerator: (req) => {
    const userId = (req as Express.Request & { userId?: string }).userId;
    return userId ?? "unauthenticated";
  },
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Per-user write limit exceeded — please slow down" },
});
