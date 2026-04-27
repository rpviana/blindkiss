import { Router, type IRouter } from "express";
import { z } from "zod";
import { prisma } from "../db/index";
import { requireAdmin } from "../lib/auth";

const router: IRouter = Router();

const MediaUrlSchema = z
  .string()
  .trim()
  .min(3)
  .max(2000)
  .transform((value) => (/^https?:\/\//i.test(value) ? value : `https://${value}`))
  .refine((value) => {
    try {
      new URL(value);
      return true;
    } catch {
      return false;
    }
  }, "Invalid media URL");

const CreateRecruitmentApplicationBody = z.object({
  name: z.string().min(2).max(120),
  email: z.string().trim().email(),
  phone: z.string().trim().min(6).max(30),
  instrument: z.string().max(80).nullish(),
  mediaUrl: MediaUrlSchema,
  message: z.string().max(2000).nullish(),
});

const UpdateRecruitmentApplicationBody = z.object({
  status: z.enum(["pending", "reviewing", "shortlisted", "rejected"]),
});

function serialize(row: {
  id: number;
  name: string;
  email: string | null;
  phone: string;
  instrument: string | null;
  media_url: string;
  message: string | null;
  status: string;
  created_at: Date;
  reviewed_at: Date | null;
}) {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone,
    instrument: row.instrument,
    mediaUrl: row.media_url,
    message: row.message,
    status: row.status,
    createdAt: row.created_at.toISOString(),
    reviewedAt: row.reviewed_at?.toISOString() ?? null,
  };
}

router.post("/recruitment-applications", async (req, res) => {
  const body = CreateRecruitmentApplicationBody.parse(req.body);
  const created = await prisma.recruitment_applications.create({
    data: {
      name: body.name,
      email: body.email,
      phone: body.phone,
      instrument: body.instrument ?? null,
      media_url: body.mediaUrl,
      message: body.message ?? null,
    },
  });
  res.status(201).json(serialize(created));
});

router.get("/admin/recruitment-applications", requireAdmin, async (_req, res) => {
  const rows = await prisma.recruitment_applications.findMany({
    orderBy: { created_at: "desc" },
  });
  res.json(rows.map(serialize));
});

router.patch(
  "/admin/recruitment-applications/:id",
  requireAdmin,
  async (req, res) => {
    const id = z.coerce.number().int().parse(req.params.id);
    const body = UpdateRecruitmentApplicationBody.parse(req.body);

    const updated = await prisma.recruitment_applications.update({
      where: { id },
      data: {
        status: body.status,
        reviewed_at: body.status === "pending" ? null : new Date(),
      },
    });

    res.json(serialize(updated));
  },
);

router.delete(
  "/admin/recruitment-applications/:id",
  requireAdmin,
  async (req, res) => {
    const id = z.coerce.number().int().parse(req.params.id);
    await prisma.recruitment_applications.delete({ where: { id } });
    res.status(204).end();
  },
);

export default router;
