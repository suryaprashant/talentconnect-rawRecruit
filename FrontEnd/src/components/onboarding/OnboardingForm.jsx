/*
import React, { useState } from "react";
import { X } from "lucide-react";
import { Welcome } from "./formSteps/Welcome";
import { StepOne } from "./formSteps/StepOne";
import { StepTwo } from "./formSteps/StepTwo";
import { StepThree } from "./formSteps/StepThree";
import { StepFour } from "./formSteps/StepFour";
import { StepFive } from "./formSteps/StepFive";
import { Confirmation } from "./formSteps/Confirmation";
import { FresherStepThree } from "./formSteps/FresherStepThree";
import { FresherStepFour } from "./formSteps/FresherStepFour";
import { ProfessionalStepFour } from "./formSteps/ProfessionalStepFour";
import { useRole } from "@/context/RoleContext/RoleContext";
import {StepSix} from "./formSteps/StepSix"; 
import { ProfessionalDetailsStep } from "./formSteps/ProfessionalDetailsStep";

export const OnboardingForm = () => {
  const [currentStep, setCurrentStep] = useState(0);

  const {
    selectedRole,
    setSelectedRole,
    formData,
    updateFormData,
    clearData,
  } = useRole();


  const handleNext = () => setCurrentStep((prev) => prev + 1);
  const handleBack = () => setCurrentStep((prev) => prev - 1);

  const handleCancel = () => {
    if (confirm("Are you sure you want to cancel? All progress will be lost.")) {
      clearData();
      setCurrentStep(0);
    }
  };

  const handleSubmit = () => {
    console.log("Onboarding process completed.");
    setCurrentStep(0);
  };

  const handleProfileTypeSelection = (profileType) => {
    setSelectedRole(profileType);
  };

  const handleFormDataChange = (newData) => {
    updateFormData(newData);
  };

  const renderStep = () => {
    const role = selectedRole?.toLowerCase();
    switch (currentStep) {
      case 0: return <Welcome onNext={handleNext} onCancel={handleCancel} />;
      case 1: return <StepOne onNext={handleNext} onCancel={handleCancel} formData={formData} onChange={handleFormDataChange} />;
      case 2: return <StepTwo  onNext={handleNext} onBack={handleBack} onProfileTypeSelect={handleProfileTypeSelection} formData={formData} onChange={handleFormDataChange} />;
      case 3: return <StepThree onNext={handleNext} onBack={handleBack} formData={formData} onChange={handleFormDataChange} />;
      case 4:
        if (role === "professional") {
          return <ProfessionalStepFour onNext={handleNext} onBack={handleBack} formData={formData} onChange={handleFormDataChange} />;
        } else if (role === "fresher") {
          return <FresherStepFour onNext={handleNext} onBack={handleBack} formData={formData} onChange={handleFormDataChange} />;
        } else {
          return <StepFour onNext={handleNext} onBack={handleBack} formData={formData} onChange={handleFormDataChange} />;
        }
      case 5: return <StepFive onNext={handleNext} onBack={handleBack} formData={formData} onChange={handleFormDataChange} />;
      case 6: 
        return <StepSix onNext={handleNext} onBack={handleBack} formData={formData} onChange={handleFormDataChange} />;
      
      case 7: 
      if(role == "professional"){
        return <ProfessionalDetailsStep onNext={handleNext} onBack={handleBack} formData={formData} onChange={handleFormDataChange} /> ;
      }
      else{
        return <Confirmation onSubmit={handleSubmit} onCancel={handleBack} />;
      }
      case 8: return <Confirmation onSubmit={handleSubmit} onCancel={handleBack} />;
      default: return <Welcome onNext={handleNext} onCancel={handleCancel} />;
    }
  };

  return (
    <div className="bg-white overflow-hidden">
      <div className="bg-[rgba(0,0,0,0.25)] relative flex min-h-[900px] w-full items-start justify-center p-16 py-28">
        {renderStep()}
        <button onClick={handleCancel} className="absolute w-6 h-6 right-4 top-4 text-white cursor-pointer" aria-label="Close">
          <X className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};
*/
import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Welcome } from "./formSteps/Welcome";
import { StepOne } from "./formSteps/StepOne";
import { StepTwo } from "./formSteps/StepTwo";
import { StepThree } from "./formSteps/StepThree";
import { StepFour } from "./formSteps/StepFour";
import { StepFive } from "./formSteps/StepFive";
import { Confirmation } from "./formSteps/Confirmation";
import { FresherStepThree } from "./formSteps/FresherStepThree";
import { FresherStepFour } from "./formSteps/FresherStepFour";
import { ProfessionalStepFour } from "./formSteps/ProfessionalStepFour";
import { useRole } from "@/context/RoleContext/RoleContext";
import { StepSix } from "./formSteps/StepSix"; 
import { ProfessionalDetailsStep } from "./formSteps/ProfessionalDetailsStep";

const STEP_STORAGE_KEY = 'candidateOnboardingCurrentStep';

export const OnboardingForm = () => {
  // Load current step from sessionStorage on mount
  const [currentStep, setCurrentStep] = useState(() => {
    try {
      const savedStep = sessionStorage.getItem(STEP_STORAGE_KEY);
      // Only restore step if it's a valid number, otherwise start from 0
      if (savedStep) {
        const stepNumber = parseInt(savedStep, 10);
        return !isNaN(stepNumber) && stepNumber >= 0 ? stepNumber : 0;
      }
      return 0;
    } catch (error) {
      console.error("Error reading current step from sessionStorage:", error);
      return 0;
    }
  });

  const {
    selectedRole,
    setSelectedRole,
    formData,
    updateFormData,
    clearData,
  } = useRole();

  // Save current step to sessionStorage whenever it changes
  useEffect(() => {
    try {
      sessionStorage.setItem(STEP_STORAGE_KEY, currentStep.toString());
    } catch (error) {
      console.error("Error saving current step to sessionStorage:", error);
    }
  }, [currentStep]);

  const handleNext = () => setCurrentStep((prev) => prev + 1);
  const handleBack = () => setCurrentStep((prev) => prev - 1);

  const handleCancel = () => {
    if (confirm("Are you sure you want to cancel? All progress will be lost.")) {
      clearData(); // This will clear the role and formData from sessionStorage
      setCurrentStep(0);
      try {
        sessionStorage.removeItem(STEP_STORAGE_KEY);
      } catch (error) {
        console.error("Error removing step from sessionStorage:", error);
      }
    }
  };

  const handleSubmit = () => {
    console.log("Onboarding process completed.");
    setCurrentStep(0);
    try {
      sessionStorage.removeItem(STEP_STORAGE_KEY);
    } catch (error) {
      console.error("Error removing step from sessionStorage:", error);
    }
  };

  const handleProfileTypeSelection = (profileType) => {
    setSelectedRole(profileType);
  };

  const handleFormDataChange = (newData) => {
    updateFormData(newData);
  };

  const renderStep = () => {
    const role = selectedRole?.toLowerCase();
    switch (currentStep) {
      case 0: return <Welcome onNext={handleNext} onCancel={handleCancel} />;
      case 1: return <StepOne onNext={handleNext} onCancel={handleCancel} formData={formData} onChange={handleFormDataChange} />;
      case 2: return <StepTwo onNext={handleNext} onBack={handleBack} onProfileTypeSelect={handleProfileTypeSelection} formData={formData} onChange={handleFormDataChange} />;
      case 3: return <StepThree onNext={handleNext} onBack={handleBack} formData={formData} onChange={handleFormDataChange} />;
      case 4:
        if (role === "professional") {
          return <ProfessionalStepFour onNext={handleNext} onBack={handleBack} formData={formData} onChange={handleFormDataChange} />;
        } else if (role === "fresher") {
          return <FresherStepFour onNext={handleNext} onBack={handleBack} formData={formData} onChange={handleFormDataChange} />;
        } else {
          return <StepFour onNext={handleNext} onBack={handleBack} formData={formData} onChange={handleFormDataChange} />;
        }
      case 5: return <StepFive onNext={handleNext} onBack={handleBack} formData={formData} onChange={handleFormDataChange} />;
      case 6: 
        return <StepSix onNext={handleNext} onBack={handleBack} formData={formData} onChange={handleFormDataChange} />;
      
      case 7: 
        if (role === "professional") {
          return <ProfessionalDetailsStep onNext={handleNext} onBack={handleBack} formData={formData} onChange={handleFormDataChange} />;
        } else {
          return <Confirmation onSubmit={handleSubmit} onCancel={handleBack} />;
        }
      case 8: return <Confirmation onSubmit={handleSubmit} onCancel={handleBack} />;
      default: return <Welcome onNext={handleNext} onCancel={handleCancel} />;
    }
  };

  return (
    <div className="bg-white overflow-hidden">
      <div className="bg-[rgba(0,0,0,0.25)] relative flex min-h-[900px] w-full items-start justify-center p-16 py-28">
        {renderStep()}
        <button onClick={handleCancel} className="absolute w-6 h-6 right-4 top-4 text-white cursor-pointer" aria-label="Close">
          <X className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};