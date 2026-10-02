import connectDB from "@/db/connectDB";
import Product from "@/model/Product";
import { catalog } from "@/data/catalog";
import { requireAdmin } from "@/lib/server/admin";
import { jsonError, requireDb } from "@/lib/server/http";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

// Imports any starter-catalog products whose slug isn't in the database yet.
export const POST = async () => {
    const denied = (await requireAdmin()) ?? requireDb();
    if (denied) return denied;
    try {
        await connectDB();
        const existing = new Set((await Product.find({}, { slug: 1 }).lean()).map((p) => p.slug));
        const missing = catalog
            .filter((p) => !existing.has(p.slug))
            .map((p) => ({ ...p, price: String(p.price), releasedAt: new Date(p.releasedAt) }));
        if (missing.length) await Product.insertMany(missing);
        revalidatePath("/", "layout");
        return NextResponse.json({ inserted: missing.length });
    } catch (err) {
        return jsonError(err.message, 500);
    }
};
