import "server-only";
import { NextResponse } from "next/server";
import { isDbConfigured } from "@/db/connectDB";

export const jsonError = (message, status = 400) => NextResponse.json({ error: message }, { status });

export const requireDb = () =>
  isDbConfigured() ? null : jsonError("The database is not configured. Set MONGO_DB to enable this feature.", 503);

export const readJson = async (request) => {
  try {
    return await request.json();
  } catch {
    return null;
  }
};
