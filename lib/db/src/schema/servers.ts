import { pgTable, uuid, text, integer, timestamp, unique } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { profiles } from "./profiles";

export const servers = pgTable(
  "servers",
  {
    id: uuid("id").primaryKey().defaultRandom().notNull(),
    userId: uuid("user_id")
      .notNull()
      .references(() => profiles.id, { onDelete: "cascade" }),
    serverName: text("server_name").notNull(),
    discordServerId: text("discord_server_id").notNull(),
    memberCount: integer("member_count").notNull().default(0),
    channelCount: integer("channel_count").notNull().default(0),
    status: text("status", { enum: ["online", "offline", "maintenance"] })
      .notNull()
      .default("online"),
    tier: text("tier").notNull().default("free"),
    aiMode: text("ai_mode").notNull().default("chat"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [unique().on(t.userId, t.discordServerId)],
);

export const insertServerSchema = createInsertSchema(servers).omit({
  id: true,
  createdAt: true,
});
export const selectServerSchema = createSelectSchema(servers);
export const updateServerSchema = insertServerSchema
  .omit({ userId: true })
  .partial();

export type Server = typeof servers.$inferSelect;
export type InsertServer = z.infer<typeof insertServerSchema>;
export type UpdateServer = z.infer<typeof updateServerSchema>;
