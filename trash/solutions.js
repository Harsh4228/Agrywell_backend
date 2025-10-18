const express = require('express');
const router = express.Router();
const CropSolution = require('../models/CropSolution');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

router.post('/', auth, upload.array('media', 12), async (req, res) => {
  const data = req.body;
  const s = new CropSolution(data);
  if (req.files && req.files.length) {
    const urls = req.files.map(f => {
      const rel = f.path.replace(/\\\\/g, '/').split('/uploads/').pop();
      return `${process.env.BASE_URL}/uploads/${rel}`;
    });
    s.images = urls.filter(u => /\.(jpg|png|jpeg|gif)$/i.test(u));
    s.videos = urls.filter(u => /\.(mp4|mov|webm)/i.test(u));
    s.pdfs = urls.filter(u => /\.pdf$/i.test(u));
  }
  await s.save();
  res.json(s);
});

router.get('/', async (req, res) => {
  const list = await CropSolution.find().sort({ createdAt: -1 });
  res.json(list);
});

module.exports = router;
