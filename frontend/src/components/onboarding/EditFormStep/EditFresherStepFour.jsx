import React, { useState } from "react";
import { ProgressIndicator } from "../ProgressIndicator";
import { ChevronDownIcon } from "lucide-react";

export const EditFresherStepFour = ({ onNext, onBack, isEditable, setIsEditable }) => {
  const [formData, setFormData] = useState({
    industryType: [],
    jobRoles: [],
    locations: [],
    expectedSalary: "",
    salaryUnit: "USD",
    lookingFor: "internship",
    employmentType: "full-time",
    internshipCompany: "",
    jobRole: "",
    startDate: "",
    endDate: "",
    description: "",
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

  const handleAddExperience = () => {
    if (!isEditable) return;
    console.log("Add experience clicked");
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
            </select>
            <ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-6 h-6 pointer-events-none" />
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
                id="salaryUnit"
                name="salaryUnit"
                value={formData.salaryUnit}
                onChange={handleChange}
                disabled={!isEditable}
                className={`items-center appearance-none flex min-h-12 w-full gap-2 text-[#666] whitespace-nowrap p-3 border border-gray-300 rounded ${
                  !isEditable ? "bg-gray-100 cursor-not-allowed" : ""
                }`}
              >
                <option value="USD">USD</option>
                <option value="INR">INR</option>
                <option value="EUR">EUR</option>
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
                placeholder="Placeholder"
                className={`w-full min-h-12 p-3 border border-gray-300 rounded ${
                  !isEditable ? "bg-gray-100 cursor-not-allowed" : ""
                }`}
              />
            </div>
          </div>
        </div>

        <div className="w-full mt-6 max-md:max-w-full">
          <label className="block text-black max-md:max-w-full">
            Looking for
          </label>
          <div className="flex w-full gap-4 text-black whitespace-nowrap flex-wrap mt-2 max-md:max-w-full">
            <button
              type="button"
              className={`self-stretch gap-2 px-4 py-2 border rounded-md ${
                formData.lookingFor === "job" ? "bg-black text-white" : ""
              } ${!isEditable ? "cursor-not-allowed" : ""}`}
              onClick={() => handleRadioChange("lookingFor", "job")}
              disabled={!isEditable}
            >
              Job
            </button>
            <button
              type="button"
              className={`self-stretch gap-2 px-4 py-2 border rounded-md ${
                formData.lookingFor === "internship"
                  ? "bg-black text-white"
                  : ""
              } ${!isEditable ? "cursor-not-allowed" : ""}`}
              onClick={() => handleRadioChange("lookingFor", "internship")}
              disabled={!isEditable}
            >
              Internship
            </button>
            <button
              type="button"
              className={`self-stretch gap-2 px-4 py-2 border rounded-md ${
                formData.lookingFor === "both" ? "bg-black text-white" : ""
              } ${!isEditable ? "cursor-not-allowed" : ""}`}
              onClick={() => handleRadioChange("lookingFor", "both")}
              disabled={!isEditable}
            >
              Both
            </button>
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
          </div>
        </div>

        {/* Internships/Trainings section */}
        <div className="w-full mt-6 max-md:max-w-full">
          <label
            htmlFor="internshipCompany"
            className="block text-black max-md:max-w-full"
          >
            Internships/Trainings
          </label>
          <div className="relative">
            <select
              id="internshipCompany"
              name="internshipCompany"
              value={formData.internshipCompany}
              onChange={handleChange}
              disabled={!isEditable}
              className={`items-center appearance-none flex min-h-12 w-full gap-2 text-[#666] whitespace-nowrap mt-2 p-3 border border-gray-300 rounded ${
                !isEditable ? "bg-gray-100 cursor-not-allowed" : ""
              }`}
            >
              <option value="" disabled>
                Select Company
              </option>
              <option value="company1">Company 1</option>
              <option value="company2">Company 2</option>
              <option value="company3">Company 3</option>
            </select>
            <ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-6 h-6 pointer-events-none" />
          </div>
        </div>

        {/* Job Role */}
        <div className="w-full mt-6 max-md:max-w-full">
          <label
            htmlFor="jobRole"
            className="block text-black max-md:max-w-full"
          >
            Job Role
          </label>
          <div className="relative">
            <select
              id="jobRole"
              name="jobRole"
              value={formData.jobRole}
              onChange={handleChange}
              disabled={!isEditable}
              className={`items-center appearance-none flex min-h-12 w-full gap-2 text-[#666] whitespace-nowrap mt-2 p-3 border border-gray-300 rounded ${
                !isEditable ? "bg-gray-100 cursor-not-allowed" : ""
              }`}
            >
              <option value="" disabled>
                Placeholder
              </option>
              <option value="developer">Software Developer</option>
              <option value="designer">UI/UX Designer</option>
              <option value="manager">Project Manager</option>
              <option value="analyst">Data Analyst</option>
            </select>
            <ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-6 h-6 pointer-events-none" />
          </div>
        </div>

        {/* Date Range */}
        <div className="flex w-full gap-6 mt-6 max-md:max-w-full">
          <div className="whitespace-nowrap flex-1 shrink basis-[0%]">
            <label htmlFor="startDate" className="block text-black">
              Start Date
            </label>
            <div className="relative">
              <select
                id="startDate"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                disabled={!isEditable}
                className={`items-center appearance-none bg-white flex min-h-12 w-full gap-2 text-[#666] mt-2 p-3 border border-gray-300 rounded ${
                  !isEditable ? "bg-gray-100 cursor-not-allowed" : ""
                }`}
              >
                <option value="" disabled>
                  Placeholder
                </option>
                <option value="jan2025">Jan 2025</option>
                <option value="feb2025">Feb 2025</option>
                <option value="mar2025">Mar 2025</option>
              </select>
              <ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-6 h-6 pointer-events-none" />
            </div>
          </div>

          <div className="flex-1 shrink basis-[0%]">
            <label htmlFor="endDate" className="block text-black">
              End Date
            </label>
            <div className="relative">
              <select
                id="endDate"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                disabled={!isEditable}
                className={`items-center appearance-none bg-white flex min-h-12 w-full gap-2 text-[#666] whitespace-nowrap mt-2 p-3 border border-gray-300 rounded ${
                  !isEditable ? "bg-gray-100 cursor-not-allowed" : ""
                }`}
              >
                <option value="" disabled>
                  Placeholder
                </option>
                <option value="jan2026">Jan 2026</option>
                <option value="feb2026">Feb 2026</option>
                <option value="mar2026">Mar 2026</option>
              </select>
              <ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-6 h-6 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="w-full mt-6 max-md:max-w-full">
          <label
            htmlFor="description"
            className="block text-black max-md:max-w-full"
          >
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            disabled={!isEditable}
            className={`flex min-h-24 w-full gap-2 text-[#666] mt-2 p-3 border border-gray-300 rounded ${
              !isEditable ? "bg-gray-100 cursor-not-allowed" : ""
            }`}
            placeholder="Describe your role..."
          ></textarea>
        </div>

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
      </form>
    </div>
  );
};