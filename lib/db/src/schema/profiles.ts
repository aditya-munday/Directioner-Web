import { pgTable, uuid, text, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const profiles = pgTable("profiles", {
  id: uuid("id").primaryKey().notNull(),
  username: text("username").notNull().default("user"),
  fullName: text("full_name"),
  avatarUrl: text("avatar_url"),
  tier: text("tier", { enum: ["free", "basic", "pro", "max"] })
    .notNull()
    .default("free"),
  creditsUsed: integer("credits_used").notNull().default(0),
  creditsLimit: integer("credits_limit").notNull().default(500),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const insertProfileSchema = createInsertSchema(profiles);
export const selectProfileSchema = createSelectSchema(profiles);
export const updateProfileSchema = insertProfileSchema
  .omit({ id: true, createdAt: true })
  .partial();

export type Profile = typeof profiles.$inferSelect;
export type InsertProfile = z.infer<typeof insertProfileSchema>;
export type UpdateProfile = z.infer<typeof updateProfileSchema>;
