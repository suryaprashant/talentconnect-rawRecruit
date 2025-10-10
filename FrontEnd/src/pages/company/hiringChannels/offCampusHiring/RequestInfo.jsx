// OffCampusHiringForm.jsx

import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { ChevronDown, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { City } from 'country-state-city';

export default function OffCampusHiringForm({ onBackClick }) {
  // --- Data for Dropdowns ---
  const locations = ['Online', 'Bangalore', 'Mumbai', 'Delhi', 'Hyderabad', 'Chennai', 'Pune', 'Kolkata', 'Ahmedabad', 'Jaipur', 'Other'];

  // --- NEW: Mapping of degrees to their relevant student streams ---
  const degreeStreamMapping = {
    "Bachelor of Technology (B.Tech)": ['Computer Science', 'Information Technology', 'Electronics', 'Mechanical', 'Civil', 'Electrical', 'Chemical', 'Aerospace', 'Automobile', 'Biotechnology', 'Other'],
    "Bachelor of Engineering (BE)": ['Computer Science', 'Information Technology', 'Electronics', 'Mechanical', 'Civil', 'Electrical', 'Chemical', 'Aerospace', 'Automobile', 'Biotechnology', 'Other'],
    "Master of Technology (M.Tech)": ['Computer Science', 'Information Technology', 'Electronics', 'Mechanical', 'Civil', 'Electrical', 'Chemical', 'Aerospace', 'Automobile', 'Biotechnology', 'Other'],
    "Master of Engineering (ME)": ['Computer Science', 'Information Technology', 'Electronics', 'Mechanical', 'Civil', 'Electrical', 'Chemical', 'Aerospace', 'Automobile', 'Biotechnology', 'Other'],
    "Master of Business Administration (MBA)": ['Marketing', 'Finance', 'Human Resources', 'Operations', 'IT & Systems', 'International Business', 'Other'],
    "Bachelor of Business Administration (BBA)": ['Marketing', 'Finance', 'Human Resources', 'General Management', 'Other'],
    "Bachelor of Commerce (B.Com)": ['Accounting', 'Finance', 'Taxation', 'Economics', 'Other'],
    "Master of Commerce (M.Com)": ['Accounting', 'Finance', 'Taxation', 'Economics', 'Other'],
    "Bachelor of Science (B.Sc)": ['Physics', 'Chemistry', 'Mathematics', 'Biology', 'Computer Science', 'Statistics', 'Other'],
    "Master of Science (M.Sc)": ['Physics', 'Chemistry', 'Mathematics', 'Biology', 'Computer Science', 'Statistics', 'Other'],
    "Bachelor of Computer Applications (BCA)": ['Computer Applications', 'Software Development', 'Data Science', 'Other'],
    "Master of Computer Applications (MCA)": ['Computer Applications', 'Software Development', 'Data Science', 'Other'],
    "Bachelor of Arts (BA)": ['History', 'Political Science', 'Sociology', 'English Literature', 'Economics', 'Psychology', 'Other'],
    "Master of Arts (MA)": ['History', 'Political Science', 'Sociology', 'English Literature', 'Economics', 'Psychology', 'Other'],
    "Doctor of Philosophy (PhD)": ['Computer Science', 'Electronics', 'Mechanical', 'Civil', 'Electrical', 'Information Technology', 'Biotechnology', 'Chemical', 'Aerospace', 'Automobile', 'MBA', 'BBA', 'B.Com', 'B.Sc', 'BA', 'B.Tech', 'M.Tech', 'PhD', 'Other'],
    "Post Doctorate": ['Computer Science', 'Electronics', 'Mechanical', 'Civil', 'Electrical', 'Information Technology', 'Biotechnology', 'Chemical', 'Aerospace', 'Automobile', 'MBA', 'BBA', 'B.Com', 'B.Sc', 'BA', 'B.Tech', 'M.Tech', 'PhD', 'Other'],
    "High School / Diploma": ["All Streams", "Science", "Commerce", "Arts", "Vocational"],
    "Associate Degree": ["All Streams", "Technical", "Business", "Healthcare"],
    "Other": ["Other"]
  };
  
  const jobRoles = ['Software Developer', 'Data Scientist', 'DevOps Engineer', 'QA Engineer', 'Frontend Developer', 'Backend Developer', 'Full Stack Developer', 'Mobile App Developer', 'UI/UX Designer', 'Product Manager', 'Business Analyst', 'Data Analyst', 'Machine Learning Engineer', 'Cloud Architect', 'Network Engineer', 'Cyber Security Specialist', 'Technical Writer', 'Sales Engineer', 'Marketing Specialist', 'HR Recruiter', 'Finance Analyst', 'Other'];
  const skillsOptions = ['JavaScript', 'Python', 'Java', 'React', 'Node.js', 'HTML/CSS', 'SQL', 'MongoDB', 'AWS', 'Docker', 'Kubernetes', 'Machine Learning', 'Data Structures', 'Algorithms', 'Git', 'REST APIs'];
  const benefitsOptions = ['Health Insurance', 'Provident Fund (PF)', 'Paid Time Off (PTO)', 'Work from Home', 'Performance Bonus', 'Stock Options'];
  const numberOfRoundsOptions = ['1', '2', '3', '4', '5', '6+'];
  const processOptions = [ 'Online Test',
    'Coding Test',
    'Aptitude Test',
    'Group Discussion',
    'Technical Interview',
    'HR Interview',
    'Case Study',
    'Presentation'].map(option =>`${option}`).sort((a, b) => a.localeCompare(b));
  const designationOptions = ['HR Manager', 'Technical Recruiter', 'Talent Acquisition', 'Hiring Manager', 'Team Lead', 'Department Head', 'CEO', 'CTO', 'Founder', 'Other'];
  const minStudentsOptions = ['1-10', '11-25', '26-50', '51-100', '101-200', '201-500', '500+'];
  const degrees = Object.keys(degreeStreamMapping).sort();

  // --- Component State and Logic ---
  const initialState = {
    venue: '',
    degree: '',
    studentStreams: [],
    eligibilityCriteria: '',
    description: '',
    minPackage: { currency: 'INR', amount: '' },
    workLocations: [],
    jobRoles: [],
    workMode: [],
    employmentType: [],
    skills: [],
    benefits: [],
    placementStartDate: '',
    placementEndDate: '',
    numberOfRounds: '',
    selectionProcess: [],
    contactPerson: { name: '', designation: '', email: '', mobile: '', linkedin: '' },
    minStudents: '',
  };

  const [formData, setFormData] = useState(initialState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [indianCities, setIndianCities] = useState([]);
  const [workLocationSearch, setWorkLocationSearch] = useState('');

  const [dropdownOpen, setDropdownOpen] = useState({
    studentStreams: false,
    skills: false,
    benefits: false,
    jobRoles: false,
    workLocations: false,
    selectionProcess: false,
  });

  const studentStreamsRef = useRef(null);
  const skillsRef = useRef(null);
  const benefitsRef = useRef(null);
  const jobRolesRef = useRef(null);
  const workLocationsRef = useRef(null);
  const selectionProcessRef = useRef(null);
  
  useEffect(() => {
    const citiesOfIndia = City.getCitiesOfCountry('IN').sort((a, b) => a.name.localeCompare(b.name));
    setIndianCities(citiesOfIndia);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      const refs = [studentStreamsRef, skillsRef, benefitsRef, jobRolesRef, workLocationsRef, selectionProcessRef];
      const dropdownKeys = ['studentStreams', 'skills', 'benefits', 'jobRoles', 'workLocations', 'selectionProcess'];

      refs.forEach((ref, index) => {
        if (ref.current && !ref.current.contains(event.target)) {
          setDropdownOpen(prev => ({ ...prev, [dropdownKeys[index]]: false }));
        }
      });
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // --- NEW: useEffect to reset studentStreams when degree changes ---
  useEffect(() => {
    setFormData(prev => ({ ...prev, studentStreams: [] }));
    setDropdownOpen(prev => ({ ...prev, studentStreams: false })); // Close dropdown on degree change
  }, [formData.degree]);

  const handleChange = (e) => {
    const { name, value } = e.target;
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
      // Create a new state object with all dropdowns closed
      const newState = Object.keys(prev).reduce((acc, key) => {
        acc[key] = false;
        return acc;
      }, {});
      // If the clicked dropdown wasn't open, open it
      if (!wasOpen) {
        newState[dropdown] = true;
      }
      return newState;
    });
  };

  const handlePackageChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, minPackage: { ...formData.minPackage, [name]: value } });
  };

  const handleContactChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, contactPerson: { ...formData.contactPerson, [name]: value } });
  };



  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const fieldsToValidate = [
      { key: 'studentStreams', name: 'Student Stream' },
      { key: 'skills', name: 'Skills' },
      { key: 'benefits', name: 'Benefits Offered' },
      { key: 'workMode', name: 'Work Mode' },
      { key: 'employmentType', name: 'Employment Type' },
      { key: 'jobRoles', name: 'Job Role' },
      { key: 'workLocations', name: 'Work Location' },
      { key: 'selectionProcess', name: 'Process of Selection' },
    ];

    for (const field of fieldsToValidate) {
      if (formData[field.key].length === 0) {
        const errorMsg = `Please make a selection for "${field.name}". This field is required.`;
        setError(errorMsg);
        toast.error(errorMsg);
        return;
      }
    }

    setIsSubmitting(true);

    try {
      const token = localStorage.getItem('token') || document.cookie.split('; ').find(row => row.startsWith('jwt='))?.split('=')[1];

      const submissionData = {
        venue: formData.venue,
        degree: formData.degree,
        studentStreams: formData.studentStreams,
        eligibilityCriteria: formData.eligibilityCriteria,
        description: formData.description,
        minPackage: {
          currency: formData.minPackage.currency,
          amount: parseFloat(formData.minPackage.amount)
        },
        location: formData.workLocations,
        jobRoles: formData.jobRoles,
        workMode: formData.workMode,
        employmentType: formData.employmentType,
        skills: formData.skills,
        benefits: formData.benefits,
        startDate: formData.placementStartDate,
        endDate: formData.placementEndDate,
        rounds: formData.numberOfRounds ? [formData.numberOfRounds] : [],
        selectionProcess: formData.selectionProcess.join(' + '),
        contactPerson: formData.contactPerson,
        minimumStudents: formData.minStudents,
        jobType: "Off-campus",
      };

      const response = await axios.post(`${import.meta.env.VITE_Backend_URL}/api/hiring-channels/off-campus`, submissionData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        withCredentials: true,
      }
      );

      if (response.status === 201) {
        toast.success('Off-campus job posted');
        setTimeout(() => {
          toast.success('This job will expire after 15 days');
        }, 2000);
        setFormData(initialState);
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.response?.data?.error || 'Failed to submit form. Please try again.';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredCities = indianCities.filter(city =>
    city.name.toLowerCase().includes(workLocationSearch.toLowerCase())
  );
  
  // Get available streams based on selected degree
  const availableStreams = degreeStreamMapping[formData.degree] || [];

  return (
    <div className="max-w-4xl mx-auto p-4 font-sans">
      <div className="flex flex-col md:flex-row justify-between mb-8">
        <div className="md-w-1/2">
          <h1 className="text-3xl font-bold mb-2">OffCampus Access:</h1>
          <h2 className="text-3xl font-bold mb-4">Hire Beyond Boundaries</h2>
        </div>
        <div className="md:w-1/2">
          <p className="text-sm">
           Reach top talent across cities, domains, and institutions—without stepping on campus. OffCampus Access helps companies connect with graduates and job seekers outside the traditional college setting.
          </p>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      <div className="bg-white p-8 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-4">Register for Off-Campus Hiring</h2>
        <p className="text-center text-gray-500 mb-6">Fill in the details below to register for the hiring drive.</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block mb-1 font-medium">Off-Campus Hiring Venue <span className="text-red-500">*</span></label>
            <div className="relative">
              <select name="venue" value={formData.venue} onChange={handleChange} className="w-full p-2 border rounded appearance-none pr-8 bg-white" required>
                <option value="" disabled>Select venue</option>
                {locations.map((location) => (<option key={location} value={location}>{location}</option>))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none"><ChevronDown className="w-4 h-4 text-gray-400" /></div>
            </div>
          </div>

          <div>
            <label className="block mb-1 font-medium">
              Degree <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                name="degree"
                value={formData.degree}
                onChange={handleChange}
                className="w-full p-2 border rounded appearance-none pr-8 bg-white"
                required
              >
                <option value="" disabled>
                  Select degree
                </option>
                {degrees.map((degree) => (
                  <option key={degree} value={degree}>
                    {degree}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </div>
            </div>
          </div>

          {/* --- MODIFIED: Dynamic Student Stream Dropdown --- */}
          <div ref={studentStreamsRef} className="relative">
            <label className="block font-medium mb-2">Student Stream <span className="text-red-500">*</span></label>
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.studentStreams.map(stream => (
                <div key={stream} className="flex items-center bg-gray-200 text-sm px-3 py-1 rounded-full">
                  <span>{stream}</span>
                  <button type="button" onClick={() => removeSelectedItem('studentStreams', stream)} className="ml-2 text-gray-600 hover:text-black"><X size={14} /></button>
                </div>
              ))}
            </div>
            <div
              onClick={() => formData.degree && toggleDropdown('studentStreams')}
              className={`flex items-center justify-between p-2 w-full border rounded-md ${formData.degree ? 'cursor-pointer hover:border-gray-400 border-gray-300' : 'bg-gray-100 cursor-not-allowed border-gray-200'}`}
            >
              <span className={formData.studentStreams.length > 0 ? "text-black" : "text-gray-500"}>
                {!formData.degree
                  ? 'Please select a degree first'
                  : formData.studentStreams.length > 0
                    ? `${formData.studentStreams.length} stream(s) selected`
                    : 'Select streams'}
              </span>
              <ChevronDown className={`w-5 h-5 transition-transform ${dropdownOpen.studentStreams ? "rotate-180" : ""}`} />
            </div>
            {dropdownOpen.studentStreams && formData.degree && (
              <div className="absolute z-20 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                {availableStreams.map(stream => (
                  <div key={stream} onClick={() => handleMultiSelect('studentStreams', stream)} className={`px-4 py-2 hover:bg-gray-100 cursor-pointer ${formData.studentStreams.includes(stream) ? "bg-gray-100 font-medium" : ""}`}>
                    {stream}
                    {formData.studentStreams.includes(stream) && <span className="float-right text-gray-500">✓</span>}
                  </div>
                ))}
              </div>
            )}
          </div>


          <div>
            <label className="block mb-1 font-medium">Eligibility Criteria <span className="text-red-500">*</span></label>
            <textarea name="eligibilityCriteria" value={formData.eligibilityCriteria} onChange={handleChange} placeholder="Example: Minimum 60% aggregate, No active backlogs..." className="w-full p-2 border rounded resize-none h-24" required></textarea>
          </div>

          <div>
            <label className="block mb-1 font-medium">Job Description <span className="text-red-500">*</span></label>
            <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Provide a detailed job description..." className="w-full p-2 border rounded resize-none h-24" required></textarea>
          </div>

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
                {skillsOptions.map(skill => (
                  <div key={skill} onClick={() => handleMultiSelect('skills', skill)} className={`px-4 py-2 hover:bg-gray-100 cursor-pointer ${formData.skills.includes(skill) ? "bg-gray-100 font-medium" : ""}`}>
                    {skill}
                    {formData.skills.includes(skill) && <span className="float-right text-gray-500">✓</span>}
                  </div>
                ))}
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

          <div>
            <label className="block mb-1 font-medium">Minimum Package Offered <span className="text-red-500">*</span></label>
            <div className="flex">
              <div className="relative">
                <select name="currency" value={formData.minPackage.currency} onChange={handlePackageChange} className="py-2 px-3 border rounded-l bg-white">
                  <option value="INR">INR</option>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                </select>
              </div>
              <input type="number" name="amount" value={formData.minPackage.amount} onChange={handlePackageChange} placeholder="Enter amount (e.g. 500000)" className="flex-grow p-2 border border-l-0 rounded-r" required />
            </div>
          </div>
          
          <div ref={workLocationsRef} className="relative">
            <label className="block font-medium mb-2">Work Location <span className="text-red-500">*</span></label>
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.workLocations.map(loc => (
                <div key={loc} className="flex items-center bg-gray-200 text-sm px-3 py-1 rounded-full">
                  <span>{loc}</span>
                  <button type="button" onClick={() => removeSelectedItem('workLocations', loc)} className="ml-2 text-gray-600 hover:text-black"><X size={14} /></button>
                </div>
              ))}
            </div>
            <div onClick={() => toggleDropdown('workLocations')} className="flex items-center justify-between p-2 w-full border border-gray-300 rounded-md cursor-pointer hover:border-gray-400">
              <span className="text-gray-500">Select work locations</span>
              <ChevronDown className={`w-5 h-5 transition-transform ${dropdownOpen.workLocations ? "rotate-180" : ""}`} />
            </div>
            {dropdownOpen.workLocations && (
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
                  {filteredCities.map(city => (
                    <div
                      key={`${city.name}-${city.stateCode}`}
                      onClick={() => handleMultiSelect('workLocations', city.name)}
                      className={`px-4 py-2 hover:bg-gray-100 cursor-pointer ${formData.workLocations.includes(city.name) ? "bg-gray-100 font-medium" : ""}`}
                    >
                      {city.name}
                      {formData.workLocations.includes(city.name) && <span className="float-right text-gray-500">✓</span>}
                    </div>
                  ))}
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
                {jobRoles.map(role => (
                  <div key={role} onClick={() => handleMultiSelect('jobRoles', role)} className={`px-4 py-2 hover:bg-gray-100 cursor-pointer ${formData.jobRoles.includes(role) ? "bg-gray-100 font-medium" : ""}`}>
                    {role}
                    {formData.jobRoles.includes(role) && <span className="float-right text-gray-500">✓</span>}
                  </div>
                ))}
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
            <label className="block mb-1 font-medium">Tentative Date of Placement / Hiring <span className="text-red-500">*</span></label>
            <div className="flex space-x-2">
              <div className="w-1/2 mt-3"><label className="block text-xs mb-1 ml-2 font-medium">Start Date</label><div className="relative"><input type="date" name="placementStartDate" value={formData.placementStartDate} onChange={handleChange} className="w-full p-2 border rounded" required /></div></div>
              <div className="w-1/2 mt-3"><label className="block text-xs mb-1 ml-2 font-medium">End Date</label><div className="relative"><input type="date" name="placementEndDate" value={formData.placementEndDate} onChange={handleChange} className="w-full p-2 border rounded" required /></div></div>
            </div>
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
            <div
              onClick={() => toggleDropdown('selectionProcess')}
              className="flex items-center justify-between p-2 w-full border border-gray-300 rounded-md cursor-pointer hover:border-gray-400 min-h-[42px]"
            >
              <span className={formData.selectionProcess.length > 0 ? "text-black" : "text-gray-500"}>
                {formData.selectionProcess.length > 0
                  ? formData.selectionProcess.join(' + ')
                  : 'Select process'}
              </span>
              <ChevronDown className={`w-5 h-5 transition-transform ${dropdownOpen.selectionProcess ? "rotate-180" : ""}`} />
            </div>
            {dropdownOpen.selectionProcess && (
              <div className="absolute z-20 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                {processOptions.map(process => (
                  <div
                    key={process}
                    onClick={() => handleMultiSelect('selectionProcess', process)}
                    className={`px-4 py-2 hover:bg-gray-100 cursor-pointer ${formData.selectionProcess.includes(process) ? "bg-gray-100 font-medium" : ""}`}
                  >
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
                {minStudentsOptions.map((option) => (<option key={option} value={option}>{option}</option>))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none"><ChevronDown className="w-4 h-4 text-gray-400" /></div>
            </div>
          </div>

          <div className="flex justify-between mt-6">
            <button
              type="button"
              onClick={onBackClick}
              className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
            >
              ← Back
            </button>
            <button type="submit" disabled={isSubmitting} className="px-6 py-2 bg-black text-white font-medium rounded hover:bg-gray-800 transition-colors disabled:opacity-50">
              {isSubmitting ? 'Submitting...' : 'Register'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}