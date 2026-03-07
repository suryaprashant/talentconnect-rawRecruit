import React, { useState } from "react";
import { UploadIcon, FileText, CheckCircle, ChevronRight } from 'lucide-react';

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

    // try {
    //   const response = await fetch(`${import.meta.env.VITE_Backend_URL}/api/upload/resume`, {
    //     method: 'POST',
    //     body: data,
    //     credentials: "include",
    //   });

    //   if (!response.ok) {
    //     throw new Error('Failed to parse resume. You can still continue and fill details manually.');
    //   }

    //   const parsedData = await response.json();
    //   // Pass the parsed data up to the parent state
    //   onChange(parsedData);
      
    //   setIsSuccess(true);
    //   setMessage("Success! Resume parsed successfully. Redirecting...");
    //   setIsLoading(false);
      
    //   // Auto-advance after success
    //   setTimeout(() => {
    //     onNext();
    //   }, 1500);

    // }
    try {
      const response = await fetch(`${import.meta.env.VITE_Backend_URL}/api/upload/resume`, {
        method: 'POST',
        body: data,
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error('Failed to parse resume. You can still continue and fill details manually.');
      }

      const parsedData = await response.json();
      // Pass the parsed data up to the parent state
      const education = parsedData.education?.[0] || {};
      const experiences = (parsedData.work_experience || []).map(exp => ({
        company: exp.organization ?? "",
        role: exp.title ?? "",
        startDate: exp.start_date ? new Date(Date.parse(exp.start_date)) : null,
        endDate:
          !exp.end_date || exp.end_date.toLowerCase() === "present"
            ? null
            : new Date(Date.parse(exp.end_date)),
        description: Array.isArray(exp.description)
          ? exp.description.join("\n")
          : exp.description ?? "",
        experienceCertificate: null,
        isCurrent: !exp.end_date || exp.end_date?.toLowerCase() === "present"
      }));
      const convertExperienceToRange = (years) => {
        if (years < 1) return "Less than 1 year";
        if (years < 3) return "1-3 years";
        if (years < 5) return "3-5 years";
        if (years < 8) return "5-8 years";
        if (years < 12) return "8-12 years";
        if (years < 15) return "12-15 years";
        return "15+ years";
      };
      const totalExperience = convertExperienceToRange(
        parsedData.total_experience_years || 0
      );
      const currentCompany = experiences.find(exp => exp.isCurrent)?.company || "";
      onChange({
        name: parsedData.name ?? "",
        email: parsedData.email ?? "",
        phone: parsedData.phone ?? "",

        college: education.institution ?? "",
        degree: education.degree ?? "",
        specialization: education.field_of_study ?? "",
        yearOfGraduation: education.year ?? "",

        skills: parsedData.skills ?? [],
        experiences :  experiences,

        totalExperience: totalExperience,
        currentCompany: currentCompany,

        linkedin: parsedData.linkedin_url ?? "",
        github: parsedData.github_url ?? "",
        portfolio: parsedData.portfolio_url ?? "",
      });
      
      setIsSuccess(true);
      setMessage("Success! Resume parsed successfully. Redirecting...");
      setIsLoading(false);
      // console.log(formData);
      // Auto-advance after success
      setTimeout(() => {
        onNext();
      }, 1500);

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
          
          {/* Header */}
          <div className="text-center mb-6">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-r from-[#667eea]/20 to-[#764ba2]/20 flex items-center justify-center mx-auto mb-4">
              <FileText className="w-10 h-10 text-[#667eea]" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent mb-2">
              Upload Your Resume
            </h1>
            <p className="text-gray-600 mb-4">
              Upload a PDF to pre-fill your profile, or skip to enter your details manually.
            </p>
          </div>

          {/* File Upload Section */}
          <div className="mb-8">
            <label className="text-gray-700 font-medium text-sm mb-2 block">
              Upload Resume (PDF)
            </label>
            
            <label className={`flex flex-col items-center justify-center w-full p-6 border-2 border-dashed rounded-xl transition-all duration-200 ${
              isLoading 
                ? 'bg-amber-50/30 border-amber-200 cursor-wait'
                : isSuccess
                ? 'bg-green-50/30 border-green-300'
                : 'border-gray-300 hover:border-[#667eea] hover:bg-[#667eea]/5 cursor-pointer'
            }`}>
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                {isSuccess ? (
                  <CheckCircle className="w-12 h-12 text-green-600 mb-3" />
                ) : (
                  <UploadIcon className={`w-12 h-12 mb-3 ${isLoading ? 'text-amber-500 animate-pulse' : 'text-gray-400'}`} />
                )}
                
                {isLoading ? (
                  <p className="mb-2 text-sm text-amber-700 font-medium">Processing your resume...</p>
                ) : isSuccess ? (
                  <p className="mb-2 text-sm text-green-700 font-medium">Successfully parsed!</p>
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
                  <p className="mt-4 text-sm font-medium text-[#5b21b6] truncate max-w-xs">
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
              <div className={`mt-4 p-3 rounded-xl text-sm font-medium border ${
                isSuccess 
                  ? 'bg-green-50 text-green-800 border-green-200'
                  : isLoading
                  ? 'bg-amber-50 text-amber-800 border-amber-200'
                  : 'bg-red-50 text-red-800 border-red-200'
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
              className="flex items-center justify-center px-6 py-3 bg-white/70 border border-gray-200 rounded-xl text-gray-700 hover:bg-white/90 hover:shadow-md transition-all duration-200 font-medium disabled:opacity-50"
            >
              Cancel
            </button>
            
            <button
              onClick={onNext}
              disabled={isLoading}
              className="flex items-center justify-center px-6 py-3 bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white rounded-xl hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-200 font-medium disabled:opacity-50"
            >
              {isLoading ? (
                "Processing..."
              ) : (
                <>
                  {file ? "Continue" : "Skip for now"}
                  <ChevronRight className="w-4 h-4 ml-2" />
                </>
              )}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};