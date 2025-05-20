import { useState, useEffect } from 'react';
import StaticCalendar from './StaticCalendar';

const CalendarPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-20">
      {/* Page Header with modern styling */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-500">
              School Calendar
            </h1>
            <p className="mt-2 text-gray-600 max-w-2xl">
              Plan your academic schedule with our easy-to-use calendar. View monthly dates and special days at a glance.
            </p>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="flex space-x-2 mb-6">
          <div className="h-1 w-20 bg-blue-500 rounded-full"></div>
          <div className="h-1 w-10 bg-blue-300 rounded-full"></div>
          <div className="h-1 w-5 bg-blue-200 rounded-full"></div>
        </div>
      </div>

      {/* Calendar Content with subtle animation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 animate-fade-in">
        <StaticCalendar />
      </div>

      {/* Add some CSS animations */}
      <style>{`
        .animate-fade-in {
          animation: fadeIn 0.6s ease-out forwards;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default CalendarPage; 