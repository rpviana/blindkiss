import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const contentBlocksTable = pgTable("content_blocks", {
  id: serial("id").primaryKey(),
  key: text("key").notNull().unique(),
  title: text("title"),
  body: text("body"),
  imageUrl: text("image_url"),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export type ContentBlock = typeof contentBlocksTable.$inferSelect;
export type InsertContentBlock = typeof contentBlocksTable.$inferInsert;
