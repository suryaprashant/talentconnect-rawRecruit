import React, { useState } from "react";
import IntroduceYourself from "./Introduction";
import ConnectToCompany from "./ConnecToCompany";
import DefineHiringPreferences from "./HiringPrefrences";
import Welcome from "./Welcome"; // Import the Welcome component
import TermsAndConditions from "./TermsCondition";

const OnboardingFlowForm = () => {
  const [currentStep, setCurrentStep] = useState(0); // Start with 0 for Welcome
  const [formData, setFormData] = useState({});

  const updateFormData = (newData) => {
    setFormData(prev => ({ ...prev, ...newData }));
  };

  const nextStep = () => {
    setCurrentStep(prev => prev + 1); // Simplified navigation
  };

  const prevStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = () => {
    console.log('Form submitted:', formData);
    alert('Registration completed successfully!');
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4">
      <div className="max-w-md mx-auto">
        {currentStep === 0 && (
          <Welcome onNext={nextStep} /> 
        )}
        {currentStep === 1 && (
          <IntroduceYourself
            onNext={nextStep}
            onBack={prevStep}
            formData={formData}
            updateFormData={updateFormData}
          />
        )}
        {currentStep === 2 && (
          <ConnectToCompany
            onNext={nextStep}
            onBack={prevStep}
            formData={formData}
            updateFormData={updateFormData}
          />
        )}
        {currentStep === 3 && (
          <DefineHiringPreferences
            onBack={prevStep}
            formData={formData}
             onNext={nextStep}
            updateFormData={updateFormData}
           
          />
        )}
           {currentStep === 4 && (
          <TermsAndConditions onNext={nextStep} 
           onBack={prevStep}
            formData={formData}
            updateFormData={updateFormData}
           onSubmit={handleSubmit}
          /> 
          
        )}
      </div>
    </div>
  );
};
export default OnboardingFlowForm;