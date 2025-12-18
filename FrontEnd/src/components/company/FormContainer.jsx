// components/company/FormContainer.jsx
"use client";

import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import { useAuth } from "../../context/AuthProvider";
import StepIndicator from "./StepIndicator";

import CompanyInfoStep from "@/pages/company/CompanyInfoStep";
import HiringPreferencesStep from "@/pages/company/HiringPreferencesStep";
import VerificationStep from "@/pages/company/VerificationStep";
import Introduction from "@/pages/company/Introduction";
import TermsAndConditions from "@/pages/company/TermsAndConditions";
import useApplicationForm from "../../pages/company/ApplicationForm";
import PersonalInfoStep from "../../pages/company/PersonalPreferencesStep";

const FormContainer = () => {
  const { formData, updateFormData, handleSubmit } = useApplicationForm();
  const [currentStep, setCurrentStep] = useState(0);

  const navigate = useNavigate();
  const location = useLocation();
  const [authUser] = useAuth();

  const totalSteps = 6;
  const visualStepsCount = 5;

  // Prefill employer contact fields for LinkedIn signups
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const qsName = params.get("name");
    const qsEmail = params.get("email");
    const qsProvider = params.get("authProvider");

    const srcUser =
      authUser && authUser.user
        ? authUser.user
        : {
            name: qsName,
            email: qsEmail,
            authProvider: qsProvider,
          };

    if (!srcUser || srcUser.authProvider !== "linkedin") return;

    const employer = formData?.employerDetails || {};
    const updatedEmployer = {
      ...employer,
      // adjust these keys to your schema if needed
      contactName: employer.contactName || srcUser.name || "",
      contactEmail: employer.contactEmail || srcUser.email || "",
    };

    if (
      updatedEmployer.contactName !== employer.contactName ||
      updatedEmployer.contactEmail !== employer.contactEmail
    ) {
      // assuming updateFormData(section, field, value)
      updateFormData("employerDetails", "contactName", updatedEmployer.contactName);
      updateFormData("employerDetails", "contactEmail", updatedEmployer.contactEmail);
    }
  }, [authUser, formData, location.search, updateFormData]);

  const nextStep = () => {
    setCurrentStep((prev) => Math.min(prev + 1, totalSteps - 1));
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  // Redirect after successful onboarding
  const handleSuccessfulSubmit = async () => {
    const success = await handleSubmit();
    if (success) {
      const redirectAfterAuth = localStorage.getItem("redirectAfterAuth");
      if (redirectAfterAuth) {
        navigate(redirectAfterAuth);
        localStorage.removeItem("redirectAfterAuth");
      } else {
        navigate("/home");
      }
    }
  };

  const steps = [
    <Introduction
      key="intro"
      formData={formData}
      updateFormData={(field, value) =>
        updateFormData("employerDetails", field, value)
      }
      nextStep={nextStep}
    />,
    <PersonalInfoStep
      key="personal"
      formData={formData}
      updateFormData={(field, value) =>
        updateFormData("employerDetails", field, value)
      }
      nextStep={nextStep}
      prevStep={prevStep}
    />,
    <CompanyInfoStep
      key="company"
      formData={formData}
      updateFormData={(field, value) =>
        updateFormData("companyDetails", field, value)
      }
      nextStep={nextStep}
      prevStep={prevStep}
    />,
    <HiringPreferencesStep
      key="hiring"
      formData={formData}
      updateFormData={(field, value) =>
        updateFormData("hiringPreferences", field, value)
      }
      nextStep={nextStep}
      prevStep={prevStep}
    />,
    <VerificationStep
      key="verification"
      formData={formData}
      updateFormData={(field, value) =>
        updateFormData("kycDetails", field, value)
      }
      nextStep={nextStep}
      prevStep={prevStep}
    />,
    <TermsAndConditions
      key="terms"
      formData={formData}
      updateFormData={updateFormData}
      prevStep={prevStep}
      onSubmit={handleSuccessfulSubmit}
    />,
  ];

  const variants = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  };

  return (
    <div className="w-full max-w-5xl mx-auto">
      {currentStep > 0 && currentStep <= visualStepsCount && (
        <StepIndicator currentStep={currentStep} totalSteps={visualStepsCount} />
      )}

      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          variants={variants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.2 }}
        >
          {steps[currentStep]}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default FormContainer;
