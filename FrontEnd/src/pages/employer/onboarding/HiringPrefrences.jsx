import React, { useState, useRef, useEffect, useMemo } from "react";
import { motion } from 'framer-motion';
import { City } from 'country-state-city';
import CreatableSelect from 'react-select/creatable';

const DefineHiringPreferences = ({ onBack, formData, onNext, updateFormData }) => {
    const [errors, setErrors] = useState({});
    const [showJobRolesDropdown, setShowJobRolesDropdown] = useState(false);
    const jobRolesRef = useRef(null);
    
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
      if (!validateForm()) return;

      let lookingForValue = formData.lookingFor;

      if (lookingForValue === 'job') lookingForValue = 'Job';
      if (lookingForValue === 'internship') lookingForValue = 'Internship';
      if (lookingForValue === 'both') lookingForValue = 'Both';

      updateFormData({
        ...formData,
        lookingFor: lookingForValue,
        employmentType: Array.isArray(formData.employmentType)
          ? formData.employmentType
          : [formData.employmentType].filter(Boolean),
      });

      onNext();
    };


    const handleLookingForChange = (value) => {
        updateFormData({ lookingFor: value });
    };

    const isLookingForActive = (value) => {
      return formData.lookingFor === value;
    };


    const handleEmploymentTypeChange = (value) => {
        const currentTypes = formData.employmentType || [];
        let newTypes;
        
        if (currentTypes.includes(value)) {
            newTypes = currentTypes.filter(type => type !== value);
        } else {
            newTypes = [...currentTypes, value];
        }
        
        updateFormData({ employmentType: newTypes });
    };

    const toggleJobRolesDropdown = () => {
        setShowJobRolesDropdown(!showJobRolesDropdown);
    };

    const handleJobRoleSelect = (roleValue) => {
        const currentRoles = formData.jobRoles || [];
        const newRoles = currentRoles.includes(roleValue)
            ? currentRoles.filter(r => r !== roleValue)
            : [...currentRoles, roleValue];
        updateFormData({ jobRoles: newRoles });
    };

    const removeJobRole = (roleToRemove) => {
        const newJobRoles = formData.jobRoles?.filter(role => role !== roleToRemove) || [];
        updateFormData({ jobRoles: newJobRoles });
    };

    const locationOptions = useMemo(() => {
        return City.getCitiesOfCountry('IN')
            ?.map(city => ({
                value: city.name,
                label: city.name,
            }))
            ?.sort((a, b) => a.label.localeCompare(b.label));
    }, []);

    const handleLocationChange = (selectedOptions) => {
        const locations = selectedOptions ? selectedOptions.map(opt => opt.value) : [];
        updateFormData({ hiringLocations: locations });
    };

    const selectedLocationsValue = (formData.hiringLocations || []).map(loc => ({
        label: loc,
        value: loc
    }));

    const jobRoleOptions = [
        { value: "software_engineer", label: "Software Engineer" },
        { value: "data_scientist", label: "Data Scientist" },
        { value: "product_manager", label: "Product Manager" },
        { value: "designer", label: "Designer" },
        { value: "marketing", label: "Marketing" }
    ];

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (jobRolesRef.current && !jobRolesRef.current.contains(event.target)) {
                setShowJobRolesDropdown(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#667eea]/15 via-[#f093fb]/10 to-[#764ba2]/15 p-4">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-[#667eea]/10 to-[#764ba2]/10 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-[#f093fb]/10 to-[#f5576c]/10 rounded-full blur-3xl"></div>
            </div>

            <div className="relative w-full max-w-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-[#667eea]/5 to-[#764ba2]/5 backdrop-blur-sm rounded-2xl -inset-x-4 bottom-0"></div>
                
                <motion.div
                    className="relative bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-100 p-8"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <div className="h-1 bg-gradient-to-r from-[#667eea] via-[#f093fb] to-[#43e97b] rounded-t-2xl absolute top-0 left-0 right-0"></div>

                    <div className="flex items-center justify-start mb-8">
                        <div className="flex items-center space-x-4">
                            <div className="w-8 h-8 bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white rounded-full flex items-center justify-center text-sm font-medium">
                                ✓
                            </div>
                            <div className="w-16 h-px bg-gradient-to-r from-[#667eea]/30 to-[#764ba2]/30"></div>
                            <div className="w-8 h-8 bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white rounded-full flex items-center justify-center text-sm font-medium">
                                ✓
                            </div>
                            <div className="w-16 h-px bg-gray-300"></div>
                            <div className="w-8 h-8 bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white rounded-full flex items-center justify-center text-sm font-medium">
                                3
                            </div>
                        </div>
                    </div>

                    <h1 className="text-2xl font-bold text-gray-800 mb-2">
                        Define Your Hiring Preferences!
                    </h1>
                    <p className="text-gray-600 mb-6">
                        Tell us what roles you're hiring for and where!
                    </p>

                    <form className="space-y-5">
                        <div ref={jobRolesRef}>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Job Roles You Hire For
                            </label>
                            
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
                                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#667eea]/30 focus:border-[#667eea] cursor-pointer flex justify-between items-center transition-all duration-300 bg-white/80 ${
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
                                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
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

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Preferred Hiring Locations
                            </label>
                            <CreatableSelect
                                isMulti
                                options={locationOptions}
                                value={selectedLocationsValue}
                                onChange={handleLocationChange}
                                placeholder="Select or type to add locations..."
                                styles={{
                                    control: (base) => ({
                                        ...base,
                                        borderColor: errors.hiringLocations ? '#ef4444' : '#d1d5db',
                                        minHeight: '42px',
                                        borderRadius: '0.5rem',
                                        backgroundColor: 'rgba(255, 255, 255, 0.8)',
                                        padding: '2px',
                                        boxShadow: 'none',
                                        '&:hover': {
                                            borderColor: '#9ca3af'
                                        },
                                        '&:focus-within': {
                                            borderColor: '#667eea',
                                            boxShadow: '0 0 0 2px rgba(102, 126, 234, 0.3)'
                                        }
                                    }),
                                    menu: (base) => ({
                                        ...base,
                                        borderRadius: '0.5rem',
                                        border: '1px solid #e5e7eb',
                                        zIndex: 50
                                    }),
                                    option: (base, state) => ({
                                        ...base,
                                        backgroundColor: state.isSelected ? '#e5e7eb' : state.isFocused ? '#f3f4f6' : 'white',
                                        color: '#374151',
                                        cursor: 'pointer',
                                        '&:active': {
                                            backgroundColor: '#e5e7eb'
                                        }
                                    }),
                                    multiValue: (base) => ({
                                        ...base,
                                        backgroundColor: '#e5e7eb',
                                        borderRadius: '9999px',
                                    }),
                                    multiValueRemove: (base) => ({
                                        ...base,
                                        borderRadius: '0 9999px 9999px 0',
                                        color: '#374151',
                                        ':hover': {
                                            backgroundColor: '#d1d5db',
                                            color: 'black',
                                        },
                                    }),
                                }}
                            />
                            {errors.hiringLocations && (
                                <p className="mt-1 text-sm text-red-600">{errors.hiringLocations}</p>
                            )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-3">
                            Looking for
                          </label>

                          <div className="flex space-x-2">
                            {[
                              { label: 'Job', value: 'job' },
                              { label: 'Internship', value: 'internship' },
                              { label: 'Both (Job + Internship)', value: 'both' },
                            ].map((option) => (
                              <button
                                key={option.value}
                                type="button"
                                onClick={() => handleLookingForChange(option.value)}
                                className={`px-4 py-2 rounded-lg border transition-all duration-300 ${
                                  isLookingForActive(option.value)
                                    ? 'bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white border-transparent'
                                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                                }`}
                              >
                                {option.label}
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
                                {[
                                    { label: 'Part-time', value: 'Part-time' },
                                      { label: 'Full-time', value: 'Full-time' },
                                      { label: 'Contract', value: 'Contract' },
                                    ].map((option) => (
                                    <button
                                        key={option.value}
                                        type="button"
                                        onClick={() => handleEmploymentTypeChange(option.value)}
                                        className={`px-4 py-2 rounded-lg border transition-all duration-300 ${
                                            formData.employmentType?.includes(option.value)
                                                ? 'bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white border-transparent'
                                                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                                        }`}
                                    >
                                        {option.label}
                                    </button>
                                ))}
                            </div>
                            {errors.employmentType && (
                                <p className="mt-1 text-sm text-red-600">{errors.employmentType}</p>
                            )}
                        </div>

                        <div className="flex justify-between mt-8">
                            <button
                                type="button"
                                onClick={onBack}
                                className="px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-all duration-300"
                            >
                                Back
                            </button>
                            <button
                                type="button"
                                onClick={handleNextClick}
                                className="px-6 py-3 bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white rounded-lg font-semibold hover:shadow-lg hover:scale-[1.02] transition-all duration-300 shadow-md"
                            >
                                Next
                            </button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </div>
    );
};

export default DefineHiringPreferences;