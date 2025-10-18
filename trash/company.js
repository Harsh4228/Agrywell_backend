const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Company = require('../models/Company');
const upload = require('../middleware/upload');

// get company (single doc assumed)
router.get('/', async (req, res) => {
  let doc = await Company.findOne();
  if (!doc) return res.json({});
  res.json(doc);
});

// create or update company (admin)
router.post('/', auth, upload.single('heroImage'), async (req, res) => {
  try {
    const data = req.body;
    if (req.file) data.heroImage = `${process.env.BASE_URL}/uploads/${req.file.filename}`; // note: multer saves under subfolder; we'll compute
    // adjust path to actual saved subfolder
    if (req.file) {
      const savedPath = req.file.path.replace(/\\\\/g, '/').split('/uploads/').pop();
      data.heroImage = `${process.env.BASE_URL}/uploads/${savedPath}`;
    }
    let company = await Company.findOne();
    if (!company) company = new Company(data);
    else Object.assign(company, data);
    await company.save();
    res.json(company);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});
module.exports = router;
