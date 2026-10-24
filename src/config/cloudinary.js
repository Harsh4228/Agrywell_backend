const { v2: cloudinary } = require("cloudinary");
const env = require("./env");

const isConfigured = Boolean(env.CLOUDINARY_CLOUD_NAME && env.CLOUDINARY_API_KEY && env.CLOUDINARY_API_SECRET);

if (isConfigured) {
  cloudinary.config({
    cloud_name: env.CLOUDINARY_CLOUD_NAME,
    api_key: env.CLOUDINARY_API_KEY,
    api_secret: env.CLOUDINARY_API_SECRET,
    secure: true,
  });
}

/** Delivery URL that lets Cloudinary pick the best format and quality for each browser. */
function optimizedUrl(publicId, version) {
  return cloudinary.url(publicId, { secure: true, version, fetch_format: "auto", quality: "auto", urlAnalytics: false });
}

/** Uploads an in-memory buffer and resolves with Cloudinary's upload result. */
function uploadBuffer(buffer, options) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream({ resource_type: "image", ...options }, (err, result) =>
      err ? reject(err) : resolve(result)
    );
    stream.end(buffer);
  });
}

module.exports = { cloudinary, isConfigured, optimizedUrl, uploadBuffer };
