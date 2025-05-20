import mongoose from "mongoose";
import studentSchema_model from "../database/mongoose_schema/student_schema.js";
import classFee_model from "../database/mongoose_schema/classfee_structure_schema.js";

const removeClass7 = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect("mongodb://127.0.0.1:27017/nawa_school");
    console.log("Connected to MongoDB");

    // Remove all class 7 students
    const studentResult = await studentSchema_model.deleteMany({ class_name: "7" });
    console.log(`Removed ${studentResult.deletedCount} class 7 students`);

    // Remove class 7 fee structure
    const feeResult = await classFee_model.deleteOne({ class_name: 7 });
    console.log(`Removed class 7 fee structure: ${feeResult.deletedCount > 0 ? 'Yes' : 'No'}`);

    console.log("Class 7 data removal completed successfully");
  } catch (error) {
    console.error("Error removing class 7 data:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
};

// Run the script
removeClass7(); 