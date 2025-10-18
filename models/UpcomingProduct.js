const mongoose = require("mongoose");

const upcomingProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: { type: String, required: true },
    expectedLaunch: { type: String, required: true },
    status: {
      type: String,
      enum: ["In Development", "Testing Phase", "Research Phase"],
      default: "In Development",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("UpcomingProduct", upcomingProductSchema);
