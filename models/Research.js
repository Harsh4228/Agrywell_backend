const mongoose = require('mongoose');

const ResearchSchema = new mongoose.Schema({
  title: String,
  abstract: String,
  authors: [String],
  publishedAt: Date,
  pdf: String
}, { timestamps: true });

module.exports = mongoose.model('Research', ResearchSchema);
