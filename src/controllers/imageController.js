const crypto = require("crypto");
const env = require("../config/env");
const { isConfigured, optimizedUrl, uploadBuffer } = require("../config/cloudinary");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");

// Keeps uploads organised by what they are for, e.g. agriwell/products.
const FOLDERS = ["products", "crops", "videos", "general"];

const upload = asyncHandler(async (req, res) => {
  if (!isConfigured) throw new ApiError(503, "Image uploads are not configured on the server (missing Cloudinary keys)");
  if (!req.file) throw ApiError.badRequest("Choose an image to upload");

  const folder = FOLDERS.includes(req.body.folder) ? req.body.folder : "general";
  const base = (req.file.originalname || "image")
    .replace(/\.[^.]+$/, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 40) || "image";

  const result = await uploadBuffer(req.file.buffer, {
    folder: `${env.CLOUDINARY_FOLDER}/${folder}`,
    public_id: `${base}-${crypto.randomBytes(3).toString("hex")}`,
  });

  res.status(201).json({
    success: true,
    message: "Image uploaded",
    data: { url: optimizedUrl(result.public_id, result.version), publicId: result.public_id, width: result.width, height: result.height },
  });
});

module.exports = { upload };
