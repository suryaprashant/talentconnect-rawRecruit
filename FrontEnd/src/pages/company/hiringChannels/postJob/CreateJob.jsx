import { useState, useRef, useEffect } from 'react';
import { ChevronDown, X, Briefcase, MapPin, DollarSign, Users, BookOpen, Target, Award, Shield } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { City } from 'country-state-city';

export default function CreateJob() {
  const initialState = {
    jobTitle: '',
    description: '',
    employmentType: 'Full-time',
    workMode: 'On-site',
    location: [],
    packageDetails: {
      currency: 'USD',
      totalCTC: '',
      fixedPay: '',
      joiningBonus: ''
    },
    numberOfOpenings: '',
    minEducation: '',
    yearsOfExperience: '',
    skills: [],
    certifications: [],
    workAuthorization: '',
    studentStreams: [],
    eligibilityCriteria: '',
    benefits: [],
    tags: [],
    broadcastType: 'Everyone',
  };

  const [formData, setFormData] = useState(initialState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState({
    skills: false,
    certifications: false,
    locations: false,
    benefits: false,
    studentStreams: false,
    tags: false,
  });

  const [skillInput, setSkillInput] = useState('');
  const [certificationInput, setCertificationInput] = useState('');
  const [benefitInput, setBenefitInput] = useState('');
  const [studentStreamInput, setStudentStreamInput] = useState('');
  const [locationSearch, setLocationSearch] = useState('');
  const [indianCities, setIndianCities] = useState([]);
  const [descriptionError, setDescriptionError] = useState("");

  const skillsDropdownRef = useRef(null);
  const certificationsDropdownRef = useRef(null);
  const locationsDropdownRef = useRef(null);
  const benefitsDropdownRef = useRef(null);
  const studentStreamsDropdownRef = useRef(null);
  const tagsDropdownRef = useRef(null);

  const educationOptions = ["High School", "Bachelor's Degree", "Master's Degree", "PhD", "Diploma", "Other"];
  const fieldOfStudyOptions = ["Computer Science", "Engineering", "Business", "Arts", "Sciences", "Mathematics", "Medicine", "Law", "Other"];
  const experienceOptions = ["0-1 years", "1-3 years", "3-5 years", "5-10 years", "10+ years"];
  const allCertifications = ["AWS Certified", "Microsoft Certified", "Google Cloud Certified", "Cisco Certified", "PMP"];
  const allBenefits = ["Health Insurance", "401(k)", "Paid Time Off", "Flexible Schedule", "Dental Insurance"];
  const workAuthOptions = ["Citizens Only", "Permanent Residents", "Work Visa Holders", "Any"];
  const allSkills = ["JavaScript", "React", "Vue", "Angular", "Node.js", "Python", "Java", "C++", "SQL", "MongoDB"];
  const tagsOptions = ['Urgent hiring', 'Fresher preferred', 'Remote-friendly', 'Work from Home', 'Internship-eligible', 'Hybrid', 'High Priority', 'Contract', 'Part-time', 'Full-time'];

  const filteredSkills = allSkills.filter(skill => skill.toLowerCase().includes(skillInput.toLowerCase()));
  const filteredCertifications = allCertifications.filter(cert => cert.toLowerCase().includes(certificationInput.toLowerCase()));
  const filteredBenefits = allBenefits.filter(benefit => benefit.toLowerCase().includes(benefitInput.toLowerCase()));
  const filteredStudentStreams = fieldOfStudyOptions.filter(stream => stream.toLowerCase().includes(studentStreamInput.toLowerCase()));
  const filteredCities = indianCities.filter(city => city.name.toLowerCase().includes(locationSearch.toLowerCase()));

  useEffect(() => {
    const cities = City.getCitiesOfCountry('IN').sort((a, b) => a.name.localeCompare(b.name));
    setIndianCities(cities);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      const dropdownRefs = {
        skills: skillsDropdownRef,
        certifications: certificationsDropdownRef,
        locations: locationsDropdownRef,
        benefits: benefitsDropdownRef,
        studentStreams: studentStreamsDropdownRef,
        tags: tagsDropdownRef
      };

      for (const key in dropdownRefs) {
        if (dropdownRefs[key].current && !dropdownRefs[key].current.contains(event.target)) {
          setDropdownOpen(prev => ({ ...prev, [key]: false }));
        }
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => { document.removeEventListener('mousedown', handleClickOutside); };
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "description") {
      if (value.length > 500) {
        setDescriptionError("Job description cannot exceed 500 characters.");
      } else {
        setDescriptionError("");
      }
    }
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleOptionSelect = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePackageDetailsChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      packageDetails: { ...prev.packageDetails, [name]: value }
    }));
  };

  const addItem = (field, item) => {
    if (item && !formData[field].includes(item)) {
      setFormData(prev => ({ ...prev, [field]: [...prev[field], item] }));
    }
  };

  const removeItem = (field, item) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter(i => i !== item)
    }));
  };

  const handleMultiSelect = (field, value) => {
    setFormData(prev => {
      const currentValues = prev[field] || [];
      if (currentValues.includes(value)) {
        return { ...prev, [field]: currentValues.filter(item => item !== value) };
      } else {
        return { ...prev, [field]: [...currentValues, value] };
      }
    });
  };

  const toggleDropdown = (dropdown) => {
    setDropdownOpen(prev => ({
      ...Object.keys(prev).reduce((acc, key) => ({ ...acc, [key]: false }), {}),
      [dropdown]: !prev[dropdown]
    }));
  };

  const handleItemInputKeyDown = (e, field, input, setInput) => {
    if (e.key === 'Enter' && input.trim()) {
      e.preventDefault();
      addItem(field, input.trim());
      setInput('');
    }
  };

  const handleSelectItem = (field, item, setInput, dropdownKey) => {
    addItem(field, item);
    if (setInput) setInput('');
    setDropdownOpen(prev => ({ ...prev, [dropdownKey]: false }));
  };

  const handlePostJob = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    if (formData.description.length > 500) {
      setDescriptionError("Job description cannot exceed 500 characters.");
      toast.error("Job description cannot exceed 500 characters.");
      setIsSubmitting(false);
      return;
    }

    const requiredFields = {
      jobTitle: "Job Title",
      description: "Job Description",
      location: "Location",
      'packageDetails.totalCTC': "Salary Amount",
      numberOfOpenings: "No. of Openings",
    };

    for (const key in requiredFields) {
      const value = key.includes('.') ? formData.packageDetails.totalCTC : formData[key];
      if (!value || (Array.isArray(value) && value.length === 0)) {
        toast.error(`Please fill the required field: ${requiredFields[key]}`);
        setIsSubmitting(false);
        return;
      }
    }

    try {
      const payload = {
        ...formData,
        packageDetails: {
          currency: formData.packageDetails.currency,
          totalCTC: parseFloat(formData.packageDetails.totalCTC) || 0,
          fixedPay: parseFloat(formData.packageDetails.fixedPay) || 0,
          joiningBonus: parseFloat(formData.packageDetails.joiningBonus) || 0
        },
        minPackage: undefined,
        numberOfOpenings: parseInt(formData.numberOfOpenings, 10),
        tags: formData.tags,
        jobType: "Job-listing",
        broadcastType: formData.broadcastType
      };

      const response = await axios.post(
        `${import.meta.env.VITE_Backend_URL}/api/hiring-channels/job-posting`,
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          withCredentials: true
        }
      );

      toast.success("Job posted successfully!");
      setTimeout(() => {
        toast.success('This job will expire after 30 days');
      }, 2000);
      setFormData(initialState);

    } catch (error) {
      console.error("Detailed error:", error);
      toast.error(`Error posting job: ${error.response?.data?.error || error.response?.data?.message || error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setFormData(initialState);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#143694]/5 via-[#f093fb]/5 to-[#1e4ed8]/5">
      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="bg-white/90 backdrop-blur-sm border border-gray-100 rounded-2xl shadow-lg p-6 mb-8">
          <div className="text-center mb-6">
            <div className="flex items-center justify-center mb-3">
              <div className="p-2 bg-gradient-to-br from-[#143694]/20 to-[#1e4ed8]/20 rounded-lg mr-3">
                <Briefcase className="h-5 w-5 text-[#143694]" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-[#143694] to-[#1e4ed8] bg-clip-text text-transparent">
                Create Job Listing
              </h1>
            </div>
            <p className="text-md text-gray-600 max-w-2xl mx-auto">
              Post a new job opportunity and reach qualified candidates. Fill in the details below to create your job listing.
            </p>
          </div>
        </div>

        <form onSubmit={handlePostJob}>
          {/* Basic Job Details */}
          <div className="bg-white/90 backdrop-blur-sm border border-gray-100 rounded-2xl shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center">
              <Briefcase className="h-5 w-5 mr-2 text-[#143694]" />
              Basic Job Details
            </h2>
            <p className="text-sm text-gray-600 mb-6">Provide the core details about this job opportunity.</p>

            <div className="space-y-6">
              {/* Employment Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Employment type <span className="text-red-500">*</span></label>
                <div className="flex gap-2 flex-wrap">
                  <button 
                    type="button" 
                    className={`px-4 py-2 border rounded-lg transition-all duration-200 ${formData.employmentType === 'Full-time' ? 'bg-gradient-to-r from-[#143694] to-[#1e4ed8] text-white border-transparent shadow-md' : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300'}`} 
                    onClick={() => handleOptionSelect('employmentType', 'Full-time')}
                  >
                    Full-time
                  </button>
                  <button 
                    type="button" 
                    className={`px-4 py-2 border rounded-lg transition-all duration-200 ${formData.employmentType === 'Part-time' ? 'bg-gradient-to-r from-[#143694] to-[#1e4ed8] text-white border-transparent shadow-md' : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300'}`} 
                    onClick={() => handleOptionSelect('employmentType', 'Part-time')}
                  >
                    Part-time
                  </button>
                  <button 
                    type="button" 
                    className={`px-4 py-2 border rounded-lg transition-all duration-200 ${formData.employmentType === 'Contract' ? 'bg-gradient-to-r from-[#143694] to-[#1e4ed8] text-white border-transparent shadow-md' : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300'}`} 
                    onClick={() => handleOptionSelect('employmentType', 'Contract')}
                  >
                    Contract
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Job Title */}
                <div>
                  <label htmlFor="jobTitle" className="block text-sm font-medium text-gray-700 mb-2">Job Title <span className="text-red-500">*</span></label>
                  <input 
                    type="text" 
                    id="jobTitle" 
                    name="jobTitle" 
                    placeholder="Enter the Job Title" 
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#143694]/50 focus:border-transparent focus:outline-none transition-all duration-200 bg-gradient-to-r from-gray-50 to-white"
                    value={formData.jobTitle} 
                    onChange={handleInputChange} 
                  />
                </div>

                {/* Work Mode */}
                <div>
                  <label htmlFor="workMode" className="block text-sm font-medium text-gray-700 mb-2">Work Mode <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <select 
                      id="workMode" 
                      name="workMode" 
                      className="w-full p-3 border border-gray-200 rounded-lg appearance-none bg-gradient-to-r from-gray-50 to-white pr-10 focus:ring-2 focus:ring-[#143694]/50 focus:border-transparent focus:outline-none transition-all duration-200"
                      value={formData.workMode} 
                      onChange={handleInputChange}
                    >
                      <option value="On-site">On-site</option>
                      <option value="Remote">Remote</option>
                      <option value="Hybrid">Hybrid</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                  </div>
                </div>
              </div>

              {/* Location Multi-Select */}
              <div ref={locationsDropdownRef} className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                  Location <span className="text-red-500">*</span>
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.location.map(loc => (
                    <div key={loc} className="flex items-center bg-gradient-to-r from-gray-100 to-white border border-gray-200 text-gray-700 text-sm px-3 py-1 rounded-full">
                      <span>{loc}</span>
                      <button type="button" onClick={() => removeItem('location', loc)} className="ml-2 text-gray-500 hover:text-gray-700">
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
                <div
                  className="flex items-center justify-between p-3 w-full border border-gray-200 rounded-lg cursor-pointer hover:border-gray-300 transition-colors bg-gradient-to-r from-gray-50 to-white"
                  onClick={() => toggleDropdown('locations')}
                >
                  <span className="text-gray-500">Select locations</span>
                  <ChevronDown className={`w-5 h-5 transition-transform ${dropdownOpen.locations ? "rotate-180" : ""} text-gray-400`} />
                </div>
                {dropdownOpen.locations && (
                  <div className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg">
                    <div className="p-2 border-b border-gray-100">
                      <input
                        type="text"
                        value={locationSearch}
                        onChange={(e) => setLocationSearch(e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                        placeholder="Search for a city..."
                        className="w-full p-2 border border-gray-200 rounded-lg"
                      />
                    </div>
                    <div className="max-h-60 overflow-auto">
                      {filteredCities.map(city => (
                        <div
                          key={`${city.name}-${city.stateCode}`}
                          onClick={() => handleSelectItem('location', city.name, null, 'locations')}
                          className={`px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 ${formData.location.includes(city.name) ? "bg-blue-50" : ""}`}
                        >
                          <div className="flex items-center justify-between">
                            <span className={formData.location.includes(city.name) ? "text-[#143694] font-medium" : "text-gray-700"}>{city.name}</span>
                            {formData.location.includes(city.name) && <span className="text-[#143694]">✓</span>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Broadcast Options */}
              <div>
                <label className="block mb-2 font-medium text-gray-700">Broadcast Options <span className="text-red-500">*</span></label>
                <div className="flex items-center space-x-6">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="broadcastType"
                      value="Everyone"
                      checked={formData.broadcastType === 'Everyone'}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-[#143694] border-gray-300 focus:ring-[#143694]/50"
                    />
                    <span className="ml-2 text-gray-700">Broadcast to Everyone</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="broadcastType"
                      value="Location"
                      checked={formData.broadcastType === 'Location'}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-[#143694] border-gray-300 focus:ring-[#143694]/50"
                    />
                    <span className="ml-2 text-gray-700">Broadcast by Location</span>
                  </label>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Select 'Broadcast by Location' to show this job only to candidates in the specified locations.
                </p>
              </div>

              {/* Package Details */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <DollarSign className="h-4 w-4 mr-2 text-gray-500" />
                  Package Details (CTC) <span className="text-red-500">*</span>
                </label>
                <div className="flex mb-2">
                  <div className="relative w-24">
                    <select
                      name="currency"
                      value={formData.packageDetails.currency}
                      onChange={handlePackageDetailsChange}
                      className="w-full h-full pl-3 pr-8 py-3 border border-gray-200 rounded-l-lg appearance-none bg-gradient-to-r from-gray-50 to-white focus:ring-2 focus:ring-[#143694]/50 focus:border-transparent focus:outline-none"
                    >
                      <option value="USD">USD</option>
                      <option value="INR">INR</option>
                      <option value="EUR">EUR</option>
                    </select>
                    <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={12} />
                  </div>
                  <input
                    type="number"
                    name="totalCTC"
                    placeholder="Enter Total CTC"
                    className="flex-1 p-3 border border-l-0 border-gray-200 rounded-r-lg focus:ring-2 focus:ring-[#143694]/50 focus:border-transparent focus:outline-none transition-all duration-200 bg-gradient-to-r from-gray-50 to-white"
                    value={formData.packageDetails.totalCTC}
                    onChange={handlePackageDetailsChange}
                    min="0"
                    required
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="number"
                    name="fixedPay"
                    value={formData.packageDetails.fixedPay}
                    onChange={handlePackageDetailsChange}
                    placeholder="Fixed Pay (optional)"
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#143694]/50 focus:border-transparent focus:outline-none transition-all duration-200 bg-gradient-to-r from-gray-50 to-white"
                  />
                  <input
                    type="number"
                    name="joiningBonus"
                    value={formData.packageDetails.joiningBonus}
                    onChange={handlePackageDetailsChange}
                    placeholder="Joining Bonus (optional)"
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#143694]/50 focus:border-transparent focus:outline-none transition-all duration-200 bg-gradient-to-r from-gray-50 to-white"
                  />
                </div>
              </div>

              {/* Number of Openings */}
              <div>
                <label htmlFor="numberOfOpenings" className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <Users className="h-4 w-4 mr-2 text-gray-500" />
                  No. of Openings <span className="text-red-500">*</span>
                </label>
                <input 
                  type="number" 
                  id="numberOfOpenings" 
                  name="numberOfOpenings" 
                  placeholder="Ex. 5" 
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#143694]/50 focus:border-transparent focus:outline-none transition-all duration-200 bg-gradient-to-r from-gray-50 to-white"
                  value={formData.numberOfOpenings} 
                  onChange={handleInputChange} 
                  min="1" 
                />
              </div>

              {/* Job Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">Job Description <span className="text-red-500">*</span></label>
                <textarea
                  id="description"
                  name="description"
                  placeholder="Describe the job responsibilities and requirements..."
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#143694]/50 focus:border-transparent focus:outline-none transition-all duration-200 bg-gradient-to-r from-gray-50 to-white h-32 ${descriptionError ? 'border-red-300' : 'border-gray-200'}`}
                  value={formData.description}
                  onChange={handleInputChange}
                  maxLength={500}
                  required
                />
                <div className="flex justify-between text-xs mt-1">
                  <span className={descriptionError ? 'text-red-500' : 'text-gray-500'}>
                    {descriptionError ? descriptionError : `${formData.description.length}/500 characters`}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Selection Criteria Section */}
          <div className="bg-white/90 backdrop-blur-sm border border-gray-100 rounded-2xl shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center">
              <Target className="h-5 w-5 mr-2 text-[#143694]" />
              Selection Criteria
            </h2>
            <p className="text-sm text-gray-600 mb-6">Outline the qualifications for the ideal candidate.</p>

            <div className="space-y-6">
              {/* Eligibility Criteria */}
              <div>
                <label htmlFor="eligibilityCriteria" className="block text-sm font-medium text-gray-700 mb-2">Eligibility Criteria</label>
                <textarea 
                  id="eligibilityCriteria" 
                  name="eligibilityCriteria" 
                  placeholder="e.g., Minimum 3.0 GPA, Must be eligible to work in the specified location..." 
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#143694]/50 focus:border-transparent focus:outline-none transition-all duration-200 bg-gradient-to-r from-gray-50 to-white h-24"
                  value={formData.eligibilityCriteria} 
                  onChange={handleInputChange}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Minimum Education */}
                <div>
                  <label htmlFor="minEducation" className="block text-sm font-medium text-gray-700 mb-2">Minimum Education</label>
                  <div className="relative">
                    <select 
                      id="minEducation" 
                      name="minEducation" 
                      className="w-full p-3 border border-gray-200 rounded-lg appearance-none bg-gradient-to-r from-gray-50 to-white pr-10 focus:ring-2 focus:ring-[#143694]/50 focus:border-transparent focus:outline-none transition-all duration-200"
                      value={formData.minEducation} 
                      onChange={handleInputChange}
                    >
                      <option value="">Select education level</option>
                      {educationOptions.map((option, index) => (<option key={index} value={option}>{option}</option>))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                  </div>
                </div>

                {/* Years of Experience */}
                <div>
                  <label htmlFor="yearsOfExperience" className="block text-sm font-medium text-gray-700 mb-2">Years of Experience</label>
                  <div className="relative">
                    <select 
                      id="yearsOfExperience" 
                      name="yearsOfExperience" 
                      className="w-full p-3 border border-gray-200 rounded-lg appearance-none bg-gradient-to-r from-gray-50 to-white pr-10 focus:ring-2 focus:ring-[#143694]/50 focus:border-transparent focus:outline-none transition-all duration-200"
                      value={formData.yearsOfExperience} 
                      onChange={handleInputChange}
                    >
                      <option value="">Select experience range</option>
                      {experienceOptions.map((option, index) => (<option key={index} value={option}>{option}</option>))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                  </div>
                </div>
              </div>

              {/* Preferred Field of Study */}
              <div ref={studentStreamsDropdownRef}>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <BookOpen className="h-4 w-4 mr-2 text-gray-500" />
                  Preferred Field of Study
                </label>
                <div className="relative">
                  <div className="flex flex-wrap gap-2 mb-2">
                    {formData.studentStreams.map((stream, index) => (
                      <div key={index} className="flex items-center bg-gradient-to-r from-gray-100 to-white border border-gray-200 text-gray-700 text-sm px-3 py-1 rounded-full">
                        <span>{stream}</span>
                        <button type="button" className="ml-2 text-gray-500 hover:text-gray-700" onClick={(e) => { e.stopPropagation(); removeItem('studentStreams', stream); }}>
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="flex">
                    <input 
                      type="text" 
                      placeholder="Type a field of study..." 
                      className="flex-1 p-3 border border-gray-200 rounded-l-lg focus:ring-2 focus:ring-[#143694]/50 focus:border-transparent focus:outline-none transition-all duration-200 bg-gradient-to-r from-gray-50 to-white"
                      value={studentStreamInput} 
                      onChange={(e) => setStudentStreamInput(e.target.value)} 
                      onKeyDown={(e) => handleItemInputKeyDown(e, 'studentStreams', studentStreamInput, setStudentStreamInput)}
                      onClick={() => setDropdownOpen(prev => ({ ...prev, studentStreams: true }))}
                    />
                    <button 
                      type="button"
                      onClick={() => { if (studentStreamInput.trim()) addItem('studentStreams', studentStreamInput.trim()); setStudentStreamInput(''); }}
                      className="px-4 bg-gradient-to-r from-gray-50 to-white border border-l-0 border-gray-200 rounded-r-lg text-gray-600 hover:text-gray-800"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>

              {/* Skills */}
              <div ref={skillsDropdownRef}>
                <label className="block text-sm font-medium text-gray-700 mb-2">Skills</label>
                <div className="relative">
                  <div className="flex flex-wrap gap-2 mb-2">
                    {formData.skills.map((skill, index) => (
                      <div key={index} className="flex items-center bg-gradient-to-r from-gray-100 to-white border border-gray-200 text-gray-700 text-sm px-3 py-1 rounded-full">
                        <span>{skill}</span>
                        <button type="button" className="ml-2 text-gray-500 hover:text-gray-700" onClick={(e) => { e.stopPropagation(); removeItem('skills', skill); }}>
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="flex">
                    <input 
                      type="text" 
                      placeholder="Type a skill..." 
                      className="flex-1 p-3 border border-gray-200 rounded-l-lg focus:ring-2 focus:ring-[#143694]/50 focus:border-transparent focus:outline-none transition-all duration-200 bg-gradient-to-r from-gray-50 to-white"
                      value={skillInput} 
                      onChange={(e) => setSkillInput(e.target.value)} 
                      onKeyDown={(e) => handleItemInputKeyDown(e, 'skills', skillInput, setSkillInput)}
                      onClick={() => setDropdownOpen(prev => ({ ...prev, skills: true }))}
                    />
                    <button 
                      type="button"
                      onClick={() => { if (skillInput.trim()) addItem('skills', skillInput.trim()); setSkillInput(''); }}
                      className="px-4 bg-gradient-to-r from-gray-50 to-white border border-l-0 border-gray-200 rounded-r-lg text-gray-600 hover:text-gray-800"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>

              {/* Benefits */}
              <div ref={benefitsDropdownRef}>
                <label className="block text-sm font-medium text-gray-700 mb-2">Benefits</label>
                <div className="relative">
                  <div className="flex flex-wrap gap-2 mb-2">
                    {formData.benefits.map((benefit, index) => (
                      <div key={index} className="flex items-center bg-gradient-to-r from-gray-100 to-white border border-gray-200 text-gray-700 text-sm px-3 py-1 rounded-full">
                        <span>{benefit}</span>
                        <button type="button" className="ml-2 text-gray-500 hover:text-gray-700" onClick={(e) => { e.stopPropagation(); removeItem('benefits', benefit); }}>
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="flex">
                    <input 
                      type="text" 
                      placeholder="Type a benefit..." 
                      className="flex-1 p-3 border border-gray-200 rounded-l-lg focus:ring-2 focus:ring-[#143694]/50 focus:border-transparent focus:outline-none transition-all duration-200 bg-gradient-to-r from-gray-50 to-white"
                      value={benefitInput} 
                      onChange={(e) => setBenefitInput(e.target.value)} 
                      onKeyDown={(e) => handleItemInputKeyDown(e, 'benefits', benefitInput, setBenefitInput)}
                      onClick={() => setDropdownOpen(prev => ({ ...prev, benefits: true }))}
                    />
                    <button 
                      type="button"
                      onClick={() => { if (benefitInput.trim()) addItem('benefits', benefitInput.trim()); setBenefitInput(''); }}
                      className="px-4 bg-gradient-to-r from-gray-50 to-white border border-l-0 border-gray-200 rounded-r-lg text-gray-600 hover:text-gray-800"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>

              {/* Tags */}
              <div ref={tagsDropdownRef} className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.tags.map((tag, index) => (
                    <div key={index} className="flex items-center bg-gradient-to-r from-gray-100 to-white border border-gray-200 text-gray-700 text-sm px-3 py-1 rounded-full">
                      <span>{tag}</span>
                      <button type="button" className="ml-2 text-gray-500 hover:text-gray-700" onClick={(e) => { e.stopPropagation(); removeItem('tags', tag); }}>
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
                <div
                  className="flex items-center justify-between p-3 w-full border border-gray-200 rounded-lg cursor-pointer hover:border-gray-300 transition-colors bg-gradient-to-r from-gray-50 to-white"
                  onClick={() => toggleDropdown('tags')}
                >
                  <span className="text-gray-500">Select tags</span>
                  <ChevronDown className={`w-5 h-5 transition-transform ${dropdownOpen.tags ? "rotate-180" : ""} text-gray-400`} />
                </div>
                {dropdownOpen.tags && (
                  <div className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg">
                    {tagsOptions.map((tag, index) => (
                      <div 
                        key={index} 
                        className={`px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 ${formData.tags.includes(tag) ? "bg-blue-50" : ""}`}
                        onClick={() => handleSelectItem('tags', tag, null, 'tags')}
                      >
                        <div className="flex items-center justify-between">
                          <span className={formData.tags.includes(tag) ? "text-[#143694] font-medium" : "text-gray-700"}>{tag}</span>
                          {formData.tags.includes(tag) && <span className="text-[#143694]">✓</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Certifications */}
              <div ref={certificationsDropdownRef}>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <Award className="h-4 w-4 mr-2 text-gray-500" />
                  Certifications (if any)
                </label>
                <div className="relative">
                  <div className="flex flex-wrap gap-2 mb-2">
                    {formData.certifications.map((cert, index) => (
                      <div key={index} className="flex items-center bg-gradient-to-r from-gray-100 to-white border border-gray-200 text-gray-700 text-sm px-3 py-1 rounded-full">
                        <span>{cert}</span>
                        <button type="button" className="ml-2 text-gray-500 hover:text-gray-700" onClick={(e) => { e.stopPropagation(); removeItem('certifications', cert); }}>
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="flex">
                    <input 
                      type="text" 
                      placeholder="Type a certification..." 
                      className="flex-1 p-3 border border-gray-200 rounded-l-lg focus:ring-2 focus:ring-[#143694]/50 focus:border-transparent focus:outline-none transition-all duration-200 bg-gradient-to-r from-gray-50 to-white"
                      value={certificationInput} 
                      onChange={(e) => setCertificationInput(e.target.value)} 
                      onKeyDown={(e) => handleItemInputKeyDown(e, 'certifications', certificationInput, setCertificationInput)}
                      onClick={() => setDropdownOpen(prev => ({ ...prev, certifications: true }))}
                    />
                    <button 
                      type="button"
                      onClick={() => { if (certificationInput.trim()) addItem('certifications', certificationInput.trim()); setCertificationInput(''); }}
                      className="px-4 bg-gradient-to-r from-gray-50 to-white border border-l-0 border-gray-200 rounded-r-lg text-gray-600 hover:text-gray-800"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>

              {/* Work Authorization */}
              <div>
                <label htmlFor="workAuthorization" className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <Shield className="h-4 w-4 mr-2 text-gray-500" />
                  Work Authorization Requirement
                </label>
                <div className="relative">
                  <select 
                    id="workAuthorization" 
                    name="workAuthorization" 
                    className="w-full p-3 border border-gray-200 rounded-lg appearance-none bg-gradient-to-r from-gray-50 to-white pr-10 focus:ring-2 focus:ring-[#143694]/50 focus:border-transparent focus:outline-none transition-all duration-200"
                    value={formData.workAuthorization} 
                    onChange={handleInputChange}
                  >
                    <option value="">Select authorization type</option>
                    {workAuthOptions.map((option, index) => (<option key={index} value={option}>{option}</option>))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 pb-6">
            <button 
              type="button" 
              onClick={handleCancel} 
              disabled={isSubmitting} 
              className="px-6 py-3 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 disabled:opacity-50 transition-all duration-200"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={isSubmitting} 
              className="px-8 py-3 bg-gradient-to-r from-[#143694] to-[#1e4ed8] text-white rounded-lg font-medium hover:shadow-lg hover:shadow-[#143694]/30 focus:outline-none focus:ring-2 focus:ring-[#143694]/50 transition-all duration-200 disabled:opacity-50"
            >
              {isSubmitting ? 'Posting...' : 'Post Your Job'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}