import React, { useState, useEffect } from "react";
import { ProgressIndicator } from "../ProgressIndicator"; // Assuming this path is correct
import { ChevronDownIcon } from "lucide-react";

// Sample options for the dropdowns
const experienceOptions = [
  "Less than 1 year",
  "1-3 years",
  "3-5 years",
  "5-8 years",
  "8-12 years",
  "12-15 years",
  "15+ years",
];

const noticePeriodOptions = [
  { value: 0, label: "Immediate" },
  { value: 15, label: "15 Days" },
  { value: 30, label: "1 Month" },
  { value: 45, label: "45 Days" },
  { value: 60, label: "2 Months" },
  { value: 90, label: "3 Months" },
];

export const ProfessionalDetailsStep = ({ onNext, onBack, formData, onChange }) => {
  // Local state for this form step
  const [localFormData, setLocalFormData] = useState({
    totalExperience: "",
    domainKnowledge: "",
    currentCompany: "",
    noticePeriod: "",
    servingNoticePeriod: false,
    noticePeriodStartDate: "",
  });

  // Effect to pre-populate the form if data already exists
  useEffect(() => {
    const updates = {};
    if (formData.totalExperience) updates.totalExperience = formData.totalExperience;
    if (formData.domainKnowledge) updates.domainKnowledge = formData.domainKnowledge;
    if (formData.currentCompany) updates.currentCompany = formData.currentCompany;
    if (formData.noticePeriod) updates.noticePeriod = formData.noticePeriod;
    if (formData.servingNoticePeriod) updates.servingNoticePeriod = formData.servingNoticePeriod;
    if (formData.noticePeriodStartDate) updates.noticePeriodStartDate = formData.noticePeriodStartDate;

    if (Object.keys(updates).length > 0) {
      setLocalFormData(prev => ({ ...prev, ...updates }));
    }
  }, [formData]);

  // Generic handler for most form inputs
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;

    setLocalFormData((prev) => ({
      ...prev,
      [name]: newValue,
      // Reset start date if checkbox is unchecked
      ...(name === "servingNoticePeriod" && !checked && { noticePeriodStartDate: "" }),
    }));
  };

  const handleNextClick = () => {
    onChange({ ...formData, ...localFormData });
    onNext();
  };
  
  // Function to calculate remaining days in the notice period
  const calculateRemainingDays = () => {
    if (!localFormData.servingNoticePeriod || !localFormData.noticePeriodStartDate || !localFormData.noticePeriod) {
      return null;
    }

    const noticePeriodInDays = parseInt(localFormData.noticePeriod, 10);
    const startDate = new Date(localFormData.noticePeriodStartDate);
    const today = new Date();
    
    // Set time to 0 to compare dates only
    startDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + noticePeriodInDays);

    if (today > endDate) {
      return "Notice period complete";
    }

    const diffTime = Math.abs(endDate - today);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return `${diffDays} day(s) remaining`;
  };

  const remainingDays = calculateRemainingDays();

  return (
    <div className="justify-center items-stretch bg-white z-0 flex min-w-60 flex-col w-[560px] my-auto p-12 max-md:max-w-full max-md:px-5">
      <ProgressIndicator currentStep={7} totalSteps={7} /> {/* Assuming this is the last step */}
      <div className="flex w-full flex-col items-stretch justify-center mt-8 max-md:max-w-full">
        <h2 className="text-[32px] font-bold leading-[42px] max-md:max-w-full">
          Your Professional Details
        </h2>
        <p className="text-base font-normal leading-6 mt-2 max-md:max-w-full">
          Provide your current employment and availability information.
        </p>

        <form className="w-full text-base font-normal mt-8 max-md:max-w-full">
          
          {/* Total Years of Experience */}
          <div className="w-full">
            <label htmlFor="totalExperience" className="block text-black mb-2">Total Years of Experience</label>
            <div className="relative">
              <select
                id="totalExperience"
                name="totalExperience"
                value={localFormData.totalExperience}
                onChange={handleChange}
                className="appearance-none bg-white flex min-h-12 w-full p-3 border border-gray-300 rounded"
              >
                <option value="" disabled>Select your experience range</option>
                {experienceOptions.map(exp => <option key={exp} value={exp}>{exp}</option>)}
              </select>
              <ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-6 h-6 pointer-events-none" />
            </div>
          </div>

          {/* Domain Knowledge */}
          <div className="w-full mt-6">
            <label htmlFor="domainKnowledge" className="block text-black mb-2">Domain Knowledge</label>
            <textarea
              id="domainKnowledge"
              name="domainKnowledge"
              rows="3"
              value={localFormData.domainKnowledge}
              onChange={handleChange}
              className="w-full p-3 mt-2 border border-gray-300 rounded"
              placeholder="e.g., FinTech, E-commerce, Healthcare, SaaS"
            />
          </div>

          {/* Current Company */}
          <div className="w-full mt-6">
            <label htmlFor="currentCompany" className="block text-black mb-2">Current Company</label>
            <input 
              id="currentCompany" 
              name="currentCompany" 
              type="text" 
              value={localFormData.currentCompany} 
              onChange={handleChange} 
              className="flex min-h-12 w-full mt-2 p-3 border border-gray-300 rounded" 
              placeholder="Enter your current employer's name"
            />
          </div>

          {/* Notice Period */}
          <div className="w-full mt-6">
            <label htmlFor="noticePeriod" className="block text-black mb-2">Notice Period</label>
            <div className="relative">
              <select
                id="noticePeriod"
                name="noticePeriod"
                value={localFormData.noticePeriod}
                onChange={handleChange}
                className="appearance-none bg-white flex min-h-12 w-full p-3 border border-gray-300 rounded"
              >
                <option value="" disabled>Select your notice period</option>
                {noticePeriodOptions.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
              </select>
              <ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-6 h-6 pointer-events-none" />
            </div>
          </div>
          
          {/* Serving Notice Period Checkbox and Date Input */}
          <div className="w-full mt-6">
             <div className="flex items-center gap-3">
               <input 
                id="servingNoticePeriod" 
                name="servingNoticePeriod" 
                type="checkbox"
                checked={localFormData.servingNoticePeriod}
                onChange={handleChange}
                className="h-4 w-4 rounded border-gray-300 text-black focus:ring-black"
                />
               <label htmlFor="servingNoticePeriod" className="text-black">Are you currently serving your notice period?</label>
            </div>
            
            {/* Conditional Fields: Start Date and Remaining Days */}
            {localFormData.servingNoticePeriod && (
              <div className="mt-4 pl-7">
                <label htmlFor="noticePeriodStartDate" className="block text-black mb-2">Notice Period Start Date</label>
                <input 
                  id="noticePeriodStartDate" 
                  name="noticePeriodStartDate" 
                  type="date" 
                  value={localFormData.noticePeriodStartDate} 
                  onChange={handleChange} 
                  className="flex min-h-12 w-full p-3 border border-gray-300 rounded"
                />
                {remainingDays && (
                   <p className="text-sm text-gray-600 mt-2">
                     {remainingDays}
                   </p>
                )}
              </div>
            )}
          </div>
          
          {/* Buttons */}
          <div className="flex gap-4 mt-8">
            <button type="button" onClick={onBack} className="px-6 py-3 border rounded-md">Back</button>
            <button type="button" onClick={handleNextClick} className="bg-black text-white px-6 py-3 border rounded-md">Next</button>
          </div>
        </form>
      </div>
    </div>
  );
};