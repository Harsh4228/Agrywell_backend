const mongoose = require("mongoose");

const videoSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    crop: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    duration: { type: String, required: true, trim: true },
    views: { type: String, default: "0" },
    description: { type: String, required: true, trim: true },
    thumbnail: { type: String, required: true, trim: true },
    expert: { type: String, required: true, trim: true },
    videoUrl: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Video", videoSchema);
