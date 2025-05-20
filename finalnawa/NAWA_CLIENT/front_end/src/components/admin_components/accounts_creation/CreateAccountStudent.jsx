import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash, faUserGraduate } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import NoAccess from "../../NoAccess";
import { toast } from 'react-toastify';

const CreateAccountStudent = () => {
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
  
  const createStudent = async (data) => {
    try {
      const response = await axios.post(
        "http://localhost:8000/create/student",
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
  
  return adminLoggedIn ? (
    <div className="min-h-screen bg-[#f3f2ef] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* NAWATARA STYLE header */}
        <div className="bg-white rounded-lg shadow-sm border border-[#e0e0e0] p-6 mb-6">
          <div className="flex items-center">
            <div className="p-2 bg-[#e9f0f8] rounded-lg mr-3 flex-shrink-0">
              <FontAwesomeIcon icon={faUserGraduate} className="text-[#0a66c2] text-xl" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-[#191919]">
                Create Student Account
              </h1>
              <p className="text-sm text-[#666666]">
                Add a new student to the Nawa Tara English School system
              </p>
            </div>
          </div>
        </div>

        {/* NAWATARA STYLE form card */}
        <div className="bg-white rounded-lg shadow-sm border border-[#e0e0e0] p-6">
          <form onSubmit={handleSubmit(createStudent)}>
            {/* Student Information Section */}
            <div className="mb-6 pb-6 border-b border-[#e0e0e0]">
              <h2 className="text-base font-semibold text-[#191919] mb-4">Student Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                <div>
                  <label
                    htmlFor="name"
                    className="block mb-1.5 text-sm font-medium text-[#191919]"
                  >
                    Student's Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="w-full p-2.5 bg-white border border-[#e0e0e0] rounded-md text-[#191919] text-sm focus:ring-[#0a66c2] focus:border-[#0a66c2] hover:border-[#0a66c2] transition-colors"
                    placeholder="Enter student's full name"
                    {...register("name", {
                      required: "Student name is required",
                    })}
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                  )}
                </div>
                
                <div>
                  <label
                    htmlFor="class_name"
                    className="block mb-1.5 text-sm font-medium text-[#191919]"
                  >
                    Class
                  </label>
                  <select
                    id="class_name"
                    className="w-full p-2.5 bg-white border border-[#e0e0e0] rounded-md text-[#191919] text-sm focus:ring-[#0a66c2] focus:border-[#0a66c2] hover:border-[#0a66c2] transition-colors"
                    {...register("class_name", {
                      required: "Class selection is required",
                    })}
                  >
                    <option value="">Select class</option>
                    <option value="1">Class 1</option>
                    <option value="2">Class 2</option>
                    <option value="3">Class 3</option>
                    <option value="4">Class 4</option>
                    <option value="5">Class 5</option>
                    <option value="6">Class 6</option>
                  </select>
                  {errors.class_name && (
                    <p className="mt-1 text-sm text-red-600">{errors.class_name.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Parent Information Section */}
            <div className="mb-6 pb-6 border-b border-[#e0e0e0]">
              <h2 className="text-base font-semibold text-[#191919] mb-4">Parent Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                <div>
                  <label
                    htmlFor="father_name"
                    className="block mb-1.5 text-sm font-medium text-[#191919]"
                  >
                    Father's Name
                  </label>
                  <input
                    type="text"
                    id="father_name"
                    className="w-full p-2.5 bg-white border border-[#e0e0e0] rounded-md text-[#191919] text-sm focus:ring-[#0a66c2] focus:border-[#0a66c2] hover:border-[#0a66c2] transition-colors"
                    placeholder="Enter father's name"
                    {...register("father_name", {
                      required: "Father's name is required",
                    })}
                  />
                  {errors.father_name && (
                    <p className="mt-1 text-sm text-red-600">{errors.father_name.message}</p>
                  )}
                </div>
                
                <div>
                  <label
                    htmlFor="father_phone"
                    className="block mb-1.5 text-sm font-medium text-[#191919]"
                  >
                    Father's Phone
                  </label>
                  <input
                    type="text"
                    id="father_phone"
                    className="w-full p-2.5 bg-white border border-[#e0e0e0] rounded-md text-[#191919] text-sm focus:ring-[#0a66c2] focus:border-[#0a66c2] hover:border-[#0a66c2] transition-colors"
                    placeholder="10-digit phone number"
                    {...register("father_phone", {
                      required: "Father's phone is required",
                      pattern: {
                        value: /^[0-9]{10}$/,
                        message: "Please enter a valid 10-digit phone number",
                      },
                    })}
                  />
                  {errors.father_phone && (
                    <p className="mt-1 text-sm text-red-600">{errors.father_phone.message}</p>
                  )}
                </div>
                
                <div>
                  <label
                    htmlFor="mother_name"
                    className="block mb-1.5 text-sm font-medium text-[#191919]"
                  >
                    Mother's Name
                  </label>
                  <input
                    type="text"
                    id="mother_name"
                    className="w-full p-2.5 bg-white border border-[#e0e0e0] rounded-md text-[#191919] text-sm focus:ring-[#0a66c2] focus:border-[#0a66c2] hover:border-[#0a66c2] transition-colors"
                    placeholder="Enter mother's name"
                    {...register("mother_name", {
                      required: "Mother's name is required",
                    })}
                  />
                  {errors.mother_name && (
                    <p className="mt-1 text-sm text-red-600">{errors.mother_name.message}</p>
                  )}
                </div>
                
                <div>
                  <label
                    htmlFor="mother_phone"
                    className="block mb-1.5 text-sm font-medium text-[#191919]"
                  >
                    Mother's Phone
                  </label>
                  <input
                    type="text"
                    id="mother_phone"
                    className="w-full p-2.5 bg-white border border-[#e0e0e0] rounded-md text-[#191919] text-sm focus:ring-[#0a66c2] focus:border-[#0a66c2] hover:border-[#0a66c2] transition-colors"
                    placeholder="10-digit phone number"
                    {...register("mother_phone", {
                      required: "Mother's phone is required",
                      pattern: {
                        value: /^[0-9]{10}$/,
                        message: "Please enter a valid 10-digit phone number",
                      },
                    })}
                  />
                  {errors.mother_phone && (
                    <p className="mt-1 text-sm text-red-600">{errors.mother_phone.message}</p>
                  )}
                </div>
              </div>
            </div>
            
            {/* Contact & Account Section */}
            <div className="mb-6">
              <h2 className="text-base font-semibold text-[#191919] mb-4">Contact & Account Details</h2>
              
              <div className="grid grid-cols-1 gap-y-4">
                <div>
                  <label
                    htmlFor="address"
                    className="block mb-1.5 text-sm font-medium text-[#191919]"
                  >
                    Home Address
                  </label>
                  <textarea
                    id="address"
                    rows="2"
                    className="w-full p-2.5 bg-white border border-[#e0e0e0] rounded-md text-[#191919] text-sm focus:ring-[#0a66c2] focus:border-[#0a66c2] hover:border-[#0a66c2] transition-colors resize-none"
                    placeholder="Enter complete home address"
                    {...register("address", {
                      required: "Address is required",
                    })}
                  ></textarea>
                  {errors.address && (
                    <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
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
                      placeholder="student@example.com"
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
                          pattern: {
                            value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                            message: "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
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
                    <p className="mt-1 text-xs text-[#666666]">Password must be 8-30 characters long with at least one uppercase letter, one lowercase letter, one number, and one symbol</p>
                  </div>
                </div>
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
                ) : "Create Student Account"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  ) : (
    <NoAccess/>
  );
};

export default CreateAccountStudent;