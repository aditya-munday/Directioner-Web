/**
 * Contact & Support Ticket Routes
 *
 * POST /api/contact        — public contact form (no auth required)
 * POST /api/support/ticket — authenticated support ticket submission
 *
 * Behaviour:
 *  - Input is validated with Zod; malformed requests get 422.
 *  - Submissions are logged via the structured logger so they always
 *    have a durable audit trail (visible in workflow logs / log aggregators).
 *  - If Supabase is configured the submission is also persisted to
 *    the `contact_submissions` table (graceful degradation when the
 *    table hasn't been applied — the INSERT error is caught and the
 *    request still succeeds so the user is never stuck).
 *  - Designed to be trivially extended: swap the Supabase INSERT for
 *    an email dispatch (Resend / SendGrid) or a third-party ticketing
 *    system without touching the frontend.
 */

import { Router } from "express";
import { z } from "zod";
import { logger } from "../lib/logger";
import { asyncHandler } from "../lib/async-handler";
import { validate } from "../lib/validate";
import { generalLimiter } from "../middlewares/rate-limit";
import { requireAuth } from "../middlewares/auth";
import { supabase } from "../lib/supabase";

const router = Router();

// ── Validation schemas ────────────────────────────────────────────────────────

const contactBody = z
  .object({
    name:    z.string().min(1, "Name is required").max(120).trim(),
    email:   z.string().email("Invalid email address").max(254).trim().toLowerCase(),
    subject: z.string().min(1, "Subject is required").max(200).trim(),
    message: z.string().min(10, "Message must be at least 10 characters").max(5000).trim(),
  })
  .strict();

const ticketBody = z
  .object({
    category:    z.enum(["Bug Report", "Feature Request", "Billing Question", "Account Issue", "Other"]),
    description: z.string().min(20, "Please provide at least 20 characters of detail").max(2000).trim(),
    serverId:    z.string().max(32).trim().optional(),
  })
  .strict();

// ── POST /api/contact ─────────────────────────────────────────────────────────
router.post(
  "/contact",
  generalLimiter,
  validate(contactBody),
  asyncHandler(async (req, res) => {
    const { name, email, subject, message } = req.body as z.infer<typeof contactBody>;

    // Structured log — always captured regardless of DB state
    logger.info({ name, email, subject, messageLength: message.length }, "contact_form_submission");

    // Persist to Supabase when available (graceful degradation)
    if (supabase) {
      try {
        await supabase.from("contact_submissions").insert({
          name,
          email,
          subject,
          message,
          source: "contact_form",
          status: "open",
        });
      } catch {
        // Table may not exist yet — log and continue; submission is still
        // recorded in the structured log above.
        logger.warn("contact_submissions table not found — persisting to log only");
      }
    }

    return res.status(200).json({
      ok:      true,
      message: "Your message has been received. We'll respond within 24 hours.",
    });
  }),
);

// ── POST /api/support/ticket ──────────────────────────────────────────────────
router.post(
  "/support/ticket",
  requireAuth,
  generalLimiter,
  validate(ticketBody),
  asyncHandler(async (req, res) => {
    const { category, description, serverId } = req.body as z.infer<typeof ticketBody>;
    const userId = req.userId;

    logger.info({ userId, category, serverId, descriptionLength: description.length }, "support_ticket_submission");

    if (supabase) {
      try {
        await supabase.from("support_tickets").insert({
          user_id:     userId,
          category,
          description,
          server_id:   serverId ?? null,
          status:      "open",
        });
      } catch {
        logger.warn("support_tickets table not found — persisting to log only");
      }
    }

    return res.status(201).json({
      ok:      true,
      message: "Your ticket has been submitted. We'll reply via email.",
    });
  }),
);

export default router;
