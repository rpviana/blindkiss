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
  return prisma.site_settings.create({ data: {} as any });
}

function serialize(r: any) {
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
    showRecruitment: r.show_recruitment,
    showRecruitmentBassist: r.show_recruitment_bassist,
    showRecruitmentDrummer: r.show_recruitment_drummer,
    recruitmentUrgentText: r.recruitment_urgent_text,
    showRecruitmentUrgent: r.show_recruitment_urgent,
    marqueeText: r.marquee_text,
    logoUrl: r.logo_url,
    homeLogoUrl: r.home_logo_url,
    archiveTitle: r.archive_title,
    archiveSubtitle: r.archive_subtitle,
    archiveUpcomingButton: r.archive_upcoming_button,
    archivePastButton: r.archive_past_button,
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
      recruitment_title: body.recruitmentTitle as any,
      recruitment_subtitle: body.recruitmentSubtitle as any,
      recruitment_bassist: body.recruitmentBassist as any,
      recruitment_drummer: body.recruitmentDrummer as any,
      recruitment_contact: body.recruitmentContact,
      hero_tagline: body.heroTagline as any,
      footer_coords: body.footerCoords,
      footer_city: body.footerCity,
      show_recruitment: body.showRecruitment,
      show_recruitment_bassist: body.showRecruitmentBassist,
      show_recruitment_drummer: body.showRecruitmentDrummer,
      recruitment_urgent_text: body.recruitmentUrgentText as any,
      show_recruitment_urgent: body.showRecruitmentUrgent,
      marquee_text: body.marqueeText as any,
      logo_url: body.logoUrl,
      home_logo_url: body.homeLogoUrl,
      archive_title: body.archiveTitle as any,
      archive_subtitle: body.archiveSubtitle as any,
      archive_upcoming_button: body.archiveUpcomingButton as any,
      archive_past_button: body.archivePastButton as any,
      updated_at: new Date(),
    },
  });
  res.json(serialize(updated));
});

export default router;
