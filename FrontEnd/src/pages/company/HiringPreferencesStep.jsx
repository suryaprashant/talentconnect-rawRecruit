import { motion } from 'framer-motion'
import { useState, useRef, useEffect, useMemo } from 'react'
import { ChevronDownIcon, X } from 'lucide-react'
import { City } from 'country-state-city';
import CreatableSelect from 'react-select/creatable';

const HiringPreferencesStep = ({ formData, handleChange, nextStep, prevStep }) => {

    const getInitialLookingFor = () => {
        if (Array.isArray(formData.lookingFor)) {
            if (formData.lookingFor.includes('internship') && formData.lookingFor.includes('job')) return 'both';
            return formData.lookingFor[0] || '';
        }
        return formData.lookingFor || '';
    }

    const [lookingFor, setLookingFor] = useState(getInitialLookingFor())
    const [showJobRolesDropdown, setShowJobRolesDropdown] = useState(false)
    const jobRolesRef = useRef(null)

    const handleSubmit = (e) => {
        e.preventDefault()
        
        let valueToSend;
        if (lookingFor === 'both') {
            // When both, value is internship and job (array)
            valueToSend = ['internship', 'job'];
        } else {
            // When single selection, value is just the string (e.g., 'internship' or 'job')
            valueToSend = lookingFor;
        }

        handleChange('lookingFor', valueToSend)
        nextStep()
    }

    const handleLookingForClick = (value) => {
        setLookingFor(value)
        
        let newValue;
        if (value === 'both') {
            // When both, value is internship and job (array)
            newValue = ['internship', 'job'];
        } else {
            // When single selection, value is just the string (e.g., 'internship' or 'job')
            newValue = value;
        }
        
        handleChange('lookingFor', newValue)
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

    // --- Locations Logic using React-Select ---

    const locationOptions = useMemo(() => {
        return City.getCitiesOfCountry('IN').map(city => ({
            value: city.name,
            label: city.name
        }));
    }, []);

    const handleLocationChange = (selectedOptions) => {
        const locations = selectedOptions ? selectedOptions.map(opt => opt.value) : [];
        handleChange('hiringLocations', locations);
    };

    const selectedLocationsValue = (formData.hiringLocations || []).map(loc => ({
        label: loc,
        value: loc
    }));

    const jobRoleOptions = [
        { value: 'software_engineer', label: 'Software Engineer' },
        { value: 'product_manager', label: 'Product Manager' },
        { value: 'designer', label: 'Designer' },
        { value: 'data_scientist', label: 'Data Scientist' },
        { value: 'marketing', label: 'Marketing' },
    ]

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (jobRolesRef.current && !jobRolesRef.current.contains(event.target)) {
                setShowJobRolesDropdown(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [])

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#667eea]/10 via-[#f093fb]/5 to-[#764ba2]/10 p-4">
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-[#667eea]/10 to-[#764ba2]/10 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-[#f093fb]/10 to-[#f5576c]/10 rounded-full blur-3xl"></div>
            </div>

            <div className="max-w-4xl mx-auto">
                

                <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#667eea]/5 to-[#764ba2]/5 backdrop-blur-sm rounded-2xl -inset-x-4 bottom-0"></div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="relative bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-100 p-8"
                    >
                        <div className="h-1 bg-gradient-to-r from-[#667eea] via-[#f093fb] to-[#43e97b] rounded-t-2xl absolute top-0 left-0 right-0"></div>

                        <div className="mb-8">
                            <h1 className="text-2xl font-bold text-gray-800 mb-2">Define Your Hiring Preferences!</h1>
                            <p className="text-gray-600">Tell us what roles you're hiring for and where!</p>
                        </div>

                        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div className="space-y-6">
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

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-3">
                                        Offering
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
                                                {option === 'both' ? 'Both (Job+Internship)' : option.charAt(0).toUpperCase() + option.slice(1)}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Preferred Hiring Locations
                                    </label>
                                    <CreatableSelect
                                        isMulti
                                        options={locationOptions}
                                        value={selectedLocationsValue}
                                        onChange={handleLocationChange}
                                        placeholder="Select or type to add locations..."
                                        styles={{
                                            control: (base) => ({
                                                ...base,
                                                borderColor: '#e5e7eb',
                                                minHeight: '42px',
                                                borderRadius: '0.75rem',
                                                backgroundColor: 'rgb(249 250 251 / var(--tw-bg-opacity))',
                                                backgroundImage: 'linear-gradient(to right, rgb(249 250 251), rgb(255 255 255))',
                                                padding: '2px',
                                            }),
                                            menu: (base) => ({
                                                ...base,
                                                borderRadius: '0.75rem',
                                                border: '1px solid #e5e7eb',
                                                zIndex: 50
                                            }),
                                            multiValue: (base) => ({
                                                ...base,
                                                backgroundColor: 'rgba(240, 147, 251, 0.1)',
                                                borderRadius: '9999px',
                                                border: '1px solid rgba(240, 147, 251, 0.2)',
                                            }),
                                            multiValueRemove: (base) => ({
                                                ...base,
                                                color: '#6b7280',
                                                borderRadius: '0 9999px 9999px 0',
                                                ':hover': {
                                                    backgroundColor: 'rgba(240, 147, 251, 0.2)',
                                                    color: '#374151',
                                                },
                                            }),
                                        }}
                                    />
                                </div>

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
                                    Next
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