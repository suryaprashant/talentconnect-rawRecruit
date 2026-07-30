import { useState, useRef, useEffect, useMemo } from 'react';
import axios from '../../../../lib/axiosInstance';
import { ChevronDown, X, Calendar, Clock, Users, Target, GraduationCap, Building, DollarSign, IndianRupee, Euro, List, MapPin, User, Mail, Phone, Linkedin, ArrowLeft, Send, CheckSquare, Briefcase, MessageSquare, Trash2, Plus, BookOpen, Users as UsersIcon, FileText, Globe, Home } from 'lucide-react';
import toast from 'react-hot-toast';
import CreatableSelect from 'react-select/creatable';
import { City } from 'country-state-city';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { getMasterDataByType, createMasterData } from "../../../../lib/User_AxiosInstance";
import { getCompanyMasterDataByType, createCompanyMasterData } from "../../../../lib/Company_AxiosInstance";
import {
    createCollegeMasterData,
    getCollegeMasterDataByType
} from "@/lib/College_AxiosIntance";

export default function RegisterPage({ onBackClick }) {

    // ─── Static config (unchanged) ────────────────────────────────────────────
    // const designationOptions  = ['Professor', 'HOD', 'Placement Officer', 'Dean', 'Coordinator'];
    const [designationOptions, setDesignationOptions] = useState([]);
    const [isLoadingDesignation, setIsLoadingDesignation] = useState(false);
    const amenitiesOptions = ['Auditorium', 'Seminar Hall', 'Interview Rooms', 'Computer Labs', 'Wi-Fi Access', 'Projector', 'Parking', 'Refreshments'];
    const minStudentsOptions = ['1-10', '11-25', '26-50', '51-100', '101-200', '200+'];
    const proposedModeOptions = ["Online", "Offline", "Hybrid"];

    // ─── Initial form state ────────────────────────────────────────────────────
    // degree / stream now store { value: _id, label: name } objects
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
            degree: '',
            stream: '',
            students: '',
            skills: '',
            _auto: false,
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

    const [formData, setFormData] = useState(() => {
        const savedData = localStorage.getItem('pendingRegistration');
        if (savedData) {
            try { return JSON.parse(savedData); }
            catch (e) { return initialFormState; }
        }
        return initialFormState;
    });

    // ─── UI State ──────────────────────────────────────────────────────────────
    const [errors, setErrors] = useState({});
    const [alert, setAlert] = useState({ show: false, message: '', type: '' });
    const [descriptionError, setDescriptionError] = useState("");

    const [dropdownOpen, setDropdownOpen] = useState({
        amenities: false,
    });

    const [customAmenity, setCustomAmenity] = useState('');

    // ─── Dynamic degree / stream API state ────────────────────────────────────
    const [degreeOptions, setDegreeOptions] = useState([]);
    const [streamOptions, setStreamOptions] = useState([]);
    const [selectedDegreeIds, setSelectedDegreeIds] = useState([]);
    const [isLoadingDegrees, setIsLoadingDegrees] = useState(false);
    const [isLoadingStreams, setIsLoadingStreams] = useState(false);

    // ─── Dynamic company type API state ───────────────────────────────────────
    const [companyTypeOptions, setCompanyTypeOptions] = useState([]);
    const [isLoadingCompanyTypes, setIsLoadingCompanyTypes] = useState(false);

    // ─── Refs ──────────────────────────────────────────────────────────────────
    const amenitiesRef = useRef(null);

    // ─── City options ──────────────────────────────────────────────────────────
    const cityOptions = useMemo(() =>
        City.getCitiesOfCountry('IN').map(city => ({
            value: city.name,
            label: city.name,
        })),
        []);

    // ─── Persist form + click-outside for custom dropdowns ────────────────────
    useEffect(() => {
        const fetchDesignations = async () => {
            setIsLoadingDesignation(true);
            try {
                const res = await getCollegeMasterDataByType("COLLEGE_DESIGNATION");

                const formatted = (res?.data?.data || []).map(item => ({
                    value: item.value,
                    label: item.value,
                }));

                setDesignationOptions(formatted);
            } catch (err) {
                console.error("Error fetching designations", err);
            } finally {
                setIsLoadingDesignation(false);
            }
        };

        fetchDesignations();
    }, []);

    useEffect(() => {
        localStorage.setItem('pendingRegistration', JSON.stringify(formData));
        const handleClickOutside = (event) => {
            if (amenitiesRef.current && !amenitiesRef.current.contains(event.target)) {
                setDropdownOpen(prev => ({ ...prev, amenities: false }));
            }
            if (companyTypeRef.current && !companyTypeRef.current.contains(event.target)) {
                setDropdownOpen(prev => ({ ...prev, companyType: false }));
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => { document.removeEventListener('mousedown', handleClickOutside); };
    }, [formData]);

    // ─── Fetch company types on mount ─────────────────────────────────────────
    useEffect(() => {
        const fetchCompanyTypes = async () => {
            setIsLoadingCompanyTypes(true);
            try {
                const res = await getCompanyMasterDataByType('COMPANY_TYPE');
                setCompanyTypeOptions(
                    (res?.data?.data || []).map(item => ({ value: item.value, label: item.value }))
                );
            } catch (err) {
                console.error("Error fetching company types", err);
            } finally {
                setIsLoadingCompanyTypes(false);
            }
        };
        fetchCompanyTypes();
    }, []);

    // ─── Fetch degrees on mount ────────────────────────────────────────────────
    useEffect(() => {
        const fetchDegrees = async () => {
            setIsLoadingDegrees(true);
            try {
                const res = await getMasterDataByType("DEGREE");
                setDegreeOptions(
                    res.data.data.map((item) => ({
                        value: item._id,
                        label: item.value,
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

    // ─── Fetch streams whenever selected degrees change ────────────────────────
    useEffect(() => {
        if (selectedDegreeIds.length === 0) {
            setStreamOptions([]);
            return;
        }
        const fetchStreams = async () => {
            setIsLoadingStreams(true);
            try {
                // Fetch streams for all selected degrees and merge (no duplicates)
                const results = await Promise.all(
                    selectedDegreeIds.map((id) => getMasterDataByType("STREAM", id))
                );
                const merged = new Map();
                results.forEach((res) => {
                    res.data.data.forEach((item) => {
                        merged.set(item._id, { value: item._id, label: item.value });
                    });
                });
                setStreamOptions([...merged.values()]);
            } catch (err) {
                console.error("Error fetching streams", err);
            } finally {
                setIsLoadingStreams(false);
            }
        };
        fetchStreams();
    }, [selectedDegreeIds]);


    //    useEffect(() => {
    //     const combinations = [];

    //     formData.degree.forEach((deg) => {
    //         formData.stream.forEach((str) => {
    //             combinations.push({
    //                 degree: deg.label,
    //                 stream: str.label,
    //             });
    //         });
    //     });

    //     setFormData(prev => {
    //         const manualRows = prev.rounds.filter(r => !r._auto);

    //         let nextId = Math.max(0, ...prev.rounds.map(r => r.id)) + 1;
    //         const autoRows = combinations.map((c, i) => ({
    //             id: nextId + i,
    //             degree: c.degree,
    //             stream: c.stream,
    //             students: '',
    //             skills: '',
    //             _auto: true,
    //         }));

    //         return {
    //             ...prev,
    //             rounds: [...autoRows, ...manualRows],
    //         };
    //     });

    // }, [formData.degree, formData.stream]);

    // ─── Helpers ───────────────────────────────────────────────────────────────

    useEffect(() => {
        setFormData(prev => {
            const combinations = [];

            prev.degree.forEach((deg) => {
                prev.stream.forEach((str) => {
                    combinations.push({
                        degree: deg.label,
                        stream: str.label,
                    });
                });
            });

            if (prev.stream.length === 0) return prev; // ← ADD THIS
            let rows = [...prev.rounds];

            // 1. Remove auto rows whose combination no longer exists
            rows = rows.map(r => {
                if (!r._auto) return r; // keep manual rows as-is
                const stillExists = combinations.some(
                    c => c.degree === r.degree && c.stream === r.stream
                );
                if (stillExists) return r;
                // Reset this slot back to blank instead of removing
                return {
                    ...r,
                    degree: '',
                    stream: '',
                    _auto: false,
                };
            });

            // 2. Fill combinations into empty slots
            combinations.forEach((c) => {
                const alreadyExists = rows.some(
                    r => r.degree === c.degree && r.stream === c.stream
                );
                if (alreadyExists) return;

                const emptyIndex = rows.findIndex(r => !r.degree);

                if (emptyIndex !== -1) {
                    rows[emptyIndex] = {
                        ...rows[emptyIndex],
                        degree: c.degree,
                        stream: c.stream,
                        _auto: true,
                    };
                } else {
                    const newId = Math.max(...rows.map(r => r.id)) + 1;
                    rows.push({
                        id: newId,
                        degree: c.degree,
                        stream: c.stream,
                        students: '',
                        skills: '',
                        _auto: true,
                    });
                }
            });

            return { ...prev, rounds: rows };
        });

    }, [formData.degree, formData.stream]);

    const validateProposedSchedule = () => {
        const newErrors = {};
        const { startDate, endDate, preferredMode } = formData.proposedSchedule;
        if (!startDate.trim()) newErrors.proposedStartDate = 'Please select proposed start date';
        if (!endDate.trim()) newErrors.proposedEndDate = 'Please select proposed end date';
        if (!preferredMode.trim()) newErrors.proposedMode = 'Please select preferred mode';
        if (startDate && endDate) {
            const start = new Date(startDate);
            const end = new Date(endDate);
            if (end <= start) newErrors.proposedEndDate = 'End date must be after start date';
        }
        return newErrors;
    };

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
    };

    const formatDateLocal = (date) => {
        if (!date) return '';
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const handleDateChange = (date, field) => {
        setFormData(prev => ({ ...prev, [field]: formatDateLocal(date) }));
    };

    const handleProposedDateChange = (date, field) => {
        setFormData(prev => ({
            ...prev,
            proposedSchedule: { ...prev.proposedSchedule, [field]: formatDateLocal(date) }
        }));
        if (field === 'startDate' && errors.proposedStartDate)
            setErrors(prev => ({ ...prev, proposedStartDate: '' }));
        if (field === 'endDate' && errors.proposedEndDate)
            setErrors(prev => ({ ...prev, proposedEndDate: '' }));
    };

    const handleProposedScheduleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            proposedSchedule: { ...prev.proposedSchedule, [name]: value }
        }));
        if (name === 'preferredMode' && errors.proposedMode)
            setErrors(prev => ({ ...prev, proposedMode: '' }));
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
        setFormData(prev => ({
            ...prev,
            rounds: prev.rounds.map(round =>
                round.id === id ? { ...round, [field]: value } : round
            )
        }));
    };
    const addRound = () => {
        const newId = formData.rounds.length > 0
            ? Math.max(...formData.rounds.map(r => r.id)) + 1
            : 1;
        setFormData(prev => ({
            ...prev,
            // rounds: [...prev.rounds, { id: newId, degree: '', stream: '', students: '', skills: '' }]
            rounds: [...prev.rounds, { id: newId, degree: '', stream: '', students: '', skills: '', _auto: false }]
        }));
    };

    const removeRound = (roundId) => {
        if (formData.rounds.length > 1) {
            setFormData(prev => ({
                ...prev,
                rounds: prev.rounds.filter(round => round.id !== roundId)
            }));
        }
    };

    const handleCustomAdd = (field, value, setValue, predefinedOptions = []) => {
        if (
            value.trim() &&
            !formData[field].includes(value.trim()) &&
            !predefinedOptions.map(opt => opt.toLowerCase()).includes(value.trim().toLowerCase())
        ) {
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
        setSelectedDegreeIds([]);
        localStorage.removeItem('pendingRegistration');
    };

    // ─── Validation ────────────────────────────────────────────────────────────
    const validateForm = () => {
        let formValid = true;
        const newErrors = {};

        if (!formData.degree.length) {
            newErrors.degree = 'Please select at least one degree';
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

    // ─── Submit ────────────────────────────────────────────────────────────────
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            showAlert('Please fill all required fields correctly', 'error');
            return;
        }

        let aggregatedSkills = [];
        // degree / stream are now objects — extract labels for the payload
        let studentStreams = formData.stream.map(s => s.label);
        let roundNames = [];
        let studentCounts = [];

        const nonEmptyRounds = formData.rounds.filter(round => round.students || round.skills || round.degree);
        nonEmptyRounds.forEach(round => {
            if (round.skills)
                aggregatedSkills = [...new Set([...aggregatedSkills, ...round.skills.split(',').map(s => s.trim()).filter(Boolean)])];
            if (round.students) studentCounts.push(round.students);
            if (round.stream) studentStreams = [...new Set([...studentStreams, round.stream])];
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
            degree: formData.degree.map(d => d.label),   // send labels to backend
            studentStreams,
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
            const response = await axios.post(
                `${backendUrl}/api/hiring-channels/on-campus/college-request`,
                payload,
                { withCredentials: true, headers: { 'Content-Type': 'application/json' } }
            );
            toast.success(response?.data?.message);
            resetForm();
        } catch (error) {
            console.error('Error submitting form:', error);
            toast.error('Something went wrong!');
        }
    };

    // ─── Dropdown toggle ───────────────────────────────────────────────────────
    const toggleDropdown = (dropdown) => {
        setDropdownOpen(prev => ({
            ...Object.keys(prev).reduce((acc, key) => ({ ...acc, [key]: false }), {}),
            [dropdown]: !prev[dropdown]
        }));
    };

    // ─── Per-row stream cache for Section 6 table (independent of Section 2) ──
    // Maps degreeId -> array of { value: _id, label: name }
    const [rowStreamCache, setRowStreamCache] = useState({});

    const fetchStreamsForRow = async (degreeLabel) => {
        if (!degreeLabel) return;
        // Find the _id for this label from degreeOptions
        const matched = degreeOptions.find(d => d.label === degreeLabel);
        if (!matched) return;
        const degreeId = matched.value;
        // Already cached
        if (rowStreamCache[degreeId]) return;
        try {
            const res = await getMasterDataByType("STREAM", degreeId);
            const streams = res.data.data.map(item => item.value);
            setRowStreamCache(prev => ({ ...prev, [degreeId]: streams }));
        } catch (err) {
            console.error("Error fetching row streams", err);
        }
    };

    // const getRowStreams = (degreeLabel) => {
    //     if (!degreeLabel) return [];
    //     const matched = degreeOptions.find(d => d.label === degreeLabel);
    //     if (!matched) return [];
    //     return rowStreamCache[matched.value] || [];
    // };
    const getRowStreams = (degreeLabel) => {
        if (!degreeLabel) return [];

        const matched = degreeOptions.find(d => d.label === degreeLabel);
        if (!matched) return [];

        const degreeId = matched.value;

        if (!rowStreamCache[degreeId]) {
            fetchStreamsForRow(degreeLabel);
            return [];
        }

        return rowStreamCache[degreeId];
    };
    const totalStudents = formData.rounds.reduce((sum, round) => {
        return sum + (parseInt(round.students) || 0);
    }, 0);
    useEffect(() => {
        if (formData.degree?.length) {
            setSelectedDegreeIds(formData.degree.map(d => d.value));
        }
    }, []);
    // ─── CreatableSelect shared styles (matching existing glassmorphism theme) ──
    const selectStyles = {
        control: (base, state) => ({
            ...base,
            minHeight: '42px',
            borderRadius: '8px',
            fontSize: '14px',
            backgroundColor: 'rgba(255, 255, 255, 0.5)',
            backdropFilter: 'blur(8px)',
            borderColor: state.isFocused ? '#143694' : 'rgba(255, 255, 255, 0.5)',
            boxShadow: state.isFocused ? '0 0 0 1px #143694' : 'none',
            '&:hover': { borderColor: '#143694' },
        }),
        menu: (base) => ({
            ...base,
            fontSize: '14px',
            zIndex: 30,
        }),
        multiValue: (base) => ({
            ...base,
            background: 'linear-gradient(to right, rgba(147,197,253,0.2), rgba(59,130,246,0.2))',
            borderRadius: '9999px',
        }),
        multiValueLabel: (base) => ({
            ...base,
            color: '#1e4ed8',
            fontWeight: 600,
            fontSize: '12px',
            paddingLeft: '8px',
        }),
        multiValueRemove: (base) => ({
            ...base,
            color: '#1e4ed8',
            borderRadius: '9999px',
            ':hover': { backgroundColor: 'rgba(59,130,246,0.2)', color: '#1e4ed8' },
        }),
        placeholder: (base) => ({ ...base, color: '#6b7280', fontSize: '14px' }),
    };

    const selectStylesError = {
        ...selectStyles,
        control: (base, state) => ({
            ...selectStyles.control(base, state),
            borderColor: '#fca5a5',
        }),
    };

    // ─── JSX ───────────────────────────────────────────────────────────────────
    return (
        <div className="min-h-screen bg-gradient-to-br from-[#f0e6f7]/60 via-[#d4e8f9]/55 to-[#cff7ea]/60">
            {/* Pastel blur background elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#fbcfe8]/20 rounded-full blur-3xl"></div>
                <div className="absolute top-1/3 -left-20 w-60 h-60 bg-[#143694]/20 rounded-full blur-3xl"></div>
                <div className="absolute bottom-20 right-1/3 w-40 h-40 bg-[#a7f3d0]/20 rounded-full blur-3xl"></div>
            </div>

            <div className="relative z-10 container mx-auto px-4 py-6 max-w-5xl">
                {/* Header Section */}
                <div className="bg-white/90 backdrop-blur-sm border border-white/50 rounded-xl shadow-lg shadow-blue-50/50 p-4 mb-6">
                    <div className="text-center">
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-[#1e4ed8] to-[#1e40af] bg-clip-text text-transparent mb-1">
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
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-[#1e4ed8] to-[#1e40af] bg-clip-text text-transparent mb-6 text-center">
                        Register for Campus Placement
                    </h2>
                    <p className="text-gray-600 mb-8 text-center text-sm">
                        Please fill out the form below to register your college for campus placements.
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-8">

                        {/* ============ SECTION 1: COLLEGE DETAILS ============ */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 pb-2">
                                <Home className="w-5 h-5 text-[#1e4ed8]" />
                                <h3 className="text-lg font-semibold text-gray-800">College Details</h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Amenities / Facilities */}
                                <div ref={amenitiesRef} className="relative">
                                    <label className="block text-gray-700 font-medium mb-2 text-sm flex items-center gap-1.5">
                                        <Building className="w-4 h-4 text-[#1e4ed8]" />
                                        Campus Facilities
                                    </label>
                                    <div className="relative">
                                        <div
                                            className="w-full bg-white/50 backdrop-blur-sm border border-white/50 rounded-lg p-2.5 min-h-[42px] cursor-pointer hover:border-[#143694] transition-all duration-200 text-sm"
                                            onClick={() => toggleDropdown('amenities')}
                                        >
                                            {formData.amenities.length > 0 ? (
                                                <div className="flex flex-wrap gap-1">
                                                    {formData.amenities.slice(0, 3).map(item => (
                                                        <span key={item} className="flex items-center bg-gradient-to-r from-[#143694]/20 to-[#1e4ed8]/20 text-[#1e4ed8] text-xs font-semibold px-2 py-0.5 rounded-full">
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
                                                            className={`px-3 py-2 hover:bg-[#143694]/10 cursor-pointer border-b border-white/50 last:border-b-0 transition-colors duration-200 flex justify-between items-center ${formData.amenities.includes(opt) ? "bg-[#143694]/10" : ""}`}
                                                            onClick={() => handleMultiToggle('amenities', opt)}
                                                        >
                                                            <div className="flex items-center">
                                                                <div className={`w-4 h-4 border-2 rounded mr-2 flex items-center justify-center ${formData.amenities.includes(opt) ? 'bg-[#1e4ed8] border-[#1e4ed8]' : 'border-gray-300'}`}>
                                                                    {formData.amenities.includes(opt) && (
                                                                        <CheckSquare size={10} className="text-white" />
                                                                    )}
                                                                </div>
                                                                <span className="text-sm">{opt}</span>
                                                            </div>
                                                            {formData.amenities.includes(opt) && <span className="text-[#1e4ed8] text-xs">✓</span>}
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
                            </div>
                        </div>

                        {/* ============ SECTION 2: ACADEMIC DETAILS ============ */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 pb-2">
                                <BookOpen className="w-5 h-5 text-[#1e4ed8]" />
                                <h3 className="text-lg font-semibold text-gray-800">Academic Details</h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                                {/* ── Degree (dynamic, multi, creatable) ── */}
                                <div>
                                    <label className="block text-gray-700 font-medium mb-2 text-sm flex items-center gap-1.5">
                                        <GraduationCap className="w-4 h-4 text-[#1e4ed8]" />
                                        Degree <span className="text-red-500">*</span>
                                    </label>
                                    <CreatableSelect
                                        isMulti
                                        isClearable
                                        isLoading={isLoadingDegrees}
                                        options={degreeOptions}
                                        value={formData.degree}
                                        styles={errors.degree ? selectStylesError : selectStyles}
                                        placeholder="Select or add degree(s)"
                                        onChange={(selected) => {
                                            const selections = selected || [];
                                            setFormData(prev => ({ ...prev, degree: selections, stream: [] }));
                                            if (errors.degree) setErrors(prev => ({ ...prev, degree: '' }));
                                            setSelectedDegreeIds(selections.map(s => s.value));
                                        }}
                                        onCreateOption={async (val) => {
                                            try {
                                                const res = await createMasterData({ type: "DEGREE", value: val });
                                                const newOpt = { value: res.data.data._id, label: res.data.data.value };
                                                setDegreeOptions(prev => [...prev, newOpt]);
                                                setFormData(prev => {
                                                    const updated = [...prev.degree, newOpt];
                                                    setSelectedDegreeIds(updated.map(s => s.value));
                                                    return { ...prev, degree: updated, stream: [] };
                                                });
                                            } catch (err) {
                                                console.error("Error adding degree", err);
                                                toast.error("Could not add degree.");
                                            }
                                        }}
                                    />
                                    {errors.degree && (
                                        <p className="mt-1 text-xs text-red-600">{errors.degree}</p>
                                    )}
                                </div>

                                {/* ── Stream (dynamic, multi, creatable, disabled until degree picked) ── */}
                                <div>
                                    <label className="block text-gray-700 font-medium mb-2 text-sm flex items-center gap-1.5">
                                        <GraduationCap className="w-4 h-4 text-[#1e4ed8]" />
                                        Stream
                                    </label>
                                    <CreatableSelect
                                        isMulti
                                        isClearable
                                        isLoading={isLoadingStreams}
                                        isDisabled={formData.degree.length === 0}
                                        options={streamOptions}
                                        value={formData.stream}
                                        styles={selectStyles}
                                        placeholder={
                                            formData.degree.length === 0
                                                ? "Select a degree first"
                                                : "Select or add stream(s)"
                                        }
                                        onChange={(selected) => {
                                            handleChange('stream', selected || []);
                                        }}
                                        onCreateOption={async (val) => {
                                            // Use first selected degree as parent
                                            const parentId = selectedDegreeIds[0] || null;
                                            try {
                                                const res = await createMasterData({
                                                    type: "STREAM",
                                                    value: val,
                                                    parent: parentId,
                                                });
                                                const newOpt = { value: res.data.data._id, label: res.data.data.value };
                                                setStreamOptions(prev => [...prev, newOpt]);
                                                handleChange('stream', [...formData.stream, newOpt]);
                                            } catch (err) {
                                                console.error("Error adding stream", err);
                                                toast.error("Could not add stream.");
                                            }
                                        }}
                                    />
                                </div>

                            </div>
                        </div>

                        {/* ============ SECTION 3: COORDINATOR DETAILS ============ */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 pb-2">
                                <UsersIcon className="w-5 h-5 text-[#1e4ed8]" />
                                <h3 className="text-lg font-semibold text-gray-800">Coordinator Details</h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-gray-700 font-medium mb-2 text-sm flex items-center gap-1.5">
                                        <User className="w-4 h-4 text-[#1e4ed8]" />
                                        Coordinator Name
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Enter name"
                                        className="w-full bg-white/50 backdrop-blur-sm border border-white/50 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#143694] focus:border-transparent"
                                        value={formData.coordinatorName}
                                        onChange={(e) => handleChange('coordinatorName', e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700 font-medium mb-2 text-sm flex items-center gap-1.5">
                                        <User className="w-4 h-4 text-[#1e4ed8]" />
                                        Coordinator Designation <span className="text-red-500">*</span>
                                    </label>
                                    <CreatableSelect
                                        isClearable
                                        isSearchable
                                        isLoading={isLoadingDesignation}
                                        options={designationOptions}
                                        styles={errors.coordinatorDesignation ? selectStylesError : selectStyles}
                                        placeholder="Select or create designation"
                                        value={
                                            formData.coordinatorDesignation
                                                ? {
                                                    value: formData.coordinatorDesignation,
                                                    label: formData.coordinatorDesignation,
                                                }
                                                : null
                                        }
                                        onChange={(selected) => {
                                            handleChange("coordinatorDesignation", selected?.value || "");
                                        }}
                                        onCreateOption={async (inputValue) => {
                                            try {
                                                const normalized = inputValue.trim();

                                                if (!normalized) return;

                                                // 🔒 prevent duplicate
                                                const exists = designationOptions.some(
                                                    (opt) => opt.value.toLowerCase() === normalized.toLowerCase()
                                                );

                                                if (exists) {
                                                    handleChange("coordinatorDesignation", normalized);
                                                    return;
                                                }

                                                // ✅ save to DB
                                                await createCollegeMasterData({
                                                    type: "COLLEGE_DESIGNATION",
                                                    value: normalized,
                                                });

                                                const newOption = {
                                                    value: normalized,
                                                    label: normalized,
                                                };

                                                setDesignationOptions((prev) => [...prev, newOption]);
                                                handleChange("coordinatorDesignation", normalized);

                                                toast.success("Designation added");
                                            } catch (err) {
                                                console.error("Error creating designation", err);
                                                toast.error("Could not add designation");
                                            }
                                        }}
                                        formatCreateLabel={(inputValue) => `Create "${inputValue}"`}
                                    />
                                </div>

                                <div>
                                    <label className="block text-gray-700 font-medium mb-2 text-sm flex items-center gap-1.5">
                                        <Mail className="w-4 h-4 text-[#1e4ed8]" />
                                        Email <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="email"
                                        placeholder="official@college.edu"
                                        className={`w-full bg-white/50 backdrop-blur-sm border ${errors.email ? 'border-red-300' : 'border-white/50'} rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#143694] focus:border-transparent`}
                                        value={formData.email}
                                        onChange={(e) => handleChange('email', e.target.value)}
                                    />
                                    {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
                                </div>

                                <div>
                                    <label className="block text-gray-700 font-medium mb-2 text-sm flex items-center gap-1.5">
                                        <Phone className="w-4 h-4 text-[#1e4ed8]" />
                                        Mobile <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="tel"
                                        placeholder="10-digit number"
                                        className={`w-full bg-white/50 backdrop-blur-sm border ${errors.mobile ? 'border-red-300' : 'border-white/50'} rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#143694] focus:border-transparent`}
                                        value={formData.mobile}
                                        onChange={(e) => handleChange('mobile', e.target.value)}
                                    />
                                    {errors.mobile && <p className="mt-1 text-xs text-red-600">{errors.mobile}</p>}
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-gray-700 font-medium mb-2 text-sm flex items-center gap-1.5">
                                        <Linkedin className="w-4 h-4 text-[#1e4ed8]" />
                                        LinkedIn Profile
                                    </label>
                                    <input
                                        type="url"
                                        placeholder="linkedin.com/in/username"
                                        className="w-full bg-white/50 backdrop-blur-sm border border-white/50 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#143694] focus:border-transparent"
                                        value={formData.linkedinProfile}
                                        onChange={(e) => handleChange('linkedinProfile', e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* ============ SECTION 4: PLACEMENT DETAILS ============ */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 pb-2">
                                <Briefcase className="w-5 h-5 text-[#1e4ed8]" />
                                <h3 className="text-lg font-semibold text-gray-800">Placement Details</h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-gray-700 font-medium mb-2 text-sm flex items-center gap-1.5">
                                        <Target className="w-4 h-4 text-[#1e4ed8]" />
                                        Looking For
                                    </label>
                                    <div className="flex gap-2">
                                        {['job', 'internship'].map((type) => (
                                            <button
                                                key={type}
                                                type="button"
                                                className={`px-3 py-2 rounded-lg border text-sm transition-all duration-200 font-medium flex-1 capitalize ${formData.lookingFor.includes(type)
                                                    ? 'bg-gradient-to-r from-[#143694] to-[#1e4ed8] text-white border-transparent'
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
                                        <Briefcase className="w-4 h-4 text-[#1e4ed8]" />
                                        Employment Type
                                    </label>
                                    <div className="flex gap-2">
                                        {['Full-time', 'Part-time', 'Contract'].map((type) => (
                                            <button
                                                key={type}
                                                type="button"
                                                className={`px-3 py-2 rounded-lg border text-sm transition-all duration-200 font-medium flex-1 ${formData.employmentType.includes(type)
                                                    ? 'bg-gradient-to-r from-[#143694] to-[#1e4ed8] text-white border-transparent'
                                                    : 'bg-white/50 backdrop-blur-sm border-white/50 text-gray-700 hover:bg-white/70'
                                                    }`}
                                                onClick={() => handleMultiToggle('employmentType', type)}
                                            >
                                                {type}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-gray-700 font-medium mb-2 text-sm flex items-center gap-1.5">
                                        <Users className="w-4 h-4 text-[#1e4ed8]" />
                                        Min Students to Place <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <select
                                            className={`w-full bg-white/50 backdrop-blur-sm border ${errors.minStudentsToBePlaced ? 'border-red-300' : 'border-white/50'} rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#143694] focus:border-transparent`}
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

                                {/* Company Type */}
                                <div>
                                    <label className="block text-gray-700 font-medium mb-2 text-sm flex items-center gap-1.5">
                                        <Building className="w-4 h-4 text-[#1e4ed8]" />
                                        Company Type
                                    </label>
                                    <CreatableSelect
                                        isMulti
                                        isClearable
                                        isLoading={isLoadingCompanyTypes}
                                        options={companyTypeOptions}
                                        value={companyTypeOptions.filter(opt => formData.companyType.includes(opt.value))}
                                        styles={selectStyles}
                                        placeholder="Select or add company type(s)"
                                        onChange={(selected) => {
                                            handleChange('companyType', (selected || []).map(s => s.value));
                                        }}
                                        onCreateOption={async (val) => {
                                            try {
                                                const res = await createCompanyMasterData({
                                                    type: 'COMPANY_TYPE',
                                                    value: val,
                                                    isCustom: true,
                                                });
                                                const savedValue = res.data.data.value;
                                                const newOpt = { value: savedValue, label: savedValue };
                                                setCompanyTypeOptions(prev => [...prev, newOpt]);
                                                handleChange('companyType', [...formData.companyType, savedValue]);
                                            } catch (err) {
                                                console.error('Failed to create company type', err);
                                                toast.error('Could not add company type.');
                                            }
                                        }}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* ============ SECTION 5: COMPENSATION DETAILS ============ */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 pb-2">
                                <IndianRupee className="w-5 h-5 text-[#1e4ed8]" />
                                <h3 className="text-lg font-semibold text-gray-800">Compensation Details</h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-gray-700 font-medium mb-2 text-sm flex items-center gap-1.5">
                                        <IndianRupee className="w-4 h-4 text-[#1e4ed8]" />
                                        Minimum Salary
                                    </label>
                                    <div className="flex rounded-lg overflow-hidden border border-gray-200/80 focus-within:ring-2 focus-within:ring-[#143694] focus-within:border-transparent transition-all duration-200">
                                        <div className="relative bg-white/50 backdrop-blur-sm flex items-center">
                                            <div className="px-3 py-2 w-24 text-sm flex items-center gap-2">
                                                {formData.salaryRange === 'INR' || !formData.salaryRange ? (
                                                    <><IndianRupee className="w-3.5 h-3.5 text-gray-600" /><span>INR</span></>
                                                ) : formData.salaryRange === 'USD' ? (
                                                    <><DollarSign className="w-3.5 h-3.5 text-gray-600" /><span>USD</span></>
                                                ) : formData.salaryRange === 'EUR' ? (
                                                    <><Euro className="w-3.5 h-3.5 text-gray-600" /><span>EUR</span></>
                                                ) : (
                                                    <><IndianRupee className="w-3.5 h-3.5 text-gray-600" /><span>INR</span></>
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
                                            {/* <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                                {formData.salaryRange === 'INR' || !formData.salaryRange ? (
                                                    <IndianRupee className="w-3.5 h-3.5 text-gray-500" />
                                                ) : formData.salaryRange === 'USD' ? (
                                                    <DollarSign className="w-3.5 h-3.5 text-gray-500" />
                                                ) : formData.salaryRange === 'EUR' ? (
                                                    <Euro className="w-3.5 h-3.5 text-gray-500" />
                                                ) : (
                                                    <IndianRupee className="w-3.5 h-3.5 text-gray-500" />
                                                )}
                                            </div> */}
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-gray-700 font-medium mb-2 text-sm flex items-center gap-1.5">
                                        <Calendar className="w-4 h-4 text-[#1e4ed8]" />
                                        Application Dates
                                    </label>
                                    <div className="grid grid-cols-2 gap-2">
                                        <div className="relative">
                                            <DatePicker
                                                selected={formData.tentativeStartDate ? new Date(formData.tentativeStartDate) : null}
                                                onChange={(date) => handleDateChange(date, 'tentativeStartDate')}
                                                dateFormat="dd-MM-yyyy"
                                                placeholderText="Start"
                                                className="w-full bg-white/50 backdrop-blur-sm border border-white/50 rounded px-2 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#143694] focus:border-transparent pl-8"
                                            />
                                            <Calendar className="absolute left-2 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                                        </div>
                                        <div className="relative">
                                            <DatePicker
                                                selected={formData.tentativeEndDate ? new Date(formData.tentativeEndDate) : null}
                                                onChange={(date) => handleDateChange(date, 'tentativeEndDate')}
                                                dateFormat="dd-MM-yyyy"
                                                placeholderText="End"
                                                className="w-full bg-white/50 backdrop-blur-sm border border-white/50 rounded px-2 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#143694] focus:border-transparent pl-8"
                                            />
                                            <Calendar className="absolute left-2 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ============ SECTION 6: STUDENT DETAILS ============ */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 pb-2">
                                <Users className="w-5 h-5 text-[#1e4ed8]" />
                                <h3 className="text-lg font-semibold text-gray-800">Student Details</h3>
                            </div>

                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <label className="block text-gray-700 font-medium text-sm flex items-center gap-1.5">
                                        <List className="w-4 h-4 text-[#1e4ed8]" />
                                        Student Information
                                    </label>
                                    <button
                                        type="button"
                                        onClick={addRound}
                                        className="flex items-center gap-1.5 text-xs bg-gradient-to-r from-[#143694] to-[#1e4ed8] text-white px-2.5 py-1.5 rounded hover:shadow-lg hover:shadow-[#143694]/40 transition-all duration-200"
                                    >
                                        <Plus size={12} />
                                        Add Student
                                    </button>
                                </div>

                                <div className="overflow-x-auto mb-3">
                                    <table className="min-w-full divide-y divide-white/50 text-xs">
                                        <thead className="bg-white/50">
                                            <tr>
                                                <th className="px-2 py-1.5 text-left font-medium text-gray-500 w-8">#</th>
                                                <th className="px-2 py-1.5 text-left font-medium text-gray-500">Degree</th>
                                                <th className="px-2 py-1.5 text-left font-medium text-gray-500">Stream</th>
                                                <th className="px-2 py-1.5 text-left font-medium text-gray-500">Count</th>
                                                <th className="px-2 py-1.5 text-left font-medium text-gray-500">Skills (comma separated)</th>
                                                <th className="px-2 py-1.5 w-6"></th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white/30 divide-y divide-white/50">
                                            {formData.rounds.map((round) => {
                                                // For the table rows: use degreeOptions labels for the select
                                                const rowStreamLabels = getRowStreams(round.degree);
                                                return (
                                                    <tr key={round.id}>
                                                        <td className="px-2 py-1.5 text-gray-500">#{round.id}</td>
                                                        <td className="px-2 py-1.5">
                                                            <select
                                                                className="w-full bg-white/50 backdrop-blur-sm border border-white/50 rounded px-1.5 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-[#143694]"
                                                                value={round.degree}
                                                                onChange={(e) => {
                                                                    const newDegree = e.target.value;
                                                                    setFormData(prev => ({        // ← use functional update
                                                                        ...prev,
                                                                        rounds: prev.rounds.map(r =>
                                                                            r.id === round.id ? { ...r, degree: newDegree, stream: '' } : r
                                                                        )
                                                                    }));
                                                                    fetchStreamsForRow(newDegree);
                                                                }}
                                                            >
                                                                <option value="">Select</option>
                                                                {degreeOptions.map(opt => (
                                                                    <option key={opt.value} value={opt.label}>{opt.label}</option>
                                                                ))}
                                                            </select>
                                                        </td>
                                                        <td className="px-2 py-1.5">
                                                            <select
                                                                className="w-full bg-white/50 backdrop-blur-sm border border-white/50 rounded px-1.5 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-[#143694] disabled:opacity-50 disabled:cursor-not-allowed"
                                                                value={round.stream}
                                                                disabled={!round.degree}
                                                                onChange={(e) => handleRoundChange(round.id, 'stream', e.target.value)}
                                                            >
                                                                <option value="">{round.degree ? 'Select' : 'Degree first'}</option>
                                                                {rowStreamLabels.map(label => (
                                                                    <option key={label} value={label}>{label}</option>
                                                                ))}
                                                            </select>
                                                        </td>
                                                        <td className="px-2 py-1.5">
                                                            <input
                                                                type="number"
                                                                className="w-full bg-white/50 backdrop-blur-sm border border-white/50 rounded px-1.5 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-[#143694]"
                                                                value={round.students}
                                                                onChange={(e) => handleRoundChange(round.id, 'students', e.target.value)}
                                                                min="0"
                                                            />
                                                        </td>
                                                        <td className="px-2 py-1.5">
                                                            <input
                                                                type="text"
                                                                className="w-full bg-white/50 backdrop-blur-sm border border-white/50 rounded px-1.5 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-[#143694]"
                                                                value={round.skills}
                                                                onChange={(e) => handleRoundChange(round.id, 'skills', e.target.value)}
                                                                placeholder="e.g., Java, Python, React"
                                                            />
                                                        </td>
                                                        <td className="px-2 py-1.5">
                                                            {formData.rounds.length > 1 && (
                                                                <button
                                                                    type="button"
                                                                    onClick={() => removeRound(round.id)}
                                                                    className="text-red-400 hover:text-red-600 transition-colors"
                                                                >
                                                                    <Trash2 size={12} />
                                                                </button>
                                                            )}
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>

                                <div className="mt-2 p-2 bg-gradient-to-r from-[#143694]/10 to-[#1e4ed8]/10 border border-[#143694]/20 rounded text-xs">
                                    <div className="flex items-center justify-between">
                                        <span className="font-medium text-[#1e4ed8]">Total Students:</span>
                                        <span className="font-bold text-[#1e4ed8]">{totalStudents}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ============ SECTION 7: SCHEDULE DETAILS ============ */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 pb-2">
                                <Clock className="w-5 h-5 text-[#1e4ed8]" />
                                <h3 className="text-lg font-semibold text-gray-800">Schedule Details</h3>
                            </div>

                            <div>
                                <label className="block text-gray-700 font-medium mb-2 text-sm flex items-center gap-1.5">
                                    <Clock className="w-4 h-4 text-[#1e4ed8]" />
                                    Proposed Schedule <span className="text-red-500">*</span>
                                </label>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                    <div className="relative">
                                        <DatePicker
                                            selected={formData.proposedSchedule.startDate ? new Date(formData.proposedSchedule.startDate) : null}
                                            onChange={(date) => handleProposedDateChange(date, 'startDate')}
                                            dateFormat="dd-MM-yyyy"
                                            placeholderText="Start Date"
                                            className={`w-full bg-white/50 backdrop-blur-sm border ${errors.proposedStartDate ? 'border-red-300' : 'border-white/50'} rounded-lg p-2.5 pl-9 text-sm focus:outline-none focus:ring-1 focus:ring-[#143694] focus:border-transparent`}
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
                                            className={`w-full bg-white/50 backdrop-blur-sm border ${errors.proposedEndDate ? 'border-red-300' : 'border-white/50'} rounded-lg p-2.5 pl-9 text-sm focus:outline-none focus:ring-1 focus:ring-[#143694] focus:border-transparent`}
                                        />
                                        <Calendar className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400" size={14} />
                                        {errors.proposedEndDate && (
                                            <p className="mt-1 text-xs text-red-600">{errors.proposedEndDate}</p>
                                        )}
                                    </div>
                                    <div className="relative">
                                        <select
                                            name="preferredMode"
                                            className={`w-full bg-white/50 backdrop-blur-sm border ${errors.proposedMode ? 'border-red-300' : 'border-white/50'} rounded-lg p-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#143694] focus:border-transparent`}
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
                        </div>

                        {/* ============ SECTION 8: ADDITIONAL INFORMATION ============ */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 pb-2">
                                <FileText className="w-5 h-5 text-[#1e4ed8]" />
                                <h3 className="text-lg font-semibold text-gray-800">Additional Information</h3>
                            </div>

                            <div>
                                <label className="block text-gray-700 font-medium mb-2 text-sm flex items-center gap-1.5">
                                    <MessageSquare className="w-4 h-4 text-[#1e4ed8]" />
                                    Description
                                </label>
                                <textarea
                                    className="w-full bg-white/50 backdrop-blur-sm border border-white/50 rounded-lg px-2.5 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#143694] focus:border-transparent resize-none"
                                    placeholder="Additional information about the placement drive, specific requirements, or any other details..."
                                    value={formData.description}
                                    onChange={(e) => {
                                        handleChange('description', e.target.value);
                                        if (e.target.value.length > 500) {
                                            setDescriptionError("Description cannot exceed 500 characters.");
                                        } else {
                                            setDescriptionError("");
                                        }
                                    }}
                                    rows="4"
                                    maxLength={500}
                                />
                                <div className="flex justify-between text-xs mt-1">
                                    <span className={descriptionError ? 'text-red-500' : 'text-gray-500'}>
                                        {descriptionError ? descriptionError : `${formData.description.length}/500 characters`}
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
                                className="group flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#143694] to-[#1e4ed8] text-white rounded-lg hover:shadow-lg hover:shadow-[#143694]/40 transition-all duration-200 text-sm font-medium"
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