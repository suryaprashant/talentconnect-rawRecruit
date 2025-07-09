// import React, { useState } from "react";
// import IntroduceYourself from "./Introduction";
// import ConnectToCompany from "./ConnecToCompany";
// import DefineHiringPreferences from "./HiringPrefrences";
// import Welcome from "./Welcome"; // Import the Welcome component
// import TermsAndConditions from "./TermsCondition";
// import { Navigate, useNavigate } from "react-router-dom";

// const OnboardingFlowForm = () => {
//   const [currentStep, setCurrentStep] = useState(0); // Start with 0 for Welcome
//   const [formData, setFormData] = useState({});
//   const navigate = useNavigate() ;
//   const updateFormData = (newData) => {
//     setFormData(prev => ({ ...prev, ...newData }));
//   };

//   const nextStep = () => {
//     setCurrentStep(prev => prev + 1); // Simplified navigation
//   };

//   const prevStep = () => {
//     setCurrentStep(prev => prev - 1);
//   };

//   const handleSubmit = () => {
//     console.log('Form submitted:', formData);
//     alert('Registration completed successfully!');
//     navigate('/home');
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 py-12 px-4">
//       <div className="max-w-md mx-auto">
//         {currentStep === 0 && (
//           <Welcome onNext={nextStep} /> 
//         )}
//         {currentStep === 1 && (
//           <IntroduceYourself
//             onNext={nextStep}
//             onBack={prevStep}
//             formData={formData}
//             updateFormData={updateFormData}
//           />
//         )}
//         {currentStep === 2 && (
//           <ConnectToCompany
//             onNext={nextStep}
//             onBack={prevStep}
//             formData={formData}
//             updateFormData={updateFormData}
//           />
//         )}
//         {currentStep === 3 && (
//           <DefineHiringPreferences
//             onBack={prevStep}
//             formData={formData}
//              onNext={nextStep}
//             updateFormData={updateFormData}
           
//           />
//         )}
//            {currentStep === 4 && (
//           <TermsAndConditions onNext={nextStep} 
//            onBack={prevStep}
//             formData={formData}
//             updateFormData={updateFormData}
//            onSubmit={handleSubmit}
//           /> 
          
//         )}
//       </div>
//     </div>
//   );
// };
// export default OnboardingFlowForm;


import React, { useState } from "react";
import IntroduceYourself from "./Introduction";
import ConnectToCompany from "./ConnecToCompany";
import DefineHiringPreferences from "./HiringPrefrences";
import Welcome from "./Welcome";
import TermsAndConditions from "./TermsCondition";
import { useNavigate } from "react-router-dom"; // Ensure Navigate is not used if not needed
import axios from "axios";

const OnboardingFlowForm = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({});
  const navigate = useNavigate();

  const updateFormData = (newData) => {
    setFormData((prev) => ({ ...prev, ...newData }));
  };

  const nextStep = () => {
    setCurrentStep((prev) => prev + 1);
  };

  const prevStep = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const handleSubmit = async () => {
    try {
      const finalFormData = new FormData();

      // Prepare employerDetails
      const employerDetails = {
        name: formData.name,
        designation: formData.designation,
        workEmail: formData.email, // Map 'email' from frontend to 'workEmail' for backend
        mobile: formData.mobile,
        linkedIn: formData.linkedin, // Map 'linkedin' from frontend to 'linkedIn' for backend
      };
      finalFormData.append("employerDetails", JSON.stringify(employerDetails));

      // Append image files if they exist
      if (formData.profileImage) {
        finalFormData.append("profileImage", formData.profileImage);
      }
      if (formData.backgroundImage) {
        finalFormData.append("backgroundImage", formData.backgroundImage);
      }

      // Prepare companyDetails
      const companyDetails = {
        companyName: formData.companyName,
        location: formData.companyLocation, // Map 'companyLocation' to 'location'
        state: formData.state,
        city: formData.city,
        country: formData.country,
        pincode: formData.pincode,
        // companyType, industryType, establishedYear, contactNumber are in backend schema
        // but not collected in frontend, so they will be omitted or default on backend.
      };
      finalFormData.append("companyDetails", JSON.stringify(companyDetails));

      // Prepare hiringPreferences
      const hiringPreferences = {
        jobRoles: formData.jobRoles || [],
        hiringLocations: formData.hiringLocations || [],
        lookingFor: formData.lookingFor,
        employmentTypes: formData.employmentType ? [formData.employmentType] : [], // Ensure it's an array
      };
      finalFormData.append("hiringPreferences", JSON.stringify(hiringPreferences));

      // const response = await fetch("/api/dashboard/employerOnboarding", {
      //   method: "POST",
      //   body: finalFormData,
      //   // No 'Content-Type' header needed for FormData; the browser sets it automatically
      //   // as 'multipart/form-data' with the correct boundary.
      // });

      const response =await axios.post(`${import.meta.env.VITE_Backend_URL}/api/dashboard/employerOnboarding`)

      const data = await response.json();

      if (response.ok) {
        console.log("Onboarding created successfully:", data.profile);
        alert("Registration completed successfully!");
        navigate("/home"); // Navigate after successful submission
      } else {
        console.error("Failed to create onboarding:", data.message || "Unknown error");
        alert(
          `Failed to complete registration: ${data.message || "Please try again."}`
        );
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("An unexpected error occurred during registration. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4">
      <div className="max-w-md mx-auto">
        {currentStep === 0 && <Welcome onNext={nextStep} />}
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
          <TermsAndConditions
            onNext={nextStep}
            onBack={prevStep}
            formData={formData}
            updateFormData={updateFormData}
            onSubmit={handleSubmit} // Pass the handleSubmit function
          />
        )}
      </div>
    </div>
  );
};
export default OnboardingFlowForm;