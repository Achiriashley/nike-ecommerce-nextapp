import { ADMIN_COOKIE } from "@/lib/server/admin";
import { NextResponse } from "next/server";

export const POST = async () => {
    const response = NextResponse.json({ ok: true });
    response.cookies.set(ADMIN_COOKIE, "", { path: "/", maxAge: 0 });
    return response;
};
