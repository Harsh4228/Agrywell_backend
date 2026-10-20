const fs = require("fs");
const path = require("path");
const PdfResource = require("../models/PdfResource");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");
const { UPLOAD_DIR, removeUploadedFile } = require("../middleware/upload");
const { pdfMeta } = require("../validators/schemas");

// Resolves a stored "/uploads/<file>" URL to an absolute path, refusing anything outside UPLOAD_DIR.
const resolveFile = (pdfUrl) => path.join(UPLOAD_DIR, path.basename(pdfUrl || ""));

exports.list = asyncHandler(async (req, res) => {
  const pdfs = await PdfResource.find().sort({ createdAt: -1 });
  res.json({ success: true, data: pdfs });
});

exports.create = asyncHandler(async (req, res) => {
  if (!req.file) throw ApiError.badRequest("A PDF file is required");
  try {
    const meta = pdfMeta.parse(req.body);
    const pdf = await PdfResource.create({
      ...meta,
      date: meta.date || undefined,
      pdfUrl: `/uploads/${req.file.filename}`,
    });
    res.status(201).json({ success: true, message: "PDF uploaded", data: pdf });
  } catch (err) {
    removeUploadedFile(req.file);
    throw err;
  }
});

exports.update = asyncHandler(async (req, res) => {
  const pdf = await PdfResource.findById(req.params.id);
  if (!pdf) {
    removeUploadedFile(req.file);
    throw ApiError.notFound("PDF not found");
  }

  try {
    const meta = pdfMeta.parse(req.body);
    const previousFile = req.file ? resolveFile(pdf.pdfUrl) : null;
    pdf.set({ ...meta, date: meta.date || pdf.date });
    if (req.file) pdf.pdfUrl = `/uploads/${req.file.filename}`;
    await pdf.save();
    if (previousFile) fs.unlink(previousFile, () => {});
    res.json({ success: true, message: "PDF updated", data: pdf });
  } catch (err) {
    removeUploadedFile(req.file);
    throw err;
  }
});

exports.download = asyncHandler(async (req, res) => {
  const pdf = await PdfResource.findByIdAndUpdate(req.params.id, { $inc: { downloadCount: 1 } }, { new: true });
  if (!pdf) throw ApiError.notFound("PDF not found");

  const filePath = resolveFile(pdf.pdfUrl);
  if (!fs.existsSync(filePath)) throw ApiError.notFound("The file for this resource is no longer available");

  const safeName = `${pdf.title.replace(/[^\w\s-]/g, "").trim() || "document"}.pdf`;
  res.download(filePath, safeName);
});

exports.remove = asyncHandler(async (req, res) => {
  const pdf = await PdfResource.findByIdAndDelete(req.params.id);
  if (!pdf) throw ApiError.notFound("PDF not found");
  fs.unlink(resolveFile(pdf.pdfUrl), () => {});
  res.json({ success: true, message: "PDF deleted" });
});
