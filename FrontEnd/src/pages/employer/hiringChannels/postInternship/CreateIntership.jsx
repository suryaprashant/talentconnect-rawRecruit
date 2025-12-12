import { useState, useRef, useEffect } from 'react';
import { ChevronDown, X, Briefcase, MapPin, DollarSign, Users, BookOpen, Target, Award, Shield, Clock, GraduationCap } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { City } from 'country-state-city';

export default function EmployerPostIntership() {
  const initialState = {
    jobTitle: '',
    description: '',
    location: [],
    workMode: 'On-site',
    minPackage: {
      currency: 'INR',
      amount: ''
    },
    numberOfOpenings: '',
    minEducation: '',
    skills: [],
    certifications: [],
    workAuthorization: '',
    studentStreams: [],
    eligibilityCriteria: '',
    internshipDuration: '',
    benefits: [],
    tags: [],
    broadcastType: 'Everyone'
  };

  const [formData, setFormData] = useState(initialState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState({
    skills: false,
    benefits: false,
    locations: false,
    studentStreams: false,
    tags: false
  });

  const [skillInput, setSkillInput] = useState('');
  const [benefitInput, setBenefitInput] = useState('');
  const [locationSearch, setLocationSearch] = useState('');
  const [indianCities, setIndianCities] = useState([]);
  const [descriptionError, setDescriptionError] = useState("");

  const skillsDropdownRef = useRef(null);
  const benefitsDropdownRef = useRef(null);
  const locationsDropdownRef = useRef(null);
  const studentStreamsDropdownRef = useRef(null);
  const tagsDropdownRef = useRef(null);

  const educationOptions = ["High School", "Bachelor's Degree", "Master's Degree", "PhD", "Diploma", "Other"];
  const fieldOfStudyOptions = ["Computer Science", "Engineering", "Business", "Arts", "Sciences", "Mathematics", "Medicine", "Law", "Other"];
  const durationOptions = ["1 Month", "2 Months", "3 Months", "6 Months", "1 Year", "Flexible"];
  const certificationOptions = ["AWS Certified", "Microsoft Certified", "Google Cloud Certified", "Cisco Certified", "PMP", "Other"];
  const workAuthOptions = ["Citizens Only", "Permanent Residents", "Work Visa Holders", "Any"];
  const allSkills = ["JavaScript", "React", "Vue", "Angular", "Node.js", "Python", "Java", "C++", "SQL", "MongoDB"];
  const allBenefits = ["Health Insurance", "Paid Time Off", "Mentorship Program", "Certificate of Completion", "Letter of Recommendation", "Flexible Hours"];
  const tagsOptions = ['Urgent hiring', 'Fresher preferred', 'Remote-friendly', 'Work from Home', 'Internship-eligible', 'Hybrid', 'High Priority', 'Contract', 'Part-time', 'Full-time'];

  const filteredSkills = allSkills.filter(skill => skill.toLowerCase().includes(skillInput.toLowerCase()));
  const filteredBenefits = allBenefits.filter(benefit => benefit.toLowerCase().includes(benefitInput.toLowerCase()));
  const filteredCities = indianCities.filter(city => city.name.toLowerCase().includes(locationSearch.toLowerCase()));

  useEffect(() => {
    const cities = City.getCitiesOfCountry('IN').sort((a, b) => a.name.localeCompare(b.name));
    setIndianCities(cities);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      const dropdownRefs = {
        skills: skillsDropdownRef,
        benefits: benefitsDropdownRef,
        locations: locationsDropdownRef,
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

  const handleSalaryChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, minPackage: { ...prev.minPackage, [name]: value } }));
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
      'minPackage.amount': "Stipend Amount",
      numberOfOpenings: "No. of Openings",
      eligibilityCriteria: "Eligibility Criteria",
      internshipDuration: "Internship Duration",
    };

    for (const key in requiredFields) {
      const value = key.includes('.') ? formData.minPackage.amount : formData[key];
      if (!value || (Array.isArray(value) && value.length === 0)) {
        toast.error(`Please fill the required field: ${requiredFields[key]}`);
        setIsSubmitting(false);
        return;
      }
    }

    try {
      const payload = {
        ...formData,
        minPackage: {
          currency: formData.minPackage.currency,
          amount: parseFloat(formData.minPackage.amount)
        },
        numberOfOpenings: parseInt(formData.numberOfOpenings, 10),
        tags: formData.tags,
        jobType: "Internship",
        broadcastType: formData.broadcastType
      };

      const response = await axios.post(
        `${import.meta.env.VITE_Backend_URL}/api/employer/hiring-channel/create-internship-posting`,
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          withCredentials: true
        }
      );

      toast.success("Internship posted successfully!");
      setTimeout(() => {
        toast.success('This internship will expire after 15 days');
      }, 2000);
      setFormData(initialState);

    } catch (error) {
      console.error("Detailed error:", error);
      toast.error(`Error posting internship: ${error.response?.data?.error || error.response?.data?.message || error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setFormData(initialState);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#667eea]/5 via-[#f093fb]/5 to-[#764ba2]/5">
      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="bg-white/90 backdrop-blur-sm border border-gray-100 rounded-2xl shadow-lg p-6 mb-8">
          <div className="text-center mb-6">
            <div className="flex items-center justify-center mb-3">
              <div className="p-2 bg-gradient-to-br from-[#667eea]/20 to-[#764ba2]/20 rounded-lg mr-3">
                <Briefcase className="h-5 w-5 text-[#667eea]" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent">
                Create Internship
              </h1>
            </div>
            <p className="text-md text-gray-600 max-w-2xl mx-auto">
              Post a new internship opportunity and connect with talented students. Fill in the details below to create your internship listing.
            </p>
          </div>
        </div>

        <form onSubmit={handlePostJob}>
          {/* Basic Internship Details */}
          <div className="bg-white/90 backdrop-blur-sm border border-gray-100 rounded-2xl shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center">
              <Briefcase className="h-5 w-5 mr-2 text-[#667eea]" />
              Basic Internship Details
            </h2>
            <p className="text-sm text-gray-600 mb-6">Provide the core details about the internship opportunity.</p>

            <div className="space-y-6">
              {/* Job Title */}
              <div>
                <label htmlFor="jobTitle" className="block text-sm font-medium text-gray-700 mb-2">
                  Job Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="jobTitle"
                  name="jobTitle"
                  placeholder="e.g., Frontend Developer Intern"
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#667eea]/50 focus:border-transparent focus:outline-none transition-all duration-200 bg-gradient-to-r from-gray-50 to-white"
                  value={formData.jobTitle}
                  onChange={handleInputChange}
                />
              </div>

              {/* Work Mode */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Work Mode <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2 flex-wrap">
                  <button
                    type="button"
                    className={`px-4 py-2 border rounded-lg transition-all duration-200 ${formData.workMode === 'On-site' ? 'bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white border-transparent shadow-md' : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300'}`}
                    onClick={() => handleOptionSelect('workMode', 'On-site')}
                  >
                    On-site
                  </button>
                  <button
                    type="button"
                    className={`px-4 py-2 border rounded-lg transition-all duration-200 ${formData.workMode === 'Remote' ? 'bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white border-transparent shadow-md' : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300'}`}
                    onClick={() => handleOptionSelect('workMode', 'Remote')}
                  >
                    Remote
                  </button>
                  <button
                    type="button"
                    className={`px-4 py-2 border rounded-lg transition-all duration-200 ${formData.workMode === 'Hybrid' ? 'bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white border-transparent shadow-md' : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300'}`}
                    onClick={() => handleOptionSelect('workMode', 'Hybrid')}
                  >
                    Hybrid
                  </button>
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
                      <button
                        type="button"
                        onClick={() => removeItem('location', loc)}
                        className="ml-2 text-gray-500 hover:text-gray-700"
                      >
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
                          onClick={() => handleMultiSelect('location', city.name)}
                          className={`px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 ${formData.location.includes(city.name) ? "bg-blue-50" : ""}`}
                        >
                          <div className="flex items-center justify-between">
                            <span className={formData.location.includes(city.name) ? "text-[#667eea] font-medium" : "text-gray-700"}>
                              {city.name}
                            </span>
                            {formData.location.includes(city.name) && <span className="text-[#667eea]">✓</span>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Broadcast Options */}
              <div>
                <label className="block mb-2 font-medium text-gray-700">
                  Broadcast Options <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center space-x-6">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="broadcastType"
                      value="Everyone"
                      checked={formData.broadcastType === 'Everyone'}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-[#667eea] border-gray-300 focus:ring-[#667eea]/50"
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
                      className="h-4 w-4 text-[#667eea] border-gray-300 focus:ring-[#667eea]/50"
                    />
                    <span className="ml-2 text-gray-700">Broadcast Only Chosen Location</span>
                  </label>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Select 'Broadcast by Location' to show this internship only to candidates/colleges in the specified Work Locations.
                </p>
              </div>

              {/* Stipend */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <DollarSign className="h-4 w-4 mr-2 text-gray-500" />
                  Stipend/month <span className="text-red-500">*</span>
                </label>
                <div className="flex">
                  <div className="relative w-24">
                    <select
                      name="currency"
                      value={formData.minPackage.currency}
                      onChange={handleSalaryChange}
                      className="w-full h-full pl-3 pr-8 py-3 border border-gray-200 rounded-l-lg appearance-none bg-gradient-to-r from-gray-50 to-white focus:ring-2 focus:ring-[#667eea]/50 focus:border-transparent focus:outline-none"
                    >
                      <option value="USD">USD</option>
                      <option value="INR">INR</option>
                      <option value="EUR">EUR</option>
                    </select>
                    <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={12} />
                  </div>
                  <input
                    type="number"
                    name="amount"
                    placeholder="Enter amount"
                    className="flex-1 p-3 border border-l-0 border-gray-200 rounded-r-lg focus:ring-2 focus:ring-[#667eea]/50 focus:border-transparent focus:outline-none transition-all duration-200 bg-gradient-to-r from-gray-50 to-white"
                    value={formData.minPackage.amount}
                    onChange={handleSalaryChange}
                    min="0"
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
                  placeholder="e.g., 5"
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#667eea]/50 focus:border-transparent focus:outline-none transition-all duration-200 bg-gradient-to-r from-gray-50 to-white"
                  value={formData.numberOfOpenings}
                  onChange={handleInputChange}
                  min="1"
                />
              </div>

              {/* Job Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Job Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="description"
                  name="description"
                  placeholder="Describe the job responsibilities, day-to-day tasks, and requirements..."
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#667eea]/50 focus:border-transparent focus:outline-none transition-all duration-200 bg-gradient-to-r from-gray-50 to-white h-32 ${descriptionError ? 'border-red-300' : 'border-gray-200'}`}
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
              <Target className="h-5 w-5 mr-2 text-[#667eea]" />
              Selection Criteria
            </h2>
            <p className="text-sm text-gray-600 mb-6">Specify the qualifications and requirements for the ideal candidate.</p>

            <div className="space-y-6">
              {/* Eligibility Criteria */}
              <div>
                <label htmlFor="eligibilityCriteria" className="block text-sm font-medium text-gray-700 mb-2">
                  Eligibility Criteria <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="eligibilityCriteria"
                  name="eligibilityCriteria"
                  placeholder="e.g., Must be currently enrolled in a degree program, Minimum GPA of 3.0..."
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#667eea]/50 focus:border-transparent focus:outline-none transition-all duration-200 bg-gradient-to-r from-gray-50 to-white h-24"
                  value={formData.eligibilityCriteria}
                  onChange={handleInputChange}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Internship Duration */}
                <div>
                  <label htmlFor="internshipDuration" className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-gray-500" />
                    Internship Duration <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      id="internshipDuration"
                      name="internshipDuration"
                      className="w-full p-3 border border-gray-200 rounded-lg appearance-none bg-gradient-to-r from-gray-50 to-white pr-10 focus:ring-2 focus:ring-[#667eea]/50 focus:border-transparent focus:outline-none transition-all duration-200"
                      value={formData.internshipDuration}
                      onChange={handleInputChange}
                    >
                      <option value="">Select duration</option>
                      {durationOptions.map((option, index) => (
                        <option key={index} value={option}>{option}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                  </div>
                </div>

                {/* Minimum Education */}
                <div>
                  <label htmlFor="minEducation" className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <GraduationCap className="h-4 w-4 mr-2 text-gray-500" />
                    Minimum Education
                  </label>
                  <div className="relative">
                    <select
                      id="minEducation"
                      name="minEducation"
                      className="w-full p-3 border border-gray-200 rounded-lg appearance-none bg-gradient-to-r from-gray-50 to-white pr-10 focus:ring-2 focus:ring-[#667eea]/50 focus:border-transparent focus:outline-none transition-all duration-200"
                      value={formData.minEducation}
                      onChange={handleInputChange}
                    >
                      <option value="">Select education level</option>
                      {educationOptions.map((option, index) => (
                        <option key={index} value={option}>{option}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                  </div>
                </div>
              </div>

              {/* Preferred Field of Study */}
              <div ref={studentStreamsDropdownRef} className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <BookOpen className="h-4 w-4 mr-2 text-gray-500" />
                  Preferred Field of Study
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.studentStreams.map(stream => (
                    <div key={stream} className="flex items-center bg-gradient-to-r from-gray-100 to-white border border-gray-200 text-gray-700 text-sm px-3 py-1 rounded-full">
                      <span>{stream}</span>
                      <button
                        type="button"
                        onClick={() => removeItem('studentStreams', stream)}
                        className="ml-2 text-gray-500 hover:text-gray-700"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
                <div
                  className="flex items-center justify-between p-3 w-full border border-gray-200 rounded-lg cursor-pointer hover:border-gray-300 transition-colors bg-gradient-to-r from-gray-50 to-white"
                  onClick={() => toggleDropdown('studentStreams')}
                >
                  <span className="text-gray-500">Select preferred fields of study</span>
                  <ChevronDown className={`w-5 h-5 transition-transform ${dropdownOpen.studentStreams ? "rotate-180" : ""} text-gray-400`} />
                </div>
                {dropdownOpen.studentStreams && (
                  <div className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
                    {fieldOfStudyOptions.map(stream => (
                      <div
                        key={stream}
                        onClick={() => handleMultiSelect('studentStreams', stream)}
                        className={`px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 ${formData.studentStreams.includes(stream) ? "bg-blue-50" : ""}`}
                      >
                        <div className="flex items-center justify-between">
                          <span className={formData.studentStreams.includes(stream) ? "text-[#667eea] font-medium" : "text-gray-700"}>
                            {stream}
                          </span>
                          {formData.studentStreams.includes(stream) && <span className="text-[#667eea]">✓</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Skills */}
              <div ref={skillsDropdownRef}>
                <label className="block text-sm font-medium text-gray-700 mb-2">Skills</label>
                <div className="relative p-2 border border-gray-200 rounded-lg focus-within:ring-2 focus-within:ring-[#667eea]/50" onClick={() => setDropdownOpen(prev => ({ ...prev, skills: true }))}>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {formData.skills.map((skill, index) => (
                      <div key={index} className="flex items-center bg-gradient-to-r from-gray-100 to-white border border-gray-200 text-gray-700 text-sm px-3 py-1 rounded-full">
                        <span>{skill}</span>
                        <button
                          type="button"
                          className="ml-2 text-gray-500 hover:text-gray-700"
                          onClick={(e) => { e.stopPropagation(); removeItem('skills', skill); }}
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                  <input
                    type="text"
                    placeholder="Type a skill..."
                    className="w-full outline-none bg-transparent"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={(e) => handleItemInputKeyDown(e, 'skills', skillInput, setSkillInput)}
                  />
                </div>
                {dropdownOpen.skills && (
                  <div className="absolute z-10 w-full bg-white border border-gray-200 rounded-lg shadow-lg mt-1 max-h-60 overflow-y-auto">
                    {filteredSkills.map((skill, index) => (
                      <div
                        key={index}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => handleSelectItem('skills', skill, setSkillInput, 'skills')}
                      >
                        {skill}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Benefits */}
              <div ref={benefitsDropdownRef}>
                <label className="block text-sm font-medium text-gray-700 mb-2">Benefits</label>
                <div className="relative p-2 border border-gray-200 rounded-lg focus-within:ring-2 focus-within:ring-[#667eea]/50" onClick={() => setDropdownOpen(prev => ({ ...prev, benefits: true }))}>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {formData.benefits.map((benefit, index) => (
                      <div key={index} className="flex items-center bg-gradient-to-r from-gray-100 to-white border border-gray-200 text-gray-700 text-sm px-3 py-1 rounded-full">
                        <span>{benefit}</span>
                        <button
                          type="button"
                          className="ml-2 text-gray-500 hover:text-gray-700"
                          onClick={(e) => { e.stopPropagation(); removeItem('benefits', benefit); }}
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                  <input
                    type="text"
                    placeholder="Type a benefit..."
                    className="w-full outline-none bg-transparent"
                    value={benefitInput}
                    onChange={(e) => setBenefitInput(e.target.value)}
                    onKeyDown={(e) => handleItemInputKeyDown(e, 'benefits', benefitInput, setBenefitInput)}
                  />
                </div>
                {dropdownOpen.benefits && (
                  <div className="absolute z-10 w-full bg-white border border-gray-200 rounded-lg shadow-lg mt-1 max-h-60 overflow-y-auto">
                    {filteredBenefits.map((benefit, index) => (
                      <div
                        key={index}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => handleSelectItem('benefits', benefit, setBenefitInput, 'benefits')}
                      >
                        {benefit}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Tags */}
              <div ref={tagsDropdownRef} className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.tags.map((tag, index) => (
                    <div key={index} className="flex items-center bg-gradient-to-r from-gray-100 to-white border border-gray-200 text-gray-700 text-sm px-3 py-1 rounded-full">
                      <span>{tag}</span>
                      <button
                        type="button"
                        className="ml-2 text-gray-500 hover:text-gray-700"
                        onClick={(e) => { e.stopPropagation(); removeItem('tags', tag); }}
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
                <div
                  className="flex items-center justify-between p-3 w-full border border-gray-200 rounded-lg cursor-pointer hover:border-gray-300 transition-colors bg-gradient-to-r from-gray-50 to-white"
                  onClick={() => setDropdownOpen(prev => ({ ...prev, tags: true }))}
                >
                  <span className="text-gray-500">Select tags</span>
                  <ChevronDown className={`w-5 h-5 transition-transform ${dropdownOpen.tags ? "rotate-180" : ""} text-gray-400`} />
                </div>
                {dropdownOpen.tags && (
                  <div className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {tagsOptions.map((tag, index) => (
                      <div
                        key={index}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => handleSelectItem('tags', tag, null, 'tags')}
                      >
                        {tag}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Certifications */}
                <div>
                  <label htmlFor="certifications" className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <Award className="h-4 w-4 mr-2 text-gray-500" />
                    Certifications (if any)
                  </label>
                  <div className="relative">
                    <select
                      id="certifications"
                      name="certifications"
                      className="w-full p-3 border border-gray-200 rounded-lg appearance-none bg-gradient-to-r from-gray-50 to-white pr-10 focus:ring-2 focus:ring-[#667eea]/50 focus:border-transparent focus:outline-none transition-all duration-200"
                      value={formData.certifications[0] || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, certifications: e.target.value ? [e.target.value] : [] }))}
                    >
                      <option value="">Select certification</option>
                      {certificationOptions.map((option, index) => (
                        <option key={index} value={option}>{option}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
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
                      className="w-full p-3 border border-gray-200 rounded-lg appearance-none bg-gradient-to-r from-gray-50 to-white pr-10 focus:ring-2 focus:ring-[#667eea]/50 focus:border-transparent focus:outline-none transition-all duration-200"
                      value={formData.workAuthorization}
                      onChange={handleInputChange}
                    >
                      <option value="">Select authorization type</option>
                      {workAuthOptions.map((option, index) => (
                        <option key={index} value={option}>{option}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                  </div>
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
              className="px-8 py-3 bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white rounded-lg font-medium hover:shadow-lg hover:shadow-[#667eea]/30 focus:outline-none focus:ring-2 focus:ring-[#667eea]/50 transition-all duration-200 disabled:opacity-50"
            >
              {isSubmitting ? 'Posting...' : 'Post Internship'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}