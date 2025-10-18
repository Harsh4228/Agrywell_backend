const mongoose = require("mongoose");

const facilitySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    capacity: { type: String, required: true },
    features: { type: [String], default: [] }, // array of features
    icon: { type: String, default: "" }, // store icon name like "Factory"
  },
  { timestamps: true }
);

module.exports = mongoose.model("Facility", facilitySchema);

    