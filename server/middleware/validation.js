const Booking = require('../models/Booking');

const VALID_STATUS_FLOW = {
  'Pending': ['Confirmed', 'Cancelled'],
  'Booked': ['Confirmed', 'Cancelled'],
  'Confirmed': ['Assigned', 'Checked In', 'Cancelled'],
  'Assigned': ['Checked In', 'Cancelled'],
  'Checked In': ['Checked Out', 'Completed'],
  'Checked Out': ['Completed'],
  'Completed': [],
  'Cancelled': []
};

exports.validateBookingPayload = (req, res, next) => {
  console.log("Validation Payload check:", req.body);
  const { checkIn, checkOut, details, phone, roomId } = req.body;

  if (!checkIn || !checkOut || !phone || (!details && !roomId)) {
    return res.status(400).json({ message: 'Missing mandatory booking fields' });
  }

  const start = new Date(checkIn);
  const end = new Date(checkOut);

  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return res.status(400).json({ message: 'Invalid date format' });
  }

  if (end <= start) {
    return res.status(400).json({ message: 'Check-out must be after check-in' });
  }

  if (!roomId && (!Array.isArray(details) || details.length === 0)) {
    return res.status(400).json({ message: 'Booking must contain at least one room category or specific room ID' });
  }

  next();
};

exports.statusTransitionGuard = async (req, res, next) => {
  const { id } = req.params;
  const { status: newStatus } = req.body;

  if (!newStatus) return next();

  const currentBooking = await Booking.findOne({ id });
  if (!currentBooking) return res.status(404).json({ message: 'Booking not found' });

  const allowedNext = VALID_STATUS_FLOW[currentBooking.status] || [];
  if (!allowedNext.includes(newStatus) && currentBooking.status !== newStatus) {
    return res.status(400).json({ 
      message: `Invalid status transition from ${currentBooking.status} to ${newStatus}` 
    });
  }

  next();
};
