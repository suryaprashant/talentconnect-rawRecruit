// import { useState } from 'react'
// import { motion, AnimatePresence } from 'framer-motion'
// import StepIndicator from './StepIndicator'
// import PersonalInfoStep from '@/pages/Company/PersonalPreferencesStep'
// import CompanyInfoStep from '@/pages/Company/CompanyInfoStep'
// import HiringPreferencesStep from '@/pages/Company/HiringPreferencesStep'
// import VerificationStep from '@/pages/Company/VerificationStep'
// import Introduction from '@/pages/Company/Introduction'
// import { createCompanyProfile } from '@/lib/Company_AxiosInstance'

// const FormContainer = () => {
//   const [currentStep, setCurrentStep] = useState(0)
//   const [formData, setFormData] = useState({
//     // Personal info
//     name: '',
//     designation: '',
//     email: '',
//     mobile: '',
//     linkedIn: '',
//     // Company info
//     companyName: '',
//     description: '',
//     companyType: '',
//     industryType: '',
//     employeesCount: '',
//     establishedYear: '',
//     contactNumber: '',
//     alternateNumber: '',
//     location: '',
//     state: '',
//     city: '',
//     country: '',
//     pincode: '',
//     // Hiring preferences
//     jobRoles: [],
//     hiringLocations: [],
//     lookingFor: '',
//     employmentType: [],
//     // Verification
//     documents: [],
//     tanNumber: '',
//     gstNumber: '',
//     companyRegistration: ''
//   })
//   const handleChange = (name, value) => {
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }))
//   }

//   const nextStep = () => {
//     setCurrentStep(prev => Math.min(prev + 1, 4))
//   }

//   const prevStep = () => {
//     setCurrentStep(prev => Math.max(prev - 1, 0))
//   }

//   const handleSubmit = async (formData) => {
//     try {
//       const response = await createCompanyProfile(formData);
//       // console.log(response);
//     } catch (error) {
//       console.log(error);
//     }
//   }

//   const steps = [
//     <Introduction key="intro" nextStep={nextStep} />,
//     <PersonalInfoStep
//       key="personal"
//       formData={formData}
//       handleChange={handleChange}
//       nextStep={nextStep}
//       prevStep={prevStep}
//     />,
//     <CompanyInfoStep
//       key="company"
//       formData={formData}
//       handleChange={handleChange}
//       nextStep={nextStep}
//       prevStep={prevStep}
//     />,
//     <HiringPreferencesStep
//       key="hiring"
//       formData={formData}
//       handleChange={handleChange}
//       nextStep={nextStep}
//       prevStep={prevStep}
//     />,
//     <VerificationStep
//       key="verification"
//       formData={formData}
//       handleChange={handleChange}
//       prevStep={prevStep}
//       onSubmit={() => handleSubmit(formData)}
//     />
//   ]

//   // Animation variants
//   const variants = {
//     initial: { opacity: 0, x: 20 },
//     animate: { opacity: 1, x: 0 },
//     exit: { opacity: 0, x: -20 }
//   }
//   return (
//     <div className="bg-white shadow-lg rounded-lg overflow-hidden">
//       {currentStep > 0 && (
//         <div className="p-6 border-b">
//           <StepIndicator currentStep={currentStep} totalSteps={4} />
//         </div>
//       )}
//       <AnimatePresence mode="wait">
//         <motion.div
//           key={currentStep}
//           initial="initial"
//           animate="animate"
//           exit="exit"
//           variants={variants}
//           transition={{ duration: 0.3 }}
//           className="p-6"
//         >
//           {steps[currentStep]}
//         </motion.div>
//       </AnimatePresence>
//     </div>
//   )
// }

// export default FormContainer




"use client"
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import StepIndicator from './StepIndicator';
import CompanyInfoStep from '@/pages/Company/CompanyInfoStep';
import HiringPreferencesStep from '@/pages/Company/HiringPreferencesStep';
import VerificationStep from '@/pages/Company/VerificationStep';
import Introduction from '@/pages/Company/Introduction';
import TermsAndConditions from '@/pages/Company/TermsAndConditions';
import useApplicationForm from '../../pages/Company/ApplicationForm';

const FormContainer = () => {
    const { formData, updateFormData, handleSubmit } = useApplicationForm();
    const [currentStep, setCurrentStep] = useState(0);

    const totalSteps = 6; // Intro, Company, Hiring, Verification, T&C, Success
    const navigate = useNavigate() ;
    const nextStep = () => {
        setCurrentStep(prev => Math.min(prev + 1, totalSteps - 1));
    };

    const prevStep = () => {
        setCurrentStep(prev => Math.max(prev - 1, 0));
    };

    const steps = [
        <Introduction key="intro" nextStep={nextStep} />,
        <CompanyInfoStep
            key="company"
            formData={formData.companyDetails}
            handleChange={(field, value) => updateFormData('companyDetails', field, value)}
            nextStep={nextStep}
            prevStep={prevStep}
        />,
        <HiringPreferencesStep
            key="hiring"
            formData={formData.hiringPreferences}
            handleChange={(field, value) => updateFormData('hiringPreferences', field, value)}
            nextStep={nextStep}
            prevStep={prevStep}
        />,
        <VerificationStep
            key="verification"
            formData={formData.kycDetails}
            handleChange={(field, value) => updateFormData('kycDetails', field, value)}
            prevStep={prevStep}
            nextStep={nextStep}
            updateFormData={updateFormData}
        />,
        <TermsAndConditions
            key="terms"
            formData={formData}
         updateFormData={(field, value) => updateFormData(field, value)} // Simplified
            prevStep={prevStep}
            onSubmit={async () => {
                const success = await handleSubmit();
                if (success) {
                  navigate('/home')
                }
            }}
        />,
    ];

    const variants = {
        initial: { opacity: 0, x: 20 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -20 }
    };

    const visualStepsCount = 4;

    return (
        <div className="bg-white shadow-lg rounded-lg overflow-hidden min-h-screen flex flex-col">
            {currentStep > 0 && currentStep <= visualStepsCount && (
                <div className="p-6 border-b">
                    <StepIndicator currentStep={currentStep} totalSteps={visualStepsCount} />
                </div>
            )}
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentStep}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    variants={variants}
                    transition={{ duration: 0.3 }}
                    className="p-6 flex-grow flex items-center justify-center"
                >
                    {steps[currentStep]}
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

export default FormContainer;