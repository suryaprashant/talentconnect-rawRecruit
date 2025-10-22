import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { ChevronDown, Mail, Phone, Link, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { City } from 'country-state-city'; // <-- Import City

export default function RequestInfo() {


  const degreeStreamMapping = {
    'Bachelor of Engineering (B.E.)': ['Computer Science', 'Electrical Engineering', 'Mechanical Engineering', 'Civil Engineering', 'Information Technology', 'Electronics & Communication', 'Chemical Engineering', 'Biotechnology', 'Aerospace Engineering'],
    'Bachelor of Technology (B.Tech)': ['Computer Science', 'Electrical Engineering', 'Mechanical Engineering', 'Civil Engineering', 'Information Technology', 'Electronics & Communication', 'Chemical Engineering', 'Biotechnology', 'Aerospace Engineering', 'Data Science'],
    'Master of Technology (M.Tech)': ['Computer Science', 'Data Science', 'AI & Machine Learning', 'Cyber Security', 'VLSI Design', 'Structural Engineering'],
    'Bachelor of Science (B.Sc.)': ['Physics', 'Chemistry', 'Mathematics', 'Computer Science', 'Statistics', 'Biology'],
    'Master of Science (M.Sc.)': ['Physics', 'Chemistry', 'Mathematics', 'Computer Science', 'Statistics', 'Biology', 'Data Science'],
    'Bachelor of Commerce (B.Com)': ['Accounting', 'Finance', 'Taxation', 'Economics', 'Marketing'],
    'Master of Commerce (M.Com)': ['Accounting', 'Finance', 'Taxation', 'International Business'],
    'Bachelor of Business Administration (BBA)': ['Marketing', 'Finance', 'Human Resources', 'Operations Management'],
    'Master of Business Administration (MBA)': ['Marketing', 'Finance', 'Human Resources', 'Operations Management', 'IT & Systems', 'International Business'],
    'Bachelor of Arts (B.A.)': ['History', 'Political Science', 'Sociology', 'English Literature', 'Economics', 'Psychology'],
    'Master of Arts (M.A.)': ['History', 'Political Science', 'Sociology', 'English Literature', 'Economics', 'Psychology'],
    'Associate Degree': ['Technical', 'Business', 'Healthcare', 'General Studies'],
    'Doctor of Philosophy (PhD)': ['All Specializations'],
    'Postgraduate Diploma': ['Varies by Specialization'],
  };

  const degreeOptions = Object.keys(degreeStreamMapping).sort();

  // REMOVED: Static streamOptions and locationOptions are no longer needed.

  const jobRoleOptions = ['Software Engineer', 'Data Analyst', 'DevOps Engineer', 'UX/UI Designer', 'Product Manager', 'QA Engineer', 'System Administrator', 'Network Engineer', 'Business Analyst', 'Machine Learning Engineer'];
  const skillsOptions = ['JavaScript', 'Python', 'Java', 'React', 'Node.js', 'HTML/CSS', 'SQL', 'MongoDB', 'AWS', 'Docker', 'Kubernetes', 'Machine Learning', 'Data Structures', 'Algorithms', 'Git', 'REST APIs'];
  const roundsOptions = ['1 Round', '2 Rounds', '3 Rounds', '4 Rounds', '5 Rounds', '6 Rounds', '7+ Rounds'];
  const processOptions = ['Online Test', 'Coding Test', 'Aptitude Test', 'Group Discussion', 'Technical Interview', 'HR Interview', 'Case Study', 'Presentation'].sort((a, b) => a.localeCompare(b));
  const designationOptions = ['HR Manager', 'Talent Acquisition Specialist', 'Recruitment Lead', 'Campus Relations Manager', 'Technical Recruiter'];
  const minStudentsOptions = ['1-5 students', '6-10 students', '11-20 students', '21-50 students', '51-100 students', '100+ students'];
  const amenitiesOptions = ['Projector', 'Auditorium', 'Interview Rooms', 'Wi-Fi Access', 'Refreshments', 'Parking'];
  const benefitsOptions = ['Health Insurance', 'Provident Fund (PF)', 'Paid Time Off (PTO)', 'Work from Home', 'Performance Bonus', 'Stock Options'];
  const tagsOptions = ['Urgent hiring', 'Fresher preferred', 'Remote-friendly', 'Work from Home', 'Internship-eligible', 'Hybrid', 'High Priority', 'Contract', 'Part-time', 'Full-time'];

  // --- Component State and Logic ---
  const initialData = {
    degree: '',
    stream: [],
    preferredLocations: [],
    lookingFor: '',
    employmentType: [],
    workMode: '',
    jobRoles: [],
    skills: [],
    minimumSalary: '',
    startDate: '',
    endDate: '',
    rounds: '',
    selectionProcess: [],
    contactPersonName: '',
    contactDesignation: '',
    email: '',
    mobile: '',
    linkedin: '',
    minimumStudents: '',
    eligibilityCriteria: '',
    description: '',
    amenitiesRequired: [],
    benefits: [],
    tags: [],
    broadcastType: 'Everyone',
  };

  const [formData, setFormData] = useState(initialData);
  const [currency, setCurrency] = useState('INR');
  const [descriptionError, setDescriptionError] = useState("");

  // --- NEW: State for city data and search ---
  const [indianCities, setIndianCities] = useState([]);
  const [locationSearch, setLocationSearch] = useState('');

  const [dropdownOpen, setDropdownOpen] = useState({
    stream: false,
    preferredLocations: false,
    jobRoles: false,
    skills: false,
    selectionProcess: false,
    amenities: false,
    benefits: false,
    tags: false
  });

  const streamRef = useRef(null);
  const preferredLocationsRef = useRef(null);
  const jobRolesRef = useRef(null);
  const skillsRef = useRef(null);
  const selectionProcessRef = useRef(null);
  const amenitiesRef = useRef(null);
  const benefitsRef = useRef(null);
  const tagsRef = useRef(null);

  // --- NEW: useEffect to load city data on component mount ---
  useEffect(() => {
    const citiesOfIndia = City.getCitiesOfCountry('IN').sort((a, b) => a.name.localeCompare(b.name));
    setIndianCities(citiesOfIndia);
  }, []);

  // Effect to close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      const dropdownRefs = {
        stream: streamRef,
        preferredLocations: preferredLocationsRef,
        jobRoles: jobRolesRef,
        skills: skillsRef,
        selectionProcess: selectionProcessRef,
        amenities: amenitiesRef,
        benefits: benefitsRef,
        tags: tagsRef,
      };

      for (const key in dropdownRefs) {
        if (dropdownRefs[key].current && !dropdownRefs[key].current.contains(event.target)) {
          setDropdownOpen(prev => ({ ...prev, [key]: false }));
        }
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // --- NEW: useEffect to reset stream when degree changes ---
  useEffect(() => {
    if (formData.degree) {
      setFormData(prev => ({ ...prev, stream: [] }));
    }
  }, [formData.degree]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "description") {
      if (value.length > 500) {
        setDescriptionError("Job description cannot exceed 500 characters.");
      } else {
        setDescriptionError("");
      }
    }
    setFormData({ ...formData, [name]: value });
  };

  const handleMultiSelect = (field, value) => {
    setFormData(prev => {
      const currentValues = prev[field] || [];
      const newValues = currentValues.includes(value)
        ? currentValues.filter(item => item !== value)
        : [...currentValues, value];
      return { ...prev, [field]: newValues };
    });
  };

  const handleOptionSelect = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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

  const handleSubmit = async () => {
    if (formData.description.length > 500) {
      setDescriptionError("Job description cannot exceed 500 characters.");
      toast.error("Job description cannot exceed 500 characters.");
      return;
    }
    try {
      const token = localStorage.getItem('token') || document.cookie.split('; ').find(row => row.startsWith('jwt='))?.split('=')[1];

      const payload = {
        degree: formData.degree ? [formData.degree] : [],
        studentStreams: formData.stream,
        location: formData.preferredLocations,
        lookingFor: formData.lookingFor,
        employmentType: formData.employmentType,
        workMode: formData.workMode,
        jobRoles: formData.jobRoles,
        skills: formData.skills,
        minPackage: {
          currency: currency,
          amount: parseFloat(formData.minimumSalary) || 0
        },
        startDate: formData.startDate,
        endDate: formData.endDate,
        rounds: formData.rounds ? [formData.rounds] : [],
        selectionProcess: formData.selectionProcess.join(' + '),
        contactPerson: {
          name: formData.contactPersonName,
          designation: formData.contactDesignation,
          email: formData.email,
          mobile: formData.mobile,
          linkedin: formData.linkedin,
        },
        minimumStudents: formData.minimumStudents,
        eligibilityCriteria: formData.eligibilityCriteria,
        description: formData.description,
        amenitiesRequired: formData.amenitiesRequired,
        benefits: formData.benefits,
        tags: formData.tags,
        jobType: 'On-campus',
        broadcastType: formData.broadcastType,
      };

      const response = await axios.post(
        `${import.meta.env.VITE_Backend_URL}/api/hiring-channels/on-campus`,
        payload,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (response.status === 201) {
        toast.success('On-campus opportunity posted');
        setTimeout(() => {
          toast.success('This job will expire after 15 days');
        }, 2000);
        setFormData(initialData);
        setCurrency('INR');
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || err.response?.data?.error || 'Submission failed. Please try again.');
    }
  };

  const availableStreams = degreeStreamMapping[formData.degree] || [];
  const filteredCities = indianCities.filter(city =>
    city.name.toLowerCase().includes(locationSearch.toLowerCase())
  );

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white">
      {/* Header section */}
      <div className="flex flex-col md:flex-row justify-between items-start mb-8">
        <div className="mb-4 md:mb-0">
          <h1 className="text-2xl font-bold">OnCampus Connect:</h1>
          <h2 className="text-2xl font-bold mb-4">Hire Smarter</h2>
        </div>
        <div className="max-w-md">
          <p className="text-sm">
            Our OnCampus service brings career opportunities directly to students, connecting them with top employers through campus recruitment drives and job events.
          </p>
        </div>
      </div>

      {/* Main heading */}
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold">Register for On-Campus Hiring</h2>
        <p className="text-gray-500 mt-2">Fill in your requirements to find the best talent from campuses across the nation.</p>
      </div>

      {/* Form */}
      <div className="space-y-6">
        {/* Degree */}
        <div>
          <label htmlFor="degree" className="block mb-2 font-medium">Degree</label>
          <div className="relative">
            <select id="degree" name="degree" className="w-full p-2 border border-gray-300 rounded appearance-none bg-white pr-10" value={formData.degree} onChange={handleInputChange}>
              <option value="" disabled>Select degree</option>
              {degreeOptions.map(option => (<option key={option} value={option}>{option}</option>))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          </div>
        </div>

        {/* Stream (MODIFIED) */}
        <div ref={streamRef} className="relative">
          <label className="block font-medium mb-2">Stream</label>
          <div className="flex flex-wrap gap-2 mb-2">
            {formData.stream.map(stream => (
              <div key={stream} className="flex items-center bg-gray-200 text-sm px-3 py-1 rounded-full">
                <span>{stream}</span>
                <button type="button" onClick={() => removeSelectedItem('stream', stream)} className="ml-2 text-gray-600 hover:text-black"><X size={14} /></button>
              </div>
            ))}
          </div>
          <div
            className={`flex items-center justify-between p-2 w-full border rounded-md ${!formData.degree ? 'bg-gray-100 cursor-not-allowed' : 'cursor-pointer hover:border-gray-400'}`}
            onClick={() => formData.degree && toggleDropdown('stream')}
          >
            <span className="text-gray-500">
              {formData.degree ? 'Select stream(s)' : 'Please select a degree first'}
            </span>
            <ChevronDown className={`w-5 h-5 transition-transform ${dropdownOpen.stream ? "rotate-180" : ""}`} />
          </div>
          {dropdownOpen.stream && formData.degree && (
            <div className="absolute z-20 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
              {availableStreams.map(stream => (
                <div key={stream} onClick={() => handleMultiSelect('stream', stream)} className={`px-4 py-2 hover:bg-gray-100 cursor-pointer ${formData.stream.includes(stream) ? "bg-gray-100 font-medium" : ""}`}>
                  {stream}
                  {formData.stream.includes(stream) && <span className="float-right text-gray-500">✓</span>}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Preferred Hiring Locations (MODIFIED) */}
        <div ref={preferredLocationsRef} className="relative">
          <label className="block font-medium mb-2">Preferred Hiring Locations</label>
          <div className="flex flex-wrap gap-2 mb-2">
            {formData.preferredLocations.map(location => (
              <div key={location} className="flex items-center bg-gray-200 text-sm px-3 py-1 rounded-full">
                <span>{location}</span>
                <button type="button" onClick={() => removeSelectedItem('preferredLocations', location)} className="ml-2 text-gray-600 hover:text-black"><X size={14} /></button>
              </div>
            ))}
          </div>
          <div
            className="flex items-center justify-between p-2 w-full border border-gray-300 rounded-md cursor-pointer hover:border-gray-400"
            onClick={() => toggleDropdown('preferredLocations')}
          >
            <span className="text-gray-500">Select location(s)</span>
            <ChevronDown className={`w-5 h-5 transition-transform ${dropdownOpen.preferredLocations ? "rotate-180" : ""}`} />
          </div>
          {dropdownOpen.preferredLocations && (
            <div className="absolute z-20 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg">
              <div className="p-2 border-b">
                <input
                  type="text"
                  value={locationSearch}
                  onChange={(e) => setLocationSearch(e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                  placeholder="Search for a city..."
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="max-h-60 overflow-auto">
                {filteredCities.map(city => (
                  <div key={`${city.name}-${city.stateCode}`} onClick={() => handleMultiSelect('preferredLocations', city.name)} className={`px-4 py-2 hover:bg-gray-100 cursor-pointer ${formData.preferredLocations.includes(city.name) ? "bg-gray-100 font-medium" : ""}`}>
                    {city.name}
                    {formData.preferredLocations.includes(city.name) && <span className="float-right text-gray-500">✓</span>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Broadcast Type (NEW) */}
        <div>
          <label className="block mb-2 font-medium">Broadcast Options <span className="text-red-500">*</span></label>
          <div className="flex items-center space-x-6">
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="broadcastType"
                value="Everyone"
                checked={formData.broadcastType === 'Everyone'}
                onChange={handleInputChange}
                className="h-4 w-4 text-black border-gray-300 focus:ring-black"
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
                className="h-4 w-4 text-black border-gray-300 focus:ring-black"
              />
              <span className="ml-2 text-gray-700">Broadcast by Location</span>
            </label>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Select 'Broadcast by Location' to show this job only to candidates/colleges in the specified Work Locations.
          </p>
        </div>

        {/* Looking for */}
        <div>
          <label className="block mb-2 font-medium">Looking for</label>
          <div className="flex space-x-2">
            <button type="button" className={`px-4 py-1 border ${formData.lookingFor === 'Job' ? 'bg-black text-white' : 'bg-white text-black'} rounded`} onClick={() => handleOptionSelect('lookingFor', 'Job')}>Job</button>
            <button type="button" className={`px-4 py-1 border ${formData.lookingFor === 'Internship' ? 'bg-black text-white' : 'bg-white text-black'} rounded`} onClick={() => handleOptionSelect('lookingFor', 'Internship')}>Internship</button>
            <button type="button" className={`px-4 py-1 border ${formData.lookingFor === 'Both' ? 'bg-black text-white' : 'bg-white text-black'} rounded`} onClick={() => handleOptionSelect('lookingFor', 'Both')}>Both</button>
          </div>
        </div>

        {/* Employment type */}
        <div>
          <label className="block mb-2 font-medium">Employment type</label>
          <div className="flex flex-wrap gap-2">
            {['Part-time', 'Full-time', 'Contract'].map(type => (
              <button key={type} type="button" className={`px-4 py-1 border ${formData.employmentType.includes(type) ? 'bg-black text-white' : 'bg-white text-black'} rounded`} onClick={() => handleMultiSelect('employmentType', type)}>
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Work Mode */}
        <div>
          <label className="block mb-2 font-medium">Work Mode</label>
          <div className="flex space-x-2">
            <button type="button" className={`px-4 py-1 border ${formData.workMode === 'Hybrid' ? 'bg-black text-white' : 'bg-white text-black'} rounded`} onClick={() => handleOptionSelect('workMode', 'Hybrid')}>Hybrid</button>
            <button type="button" className={`px-4 py-1 border ${formData.workMode === 'On-site' ? 'bg-black text-white' : 'bg-white text-black'} rounded`} onClick={() => handleOptionSelect('workMode', 'On-site')}>On-site</button>
            <button type="button" className={`px-4 py-1 border ${formData.workMode === 'Remote' ? 'bg-black text-white' : 'bg-white text-black'} rounded`} onClick={() => handleOptionSelect('workMode', 'Remote')}>Remote</button>
          </div>
        </div>

        {/* Job Roles */}
        <div ref={jobRolesRef} className="relative">
          <label className="block font-medium mb-2">Job Roles</label>
          <div className="flex flex-wrap gap-2 mb-2">
            {formData.jobRoles.map(role => (
              <div key={role} className="flex items-center bg-gray-200 text-sm px-3 py-1 rounded-full">
                <span>{role}</span>
                <button type="button" onClick={() => removeSelectedItem('jobRoles', role)} className="ml-2 text-gray-600 hover:text-black"><X size={14} /></button>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between p-2 w-full border border-gray-300 rounded-md cursor-pointer hover:border-gray-400" onClick={() => toggleDropdown('jobRoles')}>
            <span className="text-gray-500">Select job roles</span>
            <ChevronDown className={`w-5 h-5 transition-transform ${dropdownOpen.jobRoles ? "rotate-180" : ""}`} />
          </div>
          {dropdownOpen.jobRoles && (
            <div className="absolute z-20 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
              {jobRoleOptions.map(role => (
                <div key={role} onClick={() => handleMultiSelect('jobRoles', role)} className={`px-4 py-2 hover:bg-gray-100 cursor-pointer ${formData.jobRoles.includes(role) ? "bg-gray-100 font-medium" : ""}`}>
                  {role}
                  {formData.jobRoles.includes(role) && <span className="float-right text-gray-500">✓</span>}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Skills */}
        <div ref={skillsRef} className="relative">
          <label className="block font-medium mb-2">Skills</label>
          <div className="flex flex-wrap gap-2 mb-2">
            {formData.skills.map(skill => (
              <div key={skill} className="flex items-center bg-gray-200 text-sm px-3 py-1 rounded-full">
                <span>{skill}</span>
                <button type="button" onClick={() => removeSelectedItem('skills', skill)} className="ml-2 text-gray-600 hover:text-black"><X size={14} /></button>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between p-2 w-full border border-gray-300 rounded-md cursor-pointer hover:border-gray-400" onClick={() => toggleDropdown('skills')}>
            <span className="text-gray-500">Select skills</span>
            <ChevronDown className={`w-5 h-5 transition-transform ${dropdownOpen.skills ? "rotate-180" : ""}`} />
          </div>
          {dropdownOpen.skills && (
            <div className="absolute z-20 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
              {skillsOptions.map(skill => (
                <div key={skill} onClick={() => handleMultiSelect('skills', skill)} className={`px-4 py-2 hover:bg-gray-100 cursor-pointer ${formData.skills.includes(skill) ? "bg-gray-100 font-medium" : ""}`}>
                  {skill}
                  {formData.skills.includes(skill) && <span className="float-right text-gray-500">✓</span>}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Eligibility Criteria */}
        <div>
          <label htmlFor="eligibilityCriteria" className="block mb-2 font-medium">Eligibility Criteria</label>
          <textarea id="eligibilityCriteria" name="eligibilityCriteria" rows="4" placeholder="e.g., Minimum 60% in all semesters, no active backlogs, etc." className="w-full p-2 border border-gray-300 rounded" value={formData.eligibilityCriteria} onChange={handleInputChange} />
        </div>

        {/* Description  */}
        <div>
          <label className="block mb-1 font-medium">Job Description <span className="text-red-500">*</span></label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Provide a detailed job description..."
            className="w-full p-2 border rounded resize-none h-24"
            maxLength={600}
            required></textarea>
          <div className="flex justify-between text-xs mt-1">
            <span className={descriptionError ? 'text-red-500' : 'text-gray-500'}>
              {descriptionError ? descriptionError : `${formData.description.length}/500 characters`}
            </span>
          </div>
        </div>

        {/* Amenities/Facilities Required */}
        <div ref={amenitiesRef} className="relative">
          <label className="block font-medium mb-2">Amenities/Facilities Required</label>
          <div className="flex flex-wrap gap-2 mb-2">
            {formData.amenitiesRequired.map(amenity => (
              <div key={amenity} className="flex items-center bg-gray-200 text-sm px-3 py-1 rounded-full">
                <span>{amenity}</span>
                <button type="button" onClick={() => removeSelectedItem('amenitiesRequired', amenity)} className="ml-2 text-gray-600 hover:text-black"><X size={14} /></button>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between p-2 w-full border border-gray-300 rounded-md cursor-pointer hover:border-gray-400" onClick={() => toggleDropdown('amenities')}>
            <span className="text-gray-500">Select required amenities</span>
            <ChevronDown className={`w-5 h-5 transition-transform ${dropdownOpen.amenities ? "rotate-180" : ""}`} />
          </div>
          {dropdownOpen.amenities && (
            <div className="absolute z-20 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
              {amenitiesOptions.map(amenity => (
                <div key={amenity} onClick={() => handleMultiSelect('amenitiesRequired', amenity)} className={`px-4 py-2 hover:bg-gray-100 cursor-pointer ${formData.amenitiesRequired.includes(amenity) ? "bg-gray-100 font-medium" : ""}`}>
                  {amenity}
                  {formData.amenitiesRequired.includes(amenity) && <span className="float-right text-gray-500">✓</span>}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Benefits */}
        <div ref={benefitsRef} className="relative">
          <label className="block font-medium mb-2">Benefits</label>
          <div className="flex flex-wrap gap-2 mb-2">
            {formData.benefits.map(benefit => (
              <div key={benefit} className="flex items-center bg-gray-200 text-sm px-3 py-1 rounded-full">
                <span>{benefit}</span>
                <button type="button" onClick={() => removeSelectedItem('benefits', benefit)} className="ml-2 text-gray-600 hover:text-black"><X size={14} /></button>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between p-2 w-full border border-gray-300 rounded-md cursor-pointer hover:border-gray-400" onClick={() => toggleDropdown('benefits')}>
            <span className="text-gray-500">Select benefits offered</span>
            <ChevronDown className={`w-5 h-5 transition-transform ${dropdownOpen.benefits ? "rotate-180" : ""}`} />
          </div>
          {dropdownOpen.benefits && (
            <div className="absolute z-20 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
              {benefitsOptions.map(benefit => (
                <div key={benefit} onClick={() => handleMultiSelect('benefits', benefit)} className={`px-4 py-2 hover:bg-gray-100 cursor-pointer ${formData.benefits.includes(benefit) ? "bg-gray-100 font-medium" : ""}`}>
                  {benefit}
                  {formData.benefits.includes(benefit) && <span className="float-right text-gray-500">✓</span>}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Tags multi-select */}
        <div ref={tagsRef} className="relative">
          <label className="block font-medium mb-2">Tags</label>
          <div className="flex flex-wrap gap-2 mb-2">
            {formData.tags.map(tag => (
              <div key={tag} className="flex items-center bg-gray-200 text-sm px-3 py-1 rounded-full">
                <span>{tag}</span>
                <button type="button" onClick={() => removeSelectedItem('tags', tag)} className="ml-2 text-gray-600 hover:text-black"><X size={14} /></button>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between p-2 w-full border border-gray-300 rounded-md cursor-pointer hover:border-gray-400" onClick={() => toggleDropdown('tags')}>
            <span className="text-gray-500">Select tags</span>
            <ChevronDown className={`w-5 h-5 transition-transform ${dropdownOpen.tags ? "rotate-180" : ""}`} />
          </div>
          {dropdownOpen.tags && (
            <div className="absolute z-20 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
              {tagsOptions.map(tag => (
                <div key={tag} onClick={() => handleMultiSelect('tags', tag)} className={`px-4 py-2 hover:bg-gray-100 cursor-pointer ${formData.tags.includes(tag) ? "bg-gray-100 font-medium" : ""}`}>
                  {tag}
                  {formData.tags.includes(tag) && <span className="float-right text-gray-500">✓</span>}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Minimum Salary Offered */}
        <div>
          <label className="block mb-2 font-medium">Minimum Salary Offered</label>
          <div className="flex">
            <div className="relative w-24">
              <select id="currency" name="currency" className="w-full h-full p-2 border border-gray-300 rounded-l appearance-none bg-white pr-8 text-center" value={currency} onChange={(e) => setCurrency(e.target.value)}>
                <option>INR</option>
                <option>USD</option>
                <option>EUR</option>
                <option>GBP</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            </div>
            <input type="number" name="minimumSalary" placeholder="e.g., 500000" className="flex-1 p-2 border border-l-0 border-gray-300 rounded-r" value={formData.minimumSalary} onChange={handleInputChange} />
          </div>
        </div>

        {/* Tentative Date of Placement / Hiring */}
        <div>
          <label className="block mb-2 font-medium">Tentative Date of Placement / Hiring</label>
          <div className="flex space-x-4">
            <div className="w-1/2">
              <label className="block mb-1 text-sm">Start Date</label>
              <input type="date" name="startDate" className="w-full p-2 border border-gray-300 rounded" value={formData.startDate} onChange={handleInputChange} />
            </div>
            <div className="w-1/2">
              <label className="block mb-1 text-sm">End Date</label>
              <input type="date" name="endDate" className="w-full p-2 border border-gray-300 rounded" value={formData.endDate} onChange={handleInputChange} />
            </div>
          </div>
        </div>

        {/* Number of Rounds */}
        <div>
          <label htmlFor="rounds" className="block mb-2 font-medium">Number of Rounds</label>
          <div className="relative">
            <select id="rounds" name="rounds" className="w-full p-2 border border-gray-300 rounded appearance-none bg-white pr-10" value={formData.rounds} onChange={handleInputChange}>
              <option value="" disabled>Select number of rounds</option>
              {roundsOptions.map(option => (<option key={option} value={option}>{option}</option>))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          </div>
        </div>

        {/* Process of Selection */}
        <div ref={selectionProcessRef} className="relative">
          <label className="block font-medium mb-2">Process of Selection</label>
          <div className="flex items-center justify-between p-2 w-full border border-gray-300 rounded-md cursor-pointer hover:border-gray-400 min-h-[42px]" onClick={() => toggleDropdown('selectionProcess')}>
            <span className={formData.selectionProcess.length > 0 ? "text-black" : "text-gray-500"}>
              {formData.selectionProcess.length > 0 ? formData.selectionProcess.join(' + ') : 'Select process'}
            </span>
            <ChevronDown className={`w-5 h-5 transition-transform ${dropdownOpen.selectionProcess ? "rotate-180" : ""}`} />
          </div>
          {dropdownOpen.selectionProcess && (
            <div className="absolute z-20 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
              {processOptions.map(process => (
                <div key={process} onClick={() => handleMultiSelect('selectionProcess', process)} className={`px-4 py-2 hover:bg-gray-100 cursor-pointer ${formData.selectionProcess.includes(process) ? "bg-gray-100 font-medium" : ""}`}>
                  {process}
                  {formData.selectionProcess.includes(process) && <span className="float-right text-gray-500">✓</span>}
                </div>
              ))}
            </div>
          )}
        </div>


        {/* Contact Person */}
        <div>
          <label htmlFor="contactPersonName" className="block mb-2 font-medium">Contact Person</label>
          <input type="text" id="contactPersonName" name="contactPersonName" placeholder="Name" className="w-full p-2 border border-gray-300 rounded" value={formData.contactPersonName} onChange={handleInputChange} />
        </div>

        {/* Contact person designation */}
        <div>
          <label htmlFor="contactDesignation" className="block mb-2 font-medium">Contact person designation <span className="text-red-500">*</span></label>
          <div className="relative">
            <select id="contactDesignation" name="contactDesignation" className="w-full p-2 border border-gray-300 rounded appearance-none bg-white pr-10" value={formData.contactDesignation} onChange={handleInputChange}>
              <option value="" disabled>Select designation</option>
              {designationOptions.map(option => (<option key={option} value={option}>{option}</option>))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          </div>
        </div>

        {/* Contact person email */}
        <div>
          <label htmlFor="email" className="block mb-2 font-medium">Contact person email <span className="text-red-500">*</span></label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input type="email" id="email" name="email" placeholder="hello@xyz.com" className="w-full p-2 pl-10 border border-gray-300 rounded" value={formData.email} onChange={handleInputChange} />
          </div>
        </div>

        {/* Contact person mobile no */}
        <div>
          <label htmlFor="mobile" className="block mb-2 font-medium">Contact person mobile no <span className="text-red-500">*</span></label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input type="tel" id="mobile" name="mobile" placeholder="1234567890" className="w-full p-2 pl-10 border border-gray-300 rounded" value={formData.mobile} onChange={handleInputChange} />
          </div>
        </div>

        {/* Contact person LinkedIn Profile */}
        <div>
          <label htmlFor="linkedin" className="block mb-2 font-medium">Contact person LinkedIn Profile</label>
          <div className="relative">
            <Link className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input type="url" id="linkedin" name="linkedin" placeholder="http://www.linkedin.com/in/yourprofile" className="w-full p-2 pl-10 border border-gray-300 rounded" value={formData.linkedin} onChange={handleInputChange} />
          </div>
        </div>

        {/* Minimum Students to be Hired */}
        <div>
          <label htmlFor="minimumStudents" className="block mb-2 font-medium">Minimum Students to be Hired</label>
          <div className="relative">
            <select id="minimumStudents" name="minimumStudents" className="w-full p-2 border border-gray-300 rounded appearance-none bg-white pr-10" value={formData.minimumStudents} onChange={handleInputChange}>
              <option value="" disabled>Select range</option>
              {minStudentsOptions.map(option => (<option key={option} value={option}>{option}</option>))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          </div>
        </div>

        {/* Register Button */}
        <div className="flex justify-end pt-4">
          <button type="button" onClick={handleSubmit} className="px-8 py-3 bg-black text-white font-semibold rounded-lg shadow-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-800 focus:ring-opacity-50 transition-colors">
            Register
          </button>
        </div>
      </div>
    </div>
  );
}