// import { motion } from 'framer-motion';
// import { useState, useEffect } from 'react';
// import { Country, State, City } from 'country-state-city';
// import FormField from '@/components/company/FormField';
// import Button from '@/components/company/Button';
// import { fetchAllCompaniesName } from '@/lib/Company_AxiosInstance';

// const CompanyInfoStep = ({ formData, handleChange, nextStep, prevStep }) => {
//     const [isRegisteringNewCompany, setIsRegisteringNewCompany] = useState(false);
//     const [countries, setCountries] = useState([]);
//     const [states, setStates] = useState([]);
//     const [cities, setCities] = useState([]);
//     const [existingCompanyOptions, setExistingCompanyOptions] = useState([
//         { value: '', label: 'Select an existing company' }
//     ]);
//     const [isLoadingCompanies, setIsLoadingCompanies] = useState(false);
//     const [errors, setErrors] = useState({});
//     const [isSubmitting, setIsSubmitting] = useState(false);

//     useEffect(() => {
//         const loadCompanies = async () => {
//             if (isLoadingCompanies) return;

//             setIsLoadingCompanies(true);
//             setExistingCompanyOptions([{ value: '', label: 'Loading companies...' }]);

//             try {
//                 const response = await fetchAllCompaniesName();

//                 let companyData = [];
//                 if (Array.isArray(response?.data)) {
//                     companyData = response.data;
//                 } else if (Array.isArray(response)) {
//                     companyData = response;
//                 }

//                 setExistingCompanyOptions([
//                     { value: '', label: 'Select an existing company' },
//                     ...companyData
//                 ]);
//             } catch (error) {
//                 console.error("Failed to fetch company names:", error);
//                 setExistingCompanyOptions([{ value: '', label: 'Error loading companies' }]);
//             } finally {
//                 setIsLoadingCompanies(false);
//             }
//         };

//         loadCompanies();
//     }, []);

//     useEffect(() => {
        
//         const allCountries = Country.getAllCountries();
//         const sortedCountries = allCountries.sort((a, b) => {
//             if (a.name === 'India') return -1;
//             if (b.name === 'India') return 1;
//             return a.name.localeCompare(b.name);
//         });
//         setCountries(sortedCountries);
//     }, []);

//     useEffect(() => {
//         if (formData.country) {
//             const selectedCountry = countries.find(c => c.name === formData.country);
//             if (selectedCountry) {
//                 const statesOfCountry = State.getStatesOfCountry(selectedCountry.isoCode);
//                 setStates(statesOfCountry);
//             }
//         } else {
//             setStates([]);
//             setCities([]);
//         }
//     }, [formData.country, countries]);

//     useEffect(() => {
//         if (formData.country && formData.state) {
//             const selectedCountry = countries.find(c => c.name === formData.country);
//             const selectedState = states.find(s => s.name === formData.state);
//             if (selectedCountry && selectedState) {
//                 const citiesOfState = City.getCitiesOfState(selectedCountry.isoCode, selectedState.isoCode);
//                 setCities(citiesOfState);
//             }
//         } else {
//             setCities([]);
//         }
//     }, [formData.country, formData.state, countries, states]);

//     const formatOptions = (data, valueKey, labelKey) => {
//         if (!data) return [];
//         return data.map(item => ({
//             value: item[valueKey],
//             label: item[labelKey]
//         }));
//     };

//     const countryOptions = [
//         { value: '', label: 'Select country' }, 
//         ...formatOptions(countries, 'name', 'name')
//     ];

//     const stateOptions = [
//         { value: '', label: formData.country ? 'Select state' : 'Select country first' }, 
//         ...formatOptions(states, 'name', 'name')
//     ];

//     const cityOptions = [
//         { value: '', label: formData.state ? 'Select city' : 'Select state first' }, 
//         ...formatOptions(cities, 'name', 'name')
//     ];

//     const validateForm = () => {
//         const newErrors = {};

//         // Company Name validation
//         if (!formData.companyName || formData.companyName.trim() === '') {
//             newErrors.companyName = 'Company name is required';
//         }

//         // Company Type validation
//         if (!formData.companyType) {
//             newErrors.companyType = 'Company type is required';
//         }

//         // Industry Type validation
//         if (!formData.industryType) {
//             newErrors.industryType = 'Industry type is required';
//         }

//         // Employee Count validation
//         if (!formData.numberOfEmployees) {
//             newErrors.numberOfEmployees = 'Employee count is required';
//         }

//         // Established Year validation
//         if (!formData.establishedYear) {
//             newErrors.establishedYear = 'Established year is required';
//         }

//         // Country validation
//         if (!formData.country) {
//             newErrors.country = 'Country is required';
//         }

//         // State validation
//         if (!formData.state && formData.country) {
//             newErrors.state = 'State is required';
//         }

//         // City validation
//         if (!formData.city && formData.state) {
//             newErrors.city = 'City is required';
//         }

//         // Pincode validation
//         if (!formData.pincode || formData.pincode.trim() === '') {
//             newErrors.pincode = 'Pincode/Zip code is required';
//         }

//         // Phone Number validation
//         if (!formData.phoneNumber || formData.phoneNumber.trim() === '') {
//             newErrors.phoneNumber = 'Contact number is required';
//         }

//         setErrors(newErrors);
//         return Object.keys(newErrors).length === 0;
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setIsSubmitting(true);

//         if (!validateForm()) {
//             setIsSubmitting(false);
//             return;
//         }

//         try {
//             if (isRegisteringNewCompany && formData.companyName.trim() !== '') {
//                 const newCompanyName = formData.companyName.trim();
//                 const companyExists = existingCompanyOptions.some(option => 
//                     option.value.toLowerCase() === newCompanyName.toLowerCase()
//                 );

//                 if (!companyExists) {
//                     const newCompany = { value: newCompanyName, label: newCompanyName };
//                     setExistingCompanyOptions(prevOptions => [...prevOptions, newCompany]);
//                 }
//             }
            
//             await nextStep();
//         } catch (error) {
//             console.error("Error in form submission:", error);
//         } finally {
//             setIsSubmitting(false);
//         }
//     };

//     const companyTypeOptions = [
//         { value: '', label: 'Select company type' },
//         { value: 'startup', label: 'Startup' },
//         { value: 'mnc', label: 'Multinational Corporation (MNC)' },
//         { value: 'private', label: 'Private Limited' },
//         { value: 'public', label: 'Public Limited' },
//         { value: 'llc', label: 'Limited Liability Company (LLC)' },
//         { value: 'partnership', label: 'Partnership' },
//         { value: 'sole_proprietorship', label: 'Sole Proprietorship' },
//         { value: 'non_profit', label: 'Non-Profit Organization' },
//     ];

//     const industryOptions = [
//         { value: '', label: 'Select industry type' },
//         { value: 'tech', label: 'Information Technology' },
//         { value: 'healthcare', label: 'Healthcare & Pharmaceuticals' },
//         { value: 'finance', label: 'Finance & Banking' },
//         { value: 'ecommerce', label: 'E-commerce' },
//         { value: 'education', label: 'Education' },
//         { value: 'retail', label: 'Retail & Consumer Goods' },
//         { value: 'manufacturing', label: 'Manufacturing' },
//         { value: 'automotive', label: 'Automotive' },
//         { value: 'media', label: 'Media & Entertainment' },
//         { value: 'hospitality', label: 'Hospitality & Tourism' },
//         { value: 'real_estate', label: 'Real Estate & Construction' },
//         { value: 'telecom', label: 'Telecommunications' },
//     ];

//     const employeeCountOptions = [
//         { value: '', label: 'Select employee count' },
//         { value: '1-10', label: '1-10 employees' },
//         { value: '11-50', label: '11-50 employees' },
//         { value: '51-200', label: '51-200 employees' },
//         { value: '201-500', label: '201-500 employees' },
//         { value: '501-1000', label: '501-1,000 employees' },
//         { value: '1001-5000', label: '1,001-5,000 employees' },
//         { value: '5001-10000', label: '5,001-10,000 employees' },
//         { value: '10001+', label: '10,001+ employees' },
//     ];

//     const yearOptions = [
//         { value: '', label: 'Select year established' }, 
//         ...Array.from({ length: 74 }, (_, i) => {
//             const year = new Date().getFullYear() - i;
//             return { value: year.toString(), label: year.toString() };
//         })
//     ];

//     return (
//         <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#667eea]/10 via-[#f093fb]/5 to-[#764ba2]/10 p-4">
//             {/* Fixed container to prevent layout shifts */}
//             <div className="fixed inset-0 overflow-hidden pointer-events-none">
//                 <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-[#667eea]/10 to-[#764ba2]/10 rounded-full blur-3xl"></div>
//                 <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-[#f093fb]/10 to-[#f5576c]/10 rounded-full blur-3xl"></div>
//             </div>

//             <div className="relative w-full max-w-3xl">
//                 {/* Fixed size background */}
//                 <div className="absolute inset-0 bg-gradient-to-br from-[#667eea]/5 to-[#764ba2]/5 backdrop-blur-sm rounded-2xl -inset-x-4 bottom-0 min-h-[calc(100%+2rem)]"></div>

//                 <motion.div
//                     initial={{ opacity: 0, y: 10 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     exit={{ opacity: 0, y: -10 }}
//                     transition={{ duration: 0.3 }}
//                     className="relative bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-100 p-8"
//                 >
//                     {/* Decorative top bar */}
//                     <div className="h-1 bg-gradient-to-r from-[#667eea] via-[#f093fb] to-[#43e97b] rounded-t-2xl absolute top-0 left-0 right-0"></div>

//                     <h1 className="text-2xl font-bold mb-1 text-gray-800 text-center">Connect to Your Company!</h1>
//                     <p className="text-gray-600 mb-6 text-center">Select the company you represent or register a new one.</p>

//                     <form onSubmit={handleSubmit} className="space-y-6">
//                         {!isRegisteringNewCompany ? (
//                             <div className="min-h-[80px]">
//                                 <FormField
//                                     label="Company Name"
//                                     type="select"
//                                     name="companyName"
//                                     value={formData.companyName}
//                                     onChange={(e) => {
//                                         handleChange('companyName', e.target.value);
//                                         setErrors(prev => ({ ...prev, companyName: '' }));
//                                     }}
//                                     options={existingCompanyOptions}
//                                     required
//                                     disabled={isLoadingCompanies}
//                                     error={errors.companyName}
//                                 />
//                                 {isLoadingCompanies && (
//                                     <p className="text-sm text-gray-500 text-center mt-1">Loading companies...</p>
//                                 )}
//                                 <p className="text-[#667eea] text-sm font-medium cursor-pointer hover:text-[#764ba2] hover:underline mt-2 text-center transition-colors"
//                                     onClick={() => {
//                                         setIsRegisteringNewCompany(true);
//                                         handleChange('companyName', '');
//                                         setErrors(prev => ({ ...prev, companyName: '' }));
//                                     }}>
//                                     Register New Company
//                                 </p>
//                             </div>
//                         ) : (
//                             <div className="min-h-[80px]">
//                                 <FormField
//                                     label="Company Name"
//                                     type="text"
//                                     name="companyName"
//                                     value={formData.companyName}
//                                     onChange={(e) => {
//                                         handleChange('companyName', e.target.value);
//                                         setErrors(prev => ({ ...prev, companyName: '' }));
//                                     }}
//                                     placeholder="Enter your company's full name"
//                                     required
//                                     error={errors.companyName}
//                                 />
//                                 <p className="text-[#667eea] text-sm font-medium cursor-pointer hover:text-[#764ba2] hover:underline mt-2 text-center transition-colors"
//                                     onClick={() => {
//                                         setIsRegisteringNewCompany(false);
//                                         handleChange('companyName', '');
//                                         setErrors(prev => ({ ...prev, companyName: '' }));
//                                     }}>
//                                     Select Existing Company
//                                 </p>
//                             </div>
//                         )}

//                         <div className="min-h-[100px]">
//                             <FormField
//                                 label="Description"
//                                 type="textarea"
//                                 name="description"
//                                 value={formData.description}
//                                 onChange={(e) => handleChange('description', e.target.value)}
//                                 placeholder="Provide a brief description of your company..."
//                             />
//                         </div>

//                         <div className="min-h-[80px]">
//                             <FormField
//                                 label="Company Type"
//                                 type="select"
//                                 name="companyType"
//                                 value={formData.companyType}
//                                 onChange={(e) => {
//                                     handleChange('companyType', e.target.value);
//                                     setErrors(prev => ({ ...prev, companyType: '' }));
//                                 }}
//                                 options={companyTypeOptions}
//                                 required
//                                 error={errors.companyType}
//                             />
//                         </div>

//                         <div className="min-h-[80px]">
//                             <FormField
//                                 label="Industry Type"
//                                 type="select"
//                                 name="industryType"
//                                 value={formData.industryType}
//                                 onChange={(e) => {
//                                     handleChange('industryType', e.target.value);
//                                     setErrors(prev => ({ ...prev, industryType: '' }));
//                                 }}
//                                 options={industryOptions}
//                                 required
//                                 error={errors.industryType}
//                             />
//                         </div>

//                         <div className="min-h-[80px]">
//                             <FormField
//                                 label="Number of Employees"
//                                 type="select"
//                                 name="numberOfEmployees"
//                                 value={formData.numberOfEmployees}
//                                 onChange={(e) => {
//                                     handleChange('numberOfEmployees', e.target.value);
//                                     setErrors(prev => ({ ...prev, numberOfEmployees: '' }));
//                                 }}
//                                 options={employeeCountOptions}
//                                 required
//                                 error={errors.numberOfEmployees}
//                             />
//                         </div>

//                         <div className="min-h-[80px]">
//                             <FormField
//                                 label="Established Year"
//                                 type="select"
//                                 name="establishedYear"
//                                 value={formData.establishedYear}
//                                 onChange={(e) => {
//                                     handleChange('establishedYear', e.target.value);
//                                     setErrors(prev => ({ ...prev, establishedYear: '' }));
//                                 }}
//                                 options={yearOptions}
//                                 required
//                                 error={errors.establishedYear}
//                             />
//                         </div>

//                         <div className="space-y-4">
//                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 min-h-[80px]">
//                                 <FormField
//                                     label="Contact Number"
//                                     type="text"
//                                     name="phoneNumber"
//                                     value={formData.phoneNumber}
//                                     onChange={(e) => {
//                                         handleChange('phoneNumber', e.target.value);
//                                         setErrors(prev => ({ ...prev, phoneNumber: '' }));
//                                     }}
//                                     placeholder="e.g., +91 98765 43210"
//                                     required
//                                     error={errors.phoneNumber}
//                                 />
//                                 <FormField
//                                     label="Alternate Number"
//                                     type="text"
//                                     name="alternatePhoneNumber"
//                                     value={formData.alternatePhoneNumber}
//                                     onChange={(e) => handleChange('alternatePhoneNumber', e.target.value)}
//                                     placeholder="e.g., +91 91234 56789"
//                                 />
//                             </div>
//                         </div>

//                         <div className="space-y-4">
//                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 min-h-[80px]">
//                                 <FormField
//                                     label="Country"
//                                     type="select"
//                                     name="country"
//                                     value={formData.country}
//                                     onChange={(e) => {
//                                         handleChange('country', e.target.value);
//                                         handleChange('state', '');
//                                         handleChange('city', '');
//                                         handleChange('pincode', '');
//                                         setErrors(prev => ({ 
//                                             ...prev, 
//                                             country: '',
//                                             state: '',
//                                             city: '',
//                                             pincode: ''
//                                         }));
//                                     }}
//                                     options={countryOptions}
//                                     required
//                                     error={errors.country}
//                                 />
//                                 <FormField
//                                     label="State"
//                                     type="select"
//                                     name="state"
//                                     value={formData.state}
//                                     onChange={(e) => {
//                                         handleChange('state', e.target.value);
//                                         handleChange('city', '');
//                                         handleChange('pincode', '');
//                                         setErrors(prev => ({ 
//                                             ...prev, 
//                                             state: '',
//                                             city: '',
//                                             pincode: ''
//                                         }));
//                                     }}
//                                     options={stateOptions}
//                                     required
//                                     disabled={!formData.country || states.length === 0}
//                                     error={errors.state}
//                                 />
//                             </div>
//                         </div>

//                         <div className="space-y-4">
//                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 min-h-[80px]">
//                                 <FormField
//                                     label="City"
//                                     type="select"
//                                     name="city"
//                                     value={formData.city}
//                                     onChange={(e) => {
//                                         handleChange('city', e.target.value);
//                                         handleChange('pincode', '');
//                                         setErrors(prev => ({ 
//                                             ...prev, 
//                                             city: '',
//                                             pincode: ''
//                                         }));
//                                     }}
//                                     options={cityOptions}
//                                     required
//                                     disabled={!formData.state || cities.length === 0}
//                                     error={errors.city}
//                                 />
//                                 <FormField
//                                     label="Pincode / Zip Code"
//                                     type="text"
//                                     name="pincode"
//                                     value={formData.pincode}
//                                     onChange={(e) => {
//                                         handleChange('pincode', e.target.value);
//                                         setErrors(prev => ({ ...prev, pincode: '' }));
//                                     }}
//                                     placeholder="Enter pincode or zip code"
//                                     required
//                                     disabled={!formData.city}
//                                     error={errors.pincode}
//                                 />
//                             </div>
//                         </div>

//                         <div className="min-h-[80px]">
//                             <FormField
//                                 label="Company Website (Optional)"
//                                 type="url"
//                                 name="websiteUrl"
//                                 value={formData.websiteUrl}
//                                 onChange={(e) => handleChange('websiteUrl', e.target.value)}
//                                 placeholder="e.g., https://www.yourcompany.com"
//                             />
//                         </div>

//                         <div className="min-h-[80px]">
//                             <FormField
//                                 label="LinkedIn URL (Optional)"
//                                 type="url"
//                                 name="companyLinkedin"
//                                 value={formData.companyLinkedin}
//                                 onChange={(e) => handleChange('companyLinkedin', e.target.value)}
//                                 placeholder="e.g., https://linkedin.com/company/yourcompany"
//                             />
//                         </div>

//                         <div className="flex justify-end mt-8 pt-6 border-t border-gray-100 space-x-4">
//                             <button
//                                 type="button"
//                                 onClick={prevStep}
//                                 className="px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-all duration-300"
//                             >
//                                 Back
//                             </button>
//                             <button
//                                 type="submit"
//                                 disabled={isSubmitting}
//                                 className="px-6 py-3 bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white rounded-lg font-semibold hover:shadow-lg hover:scale-[1.02] transition-all duration-300 shadow-md disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
//                             >
//                                 {isSubmitting ? 'Processing...' : 'Next'}
//                             </button>
//                         </div>
//                     </form>
//                 </motion.div>
//             </div>
//         </div>
//     );
// };

// export default CompanyInfoStep;



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
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

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
    }, []);

    useEffect(() => {
        // Get all countries and sort them with India first, then alphabetical
        const allCountries = Country.getAllCountries();
        const sortedCountries = allCountries.sort((a, b) => {
            if (a.name === 'India') return -1;
            if (b.name === 'India') return 1;
            return a.name.localeCompare(b.name);
        });
        setCountries(sortedCountries);
    }, []);

    useEffect(() => {
        if (formData.country) {
            const selectedCountry = countries.find(c => c.name === formData.country);
            if (selectedCountry) {
                const statesOfCountry = State.getStatesOfCountry(selectedCountry.isoCode);
                // Sort states alphabetically
                const sortedStates = statesOfCountry.sort((a, b) => a.name.localeCompare(b.name));
                setStates(sortedStates);
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
                // Sort cities alphabetically
                const sortedCities = citiesOfState.sort((a, b) => a.name.localeCompare(b.name));
                setCities(sortedCities);
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

    const countryOptions = [
        { value: '', label: 'Select country' }, 
        ...formatOptions(countries, 'name', 'name')
    ];

    const stateOptions = [
        { value: '', label: formData.country ? 'Select state' : 'Select country first' }, 
        ...formatOptions(states, 'name', 'name')
    ];

    const cityOptions = [
        { value: '', label: formData.state ? 'Select city' : 'Select state first' }, 
        ...formatOptions(cities, 'name', 'name')
    ];

    const validateForm = () => {
        const newErrors = {};

        // Company Name validation
        if (!formData.companyName || formData.companyName.trim() === '') {
            newErrors.companyName = 'Company name is required';
        }

        // Company Type validation
        if (!formData.companyType) {
            newErrors.companyType = 'Company type is required';
        }

        // Industry Type validation
        if (!formData.industryType) {
            newErrors.industryType = 'Industry type is required';
        }

        // Employee Count validation
        if (!formData.numberOfEmployees) {
            newErrors.numberOfEmployees = 'Employee count is required';
        }

        // Established Year validation
        if (!formData.establishedYear) {
            newErrors.establishedYear = 'Established year is required';
        }

        // Country validation
        if (!formData.country) {
            newErrors.country = 'Country is required';
        }

        // State validation
        if (!formData.state && formData.country) {
            newErrors.state = 'State is required';
        }

        // City validation
        if (!formData.city && formData.state) {
            newErrors.city = 'City is required';
        }

        // Pincode validation
        if (!formData.pincode || formData.pincode.trim() === '') {
            newErrors.pincode = 'Pincode/Zip code is required';
        }

        // Phone Number validation
        if (!formData.phoneNumber || formData.phoneNumber.trim() === '') {
            newErrors.phoneNumber = 'Contact number is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        if (!validateForm()) {
            setIsSubmitting(false);
            return;
        }

        try {
            if (isRegisteringNewCompany && formData.companyName.trim() !== '') {
                const newCompanyName = formData.companyName.trim();
                const companyExists = existingCompanyOptions.some(option => 
                    option.value.toLowerCase() === newCompanyName.toLowerCase()
                );

                if (!companyExists) {
                    const newCompany = { value: newCompanyName, label: newCompanyName };
                    setExistingCompanyOptions(prevOptions => [...prevOptions, newCompany]);
                }
            }
            
            await nextStep();
        } catch (error) {
            console.error("Error in form submission:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

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

    const yearOptions = [
        { value: '', label: 'Select year established' }, 
        ...Array.from({ length: 74 }, (_, i) => {
            const year = new Date().getFullYear() - i;
            return { value: year.toString(), label: year.toString() };
        })
    ];

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#667eea]/10 via-[#f093fb]/5 to-[#764ba2]/10 p-4">
            {/* Fixed container to prevent layout shifts */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-[#667eea]/10 to-[#764ba2]/10 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-[#f093fb]/10 to-[#f5576c]/10 rounded-full blur-3xl"></div>
            </div>

            <div className="relative w-full max-w-3xl">
                {/* Fixed size background */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#667eea]/5 to-[#764ba2]/5 backdrop-blur-sm rounded-2xl -inset-x-4 bottom-0 min-h-[calc(100%+2rem)]"></div>

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="relative bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-100 p-8"
                >
                    {/* Decorative top bar */}
                    <div className="h-1 bg-gradient-to-r from-[#667eea] via-[#f093fb] to-[#43e97b] rounded-t-2xl absolute top-0 left-0 right-0"></div>

                    <h1 className="text-2xl font-bold mb-1 text-gray-800 text-center">Connect to Your Company!</h1>
                    <p className="text-gray-600 mb-6 text-center">Select the company you represent or register a new one.</p>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {!isRegisteringNewCompany ? (
                            <div className="min-h-[80px]">
                                <FormField
                                    label="Company Name"
                                    type="select"
                                    name="companyName"
                                    value={formData.companyName}
                                    onChange={(e) => {
                                        handleChange('companyName', e.target.value);
                                        setErrors(prev => ({ ...prev, companyName: '' }));
                                    }}
                                    options={existingCompanyOptions}
                                    required
                                    disabled={isLoadingCompanies}
                                    error={errors.companyName}
                                />
                                {isLoadingCompanies && (
                                    <p className="text-sm text-gray-500 text-center mt-1">Loading companies...</p>
                                )}
                                <p className="text-[#667eea] text-sm font-medium cursor-pointer hover:text-[#764ba2] hover:underline mt-2 text-center transition-colors"
                                    onClick={() => {
                                        setIsRegisteringNewCompany(true);
                                        handleChange('companyName', '');
                                        setErrors(prev => ({ ...prev, companyName: '' }));
                                    }}>
                                    Register New Company
                                </p>
                            </div>
                        ) : (
                            <div className="min-h-[80px]">
                                <FormField
                                    label="Company Name"
                                    type="text"
                                    name="companyName"
                                    value={formData.companyName}
                                    onChange={(e) => {
                                        handleChange('companyName', e.target.value);
                                        setErrors(prev => ({ ...prev, companyName: '' }));
                                    }}
                                    placeholder="Enter your company's full name"
                                    required
                                    error={errors.companyName}
                                />
                                <p className="text-[#667eea] text-sm font-medium cursor-pointer hover:text-[#764ba2] hover:underline mt-2 text-center transition-colors"
                                    onClick={() => {
                                        setIsRegisteringNewCompany(false);
                                        handleChange('companyName', '');
                                        setErrors(prev => ({ ...prev, companyName: '' }));
                                    }}>
                                    Select Existing Company
                                </p>
                            </div>
                        )}

                        <div className="min-h-[100px]">
                            <FormField
                                label="Description"
                                type="textarea"
                                name="description"
                                value={formData.description}
                                onChange={(e) => handleChange('description', e.target.value)}
                                placeholder="Provide a brief description of your company..."
                            />
                        </div>

                        <div className="min-h-[80px]">
                            <FormField
                                label="Company Type"
                                type="select"
                                name="companyType"
                                value={formData.companyType}
                                onChange={(e) => {
                                    handleChange('companyType', e.target.value);
                                    setErrors(prev => ({ ...prev, companyType: '' }));
                                }}
                                options={companyTypeOptions}
                                required
                                error={errors.companyType}
                            />
                        </div>

                        <div className="min-h-[80px]">
                            <FormField
                                label="Industry Type"
                                type="select"
                                name="industryType"
                                value={formData.industryType}
                                onChange={(e) => {
                                    handleChange('industryType', e.target.value);
                                    setErrors(prev => ({ ...prev, industryType: '' }));
                                }}
                                options={industryOptions}
                                required
                                error={errors.industryType}
                            />
                        </div>

                        <div className="min-h-[80px]">
                            <FormField
                                label="Number of Employees"
                                type="select"
                                name="numberOfEmployees"
                                value={formData.numberOfEmployees}
                                onChange={(e) => {
                                    handleChange('numberOfEmployees', e.target.value);
                                    setErrors(prev => ({ ...prev, numberOfEmployees: '' }));
                                }}
                                options={employeeCountOptions}
                                required
                                error={errors.numberOfEmployees}
                            />
                        </div>

                        <div className="min-h-[80px]">
                            <FormField
                                label="Established Year"
                                type="select"
                                name="establishedYear"
                                value={formData.establishedYear}
                                onChange={(e) => {
                                    handleChange('establishedYear', e.target.value);
                                    setErrors(prev => ({ ...prev, establishedYear: '' }));
                                }}
                                options={yearOptions}
                                required
                                error={errors.establishedYear}
                            />
                        </div>

                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 min-h-[80px]">
                                <FormField
                                    label="Contact Number"
                                    type="text"
                                    name="phoneNumber"
                                    value={formData.phoneNumber}
                                    onChange={(e) => {
                                        handleChange('phoneNumber', e.target.value);
                                        setErrors(prev => ({ ...prev, phoneNumber: '' }));
                                    }}
                                    placeholder="e.g., +91 98765 43210"
                                    required
                                    error={errors.phoneNumber}
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
                        </div>

                        {/* Location Fields - Fixed width select dropdowns */}
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="min-h-[80px]">
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
                                            setErrors(prev => ({ 
                                                ...prev, 
                                                country: '',
                                                state: '',
                                                city: '',
                                                pincode: ''
                                            }));
                                        }}
                                        options={countryOptions}
                                        required
                                        error={errors.country}
                                        dropdownClassName="min-w-[200px] max-w-full"
                                    />
                                </div>
                                <div className="min-h-[80px]">
                                    <FormField
                                        label="State"
                                        type="select"
                                        name="state"
                                        value={formData.state}
                                        onChange={(e) => {
                                            handleChange('state', e.target.value);
                                            handleChange('city', '');
                                            handleChange('pincode', '');
                                            setErrors(prev => ({ 
                                                ...prev, 
                                                state: '',
                                                city: '',
                                                pincode: ''
                                            }));
                                        }}
                                        options={stateOptions}
                                        required
                                        disabled={!formData.country || states.length === 0}
                                        error={errors.state}
                                        dropdownClassName="min-w-[200px] max-w-full"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="min-h-[80px]">
                                    <FormField
                                        label="City"
                                        type="select"
                                        name="city"
                                        value={formData.city}
                                        onChange={(e) => {
                                            handleChange('city', e.target.value);
                                            handleChange('pincode', '');
                                            setErrors(prev => ({ 
                                                ...prev, 
                                                city: '',
                                                pincode: ''
                                            }));
                                        }}
                                        options={cityOptions}
                                        required
                                        disabled={!formData.state || cities.length === 0}
                                        error={errors.city}
                                        dropdownClassName="min-w-[200px] max-w-full"
                                    />
                                </div>
                                <div className="min-h-[80px]">
                                    <FormField
                                        label="Pincode / Zip Code"
                                        type="text"
                                        name="pincode"
                                        value={formData.pincode}
                                        onChange={(e) => {
                                            handleChange('pincode', e.target.value);
                                            setErrors(prev => ({ ...prev, pincode: '' }));
                                        }}
                                        placeholder="Enter pincode or zip code"
                                        required
                                        disabled={!formData.city}
                                        error={errors.pincode}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="min-h-[80px]">
                            <FormField
                                label="Company Website (Optional)"
                                type="url"
                                name="websiteUrl"
                                value={formData.websiteUrl}
                                onChange={(e) => handleChange('websiteUrl', e.target.value)}
                                placeholder="e.g., https://www.yourcompany.com"
                            />
                        </div>

                        <div className="min-h-[80px]">
                            <FormField
                                label="LinkedIn URL (Optional)"
                                type="url"
                                name="companyLinkedin"
                                value={formData.companyLinkedin}
                                onChange={(e) => handleChange('companyLinkedin', e.target.value)}
                                placeholder="e.g., https://linkedin.com/company/yourcompany"
                            />
                        </div>

                        <div className="flex justify-end mt-8 pt-6 border-t border-gray-100 space-x-4">
                            <button
                                type="button"
                                onClick={prevStep}
                                className="px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-all duration-300"
                            >
                                Back
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="px-6 py-3 bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white rounded-lg font-semibold hover:shadow-lg hover:scale-[1.02] transition-all duration-300 shadow-md disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                            >
                                {isSubmitting ? 'Processing...' : 'Next'}
                            </button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </div>
    );
};

export default CompanyInfoStep;