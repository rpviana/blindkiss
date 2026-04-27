import { Router, type IRouter } from "express";
import { z } from "zod";
import { prisma } from "../db/index";
import { requireAdmin } from "../lib/auth";

const router: IRouter = Router();

const PressKitBody = z.object({
  bioShort: z.string().min(1),
  technicalRider: z.string().min(1),
  photoUrls: z.array(z.string().url()),
});

async function getOrCreatePressKit() {
  const row = await prisma.press_kits.findFirst({
    orderBy: { id: "asc" },
  });
  if (row) return row;
  return prisma.press_kits.create({
    data: {
      bio_short: "Blindkiss é um duo de Porto focado em punk/noise com energia crua e presença intensa em palco.",
      technical_rider:
        "02x Voz (SM58)\n01x DI Baixo\n01x Mic Amp Guitarra\n01x Kick\n02x Overheads\n03x Monitores de chão\nMesa com mínimo 8 canais.",
      photo_urls: [],
    },
  });
}

function serialize(row: {
  id: number;
  bio_short: string;
  technical_rider: string;
  photo_urls: unknown;
  updated_at: Date;
}) {
  const photoUrls = Array.isArray(row.photo_urls)
    ? row.photo_urls.filter((item): item is string => typeof item === "string")
    : [];

  return {
    id: row.id,
    bioShort: row.bio_short,
    technicalRider: row.technical_rider,
    photoUrls,
    updatedAt: row.updated_at.toISOString(),
  };
}

router.get("/press-kit", async (_req, res) => {
  const row = await getOrCreatePressKit();
  res.json(serialize(row));
});

router.put("/admin/press-kit", requireAdmin, async (req, res) => {
  const body = PressKitBody.parse(req.body);
  const row = await getOrCreatePressKit();
  const updated = await prisma.press_kits.update({
    where: { id: row.id },
    data: {
      bio_short: body.bioShort,
      technical_rider: body.technicalRider,
      photo_urls: body.photoUrls,
      updated_at: new Date(),
    },
  });
  res.json(serialize(updated));
});

export default router;
