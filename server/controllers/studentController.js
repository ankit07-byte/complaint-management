const Student = require('../models/Student');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');

exports.getProfile = async (req, res) => {
  try {
    const student = await Student.findById(req.user.id).select('-password');
    res.json({ success: true, data: student });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { name, mobile, department, session } = req.body;
    
    const student = await Student.findByIdAndUpdate(
      req.user.id,
      { name, mobile, department, session },
      { new: true }
    ).select('-password');
    
    res.json({ success: true, data: student });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const student = await Student.findById(req.user.id).select('+password');
    
    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, student.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Current password is incorrect' });
    }
    
    // Hash new password
    const salt = await bcrypt.genSalt(10);
    student.password = await bcrypt.hash(newPassword, salt);
    await student.save();
    
    res.json({ success: true, message: 'Password updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};