import { Router, type IRouter } from "express";
import { CreateTrackBody, DeleteTrackParams } from "../api-zod/index";
import { prisma } from "../db/index";
import { requireAdmin } from "../lib/auth";

const router: IRouter = Router();

function serialize(r: {
  id: number;
  title: string;
  artist: string | null;
  url: string;
  duration_sec: number | null;
}) {
  return {
    id: r.id,
    title: r.title,
    artist: r.artist,
    url: r.url,
    durationSec: r.duration_sec,
  };
}

router.get("/tracks", async (_req, res) => {
  const rows = await prisma.tracks.findMany({
    orderBy: { id: "asc" },
  });
  res.json(rows.map(serialize));
});

router.post("/tracks", requireAdmin, async (req, res) => {
  const body = CreateTrackBody.parse(req.body);
  const row = await prisma.tracks.create({
    data: {
      title: body.title,
      artist: body.artist ?? null,
      url: body.url,
      duration_sec: body.durationSec ?? null,
    },
  });
  res.json(serialize(row));
});

router.delete("/tracks/:id", requireAdmin, async (req, res) => {
  const { id } = DeleteTrackParams.parse(req.params);
  await prisma.tracks.delete({ where: { id } });
  res.json({ ok: true });
});

export default router;
