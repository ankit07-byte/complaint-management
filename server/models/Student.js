const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true,
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  rollNo: {
    type: String,
    required: [true, 'Please provide your roll number'],
    unique: true,
    trim: true,
    uppercase: true
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [
      /^[\w-\.]+@bitmesra\.ac\.in$/,
      'Please provide a valid BIT Mesra email address'
    ]
  },
  mobile: {
    type: String,
    required: [true, 'Please provide your mobile number'],
    match: [
      /^(\+91[\-\s]?)?[0]?[6-9]\d{9}$/,
      'Please provide a Indian mobile number'
    ]
  },
  
  session: {
    type: String,
    required: [true, 'Please provide your academic session'],
    match: [
      /^\d{4}-\d{2}$/,
      'Please provide session in format YYYY-YY (e.g., 2023-24)'
    ]
  },
  department: {
    type: String,
    required: [true, 'Please select your department'],
    enum: [
      'Computer Science',
      'Electrical',
      'Mechanical',
      'Civil',
      'Electronics',
      'Chemical',
      'Production',
      'Metallurgy',
      'Architecture',
      'Planning',
      'Pharmacy',
      'Applied Mathematics',
      'Applied Physics',
      'Applied Chemistry',
      'Management'
    ]
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: [8, 'Password must be at least 8 characters'],
    select: false
  },
  hostelNo: {
    type: Number,
    min: 1,
    max: 13
  },
  roomNo: {
    type: String
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationToken: String,
  verificationTokenExpires: Date,
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Hash password before saving
studentSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Generate JWT token
studentSchema.methods.generateAuthToken = function() {
  return jwt.sign(
    { id: this._id, role: 'student' },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE }
  );
};

// Generate verification token
studentSchema.methods.generateVerificationToken = function() {
  const verificationToken = jwt.sign(
    { id: this._id },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );
  
  this.verificationToken = verificationToken;
  this.verificationTokenExpires = Date.now() + 3600000; // 1 hour
  
  return verificationToken;
};

// Generate password reset token
studentSchema.methods.generatePasswordResetToken = function() {
  const resetToken = jwt.sign(
    { id: this._id },
    process.env.JWT_SECRET,
    { expiresIn: '30m' }
  );
  
  this.resetPasswordToken = resetToken;
  this.resetPasswordExpires = Date.now() + 1800000; // 30 minutes
  
  return resetToken;
};

// Compare passwords
studentSchema.methods.comparePassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('Student', studentSchema);