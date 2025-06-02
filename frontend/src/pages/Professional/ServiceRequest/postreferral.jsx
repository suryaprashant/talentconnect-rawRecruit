import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from "@/components/dashboard/PageHeader"

function PostReferralJobPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    employmentType: 'Fulltime',
    jobTitle: '',
    location: '',
    openings: '',
    education: '',
    fieldOfStudy: '',
    experience: '',
    skills: '',
    certifications: '',
    achievements: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = () => {
    console.log('Submitted form data:', formData);
    // After submitting, navigate to the referral management page
    navigate('/professional/service-request/referral');
  };

  const handleCancel = () => {
    // Navigate back to the main service request page
    navigate('/professional/service-request');
  };

  const handleEmploymentTypeChange = (type) => {
    setFormData({
      ...formData,
      employmentType: type
    });
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <PageHeader 
        title="Post a Referral Job"
      />
      
      <p className="text-gray-600 mb-8">
        Effortlessly Connect with Qualified Candidates and Build Your Dream Team
      </p>
      
      <div>
        {/* Basic Job Details Section */}
        <div className="bg-white border border-gray-200 rounded-md p-6 mb-6">
          <h2 className="text-lg font-medium mb-4">Basic Job Details</h2>
          <p className="text-gray-600 mb-4">
            Help candidates discover with the right mandate in your company
          </p>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Employment type *
            </label>
            <div className="flex space-x-2">
              <button
                type="button"
                className={`px-4 py-1 rounded ${formData.employmentType === 'Fulltime' ? 'bg-black text-white' : 'bg-white border border-gray-300'}`}
                onClick={() => handleEmploymentTypeChange('Fulltime')}
              >
                Fulltime
              </button>
              <button
                type="button"
                className={`px-4 py-1 rounded ${formData.employmentType === 'Part-time' ? 'bg-black text-white' : 'bg-white border border-gray-300'}`}
                onClick={() => handleEmploymentTypeChange('Part-time')}
              >
                Part-time
              </button>
              <button
                type="button"
                className={`px-4 py-1 rounded ${formData.employmentType === 'Contract' ? 'bg-black text-white' : 'bg-white border border-gray-300'}`}
                onClick={() => handleEmploymentTypeChange('Contract')}
              >
                Contract
              </button>
            </div>
          </div>
          
          <div className="mb-4">
            <label htmlFor="jobTitle" className="block text-sm font-medium text-gray-700 mb-1">
              Job Title *
            </label>
            <input
              id="jobTitle"
              name="jobTitle"
              type="text"
              placeholder="Enter the Job Title"
              className="w-full px-3 py-2 border border-gray-300 rounded"
              value={formData.jobTitle}
              onChange={handleChange}
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
              Preferred Hiring Location *
            </label>
            <select
              id="location"
              name="location"
              className="w-full px-3 py-2 border border-gray-300 rounded appearance-none bg-white"
              value={formData.location}
              onChange={handleChange}
            >
              <option value="">Multiple select</option>
              <option value="Remote">Remote</option>
              <option value="New York">New York</option>
              <option value="San Francisco">San Francisco</option>
              <option value="London">London</option>
            </select>
          </div>
          
          <div className="mb-4">
            <label htmlFor="openings" className="block text-sm font-medium text-gray-700 mb-1">
              No of Openings *
            </label>
            <input
              id="openings"
              name="openings"
              type="number"
              min="1"
              placeholder="0"
              className="w-full px-3 py-2 border border-gray-300 rounded"
              value={formData.openings}
              onChange={handleChange}
            />
          </div>
        </div>
        
        {/* Selection Criteria Section */}
        <div className="bg-white border border-gray-200 rounded-md p-6 mb-6">
          <h2 className="text-lg font-medium mb-4">Selection Criteria</h2>
          <p className="text-gray-600 mb-4">
            Qualify the talent received in screening applications to ensure the best fit for the role.
          </p>
          
          <div className="mb-4">
            <label htmlFor="education" className="block text-sm font-medium text-gray-700 mb-1">
              Minimum Education
            </label>
            <select
              id="education"
              name="education"
              className="w-full px-3 py-2 border border-gray-300 rounded appearance-none bg-white"
              value={formData.education}
              onChange={handleChange}
            >
              <option value="">Select</option>
              <option value="High School">High School</option>
              <option value="Bachelor's">Bachelor's</option>
              <option value="Master's">Master's</option>
              <option value="PhD">PhD</option>
            </select>
          </div>
          
          <div className="mb-4">
            <label htmlFor="fieldOfStudy" className="block text-sm font-medium text-gray-700 mb-1">
              Preferred Field of Study
            </label>
            <select
              id="fieldOfStudy"
              name="fieldOfStudy"
              className="w-full px-3 py-2 border border-gray-300 rounded appearance-none bg-white"
              value={formData.fieldOfStudy}
              onChange={handleChange}
            >
              <option value="">Select</option>
              <option value="Computer Science">Computer Science</option>
              <option value="Engineering">Engineering</option>
              <option value="Business">Business</option>
              <option value="Design">Design</option>
            </select>
          </div>
          
          <div className="mb-4">
            <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-1">
              Years of Experience
            </label>
            <select
              id="experience"
              name="experience"
              className="w-full px-3 py-2 border border-gray-300 rounded appearance-none bg-white"
              value={formData.experience}
              onChange={handleChange}
            >
              <option value="">Select</option>
              <option value="0-1">0-1</option>
              <option value="1-3">1-3</option>
              <option value="3-5">3-5</option>
              <option value="5+">5+</option>
            </select>
          </div>
          
          <div className="mb-4">
            <label htmlFor="skills" className="block text-sm font-medium text-gray-700 mb-1">
              Skills *
            </label>
            <select
              id="skills"
              name="skills"
              className="w-full px-3 py-2 border border-gray-300 rounded appearance-none bg-white"
              value={formData.skills}
              onChange={handleChange}
            >
              <option value="">Multiple select</option>
              <option value="JavaScript">JavaScript</option>
              <option value="React">React</option>
              <option value="Node.js">Node.js</option>
              <option value="Python">Python</option>
            </select>
          </div>
          
          <div className="mb-4">
            <label htmlFor="certifications" className="block text-sm font-medium text-gray-700 mb-1">
              Certifications (if any)
            </label>
            <select
              id="certifications"
              name="certifications"
              className="w-full px-3 py-2 border border-gray-300 rounded appearance-none bg-white"
              value={formData.certifications}
              onChange={handleChange}
            >
              <option value="">Select</option>
              <option value="AWS">AWS</option>
              <option value="Google Cloud">Google Cloud</option>
              <option value="Azure">Azure</option>
              <option value="PMP">PMP</option>
            </select>
          </div>
          
          <div className="mb-4">
            <label htmlFor="achievements" className="block text-sm font-medium text-gray-700 mb-1">
              Work Achievement/Requirements
            </label>
            <select
              id="achievements"
              name="achievements"
              className="w-full px-3 py-2 border border-gray-300 rounded appearance-none bg-white"
              value={formData.achievements}
              onChange={handleChange}
            >
              <option value="">Select</option>
              <option value="Leadership">Leadership</option>
              <option value="Project Management">Project Management</option>
              <option value="Innovation">Innovation</option>
            </select>
          </div>
        </div>
        
        {/* Form Buttons */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            className="px-6 py-2 border border-gray-300 rounded hover:bg-gray-50"
            onClick={handleCancel}
          >
            Cancel
          </button>
          <button
            type="button"
            className="px-6 py-2 bg-black text-white rounded hover:bg-gray-800"
            onClick={handleSubmit}
          >
            Post Your Job
          </button>
        </div>
      </div>
    </div>
  );
}

export default PostReferralJobPage;