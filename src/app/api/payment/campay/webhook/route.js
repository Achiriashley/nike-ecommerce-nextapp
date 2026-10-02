import { syncCampayPayment } from "@/lib/server/campay";
import { readJson } from "@/lib/server/http";
import { NextResponse } from "next/server";

// Campay calls this when a payment changes status. Set it as the webhook URL in
// the Campay dashboard: https://<your-site>/api/payment/campay/webhook
// The parameters only tell us which order to check; the status itself is read
// back from Campay's API, so a forged call can't mark an order as paid.
const handle = async (params) => {
    const orderId = params.external_reference;
    const reference = params.reference;
    if (orderId) await syncCampayPayment({ orderId, reference });
    return NextResponse.json({ received: true });
};

export const GET = async (request) => handle(Object.fromEntries(request.nextUrl.searchParams));

export const POST = async (request) => {
    const body = (await readJson(request)) ?? {};
    return handle({ ...Object.fromEntries(request.nextUrl.searchParams), ...body });
};
