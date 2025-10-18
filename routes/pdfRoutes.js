const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");
const upload = require("../middleware/upload"); // your multer middleware
const PDFResource = require("../models/pdfResource"); // your mongoose model

// POST /api/pdfs/upload
router.post("/upload", (req, res) => {
  upload.single("file")(req, res, async function (err) {
    try {
      // multer errors first
      if (err instanceof require("multer").MulterError) {
        return res.status(400).json({ success: false, message: err.message });
      } else if (err) {
        return res.status(400).json({ success: false, message: err.message });
      }

      // validate body
      const { title, category, description, date } = req.body;
      if (!title || !category) {
        // delete file if exist
        if (req.file && req.file.path) {
          fs.unlink(req.file.path, () => {});
        }
        return res.status(400).json({ success: false, message: "Title and category required" });
      }

      if (!req.file) {
        return res.status(400).json({ success: false, message: "No PDF file uploaded" });
      }

      // build pdfUrl relative to server root
      const pdfUrl = `/uploads/${req.file.filename}`;

      const pdf = new PDFResource({
        title,
        category,
        description,
        date: date || new Date().toLocaleString("default", { month: "long", year: "numeric" }),
        pdfUrl,
      });

      await pdf.save();
      return res.status(201).json({ success: true, message: "PDF uploaded successfully", pdf });
    } catch (error) {
      console.error("Upload route error:", error);
      // cleanup file if exists
      if (req.file && req.file.path) {
        fs.unlink(req.file.path, () => {});
      }
      return res.status(500).json({ success: false, message: "Server error" });
    }
  });
});

// GET /api/pdfs -> all pdfs
router.get("/", async (req, res) => {
  try {
    const pdfs = await PDFResource.find().sort({ createdAt: -1 });
    // return as array (your frontend expects array)
    return res.status(200).json(pdfs);
  } catch (err) {
    console.error("Get PDFs error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

// GET /api/pdfs/download/:id -> download & increment
router.get("/download/:id", async (req, res) => {
  try {
    const pdf = await PDFResource.findById(req.params.id);
    if (!pdf) return res.status(404).json({ message: "PDF not found" });

    pdf.downloadCount = (pdf.downloadCount || 0) + 1;
    await pdf.save();

    const filePath = path.join(__dirname, "../", pdf.pdfUrl); // ../uploads/filename
    return res.download(filePath);
  } catch (err) {
    console.error("Download error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

// DELETE /api/pdfs/:id
router.delete("/:id", async (req, res) => {
  try {
    const pdf = await PDFResource.findByIdAndDelete(req.params.id);
    if (!pdf) return res.status(404).json({ message: "PDF not found" });

    // delete file from disk (optional & recommended)
    const filePath = path.join(__dirname, "../", pdf.pdfUrl);
    fs.unlink(filePath, (err) => {
      if (err) console.warn("Failed to delete file:", err.message);
    });

    return res.status(200).json({ message: "PDF deleted successfully" });
  } catch (err) {
    console.error("Delete PDF error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
