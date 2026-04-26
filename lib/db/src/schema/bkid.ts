import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const bkidMembersTable = pgTable("bkid_members", {
  id: serial("id").primaryKey(),
  serial: text("serial").notNull().unique(),
  name: text("name").notNull(),
  email: text("email"),
  photoUrl: text("photo_url"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type BkidMember = typeof bkidMembersTable.$inferSelect;
export type InsertBkidMember = typeof bkidMembersTable.$inferInsert;
