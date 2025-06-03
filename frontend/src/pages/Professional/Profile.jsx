import { useState, useEffect } from 'react';
import PageHeader from '@/components/dashboard/PageHeader';
import Button from '@/components/ui/Button';
import Avatar from '@/components/ui/Avatar';
import Badge from '@/components/ui/Badge';
import { FiLinkedin, FiGithub, FiGlobe, FiPlus } from 'react-icons/fi';
import axios from 'axios'; // Import axios

function ProfProfile() {
  const [activeTab, setActiveTab] = useState('overview');
  const [switchToPro, setSwitchToPro] = useState(false);

  // State for form data
  const [profileData, setProfileData] = useState({
    about: {
      name: '',
      email: '',
      mobileNumber: '',
      paragraph: '',
    },
    educationalBackground: {
      collegeUniversity: '',
      degree: '',
      yearOfGraduation: '',
      currentCgpa: '',
      degreeCertificate: null, // File object
    },
    careerGoals: {
      interestedIndustryType: '',
      interestedJobRoles: [],
      preferredJobLocations: [],
      employmentType: [],
      lookingFor: '',
      currentSalary: '',
      expectedSalary: '',
    },
    jobDetails: {
      jobTitle: '',
      location: '',
      startDate: '',
      description: '',
    },
    workExperience: [],
    internationalWorkExperience: [],
    awardsRecognitions: [],
    leadershipExperience: [],
    skills: {
      skillParagraph: '',
      skillList: [],
    },
    socialProfiles: {
      linkedinUrl: '',
      githubUrl: '',
      portfolioUrl: '',
      resume: null, // File object
    },
    certificationsUrls: [],
    language: '',
    profileImage: null, // File object
    backgroundImage: null, // File object
    resume: null, // This is for the main resume upload section
  });

  // Dummy data for select options or initial display
  const skillsOptions = [
    'SQL', 'REST', 'CSS 3', 'HTML 5', 'Node.js', 'React.js',
    'AWS S3', 'AWS IAM', 'AWS EC2', 'AWS RDS', 'AWS ECS'
  ];

  const locationsOptions = ['Noida', 'Delhi', 'Gurgaon', 'Bangalore', 'Pune', 'Mumbai', 'Hyderabad'];

  // Handlers for nested state
  const handleChange = (section, field, value) => {
    setProfileData(prevData => ({
      ...prevData,
      [section]: {
        ...prevData[section],
        [field]: value,
      },
    }));
  };

  const handleArrayChange = (section, value) => {
    setProfileData(prevData => ({
      ...prevData,
      [section]: value,
    }));
  };

  const handleFileChange = (field, file) => {
    setProfileData(prevData => ({
      ...prevData,
      [field]: file,
    }));
  };

  const handleNestedFileChange = (section, field, file) => {
    setProfileData(prevData => ({
      ...prevData,
      [section]: {
        ...prevData[section],
        [field]: file,
      },
    }));
  };

  const handleExperienceChange = (section, index, field, value) => {
    const newExperiences = [...profileData[section]];
    newExperiences[index][field] = value;
    setProfileData(prevData => ({
      ...prevData,
      [section]: newExperiences,
    }));
  };

  const addExperience = (section) => {
    setProfileData(prevData => ({
      ...prevData,
      [section]: [...prevData[section], {
        companyName: '',
        jobRole: '',
        startDate: '',
        endDate: '', // Added endDate for consistency with model
        description: '',
        experienceCertificate: null, // File object for experience certificates
      }],
    }));
  };

  const removeExperience = (section, index) => {
    setProfileData(prevData => ({
      ...prevData,
      [section]: prevData[section].filter((_, i) => i !== index),
    }));
  };

  const handleSkillListChange = (e) => {
    setProfileData(prevData => ({
      ...prevData,
      skills: {
        ...prevData.skills,
        skillList: e.target.value.split(',').map(skill => skill.trim()),
      },
    }));
  };

  const handleInterestedJobRolesChange = (e) => {
    const { options } = e.target;
    const value = [];
    for (let i = 0, l = options.length; i < l; i++) {
      if (options[i].selected) {
        value.push(options[i].value);
      }
    }
    handleChange('careerGoals', 'interestedJobRoles', value);
  };

  const handlePreferredJobLocationsChange = (e) => {
    const { options } = e.target;
    const value = [];
    for (let i = 0, l = options.length; i < l; i++) {
      if (options[i].selected) {
        value.push(options[i].value);
      }
    }
    handleChange('careerGoals', 'preferredJobLocations', value);
  };

  const handleEmploymentTypeChange = (e) => {
    const { options } = e.target;
    const value = [];
    for (let i = 0, l = options.length; i < l; i++) {
      if (options[i].selected) {
        value.push(options[i].value);
      }
    }
    handleChange('careerGoals', 'employmentType', value);
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    // Append main files
    if (profileData.profileImage) formData.append('profileImage', profileData.profileImage);
    if (profileData.backgroundImage) formData.append('backgroundImage', profileData.backgroundImage);
    if (profileData.resume) formData.append('resume', profileData.resume);
    if (profileData.educationalBackground.degreeCertificate) {
      formData.append('degreeCertificate', profileData.educationalBackground.degreeCertificate);
    }

    // Append JSON stringified data
    formData.append('about', JSON.stringify(profileData.about));
    formData.append('educationalBackground', JSON.stringify({
      ...profileData.educationalBackground,
      degreeCertificate: undefined, // Remove file from JSON object
    }));
    formData.append('careerGoals', JSON.stringify(profileData.careerGoals));
    formData.append('jobDetails', JSON.stringify(profileData.jobDetails));
    formData.append('awardsRecognitions', JSON.stringify(profileData.awardsRecognitions));
    formData.append('skills', JSON.stringify(profileData.skills));
    formData.append('socialProfiles', JSON.stringify({
      ...profileData.socialProfiles,
      resume: undefined, // Remove file from JSON object
    }));
    formData.append('certificationsUrls', JSON.stringify(profileData.certificationsUrls));
    formData.append('language', profileData.language);


    // Append work experience with certificate files
    const workExperiencePayload = profileData.workExperience.map((exp, index) => {
      const { experienceCertificate, ...rest } = exp;
      if (experienceCertificate) {
        formData.append(`workExperience_${index}`, experienceCertificate);
      }
      return rest;
    });
    formData.append('workExperience', JSON.stringify(workExperiencePayload));

    // Append international work experience with certificate files
    const internationalWorkExperiencePayload = profileData.internationalWorkExperience.map((exp, index) => {
      const { experienceCertificate, ...rest } = exp;
      if (experienceCertificate) {
        formData.append(`internationalWorkExperience_${index}`, experienceCertificate);
      }
      return rest;
    });
    formData.append('internationalWorkExperience', JSON.stringify(internationalWorkExperiencePayload));

    // Append leadership experience with certificate files
    const leadershipExperiencePayload = profileData.leadershipExperience.map((exp, index) => {
      const { experienceCertificate, ...rest } = exp;
      if (experienceCertificate) {
        formData.append(`leadershipExperience_${index}`, experienceCertificate);
      }
      return rest;
    });
    formData.append('leadershipExperience', JSON.stringify(leadershipExperiencePayload));


    try {
      const response = await axios.post('http://localhost:5000/api/professional-profile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Profile created successfully:', response.data);
      alert('Professional profile created successfully!');
    } catch (error) {
      console.error('Error creating profile:', error.response?.data || error.message);
      alert('Failed to create professional profile. See console for details.');
    }
  };

  if (switchToPro) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Avatar size="lg" name={profileData.about.name || "Name Surname"} />
              <div>
                <h2 className="text-xl font-semibold text-gray-900">{profileData.about.name || "Name Surname"}</h2>
                <p className="text-gray-600">{profileData.about.email || "hello@gmail.com"}</p>
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
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros.
            </p>
            <div className="mt-4">
              <input
                type="file"
                id="pro-resume-upload"
                className="hidden"
                accept=".pdf,.doc,.docx"
                onChange={(e) => handleFileChange('resume', e.target.files[0])}
              />
              <label
                htmlFor="pro-resume-upload"
                className="cursor-pointer inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-black hover:bg-gray-900"
              >
                Upload Resume
              </label>
              {profileData.resume && <span className="ml-3 text-sm text-gray-700">{profileData.resume.name}</span>}
            </div>
          </div>

          <div className="p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">
              Switch to Professional Dashboard!
            </h3>
            <p className="text-gray-600 mb-6">
              Let us know your job interests and preferred locations so we can recommend the best opportunities for you.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Career Goals */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Interested Industry Type
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                  value={profileData.careerGoals.interestedIndustryType}
                  onChange={(e) => handleChange('careerGoals', 'interestedIndustryType', e.target.value)}
                  placeholder="e.g., IT, Finance, Healthcare"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Interested Job Roles (Select multiple)
                </label>
                <select
                  multiple
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black h-32"
                  value={profileData.careerGoals.interestedJobRoles}
                  onChange={handleInterestedJobRolesChange}
                >
                  <option value="Software Engineer">Software Engineer</option>
                  <option value="Data Analyst">Data Analyst</option>
                  <option value="Product Manager">Product Manager</option>
                  <option value="UX Designer">UX Designer</option>
                  {/* Add more roles as needed */}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Preferred Job Locations (Select multiple)
                </label>
                <select
                  multiple
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black h-32"
                  value={profileData.careerGoals.preferredJobLocations}
                  onChange={handlePreferredJobLocationsChange}
                >
                  {locationsOptions.map((location) => (
                    <option key={location} value={location}>{location}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Employment Type (Select multiple)
                </label>
                <select
                  multiple
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black h-24"
                  value={profileData.careerGoals.employmentType}
                  onChange={handleEmploymentTypeChange}
                >
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                  <option value="Remote">Remote</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Looking For
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                  value={profileData.careerGoals.lookingFor}
                  onChange={(e) => handleChange('careerGoals', 'lookingFor', e.target.value)}
                  placeholder="e.g., Internship, Full-time job"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Current Salary
                </label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 text-gray-500 bg-gray-50 border border-r-0 border-gray-300 rounded-l-md">
                    USD
                  </span>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-none rounded-r-md focus:outline-none focus:ring-2 focus:ring-black"
                    value={profileData.careerGoals.currentSalary}
                    onChange={(e) => handleChange('careerGoals', 'currentSalary', e.target.value)}
                    placeholder="Enter amount"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Expected Salary
                </label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 text-gray-500 bg-gray-50 border border-r-0 border-gray-300 rounded-l-md">
                    USD
                  </span>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-none rounded-r-md focus:outline-none focus:ring-2 focus:ring-black"
                    value={profileData.careerGoals.expectedSalary}
                    onChange={(e) => handleChange('careerGoals', 'expectedSalary', e.target.value)}
                    placeholder="Enter amount"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <Button
                  variant="outline"
                  onClick={() => setSwitchToPro(false)}
                  className="border-black text-black hover:bg-gray-50"
                  type="button"
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  className="bg-black hover:bg-gray-900"
                  type="submit"
                >
                  Switch to Professional
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Profile"
        createdAt="July 1, 2023" // This could be dynamic based on profile creation date
      />

      {/* Profile Header */}
      <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm mb-6">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          <Avatar size="xl" name={profileData.about.name || "Name Surname"} />
          <div className="flex-1">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{profileData.about.name || "Name Surname"}</h2>
                <p className="text-gray-600">{profileData.about.email || "hello@demo.io"}</p>
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
                  <Avatar size="lg" name={profileData.about.name || "Name Surname"} />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
                      <div>
                        <h4 className="text-lg font-medium text-gray-900">{profileData.about.name || "Name Surname"}</h4>
                        <p className="text-sm text-gray-600">{profileData.educationalBackground.collegeUniversity && profileData.educationalBackground.yearOfGraduation ? `${profileData.educationalBackground.collegeUniversity}, ${profileData.educationalBackground.yearOfGraduation}` : "College of Engineering, 2018 - 2023"}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="border-black text-black hover:bg-gray-50"
                          onClick={() => window.open(profileData.socialProfiles.linkedinUrl, '_blank')} disabled={!profileData.socialProfiles.linkedinUrl}>
                          <FiLinkedin className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm" className="border-black text-black hover:bg-gray-50"
                          onClick={() => window.open(profileData.socialProfiles.githubUrl, '_blank')} disabled={!profileData.socialProfiles.githubUrl}>
                          <FiGithub className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm" className="border-black text-black hover:bg-gray-50"
                          onClick={() => window.open(profileData.socialProfiles.portfolioUrl, '_blank')} disabled={!profileData.socialProfiles.portfolioUrl}>
                          <FiGlobe className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="p-4 border border-gray-200 rounded-lg">
                        <h5 className="font-medium text-gray-900 mb-2">About</h5>
                        <p className="text-gray-600">{profileData.about.paragraph || "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum."}</p>
                      </div>

                      <div className="p-4 border border-gray-200 rounded-lg">
                        <h5 className="font-medium text-gray-900 mb-2">Contact Information</h5>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-gray-500">Email address</p>
                            <p className="text-gray-900">{profileData.about.email || "hello@demo.io"}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Mobile Number</p>
                            <p className="text-gray-900">{profileData.about.mobileNumber || "1234567890"}</p>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 border border-gray-200 rounded-lg">
                        <h5 className="font-medium text-gray-900 mb-2">Education</h5>
                        <p className="text-gray-900">{profileData.educationalBackground.degree || "Bachelor of Technology, Computer Science"}</p>
                        <p className="text-gray-600">{profileData.educationalBackground.collegeUniversity && profileData.educationalBackground.yearOfGraduation ? `${profileData.educationalBackground.collegeUniversity}, ${profileData.educationalBackground.yearOfGraduation}` : "College of Engineering, 2018 - 2023"}</p>
                      </div>

                      <div className="p-4 border border-gray-200 rounded-lg">
                        <h5 className="font-medium text-gray-900 mb-2">Skills</h5>
                        <div className="flex flex-wrap gap-2">
                          {(profileData.skills.skillList.length > 0 ? profileData.skills.skillList : skillsOptions).map((skill) => (
                            <Badge key={skill} variant="primary" size="md" className="bg-gray-100 text-gray-800">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="p-4 border border-gray-200 rounded-lg">
                        <h5 className="font-medium text-gray-900 mb-2">Interested Industry Type</h5>
                        <Badge variant="primary" size="md" className="bg-gray-100 text-gray-800">{profileData.careerGoals.interestedIndustryType || "IT Industry"}</Badge>
                      </div>

                      <div className="p-4 border border-gray-200 rounded-lg">
                        <h5 className="font-medium text-gray-900 mb-2">Interested Job Roles</h5>
                        <div className="flex flex-wrap gap-2">
                          {(profileData.careerGoals.interestedJobRoles.length > 0 ? profileData.careerGoals.interestedJobRoles : ["Software Engineer", "Data Analyst"]).map((role) => (
                            <Badge key={role} variant="primary" size="md" className="bg-gray-100 text-gray-800">{role}</Badge>
                          ))}
                        </div>
                      </div>

                      <div className="p-4 border border-gray-200 rounded-lg">
                        <h5 className="font-medium text-gray-900 mb-2">Preferred Job Locations</h5>
                        <div className="flex flex-wrap gap-2">
                          {(profileData.careerGoals.preferredJobLocations.length > 0 ? profileData.careerGoals.preferredJobLocations : locationsOptions).map((location) => (
                            <Badge key={location} variant="primary" size="md" className="bg-gray-100 text-gray-800">
                              {location}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="p-4 border border-gray-200 rounded-lg">
                        <h5 className="font-medium text-gray-900 mb-2">Looking for</h5>
                        <Badge variant="primary" size="md" className="bg-gray-100 text-gray-800">{profileData.careerGoals.lookingFor || "Internship"}</Badge>
                      </div>

                      <div className="p-4 border border-gray-200 rounded-lg">
                        <h5 className="font-medium text-gray-900 mb-2">Employment Type</h5>
                        <div className="flex gap-2">
                          {(profileData.careerGoals.employmentType.length > 0 ? profileData.careerGoals.employmentType : ["Full-time", "Remote"]).map((type) => (
                            <Badge key={type} variant="primary" size="md" className="bg-gray-100 text-gray-800">{type}</Badge>
                          ))}
                        </div>
                      </div>

                      <div className="p-4 border border-gray-200 rounded-lg">
                        <h5 className="font-medium text-gray-900 mb-2">Language</h5>
                        <p className="text-gray-900">{profileData.language || "English"}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Profile Tab Content */}
      {activeTab === 'profile' && (
        <div className="space-y-6">
          <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="Enter your full name"
                      value={profileData.about.name}
                      onChange={(e) => handleChange('about', 'name', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="Enter your email"
                      value={profileData.about.email}
                      onChange={(e) => handleChange('about', 'email', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Mobile Number
                    </label>
                    <input
                      type="tel"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="Enter your phone number"
                      value={profileData.about.mobileNumber}
                      onChange={(e) => handleChange('about', 'mobileNumber', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      About Paragraph
                    </label>
                    <textarea
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      rows="3"
                      placeholder="Tell us about yourself"
                      value={profileData.about.paragraph}
                      onChange={(e) => handleChange('about', 'paragraph', e.target.value)}
                    ></textarea>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Profile Image
                    </label>
                    <input
                      type="file"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      accept="image/*"
                      onChange={(e) => handleFileChange('profileImage', e.target.files[0])}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Background Image
                    </label>
                    <input
                      type="file"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      accept="image/*"
                      onChange={(e) => handleFileChange('backgroundImage', e.target.files[0])}
                    />
                  </div>
                </div>
              </div>

              {/* Education */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Education</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Degree
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="Enter your degree"
                      value={profileData.educationalBackground.degree}
                      onChange={(e) => handleChange('educationalBackground', 'degree', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Institution / College/University
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="Enter your institution"
                      value={profileData.educationalBackground.collegeUniversity}
                      onChange={(e) => handleChange('educationalBackground', 'collegeUniversity', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Year of Graduation
                    </label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="Enter graduation year"
                      value={profileData.educationalBackground.yearOfGraduation}
                      onChange={(e) => handleChange('educationalBackground', 'yearOfGraduation', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Current CGPA
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="Enter current CGPA"
                      value={profileData.educationalBackground.currentCgpa}
                      onChange={(e) => handleChange('educationalBackground', 'currentCgpa', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Degree Certificate
                    </label>
                    <input
                      type="file"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => handleNestedFileChange('educationalBackground', 'degreeCertificate', e.target.files[0])}
                    />
                  </div>
                </div>
              </div>

              {/* Work Experience */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Work Experience</h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => addExperience('workExperience')}
                    type="button"
                  >
                    <FiPlus className="w-4 h-4 mr-2" />
                    Add Experience
                  </Button>
                </div>
                {profileData.workExperience.map((exp, index) => (
                  <div key={index} className="space-y-4 p-4 border border-gray-200 rounded-lg mb-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Company Name
                        </label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                          value={exp.companyName}
                          onChange={(e) => handleExperienceChange('workExperience', index, 'companyName', e.target.value)}
                          placeholder="Enter company name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Job Role
                        </label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                          value={exp.jobRole}
                          onChange={(e) => handleExperienceChange('workExperience', index, 'jobRole', e.target.value)}
                          placeholder="Enter job role"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Start Date
                        </label>
                        <input
                          type="date"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                          value={exp.startDate}
                          onChange={(e) => handleExperienceChange('workExperience', index, 'startDate', e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          End Date
                        </label>
                        <input
                          type="date"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                          value={exp.endDate}
                          onChange={(e) => handleExperienceChange('workExperience', index, 'endDate', e.target.value)}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                      </label>
                      <textarea
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                        rows="3"
                        value={exp.description}
                        onChange={(e) => handleExperienceChange('workExperience', index, 'description', e.target.value)}
                        placeholder="Describe your role and responsibilities"
                      ></textarea>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Experience Certificate
                      </label>
                      <input
                        type="file"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => {
                          const newExperiences = [...profileData.workExperience];
                          newExperiences[index].experienceCertificate = e.target.files[0];
                          setProfileData(prevData => ({ ...prevData, workExperience: newExperiences }));
                        }}
                      />
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeExperience('workExperience', index)}
                      type="button"
                      className="text-red-600 border-red-600 hover:bg-red-50"
                    >
                      Remove Experience
                    </Button>
                  </div>
                ))}
              </div>

              {/* International Work Experience */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">International Work Experience</h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => addExperience('internationalWorkExperience')}
                    type="button"
                  >
                    <FiPlus className="w-4 h-4 mr-2" />
                    Add International Experience
                  </Button>
                </div>
                {profileData.internationalWorkExperience.map((exp, index) => (
                  <div key={index} className="space-y-4 p-4 border border-gray-200 rounded-lg mb-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Company Name
                        </label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                          value={exp.companyName}
                          onChange={(e) => handleExperienceChange('internationalWorkExperience', index, 'companyName', e.target.value)}
                          placeholder="Enter company name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Job Role
                        </label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                          value={exp.jobRole}
                          onChange={(e) => handleExperienceChange('internationalWorkExperience', index, 'jobRole', e.target.value)}
                          placeholder="Enter job role"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Start Date
                        </label>
                        <input
                          type="date"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                          value={exp.startDate}
                          onChange={(e) => handleExperienceChange('internationalWorkExperience', index, 'startDate', e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          End Date
                        </label>
                        <input
                          type="date"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                          value={exp.endDate}
                          onChange={(e) => handleExperienceChange('internationalWorkExperience', index, 'endDate', e.target.value)}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                      </label>
                      <textarea
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                        rows="3"
                        value={exp.description}
                        onChange={(e) => handleExperienceChange('internationalWorkExperience', index, 'description', e.target.value)}
                        placeholder="Describe your role and responsibilities"
                      ></textarea>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Experience Certificate
                      </label>
                      <input
                        type="file"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => {
                          const newExperiences = [...profileData.internationalWorkExperience];
                          newExperiences[index].experienceCertificate = e.target.files[0];
                          setProfileData(prevData => ({ ...prevData, internationalWorkExperience: newExperiences }));
                        }}
                      />
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeExperience('internationalWorkExperience', index)}
                      type="button"
                      className="text-red-600 border-red-600 hover:bg-red-50"
                    >
                      Remove Experience
                    </Button>
                  </div>
                ))}
              </div>

              {/* Awards and Recognitions */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Awards & Recognitions</h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => addExperience('awardsRecognitions')}
                    type="button"
                  >
                    <FiPlus className="w-4 h-4 mr-2" />
                    Add Award
                  </Button>
                </div>
                {profileData.awardsRecognitions.map((award, index) => (
                  <div key={index} className="space-y-4 p-4 border border-gray-200 rounded-lg mb-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Award Title
                        </label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                          value={award.awardTitle}
                          onChange={(e) => handleExperienceChange('awardsRecognitions', index, 'awardTitle', e.target.value)}
                          placeholder="Enter award title"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Awarding Organization
                        </label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                          value={award.awardingOrganization}
                          onChange={(e) => handleExperienceChange('awardsRecognitions', index, 'awardingOrganization', e.target.value)}
                          placeholder="Enter awarding organization"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Start Date
                        </label>
                        <input
                          type="date"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                          value={award.startDate}
                          onChange={(e) => handleExperienceChange('awardsRecognitions', index, 'startDate', e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          End Date
                        </label>
                        <input
                          type="date"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                          value={award.endDate}
                          onChange={(e) => handleExperienceChange('awardsRecognitions', index, 'endDate', e.target.value)}
                        />
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeExperience('awardsRecognitions', index)}
                      type="button"
                      className="text-red-600 border-red-600 hover:bg-red-50"
                    >
                      Remove Award
                    </Button>
                  </div>
                ))}
              </div>

              {/* Leadership Experience */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Leadership Experience</h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => addExperience('leadershipExperience')}
                    type="button"
                  >
                    <FiPlus className="w-4 h-4 mr-2" />
                    Add Leadership Experience
                  </Button>
                </div>
                {profileData.leadershipExperience.map((exp, index) => (
                  <div key={index} className="space-y-4 p-4 border border-gray-200 rounded-lg mb-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Company Name
                        </label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                          value={exp.companyName}
                          onChange={(e) => handleExperienceChange('leadershipExperience', index, 'companyName', e.target.value)}
                          placeholder="Enter company name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Job Role
                        </label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                          value={exp.jobRole}
                          onChange={(e) => handleExperienceChange('leadershipExperience', index, 'jobRole', e.target.value)}
                          placeholder="Enter job role"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Start Date
                        </label>
                        <input
                          type="date"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                          value={exp.startDate}
                          onChange={(e) => handleExperienceChange('leadershipExperience', index, 'startDate', e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          End Date
                        </label>
                        <input
                          type="date"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                          value={exp.endDate}
                          onChange={(e) => handleExperienceChange('leadershipExperience', index, 'endDate', e.target.value)}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                      </label>
                      <textarea
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                        rows="3"
                        value={exp.description}
                        onChange={(e) => handleExperienceChange('leadershipExperience', index, 'description', e.target.value)}
                        placeholder="Describe your role and responsibilities"
                      ></textarea>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Experience Certificate
                      </label>
                      <input
                        type="file"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => {
                          const newExperiences = [...profileData.leadershipExperience];
                          newExperiences[index].experienceCertificate = e.target.files[0];
                          setProfileData(prevData => ({ ...prevData, leadershipExperience: newExperiences }));
                        }}
                      />
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeExperience('leadershipExperience', index)}
                      type="button"
                      className="text-red-600 border-red-600 hover:bg-red-50"
                    >
                      Remove Experience
                    </Button>
                  </div>
                ))}
              </div>


              {/* Skills & Experience */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Skills & Experience</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Skills (comma separated)
                    </label>
                    <textarea
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      rows="3"
                      placeholder="Enter your skills (e.g., JavaScript, React, Node.js)"
                      value={profileData.skills.skillList.join(', ')}
                      onChange={handleSkillListChange}
                    ></textarea>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Skills Paragraph
                    </label>
                    <textarea
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      rows="3"
                      placeholder="Summarize your skills and expertise"
                      value={profileData.skills.skillParagraph}
                      onChange={(e) => handleChange('skills', 'skillParagraph', e.target.value)}
                    ></textarea>
                  </div>
                </div>
              </div>

              {/* Social Profiles */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Social Profiles</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      LinkedIn URL
                    </label>
                    <input
                      type="url"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="Enter your LinkedIn profile URL"
                      value={profileData.socialProfiles.linkedinUrl}
                      onChange={(e) => handleChange('socialProfiles', 'linkedinUrl', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      GitHub URL
                    </label>
                    <input
                      type="url"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="Enter your GitHub profile URL"
                      value={profileData.socialProfiles.githubUrl}
                      onChange={(e) => handleChange('socialProfiles', 'githubUrl', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Portfolio URL
                    </label>
                    <input
                      type="url"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="Enter your portfolio URL"
                      value={profileData.socialProfiles.portfolioUrl}
                      onChange={(e) => handleChange('socialProfiles', 'portfolioUrl', e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Certifications URLs */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Certifications URLs</h3>
                {profileData.certificationsUrls.map((url, index) => (
                  <div key={index} className="flex items-center gap-2 mb-2">
                    <input
                      type="url"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="Enter certification URL"
                      value={url}
                      onChange={(e) => {
                        const newUrls = [...profileData.certificationsUrls];
                        newUrls[index] = e.target.value;
                        handleArrayChange('certificationsUrls', newUrls);
                      }}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      type="button"
                      onClick={() => handleArrayChange('certificationsUrls', profileData.certificationsUrls.filter((_, i) => i !== index))}
                      className="text-red-600 border-red-600 hover:bg-red-50"
                    >
                      Remove
                    </Button>
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  type="button"
                  onClick={() => handleArrayChange('certificationsUrls', [...profileData.certificationsUrls, ''])}
                  className="mt-2"
                >
                  <FiPlus className="w-4 h-4 mr-2" />
                  Add Certification URL
                </Button>
              </div>

              {/* Language */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Language
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="e.g., English, Hindi"
                  value={profileData.language}
                  onChange={(e) => handleChange('language', '', e.target.value)}
                />
              </div>


              <div className="flex justify-end">
                <Button variant="primary" type="submit">
                  Save Changes
                </Button>
              </div>
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
                onChange={(e) => handleFileChange('resume', e.target.files[0])}
              />
              <label
                htmlFor="resume-upload"
                className="cursor-pointer inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-black hover:bg-gray-900"
              >
                Upload Resume
              </label>
              <p className="mt-2 text-sm text-gray-600">
                Supported formats: PDF, DOC, DOCX
              </p>
              {profileData.resume && <p className="mt-2 text-sm text-gray-700">Selected file: {profileData.resume.name}</p>}
            </div>
            <div className="flex justify-end mt-6">
              <Button variant="primary" onClick={handleSubmit}>
                Save Resume
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProfProfile;