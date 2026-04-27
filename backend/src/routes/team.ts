import { Router, type IRouter } from "express";
import { z } from "zod";
import { prisma } from "../db/index";
import { requireAdmin } from "../lib/auth";

const router: IRouter = Router();

const TeamMemberSchema = z.object({
  name: z.string().trim().min(1),
  role: z.string().trim().min(1),
  codename: z.string().trim().min(1),
  age: z.coerce.number().int().min(1).max(120),
  bio: z.string().trim().nullable().optional(),
  photoUrl: z.string().trim().nullable().optional(),
  sortOrder: z.coerce.number().int().optional(),
});

function serialize(row: {
  id: number;
  name: string;
  role: string;
  codename: string;
  age: number;
  bio: string | null;
  photo_url: string | null;
  sort_order: number;
  created_at: Date;
}) {
  return {
    id: row.id,
    name: row.name,
    role: row.role,
    codename: row.codename,
    age: row.age,
    bio: row.bio,
    photoUrl: row.photo_url,
    sortOrder: row.sort_order,
    createdAt: row.created_at.toISOString(),
  };
}

router.get("/team", async (_req, res) => {
  const rows = await prisma.team_members.findMany({
    orderBy: [{ sort_order: "asc" }, { id: "asc" }],
  });
  res.json(rows.map(serialize));
});

router.get("/admin/team-members", requireAdmin, async (_req, res) => {
  const rows = await prisma.team_members.findMany({
    orderBy: [{ sort_order: "asc" }, { id: "asc" }],
  });
  res.json(rows.map(serialize));
});

router.post("/admin/team-members", requireAdmin, async (req, res) => {
  const body = TeamMemberSchema.parse(req.body);
  const row = await prisma.team_members.create({
    data: {
      name: body.name,
      role: body.role,
      codename: body.codename,
      age: body.age,
      bio: body.bio ?? null,
      photo_url: body.photoUrl ?? null,
      sort_order: body.sortOrder ?? 0,
    },
  });
  res.json(serialize(row));
});

router.patch("/admin/team-members/:id", requireAdmin, async (req, res) => {
  const id = Number(req.params.id);
  const body = TeamMemberSchema.partial().parse(req.body);
  const row = await prisma.team_members.update({
    where: { id },
    data: {
      name: body.name,
      role: body.role,
      codename: body.codename,
      age: body.age,
      bio: body.bio,
      photo_url: body.photoUrl,
      sort_order: body.sortOrder,
      updated_at: new Date(),
    },
  });
  res.json(serialize(row));
});

router.delete("/admin/team-members/:id", requireAdmin, async (req, res) => {
  const id = Number(req.params.id);
  await prisma.team_members.delete({ where: { id } });
  res.status(204).end();
});

export default router;