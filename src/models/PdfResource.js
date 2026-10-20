const mongoose = require("mongoose");

const currentMonth = () => new Date().toLocaleString("en-US", { month: "long", year: "numeric" });

const pdfResourceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    date: { type: String, default: currentMonth },
    description: { type: String, trim: true },
    pdfUrl: { type: String, required: true }, // e.g. /uploads/1700000000000-ab12cd.pdf
    downloadCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("PDFResource", pdfResourceSchema);
