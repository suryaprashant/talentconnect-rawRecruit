import { useState, useEffect } from 'react';
import PageHeader from '../../components/dashboard/PageHeader.jsx' // Adjust path as needed
import Button from '../../components/ui/Button'; // Adjust path as needed
import Avatar from '../../components/ui/Avatar'; // Adjust path as needed
import Badge from '../../components/ui/Badge';
import { FiLinkedin, FiGithub, FiGlobe, FiPlus } from 'react-icons/fi';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api'; // Ensure this matches your backend URL

function Profile() {
  const [activeTab, setActiveTab] = useState('overview');
  const [switchToPro, setSwitchToPro] = useState(false); // Controls the professional dashboard fields visibility
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [profileId, setProfileId] = useState(null); // Stores the ID of the fetched/created profile

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    location: '',
    about: '',
    educationalBackground: {
      degree: '',
      institution: '',
      graduationYear: '',
      degreeCertificate: null, // File object for upload
      degreeCertificateUrl: '', // URL for display
    },
    careerGoals: {
      interestedIndustryType: '',
      interestedJobRoles: [],
      preferredJobLocations: [],
      lookingFor: '',
      employmentType: [],
    },
    skills: '', // Stored as comma-separated string for input, converted to array for backend
    workExperiences: [{
      company: '',
      jobRole: '',
      startDate: '',
      description: '',
      currentSalary: '',
      expectedSalary: ''
    }],
    socialProfiles: {
      linkedin: '',
      github: '',
      website: '',
    },
    certificationsUrls: '', // Stored as comma-separated string for input
    profileImage: null, // File object for upload
    profileImageUrl: '', // URL for display
    backgroundImage: null, // File object for upload
    backgroundImageUrl: '', // URL for display
    resume: null, // File object for upload
    resumeUrl: '', // URL for display
    createdAt: null, // To display creation date
  });

  // Derived state for easier display of arrays
  const skillsForDisplay = formData.skills ? formData.skills.split(',').map(s => s.trim()).filter(Boolean) : [];
  const careerGoalsJobRolesForDisplay = formData.careerGoals?.interestedJobRoles || [];
  const careerGoalsLocationsForDisplay = formData.careerGoals?.preferredJobLocations || [];
  const careerGoalsEmploymentTypeForDisplay = formData.careerGoals?.employmentType || [];


  // Handle general input changes (for top-level fields)
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle changes for educational background fields
  const handleEducationalBackgroundChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      educationalBackground: {
        ...prev.educationalBackground,
        [name]: value
      }
    }));
  };

  // Handle changes for career goals fields
  const handleCareerGoalsChange = (e) => {
    const { name, value } = e.target;
    if (name === 'interestedJobRoles' || name === 'preferredJobLocations' || name === 'employmentType') {
      // Convert comma-separated string into an array for these fields
      setFormData(prev => ({
        ...prev,
        careerGoals: {
          ...prev.careerGoals,
          [name]: value.split(',').map(item => item.trim()).filter(Boolean)
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        careerGoals: {
          ...prev.careerGoals,
          [name]: value
        }
      }));
    }
  };

  // Handle changes for social profiles fields
  const handleSocialProfilesChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      socialProfiles: {
        ...prev.socialProfiles,
        [name]: value
      }
    }));
  };

  // Handle changes for certifications URLs (comma-separated string)
  const handleCertificationsChange = (e) => {
    const { value } = e.target;
    setFormData(prev => ({
      ...prev,
      certificationsUrls: value,
    }));
  };

  // Handle file input changes
  const handleFileChange = (e, fieldName) => {
    const file = e.target.files[0];
    if (fieldName.includes('.')) { // For nested file fields like educationalBackground.degreeCertificate
      const [parent, child] = fieldName.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: file // Set the file object
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [fieldName]: file
      }));
    }
  };


  // Handle changes for work experience array
  const handleWorkExperienceChange = (index, field, value) => {
    const newExperiences = [...formData.workExperiences];
    newExperiences[index][field] = value;
    setFormData(prev => ({ ...prev, workExperiences: newExperiences }));
  };

  // Add a new work experience entry
  const addWorkExperience = () => {
    setFormData(prev => ({
      ...prev,
      workExperiences: [...prev.workExperiences, {
        company: '',
        jobRole: '',
        startDate: '',
        description: '',
        currentSalary: '',
        expectedSalary: ''
      }]
    }));
  };

  // --- API Calls ---

  // Function to fetch the student profile
  const fetchProfile = async () => {
    setLoading(true);
    setError(null);
    try {
      // Attempt to fetch the user's profile. In a real app, this would be based on
      // the authenticated user's ID or a specific API endpoint like /me
      const response = await axios.get(`${API_BASE_URL}/student-profiles/me`);
      const fetchedProfile = response.data.profile;

      setProfileId(fetchedProfile._id); // Store the fetched profile ID

      // Populate form data from fetched profile
      setFormData({
        fullName: fetchedProfile.fullName || '',
        email: fetchedProfile.email || '',
        phoneNumber: fetchedProfile.phoneNumber || '',
        location: fetchedProfile.location || '',
        about: fetchedProfile.about || '',
        educationalBackground: {
          degree: fetchedProfile.educationalBackground?.degree || '',
          institution: fetchedProfile.educationalBackground?.institution || '',
          graduationYear: fetchedProfile.educationalBackground?.graduationYear || '',
          degreeCertificate: null, // File input is not for display, set to null
          degreeCertificateUrl: fetchedProfile.educationalBackground?.degreeCertificateUrl || '',
        },
        careerGoals: {
          interestedIndustryType: fetchedProfile.careerGoals?.interestedIndustryType || '',
          interestedJobRoles: fetchedProfile.careerGoals?.interestedJobRoles || [],
          preferredJobLocations: fetchedProfile.careerGoals?.preferredJobLocations || [],
          lookingFor: fetchedProfile.careerGoals?.lookingFor || '',
          employmentType: fetchedProfile.careerGoals?.employmentType || [],
        },
        // Convert array to comma-separated string for input fields
        skills: fetchedProfile.skills ? fetchedProfile.skills.join(', ') : '',
        workExperiences: fetchedProfile.workExperiences || [{
          company: '', jobRole: '', startDate: '', description: '', currentSalary: '', expectedSalary: ''
        }],
        socialProfiles: {
          linkedin: fetchedProfile.socialProfiles?.linkedin || '',
          github: fetchedProfile.socialProfiles?.github || '',
          website: fetchedProfile.socialProfiles?.website || '',
        },
        // Convert array to comma-separated string for input fields
        certificationsUrls: fetchedProfile.certificationsUrls ? fetchedProfile.certificationsUrls.join(', ') : '',
        profileImage: null,
        profileImageUrl: fetchedProfile.profileImageUrl || '',
        backgroundImage: null,
        backgroundImageUrl: fetchedProfile.backgroundImageUrl || '',
        resume: null,
        resumeUrl: fetchedProfile.resumeUrl || '',
        createdAt: fetchedProfile.createdAt,
      });
    } catch (err) {
      console.error('Error fetching profile:', err);
      // If profile not found (404), allow creation by setting profileId to null
      if (axios.isAxiosError(err) && err.response && err.response.status === 404) {
        setProfileId(null); // No existing profile, so we'll create one
        setFormData({ // Reset to initial empty state for creation
          fullName: '', email: '', phoneNumber: '', location: '', about: '',
          educationalBackground: { degree: '', institution: '', graduationYear: '', degreeCertificate: null, degreeCertificateUrl: '' },
          careerGoals: { interestedIndustryType: '', interestedJobRoles: [], preferredJobLocations: [], lookingFor: '', employmentType: [] },
          skills: '', workExperiences: [{ company: '', jobRole: '', startDate: '', description: '', currentSalary: '', expectedSalary: '' }],
          socialProfiles: { linkedin: '', github: '', website: '' }, certificationsUrls: '',
          profileImage: null, profileImageUrl: '', backgroundImage: null, backgroundImageUrl: '', resume: null, resumeUrl: '',
          createdAt: null,
        });
      } else {
        setError('Failed to load profile data. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Fetch profile on component mount
  useEffect(() => {
    fetchProfile();
  }, []); // Empty dependency array means this runs once on mount


  // Handle form submission (create or update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const data = new FormData();

    // Append files if they are newly selected
    if (formData.profileImage) data.append('profileImage', formData.profileImage);
    if (formData.backgroundImage) data.append('backgroundImage', formData.backgroundImage);
    if (formData.resume) data.append('resume', formData.resume);
    if (formData.educationalBackground.degreeCertificate) data.append('degreeCertificate', formData.educationalBackground.degreeCertificate);

    // Prepare the JSON data field, converting arrays from comma-separated strings if necessary
    // Also, ensure existing URLs are passed if no new file is uploaded
    const profileData = {
      fullName: formData.fullName,
      email: formData.email,
      phoneNumber: formData.phoneNumber,
      location: formData.location,
      about: formData.about,
      educationalBackground: {
        degree: formData.educationalBackground.degree,
        institution: formData.educationalBackground.institution,
        graduationYear: formData.educationalBackground.graduationYear,
        // Pass the existing URL if no new file was selected for the certificate
        degreeCertificateUrl: formData.educationalBackground.degreeCertificateUrl,
      },
      careerGoals: {
        interestedIndustryType: formData.careerGoals.interestedIndustryType,
        // Ensure these are arrays for the backend
        interestedJobRoles: Array.isArray(formData.careerGoals.interestedJobRoles) ? formData.careerGoals.interestedJobRoles : formData.careerGoals.interestedJobRoles.split(',').map(s => s.trim()).filter(Boolean),
        preferredJobLocations: Array.isArray(formData.careerGoals.preferredJobLocations) ? formData.careerGoals.preferredJobLocations : formData.careerGoals.preferredJobLocations.split(',').map(s => s.trim()).filter(Boolean),
        lookingFor: formData.careerGoals.lookingFor,
        employmentType: Array.isArray(formData.careerGoals.employmentType) ? formData.careerGoals.employmentType : formData.careerGoals.employmentType.split(',').map(s => s.trim()).filter(Boolean),
      },
      // Convert skills string to array
      skills: formData.skills.split(',').map(s => s.trim()).filter(Boolean),
      workExperiences: formData.workExperiences, // Already an array
      socialProfiles: formData.socialProfiles, // Already an object
      // Convert certificationsUrls string to array
      certificationsUrls: formData.certificationsUrls.split(',').map(url => url.trim()).filter(Boolean),
    };

    data.append('data', JSON.stringify(profileData));

    try {
      let response;
      if (profileId) {
        // If a profile exists (we have a profileId), update it
        response = await axios.put(`${API_BASE_URL}/student-profiles/${profileId}`, data, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        console.log('Profile updated successfully:', response.data);
        alert('Profile updated successfully!');
      } else {
        // Otherwise, create a new one
        response = await axios.post(`${API_BASE_URL}/student-profiles`, data, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        console.log('Profile created successfully:', response.data);
        alert('Profile created successfully!');
        setProfileId(response.data.profile._id); // Store the ID of the newly created profile
      }
      // Re-fetch profile to update UI with latest data and Cloudinary URLs
      fetchProfile();
    } catch (err) {
      console.error('Error saving profile:', err.response ? err.response.data : err.message);
      setError(err.response ? err.response.data.message : 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  // Display loading and error states
  if (loading && !profileId) { // Only show full loading screen if no profile was fetched yet
    return <div className="text-center py-8">Loading profile...</div>;
  }

  if (error && !profileId) { // Only show error if no profile was ever loaded/created
    return <div className="text-center py-8 text-red-500">Error: {error}</div>;
  }

  // When switchToPro is true, render the professional dashboard fields
  if (switchToPro) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Avatar size="lg" name={formData.fullName || "Name Surname"} src={formData.profileImageUrl} />
              <div>
                <h2 className="text-xl font-semibold text-gray-900">{formData.fullName || "Name Surname"}</h2>
                <p className="text-gray-600">{formData.email || "hello@gmail.com"}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Switch to Professional</span>
              <button
                className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-black bg-black transition-colors duration-200 ease-in-out focus:outline-none"
                role="switch"
                aria-checked={true}
                onClick={() => setSwitchToPro(false)}
              >
                <span className="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out translate-x-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Upload your recent resume or CV</h3>
            <p className="mt-1 text-sm text-gray-600">
              Your most recent resume helps recruiters understand your experience better.
            </p>
            <div className="mt-4">
              <input
                type="file"
                className="hidden"
                id="pro-resume-upload"
                accept=".pdf,.doc,.docx"
                onChange={(e) => handleFileChange(e, 'resume')}
              />
              <label
                htmlFor="pro-resume-upload"
                className="cursor-pointer inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-black hover:bg-gray-900"
              >
                Upload Resume
              </label>
              {formData.resume && (
                <p className="mt-2 text-sm text-gray-600">Selected: {formData.resume.name}</p>
              )}
              {formData.resumeUrl && !formData.resume && (
                <p className="mt-2 text-sm text-gray-600">Current Resume: <a href={formData.resumeUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">View</a></p>
              )}
            </div>
          </div>

          <form className="p-6 space-y-6" onSubmit={handleSubmit}>
            <h3 className="text-xl font-semibold text-gray-900 mb-6">
              Professional Dashboard!
            </h3>
            <p className="text-gray-600 mb-6">
              Let us know your job interests and preferred locations so we can recommend the best opportunities for you.
            </p>

            {/* Work Experience Section */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Work Experience
                </label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={addWorkExperience}
                  type="button"
                  className="border-black text-black hover:bg-gray-50"
                >
                  <FiPlus className="w-4 h-4 mr-2" />
                  Add Experience
                </Button>
              </div>
              {formData.workExperiences.map((exp, index) => (
                <div key={index} className="space-y-4 p-4 border border-gray-200 rounded-lg mb-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor={`company-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                        Company
                      </label>
                      <input
                        type="text"
                        id={`company-${index}`}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                        value={exp.company}
                        onChange={(e) => handleWorkExperienceChange(index, 'company', e.target.value)}
                        placeholder="Company Name"
                      />
                    </div>
                    <div>
                      <label htmlFor={`jobRole-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                        Job Role
                      </label>
                      <input
                        type="text"
                        id={`jobRole-${index}`}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                        value={exp.jobRole}
                        onChange={(e) => handleWorkExperienceChange(index, 'jobRole', e.target.value)}
                        placeholder="e.g., Software Engineer"
                      />
                    </div>
                    <div>
                      <label htmlFor={`startDate-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                        Start Date
                      </label>
                      <input
                        type="date"
                        id={`startDate-${index}`}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                        value={exp.startDate ? new Date(exp.startDate).toISOString().split('T')[0] : ''} // Format date for input
                        onChange={(e) => handleWorkExperienceChange(index, 'startDate', e.target.value)}
                      />
                    </div>
                    {/* Add End Date and Current checkbox if needed in model */}
                  </div>
                  <div>
                    <label htmlFor={`description-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      id={`description-${index}`}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                      rows="3"
                      value={exp.description}
                      onChange={(e) => handleWorkExperienceChange(index, 'description', e.target.value)}
                      placeholder="Describe your role and responsibilities"
                    ></textarea>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor={`currentSalary-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                        Current Salary
                      </label>
                      <div className="flex">
                        <span className="inline-flex items-center px-3 text-gray-500 bg-gray-50 border border-r-0 border-gray-300 rounded-l-md">
                          USD
                        </span>
                        <input
                          type="text"
                          id={`currentSalary-${index}`}
                          className="w-full px-3 py-2 border border-gray-300 rounded-none rounded-r-md focus:outline-none focus:ring-2 focus:ring-black"
                          value={exp.currentSalary}
                          onChange={(e) => handleWorkExperienceChange(index, 'currentSalary', e.target.value)}
                          placeholder="Enter amount"
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor={`expectedSalary-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                        Expected Salary
                      </label>
                      <div className="flex">
                        <span className="inline-flex items-center px-3 text-gray-500 bg-gray-50 border border-r-0 border-gray-300 rounded-l-md">
                          USD
                        </span>
                        <input
                          type="text"
                          id={`expectedSalary-${index}`}
                          className="w-full px-3 py-2 border border-gray-300 rounded-none rounded-r-md focus:outline-none focus:ring-2 focus:ring-black"
                          value={exp.expectedSalary}
                          onChange={(e) => handleWorkExperienceChange(index, 'expectedSalary', e.target.value)}
                          placeholder="Enter amount"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Career Goals */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Career Goals</h3>
              <div className="space-y-4">
                <div>
                  <label htmlFor="interestedIndustryType" className="block text-sm font-medium text-gray-700 mb-1">
                    Interested Industry Type
                  </label>
                  <input
                    type="text"
                    id="interestedIndustryType"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                    name="interestedIndustryType"
                    value={formData.careerGoals.interestedIndustryType}
                    onChange={handleCareerGoalsChange}
                    placeholder="e.g., IT Industry, Healthcare"
                  />
                </div>
                <div>
                  <label htmlFor="interestedJobRoles" className="block text-sm font-medium text-gray-700 mb-1">
                    Interested Job Roles (comma separated)
                  </label>
                  <textarea
                    id="interestedJobRoles"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                    rows="2"
                    name="interestedJobRoles"
                    // Convert array to string for display in textarea
                    value={Array.isArray(formData.careerGoals.interestedJobRoles) ? formData.careerGoals.interestedJobRoles.join(', ') : formData.careerGoals.interestedJobRoles}
                    onChange={handleCareerGoalsChange}
                    placeholder="e.g., Software Engineer, Data Analyst"
                  ></textarea>
                </div>
                <div>
                  <label htmlFor="preferredJobLocations" className="block text-sm font-medium text-gray-700 mb-1">
                    Preferred Job Locations (comma separated)
                  </label>
                  <textarea
                    id="preferredJobLocations"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                    rows="2"
                    name="preferredJobLocations"
                     // Convert array to string for display in textarea
                    value={Array.isArray(formData.careerGoals.preferredJobLocations) ? formData.careerGoals.preferredJobLocations.join(', ') : formData.careerGoals.preferredJobLocations}
                    onChange={handleCareerGoalsChange}
                    placeholder="e.g., Noida, Bangalore, Remote"
                  ></textarea>
                </div>
                <div>
                  <label htmlFor="lookingFor" className="block text-sm font-medium text-gray-700 mb-1">
                    Looking For
                  </label>
                  <select
                    id="lookingFor"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                    name="lookingFor"
                    value={formData.careerGoals.lookingFor}
                    onChange={handleCareerGoalsChange}
                  >
                    <option value="">Select option</option>
                    <option value="Internship">Internship</option>
                    <option value="Full-time Job">Full-time Job</option>
                    <option value="Part-time Job">Part-time Job</option>
                    <option value="Contract">Contract</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="employmentType" className="block text-sm font-medium text-gray-700 mb-1">
                    Employment Type (comma separated)
                  </label>
                  <textarea
                    id="employmentType"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                    rows="2"
                    name="employmentType"
                    // Convert array to string for display in textarea
                    value={Array.isArray(formData.careerGoals.employmentType) ? formData.careerGoals.employmentType.join(', ') : formData.careerGoals.employmentType}
                    onChange={handleCareerGoalsChange}
                    placeholder="e.g., Full-time, Remote, Hybrid"
                  ></textarea>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
              <Button
                variant="outline"
                onClick={() => setSwitchToPro(false)}
                className="border-black text-black hover:bg-gray-50"
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                type="submit"
                className="bg-black hover:bg-gray-900"
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Save Profile'}
              </Button>
            </div>
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          </form>
        </div>
      </div>
    );
  }

  // Default view (Overview, Profile, Resume tabs)
  return (
    <div>
      <PageHeader
        title="Profile"
        createdAt={formData.createdAt ? new Date(formData.createdAt).toLocaleDateString() : "N/A"}
      />

      {/* Profile Header */}
      <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm mb-6">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          <Avatar size="xl" name={formData.fullName || "Name Surname"} src={formData.profileImageUrl} />
          <div className="flex-1">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{formData.fullName || "Name Surname"}</h2>
                <p className="text-gray-600">{formData.email || "hello@demo.io"}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Switch to Professional</span>
                <button
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    switchToPro ? 'bg-black' : 'bg-gray-200'
                  }`}
                  role="switch"
                  aria-checked={switchToPro}
                  onClick={() => setSwitchToPro(!switchToPro)}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      switchToPro ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex space-x-8">
          {['overview', 'profile', 'resume'].map((tab) => (
            <button
              key={tab}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab
                  ? 'border-black text-black'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </nav>
      </div>

      {/* Overview Tab Content */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
            <h3 className="text-lg font-medium text-gray-900 mb-4">What recruiters will see</h3>
            <div className="border-2 border-gray-200 rounded-lg divide-y divide-gray-200">
              <div className="p-6">
                <div className="flex items-start gap-4">
                  <Avatar size="lg" name={formData.fullName || "Name Surname"} src={formData.profileImageUrl} />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
                      <div>
                        <h4 className="text-lg font-medium text-gray-900">{formData.fullName || "Name Surname"}</h4>
                        <p className="text-sm text-gray-600">
                          {formData.educationalBackground?.institution || "N/A Institution"}, {formData.educationalBackground?.graduationYear || "N/A Year"}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        {formData.socialProfiles.linkedin && (
                          <Button variant="outline" size="sm" className="border-black text-black hover:bg-gray-50"
                            onClick={() => window.open(formData.socialProfiles.linkedin, '_blank')}
                          >
                            <FiLinkedin className="w-4 h-4" />
                          </Button>
                        )}
                        {formData.socialProfiles.github && (
                          <Button variant="outline" size="sm" className="border-black text-black hover:bg-gray-50"
                            onClick={() => window.open(formData.socialProfiles.github, '_blank')}
                          >
                            <FiGithub className="w-4 h-4" />
                          </Button>
                        )}
                        {formData.socialProfiles.website && (
                          <Button variant="outline" size="sm" className="border-black text-black hover:bg-gray-50"
                            onClick={() => window.open(formData.socialProfiles.website, '_blank')}
                          >
                            <FiGlobe className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="p-4 border border-gray-200 rounded-lg">
                        <h5 className="font-medium text-gray-900 mb-2">About</h5>
                        <p className="text-gray-600">{formData.about || "No 'About' section provided yet."}</p>
                      </div>

                      <div className="p-4 border border-gray-200 rounded-lg">
                        <h5 className="font-medium text-gray-900 mb-2">Contact Information</h5>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-gray-500">Email address</p>
                            <p className="text-gray-900">{formData.email || "N/A"}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Mobile Number</p>
                            <p className="text-gray-900">{formData.phoneNumber || "N/A"}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Location</p>
                            <p className="text-gray-900">{formData.location || "N/A"}</p>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 border border-gray-200 rounded-lg">
                        <h5 className="font-medium text-gray-900 mb-2">Education</h5>
                        <p className="text-gray-900">{formData.educationalBackground.degree || "N/A Degree"}</p>
                        <p className="text-gray-600">
                          {formData.educationalBackground.institution || "N/A Institution"}, {formData.educationalBackground.graduationYear || "N/A Year"}
                        </p>
                        {formData.educationalBackground.degreeCertificateUrl && (
                          <p className="mt-2 text-sm text-gray-600">
                            Certificate: <a href={formData.educationalBackground.degreeCertificateUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">View Certificate</a>
                          </p>
                        )}
                      </div>

                      <div className="p-4 border border-gray-200 rounded-lg">
                        <h5 className="font-medium text-gray-900 mb-2">Skills</h5>
                        <div className="flex flex-wrap gap-2">
                          {skillsForDisplay.length > 0 ? (
                            skillsForDisplay.map((skill) => (
                              <Badge key={skill} variant="primary" size="md" className="bg-gray-100 text-gray-800">
                                {skill}
                              </Badge>
                            ))
                          ) : (
                            <p className="text-gray-600 text-sm">No skills added yet.</p>
                          )}
                        </div>
                      </div>

                      <div className="p-4 border border-gray-200 rounded-lg">
                        <h5 className="font-medium text-gray-900 mb-2">Interested Industry Type</h5>
                        {formData.careerGoals.interestedIndustryType ? (
                          <Badge variant="primary" size="md" className="bg-gray-100 text-gray-800">{formData.careerGoals.interestedIndustryType}</Badge>
                        ) : (
                          <p className="text-gray-600 text-sm">No industry type specified.</p>
                        )}
                      </div>

                      <div className="p-4 border border-gray-200 rounded-lg">
                        <h5 className="font-medium text-gray-900 mb-2">Interested Job Roles</h5>
                        <div className="flex flex-wrap gap-2">
                          {careerGoalsJobRolesForDisplay.length > 0 ? (
                            careerGoalsJobRolesForDisplay.map((role) => (
                              <Badge key={role} variant="primary" size="md" className="bg-gray-100 text-gray-800">
                                {role}
                              </Badge>
                            ))
                          ) : (
                            <p className="text-gray-600 text-sm">No job roles specified.</p>
                          )}
                        </div>
                      </div>

                      <div className="p-4 border border-gray-200 rounded-lg">
                        <h5 className="font-medium text-gray-900 mb-2">Preferred Job Locations</h5>
                        <div className="flex flex-wrap gap-2">
                          {careerGoalsLocationsForDisplay.length > 0 ? (
                            careerGoalsLocationsForDisplay.map((location) => (
                              <Badge key={location} variant="primary" size="md" className="bg-gray-100 text-gray-800">
                                {location}
                              </Badge>
                            ))
                          ) : (
                            <p className="text-gray-600 text-sm">No preferred locations specified.</p>
                          )}
                        </div>
                      </div>

                      <div className="p-4 border border-gray-200 rounded-lg">
                        <h5 className="font-medium text-gray-900 mb-2">Looking for</h5>
                        {formData.careerGoals.lookingFor ? (
                          <Badge variant="primary" size="md" className="bg-gray-100 text-gray-800">{formData.careerGoals.lookingFor}</Badge>
                        ) : (
                          <p className="text-gray-600 text-sm">Not specified.</p>
                        )}
                      </div>

                      <div className="p-4 border border-gray-200 rounded-lg">
                        <h5 className="font-medium text-gray-900 mb-2">Employment Type</h5>
                        <div className="flex flex-wrap gap-2">
                          {careerGoalsEmploymentTypeForDisplay.length > 0 ? (
                            careerGoalsEmploymentTypeForDisplay.map((type) => (
                              <Badge key={type} variant="primary" size="md" className="bg-gray-100 text-gray-800">
                                {type}
                              </Badge>
                            ))
                          ) : (
                            <p className="text-gray-600 text-sm">No employment type specified.</p>
                          )}
                        </div>
                      </div>

                      <div className="p-4 border border-gray-200 rounded-lg">
                        <h5 className="font-medium text-gray-900 mb-2">Certifications</h5>
                        <div className="flex flex-wrap gap-2">
                          {formData.certificationsUrls && formData.certificationsUrls.split(',').map(url => url.trim()).filter(Boolean).length > 0 ? (
                            formData.certificationsUrls.split(',').map(url => url.trim()).filter(Boolean).map((cert, index) => (
                              <a key={index} href={cert} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm block">
                                Certification {index + 1}
                              </a>
                            ))
                          ) : (
                            <p className="text-gray-600 text-sm">No certifications added yet.</p>
                          )}
                        </div>
                      </div>

                    </div> {/* End of space-y-6 */}
                  </div> {/* End of flex-1 */}
                </div> {/* End of flex items-start gap-4 */}
              </div> {/* End of p-6 (inner) */}
            </div> {/* End of border-2 border-gray-200 */}
          </div> {/* End of p-6 bg-white (outer) */}
        </div>
      )}

      {/* Profile Tab Content (Edit General Info) */}
      {activeTab === 'profile' && (
        <div className="space-y-6">
          <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="fullName"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="Enter your full name"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="Enter your email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phoneNumber"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="Enter your phone number"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                      Location
                    </label>
                    <input
                      type="text"
                      id="location"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="Enter your location"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">About</h3>
                <textarea
                  id="about"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  rows="4"
                  placeholder="Tell us about yourself, your goals, and experience."
                  name="about"
                  value={formData.about}
                  onChange={handleInputChange}
                ></textarea>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Education</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="degree" className="block text-sm font-medium text-gray-700 mb-1">
                      Degree
                    </label>
                    <input
                      type="text"
                      id="degree"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="e.g., Bachelor of Technology, Computer Science"
                      name="degree"
                      value={formData.educationalBackground.degree}
                      onChange={handleEducationalBackgroundChange}
                    />
                  </div>
                  <div>
                    <label htmlFor="institution" className="block text-sm font-medium text-gray-700 mb-1">
                      Institution
                    </label>
                    <input
                      type="text"
                      id="institution"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="e.g., College of Engineering"
                      name="institution"
                      value={formData.educationalBackground.institution}
                      onChange={handleEducationalBackgroundChange}
                    />
                  </div>
                  <div>
                    <label htmlFor="graduationYear" className="block text-sm font-medium text-gray-700 mb-1">
                      Year of Graduation
                    </label>
                    <input
                      type="text"
                      id="graduationYear"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="e.g., 2023 or Expected 2025"
                      name="graduationYear"
                      value={formData.educationalBackground.graduationYear}
                      onChange={handleEducationalBackgroundChange}
                    />
                  </div>
                  <div>
                    <label htmlFor="degreeCertificate" className="block text-sm font-medium text-gray-700 mb-1">
                      Degree Certificate
                    </label>
                    <input
                      type="file"
                      id="degreeCertificate"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                      onChange={(e) => handleFileChange(e, 'educationalBackground.degreeCertificate')}
                    />
                    {formData.educationalBackground.degreeCertificate && (
                      <p className="text-sm text-gray-500 mt-1">Selected: {formData.educationalBackground.degreeCertificate.name}</p>
                    )}
                    {formData.educationalBackground.degreeCertificateUrl && !formData.educationalBackground.degreeCertificate && (
                      <p className="text-sm text-gray-500 mt-1">Current: <a href={formData.educationalBackground.degreeCertificateUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">View Certificate</a></p>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Skills</h3>
                <textarea
                  id="skills"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  rows="3"
                  placeholder="Enter your skills (comma separated, e.g., React, Node.js, MongoDB)"
                  name="skills"
                  value={formData.skills}
                  onChange={handleInputChange}
                ></textarea>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Social Profiles</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="linkedin" className="block text-sm font-medium text-gray-700 mb-1">
                      LinkedIn URL
                    </label>
                    <input
                      type="text"
                      id="linkedin"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="https://linkedin.com/in/yourprofile"
                      name="linkedin"
                      value={formData.socialProfiles.linkedin}
                      onChange={handleSocialProfilesChange}
                    />
                  </div>
                  <div>
                    <label htmlFor="github" className="block text-sm font-medium text-gray-700 mb-1">
                      GitHub URL
                    </label>
                    <input
                      type="text"
                      id="github"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="https://github.com/yourprofile"
                      name="github"
                      value={formData.socialProfiles.github}
                      onChange={handleSocialProfilesChange}
                    />
                  </div>
                  <div>
                    <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-1">
                      Personal Website URL
                    </label>
                    <input
                      type="text"
                      id="website"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="https://yourwebsite.com"
                      name="website"
                      value={formData.socialProfiles.website}
                      onChange={handleSocialProfilesChange}
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Certifications URLs</h3>
                <textarea
                  id="certificationsUrls"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  rows="3"
                  placeholder="Enter comma-separated URLs of your certifications (e.g., https://cert1.com, https://cert2.com)"
                  name="certificationsUrls"
                  value={formData.certificationsUrls}
                  onChange={handleCertificationsChange}
                ></textarea>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Profile & Background Images</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="profileImage" className="block text-sm font-medium text-gray-700 mb-1">
                      Profile Image
                    </label>
                    <input
                      type="file"
                      id="profileImage"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, 'profileImage')}
                    />
                    {formData.profileImage && (
                      <p className="text-sm text-gray-500 mt-1">Selected: {formData.profileImage.name}</p>
                    )}
                    {formData.profileImageUrl && !formData.profileImage && (
                      <p className="text-sm text-gray-500 mt-1">Current: <a href={formData.profileImageUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">View Image</a></p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="backgroundImage" className="block text-sm font-medium text-gray-700 mb-1">
                      Background Image
                    </label>
                    <input
                      type="file"
                      id="backgroundImage"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, 'backgroundImage')}
                    />
                    {formData.backgroundImage && (
                      <p className="text-sm text-gray-500 mt-1">Selected: {formData.backgroundImage.name}</p>
                    )}
                    {formData.backgroundImageUrl && !formData.backgroundImage && (
                      <p className="text-sm text-gray-500 mt-1">Current: <a href={formData.backgroundImageUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">View Image</a></p>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button variant="primary" type="submit" disabled={loading}>
                  {loading ? 'Saving Changes...' : 'Save Changes'}
                </Button>
              </div>
              {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            </form>
          </div>
        </div>
      )}

      {/* Resume Tab Content */}
      {activeTab === 'resume' && (
        <div className="space-y-6">
          <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Upload your resume/CV</h3>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <input
                type="file"
                className="hidden"
                id="resume-upload"
                accept=".pdf,.doc,.docx"
                onChange={(e) => handleFileChange(e, 'resume')}
              />
              <label
                htmlFor="resume-upload"
                className="cursor-pointer inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-black hover:bg-gray-900"
              >
                Upload Resume
              </label>
              {formData.resume && (
                <p className="mt-2 text-sm text-gray-600">Selected: {formData.resume.name}</p>
              )}
              {formData.resumeUrl && !formData.resume && (
                <p className="mt-2 text-sm text-gray-600">Current Resume: <a href={formData.resumeUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">View Resume</a></p>
              )}
              <p className="mt-2 text-sm text-gray-600">
                Supported formats: PDF, DOC, DOCX
              </p>
            </div>
            <div className="flex justify-end mt-6">
              <Button variant="primary" onClick={handleSubmit} disabled={loading || !formData.resume}>
                {loading ? 'Uploading Resume...' : 'Save Resume'}
              </Button>
            </div>
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;