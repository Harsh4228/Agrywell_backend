const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const env = require("../config/env");
const ApiError = require("../utils/ApiError");

const UPLOAD_DIR = path.resolve(__dirname, "../../uploads");
fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${crypto.randomBytes(6).toString("hex")}.pdf`),
});

const uploadPdf = multer({
  storage,
  limits: { fileSize: env.UPLOAD_MAX_MB * 1024 * 1024, files: 1 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") return cb(null, true);
    cb(ApiError.badRequest("Only PDF files are allowed"));
  },
});

const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif", "image/gif"];

// Images are kept in memory and streamed straight to Cloudinary.
const uploadImage = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: env.UPLOAD_MAX_MB * 1024 * 1024, files: 1 },
  fileFilter: (req, file, cb) => {
    if (IMAGE_TYPES.includes(file.mimetype)) return cb(null, true);
    cb(ApiError.badRequest("Only JPG, PNG, WebP, AVIF or GIF images are allowed"));
  },
});

function removeUploadedFile(file) {
  if (file && file.path) fs.unlink(file.path, () => {});
}

module.exports = { UPLOAD_DIR, uploadPdf, uploadImage, removeUploadedFile };
