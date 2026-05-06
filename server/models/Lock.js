const mongoose = require('mongoose');

const LockSchema = new mongoose.Schema({
  key: { type: String, unique: true },
  acquiredAt: { type: Date, expires: 10 } // Auto-release after 10s if crash
});

module.exports = mongoose.model('Lock', LockSchema);
