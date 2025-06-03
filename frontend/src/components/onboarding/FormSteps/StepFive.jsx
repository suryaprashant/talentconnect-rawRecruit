import React, { useState } from "react";
import { ProgressIndicator } from "../ProgressIndicator";
import { ChevronDownIcon, UploadIcon } from "lucide-react";

export const StepFive = ({ onNext, onBack }) => {
  const [formData, setFormData] = useState({
    skills: [],
    certifications: "",
    linkedinProfile: "www.relume.io",
    githubProfile: "www.relume.io",
    portfolio: "www.relume.io",
    project: null,
    referralSource: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFormData((prev) => ({ ...prev, project: e.target.files[0] }));
    }
  };

  return (
    <div className="justify-center items-stretch bg-white z-0 flex min-w-60 flex-col w-[560px] my-auto p-12 max-md:max-w-full max-md:px-5">
      <ProgressIndicator currentStep={5} totalSteps={5} />

      <div className="flex w-full flex-col items-stretch justify-center mt-8 max-md:max-w-full">
        <div className="w-full text-black max-md:max-w-full">
          <h2 className="text-[32px] font-bold leading-[42px] max-md:max-w-full">
            You're almost there! Let's add final details and submit!
          </h2>
          <p className="text-base font-normal leading-6 mt-2 max-md:max-w-full">
            Highlight your skills and achievements. Upload certifications, list
            technical skills, and showcase what makes you stand out to
            employers.
          </p>
        </div>

        <form className="w-full text-base font-normal mt-8 max-md:max-w-full">
         {/* Skills */}
{/* Skills */}
<div className="w-full max-md:max-w-full">
  <label htmlFor="skills" className="block text-black">
    Skills
  </label>

  {/* Selected skills as tags */}
  {formData.skills.length > 0 && (
    <div className="flex flex-wrap gap-2 mt-2">
      {formData.skills.map((skill, index) => (
        <span
          key={index}
          className="flex items-center bg-gray-200 text-sm text-black px-3 py-1 rounded-full"
        >
          {skill}
          <button
            type="button"
            onClick={() =>
              setFormData((prev) => ({
                ...prev,
                skills: prev.skills.filter((s) => s !== skill),
              }))
            }
            className="ml-2 text-gray-600 hover:text-black"
          >
            ×
          </button>
        </span>
      ))}
    </div>
  )}

  {/* Select input */}
  <div className="relative mt-2">
    <select
      id="skills"
      name="skills"
      value=""
      onChange={(e) => {
        const selected = e.target.value;
        if (!formData.skills.includes(selected)) {
          setFormData((prev) => ({
            ...prev,
            skills: [...prev.skills, selected],
          }));
        }
      }}
      className="items-center appearance-none flex min-h-12 w-full gap-2 text-[#666] p-3 border border-gray-300 rounded"
    >
      <option value="" disabled>
        Select Skill
      </option>
      <option value="JavaScript">JavaScript</option>
      <option value="React">React</option>
      <option value="Node.js">Node.js</option>
      <option value="Python">Python</option>
      <option value="Java">Java</option>
      <option value="UI/UX Design">UI/UX Design</option>
    </select>
    <ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-6 h-6 pointer-events-none" />
  </div>
</div>


          <div className="w-full whitespace-nowrap mt-6 max-md:max-w-full">
            <label
              htmlFor="certifications"
              className="block text-black max-md:max-w-full"
            >
              Certifications
            </label>
            <textarea
              id="certifications"
              name="certifications"
              value={formData.certifications}
              onChange={handleChange}
              className="self-stretch flex-1 shrink basis-[0%] w-full gap-2 text-[#666] mt-2 p-3 max-md:max-w-full border border-gray-300 rounded min-h-[80px]"
              placeholder="Placeholder"
            ></textarea>
          </div>

          <div className="w-full mt-6 max-md:max-w-full">
            <label
              htmlFor="linkedinProfile"
              className="block text-black max-md:max-w-full"
            >
              LinkedIn Profile
            </label>
            <div className="items-stretch bg-white flex min-h-12 w-full whitespace-nowrap mt-2 max-md:max-w-full border border-gray-300 rounded overflow-hidden">
              <div className="self-stretch gap-2 text-black h-full px-3 py-2 bg-gray-100">
                http://
              </div>
              <div className="border bg-black w-0 shrink-0 h-12 border-black border-solid"></div>
              <input
                id="linkedinProfile"
                name="linkedinProfile"
                type="text"
                value={formData.linkedinProfile}
                onChange={handleChange}
                className="self-stretch flex-1 shrink basis-[0%] min-w-60 gap-2 text-[#666] h-full px-3 py-2 outline-none"
              />
            </div>
          </div>

          <div className="w-full mt-6 max-md:max-w-full">
            <label
              htmlFor="githubProfile"
              className="block text-black max-md:max-w-full"
            >
              Github Profile
            </label>
            <div className="items-stretch bg-white flex min-h-12 w-full whitespace-nowrap mt-2 max-md:max-w-full border border-gray-300 rounded overflow-hidden">
              <div className="self-stretch gap-2 text-black h-full px-3 py-2 bg-gray-100">
                http://
              </div>
              <div className="border bg-black w-0 shrink-0 h-12 border-black border-solid"></div>
              <input
                id="githubProfile"
                name="githubProfile"
                type="text"
                value={formData.githubProfile}
                onChange={handleChange}
                className="self-stretch flex-1 shrink basis-[0%] min-w-60 gap-2 text-[#666] h-full px-3 py-2 outline-none"
              />
            </div>
          </div>

          <div className="w-full mt-6 max-md:max-w-full">
            <label
              htmlFor="portfolio"
              className="block text-black max-md:max-w-full"
            >
              Portfolio/Website(if any)
            </label>
            <div className="items-stretch bg-white flex min-h-12 w-full whitespace-nowrap mt-2 max-md:max-w-full border border-gray-300 rounded overflow-hidden">
              <div className="self-stretch gap-2 text-black h-full px-3 py-2 bg-gray-100">
                http://
              </div>
              <div className="border bg-black w-0 shrink-0 h-12 border-black border-solid"></div>
              <input
                id="portfolio"
                name="portfolio"
                type="text"
                value={formData.portfolio}
                onChange={handleChange}
                className="self-stretch flex-1 shrink basis-[0%] min-w-60 gap-2 text-[#666] h-full px-3 py-2 outline-none"
              />
            </div>
          </div>

          <div className="w-full mt-6 max-md:max-w-full">
            <label
              htmlFor="project"
              className="block text-black max-md:max-w-full"
            >
              Project(if any)
            </label>
            <label className="items-center flex min-h-12 w-full gap-2 text-[#666] mt-2 p-3 max-md:max-w-full border border-gray-300 rounded cursor-pointer hover:bg-gray-50">
              <span className="self-stretch flex-1 shrink basis-[0%] my-auto">
                {formData.project ? formData.project.name : "Upload PDF"}
              </span>
              <UploadIcon className="self-stretch w-6 shrink-0 h-6 my-auto" />
              <input
                id="project"
                name="project"
                type="file"
                accept=".pdf"
                className="hidden"
                onChange={handleFileChange}
              />
            </label>
          </div>

          <div className="w-full text-black mt-6 max-md:max-w-full">
            <label htmlFor="referralSource" className="block max-md:max-w-full">
              How did you hear about us?
            </label>
            <div className="relative">
              <select
                id="referralSource"
                name="referralSource"
                value={formData.referralSource}
                onChange={handleChange}
                className="items-center appearance-none bg-white flex w-full gap-4 mt-2 p-3 max-md:max-w-full border border-gray-300 rounded"
              >
                <option value="" disabled selected>
                  Select one...
                </option>
                <option value="social">Social Media</option>
                <option value="friend">Friend or Colleague</option>
                <option value="search">Search Engine</option>
                <option value="college">College/University</option>
                <option value="other">Other</option>
              </select>
              <ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-6 h-6 pointer-events-none" />
            </div>
          </div>

          <div className="flex min-h-12 w-full gap-2.5 whitespace-nowrap mt-6 max-md:max-w-full">
            <div className="flex gap-4">
              <button
                type="button"
                onClick={onBack}
                className="self-stretch gap-2 text-black border rounded-md px-6 py-3 max-md:px-5 cursor-pointer"
              >
                Back
              </button>
              <button
                type="button"
                onClick={onNext}
                className="self-stretch bg-black border rounded-md gap-2 text-white px-6 py-3 max-md:px-5 cursor-pointer"
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