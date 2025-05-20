import React from 'react'

const ContactUs = () => {
  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header section - Enhanced design */}
        <div className="flex flex-col md:flex-row gap-6 mb-8">
          <div className="w-full md:w-1/3 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300">
            <div className="p-6 flex flex-col items-center justify-center h-full">
              {/* Logo with transparent white background */}
              <div className="w-40 h-40 bg-white rounded-lg flex items-center justify-center mb-4 border-2 border-gray-50">
                <img 
                  src="/school_logo.png" 
                  alt="School Logo" 
                  className="max-h-32 max-w-32 object-contain"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.style.display = 'none';
                    e.target.parentNode.innerHTML = '<div class="text-xl font-semibold text-[#0a66c2]">NAWA TARA</div>';
                  }}
                />
              </div>
              <h2 className="text-2xl font-semibold text-gray-800 text-center">Connect With Us</h2>
              <p className="mt-2 text-sm text-gray-600 text-center">
                We're here to assist you with any questions or inquiries.
              </p>
              <div className="mt-4 w-12 h-1 bg-[#0a66c2] rounded-full mx-auto"></div>
            </div>
          </div>
          
          <div className="w-full md:w-2/3">
            {/* Modern contact card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden h-full hover:shadow-md transition-shadow duration-300">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="h-6 w-1 bg-[#0a66c2] rounded-full mr-3"></div>
                  <h3 className="text-xl font-semibold text-gray-800">NAWA TARA ENGLISH SCHOOL</h3>
                </div>
                <p className="text-gray-600 mb-6 pl-4 border-l-4 border-[#0a66c2] bg-blue-50 py-3 px-3 rounded-r-lg italic">
                  We're committed to providing quality education and support to our students and their families.
                  Thank you for your interest in our institution.
                </p>
                
                {/* Contact info in horizontal cards - enhanced design */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gradient-to-r from-gray-50 to-white p-4 rounded-lg border border-gray-100 flex items-start hover:border-blue-100 transition-colors duration-300">
                    <div className="flex-shrink-0 mr-3">
                      <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center border-2 border-blue-100">
                        <svg className="h-6 w-6 text-[#0a66c2]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                        </svg>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-base font-medium text-gray-900">Phone</h4>
                      <p className="text-sm text-gray-600">9800000000</p>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-gray-50 to-white p-4 rounded-lg border border-gray-100 flex items-start hover:border-blue-100 transition-colors duration-300">
                    <div className="flex-shrink-0 mr-3">
                      <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center border-2 border-blue-100">
                        <svg className="h-6 w-6 text-[#0a66c2]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                        </svg>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-base font-medium text-gray-900">Email</h4>
                      <p className="text-sm font-medium text-[#0a66c2] hover:underline">
                        <a href="mailto:contact@nawataraenglishschool.com">contact@nawataraenglishschool.com</a>
                      </p>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-gray-50 to-white p-4 rounded-lg border border-gray-100 flex items-start hover:border-blue-100 transition-colors duration-300">
                    <div className="flex-shrink-0 mr-3">
                      <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center border-2 border-blue-100">
                        <svg className="h-6 w-6 text-[#0a66c2]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        </svg>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-base font-medium text-gray-900">Address</h4>
                      <p className="text-sm text-gray-600">Jamungacchi 04, Biratnagar, Morang, Nepal</p>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-gray-50 to-white p-4 rounded-lg border border-gray-100 flex items-start hover:border-blue-100 transition-colors duration-300">
                    <div className="flex-shrink-0 mr-3">
                      <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center border-2 border-blue-100">
                        <svg className="h-6 w-6 text-[#0a66c2]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-base font-medium text-gray-900">Office Hours</h4>
                      <p className="text-sm text-gray-600">Monday-Friday: 8AM - 5PM</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Departments section - Enhanced design */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-8 hover:shadow-md transition-shadow duration-300">
          <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
            <h3 className="text-lg font-medium text-gray-800 flex items-center">
              <div className="h-6 w-6 rounded-full bg-[#0a66c2] flex items-center justify-center mr-2">
                <svg className="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                </svg>
              </div>
              Departments
            </h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:border-blue-100 transition-colors duration-300">
                <div className="flex items-center mb-3">
                  <div className="h-12 w-12 rounded-full bg-blue-50 flex items-center justify-center mr-3 border-2 border-blue-100">
                    <svg className="h-6 w-6 text-[#0a66c2]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                    </svg>
                  </div>
                  <h4 className="text-lg font-medium text-gray-900">Administration</h4>
                </div>
                <div className="ml-4 border-l-2 border-blue-50 pl-4">
                  <p className="text-sm text-gray-600">For general inquiries, admissions, and administrative matters.</p>
                  <div className="mt-3 pt-3 border-t border-gray-50">
                    <a href="mailto:admin@nawataraenglishschool.com" className="text-sm font-medium text-[#0a66c2] hover:underline inline-flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                      </svg>
                      admin@nawataraenglishschool.com
                    </a>
                    <p className="text-sm text-gray-600 mt-1">9800000000 ext. 101</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:border-blue-100 transition-colors duration-300">
                <div className="flex items-center mb-3">
                  <div className="h-12 w-12 rounded-full bg-blue-50 flex items-center justify-center mr-3 border-2 border-blue-100">
                    <svg className="h-6 w-6 text-[#0a66c2]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                    </svg>
                  </div>
                  <h4 className="text-lg font-medium text-gray-900">Academic Affairs</h4>
                </div>
                <div className="ml-4 border-l-2 border-blue-50 pl-4">
                  <p className="text-sm text-gray-600">For curriculum, class schedules, and academic programs.</p>
                  <div className="mt-3 pt-3 border-t border-gray-50">
                    <a href="mailto:academics@nawataraenglishschool.com" className="text-sm font-medium text-[#0a66c2] hover:underline inline-flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                      </svg>
                      academics@nawataraenglishschool.com
                    </a>
                    <p className="text-sm text-gray-600 mt-1">9800000000 ext. 202</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:border-blue-100 transition-colors duration-300">
                <div className="flex items-center mb-3">
                  <div className="h-12 w-12 rounded-full bg-blue-50 flex items-center justify-center mr-3 border-2 border-blue-100">
                    <svg className="h-6 w-6 text-[#0a66c2]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                  <h4 className="text-lg font-medium text-gray-900">Finance Department</h4>
                </div>
                <div className="ml-4 border-l-2 border-blue-50 pl-4">
                  <p className="text-sm text-gray-600">For fees, payments, and financial assistance.</p>
                  <div className="mt-3 pt-3 border-t border-gray-50">
                    <a href="mailto:finance@nawataraenglishschool.com" className="text-sm font-medium text-[#0a66c2] hover:underline inline-flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                      </svg>
                      finance@nawataraenglishschool.com
                    </a>
                    <p className="text-sm text-gray-600 mt-1">9800000000 ext. 303</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Facilities section - enhanced design */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-8 hover:shadow-md transition-shadow duration-300">
          <div className="flex flex-col md:flex-row">
            <div className="w-full md:w-1/2 p-6 flex flex-col justify-center">
              <div className="inline-block mb-4">
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-[#0a66c2] flex items-center justify-center">
                    <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 ml-3">Our Location</h3>
                </div>
                <div className="h-1 w-24 bg-[#0a66c2] mt-2 ml-13 rounded-full"></div>
              </div>
              
              <p className="text-gray-600 mb-5">
                Our school is conveniently located in Jamungacchi 04, Biratnagar, easily accessible with available transportation options.
              </p>
              
              <div className="bg-gradient-to-r from-gray-50 to-white rounded-lg p-5 border border-gray-100">
                <h4 className="text-base font-medium text-gray-800 mb-2 flex items-center">
                  <svg className="h-4 w-4 mr-2 text-[#0a66c2]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  Address
                </h4>
                <p className="text-sm text-gray-600 ml-6">Jamungacchi 04,<br/>Biratnagar, Morang, Nepal</p>
                
                <h4 className="text-base font-medium text-gray-800 mb-2 mt-5 flex items-center">
                  <svg className="h-4 w-4 mr-2 text-[#0a66c2]" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                  </svg>
                  Facilities
                </h4>
                <ul className="text-sm text-gray-600 ml-6 space-y-2">
                  <li className="flex items-center">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#0a66c2] mr-2"></span>
                    Transportation available for students
                  </li>
                  <li className="flex items-center">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#0a66c2] mr-2"></span>
                    Well-equipped science and computer labs
                  </li>
                  <li className="flex items-center">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#0a66c2] mr-2"></span>
                    Modern library and sports facilities
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="w-full md:w-1/2 bg-gradient-to-br from-blue-50 to-white flex items-center justify-center text-center p-8">
              <div className="transform hover:scale-105 transition-transform duration-300">
                <svg className="mx-auto h-20 w-20 text-[#0a66c2]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                </svg>
                <div className="relative mt-4">
                  <div className="h-1 w-20 bg-[#0a66c2] mx-auto rounded-full"></div>
                </div>
                <p className="mt-6 text-xl font-medium text-gray-800">NAWA TARA ENGLISH SCHOOL</p>
                <p className="text-base text-gray-600 mt-2">Jamungacchi 04, Biratnagar, Morang</p>
                <a href="mailto:contact@nawataraenglishschool.com" 
                   className="text-sm text-[#0a66c2] mt-2 font-medium hover:underline inline-flex items-center justify-center mt-3">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                  contact@nawataraenglishschool.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ContactUs