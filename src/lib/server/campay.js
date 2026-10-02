import "server-only";
import axios from "axios";
import mongoose from "mongoose";
import connectDB, { isDbConfigured } from "@/db/connectDB";
import Order from "@/model/Order";

// Campay (MTN Mobile Money and Orange Money, Cameroon).
// Credentials come from the Campay dashboard: either the app's API username and
// password, or a permanent access token.
const mode = () => (process.env.CAMPAY_MODE === "live" ? "live" : "demo");
const baseUrl = () =>
  process.env.CAMPAY_BASE_URL || (mode() === "live" ? "https://www.campay.net/api" : "https://demo.campay.net/api");

// Demo accounts reject payments above a small amount, so test payments are capped.
export const CAMPAY_DEMO_MAX = Number(process.env.CAMPAY_DEMO_MAX_AMOUNT) || 25;

export const isCampayConfigured = () =>
  Boolean(process.env.CAMPAY_TOKEN || (process.env.CAMPAY_USERNAME && process.env.CAMPAY_PASSWORD));

export const isCampayDemo = () => mode() === "demo";

let cachedToken = null; // { token, expiresAt }

const getToken = async () => {
  if (process.env.CAMPAY_TOKEN) return process.env.CAMPAY_TOKEN;
  if (cachedToken && cachedToken.expiresAt > Date.now()) return cachedToken.token;
  const { data } = await axios.post(
    `${baseUrl()}/token/`,
    { username: process.env.CAMPAY_USERNAME, password: process.env.CAMPAY_PASSWORD },
    { timeout: 20000 }
  );
  // Refresh a minute before Campay's expiry.
  cachedToken = { token: data.token, expiresAt: Date.now() + Math.max(60, (data.expires_in ?? 3600) - 60) * 1000 };
  return data.token;
};

const request = async (method, path, body) => {
  const token = await getToken();
  const { data } = await axios({
    method,
    url: `${baseUrl()}${path}`,
    data: body,
    timeout: 20000,
    headers: { Authorization: `Token ${token}`, "Content-Type": "application/json" },
  });
  return data;
};

// Amount Campay is asked to collect: whole XAF, capped in demo mode.
export const campayAmount = (total) => {
  const amount = Math.max(1, Math.round(total));
  return isCampayDemo() ? Math.min(amount, CAMPAY_DEMO_MAX) : amount;
};

// Creates a hosted payment page where the shopper picks MTN or Orange and confirms on their phone.
export const createPaymentLink = ({ amount, description, externalReference, redirectUrl, failureRedirectUrl }) =>
  request("post", "/get_payment_link/", {
    amount: String(amount),
    currency: "XAF",
    description: description.slice(0, 100),
    external_reference: externalReference,
    redirect_url: redirectUrl,
    failure_redirect_url: failureRedirectUrl,
    payment_options: "MOMO",
  });

// { reference, status: "PENDING" | "SUCCESSFUL" | "FAILED", amount, external_reference, operator, ... }
export const getTransaction = (reference) => request("get", `/transaction/${encodeURIComponent(reference)}/`);

const STATUS_MAP = { SUCCESSFUL: "paid", FAILED: "cancelled" };

/**
 * Asks Campay for the real status of a payment and updates the matching order.
 * Status is never taken from the redirect or webhook parameters alone.
 * Returns the order's status after syncing, or null when it can't be checked.
 */
export const syncCampayPayment = async ({ orderId, reference }) => {
  if (!isCampayConfigured() || !isDbConfigured() || !mongoose.isValidObjectId(orderId)) return null;
  await connectDB();
  const order = await Order.findById(orderId);
  if (!order || order.gateway !== "campay") return null;
  if (order.status !== "pending") return order.status;

  const ref = reference || order.paymentReference;
  if (!ref) return order.status;
  try {
    const tx = await getTransaction(ref);
    if (tx.external_reference && tx.external_reference !== String(order._id)) return order.status;
    const next = STATUS_MAP[tx.status];
    if (next) {
      order.status = next;
      order.paymentReference = tx.reference ?? ref;
      await order.save();
    }
    return order.status;
  } catch (error) {
    console.error("Could not check Campay payment:", error.response?.data ?? error.message);
    return order.status;
  }
};
