import { pgTable, uuid, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { profiles } from "./profiles";
import { servers } from "./servers";

export const activityFeed = pgTable("activity_feed", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  userId: uuid("user_id")
    .notNull()
    .references(() => profiles.id, { onDelete: "cascade" }),
  serverId: uuid("server_id").references(() => servers.id, {
    onDelete: "set null",
  }),
  eventType: text("event_type").notNull(),
  channel: text("channel"),
  actor: text("actor"),
  details: text("details").notNull().default(""),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const insertActivitySchema = createInsertSchema(activityFeed).omit({
  id: true,
  createdAt: true,
});
export const selectActivitySchema = createSelectSchema(activityFeed);

export type ActivityEntry = typeof activityFeed.$inferSelect;
export type InsertActivity = z.infer<typeof insertActivitySchema>;
