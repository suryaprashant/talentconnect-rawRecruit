import { useState, useRef, useEffect, useMemo } from 'react';
import axios from 'axios';
import { ChevronDown, X, Calendar, Clock, Users, Target, GraduationCap, Building, DollarSign, IndianRupee, Euro, List, MapPin, User, Mail, Phone, Linkedin, ArrowLeft, Send, CheckSquare, Briefcase, MessageSquare, Trash2, Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import CreatableSelect from 'react-select/creatable';
import { City } from 'country-state-city';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

export default function RegisterPage({ onBackClick }) {
    const degreeStreamMapping = {
        'B.Tech': ['Computer Science', 'Mechanical', 'Civil', 'Electrical', 'Electronics', 'Bio-medical', 'Information Technology', 'Chemical Engineering', 'Biotechnology', 'Aerospace Engineering'],
        'B.E': ['Computer Science', 'Mechanical Engineering', 'Civil Engineering', 'Electrical Engineering', 'Electronics & Communication', 'Information Technology', 'Chemical Engineering', 'Biotechnology', 'Aerospace Engineering'],
        'M.Tech': ['Computer Science', 'Data Science', 'AI & Machine Learning', 'Cyber Security', 'VLSI Design', 'Structural Engineering'],
        'B.Sc': ['Computer Science', 'Mathematics', 'Physics', 'Chemistry', 'Statistics', 'Biology'],
        'M.Sc': ['Computer Science', 'Data Science', 'Mathematics', 'Physics', 'Chemistry', 'Statistics', 'Biology'],
        'MBA': ['Marketing', 'Finance', 'Human Resources', 'Operations Management', 'IT & Systems', 'International Business'],
        'BBA': ['Marketing', 'Finance', 'Human Resources', 'Operations Management'],
        'B.Com': ['Accounting', 'Finance', 'Taxation', 'Economics', 'Marketing'],
        'M.Com': ['Accounting', 'Finance', 'Taxation', 'International Business'],
        'B.A': ['History', 'Political Science', 'Sociology', 'English Literature', 'Economics', 'Psychology'],
        'M.A': ['History', 'Political Science', 'Sociology', 'English Literature', 'Economics', 'Psychology'],
        'PhD': ['All Specializations'],
        'Postgraduate Diploma': ['Varies by Specialization'],
    };

    const degreeOptions = Object.keys(degreeStreamMapping).sort();
    
    const designationOptions = ['Professor', 'HOD', 'Placement Officer', 'Dean', 'Coordinator'];
    const amenitiesOptions = ['Auditorium', 'Seminar Hall', 'Interview Rooms', 'Computer Labs', 'Wi-Fi Access', 'Projector', 'Parking', 'Refreshments'];
    const minStudentsOptions = ['1-10', '11-25', '26-50', '51-100', '101-200', '200+'];
    const companyTypeOptions = ["MNC", "Startup", "SME", "Public Sector"];
    const proposedModeOptions = ["Online", "Offline", "Hybrid"];
    
    // Add branch options
    const branchOptions = [
        'Computer Science',
        'Information Technology',
        'Electronics & Communication',
        'Electrical Engineering',
        'Mechanical Engineering',
        'Civil Engineering',
        'Chemical Engineering',
        'Biotechnology',
        'Aerospace Engineering',
        'Bio-medical',
        'Mathematics',
        'Physics',
        'Chemistry',
        'Statistics',
        'Biology',
        'All Branches'
    ];

    // Update initialFormState to include branch in rounds
    const initialFormState = {
        degree: [],
        stream: [],
        lookingFor: ['job'],
        employmentType: ['Full-time'],
        salaryRange: 'INR',
        salaryValue: '',
        tentativeStartDate: '',
        tentativeEndDate: '',
        rounds: Array.from({ length: 3 }, (_, i) => ({ 
            id: i + 1, 
            branch: '', 
            students: '', 
            skills: '' 
        })),
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
    const [errors, setErrors] = useState({});
    const [alert, setAlert] = useState({ show: false, message: '', type: '' });
    const [descriptionError, setDescriptionError] = useState("");

    const [dropdownOpen, setDropdownOpen] = useState({ 
        amenities: false, 
        companyType: false,
        degree: false,
        stream: false
    });
    
    const [customAmenity, setCustomAmenity] = useState('');
    const [customDegree, setCustomDegree] = useState('');
    const [customCompanyType, setCustomCompanyType] = useState('');
    const [customStream, setCustomStream] = useState('');

    const amenitiesRef = useRef(null);
    const companyTypeRef = useRef(null);
    const degreeRef = useRef(null);
    const streamRef = useRef(null);

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
            if (streamRef.current && !streamRef.current.contains(event.target)) {
                setDropdownOpen(prev => ({ ...prev, stream: false }));
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => { document.removeEventListener('mousedown', handleClickOutside); };
    }, []);

    useEffect(() => {
        setFormData(prev => ({ ...prev, stream: [] }));
    }, [formData.degree]);

    const validateProposedSchedule = () => {
        const newErrors = {};
        const { startDate, endDate, preferredMode } = formData.proposedSchedule;

        if (!startDate.trim()) {
            newErrors.proposedStartDate = 'Please select proposed start date';
        }

        if (!endDate.trim()) {
            newErrors.proposedEndDate = 'Please select proposed end date';
        }

        if (!preferredMode.trim()) {
            newErrors.proposedMode = 'Please select preferred mode';
        }

        if (startDate && endDate) {
            const start = new Date(startDate);
            const end = new Date(endDate);
            if (end <= start) {
                newErrors.proposedEndDate = 'End date must be after start date';
            }
        }

        return newErrors;
    };

    const handleChange = (field, value) => {
        setFormData({ ...formData, [field]: value });
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
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

    const handleMultiToggle = (field, value) => {
        const currentValues = formData[field];
        const newValues = currentValues.includes(value)
            ? currentValues.filter(item => item !== value)
            : [...currentValues, value];
        setFormData({ ...formData, [field]: newValues });
    };

    // Updated handleRoundChange to handle branch field
    const handleRoundChange = (id, field, value) => {
        const updatedRounds = formData.rounds.map(round =>
            round.id === id ? { ...round, [field]: value } : round
        );
        setFormData({ ...formData, rounds: updatedRounds });
    };

    // Function to add a new round
    const addRound = () => {
        const newId = formData.rounds.length > 0 ? Math.max(...formData.rounds.map(r => r.id)) + 1 : 1;
        setFormData(prev => ({
            ...prev,
            rounds: [...prev.rounds, { id: newId, branch: '', students: '', skills: '' }]
        }));
    };

    // Function to remove a round
    const removeRound = (roundId) => {
        if (formData.rounds.length > 1) {
            setFormData(prev => ({
                ...prev,
                rounds: prev.rounds.filter(round => round.id !== roundId)
            }));
        }
    };

    const handleCustomAdd = (field, value, setValue, predefinedOptions = []) => {
        if (value.trim() && !formData[field].includes(value.trim()) && 
            !predefinedOptions.map(opt => opt.toLowerCase()).includes(value.trim().toLowerCase())) {
            setFormData(prev => ({ ...prev, [field]: [...prev[field], value.trim()] }));
        }
        setValue('');
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
        let formValid = true;
        const newErrors = {};

        if (!formData.degree.length) {
            newErrors.degree = 'Please select at least one degree';
            formValid = false;
        }

        if (!formData.collegeLocation) {
            newErrors.collegeLocation = 'Please select college location';
            formValid = false;
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Please enter official email';
            formValid = false;
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
            formValid = false;
        }

        if (!formData.mobile.trim()) {
            newErrors.mobile = 'Please enter official mobile number';
            formValid = false;
        } else if (!/^\d{10}$/.test(formData.mobile)) {
            newErrors.mobile = 'Please enter a valid 10-digit mobile number';
            formValid = false;
        }

        if (!formData.coordinatorDesignation.trim()) {
            newErrors.coordinatorDesignation = 'Please select coordinator designation';
            formValid = false;
        }

        if (!formData.minStudentsToBePlaced.trim()) {
            newErrors.minStudentsToBePlaced = 'Please select minimum students to be placed';
            formValid = false;
        }

        if (formData.description.length > 500) {
            setDescriptionError("Description cannot exceed 500 characters.");
            formValid = false;
        }

        const proposedScheduleErrors = validateProposedSchedule();
        if (Object.keys(proposedScheduleErrors).length > 0) {
            Object.assign(newErrors, proposedScheduleErrors);
            formValid = false;
        }

        setErrors(newErrors);
        return formValid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            showAlert('Please fill all required fields correctly', 'error');
            return;
        }

        let aggregatedSkills = [];
        let studentStreams = formData.stream;
        let roundNames = [];
        let studentCounts = [];

        const nonEmptyRounds = formData.rounds.filter(round => round.students || round.skills || round.branch);
        nonEmptyRounds.forEach(round => {
            if (round.skills) aggregatedSkills = [...new Set([...aggregatedSkills, ...round.skills.split(',').map(s => s.trim()).filter(Boolean)])];
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

    const toggleDropdown = (dropdown) => {
        setDropdownOpen(prev => ({
            ...Object.keys(prev).reduce((acc, key) => ({ ...acc, [key]: false }), {}),
            [dropdown]: !prev[dropdown]
        }));
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

    // Calculate total students across all rounds
    const totalStudents = formData.rounds.reduce((sum, round) => {
        return sum + (parseInt(round.students) || 0);
    }, 0);

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
                            Revolutionizing Campus Recruitment
                        </h1>
                        <p className="text-gray-600 text-sm max-w-2xl mx-auto">
                            Our platform connects colleges with skilled employers, offering tools for targeted training and data-driven insights to refine recruitment strategies.
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
                        Register for Campus Placement
                    </h2>
                    <p className="text-gray-600 mb-6 text-center text-sm">
                        Please fill out the form below to register your college for campus placements.
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Row 1: Degree and Stream */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Degree */}
                            <div ref={degreeRef} className="relative">
                                <label className="block text-gray-700 font-medium mb-2 text-sm flex items-center gap-1.5">
                                    <GraduationCap className="w-4 h-4 text-[#3b82f6]" />
                                    Degree <span className="text-red-500">*</span>
                                </label>
                                <div className="flex flex-wrap gap-1 mb-1 max-h-16 overflow-y-auto">
                                    {formData.degree.map(degree => (
                                        <div key={degree} className="flex items-center bg-gradient-to-r from-[#93c5fd]/20 to-[#3b82f6]/20 text-[#3b82f6] text-xs font-semibold px-2 py-0.5 rounded-full">
                                            <span>{degree}</span>
                                            <button type="button" onClick={() => removeItem('degree', degree)} className="ml-1 hover:bg-[#3b82f6]/20 rounded-full p-0.5">
                                                <X size={10} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                                <div
                                    className="flex items-center justify-between p-2.5 w-full bg-white/50 backdrop-blur-sm border border-white/50 rounded-lg cursor-pointer hover:border-[#93c5fd] transition-all duration-200 min-h-[42px]"
                                    onClick={() => toggleDropdown('degree')}
                                >
                                    <span className="text-sm text-gray-500">Select degree(s)</span>
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
                                                value={customDegree}
                                                onChange={(e) => setCustomDegree(e.target.value)}
                                                onClick={(e) => e.stopPropagation()}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') {
                                                        e.preventDefault();
                                                        handleCustomAdd('degree', customDegree, setCustomDegree, degreeOptions);
                                                    }
                                                }}
                                                className="w-full bg-white/50 backdrop-blur-sm border border-white/50 rounded px-2 py-1.5 text-sm"
                                            />
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleCustomAdd('degree', customDegree, setCustomDegree, degreeOptions);
                                                }}
                                                className="ml-2 px-3 py-1.5 bg-gradient-to-r from-[#93c5fd] to-[#3b82f6] text-white rounded text-xs font-medium"
                                            >
                                                Add
                                            </button>
                                        </div>
                                        <div className="max-h-40 overflow-auto">
                                            {degreeOptions.map(option => (
                                                <div 
                                                    key={option} 
                                                    onClick={() => handleMultiToggle('degree', option)} 
                                                    className={`px-3 py-2 hover:bg-[#93c5fd]/10 cursor-pointer border-b border-white/50 last:border-b-0 transition-colors duration-200 flex justify-between items-center ${formData.degree.includes(option) ? "bg-[#93c5fd]/10" : ""}`}
                                                >
                                                    <div className="flex items-center">
                                                        <div className={`w-4 h-4 border-2 rounded mr-2 flex items-center justify-center ${formData.degree.includes(option) ? 'bg-[#3b82f6] border-[#3b82f6]' : 'border-gray-300'}`}>
                                                            {formData.degree.includes(option) && (
                                                                <CheckSquare size={10} className="text-white" />
                                                            )}
                                                        </div>
                                                        <span className="text-sm">{option}</span>
                                                    </div>
                                                    {formData.degree.includes(option) && <span className="text-[#3b82f6] text-xs">✓</span>}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Stream */}
                            <div ref={streamRef} className="relative">
                                <label className="block text-gray-700 font-medium mb-2 text-sm flex items-center gap-1.5">
                                    <GraduationCap className="w-4 h-4 text-[#3b82f6]" />
                                    Stream
                                </label>
                                <div className="flex flex-wrap gap-1 mb-1 max-h-16 overflow-y-auto">
                                    {formData.stream.map(stream => (
                                        <div key={stream} className="flex items-center bg-gradient-to-r from-[#93c5fd]/20 to-[#3b82f6]/20 text-[#3b82f6] text-xs font-semibold px-2 py-0.5 rounded-full">
                                            <span>{stream}</span>
                                            <button type="button" onClick={() => removeItem('stream', stream)} className="ml-1 hover:bg-[#3b82f6]/20 rounded-full p-0.5">
                                                <X size={10} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                                <div
                                    className={`flex items-center justify-between p-2.5 w-full bg-white/50 backdrop-blur-sm border rounded-lg cursor-pointer hover:border-[#93c5fd] transition-all duration-200 min-h-[42px] ${!formData.degree.length ? 'border-gray-200 cursor-not-allowed' : 'border-white/50'}`}
                                    onClick={() => formData.degree.length > 0 && toggleDropdown('stream')}
                                >
                                    <span className="text-sm text-gray-500">
                                        {formData.degree.length > 0 ? 'Select stream(s)' : 'Select degree first'}
                                    </span>
                                    <ChevronDown className={`w-4 h-4 text-[#3b82f6] transition-transform ${dropdownOpen.stream ? "rotate-180" : ""}`} />
                                </div>
                                {dropdownOpen.stream && formData.degree.length > 0 && (
                                    <div className="absolute z-20 mt-1 w-full bg-white/90 backdrop-blur-sm border border-white/50 rounded-lg shadow-lg shadow-blue-50/50 overflow-hidden">
                                        <div className="p-2 border-b border-white/50 flex">
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
                                                className="w-full bg-white/50 backdrop-blur-sm border border-white/50 rounded px-2 py-1.5 text-sm"
                                            />
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleCustomAdd('stream', customStream, setCustomStream);
                                                }}
                                                className="ml-2 px-3 py-1.5 bg-gradient-to-r from-[#93c5fd] to-[#3b82f6] text-white rounded text-xs font-medium"
                                            >
                                                Add
                                            </button>
                                        </div>
                                        <div className="max-h-40 overflow-auto">
                                            {availableStreams.length > 0 ? (
                                                availableStreams.map(stream => (
                                                    <div 
                                                        key={stream} 
                                                        onClick={() => handleMultiToggle('stream', stream)} 
                                                        className={`px-3 py-2 hover:bg-[#93c5fd]/10 cursor-pointer border-b border-white/50 last:border-b-0 transition-colors duration-200 flex justify-between items-center ${formData.stream.includes(stream) ? "bg-[#93c5fd]/10" : ""}`}
                                                    >
                                                        <div className="flex items-center">
                                                            <div className={`w-4 h-4 border-2 rounded mr-2 flex items-center justify-center ${formData.stream.includes(stream) ? 'bg-[#3b82f6] border-[#3b82f6]' : 'border-gray-300'}`}>
                                                                {formData.stream.includes(stream) && (
                                                                    <CheckSquare size={10} className="text-white" />
                                                                )}
                                                            </div>
                                                            <span className="text-sm">{stream}</span>
                                                        </div>
                                                        {formData.stream.includes(stream) && <span className="text-[#3b82f6] text-xs">✓</span>}
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="px-3 py-2 text-sm text-gray-500 border-b border-white/50">Add streams manually</div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Row 2: College Location and Coordinator Name */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* College Location */}
                            <div>
                                <label className="block text-gray-700 font-medium mb-2 text-sm flex items-center gap-1.5">
                                    <MapPin className="w-4 h-4 text-[#3b82f6]" />
                                    College Location <span className="text-red-500">*</span>
                                </label>
                                <CreatableSelect
                                    isClearable
                                    options={cityOptions}
                                    value={formData.collegeLocation}
                                    onChange={(selectedOption) => handleChange('collegeLocation', selectedOption)}
                                    placeholder="Select or type city..."
                                    className="text-sm"
                                    styles={{
                                        control: (base, state) => ({
                                            ...base,
                                            backgroundColor: 'rgba(255, 255, 255, 0.5)',
                                            backdropFilter: 'blur(8px)',
                                            borderColor: errors.collegeLocation ? '#fca5a5' : state.isFocused ? '#93c5fd' : 'rgba(255, 255, 255, 0.5)',
                                            minHeight: '42px',
                                            borderRadius: '8px',
                                            fontSize: '14px',
                                            '&:hover': {
                                                borderColor: errors.collegeLocation ? '#fca5a5' : '#93c5fd',
                                            },
                                        }),
                                        menu: (base) => ({
                                            ...base,
                                            fontSize: '14px',
                                        }),
                                    }}
                                />
                                {errors.collegeLocation && (
                                    <p className="mt-1 text-xs text-red-600">{errors.collegeLocation}</p>
                                )}
                            </div>

                            {/* Coordinator Name */}
                            <div>
                                <label className="block text-gray-700 font-medium mb-2 text-sm flex items-center gap-1.5">
                                    <User className="w-4 h-4 text-[#3b82f6]" />
                                    Coordinator Name
                                </label>
                                <input 
                                    type="text" 
                                    placeholder="Enter name" 
                                    className="w-full bg-white/50 backdrop-blur-sm border border-white/50 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#93c5fd] focus:border-transparent" 
                                    value={formData.coordinatorName} 
                                    onChange={(e) => handleChange('coordinatorName', e.target.value)} 
                                />
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

                        {/* Row 4: Looking For and Employment Type */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-gray-700 font-medium mb-2 text-sm flex items-center gap-1.5">
                                    <Target className="w-4 h-4 text-[#3b82f6]" />
                                    Looking For
                                </label>
                                <div className="flex gap-2">
                                    {['job', 'internship'].map((type) => (
                                        <button 
                                            key={type} 
                                            type="button" 
                                            className={`px-3 py-2 rounded-lg border text-sm transition-all duration-200 font-medium flex-1 capitalize ${
                                                formData.lookingFor.includes(type) 
                                                    ? 'bg-gradient-to-r from-[#93c5fd] to-[#3b82f6] text-white border-transparent' 
                                                    : 'bg-white/50 backdrop-blur-sm border-white/50 text-gray-700 hover:bg-white/70'
                                            }`} 
                                            onClick={() => handleMultiToggle('lookingFor', type)}
                                        >
                                            {type}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-gray-700 font-medium mb-2 text-sm flex items-center gap-1.5">
                                    <Briefcase className="w-4 h-4 text-[#3b82f6]" />
                                    Employment Type
                                </label>
                                <div className="flex gap-2">
                                    {['Full-time', 'Part-time', 'Contract'].map((type) => (
                                        <button 
                                            key={type} 
                                            type="button" 
                                            className={`px-3 py-2 rounded-lg border text-sm transition-all duration-200 font-medium flex-1 ${
                                                formData.employmentType.includes(type) 
                                                    ? 'bg-gradient-to-r from-[#93c5fd] to-[#3b82f6] text-white border-transparent' 
                                                    : 'bg-white/50 backdrop-blur-sm border-white/50 text-gray-700 hover:bg-white/70'
                                            }`} 
                                            onClick={() => handleMultiToggle('employmentType', type)}
                                        >
                                            {type}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Row 5: Salary and Company Type */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div>
        <label className="block text-gray-700 font-medium mb-2 text-sm flex items-center gap-1.5">
            <DollarSign className="w-4 h-4 text-[#3b82f6]" />
            Minimum Salary
        </label>
        <div className="flex rounded-lg overflow-hidden border border-gray-200/80 focus-within:ring-2 focus-within:ring-[#93c5fd] focus-within:border-transparent transition-all duration-200">
            <div className="relative bg-white/50 backdrop-blur-sm flex items-center">
                <div className="px-3 py-2 w-24 text-sm flex items-center gap-2">
                    {formData.salaryRange === 'INR' || !formData.salaryRange ? (
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
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    value={formData.salaryRange || 'INR'} 
                    onChange={(e) => handleChange('salaryRange', e.target.value)}
                >
                    <option value="INR">INR</option>
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                </select>
                <ChevronDown className="absolute right-2 w-3 h-3 text-gray-400 pointer-events-none" />
            </div>
            <div className="relative flex-1">
                <input 
                    type="number" 
                    className="bg-white/50 backdrop-blur-sm w-full px-3 py-2 text-sm focus:outline-none" 
                    placeholder="Amount" 
                    value={formData.salaryValue || ''} 
                    onChange={(e) => handleChange('salaryValue', e.target.value)}
                    min="0"
                    step="1000"
                />
                {/* Currency icon in input field */}
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    {formData.salaryRange === 'INR' || !formData.salaryRange ? (
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
                                                    value={customCompanyType}
                                                    onChange={(e) => setCustomCompanyType(e.target.value)}
                                                    onClick={(e) => e.stopPropagation()}
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter') {
                                                            e.preventDefault();
                                                            handleCustomAdd('companyType', customCompanyType, setCustomCompanyType, companyTypeOptions);
                                                        }
                                                    }}
                                                    className="w-full bg-white/50 backdrop-blur-sm border border-white/50 rounded px-2 py-1.5 text-sm"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleCustomAdd('companyType', customCompanyType, setCustomCompanyType, companyTypeOptions);
                                                    }}
                                                    className="ml-2 px-3 py-1.5 bg-gradient-to-r from-[#93c5fd] to-[#3b82f6] text-white rounded text-xs font-medium"
                                                >
                                                    Add
                                                </button>
                                            </div>
                                            <div className="max-h-40 overflow-auto">
                                                {companyTypeOptions.map(opt => (
                                                    <div 
                                                        key={opt} 
                                                        onClick={() => handleMultiToggle('companyType', opt)} 
                                                        className={`px-3 py-2 hover:bg-[#93c5fd]/10 cursor-pointer border-b border-white/50 last:border-b-0 transition-colors duration-200 flex justify-between items-center ${formData.companyType.includes(opt) ? "bg-[#93c5fd]/10" : ""}`} 
                                                    >
                                                        <div className="flex items-center">
                                                            <div className={`w-4 h-4 border-2 rounded mr-2 flex items-center justify-center ${formData.companyType.includes(opt) ? 'bg-[#3b82f6] border-[#3b82f6]' : 'border-gray-300'}`}>
                                                                {formData.companyType.includes(opt) && (
                                                                    <CheckSquare size={10} className="text-white" />
                                                                )}
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

                        {/* Row 6: Coordinator Designation and Email */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* <div>
                                <label className="block text-gray-700 font-medium mb-2 text-sm flex items-center gap-1.5">
                                    <User className="w-4 h-4 text-[#3b82f6]" />
                                    Designation <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <select 
                                        className={`w-full bg-white/50 backdrop-blur-sm border ${errors.coordinatorDesignation ? 'border-red-300' : 'border-white/50'} rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#93c5fd] focus:border-transparent`} 
                                        value={formData.coordinatorDesignation} 
                                        onChange={(e) => handleChange('coordinatorDesignation', e.target.value)} 
                                    >
                                        <option value="">Select Designation</option>
                                        {designationOptions.map(option => (
                                            <option key={option} value={option}>{option}</option>
                                        ))}
                                    </select>
                                    {errors.coordinatorDesignation && (
                                        <p className="mt-1 text-xs text-red-600">{errors.coordinatorDesignation}</p>
                                    )}
                                </div>
                            </div> */}

                            <div>
                                <label className="block text-gray-700 font-medium mb-2 text-sm flex items-center gap-1.5">
                                    <Mail className="w-4 h-4 text-[#3b82f6]" />
                                    Email <span className="text-red-500">*</span>
                                </label>
                                <input 
                                    type="email" 
                                    placeholder="official@college.edu" 
                                    className={`w-full bg-white/50 backdrop-blur-sm border ${errors.email ? 'border-red-300' : 'border-white/50'} rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#93c5fd] focus:border-transparent`} 
                                    value={formData.email} 
                                    onChange={(e) => handleChange('email', e.target.value)} 
                                />
                                {errors.email && (
                                    <p className="mt-1 text-xs text-red-600">{errors.email}</p>
                                )}
                            </div>
                        </div>

                        {/* Row 7: Mobile and LinkedIn Profile */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-gray-700 font-medium mb-2 text-sm flex items-center gap-1.5">
                                    <Phone className="w-4 h-4 text-[#3b82f6]" />
                                    Mobile <span className="text-red-500">*</span>
                                </label>
                                <input 
                                    type="tel" 
                                    placeholder="10-digit number" 
                                    className={`w-full bg-white/50 backdrop-blur-sm border ${errors.mobile ? 'border-red-300' : 'border-white/50'} rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#93c5fd] focus:border-transparent`} 
                                    value={formData.mobile} 
                                    onChange={(e) => handleChange('mobile', e.target.value)} 
                                />
                                {errors.mobile && (
                                    <p className="mt-1 text-xs text-red-600">{errors.mobile}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-gray-700 font-medium mb-2 text-sm flex items-center gap-1.5">
                                    <Linkedin className="w-4 h-4 text-[#3b82f6]" />
                                    LinkedIn Profile
                                </label>
                                <input 
                                    type="url" 
                                    placeholder="linkedin.com/in/username" 
                                    className="w-full bg-white/50 backdrop-blur-sm border border-white/50 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#93c5fd] focus:border-transparent" 
                                    value={formData.linkedinProfile} 
                                    onChange={(e) => handleChange('linkedinProfile', e.target.value)} 
                                />
                            </div>
                        </div>

                        {/* Row 8: Minimum Students and Application Dates */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-gray-700 font-medium mb-2 text-sm flex items-center gap-1.5">
                                    <Users className="w-4 h-4 text-[#3b82f6]" />
                                    Min Students to Place <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <select 
                                        className={`w-full bg-white/50 backdrop-blur-sm border ${errors.minStudentsToBePlaced ? 'border-red-300' : 'border-white/50'} rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#93c5fd] focus:border-transparent`} 
                                        value={formData.minStudentsToBePlaced} 
                                        onChange={(e) => handleChange('minStudentsToBePlaced', e.target.value)} 
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
                        </div>

                        {/* Row 9: Rounds Table - Full Width */}
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label className="block text-gray-700 font-medium text-sm flex items-center gap-1.5">
                                    <List className="w-4 h-4 text-[#3b82f6]" />
                                    Student Details
                                </label>
                                <button
                                    type="button"
                                    onClick={addRound}
                                    className="flex items-center gap-1.5 text-xs bg-gradient-to-r from-[#93c5fd] to-[#3b82f6] text-white px-2.5 py-1.5 rounded hover:shadow-lg hover:shadow-[#93c5fd]/40 transition-all duration-200"
                                >
                                    <Plus size={12} />
                                    Add Student
                                </button>
                            </div>
                            
                            <div className="overflow-x-auto mb-3">
                                <table className="min-w-full divide-y divide-white/50 text-xs">
                                    <thead className="bg-white/50">
                                        <tr>
                                            <th className="px-2 py-1.5 text-left font-medium text-gray-500">Student</th>
                                            <th className="px-2 py-1.5 text-left font-medium text-gray-500">Branch</th>
                                            <th className="px-2 py-1.5 text-left font-medium text-gray-500">Count</th>
                                            <th className="px-2 py-1.5 text-left font-medium text-gray-500">Skills (comma separated)</th>
                                            {/* <th className="px-2 py-1.5 text-left font-medium text-gray-500">Actions</th> */}
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white/30 divide-y divide-white/50">
                                        {formData.rounds.map((round) => (
                                            <tr key={round.id}>
                                                <td className="px-2 py-1.5">#{round.id}</td>
                                                <td className="px-2 py-1.5">
                                                    <select 
                                                        className="w-full bg-white/50 backdrop-blur-sm border border-white/50 rounded px-1.5 py-1 text-xs" 
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
                                                        className="w-full bg-white/50 backdrop-blur-sm border border-white/50 rounded px-1.5 py-1 text-xs" 
                                                        value={round.students} 
                                                        onChange={(e) => handleRoundChange(round.id, 'students', e.target.value)} 
                                                        min="0" 
                                                    />
                                                </td>
                                                <td className="px-2 py-1.5">
                                                    <input 
                                                        type="text" 
                                                        className="w-full bg-white/50 backdrop-blur-sm border border-white/50 rounded px-1.5 py-1 text-xs" 
                                                        value={round.skills} 
                                                        onChange={(e) => handleRoundChange(round.id, 'skills', e.target.value)} 
                                                        placeholder="e.g., Java, Python, React" 
                                                    />
                                                </td>
                                                {/* <td className="px-2 py-1.5">
                                                    {formData.rounds.length > 1 && (
                                                        <button
                                                            type="button"
                                                            onClick={() => removeRound(round.id)}
                                                            className="text-red-500 hover:text-red-700 flex items-center gap-1 text-xs"
                                                        >
                                                            <Trash2 size={12} />
                                                            Remove
                                                        </button>
                                                    )}
                                                </td> */}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            
                            {/* Summary section */}
                            <div className="mt-2 p-2 bg-gradient-to-r from-[#93c5fd]/10 to-[#3b82f6]/10 border border-[#93c5fd]/20 rounded text-xs">
                                <div className="flex items-center justify-between">
                                    <span className="font-medium text-[#3b82f6]">Total Students:</span>
                                    <span className="font-bold text-[#3b82f6]">{totalStudents}</span>
                                </div>
                            </div>
                        </div>

                        {/* Row 10: Amenities and Description */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                                                    <div 
                                                        key={opt} 
                                                        className={`px-3 py-2 hover:bg-[#93c5fd]/10 cursor-pointer border-b border-white/50 last:border-b-0 transition-colors duration-200 flex justify-between items-center ${formData.amenities.includes(opt) ? "bg-[#93c5fd]/10" : ""}`} 
                                                        onClick={() => handleMultiToggle('amenities', opt)}
                                                    >
                                                        <div className="flex items-center">
                                                            <div className={`w-4 h-4 border-2 rounded mr-2 flex items-center justify-center ${formData.amenities.includes(opt) ? 'bg-[#3b82f6] border-[#3b82f6]' : 'border-gray-300'}`}>
                                                                {formData.amenities.includes(opt) && (
                                                                    <CheckSquare size={10} className="text-white" />
                                                                )}
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
                                                    onKeyDown={(e) => { 
                                                        if (e.key === 'Enter') { 
                                                            e.preventDefault(); 
                                                            handleCustomAdd('amenities', customAmenity, setCustomAmenity); 
                                                        } 
                                                    }} 
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label className="block text-gray-700 font-medium mb-2 text-sm flex items-center gap-1.5">
                                    <MessageSquare className="w-4 h-4 text-[#3b82f6]" />
                                    Description
                                </label>
                                <textarea 
                                    className="w-full bg-white/50 backdrop-blur-sm border border-white/50 rounded-lg px-2.5 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#93c5fd] focus:border-transparent resize-none" 
                                    placeholder="Additional information..." 
                                    value={formData.description} 
                                    onChange={(e) => {
                                        handleChange('description', e.target.value);
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
                            <button 
                                type="button"
                                onClick={onBackClick}
                                className="flex items-center gap-1.5 text-gray-600 hover:text-gray-800 font-medium transition-colors duration-200 text-sm"
                            >
                                <ArrowLeft className="w-3.5 h-3.5" />
                                Back
                            </button>
                            <button 
                                type="submit"
                                className="group flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#93c5fd] to-[#3b82f6] text-white rounded-lg hover:shadow-lg hover:shadow-[#93c5fd]/40 transition-all duration-200 text-sm font-medium"
                            >
                                <Send className="w-4 h-4" />
                                Register OnCampus
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}