// import React, { useState, useEffect } from "react";
// import { useLocation } from "react-router-dom";
// import { useAuth } from "../../context/AuthProvider";
// import React, { useState } from "react";
// import { X } from "lucide-react";
// import { Welcome } from "./formSteps/Welcome";
// import { StepOne } from "./formSteps/StepOne";
// import { StepTwo } from "./formSteps/StepTwo";
// import { StepThree } from "./formSteps/StepThree";
// import { StepFour } from "./formSteps/StepFour";
// import { StepFive } from "./formSteps/StepFive";
// import { Confirmation } from "./formSteps/Confirmation";
// import { FresherStepThree } from "./formSteps/FresherStepThree";
// import { FresherStepFour } from "./formSteps/FresherStepFour";
// import { ProfessionalStepFour } from "./formSteps/ProfessionalStepFour";
// import { useRole } from "@/context/RoleContext/RoleContext";
// import {StepSix} from "./formSteps/StepSix"; 
// import { ProfessionalDetailsStep } from "./formSteps/ProfessionalDetailsStep";

// export const OnboardingForm = () => {
//   const [currentStep, setCurrentStep] = useState(0);

//   const {
//     selectedRole,
//     setSelectedRole,
//     formData,
//     updateFormData,
//     clearData,
//   } = useRole();

//   const [authUser] = useAuth();
//   const location = useLocation();

//   useEffect(() => {
//     // Prefer data from auth context; fall back to query string if needed
//     const params = new URLSearchParams(location.search);
//     const qsName = params.get("name");
//     const qsEmail = params.get("email");
//     const qsProvider = params.get("authProvider");

//     const srcUser =
//       authUser && authUser.user
//         ? authUser.user
//         : {
//             name: qsName,
//             email: qsEmail,
//             authProvider: qsProvider,
//           };

//     if (!srcUser || srcUser.authProvider !== "linkedin") return;

//     const hasName = !!formData?.name;
//     const hasEmail = !!formData?.email;

//     // Only overwrite if the form is empty, to avoid clobbering edits
//     if (!hasName || !hasEmail) {
//       updateFormData({
//         ...formData,
//         name: hasName ? formData.name : srcUser.name || "",
//         email: hasEmail ? formData.email : srcUser.email || "",
//       });
//     }
//   }, [authUser, formData, location.search, updateFormData]);


//   const handleNext = () => setCurrentStep((prev) => prev + 1);
//   const handleBack = () => setCurrentStep((prev) => prev - 1);

//   const handleCancel = () => {
//     if (confirm("Are you sure you want to cancel? All progress will be lost.")) {
//       clearData(); // This will clear the role and formData.
//       setCurrentStep(0);
//     }
//   };

//   const handleSubmit = () => {
//     console.log("Onboarding process completed.");
//     setCurrentStep(0);
//   };

//   const handleProfileTypeSelection = (profileType) => {
//     setSelectedRole(profileType);
//   };

//   const handleFormDataChange = (newData) => {
//     updateFormData(newData);
//   };

//   const renderStep = () => {
//     const role = selectedRole?.toLowerCase();
//     switch (currentStep) {
//       case 0: return <Welcome onNext={handleNext} onCancel={handleCancel} />;
//       case 1: return <StepOne onNext={handleNext} onCancel={handleCancel} formData={formData} onChange={handleFormDataChange} />;
//       case 2: return <StepTwo  onNext={handleNext} onBack={handleBack} onProfileTypeSelect={handleProfileTypeSelection} formData={formData} onChange={handleFormDataChange} />;
//       // case 3:
//       //   return role === "fresher" 
//       //     ? <FresherStepThree onNext={handleNext} onBack={handleBack} formData={formData} onChange={handleFormDataChange} />
//       //     : <StepThree onNext={handleNext} onBack={handleBack} formData={formData} onChange={handleFormDataChange} />;
//       case 3: return <StepThree onNext={handleNext} onBack={handleBack} formData={formData} onChange={handleFormDataChange} />;
//       case 4:
//         if (role === "professional") {
//           return <ProfessionalStepFour onNext={handleNext} onBack={handleBack} formData={formData} onChange={handleFormDataChange} />;
//         } else if (role === "fresher") {
//           return <FresherStepFour onNext={handleNext} onBack={handleBack} formData={formData} onChange={handleFormDataChange} />;
//         } else {
//           return <StepFour onNext={handleNext} onBack={handleBack} formData={formData} onChange={handleFormDataChange} />;
//         }
//       case 5: return <StepFive onNext={handleNext} onBack={handleBack} formData={formData} onChange={handleFormDataChange} />;
//       case 6: 
//         return <StepSix onNext={handleNext} onBack={handleBack} formData={formData} onChange={handleFormDataChange} />;
      
//       case 7: 
//       if(role == "professional"){
//         return <ProfessionalDetailsStep onNext={handleNext} onBack={handleBack} formData={formData} onChange={handleFormDataChange} /> ;
//       }
//       else{
//         return <Confirmation onSubmit={handleSubmit} onCancel={handleBack} />;
//       }
//       case 8: return <Confirmation onSubmit={handleSubmit} onCancel={handleBack} />;
//       default: return <Welcome onNext={handleNext} onCancel={handleCancel} />;
//     }
//   };

//   return (
//     <div className="bg-white overflow-hidden">
//       <div className="bg-[rgba(0,0,0,0.25)] relative flex min-h-[900px] w-full items-start justify-center p-16 py-28">
//         {renderStep()}
//         <button onClick={handleCancel} className="absolute w-6 h-6 right-4 top-4 text-white cursor-pointer" aria-label="Close">
//           <X className="w-6 h-6" />
//         </button>
//       </div>
//     </div>
//   );
// };

// OnboardingForm.jsx
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthProvider";

import { X } from "lucide-react";
import { Welcome } from "./formSteps/Welcome";
import { StepOne } from "./formSteps/StepOne";
import { StepTwo } from "./formSteps/StepTwo";
import { StepThree } from "./formSteps/StepThree";
import { StepFour } from "./formSteps/StepFour";
import { StepFive } from "./formSteps/StepFive";
import { StepSix } from "./formSteps/StepSix";
import { Confirmation } from "./formSteps/Confirmation";
import { FresherStepThree } from "./formSteps/FresherStepThree";
import { FresherStepFour } from "./formSteps/FresherStepFour";
import { ProfessionalStepFour } from "./formSteps/ProfessionalStepFour";
import { ProfessionalDetailsStep } from "./formSteps/ProfessionalDetailsStep";
import { useRole } from "@/context/RoleContext/RoleContext";

export const OnboardingForm = () => {
  const [currentStep, setCurrentStep] = useState(0);

  const {
    selectedRole,
    setSelectedRole,
    formData,
    updateFormData,
    clearData,
  } = useRole();

  const [authUser] = useAuth();
  const location = useLocation();

  // Prefill name/email for LinkedIn-created users
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const qsName = params.get("name");
    const qsEmail = params.get("email");
    const qsProvider = params.get("authProvider");

    // Prefer AuthProvider user; fall back to query string
    const srcUser =
      authUser?.user ??
      (qsName || qsEmail
        ? { name: qsName, email: qsEmail, authProvider: qsProvider }
        : null);

    if (!srcUser || srcUser.authProvider !== "linkedin") return;

    const hasName = !!formData?.name;
    const hasEmail = !!formData?.email;

    // Only fill fields that are currently empty
    if (!hasName || !hasEmail) {
      updateFormData({
        ...formData,
        name: hasName ? formData.name : srcUser.name || "",
        email: hasEmail ? formData.email : srcUser.email || "",
      });
    }
  }, [authUser, formData, location.search, updateFormData]);

  const handleNext = () => setCurrentStep((prev) => prev + 1);
  const handleBack = () => setCurrentStep((prev) => prev - 1);

  const handleCancel = () => {
    if (confirm("Are you sure you want to cancel? All progress will be lost.")) {
      clearData(); // This will clear the role and formData.
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
      // case 3:
      //   return role === "fresher" 
      //     ? <FresherStepThree onNext={handleNext} onBack={handleBack} formData={formData} onChange={handleFormDataChange} />
      //     : <StepThree onNext={handleNext} onBack={handleBack} formData={formData} onChange={handleFormDataChange} />;
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
