import { Router } from "express";
import { eq, and, desc } from "drizzle-orm";
import { z } from "zod";
import { db, activityFeed } from "@workspace/db";
import { requireAuth } from "../middlewares/auth";
import { asyncHandler } from "../lib/async-handler";
import { validate } from "../lib/validate";
import { writeLimiter } from "../middlewares/rate-limit";

const router = Router();

// ── Validation schemas ────────────────────────────────────────────────────────

const listQuery = z.object({
  serverId: z.string().uuid().optional(),
  limit:    z.coerce.number().int().min(1).max(100).default(50),
  offset:   z.coerce.number().int().min(0).default(0),
});

const createBody = z.object({
  serverId:  z.string().uuid().nullable().optional(),
  eventType: z.string().min(1).max(64),
  channel:   z.string().max(128).nullable().optional(),
  actor:     z.string().max(128).nullable().optional(),
  details:   z.string().max(1024).default(""),
}).strict();

// ── GET /api/activity-feed ────────────────────────────────────────────────────
router.get(
  "/",
  requireAuth,
  validate(listQuery, "query"),
  asyncHandler(async (req, res) => {
    const { serverId, limit, offset } =
      req.query as unknown as z.infer<typeof listQuery>;

    const conditions = [eq(activityFeed.userId, req.userId)];
    if (serverId) conditions.push(eq(activityFeed.serverId, serverId));

    const rows = await db
      .select()
      .from(activityFeed)
      .where(and(...conditions))
      .orderBy(desc(activityFeed.createdAt))
      .limit(limit)
      .offset(offset);

    res.json(rows);
  }),
);

// ── POST /api/activity-feed ───────────────────────────────────────────────────
router.post(
  "/",
  requireAuth,
  writeLimiter,
  validate(createBody),
  asyncHandler(async (req, res) => {
    const { serverId, eventType, channel, actor, details } =
      req.body as z.infer<typeof createBody>;

    const [row] = await db
      .insert(activityFeed)
      .values({
        userId:    req.userId,
        serverId:  serverId ?? null,
        eventType,
        channel:   channel ?? null,
        actor:     actor ?? null,
        details:   details ?? "",
      })
      .returning();

    res.status(201).json(row);
  }),
);

export default router;
