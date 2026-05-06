const mongoose = require('mongoose');
const Room = require('./models/Room');

async function precisionCheck() {
  await mongoose.connect('mongodb://localhost:27017/hotel_booking');
  const rooms = await Room.find({});
  console.log(`Checking ${rooms.length} rooms...`);
  
  rooms.forEach(r => {
    console.log(`Room: ${r.roomNumber} | hotelId: "${r.hotelId}" | Capacity: ${r.capacity}`);
    if (r.hotelId === 'theluxuryinn') console.log(' -> EXACT MATCH for "theluxuryinn"');
    if (r.hotelId?.toLowerCase() === 'theluxuryinn') console.log(' -> LC MATCH for "theluxuryinn"');
  });
  
  const queryMatch = await Room.find({ hotelId: 'theluxuryinn' });
  console.log(`Query for { hotelId: "theluxuryinn" } returned ${queryMatch.length} items`);
  
  process.exit(0);
}

precisionCheck();
