import mongoose from "mongoose";
import connectDB from "@/db/connectDB";
import Product from "@/model/Product";
import { getProducts, normalizeProduct } from "@/lib/server/products";
import { requireAdmin } from "@/lib/server/admin";
import { jsonError, readJson, requireDb } from "@/lib/server/http";
import { parseProductInput } from "@/lib/server/productInput";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// Accepts either a MongoDB id or a slug.
export const GET = async (_request, { params }) => {
    const { id } = await params;
    const product = (await getProducts()).find((p) => p.id === id || p.slug === id);
    return product ? NextResponse.json(product) : jsonError("Product not found", 404);
};

const findOwned = async (id) => {
    if (!mongoose.isValidObjectId(id)) return null;
    await connectDB();
    return Product.findById(id);
};

export const PUT = async (request, { params }) => {
    const denied = (await requireAdmin()) ?? requireDb();
    if (denied) return denied;
    const { id } = await params;
    const { data, error } = parseProductInput(await readJson(request));
    if (error) return jsonError(error);
    try {
        const product = await findOwned(id);
        if (!product) return jsonError("Product not found", 404);
        if (await Product.exists({ slug: data.slug, _id: { $ne: product._id } }))
            return jsonError(`A product with the slug "${data.slug}" already exists`, 409);
        product.set(data);
        await product.save();
        revalidatePath("/", "layout");
        return NextResponse.json(normalizeProduct(product.toObject()));
    } catch (err) {
        return jsonError(err.message, 500);
    }
};

export const DELETE = async (_request, { params }) => {
    const denied = (await requireAdmin()) ?? requireDb();
    if (denied) return denied;
    const { id } = await params;
    try {
        const product = await findOwned(id);
        if (!product) return jsonError("Product not found", 404);
        await product.deleteOne();
        revalidatePath("/", "layout");
        return NextResponse.json({ ok: true });
    } catch (err) {
        return jsonError(err.message, 500);
    }
};
