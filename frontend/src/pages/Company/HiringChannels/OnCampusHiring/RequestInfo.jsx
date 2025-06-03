import { useState } from 'react';
import { ChevronDown, Mail, Phone, Link } from 'lucide-react';

export default function RequestInfo() {
  const [formData, setFormData] = useState({
    degree: '',
    locations: [],
    lookingFor: 'job',
    employmentType: 'full-time',
    minimumSalary: '',
    startDate: '',
    endDate: '',
    rounds: '',
    selectionProcess: [],
    contactName: '',
    contactDesignation: '',
    contactEmail: 'hello@xyz.com',
    contactMobile: '1234567890',
    contactLinkedIn: 'www.resume.io',
    minimumStudents: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleOptionSelect = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_Backend_URL}/api/rawrecruit/oncampus-register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        alert('Form submitted successfully!');
      } else {
        const errorData = await response.json();
        alert(`Submission failed: ${errorData.error}`);
      }
    } catch (err) {
      alert(`An error occurred: ${err.message}`);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white">
      {/* Header section */}
      <div className="flex flex-col md:flex-row justify-between items-start mb-8">
        <div className="mb-4 md:mb-0">
          <h1 className="text-2xl font-bold">OnCampus Connect:</h1>
          <h2 className="text-2xl font-bold mb-4">Hire Smarter</h2>
        </div>
        <div className="max-w-md">
          <p className="text-sm">
            Our OnCampus service brings career opportunities directly to students, connecting them with top employers through campus recruitment drives and job events.
          </p>
        </div>
      </div>

      {/* Main heading */}
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold">Register for On-Campus Hiring</h2>
        <p className="text-gray-500 mt-2">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
      </div>

      {/* Form */}
      <div className="space-y-6">
        {/* Degree */}
        <div>
          <label htmlFor="degree" className="block mb-2 font-medium">Degree</label>
          <div className="relative">
            <select
              id="degree"
              name="degree"
              className="w-full p-2 border border-gray-300 rounded appearance-none bg-white pr-10"
              value={formData.degree}
              onChange={handleInputChange}
            >
              <option value="" disabled>Multiple select</option>
              <option value="bachelors">Bachelor's</option>
              <option value="masters">Master's</option>
              <option value="phd">PhD</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          </div>
        </div>

        {/* Preferred Hiring Locations */}
        <div>
          <label htmlFor="locations" className="block mb-2 font-medium">Preferred Hiring Locations</label>
          <div className="relative">
            <select
              id="locations"
              name="locations"
              className="w-full p-2 border border-gray-300 rounded appearance-none bg-white pr-10"
              value={formData.locations}
              onChange={handleInputChange}
            >
              <option value="" disabled>Multiple select</option>
              <option value="remote">Remote</option>
              <option value="onsite">On-site</option>
              <option value="hybrid">Hybrid</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          </div>
        </div>

        {/* Looking for */}
        <div>
          <label className="block mb-2 font-medium">Looking for</label>
          <div className="flex space-x-2">
            <button
              type="button"
              className={`px-4 py-1 border ${formData.lookingFor === 'job' ? 'bg-black text-white' : 'bg-white text-black'} rounded`}
              onClick={() => handleOptionSelect('lookingFor', 'job')}
            >
              Job
            </button>
            <button
              type="button"
              className={`px-4 py-1 border ${formData.lookingFor === 'internship' ? 'bg-black text-white' : 'bg-white text-black'} rounded`}
              onClick={() => handleOptionSelect('lookingFor', 'internship')}
            >
              Internship
            </button>
            <button
              type="button"
              className={`px-4 py-1 border ${formData.lookingFor === 'both' ? 'bg-black text-white' : 'bg-white text-black'} rounded`}
              onClick={() => handleOptionSelect('lookingFor', 'both')}
            >
              Both
            </button>
          </div>
        </div>

        {/* Employment type */}
        <div>
          <label className="block mb-2 font-medium">Employment type</label>
          <div className="flex space-x-2">
            <button
              type="button"
              className={`px-4 py-1 border ${formData.employmentType === 'part-time' ? 'bg-black text-white' : 'bg-white text-black'} rounded`}
              onClick={() => handleOptionSelect('employmentType', 'part-time')}
            >
              Part-time
            </button>
            <button
              type="button"
              className={`px-4 py-1 border ${formData.employmentType === 'full-time' ? 'bg-black text-white' : 'bg-white text-black'} rounded`}
              onClick={() => handleOptionSelect('employmentType', 'full-time')}
            >
              Full-time
            </button>
            <button
              type="button"
              className={`px-4 py-1 border ${formData.employmentType === 'contract' ? 'bg-black text-white' : 'bg-white text-black'} rounded`}
              onClick={() => handleOptionSelect('employmentType', 'contract')}
            >
              Contract
            </button>
          </div>
        </div>

        {/* Minimum Salary Offered */}
        <div>
          <label className="block mb-2 font-medium">Minimum Salary Offered</label>
          <div className="flex">
            <div className="relative w-16">
              <select
                id="currency"
                name="currency"
                className="w-full h-full p-2 border border-gray-300 rounded-l appearance-none bg-white pr-6"
              >
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
              </select>
              <ChevronDown className="absolute right-1 top-1/2 transform -translate-y-1/2 text-gray-400" size={12} />
            </div>
            <input
              type="text"
              name="minimumSalary"
              placeholder="Placeholder"
              className="flex-1 p-2 border border-l-0 border-gray-300 rounded-r"
              value={formData.minimumSalary}
              onChange={handleInputChange}
            />
          </div>
        </div>

        {/* Tentative Date of Placement / Hiring */}
        <div>
          <label className="block mb-2 font-medium">Tentative Date of Placement / Hiring</label>
          <div className="flex space-x-4">
            <div className="w-1/2">
              <label className="block mb-1 text-sm">Start Date</label>
              <div className="relative">
                <input
                  type="text"
                  name="startDate"
                  placeholder="Placeholder"
                  className="w-full p-2 border border-gray-300 rounded appearance-none pr-10"
                  value={formData.startDate}
                  onChange={handleInputChange}
                />
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              </div>
            </div>
            <div className="w-1/2">
              <label className="block mb-1 text-sm">End Date</label>
              <div className="relative">
                <input
                  type="text"
                  name="endDate"
                  placeholder="Placeholder"
                  className="w-full p-2 border border-gray-300 rounded appearance-none pr-10"
                  value={formData.endDate}
                  onChange={handleInputChange}
                />
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              </div>
            </div>
          </div>
        </div>

        {/* Number of Rounds */}
        <div>
          <label htmlFor="rounds" className="block mb-2 font-medium">Number of Rounds</label>
          <div className="relative">
            <select
              id="rounds"
              name="rounds"
              className="w-full p-2 border border-gray-300 rounded appearance-none bg-white pr-10"
              value={formData.rounds}
              onChange={handleInputChange}
            >
              <option value="" disabled>Multiple select</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5+">5+</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          </div>
        </div>

        {/* Process of Selection */}
        <div>
          <label htmlFor="selectionProcess" className="block mb-2 font-medium">Process of Selection</label>
          <div className="relative">
            <select
              id="selectionProcess"
              name="selectionProcess"
              className="w-full p-2 border border-gray-300 rounded appearance-none bg-white pr-10"
              value={formData.selectionProcess}
              onChange={handleInputChange}
            >
              <option value="" disabled>Multiple select</option>
              <option value="interview">Interview</option>
              <option value="technical-test">Technical Test</option>
              <option value="assignment">Assignment</option>
              <option value="group-discussion">Group Discussion</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          </div>
        </div>

        {/* Contact Person */}
        <div>
          <label htmlFor="contactName" className="block mb-2 font-medium">Contact Person</label>
          <input
            type="text"
            id="contactName"
            name="contactName"
            placeholder="Name"
            className="w-full p-2 border border-gray-300 rounded"
            value={formData.contactName}
            onChange={handleInputChange}
          />
        </div>

        {/* Contact person designation */}
        <div>
          <label htmlFor="contactDesignation" className="block mb-2 font-medium">Contact person designation <span className="text-red-500">*</span></label>
          <div className="relative">
            <input
              type="text"
              id="contactDesignation"
              name="contactDesignation"
              placeholder="Placeholder"
              className="w-full p-2 border border-gray-300 rounded appearance-none pr-10"
              value={formData.contactDesignation}
              onChange={handleInputChange}
            />
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          </div>
        </div>

        {/* Contact person email */}
        <div>
          <label htmlFor="contactEmail" className="block mb-2 font-medium">Contact person email <span className="text-red-500">*</span></label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="email"
              id="contactEmail"
              name="contactEmail"
              placeholder="hello@xyz.com"
              className="w-full p-2 pl-10 border border-gray-300 rounded"
              value={formData.contactEmail}
              onChange={handleInputChange}
            />
          </div>
        </div>

        {/* Contact person mobile no */}
        <div>
          <label htmlFor="contactMobile" className="block mb-2 font-medium">Contact person mobile no <span className="text-red-500">*</span></label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="tel"
              id="contactMobile"
              name="contactMobile"
              placeholder="1234567890"
              className="w-full p-2 pl-10 border border-gray-300 rounded"
              value={formData.contactMobile}
              onChange={handleInputChange}
            />
          </div>
        </div>

        {/* Contact person LinkedIn Profile */}
        <div>
          <label htmlFor="contactLinkedIn" className="block mb-2 font-medium">Contact person LinkedIn Profile</label>
          <div className="relative">
            <Link className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="url"
              id="contactLinkedIn"
              name="contactLinkedIn"
              placeholder="http://"
              className="w-full p-2 pl-10 border border-gray-300 rounded"
              value={formData.contactLinkedIn}
              onChange={handleInputChange}
            />
          </div>
        </div>

        {/* Minimum Students to be Hired */}
        <div>
          <label htmlFor="minimumStudents" className="block mb-2 font-medium">Minimum Students to be Hired</label>
          <div className="relative">
            <select
              id="minimumStudents"
              name="minimumStudents"
              className="w-full p-2 border border-gray-300 rounded appearance-none bg-white pr-10"
              value={formData.minimumStudents}
              onChange={handleInputChange}
            >
              <option value="" disabled>Multiple select</option>
              <option value="1-5">1-5</option>
              <option value="6-10">6-10</option>
              <option value="11-20">11-20</option>
              <option value="21+">21+</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          </div>
        </div>

        {/* Register Button */}
        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleSubmit}
            className="px-6 py-2 bg-black text-white rounded"
          >
            Register
          </button>
        </div>
      </div>
    </div>
  );
}