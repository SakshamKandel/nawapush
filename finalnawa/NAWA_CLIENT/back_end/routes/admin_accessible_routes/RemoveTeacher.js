import express from 'express';
import Teacher from '../../database/models/Teacher.js';
import { verifyAdmin } from '../../middleware/auth.js';

const router = express.Router();

// DELETE /admin/remove-teacher/:id
router.delete('/remove-teacher/:id', verifyAdmin, async (req, res) => {
  try {
    const teacher = await Teacher.findByIdAndDelete(req.params.id);
    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }
    // Optionally: Remove related data (e.g., login, payroll, etc.)
    res.json({ message: 'Teacher removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router; 