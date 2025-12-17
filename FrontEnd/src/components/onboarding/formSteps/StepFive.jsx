import React, { useState, useEffect } from "react";
import { ChevronDownIcon, UploadIcon, XIcon, Award, Link, FileCode, Code } from "lucide-react";

const isValidLinkedIn = (url) => {
  const pattern = /^https?:\/\/(www\.)?linkedin\.com\/in\/[A-Za-z0-9-_]+\/?$/;
  return pattern.test(url.trim());
};

const isValidGithub = (url) => {
  const pattern = /^https?:\/\/(www\.)?github\.com\/[A-Za-z0-9-_]+\/?$/;
  return pattern.test(url.trim());
};

const isValidPortfolio = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

const skillOptions = [
  "JavaScript",
  "MERN Stack",
  "React",
  "Node.js",
  "Python",
  "Java",
  "SQL",
  "HTML",
  "CSS",
  "TypeScript",
  "Angular",
  "Vue.js",
  "MongoDB",
  "Express.js",
  "Git",
  "Docker",
];

export const StepFive = ({ onNext, onBack, formData, onChange }) => {
  // Local state to manage the form efficiently
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLocalFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setLocalFormData((prev) => ({ ...prev, project: e.target.files[0] }));
  };

  const handleSkillSelect = (e) => {
    const skill = e.target.value;
    if (skill && !localFormData.skills.includes(skill)) {
      setLocalFormData((prev) => ({
        ...prev,
        skills: [...prev.skills, skill],
      }));
    }
  };

  const removeSkill = (skillToRemove) => {
    setLocalFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((skill) => skill !== skillToRemove),
    }));
  };

  const handleNextClick = () => {
    const newErrors = {};

    // LinkedIn validation (only if user entered something)
    if (localFormData.linkedin) {
      if (!isValidLinkedIn(localFormData.linkedin)) {
        newErrors.linkedin =
          "Enter a valid LinkedIn URL (linkedin.com/in/username)";
      }
    }

    // GitHub validation
    if (localFormData.github) {
      if (!isValidGithub(localFormData.github)) {
        newErrors.github =
          "Enter a valid GitHub profile URL (github.com/username)";
      }
    }

    // Portfolio validation
    if (localFormData.portfolio) {
      if (!isValidPortfolio(localFormData.portfolio)) {
        newErrors.portfolio = "Enter a valid portfolio URL";
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
            <div>
              <label className="block text-gray-700 font-medium text-sm mb-2">
                Skills
              </label>
              
              {/* Selected Skills Tags */}
              {localFormData.skills.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {localFormData.skills.map((skill) => (
                    <div
                      key={skill}
                      className="flex items-center bg-gradient-to-r from-[#e0e7ff]/20 to-[#c7d2fe]/20 border border-[#e0e7ff]/30 text-gray-700 rounded-full px-3 py-1.5 text-sm"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => removeSkill(skill)}
                        className="ml-2 text-gray-500 hover:text-red-500 transition-colors"
                      >
                        <XIcon className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Skills Dropdown */}
              <div className="flex items-center">
                <Code className="w-5 h-5 text-gray-400 mr-3" />
                <div className="relative flex-grow">
                  <select
                    onChange={handleSkillSelect}
                    value=""
                    className="appearance-none w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:border-[#667eea] focus:shadow-[0_0_0_3px_rgba(102,126,234,0.1)] text-gray-700 pr-10"
                  >
                    <option value="" disabled>Add a skill</option>
                    {skillOptions.map((skill) => (
                      <option key={skill} value={skill}>{skill}</option>
                    ))}
                  </select>
                  <ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>
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
                  className="flex-grow p-4 border border-gray-300 rounded-xl focus:outline-none focus:border-[#667eea] focus:shadow-[0_0_0_3px_rgba(102,126,234,0.1)] text-gray-700 placeholder-gray-400"
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
                      className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:border-[#667eea] focus:shadow-[0_0_0_3px_rgba(102,126,234,0.1)] text-gray-700 placeholder-gray-400"
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
                      className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:border-[#667eea] focus:shadow-[0_0_0_3px_rgba(102,126,234,0.1)] text-gray-700 placeholder-gray-400"
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