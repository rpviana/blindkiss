import { Router, type IRouter } from "express";
import { UpdateSiteSettingsBody } from "../api-zod/index";
import { prisma } from "../db/index";
import { requireAdmin } from "../lib/auth";

const router: IRouter = Router();

async function getOrCreateRow() {
  const row = await prisma.site_settings.findFirst({
    orderBy: { id: "asc" },
  });
  if (row) return row;
  return prisma.site_settings.create({ data: {} });
}

function serialize(r: {
  color_background: string;
  color_title: string;
  color_text: string;
  color_accent: string;
  glitch_mode: boolean;
  recruitment_title: string;
  recruitment_subtitle: string;
  recruitment_bassist: string;
  recruitment_drummer: string;
  recruitment_contact: string;
  hero_tagline: string;
  footer_coords: string;
  footer_city: string;
}) {
  return {
    colorBackground: r.color_background,
    colorTitle: r.color_title,
    colorText: r.color_text,
    colorAccent: r.color_accent,
    glitchMode: r.glitch_mode,
    recruitmentTitle: r.recruitment_title,
    recruitmentSubtitle: r.recruitment_subtitle,
    recruitmentBassist: r.recruitment_bassist,
    recruitmentDrummer: r.recruitment_drummer,
    recruitmentContact: r.recruitment_contact,
    heroTagline: r.hero_tagline,
    footerCoords: r.footer_coords,
    footerCity: r.footer_city,
  };
}

router.get("/settings", async (_req, res) => {
  const row = await getOrCreateRow();
  res.json(serialize(row));
});

router.put("/settings", requireAdmin, async (req, res) => {
  const body = UpdateSiteSettingsBody.parse(req.body);
  const existing = await getOrCreateRow();
  const updated = await prisma.site_settings.update({
    where: { id: existing.id },
    data: {
      color_background: body.colorBackground,
      color_title: body.colorTitle,
      color_text: body.colorText,
      color_accent: body.colorAccent,
      glitch_mode: body.glitchMode,
      recruitment_title: body.recruitmentTitle,
      recruitment_subtitle: body.recruitmentSubtitle,
      recruitment_bassist: body.recruitmentBassist,
      recruitment_drummer: body.recruitmentDrummer,
      recruitment_contact: body.recruitmentContact,
      hero_tagline: body.heroTagline,
      footer_coords: body.footerCoords,
      footer_city: body.footerCity,
      updated_at: new Date(),
    },
  });
  res.json(serialize(updated));
});

export default router;
