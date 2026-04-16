import React, { useState, useEffect } from "react";
import { motion } from 'framer-motion';
import { Country, State, City } from 'country-state-city';
import { ChevronDownIcon } from "lucide-react";
import { fetchAllCompaniesName } from '@/lib/Company_AxiosInstance';


// Helper component for the dropdown/select box with an icon
const CustomSelect = ({ label, name, value, onChange, options, error, required = false }) => (
    <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
            {label} {required && <span className="text-red-500">*</span>}
        </label>
        <div className="relative">
            <select
                name={name}
                value={value || ''}
                onChange={onChange}
                className={`appearance-none w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#143694]/30 focus:border-[#143694] transition-all duration-300 bg-white/80 ${
                    error ? 'border-red-500' : 'border-gray-300'
                }`}
            >
                <option value="" disabled>Select {label}</option>
                {options.map((option) => (
                    <option key={option.isoCode || option.name} value={option.isoCode || option.name}>
                        {option.name}
                    </option>
                ))}
            </select>
            <ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
);


const ConnectToCompany = ({ onNext, onBack, formData, updateFormData }) => {
    const [errors, setErrors] = useState({});
    
    // Internal state for dynamically loaded geo data
    const [allCountries, setAllCountries] = useState([]);
    const [availableStates, setAvailableStates] = useState([]);
    const [availableCities, setAvailableCities] = useState([]);
    const [isRegisteringNewCompany, setIsRegisteringNewCompany] = useState(false);
    const [existingCompanyOptions, setExistingCompanyOptions] = useState([]);
    const [isLoadingCompanies, setIsLoadingCompanies] = useState(false);

    useEffect(() => {
      const loadCompanies = async () => {
        if (isLoadingCompanies) return;

        setIsLoadingCompanies(true);
        setExistingCompanyOptions([{ value: '', label: 'Loading companies...' }]);

        try {
          const response = await fetchAllCompaniesName();

          let companyData = [];
          if (Array.isArray(response?.data)) {
            companyData = response.data;
          } else if (Array.isArray(response)) {
            companyData = response;
          }

          setExistingCompanyOptions(companyData);
        } catch (error) {
          console.error('Failed to fetch company names:', error);
          setExistingCompanyOptions([
            { value: '', label: 'Error loading companies' }
          ]);
        } finally {
          setIsLoadingCompanies(false);
        }
      };

      loadCompanies();
    }, []);

    // Load countries
    useEffect(() => {
        setAllCountries(Country.getAllCountries());
    }, []);

    // Load states when country changes
    useEffect(() => {
        if (formData.countryIso) {
            const states = State.getStatesOfCountry(formData.countryIso);
            setAvailableStates(states);
            
            if (formData.stateIso && !states.find(s => s.isoCode === formData.stateIso)) {
                updateFormData({ state: '', stateIso: '', city: '' });
            }
        } else {
            setAvailableStates([]);
            updateFormData({ state: '', stateIso: '', city: '' });
        }
    }, [formData.countryIso]);

    // Load cities when state changes
    useEffect(() => {
        if (formData.countryIso && formData.stateIso) {
            const cities = City.getCitiesOfState(formData.countryIso, formData.stateIso);
            setAvailableCities(cities);
            
            if (formData.city && !cities.find(c => c.name === formData.city)) {
                updateFormData({ city: '' });
            }
        } else {
            setAvailableCities([]);
            updateFormData({ city: '' });
        }
    }, [formData.stateIso, formData.countryIso]);

    // Handlers
    const handleCountryChange = (e) => {
        const countryIso = e.target.value;
        const countryObj = allCountries.find(c => c.isoCode === countryIso);
        
        updateFormData({ 
            country: countryObj ? countryObj.name : '', 
            countryIso: countryIso,
            state: '', stateIso: '', 
            city: '' 
        });
    };

    const handleStateChange = (e) => {
        const stateIso = e.target.value;
        const stateObj = availableStates.find(s => s.isoCode === stateIso);

        updateFormData({ 
            state: stateObj ? stateObj.name : '', 
            stateIso: stateIso, 
            city: '' 
        });
    };
    
    const handleCityChange = (e) => {
        updateFormData({ city: e.target.value });
    };

    const handlePincodeChange = (e) => {
        updateFormData({ pincode: e.target.value });
    };

    const handleCompanyNameChange = (e) => {
        updateFormData({ companyName: e.target.value });
    };

    const toggleCompanyRegistration = () => {
        const isRegistering = !isRegisteringNewCompany;
        setIsRegisteringNewCompany(isRegistering);
        
        updateFormData({ companyName: '' });
        if (errors.companyName) {
            setErrors(prev => ({ ...prev, companyName: null }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.companyName) newErrors.companyName = 'Company name is required';
        if (!formData.country) newErrors.country = 'Country is required';
        // Require state only if states are available for the selected country
        if (availableStates.length > 0 && !formData.state) newErrors.state = 'State is required'; 
        // City is the final required location field
        if (!formData.city) newErrors.city = 'City (Company Location) is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => {
        if (validateForm()) {
            onNext();
        }
    };
    
    

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#143694]/15 via-[#f093fb]/10 to-[#1e4ed8]/15 p-4">
            {/* Blur Background around card */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-[#143694]/10 to-[#1e4ed8]/10 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-[#f093fb]/10 to-[#f5576c]/10 rounded-full blur-3xl"></div>
            </div>

            <div className="relative w-full max-w-2xl">
                {/* Blur background behind card */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#143694]/5 to-[#1e4ed8]/5 backdrop-blur-sm rounded-2xl -inset-x-4 bottom-0"></div>
                
                <motion.div
                    className="relative bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-100 p-8"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    {/* Decorative top bar */}
                    <div className="h-1 bg-gradient-to-r from-[#143694] via-[#f093fb] to-[#43e97b] rounded-t-2xl absolute top-0 left-0 right-0"></div>

                    {/* Progress indicator */}
                    <div className="flex items-center justify-start mb-8">
                        <div className="flex items-center space-x-4">
                            <div className="w-8 h-8 bg-gradient-to-r from-[#143694] to-[#1e4ed8] text-white rounded-full flex items-center justify-center text-sm font-medium">
                                ✓
                            </div>
                            <div className="w-16 h-px bg-gradient-to-r from-[#143694]/30 to-[#1e4ed8]/30"></div>
                            <div className="w-8 h-8 bg-gradient-to-r from-[#143694] to-[#1e4ed8] text-white rounded-full flex items-center justify-center text-sm font-medium">
                                2
                            </div>
                            <div className="w-16 h-px bg-gray-300"></div>
                            <div className="w-8 h-8 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-sm">
                                3
                            </div>
                        </div>
                    </div>

                    <h1 className="text-2xl font-bold text-gray-800 mb-2">
                        Connect to Your Company!
                    </h1>
                    <p className="text-gray-600 mb-6">
                        Select the company you represent or register a new one.
                    </p>

                    <form className="space-y-5">
                        {/* Company Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Company Name <span className="text-red-500">*</span>
                            </label>

                            {isRegisteringNewCompany ? (
                                <input
                                    type="text"
                                    name="companyName"
                                    value={formData.companyName || ''}
                                    onChange={handleCompanyNameChange}
                                    placeholder="Enter your new company name"
                                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#143694]/30 focus:border-[#143694] transition-all duration-300 bg-white/80 ${
                                        errors.companyName ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                />
                            ) : (
                                <div className="relative">
                                    <select
                                        name="companyName"
                                        value={formData.companyName || ''}
                                        onChange={handleCompanyNameChange}
                                        className={`appearance-none w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#143694]/30 focus:border-[#143694] transition-all duration-300 bg-white/80 ${
                                            errors.companyName ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    >
                                        <option value="" disabled>{isLoadingCompanies ? 'Loading companies...' : 'Select your company'}</option>
                                        {existingCompanyOptions.map((option) => (
                                          <option key={option.value} value={option.value}>
                                            {option.label}
                                          </option>
                                        ))}

                                    </select>
                                    <ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                                </div>
                            )}

                            {errors.companyName && <p className="mt-1 text-sm text-red-600">{errors.companyName}</p>}
                            
                            {/* Toggle Button */}
                            <button
                                type="button"
                                onClick={toggleCompanyRegistration}
                                className="text-[#143694] text-sm font-medium mt-1 hover:text-[#1e4ed8] hover:underline transition-colors"
                            >
                                {isRegisteringNewCompany ? 'Select Existing Company' : 'Register Your Company'}
                            </button>
                        </div>

                        {/* Country and State - 2 columns */}
                        <div className="grid grid-cols-2 gap-4">
                            {/* Country */}
                            <CustomSelect 
                                label="Country"
                                name="country"
                                value={formData.countryIso}
                                onChange={handleCountryChange}
                                options={allCountries}
                                error={errors.country}
                                required={true}
                            />

                            {/* State */}
                            <CustomSelect 
                                label="State"
                                name="state"
                                value={formData.stateIso}
                                onChange={handleStateChange}
                                options={availableStates}
                                error={errors.state}
                                required={availableStates.length > 0}
                            />
                        </div>

                        {/* City and Pincode - 2 columns */}
                        <div className="grid grid-cols-2 gap-4">
                            {/* City */}
                            <CustomSelect 
                                label="City (Company Location)"
                                name="city"
                                value={formData.city}
                                onChange={handleCityChange}
                                options={availableCities}
                                error={errors.city}
                                required={true}
                            />
                            
                            {/* Pincode */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Pincode
                                </label>
                                <input
                                    type="text"
                                    name="pincode"
                                    value={formData.pincode || ''}
                                    onChange={handlePincodeChange}
                                    placeholder="Enter Pincode"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#143694]/30 focus:border-[#143694] transition-all duration-300 bg-white/80"
                                />
                            </div>
                        </div>

                        <div className="flex justify-between mt-8">
                            <button
                                type="button"
                                onClick={onBack}
                                className="px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-all duration-300"
                            >
                                Back
                            </button>
                            <button
                                type="button"
                                onClick={handleNext}
                                className="px-6 py-3 bg-gradient-to-r from-[#143694] to-[#1e4ed8] text-white rounded-lg font-semibold hover:shadow-lg hover:scale-[1.02] transition-all duration-300 shadow-md"
                            >
                                Next
                            </button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </div>
    );
};

export default ConnectToCompany;
