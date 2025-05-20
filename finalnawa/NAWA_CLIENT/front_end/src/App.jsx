import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import About from "./components/About";
import Footer from "./components/Footer";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AIChatBox from "./components/AIChatBox";
import LoginForm from "./components/LoginForm";
import Context from "./Context";
import CreateNotice from "./components/admin_components/notice_creation/CreateNotice";
import Notice from "./components/notices/Notice";
import RoutineSee from "./components/teachers_components/routine_view/RoutineSee";
import RoutineEdit from "./components/admin_components/routine_edit/RoutineEdit";
import CreateAccountTeacher from "./components/admin_components/accounts_creation/CreateAccountTeacher";
import CreateAccountStudent from "./components/admin_components/accounts_creation/CreateAccountStudent";
import FetchStudents from "./components/students_data/students_profile_view/FetchStudents";
import EditStudentData from "./components/students_data/edit_profile/EditStudentData";
import ViewFee from "./components/students_data/fee_record/ViewFee";
import EditFeeRecord from "./components/students_data/fee_record/EditFeeRecord";
import TeacherPayroll from "./components/teachers_components/teachers_payroll/TeacherPayroll";
import ContactUs from "./components/ContactUs";
import CreateAccountAdmin from "./components/admin_components/accounts_creation/CreateAccountAdmin";
import MySalary from "./components/teachers_components/teachers_payroll/MySalary";
import RemoveTeacher from "./components/admin_components/RemoveTeacher";
import SubmitLeave from "./components/teachers_components/leave_management/SubmitLeave";
import ViewLeaveRequests from "./components/admin_components/leave_management/ViewLeaveRequests";
import ViewTeacherNotices from './components/admin_components/ViewTeacherNotices';
import SubmitNotice from './components/teachers_components/SubmitNotice';
import TeacherAlerts from './components/teachers_components/TeacherAlerts';
import YearEndManagement from "./components/admin_components/year_end_management/YearEndManagement";
import CalendarPage from "./components/calendar/CalendarPage";

function Loader() {
  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-white bg-opacity-80">
      <svg
        className="animate-spin-slow h-20 w-20"
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Mortarboard base */}
        <rect x="12" y="32" width="40" height="8" rx="2" fill="#0a66c2" />
        {/* Mortarboard top */}
        <polygon points="32,8 60,24 32,40 4,24" fill="#0a66c2" stroke="#0a66c2" strokeWidth="2" />
        {/* Tassel */}
        <line x1="32" y1="8" x2="32" y2="48" stroke="#fbbf24" strokeWidth="3" strokeLinecap="round" />
        <circle cx="32" cy="48" r="3" fill="#fbbf24" />
      </svg>
      <style>{`
        .animate-spin-slow {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <Loader />;

  return (
    <Router>
      <Context>
        <ToastContainer position="top-right" style={{ marginTop: '5rem' }} />
        <Navbar />
        <main className="z-10 bg-[url('https://images.rawpixel.com/image_800/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDIzLTA4L3JtNjIxLWJhY2tncm91bmQtMDMwYi5qcGc.jpg')] min-h-screen">
          <Routes>
            <Route exact path="/" element={<Home />} />
            <Route exact path="/about-us" element={<About />} />
            <Route exact path="/contact-us" element={<ContactUs/>}/>
            <Route exact path="/login-form" element={<LoginForm />} />
            <Route exact path="/create-notice" element={<CreateNotice />} />
            <Route exact path="/notice" element={<Notice />} />
            <Route exact path="/routine" element={<RoutineSee/>} />
            <Route exact path="/routines" element={<RoutineEdit />} />
            <Route exact path="/create-account-teacher" element={<CreateAccountTeacher />} />
            <Route exact path="/create-account-student" element={<CreateAccountStudent />} />
            <Route exact path="/create-account-admin" element={<CreateAccountAdmin/>} />
            <Route exact path="/fetch-students" element={<FetchStudents />} />
            <Route exact path="/edit-details" element={<EditStudentData />} />
            <Route exact path="/view-fee" element={<ViewFee />} />
            <Route exact path="/edit-student-fee-record" element={<EditFeeRecord/>} />
            <Route exact path="/view-teachers-payroll" element={<TeacherPayroll/>} />
            <Route exact path="/my-salary" element={<MySalary />} />
            <Route exact path="/admin/remove-teacher" element={<RemoveTeacher />} />
            <Route exact path="/submit-leave" element={<SubmitLeave />} />
            <Route exact path="/admin/leave-requests" element={<ViewLeaveRequests />} />
            <Route exact path="/admin/teacher-notices" element={<ViewTeacherNotices />} />
            <Route exact path="/submit-notice" element={<SubmitNotice />} />
            <Route exact path="/teacher-alerts" element={<TeacherAlerts />} />
            <Route exact path="/admin/year-end" element={<YearEndManagement />} />
            <Route exact path="/static-calendar" element={<CalendarPage />} />
          </Routes>
        </main>
        <AIChatBox />
        <Footer />
      </Context>
    </Router>
  );
}
