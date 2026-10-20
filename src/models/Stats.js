const mongoose = require("mongoose");

// Values are display strings (e.g. "50,000+") so editors control the exact formatting.
const STAT_FIELDS = [
  "happyCustomers",
  "activeFarmers",
  "partners",
  "yearsExperience",
  "productionCapacity",
  "storageCapacity",
  "qualityLabs",
  "distributionCenters",
  "rndTeams",
  "manufacturingUnits",
];

const statsSchema = new mongoose.Schema(
  Object.fromEntries(STAT_FIELDS.map((field) => [field, { type: String, default: "0", trim: true }])),
  { timestamps: true }
);

module.exports = mongoose.model("Stats", statsSchema);
module.exports.STAT_FIELDS = STAT_FIELDS;
