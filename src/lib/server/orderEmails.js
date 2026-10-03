import "server-only";
import nodemailer from "nodemailer";
import { after } from "next/server";
import connectDB, { isDbConfigured } from "@/db/connectDB";
import Order from "@/model/Order";
import { STORE_NAME } from "@/config/store";
import { formatPrice } from "@/lib/format";
import { orderRef } from "@/lib/orders";

// Order emails go out over SMTP. With Gmail: SMTP_USER is the Gmail address and
// SMTP_PASS is an app password (Google Account → Security → App passwords).
// Without SMTP_USER and SMTP_PASS, no emails are sent and checkout works as before.
export const isMailConfigured = () => Boolean(process.env.SMTP_USER && process.env.SMTP_PASS);

const storeInbox = () => process.env.ORDER_NOTIFY_EMAIL || process.env.ADMIN_EMAIL || process.env.SMTP_USER;
const siteUrl = () => process.env.SITE_URL?.replace(/\/+$/, "") || null;

let transport = null;
const getTransport = () => {
  if (!transport) {
    const port = Number(process.env.SMTP_PORT) || 465;
    transport = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port,
      secure: port === 465,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });
  }
  return transport;
};

const send = (message) =>
  getTransport().sendMail({ from: process.env.MAIL_FROM || `"${STORE_NAME}" <${process.env.SMTP_USER}>`, ...message });

const escape = (value) =>
  String(value ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

const itemLabel = (item) => `${item.quantity} × ${item.title}${[item.colorway, item.size && `size ${item.size}`].filter(Boolean).map((s) => `, ${s}`).join("")}`;

const itemsText = (order) =>
  [
    ...order.items.map((i) => `${itemLabel(i)}: ${formatPrice(i.unitPrice * i.quantity)}`),
    `Delivery: ${order.shipping ? formatPrice(order.shipping) : "Free"}`,
    `Total: ${formatPrice(order.total)}`,
  ].join("\n");

const itemsHtml = (order) => {
  const row = (label, value, bold) =>
    `<tr><td style="padding:6px 0;${bold ? "font-weight:700;border-top:1px solid #e5e5e5;" : ""}">${label}</td><td style="padding:6px 0;text-align:right;white-space:nowrap;${bold ? "font-weight:700;border-top:1px solid #e5e5e5;" : ""}">${value}</td></tr>`;
  return `<table style="width:100%;border-collapse:collapse;font-size:14px">${[
    ...order.items.map((i) => row(escape(itemLabel(i)), formatPrice(i.unitPrice * i.quantity))),
    row("Delivery", order.shipping ? formatPrice(order.shipping) : "Free"),
    row("Total", formatPrice(order.total), true),
  ].join("")}</table>`;
};

const deliveryLines = (d) =>
  d ? [d.name, `${d.address}, ${d.city}`, d.phone, d.notes && `Notes: ${d.notes}`].filter(Boolean) : ["No delivery details"];

const layout = (body) =>
  `<div style="font-family:Arial,Helvetica,sans-serif;color:#111;max-width:560px;margin:0 auto;padding:24px">
    <p style="font-size:22px;font-weight:900;font-style:italic;margin:0 0 20px">Ash<span style="color:#c2410c">Kicks</span></p>
    ${body}
  </div>`;

const customerEmail = (order, to) => {
  const ref = orderRef(order._id);
  const d = order.delivery;
  const account = order.userId && siteUrl() ? `${siteUrl()}/account` : null;
  const callLine = d ? `We’ll call you on ${d.phone} to arrange delivery.` : "We’ll be in touch to arrange delivery.";
  return {
    to,
    replyTo: storeInbox(),
    subject: `Your ${STORE_NAME} order ${ref} is confirmed`,
    text: [
      `Hi ${d?.name ?? "there"},`,
      "",
      `Thanks for shopping with ${STORE_NAME}. We’ve received your payment for order ${ref}.`,
      callLine,
      "",
      itemsText(order),
      "",
      "Delivering to:",
      ...deliveryLines(d),
      "",
      account ? `Track your order: ${account}` : null,
      "Questions? Just reply to this email.",
    ].filter((l) => l !== null).join("\n"),
    html: layout(`
      <h1 style="font-size:20px;margin:0 0 8px">Thanks${d ? `, ${escape(d.name.split(" ")[0])}` : ""}! Your order is confirmed.</h1>
      <p style="margin:0 0 20px;color:#525252">We’ve received your payment for order <strong>${ref}</strong>. ${escape(callLine)}</p>
      ${itemsHtml(order)}
      <h2 style="font-size:15px;margin:24px 0 6px">Delivering to</h2>
      <p style="margin:0;color:#404040;line-height:1.6">${deliveryLines(d).map(escape).join("<br>")}</p>
      ${account ? `<p style="margin:24px 0 0"><a href="${escape(account)}" style="background:#111;color:#fff;padding:12px 20px;border-radius:999px;text-decoration:none;font-weight:700">Track your order</a></p>` : ""}
      <p style="margin:24px 0 0;color:#737373;font-size:13px">Questions? Just reply to this email.</p>`),
  };
};

const storeEmail = (order) => {
  const ref = orderRef(order._id);
  const d = order.delivery;
  const admin = siteUrl() ? `${siteUrl()}/admin/dashboard/orders` : null;
  const customer = [d?.email || order.email, order.userId ? "signed-in customer" : "guest"].filter(Boolean).join(" · ");
  const gateway = { campay: "Campay (mobile money)", payunit: "PayUnit (mobile money)", mobile: "mobile money", crypto: "crypto" };
  const payment = [gateway[order.gateway ?? order.provider] ?? order.gateway, order.paymentReference && `ref ${order.paymentReference}`].filter(Boolean).join(", ");
  return {
    to: storeInbox(),
    replyTo: d?.email || order.email || undefined,
    subject: `New paid order ${ref}: ${formatPrice(order.total)}${d ? ` · ${d.city}` : ""}`,
    text: [
      `Order ${ref} has been paid (${payment}).`,
      "",
      "Deliver to:",
      ...deliveryLines(d),
      customer,
      "",
      itemsText(order),
      admin ? `\nManage it: ${admin}` : null,
    ].filter((l) => l !== null).join("\n"),
    html: layout(`
      <h1 style="font-size:20px;margin:0 0 8px">New paid order ${ref}</h1>
      <p style="margin:0 0 20px;color:#525252">${escape(formatPrice(order.total))} paid via ${escape(payment)}.</p>
      <h2 style="font-size:15px;margin:0 0 6px">Deliver to</h2>
      <p style="margin:0 0 4px;color:#404040;line-height:1.6">${deliveryLines(d).map(escape).join("<br>")}</p>
      ${d ? `<p style="margin:0 0 4px"><a href="tel:${escape(d.phone.replace(/\s/g, ""))}">Call ${escape(d.phone)}</a></p>` : ""}
      <p style="margin:0 0 20px;color:#737373;font-size:13px">${escape(customer)}</p>
      ${itemsHtml(order)}
      ${admin ? `<p style="margin:24px 0 0"><a href="${escape(admin)}" style="background:#111;color:#fff;padding:12px 20px;border-radius:999px;text-decoration:none;font-weight:700">Open orders</a></p>` : ""}`),
  };
};

/**
 * Sends the "order paid" emails: a confirmation to the customer (when there's an
 * email address) and, unless notifyStore is false, an alert to the store inbox.
 * Each order is emailed at most once, even if several requests mark it paid together.
 */
export const sendOrderPaidEmails = async (orderId, { notifyStore = true } = {}) => {
  if (!isMailConfigured() || !isDbConfigured()) return;
  await connectDB();
  const order = await Order.findOneAndUpdate(
    { _id: orderId, status: "paid", paidEmailSentAt: null },
    { $set: { paidEmailSentAt: new Date() } },
    { new: true }
  ).lean();
  if (!order) return;

  const customer = order.delivery?.email || order.email;
  const messages = [customer && customerEmail(order, customer), notifyStore && storeInbox() && storeEmail(order)].filter(Boolean);
  const results = await Promise.allSettled(messages.map(send));
  results.forEach((r) => r.status === "rejected" && console.error(`Order email for ${orderRef(order._id)} failed:`, r.reason?.message));

  // Nothing went out (e.g. a wrong app password): allow a later retry, such as an admin re-marking it paid.
  if (messages.length && results.every((r) => r.status === "rejected")) {
    await Order.updateOne({ _id: order._id }, { $unset: { paidEmailSentAt: 1 } });
  }
};

// Sends the emails after the response is returned, so shoppers aren't kept waiting on SMTP.
export const sendOrderPaidEmailsLater = (orderId, options) => {
  if (!isMailConfigured()) return;
  const task = () => sendOrderPaidEmails(String(orderId), options).catch((e) => console.error("Order email failed:", e.message));
  try {
    after(task);
  } catch {
    void task();
  }
};
