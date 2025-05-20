import axios from "axios";
import React, { useEffect, useState } from "react";
import NoAccess from "../../NoAccess";
import { toast } from 'react-toastify';
import { PDFViewer } from "@react-pdf/renderer";
import TeacherReceiptPDF from "./TeacherReceiptPDF";

const TeacherPayroll = () => {
  const adminLoggedIn = document.cookie.includes("adminToken");
  const [teachers, setTeachers] = useState([]);
  const [filteredTeachers, setFilteredTeachers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [btnClick, setbtnClick] = useState(false);
  const [record, setRecord] = useState([]);
  const [show, setShowMsg] = useState("Show");
  const [selectedTeacherId, setSelectedTeacherId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [salaryForm, setSalaryForm] = useState({
    salary: "",
    allowance: "",
    remarks: ""
  });
  const [PDF, setPDF] = useState(false);
  const [pdfData, setPdfData] = useState({});

  const months = [
    "Baishakh",
    "Jestha",
    "Asadhh",
    "Shrawan",
    "Bhadra",
    "Ashwin",
    "Kartik",
    "Mangsir",
    "Poush",
    "Magh",
    "Falgun",
    "Chaitra",
  ];
  
  useEffect(() => {
    const view_teachers_func = async () => {
      try {
        const teachersData = await axios.get(
          "http://localhost:8000/api/teacher-payroll",
          {
            withCredentials: true,
          }
        );
        setTeachers(teachersData.data);
        setFilteredTeachers(teachersData.data);
      } catch (error) {
        if (error.response) {
          toast.error(error.response.data.message);
        } else {
          toast.error(error.message);
        }
      }
    };

    view_teachers_func();
  }, []);

  useEffect(() => {
    if (!searchTerm) {
      setFilteredTeachers(teachers);
    } else {
      setFilteredTeachers(
        teachers.filter(t =>
          t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          t._id.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  }, [searchTerm, teachers]);
  
  const handleViewPayments = async (id) => {
    try {
      setIsLoading(true);
      setSelectedTeacherId(id);
      setShowMsg("Hide");
      setbtnClick(true);
      
      const response = await axios.get(
        `http://localhost:8000/api/teacher-payroll/${id}`,
        { withCredentials: true }
      );
      setRecord([response.data]);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      toast.error(error.response?.data?.message || error.message);
    }
  };

  const handleSalaryUpdate = async (month) => {
    try {
      if (!salaryForm.salary || salaryForm.salary <= 0) {
        toast.error("Please enter a valid salary amount");
        return;
      }

      setIsLoading(true);
      
      // Check if we're editing an existing paid record
      const isEditingPaidRecord = record[0]?.records[month]?.status === 'paid';
      
      const response = await axios.put(
        `http://localhost:8000/api/teacher-payroll/${selectedTeacherId}`,
        {
          month,
          salary: parseFloat(salaryForm.salary) || 0,
          allowance: parseFloat(salaryForm.allowance) || 0,
          remarks: salaryForm.remarks,
          updatePaidRecord: isEditingPaidRecord // Add flag to maintain paid status on backend
        },
        { withCredentials: true }
      );
      
      setRecord([response.data]);
      setSelectedMonth(null);
      setSalaryForm({ salary: "", allowance: "", remarks: "" });
      setIsLoading(false);
      
      toast.success(isEditingPaidRecord ? "Salary updated successfully" : "Salary payment recorded successfully");
    } catch (error) {
      setIsLoading(false);
      toast.error(error.response?.data?.message || error.message);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSalaryForm(prev => ({
      ...prev,
      [name]: name === "remarks" ? value : value === "" ? "" : parseFloat(value)
    }));
  };

  const handleClearPayroll = async () => {
    if (!selectedTeacherId) return;
    if (!window.confirm('Are you sure you want to clear all payroll records for this teacher?')) return;
    try {
      await axios.post('http://localhost:8000/api/teacher-payroll/clear', { teacherId: selectedTeacherId }, { withCredentials: true });
      toast.success('Payroll records cleared successfully!');
      setRecord([]);
      setbtnClick(false);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to clear payroll records');
    }
  };

  // Generate invoice for a specific month's salary payment
  const handleGenerateInvoice = (month, monthData) => {
    setPdfData({
      month: month,
      salary: monthData.salary,
      allowance: monthData.allowance,
      remarks: monthData.remarks,
      total: monthData.salary + monthData.allowance,
      date: monthData.date
    });
    setPDF(true);
  };
  
  return adminLoggedIn ? (
    <div className="min-h-screen bg-[#f3f6f8] font-sans py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {!PDF ? (
          <>
            {/* Page Header */}
            <div className="text-center mb-10">
              <h1 className="text-4xl font-extrabold text-[#0a66c2] tracking-tight drop-shadow-lg" style={{letterSpacing: '-0.5px'}}>Teacher Payroll Management</h1>
              <p className="mt-3 text-lg text-[#434649]">View and manage salary records for teaching staff</p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Teacher Selection Panel */}
              <div className="lg:col-span-1">
                <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-[#e6e9ec]">
                  <div className="bg-gradient-to-r from-[#0a66c2] to-[#004182] px-6 py-5">
                    <h2 className="text-white text-xl font-semibold">Select Teacher</h2>
                    <p className="text-blue-100 text-sm">Choose a teacher to view payment history</p>
                  </div>
                  {/* Search Bar */}
                  <div className="px-4 pt-4 pb-2 bg-white sticky top-0 z-10">
                    <input
                      type="text"
                      placeholder="Search by name or ID..."
                      value={searchTerm}
                      onChange={e => setSearchTerm(e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-[#e6e9ec] focus:border-[#0a66c2] focus:ring-[#0a66c2] text-base bg-[#f3f6f8] placeholder-[#0a66c2] outline-none transition"
                      style={{fontFamily: 'inherit'}}
                    />
                  </div>
                  <div className="p-4 overflow-y-auto max-h-[500px]">
                    <div className="space-y-3">
                      {filteredTeachers && filteredTeachers.length > 0 ? (
                        filteredTeachers.map((teacher) => (
                          <button
                            key={teacher._id}
                            onClick={() => handleViewPayments(teacher._id)}
                            className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 flex items-center shadow-sm
                              ${teacher._id === selectedTeacherId 
                                ? 'bg-[#eaf1fb] border border-[#0a66c2] ring-2 ring-[#0a66c2]' 
                                : 'hover:bg-[#f3f6f8] border border-transparent hover:shadow-md'
                              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0a66c2]`}
                          >
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold flex-shrink-0 transition-colors duration-200
                              ${teacher._id === selectedTeacherId 
                                ? 'bg-[#0a66c2] text-white' 
                                : 'bg-[#eaf1fb] text-[#0a66c2]'}`}
                            >
                              {teacher.name.charAt(0)}
                            </div>
                            <div className="ml-4">
                              <p className={`text-base font-semibold transition-colors duration-200 ${teacher._id === selectedTeacherId ? 'text-[#0a66c2]' : 'text-[#434649]'}`}>
                                {teacher.name}
                              </p>
                              <p className="text-xs text-gray-500">ID: {teacher._id.substring(0, 8)}...</p>
                            </div>
                            {teacher._id === selectedTeacherId && (
                              <div className="ml-auto">
                                <svg className="h-6 w-6 text-[#0a66c2]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                              </div>
                            )}
                          </button>
                        ))
                      ) : (
                        <div className="text-center py-4">
                          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
                          </svg>
                          <p className="mt-2 text-sm text-gray-500">No teachers found</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Records Panel */}
              <div className="lg:col-span-2">
                {btnClick ? (
                  <div className="bg-white shadow-lg rounded-xl overflow-hidden transform transition-all duration-300 ease-in-out border border-[#e6e9ec]">
                    <div className="bg-gradient-to-r from-[#0a66c2] to-[#004182] px-6 py-5 flex justify-between items-center">
                      <div>
                        <h2 className="text-white text-xl font-semibold">Payment Records</h2>
                        <p className="text-blue-100 text-sm">
                          {teachers.find(t => t._id === selectedTeacherId)?.name || "Teacher"}'s monthly salary history
                        </p>
                      </div>
                      <button
                        onClick={handleClearPayroll}
                        className="ml-4 inline-flex items-center px-4 py-2 border border-transparent text-base font-semibold rounded-lg text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:from-pink-500 hover:to-purple-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white transition-colors duration-200 shadow"
                      >
                        Clear Payroll Records
                      </button>
                      <button 
                        onClick={() => {
                          setbtnClick(false);
                          setShowMsg("Show");
                        }}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-base font-semibold rounded-lg text-[#0a66c2] bg-white hover:bg-[#eaf1fb] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white transition-colors duration-200 shadow"
                      >
                        Back
                      </button>
                    </div>
                    
                    {/* Placeholder if no records found */}
                    {(!record || record.length === 0) ? (
                      <div className="p-8 text-center">
                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                        </svg>
                        <h3 className="mt-2 text-base font-medium text-gray-900">No payment records found</h3>
                        <p className="mt-1 text-sm text-gray-500">No salary records are available for this teacher yet.</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 overflow-y-auto max-h-[500px] p-6">
                        {record && months.map((month) => {
                          const monthData = record[0]?.records[month];
                          const totalSalary = monthData ? 
                            monthData.salary + monthData.allowance : 0;
                          
                          return (
                            <div 
                              key={month} 
                              className="border border-[#e6e9ec] rounded-xl overflow-hidden shadow bg-white hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1"
                            >
                              <div className="px-5 py-4 bg-[#f3f6f8] border-b border-[#e6e9ec] flex justify-between items-center">
                                <span className="font-semibold text-[#0a66c2] flex items-center text-lg">
                                  <svg className="mr-2 h-6 w-6 text-[#0a66c2]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                  </svg>
                                  {month}
                                </span>
                                {monthData?.status === 'paid' ? (
                                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-[#e0f7e9] text-[#0a8a43]">
                                    <span className="w-2 h-2 rounded-full bg-[#0a8a43] mr-2"></span>
                                    Paid
                                  </span>
                                ) : (
                                  selectedMonth === month ? (
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-[#ffedd5] text-[#c2410c]">
                                      <span className="w-2 h-2 rounded-full bg-[#c2410c] mr-2"></span>
                                      Editing
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-[#f3f4f6] text-[#6b7280]">
                                      <span className="w-2 h-2 rounded-full bg-[#6b7280] mr-2"></span>
                                      Pending
                                    </span>
                                  )
                                )}
                              </div>
                              
                              <div className="p-5">
                                {selectedMonth === month ? (
                                  /* Salary Edit Form */
                                  <div className="space-y-4">
                                    <div>
                                      <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Salary Amount
                                      </label>
                                      <div className="mt-1 relative rounded-md shadow-sm">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                          <span className="text-gray-500 sm:text-sm">Rs.</span>
                                        </div>
                                        <input
                                          type="number"
                                          name="salary"
                                          value={salaryForm.salary}
                                          onChange={handleInputChange}
                                          className="focus:ring-[#0a66c2] focus:border-[#0a66c2] block w-full pl-10 pr-12 sm:text-sm border-gray-300 rounded-md py-2"
                                          placeholder="0.00"
                                        />
                                      </div>
                                    </div>
                                    
                                    <div>
                                      <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Allowance
                                      </label>
                                      <div className="mt-1 relative rounded-md shadow-sm">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                          <span className="text-gray-500 sm:text-sm">Rs.</span>
                                        </div>
                                        <input
                                          type="number"
                                          name="allowance"
                                          value={salaryForm.allowance}
                                          onChange={handleInputChange}
                                          className="focus:ring-[#0a66c2] focus:border-[#0a66c2] block w-full pl-10 pr-12 sm:text-sm border-gray-300 rounded-md py-2"
                                          placeholder="0.00"
                                        />
                                      </div>
                                    </div>
                                    
                                    <div>
                                      <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Remarks
                                      </label>
                                      <textarea
                                        name="remarks"
                                        value={salaryForm.remarks}
                                        onChange={handleInputChange}
                                        rows="2"
                                        className="focus:ring-[#0a66c2] focus:border-[#0a66c2] block w-full sm:text-sm border-gray-300 rounded-md py-2"
                                        placeholder="Optional remarks"
                                      ></textarea>
                                    </div>
                                    
                                    <div className="flex space-x-3">
                                      <button
                                        onClick={() => handleSalaryUpdate(month)}
                                        disabled={isLoading}
                                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#0a66c2] hover:bg-[#004182] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0a66c2] flex-1"
                                      >
                                        {isLoading ? 'Saving...' : 'Save Payment'}
                                      </button>
                                      <button
                                        onClick={() => setSelectedMonth(null)}
                                        className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0a66c2]"
                                      >
                                        Cancel
                                      </button>
                                    </div>
                                  </div>
                                ) : (
                                  /* Salary Display */
                                  <div>
                                    {monthData?.status === 'paid' ? (
                                      <>
                                        <div className="space-y-3 mb-4">
                                          <div className="flex justify-between">
                                            <span className="text-gray-500 text-sm">Base Salary:</span>
                                            <span className="font-medium">Rs. {monthData.salary.toLocaleString()}</span>
                                          </div>
                                          
                                          {monthData.allowance > 0 && (
                                            <div className="flex justify-between">
                                              <span className="text-gray-500 text-sm">Allowance:</span>
                                              <span className="font-medium">Rs. {monthData.allowance.toLocaleString()}</span>
                                            </div>
                                          )}
                                          
                                          <div className="pt-2 border-t border-gray-100 flex justify-between">
                                            <span className="font-medium text-gray-900">Total:</span>
                                            <span className="font-bold text-[#0a66c2]">Rs. {totalSalary.toLocaleString()}</span>
                                          </div>
                                          
                                          {monthData.remarks && (
                                            <div className="pt-2">
                                              <span className="text-gray-500 text-sm block">Remarks:</span>
                                              <p className="text-gray-700 text-sm italic">"{monthData.remarks}"</p>
                                            </div>
                                          )}
                                          
                                          <div className="pt-2">
                                            <span className="text-gray-500 text-sm block">Payment Date:</span>
                                            <p className="text-gray-700 text-sm">{new Date(monthData.date).toLocaleDateString('en-US', {
                                              year: 'numeric',
                                              month: 'long',
                                              day: 'numeric'
                                            })}</p>
                                          </div>
                                        </div>
                                        
                                        {/* Generate Invoice Button */}
                                        <button
                                          onClick={() => handleGenerateInvoice(month, monthData)}
                                          className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-[#0a66c2] hover:bg-[#004182] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0a66c2] transition-all duration-200 mb-2"
                                        >
                                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                                          </svg>
                                          Generate Salary Invoice
                                        </button>
                                        
                                        {/* Edit Paid Salary Button */}
                                        <button
                                          onClick={() => {
                                            setSelectedMonth(month);
                                            setSalaryForm({
                                              salary: monthData.salary.toString(),
                                              allowance: monthData.allowance.toString(),
                                              remarks: monthData.remarks || ""
                                            });
                                          }}
                                          className="w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg shadow-sm text-gray-700 bg-white hover:bg-gray-50 transition-all duration-200 mt-2"
                                        >
                                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                          </svg>
                                          Edit Salary Details
                                        </button>
                                      </>
                                    ) : (
                                      <div className="text-center py-3">
                                        <button
                                          onClick={() => setSelectedMonth(month)}
                                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                        >
                                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                          </svg>
                                          Add Payment
                                        </button>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="bg-white shadow-lg rounded-xl p-8 text-center h-full flex flex-col justify-center items-center border border-[#e6e9ec]">
                    <svg className="h-16 w-16 text-[#0a66c2] mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                    </svg>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">Teacher Payment Records</h3>
                    <p className="text-gray-500 mb-4 max-w-md">Select a teacher from the list to view their payment history and manage their monthly salary records.</p>
                  </div>
                )}
              </div>
            </div>
          </>
        ) : (
          /* PDF Invoice Viewer */
          <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="p-4 bg-[#0a66c2] text-white flex justify-between items-center">
              <h2 className="text-lg font-medium">Salary Invoice Preview</h2>
              <button 
                onClick={() => {setPDF(false); setPdfData({});}}
                className="text-white bg-[#004182] hover:bg-[#003166] focus:ring-2 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-sm px-4 py-1.5 text-center inline-flex items-center shadow-sm transition-colors duration-200"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Return to Payroll Records
              </button>
            </div>
            
            <div className="h-[calc(100vh-8rem)] bg-gray-100 border-t border-gray-200">
              <PDFViewer style={{width:"100%", height:"100%"}}>
                <TeacherReceiptPDF 
                  teacherData={teachers.find(t => t._id === selectedTeacherId) || {}} 
                  pdfData={pdfData} 
                />
              </PDFViewer>
            </div>
          </div>
        )}
      </div>
    </div>
  ) : (
    <NoAccess/>
  );
};

export default TeacherPayroll;