import React, { useState } from "react";
import { ProgressIndicator } from "../ProgressIndicator";
import { ChevronDownIcon, UploadIcon } from "lucide-react";

export const ProfessionalStepFour = ({ onNext, onBack, formData, onChange }) => {
  const [localFormData, setLocalFormData] = useState({
    industryType: formData?.industryType || [],
    jobRoles: formData?.jobRoles || [],
    locations: formData?.locations || [],
    currentSalary: formData?.currentSalary || "",
    salaryCurrency: formData?.salaryCurrency || "USD",
    expectedSalary: formData?.expectedSalary || "",
    expectedSalaryCurrency: formData?.expectedSalaryCurrency || "USD",
    employmentType: formData?.employmentType || "full-time",
    workExperiences: formData?.workExperiences || [
      {
        company: "",
        jobRole: "",
        startDate: "",
        endDate: "",
        description: "",
        certificate: null,
      },
    ],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLocalFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRadioChange = (field, value) => {
    setLocalFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleExperienceChange = (index, field, value) => {
    const updatedExperiences = [...localFormData.workExperiences];
    updatedExperiences[index] = {
      ...updatedExperiences[index],
      [field]: value,
    };
    setLocalFormData((prev) => ({
      ...prev,
      workExperiences: updatedExperiences,
    }));
  };

  const handleFileChange = (index, e) => {
    if (e.target.files && e.target.files[0]) {
      handleExperienceChange(index, "certificate", e.target.files[0]);
    }
  };

  const handleAddExperience = () => {
    setLocalFormData((prev) => ({
      ...prev,
      workExperiences: [
        ...prev.workExperiences,
        {
          company: "",
          jobRole: "",
          startDate: "",
          endDate: "",
          description: "",
          certificate: null,
        },
      ],
    }));
  };

  const handleRemoveExperience = (index) => {
    if (localFormData.workExperiences.length > 1) {
      const updatedExperiences = [...localFormData.workExperiences];
      updatedExperiences.splice(index, 1);
      setLocalFormData((prev) => ({
        ...prev,
        workExperiences: updatedExperiences,
      }));
    }
  };

  const handleNext = () => {
    onChange(localFormData);
    onNext();
  };

  return (
    <div className="justify-center items-stretch bg-white z-0 flex min-w-60 flex-col w-[560px] my-auto p-12 max-md:max-w-full max-md:px-5">
      <ProgressIndicator currentStep={4} totalSteps={5} />

      <div className="flex w-full flex-col items-stretch justify-center mt-8 max-md:max-w-full">
        <div className="w-full text-black max-md:max-w-full">
          <h2 className="text-[32px] font-bold leading-[42px] max-md:max-w-full">
            Awesome! Let's define your career goals and skills!
          </h2>
          <p className="text-base font-normal leading-6 mt-2 max-md:max-w-full">
            Let us know your job interests, experience, and preferred locations so we can
            recommend the best opportunities for you.
          </p>
        </div>

        <form className="w-full text-base font-normal mt-8 max-md:max-w-full">
          <div className="w-full max-md:max-w-full">
            <label
              htmlFor="industryType"
              className="block text-black max-md:max-w-full"
            >
              Interested Industry Type
            </label>
            <div className="relative">
              <select
                id="industryType"
                name="industryType"
                multiple
                className="items-center appearance-none flex min-h-12 w-full gap-2 text-[#666] whitespace-nowrap mt-2 p-3 max-md:max-w-full border border-gray-300 rounded"
              >
                <option value="" disabled>
                  Multiple-select
                </option>
                <option value="technology">Technology</option>
                <option value="finance">Finance</option>
                <option value="healthcare">Healthcare</option>
                <option value="education">Education</option>
                <option value="manufacturing">Manufacturing</option>
                <option value="consulting">Consulting</option>
                <option value="retail">Retail</option>
              </select>
              <ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-6 h-6 pointer-events-none" />
            </div>
          </div>

          <div className="w-full mt-6 max-md:max-w-full">
            <label
              htmlFor="jobRoles"
              className="block text-black max-md:max-w-full"
            >
              Interested Job Roles
            </label>
            <div className="relative">
              <select
                id="jobRoles"
                name="jobRoles"
                multiple
                className="items-center appearance-none flex min-h-12 w-full gap-2 text-[#666] whitespace-nowrap mt-2 p-3 max-md:max-w-full border border-gray-300 rounded"
              >
                <option value="" disabled>
                  Multiple-select
                </option>
                <option value="developer">Software Developer</option>
                <option value="designer">UI/UX Designer</option>
                <option value="manager">Project Manager</option>
                <option value="analyst">Data Analyst</option>
                <option value="marketing">Marketing Specialist</option>
                <option value="engineer">Software Engineer</option>
                <option value="architect">Solution Architect</option>
                <option value="executive">Executive</option>
              </select>
              <ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-6 h-6 pointer-events-none" />
            </div>
          </div>

          <div className="w-full mt-6 max-md:max-w-full">
            <label
              htmlFor="locations"
              className="block text-black max-md:max-w-full"
            >
              Preferred Job Locations
            </label>
            <div className="relative">
              <select
                id="locations"
                name="locations"
                multiple
                className="items-center appearance-none flex min-h-12 w-full gap-2 text-[#666] whitespace-nowrap mt-2 p-3 max-md:max-w-full border border-gray-300 rounded"
              >
                <option value="" disabled>
                  Multiple-select
                </option>
                <option value="bangalore">Bangalore</option>
                <option value="mumbai">Mumbai</option>
                <option value="delhi">Delhi</option>
                <option value="hyderabad">Hyderabad</option>
                <option value="pune">Pune</option>
                <option value="remote">Remote</option>
                <option value="chennai">Chennai</option>
                <option value="kolkata">Kolkata</option>
              </select>
              <ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-6 h-6 pointer-events-none" />
            </div>
          </div>

          {/* Current Salary */}
          <div className="w-full mt-6 max-md:max-w-full">
            <label
              htmlFor="currentSalary"
              className="block text-black max-md:max-w-full"
            >
              Current Salary
            </label>
            <div className="flex items-center gap-2 mt-2">
              <div className="relative w-24">
                <select
                  id="salaryCurrency"
                  name="salaryCurrency"
                  value={localFormData.salaryCurrency}
                  onChange={handleChange}
                  className="items-center appearance-none flex min-h-12 w-full gap-2 text-[#666] whitespace-nowrap p-3 border border-gray-300 rounded"
                >
                  <option value="USD">USD</option>
                  <option value="INR">INR</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                </select>
                <ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 pointer-events-none" />
              </div>
              <div className="flex-1">
                <input
                  id="currentSalary"
                  name="currentSalary"
                  type="text"
                  value={localFormData.currentSalary}
                  onChange={handleChange}
                  placeholder="Enter current salary"
                  className="w-full min-h-12 p-3 border border-gray-300 rounded"
                />
              </div>
            </div>
          </div>

          {/* Expected Salary */}
          <div className="w-full mt-6 max-md:max-w-full">
            <label
              htmlFor="expectedSalary"
              className="block text-black max-md:max-w-full"
            >
              Expected Salary
            </label>
            <div className="flex items-center gap-2 mt-2">
              <div className="relative w-24">
                <select
                  id="expectedSalaryCurrency"
                  name="expectedSalaryCurrency"
                  value={localFormData.expectedSalaryCurrency}
                  onChange={handleChange}
                  className="items-center appearance-none flex min-h-12 w-full gap-2 text-[#666] whitespace-nowrap p-3 border border-gray-300 rounded"
                >
                  <option value="USD">USD</option>
                  <option value="INR">INR</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                </select>
                <ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 pointer-events-none" />
              </div>
              <div className="flex-1">
                <input
                  id="expectedSalary"
                  name="expectedSalary"
                  type="text"
                  value={localFormData.expectedSalary}
                  onChange={handleChange}
                  placeholder="Enter expected salary"
                  className="w-full min-h-12 p-3 border border-gray-300 rounded"
                />
              </div>
            </div>
          </div>

          <div className="w-full mt-6 max-md:max-w-full">
            <label className="block text-black max-md:max-w-full">
              Employment type
            </label>
            <div className="flex w-full gap-4 text-black whitespace-nowrap flex-wrap mt-2 max-md:max-w-full">
              <button
                type="button"
                className={`self-stretch gap-2 px-4 py-2 border rounded-md ${
                  localFormData.employmentType === "part-time"
                    ? "bg-black text-white"
                    : ""
                }`}
                onClick={() => handleRadioChange("employmentType", "part-time")}
              >
                Part-time
              </button>
              <button
                type="button"
                className={`self-stretch gap-2 px-4 py-2 border rounded-md ${
                  localFormData.employmentType === "full-time"
                    ? "bg-black text-white"
                    : ""
                }`}
                onClick={() => handleRadioChange("employmentType", "full-time")}
              >
                Full-time
              </button>
              <button
                type="button"
                className={`self-stretch gap-2 px-4 py-2 border rounded-md ${
                  localFormData.employmentType === "contract"
                    ? "bg-black text-white"
                    : ""
                }`}
                onClick={() => handleRadioChange("employmentType", "contract")}
              >
                Contract
              </button>
              <button
                type="button"
                className={`self-stretch gap-2 px-4 py-2 border rounded-md ${
                  localFormData.employmentType === "freelance"
                    ? "bg-black text-white"
                    : ""
                }`}
                onClick={() => handleRadioChange("employmentType", "freelance")}
              >
                Freelance
              </button>
            </div>
          </div>

          {/* Work Experience Section */}
          <div className="w-full mt-8 max-md:max-w-full">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-black">Work Experience</h3>
            </div>

            {localFormData.workExperiences.map((experience, index) => (
              <div key={index} className="mt-6 p-4 border border-gray-200 rounded-md">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-medium">Experience {index + 1}</h4>
                  {localFormData.workExperiences.length > 1 && (
                    <button 
                      type="button" 
                      onClick={() => handleRemoveExperience(index)}
                      className="text-red-500 text-sm"
                    >
                      Remove
                    </button>
                  )}
                </div>

                {/* Company */}
                <div className="mb-4">
                  <label className="block text-black mb-1">Company</label>
                  <div className="relative">
                    <select
                      value={experience.company}
                      onChange={(e) => handleExperienceChange(index, "company", e.target.value)}
                      className="items-center appearance-none flex min-h-12 w-full gap-2 text-[#666] whitespace-nowrap p-3 border border-gray-300 rounded"
                    >
                      <option value="" disabled>Select Company</option>
                      <option value="company1">Company 1</option>
                      <option value="company2">Company 2</option>
                      <option value="company3">Company 3</option>
                      <option value="other">Other</option>
                    </select>
                    <ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-6 h-6 pointer-events-none" />
                  </div>
                </div>

                {/* Job Role */}
                <div className="mb-4">
                  <label className="block text-black mb-1">Job Role</label>
                  <div className="relative">
                    <select
                      value={experience.jobRole}
                      onChange={(e) => handleExperienceChange(index, "jobRole", e.target.value)}
                      className="items-center appearance-none flex min-h-12 w-full gap-2 text-[#666] whitespace-nowrap p-3 border border-gray-300 rounded"
                    >
                      <option value="" disabled>Select Role</option>
                      <option value="developer">Software Developer</option>
                      <option value="designer">UI/UX Designer</option>
                      <option value="manager">Project Manager</option>
                      <option value="analyst">Data Analyst</option>
                      <option value="other">Other</option>
                    </select>
                    <ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-6 h-6 pointer-events-none" />
                  </div>
                </div>

                {/* Date Range */}
                <div className="flex gap-4 mb-4">
                  <div className="flex-1">
                    <label className="block text-black mb-1">Start Date</label>
                    <div className="relative">
                      <select
                        value={experience.startDate}
                        onChange={(e) => handleExperienceChange(index, "startDate", e.target.value)}
                        className="items-center appearance-none flex min-h-12 w-full gap-2 text-[#666] whitespace-nowrap p-3 border border-gray-300 rounded"
                      >
                        <option value="" disabled>Select Date</option>
                        <option value="jan2020">Jan 2020</option>
                        <option value="feb2020">Feb 2020</option>
                        <option value="mar2020">Mar 2020</option>
                        <option value="apr2020">Apr 2020</option>
                        <option value="may2020">May 2020</option>
                      </select>
                      <ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-6 h-6 pointer-events-none" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <label className="block text-black mb-1">End Date</label>
                    <div className="relative">
                      <select
                        value={experience.endDate}
                        onChange={(e) => handleExperienceChange(index, "endDate", e.target.value)}
                        className="items-center appearance-none flex min-h-12 w-full gap-2 text-[#666] whitespace-nowrap p-3 border border-gray-300 rounded"
                      >
                        <option value="" disabled>Select Date</option>
                        <option value="present">Present</option>
                        <option value="jan2025">Jan 2025</option>
                        <option value="feb2025">Feb 2025</option>
                        <option value="mar2025">Mar 2025</option>
                        <option value="apr2025">Apr 2025</option>
                        <option value="may2025">May 2025</option>
                      </select>
                      <ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-6 h-6 pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="mb-4">
                  <label className="block text-black mb-1">Description</label>
                  <textarea
                    value={experience.description}
                    onChange={(e) => handleExperienceChange(index, "description", e.target.value)}
                    className="flex min-h-24 w-full gap-2 text-[#666] p-3 border border-gray-300 rounded"
                    placeholder="Describe your responsibilities and achievements..."
                  ></textarea>
                </div>

                {/* Certificate Upload */}
                <div>
                  <label className="block text-black mb-1">Experience Certificate (Optional)</label>
                  <label className="flex items-center justify-between p-3 border border-gray-300 rounded cursor-pointer hover:bg-gray-50">
                    <span className="text-[#666] truncate">
                      {experience.certificate
                        ? typeof experience.certificate === 'string'
                          ? experience.certificate
                          : experience.certificate.name
                        : "Upload Experience Certificate"}
                    </span>
                    <UploadIcon className="w-5 h-5 text-gray-500" />
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      className="hidden"
                      onChange={(e) => handleFileChange(index, e)}
                    />
                  </label>
                </div>
              </div>
            ))}

            {/* Add Experience Button */}
            <div className="flex justify-end mt-4">
              <button
                type="button"
                onClick={handleAddExperience}
                className="text-blue-600 cursor-pointer"
              >
                Add experience +
              </button>
            </div>
          </div>

          <div className="flex min-h-12 w-full gap-2.5 whitespace-nowrap mt-8 max-md:max-w-full">
            <div className="flex gap-4">
              <button
                type="button"
                onClick={onBack}
                className="self-stretch gap-2 text-black px-6 py-3 border rounded-md max-md:px-5 cursor-pointer"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="self-stretch bg-black gap-2 text-white px-6 py-3 border rounded-md max-md:px-5 cursor-pointer"
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