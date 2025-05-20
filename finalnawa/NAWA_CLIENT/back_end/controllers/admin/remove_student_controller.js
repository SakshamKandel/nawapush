import studentSchema_model from "../../database/mongoose_schema/student_schema.js";
import studentFee_model from "../../database/mongoose_schema/studentFeeRecord_schema.js";

const removeStudentController = async (req, res) => {
    try {
        if (!req.admin) {
            return res.status(403).json({ message: "Only admin can remove students" });
        }

        const studentId = req.params.id;
        
        // First, delete the student's fee records
        await studentFee_model.deleteMany({ studentID: studentId });
        
        // Then, delete the student
        const deletedStudent = await studentSchema_model.findByIdAndDelete(studentId);
        
        if (!deletedStudent) {
            return res.status(404).json({ message: "Student not found" });
        }

        res.json({ message: "Student removed successfully" });
    } catch (error) {
        console.error("Error removing student:", error);
        res.status(500).json({ message: error.message });
    }
};

export default removeStudentController; 