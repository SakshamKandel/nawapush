import TeacherPayroll from '../database/models/TeacherPayroll.js';
import Teacher from '../database/models/Teacher.js';
import adminSchema_model from '../database/mongoose_schema/admin_schema.js';
import mongoose from 'mongoose';

// Get salary records for a specific teacher
export const getTeacherSalary = async (req, res) => {
  try {
    const { teacherId } = req.params;
    const currentYear = new Date().getFullYear();

    // Find or create payroll record for the current year
    let payroll = await TeacherPayroll.findOne({ 
      teacherId, 
      year: currentYear 
    });

    if (!payroll) {
      // Create new payroll record if it doesn't exist
      payroll = await TeacherPayroll.create({
        teacherId,
        year: currentYear
      });
    }

    res.status(200).json(payroll);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update salary for a specific month
export const updateSalary = async (req, res) => {
  try {
    const { teacherId } = req.params;
    const { month, salary, allowance, remarks } = req.body;
    const currentYear = new Date().getFullYear();

    let payroll = await TeacherPayroll.findOne({ 
      teacherId, 
      year: currentYear 
    });

    if (!payroll) {
      payroll = await TeacherPayroll.create({
        teacherId,
        year: currentYear
      });
    }

    // Update the specific month's record
    payroll.records[month] = {
      salary: salary || 0,
      allowance: allowance || 0,
      remarks: remarks || '',
      paymentDate: new Date(),
      status: 'paid'
    };

    await payroll.save();

    res.status(200).json(payroll);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all teachers with their payroll status
export const getAllTeachersPayroll = async (req, res) => {
  try {
    const currentYear = new Date().getFullYear();
    const teachers = await Teacher.find();
    
    const teachersWithPayroll = await Promise.all(
      teachers.map(async (teacher) => {
        const payroll = await TeacherPayroll.findOne({
          teacherId: teacher._id,
          year: currentYear
        });

        return {
          _id: teacher._id,
          name: teacher.name,
          payroll: payroll || null
        };
      })
    );

    res.status(200).json(teachersWithPayroll);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get payroll summary for a specific year
export const getPayrollSummary = async (req, res) => {
  try {
    const { year } = req.params;
    const payrolls = await TeacherPayroll.find({ year })
      .populate('teacherId', 'name');

    const summary = payrolls.map(payroll => ({
      teacherId: payroll.teacherId._id,
      teacherName: payroll.teacherId.name,
      totalSalary: Object.values(payroll.records).reduce((sum, month) => 
        sum + month.salary + month.allowance, 0),
      paidMonths: Object.values(payroll.records).filter(month => month.status === 'paid').length,
      pendingMonths: Object.values(payroll.records).filter(month => month.status === 'pending').length
    }));

    res.status(200).json(summary);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update monthly salary
export const updateMonthlySalary = async (req, res) => {
  try {
    const { teacherId, month, salary, allowance, remarks } = req.body;
    
    const payroll = await TeacherPayroll.findOne({ teacher: teacherId });
    if (!payroll) {
      return res.status(404).json({ message: 'Payroll record not found' });
    }

    payroll.records[month] = {
      salary,
      allowance,
      remarks,
      status: 'paid',
      updatedAt: new Date()
    };

    await payroll.save();

    res.json(payroll);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Remove a teacher from the system
export const removeTeacher = async (req, res) => {
  try {
    const { teacherId } = req.params;
    console.log('Attempting to remove teacher with ID:', teacherId);

    if (!mongoose.Types.ObjectId.isValid(teacherId)) {
      console.log('Invalid teacher ID format');
      return res.status(400).json({ message: 'Invalid teacher ID format' });
    }

    // Check if teacher exists
    const teacher = await Teacher.findById(teacherId);
    if (!teacher) {
      console.log('Teacher not found with ID:', teacherId);
      return res.status(404).json({ message: 'Teacher not found' });
    }
    console.log('Found teacher:', teacher.name);

    // Delete the teacher (this will trigger the pre middleware to delete payroll records)
    const deleteResult = await Teacher.findOneAndDelete({ _id: teacherId });
    if (!deleteResult) {
      console.log('Failed to delete teacher');
      return res.status(500).json({ message: 'Failed to delete teacher' });
    }
    console.log('Successfully deleted teacher');

    // Verify deletion
    const verifyDeletion = await Teacher.findById(teacherId);
    if (verifyDeletion) {
      console.log('Teacher still exists after deletion attempt');
      return res.status(500).json({ message: 'Teacher deletion failed' });
    }

    res.status(200).json({ 
      message: 'Teacher removed successfully',
      details: {
        teacherName: teacher.name,
        teacherId: teacherId
      }
    });
  } catch (error) {
    console.error('Error removing teacher:', error);
    res.status(500).json({ 
      message: 'Error removing teacher',
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// Clear all payroll records for a specific teacher
export const clearTeacherPayroll = async (req, res) => {
  try {
    const { teacherId } = req.body;
    if (!teacherId) {
      return res.status(400).json({ message: 'teacherId is required' });
    }
    await TeacherPayroll.deleteMany({ teacherId });
    res.status(200).json({ message: 'Payroll records cleared successfully.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; 