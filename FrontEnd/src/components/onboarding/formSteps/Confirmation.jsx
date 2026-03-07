import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRole } from "@/context/RoleContext/RoleContext";
import axios from 'axios';
import { useLegacyAuth } from "@/context/AuthProvider";
import { useAuth } from "@/context/AuthContext";
import { TermsModal } from '../Terms&conditionModal';
import { CheckCircle, Shield, FileText } from "lucide-react";

export const Confirmation = ({ onSubmit, onCancel }) => {
  const [agreed, setAgreed] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const navigate = useNavigate();

  const { selectedRole, formData, clearFormData } = useRole();
  const [, setAuthUser] = useLegacyAuth();

  const { login, refreshUser } = useAuth();


  const handleCheckboxChange = () => {
    setAgreed(!agreed);
  };

  const handleTermsClick = () => {
    setShowTermsModal(true);
  };

  const handleCloseTermsModal = () => {
    setShowTermsModal(false);
  };

  const handleAgree = () => {
    setAgreed(true);
    setShowTermsModal(false);
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!agreed) {
      alert("Please agree to the Terms & Conditions and Privacy Policy.");
      return;
    }

    if (!selectedRole) {
      alert("Profile type not selected. Please go back and select a profile type.");
      return;
    }

    const dataToSend = new FormData();
    const tempFormData = { ...formData };

    delete tempFormData.profileType;

    if (Array.isArray(tempFormData.experiences)) {
      const expData = [];
      tempFormData.experiences.forEach(exp => {
        const copy = { ...exp };
        if (copy.experienceCertificate instanceof File) {
          dataToSend.append(
            "experienceCertificate",
            copy.experienceCertificate,
            copy.experienceCertificate.name
          );
          delete copy.experienceCertificate;
        }
        expData.push(copy);
      });
      dataToSend.append("experiences", JSON.stringify(expData));
      delete tempFormData.experiences;
    }

    if (Array.isArray(tempFormData.education)) {
      dataToSend.append("education", JSON.stringify(tempFormData.education));
      delete tempFormData.education;
    }

    if (tempFormData.parsedData && typeof tempFormData.parsedData === "object") {
      dataToSend.append("parsedData", JSON.stringify(tempFormData.parsedData));
      delete tempFormData.parsedData;
    }

    for (const key in tempFormData) {
      const value = tempFormData[key];
      if (value === null || value === undefined) continue;

      if (value instanceof File) {
        dataToSend.append(key, value, value.name);
      } else if (Array.isArray(value)) {
        dataToSend.append(key, JSON.stringify(value));
      } else if (typeof value === "object") {
        dataToSend.append(key, JSON.stringify(value));
      } else {
        dataToSend.append(key, String(value));
      }
    }

    dataToSend.append("profileType", selectedRole);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_Backend_URL}/api/onboarding`,
        dataToSend,
        { withCredentials: true }
      );

      alert("Candidate profile created successfully!");

      if (response.data && response.data.user) {
        setAuthUser({ user: response.data.user });
      }

      await refreshUser();

      if (response.data?.user) {
        login(response.data.user); // 🔥 THIS IS THE FIX
      }

      clearFormData();
      if (onSubmit) onSubmit();

      const userTypeFromDb = response.data.profileType || response.data.userType;
      if (userTypeFromDb) {
        const lowerCaseUserType = userTypeFromDb.toLowerCase();
        switch (lowerCaseUserType) {
          case "professional":
            navigate("/home", { replace: true });
            break;
          case "fresher":
          case "student":
            navigate("/home", { replace: true });
            break;
          default:
            navigate("/home", { replace: true });
        }
      } else {
        console.warn("User type not found in response. Navigating to general home.");
        navigate("/home", { replace: true });
      }
    } catch (error) {
      console.error("Network or backend submission error:", error);
      if (error.response) {
        console.error("Error Response Data:", error.response.data);
        const errorMessage =
          error.response.data.details ||
          error.response.data.error ||
          "An unknown error occurred.";
        alert(`Submission failed: ${errorMessage}`);
      } else if (error.request) {
        alert("Network error: No response from server.");
      } else {
        alert(`An error occurred: ${error.message}`);
      }
    }
  };


  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-[#667eea]/10 via-[#f093fb]/5 to-[#764ba2]/10">
        {/* Pastel blur background elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#667eea]/10 rounded-full blur-3xl"></div>
          <div className="absolute top-1/3 -left-20 w-60 h-60 bg-[#f093fb]/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-1/3 w-40 h-40 bg-[#764ba2]/10 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
          <div className="bg-white/90 backdrop-blur-sm border border-white/50 rounded-2xl shadow-lg shadow-purple-50/50 p-8 w-full max-w-2xl">

            {/* Header with gradient */}
            <div className="text-center mb-8">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-r from-[#667eea]/20 to-[#764ba2]/20 flex items-center justify-center mx-auto mb-4">
                <Shield className="w-10 h-10 text-[#667eea]" />
              </div>
              <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent mb-2">
                Almost There!
              </h1>
              <p className="text-gray-600 mb-4">
                Review and accept the terms to complete your profile setup
              </p>
            </div>

            {/* Terms Agreement Section */}
            <div className="mb-8 p-6 bg-gradient-to-r from-[#f8fafc] to-[#f1f5f9] border border-gray-200 rounded-xl">
              <div className="flex items-start gap-4">
                <div className={`mt-1 flex-shrink-0 w-6 h-6 rounded border flex items-center justify-center cursor-pointer ${agreed
                  ? "bg-gradient-to-r from-[#667eea] to-[#764ba2] border-transparent"
                  : "border-gray-300 bg-white"
                  }`} onClick={handleCheckboxChange}>
                  {agreed && (
                    <CheckCircle className="w-4 h-4 text-white" />
                  )}
                </div>

                <div className="flex-grow">
                  <label className="text-gray-700 cursor-pointer">
                    <span className="font-medium">I agree to the</span>
                    <button
                      type="button"
                      onClick={handleTermsClick}
                      className="mx-1 text-[#667eea] hover:text-[#764ba2] font-medium hover:underline transition-all duration-200"
                    >
                      Terms & Conditions and Privacy Policy
                    </button>
                    <span className="font-medium">.</span>
                  </label>
                </div>
              </div>

              {/* Selected Role Display */}
              {selectedRole && (
                <div className="mt-6 p-4 bg-gradient-to-r from-[#e0e7ff]/20 to-[#c7d2fe]/20 border border-[#e0e7ff]/30 rounded-xl">
                  <div className="flex items-center">
                    <FileText className="w-5 h-5 text-[#5b21b6] mr-3" />
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Profile Type</p>
                      <p className="text-[#5b21b6] font-medium capitalize">{selectedRole}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between">
              <button
                onClick={onCancel}
                className="flex items-center justify-center px-8 py-3 bg-white/70 backdrop-blur-sm border border-gray-200 rounded-xl text-gray-700 hover:bg-white/90 hover:shadow-md transition-all duration-200 font-medium"
                type="button"
              >
                Back
              </button>
              <button
                onClick={handleSubmit}
                disabled={!agreed}
                className={`flex items-center justify-center px-8 py-3 rounded-xl transition-all duration-200 font-medium ${agreed
                  ? "bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white hover:shadow-lg hover:shadow-purple-500/30"
                  : "bg-gradient-to-r from-gray-300 to-gray-400 text-gray-500 cursor-not-allowed"
                  }`}
                type="submit"
              >
                <CheckCircle className="w-5 h-5 mr-2" />
                Get Started
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Terms and Conditions Modal */}
      {showTermsModal && (
        <TermsModal
          isOpen={showTermsModal}
          onClose={handleCloseTermsModal}
          onAgree={handleAgree}
        />
      )}
    </>
  );
};