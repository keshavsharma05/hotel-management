const mongoose = require('mongoose');

const DetailSchema = new mongoose.Schema({
  id: String,
  name: String,
  quantity: Number,
  price: Number
});

const BookingSchema = new mongoose.Schema({
  id: { type: String, unique: true }, // For compatibility with existing BK-XXXX IDs
  hotelId: { type: String, required: true },
  guest: { type: String, required: true },
  email: String,
  phone: { type: String, required: true },
  checkIn: { type: String, required: true },
  checkOut: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['Pending', 'Booked', 'Confirmed', 'Assigned', 'Checked In', 'Checked Out', 'Completed', 'Cancelled'],
    default: 'Confirmed'
  },
  total: { type: String, required: true },
  numRooms: { type: Number, default: 1 },
  guests: { type: Number, default: 1 },
  details: [DetailSchema],
  roomId: String, // Direct bookable unit ID
  roomIds: [String], // Multi-room reservations (allocated unit IDs)
  roomName: String,
  roomNo: String, // Assigned room numbers
  createdAt: { type: Date, default: Date.now }
}); // Enable versioning for optimistic locking

// Indexes for performance and availability logic
BookingSchema.index({ hotelId: 1, status: 1, checkIn: 1, checkOut: 1 });
BookingSchema.index({ phone: 1, status: 1 });

module.exports = mongoose.model('Booking', BookingSchema);
