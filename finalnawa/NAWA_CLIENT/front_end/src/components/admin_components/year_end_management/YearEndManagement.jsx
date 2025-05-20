import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { 
  FaGraduationCap, 
  FaMoneyBillWave, 
  FaFileExcel, 
  FaEye, 
  FaEyeSlash, 
  FaDownload, 
  FaCheckCircle, 
  FaUserGraduate,
  FaUsers,
  FaUserCog,
  FaChevronRight
} from 'react-icons/fa';

const YearEndManagement = () => {
  const navigate = useNavigate();
  const [academicYear, setAcademicYear] = useState(null);
  const [selectedClass, setSelectedClass] = useState('');
  const [promotionStatus, setPromotionStatus] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [canPromote, setCanPromote] = useState(false);
  const [downloadTimestamp, setDownloadTimestamp] = useState(null);
  const timerId = useRef(null);
  
  // New state for downloads and selection
  const [selectedClasses, setSelectedClasses] = useState({});
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadedFiles, setDownloadedFiles] = useState({});
  const [downloadOptions, setDownloadOptions] = useState([]);
  const [activeTab, setActiveTab] = useState('promotion');
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [isBatchPromotion, setIsBatchPromotion] = useState(false);
  const [classToPromote, setClassToPromote] = useState(null);

  useEffect(() => {
    fetchAcademicYearStatus();
  }, []);

  const fetchAcademicYearStatus = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/year-end/academic-year', { withCredentials: true });
      setAcademicYear(response.data);
    } catch (error) {
      toast.error('Failed to fetch academic year status');
    }
  };

  const fetchPromotionStatus = async (class_name) => {
    if (!class_name) {
      setPromotionStatus([]);
      return;
    }
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:8000/api/year-end/promotion-status/${class_name}`, { withCredentials: true });
      setPromotionStatus(response.data);
    } catch (error) {
      toast.error('Failed to fetch promotion status');
    } finally {
      setLoading(false);
    }
  };

  const handleClassChange = (e) => {
    const class_name = e.target.value;
    setSelectedClass(class_name);
    fetchPromotionStatus(class_name);
  };

  // Automatic download functionality
  const downloadAllClassData = async (classNum = null, isBatch = false) => {
    if (!password) {
      toast.error('Please enter your password');
      return;
    }
    
    setIsDownloading(true);
    const timestamp = Date.now();
    let downloadSuccess = true;

    try {
      // Always download complete student report first
      const allStudentsResponse = await fetch('http://localhost:8000/api/year-end/export-all-students', {
        method: 'GET',
        credentials: 'include'
      });
      
      if (!allStudentsResponse.ok) {
        throw new Error('Failed to download complete student report.');
      }
      
      // Automatically download the file
      const allStudentsBlob = await allStudentsResponse.blob();
      const allStudentsUrl = window.URL.createObjectURL(allStudentsBlob);
      const allStudentsLink = document.createElement('a');
      allStudentsLink.href = allStudentsUrl;
      allStudentsLink.download = `all_students_pre_promotion_${timestamp}.xlsx`;
      document.body.appendChild(allStudentsLink);
      allStudentsLink.click();
      allStudentsLink.remove();
      window.URL.revokeObjectURL(allStudentsUrl);
      
      // Wait a bit between downloads
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Now download specific class files
      if (isBatch) {
        // For batch promotion, download each class file
        for (let i = 1; i <= 6; i++) {
          const classResponse = await fetch(`http://localhost:8000/api/year-end/export-class-for-promotion?classNum=${i}`, {
            method: 'GET',
            credentials: 'include'
          });
          
          if (classResponse.ok) {
            const blob = await classResponse.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `class${i}_students_pre_promotion_${timestamp}.xlsx`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
            
            // Wait briefly between downloads
            await new Promise(resolve => setTimeout(resolve, 800));
          }
        }
      } else if (classNum) {
        // For single class promotion
        const classResponse = await fetch(`http://localhost:8000/api/year-end/export-class-for-promotion?classNum=${classNum}`, {
          method: 'GET',
          credentials: 'include'
        });
        
        if (classResponse.ok) {
          const blob = await classResponse.blob();
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `class${classNum}_students_pre_promotion_${timestamp}.xlsx`;
          document.body.appendChild(a);
          a.click();
          a.remove();
          window.URL.revokeObjectURL(url);
          
          // Wait briefly
          await new Promise(resolve => setTimeout(resolve, 800));
          
          // If promoting class 5, also download class 6
          if (parseInt(classNum) === 5) {
            const class6Response = await fetch('http://localhost:8000/api/year-end/export-class-for-promotion?classNum=6', {
              method: 'GET',
              credentials: 'include'
            });
            
            if (class6Response.ok) {
              const blob = await class6Response.blob();
              const url = window.URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `class6_students_pre_promotion_${timestamp}.xlsx`;
              document.body.appendChild(a);
              a.click();
              a.remove();
              window.URL.revokeObjectURL(url);
            }
          }
        }
      }
      
      toast.success('All student data has been downloaded!');
      
      if (isBatch) {
        handleBatchPromoteConfirmed();
      } else if (classNum) {
        handlePromoteStudentsConfirmed(classNum);
      }
      
    } catch (error) {
      console.error('Download error:', error);
      toast.error(`Failed to download student data: ${error.message}`);
      downloadSuccess = false;
    } finally {
      setIsDownloading(false);
    }
    
    return downloadSuccess;
  };

  // Single class promotion handler
  const handlePromoteStudents = () => {
    if (!password) {
      toast.error('Please enter your password');
      return;
    }
    
    const isClass5 = selectedClass === '5' || parseInt(selectedClass) === 5;
    const message = isClass5 
      ? 'This will graduate all Class 6 students and promote Class 5 students to Class 6.'
      : `This will promote all Class ${selectedClass} students to Class ${parseInt(selectedClass) + 1}.`;

    toast.info(
      <div>
        <p className="mb-2">Are you sure you want to proceed with the promotion?</p>
        <p className="text-sm text-gray-600 mb-3">{message}</p>
        <div className="flex gap-2">
          <button
            onClick={() => {
              toast.dismiss();
              if (isClass5) {
                setModalType('download_promote_5');
              } else {
                setModalType('download_promote');
              }
              setClassToPromote(selectedClass);
              setIsBatchPromotion(false);
              setShowConfirmModal(true);
            }}
            className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
          >
            Continue
          </button>
          <button
            onClick={() => toast.dismiss()}
            className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 text-sm"
          >
            Cancel
          </button>
        </div>
      </div>,
      { autoClose: false, closeOnClick: false }
    );
  };

  // Actual promotion after download
  const handlePromoteStudentsConfirmed = async (classNum) => {
    try {
      setLoading(true);
      
      const response = await axios.post('http://localhost:8000/api/year-end/promote-students', {
        class_name: classNum,
        academicYear: academicYear.year,
        password
      }, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (classNum === '5' || parseInt(classNum) === 5) {
        toast.success(
          `Successfully graduated ${response.data.graduated} students from Class 6 and promoted ${response.data.promoted} students to Class 6`
        );
        setSelectedClass('6');
        fetchPromotionStatus('6');
      } else {
        toast.success(
          `Successfully promoted ${response.data.promoted} students to Class ${parseInt(classNum) + 1}`
        );
        fetchPromotionStatus(classNum);
      }
      
      setPassword('');
      setCanPromote(false);
      setDownloadTimestamp(null);
      if (timerId.current) clearTimeout(timerId.current);
    } catch (error) {
      console.error('Promotion error:', error);
      if (error.response?.status === 401) {
        toast.error('Invalid password');
      } else {
        toast.error(error.response?.data?.message || 'Failed to promote students');
      }
    } finally {
      setLoading(false);
      setShowConfirmModal(false);
    }
  };
  
  // Batch promotion handler
  const handleBatchPromote = () => {
    if (!password) {
      toast.error('Please enter your password');
      return;
    }
    
    toast.info(
      <div>
        <p className="mb-2">Are you sure you want to promote all classes?</p>
        <p className="text-sm text-gray-600 mb-3">This will:</p>
        <ul className="text-sm text-gray-600 list-disc list-inside mb-3">
          <li>Download all class data files</li>
          <li>Promote students in classes 1-5</li>
          <li>Graduate students from class 6</li>
        </ul>
        <div className="flex gap-2">
          <button
            onClick={() => {
              toast.dismiss();
              setModalType('download_batch_promote');
              setIsBatchPromotion(true);
              setShowConfirmModal(true);
            }}
            className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
          >
            Continue
          </button>
          <button
            onClick={() => toast.dismiss()}
            className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 text-sm"
          >
            Cancel
          </button>
        </div>
      </div>,
      { autoClose: false, closeOnClick: false }
    );
  };

  // Actual batch promotion after download
  const handleBatchPromoteConfirmed = async () => {
    try {
      setLoading(true);
      let totalPromoted = 0;
      let totalStudents = 0;
      let totalGraduated = 0;
      
      // Process classes in descending order (6 to 1)
      for (let classNum = 6; classNum >= 1; classNum--) {
        try {
          console.log(`Processing class ${classNum}`);
        
          // Promote students
          console.log(`Promoting students in class ${classNum}`);
          const promoteRes = await axios.post('http://localhost:8000/api/year-end/promote-students', {
            class_name: classNum,
            academicYear: academicYear.year,
            password
          }, { withCredentials: true });
          
          console.log(`Promotion response for class ${classNum}:`, promoteRes.data);
          
          // Safely parse number values with fallbacks to prevent NaN
          const promoted = parseInt(promoteRes.data.promoted) || 0;
          const total = parseInt(promoteRes.data.total) || 0;
          const graduated = parseInt(promoteRes.data.graduated) || 0;
          
          console.log(`Class ${classNum} results - Promoted: ${promoted}, Total: ${total}, Graduated: ${graduated}`);
          
          totalPromoted += promoted;
          totalStudents += total;
          totalGraduated += graduated;
          
          // Add a small delay between classes
          await new Promise(resolve => setTimeout(resolve, 500));
        } catch (error) {
          console.error(`Error with class ${classNum}:`, error);
          toast.error(`Error processing class ${classNum}: ${error.response?.data?.message || error.message}`);
          
          // Continue with the next class even if there's an error
          continue;
        }
      }
      
      const successMessage = `Successfully graduated ${totalGraduated} students from Class 6 and promoted ${totalPromoted} out of ${totalStudents} students across all classes`;
      console.log(successMessage);
      toast.success(successMessage);
      
      // Refresh data
      fetchPromotionStatus(selectedClass);
      setPassword('');
    } catch (error) {
      console.error('Batch promotion error:', error);
      if (error.response?.status === 401) {
        toast.error('Invalid password');
      } else {
        toast.error(error.response?.data?.message || 'Failed to promote students');
      }
    } finally {
      setLoading(false);
      setShowConfirmModal(false);
    }
  };

  const handleClearPayroll = async () => {
    try {
      if (!password) {
        toast.error('Please enter your password');
        return;
      }

      // Add confirmation dialog
      toast.info(
        <div>
          <p className="mb-2">Are you sure you want to clear all payroll records for this academic year?</p>
          <p className="text-sm text-gray-600 mb-3">This action cannot be undone.</p>
          <div className="flex gap-2">
            <button
              onClick={() => {
                toast.dismiss();
                clearPayrollRecords();
              }}
              className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
            >
              Yes, Clear Records
            </button>
            <button
              onClick={() => toast.dismiss()}
              className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 text-sm"
            >
              Cancel
            </button>
          </div>
        </div>,
        { autoClose: false, closeOnClick: false }
      );
    } catch (error) {
      toast.error('Failed to initiate payroll clearance');
    }
  };

  const clearPayrollRecords = async () => {
    try {
      setLoading(true);
      await axios.post('http://localhost:8000/api/year-end/clear-payroll', {
        academicYear: academicYear.year,
        password
      }, { withCredentials: true });
      
      toast.success('Payroll records cleared successfully');
      fetchAcademicYearStatus();
      setPassword('');
    } catch (error) {
      if (error.response?.status === 401) {
        toast.error('Invalid password');
      } else {
        toast.error(error.response?.data?.message || 'Failed to clear payroll records');
      }
    } finally {
      setLoading(false);
      setShowConfirmModal(false);
    }
  };

  const openConfirmModal = (type, studentId = null) => {
    setModalType(type);
    if (studentId) {
      setSelectedStudents([studentId]);
    }
    setShowConfirmModal(true);
  };

  const handleDownloadStudents = async () => {
    try {
      setLoading(true);
      
      const response = await fetch('http://localhost:8000/api/year-end/export-all-students', {
        method: 'GET',
        credentials: 'include'
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to download student report');
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `student_report_all_classes_${Date.now()}.xlsx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      
      toast.success('Student report downloaded successfully!');
    } catch (err) {
      console.error('Download error:', err);
      toast.error(`Failed to download student report: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Main Return
  return (
    <div className="min-h-screen bg-[#f9f9f9]">
      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-2 flex items-center">
            <FaUserGraduate className="mr-3 text-blue-600" />
            Year-End Management
          </h1>
          <p className="text-gray-600">
            Manage student promotions, graduation, academic year transitions, and records for {academicYear?.year || new Date().getFullYear()}
          </p>
        </div>
        
        {/* Tabs Navigation */}
        <div className="flex mb-6 bg-white rounded-lg shadow-sm p-1 border border-gray-200">
          <button 
            className={`flex-1 py-3 px-4 rounded-md flex items-center justify-center font-medium transition-all duration-200 ${
              activeTab === 'promotion' 
                ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md' 
                : 'text-gray-600 hover:bg-gray-50 hover:text-blue-600'
            }`}
            onClick={() => setActiveTab('promotion')}
          >
            <FaUsers className="mr-2" />
            Student Promotion
          </button>
          <button 
            className={`flex-1 py-3 px-4 rounded-md flex items-center justify-center font-medium transition-all duration-200 ${
              activeTab === 'payroll' 
                ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-md' 
                : 'text-gray-600 hover:bg-gray-50 hover:text-purple-600'
            }`}
            onClick={() => setActiveTab('payroll')}
          >
            <FaMoneyBillWave className="mr-2" />
            Payroll Management
          </button>
        </div>
        
        {/* Password Input - Common to all sections */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Admin Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter your admin password"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">Required for all promotion and management actions</p>
            </div>
            <div className="md:w-auto flex items-center">
              <button
                className="w-full md:w-auto bg-gradient-to-r from-blue-500 to-blue-600 text-white px-5 py-2.5 rounded-lg shadow-md hover:shadow-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 flex items-center justify-center"
                onClick={handleDownloadStudents}
              >
                <FaFileExcel className="mr-2" />
                Download Complete Student Report
              </button>
            </div>
          </div>
        </div>
        
        {/* Promotion Section */}
        {activeTab === 'promotion' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                  <FaGraduationCap className="mr-2 text-blue-600" />
                  Student Promotion
                </h2>
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    className="bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2.5 rounded-lg shadow-md hover:shadow-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 flex items-center justify-center"
                    onClick={handleBatchPromote}
                    disabled={loading || !password}
                  >
                    <FaUsers className="mr-2" />
                    Promote All Classes
                  </button>
                  <select
                    className="border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm"
                    value={selectedClass}
                    onChange={handleClassChange}
                  >
                    <option value="">Select Class</option>
                    {[1, 2, 3, 4, 5, 6].map((cls) => (
                      <option key={cls} value={cls}>Class {cls}</option>
                    ))}
                  </select>
                </div>
              </div>

              {selectedClass ? (
                <>
                  <div className="mb-6">
                    <div className="p-5 bg-blue-50 rounded-lg border border-blue-100 mb-4">
                      <h3 className="font-medium text-blue-800 mb-2 flex items-center">
                        <FaUserCog className="mr-2" />
                        {selectedClass === '5' || selectedClass === 5 
                          ? 'Class 6 Graduation & Class 5 Promotion' 
                          : `Class ${selectedClass} Promotion`}
                      </h3>
                      <p className="text-blue-700 text-sm">
                        {selectedClass === '5' || selectedClass === 5 
                          ? 'This will graduate all current Class 6 students and promote Class 5 students to Class 6.'
                          : `This will promote all Class ${selectedClass} students to Class ${parseInt(selectedClass) + 1}.`}
                      </p>
                    </div>
                    
                    <button
                      className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-2.5 rounded-lg shadow-md hover:shadow-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 flex items-center"
                      onClick={handlePromoteStudents}
                      disabled={loading || !password || !promotionStatus.length}
                    >
                      <FaGraduationCap className="mr-2" />
                      Promote Class {selectedClass} Students
                    </button>
                  </div>

                  {/* Students Table */}
                  <div className="mt-4">
                    <h4 className="font-medium text-gray-700 mb-3">Students in Class {selectedClass}</h4>
                    {promotionStatus.length > 0 ? (
                      <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Name
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Roll Number
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Next Class
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {promotionStatus.map((student) => (
                              <tr key={student.studentId} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                  {student.name}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {student.rollNumber || '-'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {student.nextClass}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="text-center p-8 bg-gray-50 rounded-lg border border-gray-200">
                        <p className="text-gray-500">No students found in this class</p>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="text-center py-16 bg-gray-50 rounded-lg border border-gray-200">
                  <FaGraduationCap className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-lg font-medium text-gray-900">Select a Class</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Choose a class from the dropdown above to view students and manage promotions
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Payroll Section */}
        {activeTab === 'payroll' && (
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                <FaMoneyBillWave className="mr-2 text-purple-600" />
                Teacher Payroll Management
              </h2>
              <button
                className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-4 py-2.5 rounded-lg shadow-md hover:shadow-lg hover:from-purple-600 hover:to-purple-700 transition-all duration-200 flex items-center"
                onClick={() => openConfirmModal('payroll')}
                disabled={loading || !password}
              >
                Clear Payroll Records
              </button>
            </div>
            
            <div className="p-5 bg-purple-50 rounded-lg border border-purple-100">
              <h3 className="font-medium text-purple-800 mb-2">Year-End Payroll Operations</h3>
              <p className="text-purple-700 text-sm mb-2">
                Use this section to clear teacher payroll records at the end of the academic year.
                This operation will remove all payroll data for the current academic year.
              </p>
              <p className="text-sm text-purple-700 font-medium mt-3">
                Last payroll cleared: {academicYear?.lastPayrollClearDate 
                  ? new Date(academicYear.lastPayrollClearDate).toLocaleDateString() 
                  : 'Never'
                }
              </p>
            </div>
          </div>
        )}
        
        {/* Confirm Modal */}
        {showConfirmModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
            <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-xl animate-scale-in">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold text-gray-800 animate-slide-in">{
                  modalType === 'download_promote' ? `Promote Students - Class ${selectedClass}` :
                  modalType === 'download_promote_5' ? 'Class 6 Transition' :
                  modalType === 'download_batch_promote' ? 'Batch Promotion' :
                  'Confirm Payroll Clearance'
                }</h3>
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className="text-gray-400 hover:text-gray-500 focus:outline-none transition-transform duration-200 hover:rotate-90"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="mb-6 animate-fade-in-up delay-100">
                <p className="text-gray-600 mb-4">{
                  modalType === 'download_promote' 
                    ? `This will download the necessary data files and promote all Class ${selectedClass} students to Class ${parseInt(selectedClass) + 1}. Do you want to continue?` :
                  modalType === 'download_promote_5'
                    ? 'This will download the necessary data files, graduate all current Class 6 students, and promote Class 5 students to Class 6. Do you want to continue?' :
                  modalType === 'download_batch_promote'
                    ? 'This will download all class data files and promote eligible students in all classes. Students from Class 6 will be graduated. Do you want to continue?' :
                  'Are you sure you want to clear all teacher payroll records for this academic year?'
                }</p>
                
                {(modalType.includes('download_promote') || modalType === 'download_batch_promote') && (
                  <div className="bg-blue-50 p-3 rounded-md border border-blue-100 mb-4 animate-pulse-subtle">
                    <p className="text-sm text-blue-700 flex items-start">
                      <FaDownload className="mr-2 mt-0.5 flex-shrink-0 animate-bounce-subtle" />
                      <span>All student data will be downloaded automatically as Excel files before proceeding with promotion.</span>
                    </p>
                  </div>
                )}
              </div>
              
              <div className="flex justify-end gap-4 animate-fade-in-up delay-200">
                <button
                  className="px-4 py-2.5 text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors duration-200 border border-gray-300 rounded-lg transform hover:scale-105 active:scale-95"
                  onClick={() => setShowConfirmModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-md flex items-center min-w-[140px] justify-center transform hover:scale-105 active:scale-95 hover:shadow-lg"
                  onClick={
                    modalType === 'download_promote' || modalType === 'download_promote_5'
                      ? () => downloadAllClassData(selectedClass, false)
                      : modalType === 'download_batch_promote'
                      ? () => downloadAllClassData(null, true)
                      : handleClearPayroll
                  }
                  disabled={loading || isDownloading}
                >
                  {loading || isDownloading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                      <span className="animate-pulse">Processing...</span>
                    </div>
                  ) : (
                    modalType === 'download_promote' || modalType === 'download_promote_5'
                      ? 'Download & Promote'
                      : modalType === 'download_batch_promote'
                      ? 'Download & Promote All Classes'
                      : 'Clear Payroll Records'
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Progress indicators for downloads (show when isDownloading is true) */}
        {isDownloading && (
          <div className="fixed bottom-6 right-6 bg-white p-4 rounded-lg shadow-lg border border-blue-100 max-w-sm animate-slide-in-right">
            <h4 className="font-medium text-gray-800 mb-2 flex items-center">
              <div className="mr-2 h-4 w-4 rounded-full bg-blue-500 animate-pulse"></div>
              Downloading Files
            </h4>
            <div className="space-y-2">
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-blue-600 h-2.5 rounded-full animate-progress"></div>
              </div>
              <p className="text-sm text-gray-600">Please wait while files are downloaded...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Add CSS animation keyframes at the end of the file
const animationStyles = `
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes scaleIn {
  from { transform: scale(0.95); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}

@keyframes slideIn {
  from { transform: translateY(-10px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

@keyframes slideInRight {
  from { transform: translateX(50px); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}

@keyframes fadeInUp {
  from { transform: translateY(10px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

@keyframes bounceSlight {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
}

@keyframes pulseSlight {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.8; }
}

@keyframes progress {
  0% { width: 5%; }
  50% { width: 70%; }
  100% { width: 95%; }
}

.animate-fade-in {
  animation: fadeIn 0.3s ease forwards;
}

.animate-scale-in {
  animation: scaleIn 0.3s ease forwards;
}

.animate-slide-in {
  animation: slideIn 0.3s ease forwards;
}

.animate-slide-in-right {
  animation: slideInRight 0.4s ease forwards;
}

.animate-fade-in-up {
  animation: fadeInUp 0.4s ease forwards;
}

.animate-bounce-subtle {
  animation: bounceSlight 1.5s infinite;
}

.animate-pulse-subtle {
  animation: pulseSlight 2s infinite;
}

.animate-progress {
  animation: progress 2s ease infinite;
}

.delay-100 {
  animation-delay: 100ms;
}

.delay-200 {
  animation-delay: 200ms;
}
`;

// Create a style element and append it to the component
const styleElement = document.createElement('style');
styleElement.innerHTML = animationStyles;
document.head.appendChild(styleElement);

export default YearEndManagement; 