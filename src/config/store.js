// Store-wide settings. Policy values here are shown to shoppers and used by
// checkout, so keep them in sync with what the business actually offers.
export const STORE_NAME = "Nike Store";
// All prices are in Central African CFA francs (FCFA / XAF), whole numbers only.
export const CURRENCY_LABEL = "FCFA";
// Currency code sent to the payment providers.
export const PAYMENT_CURRENCY = "XAF";
export const FREE_SHIPPING_THRESHOLD = 100000;
export const FLAT_SHIPPING = 2500;
export const RETURN_DAYS = 30;
export const MAX_QUANTITY = 10;

export const CATEGORIES = [
  { slug: "Lifestyle", label: "Lifestyle", blurb: "Everyday icons" },
  { slug: "Training", label: "Training", blurb: "Built for the gym" },
  { slug: "Basketball", label: "Basketball", blurb: "Court-ready" },
  { slug: "Golf", label: "Golf", blurb: "Tour stability" },
];

export const GENDERS = [
  { slug: "men", label: "Men" },
  { slug: "women", label: "Women" },
  { slug: "kids", label: "Kids" },
  { slug: "unisex", label: "Unisex" },
];

export const shippingFor = (subtotal) =>
  subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : FLAT_SHIPPING;
