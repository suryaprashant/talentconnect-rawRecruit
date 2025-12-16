import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import SimilarJobs from '../applicationStatus/SimilarJobs';
import { similarJobs } from '../../../constants/data.js';
import { FiUpload, FiSearch, FiMapPin, FiBriefcase, FiFileText } from 'react-icons/fi';

export default function AIDrivenJob() {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [location, setLocation] = useState('');
  const [experience, setExperience] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc', '.docx'],
    },
    onDrop: (acceptedFiles) => {
      setUploadedFile(acceptedFiles[0]);
    },
  });

  const locations = ['New York', 'London', 'Tokyo', 'Berlin', 'Remote'];
  const experiences = ['Entry', 'Mid', 'Senior', 'Lead', 'Manager'];

  const handleSearch = () => {
    if (!uploadedFile) {
      alert('Please upload your resume first');
      return;
    }
    
    setIsLoading(true);
    console.log({
      file: uploadedFile,
      location,
      experience
    });
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#667eea]/10 via-[#f093fb]/5 to-[#764ba2]/10">
      {/* Pastel blur background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#667eea]/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 -left-20 w-60 h-60 bg-[#f093fb]/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-1/3 w-40 h-40 bg-[#764ba2]/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header Section */}
          <div className="bg-white/90 backdrop-blur-sm border border-white/50 rounded-2xl shadow-lg shadow-purple-50/50 p-8 mb-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent mb-4">
                AI-Powered Job Recommendations
              </h1>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Upload your resume and let our AI match you with the perfect opportunities based on your skills and experience.
              </p>
            </div>

            {/* File Upload Section */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                <FiFileText className="inline w-4 h-4 mr-2 text-gray-500" />
                Upload your resume or CV
              </label>
              
              {!uploadedFile ? (
                <div
                  {...getRootProps()}
                  className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-200
                    ${isDragActive 
                      ? 'border-[#667eea] bg-gradient-to-r from-[#667eea]/10 to-[#764ba2]/10' 
                      : 'border-gray-200 hover:border-[#667eea] hover:bg-gradient-to-r hover:from-[#667eea]/5 hover:to-[#764ba2]/5'
                    }`}
                >
                  <input {...getInputProps()} />
                  <div className="flex flex-col items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-r from-[#667eea]/20 to-[#764ba2]/20 flex items-center justify-center mb-4">
                      <FiUpload className="w-8 h-8 text-[#667eea]" />
                    </div>
                    <p className="text-gray-700 font-medium mb-1">
                      {isDragActive ? 'Drop your resume here' : 'Drag & drop your resume here'}
                    </p>
                    <p className="text-sm text-gray-500">or click to browse files</p>
                    <p className="text-xs text-gray-400 mt-2">PDF, DOC, DOCX (Max 5MB)</p>
                  </div>
                </div>
              ) : (
                <div className="border border-gray-100 rounded-2xl p-6 flex items-center justify-between bg-gradient-to-r from-[#bbf7d0]/10 to-[#86efac]/10">
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-[#667eea]/20 to-[#764ba2]/20 flex items-center justify-center mr-4">
                      <FiFileText className="w-6 h-6 text-[#667eea]" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{uploadedFile.name}</p>
                      <p className="text-sm text-gray-500">
                        {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB • Uploaded successfully
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setUploadedFile(null)}
                      className="text-sm px-3 py-1 bg-white/70 backdrop-blur-sm border border-gray-200 rounded-lg text-gray-700 hover:bg-white/90 hover:shadow-md transition-all duration-200"
                    >
                      Replace
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Filters Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  <FiMapPin className="inline w-4 h-4 mr-2 text-gray-500" />
                  Preferred Location
                </label>
                <div className="relative">
                  <select
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full p-3 pl-10 border border-gray-200 rounded-xl bg-white/50 focus:outline-none focus:ring-2 focus:ring-[#667eea]/30 focus:border-[#667eea] backdrop-blur-sm appearance-none"
                  >
                    <option value="">Select your location preference</option>
                    {locations.map((loc) => (
                      <option key={loc} value={loc}>{loc}</option>
                    ))}
                  </select>
                  <div className="absolute left-3 top-3 text-gray-400">
                    <FiMapPin className="w-5 h-5" />
                  </div>
                  <div className="absolute right-3 top-3 text-gray-400 pointer-events-none">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  <FiBriefcase className="inline w-4 h-4 mr-2 text-gray-500" />
                  Experience Level
                </label>
                <div className="relative">
                  <select
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                    className="w-full p-3 pl-10 border border-gray-200 rounded-xl bg-white/50 focus:outline-none focus:ring-2 focus:ring-[#667eea]/30 focus:border-[#667eea] backdrop-blur-sm appearance-none"
                  >
                    <option value="">Select your experience level</option>
                    {experiences.map((exp) => (
                      <option key={exp} value={exp}>{exp}</option>
                    ))}
                  </select>
                  <div className="absolute left-3 top-3 text-gray-400">
                    <FiBriefcase className="w-5 h-5" />
                  </div>
                  <div className="absolute right-3 top-3 text-gray-400 pointer-events-none">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Search Button */}
            <button
              onClick={handleSearch}
              disabled={isLoading || !uploadedFile}
              className="w-full py-3 bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white rounded-xl hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Analyzing Resume...
                </>
              ) : (
                <>
                  <FiSearch className="w-5 h-5 mr-2" />
                  Find AI Recommendations
                </>
              )}
            </button>
          </div>

          {/* Similar Jobs Component */}
          <SimilarJobs 
            jobs={similarJobs} 
            title="AI Job Recommendations" 
            description="Based on your resume analysis, here are the best matching opportunities for your profile."
          />
        </div>
      </div>
    </div>
  );
}