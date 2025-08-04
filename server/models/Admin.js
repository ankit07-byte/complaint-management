const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const adminSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [
      /^[\w-\.]+@bitmesra\.ac\.in$/,
      'Please provide a valid BIT Mesra email address'
    ]
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: [8, 'Password must be at least 8 characters'],
    select: false
  },
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Hash password before saving
adminSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Generate JWT token
adminSchema.methods.generateAuthToken = function() {
  return jwt.sign(
    { id: this._id, role: 'admin' },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE }
  );
};

// Compare passwords
adminSchema.methods.comparePassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Generate password reset token
adminSchema.methods.generatePasswordResetToken = function() {
  const resetToken = jwt.sign(
    { id: this._id },
    process.env.JWT_SECRET,
    { expiresIn: '30m' }
  );
  
  this.resetPasswordToken = resetToken;
  this.resetPasswordExpires = Date.now() + 1800000; // 30 minutes
  
  return resetToken;
};

module.exports = mongoose.model('Admin', adminSchema);