const express = require("express");
const router = express.Router();
const {
  getAllCrops,
  addCrop,
  deleteCrop,
} = require("../controllers/cropSolutionController");

router.get("/", getAllCrops);
router.post("/", addCrop);
router.delete("/:id", deleteCrop);

module.exports = router;
