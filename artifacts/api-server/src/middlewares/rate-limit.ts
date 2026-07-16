import rateLimit from "express-rate-limit";

const windowMs = 60 * 1000; // 1 minute

/** General API rate limit — 120 requests per minute */
export const generalLimiter = rateLimit({
  windowMs,
  max: 120,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests — please slow down" },
});

/** Tighter limit for write operations — 30 per minute */
export const writeLimiter = rateLimit({
  windowMs,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many write requests — please slow down" },
});
