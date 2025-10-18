const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const Media = require('../models/Media');
const auth = require('../middleware/auth');

// upload single/media (admin)
router.post('/upload', auth, upload.single('file'), async (req, res) => {
  try {
    const f = req.file;
    if (!f) return res.status(400).json({ msg: 'No file' });
    const rel = f.path.replace(/\\\\/g, '/').split('/uploads/').pop();
    const url = `${process.env.BASE_URL}/uploads/${rel}`;
    const media = await new Media({ url, type: f.mimetype.split('/')[0], filename: f.originalname }).save();
    res.json(media);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// list media
router.get('/', async (req, res) => {
  const items = await Media.find().sort({ uploadedAt: -1 });
  res.json(items);
});

module.exports = router;
