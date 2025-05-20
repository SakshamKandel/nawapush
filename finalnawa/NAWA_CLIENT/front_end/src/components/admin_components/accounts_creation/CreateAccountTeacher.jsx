import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash, faChalkboardTeacher } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import NoAccess from "../../NoAccess";
import { toast } from 'react-toastify';

const CreateAccountTeacher = () => {
  const adminLoggedIn = document.cookie.includes("adminToken");
  const [showPass, setshowPass] = useState(false);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmAction, setConfirmAction] = useState(() => () => {});
  
  const passHandleFunc = () => {
    if (showPass) {
      setshowPass(false);
    } else {
      setshowPass(true);
    }
  };
  
  const createTeacher = async (data) => {
    try {
      if (showConfirm) {
        confirmAction();
      } else {
        setShowConfirm(true);
        setConfirmAction(() => async () => {
          const response = await axios.post(
            "http://localhost:8000/create/teacher",
            data,
            { withCredentials: true }
          );
          toast.success(response.data);
          navigate("/");
        });
      }
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data);
      } else {
        toast.error(error.message);
      }
    }
  };
  
  return adminLoggedIn ? (
    <div className="min-h-screen bg-[#f3f2ef] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* NAWATARA STYLE header */}
        <div className="bg-white rounded-lg shadow-sm border border-[#e0e0e0] p-6 mb-6">
          <div className="flex items-center">
            <div className="p-2 bg-[#e9f0f8] rounded-lg mr-3 flex-shrink-0">
              <FontAwesomeIcon icon={faChalkboardTeacher} className="text-[#0a66c2] text-xl" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-[#191919]">
                Create Teacher Account
              </h1>
              <p className="text-sm text-[#666666]">
                Add a new teaching staff member to the Nawa Tara English School system
              </p>
            </div>
          </div>
        </div>

        {/* NAWATARA STYLE form card */}
        <div className="bg-white rounded-lg shadow-sm border border-[#e0e0e0] p-6">
          <form onSubmit={handleSubmit(createTeacher)}>
            {/* Teacher Information Section */}
            <div className="mb-6">
              <h2 className="text-base font-semibold text-[#191919] mb-4">Teacher Information</h2>
              
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="name"
                    className="block mb-1.5 text-sm font-medium text-[#191919]"
                  >
                    Teacher's Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="w-full p-2.5 bg-white border border-[#e0e0e0] rounded-md text-[#191919] text-sm focus:ring-[#0a66c2] focus:border-[#0a66c2] hover:border-[#0a66c2] transition-colors"
                    placeholder="Enter teacher's full name"
                    {...register("name", {
                      required: "Teacher name is required",
                    })}
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                  )}
                </div>
                
                <div>
                  <label
                    htmlFor="email"
                    className="block mb-1.5 text-sm font-medium text-[#191919]"
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="w-full p-2.5 bg-white border border-[#e0e0e0] rounded-md text-[#191919] text-sm focus:ring-[#0a66c2] focus:border-[#0a66c2] hover:border-[#0a66c2] transition-colors"
                    placeholder="teacher@example.com"
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Please enter a valid email address",
                      },
                    })}
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                  )}
                </div>
                
                <div>
                  <label
                    htmlFor="password"
                    className="block mb-1.5 text-sm font-medium text-[#191919]"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPass ? "text" : "password"}
                      id="password"
                      className="w-full p-2.5 bg-white border border-[#e0e0e0] rounded-md text-[#191919] text-sm focus:ring-[#0a66c2] focus:border-[#0a66c2] hover:border-[#0a66c2] transition-colors pr-10"
                      placeholder="Create a secure password"
                      {...register("password", {
                        required: "Password is required",
                        minLength: {
                          value: 8,
                          message: "Password must be at least 8 characters",
                        },
                        maxLength: {
                          value: 30,
                          message: "Password cannot exceed 30 characters",
                        },
                      })}
                    />
                    <button
                      type="button"
                      onClick={passHandleFunc}
                      className="absolute inset-y-0 right-0 px-3 flex items-center text-[#666666] hover:text-[#0a66c2]"
                    >
                      <FontAwesomeIcon icon={showPass ? faEyeSlash : faEye} className="text-sm" />
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                  )}
                  <p className="mt-1 text-xs text-[#666666]">Password must be 8-30 characters long</p>
                </div>
                
                {/* Optional: Additional fields like subjects, qualifications, etc. could go here */}
              </div>
            </div>
            
            {/* Submit Button */}
            <div className="pt-4 border-t border-[#e0e0e0]">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto px-6 py-2.5 bg-[#0a66c2] text-white rounded-full font-medium text-sm hover:bg-[#004182] transition-colors focus:outline-none focus:ring-2 focus:ring-[#0a66c2] focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating Account...
                  </>
                ) : "Create Teacher Account"}
              </button>
            </div>
          </form>
        </div>
        
        {/* NAWATARA STYLE info card (optional) */}
        <div className="mt-6 bg-white rounded-lg shadow-sm border border-[#e0e0e0] p-6">
          <div className="flex items-start">
            <div className="flex-shrink-0 p-1 bg-[#f9fafb] rounded-full border border-[#e0e0e0]">
              <svg className="w-5 h-5 text-[#0a66c2]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-[#191919]">About Teacher Accounts</h3>
              <p className="mt-1 text-xs text-[#666666]">
                Teacher accounts have access to their class schedules, student information, and the ability to post notices. Make sure to communicate the login credentials securely.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <NoAccess/>
  );
};

export default CreateAccountTeacher;