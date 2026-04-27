import { Router, type IRouter } from "express";
import { z } from "zod";
import { prisma } from "../db/index";
import { requireAdmin } from "../lib/auth";

const router: IRouter = Router();

const AnnouncementSchema = z.object({
  title: z.string(),
  content: z.string(),
  imageUrl: z.string().nullable().optional(),
  isActive: z.boolean().optional(),
});

function serialize(row: any) {
  return {
    id: row.id,
    title: row.title,
    content: row.content,
    imageUrl: row.image_url,
    type: row.type,
    isActive: row.is_active,
    createdAt: row.created_at.toISOString(),
  };
}

// Public: Get active announcements
router.get("/announcements", async (_req, res) => {
  const rows = await prisma.announcements.findMany({
    where: { is_active: true },
    orderBy: { created_at: "desc" },
  });
  res.json(rows.map(serialize));
});

// Admin: All announcements
router.get("/admin/announcements", requireAdmin, async (_req, res) => {
  const rows = await prisma.announcements.findMany({
    orderBy: { created_at: "desc" },
  });
  res.json(rows.map(serialize));
});

// Admin: Create
router.post("/admin/announcements", requireAdmin, async (req, res) => {
  const body = AnnouncementSchema.parse(req.body);
  const row = await prisma.announcements.create({
    data: {
      title: body.title,
      content: body.content,
      image_url: body.imageUrl ?? null,
      type: "glitch",
      is_active: body.isActive ?? true,
      show_popup: true,
    },
  });
  res.json(serialize(row));
});

// Admin: Update
router.patch("/admin/announcements/:id", requireAdmin, async (req, res) => {
  const id = parseInt(req.params.id as string);
  const body = AnnouncementSchema.partial().parse(req.body);
  
  const row = await prisma.announcements.update({
    where: { id },
    data: {
      title: body.title,
      content: body.content,
      image_url: body.imageUrl,
      is_active: body.isActive,
    },
  });
  res.json(serialize(row));
});

// Admin: Delete
router.delete("/admin/announcements/:id", requireAdmin, async (req, res) => {
  const id = parseInt(req.params.id as string);
  await prisma.announcements.delete({ where: { id } });
  res.status(204).end();
});

export default router;
