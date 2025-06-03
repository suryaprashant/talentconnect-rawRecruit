import { useState } from 'react';
import PageHeader from '@/components/dashboard/PageHeader';
import Button from '@/components/ui/Button';
import Avatar from '@/components/ui/Avatar';
import Badge from '@/components/ui/Badge';
import { FiLinkedin, FiGithub, FiGlobe, FiPlus } from 'react-icons/fi';

function Profile() {
  const [activeTab, setActiveTab] = useState('overview');
  const [switchToPro, setSwitchToPro] = useState(false);
  const [workExperiences, setWorkExperiences] = useState([
    {
      company: '',
      jobRole: '',
      startDate: '',
      description: '',
      currentSalary: '',
      expectedSalary: '',
    },
  ]);

  // State for form data
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
    },
    skills: [],
    socialProfiles: {
      linkedinUrl: '',
      githubUrl: '',
      portfolioUrl: '',
      resumeUrl: '', // This will be handled by file upload
    },
    certificationsUrls: [],
  });

  // State for files
  const [profileImage, setProfileImage] = useState(null);
  const [backgroundImage, setBackgroundImage] = useState(null);
  const [resume, setResume] = useState(null);
  const [degreeCertificate, setDegreeCertificate] = useState(null);

  const skillsOptions = [
    'SQL', 'REST', 'CSS 3', 'HTML 5', 'Node.js', 'React.js',
    'AWS S3', 'AWS IAM', 'AWS EC2', 'AWS RDS', 'AWS ECS'
  ];

  const locations = ['noida', 'delhi', 'gurgaon', 'bangalore', 'pune', 'mumbai', 'hyderabad']; // Ensure these match backend enum values

  const jobRoles = ['Software Engineer', 'Data Analyst']; // Ensure these match backend enum values
  const employmentTypes = ['full-time', 'part-time', 'contract', 'remote'];
  const lookingForOptions = ['job', 'internship', 'both'];

  const handleWorkExperienceChange = (index, field, value) => {
    const newExperiences = [...workExperiences];
    newExperiences[index][field] = value;
    setWorkExperiences(newExperiences);
  };

  const addWorkExperience = () => {
    setWorkExperiences([
      ...workExperiences,
      {
        company: '',
        jobRole: '',
        startDate: '',
        description: '',
        currentSalary: '',
        expectedSalary: '',
      },
    ]);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const [section, field] = name.split('.');

    setProfileData((prevData) => {
      if (section === 'about' || section === 'educationalBackground' || section === 'socialProfiles') {
        return {
          ...prevData,
          [section]: {
            ...prevData[section],
            [field]: value,
          },
        };
      } else if (section === 'careerGoals') {
        if (type === 'checkbox') {
          const currentValues = prevData.careerGoals[field] || [];
          return {
            ...prevData,
            careerGoals: {
              ...prevData.careerGoals,
              [field]: checked
                ? [...currentValues, value]
                : currentValues.filter((item) => item !== value),
            },
          };
        }
        return {
          ...prevData,
          careerGoals: {
            ...prevData.careerGoals,
            [field]: value,
          },
        };
      } else if (section === 'skills') {
        // Assuming skills are entered as comma-separated string
        return {
          ...prevData,
          skills: value.split(',').map(skill => skill.trim()).filter(skill => skill !== ''),
        };
      }
      return prevData;
    });
  };

  const handleFileChange = (e, setter) => {
    setter(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    // Append JSON data
    // Note: The backend expects a 'data' field containing a JSON string
    formData.append('data', JSON.stringify(profileData));

    // Append files
    if (profileImage) {
      formData.append('profileImage', profileImage);
    }
    if (backgroundImage) {
      formData.append('backgroundImage', backgroundImage);
    }
    if (resume) {
      formData.append('resume', resume);
    }
    if (degreeCertificate) {
      formData.append('degreeCertificate', degreeCertificate);
    }

    try {
      const response = await fetch('http://localhost:5000/api/student-profile', { // **IMPORTANT: Replace with your actual backend URL and port**
        method: 'POST',
        body: formData, // FormData automatically sets 'Content-Type': 'multipart/form-data'
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create student profile');
      }

      const result = await response.json();
      console.log('Profile created successfully:', result);
      alert('Student profile created successfully!');
      // Optionally, redirect or update UI
    } catch (error) {
      console.error('Error creating student profile:', error.message);
      alert(`Error: ${error.message}`);
    }
  };


  if (switchToPro) {
    // ... (your existing switchToPro return block - no changes needed for API here)
    return (
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Avatar size="lg" name="Name Surname" />
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Name Surname</h2>
                <p className="text-gray-600">hello@gmail.com</p>
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

            <div className="space-y-6">
              {/* Existing Switch to Pro form fields */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Work Experience
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black">
                  <option value="">Select Company</option>
                  <option value="company1">Company 1</option>
                  <option value="company2">Company 2</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Job Role
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black">
                  <option value="">Select Role</option>
                  <option value="developer">Developer</option>
                  <option value="designer">Designer</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                  rows="3"
                  placeholder="Enter job description"
                ></textarea>
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
                >
                  Switch
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
      <PageHeader title="Profile" createdAt="July 1, 2023" />

      {/* Profile Header */}
      <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm mb-6">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          <Avatar size="xl" name="Name Surname" />
          <div className="flex-1">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Name Surname</h2>
                <p className="text-gray-600">hello@demo.io</p>
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
                  <Avatar size="lg" name="Name Surname" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
                      <div>
                        <h4 className="text-lg font-medium text-gray-900">Name Surname</h4>
                        <p className="text-sm text-gray-600">College of Engineering, 2018 - 2023</p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="border-black text-black hover:bg-gray-50">
                          <FiLinkedin className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm" className="border-black text-black hover:bg-gray-50">
                          <FiGithub className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm" className="border-black text-black hover:bg-gray-50">
                          <FiGlobe className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="p-4 border border-gray-200 rounded-lg">
                        <h5 className="font-medium text-gray-900 mb-2">About</h5>
                        <p className="text-gray-600">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum.</p>
                      </div>

                      <div className="p-4 border border-gray-200 rounded-lg">
                        <h5 className="font-medium text-gray-900 mb-2">Contact Information</h5>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-gray-500">Email address</p>
                            <p className="text-gray-900">hello@demo.io</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Mobile Number</p>
                            <p className="text-gray-900">1234567890</p>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 border border-gray-200 rounded-lg">
                        <h5 className="font-medium text-gray-900 mb-2">Education</h5>
                        <p className="text-gray-900">Bachelor of Technology, Computer Science</p>
                        <p className="text-gray-600">College of Engineering, 2018 - 2023</p>
                      </div>

                      <div className="p-4 border border-gray-200 rounded-lg">
                        <h5 className="font-medium text-gray-900 mb-2">Skills</h5>
                        <div className="flex flex-wrap gap-2">
                          {skillsOptions.map((skill) => (
                            <Badge key={skill} variant="primary" size="md" className="bg-gray-100 text-gray-800">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="p-4 border border-gray-200 rounded-lg">
                        <h5 className="font-medium text-gray-900 mb-2">Interested Industry Type</h5>
                        <Badge variant="primary" size="md" className="bg-gray-100 text-gray-800">IT Industry</Badge>
                      </div>

                      <div className="p-4 border border-gray-200 rounded-lg">
                        <h5 className="font-medium text-gray-900 mb-2">Interested Job Roles</h5>
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="primary" size="md" className="bg-gray-100 text-gray-800">Software Engineer</Badge>
                          <Badge variant="primary" size="md" className="bg-gray-100 text-gray-800">Data Analyst</Badge>
                        </div>
                      </div>

                      <div className="p-4 border border-gray-200 rounded-lg">
                        <h5 className="font-medium text-gray-900 mb-2">Preferred Job Locations</h5>
                        <div className="flex flex-wrap gap-2">
                          {locations.map((location) => (
                            <Badge key={location} variant="primary" size="md" className="bg-gray-100 text-gray-800">
                              {location}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="p-4 border border-gray-200 rounded-lg">
                        <h5 className="font-medium text-gray-900 mb-2">Looking for</h5>
                        <Badge variant="primary" size="md" className="bg-gray-100 text-gray-800">Internship</Badge>
                      </div>

                      <div className="p-4 border border-gray-200 rounded-lg">
                        <h5 className="font-medium text-gray-900 mb-2">Employment Type</h5>
                        <div className="flex gap-2">
                          <Badge variant="primary" size="md" className="bg-gray-100 text-gray-800">Full-time</Badge>
                          <Badge variant="primary" size="md" className="bg-gray-100 text-gray-800">Remote</Badge>
                        </div>
                      </div>

                      <div className="p-4 border border-gray-200 rounded-lg">
                        <h5 className="font-medium text-gray-900 mb-2">Language</h5>
                        <p className="text-gray-900">English</p>
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
                    <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="fullName"
                      name="about.name"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="Enter your full name"
                      value={profileData.about.name}
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
                      name="about.gmail"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="Enter your email"
                      value={profileData.about.gmail}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                      Mobile Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="about.mobileNumber"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="Enter your phone number"
                      value={profileData.about.mobileNumber}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <label htmlFor="aboutParagraph" className="block text-sm font-medium text-gray-700 mb-1">
                      About You
                    </label>
                    <textarea
                      id="aboutParagraph"
                      name="about.aboutParagraph"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      rows="3"
                      placeholder="Tell us about yourself"
                      value={profileData.about.aboutParagraph}
                      onChange={handleInputChange}
                    ></textarea>
                  </div>
                  {/* Profile Image and Background Image Upload */}
                  <div>
                    <label htmlFor="profileImage" className="block text-sm font-medium text-gray-700 mb-1">
                      Profile Image
                    </label>
                    <input
                      type="file"
                      id="profileImage"
                      name="profileImage"
                      accept="image/*"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      onChange={(e) => handleFileChange(e, setProfileImage)}
                    />
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      onChange={(e) => handleFileChange(e, setBackgroundImage)}
                    />
                  </div>
                </div>
              </div>

              {/* Education */}
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
                      name="educationalBackground.degree"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="Enter your degree"
                      value={profileData.educationalBackground.degree}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <label htmlFor="institution" className="block text-sm font-medium text-gray-700 mb-1">
                      College/University
                    </label>
                    <input
                      type="text"
                      id="institution"
                      name="educationalBackground.collegeUniversity"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="Enter your institution"
                      value={profileData.educationalBackground.collegeUniversity}
                      onChange={handleInputChange}
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="Enter your branch"
                      value={profileData.educationalBackground.branch}
                      onChange={handleInputChange}
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="Enter graduation year"
                      value={profileData.educationalBackground.passingYear}
                      onChange={handleInputChange}
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="Enter CGPA"
                      value={profileData.educationalBackground.cgpa}
                      onChange={handleInputChange}
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
                      accept=".pdf,.doc,.docx,image/*"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      onChange={(e) => handleFileChange(e, setDegreeCertificate)}
                    />
                  </div>
                </div>
              </div>

              {/* Career Goals */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Career Goals</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="interestedIndustryType" className="block text-sm font-medium text-gray-700 mb-1">
                      Interested Industry Type
                    </label>
                    <select
                      id="interestedIndustryType"
                      name="careerGoals.interestedIndustryType"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      value={profileData.careerGoals.interestedIndustryType}
                      onChange={handleInputChange}
                    >
                      <option value="">Select Industry</option>
                      <option value="IT Industry">IT Industry</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Interested Job Roles
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {jobRoles.map((role) => (
                        <div key={role} className="flex items-center">
                          <input
                            type="checkbox"
                            id={`jobRole-${role}`}
                            name="careerGoals.interestedJobRoles"
                            value={role}
                            checked={profileData.careerGoals.interestedJobRoles.includes(role)}
                            onChange={handleInputChange}
                            className="h-4 w-4 text-primary-600 border-gray-300 rounded"
                          />
                          <label htmlFor={`jobRole-${role}`} className="ml-2 text-sm text-gray-700">
                            {role}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Preferred Job Locations
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {locations.map((location) => (
                        <div key={location} className="flex items-center">
                          <input
                            type="checkbox"
                            id={`location-${location}`}
                            name="careerGoals.preferredJobLocations"
                            value={location}
                            checked={profileData.careerGoals.preferredJobLocations.includes(location)}
                            onChange={handleInputChange}
                            className="h-4 w-4 text-primary-600 border-gray-300 rounded"
                          />
                          <label htmlFor={`location-${location}`} className="ml-2 text-sm text-gray-700">
                            {location.charAt(0).toUpperCase() + location.slice(1)}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label htmlFor="lookingFor" className="block text-sm font-medium text-gray-700 mb-1">
                      Looking For
                    </label>
                    <select
                      id="lookingFor"
                      name="careerGoals.lookingFor"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      value={profileData.careerGoals.lookingFor}
                      onChange={handleInputChange}
                    >
                      <option value="">Select Option</option>
                      {lookingForOptions.map(option => (
                        <option key={option} value={option}>{option.charAt(0).toUpperCase() + option.slice(1)}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Employment Type
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {employmentTypes.map((type) => (
                        <div key={type} className="flex items-center">
                          <input
                            type="checkbox"
                            id={`employmentType-${type}`}
                            name="careerGoals.employmentType"
                            value={type}
                            checked={profileData.careerGoals.employmentType.includes(type)}
                            onChange={handleInputChange}
                            className="h-4 w-4 text-primary-600 border-gray-300 rounded"
                          />
                          <label htmlFor={`employmentType-${type}`} className="ml-2 text-sm text-gray-700">
                            {type.charAt(0).toUpperCase() + type.slice(1)}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Work Experience - your current logic for adding/handling multiple experiences can be kept */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Work Experience</h3>
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
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Company
                        </label>
                        <select
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                          value={exp.company}
                          onChange={(e) => handleWorkExperienceChange(index, 'company', e.target.value)}
                        >
                          <option value="">Select Company</option>
                          <option value="company1">Company 1</option>
                          <option value="company2">Company 2</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Job Role
                        </label>
                        <select
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                          value={exp.jobRole}
                          onChange={(e) => handleWorkExperienceChange(index, 'jobRole', e.target.value)}
                        >
                          <option value="">Select Role</option>
                          <option value="developer">Developer</option>
                          <option value="designer">Designer</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Start Date
                        </label>
                        <input
                          type="date"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                          value={exp.startDate}
                          onChange={(e) => handleWorkExperienceChange(index, 'startDate', e.target.value)}
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
                        onChange={(e) => handleWorkExperienceChange(index, 'description', e.target.value)}
                        placeholder="Describe your role and responsibilities"
                      ></textarea>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                            className="w-full px-3 py-2 border border-gray-300 rounded-none rounded-r-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                            value={exp.currentSalary}
                            onChange={(e) => handleWorkExperienceChange(index, 'currentSalary', e.target.value)}
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
                            className="w-full px-3 py-2 border border-gray-300 rounded-none rounded-r-md focus:outline-none focus:ring-2 focus:ring-primary-500"
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

              {/* Skills & Social Profiles */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Skills & Social Profiles</h3>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="skills" className="block text-sm font-medium text-gray-700 mb-1">
                      Skills (comma separated)
                    </label>
                    <textarea
                      id="skills"
                      name="skills"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      rows="3"
                      placeholder="e.g., JavaScript, React, Node.js"
                      value={profileData.skills.join(', ')} // Join array back to string for display
                      onChange={handleInputChange}
                    ></textarea>
                  </div>
                  <div>
                    <label htmlFor="linkedinUrl" className="block text-sm font-medium text-gray-700 mb-1">
                      LinkedIn URL
                    </label>
                    <input
                      type="url"
                      id="linkedinUrl"
                      name="socialProfiles.linkedinUrl"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="https://linkedin.com/in/yourprofile"
                      value={profileData.socialProfiles.linkedinUrl}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <label htmlFor="githubUrl" className="block text-sm font-medium text-gray-700 mb-1">
                      GitHub URL
                    </label>
                    <input
                      type="url"
                      id="githubUrl"
                      name="socialProfiles.githubUrl"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="https://github.com/yourprofile"
                      value={profileData.socialProfiles.githubUrl}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <label htmlFor="portfolioUrl" className="block text-sm font-medium text-gray-700 mb-1">
                      Portfolio URL
                    </label>
                    <input
                      type="url"
                      id="portfolioUrl"
                      name="socialProfiles.portfolioUrl"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="https://yourportfolio.com"
                      value={profileData.socialProfiles.portfolioUrl}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <label htmlFor="certificationsUrls" className="block text-sm font-medium text-gray-700 mb-1">
                      Certifications URLs (comma separated)
                    </label>
                    <textarea
                      id="certificationsUrls"
                      name="certificationsUrls" // Direct field on profileData
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      rows="3"
                      placeholder="e.g., https://coursera.org/cert1, https://udemy.com/cert2"
                      value={profileData.certificationsUrls.join(', ')}
                      onChange={(e) => setProfileData(prev => ({
                          ...prev,
                          certificationsUrls: e.target.value.split(',').map(url => url.trim()).filter(url => url !== '')
                      }))}
                    ></textarea>
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
                name="resume" // Name for the backend
                accept=".pdf,.doc,.docx"
                onChange={(e) => handleFileChange(e, setResume)}
              />
              <label
                htmlFor="resume-upload"
                className="cursor-pointer inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-black hover:bg-gray-900"
              >
                Upload Resume
              </label>
              {resume && <p className="mt-2 text-sm text-gray-700">Selected file: {resume.name}</p>}
              <p className="mt-2 text-sm text-gray-600">Supported formats: PDF, DOC, DOCX</p>
            </div>
            {/* You might want a separate "Save Resume" button here if it's a separate API call,
                or include it in the main profile save if it updates the same profile.
                For now, I've linked it to the main handleSubmit by putting the file in state.
            */}
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;