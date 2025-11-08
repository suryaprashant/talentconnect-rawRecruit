import { useState, useRef, useEffect, useMemo } from 'react';
import axios from 'axios';
import { ChevronDown, X } from 'lucide-react';
import toast from 'react-hot-toast';

export default function OffCampusHiringForm() {
    const initialFormState = {
        venue: '',
        degree: [],
        collegeTypes: '',
        // criteria: '', // <-- Removed
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
        // --- NEW FIELDS ADDED ---
        companyType: [],
        proposedSchedule: { startDate: '', endDate: '', preferredMode: '' },
    };

    const [formData, setFormData] = useState(initialFormState);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [alert, setAlert] = useState({ show: false, message: '', type: '' });

    const amenitiesRef = useRef(null);
    const degreeRef = useRef(null);
    const companyTypeRef = useRef(null); // --- NEW REF ---

    const [dropdownOpen, setDropdownOpen] = useState({ amenities: false, degree: false, companyType: false });
    const [customAmenity, setCustomAmenity] = useState('');

    // --- Static Options ---
    const locations = ['Online', 'Bangalore', 'Mumbai', 'Delhi', 'Hyderabad', 'Chennai', 'Pune', 'Other'];
    const degreeOptions = ['B.Tech', 'M.Tech', 'MBA', 'B.Sc', 'M.Sc', 'PhD'];
    const collegeTypeOptions = ['Engineering', 'Medical', 'Management', 'Arts & Science', 'Law', 'Pharmacy', 'Architecture'];
    const workModeOptions = ['On-site', 'Remote', 'Hybrid'];
    const branchOptions = ['Computer Science', 'Mechanical', 'Civil', 'Electrical', 'Electronics', 'Bio-medical'];
    const designationOptions = ['HR Manager', 'Technical Recruiter', 'Talent Acquisition', 'Hiring Manager', 'Team Lead', 'Department Head', 'CEO', 'CTO', 'Founder', 'Other'];
    const minStudentsOptions = ['1-10', '11-25', '26-50', '51-100', '101-200', '200+'];
    const amenitiesOptions = ['Auditorium', 'Seminar Hall', 'Interview Rooms', 'Computer Labs', 'Wi-Fi Access', 'Projector'];
    
    // --- NEW OPTIONS ADDED ---
    const companyTypeOptions = ["MNC", "Startup", "SME", "Public Sector"];
    const proposedModeOptions = ["Online", "Offline", "Hybrid"];

    // --- Handlers ---
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (amenitiesRef.current && !amenitiesRef.current.contains(event.target)) {
                setDropdownOpen(prev => ({ ...prev, amenities: false }));
            }
            if (degreeRef.current && !degreeRef.current.contains(event.target)) {
                setDropdownOpen(prev => ({ ...prev, degree: false }));
            }
            // --- NEWLY ADDED ---
            if (companyTypeRef.current && !companyTypeRef.current.contains(event.target)) {
                setDropdownOpen(prev => ({ ...prev, companyType: false }));
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // --- NEW HANDLER ---
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

    const addItem = (field, item, setCustomInput) => {
        if (item.trim() && !formData[field].includes(item.trim())) {
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
        let roundSkills = []; // NEW: Store skills per round

        const nonEmptyRounds = formData.rounds.filter(round => round.students || round.branch || round.skills);
        nonEmptyRounds.forEach(round => {
            if (round.skills) {
                // Store skills exactly as entered for this round (no deduplication)
                roundSkills.push(round.skills);
                // For aggregated skills, push without making unique to preserve duplicates
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
            // eligibilityCriteria: formData.criteria, // <-- Removed
            workMode: formData.workMode,
            employmentType: formData.employmentType,
            packageDetails: {
                currency: formData.salaryRange,
                totalCTC: parseFloat(formData.salaryValue) || 0,
            },
            startDate: formData.tentativeStartDate,
            endDate: formData.tentativeEndDate,
            rounds: roundNames,
            studentStreams: [...new Set(studentStreams)], // Keep streams unique
            skills: aggregatedSkills, // CHANGED: Store all skills as entered (with duplicates)
            numberOfStudent: studentCounts,
            contactPerson: formData.contactPerson,
            noOfplacedStudents: formData.minStudentsToBePlaced,
            amenitiesRequired: formData.amenities,
            description: formData.description,
            // --- NEW PAYLOAD FIELDS ---
            companyType: formData.companyType,
            proposedSchedule: formData.proposedSchedule,
            roundDetails: nonEmptyRounds, // Sending the structured round data
            roundSkills: roundSkills, // NEW: Send skills per round exactly as entered
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
                    <div>
                        <label className="block mb-1 font-medium">Pool Campus Hiring Venue <span className="text-red-500">*</span></label>
                        <div className="relative">
                            <select name="venue" value={formData.venue} onChange={handleChange} className="w-full p-2 border rounded appearance-none pr-8 bg-white" required>
                                <option value="" disabled>Select location</option>
                                {locations.map((location) => (<option key={location} value={location}>{location}</option>))}
                            </select>
                            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none"><ChevronDown className="w-4 h-4 text-gray-400" /></div>
                        </div>
                    </div>

                    <div ref={degreeRef}>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Degree(s) <span className="text-red-500">*</span></label>
                        <div className="relative">
                            <div className="block w-full border border-gray-300 rounded-md px-3 py-2 min-h-[42px] cursor-pointer" onClick={() => setDropdownOpen(prev => ({ ...prev, degree: !prev.degree }))}>
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
                                <div className="absolute z-10 w-full bg-white border rounded-md mt-1 shadow-lg">
                                    {degreeOptions.map(opt => (
                                        <div key={opt} className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${formData.degree.includes(opt) ? 'bg-gray-200' : ''}`} onClick={() => handleMultiToggle('degree', opt)}>{opt}</div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <div>
                        <label htmlFor="collegeTypes" className="block text-sm font-medium text-gray-700 mb-1">Type of College</label>
                        <div className="relative">
                            <select id="collegeTypes" name="collegeTypes" className="block w-full border border-gray-300 rounded-md px-3 py-2 appearance-none pr-10" value={formData.collegeTypes} onChange={handleChange}>
                                <option value="">Select College Type</option>
                                {collegeTypeOptions.map(option => (<option key={option} value={option}>{option}</option>))}
                            </select>
                            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none"><ChevronDown size={16} className="text-gray-400" /></div>
                        </div>
                    </div>

                    {/* --- Eligibility Criteria Removed --- */}

                    {/* --- NEW: Company Type --- */}
                    <div ref={companyTypeRef}>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Company Type</label>
                        <div className="relative">
                            <div className="block w-full border border-gray-300 rounded-md px-3 py-2 min-h-[42px] cursor-pointer" onClick={() => setDropdownOpen(prev => ({ ...prev, companyType: !prev.companyType }))}>
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
                                <div className="absolute z-10 w-full bg-white border rounded-md mt-1 shadow-lg">
                                    {companyTypeOptions.map(opt => (
                                        <div key={opt} className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${formData.companyType.includes(opt) ? 'bg-gray-200' : ''}`} onClick={() => handleMultiToggle('companyType', opt)}>{opt}</div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                    {/* --- END NEW FIELD --- */}

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

                    {/* --- NEW: Proposed Schedule --- */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Proposed Schedule (Tentative Dates)</label>
                        <div className="space-y-2">
                            <div className="flex flex-col md:flex-row gap-4">
                                <input type="date" name="startDate" placeholder="Proposed Start Date" className="block w-full border border-gray-300 rounded-md px-3 py-2" value={formData.proposedSchedule.startDate} onChange={handleProposedScheduleChange} />
                                <input type="date" name="endDate" placeholder="Proposed End Date" className="block w-full border border-gray-300 rounded-md px-3 py-2" value={formData.proposedSchedule.endDate} onChange={handleProposedScheduleChange} />
                            </div>
                            <div className="relative">
                                <select name="preferredMode" className="block w-full border border-gray-300 rounded-md px-3 py-2 appearance-none pr-10" value={formData.proposedSchedule.preferredMode} onChange={handleProposedScheduleChange}>
                                    <option value="">Select Preferred Mode</option>
                                    {proposedModeOptions.map(option => (<option key={option} value={option}>{option}</option>))}
                                </select>
                                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none"><ChevronDown size={16} className="text-gray-400" /></div>
                            </div>
                        </div>
                    </div>
                    {/* --- END NEW FIELD --- */}

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Minimum Cut-off Salary</label>
                        <div className="flex rounded-md shadow-sm">
                            <select name="salaryRange" className="border border-gray-300 rounded-l-md px-3 py-2 w-24" value={formData.salaryRange} onChange={handleChange}>
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
                                                    <select className="w-full px-2 py-1 border rounded-md text-sm appearance-none pr-8" value={round.branch} onChange={(e) => handleRoundChange(round.id, 'branch', e.target.value)}>
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

                    <div ref={amenitiesRef}>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Campus Facilities/Amenities Provided</label>
                        <div className="relative">
                            <div className="block w-full border border-gray-300 rounded-md px-3 py-2 min-h-[42px] cursor-pointer" onClick={() => setDropdownOpen(prev => ({ ...prev, amenities: !prev.amenities }))}>
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
                                    {amenitiesOptions.map(opt => (
                                        <div key={opt} className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${formData.amenities.includes(opt) ? 'bg-gray-200' : ''}`} onClick={() => handleMultiToggle('amenities', opt)}>{opt}</div>
                                    ))}
                                    <div className="p-2">
                                        <input type="text" placeholder="Add custom facility..." className="w-full border-gray-300 border rounded-md px-2 py-1" value={customAmenity} onChange={(e) => setCustomAmenity(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addItem('amenities', customAmenity, setCustomAmenity); } }} />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description / Message</label>
                        <textarea id="description" name="description" className="block w-full border border-gray-300 rounded-md px-3 py-2" placeholder="Any additional information..." value={formData.description} onChange={handleChange} rows="3"></textarea>
                    </div>

                    <hr />

                    <div>
                        <label className="block mb-1 font-medium">Contact Person Name *</label>
                        <input type="text" name="name" value={formData.contactPerson.name} onChange={handleContactChange} placeholder="Enter full name" className="w-full p-2 border rounded" required />
                    </div>
                    <div>
                        <label className="block mb-1 font-medium">Contact person designation *</label>
                        <div className="relative">
                            <select name="designation" value={formData.contactPerson.designation} onChange={handleContactChange} className="w-full p-2 border rounded appearance-none pr-8 bg-white" required>
                                <option value="" disabled>Select designation</option>
                                {designationOptions.map((designation) => (<option key={designation} value={designation}>{designation}</option>))}
                            </select>
                            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none"><ChevronDown className="w-4 h-4 text-gray-400" /></div>
                        </div>
                    </div>
                    <div>
                        <label className="block mb-1 font-medium">Contact person email *</label>
                        <input type="email" name="email" value={formData.contactPerson.email} onChange={handleContactChange} placeholder="example@company.com" className="w-full p-2 border rounded" required />
                    </div>
                    <div>
                        <label className="block mb-1 font-medium">Contact person mobile no *</label>
                        <input type="tel" name="mobile" value={formData.contactPerson.mobile} onChange={handleContactChange} placeholder="Enter 10-digit mobile number" className="w-full p-2 border rounded" required />
                    </div>
                    <div>
                        <label className="block mb-1 font-medium">Contact person LinkedIn Profile</label>
                        <input type="url" name="linkedin" value={formData.contactPerson.linkedin} onChange={handleContactChange} placeholder="https://www.linkedin.com/in/username" className="w-full p-2 border rounded" />
                    </div>
                    <div>
                        <label htmlFor="minStudentsToBePlaced" className="block text-sm font-medium text-gray-700 mb-1">Minimum Students to be Placed *</label>
                        <div className="relative">
                            <select id="minStudentsToBePlaced" name="minStudentsToBePlaced" className="block w-full border border-gray-300 rounded-md px-3 py-2 appearance-none pr-10" value={formData.minStudentsToBePlaced} onChange={handleChange} required >
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