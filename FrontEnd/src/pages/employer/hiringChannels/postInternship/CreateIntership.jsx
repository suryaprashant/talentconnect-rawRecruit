import { useState, useRef, useEffect, useMemo } from 'react';
import { ChevronDown, X, Briefcase, MapPin, DollarSign, Users, BookOpen, Target, Award, Shield, Clock, GraduationCap } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { City } from 'country-state-city';
import CreatableSelect from 'react-select/creatable';

export default function EmployerPostIntership() {
  const initialState = {
    jobRoles: [], // Changed from jobTitle to jobRoles for multiple selection
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
  const [descriptionError, setDescriptionError] = useState("");

  // Job title options array
  const jobTitleOptions = [
    "Software Engineer",
    "Data Analyst", 
    "DevOps Engineer",
    "UX/UI Designer",
    "Product Manager",
    "QA Engineer",
    "System Administrator",
    "Network Engineer",
    "Business Analyst",
    "Machine Learning Engineer",
    "Frontend Developer",
    "Backend Developer",
    "Full Stack Developer",
    "Mobile App Developer",
    "Cloud Engineer",
    "Database Administrator",
    "Security Analyst",
    "Project Manager",
    "Scrum Master",
    "Technical Writer",
    "Data Scientist",
    "AI Engineer",
    "DevOps Specialist",
    "Site Reliability Engineer",
    "IT Support Specialist",
    "Cybersecurity Analyst",
    "Digital Marketing Specialist",
    "Content Writer",
    "Graphic Designer",
    "UI Designer",
    "UX Researcher",
    "Product Designer",
    "Business Intelligence Analyst",
    "Data Engineer",
    "Machine Learning Specialist",
    "AR/VR Developer",
    "Blockchain Developer",
    "Game Developer",
    "Embedded Systems Engineer",
    "Hardware Engineer",
    "Network Administrator",
    "Systems Engineer",
    "IT Manager",
    "Solutions Architect",
    "Technical Lead",
    "Engineering Manager",
    "CTO",
    "CIO"
  ];

  const educationOptions = ["High School", "Bachelor's Degree", "Master's Degree", "PhD", "Diploma", "Other"];
  const fieldOfStudyOptions = ["Computer Science", "Engineering", "Business", "Arts", "Sciences", "Mathematics", "Medicine", "Law", "Other"];
  const durationOptions = ["1 Month", "2 Months", "3 Months", "6 Months", "1 Year", "Flexible"];
  const certificationOptions = ["AWS Certified", "Microsoft Certified", "Google Cloud Certified", "Cisco Certified", "PMP", "Other"];
  const workAuthOptions = ["Citizens Only", "Permanent Residents", "Work Visa Holders", "Any"];
  const allSkills = ["JavaScript", "React", "Vue", "Angular", "Node.js", "Python", "Java", "C++", "SQL", "MongoDB"];
  const allBenefits = ["Health Insurance", "Paid Time Off", "Mentorship Program", "Certificate of Completion", "Letter of Recommendation", "Flexible Hours"];
  const tagsOptions = ['Urgent hiring', 'Fresher preferred', 'Remote-friendly', 'Work from Home', 'Internship-eligible', 'Hybrid', 'High Priority', 'Contract', 'Part-time', 'Full-time'];

  const [customSkill, setCustomSkill] = useState('');
  const [customBenefit, setCustomBenefit] = useState('');
  const [customStream, setCustomStream] = useState('');
  const [customJobTitle, setCustomJobTitle] = useState(''); // Added for custom job titles

  const cityOptions = useMemo(() =>
    City.getCitiesOfCountry('IN').map(city => ({
      value: city.name,
      label: city.name,
    })),
  []);

  const [dropdownOpen, setDropdownOpen] = useState({
    jobRoles: false, // Added jobRoles dropdown
    skills: false,
    benefits: false,
    studentStreams: false,
    tags: false
  });

  const jobTitlesRef = useRef(null); // Added ref for job titles
  const skillsRef = useRef(null);
  const benefitsRef = useRef(null);
  const studentStreamsRef = useRef(null);
  const tagsRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      const dropdownRefs = {
        jobRoles: jobTitlesRef, // Added
        skills: skillsRef,
        benefits: benefitsRef,
        studentStreams: studentStreamsRef,
        tags: tagsRef
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

  // ... keep existing handleInputChange, handleOptionSelect, handleSalaryChange functions ...

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

  const handleCustomAdd = (field, value, setValue) => {
    if (value.trim() === '') return;
    setFormData(prev => {
      const currentValues = prev[field] || [];
      if (currentValues.map(v => v.toLowerCase()).includes(value.trim().toLowerCase())) {
        setValue('');
        toast.error("Item already added.");
        return prev;
      }
      const newValues = [...currentValues, value.trim()];
      return { ...prev, [field]: newValues };
    });
    setValue('');
  };

  const removeSelectedItem = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter(item => item !== value)
    }));
  };

  const toggleDropdown = (dropdown) => {
    setDropdownOpen(prev => ({
      ...Object.keys(prev).reduce((acc, key) => ({ ...acc, [key]: false }), {}),
      [dropdown]: !prev[dropdown]
    }));
  };

  const handleLocationChange = (field, selectedOptions) => {
    setFormData(prev => ({
      ...prev,
      [field]: selectedOptions ? selectedOptions.map(option => option.value) : []
    }));
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
      jobRoles: "Job Title", // Changed from jobTitle to jobRoles
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
        toast.success('This internship will expire after 30 days');
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
    <div className="min-h-screen bg-gradient-to-br from-[#667eea]/5 via-[#f093fb]/5 to-[#764ba2]/5 py-4">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header Section - Compact */}
        <div className="bg-white/90 backdrop-blur-sm border border-gray-100 rounded-xl shadow p-4 mb-6">
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <div className="p-2 bg-gradient-to-br from-[#667eea]/20 to-[#764ba2]/20 rounded-lg mr-3">
                <Briefcase className="h-5 w-5 text-[#667eea]" />
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent">
                Create Internship Opportunity
              </h1>
            </div>
            <p className="text-sm text-gray-600 max-w-2xl mx-auto">
              Post a new internship opportunity and connect with talented students. Fill in the details below to create your internship listing.
            </p>
          </div>
        </div>

        <div className="bg-white/90 backdrop-blur-sm border border-gray-100 rounded-xl shadow p-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent">Internship Details</h2>
            <p className="text-gray-500 text-sm mt-1">Fill in the details to create your internship posting</p>
          </div>

          <form onSubmit={handlePostJob}>
            <div className="space-y-6">
              {/* First Row: Job Titles and Work Mode */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Job Titles - Updated to support multiple selection */}
                <div ref={jobTitlesRef} className="relative">
                  <label className="block font-medium mb-2 text-sm text-gray-700">
                    Job Titles <span className="text-red-500">*</span>
                  </label>
                  
                  {/* Selected tags */}
                  <div className="flex flex-wrap gap-1 mb-2">
                    {formData.jobRoles.map(title => (
                      <div key={title} className="flex items-center bg-gradient-to-r from-gray-100 to-white border border-gray-200 text-gray-700 text-xs px-2 py-1 rounded-full">
                        <span>{title}</span>
                        <button
                          type="button"
                          onClick={() => removeSelectedItem('jobRoles', title)}
                          className="ml-1 text-gray-500 hover:text-gray-700"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between p-2 w-full border border-gray-200 rounded-lg cursor-pointer hover:border-gray-300 transition-colors bg-gradient-to-r from-gray-50 to-white min-h-[38px]" onClick={() => toggleDropdown('jobRoles')}>
                    <span className="text-sm text-gray-500">
                      {formData.jobRoles.length > 0 ? `${formData.jobRoles.length} title(s) selected` : "Select job titles (multiple allowed)"}
                    </span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${dropdownOpen.jobRoles ? "rotate-180" : ""} text-gray-400`} />
                  </div>
                  
                  {dropdownOpen.jobRoles && (
                    <div className="absolute z-30 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-hidden">
                      {/* Custom input section */}
                      <div className="p-2 border-b border-gray-100 bg-gray-50">
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="Add custom job title..."
                            value={customJobTitle}
                            onChange={(e) => setCustomJobTitle(e.target.value)}
                            onClick={(e) => e.stopPropagation()}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                handleCustomAdd('jobRoles', customJobTitle, setCustomJobTitle);
                              }
                            }}
                            className="flex-1 p-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#667eea]/50 focus:outline-none"
                          />
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCustomAdd('jobRoles', customJobTitle, setCustomJobTitle);
                            }}
                            className="px-4 py-2 bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white rounded-lg text-xs font-bold whitespace-nowrap"
                          >
                            Add
                          </button>
                        </div>
                      </div>
                      
                      {/* Scrollable list */}
                      <div className="overflow-y-auto max-h-48">
                        {jobTitleOptions.map((title, index) => (
                          <div
                            key={index}
                            onClick={() => handleMultiSelect('jobRoles', title)}
                            className={`px-3 py-2.5 hover:bg-gray-50 cursor-pointer border-b border-gray-100 flex items-center justify-between ${
                              formData.jobRoles.includes(title) ? "bg-blue-50/50" : ""
                            }`}
                          >
                            <span className={`text-sm ${formData.jobRoles.includes(title) ? "text-[#667eea] font-semibold" : "text-gray-700"}`}>
                              {title}
                            </span>
                            {formData.jobRoles.includes(title) && <span className="text-[#667eea] font-bold">✓</span>}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <p className="text-xs text-gray-500 mt-1">Select one or more job titles that apply to this internship</p>
                </div>

                {/* Work Mode */}
                <div>
                  <label className="block mb-2 font-medium text-sm text-gray-700">
                    Work Mode <span className="text-red-500">*</span>
                  </label>
                  <div className="flex gap-2 p-2">
                    {['On-site', 'Remote', 'Hybrid'].map(mode => (
                      <button
                        key={mode}
                        type="button"
                        className={`flex-1 px-3 py-2 text-sm border rounded-lg transition-colors ${formData.workMode === mode ? 'bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white border-transparent' : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300'}`}
                        onClick={() => handleOptionSelect('workMode', mode)}
                      >
                        {mode}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Second Row: Location and Broadcast Options */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Location */}
                <div>
                  <label className="block font-medium mb-2 text-sm text-gray-700">
                    Location <span className="text-red-500">*</span>
                  </label>
                  <CreatableSelect
                    isMulti
                    options={cityOptions}
                    value={formData.location.map(location => ({ value: location, label: location }))}
                    onChange={(selectedOptions) => handleLocationChange('location', selectedOptions)}
                    placeholder="Select or type locations..."
                    styles={{
                      control: (base) => ({
                        ...base,
                        borderColor: '#e5e7eb',
                        minHeight: '42px',
                        fontSize: '14px',
                        borderRadius: '0.5rem',
                        backgroundColor: 'rgb(249 250 251 / var(--tw-bg-opacity))',
                        backgroundImage: 'linear-gradient(to right, rgb(249 250 251), rgb(255 255 255))',
                      }),
                      menu: (base) => ({
                        ...base,
                        borderRadius: '0.5rem',
                        fontSize: '14px',
                        border: '1px solid #e5e7eb',
                      }),
                      multiValue: (base) => ({
                        ...base,
                        fontSize: '12px',
                        backgroundColor: '#f3f4f6',
                        borderRadius: '9999px',
                      }),
                      multiValueRemove: (base) => ({
                        ...base,
                        fontSize: '12px',
                        color: '#6b7280',
                        ':hover': {
                          backgroundColor: '#e5e7eb',
                          color: '#374151',
                        },
                      }),
                    }}
                  />
                </div>

                {/* Broadcast Options */}
                <div>
                  <label className="block mb-2 font-medium text-sm text-gray-700">
                    Broadcast Options <span className="text-red-500">*</span>
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="broadcastType"
                        value="Everyone"
                        checked={formData.broadcastType === 'Everyone'}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-[#667eea] border-gray-300 focus:ring-[#667eea]/50"
                      />
                      <span className="ml-2 text-sm text-gray-700">Broadcast to Everyone</span>
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
                      <span className="ml-2 text-sm text-gray-700">Broadcast by Location</span>
                    </label>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    'Broadcast by Location' shows internship only to specified locations.
                  </p>
                </div>
              </div>

              {/* Third Row: Stipend and Openings */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Stipend */}
                <div>
                  <label className="block font-medium mb-2 text-sm text-gray-700">
                    Stipend/month <span className="text-red-500">*</span>
                  </label>
                  <div className="flex">
                    <div className="relative w-20">
                      <select
                        name="currency"
                        value={formData.minPackage.currency}
                        onChange={handleSalaryChange}
                        className="w-full h-full p-3 text-sm border border-gray-200 rounded-l-lg appearance-none bg-gradient-to-r from-gray-50 to-white pr-8 text-center focus:ring-2 focus:ring-[#667eea]/50 focus:border-transparent focus:outline-none"
                      >
                        <option value="INR">INR</option>
                        <option value="USD">USD</option>
                        <option value="EUR">EUR</option>
                      </select>
                      <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={14} />
                    </div>
                    <input
                      type="number"
                      name="amount"
                      placeholder="Enter amount"
                      className="flex-1 p-3 text-sm border border-l-0 border-gray-200 rounded-r-lg focus:ring-2 focus:ring-[#667eea]/50 focus:border-transparent focus:outline-none transition-all duration-200 bg-gradient-to-r from-gray-50 to-white"
                      value={formData.minPackage.amount}
                      onChange={handleSalaryChange}
                      min="0"
                    />
                  </div>
                </div>

                {/* Number of Openings */}
                <div>
                  <label htmlFor="numberOfOpenings" className="block font-medium mb-2 text-sm text-gray-700">
                    No. of Openings <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    id="numberOfOpenings"
                    name="numberOfOpenings"
                    placeholder="e.g., 5"
                    className="w-full p-3 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#667eea]/50 focus:border-transparent focus:outline-none transition-all duration-200 bg-gradient-to-r from-gray-50 to-white"
                    value={formData.numberOfOpenings}
                    onChange={handleInputChange}
                    min="1"
                  />
                </div>
              </div>

              {/* Fourth Row: Job Description */}
              <div>
                <label htmlFor="description" className="block font-medium mb-2 text-sm text-gray-700">
                  Job Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="description"
                  name="description"
                  placeholder="Describe the job responsibilities, day-to-day tasks, and requirements..."
                  className={`w-full p-3 text-sm border rounded-lg focus:ring-2 focus:ring-[#667eea]/50 focus:border-transparent focus:outline-none transition-all duration-200 bg-gradient-to-r from-gray-50 to-white h-32 ${descriptionError ? 'border-red-300' : 'border-gray-200'}`}
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

              {/* Fifth Row: Eligibility Criteria */}
              <div>
                <label htmlFor="eligibilityCriteria" className="block font-medium mb-2 text-sm text-gray-700">
                  Eligibility Criteria <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="eligibilityCriteria"
                  name="eligibilityCriteria"
                  placeholder="e.g., Must be currently enrolled in a degree program, Minimum GPA of 3.0..."
                  className="w-full p-3 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#667eea]/50 focus:border-transparent focus:outline-none transition-all duration-200 bg-gradient-to-r from-gray-50 to-white h-24"
                  value={formData.eligibilityCriteria}
                  onChange={handleInputChange}
                />
              </div>

              {/* Sixth Row: Duration and Education */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Internship Duration */}
                <div>
                  <label htmlFor="internshipDuration" className="block font-medium mb-2 text-sm text-gray-700">
                    Internship Duration <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      id="internshipDuration"
                      name="internshipDuration"
                      className="w-full p-3 text-sm border border-gray-200 rounded-lg appearance-none bg-gradient-to-r from-gray-50 to-white pr-10 focus:ring-2 focus:ring-[#667eea]/50 focus:border-transparent focus:outline-none transition-all duration-200"
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
                  <label htmlFor="minEducation" className="block font-medium mb-2 text-sm text-gray-700">
                    Minimum Education
                  </label>
                  <div className="relative">
                    <select
                      id="minEducation"
                      name="minEducation"
                      className="w-full p-3 text-sm border border-gray-200 rounded-lg appearance-none bg-gradient-to-r from-gray-50 to-white pr-10 focus:ring-2 focus:ring-[#667eea]/50 focus:border-transparent focus:outline-none transition-all duration-200"
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

              {/* Seventh Row: Preferred Field of Study */}
<div ref={studentStreamsRef} className="relative">
  <label className="block font-medium mb-2 text-sm text-gray-700">
    Preferred Field of Study
  </label>
  
  {/* Selected fields - removed scrolling from here */}
  <div className="flex flex-wrap gap-1 mb-1">
    {formData.studentStreams.map(stream => (
      <div key={stream} className="flex items-center bg-gradient-to-r from-gray-100 to-white border border-gray-200 text-gray-700 text-xs px-2 py-1 rounded-full">
        <span>{stream}</span>
        <button
          type="button"
          onClick={() => removeSelectedItem('studentStreams', stream)}
          className="ml-1 text-gray-500 hover:text-gray-700"
        >
          <X size={12} />
        </button>
      </div>
    ))}
  </div>
  
  <div className="flex items-center justify-between p-2 w-full border border-gray-200 rounded-lg cursor-pointer hover:border-gray-300 transition-colors min-h-[38px] bg-gradient-to-r from-gray-50 to-white" onClick={() => toggleDropdown('studentStreams')}>
    <span className="text-sm text-gray-500">Select preferred fields of study</span>
    <ChevronDown className={`w-4 h-4 transition-transform ${dropdownOpen.studentStreams ? "rotate-180" : ""} text-gray-400`} />
  </div>
  
  {dropdownOpen.studentStreams && (
    <div className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-hidden">
      {/* Custom input section - fixed height, not scrollable */}
      <div className="p-2 border-b border-gray-100 bg-gray-50">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Add custom field..."
            value={customStream}
            onChange={(e) => setCustomStream(e.target.value)}
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleCustomAdd('studentStreams', customStream, setCustomStream);
              }
            }}
            className="flex-1 p-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#667eea]/50 focus:outline-none"
          />
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleCustomAdd('studentStreams', customStream, setCustomStream);
            }}
            className="px-4 py-2 bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white rounded-lg text-xs font-bold whitespace-nowrap"
          >
            Add
          </button>
        </div>
      </div>
      
      {/* Scrollable list ONLY - this is the only scrollable area */}
      <div className="overflow-y-auto max-h-48">
        {fieldOfStudyOptions.map(stream => (
          <div
            key={stream}
            onClick={() => handleMultiSelect('studentStreams', stream)}
            className={`px-3 py-2.5 hover:bg-gray-50 cursor-pointer border-b border-gray-100 flex items-center justify-between ${
              formData.studentStreams.includes(stream) ? "bg-blue-50/50" : ""
            }`}
          >
            <span className={`text-sm ${formData.studentStreams.includes(stream) ? "text-[#667eea] font-semibold" : "text-gray-700"}`}>
              {stream}
            </span>
            {formData.studentStreams.includes(stream) && <span className="text-[#667eea] font-bold">✓</span>}
          </div>
        ))}
      </div>
    </div>
  )}
</div>

              {/* Eighth Row: Skills and Benefits */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Skills */}
<div ref={skillsRef} className="relative">
  <label className="block font-medium mb-2 text-sm text-gray-700">Skills</label>
  
  {/* Selected skills - removed scrolling from here */}
  <div className="flex flex-wrap gap-1 mb-1">
    {formData.skills.map((skill, index) => (
      <div key={index} className="flex items-center bg-gradient-to-r from-gray-100 to-white border border-gray-200 text-gray-700 text-xs px-2 py-1 rounded-full">
        <span>{skill}</span>
        <button
          type="button"
          className="ml-1 text-gray-500 hover:text-gray-700"
          onClick={() => removeSelectedItem('skills', skill)}
        >
          <X size={12} />
        </button>
      </div>
    ))}
  </div>
  
  <div className="flex items-center justify-between p-2 w-full border border-gray-200 rounded-lg cursor-pointer hover:border-gray-300 transition-colors min-h-[38px] bg-gradient-to-r from-gray-50 to-white" onClick={() => toggleDropdown('skills')}>
    <span className="text-sm text-gray-500">Select skills</span>
    <ChevronDown className={`w-4 h-4 transition-transform ${dropdownOpen.skills ? "rotate-180" : ""} text-gray-400`} />
  </div>
  
  {dropdownOpen.skills && (
    <div className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-hidden">
      {/* Custom input section - fixed height, not scrollable */}
      <div className="p-2 border-b border-gray-100 bg-gray-50">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Add custom skill..."
            value={customSkill}
            onChange={(e) => setCustomSkill(e.target.value)}
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleCustomAdd('skills', customSkill, setCustomSkill);
              }
            }}
            className="flex-1 p-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#667eea]/50 focus:outline-none"
          />
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleCustomAdd('skills', customSkill, setCustomSkill);
            }}
            className="px-4 py-2 bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white rounded-lg text-xs font-bold whitespace-nowrap"
          >
            Add
          </button>
        </div>
      </div>
      
      {/* Scrollable list ONLY - this is the only scrollable area */}
      <div className="overflow-y-auto max-h-48">
        {allSkills.map((skill, index) => (
          <div
            key={index}
            onClick={() => handleMultiSelect('skills', skill)}
            className={`px-3 py-2.5 hover:bg-gray-50 cursor-pointer border-b border-gray-100 flex items-center justify-between ${
              formData.skills.includes(skill) ? "bg-blue-50/50" : ""
            }`}
          >
            <span className={`text-sm ${formData.skills.includes(skill) ? "text-[#667eea] font-semibold" : "text-gray-700"}`}>
              {skill}
            </span>
            {formData.skills.includes(skill) && <span className="text-[#667eea] font-bold">✓</span>}
          </div>
        ))}
      </div>
    </div>
  )}
</div>

                {/* Benefits */}
<div ref={benefitsRef} className="relative">
  <label className="block font-medium mb-2 text-sm text-gray-700">Benefits</label>
  
  {/* Selected benefits - removed scrolling from here */}
  <div className="flex flex-wrap gap-1 mb-1">
    {formData.benefits.map((benefit, index) => (
      <div key={index} className="flex items-center bg-gradient-to-r from-gray-100 to-white border border-gray-200 text-gray-700 text-xs px-2 py-1 rounded-full">
        <span>{benefit}</span>
        <button
          type="button"
          className="ml-1 text-gray-500 hover:text-gray-700"
          onClick={() => removeSelectedItem('benefits', benefit)}
        >
          <X size={12} />
        </button>
      </div>
    ))}
  </div>
  
  <div className="flex items-center justify-between p-2 w-full border border-gray-200 rounded-lg cursor-pointer hover:border-gray-300 transition-colors min-h-[38px] bg-gradient-to-r from-gray-50 to-white" onClick={() => toggleDropdown('benefits')}>
    <span className="text-sm text-gray-500">Select benefits</span>
    <ChevronDown className={`w-4 h-4 transition-transform ${dropdownOpen.benefits ? "rotate-180" : ""} text-gray-400`} />
  </div>
  
  {dropdownOpen.benefits && (
    <div className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-hidden">
      {/* Custom input section - fixed height, not scrollable */}
      <div className="p-2 border-b border-gray-100 bg-gray-50">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Add custom benefit..."
            value={customBenefit}
            onChange={(e) => setCustomBenefit(e.target.value)}
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleCustomAdd('benefits', customBenefit, setCustomBenefit);
              }
            }}
            className="flex-1 p-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#667eea]/50 focus:outline-none"
          />
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleCustomAdd('benefits', customBenefit, setCustomBenefit);
            }}
            className="px-4 py-2 bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white rounded-lg text-xs font-bold whitespace-nowrap"
          >
            Add
          </button>
        </div>
      </div>
      
      {/* Scrollable list ONLY - this is the only scrollable area */}
      <div className="overflow-y-auto max-h-48">
        {allBenefits.map((benefit, index) => (
          <div
            key={index}
            onClick={() => handleMultiSelect('benefits', benefit)}
            className={`px-3 py-2.5 hover:bg-gray-50 cursor-pointer border-b border-gray-100 flex items-center justify-between ${
              formData.benefits.includes(benefit) ? "bg-blue-50/50" : ""
            }`}
          >
            <span className={`text-sm ${formData.benefits.includes(benefit) ? "text-[#667eea] font-semibold" : "text-gray-700"}`}>
              {benefit}
            </span>
            {formData.benefits.includes(benefit) && <span className="text-[#667eea] font-bold">✓</span>}
          </div>
        ))}
      </div>
    </div>
  )}
</div>
              </div>

              {/* Ninth Row: Certifications and Work Authorization */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Certifications */}
                <div>
                  <label htmlFor="certifications" className="block font-medium mb-2 text-sm text-gray-700">
                    Certifications (if any)
                  </label>
                  <div className="relative">
                    <select
                      id="certifications"
                      name="certifications"
                      className="w-full p-3 text-sm border border-gray-200 rounded-lg appearance-none bg-gradient-to-r from-gray-50 to-white pr-10 focus:ring-2 focus:ring-[#667eea]/50 focus:border-transparent focus:outline-none transition-all duration-200"
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
                  <label htmlFor="workAuthorization" className="block font-medium mb-2 text-sm text-gray-700">
                    Work Authorization Requirement
                  </label>
                  <div className="relative">
                    <select
                      id="workAuthorization"
                      name="workAuthorization"
                      className="w-full p-3 text-sm border border-gray-200 rounded-lg appearance-none bg-gradient-to-r from-gray-50 to-white pr-10 focus:ring-2 focus:ring-[#667eea]/50 focus:border-transparent focus:outline-none transition-all duration-200"
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

              {/* Tenth Row: Tags */}
              <div ref={tagsRef} className="relative">
                <label className="block font-medium mb-2 text-sm text-gray-700">Tags</label>
                <div className="flex flex-wrap gap-1 mb-1 max-h-20 overflow-y-auto">
                  {formData.tags.map((tag, index) => (
                    <div key={index} className="flex items-center bg-gradient-to-r from-gray-100 to-white border border-gray-200 text-gray-700 text-xs px-2 py-1 rounded-full">
                      <span>{tag}</span>
                      <button
                        type="button"
                        className="ml-1 text-gray-500 hover:text-gray-700"
                        onClick={() => removeSelectedItem('tags', tag)}
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between p-2 w-full border border-gray-200 rounded-lg cursor-pointer hover:border-gray-300 transition-colors min-h-[38px] bg-gradient-to-r from-gray-50 to-white" onClick={() => toggleDropdown('tags')}>
                  <span className="text-sm text-gray-500">Select tags</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${dropdownOpen.tags ? "rotate-180" : ""} text-gray-400`} />
                </div>
                {dropdownOpen.tags && (
                  <div className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-auto">
                    {tagsOptions.map((tag, index) => (
                      <div
                        key={index}
                        onClick={() => handleMultiSelect('tags', tag)}
                        className={`px-3 py-2 hover:bg-gray-50 cursor-pointer border-b border-gray-100 ${formData.tags.includes(tag) ? "bg-blue-50" : ""}`}
                      >
                        <div className="flex items-center justify-between">
                          <span className={`text-sm ${formData.tags.includes(tag) ? "text-[#667eea] font-medium" : "text-gray-700"}`}>
                            {tag}
                          </span>
                          {formData.tags.includes(tag) && <span className="text-[#667eea]">✓</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between pt-4">
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={isSubmitting}
                  className="px-6 py-2.5 text-sm border border-gray-300 rounded-lg font-medium hover:bg-gray-50 disabled:opacity-50 transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 text-sm bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white font-semibold rounded-lg shadow-md hover:shadow-lg hover:shadow-[#667eea]/30 focus:outline-none focus:ring-2 focus:ring-[#667eea]/50 transition-all duration-200 disabled:opacity-50"
                >
                  {isSubmitting ? 'Posting...' : 'Post Internship'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}