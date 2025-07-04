const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const app = express();

// CORS Configuration
app.use(cors({
  origin: ['https://duty-deck.vercel.app', 'http://localhost:5173', 'https://techspotinfotech.com'],
  credentials: true
}));

// JSON parsing middleware
app.use(express.json());

// Serve React build
app.use(express.static(path.join(__dirname, 'client/dist')));

// API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/tasks', require('./routes/taskRoutes'));
app.use('/api/users', require('./routes/userRoutes'));

// Serve React router paths
app.get('/*splat', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/dist', 'index.html'));
});

// 404 for non-API/missing paths
app.all('/*splat', (req, res) => {
  res.status(404).json({ message: `Route ${req.originalUrl} not found` });
});

// MongoDB + Server start
const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGO_URI, { 
  useNewUrlParser: true, 
  useUnifiedTopology: true 
})
  .then(() => app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`)))
  .catch(err => console.error('❌ MongoDB connection failed:', err.message));
