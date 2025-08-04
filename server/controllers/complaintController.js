const Complaint = require('../models/Complaint');
const Student = require('../models/Student');
const Authority = require('../models/Authority');
const { validationResult } = require('express-validator');

// Create a new complaint
exports.createComplaint = async (req, res) => {
  // Validate request
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    let { type, hostelNo, roomNo, subType, description } = req.body;

    // Convert hostelNo to Number if present
    if (hostelNo) hostelNo = Number(hostelNo);

    // Validate: Network complaints should not contain hostel/room info
    if (
      (type === 'Network' || subType === 'Network' || subType === 'Internet') &&
      (hostelNo || roomNo)
    ) {
      return res.status(400).json({
        success: false,
        message: 'Network complaints should not include hostel or room number'
      });
    }

    let assignedTo = undefined;

    // Assign to Network department authority
    if (type === 'Network' || subType === 'Network' || subType === 'Internet') {
      const networkAuthority = await Authority.findOne({ department: 'Network' });
      if (networkAuthority) {
        assignedTo = networkAuthority._id;
      } else {
        console.warn('⚠️ No network authority found');
      }
    }

    // Assign to Hostel Clerk based on hostelNo
    else if (type === 'Hostel' && hostelNo) {
      const hostelClerk = await Authority.findOne({
        designation: 'Hostel Clerk',
        hostelNo: Number(hostelNo)
      });

      if (hostelClerk) {
        assignedTo = hostelClerk._id;
      } else {
        console.warn(`⚠️ No clerk found for hostel ${hostelNo}`);
      }
    }

    // Create and save the complaint
    const complaint = new Complaint({
      student: req.user.id,
      type,
      hostelNo: type === 'Network' ? undefined : hostelNo,
      roomNo: type === 'Network' ? undefined : roomNo,
      subType,
      description,
      assignedTo
    });

    const savedComplaint = await complaint.save();

    return res.status(201).json({
      success: true,
      token: savedComplaint.token,
      message: 'Complaint filed successfully'
    });
  } catch (error) {
    console.error('❌ Error creating complaint:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while filing complaint',
      error: error.message
    });
  }
};

  


// Get complaints for student
exports.getStudentComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({ student: req.user.id })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: complaints.length,
      data: complaints
    });

  } catch (error) {
    console.error('Error fetching student complaints:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching complaints',
      error: error.message
    });
  }
};

// Get complaint by token
exports.getComplaintByToken = async (req, res) => {
  try {
    const complaint = await Complaint.findOne({ token: req.params.token })
      .populate('student', 'name rollNo')
      .populate('assignedTo', 'name designation');

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found'
      });
    }

    // Check authorization
    if (req.user.role === 'student' && complaint.student._id.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this complaint'
      });
    }

    res.status(200).json({
      success: true,
      data: complaint
    });

  } catch (error) {
    console.error('Error fetching complaint:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching complaint',
      error: error.message
    });
  }
};

// Get complaints for authority (with network department support)
exports.getAuthorityComplaints = async (req, res) => {
  try {
    let query = {};

    const userId = req.user._id; // use ObjectId

    if (req.user.department === 'Network') {
      // For network department authority
      query = {
        assignedTo: userId,
        $or: [
          { type: 'Network' },
          { subType: 'Network' },
          { subType: 'Internet' }
        ]
      };
    } else if (['Hostel Clerk', 'Warden'].includes(req.user.designation)) {
      // For hostel staff
      query = {
        assignedTo: userId,
        type: 'Hostel'
      };
    } else {
      // General fallback
      query = { assignedTo: userId };
    }

    const complaints = await Complaint.find(query)
      .sort({ createdAt: -1 })
      .populate('student', 'name rollNo roomNo')
      .populate('assignedTo', 'name designation');

    res.status(200).json({
      success: true,
      count: complaints.length,
      data: complaints
    });

  } catch (error) {
    console.error('Error fetching authority complaints:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching complaints',
      error: error.message
    });
  }
};



// Get network-related complaints
exports.getNetworkComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({
      $or: [
        { type: 'Network' },
        { subType: 'Network' },
        { subType: 'Internet' }
      ]
    })
    .sort({ status: 1, createdAt: -1 })
    .populate('student', 'name rollNo roomNo')
    .populate('assignedTo', 'name designation');

    res.status(200).json({
      success: true,
      count: complaints.length,
      data: complaints
    });

  } catch (error) {
    console.error('Error fetching network complaints:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching network complaints',
      error: error.message
    });
  }
};

// Get hostel-specific complaints
exports.getHostelComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({ 
      type: 'Hostel',
      hostelNo: req.user.hostelNo,
      assignedTo: req.user._id  // fixed from req.user.id
    })
    .sort({ status: 1, createdAt: -1 })
    .populate('student', 'name rollNo roomNo')
    .populate('assignedTo', 'name designation');

    res.status(200).json({
      success: true,
      count: complaints.length,
      data: complaints
    });

  } catch (error) {
    console.error('Error fetching hostel complaints:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching hostel complaints',
      error: error.message
    });
  }
};


// Update complaint status
exports.updateComplaintStatus = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { status, remarks } = req.body;

    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      { 
        status,
        remarks,
        assignedTo: req.user.id,
        updatedAt: Date.now()
      },
      { new: true }
    )
    .populate('student', 'name rollNo email')
    .populate('assignedTo', 'name designation');

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Complaint status updated successfully',
      data: complaint
    });

  } catch (error) {
    console.error('Error updating complaint:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating complaint',
      error: error.message
    });
  }
};

// Get all complaints for admin
exports.getAllComplaints = async (req, res) => {
  try {
    let query = {};
    
    if (req.query.hostelNo) {
      query.type = 'Hostel';
      query.hostelNo = req.query.hostelNo;
    }

    if (req.query.type === 'Network') {
      query.$or = [
        { type: 'Network' },
        { subType: 'Network' }
      ];
    }

    const complaints = await Complaint.find(query)
      .sort({ createdAt: -1 })
      .populate('student', 'name rollNo')
      .populate('assignedTo', 'name designation');

    res.status(200).json({
      success: true,
      count: complaints.length,
      data: complaints
    });

  } catch (error) {
    console.error('Error fetching all complaints:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching complaints',
      error: error.message
    });
  }
};
exports.getHostelComplaintsByHostelNo = async (hostelNo) => {
  try {
    const complaints = await Complaint.find({
      type: 'Hostel',
      hostelNo
    })
    .sort({ createdAt: -1 })
    .populate('student', 'name rollNo roomNo')
    .populate('assignedTo', 'name designation');

    return complaints;
  } catch (error) {
    throw new Error('Error fetching hostel complaints by hostelNo');
  }
};
