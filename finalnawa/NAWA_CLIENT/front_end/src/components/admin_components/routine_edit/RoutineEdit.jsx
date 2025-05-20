import axios from "axios";
import React, { useEffect, useState } from "react";
import NoAccess from "../../NoAccess";
import { useForm } from "react-hook-form";
import { toast } from 'react-toastify';

const RoutineEdit = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch
  } = useForm();
  const adminLoggedIn = document.cookie.includes("adminToken");
  const days = [
    { name: "Sunday", color: "from-[#0077B5] to-[#0073b1]" },
    { name: "Monday", color: "from-[#0077B5] to-[#0a66c2]" },
    { name: "Tuesday", color: "from-[#0073b1] to-[#004182]" },
    { name: "Wednesday", color: "from-[#0077B5] to-[#0073b1]" },
    { name: "Thursday", color: "from-[#0077B5] to-[#004182]" },
    { name: "Friday", color: "from-[#0073b1] to-[#016497]" },
  ];
  const periods = [
    "period1",
    "period2",
    "period3",
    "period4",
    "period5",
    "period6",
    "period7",
  ];
  
  // React state and hooks remain unchanged
  const [teachers, setTeachers] = useState([]);
  const [routines, setRoutine] = useState([]);
  const [id, setID] = useState();
  const selectedTeacher = watch("teachers");
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmAction, setConfirmAction] = useState(() => () => {});
  
  useEffect(() => {
    const fetchTeacherName = async () => {
      try {
        if (adminLoggedIn) {
          const teachersData = await axios.get(
            "http://localhost:8000/getTeachers",
            { withCredentials: true }
          );
          setTeachers(teachersData.data);
        }
      } catch (error) {
        if (error.response) {
          toast.error(error.response.data);
        } else {
          toast.error(error.message);
        }
      }
    };
    fetchTeacherName();
  }, []);

  const fetchRoutine_Teacher = async (data) => {
    try {
      if (routines) {
        setRoutine([]);
      }
      const result = await axios.get(
        `http://localhost:8000/fetch/routines/${data.teachers}`,
        { withCredentials: true }
      );
      setRoutine(result.data);
      setID(data.teachers);
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data);
      } else {
        toast.error(error.message);
      }
    }
  };

  const handleRoutineChange = (name, period, field, value) => {
    setRoutine((prevRoutines) =>
      prevRoutines.map((routine) => ({
        ...routine,
        schedule: {
          ...routine.schedule,
          [name]: {
            ...routine.schedule[name],
            [period]: {
              ...routine.schedule[name][period],
              [field]: value,
            },
          },
        },
      }))
    );
  };

  const handleUpdateChange = async () => {
    try {
      let data = {};
      routines.map((routine) => {
        data = routine.schedule;
      });
      const response = await axios.patch(
        `http://localhost:8000/updateRoutine/${id}`,
        { data },
        { withCredentials: true }
      );
      toast.success(response.data);
      window.location.reload();
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data);
      } else {
        toast.error(error.message);
      }
    }
  };

  // Function to get selected teacher name
  const getSelectedTeacherName = () => {
    if (!selectedTeacher) return "";
    const teacher = teachers.find(t => t._id === selectedTeacher);
    return teacher ? teacher.name : "";
  };

  return teachers && adminLoggedIn ? (
    <div className="min-h-screen bg-[#f3f2ef] py-8 px-4 sm:px-6 lg:px-8">
      {/* NAWATARA STYLE page header with card */}
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm border border-[#e0e0e0] mb-5 overflow-hidden">
          <div className="p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-[#e9f0f8] rounded-lg">
                <svg className="w-7 h-7 text-[#0a66c2]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-semibold text-[#191919]">
                  Teacher Routine Management
                </h1>
                <p className="mt-1 text-sm text-[#666666]">
                  View and edit teaching schedules for your faculty members
                </p>
              </div>
            </div>
          </div>
          
          <div className="border-t border-[#e0e0e0] px-6 py-5 bg-[#fafafa]">
            <form onSubmit={handleSubmit(fetchRoutine_Teacher)}>
              <div className="mb-4">
                <label 
                  htmlFor="teachers" 
                  className="block text-sm font-medium text-[#191919] mb-2 flex items-center"
                >
                  <svg className="w-4 h-4 text-[#0a66c2] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                  </svg>
                  Select Teacher
                </label>
                <div className="relative">
                  {/* Animated teacher selection */}
                  <div className="relative">
                    <select
                      name="teachers"
                      id="teachers"
                      className={`w-full pl-3 pr-10 py-3 text-base border border-[#d0d5dd] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0a66c2] focus:border-[#0a66c2] transition duration-200 appearance-none bg-white ${selectedTeacher ? "text-[#191919]" : "text-[#6e6e6e]"}`}
                      {...register("teachers", {
                        required: "Please select a teacher to view their schedule",
                      })}
                    >
                      <option value="">Select a faculty member</option>
                      {teachers.map((teacher) => (
                        <option key={teacher._id} value={teacher._id}>
                          {teacher.name}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-[#6e6e6e]">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                      </svg>
                    </div>
                  </div>
                  
                  {/* Sliding animation for selected teacher */}
                  {selectedTeacher && (
                    <div className="absolute -top-3 left-4 bg-white px-2 text-xs font-medium text-[#0a66c2] transform transition-transform duration-200 animate-fadeIn">
                      Selected Teacher
                    </div>
                  )}
                </div>

                {errors.teachers && (
                  <p className="mt-2 text-sm text-[#d93025] flex items-center">
                    <svg className="w-4 h-4 mr-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                    </svg>
                    {errors.teachers.message}
                  </p>
                )}

                {/* Display selected teacher with LinkedIn-like styling */}
                {selectedTeacher && (
                  <div className="mt-3 flex items-center">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#0077B5] to-[#0a66c2] flex items-center justify-center text-white font-semibold text-sm">
                      {getSelectedTeacherName().charAt(0).toUpperCase()}
                    </div>
                    <div className="ml-2 text-sm font-medium text-[#191919] animate-slideInRight">
                      {getSelectedTeacherName()}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="inline-flex items-center justify-center px-5 py-2 border border-transparent text-sm font-medium rounded-full shadow-sm text-white bg-[#0a66c2] hover:bg-[#004182] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0a66c2] transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Loading...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                      </svg>
                      View Schedule
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* NAWATARA STYLE schedule table - only displayed when routines are loaded */}
      {routines.length > 0 && (
        <div className="max-w-7xl mx-auto mt-5 space-y-5">
          {/* LinkedIn Activity card-like header */}
          <div className="flex justify-between items-center bg-white rounded-t-xl shadow-sm border border-[#e0e0e0] p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#0077B5] to-[#0a66c2] flex items-center justify-center text-white">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                </svg>
              </div>
              <div>
                <h2 className="text-lg font-medium text-[#191919]">Teaching Schedule</h2>
                <p className="text-sm text-[#666666]">{getSelectedTeacherName()}'s weekly class routines</p>
              </div>
            </div>
            
            <button
              onClick={handleUpdateChange}
              className="inline-flex items-center px-5 py-2 border border-transparent text-sm font-medium rounded-full shadow-sm text-white bg-[#0a66c2] hover:bg-[#004182] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0a66c2] transition-all duration-200"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"></path>
              </svg>
              Save Changes
            </button>
          </div>

          {/* NAWATARA STYLE table card */}
          <div className="bg-white rounded-b-xl shadow-sm border border-[#e0e0e0] border-t-0 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-[#e0e0e0]">
                <thead>
                  <tr className="bg-[#fafafa]">
                    <th scope="col" className="pl-6 pr-3 py-3 text-left text-xs font-semibold text-[#666666] uppercase tracking-wider sticky left-0 bg-[#fafafa] shadow-sm z-10 w-36 border-r border-[#e0e0e0]">
                      Day
                    </th>
                    {periods.map((period) => (
                      <th 
                        key={period} 
                        scope="col" 
                        className="px-4 py-3 text-center text-xs font-semibold text-[#666666] uppercase tracking-wider"
                      >
                        <div className="flex items-center justify-center">
                          <span className="inline-flex items-center justify-center px-3 py-1 rounded-md bg-[#e9f0f8] text-[#0a66c2] mr-2 text-xs font-medium">
                            Period {period.slice(6)}
                          </span>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                
                <tbody className="bg-white divide-y divide-[#e0e0e0]">
                  {routines.map((routine) =>
                    days.map(({ name, color }) => (
                      <tr key={name} className="hover:bg-[#f3f9ff] transition-colors duration-150">
                        <td className="sticky left-0 z-10 bg-white py-3 pl-6 pr-3 whitespace-nowrap border-r border-[#e0e0e0] hover:bg-[#f3f9ff]">
                          {/* Modern gradient day indicator */}
                          <div className={`flex items-center space-x-2`}>
                            <div className={`w-1.5 h-10 rounded-full bg-gradient-to-b ${color}`}></div>
                            <span className="font-medium text-sm text-[#191919]">{name}</span>
                          </div>
                        </td>
                        
                        {periods.map((period) => (
                          <td key={period} className="p-2">
                            <div className="bg-white rounded-lg border border-[#e0e0e0] hover:border-[#0a66c2] hover:shadow transition-all duration-150 overflow-hidden group">
                              <div className="px-3 py-2.5 bg-[#fafafa] border-b border-[#e0e0e0] group-hover:bg-[#f3f9ff]">
                                <input
                                  type="text"
                                  placeholder="Subject"
                                  className="w-full bg-transparent border-0 p-0 text-sm font-medium text-[#191919] placeholder-[#8f8f8f] focus:outline-none focus:ring-0"
                                  defaultValue={routine.schedule[name][period].subject}
                                  onChange={(e) =>
                                    handleRoutineChange(name, period, "subject", e.target.value)
                                  }
                                />
                              </div>
                              <div className="px-3 py-2.5">
                                <input
                                  type="text"
                                  placeholder="Class"
                                  className="w-full bg-transparent border-0 p-0 text-sm text-[#666666] placeholder-[#8f8f8f] focus:outline-none focus:ring-0"
                                  defaultValue={routine.schedule[name][period].class_ko_name}
                                  onChange={(e) =>
                                    handleRoutineChange(name, period, "class_ko_name", e.target.value)
                                  }
                                />
                              </div>
                            </div>
                          </td>
                        ))}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
          
          {/* NAWATARA STYLE connection recommendation card for tips */}
          <div className="bg-white rounded-xl shadow-sm border border-[#e0e0e0] overflow-hidden">
            <div className="p-4 border-l-4 border-[#0a66c2] flex">
              <div className="flex-shrink-0 p-1 bg-[#e9f0f8] rounded-md">
                <svg className="h-5 w-5 text-[#0a66c2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-[#191919]">Quick Tips</h3>
                <div className="mt-2 text-xs text-[#666666] space-y-2">
                  <p className="flex items-center">
                    <svg className="w-4 h-4 mr-2 text-[#0a66c2]" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"></path>
                    </svg>
                    Click directly within any cell to edit subject and class
                  </p>
                  <p className="flex items-center">
                    <svg className="w-4 h-4 mr-2 text-[#0a66c2]" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                    </svg>
                    Remember to save changes when finished
                  </p>
                  <p className="flex items-center">
                    <svg className="w-4 h-4 mr-2 text-[#0a66c2]" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"></path>
                      <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd"></path>
                    </svg>
                    Clear both fields to remove class assignments
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  ) : (
    <NoAccess />
  );
};

export default RoutineEdit;