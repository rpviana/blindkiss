import { Router, type IRouter } from "express";
import { z } from "zod";
import { prisma } from "../db/index";
import { requireAdmin } from "../lib/auth";

const router: IRouter = Router();

import { LocalizedTextSchema } from "../api-zod/index";

const MemberGroupSchema = z.enum(["band", "contributor"]);

const TeamMemberSchema = z.object({
  name: z.string().trim().min(1),
  role: LocalizedTextSchema,
  codename: z.string().trim().min(1),
  age: z.coerce.number().int().min(1).max(120),
  bio: LocalizedTextSchema.nullable().optional(),
  photoUrl: z.string().trim().nullable().optional(),
  memberGroup: MemberGroupSchema.optional(),
});

function serialize(row: any) {
  return {
    id: row.id,
    name: row.name,
    role: row.role,
    codename: row.codename,
    age: row.age,
    bio: row.bio,
    photoUrl: row.photo_url,
    memberGroup: row.member_group,
    createdAt: row.created_at.toISOString(),
  };
}

router.get("/team", async (_req, res) => {
  const rows = await prisma.team_members.findMany({
    orderBy: [{ member_group: "asc" }, { id: "asc" }],
  });
  res.json(rows.map(serialize));
});

router.get("/admin/team-members", requireAdmin, async (_req, res) => {
  const rows = await prisma.team_members.findMany({
    orderBy: [{ member_group: "asc" }, { id: "asc" }],
  });
  res.json(rows.map(serialize));
});

router.post("/admin/team-members", requireAdmin, async (req, res) => {
  const body = TeamMemberSchema.parse(req.body);
  const row = await prisma.team_members.create({
    data: {
      name: body.name,
      role: body.role as any,
      codename: body.codename,
      age: body.age,
      bio: (body.bio as any) ?? null,
      photo_url: body.photoUrl ?? null,
      member_group: body.memberGroup ?? "contributor",
    },
  });
  res.json(serialize(row));
});

router.patch("/admin/team-members/:id", requireAdmin, async (req, res) => {
  const id = Number(req.params.id);
  const body = TeamMemberSchema.partial().parse(req.body);
  const data: Record<string, unknown> = { updated_at: new Date() };
  if (body.name !== undefined) data.name = body.name;
  if (body.role !== undefined) data.role = body.role as object;
  if (body.codename !== undefined) data.codename = body.codename;
  if (body.age !== undefined) data.age = body.age;
  if (body.bio !== undefined) data.bio = body.bio as object | null;
  if (body.photoUrl !== undefined) data.photo_url = body.photoUrl;
  if (body.memberGroup !== undefined) data.member_group = body.memberGroup;

  const row = await prisma.team_members.update({
    where: { id },
    data: data as any,
  });
  res.json(serialize(row));
});

router.delete("/admin/team-members/:id", requireAdmin, async (req, res) => {
  const id = Number(req.params.id);
  await prisma.team_members.delete({ where: { id } });
  res.status(204).end();
});

export default router;
