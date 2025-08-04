const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const {authMiddleware }= require('../middleware/auth');

// Get student profile
router.get('/profile', authMiddleware('student'), studentController.getProfile);

// Update student profile
router.put('/profile', authMiddleware('student'), studentController.updateProfile);

// Change password
router.put('/change-password', authMiddleware('student'), studentController.changePassword);

module.exports = router;