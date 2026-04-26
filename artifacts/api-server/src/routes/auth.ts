import { Router, type IRouter } from "express";
import { AdminLoginBody } from "@workspace/api-zod";
import { db, adminsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
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
  const [admin] = await db
    .select()
    .from(adminsTable)
    .where(eq(adminsTable.username, body.username))
    .limit(1);

  if (!admin || !verifyPassword(body.password, admin.passwordHash)) {
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
