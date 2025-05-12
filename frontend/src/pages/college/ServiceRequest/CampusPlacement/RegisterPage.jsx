import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export default function RegisterPage({onBackClick}) {
  const [formData, setFormData] = useState({
    degree: '',
    lookingFor: ['job'],
    employmentType: 'Full-time',
    salaryRange: 'USD',
    salaryValue: '',
    tentativeDate: '',
    rounds: [
      { id: 1, students: '', branch: '', skills: '' },
      { id: 2, students: '', branch: '', skills: '' },
      { id: 3, students: '', branch: '', skills: '' },
      { id: 4, students: '', branch: '', skills: '' },
      { id: 5, students: '', branch: '', skills: '' },
      { id: 6, students: '', branch: '', skills: '' },
    ],
    collegeLocation: '',
    state: '',
    city: '',
    country: '',
    pincode: '',
    coordinatorName: '',
    coordinatorDesignation: '',
    email: '',
    mobile: '',
    linkedinProfile: '',
    minStudents: ''
  });

  // Dropdown options
  const degreeOptions = ['B.Tech', 'M.Tech', 'MBA', 'B.Sc', 'M.Sc', 'PhD'];
  const branchOptions = ['Computer Science', 'Mechanical', 'Civil', 'Electrical', 'Electronics', 'Bio-medical'];
  const countryOptions = ['United States', 'India', 'Germany', 'Canada', 'Australia', 'Japan'];
  const designationOptions = ['Professor', 'HOD', 'Placement Officer', 'Dean', 'Coordinator'];
  const studentCountOptions = ['50+', '100+', '150+', '200+', '250+'];

  const handleLookingForToggle = (type) => {
    const current = [...formData.lookingFor];
    if (current.includes(type)) {
      setFormData({
        ...formData,
        lookingFor: current.filter(item => item !== type)
      });
    } else {
      setFormData({
        ...formData,
        lookingFor: [...current, type]
      });
    }
  };

  const handleEmploymentTypeChange = (type) => {
    setFormData({ ...formData, employmentType: type });
  };

  const handleRoundChange = (id, field, value) => {
    const updatedRounds = formData.rounds.map(round => 
      round.id === id ? { ...round, [field]: value } : round
    );
    setFormData({ ...formData, rounds: updatedRounds });
  };

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    // Add form submission logic here
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Revolutionizing Campus Recruitment</h1>
        <p className="text-sm text-gray-600 max-w-lg mx-auto">
          Our solutions include a outreach connection software with skilled employers, a recruitment platform with 
          tools for targeted training programs to bridge skill gaps, and data-driven insights for refining career 
          services and recruitment strategies.
        </p>
      </div>

      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Register for Campus Placement</h2>
        <p className="text-sm text-gray-500">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Degree Dropdown */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Degree</label>
          <div className="relative">
            <select 
              className="block w-full border border-gray-300 rounded px-3 py-2 appearance-none pr-10"
              value={formData.degree}
              onChange={(e) => handleChange('degree', e.target.value)}
            >
              <option value="">Select Degree</option>
              {degreeOptions.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              <ChevronDown size={16} />
            </div>
          </div>
        </div>

        {/* Looking For Buttons */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Looking for</label>
          <div className="flex space-x-2">
            {['job', 'internship', 'both'].map((type) => (
              <button
                key={type}
                type="button"
                className={`px-4 py-2 text-sm border rounded capitalize ${
                  formData.lookingFor.includes(type) ? 'bg-gray-200' : 'bg-white'
                }`}
                onClick={() => handleLookingForToggle(type)}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Employment Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Employment type</label>
          <div className="flex space-x-2">
            {['Part-time', 'Full-time', 'Contract'].map((type) => (
              <button
                key={type}
                type="button"
                className={`px-4 py-2 text-sm border rounded ${
                  formData.employmentType === type ? 'bg-gray-200' : 'bg-white'
                }`}
                onClick={() => handleEmploymentTypeChange(type)}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Salary Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Minimum Cut-off Salary</label>
          <div className="flex">
            <select 
              className="border border-gray-300 rounded-l px-3 py-2 w-24"
              value={formData.salaryRange}
              onChange={(e) => handleChange('salaryRange', e.target.value)}
            >
              <option>USD</option>
              <option>INR</option>
              <option>EUR</option>
            </select>
            <input
              type="number"
              className="border border-gray-300 rounded-r px-3 py-2 w-full"
              placeholder="Enter amount"
              value={formData.salaryValue}
              onChange={(e) => handleChange('salaryValue', e.target.value)}
            />
          </div>
        </div>

        {/* Tentative Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tentative Date</label>
          <input
            type="date"
            className="block w-full border border-gray-300 rounded px-3 py-2"
            value={formData.tentativeDate}
            onChange={(e) => handleChange('tentativeDate', e.target.value)}
          />
        </div>

        {/* Rounds Table */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Number of Rounds</label>
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-300">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-2 border text-left text-sm font-medium">S.No.</th>
                  <th className="px-4 py-2 border text-left text-sm font-medium">No. of Students</th>
                  <th className="px-4 py-2 border text-left text-sm font-medium">Branch</th>
                  <th className="px-4 py-2 border text-left text-sm font-medium">Skills</th>
                </tr>
              </thead>
              <tbody>
                {formData.rounds.map((round) => (
                  <tr key={round.id}>
                    <td className="px-4 py-2 border text-sm">{round.id}</td>
                    <td className="px-4 py-2 border">
                      <input
                        type="number"
                        className="w-full px-2 py-1 border rounded"
                        value={round.students}
                        onChange={(e) => handleRoundChange(round.id, 'students', e.target.value)}
                      />
                    </td>
                    <td className="px-4 py-2 border">
                      <select
                        className="w-full px-2 py-1 border rounded"
                        value={round.branch}
                        onChange={(e) => handleRoundChange(round.id, 'branch', e.target.value)}
                      >
                        <option value="">Select Branch</option>
                        {branchOptions.map(option => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-2 border">
                      <input
                        type="text"
                        className="w-full px-2 py-1 border rounded"
                        value={round.skills}
                        onChange={(e) => handleRoundChange(round.id, 'skills', e.target.value)}
                        placeholder="Enter skills (comma separated)"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* College Location */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">College Location *</label>
          <div className="relative">
            <select 
              className="block w-full border border-gray-300 rounded px-3 py-2 appearance-none pr-10"
              value={formData.collegeLocation}
              onChange={(e) => handleChange('collegeLocation', e.target.value)}
            >
              <option value="">Select Location</option>
              <option value="Urban">Urban</option>
              <option value="Suburban">Suburban</option>
              <option value="Rural">Rural</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              <ChevronDown size={16} />
            </div>
          </div>
        </div>

        {/* State and City */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
            <input
              type="text"
              className="block w-full border border-gray-300 rounded px-3 py-2"
              placeholder="Enter state"
              value={formData.state}
              onChange={(e) => handleChange('state', e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
            <input
              type="text"
              className="block w-full border border-gray-300 rounded px-3 py-2"
              placeholder="Enter city"
              value={formData.city}
              onChange={(e) => handleChange('city', e.target.value)}
            />
          </div>
        </div>

        {/* Country and Pincode */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
            <div className="relative">
              <select 
                className="block w-full border border-gray-300 rounded px-3 py-2 appearance-none pr-10"
                value={formData.country}
                onChange={(e) => handleChange('country', e.target.value)}
              >
                <option value="">Select Country</option>
                {countryOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <ChevronDown size={16} />
              </div>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Pincode</label>
            <input
              type="text"
              className="block w-full border border-gray-300 rounded px-3 py-2"
              placeholder="Enter pincode"
              value={formData.pincode}
              onChange={(e) => handleChange('pincode', e.target.value)}
            />
          </div>
        </div>

        {/* Coordinator Details */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Coordinator Name</label>
          <input
            type="text"
            className="block w-full border border-gray-300 rounded px-3 py-2"
            placeholder="Enter name"
            value={formData.coordinatorName}
            onChange={(e) => handleChange('coordinatorName', e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Coordinator Designation *</label>
          <div className="relative">
            <select 
              className="block w-full border border-gray-300 rounded px-3 py-2 appearance-none pr-10"
              value={formData.coordinatorDesignation}
              onChange={(e) => handleChange('coordinatorDesignation', e.target.value)}
            >
              <option value="">Select Designation</option>
              {designationOptions.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              <ChevronDown size={16} />
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Official Email *</label>
          <div className="relative flex items-center">
            <div className="absolute left-3 flex items-center pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="20" height="16" x="2" y="4" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
            </div>
            <input
              type="email"
              className="block w-full border border-gray-300 rounded px-3 py-2 pl-10"
              placeholder="hello@xyz.com"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Official Mobile *</label>
          <div className="relative flex items-center">
            <div className="absolute left-3 flex items-center pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
            </div>
            <input
              type="tel"
              className="block w-full border border-gray-300 rounded px-3 py-2 pl-10"
              placeholder="1234567890"
              value={formData.mobile}
              onChange={(e) => handleChange('mobile', e.target.value)}
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn Profile</label>
          <input
            type="url"
            className="block w-full border border-gray-300 rounded px-3 py-2"
            placeholder="https://linkedin.com/in/username"
            value={formData.linkedinProfile}
            onChange={(e) => handleChange('linkedinProfile', e.target.value)}
          />
        </div>

        {/* Minimum Students */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Minimum Students</label>
          <div className="relative">
            <select 
              className="block w-full border border-gray-300 rounded px-3 py-2 appearance-none pr-10"
              value={formData.minStudents}
              onChange={(e) => handleChange('minStudents', e.target.value)}
            >
              <option value="">Select Minimum Students</option>
              {studentCountOptions.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              <ChevronDown size={16} />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-between pt-6">
        <button 
                type="button"
                onClick={onBackClick}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                ← Back to Home
              </button>
          <button
            type="submit"
            className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800 transition-colors"
          >
            Register
          </button>
        </div>
      </form>
    </div>
  );
}