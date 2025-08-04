const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const authoritySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true,
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    trim: true,
    lowercase: true
    // match: [
    //   // /^[\w-\.]+@bitmesra\.ac\.in$/,
    //   'Please provide a valid BIT Mesra email address'
    // ]
  },
  mobile: {
    type: String,
    required: [true, 'Please provide your mobile number'],
    match: [
      /^(\+91[\-\s]?)?[0]?(91)?[789]\d{9}$/,
      'Please provide a valid Indian mobile number'
    ]
  },
  designation: {
    type: String,
    required: [true, 'Please select your designation'],
    enum: ['Hostel Clerk', 'Warden', 'Network Department', 'Other']
  },
  department: {
    type: String,
    default: function() {
      return this.designation === 'Network Department' ? 'Network' : undefined;
    },
    enum: ['Network']
  },
  hostelNo: {
    type: Number,
    min: 1,
    max: 13,
    required: function() {
      return this.designation === 'Hostel Clerk' || this.designation === 'Warden';
    },
    validate: {
      validator: function() {
        return this.designation !== 'Network Department';
      },
      message: 'Hostel number should not be set for Network Department'
    }
  },
  profilePic: {
    type: String,
    default: 'default.jpg'
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: [8, 'Password must be at least 8 characters'],
    select: false
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
authoritySchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  
  // Ensure Network Department authorities don't have hostelNo
  if (this.designation === 'Network Department') {
    this.hostelNo = undefined;
  }
  
  next();
});

// Generate JWT token
authoritySchema.methods.generateAuthToken = function() {
  return jwt.sign(
    { 
      id: this._id, 
      role: 'authority',
      designation: this.designation,
      department: this.department,
      // Don't include hostelNo for Network Department
      hostelNo: this.designation === 'Network Department' ? undefined : this.hostelNo
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE }
  );
};

// Compare passwords
authoritySchema.methods.comparePassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('Authority', authoritySchema);