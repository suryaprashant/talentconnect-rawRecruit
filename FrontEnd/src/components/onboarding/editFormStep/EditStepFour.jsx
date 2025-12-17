import React, { useState } from "react";
import { ChevronDownIcon, Target, MapPin, Briefcase, Building, Edit2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const EditStepFour = () => {
  const [isEditable, setIsEditable] = useState(false);
  const [formData, setFormData] = useState({
    industryType: "",
    jobRoles: "",
    locations: "",
    lookingFor: "internship",
    employmentType: "full-time",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRadioChange = (field, value) => {
    if (isEditable) {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleEditClick = () => {
    setIsEditable(true);
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
        <div className="bg-white/90 backdrop-blur-sm border border-white/50 rounded-2xl shadow-lg shadow-purple-50/50 p-8 w-full max-w-2xl">
          
          {/* Header with gradient */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-r from-[#667eea]/20 to-[#764ba2]/20 flex items-center justify-center mx-auto mb-4">
              <Target className="w-10 h-10 text-[#667eea]" />
            </div>
            <div className="flex items-center justify-center gap-2 mb-2">
              <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent">
                Career Preferences
              </h1>
              {!isEditable && (
                <button
                  onClick={handleEditClick}
                  className="p-2 rounded-full bg-gradient-to-r from-[#667eea]/10 to-[#764ba2]/10 hover:from-[#667eea]/20 hover:to-[#764ba2]/20 transition-all duration-200"
                >
                  <Edit2 className="w-4 h-4 text-[#667eea]" />
                </button>
              )}
            </div>
            <p className="text-gray-600 mb-4">
              Let us know your job interests and preferred locations so we can recommend the best opportunities for you.
            </p>
          </div>

          {/* Form Section */}
          <div className="space-y-6">
            {/* Industry Type */}
            <div>
              <label htmlFor="industryType" className="block text-gray-700 font-medium text-sm mb-2">
                Interested Industry Type
              </label>
              <div className="flex items-center">
                <Building className={`w-5 h-5 mr-3 ${!isEditable ? "text-gray-400" : "text-gray-500"}`} />
                <div className="relative flex-grow">
                  <select
                    id="industryType"
                    name="industryType"
                    value={formData.industryType}
                    onChange={handleChange}
                    disabled={!isEditable}
                    className={`appearance-none w-full p-4 border rounded-xl focus:outline-none transition-all duration-200 pr-10 ${
                      !isEditable 
                        ? "bg-gradient-to-r from-gray-50/50 to-gray-50/30 border-gray-200 text-gray-500 cursor-not-allowed" 
                        : "border-gray-300 hover:border-[#667eea] focus:border-[#667eea] focus:shadow-[0_0_0_3px_rgba(102,126,234,0.1)] text-gray-700"
                    }`}
                  >
                    <option value="" disabled>Select Industry</option>
                    <option value="technology">Technology</option>
                    <option value="finance">Finance</option>
                    <option value="healthcare">Healthcare</option>
                    <option value="education">Education</option>
                    <option value="manufacturing">Manufacturing</option>
                  </select>
                  <ChevronDownIcon className={`absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 pointer-events-none ${
                    !isEditable ? "text-gray-400" : "text-gray-500"
                  }`} />
                </div>
              </div>
            </div>

            {/* Job Roles */}
            <div>
              <label htmlFor="jobRoles" className="block text-gray-700 font-medium text-sm mb-2">
                Interested Job Roles
              </label>
              <div className="flex items-center">
                <Briefcase className={`w-5 h-5 mr-3 ${!isEditable ? "text-gray-400" : "text-gray-500"}`} />
                <div className="relative flex-grow">
                  <select
                    id="jobRoles"
                    name="jobRoles"
                    value={formData.jobRoles}
                    onChange={handleChange}
                    disabled={!isEditable}
                    className={`appearance-none w-full p-4 border rounded-xl focus:outline-none transition-all duration-200 pr-10 ${
                      !isEditable 
                        ? "bg-gradient-to-r from-gray-50/50 to-gray-50/30 border-gray-200 text-gray-500 cursor-not-allowed" 
                        : "border-gray-300 hover:border-[#667eea] focus:border-[#667eea] focus:shadow-[0_0_0_3px_rgba(102,126,234,0.1)] text-gray-700"
                    }`}
                  >
                    <option value="" disabled>Select Job Role</option>
                    <option value="developer">Software Developer</option>
                    <option value="designer">UI/UX Designer</option>
                    <option value="manager">Project Manager</option>
                    <option value="analyst">Data Analyst</option>
                    <option value="marketing">Marketing Specialist</option>
                  </select>
                  <ChevronDownIcon className={`absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 pointer-events-none ${
                    !isEditable ? "text-gray-400" : "text-gray-500"
                  }`} />
                </div>
              </div>
            </div>

            {/* Locations */}
            <div>
              <label htmlFor="locations" className="block text-gray-700 font-medium text-sm mb-2">
                Preferred Job Locations
              </label>
              <div className="flex items-center">
                <MapPin className={`w-5 h-5 mr-3 ${!isEditable ? "text-gray-400" : "text-gray-500"}`} />
                <div className="relative flex-grow">
                  <select
                    id="locations"
                    name="locations"
                    value={formData.locations}
                    onChange={handleChange}
                    disabled={!isEditable}
                    className={`appearance-none w-full p-4 border rounded-xl focus:outline-none transition-all duration-200 pr-10 ${
                      !isEditable 
                        ? "bg-gradient-to-r from-gray-50/50 to-gray-50/30 border-gray-200 text-gray-500 cursor-not-allowed" 
                        : "border-gray-300 hover:border-[#667eea] focus:border-[#667eea] focus:shadow-[0_0_0_3px_rgba(102,126,234,0.1)] text-gray-700"
                    }`}
                  >
                    <option value="" disabled>Select Location</option>
                    <option value="bangalore">Bangalore</option>
                    <option value="mumbai">Mumbai</option>
                    <option value="delhi">Delhi</option>
                    <option value="hyderabad">Hyderabad</option>
                    <option value="pune">Pune</option>
                    <option value="remote">Remote</option>
                  </select>
                  <ChevronDownIcon className={`absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 pointer-events-none ${
                    !isEditable ? "text-gray-400" : "text-gray-500"
                  }`} />
                </div>
              </div>
            </div>

            {/* Looking For */}
            <div>
              <label className="block text-gray-700 font-medium text-sm mb-2">
                Looking for
              </label>
              <div className="grid grid-cols-3 gap-3">
                {["job", "internship", "both"].map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => handleRadioChange("lookingFor", option)}
                    disabled={!isEditable}
                    className={`p-3 border rounded-xl transition-all duration-200 font-medium ${
                      formData.lookingFor === option
                        ? isEditable
                          ? "bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white border-transparent shadow-lg shadow-purple-500/30"
                          : "bg-gradient-to-r from-[#667eea]/60 to-[#764ba2]/60 text-white border-transparent"
                        : "text-gray-700 border-gray-300"
                    } ${!isEditable ? "cursor-not-allowed" : "hover:border-[#667eea] hover:bg-gradient-to-r hover:from-[#667eea]/5 hover:to-[#764ba2]/5"}`}
                  >
                    {option.charAt(0).toUpperCase() + option.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Employment Type */}
            <div>
              <label className="block text-gray-700 font-medium text-sm mb-2">
                Employment Type
              </label>
              <div className="grid grid-cols-3 gap-3">
                {["part-time", "full-time", "contract"].map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => handleRadioChange("employmentType", type)}
                    disabled={!isEditable}
                    className={`p-3 border rounded-xl transition-all duration-200 font-medium ${
                      formData.employmentType === type
                        ? isEditable
                          ? "bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white border-transparent shadow-lg shadow-purple-500/30"
                          : "bg-gradient-to-r from-[#667eea]/60 to-[#764ba2]/60 text-white border-transparent"
                        : "text-gray-700 border-gray-300"
                    } ${!isEditable ? "cursor-not-allowed" : "hover:border-[#667eea] hover:bg-gradient-to-r hover:from-[#667eea]/5 hover:to-[#764ba2]/5"}`}
                  >
                    {type.replace("-", " ").replace(/^\w/, (c) => c.toUpperCase())}
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between mt-8">
            <button
              type="button"
              onClick={() => navigate('/step/3')}
              className="flex items-center justify-center px-8 py-3 bg-white/70 backdrop-blur-sm border border-gray-200 rounded-xl text-gray-700 hover:bg-white/90 hover:shadow-md transition-all duration-200 font-medium"
            >
              Cancel
            </button>

            <div className="flex gap-3">
              {!isEditable && (
                <button
                  type="button"
                  onClick={handleEditClick}
                  className="flex items-center justify-center px-8 py-3 bg-gradient-to-r from-[#667eea]/10 to-[#764ba2]/10 border border-[#667eea]/30 rounded-xl text-[#5b21b6] hover:bg-gradient-to-r hover:from-[#667eea]/20 hover:to-[#764ba2]/20 hover:shadow-md transition-all duration-200 font-medium"
                >
                  <Edit2 className="w-4 h-4 mr-2" />
                  Edit
                </button>
              )}
              <button
                type="button"
                onClick={() => navigate('/step/5')}
                className="flex items-center justify-center px-8 py-3 bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white rounded-xl hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-200 font-medium"
              >
                Next
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};