import express from 'express';
import {
  getAcademicYearStatus,
  getClassPromotionStatus,
  promoteStudents,
  clearTeacherPayroll,
  getStudentHistory,
  archiveStudent,
  exportClass6Students,
  exportAllStudentsExcel,
  exportClassStudents
} from '../../controllers/admin/yearEndManagementController.js';
import { verifyToken, verifyAdmin } from '../../middleware/verifyToken.js';
import mongoose from 'mongoose';

const router = express.Router();

// TEMPORARY: Testing route to check database connection status
router.get('/test-db-connection', (req, res) => {
  console.log("Checking database connection status");
  const dbState = mongoose.connection.readyState;
  const states = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
    4: 'invalid'
  };
  
  console.log(`Database connection status: ${states[dbState]}`);
  res.json({ 
    connected: dbState === 1,
    status: states[dbState],
    host: mongoose.connection.host || 'N/A',
    name: mongoose.connection.name || 'N/A',
    models: Object.keys(mongoose.connection.models)
  });
});

// TEMPORARY: Testing route without authentication for debugging
// Remove in production!
router.get('/test/export-class-for-promotion', (req, res, next) => {
  console.log("TEST ROUTE HIT - NO AUTH");
  console.log("Query params:", req.query);
  if (req.query.classNum) {
    req.params.classNum = req.query.classNum;
    next();
  } else {
    res.status(400).json({ message: 'Class number is required as query parameter' });
  }
}, exportClassStudents);

// All routes below require admin authentication
router.use(verifyToken);
router.use(verifyAdmin);

// Get current academic year status
router.get('/academic-year', getAcademicYearStatus);

// Get promotion status for a specific class
router.get('/promotion-status/:class_name', getClassPromotionStatus);

// Promote students to next class
router.post('/promote-students', promoteStudents);

// Clear teacher payroll records
router.post('/clear-payroll', clearTeacherPayroll);

// Get student history (list or single student)
router.get('/student-history', getStudentHistory); // List all history with filters
router.get('/student-history/:studentId', getStudentHistory); // Get single student history

// Archive student record
router.post('/archive-student', archiveStudent);

// Export all class 6 students as CSV
router.get('/export-class6', exportClass6Students);

// Export all students (class 1 to 6) as an Excel file
router.get('/export-all-students', exportAllStudentsExcel);

// NEW ROUTE: Export class students with query parameter (more reliable)
router.get('/export-class-for-promotion', (req, res, next) => {
  const classNum = parseInt(req.query.classNum);
  if (isNaN(classNum) || classNum < 1 || classNum > 6) {
    return res.status(400).json({ message: 'Invalid class number. Must be between 1 and 6.' });
  }
  
  console.log(`Export class ${classNum} students route hit (query parameter method)`);
  req.params.classNum = classNum;
  next();
}, exportClassStudents);

// Original routes kept for backward compatibility
// Export any class students as Excel for batch promotion (robust regex, no leading slash)
router.get(/export-class(\d+)-for-promotion/, (req, res, next) => {
  const match = req.path.match(/export-class(\d+)-for-promotion/);
  if (match) {
    req.params.classNum = match[1];
    console.log('Export class students route hit:', req.params.classNum);
  }
  next();
}, exportClassStudents);

// Individual class routes as fallback
router.get('/export-class1-for-promotion', (req, res, next) => {
  req.params.classNum = 1;
  console.log('Export class 1 students route hit (explicit)');
  next();
}, exportClassStudents);

router.get('/export-class2-for-promotion', (req, res, next) => {
  req.params.classNum = 2;
  console.log('Export class 2 students route hit (explicit)');
  next();
}, exportClassStudents);

router.get('/export-class3-for-promotion', (req, res, next) => {
  req.params.classNum = 3;
  console.log('Export class 3 students route hit (explicit)');
  next();
}, exportClassStudents);

router.get('/export-class4-for-promotion', (req, res, next) => {
  req.params.classNum = 4;
  console.log('Export class 4 students route hit (explicit)');
  next();
}, exportClassStudents);

router.get('/export-class5-for-promotion', (req, res, next) => {
  req.params.classNum = 5;
  console.log('Export class 5 students route hit (explicit)');
  next();
}, exportClassStudents);

router.get('/export-class6-for-promotion', (req, res, next) => {
  req.params.classNum = 6;
  console.log('Export class 6 students route hit (explicit)');
  next();
}, exportClassStudents);

export default router; 