const mongoose = require("mongoose");

const facilitySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    capacity: { type: String, required: true, trim: true },
    features: { type: [String], default: [] },
    icon: { type: String, default: "Factory" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Facility", facilitySchema);
