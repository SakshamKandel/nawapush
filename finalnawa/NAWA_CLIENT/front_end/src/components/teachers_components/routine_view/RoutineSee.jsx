import React, { useEffect, useState } from "react";
import NoAccess from "../../NoAccess";
import axios from "axios";
import { toast } from 'react-toastify';

const RoutineSee = () => {
  const teacherLoggedIn = document.cookie.includes("teacherToken");
  const days = [
    { name: "Sunday", color: "border-blue-500" },
    { name: "Monday", color: "border-indigo-500" },
    { name: "Tuesday", color: "border-amber-500" },
    { name: "Wednesday", color: "border-green-500" },
    { name: "Thursday", color: "border-gray-500" },
    { name: "Friday", color: "border-red-500" },
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
  const [routines, setRoutines] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRoutines = async () => {
      try {
        if (teacherLoggedIn) {
          setLoading(true);
          const response = await axios.get(
            `http://localhost:8000/fetch/routines`,
            { withCredentials: true }
          );
          setRoutines(response.data);
          setLoading(false);
        }
      } catch (error) {
        setLoading(false);
        if (error.response) {
          toast.error(error.response.data);
        } else {
          toast.error(error.message);
        }
      }
    };

    fetchRoutines();
  }, []);

  return teacherLoggedIn ? (
    <div className="min-h-screen bg-gray-50 py-6 px-4">
      <div className="max-w-7xl mx-auto">
        {loading ? (
          <div className="bg-white rounded-lg shadow-sm p-8 flex justify-center items-center">
            <div className="flex flex-col items-center space-y-4">
              <div className="h-12 w-12 rounded-full border-t-2 border-b-2 border-blue-600 animate-spin"></div>
              <p className="text-sm font-medium text-gray-500">Loading your teaching schedule...</p>
            </div>
          </div>
        ) : routines.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-50">
              <svg className="h-8 w-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
            </div>
            <h3 className="mt-4 text-lg font-medium text-gray-900">No Schedule Available</h3>
            <p className="mt-2 text-sm text-gray-500 max-w-md mx-auto">
              Your teaching schedule has not been assigned yet. Please check back later or contact the administration.
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm">
            {/* Header - Save Changes Button Removed */}
            <div className="p-4 flex items-center border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                  </svg>
                </div>
                <div>
                  <h2 className="text-lg font-medium text-gray-900">Teaching Schedule</h2>
                  <p className="text-sm text-gray-500">Your weekly class routines</p>
                </div>
              </div>
            </div>

            {/* Schedule Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="w-20 py-3 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Day</th>
                    {periods.map((period, index) => (
                      <th 
                        key={period}
                        className="py-3 px-3 text-center text-xs font-medium text-blue-600 uppercase"
                      >
                        Period {index + 1}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {routines.map((routine) =>
                    days.map(({ name, color }) => (
                      <tr key={name} className="border-b border-gray-100">
                        <td className={`py-3 px-3 border-l-4 ${color}`}>
                          <span className="font-medium text-gray-800">{name}</span>
                        </td>
                        {periods.map((period) => {
                          const classInfo = routine.schedule[name][period];
                          const hasClass = classInfo.subject;
                          
                          return (
                            <td key={period} className="py-2 px-2">
                              <div className="border border-gray-200 rounded p-2 h-full min-h-[70px] text-sm">
                                {hasClass ? (
                                  <>
                                    <div className="font-medium text-gray-800">{classInfo.subject}</div>
                                    <div className="text-xs text-gray-500 mt-1">Class {classInfo.class_ko_name}</div>
                                  </>
                                ) : (
                                  <div className="text-gray-300 font-light h-full flex items-center justify-center">
                                    -
                                  </div>
                                )}
                              </div>
                            </td>
                          );
                        })}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            
            {/* Updated Info Section (replacing Quick Tips) */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex items-center space-x-2 mb-2">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <h3 className="font-medium text-gray-700">Schedule Information</h3>
              </div>
              <ul className="ml-7 space-y-1">
                <li className="text-sm text-gray-600 flex items-center">
                  <svg className="w-4 h-4 mr-1 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"></path>
                  </svg>
                  This is your official teaching schedule for the current term
                </li>
                <li className="text-sm text-gray-600 flex items-center">
                  <svg className="w-4 h-4 mr-1 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                  Schedule is maintained by the administration team
                </li>
                <li className="text-sm text-gray-600 flex items-center">
                  <svg className="w-4 h-4 mr-1 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  Contact the office for any schedule adjustments or conflicts
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  ) : (
    <NoAccess />
  );
};

export default RoutineSee;