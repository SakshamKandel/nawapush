import mongoose from 'mongoose';
import TeacherPayroll from './TeacherPayroll.js';

const teacherSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  subject: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Add middleware to delete related records when a teacher is deleted
teacherSchema.pre('findOneAndDelete', async function(next) {
  const teacher = await this.model.findOne(this.getQuery());
  if (teacher) {
    await TeacherPayroll.deleteMany({ teacherId: teacher._id });
  }
  next();
});

const Teacher = mongoose.model('Teacher', teacherSchema);

export default Teacher; 