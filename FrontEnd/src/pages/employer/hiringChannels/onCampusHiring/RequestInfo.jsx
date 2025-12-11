// import { useState, useRef, useEffect } from 'react';
// import axios from 'axios';
// import { ChevronDown, X } from 'lucide-react';
// import toast from 'react-hot-toast';
// import { City } from 'country-state-city';

// export default function RequestInfo() {
//   // --- Data for Dropdowns ---
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
//   const processOptions = ['Online Test',
//     'Coding Test',
//     'Aptitude Test',
//     'Group Discussion',
//     'Technical Interview',
//     'HR Interview',
//     'Case Study',
//     'Presentation'].map(option => `${option}`).sort((a, b) => a.localeCompare(b));
//   const designationOptions = ['HR Manager', 'Technical Recruiter', 'Talent Acquisition', 'Hiring Manager', 'Team Lead', 'Department Head', 'CEO', 'CTO', 'Founder', 'Other'];
//   const minStudentsOptions = ['1-10', '11-25', '26-50', '51-100', '101-200', '201-500', '500+'];
//   const degrees = Object.keys(degreeStreamMapping).sort();
//   const collegeCategoryOptions = ['Tier 1', 'Tier 2', 'Tier 3', 'Autonomous', 'All Colleges'];
//   const preferredModeOptions = ['Online', 'Offline', 'Hybrid', 'Online Aptitude and Physical Interview'];
//   const amenitiesOptions = ['Projector', 'Auditorium', 'Interview Rooms', 'Wi-Fi Access', 'Refreshments', 'Parking'];
//   const tagsOptions = ['Urgent hiring', 'Fresher preferred', 'Remote-friendly', 'Work from Home', 'Internship-eligible', 'Hybrid', 'High Priority', 'Contract', 'Part-time', 'Full-time'];

//   // --- Component State and Logic ---
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
//   const [error, setError] = useState(null);
//   const [descriptionError, setDescriptionError] = useState("");
//   const [indianCities, setIndianCities] = useState([]);
//   const [workLocationSearch, setWorkLocationSearch] = useState('');
//   const [venueSearch, setVenueSearch] = useState('');
//   const [preferredLocationSearch, setPreferredLocationSearch] = useState('');

//   // --- State for custom add inputs ---
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
//     venue: false,
//     degree: false,
//     collegeCategories: false,
//     amenities: false,
//   });

//   // --- Refs for all dropdowns ---
//   const studentStreamsRef = useRef(null);
//   const skillsRef = useRef(null);
//   const benefitsRef = useRef(null);
//   const jobRolesRef = useRef(null);
//   const workLocationsRef = useRef(null);
//   const preferredLocationsRef = useRef(null);
//   const selectionProcessRef = useRef(null);
//   const tagsRef = useRef(null);
//   const venueRef = useRef(null);
//   const degreeRef = useRef(null);
//   const collegeCategoriesRef = useRef(null);
//   const amenitiesRef = useRef(null);

//   useEffect(() => {
//     const citiesOfIndia = City.getCitiesOfCountry('IN')
//       ?.map(city => city.name)
//       ?.sort((a, b) => a.localeCompare(b)) || [];
//     setIndianCities(citiesOfIndia);
//   }, []);

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
//         venue: venueRef,
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

//   // --- useEffect to reset studentStreams when degree changes ---
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
//       // Create a new state object with all dropdowns closed
//       const newState = Object.keys(prev).reduce((acc, key) => {
//         acc[key] = false;
//         return acc;
//       }, {});
//       // If the clicked dropdown wasn't open, open it
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

//   // --- Handler for adding custom (manual) items ---
//   const handleCustomAdd = (field, value, setValue, predefinedOptions = []) => {
//     if (value.trim() === '') return;
//     setFormData(prev => {
//       const currentValues = prev[field] || [];
//       // Check for duplicates (case-insensitive)
//       if (currentValues.map(v => v.toLowerCase()).includes(value.trim().toLowerCase()) || 
//           predefinedOptions.map(v => v.toLowerCase()).includes(value.trim().toLowerCase())) {
//         setValue(''); // Clear input even if duplicate
//         toast.error("Item already exists.");
//         return prev;
//       }
//       const newValues = [...currentValues, value.trim()];
//       return { ...prev, [field]: newValues };
//     });
//     setValue(''); // Clear input after adding
//   };

//   // --- Enhanced search functionality for cities ---
//   const getFilteredCities = (cities, searchTerm) => {
//     if (!searchTerm.trim()) {
//       return cities;
//     }
    
//     const searchLower = searchTerm.toLowerCase();
//     const citiesWithPriority = cities.map(city => {
//       const cityLower = city.toLowerCase();
//       let priority = 0;
      
//       // Highest priority: exact match
//       if (cityLower === searchLower) {
//         priority = 3;
//       }
//       // High priority: starts with search term
//       else if (cityLower.startsWith(searchLower)) {
//         priority = 2;
//       }
//       // Medium priority: contains search term
//       else if (cityLower.includes(searchLower)) {
//         priority = 1;
//       }
      
//       return { city, priority };
//     });
    
//     // Filter out cities that don't match and sort by priority
//     return citiesWithPriority
//       .filter(item => item.priority > 0)
//       .sort((a, b) => b.priority - a.priority || a.city.localeCompare(b.city))
//       .map(item => item.city);
//   };

//   // --- Use enhanced search function ---
//   const filteredWorkCities = getFilteredCities(indianCities, workLocationSearch);
//   const filteredVenueCities = getFilteredCities(indianCities, venueSearch);
//   const filteredPreferredCities = getFilteredCities(indianCities, preferredLocationSearch);

//   // --- Calculate available streams based on multi-select degree (Union) ---
//   const availableStreams = (() => {
//     if (formData.degree.length === 0) {
//       return [];
//     }
//     const allStreams = new Set();
//     formData.degree.forEach(degree => {
//       // Only check streams for degrees in our mapping
//       if (degreeStreamMapping[degree]) {
//         degreeStreamMapping[degree].forEach(stream => allStreams.add(stream));
//       }
//     });
//     return [...allStreams].sort((a, b) => a.localeCompare(b));
//   })();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError(null);

//     if (formData.description.length > 500) {
//       setDescriptionError("Job description cannot exceed 500 characters.");
//       toast.error("Job description cannot exceed 500 characters.");
//       return;
//     }

//     const fieldsToValidate = [
//       { key: 'studentStreams', name: 'Student Stream' },
//       { key: 'skills', name: 'Skills' },
//       { key: 'benefits', name: 'Benefits Offered' },
//       { key: 'workMode', name: 'Work Mode' },
//       { key: 'employmentType', name: 'Employment Type' },
//       { key: 'jobRoles', name: 'Job Role' },
//       { key: 'workLocation', name: 'Work Location' },
//       { key: 'selectionProcess', name: 'Process of Selection' },
//     ];

//     for (const field of fieldsToValidate) {
//       if (formData[field.key].length === 0) {
//         const errorMsg = `Please make a selection for "${field.name}". This field is required.`;
//         setError(errorMsg);
//         toast.error(errorMsg);
//         return;
//       }
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

//       // --- USING THE SPECIFIED ENDPOINT ---
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
//       setError(errorMsg);
//       toast.error(errorMsg);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <div className="max-w-4xl mx-auto p-4 font-sans">
//       <div className="flex flex-col md:flex-row justify-between mb-8">
//         <div className="md:w-1/2">
//           <h1 className="text-3xl font-bold mb-2">OnCampus Connect:</h1>
//           <h2 className="text-3xl font-bold mb-4">Hire Smarter</h2>
//         </div>
//         <div className="md:w-1/2">
//           <p className="text-sm">
//             Our OnCampus service brings career opportunities directly to students, connecting them with top employers through campus recruitment drives and job events.
//           </p>
//         </div>
//       </div>

//       {error && (
//         <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
//           <span className="block sm:inline">{error}</span>
//         </div>
//       )}

//       <div className="bg-white p-8 rounded-xl shadow-lg">
//         <h2 className="text-2xl font-bold text-center mb-4">Register for On-Campus Hiring</h2>
//         <p className="text-center text-gray-500 mb-6">Fill in the details below to register for the hiring drive.</p>

//         <form onSubmit={handleSubmit} className="space-y-6">
//           {/* On-Campus Hiring Venue */}
          // <div ref={venueRef} className="relative">
          //   <label className="block mb-1 font-medium">On-Campus Hiring Venue <span className="text-red-500">*</span></label>
          //   <div 
          //     onClick={() => toggleDropdown('venue')}
          //     className="flex items-center justify-between p-2 w-full border border-gray-300 rounded-md cursor-pointer hover:border-gray-400"
          //   >
          //     <span className={formData.venue ? "text-black" : "text-gray-500"}>
          //       {formData.venue || 'Select venue location'}
          //     </span>
          //     <ChevronDown className={`w-5 h-5 transition-transform ${dropdownOpen.venue ? "rotate-180" : ""}`} />
          //   </div>
          //   {dropdownOpen.venue && (
          //     <div className="absolute z-20 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg">
          //       <div className="p-2 border-b">
          //         <input
          //           type="text"
          //           value={venueSearch}
          //           onChange={(e) => setVenueSearch(e.target.value)}
          //           onClick={(e) => e.stopPropagation()}
          //           placeholder="Search for a city..."
          //           className="w-full p-2 border rounded"
          //         />
          //       </div>
          //       <div className="max-h-60 overflow-auto">
          //         {filteredVenueCities.length > 0 ? (
          //           filteredVenueCities.map(city => (
          //             <div
          //               key={city}
          //               onClick={() => {
          //                 setFormData(prev => ({ ...prev, venue: city }));
          //                 setDropdownOpen(prev => ({ ...prev, venue: false }));
          //               }}
          //               className={`px-4 py-2 hover:bg-gray-100 cursor-pointer ${formData.venue === city ? "bg-gray-100 font-medium" : ""}`}
          //             >
          //               {city}
          //               {formData.venue === city && <span className="float-right text-gray-500">✓</span>}
          //             </div>
          //           ))
          //         ) : (
          //           <div className="px-4 py-2 text-gray-500">No cities found matching "{venueSearch}"</div>
          //         )}
          //       </div>
          //     </div>
          //   )}
          // </div>

//           {/* Degree Multi-Select with Custom Add */}
//           <div ref={degreeRef} className="relative">
//             <label className="block font-medium mb-2">Degree <span className="text-red-500">*</span></label>
//             <div className="flex flex-wrap gap-2 mb-2">
//               {formData.degree.map(degree => (
//                 <div key={degree} className="flex items-center bg-gray-200 text-sm px-3 py-1 rounded-full">
//                   <span>{degree}</span>
//                   <button type="button" onClick={() => removeSelectedItem('degree', degree)} className="ml-2 text-gray-600 hover:text-black"><X size={14} /></button>
//                 </div>
//               ))}
//             </div>
//             <div
//               className="flex items-center justify-between p-2 w-full border border-gray-300 rounded-md cursor-pointer hover:border-gray-400"
//               onClick={() => toggleDropdown('degree')}
//             >
//               <span className="text-gray-500">Select degree(s)</span>
//               <ChevronDown className={`w-5 h-5 transition-transform ${dropdownOpen.degree ? "rotate-180" : ""}`} />
//             </div>
//             {dropdownOpen.degree && (
//               <div className="absolute z-20 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg">
//                 {/* Custom Degree Input */}
//                 <div className="p-2 border-b flex">
//                   <input
//                     type="text"
//                     placeholder="Add custom degree..."
//                     value={customDegree}
//                     onChange={(e) => setCustomDegree(e.target.value)}
//                     onClick={(e) => e.stopPropagation()}
//                     onKeyDown={(e) => {
//                       if (e.key === 'Enter') {
//                         e.preventDefault();
//                         handleCustomAdd('degree', customDegree, setCustomDegree, degrees);
//                       }
//                     }}
//                     className="w-full p-1 border rounded"
//                   />
//                   <button
//                     type="button"
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       handleCustomAdd('degree', customDegree, setCustomDegree, degrees);
//                     }}
//                     className="ml-2 px-3 py-1 bg-black text-white rounded text-sm"
//                   >
//                     Add
//                   </button>
//                 </div>
//                 <div className="max-h-60 overflow-auto">
//                   {degrees.map(degree => (
//                     <div key={degree} onClick={() => handleMultiSelect('degree', degree)} className={`px-4 py-2 hover:bg-gray-100 cursor-pointer ${formData.degree.includes(degree) ? "bg-gray-100 font-medium" : ""}`}>
//                       {degree}
//                       {formData.degree.includes(degree) && <span className="float-right text-gray-500">✓</span>}
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* Student Stream with Custom Add */}
//           <div ref={studentStreamsRef} className="relative">
//             <label className="block font-medium mb-2">Student Stream <span className="text-red-500">*</span></label>
//             <div className="flex flex-wrap gap-2 mb-2">
//               {formData.studentStreams.map(stream => (
//                 <div key={stream} className="flex items-center bg-gray-200 text-sm px-3 py-1 rounded-full">
//                   <span>{stream}</span>
//                   <button type="button" onClick={() => removeSelectedItem('studentStreams', stream)} className="ml-2 text-gray-600 hover:text-black"><X size={14} /></button>
//                 </div>
//               ))}
//             </div>
//             <div
//               onClick={() => formData.degree.length > 0 && toggleDropdown('studentStreams')}
//               className={`flex items-center justify-between p-2 w-full border rounded-md ${!formData.degree.length ? 'bg-gray-100 cursor-not-allowed' : 'cursor-pointer hover:border-gray-400'}`}
//             >
//               <span className="text-gray-500">
//                 {formData.degree.length > 0 ? 'Select streams' : 'Please select a degree first'}
//               </span>
//               <ChevronDown className={`w-5 h-5 transition-transform ${dropdownOpen.studentStreams ? "rotate-180" : ""}`} />
//             </div>
//             {dropdownOpen.studentStreams && formData.degree.length > 0 && (
//               <div className="absolute z-20 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
//                 {/* Custom Stream Input */}
//                 <div className="p-2 border-b flex">
//                   <input
//                     type="text"
//                     placeholder="Add custom stream..."
//                     value={customStream}
//                     onChange={(e) => setCustomStream(e.target.value)}
//                     onClick={(e) => e.stopPropagation()}
//                     onKeyDown={(e) => {
//                       if (e.key === 'Enter') {
//                         e.preventDefault();
//                         handleCustomAdd('studentStreams', customStream, setCustomStream, availableStreams);
//                       }
//                     }}
//                     className="w-full p-1 border rounded"
//                   />
//                   <button
//                     type="button"
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       handleCustomAdd('studentStreams', customStream, setCustomStream, availableStreams);
//                     }}
//                     className="ml-2 px-3 py-1 bg-black text-white rounded text-sm"
//                   >
//                     Add
//                   </button>
//                 </div>
//                 <div className="max-h-48 overflow-auto">
//                   {availableStreams.length > 0 ? (
//                     availableStreams.map(stream => (
//                       <div key={stream} onClick={() => handleMultiSelect('studentStreams', stream)} className={`px-4 py-2 hover:bg-gray-100 cursor-pointer ${formData.studentStreams.includes(stream) ? "bg-gray-100 font-medium" : ""}`}>
//                         {stream}
//                         {formData.studentStreams.includes(stream) && <span className="float-right text-gray-500">✓</span>}
//                       </div>
//                     ))
//                   ) : (
//                     <div className="px-4 py-2 text-gray-500">No predefined streams for custom degree. Add manually.</div>
//                   )}
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* College Categories */}
//           <div ref={collegeCategoriesRef} className="relative">
//             <label className="block font-medium mb-2">College Categories</label>
//             <div className="flex flex-wrap gap-2 mb-2">
//               {formData.collegeCategories.map(type => (
//                 <div key={type} className="flex items-center bg-gray-200 text-sm px-3 py-1 rounded-full">
//                   <span>{type}</span>
//                   <button type="button" onClick={() => removeSelectedItem('collegeCategories', type)} className="ml-2 text-gray-600 hover:text-black"><X size={14} /></button>
//                 </div>
//               ))}
//             </div>
//             <div className="flex items-center justify-between p-2 w-full border border-gray-300 rounded-md cursor-pointer hover:border-gray-400" onClick={() => toggleDropdown('collegeCategories')}>
//               <span className="text-gray-500">Select college categories</span>
//               <ChevronDown className={`w-5 h-5 transition-transform ${dropdownOpen.collegeCategories ? "rotate-180" : ""}`} />
//             </div>
//             {dropdownOpen.collegeCategories && (
//               <div className="absolute z-20 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
//                 {collegeCategoryOptions.map(type => (
//                   <div key={type} onClick={() => handleMultiSelect('collegeCategories', type)} className={`px-4 py-2 hover:bg-gray-100 cursor-pointer ${formData.collegeCategories.includes(type) ? "bg-gray-100 font-medium" : ""}`}>
//                     {type}
//                     {formData.collegeCategories.includes(type) && <span className="float-right text-gray-500">✓</span>}
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>

//           {/* Preferred Hiring Locations */}
//           <div ref={preferredLocationsRef} className="relative">
//             <label className="block font-medium mb-2">Preferred Hiring Locations</label>
//             <div className="flex flex-wrap gap-2 mb-2">
//               {formData.preferredLocations.map(location => (
//                 <div key={location} className="flex items-center bg-gray-200 text-sm px-3 py-1 rounded-full">
//                   <span>{location}</span>
//                   <button type="button" onClick={() => removeSelectedItem('preferredLocations', location)} className="ml-2 text-gray-600 hover:text-black"><X size={14} /></button>
//                 </div>
//               ))}
//             </div>
//             <div
//               className="flex items-center justify-between p-2 w-full border border-gray-300 rounded-md cursor-pointer hover:border-gray-400"
//               onClick={() => toggleDropdown('preferredLocations')}
//             >
//               <span className="text-gray-500">Select location(s)</span>
//               <ChevronDown className={`w-5 h-5 transition-transform ${dropdownOpen.preferredLocations ? "rotate-180" : ""}`} />
//             </div>
//             {dropdownOpen.preferredLocations && (
//               <div className="absolute z-20 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg">
//                 <div className="p-2 border-b">
//                   <input
//                     type="text"
//                     value={preferredLocationSearch}
//                     onChange={(e) => setPreferredLocationSearch(e.target.value)}
//                     onClick={(e) => e.stopPropagation()}
//                     placeholder="Search for a city..."
//                     className="w-full p-2 border rounded"
//                   />
//                 </div>
//                 <div className="max-h-60 overflow-auto">
//                   {filteredPreferredCities.length > 0 ? (
//                     filteredPreferredCities.map(city => (
//                       <div key={city} onClick={() => handleMultiSelect('preferredLocations', city)} className={`px-4 py-2 hover:bg-gray-100 cursor-pointer ${formData.preferredLocations.includes(city) ? "bg-gray-100 font-medium" : ""}`}>
//                         {city}
//                         {formData.preferredLocations.includes(city) && <span className="float-right text-gray-500">✓</span>}
//                       </div>
//                     ))
//                   ) : (
//                     <div className="px-4 py-2 text-gray-500">No cities found matching "{preferredLocationSearch}"</div>
//                   )}
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* Broadcast Type */}
//           <div>
//             <label className="block mb-2 font-medium">Broadcast Options <span className="text-red-500">*</span></label>
//             <div className="flex items-center space-x-6">
//               <label className="flex items-center cursor-pointer">
//                 <input
//                   type="radio"
//                   name="broadcastType"
//                   value="Everyone"
//                   checked={formData.broadcastType === 'Everyone'}
//                   onChange={handleChange}
//                   className="h-4 w-4 text-black border-gray-300 focus:ring-black"
//                 />
//                 <span className="ml-2 text-gray-700">Broadcast to Everyone</span>
//               </label>
//               <label className="flex items-center cursor-pointer">
//                 <input
//                   type="radio"
//                   name="broadcastType"
//                   value="Location"
//                   checked={formData.broadcastType === 'Location'}
//                   onChange={handleChange}
//                   className="h-4 w-4 text-black border-gray-300 focus:ring-black"
//                 />
//                 <span className="ml-2 text-gray-700">Broadcast by Location</span>
//               </label>
//             </div>
//             <p className="text-xs text-gray-500 mt-1">
//               Select 'Broadcast by Location' to show this job only to candidates/colleges in the specified Work Locations.
//             </p>
//           </div>

//           {/* Looking for */}
//           <div>
//             <label className="block mb-2 font-medium">Looking for <span className="text-red-500">*</span></label>
//             <div className="flex space-x-2">
//               <button type="button" className={`px-4 py-1 border ${formData.lookingFor === 'Job' ? 'bg-black text-white' : 'bg-white text-black'} rounded`} onClick={() => handleOptionSelect('lookingFor', 'Job')}>Job</button>
//               <button type="button" className={`px-4 py-1 border ${formData.lookingFor === 'Internship' ? 'bg-black text-white' : 'bg-white text-black'} rounded`} onClick={() => handleOptionSelect('lookingFor', 'Internship')}>Internship</button>
//               <button type="button" className={`px-4 py-1 border ${formData.lookingFor === 'Both' ? 'bg-black text-white' : 'bg-white text-black'} rounded`} onClick={() => handleOptionSelect('lookingFor', 'Both')}>Both</button>
//             </div>
//           </div>

//           {/* Employment type */}
//           <div>
//             <label className="block mb-2 font-medium">Employment type <span className="text-red-500">*</span></label>
//             <div className="flex flex-wrap gap-2">
//               {['Part-time', 'Full-time', 'Contract'].map(type => (
//                 <button key={type} type="button" className={`px-4 py-1 border ${formData.employmentType.includes(type) ? 'bg-black text-white' : 'bg-white text-black'} rounded`} onClick={() => handleMultiSelect('employmentType', type)}>
//                   {type}
//                 </button>
//               ))}
//             </div>
//           </div>

//           {/* Work Mode */}
//           <div>
//             <label className="block mb-2 font-medium">Work Mode <span className="text-red-500">*</span></label>
//             <div className="flex space-x-2">
//               <button type="button" className={`px-4 py-1 border ${formData.workMode === 'Hybrid' ? 'bg-black text-white' : 'bg-white text-black'} rounded`} onClick={() => handleOptionSelect('workMode', 'Hybrid')}>Hybrid</button>
//               <button type="button" className={`px-4 py-1 border ${formData.workMode === 'On-site' ? 'bg-black text-white' : 'bg-white text-black'} rounded`} onClick={() => handleOptionSelect('workMode', 'On-site')}>On-site</button>
//               <button type="button" className={`px-4 py-1 border ${formData.workMode === 'Remote' ? 'bg-black text-white' : 'bg-white text-black'} rounded`} onClick={() => handleOptionSelect('workMode', 'Remote')}>Remote</button>
//             </div>
//           </div>
          
//           {/* Preferred Hiring Mode */}
//           <div>
//             <label className="block mb-2 font-medium">Preferred Hiring Mode</label>
//             <div className="flex flex-wrap gap-2">
//               {preferredModeOptions.map(mode => (
//                 <button 
//                   key={mode} 
//                   type="button" 
//                   className={`px-4 py-1 border ${formData.companyHiringPreference.preferredMode === mode ? 'bg-black text-white' : 'bg-white text-black'} rounded`} 
//                   onClick={() => handleHiringPreferenceChange(mode)}
//                 >
//                   {mode}
//                 </button>
//               ))}
//             </div>
//           </div>

//           {/* Job Roles with Custom Add */}
//           <div ref={jobRolesRef} className="relative">
//             <label className="block font-medium mb-2">Job Role <span className="text-red-500">*</span></label>
//             <div className="flex flex-wrap gap-2 mb-2">
//               {formData.jobRoles.map(role => (
//                 <div key={role} className="flex items-center bg-gray-200 text-sm px-3 py-1 rounded-full">
//                   <span>{role}</span>
//                   <button type="button" onClick={() => removeSelectedItem('jobRoles', role)} className="ml-2 text-gray-600 hover:text-black"><X size={14} /></button>
//                 </div>
//               ))}
//             </div>
//             <div onClick={() => toggleDropdown('jobRoles')} className="flex items-center justify-between p-2 w-full border border-gray-300 rounded-md cursor-pointer hover:border-gray-400">
//               <span className="text-gray-500">Select job roles</span>
//               <ChevronDown className={`w-5 h-5 transition-transform ${dropdownOpen.jobRoles ? "rotate-180" : ""}`} />
//             </div>
//             {dropdownOpen.jobRoles && (
//               <div className="absolute z-20 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
//                 {/* Custom Job Role Input */}
//                 <div className="p-2 border-b flex">
//                   <input
//                     type="text"
//                     placeholder="Add custom job role..."
//                     value={customJobRole}
//                     onChange={(e) => setCustomJobRole(e.target.value)}
//                     onClick={(e) => e.stopPropagation()}
//                     onKeyDown={(e) => {
//                       if (e.key === 'Enter') {
//                         e.preventDefault();
//                         handleCustomAdd('jobRoles', customJobRole, setCustomJobRole, jobRoles);
//                       }
//                     }}
//                     className="w-full p-1 border rounded"
//                   />
//                   <button
//                     type="button"
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       handleCustomAdd('jobRoles', customJobRole, setCustomJobRole, jobRoles);
//                     }}
//                     className="ml-2 px-3 py-1 bg-black text-white rounded text-sm"
//                   >
//                     Add
//                   </button>
//                 </div>
//                 <div className="max-h-48 overflow-auto">
//                   {jobRoles.map(role => (
//                     <div key={role} onClick={() => handleMultiSelect('jobRoles', role)} className={`px-4 py-2 hover:bg-gray-100 cursor-pointer ${formData.jobRoles.includes(role) ? "bg-gray-100 font-medium" : ""}`}>
//                       {role}
//                       {formData.jobRoles.includes(role) && <span className="float-right text-gray-500">✓</span>}
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* Work Location with Enhanced Search */}
//           <div ref={workLocationsRef} className="relative">
//             <label className="block font-medium mb-2">Work Location <span className="text-red-500">*</span></label>
//             <div className="flex flex-wrap gap-2 mb-2">
//               {formData.workLocation.map(loc => (
//                 <div key={loc} className="flex items-center bg-gray-200 text-sm px-3 py-1 rounded-full">
//                   <span>{loc}</span>
//                   <button type="button" onClick={() => removeSelectedItem('workLocation', loc)} className="ml-2 text-gray-600 hover:text-black"><X size={14} /></button>
//                 </div>
//               ))}
//             </div>
//             <div onClick={() => toggleDropdown('workLocation')} className="flex items-center justify-between p-2 w-full border border-gray-300 rounded-md cursor-pointer hover:border-gray-400">
//               <span className="text-gray-500">Select work locations</span>
//               <ChevronDown className={`w-5 h-5 transition-transform ${dropdownOpen.workLocation ? "rotate-180" : ""}`} />
//             </div>
//             {dropdownOpen.workLocation && (
//               <div className="absolute z-20 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg">
//                 <div className="p-2 border-b">
//                   <input
//                     type="text"
//                     value={workLocationSearch}
//                     onChange={(e) => setWorkLocationSearch(e.target.value)}
//                     onClick={(e) => e.stopPropagation()}
//                     placeholder="Search for a city..."
//                     className="w-full p-2 border rounded"
//                   />
//                 </div>
//                 <div className="max-h-60 overflow-auto">
//                   {filteredWorkCities.length > 0 ? (
//                     filteredWorkCities.map(city => (
//                       <div
//                         key={city}
//                         onClick={() => handleMultiSelect('workLocation', city)}
//                         className={`px-4 py-2 hover:bg-gray-100 cursor-pointer ${formData.workLocation.includes(city) ? "bg-gray-100 font-medium" : ""}`}
//                       >
//                         {city}
//                         {formData.workLocation.includes(city) && <span className="float-right text-gray-500">✓</span>}
//                       </div>
//                     ))
//                   ) : (
//                     <div className="px-4 py-2 text-gray-500">No cities found matching "{workLocationSearch}"</div>
//                   )}
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* Skills with Custom Add */}
//           <div ref={skillsRef} className="relative">
//             <label className="block font-medium mb-2">Skills <span className="text-red-500">*</span></label>
//             <div className="flex flex-wrap gap-2 mb-2">
//               {formData.skills.map(skill => (
//                 <div key={skill} className="flex items-center bg-gray-200 text-sm px-3 py-1 rounded-full">
//                   <span>{skill}</span>
//                   <button type="button" onClick={() => removeSelectedItem('skills', skill)} className="ml-2 text-gray-600 hover:text-black"><X size={14} /></button>
//                 </div>
//               ))}
//             </div>
//             <div onClick={() => toggleDropdown('skills')} className="flex items-center justify-between p-2 w-full border border-gray-300 rounded-md cursor-pointer hover:border-gray-400">
//               <span className="text-gray-500">Select required skills</span>
//               <ChevronDown className={`w-5 h-5 transition-transform ${dropdownOpen.skills ? "rotate-180" : ""}`} />
//             </div>
//             {dropdownOpen.skills && (
//               <div className="absolute z-20 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
//                 {/* Custom Skill Input */}
//                 <div className="p-2 border-b flex">
//                   <input
//                     type="text"
//                     placeholder="Add custom skill..."
//                     value={customSkill}
//                     onChange={(e) => setCustomSkill(e.target.value)}
//                     onClick={(e) => e.stopPropagation()}
//                     onKeyDown={(e) => {
//                       if (e.key === 'Enter') {
//                         e.preventDefault();
//                         handleCustomAdd('skills', customSkill, setCustomSkill, skillsOptions);
//                       }
//                     }}
//                     className="w-full p-1 border rounded"
//                   />
//                   <button
//                     type="button"
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       handleCustomAdd('skills', customSkill, setCustomSkill, skillsOptions);
//                     }}
//                     className="ml-2 px-3 py-1 bg-black text-white rounded text-sm"
//                   >
//                     Add
//                   </button>
//                 </div>
//                 <div className="max-h-48 overflow-auto">
//                   {skillsOptions.map(skill => (
//                     <div key={skill} onClick={() => handleMultiSelect('skills', skill)} className={`px-4 py-2 hover:bg-gray-100 cursor-pointer ${formData.skills.includes(skill) ? "bg-gray-100 font-medium" : ""}`}>
//                       {skill}
//                       {formData.skills.includes(skill) && <span className="float-right text-gray-500">✓</span>}
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}
//           </div>

//           <div>
//             <label className="block mb-1 font-medium">Eligibility Criteria <span className="text-red-500">*</span></label>
//             <textarea name="eligibilityCriteria" value={formData.eligibilityCriteria} onChange={handleChange} placeholder="Example: Minimum 60% aggregate, No active backlogs..." className="w-full p-2 border rounded resize-none h-24" required></textarea>
//           </div>

//           <div>
//             <label className="block mb-1 font-medium">Job Description <span className="text-red-500">*</span></label>
//             <textarea
//               name="description"
//               value={formData.description}
//               onChange={handleChange}
//               placeholder="Provide a detailed job description..."
//               className={`w-full p-2 border rounded resize-none h-24 ${descriptionError ? 'border-red-500' : ''}`}
//               maxLength={600}
//               required
//             ></textarea>
//             <div className="flex justify-between text-xs mt-1">
//               <span className={descriptionError ? 'text-red-500' : 'text-gray-500'}>
//                 {descriptionError ? descriptionError : `${formData.description.length}/500 characters`}
//               </span>
//             </div>
//           </div>

//           {/* Amenities/Facilities Required */}
//           <div ref={amenitiesRef} className="relative">
//             <label className="block font-medium mb-2">Amenities/Facilities Required</label>
//             <div className="flex flex-wrap gap-2 mb-2">
//               {formData.amenitiesRequired.map(amenity => (
//                 <div key={amenity} className="flex items-center bg-gray-200 text-sm px-3 py-1 rounded-full">
//                   <span>{amenity}</span>
//                   <button type="button" onClick={() => removeSelectedItem('amenitiesRequired', amenity)} className="ml-2 text-gray-600 hover:text-black"><X size={14} /></button>
//                 </div>
//               ))}
//             </div>
//             <div className="flex items-center justify-between p-2 w-full border border-gray-300 rounded-md cursor-pointer hover:border-gray-400" onClick={() => toggleDropdown('amenities')}>
//               <span className="text-gray-500">Select required amenities</span>
//               <ChevronDown className={`w-5 h-5 transition-transform ${dropdownOpen.amenities ? "rotate-180" : ""}`} />
//             </div>
//             {dropdownOpen.amenities && (
//               <div className="absolute z-20 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
//                 {amenitiesOptions.map(amenity => (
//                   <div key={amenity} onClick={() => handleMultiSelect('amenitiesRequired', amenity)} className={`px-4 py-2 hover:bg-gray-100 cursor-pointer ${formData.amenitiesRequired.includes(amenity) ? "bg-gray-100 font-medium" : ""}`}>
//                     {amenity}
//                     {formData.amenitiesRequired.includes(amenity) && <span className="float-right text-gray-500">✓</span>}
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>

//           <div ref={benefitsRef} className="relative">
//             <label className="block font-medium mb-2">Benefits Offered <span className="text-red-500">*</span></label>
//             <div className="flex flex-wrap gap-2 mb-2">
//               {formData.benefits.map(benefit => (
//                 <div key={benefit} className="flex items-center bg-gray-200 text-sm px-3 py-1 rounded-full">
//                   <span>{benefit}</span>
//                   <button type="button" onClick={() => removeSelectedItem('benefits', benefit)} className="ml-2 text-gray-600 hover:text-black"><X size={14} /></button>
//                 </div>
//               ))}
//             </div>
//             <div onClick={() => toggleDropdown('benefits')} className="flex items-center justify-between p-2 w-full border border-gray-300 rounded-md cursor-pointer hover:border-gray-400">
//               <span className="text-gray-500">Select benefits</span>
//               <ChevronDown className={`w-5 h-5 transition-transform ${dropdownOpen.benefits ? "rotate-180" : ""}`} />
//             </div>
//             {dropdownOpen.benefits && (
//               <div className="absolute z-20 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
//                 {benefitsOptions.map(benefit => (
//                   <div key={benefit} onClick={() => handleMultiSelect('benefits', benefit)} className={`px-4 py-2 hover:bg-gray-100 cursor-pointer ${formData.benefits.includes(benefit) ? "bg-gray-100 font-medium" : ""}`}>
//                     {benefit}
//                     {formData.benefits.includes(benefit) && <span className="float-right text-gray-500">✓</span>}
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>

//           {/* Package Details */}
//           <div>
//             <label className="block mb-1 font-medium">Package Details <span className="text-red-500">*</span></label>
//             <div className="flex mb-2">
//               <div className="relative">
//                 <select
//                   name="currency"
//                   value={formData.packageDetails.currency}
//                   onChange={handlePackageDetailsChange}
//                   className="py-2 px-3 border rounded-l bg-white"
//                 >
//                   <option value="INR">INR</option>
//                   <option value="USD">USD</option>
//                   <option value="EUR">EUR</option>
//                 </select>
//               </div>
//               <input
//                 type="number"
//                 name="totalCTC"
//                 value={formData.packageDetails.totalCTC}
//                 onChange={handlePackageDetailsChange}
//                 placeholder="Total CTC (e.g. 1000000)"
//                 className="flex-grow p-2 border border-l-0 rounded-r"
//                 required
//               />
//             </div>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <input
//                 type="number"
//                 name="fixedPay"
//                 value={formData.packageDetails.fixedPay}
//                 onChange={handlePackageDetailsChange}
//                 placeholder="Fixed Pay (e.g. 800000)"
//                 className="w-full p-2 border rounded"
//               />
//               <input
//                 type="number"
//                 name="joiningBonus"
//                 value={formData.packageDetails.joiningBonus}
//                 onChange={handlePackageDetailsChange}
//                 placeholder="Variable Pay (e.g. 50000)"
//                 className="w-full p-2 border rounded"
//               />
//             </div>
//           </div>

//           <div>
//             <label className="block mb-1 font-medium">Tentative Date of Placement / Hiring <span className="text-red-500">*</span></label>
//             <div className="flex space-x-2">
//               <div className="w-1/2 mt-3"><label className="block text-xs mb-1 ml-2 font-medium">Start Date</label><div className="relative"><input type="date" name="startDate" value={formData.startDate} onChange={handleChange} className="w-full p-2 border rounded" required /></div></div>
//               <div className="w-1/2 mt-3"><label className="block text-xs mb-1 ml-2 font-medium">End Date</label><div className="relative"><input type="date" name="endDate" value={formData.endDate} onChange={handleChange} className="w-full p-2 border rounded" required /></div></div>
//             </div>
//           </div>

//           {/* Hiring Timeline */}
//           <div>
//             <label className="block mb-2 font-medium">Hiring Timeline</label>
//             <div className="space-y-4">
//               <div>
//                 <label className="block mb-1 text-sm">Online Test Date</label>
//                 <input type="date" name="onlineTestDate" className="w-full p-2 border border-gray-300 rounded" value={formData.onlineTestDate} onChange={handleChange} />
//               </div>

//               <div className="flex space-x-4">
//                 <div className="w-1/2">
//                   <label className="block mb-1 text-sm">Interview Window (Start)</label>
//                   <input type="date" name="start" className="w-full p-2 border border-gray-300 rounded" value={formData.interviewWindow.start} onChange={handleInterviewWindowChange} />
//                 </div>
//                 <div className="w-1/2">
//                   <label className="block mb-1 text-sm">Interview Window (End)</label>
//                   <input type="date" name="end" className="w-full p-2 border border-gray-300 rounded" value={formData.interviewWindow.end} onChange={handleInterviewWindowChange} />
//                 </div>
//               </div>
              
//               <div>
//                 <label className="block mb-1 text-sm">Offer Rollout Date</label>
//                 <input type="date" name="offerRolloutDate" className="w-full p-2 border border-gray-300 rounded" value={formData.offerRolloutDate} onChange={handleChange} />
//               </div>
//             </div>
//           </div>

//           <div>
//             <label className="block mb-1 font-medium">Number of Rounds <span className="text-red-500">*</span></label>
//             <div className="relative">
//               <select name="numberOfRounds" value={formData.numberOfRounds} onChange={handleChange} className="w-full p-2 border rounded appearance-none pr-8 bg-white" required>
//                 <option value="" disabled>Select number of rounds</option>
//                 {numberOfRoundsOptions.map((round) => (<option key={round} value={round}>{round}</option>))}
//               </select>
//               <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none"><ChevronDown className="w-4 h-4 text-gray-400" /></div>
//             </div>
//           </div>

//           <div ref={selectionProcessRef} className="relative">
//             <label className="block font-medium mb-2">Process of Selection <span className="text-red-500">*</span></label>
//             <div
//               onClick={() => toggleDropdown('selectionProcess')}
//               className="flex items-center justify-between p-2 w-full border border-gray-300 rounded-md cursor-pointer hover:border-gray-400 min-h-[42px]"
//             >
//               <span className={formData.selectionProcess.length > 0 ? "text-black" : "text-gray-500"}>
//                 {formData.selectionProcess.length > 0
//                   ? formData.selectionProcess.join(' + ')
//                   : 'Select process'}
//               </span>
//               <ChevronDown className={`w-5 h-5 transition-transform ${dropdownOpen.selectionProcess ? "rotate-180" : ""}`} />
//             </div>
//             {dropdownOpen.selectionProcess && (
//               <div className="absolute z-20 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
//                 {processOptions.map(process => (
//                   <div
//                     key={process}
//                     onClick={() => handleMultiSelect('selectionProcess', process)}
//                     className={`px-4 py-2 hover:bg-gray-100 cursor-pointer ${formData.selectionProcess.includes(process) ? "bg-gray-100 font-medium" : ""}`}
//                   >
//                     {process}
//                     {formData.selectionProcess.includes(process) && <span className="float-right text-gray-500">✓</span>}
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>

//           {/* Tags multi-select */}
//           <div ref={tagsRef} className="relative">
//             <label className="block font-medium mb-2">Tags</label>
//             <div className="flex flex-wrap gap-2 mb-2">
//               {formData.tags.map(tag => (
//                 <div key={tag} className="flex items-center bg-gray-200 text-sm px-3 py-1 rounded-full">
//                   <span>{tag}</span>
//                   <button type="button" onClick={() => removeSelectedItem('tags', tag)} className="ml-2 text-gray-600 hover:text-black"><X size={14} /></button>
//                 </div>
//               ))}
//             </div>
//             <div onClick={() => toggleDropdown('tags')} className="flex items-center justify-between p-2 w-full border border-gray-300 rounded-md cursor-pointer hover:border-gray-400">
//               <span className="text-gray-500">Select tags</span>
//               <ChevronDown className={`w-5 h-5 transition-transform ${dropdownOpen.tags ? "rotate-180" : ""}`} />
//             </div>
//             {dropdownOpen.tags && (
//               <div className="absolute z-20 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
//                 {tagsOptions.map(tag => (
//                   <div key={tag} onClick={() => handleMultiSelect('tags', tag)} className={`px-4 py-2 hover:bg-gray-100 cursor-pointer ${formData.tags.includes(tag) ? "bg-gray-100 font-medium" : ""}`}>
//                     {tag}
//                     {formData.tags.includes(tag) && <span className="float-right text-gray-500">✓</span>}
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>

//           <div>
//             <label className="block mb-1 font-medium">Contact Person <span className="text-red-500">*</span></label>
//             <input type="text" name="name" value={formData.contactPerson.name} onChange={handleContactChange} placeholder="Enter full name" className="w-full p-2 border rounded mb-2" required />
//           </div>

//           <div>
//             <label className="block mb-1 font-medium">Contact person designation <span className="text-red-500">*</span></label>
//             <div className="relative">
//               <select name="designation" value={formData.contactPerson.designation} onChange={handleContactChange} className="w-full p-2 border rounded appearance-none pr-8 bg-white" required>
//                 <option value="" disabled>Select designation</option>
//                 {designationOptions.map((designation) => (<option key={designation} value={designation}>{designation}</option>))}
//               </select>
//               <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none"><ChevronDown className="w-4 h-4 text-gray-400" /></div>
//             </div>
//           </div>

//           <div>
//             <label className="block mb-1 font-medium">Contact person email <span className="text-red-500">*</span></label>
//             <div className="relative flex items-center border rounded pl-2">
//               <span className="text-gray-500"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" /><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" /></svg></span>
//               <input type="email" name="email" value={formData.contactPerson.email} onChange={handleContactChange} placeholder="example@company.com" className="w-full p-2 focus:outline-none" required />
//             </div>
//           </div>

//           <div>
//             <label className="block mb-1 font-medium">Contact person mobile no <span className="text-red-500">*</span></label>
//             <div className="relative flex items-center border rounded pl-2">
//               <span className="text-gray-500"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" /></svg></span>
//               <input type="tel" name="mobile" value={formData.contactPerson.mobile} onChange={handleContactChange} placeholder="Enter 10-digit mobile number" className="w-full p-2 focus:outline-none" required />
//             </div>
//           </div>

//           <div>
//             <label className="block mb-1 font-medium">Contact person LinkedIn Profile</label>
//             <input type="url" name="linkedin" value={formData.contactPerson.linkedin} onChange={handleContactChange} placeholder="https://www.linkedin.com/in/username" className="w-full p-2 border rounded" />
//           </div>

//           <div>
//             <label className="block mb-1 font-medium">Minimum Students to be Hired <span className="text-red-500">*</span></label>
//             <div className="relative">
//               <select name="minStudents" value={formData.minStudents} onChange={handleChange} className="w-full p-2 border rounded appearance-none pr-8 bg-white" required>
//                 <option value="" disabled>Select minimum students</option>
//                 {minStudentsOptions.map((option) => (<option key={option} value={option}>{option}</option>))}
//               </select>
//               <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none"><ChevronDown className="w-4 h-4 text-gray-400" /></div>
//             </div>
//           </div>

//           <div className="flex justify-between mt-6">
//             <button
//               type="button"
//               onClick={() => window.history.back()}
//               className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
//             >
//               ← Back
//             </button>
//             <button type="submit" disabled={isSubmitting} className="px-6 py-2 bg-black text-white font-medium rounded hover:bg-gray-800 transition-colors disabled:opacity-50">
//               {isSubmitting ? 'Submitting...' : 'Register'}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }


import { useState, useRef, useEffect, useMemo } from 'react';
import axios from 'axios';
import { ChevronDown, X, Mail, Phone, Link, Building2 } from 'lucide-react';
import toast from 'react-hot-toast';
import CreatableSelect from 'react-select/creatable';
import { City } from 'country-state-city';

export default function RequestInfo() {
  // --- Data for Dropdowns ---
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
  const processOptions = ['Online Test',
    'Coding Test',
    'Aptitude Test',
    'Group Discussion',
    'Technical Interview',
    'HR Interview',
    'Case Study',
    'Presentation'].map(option => `${option}`).sort((a, b) => a.localeCompare(b));
  const designationOptions = ['HR Manager', 'Technical Recruiter', 'Talent Acquisition', 'Hiring Manager', 'Team Lead', 'Department Head', 'CEO', 'CTO', 'Founder', 'Other'];
  const minStudentsOptions = ['1-10', '11-25', '26-50', '51-100', '101-200', '201-500', '500+'];
  const degrees = Object.keys(degreeStreamMapping).sort();
  const collegeCategoryOptions = ['Tier 1', 'Tier 2', 'Tier 3', 'Autonomous', 'All Colleges'];
  const preferredModeOptions = ['Online', 'Offline', 'Hybrid', 'Online Aptitude and Physical Interview'];
  const amenitiesOptions = ['Projector', 'Auditorium', 'Interview Rooms', 'Wi-Fi Access', 'Refreshments', 'Parking'];
  const tagsOptions = ['Urgent hiring', 'Fresher preferred', 'Remote-friendly', 'Work from Home', 'Internship-eligible', 'Hybrid', 'High Priority', 'Contract', 'Part-time', 'Full-time'];

  // --- Component State and Logic ---
  const initialState = {
    venue: '',
    degree: [],
    studentStreams: [],
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
    numberOfRounds: '',
    selectionProcess: [],
    contactPerson: { name: '', designation: '', email: '', mobile: '', linkedin: '' },
    amenitiesRequired: [],
    benefits: [],
    tags: [],
    minStudents: '',
    eligibilityCriteria: '',
    description: '',
    broadcastType: 'Everyone',
  };

  const [formData, setFormData] = useState(initialState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [descriptionError, setDescriptionError] = useState("");

  // City Options generated from the npm package
  const cityOptions = useMemo(() =>
    City.getCitiesOfCountry('IN').map(city => ({
      value: city.name,
      label: city.name,
    })),
  []);

  // --- State for custom add inputs ---
  const [customDegree, setCustomDegree] = useState('');
  const [customStream, setCustomStream] = useState('');
  const [customJobRole, setCustomJobRole] = useState('');
  const [customSkill, setCustomSkill] = useState('');

  const [dropdownOpen, setDropdownOpen] = useState({
    studentStreams: false,
    skills: false,
    benefits: false,
    jobRoles: false,
    workLocations: false,
    preferredLocations: false,
    selectionProcess: false,
    tags: false,
    venue: false,
    degree: false,
    collegeCategories: false,
    amenities: false,
  });

  // --- Refs for all dropdowns ---
  const studentStreamsRef = useRef(null);
  const skillsRef = useRef(null);
  const benefitsRef = useRef(null);
  const jobRolesRef = useRef(null);
  const workLocationsRef = useRef(null);
  const preferredLocationsRef = useRef(null);
  const selectionProcessRef = useRef(null);
  const tagsRef = useRef(null);
  const venueRef = useRef(null);
  const degreeRef = useRef(null);
  const collegeCategoriesRef = useRef(null);
  const amenitiesRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      const refs = {
        studentStreams: studentStreamsRef,
        skills: skillsRef,
        benefits: benefitsRef,
        jobRoles: jobRolesRef,
        workLocations: workLocationsRef,
        preferredLocations: preferredLocationsRef,
        selectionProcess: selectionProcessRef,
        tags: tagsRef,
        venue: venueRef,
        degree: degreeRef,
        collegeCategories: collegeCategoriesRef,
        amenities: amenitiesRef,
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

  // --- useEffect to reset studentStreams when degree changes ---
  useEffect(() => {
    setFormData(prev => ({ ...prev, studentStreams: [] }));
  }, [formData.degree]);

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

  const handleInterviewWindowChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      interviewWindow: {
        ...prev.interviewWindow,
        [name]: value
      }
    }));
  };

  const handleHiringPreferenceChange = (value) => {
    setFormData(prev => ({
      ...prev,
      companyHiringPreference: { preferredMode: value }
    }));
  };

  const handleOptionSelect = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // --- Handler for adding custom (manual) items ---
  const handleCustomAdd = (field, value, setValue, predefinedOptions = []) => {
    if (value.trim() === '') return;
    setFormData(prev => {
      const currentValues = prev[field] || [];
      // Check for duplicates (case-insensitive)
      if (currentValues.map(v => v.toLowerCase()).includes(value.trim().toLowerCase()) || 
          predefinedOptions.map(v => v.toLowerCase()).includes(value.trim().toLowerCase())) {
        setValue(''); // Clear input even if duplicate
        toast.error("Item already exists.");
        return prev;
      }
      const newValues = [...currentValues, value.trim()];
      return { ...prev, [field]: newValues };
    });
    setValue(''); // Clear input after adding
  };

  // --- Calculate available streams based on multi-select degree (Union) ---
  const availableStreams = (() => {
    if (formData.degree.length === 0) {
      return [];
    }
    const allStreams = new Set();
    formData.degree.forEach(degree => {
      // Only check streams for degrees in our mapping
      if (degreeStreamMapping[degree]) {
        degreeStreamMapping[degree].forEach(stream => allStreams.add(stream));
      }
    });
    return [...allStreams].sort((a, b) => a.localeCompare(b));
  })();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.description.length > 500) {
      setDescriptionError("Job description cannot exceed 500 characters.");
      toast.error("Job description cannot exceed 500 characters.");
      return;
    }

    const fieldsToValidate = [
      { key: 'studentStreams', name: 'Student Stream' },
      { key: 'skills', name: 'Skills' },
      { key: 'benefits', name: 'Benefits Offered' },
      { key: 'workMode', name: 'Work Mode' },
      { key: 'employmentType', name: 'Employment Type' },
      { key: 'jobRoles', name: 'Job Role' },
      { key: 'workLocation', name: 'Work Location' },
      { key: 'selectionProcess', name: 'Process of Selection' },
    ];

    for (const field of fieldsToValidate) {
      if (formData[field.key].length === 0) {
        const errorMsg = `Please make a selection for "${field.name}". This field is required.`;
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
        rounds: formData.numberOfRounds ? [formData.numberOfRounds] : [],
        selectionProcess: formData.selectionProcess.join(' + '),
        contactPerson: formData.contactPerson,
        amenitiesRequired: formData.amenitiesRequired,
        benefits: formData.benefits,
        tags: formData.tags,
        minimumStudents: formData.minStudents,
        eligibilityCriteria: formData.eligibilityCriteria,
        description: formData.description,
        jobType: "On-campus",
        broadcastType: formData.broadcastType,
      };

      const response = await axios.post(
        `${import.meta.env.VITE_Backend_URL}/api/employer/hiring-channel/create-Oncampusjob`, 
        submissionData, 
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          withCredentials: true,
        }
      );

      if (response.status === 201) {
        toast.success('On-campus job posted');
        setTimeout(() => {
          toast.success('This job will expire after 15 days');
        }, 2000);
        setFormData(initialState);
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.response?.data?.error || 'Failed to submit form. Please try again.';
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handler for CreatableSelect components
  const handleLocationChange = (field, selectedOptions) => {
    setFormData(prev => ({
      ...prev,
      [field]: selectedOptions ? selectedOptions.map(option => option.value) : []
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#667eea]/5 via-[#f093fb]/5 to-[#764ba2]/5">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header section */}
        <div className="bg-white/90 backdrop-blur-sm border border-gray-100 rounded-2xl shadow-lg p-6 mb-8">
          <div className="text-center mb-6">
            <div className="flex items-center justify-center mb-3">
              <div className="p-2 bg-gradient-to-br from-[#667eea]/20 to-[#764ba2]/20 rounded-lg mr-3">
                <Building2 className="h-5 w-5 text-[#667eea]" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent">
                OnCampus Connect: Hire Smarter
              </h1>
            </div>
            <p className="text-md text-gray-600 max-w-2xl mx-auto">
              Our OnCampus service brings career opportunities directly to students, connecting them with top employers through campus recruitment drives and job events.
            </p>
          </div>
        </div>

        {/* Form Section */}
        <div className="bg-white/90 backdrop-blur-sm border border-gray-100 rounded-2xl shadow-lg p-6">
          {/* Main heading */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent">Register for On-Campus Hiring</h2>
            <p className="text-gray-500 mt-2">Fill in your requirements to find the best talent from campuses across the nation.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* On-Campus Hiring Venue */}
            <div ref={venueRef} className="relative">
              <label className="block mb-2 font-medium text-gray-700">On-Campus Hiring Venue <span className="text-red-500">*</span></label>
              <div 
                onClick={() => toggleDropdown('venue')}
                className="flex items-center justify-between p-3 w-full border border-gray-200 rounded-lg cursor-pointer hover:border-gray-300 transition-colors bg-gradient-to-r from-gray-50 to-white"
              >
                <span className={formData.venue ? "text-gray-700" : "text-gray-500"}>
                  {formData.venue || 'Select venue location'}
                </span>
                <ChevronDown className={`w-5 h-5 transition-transform ${dropdownOpen.venue ? "rotate-180" : ""} text-gray-400`} />
              </div>
              {dropdownOpen.venue && (
                <div className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg">
                  <div className="p-2 border-b border-gray-100">
                    <CreatableSelect
                      options={cityOptions}
                      value={formData.venue ? { value: formData.venue, label: formData.venue } : null}
                      onChange={(selectedOption) => {
                        setFormData(prev => ({ ...prev, venue: selectedOption ? selectedOption.value : '' }));
                        setDropdownOpen(prev => ({ ...prev, venue: false }));
                      }}
                      placeholder="Search for a city..."
                      styles={{
                        control: (base) => ({
                          ...base,
                          borderColor: '#e5e7eb',
                          minHeight: '42px',
                          borderRadius: '0.5rem',
                        }),
                        menu: (base) => ({
                          ...base,
                          borderRadius: '0.5rem',
                          border: '1px solid #e5e7eb',
                        }),
                      }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Degree Multi-Select with Custom Add */}
            <div ref={degreeRef} className="relative">
              <label className="block font-medium mb-2 text-gray-700">Degree <span className="text-red-500">*</span></label>
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.degree.map(degree => (
                  <div key={degree} className="flex items-center bg-gradient-to-r from-gray-100 to-white border border-gray-200 text-gray-700 text-sm px-3 py-1 rounded-full">
                    <span>{degree}</span>
                    <button type="button" onClick={() => removeSelectedItem('degree', degree)} className="ml-2 text-gray-500 hover:text-gray-700"><X size={14} /></button>
                  </div>
                ))}
              </div>
              <div
                className="flex items-center justify-between p-3 w-full border border-gray-200 rounded-lg cursor-pointer hover:border-gray-300 transition-colors bg-gradient-to-r from-gray-50 to-white"
                onClick={() => toggleDropdown('degree')}
              >
                <span className="text-gray-500">Select degree(s)</span>
                <ChevronDown className={`w-5 h-5 transition-transform ${dropdownOpen.degree ? "rotate-180" : ""} text-gray-400`} />
              </div>
              {dropdownOpen.degree && (
                <div className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg">
                  {/* Custom Degree Input */}
                  <div className="p-2 border-b border-gray-100 flex">
                    <input
                      type="text"
                      placeholder="Add custom degree..."
                      value={customDegree}
                      onChange={(e) => setCustomDegree(e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleCustomAdd('degree', customDegree, setCustomDegree, degrees);
                        }
                      }}
                      className="w-full p-2 border border-gray-200 rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCustomAdd('degree', customDegree, setCustomDegree, degrees);
                      }}
                      className="ml-2 px-4 py-2 bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white rounded-lg text-sm font-medium"
                    >
                      Add
                    </button>
                  </div>
                  <div className="max-h-60 overflow-auto">
                    {degrees.map(degree => (
                      <div key={degree} onClick={() => handleMultiSelect('degree', degree)} className={`px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 ${formData.degree.includes(degree) ? "bg-blue-50" : ""}`}>
                        <div className="flex items-center justify-between">
                          <span className={formData.degree.includes(degree) ? "text-[#667eea] font-medium" : "text-gray-700"}>{degree}</span>
                          {formData.degree.includes(degree) && <span className="text-[#667eea]">✓</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Student Stream with Custom Add */}
            <div ref={studentStreamsRef} className="relative">
              <label className="block font-medium mb-2 text-gray-700">Student Stream <span className="text-red-500">*</span></label>
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.studentStreams.map(stream => (
                  <div key={stream} className="flex items-center bg-gradient-to-r from-gray-100 to-white border border-gray-200 text-gray-700 text-sm px-3 py-1 rounded-full">
                    <span>{stream}</span>
                    <button type="button" onClick={() => removeSelectedItem('studentStreams', stream)} className="ml-2 text-gray-500 hover:text-gray-700"><X size={14} /></button>
                  </div>
                ))}
              </div>
              <div
                onClick={() => formData.degree.length > 0 && toggleDropdown('studentStreams')}
                className={`flex items-center justify-between p-3 w-full border rounded-lg ${!formData.degree.length ? 'bg-gray-50 cursor-not-allowed' : 'cursor-pointer hover:border-gray-300 transition-colors bg-gradient-to-r from-gray-50 to-white'} border-gray-200`}
              >
                <span className="text-gray-500">
                  {formData.degree.length > 0 ? 'Select streams' : 'Please select a degree first'}
                </span>
                <ChevronDown className={`w-5 h-5 transition-transform ${dropdownOpen.studentStreams ? "rotate-180" : ""} text-gray-400`} />
              </div>
              {dropdownOpen.studentStreams && formData.degree.length > 0 && (
                <div className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
                  {/* Custom Stream Input */}
                  <div className="p-2 border-b border-gray-100 flex">
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
                      className="w-full p-2 border border-gray-200 rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCustomAdd('studentStreams', customStream, setCustomStream, availableStreams);
                      }}
                      className="ml-2 px-4 py-2 bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white rounded-lg text-sm font-medium"
                    >
                      Add
                    </button>
                  </div>
                  <div className="max-h-48 overflow-auto">
                    {availableStreams.length > 0 ? (
                      availableStreams.map(stream => (
                        <div key={stream} onClick={() => handleMultiSelect('studentStreams', stream)} className={`px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 ${formData.studentStreams.includes(stream) ? "bg-blue-50" : ""}`}>
                          <div className="flex items-center justify-between">
                            <span className={formData.studentStreams.includes(stream) ? "text-[#667eea] font-medium" : "text-gray-700"}>{stream}</span>
                            {formData.studentStreams.includes(stream) && <span className="text-[#667eea]">✓</span>}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="px-4 py-3 text-gray-500 border-b border-gray-100">No predefined streams for custom degree. Add manually.</div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* College Categories */}
            <div ref={collegeCategoriesRef} className="relative">
              <label className="block font-medium mb-2 text-gray-700">College Categories</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.collegeCategories.map(type => (
                  <div key={type} className="flex items-center bg-gradient-to-r from-gray-100 to-white border border-gray-200 text-gray-700 text-sm px-3 py-1 rounded-full">
                    <span>{type}</span>
                    <button type="button" onClick={() => removeSelectedItem('collegeCategories', type)} className="ml-2 text-gray-500 hover:text-gray-700"><X size={14} /></button>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between p-3 w-full border border-gray-200 rounded-lg cursor-pointer hover:border-gray-300 transition-colors bg-gradient-to-r from-gray-50 to-white" onClick={() => toggleDropdown('collegeCategories')}>
                <span className="text-gray-500">Select college categories</span>
                <ChevronDown className={`w-5 h-5 transition-transform ${dropdownOpen.collegeCategories ? "rotate-180" : ""} text-gray-400`} />
              </div>
              {dropdownOpen.collegeCategories && (
                <div className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
                  {collegeCategoryOptions.map(type => (
                    <div key={type} onClick={() => handleMultiSelect('collegeCategories', type)} className={`px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 ${formData.collegeCategories.includes(type) ? "bg-blue-50" : ""}`}>
                      <div className="flex items-center justify-between">
                        <span className={formData.collegeCategories.includes(type) ? "text-[#667eea] font-medium" : "text-gray-700"}>{type}</span>
                        {formData.collegeCategories.includes(type) && <span className="text-[#667eea]">✓</span>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Preferred Hiring Locations */}
            <div>
              <label className="block font-medium mb-2 text-gray-700">Preferred Hiring Locations</label>
              <CreatableSelect
                isMulti
                options={cityOptions}
                value={formData.preferredLocations.map(location => ({ value: location, label: location }))}
                onChange={(selectedOptions) => handleLocationChange('preferredLocations', selectedOptions)}
                placeholder="Select or type to add locations..."
                styles={{
                  control: (base) => ({
                    ...base,
                    borderColor: '#e5e7eb',
                    minHeight: '42px',
                    borderRadius: '0.5rem',
                    backgroundColor: 'rgb(249 250 251 / var(--tw-bg-opacity))',
                    backgroundImage: 'linear-gradient(to right, rgb(249 250 251), rgb(255 255 255))',
                  }),
                  menu: (base) => ({
                    ...base,
                    borderRadius: '0.5rem',
                    border: '1px solid #e5e7eb',
                  }),
                  multiValue: (base) => ({
                    ...base,
                    backgroundColor: '#f3f4f6',
                    borderRadius: '9999px',
                  }),
                  multiValueRemove: (base) => ({
                    ...base,
                    color: '#6b7280',
                    ':hover': {
                      backgroundColor: '#e5e7eb',
                      color: '#374151',
                    },
                  }),
                }}
              />
            </div>

            {/* Broadcast Type */}
            <div>
              <label className="block mb-2 font-medium text-gray-700">Broadcast Options <span className="text-red-500">*</span></label>
              <div className="flex items-center space-x-6">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="broadcastType"
                    value="Everyone"
                    checked={formData.broadcastType === 'Everyone'}
                    onChange={handleChange}
                    className="h-4 w-4 text-[#667eea] border-gray-300 focus:ring-[#667eea]"
                  />
                  <span className="ml-2 text-gray-700">Broadcast to Everyone</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="broadcastType"
                    value="Location"
                    checked={formData.broadcastType === 'Location'}
                    onChange={handleChange}
                    className="h-4 w-4 text-[#667eea] border-gray-300 focus:ring-[#667eea]"
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
              <label className="block mb-2 font-medium text-gray-700">Looking for <span className="text-red-500">*</span></label>
              <div className="flex flex-wrap gap-2">
                <button type="button" className={`px-4 py-2 border rounded-lg transition-colors ${formData.lookingFor === 'Job' ? 'bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white border-transparent' : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300'}`} onClick={() => handleOptionSelect('lookingFor', 'Job')}>Job</button>
                <button type="button" className={`px-4 py-2 border rounded-lg transition-colors ${formData.lookingFor === 'Internship' ? 'bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white border-transparent' : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300'}`} onClick={() => handleOptionSelect('lookingFor', 'Internship')}>Internship</button>
                <button type="button" className={`px-4 py-2 border rounded-lg transition-colors ${formData.lookingFor === 'Both' ? 'bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white border-transparent' : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300'}`} onClick={() => handleOptionSelect('lookingFor', 'Both')}>Both</button>
              </div>
            </div>

            {/* Employment type */}
            <div>
              <label className="block mb-2 font-medium text-gray-700">Employment type <span className="text-red-500">*</span></label>
              <div className="flex flex-wrap gap-2">
                {['Part-time', 'Full-time', 'Contract'].map(type => (
                  <button key={type} type="button" className={`px-4 py-2 border rounded-lg transition-colors ${formData.employmentType.includes(type) ? 'bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white border-transparent' : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300'}`} onClick={() => handleMultiSelect('employmentType', type)}>
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Work Mode */}
            <div>
              <label className="block mb-2 font-medium text-gray-700">Work Mode <span className="text-red-500">*</span></label>
              <div className="flex space-x-2">
                <button type="button" className={`px-4 py-2 border rounded-lg transition-colors ${formData.workMode === 'Hybrid' ? 'bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white border-transparent' : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300'}`} onClick={() => handleOptionSelect('workMode', 'Hybrid')}>Hybrid</button>
                <button type="button" className={`px-4 py-2 border rounded-lg transition-colors ${formData.workMode === 'On-site' ? 'bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white border-transparent' : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300'}`} onClick={() => handleOptionSelect('workMode', 'On-site')}>On-site</button>
                <button type="button" className={`px-4 py-2 border rounded-lg transition-colors ${formData.workMode === 'Remote' ? 'bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white border-transparent' : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300'}`} onClick={() => handleOptionSelect('workMode', 'Remote')}>Remote</button>
              </div>
            </div>
            
            {/* Preferred Hiring Mode */}
            <div>
              <label className="block mb-2 font-medium text-gray-700">Preferred Hiring Mode</label>
              <div className="flex flex-wrap gap-2">
                {preferredModeOptions.map(mode => (
                  <button 
                    key={mode} 
                    type="button" 
                    className={`px-4 py-2 border rounded-lg transition-colors ${formData.companyHiringPreference.preferredMode === mode ? 'bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white border-transparent' : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300'}`} 
                    onClick={() => handleHiringPreferenceChange(mode)}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>

            {/* Job Roles with Custom Add */}
            <div ref={jobRolesRef} className="relative">
              <label className="block font-medium mb-2 text-gray-700">Job Role <span className="text-red-500">*</span></label>
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.jobRoles.map(role => (
                  <div key={role} className="flex items-center bg-gradient-to-r from-gray-100 to-white border border-gray-200 text-gray-700 text-sm px-3 py-1 rounded-full">
                    <span>{role}</span>
                    <button type="button" onClick={() => removeSelectedItem('jobRoles', role)} className="ml-2 text-gray-500 hover:text-gray-700"><X size={14} /></button>
                  </div>
                ))}
              </div>
              <div onClick={() => toggleDropdown('jobRoles')} className="flex items-center justify-between p-3 w-full border border-gray-200 rounded-lg cursor-pointer hover:border-gray-300 transition-colors bg-gradient-to-r from-gray-50 to-white">
                <span className="text-gray-500">Select job roles</span>
                <ChevronDown className={`w-5 h-5 transition-transform ${dropdownOpen.jobRoles ? "rotate-180" : ""} text-gray-400`} />
              </div>
              {dropdownOpen.jobRoles && (
                <div className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
                  {/* Custom Job Role Input */}
                  <div className="p-2 border-b border-gray-100 flex">
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
                      className="w-full p-2 border border-gray-200 rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCustomAdd('jobRoles', customJobRole, setCustomJobRole, jobRoles);
                      }}
                      className="ml-2 px-4 py-2 bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white rounded-lg text-sm font-medium"
                    >
                      Add
                    </button>
                  </div>
                  <div className="max-h-48 overflow-auto">
                    {jobRoles.map(role => (
                      <div key={role} onClick={() => handleMultiSelect('jobRoles', role)} className={`px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 ${formData.jobRoles.includes(role) ? "bg-blue-50" : ""}`}>
                        <div className="flex items-center justify-between">
                          <span className={formData.jobRoles.includes(role) ? "text-[#667eea] font-medium" : "text-gray-700"}>{role}</span>
                          {formData.jobRoles.includes(role) && <span className="text-[#667eea]">✓</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Work Location with Enhanced Search */}
            <div>
              <label className="block font-medium mb-2 text-gray-700">Work Location <span className="text-red-500">*</span></label>
              <CreatableSelect
                isMulti
                options={cityOptions}
                value={formData.workLocation.map(location => ({ value: location, label: location }))}
                onChange={(selectedOptions) => handleLocationChange('workLocation', selectedOptions)}
                placeholder="Select or type to add work locations..."
                styles={{
                  control: (base) => ({
                    ...base,
                    borderColor: '#e5e7eb',
                    minHeight: '42px',
                    borderRadius: '0.5rem',
                    backgroundColor: 'rgb(249 250 251 / var(--tw-bg-opacity))',
                    backgroundImage: 'linear-gradient(to right, rgb(249 250 251), rgb(255 255 255))',
                  }),
                  menu: (base) => ({
                    ...base,
                    borderRadius: '0.5rem',
                    border: '1px solid #e5e7eb',
                  }),
                  multiValue: (base) => ({
                    ...base,
                    backgroundColor: '#f3f4f6',
                    borderRadius: '9999px',
                  }),
                  multiValueRemove: (base) => ({
                    ...base,
                    color: '#6b7280',
                    ':hover': {
                      backgroundColor: '#e5e7eb',
                      color: '#374151',
                    },
                  }),
                }}
              />
            </div>

            {/* Skills with Custom Add */}
            <div ref={skillsRef} className="relative">
              <label className="block font-medium mb-2 text-gray-700">Skills <span className="text-red-500">*</span></label>
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.skills.map(skill => (
                  <div key={skill} className="flex items-center bg-gradient-to-r from-gray-100 to-white border border-gray-200 text-gray-700 text-sm px-3 py-1 rounded-full">
                    <span>{skill}</span>
                    <button type="button" onClick={() => removeSelectedItem('skills', skill)} className="ml-2 text-gray-500 hover:text-gray-700"><X size={14} /></button>
                  </div>
                ))}
              </div>
              <div onClick={() => toggleDropdown('skills')} className="flex items-center justify-between p-3 w-full border border-gray-200 rounded-lg cursor-pointer hover:border-gray-300 transition-colors bg-gradient-to-r from-gray-50 to-white">
                <span className="text-gray-500">Select required skills</span>
                <ChevronDown className={`w-5 h-5 transition-transform ${dropdownOpen.skills ? "rotate-180" : ""} text-gray-400`} />
              </div>
              {dropdownOpen.skills && (
                <div className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
                  {/* Custom Skill Input */}
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
                      className="w-full p-2 border border-gray-200 rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCustomAdd('skills', customSkill, setCustomSkill, skillsOptions);
                      }}
                      className="ml-2 px-4 py-2 bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white rounded-lg text-sm font-medium"
                    >
                      Add
                    </button>
                  </div>
                  <div className="max-h-48 overflow-auto">
                    {skillsOptions.map(skill => (
                      <div key={skill} onClick={() => handleMultiSelect('skills', skill)} className={`px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 ${formData.skills.includes(skill) ? "bg-blue-50" : ""}`}>
                        <div className="flex items-center justify-between">
                          <span className={formData.skills.includes(skill) ? "text-[#667eea] font-medium" : "text-gray-700"}>{skill}</span>
                          {formData.skills.includes(skill) && <span className="text-[#667eea]">✓</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="block mb-2 font-medium text-gray-700">Eligibility Criteria <span className="text-red-500">*</span></label>
              <textarea name="eligibilityCriteria" value={formData.eligibilityCriteria} onChange={handleChange} placeholder="Example: Minimum 60% aggregate, No active backlogs..." className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#667eea]/50 focus:border-transparent focus:outline-none transition-all duration-200 bg-gradient-to-r from-gray-50 to-white resize-none h-24" required></textarea>
            </div>

            <div>
              <label className="block mb-2 font-medium text-gray-700">Job Description <span className="text-red-500">*</span></label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Provide a detailed job description..."
                className={`w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#667eea]/50 focus:border-transparent focus:outline-none transition-all duration-200 bg-gradient-to-r from-gray-50 to-white resize-none h-24 ${descriptionError ? 'border-red-500' : ''}`}
                maxLength={600}
                required
              ></textarea>
              <div className="flex justify-between text-xs mt-1">
                <span className={descriptionError ? 'text-red-500' : 'text-gray-500'}>
                  {descriptionError ? descriptionError : `${formData.description.length}/500 characters`}
                </span>
              </div>
            </div>

            {/* Amenities/Facilities Required */}
            <div ref={amenitiesRef} className="relative">
              <label className="block font-medium mb-2 text-gray-700">Amenities/Facilities Required</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.amenitiesRequired.map(amenity => (
                  <div key={amenity} className="flex items-center bg-gradient-to-r from-gray-100 to-white border border-gray-200 text-gray-700 text-sm px-3 py-1 rounded-full">
                    <span>{amenity}</span>
                    <button type="button" onClick={() => removeSelectedItem('amenitiesRequired', amenity)} className="ml-2 text-gray-500 hover:text-gray-700"><X size={14} /></button>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between p-3 w-full border border-gray-200 rounded-lg cursor-pointer hover:border-gray-300 transition-colors bg-gradient-to-r from-gray-50 to-white" onClick={() => toggleDropdown('amenities')}>
                <span className="text-gray-500">Select required amenities</span>
                <ChevronDown className={`w-5 h-5 transition-transform ${dropdownOpen.amenities ? "rotate-180" : ""} text-gray-400`} />
              </div>
              {dropdownOpen.amenities && (
                <div className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
                  {amenitiesOptions.map(amenity => (
                    <div key={amenity} onClick={() => handleMultiSelect('amenitiesRequired', amenity)} className={`px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 ${formData.amenitiesRequired.includes(amenity) ? "bg-blue-50" : ""}`}>
                      <div className="flex items-center justify-between">
                        <span className={formData.amenitiesRequired.includes(amenity) ? "text-[#667eea] font-medium" : "text-gray-700"}>{amenity}</span>
                        {formData.amenitiesRequired.includes(amenity) && <span className="text-[#667eea]">✓</span>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div ref={benefitsRef} className="relative">
              <label className="block font-medium mb-2 text-gray-700">Benefits Offered <span className="text-red-500">*</span></label>
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.benefits.map(benefit => (
                  <div key={benefit} className="flex items-center bg-gradient-to-r from-gray-100 to-white border border-gray-200 text-gray-700 text-sm px-3 py-1 rounded-full">
                    <span>{benefit}</span>
                    <button type="button" onClick={() => removeSelectedItem('benefits', benefit)} className="ml-2 text-gray-500 hover:text-gray-700"><X size={14} /></button>
                  </div>
                ))}
              </div>
              <div onClick={() => toggleDropdown('benefits')} className="flex items-center justify-between p-3 w-full border border-gray-200 rounded-lg cursor-pointer hover:border-gray-300 transition-colors bg-gradient-to-r from-gray-50 to-white">
                <span className="text-gray-500">Select benefits</span>
                <ChevronDown className={`w-5 h-5 transition-transform ${dropdownOpen.benefits ? "rotate-180" : ""} text-gray-400`} />
              </div>
              {dropdownOpen.benefits && (
                <div className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
                  {benefitsOptions.map(benefit => (
                    <div key={benefit} onClick={() => handleMultiSelect('benefits', benefit)} className={`px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 ${formData.benefits.includes(benefit) ? "bg-blue-50" : ""}`}>
                      <div className="flex items-center justify-between">
                        <span className={formData.benefits.includes(benefit) ? "text-[#667eea] font-medium" : "text-gray-700"}>{benefit}</span>
                        {formData.benefits.includes(benefit) && <span className="text-[#667eea]">✓</span>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Package Details */}
            <div>
              <label className="block mb-2 font-medium text-gray-700">Package Details <span className="text-red-500">*</span></label>
              <div className="flex mb-2">
                <div className="relative w-24">
                  <select
                    name="currency"
                    value={formData.packageDetails.currency}
                    onChange={handlePackageDetailsChange}
                    className="w-full h-full p-2 border border-gray-200 rounded-l-lg appearance-none bg-gradient-to-r from-gray-50 to-white pr-8 text-center focus:ring-2 focus:ring-[#667eea]/50 focus:border-transparent focus:outline-none"
                  >
                    <option value="INR">INR</option>
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                </div>
                <input
                  type="number"
                  name="totalCTC"
                  value={formData.packageDetails.totalCTC}
                  onChange={handlePackageDetailsChange}
                  placeholder="Total CTC (e.g. 1000000)"
                  className="flex-1 p-3 border border-l-0 border-gray-200 rounded-r-lg focus:ring-2 focus:ring-[#667eea]/50 focus:border-transparent focus:outline-none transition-all duration-200 bg-gradient-to-r from-gray-50 to-white"
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
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#667eea]/50 focus:border-transparent focus:outline-none transition-all duration-200 bg-gradient-to-r from-gray-50 to-white"
                />
                <input
                  type="number"
                  name="joiningBonus"
                  value={formData.packageDetails.joiningBonus}
                  onChange={handlePackageDetailsChange}
                  placeholder="Variable Pay (e.g. 50000)"
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#667eea]/50 focus:border-transparent focus:outline-none transition-all duration-200 bg-gradient-to-r from-gray-50 to-white"
                />
              </div>
            </div>

            <div>
              <label className="block mb-2 font-medium text-gray-700">Tentative Date of Placement / Hiring <span className="text-red-500">*</span></label>
              <div className="flex space-x-4">
                <div className="w-1/2">
                  <label className="block mb-1 text-sm text-gray-600">Start Date</label>
                  <div className="relative">
                    <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#667eea]/50 focus:border-transparent focus:outline-none transition-all duration-200 bg-gradient-to-r from-gray-50 to-white" required />
                  </div>
                </div>
                <div className="w-1/2">
                  <label className="block mb-1 text-sm text-gray-600">End Date</label>
                  <div className="relative">
                    <input type="date" name="endDate" value={formData.endDate} onChange={handleChange} className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#667eea]/50 focus:border-transparent focus:outline-none transition-all duration-200 bg-gradient-to-r from-gray-50 to-white" required />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Hiring Timeline */}
            <div>
              <label className="block mb-2 font-medium text-gray-700">Hiring Timeline</label>
              <div className="space-y-4">
                <div>
                  <label className="block mb-1 text-sm text-gray-600">Online Test Date</label>
                  <input type="date" name="onlineTestDate" className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#667eea]/50 focus:border-transparent focus:outline-none transition-all duration-200 bg-gradient-to-r from-gray-50 to-white" value={formData.onlineTestDate} onChange={handleChange} />
                </div>

                <div className="flex space-x-4">
                  <div className="w-1/2">
                    <label className="block mb-1 text-sm text-gray-600">Interview Window (Start)</label>
                    <input type="date" name="start" className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#667eea]/50 focus:border-transparent focus:outline-none transition-all duration-200 bg-gradient-to-r from-gray-50 to-white" value={formData.interviewWindow.start} onChange={handleInterviewWindowChange} />
                  </div>
                  <div className="w-1/2">
                    <label className="block mb-1 text-sm text-gray-600">Interview Window (End)</label>
                    <input type="date" name="end" className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#667eea]/50 focus:border-transparent focus:outline-none transition-all duration-200 bg-gradient-to-r from-gray-50 to-white" value={formData.interviewWindow.end} onChange={handleInterviewWindowChange} />
                  </div>
                </div>
                
                <div>
                  <label className="block mb-1 text-sm text-gray-600">Offer Rollout Date</label>
                  <input type="date" name="offerRolloutDate" className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#667eea]/50 focus:border-transparent focus:outline-none transition-all duration-200 bg-gradient-to-r from-gray-50 to-white" value={formData.offerRolloutDate} onChange={handleChange} />
                </div>
              </div>
            </div>

            <div>
              <label className="block mb-2 font-medium text-gray-700">Number of Rounds <span className="text-red-500">*</span></label>
              <div className="relative">
                <select name="numberOfRounds" value={formData.numberOfRounds} onChange={handleChange} className="w-full p-3 border border-gray-200 rounded-lg appearance-none bg-gradient-to-r from-gray-50 to-white pr-10 focus:ring-2 focus:ring-[#667eea]/50 focus:border-transparent focus:outline-none transition-all duration-200" required>
                  <option value="" disabled>Select number of rounds</option>
                  {numberOfRoundsOptions.map((round) => (<option key={round} value={round}>{round}</option>))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              </div>
            </div>

            <div ref={selectionProcessRef} className="relative">
              <label className="block font-medium mb-2 text-gray-700">Process of Selection <span className="text-red-500">*</span></label>
              <div
                onClick={() => toggleDropdown('selectionProcess')}
                className="flex items-center justify-between p-3 w-full border border-gray-200 rounded-lg cursor-pointer hover:border-gray-300 transition-colors min-h-[42px] bg-gradient-to-r from-gray-50 to-white"
              >
                <span className={formData.selectionProcess.length > 0 ? "text-gray-700" : "text-gray-500"}>
                  {formData.selectionProcess.length > 0
                    ? formData.selectionProcess.join(' + ')
                    : 'Select process'}
                </span>
                <ChevronDown className={`w-5 h-5 transition-transform ${dropdownOpen.selectionProcess ? "rotate-180" : ""} text-gray-400`} />
              </div>
              {dropdownOpen.selectionProcess && (
                <div className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
                  {processOptions.map(process => (
                    <div
                      key={process}
                      onClick={() => handleMultiSelect('selectionProcess', process)}
                      className={`px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 ${formData.selectionProcess.includes(process) ? "bg-blue-50" : ""}`}
                    >
                      <div className="flex items-center justify-between">
                        <span className={formData.selectionProcess.includes(process) ? "text-[#667eea] font-medium" : "text-gray-700"}>{process}</span>
                        {formData.selectionProcess.includes(process) && <span className="text-[#667eea]">✓</span>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Tags multi-select */}
            <div ref={tagsRef} className="relative">
              <label className="block font-medium mb-2 text-gray-700">Tags</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.tags.map(tag => (
                  <div key={tag} className="flex items-center bg-gradient-to-r from-gray-100 to-white border border-gray-200 text-gray-700 text-sm px-3 py-1 rounded-full">
                    <span>{tag}</span>
                    <button type="button" onClick={() => removeSelectedItem('tags', tag)} className="ml-2 text-gray-500 hover:text-gray-700"><X size={14} /></button>
                  </div>
                ))}
              </div>
              <div onClick={() => toggleDropdown('tags')} className="flex items-center justify-between p-3 w-full border border-gray-200 rounded-lg cursor-pointer hover:border-gray-300 transition-colors bg-gradient-to-r from-gray-50 to-white">
                <span className="text-gray-500">Select tags</span>
                <ChevronDown className={`w-5 h-5 transition-transform ${dropdownOpen.tags ? "rotate-180" : ""} text-gray-400`} />
              </div>
              {dropdownOpen.tags && (
                <div className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
                  {tagsOptions.map(tag => (
                    <div key={tag} onClick={() => handleMultiSelect('tags', tag)} className={`px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 ${formData.tags.includes(tag) ? "bg-blue-50" : ""}`}>
                      <div className="flex items-center justify-between">
                        <span className={formData.tags.includes(tag) ? "text-[#667eea] font-medium" : "text-gray-700"}>{tag}</span>
                        {formData.tags.includes(tag) && <span className="text-[#667eea]">✓</span>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="block mb-2 font-medium text-gray-700">Contact Person <span className="text-red-500">*</span></label>
              <input type="text" name="name" value={formData.contactPerson.name} onChange={handleContactChange} placeholder="Enter full name" className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#667eea]/50 focus:border-transparent focus:outline-none transition-all duration-200 bg-gradient-to-r from-gray-50 to-white" required />
            </div>

            <div>
              <label className="block mb-2 font-medium text-gray-700">Contact person designation <span className="text-red-500">*</span></label>
              <div className="relative">
                <select name="designation" value={formData.contactPerson.designation} onChange={handleContactChange} className="w-full p-3 border border-gray-200 rounded-lg appearance-none bg-gradient-to-r from-gray-50 to-white pr-10 focus:ring-2 focus:ring-[#667eea]/50 focus:border-transparent focus:outline-none transition-all duration-200" required>
                  <option value="" disabled>Select designation</option>
                  {designationOptions.map((designation) => (<option key={designation} value={designation}>{designation}</option>))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              </div>
            </div>

            <div>
              <label className="block mb-2 font-medium text-gray-700">Contact person email <span className="text-red-500">*</span></label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <input type="email" name="email" value={formData.contactPerson.email} onChange={handleContactChange} placeholder="example@company.com" className="w-full p-3 pl-10 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#667eea]/50 focus:border-transparent focus:outline-none transition-all duration-200 bg-gradient-to-r from-gray-50 to-white" required />
              </div>
            </div>

            <div>
              <label className="block mb-2 font-medium text-gray-700">Contact person mobile no <span className="text-red-500">*</span></label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <input type="tel" name="mobile" value={formData.contactPerson.mobile} onChange={handleContactChange} placeholder="Enter 10-digit mobile number" className="w-full p-3 pl-10 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#667eea]/50 focus:border-transparent focus:outline-none transition-all duration-200 bg-gradient-to-r from-gray-50 to-white" required />
              </div>
            </div>

            <div>
              <label className="block mb-2 font-medium text-gray-700">Contact person LinkedIn Profile</label>
              <div className="relative">
                <Link className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <input type="url" name="linkedin" value={formData.contactPerson.linkedin} onChange={handleContactChange} placeholder="https://www.linkedin.com/in/username" className="w-full p-3 pl-10 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#667eea]/50 focus:border-transparent focus:outline-none transition-all duration-200 bg-gradient-to-r from-gray-50 to-white" />
              </div>
            </div>

            <div>
              <label className="block mb-2 font-medium text-gray-700">Minimum Students to be Hired <span className="text-red-500">*</span></label>
              <div className="relative">
                <select name="minStudents" value={formData.minStudents} onChange={handleChange} className="w-full p-3 border border-gray-200 rounded-lg appearance-none bg-gradient-to-r from-gray-50 to-white pr-10 focus:ring-2 focus:ring-[#667eea]/50 focus:border-transparent focus:outline-none transition-all duration-200" required>
                  <option value="" disabled>Select minimum students</option>
                  {minStudentsOptions.map((option) => (<option key={option} value={option}>{option}</option>))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              </div>
            </div>

            <div className="flex justify-between pt-4">
              <button
                type="button"
                onClick={() => window.history.back()}
                className="px-6 py-2 text-[#667eea] hover:text-[#764ba2] font-medium transition-colors"
              >
                ← Back
              </button>
              <button type="submit" disabled={isSubmitting} className="px-8 py-3 bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white font-semibold rounded-lg shadow-md hover:shadow-lg hover:shadow-[#667eea]/30 focus:outline-none focus:ring-2 focus:ring-[#667eea]/50 transition-all duration-200 disabled:opacity-50">
                {isSubmitting ? 'Submitting...' : 'Register'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}