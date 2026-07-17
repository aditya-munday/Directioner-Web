import { pgTable, uuid, text, numeric, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { profiles } from "./profiles";

export const billingHistory = pgTable("billing_history", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  userId: uuid("user_id")
    .notNull()
    .references(() => profiles.id, { onDelete: "cascade" }),
  amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
  status: text("status", { enum: ["paid", "pending", "failed", "refunded"] })
    .notNull()
    .default("paid"),
  description: text("description"),
  invoiceUrl: text("invoice_url"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const insertBillingSchema = createInsertSchema(billingHistory).omit({
  id: true,
  createdAt: true,
});
export const selectBillingSchema = createSelectSchema(billingHistory);

export type BillingEntry = typeof billingHistory.$inferSelect;
export type InsertBilling = z.infer<typeof insertBillingSchema>;
