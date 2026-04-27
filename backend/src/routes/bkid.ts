import { Router, type IRouter } from "express";
import { CreateBkidMemberBody } from "../api-zod/index";
import { prisma } from "../db/index";
import { requireAdmin } from "../lib/auth";

const router: IRouter = Router();

function serialize(row: {
  id: number;
  serial: string;
  name: string;
  email: string | null;
  photo_url: string | null;
  created_at: Date;
}) {
  return {
    id: row.id,
    serial: row.serial,
    name: row.name,
    email: row.email,
    photoUrl: row.photo_url,
    createdAt: row.created_at.toISOString(),
  };
}

router.get("/bkid", requireAdmin, async (_req, res) => {
  const rows = await prisma.bkid_members.findMany({
    orderBy: { id: "desc" },
  });
  res.json(rows.map(serialize));
});

router.post("/bkid", async (req, res) => {
  const body = CreateBkidMemberBody.parse(req.body);
  const count = await prisma.bkid_members.count();
  const next = count + 1;
  const year = new Date().getFullYear();
  const serial = `BK-${year}-${String(next).padStart(3, "0")}`;
  const row = await prisma.bkid_members.create({
    data: {
      serial,
      name: body.name,
      email: body.email ?? null,
      photo_url: body.photoUrl ?? null,
    },
  });
  res.json(serialize(row));
});

router.get("/bkid/stats", async (_req, res) => {
  const total = await prisma.bkid_members.count();
  const latest = await prisma.bkid_members.findFirst({
    orderBy: { id: "desc" },
  });
  res.json({
    total,
    latestSerial: latest?.serial ?? null,
  });
});

router.patch("/bkid/:id", requireAdmin, async (req, res) => {
  const id = parseInt(req.params.id as string);
  const body = CreateBkidMemberBody.partial().parse(req.body);
  const row = await prisma.bkid_members.update({
    where: { id },
    data: {
      name: body.name,
      email: body.email,
      photo_url: body.photoUrl,
    },
  });
  res.json(serialize(row));
});

router.delete("/bkid/:id", requireAdmin, async (req, res) => {
  const id = parseInt(req.params.id as string);
  await prisma.bkid_members.delete({ where: { id } });
  res.status(204).end();
});

export default router;
