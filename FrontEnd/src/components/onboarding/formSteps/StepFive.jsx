import React, { useState, useEffect ,useMemo } from "react";
import { ChevronDownIcon, UploadIcon, XIcon, Award, Link, FileCode, Code } from "lucide-react";
import axios from 'axios';
//import { ChevronDownIcon, UploadIcon, XIcon, Award, Link, FileCode, Code } from "lucide-react";
import toast from 'react-hot-toast';
const isValidLinkedIn = (url) => {
  if (!url.trim()) return false;
  
  // Clean the URL
  const cleanUrl = url
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, '')  // Remove http:// or https://
    .replace(/^www\./, '')         // Remove www.
    .replace(/^\/+|\/+$/g, '');    // Remove leading/trailing slashes

  // Must be a LinkedIn URL
  if (!cleanUrl.includes('linkedin.com')) {
    return false;
  }

  // Accepts:
  // - linkedin.com/in/username
  // - linkedin.com/username
  // - linkedin.com/company/companyname
  // - linkedin.com/school/schoolname
  // etc.
  
  const linkedinPattern = /^linkedin\.com\/[A-Za-z0-9-_/]+\/?$/;
  
  return linkedinPattern.test(cleanUrl);
};

const isValidGithub = (url) => {
  if (!url.trim()) return false;
  
  // Clean the URL
  const cleanUrl = url
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, '')
    .replace(/^www\./, '')
    .replace(/^\/+|\/+$/g, '');

  // Must be a GitHub URL
  if (!cleanUrl.includes('github.com')) {
    return false;
  }

  const githubPattern = /^github\.com\/[A-Za-z0-9-_]+\/?$/;
  
  return githubPattern.test(cleanUrl);
};

const isValidPortfolio = (url) => {
  try {
    new URL(url);
    // Reject if it's LinkedIn or GitHub (these should only go in their respective fields)
    const lowerUrl = url.toLowerCase();
    if (lowerUrl.includes('linkedin.com') || lowerUrl.includes('github.com')) {
      return false;
    }
    return true;
  } catch {
    return false;
  }
};




export const StepFive = ({ onNext, onBack, formData, onChange }) => {
  // Local state to manage the form efficiently
  const [metaData, setMetaData] = useState([]);
  const [localFormData, setLocalFormData] = useState({
    skills: [],
    certifications: "",
    linkedin: "",
    github: "",
    portfolio: "",
    project: null,
    referralSource: "",
  });
  const [errors, setErrors] = useState({});

  // This useEffect hook auto-populates the form with data from the resume
  useEffect(() => {
    const updates = {};
    if (formData.skills && Array.isArray(formData.skills)) {
      // Use a Set to automatically remove duplicates, then convert back to an array
      updates.skills = [...new Set(formData.skills)];
    }
    if (formData.certifications) {
      updates.certifications = Array.isArray(formData.certifications)
        ? formData.certifications.join("\n")
        : formData.certifications;
    }
    if (formData.linkedin) updates.linkedin = formData.linkedin;
    if (formData.github) updates.github = formData.github;
    if (formData.portfolio) updates.portfolio = formData.portfolio;

    if (Object.keys(updates).length > 0) {
      setLocalFormData((prev) => ({ ...prev, ...updates }));
    }
  }, [formData]);

const [customSkillSearch, setCustomSkillSearch] = useState("");

 // Inside StepFive component, add this state:
const [isDropdownOpen, setIsDropdownOpen] = useState(false);

const handleSelectOrAdd = async (skillName) => {
  const trimmedSkill = skillName.trim();
  if (!trimmedSkill) return;

  if (localFormData.skills.includes(trimmedSkill)) {
    setCustomSkillSearch("");
    setIsDropdownOpen(false);
    return;
  }

  // If it's a new skill, save to DB, else just add to local state
  if (!filteredSkillOptions.includes(trimmedSkill)) {
    await handleAddNewSkill(trimmedSkill);
  } else {
    setLocalFormData(prev => ({
      ...prev,
      skills: [...prev.skills, trimmedSkill]
    }));
  }
  setCustomSkillSearch("");
  setIsDropdownOpen(false);
};

 // 1. Fetch Dynamic Metadata from Backend
  useEffect(() => {
    const fetchMeta = async () => {
      try {
        const { data } = await axios.get(`${import.meta.env.VITE_Backend_URL}/api/meta`);
        setMetaData(data);
      } catch (err) {
        console.error("Error loading skill metadata", err);
      }
    };
    fetchMeta();
  }, []);

  // 2. Filter Skills based on the Degree selected in previous steps
  const filteredSkillOptions = useMemo(() => {
    // Check education array from Step 3 or top-level degree field
    const selectedDegree = formData.education?.[0]?.degree || formData.degree;
    if (!selectedDegree) return [];

    const match = metaData.find(m => m.degree === selectedDegree);
    return match ? match.skills.sort() : [];
  }, [formData.education, formData.degree, metaData]);

  // 3. Global Handler to add new skills to the database
  const handleAddNewSkill = async (newSkillName) => {
    if (!newSkillName.trim()) return;
    const selectedDegree = formData.education?.[0]?.degree || formData.degree;

    try {
      const payload = {
        type: 'skills',
        name: newSkillName.trim(),
        parentDegree: selectedDegree
      };

      const { data } = await axios.post(`${import.meta.env.VITE_Backend_URL}/api/meta/add`, payload);
      
      setMetaData(prev => {
        const index = prev.findIndex(m => m.degree === data.degree);
        const newMeta = [...prev];
        newMeta[index] = data;
        return newMeta;
      });

      if (!localFormData.skills.includes(newSkillName.trim())) {
        setLocalFormData(prev => ({
          ...prev,
          skills: [...prev.skills, newSkillName.trim()]
        }));
      }
      toast.success(`Skill "${newSkillName}" added to database!`);
    } catch (err) {
      toast.error("Failed to add new skill to global list");
    }
  };

  // ... (Keep handleChange, handleFileChange, removeSkill, handleNextClick)

  const handleSkillSelect = (e) => {
    const skill = e.target.value;
    if (skill === "ADD_NEW_CUSTOM") {
      const custom = prompt("Enter new skill name:");
      if (custom) handleAddNewSkill(custom);
      return;
    }
    if (skill && !localFormData.skills.includes(skill)) {
      setLocalFormData((prev) => ({
        ...prev,
        skills: [...prev.skills, skill],
      }));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLocalFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setLocalFormData((prev) => ({ ...prev, project: e.target.files[0] }));
  };

  // const handleSkillSelect = (e) => {
  //   const skill = e.target.value;
  //   if (skill && !localFormData.skills.includes(skill)) {
  //     setLocalFormData((prev) => ({
  //       ...prev,
  //       skills: [...prev.skills, skill],
  //     }));
  //   }
  // };

  const removeSkill = (skillToRemove) => {
    setLocalFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((skill) => skill !== skillToRemove),
    }));
  };

  const handleNextClick = () => {
  const newErrors = {};

  // LinkedIn validation
  if (localFormData.linkedin) {
    if (!isValidLinkedIn(localFormData.linkedin)) {
      newErrors.linkedin = "Enter a valid LinkedIn URL (e.g., linkedin.com/username)";
    }
  }

  // GitHub validation
  if (localFormData.github) {
    if (!isValidGithub(localFormData.github)) {
      newErrors.github = "Enter a valid GitHub URL (e.g., github.com/username)";
    }
  }

  // Portfolio validation - ensure it's not LinkedIn or GitHub
  if (localFormData.portfolio) {
    const lowerPortfolio = localFormData.portfolio.toLowerCase();
    if (lowerPortfolio.includes('linkedin.com')) {
      newErrors.portfolio = "LinkedIn URL should be entered in the LinkedIn field";
    } else if (lowerPortfolio.includes('github.com')) {
      newErrors.portfolio = "GitHub URL should be entered in the GitHub field";
    } else if (!isValidPortfolio(localFormData.portfolio)) {
      newErrors.portfolio = "Enter a valid portfolio website URL";
    }
  }

  if (Object.keys(newErrors).length > 0) {
    setErrors(newErrors);
    return;
  }

  // No errors → proceed
  setErrors({});
  onChange({ ...formData, ...localFormData });
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
              <Award className="w-10 h-10 text-[#667eea]" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent mb-2">
              Skills & Achievements
            </h1>
            <p className="text-gray-600 mb-4">
              Highlight your skills and achievements to stand out to employers.
            </p>
          </div>

          {/* Form Section */}
          <div className="space-y-6">
            {/* Skills with Tag system */}
            
    {/* --- REPLACED SKILLS SECTION --- */}
           <div>
              <label className="block text-gray-700 font-medium text-sm mb-2">Skills</label>
              
              {/* Chips for Selected Skills */}
              <div className="flex flex-wrap gap-2 mb-3">
                {localFormData.skills.map((skill) => (
                  <div key={skill} className="flex items-center bg-[#667eea]/10 border border-[#667eea]/20 text-[#4338ca] rounded-full px-3 py-1.5 text-sm font-medium">
                    {skill}
                    <button type="button" onClick={() => removeSkill(skill)} className="ml-2 hover:text-red-500">
                      <XIcon className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Search & Select Input */}
              <div className="relative">
                <div className="flex gap-2">
                  <div className="relative flex-grow">
                    <Code className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search or type a new skill..."
                      value={customSkillSearch}
                      onFocus={() => setIsDropdownOpen(true)}
                      onChange={(e) => {
                        setCustomSkillSearch(e.target.value);
                        setIsDropdownOpen(true);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleSelectOrAdd(customSkillSearch);
                        }
                      }}
                      className="w-full pl-12 p-4  bg-white text-black placeholder-gray-400 border border-gray-300 rounded-xl focus:outline-none focus:border-[#667eea] "
                    />
                  </div>
                  {customSkillSearch && (
                    <button
                      type="button"
                      onClick={() => handleSelectOrAdd(customSkillSearch)}
                      className="px-6 bg-[#667eea] text-white rounded-xl font-medium hover:bg-[#5a6fd6] transition-all"
                    >
                      Add
                    </button>
                  )}
                </div>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <>
                    {/* Transparent overlay to close dropdown when clicking outside */}
                    <div className="fixed inset-0 z-20" onClick={() => setIsDropdownOpen(false)}></div>
                    
                    <div className="absolute z-30 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-xl max-h-60 overflow-y-auto">
                      {filteredSkillOptions
                        .filter(s => s.toLowerCase().includes(customSkillSearch.toLowerCase()))
                        .map(skill => (
                          <div
                            key={skill}
                            onClick={() => handleSelectOrAdd(skill)}
                            className="p-3 hover:bg-[#667eea]/5 cursor-pointer text-gray-700 border-b border-gray-50 last:border-0"
                          >
                            {skill}
                          </div>
                        ))}
                      
                      {/* Show "Add New" option if typing something not in the list */}
                      {customSkillSearch && !filteredSkillOptions.some(s => s.toLowerCase() === customSkillSearch.toLowerCase()) && (
                        <div 
                          onClick={() => handleSelectOrAdd(customSkillSearch)}
                          className="p-3 text-[#667eea] font-medium hover:bg-[#667eea]/5 cursor-pointer"
                        >
                          + Add "{customSkillSearch}" as new skill
                        </div>
                      )}

                      {filteredSkillOptions.length === 0 && !customSkillSearch && (
                        <div className="p-4 text-center text-gray-400 text-sm">
                          No default skills found. Type to add your own.
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>

            

               
            {/* Certifications */}
            <div>
              <label htmlFor="certifications" className="block text-gray-700 font-medium text-sm mb-2">
                Certifications
              </label>
              <div className="flex items-start">
                <Award className="w-5 h-5 text-gray-400 mr-3 mt-4" />
                <textarea
                  id="certifications"
                  name="certifications"
                  rows="3"
                  value={localFormData.certifications}
                  onChange={handleChange}
                  className="flex-grow p-4  bg-white text-black placeholder-gray-400 border border-gray-300 rounded-xl focus:outline-none focus:border-[#667eea] focus:shadow-[0_0_0_3px_rgba(102,126,234,0.1)]"
                  placeholder="e.g., Google Cloud Certified, AWS Certified Developer (One per line)"
                />
              </div>
            </div>

            {/* Social Links */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* LinkedIn */}
              <div>
                <label htmlFor="linkedin" className="block text-gray-700 font-medium text-sm mb-2">
                  LinkedIn Profile
                </label>
                <div className="flex items-center">
                  <Link className="w-5 h-5 text-gray-400 mr-3" />
                  <div className="relative flex-grow">
                    <input
                      id="linkedin"
                      name="linkedin"
                      type="url"
                      value={localFormData.linkedin}
                      onChange={handleChange}
                      className="w-full p-4  bg-white text-black placeholder-gray-400 border border-gray-300 rounded-xl focus:outline-none focus:border-[#667eea] focus:shadow-[0_0_0_3px_rgba(102,126,234,0.1)]"
                      placeholder="linkedin.com/in/username"
                    />
                    {errors.linkedin && (
                      <p className="text-red-500 text-sm mt-1">{errors.linkedin}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* GitHub */}
              <div>
                <label htmlFor="github" className="block text-gray-700 font-medium text-sm mb-2">
                  GitHub Profile
                </label>
                <div className="flex items-center">
                  <FileCode className="w-5 h-5 text-gray-400 mr-3" />
                  <div className="relative flex-grow">
                    <input
                      id="github"
                      name="github"
                      type="url"
                      value={localFormData.github}
                      onChange={handleChange}
                      className="w-full p-4  bg-white text-black placeholder-gray-400 border border-gray-300 rounded-xl focus:outline-none focus:border-[#667eea] focus:shadow-[0_0_0_3px_rgba(102,126,234,0.1)]"
                      placeholder="github.com/username"
                    />
                    {errors.github && (
                      <p className="text-red-500 text-sm mt-1">{errors.github}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Portfolio Website */}
            <div>
              <label htmlFor="portfolio" className="block text-gray-700 font-medium text-sm mb-2">
                Portfolio Website
              </label>
              <div className="flex items-center">
                <Link className="w-5 h-5 text-gray-400 mr-3" />
                <div className="relative flex-grow">
                  <input
                    id="portfolio"
                    name="portfolio"
                    type="url"
                    value={localFormData.portfolio}
                    onChange={handleChange}
                    className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:border-[#667eea] focus:shadow-[0_0_0_3px_rgba(102,126,234,0.1)] text-gray-700 placeholder-gray-400"
                    placeholder="https://yourportfolio.com"
                  />
                  {errors.portfolio && (
                    <p className="text-red-500 text-sm mt-1">{errors.portfolio}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Project Upload */}
            <div>
              <label className="block text-gray-700 font-medium text-sm mb-2">
                Upload a Project (Optional)
              </label>
              <label className="flex items-center w-full p-4 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-[#667eea] hover:bg-[#667eea]/5 transition-all duration-200">
                <div className="flex items-center flex-grow">
                  <UploadIcon className="w-5 h-5 text-gray-400 mr-3" />
                  <span className="text-gray-600">
                    {localFormData.project
                      ? localFormData.project.name
                      : "Click to upload project file (PDF, ZIP, etc.)"}
                  </span>
                </div>
                <input
                  type="file"
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