import React, { useState } from "react";
import { ProgressIndicator } from "../ProgressIndicator";
import { ChevronDownIcon, UploadIcon, XIcon } from "lucide-react";

export const StepSix = ({ onNext, onCancel, onBack = onCancel, formData, onChange }) => {
  const [localFormData, setLocalFormData] = useState({
    about: formData.about || "",
    gender: "",
    toolsAndPlatforms: formData.toolsAndPlatforms || [],
    openToShift: formData.openToShift || [],
    languagesKnown: formData.languagesKnown || [],
  });

  
  const genderOptions = ["Male", "Female", "Non-binary", "Prefer not to say"];
  
  const toolsAndPlatforms = [
    "VS Code", "Figma", "JIRA", "Slack", "Trello", "Postman", "AWS Console",
    "Google Cloud Platform", "Azure Portal", "Docker", "Kubernetes", "Jenkins",
    "GitHub", "GitLab", "Bitbucket", "Notion", "Confluence"
  ];

  const openToShift = [
    { value: "day", label: "Day Shift" },
    { value: "night", label: "Night Shift" },
    { value: "rotational", label: "Rotational Shift" }
  ];

  const languagesKnown = [
    "English", "Hindi", "Spanish", "French", "German", "Chinese", "Japanese",
    "Arabic", "Portuguese", "Russian", "Bengali", "Tamil", "Telugu", "Marathi"
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLocalFormData((prev) => ({ ...prev, [name]: value }));
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

  const handleShiftChange = (shiftValue) => {
    setLocalFormData((prev) => {
      const currentShifts = [...prev.openToShift];
      if (currentShifts.includes(shiftValue)) {
        return {
          ...prev,
          openToShift: currentShifts.filter(shift => shift !== shiftValue)
        };
      } else {
        return {
          ...prev,
          openToShift: [...currentShifts, shiftValue]
        };
      }
    });
  };

const handleLanguageSelect = (e) => {
    const language = e.target.value;
   
    if (language && !localFormData.languagesKnown.includes(language)) {
      setLocalFormData((prev) => ({
        ...prev,
        languagesKnown: [...prev.languagesKnown, language],
      }));
    }
  };

  const removeLanguage = (languageToRemove) => {

    setLocalFormData((prev) => ({
      ...prev,
      languagesKnown: prev.languagesKnown.filter((language) => language !== languageToRemove),
    }));
  };

  const handleNextClick = () => {
    onChange({ ...formData, ...localFormData });
    onNext();
  };

  return (
    <div className="justify-center items-stretch bg-white z-0 flex min-w-60 flex-col w-[560px] my-auto p-12 max-md:max-w-full max-md:px-5">
      <ProgressIndicator currentStep={6} totalSteps={6} />
      
      <div className="flex w-full flex-col items-stretch justify-center mt-8 max-md:max-w-full">
        <div className="w-full text-black max-md:max-w-full">
          <h2 className="text-[32px] font-bold leading-[42px] max-md:max-w-full">
            Additional Information
          </h2>
          <p className="text-base font-normal leading-6 mt-2 max-md:max-w-full">
            Help us understand you better with these details.
          </p>
        </div>

        <form className="w-full text-base font-normal mt-8 max-md:max-w-full">
          {/* About Section */}
          <div className="w-full">
            <label htmlFor="about" className="block text-black mb-2">About Yourself</label>
            <textarea
              id="about"
              name="about"
              rows="4"
              value={localFormData.about}
              onChange={handleChange}
              className="w-full p-3 mt-2 border border-gray-300 rounded"
              placeholder="Tell us about your professional background, interests, and career aspirations..."
            />
          </div>

          {/* Gender */}
          <div className="w-full mt-6">
            <label htmlFor="gender" className="block text-black mb-2">Gender</label>
            <div className="relative">
              <select
                id="gender"
                name="gender"
                value={localFormData.gender}
                onChange={handleChange}
                className="appearance-none bg-white flex min-h-12 w-full p-3 border border-gray-300 rounded"
              >
                <option value="">Select Gender</option>
                {genderOptions.map(gender => (
                  <option key={gender} value={gender}>{gender}</option>
                ))}
              </select>
              <ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-6 h-6 pointer-events-none" />
            </div>
          </div>

          {/* Tools/Platforms Known */}
          <div className="w-full mt-6">
            <label htmlFor="toolsPlatforms" className="block text-black mb-2">Tools & Platforms Known</label>
            <div className="relative">
              <select
                id="toolsPlatforms"
                onChange={handleToolsSelect}
                value=""
                className="appearance-none bg-white flex min-h-12 w-full p-3 border border-gray-300 rounded"
              >
                <option value="" disabled>Select a tool or platform</option>
                {toolsAndPlatforms.map(tool => (
                  <option key={tool} value={tool}>{tool}</option>
                ))}
              </select>
              <ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-6 h-6 pointer-events-none" />
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {localFormData.toolsAndPlatforms.map((tool) => (
                <div key={tool} className="flex items-center bg-gray-200 text-black rounded-full px-3 py-1 text-sm">
                  {tool}
                  <button type="button" onClick={() => removeTool(tool)} className="ml-2 focus:outline-none">
                    <XIcon className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Open to Shift */}
          <div className="w-full mt-6">
            <label className="block text-black mb-2">Open to Shift</label>
            <div className="flex flex-wrap gap-4 mt-2">
              {openToShift.map((shift) => (
                <label key={shift.value} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={localFormData.openToShift.includes(shift.value)}
                    onChange={() => handleShiftChange(shift.value)}
                    className="w-4 h-4 text-black border-gray-300 rounded focus:ring-black"
                  />
                  <span className="ml-2">{shift.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Languages Known */}
          <div className="w-full mt-6">
            <label htmlFor="languages" className="block text-black mb-2">Languages Known</label>
            <div className="relative">
              <select
                id="languages"
                onChange={handleLanguageSelect}
                value=""
                className="appearance-none bg-white flex min-h-12 w-full p-3 border border-gray-300 rounded"
              >
                <option value="" disabled>Select a language</option>
                {languagesKnown.map(language => (
                  <option key={language} value={language}>{language}</option>
                ))}
              </select>
              <ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-6 h-6 pointer-events-none" />
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {localFormData.languagesKnown.map((language) => (
                <div key={language} className="flex items-center bg-gray-200 text-black rounded-full px-3 py-1 text-sm">
                  {language}
                  <button type="button" onClick={() => removeLanguage(language)} className="ml-2 focus:outline-none">
                    <XIcon className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-4 mt-8">
            <button 
              type="button" 
              onClick={onBack} 
              className="px-6 py-3 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Back
            </button>
            <button 
              type="button" 
              onClick={handleNextClick} 
              className="bg-black text-white px-6 py-3 border border-black rounded-md hover:bg-gray-800"
            >
              Next
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};