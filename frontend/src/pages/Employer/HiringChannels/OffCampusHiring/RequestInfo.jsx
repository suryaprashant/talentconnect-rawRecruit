import { useState } from 'react';

export default function OffCampusHiringForm() {
  const [formData, setFormData] = useState({
    location: '',
    studentStream: [],
    criteria: '',
    minimumPackage: '',
    workLocation: [],
    jobRole: [],
    workMode: 'Hybrid',
    employmentType: 'Full-time',
    startDate: '',
    endDate: '',
    numberOfRounds: '',
    processOfSelection: '',
    contactPerson: {
      name: '',
      designation: '',
      email: '',
      mobile: '',
      linkedin: '',
    },
    minimumStudents: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleContactChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      contactPerson: {
        ...formData.contactPerson,
        [name]: value,
      },
    });
  };

  const handleSubmit = () => {
    console.log('Form data submitted:', formData);
    // Here you would typically send this data to your backend
  };

  return (
    <div className="max-w-4xl mx-auto p-4 font-sans">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between mb-8">
        <div className="md:w-1/2">
          <h1 className="text-3xl font-bold mb-2">OffCampus Access:</h1>
          <h2 className="text-3xl font-bold mb-4">Hire Beyond Boundaries</h2>
        </div>
        <div className="md:w-1/2">
          <p className="text-sm">
            Reach top talent across cities, domains, and institutions—without stepping on campus. 
            OffCampus Access helps companies connect with graduates and job seekers outside the traditional 
            college setting. Whether you're hiring based on skills, offering internships, or launching a targeted 
            campaign, OffCampus Access gives you flexibility, reach, and efficiency.
          </p>
        </div>
      </div>

      {/* Registration Form */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-center mb-4">Register for Off-Campus Hiring</h2>
        <p className="text-center text-gray-500 mb-6">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>

        <div className="space-y-4 mb-6">
          <div>
            <label className="block mb-1 font-medium">Off-Campus Hiring Venue</label>
            <div className="relative">
              <select 
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full p-2 border rounded appearance-none pr-8 bg-white"
              >
                <option value="" disabled>Select location</option>
                <option value="online">Online</option>
                <option value="onsite">Onsite</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </div>
            </div>
          </div>

          <div>
            <label className="block mb-1 font-medium">Student Stream / Degree</label>
            <div className="relative">
              <select 
                name="studentStream"
                value={formData.studentStream}
                onChange={handleChange}
                className="w-full p-2 border rounded appearance-none pr-8 bg-white"
              >
                <option value="">Multiple-select</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </div>
            </div>
          </div>

          <div>
            <label className="block mb-1 font-medium">Criteria</label>
            <textarea 
              name="criteria"
              value={formData.criteria}
              onChange={handleChange}
              placeholder="Type your details..."
              className="w-full p-2 border rounded resize-none h-24"
            ></textarea>
          </div>

          <div>
            <label className="block mb-1 font-medium">Minimum Package Offered</label>
            <div className="flex">
              <div className="relative">
                <select className="py-2 px-3 border rounded-l bg-white">
                  <option>USD</option>
                </select>
              </div>
              <input 
                type="text" 
                name="minimumPackage"
                value={formData.minimumPackage}
                onChange={handleChange}
                placeholder="Placeholder" 
                className="flex-grow p-2 border border-l-0 rounded-r"
              />
            </div>
          </div>

          <div>
            <label className="block mb-1 font-medium">Work Location</label>
            <div className="relative">
              <select 
                name="workLocation"
                value={formData.workLocation}
                onChange={handleChange}
                className="w-full p-2 border rounded appearance-none pr-8 bg-white"
              >
                <option value="">Multiple-select</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Second section - From second image */}
        <div className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">Job Role</label>
            <div className="relative">
              <select 
                name="jobRole"
                value={formData.jobRole}
                onChange={handleChange}
                className="w-full p-2 border rounded appearance-none pr-8 bg-white"
              >
                <option value="">Multiple-select</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </div>
            </div>
          </div>

          <div>
            <label className="block mb-1 font-medium">Work Mode</label>
            <div className="flex space-x-2">
              <div className="inline-flex items-center">
                <input 
                  type="radio" 
                  id="hybrid"
                  name="workMode" 
                  value="Hybrid"
                  checked={formData.workMode === "Hybrid"}
                  onChange={handleChange}
                  className="sr-only"
                />
                <label 
                  htmlFor="hybrid"
                  className={`px-4 py-2 text-sm border rounded-md cursor-pointer ${formData.workMode === 'Hybrid' ? 'bg-black text-white' : 'bg-white'}`}
                >
                  Hybrid
                </label>
              </div>
              <div className="inline-flex items-center">
                <input 
                  type="radio" 
                  id="onsite"
                  name="workMode" 
                  value="On-site"
                  checked={formData.workMode === "On-site"}
                  onChange={handleChange}
                  className="sr-only"
                />
                <label 
                  htmlFor="onsite"
                  className={`px-4 py-2 text-sm border rounded-md cursor-pointer ${formData.workMode === 'On-site' ? 'bg-black text-white' : 'bg-white'}`}
                >
                  On-site
                </label>
              </div>
              <div className="inline-flex items-center">
                <input 
                  type="radio" 
                  id="remote"
                  name="workMode" 
                  value="Remote"
                  checked={formData.workMode === "Remote"}
                  onChange={handleChange}
                  className="sr-only" 
                />
                <label 
                  htmlFor="remote"
                  className={`px-4 py-2 text-sm border rounded-md cursor-pointer ${formData.workMode === 'Remote' ? 'bg-black text-white' : 'bg-white'}`}
                >
                  Remote
                </label>
              </div>
            </div>
          </div>

          <div>
            <label className="block mb-1 font-medium">Employment type</label>
            <div className="flex space-x-2">
              <div className="inline-flex items-center">
                <input 
                  type="radio" 
                  id="parttime"
                  name="employmentType" 
                  value="Part-time"
                  checked={formData.employmentType === "Part-time"}
                  onChange={handleChange}
                  className="sr-only"
                />
                <label 
                  htmlFor="parttime"
                  className={`px-4 py-2 text-sm border rounded-md cursor-pointer ${formData.employmentType === 'Part-time' ? 'bg-black text-white' : 'bg-white'}`}
                >
                  Part-time
                </label>
              </div>
              <div className="inline-flex items-center">
                <input 
                  type="radio" 
                  id="fulltime"
                  name="employmentType" 
                  value="Full-time"
                  checked={formData.employmentType === "Full-time"}
                  onChange={handleChange}
                  className="sr-only" 
                />
                <label 
                  htmlFor="fulltime"
                  className={`px-4 py-2 text-sm border rounded-md cursor-pointer ${formData.employmentType === 'Full-time' ? 'bg-black text-white' : 'bg-white'}`}
                >
                  Full-time
                </label>
              </div>
              <div className="inline-flex items-center">
                <input 
                  type="radio" 
                  id="contract"
                  name="employmentType" 
                  value="Contract"
                  checked={formData.employmentType === "Contract"}
                  onChange={handleChange}
                  className="sr-only" 
                />
                <label 
                  htmlFor="contract"
                  className={`px-4 py-2 text-sm border rounded-md cursor-pointer ${formData.employmentType === 'Contract' ? 'bg-black text-white' : 'bg-white'}`}
                >
                  Contract
                </label>
              </div>
            </div>
          </div>
          
          <div>
            <label className="block mb-1 font-medium">Tentative Date of Placement / Hiring</label>
            <div className="flex space-x-2">
              <div className="w-1/2">
                <label className="block text-xs mb-1">Start Date</label>
                <div className="relative">
                  <select 
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    className="w-full p-2 border rounded appearance-none pr-8 bg-white"
                  >
                    <option value="">Placeholder</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </div>
                </div>
              </div>
              <div className="w-1/2">
                <label className="block text-xs mb-1">End Date</label>
                <div className="relative">
                  <select 
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleChange}
                    className="w-full p-2 border rounded appearance-none pr-8 bg-white"
                  >
                    <option value="">Placeholder</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <label className="block mb-1 font-medium">Number of Rounds</label>
            <div className="relative">
              <select 
                name="numberOfRounds"
                value={formData.numberOfRounds}
                onChange={handleChange}
                className="w-full p-2 border rounded appearance-none pr-8 bg-white"
              >
                <option value="">Multiple-select</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </div>
            </div>
          </div>

          <div>
            <label className="block mb-1 font-medium">Process of Selection</label>
            <div className="relative">
              <select 
                name="processOfSelection"
                value={formData.processOfSelection}
                onChange={handleChange}
                className="w-full p-2 border rounded appearance-none pr-8 bg-white"
              >
                <option value="">Multiple-select</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </div>
            </div>
          </div>
          
          {/* Contact Person Details */}
          <div>
            <label className="block mb-1 font-medium">Contact Person</label>
            <input 
              type="text" 
              name="name"
              value={formData.contactPerson.name}
              onChange={handleContactChange}
              placeholder="Name" 
              className="w-full p-2 border rounded mb-2"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Contact person designation *</label>
            <div className="relative">
              <select 
                name="designation"
                value={formData.contactPerson.designation}
                onChange={handleContactChange}
                className="w-full p-2 border rounded appearance-none pr-8 bg-white"
              >
                <option value="">Placeholder</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </div>
            </div>
          </div>

          <div>
            <label className="block mb-1 font-medium">Contact person email *</label>
            <div className="relative flex items-center border rounded pl-2">
              <span className="text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
              </span>
              <input 
                type="email" 
                name="email"
                value={formData.contactPerson.email}
                onChange={handleContactChange}
                placeholder="hello@you.com" 
                className="w-full p-2 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block mb-1 font-medium">Contact person mobile no *</label>
            <div className="relative flex items-center border rounded pl-2">
              <span className="text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
              </span>
              <input 
                type="tel" 
                name="mobile"
                value={formData.contactPerson.mobile}
                onChange={handleContactChange}
                placeholder="1234567890" 
                className="w-full p-2 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block mb-1 font-medium">Contact person LinkedIn Profile</label>
            <input 
              type="url" 
              name="linkedin"
              value={formData.contactPerson.linkedin}
              onChange={handleContactChange}
              placeholder="http://www.resume.io" 
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Minimum Students to be Hired</label>
            <div className="relative">
              <select 
                name="minimumStudents"
                value={formData.minimumStudents}
                onChange={handleChange}
                className="w-full p-2 border rounded appearance-none pr-8 bg-white"
              >
                <option value="">Multiple-select</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </div>
            </div>
          </div>

          <div className="flex justify-end mt-6">
            <button 
              onClick={handleSubmit}
              className="px-6 py-2 bg-black text-white font-medium rounded"
            >
              Register
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}          