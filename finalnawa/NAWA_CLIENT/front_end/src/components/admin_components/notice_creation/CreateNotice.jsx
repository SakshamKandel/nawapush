import React, { useState, useEffect } from "react";
import NoAccess from "../../NoAccess";
import { useForm } from "react-hook-form";
import axios from "axios"
import { useNavigate } from "react-router-dom";
import StepperInNoticeForm from "./StepperInNoticeForm";
import { toast } from 'react-toastify';

const CreateNotice = () => {
  const adminLoggedIn = document.cookie.includes("adminToken");
  const [step, setStep] = useState(1);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate a small delay to ensure proper mounting
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors },
    watch,
  } = useForm();
  const navigate = useNavigate();

  // Watch the attachments field
  const attachments = watch("attachments");

  // Update selectedFile when attachments change
  useEffect(() => {
    if (attachments && attachments[0]) {
      setSelectedFile(attachments[0]);
      // Simulate upload progress animation
      setUploadProgress(0);
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 10;
        });
      }, 100);
    }
  }, [attachments]);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      const fileInput = document.getElementById('attachments');
      if (fileInput) {
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(files[0]);
        fileInput.files = dataTransfer.files;
        const event = new Event('change', { bubbles: true });
        fileInput.dispatchEvent(event);
      }
    }
  };

  const noticeHandle = async (data) => {
    setIsSubmitting(true);
    try {
      const filedata = new FormData();
      filedata.append("noticecategory", data.noticecategory);
      filedata.append("targetaudience", data.targetaudience);
      filedata.append("noticetitle", data.noticetitle);
      filedata.append("noticedes", data.noticedes);
      if (data.attachments && data.attachments[0]) {
        filedata.append("attachments", data.attachments[0]);
      }
      const response = await axios.post("http://localhost:8000/admin/create-notice", filedata, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true
      });
      toast.success(response.data.alertMsg);
      navigate("/notice");
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data);
      } else {
        toast.error(error.message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextFunc = async () => {
    const output = await trigger();
    if (output) {
      setStep(step + 1);
    }
  };

  if (!adminLoggedIn) {
    return <NoAccess />;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f3f2ef] to-[#e9f0f8] flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg border border-[#e0e0e0] p-6 backdrop-blur-sm bg-opacity-95 w-full max-w-2xl">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
            <div className="space-y-4">
              <div className="h-10 bg-gray-200 rounded"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
              <div className="h-32 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f3f2ef] to-[#e9f0f8] py-10 px-4 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#0a66c2] opacity-5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#004182] opacity-5 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-2xl mx-auto relative">
        <div className="bg-white rounded-xl shadow-lg border border-[#e0e0e0] p-6 backdrop-blur-sm bg-opacity-95 transform hover:shadow-xl transition-shadow duration-300">
          {/* Header with enhanced design */}
          <div className="flex items-center mb-8 pb-6 border-b border-[#e0e0e0]">
            <div className="p-3 bg-gradient-to-br from-[#0a66c2] to-[#004182] rounded-xl mr-4 shadow-lg transform hover:scale-105 transition-transform duration-200">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#191919] bg-gradient-to-r from-[#0a66c2] to-[#004182] bg-clip-text text-transparent">
                Create Notice
              </h1>
              <p className="text-sm text-[#666666] mt-1">
                Share important information with your audience
              </p>
            </div>
          </div>
          
          <StepperInNoticeForm stepCount={step} />
          
          <form onSubmit={handleSubmit(noticeHandle)} className="mt-8">
            <div className="space-y-6">
              {step === 1 && (
                <div className="space-y-6">
                  <div className="transform hover:scale-[1.01] transition-all duration-200">
                    <label
                      htmlFor="noticecategory"
                      className="block mb-2 text-sm font-medium text-[#191919] group"
                    >
                      <span className="flex items-center">
                        Notice Category
                        <span className="ml-2 text-xs text-[#666666] group-hover:text-[#0a66c2] transition-colors duration-200">
                          (Required)
                        </span>
                      </span>
                    </label>
                    <select
                      id="noticecategory"
                      className="w-full p-3 bg-white border border-[#e0e0e0] rounded-lg text-[#191919] text-sm focus:ring-2 focus:ring-[#0a66c2] focus:border-[#0a66c2] hover:border-[#0a66c2] transition-all duration-200 shadow-sm"
                      {...register("noticecategory", {
                        required: "You must choose one category!",
                      })}
                    >
                      <option value="">Select a category</option>
                      <option value="General">General</option>
                      <option value="Severe">Severe</option>
                      <option value="Events & Holidays">Events & Holidays</option>
                      <option value="Academic">Academic</option>
                      <option value="Meeting">Meeting</option>
                    </select>
                    {errors.noticecategory && (
                      <p className="mt-2 text-sm text-red-600 flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        {errors.noticecategory.message}
                      </p>
                    )}
                  </div>
                  
                  <div className="transform hover:scale-[1.01] transition-all duration-200">
                    <label
                      htmlFor="targetaudience"
                      className="block mb-2 text-sm font-medium text-[#191919] group"
                    >
                      <span className="flex items-center">
                        Target Audience
                        <span className="ml-2 text-xs text-[#666666] group-hover:text-[#0a66c2] transition-colors duration-200">
                          (Required)
                        </span>
                      </span>
                    </label>
                    <select
                      id="targetaudience"
                      className="w-full p-3 bg-white border border-[#e0e0e0] rounded-lg text-[#191919] text-sm focus:ring-2 focus:ring-[#0a66c2] focus:border-[#0a66c2] hover:border-[#0a66c2] transition-all duration-200 shadow-sm"
                      {...register("targetaudience", {
                        required: "You must choose one audience!",
                      })}
                    >
                      <option value="">Select target audience</option>
                      <option value="All">All</option>
                      <option value="Teachers & Staffs">Teachers & Staff</option>
                      <option value="Students">Students</option>
                    </select>
                    {errors.targetaudience && (
                      <p className="mt-2 text-sm text-red-600 flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        {errors.targetaudience.message}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6">
                  <div className="transform hover:scale-[1.01] transition-all duration-200">
                    <label
                      htmlFor="noticetitle"
                      className="block mb-2 text-sm font-medium text-[#191919] group"
                    >
                      <span className="flex items-center">
                        Notice Title
                        <span className="ml-2 text-xs text-[#666666] group-hover:text-[#0a66c2] transition-colors duration-200">
                          (Required)
                        </span>
                      </span>
                    </label>
                    <input
                      type="text"
                      id="noticetitle"
                      className="w-full p-3 bg-white border border-[#e0e0e0] rounded-lg text-[#191919] text-sm focus:ring-2 focus:ring-[#0a66c2] focus:border-[#0a66c2] hover:border-[#0a66c2] transition-all duration-200 shadow-sm"
                      placeholder="Enter a clear, descriptive title"
                      {...register("noticetitle", {
                        required: "Title cannot be empty",
                      })}
                    />
                    {errors.noticetitle && (
                      <p className="mt-2 text-sm text-red-600 flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        {errors.noticetitle.message}
                      </p>
                    )}
                  </div>
                  
                  <div className="transform hover:scale-[1.01] transition-all duration-200">
                    <label
                      htmlFor="noticedes"
                      className="block mb-2 text-sm font-medium text-[#191919] group"
                    >
                      <span className="flex items-center">
                        Notice Description
                        <span className="ml-2 text-xs text-[#666666] group-hover:text-[#0a66c2] transition-colors duration-200">
                          (Required)
                        </span>
                      </span>
                    </label>
                    <textarea
                      id="noticedes"
                      rows="5"
                      className="w-full p-3 bg-white border border-[#e0e0e0] rounded-lg text-[#191919] text-sm focus:ring-2 focus:ring-[#0a66c2] focus:border-[#0a66c2] hover:border-[#0a66c2] transition-all duration-200 shadow-sm resize-none"
                      placeholder="Provide detailed information about your notice"
                      {...register("noticedes", {
                        required: "Description cannot be empty",
                      })}
                    ></textarea>
                    {errors.noticedes && (
                      <p className="mt-2 text-sm text-red-600 flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        {errors.noticedes.message}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-6">
                  <div className="transform hover:scale-[1.01] transition-all duration-200">
                    <label
                      htmlFor="attachments"
                      className="block mb-2 text-sm font-medium text-[#191919] group"
                    >
                      <span className="flex items-center">
                        Attachments
                        <span className="ml-2 text-xs text-[#666666] group-hover:text-[#0a66c2] transition-colors duration-200">
                          (Optional)
                        </span>
                      </span>
                    </label>
                    <div 
                      className={`flex items-center justify-center w-full transition-all duration-300 ${
                        isDragging ? 'scale-105' : 'scale-100'
                      }`}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                    >
                      <label
                        htmlFor="attachments"
                        className={`flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-lg cursor-pointer transition-all duration-300 relative overflow-hidden ${
                          isDragging 
                            ? 'border-[#0a66c2] bg-[#f3f9ff] scale-105' 
                            : 'border-[#e0e0e0] bg-[#f9fafb] hover:bg-[#f3f9ff] hover:border-[#0a66c2]'
                        }`}
                        onMouseEnter={() => setIsHovering(true)}
                        onMouseLeave={() => setIsHovering(false)}
                      >
                        {/* Background pattern */}
                        <div className="absolute inset-0 opacity-5">
                          <div className="absolute inset-0 bg-gradient-to-br from-[#0a66c2] to-transparent"></div>
                          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAzNGgxMnYxMkgzNnYtMTJ6bTAtMTJoMTJ2MTJIMzZWMjJ6bS0xMiAwdjEySDEwVjIyaDE0em0wLTEyaDEydjEySDI0VjEwem0tMTIgMGgxMnYxMkgxMlYxMHoiIGZpbGw9IiMwYTY2YzIiLz48L2c+PC9zdmc+')] opacity-10"></div>
                        </div>

                        <div className="flex flex-col items-center justify-center pt-5 pb-6 relative z-10">
                          <div className={`transition-all duration-300 ${isDragging ? 'scale-110 rotate-12' : isHovering ? 'scale-105' : 'scale-100'}`}>
                            <svg className="w-10 h-10 mb-3 text-[#0a66c2]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                            </svg>
                          </div>
                          <p className="mb-2 text-sm text-[#666666]">
                            <span className={`font-medium transition-colors duration-200 ${isHovering ? 'text-[#0a66c2]' : 'text-[#0a66c2]'}`}>
                              Click to upload
                            </span> or drag and drop
                          </p>
                          <p className="text-xs text-[#666666]">PDF, DOC, XLS, JPG, PNG (MAX. 10MB)</p>
                        </div>
                        <input 
                          id="attachments" 
                          type="file" 
                          className="hidden" 
                          {...register("attachments")}
                        />
                      </label>
                    </div>
                    
                    {selectedFile && (
                      <div className="mt-4 p-4 bg-[#f3f9ff] border border-[#0a66c2] rounded-lg shadow-sm hover:shadow-md transition-all duration-300 group">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="p-2 bg-[#e9f0f8] rounded-lg group-hover:bg-[#0a66c2] transition-colors duration-300">
                              <svg className="w-5 h-5 text-[#0a66c2] group-hover:text-white transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                              </svg>
                            </div>
                            <div>
                              <span className="text-sm font-medium text-[#191919] group-hover:text-[#0a66c2] transition-colors duration-200">{selectedFile.name}</span>
                              <div className="text-xs text-[#666666] mt-0.5 flex items-center">
                                <span>{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</span>
                                <span className="mx-2 text-[#0a66c2]">•</span>
                                <span className="text-[#0a66c2]">{selectedFile.type.split('/')[1].toUpperCase()}</span>
                              </div>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedFile(null);
                              setUploadProgress(0);
                              const fileInput = document.getElementById('attachments');
                              if (fileInput) fileInput.value = '';
                            }}
                            className="p-1.5 text-[#666666] hover:text-red-500 rounded-full hover:bg-red-50 transition-all duration-200"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                          </button>
                        </div>
                        
                        {uploadProgress < 100 && (
                          <div className="mt-3">
                            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-gradient-to-r from-[#0a66c2] to-[#004182] rounded-full relative"
                                style={{ width: `${uploadProgress}%` }}
                              >
                                <div className="absolute inset-0 bg-white opacity-20 animate-shimmer"></div>
                              </div>
                            </div>
                            <div className="flex justify-between items-center mt-1">
                              <div className="text-xs text-[#666666]">
                                Uploading...
                              </div>
                              <div className="text-xs font-medium text-[#0a66c2]">
                                {uploadProgress}%
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="mt-8 pt-6 border-t border-[#e0e0e0] flex justify-between">
              {step > 1 && (
                <button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  className="px-6 py-2.5 border border-[#0a66c2] rounded-full text-[#0a66c2] font-medium text-sm hover:bg-[#f3f9ff] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#0a66c2] focus:ring-offset-2 transform hover:scale-105"
                >
                  Back
                </button>
              )}
              
              {step < 3 && (
                <button
                  type="button"
                  onClick={nextFunc}
                  className="px-6 py-2.5 bg-gradient-to-r from-[#0a66c2] to-[#004182] text-white rounded-full font-medium text-sm hover:from-[#004182] hover:to-[#0a66c2] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#0a66c2] focus:ring-offset-2 transform hover:scale-105 ml-auto"
                >
                  Continue
                </button>
              )}
              
              {step === 3 && (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 bg-gradient-to-r from-[#0a66c2] to-[#004182] text-white rounded-full font-medium text-sm hover:from-[#004182] hover:to-[#0a66c2] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#0a66c2] focus:ring-offset-2 transform hover:scale-105 disabled:opacity-70 disabled:cursor-not-allowed ml-auto flex items-center"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Publishing...
                    </>
                  ) : "Post Notice"}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>

      <style jsx>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        .animate-shimmer {
          animation: shimmer 1.5s infinite;
        }

        /* Add smooth scrolling to the page */
        html {
          scroll-behavior: smooth;
        }

        /* Add custom scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
        }

        ::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb {
          background: #0a66c2;
          border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: #004182;
        }
      `}</style>
    </div>
  );
};

export default CreateNotice;