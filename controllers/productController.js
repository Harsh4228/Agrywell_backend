const Product = require("../models/Product");

// ➤ Add new product
exports.addProduct = async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json({ success: true, message: "Product added successfully", product });
  } catch (err) {
    console.error("Add Product Error:", err);
    res.status(500).json({ success: false, message: "Failed to add product", error: err.message });
  }
};

// ➤ Get all products
// productController.js
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products); // ✅ Directly send array
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

// ➤ Delete product
// controllers/productController.js
const mongoose = require("mongoose");

exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate Mongo ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid ID" });
    }

    const deleted = await Product.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    res.json({ success: true, message: "Product deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to delete product" });
  }
};


// ➤ Update product
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Product.findOneAndUpdate({ id }, req.body, { new: true });
    res.json({ success: true, message: "Product updated successfully", updated });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to update product" });
  }
};
exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if ID is valid Mongo ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid product ID" });
    }

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
