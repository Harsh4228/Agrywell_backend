const CropSolution = require("../models/CropSolution");

// ✅ Get all crop solutions
exports.getAllCrops = async (req, res) => {
  try {
    const crops = await CropSolution.find().sort({ createdAt: -1 });
    res.json({ success: true, data: crops });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ Add new crop
exports.addCrop = async (req, res) => {
  try {
    const crop = new CropSolution(req.body);
    await crop.save();
    res.json({ success: true, data: crop });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// ✅ Delete crop
exports.deleteCrop = async (req, res) => {
  try {
    const deleted = await CropSolution.findByIdAndDelete(req.params.id);
    if (!deleted)
      return res
        .status(404)
        .json({ success: false, message: "Crop not found" });

    res.json({ success: true, message: "Crop deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
