import React, { useState, useEffect, useRef, useMemo } from "react";
import { ChevronDownIcon, X } from "lucide-react";
import { ProgressIndicator } from "../ProgressIndicator";
import { City } from "country-state-city";
import CreatableSelect from 'react-select/creatable';

const jobRoleOptions = [
  "Software Developer",
  "UI/UX Designer",
  "Project Manager",
  "Data Analyst",
  "Marketing Specialist",
  "DevOps Engineer",
  "Product Manager",
  "QA Engineer",
  "System Administrator",
  "Network Engineer",
  "Business Analyst",
  "Machine Learning Engineer",
];
const employmentTypeOptions = ["part time", "full time", "contract"];

const SelectedTag = ({ item, onRemove }) => (
  <div className="flex items-center bg-gray-200 text-sm px-3 py-1 rounded-full text-black">
    <span>{item}</span>
    <button
      type="button"
      onClick={onRemove}
      className="ml-2 text-gray-600 hover:text-black"
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

  // --- Handlers for Job Roles (Legacy Custom Dropdown) ---
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
    let newValue;
    if (option === 'Both') {
      newValue = ['Internship', 'Job'];
    } else {
      newValue = option; // 'Job' or 'Internship'
    }
    setLocalFormData(prev => ({ ...prev, lookingFor: newValue }));
  };

  const isLookingForActive = (option) => {
    const val = localFormData.lookingFor;
    
    if (val === option) return true;

    if (Array.isArray(val)) {
        if (option === 'Both') {
            return val.includes('Job') && val.includes('Internship');
        }
        // If state is array but checking single option (rare edge case with this UI logic, but safe to have)
        return val.includes(option) && val.length === 1;
    }
    return false;
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
    <div className="justify-center items-stretch bg-white z-0 flex min-w-60 flex-col w-[560px] my-auto p-12 max-md:max-w-full max-md:px-5">
      <ProgressIndicator currentStep={4} totalSteps={6} />

      <div className="flex w-full flex-col items-stretch justify-center mt-8 max-md:max-w-full">
        <div className="w-full text-black max-md:max-w-full">
          <h2 className="text-[32px] font-bold leading-[42px] max-md:max-w-full">
            Awesome! Let's define your career goals and skills!
          </h2>
          <p className="text-base font-normal leading-6 mt-2 max-md:max-w-full">
            Let us know your job interests and preferred locations so we can
            recommend the best opportunities for you.
          </p>
        </div>

        <form className="w-full text-base font-normal mt-8 max-md:max-w-full">
          <div className="w-full max-md:max-w-full">
            <label htmlFor="industry" className="block text-black">
              Interested Industry Type
            </label>
            <div className="relative">
              <select
                id="industry"
                name="industry"
                value={localFormData.industry}
                onChange={handleStandardChange}
                className="items-center appearance-none flex min-h-12 w-full gap-2 text-[#666] mt-2 p-3 border border-gray-300 rounded"
              >
                <option value="" disabled>
                  Select Industry
                </option>
                <option value="Technology">Technology</option>
                <option value="Finance">Finance</option>
                <option value="Healthcare">Healthcare</option>
                <option value="Education">Education</option>
                <option value="Manufacturing">Manufacturing</option>
              </select>
              <ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-6 h-6 pointer-events-none" />
            </div>
          </div>

          <div
            ref={jobRolesRef}
            className="w-full mt-6 max-md:max-w-full relative"
          >
            <label htmlFor="jobRoles" className="block text-black">
              Interested Job Roles
            </label>

            <div className="flex flex-wrap gap-2 mt-2 mb-2">
              {localFormData.jobRoles.map((role) => (
                <SelectedTag
                  key={role}
                  item={role}
                  onRemove={() => removeSelectedItem("jobRoles", role)}
                />
              ))}
            </div>

            <div
              className="flex items-center justify-between p-3 w-full border border-gray-300 rounded-md cursor-pointer hover:border-gray-400 min-h-12"
              onClick={() => toggleDropdown("jobRoles")}
            >
              <span
                className={
                  localFormData.jobRoles.length > 0
                    ? "text-black"
                    : "text-[#666]"
                }
              >
                {localFormData.jobRoles.length > 0
                  ? `Selected ${localFormData.jobRoles.length} role(s)`
                  : "Select one or more job roles"}
              </span>
              <ChevronDownIcon
                className={`w-6 h-6 transition-transform ${
                  dropdownOpen.jobRoles ? "rotate-180" : ""
                }`}
              />
            </div>

            {dropdownOpen.jobRoles && (
              <div className="absolute z-20 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                {jobRoleOptions.map((role) => (
                  <div
                    key={role}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMultiSelect("jobRoles", role);
                    }}
                    className={`px-4 py-2 hover:bg-gray-100 cursor-pointer ${
                      localFormData.jobRoles.includes(role)
                        ? "bg-gray-100 font-medium"
                        : ""
                    }`}
                  >
                    {role}
                    {localFormData.jobRoles.includes(role) && (
                      <span className="float-right text-gray-500">✓</span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="w-full mt-6 max-md:max-w-full">
            <label htmlFor="locations" className="block text-black mb-2">
              Preferred Job Locations
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
                        borderColor: '#d1d5db', // gray-300
                        minHeight: '48px', // Matches the min-h-12 (48px) of other inputs
                        borderRadius: '0.375rem', // rounded-md
                        backgroundColor: 'white',
                        padding: '2px',
                        boxShadow: 'none',
                        '&:hover': {
                            borderColor: '#9ca3af' // gray-400
                        },
                        '&:focus-within': {
                            borderColor: '#000', // black focus
                            boxShadow: '0 0 0 1px #000'
                        }
                    }),
                    menu: (base) => ({
                        ...base,
                        borderRadius: '0.375rem',
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
                        backgroundColor: '#e5e7eb', // gray-200
                        borderRadius: '9999px', // rounded-full
                    }),
                    multiValueRemove: (base) => ({
                        ...base,
                        borderRadius: '0 9999px 9999px 0',
                        color: '#4b5563', // gray-600
                        ':hover': {
                            backgroundColor: '#d1d5db',
                            color: 'black',
                        },
                    }),
                }}
            />
          </div>

          <div className="w-full mt-6 max-md:max-w-full">
            <label className="block text-black">Looking for</label>
            <div className="flex gap-4 mt-2 flex-wrap">
              {["Job", "Internship", "Both"].map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => handleLookingForClick(option)}
                  className={`px-4 py-2 border rounded-md ${
                    isLookingForActive(option)
                      ? "bg-black text-white"
                      : "text-black hover:bg-gray-50"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          <div className="w-full mt-6 max-md:max-w-full">
            <label className="block text-black">Employment Type</label>
            <div className="flex gap-4 mt-2 flex-wrap">
              {employmentTypeOptions.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => handleMultiSelect("employmentType", type)}
                  className={`px-4 py-2 border rounded-md capitalize ${
                    localFormData.employmentType.includes(type)
                      ? "bg-black text-white"
                      : "text-black hover:bg-gray-50"
                  }`}
                >
                  {type.replace("-", " ")}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-4 mt-6">
            <button
              type="button"
              onClick={onBack}
              className="px-6 py-3 border rounded-md text-black hover:bg-gray-50"
            >
              Back
            </button>
            <button
              type="button"
              onClick={handleNextClick}
              className="px-6 py-3 border rounded-md bg-black text-white hover:bg-gray-800"
            >
              Next
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};