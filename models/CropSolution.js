const mongoose = require("mongoose");

const cropSolutionSchema = new mongoose.Schema(
  {
    name: { type: String, required: true }, // e.g. "Rice"
    icon: { type: String, default: "Sprout" },
    image: { type: String, required: true }, // image URL or file path
    description: { type: String, required: true },

    diseases: [{ type: String }],

    solutions: [
      {
        name: { type: String, required: true },
        type: { type: String, required: true }, // e.g. "Disease Control"
      },
    ],

    tips: [{ type: String }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("CropSolution", cropSolutionSchema);
