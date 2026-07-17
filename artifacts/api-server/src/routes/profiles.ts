import { Router } from "express";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { db, profiles } from "@workspace/db";
import { requireAuth } from "../middlewares/auth";
import { asyncHandler } from "../lib/async-handler";
import { validate } from "../lib/validate";
import { AppError, forbidden, notFoundError } from "../lib/errors";
import { writeLimiter, perUserWriteLimiter } from "../middlewares/rate-limit";

const router = Router();

// ── Validation schemas ────────────────────────────────────────────────────────

const uuidParam = z.object({ id: z.string().uuid("id must be a valid UUID") });

const patchBody = z.object({
  username:     z.string().min(1).max(64).trim().optional(),
  fullName:     z.string().max(128).trim().nullable().optional(),
  avatarUrl:    z.string().url().max(2048).nullable().optional(),
  // Only internal/admin usage should change tier/credits — disallow in user-facing PATCH
  // tier:         z.enum(["free", "basic", "pro", "max"]).optional(),
  // creditsUsed:  z.number().int().min(0).optional(),
  // creditsLimit: z.number().int().min(0).optional(),
}).strict();

const syncBody = z.object({
  username:  z.string().min(1).max(64).trim().optional(),
  fullName:  z.string().max(128).trim().nullable().optional(),
  avatarUrl: z.string().url().max(2048).nullable().optional(),
});

// ── GET /api/profiles/me ──────────────────────────────────────────────────────
router.get(
  "/me",
  requireAuth,
  asyncHandler(async (req, res) => {
    const [profile] = await db
      .select()
      .from(profiles)
      .where(eq(profiles.id, req.userId))
      .limit(1);

    if (!profile) throw notFoundError("Profile not found");
    res.json(profile);
  }),
);

// ── POST /api/profiles/me/sync — upsert after OAuth login ────────────────────
router.post(
  "/me/sync",
  requireAuth,
  writeLimiter,
  perUserWriteLimiter,
  validate(syncBody),
  asyncHandler(async (req, res) => {
    const { username, fullName, avatarUrl } = req.body as z.infer<typeof syncBody>;

    const [profile] = await db
      .insert(profiles)
      .values({
        id:        req.userId,
        username:  username ?? "user",
        fullName:  fullName ?? null,
        avatarUrl: avatarUrl ?? null,
      })
      .onConflictDoUpdate({
        target: profiles.id,
        set: {
          ...(username  !== undefined && { username }),
          ...(fullName  !== undefined && { fullName }),
          ...(avatarUrl !== undefined && { avatarUrl }),
          updatedAt: new Date(),
        },
      })
      .returning();

    res.status(200).json(profile);
  }),
);

// ── GET /api/profiles/:id ─────────────────────────────────────────────────────
router.get(
  "/:id",
  requireAuth,
  validate(uuidParam, "params"),
  asyncHandler(async (req, res) => {
    // Users can only fetch their own profile
    if (req.params.id !== req.userId) throw forbidden();

    const [profile] = await db
      .select()
      .from(profiles)
      .where(eq(profiles.id, req.params.id))
      .limit(1);

    if (!profile) throw notFoundError("Profile not found");
    res.json(profile);
  }),
);

// ── PATCH /api/profiles/:id ───────────────────────────────────────────────────
router.patch(
  "/:id",
  requireAuth,
  writeLimiter,
  perUserWriteLimiter,
  validate(uuidParam, "params"),
  validate(patchBody),
  asyncHandler(async (req, res) => {
    // Users can only modify their own profile
    if (req.params.id !== req.userId) throw forbidden();

    const body = req.body as z.infer<typeof patchBody>;

    if (Object.keys(body).length === 0) {
      throw new AppError(400, "No fields to update");
    }

    const [updated] = await db
      .update(profiles)
      .set({ ...body, updatedAt: new Date() })
      .where(eq(profiles.id, req.params.id))
      .returning();

    if (!updated) throw notFoundError("Profile not found");
    res.json(updated);
  }),
);

export default router;
