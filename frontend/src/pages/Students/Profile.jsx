import { useState, useEffect, useRef } from 'react';
import Button from '@/components/ui/Button';
import Avatar from '@/components/ui/Avatar';
import Badge from '@/components/ui/Badge';
import { FiLinkedin, FiGithub, FiGlobe, FiPlus, FiUploadCloud, FiChevronDown } from 'react-icons/fi'; // Added FiChevronDown
import axios from 'axios';

function Profile() {
  const [activeTab, setActiveTab] = useState('overview');
  const [switchToPro, setSwitchToPro] = useState(false);
  const [isProfileEditing, setIsProfileEditing] = useState(false); // State for profile edit mode
  const [workExperiences, setWorkExperiences] = useState([{ // State for work experiences
    company: '',
    jobRole: '',
    startDate: '',
    description: '',
    currentSalary: '',
    expectedSalary: ''
  }]);
  const [profileData, setProfileData] = useState({
    profileImageUrl: '', // Placeholder for profile image URL
    backgroundImageUrl: '', // Placeholder for background image URL
    fullName: 'Name Surname',
    email: 'hello@gmail.com',
    mobileNumber: '1234567890',
    about: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam libero vitae erat. Aenean faucibus nibh et justo cursus id rutrum lorem imperdiet. Nunc ut sem vitae risus tristique posuere.',

    // Educational Background
    collegeUniversity: '',
    degree: '',
    yearOfGraduation: '',
    currentCGPA: '',
    degreeCertificateUrl: '', // For degree certificate upload

    // Career Goals
    interestedIndustry: 'IT Industry',
    interestedJobRoles: [], // Initialize as empty array for multi-select
    preferredJobLocations: [], // Initialize as empty array for multi-select
    lookingFor: 'Internship', // 'Job', 'Internship', 'Both'
    employmentType: [], // Initialize as empty array for multi-select (Full-time, Part-time, Contract)

    // Skills
    skills: ['SQL', 'REST', 'CSS 3', 'HTML 5', 'Node.js', 'React.js', 'AWS S3', 'AWS IAM', 'AWS EC2', 'AWS RDS', 'AWS ECS'],

    // Social Profiles
    linkedinUrl: 'https://www.linkedin.com/in/namesurname',
    githubUrl: 'https://github.com/namesurname',
    websiteUrl: 'https://www.namesurname.com',

    // Certifications
    certifications: [{ name: 'Coursera Meta Frontend', url: 'https://www.coursera.org/meta-frontend-dev' }],

    // Language
    language: 'English',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // States for custom multi-select dropdown visibility
  const [isJobRolesDropdownOpen, setIsJobRolesDropdownOpen] = useState(false);
  const [isLocationsDropdownOpen, setIsLocationsDropdownOpen] = useState(false);

  // Refs for custom multi-select dropdowns to detect outside clicks
  const jobRolesDropdownRef = useRef(null);
  const locationsDropdownRef = useRef(null);


  // Predefined options for dropdowns and toggles
  const predefinedJobRoles = ['Software Engineer', 'Data Analyst', 'Product Manager', 'UX Designer', 'DevOps Engineer', 'Full Stack Developer'];
  const predefinedLocations = ['Noida', 'Delhi', 'Gurgaon', 'Bangalore', 'Pune', 'Mumbai', 'Hyderabad', 'Chennai', 'Kolkata', 'Remote'];
  const predefinedEmploymentTypes = ['Part-time', 'Full-time', 'Contract', 'Temporary'];
  const predefinedLookingFor = ['Job', 'Internship', 'Both'];
  const predefinedIndustries = ['IT Industry', 'Finance', 'Healthcare', 'Education', 'Marketing', 'Retail', 'Manufacturing', 'Automotive'];


  // Simulate fetching profile data on component mount
  useEffect(() => {
    const fetchUserProfileData = async () => {
      setLoading(true);
      setError(null);
      try {
        // In a real application, replace with your actual API endpoint
        // const response = await axios.get('/api/userProfile/getInformation', {
        //   headers: {
        //     Authorization: `Bearer ${localStorage.getItem('token')}`
        //   }
        // });
        // setProfileData(response.data.profile);

        // For now, use mock data and simulate network delay
        setTimeout(() => {
          setProfileData(prevData => ({
            ...prevData,
            profileImageUrl: 'https://placehold.co/150x150/EEEEEE/888888?text=NS', // Example profile image
            backgroundImageUrl: 'https://placehold.co/1200x200/CCCCCC/666666?text=Background+Image', // Example background image
            collegeUniversity: 'University of Technology',
            degree: 'B.Tech in Computer Science',
            yearOfGraduation: '2023',
            currentCGPA: '8.5',
            degreeCertificateUrl: '', // Example: 'https://example.com/degree.pdf'
            skills: ['SQL', 'REST', 'CSS 3', 'HTML 5', 'Node.js', 'React.js', 'AWS S3', 'AWS IAM', 'AWS EC2', 'AWS RDS', 'AWS ECS'],
            interestedJobRoles: ['Software Engineer', 'Data Analyst'], // Default selections
            preferredJobLocations: ['Noida', 'Remote'], // Default selections
            employmentType: ['Full-time'], // Default selections
          }));
          setLoading(false);
        }, 500); // Simulate loading time
      } catch (err) {
        console.error('Error fetching user profile:', err);
        setError('Failed to load profile data.');
        setLoading(false);
      }
    };
    fetchUserProfileData();
  }, []);

  // Effect to handle clicks outside of custom dropdowns
  useEffect(() => {
    function handleClickOutside(event) {
      if (jobRolesDropdownRef.current && !jobRolesDropdownRef.current.contains(event.target)) {
        setIsJobRolesDropdownOpen(false);
      }
      if (locationsDropdownRef.current && !locationsDropdownRef.current.contains(event.target)) {
        setIsLocationsDropdownOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handler for basic profile data changes
  const handleProfileDataChange = (field, value) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  // Handler for work experience changes (used in Professional Dashboard switch)
  const handleWorkExperienceChange = (index, field, value) => {
    const newExperiences = [...workExperiences];
    newExperiences[index][field] = value;
    setWorkExperiences(newExperiences);
  };

  // Function to add new work experience entry
  const addWorkExperience = () => {
    setWorkExperiences([...workExperiences, {
      company: '',
      jobRole: '',
      startDate: '',
      description: '',
      currentSalary: '',
      expectedSalary: ''
    }]);
  };

  // Handler for image uploads (profile and background)
  const handleImageUpload = async (event, imageType) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append(imageType, file);

    try {
      // Replace with your actual API endpoint for updating user images
      const endpoint = imageType === 'backgroundImage' ? '/api/userProfile/updateBackgroundImage' : '/api/userProfile/updateProfileImage';
      // Simulate upload by creating a temporary URL for immediate preview
      const imageUrl = URL.createObjectURL(file);
      setProfileData(prevData => ({
        ...prevData,
        [`${imageType}Url`]: imageUrl
      }));
      // In a real application, you'd send formData to backend and get a persistent URL
      // const response = await axios.put(endpoint, formData, {
      //   headers: {
      //     'Content-Type': 'multipart/form-data',
      //     Authorization: `Bearer ${localStorage.getItem('token')}`
      //   }
      // });
      // setProfileData(prevData => ({
      //   ...prevData,
      //   [`${imageType}Url`]: response.data.imageUrl // Adjust based on your API response
      // }));
      console.log(`${imageType === 'backgroundImage' ? 'Background' : 'Profile'} image updated successfully!`);
    } catch (err) {
      console.error(`Error uploading ${imageType} image:`, err);
      console.log(`Failed to upload ${imageType} image. Make sure it's a valid image file.`);
    }
  };

  // Handler for degree certificate upload
  const handleDegreeCertificateUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('degreeCertificate', file);

    try {
      // Simulate upload by creating a temporary URL
      const fileUrl = URL.createObjectURL(file);
      setProfileData(prevData => ({
        ...prevData,
        degreeCertificateUrl: fileUrl
      }));
      console.log('Degree certificate uploaded successfully!');
      // In a real application, send formData to backend
      // const response = await axios.put('/api/userProfile/uploadDegreeCertificate', formData, { ... });
      // setProfileData(prevData => ({ ...prevData, degreeCertificateUrl: response.data.fileUrl }));
    } catch (err) {
      console.error('Error uploading degree certificate:', err);
      console.log('Failed to upload degree certificate.');
    }
  };

  // Handler for toggling selection in custom multi-select dropdowns
  const handleCustomMultiSelectToggle = (field, item) => {
    setProfileData(prev => {
      const currentItems = prev[field] || [];
      if (currentItems.includes(item)) {
        return { ...prev, [field]: currentItems.filter(i => i !== item) };
      } else {
        return { ...prev, [field]: [...currentItems, item] };
      }
    });
  };

  // Render content based on active tab and switch state
  const renderContent = () => {
    if (loading) return <div className="text-center py-8">Loading profile data...</div>;
    if (error) return <div className="text-center py-8 text-red-600">{error}</div>;

    if (switchToPro) {
      return (
        <div className="max-w-3xl mx-auto">
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
                {/* Simplified Work Experience form for Professional Dashboard switch */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Company
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                    placeholder="Enter company name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Job Role
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                    placeholder="Enter job role"
                  />
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

    // Common style for non-editable fields (display mode)
    const displayFieldStyle = "w-full px-3 py-2 border border-gray-200 rounded-md bg-gray-50 text-gray-900 min-h-[40px] flex items-center";
    const displayFieldWrapperStyle = "relative mt-1";

    // Regular profile content based on activeTab
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
              <h3 className="text-lg font-medium text-gray-900 mb-4">What recruiters will see</h3>
              <div className="border-2 border-gray-200 rounded-lg divide-y divide-gray-200">
                <div className="p-6">
                  <div className="flex items-start gap-4">
                    <Avatar size="lg" name={profileData.fullName} src={profileData.profileImageUrl} />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
                        <div>
                          <h4 className="text-lg font-medium text-gray-900">{profileData.fullName}</h4>
                          <p className="text-sm text-gray-600">
                            {profileData.degree} at {profileData.collegeUniversity}, {profileData.yearOfGraduation}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          {profileData.linkedinUrl && (
                            <a href={profileData.linkedinUrl} target="_blank" rel="noopener noreferrer">
                              <Button variant="outline" size="sm" className="border-black text-black hover:bg-gray-50">
                                <FiLinkedin className="w-4 h-4" />
                              </Button>
                            </a>
                          )}
                          {profileData.githubUrl && (
                            <a href={profileData.githubUrl} target="_blank" rel="noopener noreferrer">
                              <Button variant="outline" size="sm" className="border-black text-black hover:bg-gray-50">
                                <FiGithub className="w-4 h-4" />
                              </Button>
                            </a>
                          )}
                          {profileData.websiteUrl && (
                            <a href={profileData.websiteUrl} target="_blank" rel="noopener noreferrer">
                              <Button variant="outline" size="sm" className="border-black text-black hover:bg-gray-50">
                                <FiGlobe className="w-4 h-4" />
                              </Button>
                            </a>
                          )}
                        </div>
                      </div>

                      <div className="space-y-6">
                        <div className="p-4 border border-gray-200 rounded-lg">
                          <h5 className="font-medium text-gray-900 mb-2">About</h5>
                          <p className="text-gray-600">{profileData.about}</p>
                        </div>

                        <div className="p-4 border border-gray-200 rounded-lg">
                          <h5 className="font-medium text-gray-900 mb-2">Contact Information</h5>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm text-gray-500">Email address</p>
                              <p className="text-gray-900">{profileData.email}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Mobile Number</p>
                              <p className="text-gray-900">{profileData.mobileNumber}</p>
                            </div>
                          </div>
                        </div>

                        <div className="p-4 border border-gray-200 rounded-lg">
                          <h5 className="font-medium text-gray-900 mb-2">Education</h5>
                          <p className="text-gray-900">{profileData.degree}</p>
                          <p className="text-gray-600">{profileData.collegeUniversity}, {profileData.yearOfGraduation}</p>
                        </div>

                        <div className="p-4 border border-gray-200 rounded-lg">
                          <h5 className="font-medium text-gray-900 mb-2">Skills</h5>
                          <div className="flex flex-wrap gap-2">
                            {profileData.skills.map((skill) => (
                              <Badge key={skill} variant="primary" size="md" className="bg-gray-100 text-gray-800">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div className="p-4 border border-gray-200 rounded-lg">
                          <h5 className="font-medium text-gray-900 mb-2">Interested Industry Type</h5>
                          <Badge variant="primary" size="md" className="bg-gray-100 text-gray-800">{profileData.interestedIndustry}</Badge>
                        </div>

                        <div className="p-4 border border-gray-200 rounded-lg">
                          <h5 className="font-medium text-gray-900 mb-2">Interested Job Roles</h5>
                          <div className="flex flex-wrap gap-2">
                            {profileData.interestedJobRoles.map((role) => (
                              <Badge key={role} variant="primary" size="md" className="bg-gray-100 text-gray-800">{role}</Badge>
                            ))}
                          </div>
                        </div>

                        <div className="p-4 border border-gray-200 rounded-lg">
                          <h5 className="font-medium text-gray-900 mb-2">Preferred Job Locations</h5>
                          <div className="flex flex-wrap gap-2">
                            {profileData.preferredJobLocations && profileData.preferredJobLocations.length > 0 ? (
                              profileData.preferredJobLocations.map((location) => (
                                <Badge key={location} variant="primary" size="md" className="bg-gray-100 text-gray-800">
                                  {location}
                                </Badge>
                              ))
                            ) : (
                              <span className="text-gray-600">N/A</span>
                            )}
                          </div>
                        </div>

                        <div className="p-4 border border-gray-200 rounded-lg">
                          <h5 className="font-medium text-gray-900 mb-2">Looking for</h5>
                          <Badge variant="primary" size="md" className="bg-gray-100 text-gray-800">{profileData.lookingFor}</Badge>
                        </div>

                        <div className="p-4 border border-gray-200 rounded-lg">
                          <h5 className="font-medium text-gray-900 mb-2">Employment Type</h5>
                          <div className="flex gap-2">
                            {profileData.employmentType.map((type) => (
                              <Badge key={type} variant="primary" size="md" className="bg-gray-100 text-gray-800">{type}</Badge>
                            ))}
                          </div>
                        </div>

                        <div className="p-4 border border-gray-200 rounded-lg">
                          <h5 className="font-medium text-gray-900 mb-2">Language</h5>
                          <p className="text-gray-900">{profileData.language}</p>
                        </div>

                        {profileData.certifications.length > 0 && (
                          <div className="p-4 border border-gray-200 rounded-lg">
                            <h5 className="font-medium text-gray-900 mb-2">Certifications</h5>
                            <ul className="list-disc list-inside text-gray-600">
                              {profileData.certifications.map((cert, idx) => (
                                <li key={idx}>
                                  {cert.name}
                                  {cert.url && (
                                    <a href={cert.url} target="_blank" rel="noopener noreferrer" className="ml-2 text-blue-600 hover:underline">
                                      (Link)
                                    </a>
                                  )}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'profile':
        return (
          <div className="space-y-6">
            {/* About Section */}
            <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">About</h3>
                  <p className="text-sm text-gray-600">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros.</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Enter your name *
                  </label>
                  {isProfileEditing ? (
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="Enter your name"
                      value={profileData.fullName}
                      onChange={(e) => handleProfileDataChange('fullName', e.target.value)}
                      required
                    />
                  ) : (
                    <div className={displayFieldStyle}>
                      {profileData.fullName || "N/A"}
                    </div>
                  )}
                </div>
       
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Enter your email *
                  </label>
                  <div className={displayFieldWrapperStyle}>
                    {isProfileEditing && (
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                          <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                        </svg>
                      </div>
                    )}
                    {isProfileEditing ? (
                      <input
                        type="email"
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="hello@xyz.com"
                        value={profileData.email}
                        onChange={(e) => handleProfileDataChange('email', e.target.value)}
                        required
                      />
                    ) : (
                      <div className={displayFieldStyle + (profileData.email ? " pl-10" : "")}>
                         {profileData.email && (
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                              <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                              <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                            </svg>
                          </div>
                        )}
                        {profileData.email || "N/A"}
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Enter your mobile no. *
                  </label>
                  <div className={displayFieldWrapperStyle}>
                    {isProfileEditing && (
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 1.485A1 1 0 017.5 7H4a1 1 0 00-1 1v7a1 1 0 001 1h7a1 1 0 001-1v-3.5a1 1 0 011-1h1.485a1 1 0 01.836.986l1.485.74a1 1 0 01.52.879V17a1 1 0 01-1 1H3a1 1 0 01-1-1V3z" />
                        </svg>
                      </div>
                    )}
                    {isProfileEditing ? (
                      <input
                        type="tel"
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="1234567890"
                        value={profileData.mobileNumber}
                        onChange={(e) => handleProfileDataChange('mobileNumber', e.target.value)}
                        required
                      />
                    ) : (
                      <div className={displayFieldStyle + (profileData.mobileNumber ? " pl-10" : "")}>
                         {profileData.mobileNumber && (
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                              <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 1.485A1 1 0 017.5 7H4a1 1 0 00-1 1v7a1 1 0 001 1h7a1 1 0 001-1v-3.5a1 1 0 011-1h1.485a1 1 0 01.836.986l1.485.74a1 1 0 01.52.879V17a1 1 0 01-1 1H3a1 1 0 01-1-1V3z" />
                            </svg>
                          </div>
                        )}
                        {profileData.mobileNumber || "N/A"}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Educational Background Section */}
            <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Educational Background</h3>
                  <p className="text-sm text-gray-600">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros.</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    College/University
                  </label>
                  {isProfileEditing ? (
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="Placeholder"
                      value={profileData.collegeUniversity}
                      onChange={(e) => handleProfileDataChange('collegeUniversity', e.target.value)}
                    />
                  ) : (
                    <div className={displayFieldStyle}>
                      {profileData.collegeUniversity || "N/A"}
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Degree
                  </label>
                  {isProfileEditing ? (
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="Placeholder"
                      value={profileData.degree}
                      onChange={(e) => handleProfileDataChange('degree', e.target.value)}
                    />
                  ) : (
                    <div className={displayFieldStyle}>
                      {profileData.degree || "N/A"}
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Year of Graduation
                  </label>
                  {isProfileEditing ? (
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="Placeholder"
                      value={profileData.yearOfGraduation}
                      onChange={(e) => handleProfileDataChange('yearOfGraduation', e.target.value)}
                    />
                  ) : (
                    <div className={displayFieldStyle}>
                      {profileData.yearOfGraduation || "N/A"}
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Current CGPA/Percentage
                  </label>
                  {isProfileEditing ? (
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="Placeholder"
                      value={profileData.currentCGPA}
                      onChange={(e) => handleProfileDataChange('currentCGPA', e.target.value)}
                    />
                  ) : (
                    <div className={displayFieldStyle}>
                      {profileData.currentCGPA || "N/A"}
                    </div>
                  )}
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Degree Certificate (Optional)
                  </label>
                  {isProfileEditing ? (
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                      <div className="space-y-1 text-center">
                        <FiUploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="flex text-sm text-gray-600">
                          <label
                            htmlFor="degree-certificate-upload"
                            className="relative cursor-pointer bg-white rounded-md font-medium text-black hover:text-gray-700 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500"
                          >
                            <span>Upload a file</span>
                            <input
                              id="degree-certificate-upload"
                              name="degree-certificate-upload"
                              type="file"
                              className="sr-only"
                              accept=".pdf,.doc,.docx"
                              onChange={handleDegreeCertificateUpload}
                            />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500">PDF, DOCX, DOC up to 10MB</p>
                        {profileData.degreeCertificateUrl && (
                          <p className="text-sm text-green-600 mt-2">
                            File uploaded: <a href={profileData.degreeCertificateUrl} target="_blank" rel="noopener noreferrer" className="underline">View Certificate</a>
                          </p>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className={displayFieldStyle}>
                      {profileData.degreeCertificateUrl ? (
                        <a href={profileData.degreeCertificateUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                          View Certificate
                        </a>
                      ) : (
                        "No certificate uploaded"
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Career Goals Section */}
            <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Career Goals</h3>
                  <p className="text-sm text-gray-600">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros.</p>
                </div>
              </div>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Interested Industry Type
                  </label>
                  {isProfileEditing ? (
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      value={profileData.interestedIndustry}
                      onChange={(e) => handleProfileDataChange('interestedIndustry', e.target.value)}
                    >
                      {predefinedIndustries.map(industry => (
                        <option key={industry} value={industry}>{industry}</option>
                      ))}
                    </select>
                  ) : (
                    <div className={displayFieldStyle}>
                      {profileData.interestedIndustry || "N/A"}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Interested Job Roles
                  </label>
                  {isProfileEditing ? (
                    <div className="relative" ref={jobRolesDropdownRef}>
                      <div
                        className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white flex items-center justify-between cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-500"
                        onClick={() => setIsJobRolesDropdownOpen(!isJobRolesDropdownOpen)}
                      >
                        <div className="flex flex-wrap gap-2 pr-6">
                          {profileData.interestedJobRoles.length > 0 ? (
                            profileData.interestedJobRoles.map(role => (
                              <Badge key={role} variant="primary" size="sm" className="bg-gray-200 text-gray-800">
                                {role}
                                <span
                                  className="ml-1 cursor-pointer text-gray-600 hover:text-gray-900"
                                  onClick={(e) => {
                                    e.stopPropagation(); // Prevent dropdown from closing
                                    handleCustomMultiSelectToggle('interestedJobRoles', role);
                                  }}
                                >x</span>
                              </Badge>
                            ))
                          ) : (
                            <span className="text-gray-500">Multiple-select</span>
                          )}
                        </div>
                        <FiChevronDown className="w-5 h-5 text-gray-400 absolute right-3" />
                      </div>
                      {isJobRolesDropdownOpen && (
                        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                          {predefinedJobRoles.map((role) => (
                            <div
                              key={role}
                              className={`px-3 py-2 cursor-pointer hover:bg-gray-100 ${
                                profileData.interestedJobRoles.includes(role) ? 'bg-blue-50 text-blue-800' : ''
                              }`}
                              onClick={() => handleCustomMultiSelectToggle('interestedJobRoles', role)}
                            >
                              {role}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className={displayFieldStyle}>
                      {profileData.interestedJobRoles.length > 0 ? (
                        <div className="flex flex-wrap gap-2 py-1">
                            {profileData.interestedJobRoles.map(role => (
                                <Badge key={role} variant="primary" size="md" className="bg-gray-100 text-gray-800">
                                    {role}
                                </Badge>
                            ))}
                        </div>
                      ) : "N/A"}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Preferred Job Locations
                  </label>
                  {isProfileEditing ? (
                    <div className="relative" ref={locationsDropdownRef}>
                      <div
                        className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white flex items-center justify-between cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-500"
                        onClick={() => setIsLocationsDropdownOpen(!isLocationsDropdownOpen)}
                      >
                        <div className="flex flex-wrap gap-2 pr-6">
                          {profileData.preferredJobLocations.length > 0 ? (
                            profileData.preferredJobLocations.map(location => (
                              <Badge key={location} variant="primary" size="sm" className="bg-gray-200 text-gray-800">
                                {location}
                                <span
                                  className="ml-1 cursor-pointer text-gray-600 hover:text-gray-900"
                                  onClick={(e) => {
                                    e.stopPropagation(); // Prevent dropdown from closing
                                    handleCustomMultiSelectToggle('preferredJobLocations', location);
                                  }}
                                >x</span>
                              </Badge>
                            ))
                          ) : (
                            <span className="text-gray-500">Multiple-select</span>
                          )}
                        </div>
                        <FiChevronDown className="w-5 h-5 text-gray-400 absolute right-3" />
                      </div>
                      {isLocationsDropdownOpen && (
                        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                          {predefinedLocations.map((location) => (
                            <div
                              key={location}
                              className={`px-3 py-2 cursor-pointer hover:bg-gray-100 ${
                                profileData.preferredJobLocations.includes(location) ? 'bg-blue-50 text-blue-800' : ''
                              }`}
                              onClick={() => handleCustomMultiSelectToggle('preferredJobLocations', location)}
                            >
                              {location}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className={displayFieldStyle}>
                      {profileData.preferredJobLocations && profileData.preferredJobLocations.length > 0 ? (
                        <div className="flex flex-wrap gap-2 py-1">
                            {profileData.preferredJobLocations.map(location => (
                                <Badge key={location} variant="primary" size="md" className="bg-gray-100 text-gray-800">
                                    {location}
                                </Badge>
                            ))}
                        </div>
                      ) : "N/A"}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Looking for
                  </label>
                  {isProfileEditing ? (
                    <div className="flex flex-wrap gap-3">
                      {predefinedLookingFor.map((option) => (
                        <Button
                          key={option}
                          variant={profileData.lookingFor === option ? 'primary' : 'outline'}
                          className={profileData.lookingFor === option ? 'bg-black text-white' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}
                          onClick={() => handleProfileDataChange('lookingFor', option)}
                        >
                          {option}
                        </Button>
                      ))}
                    </div>
                  ) : (
                    <div className={displayFieldStyle}>
                      {profileData.lookingFor || "N/A"}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Employment type
                  </label>
                  {isProfileEditing ? (
                    <div className="flex flex-wrap gap-3">
                      {predefinedEmploymentTypes.map((type) => (
                        <Button
                          key={type}
                          variant={profileData.employmentType.includes(type) ? 'primary' : 'outline'}
                          className={profileData.employmentType.includes(type) ? 'bg-black text-white' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}
                          onClick={() => {
                            const currentTypes = [...profileData.employmentType];
                            if (currentTypes.includes(type)) {
                              handleProfileDataChange('employmentType', currentTypes.filter(t => t !== type));
                            } else {
                              handleProfileDataChange('employmentType', [...currentTypes, type]);
                            }
                          }}
                        >
                          {type}
                        </Button>
                      ))}
                    </div>
                  ) : (
                    <div className={displayFieldStyle}>
                      {profileData.employmentType.length > 0 ? (
                        <div className="flex flex-wrap gap-2 py-1">
                            {profileData.employmentType.map(type => (
                                <Badge key={type} variant="primary" size="md" className="bg-gray-100 text-gray-800">
                                    {type}
                                </Badge>
                            ))}
                        </div>
                      ) : "N/A"}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Skills Section */}
            <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Skills</h3>
                  <p className="text-sm text-gray-600">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros.</p>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Your Skills
                </label>
                {isProfileEditing ? (
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    rows="3"
                    placeholder="Enter your skills (comma separated)"
                    value={profileData.skills.join(', ')}
                    onChange={(e) => handleProfileDataChange('skills', e.target.value.split(',').map(s => s.trim()))}
                  ></textarea>
                ) : (
                  <div className={displayFieldStyle + " h-24 overflow-auto"}>
                    {profileData.skills.length > 0 ? (
                      <div className="flex flex-wrap gap-2 py-1">
                          {profileData.skills.map(skill => (
                              <Badge key={skill} variant="primary" size="md" className="bg-gray-100 text-gray-800">
                                  {skill}
                              </Badge>
                          ))}
                      </div>
                    ) : "N/A"}
                  </div>
                )}
              </div>
            </div>

            {/* Social Profiles Section */}
            <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Social Profiles</h3>
                  <p className="text-sm text-gray-600">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros.</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    LinkedIn
                  </label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 text-gray-500 bg-gray-50 border border-r-0 border-gray-300 rounded-l-md">
                      http://
                    </span>
                    {isProfileEditing ? (
                      <input
                        type="text"
                        className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md focus:ring-primary-500 focus:border-primary-500 sm:text-sm border border-gray-300"
                        placeholder="www.linkedin.com/in/yourprofile"
                        value={profileData.linkedinUrl.replace(/^(https?:\/\/)?(www\.)?/i, '')} // Remove http/https and www for input display
                        onChange={(e) => handleProfileDataChange('linkedinUrl', `http://${e.target.value}`)}
                      />
                    ) : (
                      <div className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md bg-gray-50 border border-gray-200 text-gray-900">
                        {profileData.linkedinUrl ? (
                          <a href={profileData.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                            {profileData.linkedinUrl}
                          </a>
                        ) : "N/A"}
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Github
                  </label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 text-gray-500 bg-gray-50 border border-r-0 border-gray-300 rounded-l-md">
                      http://
                    </span>
                    {isProfileEditing ? (
                      <input
                        type="text"
                        className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md focus:ring-primary-500 focus:border-primary-500 sm:text-sm border border-gray-300"
                        placeholder="github.com/yourprofile"
                        value={profileData.githubUrl.replace(/^(https?:\/\/)?(www\.)?/i, '')}
                        onChange={(e) => handleProfileDataChange('githubUrl', `http://${e.target.value}`)}
                      />
                    ) : (
                      <div className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md bg-gray-50 border border-gray-200 text-gray-900">
                        {profileData.githubUrl ? (
                          <a href={profileData.githubUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                            {profileData.githubUrl}
                          </a>
                        ) : "N/A"}
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Website
                  </label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 text-gray-500 bg-gray-50 border border-r-0 border-gray-300 rounded-l-md">
                      http://
                    </span>
                    {isProfileEditing ? (
                      <input
                        type="text"
                        className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md focus:ring-primary-500 focus:border-primary-500 sm:text-sm border border-gray-300"
                        placeholder="www.yourwebsite.com"
                        value={profileData.websiteUrl.replace(/^(https?:\/\/)?(www\.)?/i, '')}
                        onChange={(e) => handleProfileDataChange('websiteUrl', `http://${e.target.value}`)}
                      />
                    ) : (
                      <div className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md bg-gray-50 border border-gray-200 text-gray-900">
                        {profileData.websiteUrl ? (
                          <a href={profileData.websiteUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                            {profileData.websiteUrl}
                          </a>
                        ) : "N/A"}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Certifications Section */}
            <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Certifications</h3>
                  <p className="text-sm text-gray-600">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros.</p>
                </div>
              </div>
              {profileData.certifications.map((cert, index) => (
                <div key={index} className="space-y-4 mb-4 p-4 border border-gray-200 rounded-lg">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Certification Name
                    </label>
                    {isProfileEditing ? (
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                        value={cert.name}
                        onChange={(e) => {
                          const newCerts = [...profileData.certifications];
                          newCerts[index].name = e.target.value;
                          handleProfileDataChange('certifications', newCerts);
                        }}
                      />
                    ) : (
                      <div className={displayFieldStyle}>
                        {cert.name || "N/A"}
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Certification URL
                    </label>
                    <div className="flex">
                      <span className="inline-flex items-center px-3 text-gray-500 bg-gray-50 border border-r-0 border-gray-300 rounded-l-md">
                        http://
                      </span>
                      {isProfileEditing ? (
                        <input
                          type="text"
                          className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md focus:ring-primary-500 focus:border-primary-500 sm:text-sm border border-gray-300"
                          placeholder="www.example.com"
                          value={cert.url.replace(/^(https?:\/\/)?(www\.)?/i, '')}
                          onChange={(e) => {
                            const newCerts = [...profileData.certifications];
                            newCerts[index].url = `http://${e.target.value}`;
                            handleProfileDataChange('certifications', newCerts);
                          }}
                        />
                      ) : (
                        <div className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md bg-gray-50 border border-gray-200 text-gray-900">
                          {cert.url ? (
                            <a href={cert.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                              {cert.url}
                            </a>
                          ) : "N/A"}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {isProfileEditing && (
                <Button variant="outline" size="sm" onClick={() => handleProfileDataChange('certifications', [...profileData.certifications, { name: '', url: '' }])}>
                  <FiPlus className="w-4 h-4 mr-2" /> Add Certification
                </Button>
              )}
            </div>

            {/* Language Section */}
            <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Language</h3>
                  <p className="text-sm text-gray-600">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros.</p>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Language
                </label>
                {isProfileEditing ? (
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="e.g., English, Hindi"
                    value={profileData.language}
                    onChange={(e) => handleProfileDataChange('language', e.target.value)}
                  />
                ) : (
                  <div className={displayFieldStyle}>
                    {profileData.language || "N/A"}
                  </div>
                )}
              </div>
            </div>

            {/* Save Changes / Edit Profile Button for Profile Tab */}
            <div className="flex justify-end p-6 bg-white border border-gray-200 rounded-lg shadow-sm mt-6">
              <Button
                variant="primary"
                className="bg-black hover:bg-gray-900"
                onClick={() => setIsProfileEditing(!isProfileEditing)} // Toggle edit mode
              >
                {isProfileEditing ? 'Save Changes' : 'Edit Profile'}
              </Button>
            </div>
          </div>
        );
      case 'resume':
        return (
          <div className="space-y-6">
            <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Upload your resume/CV</h3>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <input
                  type="file"
                  className="hidden"
                  id="resume-upload"
                  accept=".pdf,.doc,.docx"
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
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col w-full bg-gray-100 min-h-screen">
      {/* Header Banner */}
      <div
        className="w-full h-32 bg-gray-300 relative bg-cover bg-center"
        style={{ backgroundImage: `url(${profileData.backgroundImageUrl})` }}
      >
        <label htmlFor="backgroundImageUpload" className="absolute inset-0 cursor-pointer flex items-center justify-center bg-black bg-opacity-20 opacity-0 hover:opacity-100 transition-opacity">
          <span className="text-white text-sm font-bold">Upload Background Image</span>
        </label>
        <input
          id="backgroundImageUpload"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleImageUpload(e, 'backgroundImage')}
        />
      </div>

      {/* Profile Section */}
      <div className="bg-white pb-4">
        <div className="relative px-4">
          {/* Profile Image */}
          <div className="absolute -top-16 left-4">
            <label htmlFor="profileImageUpload" className="relative w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center border-4 border-white cursor-pointer overflow-hidden">
              {profileData.profileImageUrl ? (
                <img src={profileData.profileImageUrl} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <div className="text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20 opacity-0 hover:opacity-100 transition-opacity">
                <span className="text-white text-xs font-bold">Upload</span>
              </div>
            </label>
            <input
              id="profileImageUpload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleImageUpload(e, 'profileImage')}
            />
          </div>
        </div>

        {/* User Info & Switch */}
        <div className="px-6 pt-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{profileData.fullName}</h2>
            <p className="text-gray-600">{profileData.email}</p>
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

        {/* Tabs */}
        <div className="flex border-b mt-4">
          {['overview', 'profile', 'resume'].map((tab) => (
            <button
              key={tab}
              className={`px-6 py-2 ${activeTab === tab ? 'border-b-2 border-black font-medium' : 'text-gray-500'}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1).replace('resume', 'Resume / CV')}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="p-4 flex-1">
        {renderContent()}
      </div>
    </div>
  );
}

export default Profile;