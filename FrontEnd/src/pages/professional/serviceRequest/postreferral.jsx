import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from "@/components/dashboard/PageHeader";
import { postReferralJob, getSkills, addSkill, getMasterDataByType, createMasterData } from '@/lib/User_AxiosInstance';
import CreatableSelect from 'react-select/creatable';
import { ChevronDown, X, Briefcase, MapPin, GraduationCap, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { City } from 'country-state-city';

// ─── Reusable layout primitives ───────────────────────────────────────────────
const SectionHeader = ({ icon: Icon, title, subtitle, step }) => (
    <div className="flex items-start gap-3 mb-6 pb-4 border-b border-gray-100">
        <div className="flex items-center justify-center w-7 h-7 rounded-full bg-gradient-to-br from-[#667eea] to-[#764ba2] text-white text-xs font-bold shadow shadow-[#667eea]/30 shrink-0 mt-0.5">
            {step}
        </div>
        <div className="flex-1">
            <div className="flex items-center gap-2">
                <Icon className="h-4 w-4 text-[#667eea]" />
                <h2 className="text-sm font-semibold text-gray-800">{title}</h2>
            </div>
            {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
        </div>
    </div>
);

const FieldLabel = ({ htmlFor, children, required }) => (
    <label htmlFor={htmlFor} className="block mb-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">
        {children}{required && <span className="text-red-400 ml-0.5">*</span>}
    </label>
);

const inputCls = "w-full px-3 py-2 text-sm text-gray-800 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#667eea]/25 focus:border-[#667eea] transition-all placeholder:text-gray-400";
const textareaCls = `${inputCls} resize-none`;

const selectStyles = {
    control: (base, state) => ({
        ...base,
        minHeight: '38px',
        borderRadius: '8px',
        fontSize: '13px',
        borderColor: state.isFocused ? '#667eea' : '#e5e7eb',
        boxShadow: state.isFocused ? '0 0 0 3px rgba(102,126,234,0.12)' : 'none',
        backgroundColor: '#fff',
        '&:hover': { borderColor: '#667eea' },
    }),
    menu: (base) => ({ ...base, fontSize: '13px', zIndex: 30, borderRadius: '8px', border: '1px solid #e5e7eb', boxShadow: '0 8px 24px rgba(0,0,0,0.08)' }),
    multiValue: (base) => ({ ...base, backgroundColor: '#ede9fe', borderRadius: '6px' }),
    multiValueLabel: (base) => ({ ...base, color: '#5b21b6', fontWeight: 600, fontSize: '11px', paddingLeft: '8px' }),
    multiValueRemove: (base) => ({ ...base, color: '#7c3aed', borderRadius: '0 6px 6px 0', ':hover': { backgroundColor: 'rgba(124,58,237,0.15)', color: '#5b21b6' } }),
    placeholder: (base) => ({ ...base, color: '#9ca3af', fontSize: '13px' }),
    option: (base, state) => ({ ...base, fontSize: '13px', backgroundColor: state.isSelected ? '#ede9fe' : state.isFocused ? '#f5f3ff' : '#fff', color: state.isSelected ? '#5b21b6' : '#374151' }),
    singleValue: (base) => ({ ...base, fontSize: '13px', color: '#1f2937' }),
};

const chipCls = "inline-flex items-center gap-1 px-2.5 py-1 bg-violet-50 border border-violet-200 text-violet-700 text-xs font-semibold rounded-full";
const chipBtnCls = "hover:bg-violet-100 rounded-full p-0.5 transition-colors";

const PillBtn = ({ label, active, onClick }) => (
    <button
        type="button"
        onClick={onClick}
        className={`px-4 py-1.5 text-xs font-semibold rounded-full border transition-all duration-150
            ${active
                ? 'bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white border-transparent shadow-sm shadow-[#667eea]/30'
                : 'bg-white text-gray-600 border-gray-200 hover:border-[#667eea]/50 hover:text-[#667eea]'
            }`}
    >
        {label}
    </button>
);

const DropTrigger = ({ label, isOpen, onClick }) => (
    <div
        onClick={onClick}
        className={`flex items-center justify-between px-3 py-2 w-full border rounded-lg cursor-pointer text-sm transition-all
            ${isOpen ? 'border-[#667eea] ring-2 ring-[#667eea]/10' : 'border-gray-200 hover:border-[#667eea]/50'}
            bg-white text-gray-500`}
    >
        <span>{label}</span>
        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180 text-[#667eea]' : 'text-gray-400'}`} />
    </div>
);

// ─── Main Component ────────────────────────────────────────────────────────────
function PostReferralJobPage() {
    const navigate = useNavigate();

    const initialState = {
        jobTitle: '',
        description: '',
        employmentType: 'Full-time',
        workMode: 'On-site',
        location: [],
        packageDetails: {
            currency: 'USD',
            totalCTC: '',
            fixedPay: '',
            joiningBonus: ''
        },
        numberOfOpenings: '',
        minEducation: '',
      minYearsOfExperience: '',
maxYearsOfExperience: '',
        skills: [],
        certifications: [],
        workAuthorization: '',
        studentStreams: [],
        eligibilityCriteria: '',
        benefits: [],
        tags: [],
        broadcastType: 'Everyone',
    };

    const degreesDropdownRef = useRef(null);
    const [formData, setFormData] = useState(initialState);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [dropdownOpen, setDropdownOpen] = useState({
        skills: false,
        certifications: false,
        locations: false,
        benefits: false,
        tags: false,
    });

    const [skillInput, setSkillInput] = useState('');
    const [certificationInput, setCertificationInput] = useState('');
    const [benefitInput, setBenefitInput] = useState('');
    const [locationSearch, setLocationSearch] = useState('');
    const [indianCities, setIndianCities] = useState([]);
    const [descriptionError, setDescriptionError] = useState("");

    const skillsDropdownRef = useRef(null);
    const certificationsDropdownRef = useRef(null);
    const locationsDropdownRef = useRef(null);
    const benefitsDropdownRef = useRef(null);
    const tagsDropdownRef = useRef(null);

    const experienceOptions = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "15", "20+"];
    const allCertifications = ["AWS Certified", "Microsoft Certified", "Google Cloud Certified", "Cisco Certified", "PMP"];
    const allBenefits = ["Health Insurance", "401(k)", "Paid Time Off", "Flexible Schedule", "Dental Insurance"];
    const workAuthOptions = ["Citizens Only", "Permanent Residents", "Work Visa Holders", "Any"];
    const tagsOptions = ['Urgent hiring', 'Fresher preferred', 'Remote-friendly', 'Work from Home', 'Internship-eligible', 'Hybrid', 'High Priority', 'Contract', 'Part-time', 'Full-time'];

    const filteredCertifications = allCertifications.filter(cert => cert.toLowerCase().includes(certificationInput.toLowerCase()));
    const filteredBenefits = allBenefits.filter(benefit => benefit.toLowerCase().includes(benefitInput.toLowerCase()));
    const filteredCities = indianCities.filter(city => city.name.toLowerCase().includes(locationSearch.toLowerCase()));

    const [degreeOptions, setDegreeOptions] = useState([]);
    const [streamOptions, setStreamOptions] = useState([]);
    const [selectedDegreeId, setSelectedDegreeId] = useState(null);
    const [isLoadingDegrees, setIsLoadingDegrees] = useState(false);
    const [isLoadingStreams, setIsLoadingStreams] = useState(false);

 const [fetchedSkills, setFetchedSkills] = useState([]);

useEffect(() => {
    const fetchSkills = async () => {
        try {
            const res = await getSkills();
            const skills = res.data.map(s => s.skills);
            setFetchedSkills(skills);
        } catch (err) {
            console.error("Error loading skills:", err);
        }
    };

    fetchSkills();
}, []);
// const handleAddNewSkill = async (skillName) => {
//     const trimmed = skillName.trim();
//     if (!trimmed) return;

//     try {
//         const res = await addSkill({ skills: trimmed });

//         const newSkill = res.data.skills;

//         setFetchedSkills(prev => [...prev, newSkill]);

//         setFormData(prev => ({
//             ...prev,
//             skills: [...prev.skills, newSkill]
//         }));

//         toast.success(`Skill "${newSkill}" added`);
//     } catch (err) {
//         if (err.response?.status === 409) {
//             toast.error("Skill already exists");
//         } else {
//             toast.error("Failed to add skill");
//         }
//     }
// };
const handleAddNewSkill = async (skillName) => {
    const trimmed = skillName.trim();
    if (!trimmed) return;

    try {
        const res = await addSkill(trimmed);

        const newSkill = res.data.skills;

        setFetchedSkills(prev => [...prev, newSkill]);

        setFormData(prev => ({
            ...prev,
            skills: [...prev.skills, newSkill]
        }));

        toast.success(`Skill "${newSkill}" added`);

    } catch (err) {

        console.log("Skill error:", err.response?.data);
        console.log("Status:", err.response?.status);

        toast.error("Failed to add skill");
    }
};
const filteredSkills = fetchedSkills.filter(skill =>
    skill.toLowerCase().includes(skillInput.toLowerCase()) &&
    !formData.skills.includes(skill)
);

    useEffect(() => {
        const fetchDegrees = async () => {
            setIsLoadingDegrees(true);
            try {
                const res = await getMasterDataByType("DEGREE");
                setDegreeOptions((res?.data?.data || []).map(item => ({ value: item._id, label: item.value })));
            } catch (err) {
                console.error("Error loading degrees:", err);
            } finally {
                setIsLoadingDegrees(false);
            }
        };
        fetchDegrees();
    }, []);

    useEffect(() => {
        if (!selectedDegreeId) { setStreamOptions([]); return; }
        const fetchStreams = async () => {
            setIsLoadingStreams(true);
            try {
                const res = await getMasterDataByType("STREAM", selectedDegreeId);
                setStreamOptions((res?.data?.data || []).map(item => ({ value: item._id, label: item.value })));
            } catch (err) {
                console.error("Error loading streams:", err);
            } finally {
                setIsLoadingStreams(false);
            }
        };
        fetchStreams();
    }, [selectedDegreeId]);

    useEffect(() => {
        const cities = City.getCitiesOfCountry('IN').sort((a, b) => a.name.localeCompare(b.name));
        setIndianCities(cities);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            const dropdownRefs = {
                skills: skillsDropdownRef,
                certifications: certificationsDropdownRef,
                locations: locationsDropdownRef,
                benefits: benefitsDropdownRef,
                tags: tagsDropdownRef,
            };
            for (const key in dropdownRefs) {
                if (dropdownRefs[key].current && !dropdownRefs[key].current.contains(event.target)) {
                    setDropdownOpen(prev => ({ ...prev, [key]: false }));
                }
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => { document.removeEventListener('mousedown', handleClickOutside); };
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === "description") {
            if (value.length > 500) {
                setDescriptionError("Job description cannot exceed 500 characters.");
            } else {
                setDescriptionError("");
            }
        }
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleOptionSelect = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handlePackageDetailsChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, packageDetails: { ...prev.packageDetails, [name]: value } }));
    };

    const addItem = (field, item) => {
        if (item && !formData[field].includes(item)) {
            setFormData(prev => ({ ...prev, [field]: [...prev[field], item] }));
        }
    };

    const removeItem = (field, item) => {
        setFormData(prev => ({ ...prev, [field]: prev[field].filter(i => i !== item) }));
    };

    const toggleDropdown = (dropdown) => {
        setDropdownOpen(prev => ({
            ...Object.keys(prev).reduce((acc, key) => ({ ...acc, [key]: false }), {}),
            [dropdown]: !prev[dropdown]
        }));
    };

const handleItemInputKeyDown = (e, field, input, setInput) => {
    if (e.key === "Enter" && input.trim()) {

        e.preventDefault();

        if (!formData[field].includes(input.trim())) {
            addItem(field, input.trim());
        }

        setInput(""); // clears input
    }
};

 const handleSelectItem = (field, item, setInput, dropdownKey) => {

    if (!formData[field].includes(item)) {
        setFormData(prev => ({
            ...prev,
            [field]: [...prev[field], item]
        }));
    }

    if (setInput) setInput("");   // clears input

    setDropdownOpen(prev => ({
        ...prev,
        [dropdownKey]: false
    }));
};

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        if (formData.description.length > 500) {
            setDescriptionError("Job description cannot exceed 500 characters.");
            toast.error("Job description cannot exceed 500 characters.");
            setIsSubmitting(false);
            return;
        }

        const requiredFields = {
            jobTitle: "Job Title",
            description: "Job Description",
            location: "Location",
            'packageDetails.totalCTC': "Salary Amount",
            numberOfOpenings: "No. of Openings",
        };

        for (const key in requiredFields) {
            const value = key.includes('.') ? formData.packageDetails.totalCTC : formData[key];
            if (!value || (Array.isArray(value) && value.length === 0)) {
                toast.error(`Please fill the required field: ${requiredFields[key]}`);
                setIsSubmitting(false);
                return;
            }
        }

        const payload = {
            ...formData,
            yearsOfExperience: formData.maxYearsOfExperience,
            minYearofExperience: formData.minYearsOfExperience,
            packageDetails: {
                currency: formData.packageDetails.currency,
                totalCTC: parseFloat(formData.packageDetails.totalCTC) || 0,
                fixedPay: parseFloat(formData.packageDetails.fixedPay) || 0,
                joiningBonus: parseFloat(formData.packageDetails.joiningBonus) || 0
            },
            numberOfOpenings: parseInt(formData.numberOfOpenings, 10),
            jobType: "Referral",
            broadcastType: formData.broadcastType
        };

        try {
            const response = await postReferralJob(payload);
            console.log('API Response:', response);
            toast.success('Referral job posted successfully!');
            setFormData(initialState);
            //navigate('/professional/service-request');
        } catch (err) {
            console.error('Failed to post referral job:', err);
            toast.error(err.response?.data?.error || 'An unexpected error occurred.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        setFormData(initialState);
        navigate('/professional/service-request');
    };

    // Chip list renderer
    const ChipList = ({ items, field }) =>
        items.length > 0 ? (
            <div className="flex flex-wrap gap-1.5 mb-2">
                {items.map((item, i) => (
                    <span key={i} className={chipCls}>
                        {item}
                        <button type="button" onClick={(e) => { e.stopPropagation(); removeItem(field, item); }} className={chipBtnCls}>
                            <X size={10} />
                        </button>
                    </span>
                ))}
            </div>
        ) : null;

    return (
        <div className="min-h-screen bg-[#f8f7ff]">
            {/* ── Top Banner ─────────────────────────────────────────────────── */}
            <div className="bg-gradient-to-r from-[#667eea] to-[#764ba2] px-6 py-5">
                <div className="max-w-3xl mx-auto flex items-center gap-4">
                    <div className="p-2.5 bg-white/20 rounded-xl">
                        <Briefcase className="h-5 w-5 text-white" />
                    </div>
                    <div>
                        <h1 className="text-lg font-bold text-white tracking-tight">Post a Referral Job</h1>
                        <p className="text-white/70 text-xs mt-0.5">Effortlessly connect with qualified candidates and build your dream team.</p>
                    </div>
                </div>
            </div>

            <div className="max-w-3xl mx-auto px-4 py-6 space-y-4">

                {/* ── CARD 1: Basic Job Details ─────────────────────────────── */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-6 py-5">
                    <SectionHeader icon={Briefcase} title="Basic Job Details" subtitle="Provide the core details about this job opportunity." step="1" />

                    {/* Employment Type */}
                    <div className="mb-5">
                        <FieldLabel required>Employment Type</FieldLabel>
                        <div className="flex gap-2 flex-wrap">
                            {['Full-time', 'Part-time', 'Contract'].map(t => (
                                <PillBtn key={t} label={t} active={formData.employmentType === t} onClick={() => handleOptionSelect('employmentType', t)} />
                            ))}
                        </div>
                    </div>

                    {/* Job Title + Work Mode */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
                        <div>
                            <FieldLabel htmlFor="jobTitle" required>Job Title</FieldLabel>
                            <input
                                type="text" id="jobTitle" name="jobTitle"
                                placeholder="e.g. Senior Frontend Engineer"
                                className={inputCls}
                                value={formData.jobTitle}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div>
                            <FieldLabel htmlFor="workMode" required>Work Mode</FieldLabel>
                            <div className="relative">
                                <select id="workMode" name="workMode" className={`${inputCls} appearance-none pr-9`} value={formData.workMode} onChange={handleInputChange}>
                                    <option value="On-site">On-site</option>
                                    <option value="Remote">Remote</option>
                                    <option value="Hybrid">Hybrid</option>
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={14} />
                            </div>
                        </div>
                    </div>

                    {/* Location */}
                    <div ref={locationsDropdownRef} className="relative mb-5">
                        <FieldLabel required>Location</FieldLabel>
                        <ChipList items={formData.location} field="location" />
                        <DropTrigger label="Select locations" isOpen={dropdownOpen.locations} onClick={() => toggleDropdown('locations')} />
                        {dropdownOpen.locations && (
                            <div className="absolute z-20 mt-1 w-full bg-white border border-gray-100 rounded-xl shadow-xl overflow-hidden">
                                <div className="p-2 border-b border-gray-100">
                                    <input
                                        type="text"
                                        value={locationSearch}
                                        onChange={(e) => setLocationSearch(e.target.value)}
                                        onClick={(e) => e.stopPropagation()}
                                        placeholder="Search for a city..."
                                        className={inputCls}
                                    />
                                </div>
                                <div className="max-h-52 overflow-auto">
                                    {filteredCities.map(city => (
                                        <div
                                            key={`${city.name}-${city.stateCode}`}
                                            onClick={() => handleSelectItem('location', city.name, null, 'locations')}
                                            className={`px-4 py-2.5 text-sm cursor-pointer border-b border-gray-50 transition-colors
                                                ${formData.location.includes(city.name)
                                                    ? 'bg-violet-50 text-violet-700 font-medium'
                                                    : 'text-gray-700 hover:bg-gray-50'}`}
                                        >
                                            <div className="flex items-center justify-between">
                                                <span>{city.name}</span>
                                                {formData.location.includes(city.name) && <span className="text-violet-500 text-xs">✓</span>}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Broadcast Options */}
                    <div className="mb-5 p-4 bg-gray-50 rounded-xl border border-gray-100">
                        <FieldLabel required>Broadcast Options</FieldLabel>
                        <div className="flex items-center gap-6 mt-1">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio" name="broadcastType" value="Everyone"
                                    checked={formData.broadcastType === 'Everyone'}
                                    onChange={handleInputChange}
                                    className="h-4 w-4 accent-[#667eea]"
                                />
                                <span className="text-sm text-gray-700">Broadcast to Everyone</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio" name="broadcastType" value="Location"
                                    checked={formData.broadcastType === 'Location'}
                                    onChange={handleInputChange}
                                    className="h-4 w-4 accent-[#667eea]"
                                />
                                <span className="text-sm text-gray-700">Broadcast by Location</span>
                            </label>
                        </div>
                        <p className="text-xs text-gray-400 mt-2">
                            Select 'Broadcast by Location' to show this job only to candidates/colleges in the specified Work Locations.
                        </p>
                    </div>

                    {/* Package Details */}
                    <div className="mb-5">
                        <FieldLabel required>Package Details (CTC)</FieldLabel>
                        <div className="space-y-2">
                            <div className="flex">
                                <div className="relative">
                                    <select
                                        name="currency"
                                        value={formData.packageDetails.currency}
                                        onChange={handlePackageDetailsChange}
                                        className="h-full pl-3 pr-8 py-2 text-sm font-medium border border-r-0 border-gray-200 rounded-l-lg appearance-none bg-gray-50 text-gray-700 focus:outline-none focus:border-[#667eea]"
                                    >
                                        <option value="USD">$ USD</option>
                                        <option value="INR">₹ INR</option>
                                        <option value="EUR">€ EUR</option>
                                    </select>
                                    <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={13} />
                                </div>
                                <input
                                    type="number" name="totalCTC"
                                    placeholder="Total CTC"
                                    className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-[#667eea]/25 focus:border-[#667eea] bg-white placeholder:text-gray-400"
                                    value={formData.packageDetails.totalCTC}
                                    onChange={handlePackageDetailsChange}
                                    min="0" required
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <input type="number" name="fixedPay" value={formData.packageDetails.fixedPay} onChange={handlePackageDetailsChange} placeholder="Fixed Pay (optional)" className={inputCls} />
                                <input type="number" name="joiningBonus" value={formData.packageDetails.joiningBonus} onChange={handlePackageDetailsChange} placeholder="Joining Bonus (optional)" className={inputCls} />
                            </div>
                        </div>
                    </div>

                    {/* No. of Openings + Description */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <FieldLabel htmlFor="numberOfOpenings" required>No. of Openings</FieldLabel>
                            <input
                                type="number" id="numberOfOpenings" name="numberOfOpenings"
                                placeholder="e.g. 5"
                                className={inputCls}
                                value={formData.numberOfOpenings}
                                onChange={handleInputChange}
                                min="1"
                            />
                        </div>
                        <div>
                            <FieldLabel htmlFor="description" required>Job Description</FieldLabel>
                            <textarea
                                id="description" name="description"
                                placeholder="Describe job responsibilities and requirements..."
                                className={`${textareaCls} h-[88px] ${descriptionError ? 'border-red-300 focus:border-red-400' : ''}`}
                                value={formData.description}
                                onChange={handleInputChange}
                                maxLength={600}
                                required
                            />
                            <p className={`text-xs mt-0.5 ${descriptionError ? 'text-red-500' : 'text-gray-400'}`}>
                                {descriptionError || `${formData.description.length}/500`}
                            </p>
                        </div>
                    </div>
                </div>

                {/* ── CARD 2: Selection Criteria ────────────────────────────── */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-6 py-5">
                    <SectionHeader icon={GraduationCap} title="Selection Criteria" subtitle="Outline the qualifications for the ideal candidate." step="2" />

                    {/* Eligibility Criteria */}
                    <div className="mb-5">
                        <FieldLabel htmlFor="eligibilityCriteria">Eligibility Criteria</FieldLabel>
                        <textarea
                            id="eligibilityCriteria" name="eligibilityCriteria"
                            placeholder="e.g., Minimum 3.0 GPA, Must be eligible to work in the specified location..."
                            className={`${textareaCls} h-24`}
                            value={formData.eligibilityCriteria}
                            onChange={handleInputChange}
                        />
                    </div>

                    {/* Minimum Education + Streams */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
                        <div>
                            <FieldLabel>Minimum Education</FieldLabel>
                            <CreatableSelect
                                isClearable
                                isLoading={isLoadingDegrees}
                                options={degreeOptions}
                                value={
                                    formData.minEducation
                                        ? degreeOptions.find(o => o.label === formData.minEducation) || { value: formData.minEducation, label: formData.minEducation }
                                        : null
                                }
                                placeholder="Search or add degree..."
                                styles={selectStyles}
                                onChange={(sel) => {
                                    setFormData(prev => ({ ...prev, minEducation: sel?.label || '', studentStreams: [] }));
                                    setSelectedDegreeId(sel?.value || null);
                                    setStreamOptions([]);
                                }}
                                onCreateOption={async (val) => {
                                    try {
                                        const res = await createMasterData({ type: 'DEGREE', value: val });
                                        const saved = res.data?.data || res.data;
                                        const newOpt = { value: saved._id, label: saved.value };
                                        setDegreeOptions(prev => [...prev, newOpt]);
                                        setFormData(prev => ({ ...prev, minEducation: saved.value, studentStreams: [] }));
                                        setSelectedDegreeId(saved._id);
                                        setStreamOptions([]);
                                    } catch (err) { console.error("Failed to save degree", err); }
                                }}
                            />
                        </div>
                        <div>
                            <FieldLabel>Preferred Field of Study</FieldLabel>
                            <CreatableSelect
                                isMulti isClearable
                                isLoading={isLoadingStreams}
                                isDisabled={!formData.minEducation}
                                options={streamOptions}
                                value={formData.studentStreams.map(s => ({ value: s, label: s }))}
                                placeholder={formData.minEducation ? "Search or add streams..." : "Select a degree first"}
                                styles={selectStyles}
                                onChange={(sel) => {
                                    setFormData(prev => ({ ...prev, studentStreams: (sel || []).map(s => s.label) }));
                                }}
                                onCreateOption={async (val) => {
                                    try {
                                        const res = await createMasterData({ type: 'STREAM', value: val, parent: selectedDegreeId });
                                        const saved = res.data?.data || res.data;
                                        const newOpt = { value: saved._id, label: saved.value };
                                        setStreamOptions(prev => [...prev, newOpt]);
                                        setFormData(prev => ({ ...prev, studentStreams: [...prev.studentStreams, saved.value] }));
                                    } catch (err) { console.error("Failed to save stream", err); }
                                }}
                            />
                        </div>
                    </div>

                    {/* Experience + Work Auth */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
                       <div>
    <FieldLabel htmlFor="minYearsOfExperience">Min. Years of Experience</FieldLabel>
    <div className="relative">
        <select id="minYearsOfExperience" name="minYearsOfExperience" className={`${inputCls} appearance-none pr-9`} value={formData.minYearsOfExperience} onChange={handleInputChange}>
            <option value="">Select min experience</option>
            {experienceOptions.map((o, i) => <option key={i} value={o}>{o}</option>)}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={14} />
    </div>
</div>
<div>
    <FieldLabel htmlFor="maxYearsOfExperience">Max. Years of Experience</FieldLabel>
    <div className="relative">
        <select id="maxYearsOfExperience" name="maxYearsOfExperience" className={`${inputCls} appearance-none pr-9`} value={formData.maxYearsOfExperience} onChange={handleInputChange}>
            <option value="">Select max experience</option>
            {experienceOptions.map((o, i) => <option key={i} value={o}>{o}</option>)}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={14} />
    </div>
</div>
                        <div>
                            <FieldLabel htmlFor="workAuthorization">Work Authorization</FieldLabel>
                            <div className="relative">
                                <select id="workAuthorization" name="workAuthorization" className={`${inputCls} appearance-none pr-9`} value={formData.workAuthorization} onChange={handleInputChange}>
                                    <option value="">Select authorization type</option>
                                    {workAuthOptions.map((o, i) => <option key={i} value={o}>{o}</option>)}
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={14} />
                            </div>
                        </div>
                    </div>

                    {/* Skills */}
                    <div className="mb-5 relative" ref={skillsDropdownRef}>
                        <FieldLabel>Skills</FieldLabel>
                        <div
                            className={`p-2.5 border rounded-lg transition-all cursor-text
                                ${dropdownOpen.skills ? 'border-[#667eea] ring-2 ring-[#667eea]/10' : 'border-gray-200 hover:border-[#667eea]/50'}
                                bg-white`}
                            onClick={() => setDropdownOpen(prev => ({ ...prev, skills: true }))}
                        >
                            <ChipList items={formData.skills} field="skills" />
                            <input
                                type="text"
                                placeholder="Type a skill and press Enter..."
                                className="w-full outline-none text-sm text-gray-800 placeholder:text-gray-400 bg-transparent"
                                value={skillInput}
                                onChange={(e) => setSkillInput(e.target.value)}
                                onKeyDown={(e) => handleItemInputKeyDown(e, 'skills', skillInput, setSkillInput)}
                            />
                        </div>
                      {dropdownOpen.skills && (
    <div className="absolute z-10 w-full bg-white border border-gray-100 rounded-xl shadow-xl mt-1 max-h-52 overflow-y-auto">

        {filteredSkills.map((skill, i) => (
            <div
                key={i}
                className="px-4 py-2.5 text-sm text-gray-700 hover:bg-violet-50 hover:text-violet-700 cursor-pointer transition-colors"
                onClick={() => handleSelectItem('skills', skill, setSkillInput, 'skills')}
            >
                {skill}
            </div>
        ))}

        {skillInput &&
            !fetchedSkills.some(s => s.toLowerCase() === skillInput.toLowerCase()) && (
                <div
                    className="px-4 py-3 text-sm font-semibold text-[#667eea] hover:bg-[#667eea]/5 cursor-pointer border-t"
                    onClick={() => handleAddNewSkill(skillInput)}
                >
                    + Add "{skillInput}"
                </div>
            )
        }

    </div>
)}
                    </div>

                    {/* Benefits + Tags */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
                        <div className="relative" ref={benefitsDropdownRef}>
                            <FieldLabel>Benefits</FieldLabel>
                            <div
                                className={`p-2.5 border rounded-lg transition-all cursor-text
                                    ${dropdownOpen.benefits ? 'border-[#667eea] ring-2 ring-[#667eea]/10' : 'border-gray-200 hover:border-[#667eea]/50'}
                                    bg-white`}
                                onClick={() => setDropdownOpen(prev => ({ ...prev, benefits: true }))}
                            >
                                <ChipList items={formData.benefits} field="benefits" />
                                <input
                                    type="text"
                                    placeholder="Type a benefit..."
                                    className="w-full outline-none text-sm text-gray-800 placeholder:text-gray-400 bg-transparent"
                                    value={benefitInput}
                                    onChange={(e) => setBenefitInput(e.target.value)}
                                    onKeyDown={(e) => handleItemInputKeyDown(e, 'benefits', benefitInput, setBenefitInput)}
                                />
                            </div>
                            {dropdownOpen.benefits && (
                                <div className="absolute z-10 w-full bg-white border border-gray-100 rounded-xl shadow-xl mt-1 max-h-48 overflow-y-auto">
                                    {filteredBenefits.map((b, i) => (
                                        <div key={i} className="px-4 py-2.5 text-sm text-gray-700 hover:bg-violet-50 hover:text-violet-700 cursor-pointer transition-colors"
                                            onClick={() => handleSelectItem('benefits', b, setBenefitInput, 'benefits')}>{b}</div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="relative" ref={tagsDropdownRef}>
                            <FieldLabel>Tags</FieldLabel>
                            <div
                                className={`p-2.5 border rounded-lg transition-all cursor-pointer
                                    ${dropdownOpen.tags ? 'border-[#667eea] ring-2 ring-[#667eea]/10' : 'border-gray-200 hover:border-[#667eea]/50'}
                                    bg-white`}
                                onClick={() => setDropdownOpen(prev => ({ ...prev, tags: true }))}
                            >
                                <ChipList items={formData.tags} field="tags" />
                                <div className="flex items-center justify-between text-gray-400">
                                    <span className="text-sm">{formData.tags.length > 0 ? 'Add more...' : 'Select tags'}</span>
                                    <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${dropdownOpen.tags ? 'rotate-180 text-[#667eea]' : ''}`} />
                                </div>
                            </div>
                            {dropdownOpen.tags && (
                                <div className="absolute z-10 w-full bg-white border border-gray-100 rounded-xl shadow-xl mt-1 max-h-48 overflow-y-auto">
                                    {tagsOptions.map((tag, i) => (
                                        <div key={i}
                                            className={`px-4 py-2.5 text-sm cursor-pointer transition-colors border-b border-gray-50
                                                ${formData.tags.includes(tag) ? 'bg-violet-50 text-violet-700 font-medium' : 'text-gray-700 hover:bg-gray-50'}`}
                                            onClick={() => handleSelectItem('tags', tag, null, 'tags')}
                                        >
                                            <div className="flex items-center justify-between">
                                                <span>{tag}</span>
                                                {formData.tags.includes(tag) && <span className="text-violet-500 text-xs">✓</span>}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Certifications */}
                    <div className="relative" ref={certificationsDropdownRef}>
                        <FieldLabel>Certifications (if any)</FieldLabel>
                        <div
                            className={`p-2.5 border rounded-lg transition-all cursor-text
                                ${dropdownOpen.certifications ? 'border-[#667eea] ring-2 ring-[#667eea]/10' : 'border-gray-200 hover:border-[#667eea]/50'}
                                bg-white`}
                            onClick={() => setDropdownOpen(prev => ({ ...prev, certifications: true }))}
                        >
                            <ChipList items={formData.certifications} field="certifications" />
                            <input
                                type="text"
                                placeholder="Type a certification..."
                                className="w-full outline-none text-sm text-gray-800 placeholder:text-gray-400 bg-transparent"
                                value={certificationInput}
                                onChange={(e) => setCertificationInput(e.target.value)}
                                onKeyDown={(e) => handleItemInputKeyDown(e, 'certifications', certificationInput, setCertificationInput)}
                            />
                        </div>
                        {dropdownOpen.certifications && (
                            <div className="absolute z-10 w-full bg-white border border-gray-100 rounded-xl shadow-xl mt-1 max-h-48 overflow-y-auto">
                                {filteredCertifications.map((cert, i) => (
                                    <div key={i} className="px-4 py-2.5 text-sm text-gray-700 hover:bg-violet-50 hover:text-violet-700 cursor-pointer transition-colors"
                                        onClick={() => handleSelectItem('certifications', cert, setCertificationInput, 'certifications')}>{cert}</div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* ── Action Buttons ────────────────────────────────────────── */}
                <div className="flex items-center justify-end gap-3 pb-6">
                    <button
                        type="button"
                        onClick={handleCancel}
                        disabled={isSubmitting}
                        className="px-5 py-2.5 text-sm font-medium text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-[#667eea] to-[#764ba2] rounded-xl shadow-md shadow-[#667eea]/25 hover:shadow-lg hover:shadow-[#667eea]/35 focus:outline-none focus:ring-2 focus:ring-[#667eea]/50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? (
                            <>
                                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                                </svg>
                                Posting...
                            </>
                        ) : (
                            <>Post Your Job <ChevronRight size={15} /></>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default PostReferralJobPage;