import { Router, type IRouter } from "express";
import { z } from "zod";
import { prisma } from "../db/index";
import { requireAdmin } from "../lib/auth";

const router: IRouter = Router();

const VaultAssetType = z.enum(["setlist_pdf", "backstage_photo", "wallpaper"]);

const VaultAccessBody = z.object({
  serial: z.string().min(3),
});

const VaultAssetBody = z.object({
  assetType: VaultAssetType,
  title: z.string().min(1).max(180),
  description: z.string().max(2000).nullish(),
  fileUrl: z.string().url(),
  previewUrl: z.string().url().nullish(),
  isActive: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
});

const UpdateVaultAssetBody = VaultAssetBody.partial();

function normalizeSerial(serial: string): string {
  return serial.trim().toUpperCase();
}

function serializeAsset(row: {
  id: number;
  asset_type: string;
  title: string;
  description: string | null;
  file_url: string;
  preview_url: string | null;
  is_active: boolean;
  sort_order: number;
  created_at: Date;
}) {
  return {
    id: row.id,
    assetType: row.asset_type,
    title: row.title,
    description: row.description,
    fileUrl: row.file_url,
    previewUrl: row.preview_url,
    isActive: row.is_active,
    sortOrder: row.sort_order,
    createdAt: row.created_at.toISOString(),
  };
}

router.post("/vault/access", async (req, res) => {
  const { serial } = VaultAccessBody.parse(req.body);
  const normalizedSerial = normalizeSerial(serial);

  const member = await prisma.bkid_members.findFirst({
    where: {
      serial: {
        equals: normalizedSerial,
        mode: "insensitive",
      },
    },
  });

  if (!member) {
    res.status(404).json({ ok: false });
    return;
  }

  const assets = await prisma.vault_assets.findMany({
    where: { is_active: true },
    orderBy: [{ sort_order: "asc" }, { id: "desc" }],
  });

  res.json({
    ok: true,
    member: {
      id: member.id,
      serial: member.serial,
      name: member.name,
    },
    assets: assets.map(serializeAsset),
  });
});

router.get("/admin/vault-assets", requireAdmin, async (_req, res) => {
  const rows = await prisma.vault_assets.findMany({
    orderBy: [{ sort_order: "asc" }, { id: "desc" }],
  });
  res.json(rows.map(serializeAsset));
});

router.post("/admin/vault-assets", requireAdmin, async (req, res) => {
  const body = VaultAssetBody.parse(req.body);
  const created = await prisma.vault_assets.create({
    data: {
      asset_type: body.assetType,
      title: body.title,
      description: body.description ?? null,
      file_url: body.fileUrl,
      preview_url: body.previewUrl ?? null,
      is_active: body.isActive ?? true,
      sort_order: body.sortOrder ?? 0,
    },
  });
  res.status(201).json(serializeAsset(created));
});

router.patch("/admin/vault-assets/:id", requireAdmin, async (req, res) => {
  const id = z.coerce.number().int().parse(req.params.id);
  const body = UpdateVaultAssetBody.parse(req.body);
  const updated = await prisma.vault_assets.update({
    where: { id },
    data: {
      asset_type: body.assetType,
      title: body.title,
      description: body.description,
      file_url: body.fileUrl,
      preview_url: body.previewUrl,
      is_active: body.isActive,
      sort_order: body.sortOrder,
    },
  });
  res.json(serializeAsset(updated));
});

router.delete("/admin/vault-assets/:id", requireAdmin, async (req, res) => {
  const id = z.coerce.number().int().parse(req.params.id);
  await prisma.vault_assets.delete({ where: { id } });
  res.status(204).end();
});

export default router;
