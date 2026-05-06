const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const { authenticateUser, authorizeAdmin } = require('../middleware/auth');
const { validateBookingPayload, statusTransitionGuard } = require('../middleware/validation');

// PUBLIC GUEST ROUTES
router.get('/availability/:hotelId', bookingController.getAvailableRoomsByCategory);

// PROTECTED GUEST ROUTES
router.post('/', authenticateUser, validateBookingPayload, bookingController.createBooking);
router.get('/', authenticateUser, bookingController.getBookings);
router.get('/:id', authenticateUser, bookingController.getBookingById);

// ADMIN PROTECTED ROUTES
router.patch('/:id', 
  authenticateUser, 
  authorizeAdmin, 
  statusTransitionGuard, 
  bookingController.updateBooking
);

router.delete('/:id', 
  authenticateUser, 
  authorizeAdmin, 
  bookingController.deleteBooking
);

module.exports = router;
