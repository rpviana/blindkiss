import { Router, type IRouter } from "express";
import crypto from "node:crypto";
import { z } from "zod";
import { CreateBkidMemberBody } from "../api-zod/index";
import { prisma } from "../db/index";
import { requireAdmin } from "../lib/auth";

const router: IRouter = Router();
const CreateBkidMemberWithRequiredEmailBody = CreateBkidMemberBody.extend({
  email: z.string().trim().email(),
});
const RecoverBkidBody = z.object({
  name: z.string().trim().min(1),
  email: z.string().trim().email().transform((value) => normalizeEmail(value)),
});

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function normalizeName(name: string): string {
  return name
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .trim()
    .replace(/\s+/g, " ")
    .toUpperCase();
}

/**
 * Calculates Levenshtein distance between two strings
 * Used to find similar names even if they have typos
 */
function levenshteinDistance(a: string, b: string): number {
  const matrix: number[][] = [];

  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j] + 1      // deletion
        );
      }
    }
  }

  return matrix[b.length][a.length];
}

function serialize(row: {
  id: number;
  serial: string;
  supporter_number: number | null;
  name: string;
  email: string | null;
  photo_url: string | null;
  created_at: Date;
}) {
  return {
    id: row.id,
    serial: row.serial,
    supporterNumber: row.supporter_number,
    name: row.name,
    email: row.email,
    photoUrl: row.photo_url,
    createdAt: row.created_at.toISOString(),
  };
}

async function generateUniqueSerial(year: number): Promise<string> {
  for (let i = 0; i < 50; i += 1) {
    const randomSuffix = crypto.randomInt(0, 1_000_000).toString().padStart(6, "0");
    const serial = `BK-${year}-${randomSuffix}`;
    const existing = await prisma.bkid_members.findUnique({ where: { serial } });
    if (!existing) return serial;
  }
  throw new Error("Failed to generate unique BK-ID serial");
}

router.get("/bkid", requireAdmin, async (_req, res) => {
  const rows = await prisma.bkid_members.findMany({
    orderBy: { id: "desc" },
  });
  res.json(rows.map(serialize));
});

router.post("/bkid", async (req, res) => {
  const body = CreateBkidMemberWithRequiredEmailBody.parse(req.body);
  const normalizedEmail = normalizeEmail(body.email);
  const normalizedName = normalizeName(body.name);

  if (!normalizedName) {
    res.status(400).json({ ok: false, message: "Name is required" });
    return;
  }

  const existingByEmail = await prisma.bkid_members.findFirst({
    where: {
      email: {
        equals: normalizedEmail,
        mode: "insensitive",
      },
    },
  });
  if (existingByEmail) {
    res.status(409).json({
      ok: false,
      message: "Email already registered in BK-ID",
    });
    return;
  }

  const year = new Date().getFullYear();
  const serial = await generateUniqueSerial(year);
  const aggregate = await prisma.bkid_members.aggregate({
    _max: { supporter_number: true },
  });
  const nextSupporterNumber = (aggregate._max.supporter_number ?? 0) + 1;

  const row = await prisma.bkid_members.create({
    data: {
      serial,
      supporter_number: nextSupporterNumber,
      name: normalizedName,
      email: normalizedEmail,
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

router.post("/bkid/recover", async (req, res) => {
  const body = RecoverBkidBody.parse(req.body);
  const normalizedName = normalizeName(body.name);

  // First, find all members with the EXACT email
  const emailCandidates = await prisma.bkid_members.findMany({
    where: {
      email: {
        equals: body.email,
        mode: "insensitive",
      },
    },
    orderBy: [{ id: "desc" }],
  });

  if (emailCandidates.length === 0) {
    // Email not found in the system
    res.status(404).json({ ok: false, message: "Email not found in BK-ID system" });
    return;
  }

  // Email was found, now find the best name match among candidates
  let bestMatch = emailCandidates[0];
  let bestDistance = levenshteinDistance(normalizedName, normalizeName(bestMatch.name));

  for (const candidate of emailCandidates) {
    const distance = levenshteinDistance(normalizedName, normalizeName(candidate.name));
    if (distance < bestDistance) {
      bestDistance = distance;
      bestMatch = candidate;
    }
  }

  // Only return a match if the name distance is reasonable (max 3 character differences)
  // Otherwise, the user likely has the wrong email or name
  if (bestDistance <= 3) {
    res.json(serialize(bestMatch));
    return;
  }

  // Name doesn't match well enough
  res.status(404).json({ 
    ok: false, 
    message: "No BK-ID found with this email and name combination. Please verify your information." 
  });
});

router.patch("/bkid/:id", requireAdmin, async (req, res) => {
  const id = parseInt(req.params.id as string);
  const body = CreateBkidMemberBody.partial().parse(req.body);

  const normalizedEmail =
    typeof body.email === "string" ? normalizeEmail(body.email) : body.email;
  const normalizedName =
    typeof body.name === "string" ? normalizeName(body.name) : body.name;

  if (typeof normalizedEmail === "string") {
    const existingByEmail = await prisma.bkid_members.findFirst({
      where: {
        id: { not: id },
        email: {
          equals: normalizedEmail,
          mode: "insensitive",
        },
      },
    });
    if (existingByEmail) {
      res.status(409).json({
        ok: false,
        message: "Email already registered in BK-ID",
      });
      return;
    }
  }

  const row = await prisma.bkid_members.update({
    where: { id },
    data: {
      name: normalizedName,
      email: normalizedEmail,
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
