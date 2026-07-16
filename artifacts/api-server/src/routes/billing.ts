import { Router } from "express";
import { eq, desc } from "drizzle-orm";
import { z } from "zod";
import { db, billingHistory } from "@workspace/db";
import { requireAuth } from "../middlewares/auth";
import { asyncHandler } from "../lib/async-handler";
import { validate } from "../lib/validate";
import { writeLimiter } from "../middlewares/rate-limit";

const router = Router();

// ── Validation schemas ────────────────────────────────────────────────────────

const listQuery = z.object({
  limit:  z.coerce.number().int().min(1).max(100).default(24),
  offset: z.coerce.number().int().min(0).default(0),
});

const createBody = z.object({
  amount:      z.number().positive().multipleOf(0.01),
  status:      z.enum(["paid", "pending", "failed", "refunded"]).default("paid"),
  description: z.string().max(256).nullable().optional(),
  invoiceUrl:  z.string().url().nullable().optional(),
}).strict();

// ── GET /api/billing ──────────────────────────────────────────────────────────
router.get(
  "/",
  requireAuth,
  validate(listQuery, "query"),
  asyncHandler(async (req, res) => {
    const { limit, offset } = req.query as unknown as z.infer<typeof listQuery>;

    const rows = await db
      .select()
      .from(billingHistory)
      .where(eq(billingHistory.userId, req.userId))
      .orderBy(desc(billingHistory.createdAt))
      .limit(limit)
      .offset(offset);

    // Coerce numeric string amounts to floats for JSON consumers
    const normalized = rows.map((r) => ({
      ...r,
      amount: parseFloat(r.amount as unknown as string),
    }));

    res.json(normalized);
  }),
);

// ── POST /api/billing ─────────────────────────────────────────────────────────
router.post(
  "/",
  requireAuth,
  writeLimiter,
  validate(createBody),
  asyncHandler(async (req, res) => {
    const { amount, status, description, invoiceUrl } =
      req.body as z.infer<typeof createBody>;

    const [row] = await db
      .insert(billingHistory)
      .values({
        userId:      req.userId,
        amount:      amount.toFixed(2),
        status:      status ?? "paid",
        description: description ?? null,
        invoiceUrl:  invoiceUrl ?? null,
      })
      .returning();

    res.status(201).json({
      ...row,
      amount: parseFloat(row.amount as unknown as string),
    });
  }),
);

export default router;
