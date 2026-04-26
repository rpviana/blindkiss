import { Router, type IRouter } from "express";
import { CreateTrackBody, DeleteTrackParams } from "@workspace/api-zod";
import { db, tracksTable } from "@workspace/db";
import { asc, eq } from "drizzle-orm";
import { requireAdmin } from "../lib/auth";

const router: IRouter = Router();

function serialize(r: typeof tracksTable.$inferSelect) {
  return {
    id: r.id,
    title: r.title,
    artist: r.artist,
    url: r.url,
    durationSec: r.durationSec,
  };
}

router.get("/tracks", async (_req, res) => {
  const rows = await db.select().from(tracksTable).orderBy(asc(tracksTable.id));
  res.json(rows.map(serialize));
});

router.post("/tracks", requireAdmin, async (req, res) => {
  const body = CreateTrackBody.parse(req.body);
  const [row] = await db
    .insert(tracksTable)
    .values({
      title: body.title,
      artist: body.artist ?? null,
      url: body.url,
      durationSec: body.durationSec ?? null,
    })
    .returning();
  res.json(serialize(row!));
});

router.delete("/tracks/:id", requireAdmin, async (req, res) => {
  const { id } = DeleteTrackParams.parse(req.params);
  await db.delete(tracksTable).where(eq(tracksTable.id, id));
  res.json({ ok: true });
});

export default router;
