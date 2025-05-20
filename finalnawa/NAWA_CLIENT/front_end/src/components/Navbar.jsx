import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaGraduationCap, FaMoneyBillWave, FaHistory, FaArchive, FaCalendarAlt } from 'react-icons/fa';
import { getApiUrl } from "../config/api";

const Navbar = () => {
  const location = useLocation();
  const teacherLoggedIn = document.cookie.includes("teacherToken");
  const adminLoggedIn = document.cookie.includes("adminToken");
  const studentLoggedIn = document.cookie.includes("studentToken");
  const navigate = useNavigate();
  const [showDropDown, setshowDropDown] = useState(false);
  const [showAdminMenu, setShowAdminMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileAccountDropdown, setMobileAccountDropdown] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = async () => {
    try {
      setShowLogoutModal(false);
      const response = await axios.post(
        getApiUrl("/logout"),
        {},
        { withCredentials: true }
      );
      toast.success(response.data || "Logged out successfully!");
      localStorage.clear();
      navigate("/");
      window.location.reload();
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data || "Logout failed!");
      } else {
        toast.error(error.message || "Logout failed!");
      }
    }
  };

  // Close dropdowns when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (showDropDown || showAdminMenu) {
        if (!event.target.closest('.dropdown-container')) {
          setshowDropDown(false);
          setShowAdminMenu(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDropDown, showAdminMenu]);

  // Utility for relative time
  function timeAgo(date) {
    const now = new Date();
    const seconds = Math.floor((now - new Date(date)) / 1000);
    if (seconds < 60) return 'just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} min${minutes > 1 ? 's' : ''} ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hr${hours > 1 ? 's' : ''} ago`;
    const days = Math.floor(hours / 24);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  }

  return (
    <div className="relative">
      <nav className="bg-white fixed w-full z-[9999] top-0 start-0 border-b border-gray-200 shadow-sm">
        <div className="max-w-screen-2xl flex items-center justify-between mx-auto px-4 sm:px-6 lg:px-8 py-2">
          <Link
            to="/"
            className="flex items-center space-x-3 rtl:space-x-reverse group"
          >
            <div className="bg-white rounded-md p-0.5 transition-all duration-300">
              <img
                src="/school_logo.png"
                className="h-18 w-auto filter drop-shadow-sm transition-all duration-300 group-hover:scale-105"
                alt="School Logo"
                style={{ height: "4.5rem" }}
              />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div
            className="hidden md:flex md:items-center md:gap-1"
            id="navbar-sticky"
          >
            <ul className="flex items-center gap-1">
              {/* Essential links that always show */}
              <li>
                <Link
                  to="/"
                  className={`inline-block px-3 py-2 rounded-md text-sm font-medium relative group ${
                    location.pathname === "/"
                      ? "text-gray-900 bg-gray-100"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  } transition-all duration-200`}
                  aria-current="page"
                >
                  HOME
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gray-300 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                </Link>
              </li>
              <li>
                <Link
                  to="/about-us"
                  className={`inline-block px-3 py-2 rounded-md text-sm font-medium relative group ${
                    location.pathname === "/about-us"
                      ? "text-gray-900 bg-gray-100"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  } transition-all duration-200`}
                >
                  ABOUT US
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gray-300 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                </Link>
              </li>
              <li>
                <Link
                  to="/notice"
                  className={`inline-block px-3 py-2 rounded-md text-sm font-medium relative group ${
                    location.pathname === "/notice"
                      ? "text-gray-900 bg-gray-100"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  } transition-all duration-200`}
                >
                  NOTICE
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gray-300 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                </Link>
              </li>
              <li>
                <Link
                  to="/contact-us"
                  className={`inline-block px-3 py-2 rounded-md text-sm font-medium relative group ${
                    location.pathname === "/contact-us"
                      ? "text-gray-900 bg-gray-100"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  } transition-all duration-200`}
                >
                  CONTACT US
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gray-300 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                </Link>
              </li>

              {/* Static Calendar Link - Visible to all users */}
              <li>
                <Link
                  to="/static-calendar"
                  className={`inline-block px-3 py-2 rounded-md text-sm font-medium relative group ${
                    location.pathname === "/static-calendar"
                      ? "text-gray-900 bg-gray-100"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  } transition-all duration-200 flex items-center`}
                >
                  CALENDAR
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gray-300 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                </Link>
              </li>

              {/* Teacher specific links - Kept as is */}
              {teacherLoggedIn && (
                <>
                  <li>
                    <Link
                      to="/routine"
                      className={`inline-block px-3 py-2 rounded-md text-sm font-medium relative group ${
                        location.pathname === "/routine"
                          ? "text-gray-900 bg-gray-100"
                          : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                      } transition-all duration-200`}
                    >
                      ROUTINE
                      <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gray-300 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/fetch-students"
                      className={`inline-block px-3 py-2 rounded-md text-sm font-medium relative group ${
                        location.pathname === "/fetch-students"
                          ? "text-gray-900 bg-gray-100"
                          : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                      } transition-all duration-200`}
                    >
                      STUDENTS
                      <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gray-300 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/my-salary"
                      className={`inline-block px-3 py-2 rounded-md text-sm font-medium relative group ${
                        location.pathname === "/my-salary"
                          ? "text-gray-900 bg-gray-100"
                          : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                      } transition-all duration-200`}
                    >
                      MY SALARY
                      <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gray-300 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/submit-notice"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Post Announcement
                    </Link>
                  </li>
                </>
              )}

              {/* Admin Menu Dropdown - Click activated */}
              {adminLoggedIn && (
                <li className="relative dropdown-container">
                  <button
                    onClick={() => {
                      setShowAdminMenu(!showAdminMenu);
                      setshowDropDown(false);
                    }}
                    className={`inline-flex items-center px-3 py-2 rounded-md text-sm font-medium relative group ${
                      ["/routines", "/create-notice", "/view-teachers-payroll", "/fetch-students"].includes(location.pathname)
                        ? "text-gray-900 bg-gray-100"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    } transition-all duration-200 cursor-pointer`}
                  >
                    ADMIN PANEL
                    <svg
                      className={`ml-1 h-4 w-4 transform transition-transform duration-300 ${
                        showAdminMenu ? "rotate-180" : ""
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      ></path>
                    </svg>
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gray-300 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                  </button>
                  
                  {/* Admin dropdown menu */}
                  {showAdminMenu && (
                    <div className="absolute top-full right-0 mt-1 bg-white divide-y divide-gray-100 rounded-lg shadow-lg w-60 z-50 border border-gray-200 overflow-hidden">
                      <ul className="py-1">
                        <li>
                          <Link
                            to="/routines"
                            className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors duration-150"
                          >
                            <svg
                              className="w-5 h-5 mr-2 text-gray-900"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                              ></path>
                            </svg>
                            Routines
                          </Link>
                        </li>
                        <li>
                          <Link
                            to="/create-notice"
                            className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors duration-150"
                          >
                            <svg
                              className="w-5 h-5 mr-2 text-gray-900"
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
                              ></path>
                            </svg>
                            Notice Board
                          </Link>
                        </li>
                        <li>
                          <Link
                            to="/fetch-students"
                            className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors duration-150"
                          >
                            <svg
                              className="w-5 h-5 mr-2 text-gray-900"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                              ></path>
                            </svg>
                            Students
                          </Link>
                        </li>
                        <li>
                          <Link
                            to="/view-teachers-payroll"
                            className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors duration-150"
                          >
                            <svg
                              className="w-5 h-5 mr-2 text-gray-900"
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
                              ></path>
                            </svg>
                            Teachers Payroll
                          </Link>
                        </li>
                        <li>
                          <Link
                            to="/admin/teacher-notices"
                            className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors duration-150"
                          >
                            <svg
                              className="w-5 h-5 mr-2 text-gray-900"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                              />
                            </svg>
                            Teacher Alerts
                          </Link>
                        </li>
                        <li>
                          <Link
                            to="/admin/remove-teacher"
                            className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors duration-150"
                          >
                            <svg
                              className="w-5 h-5 mr-2 text-red-500"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M6 18L18 6M6 6l12 12"
                              ></path>
                            </svg>
                            Remove Teacher
                          </Link>
                        </li>
                        <li>
                          <Link
                            to="/admin/year-end"
                            className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors duration-150"
                          >
                            <FaCalendarAlt className="w-5 h-5 mr-2 text-gray-900" />
                            Year-End Management
                          </Link>
                        </li>
                      </ul>
                    </div>
                  )}
                </li>
              )}
              
              {/* Create Account Dropdown - Now click activated */}
              {adminLoggedIn && (
                <li className="relative dropdown-container">
                  <button
                    onClick={() => {
                      setshowDropDown(!showDropDown);
                      setShowAdminMenu(false);
                    }}
                    className={`inline-flex items-center px-3 py-2 rounded-md text-sm font-medium relative group ${
                      location.pathname === "/create-account-teacher" ||
                      location.pathname === "/create-account-student" ||
                      location.pathname === "/create-account-admin"
                        ? "text-gray-900 bg-gray-100"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    } transition-all duration-200 cursor-pointer`}
                  >
                    CREATE ACCOUNT
                    <svg
                      className={`ml-1 h-4 w-4 transform transition-transform duration-300 ${
                        showDropDown ? "rotate-180" : ""
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      ></path>
                    </svg>
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gray-300 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                  </button>
                  
                  {showDropDown && (
                    <div
                      id="dropdownDelay"
                      className="absolute top-full right-0 mt-1 bg-white divide-y divide-gray-100 rounded-lg shadow-lg w-60 z-50 border border-gray-200 overflow-hidden"
                    >
                      <ul className="py-1">
                        <li>
                          <Link
                            to="/create-account-teacher"
                            className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors duration-150"
                          >
                            <svg
                              className="w-5 h-5 mr-2 text-gray-900"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                              ></path>
                            </svg>
                            Create Teacher
                          </Link>
                        </li>
                        <li>
                          <Link
                            to="/create-account-student"
                            className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors duration-150"
                          >
                            <svg
                              className="w-5 h-5 mr-2 text-gray-900"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                              ></path>
                            </svg>
                            Create Student
                          </Link>
                        </li>
                        <li>
                          <Link
                            to="/create-account-admin"
                            className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors duration-150"
                          >
                            <svg
                              className="w-5 h-5 mr-2 text-gray-900"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                              ></path>
                            </svg>
                            Create Admin
                          </Link>
                        </li>
                      </ul>
                    </div>
                  )}
                </li>
              )}

              <li className="ml-2 border-l border-gray-200 pl-2">
                {!teacherLoggedIn && !studentLoggedIn && !adminLoggedIn ? (
                  <Link to={"/login-form"}>
                    <button
                      type="button"
                      className="inline-flex items-center justify-center px-4 py-1.5 text-sm font-medium text-white bg-gray-600 hover:bg-gray-700 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200"
                    >
                      <svg
                        className="w-4 h-4 mr-1.5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Login
                    </button>
                  </Link>
                ) : (
                  <button
                    type="button"
                    className="inline-flex items-center justify-center px-4 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-1 transition-all duration-200"
                    onClick={() => setShowLogoutModal(true)}
                  >
                    <svg
                      className="w-4 h-4 mr-1.5 text-gray-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M3 3a1 1 0 011 1v12a1 1 0 11-2 0V4a1 1 0 011-1zm7.707 3.293a1 1 0 010 1.414L9.414 9H17a1 1 0 110 2H9.414l1.293 1.293a1 1 0 01-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Logout
                  </button>
                )}
              </li>
            </ul>
          </div>

          {/* Mobile menu controls - visible only on mobile */}
          <div className="md:hidden flex items-center space-x-3 relative z-[9999]">
            {/* Login/Logout button */}
            {!teacherLoggedIn && !studentLoggedIn && !adminLoggedIn ? (
              <Link to={"/login-form"}>
                <button
                  type="button"
                  className="inline-flex items-center justify-center px-3.5 py-1.5 text-xs font-medium text-white bg-gray-600 hover:bg-gray-700 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200"
                >
                  <svg
                    className="w-3.5 h-3.5 mr-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Login
                </button>
              </Link>
            ) : (
              <button
                type="button"
                className="inline-flex items-center justify-center px-3.5 py-1.5 text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-1 transition-all duration-200"
                onClick={() => setShowLogoutModal(true)}
              >
                <svg
                  className="w-3.5 h-3.5 mr-1 text-gray-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 3a1 1 0 011 1v12a1 1 0 11-2 0V4a1 1 0 011-1zm7.707 3.293a1 1 0 010 1.414L9.414 9H17a1 1 0 110 2H9.414l1.293 1.293a1 1 0 01-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                Logout
              </button>
            )}

            {/* Mobile menu toggle button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              type="button"
              className="flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-gray-500"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {/* Icon when menu is closed */}
              <svg
                className={`${mobileMenuOpen ? "hidden" : "block"} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
              {/* Icon when menu is open */}
              <svg
                className={`${mobileMenuOpen ? "block" : "hidden"} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile navigation menu - White panel, transparent overlay */}
        <div
          className={`md:hidden fixed inset-y-0 right-0 w-[85%] max-w-sm bg-white shadow-xl z-[9990] transform transition-transform duration-300 ease-in-out ${
            mobileMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
          style={{ top: "4.7rem", height: "calc(100vh - 4.7rem)" }}
        >
          {/* User profile section (white background) */}
          <div className="px-4 py-3 bg-white border-b border-gray-200">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-medium text-lg">
                {(adminLoggedIn && "A") || (teacherLoggedIn && "T") || (studentLoggedIn && "S") || "G"}
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">
                  {(adminLoggedIn && "Admin") || (teacherLoggedIn && "Teacher") || (studentLoggedIn && "Student") || "Guest"}
                </p>
                <p className="text-xs text-gray-500">School Portal</p>
              </div>
            </div>
          </div>

          {/* Navigation links */}
          <div className="overflow-y-auto h-full">
            <nav className="flex flex-col divide-y divide-gray-200 bg-white">
              {/* Home */}
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center px-4 py-3 relative ${
                  location.pathname === "/"
                    ? "text-gray-900 bg-gray-50 font-medium"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                {location.pathname === "/" && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-gray-300"></div>
                )}
                <svg
                  className={`w-5 h-5 mr-3 ${
                    location.pathname === "/" ? "text-gray-900" : "text-gray-500"
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  ></path>
                </svg>
                Home
              </Link>

              {/* About Us */}
              <Link
                to="/about-us"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center px-4 py-3 relative ${
                  location.pathname === "/about-us"
                    ? "text-gray-900 bg-gray-50 font-medium"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                {location.pathname === "/about-us" && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-gray-300"></div>
                )}
                <svg
                  className={`w-5 h-5 mr-3 ${
                    location.pathname === "/about-us" ? "text-gray-900" : "text-gray-500"
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
                About Us
              </Link>

              {/* Notice */}
              <Link
                to="/notice"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center px-4 py-3 relative ${
                  location.pathname === "/notice"
                    ? "text-gray-900 bg-gray-50 font-medium"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                {location.pathname === "/notice" && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-gray-300"></div>
                )}
                <svg
                  className={`w-5 h-5 mr-3 ${
                    location.pathname === "/notice" ? "text-gray-900" : "text-gray-500"
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  ></path>
                </svg>
                Notice
              </Link>

              {/* Contact Us */}
              <Link
                to="/contact-us"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center px-4 py-3 relative ${
                  location.pathname === "/contact-us"
                    ? "text-gray-900 bg-gray-50 font-medium"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                {location.pathname === "/contact-us" && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-gray-300"></div>
                )}
                <svg
                  className={`w-5 h-5 mr-3 ${
                    location.pathname === "/contact-us" ? "text-gray-900" : "text-gray-500"
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  ></path>
                </svg>
                Contact Us
              </Link>

              {/* Static Calendar Link - Visible to all users */}
              <Link
                to="/static-calendar"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center px-4 py-3 relative ${
                  location.pathname === "/static-calendar"
                    ? "text-gray-900 bg-gray-50 font-medium"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                {location.pathname === "/static-calendar" && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-gray-300"></div>
                )}
                <span className={`w-5 h-5 mr-3 ${
                  location.pathname === "/static-calendar" ? "text-gray-900" : "text-gray-500"
                }`}></span>
                Calendar
              </Link>

              {/* Teacher specific links */}
              {teacherLoggedIn && (
                <>
                <Link
                  to="/routine"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center px-4 py-3 relative ${
                    location.pathname === "/routine"
                        ? "text-gray-900 bg-gray-50 font-medium"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {location.pathname === "/routine" && (
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gray-300"></div>
                  )}
                  <svg
                    className={`w-5 h-5 mr-3 ${
                        location.pathname === "/routine" ? "text-gray-900" : "text-gray-500"
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    ></path>
                  </svg>
                  Routine
                </Link>

                <Link
                  to="/fetch-students"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center px-4 py-3 relative ${
                    location.pathname === "/fetch-students"
                        ? "text-gray-900 bg-gray-50 font-medium"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {location.pathname === "/fetch-students" && (
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gray-300"></div>
                  )}
                  <svg
                    className={`w-5 h-5 mr-3 ${
                        location.pathname === "/fetch-students" ? "text-gray-900" : "text-gray-500"
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                    ></path>
                  </svg>
                  Students
                </Link>
                </>
              )}

              {/* Admin specific links */}
              {adminLoggedIn && (
                <>
                  <div className="py-2 px-4 bg-gray-50 border-t border-b border-gray-200">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Admin Management</p>
                  </div>
                  
                  <Link
                    to="/routines"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center px-4 py-3 relative ${
                      location.pathname === "/routines"
                        ? "text-gray-900 bg-gray-50 font-medium"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {location.pathname === "/routines" && (
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gray-300"></div>
                    )}
                    <svg
                      className={`w-5 h-5 mr-3 ${
                        location.pathname === "/routines" ? "text-gray-900" : "text-gray-500"
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                      ></path>
                    </svg>
                    Routines
                  </Link>
                  
                  <Link
                    to="/create-notice"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center px-4 py-3 relative ${
                      location.pathname === "/create-notice"
                        ? "text-gray-900 bg-gray-50 font-medium"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {location.pathname === "/create-notice" && (
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gray-300"></div>
                    )}
                    <svg
                      className={`w-5 h-5 mr-3 ${
                        location.pathname === "/create-notice" ? "text-gray-900" : "text-gray-500"
                      }`}
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
                      ></path>
                    </svg>
                    Notice Board
                  </Link>

                  <Link
                    to="/fetch-students"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center px-4 py-3 relative ${
                      location.pathname === "/fetch-students"
                        ? "text-gray-900 bg-gray-50 font-medium"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {location.pathname === "/fetch-students" && (
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gray-300"></div>
                    )}
                    <svg
                      className={`w-5 h-5 mr-3 ${
                        location.pathname === "/fetch-students" ? "text-gray-900" : "text-gray-500"
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                      ></path>
                    </svg>
                    Students
                  </Link>

                  <Link
                    to="/view-teachers-payroll"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center px-4 py-3 relative ${
                      location.pathname === "/view-teachers-payroll"
                        ? "text-gray-900 bg-gray-50 font-medium"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {location.pathname === "/view-teachers-payroll" && (
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gray-300"></div>
                    )}
                    <svg
                      className={`w-5 h-5 mr-3 ${
                        location.pathname === "/view-teachers-payroll" ? "text-gray-900" : "text-gray-500"
                      }`}
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
                      ></path>
                    </svg>
                    Teachers Payroll
                  </Link>

                  <Link
                    to="/admin/teacher-notices"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center px-4 py-3 relative ${
                      location.pathname === "/admin/teacher-notices"
                        ? "text-gray-900 bg-gray-50 font-medium"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {location.pathname === "/admin/teacher-notices" && (
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gray-300"></div>
                    )}
                    <svg
                      className={`w-5 h-5 mr-3 ${
                        location.pathname === "/admin/teacher-notices" ? "text-gray-900" : "text-gray-500"
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                      />
                    </svg>
                    Teacher Alerts
                  </Link>

                  <Link
                    to="/admin/remove-teacher"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center px-4 py-3 relative ${
                      location.pathname === "/admin/remove-teacher"
                        ? "text-gray-900 bg-gray-50 font-medium"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {location.pathname === "/admin/remove-teacher" && (
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gray-300"></div>
                    )}
                    <svg
                      className={`w-5 h-5 mr-3 text-red-500`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      ></path>
                    </svg>
                    Remove Teacher
                  </Link>

                  <Link
                    to="/admin/year-end"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center px-4 py-3 relative ${
                      location.pathname === "/admin/year-end"
                        ? "text-gray-900 bg-gray-50 font-medium"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {location.pathname === "/admin/year-end" && (
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gray-300"></div>
                    )}
                    <FaCalendarAlt className={`w-5 h-5 mr-3 ${
                      location.pathname === "/admin/year-end" ? "text-gray-900" : "text-gray-500"
                    }`} />
                    Year-End Management
                  </Link>

                  {/* Create Account Section */}
                  <div className="py-2 px-4 bg-gray-50 border-t border-b border-gray-200">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Create Account</p>
                  </div>

                  <Link
                    to="/create-account-teacher"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center px-4 py-3 relative ${
                      location.pathname === "/create-account-teacher"
                        ? "text-gray-900 bg-gray-50 font-medium"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {location.pathname === "/create-account-teacher" && (
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gray-300"></div>
                    )}
                    <svg
                      className={`w-5 h-5 mr-3 ${
                        location.pathname === "/create-account-teacher" ? "text-gray-900" : "text-gray-500"
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      ></path>
                    </svg>
                    Create Teacher
                  </Link>

                  <Link
                    to="/create-account-student"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center px-4 py-3 relative ${
                      location.pathname === "/create-account-student"
                        ? "text-gray-900 bg-gray-50 font-medium"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {location.pathname === "/create-account-student" && (
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gray-300"></div>
                    )}
                    <svg
                      className={`w-5 h-5 mr-3 ${
                        location.pathname === "/create-account-student" ? "text-gray-900" : "text-gray-500"
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                      ></path>
                    </svg>
                    Create Student
                  </Link>

                  <Link
                    to="/create-account-admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center px-4 py-3 relative ${
                      location.pathname === "/create-account-admin"
                        ? "text-gray-900 bg-gray-50 font-medium"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {location.pathname === "/create-account-admin" && (
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gray-300"></div>
                    )}
                    <svg
                      className={`w-5 h-5 mr-3 ${
                        location.pathname === "/create-account-admin" ? "text-gray-900" : "text-gray-500"
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      ></path>
                    </svg>
                    Create Admin
                  </Link>
                </>
              )}
            </nav>
          </div>
        </div>
      </nav>
      <div className="pt-20"></div> {/* Spacer for fixed navbar */}

      {/* Custom Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-[99999] transition-all duration-200 ease-in-out animate-fade-in">
          <div className="bg-white rounded-2xl px-8 py-6 flex flex-col items-center min-w-[340px] max-w-xs shadow-xl border border-gray-200 transform transition-all duration-200 ease-in-out animate-scale-in relative">
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white rounded-full shadow-lg p-2 border border-gray-100">
              <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 11-6 0v-1" />
              </svg>
            </div>
            <h2 className="text-lg font-bold mb-2 text-gray-800 mt-6">Confirm Logout</h2>
            <p className="mb-5 text-gray-600 text-sm">Are you sure you want to log out?</p>
            <div className="flex justify-center gap-3 w-full">
              <button
                className="px-5 py-2 rounded-full bg-gray-600 text-white font-semibold hover:bg-gray-700 transition-colors duration-200 text-sm shadow"
                onClick={handleLogout}
              >
                Yes, Log Out
              </button>
              <button
                className="px-5 py-2 rounded-full bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200 transition-colors duration-200 text-sm shadow"
                onClick={() => setShowLogoutModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add these styles at the end of the file */}
      <style>{`
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

export default Navbar;