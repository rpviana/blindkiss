import { Router, type IRouter } from "express";
import { UpdateSiteSettingsBody } from "@workspace/api-zod";
import { db, siteSettingsTable } from "@workspace/db";
import { asc } from "drizzle-orm";
import { requireAdmin } from "../lib/auth";

const router: IRouter = Router();

async function getOrCreateRow() {
  const rows = await db
    .select()
    .from(siteSettingsTable)
    .orderBy(asc(siteSettingsTable.id))
    .limit(1);
  if (rows[0]) return rows[0];
  const [created] = await db
    .insert(siteSettingsTable)
    .values({})
    .returning();
  return created!;
}

function serialize(r: typeof siteSettingsTable.$inferSelect) {
  return {
    colorBackground: r.colorBackground,
    colorTitle: r.colorTitle,
    colorText: r.colorText,
    colorAccent: r.colorAccent,
    glitchMode: r.glitchMode,
    recruitmentTitle: r.recruitmentTitle,
    recruitmentSubtitle: r.recruitmentSubtitle,
    recruitmentBassist: r.recruitmentBassist,
    recruitmentDrummer: r.recruitmentDrummer,
    recruitmentContact: r.recruitmentContact,
    heroTagline: r.heroTagline,
    footerCoords: r.footerCoords,
    footerCity: r.footerCity,
  };
}

router.get("/settings", async (_req, res) => {
  const row = await getOrCreateRow();
  res.json(serialize(row));
});

router.put("/settings", requireAdmin, async (req, res) => {
  const body = UpdateSiteSettingsBody.parse(req.body);
  const existing = await getOrCreateRow();
  const [updated] = await db
    .update(siteSettingsTable)
    .set({ ...body, updatedAt: new Date() })
    .where(eqId(existing.id))
    .returning();
  res.json(serialize(updated!));
});

import { eq } from "drizzle-orm";
function eqId(id: number) {
  return eq(siteSettingsTable.id, id);
}

export default router;
