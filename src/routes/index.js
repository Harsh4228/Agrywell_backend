const express = require("express");
const mongoose = require("mongoose");

const schemas = require("../validators/schemas");
const crudFactory = require("../controllers/crudFactory");
const auth = require("../controllers/authController");
const stats = require("../controllers/statsController");
const pdfs = require("../controllers/pdfController");
const contact = require("../controllers/contactController");
const dashboard = require("../controllers/dashboardController");
const images = require("../controllers/imageController");

const Product = require("../models/Product");
const UpcomingProduct = require("../models/UpcomingProduct");
const Facility = require("../models/Facility");
const CropSolution = require("../models/CropSolution");
const Video = require("../models/Video");
const Inquiry = require("../models/Inquiry");

const { requireAuth } = require("../middleware/auth");
const { validateBody, validateObjectId } = require("../middleware/validate");
const { uploadPdf, uploadImage } = require("../middleware/upload");
const { loginLimiter, contactLimiter, uploadLimiter } = require("../middleware/rateLimit");

const router = express.Router();
const id = validateObjectId("id");

/** Mounts a public-read, admin-write resource with standard CRUD endpoints. */
function resource(path, controller, schema) {
  const r = express.Router();
  r.get("/", controller.list);
  r.get("/:id", id, controller.get);
  r.post("/", requireAuth, validateBody(schema), controller.create);
  r.put("/:id", requireAuth, id, validateBody(schema), controller.update);
  r.delete("/:id", requireAuth, id, controller.remove);
  router.use(path, r);
}

// Health
router.get("/health", (req, res) => {
  res.json({ status: "ok", db: mongoose.connection.readyState === 1 ? "up" : "down", uptime: process.uptime() });
});

// Auth
router.post("/auth/login", loginLimiter, validateBody(schemas.login), auth.login);
router.get("/auth/me", requireAuth, auth.me);
router.put("/auth/password", requireAuth, validateBody(schemas.changePassword), auth.changePassword);
router.post("/auth/logout-all", requireAuth, auth.logoutAll);

// Content resources
resource("/products", crudFactory(Product, { label: "Product" }), schemas.product);
resource("/upcoming-products", crudFactory(UpcomingProduct, { label: "Upcoming product" }), schemas.upcomingProduct);
resource("/facilities", crudFactory(Facility, { label: "Facility" }), schemas.facility);
resource("/crop-solutions", crudFactory(CropSolution, { label: "Crop solution", sort: { name: 1 } }), schemas.cropSolution);
resource("/videos", crudFactory(Video, { label: "Video" }), schemas.video);

// Company statistics (singleton)
router.get("/stats", stats.get);
router.put("/stats", requireAuth, validateBody(schemas.stats), stats.update);

// PDF resources (multipart uploads)
router.get("/pdfs", pdfs.list);
router.get("/pdfs/:id/download", id, pdfs.download);
router.post("/pdfs", requireAuth, uploadPdf.single("file"), pdfs.create);
router.put("/pdfs/:id", requireAuth, id, uploadPdf.single("file"), pdfs.update);
router.delete("/pdfs/:id", requireAuth, id, pdfs.remove);

// Image uploads (Cloudinary) for admin forms
router.post("/uploads/image", uploadLimiter, requireAuth, uploadImage.single("file"), images.upload);

// Contact form + inquiries inbox
const inquiries = crudFactory(Inquiry, {
  label: "Inquiry",
  searchFields: ["name", "email", "subject", "message"],
  filters: { read: crudFactory.boolean },
});
router.post("/contact", contactLimiter, validateBody(schemas.contact), contact.submit);
router.get("/inquiries", requireAuth, inquiries.list);
router.patch("/inquiries/:id", requireAuth, id, validateBody(schemas.inquiryUpdate), inquiries.update);
router.delete("/inquiries/:id", requireAuth, id, inquiries.remove);

// Admin dashboard
router.get("/dashboard/summary", requireAuth, dashboard.summary);

module.exports = router;
