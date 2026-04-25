
const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.post('/register-login', async (req, res) => {
  const { name, email, firebaseUid, role } = req.body;
  
  try {
    let user = await User.findOne({ firebaseUid });
    if (!user) {
      user = new User({ name, email, firebaseUid, role });
      await user.save();
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
