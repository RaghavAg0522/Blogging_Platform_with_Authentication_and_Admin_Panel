const expressMain = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
require('dotenv').config();
require('./config/db');

const app = expressMain();

// Middleware
app.use(cors());
app.use(expressMain.json());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/posts', require('./routes/postRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

app.get('/', (req, res) => {
  res.send('API Running');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on ${PORT}`));
