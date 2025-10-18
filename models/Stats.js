const mongoose = require("mongoose");

const StatsSchema = new mongoose.Schema({
  happyCustomers: { type: String, default: "0" },
  activeFarmers: { type: String, default: "0" },
  partners: { type: String, default: "0" },
  yearsExperience: { type: String, default: "0" },
  productionCapacity: { type: String, default: "0" },
  storageCapacity: { type: String, default: "0" },
  qualityLabs: { type: String, default: "0" },
  distributionCenters: { type: String, default: "0" },
  rndTeams: { type: String, default: "0" },
  manufacturingUnits: { type: String, default: "0" }
}, { timestamps: true });

module.exports = mongoose.model("Stats", StatsSchema);
