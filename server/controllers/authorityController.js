const Authority = require('../models/Authority');
const Complaint = require('../models/Complaint');
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

// Authority Registration
exports.register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, mobile, designation, hostelNo, password } = req.body;

  try {
    // Check if authority exists
    let authority = await Authority.findOne({ email });
    if (authority) {
      return res.status(400).json({ 
        success: false,
        message: 'Authority with this email already exists' 
      });
    }

    // Create new authority
    authority = new Authority({
      name,
      email,
      mobile,
      designation,
      department: designation === 'Network Department' ? 'Network' : undefined,
      hostelNo: designation === 'Hostel Clerk' || designation === 'Warden' ? hostelNo : undefined,
      password
    });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    authority.password = await bcrypt.hash(password, salt);

    await authority.save();

    // Generate verification token
    const token = jwt.sign(
      { id: authority._id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Send verification email
    const verificationUrl = `${process.env.CLIENT_URL}/verify-email?token=${token}&role=authority`;
    
    const mailOptions = {
      from: process.env.EMAIL_USERNAME,
      to: email,
      subject: 'Verify Your Authority Account',
      html: `
        <h2>Welcome to BIT Mesra Complaint System</h2>
        <p>Please click the link below to verify your authority account:</p>
        <a href="${verificationUrl}">Verify Account</a>
        <p>This link will expire in 1 hour.</p>
      `
    };

    await transporter.sendMail(mailOptions);

    res.status(201).json({
      success: true,
      message: 'Authority registered successfully. Verification email sent.'
    });
  } catch (error) {
    console.error('Authority registration error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error during registration' 
    });
  }
};

// Authority Login
exports.login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    // Check if authority exists
    const authority = await Authority.findOne({ email }).select('+password');
    if (!authority) {
      return res.status(401).json({ 
        success: false,
        message: 'Invalid credentials' 
      });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, authority.password);
    if (!isMatch) {
      return res.status(401).json({ 
        success: false,
        message: 'Invalid credentials' 
      });
    }

    // Create JWT token
    const token = jwt.sign(
      { 
        id: authority._id, 
        role: 'authority', 
        designation: authority.designation,
        department: authority.department,
        hostelNo: authority.designation === 'Network Department' ? undefined : authority.hostelNo
      },
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
      role: 'authority',
      designation: authority.designation,
      department: authority.department
    });
  } catch (error) {
    console.error('Authority login error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error during login' 
    });
  }
};

// Get complaints assigned to this authority
exports.getAssignedComplaints = async (req, res) => {
  try {
    let query = {};

    // Network department sees network/internet complaints
    if (req.user.department === 'Network') {
      query = { 
        subType: { $in: ['Network', 'Internet'] }
      };
    } 
    // Hostel clerks and wardens see their hostel complaints
    else if (req.user.designation === 'Hostel Clerk' || req.user.designation === 'Warden') {
      query = { 
        hostelNo: req.user.hostelNo,
        type: 'Hostel'
      };
    }

    const complaints = await Complaint.find(query)
      .populate('student', 'name rollNo roomNo')
      .sort({ status: 1, createdAt: -1 });

    res.status(200).json({
      success: true,
      count: complaints.length,
      data: complaints
    });
  } catch (error) {
    console.error('Get assigned complaints error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error fetching complaints' 
    });
  }
};

// Get network-related complaints
exports.getNetworkComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({ 
      subType: { $in: ['Network', 'Internet'] }
    })
    .populate('student', 'name rollNo roomNo')
    .sort({ status: 1, createdAt: -1 });

    res.status(200).json({
      success: true,
      count: complaints.length,
      data: complaints
    });
  } catch (error) {
    console.error('Get network complaints error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error fetching network complaints' 
    });
  }
};

// Get hostel-specific complaints
exports.getHostelComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({ 
      type: 'Hostel',
      hostelNo: req.params.hostelNo
    })
    .populate('student', 'name rollNo roomNo')
    .sort({ status: 1, createdAt: -1 });

    res.status(200).json({
      success: true,
      count: complaints.length,
      data: complaints
    });
  } catch (error) {
    console.error('Get hostel complaints error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error fetching hostel complaints' 
    });
  }
};

// Update complaint status
exports.updateComplaintStatus = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { id } = req.params;
  const { status, remarks } = req.body;

  try {
    const complaint = await Complaint.findByIdAndUpdate(
      id,
      { 
        status,
        remarks,
        assignedTo: req.user.id,
        updatedAt: Date.now()
      },
      { new: true }
    ).populate('student', 'name rollNo email');

    if (!complaint) {
      return res.status(404).json({ 
        success: false,
        message: 'Complaint not found' 
      });
    }

    // Send email notification to student if status is resolved
    if (status === 'Resolved') {
      const mailOptions = {
        from: process.env.EMAIL_USERNAME,
        to: complaint.student.email,
        subject: `Your Complaint ${complaint.token} has been resolved`,
        html: `
          <h3>Complaint Resolved</h3>
          <p>Your complaint with token <strong>${complaint.token}</strong> has been marked as resolved.</p>
          ${remarks ? `<p><strong>Remarks:</strong> ${remarks}</p>` : ''}
          <p>Thank you for using our complaint system.</p>
        `
      };

      await transporter.sendMail(mailOptions);
    }

    res.status(200).json({
      success: true,
      data: complaint
    });
  } catch (error) {
    console.error('Update complaint status error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error updating complaint' 
    });
  }
};

// Get authority profile
exports.getProfile = async (req, res) => {
  try {
    const authority = await Authority.findById(req.user.id).select('-password');
    res.status(200).json({
      success: true,
      data: authority
    });
  } catch (error) {
    console.error('Get authority profile error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error fetching profile' 
    });
  }
};

// Update authority profile
exports.updateProfile = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, mobile } = req.body;

  try {
    const authority = await Authority.findByIdAndUpdate(
      req.user.id,
      { name, mobile },
      { new: true }
    ).select('-password');

    res.status(200).json({
      success: true,
      data: authority
    });
  } catch (error) {
    console.error('Update authority profile error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error updating profile' 
    });
  }
};
