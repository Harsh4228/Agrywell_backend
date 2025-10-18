const mongoose = require('mongoose');

const PartnerSchema = new mongoose.Schema({
  name: String,
  website: String,
  logo: String,
  description: String
}, { timestamps: true });

module.exports = mongoose.model('Partner', PartnerSchema);
