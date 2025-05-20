import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, Slide } from 'react-toastify';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { getApiUrl } from "../../config/api";

const Notice = () => {
  const teacherLoggedIn = document.cookie.includes("teacherToken");
  const adminLoggedIn = document.cookie.includes("adminToken");
  const studentLoggedIn = document.cookie.includes("studentToken");
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const noticesPerPage = 5;
  
  useEffect(() => {
    const renderNotices = async () => {
      let response = null;
      try {
        setLoading(true);
        if (!teacherLoggedIn && !adminLoggedIn && !studentLoggedIn) {
          response = await axios.get(getApiUrl("/get/notices"));
        } else if (teacherLoggedIn) {
          response = await axios.get(
            getApiUrl("/get/notices/teachers"),
            { withCredentials: true }
          );
        } else if (adminLoggedIn) {
          response = await axios.get(
            getApiUrl("/get/notices/admins"),
            { withCredentials: true }
          );
        } else {
          response = await axios.get(
            getApiUrl("/get/notices/students"),
            { withCredentials: true }
          );
        }
        
        // Sort notices by date (newest first)
        const sortedNotices = response.data.sort((a, b) => {
          const dateA = new Date(a.date || a.createdAt);
          const dateB = new Date(b.date || b.createdAt);
          return dateB - dateA;
        }); // Removed .reverse() to show most recent first
        console.log('Sorted Notices:', sortedNotices.map(n => n.date || n.createdAt));
        
        setNotices(sortedNotices);
        setLoading(false);
      } catch (error) {
        if (error.response) {
          toast.error(error.response.data);
        } else {
          toast.error(error.message);
        }
        setLoading(false);
      }
    };

    renderNotices();
  }, []);

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

  // Function to format date properly
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric',
      month: 'short', 
      day: 'numeric'
    });
  };
  
  // Improved helper function to ensure attachments are treated as an array
  const getAttachments = (attachments) => {
    if (!attachments) return [];
    if (Array.isArray(attachments)) return attachments;
    return [attachments]; // Convert single item to array if it's not already an array
  };
  
  // Helper function to get proper file URL
  const getFileUrl = (attachment) => {
    if (!attachment) return '#';
    
    try {
      if (typeof attachment === 'string') {
        if (attachment.includes('public/')) {
          return `${import.meta.env.VITE_API_URL}${attachment.split('public/')[1]}`;
        } else if (attachment.includes('/')) {
          return `${import.meta.env.VITE_API_URL}${attachment.split('/').slice(-2).join('/')}`;
        }
        return `${import.meta.env.VITE_API_URL}${attachment}`;
      }
      return `${import.meta.env.VITE_API_URL}uploads/${attachment}`;
    } catch (err) {
      console.error("Error parsing attachment URL:", err);
      return `${import.meta.env.VITE_API_URL}uploads/${attachment}`;
    }
  };
  
  // Helper function to get displayable file name
  const getFileName = (attachment) => {
    if (!attachment) return 'Attachment';
    
    try {
      if (typeof attachment === 'string') {
        if (attachment.includes('uploads/')) {
          return attachment.split('uploads/')[1];
        } else if (attachment.includes('/')) {
          return attachment.split('/').pop();
        }
        return attachment;
      }
      return 'Attachment';
    } catch (err) {
      console.error("Error parsing file name:", err);
      return 'Attachment';
    }
  };

  const handleDelete = (noticeId) => {
    toast.info(
      <div>
        Are you sure you want to delete this notice? This action cannot be undone.<br/>
        <button
          onClick={async () => {
            toast.dismiss();
            try {
              await axios.delete(getApiUrl(`/admin/delete/notice/${noticeId}`), { withCredentials: true });
              setNotices((prev) => prev.filter((n) => n._id !== noticeId));
              toast.success('Notice deleted successfully');
            } catch (error) {
              toast.error(error.response?.data?.message || 'Failed to delete notice');
            }
          }}
          className="mt-2 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-xs font-semibold"
        >
          Confirm Delete
        </button>
      </div>,
      { autoClose: false, closeOnClick: false, transition: Slide }
    );
  };

  return (
    <div className="min-h-screen bg-[#f3f2ef] py-8 px-4">
      {/* LinkedIn style main container */}
      <div className="max-w-2xl mx-auto">
        {/* Improved header section */}
        <div className="mb-5 bg-white rounded-xl shadow-md border border-gray-100 p-5 bg-gradient-to-r from-white to-blue-50">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg mr-3 shadow-sm">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
            </svg>
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-800">School Notices</h1>
                <p className="text-sm text-gray-500">Important announcements and updates</p>
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

        {/* LinkedIn style content feed */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-lg shadow-sm border border-[#e0e0e0] p-4">
                <div className="animate-pulse">
                  <div className="flex items-center space-x-3">
                    <div className="rounded-full bg-[#e0e0e0] h-10 w-10"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-[#e0e0e0] rounded w-1/4"></div>
                      <div className="h-3 bg-[#e0e0e0] rounded w-1/6"></div>
                    </div>
                  </div>
                  <div className="mt-4 space-y-2">
                    <div className="h-4 bg-[#e0e0e0] rounded w-3/4"></div>
                    <div className="h-4 bg-[#e0e0e0] rounded"></div>
                    <div className="h-4 bg-[#e0e0e0] rounded w-5/6"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : notices.length ? (
          <div>
            <div className="space-y-4">
              {getPaginatedNotices().map((notice) => (
                <div key={`${notice._id}-${notice.date || notice.createdAt}`} className="bg-white rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300">
                  {/* Notice header with improved styling */}
                  <div className="p-5">
                  <div className="flex items-start justify-between">
                    <div className="flex">
                        {/* Profile avatar with better gradient */}
                        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-sm">
                        {notice.adminName ? notice.adminName.charAt(0).toUpperCase() : "A"}
                      </div>
                        {/* Author info with improved typography */}
                      <div className="ml-3 flex-1">
                        <div className="flex flex-wrap items-center">
                          <h3 className="font-semibold text-[#191919]">{notice.adminName}</h3>
                          <span className="ml-2 text-xs text-[#666666]">• School Administrator</span>
                        </div>
                        <div className="flex items-center text-xs text-[#666666] mt-1">
                          <span>{formatDate(notice.date || notice.createdAt)}</span>
                          <span className="mx-1">•</span>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                            notice.noticecategory === "Exam" ? "bg-green-100 text-green-700" :
                            notice.noticecategory === "Event" ? "bg-purple-100 text-purple-700" :
                            notice.noticecategory === "Holiday" ? "bg-red-100 text-red-700" :
                            notice.noticecategory === "Important" ? "bg-yellow-100 text-yellow-700" :
                            "bg-blue-100 text-[#0a66c2]"
                          }`}>
                            {notice.noticecategory}
                          </span>
                        </div>
                      </div>
                    </div>
                      {/* Delete button with improved styling */}
                    {adminLoggedIn && (
                      <button
                        onClick={() => handleDelete(notice._id)}
                          className="ml-4 text-red-600 hover:text-white font-semibold text-xs px-3 py-1 rounded-full transition-all duration-200 border border-red-200 hover:border-red-600 bg-red-50 hover:bg-red-600"
                        title="Delete Notice"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                  
                    {/* Notice content with improved spacing and borders */}
                    <div className="mt-4 pt-3 border-t border-gray-100">
                      <h2 className="text-lg font-semibold text-gray-800 mb-2">{notice.noticetitle}</h2>
                      <div className="text-sm text-gray-600 whitespace-pre-line leading-relaxed">
                      {notice.noticedes}
                    </div>
                  </div>
                  
                    {/* Attachments with improved styling */}
                  {notice.attachments && (
                      <div className="mt-5 bg-gray-50 p-3 rounded-lg border border-gray-100">
                        <h4 className="text-xs font-medium text-gray-500 uppercase mb-2">Attachments</h4>
                      <div className="space-y-2">
                        {getAttachments(notice.attachments).map((attachment, index) => (
                          <a 
                            key={index} 
                            href={getFileUrl(attachment)}
                            target="_blank"
                            rel="noreferrer"
                              className="flex items-center p-2 bg-white rounded-md border border-gray-100 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 text-sm shadow-sm"
                          >
                              <svg className="w-5 h-5 text-blue-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"></path>
                            </svg>
                              <span className="text-gray-700 truncate">{getFileName(attachment)}</span>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
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
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-[#e0e0e0] p-6 text-center">
            <div className="mx-auto w-16 h-16 bg-[#f3f7fa] rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-[#0a66c2]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-[#191919] mb-2">No Notices Available</h2>
            <p className="text-[#666666]">Check back later for updates and announcements</p>
          </div>
        )}
      </div>

      {/* Add CSS animations */}
      <style>{`
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

export default Notice;