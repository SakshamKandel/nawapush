import express from 'express';
import { getTeacherSalary, updateSalary, getAllTeachersPayroll, getPayrollSummary, removeTeacher, clearTeacherPayroll } from '../controllers/teacherPayrollController.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(verifyToken);

// Get salary records for the currently logged-in teacher
router.get('/mine', async (req, res) => {
  try {
    const teacherId = req.user.user.id;
    req.params.teacherId = teacherId;
    await getTeacherSalary(req, res);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get salary records for a specific teacher
router.get('/:teacherId', getTeacherSalary);

// Update salary for a specific month
router.put('/:teacherId', updateSalary);

// Get all teachers with their payroll status
router.get('/', getAllTeachersPayroll);

// Get payroll summary for a specific year
router.get('/summary/:year', getPayrollSummary);

// Remove a teacher from the system
router.delete('/:teacherId', removeTeacher);

// Clear all payroll records for a specific teacher
router.post('/clear', clearTeacherPayroll);

export default router; 