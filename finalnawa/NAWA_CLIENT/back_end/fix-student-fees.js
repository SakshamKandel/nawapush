import mongoose from 'mongoose';
import { configDotenv } from 'dotenv';
import studentSchema_model from './database/mongoose_schema/student_schema.js';
import studentFee_model from './database/mongoose_schema/studentFeeRecord_schema.js';

configDotenv();

// Nepali months used in the application
const months = [
  'Baishakh', 'Jestha', 'Asadhh', 'Shrawan', 'Bhadra', 'Ashwin', 
  'Kartik', 'Mangsir', 'Poush', 'Magh', 'Falgun', 'Chaitra'
];

// Default fee structure for each month
const defaultMonthFee = {
  adm_fee: 0,
  month_fee: 0,
  comp_fee: 0
};

/**
 * Fixes student fee records in the database
 */
const fixStudentFees = async () => {
  try {
    // Connect to MongoDB
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.URI || 'mongodb://localhost:27017/nava_tara');
    console.log('Connected to database successfully');

    // 1. Get all students
    const allStudents = await studentSchema_model.find({});
    console.log(`Found ${allStudents.length} students in the database`);

    // 2. Get all fee records
    const allFeeRecords = await studentFee_model.find({});
    console.log(`Found ${allFeeRecords.length} fee records in the database`);

    // 3. Find students without fee records
    const studentsWithoutFees = allStudents.filter(student => 
      !allFeeRecords.some(record => record.studentID.toString() === student._id.toString())
    );
    console.log(`Found ${studentsWithoutFees.length} students without fee records`);

    // 4. Create fee records for students without them
    if (studentsWithoutFees.length > 0) {
      console.log('Creating fee records for students without them...');
      const newFeeRecords = studentsWithoutFees.map(student => ({
        studentID: student._id,
        records: months.reduce((acc, month) => {
          acc[month] = { ...defaultMonthFee };
          return acc;
        }, {})
      }));
      
      await studentFee_model.insertMany(newFeeRecords);
      console.log(`Created ${newFeeRecords.length} new fee records`);
    }

    // 5. Fix existing fee records with missing months
    console.log('Checking existing fee records for missing months...');
    let fixedRecordsCount = 0;
    
    for (const record of allFeeRecords) {
      let needsUpdate = false;
      
      // Check if record has all months
      for (const month of months) {
        if (!record.records[month]) {
          console.log(`Fee record ${record._id} is missing month: ${month}`);
          record.records[month] = { ...defaultMonthFee };
          needsUpdate = true;
        }
      }
      
      // Update the record if needed
      if (needsUpdate) {
        await record.save();
        fixedRecordsCount++;
        console.log(`Fixed fee record for student: ${record.studentID}`);
      }
    }
    console.log(`Fixed ${fixedRecordsCount} fee records with missing months`);

    // 6. Check for orphaned fee records (no associated student)
    const orphanedFeeRecords = allFeeRecords.filter(record => 
      !allStudents.some(student => student._id.toString() === record.studentID.toString())
    );
    console.log(`Found ${orphanedFeeRecords.length} orphaned fee records`);

    // 7. Remove orphaned fee records
    if (orphanedFeeRecords.length > 0) {
      const orphanedIds = orphanedFeeRecords.map(record => record._id);
      await studentFee_model.deleteMany({ _id: { $in: orphanedIds } });
      console.log(`Removed ${orphanedFeeRecords.length} orphaned fee records`);
    }

    console.log('\n=== SUMMARY ===');
    console.log(`Total students: ${allStudents.length}`);
    console.log(`Total fee records after fixes: ${allFeeRecords.length - orphanedFeeRecords.length + studentsWithoutFees.length}`);
    console.log(`New fee records created: ${studentsWithoutFees.length}`);
    console.log(`Existing fee records fixed: ${fixedRecordsCount}`);
    console.log(`Orphaned fee records removed: ${orphanedFeeRecords.length}`);
    console.log('Student fee data has been fixed successfully!');
    
    return {
      success: true,
      totalStudents: allStudents.length,
      totalFeeRecords: allFeeRecords.length - orphanedFeeRecords.length + studentsWithoutFees.length,
      newRecordsCreated: studentsWithoutFees.length,
      recordsFixed: fixedRecordsCount,
      orphanedRecordsRemoved: orphanedFeeRecords.length
    };
  } catch (error) {
    console.error('Error fixing student fees:', error);
    return {
      success: false,
      error: error.message
    };
  } finally {
    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('Disconnected from database');
  }
};

// Run the function if this script is executed directly
if (process.argv[1] === import.meta.url) {
  fixStudentFees()
    .then(result => {
      if (result.success) {
        console.log('Student fee fix completed successfully');
      } else {
        console.error('Student fee fix failed:', result.error);
        process.exit(1);
      }
    })
    .catch(error => {
      console.error('Unhandled error:', error);
      process.exit(1);
    })
    .finally(() => {
      process.exit(0);
    });
}

export default fixStudentFees; 