import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const TeacherAlerts = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [teacherId, setTeacherId] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const noticesPerPage = 5;

  useEffect(() => {
    const fetchTeacherId = async () => {
      try {
        const storedEmail = localStorage.getItem('email');
        if (!storedEmail) {
          setError('Please log in to view your notices');
          setLoading(false);
          return;
        }

        const response = await axios.get('http://localhost:8000/getTeachers', {
          withCredentials: true
        });
        
        const teacher = response.data.find(t => t.email === storedEmail);
        if (teacher) {
          setTeacherId(teacher._id);
          fetchNotices(teacher._id);
        } else {
          setError('Teacher information not found. Please try logging in again.');
          setLoading(false);
        }
      } catch (error) {
        setError('Error fetching teacher information. Please try again.');
        setLoading(false);
      }
    };

    fetchTeacherId();
  }, []);

  const fetchNotices = async (id) => {
    try {
      const response = await axios.get(`http://localhost:8000/teacher-alerts?teacherId=${id}`, {
        withCredentials: true
      });
      setNotices(response.data);
      setLoading(false);
    } catch (error) {
      setError('Failed to fetch notices');
      setLoading(false);
    }
  };

  // Get paginated notices for the current page
  const getPaginatedNotices = () => {
    const indexOfLastNotice = currentPage * noticesPerPage;
    const indexOfFirstNotice = indexOfLastNotice - noticesPerPage;
    return notices.slice(indexOfFirstNotice, indexOfLastNotice);
  };

  // Get total number of pages
  const getTotalPages = () => {
    return Math.ceil(notices.length / noticesPerPage);
  };

  // Handle navigation between pages
  const handleNextPage = () => {
    if (currentPage < getTotalPages()) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f3f2ef] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f3f2ef] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
          <div className="p-5 border-b border-gray-100 bg-gradient-to-r from-white to-blue-50">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg mr-3 shadow-sm">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">My Notices</h2>
                  <p className="text-sm text-gray-500">Review your submitted announcements</p>
                </div>
              </div>
              {notices.length > 0 && (
                <span className="text-sm font-medium px-3 py-1 bg-blue-50 text-blue-700 rounded-full shadow-sm border border-blue-100">
                  Showing {currentPage === getTotalPages() && notices.length % noticesPerPage !== 0 
                    ? (currentPage - 1) * noticesPerPage + 1 + ' - ' + notices.length 
                    : (currentPage - 1) * noticesPerPage + 1 + ' - ' + currentPage * noticesPerPage
                  } of {notices.length}
                </span>
              )}
            </div>
          </div>
          
          <div className="p-6">
          
          {error && (
            <div className="bg-red-50 text-red-700 p-4 rounded-md mb-4 border border-red-100">
              {error}
            </div>
          )}

          {notices.length === 0 ? (
            <div className="text-center py-8">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No notices</h3>
              <p className="mt-1 text-sm text-gray-500">You haven't submitted any notices yet.</p>
            </div>
          ) : (
            <div>
            <div className="space-y-4">
                {getPaginatedNotices().map((notice) => (
                <div
                  key={notice._id}
                    className="bg-white rounded-lg shadow-md border border-gray-100 p-5 hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex justify-between items-start">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800">{notice.subject}</h3>
                      <p className="mt-1 text-sm text-gray-500">{formatDate(notice.createdAt)}</p>
                    </div>
                      <span className={`px-3 py-1 text-xs font-medium rounded-full shadow-sm ${
                        notice.status === 'pending' ? 'bg-yellow-100 text-yellow-700 border border-yellow-200' :
                        notice.status === 'approved' ? 'bg-green-100 text-green-700 border border-green-200' :
                        'bg-red-100 text-red-700 border border-red-200'
                    }`}>
                      {notice.status.charAt(0).toUpperCase() + notice.status.slice(1)}
                    </span>
                    </div>
                    <div className="mt-4 pt-3 border-t border-gray-100">
                      <p className="text-sm text-gray-600 whitespace-pre-wrap leading-relaxed">{notice.message}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination Controls */}
              {notices.length > noticesPerPage && (
                <div className="mt-6 flex items-center justify-center">
                  <div className="flex items-center bg-white rounded-full shadow-md border border-gray-100 px-2 py-1.5 select-none">
                    <button 
                      onClick={handlePrevPage} 
                      disabled={currentPage === 1}
                      className={`p-2 rounded-full transition-all duration-200 ${
                        currentPage === 1 
                          ? 'text-gray-300 cursor-not-allowed' 
                          : 'text-blue-600 hover:bg-blue-50 active:bg-blue-100'
                      }`}
                      aria-label="Previous Page"
                    >
                      <FaChevronLeft size={14} />
                    </button>
                    <div className="px-4 font-medium text-gray-700">
                      Page {currentPage} of {getTotalPages()}
                    </div>
                    <button 
                      onClick={handleNextPage} 
                      disabled={currentPage === getTotalPages()}
                      className={`p-2 rounded-full transition-all duration-200 ${
                        currentPage === getTotalPages() 
                          ? 'text-gray-300 cursor-not-allowed' 
                          : 'text-blue-600 hover:bg-blue-50 active:bg-blue-100'
                      }`}
                      aria-label="Next Page"
                    >
                      <FaChevronRight size={14} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      </div>

      {/* Add CSS animations */}
      <style jsx>{`
        .slide-left {
          animation: slideLeft 0.3s ease-out;
        }

        .slide-right {
          animation: slideRight 0.3s ease-out;
        }

        @keyframes slideLeft {
          0% {
            opacity: 1;
            transform: translateX(0);
          }
          50% {
            opacity: 0.5;
            transform: translateX(-20px);
          }
          100% {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideRight {
          0% {
            opacity: 1;
            transform: translateX(0);
          }
          50% {
            opacity: 0.5;
            transform: translateX(20px);
          }
          100% {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
};

export default TeacherAlerts; 