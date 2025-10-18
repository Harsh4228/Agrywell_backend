const mongoose = require('mongoose');

const CompanySchema = new mongoose.Schema({
  name: String,
  about: String,
  heroImage: String,
  happyCustomers: Number,
  farmers: Number,
  researchPartners: [String],
  yearsOfExp: Number,
  productionCapacity: String,
  storageCapacity: String,
  qualityLabs: String,
  rndTeams: String,
  manufacturingLines: String,
  distributionCenters: String,
  facilities: [String]
}, { timestamps: true });

module.exports = mongoose.model('Company', CompanySchema);
