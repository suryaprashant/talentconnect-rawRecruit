import React, { useState } from 'react';

export default function RecruitmentDetails({ formData, updateFormData, nextStep, prevStep }) {
  const [selectedService, setSelectedService] = useState(null); // Track selected service
  
  // Handle checkbox change
  const handleCheckboxChange = (field, value) => {
    const currentValues = [...formData[field]];
    const index = currentValues.indexOf(value);

    if (index === -1) {
      currentValues.push(value);
    } else {
      currentValues.splice(index, 1);
    }

    updateFormData(field, currentValues);
  };

  // Handle file upload
  const handleFileUpload = (e) => {
    updateFormData('collegeBrochure', e.target.files[0]);
  };

  // Handle button click to toggle active state
  const handleButtonClick = (service) => {
    setSelectedService(service === selectedService ? null : service); // Toggle active service
    handleCheckboxChange('recruitmentServices', service);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
        <h1 className="text-2xl font-bold mb-6">Placement & Recruitment Details</h1>
        <p className="mb-6">Define your hiring partnerships and recruitment process.</p>

        <div className="space-y-8">
          {/* Programs Offered Dropdown */}
          <div>
            <label className="block font-medium mb-2">Programs Offered</label>
            <select
              multiple
              className="w-full p-2 border border-gray-300 rounded-md h-auto"
              onChange={(e) => {
                const selected = Array.from(e.target.selectedOptions, (option) => option.value);
                updateFormData('programsOffered', selected);
              }}
            >
              <option value="Engineering">Engineering</option>
              <option value="Business">Business</option>
              <option value="Arts">Arts</option>
              <option value="Science">Science</option>
            </select>
          </div>

          {/* Popular Courses for Recruitment Dropdown */}
          <div>
            <label className="block font-medium mb-2">Popular Courses for Recruitment</label>
            <select
              multiple
              className="w-full p-2 border border-gray-300 rounded-md h-auto"
              onChange={(e) => {
                const selected = Array.from(e.target.selectedOptions, (option) => option.value);
                updateFormData('popularCourses', selected);
              }}
            >
              <option value="Computer Science">Computer Science</option>
              <option value="Mechanical Engineering">Mechanical Engineering</option>
              <option value="MBA">MBA</option>
              <option value="Electrical Engineering">Electrical Engineering</option>
            </select>
          </div>

          {/* Preferred Hiring Companies Dropdown */}
          <div>
            <label className="block font-medium mb-2">Preferred Hiring Companies</label>
            <select
              multiple
              className="w-full p-2 border border-gray-300 rounded-md h-auto"
              onChange={(e) => {
                const selected = Array.from(e.target.selectedOptions, (option) => option.value);
                updateFormData('preferredCompanies', selected);
              }}
            >
              <option value="Google">Google</option>
              <option value="Microsoft">Microsoft</option>
              <option value="Amazon">Amazon</option>
              <option value="TCS">TCS</option>
            </select>
          </div>

          {/* Recruitment Services Required as Buttons */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="font-medium mb-4">Recruitment Services Required?</h3>
            <div className="flex gap-4 h-13">
              {['Job Fairs', 'Internship Support', 'Company Tie-ups'].map((service) => (
                <button
                  key={service}
                  onClick={() => handleButtonClick(service)}
                  className={`px-6 py-2 rounded-md border ${
                    selectedService === service
                      ? 'bg-black text-white border-black'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-100'
                  } transition-colors duration-300`}
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
              className="block rounded-md border w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-black hover:file:bg-blue-100"
            />
            <p className="text-xs text-gray-500 mt-1">Upload PDF</p>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-end gap-10 mt-8">
          <button
            onClick={prevStep}
            className="px-6 py-2 border border-gray-300 rounded-md"
          >
            Back
          </button>
          <button
            onClick={nextStep}
            className="px-6 py-2 bg-black text-white rounded-md"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
