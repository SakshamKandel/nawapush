import adminSchema_model from '../database/mongoose_schema/admin_schema.js';
import Teacher from '../database/models/Teacher.js';
import TeacherPayroll from '../database/models/TeacherPayroll.js';
import mongoose from 'mongoose';

// Get all teachers
export const getAllTeachers = async (req, res) => {
  try {
    const teachers = await Teacher.find({}, {
      password: 0, // Exclude password from the response
      __v: 0 // Exclude version field
    }).sort({ createdAt: -1 }); // Sort by creation date, newest first

    console.log(`Found ${teachers.length} teachers`);
    res.status(200).json(teachers);
  } catch (error) {
    console.error('Error fetching teachers:', error);
    res.status(500).json({ 
      message: 'Error fetching teachers',
      error: error.message 
    });
  }
};

// Create new teacher
export const createTeacher = async (req, res) => {
  try {
    const teacher = new Teacher(req.body);
    const savedTeacher = await teacher.save();

    // Notify all admins
    const admins = await adminSchema_model.find();
    await Promise.all(admins.map(admin =>
      createNotification(
        admin._id,
        'Admin',
        'teacher',
        'New Teacher Added',
        `A new teacher ${savedTeacher.name} has been added to the system`
      )
    ));

    res.status(201).json(savedTeacher);
  } catch (error) {
    res.status(400).json({ message: error.message });
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

    // First delete all payroll records
    const payrollDeleteResult = await TeacherPayroll.deleteMany({ teacherId });
    console.log('Deleted payroll records:', payrollDeleteResult);

    // Then delete the teacher
    const teacherDeleteResult = await Teacher.deleteOne({ _id: teacherId });
    console.log('Teacher delete result:', teacherDeleteResult);

    if (teacherDeleteResult.deletedCount === 0) {
      console.log('No teacher was deleted');
      return res.status(404).json({ message: 'Teacher not found or already deleted' });
    }

    // Verify deletion
    const verifyDeletion = await Teacher.findById(teacherId);
    if (verifyDeletion) {
      console.log('Teacher still exists after deletion attempt');
      return res.status(500).json({ message: 'Teacher deletion failed' });
    }

    res.status(200).json({ 
      message: 'Teacher removed successfully',
      details: {
        teacherId: teacherId,
        deletedPayrollRecords: payrollDeleteResult.deletedCount
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