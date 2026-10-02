// Imports the starter catalog into MongoDB (skips products whose slug already exists).
// Usage: npm run seed   (reads MONGO_DB from the environment or .env.local)
import fs from "fs";
import mongoose from "mongoose";

// The catalog file uses ES module syntax; loading it from its source keeps this
// script working on Node 20, which won't import it directly.
const catalogSource = fs.readFileSync(new URL("../src/data/catalog.js", import.meta.url), "utf8");
const { catalog } = await import(`data:text/javascript;base64,${Buffer.from(catalogSource).toString("base64")}`);

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

await mongoose.connect(process.env.MONGO_DB);
const products = mongoose.connection.collection("products");
const existing = new Set((await products.find({}, { projection: { slug: 1 } }).toArray()).map((p) => p.slug));
const now = new Date();
const missing = catalog
  .filter((p) => !existing.has(p.slug))
  .map((p) => ({ ...p, price: String(p.price), releasedAt: new Date(p.releasedAt), createdAt: now, updatedAt: now, __v: 0 }));
if (missing.length) await products.insertMany(missing);
console.log(`Inserted ${missing.length} products (${existing.size} already present).`);
await mongoose.disconnect();
