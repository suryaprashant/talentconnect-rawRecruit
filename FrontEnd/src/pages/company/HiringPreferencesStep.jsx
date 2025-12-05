import { motion } from 'framer-motion'
import { useState, useRef, useEffect, useMemo } from 'react'
import Button from '@/components/company/Button'
import { ChevronDownIcon, X } from 'lucide-react'
import { City } from 'country-state-city';

const HiringPreferencesStep = ({ formData, handleChange, nextStep, prevStep }) => {
    const [lookingFor, setLookingFor] = useState(formData.lookingFor || '')
    const [showJobRolesDropdown, setShowJobRolesDropdown] = useState(false)
    const [showLocationsDropdown, setShowLocationsDropdown] = useState(false)
    const [locationSearchTerm, setLocationSearchTerm] = useState('');

    const jobRolesRef = useRef(null)
    const locationsRef = useRef(null)

    const handleSubmit = (e) => {
        e.preventDefault()
        handleChange('lookingFor', lookingFor)
        nextStep()
    }

    const handleLookingForClick = (value) => {
        setLookingFor(value)
        handleChange('lookingFor', value)
    }

    const handleEmploymentTypeClick = (value) => {
        const currentTypes = formData.employmentType || []
        let newTypes

        if (currentTypes.includes(value)) {
            newTypes = currentTypes.filter(type => type !== value)
        } else {
            newTypes = [...currentTypes, value]
        }

        handleChange('employmentType', newTypes)
    }

    const handleJobRoleSelect = (value) => {
        if (!formData.jobRoles?.includes(value)) {
            const newJobRoles = [...(formData.jobRoles || []), value]
            handleChange('jobRoles', newJobRoles)
        }
        setShowJobRolesDropdown(false)
    }

    const removeJobRole = (roleToRemove) => {
        const newJobRoles = formData.jobRoles?.filter(role => role !== roleToRemove) || []
        handleChange('jobRoles', newJobRoles)
    }

    const handleLocationSelect = (value) => {
        if (!formData.hiringLocations?.includes(value)) {
            const newLocations = [...(formData.hiringLocations || []), value]
            handleChange('hiringLocations', newLocations)
        }
        setShowLocationsDropdown(false)
    }

    const removeLocation = (locationToRemove) => {
        const newLocations = formData.hiringLocations?.filter(location => location !== locationToRemove) || []
        handleChange('hiringLocations', newLocations)
    }

    const jobRoleOptions = [
        { value: 'software_engineer', label: 'Software Engineer' },
        { value: 'product_manager', label: 'Product Manager' },
        { value: 'designer', label: 'Designer' },
        { value: 'data_scientist', label: 'Data Scientist' },
        { value: 'marketing', label: 'Marketing' },
    ]

    const locationOptions = useMemo(() => {
        return City.getCitiesOfCountry('IN').map(city => ({
            value: city.name,
            label: city.name
        }));
    }, []);


    const filteredLocations = useMemo(() => {
        if (!locationSearchTerm) {
            return locationOptions;
        }

        const lowercasedFilter = locationSearchTerm.toLowerCase();

        const filtered = locationOptions.filter(option =>
            option.label.toLowerCase().includes(lowercasedFilter)
        );

        return filtered.sort((a, b) => {
            const aLabel = a.label.toLowerCase();
            const bLabel = b.label.toLowerCase();
            const aStartsWith = aLabel.startsWith(lowercasedFilter);
            const bStartsWith = bLabel.startsWith(lowercasedFilter);

            if (aStartsWith && !bStartsWith) return -1;
            if (!aStartsWith && bStartsWith) return 1;
            return aLabel.localeCompare(bLabel);
        });

    }, [locationSearchTerm, locationOptions]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (jobRolesRef.current && !jobRolesRef.current.contains(event.target)) {
                setShowJobRolesDropdown(false)
            }
            if (locationsRef.current && !locationsRef.current.contains(event.target)) {
                setShowLocationsDropdown(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [])

    useEffect(() => {
        if (!showLocationsDropdown) {
            setLocationSearchTerm('');
        }
    }, [showLocationsDropdown]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#667eea]/10 via-[#f093fb]/5 to-[#764ba2]/10 p-4">
            {/* Background decorative elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-[#667eea]/10 to-[#764ba2]/10 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-[#f093fb]/10 to-[#f5576c]/10 rounded-full blur-3xl"></div>
            </div>

            <div className="max-w-4xl mx-auto">
                {/* Progress Indicator */}
                <div className="mb-8 bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
                    <div className="mb-4">
                        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#667eea]/10 to-[#764ba2]/10 text-[#667eea] px-4 py-2 rounded-full text-sm font-semibold shadow-sm">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                                <path fillRule="evenodd" d="M7.5 5.25a3 3 0 013-3h3a3 3 0 013 3v.205c.933.085 1.857.197 2.774.334 1.454.218 2.476 1.483 2.476 2.917v3.033c0 1.211-.734 2.352-1.936 2.752A24.726 24.726 0 0112 15.75c-2.73 0-5.357-.442-7.814-1.259-1.202-.4-1.936-1.541-1.936-2.752V8.706c0-1.434 1.022-2.7 2.476-2.917A48.814 48.814 0 017.5 5.455V5.25zm7.5 0v.09a49.488 49.488 0 00-6 0v-.09a1.5 1.5 0 011.5-1.5h3a1.5 1.5 0 011.5 1.5zm-3 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
                                <path d="M3 18.4v-2.796a4.3 4.3 0 00.713.31A26.226 26.226 0 0012 17.25c2.892 0 5.68-.468 8.287-1.335.252-.084.49-.189.713-.311V18.4c0 1.452-1.047 2.728-2.523 2.923-2.12.282-4.282.427-6.477.427a49.19 49.19 0 01-6.477-.427C4.047 21.128 3 19.852 3 18.4z" />
                            </svg>
                            Step 4: Hiring Preferences
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                            <span>Step 4 of 5</span>
                            <span>80%</span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-[#667eea] to-[#764ba2] w-4/5"></div>
                        </div>
                    </div>
                </div>

                {/* Main Card with blur */}
                <div className="relative">
                    {/* Blur background behind card ONLY */}
                    <div className="absolute inset-0 bg-gradient-to-br from-[#667eea]/5 to-[#764ba2]/5 backdrop-blur-sm rounded-2xl -inset-x-4 bottom-0"></div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="relative bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-100 p-8"
                    >
                        {/* Decorative top bar */}
                        <div className="h-1 bg-gradient-to-r from-[#667eea] via-[#f093fb] to-[#43e97b] rounded-t-2xl absolute top-0 left-0 right-0"></div>

                        {/* Header inside card */}
                        <div className="mb-8">
                            <h1 className="text-2xl font-bold text-gray-800 mb-2">Define Your Hiring Preferences!</h1>
                            <p className="text-gray-600">Tell us what roles you're hiring for and where!</p>
                        </div>

                        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Left Column */}
                            <div className="space-y-6">
                                {/* Job Roles Dropdown */}
                                <div ref={jobRolesRef}>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Job Roles You Hire For
                                    </label>
                                    <div className="flex flex-wrap gap-2 mb-3">
                                        {formData.jobRoles?.map((role) => {
                                            const roleLabel = jobRoleOptions.find(opt => opt.value === role)?.label || role;
                                            return (
                                                <span key={role} className="flex items-center bg-gradient-to-r from-[#667eea]/10 to-[#764ba2]/10 text-sm text-gray-800 px-3 py-1.5 rounded-full border border-[#667eea]/20">
                                                    {roleLabel}
                                                    <button type="button" onClick={() => removeJobRole(role)} className="ml-2 text-gray-500 hover:text-gray-700">
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                </span>
                                            );
                                        })}
                                    </div>
                                    <div className="relative">
                                        <div
                                            className="flex items-center justify-between p-3 border border-gray-200 rounded-xl cursor-pointer hover:border-[#667eea]/50 transition-all duration-300"
                                            onClick={() => setShowJobRolesDropdown(!showJobRolesDropdown)}
                                        >
                                            <span className="text-gray-700">Select Job Roles</span>
                                            <ChevronDownIcon className={`w-5 h-5 text-gray-500 transition-transform ${showJobRolesDropdown ? 'rotate-180' : ''}`} />
                                        </div>
                                        {showJobRolesDropdown && (
                                            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-auto">
                                                {jobRoleOptions.map((option) => (
                                                    <div
                                                        key={option.value}
                                                        className={`p-3 hover:bg-gray-50 cursor-pointer transition-colors ${formData.jobRoles?.includes(option.value) ? 'bg-gradient-to-r from-[#667eea]/5 to-[#764ba2]/5' : ''}`}
                                                        onClick={() => handleJobRoleSelect(option.value)}
                                                    >
                                                        {option.label}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Looking for section */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-3">
                                        Looking for
                                    </label>
                                    <div className="flex flex-wrap gap-3">
                                        {['job', 'internship', 'both'].map((option) => (
                                            <button
                                                key={option}
                                                type="button"
                                                className={`px-4 py-2.5 rounded-xl border transition-all duration-300 ${lookingFor === option
                                                    ? 'bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white border-transparent shadow-md'
                                                    : 'bg-white/80 text-gray-700 border-gray-200 hover:border-[#667eea]/50 hover:shadow-sm'
                                                    }`}
                                                onClick={() => handleLookingForClick(option)}
                                            >
                                                {option.charAt(0).toUpperCase() + option.slice(1)}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Right Column */}
                            <div className="space-y-6">
                                {/* Locations Dropdown with Search */}
                                <div ref={locationsRef}>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Preferred Hiring Locations
                                    </label>
                                    <div className="flex flex-wrap gap-2 mb-3 max-h-20 overflow-y-auto">
                                        {formData.hiringLocations?.map((location) => {
                                            const locationLabel = locationOptions.find(opt => opt.value === location)?.label || location;
                                            return (
                                                <span key={location} className="flex items-center bg-gradient-to-r from-[#f093fb]/10 to-[#f5576c]/10 text-sm text-gray-800 px-3 py-1.5 rounded-full border border-[#f093fb]/20">
                                                    {locationLabel}
                                                    <button type="button" onClick={() => removeLocation(location)} className="ml-2 text-gray-500 hover:text-gray-700">
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                </span>
                                            );
                                        })}
                                    </div>
                                    <div className="relative">
                                        <div
                                            className="flex items-center justify-between p-3 border border-gray-200 rounded-xl cursor-pointer hover:border-[#667eea]/50 transition-all duration-300"
                                            onClick={() => setShowLocationsDropdown(!showLocationsDropdown)}
                                        >
                                            <span className="text-gray-700">Select Locations</span>
                                            <ChevronDownIcon className={`w-5 h-5 text-gray-500 transition-transform ${showLocationsDropdown ? 'rotate-180' : ''}`} />
                                        </div>
                                        {showLocationsDropdown && (
                                            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg">
                                                <input
                                                    type="text"
                                                    placeholder="Search for a city..."
                                                    className="w-full p-3 border-b border-gray-200 outline-none sticky top-0 bg-white rounded-t-xl"
                                                    value={locationSearchTerm}
                                                    onChange={(e) => setLocationSearchTerm(e.target.value)}
                                                    onClick={(e) => e.stopPropagation()}
                                                />
                                                <div className="max-h-52 overflow-auto">
                                                    {filteredLocations.length > 0 ? (
                                                        filteredLocations.map((option) => (
                                                            <div
                                                                key={option.value}
                                                                className={`p-3 hover:bg-gray-50 cursor-pointer transition-colors ${formData.hiringLocations?.includes(option.value) ? 'bg-gradient-to-r from-[#f093fb]/5 to-[#f5576c]/5' : ''}`}
                                                                onClick={() => handleLocationSelect(option.value)}
                                                            >
                                                                {option.label}
                                                            </div>
                                                        ))
                                                    ) : (
                                                        <div className="p-3 text-gray-500 text-center">No cities found.</div>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Employment type section */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-3">
                                        Employment type
                                    </label>
                                    <div className="flex flex-wrap gap-3">
                                        {['part-time', 'full-time', 'contract'].map((type) => (
                                            <button
                                                key={type}
                                                type="button"
                                                className={`px-4 py-2.5 rounded-xl border transition-all duration-300 ${formData.employmentType?.includes(type)
                                                    ? 'bg-gradient-to-r from-[#43e97b] to-[#38f9d7] text-gray-800 border-transparent shadow-md'
                                                    : 'bg-white/80 text-gray-700 border-gray-200 hover:border-[#43e97b]/50 hover:shadow-sm'
                                                    }`}
                                                onClick={() => handleEmploymentTypeClick(type)}
                                            >
                                                {type.replace('-', ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Full width buttons at bottom */}
                            <div className="lg:col-span-2 flex justify-between mt-8 pt-6 border-t border-gray-100">
                                <button
                                    type="button"
                                    onClick={prevStep}
                                    className="px-6 py-3 border border-gray-300 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition-all duration-300 hover:shadow-sm"
                                >
                                    Back
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-3 bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white rounded-xl font-semibold hover:shadow-lg hover:scale-[1.02] transition-all duration-300 shadow-md"
                                >
                                    Continue
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            </div>
        </div>
    )
}

export default HiringPreferencesStep