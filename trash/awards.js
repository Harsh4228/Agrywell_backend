const express = require('express');
const router = express.Router();
const Award = require('../models/Award');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

router.post('/', auth, upload.single('image'), async (req, res) => {
  const data = req.body;
  if (req.file) {
    const rel = req.file.path.replace(/\\\\/g, '/').split('/uploads/').pop();
    data.image = `${process.env.BASE_URL}/uploads/${rel}`;
  }
  const a = new Award(data);
  await a.save();
  res.json(a);
});

router.get('/', async (req, res) => {
  const list = await Award.find().sort({ createdAt: -1 });
  res.json(list);
});

module.exports = router;
