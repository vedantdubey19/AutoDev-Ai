const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
// Look for .env in the parent directory if running locally
require('dotenv').config({ path: '../.env' });

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

if (process.env.MONGODB_URI) {
  mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));
} else {
  console.warn('MONGODB_URI is not defined. Skipping DB connection.');
}

const { router: authRouter } = require('./routes/auth');
const webhookRouter = require('./routes/webhooks');

app.use('/auth', authRouter);
app.use('/webhooks', webhookRouter);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'server' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
