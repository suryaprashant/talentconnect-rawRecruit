/*import React, { useState, useEffect } from "react";
import CreatableSelect from "react-select/creatable";
import { UploadIcon } from "lucide-react";
import { ProgressIndicator } from "../ProgressIndicator";
import colleges from "../../../assets/colleges.json";

const degreeOptions = [
  { value: "bachelors", label: "Bachelor's" },
  { value: "masters", label: "Master's" },
  { value: "phd", label: "PhD" },
];

const normalizeString = (str) =>
  str?.toLowerCase().replace(/[^\w\s]/g, "").replace(/\s+/g, " ").trim() || "";

export const StepThree = ({
  onNext,
  onCancel,
  onBack = onCancel,
  formData,
  onChange,
}) => {
 
  const [localFormData, setLocalFormData] = useState({
    college: formData.education[0]?.college || "",
    degree: formData.education[0]?.degree || "",
    semester: formData.education[0]?.semester || "",
    yearOfGraduation: formData.education[0]?.yearOfGraduation || "", // ADDED
    specialization: formData.education[0]?.specialization || "",
    cgpa: formData.education[0]?.cgpa || "",
    degreeCertificate: formData.education[0]?.degreeCertificate || null,
  });

  const [collegeSuggestions, setCollegeSuggestions] = useState([]);

  // --- ADDED: Logic to generate a list of years for the dropdown ---
  const generateYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const startYear = currentYear + 5; // Allow selecting a few years in the future
    const endYear = currentYear - 70; // Go back 70 years
    const years = [];
    for (let year = startYear; year >= endYear; year--) {
      years.push(year);
    }
    return years;
  };
  const yearOptions = generateYearOptions();
  // --- END OF ADDED SECTION ---

  // Get the role from localStorage for conditional rendering
  const selectedRole = localStorage.getItem('selectedRole');
  
  // Auto-suggest parsed values
  useEffect(() => {
    const parsedCollege = formData.education[0]?.college;
    const parsedDegree = formData.education[0]?.degree;

    let updates = {};

    if (
      parsedCollege &&
      parsedCollege !== "Placeholder" &&
      parsedCollege !== "Multiple-select"
    ) {
      const normalizedParsed = normalizeString(parsedCollege);
      const suggestions = colleges
        .map((c) => (typeof c === "string" ? c : c["College Name"] || ""))
        .filter((name) => normalizeString(name).includes(normalizedParsed))
        .slice(0, 10);

      setCollegeSuggestions(suggestions);

      if (suggestions.length > 0) {
        updates.college = suggestions[0];
      }
    }

    if (parsedDegree && parsedDegree !== "Placeholder") {
      updates.degree = parsedDegree;
    }

    if (Object.keys(updates).length > 0) {
      setLocalFormData((prev) => ({ ...prev, ...updates }));
    }
  }, [formData.education]);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setLocalFormData((prev) => ({
        ...prev,
        degreeCertificate: e.target.files[0],
      }));
    }
  };

  // --- MODIFIED: Added yearOfGraduation to the form data update ---
  const handleNextClick = () => {
    // Structure the education data as an array with one entry (as implied by localFormData structure)
    const updatedFormData = {
      ...formData,
      
          college: localFormData.college || "",
          degree: localFormData.degree || "",
         
          semester: selectedRole === 'student' ? localFormData.semester : undefined, 
          yearOfGraduation: localFormData.yearOfGraduation, 
          specialization: localFormData.specialization,
          cgpa: localFormData.cgpa,
          degreeCertificate: localFormData.degreeCertificate,
        
      
    };
    onChange(updatedFormData);
    onNext();
  };

  // Helper component for the Graduation Year Select
  const GraduationYearSelect = ({ flexClass = "flex-1" }) => (
    <div className={flexClass}>
      <label htmlFor="yearOfGraduation" className="block text-black">
        {selectedRole === 'student' ? 'Expected Graduation Year' : 'Graduation Year'}
      </label>
      <select
        id="yearOfGraduation"
        name="yearOfGraduation"
        value={localFormData.yearOfGraduation}
        onChange={(e) =>
          setLocalFormData((prev) => ({
            ...prev,
            yearOfGraduation: e.target.value,
          }))
        }
        className="appearance-none bg-white flex min-h-12 w-full mt-2 p-3 border border-gray-300 rounded"
      >
        <option value="" disabled>Select Year</option>
        {yearOptions.map(year => (
          <option key={year} value={year}>{year}</option>
        ))}
      </select>
    </div>
  );

  return (
    <div className="justify-center items-stretch bg-white z-0 flex min-w-60 flex-col w-[560px] my-auto p-12 max-md:max-w-full max-md:px-5">
      <ProgressIndicator currentStep={3} totalSteps={6} />
      <div className="flex w-full flex-col items-stretch justify-center mt-8 max-md:max-w-full">
        <div className="w-full text-black max-md:max-w-full">
          <h2 className="text-[32px] font-bold leading-[42px] max-md:max-w-full">
            Let's add your educational background!
          </h2>
          <p className="text-base font-normal leading-6 mt-2 max-md:max-w-full">
            Provide your academic background to match with relevant job and internship opportunities.
          </p>
        </div>

        <form className="w-full text-base font-normal mt-8 max-md:max-w-full">
          {/* College 
          <div className="w-full">
            <label htmlFor="college" className="block text-black">
              College/University
            </label>
            {collegeSuggestions.includes(localFormData.college) ? (
              <CreatableSelect
                isClearable
                placeholder="Select or type your college"
                options={collegeSuggestions.map((name) => ({
                  value: name,
                  label: name,
                }))}
                value={
                  localFormData.college
                    ? { value: localFormData.college, label: localFormData.college }
                    : null
                }
                onChange={(selected) =>
                  setLocalFormData((prev) => ({
                    ...prev,
                    college: selected ? selected.value : "",
                  }))
                }
                className="mt-2"
              />
            ) : (
              <input
                type="text"
                value={localFormData.college}
                onChange={(e) =>
                  setLocalFormData((prev) => ({ ...prev, college: e.target.value }))
                }
                className="min-h-12 w-full mt-2 p-3 border border-gray-300 rounded"
                placeholder="Enter your college name"
              />
            )}
          </div>

          
          {selectedRole === 'student' ? (
            // Student Layout: Degree & Semester side-by-side, Graduation Year on a new line
            <>
              <div className="flex w-full gap-6 mt-6">
                {/* Degree 
                <div className="flex-1">
                  <label htmlFor="degree" className="block text-black">
                    Degree
                  </label>
                  <CreatableSelect
                    isClearable
                    placeholder="Select or type your degree"
                    options={degreeOptions}
                    value={
                      localFormData.degree
                        ? {
                            value: localFormData.degree,
                            label: localFormData.degree,
                          }
                        : null
                    }
                    onChange={(selected) =>
                      setLocalFormData((prev) => ({
                        ...prev,
                        degree: selected ? selected.value : "",
                      }))
                    }
                    className="mt-2"
                  />
                </div>

                {/* Current Semester
                <div className="flex-1">
                  <label htmlFor="semester" className="block text-black">
                    Current Semester
                  </label>
                  <select
                    id="semester"
                    name="semester"
                    value={localFormData.semester}
                    onChange={(e) =>
                      setLocalFormData((prev) => ({
                        ...prev,
                        semester: e.target.value,
                      }))
                    }
                    className="appearance-none bg-white flex min-h-12 w-full mt-2 p-3 border border-gray-300 rounded"
                  >
                    <option value="" disabled>
                      Select semester
                    </option>
                    {[...Array(8)].map((_, i) => (
                      <option key={i + 1} value={i + 1}>
                        Semester {i + 1}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              {/* Expected Graduation Year (Full Width, New Row) 
              <div className="flex w-full mt-6">
                <GraduationYearSelect flexClass="w-full" />
              </div>
            </>
          ) : (
            // Non-Student Layout: Degree & Graduation Year side-by-side
            <div className="flex w-full gap-6 mt-6">
              {/* Degree 
              <div className="flex-1">
                <label htmlFor="degree" className="block text-black">
                  Degree
                </label>
                <CreatableSelect
                  isClearable
                  placeholder="Select or type your degree"
                  options={degreeOptions}
                  value={
                    localFormData.degree
                      ? {
                          value: localFormData.degree,
                          label: localFormData.degree,
                        }
                      : null
                  }
                  onChange={(selected) =>
                    setLocalFormData((prev) => ({
                      ...prev,
                      degree: selected ? selected.value : "",
                    }))
                  }
                  className="mt-2"
                />
              </div>
              
              {/* Graduation Year 
              <GraduationYearSelect flexClass="flex-1" />
            </div>
          )}

          {/* Specialization 
          <div className="w-full mt-6">
            <label htmlFor="specialization" className="block text-black">
              Field of Study / Specialization
            </label>
            <input
              id="specialization"
              name="specialization"
              value={
                localFormData.specialization &&
                localFormData.specialization !== "Not Found"
                  ? localFormData.specialization
                  : ""
              }
              onChange={(e) =>
                setLocalFormData((prev) => ({
                  ...prev,
                  specialization: e.target.value,
                }))
              }
              className="min-h-12 w-full mt-2 p-3 border border-gray-300 rounded"
              placeholder={
                localFormData.specialization === "Not Found"
                  ? "Not Found"
                  : "Enter your specialization"
              }
            />
          </div>

          {/* CGPA 
          <div className="w-full mt-6">
            <label htmlFor="cgpa" className="block text-black">
              Current CGPA/Percentage
            </label>
            <input
              id="cgpa"
              name="cgpa"
              type="text"
              value={localFormData.cgpa && localFormData.cgpa !== "Not Found" ? localFormData.cgpa : ""}
              onChange={(e) =>
                setLocalFormData((prev) => ({
                  ...prev,
                  cgpa: e.target.value,
                }))
              }
              className="min-h-12 w-full mt-2 p-3 border border-gray-300 rounded"
              placeholder={localFormData.cgpa === "Not Found" ? "Not Found" : "Enter your CGPA or percentage"}
            />
          </div>

          {/* Degree Certificate 
          <div className="w-full mt-6">
            <label htmlFor="degreeCertificate" className="block text-black">
              Degree Certificate (Optional)
            </label>
            <label className="flex items-center min-h-12 w-full gap-2 text-[#666] mt-2 p-3 border border-gray-300 rounded cursor-pointer hover:bg-gray-50">
              <span className="flex-grow">
                {localFormData.degreeCertificate
                  ? localFormData.degreeCertificate.name
                  : "Upload Degree Certificate"}
              </span>
              <UploadIcon className="w-6 h-6" />
              <input
                id="degreeCertificate"
                name="degreeCertificate"
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                className="hidden"
                onChange={handleFileChange}
              />
            </label>
          </div>

          {/* Buttons 
          <div className="flex gap-4 mt-6">
            <button
              type="button"
              onClick={onBack}
              className="px-6 py-3 border rounded-md hover:bg-gray-50"
            >
              Back
            </button>
            <button
              type="button"
              onClick={handleNextClick}
              className="bg-black text-white px-6 py-3 border rounded-md hover:bg-gray-800"
            >
              Next
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};*/

import React, { useState, useEffect } from "react";
import CreatableSelect from "react-select/creatable";
import { UploadIcon, GraduationCap } from "lucide-react";

const degreeOptions = [
  { value: "bachelors", label: "Bachelor's" },
  { value: "masters", label: "Master's" },
  { value: "phd", label: "PhD" },
];

const normalizeString = (str) =>
  str?.toLowerCase().replace(/[^\w\s]/g, "").replace(/\s+/g, " ").trim() || "";

export const StepThree = ({
  onNext,
  onCancel,
  onBack = onCancel,
  formData,
  onChange,
}) => {
  // Initialize from formData.education[0] OR from top-level fields for backward compatibility
  const [localFormData, setLocalFormData] = useState({
    college: formData.education?.[0]?.college || formData.college || "",
    degree: formData.education?.[0]?.degree || formData.degree || "",
    semester: formData.education?.[0]?.semester || formData.semester || "",
    yearOfGraduation: formData.education?.[0]?.yearOfGraduation || formData.yearOfGraduation || "",
    specialization: formData.education?.[0]?.specialization || formData.specialization || "",
    cgpa: formData.education?.[0]?.cgpa || formData.cgpa || "",
    degreeCertificate: formData.education?.[0]?.degreeCertificate || formData.degreeCertificate || null,
  });

  const [collegeSuggestions, setCollegeSuggestions] = useState([]);

  const generateYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const startYear = currentYear + 5;
    const endYear = currentYear - 70;
    const years = [];
    for (let year = startYear; year >= endYear; year--) {
      years.push(year);
    }
    return years;
  };
  const yearOptions = generateYearOptions();

  // Get the role from sessionStorage
  const selectedRole = sessionStorage.getItem('candidateOnboardingSelectedRole');
  
  // Auto-suggest parsed values
  useEffect(() => {
    const parsedCollege = formData.education?.[0]?.college || formData.college;
    const parsedDegree = formData.education?.[0]?.degree || formData.degree;

    let updates = {};

    if (
      parsedCollege &&
      parsedCollege !== "Placeholder" &&
      parsedCollege !== "Multiple-select"
    ) {
      const normalizedParsed = normalizeString(parsedCollege);
      const suggestions = colleges
        .map((c) => (typeof c === "string" ? c : c["College Name"] || ""))
        .filter((name) => normalizeString(name).includes(normalizedParsed))
        .slice(0, 10);

      setCollegeSuggestions(suggestions);

      if (suggestions.length > 0) {
        updates.college = suggestions[0];
      }
    }

    if (parsedDegree && parsedDegree !== "Placeholder") {
      updates.degree = parsedDegree;
    }

    if (Object.keys(updates).length > 0) {
      setLocalFormData((prev) => ({ ...prev, ...updates }));
    }
  }, [formData.education, formData.college, formData.degree]);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setLocalFormData((prev) => ({
        ...prev,
        degreeCertificate: e.target.files[0],
      }));
    }
  };

  // Save to BOTH education array AND top-level for compatibility
  const handleNextClick = () => {
    const educationData = {
      college: localFormData.college || "",
      degree: localFormData.degree || "",
      semester: selectedRole === 'student' ? localFormData.semester : undefined,
      yearOfGraduation: localFormData.yearOfGraduation,
      specialization: localFormData.specialization,
      cgpa: localFormData.cgpa,
      degreeCertificate: localFormData.degreeCertificate,
    };

    const updatedFormData = {
      ...formData,
      // Save in education array (proper structure)
      education: [educationData],
      // Also save at top level for any components that might expect it there
      college: localFormData.college || "",
      degree: localFormData.degree || "",
      semester: selectedRole === 'student' ? localFormData.semester : undefined,
      yearOfGraduation: localFormData.yearOfGraduation,
      specialization: localFormData.specialization,
      cgpa: localFormData.cgpa,
      degreeCertificate: localFormData.degreeCertificate,
    };
    
    onChange(updatedFormData);
    onNext();
  };

  // Helper component for the Graduation Year Select
  const GraduationYearSelect = ({ flexClass = "flex-1" }) => (
    <div className={flexClass}>
      <label htmlFor="yearOfGraduation" className="block text-gray-700 font-medium text-sm mb-2">
        {selectedRole === 'student' ? 'Expected Graduation Year' : 'Graduation Year'}
      </label>
      <div className="relative">
        <select
          id="yearOfGraduation"
          name="yearOfGraduation"
          value={localFormData.yearOfGraduation}
          onChange={(e) =>
            setLocalFormData((prev) => ({
              ...prev,
              yearOfGraduation: e.target.value,
            }))
          }
          className="appearance-none w-full p-4 bg-transparent border border-gray-300 rounded-xl focus:outline-none focus:border-[#667eea] focus:shadow-[0_0_0_3px_rgba(102,126,234,0.1)] text-gray-700 pr-10"
        >
          <option value="" disabled>Select Year</option>
          {yearOptions.map(year => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
        <svg className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  );

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
              <GraduationCap className="w-10 h-10 text-[#667eea]" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent mb-2">
              Educational Background
            </h1>
            <p className="text-gray-600 mb-4">
              Provide your academic background to match with relevant job and internship opportunities.
            </p>
          </div>

          {/* Wider Form Section */}
          <div className="space-y-6">
            {/* College/University Field */}
            <div>
              <label htmlFor="college" className="block text-gray-700 font-medium text-sm mb-2">
                College/University
              </label>
              {collegeSuggestions.includes(localFormData.college) ? (
                <CreatableSelect
                  isClearable
                  placeholder="Select or type your college"
                  options={collegeSuggestions.map((name) => ({
                    value: name,
                    label: name,
                  }))}
                  value={
                    localFormData.college
                      ? { value: localFormData.college, label: localFormData.college }
                      : null
                  }
                  onChange={(selected) =>
                    setLocalFormData((prev) => ({
                      ...prev,
                      college: selected ? selected.value : "",
                    }))
                  }
                  className="mt-2"
                  styles={{
                    control: (base) => ({
                      ...base,
                      minHeight: '56px',
                      borderColor: '#d1d5db',
                      borderRadius: '12px',
                      '&:hover': {
                        borderColor: '#667eea'
                      }
                    }),
                    placeholder: (base) => ({
                      ...base,
                      color: '#9ca3af'
                    }),
                    menu: (base) => ({
                      ...base,
                      borderRadius: '12px',
                      overflow: 'hidden'
                    }),
                    option: (base, state) => ({
                      ...base,
                      backgroundColor: state.isFocused ? '#667eea10' : 'transparent',
                      color: state.isFocused ? '#5b21b6' : '#374151',
                      '&:hover': {
                        backgroundColor: '#667eea10'
                      }
                    })
                  }}
                />
              ) : (
                <div className="relative">
                  <input
                    type="text"
                    value={localFormData.college}
                    onChange={(e) =>
                      setLocalFormData((prev) => ({ ...prev, college: e.target.value }))
                    }
                    className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:border-[#667eea] focus:shadow-[0_0_0_3px_rgba(102,126,234,0.1)] text-gray-700 placeholder-gray-400"
                    placeholder="Enter your college name"
                  />
                </div>
              )}
            </div>

            {selectedRole === 'student' ? (
              // Student Layout: Degree & Semester side-by-side, Graduation Year on a new line
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Degree */}
                  <div>
                    <label htmlFor="degree" className="block text-gray-700 font-medium text-sm mb-2">
                      Degree
                    </label>
                    <CreatableSelect
                      isClearable
                      placeholder="Select or type your degree"
                      options={degreeOptions}
                      value={
                        localFormData.degree
                          ? {
                              value: localFormData.degree,
                              label: localFormData.degree,
                            }
                          : null
                      }
                      onChange={(selected) =>
                        setLocalFormData((prev) => ({
                          ...prev,
                          degree: selected ? selected.value : "",
                        }))
                      }
                      className="mt-2"
                      styles={{
                        control: (base) => ({
                          ...base,
                          minHeight: '56px',
                          borderColor: '#d1d5db',
                          borderRadius: '12px',
                          '&:hover': {
                            borderColor: '#667eea'
                          }
                        }),
                        placeholder: (base) => ({
                          ...base,
                          color: '#9ca3af'
                        }),
                        menu: (base) => ({
                          ...base,
                          borderRadius: '12px',
                          overflow: 'hidden'
                        }),
                        option: (base, state) => ({
                          ...base,
                          backgroundColor: state.isFocused ? '#667eea10' : 'transparent',
                          color: state.isFocused ? '#5b21b6' : '#374151',
                          '&:hover': {
                            backgroundColor: '#667eea10'
                          }
                        })
                      }}
                    />
                  </div>

                  {/* Current Semester */}
                  <div>
                    <label htmlFor="semester" className="block text-gray-700 font-medium text-sm mb-2">
                      Current Semester
                    </label>
                    <div className="relative">
                      <select
                        id="semester"
                        name="semester"
                        value={localFormData.semester}
                        onChange={(e) =>
                          setLocalFormData((prev) => ({
                            ...prev,
                            semester: e.target.value,
                          }))
                        }
                        className="appearance-none w-full p-4 bg-transparent border border-gray-300 rounded-xl focus:outline-none focus:border-[#667eea] focus:shadow-[0_0_0_3px_rgba(102,126,234,0.1)] text-gray-700 pr-10"
                      >
                        <option value="" disabled>Select semester</option>
                        {[...Array(8)].map((_, i) => (
                          <option key={i + 1} value={i + 1}>
                            Semester {i + 1}
                          </option>
                        ))}
                      </select>
                      <svg className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>
                
                {/* Expected Graduation Year (Full Width, New Row) */}
                <div>
                  <GraduationYearSelect flexClass="w-full" />
                </div>
              </>
            ) : (
              // Non-Student Layout: Degree & Graduation Year side-by-side
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Degree */}
                <div>
                  <label htmlFor="degree" className="block text-gray-700 font-medium text-sm mb-2">
                    Degree
                  </label>
                  <CreatableSelect
                    isClearable
                    placeholder="Select or type your degree"
                    options={degreeOptions}
                    value={
                      localFormData.degree
                        ? {
                            value: localFormData.degree,
                            label: localFormData.degree,
                          }
                        : null
                    }
                    onChange={(selected) =>
                      setLocalFormData((prev) => ({
                        ...prev,
                        degree: selected ? selected.value : "",
                      }))
                    }
                    className="mt-2"
                    styles={{
                      control: (base) => ({
                        ...base,
                        minHeight: '56px',
                        borderColor: '#d1d5db',
                        borderRadius: '12px',
                        '&:hover': {
                          borderColor: '#667eea'
                        }
                      }),
                      placeholder: (base) => ({
                        ...base,
                        color: '#9ca3af'
                      }),
                      menu: (base) => ({
                        ...base,
                        borderRadius: '12px',
                        overflow: 'hidden'
                      }),
                      option: (base, state) => ({
                        ...base,
                        backgroundColor: state.isFocused ? '#667eea10' : 'transparent',
                        color: state.isFocused ? '#5b21b6' : '#374151',
                        '&:hover': {
                          backgroundColor: '#667eea10'
                        }
                      })
                    }}
                  />
                </div>
                
                {/* Graduation Year */}
                <GraduationYearSelect flexClass="w-full" />
              </div>
            )}

            {/* Field of Study / Specialization */}
            <div>
              <label htmlFor="specialization" className="block text-gray-700 font-medium text-sm mb-2">
                Field of Study / Specialization
              </label>
              <input
                id="specialization"
                name="specialization"
                value={
                  localFormData.specialization &&
                  localFormData.specialization !== "Not Found"
                    ? localFormData.specialization
                    : ""
                }
                onChange={(e) =>
                  setLocalFormData((prev) => ({
                    ...prev,
                    specialization: e.target.value,
                  }))
                }
                className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:border-[#667eea] focus:shadow-[0_0_0_3px_rgba(102,126,234,0.1)] text-gray-700 placeholder-gray-400"
                placeholder={
                  localFormData.specialization === "Not Found"
                    ? "Not Found"
                    : "Enter your specialization"
                }
              />
            </div>

            {/* CGPA/Percentage */}
            <div>
              <label htmlFor="cgpa" className="block text-gray-700 font-medium text-sm mb-2">
                Current CGPA/Percentage
              </label>
              <input
                id="cgpa"
                name="cgpa"
                type="text"
                value={localFormData.cgpa && localFormData.cgpa !== "Not Found" ? localFormData.cgpa : ""}
                onChange={(e) =>
                  setLocalFormData((prev) => ({
                    ...prev,
                    cgpa: e.target.value,
                  }))
                }
                className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:border-[#667eea] focus:shadow-[0_0_0_3px_rgba(102,126,234,0.1)] text-gray-700 placeholder-gray-400"
                placeholder={localFormData.cgpa === "Not Found" ? "Not Found" : "Enter your CGPA or percentage"}
              />
            </div>

            {/* Degree Certificate Upload */}
            <div>
              <label htmlFor="degreeCertificate" className="block text-gray-700 font-medium text-sm mb-2">
                Degree Certificate (Optional)
              </label>
              <label className="flex items-center w-full p-4 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-[#667eea] hover:bg-[#667eea]/5 transition-all duration-200">
                <div className="flex items-center flex-grow">
                  <UploadIcon className="w-5 h-5 text-gray-400 mr-3" />
                  <span className="text-gray-600">
                    {localFormData.degreeCertificate
                      ? localFormData.degreeCertificate.name
                      : "Click to upload certificate (PDF, JPG, PNG)"}
                  </span>
                </div>
                <input
                  id="degreeCertificate"
                  name="degreeCertificate"
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </label>
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