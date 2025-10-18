const mongoose = require("mongoose");

const videoSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    crop: { type: String, required: true },
    category: { type: String, required: true },
    duration: { type: String, required: true },
    views: { type: String, default: "0" },
    description: { type: String, required: true },
    thumbnail: { type: String, required: true },
    expert: { type: String, required: true },
    videoUrl: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Video", videoSchema);
