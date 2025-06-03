import { useState } from 'react';
import axios from 'axios'; // We'll use axios for easier HTTP requests, especially with FormData

export default function ProfileForm() {
  const [activeTab, setActiveTab] = useState('about');
  const [formData, setFormData] = useState({
    coordinatorName: '',
    designation: '',
    collegeDetails: {
      para: '',
      collegeUniversityName: '',
      establishedYear: '',
      collegeWebsiteUrl: '',
      phoneNumber: '',
      alternatePhoneNumber: '',
      collegeLocation: '',
      state: '',
      city: '',
      country: '',
      pincode: '',
    },
    placementCoordinatorDetails: {
      para: '',
      coordinatorName: '', // This will be duplicated, but the backend uses coordinatorName from root AND placementCoordinatorDetails.coordinatorName
      designation: '', // This will be duplicated
      officialEmailId: '',
      officialContactNumber: '',
      linkedinProfile: '',
    },
    placementAndRecruitmentDetails: {
      para: '',
      programsOffered: [],
      popularCoursesForRecruitment: [],
      preferredHiringCompanies: [],
      recruitmentServicesRequired: [],
    },
    collegeProfileAchievements: {
      collegeWebsite: '',
      linkedinProfile: '',
    },
    workshops: [],
    volunteering: [],
    awards: [],
  });

  const [files, setFiles] = useState({
    collegeImage: null,
    backgroundImage: null,
    coordinatorImage: null,
    collegeBrochure: null,
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleInputChange = (e, section, subSection = null, index = null) => {
    const { name, value } = e.target;
    if (section && subSection !== null && index !== null) { // For arrays like workshops, volunteering, awards
      setFormData(prev => {
        const newArray = [...prev[section]];
        newArray[index] = { ...newArray[index], [name]: value };
        return { ...prev, [section]: newArray };
      });
    } else if (section && subSection !== null) { // For nested objects like collegeDetails
      setFormData(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [subSection]: {
            ...prev[section][subSection],
            [name]: value
          }
        }
      }));
    } else if (section) { // For top-level objects like collegeDetails (without subSection)
        setFormData(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [name]: value
            }
        }));
    }
    else { // For top-level fields
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (e) => {
    const { name, files: selectedFiles } = e.target;
    setFiles(prev => ({ ...prev, [name]: selectedFiles[0] }));
  };

  const addWorkshop = () => {
    setFormData(prev => ({
      ...prev,
      workshops: [...prev.workshops, { workshopName: '', startDate: '', endDate: '', description: '' }]
    }));
  };

  const addVolunteering = () => {
    setFormData(prev => ({
      ...prev,
      volunteering: [...prev.volunteering, { eventName: '', startDate: '', endDate: '', description: '' }]
    }));
  };

  const addAward = () => {
    setFormData(prev => ({
      ...prev,
      awards: [...prev.awards, { awardTitle: '', startDate: '', endDate: '', awardingOrganization: '' }]
    }));
  };

  const handleMultiSelectChange = (e, fieldName) => {
    const options = Array.from(e.target.selectedOptions, option => option.value);
    setFormData(prev => ({
      ...prev,
      placementAndRecruitmentDetails: {
        ...prev.placementAndRecruitmentDetails,
        [fieldName]: options
      }
    }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    const formPayload = new FormData();

    // Append top-level fields
    formPayload.append('coordinatorName', formData.coordinatorName);
    formPayload.append('designation', formData.designation);

    // Append nested objects as JSON strings
    // Backend's safeParse expects JSON strings for these
    formPayload.append('collegeDetails', JSON.stringify(formData.collegeDetails));
    formPayload.append('placementCoordinatorDetails', JSON.stringify(formData.placementCoordinatorDetails));
    formPayload.append('placementAndRecruitmentDetails', JSON.stringify(formData.placementAndRecruitmentDetails));
    formPayload.append('collegeProfileAchievements', JSON.stringify(formData.collegeProfileAchievements));

    // Append arrays as JSON strings
    formPayload.append('workshops', JSON.stringify(formData.workshops));
    formPayload.append('volunteering', JSON.stringify(formData.volunteering));
    formPayload.append('awards', JSON.stringify(formData.awards));

    // Append files
    if (files.collegeImage) formPayload.append('collegeImage', files.collegeImage);
    if (files.backgroundImage) formPayload.append('backgroundImage', files.backgroundImage);
    if (files.coordinatorImage) formPayload.append('coordinatorImage', files.coordinatorImage);
    if (files.collegeBrochure) formPayload.append('collegeBrochure', files.collegeBrochure);

    try {
      const response = await axios.post('http://localhost:5000/api/college-profile', formPayload, {
        headers: {
          'Content-Type': 'multipart/form-data', // Axios handles this automatically with FormData, but good to be explicit
        },
        withCredentials: true, // Important for sending cookies if your auth uses them
      });
      setMessage(response.data.message || 'College profile created successfully!');
      // Optionally reset form or fetch updated data
      // setFormData({ ...initial state for reset... });
      // setFiles({ ...initial state for reset... });
    } catch (err) {
      console.error('Error creating college profile:', err.response?.data || err.message);
      setError(err.response?.data?.message || 'Failed to create college profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white min-h-screen pb-12">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-10">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">About</h1>
          <p className="text-gray-600">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros.</p>
        </div>

        {message && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">{message}</div>}
        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">{error}</div>}

        <form onSubmit={handleSubmit}>
          {/* Coordinator Name and Designation (top-level fields) */}
          <div className="border border-gray-300 rounded-md p-6 mb-8">
            <h2 className="text-lg font-medium mb-4">Coordinator Basic Info</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Coordinator Name *</label>
                <input
                  type="text"
                  name="coordinatorName"
                  placeholder="Enter coordinator name"
                  className="w-full border border-gray-300 rounded p-2"
                  value={formData.coordinatorName}
                  onChange={handleInputChange}
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Designation *</label>
                <input
                  type="text"
                  name="designation"
                  placeholder="Enter designation"
                  className="w-full border border-gray-300 rounded p-2"
                  value={formData.designation}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="flex justify-end mt-4">
              <button type="submit" className="bg-black text-white px-4 py-2 rounded">Save</button>
            </div>
          </div>

          {/* College/University Details */}
          <div className="border border-gray-300 rounded-md p-6 mb-8">
            <h2 className="text-lg font-medium mb-4">College/University Details</h2>
            <p className="text-sm text-gray-600 mb-6">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">College Name *</label>
                <input
                  type="text"
                  name="collegeUniversityName"
                  placeholder="Placeholder"
                  className="w-full border border-gray-300 rounded p-2"
                  value={formData.collegeDetails.collegeUniversityName}
                  onChange={(e) => handleInputChange(e, 'collegeDetails', 'collegeUniversityName')} // Corrected this line
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">College Location *</label>
                <input
                  type="text"
                  name="collegeLocation"
                  placeholder="Placeholder"
                  className="w-full border border-gray-300 rounded p-2"
                  value={formData.collegeDetails.collegeLocation}
                  onChange={(e) => handleInputChange(e, 'collegeDetails', 'collegeLocation')}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">State</label>
                <input
                  type="text"
                  name="state"
                  placeholder="Placeholder"
                  className="w-full border border-gray-300 rounded p-2"
                  value={formData.collegeDetails.state}
                  onChange={(e) => handleInputChange(e, 'collegeDetails', 'state')}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">City</label>
                <input
                  type="text"
                  name="city"
                  placeholder="Placeholder"
                  className="w-full border border-gray-300 rounded p-2"
                  value={formData.collegeDetails.city}
                  onChange={(e) => handleInputChange(e, 'collegeDetails', 'city')}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Country</label>
                <input
                  type="text"
                  name="country"
                  placeholder="Placeholder"
                  className="w-full border border-gray-300 rounded p-2"
                  value={formData.collegeDetails.country}
                  onChange={(e) => handleInputChange(e, 'collegeDetails', 'country')}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Pincode</label>
                <input
                  type="text"
                  name="pincode"
                  placeholder="Placeholder"
                  className="w-full border border-gray-300 rounded p-2"
                  value={formData.collegeDetails.pincode}
                  onChange={(e) => handleInputChange(e, 'collegeDetails', 'pincode')}
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Established Year</label>
                <input
                  type="text"
                  name="establishedYear"
                  placeholder="e.g., 1990"
                  className="w-full border border-gray-300 rounded p-2"
                  value={formData.collegeDetails.establishedYear}
                  onChange={(e) => handleInputChange(e, 'collegeDetails', 'establishedYear')}
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">College Website URL</label>
                <input
                  type="text"
                  name="collegeWebsiteUrl"
                  placeholder="http://www.college.edu"
                  className="w-full border border-gray-300 rounded p-2"
                  value={formData.collegeDetails.collegeWebsiteUrl}
                  onChange={(e) => handleInputChange(e, 'collegeDetails', 'collegeWebsiteUrl')}
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Phone Number</label>
                <input
                  type="tel"
                  name="phoneNumber"
                  placeholder="e.g., +1234567890"
                  className="w-full border border-gray-300 rounded p-2"
                  value={formData.collegeDetails.phoneNumber}
                  onChange={(e) => handleInputChange(e, 'collegeDetails', 'phoneNumber')}
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Alternate Phone Number</label>
                <input
                  type="tel"
                  name="alternatePhoneNumber"
                  placeholder="e.g., +0987654321"
                  className="w-full border border-gray-300 rounded p-2"
                  value={formData.collegeDetails.alternatePhoneNumber}
                  onChange={(e) => handleInputChange(e, 'collegeDetails', 'alternatePhoneNumber')}
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">College Image</label>
                <input
                  type="file"
                  name="collegeImage"
                  className="w-full border border-gray-300 rounded p-2"
                  onChange={handleFileChange}
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Background Image</label>
                <input
                  type="file"
                  name="backgroundImage"
                  className="w-full border border-gray-300 rounded p-2"
                  onChange={handleFileChange}
                />
              </div>
            </div>

            <div className="flex justify-end mt-4">
              <button type="submit" className="bg-black text-white px-4 py-2 rounded">Save</button>
            </div>
          </div>

          {/* Placement Coordinator Details */}
          <div className="border border-gray-300 rounded-md p-6 mb-8">
            <h2 className="text-lg font-medium mb-4">Placement Coordinator Details</h2>
            <p className="text-sm text-gray-600 mb-6">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Coordinator name *</label>
                <input
                  type="text"
                  name="coordinatorName" // This name needs to match the schema
                  placeholder="Placeholder"
                  className="w-full border border-gray-300 rounded p-2"
                  value={formData.placementCoordinatorDetails.coordinatorName}
                  onChange={(e) => handleInputChange(e, 'placementCoordinatorDetails', 'coordinatorName')}
                />
              </div>

              <div className="md:col-span-2 flex justify-center">
                <div className="mb-4 text-center">
                  <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-2">
                    {files.coordinatorImage ? (
                      <img src={URL.createObjectURL(files.coordinatorImage)} alt="Coordinator" className="w-full h-full rounded-full object-cover" />
                    ) : (
                      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      </svg>
                    )}
                  </div>
                  <input
                    type="file"
                    id="coordinatorImage"
                    name="coordinatorImage"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                  <label htmlFor="coordinatorImage" className="bg-white border border-gray-300 text-sm px-4 py-1 rounded cursor-pointer">Upload a new photo</label>
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Designation *</label>
                <input
                  type="text"
                  name="designation"
                  placeholder="Placeholder"
                  className="w-full border border-gray-300 rounded p-2"
                  value={formData.placementCoordinatorDetails.designation}
                  onChange={(e) => handleInputChange(e, 'placementCoordinatorDetails', 'designation')}
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Official email ID *</label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 border border-r-0 border-gray-300 bg-gray-50 text-gray-500 rounded-l-md">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                    </svg>
                  </span>
                  <input
                    type="email"
                    name="officialEmailId"
                    placeholder="hello@xyz.com"
                    className="flex-1 border border-gray-300 rounded-r-md p-2"
                    value={formData.placementCoordinatorDetails.officialEmailId}
                    onChange={(e) => handleInputChange(e, 'placementCoordinatorDetails', 'officialEmailId')}
                  />
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Official Mobile No. *</label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 border border-r-0 border-gray-300 bg-gray-50 text-gray-500 rounded-l-md">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                    </svg>
                  </span>
                  <input
                    type="tel"
                    name="officialContactNumber"
                    placeholder="1234567890"
                    className="flex-1 border border-gray-300 rounded-r-md p-2"
                    value={formData.placementCoordinatorDetails.officialContactNumber}
                    onChange={(e) => handleInputChange(e, 'placementCoordinatorDetails', 'officialContactNumber')}
                  />
                </div>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">LinkedIn Profile URL</label>
                <input
                  type="text"
                  name="linkedinProfile"
                  placeholder="https://linkedin.com/in/coordinator"
                  className="w-full border border-gray-300 rounded p-2"
                  value={formData.placementCoordinatorDetails.linkedinProfile}
                  onChange={(e) => handleInputChange(e, 'placementCoordinatorDetails', 'linkedinProfile')}
                />
              </div>
            </div>

            <div className="flex justify-end mt-4">
              <button type="submit" className="bg-black text-white px-4 py-2 rounded">Save</button>
            </div>
          </div>

          {/* Placement & Recruitment Details */}
          <div className="border border-gray-300 rounded-md p-6 mb-8">
            <h2 className="text-lg font-medium mb-4">Placement & Recruitment Details</h2>
            <p className="text-sm text-gray-600 mb-6">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros.</p>

            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-sm font-medium mb-1">Programs Offered</label>
                <select
                  multiple
                  name="programsOffered"
                  className="w-full border border-gray-300 rounded p-2 bg-white h-24"
                  value={formData.placementAndRecruitmentDetails.programsOffered}
                  onChange={(e) => handleMultiSelectChange(e, 'programsOffered')}
                >
                  <option value="B.Tech">B.Tech</option>
                  <option value="M.Tech">M.Tech</option>
                  <option value="MBA">MBA</option>
                  <option value="B.Sc">B.Sc</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Popular Courses for Recruitment</label>
                <select
                  multiple
                  name="popularCoursesForRecruitment"
                  className="w-full border border-gray-300 rounded p-2 bg-white h-24"
                  value={formData.placementAndRecruitmentDetails.popularCoursesForRecruitment}
                  onChange={(e) => handleMultiSelectChange(e, 'popularCoursesForRecruitment')}
                >
                  <option value="Computer Science">Computer Science</option>
                  <option value="Electrical Engineering">Electrical Engineering</option>
                  <option value="Mechanical Engineering">Mechanical Engineering</option>
                  <option value="Civil Engineering">Civil Engineering</option>
                  <option value="Business Administration">Business Administration</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Preferred Hiring Companies</label>
                <select
                  multiple
                  name="preferredHiringCompanies"
                  className="w-full border border-gray-300 rounded p-2 bg-white h-24"
                  value={formData.placementAndRecruitmentDetails.preferredHiringCompanies}
                  onChange={(e) => handleMultiSelectChange(e, 'preferredHiringCompanies')}
                >
                  <option value="Google">Google</option>
                  <option value="Microsoft">Microsoft</option>
                  <option value="Amazon">Amazon</option>
                  <option value="TCS">TCS</option>
                  <option value="Infosys">Infosys</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Recruitment Services Required?</label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {['Job Fairs', 'Internship Support', 'Company Tie-ups', 'All'].map(service => (
                    <button
                      key={service}
                      type="button"
                      className={`px-3 py-1 rounded text-sm ${formData.placementAndRecruitmentDetails.recruitmentServicesRequired.includes(service) ? 'bg-black text-white' : 'border border-gray-300 text-gray-700'}`}
                      onClick={() => {
                        setFormData(prev => {
                          const currentServices = prev.placementAndRecruitmentDetails.recruitmentServicesRequired;
                          const newServices = currentServices.includes(service)
                            ? currentServices.filter(s => s !== service)
                            : [...currentServices, service];
                          return {
                            ...prev,
                            placementAndRecruitmentDetails: {
                              ...prev.placementAndRecruitmentDetails,
                              recruitmentServicesRequired: newServices
                            }
                          };
                        });
                      }}
                    >
                      {service}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Upload College Brochure</label>
                <div className="mt-1 flex">
                  <input
                    type="file"
                    id="collegeBrochure"
                    name="collegeBrochure"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                  <label htmlFor="collegeBrochure" className="cursor-pointer flex-1 border border-gray-300 rounded p-2 bg-white flex justify-between items-center">
                    <span className="text-gray-500">{files.collegeBrochure ? files.collegeBrochure.name : 'Upload PDF'}</span>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path>
                    </svg>
                  </label>
                </div>
              </div>
            </div>

            <div className="flex justify-end mt-4">
              <button type="submit" className="bg-black text-white px-4 py-2 rounded">Save</button>
            </div>
          </div>

          {/* College Profile & Achievements */}
          <div className="border border-gray-300 rounded-md p-6 mb-8">
            <h2 className="text-lg font-medium mb-4">College Profile & Achievements</h2>
            <p className="text-sm text-gray-600 mb-6">Showcase your institution's key highlights, achievements, and online presence!</p>

            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-sm font-medium mb-1">College Website *</label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 border border-r-0 border-gray-300 bg-gray-50 text-gray-500 rounded-l-md">
                    http://
                  </span>
                  <input
                    type="text"
                    name="collegeWebsite"
                    placeholder="www.institute.io"
                    className="flex-1 border border-gray-300 rounded-r-md p-2"
                    value={formData.collegeProfileAchievements.collegeWebsite}
                    onChange={(e) => handleInputChange(e, 'collegeProfileAchievements', 'collegeWebsite')}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">LinkedIn Profile</label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 border border-r-0 border-gray-300 bg-gray-50 text-gray-500 rounded-l-md">
                    http://
                  </span>
                  <input
                    type="text"
                    name="linkedinProfile"
                    placeholder="www.linkedin.in"
                    className="flex-1 border border-gray-300 rounded-r-md p-2"
                    value={formData.collegeProfileAchievements.linkedinProfile}
                    onChange={(e) => handleInputChange(e, 'collegeProfileAchievements', 'linkedinProfile')}
                  />
                </div>
              </div>
            </div>

            {/* Workshop & Training Programs */}
            <div className="mt-8">
              <h3 className="text-md font-medium mb-4">Workshop & Training Programs</h3>
              {formData.workshops.map((workshop, index) => (
                <div key={index} className="grid grid-cols-1 gap-4 mb-4 p-4 border border-gray-200 rounded">
                  <div>
                    <label className="block text-sm font-medium mb-1">Workshop Name *</label>
                    <input
                      type="text"
                      name="workshopName"
                      placeholder="Placeholder"
                      className="w-full border border-gray-300 rounded p-2"
                      value={workshop.workshopName}
                      onChange={(e) => handleInputChange(e, 'workshops', null, index)}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Start Date</label>
                      <input
                        type="date" // Changed to date input
                        name="startDate"
                        className="w-full border border-gray-300 rounded p-2 bg-white"
                        value={workshop.startDate}
                        onChange={(e) => handleInputChange(e, 'workshops', null, index)}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">End Date</label>
                      <input
                        type="date" // Changed to date input
                        name="endDate"
                        className="w-full border border-gray-300 rounded p-2 bg-white"
                        value={workshop.endDate}
                        onChange={(e) => handleInputChange(e, 'workshops', null, index)}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Description</label>
                    <textarea
                      name="description"
                      placeholder="Description"
                      className="w-full border border-gray-300 rounded p-2"
                      value={workshop.description}
                      onChange={(e) => handleInputChange(e, 'workshops', null, index)}
                      rows="3"
                    ></textarea>
                  </div>
                </div>
              ))}
              <div className="flex justify-end mt-2">
                <button type="button" onClick={addWorkshop} className="text-purple-600 text-sm">Add workshop</button>
              </div>
            </div>

            {/* Volunteering & Community Engagement */}
            <div className="mt-8">
              <h3 className="text-md font-medium mb-4">Volunteering & Community Engagement</h3>
              {formData.volunteering.map((event, index) => (
                <div key={index} className="grid grid-cols-1 gap-4 mb-4 p-4 border border-gray-200 rounded">
                  <div>
                    <label className="block text-sm font-medium mb-1">Event Name</label>
                    <input
                      type="text"
                      name="eventName"
                      placeholder="Placeholder"
                      className="w-full border border-gray-300 rounded p-2"
                      value={event.eventName}
                      onChange={(e) => handleInputChange(e, 'volunteering', null, index)}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Start Date</label>
                      <input
                        type="date"
                        name="startDate"
                        className="w-full border border-gray-300 rounded p-2 bg-white"
                        value={event.startDate}
                        onChange={(e) => handleInputChange(e, 'volunteering', null, index)}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">End Date</label>
                      <input
                        type="date"
                        name="endDate"
                        className="w-full border border-gray-300 rounded p-2 bg-white"
                        value={event.endDate}
                        onChange={(e) => handleInputChange(e, 'volunteering', null, index)}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Description</label>
                    <textarea
                      name="description"
                      placeholder="Description"
                      className="w-full border border-gray-300 rounded p-2"
                      value={event.description}
                      onChange={(e) => handleInputChange(e, 'volunteering', null, index)}
                      rows="3"
                    ></textarea>
                  </div>
                </div>
              ))}

              <div className="flex justify-end mt-2">
                <button type="button" onClick={addVolunteering} className="text-purple-600 text-sm">Add volunteering experience</button>
              </div>
            </div>

            {/* Awards & Recognitions */}
            <div className="mt-8">
              <h3 className="text-md font-medium mb-4">Awards & Recognitions</h3>
              {formData.awards.map((award, index) => (
                <div key={index} className="grid grid-cols-1 gap-4 mb-4 p-4 border border-gray-200 rounded">
                  <div>
                    <label className="block text-sm font-medium mb-1">Award Title *</label>
                    <input
                      type="text"
                      name="awardTitle"
                      placeholder="Placeholder"
                      className="w-full border border-gray-300 rounded p-2"
                      value={award.awardTitle}
                      onChange={(e) => handleInputChange(e, 'awards', null, index)}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Start Date</label>
                      <input
                        type="date"
                        name="startDate"
                        className="w-full border border-gray-300 rounded p-2 bg-white"
                        value={award.startDate}
                        onChange={(e) => handleInputChange(e, 'awards', null, index)}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">End Date</label>
                      <input
                        type="date"
                        name="endDate"
                        className="w-full border border-gray-300 rounded p-2 bg-white"
                        value={award.endDate}
                        onChange={(e) => handleInputChange(e, 'awards', null, index)}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Awarding Organization *</label>
                    <input
                      type="text"
                      name="awardingOrganization"
                      placeholder="Placeholder"
                      className="w-full border border-gray-300 rounded p-2"
                      value={award.awardingOrganization}
                      onChange={(e) => handleInputChange(e, 'awards', null, index)}
                    />
                  </div>
                </div>
              ))}

              <div className="flex justify-end mt-2">
                <button type="button" onClick={addAward} className="text-purple-600 text-sm">Add award</button>
              </div>
            </div>

            <div className="flex justify-end mt-8">
              <button type="submit" className="bg-black text-white px-4 py-2 rounded" disabled={loading}>
                {loading ? 'Saving...' : 'Save All Changes'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}