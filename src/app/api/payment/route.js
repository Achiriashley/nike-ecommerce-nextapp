import axios from 'axios';
import { priceCart, createPendingOrder, attachPaymentUrl, discardOrder, originOf, providerError } from "@/lib/server/checkout";
import { getShopper } from "@/lib/server/shopper";
import { jsonError, readJson } from "@/lib/server/http";
import { STORE_NAME } from "@/config/store";
import { NextResponse } from "next/server";

// Crypto checkout through Coinbase Commerce. The charge is created on the
// server so the API key and the order total never come from the browser.
export const POST = async (request) => {
    const apiKey = process.env.COINBASE_API_KEY || process.env.NEXT_PUBLIC_COINBASE_API_KEY;
    if (!apiKey) return jsonError("Crypto payments are not configured", 503);

    const priced = await priceCart((await readJson(request))?.items);
    if (priced.error) return jsonError(priced.error);

    const shopper = await getShopper();
    const order = await createPendingOrder({ priced, provider: "crypto", userId: shopper?.userId, email: shopper?.email });
    const origin = originOf(request);

    try {
        const response = await axios.post('https://api.commerce.coinbase.com/charges', {
            name: `${STORE_NAME} order`,
            description: priced.lines.map((l) => `${l.quantity} × ${l.title}`).join(", ").slice(0, 200),
            local_price: { amount: String(priced.total), currency: priced.currency },
            pricing_type: "fixed_price",
            redirect_url: `${origin}/checkout/success${order ? `?order=${order._id}` : ""}`,
            cancel_url: `${origin}/cart`,
            metadata: { orderId: order ? String(order._id) : "" },
        }, {
            headers: { "X-CC-Api-Key": apiKey, "X-CC-Version": "2018-03-22", 'Content-Type': 'application/json', 'Accept': 'application/json' },
        });
        const url = response.data?.data?.hosted_url;
        if (!url) {
            await discardOrder(order);
            return jsonError("The payment provider did not return a checkout link", 502);
        }
        await attachPaymentUrl(order, url);
        return NextResponse.json({ url, orderId: order ? String(order._id) : null });
    } catch (error) {
        console.error('error from coinBase func:', error.response?.data ?? error.message);
        await discardOrder(order);
        return jsonError(`Coinbase could not start the checkout: ${providerError(error)}`, 502);
    }
};
