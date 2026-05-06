const express = require('express');
const router = express.Router();
const roomController = require('../controllers/roomController');
const { authenticateUser, authorizeAdmin } = require('../middleware/auth');

// Public
router.get('/:hotelId', roomController.getRooms);

// Admin Only
router.post('/:hotelId', authenticateUser, authorizeAdmin, roomController.saveRoom);
router.delete('/:id', authenticateUser, authorizeAdmin, roomController.deleteRoom);

module.exports = router;
