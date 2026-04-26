import { Router, type IRouter } from "express";
import {
  ListEventsQueryParams,
  CreateEventBody,
  UpdateEventBody,
  UpdateEventParams,
  DeleteEventParams,
} from "@workspace/api-zod";
import { db, eventsTable } from "@workspace/db";
import { eq, asc, desc } from "drizzle-orm";
import { requireAdmin } from "../lib/auth";

const router: IRouter = Router();

function serialize(row: typeof eventsTable.$inferSelect) {
  const isPast = row.forcePast || row.eventDate.getTime() < Date.now();
  return {
    id: row.id,
    title: row.title,
    venue: row.venue,
    city: row.city,
    address: row.address,
    mapsUrl: row.mapsUrl,
    ticketUrl: row.ticketUrl,
    price: row.price,
    eventDate: row.eventDate.toISOString(),
    posterUrl: row.posterUrl,
    description: row.description,
    forcePast: row.forcePast,
    isPast,
  };
}

router.get("/events", async (req, res) => {
  const { status } = ListEventsQueryParams.parse(req.query);
  const rows = await db
    .select()
    .from(eventsTable)
    .orderBy(asc(eventsTable.eventDate));

  let filtered = rows.map(serialize);
  if (status === "upcoming") filtered = filtered.filter((e) => !e.isPast);
  if (status === "past") {
    filtered = filtered
      .filter((e) => e.isPast)
      .sort(
        (a, b) =>
          new Date(b.eventDate).getTime() - new Date(a.eventDate).getTime(),
      );
  }
  res.json(filtered);
});

router.post("/events", requireAdmin, async (req, res) => {
  const body = CreateEventBody.parse(req.body);
  const [row] = await db
    .insert(eventsTable)
    .values({
      title: body.title,
      venue: body.venue,
      city: body.city,
      address: body.address,
      mapsUrl: body.mapsUrl ?? null,
      ticketUrl: body.ticketUrl ?? null,
      price: body.price ?? null,
      eventDate: body.eventDate,
      posterUrl: body.posterUrl ?? null,
      description: body.description ?? null,
      forcePast: body.forcePast ?? false,
    })
    .returning();
  res.json(serialize(row!));
});

router.put("/events/:id", requireAdmin, async (req, res) => {
  const { id } = UpdateEventParams.parse(req.params);
  const body = UpdateEventBody.parse(req.body);
  const [row] = await db
    .update(eventsTable)
    .set({
      title: body.title,
      venue: body.venue,
      city: body.city,
      address: body.address,
      mapsUrl: body.mapsUrl ?? null,
      ticketUrl: body.ticketUrl ?? null,
      price: body.price ?? null,
      eventDate: body.eventDate,
      posterUrl: body.posterUrl ?? null,
      description: body.description ?? null,
      forcePast: body.forcePast ?? false,
    })
    .where(eq(eventsTable.id, id))
    .returning();
  if (!row) {
    res.status(404).json({ ok: false });
    return;
  }
  res.json(serialize(row));
});

router.delete("/events/:id", requireAdmin, async (req, res) => {
  const { id } = DeleteEventParams.parse(req.params);
  await db.delete(eventsTable).where(eq(eventsTable.id, id));
  res.json({ ok: true });
});

export default router;
// silence unused import warning
void desc;
