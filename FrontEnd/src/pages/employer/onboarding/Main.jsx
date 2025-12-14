

// import React, { useState, useEffect } from "react";
// import IntroduceYourself from "./Introduction";
// import ConnectToCompany from "./ConnecToCompany";
// import DefineHiringPreferences from "./HiringPrefrences";
// import Welcome from "./Welcome";
// import TermsAndConditions from "./TermsCondition";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import { useAuth } from "@/context/AuthProvider";

// const OnboardingFlowForm = () => {
//   const [currentStep, setCurrentStep] = useState(0);
//   const [formData, setFormData] = useState({});
//   const navigate = useNavigate();
//   const[authUser , setAuthUser] = useAuth() ;

//    useEffect(() => {
//     if (authUser?.user?.email && !formData.email) {
//       setFormData(prev => ({
//         ...prev,
//         email: authUser.user.email,
//       }));
//     }
//   }, [authUser, formData.email]);

//   const updateFormData = (newData) => {
//     setFormData((prev) => ({ ...prev, ...newData }));
//   };

//   const nextStep = () => {
//     setCurrentStep((prev) => prev + 1);
//   };

//   const prevStep = () => {
//     setCurrentStep((prev) => prev - 1);
//   };
//   console.log("aa gya mail",authUser?.user?.email )
//   const handleSubmit = async () => {
//     try {
//       const finalFormData = new FormData();

   
//       const employerDetails = {
//         name: formData.name,
//         designation: formData.designation,
//         workEmail:formData.email,
//         mobile: formData.mobile,
//         linkedIn: formData.linkedin,
//       };
//       finalFormData.append("employerDetails", JSON.stringify(employerDetails));

    
//       if (formData.profileImage) {
//         finalFormData.append("profileImage", formData.profileImage);
//       }
//       if (formData.backgroundImage) {
//         finalFormData.append("backgroundImage", formData.backgroundImage);
//       }

//       const companyDetails = {
//         companyName: formData.companyName,
//         location: formData.companyLocation,
//         state: formData.state,
//         city: formData.city,
//         country: formData.country,
//         pincode: formData.pincode,
//       };
//       finalFormData.append("companyDetails", JSON.stringify(companyDetails));

  
//       const hiringPreferences = {
//         jobRoles: formData.jobRoles || [],
//         hiringLocations: formData.hiringLocations || [],
//         lookingFor: formData.lookingFor,

//         employmentType:  formData.employmentType || [],
//       };
//       finalFormData.append("hiringPreferences", JSON.stringify(hiringPreferences));

//       const response = await axios.post(
//         `${import.meta.env.VITE_Backend_URL}/api/dashboard/employerOnboarding`,
//         finalFormData,
//         { withCredentials: true }
//       );

//       if(response.data && response.data.user){
//         const updatedUserFromServer = response.data.user ;

//         const finalUser = {
//           ...authUser.user ,
//           ...updatedUserFromServer,
//         };

//         setAuthUser({user : finalUser});
//       }

//       if (response.status === 201) {
//         console.log("Onboarding created successfully:", response.data.profile);
//         alert("Registration completed successfully!");
//         navigate("/home"); 
//       } else {
//         console.error("Failed to create onboarding:", response.data.message || "Unknown error");
//         alert(
//           `Failed to complete registration: ${response.data.message || "Please try again."}`
//         );
//       }
//     } catch (error) {
//       console.error("Error submitting form:", error);
//       const errorMessage = error.response?.data?.message || error.message || "An unexpected error occurred.";
//       alert(`Error during registration: ${errorMessage}`);
      
//       if (error.response) {
//         console.error("Error data:", error.response.data);
//         console.error("Error status:", error.response.status);
//       } else if (error.request) {
//         console.error("Error request:", error.request);
//         alert("No response from server. Please check your network connection.");
//       }
//     }
//   };
//   return (
//     <div className="min-h-screen bg-gray-100 py-12 px-4">
//       <div className="max-w-md mx-auto">
//         {currentStep === 0 && <Welcome onNext={nextStep} />}
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
//             onNext={nextStep}
//             updateFormData={updateFormData}
//           />
//         )}
//         {currentStep === 4 && (
//           <TermsAndConditions
//             onNext={nextStep}
//             onBack={prevStep}
//             formData={formData}
//             updateFormData={updateFormData}
//             onSubmit={handleSubmit}
//           />
//         )}
//       </div>
//     </div>
//   );
// };

// export default OnboardingFlowForm;

import React, { useState, useEffect } from "react";
import IntroduceYourself from "./Introduction";
import ConnectToCompany from "./ConnecToCompany";
import DefineHiringPreferences from "./HiringPrefrences";
import Welcome from "./Welcome";
import TermsAndConditions from "./TermsCondition";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "@/context/AuthProvider";

const STORAGE_KEYS = {
  FORM_DATA: 'employerOnboardingFormData',
  CURRENT_STEP: 'employerOnboardingCurrentStep'
};

const OnboardingFlowForm = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({});
  const navigate = useNavigate();
  const [authUser, setAuthUser] = useAuth();

  // Load data from sessionStorage on component mount (isolated per tab)
  useEffect(() => {
    const savedFormData = sessionStorage.getItem(STORAGE_KEYS.FORM_DATA);
    const savedStep = sessionStorage.getItem(STORAGE_KEYS.CURRENT_STEP);

    if (savedFormData) {
      try {
        const parsedData = JSON.parse(savedFormData);
        setFormData(parsedData);
      } catch (error) {
        console.error('Error parsing saved form data:', error);
      }
    }

    if (savedStep) {
      setCurrentStep(parseInt(savedStep, 10));
    }
  }, []);

  // Save formData to sessionStorage whenever it changes
  useEffect(() => {
    if (Object.keys(formData).length > 0) {
      sessionStorage.setItem(STORAGE_KEYS.FORM_DATA, JSON.stringify(formData));
    }
  }, [formData]);

  // Save current step to sessionStorage whenever it changes
  useEffect(() => {
    sessionStorage.setItem(STORAGE_KEYS.CURRENT_STEP, currentStep.toString());
  }, [currentStep]);

  // Set email from authUser if available
  useEffect(() => {
    if (authUser?.user?.email && !formData.email) {
      setFormData(prev => ({
        ...prev,
        email: authUser.user.email,
      }));
    }
  }, [authUser, formData.email]);

  // Clear sessionStorage after successful submission
  const clearFormStorage = () => {
    sessionStorage.removeItem(STORAGE_KEYS.FORM_DATA);
    sessionStorage.removeItem(STORAGE_KEYS.CURRENT_STEP);
  };

  const updateFormData = (newData) => {
    setFormData((prev) => ({ ...prev, ...newData }));
  };

  const nextStep = () => {
    setCurrentStep((prev) => prev + 1);
  };

  const prevStep = () => {
    setCurrentStep((prev) => prev - 1);
  };

  // Function to determine redirect destination based on hiring channel type
  const getRedirectDestination = () => {
    const redirectAfterAuth = localStorage.getItem('redirectAfterAuth');
    
    if (redirectAfterAuth) {
      // Determine the type of hiring channel and redirect accordingly
      if (redirectAfterAuth.includes('on-campus')) {
        return '/hiring-channels/on-campus-hiring/employer';
      } else if (redirectAfterAuth.includes('pool-campus')) {
        return '/hiring-channels/pool-campus-hiring/employer';
      } else if (redirectAfterAuth.includes('off-campus')) {
        return '/hiring-channels/off-campus-hiring/employer';
      }
    }
    // Default redirect if no hiring channel detected
    return '/home';
  };

  const handleSubmit = async () => {
    try {
      const finalFormData = new FormData();

      const employerDetails = {
        name: formData.name,
        designation: formData.designation,
        workEmail: formData.email,
        mobile: formData.mobile,
        linkedIn: formData.linkedin,
      };
      finalFormData.append("employerDetails", JSON.stringify(employerDetails));

      if (formData.profileImage) {
        finalFormData.append("profileImage", formData.profileImage);
      }
      if (formData.backgroundImage) {
        finalFormData.append("backgroundImage", formData.backgroundImage);
      }

      const companyDetails = {
        companyName: formData.companyName,
        location: formData.companyLocation,
        state: formData.state,
        city: formData.city,
        country: formData.country,
        pincode: formData.pincode,
      };
      finalFormData.append("companyDetails", JSON.stringify(companyDetails));

      const hiringPreferences = {
        jobRoles: formData.jobRoles || [],
        hiringLocations: formData.hiringLocations || [],
        lookingFor: formData.lookingFor,
        employmentType: formData.employmentType || [],
      };
      finalFormData.append("hiringPreferences", JSON.stringify(hiringPreferences));

      const response = await axios.post(
        `${import.meta.env.VITE_Backend_URL}/api/dashboard/employerOnboarding`,
        finalFormData,
        { withCredentials: true }
      );

      if (response.data && response.data.user) {
        const updatedUserFromServer = response.data.user;
        const finalUser = {
          ...authUser.user,
          ...updatedUserFromServer,
        };
        setAuthUser({ user: finalUser });
      }

      if (response.status === 201) {
        console.log("Onboarding created successfully:", response.data.profile);
        alert("Registration completed successfully!");
        
        // Clear form data from sessionStorage after successful submission
        clearFormStorage();
        
        // Get the appropriate redirect destination
        const redirectTo = getRedirectDestination();
        console.log('Redirecting to:', redirectTo);
        
        // Clean up redirect info and navigate
        localStorage.removeItem('redirectAfterAuth');
        navigate(redirectTo);
      } else {
        console.error("Failed to create onboarding:", response.data.message || "Unknown error");
        alert(
          `Failed to complete registration: ${response.data.message || "Please try again."}`
        );
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      const errorMessage = error.response?.data?.message || error.message || "An unexpected error occurred.";
      alert(`Error during registration: ${errorMessage}`);
      
      if (error.response) {
        console.error("Error data:", error.response.data);
        console.error("Error status:", error.response.status);
      } else if (error.request) {
        console.error("Error request:", error.request);
        alert("No response from server. Please check your network connection.");
      }
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
            onSubmit={handleSubmit}
          />
        )}
      </div>
    </div>
  );
};

export default OnboardingFlowForm;