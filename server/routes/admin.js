// const express = require('express');
// const router = express.Router();
// const adminController = require('../controllers/adminController');
// const {authMiddleware} = require('../middleware/auth');

// // Admin login
// router.post('/login', adminController.login);

// // Get all complaints (with filters)
// router.get('/complaints', authMiddleware('admin'), adminController.getAllComplaints);

// // Get all feedback
// router.get('/feedback', authMiddleware('admin'), adminController.getAllFeedback);

// // Get system statistics
// router.get('/stats', authMiddleware('admin'), adminController.getSystemStats);

// // Manage users
// router.get('/users', authMiddleware('admin'), adminController.getAllUsers);
// router.put('/users/:id', authMiddleware('admin'), adminController.updateUser);
// router.delete('/users/:id', authMiddleware('admin'), adminController.deleteUser);

// module.exports = router;
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authMiddleware } = require('../middleware/auth');

// Admin login
router.post('/login', adminController.login);

// Get all complaints (with filters)
router.get('/complaints', authMiddleware('admin'), adminController.getAllComplaints);

// Get all feedback
router.get('/feedback', authMiddleware('admin'), adminController.getAllFeedback);

// Get system statistics
router.get('/stats', authMiddleware('admin'), adminController.getSystemStats);

// Manage users
router.get('/users', authMiddleware('admin'), adminController.getAllUsers);
router.put('/users/:id', authMiddleware('admin'), adminController.updateUser);
router.delete('/users/:id', authMiddleware('admin'), adminController.deleteUser);

// ✅ NEW: Verify authority account
//router.put('/verify-authority/:id', authMiddleware('admin'), adminController.verifyAuthorityAccount);

module.exports = router;
