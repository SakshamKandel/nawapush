import studentSchema_model from "../../database/mongoose_schema/student_schema.js";
import studentFee_model from "../../database/mongoose_schema/studentFeeRecord_schema.js";
import StudentHistory from '../../database/models/StudentHistory.js';

const student_accountCreate = async (req, res) => {
    try {
        if (!req.admin) {
            return res.status(403).json({ message: "Only admin can create student accounts" });
        }

        // Log the incoming request body for debugging
        console.log('Student creation request body:', req.body);

        // Ensure class_name and phone numbers are always numbers
        if (typeof req.body.class_name === 'string') {
            req.body.class_name = parseInt(req.body.class_name, 10);
        }
        
        // Convert phone numbers to numbers
        if (typeof req.body.father_phone === 'string') {
            req.body.father_phone = parseInt(req.body.father_phone, 10);
        }
        
        if (typeof req.body.mother_phone === 'string') {
            req.body.mother_phone = parseInt(req.body.mother_phone, 10);
        }

        // Check for required fields
        const requiredFields = ['name', 'class_name', 'address', 'father_name', 'father_phone', 'mother_name', 'mother_phone', 'email', 'password'];
        const missingFields = requiredFields.filter(field => !req.body[field]);
        if (missingFields.length > 0) {
            return res.status(400).json({
                message: "Validation Error",
                details: [`Missing required fields: ${missingFields.join(', ')}`]
            });
        }

        // Check if student with email already exists
        const existingStudent = await studentSchema_model.findOne({ email: req.body.email });
        if (existingStudent) {
            return res.status(400).json({ 
                message: "A student with this email already exists",
                details: "Please use a different email address or check if the student is already registered"
            });
        }

        // We no longer check for unique mother's name as siblings can have the same mother

        // Create new student account
        const result = await studentSchema_model.create(req.body);
        
        // Create fee record for the student
        await studentFee_model.create({ studentID: result._id });

        // Create initial student history record
        await StudentHistory.create({
            studentId: result._id,
            academicYear: new Date().getFullYear(),
            class: result.class_name,
            status: 'active',
            feeStatus: 'pending',
            archivedData: result.toObject()
        });
        
        res.status(201).json({ 
            message: "Student Account Creation Successful",
            studentId: result._id
        });
    } catch (error) {
        console.error("Student creation error:", error);
        if (error.name === 'ValidationError') {
            const validationErrors = Object.values(error.errors).map(err => err.message);
            console.error('Validation error details:', validationErrors);
            return res.status(400).json({ 
                message: "Validation Error",
                details: validationErrors
            });
        }
        res.status(500).json({ 
            message: "Failed to create student account",
            details: error.message
        });
    }
};

export default student_accountCreate;