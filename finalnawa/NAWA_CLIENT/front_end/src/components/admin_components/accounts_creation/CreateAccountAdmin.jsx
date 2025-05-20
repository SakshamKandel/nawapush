import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';

const CreateAccountAdmin = () => {
    const navigate=useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();
  const [showPass, setshowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmAction, setConfirmAction] = useState(() => () => {});

  const passHandleFunc = () => {
    if (showPass) {
      setshowPass(false);
    } else {
      setshowPass(true);
    }
  };

  const createAdmin = async (data) => {
    try {
      const response = await axios.post(
        "http://localhost:8000/create/admin",
        data,
        { withCredentials: true }
      );
      toast.success(response.data);
      navigate("/");
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data);
      } else {
        toast.error(error.message);
      }
    }
  };
  
  return (
    <div className="min-h-screen bg-[#f3f2ef] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        {/* LinkedIn-style header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white shadow-sm border border-gray-200 mb-4">
            <svg className="w-8 h-8 text-[#0a66c2]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Create Admin Account</h2>
          <p className="text-gray-600 text-sm mt-2">Navatara English School Admin Portal</p>
        </div>

        {/* LinkedIn-style card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-4">
          {/* Admin Information Section */}
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Admin Information</h3>
            
            <div className="space-y-5">
              {/* Name Field */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  className="block w-full border border-gray-300 rounded-lg px-3 py-2.5 shadow-sm focus:ring-1 focus:ring-[#0a66c2] focus:border-[#0a66c2] text-gray-900 text-sm transition-colors"
                  placeholder="Enter admin's full name"
                  {...register("name", {
                    required: "This cannot be left empty",
                  })}
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                )}
              </div>
            </div>
          </div>
          
          {/* Separator */}
          <div className="h-px bg-gray-200"></div>
          
          {/* Contact & Account Details */}
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Account Details</h3>
            
            <div className="space-y-5">
              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  className="block w-full border border-gray-300 rounded-lg px-3 py-2.5 shadow-sm focus:ring-1 focus:ring-[#0a66c2] focus:border-[#0a66c2] text-gray-900 text-sm transition-colors"
                  placeholder="admin@example.com"
                  {...register("email", {
                    required: "This cannot be left empty",
                  })}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPass ? "text" : "password"}
                    id="password"
                    className="block w-full border border-gray-300 rounded-lg pr-10 px-3 py-2.5 shadow-sm focus:ring-1 focus:ring-[#0a66c2] focus:border-[#0a66c2] text-gray-900 text-sm transition-colors"
                    placeholder="Create a secure password"
                    {...register("password", {
                      required: "This cannot be left empty",
                      minLength: {
                        value: 8,
                        message: "Password must be at least 8 characters",
                      },
                      maxLength: {
                        value: 30,
                        message: "Password is too long, max 30 characters accepted",
                      },
                    })}
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <button 
                      type="button" 
                      onClick={passHandleFunc}
                      className="text-gray-400 hover:text-[#0a66c2] focus:outline-none transition-colors"
                    >
                      <FontAwesomeIcon
                        icon={showPass ? faEyeSlash : faEye}
                        className="h-5 w-5"
                      />
                    </button>
                  </div>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  Password must be 8-30 characters long
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button - LinkedIn style */}
        <div>
          <button
            type="submit"
            onClick={handleSubmit(createAdmin)}
            disabled={isSubmitting}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-full shadow-sm text-base font-medium text-white bg-[#0a66c2] hover:bg-[#004182] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0a66c2] disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            {isSubmitting ? (
              <div className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating Account...
              </div>
            ) : (
              "Create Admin Account"
            )}
          </button>
        </div>

        {/* LinkedIn-style footer note */}
        <div className="mt-4 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0 mt-0.5">
              <svg className="h-4 w-4 text-[#0a66c2]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <p className="ml-2 text-xs text-gray-500">
              By creating an account, you're granting admin access to the Navatara School Management System
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateAccountAdmin;