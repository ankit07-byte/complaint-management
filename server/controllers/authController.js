const Student = require('../models/Student');
const Authority = require('../models/Authority');
const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const { validationResult } = require('express-validator');

// Configure email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD
  }
});

// Generate OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send verification email
const sendVerificationEmail = async (email, otp) => {
  const mailOptions = {
    from: process.env.EMAIL_USERNAME,
    to: email,
    subject: 'Email Verification OTP',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #4a5568;">BIT Mesra Complaint System</h2>
        <p>Your OTP for email verification is:</p>
        <h1 style="color: #3182ce; text-align: center;">${otp}</h1>
        <p>This OTP is valid for 10 minutes.</p>
        <p style="color: #718096;">If you didn't request this, please ignore this email.</p>
      </div>
    `
  };

  await transporter.sendMail(mailOptions);
};

// Student Signup
exports.studentSignup = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, rollNo, email, mobile, session, department, password } = req.body;

    // Check if student already exists
    const existingStudent = await Student.findOne({ $or: [{ email }, { rollNo }] });
    if (existingStudent) {
      return res.status(400).json({ 
        success: false,
        message: 'Student with this email or roll number already exists'
      });
    }

    // Create new student
    const student = new Student({
      name,
      rollNo,
      email,
      mobile,
      session,
      department,
      password
    });

    // Generate OTP
    const otp = generateOTP();
    student.verificationToken = otp;
    student.verificationTokenExpires = Date.now() + 600000; // 10 minutes

    await student.save();

    // Send verification email
    await sendVerificationEmail(email, otp);

    res.status(201).json({
      success: true,
      message: 'OTP sent to your email. Please verify to complete registration.',
      email: student.email
    });

  } catch (error) {
    console.error('Error in student signup:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error during signup',
      error: error.message 
    });
  }
};

// Verify Student Email
exports.verifyStudentEmail = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const student = await Student.findOne({ 
      email,
      verificationToken: otp,
      verificationTokenExpires: { $gt: Date.now() }
    });

    if (!student) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired OTP'
      });
    }

    // Mark as verified
    student.isVerified = true;
    student.verificationToken = undefined;
    student.verificationTokenExpires = undefined;
    await student.save();

    // Generate token
    const token = student.generateAuthToken();

    res.status(200).json({
      success: true,
      token,
      role: 'student',
      message: 'Email verified successfully. You are now logged in.'
    });

  } catch (error) {
    console.error('Error verifying email:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during email verification',
      error: error.message
    });
  }
};

// Student Login
exports.studentLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if student exists
    const student = await Student.findOne({ email }).select('+password');
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'User does not exist'
      });
    }

    // Check if email is verified
    if (!student.isVerified) {
      return res.status(401).json({
        success: false,
        message: 'Please verify your email first'
      });
    }

    // Check password
    const isMatch = await student.comparePassword(password);
    console.log('Password match:', isMatch); // Debugging line
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Incorrect password'
      });
    }

    // Generate token
    const token = student.generateAuthToken();

    res.status(200).json({
      success: true,
      token,
      role: 'student',
      user: {
        id: student._id,
        name: student.name,
        email: student.email,
        rollNo: student.rollNo,
        department: student.department,
        // any other fields you want frontend to have
      }
    });

  } catch (error) {
    console.error('Error in student login:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login',
      error: error.message
    });
  }
};

// Authority Signup
exports.authoritySignup = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, mobile, designation, hostelNo, password } = req.body;

    // Check if authority already exists
    const existingAuthority = await Authority.findOne({ email });
    if (existingAuthority) {
      return res.status(400).json({
        success: false,
        message: 'Authority with this email already exists'
      });
    }

    // Create new authority
    const authority = new Authority({
      name,
      email,
      mobile,
      designation,
      hostelNo,
      password
    });

    // Generate OTP
    const otp = generateOTP();
    authority.verificationToken = otp;
    authority.verificationTokenExpires = Date.now() + 600000; // 10 minutes

    await authority.save();

    // Send verification email
    await sendVerificationEmail(email, otp);

    res.status(201).json({
      success: true,
      message: 'OTP sent to your email. Please verify to complete registration.',
      email: authority.email
    });

  } catch (error) {
    console.error('Error in authority signup:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during signup',
      error: error.message
    });
  }
};

// Verify Authority Email
exports.verifyAuthorityEmail = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const authority = await Authority.findOne({
      email,
      verificationToken: otp,
      verificationTokenExpires: { $gt: Date.now() }
    });

    if (!authority) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired OTP'
      });
    }

    // Mark as verified
    authority.isVerified = true;
    authority.verificationToken = undefined;
    authority.verificationTokenExpires = undefined;
    await authority.save();

    // Generate token
    const token = authority.generateAuthToken();

    res.status(200).json({
      success: true,
      token,
      role: 'authority',
      designation: authority.designation,
      message: 'Email verified successfully. You are now logged in.'
    });

  } catch (error) {
    console.error('Error verifying authority email:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during email verification',
      error: error.message
    });
  }
};

// Authority Login
exports.authorityLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if authority exists
    const authority = await Authority.findOne({ email }).select('+password');
    if (!authority) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check password
    const isMatch = await authority.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Generate token
    const token = authority.generateAuthToken();

    res.status(200).json({
        success: true,
        token,
        role: 'authority',
        designation: authority.designation,
        user: {
          id: authority._id,
          name: authority.name,
          email: authority.email,
          designation: authority.designation
        }
      });
      

  } catch (error) {
    console.error('Error in authority login:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login',
      error: error.message
    });
  }
};

// Admin Login
// Admin Login
exports.adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email }).select('+password');
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    const token = admin.generateAuthToken();

    // 🟢 FIX: Include user object in the response
    res.status(200).json({
      success: true,
      token,
      role: 'admin',
      user: {
        id: admin._id,
        email: admin.email,
        role: 'admin'
      }
    });

  } catch (error) {
    console.error('Error in admin login:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login',
      error: error.message
    });
  }
};


// Forgot Password
exports.forgotPassword = async (req, res) => {
  try {
    const { email, role } = req.body;

    let user;
    if (role === 'student') {
      user = await Student.findOne({ email });
    } else if (role === 'authority') {
      user = await Authority.findOne({ email });
    } else if (role === 'admin') {
      user = await Admin.findOne({ email });
    } else {
      return res.status(400).json({
        success: false,
        message: 'Invalid role specified'
      });
    }

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Generate OTP
    const otp = generateOTP();
    user.resetPasswordToken = otp;
    user.resetPasswordExpires = Date.now() + 600000; // 10 minutes
    await user.save();

    // Send reset email
    await sendVerificationEmail(email, otp);

    res.status(200).json({
      success: true,
      message: 'OTP sent to your email for password reset',
      email: user.email
    });

  } catch (error) {
    console.error('Error in forgot password:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during password reset',
      error: error.message
    });
  }
};

// Reset Password
exports.resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword, role } = req.body;

    let user;
    if (role === 'student') {
      user = await Student.findOne({ 
        email,
        resetPasswordToken: otp,
        resetPasswordExpires: { $gt: Date.now() }
      }).select('+password');
    } else if (role === 'authority') {
      user = await Authority.findOne({ 
        email,
        resetPasswordToken: otp,
        resetPasswordExpires: { $gt: Date.now() }
      }).select('+password');
    } else if (role === 'admin') {
      user = await Admin.findOne({ 
        email,
        resetPasswordToken: otp,
        resetPasswordExpires: { $gt: Date.now() }
      }).select('+password');
    } else {
      return res.status(400).json({
        success: false,
        message: 'Invalid role specified'
      });
    }

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired OTP'
      });
    }

    // Update password
    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password reset successfully. You can now login with your new password.'
    });

  } catch (error) {
    console.error('Error in reset password:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during password reset',
      error: error.message
    });
  }
};
exports.checkAuth = async (req, res) => {
    try {
      // req.user should be set by authMiddleware from token
      const userId = req.user.id;
      const role = req.user.role; // assuming role is in JWT payload
  
      let user;
      if (role === 'student') {
        user = await Student.findById(userId).select('-password');
      } else if (role === 'authority') {
        user = await Authority.findById(userId).select('-password');
      } else if (role === 'admin') {
        user = await Admin.findById(userId).select('-password');
      } else {
        return res.status(401).json({ success: false, message: 'Invalid role' });
      }
  
      if (!user) {
        return res.status(401).json({ success: false, message: 'User not found' });
      }
  
      res.status(200).json({ success: true, user });
  
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
  };

  exports.logout = async (req, res) => {
  try {
    res.clearCookie('token'); // optional, if you're using cookies
    res.status(200).json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ success: false, message: 'Logout failed', error: error.message });
  }
};
exports.resendStudentOtp = async (req, res) => {
  const { email } = req.body;
  const student = await Student.findOne({ email });
  if (!student) {
    return res.status(404).json({ message: "User not found" });
  }
  
  // Generate new OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  student.otp = otp;
  student.otpExpiry = Date.now() + 15 * 60 * 1000; // 15 min expiry
  await student.save();

  // Send OTP via email
   await sendVerificationEmail(email, otp);

  res.json({ message: "OTP resent successfully" });
};



  