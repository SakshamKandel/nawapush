import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const ViewTeacherNotices = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedNotice, setSelectedNotice] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    try {
      const response = await axios.get('http://localhost:8000/teacher-notices', {
        withCredentials: true
      });
      setNotices(response.data);
      setLoading(false);
    } catch (error) {
      setError('Failed to fetch notices');
      setLoading(false);
    }
  };

  const handleViewNotice = (notice) => {
    setSelectedNotice(notice);
    setShowModal(true);
  };

  // Approve a notice
  const handleApprove = async (id) => {
    try {
      await axios.patch(`http://localhost:8000/teacher-notices/${id}/approve`, {}, { withCredentials: true });
      fetchNotices();
      setShowModal(false);
      toast.success('Notice approved!');
    } catch (err) {
      toast.error('Failed to approve notice');
    }
  };

  // Deny a notice
  const handleDeny = async (id) => {
    try {
      await axios.patch(`http://localhost:8000/teacher-notices/${id}/deny`, {}, { withCredentials: true });
      fetchNotices();
      setShowModal(false);
      toast.success('Notice denied!');
    } catch (err) {
      toast.error('Failed to deny notice');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f3f2ef] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f3f2ef] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Teacher Notices</h2>
          
          {error && (
            <div className="bg-red-50 text-red-700 p-4 rounded-md mb-4">
              {error}
            </div>
          )}

          {notices.length === 0 ? (
            <div className="text-center py-8">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No notices</h3>
              <p className="mt-1 text-sm text-gray-500">There are no teacher notices at the moment.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Teacher
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Subject
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {notices.map((notice) => (
                    <tr key={notice._id} className="hover:bg-blue-50 transition-colors duration-150">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {notice.teacherName}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{notice.subject}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {formatDate(notice.createdAt)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 text-xs font-semibold rounded-full shadow-sm border \
                          ${notice.status === 'pending' ? 'bg-yellow-100 text-yellow-800 border-yellow-300' :
                            notice.status === 'approved' ? 'bg-green-100 text-green-800 border-green-300' :
                            'bg-red-100 text-red-800 border-red-300'}
                        `}>
                          {notice.status.charAt(0).toUpperCase() + notice.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex gap-2 items-center">
                        <button
                          onClick={() => handleViewNotice(notice)}
                          className="text-blue-600 hover:text-blue-900 underline underline-offset-2"
                          title="View full details"
                        >
                          View Details
                        </button>
                        {notice.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleApprove(notice._id)}
                              className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded shadow-sm text-xs font-semibold transition-colors duration-150"
                              title="Approve this notice"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleDeny(notice._id)}
                              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded shadow-sm text-xs font-semibold transition-colors duration-150"
                              title="Deny this notice"
                            >
                              Deny
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal for viewing notice details */}
      {showModal && selectedNotice && (
        <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center p-4 z-50 transition-all duration-200 ease-in-out animate-fade-in">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6 shadow-xl border border-gray-200 transform transition-all duration-200 ease-in-out animate-scale-in">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                Notice Details
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-500 transition-colors duration-200"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Teacher</p>
                <p className="mt-1 text-sm text-gray-900">{selectedNotice.teacherName}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Subject</p>
                <p className="mt-1 text-sm text-gray-900">{selectedNotice.subject}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Message</p>
                <p className="mt-1 text-sm text-gray-900 whitespace-pre-wrap">{selectedNotice.message}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Date</p>
                <p className="mt-1 text-sm text-gray-900">{formatDate(selectedNotice.createdAt)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Status</p>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  selectedNotice.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  selectedNotice.status === 'approved' ? 'bg-green-100 text-green-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {selectedNotice.status ? selectedNotice.status.charAt(0).toUpperCase() + selectedNotice.status.slice(1) : 'Pending'}
                </span>
              </div>
            </div>
            {selectedNotice.status === 'pending' && (
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => handleApprove(selectedNotice._id)}
                  className="bg-green-500 text-white px-4 py-2 rounded"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleDeny(selectedNotice._id)}
                  className="bg-red-500 text-white px-4 py-2 rounded"
                >
                  Deny
                </button>
              </div>
            )}
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-200 transition-colors duration-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add these styles at the end of the file */}
      <style jsx>{`
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

export default ViewTeacherNotices; 