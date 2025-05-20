import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { contextCreate } from "../Context";

const Home = () => {
  const teacherLoggedIn=document.cookie.includes("teacherToken")
  const adminLoggedIn=document.cookie.includes("adminToken")
  const studentLoggedIn=document.cookie.includes("studentToken")
  const contextUse=useContext(contextCreate)
  return (
    <div className="min-h-screen bg-[#f3f2ef]">
      {/* Welcome greeting banner - Enhanced for admin, standard for others */}
      {(teacherLoggedIn || adminLoggedIn || studentLoggedIn) && (
        <div className={`w-full ${adminLoggedIn ? 'bg-gradient-to-r from-white to-blue-50' : 'bg-white'} shadow-sm border-b border-gray-200 px-4 py-6 mb-6`}>
          <div className="max-w-7xl w-full mx-auto">
            <div className="flex flex-col">
              {adminLoggedIn ? (
                <>
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-[#0a66c2] font-bold mr-3">
                      {contextUse.name ? contextUse.name.charAt(0).toUpperCase() : 'A'}
                    </div>
                    <h2 className="text-3xl font-medium text-[#191919]">
                      Welcome back, <span className="font-bold text-[#0a66c2]">{contextUse.name}</span>
                    </h2>
                  </div>
                  <p className="text-[#666666] mt-3 ml-13 pl-0.5">Your school management dashboard is ready. Have a productive day!</p>
                </>
              ) : (
                <>
                  <h2 className="text-2xl font-medium text-[#191919]">
                    Welcome back, <span className="font-bold text-[#0a66c2]">{contextUse.name}</span>
                  </h2>
                  <p className="text-[#666666] mt-1">Let's manage your school administration efficiently today.</p>
                 
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10 lg:py-14">
        {/* Hero section - Full width without image */}
        <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden mb-5">
          <div className="p-6 md:p-8">
            <div className="flex flex-col justify-center max-w-3xl">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#191919] leading-tight">
                <span className="block mb-2 text-[#0a66c2]">Nawa Tara English School</span>
                <span className="block">Shaping Tomorrow's Leaders Today</span>
              </h1>
              
              <div className="h-1 w-20 bg-[#0a66c2] my-4 transition-all duration-300 hover:w-32"></div>
              
              <p className="text-lg text-[#666666] max-w-2xl leading-relaxed">
                Providing quality education since 2070 BS, we focus on academic excellence, 
                character development, and innovative learning approaches.
              </p>
              
              <div className="mt-8 flex flex-wrap gap-4">
                <Link to="/notice">
                  <button className="group relative px-8 py-3 text-base font-medium bg-[#0a66c2] text-white rounded transition-all duration-300 hover:bg-[#004182] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0a66c2] overflow-hidden">
                    <span className="relative z-10 flex items-center">
                      View Notices
                      <svg className="ml-2 -mr-1 w-5 h-5 transition-transform duration-300 transform group-hover:translate-x-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd"></path>
                      </svg>
                    </span>
                    <span className="absolute bottom-0 left-0 w-full h-1 bg-[#003264] transform scale-x-0 origin-left transition-transform duration-300 group-hover:scale-x-100"></span>
                  </button>
                </Link>
                
                <Link to="/about-us">
                  <button className="group relative px-8 py-3 text-base font-medium bg-white text-[#0a66c2] border border-[#0a66c2] rounded transition-all duration-300 hover:bg-[#f3f9ff] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0a66c2]">
                    <span className="relative z-10 flex items-center">
                      About Us
                    </span>
                    <span className="absolute bottom-0 left-0 w-full h-1 bg-[#0a66c2] transform scale-x-0 origin-left transition-transform duration-300 group-hover:scale-x-100"></span>
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
        
        {/* Stats cards - LinkedIn style */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow border border-gray-200 p-6 group transition-all duration-300 hover:shadow-md hover:border-[#0a66c2] relative overflow-hidden">
            <div className="absolute left-0 bottom-0 h-1 bg-[#0a66c2] w-0 group-hover:w-full transition-all duration-500"></div>
            <div className="text-[#0a66c2] font-bold text-3xl mb-1">2070 BS</div>
            <div className="text-[#666666] text-sm font-medium">Year Established</div>
            <p className="text-[#191919] mt-2 text-sm">Serving the community with excellence for over a decade</p>
          </div>
          
          <div className="bg-white rounded-lg shadow border border-gray-200 p-6 group transition-all duration-300 hover:shadow-md hover:border-[#0a66c2] relative overflow-hidden">
            <div className="absolute left-0 bottom-0 h-1 bg-[#0a66c2] w-0 group-hover:w-full transition-all duration-500"></div>
            <div className="text-[#0a66c2] font-bold text-3xl mb-1">60+</div>
            <div className="text-[#666666] text-sm font-medium">Dedicated Staff</div>
            <p className="text-[#191919] mt-2 text-sm">Highly qualified teachers and administrative professionals</p>
          </div>
          
          <div className="bg-white rounded-lg shadow border border-gray-200 p-6 group transition-all duration-300 hover:shadow-md hover:border-[#0a66c2] relative overflow-hidden">
            <div className="absolute left-0 bottom-0 h-1 bg-[#0a66c2] w-0 group-hover:w-full transition-all duration-500"></div>
            <div className="text-[#0a66c2] font-bold text-3xl mb-1">500+</div>
            <div className="text-[#666666] text-sm font-medium">Active Students</div>
            <p className="text-[#191919] mt-2 text-sm">Nurturing young minds across different grade levels</p>
          </div>
        </div>
        
        {/* Features section - Similar to LinkedIn's content cards */}
        <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden mb-6">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-[#191919]">Why Choose Us</h2>
          </div>
          
          <div className="divide-y divide-gray-200">
            {/* Feature 1 */}
            <div className="p-6 group hover:bg-[#f3f9ff] transition-all duration-300">
              <div className="flex items-start space-x-4">
                <div className="rounded-full bg-[#e7f3ff] p-3 group-hover:bg-[#d0e8ff] transition-colors duration-300">
                  <svg className="w-6 h-6 text-[#0a66c2]" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-[#191919] group-hover:text-[#0a66c2] transition-colors duration-300">Academic Excellence</h3>
                  <p className="mt-2 text-[#666666]">Consistently producing top-performing students with 95% distinction rates in board exams. Our curriculum is designed to foster critical thinking and problem-solving skills.</p>
                </div>
              </div>
            </div>
            
            {/* Feature 2 */}
            <div className="p-6 group hover:bg-[#f3f9ff] transition-all duration-300">
              <div className="flex items-start space-x-4">
                <div className="rounded-full bg-[#e7f3ff] p-3 group-hover:bg-[#d0e8ff] transition-colors duration-300">
                  <svg className="w-6 h-6 text-[#0a66c2]" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M10 1.944A11.954 11.954 0 012.166 5C2.056 5.649 2 6.319 2 7c0 5.225 3.34 9.67 8 11.317C14.66 16.67 18 12.225 18 7c0-.682-.057-1.35-.166-2.001A11.954 11.954 0 0110 1.944zM11 14a1 1 0 11-2 0 1 1 0 012 0zm0-7a1 1 0 10-2 0v3a1 1 0 102 0V7z" clipRule="evenodd"></path>
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-[#191919] group-hover:text-[#0a66c2] transition-colors duration-300">Modern Facilities</h3>
                  <p className="mt-2 text-[#666666]">State-of-the-art computer labs, science labs, library, and sports facilities. Our campus provides the optimal environment for learning and development.</p>
                </div>
              </div>
            </div>
            
            {/* Feature 3 */}
            <div className="p-6 group hover:bg-[#f3f9ff] transition-all duration-300">
              <div className="flex items-start space-x-4">
                <div className="rounded-full bg-[#e7f3ff] p-3 group-hover:bg-[#d0e8ff] transition-colors duration-300">
                  <svg className="w-6 h-6 text-[#0a66c2]" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"></path>
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-[#191919] group-hover:text-[#0a66c2] transition-colors duration-300">Extracurricular Focus</h3>
                  <p className="mt-2 text-[#666666]">Regular sports events, cultural programs, and educational tours to develop well-rounded students. We believe in holistic education beyond textbooks.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Call to action - Updated with proper Link to Contact Us page */}
        <div id="contact-us" className="bg-[#f3f9ff] border border-[#d0e8ff] rounded-lg p-6 flex flex-col md:flex-row items-center justify-between">
          <div className="mb-4 md:mb-0">
            <h3 className="text-lg font-semibold text-[#0a66c2]">Ready to experience quality education?</h3>
            <p className="text-[#666666] mt-1">Join our community of students and parents today.</p>
          </div>
          <Link to="/contact-us">
            <button className="group relative px-6 py-2 text-base font-medium bg-[#0a66c2] text-white rounded transition-all duration-300 hover:bg-[#004182] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0a66c2]">
              <span className="flex items-center">
                Contact Us
                <svg className="ml-2 w-4 h-4 transition-transform duration-300 transform group-hover:translate-x-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd"></path>
                </svg>
              </span>
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;