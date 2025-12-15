import { useState, useRef, useEffect, useMemo } from 'react';
import axios from 'axios';
import { ChevronDown, X, Calendar, Clock, Users, Target, GraduationCap, Building, DollarSign, List, MapPin, User, Mail, Phone, Linkedin, ArrowLeft, Send, CheckSquare, Briefcase, MessageSquare } from 'lucide-react';
import toast from 'react-hot-toast';
import CreatableSelect from 'react-select/creatable';
import { City } from 'country-state-city';

export default function RegisterPage({ onBackClick }) {
    const initialFormState = {
        degree: [],
        lookingFor: ['job'],
        employmentType: [],
        salaryRange: 'USD',
        salaryValue: '',
        tentativeStartDate: '',
        tentativeEndDate: '',
        rounds: Array.from({ length: 6 }, (_, i) => ({ id: i + 1, students: '', branch: '', skills: '' })),
        collegeLocation: null,
        coordinatorName: '',
        coordinatorDesignation: '',
        email: '',
        mobile: '',
        linkedinProfile: '',
        minStudentsToBePlaced: '',
        amenities: [],
        description: '',
        companyType: [],
        proposedSchedule: { startDate: '', endDate: '', preferredMode: '' },
    };

    const [formData, setFormData] = useState(initialFormState);
    const [alert, setAlert] = useState({ show: false, message: '', type: '' });

    const [dropdownOpen, setDropdownOpen] = useState({ 
        amenities: false, 
        companyType: false,
        degree: false 
    });
    const [customAmenity, setCustomAmenity] = useState('');
    const [customDegree, setCustomDegree] = useState('');
    const [customCompanyType, setCustomCompanyType] = useState('');

    const amenitiesRef = useRef(null);
    const companyTypeRef = useRef(null);
    const degreeRef = useRef(null);

    const degreeOptions = ['B.Tech', 'M.Tech', 'MBA', 'B.Sc', 'M.Sc', 'PhD'];
    const branchOptions = ['Computer Science', 'Mechanical', 'Civil', 'Electrical', 'Electronics', 'Bio-medical'];
    const designationOptions = ['Professor', 'HOD', 'Placement Officer', 'Dean', 'Coordinator'];
    const amenitiesOptions = ['Auditorium', 'Seminar Hall', 'Interview Rooms', 'Computer Labs', 'Wi-Fi Access', 'Projector'];
    const minStudentsOptions = ['1-10', '11-25', '26-50', '51-100', '101-200', '200+'];
    
    const companyTypeOptions = ["MNC", "Startup", "SME", "Public Sector"];
    const proposedModeOptions = ["Online", "Offline", "Hybrid"];

    const cityOptions = useMemo(() =>
        City.getCitiesOfCountry('IN').map(city => ({
            value: city.name,
            label: city.name,
        })),
    []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (amenitiesRef.current && !amenitiesRef.current.contains(event.target)) {
                setDropdownOpen(prev => ({ ...prev, amenities: false }));
            }
            if (companyTypeRef.current && !companyTypeRef.current.contains(event.target)) {
                setDropdownOpen(prev => ({ ...prev, companyType: false }));
            }
            if (degreeRef.current && !degreeRef.current.contains(event.target)) {
                setDropdownOpen(prev => ({ ...prev, degree: false }));
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => { document.removeEventListener('mousedown', handleClickOutside); };
    }, []);

    const handleChange = (field, value) => {
        setFormData({ ...formData, [field]: value });
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

    const handleMultiToggle = (field, value) => {
        const currentValues = formData[field];
        const newValues = currentValues.includes(value)
            ? currentValues.filter(item => item !== value)
            : [...currentValues, value];
        setFormData({ ...formData, [field]: newValues });
    };

    const handleRoundChange = (id, field, value) => {
        const updatedRounds = formData.rounds.map(round =>
            round.id === id ? { ...round, [field]: value } : round
        );
        setFormData({ ...formData, rounds: updatedRounds });
    };

    const addItem = (field, item, setCustomInput, predefinedOptions = []) => {
        if (item.trim() && !formData[field].includes(item.trim()) && 
            !predefinedOptions.map(opt => opt.toLowerCase()).includes(item.trim().toLowerCase())) {
            setFormData(prev => ({ ...prev, [field]: [...prev[field], item.trim()] }));
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

        if (!formData.degree.length || !formData.collegeLocation || !formData.email || !formData.mobile) {
            showAlert('Please fill all the required fields marked with *', 'error');
            return;
        }

        let aggregatedSkills = [];
        let studentStreams = [];
        let roundNames = [];
        let studentCounts = [];

        const nonEmptyRounds = formData.rounds.filter(round => round.students || round.branch || round.skills);
        nonEmptyRounds.forEach(round => {
            if (round.skills) aggregatedSkills = [...new Set([...aggregatedSkills, ...round.skills.split(',').map(s => s.trim()).filter(Boolean)])];
            if (round.branch) studentStreams = [...new Set([...studentStreams, round.branch])];
            if (round.students) studentCounts.push(round.students);
            roundNames.push(`Round ${round.id}`);
        });

        let backendLookingFor = '';
        if (formData.lookingFor.includes('job') && formData.lookingFor.includes('internship')) {
            backendLookingFor = 'Both';
        } else if (formData.lookingFor.includes('internship')) {
            backendLookingFor = 'Internship';
        } else if (formData.lookingFor.includes('job')) {
            backendLookingFor = 'Job';
        }

        const payload = {
            jobType: 'On-campus',
            degree: formData.degree,
            studentStreams: studentStreams,
            numberOfStudent: studentCounts,
            lookingFor: backendLookingFor,
            employmentType: formData.employmentType,
            packageDetails: {
                currency: formData.salaryRange,
                totalCTC: parseFloat(formData.salaryValue) || 0,
            },
            startDate: formData.tentativeStartDate,
            endDate: formData.tentativeEndDate,
            location: formData.collegeLocation ? [formData.collegeLocation.value] : [],
            contactPerson: {
                name: formData.coordinatorName,
                designation: formData.coordinatorDesignation,
                email: formData.email,
                mobile: formData.mobile,
                linkedin: formData.linkedinProfile,
            },
            noOfplacedStudents: formData.minStudentsToBePlaced,
            skills: aggregatedSkills,
            rounds: roundNames,
            amenitiesRequired: formData.amenities,
            description: formData.description,
            companyType: formData.companyType,
            proposedSchedule: formData.proposedSchedule,
        };

        try {
            const backendUrl = import.meta.env.VITE_Backend_URL || 'http://localhost:5000';
            const response = await axios.post(`${backendUrl}/api/hiring-channels/on-campus/college-request`, payload, {
                withCredentials: true,
                headers: { 'Content-Type': 'application/json' }
            });

            toast.success(response?.data?.message);
            resetForm();
        } catch (error) {
            console.error('Error submitting form:', error);
            toast.error('Something went wrong!');
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
                        Revolutionizing Campus Recruitment
                    </h1>
                    <p className="text-gray-600 text-lg md:text-xl max-w-3xl mx-auto">
                        Our platform connects colleges with skilled employers, offering tools for targeted training and data-driven insights to refine recruitment strategies.
                    </p>
                </div>

                {/* Form Section */}
                <div className="bg-white/90 backdrop-blur-sm border border-white/50 rounded-2xl shadow-lg shadow-blue-50/50 p-8">
                    <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-[#3b82f6] to-[#8b5cf6] bg-clip-text text-transparent mb-2 text-center">
                        Register for Campus Placement
                    </h2>
                    <p className="text-gray-600 mb-8 text-center">
                        Please fill out the form below to register your college for campus placements.
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Degree Multi-Select with Custom Add */}
                        <div ref={degreeRef}>
                            <label className="block text-gray-700 font-medium mb-2 flex items-center gap-2">
                                <GraduationCap className="w-4 h-4 text-[#3b82f6]" />
                                Degree <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <div 
                                    className="flex items-center justify-between p-3 w-full bg-white/50 backdrop-blur-sm border border-white/50 rounded-xl cursor-pointer hover:border-[#93c5fd] min-h-[48px] transition-all duration-200"
                                    onClick={() => setDropdownOpen(prev => ({ ...prev, degree: !prev.degree }))}
                                >
                                    <div className="flex flex-wrap gap-2 flex-1">
                                        {formData.degree.length > 0 ? (
                                            formData.degree.map(degree => (
                                                <span key={degree} className="flex items-center bg-gradient-to-r from-[#93c5fd]/20 to-[#3b82f6]/20 text-[#3b82f6] text-xs font-semibold px-3 py-1 rounded-full border border-[#93c5fd]/30">
                                                    {degree}
                                                    <button 
                                                        type="button" 
                                                        onClick={(e) => { 
                                                            e.stopPropagation(); 
                                                            removeItem('degree', degree); 
                                                        }} 
                                                        className="ml-1.5 hover:bg-[#3b82f6]/20 rounded-full p-0.5"
                                                    >
                                                        <X size={12} />
                                                    </button>
                                                </span>
                                            ))
                                        ) : (
                                            <span className="text-gray-500">Select degree(s)</span>
                                        )}
                                    </div>
                                    <ChevronDown className={`w-5 h-5 text-[#3b82f6] transition-transform ${dropdownOpen.degree ? "rotate-180" : ""}`} />
                                </div>
                                {dropdownOpen.degree && (
                                    <div className="absolute z-20 mt-1 w-full bg-white/90 backdrop-blur-sm border border-white/50 rounded-xl shadow-lg shadow-blue-50/50 overflow-hidden">
                                        <div className="p-3 border-b border-white/50">
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
                                                            addItem('degree', customDegree, setCustomDegree, degreeOptions);
                                                        }
                                                    }}
                                                    className="w-full bg-white/50 backdrop-blur-sm border border-white/50 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#93c5fd] focus:border-transparent"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        addItem('degree', customDegree, setCustomDegree, degreeOptions);
                                                    }}
                                                    className="px-4 py-2 bg-gradient-to-r from-[#93c5fd] to-[#3b82f6] text-white rounded-lg text-sm font-medium"
                                                >
                                                    Add
                                                </button>
                                            </div>
                                        </div>
                                        <div className="max-h-60 overflow-auto">
                                            {degreeOptions.map(option => (
                                                <div 
                                                    key={option} 
                                                    onClick={() => handleMultiToggle('degree', option)} 
                                                    className={`px-4 py-3 hover:bg-[#93c5fd]/10 cursor-pointer border-b border-white/50 last:border-b-0 transition-colors duration-200 flex justify-between items-center ${formData.degree.includes(option) ? "bg-[#93c5fd]/10" : ""}`}
                                                >
                                                    <div className="flex items-center">
                                                        <div className={`w-5 h-5 border-2 rounded mr-3 flex items-center justify-center ${formData.degree.includes(option) ? 'bg-[#3b82f6] border-[#3b82f6]' : 'border-gray-300'}`}>
                                                            {formData.degree.includes(option) && (
                                                                <CheckSquare size={12} className="text-white" />
                                                            )}
                                                        </div>
                                                        {option}
                                                    </div>
                                                    {formData.degree.includes(option) && <span className="text-[#3b82f6]">✓</span>}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div>
                            <label className="block text-gray-700 font-medium mb-2 flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-[#3b82f6]" />
                                Application Start/End Date
                            </label>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input 
                                    type="date" 
                                    placeholder="Start Date" 
                                    className="w-full bg-white/50 backdrop-blur-sm border border-white/50 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#93c5fd] focus:border-transparent transition-all duration-200" 
                                    value={formData.tentativeStartDate} 
                                    onChange={(e) => handleChange('tentativeStartDate', e.target.value)} 
                                />
                                <input 
                                    type="date" 
                                    placeholder="End Date" 
                                    className="w-full bg-white/50 backdrop-blur-sm border border-white/50 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#93c5fd] focus:border-transparent transition-all duration-200" 
                                    value={formData.tentativeEndDate} 
                                    onChange={(e) => handleChange('tentativeEndDate', e.target.value)} 
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

                        <div>
                            <label className="block text-gray-700 font-medium mb-2 flex items-center gap-2">
                                <Target className="w-4 h-4 text-[#3b82f6]" />
                                Looking for
                            </label>
                            <div className="flex gap-3">
                                {['job', 'internship'].map((type) => (
                                    <button 
                                        key={type} 
                                        type="button" 
                                        className={`px-4 py-3 rounded-xl border transition-all duration-200 font-medium flex-1 capitalize ${
                                            formData.lookingFor.includes(type) 
                                                ? 'bg-gradient-to-r from-[#93c5fd] to-[#3b82f6] text-white border-transparent shadow-md shadow-[#93c5fd]/30' 
                                                : 'bg-white/50 backdrop-blur-sm border-white/50 text-gray-700 hover:bg-white/70'
                                        }`} 
                                        onClick={() => handleMultiToggle('lookingFor', type)}
                                    >
                                        {type}
                                    </button>
                                ))}
                            </div>
                            {formData.lookingFor.includes('job') && formData.lookingFor.includes('internship') && (
                                <div className="mt-2">
                                    <span className="text-sm text-[#3b82f6] font-medium">✓ Both Job and Internship selected</span>
                                </div>
                            )}
                        </div>

                        <div>
                            <label className="block text-gray-700 font-medium mb-2 flex items-center gap-2">
                                <Briefcase className="w-4 h-4 text-[#3b82f6]" />
                                Employment type
                            </label>
                            <div className="flex gap-3">
                                {['Part-time', 'Full-time', 'Contract'].map((type) => (
                                    <button 
                                        key={type} 
                                        type="button" 
                                        className={`px-4 py-3 rounded-xl border transition-all duration-200 font-medium flex-1 ${
                                            formData.employmentType.includes(type) 
                                                ? 'bg-gradient-to-r from-[#93c5fd] to-[#3b82f6] text-white border-transparent shadow-md shadow-[#93c5fd]/30' 
                                                : 'bg-white/50 backdrop-blur-sm border-white/50 text-gray-700 hover:bg-white/70'
                                        }`} 
                                        onClick={() => handleMultiToggle('employmentType', type)}
                                    >
                                        {type}
                                    </button>
                                ))}
                            </div>
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
                                                    <button 
                                                        type="button" 
                                                        onClick={(e) => { 
                                                            e.stopPropagation(); 
                                                            removeItem('companyType', item); 
                                                        }} 
                                                        className="ml-1.5 hover:bg-[#3b82f6]/20 rounded-full p-0.5"
                                                    >
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
                                                    placeholder="Add custom company type..."
                                                    value={customCompanyType}
                                                    onChange={(e) => setCustomCompanyType(e.target.value)}
                                                    onClick={(e) => e.stopPropagation()}
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter') {
                                                            e.preventDefault();
                                                            addItem('companyType', customCompanyType, setCustomCompanyType, companyTypeOptions);
                                                        }
                                                    }}
                                                    className="w-full bg-white/50 backdrop-blur-sm border border-white/50 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#93c5fd] focus:border-transparent"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        addItem('companyType', customCompanyType, setCustomCompanyType, companyTypeOptions);
                                                    }}
                                                    className="px-4 py-2 bg-gradient-to-r from-[#93c5fd] to-[#3b82f6] text-white rounded-lg text-sm font-medium"
                                                >
                                                    Add
                                                </button>
                                            </div>
                                        </div>
                                        <div className="max-h-60 overflow-auto">
                                            {companyTypeOptions.map(opt => (
                                                <div 
                                                    key={opt} 
                                                    className={`px-4 py-3 hover:bg-[#93c5fd]/10 cursor-pointer border-b border-white/50 last:border-b-0 transition-colors duration-200 flex justify-between items-center ${formData.companyType.includes(opt) ? "bg-[#93c5fd]/10" : ""}`} 
                                                    onClick={() => handleMultiToggle('companyType', opt)}
                                                >
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

                        <div>
                            <label className="block text-gray-700 font-medium mb-2 flex items-center gap-2">
                                <DollarSign className="w-4 h-4 text-[#3b82f6]" />
                                Minimum Cut-off Salary
                            </label>
                            <div className="flex rounded-xl overflow-hidden shadow-sm">
                                <select 
                                    className="bg-white/50 backdrop-blur-sm border border-white/50 px-3 py-3 w-24 focus:outline-none focus:ring-2 focus:ring-[#93c5fd] focus:border-transparent" 
                                    value={formData.salaryRange} 
                                    onChange={(e) => handleChange('salaryRange', e.target.value)}
                                >
                                    <option>USD</option>
                                    <option>INR</option>
                                    <option>EUR</option>
                                </select>
                                <input 
                                    type="number" 
                                    className="bg-white/50 backdrop-blur-sm border border-white/50 flex-1 px-3 py-3 focus:outline-none focus:ring-2 focus:ring-[#93c5fd] focus:border-transparent" 
                                    placeholder="Enter amount" 
                                    value={formData.salaryValue} 
                                    onChange={(e) => handleChange('salaryValue', e.target.value)} 
                                />
                            </div>
                        </div>

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
                                                    <button 
                                                        type="button" 
                                                        onClick={(e) => { 
                                                            e.stopPropagation(); 
                                                            removeItem('amenities', item); 
                                                        }} 
                                                        className="ml-1.5 hover:bg-[#3b82f6]/20 rounded-full p-0.5"
                                                    >
                                                        <X size={12} />
                                                    </button>
                                                </span>
                                            ))}
                                        </div>
                                    ) : <span className="text-gray-500">Select facilities</span>}
                                </div>
                                {dropdownOpen.amenities && (
                                    <div className="absolute z-20 w-full bg-white/90 backdrop-blur-sm border border-white/50 rounded-xl mt-1 shadow-lg shadow-blue-50/50 overflow-hidden">
                                        {amenitiesOptions.map(opt => (
                                            <div 
                                                key={opt} 
                                                className={`px-4 py-3 hover:bg-[#93c5fd]/10 cursor-pointer border-b border-white/50 last:border-b-0 transition-colors duration-200 flex justify-between items-center ${formData.amenities.includes(opt) ? "bg-[#93c5fd]/10" : ""}`} 
                                                onClick={() => handleMultiToggle('amenities', opt)}
                                            >
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
                                        <div className="p-3 border-t border-white/50">
                                            <input 
                                                type="text" 
                                                placeholder="Add custom facility..." 
                                                className="w-full bg-white/50 backdrop-blur-sm border border-white/50 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#93c5fd] focus:border-transparent" 
                                                value={customAmenity} 
                                                onChange={(e) => setCustomAmenity(e.target.value)} 
                                                onKeyDown={(e) => { 
                                                    if (e.key === 'Enter') { 
                                                        e.preventDefault(); 
                                                        addItem('amenities', customAmenity, setCustomAmenity); 
                                                    } 
                                                }} 
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div>
                            <label htmlFor="description" className="block text-gray-700 font-medium mb-2 flex items-center gap-2">
                                <MessageSquare className="w-4 h-4 text-[#3b82f6]" />
                                Description / Message
                            </label>
                            <textarea 
                                id="description" 
                                className="w-full bg-white/50 backdrop-blur-sm border border-white/50 rounded-xl px-3 py-3 focus:outline-none focus:ring-2 focus:ring-[#93c5fd] focus:border-transparent transition-all duration-200 resize-none" 
                                placeholder="Any additional information..." 
                                value={formData.description} 
                                onChange={(e) => handleChange('description', e.target.value)} 
                                rows="3"
                            ></textarea>
                        </div>

                        <hr className="border-white/50" />

                        <div>
                            <label htmlFor="collegeLocation" className="block text-gray-700 font-medium mb-2 flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-[#3b82f6]" />
                                College Location <span className="text-red-500">*</span>
                            </label>
                            <CreatableSelect
                                id="collegeLocation"
                                isClearable
                                options={cityOptions}
                                value={formData.collegeLocation}
                                onChange={(selectedOption) => handleChange('collegeLocation', selectedOption)}
                                placeholder="Select or type to add a city..."
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

                        <div>
                            <label htmlFor="coordinatorName" className="block text-gray-700 font-medium mb-2 flex items-center gap-2">
                                <User className="w-4 h-4 text-[#3b82f6]" />
                                Coordinator Name
                            </label>
                            <input 
                                id="coordinatorName" 
                                type="text" 
                                placeholder="Enter name" 
                                className="w-full bg-white/50 backdrop-blur-sm border border-white/50 rounded-xl px-3 py-3 focus:outline-none focus:ring-2 focus:ring-[#93c5fd] focus:border-transparent transition-all duration-200" 
                                value={formData.coordinatorName} 
                                onChange={(e) => handleChange('coordinatorName', e.target.value)} 
                            />
                        </div>

                        <div>
                            <label htmlFor="coordinatorDesignation" className="block text-gray-700 font-medium mb-2 flex items-center gap-2">
                                <User className="w-4 h-4 text-[#3b82f6]" />
                                Coordinator Designation <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <select 
                                    id="coordinatorDesignation" 
                                    className="w-full bg-white/50 backdrop-blur-sm border border-white/50 rounded-xl px-3 py-3 focus:outline-none focus:ring-2 focus:ring-[#93c5fd] focus:border-transparent appearance-none transition-all duration-200" 
                                    value={formData.coordinatorDesignation} 
                                    onChange={(e) => handleChange('coordinatorDesignation', e.target.value)} 
                                    required
                                >
                                    <option value="">Select Designation</option>
                                    {designationOptions.map(option => (
                                        <option key={option} value={option}>{option}</option>
                                    ))}
                                </select>
                                <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                                    <ChevronDown size={16} className="text-[#3b82f6]" />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-gray-700 font-medium mb-2 flex items-center gap-2">
                                <Mail className="w-4 h-4 text-[#3b82f6]" />
                                Official Email <span className="text-red-500">*</span>
                            </label>
                            <input 
                                id="email" 
                                type="email" 
                                placeholder="hello@xyz.com" 
                                className="w-full bg-white/50 backdrop-blur-sm border border-white/50 rounded-xl px-3 py-3 focus:outline-none focus:ring-2 focus:ring-[#93c5fd] focus:border-transparent transition-all duration-200" 
                                value={formData.email} 
                                onChange={(e) => handleChange('email', e.target.value)} 
                                required 
                            />
                        </div>

                        <div>
                            <label htmlFor="mobile" className="block text-gray-700 font-medium mb-2 flex items-center gap-2">
                                <Phone className="w-4 h-4 text-[#3b82f6]" />
                                Official Mobile <span className="text-red-500">*</span>
                            </label>
                            <input 
                                id="mobile" 
                                type="tel" 
                                placeholder="1234567890" 
                                className="w-full bg-white/50 backdrop-blur-sm border border-white/50 rounded-xl px-3 py-3 focus:outline-none focus:ring-2 focus:ring-[#93c5fd] focus:border-transparent transition-all duration-200" 
                                value={formData.mobile} 
                                onChange={(e) => handleChange('mobile', e.target.value)} 
                                required 
                            />
                        </div>

                        <div>
                            <label htmlFor="linkedinProfile" className="block text-gray-700 font-medium mb-2 flex items-center gap-2">
                                <Linkedin className="w-4 h-4 text-[#3b82f6]" />
                                LinkedIn Profile
                            </label>
                            <input 
                                id="linkedinProfile" 
                                type="url" 
                                placeholder="https://linkedin.com/in/username" 
                                className="w-full bg-white/50 backdrop-blur-sm border border-white/50 rounded-xl px-3 py-3 focus:outline-none focus:ring-2 focus:ring-[#93c5fd] focus:border-transparent transition-all duration-200" 
                                value={formData.linkedinProfile} 
                                onChange={(e) => handleChange('linkedinProfile', e.target.value)} 
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
                                    className="w-full bg-white/50 backdrop-blur-sm border border-white/50 rounded-xl px-3 py-3 focus:outline-none focus:ring-2 focus:ring-[#93c5fd] focus:border-transparent appearance-none transition-all duration-200" 
                                    value={formData.minStudentsToBePlaced} 
                                    onChange={(e) => handleChange('minStudentsToBePlaced', e.target.value)} 
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
                            <button 
                                type="button"
                                onClick={onBackClick}
                                className="flex items-center gap-2 text-[#3b82f6] hover:text-[#1d4ed8] font-medium transition-colors duration-200 group"
                            >
                                <ArrowLeft className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform duration-200" />
                                Back to Home
                            </button>
                            <button 
                                type="submit"
                                className="group flex items-center gap-3 px-8 py-3 bg-gradient-to-r from-[#93c5fd] to-[#3b82f6] text-white rounded-xl hover:shadow-lg hover:shadow-[#93c5fd]/40 transition-all duration-200 text-base font-medium"
                            >
                                <Send className="w-5 h-5" />
                                Register
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