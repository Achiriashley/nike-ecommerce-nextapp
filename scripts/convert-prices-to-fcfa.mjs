// One-time conversion of product prices stored in US dollars to FCFA.
// Only prices below 1 000 are treated as dollars (no shoe sells for under
// 1 000 FCFA), so running it twice is safe.
// Usage: npm run prices:fcfa            (preview)
//        npm run prices:fcfa -- --apply (save changes)
import mongoose from "mongoose";

for (const file of [".env.local", ".env"]) {
  try {
    process.loadEnvFile(file);
  } catch {
    /* file not present */
  }
}

if (!process.env.MONGO_DB) {
  console.error("MONGO_DB is not set.");
  process.exit(1);
}

const RATE = Number(process.env.USD_TO_FCFA) || 600;
const apply = process.argv.includes("--apply");
const toFcfa = (usd) => Math.round((usd * RATE) / 500) * 500;
const looksLikeDollars = (value) => {
  const n = parseFloat(String(value ?? "").replace(/[^0-9.]/g, ""));
  return Number.isFinite(n) && n > 0 && n < 1000 ? n : null;
};

// Works on the raw collection so the script runs on any Node version
// (the app's model files use ES module syntax that Node 20 can't load here).
await mongoose.connect(process.env.MONGO_DB);
const products = mongoose.connection.collection("products");

let changed = 0;
for (const product of await products.find().toArray()) {
  const price = looksLikeDollars(product.price);
  const compare = looksLikeDollars(product.compareAtPrice);
  if (price === null && compare === null) continue;
  const update = {};
  if (price !== null) update.price = String(toFcfa(price));
  if (compare !== null) update.compareAtPrice = toFcfa(compare);
  console.log(`${product.title} ${product.colorway ?? ""}: ${product.price} -> ${update.price ?? product.price} FCFA`);
  if (apply) await products.updateOne({ _id: product._id }, { $set: update });
  changed++;
}

console.log(
  changed === 0
    ? "Nothing to convert: all prices already look like FCFA."
    : apply
      ? `Converted ${changed} products to FCFA (rate ${RATE}).`
      : `${changed} products would be converted (rate ${RATE}). Run again with --apply to save.`
);
await mongoose.disconnect();
