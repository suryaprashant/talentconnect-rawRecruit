import React, { useState } from "react";
import { ProgressIndicator } from "../ProgressIndicator"; 
import { UploadIcon, FileText, CheckCircle } from 'lucide-react';

export const StepOne = ({ onNext, onCancel, onChange }) => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setIsLoading(true);
    setIsSuccess(false);
    setMessage("Parsing your resume... Please wait.");

    const data = new FormData();
    data.append('resume', selectedFile);

    try {
      const response = await fetch(`${import.meta.env.VITE_Backend_URL}/api/upload/resume`, {
        method: 'POST',
        body: data,
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error('Failed to parse resume. Please try again.');
      }

      const parsedData = await response.json();
      onChange(parsedData);
      
      setIsSuccess(true);
      setMessage("Success! Resume parsed successfully. Redirecting...");
      setIsLoading(false);
      
      setTimeout(() => {
        onNext();
      }, 1000);

    } catch (error) {
      console.error("Error uploading resume:", error);
      setMessage(error.message);
      setIsLoading(false);
      setIsSuccess(false);
    }
  };

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
              <FileText className="w-10 h-10 text-[#667eea]" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent mb-2">
              Upload Your Resume
            </h1>
            <p className="text-gray-600 mb-4">
              Save time by uploading your resume. We'll extract key details to pre-fill your onboarding form.
            </p>
          </div>

          {/* File Upload Section */}
          <div className="mb-8">
            <label className="text-gray-700 font-medium text-sm mb-2 block">
              Upload Resume (PDF)
            </label>
            
            <label className={`flex flex-col items-center justify-center w-full p-6 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200 ${
              isLoading 
                ? 'bg-gradient-to-r from-[#fef3c7]/20 to-[#fde68a]/20 border-[#fde68a]'
                : isSuccess
                ? 'bg-gradient-to-r from-[#bbf7d0]/20 to-[#86efac]/20 border-[#86efac]'
                : 'border-gray-300 hover:border-[#667eea] hover:bg-[#667eea]/5'
            } ${isLoading ? 'cursor-wait' : 'cursor-pointer'}`}>
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                {isSuccess ? (
                  <CheckCircle className="w-12 h-12 text-[#065f46] mb-3" />
                ) : (
                  <UploadIcon className={`w-12 h-12 mb-3 ${isLoading ? 'text-[#92400e] animate-pulse' : 'text-gray-400'}`} />
                )}
                
                {isLoading ? (
                  <p className="mb-2 text-sm text-[#92400e] font-medium">Processing your resume...</p>
                ) : isSuccess ? (
                  <p className="mb-2 text-sm text-[#065f46] font-medium">Successfully parsed!</p>
                ) : (
                  <>
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-medium">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">
                      PDF only (MAX. 5MB)
                    </p>
                  </>
                )}
                
                {file && !isLoading && !isSuccess && (
                  <p className="mt-4 text-sm font-medium text-[#5b21b6]">
                    Selected: {file.name}
                  </p>
                )}
              </div>
              <input
                type="file"
                accept=".pdf"
                className="hidden"
                onChange={handleFileChange}
                disabled={isLoading}
              />
            </label>
            
            {/* Message Display */}
            {message && (
              <div className={`mt-4 p-3 rounded-xl text-sm font-medium ${
                isSuccess 
                  ? 'bg-gradient-to-r from-[#bbf7d0]/20 to-[#86efac]/20 text-[#065f46] border border-[#bbf7d0]/30'
                  : isLoading
                  ? 'bg-gradient-to-r from-[#fde68a]/20 to-[#fcd34d]/20 text-[#92400e] border border-[#fde68a]/30'
                  : 'bg-gradient-to-r from-[#fecaca]/20 to-[#fca5a5]/20 text-[#991b1b] border border-[#fecaca]/30'
              }`}>
                {message}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-between">
            <button
              onClick={onCancel}
              disabled={isLoading}
              className="flex items-center justify-center px-6 py-3 bg-white/70 backdrop-blur-sm border border-gray-200 rounded-xl text-gray-700 hover:bg-white/90 hover:shadow-md transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              onClick={onNext}
              disabled={isLoading || !file}
              className="flex items-center justify-center px-6 py-3 bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white rounded-xl hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
            >
              {isLoading ? "Processing..." : "Continue"}
              {!isLoading && <UploadIcon className="w-4 h-4 ml-2" />}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};