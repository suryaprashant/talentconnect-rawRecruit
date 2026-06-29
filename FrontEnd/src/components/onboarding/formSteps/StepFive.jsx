import React, { useState, useEffect ,useMemo } from "react";
import { ChevronDownIcon, UploadIcon, XIcon, Award, Link, FileCode, Code, Wrench } from "lucide-react";
import axios from '../../../lib/axiosInstance';
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
    skills: formData.skills || [],
    certifications: formData.certifications || "",
    linkedin: formData.linkedin || "",
    github: formData.github || "",
    portfolio: formData.portfolio || "",
    project: formData.project || null,
    toolsAndPlatforms: formData.toolsAndPlatforms || [],
    referralSource: formData.referralSource || "",
  });
  const [errors, setErrors] = useState({});
useEffect(() => {
  if (formData.skills?.length) {
    setLocalFormData(prev => ({
      ...prev,
      skills: formData.skills
    }));
  }
}, [formData.skills]);
  // This useEffect hook auto-populates the form with data from the resume
// Replace your existing fetchMeta useEffect with this:
useEffect(() => {
  const fetchSkills = async () => {
    try {
      // Calling your new GET endpoint
      const { data } = await axios.get(`${import.meta.env.VITE_Backend_URL}/api/meta/get-skills`);
      
      // Extract the 'skills' string from each object in the array
      const skillNames = data.map(item => item.skills); 
      setMetaData(skillNames); // Store them in metaData state
    } catch (err) {
      console.error("Error loading skills from database", err);
      toast.error("Could not load skills list");
    }
  };
  fetchSkills();
}, []);

const [customSkillSearch, setCustomSkillSearch] = useState("");

 // Inside StepFive component, add this state:
const [isDropdownOpen, setIsDropdownOpen] = useState(false);

const toolsAndPlatforms = [
  "VS Code", "Figma", "JIRA", "Slack", "Trello", "Postman", "AWS Console",
  "Google Cloud Platform", "Azure Portal", "Docker", "Kubernetes", "Jenkins",
  "GitHub", "GitLab", "Bitbucket", "Notion", "Confluence"
];

const handleSelectOrAdd = async (skillName) => {
  const trimmedSkill = skillName.trim();
  if (!trimmedSkill) return;

  // 1. Check if the user ALREADY selected this skill in the current form
  const isAlreadySelected = localFormData.skills.some(
    s => s.toLowerCase() === trimmedSkill.toLowerCase()
  );

  if (isAlreadySelected) {
    setCustomSkillSearch("");
    setIsDropdownOpen(false);
    return;
  }

  // 2. Check if the skill exists in the GLOBAL database list
  // Note: Ensure filteredSkillOptions is actually an array of strings
  const existsInGlobalList = filteredSkillOptions.some(
    s => String(s).toLowerCase() === trimmedSkill.toLowerCase()
  );

  if (!existsInGlobalList) {
    // ONLY call the API if it's truly a new skill
    await handleAddNewSkill(trimmedSkill);
  } else {
    // If it exists in global list, just add it to the user's current selection
    setLocalFormData(prev => ({
      ...prev,
      skills: [...prev.skills, trimmedSkill]
    }));
  }

  setCustomSkillSearch("");
  setIsDropdownOpen(false);
};

 // 1. Fetch Dynamic Metadata from Backend


  // 2. Filter Skills based on the Degree selected in previous steps
// Replace your existing filteredSkillOptions with this:
const filteredSkillOptions = useMemo(() => {
  // Since metaData is now just an array of skill strings:
  return Array.isArray(metaData) ? metaData.sort() : [];
}, [metaData]);

const handleAddNewSkill = async (newSkillName) => {
  const trimmedSkill = newSkillName.trim();
  if (!trimmedSkill) return;

  try {
    // MATCHING YOUR BACKEND: Use 'skills' as the key
    const payload = { skills: trimmedSkill };
 console.log("Sending skill:", payload);
    const { data } = await axios.post(
      `${import.meta.env.VITE_Backend_URL}/api/meta/add-skill`, 
      payload
    );

    // Update dropdown list with the returned string
    setMetaData(prev => [...new Set([...prev, data.skills])]);

    // Update local selection
    setLocalFormData(prev => ({
      ...prev,
      skills: [...new Set([...prev.skills, data.skills])]
    }));

    toast.success(`Skill "${data.skills}" added!`);
  } catch (err) {
    // This will catch the 'unique' constraint error if the skill exists
    const errorMsg = err.response?.data?.error?.includes("duplicate key") 
      ? "This skill already exists in the database" 
      : "Error adding skill";
    
    toast.error(errorMsg);
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

  const handleToolsSelect = (e) => {
    const tool = e.target.value;
    if (tool && !localFormData.toolsAndPlatforms.includes(tool)) {
      setLocalFormData((prev) => ({
        ...prev,
        toolsAndPlatforms: [...prev.toolsAndPlatforms, tool],
      }));
    }
  };

  const removeTool = (toolToRemove) => {
    setLocalFormData((prev) => ({
      ...prev,
      toolsAndPlatforms: prev.toolsAndPlatforms.filter((tool) => tool !== toolToRemove),
    }));
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
  // onChange({ ...formData, ...localFormData });
  onChange(localFormData);
  onNext();
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#143694]/10 via-[#f093fb]/5 to-[#1e4ed8]/10">
      {/* Pastel blur background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#143694]/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 -left-20 w-60 h-60 bg-[#f093fb]/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-1/3 w-40 h-40 bg-[#1e4ed8]/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
        <div className="bg-white/90 backdrop-blur-sm border border-white/50 rounded-2xl shadow-lg shadow-purple-50/50 p-8 w-full max-w-2xl">
          
          {/* Header with gradient */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-r from-[#143694]/20 to-[#1e4ed8]/20 flex items-center justify-center mx-auto mb-4">
              <Award className="w-10 h-10 text-[#143694]" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-[#143694] to-[#1e4ed8] bg-clip-text text-transparent mb-2">
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
           {/* Skills with Searchable Dropdown */}
<div>
  <label className="block text-gray-700 font-medium text-sm mb-2">
    Skills
  </label>
  <div className="relative">
    {/* Input Area + Selected Tags */}
    <div className="flex flex-wrap gap-2 p-3 bg-white border border-gray-300 rounded-xl min-h-[56px] focus-within:border-[#143694] transition-all">
      {localFormData.skills.map((skill) => (
        <span key={skill} className="flex items-center gap-1 px-3 py-1 bg-[#143694]/10 text-[#143694] text-sm font-medium rounded-lg border border-[#143694]/20">
          {skill}
          <button type="button" onClick={() => removeSkill(skill)} className="hover:text-red-500">
            <XIcon className="w-3 h-3" />
          </button>
        </span>
      ))}
      
      <input
        type="text"
        className="flex-grow min-w-[120px] outline-none bg-transparent text-black text-sm"
        placeholder="Search skills (e.g. React, Python)..."
        value={customSkillSearch}
        onFocus={() => setIsDropdownOpen(true)}
        onChange={(e) => setCustomSkillSearch(e.target.value)}
      />
    </div>

    {/* The Dropdown Menu */}
    {isDropdownOpen && (
      <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-xl max-h-60 overflow-y-auto">
        {/* 1. Show existing skills from DB that match search */}
        {filteredSkillOptions
          .filter(s => 
            s.toLowerCase().includes(customSkillSearch.toLowerCase()) && 
            !localFormData.skills.includes(s)
          )
          .map(skill => (
            <button
              key={skill}
              type="button"
              className="w-full text-left px-4 py-3 hover:bg-gray-50 text-sm transition-colors border-b border-gray-50 last:border-none"
              onClick={() => handleSelectOrAdd(skill)}
            >
              {skill}
            </button>
          ))}

        {/* 2. "Add New" option if search doesn't match any DB skill */}
        {customSkillSearch && !filteredSkillOptions.some(s => s.toLowerCase() === customSkillSearch.toLowerCase()) && (
          <button
            type="button"
            className="w-full text-left px-4 py-3 bg-[#143694]/5 text-[#143694] text-sm font-medium hover:bg-[#143694]/10"
            onClick={() => handleSelectOrAdd(customSkillSearch)}
          >
            <span className="flex items-center gap-2">
              <Award className="w-4 h-4" /> Add "{customSkillSearch}" to Database
            </span>
          </button>
        )}
        
        {/* 3. Empty State */}
        {customSkillSearch === "" && filteredSkillOptions.length === 0 && (
          <div className="px-4 py-3 text-gray-400 text-sm">No suggested skills for your degree yet.</div>
        )}
      </div>
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
                  className="flex-grow p-4  bg-white text-black placeholder-gray-400 border border-gray-300 rounded-xl focus:outline-none focus:border-[#143694] focus:shadow-[0_0_0_3px_rgba(102,126,234,0.1)]"
                  placeholder="e.g., Google Cloud Certified, AWS Certified Developer (One per line)"
                />
              </div>
            </div>

            {/* Tools & Platforms Known (moved from old Step 6) */}
            <div>
              <label className="block text-gray-700 font-medium text-sm mb-2">
                Tools & Platforms Known
              </label>

              {localFormData.toolsAndPlatforms.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {localFormData.toolsAndPlatforms.map((tool) => (
                    <div
                      key={tool}
                      className="flex items-center bg-gradient-to-r from-[#e0e7ff]/20 to-[#c7d2fe]/20 border border-[#e0e7ff]/30 text-gray-700 rounded-full px-3 py-1.5 text-sm"
                    >
                      {tool}
                      <button
                        type="button"
                        onClick={() => removeTool(tool)}
                        className="ml-2 text-gray-500 hover:text-red-500 transition-colors"
                      >
                        <XIcon className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex items-center">
                <Wrench className="w-5 h-5 text-gray-400 mr-3" />
                <div className="relative flex-grow">
                  <select
                    onChange={handleToolsSelect}
                    value=""
                    className="appearance-none w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:border-[#143694] focus:shadow-[0_0_0_3px_rgba(102,126,234,0.1)] text-gray-700 pr-10"
                  >
                    <option value="" disabled>Select a tool or platform</option>
                    {toolsAndPlatforms.map(tool => (
                      <option key={tool} value={tool}>{tool}</option>
                    ))}
                  </select>
                  <ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>
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
                      className="w-full p-4  bg-white text-black placeholder-gray-400 border border-gray-300 rounded-xl focus:outline-none focus:border-[#143694] focus:shadow-[0_0_0_3px_rgba(102,126,234,0.1)]"
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
                      className="w-full p-4  bg-white text-black placeholder-gray-400 border border-gray-300 rounded-xl focus:outline-none focus:border-[#143694] focus:shadow-[0_0_0_3px_rgba(102,126,234,0.1)]"
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
                    className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:border-[#143694] focus:shadow-[0_0_0_3px_rgba(102,126,234,0.1)] text-gray-700 placeholder-gray-400"
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
              <label className="flex items-center w-full p-4 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-[#143694] hover:bg-[#143694]/5 transition-all duration-200">
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
              className="flex items-center justify-center px-8 py-3 bg-gradient-to-r from-[#143694] to-[#1e4ed8] text-white rounded-xl hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-200 font-medium"
            >
              Next
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};