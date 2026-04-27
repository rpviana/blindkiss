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
          url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
          duration_sec: 132,
        },
      });
    }

    await prisma.tracks.updateMany({
      where: { url: "https://cdn.pixabay.com/download/audio/2022/03/15/audio_d51f5d29ed.mp3" },
      data: { url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" },
    });

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

    const vaultAssetsCount = await prisma.vault_assets.count();
    if (vaultAssetsCount === 0) {
      await prisma.vault_assets.createMany({
        data: [
          {
            asset_type: "setlist_pdf",
            title: "Setlist // Macedo's Bar",
            description: "Setlist manuscrita do concerto em Rates.",
            file_url:
              "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
            preview_url: null,
            is_active: true,
            sort_order: 1,
          },
          {
            asset_type: "backstage_photo",
            title: "Backstage // Porto",
            description: "Momento de soundcheck antes do encore.",
            file_url:
              "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1600&q=80",
            preview_url:
              "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=70",
            is_active: true,
            sort_order: 2,
          },
          {
            asset_type: "wallpaper",
            title: "Wallpaper // Noise Red",
            description: "Wallpaper oficial BK-ID para telemóvel.",
            file_url:
              "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1080&q=80",
            preview_url:
              "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=540&q=70",
            is_active: true,
            sort_order: 3,
          },
        ],
      });
    }

    const pressKitCount = await prisma.press_kits.count();
    if (pressKitCount === 0) {
      await prisma.press_kits.create({
        data: {
          bio_short:
            "Blindkiss é um duo de Porto focado em punk/noise com letras diretas, riffs sujos e shows de alto impacto.",
          technical_rider:
            "INPUT LIST\n01 Kick\n02 Overhead L\n03 Overhead R\n04 Bass DI\n05 Guitar Amp Mic\n06 Vocal Lead\n\nBACKLINE\n01 Bateria standard (kick, snare, 2 toms, 2 pratos)\n01 Amp baixo 300W+\n01 Amp guitarra 30W+\n\nMONITORES\n03 wedges independentes",
          photo_urls: [
            "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=2200&q=80",
            "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=2200&q=80",
          ],
        },
      });
    }
  } catch (err) {
    logger.error({ err }, "Failed to seed data");
  }
}
