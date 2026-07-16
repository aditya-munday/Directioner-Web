import express, { type Express } from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import { env } from "./lib/env";
import { logger } from "./lib/logger";
import { errorHandler, notFoundHandler } from "./lib/errors";
import { generalLimiter } from "./middlewares/rate-limit";
import router from "./routes";

const app: Express = express();

// ── Trust proxy (needed for rate-limit IP detection behind Replit proxy) ──────
app.set("trust proxy", 1);

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
const corsOrigin = env.ALLOWED_ORIGIN ?? (env.NODE_ENV === "production" ? false : "*");
app.use(
  cors({
    origin: corsOrigin,
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: corsOrigin !== "*",
  }),
);

// ── Body parsers ──────────────────────────────────────────────────────────────
app.use(express.json({ limit: "256kb" }));
app.use(express.urlencoded({ extended: true, limit: "256kb" }));

// ── Global rate limit ─────────────────────────────────────────────────────────
app.use(generalLimiter);

// ── Routes ────────────────────────────────────────────────────────────────────
app.use("/api", router);

// ── 404 + error handler ───────────────────────────────────────────────────────
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
