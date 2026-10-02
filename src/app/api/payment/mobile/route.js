import axios from "axios";
import crypto from "crypto";
import { BASE_URL } from "@/utils/constants";
import { priceCart, createPendingOrder, attachPaymentUrl, discardOrder, originOf, providerError } from "@/lib/server/checkout";
import { getShopper } from "@/lib/server/shopper";
import { jsonError, readJson } from "@/lib/server/http";
import { NextResponse } from "next/server";

// PayUnit mobile-money checkout, moved server-side from utils/helpers.js.
// The fallbacks are the sandbox credentials the project already used; set the
// env vars to use your own account.
const credentials = () => ({
    apiKey: process.env.PAYUNIT_API_KEY || "sand_SP7SdVsJ67SX6al7pAHfy4tWBTfV2n",
    user: process.env.PAYUNIT_API_USER || "6e1250ec-4188-4d9c-9838-f17a0467fd8b",
    password: process.env.PAYUNIT_API_PASSWORD || "297056d5-9fa3-4e46-88dc-a631dac247e5",
    mode: process.env.PAYUNIT_MODE || "test",
    notifyUrl: process.env.PAYUNIT_NOTIFY_URL || "https://webhook.site/d457b2f3-dd71-4f04-9af5-e2fcf3be8f34",
});

export const POST = async (request) => {
    const priced = await priceCart((await readJson(request))?.items);
    if (priced.error) return jsonError(priced.error);

    const shopper = await getShopper();
    const order = await createPendingOrder({ priced, provider: "mobile", userId: shopper?.userId, email: shopper?.email });
    const origin = originOf(request);
    const { apiKey, user, password, mode, notifyUrl } = credentials();
    const transactionId = `pu-${order ? order._id : crypto.randomUUID()}`;

    const payload = {
        total_amount: priced.total,
        currency: priced.currency,
        mode: "payment",
        transaction_id: transactionId,
        success_url: `${origin}/checkout/success${order ? `?order=${order._id}` : ""}`,
        cancel_url: `${origin}/cart`,
        return_url: notifyUrl,
        notify_url: notifyUrl,
        items: [
            ...priced.lines.map((line) => ({
                price_description: { unit_amount: line.unitPrice },
                product_description: { name: line.title, image_url: line.image ? `${origin}${line.image}` : undefined, about_product: line.colorway },
                quantity: line.quantity,
            })),
            ...(priced.shipping ? [{ price_description: { unit_amount: priced.shipping }, product_description: { name: "Delivery" }, quantity: 1 }] : []),
        ],
        meta: { phone_number_collection: false, address_collection: false },
    };

    try {
        const result = await axios.post(`${BASE_URL}/api/gateway/checkout/initialize`, payload, {
            timeout: 20000,
            headers: {
                "x-api-key": apiKey,
                mode,
                "Content-Type": "application/json",
                Authorization: `Basic ${Buffer.from(`${user}:${password}`).toString("base64")}`,
            },
        });
        const url = result.data?.data?.redirect;
        if (!url) {
            await discardOrder(order);
            return jsonError("The payment provider did not return a checkout link", 502);
        }
        await attachPaymentUrl(order, url);
        return NextResponse.json({ url, orderId: order ? String(order._id) : null });
    } catch (error) {
        console.log("error for mobile payment", error.response?.data ?? error.message);
        await discardOrder(order);
        return jsonError(`PayUnit could not start the checkout: ${providerError(error)}`, 502);
    }
};
