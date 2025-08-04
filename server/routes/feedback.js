const express = require('express');
const router = express.Router();
const feedbackController = require('../controllers/feedbackController');
const {authMiddleware }= require('../middleware/auth');

router.post('/', authMiddleware('student'), feedbackController.createFeedback);
router.get('/', authMiddleware('admin'), feedbackController.getAllFeedback);
router.get('/student', authMiddleware('student'), feedbackController.getStudentFeedback);

module.exports = router;