const express = require("express");
const router = express.Router();
const Stats = require("../models/Stats");

// 🟩 GET Stats (only one document)
router.get("/", async (req, res) => {
  try {
    const stats = await Stats.findOne();
    if (!stats) {
      const newStats = new Stats();
      await newStats.save();
      return res.json(newStats);
    }
    res.json(stats);
  } catch (error) {
    console.error("Error fetching stats:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// 🟨 UPDATE Stats (single document)
router.put("/", async (req, res) => {
  try {
    const existing = await Stats.findOne();
    if (!existing) {
      const newStats = new Stats(req.body);
      await newStats.save();
      return res.json(newStats);
    }

    Object.assign(existing, req.body);
    await existing.save();

    res.json(existing);
  } catch (error) {
    console.error("Error updating stats:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
