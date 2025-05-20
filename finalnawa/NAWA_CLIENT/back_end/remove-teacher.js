import mongoose from 'mongoose';
import Teacher from './database/models/Teacher.js';
import TeacherPayroll from './database/models/TeacherPayroll.js';

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/nawa_db', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(async () => {
  console.log('Connected to MongoDB');
  
  try {
    // Get all teachers first
    const teachers = await Teacher.find({}, { password: 0 });
    console.log('\nAvailable teachers:');
    teachers.forEach(teacher => {
      console.log(`ID: ${teacher._id}`);
      console.log(`Name: ${teacher.name}`);
      console.log(`Email: ${teacher.email}`);
      console.log('-------------------');
    });

    // Ask for teacher ID to remove
    const teacherId = process.argv[2];
    if (!teacherId) {
      console.log('\nPlease provide a teacher ID as an argument');
      console.log('Example: node remove-teacher.js <teacher_id>');
      process.exit(1);
    }

    // Remove teacher's payroll records
    const payrollResult = await TeacherPayroll.deleteMany({ teacherId });
    console.log(`\nDeleted ${payrollResult.deletedCount} payroll records`);

    // Remove the teacher
    const teacherResult = await Teacher.deleteOne({ _id: teacherId });
    if (teacherResult.deletedCount === 0) {
      console.log('\nNo teacher found with that ID');
    } else {
      console.log('\nTeacher successfully removed');
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    // Close the connection
    await mongoose.connection.close();
    console.log('\nMongoDB connection closed');
  }
})
.catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
}); 