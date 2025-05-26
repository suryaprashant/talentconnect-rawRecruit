import React, { useState } from "react";
import { ProgressIndicator } from "../ProgressIndicator";
import { ChevronDownIcon, UploadIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const EditStepThree = () => {
  const [isEditable, setIsEditable] = useState(false);
  const [formData, setFormData] = useState({
    college: "",
    degree: "",
    semester: "",
    fieldOfStudy: "",
    cgpa: "",
    certificate: null,
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFormData((prev) => ({ ...prev, certificate: e.target.files[0] }));
    }
  };

  const handleEditClick = () => setIsEditable(true);
  const handleCancelClick = () => navigate("/step/2");
  const handleNextClick = () => navigate("/step/4");

  return (
    <div className="bg-white flex flex-col w-full max-w-[560px] mx-auto p-12 max-md:px-5">
      <ProgressIndicator currentStep={3} totalSteps={5} />

      <div className="mt-8">
        <h2 className="text-[32px] font-bold leading-[42px]">
          Let's add your educational background!
        </h2>
        <p className="text-base mt-2 text-[#444]">
          Provide your academic background to match with relevant job and internship opportunities. Employers consider this when shortlisting candidates.
        </p>
      </div>

      <form className="mt-8 space-y-6">
        {/* College/University */}
        <div>
          <label htmlFor="college" className="block text-black">College/University</label>
          <div className="relative">
            <select
              id="college"
              name="college"
              value={formData.college}
              onChange={handleChange}
              disabled={!isEditable}
              className={`appearance-none mt-2 p-3 w-full border border-gray-300 rounded text-[#666] ${!isEditable ? "bg-gray-100 cursor-not-allowed" : ""}`}
            >
              <option value="" disabled>Select your college</option>
              <option value="university1">University 1</option>
              <option value="university2">University 2</option>
              <option value="university3">University 3</option>
            </select>
            <ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none" />
          </div>
        </div>

        {/* Degree and Semester */}
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1">
            <label htmlFor="degree" className="block text-black">Degree</label>
            <div className="relative">
              <select
                id="degree"
                name="degree"
                value={formData.degree}
                onChange={handleChange}
                disabled={!isEditable}
                className={`appearance-none mt-2 p-3 w-full border border-gray-300 rounded text-[#666] ${!isEditable ? "bg-gray-100 cursor-not-allowed" : ""}`}
              >
                <option value="" disabled>Select your degree</option>
                <option value="bachelors">Bachelor's</option>
                <option value="masters">Master's</option>
                <option value="phd">PhD</option>
              </select>
              <ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none" />
            </div>
          </div>

          <div className="flex-1">
            <label htmlFor="semester" className="block text-black">Current Semester</label>
            <div className="relative">
              <select
                id="semester"
                name="semester"
                value={formData.semester}
                onChange={handleChange}
                disabled={!isEditable}
                className={`appearance-none mt-2 p-3 w-full border border-gray-300 rounded text-[#666] ${!isEditable ? "bg-gray-100 cursor-not-allowed" : ""}`}
              >
                <option value="" disabled>Select semester</option>
                {[...Array(8)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>Semester {i + 1}</option>
                ))}
              </select>
              <ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Field of Study */}
        <div>
          <label htmlFor="fieldOfStudy" className="block text-black">Field of Study / Specialization</label>
          <div className="relative">
            <select
              id="fieldOfStudy"
              name="fieldOfStudy"
              value={formData.fieldOfStudy}
              onChange={handleChange}
              disabled={!isEditable}
              className={`appearance-none mt-2 p-3 w-full border border-gray-300 rounded text-[#666] ${!isEditable ? "bg-gray-100 cursor-not-allowed" : ""}`}
            >
              <option value="" disabled>Select specialization</option>
              <option value="computerScience">Computer Science</option>
              <option value="engineering">Engineering</option>
              <option value="business">Business</option>
              <option value="arts">Arts</option>
            </select>
            <ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none" />
          </div>
        </div>

        {/* CGPA */}
        <div>
          <label htmlFor="cgpa" className="block text-black">Current CGPA/Percentage</label>
          <input
            id="cgpa"
            name="cgpa"
            type="text"
            value={formData.cgpa}
            onChange={handleChange}
            disabled={!isEditable}
            placeholder="Enter your CGPA or percentage"
            className={`mt-2 p-3 w-full border border-gray-300 rounded text-[#666] ${!isEditable ? "bg-gray-100 cursor-not-allowed" : ""}`}
          />
        </div>

        {/* Certificate Upload */}
        <div>
          <label htmlFor="certificate" className="block text-black">Degree Certificate (Optional)</label>
          <label
            className={`flex items-center justify-between mt-2 p-3 border border-gray-300 rounded ${!isEditable ? "bg-gray-100 cursor-not-allowed" : "cursor-pointer hover:bg-gray-50"}`}
          >
            <span className="text-[#666] truncate">
              {formData.certificate ? formData.certificate.name : "Upload Degree Certificate"}
            </span>
            <UploadIcon className="w-5 h-5 text-gray-500" />
            <input
              id="certificate"
              name="certificate"
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              className="hidden"
              onChange={handleFileChange}
              disabled={!isEditable}
            />
          </label>
        </div>
      </form>

      {/* Buttons: Always visible */}
      <div className="flex justify-between mt-8">
  {/* Cancel button on the left */}
  <button
    type="button"
    onClick={handleCancelClick}
    className="text-black border border-gray-300 rounded px-6 py-2 hover:bg-gray-100"
  >
    Cancel
  </button>

  {/* Edit and Next buttons on the right */}
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
      onClick={handleNextClick}
      className="bg-black text-white rounded px-6 py-2 hover:bg-gray-800"
    >
      Next
    </button>
  </div>
</div>

    </div>
  );
};
