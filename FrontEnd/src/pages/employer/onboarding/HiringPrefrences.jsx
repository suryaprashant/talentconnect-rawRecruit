import React, { useState, useRef, useEffect } from "react";
import { motion } from 'framer-motion';
import { City } from 'country-state-city';

const DefineHiringPreferences = ({ onBack, formData, onNext, updateFormData }) => {
    const [errors, setErrors] = useState({});
    const [showJobRolesDropdown, setShowJobRolesDropdown] = useState(false);
    const [showLocationsDropdown, setShowLocationsDropdown] = useState(false);
    const jobRolesRef = useRef(null);
    const locationsRef = useRef(null);
    
    const [indianCities, setIndianCities] = useState([]);
    const [locationSearch, setLocationSearch] = useState('');

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
            newTypes = currentTypes.filter(type => type !== value);
        } else {
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
        setLocationSearch(''); 
    };

    const handleJobRoleSelect = (roleValue) => {
        const currentRoles = formData.jobRoles || [];
        const newRoles = currentRoles.includes(roleValue)
            ? currentRoles.filter(r => r !== roleValue)
            : [...currentRoles, roleValue];
        updateFormData({ jobRoles: newRoles });
    };

    const handleLocationSelect = (locationName) => {
        const currentLocations = formData.hiringLocations || [];
        const newLocations = currentLocations.includes(locationName)
            ? currentLocations.filter(l => l !== locationName)
            : [...currentLocations, locationName];
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

    useEffect(() => {
        const cities = City.getCitiesOfCountry('IN').map(city => ({
            value: city.name, 
            label: city.name 
        })).sort((a, b) => a.label.localeCompare(b.label));
        setIndianCities(cities);
    }, []);
    
    const filteredLocationOptions = indianCities.filter(city =>
        city.label.toLowerCase().includes(locationSearch.toLowerCase())
    );

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
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#667eea]/15 via-[#f093fb]/10 to-[#764ba2]/15 p-4">
            {/* Blur Background around card */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-[#667eea]/10 to-[#764ba2]/10 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-[#f093fb]/10 to-[#f5576c]/10 rounded-full blur-3xl"></div>
            </div>

            <div className="relative w-full max-w-2xl">
                {/* Blur background behind card */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#667eea]/5 to-[#764ba2]/5 backdrop-blur-sm rounded-2xl -inset-x-4 bottom-0"></div>
                
                <motion.div
                    className="relative bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-100 p-8"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    {/* Decorative top bar */}
                    <div className="h-1 bg-gradient-to-r from-[#667eea] via-[#f093fb] to-[#43e97b] rounded-t-2xl absolute top-0 left-0 right-0"></div>

                    {/* Progress indicator */}
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

                        {/* Locations Dropdown - Multi Select with Search */}
                        <div ref={locationsRef}>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Preferred Hiring Locations
                            </label>
                            
                            {/* Selected locations chips */}
                            <div className="flex flex-wrap gap-2 mb-2">
                                {formData.hiringLocations?.map((location, index) => {
                                    const locationLabel = filteredLocationOptions.find(opt => opt.value === location)?.label || location;
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
                                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#667eea]/30 focus:border-[#667eea] cursor-pointer flex justify-between items-center transition-all duration-300 bg-white/80 ${
                                        errors.hiringLocations ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                >
                                    <span className="text-gray-700">
                                        Select Locations (Indian Cities)
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
                                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
                                        
                                        {/* Search Input */}
                                        <div className="p-2 border-b">
                                            <input
                                                type="text"
                                                value={locationSearch}
                                                onClick={(e) => e.stopPropagation()} 
                                                onMouseDown={(e) => e.stopPropagation()}
                                                onChange={(e) => setLocationSearch(e.target.value)}
                                                placeholder="Search for a city..."
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#667eea]/30 focus:border-[#667eea] transition-all duration-300 bg-white/80"
                                            />
                                        </div>

                                        {/* Options List */}
                                        {filteredLocationOptions.length > 0 ? (
                                            filteredLocationOptions.map((option) => (
                                                <div
                                                    key={option.value}
                                                    onClick={() => handleLocationSelect(option.value)}
                                                    className={`px-4 py-2 hover:bg-gray-100 cursor-pointer ${
                                                        formData.hiringLocations?.includes(option.value) ? "bg-gray-100 font-medium" : ""
                                                    }`}
                                                >
                                                    {option.label}
                                                </div>
                                            ))
                                        ) : (
                                            <div className="px-4 py-2 text-gray-500">No cities found matching "{locationSearch}"</div>
                                        )}
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
                                        className={`px-4 py-2 rounded-lg border transition-all duration-300 ${
                                            formData.lookingFor === option
                                                ? 'bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white border-transparent'
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
                                        className={`px-4 py-2 rounded-lg border transition-all duration-300 ${
                                            formData.employmentType?.includes(option)
                                                ? 'bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white border-transparent'
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