import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Country, State, City } from 'country-state-city';
import FormField from '@/components/company/FormField';
import Button from '@/components/company/Button';
import { fetchAllCompaniesName } from '@/lib/Company_AxiosInstance';

const CompanyInfoStep = ({ formData, handleChange, nextStep, prevStep }) => {
    const [isRegisteringNewCompany, setIsRegisteringNewCompany] = useState(false);
    const [countries, setCountries] = useState([]);
    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);
   
    const [existingCompanyOptions, setExistingCompanyOptions] = useState([
        { value: '', label: 'Select an existing company' }
    ]);

    const [isLoadingCompanies, setIsLoadingCompanies] = useState(false);
    
    // Fetch companies on component mount
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
                
                setExistingCompanyOptions([
                    { value: '', label: 'Select an existing company' },
                    ...companyData
                ]);
            } catch (error) {
                console.error("Failed to fetch company names:", error);
                setExistingCompanyOptions([{ value: '', label: 'Error loading companies' }]);
            } finally {
                setIsLoadingCompanies(false);
            }
        };

        loadCompanies();
    }, []); // Empty dependency array = run once on mount

    useEffect(() => {
        setCountries(Country.getAllCountries());
    }, []);

    useEffect(() => {
        if (formData.country) {
            const selectedCountry = countries.find(c => c.name === formData.country);
            if (selectedCountry) {
                const statesOfCountry = State.getStatesOfCountry(selectedCountry.isoCode);
                setStates(statesOfCountry);
            }
        } else {
            setStates([]);
            setCities([]);
        }
    }, [formData.country, countries]);

    useEffect(() => {
        if (formData.country && formData.state) {
            const selectedCountry = countries.find(c => c.name === formData.country);
            const selectedState = states.find(s => s.name === formData.state);
            if (selectedCountry && selectedState) {
                const citiesOfState = City.getCitiesOfState(selectedCountry.isoCode, selectedState.isoCode);
                setCities(citiesOfState);
            }
        } else {
            setCities([]);
        }
    }, [formData.country, formData.state, countries, states]);

    const formatOptions = (data, valueKey, labelKey) => {
        if (!data) return [];
        return data.map(item => ({
            value: item[valueKey],
            label: item[labelKey]
        }));
    };
    
    const countryOptions = [{ value: '', label: 'Select country' }, ...formatOptions(countries, 'name', 'name')];
    const stateOptions = [{ value: '', label: 'Select state' }, ...formatOptions(states, 'name', 'name')];
    const cityOptions = [{ value: '', label: 'Select city' }, ...formatOptions(cities, 'name', 'name')];

    const handleSubmit = (e) => {
        e.preventDefault();
        // This client-side logic for adding a new company is kept as is
        if (isRegisteringNewCompany && formData.companyName.trim() !== '') {
            const newCompanyName = formData.companyName.trim();
            const companyExists = existingCompanyOptions.some(option => option.value.toLowerCase() === newCompanyName.toLowerCase());

            if (!companyExists) {
                const newCompany = { value: newCompanyName, label: newCompanyName };
                setExistingCompanyOptions(prevOptions => [...prevOptions, newCompany]);
            }
        }
        nextStep();
    };

    // --- Dropdown Options ---
    const companyTypeOptions = [
        { value: '', label: 'Select company type' },
        { value: 'startup', label: 'Startup' },
        { value: 'mnc', label: 'Multinational Corporation (MNC)' },
        { value: 'private', label: 'Private Limited' },
        { value: 'public', label: 'Public Limited' },
        { value: 'llc', label: 'Limited Liability Company (LLC)' },
        { value: 'partnership', label: 'Partnership' },
        { value: 'sole_proprietorship', label: 'Sole Proprietorship' },
        { value: 'non_profit', label: 'Non-Profit Organization' },
    ];

    const industryOptions = [
        { value: '', label: 'Select industry type' },
        { value: 'tech', label: 'Information Technology' },
        { value: 'healthcare', label: 'Healthcare & Pharmaceuticals' },
        { value: 'finance', label: 'Finance & Banking' },
        { value: 'ecommerce', label: 'E-commerce' },
        { value: 'education', label: 'Education' },
        { value: 'retail', label: 'Retail & Consumer Goods' },
        { value: 'manufacturing', label: 'Manufacturing' },
        { value: 'automotive', label: 'Automotive' },
        { value: 'media', label: 'Media & Entertainment' },
        { value: 'hospitality', label: 'Hospitality & Tourism' },
        { value: 'real_estate', label: 'Real Estate & Construction' },
        { value: 'telecom', label: 'Telecommunications' },
    ];

    const employeeCountOptions = [
        { value: '', label: 'Select employee count' },
        { value: '1-10', label: '1-10 employees' },
        { value: '11-50', label: '11-50 employees' },
        { value: '51-200', label: '51-200 employees' },
        { value: '201-500', label: '201-500 employees' },
        { value: '501-1000', label: '501-1,000 employees' },
        { value: '1001-5000', label: '1,001-5,000 employees' },
        { value: '5001-10000', label: '5,001-10,000 employees' },
        { value: '10001+', label: '10,001+ employees' },
    ];

    const yearOptions = [{ value: '', label: 'Select year established' }, ...Array.from({ length: 74 }, (_, i) => {
        const year = new Date().getFullYear() - i;
        return { value: year.toString(), label: year.toString() };
    })];

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="bg-white shadow-lg rounded-2xl p-10 w-full max-w-3xl"
            >
                <h1 className="text-2xl font-bold mb-1 text-center">Connect to Your Company!</h1>
                <p className="text-gray-600 mb-6 text-center">Select the company you represent or register a new one.</p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {!isRegisteringNewCompany ? (
                        <div>
                            <FormField
                                label="Company Name"
                                type="select"
                                name="companyName"
                                value={formData.companyName}
                                onChange={(e) => handleChange('companyName', e.target.value)}
                                options={existingCompanyOptions}
                                required
                                disabled={isLoadingCompanies}
                            />
                            {isLoadingCompanies && (
                                <p className="text-sm text-gray-500 text-center mt-1">Loading companies...</p>
                            )}
                            <p className="text-accent text-sm font-medium text-blue-600 cursor-pointer hover:underline mt-2 text-center"
                               onClick={() => {
                                   setIsRegisteringNewCompany(true);
                                   handleChange('companyName', '');
                               }}>
                                <span className='text-blue-600'>Register New Company</span>
                            </p>
                        </div>
                    ) : (
                        <div>
                            <FormField
                                label="Company Name"
                                type="text"
                                name="companyName"
                                value={formData.companyName}
                                onChange={(e) => handleChange('companyName', e.target.value)}
                                placeholder="Enter your company's full name"
                                required
                            />
                            <p className="text-accent text-sm font-medium text-blue-600 cursor-pointer hover:underline mt-2 text-center"
                               onClick={() => {
                                   setIsRegisteringNewCompany(false);
                                   handleChange('companyName', '');
                               }}>
                                <span className='text-blue-600'>Select Existing Company</span>
                            </p>
                        </div>
                    )}
                    
                    <FormField 
                        label="Description" 
                        type="textarea" 
                        name="description" 
                        value={formData.description} 
                        onChange={(e) => handleChange('description', e.target.value)} 
                        placeholder="Provide a brief description of your company..."
                    />
                    
                    <FormField 
                        label="Company Type" 
                        type="select" 
                        name="companyType" 
                        value={formData.companyType} 
                        onChange={(e) => handleChange('companyType', e.target.value)} 
                        options={companyTypeOptions} 
                        required
                    />
                    
                    <FormField 
                        label="Industry Type" 
                        type="select" 
                        name="industryType" 
                        value={formData.industryType} 
                        onChange={(e) => handleChange('industryType', e.target.value)} 
                        options={industryOptions} 
                        required
                    />
                    
                    <FormField 
                        label="Number of Employees" 
                        type="select" 
                        name="numberOfEmployees" 
                        value={formData.numberOfEmployees} 
                        onChange={(e) => handleChange('numberOfEmployees', e.target.value)} 
                        options={employeeCountOptions} 
                        required
                    />
                    
                    <FormField 
                        label="Established Year" 
                        type="select" 
                        name="establishedYear" 
                        value={formData.establishedYear} 
                        onChange={(e) => handleChange('establishedYear', e.target.value)} 
                        options={yearOptions} 
                        required
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField 
                            label="Contact Number" 
                            type="text" 
                            name="phoneNumber" 
                            value={formData.phoneNumber} 
                            onChange={(e) => handleChange('phoneNumber', e.target.value)} 
                            placeholder="e.g., +91 98765 43210"
                        />
                        <FormField 
                            label="Alternate Number" 
                            type="text" 
                            name="alternatePhoneNumber" 
                            value={formData.alternatePhoneNumber} 
                            onChange={(e) => handleChange('alternatePhoneNumber', e.target.value)} 
                            placeholder="e.g., +91 91234 56789"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                            label="Country"
                            type="select"
                            name="country"
                            value={formData.country} 
                            onChange={(e) => {
                                handleChange('country', e.target.value);
                                handleChange('state', '');
                                handleChange('city', '');
                                handleChange('pincode', '');
                            }}
                            options={countryOptions}
                            required
                        />
                        <FormField
                            label="State"
                            type="select"
                            name="state"
                            value={formData.state} 
                            onChange={(e) => {
                                handleChange('state', e.target.value);
                                handleChange('city', '');
                                handleChange('pincode', '');
                            }}
                            options={stateOptions}
                            required
                            disabled={!formData.country || states.length === 0}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                            label="City"
                            type="select"
                            name="city"
                            value={formData.city}
                            onChange={(e) => {
                                handleChange('city', e.target.value);
                                handleChange('pincode', '');
                            }}
                            options={cityOptions}
                            required
                            disabled={!formData.state || cities.length === 0}
                        />
                        <FormField
                            label="Pincode / Zip Code"
                            type="text" 
                            name="pincode"
                            value={formData.pincode}
                            onChange={(e) => handleChange('pincode', e.target.value)}
                            placeholder="Enter pincode or zip code"
                            required
                            disabled={!formData.city}
                        />
                    </div>
                    
                    <FormField 
                        label="Company Website (Optional)" 
                        type="url" 
                        name="websiteUrl" 
                        value={formData.websiteUrl} 
                        onChange={(e) => handleChange('websiteUrl', e.target.value)} 
                        placeholder="e.g., https://www.yourcompany.com"
                    />
                    
                    <FormField 
                        label="LinkedIn URL (Optional)" 
                        type="url" 
                        name="companyLinkedin" 
                        value={formData.companyLinkedin} 
                        onChange={(e) => handleChange('companyLinkedin', e.target.value)} 
                        placeholder="e.g., https://linkedin.com/company/yourcompany"
                    />

                    <div className="flex justify-end mt-8 space-x-4">
                        <Button variant="secondary" onClick={prevStep}>Back</Button>
                        <Button type="submit" variant="primary">Next</Button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default CompanyInfoStep;