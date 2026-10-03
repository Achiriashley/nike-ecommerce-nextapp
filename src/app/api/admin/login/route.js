import { ADMIN_COOKIE, checkCredentials, createSessionToken, isAdminConfigured } from "@/lib/server/admin";
import { jsonError, readJson } from "@/lib/server/http";
import { NextResponse } from "next/server";

export const POST = async (request) => {
    if (!isAdminConfigured())
        return jsonError("Admin sign-in is not set up. Add ADMIN_EMAIL, ADMIN_PASSWORD and ADMIN_SESSION_SECRET to your environment settings and restart the app.", 503);
    const body = await readJson(request);
    if (!checkCredentials(body?.email, body?.password)) return jsonError("Incorrect email or password", 401);
    const { token, maxAge } = createSessionToken();
    const response = NextResponse.json({ ok: true });
    response.cookies.set(ADMIN_COOKIE, token, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge,
    });
    return response;
};
