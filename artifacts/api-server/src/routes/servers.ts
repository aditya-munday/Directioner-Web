import { Router } from "express";
import { eq, and } from "drizzle-orm";
import { z } from "zod";
import { db, servers } from "@workspace/db";
import { requireAuth } from "../middlewares/auth";
import { asyncHandler } from "../lib/async-handler";
import { validate } from "../lib/validate";
import { AppError, notFoundError } from "../lib/errors";
import { writeLimiter } from "../middlewares/rate-limit";

const router = Router();

// ── Validation schemas ────────────────────────────────────────────────────────

const uuidParam = z.object({ id: z.string().uuid("id must be a valid UUID") });

const createBody = z.object({
  serverName:       z.string().min(1).max(128),
  discordServerId:  z.string().min(1).max(64),
  memberCount:      z.number().int().min(0).default(0),
  channelCount:     z.number().int().min(0).default(0),
  status:           z.enum(["online", "offline", "maintenance"]).default("online"),
  tier:             z.string().default("free"),
  aiMode:           z.string().default("chat"),
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
  validate(createBody),
  asyncHandler(async (req, res) => {
    const body = req.body as z.infer<typeof createBody>;

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
  validate(uuidParam, "params"),
  validate(patchBody),
  asyncHandler(async (req, res) => {
    const body = req.body as z.infer<typeof patchBody>;

    if (Object.keys(body).length === 0) {
      throw new AppError(400, "No fields to update");
    }

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
