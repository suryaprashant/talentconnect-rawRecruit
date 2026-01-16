// import { useState, useRef, useEffect, useMemo } from 'react';
// import axios from 'axios';
// import { ChevronDown, X, Calendar, Clock, Users, Target, GraduationCap, Building, DollarSign, List, MapPin, User, Mail, Phone, Linkedin, ArrowLeft, Send, CheckSquare, Briefcase, School, Monitor, MessageSquare } from 'lucide-react';
// import toast from 'react-hot-toast';
// import CreatableSelect from 'react-select/creatable';
// import { City } from 'country-state-city';
// import DatePicker from 'react-datepicker';
// import "react-datepicker/dist/react-datepicker.css";

// export default function PoolCampusHiringForm({ onBackClick }) {
//     const initialFormState = {
//         venue: '',
//         degree: [],
//         collegeTypes: '',
//         workMode: [],
//         employmentType: [],
//         salaryRange: 'INR',
//         salaryValue: '',
//         tentativeStartDate: '',
//         tentativeEndDate: '',
//         rounds: Array.from({ length: 6 }, (_, i) => ({ id: i + 1, students: '', branch: '', skills: '' })),
//         contactPerson: {
//             name: '',
//             designation: '',
//             email: '',
//             mobile: '',
//             linkedin: '',
//         },
//         minStudentsToBePlaced: '',
//         amenities: [],
//         description: '',
//         companyType: [],
//         proposedSchedule: { startDate: '', endDate: '', preferredMode: '' },
//     };

//     const [formData, setFormData] = useState(initialFormState);
//     const [isSubmitting, setIsSubmitting] = useState(false);
//     const [alert, setAlert] = useState({ show: false, message: '', type: '' });

//     const amenitiesRef = useRef(null);
//     const degreeRef = useRef(null);
//     const collegeTypesRef = useRef(null);
//     const companyTypeRef = useRef(null);

//     const [dropdownOpen, setDropdownOpen] = useState({
//         amenities: false,
//         degree: false,
//         collegeTypes: false,
//         companyType: false
//     });
    
//     const [customAmenity, setCustomAmenity] = useState('');
//     const [customDegree, setCustomDegree] = useState('');
//     const [customCollegeType, setCustomCollegeType] = useState('');
//     const [customCompanyType, setCustomCompanyType] = useState('');

//     const cityOptions = useMemo(() => {
//         const indianCities = City.getCitiesOfCountry('IN')
//             .map(city => ({
//                 value: city.name,
//                 label: city.name,
//             }))
//             .sort((a, b) => a.label.localeCompare(b.label));
        
//         return [
//             { value: 'Online', label: 'Online' },
//             { value: 'Other', label: 'Other' },
//             ...indianCities
//         ];
//     }, []);

//     const degreeOptions = ['B.Tech', 'M.Tech', 'MBA', 'B.Sc', 'M.Sc', 'PhD'];
//     const collegeTypeOptions = ['Engineering', 'Medical', 'Management', 'Arts & Science', 'Law', 'Pharmacy', 'Architecture'];
//     const workModeOptions = ['On-site', 'Remote', 'Hybrid'];
//     const branchOptions = ['Computer Science', 'Mechanical', 'Civil', 'Electrical', 'Electronics', 'Bio-medical'];
//     const designationOptions = ['HR Manager', 'Technical Recruiter', 'Talent Acquisition', 'Hiring Manager', 'Team Lead', 'Department Head', 'CEO', 'CTO', 'Founder', 'Other'];
//     const minStudentsOptions = ['1-10', '11-25', '26-50', '51-100', '101-200', '200+'];
//     const amenitiesOptions = ['Auditorium', 'Seminar Hall', 'Interview Rooms', 'Computer Labs', 'Wi-Fi Access', 'Projector'];
//     const companyTypeOptions = ["MNC", "Startup", "SME", "Public Sector"];
//     const proposedModeOptions = ["Online", "Offline", "Hybrid"];

//     useEffect(() => {
//         const handleClickOutside = (event) => {
//             const refs = {
//                 amenities: amenitiesRef,
//                 degree: degreeRef,
//                 collegeTypes: collegeTypesRef,
//                 companyType: companyTypeRef,
//             };
//             for (const key in refs) {
//                 if (refs[key].current && !refs[key].current.contains(event.target)) {
//                     setDropdownOpen(prev => ({ ...prev, [key]: false }));
//                 }
//             }
//         };
//         document.addEventListener('mousedown', handleClickOutside);
//         return () => document.removeEventListener('mousedown', handleClickOutside);
//     }, []);
    
//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setFormData(prev => ({ ...prev, [name]: value }));
//     };

//     // Helper function to format date locally to prevent UTC "day back" shift
//     const formatDateLocal = (date) => {
//         if (!date) return '';
//         const year = date.getFullYear();
//         const month = String(date.getMonth() + 1).padStart(2, '0');
//         const day = String(date.getDate()).padStart(2, '0');
//         return `${year}-${month}-${day}`;
//     };

//     // Helper function to handle top-level date changes
//     const handleDateChange = (date, field) => {
//         const formattedDate = formatDateLocal(date);
//         setFormData(prev => ({ ...prev, [field]: formattedDate }));
//     };

//     // Helper function to handle nested proposedSchedule date changes
//     const handleProposedDateChange = (date, field) => {
//         const formattedDate = formatDateLocal(date);
//         setFormData(prev => ({
//             ...prev,
//             proposedSchedule: {
//                 ...prev.proposedSchedule,
//                 [field]: formattedDate
//             }
//         }));
//     };

//     const handleVenueChange = (selectedOption) => {
//         setFormData(prev => ({ ...prev, venue: selectedOption ? selectedOption.value : '' }));
//     };

//     const handleOptionSelect = (field, value) => {
//         setFormData(prev => ({ ...prev, [field]: value }));
//         setDropdownOpen(prev => ({ ...prev, [field]: false }));
//     };

//     const handleProposedScheduleChange = (e) => {
//         const { name, value } = e.target;
//         setFormData(prev => ({
//             ...prev,
//             proposedSchedule: {
//                 ...prev.proposedSchedule,
//                 [name]: value
//             }
//         }));
//     };

//     const handleContactChange = (e) => {
//         const { name, value } = e.target;
//         setFormData(prev => ({
//             ...prev,
//             contactPerson: {
//                 ...prev.contactPerson,
//                 [name]: value
//             }
//         }));
//     };

//     const handleMultiToggle = (field, value) => {
//         setFormData(prev => {
//             const currentValues = prev[field] || [];
//             const newValues = currentValues.includes(value)
//                 ? currentValues.filter(item => item !== value)
//                 : [...currentValues, value];
//             return { ...prev, [field]: newValues };
//         });
//     };

//     const handleRoundChange = (id, field, value) => {
//         const updatedRounds = formData.rounds.map(round =>
//             round.id === id ? { ...round, [field]: value } : round
//         );
//         setFormData(prev => ({ ...prev, rounds: updatedRounds }));
//     };

//     const handleCustomAdd = (field, item, setCustomInput) => {
//         const trimmedItem = item.trim();
//         if (trimmedItem) {
//             setFormData(prev => {
//                 const currentValues = prev[field] || [];
//                 if (currentValues.map(v => v.toLowerCase()).includes(trimmedItem.toLowerCase())) {
//                     toast.error("Item already in the list.");
//                     return prev;
//                 }
//                 return { ...prev, [field]: [trimmedItem, ...currentValues] };
//             });
//         }
//         setCustomInput('');
//     };
    
//     const handleCustomSingleAdd = (field, item, setCustomInput) => {
//         const trimmedItem = item.trim();
//         if (trimmedItem) {
//             setFormData(prev => ({ ...prev, [field]: trimmedItem }));
//             setDropdownOpen(prev => ({ ...prev, [field]: false }));
//         }
//         setCustomInput('');
//     };

//     const removeItem = (field, valueToRemove) => {
//         setFormData(prev => ({
//             ...prev,
//             [field]: prev[field].filter(item => item !== valueToRemove)
//         }));
//     };

//     const showAlert = (message, type) => {
//         setAlert({ show: true, message, type });
//         setTimeout(() => setAlert({ show: false, message: '', type: '' }), 5000);
//     };

//     const resetForm = () => {
//         setFormData(initialFormState);
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setIsSubmitting(true);

//         if (formData.degree.length === 0 || !formData.venue || !formData.contactPerson.email || !formData.contactPerson.mobile) {
//             showAlert('Please fill all required fields marked with *', 'error');
//             setIsSubmitting(false);
//             return;
//         }

//         let aggregatedSkills = [];
//         let studentStreams = [];
//         let roundNames = [];
//         let studentCounts = [];
//         let roundSkills = [];

//         const nonEmptyRounds = formData.rounds.filter(round => round.students || round.branch || round.skills);
//         nonEmptyRounds.forEach(round => {
//             if (round.skills) {
//                 roundSkills.push(round.skills);
//                 aggregatedSkills.push(...round.skills.split(',').map(s => s.trim()).filter(Boolean));
//             }
//             if (round.branch) studentStreams.push(round.branch);
//             if (round.students) studentCounts.push(round.students);
//             roundNames.push(`Round ${round.id}`);
//         });

//         const payload = {
//             jobType: "Pool-campus",
//             venue: formData.venue,
//             degree: formData.degree,
//             collegeTypes: formData.collegeTypes ? [formData.collegeTypes] : [],
//             workMode: formData.workMode,
//             employmentType: formData.employmentType,
//             packageDetails: {
//                 currency: formData.salaryRange,
//                 totalCTC: parseFloat(formData.salaryValue) || 0,
//             },
//             startDate: formData.tentativeStartDate,
//             endDate: formData.tentativeEndDate,
//             rounds: roundNames,
//             studentStreams: [...new Set(studentStreams)],
//             skills: aggregatedSkills,
//             numberOfStudent: studentCounts,
//             contactPerson: formData.contactPerson,
//             noOfplacedStudents: formData.minStudentsToBePlaced,
//             amenitiesRequired: formData.amenities,
//             description: formData.description,
//             companyType: formData.companyType,
//             proposedSchedule: formData.proposedSchedule,
//             roundDetails: nonEmptyRounds,
//             roundSkills: roundSkills,
//         };

//         try {
//             const token = localStorage.getItem('token') || document.cookie.split('; ').find(row => row.startsWith('jwt='))?.split('=')[1];
            
//             const response = await axios.post(`${import.meta.env.VITE_Backend_URL}/api/hiring-channels/pool-campus/college-request`, payload, {
//                 withCredentials: true,
//                 headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
//             });

//             toast.success(response.data.message);
//             resetForm();
//         } catch (error) {
//             console.error('Submission error:', error);
//             toast.error('Something went wrong!');
//         } finally {
//             setIsSubmitting(false);
//         }
//     };

//     return (
//         <div className="min-h-screen bg-gradient-to-br from-[#f0e6f7]/60 via-[#d4e8f9]/55 to-[#cff7ea]/60">
//             {/* Pastel blur background elements */}
//             <div className="fixed inset-0 overflow-hidden pointer-events-none">
//                 <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#fbcfe8]/20 rounded-full blur-3xl"></div>
//                 <div className="absolute top-1/3 -left-20 w-60 h-60 bg-[#93c5fd]/20 rounded-full blur-3xl"></div>
//                 <div className="absolute bottom-20 right-1/3 w-40 h-40 bg-[#a7f3d0]/20 rounded-full blur-3xl"></div>
//                 <div className="absolute top-1/4 right-1/4 w-48 h-48 bg-[#c7d2fe]/20 rounded-full blur-3xl"></div>
//                 <div className="absolute bottom-1/3 left-1/4 w-56 h-56 bg-[#fde68a]/10 rounded-full blur-3xl"></div>
//             </div>

//             <div className="relative z-10 container mx-auto px-4 py-8 max-w-4xl">
//                 {/* Header Section */}
//                 <div className="mb-12 text-center">
//                     <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#3b82f6] to-[#8b5cf6] bg-clip-text text-transparent mb-2">
//                         Pool Campus Connect: Hire Bigger
//                     </h1>
//                     <p className="text-gray-600 text-lg md:text-xl max-w-3xl mx-auto">
//                         Tap into diverse talent from multiple institutions through one powerful drive.
//                     </p>
//                 </div>

//                 {/* Form Section */}
//                 <div className="bg-white/90 backdrop-blur-sm border border-white/50 rounded-2xl shadow-lg shadow-blue-50/50 p-8">
//                     <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-[#3b82f6] to-[#8b5cf6] bg-clip-text text-transparent mb-2 text-center">
//                         Register for Pool Campus Hiring
//                     </h2>
//                     <p className="text-gray-600 mb-8 text-center">
//                         Fill in the details below to register for the hiring drive
//                     </p>

//                     <form onSubmit={handleSubmit} className="space-y-6">
//                         {/* Pool Campus Hiring Venue */}
//                         <div>
//                             <label className="block text-gray-700 font-medium mb-2 flex items-center gap-2">
//                                 <MapPin className="w-4 h-4 text-[#3b82f6]" />
//                                 Pool Campus Hiring Venue <span className="text-red-500">*</span>
//                             </label>
//                             <CreatableSelect
//                                 isClearable
//                                 options={cityOptions}
//                                 value={formData.venue ? { value: formData.venue, label: formData.venue } : null}
//                                 onChange={handleVenueChange}
//                                 placeholder="Select or type to add a location..."
//                                 styles={{
//                                     control: (base) => ({
//                                         ...base,
//                                         backgroundColor: 'rgba(255, 255, 255, 0.5)',
//                                         backdropFilter: 'blur(8px)',
//                                         borderColor: 'rgba(255, 255, 255, 0.5)',
//                                         minHeight: '48px',
//                                         borderRadius: '12px',
//                                         boxShadow: 'none',
//                                         '&:hover': {
//                                             borderColor: '#93c5fd',
//                                         },
//                                     }),
//                                     menu: (base) => ({
//                                         ...base,
//                                         backgroundColor: 'rgba(255, 255, 255, 0.9)',
//                                         backdropFilter: 'blur(8px)',
//                                         borderRadius: '12px',
//                                         border: '1px solid rgba(255, 255, 255, 0.5)',
//                                     }),
//                                 }}
//                             />
//                         </div>

//                         {/* Degree */}
//                         <div ref={degreeRef}>
//                             <label className="block text-gray-700 font-medium mb-2 flex items-center gap-2">
//                                 <GraduationCap className="w-4 h-4 text-[#3b82f6]" />
//                                 Degree(s) <span className="text-red-500">*</span>
//                             </label>
//                             <div className="relative">
//                                 <div
//                                     className="w-full bg-white/50 backdrop-blur-sm border border-white/50 rounded-xl p-3 min-h-[48px] cursor-pointer hover:border-[#93c5fd] transition-all duration-200"
//                                     onClick={() => setDropdownOpen(prev => ({ ...prev, degree: !prev.degree }))}
//                                 >
//                                     {formData.degree.length > 0 ? (
//                                         <div className="flex flex-wrap gap-2">
//                                             {formData.degree.map(deg => (
//                                                 <span key={deg} className="flex items-center bg-gradient-to-r from-[#93c5fd]/20 to-[#3b82f6]/20 text-[#3b82f6] text-xs font-semibold px-3 py-1 rounded-full border border-[#93c5fd]/30">
//                                                     {deg}
//                                                     <button type="button" onClick={(e) => { e.stopPropagation(); removeItem('degree', deg); }} className="ml-1.5 hover:bg-[#3b82f6]/20 rounded-full p-0.5">
//                                                         <X size={12} />
//                                                     </button>
//                                                 </span>
//                                             ))}
//                                         </div>
//                                     ) : <span className="text-gray-500">Select degrees</span>}
//                                     <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
//                                         <ChevronDown className={`w-5 h-5 text-[#3b82f6] transition-transform ${dropdownOpen.degree ? "rotate-180" : ""}`} />
//                                     </div>
//                                 </div>
//                                 {dropdownOpen.degree && (
//                                     <div className="absolute z-20 w-full bg-white/90 backdrop-blur-sm border border-white/50 rounded-xl mt-1 shadow-lg shadow-blue-50/50 overflow-hidden">
//                                         <div className="p-3 border-b border-white/50">
//                                             <div className="flex gap-2">
//                                                 <input
//                                                     type="text"
//                                                     placeholder="Add custom degree..."
//                                                     className="w-full bg-white/50 backdrop-blur-sm border border-white/50 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#93c5fd] focus:border-transparent"
//                                                     value={customDegree}
//                                                     onChange={(e) => setCustomDegree(e.target.value)}
//                                                     onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleCustomAdd('degree', customDegree, setCustomDegree); } }}
//                                                 />
//                                                 <button
//                                                     type="button"
//                                                     className="px-4 py-2 bg-gradient-to-r from-[#93c5fd] to-[#3b82f6] text-white rounded-lg text-sm font-medium"
//                                                     onClick={() => handleCustomAdd('degree', customDegree, setCustomDegree)}
//                                                 >
//                                                     Add
//                                                 </button>
//                                             </div>
//                                         </div>
//                                         <div className="max-h-60 overflow-auto">
//                                             {degreeOptions.map(opt => (
//                                                 <div key={opt} className={`px-4 py-3 hover:bg-[#93c5fd]/10 cursor-pointer border-b border-white/50 last:border-b-0 transition-colors duration-200 flex justify-between items-center ${formData.degree.includes(opt) ? "bg-[#93c5fd]/10" : ""}`} onClick={() => handleMultiToggle('degree', opt)}>
//                                                     <div className="flex items-center">
//                                                         <div className={`w-5 h-5 border-2 rounded mr-3 flex items-center justify-center ${formData.degree.includes(opt) ? 'bg-[#3b82f6] border-[#3b82f6]' : 'border-gray-300'}`}>
//                                                             {formData.degree.includes(opt) && <CheckSquare size={12} className="text-white" />}
//                                                         </div>
//                                                         {opt}
//                                                     </div>
//                                                     {formData.degree.includes(opt) && <span className="text-[#3b82f6]">✓</span>}
//                                                 </div>
//                                             ))}
//                                         </div>
//                                     </div>
//                                 )}
//                             </div>
//                         </div>

//                         {/* College Type */}
//                         <div ref={collegeTypesRef}>
//                             <label className="block text-gray-700 font-medium mb-2 flex items-center gap-2">
//                                 <School className="w-4 h-4 text-[#3b82f6]" />
//                                 Type of College
//                             </label>
//                             <div
//                                 onClick={() => setDropdownOpen(prev => ({ ...prev, collegeTypes: !prev.collegeTypes }))}
//                                 className="w-full bg-white/50 backdrop-blur-sm border border-white/50 rounded-xl p-3 min-h-[48px] cursor-pointer hover:border-[#93c5fd] transition-all duration-200 flex items-center justify-between"
//                             >
//                                 <span className={formData.collegeTypes ? "text-gray-900" : "text-gray-500"}>
//                                     {formData.collegeTypes || 'Select college type'}
//                                 </span>
//                                 <ChevronDown className={`w-4 h-4 text-[#3b82f6] transition-transform ${dropdownOpen.collegeTypes ? "rotate-180" : ""}`} />
//                             </div>
//                             {dropdownOpen.collegeTypes && (
//                                 <div className="absolute z-20 w-full bg-white/90 backdrop-blur-sm border border-white/50 rounded-xl mt-1 shadow-lg shadow-blue-50/50 overflow-hidden">
//                                     <div className="p-3 border-b border-white/50">
//                                         <div className="flex gap-2">
//                                             <input
//                                                 type="text"
//                                                 placeholder="Add custom type..."
//                                                 className="w-full bg-white/50 backdrop-blur-sm border border-white/50 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#93c5fd] focus:border-transparent"
//                                                 value={customCollegeType}
//                                                 onChange={(e) => setCustomCollegeType(e.target.value)}
//                                                 onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleCustomSingleAdd('collegeTypes', customCollegeType, setCustomCollegeType); } }}
//                                             />
//                                             <button
//                                                 type="button"
//                                                 className="px-4 py-2 bg-gradient-to-r from-[#93c5fd] to-[#3b82f6] text-white rounded-lg text-sm font-medium"
//                                                 onClick={() => handleCustomSingleAdd('collegeTypes', customCollegeType, setCustomCollegeType)}
//                                             >
//                                                 Add
//                                             </button>
//                                         </div>
//                                     </div>
//                                     <div className="max-h-60 overflow-auto">
//                                         {collegeTypeOptions.map(option => (
//                                             <div
//                                                 key={option}
//                                                 onClick={() => handleOptionSelect('collegeTypes', option)}
//                                                 className={`px-4 py-3 hover:bg-[#93c5fd]/10 cursor-pointer border-b border-white/50 last:border-b-0 transition-colors duration-200 ${formData.collegeTypes === option ? 'bg-[#93c5fd]/10' : ''}`}
//                                             >
//                                                 {option}
//                                             </div>
//                                         ))}
//                                     </div>
//                                 </div>
//                             )}
//                         </div>

//                         {/* Work Mode */}
//                         <div>
//                             <label className="block text-gray-700 font-medium mb-2 flex items-center gap-2">
//                                 <Monitor className="w-4 h-4 text-[#3b82f6]" />
//                                 Work Mode
//                             </label>
//                             <div className="flex gap-3">
//                                 {workModeOptions.map((type) => (
//                                     <button key={type} type="button" className={`px-4 py-3 rounded-xl border transition-all duration-200 font-medium flex-1 ${
//                                         formData.workMode.includes(type) 
//                                             ? 'bg-gradient-to-r from-[#93c5fd] to-[#3b82f6] text-white border-transparent shadow-md shadow-[#93c5fd]/30' 
//                                             : 'bg-white/50 backdrop-blur-sm border-white/50 text-gray-700 hover:bg-white/70'
//                                     }`} onClick={() => handleMultiToggle('workMode', type)}>
//                                         {type}
//                                     </button>
//                                 ))}
//                             </div>
//                         </div>

//                         {/* Employment Type */}
//                         <div>
//                             <label className="block text-gray-700 font-medium mb-2 flex items-center gap-2">
//                                 <Briefcase className="w-4 h-4 text-[#3b82f6]" />
//                                 Employment type
//                             </label>
//                             <div className="flex gap-3">
//                                 {['Part-time', 'Full-time', 'Contract'].map((type) => (
//                                     <button key={type} type="button" className={`px-4 py-3 rounded-xl border transition-all duration-200 font-medium flex-1 ${
//                                         formData.employmentType.includes(type) 
//                                             ? 'bg-gradient-to-r from-[#93c5fd] to-[#3b82f6] text-white border-transparent shadow-md shadow-[#93c5fd]/30' 
//                                             : 'bg-white/50 backdrop-blur-sm border-white/50 text-gray-700 hover:bg-white/70'
//                                     }`} onClick={() => handleMultiToggle('employmentType', type)}>
//                                         {type}
//                                     </button>
//                                 ))}
//                             </div>
//                         </div>

//                         {/* Application Dates */}
//                         <div>
//                             <label className="block text-gray-700 font-medium mb-2 flex items-center gap-2">
//                                 <Calendar className="w-4 h-4 text-[#3b82f6]" />
//                                 Application Start/End Date
//                             </label>
//                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                                 <div className="relative">
//                                     <DatePicker
//                                         selected={formData.tentativeStartDate ? new Date(formData.tentativeStartDate) : null}
//                                         onChange={(date) => handleDateChange(date, 'tentativeStartDate')}
//                                         dateFormat="dd-MM-yyyy"
//                                         placeholderText="Start Date"
//                                         className="w-full bg-white/50 backdrop-blur-sm border border-white/50 rounded-xl p-3 pl-10 focus:outline-none focus:ring-2 focus:ring-[#93c5fd] focus:border-transparent transition-all duration-200"
//                                         wrapperClassName="w-full"
//                                     />
//                                     <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
//                                 </div>
//                                 <div className="relative">
//                                     <DatePicker
//                                         selected={formData.tentativeEndDate ? new Date(formData.tentativeEndDate) : null}
//                                         onChange={(date) => handleDateChange(date, 'tentativeEndDate')}
//                                         dateFormat="dd-MM-yyyy"
//                                         placeholderText="End Date"
//                                         className="w-full bg-white/50 backdrop-blur-sm border border-white/50 rounded-xl p-3 pl-10 focus:outline-none focus:ring-2 focus:ring-[#93c5fd] focus:border-transparent transition-all duration-200"
//                                         wrapperClassName="w-full"
//                                     />
//                                     <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
//                                 </div>
//                             </div>
//                         </div>

//                         {/* Proposed Schedule */}
//                         <div>
//                             <label className="block text-gray-700 font-medium mb-2 flex items-center gap-2">
//                                 <Clock className="w-4 h-4 text-[#3b82f6]" />
//                                 Proposed Schedule (Tentative Dates)
//                             </label>
//                             <div className="space-y-4">
//                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                                     <div className="relative">
//                                         <DatePicker
//                                             selected={formData.proposedSchedule.startDate ? new Date(formData.proposedSchedule.startDate) : null}
//                                             onChange={(date) => handleProposedDateChange(date, 'startDate')}
//                                             dateFormat="dd-MM-yyyy"
//                                             placeholderText="Proposed Start Date"
//                                             className="w-full bg-white/50 backdrop-blur-sm border border-white/50 rounded-xl p-3 pl-10 focus:outline-none focus:ring-2 focus:ring-[#93c5fd] focus:border-transparent transition-all duration-200"
//                                             wrapperClassName="w-full"
//                                         />
//                                         <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
//                                     </div>
//                                     <div className="relative">
//                                         <DatePicker
//                                             selected={formData.proposedSchedule.endDate ? new Date(formData.proposedSchedule.endDate) : null}
//                                             onChange={(date) => handleProposedDateChange(date, 'endDate')}
//                                             dateFormat="dd-MM-yyyy"
//                                             placeholderText="Proposed End Date"
//                                             className="w-full bg-white/50 backdrop-blur-sm border border-white/50 rounded-xl p-3 pl-10 focus:outline-none focus:ring-2 focus:ring-[#93c5fd] focus:border-transparent transition-all duration-200"
//                                             wrapperClassName="w-full"
//                                         />
//                                         <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
//                                     </div>
//                                 </div>
//                                 <div className="relative">
//                                     <select 
//                                         name="preferredMode" 
//                                         className="w-full bg-white/50 backdrop-blur-sm border border-white/50 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#93c5fd] focus:border-transparent appearance-none transition-all duration-200" 
//                                         value={formData.proposedSchedule.preferredMode} 
//                                         onChange={handleProposedScheduleChange}
//                                     >
//                                         <option value="">Select Preferred Mode</option>
//                                         {proposedModeOptions.map(option => (
//                                             <option key={option} value={option}>{option}</option>
//                                         ))}
//                                     </select>
//                                     <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
//                                         <ChevronDown size={16} className="text-[#3b82f6]" />
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>

//                         {/* Salary */}
//                         <div>
//                             <label className="block text-gray-700 font-medium mb-2 flex items-center gap-2">
//                                 <DollarSign className="w-4 h-4 text-[#3b82f6]" />
//                                 Minimum Cut-off Salary
//                             </label>
//                             <div className="flex rounded-xl overflow-hidden shadow-sm">
//                                 <select 
//                                     name="salaryRange" 
//                                     className="bg-white/50 backdrop-blur-sm border border-white/50 px-3 py-3 w-24 focus:outline-none focus:ring-2 focus:ring-[#93c5fd] focus:border-transparent" 
//                                     value={formData.salaryRange} 
//                                     onChange={handleChange}
//                                 >
//                                     <option>USD</option>
//                                     <option>INR</option>
//                                     <option>EUR</option>
//                                 </select>
//                                 <input 
//                                     name="salaryValue" 
//                                     type="number" 
//                                     className="bg-white/50 backdrop-blur-sm border border-white/50 flex-1 px-3 py-3 focus:outline-none focus:ring-2 focus:ring-[#93c5fd] focus:border-transparent" 
//                                     placeholder="Enter amount" 
//                                     value={formData.salaryValue} 
//                                     onChange={handleChange} 
//                                 />
//                             </div>
//                         </div>

//                         {/* Rounds Table */}
//                         <div>
//                             <label className="block text-gray-700 font-medium mb-2 flex items-center gap-2">
//                                 <List className="w-4 h-4 text-[#3b82f6]" />
//                                 Number of Rounds
//                             </label>
//                             <div className="overflow-x-auto border border-white/50 rounded-xl bg-white/30">
//                                 <table className="min-w-full divide-y divide-white/50">
//                                     <thead className="bg-white/50">
//                                         <tr>
//                                             <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">S.No.</th>
//                                             <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Branch</th>
//                                             <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No. of Students</th>
//                                             <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Skills (comma separated)</th>
//                                         </tr>
//                                     </thead>
//                                     <tbody className="bg-white/30 divide-y divide-white/50">
//                                         {formData.rounds.map((round) => (
//                                             <tr key={round.id}>
//                                                 <td className="px-4 py-3 text-sm text-gray-900">{round.id}</td>
//                                                 <td className="px-4 py-3">
//                                                     <div className="relative">
//                                                         <select 
//                                                             className="w-full bg-white/50 backdrop-blur-sm border border-white/50 rounded-lg px-3 py-2 text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-[#93c5fd] focus:border-transparent" 
//                                                             value={round.branch} 
//                                                             onChange={(e) => handleRoundChange(round.id, 'branch', e.target.value)}
//                                                         >
//                                                             <option value="">Select Branch</option>
//                                                             {branchOptions.map(option => (
//                                                                 <option key={option} value={option}>{option}</option>
//                                                             ))}
//                                                         </select>
//                                                         <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
//                                                             <ChevronDown size={14} className="text-[#3b82f6]" />
//                                                         </div>
//                                                     </div>
//                                                 </td>
//                                                 <td className="px-4 py-3">
//                                                     <input 
//                                                         type="number" 
//                                                         className="w-full bg-white/50 backdrop-blur-sm border border-white/50 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#93c5fd] focus:border-transparent" 
//                                                         value={round.students} 
//                                                         onChange={(e) => handleRoundChange(round.id, 'students', e.target.value)} 
//                                                         min="0" 
//                                                     />
//                                                 </td>
//                                                 <td className="px-4 py-3">
//                                                     <input 
//                                                         type="text" 
//                                                         className="w-full bg-white/50 backdrop-blur-sm border border-white/50 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#93c5fd] focus:border-transparent" 
//                                                         value={round.skills} 
//                                                         onChange={(e) => handleRoundChange(round.id, 'skills', e.target.value)} 
//                                                         placeholder="e.g., Python, SQL" 
//                                                     />
//                                                 </td>
//                                             </tr>
//                                         ))}
//                                     </tbody>
//                                 </table>
//                             </div>
//                         </div>

//                         {/* Amenities */}
//                         <div ref={amenitiesRef}>
//                             <label className="block text-gray-700 font-medium mb-2 flex items-center gap-2">
//                                 <Building className="w-4 h-4 text-[#3b82f6]" />
//                                 Campus Facilities/Amenities Provided
//                             </label>
//                             <div className="relative">
//                                 <div 
//                                     className="w-full bg-white/50 backdrop-blur-sm border border-white/50 rounded-xl p-3 min-h-[48px] cursor-pointer hover:border-[#93c5fd] transition-all duration-200" 
//                                     onClick={() => setDropdownOpen(prev => ({ ...prev, amenities: !prev.amenities }))}
//                                 >
//                                     {formData.amenities.length > 0 ? (
//                                         <div className="flex flex-wrap gap-2">
//                                             {formData.amenities.map(item => (
//                                                 <span key={item} className="flex items-center bg-gradient-to-r from-[#93c5fd]/20 to-[#3b82f6]/20 text-[#3b82f6] text-xs font-semibold px-3 py-1 rounded-full border border-[#93c5fd]/30">
//                                                     {item}
//                                                     <button type="button" onClick={(e) => { e.stopPropagation(); removeItem('amenities', item); }} className="ml-1.5 hover:bg-[#3b82f6]/20 rounded-full p-0.5">
//                                                         <X size={12} />
//                                                     </button>
//                                                 </span>
//                                             ))}
//                                         </div>
//                                     ) : <span className="text-gray-500">Select facilities</span>}
//                                     <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
//                                         <ChevronDown className={`w-5 h-5 text-[#3b82f6] transition-transform ${dropdownOpen.amenities ? "rotate-180" : ""}`} />
//                                     </div>
//                                 </div>
//                                 {dropdownOpen.amenities && (
//                                     <div className="absolute z-20 w-full bg-white/90 backdrop-blur-sm border border-white/50 rounded-xl mt-1 shadow-lg shadow-blue-50/50 overflow-hidden">
//                                         <div className="p-3 border-b border-white/50">
//                                             <div className="flex gap-2">
//                                                 <input 
//                                                     type="text" 
//                                                     placeholder="Add custom facility..." 
//                                                     className="w-full bg-white/50 backdrop-blur-sm border border-white/50 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#93c5fd] focus:border-transparent" 
//                                                     value={customAmenity} 
//                                                     onChange={(e) => setCustomAmenity(e.target.value)} 
//                                                     onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleCustomAdd('amenities', customAmenity, setCustomAmenity); } }} 
//                                                 />
//                                                 <button
//                                                     type="button"
//                                                     className="px-4 py-2 bg-gradient-to-r from-[#93c5fd] to-[#3b82f6] text-white rounded-lg text-sm font-medium"
//                                                     onClick={() => handleCustomAdd('amenities', customAmenity, setCustomAmenity)}
//                                                 >
//                                                     Add
//                                                 </button>
//                                             </div>
//                                         </div>
//                                         <div className="max-h-60 overflow-auto">
//                                             {amenitiesOptions.map(opt => (
//                                                 <div key={opt} className={`px-4 py-3 hover:bg-[#93c5fd]/10 cursor-pointer border-b border-white/50 last:border-b-0 transition-colors duration-200 flex justify-between items-center ${formData.amenities.includes(opt) ? "bg-[#93c5fd]/10" : ""}`} onClick={() => handleMultiToggle('amenities', opt)}>
//                                                     <div className="flex items-center">
//                                                         <div className={`w-5 h-5 border-2 rounded mr-3 flex items-center justify-center ${formData.amenities.includes(opt) ? 'bg-[#3b82f6] border-[#3b82f6]' : 'border-gray-300'}`}>
//                                                             {formData.amenities.includes(opt) && <CheckSquare size={12} className="text-white" />}
//                                                         </div>
//                                                         {opt}
//                                                     </div>
//                                                     {formData.amenities.includes(opt) && <span className="text-[#3b82f6]">✓</span>}
//                                                 </div>
//                                             ))}
//                                         </div>
//                                     </div>
//                                 )}
//                             </div>
//                         </div>

//                         {/* Description */}
//                         <div>
//                             <label htmlFor="description" className="block text-gray-700 font-medium mb-2 flex items-center gap-2">
//                                 <MessageSquare className="w-4 h-4 text-[#3b82f6]" />
//                                 Description / Message
//                             </label>
//                             <textarea 
//                                 id="description" 
//                                 name="description" 
//                                 className="w-full bg-white/50 backdrop-blur-sm border border-white/50 rounded-xl px-3 py-3 focus:outline-none focus:ring-2 focus:ring-[#93c5fd] focus:border-transparent transition-all duration-200 resize-none" 
//                                 placeholder="Any additional information..." 
//                                 value={formData.description} 
//                                 onChange={handleChange} 
//                                 rows="3"
//                             ></textarea>
//                         </div>

//                         <hr className="border-white/50" />

//                         {/* Contact Person */}
//                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                             <div>
//                                 <label className="block text-gray-700 font-medium mb-2 flex items-center gap-2">
//                                     <User className="w-4 h-4 text-[#3b82f6]" />
//                                     Contact Person Name <span className="text-red-500">*</span>
//                                 </label>
//                                 <input 
//                                     type="text" 
//                                     name="name" 
//                                     value={formData.contactPerson.name} 
//                                     onChange={handleContactChange} 
//                                     placeholder="Enter full name" 
//                                     className="w-full bg-white/50 backdrop-blur-sm border border-white/50 rounded-xl px-3 py-3 focus:outline-none focus:ring-2 focus:ring-[#93c5fd] focus:border-transparent transition-all duration-200" 
//                                     required 
//                                 />
//                             </div>
//                             <div>
//                                 <label className="block text-gray-700 font-medium mb-2 flex items-center gap-2">
//                                     <User className="w-4 h-4 text-[#3b82f6]" />
//                                     Designation <span className="text-red-500">*</span>
//                                 </label>
//                                 <select 
//                                     name="designation" 
//                                     value={formData.contactPerson.designation} 
//                                     onChange={handleContactChange} 
//                                     className="w-full bg-white/50 backdrop-blur-sm border border-white/50 rounded-xl px-3 py-3 focus:outline-none focus:ring-2 focus:ring-[#93c5fd] focus:border-transparent appearance-none transition-all duration-200" 
//                                     required
//                                 >
//                                     <option value="" disabled>Select designation</option>
//                                     {designationOptions.map((designation) => (
//                                         <option key={designation} value={designation}>{designation}</option>
//                                     ))}
//                                 </select>
//                             </div>
//                             <div>
//                                 <label className="block text-gray-700 font-medium mb-2 flex items-center gap-2">
//                                     <Mail className="w-4 h-4 text-[#3b82f6]" />
//                                     Contact person email <span className="text-red-500">*</span>
//                                 </label>
//                                 <input 
//                                     type="email" 
//                                     name="email" 
//                                     value={formData.contactPerson.email} 
//                                     onChange={handleContactChange} 
//                                     placeholder="example@company.com" 
//                                     className="w-full bg-white/50 backdrop-blur-sm border border-white/50 rounded-xl px-3 py-3 focus:outline-none focus:ring-2 focus:ring-[#93c5fd] focus:border-transparent transition-all duration-200" 
//                                     required 
//                                 />
//                             </div>
//                             <div>
//                                 <label className="block text-gray-700 font-medium mb-2 flex items-center gap-2">
//                                     <Phone className="w-4 h-4 text-[#3b82f6]" />
//                                     Contact person mobile no <span className="text-red-500">*</span>
//                                 </label>
//                                 <input 
//                                     type="tel" 
//                                     name="mobile" 
//                                     value={formData.contactPerson.mobile} 
//                                     onChange={handleContactChange} 
//                                     placeholder="Enter 10-digit mobile number" 
//                                     className="w-full bg-white/50 backdrop-blur-sm border border-white/50 rounded-xl px-3 py-3 focus:outline-none focus:ring-2 focus:ring-[#93c5fd] focus:border-transparent transition-all duration-200" 
//                                     required 
//                                 />
//                             </div>
//                         </div>

//                         <div>
//                             <label className="block text-gray-700 font-medium mb-2 flex items-center gap-2">
//                                 <Linkedin className="w-4 h-4 text-[#3b82f6]" />
//                                 Contact person LinkedIn Profile
//                             </label>
//                             <input 
//                                 type="url" 
//                                 name="linkedin" 
//                                 value={formData.contactPerson.linkedin} 
//                                 onChange={handleContactChange} 
//                                 placeholder="https://www.linkedin.com/in/username" 
//                                 className="w-full bg-white/50 backdrop-blur-sm border border-white/50 rounded-xl px-3 py-3 focus:outline-none focus:ring-2 focus:ring-[#93c5fd] focus:border-transparent transition-all duration-200" 
//                             />
//                         </div>

//                         <div>
//                             <label htmlFor="minStudentsToBePlaced" className="block text-gray-700 font-medium mb-2 flex items-center gap-2">
//                                 <Users className="w-4 h-4 text-[#3b82f6]" />
//                                 Minimum Students to be Placed <span className="text-red-500">*</span>
//                             </label>
//                             <div className="relative">
//                                 <select 
//                                     id="minStudentsToBePlaced" 
//                                     name="minStudentsToBePlaced" 
//                                     className="w-full bg-white/50 backdrop-blur-sm border border-white/50 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#93c5fd] focus:border-transparent appearance-none transition-all duration-200" 
//                                     value={formData.minStudentsToBePlaced} 
//                                     onChange={handleChange} 
//                                     required 
//                                 >
//                                     <option value="">Select Range</option>
//                                     {minStudentsOptions.map(option => (
//                                         <option key={option} value={option}>{option}</option>
//                                     ))}
//                                 </select>
//                                 <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
//                                     <ChevronDown size={16} className="text-[#3b82f6]" />
//                                 </div>
//                             </div>
//                         </div>

//                         {/* Form Actions */}
//                         <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-8 border-t border-gray-200/50">
//                             {onBackClick && (
//                                 <button 
//                                     type="button"
//                                     onClick={onBackClick}
//                                     className="flex items-center gap-2 text-[#3b82f6] hover:text-[#1d4ed8] font-medium transition-colors duration-200 group"
//                                 >
//                                     <ArrowLeft className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform duration-200" />
//                                     Back to Home
//                                 </button>
//                             )}
//                             <button 
//                                 type="submit"
//                                 disabled={isSubmitting}
//                                 className="group flex items-center gap-3 px-8 py-3 bg-gradient-to-r from-[#93c5fd] to-[#3b82f6] text-white rounded-xl hover:shadow-lg hover:shadow-[#93c5fd]/40 transition-all duration-200 text-base font-medium disabled:opacity-70 disabled:cursor-not-allowed"
//                             >
//                                 <Send className="w-5 h-5" />
//                                 {isSubmitting ? 'Submitting...' : 'Register'}
//                                 <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
//                                 </svg>
//                             </button>
//                         </div>
//                     </form>
//                 </div>
//             </div>
//         </div>
//     );
// }


import { useState, useRef, useEffect, useMemo } from 'react';
import axios from 'axios';
import { ChevronDown, X, Calendar, Clock, Users, Target, GraduationCap, Building, DollarSign, IndianRupee, Euro, List, Plus, Trash2, MapPin, User, Mail, Phone, Linkedin, ArrowLeft, Send, CheckSquare, Briefcase, School, Monitor, MessageSquare } from 'lucide-react';
import toast from 'react-hot-toast';
import CreatableSelect from 'react-select/creatable';
import { City } from 'country-state-city';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

export default function PoolCampusHiringForm({ onBackClick }) {
    const initialFormState = {
        venue: '',
        degree: [],
        collegeTypes: '',
        workMode: [],
        employmentType: [],
        salaryRange: 'INR',
        salaryValue: '',
        tentativeStartDate: '',
        tentativeEndDate: '',
        rounds: Array.from({ length: 3 }, (_, i) => ({ id: i + 1, students: '', branch: '', skills: '' })),
        contactPerson: {
            name: '',
            designation: '',
            email: '',
            mobile: '',
            linkedin: '',
        },
        minStudentsToBePlaced: '',
        amenities: [],
        description: '',
        companyType: [],
        proposedSchedule: { startDate: '', endDate: '', preferredMode: '' },
    };

    const [formData, setFormData] = useState(initialFormState);
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [alert, setAlert] = useState({ show: false, message: '', type: '' });
    const [descriptionError, setDescriptionError] = useState("");

    const amenitiesRef = useRef(null);
    const degreeRef = useRef(null);
    const collegeTypesRef = useRef(null);
    const companyTypeRef = useRef(null);

    const [dropdownOpen, setDropdownOpen] = useState({
        amenities: false,
        degree: false,
        collegeTypes: false,
        companyType: false
    });
    
    const [customAmenity, setCustomAmenity] = useState('');
    const [customDegree, setCustomDegree] = useState('');
    const [customCollegeType, setCustomCollegeType] = useState('');
    const [customCompanyType, setCustomCompanyType] = useState('');

    const cityOptions = useMemo(() => {
        const indianCities = City.getCitiesOfCountry('IN')
            .map(city => ({
                value: city.name,
                label: city.name,
            }))
            .sort((a, b) => a.label.localeCompare(b.label));
        
        return [
            { value: 'Online', label: 'Online' },
            { value: 'Other', label: 'Other' },
            ...indianCities
        ];
    }, []);

    // Function to add a new row
const handleAddRound = () => {
  // Create new round object
  const newRound = {
    id: Date.now(), // Unique ID using timestamp
    branch: '',
    students: '',
    skills: ''
  };
  
  // Update form data with new round added to array
  setFormData(prev => ({
    ...prev,
    rounds: [...prev.rounds, newRound]
  }));
};

// Function to remove a row
const handleRemoveRound = (id) => {
  // Filter out the round with the matching id
  const updatedRounds = formData.rounds.filter(round => round.id !== id);
  setFormData(prev => ({
    ...prev,
    rounds: updatedRounds
  }));
};

    const degreeOptions = ['B.Tech', 'M.Tech', 'MBA', 'B.Sc', 'M.Sc', 'PhD'];
    const collegeTypeOptions = ['Engineering', 'Medical', 'Management', 'Arts & Science', 'Law', 'Pharmacy', 'Architecture'];
    const workModeOptions = ['On-site', 'Remote', 'Hybrid'];
    const branchOptions = ['Computer Science', 'Mechanical', 'Civil', 'Electrical', 'Electronics', 'Bio-medical'];
    const designationOptions = ['Professor', 'HOD', 'Placement Officer', 'Dean', 'Coordinator'];
    const minStudentsOptions = ['1-10', '11-25', '26-50', '51-100', '101-200', '200+'];
    const amenitiesOptions = ['Auditorium', 'Seminar Hall', 'Interview Rooms', 'Computer Labs', 'Wi-Fi Access', 'Projector'];
    const companyTypeOptions = ["MNC", "Startup", "SME", "Public Sector"];
    const proposedModeOptions = ["Online", "Offline", "Hybrid"];

    useEffect(() => {
        const handleClickOutside = (event) => {
            const refs = {
                amenities: amenitiesRef,
                degree: degreeRef,
                collegeTypes: collegeTypesRef,
                companyType: companyTypeRef,
            };
            for (const key in refs) {
                if (refs[key].current && !refs[key].current.contains(event.target)) {
                    setDropdownOpen(prev => ({ ...prev, [key]: false }));
                }
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const formatDateLocal = (date) => {
        if (!date) return '';
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const handleDateChange = (date, field) => {
        const formattedDate = formatDateLocal(date);
        setFormData(prev => ({ ...prev, [field]: formattedDate }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    const handleProposedDateChange = (date, field) => {
        const formattedDate = formatDateLocal(date);
        setFormData(prev => ({
            ...prev,
            proposedSchedule: {
                ...prev.proposedSchedule,
                [field]: formattedDate
            }
        }));
        if (field === 'startDate' && errors.proposedStartDate) {
            setErrors(prev => ({ ...prev, proposedStartDate: '' }));
        }
        if (field === 'endDate' && errors.proposedEndDate) {
            setErrors(prev => ({ ...prev, proposedEndDate: '' }));
        }
    };

    const handleVenueChange = (selectedOption) => {
        setFormData(prev => ({ ...prev, venue: selectedOption ? selectedOption.value : '' }));
        if (errors.venue) {
            setErrors(prev => ({ ...prev, venue: '' }));
        }
    };

    const handleOptionSelect = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        setDropdownOpen(prev => ({ ...prev, [field]: false }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    const handleProposedScheduleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            proposedSchedule: {
                ...prev.proposedSchedule,
                [name]: value
            }
        }));
        if (name === 'preferredMode' && errors.proposedMode) {
            setErrors(prev => ({ ...prev, proposedMode: '' }));
        }
    };

    const handleContactChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            contactPerson: {
                ...prev.contactPerson,
                [name]: value
            }
        }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleMultiToggle = (field, value) => {
        setFormData(prev => {
            const currentValues = prev[field] || [];
            const newValues = currentValues.includes(value)
                ? currentValues.filter(item => item !== value)
                : [...currentValues, value];
            return { ...prev, [field]: newValues };
        });
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    const handleRoundChange = (id, field, value) => {
        const updatedRounds = formData.rounds.map(round =>
            round.id === id ? { ...round, [field]: value } : round
        );
        setFormData(prev => ({ ...prev, rounds: updatedRounds }));
    };

    const handleCustomAdd = (field, item, setCustomInput) => {
        const trimmedItem = item.trim();
        if (trimmedItem) {
            setFormData(prev => {
                const currentValues = prev[field] || [];
                if (currentValues.map(v => v.toLowerCase()).includes(trimmedItem.toLowerCase())) {
                    toast.error("Item already in the list.");
                    return prev;
                }
                return { ...prev, [field]: [trimmedItem, ...currentValues] };
            });
            if (errors[field]) {
                setErrors(prev => ({ ...prev, [field]: '' }));
            }
        }
        setCustomInput('');
    };
    
    const handleCustomSingleAdd = (field, item, setCustomInput) => {
        const trimmedItem = item.trim();
        if (trimmedItem) {
            setFormData(prev => ({ ...prev, [field]: trimmedItem }));
            setDropdownOpen(prev => ({ ...prev, [field]: false }));
            if (errors[field]) {
                setErrors(prev => ({ ...prev, [field]: '' }));
            }
        }
        setCustomInput('');
    };

    const removeItem = (field, valueToRemove) => {
        setFormData(prev => ({
            ...prev,
            [field]: prev[field].filter(item => item !== valueToRemove)
        }));
    };

    const showAlert = (message, type) => {
        setAlert({ show: true, message, type });
        setTimeout(() => setAlert({ show: false, message: '', type: '' }), 5000);
    };

    const resetForm = () => {
        setFormData(initialFormState);
        setErrors({});
        setDescriptionError("");
    };

    const validateForm = () => {
        const newErrors = {};
        let isValid = true;

        if (!formData.venue.trim()) {
            newErrors.venue = 'Please select a venue';
            isValid = false;
        }

        if (formData.degree.length === 0) {
            newErrors.degree = 'Please select at least one degree';
            isValid = false;
        }

        if (formData.workMode.length === 0) {
            newErrors.workMode = 'Please select at least one work mode';
            isValid = false;
        }

        if (formData.employmentType.length === 0) {
            newErrors.employmentType = 'Please select at least one employment type';
            isValid = false;
        }

        if (!formData.contactPerson.name.trim()) {
            newErrors.contactPersonName = 'Please enter contact person name';
            isValid = false;
        }

        if (!formData.contactPerson.designation.trim()) {
            newErrors.contactPersonDesignation = 'Please select designation';
            isValid = false;
        }

        if (!formData.contactPerson.email.trim()) {
            newErrors.contactPersonEmail = 'Please enter email address';
            isValid = false;
        } else if (!/\S+@\S+\.\S+/.test(formData.contactPerson.email)) {
            newErrors.contactPersonEmail = 'Please enter a valid email address';
            isValid = false;
        }

        if (!formData.contactPerson.mobile.trim()) {
            newErrors.contactPersonMobile = 'Please enter mobile number';
            isValid = false;
        } else if (!/^\d{10}$/.test(formData.contactPerson.mobile)) {
            newErrors.contactPersonMobile = 'Please enter a valid 10-digit mobile number';
            isValid = false;
        }

        if (!formData.minStudentsToBePlaced.trim()) {
            newErrors.minStudentsToBePlaced = 'Please select minimum students to be placed';
            isValid = false;
        }

        if (!formData.proposedSchedule.startDate.trim()) {
            newErrors.proposedStartDate = 'Please select proposed start date';
            isValid = false;
        }

        if (!formData.proposedSchedule.endDate.trim()) {
            newErrors.proposedEndDate = 'Please select proposed end date';
            isValid = false;
        }

        if (!formData.proposedSchedule.preferredMode.trim()) {
            newErrors.proposedMode = 'Please select preferred mode';
            isValid = false;
        }

        if (formData.description.length > 500) {
            setDescriptionError("Description cannot exceed 500 characters.");
            isValid = false;
        }

        if (formData.proposedSchedule.startDate && formData.proposedSchedule.endDate) {
            const start = new Date(formData.proposedSchedule.startDate);
            const end = new Date(formData.proposedSchedule.endDate);
            if (end <= start) {
                newErrors.proposedEndDate = 'End date must be after start date';
                isValid = false;
            }
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            showAlert('Please fill all required fields correctly', 'error');
            return;
        }

        setIsSubmitting(true);

        let aggregatedSkills = [];
        let studentStreams = [];
        let roundNames = [];
        let studentCounts = [];
        let roundSkills = [];

        const nonEmptyRounds = formData.rounds.filter(round => round.students || round.branch || round.skills);
        nonEmptyRounds.forEach(round => {
            if (round.skills) {
                roundSkills.push(round.skills);
                aggregatedSkills.push(...round.skills.split(',').map(s => s.trim()).filter(Boolean));
            }
            if (round.branch) studentStreams.push(round.branch);
            if (round.students) studentCounts.push(round.students);
            roundNames.push(`Round ${round.id}`);
        });

        const payload = {
            jobType: "Pool-campus",
            venue: formData.venue,
            degree: formData.degree,
            collegeTypes: formData.collegeTypes ? [formData.collegeTypes] : [],
            workMode: formData.workMode,
            employmentType: formData.employmentType,
            packageDetails: {
                currency: formData.salaryRange,
                totalCTC: parseFloat(formData.salaryValue) || 0,
            },
            startDate: formData.tentativeStartDate,
            endDate: formData.tentativeEndDate,
            rounds: roundNames,
            studentStreams: [...new Set(studentStreams)],
            skills: aggregatedSkills,
            numberOfStudent: studentCounts,
            contactPerson: formData.contactPerson,
            noOfplacedStudents: formData.minStudentsToBePlaced,
            amenitiesRequired: formData.amenities,
            description: formData.description,
            companyType: formData.companyType,
            proposedSchedule: formData.proposedSchedule,
            roundDetails: nonEmptyRounds,
            roundSkills: roundSkills,
        };

        try {
            const token = localStorage.getItem('token') || document.cookie.split('; ').find(row => row.startsWith('jwt='))?.split('=')[1];
            
            const response = await axios.post(`${import.meta.env.VITE_Backend_URL}/api/hiring-channels/pool-campus/college-request`, payload, {
                withCredentials: true,
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
            });

            toast.success(response.data.message);
            resetForm();
        } catch (error) {
            console.error('Submission error:', error);
            toast.error('Something went wrong!');
        } finally {
            setIsSubmitting(false);
        }
    };

    const toggleDropdown = (dropdown) => {
        setDropdownOpen(prev => ({
            ...Object.keys(prev).reduce((acc, key) => ({ ...acc, [key]: false }), {}),
            [dropdown]: !prev[dropdown]
        }));
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#f0e6f7]/60 via-[#d4e8f9]/55 to-[#cff7ea]/60">
            {/* Pastel blur background elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#fbcfe8]/20 rounded-full blur-3xl"></div>
                <div className="absolute top-1/3 -left-20 w-60 h-60 bg-[#93c5fd]/20 rounded-full blur-3xl"></div>
                <div className="absolute bottom-20 right-1/3 w-40 h-40 bg-[#a7f3d0]/20 rounded-full blur-3xl"></div>
            </div>

            <div className="relative z-10 container mx-auto px-4 py-6 max-w-5xl">
                {/* Header Section */}
                <div className="bg-white/90 backdrop-blur-sm border border-white/50 rounded-xl shadow-lg shadow-blue-50/50 p-4 mb-6">
                    <div className="text-center">
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-[#3b82f6] to-[#8b5cf6] bg-clip-text text-transparent mb-1">
                            Pool Campus Connect: Hire Bigger
                        </h1>
                        <p className="text-gray-600 text-sm max-w-2xl mx-auto">
                            Tap into diverse talent from multiple institutions through one powerful drive.
                        </p>
                    </div>
                </div>

                {/* Alert Message */}
                {alert.show && (
                    <div className={`mb-4 p-3 rounded-lg border ${alert.type === 'error' ? 'bg-red-50 border-red-200 text-red-800' : 'bg-green-50 border-green-200 text-green-800'}`}>
                        {alert.message}
                    </div>
                )}

                {/* Form Section */}
                <div className="bg-white/90 backdrop-blur-sm border border-white/50 rounded-2xl shadow-lg shadow-blue-50/50 p-6">
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-[#3b82f6] to-[#8b5cf6] bg-clip-text text-transparent mb-2 text-center">
                        Register for Pool Campus Hiring
                    </h2>
                    <p className="text-gray-600 mb-6 text-center text-sm">
                        Fill in the details below to register for the hiring drive
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Row 1: Venue and Degree */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            {/* Pool Campus Hiring Venue */}
                            <div>
                                <label className="block text-gray-700 font-medium mb-2 text-sm flex items-center gap-1.5">
                                    <MapPin className="w-4 h-4 text-[#3b82f6]" />
                                    Hiring Venue <span className="text-red-500">*</span>
                                </label>
                                <CreatableSelect
                                    isClearable
                                    options={cityOptions}
                                    value={formData.venue ? { value: formData.venue, label: formData.venue } : null}
                                    onChange={handleVenueChange}
                                    placeholder="Select or type location..."
                                    className="text-sm"
                                    styles={{
                                        control: (base, state) => ({
                                            ...base,
                                            backgroundColor: 'rgba(255, 255, 255, 0.5)',
                                            backdropFilter: 'blur(8px)',
                                            borderColor: errors.venue ? '#fca5a5' : state.isFocused ? '#93c5fd' : 'rgba(255, 255, 255, 0.5)',
                                            minHeight: '42px',
                                            borderRadius: '8px',
                                            fontSize: '14px',
                                            '&:hover': {
                                                borderColor: errors.venue ? '#fca5a5' : '#93c5fd',
                                            },
                                        }),
                                        menu: (base) => ({
                                            ...base,
                                            fontSize: '14px',
                                        }),
                                    }}
                                />
                                {errors.venue && (
                                    <p className="mt-1 text-xs text-red-600">{errors.venue}</p>
                                )}
                            </div>

                            {/* Degree */}
                            <div ref={degreeRef} className="relative">
                                <label className="block text-gray-700 font-medium mb-2 text-sm flex items-center gap-1.5">
                                    <GraduationCap className="w-4 h-4 text-[#3b82f6]" />
                                    Degree(s) <span className="text-red-500">*</span>
                                </label>
                                <div className="flex flex-wrap gap-1 mb-1 max-h-16 overflow-y-auto">
                                    {formData.degree.map(deg => (
                                        <div key={deg} className="flex items-center bg-gradient-to-r from-[#93c5fd]/20 to-[#3b82f6]/20 text-[#3b82f6] text-xs font-semibold px-2 py-0.5 rounded-full">
                                            <span>{deg}</span>
                                            <button type="button" onClick={() => removeItem('degree', deg)} className="ml-1 hover:bg-[#3b82f6]/20 rounded-full p-0.5">
                                                <X size={10} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                                <div
                                    className="flex items-center justify-between p-2.5 w-full bg-white/50 backdrop-blur-sm border border-white/50 rounded-lg cursor-pointer hover:border-[#93c5fd] transition-all duration-200 min-h-[42px]"
                                    onClick={() => toggleDropdown('degree')}
                                >
                                    <span className="text-sm text-gray-500">Select degrees</span>
                                    <ChevronDown className={`w-4 h-4 text-[#3b82f6] transition-transform ${dropdownOpen.degree ? "rotate-180" : ""}`} />
                                </div>
                                {errors.degree && (
                                    <p className="mt-1 text-xs text-red-600">{errors.degree}</p>
                                )}
                                {dropdownOpen.degree && (
                                    <div className="absolute z-20 mt-1 w-full bg-white/90 backdrop-blur-sm border border-white/50 rounded-lg shadow-lg shadow-blue-50/50 overflow-hidden">
                                        <div className="p-2 border-b border-white/50 flex">
                                            <input
                                                type="text"
                                                placeholder="Add custom degree..."
                                                className="w-full bg-white/50 backdrop-blur-sm border border-white/50 rounded px-2 py-1.5 text-sm"
                                                value={customDegree}
                                                onChange={(e) => setCustomDegree(e.target.value)}
                                                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleCustomAdd('degree', customDegree, setCustomDegree); } }}
                                            />
                                            <button
                                                type="button"
                                                className="ml-2 px-3 py-1.5 bg-gradient-to-r from-[#93c5fd] to-[#3b82f6] text-white rounded text-xs font-medium"
                                                onClick={() => handleCustomAdd('degree', customDegree, setCustomDegree)}
                                            >
                                                Add
                                            </button>
                                        </div>
                                        <div className="max-h-40 overflow-auto">
                                            {degreeOptions.map(opt => (
                                                <div key={opt} className={`px-3 py-2 hover:bg-[#93c5fd]/10 cursor-pointer border-b border-white/50 last:border-b-0 transition-colors duration-200 flex justify-between items-center ${formData.degree.includes(opt) ? "bg-[#93c5fd]/10" : ""}`} onClick={() => handleMultiToggle('degree', opt)}>
                                                    <div className="flex items-center">
                                                        <div className={`w-4 h-4 border-2 rounded mr-2 flex items-center justify-center ${formData.degree.includes(opt) ? 'bg-[#3b82f6] border-[#3b82f6]' : 'border-gray-300'}`}>
                                                            {formData.degree.includes(opt) && <CheckSquare size={10} className="text-white" />}
                                                        </div>
                                                        <span className="text-sm">{opt}</span>
                                                    </div>
                                                    {formData.degree.includes(opt) && <span className="text-[#3b82f6] text-xs">✓</span>}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Row 2: College Type and Work Mode */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            {/* College Type */}
                            <div ref={collegeTypesRef} className="relative">
                                <label className="block text-gray-700 font-medium mb-2 text-sm flex items-center gap-1.5">
                                    <School className="w-4 h-4 text-[#3b82f6]" />
                                    Type of College
                                </label>
                                <div
                                    onClick={() => toggleDropdown('collegeTypes')}
                                    className="w-full bg-white/50 backdrop-blur-sm border border-white/50 rounded-lg p-2.5 min-h-[42px] cursor-pointer hover:border-[#93c5fd] transition-all duration-200 flex items-center justify-between text-sm"
                                >
                                    <span className={formData.collegeTypes ? "text-gray-900" : "text-gray-500"}>
                                        {formData.collegeTypes || 'Select college type'}
                                    </span>
                                    <ChevronDown className={`w-4 h-4 text-[#3b82f6] transition-transform ${dropdownOpen.collegeTypes ? "rotate-180" : ""}`} />
                                </div>
                                {dropdownOpen.collegeTypes && (
                                    <div className="absolute z-20 w-full bg-white/90 backdrop-blur-sm border border-white/50 rounded-lg mt-1 shadow-lg shadow-blue-50/50 overflow-hidden">
                                        <div className="p-2 border-b border-white/50 flex">
                                            <input
                                                type="text"
                                                placeholder="Add custom type..."
                                                className="w-full bg-white/50 backdrop-blur-sm border border-white/50 rounded px-2 py-1.5 text-sm"
                                                value={customCollegeType}
                                                onChange={(e) => setCustomCollegeType(e.target.value)}
                                                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleCustomSingleAdd('collegeTypes', customCollegeType, setCustomCollegeType); } }}
                                            />
                                            <button
                                                type="button"
                                                className="ml-2 px-3 py-1.5 bg-gradient-to-r from-[#93c5fd] to-[#3b82f6] text-white rounded text-xs font-medium"
                                                onClick={() => handleCustomSingleAdd('collegeTypes', customCollegeType, setCustomCollegeType)}
                                            >
                                                Add
                                            </button>
                                        </div>
                                        <div className="max-h-40 overflow-auto">
                                            {collegeTypeOptions.map(option => (
                                                <div
                                                    key={option}
                                                    onClick={() => handleOptionSelect('collegeTypes', option)}
                                                    className={`px-3 py-2 hover:bg-[#93c5fd]/10 cursor-pointer border-b border-white/50 last:border-b-0 transition-colors duration-200 text-sm ${formData.collegeTypes === option ? 'bg-[#93c5fd]/10' : ''}`}
                                                >
                                                    {option}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Work Mode */}
                            <div>
                                <label className="block text-gray-700 font-medium mb-2 text-sm flex items-center gap-1.5">
                                    <Monitor className="w-4 h-4 text-[#3b82f6]" />
                                    Work Mode <span className="text-red-500">*</span>
                                </label>
                                <div className="flex gap-2">
                                    {workModeOptions.map((type) => (
                                        <button key={type} type="button" className={`px-3 py-2 rounded-lg border text-sm transition-all duration-200 font-medium flex-1 ${
                                            formData.workMode.includes(type) 
                                                ? 'bg-gradient-to-r from-[#93c5fd] to-[#3b82f6] text-white border-transparent' 
                                                : 'bg-white/50 backdrop-blur-sm border-white/50 text-gray-700 hover:bg-white/70'
                                        }`} onClick={() => handleMultiToggle('workMode', type)}>
                                            {type}
                                        </button>
                                    ))}
                                </div>
                                {errors.workMode && (
                                    <p className="mt-1 text-xs text-red-600">{errors.workMode}</p>
                                )}
                            </div>
                        </div>

                        {/* Row 3: Proposed Schedule - Full Width */}
                        <div>
                            <label className="block text-gray-700 font-medium mb-2 text-sm flex items-center gap-1.5">
                                <Clock className="w-4 h-4 text-[#3b82f6]" />
                                Proposed Schedule <span className="text-red-500">*</span>
                            </label>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                <div className="relative">
                                    <DatePicker
                                        selected={formData.proposedSchedule.startDate ? new Date(formData.proposedSchedule.startDate) : null}
                                        onChange={(date) => handleProposedDateChange(date, 'startDate')}
                                        dateFormat="dd-MM-yyyy"
                                        placeholderText="Start Date"
                                        className={`w-full bg-white/50 backdrop-blur-sm border ${errors.proposedStartDate ? 'border-red-300' : 'border-white/50'} rounded-lg p-2.5 pl-9 text-sm focus:outline-none focus:ring-1 focus:ring-[#93c5fd] focus:border-transparent`}
                                    />
                                    <Calendar className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400" size={14} />
                                    {errors.proposedStartDate && (
                                        <p className="mt-1 text-xs text-red-600">{errors.proposedStartDate}</p>
                                    )}
                                </div>
                                <div className="relative">
                                    <DatePicker
                                        selected={formData.proposedSchedule.endDate ? new Date(formData.proposedSchedule.endDate) : null}
                                        onChange={(date) => handleProposedDateChange(date, 'endDate')}
                                        dateFormat="dd-MM-yyyy"
                                        placeholderText="End Date"
                                        className={`w-full bg-white/50 backdrop-blur-sm border ${errors.proposedEndDate ? 'border-red-300' : 'border-white/50'} rounded-lg p-2.5 pl-9 text-sm focus:outline-none focus:ring-1 focus:ring-[#93c5fd] focus:border-transparent`}
                                    />
                                    <Calendar className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400" size={14} />
                                    {errors.proposedEndDate && (
                                        <p className="mt-1 text-xs text-red-600">{errors.proposedEndDate}</p>
                                    )}
                                </div>
                                <div className="relative">
                                    <select 
                                        name="preferredMode" 
                                        className={`w-full bg-white/50 backdrop-blur-sm border ${errors.proposedMode ? 'border-red-300' : 'border-white/50'} rounded-lg p-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#93c5fd] focus:border-transparent`} 
                                        value={formData.proposedSchedule.preferredMode} 
                                        onChange={handleProposedScheduleChange}
                                    >
                                        <option value="">Preferred Mode</option>
                                        {proposedModeOptions.map(option => (
                                            <option key={option} value={option}>{option}</option>
                                        ))}
                                    </select>
                                    {errors.proposedMode && (
                                        <p className="mt-1 text-xs text-red-600">{errors.proposedMode}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Row 4: Employment Type and Salary */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            {/* Employment Type */}
                            <div>
                                <label className="block text-gray-700 font-medium mb-2 text-sm flex items-center gap-1.5">
                                    <Briefcase className="w-4 h-4 text-[#3b82f6]" />
                                    Employment type <span className="text-red-500">*</span>
                                </label>
                                <div className="flex gap-2">
                                    {['Part-time', 'Full-time', 'Contract'].map((type) => (
                                        <button key={type} type="button" className={`px-3 py-2 rounded-lg border text-sm transition-all duration-200 font-medium flex-1 ${
                                            formData.employmentType.includes(type) 
                                                ? 'bg-gradient-to-r from-[#93c5fd] to-[#3b82f6] text-white border-transparent' 
                                                : 'bg-white/50 backdrop-blur-sm border-white/50 text-gray-700 hover:bg-white/70'
                                        }`} onClick={() => handleMultiToggle('employmentType', type)}>
                                            {type}
                                        </button>
                                    ))}
                                </div>
                                {errors.employmentType && (
                                    <p className="mt-1 text-xs text-red-600">{errors.employmentType}</p>
                                )}
                            </div>

                            {/* Salary */}
<div>
  <label className="block text-gray-700 font-medium mb-2 text-sm flex items-center gap-1.5">
    <DollarSign className="w-4 h-4 text-[#3b82f6]" />
    Minimum Cut-off Salary
  </label>
  <div className="flex rounded-lg overflow-hidden border border-gray-200/80 focus-within:ring-1 focus-within:ring-[#93c5fd] focus-within:border-transparent transition-all duration-200">
    <div className="relative bg-white/50 backdrop-blur-sm flex items-center">
      <div className="px-3 py-2 w-24 text-sm flex items-center gap-2">
        {formData.salaryRange === 'INR' ? (
          <>
            <IndianRupee className="w-3.5 h-3.5 text-gray-600" />
            <span>INR</span>
          </>
        ) : formData.salaryRange === 'USD' ? (
          <>
            <DollarSign className="w-3.5 h-3.5 text-gray-600" />
            <span>USD</span>
          </>
        ) : formData.salaryRange === 'EUR' ? (
          <>
            <Euro className="w-3.5 h-3.5 text-gray-600" />
            <span>EUR</span>
          </>
        ) : (
          <>
            <IndianRupee className="w-3.5 h-3.5 text-gray-600" />
            <span>INR</span>
          </>
        )}
      </div>
      <select 
        name="salaryRange" 
        className="absolute inset-0 opacity-0 cursor-pointer"
        value={formData.salaryRange || 'INR'} 
        onChange={handleChange}
      >
        <option value="INR">INR</option>
        <option value="USD">USD</option>
        <option value="EUR">EUR</option>
      </select>
      <ChevronDown className="absolute right-2 w-3 h-3 text-gray-400 pointer-events-none" />
    </div>
    <div className="relative flex-1">
      <input 
        name="salaryValue" 
        type="number" 
        className="bg-white/50 backdrop-blur-sm w-full px-3 py-2 text-sm focus:outline-none" 
        placeholder="Amount" 
        value={formData.salaryValue || ''} 
        onChange={handleChange}
        min="0"
        step="1000"
      />
      {/* Currency icon in input field */}
      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
        {formData.salaryRange === 'INR' ? (
          <IndianRupee className="w-3.5 h-3.5 text-gray-500" />
        ) : formData.salaryRange === 'USD' ? (
          <DollarSign className="w-3.5 h-3.5 text-gray-500" />
        ) : formData.salaryRange === 'EUR' ? (
          <Euro className="w-3.5 h-3.5 text-gray-500" />
        ) : (
          <IndianRupee className="w-3.5 h-3.5 text-gray-500" />
        )}
      </div>
    </div>
  </div>
</div>
                        </div>

                        {/* Row 5: Application Dates and Contact Person Name */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            {/* Application Dates */}
<div>
  <label className="block text-gray-700 font-medium mb-2 text-sm flex items-center gap-1.5">
    <Calendar className="w-4 h-4 text-[#3b82f6]" />
    Application Dates
  </label>
  <div className="grid grid-cols-2 gap-2">
    <div className="relative">
      <DatePicker
        selected={formData.tentativeStartDate ? new Date(formData.tentativeStartDate) : null}
        onChange={(date) => handleDateChange(date, 'tentativeStartDate')}
        dateFormat="dd-MM-yyyy"
        placeholderText="Start"
        className="w-full bg-white/50 backdrop-blur-sm border border-white/50 rounded px-2 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#93c5fd] focus:border-transparent pl-8"
      />
      <Calendar className="absolute left-2 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
    </div>
    <div className="relative">
      <DatePicker
        selected={formData.tentativeEndDate ? new Date(formData.tentativeEndDate) : null}
        onChange={(date) => handleDateChange(date, 'tentativeEndDate')}
        dateFormat="dd-MM-yyyy"
        placeholderText="End"
        className="w-full bg-white/50 backdrop-blur-sm border border-white/50 rounded px-2 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#93c5fd] focus:border-transparent pl-8"
      />
      <Calendar className="absolute left-2 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
    </div>
  </div>
</div>

                            {/* Contact Person Name */}
                            <div>
                                <label className="block text-gray-700 font-medium mb-2 text-sm flex items-center gap-1.5">
                                    <User className="w-4 h-4 text-[#3b82f6]" />
                                    Contact Person Name <span className="text-red-500">*</span>
                                </label>
                                <input 
                                    type="text" 
                                    name="name" 
                                    value={formData.contactPerson.name} 
                                    onChange={handleContactChange} 
                                    placeholder="Enter full name" 
                                    className={`w-full bg-white/50 backdrop-blur-sm border ${errors.contactPersonName ? 'border-red-300' : 'border-white/50'} rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#93c5fd] focus:border-transparent`}
                                />
                                {errors.contactPersonName && (
                                    <p className="mt-1 text-xs text-red-600">{errors.contactPersonName}</p>
                                )}
                            </div>
                        </div>

                        {/* Row 6: Contact Designation and Email */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            {/* Designation */}
                            <div>
                                <label className="block text-gray-700 font-medium mb-2 text-sm flex items-center gap-1.5">
                                    <User className="w-4 h-4 text-[#3b82f6]" />
                                    Designation <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <select 
                                        name="designation" 
                                        value={formData.contactPerson.designation} 
                                        onChange={handleContactChange} 
                                        className={`w-full bg-white/50 backdrop-blur-sm border ${errors.contactPersonDesignation ? 'border-red-300' : 'border-white/50'} rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#93c5fd] focus:border-transparent`}
                                    >
                                        <option value="" disabled>Select designation</option>
                                        {designationOptions.map((designation) => (
                                            <option key={designation} value={designation}>{designation}</option>
                                        ))}
                                    </select>
                                    {errors.contactPersonDesignation && (
                                        <p className="mt-1 text-xs text-red-600">{errors.contactPersonDesignation}</p>
                                    )}
                                </div>
                            </div>

                            {/* Contact Email */}
                            <div>
                                <label className="block text-gray-700 font-medium mb-2 text-sm flex items-center gap-1.5">
                                    <Mail className="w-4 h-4 text-[#3b82f6]" />
                                    Email <span className="text-red-500">*</span>
                                </label>
                                <input 
                                    type="email" 
                                    name="email" 
                                    value={formData.contactPerson.email} 
                                    onChange={handleContactChange} 
                                    placeholder="example@company.com" 
                                    className={`w-full bg-white/50 backdrop-blur-sm border ${errors.contactPersonEmail ? 'border-red-300' : 'border-white/50'} rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#93c5fd] focus:border-transparent`}
                                />
                                {errors.contactPersonEmail && (
                                    <p className="mt-1 text-xs text-red-600">{errors.contactPersonEmail}</p>
                                )}
                            </div>
                        </div>

                        {/* Row 7: Contact Mobile and LinkedIn */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            {/* Contact Mobile */}
                            <div>
                                <label className="block text-gray-700 font-medium mb-2 text-sm flex items-center gap-1.5">
                                    <Phone className="w-4 h-4 text-[#3b82f6]" />
                                    Mobile No <span className="text-red-500">*</span>
                                </label>
                                <input 
                                    type="tel" 
                                    name="mobile" 
                                    value={formData.contactPerson.mobile} 
                                    onChange={handleContactChange} 
                                    placeholder="10-digit mobile number" 
                                    className={`w-full bg-white/50 backdrop-blur-sm border ${errors.contactPersonMobile ? 'border-red-300' : 'border-white/50'} rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#93c5fd] focus:border-transparent`}
                                />
                                {errors.contactPersonMobile && (
                                    <p className="mt-1 text-xs text-red-600">{errors.contactPersonMobile}</p>
                                )}
                            </div>

                            {/* LinkedIn Profile */}
                            <div>
                                <label className="block text-gray-700 font-medium mb-2 text-sm flex items-center gap-1.5">
                                    <Linkedin className="w-4 h-4 text-[#3b82f6]" />
                                    LinkedIn Profile
                                </label>
                                <input 
                                    type="url" 
                                    name="linkedin" 
                                    value={formData.contactPerson.linkedin} 
                                    onChange={handleContactChange} 
                                    placeholder="linkedin.com/in/username" 
                                    className="w-full bg-white/50 backdrop-blur-sm border border-white/50 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#93c5fd] focus:border-transparent" 
                                />
                            </div>
                        </div>

                        {/* Row 8: Minimum Students and Company Type */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            {/* Minimum Students */}
                            <div>
                                <label className="block text-gray-700 font-medium mb-2 text-sm flex items-center gap-1.5">
                                    <Users className="w-4 h-4 text-[#3b82f6]" />
                                    Min Students to Place <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <select 
                                        name="minStudentsToBePlaced" 
                                        className={`w-full bg-white/50 backdrop-blur-sm border ${errors.minStudentsToBePlaced ? 'border-red-300' : 'border-white/50'} rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#93c5fd] focus:border-transparent`}
                                        value={formData.minStudentsToBePlaced} 
                                        onChange={handleChange}
                                    >
                                        <option value="">Select Range</option>
                                        {minStudentsOptions.map(option => (
                                            <option key={option} value={option}>{option}</option>
                                        ))}
                                    </select>
                                    {errors.minStudentsToBePlaced && (
                                        <p className="mt-1 text-xs text-red-600">{errors.minStudentsToBePlaced}</p>
                                    )}
                                </div>
                            </div>

                            {/* Company Type */}
                            <div ref={companyTypeRef} className="relative">
                                <label className="block text-gray-700 font-medium mb-2 text-sm flex items-center gap-1.5">
                                    <Building className="w-4 h-4 text-[#3b82f6]" />
                                    Company Type
                                </label>
                                <div className="relative">
                                    <div 
                                        className="w-full bg-white/50 backdrop-blur-sm border border-white/50 rounded-lg p-2.5 min-h-[42px] cursor-pointer hover:border-[#93c5fd] transition-all duration-200 text-sm" 
                                        onClick={() => toggleDropdown('companyType')}
                                    >
                                        {formData.companyType.length > 0 ? (
                                            <div className="flex flex-wrap gap-1">
                                                {formData.companyType.map(item => (
                                                    <span key={item} className="flex items-center bg-gradient-to-r from-[#93c5fd]/20 to-[#3b82f6]/20 text-[#3b82f6] text-xs font-semibold px-2 py-0.5 rounded-full">
                                                        {item}
                                                    </span>
                                                ))}
                                            </div>
                                        ) : <span className="text-gray-500">Select company types</span>}
                                    </div>
                                    {dropdownOpen.companyType && (
                                        <div className="absolute z-20 w-full bg-white/90 backdrop-blur-sm border border-white/50 rounded-lg mt-1 shadow-lg shadow-blue-50/50 overflow-hidden">
                                            <div className="p-2 border-b border-white/50 flex">
                                                <input
                                                    type="text"
                                                    placeholder="Add custom company type..."
                                                    className="w-full bg-white/50 backdrop-blur-sm border border-white/50 rounded px-2 py-1.5 text-sm"
                                                    value={customCompanyType}
                                                    onChange={(e) => setCustomCompanyType(e.target.value)}
                                                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleCustomAdd('companyType', customCompanyType, setCustomCompanyType); } }}
                                                />
                                                <button
                                                    type="button"
                                                    className="ml-2 px-3 py-1.5 bg-gradient-to-r from-[#93c5fd] to-[#3b82f6] text-white rounded text-xs font-medium"
                                                    onClick={() => handleCustomAdd('companyType', customCompanyType, setCustomCompanyType)}
                                                >
                                                    Add
                                                </button>
                                            </div>
                                            <div className="max-h-40 overflow-auto">
                                                {companyTypeOptions.map(opt => (
                                                    <div key={opt} className={`px-3 py-2 hover:bg-[#93c5fd]/10 cursor-pointer border-b border-white/50 last:border-b-0 transition-colors duration-200 flex justify-between items-center ${formData.companyType.includes(opt) ? "bg-[#93c5fd]/10" : ""}`} onClick={() => handleMultiToggle('companyType', opt)}>
                                                        <div className="flex items-center">
                                                            <div className={`w-4 h-4 border-2 rounded mr-2 flex items-center justify-center ${formData.companyType.includes(opt) ? 'bg-[#3b82f6] border-[#3b82f6]' : 'border-gray-300'}`}>
                                                                {formData.companyType.includes(opt) && <CheckSquare size={10} className="text-white" />}
                                                            </div>
                                                            <span className="text-sm">{opt}</span>
                                                        </div>
                                                        {formData.companyType.includes(opt) && <span className="text-[#3b82f6] text-xs">✓</span>}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Row 9: Rounds Table - Full Width */}
<div>
  <div className="flex justify-between items-center mb-2">
    <label className="block text-gray-700 font-medium text-sm flex items-center gap-1.5">
      <List className="w-4 h-4 text-[#3b82f6]" />
      Student Details
    </label>
    <button
      type="button"
      onClick={handleAddRound}
      className="flex items-center gap-1.5 px-3 py-1.5 bg-[#3b82f6] text-white text-xs rounded-lg hover:bg-[#2563eb] transition-colors duration-200"
    >
      <Plus className="w-3.5 h-3.5" />
      Add Student
    </button>
  </div>
  <div className="overflow-x-auto">
    <table className="min-w-full divide-y divide-white/50 text-xs">
      <thead className="bg-white/50">
        <tr>
          <th className="px-2 py-1.5 text-left font-medium text-gray-500">S.No</th>
          <th className="px-2 py-1.5 text-left font-medium text-gray-500">Branch</th>
          <th className="px-2 py-1.5 text-left font-medium text-gray-500">Count</th>
          <th className="px-2 py-1.5 text-left font-medium text-gray-500">Skills (comma separated)</th>
          <th className="px-2 py-1.5 text-left font-medium text-gray-500">Action </th>
        </tr>
      </thead>
      <tbody className="bg-white/30 divide-y divide-white/50">
        {formData.rounds.map((round, index) => (
          <tr key={round.id}>
            <td className="px-2 py-1.5 text-center">{index + 1}</td>
            <td className="px-2 py-1.5">
              <select 
                className="w-full bg-white/50 backdrop-blur-sm border border-white/50 rounded px-1.5 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-[#93c5fd] focus:border-transparent" 
                value={round.branch} 
                onChange={(e) => handleRoundChange(round.id, 'branch', e.target.value)}
              >
                <option value="">Select</option>
                {branchOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </td>
            <td className="px-2 py-1.5">
              <input 
                type="number" 
                className="w-full bg-white/50 backdrop-blur-sm border border-white/50 rounded px-1.5 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-[#93c5fd] focus:border-transparent" 
                value={round.students} 
                onChange={(e) => handleRoundChange(round.id, 'students', e.target.value)} 
                min="0" 
                placeholder="0"
              />
            </td>
            <td className="px-2 py-1.5">
              <input 
                type="text" 
                className="w-full bg-white/50 backdrop-blur-sm border border-white/50 rounded px-1.5 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-[#93c5fd] focus:border-transparent" 
                value={round.skills} 
                onChange={(e) => handleRoundChange(round.id, 'skills', e.target.value)} 
                placeholder="e.g., React, Node.js, MongoDB" 
              />
            </td>
            <td className="px-2 py-1.5 text-center">
              <button
                type="button"
                onClick={() => handleRemoveRound(round.id)}
                className="text-red-500 hover:text-red-700 transition-colors duration-200"
                title="Remove"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
  {formData.rounds.length === 0 && (
    <div className="text-center py-4 text-gray-500 text-sm">
      No student details added. Click "Add Student" to get started.
    </div>
  )}
</div>

                        {/* Row 10: Amenities and Description */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            {/* Amenities */}
                            <div ref={amenitiesRef} className="relative">
                                <label className="block text-gray-700 font-medium mb-2 text-sm flex items-center gap-1.5">
                                    <Building className="w-4 h-4 text-[#3b82f6]" />
                                    Campus Facilities
                                </label>
                                <div className="relative">
                                    <div 
                                        className="w-full bg-white/50 backdrop-blur-sm border border-white/50 rounded-lg p-2.5 min-h-[42px] cursor-pointer hover:border-[#93c5fd] transition-all duration-200 text-sm" 
                                        onClick={() => toggleDropdown('amenities')}
                                    >
                                        {formData.amenities.length > 0 ? (
                                            <div className="flex flex-wrap gap-1">
                                                {formData.amenities.slice(0, 3).map(item => (
                                                    <span key={item} className="flex items-center bg-gradient-to-r from-[#93c5fd]/20 to-[#3b82f6]/20 text-[#3b82f6] text-xs font-semibold px-2 py-0.5 rounded-full">
                                                        {item}
                                                    </span>
                                                ))}
                                                {formData.amenities.length > 3 && (
                                                    <span className="text-xs text-gray-500">+{formData.amenities.length - 3} more</span>
                                                )}
                                            </div>
                                        ) : <span className="text-gray-500">Select facilities</span>}
                                    </div>
                                    {dropdownOpen.amenities && (
                                        <div className="absolute z-20 w-full bg-white/90 backdrop-blur-sm border border-white/50 rounded-lg mt-1 shadow-lg shadow-blue-50/50 overflow-hidden">
                                            <div className="max-h-40 overflow-auto">
                                                {amenitiesOptions.map(opt => (
                                                    <div key={opt} className={`px-3 py-2 hover:bg-[#93c5fd]/10 cursor-pointer border-b border-white/50 last:border-b-0 transition-colors duration-200 flex justify-between items-center ${formData.amenities.includes(opt) ? "bg-[#93c5fd]/10" : ""}`} onClick={() => handleMultiToggle('amenities', opt)}>
                                                        <div className="flex items-center">
                                                            <div className={`w-4 h-4 border-2 rounded mr-2 flex items-center justify-center ${formData.amenities.includes(opt) ? 'bg-[#3b82f6] border-[#3b82f6]' : 'border-gray-300'}`}>
                                                                {formData.amenities.includes(opt) && <CheckSquare size={10} className="text-white" />}
                                                            </div>
                                                            <span className="text-sm">{opt}</span>
                                                        </div>
                                                        {formData.amenities.includes(opt) && <span className="text-[#3b82f6] text-xs">✓</span>}
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="p-2 border-t border-white/50">
                                                <input 
                                                    type="text" 
                                                    placeholder="Add custom facility..." 
                                                    className="w-full bg-white/50 backdrop-blur-sm border border-white/50 rounded px-2 py-1.5 text-sm" 
                                                    value={customAmenity} 
                                                    onChange={(e) => setCustomAmenity(e.target.value)} 
                                                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleCustomAdd('amenities', customAmenity, setCustomAmenity); } }} 
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-gray-700 font-medium mb-2 text-sm flex items-center gap-1.5">
                                    <MessageSquare className="w-4 h-4 text-[#3b82f6]" />
                                    Description
                                </label>
                                <textarea 
                                    name="description" 
                                    className="w-full bg-white/50 backdrop-blur-sm border border-white/50 rounded-lg px-2.5 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#93c5fd] focus:border-transparent resize-none" 
                                    placeholder="Additional information..." 
                                    value={formData.description} 
                                    onChange={(e) => {
                                        handleChange(e);
                                        if (e.target.value.length > 500) {
                                            setDescriptionError("Description cannot exceed 500 characters.");
                                        } else {
                                            setDescriptionError("");
                                        }
                                    }} 
                                    rows="3"
                                    maxLength={500}
                                ></textarea>
                                <div className="flex justify-between text-xs mt-1">
                                    <span className={descriptionError ? 'text-red-500' : 'text-gray-500'}>
                                        {descriptionError ? descriptionError : `${formData.description.length}/500`}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Form Actions */}
                        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 pt-6 border-t border-gray-200/50">
                            {onBackClick && (
                                <button 
                                    type="button"
                                    onClick={onBackClick}
                                    className="flex items-center gap-1.5 text-gray-600 hover:text-gray-800 font-medium transition-colors duration-200 text-sm"
                                >
                                    <ArrowLeft className="w-3.5 h-3.5" />
                                    Back to Home
                                </button>
                            )}
                            <button 
                                type="submit"
                                disabled={isSubmitting}
                                className="group flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#93c5fd] to-[#3b82f6] text-white rounded-lg hover:shadow-lg hover:shadow-[#93c5fd]/40 transition-all duration-200 text-sm font-medium disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                <Send className="w-4 h-4" />
                                {isSubmitting ? 'Submitting...' : 'Register PoolCampus'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}