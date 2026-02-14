import React, { useState, useEffect, useRef, useMemo } from "react";
import { ChevronDownIcon, X, Target, MapPin, Briefcase } from "lucide-react";
import { City } from "country-state-city";
import CreatableSelect from 'react-select/creatable';

const jobRoleOptions = ['Software Developer', 'Data Scientist', 'DevOps Engineer', 'QA Engineer', 'Frontend Developer', 'Backend Developer', 'Full Stack Developer', 'Mobile App Developer', 'UI/UX Designer', 'Product Manager', 'Business Analyst', 'Data Analyst', 'Machine Learning Engineer', 'Cloud Architect', 'Network Engineer', 'Cyber Security Specialist', 'Technical Writer', 'Sales Engineer', 'Marketing Specialist', 'HR Recruiter', 'Finance Analyst', 'Other'];
 
const employmentTypeOptions = ["part time", "full time", "contract"];

const SelectedTag = ({ item, onRemove }) => (
  <div className="flex items-center bg-gradient-to-r from-[#e0e7ff]/20 to-[#c7d2fe]/20 border border-[#e0e7ff]/30 text-gray-700 text-sm px-3 py-1.5 rounded-full">
    <span>{item}</span>
    <button
      type="button"
      onClick={onRemove}
      className="ml-2 text-gray-500 hover:text-red-500 transition-colors"
    >
      <X size={14} />
    </button>
  </div>
);

export const StepFour = ({ onNext, onBack, formData, onChange }) => {

  const locationOptions = useMemo(() => {
    return City.getCitiesOfCountry("IN")
      ?.map((city) => ({
        value: city.name,
        label: city.name,
      }))
      ?.sort((a, b) => a.label.localeCompare(b.label));
  }, []);

  const [localFormData, setLocalFormData] = useState({
    industry: formData.industry || "",
    jobRoles: Array.isArray(formData.jobRoles)
      ? formData.jobRoles
      : formData.jobRoles
        ? [formData.jobRoles]
        : [],
    locations: Array.isArray(formData.locations)
      ? formData.locations
      : formData.locations
        ? [formData.locations]
        : [],
    lookingFor: formData.lookingFor || "Internship",
    employmentType: Array.isArray(formData.employmentType)
      ? formData.employmentType
      : formData.employmentType
        ? [formData.employmentType]
        : [],
  });

  const [dropdownOpen, setDropdownOpen] = useState({
    jobRoles: false,
    locations: false,
  });

  const jobRolesRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (jobRolesRef.current && !jobRolesRef.current.contains(event.target)) {
        setDropdownOpen((prev) => ({ ...prev, jobRoles: false }));
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleStandardChange = (e) => {
    const { name, value } = e.target;
    setLocalFormData((prev) => ({ ...prev, [name]: value }));
  };

  const toggleDropdown = (field) => {
    setDropdownOpen((prev) => ({
      ...Object.keys(prev).reduce((acc, key) => ({ ...acc, [key]: false }), {}),
      [field]: !prev[field],
    }));
  };

  const handleMultiSelect = (field, value) => {
    setLocalFormData((prev) => {
      const currentValues = prev[field] || [];
      const newValues = currentValues.includes(value)
        ? currentValues.filter((item) => item !== value)
        : [...currentValues, value];
      return { ...prev, [field]: newValues };
    });
  };

  const removeSelectedItem = (field, value) => {
    setLocalFormData((prev) => ({
      ...prev,
      [field]: prev[field].filter((item) => item !== value),
    }));
  };

  // --- Handler for Locations (React-Select) ---
  const handleLocationChange = (selectedOptions) => {
    const locations = selectedOptions ? selectedOptions.map(opt => opt.value) : [];
    setLocalFormData(prev => ({ ...prev, locations }));
  };

  const selectedLocationsValue = (localFormData.locations || []).map(loc => ({
    label: loc,
    value: loc
  }));

  // --- Handlers for Looking For ---
  const handleLookingForClick = (option) => {
  // We wrap the option in an array because your schema is type: [String]
  // This sends ["Job"], ["Internship"], or ["Both"]
  setLocalFormData(prev => ({ 
    ...prev, 
    lookingFor: [option] 
  }));
};

const isLookingForActive = (option) => {
  // Checks if the first element of the array matches the button clicked
  return Array.isArray(localFormData.lookingFor) && localFormData.lookingFor[0] === option;
};

  const handleNextClick = () => {
    const dataToSave = {
      ...localFormData,
      jobRoles: localFormData.jobRoles,
      locations: localFormData.locations,
      employmentType: localFormData.employmentType,
      lookingFor: localFormData.lookingFor
    };
    onChange({ ...formData, ...dataToSave });
    onNext();
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
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent mb-2">
              Career Goals & Preferences
            </h1>
            <p className="text-gray-600 mb-4">
              Let us know your job interests and preferred locations so we can recommend the best opportunities for you.
            </p>
          </div>

          {/* Wider Form Section */}
          <div className="space-y-6">
            {/* Industry Type */}
            <div>
              <label htmlFor="industry" className="block text-gray-700 font-medium text-sm mb-2">
                Interested Industry Type
              </label>
              <div className="relative">
                <select
                  id="industry"
                  name="industry"
                  value={localFormData.industry}
                  onChange={handleStandardChange}
                  className="appearance-none w-full p-4 bg-transparent border border-gray-300 rounded-xl focus:outline-none focus:border-[#667eea] focus:shadow-[0_0_0_3px_rgba(102,126,234,0.1)] text-gray-700 pr-10"
                >
                  <option value="" disabled>Select Industry</option>
                  <option value="Technology">Technology</option>
                  <option value="Finance">Finance</option>
                  <option value="Healthcare">Healthcare</option>
                  <option value="Education">Education</option>
                  <option value="Manufacturing">Manufacturing</option>
                </select>
                <svg className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {/* Job Roles */}
            <div
              ref={jobRolesRef}
              className="relative"
            >
              <label className="block text-gray-700 font-medium text-sm mb-2">
                Interested Job Roles
              </label>

              {/* Selected Tags */}
              {localFormData.jobRoles.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {localFormData.jobRoles.map((role) => (
                    <SelectedTag
                      key={role}
                      item={role}
                      onRemove={() => removeSelectedItem("jobRoles", role)}
                    />
                  ))}
                </div>
              )}

              {/* Custom Dropdown Trigger */}
              <div
                className="flex items-center justify-between p-4 w-full border border-gray-300 rounded-xl cursor-pointer hover:border-[#667eea] transition-all duration-200"
                onClick={() => toggleDropdown("jobRoles")}
              >
                <div className="flex items-center">
                  <Briefcase className="w-5 h-5 text-gray-400 mr-3" />
                  <span className={localFormData.jobRoles.length > 0 ? "text-gray-700" : "text-gray-400"}>
                    {localFormData.jobRoles.length > 0
                      ? `Selected ${localFormData.jobRoles.length} role(s)`
                      : "Select one or more job roles"}
                  </span>
                </div>
                <ChevronDownIcon
                  className={`w-5 h-5 text-gray-400 transition-transform ${dropdownOpen.jobRoles ? "rotate-180" : ""
                    }`}
                />
              </div>

              {/* Custom Dropdown Menu */}
              {dropdownOpen.jobRoles && (
                <div className="absolute z-20 mt-1 w-full bg-white border border-gray-300 rounded-xl shadow-lg max-h-60 overflow-auto">
                  {jobRoleOptions.map((role) => (
                    <div
                      key={role}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMultiSelect("jobRoles", role);
                      }}
                      className={`px-4 py-3 hover:bg-gradient-to-r from-[#667eea]/5 to-[#764ba2]/5 cursor-pointer transition-all duration-200 border-b border-gray-100 last:border-b-0 ${localFormData.jobRoles.includes(role)
                        ? "bg-gradient-to-r from-[#667eea]/10 to-[#764ba2]/10 text-[#5b21b6]"
                        : ""
                        }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-gray-700">{role}</span>
                        {localFormData.jobRoles.includes(role) && (
                          <svg className="w-5 h-5 text-[#667eea]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Preferred Locations */}
            <div>
              <label className="block text-gray-700 font-medium text-sm mb-2">
                Preferred Job Locations
              </label>
              <div className="flex items-center p-1">
                <MapPin className="w-5 h-5 text-gray-400 mr-3 flex-shrink-0" />
                <CreatableSelect
                  isMulti
                  options={locationOptions}
                  value={selectedLocationsValue}
                  onChange={handleLocationChange}
                  placeholder="Select or type to add locations..."
                  styles={{
                    control: (base, state) => ({
                      ...base,
                      border: 'none',
                      minHeight: '40px',
                      backgroundColor: 'transparent',
                      boxShadow: 'none',
                      '&:hover': {
                        border: 'none'
                      }
                    }),
                    container: (base) => ({
                      ...base,
                      width: '100%'
                    }),
                    valueContainer: (base) => ({
                      ...base,
                      padding: '0'
                    }),
                    input: (base) => ({
                      ...base,
                      margin: '0',
                      padding: '0',
                      color: '#374151'
                    }),
                    placeholder: (base) => ({
                      ...base,
                      color: '#9ca3af',
                      margin: '0'
                    }),
                    menu: (base) => ({
                      ...base,
                      borderRadius: '12px',
                      border: '1px solid #e5e7eb',
                      zIndex: 50,
                      marginTop: '8px'
                    }),
                    option: (base, state) => ({
                      ...base,
                      backgroundColor: state.isSelected
                        ? 'rgba(102, 126, 234, 0.1)'
                        : state.isFocused
                          ? 'rgba(102, 126, 234, 0.05)'
                          : 'white',
                      color: state.isSelected ? '#5b21b6' : '#374151',
                      cursor: 'pointer',
                      padding: '12px 16px',
                      '&:active': {
                        backgroundColor: 'rgba(102, 126, 234, 0.1)'
                      }
                    }),
                    multiValue: (base) => ({
                      ...base,
                      backgroundColor: 'rgba(102, 126, 234, 0.1)',
                      borderRadius: '9999px',
                      border: '1px solid rgba(102, 126, 234, 0.2)'
                    }),
                    multiValueLabel: (base) => ({
                      ...base,
                      color: '#5b21b6',
                      padding: '4px 8px',
                      fontWeight: '500'
                    }),
                    multiValueRemove: (base) => ({
                      ...base,
                      borderRadius: '0 9999px 9999px 0',
                      color: '#8b5cf6',
                      ':hover': {
                        backgroundColor: 'rgba(102, 126, 234, 0.2)',
                        color: '#5b21b6',
                      },
                    }),
                  }}
                />
              </div>
            </div>

            {/* Looking For */}
            <div>
              <label className="block text-gray-700 font-medium text-sm mb-2">
                Looking for
              </label>
              <div className="grid grid-cols-3 gap-3">
                {["Job", "Internship", "Both"].map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => handleLookingForClick(option)}
                    className={`p-3 border rounded-xl transition-all duration-200 font-medium ${isLookingForActive(option)
                      ? "bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white border-transparent shadow-lg shadow-purple-500/30"
                      : "text-gray-700 border-gray-300 hover:border-[#667eea] hover:bg-gradient-to-r hover:from-[#667eea]/5 hover:to-[#764ba2]/5"
                      }`}
                  >
                    {option}
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
                {employmentTypeOptions.map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => handleMultiSelect("employmentType", type)}
                    className={`p-3 border rounded-xl transition-all duration-200 font-medium capitalize ${localFormData.employmentType.includes(type)
                      ? "bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white border-transparent shadow-lg shadow-purple-500/30"
                      : "text-gray-700 border-gray-300 hover:border-[#667eea] hover:bg-gradient-to-r hover:from-[#667eea]/5 hover:to-[#764ba2]/5"
                      }`}
                  >
                    {type.replace("-", " ")}
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between mt-8">
            <button
              type="button"
              onClick={onBack}
              className="flex items-center justify-center px-8 py-3 bg-white/70 backdrop-blur-sm border border-gray-200 rounded-xl text-gray-700 hover:bg-white/90 hover:shadow-md transition-all duration-200 font-medium"
            >
              Back
            </button>
            <button
              type="button"
              onClick={handleNextClick}
              className="flex items-center justify-center px-8 py-3 bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white rounded-xl hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-200 font-medium"
            >
              Next
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};