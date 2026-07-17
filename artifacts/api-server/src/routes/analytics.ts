import { Router } from "express";
import { eq, and, gte, lte, sql, isNull } from "drizzle-orm";
import { z } from "zod";
import { db, analyticsDaily } from "@workspace/db";
import { requireAuth } from "../middlewares/auth";
import { asyncHandler } from "../lib/async-handler";
import { validate } from "../lib/validate";
import { writeLimiter, perUserWriteLimiter } from "../middlewares/rate-limit";

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
  textMessages: z.number().int().min(0).max(1_000_000).default(0),
  voiceMinutes: z.number().int().min(0).max(1_440).default(0),
  credits:      z.number().int().min(0).max(1_000_000).default(0),
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
//
// NOTE: PostgreSQL treats NULLs as distinct in unique constraints, so a
// standard onConflictDoUpdate with serverId=NULL will never match an existing
// row. We handle the NULL case with a manual SELECT → UPDATE → INSERT to get
// correct accumulation behaviour.
router.post(
  "/",
  requireAuth,
  writeLimiter,
  perUserWriteLimiter,
  validate(createBody),
  asyncHandler(async (req, res) => {
    const { serverId, date, textMessages, voiceMinutes, credits } =
      req.body as z.infer<typeof createBody>;

    const txMessages = textMessages ?? 0;
    const txVoice    = voiceMinutes ?? 0;
    const txCredits  = credits ?? 0;
    const sid        = serverId ?? null;

    // ── NULL-serverId path: manual upsert ──────────────────────────────────
    if (sid === null) {
      const [existing] = await db
        .select({ id: analyticsDaily.id })
        .from(analyticsDaily)
        .where(
          and(
            eq(analyticsDaily.userId, req.userId),
            isNull(analyticsDaily.serverId),
            eq(analyticsDaily.date, date),
          ),
        )
        .limit(1);

      if (existing) {
        const [updated] = await db
          .update(analyticsDaily)
          .set({
            textMessages: sql`${analyticsDaily.textMessages} + ${txMessages}`,
            voiceMinutes: sql`${analyticsDaily.voiceMinutes} + ${txVoice}`,
            credits:      sql`${analyticsDaily.credits} + ${txCredits}`,
          })
          .where(eq(analyticsDaily.id, existing.id))
          .returning();
        return res.status(200).json(updated);
      }

      const [inserted] = await db
        .insert(analyticsDaily)
        .values({
          userId:       req.userId,
          serverId:     null,
          date,
          textMessages: txMessages,
          voiceMinutes: txVoice,
          credits:      txCredits,
        })
        .returning();
      return res.status(201).json(inserted);
    }

    // ── Non-null serverId: standard upsert on unique index ─────────────────
    const [row] = await db
      .insert(analyticsDaily)
      .values({
        userId:       req.userId,
        serverId:     sid,
        date,
        textMessages: txMessages,
        voiceMinutes: txVoice,
        credits:      txCredits,
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

    return res.status(201).json(row);
  }),
);

export default router;
