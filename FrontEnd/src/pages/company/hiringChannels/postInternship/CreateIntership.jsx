import { useState, useRef, useEffect, useMemo } from 'react';
import { ChevronDown, X, Briefcase, Calendar, Users, GraduationCap, Target, IndianRupee, Award, Clock, MessageSquare } from 'lucide-react';
import axios from '../../../../lib/axiosInstance';
import toast from 'react-hot-toast';
import { City } from 'country-state-city';
import CreatableSelect from 'react-select/creatable';
import DatePicker from 'react-datepicker';
import { getCompanyMasterDataByType, createCompanyMasterData } from "../../../../lib/Company_AxiosInstance";
import { useNavigate } from 'react-router-dom';
import { getMasterDataByType, createMasterData } from "../../../../lib/User_AxiosInstance";
export default function PostIntership() {
  const navigate = useNavigate();
  const initialState = {
    jobRoles: [],
    description: '',
    location: [],
    workMode: 'On-site',
    startDate: null,
    onlineTestDate: null,
    endDate: null,
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
     degree: [],

    broadcastType: 'Everyone'
  };

  const [formData, setFormData] = useState(initialState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [descriptionError, setDescriptionError] = useState("");

  // Add job title options array
  {/*const jobTitleOptions = [
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
  ];*/}

  const educationOptions = ["High School", "Bachelor's Degree", "Master's Degree", "PhD", "Diploma", "Other"];
  const fieldOfStudyOptions = ["Computer Science", "Engineering", "Business", "Arts", "Sciences", "Mathematics", "Medicine", "Law", "Other"];
  const durationOptions = ["1 Month", "2 Months", "3 Months", "6 Months", "1 Year", "Flexible"];
  const certificationOptions = ["AWS Certified", "Microsoft Certified", "Google Cloud Certified", "Cisco Certified", "PMP", "Other"];
  const workAuthOptions = ["Citizens Only", "Permanent Residents", "Work Visa Holders", "Any"];
  const allSkills = ["JavaScript", "React", "Vue", "Angular", "Node.js", "Python", "Java", "C++", "SQL", "MongoDB"];
  const allBenefits = ["Health Insurance", "Paid Time Off", "Mentorship Program", "Certificate of Completion", "Letter of Recommendation", "Flexible Hours"];
  const tagsOptions = ['Urgent hiring', 'Fresher preferred', 'Remote-friendly', 'Work from Home', 'Internship-eligible', 'Hybrid', 'High Priority', 'Contract', 'Part-time', 'Full-time'];

  // Define cityOptions here before any hooks that use it
  const cityOptions = useMemo(() => {
    try {
      const cities = City.getCitiesOfCountry('IN') || [];
      return cities.map(city => ({
        value: city.name,
        label: city.name,
      }));
    } catch (error) {
      console.error("Error loading cities:", error);
      return [];
    }
  }, []);

  const [customSkill, setCustomSkill] = useState('');
  const [customBenefit, setCustomBenefit] = useState('');
  const [customStream, setCustomStream] = useState('');
  // Job Roles (Company API — uses string value, no _id)
  const [jobRoleOptions, setJobRoleOptions] = useState([]);
  const [isLoadingJobRoles, setIsLoadingJobRoles] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState({
    jobRoles: false,
    skills: false,
    benefits: false,
    studentStreams: false,
    tags: false
  });
const [degreeOptions, setDegreeOptions] = useState([]);
const [streamOptions, setStreamOptions] = useState([]);
const [selectedDegreeIds, setSelectedDegreeIds] = useState([]);

const [isLoadingDegrees, setIsLoadingDegrees] = useState(false);
const [isLoadingStreams, setIsLoadingStreams] = useState(false);
  //const jobTitlesRef = useRef(null);
  const skillsRef = useRef(null);
  const benefitsRef = useRef(null);
  const studentStreamsRef = useRef(null);
  const tagsRef = useRef(null);
useEffect(() => {
  const fetchDegrees = async () => {
    setIsLoadingDegrees(true);
    try {
      const res = await getMasterDataByType("DEGREE");
      setDegreeOptions(
        res.data.data.map(item => ({
          value: item._id,
          label: item.value
        }))
      );
    } catch (err) {
      console.error("Error fetching degrees", err);
    } finally {
      setIsLoadingDegrees(false);
    }
  };

  fetchDegrees();
}, []);

useEffect(() => {
  if (selectedDegreeIds.length === 0) {
    setStreamOptions([]);
    return;
  }

  const fetchStreams = async () => {
    setIsLoadingStreams(true);

    try {
      const results = await Promise.all(
        selectedDegreeIds.map(id =>
          getMasterDataByType("STREAM", id)
        )
      );

      const merged = new Map();

      results.forEach(res =>
        res.data.data.forEach(item =>
          merged.set(item._id, {
            value: item._id,
            label: item.value
          })
        )
      );

      setStreamOptions([...merged.values()]);
    } catch (err) {
      console.error("Error fetching streams", err);
    } finally {
      setIsLoadingStreams(false);
    }
  };

  fetchStreams();
}, [selectedDegreeIds]);

  // ─── Fetch job roles on mount ──────────────────────────────────────────────
  useEffect(() => {
    const fetchJobRoles = async () => {
      setIsLoadingJobRoles(true);
      try {
        const res = await getCompanyMasterDataByType("JOB_ROLE");
        setJobRoleOptions(res.data.data.map(item => ({ value: item.value, label: item.value })));
      } catch (err) {
        console.error("Error fetching job roles", err);
      } finally {
        setIsLoadingJobRoles(false);
      }
    };
    fetchJobRoles();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      const dropdownRefs = {
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

  const handleDateChange = (date, field) => {
    setFormData(prev => ({
      ...prev,
      [field]: date
    }));
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

  // --- DYNAMIC SKILLS STATE ---
const [metaData, setMetaData] = useState([]); // All skills from DB
const [customSkillSearch, setCustomSkillSearch] = useState(""); 
const [isDropdownOpen, setIsDropdownOpen] = useState(false);

// --- FETCH FROM DATABASE ---
useEffect(() => {
  const fetchSkills = async () => {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_Backend_URL}/api/meta/get-skills`);
      const skillNames = data.map(item => item.skills);
      setMetaData(skillNames);
    } catch (err) {
      console.error("Error loading skills", err);
    }
  };
  fetchSkills();
}, []);

const filteredSkillOptions = useMemo(() => {
  return Array.isArray(metaData) ? metaData.sort() : [];
}, [metaData]);

// --- SKILL HANDLERS ---
const handleAddNewSkill = async (newSkillName) => {
  const trimmedSkill = newSkillName.trim();
  if (!trimmedSkill) return;

  try {
    const payload = { skills: trimmedSkill };
    const { data } = await axios.post(`${import.meta.env.VITE_Backend_URL}/api/meta/add-skill`, payload);

    setMetaData(prev => [...new Set([...prev, data.skills])]);
    setFormData(prev => ({
      ...prev,
      skills: [...new Set([...prev.skills, data.skills])]
    }));
    toast.success(`Skill "${data.skills}" added to global database!`);
  } catch (err) {
    if (err.response?.status === 409) toast.error("Skill already exists");
    else toast.error("Failed to add skill");
  }
};

const handleSelectOrAdd = async (skillName) => {
  const trimmed = skillName.trim();
  if (!trimmed) return;

  const existingInDb = metaData.find(s => s.toLowerCase() === trimmed.toLowerCase());

  if (existingInDb) {
    if (!formData.skills.includes(existingInDb)) {
      setFormData(prev => ({ ...prev, skills: [...prev.skills, existingInDb] }));
    }
  } else {
    await handleAddNewSkill(trimmed);
  }
  setCustomSkillSearch("");
  setIsDropdownOpen(false);
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
      jobRoles: "Job Title",
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
        broadcastType: formData.broadcastType,
        startDate: formData.startDate,
        endDate: formData.endDate,
        onlineTestDate: formData.onlineTestDate,
        studentStreams: formData.studentStreams.map(s => s.label),
degree: formData.degree.map(d => d.label),
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

  const selectStyles = {
    control: (base, state) => ({
      ...base,
      minHeight: '42px',
      borderRadius: '8px',
      fontSize: '14px',
      borderColor: state.isFocused ? '#143694' : '#e5e7eb',
      boxShadow: state.isFocused ? '0 0 0 2px rgba(102,126,234,0.25)' : 'none',
      backgroundImage: 'linear-gradient(to right, rgb(249 250 251), rgb(255 255 255))',
      '&:hover': { borderColor: '#143694' },
    }),
    menu: (base) => ({ ...base, fontSize: '14px', zIndex: 30, borderRadius: '8px', border: '1px solid #e5e7eb' }),
    multiValue: (base) => ({ ...base, backgroundColor: '#f3f4f6', borderRadius: '9999px' }),
    multiValueLabel: (base) => ({ ...base, color: '#4f46e5', fontWeight: 600, fontSize: '12px', paddingLeft: '8px' }),
    multiValueRemove: (base) => ({ ...base, color: '#143694', borderRadius: '9999px', ':hover': { backgroundColor: 'rgba(102,126,234,0.15)', color: '#4f46e5' } }),
    placeholder: (base) => ({ ...base, color: '#9ca3af', fontSize: '14px' }),
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#143694]/5 via-[#f093fb]/5 to-[#1e4ed8]/5 py-4">
        {/* <div className="container mx-auto px-4 pt-8 mb-6 max-w-4xl">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 px-6 py-5 mb-2">
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-3xl ml-1 mt-2 font-bold text-primaryBrand">Hiring Channels</h2>
            </div>
            
          </div>
        </div> */}
        <div className="container mx-auto px-4 max-w-6xl flex flex-col py-0">
          {/* Header Section - Compact */}
        
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 px-6 py-6 mt-5 mb-8">

            {/* Top Section */}
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-[#143694]/10 rounded-lg">
                <Briefcase className="h-5 w-5 text-[#143694]" />
              </div>

              <h1 className="text-xl md:text-2xl font-semibold text-[#143694] tracking-tight">
                Create Internship Opportunity
              </h1>
            </div>

            <p className="text-sm md:text-base text-gray-600 mb-4">
              Post a new internship opportunity and connect with talented students. Fill in the details below to create your internship listing.
            </p>

            {/* Tabs */}
            <div className="flex items-center gap-2 border-gray-200 pt-0">

              <button 
                onClick={() => navigate('/hiring-channels/on-campus-hiring')}
                className="px-4 py-1.5 text-gray-600 hover:text-[#1a3a8a] hover:bg-gray-100 rounded-full text-sm transition-all"
              >
                On-campus
              </button>

              <button 
                onClick={() => navigate('/hiring-channels/pool-campus-hiring')}
                className="px-4 py-1.5 text-gray-600 hover:text-[#1a3a8a] hover:bg-gray-100 rounded-full text-sm transition-all"
              >
                Pool Campus
              </button>

              <button 
                onClick={() => navigate('/hiring-channels/off-campus-hiring')}
                className="px-4 py-1.5 text-gray-600 hover:text-[#1a3a8a] hover:bg-gray-100 rounded-full text-sm transition-all"
              >
                Off-campus
              </button>

              {/* Active */}
              <button 
                className="px-4 py-1.5 bg-[#1a3a8a] text-white rounded-full text-sm font-medium shadow-sm"
              >
                Internship
              </button>

            </div>

          </div>
        

        <div className="bg-white/90 backdrop-blur-sm border border-gray-100 rounded-xl shadow p-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-[#143694] to-[#1e4ed8] bg-clip-text text-transparent">Internship Details</h2>
            <p className="text-gray-500 text-sm mt-1">Fill in the details to create your internship postings</p>
          </div>

          <form onSubmit={handlePostJob}>
            <div className="space-y-6">
              
              {/* SECTION 1: Internship Position Details */}
              <div className="pt-2">
                <div className="flex items-center mb-4">
                  <div className="p-1.5 bg-gradient-to-br from-[#143694]/20 to-[#1e4ed8]/20 rounded-lg mr-3">
                    <Briefcase className="h-4 w-4 text-[#143694]" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800">Internship Position Details</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Job Titles */}
                  <div>
                    <label className="block font-medium mb-2 text-sm text-gray-700">Job Roles</label>
                    <CreatableSelect
                      isMulti
                      isClearable
                      isLoading={isLoadingJobRoles}
                      options={jobRoleOptions}
                      value={formData.jobRoles.map(role => ({ value: role, label: role }))}
                      styles={selectStyles}
                      placeholder="Select or add job roles"
                      onChange={(selected) => {
                        setFormData(prev => ({ ...prev, jobRoles: (selected || []).map(s => s.value) }));
                      }}
                      onCreateOption={async (val) => {
                        try {
                          const res = await createCompanyMasterData({ type: "JOB_ROLE", value: val });
                          const savedValue = res.data.data.value;
                          const newOpt = { value: savedValue, label: savedValue };
                          setJobRoleOptions(prev => [...prev, newOpt]);
                          setFormData(prev => ({ ...prev, jobRoles: [...prev.jobRoles, savedValue] }));
                        } catch (err) {
                          console.error("Error creating job role", err);
                          toast.error("Could not add job role.");
                        }
                      }}
                    />
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
                          className={`flex-1 px-3 py-2 text-sm border rounded-lg transition-colors ${formData.workMode === mode ? 'bg-gradient-to-r from-[#143694] to-[#1e4ed8] text-white border-transparent' : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300'}`}
                          onClick={() => handleOptionSelect('workMode', mode)}
                        >
                          {mode}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 2: Location & Broadcasting */}
              <div className="pt-4 border-t border-gray-100">
                <div className="flex items-center mb-4">
                  <div className="p-1.5 bg-gradient-to-br from-[#143694]/20 to-[#1e4ed8]/20 rounded-lg mr-3">
                    <Target className="h-4 w-4 text-[#143694]" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800">Location & Broadcasting</h3>
                </div>
                
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
                          className="h-4 w-4 text-[#143694] border-gray-300 focus:ring-[#143694]/50"
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
                          className="h-4 w-4 text-[#143694] border-gray-300 focus:ring-[#143694]/50"
                        />
                        <span className="ml-2 text-sm text-gray-700">Broadcast by Location</span>
                      </label>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      'Broadcast by Location' shows internship only to specified locations.
                    </p>
                  </div>
                </div>
              </div>

              {/* SECTION 3: Compensation & Duration */}
              <div className="pt-4 border-t border-gray-100">
                <div className="flex items-center mb-4">
                  <div className="p-1.5 bg-gradient-to-br from-[#143694]/20 to-[#1e4ed8]/20 rounded-lg mr-3">
                    <IndianRupee className="h-4 w-4 text-[#143694]" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800">Compensation & Duration</h3>
                </div>
                
                <div className="space-y-4">
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
                            className="w-full h-full p-3 text-sm border border-gray-200 rounded-l-lg appearance-none bg-gradient-to-r from-gray-50 to-white pr-8 text-center focus:ring-2 focus:ring-[#143694]/50 focus:border-transparent focus:outline-none"
                          >
                            <option value="INR">₹ INR</option>
                            <option value="USD">$ USD</option>
                            <option value="EUR">€ EUR</option>
                          </select>
                          <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={14} />
                        </div>
                        <input
                          type="number"
                          name="amount"
                          placeholder="Enter amount"
                          className="flex-1 p-3 text-sm border border-l-0 border-gray-200 rounded-r-lg focus:ring-2 focus:ring-[#143694]/50 focus:border-transparent focus:outline-none transition-all duration-200 bg-gradient-to-r from-gray-50 to-white"
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
                        className="w-full p-3 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#143694]/50 focus:border-transparent focus:outline-none transition-all duration-200 bg-gradient-to-r from-gray-50 to-white"
                        value={formData.numberOfOpenings}
                        onChange={handleInputChange}
                        min="1"
                      />
                    </div>
                  </div>

                  {/* Internship Duration */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="internshipDuration" className="block font-medium mb-2 text-sm text-gray-700">
                        Internship Duration <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <select
                          id="internshipDuration"
                          name="internshipDuration"
                          className="w-full p-3 text-sm border border-gray-200 rounded-lg appearance-none bg-gradient-to-r from-gray-50 to-white pr-10 focus:ring-2 focus:ring-[#143694]/50 focus:border-transparent focus:outline-none transition-all duration-200"
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
                          className="w-full p-3 text-sm border border-gray-200 rounded-lg appearance-none bg-gradient-to-r from-gray-50 to-white pr-10 focus:ring-2 focus:ring-[#143694]/50 focus:border-transparent focus:outline-none transition-all duration-200"
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
                </div>
              </div>

              {/* SECTION 4: Job Description & Requirements */}
              <div className="pt-4 border-t border-gray-100">
                <div className="flex items-center mb-4">
                  <div className="p-1.5 bg-gradient-to-br from-[#143694]/20 to-[#1e4ed8]/20 rounded-lg mr-3">
                    <MessageSquare className="h-4 w-4 text-[#143694]" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800">Job Description & Requirements</h3>
                </div>
                
                <div className="space-y-4">
                  {/* Job Description */}
                  <div>
                    <label htmlFor="description" className="block font-medium mb-2 text-sm text-gray-700">
                      Job Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      placeholder="Describe the job responsibilities, day-to-day tasks, and requirements..."
                      className={`w-full p-3 text-sm border rounded-lg focus:ring-2 focus:ring-[#143694]/50 focus:border-transparent focus:outline-none transition-all duration-200 bg-gradient-to-r from-gray-50 to-white h-32 ${descriptionError ? 'border-red-300' : 'border-gray-200'}`}
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

                  {/* Eligibility Criteria */}
                  <div>
                    <label htmlFor="eligibilityCriteria" className="block font-medium mb-2 text-sm text-gray-700">
                      Eligibility Criteria <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="eligibilityCriteria"
                      name="eligibilityCriteria"
                      placeholder="e.g., Must be currently enrolled in a degree program, Minimum GPA of 3.0..."
                      className="w-full p-3 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#143694]/50 focus:border-transparent focus:outline-none transition-all duration-200 bg-gradient-to-r from-gray-50 to-white h-24"
                      value={formData.eligibilityCriteria}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 5: Timeline & Scheduling */}
              <div className="pt-4 border-t border-gray-100">
                <div className="flex items-center mb-4">
                  <div className="p-1.5 bg-gradient-to-br from-[#143694]/20 to-[#1e4ed8]/20 rounded-lg mr-3">
                    <Clock className="h-4 w-4 text-[#143694]" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800">Timeline & Scheduling</h3>
                </div>
                
                <div>
                  <label className="block mb-2 font-medium text-sm text-gray-700">
                    Internship Timeline <span className="text-red-500">*</span>
                  </label>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Internship Start Date */}
                    <div>
                      <label className="block mb-1 text-xs text-gray-600">
                        Internship Start Date
                      </label>
                      <div className="relative">
                        <DatePicker
                          selected={formData.startDate ? new Date(formData.startDate) : null}
                          onChange={(date) => handleDateChange(date, 'startDate')}
                          dateFormat="dd-MM-yyyy"
                          placeholderText="Start date"
                          className="w-full p-2 pl-10 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#143694]/50 focus:border-transparent focus:outline-none transition-all duration-200 bg-gradient-to-r from-gray-50 to-white"
                          wrapperClassName="w-full"
                        />
                        <Calendar
                          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                          size={14}
                        />
                      </div>
                    </div>
                    {/* Last date to apply */}
                    <div>
                      <label className="block mb-1 text-xs text-gray-600">
                        Last Date to Apply
                      </label>
                      <div className="relative">
                        <DatePicker
                          selected={formData.endDate ? new Date(formData.endDate) : null}
                          onChange={(date) => handleDateChange(date, 'endDate')}
                          dateFormat="dd-MM-yyyy"
                          placeholderText="Last Date to Apply"
                          className="w-full p-2 pl-10 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#143694]/50 focus:border-transparent focus:outline-none transition-all duration-200 bg-gradient-to-r from-gray-50 to-white"
                          wrapperClassName="w-full"
                        />
                        <Calendar
                          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                          size={14}
                        />
                      </div>
                    </div>
                    {/* Online Test Date */}
                    <div>
                      <label className="block mb-1 text-xs text-gray-600">
                        Online Test Date
                      </label>
                      <div className="relative">
                        <DatePicker
                          selected={formData.onlineTestDate ? new Date(formData.onlineTestDate) : null}
                          onChange={(date) => handleDateChange(date, 'onlineTestDate')}
                          dateFormat="dd-MM-yyyy"
                          placeholderText="Test date"
                          className="w-full p-2 pl-10 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#143694]/50 focus:border-transparent focus:outline-none transition-all duration-200 bg-gradient-to-r from-gray-50 to-white"
                          wrapperClassName="w-full"
                        />
                        <Calendar
                          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                          size={14}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 6: Student Eligibility & Skills */}
              <div className="pt-4 border-t border-gray-100">
                <div className="flex items-center mb-4">
                  <div className="p-1.5 bg-gradient-to-br from-[#143694]/20 to-[#1e4ed8]/20 rounded-lg mr-3">
                    <GraduationCap className="h-4 w-4 text-[#143694]" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800">Student Eligibility & Skills</h3>
                </div>
                
                <div className="space-y-4">
                  {/* Preferred Field of Study */}
                 <div>
<label className="block font-medium mb-2 text-sm text-gray-700">
Degree
</label>

<CreatableSelect
  isMulti
  isClearable
  isLoading={isLoadingDegrees}
  options={degreeOptions}
  value={formData.degree}
  styles={selectStyles}
  placeholder="Select or add degree(s)"

  onChange={(selected) => {
    const selections = selected || [];

    setFormData(prev => ({
      ...prev,
      degree: selections,
      studentStreams: []
    }));

    setSelectedDegreeIds(selections.map(s => s.value));
  }}
/>
</div>

<div>
<label className="block font-medium mb-2 text-sm text-gray-700">
Preferred Streams
</label>

<CreatableSelect
  isMulti
  isClearable
  isLoading={isLoadingStreams}
  isDisabled={formData.degree.length === 0}
  options={streamOptions}
  value={formData.studentStreams}
  styles={selectStyles}
  placeholder={
    formData.degree.length === 0
      ? "Select degree first"
      : "Select streams"
  }

  onChange={(selected) => {
    setFormData(prev => ({
      ...prev,
      studentStreams: selected || []
    }));
  }}
/>
</div>

                  {/* Skills and Benefits */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Skills */}
                   {/* --- INTEGRATED SKILLS SECTION --- */}
<div ref={skillsRef} className="relative pt-2">
  <label className="block font-semibold mb-2 text-sm text-gray-700 flex items-center gap-2">
    <Award className="w-4 h-4 text-[#143694]" />
    Required Skills <span className="text-red-500">*</span>
  </label>

  <div className={`
    group flex flex-wrap gap-2 p-2.5 min-h-[48px] 
    bg-gradient-to-r from-gray-50 to-white 
    border rounded-xl transition-all duration-300
    ${isDropdownOpen ? 'border-[#143694] ring-2 ring-[#143694]/10 shadow-sm' : 'border-gray-200 hover:border-gray-300'}
  `}>
    {/* Selected Tags */}
    {formData.skills.map((skill) => (
      <div 
        key={skill} 
        className="flex items-center gap-1.5 px-3 py-1 bg-white border border-[#143694]/20 text-[#143694] text-xs font-bold rounded-full shadow-sm animate-in fade-in zoom-in duration-200"
      >
        {skill}
        <button 
          type="button" 
          onClick={() => removeSelectedItem('skills', skill)} 
          className="hover:bg-red-50 p-0.5 rounded-full transition-colors"
        >
          <X size={12} className="text-gray-400 hover:text-red-500" />
        </button>
      </div>
    ))}

    <input
      type="text"
      className="flex-grow min-w-[140px] outline-none bg-transparent text-sm text-gray-800 placeholder:text-gray-400"
      placeholder={formData.skills.length === 0 ? "Search or add skills (e.g. React, Python)..." : "Add more..."}
      value={customSkillSearch}
      onFocus={() => setIsDropdownOpen(true)}
      onChange={(e) => setCustomSkillSearch(e.target.value)}
    />
  </div>

  {/* Unified Dropdown Menu */}
  {isDropdownOpen && (
    <div className="absolute z-50 w-full mt-2 bg-white border border-gray-100 rounded-xl shadow-2xl overflow-hidden animate-in slide-in-from-top-2 duration-200">
      <div className="max-h-64 overflow-y-auto">
        
        {/* 1. Results from Database */}
        {filteredSkillOptions
          .filter(s => 
            s.toLowerCase().includes(customSkillSearch.toLowerCase()) && 
            !formData.skills.includes(s)
          )
          .map((skill, index) => (
            <button
              key={index}
              type="button"
              className="w-full text-left px-5 py-3 hover:bg-[#143694]/5 text-sm text-gray-700 transition-colors flex items-center justify-between group/item"
              onClick={() => handleSelectOrAdd(skill)}
            >
              <span>{skill}</span>
              <ChevronDown className="w-3 h-3 text-gray-300 group-hover/item:text-[#143694] -rotate-90" />
            </button>
          ))}

        {/* 2. "Add New" button - Shows if search string is new */}
        {customSkillSearch && !filteredSkillOptions.some(s => s.toLowerCase() === customSkillSearch.toLowerCase()) && (
          <button
            type="button"
            className="w-full text-left px-5 py-4 bg-[#143694]/5 text-[#143694] text-sm font-bold hover:bg-[#143694]/10 transition-all border-t border-[#143694]/10"
            onClick={() => handleSelectOrAdd(customSkillSearch)}
          >
            <div className="flex items-center gap-3">
              <div className="p-1.5 bg-white rounded-lg shadow-sm">
                <Target size={16} className="text-[#1e4ed8]" />
              </div>
              <span>Add "<span className="underline italic">{customSkillSearch}</span>" as a new skill</span>
            </div>
          </button>
        )}

        {customSkillSearch === "" && filteredSkillOptions.length === 0 && (
          <div className="px-5 py-8 text-center text-gray-400 text-xs italic">
            Start typing to search or add skills...
          </div>
        )}
      </div>
    </div>
  )}
</div>

                    {/* Benefits */}
                    <div ref={benefitsRef} className="relative">
                      <label className="block font-medium mb-2 text-sm text-gray-700">Benefits</label>
                      
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
                                className="flex-1 p-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#143694]/50 focus:outline-none"
                              />
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleCustomAdd('benefits', customBenefit, setCustomBenefit);
                                }}
                                className="px-4 py-2 bg-gradient-to-r from-[#143694] to-[#1e4ed8] text-white rounded-lg text-xs font-bold whitespace-nowrap"
                              >
                                Add
                              </button>
                            </div>
                          </div>
                          
                          <div className="overflow-y-auto max-h-48">
                            {allBenefits.map((benefit, index) => (
                              <div
                                key={index}
                                onClick={() => handleMultiSelect('benefits', benefit)}
                                className={`px-3 py-2.5 hover:bg-gray-50 cursor-pointer border-b border-gray-100 flex items-center justify-between ${
                                  formData.benefits.includes(benefit) ? "bg-blue-50/50" : ""
                                }`}
                              >
                                <span className={`text-sm ${formData.benefits.includes(benefit) ? "text-[#143694] font-semibold" : "text-gray-700"}`}>
                                  {benefit}
                                </span>
                                {formData.benefits.includes(benefit) && <span className="text-[#143694] font-bold">✓</span>}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 7: Additional Information & Tags */}
              <div className="pt-4 border-t border-gray-100">
                <div className="flex items-center mb-4">
                  <div className="p-1.5 bg-gradient-to-br from-[#143694]/20 to-[#1e4ed8]/20 rounded-lg mr-3">
                    <Award className="h-4 w-4 text-[#143694]" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800">Additional Information & Tags</h3>
                </div>
                
                <div className="space-y-4">
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
                          className="w-full p-3 text-sm border border-gray-200 rounded-lg appearance-none bg-gradient-to-r from-gray-50 to-white pr-10 focus:ring-2 focus:ring-[#143694]/50 focus:border-transparent focus:outline-none transition-all duration-200"
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
                    {/* <div>
                      <label htmlFor="workAuthorization" className="block font-medium mb-2 text-sm text-gray-700">
                        Work Authorization Requirement
                      </label>
                      <div className="relative">
                        <select
                          id="workAuthorization"
                          name="workAuthorization"
                          className="w-full p-3 text-sm border border-gray-200 rounded-lg appearance-none bg-gradient-to-r from-gray-50 to-white pr-10 focus:ring-2 focus:ring-[#143694]/50 focus:border-transparent focus:outline-none transition-all duration-200"
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
                    </div> */}
                  </div>

                  {/* Tags */}
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
                              <span className={`text-sm ${formData.tags.includes(tag) ? "text-[#143694] font-medium" : "text-gray-700"}`}>
                                {tag}
                              </span>
                              {formData.tags.includes(tag) && <span className="text-[#143694]">✓</span>}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between pt-6 border-t border-gray-200">
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
                  className="px-6 py-2.5 text-sm bg-gradient-to-r from-[#143694] to-[#1e4ed8] text-white font-semibold rounded-lg shadow-md hover:shadow-lg hover:shadow-[#143694]/30 focus:outline-none focus:ring-2 focus:ring-[#143694]/50 transition-all duration-200 disabled:opacity-50"
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