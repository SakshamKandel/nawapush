import express from 'express';
import TeacherNotice from '../models/TeacherNotice.js';
import { verifyAdmin } from '../middleware/auth.js';

const router = express.Router();

// Get all teacher notices (admin only)
router.get('/teacher-notices', verifyAdmin, async (req, res) => {
  try {
    const notices = await TeacherNotice.find()
      .sort({ createdAt: -1 })
      .populate('teacherId', 'name email');
    
    // Filter out notices with missing teacherId or missing teacher reference
    const filteredNotices = notices.filter(notice => notice.teacherId && notice.teacherId.name && notice.teacherId.email);

    const formattedNotices = filteredNotices.map(notice => ({
      _id: notice._id,
      teacherName: notice.teacherId.name,
      subject: notice.subject,
      message: notice.message,
      status: notice.status,
      createdAt: notice.createdAt
    }));

    if (filteredNotices.length !== notices.length) {
      console.warn('Some teacher notices have missing or invalid teacher references and were skipped.');
    }

    res.json(formattedNotices);
  } catch (error) {
    console.error('Error fetching teacher notices (detailed):', error);
    res.status(500).json({ message: 'Error fetching teacher notices', error: error.message });
  }
});

// Create a new teacher notice
router.post('/create-notice', async (req, res) => {
  try {
    const { teacherId, subject, message } = req.body;
    
    const newNotice = new TeacherNotice({
      teacherId,
      subject,
      message,
      status: 'pending'
    });

    await newNotice.save();
    res.status(201).json({ message: 'Notice created successfully' });
  } catch (error) {
    console.error('Error creating notice:', error);
    res.status(500).json({ message: 'Error creating notice' });
  }
});

// Get teacher notices for a specific teacher
router.get('/teacher-alerts', async (req, res) => {
  try {
    const teacherId = req.query.teacherId;
    if (!teacherId) {
      return res.status(400).json({ message: 'Teacher ID is required' });
    }

    const notices = await TeacherNotice.find({ teacherId })
      .sort({ createdAt: -1 })
      .populate('teacherId', 'name email');
    
    const formattedNotices = notices.map(notice => ({
      _id: notice._id,
      subject: notice.subject,
      message: notice.message,
      status: notice.status,
      createdAt: notice.createdAt
    }));

    res.json(formattedNotices);
  } catch (error) {
    console.error('Error fetching teacher notices:', error);
    res.status(500).json({ message: 'Error fetching teacher notices' });
  }
});

// Approve a notice
router.patch('/teacher-notices/:id/approve', verifyAdmin, async (req, res) => {
  try {
    const notice = await TeacherNotice.findByIdAndUpdate(req.params.id, { status: 'approved' }, { new: true });
    res.json(notice);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Deny a notice
router.patch('/teacher-notices/:id/deny', verifyAdmin, async (req, res) => {
  try {
    const notice = await TeacherNotice.findByIdAndUpdate(req.params.id, { status: 'rejected' }, { new: true });
    res.json(notice);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router; 