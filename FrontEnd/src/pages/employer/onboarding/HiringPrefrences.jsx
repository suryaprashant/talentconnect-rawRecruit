import React, { useState, useRef, useEffect } from "react";
import { motion } from 'framer-motion';

const DefineHiringPreferences = ({ onBack, formData, onNext, updateFormData }) => {
  const [errors, setErrors] = useState({});
  const [showJobRolesDropdown, setShowJobRolesDropdown] = useState(false);
  const [showLocationsDropdown, setShowLocationsDropdown] = useState(false);
  const jobRolesRef = useRef(null);
  const locationsRef = useRef(null);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.jobRoles?.length) newErrors.jobRoles = 'Job roles are required';
    if (!formData.hiringLocations?.length) newErrors.hiringLocations = 'Hiring locations are required';
    if (!formData.lookingFor) newErrors.lookingFor = 'Please select what you are looking for';
    if (!formData.employmentType?.length) newErrors.employmentType = 'Employment type is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextClick = () => {
    if (validateForm()) {
      // Ensure employmentType is properly formatted as an array of strings
      const formattedData = {
        ...formData,
        employmentType: Array.isArray(formData.employmentType) 
          ? formData.employmentType 
          : [formData.employmentType].filter(Boolean)
      };
      updateFormData(formattedData);
      onNext();
    }
  };

  const handleLookingForChange = (value) => {
    updateFormData({ lookingFor: value });
  };

  const handleEmploymentTypeChange = (value) => {
    const currentTypes = formData.employmentType || [];
    let newTypes;
    
    if (currentTypes.includes(value)) {
      // Remove if already selected
      newTypes = currentTypes.filter(type => type !== value);
    } else {
      // Add if not selected
      newTypes = [...currentTypes, value];
    }
    
    updateFormData({ employmentType: newTypes });
  };

  const toggleJobRolesDropdown = () => {
    setShowJobRolesDropdown(!showJobRolesDropdown);
    setShowLocationsDropdown(false);
  };

  const toggleLocationsDropdown = () => {
    setShowLocationsDropdown(!showLocationsDropdown);
    setShowJobRolesDropdown(false);
  };

  const handleJobRoleSelect = (roleValue) => {
    const currentRoles = formData.jobRoles || [];
    const newRoles = currentRoles.includes(roleValue)
      ? currentRoles.filter(r => r !== roleValue)
      : [...currentRoles, roleValue];
    updateFormData({ jobRoles: newRoles });
  };

  const handleLocationSelect = (locationValue) => {
    const currentLocations = formData.hiringLocations || [];
    const newLocations = currentLocations.includes(locationValue)
      ? currentLocations.filter(l => l !== locationValue)
      : [...currentLocations, locationValue];
    updateFormData({ hiringLocations: newLocations });
  };

  const removeJobRole = (roleToRemove) => {
    const newJobRoles = formData.jobRoles?.filter(role => role !== roleToRemove) || [];
    updateFormData({ jobRoles: newJobRoles });
  };

  const removeLocation = (locationToRemove) => {
    const newLocations = formData.hiringLocations?.filter(location => location !== locationToRemove) || [];
    updateFormData({ hiringLocations: newLocations });
  };

  const jobRoleOptions = [
    { value: "software_engineer", label: "Software Engineer" },
    { value: "data_scientist", label: "Data Scientist" },
    { value: "product_manager", label: "Product Manager" },
    { value: "designer", label: "Designer" },
    { value: "marketing", label: "Marketing" }
  ];

  const locationOptions = [
    { value: "new_york", label: "New York" },
    { value: "san_francisco", label: "San Francisco" },
    { value: "remote", label: "Remote" },
    { value: "london", label: "London" },
    { value: "austin", label: "Austin" }
  ];

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (jobRolesRef.current && !jobRolesRef.current.contains(event.target)) {
        setShowJobRolesDropdown(false);
      }
      if (locationsRef.current && !locationsRef.current.contains(event.target)) {
        setShowLocationsDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-2xl shadow-xl w-full max-w-2xl p-8 mx-auto"
    >
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-sm font-medium">
            ✓
          </div>
          <div className="w-16 h-px bg-gray-300"></div>
          <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-sm font-medium">
            ✓
          </div>
          <div className="w-16 h-px bg-gray-300"></div>
          <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-sm font-medium">
            3
          </div>
        </div>
      </div>

      <h1 className="text-2xl font-bold text-gray-900 mb-1">
        Define Your Hiring Preferences!
      </h1>
      <p className="text-gray-600 mb-6">
        Tell us what roles you're hiring for and where!
      </p>

      <div className="space-y-6">
        {/* Job Roles Dropdown - Multi Select */}
        <div ref={jobRolesRef}>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Job Roles You Hire For
          </label>
          
          {/* Selected job roles chips */}
          <div className="flex flex-wrap gap-2 mb-2">
            {formData.jobRoles?.map((role, index) => {
              const roleLabel = jobRoleOptions.find(opt => opt.value === role)?.label || role;
              return (
                <span key={index} className="flex items-center bg-gray-200 text-sm text-black px-3 py-1 rounded-full">
                  {roleLabel}
                  <button 
                    type="button" 
                    onClick={() => removeJobRole(role)} 
                    className="ml-2 text-gray-600 hover:text-black"
                  >
                    ×
                  </button>
                </span>
              );
            })}
          </div>
          
          <div className="relative">
            <div
              onClick={toggleJobRolesDropdown}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer flex justify-between items-center ${
                errors.jobRoles ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <span className="text-gray-700">
                Select Job Roles
              </span>
              <svg
                className={`w-5 h-5 text-gray-500 transition-transform ${
                  showJobRolesDropdown ? "transform rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
            {showJobRolesDropdown && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                {jobRoleOptions.map((option) => (
                  <div
                    key={option.value}
                    onClick={() => handleJobRoleSelect(option.value)}
                    className={`px-4 py-2 hover:bg-gray-100 cursor-pointer ${
                      formData.jobRoles?.includes(option.value) ? "bg-gray-100 font-medium" : ""
                    }`}
                  >
                    {option.label}
                  </div>
                ))}
              </div>
            )}
            {errors.jobRoles && (
              <p className="mt-1 text-sm text-red-600">{errors.jobRoles}</p>
            )}
          </div>
        </div>

        {/* Locations Dropdown - Multi Select */}
        <div ref={locationsRef}>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Preferred Hiring Locations
          </label>
          
          {/* Selected locations chips */}
          <div className="flex flex-wrap gap-2 mb-2">
            {formData.hiringLocations?.map((location, index) => {
              const locationLabel = locationOptions.find(opt => opt.value === location)?.label || location;
              return (
                <span key={index} className="flex items-center bg-gray-200 text-sm text-black px-3 py-1 rounded-full">
                  {locationLabel}
                  <button 
                    type="button" 
                    onClick={() => removeLocation(location)} 
                    className="ml-2 text-gray-600 hover:text-black"
                  >
                    ×
                  </button>
                </span>
              );
            })}
          </div>
          
          <div className="relative">
            <div
              onClick={toggleLocationsDropdown}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer flex justify-between items-center ${
                errors.hiringLocations ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <span className="text-gray-700">
                Select Locations
              </span>
              <svg
                className={`w-5 h-5 text-gray-500 transition-transform ${
                  showLocationsDropdown ? "transform rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
            {showLocationsDropdown && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                {locationOptions.map((option) => (
                  <div
                    key={option.value}
                    onClick={() => handleLocationSelect(option.value)}
                    className={`px-4 py-2 hover:bg-gray-100 cursor-pointer ${
                      formData.hiringLocations?.includes(option.value) ? "bg-gray-100 font-medium" : ""
                    }`}
                  >
                    {option.label}
                  </div>
                ))}
              </div>
            )}
            {errors.hiringLocations && (
              <p className="mt-1 text-sm text-red-600">{errors.hiringLocations}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Looking for
          </label>
          <div className="flex space-x-2">
            {['job', 'internship', 'both'].map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => handleLookingForChange(option)}
                className={`px-4 py-2 rounded-md border transition-colors ${
                  formData.lookingFor === option
                    ? 'bg-black text-white border-black'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </button>
            ))}
          </div>
          {errors.lookingFor && (
            <p className="mt-1 text-sm text-red-600">{errors.lookingFor}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Employment type
          </label>
          <div className="flex space-x-2">
            {['part-time', 'full-time', 'contract'].map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => handleEmploymentTypeChange(option)}
                className={`px-4 py-2 rounded-md border transition-colors ${
                  formData.employmentType?.includes(option)
                    ? 'bg-black text-white border-black'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                {option.replace('-', ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
              </button>
            ))}
          </div>
          {errors.employmentType && (
            <p className="mt-1 text-sm text-red-600">{errors.employmentType}</p>
          )}
        </div>
      </div>

      <div className="flex justify-between mt-8">
        <button
          onClick={onBack}
          className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Back
        </button>
        <button
          onClick={handleNextClick}
          className="px-6 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
        >
          Next
        </button>
      </div>
    </motion.div>
  );
};

export default DefineHiringPreferences;