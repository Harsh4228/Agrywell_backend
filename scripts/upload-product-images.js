/**
 * Uploads the brochure product photos to Cloudinary (agriwell/products/pNNN) and writes
 * scripts/data/product-images.json, which seed-products.js uses for each product's image URL.
 * Re-running overwrites the same public IDs, so it never creates duplicates.
 *
 * Usage: npm run upload:product-images [-- <images dir>]
 *        (defaults to ../agrywell-grow-wise/public/products)
 */
const fs = require("fs");
const path = require("path");
const env = require("../src/config/env");
const { cloudinary, isConfigured, optimizedUrl } = require("../src/config/cloudinary");

const IMAGES_DIR = path.resolve(process.argv[2] || path.join(__dirname, "..", "..", "agrywell-grow-wise", "public", "products"));
const OUTPUT = path.join(__dirname, "data", "product-images.json");
const CONCURRENCY = 5;

async function main() {
  if (!isConfigured) throw new Error("Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET in .env first");
  const files = fs.readdirSync(IMAGES_DIR).filter((f) => /\.(webp|png|jpe?g)$/i.test(f)).sort();
  if (!files.length) throw new Error(`No images found in ${IMAGES_DIR}`);

  const map = {};
  let done = 0;
  const queue = [...files];
  async function worker() {
    for (let file = queue.shift(); file; file = queue.shift()) {
      const name = path.parse(file).name;
      const result = await cloudinary.uploader.upload(path.join(IMAGES_DIR, file), {
        folder: `${env.CLOUDINARY_FOLDER}/products`,
        public_id: name,
        overwrite: true,
        unique_filename: false,
        resource_type: "image",
      });
      map[`/products/${file}`] = optimizedUrl(result.public_id, result.version);
      done += 1;
      if (done % 20 === 0 || done === files.length) console.log(`Uploaded ${done}/${files.length}`);
    }
  }
  await Promise.all(Array.from({ length: CONCURRENCY }, worker));

  const sorted = Object.fromEntries(Object.entries(map).sort(([a], [b]) => a.localeCompare(b)));
  fs.writeFileSync(OUTPUT, `${JSON.stringify(sorted, null, 1)}\n`);
  console.log(`Saved ${Object.keys(sorted).length} image URLs to ${path.relative(process.cwd(), OUTPUT)}`);
}

main().catch((err) => {
  console.error(err.message || err);
  process.exitCode = 1;
});
