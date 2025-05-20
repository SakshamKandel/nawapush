import studentFee_model from "../../database/mongoose_schema/studentFeeRecord_schema.js";
import studentSchema_model from "../../database/mongoose_schema/student_schema.js";

const getFeeController = async (req, res) => {
  try {
    if (!req.admin) {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    const studentId = req.params.id;
    
    // Verify the student exists
    const studentExists = await studentSchema_model.findById(studentId);
    if (!studentExists) {
      return res.status(404).json({ 
        message: "Student not found",
        error: "The specified student ID does not exist in the database"
      });
    }

    // Find fee record for the student
    const result = await studentFee_model.find({ studentID: studentId });
    
    if (!result || result.length === 0) {
      console.log(`No fee record found for student: ${studentId}. Creating a new one.`);
      
      // Create default fee record if missing
      const months = [
        'Baishakh', 'Jestha', 'Asadhh', 'Shrawan', 'Bhadra', 'Ashwin',
        'Kartik', 'Mangsir', 'Poush', 'Magh', 'Falgun', 'Chaitra'
      ];
      
      const newFeeRecord = {
        studentID: studentId,
        records: {}
      };
      
      // Initialize all months with zero fees
      months.forEach(month => {
        newFeeRecord.records[month] = {
          adm_fee: 0,
          month_fee: 0,
          comp_fee: 0
        };
      });
      
      // Create and save the new fee record
      const createdRecord = await studentFee_model.create(newFeeRecord);
      console.log(`Created new fee record for student: ${studentId}`);
      
      return res.json([createdRecord]);
    }
    
    // Return the existing fee record
    return res.json(result);
  } catch (error) {
    console.error("Error retrieving student fee:", error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        message: "Invalid student ID format",
        error: error.message
      });
    }
    
    return res.status(500).json({
      message: "Failed to retrieve student fee information",
      error: error.message
    });
  }
};

export default getFeeController;
