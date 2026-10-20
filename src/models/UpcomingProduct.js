const mongoose = require("mongoose");

const UPCOMING_STATUSES = ["Research Phase", "In Development", "Testing Phase"];

const upcomingProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    expectedLaunch: { type: String, required: true, trim: true },
    status: { type: String, enum: UPCOMING_STATUSES, default: "In Development" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("UpcomingProduct", upcomingProductSchema);
module.exports.UPCOMING_STATUSES = UPCOMING_STATUSES;
