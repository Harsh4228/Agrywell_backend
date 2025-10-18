const mongoose = require("mongoose");

const pdfResourceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    date: { type: String, default: new Date().toLocaleString("default", { month: "long", year: "numeric" }) },
    description: { type: String, trim: true },
    pdfUrl: { type: String, required: true }, // path to file e.g. /uploads/1234.pdf
    downloadCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("PDFResource", pdfResourceSchema);
