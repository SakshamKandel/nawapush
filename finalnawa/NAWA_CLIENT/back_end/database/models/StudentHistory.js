import mongoose from 'mongoose';

const studentHistorySchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'students',
    required: true
  },
  academicYear: {
    type: Number,
    required: true
  },
  class: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'promoted', 'graduated', 'left'],
    default: 'active'
  },
  promotionDate: {
    type: Date,
    default: Date.now
  },
  remarks: {
    type: String
  },
  archivedData: {
    type: mongoose.Schema.Types.Mixed
  }
}, {
  timestamps: true
});

// Create compound index for efficient querying
studentHistorySchema.index({ studentId: 1, academicYear: 1 }, { unique: true });

const StudentHistory = mongoose.model('StudentHistory', studentHistorySchema);

export default StudentHistory; 