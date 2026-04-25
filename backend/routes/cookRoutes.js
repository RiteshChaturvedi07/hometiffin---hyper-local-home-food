
const express = require('express');
const router = express.Router();
const CookProfile = require('../models/CookProfile');

router.post('/register-kitchen', async (req, res) => {
  try {
    const cook = new CookProfile(req.body);
    await cook.save();
    res.status(201).json(cook);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/nearby', async (req, res) => {
  // Simple filter logic for MVP
  try {
    const kitchens = await CookProfile.find({}).populate('user', 'name');
    res.json(kitchens);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
