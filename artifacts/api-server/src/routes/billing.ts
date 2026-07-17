import { Router } from "express";
import { eq, desc } from "drizzle-orm";
import { createHmac } from "crypto";
import Razorpay from "razorpay";
import { z } from "zod";
import { db, billingHistory } from "@workspace/db";
import { requireAuth } from "../middlewares/auth";
import { asyncHandler } from "../lib/async-handler";
import { validate } from "../lib/validate";
import { AppError } from "../lib/errors";
import { writeLimiter, perUserWriteLimiter, authLimiter } from "../middlewares/rate-limit";
import { env } from "../lib/env";
import { supabase } from "../lib/supabase";

const router = Router();

// ── Razorpay client (lazy — only instantiated when keys are present) ──────────
function getRazorpay(): Razorpay {
  if (!env.RAZORPAY_KEY_ID || !env.RAZORPAY_KEY_SECRET) {
    throw new AppError(503, "Payment processing is not configured. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET.");
  }
  return new Razorpay({
    key_id:     env.RAZORPAY_KEY_ID,
    key_secret: env.RAZORPAY_KEY_SECRET,
  });
}

// ── Plan definitions (source of truth for pricing) ────────────────────────────
const PLANS = {
  basic: { priceINR: 415,  credits: 5000,   creditsLimit: 5000   },
  pro:   { priceINR: 1249, credits: 25000,  creditsLimit: 25000  },
  max:   { priceINR: 3333, credits: 9999999, creditsLimit: 9999999 },
} as const;

const COUPONS: Record<string, number> = {
  DISCORD20: 20,
  BETA10:    10,
  FREEPRO:   100,
};

// ── Validation schemas ────────────────────────────────────────────────────────
const listQuery = z.object({
  limit:  z.coerce.number().int().min(1).max(100).default(24),
  offset: z.coerce.number().int().min(0).default(0),
});

const createOrderBody = z.object({
  planId:     z.enum(["basic", "pro", "max"]),
  couponCode: z.string().max(32).trim().toUpperCase().optional(),
}).strict();

const verifyBody = z.object({
  razorpay_order_id:   z.string().min(1).max(64),
  razorpay_payment_id: z.string().min(1).max(64),
  razorpay_signature:  z.string().min(1).max(256),
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

    const normalized = rows.map((r) => ({
      ...r,
      amount: parseFloat(r.amount as unknown as string),
    }));

    res.json(normalized);
  }),
);

// ── POST /api/billing/create-order ────────────────────────────────────────────
// Creates a Razorpay order server-side (amount cannot be tampered by client).
router.post(
  "/create-order",
  requireAuth,
  authLimiter,
  writeLimiter,
  validate(createOrderBody),
  asyncHandler(async (req, res) => {
    const { planId, couponCode } = req.body as z.infer<typeof createOrderBody>;
    const rzp = getRazorpay();
    const plan = PLANS[planId];

    // Apply coupon discount
    let priceINR = plan.priceINR;
    if (couponCode && COUPONS[couponCode] !== undefined) {
      priceINR = Math.round(priceINR * (1 - COUPONS[couponCode] / 100));
    }

    // Razorpay amounts are in paise (1 INR = 100 paise)
    const amountPaise = Math.round(priceINR * 100);

    // If coupon makes it free, skip Razorpay
    if (amountPaise === 0) {
      return res.json({ free: true, planId });
    }

    const order = await rzp.orders.create({
      amount:   amountPaise,
      currency: "INR",
      receipt:  `dir_${req.userId.slice(0, 8)}_${Date.now()}`,
      notes: {
        userId:  req.userId,
        planId,
        coupon:  couponCode ?? "",
      },
    });

    // Persist the pending order for verification
    if (supabase) {
      await supabase.from("razorpay_orders").insert({
        user_id:           req.userId,
        razorpay_order_id: order.id,
        plan_id:           planId,
        amount_paise:      amountPaise,
        coupon_code:       couponCode ?? null,
        status:            "created",
      });
    }

    res.json({
      orderId:  order.id,
      amount:   amountPaise,
      currency: "INR",
      keyId:    env.RAZORPAY_KEY_ID,
      planId,
    });
  }),
);

// ── POST /api/billing/verify-payment ─────────────────────────────────────────
// Verifies Razorpay HMAC signature, upgrades tier, records billing row.
router.post(
  "/verify-payment",
  requireAuth,
  authLimiter,
  writeLimiter,
  validate(verifyBody),
  asyncHandler(async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body as z.infer<typeof verifyBody>;

    if (!env.RAZORPAY_KEY_SECRET) {
      throw new AppError(503, "Payment verification not configured.");
    }

    // ── 1. Verify HMAC-SHA256 signature ──────────────────────────────────────
    const expectedSig = createHmac("sha256", env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (expectedSig !== razorpay_signature) {
      throw new AppError(400, "Payment signature verification failed.");
    }

    // ── 2. Look up the pending order ─────────────────────────────────────────
    if (!supabase) throw new AppError(503, "Database not configured.");

    const { data: orderRow, error: orderErr } = await supabase
      .from("razorpay_orders")
      .select("*")
      .eq("razorpay_order_id", razorpay_order_id)
      .eq("user_id", req.userId)
      .eq("status", "created")
      .single();

    if (orderErr || !orderRow) {
      throw new AppError(404, "Order not found or already processed.");
    }

    // Check order hasn't expired
    if (new Date(orderRow.expires_at) < new Date()) {
      throw new AppError(410, "Order has expired. Please try again.");
    }

    const plan = PLANS[orderRow.plan_id as keyof typeof PLANS];
    if (!plan) throw new AppError(400, "Unknown plan.");

    const amountINR = orderRow.amount_paise / 100;

    // ── 3. Mark order paid (idempotency guard) ────────────────────────────────
    const { error: updateOrderErr } = await supabase
      .from("razorpay_orders")
      .update({ status: "paid", paid_at: new Date().toISOString() })
      .eq("razorpay_order_id", razorpay_order_id)
      .eq("status", "created"); // only update if still "created" — prevents double-processing

    if (updateOrderErr) throw new AppError(500, "Failed to record payment.");

    // ── 4. Upgrade user tier ──────────────────────────────────────────────────
    await supabase
      .from("profiles")
      .update({
        tier:          orderRow.plan_id,
        credits_limit: plan.creditsLimit,
        updated_at:    new Date().toISOString(),
      })
      .eq("id", req.userId);

    // ── 5. Record billing row ─────────────────────────────────────────────────
    await supabase.from("billing_history").insert({
      user_id:             req.userId,
      amount:              amountINR,
      status:              "paid",
      description:         `${orderRow.plan_id.charAt(0).toUpperCase() + orderRow.plan_id.slice(1)} Plan — Monthly`,
      razorpay_order_id,
      razorpay_payment_id,
    });

    res.json({
      success: true,
      planId:  orderRow.plan_id,
      message: `Successfully upgraded to ${orderRow.plan_id} plan`,
    });
  }),
);

// ── POST /api/billing/webhook ─────────────────────────────────────────────────
// Razorpay webhook endpoint — signature verified via X-Razorpay-Signature header.
// Register in Razorpay Dashboard → Webhooks → https://your-domain.com/api/billing/webhook
router.post(
  "/webhook",
  // Raw body needed for signature verification — use express.raw in app.ts for this route
  asyncHandler(async (req, res) => {
    const webhookSecret = env.RAZORPAY_KEY_SECRET;
    if (!webhookSecret) {
      return res.status(200).json({ received: true }); // Accept but ignore
    }

    const receivedSig = req.headers["x-razorpay-signature"] as string | undefined;
    const rawBody     = (req as unknown as { rawBody?: Buffer }).rawBody;

    if (!receivedSig || !rawBody) {
      return res.status(400).json({ error: "Missing signature or body" });
    }

    const expectedSig = createHmac("sha256", webhookSecret)
      .update(rawBody)
      .digest("hex");

    if (expectedSig !== receivedSig) {
      return res.status(400).json({ error: "Invalid webhook signature" });
    }

    const event = req.body as { event?: string; payload?: Record<string, unknown> };

    // Handle payment.captured — alternative to verify-payment for async flow
    if (event.event === "payment.captured") {
      // Payment details are in event.payload.payment.entity
      // The verify-payment endpoint is the primary flow; webhook is a safety net.
      // Log for now — implement idempotent processing as needed.
      console.info("[webhook] payment.captured received", JSON.stringify(event.payload ?? {}).slice(0, 256));
    }

    res.status(200).json({ received: true });
  }),
);

export default router;
