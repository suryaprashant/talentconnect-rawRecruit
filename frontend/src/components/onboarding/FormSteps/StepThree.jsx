

import React, { useState } from "react";
import { ProgressIndicator } from "../ProgressIndicator";
import { ChevronDownIcon, UploadIcon } from "lucide-react";

export const StepThree = ({ onNext, onCancel, onBack = onCancel, formData, onChange }) => {
  //  Use correct field names matching the backend schema ---
  const [localFormData, setLocalFormData] = useState({
    college: formData.college || "",
    degree: formData.degree || "",
    semester: formData.semester || "",
    specialization: formData.specialization || "", // Corrected from fieldOfStudy
    cgpa: formData.cgpa || "",
    degreeCertificate: formData.degreeCertificate || null, // Corrected from certificate
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLocalFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      // --- FIX: Update the correct state key ---
      setLocalFormData((prev) => ({ ...prev, degreeCertificate: e.target.files[0] }));
    }
  };
  
  const handleNextClick = () => {
    onChange({ ...formData, ...localFormData });
    onNext();
  };

  return (
    <div className="justify-center items-stretch bg-white z-0 flex min-w-60 flex-col w-[560px] my-auto p-12 max-md:max-w-full max-md:px-5">
      <ProgressIndicator currentStep={3} totalSteps={5} />
      <div className="flex w-full flex-col items-stretch justify-center mt-8 max-md:max-w-full">
        <div className="w-full text-black max-md:max-w-full">
          <h2 className="text-[32px] font-bold leading-[42px] max-md:max-w-full">
            Let's add your educational background!
          </h2>
          <p className="text-base font-normal leading-6 mt-2 max-md:max-w-full">
            Provide your academic background to match with relevant job and
            internship opportunities. Employers consider this when shortlisting
            candidates.
          </p>
        </div>

        <form className="w-full text-base font-normal mt-8 max-md:max-w-full">
          {/* College/University */}
          <div className="w-full whitespace-nowrap max-md:max-w-full">
            <label htmlFor="college" className="block text-black max-md:max-w-full">
              College/University
            </label>
            <div className="relative">
              <select
                id="college"
                name="college"
                value={localFormData.college}
                onChange={handleChange}
                className="items-center appearance-none flex min-h-12 w-full gap-2 text-[#666] mt-2 p-3 max-md:max-w-full border border-gray-300 rounded"
              >
                <option value="" disabled>Placeholder</option>
                <option value="university1">University 1</option>
                <option value="university2">University 2</option>
                <option value="university3">University 3</option>
              </select>
              <ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-6 h-6 pointer-events-none" />
            </div>
          </div>

          <div className="flex w-full gap-6 mt-6 max-md:max-w-full">
            {/* Degree */}
            <div className="whitespace-nowrap flex-1 shrink basis-[0%]">
              <label htmlFor="degree" className="block text-black">Degree</label>
              <div className="relative">
                <select id="degree" name="degree" value={localFormData.degree} onChange={handleChange} className="items-center appearance-none bg-white flex min-h-12 w-full gap-2 text-[#666] mt-2 p-3 border border-gray-300 rounded">
                  <option value="" disabled>Placeholder</option>
                  <option value="bachelors">Bachelor's</option>
                  <option value="masters">Master's</option>
                  <option value="phd">PhD</option>
                </select>
                <ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-6 h-6 pointer-events-none" />
              </div>
            </div>
            {/* Current Semester */}
            <div className="flex-1 shrink basis-[0%]">
              <label htmlFor="semester" className="block text-black">Current Semester</label>
              <div className="relative">
                <select id="semester" name="semester" value={localFormData.semester} onChange={handleChange} className="items-center appearance-none bg-white flex min-h-12 w-full gap-2 text-[#666] whitespace-nowrap mt-2 p-3 border border-gray-300 rounded">
                  <option value="" disabled>Placeholder</option>
                  <option value="1">Semester 1</option>
                  <option value="2">Semester 2</option>
                  <option value="3">Semester 3</option>
                  <option value="4">Semester 4</option>
                  <option value="5">Semester 5</option>
                  <option value="6">Semester 6</option>
                  <option value="7">Semester 7</option>
                  <option value="8">Semester 8</option>
                </select>
                <ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-6 h-6 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Field of Study / Specialization */}
          <div className="w-full mt-6 max-md:max-w-full">
            <label htmlFor="specialization" className="block text-black max-md:max-w-full">
              Field of Study / Specialization
            </label>
            <div className="relative">
              {/* --- FIX: Use name="specialization" --- */}
              <select
                id="specialization"
                name="specialization"
                value={localFormData.specialization}
                onChange={handleChange}
                className="items-center appearance-none flex min-h-12 w-full gap-2 text-[#666] whitespace-nowrap mt-2 p-3 max-md:max-w-full border border-gray-300 rounded"
              >
                <option value="" disabled>Placeholder</option>
                <option value="computerScience">Computer Science</option>
                <option value="engineering">Engineering</option>
                <option value="business">Business</option>
                <option value="arts">Arts</option>
              </select>
              <ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-6 h-6 pointer-events-none" />
            </div>
          </div>
          
          {/* Current CGPA/Percentage */}
          <div className="w-full text-black mt-6 max-md:max-w-full">
            <label htmlFor="cgpa" className="block max-md:max-w-full">Current CGPA/Percentage</label>
            <input id="cgpa" name="cgpa" type="text" value={localFormData.cgpa} onChange={handleChange} className="flex min-h-12 w-full gap-2 mt-2 py-3 px-3 border border-gray-300 rounded" placeholder="Enter your CGPA or percentage" />
          </div>

          {/* Degree Certificate */}
          <div className="w-full mt-6 max-md:max-w-full">
            <label htmlFor="degreeCertificate" className="block text-black max-md:max-w-full">
              Degree Certificate (Optional)
            </label>
            <label className="items-center flex min-h-12 w-full gap-2 text-[#666] mt-2 p-3 max-md:max-w-full border border-gray-300 rounded cursor-pointer hover:bg-gray-50">
              <span className="self-stretch flex-1 shrink basis-[0%] my-auto">
                {localFormData.degreeCertificate ? localFormData.degreeCertificate.name : "Upload Degree Certificate"}
              </span>
              <UploadIcon className="self-stretch w-6 shrink-0 h-6 my-auto" />
              <input
                id="degreeCertificate"
                name="degreeCertificate"
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                className="hidden"
                onChange={handleFileChange}
              />
            </label>
          </div>

          {/* Buttons */}
          <div className="flex min-h-12 w-full gap-2.5 whitespace-nowrap mt-6 max-md:max-w-full">
            <div className="flex gap-4">
              <button type="button" onClick={onBack} className="self-stretch gap-2 text-black px-6 py-3 border rounded-md max-md:px-5 cursor-pointer">
                Back
              </button>
              <button type="button" onClick={handleNextClick} className="self-stretch bg-black gap-2 text-white px-6 py-3 border rounded-md max-md:px-5 cursor-pointer">
                Next
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

