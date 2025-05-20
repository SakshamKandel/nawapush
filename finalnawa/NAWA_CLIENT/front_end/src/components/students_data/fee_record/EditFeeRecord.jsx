import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import NoAccess from "../../NoAccess";
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from 'react-toastify';

const EditFeeRecord = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm();
  const location = useLocation();
  const [record, setRecord] = useState([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmAction, setConfirmAction] = useState(() => () => {});

  useEffect(() => {
    const fetchOldRecord = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/getFee/${location.state?.id}`,
          { withCredentials: true }
        );
        setRecord(response.data);
        setValue(
          "adm_fee",
          response.data[0].records[location.state.month].adm_fee
        );
        setValue(
          "month_fee",
          response.data[0].records[location.state.month].month_fee
        );
        setValue(
          "comp_fee",
          response.data[0].records[location.state.month].comp_fee
        );
      } catch (error) {
        if (error.response) {
          toast.error(error.response.data);
        } else {
          toast.error(error.message);
        }
      }
    };

    fetchOldRecord();
  }, []);

  const updateRecord = async (data) => {
    try {
      if (showConfirm) {
        confirmAction();
      } else {
        setShowConfirm(true);
        setConfirmAction(() => async () => {
          const updatedRecord = {
            ...record[0],
            records: {
              ...record[0].records,
              [location.state.month]: {
                ...record[0].records[location.state.month],
                adm_fee: data.adm_fee,
                month_fee: data.month_fee,
                comp_fee: data.comp_fee,
              },
            },
          };
          setRecord([updatedRecord]);

          const response = await axios.patch(
            `http://localhost:8000/editFee/${location.state.id}`,
            updatedRecord,
            { withCredentials: true }
          );

          toast.success(response.data);
          navigate("/fetch-students");
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

  return location.state ? (
    <div className="min-h-screen bg-[#f3f2ef] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white shadow-sm border border-gray-200 mb-4">
            <svg className="w-6 h-6 text-[#0a66c2]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Edit Fee Record</h2>
          <p className="text-gray-600 text-sm mt-1">
            Month: <span className="font-medium">{location.state?.month}</span>
          </p>
        </div>
        
        {/* Form Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-[#0a66c2] to-[#0073b1] px-6 py-4">
            <h2 className="text-white text-lg font-medium flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              Fee Details
            </h2>
            <p className="text-blue-100 text-sm">
              Update payment information for this month
            </p>
          </div>
          
          <div className="p-6">
            <form onSubmit={handleSubmit(updateRecord)} className="space-y-5">
              <div>
                <label
                  htmlFor="adm_fee"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Admission Fee
                </label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">Rs.</span>
                  </div>
                  <input
                    type="number"
                    id="adm_fee"
                    name="adm_fee"
                    className="pl-12 block w-full shadow-sm border-gray-300 rounded-md focus:ring-[#0a66c2] focus:border-[#0a66c2] py-2.5 transition-colors text-sm"
                    placeholder="0.00"
                    {...register("adm_fee")}
                  />
                </div>
                {errors.adm_fee && (
                  <p className="mt-1 text-sm text-red-600">{errors.adm_fee.message}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="month_fee"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Monthly Fee
                </label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">Rs.</span>
                  </div>
                  <input
                    type="number"
                    id="month_fee"
                    name="month_fee"
                    className="pl-12 block w-full shadow-sm border-gray-300 rounded-md focus:ring-[#0a66c2] focus:border-[#0a66c2] py-2.5 transition-colors text-sm"
                    placeholder="0.00"
                    {...register("month_fee")}
                  />
                </div>
                {errors.month_fee && (
                  <p className="mt-1 text-sm text-red-600">{errors.month_fee.message}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="comp_fee"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Computer Fee
                </label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">Rs.</span>
                  </div>
                  <input
                    type="number"
                    id="comp_fee"
                    name="comp_fee"
                    className="pl-12 block w-full shadow-sm border-gray-300 rounded-md focus:ring-[#0a66c2] focus:border-[#0a66c2] py-2.5 transition-colors text-sm"
                    placeholder="0.00"
                    {...register("comp_fee")}
                  />
                </div>
                {errors.comp_fee && (
                  <p className="mt-1 text-sm text-red-600">{errors.comp_fee.message}</p>
                )}
              </div>

              <div className="pt-4 flex flex-col sm:flex-row gap-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 flex justify-center items-center px-4 py-2.5 border border-transparent rounded-full shadow-sm text-sm font-medium text-white bg-[#0a66c2] hover:bg-[#004182] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0a66c2] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Updating...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                      </svg>
                      Update Record
                    </>
                  )}
                </button>
                
                <Link to="/fetch-students" className="flex-1">
                  <button
                    type="button"
                    className="w-full flex justify-center items-center px-4 py-2.5 border border-gray-300 shadow-sm rounded-full text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200 transition-colors duration-200"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Cancel
                  </button>
                </Link>
              </div>
            </form>
          </div>
          
          {/* Helper Info */}
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-gray-500">
                  Enter 0 for any fee that is not applicable for this month.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Fee Summary Card */}
        {record.length > 0 && (
          <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-sm font-medium text-gray-900">Payment Summary</h3>
            </div>
            <div className="px-6 py-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Current Admission Fee:</span>
                <span className="font-medium">Rs. {record[0]?.records[location.state.month]?.adm_fee || 0}</span>
              </div>
              <div className="flex justify-between text-sm mt-2">
                <span className="text-gray-500">Current Monthly Fee:</span>
                <span className="font-medium">Rs. {record[0]?.records[location.state.month]?.month_fee || 0}</span>
              </div>
              <div className="flex justify-between text-sm mt-2">
                <span className="text-gray-500">Current Computer Fee:</span>
                <span className="font-medium">Rs. {record[0]?.records[location.state.month]?.comp_fee || 0}</span>
              </div>
              <div className="flex justify-between text-sm font-medium mt-3 pt-3 border-t border-gray-100">
                <span className="text-gray-700">Total:</span>
                <span className="text-[#0a66c2]">Rs. {(record[0]?.records[location.state.month]?.adm_fee || 0) + 
                  (record[0]?.records[location.state.month]?.month_fee || 0) + 
                  (record[0]?.records[location.state.month]?.comp_fee || 0)}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  ) : (
    <NoAccess />
  );
};

export default EditFeeRecord;