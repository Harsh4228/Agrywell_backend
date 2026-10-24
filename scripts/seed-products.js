/**
 * Imports the brochure product catalogue (scripts/data/products.json) into MongoDB.
 * Products are matched by their `id` code, so re-running updates them instead of creating duplicates.
 * Products added from the admin dashboard are left untouched.
 *
 * Image URLs come from scripts/data/product-images.json (Cloudinary, written by
 * `npm run upload:product-images`). Without it they fall back to the website's /products/*.webp files on SITE_URL.
 * Usage: npm run seed:products
 */
const fs = require("fs");
const path = require("path");
require("../src/config/env");
const { connectDB, disconnectDB } = require("../src/config/db");
const Product = require("../src/models/Product");

const SITE_URL = (process.env.SITE_URL || "https://www.agriwellindia.com").replace(/\/$/, "");
const IMAGE_MAP = path.join(__dirname, "data", "product-images.json");

async function main() {
  const catalog = require(path.join(__dirname, "data", "products.json"));
  const hosted = fs.existsSync(IMAGE_MAP) ? require(IMAGE_MAP) : {};
  const missing = catalog.filter((p) => !hosted[p.image]).length;
  if (missing) console.log(`${missing} product image(s) not on Cloudinary — using ${SITE_URL}/products/… instead`);
  await connectDB();

  const ops = catalog.map((p) => ({
    updateOne: {
      filter: { id: p.id },
      update: {
        $set: {
          id: p.id,
          name: p.name,
          category: p.category,
          tagline: p.tagline,
          image: hosted[p.image] || `${SITE_URL}${p.image}`,
          description: p.description,
          specifications: p.specifications,
          dosage: p.dosage,
        },
      },
      upsert: true,
    },
  }));

  const result = await Product.bulkWrite(ops, { ordered: false });
  console.log(`Products: ${result.upsertedCount} created, ${result.modifiedCount} updated (${catalog.length} in catalogue)`);
}

main()
  .catch((err) => {
    console.error(err.message);
    process.exitCode = 1;
  })
  .finally(() => disconnectDB());
