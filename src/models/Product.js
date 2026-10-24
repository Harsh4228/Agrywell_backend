const crypto = require("crypto");
const mongoose = require("mongoose");

const benefitSchema = new mongoose.Schema(
  {
    title: { type: String, trim: true },
    description: { type: String, trim: true },
    icon: { type: String, trim: true },
  },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    // Legacy unique code kept for existing records; generated automatically when omitted.
    id: { type: String, required: true, unique: true, trim: true },
    name: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    tagline: { type: String, trim: true },
    image: { type: String, trim: true },
    description: { type: String, trim: true },
    features: [{ type: String, trim: true }],
    specifications: { type: Map, of: String },
    dosage: { type: Map, of: String },
    benefits: [benefitSchema],
    // Hero products are highlighted on the website (homepage section, badges, listed first).
    isHero: { type: Boolean, default: false },
  },
  { timestamps: true, toJSON: { flattenMaps: true }, toObject: { flattenMaps: true } }
);

productSchema.pre("validate", function ensureCode(next) {
  if (!this.id) {
    const base = (this.name || "product")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    this.id = `${base}-${crypto.randomBytes(3).toString("hex")}`;
  }
  next();
});

productSchema.index({ category: 1 });
productSchema.index({ isHero: 1 });

module.exports = mongoose.model("Product", productSchema);
