import express from 'express';
import LeaveRequest from '../database/models/LeaveRequest.js';
import { verifyToken, verifyAdmin } from '../middleware/auth.js';

const router = express.Router();

// Submit leave request (Teacher)
router.post('/submit-leave', verifyToken, async (req, res) => {
  try {
    const { startDate, endDate, reason } = req.body;
    const teacherId = req.user.user._id;
    const teacherName = req.user.user.name;

    const leaveRequest = new LeaveRequest({
      teacherId,
      teacherName,
      startDate,
      endDate,
      reason
    });

    await leaveRequest.save();
    res.status(201).json({ message: 'Leave request submitted successfully', leaveRequest });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all leave requests (Admin)
router.get('/leave-requests', verifyAdmin, async (req, res) => {
  try {
    const leaveRequests = await LeaveRequest.find().sort({ createdAt: -1 });
    res.json(leaveRequests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get teacher's leave requests (Teacher)
router.get('/my-leave-requests', verifyToken, async (req, res) => {
  try {
    const leaveRequests = await LeaveRequest.find({ teacherId: req.user.user._id })
      .sort({ createdAt: -1 });
    res.json(leaveRequests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update leave request status (Admin)
router.put('/leave-request/:id', verifyAdmin, async (req, res) => {
  try {
    const { status, adminResponse } = req.body;
    const leaveRequest = await LeaveRequest.findByIdAndUpdate(
      req.params.id,
      { status, adminResponse },
      { new: true }
    );
    
    if (!leaveRequest) {
      return res.status(404).json({ message: 'Leave request not found' });
    }
    
    res.json(leaveRequest);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router; 