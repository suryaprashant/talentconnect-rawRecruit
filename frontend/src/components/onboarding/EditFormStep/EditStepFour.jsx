import React, { useState } from "react";
import { ProgressIndicator } from "../ProgressIndicator";
import { ChevronDownIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const EditStepFour = ({ onNext, onBack }) => {
  const [isEditable, setIsEditable] = useState(false);
  const [formData, setFormData] = useState({
    industryType: [],
    jobRoles: [],
    locations: [],
    lookingFor: "internship",
    employmentType: "full-time",
  });

  const navigate = useNavigate();

  const handleSelectChange = (e) => {
    const { name, options } = e.target;
    const selectedOptions = Array.from(options)
      .filter(option => option.selected)
      .map(option => option.value);
    setFormData(prev => ({ ...prev, [name]: selectedOptions }));
  };

  const handleRadioChange = (field, value) => {
    if (isEditable) {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleEditClick = () => {
    setIsEditable(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="justify-center items-stretch flex min-w-60 flex-col w-[560px] my-auto p-12 max-md:max-w-full max-md:px-5">
        <ProgressIndicator currentStep={4} totalSteps={5} />

        <div className="flex w-full flex-col items-stretch justify-center mt-8 max-md:max-w-full">
          <div className="w-full text-black max-md:max-w-full">
            <h2 className="text-[32px] font-bold leading-[42px] max-md:max-w-full">
              Awesome! Let's define your career goals and skills!
            </h2>
            <p className="text-base font-normal leading-6 mt-2 max-md:max-w-full">
              Let us know your job interests and preferred locations so we can recommend the best opportunities for you.
            </p>
          </div>

          <form className="w-full text-base font-normal mt-8 max-md:max-w-full">
            {/* Industry Type */}
            <div className="w-full max-md:max-w-full">
              <label htmlFor="industryType" className="block text-black max-md:max-w-full">
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
                  <option value="" disabled>Multiple-select</option>
                  <option value="technology">Technology</option>
                  <option value="finance">Finance</option>
                  <option value="healthcare">Healthcare</option>
                  <option value="education">Education</option>
                  <option value="manufacturing">Manufacturing</option>
                </select>
                <ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-6 h-6 pointer-events-none" />
              </div>
            </div>

            {/* Job Roles */}
            <div className="w-full mt-6 max-md:max-w-full">
              <label htmlFor="jobRoles" className="block text-black max-md:max-w-full">
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
                  <option value="" disabled>Multiple-select</option>
                  <option value="developer">Software Developer</option>
                  <option value="designer">UI/UX Designer</option>
                  <option value="manager">Project Manager</option>
                  <option value="analyst">Data Analyst</option>
                  <option value="marketing">Marketing Specialist</option>
                </select>
                <ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-6 h-6 pointer-events-none" />
              </div>
            </div>

            {/* Locations */}
            <div className="w-full mt-6 max-md:max-w-full">
              <label htmlFor="locations" className="block text-black max-md:max-w-full">
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
                  <option value="" disabled>Multiple-select</option>
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

            {/* Looking For */}
            <div className="w-full mt-6 max-md:max-w-full">
              <label className="block text-black max-md:max-w-full">Looking for</label>
              <div className="flex w-full gap-4 text-black whitespace-nowrap flex-wrap mt-2 max-md:max-w-full">
                {["job", "internship", "both"].map(option => (
                  <button
                    key={option}
                    type="button"
                    className={`self-stretch gap-2 px-4 py-2 border rounded-md ${
                      formData.lookingFor === option ? "bg-black text-white" : ""
                    } ${!isEditable ? "cursor-not-allowed" : ""}`}
                    onClick={() => handleRadioChange("lookingFor", option)}
                    disabled={!isEditable}
                  >
                    {option.charAt(0).toUpperCase() + option.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Employment Type */}
            <div className="w-full mt-6 max-md:max-w-full">
              <label className="block text-black max-md:max-w-full">Employment type</label>
              <div className="flex w-full rounded-md gap-4 text-black whitespace-nowrap flex-wrap mt-2 max-md:max-w-full">
                {["part-time", "full-time", "contract"].map(type => (
                  <button
                    key={type}
                    type="button"
                    className={`self-stretch gap-2 px-4 py-2 border rounded-md ${
                      formData.employmentType === type ? "bg-black text-white" : ""
                    } ${!isEditable ? "cursor-not-allowed" : ""}`}
                    onClick={() => handleRadioChange("employmentType", type)}
                    disabled={!isEditable}
                  >
                    {type.replace("-", " ").replace(/\b\w/g, l => l.toUpperCase())}
                  </button>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between mt-8">
              <button
                type="button"
                onClick={() => navigate('/step/3')}
                className="text-black border border-gray-300 rounded px-6 py-2 hover:bg-gray-100"
              >
                Cancel
              </button>

              <div className="flex gap-3">
                {!isEditable && (
                  <button
                    type="button"
                    onClick={handleEditClick}
                    className="text-black border border-gray-300 rounded px-6 py-2 hover:bg-gray-100"
                  >
                    Edit
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => navigate('/step/5')}
                  className="bg-black text-white rounded px-6 py-2 hover:bg-gray-800"
                >
                  Next
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
