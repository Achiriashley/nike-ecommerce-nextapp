import "server-only";
import crypto from "crypto";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const ADMIN_COOKIE = "admin_session";
const SESSION_HOURS = 8;

// Admin credentials come only from the environment (.env.local or the host's settings).
// Without ADMIN_EMAIL, ADMIN_PASSWORD and ADMIN_SESSION_SECRET, admin sign-in is disabled.
const adminEmail = () => process.env.ADMIN_EMAIL?.trim() ?? "";
const adminPassword = () => process.env.ADMIN_PASSWORD ?? "";
const secret = () => process.env.ADMIN_SESSION_SECRET ?? "";

export const isAdminConfigured = () => Boolean(adminEmail() && adminPassword() && secret());

const sign = (value) => crypto.createHmac("sha256", secret()).update(value).digest("hex");

const safeEqual = (a, b) => {
  const ba = Buffer.from(String(a));
  const bb = Buffer.from(String(b));
  return ba.length === bb.length && crypto.timingSafeEqual(ba, bb);
};

export const checkCredentials = (email, password) =>
  isAdminConfigured() &&
  safeEqual(String(email ?? "").trim().toLowerCase(), adminEmail().toLowerCase()) &&
  safeEqual(String(password ?? ""), adminPassword());

export const createSessionToken = () => {
  const expires = String(Date.now() + SESSION_HOURS * 3600 * 1000);
  return { token: `${expires}.${sign(expires)}`, maxAge: SESSION_HOURS * 3600 };
};

export const verifySessionToken = (token) => {
  if (!token || !isAdminConfigured()) return false;
  const [expires, signature] = String(token).split(".");
  if (!expires || !signature || Number(expires) < Date.now()) return false;
  return safeEqual(signature, sign(expires));
};

export const isAdmin = async () => verifySessionToken((await cookies()).get(ADMIN_COOKIE)?.value);

// Returns a 401 response for non-admins, or null when the request may continue.
export const requireAdmin = async () =>
  (await isAdmin()) ? null : NextResponse.json({ error: "Admin sign-in required" }, { status: 401 });
