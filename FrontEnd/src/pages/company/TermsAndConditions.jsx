import { TermsModal } from "@/components/onboarding/Terms&conditionModal";
import { motion } from "framer-motion";
import { useState } from "react";

export default function TermsAndConditions({
  formData,
  updateFormData, 
  prevStep,
  onSubmit,
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleAcceptTerms = (e) => {
    updateFormData("acceptedTerms", e.target.checked);
  };

  const handleGetStartedClick = async () => {
    try {
      if (formData.acceptedTerms) {
        await onSubmit();
      } else {
        alert("Please accept the Terms & Conditions to proceed.");
      }
    } catch (error) {
      console.error("Submission failed:", error);
      alert("There was an error submitting the form. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#667eea]/10 via-[#f093fb]/5 to-[#764ba2]/10 p-4">
      {/* Background decorative elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-[#667eea]/10 to-[#764ba2]/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-[#f093fb]/10 to-[#f5576c]/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-2xl mx-auto">
        {/* Blur background behind card */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#667eea]/5 to-[#764ba2]/5 backdrop-blur-sm rounded-2xl -inset-x-4 bottom-4"></div>

        <motion.div
          className="relative bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-100 p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {/* Decorative top bar */}
          <div className="h-1 bg-gradient-to-r from-[#667eea] via-[#f093fb] to-[#43e97b] rounded-t-2xl absolute top-0 left-0 right-0"></div>

          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#667eea]/10 to-[#764ba2]/10 text-[#667eea] px-4 py-2 rounded-full text-sm font-semibold mb-4 shadow-sm">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-4 h-4"
              >
                <path
                  fillRule="evenodd"
                  d="M5.625 1.5c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A3.75 3.75 0 0016.5 9h-1.875a1.875 1.875 0 01-1.875-1.875V5.25A3.75 3.75 0 009 1.5H5.625zM7.5 15a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5A.75.75 0 017.5 15zm.75 2.25a.75.75 0 000 1.5H12a.75.75 0 000-1.5H8.25z"
                  clipRule="evenodd"
                />
                <path d="M12.971 1.816A5.23 5.23 0 0114.25 5.25v1.875c0 .207.168.375.375.375H16.5a5.23 5.23 0 013.434 1.279 9.768 9.768 0 00-6.963-6.963z" />
              </svg>
              Final Step: Terms & Conditions
            </div>

            <h1 className="text-2xl font-bold text-gray-800 mb-4">
              Terms & Conditions and Privacy Policy
            </h1>
            <p className="text-gray-600">
              Please review and accept our terms to complete your company
              profile setup.
            </p>
          </div>

          {/* Agreement Checkbox */}
          <div className="mb-8 ">
            <div className="flex flex-col items-center justify-center p-4 bg-gradient-to-r from-[#667eea]/5 to-transparent rounded-xl border border-gray-200">
              <div>
                <input
                  type="checkbox"
                  id="acceptTerms"
                  checked={formData.acceptedTerms || false}
                  onChange={handleAcceptTerms}
                  className="mr-3 h-5 w-5 text-[#667eea] focus:ring-[#667eea]/30 border-gray-300 rounded"
                />
                <label
                  htmlFor="acceptTerms"
                  className="text-sm sm:text-base text-gray-700 font-medium"
                >
                  I agree to the Terms & Conditions and Privacy Policy
                </label>
              </div>
              <a
                onClick={() => setIsModalOpen(true)}
                className="text-blue-600 hover:text-blue-700 underline cursor-pointer mt-2"
              >
                Terms & Services
              </a>
              <TermsModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
              />
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t border-gray-100">
            <button
              onClick={prevStep}
              className="px-6 py-3 border border-gray-300 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition-all duration-300 hover:shadow-sm"
            >
              Back
            </button>
            <button
              onClick={handleGetStartedClick}
              disabled={!formData.acceptedTerms}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                formData.acceptedTerms
                  ? "bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white hover:shadow-lg hover:scale-[1.02] shadow-md"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              Complete Setup
            </button>
          </div>
        </motion.div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-gray-500 text-sm">
            Your agreement helps us maintain a secure and professional platform
            for all users
          </p>
        </div>
      </div>
    </div>
  );
}
