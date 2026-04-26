import {
  db,
  siteSettingsTable,
  contentBlocksTable,
  adminsTable,
  tracksTable,
  eventsTable,
} from "@workspace/db";
import { hashPassword } from "./auth";
import { logger } from "./logger";

export async function ensureSeedData(): Promise<void> {
  try {
    const settings = await db.select().from(siteSettingsTable).limit(1);
    if (settings.length === 0) {
      await db.insert(siteSettingsTable).values({});
    }

    const admin = await db.select().from(adminsTable).limit(1);
    if (admin.length === 0) {
      await db.insert(adminsTable).values({
        username: "admin",
        passwordHash: hashPassword("blindkiss"),
      });
    }

    const blocks = await db.select().from(contentBlocksTable).limit(1);
    if (blocks.length === 0) {
      await db.insert(contentBlocksTable).values([
        {
          key: "bio",
          title: "BLIND KISS",
          body: "Quatro ruídos do Porto. Beijos cegos, palco aberto, amplificadores ao vermelho. Punk em português, com gosto a sal e diesel.",
        },
        {
          key: "manifesto",
          title: "MANIFESTO",
          body: "Tocamos alto porque o silêncio mente. Não pedimos licença, pedimos volume.",
        },
        {
          key: "press",
          title: "ECHOES",
          body: "Press / contactos / merch — em construção.",
        },
      ]);
    }

    const tracks = await db.select().from(tracksTable).limit(1);
    if (tracks.length === 0) {
      await db.insert(tracksTable).values([
        {
          title: "Static Lullaby (rehearsal)",
          artist: "blindkiss",
          url: "https://cdn.pixabay.com/download/audio/2022/03/15/audio_d51f5d29ed.mp3",
          durationSec: 132,
        },
      ]);
    }

    const events = await db.select().from(eventsTable).limit(1);
    if (events.length === 0) {
      const now = Date.now();
      await db.insert(eventsTable).values([
        {
          title: "BLIND KISS LIVE",
          venue: "Macedo's Bar",
          city: "Rates",
          address: "R. Dr. Manuel Monteiro 32, 4570-485 Rates",
          mapsUrl: "https://maps.google.com/?q=Macedo's+Bar+Rates",
          ticketUrl: null,
          price: "5€",
          eventDate: new Date(now + 1000 * 60 * 60 * 24 * 14),
          description: "Primeira data da temporada. Entrada porta.",
          forcePast: false,
        },
        {
          title: "ECHO NIGHT // PORTO",
          venue: "Hard Club",
          city: "Porto",
          address: "Mercado Ferreira Borges, 4050-253 Porto",
          mapsUrl: "https://maps.google.com/?q=Hard+Club+Porto",
          ticketUrl: "https://example.com/tickets",
          price: "10€",
          eventDate: new Date(now + 1000 * 60 * 60 * 24 * 45),
          description: "Show duplo com convidados.",
          forcePast: false,
        },
        {
          title: "GARAGE FEST 2025",
          venue: "Plano B",
          city: "Porto",
          address: "R. Cândido dos Reis 30, 4050-151 Porto",
          mapsUrl: "https://maps.google.com/?q=Plano+B+Porto",
          ticketUrl: null,
          price: "Free",
          eventDate: new Date(now - 1000 * 60 * 60 * 24 * 60),
          description: "Festival underground edição passada.",
          forcePast: false,
        },
      ]);
    }
  } catch (err) {
    logger.error({ err }, "Failed to seed data");
  }
}
