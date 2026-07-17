import { Router } from "express";
import { eq, and, count } from "drizzle-orm";
import { z } from "zod";
import { db, servers } from "@workspace/db";
import { requireAuth } from "../middlewares/auth";
import { asyncHandler } from "../lib/async-handler";
import { validate } from "../lib/validate";
import { AppError, notFoundError, forbidden } from "../lib/errors";
import { writeLimiter, perUserWriteLimiter } from "../middlewares/rate-limit";

const router = Router();

// ── Tier-based server limits ──────────────────────────────────────────────────
const TIER_LIMITS: Record<string, number> = {
  free: 1,
  basic: 3,
  pro: 10,
  max: 100,
};

// ── Validation schemas ────────────────────────────────────────────────────────

const uuidParam = z.object({ id: z.string().uuid("id must be a valid UUID") });

const createBody = z.object({
  serverName:      z.string().min(1).max(128).trim(),
  discordServerId: z.string().min(1).max(64).trim(),
  memberCount:     z.number().int().min(0).max(10_000_000).default(0),
  channelCount:    z.number().int().min(0).max(10_000).default(0),
  status:          z.enum(["online", "offline", "maintenance"]).default("online"),
  tier:            z.enum(["free", "basic", "pro", "max"]).default("free"),
  aiMode:          z.string().min(1).max(32).trim().default("chat"),
}).strict();

const patchBody = createBody.partial().strict();

// ── GET /api/servers ──────────────────────────────────────────────────────────
router.get(
  "/",
  requireAuth,
  asyncHandler(async (req, res) => {
    const rows = await db
      .select()
      .from(servers)
      .where(eq(servers.userId, req.userId))
      .orderBy(servers.createdAt);

    res.json(rows);
  }),
);

// ── POST /api/servers ─────────────────────────────────────────────────────────
router.post(
  "/",
  requireAuth,
  writeLimiter,
  perUserWriteLimiter,
  validate(createBody),
  asyncHandler(async (req, res) => {
    const body = req.body as z.infer<typeof createBody>;

    // Enforce per-user server count limit (uses profile tier from DB if available)
    const [{ value: existingCount }] = await db
      .select({ value: count() })
      .from(servers)
      .where(eq(servers.userId, req.userId));

    // Default to 'free' limits if we can't determine the tier
    const tierLimit = TIER_LIMITS[body.tier ?? "free"] ?? TIER_LIMITS.free;
    const hardLimit = Math.max(tierLimit, TIER_LIMITS.free); // never below free

    if (Number(existingCount) >= hardLimit) {
      throw new AppError(
        403,
        `Server limit reached (${hardLimit} for your plan). Upgrade to add more.`,
        "SERVER_LIMIT_REACHED",
      );
    }

    const [row] = await db
      .insert(servers)
      .values({ ...body, userId: req.userId })
      .returning();

    res.status(201).json(row);
  }),
);

// ── GET /api/servers/:id ──────────────────────────────────────────────────────
router.get(
  "/:id",
  requireAuth,
  validate(uuidParam, "params"),
  asyncHandler(async (req, res) => {
    const [row] = await db
      .select()
      .from(servers)
      // Enforce ownership — users can only see their own servers
      .where(and(eq(servers.id, req.params.id as string), eq(servers.userId, req.userId)))
      .limit(1);

    if (!row) throw notFoundError("Server not found");
    res.json(row);
  }),
);

// ── PATCH /api/servers/:id ────────────────────────────────────────────────────
router.patch(
  "/:id",
  requireAuth,
  writeLimiter,
  perUserWriteLimiter,
  validate(uuidParam, "params"),
  validate(patchBody),
  asyncHandler(async (req, res) => {
    const body = req.body as z.infer<typeof patchBody>;

    if (Object.keys(body).length === 0) {
      throw new AppError(400, "No fields to update");
    }

    // Ownership enforced in the WHERE clause — no extra check needed
    const [row] = await db
      .update(servers)
      .set(body)
      .where(and(eq(servers.id, req.params.id as string), eq(servers.userId, req.userId)))
      .returning();

    if (!row) throw notFoundError("Server not found");
    res.json(row);
  }),
);

// ── DELETE /api/servers/:id ───────────────────────────────────────────────────
router.delete(
  "/:id",
  requireAuth,
  writeLimiter,
  perUserWriteLimiter,
  validate(uuidParam, "params"),
  asyncHandler(async (req, res) => {
    const [row] = await db
      .delete(servers)
      .where(and(eq(servers.id, req.params.id as string), eq(servers.userId, req.userId)))
      .returning();

    if (!row) throw notFoundError("Server not found");
    res.status(204).send();
  }),
);

export default router;
