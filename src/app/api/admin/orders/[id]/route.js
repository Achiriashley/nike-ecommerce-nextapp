import mongoose from "mongoose";
import connectDB from "@/db/connectDB";
import Order, { ORDER_STATUSES } from "@/model/Order";
import { requireAdmin } from "@/lib/server/admin";
import { jsonError, readJson, requireDb } from "@/lib/server/http";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export const PATCH = async (request, { params }) => {
    const denied = (await requireAdmin()) ?? requireDb();
    if (denied) return denied;
    const { id } = await params;
    const body = await readJson(request);
    if (!ORDER_STATUSES.includes(body?.status)) return jsonError("Unknown status");
    if (!mongoose.isValidObjectId(id)) return jsonError("Order not found", 404);
    try {
        await connectDB();
        const order = await Order.findByIdAndUpdate(id, { status: body.status }, { new: true }).lean();
        if (!order) return jsonError("Order not found", 404);
        revalidatePath("/admin/dashboard", "layout");
        return NextResponse.json({ id: String(order._id), status: order.status });
    } catch (err) {
        return jsonError(err.message, 500);
    }
};
