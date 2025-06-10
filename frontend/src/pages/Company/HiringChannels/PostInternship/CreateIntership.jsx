import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export default function PostJob() {
  const [formData, setFormData] = useState({
    employmentType: 'full-time',
    jobTitle: '',
    preferredHiringLocation: '',
    numberOfOpenings: '',
    monthlySalary: '',
    salaryCurrency: 'USD',
    jobDescription: '',
    minimumEducation: '',
    preferredFieldOfStudy: '',
    yearsOfExperience: '',
    skills: [],
    certifications: [],
    workAuthorization: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleOptionSelect = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSkillsChange = (e) => {
    const selectedSkills = Array.from(e.target.selectedOptions, option => option.value);
    setFormData(prev => ({ ...prev, skills: selectedSkills }));
  };

  const handleCertificationChange = (e) => {
    const value = e.target.value;
    // Store as array even if single selection
    setFormData(prev => ({ 
      ...prev, 
      certifications: value ? [value] : [] 
    }));
  };

  const handlePostJob = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate required fields
      const requiredFields = {
        jobTitle: 'Job Title',
        employmentType: 'Employment Type',
        jobDescription: 'Job Description',
        preferredHiringLocation: 'Preferred Hiring Location',
        monthlySalary: 'Monthly Salary',
        numberOfOpenings: 'Number of Openings',
        skills: 'Skills'
      };

      const missingFields = [];
      Object.keys(requiredFields).forEach(field => {
        if (!formData[field] || (Array.isArray(formData[field]) && formData[field].length === 0)) {
          missingFields.push(requiredFields[field]);
        }
      });

      if (missingFields.length > 0) {
        alert(`Please fill in the following required fields: ${missingFields.join(', ')}`);
        setIsSubmitting(false);
        return;
      }

      // Prepare payload with correct field names matching your schema
      const payload = {
        jobTitle: formData.jobTitle.trim(),
        employmentType: formData.employmentType,
        jobDescription: formData.jobDescription.trim(),
        preferredHiringLocation: formData.preferredHiringLocation,
        numberOfOpenings: parseInt(formData.numberOfOpenings, 10),
        monthlySalary: parseFloat(formData.monthlySalary),
        salaryCurrency: formData.salaryCurrency,
        skills: Array.isArray(formData.skills) ? formData.skills : [],
        certifications: Array.isArray(formData.certifications) ? formData.certifications : []
      };

      // Add optional fields only if they have values
      if (formData.minimumEducation && formData.minimumEducation.trim()) {
        payload.minimumEducation = formData.minimumEducation;
      }
      if (formData.preferredFieldOfStudy && formData.preferredFieldOfStudy.trim()) {
        payload.preferredFieldOfStudy = formData.preferredFieldOfStudy;
      }
      if (formData.yearsOfExperience && formData.yearsOfExperience.trim()) {
        payload.yearsOfExperience = formData.yearsOfExperience;
      }
      if (formData.workAuthorization && formData.workAuthorization.trim()) {
        payload.workAuthorization = formData.workAuthorization;
      }

      // Ensure skills is always an array and not empty if required
      if (!payload.skills || payload.skills.length === 0) {
        alert('Please select at least one skill');
        setIsSubmitting(false);
        return;
      }

      console.log("Payload being sent:", JSON.stringify(payload, null, 2));

      const response = await fetch(`${import.meta.env.VITE_Backend_URL}/api/rawrecruit/createinternship`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(payload),
      });

      console.log("Response status:", response.status);
      console.log("Response headers:", response.headers);

      if (!response.ok) {
        // Try to get error message from response
        let errorMessage = `HTTP Error: ${response.status}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch (jsonError) {
          const errorText = await response.text();
          errorMessage = errorText || errorMessage;
        }
        throw new Error(errorMessage);
      }

      const responseData = await response.json();
      console.log("Success Response:", responseData);

      alert("Job posted successfully!");
      
      // Reset form on success
      setFormData({
        employmentType: 'full-time',
        jobTitle: '',
        preferredHiringLocation: '',
        numberOfOpenings: '',
        monthlySalary: '',
        salaryCurrency: 'USD',
        jobDescription: '',
        minimumEducation: '',
        preferredFieldOfStudy: '',
        yearsOfExperience: '',
        skills: [],
        certifications: [],
        workAuthorization: ''
      });

    } catch (error) {
      console.error("Detailed error:", error);
      alert(`Error posting job: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    console.log('Form Cancelled');
    setFormData({
      employmentType: 'full-time',
      jobTitle: '',
      preferredHiringLocation: '',
      numberOfOpenings: '',
      monthlySalary: '',
      salaryCurrency: 'USD',
      jobDescription: '',
      minimumEducation: '',
      preferredFieldOfStudy: '',
      yearsOfExperience: '',
      skills: [],
      certifications: [],
      workAuthorization: ''
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto p-4">
        {/* Basic Job Details Section */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-4">
          <h2 className="text-lg font-bold mb-1">Basic Job Details</h2>
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
            <label htmlFor="preferredHiringLocation" className="block text-sm font-medium mb-2">Preferred Hiring Location <span className="text-red-500">*</span></label>
            <div className="relative">
              <select 
                id="preferredHiringLocation" 
                name="preferredHiringLocation"
                className="w-full p-2 border border-gray-300 rounded-md appearance-none bg-white pr-10 focus:ring-2 focus:ring-black focus:border-transparent"
                value={formData.preferredHiringLocation}
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
            <label htmlFor="numberOfOpenings" className="block text-sm font-medium mb-2">No. of Openings <span className="text-red-500">*</span></label>
            <input
              type="number"
              id="numberOfOpenings"
              name="numberOfOpenings"
              placeholder="Ex. 5"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:border-transparent"
              value={formData.numberOfOpenings}
              onChange={handleInputChange}
              min="1"
            />
          </div>
          
          {/* Monthly In-hand Salary */}
          <div className="mb-4">
            <label htmlFor="monthlySalary" className="block text-sm font-medium mb-2">Monthly In-hand Salary <span className="text-red-500">*</span></label>
            <div className="flex">
              <div className="relative w-20">
                <select 
                  id="salaryCurrency"
                  name="salaryCurrency"
                  value={formData.salaryCurrency}
                  onChange={handleInputChange}
                  className="w-full h-full pl-3 pr-6 py-2 border border-gray-300 rounded-l-md appearance-none bg-white focus:ring-2 focus:ring-black focus:border-transparent"
                >
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={12} />
              </div>
              <input
                type="number"
                name="monthlySalary"
                placeholder="Enter amount"
                className="flex-1 p-2 border border-l-0 border-gray-300 rounded-r-md focus:ring-2 focus:ring-black focus:border-transparent"
                value={formData.monthlySalary}
                onChange={handleInputChange}
                step="0.01"
                min="0"
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
            <label htmlFor="minimumEducation" className="block text-sm font-medium mb-2">Minimum Education</label>
            <div className="relative">
              <select 
                id="minimumEducation" 
                name="minimumEducation"
                className="w-full p-2 border border-gray-300 rounded-md appearance-none bg-white pr-10 focus:ring-2 focus:ring-black focus:border-transparent"
                value={formData.minimumEducation}
                onChange={handleInputChange}
              >
                <option value="">Select education level</option>
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
            <label htmlFor="preferredFieldOfStudy" className="block text-sm font-medium mb-2">Preferred Field of Study</label>
            <div className="relative">
              <select 
                id="preferredFieldOfStudy" 
                name="preferredFieldOfStudy"
                className="w-full p-2 border border-gray-300 rounded-md appearance-none bg-white pr-10 focus:ring-2 focus:ring-black focus:border-transparent"
                value={formData.preferredFieldOfStudy}
                onChange={handleInputChange}
              >
                <option value="">Select field of study</option>
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
            <label htmlFor="yearsOfExperience" className="block text-sm font-medium mb-2">Years of Experience</label>
            <div className="relative">
              <select 
                id="yearsOfExperience" 
                name="yearsOfExperience"
                className="w-full p-2 border border-gray-300 rounded-md appearance-none bg-white pr-10 focus:ring-2 focus:ring-black focus:border-transparent"
                value={formData.yearsOfExperience}
                onChange={handleInputChange}
              >
                <option value="">Select experience range</option>
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
                multiple
                size="5"
                className="w-full p-2 border border-gray-300 rounded-md bg-white focus:ring-2 focus:ring-black focus:border-transparent"
                value={formData.skills}
                onChange={handleSkillsChange}
              >
                <option value="javascript">JavaScript</option>
                <option value="react">React</option>
                <option value="vue">Vue</option>
                <option value="angular">Angular</option>
                <option value="node">Node.js</option>
                <option value="python">Python</option>
                <option value="java">Java</option>
                <option value="c++">C++</option>
                <option value="sql">SQL</option>
                <option value="mongodb">MongoDB</option>
              </select>
            </div>
            <p className="text-xs text-gray-500 mt-1">Hold Ctrl (Cmd on Mac) to select multiple skills. Selected: {formData.skills.join(', ')}</p>
          </div>
          
          {/* Certifications */}
          <div className="mb-4">
            <label htmlFor="certifications" className="block text-sm font-medium mb-2">Certifications (if any)</label>
            <div className="relative">
              <select 
                id="certifications" 
                name="certifications"
                className="w-full p-2 border border-gray-300 rounded-md appearance-none bg-white pr-10 focus:ring-2 focus:ring-black focus:border-transparent"
                value={formData.certifications[0] || ''}
                onChange={handleCertificationChange}
              >
                <option value="">Select certification</option>
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
                <option value="">Select authorization type</option>
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
            disabled={isSubmitting}
            className="px-6 py-2 border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handlePostJob}
            disabled={isSubmitting}
            className="px-6 py-2 bg-black text-white rounded-md text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-50"
          >
            {isSubmitting ? 'Posting...' : 'Post Your Job'}
          </button>
        </div>
      </div>
    </div>
  );
}