import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import NoAccess from "../../NoAccess";
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from 'react-toastify';

const EditStudentData = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();
  const location = useLocation();
  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmAction, setConfirmAction] = useState(() => () => {});
  
  const editStudent = async (data) => {
    try {
      if(showConfirm) {
        confirmAction();
      } else {
        setShowConfirm(true);
        setConfirmAction(() => async () => {
          const response = await axios.patch(
            `http://localhost:8000/editStudent/${location.state.student._id}`,
            data,
            {withCredentials: true}
          );
          toast.success(response.data);
          navigate("/fetch-students");
        });
      }
    } catch (error) {
      if(error.response) {
        toast.error(error.response.data);
      } else {
        toast.error(error.message);
      }
    }
  };
  
  return location.state ? (
    <div className="min-h-screen bg-[#f3f2ef] py-8 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        {/* NAWATARA STYLE header */}
        <div className="bg-white rounded-lg shadow-sm border border-[#e0e0e0] p-6 mb-6">
          <div className="flex items-center">
            <div className="p-2 bg-[#e9f0f8] rounded-lg mr-3 flex-shrink-0">
              <svg className="w-6 h-6 text-[#0a66c2]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-semibold text-[#191919]">
                Edit Student Profile
              </h1>
              <p className="text-sm text-[#666666]">
                Update student information for {location.state.student.name}
              </p>
            </div>
          </div>
        </div>

        {/* NAWATARA STYLE form card */}
        <div className="bg-white rounded-lg shadow-sm border border-[#e0e0e0] p-6">
          <form onSubmit={handleSubmit(editStudent)}>
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
                    defaultValue={location.state.student.name}
                    className="w-full p-2.5 bg-white border border-[#e0e0e0] rounded-md text-[#191919] text-sm focus:ring-[#0a66c2] focus:border-[#0a66c2] hover:border-[#0a66c2] transition-colors"
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
                    defaultValue={location.state.student.class_name}
                    className="w-full p-2.5 bg-white border border-[#e0e0e0] rounded-md text-[#191919] text-sm focus:ring-[#0a66c2] focus:border-[#0a66c2] hover:border-[#0a66c2] transition-colors"
                    {...register("class_name", {
                      required: "Class selection is required",
                      min: { value: 1, message: "Please select a valid class" },
                      max: { value: 6, message: "Please select a valid class" },
                    })}
                  >
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
                    defaultValue={location.state.student.father_name}
                    className="w-full p-2.5 bg-white border border-[#e0e0e0] rounded-md text-[#191919] text-sm focus:ring-[#0a66c2] focus:border-[#0a66c2] hover:border-[#0a66c2] transition-colors"
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
                    defaultValue={location.state.student.father_phone}
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
                    defaultValue={location.state.student.mother_name}
                    className="w-full p-2.5 bg-white border border-[#e0e0e0] rounded-md text-[#191919] text-sm focus:ring-[#0a66c2] focus:border-[#0a66c2] hover:border-[#0a66c2] transition-colors"
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
                    defaultValue={location.state.student.mother_phone}
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
            
            {/* Contact Information Section */}
            <div className="mb-6">
              <h2 className="text-base font-semibold text-[#191919] mb-4">Contact Information</h2>
              
              <div className="space-y-4">
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
                    defaultValue={location.state.student.address}
                    className="w-full p-2.5 bg-white border border-[#e0e0e0] rounded-md text-[#191919] text-sm focus:ring-[#0a66c2] focus:border-[#0a66c2] hover:border-[#0a66c2] transition-colors resize-none"
                    {...register("address", {
                      required: "Address is required",
                    })}
                  ></textarea>
                  {errors.address && (
                    <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>
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
                    defaultValue={location.state.student.email}
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
              </div>
            </div>
            
            {/* Submit Buttons */}
            <div className="pt-4 border-t border-[#e0e0e0] flex flex-col-reverse sm:flex-row sm:justify-between gap-3">
              <Link to="/fetch-students" className="sm:order-1">
                <button
                  type="button"
                  className="w-full px-5 py-2.5 border border-[#0a66c2] rounded-full text-[#0a66c2] font-medium text-sm hover:bg-[#f3f9ff] transition-colors focus:outline-none focus:ring-2 focus:ring-[#0a66c2] focus:ring-offset-2"
                >
                  <span className="flex items-center justify-center">
                    <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                    </svg>
                    Back to Student List
                  </span>
                </button>
              </Link>
              
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2.5 bg-[#0a66c2] text-white rounded-full font-medium text-sm hover:bg-[#004182] transition-colors focus:outline-none focus:ring-2 focus:ring-[#0a66c2] focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed sm:order-2 flex items-center justify-center"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Updating Profile...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"></path>
                    </svg>
                    Update Student Profile
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
        
        {/* NAWATARA STYLE info card */}
        <div className="mt-6 bg-white rounded-lg shadow-sm border border-[#e0e0e0] p-5">
          <div className="flex items-start">
            <div className="flex-shrink-0 p-1 bg-[#f9fafb] rounded-full border border-[#e0e0e0]">
              <svg className="w-5 h-5 text-[#0a66c2]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-[#191919]">About Student Profiles</h3>
              <p className="mt-1 text-xs text-[#666666]">
                Updating a student's profile will change their information across the entire system.
                All changes are logged for administrative purposes.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <NoAccess />
  );
};

export default EditStudentData;