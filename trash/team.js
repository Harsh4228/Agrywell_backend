const express = require('express');
const router = express.Router();
const Team = require('../models/TeamMember');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

router.post('/', auth, upload.single('photo'), async (req, res) => {
  const data = req.body;
  if (req.file) {
    const rel = req.file.path.replace(/\\\\/g, '/').split('/uploads/').pop();
    data.photo = `${process.env.BASE_URL}/uploads/${rel}`;
  }
  const m = new Team(data);
  await m.save();
  res.json(m);
});

router.get('/', async (req, res) => {
  const list = await Team.find().sort({ createdAt: -1 });
  res.json(list);
});

module.exports = router;
