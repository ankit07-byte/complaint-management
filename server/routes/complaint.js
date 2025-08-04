const express = require('express');
const router = express.Router();
const complaintController = require('../controllers/complaintController');
const { authMiddleware } = require('../middleware/auth');

// Student routes
router.post('/', authMiddleware('student'), complaintController.createComplaint);
router.get('/student', authMiddleware('student'), complaintController.getStudentComplaints);

// ✅ MOVE THIS ABOVE `/:token`
router.get('/authority', authMiddleware('authority'), async (req, res, next) => {
  try {
    if (req.user.department === 'Network') {
      const networkComplaints = await complaintController.getNetworkComplaints(req, res);
      return res.json(networkComplaints);
    }

    if (['Hostel Clerk', 'Warden'].includes(req.user.designation)) {
        const hostelComplaints = await complaintController.getHostelComplaintsByHostelNo(req.user.hostelNo);
        return res.json({
          success: true,
          count: hostelComplaints.length,
          data: hostelComplaints
        });
        
      return res.json(hostelComplaints);
    }

    const allComplaints = await complaintController.getAuthorityComplaints(req, res);
    return res.json(allComplaints);

  } catch (error) {
    next(error);
  }
});

// ✅ AFTER /authority
router.get('/:token', authMiddleware(['student', 'authority', 'admin']), complaintController.getComplaintByToken);

// Update complaint status
router.put('/:id', authMiddleware('authority'), complaintController.updateComplaintStatus);

// Admin routes
router.get('/admin/all', authMiddleware('admin'), complaintController.getAllComplaints);

// Fallback for generic authority
router.get('/', authMiddleware('authority'), complaintController.getAuthorityComplaints);

module.exports = router;
