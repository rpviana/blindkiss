import crypto from "node:crypto";
import type { Request, Response, NextFunction } from "express";

const SESSION_COOKIE = "bk_session";
const SECRET = process.env["SESSION_SECRET"] ?? "blindkiss-dev-secret";

function sign(value: string): string {
  return crypto.createHmac("sha256", SECRET).update(value).digest("hex");
}

export function makeSessionToken(username: string): string {
  const issuedAt = Date.now().toString();
  const payload = `${username}.${issuedAt}`;
  const signature = sign(payload);
  return `${payload}.${signature}`;
}

export function verifySessionToken(token: string): { username: string } | null {
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const [username, issuedAt, signature] = parts;
  if (!username || !issuedAt || !signature) return null;
  const expected = sign(`${username}.${issuedAt}`);
  if (signature !== expected) return null;
  return { username };
}

export function readSession(req: Request): { username: string } | null {
  const token = (req.cookies?.[SESSION_COOKIE] as string | undefined) ?? null;
  if (!token) return null;
  return verifySessionToken(token);
}

export function setSessionCookie(res: Response, token: string): void {
  res.cookie(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env["NODE_ENV"] === "production",
    maxAge: 1000 * 60 * 60 * 24 * 30,
    path: "/",
  });
}

export function clearSessionCookie(res: Response): void {
  res.clearCookie(SESSION_COOKIE, { path: "/" });
}

export function hashPassword(password: string): string {
  return crypto
    .createHash("sha256")
    .update(`${SECRET}::${password}`)
    .digest("hex");
}

export function verifyPassword(password: string, hash: string): boolean {
  return crypto.timingSafeEqual(
    Buffer.from(hashPassword(password)),
    Buffer.from(hash),
  );
}

export function requireAdmin(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const session = readSession(req);
  if (!session) {
    res.status(401).json({ ok: false });
    return;
  }
  next();
}
