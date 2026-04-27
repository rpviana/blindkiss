import { Router, type IRouter } from "express";
import { AdminLoginBody } from "../api-zod/index";
import { prisma } from "../db/index";
import {
  clearSessionCookie,
  makeSessionToken,
  readSession,
  setSessionCookie,
  verifyPassword,
} from "../lib/auth";

const router: IRouter = Router();

router.post("/auth/login", async (req, res) => {
  const body = AdminLoginBody.parse(req.body);
  const admin = await prisma.admins.findUnique({
    where: { username: body.username },
  });

  if (!admin || !verifyPassword(body.password, admin.password_hash)) {
    res.status(401).json({ ok: false });
    return;
  }
  const token = makeSessionToken(admin.username);
  setSessionCookie(res, token);
  res.json({ authenticated: true, username: admin.username });
});

router.post("/auth/logout", (_req, res) => {
  clearSessionCookie(res);
  res.json({ ok: true });
});

router.get("/auth/me", (req, res) => {
  const session = readSession(req);
  if (!session) {
    res.json({ authenticated: false, username: null });
    return;
  }
  res.json({ authenticated: true, username: session.username });
});

export default router;
