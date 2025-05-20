import express from "express";
import connectTo from "./database/mongo_conn.js";
import { configDotenv } from "dotenv";
import cors from "cors"
import cookieParser from "cookie-parser";
import fetch_teachers from "./routes/admin_accessible_routes/FetchTeachers.js";
import updateRoutine from "./routes/admin_accessible_routes/UpdateRoutine.js";
import get_student from "./routes/admin_accessible_routes/students_data/GetStudents.js";
import get_fee from "./routes/admin_accessible_routes/fees/GetFeeRecord.js";
import class_fee_struct from "./routes/admin_accessible_routes/fees/ClassFeeStructure.js";
import edit_record_fee from "./routes/admin_accessible_routes/fees/EditRecordFee.js";
import fixFeeRecordsRouter from "./routes/admin_accessible_routes/fees/FixFeeRecords.js";
import create_teacher from "./routes/admin_accessible_routes/accounts_creation_route/CreateTeacher.js";
import create_student from "./routes/admin_accessible_routes/accounts_creation_route/CreateStudent.js";
import admin_notice_route from "./routes/admin_accessible_routes/notice/AdminNoticeRoute.js";
import edit_student from "./routes/admin_accessible_routes/students_data/EditStudent.js";
import fetch_routine from "./routes/routines/FetchRoutine.js";
import getNotice from "./routes/notice/GetNotice.js";
import loginRoute from "./routes/login_logout/LoginRoute.js";
import logoutRoute from "./routes/login_logout/LogoutRoute.js";
import get_salary from "./routes/admin_accessible_routes/salary_payroll/SalaryView.js";
import create_admin from "./routes/admin_accessible_routes/accounts_creation_route/CreateAdmin.js";
import teacherPayrollRoutes from "./routes/teacherPayrollRoutes.js";
import removeTeacherRoute from './routes/admin_accessible_routes/RemoveTeacher.js';
import leaveManagementRoutes from './routes/leaveManagement.js';
import teacherNoticesRoutes from './routes/teacherNotices.js';
import remove_student from "./routes/admin_accessible_routes/students_data/RemoveStudent.js";
import yearEndManagementRoutes from './routes/admin_accessible_routes/yearEndManagement.js';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables
configDotenv();

// Set up __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Environment variable
const NODE_ENV = process.env.NODE_ENV || 'development';
const PORT = process.env.PORT || 8000;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

// Clear console only in development
if (NODE_ENV === 'development') {
  console.clear();
}

console.log(`Server running in ${NODE_ENV} mode`);

// Middlewares
app.use(express.json());

// Configure CORS for production or development
app.use(cors({
  origin: NODE_ENV === 'production' 
    ? [FRONTEND_URL, /\.navatara\.edu\.np$/] // Allow your domain and subdomains
    : FRONTEND_URL,
  credentials: true
}));

app.use(cookieParser());

// Serve static files
app.use(express.static("public/notice_files"));
// If you want to serve frontend in production from the same server
if (NODE_ENV === 'production') {
  // Assuming front_end/dist is your build directory
  app.use(express.static(path.join(__dirname, '../front_end/dist')));
}

//routes
app.use("/",loginRoute);  //route for login before role distribution:
app.use("/",logoutRoute)  //routes for logout
app.use("/getTeachers",fetch_teachers)  //route for getting all teacher's data from admin's account while viewing routines.
app.use("/admin",admin_notice_route)  //route for notice creation from admin's account
app.use("/get",getNotice)  //route for notices fetching.
app.use("/fetch",fetch_routine)  //route for routines fetch by either teacher or admin
app.use("/updateRoutine",updateRoutine)  //route for updating routine from admin's account
app.use("/create",create_teacher)  //route for creating teacher from admin's account
app.use('/create',create_student)  //route for creating student from admin's account
app.use("/create",create_admin)  //route for creating admin from admin's account
app.use("/getStudents",get_student)  //route for getting all students from admin's or teacher's account
app.use("/editStudent",edit_student);  //route for editing particular student from admin's account
app.use("/getFee",get_fee)  //route for getting student fee records from admin's account
app.use("/editFee",edit_record_fee)  //route for editing student fee record from admin's account
app.use("/api/fees", fixFeeRecordsRouter)  //route for fixing student fee records
app.use("/fetch/class",class_fee_struct)  //route for getting class fee ko structure from admin's account
app.use("/getSalary",get_salary)  //route for getting teacher salary record from admin's account
// Teacher Payroll Routes
app.use("/api/teacher-payroll", teacherPayrollRoutes);
app.use('/admin', removeTeacherRoute);
app.use('/', leaveManagementRoutes);  //route for leave management
app.use('/', teacherNoticesRoutes);
app.use("/remove-student", remove_student);  //route for removing students from admin's account
app.use("/api/year-end", yearEndManagementRoutes);

// Serve frontend for any other routes in production (SPA support)
if (NODE_ENV === 'production') {
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../front_end/dist/index.html'));
  });
}

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: NODE_ENV === 'production' ? 'Server error' : err.message,
    ...(NODE_ENV !== 'production' && { stack: err.stack })
  });
});

// Connect to database
connectTo()
  .then(() => {
    // Start the server after successful DB connection
    app.listen(PORT, () => {
      console.log(`Server successfully running on port ${PORT}`);
      console.log(`Server URL: http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error("Failed to connect to database:", err.message);
    process.exit(1);
  });

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // Application specific logging, throwing an error, or other logic here
});

export default app;