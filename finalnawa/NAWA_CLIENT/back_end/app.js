import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import teacherPayrollRoutes from './routes/teacherPayrollRoutes.js';
import teacherRoutes from './routes/teacherRoutes.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/teacher-payroll', teacherPayrollRoutes);
app.use('/api/teachers', teacherRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/nawa_db', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('Connected to MongoDB');
  // Start server only after successful database connection
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
})
.catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
}); 