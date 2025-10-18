const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  category: { type: String, required: true },
  tagline: { type: String },
  image: { type: String },
  description: { type: String },

  features: [{ type: String }],

  specifications: { type: Map, of: String },
  dosage: { type: Map, of: String },

  benefits: [
    {
      title: String,
      description: String,
      icon: String, // We'll store icon name as string (like "Leaf", "ShieldCheck")
    },
  ],
});

module.exports = mongoose.model("Product", productSchema);

