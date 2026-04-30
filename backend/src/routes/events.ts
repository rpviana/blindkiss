import { Router, type IRouter } from "express";
import {
  ListEventsQueryParams,
  CreateEventBody,
  UpdateEventBody,
  UpdateEventParams,
  DeleteEventParams,
} from "../api-zod/index";
import { prisma } from "../db/index";
import { requireAdmin } from "../lib/auth";

const router: IRouter = Router();

function serialize(row: any) {
  const isPast = row.force_past || row.event_date.getTime() < Date.now();
  return {
    id: row.id,
    title: row.title,
    venue: row.venue,
    city: row.city,
    address: row.address,
    mapsUrl: row.maps_url,
    ticketUrl: row.ticket_url,
    price: row.price,
    eventDate: row.event_date.toISOString(),
    posterUrl: row.poster_url,
    description: row.description,
    forcePast: row.force_past,
    isPast,
  };
}

router.get("/events", async (req, res) => {
  const { status } = ListEventsQueryParams.parse(req.query);
  const rows = await prisma.events.findMany({
    orderBy: { event_date: "asc" },
  });

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
  const row = await prisma.events.create({
    data: {
      title: body.title as any,
      venue: body.venue as any,
      city: body.city as any,
      address: body.address,
      maps_url: body.mapsUrl ?? null,
      ticket_url: body.ticketUrl ?? null,
      price: body.price ?? null,
      event_date: body.eventDate,
      poster_url: body.posterUrl ?? null,
      description: (body.description as any) ?? null,
      force_past: body.forcePast ?? false,
    },
  });
  res.json(serialize(row));
});

router.put("/events/:id", requireAdmin, async (req, res) => {
  const { id } = UpdateEventParams.parse(req.params);
  const body = UpdateEventBody.parse(req.body);
  const row = await prisma.events.update({
    where: { id },
    data: {
      title: body.title as any,
      venue: body.venue as any,
      city: body.city as any,
      address: body.address,
      maps_url: body.mapsUrl ?? null,
      ticket_url: body.ticketUrl ?? null,
      price: body.price ?? null,
      event_date: body.eventDate,
      poster_url: body.posterUrl ?? null,
      description: (body.description as any) ?? null,
      force_past: body.forcePast ?? false,
    },
  });
  if (!row) {
    res.status(404).json({ ok: false });
    return;
  }
  res.json(serialize(row));
});

router.delete("/events/:id", requireAdmin, async (req, res) => {
  const { id } = DeleteEventParams.parse(req.params);
  await prisma.events.delete({ where: { id } });
  res.json({ ok: true });
});

export default router;
