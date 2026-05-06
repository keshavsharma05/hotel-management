const mongoose = require('mongoose');
require('dotenv').config();
const dns = require('dns');

// Fix for Node.js querySrv ECONNREFUSED on some Windows/ISP networks
dns.setServers(['8.8.8.8', '8.8.4.4']);

const connectDB = async () => {
  try {
    const isProd = process.env.NODE_ENV === 'production';
    const uri = process.env.MONGODB_URI || (!isProd ? 'mongodb://localhost:27017/hotel_booking' : null);
    if (isProd && !uri) {
      throw new Error('MONGODB_URI must be set in production');
    }
    // Ensure we never accidentally connect to Atlas default db ("test") if the URI omits a db name.
    const dbName = process.env.MONGODB_DB || 'hotel_booking';
    await mongoose.connect(uri, {
      dbName,
      serverSelectionTimeoutMS: 15000,
      connectTimeoutMS: 15000,
    });
    console.log('MongoDB Connected...');
  } catch (err) {
    console.error('MongoDB Connection Error:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
