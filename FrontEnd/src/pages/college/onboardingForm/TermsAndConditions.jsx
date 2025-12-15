import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TermsModal } from "@/components/onboarding/Terms&conditionModal";

export default function TermsAndConditions({
  formData,
  updateFormData,
  prevStep,
  handleSubmit,
  currentStep,
  totalSteps,
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Calculate progress percentage
  const progressPercentage = ((currentStep - 1) / (totalSteps - 1)) * 100;

  const handleAcceptTerms = (e) => {
    updateFormData("acceptedTerms", e.target.checked);
  };

  const handleGetStartedClick = () => {
    if (formData.acceptedTerms) {
      handleSubmit();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0e6f7] via-[#d4e8f9] to-[#cff7ea]">
      <div className="relative z-10 flex items-center justify-center min-h-screen p-6">
        {/* Card with blur border effect */}
        <div className="relative w-full max-w-5xl">
          {/* Blur border */}
          <div className="absolute -inset-6 bg-gradient-to-br from-[#fbcfe8]/20 via-[#93c5fd]/20 to-[#a7f3d0]/20 rounded-4xl blur-2xl -z-10"></div>
          
          {/* Optional corner accent blurs */}
          <div className="absolute -top-8 -left-8 w-32 h-32 bg-[#fbcfe8]/30 rounded-full blur-3xl -z-10"></div>
          <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-[#93c5fd]/30 rounded-full blur-3xl -z-10"></div>
          <div className="absolute -top-8 -right-8 w-24 h-24 bg-[#c7d2fe]/30 rounded-full blur-3xl -z-10"></div>
          <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-[#a7f3d0]/30 rounded-full blur-3xl -z-10"></div>
          
          {/* Main Card */}
          <div className="relative bg-white/95 backdrop-blur-xl border border-white/70 rounded-3xl shadow-xl shadow-blue-50/50 p-10">

            {/* Main Content Grid - Properly structured */}
            <div className="flex flex-col items-center justify-center h-full py-8">
              <div className="text-center mb-12">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-[#3b82f6] to-[#8b5cf6] bg-clip-text text-transparent mb-4">
                  Terms & Conditions
                </h1>
                <p className="text-black-600 text-2xl font-bold">and Privacy Policy</p>
              </div>

              {/* Terms Acceptance Section */}
              <div className="w-full max-w-3xl mx-auto space-y-8">
                {/* Checkbox Section */}
                <div className="flex items-start p-8 bg-gradient-to-r from-gray-50/50 to-blue-50/30 backdrop-blur-sm border border-gray-200/50 rounded-2xl">
                  <input
                    type="checkbox"
                    id="acceptTerms"
                    checked={formData.acceptedTerms || false}
                    onChange={handleAcceptTerms}
                    className="mr-5 h-7 w-7 rounded border-gray-300 text-[#3b82f6] focus:ring-[#93c5fd] focus:ring-3 focus:ring-offset-0 transition-all duration-200 flex-shrink-0 mt-1"
                  />
                  <div className="flex-1">
                    <label htmlFor="acceptTerms" className="text-xl text-gray-800 font-medium leading-relaxed block mb-2">
                      I agree to the Terms & Conditions and Privacy Policy
                    </label>
                  </div>
                </div>
                
                {/* View Terms Button */}
                <div className="flex justify-center">
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="px-10 py-4 bg-gradient-to-r from-[#e0f2fe] to-[#dbeafe] text-[#1d4ed8] rounded-xl hover:shadow-lg hover:shadow-blue-100/50 hover:-translate-y-0.5 transition-all duration-300 font-semibold text-lg border border-blue-100"
                  >
                    View Full Terms & Services Document
                  </button>
                  
                  <TermsModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                  />
                </div>
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center mt-12 pt-8 border-t border-white/50">
              <button
                onClick={prevStep}
                className="px-10 py-4 bg-white/70 backdrop-blur-sm border border-gray-200/80 rounded-xl hover:bg-white/90 hover:shadow-md transition-all duration-200 text-gray-700 font-medium text-lg"
              >
                ← Back
              </button>
              
              <button
                onClick={handleGetStartedClick}
                disabled={!formData.acceptedTerms}
                className={`px-12 py-4 rounded-xl transition-all duration-300 font-semibold text-lg min-w-[180px] ${
                  formData.acceptedTerms
                    ? "bg-gradient-to-r from-[#93c5fd] to-[#3b82f6] text-white hover:shadow-xl hover:shadow-[#93c5fd]/50 hover:-translate-y-0.5"
                    : "bg-gray-200 text-gray-500 cursor-not-allowed"
                }`}
              >
                Get Started →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}