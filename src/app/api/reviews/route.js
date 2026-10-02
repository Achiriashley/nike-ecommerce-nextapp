import connectDB, { isDbConfigured } from "@/db/connectDB";
import Review from "@/model/Review";
import { getProductBySlug } from "@/lib/server/products";
import { getShopper } from "@/lib/server/shopper";
import { jsonError, readJson, requireDb } from "@/lib/server/http";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const serialize = (r) => ({
    id: String(r._id),
    userId: r.userId,
    userName: r.userName,
    userImage: r.userImage ?? null,
    rating: r.rating,
    title: r.title,
    body: r.body,
    size: r.size ?? null,
    createdAt: r.createdAt,
});

export const GET = async (request) => {
    const slug = request.nextUrl.searchParams.get("product");
    if (!slug) return jsonError("Missing product");
    const shopper = await getShopper();
    if (!isDbConfigured()) return NextResponse.json({ enabled: false, reviews: [], viewerId: shopper?.userId ?? null });
    try {
        await connectDB();
        const reviews = await Review.find({ productSlug: slug }).sort({ createdAt: -1 }).limit(100).lean();
        return NextResponse.json({ enabled: true, reviews: reviews.map(serialize), viewerId: shopper?.userId ?? null });
    } catch (err) {
        return jsonError(err.message, 500);
    }
};

// Creates or updates the signed-in customer's review of a product.
export const POST = async (request) => {
    const denied = requireDb();
    if (denied) return denied;
    const shopper = await getShopper();
    if (!shopper) return jsonError("Sign in to write a review", 401);
    const body = await readJson(request);
    const rating = Number(body?.rating);
    const title = String(body?.title ?? "").trim();
    const text = String(body?.body ?? "").trim();
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) return jsonError("Choose a rating from 1 to 5 stars");
    if (title.length < 3 || title.length > 120) return jsonError("Give your review a headline (3–120 characters)");
    if (text.length < 10 || text.length > 2000) return jsonError("Tell us a little more (10–2000 characters)");
    const product = await getProductBySlug(String(body?.product ?? ""));
    if (!product) return jsonError("Product not found", 404);
    const size = body?.size && product.sizes.includes(String(body.size)) ? String(body.size) : undefined;
    try {
        await connectDB();
        const review = await Review.findOneAndUpdate(
            { productSlug: product.slug, userId: shopper.userId },
            { rating, title, body: text, size, userName: shopper.name, userImage: shopper.image ?? undefined },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        ).lean();
        revalidatePath("/", "layout");
        return NextResponse.json(serialize(review), { status: 201 });
    } catch (err) {
        return jsonError(err.message, 500);
    }
};

export const DELETE = async (request) => {
    const denied = requireDb();
    if (denied) return denied;
    const shopper = await getShopper();
    if (!shopper) return jsonError("Sign in to manage your review", 401);
    const slug = request.nextUrl.searchParams.get("product");
    try {
        await connectDB();
        await Review.deleteOne({ productSlug: slug, userId: shopper.userId });
        revalidatePath("/", "layout");
        return NextResponse.json({ ok: true });
    } catch (err) {
        return jsonError(err.message, 500);
    }
};
