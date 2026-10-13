import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { TermsModal } from "@/components/onboarding/Terms&conditionModal";

export default function TermsAndConditions({ formData = {}, updateFormData, onBack, onSubmit }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAcceptTerms = (e) => {
    updateFormData({ acceptedTerms: e.target.checked });
  };

  const handleSubmit = () => {
    if (formData.acceptedTerms) {
      onSubmit(); 
    } else {
      alert('Please accept the Terms & Conditions and Privacy Policy to proceed.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#143694]/15 via-[#f093fb]/10 to-[#1e4ed8]/15 p-4">
      {/* Blur Background around card */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-[#143694]/10 to-[#1e4ed8]/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-[#f093fb]/10 to-[#f5576c]/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-4xl">
        {/* Blur background behind card */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#143694]/5 to-[#1e4ed8]/5 backdrop-blur-sm rounded-2xl -inset-x-4 bottom-0"></div>
        
        <motion.div
          className="relative bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-100 p-8"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Decorative top bar */}
          <div className="h-1 bg-gradient-to-r from-[#143694] via-[#f093fb] to-[#43e97b] rounded-t-2xl absolute top-0 left-0 right-0"></div>

          {/* Progress indicator */}
          <div className="flex items-center justify-start mb-8">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-gradient-to-r from-[#143694] to-[#1e4ed8] text-white rounded-full flex items-center justify-center text-sm font-medium">
                ✓
              </div>
              <div className="w-16 h-px bg-gradient-to-r from-[#143694]/30 to-[#1e4ed8]/30"></div>
              <div className="w-8 h-8 bg-gradient-to-r from-[#143694] to-[#1e4ed8] text-white rounded-full flex items-center justify-center text-sm font-medium">
                ✓
              </div>
              <div className="w-16 h-px bg-gradient-to-r from-[#143694]/30 to-[#1e4ed8]/30"></div>
              <div className="w-8 h-8 bg-gradient-to-r from-[#143694] to-[#1e4ed8] text-white rounded-full flex items-center justify-center text-sm font-medium">
                ✓
              </div>
            </div>
          </div>

          <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Terms & Conditions and Privacy Policy
          </h1>

          {/* Checkbox and Modal Trigger */}
          <div className="flex flex-col items-center justify-center mb-8 p-4 bg-gray-50/80 rounded-lg border border-gray-100">
            <div className="flex items-center mb-3">
              <input
                type="checkbox"
                id="acceptTerms"
                checked={formData.acceptedTerms || false}
                onChange={handleAcceptTerms}
                className="mr-3 h-5 w-5 cursor-pointer accent-[#143694]"
              />
              <label htmlFor="acceptTerms" className="text-sm cursor-pointer select-none text-gray-700">
                I have read and agree to the Terms & Conditions and Privacy Policy
              </label>
            </div>

            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="text-sm text-[#143694] hover:text-[#1e4ed8] hover:underline cursor-pointer font-medium transition-colors"
            >
              Read Terms & Services
            </button>
            
            <TermsModal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
            />
          </div>

          <div className="flex justify-between mt-8">
            <button
              onClick={onBack}
              className="px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-all duration-300"
            >
              Back
            </button>
            <button
              onClick={handleSubmit}
              disabled={!formData.acceptedTerms}
              className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 shadow-md ${
                formData.acceptedTerms
                  ? 'bg-gradient-to-r from-[#143694] to-[#1e4ed8] text-white hover:shadow-lg hover:scale-[1.02]'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Get Started
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}