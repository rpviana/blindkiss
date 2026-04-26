import { Router, type IRouter } from "express";
import {
  UpdateContentBlockBody,
  UpdateContentBlockParams,
} from "@workspace/api-zod";
import { db, contentBlocksTable } from "@workspace/db";
import { eq, asc } from "drizzle-orm";
import { requireAdmin } from "../lib/auth";

const router: IRouter = Router();

function serialize(r: typeof contentBlocksTable.$inferSelect) {
  return {
    id: r.id,
    key: r.key,
    title: r.title,
    body: r.body,
    imageUrl: r.imageUrl,
  };
}

router.get("/content", async (_req, res) => {
  const rows = await db
    .select()
    .from(contentBlocksTable)
    .orderBy(asc(contentBlocksTable.id));
  res.json(rows.map(serialize));
});

router.put("/content/:key", requireAdmin, async (req, res) => {
  const { key } = UpdateContentBlockParams.parse(req.params);
  const body = UpdateContentBlockBody.parse(req.body);
  const existing = await db
    .select()
    .from(contentBlocksTable)
    .where(eq(contentBlocksTable.key, key))
    .limit(1);

  if (existing[0]) {
    const [updated] = await db
      .update(contentBlocksTable)
      .set({
        title: body.title ?? null,
        body: body.body ?? null,
        imageUrl: body.imageUrl ?? null,
        updatedAt: new Date(),
      })
      .where(eq(contentBlocksTable.key, key))
      .returning();
    res.json(serialize(updated!));
    return;
  }

  const [created] = await db
    .insert(contentBlocksTable)
    .values({
      key,
      title: body.title ?? null,
      body: body.body ?? null,
      imageUrl: body.imageUrl ?? null,
    })
    .returning();
  res.json(serialize(created!));
});

export default router;
