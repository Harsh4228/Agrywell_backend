const Product = require("../models/Product");
const UpcomingProduct = require("../models/UpcomingProduct");
const Facility = require("../models/Facility");
const CropSolution = require("../models/CropSolution");
const Video = require("../models/Video");
const PdfResource = require("../models/PdfResource");
const Inquiry = require("../models/Inquiry");
const asyncHandler = require("../utils/asyncHandler");

exports.summary = asyncHandler(async (req, res) => {
  const [products, upcomingProducts, facilities, crops, videos, pdfs, inquiries, unreadInquiries, downloads, recentInquiries] =
    await Promise.all([
      Product.countDocuments(),
      UpcomingProduct.countDocuments(),
      Facility.countDocuments(),
      CropSolution.countDocuments(),
      Video.countDocuments(),
      PdfResource.countDocuments(),
      Inquiry.countDocuments(),
      Inquiry.countDocuments({ read: false }),
      PdfResource.aggregate([{ $group: { _id: null, total: { $sum: "$downloadCount" } } }]),
      Inquiry.find().sort({ createdAt: -1 }).limit(5),
    ]);

  res.json({
    success: true,
    data: {
      counts: { products, upcomingProducts, facilities, crops, videos, pdfs, inquiries, unreadInquiries },
      totalDownloads: downloads[0]?.total || 0,
      recentInquiries,
    },
  });
});
