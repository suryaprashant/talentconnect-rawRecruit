// // OnboardingForm.jsx with enhanced role-based form selection and local storage
// import React, { useState, useEffect } from "react";
// import { X } from "lucide-react";
// import { Welcome } from "./FormSteps/Welcome";
// import { StepOne } from "./FormSteps/StepOne";
// import { StepTwo } from "./FormSteps/StepTwo";
// import { StepThree } from "./FormSteps/StepThree";
// import { StepFour } from "./FormSteps/StepFour";
// import { StepFive } from "./FormSteps/StepFive";
// import { Confirmation } from "./FormSteps/Confirmation";
// import { FresherStepThree } from "./FormSteps/FresherStepThree";
// import { FresherStepFour } from "./FormSteps/FresherStepFour";
// import { ProfessionalStepFour } from "./FormSteps/ProfessionalStepFour";
// import { useRole } from "@/context/RoleContext/RoleContext";

// export const OnboardingForm = () => {
//   const [currentStep, setCurrentStep] = useState(() => {
//     // Try to restore step from localStorage if available
//     const savedStep = localStorage.getItem('currentStep');
//     return savedStep ? parseInt(savedStep, 10) : 0;
//   });
  
//   const { 
//     selectedRole, 
//     setSelectedRole, 
//     formData, 
//     updateFormData, 
//     clearData 
//   } = useRole();

//   // Save current step to localStorage whenever it changes
//   useEffect(() => {
//     localStorage.setItem('currentStep', currentStep.toString());
//   }, [currentStep]);

//   const handleNext = () => {
//     setCurrentStep((prev) => prev + 1);
//   };

//   const handleBack = () => {
//     setCurrentStep((prev) => prev - 1);
//   };

//   const handleCancel = () => {
//     if (
//       confirm(
//         "Are you sure you want to cancel? All your progress will be lost.",
//       )
//     ) {
//       setCurrentStep(0);
//       clearData(); // This will clear selectedRole, formData, and remove them from localStorage
//     }
//   };

//   const handleSubmit = () => {
//     console.log("Form submitted with data:", formData);
//     alert("Form submitted successfully!");
//     setCurrentStep(0);
//     clearData(); // This will clear selectedRole, formData, and remove them from localStorage
//   };

//   const handleProfileTypeSelection = (profileType) => {
//     setSelectedRole(profileType);
//   };

//   const handleFormDataChange = (newData) => {
//     updateFormData(newData);
//   };

//   // Helper function to determine if professional or fresher forms should be used
//   const shouldUseProfessionalForms = () => {
//     return selectedRole === "professional" || selectedRole === "fresher";
//   };

//   const renderStep = () => {
//     switch (currentStep) {
//       case 0:
//         return <Welcome onNext={handleNext} onCancel={handleCancel} />;
//       case 1:
//         return <StepOne 
//           onNext={handleNext} 
//           onCancel={handleCancel}
//           formData={formData}
//           onChange={handleFormDataChange} 
//         />;
//       case 2:
//         return <StepTwo 
//           onNext={handleNext} 
//           onCancel={handleBack}
//           onProfileTypeSelect={handleProfileTypeSelection}
//           formData={formData}
//           onChange={handleFormDataChange}
//           selectedRole={selectedRole}
//         />;
//       case 3:
//         // Choose between student and professional forms for step 3
//         return shouldUseProfessionalForms() ? (
//           <FresherStepThree 
//             onNext={handleNext} 
//             onBack={handleBack} 
//             onCancel={handleCancel}
//             formData={formData}
//             onChange={handleFormDataChange}
//           />
//         ) : (
//           <StepThree 
//             onNext={handleNext} 
//             onBack={handleBack} 
//             onCancel={handleCancel}
//             formData={formData}
//             onChange={handleFormDataChange}
//           />
//         );
//       case 4:
//         // Choose between different form steps based on role
//         if (selectedRole === "professional") {
//           return (
//             <ProfessionalStepFour 
//               onNext={handleNext} 
//               onBack={handleBack}
//               formData={formData}
//               onChange={handleFormDataChange}
//             />
//           );
//         } else if (selectedRole === "fresher") {
//           return (
//             <FresherStepFour 
//               onNext={handleNext} 
//               onBack={handleBack}
//               formData={formData}
//               onChange={handleFormDataChange}
//             />
//           );
//         } else {
//           return (
//             <StepFour 
//               onNext={handleNext} 
//               onBack={handleBack}
//               formData={formData}
//               onChange={handleFormDataChange}
//             />
//           );
//         }
//       case 5:
//         return <StepFive 
//           onNext={handleNext} 
//           onBack={handleBack}
//           formData={formData}
//           onChange={handleFormDataChange}
//         />;
//       case 6:
//         return <Confirmation 
//           onSubmit={handleSubmit} 
//           onCancel={handleBack}
//           formData={formData}
//         />;
//       default:
//         return <Welcome onNext={handleNext} onCancel={handleCancel} />;
//     }
//   };

//   return (
//     <div className="bg-white overflow-hidden">
//       <div className="bg-[rgba(0,0,0,0.25)] relative flex min-h-[900px] w-full items-start gap-[40px_80px] overflow-hidden justify-center px-16 py-28 max-md:max-w-full max-md:px-5 max-md:py-[100px]">
//         {renderStep()}
//         <button
//           onClick={handleCancel}
//           className="aspect-[1] object-contain w-6 absolute z-0 shrink-0 h-6 right-4 top-4 text-white cursor-pointer"
//           aria-label="Close"
//         >
//           <X className="w-6 h-6" />
//         </button>
//       </div>
//     </div>
//   );
// };








// OnboardingForm.jsx with enhanced role-based form selection and local storage
import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Welcome } from "./FormSteps/Welcome";
import { StepOne } from "./FormSteps/StepOne";
import { StepTwo } from "./FormSteps/StepTwo";
import { StepThree } from "./FormSteps/StepThree";
import { StepFour } from "./FormSteps/StepFour";
import { StepFive } from "./FormSteps/StepFive";
import { Confirmation } from "./FormSteps/Confirmation"; // This one is modified
import { FresherStepThree } from "./FormSteps/FresherStepThree";
import { FresherStepFour } from "./FormSteps/FresherStepFour";
import { ProfessionalStepFour } from "./FormSteps/ProfessionalStepFour";
import { useRole } from "@/context/RoleContext/RoleContext";

export const OnboardingForm = () => {
  const [currentStep, setCurrentStep] = useState(() => {
    // Try to restore step from localStorage if available
    const savedStep = localStorage.getItem('currentStep');
    return savedStep ? parseInt(savedStep, 10) : 0;
  });

  const {
    selectedRole,
    // Using setSelectedRole directly from context as it's exposed
    setSelectedRole,
    formData,
    updateFormData,
    clearData
  } = useRole();

  // Save current step to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('currentStep', currentStep.toString());
    } catch (error) {
      console.error("Error saving currentStep to localStorage:", error);
    }
  }, [currentStep]);

  const handleNext = () => {
    setCurrentStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const handleCancel = () => {
    if (
      confirm(
        "Are you sure you want to cancel? All your progress will be lost.",
      )
    ) {
      setCurrentStep(0);
      clearData(); // This will clear selectedRole, formData, and remove them from localStorage, including currentStep
    }
  };

  const handleSubmit = () => {
    // The actual submission to the backend now happens in the Confirmation component.
    // This function can be kept for any post-submission logic needed in OnboardingForm.
    console.log("Onboarding process completed. Data submitted from Confirmation.");
    // No need to clearData here, as Confirmation will call clearData from context upon successful backend submission.
    setCurrentStep(0); // Reset to first step after successful submission (or let Confirmation handle navigation)
  };

  const handleProfileTypeSelection = (profileType) => {
    setSelectedRole(profileType); // Use setSelectedRole from context directly
  };

  const handleFormDataChange = (newData) => {
    updateFormData(newData);
  };


  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <Welcome onNext={handleNext} onCancel={handleCancel} />;
      case 1:
        return <StepOne
          onNext={handleNext}
          onCancel={handleCancel}
          formData={formData}
          onChange={handleFormDataChange}
        />;
      case 2:
        return <StepTwo
          onNext={handleNext}
          onBack={handleBack}
          onProfileTypeSelect={handleProfileTypeSelection}
          formData={formData}
          onChange={handleFormDataChange}
          // selectedRole={selectedRole}
        />;
      case 3:
        // Render FresherStepThree if selectedRole is 'fresher', otherwise default to StepThree
        return selectedRole === "Fresher" ? (
          <FresherStepThree
            onNext={handleNext}
            onBack={handleBack}
            onCancel={handleCancel}
            formData={formData}
            onChange={handleFormDataChange}
          />
        ) : (
          <StepThree // This will be used for 'professional' and other/unset roles
            onNext={handleNext}
            onBack={handleBack}
            onCancel={handleCancel}
            formData={formData}
            onChange={handleFormDataChange}
          />
        );
      case 4:
        // Choose between different form steps based on role
        if (selectedRole === "Professional") {
          return (
            <ProfessionalStepFour
              onNext={handleNext}
              onBack={handleBack}
              formData={formData}
              onChange={handleFormDataChange}
            />
          );
        } else if (selectedRole === "Fresher") {
          return (
            <FresherStepFour
              onNext={handleNext}
              onBack={handleBack}
              formData={formData}
              onChange={handleFormDataChange}
            />
          );
        } else {
          return (
            <StepFour // Default for other roles or if not yet selected
              onNext={handleNext}
              onBack={handleBack}
              formData={formData}
              onChange={handleFormDataChange}
            />
          );
        }
      case 5:
        return <StepFive
          onNext={handleNext}
          onBack={handleBack}
          formData={formData}
          onChange={handleFormDataChange}
        />;
      case 6:
        return <Confirmation
          onSubmit={handleSubmit} // This onSubmit from OnboardingForm will be called after backend submission.
          onCancel={handleBack}
          // formData and selectedRole are accessed directly by Confirmation from context.
        />;
      default:
        return <Welcome onNext={handleNext} onCancel={handleCancel} />;
    }
  };

  return (
    <div className="bg-white overflow-hidden">
      <div className="bg-[rgba(0,0,0,0.25)] relative flex min-h-[900px] w-full items-start gap-[40px_80px] overflow-hidden justify-center px-16 py-28 max-md:max-w-full max-md:px-5 max-md:py-[100px]">
        {renderStep()}
        <button
          onClick={handleCancel}
          className="aspect-[1] object-contain w-6 absolute z-0 shrink-0 h-6 right-4 top-4 text-white cursor-pointer"
          aria-label="Close"
        >
          <X className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};