import mongoose from 'mongoose';

const academicYearSchema = new mongoose.Schema({
  year: {
    type: Number,
    required: true,
    unique: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'archived'],
    default: 'active'
  },
  promotionStatus: {
    type: String,
    enum: ['pending', 'in_progress', 'completed'],
    default: 'pending'
  },
  payrollStatus: {
    type: String,
    enum: ['pending', 'in_progress', 'completed'],
    default: 'pending'
  },
  lastPromotionDate: {
    type: Date
  },
  lastPayrollClearDate: {
    type: Date
  },
  remarks: {
    type: String
  }
}, {
  timestamps: true
});

const AcademicYear = mongoose.model('AcademicYear', academicYearSchema);

export default AcademicYear; 