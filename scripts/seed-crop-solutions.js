/**
 * Imports crop-wise guidance (scripts/data/crop-solutions.json) into MongoDB.
 * Crop photos are uploaded to Cloudinary (agriwell/crops/<photo>) from the website's brand assets.
 * Crops are matched by name, so re-running updates them; other crops are left untouched.
 *
 * Usage: npm run seed:crops [-- <photos dir>]   (defaults to ../agrywell-grow-wise/src/assets/brand)
 */
const fs = require("fs");
const path = require("path");
const env = require("../src/config/env");
const { connectDB, disconnectDB } = require("../src/config/db");
const { cloudinary, isConfigured, optimizedUrl } = require("../src/config/cloudinary");
const CropSolution = require("../src/models/CropSolution");

const PHOTOS_DIR = path.resolve(process.argv[2] || path.join(__dirname, "..", "..", "agrywell-grow-wise", "src", "assets", "brand"));

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

async function uploadPhoto(name) {
  const file = ["webp", "jpg", "png"].map((ext) => path.join(PHOTOS_DIR, `${name}.${ext}`)).find((f) => fs.existsSync(f));
  if (!file) throw new Error(`Photo not found: ${name} in ${PHOTOS_DIR}`);
  const result = await cloudinary.uploader.upload(file, {
    folder: `${env.CLOUDINARY_FOLDER}/crops`,
    public_id: name,
    overwrite: true,
    unique_filename: false,
  });
  return optimizedUrl(result.public_id, result.version);
}

async function main() {
  if (!isConfigured) throw new Error("Set the CLOUDINARY_* keys in .env first");
  const crops = require(path.join(__dirname, "data", "crop-solutions.json"));
  await connectDB();

  let created = 0;
  let updated = 0;
  for (const { photo, ...crop } of crops) {
    const image = await uploadPhoto(photo);
    const existing = await CropSolution.findOne({ name: new RegExp(`^${escapeRegex(crop.name)}$`, "i") });
    if (existing) {
      existing.set({ ...crop, image });
      await existing.save();
      updated += 1;
    } else {
      await CropSolution.create({ ...crop, image });
      created += 1;
    }
  }
  console.log(`Crop solutions: ${created} created, ${updated} updated`);
}

main()
  .catch((err) => {
    console.error(err.message || err);
    process.exitCode = 1;
  })
  .finally(() => disconnectDB());
