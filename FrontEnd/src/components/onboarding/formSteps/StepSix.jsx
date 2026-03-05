// import React, { useState } from "react";
// import { ProgressIndicator } from "../ProgressIndicator";
// import { ChevronDownIcon, UploadIcon, XIcon } from "lucide-react";

// export const StepSix = ({ onNext, onCancel, onBack = onCancel, formData, onChange }) => {
//   // FIXED: Initialize ALL fields from formData for proper sessionStorage restoration
//   const [localFormData, setLocalFormData] = useState({
//     about: formData.about || "",
//     gender: formData.gender || "", // FIXED: Was hardcoded to ""
//     toolsAndPlatforms: formData.toolsAndPlatforms || [],
//     openToShift: formData.openToShift || [],
//     languagesKnown: formData.languagesKnown || [],
//   });

//   // Options for dropdowns and checkboxes
//   const genderOptions = ["Male", "Female", "Non-binary", "Prefer not to say"];
  
//   const toolsAndPlatforms = [
//     "VS Code", "Figma", "JIRA", "Slack", "Trello", "Postman", "AWS Console",
//     "Google Cloud Platform", "Azure Portal", "Docker", "Kubernetes", "Jenkins",
//     "GitHub", "GitLab", "Bitbucket", "Notion", "Confluence"
//   ];

//   const openToShift = [
//     { value: "day", label: "Day Shift" },
//     { value: "night", label: "Night Shift" },
//     { value: "rotational", label: "Rotational Shift" }
//   ];

//   const languagesKnown = [
//     "English", "Hindi", "Spanish", "French", "German", "Chinese", "Japanese",
//     "Arabic", "Portuguese", "Russian", "Bengali", "Tamil", "Telugu", "Marathi"
//   ];

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setLocalFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleToolsSelect = (e) => {
//     const tool = e.target.value;
//     if (tool && !localFormData.toolsAndPlatforms.includes(tool)) {
//       setLocalFormData((prev) => ({
//         ...prev,
//         toolsAndPlatforms: [...prev.toolsAndPlatforms, tool],
//       }));
//     }
//   };

//   const removeTool = (toolToRemove) => {
//     setLocalFormData((prev) => ({
//       ...prev,
//       toolsAndPlatforms: prev.toolsAndPlatforms.filter((tool) => tool !== toolToRemove),
//     }));
//   };

//   const handleShiftChange = (shiftValue) => {
//     setLocalFormData((prev) => {
//       const currentShifts = [...prev.openToShift];
//       if (currentShifts.includes(shiftValue)) {
//         return {
//           ...prev,
//           openToShift: currentShifts.filter(shift => shift !== shiftValue)
//         };
//       } else {
//         return {
//           ...prev,
//           openToShift: [...currentShifts, shiftValue]
//         };
//       }
//     });
//   };

//   const handleLanguageSelect = (e) => {
//     const language = e.target.value;
//     if (language && !localFormData.languagesKnown.includes(language)) {
//       setLocalFormData((prev) => ({
//         ...prev,
//         languagesKnown: [...prev.languagesKnown, language],
//       }));
//     }
//   };

//   const removeLanguage = (languageToRemove) => {
//     setLocalFormData((prev) => ({
//       ...prev,
//       languagesKnown: prev.languagesKnown.filter((language) => language !== languageToRemove),
//     }));
//   };

//   const handleNextClick = () => {
//     // Merge localFormData into formData and pass it up
//     onChange({ ...formData, ...localFormData });
//     onNext();
//   };

//   return (
//     <div className="justify-center items-stretch bg-white z-0 flex min-w-60 flex-col w-[560px] my-auto p-12 max-md:max-w-full max-md:px-5">
//       <ProgressIndicator currentStep={6} totalSteps={6} />
      
//       <div className="flex w-full flex-col items-stretch justify-center mt-8 max-md:max-w-full">
//         <div className="w-full text-black max-md:max-w-full">
//           <h2 className="text-[32px] font-bold leading-[42px] max-md:max-w-full">
//             Additional Information
//           </h2>
//           <p className="text-base font-normal leading-6 mt-2 max-md:max-w-full">
//             Help us understand you better with these details.
//           </p>
//         </div>

//         <form className="w-full text-base font-normal mt-8 max-md:max-w-full">
//           {/* About Section */}
//           <div className="w-full">
//             <label htmlFor="about" className="block text-black mb-2">About Yourself</label>
//             <textarea
//               id="about"
//               name="about"
//               rows="4"
//               value={localFormData.about}
//               onChange={handleChange}
//               className="w-full p-3 mt-2 border border-gray-300 rounded"
//               placeholder="Tell us about your professional background, interests, and career aspirations..."
//             />
//           </div>

//           {/* Gender */}
//           <div className="w-full mt-6">
//             <label htmlFor="gender" className="block text-black mb-2">Gender</label>
//             <div className="relative">
//               <select
//                 id="gender"
//                 name="gender"
//                 value={localFormData.gender}
//                 onChange={handleChange}
//                 className="appearance-none bg-white flex min-h-12 w-full p-3 border border-gray-300 rounded"
//               >
//                 <option value="">Select Gender</option>
//                 {genderOptions.map(gender => (
//                   <option key={gender} value={gender}>{gender}</option>
//                 ))}
//               </select>
//               <ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-6 h-6 pointer-events-none" />
//             </div>
//           </div>

//           {/* Tools/Platforms Known */}
//           <div className="w-full mt-6">
//             <label htmlFor="toolsPlatforms" className="block text-black mb-2">Tools & Platforms Known</label>
//             <div className="relative">
//               <select
//                 id="toolsPlatforms"
//                 onChange={handleToolsSelect}
//                 value=""
//                 className="appearance-none bg-white flex min-h-12 w-full p-3 border border-gray-300 rounded"
//               >
//                 <option value="" disabled>Select a tool or platform</option>
//                 {toolsAndPlatforms.map(tool => (
//                   <option key={tool} value={tool}>{tool}</option>
//                 ))}
//               </select>
//               <ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-6 h-6 pointer-events-none" />
//             </div>
//             <div className="flex flex-wrap gap-2 mt-2">
//               {localFormData.toolsAndPlatforms.map((tool) => (
//                 <div key={tool} className="flex items-center bg-gray-200 text-black rounded-full px-3 py-1 text-sm">
//                   {tool}
//                   <button type="button" onClick={() => removeTool(tool)} className="ml-2 focus:outline-none">
//                     <XIcon className="w-4 h-4" />
//                   </button>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Open to Shift */}
//           <div className="w-full mt-6">
//             <label className="block text-black mb-2">Open to Shift</label>
//             <div className="flex flex-wrap gap-4 mt-2">
//               {openToShift.map((shift) => (
//                 <label key={shift.value} className="flex items-center">
//                   <input
//                     type="checkbox"
//                     checked={localFormData.openToShift.includes(shift.value)}
//                     onChange={() => handleShiftChange(shift.value)}
//                     className="w-4 h-4 text-black border-gray-300 rounded focus:ring-black"
//                   />
//                   <span className="ml-2">{shift.label}</span>
//                 </label>
//               ))}
//             </div>
//           </div>

//           {/* Languages Known */}
//           <div className="w-full mt-6">
//             <label htmlFor="languages" className="block text-black mb-2">Languages Known</label>
//             <div className="relative">
//               <select
//                 id="languages"
//                 onChange={handleLanguageSelect}
//                 value=""
//                 className="appearance-none bg-white flex min-h-12 w-full p-3 border border-gray-300 rounded"
//               >
//                 <option value="" disabled>Select a language</option>
//                 {languagesKnown.map(language => (
//                   <option key={language} value={language}>{language}</option>
//                 ))}
//               </select>
//               <ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-6 h-6 pointer-events-none" />
//             </div>
//             <div className="flex flex-wrap gap-2 mt-2">
//               {localFormData.languagesKnown.map((language) => (
//                 <div key={language} className="flex items-center bg-gray-200 text-black rounded-full px-3 py-1 text-sm">
//                   {language}
//                   <button type="button" onClick={() => removeLanguage(language)} className="ml-2 focus:outline-none">
//                     <XIcon className="w-4 h-4" />
//                   </button>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Buttons */}
//           <div className="flex gap-4 mt-8">
//             <button 
//               type="button" 
//               onClick={onBack} 
//               className="px-6 py-3 border border-gray-300 rounded-md hover:bg-gray-50"
//             >
//               Back
//             </button>
//             <button 
//               type="button" 
//               onClick={handleNextClick} 
//               className="bg-black text-white px-6 py-3 border border-black rounded-md hover:bg-gray-800"
//             >
//               Next
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };


import React, { useState } from "react";
import { ChevronDownIcon, XIcon, User, Clock, Globe, Wrench } from "lucide-react";

export const StepSix = ({ onNext, onCancel, onBack = onCancel, formData, onChange }) => {
  // FIXED: Initialize ALL fields from formData for proper sessionStorage restoration
  const [localFormData, setLocalFormData] = useState({
   // about: formData.about || "",
    //gender: formData.gender || "",
    toolsAndPlatforms: formData.toolsAndPlatforms || [],
   // openToShift: formData.openToShift || [],
    languagesKnown: formData.languagesKnown || [],
  });

  // Options for dropdowns and checkboxes
  //const genderOptions = ["Male", "Female", "Non-binary", "Prefer not to say"];
  
  const toolsAndPlatforms = [
    "VS Code", "Figma", "JIRA", "Slack", "Trello", "Postman", "AWS Console",
    "Google Cloud Platform", "Azure Portal", "Docker", "Kubernetes", "Jenkins",
    "GitHub", "GitLab", "Bitbucket", "Notion", "Confluence"
  ];

  // const openToShift = [
  //   { value: "day", label: "Day Shift" },
  //   { value: "night", label: "Night Shift" },
  //   { value: "rotational", label: "Rotational Shift" }
  // ];

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

  // const handleShiftChange = (shiftValue) => {
  //   setLocalFormData((prev) => {
  //     const currentShifts = [...prev.openToShift];
  //     if (currentShifts.includes(shiftValue)) {
  //       return {
  //         ...prev,
  //         openToShift: currentShifts.filter(shift => shift !== shiftValue)
  //       };
  //     } else {
  //       return {
  //         ...prev,
  //         openToShift: [...currentShifts, shiftValue]
  //       };
  //     }
  //   });
  // };

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
    // Merge localFormData into formData and pass it up
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
              <User className="w-10 h-10 text-[#667eea]" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent mb-2">
              Additional Information
            </h1>
            <p className="text-gray-600 mb-4">
              Help us understand you better with these details.
            </p>
          </div>

          {/* Form Section */}
          <div className="space-y-6">
            {/* About Yourself */}
            {/* <div>
              <label htmlFor="about" className="block text-gray-700 font-medium text-sm mb-2">
                About Yourself
              </label>
              <textarea
                id="about"
                name="about"
                rows="4"
                value={localFormData.about}
                onChange={handleChange}
                className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:border-[#667eea] focus:shadow-[0_0_0_3px_rgba(102,126,234,0.1)] text-gray-700 placeholder-gray-400"
                placeholder="Tell us about your professional background, interests, and career aspirations..."
              />
            </div> */}

            {/* Gender */}
            {/* <div>
              <label htmlFor="gender" className="block text-gray-700 font-medium text-sm mb-2">
                Gender
              </label>
              <div className="flex items-center">
                <User className="w-5 h-5 text-gray-400 mr-3" />
                <div className="relative flex-grow">
                  <select
                    id="gender"
                    name="gender"
                    value={localFormData.gender}
                    onChange={handleChange}
                    className="appearance-none w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:border-[#667eea] focus:shadow-[0_0_0_3px_rgba(102,126,234,0.1)] text-gray-700 pr-10"
                  >
                    <option value="">Select Gender</option>
                    {genderOptions.map(gender => (
                      <option key={gender} value={gender}>{gender}</option>
                    ))}
                  </select>
                  <ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div> */}

            {/* Tools & Platforms Known */}
            <div>
              <label className="block text-gray-700 font-medium text-sm mb-2">
                Tools & Platforms Known
              </label>
              
              {/* Selected Tools Tags */}
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

              {/* Tools Dropdown */}
              <div className="flex items-center">
                <Wrench className="w-5 h-5 text-gray-400 mr-3" />
                <div className="relative flex-grow">
                  <select
                    onChange={handleToolsSelect}
                    value=""
                    className="appearance-none w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:border-[#667eea] focus:shadow-[0_0_0_3px_rgba(102,126,234,0.1)] text-gray-700 pr-10"
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

            {/* Open to Shift */}
            {/* <div>
              <label className="block text-gray-700 font-medium text-sm mb-2">
                Open to Shift
              </label>
              <div className="flex items-center mb-3">
                <Clock className="w-5 h-5 text-gray-400 mr-3" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 flex-grow">
                  {openToShift.map((shift) => (
                    <label
                      key={shift.value}
                      className={`flex items-center p-3 border rounded-xl cursor-pointer transition-all duration-200 ${
                        localFormData.openToShift.includes(shift.value)
                          ? "bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white border-transparent shadow-lg shadow-purple-500/30"
                          : "border-gray-300 hover:border-[#667eea] hover:bg-gradient-to-r hover:from-[#667eea]/5 hover:to-[#764ba2]/5"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={localFormData.openToShift.includes(shift.value)}
                        onChange={() => handleShiftChange(shift.value)}
                        className="hidden"
                      />
                      <div className={`w-4 h-4 mr-3 rounded border flex items-center justify-center ${
                        localFormData.openToShift.includes(shift.value)
                          ? "bg-white border-white"
                          : "border-gray-400"
                      }`}>
                        {localFormData.openToShift.includes(shift.value) && (
                          <svg className="w-3 h-3 text-[#667eea]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                      <span className="font-medium">{shift.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div> */}

            {/* Languages Known */}
            <div>
              <label className="block text-gray-700 font-medium text-sm mb-2">
                Languages Known
              </label>
              
              {/* Selected Languages Tags */}
              {localFormData.languagesKnown.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {localFormData.languagesKnown.map((language) => (
                    <div
                      key={language}
                      className="flex items-center bg-gradient-to-r from-[#e0e7ff]/20 to-[#c7d2fe]/20 border border-[#e0e7ff]/30 text-gray-700 rounded-full px-3 py-1.5 text-sm"
                    >
                      {language}
                      <button
                        type="button"
                        onClick={() => removeLanguage(language)}
                        className="ml-2 text-gray-500 hover:text-red-500 transition-colors"
                      >
                        <XIcon className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Languages Dropdown */}
              <div className="flex items-center">
                <Globe className="w-5 h-5 text-gray-400 mr-3" />
                <div className="relative flex-grow">
                  <select
                    onChange={handleLanguageSelect}
                    value=""
                    className="appearance-none w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:border-[#667eea] focus:shadow-[0_0_0_3px_rgba(102,126,234,0.1)] text-gray-700 pr-10"
                  >
                    <option value="" disabled>Select a language</option>
                    {languagesKnown.map(language => (
                      <option key={language} value={language}>{language}</option>
                    ))}
                  </select>
                  <ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>
              </div>
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