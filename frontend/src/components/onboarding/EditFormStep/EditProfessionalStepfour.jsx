import React, { useState } from "react";
import { ChevronDownIcon, UploadIcon } from "lucide-react";

export const EditProfessionalStepFour = ({ onNext, onBack, isEditable, setIsEditable }) => {
  const [formData, setFormData] = useState({
    industryType: [],
    jobRoles: [],
    locations: [],
    currentSalary: "",
    salaryCurrency: "USD",
    expectedSalary: "",
    expectedSalaryCurrency: "USD",
    employmentType: "full-time",
    workExperiences: [
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
    if (!isEditable) return;
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (e) => {
    if (!isEditable) return;
    const { name, options } = e.target;
    const selectedOptions = Array.from(options)
      .filter(option => option.selected)
      .map(option => option.value);
    setFormData(prev => ({ ...prev, [name]: selectedOptions }));
  };

  const handleRadioChange = (field, value) => {
    if (!isEditable) return;
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleExperienceChange = (index, field, value) => {
    if (!isEditable) return;
    const updatedExperiences = [...formData.workExperiences];
    updatedExperiences[index] = {
      ...updatedExperiences[index],
      [field]: value,
    };
    setFormData((prev) => ({
      ...prev,
      workExperiences: updatedExperiences,
    }));
  };

  const handleFileChange = (index, e) => {
    if (!isEditable) return;
    if (e.target.files && e.target.files[0]) {
      handleExperienceChange(index, "certificate", e.target.files[0]);
    }
  };

  const handleAddExperience = () => {
    if (!isEditable) return;
    setFormData((prev) => ({
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
    if (!isEditable) return;
    if (formData.workExperiences.length > 1) {
      const updatedExperiences = [...formData.workExperiences];
      updatedExperiences.splice(index, 1);
      setFormData((prev) => ({
        ...prev,
        workExperiences: updatedExperiences,
      }));
    }
  };

  return (
    <div className="w-full">
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
              disabled={!isEditable}
              onChange={handleSelectChange}
              className={`items-center appearance-none flex min-h-12 w-full gap-2 text-[#666] whitespace-nowrap mt-2 p-3 max-md:max-w-full border border-gray-300 rounded ${
                !isEditable ? "bg-gray-100 cursor-not-allowed" : ""
              }`}
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
              disabled={!isEditable}
              onChange={handleSelectChange}
              className={`items-center appearance-none flex min-h-12 w-full gap-2 text-[#666] whitespace-nowrap mt-2 p-3 max-md:max-w-full border border-gray-300 rounded ${
                !isEditable ? "bg-gray-100 cursor-not-allowed" : ""
              }`}
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
              disabled={!isEditable}
              onChange={handleSelectChange}
              className={`items-center appearance-none flex min-h-12 w-full gap-2 text-[#666] whitespace-nowrap mt-2 p-3 max-md:max-w-full border border-gray-300 rounded ${
                !isEditable ? "bg-gray-100 cursor-not-allowed" : ""
              }`}
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
                value={formData.salaryCurrency}
                onChange={handleChange}
                disabled={!isEditable}
                className={`items-center appearance-none flex min-h-12 w-full gap-2 text-[#666] whitespace-nowrap p-3 border border-gray-300 rounded ${
                  !isEditable ? "bg-gray-100 cursor-not-allowed" : ""
                }`}
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
                value={formData.currentSalary}
                onChange={handleChange}
                disabled={!isEditable}
                placeholder="Enter current salary"
                className={`w-full min-h-12 p-3 border border-gray-300 rounded ${
                  !isEditable ? "bg-gray-100 cursor-not-allowed" : ""
                }`}
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
                value={formData.expectedSalaryCurrency}
                onChange={handleChange}
                disabled={!isEditable}
                className={`items-center appearance-none flex min-h-12 w-full gap-2 text-[#666] whitespace-nowrap p-3 border border-gray-300 rounded ${
                  !isEditable ? "bg-gray-100 cursor-not-allowed" : ""
                }`}
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
                value={formData.expectedSalary}
                onChange={handleChange}
                disabled={!isEditable}
                placeholder="Enter expected salary"
                className={`w-full min-h-12 p-3 border border-gray-300 rounded ${
                  !isEditable ? "bg-gray-100 cursor-not-allowed" : ""
                }`}
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
                formData.employmentType === "part-time"
                  ? "bg-black text-white"
                  : ""
              } ${!isEditable ? "cursor-not-allowed" : ""}`}
              onClick={() => handleRadioChange("employmentType", "part-time")}
              disabled={!isEditable}
            >
              Part-time
            </button>
            <button
              type="button"
              className={`self-stretch gap-2 px-4 py-2 border rounded-md ${
                formData.employmentType === "full-time"
                  ? "bg-black text-white"
                  : ""
              } ${!isEditable ? "cursor-not-allowed" : ""}`}
              onClick={() => handleRadioChange("employmentType", "full-time")}
              disabled={!isEditable}
            >
              Full-time
            </button>
            <button
              type="button"
              className={`self-stretch gap-2 px-4 py-2 border rounded-md ${
                formData.employmentType === "contract"
                  ? "bg-black text-white"
                  : ""
              } ${!isEditable ? "cursor-not-allowed" : ""}`}
              onClick={() => handleRadioChange("employmentType", "contract")}
              disabled={!isEditable}
            >
              Contract
            </button>
            <button
              type="button"
              className={`self-stretch gap-2 px-4 py-2 border rounded-md ${
                formData.employmentType === "freelance"
                  ? "bg-black text-white"
                  : ""
              } ${!isEditable ? "cursor-not-allowed" : ""}`}
              onClick={() => handleRadioChange("employmentType", "freelance")}
              disabled={!isEditable}
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

          {formData.workExperiences.map((experience, index) => (
            <div key={index} className="mt-6 p-4 border border-gray-200 rounded-md">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-medium">Experience {index + 1}</h4>
                {formData.workExperiences.length > 1 && (
                  <button 
                    type="button" 
                    onClick={() => handleRemoveExperience(index)}
                    disabled={!isEditable}
                    className={`text-red-500 text-sm ${
                      !isEditable ? "cursor-not-allowed opacity-50" : ""
                    }`}
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
                    disabled={!isEditable}
                    className={`items-center appearance-none flex min-h-12 w-full gap-2 text-[#666] whitespace-nowrap p-3 border border-gray-300 rounded ${
                      !isEditable ? "bg-gray-100 cursor-not-allowed" : ""
                    }`}
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
                    disabled={!isEditable}
                    className={`items-center appearance-none flex min-h-12 w-full gap-2 text-[#666] whitespace-nowrap p-3 border border-gray-300 rounded ${
                      !isEditable ? "bg-gray-100 cursor-not-allowed" : ""
                    }`}
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
                      disabled={!isEditable}
                      className={`items-center appearance-none flex min-h-12 w-full gap-2 text-[#666] whitespace-nowrap p-3 border border-gray-300 rounded ${
                        !isEditable ? "bg-gray-100 cursor-not-allowed" : ""
                      }`}
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
                      disabled={!isEditable}
                      className={`items-center appearance-none flex min-h-12 w-full gap-2 text-[#666] whitespace-nowrap p-3 border border-gray-300 rounded ${
                        !isEditable ? "bg-gray-100 cursor-not-allowed" : ""
                      }`}
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
                  disabled={!isEditable}
                  className={`flex min-h-24 w-full gap-2 text-[#666] p-3 border border-gray-300 rounded ${
                    !isEditable ? "bg-gray-100 cursor-not-allowed" : ""
                  }`}
                  placeholder="Describe your responsibilities and achievements..."
                ></textarea>
              </div>

              {/* Certificate Upload */}
              <div>
                <label className="block text-black mb-1">Experience Certificate (Optional)</label>
                <label className={`flex items-center justify-between p-3 border border-gray-300 rounded ${
                  isEditable ? "cursor-pointer hover:bg-gray-50" : "cursor-not-allowed bg-gray-100"
                }`}>
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
                    disabled={!isEditable}
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
              disabled={!isEditable}
              className={`text-blue-600 ${
                isEditable ? "cursor-pointer" : "cursor-not-allowed opacity-50"
              }`}
            >
              Add experience +
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};