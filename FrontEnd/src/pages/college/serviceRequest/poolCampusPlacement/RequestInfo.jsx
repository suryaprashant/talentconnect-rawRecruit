import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { ChevronDown, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { City } from 'country-state-city';

export default function PoolCampusHiringForm() {
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

    // --- Refs ---
    const venueRef = useRef(null);
    const amenitiesRef = useRef(null);
    const degreeRef = useRef(null);
    const collegeTypesRef = useRef(null);
    const companyTypeRef = useRef(null);

    const [dropdownOpen, setDropdownOpen] = useState({
        venue: false,
        amenities: false,
        degree: false,
        collegeTypes: false,
        companyType: false
    });
    
    // --- Custom Input States ---
    const [customAmenity, setCustomAmenity] = useState('');
    const [customDegree, setCustomDegree] = useState('');
    const [customCollegeType, setCustomCollegeType] = useState('');
    const [customCompanyType, setCustomCompanyType] = useState('');

    // --- Search States ---
    const [venueSearch, setVenueSearch] = useState('');
    const [indianCities, setIndianCities] = useState([]);

    // --- Static Options ---
    const degreeOptions = ['B.Tech', 'M.Tech', 'MBA', 'B.Sc', 'M.Sc', 'PhD'];
    const collegeTypeOptions = ['Engineering', 'Medical', 'Management', 'Arts & Science', 'Law', 'Pharmacy', 'Architecture'];
    const workModeOptions = ['On-site', 'Remote', 'Hybrid'];
    const branchOptions = ['Computer Science', 'Mechanical', 'Civil', 'Electrical', 'Electronics', 'Bio-medical'];
    const designationOptions = ['HR Manager', 'Technical Recruiter', 'Talent Acquisition', 'Hiring Manager', 'Team Lead', 'Department Head', 'CEO', 'CTO', 'Founder', 'Other'];
    const minStudentsOptions = ['1-10', '11-25', '26-50', '51-100', '101-200', '200+'];
    const amenitiesOptions = ['Auditorium', 'Seminar Hall', 'Interview Rooms', 'Computer Labs', 'Wi-Fi Access', 'Projector'];
    const companyTypeOptions = ["MNC", "Startup", "SME", "Public Sector"];
    const proposedModeOptions = ["Online", "Offline", "Hybrid"];

    // --- Effects ---
    useEffect(() => {
        // Load cities for venue
        const cityNames = City.getCitiesOfCountry('IN')
          .map(city => city.name)
          .sort((a, b) => a.localeCompare(b));
        setIndianCities(['Online', 'Other', ...cityNames]);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            const refs = {
                venue: venueRef,
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
    
    // --- Filtered List ---
    const filteredVenues = indianCities.filter(city =>
        city.toLowerCase().includes(venueSearch.toLowerCase())
    );

    // --- Handlers ---
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Handler for single-select custom dropdowns
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

    // Generic handler for adding custom items (multi-select) - CUSTOM ITEMS ADDED AT TOP
    const handleCustomAdd = (field, item, setCustomInput) => {
        const trimmedItem = item.trim();
        if (trimmedItem) {
            setFormData(prev => {
                const currentValues = prev[field] || [];
                if (currentValues.map(v => v.toLowerCase()).includes(trimmedItem.toLowerCase())) {
                    toast.error("Item already in the list.");
                    return prev;
                }
                // Add custom item at the top of the list
                return { ...prev, [field]: [trimmedItem, ...currentValues] };
            });
        }
        setCustomInput('');
    };
    
    // Handler for adding custom single-select item
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
        <div className="max-w-4xl mx-auto p-4 font-sans">
            {alert.show && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
                    <div className={`relative p-6 rounded-lg shadow-lg w-full max-w-md text-center ${alert.type === 'success' ? 'bg-green-100' : 'bg-red-100'}`}>
                        <div className="flex flex-col items-center">
                            {alert.type === 'success' && (
                                <div className="w-12 h-12 rounded-full bg-green-200 p-2 flex items-center justify-center mx-auto mb-3">
                                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                </div>
                            )}
                            <strong className={`text-xl font-bold mb-2 ${alert.type === 'success' ? 'text-green-800' : 'text-red-800'}`}>
                                {alert.type === 'success' ? 'Success!' : 'Error!'}
                            </strong>
                            <span className={`text-sm ${alert.type === 'success' ? 'text-green-700' : 'text-red-700'}`}>{alert.message}</span>
                            <button onClick={() => setAlert({ show: false, message: '', type: '' })} className="absolute top-2 right-2 p-1 rounded-full hover:bg-black/10 transition-colors">
                                <X size={20} className={alert.type === 'success' ? 'text-green-800' : 'text-red-800'} />
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <div className="flex flex-col md:flex-row justify-between mb-8">
                <div className="md:w-1/2">
                    <h1 className="text-3xl font-bold mb-2">Pool Campus Connect:</h1>
                    <h2 className="text-3xl font-bold mb-4">Hire Bigger</h2>
                </div>
                <div className="md:w-1/2">
                    <p className="text-sm">Tap into diverse talent from multiple institutions through one powerful drive.</p>
                </div>
            </div>
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-center mb-4">Register for Pool Campus Hiring</h2>
                <p className="text-center text-gray-500 mb-6">Fill in the details below to register for the hiring drive</p>
                <form onSubmit={handleSubmit} className="space-y-6">
                    
                    {/* Pool Campus Hiring Venue (Searchable Dropdown) */}
                    <div ref={venueRef} className="relative">
                        <label className="block mb-1 font-medium">Pool Campus Hiring Venue <span className="text-red-500">*</span></label>
                        <div
                            onClick={() => setDropdownOpen(prev => ({ ...prev, venue: !prev.venue }))}
                            className="flex items-center justify-between p-2 w-full border rounded-md cursor-pointer hover:border-gray-400 min-h-[42px] bg-white"
                        >
                            <span className={formData.venue ? "text-black" : "text-gray-500"}>
                                {formData.venue || 'Select location'}
                            </span>
                            <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${dropdownOpen.venue ? "rotate-180" : ""}`} />
                        </div>
                        {dropdownOpen.venue && (
                            <div className="absolute z-20 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg">
                                <div className="p-2 border-b">
                                    <input
                                        type="text"
                                        value={venueSearch}
                                        onChange={(e) => setVenueSearch(e.target.value)}
                                        onClick={(e) => e.stopPropagation()}
                                        placeholder="Search for a location..."
                                        className="w-full p-2 border rounded"
                                    />
                                </div>
                                <div className="max-h-60 overflow-auto">
                                    {filteredVenues.map(location => (
                                        <div
                                            key={location}
                                            onClick={() => handleOptionSelect('venue', location)}
                                            className={`px-4 py-2 hover:bg-gray-100 cursor-pointer ${formData.venue === location ? "bg-gray-100 font-medium" : ""}`}
                                        >
                                            {location}
                                            {formData.venue === location && <span className="float-right text-gray-500">✓</span>}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                    {/* END Venue */}

                    {/* Degree (Multiselect + Custom Add) */}
                    <div ref={degreeRef} className="relative">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Degree(s) <span className="text-red-500">*</span></label>
                        <div className="relative">
                            <div
                                className="block w-full border border-gray-300 rounded-md px-3 py-2 min-h-[42px] cursor-pointer bg-white"
                                onClick={() => setDropdownOpen(prev => ({ ...prev, degree: !prev.degree }))}
                            >
                                {formData.degree.length > 0 ? (
                                    <div className="flex flex-wrap gap-1">
                                        {formData.degree.map(deg => (
                                            <span key={deg} className="flex items-center bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                                                {deg}
                                                <button type="button" onClick={(e) => { e.stopPropagation(); removeItem('degree', deg); }} className="ml-1.5"><X size={12} /></button>
                                            </span>
                                        ))}
                                    </div>
                                ) : <span className="text-gray-500">Select degrees</span>}
                            </div>
                            {dropdownOpen.degree && (
                                <div className="absolute z-20 w-full bg-white border rounded-md mt-1 shadow-lg">
                                    {/* Custom Input at TOP */}
                                    <div className="p-2 border-b flex">
                                        <input
                                            type="text"
                                            placeholder="Add custom degree..."
                                            className="w-full border-gray-300 border rounded-md px-2 py-1"
                                            value={customDegree}
                                            onChange={(e) => setCustomDegree(e.target.value)}
                                            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleCustomAdd('degree', customDegree, setCustomDegree); } }}
                                        />
                                        <button
                                            type="button"
                                            className="ml-2 px-3 py-1 bg-black text-white rounded text-sm"
                                            onClick={() => handleCustomAdd('degree', customDegree, setCustomDegree)}
                                        >
                                            Add
                                        </button>
                                    </div>
                                    {/* Predefined Options */}
                                    <div className="max-h-60 overflow-auto">
                                        {degreeOptions.map(opt => (
                                            <div key={opt} className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${formData.degree.includes(opt) ? 'bg-gray-200' : ''}`} onClick={() => handleMultiToggle('degree', opt)}>{opt}</div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    {/* END Degree */}

                    {/* Type of College (Custom Add Dropdown) */}
                    <div ref={collegeTypesRef} className="relative">
                        <label htmlFor="collegeTypes" className="block text-sm font-medium text-gray-700 mb-1">Type of College</label>
                        <div
                            onClick={() => setDropdownOpen(prev => ({ ...prev, collegeTypes: !prev.collegeTypes }))}
                            className="flex items-center justify-between p-2 w-full border rounded-md cursor-pointer hover:border-gray-400 min-h-[42px] bg-white"
                        >
                            <span className={formData.collegeTypes ? "text-black" : "text-gray-500"}>
                                {formData.collegeTypes || 'Select college type'}
                            </span>
                            <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${dropdownOpen.collegeTypes ? "rotate-180" : ""}`} />
                        </div>
                        {dropdownOpen.collegeTypes && (
                            <div className="absolute z-20 w-full bg-white border rounded-md mt-1 shadow-lg">
                                {/* Custom Input at TOP */}
                                <div className="p-2 border-b flex">
                                    <input
                                        type="text"
                                        placeholder="Add custom type..."
                                        className="w-full border-gray-300 border rounded-md px-2 py-1"
                                        value={customCollegeType}
                                        onChange={(e) => setCustomCollegeType(e.target.value)}
                                        onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleCustomSingleAdd('collegeTypes', customCollegeType, setCustomCollegeType); } }}
                                    />
                                    <button
                                        type="button"
                                        className="ml-2 px-3 py-1 bg-black text-white rounded text-sm"
                                        onClick={() => handleCustomSingleAdd('collegeTypes', customCollegeType, setCustomCollegeType)}
                                    >
                                        Add
                                    </button>
                                </div>
                                {/* Predefined Options */}
                                <div className="max-h-60 overflow-auto">
                                    {collegeTypeOptions.map(option => (
                                        <div
                                            key={option}
                                            onClick={() => handleOptionSelect('collegeTypes', option)}
                                            className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${formData.collegeTypes === option ? 'bg-gray-200' : ''}`}
                                        >
                                            {option}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                    {/* END Type of College */}

                    {/* Company Type (Multiselect + Custom Add) */}
                    <div ref={companyTypeRef} className="relative">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Company Type</label>
                        <div className="relative">
                            <div
                                className="block w-full border border-gray-300 rounded-md px-3 py-2 min-h-[42px] cursor-pointer bg-white"
                                onClick={() => setDropdownOpen(prev => ({ ...prev, companyType: !prev.companyType }))}
                            >
                                {formData.companyType.length > 0 ? (
                                    <div className="flex flex-wrap gap-1">
                                        {formData.companyType.map(item => (
                                            <span key={item} className="flex items-center bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                                                {item}
                                                <button type="button" onClick={(e) => { e.stopPropagation(); removeItem('companyType', item); }} className="ml-1.5"><X size={12} /></button>
                                            </span>
                                        ))}
                                    </div>
                                ) : <span className="text-gray-500">Select company types</span>}
                            </div>
                            {dropdownOpen.companyType && (
                                <div className="absolute z-20 w-full bg-white border rounded-md mt-1 shadow-lg">
                                    {/* Custom Input at TOP */}
                                    <div className="p-2 border-b flex">
                                        <input
                                            type="text"
                                            placeholder="Add custom type..."
                                            className="w-full border-gray-300 border rounded-md px-2 py-1"
                                            value={customCompanyType}
                                            onChange={(e) => setCustomCompanyType(e.target.value)}
                                            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleCustomAdd('companyType', customCompanyType, setCustomCompanyType); } }}
                                        />
                                        <button
                                            type="button"
                                            className="ml-2 px-3 py-1 bg-black text-white rounded text-sm"
                                            onClick={() => handleCustomAdd('companyType', customCompanyType, setCustomCompanyType)}
                                        >
                                            Add
                                        </button>
                                    </div>
                                    {/* Predefined Options */}
                                    <div className="max-h-60 overflow-auto">
                                        {companyTypeOptions.map(opt => (
                                            <div key={opt} className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${formData.companyType.includes(opt) ? 'bg-gray-200' : ''}`} onClick={() => handleMultiToggle('companyType', opt)}>{opt}</div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    {/* END Company Type */}

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Work Mode</label>
                        <div className="flex space-x-2">
                            {workModeOptions.map((type) => (
                                <button key={type} type="button" className={`px-4 py-2 text-sm border rounded-md transition-colors ${formData.workMode.includes(type) ? 'bg-black text-white' : 'bg-white text-gray-700'}`} onClick={() => handleMultiToggle('workMode', type)}>{type}</button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Employment type</label>
                        <div className="flex space-x-2">
                            {['Part-time', 'Full-time', 'Contract'].map((type) => (
                                <button key={type} type="button" className={`px-4 py-2 text-sm border rounded-md transition-colors ${formData.employmentType.includes(type) ? 'bg-black text-white' : 'bg-white text-gray-700'}`} onClick={() => handleMultiToggle('employmentType', type)}>{type}</button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Application Start/End Date</label>
                        <div className="flex flex-col md:flex-row gap-4">
                            <input name="tentativeStartDate" type="date" className="block w-full border border-gray-300 rounded-md px-3 py-2" value={formData.tentativeStartDate} onChange={handleChange} />
                            <input name="tentativeEndDate" type="date" className="block w-full border border-gray-300 rounded-md px-3 py-2" value={formData.tentativeEndDate} onChange={handleChange} />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Proposed Schedule (Tentative Dates)</label>
                        <div className="space-y-2">
                            <div className="flex flex-col md:flex-row gap-4">
                                <input type="date" name="startDate" placeholder="Proposed Start Date" className="block w-full border border-gray-300 rounded-md px-3 py-2" value={formData.proposedSchedule.startDate} onChange={handleProposedScheduleChange} />
                                <input type="date" name="endDate" placeholder="Proposed End Date" className="block w-full border border-gray-300 rounded-md px-3 py-2" value={formData.proposedSchedule.endDate} onChange={handleProposedScheduleChange} />
                            </div>
                            <div className="relative">
                                <select name="preferredMode" className="block w-full border border-gray-300 rounded-md px-3 py-2 appearance-none pr-10 bg-white" value={formData.proposedSchedule.preferredMode} onChange={handleProposedScheduleChange}>
                                    <option value="">Select Preferred Mode</option>
                                    {proposedModeOptions.map(option => (<option key={option} value={option}>{option}</option>))}
                                </select>
                                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none"><ChevronDown size={16} className="text-gray-400" /></div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Minimum Cut-off Salary</label>
                        <div className="flex rounded-md shadow-sm">
                            <select name="salaryRange" className="border border-gray-300 rounded-l-md px-3 py-2 w-24 bg-white" value={formData.salaryRange} onChange={handleChange}>
                                <option>USD</option><option>INR</option><option>EUR</option>
                            </select>
                            <input name="salaryValue" type="number" className="border border-gray-300 rounded-r-md px-3 py-2 flex-1" placeholder="Enter amount" value={formData.salaryValue} onChange={handleChange} />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Number of Rounds</label>
                        <div className="overflow-x-auto border border-gray-300 rounded-md">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">S.No.</th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Branch</th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">No. of Students</th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Skills (comma separated)</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {formData.rounds.map((round) => (
                                        <tr key={round.id}>
                                            <td className="px-4 py-2 text-sm">{round.id}</td>
                                            <td className="px-4 py-2">
                                                <div className="relative">
                                                    <select className="w-full px-2 py-1 border rounded-md text-sm appearance-none pr-8 bg-white" value={round.branch} onChange={(e) => handleRoundChange(round.id, 'branch', e.target.value)}>
                                                        <option value="">Select Branch</option>
                                                        {branchOptions.map(option => (<option key={option} value={option}>{option}</option>))}
                                                    </select>
                                                    <div className="absolute inset-y-0 right-0 flex items-center px-1 pointer-events-none"><ChevronDown size={14} className="text-gray-400" /></div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-2"><input type="number" className="w-full px-2 py-1 border rounded-md text-sm" value={round.students} onChange={(e) => handleRoundChange(round.id, 'students', e.target.value)} min="0" /></td>
                                            <td className="px-4 py-2"><input type="text" className="w-full px-2 py-1 border rounded-md text-sm" value={round.skills} onChange={(e) => handleRoundChange(round.id, 'skills', e.target.value)} placeholder="e.g., Python, SQL" /></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Amenities (Using generic handleCustomAdd) */}
                    <div ref={amenitiesRef} className="relative">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Campus Facilities/Amenities Provided</label>
                        <div className="relative">
                            <div className="block w-full border border-gray-300 rounded-md px-3 py-2 min-h-[42px] cursor-pointer bg-white" onClick={() => setDropdownOpen(prev => ({ ...prev, amenities: !prev.amenities }))}>
                                {formData.amenities.length > 0 ? (
                                    <div className="flex flex-wrap gap-1">
                                        {formData.amenities.map(item => (
                                            <span key={item} className="flex items-center bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                                                {item}
                                                <button type="button" onClick={(e) => { e.stopPropagation(); removeItem('amenities', item); }} className="ml-1.5"><X size={12} /></button>
                                            </span>
                                        ))}
                                    </div>
                                ) : <span className="text-gray-500">Select facilities</span>}
                            </div>
                            {dropdownOpen.amenities && (
                                <div className="absolute z-10 w-full bg-white border rounded-md mt-1 shadow-lg">
                                    {/* Custom Input at TOP */}
                                    <div className="p-2 border-b flex">
                                        <input
                                            type="text"
                                            placeholder="Add custom facility..."
                                            className="w-full border-gray-300 border rounded-md px-2 py-1"
                                            value={customAmenity}
                                            onChange={(e) => setCustomAmenity(e.target.value)}
                                            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleCustomAdd('amenities', customAmenity, setCustomAmenity); } }}
                                        />
                                        <button
                                            type="button"
                                            className="ml-2 px-3 py-1 bg-black text-white rounded text-sm"
                                            onClick={() => handleCustomAdd('amenities', customAmenity, setCustomAmenity)}
                                        >
                                            Add
                                        </button>
                                    </div>
                                    {/* Predefined Options */}
                                    <div className="max-h-60 overflow-auto">
                                        {amenitiesOptions.map(opt => (
                                            <div key={opt} className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${formData.amenities.includes(opt) ? 'bg-gray-200' : ''}`} onClick={() => handleMultiToggle('amenities', opt)}>{opt}</div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    {/* END Amenities */}

                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description / Message</label>
                        <textarea id="description" name="description" className="block w-full border border-gray-300 rounded-md px-3 py-2" placeholder="Any additional information..." value={formData.description} onChange={handleChange} rows="3"></textarea>
                    </div>

                    <hr />

                    <div>
                        <label className="block mb-1 font-medium">Contact Person Name <span className="text-red-500">*</span></label>
                        <input type="text" name="name" value={formData.contactPerson.name} onChange={handleContactChange} placeholder="Enter full name" className="w-full p-2 border rounded" required />
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
                        <input type="email" name="email" value={formData.contactPerson.email} onChange={handleContactChange} placeholder="example@company.com" className="w-full p-2 border rounded" required />
                    </div>
                    <div>
                        <label className="block mb-1 font-medium">Contact person mobile no <span className="text-red-500">*</span></label>
                        <input type="tel" name="mobile" value={formData.contactPerson.mobile} onChange={handleContactChange} placeholder="Enter 10-digit mobile number" className="w-full p-2 border rounded" required />
                    </div>
                    <div>
                        <label className="block mb-1 font-medium">Contact person LinkedIn Profile</label>
                        <input type="url" name="linkedin" value={formData.contactPerson.linkedin} onChange={handleContactChange} placeholder="https://www.linkedin.com/in/username" className="w-full p-2 border rounded" />
                    </div>
                    <div>
                        <label htmlFor="minStudentsToBePlaced" className="block text-sm font-medium text-gray-700 mb-1">Minimum Students to be Placed <span className="text-red-500">*</span></label>
                        <div className="relative">
                            <select id="minStudentsToBePlaced" name="minStudentsToBePlaced" className="block w-full border border-gray-300 rounded-md px-3 py-2 appearance-none pr-10 bg-white" value={formData.minStudentsToBePlaced} onChange={handleChange} required >
                                <option value="">Select Range</option>
                                {minStudentsOptions.map(option => (<option key={option} value={option}>{option}</option>))}
                            </select>
                            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none"><ChevronDown size={16} className="text-gray-400" /></div>
                        </div>
                    </div>

                    <div className="flex justify-end mt-6">
                        <button type="submit" disabled={isSubmitting} className="px-6 py-2 bg-black text-white font-medium rounded hover:bg-gray-800 transition-colors disabled:opacity-50">
                            {isSubmitting ? 'Submitting...' : 'Register'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}