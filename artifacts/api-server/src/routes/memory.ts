import { Router } from "express";
import { eq, and, desc } from "drizzle-orm";
import { z } from "zod";
import { db, memoryNodes } from "@workspace/db";
import { requireAuth } from "../middlewares/auth";
import { asyncHandler } from "../lib/async-handler";
import { validate } from "../lib/validate";
import { notFoundError } from "../lib/errors";
import { writeLimiter, perUserWriteLimiter } from "../middlewares/rate-limit";

const router = Router();

// ── Validation schemas ────────────────────────────────────────────────────────

const uuidParam = z.object({ id: z.string().uuid("id must be a valid UUID") });

const listQuery = z.object({
  serverId: z.string().uuid().optional(),
  limit:    z.coerce.number().int().min(1).max(200).default(50),
  offset:   z.coerce.number().int().min(0).default(0),
});

const createBody = z.object({
  serverId:   z.string().uuid().nullable().optional(),
  content:    z.string().min(1).max(4096).trim(),
  scope:      z.enum(["user", "server", "global"]).default("server"),
  targetUser: z.string().max(128).trim().nullable().optional(),
}).strict();

// ── GET /api/memory-nodes ─────────────────────────────────────────────────────
router.get(
  "/",
  requireAuth,
  validate(listQuery, "query"),
  asyncHandler(async (req, res) => {
    const { serverId, limit, offset } =
      req.query as unknown as z.infer<typeof listQuery>;

    const conditions = [eq(memoryNodes.userId, req.userId)];
    if (serverId) conditions.push(eq(memoryNodes.serverId, serverId));

    const rows = await db
      .select()
      .from(memoryNodes)
      .where(and(...conditions))
      .orderBy(desc(memoryNodes.createdAt))
      .limit(limit)
      .offset(offset);

    res.json(rows);
  }),
);

// ── POST /api/memory-nodes ────────────────────────────────────────────────────
router.post(
  "/",
  requireAuth,
  writeLimiter,
  perUserWriteLimiter,
  validate(createBody),
  asyncHandler(async (req, res) => {
    const { serverId, content, scope, targetUser } =
      req.body as z.infer<typeof createBody>;

    const [row] = await db
      .insert(memoryNodes)
      .values({
        userId:     req.userId,
        serverId:   serverId ?? null,
        content,
        scope:      scope ?? "server",
        targetUser: targetUser ?? null,
      })
      .returning();

    res.status(201).json(row);
  }),
);

// ── DELETE /api/memory-nodes/:id ──────────────────────────────────────────────
router.delete(
  "/:id",
  requireAuth,
  writeLimiter,
  perUserWriteLimiter,
  validate(uuidParam, "params"),
  asyncHandler(async (req, res) => {
    // Ownership enforced by requiring matching userId
    const [row] = await db
      .delete(memoryNodes)
      .where(
        and(
          eq(memoryNodes.id, req.params.id as string),
          eq(memoryNodes.userId, req.userId),
        ),
      )
      .returning();

    if (!row) throw notFoundError("Memory node not found");
    res.status(204).send();
  }),
);

// ── DELETE /api/memory-nodes (all for user) ───────────────────────────────────
router.delete(
  "/",
  requireAuth,
  writeLimiter,
  perUserWriteLimiter,
  asyncHandler(async (req, res) => {
    await db
      .delete(memoryNodes)
      .where(eq(memoryNodes.userId, req.userId));

    res.status(204).send();
  }),
);

export default router;
