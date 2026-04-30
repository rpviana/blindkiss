import { Router, type IRouter } from "express";
import { z } from "zod";
import { prisma } from "../db/index";
import { requireAdmin } from "../lib/auth";

const router: IRouter = Router();

import { LocalizedTextSchema } from "../api-zod/index";

const PressKitBody = z.object({
  bioShort: LocalizedTextSchema,
  technicalRider: LocalizedTextSchema,
  photoUrls: z.array(z.string().url()),
});

async function getOrCreatePressKit() {
  const row = await prisma.press_kits.findFirst({
    orderBy: { id: "asc" },
  });
  if (row) return row;
  return prisma.press_kits.create({
    data: {
      bio_short: { pt: "Blindkiss é um duo de Porto focado em punk/noise com energia crua e presença intensa em palco.", en: "Blindkiss is a Porto duo focused on punk/noise with raw energy and intense stage presence." },
      technical_rider: { pt: "02x Voz (SM58)\n01x DI Baixo\n01x Mic Amp Guitarra\n01x Kick\n02x Overheads\n03x Monitores de chão\nMesa com mínimo 8 canais.", en: "02x Vocals (SM58)\n01x Bass DI\n01x Guitar Amp Mic\n01x Kick\n02x Overheads\n03x Floor Monitors\nMixer with at least 8 channels." },
      photo_urls: [],
    },
  });
}

function serialize(row: any) {
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
      bio_short: body.bioShort as any,
      technical_rider: body.technicalRider as any,
      photo_urls: body.photoUrls as any,
      updated_at: new Date(),
    },
  });
  res.json(serialize(updated));
});

export default router;
