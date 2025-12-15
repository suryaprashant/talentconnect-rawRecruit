import { useState, useEffect, useRef, useMemo } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Country, State, City } from 'country-state-city';
import { ChevronDown, X, Check, Upload, Calendar, Globe, Link, Award, Users, Briefcase, Home, Mail, Phone, MapPin, ExternalLink, Edit2, Save, Trash2, Plus, User } from 'lucide-react';
import CreatableSelect from 'react-select/creatable';

export default function ProfileForm({
    onboardingData,
    profileImageFile: propProfileImageFile,
    backgroundImageFile: propBackgroundImageFile,
    setProfileImageFile,
    setBackgroundImageFile,
    setProfileImageUrl,
    setBackgroundImageUrl,
    onProfileUpdate
}) {
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);


    const [collegeUniversityDetails, setCollegeUniversityDetails] = useState({
        collegeName: '',
        establishedYear: '',
        phoneNumber: '',
        alternatePhoneNumber: '',
        collegeLocation: '',
        city: '',
        state: '',
        country: '',
        pincode: '',
    });


    const [selectedCountryISO, setSelectedCountryISO] = useState('');
    const [selectedStateISO, setSelectedStateISO] = useState('');

    const [placementCoordinatorDetails, setPlacementCoordinatorDetails] = useState({
        coordinatorName: '',
        designation: '',
        officialEmail: '',
        officialMobile: '',
        linkedinUrl: '',
        profilePictureUrl: '',
    });


    const [placementRecruitmentDetails, setPlacementRecruitmentDetails] = useState({
        programsOffered: [],
        popularCoursesForRecruitment: [],
        preferredHiringCompanies: [],
        recruitmentServicesRequired: [],
        collegeBrochureUrl: '',
    });

    const [dropdownOpen, setDropdownOpen] = useState({
        programs: false,
        courses: false,
        companies: false,
        designation: false
    });
    
    // Custom input state
    const [customInput, setCustomInput] = useState({
        programs: '',
        courses: '',
        companies: '',
        designation: ''
    });


    const [profileAchievements, setProfileAchievements] = useState({
        collegeWebsite: '',
        linkedinProfile: '',
        backgroundImageUrl: '',
    });

    const [workshops, setWorkshops] = useState([]);
    const [volunteering, setVolunteering] = useState([]);
    const [awards, setAwards] = useState([]);


    const coordinatorProfileImageRef = useRef(null);
    const collegeBrochureRef = useRef(null);

    const programsRef = useRef(null);
    const coursesRef = useRef(null);
    const companiesRef = useRef(null);
    const designationRef = useRef(null);

    const [coordinatorProfileImageFile, setCoordinatorProfileImageFile] = useState(null);
    const [collegeBrochureFile, setCollegeBrochureFile] = useState(null);

    const years = Array.from({ length: 150 }, (_, i) => new Date().getFullYear() - i);
    

    const programOptions = ["Engineering", "Business", "Arts", "Science"];
    const courseOptions = ["Computer Science", "Mechanical Engineering", "MBA", "Electrical Engineering"];
    const companyOptions = ["Google", "Microsoft", "Amazon", "TCS"];
    const designationOptions = ["Placement Officer", "Head of Placements", "Training & Placement Officer (TPO)", "Professor", "Director", "Principal", "Dean"];

    const locationOptions = useMemo(() => {
        return City.getCitiesOfCountry('IN')
            ?.map(city => ({ value: city.name, label: city.name }))
            ?.sort((a, b) => a.label.localeCompare(b.label));
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (programsRef.current && !programsRef.current.contains(event.target)) setDropdownOpen(prev => ({ ...prev, programs: false }));
            if (coursesRef.current && !coursesRef.current.contains(event.target)) setDropdownOpen(prev => ({ ...prev, courses: false }));
            if (companiesRef.current && !companiesRef.current.contains(event.target)) setDropdownOpen(prev => ({ ...prev, companies: false }));
            if (designationRef.current && !designationRef.current.contains(event.target)) setDropdownOpen(prev => ({ ...prev, designation: false }));
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    useEffect(() => {
        if (onboardingData) {
            const collegeDetails = onboardingData.collegeUniversityDetails || {};
            setCollegeUniversityDetails(collegeDetails);

            if (collegeDetails.country) {
                const foundCountry = Country.getAllCountries().find(c => c.name === collegeDetails.country);
                if (foundCountry) {
                    setSelectedCountryISO(foundCountry.isoCode);
                    if (collegeDetails.state) {
                        const foundState = State.getStatesOfCountry(foundCountry.isoCode).find(s => s.name === collegeDetails.state);
                        if (foundState) setSelectedStateISO(foundState.isoCode);
                    }
                }
            }

            setPlacementCoordinatorDetails(onboardingData.placementCoordinatorDetails || {});
            setPlacementRecruitmentDetails(onboardingData.placementRecruitmentDetails || {});
            setProfileAchievements(onboardingData.profileAchievements || {});
            setWorkshops(onboardingData.workshops || []);
            setVolunteering(onboardingData.volunteering || []);
            setAwards(onboardingData.awards || []);

            setCoordinatorProfileImageFile(null);
            setCollegeBrochureFile(null);
        }
    }, [onboardingData]);

    const handleDetailChange = (section, field, value) => {
        if (section === 'collegeUniversityDetails') {
            setCollegeUniversityDetails(prev => ({ ...prev, [field]: value }));
        } else if (section === 'placementCoordinatorDetails') {
            setPlacementCoordinatorDetails(prev => ({ ...prev, [field]: value }));
        } else if (section === 'profileAchievements') {
            setProfileAchievements(prev => ({ ...prev, [field]: value }));
        }
    };

    const handleCountryChange = (e) => {
        const isoCode = e.target.value;
        const countryData = Country.getCountryByCode(isoCode);
        setSelectedCountryISO(isoCode);
        setSelectedStateISO('');
        setCollegeUniversityDetails(prev => ({
            ...prev,
            country: countryData?.name || '',
            state: '',
            city: ''
        }));
    };

    const handleStateChange = (e) => {
        const isoCode = e.target.value;
        const stateData = State.getStateByCodeAndCountry(isoCode, selectedCountryISO);
        setSelectedStateISO(isoCode);
        setCollegeUniversityDetails(prev => ({
            ...prev,
            state: stateData?.name || '',
            city: ''
        }));
    };

    const handleCityChange = (e) => {
        setCollegeUniversityDetails(prev => ({ ...prev, city: e.target.value }));
    };

    const initializeArrayField = (fieldName) => {
        const data = placementRecruitmentDetails[fieldName];
        if (!data) return [];
        return Array.isArray(data) ? data : [data];
    };

    const toggleDropdown = (dropdown) => {
        if (!isEditing) return;
        setDropdownOpen(prev => ({
            programs: false,
            courses: false,
            companies: false,
            designation: false,
            [dropdown]: !prev[dropdown]
        }));
        if (!dropdownOpen[dropdown]) {
            setCustomInput(prev => ({ ...prev, [dropdown]: '' }));
        }
    };

    const handleMultiSelect = (field, value) => {
        const currentValues = initializeArrayField(field);
        let newValues;
        if (currentValues.includes(value)) {
            newValues = currentValues.filter(item => item !== value);
        } else {
            newValues = [...currentValues, value];
        }
        setPlacementRecruitmentDetails(prev => ({ ...prev, [field]: newValues }));
    };

    const removeSelectedItem = (field, value) => {
        if (!isEditing) return;
        const currentValues = initializeArrayField(field);
        setPlacementRecruitmentDetails(prev => ({ ...prev, [field]: currentValues.filter(item => item !== value) }));
    };

    const handleAddCustomMultiItem = (field, dropdownType) => {
        const customValue = customInput[dropdownType].trim();
        if (!customValue) return;

        const currentValues = initializeArrayField(field);
        if (!currentValues.includes(customValue)) {
            setPlacementRecruitmentDetails(prev => ({ ...prev, [field]: [...currentValues, customValue] }));
        }
        setCustomInput(prev => ({ ...prev, [dropdownType]: '' }));
        setDropdownOpen(prev => ({ ...prev, [dropdownType]: false }));
    };

    const handleSingleSelect = (section, field, value) => {
        if (section === 'placementCoordinatorDetails') {
            setPlacementCoordinatorDetails(prev => ({ ...prev, [field]: value }));
        }
        setDropdownOpen(prev => ({ ...prev, designation: false }));
    };

    const handleAddCustomSingleItem = (section, field, dropdownType) => {
        const customValue = customInput[dropdownType].trim();
        if (!customValue) return;

        if (section === 'placementCoordinatorDetails') {
            setPlacementCoordinatorDetails(prev => ({ ...prev, [field]: customValue }));
        }
        setCustomInput(prev => ({ ...prev, [dropdownType]: '' }));
        setDropdownOpen(prev => ({ ...prev, [dropdownType]: false }));
    };

    const handleServiceToggle = (service) => {
        if (!isEditing) return;
        const currentServices = placementRecruitmentDetails.recruitmentServicesRequired || [];
        setPlacementRecruitmentDetails(prev => ({
            ...prev,
            recruitmentServicesRequired: currentServices.includes(service)
                ? currentServices.filter(s => s !== service)
                : [...currentServices, service]
        }));
    };


    const handleCoordinatorProfileImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setCoordinatorProfileImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => setPlacementCoordinatorDetails(prev => ({ ...prev, profilePictureUrl: reader.result }));
            reader.readAsDataURL(file);
        }
    };

    const handleCollegeBrochureChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setCollegeBrochureFile(file);
            setPlacementRecruitmentDetails(prev => ({ ...prev, collegeBrochureUrl: file.name }));
        }
    };


    const handleArrayItemChange = (setState, index, field, value) => {
        setState(prev => prev.map((item, i) => i === index ? { ...item, [field]: value } : item));
    };
    const addArrayItem = (setState, defaultItem) => setState(prev => [...prev, defaultItem]);
    const removeArrayItem = (setState, index) => setState(prev => prev.filter((_, i) => i !== index));


    const renderSingleCustomDropdown = (dropdownType, section, field, label, options, placeholder) => {
        const currentValue = section === 'placementCoordinatorDetails' ? placementCoordinatorDetails[field] : '';

        return (
            <div ref={designationRef} className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">{label} *</label>
                <div
                    className={`flex items-center justify-between p-3 w-full border border-white/50 bg-white/90 backdrop-blur-sm rounded-xl ${isEditing ? 'cursor-pointer hover:border-[#93c5fd]/50 transition-all duration-200' : 'bg-gray-50/50'}`}
                    onClick={() => toggleDropdown(dropdownType)}
                >
                    <span className={`${!currentValue ? 'text-gray-400' : 'text-gray-900'}`}>
                        {currentValue || placeholder}
                    </span>
                    {isEditing && (
                        <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${dropdownOpen[dropdownType] ? "rotate-180" : ""}`} />
                    )}
                </div>

                {isEditing && dropdownOpen[dropdownType] && (
                    <div className="absolute z-20 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                        <div className="sticky top-0 bg-white border-b border-gray-200 p-2">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={customInput[dropdownType]}
                                    onChange={(e) => setCustomInput(prev => ({ ...prev, [dropdownType]: e.target.value }))}
                                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddCustomSingleItem(section, field, dropdownType))}
                                    placeholder="Add custom..."
                                    className="flex-1 px-3 py-2 border border-gray-300/50 rounded-lg bg-white/90 text-sm focus:outline-none focus:ring-2 focus:ring-[#93c5fd] focus:border-transparent"
                                    autoFocus
                                    onClick={(e) => e.stopPropagation()}
                                />
                                <button
                                    type="button"
                                    onClick={(e) => { e.stopPropagation(); handleAddCustomSingleItem(section, field, dropdownType); }}
                                    disabled={!customInput[dropdownType].trim()}
                                    className="bg-gradient-to-r from-[#93c5fd] to-[#3b82f6] text-white px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-50 transition-all duration-200 hover:shadow-md"
                                >
                                    Add
                                </button>
                            </div>
                        </div>
                        {/* Options */}
                        <div className="p-1">
                            {options.map(option => (
                                <div
                                    key={option}
                                    onClick={() => handleSingleSelect(section, field, option)}
                                    className={`px-4 py-3 hover:bg-gradient-to-r hover:from-[#93c5fd]/10 hover:to-transparent cursor-pointer flex items-center justify-between rounded-lg mx-1 my-1 transition-all duration-200 ${currentValue === option ? 'bg-gradient-to-r from-[#93c5fd]/20 to-[#3b82f6]/10 text-[#3b82f6]' : ''}`}
                                >
                                    {option}
                                    {currentValue === option && <Check className="w-4 h-4 text-[#3b82f6]" />}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        );
    };

    const renderCustomDropdown = (dropdownType, field, label, options, placeholder) => {
        const currentValues = initializeArrayField(field);
        const ref = dropdownType === 'programs' ? programsRef : dropdownType === 'courses' ? coursesRef : companiesRef;

        return (
          <div ref={ref} className="relative">
            <label className="block text-sm font-medium mb-1">{label}</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {currentValues.map((item, index) => (
                <span key={index} className="flex items-center bg-gray-200 text-sm text-black px-3 py-1.5 rounded-full">
                  {item}
                  {isEditing && (
                      <button type="button" onClick={() => removeSelectedItem(field, item)} className="ml-2 text-gray-600 hover:text-black">
                        <X className="w-4 h-4" />
                      </button>
                  )}
                </span>
              ))}
            </div>
            
            {isEditing && (
                <>
                    <div
                        className="flex items-center justify-between p-2 w-full border border-gray-300 rounded-md cursor-pointer hover:border-gray-400 bg-white"
                        onClick={() => toggleDropdown(dropdownType)}
                    >
                        <span className="text-gray-500">{currentValues.length > 0 ? 'Add more...' : placeholder}</span>
                        <ChevronDown className={`w-5 h-5 transition-transform ${dropdownOpen[dropdownType] ? "rotate-180" : ""}`} />
                    </div>
                    
                    {dropdownOpen[dropdownType] && (
                        <div className="absolute z-20 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-72 overflow-auto">
                            <div className="sticky top-0 bg-white border-b border-gray-200 p-3">
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={customInput[dropdownType]}
                                        onChange={(e) => setCustomInput(prev => ({ ...prev, [dropdownType]: e.target.value }))}
                                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddCustomMultiItem(field, dropdownType))}
                                        placeholder="Add custom..."
                                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        autoFocus
                                        onClick={(e) => e.stopPropagation()}
                                    />
                                    <button
                                        type="button"
                                        onClick={(e) => { e.stopPropagation(); handleAddCustomMultiItem(field, dropdownType); }}
                                        disabled={!customInput[dropdownType].trim()}
                                        className="bg-blue-500 text-white px-4 py-2 rounded-md font-medium disabled:bg-gray-200"
                                    >
                                        Add
                                    </button>
                                </div>
                            </div>
                            <div className="p-1">
                                {options.map(option => (
                                    <div
                                        key={option}
                                        onClick={() => handleMultiSelect(field, option)}
                                        className={`px-4 py-2.5 hover:bg-gray-50 cursor-pointer flex items-center justify-between rounded-md mx-1 my-1 ${currentValues.includes(option) ? "bg-blue-50 text-blue-700" : ""}`}
                                    >
                                        <span>{option}</span>
                                        {currentValues.includes(option) && <span className="text-blue-500 font-bold">✓</span>}
                                    </div>
                                ))}
                            </div>
                            {/* Custom Values Section */}
                            {currentValues.filter(item => !options.includes(item)).length > 0 && <div className="border-t border-gray-200 mx-3 my-2"></div>}
                            {currentValues.filter(item => !options.includes(item)).map(customItem => (
                                <div
                                    key={customItem}
                                    onClick={() => handleMultiSelect(field, customItem)}
                                    className={`px-4 py-2.5 hover:bg-gray-50 cursor-pointer flex items-center justify-between rounded-md mx-1 my-1 ${currentValues.includes(customItem) ? "bg-blue-50 text-blue-700" : ""}`}
                                >
                                    <div className="flex items-center gap-2">
                                        <span className="text-black">•</span>
                                        <span>{customItem}</span>
                                        <span className="text-xs text-gray-500 italic">(custom)</span>
                                    </div>
                                    {currentValues.includes(customItem) && <span className="text-blue-500 font-bold">✓</span>}
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}
          </div>
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('collegeUniversityDetails', JSON.stringify(collegeUniversityDetails));
            formData.append('placementCoordinatorDetails', JSON.stringify({ ...placementCoordinatorDetails, profilePictureUrl: undefined }));
            formData.append('placementRecruitmentDetails', JSON.stringify({ ...placementRecruitmentDetails, collegeBrochureUrl: undefined }));
            formData.append('profileAchievements', JSON.stringify({ ...profileAchievements, backgroundImageUrl: undefined }));
            formData.append('workshops', JSON.stringify(workshops));
            formData.append('volunteering', JSON.stringify(volunteering));
            formData.append('awards', JSON.stringify(awards));

            if (propProfileImageFile) formData.append('profileImage', propProfileImageFile);
            if (propBackgroundImageFile) formData.append('backgroundImage', propBackgroundImageFile);
            if (coordinatorProfileImageFile) formData.append('placementCoordinatorDetails_profileImage', coordinatorProfileImageFile);
            if (collegeBrochureFile) formData.append('collegeBrochure', collegeBrochureFile);

            const backendUrl = import.meta.env.VITE_Backend_URL;
            const response = await axios.post(`${backendUrl}/api/college-onboarding/submit-onboarding`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            toast.success(response.data.message);
            onProfileUpdate(response.data.data);
            setIsEditing(false);
        } catch (error) {
            console.error('Error submitting profile form:', error);
            const errorMessage = error.response?.data?.message || 'Failed to submit form. Please try again.';
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white w-full min-h-screen pb-12">
            <div className="max-w-4xl mx-auto px-4 py-8">
                <div className="mb-10 flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800 mb-2">Manage Your College Profile</h1>
                        <p className="text-gray-600">Update your college details, placement information, and achievements.</p>
                    </div>
                    <div>
                        {!isEditing && (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="bg-blue-600 text-white px-5 py-2 rounded-lg shadow hover:bg-blue-700 transition-colors duration-200"
                            >
                                Edit Profile
                            </button>
                        )}
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    {/* College/University Details */}
                    <div className="border border-gray-300 rounded-md p-6 mb-8 shadow-sm">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-medium">College/University Details</h2>
                        </div>
                        <p className="text-sm text-gray-600 mb-6">Information about your institution, its location, and contact details.</p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">College Name *</label>
                                <input
                                    type="text"
                                    value={collegeUniversityDetails.collegeName || ''}
                                    onChange={(e) => handleDetailChange('collegeUniversityDetails', 'collegeName', e.target.value)}
                                    placeholder="e.g., Indian Institute of Technology Bombay"
                                    className={`w-full p-3 bg-white/50 backdrop-blur-sm border border-white/50 rounded-xl focus:ring-2 focus:ring-[#93c5fd] focus:border-transparent focus:outline-none transition-all duration-200 ${!isEditing ? 'text-gray-900' : ''}`}
                                    readOnly={!isEditing}
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Established Year *</label>
                                {isEditing ? (
                                    <select
                                        value={collegeUniversityDetails.establishedYear || ''}
                                        onChange={(e) => handleDetailChange('collegeUniversityDetails', 'establishedYear', e.target.value)}
                                        className="w-full p-3 bg-white/50 backdrop-blur-sm border border-white/50 rounded-xl focus:ring-2 focus:ring-[#93c5fd] focus:border-transparent focus:outline-none transition-all duration-200"
                                    >
                                        <option value="">Select Year</option>
                                        {years.map((year) => (<option key={year} value={year}>{year}</option>))}
                                    </select>
                                ) : (
                                    <input 
                                        type="text" 
                                        value={collegeUniversityDetails.establishedYear || ''} 
                                        readOnly 
                                        className="w-full p-3 bg-white/50 backdrop-blur-sm border border-white/50 rounded-xl text-gray-900" 
                                    />
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <Phone className="inline w-4 h-4 mr-2 text-gray-400" />
                                    Phone Number
                                </label>
                                <input
                                    type="text"
                                    value={collegeUniversityDetails.phoneNumber || ''}
                                    onChange={(e) => handleDetailChange('collegeUniversityDetails', 'phoneNumber', e.target.value)}
                                    placeholder="+91 XXXXXXXXXX"
                                    className={`w-full p-3 bg-white/50 backdrop-blur-sm border border-white/50 rounded-xl focus:ring-2 focus:ring-[#93c5fd] focus:border-transparent focus:outline-none transition-all duration-200 ${!isEditing ? 'text-gray-900' : ''}`}
                                    readOnly={!isEditing}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <Phone className="inline w-4 h-4 mr-2 text-gray-400" />
                                    Alternate Phone Number
                                </label>
                                <input
                                    type="text"
                                    value={collegeUniversityDetails.alternatePhoneNumber || ''}
                                    onChange={(e) => handleDetailChange('collegeUniversityDetails', 'alternatePhoneNumber', e.target.value)}
                                    placeholder="+91 XXXXXXXXXX"
                                    className={`w-full p-3 bg-white/50 backdrop-blur-sm border border-white/50 rounded-xl focus:ring-2 focus:ring-[#93c5fd] focus:border-transparent focus:outline-none transition-all duration-200 ${!isEditing ? 'text-gray-900' : ''}`}
                                    readOnly={!isEditing}
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <MapPin className="inline w-4 h-4 mr-2 text-gray-400" />
                                    College Location (City - India)
                                </label>
                                {isEditing ? (
                                    <CreatableSelect
                                        isClearable
                                        options={locationOptions}
                                        value={collegeUniversityDetails.collegeLocation ? { label: collegeUniversityDetails.collegeLocation, value: collegeUniversityDetails.collegeLocation } : null}
                                        onChange={(selectedOption) => handleDetailChange('collegeUniversityDetails', 'collegeLocation', selectedOption ? selectedOption.value : '')}
                                        placeholder="Select or type to add location..."
                                        styles={{
                                            control: (base) => ({
                                                ...base,
                                                borderColor: '#d1d5db',
                                                minHeight: '42px',
                                                borderRadius: '0.375rem',
                                                backgroundColor: 'white',
                                                padding: '2px',
                                                boxShadow: 'none',
                                                '&:hover': {
                                                    borderColor: '#9ca3af'
                                                }
                                            }),
                                            menu: (base) => ({
                                                ...base,
                                                borderRadius: '0.375rem',
                                                border: '1px solid #e5e7eb',
                                                zIndex: 50
                                            }),
                                            option: (base, state) => ({
                                                ...base,
                                                backgroundColor: state.isSelected ? '#e5e7eb' : state.isFocused ? '#f3f4f6' : 'white',
                                                color: '#374151',
                                                cursor: 'pointer',
                                                '&:active': {
                                                    backgroundColor: '#e5e7eb'
                                                }
                                            })
                                        }}
                                    />
                                ) : (
                                    <input
                                        type="text"
                                        value={collegeUniversityDetails.collegeLocation || ''}
                                        readOnly
                                        className="w-full p-3 bg-white/50 backdrop-blur-sm border border-white/50 rounded-xl text-gray-900"
                                    />
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                                {isEditing ? (
                                    <select 
                                        value={selectedCountryISO} 
                                        onChange={handleCountryChange} 
                                        className="w-full p-3 bg-white/50 backdrop-blur-sm border border-white/50 rounded-xl focus:ring-2 focus:ring-[#93c5fd] focus:border-transparent focus:outline-none transition-all duration-200"
                                    >
                                        <option value="">Select Country</option>
                                        {Country.getAllCountries().map((item) => (
                                            <option key={item.isoCode} value={item.isoCode}>{item.name}</option>
                                        ))}
                                    </select>
                                ) : (
                                    <input type="text" value={collegeUniversityDetails.country || ''} readOnly className="w-full p-3 bg-white/50 backdrop-blur-sm border border-white/50 rounded-xl text-gray-900" />
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                                {isEditing ? (
                                    <select 
                                        value={selectedStateISO} 
                                        onChange={handleStateChange} 
                                        disabled={!selectedCountryISO} 
                                        className="w-full p-3 bg-white/50 backdrop-blur-sm border border-white/50 rounded-xl focus:ring-2 focus:ring-[#93c5fd] focus:border-transparent focus:outline-none transition-all duration-200 disabled:opacity-50"
                                    >
                                        <option value="">Select State</option>
                                        {selectedCountryISO && State.getStatesOfCountry(selectedCountryISO).map((item) => (
                                            <option key={item.isoCode} value={item.isoCode}>{item.name}</option>
                                        ))}
                                    </select>
                                ) : (
                                    <input type="text" value={collegeUniversityDetails.state || ''} readOnly className="w-full p-3 bg-white/50 backdrop-blur-sm border border-white/50 rounded-xl text-gray-900" />
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                                {isEditing ? (
                                    <select 
                                        value={collegeUniversityDetails.city || ''} 
                                        onChange={handleCityChange} 
                                        disabled={!selectedStateISO} 
                                        className="w-full p-3 bg-white/50 backdrop-blur-sm border border-white/50 rounded-xl focus:ring-2 focus:ring-[#93c5fd] focus:border-transparent focus:outline-none transition-all duration-200 disabled:opacity-50"
                                    >
                                        <option value="">Select City</option>
                                        {selectedStateISO && City.getCitiesOfState(selectedCountryISO, selectedStateISO).map((item) => (
                                            <option key={item.name} value={item.name}>{item.name}</option>
                                        ))}
                                    </select>
                                ) : (
                                    <input type="text" value={collegeUniversityDetails.city || ''} readOnly className="w-full p-3 bg-white/50 backdrop-blur-sm border border-white/50 rounded-xl text-gray-900" />
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Pincode</label>
                                <input
                                    type="text"
                                    value={collegeUniversityDetails.pincode || ''}
                                    onChange={(e) => handleDetailChange('collegeUniversityDetails', 'pincode', e.target.value)}
                                    placeholder="e.g., 400076"
                                    className={`w-full p-3 bg-white/50 backdrop-blur-sm border border-white/50 rounded-xl focus:ring-2 focus:ring-[#93c5fd] focus:border-transparent focus:outline-none transition-all duration-200 ${!isEditing ? 'text-gray-900' : ''}`}
                                    readOnly={!isEditing}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Placement Coordinator Details */}
                    <div className="border border-gray-300 rounded-md p-6 mb-8 shadow-sm">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-medium">Placement Coordinator Details</h2>
                        </div>
                        <p className="text-sm text-gray-600 mb-6">Key contact information for the college's placement and recruitment activities.</p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium mb-1">Coordinator Name *</label>
                                <input
                                    type="text"
                                    value={placementCoordinatorDetails.coordinatorName || ''}
                                    onChange={(e) => handleDetailChange('placementCoordinatorDetails', 'coordinatorName', e.target.value)}
                                    placeholder="e.g., Dr. Anjali Sharma"
                                    className="w-full border border-gray-300 rounded p-2"
                                    readOnly={!isEditing}
                                />
                            </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2 flex justify-center">
                                <div className="mb-6 text-center">
                                    <div
                                        className="relative w-32 h-32 bg-gradient-to-br from-[#f9a8d4]/20 to-[#ec4899]/10 rounded-full flex items-center justify-center mx-auto mb-4 overflow-hidden cursor-pointer border-4 border-white/50 backdrop-blur-sm hover:border-[#ec4899]/30 transition-all duration-200"
                                        onClick={() => isEditing && coordinatorProfileImageRef.current.click()}
                                    >
                                        {placementCoordinatorDetails.profilePictureUrl ? (
                                            <img
                                                src={placementCoordinatorDetails.profilePictureUrl}
                                                alt="Coordinator Profile"
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <User className="w-12 h-12 text-[#ec4899]" />
                                        )}
                                        {isEditing && (
                                            <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                                                <Upload className="w-8 h-8 text-white" />
                                            </div>
                                        )}
                                    </div>
                                    {isEditing && (
                                        <>
                                            <button 
                                                type="button" 
                                                onClick={() => coordinatorProfileImageRef.current.click()} 
                                                className="bg-gradient-to-r from-[#f9a8d4] to-[#ec4899] text-white text-sm px-4 py-2 rounded-lg hover:shadow-lg hover:shadow-[#f9a8d4]/40 transition-all duration-200"
                                            >
                                                Upload new photo
                                            </button>
                                            <input type="file" ref={coordinatorProfileImageRef} onChange={handleCoordinatorProfileImageChange} accept="image/*" className="hidden" />
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Designation - Custom Single Dropdown */}
                            <div className="md:col-span-2">
                                {renderSingleCustomDropdown(
                                    'designation',
                                    'placementCoordinatorDetails',
                                    'designation',
                                    'Designation',
                                    designationOptions,
                                    'Select or add designation'
                                )}
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <Mail className="inline w-4 h-4 mr-2 text-gray-400" />
                                    Official email ID *
                                </label>
                                <input
                                    type="email"
                                    value={placementCoordinatorDetails.officialEmail || ''}
                                    onChange={(e) => handleDetailChange('placementCoordinatorDetails', 'officialEmail', e.target.value)}
                                    placeholder="hello@xyz.com"
                                    className={`w-full p-3 bg-white/50 backdrop-blur-sm border border-white/50 rounded-xl focus:ring-2 focus:ring-[#93c5fd] focus:border-transparent focus:outline-none transition-all duration-200 ${!isEditing ? 'text-gray-900' : ''}`}
                                    readOnly={!isEditing}
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <Phone className="inline w-4 h-4 mr-2 text-gray-400" />
                                    Official Mobile No. *
                                </label>
                                <input
                                    type="tel"
                                    value={placementCoordinatorDetails.officialMobile || ''}
                                    onChange={(e) => handleDetailChange('placementCoordinatorDetails', 'officialMobile', e.target.value)}
                                    placeholder="1234567890"
                                    className={`w-full p-3 bg-white/50 backdrop-blur-sm border border-white/50 rounded-xl focus:ring-2 focus:ring-[#93c5fd] focus:border-transparent focus:outline-none transition-all duration-200 ${!isEditing ? 'text-gray-900' : ''}`}
                                    readOnly={!isEditing}
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <Link className="inline w-4 h-4 mr-2 text-gray-400" />
                                    LinkedIn Profile
                                </label>
                                <input
                                    type="text"
                                    value={placementCoordinatorDetails.linkedinUrl || ''}
                                    onChange={(e) => handleDetailChange('placementCoordinatorDetails', 'linkedinUrl', e.target.value)}
                                    placeholder="www.linkedin.com/in/yourprofile"
                                    className={`w-full p-3 bg-white/50 backdrop-blur-sm border border-white/50 rounded-xl focus:ring-2 focus:ring-[#93c5fd] focus:border-transparent focus:outline-none transition-all duration-200 ${!isEditing ? 'text-gray-900' : ''}`}
                                    readOnly={!isEditing}
                                />
                            </div>
                        </div>
                    </div>
                    </div>

                    {/* Placement & Recruitment Details */}
                    <div className="border border-gray-300 rounded-md p-6 mb-8 shadow-sm">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-medium">Placement & Recruitment Details</h2>
                        </div>
                        <p className="text-sm text-gray-600 mb-6">Information regarding academic programs, recruitment preferences, and services.</p>

                        <div className="space-y-6">
                            {renderCustomDropdown('programs', 'programsOffered', 'Programs Offered', programOptions, 'Select or add programs')}
                            {renderCustomDropdown('courses', 'popularCoursesForRecruitment', 'Popular Courses for Recruitment', courseOptions, 'Select or add courses')}
                            {renderCustomDropdown('companies', 'preferredHiringCompanies', 'Preferred Hiring Companies', companyOptions, 'Select or add companies')}

                            <div className="border-t border-gray-200/50 pt-8">
                                <h3 className="font-medium mb-4 text-gray-900">Recruitment Services Required?</h3>
                                <div className="flex flex-wrap gap-4">
                                    {['Job Fairs', 'Internship Support', 'Company Tie-ups'].map((service) => (
                                        <button
                                            key={service}
                                            type="button"
                                            disabled={!isEditing}
                                            onClick={() => handleServiceToggle(service)}
                                            className={`px-6 py-3 rounded-xl border transition-all duration-300 ${placementRecruitmentDetails.recruitmentServicesRequired?.includes(service) ? 'bg-gradient-to-r from-[#a7f3d0] to-[#10b981] text-white border-transparent shadow-md shadow-emerald-200/50' : 'border-white/50 text-gray-700 hover:bg-gradient-to-r hover:from-[#a7f3d0]/10 hover:to-transparent'} ${!isEditing ? 'cursor-default opacity-80' : 'hover:shadow-lg'}`}
                                        >
                                            {service}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="border-t border-gray-200/50 pt-8">
                                <label className="block text-sm font-medium text-gray-700 mb-2">College Brochure</label>
                                <div className="mt-1 flex flex-col">
                                    {isEditing ? (
                                        <>
                                            <input type="file" id="college-brochure-upload" ref={collegeBrochureRef} onChange={handleCollegeBrochureChange} className="hidden" accept=".pdf,.doc,.docx" />
                                            <label htmlFor="college-brochure-upload" className="cursor-pointer p-4 bg-white/50 backdrop-blur-sm border border-white/50 rounded-xl flex justify-between items-center hover:bg-white/80 transition-all duration-200 hover:shadow-md">
                                                <span className="text-gray-500">
                                                    {collegeBrochureFile?.name || (typeof placementRecruitmentDetails.collegeBrochureUrl === 'string' && placementRecruitmentDetails.collegeBrochureUrl.split('/').pop()) || 'Upload PDF/DOCX'}
                                                </span>
                                                <Upload className="w-5 h-5 text-gray-400" />
                                            </label>
                                        </>
                                    ) : (
                                        <div className="p-4 bg-white/50 backdrop-blur-sm border border-white/50 rounded-xl flex justify-between items-center text-gray-700">
                                            {placementRecruitmentDetails.collegeBrochureUrl ? (
                                                <a href={placementRecruitmentDetails.collegeBrochureUrl} target="_blank" rel="noopener noreferrer" className="text-[#3b82f6] hover:underline flex items-center gap-2">
                                                    <ExternalLink className="w-4 h-4" />
                                                    View Current Brochure
                                                </a>
                                            ) : (<span>No Brochure Uploaded</span>)}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white/90 backdrop-blur-sm border border-white/50 rounded-2xl shadow-lg shadow-amber-50/50 p-6 mb-8">
                        <div className="flex items-center mb-6">
                            <div className="w-10 h-10 bg-gradient-to-br from-[#fde68a]/30 to-[#f59e0b]/20 rounded-xl flex items-center justify-center mr-3">
                                <Award className="w-5 h-5 text-[#f59e0b]" />
                            </div>
                            <div>
                                <h2 className="text-lg font-semibold text-gray-900">College Profile & Achievements</h2>
                                <p className="text-sm text-gray-600">Showcase your institution's key highlights, achievements, and online presence!</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-6 mb-8">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <Globe className="inline w-4 h-4 mr-2 text-gray-400" />
                                    College Website *
                                </label>
                                <input
                                    type="text"
                                    value={profileAchievements.collegeWebsite || ''}
                                    onChange={(e) => handleDetailChange('profileAchievements', 'collegeWebsite', e.target.value)}
                                    placeholder="www.institute.io"
                                    className={`w-full p-3 bg-white/50 backdrop-blur-sm border border-white/50 rounded-xl focus:ring-2 focus:ring-[#93c5fd] focus:border-transparent focus:outline-none transition-all duration-200 ${!isEditing ? 'text-gray-900' : ''}`}
                                    readOnly={!isEditing}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <Link className="inline w-4 h-4 mr-2 text-gray-400" />
                                    LinkedIn Profile
                                </label>
                                <input
                                    type="text"
                                    value={profileAchievements.linkedinProfile || ''}
                                    onChange={(e) => handleDetailChange('profileAchievements', 'linkedinProfile', e.target.value)}
                                    placeholder="www.linkedin.com/company/yourcollege"
                                    className={`w-full p-3 bg-white/50 backdrop-blur-sm border border-white/50 rounded-xl focus:ring-2 focus:ring-[#93c5fd] focus:border-transparent focus:outline-none transition-all duration-200 ${!isEditing ? 'text-gray-900' : ''}`}
                                    readOnly={!isEditing}
                                />
                            </div>
                        </div>

                        {/* Arrays: Workshops, Volunteering, Awards */}
                        <div className="mt-8">
                            <h3 className="text-md font-medium mb-4">Workshop & Training Programs</h3>
                            {workshops.map((workshop, index) => (
                                <div key={index} className="grid grid-cols-1 gap-4 bg-white/50 backdrop-blur-sm border border-white/50 p-4 rounded-xl mb-4 relative hover:bg-white/70 transition-all duration-200">
                                    {isEditing && (
                                        <button 
                                            type="button" 
                                            onClick={() => removeArrayItem(setWorkshops, index)} 
                                            className="absolute top-3 right-3 text-gray-400 hover:text-red-500 transition-colors duration-200"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    )}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Workshop Name *</label>
                                        <input 
                                            type="text" 
                                            value={workshop.workshopName || ''} 
                                            onChange={(e) => handleArrayItemChange(setWorkshops, index, 'workshopName', e.target.value)} 
                                            placeholder="e.g., Python for Data Science" 
                                            className={`w-full p-3 bg-white backdrop-blur-sm border border-white/50 rounded-xl focus:ring-2 focus:ring-[#93c5fd] focus:border-transparent focus:outline-none transition-all duration-200 ${!isEditing ? 'text-gray-900' : ''}`} 
                                            readOnly={!isEditing} 
                                        />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                <Calendar className="inline w-4 h-4 mr-2 text-gray-400" />
                                                Start Date
                                            </label>
                                            <input 
                                                type="date" 
                                                value={workshop.startDate ? new Date(workshop.startDate).toISOString().split('T')[0] : ''} 
                                                onChange={(e) => handleArrayItemChange(setWorkshops, index, 'startDate', e.target.value)} 
                                                className={`w-full p-3 bg-white backdrop-blur-sm border border-white/50 rounded-xl focus:ring-2 focus:ring-[#93c5fd] focus:border-transparent focus:outline-none transition-all duration-200 ${!isEditing ? 'text-gray-900' : ''}`} 
                                                readOnly={!isEditing} 
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                <Calendar className="inline w-4 h-4 mr-2 text-gray-400" />
                                                End Date
                                            </label>
                                            <input 
                                                type="date" 
                                                value={workshop.endDate ? new Date(workshop.endDate).toISOString().split('T')[0] : ''} 
                                                onChange={(e) => handleArrayItemChange(setWorkshops, index, 'endDate', e.target.value)} 
                                                className={`w-full p-3 bg-white backdrop-blur-sm border border-white/50 rounded-xl focus:ring-2 focus:ring-[#93c5fd] focus:border-transparent focus:outline-none transition-all duration-200 ${!isEditing ? 'text-gray-900' : ''}`} 
                                                readOnly={!isEditing} 
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                                        <input 
                                            type="text" 
                                            value={workshop.description || ''} 
                                            onChange={(e) => handleArrayItemChange(setWorkshops, index, 'description', e.target.value)} 
                                            placeholder="Brief description of the workshop" 
                                            className={`w-full p-3 bg-white backdrop-blur-sm border border-white/50 rounded-xl focus:ring-2 focus:ring-[#93c5fd] focus:border-transparent focus:outline-none transition-all duration-200 ${!isEditing ? 'text-gray-900' : ''}`} 
                                            readOnly={!isEditing} 
                                        />
                                    </div>
                                </div>
                            ))}
                            {isEditing && (
                                <button 
                                    type="button" 
                                    onClick={() => addArrayItem(setWorkshops, { workshopName: '', startDate: '', endDate: '', description: '' })} 
                                    className="flex items-center gap-2 text-[#3b82f6] hover:text-[#1d4ed8] transition-colors duration-200"
                                >
                                    <Plus className="w-4 h-4" />
                                    Add workshop
                                </button>
                            )}
                        </div>

                        {/* Volunteering & Community Engagement */}
                        <div className="mb-8">
                            <div className="flex items-center mb-4">
                                <div className="w-8 h-8 bg-gradient-to-br from-[#fbcfe8]/30 to-[#ec4899]/20 rounded-lg flex items-center justify-center mr-3">
                                    <Users className="w-4 h-4 text-[#ec4899]" />
                                </div>
                                <h3 className="text-md font-medium text-gray-900">Volunteering & Community Engagement</h3>
                            </div>
                            {volunteering.map((event, index) => (
                                <div key={index} className="grid grid-cols-1 gap-4 bg-white/50 backdrop-blur-sm border border-white/50 p-4 rounded-xl mb-4 relative hover:bg-white/70 transition-all duration-200">
                                    {isEditing && (
                                        <button 
                                            type="button" 
                                            onClick={() => removeArrayItem(setVolunteering, index)} 
                                            className="absolute top-3 right-3 text-gray-400 hover:text-red-500 transition-colors duration-200"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    )}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Event Name *</label>
                                        <input 
                                            type="text" 
                                            value={event.eventName || ''} 
                                            onChange={(e) => handleArrayItemChange(setVolunteering, index, 'eventName', e.target.value)} 
                                            placeholder="e.g., Clean-up Drive" 
                                            className={`w-full p-3 bg-white backdrop-blur-sm border border-white/50 rounded-xl focus:ring-2 focus:ring-[#93c5fd] focus:border-transparent focus:outline-none transition-all duration-200 ${!isEditing ? 'text-gray-900' : ''}`} 
                                            readOnly={!isEditing} 
                                        />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                <Calendar className="inline w-4 h-4 mr-2 text-gray-400" />
                                                Start Date
                                            </label>
                                            <input 
                                                type="date" 
                                                value={event.startDate ? new Date(event.startDate).toISOString().split('T')[0] : ''} 
                                                onChange={(e) => handleArrayItemChange(setVolunteering, index, 'startDate', e.target.value)} 
                                                className={`w-full p-3 bg-white backdrop-blur-sm border border-white/50 rounded-xl focus:ring-2 focus:ring-[#93c5fd] focus:border-transparent focus:outline-none transition-all duration-200 ${!isEditing ? 'text-gray-900' : ''}`} 
                                                readOnly={!isEditing} 
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                <Calendar className="inline w-4 h-4 mr-2 text-gray-400" />
                                                End Date
                                            </label>
                                            <input 
                                                type="date" 
                                                value={event.endDate ? new Date(event.endDate).toISOString().split('T')[0] : ''} 
                                                onChange={(e) => handleArrayItemChange(setVolunteering, index, 'endDate', e.target.value)} 
                                                className={`w-full p-3 bg-white backdrop-blur-sm border border-white/50 rounded-xl focus:ring-2 focus:ring-[#93c5fd] focus:border-transparent focus:outline-none transition-all duration-200 ${!isEditing ? 'text-gray-900' : ''}`} 
                                                readOnly={!isEditing} 
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                                        <input 
                                            type="text" 
                                            value={event.description || ''} 
                                            onChange={(e) => handleArrayItemChange(setVolunteering, index, 'description', e.target.value)} 
                                            placeholder="Brief description of the event" 
                                            className={`w-full p-3 bg-white backdrop-blur-sm border border-white/50 rounded-xl focus:ring-2 focus:ring-[#93c5fd] focus:border-transparent focus:outline-none transition-all duration-200 ${!isEditing ? 'text-gray-900' : ''}`} 
                                            readOnly={!isEditing} 
                                        />
                                    </div>
                                </div>
                            ))}
                            {isEditing && (
                                <button 
                                    type="button" 
                                    onClick={() => addArrayItem(setVolunteering, { eventName: '', startDate: '', endDate: '', description: '' })} 
                                    className="flex items-center gap-2 text-[#3b82f6] hover:text-[#1d4ed8] transition-colors duration-200"
                                >
                                    <Plus className="w-4 h-4" />
                                    Add volunteering experience
                                </button>
                            )}
                        </div>

                        {/* Awards & Recognitions */}
                        <div className="mb-8">
                            <div className="flex items-center mb-4">
                                <div className="w-8 h-8 bg-gradient-to-br from-[#fde68a]/30 to-[#f59e0b]/20 rounded-lg flex items-center justify-center mr-3">
                                    <Award className="w-4 h-4 text-[#f59e0b]" />
                                </div>
                                <h3 className="text-md font-medium text-gray-900">Awards & Recognitions</h3>
                            </div>
                            {awards.map((award, index) => (
                                <div key={index} className="grid grid-cols-1 gap-4 bg-white/50 backdrop-blur-sm border border-white/50 p-4 rounded-xl mb-4 relative hover:bg-white/70 transition-all duration-200">
                                    {isEditing && (
                                        <button 
                                            type="button" 
                                            onClick={() => removeArrayItem(setAwards, index)} 
                                            className="absolute top-3 right-3 text-gray-400 hover:text-red-500 transition-colors duration-200"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    )}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Award Title *</label>
                                        <input 
                                            type="text" 
                                            value={award.awardTitle || ''} 
                                            onChange={(e) => handleArrayItemChange(setAwards, index, 'awardTitle', e.target.value)} 
                                            placeholder="e.g., Best Engineering College" 
                                            className={`w-full p-3 bg-white backdrop-blur-sm border border-white/50 rounded-xl focus:ring-2 focus:ring-[#93c5fd] focus:border-transparent focus:outline-none transition-all duration-200 ${!isEditing ? 'text-gray-900' : ''}`} 
                                            readOnly={!isEditing} 
                                        />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                <Calendar className="inline w-4 h-4 mr-2 text-gray-400" />
                                                Start Date
                                            </label>
                                            <input 
                                                type="date" 
                                                value={award.startDate ? new Date(award.startDate).toISOString().split('T')[0] : ''} 
                                                onChange={(e) => handleArrayItemChange(setAwards, index, 'startDate', e.target.value)} 
                                                className={`w-full p-3 bg-white backdrop-blur-sm border border-white/50 rounded-xl focus:ring-2 focus:ring-[#93c5fd] focus:border-transparent focus:outline-none transition-all duration-200 ${!isEditing ? 'text-gray-900' : ''}`} 
                                                readOnly={!isEditing} 
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                <Calendar className="inline w-4 h-4 mr-2 text-gray-400" />
                                                End Date
                                            </label>
                                            <input 
                                                type="date" 
                                                value={award.endDate ? new Date(award.endDate).toISOString().split('T')[0] : ''} 
                                                onChange={(e) => handleArrayItemChange(setAwards, index, 'endDate', e.target.value)} 
                                                className={`w-full p-3 bg-white backdrop-blur-sm border border-white/50 rounded-xl focus:ring-2 focus:ring-[#93c5fd] focus:border-transparent focus:outline-none transition-all duration-200 ${!isEditing ? 'text-gray-900' : ''}`} 
                                                readOnly={!isEditing} 
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Awarding Organization *</label>
                                        <input 
                                            type="text" 
                                            value={award.awardingOrganization || ''} 
                                            onChange={(e) => handleArrayItemChange(setAwards, index, 'awardingOrganization', e.target.value)} 
                                            placeholder="e.g., Ministry of Education" 
                                            className={`w-full p-3 bg-white backdrop-blur-sm border border-white/50 rounded-xl focus:ring-2 focus:ring-[#93c5fd] focus:border-transparent focus:outline-none transition-all duration-200 ${!isEditing ? 'text-gray-900' : ''}`} 
                                            readOnly={!isEditing} 
                                        />
                                    </div>
                                </div>
                            ))}
                            {isEditing && (
                                <button 
                                    type="button" 
                                    onClick={() => addArrayItem(setAwards, { awardTitle: '', startDate: '', endDate: '', awardingOrganization: '' })} 
                                    className="flex items-center gap-2 text-[#3b82f6] hover:text-[#1d4ed8] transition-colors duration-200"
                                >
                                    <Plus className="w-4 h-4" />
                                    Add award
                                </button>
                            )}
                        </div>

                        {isEditing && (
                            <div className="flex justify-end gap-4 pt-6 border-t border-gray-200/50">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsEditing(false);
                                        if (onboardingData) {
                                            const collegeDetails = onboardingData.collegeUniversityDetails || {};
                                            setCollegeUniversityDetails(collegeDetails);
                                            if (collegeDetails.country) {
                                                const foundCountry = Country.getAllCountries().find(c => c.name === collegeDetails.country);
                                                if (foundCountry) {
                                                    setSelectedCountryISO(foundCountry.isoCode);
                                                    if (collegeDetails.state) {
                                                        const foundState = State.getStatesOfCountry(foundCountry.isoCode).find(s => s.name === collegeDetails.state);
                                                        if (foundState) setSelectedStateISO(foundState.isoCode);
                                                    }
                                                }
                                            }
                                            setPlacementCoordinatorDetails(onboardingData.placementCoordinatorDetails || {});
                                            setPlacementRecruitmentDetails(onboardingData.placementRecruitmentDetails || {});
                                            setProfileAchievements(onboardingData.profileAchievements || {});
                                            setWorkshops(onboardingData.workshops || []);
                                            setVolunteering(onboardingData.volunteering || []);
                                            setAwards(onboardingData.awards || []);
                                            setCoordinatorProfileImageFile(null);
                                            setCollegeBrochureFile(null);
                                        }
                                    }}
                                    className="px-6 py-3 bg-white/50 backdrop-blur-sm border border-white/50 text-gray-700 rounded-xl hover:bg-white/80 transition-all duration-200 hover:shadow-md"
                                    disabled={loading}
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit" 
                                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#10b981] to-[#34d399] text-white rounded-xl hover:shadow-lg hover:shadow-emerald-200/50 transition-all duration-200" 
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="w-4 h-4" />
                                            Save Changes
                                        </>
                                    )}
                                </button>
                            </div>
                        )}
                    </div>
                    
                </form>
            </div>
        </div>
    );
}