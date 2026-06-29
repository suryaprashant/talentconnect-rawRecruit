// import React, { useState } from 'react';
// import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
// import axios from 'axios'; 
// import {useAuth} from '../../../context/AuthProvider'
// import toast from 'react-hot-toast';

// // Import Page Components
// import Welcome from './Welcome';
// import CollegeDetails from './CollegeDetails';
// import CoordinatorDetails from './CoordinatorDetails';
// import RecruitmentDetails from './RecruitmentDetails';
// import ProfileAchievements from './ProfileAchievements';
// import TermsAndConditions from './TermsAndConditions';


// import ProgressStepper from './ProgressStepper';

// // Define step configuration with proper route paths
// const steps = [
//   { path: '/college-onboarding', name: 'Welcome', component: Welcome, stepNumber: 1 },
//   { path: '/college-onboarding/college-details', name: 'College', component: CollegeDetails, stepNumber: 2 },
//   { path: '/college-onboarding/coordinator-details', name: 'Coordinator', component: CoordinatorDetails, stepNumber: 3 },
//   { path: '/college-onboarding/recruitment-details', name: 'Recruitment', component: RecruitmentDetails, stepNumber: 4 },
//   { path: '/college-onboarding/profile-achievements', name: 'Profile', component: ProfileAchievements, stepNumber: 5 },
//   { path: '/college-onboarding/terms-conditions', name: 'Terms', component: TermsAndConditions, stepNumber: 6 },
// ];

// // Step names for the visual stepper
// const stepperSteps = ['College', 'Coordinator', 'Recruitment', 'Profile'];
// const totalVisibleStepperSteps = stepperSteps.length;

// function OnboardingFlow() {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const [authUser , setAuthUser] = useAuth() ;

//   const [formData, setFormData] = useState({
//     collegeName: '',
//     collegeLocation: '',
//     state: '',
//     city: '',
//     country: '',
//     pincode: '',
//     coordinatorName: '',
//     designation: '',
//     officialEmail: authUser?.user?.email || '' ,
//     officialMobile: '',
//     linkedinProfile: '', 
//     programsOffered: [],
//     popularCoursesForRecruitment: [],
//     preferredHiringCompanies: [],
//     recruitmentServicesRequired: [],
//     collegeBrochure: null,
//     collegeWebsite: '',
//     unicefinProfile: '', 
//     workshops: [],
//     volunteering: [],
//     awards: [],
//     acceptedTerms: false,
//   });

//   const updateFormData = (name, value) => {
//     setFormData(prev => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const currentStepConfig = steps.find(step => step.path === location.pathname);
//   const currentOverallStepNumber = currentStepConfig ? currentStepConfig.stepNumber : 0;
//   const showStepper = currentOverallStepNumber >= 2 && currentOverallStepNumber <= 5;
//   const stepperCurrentActiveIndex = showStepper ? currentOverallStepNumber - 2 : 0;

//   const handleNext = () => {
//     const currentIndex = steps.findIndex(s => s.path === location.pathname);
//     if (currentIndex !== -1 && currentIndex + 1 < steps.length) {
//       navigate(steps[currentIndex + 1].path);
//     }
//   };

//   const handlePrev = () => {
//     const currentIndex = steps.findIndex(s => s.path === location.pathname);
//     if (currentIndex > 0) {
//       navigate(steps[currentIndex - 1].path);
//     }
//   };

//   const handleSubmit = async () => {
//     try {
//       const backendUrl = import.meta.env.VITE_Backend_URL; 

//       const data = new FormData();

   
//       data.append('collegeUniversityDetails', JSON.stringify({
//         collegeName: formData.collegeName,
//         collegeLocation: formData.collegeLocation,
//         state: formData.state,
//         city: formData.city,
//         country: formData.country,
//         pincode: formData.pincode,
//       }));

   
//       data.append('placementCoordinatorDetails', JSON.stringify({
//         coordinatorName: formData.coordinatorName,
//         designation: formData.designation,
//         officialEmail: formData.officialEmail,
//         officialMobile: formData.officialMobile,
//         linkedinUrl: formData.linkedinProfile, // 
//       }));

     
//       data.append('placementRecruitmentDetails', JSON.stringify({
//       programsOffered: formData.programsOffered || [], 
//       popularCoursesForRecruitment: formData.popularCoursesForRecruitment || [], 
//       preferredHiringCompanies: formData.preferredHiringCompanies || [], 
//       recruitmentServicesRequired: formData.recruitmentServicesRequired || [], 
//     }));

     
//       data.append('profileAchievements', JSON.stringify({
//         collegeWebsite: formData.collegeWebsite,
//         linkedinProfile: formData.unicefinProfile, // 
//       }));

      
//       data.append('workshops', JSON.stringify(formData.workshops.map(w => ({
//         workshopName: w.name,
//         startDate: w.startDate,
//         endDate: w.endDate,
//         description: w.executor, 
//       }))));

//       data.append('volunteering', JSON.stringify(formData.volunteering.map(v => ({
//         eventName: v.name,
//         startDate: v.startDate,
//         endDate: v.endDate,
//         description: v.executor, 
//       }))));
      
//       data.append('awards', JSON.stringify(formData.awards.map(a => ({
//         awardTitle: a.name,
//         startDate: a.startDate,
//         endDate: a.endDate,
//         awardingOrganization: a.organization,
//       }))));


      
//       if (formData.collegeBrochure) {
//         data.append('collegeBrochure', formData.collegeBrochure);
//       }

//       const response = await axios.post(`${backendUrl}/api/college-onboarding/submit-onboarding`, data, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//         },
//         withCredentials: true ,
//       });

//      if (response.data && response.data.user) {
//         const updatedUserFromServer = response.data.user;

       
//         const finalUser = {
//           ...authUser.user,
//           ...updatedUserFromServer, 
//         };

        
//         setAuthUser({ user: finalUser });
//       }

    
//       toast.success('College onboarding form submitted successfully!');
//       navigate('/home'); 
//     } catch (error) {
//       console.error('Submission failed:', error.response ? error.response.data : error.message);
//       toast.error('Submission failed: ' + (error.response ? error.response.data.message : error.message));
//     }
//   };

//   return (
//     <div className="max-w-4xl mx-auto p-6 font-sans">
//       {showStepper && (
//         <ProgressStepper
//           currentStep={stepperCurrentActiveIndex}
//           totalSteps={totalVisibleStepperSteps}
//           stepNames={stepperSteps}
//         />
//       )}

//       <Routes>
//         {steps.map(({ path, component: Component }) => (
//           <Route
//             key={path}
//             path={path.replace('/college-onboarding', '')} 
//             element={
//               <Component
//                 formData={formData}
//                 updateFormData={updateFormData}
//                 nextStep={handleNext}
//                 prevStep={handlePrev}
               
//                 handleSubmit={path === '/college-onboarding/terms-conditions' ? handleSubmit : undefined}
//               />
//             }
//           />
//         ))}
//       </Routes>
//     </div>
//   );
// }

// export default OnboardingFlow;

import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import axios from '../../../lib/axiosInstance'; 
import {useLegacyAuth } from '../../../context/AuthProvider'
import toast from 'react-hot-toast';
import { useAuth } from "@/context/AuthContext";


// Import Page Components
import Welcome from './Welcome';
import CollegeDetails from './CollegeDetails';
import CoordinatorDetails from './CoordinatorDetails';
import RecruitmentDetails from './RecruitmentDetails';
import ProfileAchievements from './ProfileAchievements';
import TermsAndConditions from './TermsAndConditions';

import ProgressStepper from './ProgressStepper';

const STORAGE_KEYS = {
  FORM_DATA: 'collegeOnboardingFormData',
  CURRENT_PATH: 'collegeOnboardingCurrentPath'
};

// Define step configuration with proper route paths
const steps = [
  { path: '/college-onboarding', name: 'Welcome', component: Welcome, stepNumber: 1 },
  { path: '/college-onboarding/college-details', name: 'College', component: CollegeDetails, stepNumber: 2 },
  { path: '/college-onboarding/coordinator-details', name: 'Coordinator', component: CoordinatorDetails, stepNumber: 3 },
  { path: '/college-onboarding/recruitment-details', name: 'Recruitment', component: RecruitmentDetails, stepNumber: 4 },
  { path: '/college-onboarding/profile-achievements', name: 'Profile', component: ProfileAchievements, stepNumber: 5 },
  { path: '/college-onboarding/terms-conditions', name: 'Terms', component: TermsAndConditions, stepNumber: 6 },
];

// Step names for the visual stepper
const stepperSteps = ['College', 'Coordinator', 'Recruitment', 'Profile'];
const totalVisibleStepperSteps = stepperSteps.length;

function OnboardingFlow() {
  const location = useLocation();
  const navigate = useNavigate();
  const [authUser, setAuthUser] = useLegacyAuth ();
  const { refreshUser } = useAuth();


  const [formData, setFormData] = useState({
    collegeName: '',
    collegeLocation: '',
    affiliatedUniversity: '',
    state: '',
    city: '',
    country: '',
    pincode: '',
    coordinatorName: '',
    designation: '',
    officialEmail: authUser?.user?.email || '',
    officialMobile: '',
    linkedinProfile: '', 
    programsOffered: [],
    popularCoursesForRecruitment: [],
    preferredHiringCompanies: [],
    recruitmentServicesRequired: [],
    collegeBrochure: null,
    collegeWebsite: '',
    unicefinProfile: '', 
    workshops: [],
    volunteering: [],
    awards: [],
    acceptedTerms: false,
  });

  // Load data from sessionStorage on component mount (isolated per tab)
  useEffect(() => {
    const savedFormData = sessionStorage.getItem(STORAGE_KEYS.FORM_DATA);
    const savedPath = sessionStorage.getItem(STORAGE_KEYS.CURRENT_PATH);

    if (savedFormData) {
      try {
        const parsedData = JSON.parse(savedFormData);
        // Note: File objects (collegeBrochure) can't be stored in sessionStorage
        // Only text field values will be preserved
        setFormData(parsedData);
      } catch (error) {
        console.error('Error parsing saved form data:', error);
      }
    }

    // Navigate to saved path if it exists and is different from current
    if (savedPath && savedPath !== location.pathname && location.pathname === '/college-onboarding') {
      navigate(savedPath, { replace: true });
    }
  }, []);

  // Save formData to sessionStorage whenever it changes
  useEffect(() => {
    if (Object.keys(formData).length > 0) {
      sessionStorage.setItem(STORAGE_KEYS.FORM_DATA, JSON.stringify(formData));
    }
  }, [formData]);

  // Save current path to sessionStorage whenever location changes
  useEffect(() => {
    if (location.pathname.startsWith('/college-onboarding')) {
      sessionStorage.setItem(STORAGE_KEYS.CURRENT_PATH, location.pathname);
    }
  }, [location.pathname]);

  // Set email from authUser if available
  useEffect(() => {
    if (authUser?.user?.email && !formData.officialEmail) {
      setFormData(prev => ({
        ...prev,
        officialEmail: authUser.user.email,
      }));
    }
  }, [authUser, formData.officialEmail]);

  // Clear sessionStorage after successful submission
  const clearFormStorage = () => {
    sessionStorage.removeItem(STORAGE_KEYS.FORM_DATA);
    sessionStorage.removeItem(STORAGE_KEYS.CURRENT_PATH);
  };

  const updateFormData = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const currentStepConfig = steps.find(step => step.path === location.pathname);
  const currentOverallStepNumber = currentStepConfig ? currentStepConfig.stepNumber : 0;
  const showStepper = currentOverallStepNumber >= 2 && currentOverallStepNumber <= 5;
  const stepperCurrentActiveIndex = showStepper ? currentOverallStepNumber - 2 : 0;

  const handleNext = () => {
    const currentIndex = steps.findIndex(s => s.path === location.pathname);
    if (currentIndex !== -1 && currentIndex + 1 < steps.length) {
      navigate(steps[currentIndex + 1].path);
    }
  };

  const handlePrev = () => {
    const currentIndex = steps.findIndex(s => s.path === location.pathname);
    if (currentIndex > 0) {
      navigate(steps[currentIndex - 1].path);
    }
  };

  const handleSubmit = async () => {
    try {
      const backendUrl = import.meta.env.VITE_Backend_URL; 

      const data = new FormData();

      data.append('collegeUniversityDetails', JSON.stringify({
        collegeName: formData.collegeName,
        collegeLocation: formData.collegeLocation,
        affiliatedUniversity: formData.affiliatedUniversity,
        state: formData.state,
        city: formData.city,
        country: formData.country,
        pincode: formData.pincode,
      }));

      data.append('placementCoordinatorDetails', JSON.stringify({
        coordinatorName: formData.coordinatorName,
        designation: formData.designation,
        officialEmail: formData.officialEmail,
        officialMobile: formData.officialMobile,
        linkedinUrl: formData.linkedinProfile,
      }));

      data.append('placementRecruitmentDetails', JSON.stringify({
        programsOffered: formData.programsOffered || [], 
        popularCoursesForRecruitment: formData.popularCoursesForRecruitment || [], 
        preferredHiringCompanies: formData.preferredHiringCompanies || [], 
        recruitmentServicesRequired: formData.recruitmentServicesRequired || [], 
      }));

      data.append('profileAchievements', JSON.stringify({
        collegeWebsite: formData.collegeWebsite,
        linkedinProfile: formData.unicefinProfile,
      }));

      data.append('workshops', JSON.stringify(formData.workshops.map(w => ({
        workshopName: w.name,
        startDate: w.startDate,
        endDate: w.endDate,
        description: w.executor, 
      }))));

      data.append('volunteering', JSON.stringify(formData.volunteering.map(v => ({
        eventName: v.name,
        startDate: v.startDate,
        endDate: v.endDate,
        description: v.executor, 
      }))));
      
      data.append('awards', JSON.stringify(formData.awards.map(a => ({
        awardTitle: a.name,
        startDate: a.startDate,
        endDate: a.endDate,
        awardingOrganization: a.organization,
      }))));

      if (formData.collegeBrochure) {
        data.append('collegeBrochure', formData.collegeBrochure);
      }

      const response = await axios.post(`${backendUrl}/api/college-onboarding/submit-onboarding`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,
      });

      if (response.data && response.data.user) {
        const updatedUserFromServer = response.data.user;
        const finalUser = {
          ...authUser.user,
          ...updatedUserFromServer, 
        };
        setAuthUser({ user: finalUser });
      }

      await refreshUser(); // 🔥 Re-hydrates role + dashboard


      toast.success('College onboarding form submitted successfully!');
      
      // Clear form data from sessionStorage after successful submission
      clearFormStorage();
      
      // Check if user came from hiring channel (uses localStorage intentionally)
      const redirectAfterAuth = localStorage.getItem('redirectAfterAuth');
      
      if (redirectAfterAuth) {
        // Check which hiring channel the user came from
        if (redirectAfterAuth.includes('on-campus')) {
          // Redirect to campus placement service request
          navigate('/service-request/campus-placement');
          localStorage.removeItem('redirectAfterAuth'); // Clean up
        } else if (redirectAfterAuth.includes('pool-campus')) {
          // Redirect to pool campus placement service request
          navigate('/service-request/poolcampus-placement');
          localStorage.removeItem('redirectAfterAuth'); // Clean up
        } else {
          // Fallback to home for other hiring channels
          navigate('/home');
          localStorage.removeItem('redirectAfterAuth'); // Clean up
        }
      } else {
        // User didn't come from hiring channel, go to home
        navigate('/home');
      }
      
    } catch (error) {
      console.error('Submission failed:', error.response ? error.response.data : error.message);
      toast.error('Submission failed: ' + (error.response ? error.response.data.message : error.message));
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 font-sans">
      {showStepper && (
        <ProgressStepper
          currentStep={stepperCurrentActiveIndex}
          totalSteps={totalVisibleStepperSteps}
          stepNames={stepperSteps}
        />
      )}

      <Routes>
        {steps.map(({ path, component: Component }) => (
          <Route
            key={path}
            path={path.replace('/college-onboarding', '')} 
            element={
              <Component
                formData={formData}
                updateFormData={updateFormData}
                nextStep={handleNext}
                prevStep={handlePrev}
                handleSubmit={path === '/college-onboarding/terms-conditions' ? handleSubmit : undefined}
              />
            }
          />
        ))}
      </Routes>
    </div>
  );
}

export default OnboardingFlow;