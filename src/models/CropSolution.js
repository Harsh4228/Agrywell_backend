const mongoose = require("mongoose");

const cropSolutionSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    icon: { type: String, default: "Sprout" },
    image: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    diseases: [{ type: String, trim: true }],
    solutions: [
      {
        _id: false,
        name: { type: String, required: true, trim: true },
        type: { type: String, required: true, trim: true },
      },
    ],
    tips: [{ type: String, trim: true }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("CropSolution", cropSolutionSchema);
