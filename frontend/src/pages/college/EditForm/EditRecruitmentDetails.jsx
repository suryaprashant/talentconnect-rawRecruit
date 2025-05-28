import React, { useState } from 'react';

const CustomMultiSelect = ({ options, selected, label, disabled, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelection = (value) => {
    const newSelected = selected.includes(value) ? [] : [value];
    onChange(newSelected);
    setIsOpen(false);
  };
  return (
    <div className="relative mb-4">
      <label className="block font-medium mb-2">{label}</label>
      <div 
        className={`p-2 border border-gray-300 rounded-md cursor-pointer ${disabled ? 'bg-gray-100' : ''}`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
      >
        <div className="flex justify-between items-center">
          <span className="text-gray-700">
            {selected.length > 0 ? selected[0] : 'Select...'}
          </span>
          <svg
            className={`w-5 h-5 transform transition-transform ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-10">
            {options.map(option => (
              <button
                key={option}
                type="button"
                onClick={() => handleSelection(option)}
                className={`w-full text-left px-4 py-2 hover:bg-gray-100 ${
                  selected.includes(option) ? 'bg-blue-50' : ''
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default function EditRecruitmentDetails({ formData, updateFormData, isEditing, toggleEdit, nextStep, prevStep }) {
  const [selectedService, setSelectedService] = useState(null);

  const handleCheckboxChange = (field, value) => {
    const currentValues = [...(formData[field] || [])];
    const index = currentValues.indexOf(value);

    if (index === -1) {
      currentValues.push(value);
    } else {
      currentValues.splice(index, 1);
    }

    updateFormData(field, currentValues);
  };

  const handleFileUpload = (e) => {
    updateFormData('collegeBrochure', e.target.files[0]);
  };

  const handleButtonClick = (service) => {
    setSelectedService(service === selectedService ? null : service);
    handleCheckboxChange('recruitmentServices', service);
  };

  return (
    <div className="flex py-4 items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
        <h1 className="text-2xl font-bold mb-6">Placement & Recruitment Details</h1>
        <p className="mb-6">Define your hiring partnerships and recruitment process.</p>

        <div className="space-y-8">
          {/* Programs Offered Custom Dropdown */}
          <CustomMultiSelect
            label="Programs Offered"
            options={['Engineering', 'Business', 'Arts', 'Science']}
            selected={formData.programsOffered || []}
            onChange={(selected) => updateFormData('programsOffered', selected)}
            disabled={!isEditing}
          />

          {/* Popular Courses Custom Dropdown */}
          <CustomMultiSelect
            label="Popular Courses for Recruitment"
            options={[
              'Computer Science',
              'Mechanical Engineering',
              'MBA',
              'Electrical Engineering'
            ]}
            selected={formData.popularCourses || []}
            onChange={(selected) => updateFormData('popularCourses', selected)}
            disabled={!isEditing}
          />

          {/* Recruitment Services Required as Buttons */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="font-medium mb-4">Recruitment Services Required?</h3>
            <div className="flex gap-4 h-13">
              {['Job Fairs', 'Internship Support', 'Company Tie-ups'].map((service) => (
                <button
                  key={service}
                  onClick={() => isEditing && handleButtonClick(service)}
                  className={`px-6 py-2 rounded-md border ${
                    selectedService === service
                      ? 'bg-black text-white border-black'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-100'
                  } ${!isEditing ? 'cursor-not-allowed' : ''}`}
                  disabled={!isEditing}
                >
                  {service}
                </button>
              ))}
            </div>
          </div>

          {/* Upload College Brochure Section */}
          <div className="border-gray-200 pt-6">
            <h3 className="font-medium mb-4">Upload College Brochure</h3>
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileUpload}
              disabled={!isEditing}
              className="block rounded-md border w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-black hover:file:bg-blue-100 disabled:opacity-50"
            />
            <p className="text-xs text-gray-500 mt-1">Upload PDF</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between mt-10">
          <button
            onClick={prevStep}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100"
          >
            Cancel
          </button>

          <div className="flex gap-4">
            <button
              onClick={toggleEdit}
              className="px-6 py-2 bg-black text-white rounded-md hover:bg-gray-800"
            >
              {isEditing ? 'Save' : 'Edit'}
            </button>

            <button
              onClick={nextStep}
              className="px-6 py-2 bg-black text-white rounded-md hover:bg-gray-800"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}