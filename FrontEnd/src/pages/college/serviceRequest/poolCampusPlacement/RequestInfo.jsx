import { useState, useRef, useEffect, useMemo } from 'react';
import axios from 'axios';
import { ChevronDown, X, Calendar, Clock, Users, Target, GraduationCap, Building, DollarSign, List, MapPin, User, Mail, Phone, Linkedin, ArrowLeft, Send, CheckSquare, Briefcase, School, Monitor, MessageSquare } from 'lucide-react';
import toast from 'react-hot-toast';
import CreatableSelect from 'react-select/creatable';
import { City } from 'country-state-city';

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
        rounds: Array.from({ length: 6 }, (_, i) => ({ id: i + 1, students: '', branch: '', skills: '' })),
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
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [alert, setAlert] = useState({ show: false, message: '', type: '' });

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

    const degreeOptions = ['B.Tech', 'M.Tech', 'MBA', 'B.Sc', 'M.Sc', 'PhD'];
    const collegeTypeOptions = ['Engineering', 'Medical', 'Management', 'Arts & Science', 'Law', 'Pharmacy', 'Architecture'];
    const workModeOptions = ['On-site', 'Remote', 'Hybrid'];
    const branchOptions = ['Computer Science', 'Mechanical', 'Civil', 'Electrical', 'Electronics', 'Bio-medical'];
    const designationOptions = ['HR Manager', 'Technical Recruiter', 'Talent Acquisition', 'Hiring Manager', 'Team Lead', 'Department Head', 'CEO', 'CTO', 'Founder', 'Other'];
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
    };

    const handleVenueChange = (selectedOption) => {
        setFormData(prev => ({ ...prev, venue: selectedOption ? selectedOption.value : '' }));
    };

    const handleOptionSelect = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        setDropdownOpen(prev => ({ ...prev, [field]: false }));
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
    };

    const handleMultiToggle = (field, value) => {
        setFormData(prev => {
            const currentValues = prev[field] || [];
            const newValues = currentValues.includes(value)
                ? currentValues.filter(item => item !== value)
                : [...currentValues, value];
            return { ...prev, [field]: newValues };
        });
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
        }
        setCustomInput('');
    };
    
    const handleCustomSingleAdd = (field, item, setCustomInput) => {
        const trimmedItem = item.trim();
        if (trimmedItem) {
            setFormData(prev => ({ ...prev, [field]: trimmedItem }));
            setDropdownOpen(prev => ({ ...prev, [field]: false }));
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
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        if (formData.degree.length === 0 || !formData.venue || !formData.contactPerson.email || !formData.contactPerson.mobile) {
            showAlert('Please fill all required fields marked with *', 'error');
            setIsSubmitting(false);
            return;
        }

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

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#f0e6f7]/60 via-[#d4e8f9]/55 to-[#cff7ea]/60">
            {/* Pastel blur background elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#fbcfe8]/20 rounded-full blur-3xl"></div>
                <div className="absolute top-1/3 -left-20 w-60 h-60 bg-[#93c5fd]/20 rounded-full blur-3xl"></div>
                <div className="absolute bottom-20 right-1/3 w-40 h-40 bg-[#a7f3d0]/20 rounded-full blur-3xl"></div>
                <div className="absolute top-1/4 right-1/4 w-48 h-48 bg-[#c7d2fe]/20 rounded-full blur-3xl"></div>
                <div className="absolute bottom-1/3 left-1/4 w-56 h-56 bg-[#fde68a]/10 rounded-full blur-3xl"></div>
            </div>

            <div className="relative z-10 container mx-auto px-4 py-8 max-w-4xl">
                {/* Header Section */}
                <div className="mb-12 text-center">
                    <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#3b82f6] to-[#8b5cf6] bg-clip-text text-transparent mb-2">
                        Pool Campus Connect: Hire Bigger
                    </h1>
                    <p className="text-gray-600 text-lg md:text-xl max-w-3xl mx-auto">
                        Tap into diverse talent from multiple institutions through one powerful drive.
                    </p>
                </div>

                {/* Form Section */}
                <div className="bg-white/90 backdrop-blur-sm border border-white/50 rounded-2xl shadow-lg shadow-blue-50/50 p-8">
                    <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-[#3b82f6] to-[#8b5cf6] bg-clip-text text-transparent mb-2 text-center">
                        Register for Pool Campus Hiring
                    </h2>
                    <p className="text-gray-600 mb-8 text-center">
                        Fill in the details below to register for the hiring drive
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Pool Campus Hiring Venue */}
                        <div>
                            <label className="block text-gray-700 font-medium mb-2 flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-[#3b82f6]" />
                                Pool Campus Hiring Venue <span className="text-red-500">*</span>
                            </label>
                            <CreatableSelect
                                isClearable
                                options={cityOptions}
                                value={formData.venue ? { value: formData.venue, label: formData.venue } : null}
                                onChange={handleVenueChange}
                                placeholder="Select or type to add a location..."
                                styles={{
                                    control: (base) => ({
                                        ...base,
                                        backgroundColor: 'rgba(255, 255, 255, 0.5)',
                                        backdropFilter: 'blur(8px)',
                                        borderColor: 'rgba(255, 255, 255, 0.5)',
                                        minHeight: '48px',
                                        borderRadius: '12px',
                                        boxShadow: 'none',
                                        '&:hover': {
                                            borderColor: '#93c5fd',
                                        },
                                    }),
                                    menu: (base) => ({
                                        ...base,
                                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                        backdropFilter: 'blur(8px)',
                                        borderRadius: '12px',
                                        border: '1px solid rgba(255, 255, 255, 0.5)',
                                    }),
                                    option: (base, state) => ({
                                        ...base,
                                        backgroundColor: state.isSelected ? '#93c5fd' : state.isFocused ? 'rgba(147, 197, 253, 0.1)' : 'transparent',
                                        color: state.isSelected ? 'white' : '#374151',
                                    }),
                                    placeholder: (base) => ({
                                        ...base,
                                        color: '#9ca3af',
                                    }),
                                }}
                            />
                        </div>

                        {/* Degree */}
                        <div ref={degreeRef}>
                            <label className="block text-gray-700 font-medium mb-2 flex items-center gap-2">
                                <GraduationCap className="w-4 h-4 text-[#3b82f6]" />
                                Degree(s) <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <div
                                    className="w-full bg-white/50 backdrop-blur-sm border border-white/50 rounded-xl p-3 min-h-[48px] cursor-pointer hover:border-[#93c5fd] transition-all duration-200"
                                    onClick={() => setDropdownOpen(prev => ({ ...prev, degree: !prev.degree }))}
                                >
                                    {formData.degree.length > 0 ? (
                                        <div className="flex flex-wrap gap-2">
                                            {formData.degree.map(deg => (
                                                <span key={deg} className="flex items-center bg-gradient-to-r from-[#93c5fd]/20 to-[#3b82f6]/20 text-[#3b82f6] text-xs font-semibold px-3 py-1 rounded-full border border-[#93c5fd]/30">
                                                    {deg}
                                                    <button type="button" onClick={(e) => { e.stopPropagation(); removeItem('degree', deg); }} className="ml-1.5 hover:bg-[#3b82f6]/20 rounded-full p-0.5">
                                                        <X size={12} />
                                                    </button>
                                                </span>
                                            ))}
                                        </div>
                                    ) : <span className="text-gray-500">Select degrees</span>}
                                </div>
                                {dropdownOpen.degree && (
                                    <div className="absolute z-20 w-full bg-white/90 backdrop-blur-sm border border-white/50 rounded-xl mt-1 shadow-lg shadow-blue-50/50 overflow-hidden">
                                        <div className="p-3 border-b border-white/50">
                                            <div className="flex gap-2">
                                                <input
                                                    type="text"
                                                    placeholder="Add custom degree..."
                                                    className="w-full bg-white/50 backdrop-blur-sm border border-white/50 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#93c5fd] focus:border-transparent"
                                                    value={customDegree}
                                                    onChange={(e) => setCustomDegree(e.target.value)}
                                                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleCustomAdd('degree', customDegree, setCustomDegree); } }}
                                                />
                                                <button
                                                    type="button"
                                                    className="px-4 py-2 bg-gradient-to-r from-[#93c5fd] to-[#3b82f6] text-white rounded-lg text-sm font-medium"
                                                    onClick={() => handleCustomAdd('degree', customDegree, setCustomDegree)}
                                                >
                                                    Add
                                                </button>
                                            </div>
                                        </div>
                                        <div className="max-h-60 overflow-auto">
                                            {degreeOptions.map(opt => (
                                                <div key={opt} className={`px-4 py-3 hover:bg-[#93c5fd]/10 cursor-pointer border-b border-white/50 last:border-b-0 transition-colors duration-200 flex justify-between items-center ${formData.degree.includes(opt) ? "bg-[#93c5fd]/10" : ""}`} onClick={() => handleMultiToggle('degree', opt)}>
                                                    <div className="flex items-center">
                                                        <div className={`w-5 h-5 border-2 rounded mr-3 flex items-center justify-center ${formData.degree.includes(opt) ? 'bg-[#3b82f6] border-[#3b82f6]' : 'border-gray-300'}`}>
                                                            {formData.degree.includes(opt) && (
                                                                <CheckSquare size={12} className="text-white" />
                                                            )}
                                                        </div>
                                                        {opt}
                                                    </div>
                                                    {formData.degree.includes(opt) && <span className="text-[#3b82f6]">✓</span>}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Type of College */}
                        <div ref={collegeTypesRef}>
                            <label className="block text-gray-700 font-medium mb-2 flex items-center gap-2">
                                <School className="w-4 h-4 text-[#3b82f6]" />
                                Type of College
                            </label>
                            <div
                                onClick={() => setDropdownOpen(prev => ({ ...prev, collegeTypes: !prev.collegeTypes }))}
                                className="w-full bg-white/50 backdrop-blur-sm border border-white/50 rounded-xl p-3 min-h-[48px] cursor-pointer hover:border-[#93c5fd] transition-all duration-200 flex items-center justify-between"
                            >
                                <span className={formData.collegeTypes ? "text-gray-900" : "text-gray-500"}>
                                    {formData.collegeTypes || 'Select college type'}
                                </span>
                                <ChevronDown className={`w-4 h-4 text-[#3b82f6] transition-transform ${dropdownOpen.collegeTypes ? "rotate-180" : ""}`} />
                            </div>
                            {dropdownOpen.collegeTypes && (
                                <div className="absolute z-20 w-full bg-white/90 backdrop-blur-sm border border-white/50 rounded-xl mt-1 shadow-lg shadow-blue-50/50 overflow-hidden">
                                    <div className="p-3 border-b border-white/50">
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                placeholder="Add custom type..."
                                                className="w-full bg-white/50 backdrop-blur-sm border border-white/50 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#93c5fd] focus:border-transparent"
                                                value={customCollegeType}
                                                onChange={(e) => setCustomCollegeType(e.target.value)}
                                                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleCustomSingleAdd('collegeTypes', customCollegeType, setCustomCollegeType); } }}
                                            />
                                            <button
                                                type="button"
                                                className="px-4 py-2 bg-gradient-to-r from-[#93c5fd] to-[#3b82f6] text-white rounded-lg text-sm font-medium"
                                                onClick={() => handleCustomSingleAdd('collegeTypes', customCollegeType, setCustomCollegeType)}
                                            >
                                                Add
                                            </button>
                                        </div>
                                    </div>
                                    <div className="max-h-60 overflow-auto">
                                        {collegeTypeOptions.map(option => (
                                            <div
                                                key={option}
                                                onClick={() => handleOptionSelect('collegeTypes', option)}
                                                className={`px-4 py-3 hover:bg-[#93c5fd]/10 cursor-pointer border-b border-white/50 last:border-b-0 transition-colors duration-200 ${formData.collegeTypes === option ? 'bg-[#93c5fd]/10' : ''}`}
                                            >
                                                {option}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Company Type */}
                        <div ref={companyTypeRef}>
                            <label className="block text-gray-700 font-medium mb-2 flex items-center gap-2">
                                <Building className="w-4 h-4 text-[#3b82f6]" />
                                Company Type
                            </label>
                            <div className="relative">
                                <div
                                    className="w-full bg-white/50 backdrop-blur-sm border border-white/50 rounded-xl p-3 min-h-[48px] cursor-pointer hover:border-[#93c5fd] transition-all duration-200"
                                    onClick={() => setDropdownOpen(prev => ({ ...prev, companyType: !prev.companyType }))}
                                >
                                    {formData.companyType.length > 0 ? (
                                        <div className="flex flex-wrap gap-2">
                                            {formData.companyType.map(item => (
                                                <span key={item} className="flex items-center bg-gradient-to-r from-[#93c5fd]/20 to-[#3b82f6]/20 text-[#3b82f6] text-xs font-semibold px-3 py-1 rounded-full border border-[#93c5fd]/30">
                                                    {item}
                                                    <button type="button" onClick={(e) => { e.stopPropagation(); removeItem('companyType', item); }} className="ml-1.5 hover:bg-[#3b82f6]/20 rounded-full p-0.5">
                                                        <X size={12} />
                                                    </button>
                                                </span>
                                            ))}
                                        </div>
                                    ) : <span className="text-gray-500">Select company types</span>}
                                </div>
                                {dropdownOpen.companyType && (
                                    <div className="absolute z-20 w-full bg-white/90 backdrop-blur-sm border border-white/50 rounded-xl mt-1 shadow-lg shadow-blue-50/50 overflow-hidden">
                                        <div className="p-3 border-b border-white/50">
                                            <div className="flex gap-2">
                                                <input
                                                    type="text"
                                                    placeholder="Add custom type..."
                                                    className="w-full bg-white/50 backdrop-blur-sm border border-white/50 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#93c5fd] focus:border-transparent"
                                                    value={customCompanyType}
                                                    onChange={(e) => setCustomCompanyType(e.target.value)}
                                                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleCustomAdd('companyType', customCompanyType, setCustomCompanyType); } }}
                                                />
                                                <button
                                                    type="button"
                                                    className="px-4 py-2 bg-gradient-to-r from-[#93c5fd] to-[#3b82f6] text-white rounded-lg text-sm font-medium"
                                                    onClick={() => handleCustomAdd('companyType', customCompanyType, setCustomCompanyType)}
                                                >
                                                    Add
                                                </button>
                                            </div>
                                        </div>
                                        <div className="max-h-60 overflow-auto">
                                            {companyTypeOptions.map(opt => (
                                                <div key={opt} className={`px-4 py-3 hover:bg-[#93c5fd]/10 cursor-pointer border-b border-white/50 last:border-b-0 transition-colors duration-200 flex justify-between items-center ${formData.companyType.includes(opt) ? "bg-[#93c5fd]/10" : ""}`} onClick={() => handleMultiToggle('companyType', opt)}>
                                                    <div className="flex items-center">
                                                        <div className={`w-5 h-5 border-2 rounded mr-3 flex items-center justify-center ${formData.companyType.includes(opt) ? 'bg-[#3b82f6] border-[#3b82f6]' : 'border-gray-300'}`}>
                                                            {formData.companyType.includes(opt) && (
                                                                <CheckSquare size={12} className="text-white" />
                                                            )}
                                                        </div>
                                                        {opt}
                                                    </div>
                                                    {formData.companyType.includes(opt) && <span className="text-[#3b82f6]">✓</span>}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Work Mode */}
                        <div>
                            <label className="block text-gray-700 font-medium mb-2 flex items-center gap-2">
                                <Monitor className="w-4 h-4 text-[#3b82f6]" />
                                Work Mode
                            </label>
                            <div className="flex gap-3">
                                {workModeOptions.map((type) => (
                                    <button key={type} type="button" className={`px-4 py-3 rounded-xl border transition-all duration-200 font-medium flex-1 ${
                                        formData.workMode.includes(type) 
                                            ? 'bg-gradient-to-r from-[#93c5fd] to-[#3b82f6] text-white border-transparent shadow-md shadow-[#93c5fd]/30' 
                                            : 'bg-white/50 backdrop-blur-sm border-white/50 text-gray-700 hover:bg-white/70'
                                    }`} onClick={() => handleMultiToggle('workMode', type)}>
                                        {type}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Employment Type */}
                        <div>
                            <label className="block text-gray-700 font-medium mb-2 flex items-center gap-2">
                                <Briefcase className="w-4 h-4 text-[#3b82f6]" />
                                Employment type
                            </label>
                            <div className="flex gap-3">
                                {['Part-time', 'Full-time', 'Contract'].map((type) => (
                                    <button key={type} type="button" className={`px-4 py-3 rounded-xl border transition-all duration-200 font-medium flex-1 ${
                                        formData.employmentType.includes(type) 
                                            ? 'bg-gradient-to-r from-[#93c5fd] to-[#3b82f6] text-white border-transparent shadow-md shadow-[#93c5fd]/30' 
                                            : 'bg-white/50 backdrop-blur-sm border-white/50 text-gray-700 hover:bg-white/70'
                                    }`} onClick={() => handleMultiToggle('employmentType', type)}>
                                        {type}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Application Dates */}
                        <div>
                            <label className="block text-gray-700 font-medium mb-2 flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-[#3b82f6]" />
                                Application Start/End Date
                            </label>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input 
                                    name="tentativeStartDate" 
                                    type="date" 
                                    className="w-full bg-white/50 backdrop-blur-sm border border-white/50 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#93c5fd] focus:border-transparent transition-all duration-200" 
                                    value={formData.tentativeStartDate} 
                                    onChange={handleChange} 
                                />
                                <input 
                                    name="tentativeEndDate" 
                                    type="date" 
                                    className="w-full bg-white/50 backdrop-blur-sm border border-white/50 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#93c5fd] focus:border-transparent transition-all duration-200" 
                                    value={formData.tentativeEndDate} 
                                    onChange={handleChange} 
                                />
                            </div>
                        </div>

                        {/* Proposed Schedule */}
                        <div>
                            <label className="block text-gray-700 font-medium mb-2 flex items-center gap-2">
                                <Clock className="w-4 h-4 text-[#3b82f6]" />
                                Proposed Schedule (Tentative Dates)
                            </label>
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <input 
                                        type="date" 
                                        name="startDate" 
                                        placeholder="Proposed Start Date" 
                                        className="w-full bg-white/50 backdrop-blur-sm border border-white/50 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#93c5fd] focus:border-transparent transition-all duration-200" 
                                        value={formData.proposedSchedule.startDate} 
                                        onChange={handleProposedScheduleChange} 
                                    />
                                    <input 
                                        type="date" 
                                        name="endDate" 
                                        placeholder="Proposed End Date" 
                                        className="w-full bg-white/50 backdrop-blur-sm border border-white/50 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#93c5fd] focus:border-transparent transition-all duration-200" 
                                        value={formData.proposedSchedule.endDate} 
                                        onChange={handleProposedScheduleChange} 
                                    />
                                </div>
                                <div className="relative">
                                    <select 
                                        name="preferredMode" 
                                        className="w-full bg-white/50 backdrop-blur-sm border border-white/50 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#93c5fd] focus:border-transparent appearance-none transition-all duration-200" 
                                        value={formData.proposedSchedule.preferredMode} 
                                        onChange={handleProposedScheduleChange}
                                    >
                                        <option value="">Select Preferred Mode</option>
                                        {proposedModeOptions.map(option => (
                                            <option key={option} value={option}>{option}</option>
                                        ))}
                                    </select>
                                    <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                                        <ChevronDown size={16} className="text-[#3b82f6]" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Salary */}
                        <div>
                            <label className="block text-gray-700 font-medium mb-2 flex items-center gap-2">
                                <DollarSign className="w-4 h-4 text-[#3b82f6]" />
                                Minimum Cut-off Salary
                            </label>
                            <div className="flex rounded-xl overflow-hidden shadow-sm">
                                <select 
                                    name="salaryRange" 
                                    className="bg-white/50 backdrop-blur-sm border border-white/50 px-3 py-3 w-24 focus:outline-none focus:ring-2 focus:ring-[#93c5fd] focus:border-transparent" 
                                    value={formData.salaryRange} 
                                    onChange={handleChange}
                                >
                                    <option>USD</option>
                                    <option>INR</option>
                                    <option>EUR</option>
                                </select>
                                <input 
                                    name="salaryValue" 
                                    type="number" 
                                    className="bg-white/50 backdrop-blur-sm border border-white/50 flex-1 px-3 py-3 focus:outline-none focus:ring-2 focus:ring-[#93c5fd] focus:border-transparent" 
                                    placeholder="Enter amount" 
                                    value={formData.salaryValue} 
                                    onChange={handleChange} 
                                />
                            </div>
                        </div>

                        {/* Rounds Table */}
                        <div>
                            <label className="block text-gray-700 font-medium mb-2 flex items-center gap-2">
                                <List className="w-4 h-4 text-[#3b82f6]" />
                                Number of Rounds
                            </label>
                            <div className="overflow-x-auto border border-white/50 rounded-xl bg-white/30">
                                <table className="min-w-full divide-y divide-white/50">
                                    <thead className="bg-white/50">
                                        <tr>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">S.No.</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Branch</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No. of Students</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Skills (comma separated)</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white/30 divide-y divide-white/50">
                                        {formData.rounds.map((round) => (
                                            <tr key={round.id}>
                                                <td className="px-4 py-3 text-sm text-gray-900">{round.id}</td>
                                                <td className="px-4 py-3">
                                                    <div className="relative">
                                                        <select 
                                                            className="w-full bg-white/50 backdrop-blur-sm border border-white/50 rounded-lg px-3 py-2 text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-[#93c5fd] focus:border-transparent" 
                                                            value={round.branch} 
                                                            onChange={(e) => handleRoundChange(round.id, 'branch', e.target.value)}
                                                        >
                                                            <option value="">Select Branch</option>
                                                            {branchOptions.map(option => (
                                                                <option key={option} value={option}>{option}</option>
                                                            ))}
                                                        </select>
                                                        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                                                            <ChevronDown size={14} className="text-[#3b82f6]" />
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <input 
                                                        type="number" 
                                                        className="w-full bg-white/50 backdrop-blur-sm border border-white/50 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#93c5fd] focus:border-transparent" 
                                                        value={round.students} 
                                                        onChange={(e) => handleRoundChange(round.id, 'students', e.target.value)} 
                                                        min="0" 
                                                    />
                                                </td>
                                                <td className="px-4 py-3">
                                                    <input 
                                                        type="text" 
                                                        className="w-full bg-white/50 backdrop-blur-sm border border-white/50 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#93c5fd] focus:border-transparent" 
                                                        value={round.skills} 
                                                        onChange={(e) => handleRoundChange(round.id, 'skills', e.target.value)} 
                                                        placeholder="e.g., Python, SQL" 
                                                    />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Amenities */}
                        <div ref={amenitiesRef}>
                            <label className="block text-gray-700 font-medium mb-2 flex items-center gap-2">
                                <Building className="w-4 h-4 text-[#3b82f6]" />
                                Campus Facilities/Amenities Provided
                            </label>
                            <div className="relative">
                                <div 
                                    className="w-full bg-white/50 backdrop-blur-sm border border-white/50 rounded-xl p-3 min-h-[48px] cursor-pointer hover:border-[#93c5fd] transition-all duration-200" 
                                    onClick={() => setDropdownOpen(prev => ({ ...prev, amenities: !prev.amenities }))}
                                >
                                    {formData.amenities.length > 0 ? (
                                        <div className="flex flex-wrap gap-2">
                                            {formData.amenities.map(item => (
                                                <span key={item} className="flex items-center bg-gradient-to-r from-[#93c5fd]/20 to-[#3b82f6]/20 text-[#3b82f6] text-xs font-semibold px-3 py-1 rounded-full border border-[#93c5fd]/30">
                                                    {item}
                                                    <button type="button" onClick={(e) => { e.stopPropagation(); removeItem('amenities', item); }} className="ml-1.5 hover:bg-[#3b82f6]/20 rounded-full p-0.5">
                                                        <X size={12} />
                                                    </button>
                                                </span>
                                            ))}
                                        </div>
                                    ) : <span className="text-gray-500">Select facilities</span>}
                                </div>
                                {dropdownOpen.amenities && (
                                    <div className="absolute z-20 w-full bg-white/90 backdrop-blur-sm border border-white/50 rounded-xl mt-1 shadow-lg shadow-blue-50/50 overflow-hidden">
                                        <div className="p-3 border-b border-white/50">
                                            <div className="flex gap-2">
                                                <input
                                                    type="text"
                                                    placeholder="Add custom facility..."
                                                    className="w-full bg-white/50 backdrop-blur-sm border border-white/50 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#93c5fd] focus:border-transparent"
                                                    value={customAmenity}
                                                    onChange={(e) => setCustomAmenity(e.target.value)}
                                                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleCustomAdd('amenities', customAmenity, setCustomAmenity); } }}
                                                />
                                                <button
                                                    type="button"
                                                    className="px-4 py-2 bg-gradient-to-r from-[#93c5fd] to-[#3b82f6] text-white rounded-lg text-sm font-medium"
                                                    onClick={() => handleCustomAdd('amenities', customAmenity, setCustomAmenity)}
                                                >
                                                    Add
                                                </button>
                                            </div>
                                        </div>
                                        <div className="max-h-60 overflow-auto">
                                            {amenitiesOptions.map(opt => (
                                                <div key={opt} className={`px-4 py-3 hover:bg-[#93c5fd]/10 cursor-pointer border-b border-white/50 last:border-b-0 transition-colors duration-200 flex justify-between items-center ${formData.amenities.includes(opt) ? "bg-[#93c5fd]/10" : ""}`} onClick={() => handleMultiToggle('amenities', opt)}>
                                                    <div className="flex items-center">
                                                        <div className={`w-5 h-5 border-2 rounded mr-3 flex items-center justify-center ${formData.amenities.includes(opt) ? 'bg-[#3b82f6] border-[#3b82f6]' : 'border-gray-300'}`}>
                                                            {formData.amenities.includes(opt) && (
                                                                <CheckSquare size={12} className="text-white" />
                                                            )}
                                                        </div>
                                                        {opt}
                                                    </div>
                                                    {formData.amenities.includes(opt) && <span className="text-[#3b82f6]">✓</span>}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <label htmlFor="description" className="block text-gray-700 font-medium mb-2 flex items-center gap-2">
                                <MessageSquare className="w-4 h-4 text-[#3b82f6]" />
                                Description / Message
                            </label>
                            <textarea 
                                id="description" 
                                name="description" 
                                className="w-full bg-white/50 backdrop-blur-sm border border-white/50 rounded-xl px-3 py-3 focus:outline-none focus:ring-2 focus:ring-[#93c5fd] focus:border-transparent transition-all duration-200 resize-none" 
                                placeholder="Any additional information..." 
                                value={formData.description} 
                                onChange={handleChange} 
                                rows="3"
                            ></textarea>
                        </div>

                        <hr className="border-white/50" />

                        {/* Contact Person Fields */}
                        <div>
                            <label className="block text-gray-700 font-medium mb-2 flex items-center gap-2">
                                <User className="w-4 h-4 text-[#3b82f6]" />
                                Contact Person Name <span className="text-red-500">*</span>
                            </label>
                            <input 
                                type="text" 
                                name="name" 
                                value={formData.contactPerson.name} 
                                onChange={handleContactChange} 
                                placeholder="Enter full name" 
                                className="w-full bg-white/50 backdrop-blur-sm border border-white/50 rounded-xl px-3 py-3 focus:outline-none focus:ring-2 focus:ring-[#93c5fd] focus:border-transparent transition-all duration-200" 
                                required 
                            />
                        </div>
                        
                        <div>
                            <label className="block text-gray-700 font-medium mb-2 flex items-center gap-2">
                                <User className="w-4 h-4 text-[#3b82f6]" />
                                Contact person designation <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <select 
                                    name="designation" 
                                    value={formData.contactPerson.designation} 
                                    onChange={handleContactChange} 
                                    className="w-full bg-white/50 backdrop-blur-sm border border-white/50 rounded-xl px-3 py-3 focus:outline-none focus:ring-2 focus:ring-[#93c5fd] focus:border-transparent appearance-none transition-all duration-200" 
                                    required
                                >
                                    <option value="" disabled>Select designation</option>
                                    {designationOptions.map((designation) => (
                                        <option key={designation} value={designation}>{designation}</option>
                                    ))}
                                </select>
                                <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                                    <ChevronDown className="w-4 h-4 text-[#3b82f6]" />
                                </div>
                            </div>
                        </div>
                        
                        <div>
                            <label className="block text-gray-700 font-medium mb-2 flex items-center gap-2">
                                <Mail className="w-4 h-4 text-[#3b82f6]" />
                                Contact person email <span className="text-red-500">*</span>
                            </label>
                            <input 
                                type="email" 
                                name="email" 
                                value={formData.contactPerson.email} 
                                onChange={handleContactChange} 
                                placeholder="example@company.com" 
                                className="w-full bg-white/50 backdrop-blur-sm border border-white/50 rounded-xl px-3 py-3 focus:outline-none focus:ring-2 focus:ring-[#93c5fd] focus:border-transparent transition-all duration-200" 
                                required 
                            />
                        </div>
                        
                        <div>
                            <label className="block text-gray-700 font-medium mb-2 flex items-center gap-2">
                                <Phone className="w-4 h-4 text-[#3b82f6]" />
                                Contact person mobile no <span className="text-red-500">*</span>
                            </label>
                            <input 
                                type="tel" 
                                name="mobile" 
                                value={formData.contactPerson.mobile} 
                                onChange={handleContactChange} 
                                placeholder="Enter 10-digit mobile number" 
                                className="w-full bg-white/50 backdrop-blur-sm border border-white/50 rounded-xl px-3 py-3 focus:outline-none focus:ring-2 focus:ring-[#93c5fd] focus:border-transparent transition-all duration-200" 
                                required 
                            />
                        </div>
                        
                        <div>
                            <label className="block text-gray-700 font-medium mb-2 flex items-center gap-2">
                                <Linkedin className="w-4 h-4 text-[#3b82f6]" />
                                Contact person LinkedIn Profile
                            </label>
                            <input 
                                type="url" 
                                name="linkedin" 
                                value={formData.contactPerson.linkedin} 
                                onChange={handleContactChange} 
                                placeholder="https://www.linkedin.com/in/username" 
                                className="w-full bg-white/50 backdrop-blur-sm border border-white/50 rounded-xl px-3 py-3 focus:outline-none focus:ring-2 focus:ring-[#93c5fd] focus:border-transparent transition-all duration-200" 
                            />
                        </div>
                        
                        <div>
                            <label htmlFor="minStudentsToBePlaced" className="block text-gray-700 font-medium mb-2 flex items-center gap-2">
                                <Users className="w-4 h-4 text-[#3b82f6]" />
                                Minimum Students to be Placed <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <select 
                                    id="minStudentsToBePlaced" 
                                    name="minStudentsToBePlaced" 
                                    className="w-full bg-white/50 backdrop-blur-sm border border-white/50 rounded-xl px-3 py-3 focus:outline-none focus:ring-2 focus:ring-[#93c5fd] focus:border-transparent appearance-none transition-all duration-200" 
                                    value={formData.minStudentsToBePlaced} 
                                    onChange={handleChange} 
                                    required 
                                >
                                    <option value="">Select Range</option>
                                    {minStudentsOptions.map(option => (
                                        <option key={option} value={option}>{option}</option>
                                    ))}
                                </select>
                                <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                                    <ChevronDown size={16} className="text-[#3b82f6]" />
                                </div>
                            </div>
                        </div>

                        {/* Form Actions */}
                        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-8 border-t border-gray-200/50">
                            {onBackClick && (
                                <button 
                                    type="button"
                                    onClick={onBackClick}
                                    className="flex items-center gap-2 text-[#3b82f6] hover:text-[#1d4ed8] font-medium transition-colors duration-200 group"
                                >
                                    <ArrowLeft className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform duration-200" />
                                    Back to Home
                                </button>
                            )}
                            <button 
                                type="submit"
                                disabled={isSubmitting}
                                className="group flex items-center gap-3 px-8 py-3 bg-gradient-to-r from-[#93c5fd] to-[#3b82f6] text-white rounded-xl hover:shadow-lg hover:shadow-[#93c5fd]/40 transition-all duration-200 text-base font-medium disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                <Send className="w-5 h-5" />
                                {isSubmitting ? 'Submitting...' : 'Register'}
                                <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}