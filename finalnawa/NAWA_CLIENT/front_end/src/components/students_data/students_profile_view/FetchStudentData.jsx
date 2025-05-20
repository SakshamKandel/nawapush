import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import axios from "axios";

const FetchStudentData = (props) => {
  const adminLoggedIn = document.cookie.includes("adminToken");
  const teacherLoggedIn = document.cookie.includes("teacherToken");
  const navigate = useNavigate();
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [confirmStep, setConfirmStep] = useState(1); // 1 for warning, 2 for final confirmation

  const handleEditFunc = async () => {
    try {
      navigate("/edit-details",{state:{student:props.student}});
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleViewFeeFunc = async () => {
    try {
      navigate("/view-fee",{state:{student:props.student}});
    } catch (error) {
      toast.error(error.message);
    }
  }

  const handleRemoveStudent = async (studentId) => {
    try {
      // Add confirmation dialog
      toast.info(
        <div>
          <p className="mb-2">Are you sure you want to remove this student?</p>
          <p className="text-sm text-gray-600 mb-3">This action cannot be undone.</p>
          <div className="flex gap-2">
            <button
              onClick={async () => {
                toast.dismiss();
                try {
                  await axios.delete(`http://localhost:8000/api/admin/remove-student/${studentId}`, { withCredentials: true });
                  toast.success('Student removed successfully');
                  fetchStudents();
                } catch (error) {
                  toast.error(error.response?.data?.message || 'Failed to remove student');
                }
              }}
              className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
            >
              Yes, Remove Student
            </button>
            <button
              onClick={() => toast.dismiss()}
              className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 text-sm"
            >
              Cancel
            </button>
          </div>
        </div>,
        { autoClose: false, closeOnClick: false }
      );
    } catch (error) {
      toast.error('Failed to initiate student removal');
    }
  };

  const resetRemoveModal = () => {
    setShowRemoveModal(false);
    setConfirmStep(1);
  };

  return (
    <div className="min-h-screen bg-[#f3f2ef] py-8 px-4 sm:px-6 lg:px-8">
      {/* Remove Student Modal */}
      {showRemoveModal && (
        <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-[99999] transition-all duration-200 ease-in-out animate-fade-in">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl border border-gray-200 transform transition-all duration-200 ease-in-out animate-scale-in">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-red-100 rounded-full p-3">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
            </div>
            
            {confirmStep === 1 ? (
              <>
                <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">Warning: Student Removal</h3>
                <p className="text-gray-600 text-center mb-6">
                  You are about to remove {props.student.name} from the database. This action will:
                  <ul className="text-left mt-2 list-disc list-inside text-sm">
                    <li>Delete all student information</li>
                    <li>Remove all fee records</li>
                    <li>This action cannot be undone</li>
                  </ul>
                </p>
                <div className="flex justify-end gap-3">
                  <button
                    onClick={resetRemoveModal}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleRemoveStudent(props.student._id)}
                    className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
                  >
                    Proceed
                  </button>
                </div>
              </>
            ) : (
              <>
                <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">Final Confirmation</h3>
                <p className="text-gray-600 text-center mb-6">
                  Are you absolutely sure you want to remove {props.student.name}? This is your last chance to cancel.
                </p>
                <div className="flex justify-end gap-3">
                  <button
                    onClick={resetRemoveModal}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleRemoveStudent(props.student._id)}
                    className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
                  >
                    Yes, Remove Student
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <div className="max-w-3xl mx-auto">
        {/* Profile Header */}
        <div className="bg-white rounded-t-lg shadow-sm overflow-hidden border border-gray-200 border-b-0">
          <div className="bg-gradient-to-r from-[#0a66c2] to-[#0073b1] h-24 relative">
            <div className="absolute -bottom-12 left-6">
              <div className="h-24 w-24 rounded-full bg-white p-1 shadow-md">
                <div className="h-full w-full rounded-full bg-[#0a66c2] flex items-center justify-center text-white font-bold text-2xl">
                  {props.student.name.charAt(0)}
                </div>
              </div>
            </div>
          </div>
          
          <div className="pt-14 pb-6 px-6">
            <h1 className="text-2xl font-bold text-gray-900">
              {props.student.name}
            </h1>
            <p className="text-gray-600 mt-1">Class: {props.student.class_name}</p>
          </div>
        </div>
        
        {/* Profile Content */}
        <div className="bg-white rounded-b-lg shadow-sm border border-gray-200 border-t-0 overflow-hidden mb-4">
          {/* Basic Info */}
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2 text-[#0a66c2]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Basic Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-500">Student ID</p>
                <p className="font-medium text-gray-900">{props.student._id || "Not assigned"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Name</p>
                <p className="font-medium text-gray-900">{props.student.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Class</p>
                <p className="font-medium text-gray-900">{props.student.class_name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Address</p>
                <p className="font-medium text-gray-900">{props.student.address}</p>
              </div>
            </div>
          </div>
          
          {/* Parent Information */}
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2 text-[#0a66c2]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Parent Information
            </h2>
            
            <div className="space-y-6">
              {/* Father's Information */}
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Father's Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Name</p>
                    <p className="font-medium text-gray-900">{props.student.father_name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Contact Number</p>
                    <p className="font-medium text-gray-900 flex items-center">
                      <svg className="w-4 h-4 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      {props.student.father_phone}
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Mother's Information */}
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Mother's Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Name</p>
                    <p className="font-medium text-gray-900">{props.student.mother_name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Contact Number</p>
                    <p className="font-medium text-gray-900 flex items-center">
                      <svg className="w-4 h-4 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      {props.student.mother_phone}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 justify-between">
          <button
            onClick={() => {
              props.setshowModal(false);
              props.setsingleData(null);
            }}
            className="text-gray-700 bg-white hover:bg-gray-50 border border-gray-300 focus:ring-2 focus:outline-none focus:ring-gray-100 font-medium rounded-full text-sm px-5 py-2.5 text-center inline-flex items-center shadow-sm transition-colors duration-200"
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to List
          </button>
          
          <div className="flex flex-wrap gap-3">
            {adminLoggedIn && (
              <>
                <button
                  onClick={handleEditFunc}
                  className="text-white bg-[#0a66c2] hover:bg-[#004182] focus:ring-2 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center inline-flex items-center shadow-sm transition-colors duration-200"
                >
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                  Edit Details
                </button>

                <button
                  onClick={() => setShowRemoveModal(true)}
                  className="text-white bg-[#0a66c2] hover:bg-[#004182] focus:ring-2 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center inline-flex items-center shadow-sm transition-colors duration-200"
                >
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                  Remove Student
                </button>
              </>
            )}
            
            <button
              onClick={handleViewFeeFunc}
              className="text-white bg-[#0a66c2] hover:bg-[#004182] focus:ring-2 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center inline-flex items-center shadow-sm transition-colors duration-200"
            >
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              View Fee
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-fade-in {
          animation: fadeIn 0.2s ease-out;
        }
        .animate-scale-in {
          animation: scaleIn 0.2s ease-out;
        }
      `}</style>
    </div>
  );
};

export default FetchStudentData;