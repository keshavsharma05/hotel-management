const mongoose = require('mongoose');
const Booking = require('./models/Booking');
const Room = require('./models/Room');
const crypto = require('crypto');
require('dotenv').config();

// ─── Booking templates ──────────────────────────────────────────────────────
// `details[].name` must match exactly the Room.name values seeded by seed.js
const bookingTemplates = [
  {
    guest: 'Rahul Sharma',
    email: 'rahul.sharma@example.com',
    phone: '9876543210',
    checkIn: '2026-05-20',
    checkOut: '2026-05-25',
    status: 'Checked Out',
    total: '1250',
    guests: 2,
    details: [{ name: 'Superior Double Room', quantity: 1, price: 320 }]
  },
  {
    guest: 'Priya Patel',
    email: 'priya.patel@example.com',
    phone: '8765432109',
    checkIn: '2026-05-26',
    checkOut: '2026-05-30',
    status: 'Confirmed',
    total: '750',
    guests: 1,
    details: [{ name: 'Standard Double Room', quantity: 1, price: 250 }]
  },
  {
    guest: 'Amit Kumar',
    email: 'amit.kumar@example.com',
    phone: '7654321098',
    checkIn: '2026-05-27',
    checkOut: '2026-05-29',
    status: 'Confirmed',
    total: '400',
    guests: 2,
    details: [{ name: 'Superior Twin Room', quantity: 1, price: 200 }]
  },
  {
    guest: 'Sneha Gupta',
    email: 'sneha.gupta@example.com',
    phone: '6543210987',
    checkIn: '2026-05-25',
    checkOut: '2026-05-28',
    status: 'Checked In',
    total: '540',
    guests: 2,
    details: [{ name: 'Standard Room (Courtyard)', quantity: 1, price: 180 }]
  },
  {
    guest: 'Vikram Singh',
    email: 'vikram.singh@example.com',
    phone: '5432109876',
    checkIn: '2026-06-01',
    checkOut: '2026-06-05',
    status: 'Confirmed',
    total: '1280',
    guests: 4,
    details: [{ name: 'Superior Double Room', quantity: 2, price: 320 }]
  },
  {
    guest: 'Neha Reddy',
    email: 'neha.reddy@example.com',
    phone: '4321098765',
    checkIn: '2026-05-26',
    checkOut: '2026-05-27',
    status: 'Checked In',
    total: '250',
    guests: 1,
    details: [{ name: 'Standard Double Room', quantity: 1, price: 250 }]
  }
];

const HOTEL_ID = 'theluxuryinn';

const seedBookings = async () => {
  try {
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/hotel_booking';
    const dbName = process.env.MONGODB_DB || 'hotel_booking';
    await mongoose.connect(uri, {
      dbName,
      serverSelectionTimeoutMS: 15000,
      connectTimeoutMS: 15000,
    });
    console.log('Connected to MongoDB for seeding bookings...');

    // Wipe old dummy bookings first (clean slate)
    await Booking.deleteMany({ hotelId: HOTEL_ID });
    console.log('Cleared existing bookings.');

    // Load all rooms for this hotel once
    const allRooms = await Room.find({ hotelId: HOTEL_ID }).lean();
    if (!allRooms.length) {
      console.error('No rooms found! Run `node seed.js` first.');
      process.exit(1);
    }

    const bookingsToInsert = [];

    // We need to track which rooms are "used" per overlapping date range so we
    // don't double-assign the same physical room to two overlapping bookings.
    // For seeding purposes we just track globally across all seed entries since
    // these are all for the same hotel and dates may overlap.
    const usedRoomIds = new Set();

    for (const template of bookingTemplates) {
      const allocatedRoomIds = [];
      const allocatedRoomNos = [];

      for (const item of template.details) {
        const qty = Math.max(1, Number(item.quantity || 1));
        // Find rooms matching this category name
        const candidates = allRooms.filter(r => r.name === item.name);
        if (!candidates.length) {
          console.warn(`  ⚠ No room found for category "${item.name}" — skipping`);
          continue;
        }
        // Pick rooms not yet used
        const available = candidates.filter(r => !usedRoomIds.has(String(r._id)));
        const chosen = available.slice(0, qty);

        // If we've run out of unique rooms (e.g. 2 bookings both want Superior Double)
        // fall back to reusing a room (acceptable for seed/demo data)
        if (chosen.length < qty) {
          const fallback = candidates.slice(0, qty);
          fallback.forEach(r => {
            allocatedRoomIds.push(String(r._id));
            allocatedRoomNos.push(String(r.roomNumber));
          });
        } else {
          chosen.forEach(r => {
            usedRoomIds.add(String(r._id));
            allocatedRoomIds.push(String(r._id));
            allocatedRoomNos.push(String(r.roomNumber));
          });
        }
      }

      const roomNameLabel = template.details
        .map(d => `${Math.max(1, Number(d.quantity || 1))}x ${d.name}`)
        .join(', ');

      const numRooms = template.details.reduce(
        (sum, d) => sum + Math.max(1, Number(d.quantity || 1)),
        0
      );

      bookingsToInsert.push({
        id: `BK-${crypto.randomBytes(3).toString('hex').toUpperCase()}`,
        hotelId: HOTEL_ID,
        guest: template.guest,
        email: template.email,
        phone: template.phone,
        checkIn: template.checkIn,
        checkOut: template.checkOut,
        status: template.status,
        total: template.total,
        numRooms,
        guests: template.guests,
        roomId: allocatedRoomIds[0] || null,
        roomIds: allocatedRoomIds,
        roomNo: allocatedRoomNos.join(', '),
        roomName: roomNameLabel,
        details: template.details.map((d, i) => ({
          id: allocatedRoomIds[i] || '',
          name: d.name,
          quantity: d.quantity,
          price: d.price,
        })),
      });
    }

    await Booking.insertMany(bookingsToInsert);
    console.log(`✅ Seeded ${bookingsToInsert.length} bookings with real room numbers:`);
    bookingsToInsert.forEach(b =>
      console.log(`   ${b.guest.padEnd(20)} → Room(s): ${b.roomNo}  [${b.roomName}]`)
    );

    process.exit(0);
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
};

seedBookings();
