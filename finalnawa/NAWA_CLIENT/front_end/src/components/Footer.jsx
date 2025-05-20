import React from "react";

const Footer = () => {
  return (
    <footer className="bg-[#f3f2ef] border-t border-gray-200 pt-8 pb-4 mt-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main footer content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Column 1: School info */}
          <div className="col-span-1">
            <div className="flex flex-col items-start">
              <div className="group">
                <img
                  src="/school_logo.png"
                  className="h-16 w-auto mb-3 transition-transform duration-300 group-hover:scale-105"
                  alt="School Logo"
                />
              </div>
              <h3 className="text-[#0a66c2] font-semibold text-sm tracking-wide mb-2">
                NAWA TARA ENGLISH SCHOOL
              </h3>
              <p className="text-gray-600 text-sm">
                Providing quality education since 2070 BS. Our focus is on academic excellence, 
                character development, and innovative learning approaches.
              </p>
            </div>
          </div>
          
          {/* Column 2: Address & Contact */}
          <div className="col-span-1">
            <h3 className="text-base font-semibold text-gray-900 mb-3 relative inline-flex items-center">
              <svg className="w-5 h-5 mr-2 text-[#0a66c2]" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
              Address
              <span className="absolute -bottom-1 left-0 w-12 h-0.5 bg-[#0a66c2] origin-left transform scale-x-100"></span>
            </h3>
            <ul className="mt-4 space-y-3">
              <li className="flex items-start group">
                <span className="mt-0.5 mr-3 p-1 rounded-full bg-blue-50 text-[#0a66c2] group-hover:bg-blue-100 transition-colors duration-200">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                </span>
                <span className="text-gray-600 text-sm">
                  Jamungacchi 04, Biratnagar, Morang, Nepal
                </span>
              </li>
              <li className="flex items-start group">
                <span className="mt-0.5 mr-3 p-1 rounded-full bg-blue-50 text-[#0a66c2] group-hover:bg-blue-100 transition-colors duration-200">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                </span>
                <div className="text-gray-600 text-sm">
                  <p>9800000000</p>
                  <p>9811111111</p>
                </div>
              </li>
            </ul>
          </div>
          
          {/* Column 3: Quick Links */}
          <div className="col-span-1">
            <h3 className="text-base font-semibold text-gray-900 mb-3 relative inline-flex items-center">
              <svg className="w-5 h-5 mr-2 text-[#0a66c2]" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
              </svg>
              Quick Links
              <span className="absolute -bottom-1 left-0 w-12 h-0.5 bg-[#0a66c2] origin-left transform scale-x-100"></span>
            </h3>
            <ul className="mt-4 space-y-2">
              <li>
                <a href="/about-us" className="text-gray-600 text-sm hover:text-[#0a66c2] hover:underline transition-colors duration-200 flex items-center group">
                  <svg className="w-3 h-3 mr-2 text-gray-400 group-hover:text-[#0a66c2] transition-colors duration-200" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                  About Us
                </a>
              </li>
              <li>
                <a href="/notice" className="text-gray-600 text-sm hover:text-[#0a66c2] hover:underline transition-colors duration-200 flex items-center group">
                  <svg className="w-3 h-3 mr-2 text-gray-400 group-hover:text-[#0a66c2] transition-colors duration-200" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                  Notices
                </a>
              </li>
              <li>
                <a href="/contact-us" className="text-gray-600 text-sm hover:text-[#0a66c2] hover:underline transition-colors duration-200 flex items-center group">
                  <svg className="w-3 h-3 mr-2 text-gray-400 group-hover:text-[#0a66c2] transition-colors duration-200" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                  Contact Us
                </a>
              </li>
              <li>
                <a href="/login-form" className="text-gray-600 text-sm hover:text-[#0a66c2] hover:underline transition-colors duration-200 flex items-center group">
                  <svg className="w-3 h-3 mr-2 text-gray-400 group-hover:text-[#0a66c2] transition-colors duration-200" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                  Login
                </a>
              </li>
            </ul>
          </div>
          
          {/* Column 4: Connect with us */}
          <div className="col-span-1">
            <h3 className="text-base font-semibold text-gray-900 mb-3 relative inline-flex items-center">
              <svg className="w-5 h-5 mr-2 text-[#0a66c2]" fill="currentColor" viewBox="0 0 20 20">
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
              </svg>
              Connect With Us
              <span className="absolute -bottom-1 left-0 w-12 h-0.5 bg-[#0a66c2] origin-left transform scale-x-100"></span>
            </h3>
            <div className="mt-4 flex space-x-2">
              <a href="https://www.facebook.com" className="inline-flex items-center justify-center p-2 rounded-full border border-gray-300 bg-white text-[#1877F2] hover:bg-[#1877F2] hover:text-white hover:border-[#1877F2] transition-all duration-300 shadow-sm">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/>
                </svg>
              </a>
              <a href="https://www.instagram.com" className="inline-flex items-center justify-center p-2 rounded-full border border-gray-300 bg-white text-[#E4405F] hover:bg-[#E4405F] hover:text-white hover:border-[#E4405F] transition-all duration-300 shadow-sm">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"/>
                </svg>
              </a>
              <a href="https://www.linkedin.com" className="inline-flex items-center justify-center p-2 rounded-full border border-gray-300 bg-white text-[#0a66c2] hover:bg-[#0a66c2] hover:text-white hover:border-[#0a66c2] transition-all duration-300 shadow-sm">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
              <a href="https://www.twitter.com" className="inline-flex items-center justify-center p-2 rounded-full border border-gray-300 bg-white text-[#1DA1F2] hover:bg-[#1DA1F2] hover:text-white hover:border-[#1DA1F2] transition-all duration-300 shadow-sm">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
        
        {/* Divider */}
        <div className="border-t border-gray-200 pt-6 pb-2">
          <div className="flex flex-col md:flex-row justify-between items-center">
            {/* Copyright */}
            <div className="text-gray-500 text-sm mb-4 md:mb-0">
              ©️ {new Date().getFullYear()} Nawa Tara English School. All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;