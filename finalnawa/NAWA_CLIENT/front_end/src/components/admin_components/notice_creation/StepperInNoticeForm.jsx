import React from "react";

const StepperInNoticeForm = ({ stepCount }) => {
  // NAWATARA STYLE step labels
  const steps = [
    { id: 1, name: "Category & Audience" },
    { id: 2, name: "Content" },
    { id: 3, name: "Attachments" },
  ];

  return (
    <div className="mb-8">
      <div className="hidden sm:flex items-center">
        {steps.map((step, index) => (
          <React.Fragment key={step.id}>
            {/* Step indicator */}
            <div className="flex flex-col items-center">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                stepCount >= step.id 
                  ? "border-[#0a66c2] bg-[#0a66c2] text-white" 
                  : "border-[#e0e0e0] bg-white text-[#666666]"
              } font-medium text-sm transition-all duration-200`}>
                {stepCount > step.id ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                ) : (
                  step.id
                )}
              </div>
              <p className={`mt-2 text-xs font-medium ${
                stepCount >= step.id ? "text-[#0a66c2]" : "text-[#666666]"
              }`}>
                {step.name}
              </p>
            </div>
            
            {/* Connector line between steps */}
            {index < steps.length - 1 && (
              <div className="flex-auto mx-2">
                <div className={`h-0.5 ${
                  stepCount > index + 1 ? "bg-[#0a66c2]" : "bg-[#e0e0e0]"
                } transition-colors duration-200`}></div>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
      
      {/* Mobile version - simpler with just numbers */}
      <div className="sm:hidden flex justify-between items-center">
        {steps.map((step) => (
          <div key={step.id} className="flex flex-col items-center">
            <div className={`flex items-center justify-center w-7 h-7 rounded-full border-2 ${
              stepCount >= step.id 
                ? "border-[#0a66c2] bg-[#0a66c2] text-white" 
                : "border-[#e0e0e0] bg-white text-[#666666]"
            } font-medium text-xs transition-all duration-200`}>
              {stepCount > step.id ? (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              ) : (
                step.id
              )}
            </div>
            <p className={`mt-1 text-[10px] font-medium ${
              stepCount >= step.id ? "text-[#0a66c2]" : "text-[#666666]"
            }`}>
              {step.name}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StepperInNoticeForm;