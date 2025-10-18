const mongoose = require('mongoose');

const CertificationSchema = new mongoose.Schema({
  name: String,
  issuer: String,
  year: Number,
  certificateFile: String
}, { timestamps: true });

module.exports = mongoose.model('Certification', CertificationSchema);
