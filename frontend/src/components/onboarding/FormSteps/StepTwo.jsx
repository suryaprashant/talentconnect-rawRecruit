import React, { useState, useEffect } from "react";
import { ProgressIndicator } from "../ProgressIndicator";
import { MailIcon, PhoneIcon, ChevronDownIcon } from "lucide-react";
import { useRole } from "@/context/RoleContext/RoleContext";

export const StepTwo = ({ onNext, onCancel, onProfileTypeSelect }) => {
  const { selectedRole } = useRole();
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    profileType: selectedRole || "", // Initialize with the value from context/localStorage
  });

  // If there's a role already in context/localStorage, update the form
  useEffect(() => {
    if (selectedRole) {
      setFormData(prev => ({ ...prev, profileType: selectedRole }));
    }
  }, [selectedRole]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfileTypeChange = (e) => {
    const selectedProfileType = e.target.value;
    setFormData((prev) => ({ ...prev, profileType: selectedProfileType }));
    
    // Call the parent function to update the selected role in context
    if (onProfileTypeSelect) {
      onProfileTypeSelect(selectedProfileType);
    }
  };

  const handleNextClick = () => {
    // Ensure profile type is set in context before proceeding
    if (onProfileTypeSelect && formData.profileType) {
      onProfileTypeSelect(formData.profileType);
    }
    onNext();
  };

  return (
    <div className="justify-center items-stretch bg-white z-0 flex min-w-60 flex-col w-[560px] my-auto p-12 max-md:max-w-full max-md:px-5">
      <ProgressIndicator currentStep={2} totalSteps={5} />

      <div className="flex w-full flex-col items-stretch justify-center mt-8 max-md:max-w-full">
        <div className="w-full text-black max-md:max-w-full">
          <h2 className="text-[32px] font-bold leading-[42px] max-md:max-w-full">
            Let's begin by sharing some basic details!
          </h2>
          <p className="text-base font-normal leading-6 mt-2 max-md:max-w-full">
            Tell us a bit about yourself. This helps employers get to know you
            better and ensures a smooth job application process.
          </p>
        </div>

        <form className="w-full text-base font-normal mt-8 max-md:max-w-full">
          <div className="w-full text-black max-md:max-w-full mb-6">
            <label htmlFor="name" className="block max-md:max-w-full">
              Enter your name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              className="flex min-h-12 w-full gap-2 mt-2 py-3 px-3 border border-gray-300 rounded"
            />
          </div>

          <div className="w-full mt-6 max-md:max-w-full">
            <label
              htmlFor="email"
              className="block text-black max-md:max-w-full"
            >
              Enter your email *
            </label>
            <div className="items-center bg-white flex w-full gap-3 text-[#666] whitespace-nowrap mt-2 p-3 max-md:max-w-full border border-gray-300 rounded">
              <MailIcon className="aspect-[1] w-6 self-stretch shrink-0 my-auto" />
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="self-stretch flex-1 shrink basis-[0%] my-auto outline-none"
                required
              />
            </div>
          </div>

          <div className="w-full mt-6 max-md:max-w-full">
            <label
              htmlFor="phone"
              className="block text-black max-md:max-w-full"
            >
              Enter your mobile no. *
            </label>
            <div className="items-center bg-white flex w-full gap-3 text-[#666] whitespace-nowrap mt-2 p-3 max-md:max-w-full border border-gray-300 rounded">
              <PhoneIcon className="self-stretch w-6 shrink-0 h-6 my-auto" />
              <input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                className="self-stretch flex-1 shrink basis-[0%] my-auto outline-none"
                required
              />
            </div>
          </div>

          <div className="w-full mt-6 max-md:max-w-full">
            <label
              htmlFor="profileType"
              className="block text-black max-md:max-w-full"
            >
              Select Your Profile Type
            </label>
            <div className="relative">
              <select
                id="profileType"
                name="profileType"
                value={formData.profileType}
                onChange={handleProfileTypeChange}
                className="items-center appearance-none flex min-h-12 w-full gap-2 text-[#666] whitespace-nowrap mt-2 p-3 max-md:max-w-full border border-gray-300 rounded"
              >
                <option value="" disabled>
                  Select
                </option>
                <option value="student">Student</option>
                <option value="fresher">Fresher</option>
                <option value="professional">Professional</option>
              </select>
              <ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-6 h-6 pointer-events-none" />
            </div>
          </div>

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
                disabled={!formData.profileType} // Disable button if no role is selected
              >
                Next
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};