import React from "react";
import { Link } from "react-router-dom";

const NoAccess = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-16 left-10 w-64 h-64 rounded-full bg-red-100 mix-blend-multiply animate-float opacity-60"></div>
        <div className="absolute top-32 right-10 w-80 h-80 rounded-full bg-orange-100 mix-blend-multiply animate-float-delay opacity-60"></div>
        <div className="absolute bottom-16 left-20 w-72 h-72 rounded-full bg-amber-100 mix-blend-multiply animate-float-slow opacity-60"></div>
      </div>

      {/* Lock icon */}
      <div className="relative z-10 mb-6 flex flex-col items-center">
        <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center shadow-lg mb-6 border-2 border-red-100">
          <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
          </svg>
        </div>
        
        <h1 className="text-red-800 text-4xl font-bold mb-2 text-center">Access Restricted</h1>
        <div className="h-1 w-24 bg-gradient-to-r from-red-400 to-red-600 rounded-full mb-6"></div>
        
        <p className="text-gray-600 text-center max-w-md mb-8 text-lg">
          Sorry, you don't have permission to access this page. This area may require specific credentials or privileges.
        </p>
        
        {/* Options for the user */}
        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
          <Link to={"/"} className="flex-1">
            <button className="w-full cursor-pointer relative inline-flex items-center justify-center p-0.5 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 shadow-md">
              <span className="relative w-full flex items-center justify-center px-5 py-3 transition-all ease-in duration-75 bg-white rounded-md group-hover:bg-opacity-0">
                <svg className="w-5 h-5 mr-2 -ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
                </svg>
                Go back to Home Page
              </span>
            </button>
          </Link>
          
          <Link to={"/login-form"} className="flex-1">
            <button className="w-full cursor-pointer relative inline-flex items-center justify-center p-0.5 overflow-hidden text-sm font-medium rounded-lg group border-2 border-purple-500 text-purple-600 hover:text-white focus:ring-4 focus:outline-none focus:ring-purple-200">
              <span className="relative w-full flex items-center justify-center px-5 py-2.5 transition-all ease-in duration-75 bg-white rounded-md group-hover:bg-purple-600">
                <svg className="w-5 h-5 mr-2 -ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path>
                </svg>
                Log In
              </span>
            </button>
          </Link>
        </div>
      </div>
      
      {/* Additional helpful information */}
      <div className="relative z-10 mt-12 max-w-lg w-full bg-white bg-opacity-80 backdrop-filter backdrop-blur-sm rounded-xl p-6 border border-gray-100 shadow-lg">
        <h3 className="text-gray-800 font-semibold mb-3 flex items-center">
          <svg className="w-5 h-5 mr-2 text-amber-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path>
          </svg>
          Need Help?
        </h3>
        <p className="text-gray-600 text-sm">
          If you believe you should have access to this page, please ensure you're logged in with the correct account. For further assistance, contact your administrator or support team.
        </p>
      </div>
      
      {/* Animation keyframes - added inline for simplicity */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        .animate-float {
          animation: float 8s ease-in-out infinite;
        }
        .animate-float-delay {
          animation: float 9s ease-in-out 1s infinite;
        }
        .animate-float-slow {
          animation: float 11s ease-in-out 0.5s infinite;
        }
      `}</style>
    </div>
  );
};

export default NoAccess;