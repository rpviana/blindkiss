import { pgTable, serial, text, timestamp, boolean } from "drizzle-orm/pg-core";

export const eventsTable = pgTable("events", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  venue: text("venue").notNull(),
  city: text("city").notNull(),
  address: text("address").notNull(),
  mapsUrl: text("maps_url"),
  ticketUrl: text("ticket_url"),
  price: text("price"),
  eventDate: timestamp("event_date", { withTimezone: true }).notNull(),
  posterUrl: text("poster_url"),
  description: text("description"),
  forcePast: boolean("force_past").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type Event = typeof eventsTable.$inferSelect;
export type InsertEvent = typeof eventsTable.$inferInsert;
