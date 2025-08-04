const Feedback = require('../models/Feedback');
const Complaint = require('../models/Complaint');
const { validationResult } = require('express-validator');

// Create feedback
exports.createFeedback = async (req, res) => {
  try {
    const { complaintId, rating, comments } = req.body;

    const feedback = new Feedback({
      student: req.user.id,
      complaint: complaintId,
      rating,
      comments
    });

    await feedback.save();

    res.status(201).json({
      success: true,
      message: 'Feedback submitted successfully',
      data: feedback
    });

  } catch (error) {
    console.error('Error creating feedback:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while submitting feedback',
      error: error.message
    });
  }
};

// Get all feedback (admin)
exports.getAllFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.find()
      .populate('student', 'name rollNo')
      .populate('complaint', 'token type subType')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: feedback.length,
      data: feedback
    });

  } catch (error) {
    console.error('Error fetching feedback:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching feedback',
      error: error.message
    });
  }
};

// Get student feedback
exports.getStudentFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.find({ student: req.user.id })
      .populate('complaint', 'token type subType status')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: feedback.length,
      data: feedback
    });

  } catch (error) {
    console.error('Error fetching student feedback:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching feedback',
      error: error.message
    });
  }
};