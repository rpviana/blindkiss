import { Router, type IRouter } from "express";
import {
  UpdateContentBlockBody,
  UpdateContentBlockParams,
} from "../api-zod/index";
import { prisma } from "../db/index";
import { requireAdmin } from "../lib/auth";

const router: IRouter = Router();

function serialize(r: {
  id: number;
  key: string;
  title: string | null;
  body: string | null;
  image_url: string | null;
}) {
  return {
    id: r.id,
    key: r.key,
    title: r.title,
    body: r.body,
    imageUrl: r.image_url,
  };
}

router.get("/content", async (_req, res) => {
  const rows = await prisma.content_blocks.findMany({
    orderBy: { id: "asc" },
  });
  res.json(rows.map(serialize));
});

router.put("/content/:key", requireAdmin, async (req, res) => {
  const { key } = UpdateContentBlockParams.parse(req.params);
  const body = UpdateContentBlockBody.parse(req.body);
  const existing = await prisma.content_blocks.findUnique({
    where: { key },
  });

  if (existing) {
    const updated = await prisma.content_blocks.update({
      where: { key },
      data: {
        title: body.title ?? null,
        body: body.body ?? null,
        image_url: body.imageUrl ?? null,
        updated_at: new Date(),
      },
    });
    res.json(serialize(updated));
    return;
  }

  const created = await prisma.content_blocks.create({
    data: {
      key,
      title: body.title ?? null,
      body: body.body ?? null,
      image_url: body.imageUrl ?? null,
    },
  });
  res.json(serialize(created));
});

export default router;
