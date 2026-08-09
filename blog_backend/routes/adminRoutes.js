const express3 = require('express');
const router3 = express3.Router();
const User2 = require('../models/user');
const { authMiddleware } = require('../middleware/authMiddleware');
const { adminMiddleware } = require('../middleware/adminMiddleware');

router3.get('/users', authMiddleware, adminMiddleware, async (req, res) => {
  const users = await User2.find();
  res.json(users);
});

router3.delete('/user/:id', authMiddleware, adminMiddleware, async (req, res) => {
  await User2.findByIdAndDelete(req.params.id);
  res.json({ msg: 'User deleted' });
});

module.exports = router3;
