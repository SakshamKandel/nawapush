import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import FetchStudentData from "./FetchStudentData";
import NoAccess from "../../NoAccess";
import { toast } from 'react-toastify';

const FetchStudents = () => {
  const adminLoggedIn = document.cookie.includes("adminToken");
  const teacherLoggedIn = document.cookie.includes("teacherToken");
  const [classs, setClasss] = useState(false);
  const [studentsData, setStudentsData] = useState([]);
  const navigate = useNavigate();
  const [showModal, setshowModal] = useState(false);
  const [singleData,setsingleData]=useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmAction, setConfirmAction] = useState(() => () => {});
  const [searchTerm, setSearchTerm] = useState("");
  const [classFrom, setClassFrom] = useState("");
  const [classTo, setClassTo] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const fetchStudents_ClassRange = async () => {
    if (!classFrom || !classTo) {
      toast.error("Please select both class from and class to.");
      return;
    }
    const from = parseInt(classFrom);
    const to = parseInt(classTo);
    if (from > to) {
      toast.error("Class From cannot be greater than Class To.");
      return;
    }
    setClasss(false);
    let allStudents = [];
    for (let c = from; c <= to; c++) {
      try {
        const response = await axios.get(
          `http://localhost:8000/getStudents/${c}`,
          { withCredentials: true }
        );
        allStudents = allStudents.concat(response.data);
      } catch (error) {
        // Optionally handle error for each class
      }
    }
    setStudentsData(allStudents);
    setClasss(true);
  };

  const viewHandleFunc = async (student) => {
    try {
      setsingleData(student);
      setshowModal(true);
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    (adminLoggedIn || teacherLoggedIn) ? (
      !showModal ? (
        <div className="min-h-screen bg-[#f3f2ef] py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Student Directory</h1>
              <p className="text-gray-600 mt-2">View and manage student information by class</p>
            </div>
            
            {/* Class Selection Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-6">
              <div className="bg-gradient-to-r from-[#0a66c2] to-[#0073b1] px-6 py-4">
                <h2 className="text-white text-lg font-medium">Select Class Range</h2>
                <p className="text-blue-100 text-sm">Choose a class range to view enrolled students</p>
              </div>
              <div className="p-6">
                <div className="flex flex-col md:flex-row gap-4 mb-4">
                  <div className="flex-1">
                    <label htmlFor="class_from" className="block text-sm font-medium text-gray-700 mb-1">
                      Class From
                    </label>
                    <select
                      name="class_from"
                      id="class_from"
                      value={classFrom}
                      onChange={e => setClassFrom(e.target.value)}
                      className="block w-full border border-gray-300 rounded-lg px-3 py-2.5 shadow-sm focus:ring-1 focus:ring-[#0a66c2] focus:border-[#0a66c2] text-gray-900 text-sm transition-colors"
                    >
                      <option value="">Select class</option>
                      <option value="1">Class 1</option>
                      <option value="2">Class 2</option>
                      <option value="3">Class 3</option>
                      <option value="4">Class 4</option>
                      <option value="5">Class 5</option>
                      <option value="6">Class 6</option>
                    </select>
                  </div>
                  <div className="flex-1">
                    <label htmlFor="class_to" className="block text-sm font-medium text-gray-700 mb-1">
                      Class To
                    </label>
                    <select
                      name="class_to"
                      id="class_to"
                      value={classTo}
                      onChange={e => setClassTo(e.target.value)}
                      className="block w-full border border-gray-300 rounded-lg px-3 py-2.5 shadow-sm focus:ring-1 focus:ring-[#0a66c2] focus:border-[#0a66c2] text-gray-900 text-sm transition-colors"
                    >
                      <option value="">Select class</option>
                      <option value="1">Class 1</option>
                      <option value="2">Class 2</option>
                      <option value="3">Class 3</option>
                      <option value="4">Class 4</option>
                      <option value="5">Class 5</option>
                      <option value="6">Class 6</option>
                    </select>
                  </div>
                </div>
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={fetchStudents_ClassRange}
                    className="flex items-center justify-center py-2.5 px-5 border border-transparent rounded-full shadow-sm text-sm font-medium text-white bg-[#0a66c2] hover:bg-[#004182] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0a66c2] disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                    </svg>
                    Find Students
                  </button>
                </div>
              </div>
            </div>
            
            {/* Students List */}
            {classs && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-medium text-gray-900">
                      Students List
                    </h2>
                    <p className="text-sm text-gray-500">{studentsData.length} students found</p>
                  </div>
                </div>
                {/* Search Bar */}
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-end bg-gray-50">
                  <input
                    type="text"
                    placeholder="Search by name or ID..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="w-full md:w-1/2 px-4 py-2 border border-gray-300 rounded-full shadow-sm focus:ring-1 focus:ring-[#0a66c2] focus:border-[#0a66c2] text-gray-900 text-sm transition-colors"
                  />
                </div>
                {/* Filtered Students List */}
                {studentsData.length ? (
                  <ul className="divide-y divide-gray-200">
                    {studentsData.filter(student =>
                      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      student._id.toLowerCase().includes(searchTerm.toLowerCase())
                    ).map((student) => (
                      <li key={student._id} className="hover:bg-gray-50 transition-colors duration-150">
                        <div className="px-6 py-4 flex items-center">
                          <div className="w-10 h-10 bg-[#0a66c2] rounded-full flex items-center justify-center text-white font-medium text-sm mr-4">
                            {student.name.charAt(0)}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-gray-900 truncate">{student.name}</p>
                            <p className="text-sm text-gray-500 truncate">ID: {student._id}</p>
                          </div>
                          <div className="flex-shrink-0 ml-4">
                            <button
                              onClick={() => viewHandleFunc(student)}
                              type="button"
                              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-full shadow-sm text-white bg-[#0a66c2] hover:bg-[#004182] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0a66c2] transition-colors duration-200"
                            >
                              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                              </svg>
                              View Profile
                            </button>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="px-6 py-12 text-center">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                    <h3 className="mt-2 text-lg font-medium text-gray-900">No students found</h3>
                    <p className="mt-1 text-sm text-gray-500">There are no students enrolled in this class.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      ) : (
        <FetchStudentData setsingleData={setsingleData} setshowModal={setshowModal} student={singleData} />
      )
    ) : (
      <NoAccess />
    )
  );
};

export default FetchStudents;