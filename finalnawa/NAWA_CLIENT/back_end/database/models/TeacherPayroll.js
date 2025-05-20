import mongoose from 'mongoose';

const teacherPayrollSchema = new mongoose.Schema({
  teacherId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Teacher',
    required: true
  },
  year: {
    type: Number,
    required: true
  },
  records: {
    Baishakh: {
      salary: { type: Number, default: 0 },
      allowance: { type: Number, default: 0 },
      remarks: { type: String, default: '' },
      paymentDate: { type: Date },
      status: { type: String, enum: ['pending', 'paid'], default: 'pending' }
    },
    Jestha: {
      salary: { type: Number, default: 0 },
      allowance: { type: Number, default: 0 },
      remarks: { type: String, default: '' },
      paymentDate: { type: Date },
      status: { type: String, enum: ['pending', 'paid'], default: 'pending' }
    },
    Asadhh: {
      salary: { type: Number, default: 0 },
      allowance: { type: Number, default: 0 },
      remarks: { type: String, default: '' },
      paymentDate: { type: Date },
      status: { type: String, enum: ['pending', 'paid'], default: 'pending' }
    },
    Shrawan: {
      salary: { type: Number, default: 0 },
      allowance: { type: Number, default: 0 },
      remarks: { type: String, default: '' },
      paymentDate: { type: Date },
      status: { type: String, enum: ['pending', 'paid'], default: 'pending' }
    },
    Bhadra: {
      salary: { type: Number, default: 0 },
      allowance: { type: Number, default: 0 },
      remarks: { type: String, default: '' },
      paymentDate: { type: Date },
      status: { type: String, enum: ['pending', 'paid'], default: 'pending' }
    },
    Ashwin: {
      salary: { type: Number, default: 0 },
      allowance: { type: Number, default: 0 },
      remarks: { type: String, default: '' },
      paymentDate: { type: Date },
      status: { type: String, enum: ['pending', 'paid'], default: 'pending' }
    },
    Kartik: {
      salary: { type: Number, default: 0 },
      allowance: { type: Number, default: 0 },
      remarks: { type: String, default: '' },
      paymentDate: { type: Date },
      status: { type: String, enum: ['pending', 'paid'], default: 'pending' }
    },
    Mangsir: {
      salary: { type: Number, default: 0 },
      allowance: { type: Number, default: 0 },
      remarks: { type: String, default: '' },
      paymentDate: { type: Date },
      status: { type: String, enum: ['pending', 'paid'], default: 'pending' }
    },
    Poush: {
      salary: { type: Number, default: 0 },
      allowance: { type: Number, default: 0 },
      remarks: { type: String, default: '' },
      paymentDate: { type: Date },
      status: { type: String, enum: ['pending', 'paid'], default: 'pending' }
    },
    Magh: {
      salary: { type: Number, default: 0 },
      allowance: { type: Number, default: 0 },
      remarks: { type: String, default: '' },
      paymentDate: { type: Date },
      status: { type: String, enum: ['pending', 'paid'], default: 'pending' }
    },
    Falgun: {
      salary: { type: Number, default: 0 },
      allowance: { type: Number, default: 0 },
      remarks: { type: String, default: '' },
      paymentDate: { type: Date },
      status: { type: String, enum: ['pending', 'paid'], default: 'pending' }
    },
    Chaitra: {
      salary: { type: Number, default: 0 },
      allowance: { type: Number, default: 0 },
      remarks: { type: String, default: '' },
      paymentDate: { type: Date },
      status: { type: String, enum: ['pending', 'paid'], default: 'pending' }
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt timestamp before saving
teacherPayrollSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.model('TeacherPayroll', teacherPayrollSchema, 'teacherspayroll'); 