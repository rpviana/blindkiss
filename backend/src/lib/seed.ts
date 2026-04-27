import { prisma } from "../db/index";
import { hashPassword } from "./auth";
import { logger } from "./logger";

export async function ensureSeedData(): Promise<void> {
  try {
    const settingsCount = await prisma.site_settings.count();
    if (settingsCount === 0) {
      await prisma.site_settings.create({ data: {} });
    }

    const adminCount = await prisma.admins.count();
    if (adminCount === 0) {
      await prisma.admins.create({
        data: {
          username: "admin",
          password_hash: hashPassword("blindkiss"),
        },
      });
    }

    const blocksCount = await prisma.content_blocks.count();
    if (blocksCount === 0) {
      await prisma.content_blocks.createMany({
        data: [
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
        ],
      });
    }

    const tracksCount = await prisma.tracks.count();
    if (tracksCount === 0) {
      await prisma.tracks.create({
        data: {
          title: "Static Lullaby (rehearsal)",
          artist: "blindkiss",
          url: "https://cdn.pixabay.com/download/audio/2022/03/15/audio_d51f5d29ed.mp3",
          duration_sec: 132,
        },
      });
    }

    const eventsCount = await prisma.events.count();
    if (eventsCount === 0) {
      const now = Date.now();
      await prisma.events.createMany({
        data: [
          {
            title: "BLIND KISS LIVE",
            venue: "Macedo's Bar",
            city: "Rates",
            address: "R. Dr. Manuel Monteiro 32, 4570-485 Rates",
            maps_url: "https://maps.google.com/?q=Macedo's+Bar+Rates",
            ticket_url: null,
            price: "5€",
            event_date: new Date(now + 1000 * 60 * 60 * 24 * 14),
            description: "Primeira data da temporada. Entrada porta.",
            force_past: false,
          },
          {
            title: "ECHO NIGHT // PORTO",
            venue: "Hard Club",
            city: "Porto",
            address: "Mercado Ferreira Borges, 4050-253 Porto",
            maps_url: "https://maps.google.com/?q=Hard+Club+Porto",
            ticket_url: "https://example.com/tickets",
            price: "10€",
            event_date: new Date(now + 1000 * 60 * 60 * 24 * 45),
            description: "Show duplo com convidados.",
            force_past: false,
          },
          {
            title: "GARAGE FEST 2025",
            venue: "Plano B",
            city: "Porto",
            address: "R. Cândido dos Reis 30, 4050-151 Porto",
            maps_url: "https://maps.google.com/?q=Plano+B+Porto",
            ticket_url: null,
            price: "Free",
            event_date: new Date(now - 1000 * 60 * 60 * 24 * 60),
            description: "Festival underground edição passada.",
            force_past: false,
          },
        ],
      });
    }
  } catch (err) {
    logger.error({ err }, "Failed to seed data");
  }
}
