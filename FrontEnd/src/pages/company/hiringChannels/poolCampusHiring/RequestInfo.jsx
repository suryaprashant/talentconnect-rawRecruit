import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { ChevronDown, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { City } from 'country-state-city';

export default function PoolCampusHiringForm() {
  const locations = ['Online', 'Bangalore', 'Mumbai', 'Delhi', 'Hyderabad', 'Chennai', 'Pune', 'Kolkata', 'Ahmedabad', 'Jaipur', 'Other'];
  const collegeStreamMapping = {
    'Engineering': ['B.Tech', 'M.Tech', 'Computer Science', 'Electronics', 'Mechanical', 'Civil', 'Electrical', 'Information Technology', 'Biotechnology', 'Chemical', 'Aerospace', 'Automobile'],
    'Management': ['MBA', 'BBA'],
    'Arts & Science': ['B.Sc', 'BA', 'B.Com', 'PhD'],
    'Law': ['LLB', 'LLM'],
    'Pharmacy': ['B.Pharm', 'M.Pharm'],
    'Medical': ['MBBS', 'BDS', 'Nursing'],
    'Architecture': ['B.Arch', 'M.Arch'],
    'Polytechnic': ['Diploma in Engineering', 'Diploma in Technology'],
    'ITI': ['Fitter', 'Electrician', 'Welder', 'Mechanic'],
    'Other': ['Journalism', 'Fashion Design', 'Hotel Management']
  };

  const collegeTypes = Object.keys(collegeStreamMapping);

  const jobRoles = ['Software Developer', 'Data Scientist', 'DevOps Engineer', 'QA Engineer', 'Frontend Developer', 'Backend Developer', 'Full Stack Developer', 'Mobile App Developer', 'UI/UX Designer', 'Product Manager', 'Business Analyst', 'Data Analyst', 'Machine Learning Engineer', 'Cloud Architect', 'Network Engineer', 'Cyber Security Specialist', 'Technical Writer', 'Sales Engineer', 'Marketing Specialist', 'HR Recruiter', 'Finance Analyst', 'Other'];
  const skillsOptions = ['JavaScript', 'Python', 'Java', 'React', 'Node.js', 'HTML/CSS', 'SQL', 'MongoDB', 'AWS', 'Docker', 'Kubernetes', 'Machine Learning', 'Data Structures', 'Algorithms', 'Git', 'REST APIs'];
  const benefitsOptions = ['Health Insurance', 'Provident Fund (PF)', 'Paid Time Off (PTO)', 'Work from Home', 'Performance Bonus', 'Stock Options'];
  const amenitiesOptions = ['Projector & Screen', 'Seminar Hall', 'Interview Rooms', 'Wi-Fi Access', 'Computer Labs', 'Cafeteria', 'Parking Space', 'Technical Support'];
  const numberOfRoundsOptions = ['1', '2', '3', '4', '5', '6+'];
  const selectionProcessOptions = ['Online Test', 'Coding Test', 'Aptitude Test', 'Group Discussion', 'Technical Interview', 'HR Interview', 'Case Study', 'Presentation'].sort((a, b) => a.localeCompare(b));
  const designationOptions = ['HR Manager', 'Technical Recruiter', 'Talent Acquisition', 'Hiring Manager', 'Team Lead', 'Department Head', 'CEO', 'CTO', 'Founder', 'Other'];
  const minimumStudentsOptions = ['1-10', '11-25', '26-50', '51-100', '101-200', '201-500', '500+'];
  const tagsOptions = ['Urgent hiring', 'Fresher preferred', 'Remote-friendly', 'Work from Home', 'Internship-eligible', 'Hybrid', 'High Priority', 'Contract', 'Part-time', 'Full-time'];

  
  const collegeCategoryOptions = ['Tier 1', 'Tier 2', 'Tier 3', 'Autonomous', 'Other'];
 
  const preferredHiringModeOptions = ["Online", "Offline", "Hybrid", "Online Aptitude and Physical Interview"];

  const initialState = {
    venue: '',
    collegeTypes: '',
    studentStreams: [],
    criteria: '',
    description: '',
    packageDetails: { currency: 'INR', totalCTC: '', fixedPay: '', joiningBonus: '' },
    workLocation: [],
    jobRoles: [],
    workMode: [],
    employmentType: [],
    skills: [],
    benefits: [],
    amenities: [],
    tags: [],
    placementStartDate: '',
    placementEndDate: '',
    numberOfRounds: '',
    selectionProcess: [],
    contactPerson: { name: '', designation: '', email: '', mobile: '', linkedin: '' },
    minStudents: '',
    // --- NEW FIELDS ---
    collegeCategories: [],
    onlineTestDate: '',
    interviewWindow: { start: '', end: '' },
    offerRolloutDate: '',
    preferredHiringMode: '',
   
  };

  const [formData, setFormData] = useState(initialState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [descriptionError, setDescriptionError] = useState("");

  const [indianCities, setIndianCities] = useState([]);
  const [workLocationSearch, setWorkLocationSearch] = useState('');
  const [venueSearch, setVenueSearch] = useState('');

  
  const [customCollegeType, setCustomCollegeType] = useState('');
  const [customStream, setCustomStream] = useState('');
  const [customJobRole, setCustomJobRole] = useState('');
  const [customSkill, setCustomSkill] = useState('');

  const [dropdownOpen, setDropdownOpen] = useState({
    studentStreams: false,
    skills: false,
    benefits: false,
    jobRoles: false,
    amenities: false,
    selectionProcess: false,
    workLocation: false,
    tags: false,
    venue: false,
    collegeTypes: false
  });

  const studentStreamsRef = useRef(null);
  const skillsRef = useRef(null);
  const benefitsRef = useRef(null);
  const jobRolesRef = useRef(null);
  const amenitiesRef = useRef(null);
  const selectionProcessRef = useRef(null);
  const workLocationRef = useRef(null);
  const tagsRef = useRef(null);
  const venueRef = useRef(null);
  const collegeTypesRef = useRef(null);

  useEffect(() => {
    const citiesOfIndia = City.getCitiesOfCountry('IN')
      .map(city => city.name)
      .sort((a, b) => a.localeCompare(b));
    setIndianCities(citiesOfIndia);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      const refs = {
        studentStreams: studentStreamsRef,
        skills: skillsRef,
        benefits: benefitsRef,
        jobRoles: jobRolesRef,
        amenities: amenitiesRef,
        selectionProcess: selectionProcessRef,
        workLocation: workLocationRef,
        tags: tagsRef,
        venue: venueRef,
        collegeTypes: collegeTypesRef,
      };

      for (const key in refs) {
        if (refs[key].current && !refs[key].current.contains(event.target)) {
          setDropdownOpen(prev => ({ ...prev, [key]: false }));
        }
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (formData.collegeTypes) {
      setFormData(prev => ({ ...prev, studentStreams: [] }));
    }
  }, [formData.collegeTypes]);

  const handleChange = (e) => {
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

  const removeSelectedItem = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter(item => item !== value),
    }));
  };

  const toggleDropdown = (dropdown) => {
    setDropdownOpen(prev => {
      const wasOpen = prev[dropdown];
      const newState = Object.keys(prev).reduce((acc, key) => ({ ...acc, [key]: false }), {});
      if (!wasOpen) {
        newState[dropdown] = true;
      }
      return newState;
    });
  };

  const handlePackageDetailsChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      packageDetails: { ...formData.packageDetails, [name]: value }
    });
  };

  const handleInterviewWindowChange = (e) => {
    const { name, value } = e.target; 
    setFormData(prev => ({
      ...prev,
      interviewWindow: { ...prev.interviewWindow, [name]: value }
    }));
  };

  const handleContactChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, contactPerson: { ...formData.contactPerson, [name]: value } });
  };


  const handleCustomAdd = (field, value, setValue, predefinedOptions = []) => {
    if (value.trim() === '') return;
    setFormData(prev => {
      const currentValues = prev[field] || [];
    
      if (currentValues.map(v => v.toLowerCase()).includes(value.trim().toLowerCase()) || 
          predefinedOptions.map(v => v.toLowerCase()).includes(value.trim().toLowerCase())) {
        setValue(''); 
        toast.error("Item already exists.");
        return prev;
      }
      const newValues = [...currentValues, value.trim()];
      return { ...prev, [field]: newValues };
    });
    setValue(''); 
  };

  
  const handleCustomAddSingle = (field, value, setValue, predefinedOptions = []) => {
    if (value.trim() === '') return;

    if (predefinedOptions.map(v => v.toLowerCase()).includes(value.trim().toLowerCase())) {
      setValue(''); 
      toast.error("Item already exists in the list.");
      return;
    }
    setFormData(prev => ({ ...prev, [field]: value.trim() }));
    setValue(''); 
    setDropdownOpen(prev => ({ ...prev, [field]: false })); 
  };

 
  const getFilteredCities = (cities, searchTerm) => {
    if (!searchTerm.trim()) {
      return cities;
    }
    
    const searchLower = searchTerm.toLowerCase();
    const citiesWithPriority = cities.map(city => {
      const cityLower = city.toLowerCase();
      let priority = 0;
      
    
      if (cityLower === searchLower) {
        priority = 3;
      }

      else if (cityLower.startsWith(searchLower)) {
        priority = 2;
      }
  
      else if (cityLower.includes(searchLower)) {
        priority = 1;
      }
      
      return { city, priority };
    });
    
    
    return citiesWithPriority
      .filter(item => item.priority > 0)
      .sort((a, b) => b.priority - a.priority || a.city.localeCompare(b.city))
      .map(item => item.city);
  };

 
  const filteredWorkCities = getFilteredCities(indianCities, workLocationSearch);
  const filteredVenueCities = getFilteredCities(indianCities, venueSearch);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (formData.description.length > 500) {
      setDescriptionError("Job description cannot exceed 500 characters.");
      toast.error("Job description cannot exceed 500 characters.");
      return;
    }
    const fieldsToValidate = [
      { key: 'studentStreams', name: 'Student Stream / Degree' },
      { key: 'skills', name: 'Skills' },
      { key: 'benefits', name: 'Benefits Offered' },
      { key: 'workMode', name: 'Work Mode' },
      { key: 'employmentType', name: 'Employment Type' },
      { key: 'jobRoles', name: 'Job Role' },
      { key: 'amenities', name: 'Amenities/Facilities' },
      { key: 'selectionProcess', name: 'Process of Selection' },
      { key: 'workLocation', name: 'Work Location' },
      { key: 'collegeCategories', name: 'College Categories' },
    ];

    for (const field of fieldsToValidate) {
      if (!formData[field.key] || formData[field.key].length === 0) {
        const errorMsg = `Please make a selection for "${field.name}". This field is required.`;
        setError(errorMsg);
        toast.error(errorMsg);
        return;
      }
    }

    if (!formData.preferredHiringMode) {
      const errorMsg = "Please make a selection for \"Preferred Hiring Mode\". This field is required.";
      setError(errorMsg);
      toast.error(errorMsg);
      return;
    }

    setIsSubmitting(true);

    try {
      const token = localStorage.getItem('token') || document.cookie.split('; ').find(row => row.startsWith('jwt='))?.split('=')[1];

      const submissionData = {
        venue: formData.venue,
        collegeTypes: formData.collegeTypes ? [formData.collegeTypes] : [],
        studentStreams: formData.studentStreams,
        eligibilityCriteria: formData.criteria,
        description: formData.description,
        packageDetails: {
          currency: formData.packageDetails.currency,
          totalCTC: parseFloat(formData.packageDetails.totalCTC) || 0,
          fixedPay: parseFloat(formData.packageDetails.fixedPay) || 0,
          joiningBonus: parseFloat(formData.packageDetails.joiningBonus) || 0
        },
        workLocation: formData.workLocation,
        jobRoles: formData.jobRoles,
        workMode: formData.workMode,
        employmentType: formData.employmentType,
        skills: formData.skills,
        benefits: formData.benefits,
        amenitiesRequired: formData.amenities,
        startDate: formData.placementStartDate,
        endDate: formData.placementEndDate,
        rounds: formData.numberOfRounds ? [formData.numberOfRounds] : [],
        selectionProcess: formData.selectionProcess.join(' + '),
        contactPerson: formData.contactPerson,
        tags: formData.tags,
        minimumStudents: formData.minStudents,
        jobType: "Pool-campus",

        collegeCategories: formData.collegeCategories,
        onlineTestDate: formData.onlineTestDate || undefined,
        interviewWindow: {
          start: formData.interviewWindow.start || undefined,
          end: formData.interviewWindow.end || undefined
        },
        offerRolloutDate: formData.offerRolloutDate || undefined,
        companyHiringPreference: { preferredMode: formData.preferredHiringMode },
      
      };

      const response = await axios.post(
        `${import.meta.env.VITE_Backend_URL}/api/hiring-channels/pool-campus`,
        submissionData,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
        }
      );

      if (response.status === 201) {
        toast.success('Pool campus opportunity posted');
        setTimeout(() => {
          toast.success('This job will expire after 15 days');
        }, 2000);
        setFormData(initialState);
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.response?.data?.error || 'Something went wrong!';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const availableStreams = collegeStreamMapping[formData.collegeTypes] || [];

  return (
    <div className="max-w-4xl mx-auto p-4 font-sans">
      <div className="flex flex-col md:flex-row justify-between mb-8">
        <div className="md:w-1/2">
          <h1 className="text-3xl font-bold mb-2">Pool Campus Connect:</h1>
          <h2 className="text-3xl font-bold mb-4">Hire Bigger</h2>
        </div>
        <div className="md:w-1/2">
          <p className="text-sm">
            Tap into diverse talent from multiple institutions through one powerful drive. <br /> Pool Campus Connect brings students from several colleges together, making it easier for companies to conduct centralized hiring drive that are time-saving, cost-efficient, and great for brand visibility
          </p>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      <div className="mb-8">
        <h2 className="text-2xl font-bold text-center mb-4">Register for Pool Campus Hiring</h2>
        <p className="text-center text-gray-500 mb-6">Fill in the details below to register for the hiring drive</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Pool Campus Hiring Venue with Indian Cities */}
          <div ref={venueRef} className="relative">
            <label className="block mb-1 font-medium">Pool Campus Hiring Venue <span className="text-red-500">*</span></label>
            <div 
              onClick={() => toggleDropdown('venue')}
              className="flex items-center justify-between p-2 w-full border border-gray-300 rounded-md cursor-pointer hover:border-gray-400"
            >
              <span className={formData.venue ? "text-black" : "text-gray-500"}>
                {formData.venue || 'Select venue location'}
              </span>
              <ChevronDown className={`w-5 h-5 transition-transform ${dropdownOpen.venue ? "rotate-180" : ""}`} />
            </div>
            {dropdownOpen.venue && (
              <div className="absolute z-20 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg">
                <div className="p-2 border-b">
                  <input
                    type="text"
                    value={venueSearch}
                    onChange={(e) => setVenueSearch(e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    placeholder="Search for a city..."
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div className="max-h-60 overflow-auto">
                  {filteredVenueCities.length > 0 ? (
                    filteredVenueCities.map(city => (
                      <div
                        key={city}
                        onClick={() => {
                          setFormData(prev => ({ ...prev, venue: city }));
                          setDropdownOpen(prev => ({ ...prev, venue: false }));
                        }}
                        className={`px-4 py-2 hover:bg-gray-100 cursor-pointer ${formData.venue === city ? "bg-gray-100 font-medium" : ""}`}
                      >
                        {city}
                        {formData.venue === city && <span className="float-right text-gray-500">✓</span>}
                      </div>
                    ))
                  ) : (
                    <div className="px-4 py-2 text-gray-500">No cities found matching "{venueSearch}"</div>
                  )}
                </div>
              </div>
            )}
          </div>

       
          <div ref={collegeTypesRef} className="relative">
            <label className="block font-medium mb-2">Type of College <span className="text-red-500">*</span></label>
            <div 
              onClick={() => toggleDropdown('collegeTypes')}
              className="flex items-center justify-between p-2 w-full border border-gray-300 rounded-md cursor-pointer hover:border-gray-400"
            >
              <span className={formData.collegeTypes ? "text-black" : "text-gray-500"}>
                {formData.collegeTypes || 'Select college type'}
              </span>
              <ChevronDown className={`w-5 h-5 transition-transform ${dropdownOpen.collegeTypes ? "rotate-180" : ""}`} />
            </div>
            {dropdownOpen.collegeTypes && (
              <div className="absolute z-20 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
              
                <div className="p-2 border-b flex">
                  <input
                    type="text"
                    placeholder="Add custom college type..."
                    value={customCollegeType}
                    onChange={(e) => setCustomCollegeType(e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleCustomAddSingle('collegeTypes', customCollegeType, setCustomCollegeType, collegeTypes);
                      }
                    }}
                    className="w-full p-1 border rounded"
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCustomAddSingle('collegeTypes', customCollegeType, setCustomCollegeType, collegeTypes);
                    }}
                    className="ml-2 px-3 py-1 bg-black text-white rounded text-sm"
                  >
                    Add
                  </button>
                </div>
                <div className="max-h-48 overflow-auto">
                  {collegeTypes.map(type => (
                    <div 
                      key={type} 
                      onClick={() => {
                        setFormData(prev => ({ ...prev, collegeTypes: type }));
                        setDropdownOpen(prev => ({ ...prev, collegeTypes: false }));
                      }} 
                      className={`px-4 py-2 hover:bg-gray-100 cursor-pointer ${formData.collegeTypes === type ? "bg-gray-100 font-medium" : ""}`}
                    >
                      {type}
                      {formData.collegeTypes === type && <span className="float-right text-gray-500">✓</span>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Student Stream with Custom Add */}
          <div ref={studentStreamsRef} className="relative">
            <label className="block font-medium mb-2">Student Stream / Degree <span className="text-red-500">*</span></label>
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.studentStreams.map(stream => (
                <div key={stream} className="flex items-center bg-gray-200 text-sm px-3 py-1 rounded-full">
                  <span>{stream}</span>
                  <button type="button" onClick={() => removeSelectedItem('studentStreams', stream)} className="ml-2 text-gray-600 hover:text-black"><X size={14} /></button>
                </div>
              ))}
            </div>
            <div
              onClick={() => formData.collegeTypes && toggleDropdown('studentStreams')}
              className={`flex items-center justify-between p-2 w-full border rounded-md ${!formData.collegeTypes ? 'bg-gray-100 cursor-not-allowed' : 'cursor-pointer hover:border-gray-400'}`}
            >
              <span className="text-gray-500">
                {formData.collegeTypes ? 'Select streams' : 'Please select a college type first'}
              </span>
              <ChevronDown className={`w-5 h-5 transition-transform ${dropdownOpen.studentStreams ? "rotate-180" : ""}`} />
            </div>
            {dropdownOpen.studentStreams && formData.collegeTypes && (
              <div className="absolute z-20 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                {/* Custom Stream Input */}
                <div className="p-2 border-b flex">
                  <input
                    type="text"
                    placeholder="Add custom stream..."
                    value={customStream}
                    onChange={(e) => setCustomStream(e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleCustomAdd('studentStreams', customStream, setCustomStream, availableStreams);
                      }
                    }}
                    className="w-full p-1 border rounded"
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCustomAdd('studentStreams', customStream, setCustomStream, availableStreams);
                    }}
                    className="ml-2 px-3 py-1 bg-black text-white rounded text-sm"
                  >
                    Add
                  </button>
                </div>
                <div className="max-h-48 overflow-auto">
                  {availableStreams.map(stream => (
                    <div key={stream} onClick={() => handleMultiSelect('studentStreams', stream)} className={`px-4 py-2 hover:bg-gray-100 cursor-pointer ${formData.studentStreams.includes(stream) ? "bg-gray-100 font-medium" : ""}`}>
                      {stream}
                      {formData.studentStreams.includes(stream) && <span className="float-right text-gray-500">✓</span>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div>
            <label className="block mb-1 font-medium">Eligibility Criteria <span className="text-red-500">*</span></label>
            <textarea name="criteria" value={formData.criteria} onChange={handleChange} placeholder="Example: Minimum 60% aggregate, No active backlogs..." className="w-full p-2 border rounded resize-none h-24" required></textarea>
          </div>

          <div>
            <label className="block mb-1 font-medium">Job Description <span className="text-red-500">*</span></label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
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

          {/* Skills with Custom Add */}
          <div ref={skillsRef} className="relative">
            <label className="block font-medium mb-2">Skills <span className="text-red-500">*</span></label>
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.skills.map(skill => (
                <div key={skill} className="flex items-center bg-gray-200 text-sm px-3 py-1 rounded-full">
                  <span>{skill}</span>
                  <button type="button" onClick={() => removeSelectedItem('skills', skill)} className="ml-2 text-gray-600 hover:text-black"><X size={14} /></button>
                </div>
              ))}
            </div>
            <div onClick={() => toggleDropdown('skills')} className="flex items-center justify-between p-2 w-full border border-gray-300 rounded-md cursor-pointer hover:border-gray-400">
              <span className="text-gray-500">Select required skills</span>
              <ChevronDown className={`w-5 h-5 transition-transform ${dropdownOpen.skills ? "rotate-180" : ""}`} />
            </div>
            {dropdownOpen.skills && (
              <div className="absolute z-20 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                {/* Custom Skill Input */}
                <div className="p-2 border-b flex">
                  <input
                    type="text"
                    placeholder="Add custom skill..."
                    value={customSkill}
                    onChange={(e) => setCustomSkill(e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleCustomAdd('skills', customSkill, setCustomSkill, skillsOptions);
                      }
                    }}
                    className="w-full p-1 border rounded"
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCustomAdd('skills', customSkill, setCustomSkill, skillsOptions);
                    }}
                    className="ml-2 px-3 py-1 bg-black text-white rounded text-sm"
                  >
                    Add
                  </button>
                </div>
                <div className="max-h-48 overflow-auto">
                  {skillsOptions.map(skill => (
                    <div key={skill} onClick={() => handleMultiSelect('skills', skill)} className={`px-4 py-2 hover:bg-gray-100 cursor-pointer ${formData.skills.includes(skill) ? "bg-gray-100 font-medium" : ""}`}>
                      {skill}
                      {formData.skills.includes(skill) && <span className="float-right text-gray-500">✓</span>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div ref={benefitsRef} className="relative">
            <label className="block font-medium mb-2">Benefits Offered <span className="text-red-500">*</span></label>
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.benefits.map(benefit => (
                <div key={benefit} className="flex items-center bg-gray-200 text-sm px-3 py-1 rounded-full">
                  <span>{benefit}</span>
                  <button type="button" onClick={() => removeSelectedItem('benefits', benefit)} className="ml-2 text-gray-600 hover:text-black"><X size={14} /></button>
                </div>
              ))}
            </div>
            <div onClick={() => toggleDropdown('benefits')} className="flex items-center justify-between p-2 w-full border border-gray-300 rounded-md cursor-pointer hover:border-gray-400">
              <span className="text-gray-500">Select benefits</span>
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

          <div ref={amenitiesRef} className="relative">
            <label className="block font-medium mb-2">Amenities/Facilities required <span className="text-red-500">*</span></label>
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.amenities.map(item => (
                <div key={item} className="flex items-center bg-gray-200 text-sm px-3 py-1 rounded-full">
                  <span>{item}</span>
                  <button type="button" onClick={() => removeSelectedItem('amenities', item)} className="ml-2 text-gray-600 hover:text-black"><X size={14} /></button>
                </div>
              ))}
            </div>
            <div onClick={() => toggleDropdown('amenities')} className="flex items-center justify-between p-2 w-full border border-gray-300 rounded-md cursor-pointer hover:border-gray-400">
              <span className="text-gray-500">Select amenities</span>
              <ChevronDown className={`w-5 h-5 transition-transform ${dropdownOpen.amenities ? "rotate-180" : ""}`} />
            </div>
            {dropdownOpen.amenities && (
              <div className="absolute z-20 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                {amenitiesOptions.map(item => (
                  <div key={item} onClick={() => handleMultiSelect('amenities', item)} className={`px-4 py-2 hover:bg-gray-100 cursor-pointer ${formData.amenities.includes(item) ? "bg-gray-100 font-medium" : ""}`}>
                    {item}
                    {formData.amenities.includes(item) && <span className="float-right text-gray-500">✓</span>}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="block mb-1 font-medium">Package Details <span className="text-red-500">*</span></label>
            <div className="flex mb-2">
              <div className="relative">
                <select
                  name="currency"
                  value={formData.packageDetails.currency}
                  onChange={handlePackageDetailsChange}
                  className="py-2 px-3 border rounded-l bg-white"
                >
                  <option value="INR">INR</option>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                </select>
              </div>
              <input
                type="number"
                name="totalCTC"
                value={formData.packageDetails.totalCTC}
                onChange={handlePackageDetailsChange}
                placeholder="Total CTC (e.g. 1000000)"
                className="flex-grow p-2 border border-l-0 rounded-r"
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="number"
                name="fixedPay"
                value={formData.packageDetails.fixedPay}
                onChange={handlePackageDetailsChange}
                placeholder="Fixed Pay (e.g. 800000)"
                className="w-full p-2 border rounded"
              />
              <input
                type="number"
                name="joiningBonus"
                value={formData.packageDetails.joiningBonus}
                onChange={handlePackageDetailsChange}
                placeholder="Variable Pay (e.g. 50000)"
                className="w-full p-2 border rounded"
              />
            </div>
          </div>
       
          <div ref={workLocationRef} className="relative">
            <label className="block font-medium mb-2">Work Location <span className="text-red-500">*</span></label>
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.workLocation.map(loc => (
                <div key={loc} className="flex items-center bg-gray-200 text-sm px-3 py-1 rounded-full">
                  <span>{loc}</span>
                  <button type="button" onClick={() => removeSelectedItem('workLocation', loc)} className="ml-2 text-gray-600 hover:text-black"><X size={14} /></button>
                </div>
              ))}
            </div>
            <div onClick={() => toggleDropdown('workLocation')} className="flex items-center justify-between p-2 w-full border border-gray-300 rounded-md cursor-pointer hover:border-gray-400">
              <span className="text-gray-500">Select work locations</span>
              <ChevronDown className={`w-5 h-5 transition-transform ${dropdownOpen.workLocation ? "rotate-180" : ""}`} />
            </div>
            {dropdownOpen.workLocation && (
              <div className="absolute z-20 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg">
                <div className="p-2 border-b">
                  <input
                    type="text"
                    value={workLocationSearch}
                    onChange={(e) => setWorkLocationSearch(e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    placeholder="Search for a city..."
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div className="max-h-60 overflow-auto">
                  {filteredWorkCities.length > 0 ? (
                    filteredWorkCities.map(city => (
                      <div
                        key={city}
                        onClick={() => handleMultiSelect('workLocation', city)}
                        className={`px-4 py-2 hover:bg-gray-100 cursor-pointer ${formData.workLocation.includes(city) ? "bg-gray-100 font-medium" : ""}`}
                      >
                        {city}
                        {formData.workLocation.includes(city) && <span className="float-right text-gray-500">✓</span>}
                      </div>
                    ))
                  ) : (
                    <div className="px-4 py-2 text-gray-500">No cities found matching "{workLocationSearch}"</div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div ref={jobRolesRef} className="relative">
            <label className="block font-medium mb-2">Job Role <span className="text-red-500">*</span></label>
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.jobRoles.map(role => (
                <div key={role} className="flex items-center bg-gray-200 text-sm px-3 py-1 rounded-full">
                  <span>{role}</span>
                  <button type="button" onClick={() => removeSelectedItem('jobRoles', role)} className="ml-2 text-gray-600 hover:text-black"><X size={14} /></button>
                </div>
              ))}
            </div>
            <div onClick={() => toggleDropdown('jobRoles')} className="flex items-center justify-between p-2 w-full border border-gray-300 rounded-md cursor-pointer hover:border-gray-400">
              <span className="text-gray-500">Select job roles</span>
              <ChevronDown className={`w-5 h-5 transition-transform ${dropdownOpen.jobRoles ? "rotate-180" : ""}`} />
            </div>
            {dropdownOpen.jobRoles && (
              <div className="absolute z-20 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
              
                <div className="p-2 border-b flex">
                  <input
                    type="text"
                    placeholder="Add custom job role..."
                    value={customJobRole}
                    onChange={(e) => setCustomJobRole(e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleCustomAdd('jobRoles', customJobRole, setCustomJobRole, jobRoles);
                      }
                    }}
                    className="w-full p-1 border rounded"
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCustomAdd('jobRoles', customJobRole, setCustomJobRole, jobRoles);
                    }}
                    className="ml-2 px-3 py-1 bg-black text-white rounded text-sm"
                  >
                    Add
                  </button>
                </div>
                <div className="max-h-48 overflow-auto">
                  {jobRoles.map(role => (
                    <div key={role} onClick={() => handleMultiSelect('jobRoles', role)} className={`px-4 py-2 hover:bg-gray-100 cursor-pointer ${formData.jobRoles.includes(role) ? "bg-gray-100 font-medium" : ""}`}>
                      {role}
                      {formData.jobRoles.includes(role) && <span className="float-right text-gray-500">✓</span>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div>
            <label className="block mb-1 font-medium">Work Mode <span className="text-red-500">*</span></label>
            <div className="flex flex-wrap gap-2">
              {['Hybrid', 'On-site', 'Remote'].map(mode => (
                <button key={mode} type="button" onClick={() => handleMultiSelect('workMode', mode)} className={`px-4 py-2 text-sm border rounded-md cursor-pointer ${formData.workMode.includes(mode) ? 'bg-black text-white' : 'bg-white'}`}>
                  {mode}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block mb-1 font-medium">Employment Type <span className="text-red-500">*</span></label>
            <div className="flex flex-wrap gap-2">
              {['Part-time', 'Full-time', 'Contract'].map(type => (
                <button key={type} type="button" onClick={() => handleMultiSelect('employmentType', type)} className={`px-4 py-2 text-sm border rounded-md cursor-pointer ${formData.employmentType.includes(type) ? 'bg-black text-white' : 'bg-white'}`}>
                  {type}
                </button>
              ))}
            </div>
          </div>

        
          <div>
            <label className="block mb-1 font-medium">College Categories <span className="text-red-500">*</span></label>
            <div className="flex flex-wrap gap-2">
              {collegeCategoryOptions.map(category => (
                <button key={category} type="button" onClick={() => handleMultiSelect('collegeCategories', category)} className={`px-4 py-2 text-sm border rounded-md cursor-pointer ${formData.collegeCategories.includes(category) ? 'bg-black text-white' : 'bg-white'}`}>
                  {category}
                </button>
              ))}
            </div>
          </div>

           <div>
            <label className="block mb-1 font-medium">Tentative Date of Placement / Hiring <span className="text-red-500">*</span></label>
            <div className="flex space-x-2">
              <div className="w-1/2 mt-3"><label className="block text-xs mb-1 ml-2 font-medium">Start Date</label><div className="relative"><input type="date" name="placementStartDate" value={formData.placementStartDate} onChange={handleChange} className="w-full p-2 border rounded" required /></div></div>
              <div className="w-1/2 mt-3"><label className="block text-xs mb-1 ml-2 font-medium">End Date</label><div className="relative"><input type="date" name="placementEndDate" value={formData.placementEndDate} onChange={handleChange} className="w-full p-2 border rounded" required /></div></div>
            </div>
          </div>

          <div>
            <label className="block mb-1 font-medium">Preferred Hiring Mode <span className="text-red-500">*</span></label>
            <div className="relative">
              <select name="preferredHiringMode" value={formData.preferredHiringMode} onChange={handleChange} className="w-full p-2 border rounded appearance-none pr-8 bg-white" required>
                <option value="" disabled>Select preferred mode</option>
                {preferredHiringModeOptions.map((mode) => (<option key={mode} value={mode}>{mode}</option>))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none"><ChevronDown className="w-4 h-4 text-gray-400" /></div>
            </div>
          </div>

          <div>
            <label className="block mb-1 font-medium">Online Test Date</label>
            <input type="date" name="onlineTestDate" value={formData.onlineTestDate} onChange={handleChange} className="w-full p-2 border rounded" />
          </div>

          <div>
            <label className="block mb-1 font-medium">Interview Window</label>
            <div className="flex space-x-2">
              <div className="w-1/2 mt-3"><label className="block text-xs mb-1 ml-2 font-medium">Start Date</label><div className="relative"><input type="date" name="start" value={formData.interviewWindow.start} onChange={handleInterviewWindowChange} className="w-full p-2 border rounded" /></div></div>
              <div className="w-1/2 mt-3"><label className="block text-xs mb-1 ml-2 font-medium">End Date</label><div className="relative"><input type="date" name="end" value={formData.interviewWindow.end} onChange={handleInterviewWindowChange} className="w-full p-2 border rounded" /></div></div>
            </div>
          </div>

          <div>
            <label className="block mb-1 font-medium">Offer Rollout Date</label>
            <input type="date" name="offerRolloutDate" value={formData.offerRolloutDate} onChange={handleChange} className="w-full p-2 border rounded" />
          </div>

          <div>
            <label className="block mb-1 font-medium">Number of Rounds <span className="text-red-500">*</span></label>
            <div className="relative">
              <select name="numberOfRounds" value={formData.numberOfRounds} onChange={handleChange} className="w-full p-2 border rounded appearance-none pr-8 bg-white" required>
                <option value="" disabled>Select number of rounds</option>
                {numberOfRoundsOptions.map((round) => (<option key={round} value={round}>{round}</option>))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none"><ChevronDown className="w-4 h-4 text-gray-400" /></div>
            </div>
          </div>

          <div ref={selectionProcessRef} className="relative">
            <label className="block font-medium mb-2">Process of Selection <span className="text-red-500">*</span></label>
            <div onClick={() => toggleDropdown('selectionProcess')} className="flex items-center justify-between p-2 w-full border border-gray-300 rounded-md cursor-pointer hover:border-gray-400 min-h-[42px]">
              <span className={formData.selectionProcess.length > 0 ? "text-black" : "text-gray-500"}>
                {formData.selectionProcess.length > 0 ? formData.selectionProcess.join(' + ') : 'Select process'}
              </span>
              <ChevronDown className={`w-5 h-5 transition-transform ${dropdownOpen.selectionProcess ? "rotate-180" : ""}`} />
            </div>
            {dropdownOpen.selectionProcess && (
              <div className="absolute z-20 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                {selectionProcessOptions.map(process => (
                  <div key={process} onClick={() => handleMultiSelect('selectionProcess', process)} className={`px-4 py-2 hover:bg-gray-100 cursor-pointer ${formData.selectionProcess.includes(process) ? "bg-gray-100 font-medium" : ""}`}>
                    {process}
                    {formData.selectionProcess.includes(process) && <span className="float-right text-gray-500">✓</span>}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="block mb-1 font-medium">Contact Person <span className="text-red-500">*</span></label>
            <input type="text" name="name" value={formData.contactPerson.name} onChange={handleContactChange} placeholder="Enter full name" className="w-full p-2 border rounded mb-2" required />
          </div>

          <div>
            <label className="block mb-1 font-medium">Contact person designation <span className="text-red-500">*</span></label>
            <div className="relative">
              <select name="designation" value={formData.contactPerson.designation} onChange={handleContactChange} className="w-full p-2 border rounded appearance-none pr-8 bg-white" required>
                <option value="" disabled>Select designation</option>
                {designationOptions.map((designation) => (<option key={designation} value={designation}>{designation}</option>))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none"><ChevronDown className="w-4 h-4 text-gray-400" /></div>
            </div>
          </div>

          <div>
            <label className="block mb-1 font-medium">Contact person email <span className="text-red-500">*</span></label>
            <div className="relative flex items-center border rounded pl-2">
              <span className="text-gray-500"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" /><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" /></svg></span>
              <input type="email" name="email" value={formData.contactPerson.email} onChange={handleContactChange} placeholder="example@company.com" className="w-full p-2 focus:outline-none" required />
            </div>
          </div>

          <div>
            <label className="block mb-1 font-medium">Contact person mobile no <span className="text-red-500">*</span></label>
            <div className="relative flex items-center border rounded pl-2">
              <span className="text-gray-500"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" /></svg></span>
              <input type="tel" name="mobile" value={formData.contactPerson.mobile} onChange={handleContactChange} placeholder="Enter 10-digit mobile number" className="w-full p-2 focus:outline-none" required />
            </div>
          </div>

          <div>
            <label className="block mb-1 font-medium">Contact person LinkedIn Profile</label>
            <input type="url" name="linkedin" value={formData.contactPerson.linkedin} onChange={handleContactChange} placeholder="https://www.linkedin.com/in/username" className="w-full p-2 border rounded" />
          </div>

          <div>
            <label className="block mb-1 font-medium">Minimum Students to be Hired <span className="text-red-500">*</span></label>
            <div className="relative">
              <select name="minStudents" value={formData.minStudents} onChange={handleChange} className="w-full p-2 border rounded appearance-none pr-8 bg-white" required>
                <option value="" disabled>Select minimum students</option>
                {minimumStudentsOptions.map((option) => (<option key={option} value={option}>{option}</option>))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none"><ChevronDown className="w-4 h-4 text-gray-400" /></div>
            </div>
          </div>

          <div className="flex justify-end mt-6">
            <button type="submit" disabled={isSubmitting} className="px-6 py-2 bg-black text-white font-medium rounded hover:bg-gray-800 transition-colors disabled:opacity-50">
              {isSubmitting ? 'Submitting...' : 'Register'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}