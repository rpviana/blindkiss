import { Router, type IRouter } from "express";
import { CreateBkidMemberBody } from "@workspace/api-zod";
import { db, bkidMembersTable } from "@workspace/db";
import { count, desc } from "drizzle-orm";
import { requireAdmin } from "../lib/auth";

const router: IRouter = Router();

function serialize(row: typeof bkidMembersTable.$inferSelect) {
  return {
    id: row.id,
    serial: row.serial,
    name: row.name,
    email: row.email,
    photoUrl: row.photoUrl,
    createdAt: row.createdAt.toISOString(),
  };
}

router.get("/bkid", requireAdmin, async (_req, res) => {
  const rows = await db
    .select()
    .from(bkidMembersTable)
    .orderBy(desc(bkidMembersTable.id));
  res.json(rows.map(serialize));
});

router.post("/bkid", async (req, res) => {
  const body = CreateBkidMemberBody.parse(req.body);
  const [{ value }] = await db.select({ value: count() }).from(bkidMembersTable);
  const next = (value ?? 0) + 1;
  const year = new Date().getFullYear();
  const serial = `BK-${year}-${String(next).padStart(3, "0")}`;
  const [row] = await db
    .insert(bkidMembersTable)
    .values({
      serial,
      name: body.name,
      email: body.email ?? null,
      photoUrl: body.photoUrl ?? null,
    })
    .returning();
  res.json(serialize(row!));
});

router.get("/bkid/stats", async (_req, res) => {
  const [{ value }] = await db
    .select({ value: count() })
    .from(bkidMembersTable);
  const [latest] = await db
    .select()
    .from(bkidMembersTable)
    .orderBy(desc(bkidMembersTable.id))
    .limit(1);
  res.json({
    total: value ?? 0,
    latestSerial: latest?.serial ?? null,
  });
});

export default router;
