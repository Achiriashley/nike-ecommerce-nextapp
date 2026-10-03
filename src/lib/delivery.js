// Delivery details collected at checkout. Shared by the bag form (instant
// feedback) and the payment routes (the check that counts).

export const DELIVERY_CITIES = [
  "Douala",
  "Yaoundé",
  "Bafoussam",
  "Bamenda",
  "Buea",
  "Limbe",
  "Kribi",
  "Kumba",
  "Dschang",
  "Garoua",
  "Maroua",
  "Ngaoundéré",
  "Bertoua",
  "Ebolowa",
];

export const EMPTY_DELIVERY = { name: "", phone: "", email: "", city: "", address: "", notes: "" };

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// Cameroon numbers: 9 digits starting with 6 (mobile) or 2 (landline), with or
// without the +237 / 237 / 00237 prefix. Returns "+237 6XX XX XX XX" or null.
export const normalizeCameroonPhone = (value) => {
  let digits = String(value ?? "").replace(/[^\d]/g, "");
  if (digits.startsWith("00237")) digits = digits.slice(5);
  else if (digits.startsWith("237") && digits.length === 12) digits = digits.slice(3);
  if (!/^[62]\d{8}$/.test(digits)) return null;
  return `+237 ${digits.slice(0, 3)} ${digits.slice(3, 5)} ${digits.slice(5, 7)} ${digits.slice(7)}`;
};

const clean = (value, max) => String(value ?? "").replace(/\s+/g, " ").trim().slice(0, max);

/**
 * Validates delivery details. Returns { data } when valid, otherwise
 * { errors: { field: message } }.
 */
export const validateDelivery = (input) => {
  const d = input && typeof input === "object" ? input : {};
  const name = clean(d.name, 80);
  const phone = normalizeCameroonPhone(d.phone);
  const email = clean(d.email, 120).toLowerCase();
  const city = clean(d.city, 60);
  const address = clean(d.address, 200);
  const notes = clean(d.notes, 300);

  const errors = {};
  if (name.length < 2) errors.name = "Enter the name of the person receiving the order";
  if (!phone) errors.phone = "Enter a Cameroon phone number, e.g. 6 70 00 00 00";
  if (email && !EMAIL.test(email)) errors.email = "Enter a valid email address, or leave it empty";
  if (city.length < 2) errors.city = "Choose or type your city";
  if (address.length < 5) errors.address = "Add your neighbourhood and a landmark so the rider can find you";

  return Object.keys(errors).length
    ? { errors }
    : { data: { name, phone, email: email || undefined, city, address, notes: notes || undefined } };
};
