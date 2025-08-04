const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  complaint: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Complaint'
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comments: {
    type: String,
    maxlength: [500, 'Comments cannot exceed 500 characters']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Feedback', feedbackSchema);