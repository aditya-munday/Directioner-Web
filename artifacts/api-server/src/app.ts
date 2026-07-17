import express, { type Express } from "express";
import cors from "cors";
import helmet from "helmet";
import pinoHttp from "pino-http";
import { env } from "./lib/env";
import { logger } from "./lib/logger";
import { errorHandler, notFoundHandler } from "./lib/errors";
import { generalLimiter } from "./middlewares/rate-limit";
import router from "./routes";

const app: Express = express();

// ── Trust proxy (needed for rate-limit IP detection behind Replit proxy) ──────
app.set("trust proxy", 1);

// ── Security headers (helmet) ─────────────────────────────────────────────────
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:", "https:"],
        connectSrc: ["'self'"],
        frameSrc: ["'none'"],
        objectSrc: ["'none'"],
        baseUri: ["'self'"],
        formAction: ["'self'"],
      },
    },
    crossOriginEmbedderPolicy: false, // allow Supabase realtime
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true,
    },
  }),
);

// Enforce JSON content-type for API consumers
app.use((_req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  next();
});

// ── Request logging ───────────────────────────────────────────────────────────
app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return { id: req.id, method: req.method, url: req.url?.split("?")[0] };
      },
      res(res) {
        return { statusCode: res.statusCode };
      },
    },
  }),
);

// ── CORS ──────────────────────────────────────────────────────────────────────
// In development: allow any origin (Replit proxies, localhost dev servers).
// In production: restrict to ALLOWED_ORIGIN or block if not set.
const allowedOrigins: string[] = [];

if (env.ALLOWED_ORIGIN) {
  allowedOrigins.push(...env.ALLOWED_ORIGIN.split(",").map((s) => s.trim()));
}

const corsOriginFn = (
  origin: string | undefined,
  callback: (err: Error | null, allow?: boolean) => void,
) => {
  if (env.NODE_ENV !== "production") {
    // Dev: allow everything (Replit preview, local tools, etc.)
    return callback(null, true);
  }
  if (!origin) {
    // Server-to-server or same-origin
    return callback(null, true);
  }
  if (allowedOrigins.length === 0) {
    return callback(new Error("CORS: no ALLOWED_ORIGIN configured in production"));
  }
  if (allowedOrigins.includes(origin)) {
    return callback(null, true);
  }
  return callback(new Error(`CORS: origin '${origin}' not allowed`));
};

app.use(
  cors({
    origin: corsOriginFn,
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
    maxAge: 86400, // 24 h preflight cache
  }),
);

// ── Body parsers ──────────────────────────────────────────────────────────────
app.use(express.json({ limit: "64kb" })); // tighter than 256kb
app.use(express.urlencoded({ extended: false, limit: "64kb" }));

// ── Global rate limit ─────────────────────────────────────────────────────────
app.use(generalLimiter);

// ── Routes ────────────────────────────────────────────────────────────────────
app.use("/api", router);

// ── 404 + error handler ───────────────────────────────────────────────────────
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
