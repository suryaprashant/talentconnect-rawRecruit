import React, { useState } from "react";
import { ProgressIndicator } from "../ProgressIndicator";
import { ChevronDownIcon } from "lucide-react";

export const StepFour = ({ onNext, onBack }) => {
  const [formData, setFormData] = useState({
    industryType: [],
    jobRoles: [],
    locations: [],
    lookingFor: "internship",
    employmentType: "full-time",
  });

  // const handleSelectChange = (e) => {
  //   const { name, value } = e.target;
  //   setFormData((prev) => ({ ...prev, [name]: value }));
  // };

  const handleRadioChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
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
              </select>
              <ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-6 h-6 pointer-events-none" />
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
                }`}
                onClick={() => handleRadioChange("lookingFor", "job")}
              >
                Job
              </button>
              <button
                type="button"
                className={`self-stretch gap-2 px-4 py-2 border rounded-md ${
                  formData.lookingFor === "internship"
                    ? "bg-black text-white"
                    : ""
                }`}
                onClick={() => handleRadioChange("lookingFor", "internship")}
              >
                Internship
              </button>
              <button
                type="button"
                className={`self-stretch gap-2 px-4 py-2 border rounded-md ${
                  formData.lookingFor === "both" ? "bg-black text-white" : ""
                }`}
                onClick={() => handleRadioChange("lookingFor", "both")}
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
                className={`self-stretch gap-2 px-4 py-2 border  rounded-md ${
                  formData.employmentType === "part-time"
                    ? "bg-black text-white"
                    : ""
                }`}
                onClick={() => handleRadioChange("employmentType", "part-time")}
              >
                Part-time
              </button>
              <button
                type="button"
                className={`self-stretch gap-2 px-4 py-2  border rounded-md ${
                  formData.employmentType === "full-time"
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
                  formData.employmentType === "contract"
                    ? "bg-black text-white"
                    : ""
                }`}
                onClick={() => handleRadioChange("employmentType", "contract")}
              >
                Contract
              </button>
            </div>
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