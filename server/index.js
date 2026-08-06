require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();

// Connect to Database
connectDB();

// Initialize cron jobs
require('./cronJobs');

// Middleware
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'https://theluxuryinn.vercel.app',
  process.env.FRONTEND_URL // Allow dynamically setting from Render env vars
];
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use(express.json({ limit: '10kb' })); // Prevent large payloads

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/bookings', require('./routes/bookingRoutes'));
app.use('/api/rooms', require('./routes/roomRoutes'));

// Basic error handler (prevents crashes on thrown middleware errors like CORS)
app.use((err, req, res, next) => {
  if (!err) return next();
  if (String(err.message || '').includes('Not allowed by CORS')) {
    return res.status(403).json({ message: 'CORS blocked' });
  }
  res.status(500).json({ message: 'Server error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
