import "server-only";
import crypto from "crypto";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const ADMIN_COOKIE = "admin_session";
const SESSION_HOURS = 8;

// Defaults keep the original admin login working; set the env vars in production.
const adminEmail = () => process.env.ADMIN_EMAIL || "admin237@nike.com";
const adminPassword = () => process.env.ADMIN_PASSWORD || "admin237";
const secret = () => process.env.ADMIN_SESSION_SECRET || `fallback:${adminEmail()}:${adminPassword()}`;

const sign = (value) => crypto.createHmac("sha256", secret()).update(value).digest("hex");

const safeEqual = (a, b) => {
  const ba = Buffer.from(String(a));
  const bb = Buffer.from(String(b));
  return ba.length === bb.length && crypto.timingSafeEqual(ba, bb);
};

export const checkCredentials = (email, password) =>
  safeEqual(String(email ?? "").trim().toLowerCase(), adminEmail().toLowerCase()) &&
  safeEqual(String(password ?? ""), adminPassword());

export const createSessionToken = () => {
  const expires = String(Date.now() + SESSION_HOURS * 3600 * 1000);
  return { token: `${expires}.${sign(expires)}`, maxAge: SESSION_HOURS * 3600 };
};

export const verifySessionToken = (token) => {
  if (!token) return false;
  const [expires, signature] = String(token).split(".");
  if (!expires || !signature || Number(expires) < Date.now()) return false;
  return safeEqual(signature, sign(expires));
};

export const isAdmin = async () => verifySessionToken((await cookies()).get(ADMIN_COOKIE)?.value);

// Returns a 401 response for non-admins, or null when the request may continue.
export const requireAdmin = async () =>
  (await isAdmin()) ? null : NextResponse.json({ error: "Admin sign-in required" }, { status: 401 });
