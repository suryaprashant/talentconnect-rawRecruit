import React, { useState, useEffect } from "react";
import { ProgressIndicator } from "../ProgressIndicator";
import { ChevronDownIcon, UploadIcon, XIcon } from "lucide-react"; // Make sure XIcon is imported

// A sample list of skills for the dropdown.
const skillOptions = [
  "JavaScript","MERN Stack", "React", "Node.js", "Python", "Java", "SQL", "HTML", "CSS",
  "TypeScript", "Angular", "Vue.js", "MongoDB", "Express.js", "Git", "Docker"
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

  // This useEffect hook auto-populates the form with data from the resume
  useEffect(() => {
    const updates = {};
    if (formData.skills && Array.isArray(formData.skills)) {
  // Use a Set to automatically remove duplicates, then convert back to an array
  updates.skills = [...new Set(formData.skills)];
}
    if (formData.certifications) {
      updates.certifications = Array.isArray(formData.certifications) ? formData.certifications.join('\n') : formData.certifications;
    }
    if (formData.linkedin) updates.linkedin = formData.linkedin;
    if (formData.github) updates.github = formData.github;
    if (formData.portfolio) updates.portfolio = formData.portfolio;

    if (Object.keys(updates).length > 0) {
      setLocalFormData(prev => ({ ...prev, ...updates }));
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
    onChange({ ...formData, ...localFormData });
    onNext(); // This will likely trigger the final form submission
  };

  return (
    <div className="justify-center items-stretch bg-white z-0 flex min-w-60 flex-col w-[560px] my-auto p-12 max-md:max-w-full max-md:px-5">
      <ProgressIndicator currentStep={5} totalSteps={5} />
      <div className="flex w-full flex-col items-stretch justify-center mt-8 max-md:max-w-full">
        <h2 className="text-[32px] font-bold leading-[42px] max-md:max-w-full">
          You're almost there! Let's add final details.
        </h2>
        <p className="text-base font-normal leading-6 mt-2 max-md:max-w-full">
          Highlight your skills and achievements to stand out to employers.
        </p>

        <form className="w-full text-base font-normal mt-8 max-md:max-w-full">
          {/* Skills with Tag system */}
          <div className="w-full">
            <label htmlFor="skills" className="block text-black mb-2">Skills</label>
            <div className="relative">
              <select
                id="skills"
                onChange={handleSkillSelect}
                value="" // Keep the select reset
                className="appearance-none bg-white flex min-h-12 w-full p-3 border border-gray-300 rounded"
              >
                <option value="" disabled>Add a skill</option>
                {skillOptions.map(skill => <option key={skill} value={skill}>{skill}</option>)}
              </select>
              <ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-6 h-6 pointer-events-none" />
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {localFormData.skills.map((skill) => (
                <div key={skill} className="flex items-center bg-gray-200 text-black rounded-full px-3 py-1 text-sm">
                  {skill}
                  <button type="button" onClick={() => removeSkill(skill)} className="ml-2 focus:outline-none">
                    <XIcon className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Certifications */}
          <div className="w-full mt-6">
            <label htmlFor="certifications" className="block text-black mb-2">Certifications</label>
            <textarea
              id="certifications"
              name="certifications"
              rows="3"
              value={localFormData.certifications}
              onChange={handleChange}
              className="w-full p-3 mt-2 border border-gray-300 rounded"
              placeholder="e.g., Google Cloud Certified, AWS Certified Developer"
            />
          </div>

          {/* Social Links */}
          <div className="w-full mt-6">
            <label htmlFor="linkedin" className="block text-black mb-2">LinkedIn Profile</label>
            <input id="linkedin" name="linkedin" type="url" value={localFormData.linkedin} onChange={handleChange} className="flex min-h-12 w-full mt-2 p-3 border border-gray-300 rounded" placeholder="https://linkedin.com/in/yourprofile"/>
          </div>
          <div className="w-full mt-6">
            <label htmlFor="github" className="block text-black mb-2">Github Profile</label>
            <input id="github" name="github" type="url" value={localFormData.github} onChange={handleChange} className="flex min-h-12 w-full mt-2 p-3 border border-gray-300 rounded" placeholder="https://github.com/yourusername"/>
          </div>
          <div className="w-full mt-6">
            <label htmlFor="portfolio" className="block text-black mb-2">Portfolio Website</label>
            <input id="portfolio" name="portfolio" type="url" value={localFormData.portfolio} onChange={handleChange} className="flex min-h-12 w-full mt-2 p-3 border border-gray-300 rounded" placeholder="https://yourportfolio.com"/>
          </div>
          
          {/* Project Upload */}
          <div className="w-full mt-6">
            <label className="block text-black mb-2">Upload a Project (Optional)</label>
            <label className="flex items-center min-h-12 w-full gap-2 text-[#666] p-3 mt-2 border border-gray-300 rounded cursor-pointer hover:bg-gray-50">
              <span className="flex-1">{localFormData.project ? localFormData.project.name : "Upload File"}</span>
              <UploadIcon className="w-6 h-6" />
              <input type="file" className="hidden" onChange={handleFileChange} />
            </label>
          </div>
          
          {/* Buttons */}
          <div className="flex gap-4 mt-8">
            <button type="button" onClick={onBack} className="px-6 py-3 border rounded-md">Back</button>
            <button type="button" onClick={handleNextClick} className="bg-black text-white px-6 py-3 border rounded-md">Submit</button>
          </div>
        </form>
      </div>
    </div>
  );
};