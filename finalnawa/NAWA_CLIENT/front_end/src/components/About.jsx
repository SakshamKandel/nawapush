import React from "react";

const About = () => {
  return (
    <div className="min-h-screen bg-[#f3f2ef] py-16 px-4 sm:px-6 lg:px-8 overflow-hidden relative" id="about-container">
      {/* NAWATARA STYLE interactive background */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {/* LinkedIn's subtle dot pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(#3b82f610_1.5px,transparent_1.5px)] [background-size:16px_16px] opacity-70"></div>
        
        {/* LinkedIn's characteristic top blue bar */}
        <div className="absolute top-0 left-0 right-0 h-16 bg-[#0a66c2] opacity-90"></div>
        
        {/* Interactive floating elements */}
        <div className="absolute top-40 right-20 w-[500px] h-[500px] bg-[#0a66c2]/5 rounded-full blur-3xl transform transition-transform duration-1000 ease-out" id="circle1" data-depth="20"></div>
        
        <div className="absolute bottom-40 left-20 w-[500px] h-[500px] bg-[#0073b1]/5 rounded-full blur-3xl transform transition-transform duration-1000 ease-out" id="circle2" data-depth="-20"></div>
        
        <div className="absolute top-1/3 left-1/4 w-16 h-16 bg-[#0a66c2]/10 rounded-full blur-md transform transition-transform duration-700 ease-out" id="small-circle1" data-depth="50"></div>
        
        <div className="absolute bottom-1/3 right-1/4 w-20 h-20 bg-[#0073b1]/10 rounded-full blur-md transform transition-transform duration-700 ease-out" id="small-circle2" data-depth="-40"></div>
      </div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* NAWATARA STYLE top card */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 md:p-8 mb-8">
          <div className="mb-8 max-w-3xl">
            <div className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-medium bg-[#e7f3ff] text-[#0a66c2] mb-6 animate-fade-in">
              <span className="w-2 h-2 rounded-full bg-[#0a66c2] mr-2 animate-pulse"></span>
              Established in 2070 BS (2013 AD)
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-5 animate-fade-in delay-100">
              About Nawa Tara English School
            </h1>
            
            <div className="h-1 w-24 bg-[#0a66c2] rounded mb-6 animate-expand-width"></div>
            
            <p className="text-lg text-gray-600 animate-fade-in delay-200">
              Shaping the future of Nepal's next generation through educational excellence
            </p>
          </div>
          
          {/* NAWATARA STYLE content card with image */}
          <div className="flex flex-col md:flex-row rounded-lg overflow-hidden bg-white border border-gray-200 transform transition-all hover:shadow-lg duration-500">
            <div className="w-full md:w-1/2 relative overflow-hidden group">
              <img
                className="w-full h-80 md:h-full object-cover transition-transform duration-700 group-hover:scale-105"
                src="students.jpg" 
                alt="Students at Nawa Tara English School"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a66c2]/80 via-[#0a66c2]/40 to-transparent opacity-80"></div>
              
              <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                <div className="space-y-2 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                  <h3 className="text-2xl font-bold">Our Mission</h3>
                  <p className="text-white/90">To provide quality education that nurtures creativity, critical thinking, and character development in a supportive environment.</p>
                </div>
              </div>
              
              <div className="absolute top-8 right-8 bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-lg transform rotate-3 hover:rotate-0 transition-transform duration-300">
                <div className="text-center">
                  <div className="text-[#0a66c2] font-bold text-2xl">15+</div>
                  <div className="text-gray-700 text-sm">Years of Excellence</div>
                </div>
              </div>
            </div>
            
            <div className="w-full md:w-1/2 p-8 md:p-10 flex flex-col justify-center relative overflow-hidden">
              {/* NAWATARA STYLE subtle decorative element */}
              <div className="absolute top-0 right-0 w-40 h-40 bg-[#e7f3ff] rounded-full opacity-50 -translate-x-20 -translate-y-20"></div>
              
              <div className="relative z-10">
                <div className="inline-block px-3 py-1 bg-[#e7f3ff] text-[#0a66c2] text-sm font-medium rounded-md mb-6 animate-fade-in">
                  Our Story
                </div>
                
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 animate-fade-in delay-100">
                  Fifteen Years of Educational Excellence
                </h2>
                
                <div className="space-y-4 text-gray-600 animate-fade-in delay-200">
                  <p>
                    Founded in 2070 BS (2013 AD), Nawa Tara English School has established itself as a premier educational institution in Biratnagar, Nepal. We have grown into a thriving community of over 500 learners and 60+ dedicated educators.
                  </p>
                  
                  <p>
                    Our approach to education goes beyond textbooks. We believe in nurturing well-rounded individuals through a blend of academic excellence, character development, and extracurricular activities. Our curriculum is designed to foster critical thinking, creativity, and a lifelong love for learning.
                  </p>
                  
                  <p>
                    At Nawa Tara, we take pride in our modern facilities, innovative teaching methodologies, and commitment to creating a supportive environment where every student can thrive. Our graduates consistently achieve outstanding results and go on to excel in higher education institutions across Nepal and abroad.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* NAWATARA STYLE features section */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 md:p-8 mb-8">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">What makes us different</h2>
            <div className="h-0.5 w-16 bg-[#0a66c2] rounded"></div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 animate-fade-in delay-300">
            <div className="flex items-start space-x-4 group rounded-lg p-4 transition-all duration-300 hover:bg-[#f3f9ff] cursor-pointer border border-transparent hover:border-gray-200">
              <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-[#e7f3ff] flex items-center justify-center text-[#0a66c2] group-hover:bg-[#0a66c2] group-hover:text-white transition-colors duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Quality Education</h3>
                <p className="text-sm text-gray-500 mt-1">Rigorous academic programs tailored to student needs with consistent excellence in board exams</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4 group rounded-lg p-4 transition-all duration-300 hover:bg-[#f3f9ff] cursor-pointer border border-transparent hover:border-gray-200">
              <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-[#e7f3ff] flex items-center justify-center text-[#0a66c2] group-hover:bg-[#0a66c2] group-hover:text-white transition-colors duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Expert Faculty</h3>
                <p className="text-sm text-gray-500 mt-1">Highly qualified educators with specialized training and professional development</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4 group rounded-lg p-4 transition-all duration-300 hover:bg-[#f3f9ff] cursor-pointer border border-transparent hover:border-gray-200">
              <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-[#e7f3ff] flex items-center justify-center text-[#0a66c2] group-hover:bg-[#0a66c2] group-hover:text-white transition-colors duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Modern Facilities</h3>
                <p className="text-sm text-gray-500 mt-1">State-of-the-art computer labs, science labs, library and sports facilities</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4 group rounded-lg p-4 transition-all duration-300 hover:bg-[#f3f9ff] cursor-pointer border border-transparent hover:border-gray-200">
              <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-[#e7f3ff] flex items-center justify-center text-[#0a66c2] group-hover:bg-[#0a66c2] group-hover:text-white transition-colors duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Holistic Development</h3>
                <p className="text-sm text-gray-500 mt-1">Focus on academic, physical, emotional and social growth through diverse activities</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* NAWATARA STYLE School Values Section */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 md:p-8">
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">School Values</h2>
            <div className="h-0.5 w-16 bg-[#0a66c2] rounded"></div>
            <p className="text-gray-600 mt-2">The principles that guide our educational approach</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm transition-all duration-300 hover:shadow-md border border-gray-100 hover:border-gray-200">
              <div className="w-12 h-12 bg-[#e7f3ff] rounded-full mb-4 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#0a66c2]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
              </div>
              <h3 className="font-bold text-lg mb-2 text-gray-900">Innovation</h3>
              <p className="text-gray-600 text-sm">We embrace new ideas and approaches to education, constantly evolving our teaching methods to prepare students for the future.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm transition-all duration-300 hover:shadow-md border border-gray-100 hover:border-gray-200">
              <div className="w-12 h-12 bg-[#e7f3ff] rounded-full mb-4 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#0a66c2]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="font-bold text-lg mb-2 text-gray-900">Community</h3>
              <p className="text-gray-600 text-sm">We foster a supportive environment where students, teachers, and parents work together to create a strong educational community.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm transition-all duration-300 hover:shadow-md border border-gray-100 hover:border-gray-200">
              <div className="w-12 h-12 bg-[#e7f3ff] rounded-full mb-4 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#0a66c2]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="font-bold text-lg mb-2 text-gray-900">Integrity</h3>
              <p className="text-gray-600 text-sm">We uphold the highest standards of honesty, ethics, and responsibility in all our actions and interactions within our school community.</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Improved JavaScript for interactive mouse effects */}
      <script dangerouslySetInnerHTML={{
        __html: `
          document.addEventListener('DOMContentLoaded', () => {
            const container = document.getElementById('about-container');
            const moveElements = document.querySelectorAll('[data-depth]');
            
            const handleMouseMove = (e) => {
              const x = e.clientX / window.innerWidth;
              const y = e.clientY / window.innerHeight;
              
              moveElements.forEach(element => {
                const depth = element.getAttribute('data-depth');
                const moveX = (x - 0.5) * depth;
                const moveY = (y - 0.5) * depth;
                element.style.transform = \`translate(\${moveX}px, \${moveY}px)\`;
              });
            };
            
            container.addEventListener('mousemove', handleMouseMove);
          });
        `
      }} />
      
      {/* Animations CSS */}
      <style>
        {`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes expandWidth {
          from { width: 0; }
          to { width: 6rem; }
        }
        
        .animate-fade-in {
          opacity: 0;
          animation: fadeIn 0.8s ease-out forwards;
        }
        
        .animate-expand-width {
          width: 0;
          animation: expandWidth 1s ease-out forwards;
        }
        
        .delay-100 {
          animation-delay: 100ms;
        }
        
        .delay-200 {
          animation-delay: 200ms;
        }
        
        .delay-300 {
          animation-delay: 300ms;
        }
        `}
      </style>
    </div>
  );
};

export default About;