import { motion } from 'framer-motion'
import { useState, useRef, useEffect, useMemo } from 'react'
import Button from '@/components/company/Button'
import { ChevronDownIcon } from 'lucide-react'
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

    // **MODIFIED**: Enhanced filtering and sorting logic
    const filteredLocations = useMemo(() => {
        if (!locationSearchTerm) {
            return locationOptions;
        }

        const lowercasedFilter = locationSearchTerm.toLowerCase();
        
        const filtered = locationOptions.filter(option =>
            option.label.toLowerCase().includes(lowercasedFilter)
        );

        // Sort to prioritize matches that start with the search term
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


    // Close dropdowns when clicking outside
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

    // Reset search term when the locations dropdown is closed
    useEffect(() => {
        if (!showLocationsDropdown) {
            setLocationSearchTerm('');
        }
    }, [showLocationsDropdown]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-2xl shadow-xl w-full max-w-2xl p-8"
            >
                <h1 className="text-2xl font-bold mb-1">Define Your Hiring Preferences!</h1>
                <p className="text-gray-600 mb-6">Tell us what roles you're hiring for and where!</p>

                <form onSubmit={handleSubmit}>
                    {/* Job Roles Dropdown */}
                    <div className="mb-6" ref={jobRolesRef}>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Job Roles You Hire For</label>
                        <div className="flex flex-wrap gap-2 mb-2">
                            {formData.jobRoles?.map((role) => {
                                const roleLabel = jobRoleOptions.find(opt => opt.value === role)?.label || role;
                                return (
                                    <span key={role} className="flex items-center bg-gray-200 text-sm text-black px-3 py-1 rounded-full">
                                        {roleLabel}
                                        <button type="button" onClick={() => removeJobRole(role)} className="ml-2 text-gray-600 hover:text-black">×</button>
                                    </span>
                                );
                            })}
                        </div>
                        <div className="relative">
                            <div className="flex items-center justify-between p-2 border border-gray-300 rounded-md cursor-pointer" onClick={() => setShowJobRolesDropdown(!showJobRolesDropdown)}>
                                <span className="text-gray-700">Select Job Roles</span>
                                <ChevronDownIcon className={`w-5 h-5 text-gray-500 transition-transform ${showJobRolesDropdown ? 'rotate-180' : ''}`} />
                            </div>
                            {showJobRolesDropdown && (
                                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                                    {jobRoleOptions.map((option) => (
                                        <div key={option.value} className={`p-2 hover:bg-gray-100 cursor-pointer ${formData.jobRoles?.includes(option.value) ? 'bg-gray-100' : ''}`} onClick={() => handleJobRoleSelect(option.value)}>
                                            {option.label}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Locations Dropdown with Search */}
                    <div className="mb-6" ref={locationsRef}>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Hiring Locations</label>
                        <div className="flex flex-wrap gap-2 mb-2">
                            {formData.hiringLocations?.map((location) => {
                                const locationLabel = locationOptions.find(opt => opt.value === location)?.label || location;
                                return (
                                    <span key={location} className="flex items-center bg-gray-200 text-sm text-black px-3 py-1 rounded-full">
                                        {locationLabel}
                                        <button type="button" onClick={() => removeLocation(location)} className="ml-2 text-gray-600 hover:text-black">×</button>
                                    </span>
                                );
                            })}
                        </div>
                        <div className="relative">
                            <div className="flex items-center justify-between p-2 border border-gray-300 rounded-md cursor-pointer" onClick={() => setShowLocationsDropdown(!showLocationsDropdown)}>
                                <span className="text-gray-700">Select Locations</span>
                                <ChevronDownIcon className={`w-5 h-5 text-gray-500 transition-transform ${showLocationsDropdown ? 'rotate-180' : ''}`} />
                            </div>
                            {showLocationsDropdown && (
                                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
                                    <input
                                        type="text"
                                        placeholder="Search for a city..."
                                        className="w-full p-2 border-b border-gray-200 outline-none sticky top-0"
                                        value={locationSearchTerm}
                                        onChange={(e) => setLocationSearchTerm(e.target.value)}
                                        onClick={(e) => e.stopPropagation()}
                                    />
                                    <div className="max-h-52 overflow-auto">
                                        {/* **MODIFIED**: Show 'not found' message or the list */}
                                        {filteredLocations.length > 0 ? (
                                            filteredLocations.map((option) => (
                                                <div 
                                                    key={option.value}
                                                    className={`p-2 hover:bg-gray-100 cursor-pointer ${formData.hiringLocations?.includes(option.value) ? 'bg-gray-100' : ''}`}
                                                    onClick={() => handleLocationSelect(option.value)}
                                                >
                                                    {option.label}
                                                </div>
                                            ))
                                        ) : (
                                            <div className="p-2 text-gray-500 text-center">No cities found.</div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Looking for section */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Looking for</label>
                        <div className="flex space-x-2">
                            {['job', 'internship', 'both'].map((option) => (
                                <button key={option} type="button" className={`px-4 py-2 rounded-md border ${lookingFor === option ? 'bg-black text-white border-black' : 'bg-white text-gray-700 border-gray-300'} transition-colors duration-200`} onClick={() => handleLookingForClick(option)}>
                                    {option.charAt(0).toUpperCase() + option.slice(1)}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Employment type section */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Employment type</label>
                        <div className="flex space-x-2">
                            {['part-time', 'full-time', 'contract'].map((type) => (
                                <button key={type} type="button" className={`px-4 py-2 rounded-md border ${formData.employmentType?.includes(type) ? 'bg-black text-white border-black' : 'bg-white text-gray-700 border-gray-300'} transition-colors duration-200`} onClick={() => handleEmploymentTypeClick(type)}>
                                    {type.replace('-', ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-end mt-8 space-x-4">
                        <Button variant="secondary" onClick={prevStep}>Back</Button>
                        <Button type="submit" variant="primary">Next</Button>
                    </div>
                </form>
            </motion.div>
        </div>
    )
}

export default HiringPreferencesStep