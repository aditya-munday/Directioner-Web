import { pgTable, uuid, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { profiles } from "./profiles";
import { servers } from "./servers";

export const memoryNodes = pgTable("memory_nodes", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  userId: uuid("user_id")
    .notNull()
    .references(() => profiles.id, { onDelete: "cascade" }),
  serverId: uuid("server_id").references(() => servers.id, {
    onDelete: "cascade",
  }),
  content: text("content").notNull(),
  scope: text("scope", { enum: ["user", "server", "global"] })
    .notNull()
    .default("server"),
  targetUser: text("target_user"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const insertMemoryNodeSchema = createInsertSchema(memoryNodes).omit({
  id: true,
  createdAt: true,
});
export const selectMemoryNodeSchema = createSelectSchema(memoryNodes);

export type MemoryNode = typeof memoryNodes.$inferSelect;
export type InsertMemoryNode = z.infer<typeof insertMemoryNodeSchema>;
