const express = require('express');
const router = express.Router();
const Partner = require('../models/Partner');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

router.post('/', auth, upload.single('logo'), async (req, res) => {
  const data = req.body;
  if (req.file) {
    const rel = req.file.path.replace(/\\\\/g, '/').split('/uploads/').pop();
    data.logo = `${process.env.BASE_URL}/uploads/${rel}`;
  }
  const p = new Partner(data);
  await p.save();
  res.json(p);
});

router.get('/', async (req, res) => {
  const list = await Partner.find().sort({ createdAt: -1 });
  res.json(list);
});

module.exports = router;
