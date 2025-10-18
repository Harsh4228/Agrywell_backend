const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");

router.post("/add", productController.addProduct);
router.get("/all", productController.getAllProducts);
router.delete("/:id", productController.deleteProduct);
router.get("/:id", productController.getProductById);

module.exports = router;
