import { useState, useEffect, useRef } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';
import { getApiUrl } from "../../config/api";

const StaticCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [daysArray, setDaysArray] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [animation, setAnimation] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const noticesPerPage = 5;
  const dropdownRef = useRef(null);
  
  const teacherLoggedIn = document.cookie.includes("teacherToken");
  const adminLoggedIn = document.cookie.includes("adminToken");
  const studentLoggedIn = document.cookie.includes("studentToken");
  
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Get list of years (current year - 5 to current year + 5)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 11 }, (_, i) => currentYear - 5 + i);

  // Fetch notices when component mounts
  useEffect(() => {
    fetchNotices();
  }, []);
  
  // Regenerate calendar when current date or notices change
  useEffect(() => {
    generateCalendar();
  }, [currentDate, notices]);

  // Reset to page 1 when selecting a new date
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedDate]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Fetch notices from backend
  const fetchNotices = async () => {
    try {
      setLoading(true);
      let response = null;
      
      // Choose the appropriate endpoint based on user type
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
      
      // Process the notices to ensure consistent date handling
      const processedNotices = response.data.map(notice => {
        if (notice.date) {
          const date = new Date(notice.date);
          date.setHours(0, 0, 0, 0);
          return { ...notice, date };
        }
        return notice;
      });
      
      setNotices(processedNotices);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching notices:", error);
      if (error.response) {
        toast.error(error.response.data);
      } else {
        toast.error("Failed to load notices. Please try again later.");
      }
      setLoading(false);
    }
  };

  // Format date to string in UTC
  const formatDateToStringUTC = (date) => {
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const day = String(date.getUTCDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Match notices to dates in the calendar using UTC
  const getNoticesForDate = (date) => {
    if (!date || notices.length === 0) return [];
    const dateString = formatDateToStringUTC(date);
    return notices.filter(notice => {
      if (!notice.date) return false;
      const noticeDate = new Date(notice.date);
      const noticeDateString = formatDateToStringUTC(noticeDate);
      return noticeDateString === dateString;
    });
  };

  // Get paginated notices for the selected date
  const getPaginatedNotices = () => {
    const allNotices = selectedDate ? getNoticesForDate(selectedDate) : [];
    const indexOfLastNotice = currentPage * noticesPerPage;
    const indexOfFirstNotice = indexOfLastNotice - noticesPerPage;
    return allNotices.slice(indexOfFirstNotice, indexOfLastNotice);
  };

  // Get total number of pages
  const getTotalPages = () => {
    const allNotices = selectedDate ? getNoticesForDate(selectedDate) : [];
    return Math.ceil(allNotices.length / noticesPerPage);
  };

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

  const handleDayClick = (date) => {
    setSelectedDate(date);
    setCurrentPage(1); // Reset to first page when selecting a new date
  };

  const generateCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    // First day of the month
    const firstDay = new Date(year, month, 1);
    // Last day of the month
    const lastDay = new Date(year, month + 1, 0);
    
    // Get the day of the week for the first day (0-6)
    const startDayIndex = firstDay.getDay();
    // Get the total days in the month
    const totalDays = lastDay.getDate();
    
    // Create an array to store all calendar cells
    const calendarArray = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startDayIndex; i++) {
      calendarArray.push({
        day: '',
        date: null,
        isCurrentMonth: false
      });
    }
    
    // Add cells for each day of the month
    for (let i = 1; i <= totalDays; i++) {
      const date = new Date(year, month, i);
      const dateNotices = getNoticesForDate(date);
      
      calendarArray.push({
        day: i,
        date: date,
        isCurrentMonth: true,
        isSaturday: date.getDay() === 6, // Check if the day is a Saturday
        isToday: isSameDay(date, new Date()),
        notices: dateNotices,
        hasImportantNotice: dateNotices.some(notice => notice.noticecategory === "Important"),
        hasRegularNotice: dateNotices.some(notice => notice.noticecategory !== "Important")
      });
    }
    
    // Add empty cells to complete the last row if needed
    const remainingCells = 7 - (calendarArray.length % 7);
    if (remainingCells < 7) {
      for (let i = 0; i < remainingCells; i++) {
        calendarArray.push({
          day: '',
          date: null,
          isCurrentMonth: false
        });
      }
    }
    
    setDaysArray(calendarArray);
  };

  // Helper to check if two dates are the same day
  const isSameDay = (date1, date2) => {
    return date1.getDate() === date2.getDate() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getFullYear() === date2.getFullYear();
  };

  const handlePrevMonth = () => {
    setAnimation('slide-right');
    setTimeout(() => {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
      setAnimation('');
    }, 150);
  };

  const handleNextMonth = () => {
    setAnimation('slide-left');
    setTimeout(() => {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
      setAnimation('');
    }, 150);
  };

  const handleToday = () => {
    setAnimation('fade');
    setTimeout(() => {
      setCurrentDate(new Date());
      setAnimation('');
    }, 150);
  };

  const handleMonthSelect = (monthIndex) => {
    setAnimation('fade');
    setTimeout(() => {
      setCurrentDate(new Date(currentDate.getFullYear(), monthIndex, 1));
      setAnimation('');
    }, 150);
    setShowDropdown(false);
  };

  const handleYearSelect = (year) => {
    setAnimation('fade');
    setTimeout(() => {
      setCurrentDate(new Date(year, currentDate.getMonth(), 1));
      setAnimation('');
    }, 150);
    setShowDropdown(false);
  };

  const formatSelectedDate = (date) => {
    if (!date) return '';
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    return `${day} ${month}, ${year}`;
  };

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric',
      month: 'short', 
      day: 'numeric'
    });
  };

  // Get attachments as an array 
  const getAttachments = (attachments) => {
    if (!attachments) return [];
    if (Array.isArray(attachments)) return attachments;
    return [attachments];
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

  // Get all notices for the selected date
  const selectedDateNotices = selectedDate ? getNoticesForDate(selectedDate) : [];
  
  // Get paginated notices for display
  const paginatedNotices = getPaginatedNotices();
  
  // Get total pages
  const totalPages = getTotalPages();

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden backdrop-blur-sm transition-all duration-300 hover:shadow-xl">
        {/* Calendar Header - Modern Gradient Background */}
        <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-gradient-to-r from-white to-gray-50">
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center text-xl font-semibold text-gray-800 hover:text-blue-600 transition-all duration-300 bg-white px-4 py-2 rounded-lg hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-200 shadow-sm"
            >
              <span>{months[currentDate.getMonth()]} {currentDate.getFullYear()}</span>
              <svg 
                className={`w-4 h-4 ml-2 text-blue-500 transition-transform duration-300 ${showDropdown ? 'rotate-180' : ''}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Dropdown for month/year selection */}
            {showDropdown && (
              <div className="absolute z-10 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-100 overflow-hidden animate-fade-in-down">
                <div className="p-3 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-white">
                  <div className="font-medium text-gray-700 mb-2">Select Month</div>
                  <div className="grid grid-cols-3 gap-1">
                    {months.map((month, index) => (
                      <button
                        key={month}
                        className={`text-sm px-2 py-1.5 rounded-md transition-all duration-200 ${
                          currentDate.getMonth() === index 
                            ? 'bg-blue-500 text-white font-medium shadow-sm' 
                            : 'hover:bg-blue-100 text-gray-700 hover:text-blue-600'
                        }`}
                        onClick={() => handleMonthSelect(index)}
                      >
                        {month.substring(0, 3)}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="p-3 bg-gradient-to-r from-white to-blue-50">
                  <div className="font-medium text-gray-700 mb-2">Select Year</div>
                  <div className="grid grid-cols-4 gap-1">
                    {years.map(year => (
                      <button
                        key={year}
                        className={`text-sm px-2 py-1.5 rounded-md transition-all duration-200 ${
                          currentDate.getFullYear() === year 
                            ? 'bg-blue-500 text-white font-medium shadow-sm' 
                            : 'hover:bg-blue-100 text-gray-700 hover:text-blue-600'
                        }`}
                        onClick={() => handleYearSelect(year)}
                      >
                        {year}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="flex items-center space-x-3">
            <button 
              onClick={handleToday}
              className="px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 text-sm font-medium rounded-lg transition-all duration-200 shadow-sm hover:shadow focus:ring-2 focus:ring-blue-200 focus:outline-none"
            >
              Today
            </button>
            <div className="flex items-center space-x-2 bg-gray-50 p-1 rounded-lg shadow-sm">
              <button 
                onClick={handlePrevMonth}
                className="p-2 rounded-md hover:bg-white text-gray-600 hover:text-blue-600 transition-all duration-200"
              >
                <FaChevronLeft size={14} />
              </button>
              <button 
                onClick={handleNextMonth}
                className="p-2 rounded-md hover:bg-white text-gray-600 hover:text-blue-600 transition-all duration-200"
              >
                <FaChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>
        
        {/* Day names - with subtle gradient */}
        <div className="grid grid-cols-7 text-sm font-medium text-gray-700 bg-gradient-to-r from-gray-50 to-white">
          {days.map((day, index) => (
            <div key={index} className={`py-3 text-center border-b border-gray-200 ${index === 6 ? 'text-red-500' : ''}`}>
              {day.substring(0, 3)}
            </div>
          ))}
        </div>

        {/* Calendar grid with animation */}
        <div className={`grid grid-cols-7 text-sm ${animation}`}>
          {daysArray.map((dateObj, index) => (
            <div 
              key={index} 
              className={`
                relative h-28 p-2 border border-gray-100 transition-all duration-200
                ${!dateObj.isCurrentMonth ? 'bg-gray-50/50' : 'hover:bg-blue-50/30 cursor-pointer'}
                ${dateObj.isToday ? 'bg-blue-50/70' : ''}
                ${selectedDate && dateObj.date && isSameDay(selectedDate, dateObj.date) ? 'ring-2 ring-blue-500 ring-inset' : ''}
              `}
              onClick={() => dateObj.date && handleDayClick(dateObj.date)}
            >
              {dateObj.day && (
                <>
                  <div 
                    className={`
                      font-medium p-1 rounded-full w-8 h-8 flex items-center justify-center ml-auto
                      transition-all duration-200 hover:scale-110
                      ${dateObj.isSaturday ? 'text-red-500' : 'text-gray-700'}
                      ${dateObj.isToday ? 'bg-blue-500 text-white shadow-md' : 'hover:bg-gray-100'}
                    `}
                  >
                    {dateObj.day}
                  </div>
                  
                  {/* Notice indicator dots */}
                  {dateObj.notices && dateObj.notices.length > 0 && (
                    <div className="mt-1 flex justify-end">
                      <div className="flex items-center space-x-1">
                        {dateObj.hasImportantNotice && (
                          <div className="w-2 h-2 rounded-full bg-red-500 shadow-sm"></div>
                        )}
                        {dateObj.hasRegularNotice && (
                          <div className="w-2 h-2 rounded-full bg-blue-500 shadow-sm"></div>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {dateObj.isToday && (
                    <div className="absolute bottom-2 left-2 text-xs font-medium text-blue-500">
                      Today
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      </div>
      
      {/* Legend with modern styling */}
      <div className="mt-4 flex items-center justify-end text-sm text-gray-600">
        <div className="flex items-center mr-4">
          <div className="w-3 h-3 rounded-full bg-red-500 mr-1 shadow-sm"></div>
          <span>Saturdays</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-blue-500 mr-1 shadow-sm"></div>
          <span>Today</span>
        </div>
        <div className="ml-4 flex items-center mr-4">
          <div className="w-3 h-3 rounded-full bg-blue-500 mr-1"></div>
          <span>Regular Notice</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-red-500 mr-1"></div>
          <span>Important Notice</span>
        </div>
      </div>

      {/* Notices Section for Selected Date */}
      <div className="mt-6">
        {loading ? (
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
            <div className="animate-pulse space-y-4">
              <div className="h-6 bg-gray-200 rounded w-1/3"></div>
              <div className="space-y-3">
                <div className="h-24 bg-gray-200 rounded"></div>
                <div className="h-24 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        ) : selectedDate ? (
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden animate-fade-in">
            <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-white flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-800">
                Notices for {formatSelectedDate(selectedDate)}
              </h3>
              {selectedDateNotices.length > 0 && (
                <span className="text-sm text-gray-500">
                  Showing {currentPage === totalPages && selectedDateNotices.length % noticesPerPage !== 0 
                    ? (currentPage - 1) * noticesPerPage + 1 + ' - ' + selectedDateNotices.length 
                    : (currentPage - 1) * noticesPerPage + 1 + ' - ' + currentPage * noticesPerPage
                  } of {selectedDateNotices.length} notices
                </span>
              )}
            </div>
            
            <div className="p-4">
              {selectedDateNotices.length > 0 ? (
                <>
                  <div className="space-y-4">
                    {paginatedNotices.map(notice => (
                      <div 
                        key={notice._id}
                        className={`p-4 rounded-lg shadow-sm border-l-4 ${
                          notice.noticecategory === "Important" 
                            ? 'border-red-500 bg-red-50' 
                            : 'border-blue-500 bg-blue-50'
                        }`}
                      >
                        <div className="flex items-start">
                          <div className={`w-3 h-3 rounded-full mt-1.5 mr-3 flex-shrink-0 ${
                            notice.noticecategory === "Important" ? 'bg-red-500' : 'bg-blue-500'
                          }`}></div>
                          <div className="flex-1">
                            <div className="flex flex-wrap items-center justify-between">
                              <h4 className={`font-medium ${
                                notice.noticecategory === "Important" ? 'text-red-800' : 'text-blue-800'
                              }`}>
                                {notice.noticetitle}
                              </h4>
                              <span className="text-xs text-gray-500">
                                {formatDate(notice.date || notice.createdAt)}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 mt-2 whitespace-pre-line">
                              {notice.noticedes}
                            </p>
                            <div className="flex items-center justify-between mt-3">
                              <div className="text-xs font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">
                                {notice.noticecategory}
                              </div>
                              {notice.attachments && (
                                <div className="flex items-center space-x-2">
                                  {getAttachments(notice.attachments).map((attachment, index) => (
                                    <a 
                                      key={index} 
                                      href={getFileUrl(attachment)}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="flex items-center text-xs font-medium text-blue-600 hover:text-blue-800"
                                    >
                                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"></path>
                                      </svg>
                                      Attachment {index + 1}
                                    </a>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Pagination Controls */}
                  {totalPages > 1 && (
                    <div className="mt-6 flex items-center justify-center">
                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={handlePrevPage} 
                          disabled={currentPage === 1}
                          className={`p-2 rounded-lg border ${
                            currentPage === 1 
                              ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                              : 'bg-white text-blue-600 hover:bg-blue-50'
                          } transition-colors`}
                          aria-label="Previous Page"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                          </svg>
                        </button>
                        <span className="px-3 py-1 text-sm font-medium text-gray-700">
                          Page {currentPage} of {totalPages}
                        </span>
                        <button 
                          onClick={handleNextPage} 
                          disabled={currentPage === totalPages}
                          className={`p-2 rounded-lg border ${
                            currentPage === totalPages 
                              ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                              : 'bg-white text-blue-600 hover:bg-blue-50'
                          } transition-colors`}
                          aria-label="Next Page"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-10 text-gray-500">
                  <p>No notices for this date</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8 text-center text-gray-500">
            <p>Click on a date to view notices</p>
          </div>
        )}
      </div>

      {/* Add CSS animations */}
      <style>{`
        .animate-fade-in-down {
          animation: fadeInDown 0.3s ease-out forwards;
        }

        .animate-fade-in {
          animation: fadeIn 0.2s ease-out forwards;
        }

        .animate-slide-up {
          animation: slideUp 0.3s ease-out forwards;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .slide-left {
          animation: slideLeft 0.3s ease-out;
        }

        .slide-right {
          animation: slideRight 0.3s ease-out;
        }

        .fade {
          animation: fade 0.3s ease-out;
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

        @keyframes fade {
          0% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
          100% {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default StaticCalendar; 