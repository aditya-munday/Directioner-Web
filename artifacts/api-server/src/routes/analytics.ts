import { Router } from "express";
import { eq, and, gte, lte, sql } from "drizzle-orm";
import { z } from "zod";
import { db, analyticsDaily } from "@workspace/db";
import { requireAuth } from "../middlewares/auth";
import { asyncHandler } from "../lib/async-handler";
import { validate } from "../lib/validate";
import { writeLimiter } from "../middlewares/rate-limit";

const router = Router();

// ── Validation schemas ────────────────────────────────────────────────────────

const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Must be YYYY-MM-DD");

const listQuery = z.object({
  serverId: z.string().uuid().optional(),
  from:     isoDate.optional(),
  to:       isoDate.optional(),
  limit:    z.coerce.number().int().min(1).max(365).default(90),
  offset:   z.coerce.number().int().min(0).default(0),
});

const createBody = z.object({
  serverId:     z.string().uuid().nullable().optional(),
  date:         isoDate,
  textMessages: z.number().int().min(0).default(0),
  voiceMinutes: z.number().int().min(0).default(0),
  credits:      z.number().int().min(0).default(0),
}).strict();

// ── GET /api/analytics ────────────────────────────────────────────────────────
router.get(
  "/",
  requireAuth,
  validate(listQuery, "query"),
  asyncHandler(async (req, res) => {
    const { serverId, from, to, limit, offset } =
      req.query as unknown as z.infer<typeof listQuery>;

    const conditions = [eq(analyticsDaily.userId, req.userId)];
    if (serverId) conditions.push(eq(analyticsDaily.serverId, serverId));
    if (from)     conditions.push(gte(analyticsDaily.date, from));
    if (to)       conditions.push(lte(analyticsDaily.date, to));

    const rows = await db
      .select()
      .from(analyticsDaily)
      .where(and(...conditions))
      .orderBy(analyticsDaily.date)
      .limit(limit)
      .offset(offset);

    res.json(rows);
  }),
);

// ── POST /api/analytics — upsert (accumulate on conflict) ────────────────────
router.post(
  "/",
  requireAuth,
  writeLimiter,
  validate(createBody),
  asyncHandler(async (req, res) => {
    const { serverId, date, textMessages, voiceMinutes, credits } =
      req.body as z.infer<typeof createBody>;

    const [row] = await db
      .insert(analyticsDaily)
      .values({
        userId:       req.userId,
        serverId:     serverId ?? null,
        date,
        textMessages: textMessages ?? 0,
        voiceMinutes: voiceMinutes ?? 0,
        credits:      credits ?? 0,
      })
      .onConflictDoUpdate({
        target: [analyticsDaily.userId, analyticsDaily.serverId, analyticsDaily.date],
        set: {
          textMessages: sql`${analyticsDaily.textMessages} + excluded.text_messages`,
          voiceMinutes: sql`${analyticsDaily.voiceMinutes} + excluded.voice_minutes`,
          credits:      sql`${analyticsDaily.credits} + excluded.credits`,
        },
      })
      .returning();

    res.status(201).json(row);
  }),
);

export default router;
