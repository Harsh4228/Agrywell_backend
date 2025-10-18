const mongoose = require('mongoose');

const MediaSchema = new mongoose.Schema({
  url: String,
  type: String, // image/video/pdf/other
  filename: String,
  uploadedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Media', MediaSchema);
