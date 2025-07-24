import path from 'path';
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import { fileURLToPath } from 'url';
import authRoutes from './routes/authRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import userRoutes from './routes/userRoutes.js';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/users', userRoutes);

// Serve React router paths
app.get('/*splat', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/dist', '/index.html'));
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