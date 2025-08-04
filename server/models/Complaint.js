const mongoose = require('mongoose');
const crypto = require('crypto');

const complaintSchema = new mongoose.Schema({
  token: {
    type: String,
    unique: true
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['Hostel', 'College', 'Network'] // Added Network as a type
  },
  hostelNo: {
    type: Number,
    min: 1,
    max: 13,
    required: function() {
      return this.type === 'Hostel'; // Only required for Hostel complaints
    }
  },
  roomNo: {
    type: String,
    required: function() {
      return this.type === 'Hostel'; // Only required for Hostel complaints
    }
  },
  subType: {
    type: String,
    required: true,
    enum: [
      'Electrical', 
      'Plumbing', 
      'Furniture', 
      'Internet', 
      'Network', // Added Network as a subType
      'Cleanliness',
      'Fan', 
      'Socket', 
      'Bulb', 
      'Window Glass', 
      'Chair',
      'Other'
    ]
  },
  description: {
    type: String,
    required: [true, 'Please provide a description'],
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  status: {
    type: String,
    enum: ['Pending', 'In Progress', 'Resolved', 'Rejected'],
    default: 'Pending'
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Authority'
  },
  remarks: {
    type: String,
    maxlength: [200, 'Remarks cannot exceed 200 characters']
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Generate token before saving
complaintSchema.pre('save', function(next) {
  if (!this.token) {
    const randomPart = crypto.randomBytes(3).toString('hex').toUpperCase();
    this.token = `CMP-${Date.now().toString(36).toUpperCase()}-${randomPart}`;
  }
  
  // Network complaints shouldn't have hostelNo or roomNo
  if (this.type === 'Network' || this.subType === 'Network') {
    this.hostelNo = undefined;
    this.roomNo = undefined;
  }
  
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Complaint', complaintSchema);