import React, { useState } from "react";
import { ProgressIndicator } from "../ProgressIndicator";
import { ChevronDownIcon } from "lucide-react";

export const FresherStepFour = ({ onNext, onBack }) => {
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

  const [dropdownOpen, setDropdownOpen] = useState({
    industryType: false,
    jobRoles: false,
    locations: false,
  });

  const toggleDropdown = (field) => {
    setDropdownOpen((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleSelect = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter((v) => v !== value)
        : [...prev[field], value],
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRadioChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddExperience = () => {
    console.log("Add experience clicked");
  };

  const renderCustomDropdown = (field, options, label) => (
    <div className="w-full mt-6 max-md:max-w-full">
      <label className="block text-black max-md:max-w-full">{label}</label>
      <div className="relative mt-2">
        <div
          className="flex justify-between items-center min-h-12 w-full p-3 border border-gray-300 rounded cursor-pointer text-[#666]"
          onClick={() => toggleDropdown(field)}
        >
          <span>
            {formData[field].length > 0
              ? formData[field].join(", ")
              : `Select ${label.toLowerCase()}`}
          </span>
          <ChevronDownIcon className="w-6 h-6" />
        </div>
        {dropdownOpen[field] && (
          <ul className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded shadow-md max-h-60 overflow-y-auto">
            {options.map((option) => (
              <li
                key={option}
                onClick={() => handleSelect(field, option)}
                className={`p-2 hover:bg-gray-100 cursor-pointer ${
                  formData[field].includes(option) ? "bg-gray-200" : ""
                }`}
              >
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );

  return (
    <div className="justify-center items-stretch bg-white z-0 flex min-w-60 flex-col w-[560px] my-auto p-12 max-md:max-w-full max-md:px-5">
      <ProgressIndicator currentStep={4} totalSteps={5} />

      <div className="flex w-full flex-col items-stretch justify-center mt-8 max-md:max-w-full">
        <div className="w-full text-black max-md:max-w-full">
          <h2 className="text-[32px] font-bold leading-[42px] max-md:max-w-full">
            Awesome! Let's define your career goals and skills!
          </h2>
          <p className="text-base font-normal leading-6 mt-2 max-md:max-w-full">
            Let us know your job interests and preferred locations so we can
            recommend the best opportunities for you.
          </p>
        </div>

        <form className="w-full text-base font-normal mt-8 max-md:max-w-full">
          {renderCustomDropdown("industryType", [
            "technology",
            "finance",
            "healthcare",
            "education",
            "manufacturing",
          ], "Interested Industry Type")}

          {renderCustomDropdown("jobRoles", [
            "developer",
            "designer",
            "manager",
            "analyst",
            "marketing",
          ], "Interested Job Roles")}

          {renderCustomDropdown("locations", [
            "bangalore",
            "mumbai",
            "delhi",
            "hyderabad",
            "pune",
            "remote",
          ], "Preferred Job Locations")}

          {/* Expected Salary */}
          <div className="w-full mt-6 max-md:max-w-full">
            <label htmlFor="expectedSalary" className="block text-black">
              Expected Salary
            </label>
            <div className="flex items-center gap-2 mt-2">
              <div className="relative w-24">
                <select
                  id="salaryUnit"
                  name="salaryUnit"
                  value={formData.salaryUnit}
                  onChange={handleChange}
                  className="items-center appearance-none flex min-h-12 w-full gap-2 text-[#666] whitespace-nowrap p-3 border border-gray-300 rounded"
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
                  placeholder="Placeholder"
                  className="w-full min-h-12 p-3 border border-gray-300 rounded"
                />
              </div>
            </div>
          </div>

          {/* Looking for */}
          <div className="w-full mt-6 max-md:max-w-full">
            <label className="block text-black">Looking for</label>
            <div className="flex w-full gap-4 text-black whitespace-nowrap flex-wrap mt-2">
              {["job", "internship", "both"].map((option) => (
                <button
                  key={option}
                  type="button"
                  className={`self-stretch gap-2 px-4 py-2 border rounded-md ${
                    formData.lookingFor === option ? "bg-black text-white" : ""
                  }`}
                  onClick={() => handleRadioChange("lookingFor", option)}
                >
                  {option.charAt(0).toUpperCase() + option.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Employment type */}
          <div className="w-full mt-6 max-md:max-w-full">
            <label className="block text-black">Employment type</label>
            <div className="flex w-full gap-4 text-black whitespace-nowrap flex-wrap mt-2">
              {["part-time", "full-time", "contract"].map((option) => (
                <button
                  key={option}
                  type="button"
                  className={`self-stretch gap-2 px-4 py-2 border rounded-md ${
                    formData.employmentType === option
                      ? "bg-black text-white"
                      : ""
                  }`}
                  onClick={() => handleRadioChange("employmentType", option)}
                >
                  {option.replace("-", " ")}
                </button>
              ))}
            </div>
          </div>

          {/* Internships/Trainings */}
          <div className="w-full mt-6 max-md:max-w-full">
            <label htmlFor="internshipCompany" className="block text-black">
              Internships/Trainings
            </label>
            <div className="relative">
              <select
                id="internshipCompany"
                name="internshipCompany"
                value={formData.internshipCompany}
                onChange={handleChange}
                className="items-center appearance-none flex min-h-12 w-full gap-2 text-[#666] whitespace-nowrap mt-2 p-3 border border-gray-300 rounded"
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
            <label htmlFor="jobRole" className="block text-black">
              Job Role
            </label>
            <div className="relative">
              <select
                id="jobRole"
                name="jobRole"
                value={formData.jobRole}
                onChange={handleChange}
                className="items-center appearance-none flex min-h-12 w-full gap-2 text-[#666] whitespace-nowrap mt-2 p-3 border border-gray-300 rounded"
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
            {["startDate", "endDate"].map((field, idx) => (
              <div key={field} className="flex-1">
                <label htmlFor={field} className="block text-black">
                  {field === "startDate" ? "Start Date" : "End Date"}
                </label>
                <div className="relative">
                  <select
                    id={field}
                    name={field}
                    value={formData[field]}
                    onChange={handleChange}
                    className="items-center appearance-none bg-white flex min-h-12 w-full gap-2 text-[#666] mt-2 p-3 border border-gray-300 rounded"
                  >
                    <option value="" disabled>
                      Placeholder
                    </option>
                    <option value="jan2025">Jan 2025</option>
                    <option value="feb2025">Feb 2025</option>
                    <option value="mar2025">Mar 2025</option>
                    <option value="jan2026">Jan 2026</option>
                    <option value="feb2026">Feb 2026</option>
                    <option value="mar2026">Mar 2026</option>
                  </select>
                  <ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-6 h-6 pointer-events-none" />
                </div>
              </div>
            ))}
          </div>

          {/* Description */}
          <div className="w-full mt-6 max-md:max-w-full">
            <label htmlFor="description" className="block text-black">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="flex min-h-24 w-full gap-2 text-[#666] mt-2 p-3 border border-gray-300 rounded"
              placeholder="Describe your role..."
            ></textarea>
          </div>

          {/* Add Experience */}
          <div className="flex justify-end mt-4">
            <button
              type="button"
              onClick={handleAddExperience}
              className="text-blue-600 cursor-pointer"
            >
              Add experience +
            </button>
          </div>

          <div className="flex min-h-12 w-full gap-2.5 whitespace-nowrap mt-6 max-md:max-w-full">
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
                onClick={onNext}
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
