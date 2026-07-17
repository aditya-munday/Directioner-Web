import { pgTable, uuid, integer, timestamp, date, unique } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { profiles } from "./profiles";
import { servers } from "./servers";

export const analyticsDaily = pgTable(
  "analytics_daily",
  {
    id: uuid("id").primaryKey().defaultRandom().notNull(),
    userId: uuid("user_id")
      .notNull()
      .references(() => profiles.id, { onDelete: "cascade" }),
    serverId: uuid("server_id").references(() => servers.id, {
      onDelete: "set null",
    }),
    date: date("date").notNull(),
    textMessages: integer("text_messages").notNull().default(0),
    voiceMinutes: integer("voice_minutes").notNull().default(0),
    credits: integer("credits").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [unique().on(t.userId, t.serverId, t.date)],
);

export const insertAnalyticsSchema = createInsertSchema(analyticsDaily).omit({
  id: true,
  createdAt: true,
});
export const selectAnalyticsSchema = createSelectSchema(analyticsDaily);

export type AnalyticsEntry = typeof analyticsDaily.$inferSelect;
export type InsertAnalytics = z.infer<typeof insertAnalyticsSchema>;
