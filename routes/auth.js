const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");
const bcrypt = require("bcryptjs");

// 🔐 JWT Secret (You’ll define it in .env)
const JWT_SECRET = process.env.JWT_SECRET || "mysecretkey";

// =========================
// 🧩 Register Admin
// =========================
router.post("/register", async (req, res) => {
  try {
    const { email, password, name } = req.body;

    // check if admin already exists
    const existing = await Admin.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Admin already exists" });
    }

    const newAdmin = new Admin({ email, password, name });
    await newAdmin.save();

    const token = jwt.sign({ id: newAdmin._id }, JWT_SECRET, { expiresIn: "7d" });

    res.status(201).json({
      success: true,
      message: "Admin registered successfully",
      admin: { id: newAdmin._id, email: newAdmin.email, name: newAdmin.name },
      token,
    });
  } catch (err) {
    console.error("Register Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// =========================
// 🔑 Login Admin
// =========================
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: admin._id }, JWT_SECRET, { expiresIn: "7d" });

    res.json({
      success: true,
      message: "Login successful",
      admin: { id: admin._id, email: admin.email, name: admin.name },
      token,
    });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// =========================
// 👤 Get Admin Profile
// =========================
router.get("/profile", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token provided" });

    const decoded = jwt.verify(token, JWT_SECRET);
    const admin = await Admin.findById(decoded.id).select("-password");

    if (!admin) return res.status(404).json({ message: "Admin not found" });

    res.json({ success: true, admin });
  } catch (err) {
    console.error("Profile Error:", err);
    res.status(401).json({ message: "Invalid or expired token" });
  }
});

module.exports = router;
