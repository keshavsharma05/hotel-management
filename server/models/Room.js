const mongoose = require('mongoose');

const RoomSchema = new mongoose.Schema({
  hotelId: { type: String, required: true },
  roomNumber: { type: String, required: true },
  name: { type: String, required: true }, // Category name
  type: { type: String, default: 'Standard' },
  price: { type: Number, required: true },
  capacity: { type: Number, required: true, default: 2 },
  description: String,
  image: String,
  status: { type: String, default: 'Available' }
});

RoomSchema.index({ hotelId: 1, name: 1 });
RoomSchema.index({ hotelId: 1, roomNumber: 1 }, { unique: true });

module.exports = mongoose.model('Room', RoomSchema);
