const Booking = require('../models/Booking');
const Room = require('../models/Room');
const Lock = require('../models/Lock');
const mongoose = require('mongoose');

async function backfillMultiRoomFieldsIfNeeded(bookingDoc) {
  if (process.env.ENABLE_BOOKING_BACKFILL !== 'true') return bookingDoc;
  if (!bookingDoc) return bookingDoc;
  const booking = bookingDoc.toObject ? bookingDoc.toObject() : bookingDoc;

  const details = Array.isArray(booking.details) ? booking.details : [];
  const needsMulti =
    details.length > 1 ||
    details.some(d => Math.max(1, Number(d?.quantity || 1)) > 1);

  // Only backfill if it looks like a multi-room reservation but we stored only a single room.
  const hasRoomIds = Array.isArray(booking.roomIds) && booking.roomIds.length > 1;
  if (!needsMulti || hasRoomIds) return bookingDoc;

  const { hotelId, checkIn, checkOut } = booking;
  if (!hotelId || !checkIn || !checkOut) return bookingDoc;
  if (booking.status === 'Cancelled') return bookingDoc;

  // If check-in is in the past, don't mutate historical data automatically.
  if (new Date(checkIn) < new Date()) return bookingDoc;

  // Re-allocate rooms for the missing portion using current availability.
  const overlappingBookings = await Booking.find({
    _id: { $ne: booking._id },
    hotelId,
    status: { $ne: 'Cancelled' },
    checkIn: { $lt: checkOut },
    checkOut: { $gt: checkIn }
  }).lean();

  const bookedRoomIds = new Set(overlappingBookings.flatMap(b => {
    const ids = [];
    if (b.roomId) ids.push(String(b.roomId));
    if (Array.isArray(b.roomIds)) ids.push(...b.roomIds.map(x => String(x)));
    return ids;
  }));

  const allocatedRoomIds = [];
  const allocatedRoomNos = [];

  for (const item of details) {
    const categoryName = item?.name;
    const qty = Math.max(1, Number(item?.quantity || 1));
    if (!categoryName) continue;

    const candidateRooms = await Room.find({ hotelId, name: categoryName }).lean();
    const available = candidateRooms.filter(r => !bookedRoomIds.has(String(r._id)));
    if (available.length < qty) {
      // If we can't satisfy it now, don't partially mutate; just return original.
      return bookingDoc;
    }
    const chosen = available.slice(0, qty);
    chosen.forEach(r => {
      bookedRoomIds.add(String(r._id));
      allocatedRoomIds.push(String(r._id));
      allocatedRoomNos.push(String(r.roomNumber));
    });
  }

  if (allocatedRoomIds.length <= 1) return bookingDoc;

  const roomNameLabel = details.length
    ? details.map(d => `${Math.max(1, Number(d.quantity || 1))}x ${d.name}`).join(', ')
    : booking.roomName;

  const roomNoLabel = allocatedRoomNos.join(', ');
  const numRooms = details.length
    ? details.reduce((sum, d) => sum + Math.max(1, Number(d.quantity || 1)), 0)
    : allocatedRoomIds.length;

  await Booking.updateOne(
    { _id: booking._id },
    {
      $set: {
        roomIds: allocatedRoomIds,
        roomId: allocatedRoomIds[0],
        roomNo: roomNoLabel,
        roomName: roomNameLabel,
        numRooms,
      }
    }
  );

  return Booking.findById(booking._id);
}

// Helper logic removed in refactor
exports.getAvailableRoomsByCategory = async (req, res) => {
  try {
    const { hotelId } = req.params;
    const { checkIn, checkOut } = req.query;

    if (!hotelId || !checkIn || !checkOut) {
      return res.status(400).json({ message: 'Missing parameters' });
    }

    const allRooms = await Room.find({ hotelId }).lean();

    // Find all overlapping bookings for this hotel
    const overlappingBookings = await Booking.find({
      hotelId,
      status: { $ne: 'Cancelled' },
      checkIn: { $lt: checkOut },
      checkOut: { $gt: checkIn }
    });

    const bookedRoomIds = overlappingBookings.flatMap(b => {
      const ids = [];
      if (b.roomId) ids.push(String(b.roomId));
      if (Array.isArray(b.roomIds)) ids.push(...b.roomIds.map(x => String(x)));
      return ids;
    });

    // Instead of filtering out, add an availability flag so UI can display them as disabled
    const roomsWithAvailability = allRooms.map(room => {
      const isBooked = bookedRoomIds.includes(String(room._id)) || bookedRoomIds.includes(String(room.id));
      return {
        ...room,
        isAvailable: !isBooked
      };
    });
    
    // Sort available rooms first
    roomsWithAvailability.sort((a, b) => b.isAvailable - a.isAvailable);

    res.json(roomsWithAvailability);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// OLD CODE
/*
exports.createBooking = async (req, res) => {
  const lockKey = \`lock:booking:\${req.body.hotelId}\`;
  let lockAcquired = false;

  try {
    // 1. ACQUIRE DISTRIBUTED LOCK (Spin-lock approach)
    for (let i = 0; i < 10; i++) { // try 10 times
      try {
        await Lock.create({ key: lockKey });
        lockAcquired = true;
        break;
      } catch (e) {
        await new Promise(r => setTimeout(r, 200));
      }
    }

    if (!lockAcquired) throw new Error('System busy, please try again in a moment');

    const { hotelId, checkIn, checkOut, details, phone, guest, email } = req.body;
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const nights = Math.ceil((end - start) / (1000 * 60 * 60 * 24));

    const allRooms = await Room.find({ hotelId }).lean();
    if (allRooms.length === 0) throw new Error('Property rooms not found');

    let calculatedSubtotal = 0;
    const verifiedDetails = [];

    for (const requested of (details || [])) {
      const roomsInCat = allRooms.filter(r => r.name === requested.name);
      if (roomsInCat.length === 0) throw new Error(\`Category \${requested.name} does not exist\`);

      const occupiedCount = await getOccupiedCount(hotelId, requested.name, checkIn, checkOut);
      const totalQty = roomsInCat.length;

      if (totalQty - occupiedCount < requested.quantity) {
        throw new Error(\`Room category "\${requested.name}" is no longer available for these dates.\`);
      }

      const roomTemplate = roomsInCat[0];
      calculatedSubtotal += (roomTemplate.price * requested.quantity);
      verifiedDetails.push({
        id: roomTemplate._id,
        name: roomTemplate.name,
        quantity: requested.quantity,
        price: roomTemplate.price
      });
    }

    const finalTotal = (calculatedSubtotal * nights) + 50;
    const bookingId = \`BK-\${Math.random().toString(36).substr(2, 5).toUpperCase()}\`;
    
    const newBooking = new Booking({
      id: bookingId,
      hotelId,
      guest: guest.trim(),
      email,
      phone,
      checkIn,
      checkOut,
      status: 'Confirmed',
      total: finalTotal.toString(),
      numRooms: verifiedDetails.reduce((sum, r) => sum + r.quantity, 0),
      details: verifiedDetails
    });

    await newBooking.save();
    res.status(201).json({ success: true, booking: newBooking });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  } finally {
    if (lockAcquired) await Lock.deleteOne({ key: lockKey });
  }
};
*/

// NEW CODE
exports.createBooking = async (req, res) => {
  const lockKey = `lock:booking:${req.body.hotelId}`;
  let lockAcquired = false;

  try {
    for (let i = 0; i < 10; i++) {
      try {
        await Lock.create({ key: lockKey });
        lockAcquired = true;
        break;
      } catch (e) {
        await new Promise(r => setTimeout(r, 200));
      }
    }

    if (!lockAcquired) throw new Error('System busy, please try again in a moment');

    const { hotelId, checkIn, checkOut, roomId, phone, guest, email, details } = req.body;
    
    if (!hotelId) throw new Error('hotelId is required');
    if (!checkIn || !checkOut) throw new Error('checkIn and checkOut are required');
    if (!guest || !phone) throw new Error('guest and phone are required');

    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const nights = Math.ceil((end - start) / (1000 * 60 * 60 * 24));

    // Support both payloads:
    // - direct booking: { roomId }
    // - cart/manual booking: { details: [{ name, quantity, price }...] } (allocate N room units per category)
    let chosenRoomId = roomId;
    let chosenRoom = null;
    let allocatedRoomIds = [];
    let allocatedRoomNos = [];

    if (!chosenRoomId) {
      if (!Array.isArray(details) || details.length === 0) {
        throw new Error('roomId is required for direct booking (or provide details for category booking)');
      }

      const overlappingBookings = await Booking.find({
        hotelId,
        status: { $ne: 'Cancelled' },
        checkIn: { $lt: checkOut },
        checkOut: { $gt: checkIn }
      }).lean();

      const bookedRoomIds = new Set(overlappingBookings.flatMap(b => {
        const ids = [];
        if (b.roomId) ids.push(String(b.roomId));
        if (Array.isArray(b.roomIds)) ids.push(...b.roomIds.map(x => String(x)));
        return ids;
      }));

      for (const item of details) {
        const categoryName = item?.name;
        const qty = Math.max(1, Number(item?.quantity || 1));
        if (!categoryName) throw new Error('Each details item must have a name');

        const candidateRooms = await Room.find({ hotelId, name: categoryName }).lean();
        if (!candidateRooms.length) throw new Error(`Room category not found: ${categoryName}`);

        const available = candidateRooms.filter(r => !bookedRoomIds.has(String(r._id)));
        if (available.length < qty) {
          throw new Error(`Not enough availability for "${categoryName}"`);
        }

        const chosen = available.slice(0, qty);
        chosen.forEach(r => {
          bookedRoomIds.add(String(r._id));
          allocatedRoomIds.push(String(r._id));
          allocatedRoomNos.push(String(r.roomNumber));
        });
      }

      chosenRoomId = allocatedRoomIds[0];
      chosenRoom = await Room.findOne({ hotelId, _id: chosenRoomId }).lean();
      if (!chosenRoom) throw new Error('Room not found');
    } else {
      chosenRoom = await Room.findOne({ hotelId, _id: chosenRoomId }).lean();
      if (!chosenRoom) throw new Error('Room not found');
      allocatedRoomIds = [String(chosenRoomId)];
      allocatedRoomNos = [String(chosenRoom.roomNumber)];
    }

    // Re-check overlap for all allocated rooms.
    const overlap = await Booking.findOne({
      hotelId,
      status: { $ne: 'Cancelled' },
      checkIn: { $lt: checkOut },
      checkOut: { $gt: checkIn },
      $or: [
        { roomId: { $in: allocatedRoomIds } },
        { roomIds: { $elemMatch: { $in: allocatedRoomIds } } }
      ]
    });

    if (overlap) throw new Error('Room no longer available');

    const computedSubtotal = Array.isArray(details) && details.length
      ? details.reduce((sum, d) => sum + (Number(d.price || 0) * Math.max(1, Number(d.quantity || 1))), 0)
      : chosenRoom.price;

    const numRooms = Array.isArray(details) && details.length
      ? details.reduce((sum, d) => sum + Math.max(1, Number(d.quantity || 1)), 0)
      : 1;

    const roomNameLabel = Array.isArray(details) && details.length
      ? details.map(d => `${Math.max(1, Number(d.quantity || 1))}x ${d.name}`).join(', ')
      : chosenRoom.name;

    const roomNoLabel = allocatedRoomNos.length ? allocatedRoomNos.join(', ') : chosenRoom.roomNumber;
    const finalTotal = (computedSubtotal * nights) + 50; // fixed fee preserved
    const bookingId = `BK-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;
    
    const newBooking = new Booking({
      id: bookingId,
      hotelId,
      guest: guest.trim(),
      email,
      phone,
      checkIn,
      checkOut,
      status: 'Confirmed',
      total: finalTotal.toString(),
      roomId: chosenRoomId,
      roomIds: allocatedRoomIds,
      roomNo: roomNoLabel,
      roomName: roomNameLabel,
      numRooms,
      ...(Array.isArray(details) && details.length ? { details } : {})
    });

    await newBooking.save();
    res.status(201).json({ success: true, booking: newBooking });
  } catch (err) {
    console.error("Booking Error DEBUG:", err);
    res.status(400).json({ success: false, message: err.message });
  } finally {
    if (lockAcquired) await Lock.deleteOne({ key: lockKey });
  }
};

exports.getBookings = async (req, res) => {
  try {
    const { hotelId, phone } = req.query;
    const filter = {};
    if (hotelId) filter.hotelId = hotelId;
    
    if (req.user && req.user.role === 'USER') {
      filter.phone = req.user.phoneNumber;
    } else if (phone) {
      filter.phone = phone;
    }

    const bookings = await Booking.find(filter).sort({ createdAt: -1 });
    // Backfill older multi-room bookings that were saved with only one room.
    const fixed = await Promise.all(bookings.map(b => backfillMultiRoomFieldsIfNeeded(b)));
    res.json(fixed);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getBookingById = async (req, res) => {
  try {
    const { id } = req.params;
    let booking = await Booking.findOne({ id });
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    
    if (req.user && req.user.role === 'USER' && booking.phone !== req.user.phoneNumber) {
      return res.status(403).json({ message: 'Unauthorized access to reservation' });
    }

    booking = await backfillMultiRoomFieldsIfNeeded(booking);
    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const booking = await Booking.findOne({ id });
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    if (req.user && req.user.role === 'USER') {
      if (booking.phone !== req.user.phoneNumber) return res.status(403).json({ message: 'Unauthorized' });
      if (updates.status && updates.status !== 'Cancelled') return res.status(400).json({ message: 'Users can only request cancellation' });
    }

    delete updates.hotelId;
    delete updates.total;
    delete updates.id;

    const updated = await Booking.findOneAndUpdate({ id }, updates, { new: true, runValidators: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteBooking = async (req, res) => {
  try {
    const { id } = req.params;
    await Booking.findOneAndDelete({ id });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
