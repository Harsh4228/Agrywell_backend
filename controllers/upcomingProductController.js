const UpcomingProduct = require("../models/UpcomingProduct");
const mongoose = require("mongoose");

// Get all upcoming products
exports.getAllUpcomingProducts = async (req, res) => {
  try {
    const products = await UpcomingProduct.find().sort({ createdAt: -1 });
    res.json({ success: true, data: products });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch products" });
  }
};

// Add a new upcoming product
exports.addUpcomingProduct = async (req, res) => {
  try {
    const { name, category, expectedLaunch, status } = req.body;
    if (!name || !category || !expectedLaunch)
      return res.status(400).json({ success: false, message: "All fields are required" });

    const newProduct = new UpcomingProduct({ name, category, expectedLaunch, status });
    await newProduct.save();

    res.json({ success: true, message: "Upcoming product added", data: newProduct });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to add product" });
  }
};

// Update an upcoming product
exports.updateUpcomingProduct = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ success: false, message: "Invalid ID" });

    const updated = await UpcomingProduct.findByIdAndUpdate(id, req.body, { new: true });
    if (!updated)
      return res.status(404).json({ success: false, message: "Product not found" });

    res.json({ success: true, message: "Product updated successfully", data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to update product" });
  }
};

// Delete an upcoming product
exports.deleteUpcomingProduct = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ success: false, message: "Invalid ID" });

    const deleted = await UpcomingProduct.findByIdAndDelete(id);
    if (!deleted)
      return res.status(404).json({ success: false, message: "Product not found" });

    res.json({ success: true, message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to delete product" });
  }
};
