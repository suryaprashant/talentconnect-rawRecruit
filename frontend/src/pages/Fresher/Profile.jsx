import { useState } from 'react';
import PageHeader from '@/components/dashboard/PageHeader';
import Button from '@/components/ui/Button';
import Avatar from '@/components/ui/Avatar';
import Badge from '@/components/ui/Badge';
import { FiLinkedin, FiGithub, FiGlobe, FiPlus } from 'react-icons/fi';

function Fresher_Profile() {
  const [activeTab, setActiveTab] = useState('overview');
  const [switchToPro, setSwitchToPro] = useState(false);

  // State for form data - aligned with your backend model
  const [profileData, setProfileData] = useState({
    about: {
      name: '',
      gmail: '',
      mobileNumber: '',
      aboutParagraph: '',
    },
    educationalBackground: {
      collegeUniversity: '',
      degree: '',
      branch: '',
      passingYear: '',
      cgpa: '',
      degreeCertificateUrl: '', // This will be handled by file upload
    },
    careerGoals: {
      interestedIndustryType: '',
      interestedJobRoles: [],
      preferredJobLocations: [],
      lookingFor: '',
      employmentType: [],
      expectedSalary: '',
    },
    internshipTrainings: [], // This will be dynamic, similar to workExperiences
    jobDetails: {
      jobTitle: '',
      location: '',
      startDate: '',
      description: '',
    },
    skills: {
      skillList: [],
      skillParagraph: '',
    },
    socialProfiles: {
      linkedinUrl: '',
      githubUrl: '',
      websiteUrl: '',
      resumeUrl: '', // This will be handled by file upload
    },
    certificationsUrls: [],
    language: '',
  });

  // State for file uploads
  const [files, setFiles] = useState({
    profileImage: null,
    backgroundImage: null,
    resume: null,
    degreeCertificate: null,
  });

  // Existing state for dynamic work experiences (mapping to internshipTrainings)
  const [workExperiences, setWorkExperiences] = useState([{
    companyName: '',
    jobRole: '',
    startDate: '',
    endDate: '', // Added endDate based on your model
    description: '',
  }]);

  const skillsOptions = [
    'SQL', 'REST', 'CSS 3', 'HTML 5', 'Node.js', 'React.js',
    'AWS S3', 'AWS IAM', 'AWS EC2', 'AWS RDS', 'AWS ECS'
  ];

  const locationsOptions = ['Noida', 'Delhi', 'Gurgaon', 'Bangalore', 'Pune', 'Mumbai', 'Hyderabad'];

  const handleWorkExperienceChange = (index, field, value) => {
    const newExperiences = [...workExperiences];
    newExperiences[index][field] = value;
    setWorkExperiences(newExperiences);
  };

  const addWorkExperience = () => {
    setWorkExperiences([...workExperiences, {
      companyName: '',
      jobRole: '',
      startDate: '',
      endDate: '',
      description: '',
    }]);
  };

  // Generic handler for nested state updates
  const handleChange = (e) => {
    const { name, value, type, files: inputFiles } = e.target;

    if (type === 'file') {
      setFiles(prevFiles => ({
        ...prevFiles,
        [name]: inputFiles[0],
      }));
    } else if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setProfileData(prevState => ({
        ...prevState,
        [parent]: {
          ...prevState[parent],
          [child]: value
        }
      }));
    } else if (type === 'checkbox') {
      // For multi-select like interestedJobRoles, preferredJobLocations, employmentType
      const { checked } = e.target;
      setProfileData(prevState => ({
        ...prevState,
        [name]: checked
          ? [...prevState[name], value]
          : prevState[name].filter(item => item !== value)
      }));
    } else if (type === 'select-multiple') {
      const selectedOptions = Array.from(e.target.selectedOptions).map(option => option.value);
      setProfileData(prevState => ({
        ...prevState,
        [name]: selectedOptions,
      }));
    }
    else {
      setProfileData(prevState => ({
        ...prevState,
        [name]: value
      }));
    }
  };

  // Handler for dynamic skill input
  const handleSkillChange = (e) => {
    setProfileData(prevState => ({
      ...prevState,
      skills: {
        ...prevState.skills,
        skillList: e.target.value.split(',').map(s => s.trim()).filter(s => s !== '')
      }
    }));
  };

  const handleAboutParagraphChange = (e) => {
    setProfileData(prevState => ({
      ...prevState,
      about: {
        ...prevState.about,
        aboutParagraph: e.target.value,
      },
    }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    // Append JSON stringified data
    formData.append('about', JSON.stringify(profileData.about));
    formData.append('educationalBackground', JSON.stringify({
      ...profileData.educationalBackground,
      // degreeCertificateUrl will be added directly if uploaded
    }));
    formData.append('careerGoals', JSON.stringify(profileData.careerGoals));
    formData.append('internshipTrainings', JSON.stringify(workExperiences)); // Use workExperiences here
    formData.append('jobDetails', JSON.stringify(profileData.jobDetails));
    formData.append('skills', JSON.stringify(profileData.skills));
    formData.append('socialProfiles', JSON.stringify(profileData.socialProfiles));
    formData.append('certificationsUrls', JSON.stringify(profileData.certificationsUrls));
    formData.append('language', profileData.language);

    // Append files
    if (files.profileImage) {
      formData.append('profileImage', files.profileImage);
    }
    if (files.backgroundImage) {
      formData.append('backgroundImage', files.backgroundImage);
    }
    if (files.resume) {
      formData.append('resume', files.resume);
    }
    if (files.degreeCertificate) {
      formData.append('degreeCertificate', files.degreeCertificate);
    }

    try {
      // Adjust the URL to your backend API
      const response = await fetch('http://localhost:5000/api/fresher-profile', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Profile created successfully:', data);
        alert('Fresher profile created successfully!');
        // Optionally, reset form or redirect
      } else {
        const errorData = await response.json();
        console.error('Failed to create profile:', errorData);
        alert(`Failed to create fresher profile: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error during API call:', error);
      alert('An error occurred while creating the profile.');
    }
  };


  if (switchToPro) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Avatar size="lg" name="Name Surname" /> {/* Display dynamic name here */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900">{profileData.about.name || 'Name Surname'}</h2>
                <p className="text-gray-600">{profileData.about.gmail || 'hello@gmail.com'}</p>
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
          </div>

          <div className="p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">
              Switch to Professional Dashboard!
            </h3>
            <p className="text-gray-600 mb-6">
              Let us know your job interests and preferred locations so we can recommend the best opportunities for you.
            </p>

            {/* This section appears to be for a "Professional" profile switch, 
                and it contains some fields already present in the "Profile" tab.
                You might want to refactor this to reuse components or clarify its purpose.
                For now, I'm adjusting its inputs to match fresherProfile. */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Interested Industry Type
                </label>
                <input
                  type="text"
                  name="careerGoals.interestedIndustryType"
                  value={profileData.careerGoals.interestedIndustryType}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                  placeholder="e.g., IT Industry, Healthcare"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Interested Job Roles (comma separated)
                </label>
                <input
                  type="text"
                  name="careerGoals.interestedJobRoles"
                  value={profileData.careerGoals.interestedJobRoles.join(', ')}
                  onChange={(e) => setProfileData(prev => ({
                    ...prev,
                    careerGoals: {
                      ...prev.careerGoals,
                      interestedJobRoles: e.target.value.split(',').map(s => s.trim()).filter(s => s !== '')
                    }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                  placeholder="e.g., Software Engineer, Data Analyst"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Preferred Job Locations (comma separated)
                </label>
                <input
                  type="text"
                  name="careerGoals.preferredJobLocations"
                  value={profileData.careerGoals.preferredJobLocations.join(', ')}
                  onChange={(e) => setProfileData(prev => ({
                    ...prev,
                    careerGoals: {
                      ...prev.careerGoals,
                      preferredJobLocations: e.target.value.split(',').map(s => s.trim()).filter(s => s !== '')
                    }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                  placeholder="e.g., Noida, Bangalore"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Looking For
                </label>
                <select
                  name="careerGoals.lookingFor"
                  value={profileData.careerGoals.lookingFor}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                >
                  <option value="">Select option</option>
                  <option value="Internship">Internship</option>
                  <option value="Full-time Job">Full-time Job</option>
                  <option value="Part-time Job">Part-time Job</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Employment Type (select multiple)
                </label>
                <select
                  multiple
                  name="careerGoals.employmentType"
                  value={profileData.careerGoals.employmentType}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                >
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                  <option value="Remote">Remote</option>
                </select>
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
                    name="careerGoals.expectedSalary"
                    value={profileData.careerGoals.expectedSalary}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-none rounded-r-md focus:outline-none focus:ring-2 focus:ring-black"
                    placeholder="Enter amount"
                  />
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
                  className="bg-black hover:bg-gray-900"
                  onClick={handleSubmit} // Submit when switching to Pro as well if data is intended to be saved
                >
                  Switch & Save
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Profile"
        createdAt="July 1, 2023" // This might be dynamic based on profile creation date
      />

      {/* Profile Header */}
      <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm mb-6">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          <Avatar size="xl" name={profileData.about.name || "Name Surname"} />
          <div className="flex-1">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{profileData.about.name || "Name Surname"}</h2>
                <p className="text-gray-600">{profileData.about.gmail || "hello@demo.io"}</p>
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
                  {/* Display actual profile image if available */}
                  <Avatar size="lg" name={profileData.about.name || "Name Surname"} imageUrl={files.profileImage ? URL.createObjectURL(files.profileImage) : ''} />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
                      <div>
                        <h4 className="text-lg font-medium text-gray-900">{profileData.about.name || "Name Surname"}</h4>
                        <p className="text-sm text-gray-600">
                          {profileData.educationalBackground.collegeUniversity || 'College of Engineering'}, {profileData.educationalBackground.passingYear || '2018 - 2023'}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        {profileData.socialProfiles.linkedinUrl && (
                          <Button variant="outline" size="sm" className="border-black text-black hover:bg-gray-50" onClick={() => window.open(profileData.socialProfiles.linkedinUrl, '_blank')}>
                            <FiLinkedin className="w-4 h-4" />
                          </Button>
                        )}
                        {profileData.socialProfiles.githubUrl && (
                          <Button variant="outline" size="sm" className="border-black text-black hover:bg-gray-50" onClick={() => window.open(profileData.socialProfiles.githubUrl, '_blank')}>
                            <FiGithub className="w-4 h-4" />
                          </Button>
                        )}
                        {profileData.socialProfiles.websiteUrl && (
                          <Button variant="outline" size="sm" className="border-black text-black hover:bg-gray-50" onClick={() => window.open(profileData.socialProfiles.websiteUrl, '_blank')}>
                            <FiGlobe className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="p-4 border border-gray-200 rounded-lg">
                        <h5 className="font-medium text-gray-900 mb-2">About</h5>
                        <p className="text-gray-600">{profileData.about.aboutParagraph || 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum.'}</p>
                      </div>

                      <div className="p-4 border border-gray-200 rounded-lg">
                        <h5 className="font-medium text-gray-900 mb-2">Contact Information</h5>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-gray-500">Email address</p>
                            <p className="text-gray-900">{profileData.about.gmail || 'hello@demo.io'}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Mobile Number</p>
                            <p className="text-gray-900">{profileData.about.mobileNumber || '1234567890'}</p>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 border border-gray-200 rounded-lg">
                        <h5 className="font-medium text-gray-900 mb-2">Education</h5>
                        <p className="text-gray-900">{profileData.educationalBackground.degree || 'Bachelor of Technology'}, {profileData.educationalBackground.branch || 'Computer Science'}</p>
                        <p className="text-gray-600">{profileData.educationalBackground.collegeUniversity || 'College of Engineering'}, {profileData.educationalBackground.passingYear || '2018'} - {profileData.educationalBackground.passingYear ? parseInt(profileData.educationalBackground.passingYear) + 5 : '2023'}</p>
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
                        <Badge variant="primary" size="md" className="bg-gray-100 text-gray-800">{profileData.careerGoals.interestedIndustryType || 'IT Industry'}</Badge>
                      </div>

                      <div className="p-4 border border-gray-200 rounded-lg">
                        <h5 className="font-medium text-gray-900 mb-2">Interested Job Roles</h5>
                        <div className="flex flex-wrap gap-2">
                          {(profileData.careerGoals.interestedJobRoles.length > 0 ? profileData.careerGoals.interestedJobRoles : ['Software Engineer', 'Data Analyst']).map((role) => (
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
                        <Badge variant="primary" size="md" className="bg-gray-100 text-gray-800">{profileData.careerGoals.lookingFor || 'Internship'}</Badge>
                      </div>

                      <div className="p-4 border border-gray-200 rounded-lg">
                        <h5 className="font-medium text-gray-900 mb-2">Employment Type</h5>
                        <div className="flex gap-2">
                          {(profileData.careerGoals.employmentType.length > 0 ? profileData.careerGoals.employmentType : ['Full-time', 'Remote']).map((type) => (
                            <Badge key={type} variant="primary" size="md" className="bg-gray-100 text-gray-800">{type}</Badge>
                          ))}
                        </div>
                      </div>

                      <div className="p-4 border border-gray-200 rounded-lg">
                        <h5 className="font-medium text-gray-900 mb-2">Language</h5>
                        <p className="text-gray-900">{profileData.language || 'English'}</p>
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
                      name="about.name"
                      value={profileData.about.name}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="about.gmail"
                      value={profileData.about.gmail}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="Enter your email"
                    />
                  </div>
                  <div>
                    <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phoneNumber"
                      name="about.mobileNumber"
                      value={profileData.about.mobileNumber}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="Enter your phone number"
                    />
                  </div>
                  <div>
                    <label htmlFor="aboutParagraph" className="block text-sm font-medium text-gray-700 mb-1">
                      About You
                    </label>
                    <textarea
                      id="aboutParagraph"
                      name="about.aboutParagraph"
                      value={profileData.about.aboutParagraph}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      rows="3"
                      placeholder="Tell us about yourself"
                    ></textarea>
                  </div>
                  <div>
                    <label htmlFor="profileImage" className="block text-sm font-medium text-gray-700 mb-1">
                      Profile Image
                    </label>
                    <input
                      type="file"
                      id="profileImage"
                      name="profileImage"
                      accept="image/*"
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                    {files.profileImage && <p className="text-sm text-gray-500 mt-1">Selected: {files.profileImage.name}</p>}
                  </div>
                  <div>
                    <label htmlFor="backgroundImage" className="block text-sm font-medium text-gray-700 mb-1">
                      Background Image
                    </label>
                    <input
                      type="file"
                      id="backgroundImage"
                      name="backgroundImage"
                      accept="image/*"
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                    {files.backgroundImage && <p className="text-sm text-gray-500 mt-1">Selected: {files.backgroundImage.name}</p>}
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Education</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="collegeUniversity" className="block text-sm font-medium text-gray-700 mb-1">
                      College/University
                    </label>
                    <input
                      type="text"
                      id="collegeUniversity"
                      name="educationalBackground.collegeUniversity"
                      value={profileData.educationalBackground.collegeUniversity}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="Enter your college/university"
                    />
                  </div>
                  <div>
                    <label htmlFor="degree" className="block text-sm font-medium text-gray-700 mb-1">
                      Degree
                    </label>
                    <input
                      type="text"
                      id="degree"
                      name="educationalBackground.degree"
                      value={profileData.educationalBackground.degree}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="Enter your degree"
                    />
                  </div>
                  <div>
                    <label htmlFor="branch" className="block text-sm font-medium text-gray-700 mb-1">
                      Branch
                    </label>
                    <input
                      type="text"
                      id="branch"
                      name="educationalBackground.branch"
                      value={profileData.educationalBackground.branch}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="Enter your branch"
                    />
                  </div>
                  <div>
                    <label htmlFor="passingYear" className="block text-sm font-medium text-gray-700 mb-1">
                      Passing Year
                    </label>
                    <input
                      type="number"
                      id="passingYear"
                      name="educationalBackground.passingYear"
                      value={profileData.educationalBackground.passingYear}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="e.g., 2023"
                    />
                  </div>
                  <div>
                    <label htmlFor="cgpa" className="block text-sm font-medium text-gray-700 mb-1">
                      CGPA
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      id="cgpa"
                      name="educationalBackground.cgpa"
                      value={profileData.educationalBackground.cgpa}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="e.g., 8.5"
                    />
                  </div>
                  <div>
                    <label htmlFor="degreeCertificate" className="block text-sm font-medium text-gray-700 mb-1">
                      Degree Certificate
                    </label>
                    <input
                      type="file"
                      id="degreeCertificate"
                      name="degreeCertificate"
                      accept=".pdf,.doc,.docx"
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                    {files.degreeCertificate && <p className="text-sm text-gray-500 mt-1">Selected: {files.degreeCertificate.name}</p>}
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Career Goals</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="interestedIndustryType" className="block text-sm font-medium text-gray-700 mb-1">
                      Interested Industry Type
                    </label>
                    <input
                      type="text"
                      id="interestedIndustryType"
                      name="careerGoals.interestedIndustryType"
                      value={profileData.careerGoals.interestedIndustryType}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="e.g., IT Industry, Healthcare"
                    />
                  </div>
                  <div>
                    <label htmlFor="interestedJobRoles" className="block text-sm font-medium text-gray-700 mb-1">
                      Interested Job Roles (comma separated)
                    </label>
                    <input
                      type="text"
                      id="interestedJobRoles"
                      name="careerGoals.interestedJobRoles"
                      value={profileData.careerGoals.interestedJobRoles.join(', ')}
                      onChange={(e) => setProfileData(prev => ({
                        ...prev,
                        careerGoals: {
                          ...prev.careerGoals,
                          interestedJobRoles: e.target.value.split(',').map(s => s.trim()).filter(s => s !== '')
                        }
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="e.g., Software Engineer, Data Analyst"
                    />
                  </div>
                  <div>
                    <label htmlFor="preferredJobLocations" className="block text-sm font-medium text-gray-700 mb-1">
                      Preferred Job Locations (comma separated)
                    </label>
                    <input
                      type="text"
                      id="preferredJobLocations"
                      name="careerGoals.preferredJobLocations"
                      value={profileData.careerGoals.preferredJobLocations.join(', ')}
                      onChange={(e) => setProfileData(prev => ({
                        ...prev,
                        careerGoals: {
                          ...prev.careerGoals,
                          preferredJobLocations: e.target.value.split(',').map(s => s.trim()).filter(s => s !== '')
                        }
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="e.g., Noida, Bangalore"
                    />
                  </div>
                  <div>
                    <label htmlFor="lookingFor" className="block text-sm font-medium text-gray-700 mb-1">
                      Looking For
                    </label>
                    <select
                      id="lookingFor"
                      name="careerGoals.lookingFor"
                      value={profileData.careerGoals.lookingFor}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="">Select option</option>
                      <option value="Internship">Internship</option>
                      <option value="Full-time Job">Full-time Job</option>
                      <option value="Part-time Job">Part-time Job</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="employmentType" className="block text-sm font-medium text-gray-700 mb-1">
                      Employment Type (select multiple)
                    </label>
                    <select
                      multiple
                      id="employmentType"
                      name="careerGoals.employmentType"
                      value={profileData.careerGoals.employmentType}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="Full-time">Full-time</option>
                      <option value="Part-time">Part-time</option>
                      <option value="Contract">Contract</option>
                      <option value="Remote">Remote</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="expectedSalary" className="block text-sm font-medium text-gray-700 mb-1">
                      Expected Salary
                    </label>
                    <div className="flex">
                      <span className="inline-flex items-center px-3 text-gray-500 bg-gray-50 border border-r-0 border-gray-300 rounded-l-md">
                        USD
                      </span>
                      <input
                        type="text"
                        id="expectedSalary"
                        name="careerGoals.expectedSalary"
                        value={profileData.careerGoals.expectedSalary}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-none rounded-r-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="Enter amount"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Internship & Training Experience</h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={addWorkExperience}
                    type="button"
                  >
                    <FiPlus className="w-4 h-4 mr-2" />
                    Add Experience
                  </Button>
                </div>
                {workExperiences.map((exp, index) => (
                  <div key={index} className="space-y-4 p-4 border border-gray-200 rounded-lg mb-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor={`companyName-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                          Company Name
                        </label>
                        <input
                          type="text"
                          id={`companyName-${index}`}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                          value={exp.companyName}
                          onChange={(e) => handleWorkExperienceChange(index, 'companyName', e.target.value)}
                          placeholder="e.g., Google"
                        />
                      </div>
                      <div>
                        <label htmlFor={`jobRole-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                          Job Role
                        </label>
                        <input
                          type="text"
                          id={`jobRole-${index}`}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                          value={exp.jobRole}
                          onChange={(e) => handleWorkExperienceChange(index, 'jobRole', e.target.value)}
                          placeholder="e.g., Software Engineering Intern"
                        />
                      </div>
                      <div>
                        <label htmlFor={`startDate-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                          Start Date
                        </label>
                        <input
                          type="date"
                          id={`startDate-${index}`}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                          value={exp.startDate}
                          onChange={(e) => handleWorkExperienceChange(index, 'startDate', e.target.value)}
                        />
                      </div>
                      <div>
                        <label htmlFor={`endDate-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                          End Date
                        </label>
                        <input
                          type="date"
                          id={`endDate-${index}`}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                          value={exp.endDate}
                          onChange={(e) => handleWorkExperienceChange(index, 'endDate', e.target.value)}
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor={`description-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                      </label>
                      <textarea
                        id={`description-${index}`}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                        rows="3"
                        value={exp.description}
                        onChange={(e) => handleWorkExperienceChange(index, 'description', e.target.value)}
                        placeholder="Describe your role and responsibilities"
                      ></textarea>
                    </div>
                  </div>
                ))}
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Current Job Details (if any)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="jobTitle" className="block text-sm font-medium text-gray-700 mb-1">
                      Job Title
                    </label>
                    <input
                      type="text"
                      id="jobTitle"
                      name="jobDetails.jobTitle"
                      value={profileData.jobDetails.jobTitle}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="e.g., Junior Developer"
                    />
                  </div>
                  <div>
                    <label htmlFor="jobLocation" className="block text-sm font-medium text-gray-700 mb-1">
                      Location
                    </label>
                    <input
                      type="text"
                      id="jobLocation"
                      name="jobDetails.location"
                      value={profileData.jobDetails.location}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="e.g., New Delhi"
                    />
                  </div>
                  <div>
                    <label htmlFor="jobStartDate" className="block text-sm font-medium text-gray-700 mb-1">
                      Start Date
                    </label>
                    <input
                      type="date"
                      id="jobStartDate"
                      name="jobDetails.startDate"
                      value={profileData.jobDetails.startDate}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label htmlFor="jobDescription" className="block text-sm font-medium text-gray-700 mb-1">
                      Job Description
                    </label>
                    <textarea
                      id="jobDescription"
                      name="jobDetails.description"
                      value={profileData.jobDetails.description}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      rows="3"
                      placeholder="Describe your current job responsibilities"
                    ></textarea>
                  </div>
                </div>
              </div>


              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Skills & Social Profiles</h3>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="skillList" className="block text-sm font-medium text-gray-700 mb-1">
                      Skills (comma separated)
                    </label>
                    <textarea
                      id="skillList"
                      name="skillList"
                      value={profileData.skills.skillList.join(', ')}
                      onChange={handleSkillChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      rows="3"
                      placeholder="e.g., JavaScript, React, Node.js"
                    ></textarea>
                  </div>
                  <div>
                    <label htmlFor="skillParagraph" className="block text-sm font-medium text-gray-700 mb-1">
                      Skills Summary
                    </label>
                    <textarea
                      id="skillParagraph"
                      name="skills.skillParagraph"
                      value={profileData.skills.skillParagraph}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      rows="3"
                      placeholder="Summarize your overall skills and expertise"
                    ></textarea>
                  </div>
                  <div>
                    <label htmlFor="linkedinUrl" className="block text-sm font-medium text-gray-700 mb-1">
                      LinkedIn Profile URL
                    </label>
                    <input
                      type="url"
                      id="linkedinUrl"
                      name="socialProfiles.linkedinUrl"
                      value={profileData.socialProfiles.linkedinUrl}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="https://linkedin.com/in/yourprofile"
                    />
                  </div>
                  <div>
                    <label htmlFor="githubUrl" className="block text-sm font-medium text-gray-700 mb-1">
                      GitHub Profile URL
                    </label>
                    <input
                      type="url"
                      id="githubUrl"
                      name="socialProfiles.githubUrl"
                      value={profileData.socialProfiles.githubUrl}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="https://github.com/yourprofile"
                    />
                  </div>
                  <div>
                    <label htmlFor="websiteUrl" className="block text-sm font-medium text-gray-700 mb-1">
                      Personal Website/Portfolio URL
                    </label>
                    <input
                      type="url"
                      id="websiteUrl"
                      name="socialProfiles.websiteUrl"
                      value={profileData.socialProfiles.websiteUrl}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="https://yourwebsite.com"
                    />
                  </div>
                  <div>
                    <label htmlFor="certificationsUrls" className="block text-sm font-medium text-gray-700 mb-1">
                      Certifications URLs (comma separated)
                    </label>
                    <textarea
                      id="certificationsUrls"
                      name="certificationsUrls"
                      value={profileData.certificationsUrls.join(', ')}
                      onChange={(e) => setProfileData(prev => ({
                        ...prev,
                        certificationsUrls: e.target.value.split(',').map(s => s.trim()).filter(s => s !== '')
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      rows="3"
                      placeholder="e.g., https://coursera.org/cert1, https://edx.org/cert2"
                    ></textarea>
                  </div>
                  <div>
                    <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-1">
                      Language
                    </label>
                    <input
                      type="text"
                      id="language"
                      name="language"
                      value={profileData.language}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="e.g., English, Hindi"
                    />
                  </div>
                </div>
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
                name="resume" // name for the file
                accept=".pdf,.doc,.docx"
                onChange={handleChange}
              />
              <label
                htmlFor="resume-upload"
                className="cursor-pointer inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-black hover:bg-gray-900"
              >
                Upload Resume
              </label>
              {files.resume && <p className="mt-2 text-sm text-gray-600">Selected: {files.resume.name}</p>}
              <p className="mt-2 text-sm text-gray-600">
                Supported formats: PDF, DOC, DOCX
              </p>
            </div>
            {/* You might want a save button here too if resume upload is separate from profile save */}
             <div className="flex justify-end mt-4">
                <Button variant="primary" onClick={handleSubmit}>
                    Upload Resume
                </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Fresher_Profile;