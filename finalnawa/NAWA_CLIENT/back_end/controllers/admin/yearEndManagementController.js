import mongoose from 'mongoose';
import studentSchema_model from '../../database/mongoose_schema/student_schema.js';
import studentFee_model from '../../database/mongoose_schema/studentFeeRecord_schema.js';
import StudentHistory from '../../database/models/StudentHistory.js';
import AcademicYear from '../../database/models/AcademicYear.js';
import TeacherPayroll from '../../database/models/TeacherPayroll.js';
import adminSchema_model from '../../database/mongoose_schema/admin_schema.js';
import bcrypt from 'bcryptjs';
import ExcelJS from 'exceljs';
import path from 'path';
import fs from 'fs';

// Get current academic year status
export const getAcademicYearStatus = async (req, res) => {
  try {
    const currentYear = new Date().getFullYear();
    let academicYear = await AcademicYear.findOne({ year: currentYear });
    
    if (!academicYear) {
      // Create new academic year if it doesn't exist
      academicYear = await AcademicYear.create({
        year: currentYear,
        startDate: new Date(currentYear, 0, 1), // January 1st
        endDate: new Date(currentYear, 11, 31), // December 31st
        status: 'active'
      });
    }
    
    res.status(200).json(academicYear);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get promotion status for a specific class
export const getClassPromotionStatus = async (req, res) => {
  try {
    const { class_name } = req.params;
    if (!class_name) {
      return res.status(400).json({ message: 'Class name is required' });
    }
    
    const classNumber = parseInt(class_name);
    if (isNaN(classNumber) || classNumber < 1 || classNumber > 6) {
      return res.status(400).json({ message: 'Invalid class number. Must be between 1 and 6.' });
    }
    
    const currentYear = new Date().getFullYear();
    
    // Get students in this class with better sorting
    const students = await studentSchema_model.find({ class_name: classNumber }).sort({ name: 1 });
    console.log(`Found ${students.length} students in class ${classNumber}`);
    
    if (students.length === 0) {
      return res.status(200).json([]);
    }
    
    // Get fee records for these students
    const studentIds = students.map(s => s._id);
    const feeRecords = await studentFee_model.find({
      studentID: { $in: studentIds }
    });
    
    // Create a detailed promotion status for each student
    const promotionStatus = students.map(student => {
      return {
        studentId: student._id,
        name: student.name || 'Unnamed Student',
        rollNumber: student.roll_number || 'No Roll Number',
        class: student.class_name,
        nextClass: student.class_name === 6 ? 'Graduate' : student.class_name + 1,
        eligibleForPromotion: true,
        fatherName: student.father_name || '',
        motherName: student.mother_name || '',
        contactNumber: student.father_phone || student.mother_phone || '',
        email: student.email || ''
      };
    });
    
    res.status(200).json(promotionStatus);
  } catch (error) {
    console.error('Error getting promotion status:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get student history with search and pagination
export const getStudentHistory = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { search, page = 1, limit = 10, status } = req.query;
    const skip = (page - 1) * limit;

    // Build search query
    let query = {};
    
    // If studentId is provided, get history for specific student
    if (studentId) {
      query.studentId = studentId;
    } else {
      // Otherwise, apply search and status filters
      if (search) {
        query.$or = [
          { 'archivedData.name': { $regex: search, $options: 'i' } },
          { 'archivedData.roll_number': { $regex: search, $options: 'i' } }
        ];
      }
      if (status) {
        query.status = status;
      }
    }

    // Get total count for pagination
    const total = await StudentHistory.countDocuments(query);

    // Get history records with populated student data
    const history = await StudentHistory.find(query)
      .sort({ academicYear: -1, 'archivedData.name': 1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('studentId', 'name class_name roll_number');

    // If getting single student history, return just the records
    if (studentId) {
      return res.status(200).json(history);
    }

    // Otherwise return paginated list with pagination info
    res.status(200).json({
      history,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Student history error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Promote students to next class
export const promoteStudents = async (req, res) => {
  try {
    const { class_name, academicYear, password } = req.body;
    
    // Get admin from the request (set by verifyAdmin middleware)
    const admin = await adminSchema_model.findById(req.user.user.id);
    if (!admin) {
      return res.status(401).json({ message: 'Admin not found' });
    }

    // Verify admin password using bcrypt
    if (!password || !await bcrypt.compare(password, admin.password)) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    const currentClass = parseInt(class_name);
    const nextClass = currentClass + 1;
    const isGraduatingClass6 = currentClass === 6;
    let graduatedCount = 0;
    
    // Special handling for class 6 students (they graduate)
    if (isGraduatingClass6) {
      const existingClass6Students = await studentSchema_model.find({ class_name: 6 });
      graduatedCount = existingClass6Students.length;
      
      // If there are class 6 students to graduate
      if (existingClass6Students.length > 0) {
        // Create Excel file with graduated students
        const ExcelJS = (await import('exceljs')).default;
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Class6Students');
        worksheet.columns = [
          { header: 'Name', key: 'name', width: 20 },
          { header: 'Roll Number', key: 'roll_number', width: 15 },
          { header: 'Class', key: 'class_name', width: 10 },
          { header: 'Father Name', key: 'father_name', width: 20 },
          { header: 'Father Phone', key: 'father_phone', width: 15 },
          { header: 'Mother Name', key: 'mother_name', width: 20 },
          { header: 'Mother Phone', key: 'mother_phone', width: 15 },
          { header: 'Address', key: 'address', width: 25 },
          { header: 'Email', key: 'email', width: 25 },
          { header: 'Student ID', key: '_id', width: 25 }
        ];
        
        existingClass6Students.forEach(student => {
          worksheet.addRow({
            name: student.name,
            roll_number: student.roll_number || '',
            class_name: student.class_name,
            father_name: student.father_name || '',
            father_phone: student.father_phone || '',
            mother_name: student.mother_name || '',
            mother_phone: student.mother_phone || '',
            address: student.address || '',
            email: student.email || '',
            _id: student._id
          });
        });
        
        // Archive and remove all class 6 students
        const graduationPromises = existingClass6Students.map(async (student) => {
          const studentData = student.toObject();
          const exists = await StudentHistory.findOne({ studentId: student._id, academicYear });
          if (!exists) {
            await StudentHistory.create({
              studentId: student._id,
              academicYear,
              class: 6,
              status: 'graduated',
              feeStatus: 'cleared',
              archivedData: {
                ...studentData,
                graduationYear: academicYear,
                lastClass: 6
              }
            });
          }
          await Promise.all([
            studentSchema_model.deleteOne({ _id: student._id }),
            studentFee_model.deleteOne({ studentID: student._id })
          ]);
        });
        
        await Promise.all(graduationPromises);
        
        // Update academic year status
        await AcademicYear.updateOne(
          { year: academicYear },
          { 
            $set: { 
              lastPromotionDate: new Date()
            },
            $push: {
              promotionHistory: {
                date: new Date(),
                class: currentClass,
                promotedCount: 0,
                totalCount: graduatedCount,
                type: 'graduation',
                graduatedCount: graduatedCount
              }
            }
          }
        );
        
        // Return success message with graduate count
        return res.status(200).json({
          message: `Successfully graduated ${graduatedCount} students from Class 6`,
          promoted: 0,
          total: graduatedCount,
          graduated: graduatedCount
        });
      }
    }
    
    // Regular promotion for other classes
    // Get all students in the current class
    const students = await studentSchema_model.find({ class_name: currentClass });
    
    // Only update student class, do not create StudentHistory for promotions
    const promotionPromises = students.map(async (student) => {
      await studentSchema_model.updateOne(
        { _id: student._id },
        { $set: { class_name: nextClass } }
      );
    });

    // Wait for all updates to complete
    await Promise.all(promotionPromises);
    
    // Update academic year status
    await AcademicYear.updateOne(
      { year: academicYear },
      { 
        $set: { 
          lastPromotionDate: new Date()
        },
        $push: {
          promotionHistory: {
            date: new Date(),
            class: currentClass,
            promotedCount: students.length,
            totalCount: students.length,
            type: 'promotion',
            graduatedCount: 0
          }
        }
      }
    );
    
    res.status(200).json({
      message: `Successfully promoted ${students.length} students to Class ${nextClass}`,
      promoted: students.length,
      total: students.length,
      graduated: 0
    });
  } catch (error) {
    console.error('Promotion error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Clear teacher payroll records for the year
export const clearTeacherPayroll = async (req, res) => {
  try {
    const { academicYear, teacherIds, password } = req.body;
    // Get admin from the request (set by verifyAdmin middleware)
    const admin = await adminSchema_model.findById(req.user.user.id);
    if (!admin) {
      return res.status(401).json({ message: 'Admin not found' });
    }
    // Verify admin password using bcrypt
    if (!password || !await bcrypt.compare(password, admin.password)) {
      return res.status(401).json({ message: 'Invalid password' });
    }
    // Delete payroll records
    let result;
    if (teacherIds && teacherIds.length > 0) {
      // Delete specific teachers' payroll
      result = await TeacherPayroll.deleteMany({ teacherId: { $in: teacherIds }, year: academicYear });
    } else {
      // Delete all teachers' payroll for the year
      result = await TeacherPayroll.deleteMany({ year: academicYear });
    }
    // Ensure AcademicYear exists
    let academicYearDoc = await AcademicYear.findOne({ year: academicYear });
    if (!academicYearDoc) {
      academicYearDoc = await AcademicYear.create({
        year: academicYear,
        startDate: new Date(academicYear, 0, 1),
        endDate: new Date(academicYear, 11, 31),
        status: 'active'
      });
    }
    // Update academic year status with payroll clear date
    await AcademicYear.updateOne(
      { year: academicYear },
      {
        $set: { lastPayrollClearDate: new Date() },
        $push: {
          payrollHistory: {
            date: new Date(),
            clearedCount: teacherIds ? teacherIds.length : 'all',
            deletedCount: result.deletedCount
          }
        }
      }
    );
    res.status(200).json({ message: 'Payroll records cleared successfully', deletedCount: result.deletedCount });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Archive student record
export const archiveStudent = async (req, res) => {
  try {
    const { studentId, remarks } = req.body;
    const currentYear = new Date().getFullYear();
    
    const student = await studentSchema_model.findById(studentId);
    if (!student) {
      throw new Error('Student not found');
    }
    
    // Create history record
    await StudentHistory.create({
      studentId,
      academicYear: currentYear,
      class: student.class_name,
      status: 'left',
      feeStatus: 'pending',
      remarks,
      archivedData: student.toObject()
    });
    
    // Remove student from active records
    await Promise.all([
      studentSchema_model.deleteOne({ _id: studentId }),
      studentFee_model.deleteOne({ studentID: studentId })
    ]);
    
    res.status(200).json({ message: 'Student archived successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Export all class 6 students as CSV
export const exportClass6Students = async (req, res) => {
  try {
    const students = await studentSchema_model.find({ class_name: 6 });
    console.log(`Found ${students.length} class 6 students for export`);
    
    // Prepare CSV header
    const header = [
      'Name', 'Roll Number', 'Father Name', 'Father Phone', 'Mother Name', 'Mother Phone', 'Address', 'Email', 'Class', 'Student ID'
    ];
    
    // Prepare CSV rows
    let rows = [];
    if (students.length > 0) {
      rows = students.map(s => [
        s.name,
        s.roll_number || '',
        s.father_name || '',
        s.father_phone || '',
        s.mother_name || '',
        s.mother_phone || '',
        s.address || '',
        s.email || '',
        s.class_name,
        s._id
      ]);
    } else {
      // Add a note row for empty data
      rows = [['No class 6 students found', '', '', '', '', '', '', '', '6', '']];
    }
    
    // Convert to CSV string
    const csv = [header, ...rows].map(r => r.map(x => `"${x}"`).join(',')).join('\n');
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="class6_students.csv"');
    res.status(200).send(csv);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Export all students (class 1 to 6) as Excel
export const exportAllStudentsExcel = async (req, res) => {
  try {
    // Get all students and sort by class and name
    const allStudents = await studentSchema_model.find({ class_name: { $gte: 1, $lte: 6 } }).sort({ class_name: 1, name: 1 });
    console.log(`Found ${allStudents.length} total students for export`);
    
    const ExcelJS = (await import('exceljs')).default;
    const workbook = new ExcelJS.Workbook();
    
    // Create a single worksheet with all students
    const allStudentsSheet = workbook.addWorksheet('All Students');
    allStudentsSheet.columns = [
      { header: 'S.No', key: 'serialNumber', width: 6, style: { alignment: { horizontal: 'center' } } },
      { header: 'Name', key: 'name', width: 20 },
      { header: 'Class', key: 'class_name', width: 8, style: { alignment: { horizontal: 'center' } } },
      { header: 'Roll Number', key: 'roll_number', width: 12, style: { alignment: { horizontal: 'center' } } },
      { header: 'Father Name', key: 'father_name', width: 20 },
      { header: 'Father Phone', key: 'father_phone', width: 15 },
      { header: 'Mother Name', key: 'mother_name', width: 20 },
      { header: 'Mother Phone', key: 'mother_phone', width: 15 },
      { header: 'Address', key: 'address', width: 20 },
      { header: 'Email', key: 'email', width: 25 },
      { header: 'Student ID', key: '_id', width: 25 }
    ];
    
    // Add all students to the single sheet with serial numbers
    if (allStudents.length > 0) {
      allStudents.forEach((student, index) => {
        allStudentsSheet.addRow({
          serialNumber: index + 1,
          name: student.name || 'Unnamed',
          class_name: student.class_name,
          roll_number: student.roll_number || '-',
          father_name: student.father_name || '-',
          father_phone: student.father_phone || '-',
          mother_name: student.mother_name || '-',
          mother_phone: student.mother_phone || '-',
          address: student.address || '-',
          email: student.email || '-',
          _id: student._id
        });
      });
    } else {
      // Add a note row if no students found
      allStudentsSheet.addRow({
        serialNumber: '-',
        name: 'No students found',
        class_name: '-',
        roll_number: '-',
        father_name: '-',
        father_phone: '-',
        mother_name: '-',
        mother_phone: '-',
        address: '-',
        email: '-',
        _id: '-'
      });
    }
    
    // Apply formatting to the header row
    const headerRow = allStudentsSheet.getRow(1);
    headerRow.eachCell((cell) => {
      cell.font = { bold: true };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFE0E0E0' }
      };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      };
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
    });
    
    // Apply alternate row coloring and borders to data rows
    allStudentsSheet.eachRow((row, rowNumber) => {
      if (rowNumber > 1) { // Skip header row
        row.eachCell((cell) => {
          cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
          };
          
          // Add alternate row coloring
          if (rowNumber % 2 === 0) {
            cell.fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: { argb: 'FFFAFAFA' }
            };
          }
        });
      }
    });
    
    // Set headers and send response
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=all_students.xlsx');
    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error('Export error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Export all students of a given class as Excel (for batch promotion)
export const exportClassStudents = async (req, res) => {
  try {
    // Get class number from path parameter or query parameter
    let classNum = req.params.classNum;
    
    // Debug information to help diagnose route issues
    console.log("exportClassStudents called");
    console.log("req.params:", req.params);
    console.log("req.query:", req.query);
    console.log("req.path:", req.path);
    
    // Try query parameter if path parameter is not available
    if (!classNum && req.query.classNum) {
      classNum = req.query.classNum;
      console.log("Using query parameter for classNum:", classNum);
    }
    
    if (!classNum) {
      return res.status(400).json({ 
        message: 'Class number is required', 
        debug: { params: req.params, query: req.query, path: req.path } 
      });
    }
    
    // Parse to number and validate
    classNum = parseInt(classNum);
    
    if (isNaN(classNum) || classNum < 1 || classNum > 6) {
      return res.status(400).json({ 
        message: `Invalid class number: ${classNum}. Must be a number between 1 and 6`,
        debug: { 
          params: req.params,
          query: req.query,
          path: req.path,
          originalClassNum: req.params.classNum || req.query.classNum
        }
      });
    }
    
    console.log(`Processing export for class ${classNum}`);
    
    // Find students in the specified class
    const students = await studentSchema_model.find({ class_name: classNum }).sort({ name: 1 });
    
    console.log(`Found ${students.length} students in class ${classNum}`);

    // Create Excel workbook
    const ExcelJS = (await import('exceljs')).default;
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(`Class${classNum}Students`);
    
    // Define columns
    worksheet.columns = [
      { header: 'S.No', key: 'serialNumber', width: 6, style: { alignment: { horizontal: 'center' } } },
      { header: 'Name', key: 'name', width: 20 },
      { header: 'Roll Number', key: 'roll_number', width: 12, style: { alignment: { horizontal: 'center' } } },
      { header: 'Class', key: 'class_name', width: 8, style: { alignment: { horizontal: 'center' } } },
      { header: 'Father Name', key: 'father_name', width: 20 },
      { header: 'Father Phone', key: 'father_phone', width: 15 },
      { header: 'Mother Name', key: 'mother_name', width: 20 },
      { header: 'Mother Phone', key: 'mother_phone', width: 15 },
      { header: 'Address', key: 'address', width: 20 },
      { header: 'Email', key: 'email', width: 25 },
      { header: 'Student ID', key: '_id', width: 25 }
    ];
    
    // Add student data if there are any students
    if (students.length > 0) {
      students.forEach((student, index) => {
        worksheet.addRow({
          serialNumber: index + 1,
          name: student.name || 'Unnamed',
          roll_number: student.roll_number || '-',
          class_name: student.class_name,
          father_name: student.father_name || '-',
          father_phone: student.father_phone || '-',
          mother_name: student.mother_name || '-',
          mother_phone: student.mother_phone || '-',
          address: student.address || '-',
          email: student.email || '-',
          _id: student._id
        });
      });
    } else {
      // Add a note in the Excel file that no students were found
      worksheet.addRow({
        serialNumber: '-',
        name: `No students found in Class ${classNum}`,
        class_name: classNum,
        roll_number: '-',
        father_name: '-',
        father_phone: '-',
        mother_name: '-',
        mother_phone: '-',
        address: '-',
        email: '-',
        _id: '-'
      });
      console.log(`No students found in class ${classNum}, returning empty Excel file`);
    }
    
    // Apply formatting to the header row
    const headerRow = worksheet.getRow(1);
    headerRow.eachCell((cell) => {
      cell.font = { bold: true };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFE0E0E0' }
      };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      };
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
    });
    
    // Apply alternate row coloring and borders to data rows
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber > 1) { // Skip header row
        row.eachCell((cell) => {
          cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
          };
          
          // Add alternate row coloring
          if (rowNumber % 2 === 0) {
            cell.fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: { argb: 'FFFAFAFA' }
            };
          }
        });
      }
    });
    
    // Set headers and send response
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=class${classNum}_students.xlsx`);
    
    console.log(`Sending Excel file for class ${classNum}`);
    
    // Write workbook to response
    await workbook.xlsx.write(res);
    res.end();
    
  } catch (error) {
    console.error("Export error:", error);
    res.status(500).json({ 
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};