import { motion } from 'framer-motion'
import { useState, useRef, useEffect, useMemo } from 'react'
import { ChevronDownIcon, X } from 'lucide-react'
import { City } from 'country-state-city';
import CreatableSelect from 'react-select/creatable';
import {  getCompanyMasterDataByType,
  createCompanyMasterData } from '@/lib/Company_AxiosInstance';

const HiringPreferencesStep = ({ formData, handleChange, nextStep, prevStep }) => {

    const getInitialLookingFor = () => {
        if (Array.isArray(formData.lookingFor)) {
            if (formData.lookingFor.includes('internship') && formData.lookingFor.includes('job')) return 'both';
            return formData.lookingFor[0] || '';
        }
        return formData.lookingFor || '';
    }

    const [lookingFor, setLookingFor] = useState(getInitialLookingFor())
    const [jobRoleOptions, setJobRoleOptions] = useState([]);

    useEffect(() => {
      const fetchJobRoles = async () => {
        try {
          const res = await getCompanyMasterDataByType("JOB_ROLE");
          setJobRoleOptions(
            (res?.data?.data || []).map(item => ({
              value: item.value,
              label: item.value,
            }))
          );
        } catch (err) {
          console.error("Failed to fetch job roles", err);
        }
      };

      fetchJobRoles();
    }, []);
    

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
        <div className="min-h-screen bg-gradient-to-br from-[#143694]/10 via-[#f093fb]/5 to-[#1e4ed8]/10 p-4">
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-[#143694]/10 to-[#1e4ed8]/10 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-[#f093fb]/10 to-[#f5576c]/10 rounded-full blur-3xl"></div>
            </div>

            <div className="max-w-4xl mx-auto">
                

                <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#143694]/5 to-[#1e4ed8]/5 backdrop-blur-sm rounded-2xl -inset-x-4 bottom-0"></div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="relative bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-100 p-8"
                    >
                        <div className="h-1 bg-gradient-to-r from-[#143694] via-[#f093fb] to-[#43e97b] rounded-t-2xl absolute top-0 left-0 right-0"></div>

                        <div className="mb-8">
                            <h1 className="text-2xl font-bold text-gray-800 mb-2">Define Your Hiring Preferences!</h1>
                            <p className="text-gray-600">Tell us what roles you're hiring for and where!</p>
                        </div>

                        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div className="space-y-6">
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Job Roles You Hire For
                                  </label>

                                  <CreatableSelect
                                    isMulti
                                    placeholder="Select or type job roles"
                                    options={jobRoleOptions}
                                    value={(formData.jobRoles || []).map(role => ({
                                      value: role,
                                      label: role,
                                    }))}
                                    onChange={async (selectedOptions) => {
                                      if (!selectedOptions) {
                                        handleChange("jobRoles", []);
                                        return;
                                      }
                                  
                                      const finalRoles = [];
                                  
                                      for (const opt of selectedOptions) {
                                        // Existing role
                                        if (!opt.__isNew__) {
                                          finalRoles.push(opt.value);
                                        } else {
                                          // New role → save to DB
                                          try {
                                            const res = await createCompanyMasterData({
                                              type: "JOB_ROLE",
                                              value: opt.value,
                                              isCustom: true,
                                            });
                                        
                                            const savedValue = res.data.data.value;
                                        
                                            finalRoles.push(savedValue);
                                        
                                            setJobRoleOptions(prev => [
                                              ...prev,
                                              { value: savedValue, label: savedValue }
                                            ]);
                                          } catch (err) {
                                            console.error("Failed to create job role", err);
                                          }
                                        }
                                      }
                                  
                                      handleChange("jobRoles", finalRoles);
                                    }}
                                  />
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
                                                    ? 'bg-gradient-to-r from-[#143694] to-[#1e4ed8] text-white border-transparent shadow-md'
                                                    : 'bg-white/80 text-gray-700 border-gray-200 hover:border-[#143694]/50 hover:shadow-sm'
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
                                    className="px-6 py-3 bg-gradient-to-r from-[#143694] to-[#1e4ed8] text-white rounded-xl font-semibold hover:shadow-lg hover:scale-[1.02] transition-all duration-300 shadow-md"
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