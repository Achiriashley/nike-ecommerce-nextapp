import connectDB from "@/db/connectDB";
import Product from "@/model/Product";
import { getProducts, normalizeProduct } from "@/lib/server/products";
import { requireAdmin } from "@/lib/server/admin";
import { jsonError, readJson, requireDb } from "@/lib/server/http";
import { parseProductInput } from "@/lib/server/productInput";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// Returns the storefront catalog (database products, or the starter catalog).
export const GET = async () => {
    try {
        return NextResponse.json(await getProducts(), {status: 200});
    } catch (error) {
        return jsonError(error.message, 500);
    }
};

// Creates a product (admin only).
export const POST = async (request) => {
    const denied = (await requireAdmin()) ?? requireDb();
    if (denied) return denied;
    const {data, error} = parseProductInput(await readJson(request));
    if (error) return jsonError(error);
    try {
        await connectDB();
        if (await Product.exists({slug: data.slug})) return jsonError(`A product with the slug "${data.slug}" already exists`, 409);
        const product = await Product.create(data);
        revalidatePath("/", "layout");
        return NextResponse.json(normalizeProduct(product.toObject()), {status: 201});
    } catch (err) {
        return jsonError(err.message, 500);
    }
};
