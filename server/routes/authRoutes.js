const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticateUser } = require('../middleware/auth');

router.post('/verify-otp', authController.verifyOTP);
router.post('/admin-login', authController.adminLogin);

// Protected user profile routes
router.get('/me', authenticateUser, authController.getMe);
router.patch('/me', authenticateUser, authController.updateMe);

module.exports = router;
