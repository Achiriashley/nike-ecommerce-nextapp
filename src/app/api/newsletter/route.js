import connectDB from "@/db/connectDB";
import Subscriber from "@/model/Subscriber";
import { jsonError, readJson, requireDb } from "@/lib/server/http";
import { NextResponse } from "next/server";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export const POST = async (request) => {
    const denied = requireDb();
    if (denied) return denied;
    const email = String((await readJson(request))?.email ?? "").trim().toLowerCase();
    if (!EMAIL.test(email)) return jsonError("Enter a valid email address");
    try {
        await connectDB();
        await Subscriber.updateOne({ email }, { $setOnInsert: { email } }, { upsert: true });
        return NextResponse.json({ ok: true });
    } catch (err) {
        return jsonError(err.message, 500);
    }
};
