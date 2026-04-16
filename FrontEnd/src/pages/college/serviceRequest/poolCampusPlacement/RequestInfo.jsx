import { useState, useRef, useEffect, useMemo } from 'react';
import axios from 'axios';
import { ChevronDown, X, Calendar, Clock, Users, Target, GraduationCap, Building, IndianRupee, Euro, List, Plus, Trash2, MapPin, User, Mail, Phone, Linkedin, ArrowLeft, Send, CheckSquare, Briefcase, School, Monitor, MessageSquare, Home, BookOpen, Users as UsersIcon, FileText, DollarSign } from 'lucide-react';
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

export default function PoolCampusHiringForm({ onBackClick }) {
    const initialFormState = {
        venue: '',
        degree: [],       // now stores { value: _id, label: name } objects
        stream: [],       // now stores { value: _id, label: name } objects
        collegeTypes: '',
        employmentType: [],
        salaryRange: 'INR',
        salaryValue: '',
        tentativeStartDate: '',
        tentativeEndDate: '',
     //   rounds: Array.from({ length: 3 }, (_, i) => ({ id: i + 1, students: '', branch: '', skills: '' })),
     rounds: Array.from({ length: 3 }, (_, i) => ({ id: i + 1, students: '', branch: '', skills: '', _auto: false })),
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
const [designationOptions, setDesignationOptions] = useState([]);
const [isLoadingDesignation, setIsLoadingDesignation] = useState(false);
//const [selectedStreams, setSelectedStreams] = useState([]);

    const [formData, setFormData] = useState(() => {
        const savedData = localStorage.getItem('pendingPoolCampusRegistration');
        if (!savedData) return initialFormState;
        try {
            const parsed = JSON.parse(savedData);
            if (!Array.isArray(parsed.stream)) parsed.stream = [];
            if (!Array.isArray(parsed.degree)) parsed.degree = [];
            if (parsed.tentativeStartDate) parsed.tentativeStartDate = new Date(parsed.tentativeStartDate);
            if (parsed.tentativeEndDate) parsed.tentativeEndDate = new Date(parsed.tentativeEndDate);
            if (parsed.proposedSchedule?.startDate) parsed.proposedSchedule.startDate = new Date(parsed.proposedSchedule.startDate);
            if (parsed.proposedSchedule?.endDate) parsed.proposedSchedule.endDate = new Date(parsed.proposedSchedule.endDate);
            return parsed;
        } catch (e) {
            console.error("Error parsing saved pool campus data:", e);
            return initialFormState;
        }
    });

    // ─── UI state ──────────────────────────────────────────────────────────────
    const [errors, setErrors]                     = useState({});
    const [isSubmitting, setIsSubmitting]         = useState(false);
    const [alert, setAlert]                       = useState({ show: false, message: '', type: '' });
    const [descriptionError, setDescriptionError] = useState("");

    // ─── Static options ────────────────────────────────────────────────────────
    const collegeTypeOptions  = ['Engineering', 'Medical', 'Management', 'Arts & Science', 'Law', 'Pharmacy', 'Architecture'];
    //const designationOptions  = ['Professor', 'HOD', 'Placement Officer', 'Dean', 'Coordinator'];
    const minStudentsOptions  = ['1-10', '11-25', '26-50', '51-100', '101-200', '200+'];
    const amenitiesOptions    = ['Auditorium', 'Seminar Hall', 'Interview Rooms', 'Computer Labs', 'Wi-Fi Access', 'Projector'];
    const proposedModeOptions = ["Online", "Offline", "Hybrid"];

    // ─── Dynamic degree / stream API state (Section 2) ────────────────────────
    const [degreeOptions,     setDegreeOptions]     = useState([]);
    const [streamOptions,     setStreamOptions]     = useState([]);
    const [selectedDegreeIds, setSelectedDegreeIds] = useState([]);
    const [isLoadingDegrees,  setIsLoadingDegrees]  = useState(false);
    const [isLoadingStreams,   setIsLoadingStreams]  = useState(false);

    // ─── Per-row stream cache for Section 6 table (independent of Section 2) ──
    // Maps degreeId -> string[] of stream labels
    const [rowStreamCache, setRowStreamCache] = useState({});

    // ─── Dynamic company type API state ───────────────────────────────────────
    const [companyTypeOptions,    setCompanyTypeOptions]    = useState([]);
    const [isLoadingCompanyTypes, setIsLoadingCompanyTypes] = useState(false);

    // ─── Custom dropdown state ─────────────────────────────────────────────────
    const [dropdownOpen, setDropdownOpen] = useState({
        amenities: false,
        collegeTypes: false,
    });
    const [customAmenity,     setCustomAmenity]     = useState('');
    const [customCollegeType, setCustomCollegeType] = useState('');

    // ─── Refs ──────────────────────────────────────────────────────────────────
    const amenitiesRef    = useRef(null);
    const collegeTypesRef = useRef(null);

    // ─── City options ──────────────────────────────────────────────────────────
    const cityOptions = useMemo(() => {
        const indianCities = City.getCitiesOfCountry('IN')
            .map(city => ({ value: city.name, label: city.name }))
            .sort((a, b) => a.label.localeCompare(b.label));
        return [
            { value: 'Online', label: 'Online' },
            { value: 'Other', label: 'Other' },
            ...indianCities
        ];
    }, []);

    // ─── Persist to localStorage ───────────────────────────────────────────────
    useEffect(() => {
        localStorage.setItem('pendingPoolCampusRegistration', JSON.stringify(formData));
    }, [formData]);
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
    // ─── Click-outside handler for custom dropdowns ────────────────────────────
    useEffect(() => {
        const handleClickOutside = (event) => {
            const refs = {
                amenities:    amenitiesRef,
                collegeTypes: collegeTypesRef,
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
                    res.data.data.map(item => ({ value: item._id, label: item.value }))
                );
            } catch (err) {
                console.error("Error fetching degrees", err);
            } finally {
                setIsLoadingDegrees(false);
            }
        };
        fetchDegrees();
    }, []);

    // ─── Fetch streams when selected degrees change (Section 2) ───────────────
    useEffect(() => {
        if (selectedDegreeIds.length === 0) {
            setStreamOptions([]);
            return;
        }
        const fetchStreams = async () => {
            setIsLoadingStreams(true);
            try {
                const results = await Promise.all(
                    selectedDegreeIds.map(id => getMasterDataByType("STREAM", id))
                );
                const merged = new Map();
                results.forEach(res => {
                    res.data.data.forEach(item => {
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

useEffect(() => {
    setFormData(prev => {
        const selectedStreams = prev.stream.map(s => s.label);

        let rows = [...prev.rounds];

        rows = rows.map(r => {
            if (!r._auto) return r;
            const stillExists = selectedStreams.includes(r.branch);
            if (!stillExists) return { ...r, branch: '', _auto: false };
            return r;
        });

        selectedStreams.forEach((stream) => {
            const alreadyExists = rows.some(r => r.branch === stream);
            if (alreadyExists) return;

            const emptyIndex = rows.findIndex(r => !r.branch);

            if (emptyIndex !== -1) {
                rows[emptyIndex] = {
                    ...rows[emptyIndex],
                    branch: stream,
                    _auto: true,
                };
            } else {
                const newId = Math.max(...rows.map(r => r.id)) + 1;
                rows.push({
                    id: newId,
                    branch: stream,
                    students: '',
                    skills: '',
                    _auto: true,
                });
            }
        });

        return { ...prev, rounds: rows };
    });
}, [formData.stream]);
    // ─── Per-row stream fetch for Section 6 table ─────────────────────────────
    const fetchStreamsForRow = async (degreeLabel) => {
        if (!degreeLabel) return;
        const matched = degreeOptions.find(d => d.label === degreeLabel);
        if (!matched) return;
        const degreeId = matched.value;
        if (rowStreamCache[degreeId]) return; // already cached
        try {
            const res = await getMasterDataByType("STREAM", degreeId);
            const streams = res.data.data.map(item => item.value);
            setRowStreamCache(prev => ({ ...prev, [degreeId]: streams }));
        } catch (err) {
            console.error("Error fetching row streams", err);
        }
    };

    const getRowStreams = (degreeLabel) => {
        if (!degreeLabel) return [];
        const matched = degreeOptions.find(d => d.label === degreeLabel);
        if (!matched) return [];
        return rowStreamCache[matched.value] || [];
    };

    // ─── Rounds helpers ────────────────────────────────────────────────────────
    const handleAddRound = () => {
        setFormData(prev => ({
            ...prev,
            //rounds: [...prev.rounds, { id: Date.now(), branch: '', students: '', skills: '' }]
            rounds: [...prev.rounds, { id: Date.now(), branch: '', students: '', skills: '', _auto: false }]
        }));
    };

    const handleRemoveRound = (id) => {
        setFormData(prev => ({
            ...prev,
            rounds: prev.rounds.filter(round => round.id !== id)
        }));
    };

    // ─── Generic handlers ──────────────────────────────────────────────────────
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const formatDateLocal = (date) => {
        if (!date) return '';
        const year  = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day   = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const handleDateChange = (date, field) => {
        setFormData(prev => ({ ...prev, [field]: formatDateLocal(date) }));
        if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
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

    const handleVenueChange = (selectedOption) => {
        setFormData(prev => ({ ...prev, venue: selectedOption ? selectedOption.value : '' }));
        if (errors.venue) setErrors(prev => ({ ...prev, venue: '' }));
    };

    const handleOptionSelect = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        setDropdownOpen(prev => ({ ...prev, [field]: false }));
        if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
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

    const handleContactChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            contactPerson: { ...prev.contactPerson, [name]: value }
        }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const handleMultiToggle = (field, value) => {
        setFormData(prev => {
            const currentValues = prev[field] || [];
            const newValues = currentValues.includes(value)
                ? currentValues.filter(item => item !== value)
                : [...currentValues, value];
            return { ...prev, [field]: newValues };
        });
        if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
    };

    const handleRoundChange = (id, field, value) => {
        setFormData(prev => ({
            ...prev,
            rounds: prev.rounds.map(round =>
                round.id === id ? { ...round, [field]: value } : round
            )
        }));
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
            if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
        }
        setCustomInput('');
    };

    const handleCustomSingleAdd = (field, item, setCustomInput) => {
        const trimmedItem = item.trim();
        if (trimmedItem) {
            setFormData(prev => ({ ...prev, [field]: trimmedItem }));
            setDropdownOpen(prev => ({ ...prev, [field]: false }));
            if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
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
        setSelectedDegreeIds([]);
        localStorage.removeItem('pendingPoolCampusRegistration');
    };

    const toggleDropdown = (dropdown) => {
        setDropdownOpen(prev => ({
            ...Object.keys(prev).reduce((acc, key) => ({ ...acc, [key]: false }), {}),
            [dropdown]: !prev[dropdown]
        }));
    };

    // ─── Validation ────────────────────────────────────────────────────────────
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
        if (!formData.proposedSchedule.startDate) {
            newErrors.proposedStartDate = 'Please select proposed start date';
            isValid = false;
        }
        if (!formData.proposedSchedule.endDate) {
            newErrors.proposedEndDate = 'Please select proposed end date';
            isValid = false;
        }
        if (!formData.proposedSchedule.preferredMode || !formData.proposedSchedule.preferredMode.trim()) {
            newErrors.proposedMode = 'Please select preferred mode';
            isValid = false;
        }
        if (formData.proposedSchedule.startDate && formData.proposedSchedule.endDate) {
            const start = new Date(formData.proposedSchedule.startDate);
            const end   = new Date(formData.proposedSchedule.endDate);
            if (end <= start) {
                newErrors.proposedEndDate = 'End date must be after start date';
                isValid = false;
            }
        }
        if (formData.description.length > 500) {
            setDescriptionError("Description cannot exceed 500 characters.");
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    // ─── Submit ────────────────────────────────────────────────────────────────
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            showAlert('Please fill all required fields correctly', 'error');
            return;
        }

        setIsSubmitting(true);

        let aggregatedSkills = [];
        let studentStreams    = [];
        let roundNames       = [];
        let studentCounts    = [];
        let roundSkills      = [];

        const nonEmptyRounds = formData.rounds.filter(round => round.students || round.branch || round.skills);
        nonEmptyRounds.forEach(round => {
            if (round.skills) {
                roundSkills.push(round.skills);
                aggregatedSkills.push(...round.skills.split(',').map(s => s.trim()).filter(Boolean));
            }
            if (round.branch)    studentStreams.push(round.branch);
            if (round.students)  studentCounts.push(round.students);
            roundNames.push(`Round ${round.id}`);
        });

        const payload = {
            jobType:         "Pool-campus",
            venue:           formData.venue,
            degree:          formData.degree.map(d => d.label),   // send labels to backend
            studentStreams:  [...new Set([...formData.stream.map(s => s.label), ...studentStreams])],
            collegeTypes:    formData.collegeTypes ? [formData.collegeTypes] : [],
            employmentType:  formData.employmentType,
            packageDetails: {
                currency: formData.salaryRange,
                totalCTC: parseFloat(formData.salaryValue) || 0,
            },
            startDate:             formData.tentativeStartDate,
            endDate:               formData.tentativeEndDate,
            rounds:                roundNames,
            skills:                aggregatedSkills,
            numberOfStudent:       studentCounts,
            contactPerson:         formData.contactPerson,
            noOfplacedStudents:    formData.minStudentsToBePlaced,
            amenitiesRequired:     formData.amenities,
            description:           formData.description,
            companyType:           formData.companyType,
            proposedSchedule:      formData.proposedSchedule,
            roundDetails:          nonEmptyRounds,
            roundSkills:           roundSkills,
        };

        try {
            const token = localStorage.getItem('token') || document.cookie.split('; ').find(row => row.startsWith('jwt='))?.split('=')[1];
            const response = await axios.post(
                `${import.meta.env.VITE_Backend_URL}/api/hiring-channels/pool-campus/college-request`,
                payload,
                { withCredentials: true, headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` } }
            );
            toast.success(response.data.message);
            resetForm();
        } catch (error) {
            console.error('Submission error:', error);
            toast.error('Something went wrong!');
        } finally {
            setIsSubmitting(false);
        }
    };

    // ─── Shared CreatableSelect styles (glassmorphism theme) ──────────────────
    const selectStyles = {
        control: (base, state) => ({
            ...base,
            minHeight: '42px',
            borderRadius: '8px',
            fontSize: '14px',
            backgroundColor: 'rgba(255, 255, 255, 0.5)',
            backdropFilter: 'blur(8px)',
            borderColor: state.isFocused ? '#93c5fd' : 'rgba(255, 255, 255, 0.5)',
            boxShadow: state.isFocused ? '0 0 0 1px #93c5fd' : 'none',
            '&:hover': { borderColor: '#93c5fd' },
        }),
        menu: (base) => ({ ...base, fontSize: '14px', zIndex: 30 }),
        multiValue: (base) => ({
            ...base,
            background: 'linear-gradient(to right, rgba(147,197,253,0.2), rgba(59,130,246,0.2))',
            borderRadius: '9999px',
        }),
        multiValueLabel: (base) => ({
            ...base,
            color: '#3b82f6',
            fontWeight: 600,
            fontSize: '12px',
            paddingLeft: '8px',
        }),
        multiValueRemove: (base) => ({
            ...base,
            color: '#3b82f6',
            borderRadius: '9999px',
            ':hover': { backgroundColor: 'rgba(59,130,246,0.2)', color: '#3b82f6' },
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

    const totalStudents = formData.rounds.reduce((sum, round) => sum + (parseInt(round.students) || 0), 0);

    // ─── JSX ───────────────────────────────────────────────────────────────────
    return (
        <div className="min-h-screen bg-gradient-to-br from-[#f0e6f7]/60 via-[#d4e8f9]/55 to-[#cff7ea]/60">
            {/* Pastel blur background elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#fbcfe8]/20 rounded-full blur-3xl"></div>
                <div className="absolute top-1/3 -left-20 w-60 h-60 bg-[#93c5fd]/20 rounded-full blur-3xl"></div>
                <div className="absolute bottom-20 right-1/3 w-40 h-40 bg-[#a7f3d0]/20 rounded-full blur-3xl"></div>
            </div>

            <div className="relative z-10 container mx-auto px-4 py-6 max-w-5xl">
                {/* Header */}
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

                {/* Alert */}
                {alert.show && (
                    <div className={`mb-4 p-3 rounded-lg border ${alert.type === 'error' ? 'bg-red-50 border-red-200 text-red-800' : 'bg-green-50 border-green-200 text-green-800'}`}>
                        {alert.message}
                    </div>
                )}

                {/* Form */}
                <div className="bg-white/90 backdrop-blur-sm border border-white/50 rounded-2xl shadow-lg shadow-blue-50/50 p-6">
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-[#3b82f6] to-[#8b5cf6] bg-clip-text text-transparent mb-6 text-center">
                        Register for Pool Campus Hiring 
                    </h2>
                    <p className="text-gray-600 mb-8 text-center text-sm">
                        Fill in the details below to register for the hiring drive
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-8">

                        {/* ============ SECTION 1: HIRING DETAILS ============ */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <MapPin className="w-5 h-5 text-[#3b82f6]" />
                                <h3 className="text-lg font-semibold text-gray-800">Hiring Details</h3>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                {/* Hiring Venue */}
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
                                                '&:hover': { borderColor: errors.venue ? '#fca5a5' : '#93c5fd' },
                                            }),
                                            menu: (base) => ({ ...base, fontSize: '14px' }),
                                        }}
                                    />
                                    {errors.venue && <p className="mt-1 text-xs text-red-600">{errors.venue}</p>}
                                </div>

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
                            </div>
                        </div>

                        {/* ============ SECTION 2: ACADEMIC DETAILS ============ */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <BookOpen className="w-5 h-5 text-[#3b82f6]" />
                                <h3 className="text-lg font-semibold text-gray-800">Academic Details</h3>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

                                {/* ── Degree (dynamic, multi, creatable) ── */}
                                <div>
                                    <label className="block text-gray-700 font-medium mb-2 text-sm flex items-center gap-1.5">
                                        <GraduationCap className="w-4 h-4 text-[#3b82f6]" />
                                        Degree(s) <span className="text-red-500">*</span>
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
                                            // Atomic update: set degree + reset stream together
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
                                    {errors.degree && <p className="mt-1 text-xs text-red-600">{errors.degree}</p>}
                                </div>

                                {/* ── Stream (dynamic, multi, creatable, disabled until degree picked) ── */}
                                <div>
                                    <label className="block text-gray-700 font-medium mb-2 text-sm flex items-center gap-1.5">
                                        <GraduationCap className="w-4 h-4 text-[#3b82f6]" />
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
                                        placeholder={formData.degree.length === 0 ? "Select a degree first" : "Select or add stream(s)"}
                                        onChange={(selected) => {
                                            setFormData(prev => ({ ...prev, stream: selected || [] }));
                                        }}
                                        onCreateOption={async (val) => {
                                            const parentId = selectedDegreeIds[0] || null;
                                            try {
                                                const res = await createMasterData({ type: "STREAM", value: val, parent: parentId });
                                                const newOpt = { value: res.data.data._id, label: res.data.data.value };
                                                setStreamOptions(prev => [...prev, newOpt]);
                                                setFormData(prev => ({ ...prev, stream: [...prev.stream, newOpt] }));
                                            } catch (err) {
                                                console.error("Error adding stream", err);
                                                toast.error("Could not add stream.");
                                            }
                                        }}
                                    />
                                </div>

                                {/* Employment Type */}
                                <div className="lg:col-span-2">
                                    <label className="block text-gray-700 font-medium mb-2 text-sm flex items-center gap-1.5">
                                        <Briefcase className="w-4 h-4 text-[#3b82f6]" />
                                        Employment type <span className="text-red-500">*</span>
                                    </label>
                                    <div className="flex gap-2">
                                        {['Part-time', 'Full-time', 'Contract'].map((type) => (
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
                                    {errors.employmentType && <p className="mt-1 text-xs text-red-600">{errors.employmentType}</p>}
                                </div>
                            </div>
                        </div>

                        {/* ============ SECTION 3: CONTACT DETAILS ============ */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <UsersIcon className="w-5 h-5 text-[#3b82f6]" />
                                <h3 className="text-lg font-semibold text-gray-800">Contact Details</h3>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-gray-700 font-medium mb-2 text-sm flex items-center gap-1.5">
                                        <User className="w-4 h-4 text-[#3b82f6]" />
                                        Contact Person Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text" name="name" value={formData.contactPerson.name}
                                        onChange={handleContactChange} placeholder="Enter full name"
                                        className={`w-full bg-white/50 backdrop-blur-sm border ${errors.contactPersonName ? 'border-red-300' : 'border-white/50'} rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#93c5fd] focus:border-transparent`}
                                    />
                                    {errors.contactPersonName && <p className="mt-1 text-xs text-red-600">{errors.contactPersonName}</p>}
                                </div>

                                <div>
                                    <label className="block text-gray-700 font-medium mb-2 text-sm flex items-center gap-1.5">
                                        <User className="w-4 h-4 text-[#3b82f6]" />
                                        Designation <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                       <div>
 
 

  <CreatableSelect
    isClearable
    isSearchable
    isLoading={isLoadingDesignation}
    options={designationOptions}
    styles={errors.contactPersonDesignation ? selectStylesError : selectStyles}
    placeholder="Select or create designation"
    value={
      formData.contactPerson.designation
        ? {
            value: formData.contactPerson.designation,
            label: formData.contactPerson.designation,
          }
        : null
    }
    onChange={(selected) => {
      setFormData(prev => ({
        ...prev,
        contactPerson: {
          ...prev.contactPerson,
          designation: selected?.value || "",
        },
      }));

      if (errors.contactPersonDesignation) {
        setErrors(prev => ({ ...prev, contactPersonDesignation: "" }));
      }
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
          setFormData(prev => ({
            ...prev,
            contactPerson: {
              ...prev.contactPerson,
              designation: normalized,
            },
          }));
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

        setDesignationOptions(prev => [...prev, newOption]);

        setFormData(prev => ({
          ...prev,
          contactPerson: {
            ...prev.contactPerson,
            designation: normalized,
          },
        }));

        toast.success("Designation added");
      } catch (err) {
        console.error("Error creating designation", err);
        toast.error("Could not add designation");
      }
    }}
    formatCreateLabel={(inputValue) => `Create "${inputValue}"`}
  />

  {errors.contactPersonDesignation && (
    <p className="mt-1 text-xs text-red-600">
      {errors.contactPersonDesignation}
    </p>
  )}
</div>
                                        {errors.contactPersonDesignation && <p className="mt-1 text-xs text-red-600">{errors.contactPersonDesignation}</p>}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-gray-700 font-medium mb-2 text-sm flex items-center gap-1.5">
                                        <Mail className="w-4 h-4 text-[#3b82f6]" />
                                        Email <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="email" name="email" value={formData.contactPerson.email}
                                        onChange={handleContactChange} placeholder="example@company.com"
                                        className={`w-full bg-white/50 backdrop-blur-sm border ${errors.contactPersonEmail ? 'border-red-300' : 'border-white/50'} rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#93c5fd] focus:border-transparent`}
                                    />
                                    {errors.contactPersonEmail && <p className="mt-1 text-xs text-red-600">{errors.contactPersonEmail}</p>}
                                </div>

                                <div>
                                    <label className="block text-gray-700 font-medium mb-2 text-sm flex items-center gap-1.5">
                                        <Phone className="w-4 h-4 text-[#3b82f6]" />
                                        Mobile No <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="tel" name="mobile" value={formData.contactPerson.mobile}
                                        onChange={handleContactChange} placeholder="10-digit mobile number"
                                        className={`w-full bg-white/50 backdrop-blur-sm border ${errors.contactPersonMobile ? 'border-red-300' : 'border-white/50'} rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#93c5fd] focus:border-transparent`}
                                    />
                                    {errors.contactPersonMobile && <p className="mt-1 text-xs text-red-600">{errors.contactPersonMobile}</p>}
                                </div>

                                <div className="lg:col-span-2">
                                    <label className="block text-gray-700 font-medium mb-2 text-sm flex items-center gap-1.5">
                                        <Linkedin className="w-4 h-4 text-[#3b82f6]" />
                                        LinkedIn Profile
                                    </label>
                                    <input
                                        type="url" name="linkedin" value={formData.contactPerson.linkedin}
                                        onChange={handleContactChange} placeholder="linkedin.com/in/username"
                                        className="w-full bg-white/50 backdrop-blur-sm border border-white/50 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#93c5fd] focus:border-transparent"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* ============ SECTION 4: PLACEMENT DETAILS ============ */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <Briefcase className="w-5 h-5 text-[#3b82f6]" />
                                <h3 className="text-lg font-semibold text-gray-800">Placement Details</h3>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
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
                                            {minStudentsOptions.map(option => <option key={option} value={option}>{option}</option>)}
                                        </select>
                                        {errors.minStudentsToBePlaced && <p className="mt-1 text-xs text-red-600">{errors.minStudentsToBePlaced}</p>}
                                    </div>
                                </div>

                                {/* Company Type */}
                                <div>
                                    <label className="block text-gray-700 font-medium mb-2 text-sm flex items-center gap-1.5">
                                        <Building className="w-4 h-4 text-[#3b82f6]" />
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
                                            setFormData(prev => ({ ...prev, companyType: (selected || []).map(s => s.value) }));
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
                                                setFormData(prev => ({ ...prev, companyType: [...prev.companyType, savedValue] }));
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
                            <div className="flex items-center gap-2">
                                <IndianRupee className="w-5 h-5 text-[#3b82f6]" />
                                <h3 className="text-lg font-semibold text-gray-800">Compensation Details</h3>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                {/* Salary */}
                                <div>
                                    <label className="block text-gray-700 font-medium mb-2 text-sm flex items-center gap-1.5">
                                        <IndianRupee className="w-4 h-4 text-[#3b82f6]" />
                                        Minimum Cut-off Salary
                                    </label>
                                    <div className="flex rounded-lg overflow-hidden border border-gray-200/80 focus-within:ring-1 focus-within:ring-[#93c5fd] focus-within:border-transparent transition-all duration-200">
                                        <div className="relative bg-white/50 backdrop-blur-sm flex items-center">
                                            <div className="px-3 py-2 w-24 text-sm flex items-center gap-2">
                                                {formData.salaryRange === 'INR' ? (
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
                                                name="salaryValue" type="number"
                                                className="bg-white/50 backdrop-blur-sm w-full px-3 py-2 text-sm focus:outline-none"
                                                placeholder="Amount" value={formData.salaryValue || ''}
                                                onChange={handleChange} min="0" step="1000"
                                            />
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
                                                dateFormat="dd-MM-yyyy" placeholderText="Start"
                                                className="w-full bg-white/50 backdrop-blur-sm border border-white/50 rounded px-2 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#93c5fd] focus:border-transparent pl-8"
                                            />
                                            <Calendar className="absolute left-2 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                                        </div>
                                        <div className="relative">
                                            <DatePicker
                                                selected={formData.tentativeEndDate ? new Date(formData.tentativeEndDate) : null}
                                                onChange={(date) => handleDateChange(date, 'tentativeEndDate')}
                                                dateFormat="dd-MM-yyyy" placeholderText="End"
                                                className="w-full bg-white/50 backdrop-blur-sm border border-white/50 rounded px-2 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#93c5fd] focus:border-transparent pl-8"
                                            />
                                            <Calendar className="absolute left-2 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ============ SECTION 6: STUDENT DETAILS ============ */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <Users className="w-5 h-5 text-[#3b82f6]" />
                                <h3 className="text-lg font-semibold text-gray-800">Student Details</h3>
                            </div>

                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <label className="block text-gray-700 font-medium text-sm flex items-center gap-1.5">
                                        <List className="w-4 h-4 text-[#3b82f6]" />
                                        Student Information
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
                                                <th className="px-2 py-1.5 text-left font-medium text-gray-500">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white/30 divide-y divide-white/50">
                                            {formData.rounds.map((round, index) => {
                                                const rowStreams = getRowStreams(round.branch);
                                                return (
                                                    <tr key={round.id}>
                                                        <td className="px-2 py-1.5 text-center">{index + 1}</td>
                                                        <td className="px-2 py-1.5">
                                                            <select
                                                                className="w-full bg-white/50 backdrop-blur-sm border border-white/50 rounded px-1.5 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-[#93c5fd] focus:border-transparent"
                                                                value={round.branch}
                                                                onChange={(e) => {
                                                                    const newBranch = e.target.value;
                                                                    handleRoundChange(round.id, 'branch', newBranch);
                                                                    fetchStreamsForRow(newBranch);
                                                                }}
                                                            >
                                                                <option value="">Select</option>
                                                                {degreeOptions.map(opt => (
                                                                    <option key={opt.value} value={opt.label}>{opt.label}</option>
                                                                ))}
                                                            </select>
                                                        </td>
                                                        <td className="px-2 py-1.5">
                                                            <input
                                                                type="number"
                                                                className="w-full bg-white/50 backdrop-blur-sm border border-white/50 rounded px-1.5 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-[#93c5fd] focus:border-transparent"
                                                                value={round.students}
                                                                onChange={(e) => handleRoundChange(round.id, 'students', e.target.value)}
                                                                min="0" placeholder="0"
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
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                                {formData.rounds.length === 0 && (
                                    <div className="text-center py-4 text-gray-500 text-sm">
                                        No student details added. Click "Add Student" to get started.
                                    </div>
                                )}

                                <div className="mt-2 p-2 bg-gradient-to-r from-[#93c5fd]/10 to-[#3b82f6]/10 border border-[#93c5fd]/20 rounded text-xs">
                                    <div className="flex items-center justify-between">
                                        <span className="font-medium text-[#3b82f6]">Total Students:</span>
                                        <span className="font-bold text-[#3b82f6]">{totalStudents}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ============ SECTION 7: SCHEDULE DETAILS ============ */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <Clock className="w-5 h-5 text-[#3b82f6]" />
                                <h3 className="text-lg font-semibold text-gray-800">Schedule Details</h3>
                            </div>

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
                                            dateFormat="dd-MM-yyyy" placeholderText="Start Date"
                                            className={`w-full bg-white/50 backdrop-blur-sm border ${errors.proposedStartDate ? 'border-red-300' : 'border-white/50'} rounded-lg p-2.5 pl-9 text-sm focus:outline-none focus:ring-1 focus:ring-[#93c5fd] focus:border-transparent`}
                                        />
                                        <Calendar className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400" size={14} />
                                        {errors.proposedStartDate && <p className="mt-1 text-xs text-red-600">{errors.proposedStartDate}</p>}
                                    </div>
                                    <div className="relative">
                                        <DatePicker
                                            selected={formData.proposedSchedule.endDate ? new Date(formData.proposedSchedule.endDate) : null}
                                            onChange={(date) => handleProposedDateChange(date, 'endDate')}
                                            dateFormat="dd-MM-yyyy" placeholderText="End Date"
                                            className={`w-full bg-white/50 backdrop-blur-sm border ${errors.proposedEndDate ? 'border-red-300' : 'border-white/50'} rounded-lg p-2.5 pl-9 text-sm focus:outline-none focus:ring-1 focus:ring-[#93c5fd] focus:border-transparent`}
                                        />
                                        <Calendar className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400" size={14} />
                                        {errors.proposedEndDate && <p className="mt-1 text-xs text-red-600">{errors.proposedEndDate}</p>}
                                    </div>
                                    <div className="relative">
                                        <select
                                            name="preferredMode"
                                            className={`w-full bg-white/50 backdrop-blur-sm border ${errors.proposedMode ? 'border-red-300' : 'border-white/50'} rounded-lg p-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#93c5fd] focus:border-transparent`}
                                            value={formData.proposedSchedule.preferredMode}
                                            onChange={handleProposedScheduleChange}
                                        >
                                            <option value="">Preferred Mode</option>
                                            {proposedModeOptions.map(option => <option key={option} value={option}>{option}</option>)}
                                        </select>
                                        {errors.proposedMode && <p className="mt-1 text-xs text-red-600">{errors.proposedMode}</p>}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ============ SECTION 8: ADDITIONAL INFORMATION ============ */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <FileText className="w-5 h-5 text-[#3b82f6]" />
                                <h3 className="text-lg font-semibold text-gray-800">Additional Information</h3>
                            </div>

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
                                                        <div
                                                            key={opt}
                                                            className={`px-3 py-2 hover:bg-[#93c5fd]/10 cursor-pointer border-b border-white/50 last:border-b-0 transition-colors duration-200 flex justify-between items-center ${formData.amenities.includes(opt) ? "bg-[#93c5fd]/10" : ""}`}
                                                            onClick={() => handleMultiToggle('amenities', opt)}
                                                        >
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
                                                        type="text" placeholder="Add custom facility..."
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
                                        placeholder="Additional information about the pool campus drive, specific requirements, or any other details..."
                                        value={formData.description}
                                        onChange={(e) => {
                                            handleChange(e);
                                            if (e.target.value.length > 500) {
                                                setDescriptionError("Description cannot exceed 500 characters.");
                                            } else {
                                                setDescriptionError("");
                                            }
                                        }}
                                        rows="4" maxLength={500}
                                    />
                                    <div className="flex justify-between text-xs mt-1">
                                        <span className={descriptionError ? 'text-red-500' : 'text-gray-500'}>
                                            {descriptionError ? descriptionError : `${formData.description.length}/500 characters`}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Form Actions */}
                        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 pt-6 border-t border-gray-200/50">
                            {onBackClick && (
                                <button
                                    type="button" onClick={onBackClick}
                                    className="flex items-center gap-1.5 text-gray-600 hover:text-gray-800 font-medium transition-colors duration-200 text-sm"
                                >
                                    <ArrowLeft className="w-3.5 h-3.5" />
                                    Back
                                </button>
                            )}
                            <button
                                type="submit" disabled={isSubmitting}
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