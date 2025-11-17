const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Database connection
const connectDB = async () => {
  try {
    // Use MONGODB_URL if provided by Railway, otherwise use MONGODB_URI
    const mongoUri = process.env.MONGODB_URL || process.env.MONGODB_URI;
    console.log('Connecting to MongoDB...');
    
    const conn = await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

connectDB();

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/cows', require('./routes/cows'));
app.use('/api/calves', require('./routes/calves'));
app.use('/api/medical', require('./routes/medical'));
app.use('/api/milk', require('./routes/milk'));
app.use('/api/feed', require('./routes/feed'));
app.use('/api/hr', require('./routes/hr'));
app.use('/api/alerts', require('./routes/alerts'));
app.use('/api/pdf', require('./routes/pdf'));
app.use('/api/profile', require('./routes/profile'));

// Root route - serve login page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Server Error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

module.exports = app;