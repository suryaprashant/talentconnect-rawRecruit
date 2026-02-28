import { useState, useEffect, useMemo, useRef } from "react";
import { Country, State, City } from "country-state-city";
import { fetchAllCollegesName, registerNewCollege } from "../../../lib/College_AxiosIntance";
import CreatableSelect from "react-select/creatable";

export default function CollegeDetails({
  formData,
  updateFormData,
  nextStep,
  prevStep,
}) {
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [isSubmittingCollege, setIsSubmittingCollege] = useState(false);
  //const [isRegisteringNewCollege, setIsRegisteringNewCollege] = useState(false);

  const [existingColleges, setExistingColleges] = useState([]);
  const [isLoadingColleges, setIsLoadingColleges] = useState(false);
  const [collegeDropdownMessage, setCollegeDropdownMessage] = useState(
    "Select an existing college"
  );
  
  // Track if colleges have been loaded
  //const [collegesLoaded, setCollegesLoaded] = useState(false);
  // Track if dropdown is focused for the first time
  //const [isFirstFocus, setIsFirstFocus] = useState(true);
  // Ref for the select element
  //const selectRef = useRef(null);

  // Generate options for the CreatableSelect
  const locationOptions = useMemo(() => {
    return City.getCitiesOfCountry("IN")
      ?.map((city) => ({
        value: city.name,
        label: city.name,
      }))
      ?.sort((a, b) => a.label.localeCompare(b.label));
  }, []);

useEffect(() => {
    const loadInitialColleges = async () => {
      setIsLoadingColleges(true);
      try {
        const response = await fetchAllCollegesName();
        // Ensure this handles the array format correctly
        const collegeData = response?.data || response || [];
        setExistingColleges(collegeData);
      } catch (error) {
        console.error("Failed to load colleges", error);
      } finally {
        setIsLoadingColleges(false);
      }
    };
    loadInitialColleges();
    setCountries(Country.getAllCountries());
  }, []);

const handleCreateCollege = async (inputValue) => {
    setIsSubmittingCollege(true);
    try {
      const response = await registerNewCollege(inputValue);
      const newCollege = response.data; // Backend returns { label, value }
      
      setExistingColleges((prev) => [...prev, newCollege]);
      updateFormData("collegeName", newCollege.label);
    } catch (error) {
      console.error("Registration error", error);
      alert("Error registering new college. It might already exist.");
    } finally {
      setIsSubmittingCollege(false);
    }
  };

  useEffect(() => {
    setCountries(Country.getAllCountries());
  }, []);

  useEffect(() => {
    if (formData?.countryCode) {
      setStates(State.getStatesOfCountry(formData.countryCode));
      updateFormData("state", "");
      updateFormData("stateCode", "");
      updateFormData("city", "");
    } else {
      setStates([]);
    }
  }, [formData?.countryCode]);

  useEffect(() => {
    if (formData?.countryCode && formData?.stateCode) {
      setCities(
        City.getCitiesOfState(formData.countryCode, formData.stateCode)
      );
      updateFormData("city", "");
    } else {
      setCities([]);
    }
  }, [formData?.countryCode, formData?.stateCode]);

  const safeFormData = formData || {};

  const handleNext = () => {
    if (!safeFormData.collegeName) {
      alert("College/University Name is required.");
      return;
    }

    {/*if (!safeFormData.collegeLocation) {
      alert("College Location is required.");
      return;
    }*/}

    nextStep();
  };

 
  

  // Handle focus on the dropdown


  const handleChange = (e) => {
    const { name, value, type } = e.target;

    if (type !== "select-one") {
      updateFormData(name, value);
      return;
    }

    if (name === "country") {
      const selectedOption = e.target.options[e.target.selectedIndex];
      const countryCode = selectedOption.getAttribute("data-countrycode");
      updateFormData("country", value);
      updateFormData("countryCode", countryCode);
    } else if (name === "state") {
      const selectedOption = e.target.options[e.target.selectedIndex];
      const stateCode = selectedOption.getAttribute("data-statecode");
      updateFormData("state", value);
      updateFormData("stateCode", stateCode);
    } else {
      updateFormData(name, value);
    }
  };

  // Handler specifically for the React-Select component
  const handleLocationChange = (selectedOption) => {
    updateFormData("collegeLocation", selectedOption ? selectedOption.value : "");
  };

  // Prepare the value object for React-Select
  const selectedLocationValue = safeFormData.collegeLocation
    ? { label: safeFormData.collegeLocation, value: safeFormData.collegeLocation }
    : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0e6f7] via-[#d4e8f9] to-[#cff7ea]">
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        {/* Card with blur border effect */}
        <div className="relative w-full max-w-4xl">
          {/* Blur border */}
          <div className="absolute -inset-6 bg-gradient-to-br from-[#fbcfe8]/20 via-[#93c5fd]/20 to-[#a7f3d0]/20 rounded-4xl blur-2xl -z-10"></div>
          
          {/* Optional corner accent blurs */}
          <div className="absolute -top-8 -left-8 w-32 h-32 bg-[#fbcfe8]/30 rounded-full blur-3xl -z-10"></div>
          <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-[#93c5fd]/30 rounded-full blur-3xl -z-10"></div>
          <div className="absolute -top-8 -right-8 w-24 h-24 bg-[#c7d2fe]/30 rounded-full blur-3xl -z-10"></div>
          <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-[#a7f3d0]/30 rounded-full blur-3xl -z-10"></div>
          
          {/* Main Card */}
          <div className="relative bg-white/95 backdrop-blur-xl border border-white/70 rounded-3xl shadow-xl shadow-blue-50/50 p-10">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-[#3b82f6] to-[#8b5cf6] bg-clip-text text-transparent mb-6">
              College/University Details
            </h1>
            <p className="text-gray-600 text-lg mb-8">
              Provide essential details about your institution.
            </p>
            
            <div className="space-y-8">
              {/* College Name Section */}
              <div>
                <label className="block font-medium mb-3 text-gray-700 text-lg">
                  College/University Name *
                </label>
               
                 <CreatableSelect
                    isClearable
                    isDisabled={isLoadingColleges}
                    isLoading={isLoadingColleges}
                    options={existingColleges}
                    onCreateOption={handleCreateCollege} // You need to add the handleCreateCollege function I gave earlier
                    onChange={(opt) => updateFormData("collegeName", opt ? opt.label : "")}
                    value={safeFormData.collegeName ? { label: safeFormData.collegeName, value: safeFormData.collegeName } : null}
                    placeholder="Search or type to add new college..."
                    styles={{
                      control: (base) => ({
                        ...base,
                        borderColor: '#e5e7eb',
                        minHeight: '56px',
                        borderRadius: '0.75rem',
                        backgroundColor: 'rgba(255, 255, 255, 0.7)',
                        fontSize: '1.125rem',
                        '&:hover': { borderColor: '#93c5fd' }
                      }),
                    }}
                  />
              </div>

              <div>
            <label className="block font-medium mb-3 text-gray-700 text-lg">
              Affiliated University
            </label>
            <input
              type="text"
              value={formData.affiliatedUniversity || ""}
              onChange={(e) =>
                updateFormData("affiliatedUniversity", e.target.value)
              }
              placeholder="Enter affiliated university name"
              className="w-full p-4 bg-white/70 border rounded-xl"
            />
          </div>

              {/* College Location with CreatableSelect 
              <div>
                <label className="block font-medium mb-3 text-gray-700 text-lg">
                  College Location *
                </label>
                <CreatableSelect
                  isClearable
                  options={locationOptions}
                  value={selectedLocationValue}
                  onChange={handleLocationChange}
                  placeholder="Select or type to add location..."
                  styles={{
                    control: (base) => ({
                      ...base,
                      borderColor: '#e5e7eb',
                      minHeight: '56px',
                      borderRadius: '0.75rem',
                      backgroundColor: 'rgba(255, 255, 255, 0.7)',
                      backdropFilter: 'blur(8px)',
                      padding: '4px',
                      fontSize: '1.125rem',
                      boxShadow: 'none',
                      '&:hover': {
                        borderColor: '#93c5fd'
                      },
                      '&:focus-within': {
                        borderColor: '#3b82f6',
                        boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.2)'
                      }
                    }),
                    menu: (base) => ({
                      ...base,
                      borderRadius: '0.75rem',
                      border: '1px solid #e5e7eb',
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      backdropFilter: 'blur(8px)',
                      zIndex: 50,
                      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
                      fontSize: '1.125rem'
                    }),
                    option: (base, state) => ({
                      ...base,
                      backgroundColor: state.isSelected ? '#e0f2fe' : state.isFocused ? '#f0f9ff' : 'transparent',
                      color: '#374151',
                      fontSize: '1.125rem',
                      cursor: 'pointer',
                      '&:active': {
                        backgroundColor: '#e0f2fe'
                      }
                    }),
                    placeholder: (base) => ({
                      ...base,
                      color: '#9ca3af',
                      fontSize: '1.125rem'
                    }),
                    singleValue: (base) => ({
                      ...base,
                      fontSize: '1.125rem'
                    })
                  }}
                />
              </div>*/}

              {/* Location Grid */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block font-medium mb-3 text-gray-700 text-lg">Country</label>
                  <select
                    name="country"
                    value={safeFormData.country || ""}
                    onChange={handleChange}
                    className="w-full p-4 bg-white/70 backdrop-blur-sm border border-gray-200/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#93c5fd] focus:border-transparent transition-all duration-200 text-lg"
                  >
                    <option value="" className="text-gray-400 text-lg">Select Country</option>
                    {countries.map((country) => (
                      <option
                        key={country.isoCode}
                        value={country.name}
                        data-countrycode={country.isoCode}
                        className="text-lg"
                      >
                        {country.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-medium mb-3 text-gray-700 text-lg">State</label>
                  <select
                    name="state"
                    value={safeFormData.state || ""}
                    onChange={handleChange}
                    className="w-full p-4 bg-white/70 backdrop-blur-sm border border-gray-200/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#93c5fd] focus:border-transparent transition-all duration-200 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={!safeFormData.countryCode}
                  >
                    <option value="" className="text-gray-400 text-lg">Select State</option>
                    {states.map((state) => (
                      <option
                        key={state.isoCode}
                        value={state.name}
                        data-statecode={state.isoCode}
                        className="text-lg"
                      >
                        {state.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block font-medium mb-3 text-gray-700 text-lg">City</label>
                  <select
                    name="city"
                    value={safeFormData.city || ""}
                    onChange={handleChange}
                    className="w-full p-4 bg-white/70 backdrop-blur-sm border border-gray-200/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#93c5fd] focus:border-transparent transition-all duration-200 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={!safeFormData.stateCode}
                  >
                    <option value="" className="text-gray-400 text-lg">Select City</option>
                    {cities.map((city) => (
                      <option key={city.name} value={city.name} className="text-lg">
                        {city.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-medium mb-3 text-gray-700 text-lg">Pincode</label>
                  <input
                    type="text"
                    name="pincode"
                    value={safeFormData.pincode || ""}
                    onChange={handleChange}
                    placeholder="Enter pincode"
                    className="w-full p-4 bg-white/70 backdrop-blur-sm border border-gray-200/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#93c5fd] focus:border-transparent transition-all duration-200 text-lg"
                  />
                </div>
              </div>
            </div>
            
            {/* Navigation Buttons */}
            <div className="flex flex-col sm:flex-row justify-between gap-6 mt-12">
              <button
                onClick={prevStep}
                className="px-10 py-4 bg-white/70 backdrop-blur-sm border border-gray-200/80 rounded-xl hover:bg-white/90 hover:shadow-md transition-all duration-200 text-gray-700 font-medium text-lg"
              >
                Back
              </button>
              <button
                onClick={handleNext}
                className="px-10 py-4 bg-gradient-to-r from-[#93c5fd] to-[#3b82f6] text-white rounded-xl hover:shadow-lg hover:shadow-[#93c5fd]/40 transition-all duration-200 font-medium text-lg"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}