import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export default function EmployerPostIntership() {
  const [formData, setFormData] = useState({
    employmentType: 'full-time',
    jobTitle: '',
    location: '',
    openings: '',
    salary: '',
    jobDescription: '',
    minEducation: '',
    fieldOfStudy: '',
    experience: '',
    skills: [],
    certifications: '',
    workAuthorization: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleOptionSelect = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePostJob = () => {
    console.log('Job Posted:', formData);
    // Implementation for job posting
  };

  const handleCancel = () => {
    console.log('Form Cancelled');
    // Implementation for cancel
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto p-4">
        {/* Basic Job Details Section */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-4">
          <h2 className="text-lg font-bold mb-1">Basic Internship Details</h2>
          <p className="text-sm text-gray-600 mb-4">Help candidates connect with the right recruiter in your company.</p>
          
          {/* Employment Type */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Employment type <span className="text-red-500">*</span></label>
            <div className="flex gap-2 flex-wrap">
              <button
                type="button"
                className={`px-4 py-1 border rounded-full text-sm transition-colors ${
                  formData.employmentType === 'full-time' 
                    ? 'bg-black text-white border-black' 
                    : 'bg-white text-gray-600 border-gray-300 hover:border-gray-400'
                }`}
                onClick={() => handleOptionSelect('employmentType', 'full-time')}
              >
                Full-time
              </button>
              <button
                type="button"
                className={`px-4 py-1 border rounded-full text-sm transition-colors ${
                  formData.employmentType === 'part-time' 
                    ? 'bg-black text-white border-black' 
                    : 'bg-white text-gray-600 border-gray-300 hover:border-gray-400'
                }`}
                onClick={() => handleOptionSelect('employmentType', 'part-time')}
              >
                Part-time
              </button>
              <button
                type="button"
                className={`px-4 py-1 border rounded-full text-sm transition-colors ${
                  formData.employmentType === 'contract' 
                    ? 'bg-black text-white border-black' 
                    : 'bg-white text-gray-600 border-gray-300 hover:border-gray-400'
                }`}
                onClick={() => handleOptionSelect('employmentType', 'contract')}
              >
                Contract
              </button>
            </div>
          </div>
          
          {/* Job Title */}
          <div className="mb-4">
            <label htmlFor="jobTitle" className="block text-sm font-medium mb-2">Job Title <span className="text-red-500">*</span></label>
            <input
              type="text"
              id="jobTitle"
              name="jobTitle"
              placeholder="Enter the Job Title"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:border-transparent"
              value={formData.jobTitle}
              onChange={handleInputChange}
            />
          </div>
          
          {/* Preferred Hiring Location */}
          <div className="mb-4">
            <label htmlFor="location" className="block text-sm font-medium mb-2">Preferred Hiring Location <span className="text-red-500">*</span></label>
            <div className="relative">
              <select 
                id="location" 
                name="location"
                className="w-full p-2 border border-gray-300 rounded-md appearance-none bg-white pr-10 focus:ring-2 focus:ring-black focus:border-transparent"
                value={formData.location}
                onChange={handleInputChange}
              >
                <option value="" disabled>Select location type</option>
                <option value="remote">Remote</option>
                <option value="onsite">On-site</option>
                <option value="hybrid">Hybrid</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            </div>
          </div>
          
          {/* No. of Openings */}
          <div className="mb-4">
            <label htmlFor="openings" className="block text-sm font-medium mb-2">No. of Openings <span className="text-red-500">*</span></label>
            <input
              type="number"
              id="openings"
              name="openings"
              placeholder="Ex. 5"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:border-transparent"
              value={formData.openings}
              onChange={handleInputChange}
              min="1"
            />
          </div>
          
          {/* Monthly In-hand Salary */}
          <div className="mb-4">
            <label htmlFor="salary" className="block text-sm font-medium mb-2">Monthly In-hand Salary <span className="text-red-500">*</span></label>
            <div className="flex">
              <div className="relative w-20">
                <select 
                  id="currency" 
                  name="currency"
                  className="w-full h-full pl-3 pr-6 py-2 border border-gray-300 rounded-l-md appearance-none bg-white focus:ring-2 focus:ring-black focus:border-transparent"
                >
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={12} />
              </div>
              <input
                type="text"
                name="salary"
                placeholder="Enter amount"
                className="flex-1 p-2 border border-l-0 border-gray-300 rounded-r-md focus:ring-2 focus:ring-black focus:border-transparent"
                value={formData.salary}
                onChange={handleInputChange}
              />
            </div>
          </div>
          
          {/* Job Info / Job Description */}
          <div className="mb-4">
            <label htmlFor="jobDescription" className="block text-sm font-medium mb-2">Job Info / Job Description <span className="text-red-500">*</span></label>
            <textarea
              id="jobDescription"
              name="jobDescription"
              placeholder="Describe the job responsibilities and requirements..."
              className="w-full p-2 border border-gray-300 rounded-md h-32 focus:ring-2 focus:ring-black focus:border-transparent"
              value={formData.jobDescription}
              onChange={handleInputChange}
            ></textarea>
          </div>
        </div>
        
        {/* Selection Criteria Section */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-4">
          <h2 className="text-lg font-bold mb-1">Selection Criteria</h2>
          <p className="text-sm text-gray-600 mb-4">Outline the steps involved in assessing applicants to ensure the best fit for the role.</p>
          
          {/* Minimum Education */}
          <div className="mb-4">
            <label htmlFor="minEducation" className="block text-sm font-medium mb-2">Minimum Education</label>
            <div className="relative">
              <select 
                id="minEducation" 
                name="minEducation"
                className="w-full p-2 border border-gray-300 rounded-md appearance-none bg-white pr-10 focus:ring-2 focus:ring-black focus:border-transparent"
                value={formData.minEducation}
                onChange={handleInputChange}
              >
                <option value="" disabled>Select education level</option>
                <option value="high-school">High School</option>
                <option value="bachelors">Bachelor's Degree</option>
                <option value="masters">Master's Degree</option>
                <option value="phd">PhD</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            </div>
          </div>
          
          {/* Preferred Field of Study */}
          <div className="mb-4">
            <label htmlFor="fieldOfStudy" className="block text-sm font-medium mb-2">Preferred Field of Study</label>
            <div className="relative">
              <select 
                id="fieldOfStudy" 
                name="fieldOfStudy"
                className="w-full p-2 border border-gray-300 rounded-md appearance-none bg-white pr-10 focus:ring-2 focus:ring-black focus:border-transparent"
                value={formData.fieldOfStudy}
                onChange={handleInputChange}
              >
                <option value="" disabled>Select field of study</option>
                <option value="computer-science">Computer Science</option>
                <option value="engineering">Engineering</option>
                <option value="business">Business</option>
                <option value="arts">Arts</option>
                <option value="sciences">Sciences</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            </div>
          </div>
          
          {/* Years of Experience */}
          <div className="mb-4">
            <label htmlFor="experience" className="block text-sm font-medium mb-2">Years of Experience</label>
            <div className="relative">
              <select 
                id="experience" 
                name="experience"
                className="w-full p-2 border border-gray-300 rounded-md appearance-none bg-white pr-10 focus:ring-2 focus:ring-black focus:border-transparent"
                value={formData.experience}
                onChange={handleInputChange}
              >
                <option value="" disabled>Select experience range</option>
                <option value="0-1">0-1 years</option>
                <option value="1-3">1-3 years</option>
                <option value="3-5">3-5 years</option>
                <option value="5-10">5-10 years</option>
                <option value="10+">10+ years</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            </div>
          </div>
          
          {/* Skills */}
          <div className="mb-4">
          <label htmlFor="skills" className="block text-sm font-medium mb-2">Skills <span className="text-red-500">*</span></label>
          <div className="relative">
            <select 
              id="skills" 
              name="skills"
              className="w-full p-2 border border-gray-300 rounded appearance-none bg-white pr-10"
              value={formData.skills}
              onChange={handleInputChange}
            >
              <option value="" disabled>Multiple select</option>
              <option value="javascript">JavaScript</option>
              <option value="react">React</option>
              <option value="vue">Vue</option>
              <option value="angular">Angular</option>
              <option value="node">Node.js</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          </div>
        </div>
          
          {/* Certifications */}
          <div className="mb-4">
            <label htmlFor="certifications" className="block text-sm font-medium mb-2">Certifications (if any)</label>
            <div className="relative">
              <select 
                id="certifications" 
                name="certifications"
                className="w-full p-2 border border-gray-300 rounded-md appearance-none bg-white pr-10 focus:ring-2 focus:ring-black focus:border-transparent"
                value={formData.certifications}
                onChange={handleInputChange}
              >
                <option value="" disabled>Select certification</option>
                <option value="aws">AWS Certified</option>
                <option value="azure">Microsoft Azure</option>
                <option value="google-cloud">Google Cloud</option>
                <option value="cisco">Cisco</option>
                <option value="pmp">PMP</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            </div>
          </div>
          
          {/* Work Authorization Requirement */}
          <div className="mb-4">
            <label htmlFor="workAuthorization" className="block text-sm font-medium mb-2">Work Authorization Requirement</label>
            <div className="relative">
              <select 
                id="workAuthorization" 
                name="workAuthorization"
                className="w-full p-2 border border-gray-300 rounded-md appearance-none bg-white pr-10 focus:ring-2 focus:ring-black focus:border-transparent"
                value={formData.workAuthorization}
                onChange={handleInputChange}
              >
                <option value="" disabled>Select authorization type</option>
                <option value="citizens">Citizens Only</option>
                <option value="permanent-residents">Permanent Residents</option>
                <option value="work-visa">Work Visa Holders</option>
                <option value="any">Any</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            </div>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex justify-end gap-4 pb-6">
          <button
            type="button"
            onClick={handleCancel}
            className="px-6 py-2 border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handlePostJob}
            className="px-6 py-2 bg-black text-white rounded-md text-sm font-medium hover:bg-gray-800 transition-colors"
          >
            Post Your Job
          </button>
        </div>
      </div>
    </div>
  );
}