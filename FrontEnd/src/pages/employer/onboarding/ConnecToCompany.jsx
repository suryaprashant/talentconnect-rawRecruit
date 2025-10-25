// import React, { useState, useEffect } from "react";
// import { Country, State, City } from 'country-state-city';
// import { ChevronDownIcon } from "lucide-react";

// // Helper component for the dropdown/select box with an icon
// const CustomSelect = ({ label, name, value, onChange, options, error, required = false }) => (
//     <div>
//         <label className="block text-sm font-medium text-gray-700 mb-1">
//             {label} {required && <span className="text-red-500">*</span>}
//         </label>
//         <div className="relative">
//             <select
//                 name={name}
//                 value={value || ''}
//                 onChange={onChange}
//                 // Use ISO code for Country/State to filter down, or name for City
//                 className={`appearance-none w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-black ${
//                     error ? 'border-red-500' : 'border-gray-300'
//                 }`}
//             >
//                 <option value="" disabled>Select {label}</option>
//                 {options.map((option) => (
//                     // Using isoCode for Country/State, name for City
//                     <option key={option.isoCode || option.name} value={option.isoCode || option.name}>
//                         {option.name}
//                     </option>
//                 ))}
//             </select>
//             <ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
//         </div>
//         {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
//     </div>
// );


// const ConnectToCompany = ({ onNext, onBack, formData, updateFormData }) => {
//     const [errors, setErrors] = useState({});
    
//     // Internal state for dynamically loaded geo data
//     const [allCountries, setAllCountries] = useState([]);
//     const [availableStates, setAvailableStates] = useState([]);
//     const [availableCities, setAvailableCities] = useState([]);

//     // --- Load Countries on initial mount ---
//     useEffect(() => {
//         setAllCountries(Country.getAllCountries());
//     }, []);

//     // --- Update States when Country changes ---
//     useEffect(() => {
//         if (formData.countryIso) {
//             const states = State.getStatesOfCountry(formData.countryIso);
//             setAvailableStates(states);
            
//             // If the current state ISO is no longer valid for the new country, reset it
//             if (formData.stateIso && !states.find(s => s.isoCode === formData.stateIso)) {
//                  updateFormData({ state: '', stateIso: '', city: '' });
//             }
//         } else {
//             setAvailableStates([]);
//         }
//     }, [formData.countryIso]);

//     // --- Update Cities when State changes ---
//     useEffect(() => {
//         if (formData.countryIso && formData.stateIso) {
//             const cities = City.getCitiesOfState(formData.countryIso, formData.stateIso);
//             setAvailableCities(cities);
            
//             // If the current city is no longer valid for the new state, reset it
//             if (formData.city && !cities.find(c => c.name === formData.city)) {
//                  updateFormData({ city: '' });
//             }
//         } else {
//             setAvailableCities([]);
//         }
//     }, [formData.stateIso, formData.countryIso]);


//     // --- Handlers ---
    
//     const handleCountryChange = (e) => {
//         const countryIso = e.target.value;
//         const countryObj = allCountries.find(c => c.isoCode === countryIso);
        
//         updateFormData({ 
//             country: countryObj ? countryObj.name : '', 
//             countryIso: countryIso,
//             state: '', stateIso: '', 
//             city: '' 
//         });
//     };

//     const handleStateChange = (e) => {
//         const stateIso = e.target.value;
//         const stateObj = availableStates.find(s => s.isoCode === stateIso);

//         updateFormData({ 
//             state: stateObj ? stateObj.name : '', 
//             stateIso: stateIso, 
//             city: '' 
//         });
//     };
    
//     const handleCityChange = (e) => {
//         // City selection uses the city name as the value
//         updateFormData({ city: e.target.value });
//     };

//     const handlePincodeChange = (e) => {
//         // Pincode is now a manual input field
//         updateFormData({ pincode: e.target.value });
//     };

//     const handleCompanyNameChange = (e) => {
//         updateFormData({ companyName: e.target.value });
//     };

//     // --- Validation and Navigation ---

//     const validateForm = () => {
//         const newErrors = {};
//         if (!formData.companyName) newErrors.companyName = 'Company name is required';
//         if (!formData.country) newErrors.country = 'Country is required';
//         // Require state only if states are available for the selected country
//         if (availableStates.length > 0 && !formData.state) newErrors.state = 'State is required'; 
//         // City is the final required location field
//         if (!formData.city) newErrors.city = 'City (Company Location) is required';

//         setErrors(newErrors);
//         return Object.keys(newErrors).length === 0;
//     };

//     const handleNext = () => {
//         if (validateForm()) {
//             onNext();
//         }
//     };
    
//     // --- Mock Data for Company Name Selector ---
//     const companyNameOptions = [
//         { name: "Tech Corp" },
//         { name: "StartUp Inc" },
//         { name: "Enterprise Ltd" },
//     ];


//     return (
//         <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md mx-auto">
            
//             {/* Simple Progress Indicator */}
//             <div className="flex items-center justify-between mb-8">
//                 <div className="flex items-center space-x-4">
//                     <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-sm font-medium">
//                         ✓
//                     </div>
//                     <div className="w-16 h-px bg-gray-300"></div>
//                     <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-sm font-medium">
//                         2
//                     </div>
//                     <div className="w-16 h-px bg-gray-300"></div>
//                     <div className="w-8 h-8 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-sm">
//                         3
//                     </div>
//                 </div>
//             </div>

//             <h2 className="text-2xl font-bold text-gray-900 mb-2">
//                 Connect to Your Company!
//             </h2>
//             <p className="text-gray-600 mb-6">
//                 Select the company you represent or register a new one.
//             </p>

//             <div className="space-y-4">
//                 {/* 1. Company Name */}
//                 <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                         Company Name <span className="text-red-500">*</span>
//                     </label>
//                     <div className="relative">
//                         <select
//                             value={formData.companyName || ''}
//                             onChange={handleCompanyNameChange}
//                             className={`appearance-none w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-black ${
//                                 errors.companyName ? 'border-red-500' : 'border-gray-300'
//                             }`}
//                         >
//                             <option value="" disabled>Select or search your company</option>
//                             {companyNameOptions.map((option) => (
//                                 <option key={option.name} value={option.name}>
//                                     {option.name}
//                                 </option>
//                             ))}
//                         </select>
//                         <ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
//                     </div>
//                     {errors.companyName && <p className="mt-1 text-sm text-red-600">{errors.companyName}</p>}
//                     <button
//                         type="button"
//                         className="text-blue-600 text-sm mt-1 hover:underline"
//                     >
//                         Register Your Company
//                     </button>
//                 </div>

//                 {/* --- NEW ROW 1: Country and State --- */}
//                 <div className="grid grid-cols-2 gap-4">
//                     {/* Country (Dynamic) */}
//                     <CustomSelect 
//                         label="Country"
//                         name="country"
//                         value={formData.countryIso} // Use ISO for selection
//                         onChange={handleCountryChange}
//                         options={allCountries}
//                         error={errors.country}
//                         required={true}
//                     />

//                     {/* State (Dynamic) */}
//                     <CustomSelect 
//                         label="State"
//                         name="state"
//                         value={formData.stateIso} // Use ISO for selection
//                         onChange={handleStateChange}
//                         options={availableStates}
//                         error={errors.state}
//                     />
//                 </div>

//                 {/* --- NEW ROW 2: City and Pincode --- */}
//                 <div className="grid grid-cols-2 gap-4">
//                     {/* City (Dynamic - Acts as Company Location) */}
//                     <CustomSelect 
//                         label="City (Company Location)"
//                         name="city"
//                         value={formData.city} // Use Name for selection
//                         onChange={handleCityChange}
//                         options={availableCities}
//                         error={errors.city}
//                         required={true}
//                     />
                    
//                     {/* Pincode (Manual Input) */}
//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                             Pincode
//                         </label>
//                         <input
//                             type="text"
//                             name="pincode"
//                             value={formData.pincode || ''}
//                             onChange={handlePincodeChange}
//                             placeholder="Enter Pincode"
//                             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
//                         />
//                     </div>
//                 </div>
//             </div>

//             <div className="flex justify-between mt-8">
//                 <button
//                     onClick={onBack}
//                     className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
//                 >
//                     Back
//                 </button>
//                 <button
//                     onClick={handleNext}
//                     className="px-6 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
//                 >
//                     Next
//                 </button>
//             </div>
//         </div>
//     );
// };
// export default ConnectToCompany;


import React, { useState, useEffect } from "react";
import { Country, State, City } from 'country-state-city';
import { ChevronDownIcon } from "lucide-react";

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
                // Use ISO code for Country/State to filter down, or name for City
                className={`appearance-none w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-black ${
                    error ? 'border-red-500' : 'border-gray-300'
                }`}
            >
                <option value="" disabled>Select {label}</option>
                {options.map((option) => (
                    // Using isoCode for Country/State, name for City
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

    // --- NEW: State to toggle company input type ---
    const [isRegisteringNewCompany, setIsRegisteringNewCompany] = useState(false);

    // --- Load Countries on initial mount ---
    useEffect(() => {
        setAllCountries(Country.getAllCountries());
    }, []);

    // --- Update States when Country changes ---
    useEffect(() => {
        if (formData.countryIso) {
            const states = State.getStatesOfCountry(formData.countryIso);
            setAvailableStates(states);
            
            // If the current state ISO is no longer valid for the new country, reset it
            if (formData.stateIso && !states.find(s => s.isoCode === formData.stateIso)) {
                 updateFormData({ state: '', stateIso: '', city: '' });
            }
        } else {
            setAvailableStates([]);
            // When country is cleared, also clear state and city
            updateFormData({ state: '', stateIso: '', city: '' });
        }
    // Note: This dependency array is based on your original code.
    // For more complex state, consider a functional update or adding 'formData.stateIso' and 'updateFormData' to deps.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [formData.countryIso]);

    // --- Update Cities when State changes ---
    useEffect(() => {
        if (formData.countryIso && formData.stateIso) {
            const cities = City.getCitiesOfState(formData.countryIso, formData.stateIso);
            setAvailableCities(cities);
            
            // If the current city is no longer valid for the new state, reset it
            if (formData.city && !cities.find(c => c.name === formData.city)) {
                 updateFormData({ city: '' });
            }
        } else {
            setAvailableCities([]);
             // When state is cleared, also clear city
            updateFormData({ city: '' });
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [formData.stateIso, formData.countryIso]);


    // --- Handlers ---
    
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
        // City selection uses the city name as the value
        updateFormData({ city: e.target.value });
    };

    const handlePincodeChange = (e) => {
        // Pincode is now a manual input field
        updateFormData({ pincode: e.target.value });
    };

    const handleCompanyNameChange = (e) => {
        // This handler now works for both the <select> and <input>
        updateFormData({ companyName: e.target.value });
    };

    // --- NEW: Handler to toggle company input ---
    const toggleCompanyRegistration = () => {
        const isRegistering = !isRegisteringNewCompany;
        setIsRegisteringNewCompany(isRegistering);
        
        // Clear company name and any related error when toggling
        updateFormData({ companyName: '' });
        if (errors.companyName) {
            setErrors(prev => ({ ...prev, companyName: null }));
        }
    };

    // --- Validation and Navigation ---

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
    
    // --- Mock Data for Company Name Selector ---
    const companyNameOptions = [
        { name: "Tech Corp" },
        { name: "StartUp Inc" },
        { name: "Enterprise Ltd" },
    ];


    return (
        <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md mx-auto">
            
            {/* Simple Progress Indicator */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-4">
                    <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-sm font-medium">
                        ✓
                    </div>
                    <div className="w-16 h-px bg-gray-300"></div>
                    <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-sm font-medium">
                        2
                    </div>
                    <div className="w-16 h-px bg-gray-300"></div>
                    <div className="w-8 h-8 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-sm">
                        3
                    </div>
                </div>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Connect to Your Company!
            </h2>
            <p className="text-gray-600 mb-6">
                Select the company you represent or register a new one.
            </p>

            <div className="space-y-4">
                {/* 1. Company Name (MODIFIED) */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Company Name <span className="text-red-500">*</span>
                    </label>

                    {isRegisteringNewCompany ? (
                        // --- Show Text Input when registering ---
                        <input
                            type="text"
                            name="companyName"
                            value={formData.companyName || ''}
                            onChange={handleCompanyNameChange}
                            placeholder="Enter your new company name"
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-black ${
                                errors.companyName ? 'border-red-500' : 'border-gray-300'
                            }`}
                        />
                    ) : (
                        // --- Show Dropdown by default ---
                        <div className="relative">
                            <select
                                name="companyName"
                                value={formData.companyName || ''}
                                onChange={handleCompanyNameChange}
                                className={`appearance-none w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-black ${
                                    errors.companyName ? 'border-red-500' : 'border-gray-300'
                                }`}
                            >
                                <option value="" disabled>Select or search your company</option>
                                {companyNameOptions.map((option) => (
                                    <option key={option.name} value={option.name}>
                                        {option.name}
                                    </option>
                                ))}
                            </select>
                            <ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                        </div>
                    )}

                    {errors.companyName && <p className="mt-1 text-sm text-red-600">{errors.companyName}</p>}
                    
                    {/* --- NEW: Toggle Button --- */}
                    <button
                        type="button"
                        onClick={toggleCompanyRegistration}
                        className="text-blue-600 text-sm mt-1 hover:underline"
                    >
                        {isRegisteringNewCompany ? 'Select Existing Company' : 'Register Your Company'}
                    </button>
                </div>

                {/* --- NEW ROW 1: Country and State --- */}
                <div className="grid grid-cols-2 gap-4">
                    {/* Country (Dynamic) */}
                    <CustomSelect 
                        label="Country"
                        name="country"
                        value={formData.countryIso} // Use ISO for selection
                        onChange={handleCountryChange}
                        options={allCountries}
                        error={errors.country}
                        required={true}
                    />

                    {/* State (Dynamic) */}
                    <CustomSelect 
                        label="State"
                        name="state"
                        value={formData.stateIso} // Use ISO for selection
                        onChange={handleStateChange}
                        options={availableStates}
                        error={errors.state}
                        // Only required if states exist for the country
                        required={availableStates.length > 0} 
                    />
                </div>

                {/* --- NEW ROW 2: City and Pincode --- */}
                <div className="grid grid-cols-2 gap-4">
                    {/* City (Dynamic - Acts as Company Location) */}
                    <CustomSelect 
                        label="City (Company Location)"
                        name="city"
                        value={formData.city} // Use Name for selection
                        onChange={handleCityChange}
                        options={availableCities}
                        error={errors.city}
                        required={true}
                    />
                    
                    {/* Pincode (Manual Input) */}
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
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                        />
                    </div>
                </div>
            </div>

            <div className="flex justify-between mt-8">
                <button
                    onClick={onBack}
                    className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                >
                    Back
                </button>
                <button
                    onClick={handleNext}
                    className="px-6 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
                >
                    Next
                </button>
            </div>
        </div>
    );
};
export default ConnectToCompany;
