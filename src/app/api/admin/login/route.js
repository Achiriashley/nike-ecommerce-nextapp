import { ADMIN_COOKIE, checkCredentials, createSessionToken } from "@/lib/server/admin";
import { jsonError, readJson } from "@/lib/server/http";
import { NextResponse } from "next/server";

export const POST = async (request) => {
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
