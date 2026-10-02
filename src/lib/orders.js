export const ORDER_STATUS_TONES = { pending: "brand", paid: "success", shipped: "dark", delivered: "success", cancelled: "muted" };

export const orderRef = (id) => `#${String(id).slice(-8).toUpperCase()}`;
