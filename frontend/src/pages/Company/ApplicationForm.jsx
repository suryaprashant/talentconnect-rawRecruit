"use client"

import { useState } from "react"
import StepIndicator from "@/components/onboarding/StepIndicator"
import PersonalInfo from "@/components/company/PersonalInfo"
import EducationInfo from "@/components/company/EducationInfo"
import WorkExperience from "@/components/company/WorkExperience"
import SkillsInfo from "@/components/company/SkillsInfo"
import AdditionalInfo from "@/components/company/AdditionalInfo"
import ReviewSubmit from "@/components/company/ReviewSubmit"
import SuccessPage from "@/components/company/SuccessPage"

function ApplicationForm() {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    personalInfo: {},
    educationInfo: {},
    workExperience: {},
    skillsInfo: {},
    additionalInfo: {},
  })

  const totalSteps = 7

  const updateFormData = (section, data) => {
    setFormData((prev) => ({
      ...prev,
      [section]: { ...prev[section], ...data },
    }))
  }

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
      window.scrollTo(0, 0)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
      window.scrollTo(0, 0)
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <PersonalInfo
            formData={formData.personalInfo}
            updateFormData={(data) => updateFormData("personalInfo", data)}
            nextStep={nextStep}
          />
        )
      case 2:
        return (
          <EducationInfo
            formData={formData.educationInfo}
            updateFormData={(data) => updateFormData("educationInfo", data)}
            nextStep={nextStep}
            prevStep={prevStep}
          />
        )
      case 3:
        return (
          <WorkExperience
            formData={formData.workExperience}
            updateFormData={(data) => updateFormData("workExperience", data)}
            nextStep={nextStep}
            prevStep={prevStep}
          />
        )
      case 4:
        return (
          <SkillsInfo
            formData={formData.skillsInfo}
            updateFormData={(data) => updateFormData("skillsInfo", data)}
            nextStep={nextStep}
            prevStep={prevStep}
          />
        )
      case 5:
        return (
          <AdditionalInfo
            formData={formData.additionalInfo}
            updateFormData={(data) => updateFormData("additionalInfo", data)}
            nextStep={nextStep}
            prevStep={prevStep}
          />
        )
      case 6:
        return <ReviewSubmit formData={formData} nextStep={nextStep} prevStep={prevStep} />
      case 7:
        return <SuccessPage />
      default:
        return <PersonalInfo />
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {currentStep < 7 && (
          <div className="bg-white p-6 rounded-md shadow-sm mb-6">
            <h1 className="text-xl font-semibold text-center text-gray-800 mb-4">Application Form</h1>
            <StepIndicator currentStep={currentStep} totalSteps={totalSteps - 1} />
          </div>
        )}
        <div className="bg-white rounded-md shadow-sm">{renderStep()}</div>
      </div>
    </div>
  )
}

export default ApplicationForm
