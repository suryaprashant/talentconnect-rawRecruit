import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { ChevronDown, Mail, Phone, Link, X } from 'lucide-react';

export default function RequestInfo() {
  
  const degreeOptions = [
    'Associate Degree',
    'Bachelor of Arts (B.A.)',
    'Bachelor of Science (B.Sc.)',
    'Bachelor of Commerce (B.Com)',
    'Bachelor of Engineering (B.E.)',
    'Bachelor of Technology (B.Tech)',
    'Bachelor of Business Administration (BBA)',
    'Master of Arts (M.A.)',
    'Master of Science (M.Sc.)',
    'Master of Commerce (M.Com)',
    'Master of Business Administration (MBA)',
    'Master of Technology (M.Tech)',
    'Doctor of Philosophy (PhD)',
    'Postgraduate Diploma',
  ];

  const streamOptions = [
    'Computer Science', 'Electrical Engineering', 'Mechanical Engineering',
    'Civil Engineering', 'Information Technology', 'Electronics & Communication',
    'Chemical Engineering', 'Biotechnology', 'Aerospace Engineering', 'Data Science'
  ];

  const locationOptions = [
     'Bangalore', 'Mumbai', 'Delhi NCR', 'Hyderabad',
    'Chennai', 'Pune', 'Kolkata', 'Ahmedabad', 'Gurgaon', 'Noida'
  ];

  const jobRoleOptions = [
    'Software Engineer', 'Data Analyst', 'DevOps Engineer', 'UX/UI Designer',
    'Product Manager', 'QA Engineer', 'System Administrator', 'Network Engineer',
    'Business Analyst', 'Machine Learning Engineer'
  ];

  const skillsOptions = [
    'JavaScript', 'Python', 'Java', 'React', 'Node.js', 
    'HTML/CSS', 'SQL', 'MongoDB', 'AWS', 'Docker', 
    'Kubernetes', 'Machine Learning', 'Data Structures', 
    'Algorithms', 'Git', 'REST APIs'
  ];

  const roundsOptions = [
    '1 Round', '2 Rounds', '3 Rounds', '4 Rounds', 
    '5 Rounds', '6 Rounds', '7+ Rounds'
  ];

  const processOptions = [
    'Online Test + Interview',
    'Coding Test + Technical Interview',
    'Aptitude Test + Group Discussion + Interview',
    'Technical Interview + HR Interview',
    'Case Study + Presentation + Interview'
  ];

  const designationOptions = [
    'HR Manager', 'Talent Acquisition Specialist', 'Recruitment Lead',
    'Campus Relations Manager', 'Technical Recruiter'
  ];

  const minStudentsOptions = [
    '1-5 students', '6-10 students', '11-20 students',
    '21-50 students', '51-100 students', '100+ students'
  ];

  const amenitiesOptions = [
    'Projector', 'Auditorium', 'Interview Rooms', 'Wi-Fi Access', 'Refreshments', 'Parking'
  ];

  const benefitsOptions = [
    'Health Insurance', 'Provident Fund (PF)', 'Paid Time Off (PTO)', 'Work from Home', 'Performance Bonus', 'Stock Options'
  ];
  
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
    description :'' ,
    amenitiesRequired: [],
    benefits: []
  };
  
  const [formData, setFormData] = useState(initialData);
  const [currency, setCurrency] = useState('INR');
  
  const [dropdownOpen, setDropdownOpen] = useState({
    stream: false,
    preferredLocations: false,
    jobRoles: false,
    skills: false,
    amenities: false,
    benefits: false
  });

  const streamRef = useRef(null);
  const preferredLocationsRef = useRef(null);
  const jobRolesRef = useRef(null);
  const skillsRef = useRef(null);
  const amenitiesRef = useRef(null);
  const benefitsRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (streamRef.current && !streamRef.current.contains(event.target)) {
        setDropdownOpen(prev => ({ ...prev, stream: false }));
      }
      if (preferredLocationsRef.current && !preferredLocationsRef.current.contains(event.target)) {
        setDropdownOpen(prev => ({ ...prev, preferredLocations: false }));
      }
      if (jobRolesRef.current && !jobRolesRef.current.contains(event.target)) {
        setDropdownOpen(prev => ({ ...prev, jobRoles: false }));
      }
      if (skillsRef.current && !skillsRef.current.contains(event.target)) {
        setDropdownOpen(prev => ({ ...prev, skills: false }));
      }
      if (amenitiesRef.current && !amenitiesRef.current.contains(event.target)) {
        setDropdownOpen(prev => ({ ...prev, amenities: false }));
      }
      if (benefitsRef.current && !benefitsRef.current.contains(event.target)) {
        setDropdownOpen(prev => ({ ...prev, benefits: false }));
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
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
      stream: false,
      preferredLocations: false,
      jobRoles: false,
      skills: false,
      amenities: false,
      benefits: false,
      [dropdown]: !prev[dropdown]
    }));
  };

  const handleSubmit = async () => {
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
        selectionProcess: formData.selectionProcess,
        contactPerson: {
          name: formData.contactPersonName,
          designation: formData.contactDesignation,
          email: formData.email,
          mobile: formData.mobile,
          linkedin: formData.linkedin,
        },
        minimumStudents: formData.minimumStudents,
        eligibilityCriteria: formData.eligibilityCriteria,
        description : formData.description ,
        amenitiesRequired: formData.amenitiesRequired,
        benefits: formData.benefits,
        jobType: 'On-campus',
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
        alert('Form submitted successfully!');
        setFormData(initialData);
        setCurrency('INR');
      }
    } catch (err) {
      console.error(err);
      if (err.response) {
        alert(`Submission failed: ${err.response.data.message || err.response.data.error}`);
      } else if (err.request) {
        alert('Submission failed: No response from server.');
      } else {
        alert(`An error occurred: ${err.message}`);
      }
    }
  };

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
        <p className="text-gray-500 mt-2">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
      </div>

      {/* Form */}
      <div className="space-y-6">
        {/* Degree */}
        <div>
          <label htmlFor="degree" className="block mb-2 font-medium">Degree</label>
          <div className="relative">
            <select
              id="degree"
              name="degree"
              className="w-full p-2 border border-gray-300 rounded appearance-none bg-white pr-10"
              value={formData.degree}
              onChange={handleInputChange}
            >
              <option value="" disabled>Select degree</option>
              {degreeOptions.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          </div>
        </div>

        {/* Stream */}
        <div ref={streamRef} className="relative">
          <label className="block font-medium mb-2">Stream</label>
          <div className="flex flex-wrap gap-2 mb-2">
            {formData.stream.map(stream => (
              <div key={stream} className="flex items-center bg-gray-200 text-sm px-3 py-1 rounded-full">
                <span>{stream}</span>
                <button
                  type="button"
                  onClick={() => removeSelectedItem('stream', stream)}
                  className="ml-2 text-gray-600 hover:text-black"
                ><X size={14} /></button>
              </div>
            ))}
          </div>
          <div
            className="flex items-center justify-between p-2 w-full border border-gray-300 rounded-md cursor-pointer hover:border-gray-400"
            onClick={() => toggleDropdown('stream')}
          >
            <span className="text-gray-500">Select stream</span>
            <ChevronDown className={`w-5 h-5 transition-transform ${dropdownOpen.stream ? "rotate-180" : ""}`} />
          </div>
          {dropdownOpen.stream && (
            <div className="absolute z-20 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
              {streamOptions.map(stream => (
                <div
                  key={stream}
                  onClick={() => handleMultiSelect('stream', stream)}
                  className={`px-4 py-2 hover:bg-gray-100 cursor-pointer ${formData.stream.includes(stream) ? "bg-gray-100 font-medium" : ""}`}
                >
                  {stream}
                  {formData.stream.includes(stream) && <span className="float-right text-gray-500">✓</span>}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Preferred Hiring Locations */}
        <div ref={preferredLocationsRef} className="relative">
          <label className="block font-medium mb-2">Preferred Hiring Locations</label>
          <div className="flex flex-wrap gap-2 mb-2">
            {formData.preferredLocations.map(location => (
              <div key={location} className="flex items-center bg-gray-200 text-sm px-3 py-1 rounded-full">
                <span>{location}</span>
                <button
                  type="button"
                  onClick={() => removeSelectedItem('preferredLocations', location)}
                  className="ml-2 text-gray-600 hover:text-black"
                ><X size={14} /></button>
              </div>
            ))}
          </div>
          <div
            className="flex items-center justify-between p-2 w-full border border-gray-300 rounded-md cursor-pointer hover:border-gray-400"
            onClick={() => toggleDropdown('preferredLocations')}
          >
            <span className="text-gray-500">Select location</span>
            <ChevronDown className={`w-5 h-5 transition-transform ${dropdownOpen.preferredLocations ? "rotate-180" : ""}`} />
          </div>
          {dropdownOpen.preferredLocations && (
            <div className="absolute z-20 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
              {locationOptions.map(location => (
                <div
                  key={location}
                  onClick={() => handleMultiSelect('preferredLocations', location)}
                  className={`px-4 py-2 hover:bg-gray-100 cursor-pointer ${formData.preferredLocations.includes(location) ? "bg-gray-100 font-medium" : ""}`}
                >
                  {location}
                  {formData.preferredLocations.includes(location) && <span className="float-right text-gray-500">✓</span>}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Looking for */}
        <div>
          <label className="block mb-2 font-medium">Looking for</label>
          <div className="flex space-x-2">
            <button
              type="button"
              className={`px-4 py-1 border ${formData.lookingFor === 'Job' ? 'bg-black text-white' : 'bg-white text-black'} rounded`}
              onClick={() => handleOptionSelect('lookingFor', 'Job')}
            >Job</button>
            <button
              type="button"
              className={`px-4 py-1 border ${formData.lookingFor === 'Internship' ? 'bg-black text-white' : 'bg-white text-black'} rounded`}
              onClick={() => handleOptionSelect('lookingFor', 'Internship')}
            >Internship</button>
            <button
              type="button"
              className={`px-4 py-1 border ${formData.lookingFor === 'Both' ? 'bg-black text-white' : 'bg-white text-black'} rounded`}
              onClick={() => handleOptionSelect('lookingFor', 'Both')}
            >Both</button>
          </div>
        </div>

        {/* Employment type */}
        <div>
          <label className="block mb-2 font-medium">Employment type</label>
          <div className="flex flex-wrap gap-2">
            {['Part-time', 'Full-time', 'Contract'].map(type => (
              <button
                key={type}
                type="button"
                className={`px-4 py-1 border ${formData.employmentType.includes(type) ? 'bg-black text-white' : 'bg-white text-black'} rounded`}
                onClick={() => handleMultiSelect('employmentType', type)}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Work Mode */}
        <div>
          <label className="block mb-2 font-medium">Work Mode</label>
          <div className="flex space-x-2">
             <button
              type="button"
              className={`px-4 py-1 border ${formData.workMode === 'Hybrid' ? 'bg-black text-white' : 'bg-white text-black'} rounded`}
              onClick={() => handleOptionSelect('workMode', 'Hybrid')}
            >Hybrid</button>
            <button
              type="button"
              className={`px-4 py-1 border ${formData.workMode === 'On-site' ? 'bg-black text-white' : 'bg-white text-black'} rounded`}
              onClick={() => handleOptionSelect('workMode', 'On-site')}
            >On-site</button>
            <button
              type="button"
              className={`px-4 py-1 border ${formData.workMode === 'Remote' ? 'bg-black text-white' : 'bg-white text-black'} rounded`}
              onClick={() => handleOptionSelect('workMode', 'Remote')}
            >Remote</button>
          </div>
        </div>

        {/* Job Roles */}
        <div ref={jobRolesRef} className="relative">
          <label className="block font-medium mb-2">Job Roles</label>
          <div className="flex flex-wrap gap-2 mb-2">
            {formData.jobRoles.map(role => (
              <div key={role} className="flex items-center bg-gray-200 text-sm px-3 py-1 rounded-full">
                <span>{role}</span>
                <button
                  type="button"
                  onClick={() => removeSelectedItem('jobRoles', role)}
                  className="ml-2 text-gray-600 hover:text-black"
                ><X size={14} /></button>
              </div>
            ))}
          </div>
          <div
            className="flex items-center justify-between p-2 w-full border border-gray-300 rounded-md cursor-pointer hover:border-gray-400"
            onClick={() => toggleDropdown('jobRoles')}
          >
            <span className="text-gray-500">Select job roles</span>
            <ChevronDown className={`w-5 h-5 transition-transform ${dropdownOpen.jobRoles ? "rotate-180" : ""}`} />
          </div>
          {dropdownOpen.jobRoles && (
            <div className="absolute z-20 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
              {jobRoleOptions.map(role => (
                <div
                  key={role}
                  onClick={() => handleMultiSelect('jobRoles', role)}
                  className={`px-4 py-2 hover:bg-gray-100 cursor-pointer ${formData.jobRoles.includes(role) ? "bg-gray-100 font-medium" : ""}`}
                >
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
                <button
                  type="button"
                  onClick={() => removeSelectedItem('skills', skill)}
                  className="ml-2 text-gray-600 hover:text-black"
                ><X size={14} /></button>
              </div>
            ))}
          </div>
          <div
            className="flex items-center justify-between p-2 w-full border border-gray-300 rounded-md cursor-pointer hover:border-gray-400"
            onClick={() => toggleDropdown('skills')}
          >
            <span className="text-gray-500">Select skills</span>
            <ChevronDown className={`w-5 h-5 transition-transform ${dropdownOpen.skills ? "rotate-180" : ""}`} />
          </div>
          {dropdownOpen.skills && (
            <div className="absolute z-20 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
              {skillsOptions.map(skill => (
                <div
                  key={skill}
                  onClick={() => handleMultiSelect('skills', skill)}
                  className={`px-4 py-2 hover:bg-gray-100 cursor-pointer ${formData.skills.includes(skill) ? "bg-gray-100 font-medium" : ""}`}
                >
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
          <textarea
            id="eligibilityCriteria"
            name="eligibilityCriteria"
            rows="4"
            placeholder="e.g., Minimum 60% in all semesters, no active backlogs, etc."
            className="w-full p-2 border border-gray-300 rounded"
            value={formData.eligibilityCriteria}
            onChange={handleInputChange}
          />
        </div>

        {/* Description  */}

         <div>
            <label className="block mb-1 font-medium">Job Description <span className="text-red-500">*</span></label>
            <textarea name="description" value={formData.description}  onChange={handleInputChange} 
 placeholder="Provide a detailed job description..." className="w-full p-2 border rounded resize-none h-24" required></textarea>
          </div>

        {/* Amenities/Facilities Required */}
        <div ref={amenitiesRef} className="relative">
          <label className="block font-medium mb-2">Amenities/Facilities Required</label>
          <div className="flex flex-wrap gap-2 mb-2">
            {formData.amenitiesRequired.map(amenity => (
              <div key={amenity} className="flex items-center bg-gray-200 text-sm px-3 py-1 rounded-full">
                <span>{amenity}</span>
                <button
                  type="button"
                  onClick={() => removeSelectedItem('amenitiesRequired', amenity)}
                  className="ml-2 text-gray-600 hover:text-black"
                ><X size={14} /></button>
              </div>
            ))}
          </div>
          <div
            className="flex items-center justify-between p-2 w-full border border-gray-300 rounded-md cursor-pointer hover:border-gray-400"
            onClick={() => toggleDropdown('amenities')}
          >
            <span className="text-gray-500">Select required amenities</span>
            <ChevronDown className={`w-5 h-5 transition-transform ${dropdownOpen.amenities ? "rotate-180" : ""}`} />
          </div>
          {dropdownOpen.amenities && (
            <div className="absolute z-20 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
              {amenitiesOptions.map(amenity => (
                <div
                  key={amenity}
                  onClick={() => handleMultiSelect('amenitiesRequired', amenity)}
                  className={`px-4 py-2 hover:bg-gray-100 cursor-pointer ${formData.amenitiesRequired.includes(amenity) ? "bg-gray-100 font-medium" : ""}`}
                >
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
                <button
                  type="button"
                  onClick={() => removeSelectedItem('benefits', benefit)}
                  className="ml-2 text-gray-600 hover:text-black"
                ><X size={14} /></button>
              </div>
            ))}
          </div>
          <div
            className="flex items-center justify-between p-2 w-full border border-gray-300 rounded-md cursor-pointer hover:border-gray-400"
            onClick={() => toggleDropdown('benefits')}
          >
            <span className="text-gray-500">Select benefits offered</span>
            <ChevronDown className={`w-5 h-5 transition-transform ${dropdownOpen.benefits ? "rotate-180" : ""}`} />
          </div>
          {dropdownOpen.benefits && (
            <div className="absolute z-20 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
              {benefitsOptions.map(benefit => (
                <div
                  key={benefit}
                  onClick={() => handleMultiSelect('benefits', benefit)}
                  className={`px-4 py-2 hover:bg-gray-100 cursor-pointer ${formData.benefits.includes(benefit) ? "bg-gray-100 font-medium" : ""}`}
                >
                  {benefit}
                  {formData.benefits.includes(benefit) && <span className="float-right text-gray-500">✓</span>}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Minimum Salary Offered */}
        <div>
          <label className="block mb-2 font-medium">Minimum Salary Offered</label>
          <div className="flex">
             <div className="relative w-16">
               <select
                 id="currency"
                 name="currency"
                 className="w-full h-full p-2 border border-gray-300 rounded-l appearance-none bg-white pr-6"
                 value={currency}
                 onChange={(e) => setCurrency(e.target.value)}
               >
                 <option value="INR">INR</option>
                 <option value="USD">USD</option>
                 <option value="EUR">EUR</option>
                 <option value="GBP">GBP</option>
               </select>
               <ChevronDown className="absolute right-1 top-1/2 transform -translate-y-1/2 text-gray-400" size={12} />
             </div>
             <input
               type="text"
               name="minimumSalary"
               placeholder="Placeholder"
               className="flex-1 p-2 border border-l-0 border-gray-300 rounded-r"
               value={formData.minimumSalary}
               onChange={handleInputChange}
             />
          </div>
        </div>

        {/* Tentative Date of Placement / Hiring */}
        <div>
          <label className="block mb-2 font-medium">Tentative Date of Placement / Hiring</label>
          <div className="flex space-x-4">
            <div className="w-1/2">
              <label className="block mb-1 text-sm">Start Date</label>
              <input
                type="date"
                name="startDate"
                className="w-full p-2 border border-gray-300 rounded"
                value={formData.startDate}
                onChange={handleInputChange}
              />
            </div>
            <div className="w-1/2">
              <label className="block mb-1 text-sm">End Date</label>
              <input
                type="date"
                name="endDate"
                className="w-full p-2 border border-gray-300 rounded"
                value={formData.endDate}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </div>
        
        {/* Number of Rounds */}
        <div>
          <label htmlFor="rounds" className="block mb-2 font-medium">Number of Rounds</label>
          <div className="relative">
            <select
              id="rounds"
              name="rounds"
              className="w-full p-2 border border-gray-300 rounded appearance-none bg-white pr-10"
              value={formData.rounds}
              onChange={handleInputChange}
            >
              <option value="" disabled>Select number of rounds</option>
              {roundsOptions.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          </div>
        </div>

        {/* Process of Selection */}
        <div>
          <label htmlFor="selectionProcess" className="block mb-2 font-medium">Process of Selection</label>
          <div className="relative">
            <select
              id="selectionProcess"
              name="selectionProcess"
              className="w-full p-2 border border-gray-300 rounded appearance-none bg-white pr-10"
              value={formData.selectionProcess[0] || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, selectionProcess: [e.target.value] }))}
            >
              <option value="" disabled>Select process</option>
              {processOptions.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          </div>
        </div>

        {/* Contact Person */}
        <div>
          <label htmlFor="contactPersonName" className="block mb-2 font-medium">Contact Person</label>
          <input
            type="text"
            id="contactPersonName"
            name="contactPersonName"
            placeholder="Name"
            className="w-full p-2 border border-gray-300 rounded"
            value={formData.contactPersonName}
            onChange={handleInputChange}
          />
        </div>

        {/* Contact person designation */}
        <div>
          <label htmlFor="contactDesignation" className="block mb-2 font-medium">Contact person designation <span className="text-red-500">*</span></label>
          <div className="relative">
            <select
              id="contactDesignation"
              name="contactDesignation"
              className="w-full p-2 border border-gray-300 rounded appearance-none bg-white pr-10"
              value={formData.contactDesignation}
              onChange={handleInputChange}
            >
              <option value="" disabled>Select designation</option>
              {designationOptions.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          </div>
        </div>
        
        {/* Contact person email */}
        <div>
          <label htmlFor="email" className="block mb-2 font-medium">Contact person email <span className="text-red-500">*</span></label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="email"
              id="email"
              name="email"
              placeholder="hello@xyz.com"
              className="w-full p-2 pl-10 border border-gray-300 rounded"
              value={formData.email}
              onChange={handleInputChange}
            />
          </div>
        </div>

        {/* Contact person mobile no */}
        <div>
          <label htmlFor="mobile" className="block mb-2 font-medium">Contact person mobile no <span className="text-red-500">*</span></label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="tel"
              id="mobile"
              name="mobile"
              placeholder="1234567890"
              className="w-full p-2 pl-10 border border-gray-300 rounded"
              value={formData.mobile}
              onChange={handleInputChange}
            />
          </div>
        </div>
        
        {/* Contact person LinkedIn Profile */}
        <div>
          <label htmlFor="linkedin" className="block mb-2 font-medium">Contact person LinkedIn Profile</label>
          <div className="relative">
            <Link className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="url"
              id="linkedin"
              name="linkedin"
              placeholder="http://www.linkedin.com/in/yourprofile"
              className="w-full p-2 pl-10 border border-gray-300 rounded"
              value={formData.linkedin}
              onChange={handleInputChange}
            />
          </div>
        </div>

        {/* Minimum Students to be Hired */}
        <div>
          <label htmlFor="minimumStudents" className="block mb-2 font-medium">Minimum Students to be Hired</label>
          <div className="relative">
            <select
              id="minimumStudents"
              name="minimumStudents"
              className="w-full p-2 border border-gray-300 rounded appearance-none bg-white pr-10"
              value={formData.minimumStudents}
              onChange={handleInputChange}
            >
              <option value="" disabled>Select range</option>
              {minStudentsOptions.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          </div>
        </div>

        {/* Register Button */}
        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleSubmit}
            className="px-6 py-2 bg-black text-white rounded"
          >
            Register
          </button>
        </div>
      </div>
    </div>
  );
}