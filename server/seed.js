const mongoose = require('mongoose');
const Room = require('./models/Room');
const Booking = require('./models/Booking');
require('dotenv').config();
const dns = require('dns');

// Fix for Node.js querySrv ECONNREFUSED on some Windows/ISP networks
dns.setServers(['8.8.8.8', '8.8.4.4']);
const hotelsData = {
  theluxuryinn: {
    rooms: [
      { roomNumber: "01", name: "Superior Double Room", type: "Luxury", price: 320, capacity: 2, image: "/images/hotel-property/superior_double_1.jpg", description: "Largest & most premium suite. King-size bed with luxury linens, direct access to a private terrace, and large factory-style windows." },
      { roomNumber: "02", name: "Standard Double Room", type: "Standard", price: 250, capacity: 2, image: "/images/hotel-property/standard_double_2.jpg", description: "Compact & minimalist design. Queen-size pillow-top mattress and private ensuite bathroom located on the 1st floor social hub." },
      { roomNumber: "03", name: "Standard Room (Courtyard)", type: "Standard", price: 180, capacity: 2, image: "/images/hotel-property/courtyard_1.jpg", description: "Ground floor for ultimate peace. Direct garden & courtyard access with a private bathroom just outside the room door." },
      { roomNumber: "04", name: "Superior Twin Room", type: "Superior", price: 200, capacity: 2, image: "/images/hotel-property/twin_1.jpg", description: "Two separate single beds. Bright, airy 1st floor location with a spacious workspace area and private bathroom in the hallway." }
    ]
  }
};

const seedData = async () => {
  try {
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/hotel_booking';
    const dbName = process.env.MONGODB_DB || 'hotel_booking';
    await mongoose.connect(uri, {
      dbName,
      serverSelectionTimeoutMS: 15000,
      connectTimeoutMS: 15000,
    });
    console.log('Connected to MongoDB for seeding...');

    // Clear existing data (CAUTION: Migration context)
    await Room.deleteMany({});
    // await Booking.deleteMany({}); // Don't wipe bookings yet if migrating live, but for first setup yes.

    for (const hotelId in hotelsData) {
      const rooms = hotelsData[hotelId].rooms.map(r => ({ ...r, hotelId }));
      await Room.insertMany(rooms);
      console.log(`Seeded rooms for ${hotelId}`);
    }

    console.log('Seeding completed successfully.');
    process.exit();
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
};

seedData();
