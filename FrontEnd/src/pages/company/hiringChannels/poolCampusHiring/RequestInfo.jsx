import { useState, useRef, useEffect, useMemo } from 'react';
import axios from 'axios';
import { ChevronDown, X, Building2, Mail, Phone, Link, Calendar, Users, Briefcase, MapPin, Target, DollarSign, Clock, MessageSquare, Award, IndianRupee } from 'lucide-react';
import toast from 'react-hot-toast';
import CreatableSelect from 'react-select/creatable';
import { City } from 'country-state-city';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

export default function PoolCampusHiringForm() {
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
  const numberOfRoundsOptions = ['1 Round', '2 Rounds', '3 Rounds', '4 Rounds', '5 Rounds', '6+ Rounds'];
  const processOptions = ['Online Test', 'Coding Test', 'Aptitude Test', 'Group Discussion', 'Technical Interview', 'HR Interview', 'Case Study', 'Presentation'].sort((a, b) => a.localeCompare(b));
  const designationOptions = ['HR Manager', 'Technical Recruiter', 'Talent Acquisition', 'Hiring Manager', 'Team Lead', 'Department Head', 'CEO', 'CTO', 'Founder', 'Other'];
  const minimumStudentsOptions = ['1-10 students', '11-25 students', '26-50 students', '51-100 students', '101-200 students', '201-500 students', '500+ students'];
  const tagsOptions = ['Urgent hiring', 'Fresher preferred', 'Remote-friendly', 'Work from Home', 'Internship-eligible', 'Hybrid', 'High Priority', 'Contract', 'Part-time', 'Full-time'];

  const collegeCategoryOptions = ['Tier 1', 'Tier 2', 'Tier 3', 'Autonomous', 'Other'];
  const preferredHiringModeOptions = ["Online", "Offline", "Hybrid", "Online Aptitude and Physical Interview"];

  const cityOptions = useMemo(() =>
    City.getCitiesOfCountry('IN').map(city => ({
      value: city.name,
      label: city.name,
    })),
  []);

  const initialState = {
    venue: null,
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
    collegeCategories: [],
    onlineTestDate: '',
    interviewWindow: { start: '', end: '' },
    offerRolloutDate: '',
    preferredHiringMode: '',
  };

  const [formData, setFormData] = useState(() => {
    const savedData = localStorage.getItem('pendingPoolHiringRequest');
    if (!savedData) return initialState;

    try {
      const parsed = JSON.parse(savedData);

      // 1. Revive Main Dates
      if (parsed.placementStartDate) parsed.placementStartDate = new Date(parsed.placementStartDate);
      if (parsed.placementEndDate) parsed.placementEndDate = new Date(parsed.placementEndDate);
      if (parsed.onlineTestDate) parsed.onlineTestDate = new Date(parsed.onlineTestDate);
      if (parsed.offerRolloutDate) parsed.offerRolloutDate = new Date(parsed.offerRolloutDate);

      // 2. Revive Nested Interview Window Dates
      if (parsed.interviewWindow?.start) {
        parsed.interviewWindow.start = new Date(parsed.interviewWindow.start);
      }
      if (parsed.interviewWindow?.end) {
        parsed.interviewWindow.end = new Date(parsed.interviewWindow.end);
      }

      return parsed;
    } catch (e) {
      console.error("Error reviving Pool Campus data:", e);
      return initialState;
    }
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [descriptionError, setDescriptionError] = useState("");

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
    tags: false,
    collegeTypes: false
  });

  const studentStreamsRef = useRef(null);
  const skillsRef = useRef(null);
  const benefitsRef = useRef(null);
  const jobRolesRef = useRef(null);
  const amenitiesRef = useRef(null);
  const selectionProcessRef = useRef(null);
  const tagsRef = useRef(null);
  const collegeTypesRef = useRef(null);

  useEffect(() => {
    localStorage.setItem('pendingPoolHiringRequest', JSON.stringify(formData));
  }, [formData]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      const refs = {
        studentStreams: studentStreamsRef,
        skills: skillsRef,
        benefits: benefitsRef,
        jobRoles: jobRolesRef,
        amenities: amenitiesRef,
        selectionProcess: selectionProcessRef,
        tags: tagsRef,
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

  const formatDateLocal = (date) => {
    if (!date) return '';
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleDateChange = (date, name) => {
    const formattedDate = formatDateLocal(date);
    setFormData(prev => ({ ...prev, [name]: formattedDate }));
  };

  const handleInterviewDateChange = (date, field) => {
    const formattedDate = formatDateLocal(date);
    setFormData(prev => ({
      ...prev,
      interviewWindow: { ...prev.interviewWindow, [field]: formattedDate }
    }));
  };

  const removeLastSelectionProcess = (process) => {
    setFormData(prev => {
      const values = prev.selectionProcess || [];

      // find last index of this process type
      const lastIndex = [...values]
        .map((v, i) => ({ v, i }))
        .filter(item => item.v.startsWith(process))
        .pop()?.i;

      if (lastIndex === undefined) return prev;

      return {
        ...prev,
        selectionProcess: values.filter((_, i) => i !== lastIndex)
      };
    });
  };

  const handleMultiSelect = (field, value) => {
    setFormData(prev => {
      const currentValues = prev[field] || [];

      // 🔹 Special case ONLY for selectionProcess
      if (field === 'selectionProcess') {
        const count = currentValues.filter(item =>
          item.startsWith(value)
        ).length;

        const label = `${value} ${count + 1}`;

        return {
          ...prev,
          [field]: [...currentValues, label]
        };
      }

      // 🔹 Default behavior for all other fields (UNCHANGED)
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

  const handleContactChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, contactPerson: { ...formData.contactPerson, [name]: value } });
  };

  const handleVenueChange = (selectedOption) => {
    setFormData(prev => ({ ...prev, venue: selectedOption }));
  };

  const handleWorkLocationChange = (selectedOptions) => {
    setFormData(prev => ({ ...prev, workLocation: selectedOptions || [] }));
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (formData.description.length > 500) {
      setDescriptionError("Job description cannot exceed 500 characters.");
      toast.error("Job description cannot exceed 500 characters.");
      return;
    }

    if (!formData.venue) {
      const errorMsg = "Please select a Pool Campus Hiring Venue. This field is required.";
      setError(errorMsg);
      toast.error(errorMsg);
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
        venue: formData.venue ? formData.venue.value : '',
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
        workLocation: formData.workLocation.map(loc => loc.value),
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
          toast.success('This job will expire after 30 days');
        }, 2000);
        localStorage.removeItem('pendingPoolHiringRequest');
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
    <div className="min-h-screen bg-gradient-to-br from-[#667eea]/5 via-[#f093fb]/5 to-[#764ba2]/5 py-4">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header - More Compact */}
        <div className="bg-white/90 backdrop-blur-sm border border-gray-100 rounded-xl shadow p-4 mb-6">
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <div className="p-2 bg-gradient-to-br from-[#667eea]/20 to-[#764ba2]/20 rounded-lg mr-3">
                <Building2 className="h-5 w-5 text-[#667eea]" />
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent">
                Pool Campus Connect: Hire Bigger
              </h1>
            </div>
            <p className="text-sm text-gray-600 max-w-2xl mx-auto">
              Fill in your requirements to find the best talent from multiple campuses across the nation.
            </p>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-gradient-to-r from-red-50 to-white border border-red-200 rounded-xl p-3 mb-4">
            <div className="flex items-start">
              <div>
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <p className="text-sm text-red-700 mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Main Form */}
        <div className="bg-white/90 backdrop-blur-sm border border-gray-100 rounded-xl shadow p-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent">Register for Pool-Campus Hiring</h2>
            <p className="text-gray-500 text-sm mt-1">Fill in your requirements to find the best talent from multiple campuses across the nation.</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* SECTION 1: Campus & Student Details */}
            <div className="pt-2">
              <div className="flex items-center mb-4">
                <div className="p-1.5 bg-gradient-to-br from-[#667eea]/20 to-[#764ba2]/20 rounded-lg mr-3">
                  <Users className="h-4 w-4 text-[#667eea]" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800">Campus & Student Details</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Pool Campus Hiring Venue */}
                <div>
                  <label className="block mb-2 font-medium text-sm text-gray-700">Venue <span className="text-red-500">*</span></label>
                  <CreatableSelect
                    isClearable
                    options={cityOptions}
                    value={formData.venue}
                    onChange={handleVenueChange}
                    placeholder="Select or type venue..."
                    styles={{
                      control: (base) => ({
                        ...base,
                        borderColor: '#e5e7eb',
                        minHeight: '38px',
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
                    }}
                  />
                </div>

                {/* Type of College */}
                <div ref={collegeTypesRef} className="relative">
                  <label className="block font-medium mb-2 text-sm text-gray-700">College Type <span className="text-red-500">*</span></label>
                  <div 
                    onClick={() => toggleDropdown('collegeTypes')}
                    className="flex items-center justify-between p-2 w-full border border-gray-200 rounded-lg cursor-pointer hover:border-gray-300 transition-colors bg-gradient-to-r from-gray-50 to-white"
                  >
                    <span className={`text-sm ${formData.collegeTypes ? "text-gray-700" : "text-gray-500"}`}>
                      {formData.collegeTypes || 'Select college type'}
                    </span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${dropdownOpen.collegeTypes ? "rotate-180" : ""} text-gray-400`} />
                  </div>
                  
                  {dropdownOpen.collegeTypes && (
                    <div className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-hidden">
                      <div className="p-2 border-b border-gray-100 bg-gray-50">
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="Add custom type..."
                            value={customCollegeType}
                            onChange={(e) => setCustomCollegeType(e.target.value)}
                            onClick={(e) => e.stopPropagation()}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                handleCustomAddSingle('collegeTypes', customCollegeType, setCustomCollegeType, collegeTypes);
                              }
                            }}
                            className="flex-1 p-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#667eea]/50 focus:outline-none"
                          />
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCustomAddSingle('collegeTypes', customCollegeType, setCustomCollegeType, collegeTypes);
                            }}
                            className="px-4 py-2 bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white rounded-lg text-xs font-bold whitespace-nowrap"
                          >
                            Add
                          </button>
                        </div>
                      </div>
                      
                      <div className="overflow-y-auto max-h-48">
                        {collegeTypes.map(type => (
                          <div 
                            key={type} 
                            onClick={() => {
                              setFormData(prev => ({ ...prev, collegeTypes: type }));
                              setDropdownOpen(prev => ({ ...prev, collegeTypes: false }));
                            }} 
                            className={`px-3 py-2.5 hover:bg-gray-50 cursor-pointer border-b border-gray-100 flex items-center justify-between ${
                              formData.collegeTypes === type ? "bg-blue-50/50" : ""
                            }`}
                          >
                            <span className={`text-sm ${formData.collegeTypes === type ? "text-[#667eea] font-semibold" : "text-gray-700"}`}>
                              {type}
                            </span>
                            {formData.collegeTypes === type && <span className="text-[#667eea] font-bold">✓</span>}
                          </div>
                        ))}
                        
                        {collegeTypes.length === 0 && (
                          <div className="p-4 text-center text-gray-400 text-xs italic">
                            No college types found. Add a type above.
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Student Stream */}
              <div ref={studentStreamsRef} className="relative mt-4">
                <label className="block font-medium mb-2 text-sm text-gray-700">Student Stream / Degree <span className="text-red-500">*</span></label>
                <div className="flex flex-wrap gap-1 mb-2 max-h-20 overflow-y-auto">
                  {formData.studentStreams.map(stream => (
                    <div key={stream} className="flex items-center bg-gradient-to-r from-gray-100 to-white border border-gray-200 text-gray-700 text-xs px-2 py-1 rounded-full">
                      <span>{stream}</span>
                      <button type="button" onClick={() => removeSelectedItem('studentStreams', stream)} className="ml-1 text-gray-500 hover:text-gray-700"><X size={12} /></button>
                    </div>
                  ))}
                </div>
                <div
                  onClick={() => formData.collegeTypes && toggleDropdown('studentStreams')}
                  className={`flex items-center justify-between p-3 w-full border rounded-lg ${!formData.collegeTypes ? 'bg-gray-50 cursor-not-allowed' : 'cursor-pointer hover:border-gray-300 transition-colors bg-gradient-to-r from-gray-50 to-white'} border-gray-200`}
                >
                  <span className="text-sm text-gray-500">
                    {formData.collegeTypes ? 'Select streams' : 'Select college type first'}
                  </span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${dropdownOpen.studentStreams ? "rotate-180" : ""} text-gray-400`} />
                </div>
                {dropdownOpen.studentStreams && formData.collegeTypes && (
                  <div className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-hidden">
                    <div className="p-2 border-b border-gray-100 bg-gray-50">
                      <div className="flex gap-2">
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
                          className="flex-1 p-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#667eea]/50 focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCustomAdd('studentStreams', customStream, setCustomStream, availableStreams);
                          }}
                          className="px-4 py-2 bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white rounded-lg text-xs font-bold whitespace-nowrap"
                        >
                          Add
                        </button>
                      </div>
                    </div>
                    
                    <div className="overflow-y-auto max-h-48">
                      {availableStreams.map(stream => (
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
                      
                      {availableStreams.length === 0 && (
                        <div className="p-4 text-center text-gray-400 text-xs italic">
                          No streams found. Add a stream above.
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* SECTION 2: Job Details & Requirements */}
            <div className="pt-4 border-t border-gray-100">
              <div className="flex items-center mb-4">
                <div className="p-1.5 bg-gradient-to-br from-[#667eea]/20 to-[#764ba2]/20 rounded-lg mr-3">
                  <Briefcase className="h-4 w-4 text-[#667eea]" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800">Job Details & Requirements</h3>
              </div>
              
              <div className="space-y-4">
                {/* Eligibility and Description */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Eligibility Criteria */}
                  <div>
                    <label className="block mb-2 font-medium text-sm text-gray-700">Eligibility Criteria <span className="text-red-500">*</span></label>
                    <textarea 
                      name="criteria" 
                      value={formData.criteria} 
                      onChange={handleChange} 
                      placeholder="e.g., Minimum 60%, no backlogs..." 
                      className="w-full p-3 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#667eea]/50 focus:border-transparent focus:outline-none transition-all duration-200 bg-gradient-to-r from-gray-50 to-white resize-none h-24" 
                      required
                    />
                  </div>

                  {/* Job Description */}
                  <div>
                    <label className="block mb-1 font-medium text-sm text-gray-700">Job Description <span className="text-red-500">*</span></label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Provide job description..."
                      className="w-full p-3 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#667eea]/50 focus:border-transparent focus:outline-none transition-all duration-200 bg-gradient-to-r from-gray-50 to-white resize-none h-24"
                      maxLength={500}
                      required
                    />
                    <div className="flex justify-between text-xs mt-1">
                      <span className={descriptionError ? 'text-red-500' : 'text-gray-500'}>
                        {descriptionError ? descriptionError : `${formData.description.length}/500`}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Skills and Benefits */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Skills */}
                  <div ref={skillsRef} className="relative">
                    <label className="block font-medium mb-2 text-sm text-gray-700">Skills <span className="text-red-500">*</span></label>
                    <div className="flex flex-wrap gap-1 mb-1 max-h-20 overflow-hidden">
                      {formData.skills.map(skill => (
                        <div key={skill} className="flex items-center bg-gradient-to-r from-gray-100 to-white border border-gray-200 text-gray-700 text-xs px-2 py-1 rounded-full">
                          <span>{skill}</span>
                          <button type="button" onClick={() => removeSelectedItem('skills', skill)} className="ml-1 text-gray-500 hover:text-gray-700"><X size={12} /></button>
                        </div>
                      ))}
                    </div>
                    <div onClick={() => toggleDropdown('skills')} className="flex items-center justify-between p-2 w-full border border-gray-200 rounded-lg cursor-pointer hover:border-gray-300 transition-colors bg-gradient-to-r from-gray-50 to-white">
                      <span className="text-sm text-gray-500">Select skills</span>
                      <ChevronDown className={`w-4 h-4 transition-transform ${dropdownOpen.skills ? "rotate-180" : ""} text-gray-400`} />
                    </div>
                    {dropdownOpen.skills && (
                      <div className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                        <div className="p-2 border-b border-gray-100 flex">
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
                            className="w-full p-2 text-sm border border-gray-200 rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCustomAdd('skills', customSkill, setCustomSkill, skillsOptions);
                            }}
                            className="ml-2 px-3 py-2 bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white rounded-lg text-xs font-medium"
                          >
                            Add
                          </button>
                        </div>
                        <div >
                          {skillsOptions.map(skill => (
                            <div key={skill} onClick={() => handleMultiSelect('skills', skill)} className={`px-3 py-2 hover:bg-gray-50 cursor-pointer border-b border-gray-100 ${formData.skills.includes(skill) ? "bg-blue-50" : ""}`}>
                              <div className="flex items-center justify-between">
                                <span className={`text-sm ${formData.skills.includes(skill) ? "text-[#667eea] font-medium" : "text-gray-700"}`}>{skill}</span>
                                {formData.skills.includes(skill) && <span className="text-[#667eea]">✓</span>}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Benefits Offered */}
                  <div ref={benefitsRef} className="relative">
                    <label className="block font-medium mb-2 text-sm text-gray-700">Benefits <span className="text-red-500">*</span></label>
                    <div className="flex flex-wrap gap-1 mb-1 max-h-20 overflow-y-auto">
                      {formData.benefits.map(benefit => (
                        <div key={benefit} className="flex items-center bg-gradient-to-r from-gray-100 to-white border border-gray-200 text-gray-700 text-xs px-2 py-1 rounded-full">
                          <span>{benefit}</span>
                          <button type="button" onClick={() => removeSelectedItem('benefits', benefit)} className="ml-1 text-gray-500 hover:text-gray-700"><X size={12} /></button>
                        </div>
                      ))}
                    </div>
                    <div onClick={() => toggleDropdown('benefits')} className="flex items-center justify-between p-2 w-full border border-gray-200 rounded-lg cursor-pointer hover:border-gray-300 transition-colors bg-gradient-to-r from-gray-50 to-white">
                      <span className="text-sm text-gray-500">Select benefits</span>
                      <ChevronDown className={`w-4 h-4 transition-transform ${dropdownOpen.benefits ? "rotate-180" : ""} text-gray-400`} />
                    </div>
                    {dropdownOpen.benefits && (
                      <div className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-auto">
                        {benefitsOptions.map(benefit => (
                          <div key={benefit} onClick={() => handleMultiSelect('benefits', benefit)} className={`px-3 py-2 hover:bg-gray-50 cursor-pointer border-b border-gray-100 ${formData.benefits.includes(benefit) ? "bg-blue-50" : ""}`}>
                            <div className="flex items-center justify-between">
                              <span className={`text-sm ${formData.benefits.includes(benefit) ? "text-[#667eea] font-medium" : "text-gray-700"}`}>{benefit}</span>
                              {formData.benefits.includes(benefit) && <span className="text-[#667eea]">✓</span>}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION 3: Job Position & Work Details */}
            <div className="pt-4 border-t border-gray-100">
              <div className="flex items-center mb-4">
                <div className="p-1.5 bg-gradient-to-br from-[#667eea]/20 to-[#764ba2]/20 rounded-lg mr-3">
                  <MapPin className="h-4 w-4 text-[#667eea]" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800">Job Position & Work Details</h3>
              </div>
              
              <div className="space-y-4">
                {/* Work Location and Job Roles */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                  {/* Work Location */}
                  <div className='mt-1'>
                    <label className="block font-medium mb-2 text-sm text-gray-700">Work Location <span className="text-red-500">*</span></label>
                    <CreatableSelect
                      isMulti
                      options={cityOptions}
                      value={formData.workLocation}
                      onChange={handleWorkLocationChange}
                      placeholder="Select work locations..."
                      styles={{
                        control: (base, state) => ({
                          ...base,
                          borderColor: state.isFocused ? '#667eea' : '#e5e7eb',
                          minHeight: '44px',
                          height: '44px',
                          fontSize: '14px',
                          borderRadius: '0.5rem',
                          backgroundColor: 'rgb(249 250 251 / var(--tw-bg-opacity))',
                          backgroundImage: 'linear-gradient(to right, rgb(249 250 251), rgb(255 255 255))',
                          paddingTop: '2px',
                          paddingBottom: '2px',
                          boxShadow: state.isFocused ? '0 0 0 2px rgba(102, 126, 234, 0.1)' : 'none',
                        }),
                        valueContainer: (base) => ({
                          ...base,
                          padding: '0 10px',
                          height: '40px',
                          alignItems: 'center',
                        }),
                        placeholder: (base) => ({
                          ...base,
                          color: '#9ca3af',
                          margin: 0,
                        }),
                        input: (base) => ({
                          ...base,
                          margin: 0,
                          padding: 0,
                        }),
                        multiValue: (base) => ({
                          ...base,
                          fontSize: '12px',
                          backgroundColor: '#f3f4f6',
                          borderRadius: '9999px',
                          margin: '2px',
                          height: '24px',
                        }),
                        multiValueLabel: (base) => ({
                          ...base,
                          padding: '2px 6px',
                          lineHeight: '20px',
                        }),
                        multiValueRemove: (base) => ({
                          ...base,
                          fontSize: '12px',
                          color: '#6b7280',
                          borderRadius: '0 9999px 9999px 0',
                          ':hover': {
                            backgroundColor: '#e5e7eb',
                            color: '#374151',
                          },
                        }),
                        indicatorsContainer: (base) => ({
                          ...base,
                          height: '40px',
                        }),
                        menu: (base) => ({
                          ...base,
                          borderRadius: '0.5rem',
                          fontSize: '14px',
                          border: '1px solid #e5e7eb',
                          marginTop: '4px',
                        }),
                      }}
                    />
                  </div>

                  {/* Job Roles */}
                  <div>
                    <label className="block font-medium mb-2 text-sm text-gray-700">Job Role <span className="text-red-500">*</span></label>
                    <div ref={jobRolesRef} className="relative">
                      <div className={`flex flex-wrap gap-1 mb-1 max-h-20 overflow-y-auto ${formData.jobRoles.length > 0 ? 'min-h-[20px]' : ''}`}>
                        {formData.jobRoles.map(role => (
                          <div key={role} className="flex items-center bg-gradient-to-r from-gray-100 to-white border border-gray-200 text-gray-700 text-xs px-2 py-1 rounded-full">
                            <span>{role}</span>
                            <button type="button" onClick={() => removeSelectedItem('jobRoles', role)} className="ml-1 text-gray-500 hover:text-gray-700"><X size={12} /></button>
                          </div>
                        ))}
                      </div>
                      <div 
                        onClick={() => toggleDropdown('jobRoles')} 
                        className="flex items-center justify-between w-full border border-gray-200 rounded-lg cursor-pointer hover:border-gray-300 transition-colors bg-gradient-to-r from-gray-50 to-white min-h-[44px] h-[44px] px-3"
                      >
                        <span className="text-sm text-gray-500">Select job roles</span>
                        <ChevronDown className={`w-4 h-4 transition-transform ${dropdownOpen.jobRoles ? "rotate-180" : ""} text-gray-400`} />
                      </div>
                      {dropdownOpen.jobRoles && (
                        <div className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-hidden">
                          <div className="p-2 border-b border-gray-100 bg-gray-50">
                            <div className="flex gap-2">
                              <input
                                type="text"
                                placeholder="Add custom role..."
                                value={customJobRole}
                                onChange={(e) => setCustomJobRole(e.target.value)}
                                onClick={(e) => e.stopPropagation()}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    e.preventDefault();
                                    handleCustomAdd('jobRoles', customJobRole, setCustomJobRole, jobRoles);
                                  }
                                }}
                                className="flex-1 p-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#667eea]/50 focus:outline-none"
                              />
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleCustomAdd('jobRoles', customJobRole, setCustomJobRole, jobRoles);
                                }}
                                className="px-4 py-2 bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white rounded-lg text-xs font-bold whitespace-nowrap"
                              >
                                Add
                              </button>
                            </div>
                          </div>
                          
                          <div className="overflow-y-auto max-h-48">
                            {jobRoles.map(role => (
                              <div 
                                key={role} 
                                onClick={() => handleMultiSelect('jobRoles', role)} 
                                className={`px-3 py-2.5 hover:bg-gray-50 cursor-pointer border-b border-gray-100 flex items-center justify-between ${
                                  formData.jobRoles.includes(role) ? "bg-blue-50/50" : ""
                                }`}
                              >
                                <span className={`text-sm ${formData.jobRoles.includes(role) ? "text-[#667eea] font-semibold" : "text-gray-700"}`}>
                                  {role}
                                </span>
                                {formData.jobRoles.includes(role) && <span className="text-[#667eea] font-bold">✓</span>}
                              </div>
                            ))}
                            
                            {jobRoles.length === 0 && (
                              <div className="p-4 text-center text-gray-400 text-xs italic">
                                No job roles found. Add a role above.
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Work Mode and Employment Type */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Work Mode */}
                  <div>
                    <label className="block mb-2 font-medium text-sm text-gray-700">Work Mode <span className="text-red-500">*</span></label>
                    <div className="flex gap-2">
                      {['Hybrid', 'On-site', 'Remote'].map(mode => (
                        <button 
                          key={mode} 
                          type="button" 
                          onClick={() => handleMultiSelect('workMode', mode)} 
                          className={`flex-1 px-3 py-1.5 text-sm border rounded-lg transition-colors ${formData.workMode.includes(mode) ? 'bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white border-transparent' : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300'}`}
                        >
                          {mode}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Employment Type */}
                  <div>
                    <label className="block mb-2 font-medium text-sm text-gray-700">Employment Type <span className="text-red-500">*</span></label>
                    <div className="flex gap-2">
                      {['Part-time', 'Full-time', 'Contract'].map(type => (
                        <button 
                          key={type} 
                          type="button" 
                          onClick={() => handleMultiSelect('employmentType', type)} 
                          className={`flex-1 px-3 py-1.5 text-sm border rounded-lg transition-colors ${formData.employmentType.includes(type) ? 'bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white border-transparent' : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300'}`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION 4: Compensation & Facilities */}
            <div className="pt-4 border-t border-gray-100">
              <div className="flex items-center mb-4">
                <div className="p-1.5 bg-gradient-to-br from-[#667eea]/20 to-[#764ba2]/20 rounded-lg mr-3">
                  <IndianRupee className="h-4 w-4 text-[#667eea]" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800">Compensation & Facilities</h3>
              </div>
              
              <div className="space-y-4">
                {/* Package Details */}
                <div>
                  <label className="block mb-2 font-medium text-sm text-gray-700">Package Details <span className="text-red-500">*</span></label>
                  <div className="flex mb-2">
                    <div className="relative w-20">
                      <select
                        name="currency"
                        value={formData.packageDetails.currency}
                        onChange={handlePackageDetailsChange}
                        className="w-full h-full p-2 text-sm border border-gray-200 rounded-l-lg appearance-none bg-gradient-to-r from-gray-50 to-white pr-8 text-center focus:ring-2 focus:ring-[#667eea]/50 focus:border-transparent focus:outline-none"
                      >
                        <option value="INR">₹ INR</option>
                        <option value="USD">$ USD</option>
                        <option value="EUR">€ EUR</option>
                      </select>
                      <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={14} />
                    </div>
                    <input
                      type="number"
                      name="totalCTC"
                      value={formData.packageDetails.totalCTC}
                      onChange={handlePackageDetailsChange}
                      placeholder="Total CTC"
                      className="flex-1 p-2 text-sm border border-l-0 border-gray-200 rounded-r-lg focus:ring-2 focus:ring-[#667eea]/50 focus:border-transparent focus:outline-none transition-all duration-200 bg-gradient-to-r from-gray-50 to-white"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      name="fixedPay"
                      value={formData.packageDetails.fixedPay}
                      onChange={handlePackageDetailsChange}
                      placeholder="Fixed Pay"
                      className="w-full p-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#667eea]/50 focus:border-transparent focus:outline-none transition-all duration-200 bg-gradient-to-r from-gray-50 to-white"
                    />
                    <input
                      type="number"
                      name="joiningBonus"
                      value={formData.packageDetails.joiningBonus}
                      onChange={handlePackageDetailsChange}
                      placeholder="Variable Pay"
                      className="w-full p-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#667eea]/50 focus:border-transparent focus:outline-none transition-all duration-200 bg-gradient-to-r from-gray-50 to-white"
                    />
                  </div>
                </div>

                {/* Tags and Amenities */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Tags */}
                  <div ref={tagsRef} className="relative">
                    <label className="block font-medium mb-2 text-sm text-gray-700">Tags</label>
                    <div className="flex flex-wrap gap-1 mb-1 max-h-20 overflow-y-auto">
                      {formData.tags.map(tag => (
                        <div key={tag} className="flex items-center bg-gradient-to-r from-gray-100 to-white border border-gray-200 text-gray-700 text-xs px-2 py-1 rounded-full">
                          <span>{tag}</span>
                          <button type="button" onClick={() => removeSelectedItem('tags', tag)} className="ml-1 text-gray-500 hover:text-gray-700"><X size={12} /></button>
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center justify-between p-2 w-full border border-gray-200 rounded-lg cursor-pointer hover:border-gray-300 transition-colors bg-gradient-to-r from-gray-50 to-white" onClick={() => toggleDropdown('tags')}>
                      <span className="text-sm text-gray-500">Select tags</span>
                      <ChevronDown className={`w-4 h-4 transition-transform ${dropdownOpen.tags ? "rotate-180" : ""} text-gray-400`} />
                    </div>
                    {dropdownOpen.tags && (
                      <div className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-auto">
                        {tagsOptions.map(tag => (
                          <div key={tag} onClick={() => handleMultiSelect('tags', tag)} className={`px-3 py-2 hover:bg-gray-50 cursor-pointer border-b border-gray-100 ${formData.tags.includes(tag) ? "bg-blue-50" : ""}`}>
                            <div className="flex items-center justify-between">
                              <span className={`text-sm ${formData.tags.includes(tag) ? "text-[#667eea] font-medium" : "text-gray-700"}`}>{tag}</span>
                              {formData.tags.includes(tag) && <span className="text-[#667eea]">✓</span>}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Amenities/Facilities */}
                  <div ref={amenitiesRef} className="relative">
                    <label className="block font-medium mb-2 text-sm text-gray-700">Amenities <span className="text-red-500">*</span></label>
                    <div className="flex flex-wrap gap-1 mb-1 max-h-20 overflow-y-auto">
                      {formData.amenities.map(item => (
                        <div key={item} className="flex items-center bg-gradient-to-r from-gray-100 to-white border border-gray-200 text-gray-700 text-xs px-2 py-1 rounded-full">
                          <span>{item}</span>
                          <button type="button" onClick={() => removeSelectedItem('amenities', item)} className="ml-1 text-gray-500 hover:text-gray-700"><X size={12} /></button>
                        </div>
                      ))}
                    </div>
                    <div onClick={() => toggleDropdown('amenities')} className="flex items-center justify-between p-2 w-full border border-gray-200 rounded-lg cursor-pointer hover:border-gray-300 transition-colors bg-gradient-to-r from-gray-50 to-white">
                      <span className="text-sm text-gray-500">Select amenities</span>
                      <ChevronDown className={`w-4 h-4 transition-transform ${dropdownOpen.amenities ? "rotate-180" : ""} text-gray-400`} />
                    </div>
                    {dropdownOpen.amenities && (
                      <div className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-auto">
                        {amenitiesOptions.map(item => (
                          <div key={item} onClick={() => handleMultiSelect('amenities', item)} className={`px-3 py-2 hover:bg-gray-50 cursor-pointer border-b border-gray-100 ${formData.amenities.includes(item) ? "bg-blue-50" : ""}`}>
                            <div className="flex items-center justify-between">
                              <span className={`text-sm ${formData.amenities.includes(item) ? "text-[#667eea] font-medium" : "text-gray-700"}`}>{item}</span>
                              {formData.amenities.includes(item) && <span className="text-[#667eea]">✓</span>}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION 5: Campus & Hiring Preferences */}
            <div className="pt-4 border-t border-gray-100">
              <div className="flex items-center mb-4">
                <div className="p-1.5 bg-gradient-to-br from-[#667eea]/20 to-[#764ba2]/20 rounded-lg mr-3">
                  <Award className="h-4 w-4 text-[#667eea]" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800">Campus & Hiring Preferences</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                {/* College Categories */}
                <div>
                  <label className="block mb-2 font-medium text-sm text-gray-700">College Categories <span className="text-red-500">*</span></label>
                  <div className="grid grid-cols-2 gap-2">
                    {collegeCategoryOptions.map(category => (
                      <button 
                        key={category} 
                        type="button" 
                        onClick={() => handleMultiSelect('collegeCategories', category)} 
                        className={`px-3 py-1.5 text-sm border rounded-lg transition-colors flex items-center justify-center min-h-[38px] ${
                          formData.collegeCategories.includes(category) 
                            ? 'bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white border-transparent' 
                            : 'bg-gradient-to-r from-gray-50 to-white text-gray-700 border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <span className="text-center">{category}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Preferred Hiring Mode */}
                <div>
                  <label className="block mb-2 font-medium text-sm text-gray-700">Hiring Mode <span className="text-red-500">*</span></label>
                  <div className="grid grid-cols-2 gap-2">
                    {preferredHiringModeOptions.map(mode => (
                      <button 
                        key={mode} 
                        type="button" 
                        onClick={() => setFormData(prev => ({ ...prev, preferredHiringMode: mode }))} 
                        className={`px-3 py-1.5 text-sm border rounded-lg transition-colors flex items-center justify-center min-h-[38px] ${
                          formData.preferredHiringMode === mode 
                            ? 'bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white border-transparent' 
                            : 'bg-gradient-to-r from-gray-50 to-white text-gray-700 border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <span className="text-center">{mode}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION 6: Hiring Timeline */}
            <div className="pt-4 border-t border-gray-100">
              <div className="flex items-center mb-4">
                <div className="p-1.5 bg-gradient-to-br from-[#667eea]/20 to-[#764ba2]/20 rounded-lg mr-3">
                  <Clock className="h-4 w-4 text-[#667eea]" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800">Hiring Timeline</h3>
              </div>
              
              <div className="space-y-6">
                {/* Placement Dates */}
                <div>
                  <label className="block mb-2 font-medium text-sm text-gray-700">Tentative Placement Dates <span className="text-red-500">*</span></label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block mb-1 text-xs text-gray-600">Start Date</label>
                      <div className="relative">
                        <DatePicker
                          selected={formData.placementStartDate ? new Date(formData.placementStartDate) : null}
                          onChange={(date) => handleDateChange(date, 'placementStartDate')}
                          dateFormat="dd-MM-yyyy"
                          placeholderText="Start date"
                          className="w-full p-2 pl-10 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#667eea]/50 focus:border-transparent focus:outline-none transition-all duration-200 bg-gradient-to-r from-gray-50 to-white"
                          required
                          wrapperClassName="w-full"
                        />
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={14} />
                      </div>
                    </div>
                    <div>
                      <label className="block mb-1 text-xs text-gray-600">End Date</label>
                      <div className="relative">
                        <DatePicker
                          selected={formData.placementEndDate ? new Date(formData.placementEndDate) : null}
                          onChange={(date) => handleDateChange(date, 'placementEndDate')}
                          dateFormat="dd-MM-yyyy"
                          placeholderText="End date"
                          className="w-full p-2 pl-10 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#667eea]/50 focus:border-transparent focus:outline-none transition-all duration-200 bg-gradient-to-r from-gray-50 to-white"
                          required
                          wrapperClassName="w-full"
                        />
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={14} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Hiring Timeline Dates */}
                <div>
                  <label className="block mb-2 font-medium text-sm text-gray-700">Selection Process Timeline</label>
                  <div className="space-y-3">
                    <div>
                      <label className="block mb-1 text-xs text-gray-600">Test Date</label>
                      <div className="relative">
                        <DatePicker
                          selected={formData.onlineTestDate ? new Date(formData.onlineTestDate) : null}
                          onChange={(date) => handleDateChange(date, 'onlineTestDate')}
                          dateFormat="dd-MM-yyyy"
                          placeholderText="Test date"
                          className="w-full p-2 pl-10 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#667eea]/50 focus:border-transparent focus:outline-none transition-all duration-200 bg-gradient-to-r from-gray-50 to-white"
                          wrapperClassName="w-full"
                        />
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={14} />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block mb-1 text-xs text-gray-600">Interview Start</label>
                        <div className="relative">
                          <DatePicker
                            selected={formData.interviewWindow.start ? new Date(formData.interviewWindow.start) : null}
                            onChange={(date) => handleInterviewDateChange(date, 'start')}
                            dateFormat="dd-MM-yyyy"
                            placeholderText="Interview start"
                            className="w-full p-2 pl-10 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#667eea]/50 focus:border-transparent focus:outline-none transition-all duration-200 bg-gradient-to-r from-gray-50 to-white"
                            wrapperClassName="w-full"
                          />
                          <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={14} />
                        </div>
                      </div>
                      <div>
                        <label className="block mb-1 text-xs text-gray-600">Interview End</label>
                        <div className="relative">
                          <DatePicker
                            selected={formData.interviewWindow.end ? new Date(formData.interviewWindow.end) : null}
                            onChange={(date) => handleInterviewDateChange(date, 'end')}
                            dateFormat="dd-MM-yyyy"
                            placeholderText="Interview end"
                            className="w-full p-2 pl-10 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#667eea]/50 focus:border-transparent focus:outline-none transition-all duration-200 bg-gradient-to-r from-gray-50 to-white"
                            wrapperClassName="w-full"
                          />
                          <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={14} />
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block mb-1 text-xs text-gray-600">Offer Rollout Date</label>
                      <div className="relative">
                        <DatePicker
                          selected={formData.offerRolloutDate ? new Date(formData.offerRolloutDate) : null}
                          onChange={(date) => handleDateChange(date, 'offerRolloutDate')}
                          dateFormat="dd-MM-yyyy"
                          placeholderText="Offer rollout"
                          className="w-full p-2 pl-10 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#667eea]/50 focus:border-transparent focus:outline-none transition-all duration-200 bg-gradient-to-r from-gray-50 to-white"
                          wrapperClassName="w-full"
                        />
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={14} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Rounds and Selection Process */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Number of Rounds */}
                  <div>
                    <label className="block mb-2 font-medium text-sm text-gray-700">Number of Rounds <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <select 
                        name="numberOfRounds" 
                        value={formData.numberOfRounds} 
                        onChange={handleChange} 
                        className="w-full p-2 text-sm border border-gray-200 rounded-lg appearance-none bg-gradient-to-r from-gray-50 to-white pr-10 focus:ring-2 focus:ring-[#667eea]/50 focus:border-transparent focus:outline-none transition-all duration-200" 
                        required
                      >
                        <option value="" disabled>Select rounds</option>
                        {numberOfRoundsOptions.map((round) => (<option key={round} value={round}>{round}</option>))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={14} />
                    </div>
                  </div>

                  {/* Process of Selection */}
                  <div ref={selectionProcessRef} className="relative">
                    <label className="block font-medium mb-2 text-sm text-gray-700">Selection Process <span className="text-red-500">*</span></label>
                    <div onClick={() => toggleDropdown('selectionProcess')} className="flex items-center justify-between p-2 w-full border border-gray-200 rounded-lg cursor-pointer hover:border-gray-300 transition-colors min-h-[38px] bg-gradient-to-r from-gray-50 to-white">
                      <span className={`text-sm ${formData.selectionProcess.length > 0 ? "text-gray-700" : "text-gray-500"}`}>
                        {formData.selectionProcess.length > 0 ? formData.selectionProcess.join(' + ') : 'Select process'}
                      </span>
                      <ChevronDown className={`w-4 h-4 transition-transform ${dropdownOpen.selectionProcess ? "rotate-180" : ""} text-gray-400`} />
                    </div>
                    {dropdownOpen.selectionProcess && (
                      <div className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-auto">
                        {processOptions.map(process => {
                          const isSelected = formData.selectionProcess.some(p =>
                            p.startsWith(process)
                          );
                        
                          return (
                            <div
                              key={process}
                              className={`px-3 py-2 border-b border-gray-100 ${
                                isSelected ? "bg-blue-50" : "hover:bg-gray-50"
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <span
                                  onClick={() => handleMultiSelect('selectionProcess', process)}
                                  className={`text-sm cursor-pointer ${
                                    isSelected
                                      ? "text-[#667eea] font-medium"
                                      : "text-gray-700"
                                  }`}
                                >
                                  {process}
                                </span>
                                
                                {isSelected && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      removeLastSelectionProcess(process);
                                    }}
                                    className="text-gray-400 hover:text-red-500 text-sm font-semibold"
                                    title="Remove last round"
                                  >
                                    ✕
                                  </button>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION 7: Contact Information */}
            <div className="pt-4 border-t border-gray-100">
              <div className="flex items-center mb-4">
                <div className="p-1.5 bg-gradient-to-br from-[#667eea]/20 to-[#764ba2]/20 rounded-lg mr-3">
                  <MessageSquare className="h-4 w-4 text-[#667eea]" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800">Contact Information</h3>
              </div>
              
              <div className="space-y-4">
                {/* Contact Person and Designation */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Contact Person */}
                  <div>
                    <label className="block mb-2 font-medium text-sm text-gray-700">Contact Person <span className="text-red-500">*</span></label>
                    <input 
                      type="text" 
                      name="name" 
                      value={formData.contactPerson.name} 
                      onChange={handleContactChange} 
                      placeholder="Full name" 
                      className="w-full p-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#667eea]/50 focus:border-transparent focus:outline-none transition-all duration-200 bg-gradient-to-r from-gray-50 to-white" 
                      required 
                    />
                  </div>

                  {/* Contact person designation */}
                  <div>
                    <label className="block mb-2 font-medium text-sm text-gray-700">Designation <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <select 
                        name="designation" 
                        value={formData.contactPerson.designation} 
                        onChange={handleContactChange} 
                        className="w-full p-2 text-sm border border-gray-200 rounded-lg appearance-none bg-gradient-to-r from-gray-50 to-white pr-10 focus:ring-2 focus:ring-[#667eea]/50 focus:border-transparent focus:outline-none transition-all duration-200" 
                        required
                      >
                        <option value="" disabled>Select designation</option>
                        {designationOptions.map((designation) => (<option key={designation} value={designation}>{designation}</option>))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={14} />
                    </div>
                  </div>
                </div>

                {/* Contact Email and Mobile */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Contact person email */}
                  <div>
                    <label className="block mb-2 font-medium text-sm text-gray-700">Email <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={14} />
                      <input 
                        type="email" 
                        name="email" 
                        value={formData.contactPerson.email} 
                        onChange={handleContactChange} 
                        placeholder="example@company.com" 
                        className="w-full p-2 pl-10 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#667eea]/50 focus:border-transparent focus:outline-none transition-all duration-200 bg-gradient-to-r from-gray-50 to-white" 
                        required 
                      />
                    </div>
                  </div>

                  {/* Contact person mobile no */}
                  <div>
                    <label className="block mb-2 font-medium text-sm text-gray-700">Mobile <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={14} />
                      <input 
                        type="tel" 
                        name="mobile" 
                        value={formData.contactPerson.mobile} 
                        onChange={handleContactChange} 
                        placeholder="10-digit number" 
                        className="w-full p-2 pl-10 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#667eea]/50 focus:border-transparent focus:outline-none transition-all duration-200 bg-gradient-to-r from-gray-50 to-white" 
                        required 
                      />
                    </div>
                  </div>
                </div>

                {/* LinkedIn and Minimum Students */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Contact person LinkedIn Profile */}
                  <div>
                    <label className="block mb-2 font-medium text-sm text-gray-700">LinkedIn Profile</label>
                    <div className="relative">
                      <Link className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={14} />
                      <input 
                        type="url" 
                        name="linkedin" 
                        value={formData.contactPerson.linkedin} 
                        onChange={handleContactChange} 
                        placeholder="linkedin.com/in/username" 
                        className="w-full p-2 pl-10 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#667eea]/50 focus:border-transparent focus:outline-none transition-all duration-200 bg-gradient-to-r from-gray-50 to-white" 
                      />
                    </div>
                  </div>

                  {/* Minimum Students to be Hired */}
                  <div>
                    <label className="block mb-2 font-medium text-sm text-gray-700">Min Students <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <select 
                        name="minStudents" 
                        value={formData.minStudents} 
                        onChange={handleChange} 
                        className="w-full p-2 text-sm border border-gray-200 rounded-lg appearance-none bg-gradient-to-r from-gray-50 to-white pr-10 focus:ring-2 focus:ring-[#667eea]/50 focus:border-transparent focus:outline-none transition-all duration-200" 
                        required
                      >
                        <option value="" disabled>Select minimum</option>
                        {minimumStudentsOptions.map((option) => (<option key={option} value={option}>{option}</option>))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={14} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Register Button */}
            <div className="flex justify-between pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => window.history.back()}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 font-medium transition-colors flex items-center"
              >
                ← Back
              </button>
              <button 
                type="submit" 
                disabled={isSubmitting} 
                className="px-6 py-2.5 text-sm bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white font-semibold rounded-lg shadow-md hover:shadow-lg hover:shadow-[#667eea]/30 focus:outline-none focus:ring-2 focus:ring-[#667eea]/50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Submitting...' : 'Register'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}