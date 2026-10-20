const Stats = require("../models/Stats");
const asyncHandler = require("../utils/asyncHandler");

// Stats is a singleton document; create it on first access.
const getOrCreate = () => Stats.findOneAndUpdate({}, {}, { new: true, upsert: true, setDefaultsOnInsert: true });

exports.get = asyncHandler(async (req, res) => {
  res.json({ success: true, data: await getOrCreate() });
});

exports.update = asyncHandler(async (req, res) => {
  const stats = await getOrCreate();
  stats.set(req.body);
  await stats.save();
  res.json({ success: true, message: "Statistics updated", data: stats });
});
