const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt2 = require('jsonwebtoken');

exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: 'User exists' });

    const hashed = await bcrypt.hash(password, 10);

    user = new User({ name, email, password: hashed });
    await user.save();

    res.json({ msg: 'Registered successfully' });
  } catch (err) {
    console.log(err);
    res.status(500).send('Server error');
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'Invalid creds' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid creds' });

    const token = jwt2.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );
    res.json({success:true, message : "Login Successfully", token });
  } catch (err) {
    res.status(500).send('Server error');
  }
};
