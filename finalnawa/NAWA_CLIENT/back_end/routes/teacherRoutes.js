import express from 'express';
import { removeTeacher, getAllTeachers } from '../controllers/teacherController.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(verifyToken);

// Get all teachers
router.get('/', getAllTeachers);

// Remove a teacher from the system
router.delete('/:teacherId', removeTeacher);

export default router; 