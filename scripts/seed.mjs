// Imports the starter catalog into MongoDB (skips products whose slug already exists).
// Usage: npm run seed   (reads MONGO_DB from the environment or .env.local)
import mongoose from "mongoose";
import { catalog } from "../src/data/catalog.js";

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

const { default: Product } = await import("../src/model/Product.js");

await mongoose.connect(process.env.MONGO_DB);
const existing = new Set((await Product.find({}, { slug: 1 }).lean()).map((p) => p.slug));
const missing = catalog
  .filter((p) => !existing.has(p.slug))
  .map((p) => ({ ...p, price: String(p.price), releasedAt: new Date(p.releasedAt) }));
if (missing.length) await Product.insertMany(missing);
console.log(`Inserted ${missing.length} products (${existing.size} already present).`);
await mongoose.disconnect();
