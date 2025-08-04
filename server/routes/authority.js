const express = require('express');
const router = express.Router();
const authorityController = require('../controllers/authorityController');
const { authMiddleware } = require('../middleware/auth');
const { validateAuthority } = require('../middleware/validation');

// Authentication routes
router.post('/register', validateAuthority, authorityController.register);
router.post('/login', authorityController.login);

// Complaint management routes
router.route('/complaints')
  .get(authMiddleware('authority'), (req, res, next) => {
    try {
      if (req.user.department === 'Network') {
        return authorityController.getNetworkComplaints(req, res, next);
      }
      if (req.user.designation === 'Hostel Clerk' || req.user.designation === 'Warden') {
        req.params = { ...req.params, hostelNo: req.user.hostelNo };
        return authorityController.getHostelComplaints(req, res, next);
      }
      return authorityController.getAssignedComplaints(req, res, next);
    } catch (error) {
      next(error);
    }
  });

router.route('/complaints/:id')
  .put(authMiddleware('authority'), authorityController.updateComplaintStatus);

// Profile management routes
router.route('/profile')
  .get(authMiddleware('authority'), authorityController.getProfile)
  .put(authMiddleware('authority'), validateAuthority, authorityController.updateProfile);

module.exports = router;