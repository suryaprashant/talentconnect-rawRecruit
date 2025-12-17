import React, { useEffect } from "react";
import { useRole } from "@/context/RoleContext/RoleContext";
import { FiUser, FiArrowRight, FiArrowLeft } from 'react-icons/fi';

export const Welcome = ({ onNext, onCancel }) => {
  const { selectedRole, updateRole } = useRole();
  
  useEffect(() => {
    const storedRole = localStorage.getItem('selectedRole');
    
    if (storedRole && !selectedRole) {
      updateRole(storedRole);
    } else if (selectedRole && !storedRole) {
      localStorage.setItem('selectedRole', selectedRole);
    }
  }, [selectedRole, updateRole]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#667eea]/10 via-[#f093fb]/5 to-[#764ba2]/10">
      {/* Pastel blur background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#667eea]/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 -left-20 w-60 h-60 bg-[#f093fb]/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-1/3 w-40 h-40 bg-[#764ba2]/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
        <div className="bg-white/90 backdrop-blur-sm border border-white/50 rounded-2xl shadow-lg shadow-purple-50/50 p-8 w-full max-w-xl">
          {/* Header with gradient */}
          <div className="text-center mb-6">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-r from-[#667eea]/20 to-[#764ba2]/20 flex items-center justify-center mx-auto mb-4">
              <FiUser className="w-10 h-10 text-[#667eea]" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent mb-2">
              Create Your Profile
            </h1>
            <p className="text-gray-600 mb-4">
              Build your profile to explore job opportunities, internships, and campus placements.
            </p>
            
            {selectedRole && (
              <div className="inline-block px-4 py-2 bg-gradient-to-r from-[#a5b4fc]/20 to-[#c4b5fd]/20 border border-[#a5b4fc]/30 rounded-xl">
                <p className="text-sm text-[#5b21b6] font-medium">
                  You are applying as a <strong>{selectedRole}</strong>
                </p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-end">
            <button
              onClick={onCancel}
              className="flex items-center justify-center px-6 py-3 bg-white/70 backdrop-blur-sm border border-gray-200 rounded-xl text-gray-700 hover:bg-white/90 hover:shadow-md transition-all duration-200 font-medium"
            >
              <FiArrowLeft className="w-4 h-4 mr-2" />
              Cancel
            </button>
            <button
              onClick={onNext}
              className="flex items-center justify-center px-6 py-3 bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white rounded-xl hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-200 font-medium"
            >
              Continue
              <FiArrowRight className="w-4 h-4 ml-2" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};