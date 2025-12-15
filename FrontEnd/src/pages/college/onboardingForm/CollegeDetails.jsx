import { useState, useEffect, useMemo, useRef } from "react";
import { Country, State, City } from "country-state-city";
import { fetchAllCollegesName } from "../../../lib/College_AxiosIntance";
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
  const [isRegisteringNewCollege, setIsRegisteringNewCollege] = useState(false);

  const [existingColleges, setExistingColleges] = useState([]);
  const [isLoadingColleges, setIsLoadingColleges] = useState(false);
  const [collegeDropdownMessage, setCollegeDropdownMessage] = useState(
    "Select an existing college"
  );
  
  // Track if colleges have been loaded
  const [collegesLoaded, setCollegesLoaded] = useState(false);
  // Track if dropdown is focused for the first time
  const [isFirstFocus, setIsFirstFocus] = useState(true);
  // Ref for the select element
  const selectRef = useRef(null);

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

    if (!safeFormData.collegeLocation) {
      alert("College Location is required.");
      return;
    }

    nextStep();
  };

  const loadColleges = async () => {
    if (isLoadingColleges || collegesLoaded) {
      return;
    }

    setIsLoadingColleges(true);
    setCollegeDropdownMessage("Loading colleges...");

    try {
      const response = await fetchAllCollegesName();
      const collegeData = response?.data || response || [];

      if (collegeData.length > 0) {
        setExistingColleges(collegeData);
        setCollegesLoaded(true);
      } else {
        setCollegeDropdownMessage("No colleges found");
      }
    } catch (error) {
      console.error("Failed to fetch college names:", error);
      setCollegeDropdownMessage("Error loading colleges. Please try again.");
    } finally {
      setIsLoadingColleges(false);
    }
  };

  // Handle focus on the dropdown
  const handleDropdownFocus = () => {
    if (isFirstFocus) {
      loadColleges();
      setIsFirstFocus(false);
    }
  };

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
    <div className="fixed inset-0 bg-gray-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-full p-4">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
          <h1 className="text-2xl font-bold mb-6">
            College/University Details
          </h1>
          <p className="mb-6">
            Provide essential details about your institution.
          </p>
          <div className="space-y-6">
            <div>
              <label className="block font-medium mb-1">
                College/University Name *
              </label>
              {!isRegisteringNewCollege ? (
                <div>
                  <select
                    ref={selectRef}
                    name="collegeName"
                    value={safeFormData.collegeName || ""}
                    onChange={handleChange}
                    onFocus={handleDropdownFocus}
                    onClick={handleDropdownFocus}
                    disabled={isLoadingColleges}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
                  >
                    <option value="">
                      {isLoadingColleges 
                        ? "Loading colleges..." 
                        : existingColleges.length === 0
                          ? collegeDropdownMessage
                          : "Select an existing college"
                      }
                    </option>
                    {existingColleges.map((college) => (
                      <option key={college.value} value={college.value}>
                        {college.label}
                      </option>
                    ))}
                  </select>
                  <p
                    className="text-sm font-medium text-blue-600 cursor-pointer hover:underline mt-2 text-center"
                    onClick={() => {
                      setIsRegisteringNewCollege(true);
                      updateFormData("collegeName", "");
                    }}
                  >
                    <span className="text-blue-600">Register New College</span>
                  </p>
                </div>
              ) : (
                <div>
                  <input
                    type="text"
                    name="collegeName"
                    value={safeFormData.collegeName || ""}
                    onChange={handleChange}
                    placeholder="Enter new college or university name"
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
                  />
                  <p
                    className="text-sm font-medium text-blue-600 cursor-pointer hover:underline mt-2 text-center"
                    onClick={() => {
                      setIsRegisteringNewCollege(false);
                      updateFormData("collegeName", "");
                    }}
                  >
                    <span className="text-blue-600">
                      Select Existing College
                    </span>
                  </p>
                </div>
              )}
            </div>

            {/* College Location with CreatableSelect */}
            <div>
              <label className="block font-medium mb-1">
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
                    borderColor: '#d1d5db', // border-gray-300
                    minHeight: '42px',
                    borderRadius: '0.375rem', // rounded-md
                    backgroundColor: 'white',
                    padding: '2px',
                    boxShadow: 'none',
                    '&:hover': {
                      borderColor: '#9ca3af' // border-gray-400
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
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-medium mb-1">Country</label>
                <select
                  name="country"
                  value={safeFormData.country || ""}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="">Select Country</option>
                  {countries.map((country) => (
                    <option
                      key={country.isoCode}
                      value={country.name}
                      data-countrycode={country.isoCode}
                    >
                      {country.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block font-medium mb-1">State</label>
                <select
                  name="state"
                  value={safeFormData.state || ""}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  disabled={!safeFormData.countryCode}
                >
                  <option value="">Select State</option>
                  {states.map((state) => (
                    <option
                      key={state.isoCode}
                      value={state.name}
                      data-statecode={state.isoCode}
                    >
                      {state.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-medium mb-1">City</label>
                <select
                  name="city"
                  value={safeFormData.city || ""}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  disabled={!safeFormData.stateCode}
                >
                  <option value="">Select City</option>
                  {cities.map((city) => (
                    <option key={city.name} value={city.name}>
                      {city.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block font-medium mb-1">Pincode</label>
                <input
                  type="text"
                  name="pincode"
                  value={safeFormData.pincode || ""}
                  onChange={handleChange}
                  placeholder="Enter pincode"
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>
          </div>
          <div className="flex justify-between gap-10 mt-8">
            <button
              onClick={prevStep}
              className="px-6 py-2 border border-gray-300 rounded-md"
            >
              Back
            </button>
            <button
              onClick={handleNext}
              className="px-6 py-2 bg-black text-white rounded-md"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}