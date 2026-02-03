// import { useState, useRef, useEffect, useMemo } from 'react';
// import axios from 'axios';
// import { ChevronDown, X, Mail, Phone, Link, Building2, Calendar } from 'lucide-react';
// import toast from 'react-hot-toast';
// import CreatableSelect from 'react-select/creatable';
// import { City } from 'country-state-city';

// export default function RequestInfo() {
//   const degreeStreamMapping = {
//     "Bachelor of Technology (B.Tech)": ['Computer Science', 'Information Technology', 'Electronics', 'Mechanical', 'Civil', 'Electrical', 'Chemical', 'Aerospace', 'Automobile', 'Biotechnology', 'Other'],
//     "Bachelor of Engineering (BE)": ['Computer Science', 'Information Technology', 'Electronics', 'Mechanical', 'Civil', 'Electrical', 'Chemical', 'Aerospace', 'Automobile', 'Biotechnology', 'Other'],
//     "Master of Technology (M.Tech)": ['Computer Science', 'Information Technology', 'Electronics', 'Mechanical', 'Civil', 'Electrical', 'Chemical', 'Aerospace', 'Automobile', 'Biotechnology', 'Other'],
//     "Master of Engineering (ME)": ['Computer Science', 'Information Technology', 'Electronics', 'Mechanical', 'Civil', 'Electrical', 'Chemical', 'Aerospace', 'Automobile', 'Biotechnology', 'Other'],
//     "Master of Business Administration (MBA)": ['Marketing', 'Finance', 'Human Resources', 'Operations', 'IT & Systems', 'International Business', 'Other'],
//     "Bachelor of Business Administration (BBA)": ['Marketing', 'Finance', 'Human Resources', 'General Management', 'Other'],
//     "Bachelor of Commerce (B.Com)": ['Accounting', 'Finance', 'Taxation', 'Economics', 'Other'],
//     "Master of Commerce (M.Com)": ['Accounting', 'Finance', 'Taxation', 'Economics', 'Other'],
//     "Bachelor of Science (B.Sc)": ['Physics', 'Chemistry', 'Mathematics', 'Biology', 'Computer Science', 'Statistics', 'Other'],
//     "Master of Science (M.Sc)": ['Physics', 'Chemistry', 'Mathematics', 'Biology', 'Computer Science', 'Statistics', 'Other'],
//     "Bachelor of Computer Applications (BCA)": ['Computer Applications', 'Software Development', 'Data Science', 'Other'],
//     "Master of Computer Applications (MCA)": ['Computer Applications', 'Software Development', 'Data Science', 'Other'],
//     "Bachelor of Arts (BA)": ['History', 'Political Science', 'Sociology', 'English Literature', 'Economics', 'Psychology', 'Other'],
//     "Master of Arts (MA)": ['History', 'Political Science', 'Sociology', 'English Literature', 'Economics', 'Psychology', 'Other'],
//     "Doctor of Philosophy (PhD)": ['Computer Science', 'Electronics', 'Mechanical', 'Civil', 'Electrical', 'Information Technology', 'Biotechnology', 'Chemical', 'Aerospace', 'Automobile', 'MBA', 'BBA', 'B.Com', 'B.Sc', 'BA', 'B.Tech', 'M.Tech', 'PhD', 'Other'],
//     "Post Doctorate": ['Computer Science', 'Electronics', 'Mechanical', 'Civil', 'Electrical', 'Information Technology', 'Biotechnology', 'Chemical', 'Aerospace', 'Automobile', 'MBA', 'BBA', 'B.Com', 'B.Sc', 'BA', 'B.Tech', 'M.Tech', 'PhD', 'Other'],
//     "High School / Diploma": ["All Streams", "Science", "Commerce", "Arts", "Vocational"],
//     "Associate Degree": ["All Streams", "Technical", "Business", "Healthcare"],
//     "Other": ["Other"]
//   };

//   const jobRoles = ['Software Developer', 'Data Scientist', 'DevOps Engineer', 'QA Engineer', 'Frontend Developer', 'Backend Developer', 'Full Stack Developer', 'Mobile App Developer', 'UI/UX Designer', 'Product Manager', 'Business Analyst', 'Data Analyst', 'Machine Learning Engineer', 'Cloud Architect', 'Network Engineer', 'Cyber Security Specialist', 'Technical Writer', 'Sales Engineer', 'Marketing Specialist', 'HR Recruiter', 'Finance Analyst', 'Other'];
//   const skillsOptions = ['JavaScript', 'Python', 'Java', 'React', 'Node.js', 'HTML/CSS', 'SQL', 'MongoDB', 'AWS', 'Docker', 'Kubernetes', 'Machine Learning', 'Data Structures', 'Algorithms', 'Git', 'REST APIs'];
//   const benefitsOptions = ['Health Insurance', 'Provident Fund (PF)', 'Paid Time Off (PTO)', 'Work from Home', 'Performance Bonus', 'Stock Options'];
//   const numberOfRoundsOptions = ['1', '2', '3', '4', '5', '6+'];
//   const processOptions = ['Online Test', 'Coding Test', 'Aptitude Test', 'Group Discussion', 'Technical Interview', 'HR Interview', 'Case Study', 'Presentation'].map(option => `${option}`).sort((a, b) => a.localeCompare(b));
//   const designationOptions = ['HR Manager', 'Technical Recruiter', 'Talent Acquisition', 'Hiring Manager', 'Team Lead', 'Department Head', 'CEO', 'CTO', 'Founder', 'Other'];
//   const minStudentsOptions = ['1-10', '11-25', '26-50', '51-100', '101-200', '201-500', '500+'];
//   const degrees = Object.keys(degreeStreamMapping).sort();
//   const collegeCategoryOptions = ['Tier 1', 'Tier 2', 'Tier 3', 'Autonomous', 'All Colleges'];
//   const preferredModeOptions = ['Online', 'Offline', 'Hybrid', 'Online Aptitude and Physical Interview'];
//   const amenitiesOptions = ['Projector', 'Auditorium', 'Interview Rooms', 'Wi-Fi Access', 'Refreshments', 'Parking'];
//   const tagsOptions = ['Urgent hiring', 'Fresher preferred', 'Remote-friendly', 'Work from Home', 'Internship-eligible', 'Hybrid', 'High Priority', 'Contract', 'Part-time', 'Full-time'];

//   const initialState = {
//     venue: '',
//     degree: [],
//     studentStreams: [],
//     collegeCategories: [],
//     preferredLocations: [],
//     lookingFor: '',
//     employmentType: [],
//     workLocation: [],
//     workMode: '',
//     companyHiringPreference: { preferredMode: '' },
//     jobRoles: [],
//     skills: [],
//     packageDetails: { currency: 'INR', totalCTC: '', fixedPay: '', joiningBonus: '' },
//     startDate: '',
//     endDate: '',
//     onlineTestDate: '',
//     interviewWindow: { start: '', end: '' },
//     offerRolloutDate: '',
//     numberOfRounds: '',
//     selectionProcess: [],
//     contactPerson: { name: '', designation: '', email: '', mobile: '', linkedin: '' },
//     amenitiesRequired: [],
//     benefits: [],
//     tags: [],
//     minStudents: '',
//     eligibilityCriteria: '',
//     description: '',
//     broadcastType: 'Everyone',
//   };

//   const [formData, setFormData] = useState(initialState);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [descriptionError, setDescriptionError] = useState("");

//   const cityOptions = useMemo(() =>
//     City.getCitiesOfCountry('IN').map(city => ({
//       value: city.name,
//       label: city.name,
//     })),
//   []);

//   const [customDegree, setCustomDegree] = useState('');
//   const [customStream, setCustomStream] = useState('');
//   const [customJobRole, setCustomJobRole] = useState('');
//   const [customSkill, setCustomSkill] = useState('');

//   const [dropdownOpen, setDropdownOpen] = useState({
//     studentStreams: false,
//     skills: false,
//     benefits: false,
//     jobRoles: false,
//     workLocations: false,
//     preferredLocations: false,
//     selectionProcess: false,
//     tags: false,
//     degree: false,
//     collegeCategories: false,
//     amenities: false,
//   });

//   const studentStreamsRef = useRef(null);
//   const skillsRef = useRef(null);
//   const benefitsRef = useRef(null);
//   const jobRolesRef = useRef(null);
//   const workLocationsRef = useRef(null);
//   const preferredLocationsRef = useRef(null);
//   const selectionProcessRef = useRef(null);
//   const tagsRef = useRef(null);
//   const degreeRef = useRef(null);
//   const collegeCategoriesRef = useRef(null);
//   const amenitiesRef = useRef(null);

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       const refs = {
//         studentStreams: studentStreamsRef,
//         skills: skillsRef,
//         benefits: benefitsRef,
//         jobRoles: jobRolesRef,
//         workLocations: workLocationsRef,
//         preferredLocations: preferredLocationsRef,
//         selectionProcess: selectionProcessRef,
//         tags: tagsRef,
//         degree: degreeRef,
//         collegeCategories: collegeCategoriesRef,
//         amenities: amenitiesRef,
//       };

//       for (const key in refs) {
//         if (refs[key].current && !refs[key].current.contains(event.target)) {
//           setDropdownOpen(prev => ({ ...prev, [key]: false }));
//         }
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   useEffect(() => {
//     setFormData(prev => ({ ...prev, studentStreams: [] }));
//   }, [formData.degree]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     if (name === "description") {
//       if (value.length > 500) {
//         setDescriptionError("Job description cannot exceed 500 characters.");
//       } else {
//         setDescriptionError("");
//       }
//     }
//     setFormData({ ...formData, [name]: value });
//   };

//   const handleMultiSelect = (field, value) => {
//     setFormData(prev => {
//       const currentValues = prev[field] || [];
//       const newValues = currentValues.includes(value)
//         ? currentValues.filter(item => item !== value)
//         : [...currentValues, value];
//       return { ...prev, [field]: newValues };
//     });
//   };

//   const removeSelectedItem = (field, value) => {
//     setFormData(prev => ({
//       ...prev,
//       [field]: prev[field].filter(item => item !== value),
//     }));
//   };

//   const toggleDropdown = (dropdown) => {
//     setDropdownOpen(prev => {
//       const wasOpen = prev[dropdown];
//       const newState = Object.keys(prev).reduce((acc, key) => {
//         acc[key] = false;
//         return acc;
//       }, {});
//       if (!wasOpen) {
//         newState[dropdown] = true;
//       }
//       return newState;
//     });
//   };

//   const handlePackageDetailsChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({
//       ...formData,
//       packageDetails: { ...formData.packageDetails, [name]: value }
//     });
//   };

//   const handleContactChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, contactPerson: { ...formData.contactPerson, [name]: value } });
//   };

//   const handleInterviewWindowChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       interviewWindow: {
//         ...prev.interviewWindow,
//         [name]: value
//       }
//     }));
//   };

//   const handleHiringPreferenceChange = (value) => {
//     setFormData(prev => ({
//       ...prev,
//       companyHiringPreference: { preferredMode: value }
//     }));
//   };

//   const handleOptionSelect = (field, value) => {
//     setFormData(prev => ({ ...prev, [field]: value }));
//   };

//   const handleCustomAdd = (field, value, setValue, predefinedOptions = []) => {
//     if (value.trim() === '') return;
//     setFormData(prev => {
//       const currentValues = prev[field] || [];
//       if (currentValues.map(v => v.toLowerCase()).includes(value.trim().toLowerCase()) || 
//           predefinedOptions.map(v => v.toLowerCase()).includes(value.trim().toLowerCase())) {
//         setValue('');
//         toast.error("Item already exists.");
//         return prev;
//       }
//       const newValues = [...currentValues, value.trim()];
//       return { ...prev, [field]: newValues };
//     });
//     setValue('');
//   };

//   const availableStreams = (() => {
//     if (formData.degree.length === 0) {
//       return [];
//     }
//     const allStreams = new Set();
//     formData.degree.forEach(degree => {
//       if (degreeStreamMapping[degree]) {
//         degreeStreamMapping[degree].forEach(stream => allStreams.add(stream));
//       }
//     });
//     return [...allStreams].sort((a, b) => a.localeCompare(b));
//   })();

//   const selectStyles = {
//     control: (base) => ({
//       ...base,
//       borderColor: '#e5e7eb',
//       minHeight: '42px',
//       borderRadius: '0.5rem',
//       backgroundColor: 'rgb(249 250 251 / var(--tw-bg-opacity))',
//       backgroundImage: 'linear-gradient(to right, rgb(249 250 251), rgb(255 255 255))',
//     }),
//     menu: (base) => ({
//       ...base,
//       borderRadius: '0.5rem',
//       border: '1px solid #e5e7eb',
//       zIndex: 100,
//     }),
//     multiValue: (base) => ({
//       ...base,
//       backgroundColor: '#f3f4f6',
//       borderRadius: '9999px',
//     }),
//     multiValueRemove: (base) => ({
//       ...base,
//       color: '#6b7280',
//       ':hover': {
//         backgroundColor: '#e5e7eb',
//         color: '#374151',
//       },
//     }),
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (formData.description.length > 500) {
//       setDescriptionError("Job description cannot exceed 500 characters.");
//       toast.error("Job description cannot exceed 500 characters.");
//       return;
//     }

//     const requiredFields = [
//       { key: 'venue', label: 'On-Campus Hiring Venue' },
//       { key: 'degree', label: 'Degree', type: 'array' },
//       { key: 'studentStreams', label: 'Student Stream', type: 'array' },
//       { key: 'broadcastType', label: 'Broadcast Options' },
//       { key: 'lookingFor', label: 'Looking for' },
//       { key: 'employmentType', label: 'Employment Type', type: 'array' },
//       { key: 'workMode', label: 'Work Mode' },
//       { key: 'jobRoles', label: 'Job Role', type: 'array' },
//       { key: 'workLocation', label: 'Work Location', type: 'array' },
//       { key: 'skills', label: 'Skills', type: 'array' },
//       { key: 'eligibilityCriteria', label: 'Eligibility Criteria' },
//       { key: 'description', label: 'Job Description' },
//       { key: 'benefits', label: 'Benefits Offered', type: 'array' },
//       { key: 'numberOfRounds', label: 'Number of Rounds' },
//       { key: 'selectionProcess', label: 'Process of Selection', type: 'array' },
//       { key: 'minStudents', label: 'Minimum Students' },
//       { key: 'startDate', label: 'Tentative Start Date' },
//       { key: 'endDate', label: 'Tentative End Date' },
//     ];

//     for (const field of requiredFields) {
//       if (field.type === 'array') {
//         if (!formData[field.key] || formData[field.key].length === 0) {
//           toast.error(`${field.label} is required.`);
//           return;
//         }
//       } else {
//         if (!formData[field.key]) {
//           toast.error(`${field.label} is required.`);
//           return;
//         }
//       }
//     }

//     if (!formData.packageDetails.totalCTC) {
//       toast.error("Total CTC is required.");
//       return;
//     }
//     if (!formData.contactPerson.name) {
//       toast.error("Contact Person Name is required.");
//       return;
//     }
//     if (!formData.contactPerson.designation) {
//       toast.error("Contact Person Designation is required.");
//       return;
//     }
//     if (!formData.contactPerson.email) {
//       toast.error("Contact Person Email is required.");
//       return;
//     }
//     if (!formData.contactPerson.mobile) {
//       toast.error("Contact Person Mobile is required.");
//       return;
//     }

//     setIsSubmitting(true);

//     try {
//       const token = localStorage.getItem('token') || document.cookie.split('; ').find(row => row.startsWith('jwt='))?.split('=')[1];

//       const submissionData = {
//         venue: formData.venue,
//         degree: formData.degree,
//         studentStreams: formData.studentStreams,
//         collegeCategories: formData.collegeCategories,
//         location: formData.preferredLocations,
//         lookingFor: formData.lookingFor,
//         employmentType: formData.employmentType,
//         workMode: formData.workMode,
//         companyHiringPreference: formData.companyHiringPreference,
//         jobRoles: formData.jobRoles,
//         workLocation: formData.workLocation,
//         skills: formData.skills,
//         packageDetails: {
//           currency: formData.packageDetails.currency,
//           totalCTC: parseFloat(formData.packageDetails.totalCTC) || 0,
//           fixedPay: parseFloat(formData.packageDetails.fixedPay) || 0,
//           joiningBonus: parseFloat(formData.packageDetails.joiningBonus) || 0
//         },
//         startDate: formData.startDate,
//         endDate: formData.endDate,
//         onlineTestDate: formData.onlineTestDate,
//         interviewWindow: formData.interviewWindow,
//         offerRolloutDate: formData.offerRolloutDate,
//         rounds: formData.numberOfRounds ? [formData.numberOfRounds] : [],
//         selectionProcess: formData.selectionProcess.join(' + '),
//         contactPerson: formData.contactPerson,
//         amenitiesRequired: formData.amenitiesRequired,
//         benefits: formData.benefits,
//         tags: formData.tags,
//         minimumStudents: formData.minStudents,
//         eligibilityCriteria: formData.eligibilityCriteria,
//         description: formData.description,
//         jobType: "On-campus",
//         broadcastType: formData.broadcastType,
//       };

//       const response = await axios.post(
//         `${import.meta.env.VITE_Backend_URL}/api/employer/hiring-channel/create-Oncampusjob`, 
//         submissionData, 
//         {
//           headers: {
//             'Content-Type': 'application/json',
//             'Authorization': `Bearer ${token}`
//           },
//           withCredentials: true,
//         }
//       );

//       if (response.status === 201) {
//         toast.success('On-campus job posted');
//         setTimeout(() => {
//           toast.success('This job will expire after 15 days');
//         }, 2000);
//         setFormData(initialState);
//       }
//     } catch (err) {
//       const errorMsg = err.response?.data?.message || err.response?.data?.error || 'Failed to submit form. Please try again.';
//       toast.error(errorMsg);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleLocationChange = (field, selectedOptions) => {
//     setFormData(prev => ({
//       ...prev,
//       [field]: selectedOptions ? selectedOptions.map(option => option.value) : []
//     }));
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-[#667eea]/5 via-[#f093fb]/5 to-[#764ba2]/5">
//       <div className="container mx-auto px-4 py-8 max-w-4xl">
//         <div className="bg-white/90 backdrop-blur-sm border border-gray-100 rounded-2xl shadow-lg p-6 mb-8">
//           <div className="text-center mb-6">
//             <div className="flex items-center justify-center mb-3">
//               <div className="p-2 bg-gradient-to-br from-[#667eea]/20 to-[#764ba2]/20 rounded-lg mr-3">
//                 <Building2 className="h-5 w-5 text-[#667eea]" />
//               </div>
//               <h1 className="text-4xl font-bold bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent">
//                 OnCampus Connect: Hire Smarter
//               </h1>
//             </div>
//             <p className="text-md text-gray-600 max-w-2xl mx-auto">
//               Our OnCampus service brings career opportunities directly to students, connecting them with top employers through campus recruitment drives and job events.
//             </p>
//           </div>
//         </div>

//         <div className="bg-white/90 backdrop-blur-sm border border-gray-100 rounded-2xl shadow-lg p-6">
//           <div className="text-center mb-8">
//             <h2 className="text-3xl font-bold bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent">Register for On-Campus Hiring</h2>
//             <p className="text-gray-500 mt-2">Fill in your requirements to find the best talent from campuses across the nation.</p>
//           </div>

//           <form onSubmit={handleSubmit} className="space-y-6">
//             <div>
//               <label className="block mb-2 font-medium text-gray-700">On-Campus Hiring Venue <span className="text-red-500">*</span></label>
//               <CreatableSelect
//                 options={cityOptions}
//                 value={formData.venue ? { value: formData.venue, label: formData.venue } : null}
//                 onChange={(option) => setFormData({ ...formData, venue: option ? option.value : '' })}
//                 placeholder="Select venue location..."
//                 styles={selectStyles}
//               />
//             </div>

//             <div ref={degreeRef} className="relative">
//               <label className="block font-medium mb-2 text-gray-700">Degree <span className="text-red-500">*</span></label>
//               <div className="flex flex-wrap gap-2 mb-2">
//                 {formData.degree.map(degree => (
//                   <div key={degree} className="flex items-center bg-gradient-to-r from-gray-100 to-white border border-gray-200 text-gray-700 text-sm px-3 py-1 rounded-full">
//                     <span>{degree}</span>
//                     <button type="button" onClick={() => removeSelectedItem('degree', degree)} className="ml-2 text-gray-500 hover:text-gray-700"><X size={14} /></button>
//                   </div>
//                 ))}
//               </div>
//               <div
//                 className="flex items-center justify-between p-3 w-full border border-gray-200 rounded-lg cursor-pointer hover:border-gray-300 transition-colors bg-gradient-to-r from-gray-50 to-white"
//                 onClick={() => toggleDropdown('degree')}
//               >
//                 <span className="text-gray-500">Select degree(s)</span>
//                 <ChevronDown className={`w-5 h-5 transition-transform ${dropdownOpen.degree ? "rotate-180" : ""} text-gray-400`} />
//               </div>
//               {dropdownOpen.degree && (
//                 <div className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg">
//                   <div className="p-2 border-b border-gray-100 flex">
//                     <input
//                       type="text"
//                       placeholder="Add custom degree..."
//                       value={customDegree}
//                       onChange={(e) => setCustomDegree(e.target.value)}
//                       onClick={(e) => e.stopPropagation()}
//                       onKeyDown={(e) => {
//                         if (e.key === 'Enter') {
//                           e.preventDefault();
//                           handleCustomAdd('degree', customDegree, setCustomDegree, degrees);
//                         }
//                       }}
//                       className="w-full p-2 border border-gray-200 rounded-lg"
//                     />
//                     <button
//                       type="button"
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         handleCustomAdd('degree', customDegree, setCustomDegree, degrees);
//                       }}
//                       className="ml-2 px-4 py-2 bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white rounded-lg text-sm font-medium"
//                     >
//                       Add
//                     </button>
//                   </div>
//                   <div className="max-h-60 overflow-auto">
//                     {degrees.map(degree => (
//                       <div key={degree} onClick={() => handleMultiSelect('degree', degree)} className={`px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 ${formData.degree.includes(degree) ? "bg-blue-50" : ""}`}>
//                         <div className="flex items-center justify-between">
//                           <span className={formData.degree.includes(degree) ? "text-[#667eea] font-medium" : "text-gray-700"}>{degree}</span>
//                           {formData.degree.includes(degree) && <span className="text-[#667eea]">✓</span>}
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               )}
//             </div>

//             <div ref={studentStreamsRef} className="relative">
//               <label className="block font-medium mb-2 text-gray-700">Student Stream <span className="text-red-500">*</span></label>
//               <div className="flex flex-wrap gap-2 mb-2">
//                 {formData.studentStreams.map(stream => (
//                   <div key={stream} className="flex items-center bg-gradient-to-r from-gray-100 to-white border border-gray-200 text-gray-700 text-sm px-3 py-1 rounded-full">
//                     <span>{stream}</span>
//                     <button type="button" onClick={() => removeSelectedItem('studentStreams', stream)} className="ml-2 text-gray-500 hover:text-gray-700"><X size={14} /></button>
//                   </div>
//                 ))}
//               </div>
//               <div
//                 onClick={() => formData.degree.length > 0 && toggleDropdown('studentStreams')}
//                 className={`flex items-center justify-between p-3 w-full border rounded-lg ${!formData.degree.length ? 'bg-gray-50 cursor-not-allowed' : 'cursor-pointer hover:border-gray-300 transition-colors bg-gradient-to-r from-gray-50 to-white'} border-gray-200`}
//               >
//                 <span className="text-gray-500">
//                   {formData.degree.length > 0 ? 'Select streams' : 'Please select a degree first'}
//                 </span>
//                 <ChevronDown className={`w-5 h-5 transition-transform ${dropdownOpen.studentStreams ? "rotate-180" : ""} text-gray-400`} />
//               </div>
//               {dropdownOpen.studentStreams && formData.degree.length > 0 && (
//                 <div className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
//                   <div className="p-2 border-b border-gray-100 flex">
//                     <input
//                       type="text"
//                       placeholder="Add custom stream..."
//                       value={customStream}
//                       onChange={(e) => setCustomStream(e.target.value)}
//                       onClick={(e) => e.stopPropagation()}
//                       onKeyDown={(e) => {
//                         if (e.key === 'Enter') {
//                           e.preventDefault();
//                           handleCustomAdd('studentStreams', customStream, setCustomStream, availableStreams);
//                         }
//                       }}
//                       className="w-full p-2 border border-gray-200 rounded-lg"
//                     />
//                     <button
//                       type="button"
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         handleCustomAdd('studentStreams', customStream, setCustomStream, availableStreams);
//                       }}
//                       className="ml-2 px-4 py-2 bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white rounded-lg text-sm font-medium"
//                     >
//                       Add
//                     </button>
//                   </div>
//                   <div className="max-h-48 overflow-auto">
//                     {availableStreams.length > 0 ? (
//                       availableStreams.map(stream => (
//                         <div key={stream} onClick={() => handleMultiSelect('studentStreams', stream)} className={`px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 ${formData.studentStreams.includes(stream) ? "bg-blue-50" : ""}`}>
//                           <div className="flex items-center justify-between">
//                             <span className={formData.studentStreams.includes(stream) ? "text-[#667eea] font-medium" : "text-gray-700"}>{stream}</span>
//                             {formData.studentStreams.includes(stream) && <span className="text-[#667eea]">✓</span>}
//                           </div>
//                         </div>
//                       ))
//                     ) : (
//                       <div className="px-4 py-3 text-gray-500 border-b border-gray-100">No predefined streams for custom degree. Add manually.</div>
//                     )}
//                   </div>
//                 </div>
//               )}
//             </div>

//             <div ref={collegeCategoriesRef} className="relative">
//               <label className="block font-medium mb-2 text-gray-700">College Categories</label>
//               <div className="flex flex-wrap gap-2 mb-2">
//                 {formData.collegeCategories.map(type => (
//                   <div key={type} className="flex items-center bg-gradient-to-r from-gray-100 to-white border border-gray-200 text-gray-700 text-sm px-3 py-1 rounded-full">
//                     <span>{type}</span>
//                     <button type="button" onClick={() => removeSelectedItem('collegeCategories', type)} className="ml-2 text-gray-500 hover:text-gray-700"><X size={14} /></button>
//                   </div>
//                 ))}
//               </div>
//               <div className="flex items-center justify-between p-3 w-full border border-gray-200 rounded-lg cursor-pointer hover:border-gray-300 transition-colors bg-gradient-to-r from-gray-50 to-white" onClick={() => toggleDropdown('collegeCategories')}>
//                 <span className="text-gray-500">Select college categories</span>
//                 <ChevronDown className={`w-5 h-5 transition-transform ${dropdownOpen.collegeCategories ? "rotate-180" : ""} text-gray-400`} />
//               </div>
//               {dropdownOpen.collegeCategories && (
//                 <div className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
//                   {collegeCategoryOptions.map(type => (
//                     <div key={type} onClick={() => handleMultiSelect('collegeCategories', type)} className={`px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 ${formData.collegeCategories.includes(type) ? "bg-blue-50" : ""}`}>
//                       <div className="flex items-center justify-between">
//                         <span className={formData.collegeCategories.includes(type) ? "text-[#667eea] font-medium" : "text-gray-700"}>{type}</span>
//                         {formData.collegeCategories.includes(type) && <span className="text-[#667eea]">✓</span>}
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>

//             <div>
//               <label className="block font-medium mb-2 text-gray-700">Preferred Hiring Locations</label>
//               <CreatableSelect
//                 isMulti
//                 options={cityOptions}
//                 value={formData.preferredLocations.map(location => ({ value: location, label: location }))}
//                 onChange={(selectedOptions) => handleLocationChange('preferredLocations', selectedOptions)}
//                 placeholder="Select or type to add locations..."
//                 styles={selectStyles}
//               />
//             </div>

//             <div>
//               <label className="block mb-2 font-medium text-gray-700">Broadcast Options <span className="text-red-500">*</span></label>
//               <div className="flex items-center space-x-6">
//                 <label className="flex items-center cursor-pointer">
//                   <input
//                     type="radio"
//                     name="broadcastType"
//                     value="Everyone"
//                     checked={formData.broadcastType === 'Everyone'}
//                     onChange={handleChange}
//                     className="h-4 w-4 text-[#667eea] border-gray-300 focus:ring-[#667eea]"
//                   />
//                   <span className="ml-2 text-gray-700">Broadcast to Everyone</span>
//                 </label>
//                 <label className="flex items-center cursor-pointer">
//                   <input
//                     type="radio"
//                     name="broadcastType"
//                     value="Location"
//                     checked={formData.broadcastType === 'Location'}
//                     onChange={handleChange}
//                     className="h-4 w-4 text-[#667eea] border-gray-300 focus:ring-[#667eea]"
//                   />
//                   <span className="ml-2 text-gray-700">Broadcast by Location</span>
//                 </label>
//               </div>
//               <p className="text-xs text-gray-500 mt-1">
//                 Select 'Broadcast by Location' to show this job only to candidates/colleges in the specified Work Locations.
//               </p>
//             </div>

//             <div>
//               <label className="block mb-2 font-medium text-gray-700">Looking for <span className="text-red-500">*</span></label>
//               <div className="flex flex-wrap gap-2">
//                 <button type="button" className={`px-4 py-2 border rounded-lg transition-colors ${formData.lookingFor === 'Job' ? 'bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white border-transparent' : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300'}`} onClick={() => handleOptionSelect('lookingFor', 'Job')}>Job</button>
//                 <button type="button" className={`px-4 py-2 border rounded-lg transition-colors ${formData.lookingFor === 'Internship' ? 'bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white border-transparent' : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300'}`} onClick={() => handleOptionSelect('lookingFor', 'Internship')}>Internship</button>
//                 <button type="button" className={`px-4 py-2 border rounded-lg transition-colors ${formData.lookingFor === 'Both' ? 'bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white border-transparent' : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300'}`} onClick={() => handleOptionSelect('lookingFor', 'Both')}>Both</button>
//               </div>
//             </div>

//             <div>
//               <label className="block mb-2 font-medium text-gray-700">Employment type <span className="text-red-500">*</span></label>
//               <div className="flex flex-wrap gap-2">
//                 {['Part-time', 'Full-time', 'Contract'].map(type => (
//                   <button key={type} type="button" className={`px-4 py-2 border rounded-lg transition-colors ${formData.employmentType.includes(type) ? 'bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white border-transparent' : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300'}`} onClick={() => handleMultiSelect('employmentType', type)}>
//                     {type}
//                   </button>
//                 ))}
//               </div>
//             </div>

//             <div>
//               <label className="block mb-2 font-medium text-gray-700">Work Mode <span className="text-red-500">*</span></label>
//               <div className="flex space-x-2">
//                 <button type="button" className={`px-4 py-2 border rounded-lg transition-colors ${formData.workMode === 'Hybrid' ? 'bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white border-transparent' : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300'}`} onClick={() => handleOptionSelect('workMode', 'Hybrid')}>Hybrid</button>
//                 <button type="button" className={`px-4 py-2 border rounded-lg transition-colors ${formData.workMode === 'On-site' ? 'bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white border-transparent' : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300'}`} onClick={() => handleOptionSelect('workMode', 'On-site')}>On-site</button>
//                 <button type="button" className={`px-4 py-2 border rounded-lg transition-colors ${formData.workMode === 'Remote' ? 'bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white border-transparent' : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300'}`} onClick={() => handleOptionSelect('workMode', 'Remote')}>Remote</button>
//               </div>
//             </div>
            
//             <div>
//               <label className="block mb-2 font-medium text-gray-700">Preferred Hiring Mode</label>
//               <div className="flex flex-wrap gap-2">
//                 {preferredModeOptions.map(mode => (
//                   <button 
//                     key={mode} 
//                     type="button" 
//                     className={`px-4 py-2 border rounded-lg transition-colors ${formData.companyHiringPreference.preferredMode === mode ? 'bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white border-transparent' : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300'}`} 
//                     onClick={() => handleHiringPreferenceChange(mode)}
//                   >
//                     {mode}
//                   </button>
//                 ))}
//               </div>
//             </div>

//             <div ref={jobRolesRef} className="relative">
//               <label className="block font-medium mb-2 text-gray-700">Job Role <span className="text-red-500">*</span></label>
//               <div className="flex flex-wrap gap-2 mb-2">
//                 {formData.jobRoles.map(role => (
//                   <div key={role} className="flex items-center bg-gradient-to-r from-gray-100 to-white border border-gray-200 text-gray-700 text-sm px-3 py-1 rounded-full">
//                     <span>{role}</span>
//                     <button type="button" onClick={() => removeSelectedItem('jobRoles', role)} className="ml-2 text-gray-500 hover:text-gray-700"><X size={14} /></button>
//                   </div>
//                 ))}
//               </div>
//               <div onClick={() => toggleDropdown('jobRoles')} className="flex items-center justify-between p-3 w-full border border-gray-200 rounded-lg cursor-pointer hover:border-gray-300 transition-colors bg-gradient-to-r from-gray-50 to-white">
//                 <span className="text-gray-500">Select job roles</span>
//                 <ChevronDown className={`w-5 h-5 transition-transform ${dropdownOpen.jobRoles ? "rotate-180" : ""} text-gray-400`} />
//               </div>
//               {dropdownOpen.jobRoles && (
//                 <div className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
//                   <div className="p-2 border-b border-gray-100 flex">
//                     <input
//                       type="text"
//                       placeholder="Add custom job role..."
//                       value={customJobRole}
//                       onChange={(e) => setCustomJobRole(e.target.value)}
//                       onClick={(e) => e.stopPropagation()}
//                       onKeyDown={(e) => {
//                         if (e.key === 'Enter') {
//                           e.preventDefault();
//                           handleCustomAdd('jobRoles', customJobRole, setCustomJobRole, jobRoles);
//                         }
//                       }}
//                       className="w-full p-2 border border-gray-200 rounded-lg"
//                     />
//                     <button
//                       type="button"
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         handleCustomAdd('jobRoles', customJobRole, setCustomJobRole, jobRoles);
//                       }}
//                       className="ml-2 px-4 py-2 bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white rounded-lg text-sm font-medium"
//                     >
//                       Add
//                     </button>
//                   </div>
//                   <div className="max-h-48 overflow-auto">
//                     {jobRoles.map(role => (
//                       <div key={role} onClick={() => handleMultiSelect('jobRoles', role)} className={`px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 ${formData.jobRoles.includes(role) ? "bg-blue-50" : ""}`}>
//                         <div className="flex items-center justify-between">
//                           <span className={formData.jobRoles.includes(role) ? "text-[#667eea] font-medium" : "text-gray-700"}>{role}</span>
//                           {formData.jobRoles.includes(role) && <span className="text-[#667eea]">✓</span>}
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               )}
//             </div>

//             <div>
//               <label className="block font-medium mb-2 text-gray-700">Work Location <span className="text-red-500">*</span></label>
//               <CreatableSelect
//                 isMulti
//                 options={cityOptions}
//                 value={formData.workLocation.map(location => ({ value: location, label: location }))}
//                 onChange={(selectedOptions) => handleLocationChange('workLocation', selectedOptions)}
//                 placeholder="Select or type to add work locations..."
//                 styles={selectStyles}
//               />
//             </div>

//             <div ref={skillsRef} className="relative">
//               <label className="block font-medium mb-2 text-gray-700">Skills <span className="text-red-500">*</span></label>
//               <div className="flex flex-wrap gap-2 mb-2">
//                 {formData.skills.map(skill => (
//                   <div key={skill} className="flex items-center bg-gradient-to-r from-gray-100 to-white border border-gray-200 text-gray-700 text-sm px-3 py-1 rounded-full">
//                     <span>{skill}</span>
//                     <button type="button" onClick={() => removeSelectedItem('skills', skill)} className="ml-2 text-gray-500 hover:text-gray-700"><X size={14} /></button>
//                   </div>
//                 ))}
//               </div>
//               <div onClick={() => toggleDropdown('skills')} className="flex items-center justify-between p-3 w-full border border-gray-200 rounded-lg cursor-pointer hover:border-gray-300 transition-colors bg-gradient-to-r from-gray-50 to-white">
//                 <span className="text-gray-500">Select required skills</span>
//                 <ChevronDown className={`w-5 h-5 transition-transform ${dropdownOpen.skills ? "rotate-180" : ""} text-gray-400`} />
//               </div>
//               {dropdownOpen.skills && (
//                 <div className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
//                   <div className="p-2 border-b border-gray-100 flex">
//                     <input
//                       type="text"
//                       placeholder="Add custom skill..."
//                       value={customSkill}
//                       onChange={(e) => setCustomSkill(e.target.value)}
//                       onClick={(e) => e.stopPropagation()}
//                       onKeyDown={(e) => {
//                         if (e.key === 'Enter') {
//                           e.preventDefault();
//                           handleCustomAdd('skills', customSkill, setCustomSkill, skillsOptions);
//                         }
//                       }}
//                       className="w-full p-2 border border-gray-200 rounded-lg"
//                     />
//                     <button
//                       type="button"
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         handleCustomAdd('skills', customSkill, setCustomSkill, skillsOptions);
//                       }}
//                       className="ml-2 px-4 py-2 bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white rounded-lg text-sm font-medium"
//                     >
//                       Add
//                     </button>
//                   </div>
//                   <div className="max-h-48 overflow-auto">
//                     {skillsOptions.map(skill => (
//                       <div key={skill} onClick={() => handleMultiSelect('skills', skill)} className={`px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 ${formData.skills.includes(skill) ? "bg-blue-50" : ""}`}>
//                         <div className="flex items-center justify-between">
//                           <span className={formData.skills.includes(skill) ? "text-[#667eea] font-medium" : "text-gray-700"}>{skill}</span>
//                           {formData.skills.includes(skill) && <span className="text-[#667eea]">✓</span>}
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               )}
//             </div>

//             <div>
//               <label className="block mb-2 font-medium text-gray-700">Eligibility Criteria <span className="text-red-500">*</span></label>
//               <textarea name="eligibilityCriteria" value={formData.eligibilityCriteria} onChange={handleChange} placeholder="Example: Minimum 60% aggregate, No active backlogs..." className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#667eea]/50 focus:border-transparent focus:outline-none transition-all duration-200 bg-gradient-to-r from-gray-50 to-white resize-none h-24" required></textarea>
//             </div>

//             <div>
//               <label className="block mb-2 font-medium text-gray-700">Job Description <span className="text-red-500">*</span></label>
//               <textarea
//                 name="description"
//                 value={formData.description}
//                 onChange={handleChange}
//                 placeholder="Provide a detailed job description..."
//                 className={`w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#667eea]/50 focus:border-transparent focus:outline-none transition-all duration-200 bg-gradient-to-r from-gray-50 to-white resize-none h-24 ${descriptionError ? 'border-red-500' : ''}`}
//                 maxLength={600}
//                 required
//               ></textarea>
//               <div className="flex justify-between text-xs mt-1">
//                 <span className={descriptionError ? 'text-red-500' : 'text-gray-500'}>
//                   {descriptionError ? descriptionError : `${formData.description.length}/500 characters`}
//                 </span>
//               </div>
//             </div>

//             <div ref={amenitiesRef} className="relative">
//               <label className="block font-medium mb-2 text-gray-700">Amenities/Facilities Required</label>
//               <div className="flex flex-wrap gap-2 mb-2">
//                 {formData.amenitiesRequired.map(amenity => (
//                   <div key={amenity} className="flex items-center bg-gradient-to-r from-gray-100 to-white border border-gray-200 text-gray-700 text-sm px-3 py-1 rounded-full">
//                     <span>{amenity}</span>
//                     <button type="button" onClick={() => removeSelectedItem('amenitiesRequired', amenity)} className="ml-2 text-gray-500 hover:text-gray-700"><X size={14} /></button>
//                   </div>
//                 ))}
//               </div>
//               <div className="flex items-center justify-between p-3 w-full border border-gray-200 rounded-lg cursor-pointer hover:border-gray-300 transition-colors bg-gradient-to-r from-gray-50 to-white" onClick={() => toggleDropdown('amenities')}>
//                 <span className="text-gray-500">Select required amenities</span>
//                 <ChevronDown className={`w-5 h-5 transition-transform ${dropdownOpen.amenities ? "rotate-180" : ""} text-gray-400`} />
//               </div>
//               {dropdownOpen.amenities && (
//                 <div className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
//                   {amenitiesOptions.map(amenity => (
//                     <div key={amenity} onClick={() => handleMultiSelect('amenitiesRequired', amenity)} className={`px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 ${formData.amenitiesRequired.includes(amenity) ? "bg-blue-50" : ""}`}>
//                       <div className="flex items-center justify-between">
//                         <span className={formData.amenitiesRequired.includes(amenity) ? "text-[#667eea] font-medium" : "text-gray-700"}>{amenity}</span>
//                         {formData.amenitiesRequired.includes(amenity) && <span className="text-[#667eea]">✓</span>}
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>

//             <div ref={benefitsRef} className="relative">
//               <label className="block font-medium mb-2 text-gray-700">Benefits Offered <span className="text-red-500">*</span></label>
//               <div className="flex flex-wrap gap-2 mb-2">
//                 {formData.benefits.map(benefit => (
//                   <div key={benefit} className="flex items-center bg-gradient-to-r from-gray-100 to-white border border-gray-200 text-gray-700 text-sm px-3 py-1 rounded-full">
//                     <span>{benefit}</span>
//                     <button type="button" onClick={() => removeSelectedItem('benefits', benefit)} className="ml-2 text-gray-500 hover:text-gray-700"><X size={14} /></button>
//                   </div>
//                 ))}
//               </div>
//               <div onClick={() => toggleDropdown('benefits')} className="flex items-center justify-between p-3 w-full border border-gray-200 rounded-lg cursor-pointer hover:border-gray-300 transition-colors bg-gradient-to-r from-gray-50 to-white">
//                 <span className="text-gray-500">Select benefits</span>
//                 <ChevronDown className={`w-5 h-5 transition-transform ${dropdownOpen.benefits ? "rotate-180" : ""} text-gray-400`} />
//               </div>
//               {dropdownOpen.benefits && (
//                 <div className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
//                   {benefitsOptions.map(benefit => (
//                     <div key={benefit} onClick={() => handleMultiSelect('benefits', benefit)} className={`px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 ${formData.benefits.includes(benefit) ? "bg-blue-50" : ""}`}>
//                       <div className="flex items-center justify-between">
//                         <span className={formData.benefits.includes(benefit) ? "text-[#667eea] font-medium" : "text-gray-700"}>{benefit}</span>
//                         {formData.benefits.includes(benefit) && <span className="text-[#667eea]">✓</span>}
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>

//             <div>
//               <label className="block mb-2 font-medium text-gray-700">Package Details <span className="text-red-500">*</span></label>
//               <div className="flex mb-2">
//                 <div className="relative w-24">
//                   <select
//                     name="currency"
//                     value={formData.packageDetails.currency}
//                     onChange={handlePackageDetailsChange}
//                     className="w-full h-full p-2 border border-gray-200 rounded-l-lg appearance-none bg-gradient-to-r from-gray-50 to-white pr-8 text-center focus:ring-2 focus:ring-[#667eea]/50 focus:border-transparent focus:outline-none"
//                   >
//                     <option value="INR">INR</option>
//                     <option value="USD">USD</option>
//                     <option value="EUR">EUR</option>
//                   </select>
//                   <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
//                 </div>
//                 <input
//                   type="number"
//                   name="totalCTC"
//                   value={formData.packageDetails.totalCTC}
//                   onChange={handlePackageDetailsChange}
//                   placeholder="Total CTC (e.g. 1000000)"
//                   className="flex-1 p-3 border border-l-0 border-gray-200 rounded-r-lg focus:ring-2 focus:ring-[#667eea]/50 focus:border-transparent focus:outline-none transition-all duration-200 bg-gradient-to-r from-gray-50 to-white"
//                   required
//                 />
//               </div>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <input
//                   type="number"
//                   name="fixedPay"
//                   value={formData.packageDetails.fixedPay}
//                   onChange={handlePackageDetailsChange}
//                   placeholder="Fixed Pay (e.g. 800000)"
//                   className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#667eea]/50 focus:border-transparent focus:outline-none transition-all duration-200 bg-gradient-to-r from-gray-50 to-white"
//                 />
//                 <input
//                   type="number"
//                   name="joiningBonus"
//                   value={formData.packageDetails.joiningBonus}
//                   onChange={handlePackageDetailsChange}
//                   placeholder="Variable Pay (e.g. 50000)"
//                   className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#667eea]/50 focus:border-transparent focus:outline-none transition-all duration-200 bg-gradient-to-r from-gray-50 to-white"
//                 />
//               </div>
//             </div>

//             <div>
//               <label className="block mb-2 font-medium text-gray-700">Tentative Date of Placement / Hiring <span className="text-red-500">*</span></label>
//               <div className="flex space-x-4">
//                 <div className="w-1/2">
//                   <label className="block mb-1 text-sm text-gray-600">Start Date</label>
//                   <div className="relative">
//                     <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
//                     <input 
//                       type="date" 
//                       name="startDate" 
//                       value={formData.startDate} 
//                       onChange={handleChange} 
//                       onClick={(e) => e.target.showPicker && e.target.showPicker()} 
//                       className="w-full p-3 pl-10 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#667eea]/50 focus:border-transparent focus:outline-none transition-all duration-200 bg-gradient-to-r from-gray-50 to-white" 
//                       required 
//                     />
//                   </div>
//                 </div>
//                 <div className="w-1/2">
//                   <label className="block mb-1 text-sm text-gray-600">End Date</label>
//                   <div className="relative">
//                     <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
//                     <input 
//                       type="date" 
//                       name="endDate" 
//                       value={formData.endDate} 
//                       onChange={handleChange} 
//                       onClick={(e) => e.target.showPicker && e.target.showPicker()} 
//                       className="w-full p-3 pl-10 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#667eea]/50 focus:border-transparent focus:outline-none transition-all duration-200 bg-gradient-to-r from-gray-50 to-white" 
//                       required 
//                     />
//                   </div>
//                 </div>
//               </div>
//             </div>
            
//             <div>
//               <label className="block mb-2 font-medium text-gray-700">Hiring Timeline</label>
//               <div className="space-y-4">
//                 <div>
//                   <label className="block mb-1 text-sm text-gray-600">Online Test Date</label>
//                   <div className="relative">
//                     <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
//                     <input 
//                       type="date" 
//                       name="onlineTestDate" 
//                       className="w-full p-3 pl-10 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#667eea]/50 focus:border-transparent focus:outline-none transition-all duration-200 bg-gradient-to-r from-gray-50 to-white" 
//                       value={formData.onlineTestDate} 
//                       onChange={handleChange} 
//                       onClick={(e) => e.target.showPicker && e.target.showPicker()} 
//                     />
//                   </div>
//                 </div>

//                 <div className="flex space-x-4">
//                   <div className="w-1/2">
//                     <label className="block mb-1 text-sm text-gray-600">Interview Window (Start)</label>
//                     <div className="relative">
//                       <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
//                       <input 
//                         type="date" 
//                         name="start" 
//                         className="w-full p-3 pl-10 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#667eea]/50 focus:border-transparent focus:outline-none transition-all duration-200 bg-gradient-to-r from-gray-50 to-white" 
//                         value={formData.interviewWindow.start} 
//                         onChange={handleInterviewWindowChange} 
//                         onClick={(e) => e.target.showPicker && e.target.showPicker()} 
//                       />
//                     </div>
//                   </div>
//                   <div className="w-1/2">
//                     <label className="block mb-1 text-sm text-gray-600">Interview Window (End)</label>
//                     <div className="relative">
//                       <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
//                       <input 
//                         type="date" 
//                         name="end" 
//                         className="w-full p-3 pl-10 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#667eea]/50 focus:border-transparent focus:outline-none transition-all duration-200 bg-gradient-to-r from-gray-50 to-white" 
//                         value={formData.interviewWindow.end} 
//                         onChange={handleInterviewWindowChange} 
//                         onClick={(e) => e.target.showPicker && e.target.showPicker()} 
//                       />
//                     </div>
//                   </div>
//                 </div>
                
//                 <div>
//                   <label className="block mb-1 text-sm text-gray-600">Offer Rollout Date</label>
//                   <div className="relative">
//                     <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
//                     <input 
//                       type="date" 
//                       name="offerRolloutDate" 
//                       className="w-full p-3 pl-10 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#667eea]/50 focus:border-transparent focus:outline-none transition-all duration-200 bg-gradient-to-r from-gray-50 to-white" 
//                       value={formData.offerRolloutDate} 
//                       onChange={handleChange} 
//                       onClick={(e) => e.target.showPicker && e.target.showPicker()} 
//                     />
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <div>
//               <label className="block mb-2 font-medium text-gray-700">Number of Rounds <span className="text-red-500">*</span></label>
//               <div className="relative">
//                 <select name="numberOfRounds" value={formData.numberOfRounds} onChange={handleChange} className="w-full p-3 border border-gray-200 rounded-lg appearance-none bg-gradient-to-r from-gray-50 to-white pr-10 focus:ring-2 focus:ring-[#667eea]/50 focus:border-transparent focus:outline-none transition-all duration-200" required>
//                   <option value="" disabled>Select number of rounds</option>
//                   {numberOfRoundsOptions.map((round) => (<option key={round} value={round}>{round}</option>))}
//                 </select>
//                 <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
//               </div>
//             </div>

//             <div ref={selectionProcessRef} className="relative">
//               <label className="block font-medium mb-2 text-gray-700">Process of Selection <span className="text-red-500">*</span></label>
//               <div
//                 onClick={() => toggleDropdown('selectionProcess')}
//                 className="flex items-center justify-between p-3 w-full border border-gray-200 rounded-lg cursor-pointer hover:border-gray-300 transition-colors min-h-[42px] bg-gradient-to-r from-gray-50 to-white"
//               >
//                 <span className={formData.selectionProcess.length > 0 ? "text-gray-700" : "text-gray-500"}>
//                   {formData.selectionProcess.length > 0
//                     ? formData.selectionProcess.join(' + ')
//                     : 'Select process'}
//                 </span>
//                 <ChevronDown className={`w-5 h-5 transition-transform ${dropdownOpen.selectionProcess ? "rotate-180" : ""} text-gray-400`} />
//               </div>
//               {dropdownOpen.selectionProcess && (
//                 <div className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
//                   {processOptions.map(process => (
//                     <div
//                       key={process}
//                       onClick={() => handleMultiSelect('selectionProcess', process)}
//                       className={`px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 ${formData.selectionProcess.includes(process) ? "bg-blue-50" : ""}`}
//                     >
//                       <div className="flex items-center justify-between">
//                         <span className={formData.selectionProcess.includes(process) ? "text-[#667eea] font-medium" : "text-gray-700"}>{process}</span>
//                         {formData.selectionProcess.includes(process) && <span className="text-[#667eea]">✓</span>}
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>

//             <div ref={tagsRef} className="relative">
//               <label className="block font-medium mb-2 text-gray-700">Tags</label>
//               <div className="flex flex-wrap gap-2 mb-2">
//                 {formData.tags.map(tag => (
//                   <div key={tag} className="flex items-center bg-gradient-to-r from-gray-100 to-white border border-gray-200 text-gray-700 text-sm px-3 py-1 rounded-full">
//                     <span>{tag}</span>
//                     <button type="button" onClick={() => removeSelectedItem('tags', tag)} className="ml-2 text-gray-500 hover:text-gray-700"><X size={14} /></button>
//                   </div>
//                 ))}
//               </div>
//               <div onClick={() => toggleDropdown('tags')} className="flex items-center justify-between p-3 w-full border border-gray-200 rounded-lg cursor-pointer hover:border-gray-300 transition-colors bg-gradient-to-r from-gray-50 to-white">
//                 <span className="text-gray-500">Select tags</span>
//                 <ChevronDown className={`w-5 h-5 transition-transform ${dropdownOpen.tags ? "rotate-180" : ""} text-gray-400`} />
//               </div>
//               {dropdownOpen.tags && (
//                 <div className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
//                   {tagsOptions.map(tag => (
//                     <div key={tag} onClick={() => handleMultiSelect('tags', tag)} className={`px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 ${formData.tags.includes(tag) ? "bg-blue-50" : ""}`}>
//                       <div className="flex items-center justify-between">
//                         <span className={formData.tags.includes(tag) ? "text-[#667eea] font-medium" : "text-gray-700"}>{tag}</span>
//                         {formData.tags.includes(tag) && <span className="text-[#667eea]">✓</span>}
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>

//             <div>
//               <label className="block mb-2 font-medium text-gray-700">Contact Person <span className="text-red-500">*</span></label>
//               <input type="text" name="name" value={formData.contactPerson.name} onChange={handleContactChange} placeholder="Enter full name" className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#667eea]/50 focus:border-transparent focus:outline-none transition-all duration-200 bg-gradient-to-r from-gray-50 to-white" required />
//             </div>

//             <div>
//               <label className="block mb-2 font-medium text-gray-700">Contact person designation <span className="text-red-500">*</span></label>
//               <div className="relative">
//                 <select name="designation" value={formData.contactPerson.designation} onChange={handleContactChange} className="w-full p-3 border border-gray-200 rounded-lg appearance-none bg-gradient-to-r from-gray-50 to-white pr-10 focus:ring-2 focus:ring-[#667eea]/50 focus:border-transparent focus:outline-none transition-all duration-200" required>
//                   <option value="" disabled>Select designation</option>
//                   {designationOptions.map((designation) => (<option key={designation} value={designation}>{designation}</option>))}
//                 </select>
//                 <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
//               </div>
//             </div>

//             <div>
//               <label className="block mb-2 font-medium text-gray-700">Contact person email <span className="text-red-500">*</span></label>
//               <div className="relative">
//                 <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
//                 <input type="email" name="email" value={formData.contactPerson.email} onChange={handleContactChange} placeholder="example@company.com" className="w-full p-3 pl-10 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#667eea]/50 focus:border-transparent focus:outline-none transition-all duration-200 bg-gradient-to-r from-gray-50 to-white" required />
//               </div>
//             </div>

//             <div>
//               <label className="block mb-2 font-medium text-gray-700">Contact person mobile no <span className="text-red-500">*</span></label>
//               <div className="relative">
//                 <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
//                 <input type="tel" name="mobile" value={formData.contactPerson.mobile} onChange={handleContactChange} placeholder="Enter 10-digit mobile number" className="w-full p-3 pl-10 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#667eea]/50 focus:border-transparent focus:outline-none transition-all duration-200 bg-gradient-to-r from-gray-50 to-white" required />
//               </div>
//             </div>

//             <div>
//               <label className="block mb-2 font-medium text-gray-700">Contact person LinkedIn Profile</label>
//               <div className="relative">
//                 <Link className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
//                 <input type="url" name="linkedin" value={formData.contactPerson.linkedin} onChange={handleContactChange} placeholder="https://www.linkedin.com/in/username" className="w-full p-3 pl-10 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#667eea]/50 focus:border-transparent focus:outline-none transition-all duration-200 bg-gradient-to-r from-gray-50 to-white" />
//               </div>
//             </div>

//             <div>
//               <label className="block mb-2 font-medium text-gray-700">Minimum Students to be Hired <span className="text-red-500">*</span></label>
//               <div className="relative">
//                 <select name="minStudents" value={formData.minStudents} onChange={handleChange} className="w-full p-3 border border-gray-200 rounded-lg appearance-none bg-gradient-to-r from-gray-50 to-white pr-10 focus:ring-2 focus:ring-[#667eea]/50 focus:border-transparent focus:outline-none transition-all duration-200" required>
//                   <option value="" disabled>Select minimum students</option>
//                   {minStudentsOptions.map((option) => (<option key={option} value={option}>{option}</option>))}
//                 </select>
//                 <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
//               </div>
//             </div>

//             <div className="flex justify-between pt-4">
//               <button
//                 type="button"
//                 onClick={() => window.history.back()}
//                 className="px-6 py-2 text-[#667eea] hover:text-[#764ba2] font-medium transition-colors"
//               >
//                 ← Back
//               </button>
//               <button type="submit" disabled={isSubmitting} className="px-8 py-3 bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white font-semibold rounded-lg shadow-md hover:shadow-lg hover:shadow-[#667eea]/30 focus:outline-none focus:ring-2 focus:ring-[#667eea]/50 transition-all duration-200 disabled:opacity-50">
//                 {isSubmitting ? 'Submitting...' : 'Register'}
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }


import { useState, useRef, useEffect, useMemo } from 'react';
import axios from 'axios';
import { ChevronDown, X, Mail, Phone, Link, Building2, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';
import CreatableSelect from 'react-select/creatable';
import { City } from 'country-state-city';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import BackButton from '@/components/layout/BackButton';

export default function RequestInfo() {
  const degreeStreamMapping = {
    'B.E': ['Computer Science', 'Electrical Engineering', 'Mechanical Engineering', 'Civil Engineering', 'Information Technology', 'Electronics & Communication', 'Chemical Engineering', 'Biotechnology', 'Aerospace Engineering'],
    'B.Tech': ['Computer Science', 'Electrical Engineering', 'Mechanical Engineering', 'Civil Engineering', 'Information Technology', 'Electronics & Communication', 'Chemical Engineering', 'Biotechnology', 'Aerospace Engineering', 'Data Science'],
    'M.Tech': ['Computer Science', 'Data Science', 'AI & Machine Learning', 'Cyber Security', 'VLSI Design', 'Structural Engineering'],
    'B.Sc': ['Physics', 'Chemistry', 'Mathematics', 'Computer Science', 'Statistics', 'Biology'],
    'M.Sc': ['Physics', 'Chemistry', 'Mathematics', 'Computer Science', 'Statistics', 'Biology', 'Data Science'],
    'B.Com': ['Accounting', 'Finance', 'Taxation', 'Economics', 'Marketing'],
    'M.Com': ['Accounting', 'Finance', 'Taxation', 'International Business'],
    'BBA': ['Marketing', 'Finance', 'Human Resources', 'Operations Management'],
    'MBA': ['Marketing', 'Finance', 'Human Resources', 'Operations Management', 'IT & Systems', 'International Business'],
    'B.A': ['History', 'Political Science', 'Sociology', 'English Literature', 'Economics', 'Psychology'],
    'M.A': ['History', 'Political Science', 'Sociology', 'English Literature', 'Economics', 'Psychology'],
    'PhD': ['All Specializations'],
    'Postgraduate Diploma': ['Varies by Specialization'],
  };

  const degreeOptions = Object.keys(degreeStreamMapping).sort();
  
  const collegeCategoryOptions = ['Tier 1', 'Tier 2', 'Tier 3', 'Autonomous', 'All Colleges'];
  const preferredModeOptions = ['Online', 'Offline', 'Hybrid', 'Online Aptitude and Physical Interview'];
  const jobRoleOptions = ['Software Engineer', 'Data Analyst', 'DevOps Engineer', 'UX/UI Designer', 'Product Manager', 'QA Engineer', 'System Administrator', 'Network Engineer', 'Business Analyst', 'Machine Learning Engineer'];
  const skillsOptions = ['JavaScript', 'Python', 'Java', 'React', 'Node.js', 'HTML/CSS', 'SQL', 'MongoDB', 'AWS', 'Docker', 'Kubernetes', 'Machine Learning', 'Data Structures', 'Algorithms', 'Git', 'REST APIs'];
  const roundsOptions = ['1 Round', '2 Rounds', '3 Rounds', '4 Rounds', '5 Rounds', '6 Rounds', '7+ Rounds'];
  const processOptions = ['Online Test', 'Coding Test', 'Aptitude Test', 'Group Discussion', 'Technical Interview', 'HR Interview', 'Case Study', 'Presentation'].sort((a, b) => a.localeCompare(b));
  const designationOptions = ['HR Manager', 'Talent Acquisition Specialist', 'Recruitment Lead', 'Campus Relations Manager', 'Technical Recruiter'];
  const minStudentsOptions = ['1-5 students', '6-10 students', '11-20 students', '21-50 students', '51-100 students', '100+ students'];
  const amenitiesOptions = ['Projector', 'Auditorium', 'Interview Rooms', 'Wi-Fi Access', 'Refreshments', 'Parking'];
  const benefitsOptions = ['Health Insurance', 'Provident Fund (PF)', 'Paid Time Off (PTO)', 'Work from Home', 'Performance Bonus', 'Stock Options'];
  const tagsOptions = ['Urgent hiring', 'Fresher preferred', 'Remote-friendly', 'Work from Home', 'InternSHIP-eligible', 'Hybrid', 'High Priority', 'Contract', 'Part-time', 'Full-time'];

  const initialData = {
    degree: [],
    stream: [],
    collegeCategories: [], 
    preferredLocations: [],
    lookingFor: '',
    employmentType: [],
    workLocation: [],
    workMode: '',
    companyHiringPreference: { preferredMode: '' },
    jobRoles: [],
    skills: [],
    packageDetails: { currency: 'INR', totalCTC: '', fixedPay: '', joiningBonus: '' },
    startDate: '', 
    endDate: '',  
    onlineTestDate: '',
    interviewWindow: { start: '', end: '' },
    offerRolloutDate: '',
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

  const [formData, setFormData] = useState(() => {
    const savedData = localStorage.getItem('pendingOnCampusJobCreate');
    if (!savedData) return initialData;

    try {
      const parsed = JSON.parse(savedData);

      // Revive simple date fields
      if (parsed.startDate) parsed.startDate = new Date(parsed.startDate);
      if (parsed.endDate) parsed.endDate = new Date(parsed.endDate);
      if (parsed.onlineTestDate) parsed.onlineTestDate = new Date(parsed.onlineTestDate);
      if (parsed.offerRolloutDate) parsed.offerRolloutDate = new Date(parsed.offerRolloutDate);

      // Revive nested interview window dates
      if (parsed.interviewWindow?.start) {
        parsed.interviewWindow.start = new Date(parsed.interviewWindow.start);
      }
      if (parsed.interviewWindow?.end) {
        parsed.interviewWindow.end = new Date(parsed.interviewWindow.end);
      }

      return parsed;
    } catch (e) {
      console.error("Error parsing saved On-Campus Create data:", e);
      return initialData;
    }
  });
  const [descriptionError, setDescriptionError] = useState("");

  const cityOptions = useMemo(() =>
    City.getCitiesOfCountry('IN').map(city => ({
      value: city.name,
      label: city.name,
    })),
  []);

  const [customDegree, setCustomDegree] = useState('');
  const [customStream, setCustomStream] = useState('');
  const [customJobRole, setCustomJobRole] = useState('');
  const [customSkill, setCustomSkill] = useState('');

  const [dropdownOpen, setDropdownOpen] = useState({
    degree: false,
    stream: false,
    collegeCategories: false, 
    preferredLocations: false,
    jobRoles: false,
    skills: false,
    selectionProcess: false,
    workLocation: false,
    amenities: false,
    benefits: false,
    tags: false
  });

  const degreeRef = useRef(null);
  const streamRef = useRef(null);
  const collegeCategoriesRef = useRef(null); 
  const preferredLocationsRef = useRef(null);
  const jobRolesRef = useRef(null);
  const skillsRef = useRef(null);
  const selectionProcessRef = useRef(null);
  const amenitiesRef = useRef(null);
  const benefitsRef = useRef(null);
  const tagsRef = useRef(null);
  const workLocationRef = useRef(null);

  useEffect(() => {
    localStorage.setItem('pendingOnCampusJobCreate', JSON.stringify(formData));
  }, [formData]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      const dropdownRefs = {
        degree: degreeRef,
        stream: streamRef,
        collegeCategories: collegeCategoriesRef, 
        preferredLocations: preferredLocationsRef,
        jobRoles: jobRolesRef,
        skills: skillsRef,
        selectionProcess: selectionProcessRef,
        amenities: amenitiesRef,
        benefits: benefitsRef,
        tags: tagsRef,
        workLocation: workLocationRef,
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

  useEffect(() => {
    setFormData(prev => ({ ...prev, stream: [] }));
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
      interviewWindow: {
        ...prev.interviewWindow,
        [field]: formattedDate
      }
    }));
  };

  const handlePackageDetailsChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      packageDetails: { ...prev.packageDetails, [name]: value }
    }));
  };
  
  const handleHiringPreferenceChange = (value) => {
    setFormData(prev => ({
      ...prev,
      companyHiringPreference: { preferredMode: value }
    }));
  };

  {/*const handleMultiSelect = (field, value) => {
    setFormData(prev => {
      const currentValues = prev[field] || [];
      const newValues = currentValues.includes(value)
        ? currentValues.filter(item => item !== value)
        : [...currentValues, value];
      return { ...prev, [field]: newValues };
    });
  };*/}

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

  const handleLocationChange = (field, selectedOptions) => {
    setFormData(prev => ({
      ...prev,
      [field]: selectedOptions ? selectedOptions.map(option => option.value) : []
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
        degree: formData.degree,
        studentStreams: formData.stream,
        collegeCategories: formData.collegeCategories, 
        location: formData.preferredLocations,
        lookingFor: formData.lookingFor,
        employmentType: formData.employmentType,
        workMode: formData.workMode,
        companyHiringPreference: formData.companyHiringPreference,
        jobRoles: formData.jobRoles,
        workLocation: formData.workLocation,
        skills: formData.skills,
        packageDetails: {
          currency: formData.packageDetails.currency,
          totalCTC: parseFloat(formData.packageDetails.totalCTC) || 0,
          fixedPay: parseFloat(formData.packageDetails.fixedPay) || 0,
          joiningBonus: parseFloat(formData.packageDetails.joiningBonus) || 0
        },
        startDate: formData.startDate,
        endDate: formData.endDate,
        onlineTestDate: formData.onlineTestDate,
        interviewWindow: formData.interviewWindow,
        offerRolloutDate: formData.offerRolloutDate,
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
        `${import.meta.env.VITE_Backend_URL}/api/employer/hiring-channel/create-Oncampusjob`,
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
          toast.success('This job will expire after 30 days');
        }, 2000);
        localStorage.removeItem('pendingOnCampusJobCreate');
        setFormData(initialData);
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || err.response?.data?.error || 'Submission failed. Please try again.');
    }
  };

  const availableStreams = (() => {
    if (formData.degree.length === 0) {
      return [];
    }
    const allStreams = new Set();
    formData.degree.forEach(degree => {
      if (degreeStreamMapping[degree]) {
        degreeStreamMapping[degree].forEach(stream => allStreams.add(stream));
      }
    });
    return [...allStreams].sort((a, b) => a.localeCompare(b));
  })();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#667eea]/5 via-[#f093fb]/5 to-[#764ba2]/5 py-4">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header Section - More Compact */}
        <div className="bg-white/90 backdrop-blur-sm border border-gray-100 rounded-xl shadow p-4 mb-6">
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <div className="p-2 bg-gradient-to-br from-[#667eea]/20 to-[#764ba2]/20 rounded-lg mr-3">
                <Building2 className="h-5 w-5 text-[#667eea]" />
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent">
                OnCampus Connect: Hire Smarter
              </h1>
            </div>
            <p className="text-sm text-gray-600 max-w-2xl mx-auto">
              Our OnCampus service brings career opportunities directly to students, connecting them with top employers through campus recruitment drives.
            </p>
          </div>
        </div>

        {/* Main Form - Two Column Layout */}
        <div className="bg-white/90 backdrop-blur-sm border border-gray-100 rounded-xl shadow p-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent">Register for On-Campus Hiring</h2>
            <p className="text-gray-500 text-sm mt-1">Fill in your requirements to find the best talent from campuses across the nation.</p>
          </div>

          <div className="space-y-6">
            {/* First Row: Degree and Stream */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Degree */}
<div ref={degreeRef} className="relative">
  <label className="block font-medium mb-2 text-sm text-gray-700">Degree</label>
  
  {/* Selected degrees - removed scrolling */}
  <div className="flex flex-wrap gap-1 mb-2">
    {formData.degree.map(degree => (
      <div key={degree} className="flex items-center bg-gradient-to-r from-gray-100 to-white border border-gray-200 text-gray-700 text-xs px-2 py-1 rounded-full">
        <span>{degree}</span>
        <button type="button" onClick={() => removeSelectedItem('degree', degree)} className="ml-1 text-gray-500 hover:text-gray-700"><X size={12} /></button>
      </div>
    ))}
  </div>
  
  <div
    className="flex items-center justify-between p-2 w-full border border-gray-200 rounded-lg cursor-pointer hover:border-gray-300 transition-colors bg-gradient-to-r from-gray-50 to-white"
    onClick={() => toggleDropdown('degree')}
  >
    <span className="text-sm text-gray-500">Select degree(s)</span>
    <ChevronDown className={`w-4 h-4 transition-transform ${dropdownOpen.degree ? "rotate-180" : ""} text-gray-400`} />
  </div>
  
  {dropdownOpen.degree && (
    <div className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-hidden">
      {/* Custom input section */}
      <div className="p-2 border-b border-gray-100 bg-gray-50">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Add custom degree..."
            value={customDegree}
            onChange={(e) => setCustomDegree(e.target.value)}
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleCustomAdd('degree', customDegree, setCustomDegree);
              }
            }}
            className="flex-1 p-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#667eea]/50 focus:outline-none"
          />
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleCustomAdd('degree', customDegree, setCustomDegree);
            }}
            className="px-4 py-2 bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white rounded-lg text-xs font-bold whitespace-nowrap"
          >
            Add
          </button>
        </div>
      </div>
      
      {/* Scrollable list ONLY */}
      <div className="overflow-y-auto max-h-48">
        {degreeOptions.map(option => (
          <div 
            key={option} 
            onClick={() => handleMultiSelect('degree', option)} 
            className={`px-3 py-2.5 hover:bg-gray-50 cursor-pointer border-b border-gray-100 flex items-center justify-between ${
              formData.degree.includes(option) ? "bg-blue-50/50" : ""
            }`}
          >
            <span className={`text-sm ${formData.degree.includes(option) ? "text-[#667eea] font-semibold" : "text-gray-700"}`}>
              {option}
            </span>
            {formData.degree.includes(option) && <span className="text-[#667eea] font-bold">✓</span>}
          </div>
        ))}
        
        {degreeOptions.length === 0 && (
          <div className="p-4 text-center text-gray-400 text-xs italic">
            No degree options found. Add a degree above.
          </div>
        )}
      </div>
    </div>
  )}
</div>

              {/* Stream */}
<div ref={streamRef} className="relative">
  <label className="block font-medium mb-2 text-sm text-gray-700">Stream</label>
  
  {/* Selected streams - removed scrolling */}
  <div className="flex flex-wrap gap-1 mb-2">
    {formData.stream.map(stream => (
      <div key={stream} className="flex items-center bg-gradient-to-r from-gray-100 to-white border border-gray-200 text-gray-700 text-xs px-2 py-1 rounded-full">
        <span>{stream}</span>
        <button type="button" onClick={() => removeSelectedItem('stream', stream)} className="ml-1 text-gray-500 hover:text-gray-700"><X size={12} /></button>
      </div>
    ))}
  </div>
  
  <div
    className={`flex items-center justify-between p-2 w-full border rounded-lg ${!formData.degree.length ? 'bg-gray-50 cursor-not-allowed' : 'cursor-pointer hover:border-gray-300 transition-colors bg-gradient-to-r from-gray-50 to-white'} border-gray-200`}
    onClick={() => formData.degree.length > 0 && toggleDropdown('stream')}
  >
    <span className="text-sm text-gray-500">
      {formData.degree.length > 0 ? 'Select stream(s)' : 'Select degree first'}
    </span>
    <ChevronDown className={`w-4 h-4 transition-transform ${dropdownOpen.stream ? "rotate-180" : ""} text-gray-400`} />
  </div>
  
  {dropdownOpen.stream && formData.degree.length > 0 && (
    <div className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-hidden">
      {/* Custom input section */}
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
                handleCustomAdd('stream', customStream, setCustomStream);
              }
            }}
            className="flex-1 p-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#667eea]/50 focus:outline-none"
          />
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleCustomAdd('stream', customStream, setCustomStream);
            }}
            className="px-4 py-2 bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white rounded-lg text-xs font-bold whitespace-nowrap"
          >
            Add
          </button>
        </div>
      </div>
      
      {/* Scrollable list ONLY */}
      <div className="overflow-y-auto max-h-48">
        {availableStreams.length > 0 ? (
          availableStreams.map(stream => (
            <div 
              key={stream} 
              onClick={() => handleMultiSelect('stream', stream)} 
              className={`px-3 py-2.5 hover:bg-gray-50 cursor-pointer border-b border-gray-100 flex items-center justify-between ${
                formData.stream.includes(stream) ? "bg-blue-50/50" : ""
              }`}
            >
              <span className={`text-sm ${formData.stream.includes(stream) ? "text-[#667eea] font-semibold" : "text-gray-700"}`}>
                {stream}
              </span>
              {formData.stream.includes(stream) && <span className="text-[#667eea] font-bold">✓</span>}
            </div>
          ))
        ) : (
          <div className="p-4 text-center text-gray-400 text-xs italic">
            No streams found. Add streams manually.
          </div>
        )}
      </div>
    </div>
  )}
</div>
            </div>

            {/* Second Row: College Categories and Preferred Locations */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* College Categories */}
              <div ref={collegeCategoriesRef} className="relative">
                <label className="block font-medium mb-2 text-sm text-gray-700">College Categories</label>
                <div className="flex flex-wrap gap-1 mb-1 max-h-20 overflow-y-auto">
                  {formData.collegeCategories.map(type => (
                    <div key={type} className="flex items-center bg-gradient-to-r from-gray-100 to-white border border-gray-200 text-gray-700 text-xs px-2 py-1 rounded-full">
                      <span>{type}</span>
                      <button type="button" onClick={() => removeSelectedItem('collegeCategories', type)} className="ml-1 text-gray-500 hover:text-gray-700"><X size={12} /></button>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between p-2 w-full border border-gray-200 rounded-lg cursor-pointer hover:border-gray-300 transition-colors bg-gradient-to-r from-gray-50 to-white" onClick={() => toggleDropdown('collegeCategories')}>
                  <span className="text-sm text-gray-500">Select categories</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${dropdownOpen.collegeCategories ? "rotate-180" : ""} text-gray-400`} />
                </div>
                {dropdownOpen.collegeCategories && (
                  <div className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-auto">
                    {collegeCategoryOptions.map(type => (
                      <div key={type} onClick={() => handleMultiSelect('collegeCategories', type)} className={`px-3 py-2 hover:bg-gray-50 cursor-pointer border-b border-gray-100 ${formData.collegeCategories.includes(type) ? "bg-blue-50" : ""}`}>
                        <div className="flex items-center justify-between">
                          <span className={`text-sm ${formData.collegeCategories.includes(type) ? "text-[#667eea] font-medium" : "text-gray-700"}`}>{type}</span>
                          {formData.collegeCategories.includes(type) && <span className="text-[#667eea]">✓</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Preferred Hiring Locations */}
              <div className='mt-1'>
                <label className="block font-medium mb-2 text-sm text-gray-700">Preferred Locations</label>
                <CreatableSelect
                  isMulti
                  options={cityOptions}
                  value={formData.preferredLocations.map(location => ({ value: location, label: location }))}
                  onChange={(selectedOptions) => handleLocationChange('preferredLocations', selectedOptions)}
                  placeholder="Select or type locations..."
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
            </div>

            {/* Third Row: Broadcast Type and Looking For */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Broadcast Type */}
              <div>
                <label className="block mb-2 font-medium text-sm text-gray-700">Broadcast Options <span className="text-red-500">*</span></label>
                <div className="space-y-2">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="broadcastType"
                      value="Everyone"
                      checked={formData.broadcastType === 'Everyone'}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-[#667eea] border-gray-300 focus:ring-[#667eea]"
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
                      className="h-4 w-4 text-[#667eea] border-gray-300 focus:ring-[#667eea]"
                    />
                    <span className="ml-2 text-sm text-gray-700">Broadcast by Location</span>
                  </label>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  'Broadcast by Location' shows job only to specified locations.
                </p>
              </div>

              {/* Looking for */}
              <div>
                <label className="block mb-2 font-medium text-sm text-gray-700">Looking for</label>
                <div className="flex gap-2">
                  {['Job', 'Internship', 'Both'].map(type => (
                    <button 
                      key={type} 
                      type="button" 
                      className={`flex-1 px-3 py-2 text-sm border rounded-lg transition-colors ${formData.lookingFor === type ? 'bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white border-transparent' : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300'}`} 
                      onClick={() => handleOptionSelect('lookingFor', type)}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Fourth Row: Employment Type and Work Mode */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Employment type */}
              <div>
                <label className="block mb-2 font-medium text-sm text-gray-700">Employment type</label>
                <div className="flex flex-wrap gap-2">
                  {['Part-time', 'Full-time', 'Contract'].map(type => (
                    <button 
                      key={type} 
                      type="button" 
                      className={`px-3 py-1.5 text-sm border rounded-lg transition-colors ${formData.employmentType.includes(type) ? 'bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white border-transparent' : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300'}`} 
                      onClick={() => handleMultiSelect('employmentType', type)}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Work Mode */}
              <div>
                <label className="block mb-2 font-medium text-sm text-gray-700">Work Mode</label>
                <div className="flex flex-wrap gap-2">
                  {['Hybrid', 'On-site', 'Remote'].map(mode => (
                    <button 
                      key={mode} 
                      type="button" 
                      className={`px-3 py-1.5 text-sm border rounded-lg transition-colors ${formData.workMode === mode ? 'bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white border-transparent' : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300'}`} 
                      onClick={() => handleOptionSelect('workMode', mode)}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Fifth Row: Preferred Hiring Mode */}
            <div>
              <label className="block mb-2 font-medium text-sm text-gray-700">Preferred Hiring Mode</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {preferredModeOptions.map(mode => (
                  <button 
                    key={mode} 
                    type="button" 
                    className={`px-3 py-2 text-sm border rounded-lg transition-colors ${formData.companyHiringPreference.preferredMode === mode ? 'bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white border-transparent' : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300'}`} 
                    onClick={() => handleHiringPreferenceChange(mode)}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>

            {/* Sixth Row: Job Roles and Work Location */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
  {/* Job Roles */}
  <div>
    <label className="block font-medium mb-2 text-sm text-gray-700">Job Roles</label>
    <div ref={jobRolesRef} className="relative">
      {/* Selected roles - removed scrolling */}
      <div className={`flex flex-wrap gap-1 mb-1 ${formData.jobRoles.length > 0 ? 'min-h-[20px]' : ''}`}>
        {formData.jobRoles.map(role => (
          <div key={role} className="flex items-center bg-gradient-to-r from-gray-100 to-white border border-gray-200 text-gray-700 text-xs px-2 py-1 rounded-full">
            <span>{role}</span>
            <button type="button" onClick={() => removeSelectedItem('jobRoles', role)} className="ml-1 text-gray-500 hover:text-gray-700"><X size={12} /></button>
          </div>
        ))}
      </div>
      
      <div className="flex items-center justify-between w-full border border-gray-200 rounded-lg cursor-pointer hover:border-gray-300 transition-colors bg-gradient-to-r from-gray-50 to-white min-h-[44px] h-[44px] px-3" onClick={() => toggleDropdown('jobRoles')}>
        <span className="text-sm text-gray-500">Select job roles</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${dropdownOpen.jobRoles ? "rotate-180" : ""} text-gray-400`} />
      </div>
      
      {dropdownOpen.jobRoles && (
        <div className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-hidden">
          {/* Custom input section */}
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
                    handleCustomAdd('jobRoles', customJobRole, setCustomJobRole);
                  }
                }}
                className="flex-1 p-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#667eea]/50 focus:outline-none"
              />
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleCustomAdd('jobRoles', customJobRole, setCustomJobRole);
                }}
                className="px-4 py-2 bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white rounded-lg text-xs font-bold whitespace-nowrap"
              >
                Add
              </button>
            </div>
          </div>
          
          {/* Scrollable list ONLY */}
          <div className="overflow-y-auto max-h-48">
            {jobRoleOptions.map(role => (
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
            
            {jobRoleOptions.length === 0 && (
              <div className="p-4 text-center text-gray-400 text-xs italic">
                No job roles found. Add a role above.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  </div>

  {/* Work Location */}
  <div className='mt-1'>
    <label className="block font-medium mb-2 text-sm text-gray-700">Work Location <span className="text-red-500">*</span></label>
    <CreatableSelect
      isMulti
      options={cityOptions}
      value={formData.workLocation.map(location => ({ value: location, label: location }))}
      onChange={(selectedOptions) => handleLocationChange('workLocation', selectedOptions)}
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
</div>

            {/* Seventh Row: Skills */}
<div ref={skillsRef} className="relative">
  <label className="block font-medium mb-2 text-sm text-gray-700">Skills</label>
  
  {/* Selected skills - removed scrolling */}
  <div className="flex flex-wrap gap-1 mb-2">
    {formData.skills.map(skill => (
      <div key={skill} className="flex items-center bg-gradient-to-r from-gray-100 to-white border border-gray-200 text-gray-700 text-xs px-2 py-1 rounded-full">
        <span>{skill}</span>
        <button type="button" onClick={() => removeSelectedItem('skills', skill)} className="ml-1 text-gray-500 hover:text-gray-700"><X size={12} /></button>
      </div>
    ))}
  </div>
  
  <div className="flex items-center justify-between p-2 w-full border border-gray-200 rounded-lg cursor-pointer hover:border-gray-300 transition-colors bg-gradient-to-r from-gray-50 to-white" onClick={() => toggleDropdown('skills')}>
    <span className="text-sm text-gray-500">Select skills</span>
    <ChevronDown className={`w-4 h-4 transition-transform ${dropdownOpen.skills ? "rotate-180" : ""} text-gray-400`} />
  </div>
  
  {dropdownOpen.skills && (
    <div className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-hidden">
      {/* Custom input section */}
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
      
      {/* Scrollable list ONLY */}
      <div className="overflow-y-auto max-h-48">
        {skillsOptions.map(skill => (
          <div 
            key={skill} 
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
        
        {skillsOptions.length === 0 && (
          <div className="p-4 text-center text-gray-400 text-xs italic">
            No skills found. Add a skill above.
          </div>
        )}
      </div>
    </div>
  )}
</div>

            {/* Eighth Row: Eligibility and Description */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
  {/* Eligibility Criteria */}
  <div>
    <label htmlFor="eligibilityCriteria" className="block mb-2 font-medium text-sm text-gray-700">Eligibility Criteria</label>
    <textarea 
      id="eligibilityCriteria" 
      name="eligibilityCriteria" 
      rows="3" 
      placeholder="e.g., Minimum 60%, no backlogs..." 
      className="w-full p-3 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#667eea]/50 focus:border-transparent focus:outline-none transition-all duration-200 bg-gradient-to-r from-gray-50 to-white resize-none h-24" 
      value={formData.eligibilityCriteria} 
      onChange={handleInputChange} 
    />
    {/* Empty spacer to match Description field's character counter */}
    <div className="h-5 mt-1"></div>
  </div>

  {/* Description */}
  <div>
    <label className="block mb-2 font-medium text-sm text-gray-700">Job Description <span className="text-red-500">*</span></label>
    <textarea
      name="description"
      value={formData.description}
      onChange={handleInputChange}
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

            {/* Ninth Row: Amenities and Benefits */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Amenities Required */}
              <div ref={amenitiesRef} className="relative">
                <label className="block font-medium mb-2 text-sm text-gray-700">Amenities Required</label>
                <div className="flex flex-wrap gap-1 mb-1 max-h-20 overflow-y-auto">
                  {formData.amenitiesRequired.map(amenity => (
                    <div key={amenity} className="flex items-center bg-gradient-to-r from-gray-100 to-white border border-gray-200 text-gray-700 text-xs px-2 py-1 rounded-full">
                      <span>{amenity}</span>
                      <button type="button" onClick={() => removeSelectedItem('amenitiesRequired', amenity)} className="ml-1 text-gray-500 hover:text-gray-700"><X size={12} /></button>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between p-2 w-full border border-gray-200 rounded-lg cursor-pointer hover:border-gray-300 transition-colors bg-gradient-to-r from-gray-50 to-white" onClick={() => toggleDropdown('amenities')}>
                  <span className="text-sm text-gray-500">Select amenities</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${dropdownOpen.amenities ? "rotate-180" : ""} text-gray-400`} />
                </div>
                {dropdownOpen.amenities && (
                  <div className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-auto">
                    {amenitiesOptions.map(amenity => (
                      <div key={amenity} onClick={() => handleMultiSelect('amenitiesRequired', amenity)} className={`px-3 py-2 hover:bg-gray-50 cursor-pointer border-b border-gray-100 ${formData.amenitiesRequired.includes(amenity) ? "bg-blue-50" : ""}`}>
                        <div className="flex items-center justify-between">
                          <span className={`text-sm ${formData.amenitiesRequired.includes(amenity) ? "text-[#667eea] font-medium" : "text-gray-700"}`}>{amenity}</span>
                          {formData.amenitiesRequired.includes(amenity) && <span className="text-[#667eea]">✓</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Benefits */}
              <div ref={benefitsRef} className="relative">
                <label className="block font-medium mb-2 text-sm text-gray-700">Benefits</label>
                <div className="flex flex-wrap gap-1 mb-1 max-h-20 overflow-y-auto">
                  {formData.benefits.map(benefit => (
                    <div key={benefit} className="flex items-center bg-gradient-to-r from-gray-100 to-white border border-gray-200 text-gray-700 text-xs px-2 py-1 rounded-full">
                      <span>{benefit}</span>
                      <button type="button" onClick={() => removeSelectedItem('benefits', benefit)} className="ml-1 text-gray-500 hover:text-gray-700"><X size={12} /></button>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between p-2 w-full border border-gray-200 rounded-lg cursor-pointer hover:border-gray-300 transition-colors bg-gradient-to-r from-gray-50 to-white" onClick={() => toggleDropdown('benefits')}>
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

            {/* Tenth Row: Tags and Package Details */}
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

              {/* Package Details */}
              <div className='mt-1'>
                <label className="block mb-2 font-medium text-sm text-gray-700">Package Details <span className="text-red-500">*</span></label>
                <div className="flex mb-2">
                  <div className="relative w-20">
                    <select
                      name="currency"
                      className="w-full h-full p-2 text-sm border border-gray-200 rounded-l-lg appearance-none bg-gradient-to-r from-gray-50 to-white pr-8 text-center focus:ring-2 focus:ring-[#667eea]/50 focus:border-transparent focus:outline-none"
                      value={formData.packageDetails.currency}
                      onChange={handlePackageDetailsChange}
                    >
                      <option value="INR">INR</option>
                      <option value="USD">USD</option>
                      <option value="EUR">EUR</option>
                      <option value="GBP">GBP</option>
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
            </div>

            {/* Eleventh Row: Application Dates */}
<div>
  <label className="block mb-2 font-medium text-sm text-gray-700">Tentative Date of Placement/Hiring *</label>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div className="relative">
      <label className="block mb-1 text-xs text-gray-600">Start Date</label>
      <div className="relative">
        <DatePicker
          selected={formData.startDate ? new Date(formData.startDate) : null}
          onChange={(date) => handleDateChange(date, 'startDate')}
          dateFormat="dd-MM-yyyy"
          placeholderText="Start date"
          className="w-full p-2 pl-10 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#667eea]/50 focus:border-transparent focus:outline-none transition-all duration-200 bg-gradient-to-r from-gray-50 to-white"
          wrapperClassName="w-full"
        />
        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={14} />
      </div>
    </div>
    <div className="relative">
      <label className="block mb-1 text-xs text-gray-600">End Date</label>
      <div className="relative">
        <DatePicker
          selected={formData.endDate ? new Date(formData.endDate) : null}
          onChange={(date) => handleDateChange(date, 'endDate')}
          dateFormat="dd-MM-yyyy"
          placeholderText="End date"
          className="w-full p-2 pl-10 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#667eea]/50 focus:border-transparent focus:outline-none transition-all duration-200 bg-gradient-to-r from-gray-50 to-white"
          wrapperClassName="w-full"
        />
        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={14} />
      </div>
    </div>
  </div>
</div>

{/* Twelfth Row: Hiring Timeline Dates */}
<div>
  <label className="block mb-2 font-medium text-sm text-gray-700">Hiring Timeline</label>
  <div className="space-y-3">
    <div className="relative">
      <label className="block mb-1 text-xs text-gray-600">Online Test Date</label>
      <div className="relative">
        <DatePicker
          selected={formData.onlineTestDate ? new Date(formData.onlineTestDate) : null}
          onChange={(date) => handleDateChange(date, 'onlineTestDate')}
          dateFormat="dd-MM-yyyy"
          placeholderText="Online test date"
          className="w-full p-2 pl-10 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#667eea]/50 focus:border-transparent focus:outline-none transition-all duration-200 bg-gradient-to-r from-gray-50 to-white"
          wrapperClassName="w-full"
        />
        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={14} />
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="relative">
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
      <div className="relative">
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
    
    <div className="relative">
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

            {/* Thirteenth Row: Rounds and Selection Process */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Number of Rounds */}
              <div>
                <label htmlFor="rounds" className="block mb-2 font-medium text-sm text-gray-700">Number of Rounds</label>
                <div className="relative">
                  <select 
                    id="rounds" 
                    name="rounds" 
                    className="w-full p-2 text-sm border border-gray-200 rounded-lg appearance-none bg-gradient-to-r from-gray-50 to-white pr-10 focus:ring-2 focus:ring-[#667eea]/50 focus:border-transparent focus:outline-none transition-all duration-200" 
                    value={formData.rounds} 
                    onChange={handleInputChange}
                  >
                    <option value="" disabled>Select rounds</option>
                    {roundsOptions.map(option => (<option key={option} value={option}>{option}</option>))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={14} />
                </div>
              </div>

              {/* Process of Selection */}
              <div ref={selectionProcessRef} className="relative">
                <label className="block font-medium mb-2 text-sm text-gray-700">Process of Selection</label>
                <div className="flex items-center justify-between p-2 w-full border border-gray-200 rounded-lg cursor-pointer hover:border-gray-300 transition-colors min-h-[38px] bg-gradient-to-r from-gray-50 to-white" onClick={() => toggleDropdown('selectionProcess')}>
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
                            {/* ADD (left side) */}
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
                            
                            {/* REMOVE (right side) */}
                            {isSelected && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation(); // important
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

            {/* Fourteenth Row: Contact Person and Designation */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Contact Person */}
              <div>
                <label htmlFor="contactPersonName" className="block mb-2 font-medium text-sm text-gray-700">Contact Person</label>
                <input 
                  type="text" 
                  id="contactPersonName" 
                  name="contactPersonName" 
                  placeholder="Name" 
                  className="w-full p-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#667eea]/50 focus:border-transparent focus:outline-none transition-all duration-200 bg-gradient-to-r from-gray-50 to-white" 
                  value={formData.contactPersonName} 
                  onChange={handleInputChange} 
                />
              </div>

              {/* Contact person designation */}
              <div>
                <label htmlFor="contactDesignation" className="block mb-2 font-medium text-sm text-gray-700">Designation <span className="text-red-500">*</span></label>
                <div className="relative">
                  <select 
                    id="contactDesignation" 
                    name="contactDesignation" 
                    className="w-full p-2 text-sm border border-gray-200 rounded-lg appearance-none bg-gradient-to-r from-gray-50 to-white pr-10 focus:ring-2 focus:ring-[#667eea]/50 focus:border-transparent focus:outline-none transition-all duration-200" 
                    value={formData.contactDesignation} 
                    onChange={handleInputChange}
                  >
                    <option value="" disabled>Select designation</option>
                    {designationOptions.map(option => (<option key={option} value={option}>{option}</option>))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={14} />
                </div>
              </div>
            </div>

            {/* Fifteenth Row: Contact Email and Mobile */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Contact person email */}
              <div>
                <label htmlFor="email" className="block mb-2 font-medium text-sm text-gray-700">Email <span className="text-red-500">*</span></label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={14} />
                  <input 
                    type="email" 
                    id="email" 
                    name="email" 
                    placeholder="hello@xyz.com" 
                    className="w-full p-2 pl-10 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#667eea]/50 focus:border-transparent focus:outline-none transition-all duration-200 bg-gradient-to-r from-gray-50 to-white" 
                    value={formData.email} 
                    onChange={handleInputChange} 
                  />
                </div>
              </div>

              {/* Contact person mobile no */}
              <div>
                <label htmlFor="mobile" className="block mb-2 font-medium text-sm text-gray-700">Mobile <span className="text-red-500">*</span></label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={14} />
                  <input 
                    type="tel" 
                    id="mobile" 
                    name="mobile" 
                    placeholder="1234567890" 
                    className="w-full p-2 pl-10 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#667eea]/50 focus:border-transparent focus:outline-none transition-all duration-200 bg-gradient-to-r from-gray-50 to-white" 
                    value={formData.mobile} 
                    onChange={handleInputChange} 
                  />
                </div>
              </div>
            </div>

            {/* Sixteenth Row: LinkedIn and Minimum Students */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Contact person LinkedIn Profile */}
              <div>
                <label htmlFor="linkedin" className="block mb-2 font-medium text-sm text-gray-700">LinkedIn Profile</label>
                <div className="relative">
                  <Link className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={14} />
                  <input 
                    type="url" 
                    id="linkedin" 
                    name="linkedin" 
                    placeholder="linkedin.com/in/profile" 
                    className="w-full p-2 pl-10 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#667eea]/50 focus:border-transparent focus:outline-none transition-all duration-200 bg-gradient-to-r from-gray-50 to-white" 
                    value={formData.linkedin} 
                    onChange={handleInputChange} 
                  />
                </div>
              </div>

              {/* Minimum Students to be Hired */}
              <div>
                <label htmlFor="minimumStudents" className="block mb-2 font-medium text-sm text-gray-700">Minimum Students to Hire</label>
                <div className="relative">
                  <select 
                    id="minimumStudents" 
                    name="minimumStudents" 
                    className="w-full p-2 text-sm border border-gray-200 rounded-lg appearance-none bg-gradient-to-r from-gray-50 to-white pr-10 focus:ring-2 focus:ring-[#667eea]/50 focus:border-transparent focus:outline-none transition-all duration-200" 
                    value={formData.minimumStudents} 
                    onChange={handleInputChange}
                  >
                    <option value="" disabled>Select range</option>
                    {minStudentsOptions.map(option => (<option key={option} value={option}>{option}</option>))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={14} />
                </div>
              </div>
            </div>

            {/* Register Button */}
            <div className="flex justify-between pt-4">
              <BackButton></BackButton>
              <button 
                type="button" 
                onClick={handleSubmit} 
                className="px-6 py-2.5 text-sm bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white font-semibold rounded-lg shadow-md hover:shadow-lg hover:shadow-[#667eea]/30 focus:outline-none focus:ring-2 focus:ring-[#667eea]/50 transition-all duration-200"
              >
                Register
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}