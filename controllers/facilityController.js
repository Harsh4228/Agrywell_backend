const Facility = require("../models/Facility");
const mongoose = require("mongoose");

// Get all facilities
exports.getAllFacilities = async (req, res) => {
  try {
    const facilities = await Facility.find().sort({ createdAt: -1 });
    res.json({ success: true, data: facilities });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch facilities" });
  }
};

// Add a new facility
exports.addFacility = async (req, res) => {
  try {
    const { name, description, capacity, features, icon } = req.body;

    if (!name || !description || !capacity)
      return res.status(400).json({ success: false, message: "All required fields must be provided" });

    const newFacility = new Facility({
      name,
      description,
      capacity,
      features: features || [],
      icon: icon || "Factory",
    });

    await newFacility.save();
    res.json({ success: true, message: "Facility added successfully", data: newFacility });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to add facility" });
  }
};

// Update facility
exports.updateFacility = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ success: false, message: "Invalid facility ID" });

    const updated = await Facility.findByIdAndUpdate(id, req.body, { new: true });
    if (!updated)
      return res.status(404).json({ success: false, message: "Facility not found" });

    res.json({ success: true, message: "Facility updated successfully", data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to update facility" });
  }
};

// Delete facility
exports.deleteFacility = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ success: false, message: "Invalid facility ID" });

    const deleted = await Facility.findByIdAndDelete(id);
    if (!deleted)
      return res.status(404).json({ success: false, message: "Facility not found" });

    res.json({ success: true, message: "Facility deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to delete facility" });
  }
};
