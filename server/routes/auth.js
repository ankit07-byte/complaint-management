const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { check } = require('express-validator');
const {authMiddleware} = require('../middleware/auth'); 

// Student routes
router.post('/student-signup', [
  check('name', 'Name is required').not().isEmpty(),
  check('rollNo', 'Roll number is required').not().isEmpty(),
  check('email', 'Please include a valid BIT Mesra email').isEmail().matches(/@bitmesra\.ac\.in$/),
 
  check('mobile', 'Invalid mobile number')
  .trim()
  .matches(/^(\+91[\-\s]?)?[0]?[6-9]\d{9}$/),
  


  check('session', 'Please provide session in format YYYY-YY').matches(/^\d{4}-\d{2}$/),
  check('department', 'Please select your department').not().isEmpty(),
  check('password', 'Password must be at least 8 characters').isLength({ min: 8 })
], authController.studentSignup);

router.post('/verify-email', authController.verifyStudentEmail);
router.post('/student-login', authController.studentLogin);

// Authority routes
router.post('/authority-signup', [
  check('name', 'Name is required').not().isEmpty(),
  check('email', 'Please include a valid BIT Mesra email').isEmail().matches(/@bitmesra\.ac\.in$/),
  check('mobile', 'Please provide a valid Indian mobile number').matches(/^(\+91)?[6-9]\d{9}$/),

  check('designation', 'Please select your designation').not().isEmpty(),
  check('password', 'Password must be at least 8 characters').isLength({ min: 8 })
], authController.authoritySignup);

router.post('/verify-authority-email', authController.verifyAuthorityEmail);
router.post('/authority-login', authController.authorityLogin);

// Admin routes
router.post('/admin-login', authController.adminLogin);
router.post('/logout', authController.logout);

// Password reset routes
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);
router.get('/check-auth', authMiddleware, authController.checkAuth);
router.post('/resend-otp', authController.resendStudentOtp);


module.exports = router;