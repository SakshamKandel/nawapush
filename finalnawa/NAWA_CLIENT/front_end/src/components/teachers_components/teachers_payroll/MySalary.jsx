import React, { useEffect, useState } from "react";
import axios from "axios";

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

const MySalary = () => {
  const [salaryRecord, setSalaryRecord] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSalary = async () => {
      setIsLoading(true);
      setError("");
      try {
        const res = await axios.get("http://localhost:8000/api/teacher-payroll/mine", { withCredentials: true });
        setSalaryRecord(res.data);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSalary();
  }, []);

  return (
    <div className="min-h-screen bg-[#f3f2ef] font-sans py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 bg-white rounded-lg shadow-sm p-6">
          <h1 className="text-2xl font-semibold text-[#191919]">My Salary Records</h1>
          <p className="text-[#666666] mt-1">View your monthly salary and allowance details</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          {isLoading ? (
            <div className="flex flex-col items-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#0a66c2]"></div>
              <p className="mt-4 text-[#666666]">Loading salary data...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-[#666666]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
              <h3 className="mt-3 text-lg font-medium text-[#191919]">{error}</h3>
            </div>
          ) : salaryRecord ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {months.map((month) => {
                const monthData = salaryRecord.records[month];
                const totalSalary = monthData ? monthData.salary + monthData.allowance : 0;
                return (
                  <div key={month} className="border border-[#e0e0e0] rounded-lg hover:shadow-md transition-shadow duration-200">
                    <div className="px-4 py-3 border-b border-[#e0e0e0] flex justify-between items-center bg-[#f8f8f8]">
                      <span className="font-medium text-[#191919]">{month}</span>
                      {monthData?.status === 'paid' ? (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-[#e0f7e9] text-[#0a8a43]">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#0a8a43] mr-1.5"></span>
                          Paid
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-[#fff3cd] text-[#b8860b]">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#b8860b] mr-1.5"></span>
                          Pending
                        </span>
                      )}
                    </div>
                    <div className="p-4">
                      <div className="mb-3">
                        <p className="text-sm text-[#666666]">Total Amount</p>
                        <p className="text-xl font-semibold text-[#191919] mt-1">
                          {totalSalary > 0 ? `Rs. ${totalSalary.toLocaleString()}` : 'Not Processed'}
                        </p>
                      </div>
                      {monthData?.remarks && (
                        <div className="bg-[#f3f2ef] p-2 rounded text-sm text-[#666666]">
                          <span className="font-medium text-[#191919]">Remarks:</span> {monthData.remarks}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-[#666666]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
              <h3 className="mt-3 text-lg font-medium text-[#191919]">No salary records found</h3>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MySalary; 