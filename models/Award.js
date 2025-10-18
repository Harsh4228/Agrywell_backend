const mongoose = require('mongoose');

const AwardSchema = new mongoose.Schema({
  title: String,
  year: Number,
  description: String,
  image: String
}, { timestamps: true });

module.exports = mongoose.model('Award', AwardSchema);
