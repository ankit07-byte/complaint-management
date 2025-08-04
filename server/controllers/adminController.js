const Admin = require('../models/Admin');
const Complaint = require('../models/Complaint');
const Feedback = require('../models/Feedback');
const Student = require('../models/Student');
const Authority = require('../models/Authority');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

// Configure email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD
  }
});

// Admin Login
exports.login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    // Check if admin exists
    const admin = await Admin.findOne({ email }).select('+password');
    if (!admin) {
      return res.status(401).json({ 
        success: false,
        message: 'Invalid credentials' 
      });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ 
        success: false,
        message: 'Invalid credentials' 
      });
    }

    // Create JWT token
    const token = jwt.sign(
      { id: admin._id, role: 'admin' },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE }
    );

    // Set cookie
    res.cookie('token', token, {
      httpOnly: true,
      expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
      secure: process.env.NODE_ENV === 'production'
    });

    res.status(200).json({
      success: true,
      token,
      role: 'admin'
    });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error during login' 
    });
  }
};

// Get all complaints with filters
exports.getAllComplaints = async (req, res) => {
  try {
    const { type, hostelNo, status } = req.query;
    let query = {};

    if (type) query.type = type;
    if (hostelNo) query.hostelNo = hostelNo;
    if (status) query.status = status;

    const complaints = await Complaint.find(query)
      .populate('student', 'name rollNo email')
      .populate('assignedTo', 'name designation')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: complaints.length,
      data: complaints
    });
  } catch (error) {
    console.error('Get all complaints error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error fetching complaints' 
    });
  }
};

// Get all feedback
exports.getAllFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.find()
      .populate('student', 'name rollNo')
      .populate('complaint', 'token type subType')
      .sort({ createdAt: -1 });

    // Calculate average rating
    const avgRating = feedback.reduce((acc, curr) => acc + curr.rating, 0) / feedback.length || 0;

    res.status(200).json({
      success: true,
      count: feedback.length,
      averageRating: avgRating.toFixed(1),
      data: feedback
    });
  } catch (error) {
    console.error('Get all feedback error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error fetching feedback' 
    });
  }
};

// Get system statistics
exports.getSystemStats = async (req, res) => {
  try {
    const [
      totalStudents,
      totalAuthorities,
      totalComplaints,
      pendingComplaints,
      resolvedComplaints,
      totalFeedback
    ] = await Promise.all([
      Student.countDocuments(),
      Authority.countDocuments(),
      Complaint.countDocuments(),
      Complaint.countDocuments({ status: 'Pending' }),
      Complaint.countDocuments({ status: 'Resolved' }),
      Feedback.countDocuments()
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalStudents,
        totalAuthorities,
        totalComplaints,
        pendingComplaints,
        resolvedComplaints,
        totalFeedback
      }
    });
  } catch (error) {
    console.error('Get system stats error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error fetching system stats' 
    });
  }
};

// Get all users (students + authorities)
exports.getAllUsers = async (req, res) => {
  try {
    const [students, authorities] = await Promise.all([
      Student.find().select('-password'),
      Authority.find().select('-password')
    ]);

    res.status(200).json({
      success: true,
      data: {
        students,
        authorities
      }
    });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error fetching users' 
    });
  }
};

// Update user (student or authority)
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Find and update in both collections
    let user = await Student.findByIdAndUpdate(id, updateData, { new: true }).select('-password');
    if (!user) {
      user = await Authority.findByIdAndUpdate(id, updateData, { new: true }).select('-password');
    }

    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'User not found' 
      });
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error updating user' 
    });
  }
};

// Delete user
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Try to delete from both collections
    const student = await Student.findByIdAndDelete(id);
    const authority = student ? null : await Authority.findByIdAndDelete(id);

    if (!student && !authority) {
      return res.status(404).json({ 
        success: false,
        message: 'User not found' 
      });
    }

    // Also delete related complaints and feedback
    await Complaint.deleteMany({ student: id });
    await Feedback.deleteMany({ student: id });

    res.status(200).json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error deleting user' 
    });
  }
};