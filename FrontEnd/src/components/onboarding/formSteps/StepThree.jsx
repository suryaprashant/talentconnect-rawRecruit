

import React, { useState, useEffect ,useMemo } from "react";
import CreatableSelect from "react-select/creatable";
import { UploadIcon, GraduationCap } from "lucide-react";
import colleges from "../../../assets/colleges.json";
import axios from 'axios';
import { getMasterDataByType, createMasterData } from "../../../lib/User_AxiosInstance";


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
const [dbColleges, setDbColleges] = useState([]);
const [isLoadingColleges, setIsLoadingColleges] = useState(false);
const [degreeOptions, setDegreeOptions] = useState([]);
const [streamOptions, setStreamOptions] = useState([]);

useEffect(() => {
  const fetchColleges = async () => {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_Backend_URL}/api/colleges/all`);
      // Ensure data is in { value, label } format
      const formatted = data.map(c => typeof c === 'string' ? { value: c, label: c } : c);
      setDbColleges(formatted);
    } catch (err) {
      console.error("Error loading colleges from DB", err);
    }
  };
  fetchColleges();
}, []);

const handleAddCollege = async (name) => {
  setIsLoadingColleges(true);
  try {
    const { data } = await axios.post(`${import.meta.env.VITE_Backend_URL}/api/colleges/register`, { name });
    // Update local state list so it appears in the dropdown
    setDbColleges(prev => [...prev, data]);
    // Set the selected value in the form
    setLocalFormData(p => ({ ...p, college: data.label }));
  } catch (err) {
    console.error("College save failed", err);
    alert("Could not register college. It might already exist.");
  } finally {
    setIsLoadingColleges(false);
  }
};
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

  const [metaData, setMetaData] = useState([]);

  useEffect(() => {
    const fetchDegrees = async () => {
      try {
        const res = await getMasterDataByType("DEGREE");

        setDegreeOptions(
          res.data.data.map((item) => ({
            value: item.value,
            label: item.value,
          }))
        );
      } catch (err) {
        console.error("Error fetching degrees", err);
      }
    };

    fetchDegrees();
  }, []);

  useEffect(() => {
    if (!localFormData.degree) {
      setStreamOptions([]);
      return;
    }
  
    const fetchStreams = async () => {
      try {
        const res = await getMasterDataByType("STREAM");
      
        const filteredStreams = res.data.data
          .filter((item) => item.parent === localFormData.degree)
          .map((item) => ({
            value: item.value,
            label: item.value,
          }));
        
        setStreamOptions(filteredStreams);
      } catch (err) {
        console.error("Error fetching streams", err);
      }
    };
  
    fetchStreams();
  }, [localFormData.degree]);

  console.log("Degree:", localFormData.degree);
  



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
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#667eea]/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 -left-20 w-60 h-60 bg-[#f093fb]/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-1/3 w-40 h-40 bg-[#764ba2]/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
        <div className="bg-white/90 backdrop-blur-sm border border-white/50 rounded-2xl shadow-lg shadow-purple-50/50 p-8 w-full max-w-2xl">
          
          <div className="text-center mb-8">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-r from-[#667eea]/20 to-[#764ba2]/20 flex items-center justify-center mx-auto mb-4">
              <GraduationCap className="w-10 h-10 text-[#667eea]" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent mb-2">
              Educational Background
            </h1>
            <p className="text-gray-600 mb-4">
              Provide your academic background to match with relevant job and internship opportunities
            </p>
          </div>

          <div className="space-y-6">
            {/* Row 1: College */}
            <div>
              <label className="block text-gray-700 font-medium text-sm mb-2">College/University</label>
              <CreatableSelect
                isClearable
                isLoading={isLoadingColleges}
                options={dbColleges}
                menuPlacement="auto"
                onCreateOption={handleAddCollege}
                onChange={(sel) => setLocalFormData(p => ({ ...p, college: sel?.label || "" }))}
                value={localFormData.college ? { value: localFormData.college, label: localFormData.college } : null}
                styles={customSelectStyles}
                placeholder="Search or add your college"
              />
            </div>

            {/* Row 2: Degree & (Semester OR Graduation Year) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div>
                <label className="block text-gray-700 font-medium text-sm mb-2">Degree</label>
                <CreatableSelect
                  isClearable
                  options={degreeOptions}
                  menuPlacement="auto"
                  styles={customSelectStyles}
                  value={localFormData.degree ? { value: localFormData.degree, label: localFormData.degree } : null}
                  onChange={(sel) => setLocalFormData(p => ({ ...p, degree: sel?.label || "", specialization: "" }))}
                  onCreateOption={async (val) => {
                    try {
                      const res = await createMasterData({ type: "DEGREE", value: val });
                      const newValue = res.data.data.value;
                      setDegreeOptions(prev => [...prev, { value: newValue, label: newValue }]);
                      setLocalFormData(p => ({ ...p, degree: newValue, specialization: "" }));
                    } catch (err) { console.error(err); }
                  }}
                  placeholder="Select degree"
                />
              </div>

              {selectedRole === 'student' ? (
                <div>
                  <label className="block text-gray-700 font-medium text-sm mb-2">Current Semester</label>
                  <div className="relative">
                    <select
                      value={localFormData.semester}
                      onChange={(e) => setLocalFormData(p => ({ ...p, semester: e.target.value }))}
                      className="appearance-none w-full p-4 bg-transparent border border-gray-300 rounded-xl focus:outline-none focus:border-[#667eea] text-gray-700 pr-10"
                    >
                      <option value="" disabled>Select semester</option>
                      {[...Array(8)].map((_, i) => (
                        <option key={i + 1} value={i + 1}>Semester {i + 1}</option>
                      ))}
                    </select>
                    <svg className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              ) : (
                <GraduationYearSelect />
              )}
            </div>

            {/* Row 3 & 4: Specialization & Graduation Year for Students */}
            <div className="mt-6">
              {selectedRole === 'student' && (
                <div className="mb-6">
                  <GraduationYearSelect flexClass="w-full" />
                </div>
              )}

              <label className="block text-gray-700 font-medium text-sm mb-2">Stream / Specialization</label>
              <CreatableSelect
                isClearable
                menuPlacement="auto"
                isDisabled={!localFormData.degree}
                options={streamOptions}
                styles={customSelectStyles}
                value={localFormData.specialization ? { value: localFormData.specialization, label: localFormData.specialization } : null}
                onChange={(sel) => setLocalFormData(p => ({ ...p, specialization: sel?.value || "" }))}
                onCreateOption={async (val) => {
                  try {
                    const res = await createMasterData({
                      type: "STREAM",
                      value: val,
                      parent: localFormData.degree,
                    });
                    const newValue = res.data.data.value;
                    setStreamOptions((prev) => [...prev, { value: newValue, label: newValue }]);
                    setLocalFormData((p) => ({ ...p, specialization: newValue }));
                  } catch (err) {
                    console.error("Error adding stream", err);
                  }
                }}
                placeholder={!localFormData.degree ? "Select a degree first" : "Search or add specialization"}
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
                onChange={(e) => setLocalFormData((prev) => ({ ...prev, cgpa: e.target.value }))}
                className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:border-[#667eea] focus:shadow-[0_0_0_3px_rgba(102,126,234,0.1)] text-gray-700 placeholder-gray-400"
                placeholder="Enter your CGPA or percentage"
              />
            </div>

            {/* Degree Certificate */}
            <div>
              <label htmlFor="degreeCertificate" className="block text-gray-700 font-medium text-sm mb-2">
                Degree Certificate (Optional)
              </label>
              <label className="flex items-center w-full p-4 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-[#667eea] hover:bg-[#667eea]/5 transition-all duration-200">
                <div className="flex items-center flex-grow">
                  <UploadIcon className="w-5 h-5 text-gray-400 mr-3" />
                  <span className="text-gray-600">
                    {localFormData.degreeCertificate ? localFormData.degreeCertificate.name : "Click to upload certificate (PDF, JPG, PNG)"}
                  </span>
                </div>
                <input id="degreeCertificate" name="degreeCertificate" type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden" onChange={handleFileChange} />
              </label>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-between mt-8">
            <button type="button" onClick={onBack} className="px-8 py-3 bg-white/70 border border-gray-200 rounded-xl text-gray-700 hover:bg-white/90 font-medium">
              Back
            </button>
            <button type="button" onClick={handleNextClick} className="px-8 py-3 bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white rounded-xl hover:shadow-lg font-medium">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
const customSelectStyles = {
  control: (base, state) => ({
    ...base,
    minHeight: '56px',
    borderRadius: '12px',
    borderColor: state.isFocused ? '#667eea' : '#d1d5db',
    boxShadow: state.isFocused ? '0 0 0 3px rgba(102,126,234,0.1)' : 'none',
  }),
};