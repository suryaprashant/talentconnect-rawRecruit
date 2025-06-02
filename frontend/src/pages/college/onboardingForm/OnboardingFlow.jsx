import React, { useState } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';

// Import Page Components
import Welcome from './Welcome';
import CollegeDetails from './CollegeDetails';
import CoordinatorDetails from './CoordinatorDetails';
import RecruitmentDetails from './RecruitmentDetails';
import ProfileAchievements from './ProfileAchievements';
import TermsAndConditions from './TermsAndConditions';

// Import Shared Component
import ProgressStepper from './ProgressStepper';

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

  const [formData, setFormData] = useState({
    collegeName: '',
    collegeLocation: '',
    state: '',
    city: '',
    country: '',
    pincode: '',
    coordinatorName: '',
    designation: '',
    officialEmail: '',
    officialMobile: '',
    linkedinProfile: '',
    programsOffered: [],
    popularCourses: [],
    preferredCompanies: [],
    recruitmentServices: [],
    collegeBrochure: null,
    collegeWebsite: '',
    unicefinProfile: '',
    workshops: [],
    volunteering: [],
    awards: [],
    acceptedTerms: false,
  });

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
            path={path.replace('/college-onboarding', '')} // strip base path for internal match
            element={
              <Component
                formData={formData}
                updateFormData={updateFormData}
                nextStep={handleNext}
                prevStep={handlePrev}
              />
            }
          />
        ))}
      </Routes>
    </div>
  );
}

export default OnboardingFlow;
