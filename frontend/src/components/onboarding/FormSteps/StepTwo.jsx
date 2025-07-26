

// src/components/FormSteps/StepTwo.jsx
import React, { useEffect } from "react";
import { ProgressIndicator } from "../ProgressIndicator";
import { MailIcon, PhoneIcon, ChevronDownIcon } from "lucide-react";
import { useRole } from "@/context/RoleContext/RoleContext";

export const StepTwo = ({ onNext, onCancel, onProfileTypeSelect, formData, onChange }) => {
  const { selectedRole } = useRole();

  // This useEffect ensures that if selectedRole changes externally (e.g., from Welcome),
  // it updates the profileType in the formData prop.
  useEffect(() => {
    if (selectedRole && formData.profileType !== selectedRole) {
      onChange({ ...formData, profileType: selectedRole });
    }
  }, [selectedRole, formData.profileType, onChange]);

  // Generic handler for input fields (name, email, phone)
  const handleChange = (e) => {
    const { name, value } = e.target;
    onChange({ ...formData, [name]: value }); // Update parent's formData
  };

  // Specific handler for profileType select input
  const handleProfileTypeChange = (e) => {
    const selectedProfileType = e.target.value;
    onChange({ ...formData, profileType: selectedProfileType }); // Update parent's formData
    // Also update the role in context, if needed for other components
    if (onProfileTypeSelect) {
      onProfileTypeSelect(selectedProfileType);
    }
  };

  const handleNextClick = () => {
    // Basic client-side validation before proceeding to the next step
    if (!formData.email || !formData.phone || !formData.profileType) {
      alert("Please fill in all required fields: Email, Phone, and Profile Type.");
      return;
    }
    onNext();
  };

  return (
    <div className="justify-center items-stretch bg-white z-0 flex min-w-60 flex-col w-[560px] my-auto p-12 max-md:max-w-full max-md:px-5">
      <ProgressIndicator currentStep={2} totalSteps={5} />

      <div className="flex w-full flex-col items-stretch justify-center mt-8 max-md:max-w-full">
        <div className="w-full text-black max-md:max-w-full">
          <h2 className="text-[32px] font-bold leading-[42px] max-md:max-w-full">
            Basic Information
          </h2>
          <p className="text-base font-normal leading-6 mt-2 max-md:max-w-full">
            This information will be visible to recruiters.
          </p>
        </div>

        {/* Your Name Input */}
        <div className="w-full mt-6 max-md:max-w-full">
          <label htmlFor="name" className="text-black max-md:max-w-full block">
            Your Name
          </label>
          <div className="flex items-center min-h-12 w-full gap-2 text-[#666] mt-2 p-3 max-md:max-w-full border border-gray-300 rounded">
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Your Name"
              className="w-full bg-transparent border-none focus:outline-none"
              value={formData.name || ""} // Controlled component
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Email ID Input */}
        <div className="w-full mt-6 max-md:max-w-full">
          <label htmlFor="email" className="text-black max-md:max-w-full block">
            Email ID <span className="text-red-500">*</span>
          </label>
          <div className="flex items-center min-h-12 w-full gap-2 text-[#666] mt-2 p-3 max-md:max-w-full border border-gray-300 rounded">
            <MailIcon className="self-stretch w-6 shrink-0 h-6 my-auto" />
            <input
              type="email"
              id="email"
              name="email"
              placeholder="name@email.com"
              className="w-full bg-transparent border-none focus:outline-none"
              value={formData.email || ""} // Controlled component
              onChange={handleChange}
              required // HTML5 validation for frontend feedback
            />
          </div>
        </div>

        {/* Phone Number Input */}
        <div className="w-full mt-6 max-md:max-w-full">
          <label htmlFor="phone" className="text-black max-md:max-w-full block">
            Phone Number <span className="text-red-500">*</span>
          </label>
          <div className="flex items-center min-h-12 w-full gap-2 text-[#666] mt-2 p-3 max-md:max-w-full border border-gray-300 rounded">
            <PhoneIcon className="self-stretch w-6 shrink-0 h-6 my-auto" />
            <input
              type="tel" // Use type="tel" for phone numbers
              id="phone"
              name="phone"
              placeholder="e.g. +91 9876543210"
              className="w-full bg-transparent border-none focus:outline-none"
              value={formData.phone || ""} // Controlled component
              onChange={handleChange}
              required // HTML5 validation for frontend feedback
            />
          </div>
        </div>

        {/* Profile Type Select */}
        <div className="w-full mt-6 max-md:max-w-full relative">
          <label htmlFor="profileType" className="text-black max-md:max-w-full block">
            Profile Type <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <select
              id="profileType"
              name="profileType"
              value={formData.profileType || ""} // Controlled component
              onChange={handleProfileTypeChange}
              required // HTML5 validation for frontend feedback
              className="items-center appearance-none flex min-h-12 w-full gap-2 text-[#666] whitespace-nowrap mt-2 p-3 max-md:max-w-full border border-gray-300 rounded"
            >
              <option value="" disabled>
                Select
              </option>
              {/* IMPORTANT: Values must match backend enum exactly (case-sensitive) */}
              <option value="student">student</option>
              <option value="fresher">fresher</option>
              <option value="professional">professional</option>
            </select>
            <ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-6 h-6 pointer-events-none" />
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex min-h-12 w-full gap-2.5 whitespace-nowrap mt-6 max-md:max-w-full">
          <div className="flex gap-4">
            <button
              type="button"
              onClick={onCancel}
              className="self-stretch gap-2 text-black px-6 py-3 border rounded-md max-md:px-5 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleNextClick}
              className="self-stretch bg-black gap-2 text-white px-6 py-3 border rounded-md max-md:px-5 cursor-pointer"
              // Disable button if required fields are not filled
              disabled={!formData.email || !formData.phone || !formData.profileType}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};