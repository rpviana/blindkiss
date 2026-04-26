import { pgTable, serial, text, integer, timestamp } from "drizzle-orm/pg-core";

export const tracksTable = pgTable("tracks", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  artist: text("artist"),
  url: text("url").notNull(),
  durationSec: integer("duration_sec"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type Track = typeof tracksTable.$inferSelect;
export type InsertTrack = typeof tracksTable.$inferInsert;
