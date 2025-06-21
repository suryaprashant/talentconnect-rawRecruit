import React, { useState } from "react";
import { ProgressIndicator } from "../ProgressIndicator";
import { ChevronDownIcon } from "lucide-react";

export const StepFour = ({ onNext, onBack }) => {
  const [formData, setFormData] = useState({
    industry: "",
    jobRole: "",
    location: "",
    lookingFor: "Internship",
    employmentType: "Full time",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRadioChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch("http://localhost:5000/rawrecruit/job-preference", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        console.log("Job preference saved!");
        onNext(); // Proceed to next step if submission succeeds
      } else {
        const errorData = await response.json();
        console.error("Submission error:", errorData.error);
      }
    } catch (error) {
      console.error("Network error:", error);
    }
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
            Let us know your job interests and preferred locations so we can
            recommend the best opportunities for you.
          </p>
        </div>

        <form className="w-full text-base font-normal mt-8 max-md:max-w-full">
          {/* Industry */}
          <div className="w-full max-md:max-w-full">
            <label htmlFor="industry" className="block text-black">
              Interested Industry Type
            </label>
            <div className="relative">
              <select
                id="industry"
                name="industry"
                value={formData.industry}
                onChange={handleChange}
                className="items-center appearance-none flex min-h-12 w-full gap-2 text-[#666] mt-2 p-3 border border-gray-300 rounded"
              >
                <option value="" disabled>Select Industry</option>
                <option value="Technology">Technology</option>
                <option value="Finance">Finance</option>
                <option value="Healthcare">Healthcare</option>
                <option value="Education">Education</option>
                <option value="Manufacturing">Manufacturing</option>
              </select>
              <ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-6 h-6 pointer-events-none" />
            </div>
          </div>

          {/* Job Role */}
          <div className="w-full mt-6 max-md:max-w-full">
            <label htmlFor="jobRole" className="block text-black">
              Interested Job Roles
            </label>
            <div className="relative">
              <select
                id="jobRole"
                name="jobRole"
                value={formData.jobRole}
                onChange={handleChange}
                className="items-center appearance-none flex min-h-12 w-full gap-2 text-[#666] mt-2 p-3 border border-gray-300 rounded"
              >
                <option value="" disabled>Select Job Role</option>
                <option value="Software Developer">Software Developer</option>
                <option value="UI/UX Designer">UI/UX Designer</option>
                <option value="Project Manager">Project Manager</option>
                <option value="Data Analyst">Data Analyst</option>
                <option value="Marketing Specialist">Marketing Specialist</option>
              </select>
              <ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-6 h-6 pointer-events-none" />
            </div>
          </div>

          {/* Location */}
          <div className="w-full mt-6 max-md:max-w-full">
            <label htmlFor="location" className="block text-black">
              Preferred Job Locations
            </label>
            <div className="relative">
              <select
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="items-center appearance-none flex min-h-12 w-full gap-2 text-[#666] mt-2 p-3 border border-gray-300 rounded"
              >
                <option value="" disabled>Select Location</option>
                <option value="Bangalore">Bangalore</option>
                <option value="Mumbai">Mumbai</option>
                <option value="Delhi">Delhi</option>
                <option value="Hyderabad">Hyderabad</option>
                <option value="Pune">Pune</option>
                <option value="Remote">Remote</option>
              </select>
              <ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-6 h-6 pointer-events-none" />
            </div>
          </div>

          {/* Looking For */}
          <div className="w-full mt-6 max-md:max-w-full">
            <label className="block text-black">Looking for</label>
            <div className="flex gap-4 mt-2 flex-wrap">
              {["Job", "Internship", "Both"].map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => handleRadioChange("lookingFor", option)}
                  className={`px-4 py-2 border rounded-md ${
                    formData.lookingFor === option
                      ? "bg-black text-white"
                      : "text-black"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          {/* Employment Type */}
          <div className="w-full mt-6 max-md:max-w-full">
            <label className="block text-black">Employment Type</label>
            <div className="flex gap-4 mt-2 flex-wrap">
              {["Part time", "Full time", "Contract"].map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => handleRadioChange("employmentType", type)}
                  className={`px-4 py-2 border rounded-md ${
                    formData.employmentType === type
                      ? "bg-black text-white"
                      : "text-black"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex gap-4 mt-6">
            <button
              type="button"
              onClick={onBack}
              className="px-6 py-3 border rounded-md text-black"
            >
              Back
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="px-6 py-3 border rounded-md bg-black text-white"
            >
              Next
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
