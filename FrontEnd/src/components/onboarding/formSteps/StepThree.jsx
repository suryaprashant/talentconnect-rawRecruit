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
  // --- MODIFIED: Added yearOfGraduation to state ---
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

  // Get the role from sessionStorage (changed from localStorage)
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

  // FIXED: Save to BOTH education array AND top-level for compatibility
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
          {/* College */}
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
                {/* Degree */}
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

                {/* Current Semester */}
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
              
              {/* Expected Graduation Year (Full Width, New Row) */}
              <div className="flex w-full mt-6">
                <GraduationYearSelect flexClass="w-full" />
              </div>
            </>
          ) : (
            // Non-Student Layout: Degree & Graduation Year side-by-side
            <div className="flex w-full gap-6 mt-6">
              {/* Degree */}
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
              
              {/* Graduation Year */}
              <GraduationYearSelect flexClass="flex-1" />
            </div>
          )}

          {/* Specialization */}
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

          {/* CGPA */}
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

          {/* Degree Certificate */}
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

          {/* Buttons */}
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
};