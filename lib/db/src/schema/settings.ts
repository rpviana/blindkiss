import { pgTable, serial, text, boolean, timestamp } from "drizzle-orm/pg-core";

export const siteSettingsTable = pgTable("site_settings", {
  id: serial("id").primaryKey(),
  colorBackground: text("color_background").notNull().default("#dddad3"),
  colorTitle: text("color_title").notNull().default("#910802"),
  colorText: text("color_text").notNull().default("#7d7573"),
  colorAccent: text("color_accent").notNull().default("#910802"),
  glitchMode: boolean("glitch_mode").notNull().default(false),
  recruitmentTitle: text("recruitment_title").notNull().default("WANTED"),
  recruitmentSubtitle: text("recruitment_subtitle").notNull().default("blindkiss procura novos membros"),
  recruitmentBassist: text("recruitment_bassist").notNull().default("BAIXISTA — disponibilidade para ensaios semanais e concertos no Porto."),
  recruitmentDrummer: text("recruitment_drummer").notNull().default("BATERISTA — atitude crua, gosto pelo barulho, presença em palco."),
  recruitmentContact: text("recruitment_contact").notNull().default("contacto@blindkiss.pt"),
  heroTagline: text("hero_tagline").notNull().default("RUÍDO COM BEIJOS // PORTO"),
  footerCoords: text("footer_coords").notNull().default("41.1496° N, 8.6109° W"),
  footerCity: text("footer_city").notNull().default("PORTO — PT"),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export type SiteSettings = typeof siteSettingsTable.$inferSelect;
export type InsertSiteSettings = typeof siteSettingsTable.$inferInsert;
