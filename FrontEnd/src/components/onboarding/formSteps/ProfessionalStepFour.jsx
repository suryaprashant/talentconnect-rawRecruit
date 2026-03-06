import React, { useState, useEffect, useRef } from "react";
import { ProgressIndicator } from "../ProgressIndicator";
import { ChevronDownIcon, UploadIcon, X } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { City } from 'country-state-city';
import CreatableSelect from 'react-select/creatable';
import {
  fetchAllCompaniesName,
  getCompanyMasterDataByType,
  createCompanyMasterData
} from "@/lib/Company_AxiosInstance";

const employmentTypeOptions = ["part time", "full time", "contract"];


const SelectedTag = ({ item, onRemove }) => (
    <div className="flex items-center bg-gray-200 text-sm h-8 px-3 py-1 rounded-full text-black">
        <span>{item}</span>
        <button 
            type="button" 
            onClick={onRemove} 
            className="ml-2 text-gray-600 hover:text-black focus:outline-none"
            aria-label={`Remove ${item}`}
        >
            <X size={14} />
        </button>
    </div>
);


const CustomDateInput = React.forwardRef(({ value, onClick, placeholder, disabled }, ref) => (
  <div className="relative flex items-center">
    <input
      type="text"
      className={`flex min-h-12 w-full p-3 border border-gray-300 rounded text-[#666] ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'cursor-pointer'}`}
      value={value}
      onClick={onClick}
      onChange={() => {}}
      placeholder={placeholder}
      readOnly
      ref={ref}
      disabled={disabled}
    />
    <ChevronDownIcon className="absolute right-3 w-5 h-5 text-gray-500" />
  </div>
));


export const ProfessionalStepFour = ({ onNext, onBack, formData, onChange }) => {
   
    const [indianCities, setIndianCities] = useState([]);
    const [locationSearch, setLocationSearch] = useState('');

    // ─── Dynamic API state ─────────────────────────────────────────────────────
    const [industryOptions,   setIndustryOptions]   = useState([]);
    const [jobRoleOptions,    setJobRoleOptions]    = useState([]);
    const [companyOptions,    setCompanyOptions]    = useState([]);
    const [isLoadingMaster,   setIsLoadingMaster]   = useState(false);
    const [isLoadingCompanies, setIsLoadingCompanies] = useState(false);

    const [dropdownOpen, setDropdownOpen] = useState({
        locations: false,
    });

    const locationsRef = useRef(null);

    const dropdownRefs = { locations: locationsRef };

  
    useEffect(() => {
        const citiesOfIndia = City.getCitiesOfCountry('IN')
            .map(city => city.name)
            .sort((a, b) => a.localeCompare(b));
        setIndianCities(citiesOfIndia);
    }, []);

    // ─── Fetch industry + job roles on mount ───────────────────────────────────
    useEffect(() => {
        const fetchMasterData = async () => {
            setIsLoadingMaster(true);
            try {
                const [industryRes, jobRoleRes] = await Promise.all([
                    getCompanyMasterDataByType("INDUSTRY_TYPE"),
                    getCompanyMasterDataByType("JOB_ROLE"),
                ]);
                setIndustryOptions(
                    industryRes.data.data.map(item => ({ value: item.value, label: item.value }))
                );
                setJobRoleOptions(
                    jobRoleRes.data.data.map(item => ({ value: item.value, label: item.value }))
                );
            } catch (err) {
                console.error("Error fetching master data", err);
            } finally {
                setIsLoadingMaster(false);
            }
        };
        fetchMasterData();
    }, []);

    // ─── Fetch company names on mount ──────────────────────────────────────────
    useEffect(() => {
        const loadCompanies = async () => {
            setIsLoadingCompanies(true);
            try {
                const response = await fetchAllCompaniesName();
                const companyData = Array.isArray(response?.data)
                    ? response.data
                    : Array.isArray(response) ? response : [];
                setCompanyOptions(companyData);
            } catch (err) {
                console.error("Failed to fetch company names", err);
            } finally {
                setIsLoadingCompanies(false);
            }
        };
        loadCompanies();
    }, []);

    
    useEffect(() => {
        const handleClickOutside = (event) => {
            for (const field in dropdownRefs) {
                if (dropdownOpen[field] && dropdownRefs[field].current && !dropdownRefs[field].current.contains(event.target)) {
                    setDropdownOpen(prev => ({ ...prev, [field]: false }));
                    if (field === 'locations') setLocationSearch('');
                }
            }
        };
        document.addEventListener("mousedown", handleClickOutside); 
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [dropdownOpen]);


   
    
    const handleFieldChange = (name, value) => {
        onChange({ ...formData, [name]: value });
    };

    const toggleDropdown = (field) => {
        setDropdownOpen((prev) => {
            const newState = Object.keys(prev).reduce((acc, key) => ({ ...acc, [key]: false }), {});
            return {
                ...newState,
                [field]: !prev[field] 
            };
        });
    };

    const handleMultiSelect = (field, value) => {
        const currentValues = Array.isArray(formData[field]) ? formData[field] : [];
        const newValues = currentValues.includes(value)
            ? currentValues.filter((v) => v !== value)
            : [...currentValues, value];
        onChange({ ...formData, [field]: newValues });
    };

    const removeSelectedItem = (field, value) => {
        const currentValues = Array.isArray(formData[field]) ? formData[field] : [];
        const newValues = currentValues.filter(item => item !== value);
        onChange({ ...formData, [field]: newValues });
    };

    // Handler now correctly modifies `formData.experiences` array.
    const handleExperienceChange = (index, field, value) => {
        const updatedExperiences = [...(formData.experiences || [])];
        updatedExperiences[index] = { ...updatedExperiences[index], [field]: value };
        onChange({ ...formData, experiences: updatedExperiences });
    };
    
    // Use Date objects for DatePicker
    const handleDateChange = (index, field, date) => {
        handleExperienceChange(index, field, date);
    };

    // File change handler
    const handleFileChange = (index, e) => {
        if (e.target.files && e.target.files[0]) {
            handleExperienceChange(index, "experienceCertificate", e.target.files[0]);
        }
    };

    const handleAddExperience = () => {
        const newExperiences = [
          ...(formData.experiences || []),
          { 
              company: "", 
              role: "", 
              startDate: null, 
              endDate: null, 
              description: "", 
              experienceCertificate: null,
              isCurrent: false, // Add isCurrent flag
          },
        ];
        onChange({ ...formData, experiences: newExperiences });
    };

    const handleRemoveExperience = (index) => {
        if (formData.experiences && formData.experiences.length > 0) {
            const updatedExperiences = formData.experiences.filter((_, i) => i !== index);
            onChange({ ...formData, experiences: updatedExperiences });
        }
    };
    
    const currentEmploymentType = Array.isArray(formData.employmentType) ? formData.employmentType : [];
    
    const filteredCities = indianCities.filter(city =>
        city.toLowerCase().includes(locationSearch.toLowerCase())
    );

    // Handle location search input change
    const handleLocationSearchChange = (e) => {
        setLocationSearch(e.target.value);
    };

    // Custom reusable MultiSelect Dropdown component
    const MultiSelectDropdown = ({ field, options, label, ref, showSearch = false }) => {
        const selectedValues = formData[field] || [];
        const placeholder = `Select ${label.toLowerCase()}`;
        
        const displayOptions = (field === 'locations' && showSearch) ? filteredCities : options;

        return (
            <div ref={ref} className="w-full mt-6 max-md:max-w-full relative">
                <label className="block text-black mb-2">{label}</label>
                
                {/* Custom Multi-Select Input Box (The new design) */}
                <div 
                    className="relative flex items-center min-h-12 w-full p-3 border border-gray-300 rounded cursor-pointer hover:border-gray-400"
                    onClick={(e) => {e.stopPropagation(); toggleDropdown(field);}}
                >
                    <div className="flex flex-wrap gap-2 flex-1 min-h-[1.5rem]">
                        {selectedValues.length === 0 ? (
                            <span className="text-[#666] self-center">{placeholder}</span>
                        ) : (
                            selectedValues.map(item => (
                                <SelectedTag 
                                    key={item} 
                                    item={item} 
                                    onRemove={() => removeSelectedItem(field, item)} 
                                />
                            ))
                        )}
                    </div>
                    <ChevronDownIcon className={`w-6 h-6 transition-transform absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 ${dropdownOpen[field] ? "rotate-180" : ""}`} />
                </div>

                {dropdownOpen[field] && (
                    <div 
                        className="absolute z-20 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg"
                        onMouseDown={(e) => e.stopPropagation()} 
                    >
                        {showSearch && (
                            <div className="p-2 border-b">
                                <input
                                    type="text"
                                    value={locationSearch}
                                    onChange={handleLocationSearchChange}
                                    onClick={(e) => e.stopPropagation()} 
                                    onMouseDown={(e) => e.stopPropagation()} 
                                    onKeyDown={(e) => e.stopPropagation()}
                                    placeholder="Search locations..."
                                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-black"
                                    autoFocus
                                />
                            </div>
                        )}
                        <ul className="max-h-60 overflow-y-auto">
                            {displayOptions.length > 0 ? (
                                displayOptions.map((option) => (
                                    <li
                                        key={option}
                                        onClick={(e) => { e.stopPropagation(); handleMultiSelect(field, option); }}
                                        className={`p-3 flex justify-between items-center hover:bg-gray-100 cursor-pointer text-black ${
                                            selectedValues.includes(option) ? "bg-gray-100 font-medium" : ""
                                        }`}
                                    >
                                        <span>{option}</span>
                                        {selectedValues.includes(option) && <span className="text-blue-600">✓</span>}
                                    </li>
                                ))
                            ) : (
                                <li className="p-3 text-gray-500">
                                    {showSearch ? "No locations found." : "No options available."}
                                </li>
                            )}
                        </ul>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="justify-center items-stretch bg-white z-0 flex min-w-60 flex-col w-[560px] my-auto p-12 max-md:max-w-full max-md:px-5">
            <ProgressIndicator currentStep={4} totalSteps={6} />

            <div className="flex w-full flex-col items-stretch justify-center mt-8 max-md:max-w-full">
                <div className="w-full text-black max-md:max-w-full">
                    <h2 className="text-[32px] font-bold leading-[42px] max-md:max-w-full">
                        Awesome! Let's define your career goals and experience!
                    </h2>
                    <p className="text-base font-normal leading-6 mt-2 max-md:max-w-full">
                        Let us know your job interests, experience, and preferred locations
                        so we can recommend the best opportunities for you.
                    </p>
                </div>

                <form className="w-full text-base font-normal mt-8 max-md:max-w-full">
                    
                    {/* Interested Industry Type */}
                    <div className="w-full mt-6 max-md:max-w-full">
                        <label className="block text-black mb-2">Interested Industry Type</label>
                        <CreatableSelect
                            isMulti
                            isLoading={isLoadingMaster}
                            options={industryOptions}
                            value={(formData.industry || []).map(v => ({ value: v, label: v }))}
                            placeholder="Select or add industry type(s)..."
                            onChange={(selected) => {
                                onChange({ ...formData, industry: (selected || []).map(s => s.value) });
                            }}
                            onCreateOption={async (inputValue) => {
                                try {
                                    const res = await createCompanyMasterData({ type: "INDUSTRY_TYPE", value: inputValue });
                                    const savedValue = res.data.data.value;
                                    const newOpt = { value: savedValue, label: savedValue };
                                    setIndustryOptions(prev => [...prev, newOpt]);
                                    onChange({ ...formData, industry: [...(formData.industry || []), savedValue] });
                                } catch (err) {
                                    console.error("Error creating industry", err);
                                }
                            }}
                        />
                    </div>

                    {/* Interested Job Roles */}
                    <div className="w-full mt-6 max-md:max-w-full">
                        <label className="block text-black mb-2">Interested Job Roles</label>
                        <CreatableSelect
                            isMulti
                            isLoading={isLoadingMaster}
                            options={jobRoleOptions}
                            value={(formData.jobRoles || []).map(v => ({ value: v, label: v }))}
                            placeholder="Select or add job role(s)..."
                            onChange={(selected) => {
                                onChange({ ...formData, jobRoles: (selected || []).map(s => s.value) });
                            }}
                            onCreateOption={async (inputValue) => {
                                try {
                                    const res = await createCompanyMasterData({ type: "JOB_ROLE", value: inputValue });
                                    const savedValue = res.data.data.value;
                                    const newOpt = { value: savedValue, label: savedValue };
                                    setJobRoleOptions(prev => [...prev, newOpt]);
                                    onChange({ ...formData, jobRoles: [...(formData.jobRoles || []), savedValue] });
                                } catch (err) {
                                    console.error("Error creating job role", err);
                                }
                            }}
                        />
                    </div>

                    {/* Preferred Job Locations (Multi-Select Dropdown with Search) */}
                    <MultiSelectDropdown 
                        field="locations" 
                        options={indianCities} 
                        label="Preferred Job Locations" 
                        ref={locationsRef}
                        showSearch={true}
                    />
                    
                    {/* Employment type (Multi-Select Toggles) - ADDED/REPLACED */}
                    <div className="w-full mt-6 max-md:max-w-full">
                        <label className="block text-black">Employment Type</label>
                        <div className="flex w-full gap-4 text-black whitespace-nowrap flex-wrap mt-2">
                            {employmentTypeOptions.map((option) => (
                                <button
                                    key={option}
                                    type="button"
                                    className={`self-stretch gap-2 px-4 py-2 border rounded-md capitalize ${currentEmploymentType.includes(option) ? "bg-black text-white" : ""}`}
                                    onClick={() => handleMultiSelect("employmentType", option)}
                                >
                                    {option}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Current Salary */}
                    <div className="w-full mt-6 max-md:max-w-full">
                        <label className="block text-black">Current Salary (Annual)</label>
                        <div className="flex items-center gap-2 mt-2">
                            <div className="relative w-24">
                                <select name="currentSalaryCurrency" value={formData.currentSalaryCurrency || "INR"} onChange={(e) => handleFieldChange(e.target.name, e.target.value)} className="items-center appearance-none flex min-h-12 w-full p-3 border border-gray-300 rounded">
                                    <option value="INR">INR</option><option value="USD">USD</option><option value="EUR">EUR</option>
                                </select>
                                <ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 pointer-events-none" />
                            </div>
                            <div className="flex-1">
                                <input name="currentSalaryAmount" type="text" value={formData.currentSalaryAmount || ""} onChange={(e) => handleFieldChange(e.target.name, e.target.value)} placeholder="Enter amount" className="w-full min-h-12 p-3 border border-gray-300 rounded"/>
                            </div>
                        </div>
                    </div>

                    {/* Expected Salary */}
                    <div className="w-full mt-6 max-md:max-w-full">
                        <label className="block text-black">Expected Salary (Annual)</label>
                        <div className="flex items-center gap-2 mt-2">
                            <div className="relative w-24">
                                <select name="expectedSalaryCurrency" value={formData.expectedSalaryCurrency || "INR"} onChange={(e) => handleFieldChange(e.target.name, e.target.value)} className="items-center appearance-none flex min-h-12 w-full p-3 border border-gray-300 rounded">
                                    <option value="INR">INR</option><option value="USD">USD</option><option value="EUR">EUR</option>
                                </select>
                                <ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 pointer-events-none" />
                            </div>
                            <div className="flex-1">
                                <input name="expectedSalaryAmount" type="text" value={formData.expectedSalaryAmount || ""} onChange={(e) => handleFieldChange(e.target.name, e.target.value)} placeholder="Enter amount" className="w-full min-h-12 p-3 border border-gray-300 rounded"/>
                            </div>
                        </div>
                    </div>

                    {/* Work Experience Section */}
                    <div className="w-full mt-8 max-md:max-w-full">
                        <h3 className="text-lg font-semibold text-black">Work Experience</h3>
                        {(formData.experiences || []).map((experience, index) => {
                            const isCurrent = experience.isCurrent;
                            return (
                                <div key={index} className="mt-6 p-4 border border-gray-200 rounded-md">
                                    <div className="flex justify-between items-center mb-4">
                                        <h4 className="font-medium">Experience {index + 1}</h4>
                                        {(formData.experiences || []).length > 0 && (
                                            <button type="button" onClick={() => handleRemoveExperience(index)} className="text-red-500 text-sm">Remove</button>
                                        )}
                                    </div>
                                    
                                    <div className="mb-4">
                                        <label className="block text-black mb-1">Company</label>
                                        <CreatableSelect
                                            isLoading={isLoadingCompanies}
                                            isClearable
                                            options={companyOptions}
                                            value={experience.company ? { value: experience.company, label: experience.company } : null}
                                            placeholder="Select or type company name..."
                                            onChange={(selected) => {
                                                handleExperienceChange(index, "company", selected ? selected.value : "");
                                            }}
                                            onCreateOption={(inputValue) => {
                                                // No API call needed — just store the typed name directly
                                                const newOpt = { value: inputValue, label: inputValue };
                                                setCompanyOptions(prev => [...prev, newOpt]);
                                                handleExperienceChange(index, "company", inputValue);
                                            }}
                                            styles={{
                                                control: (base, state) => ({
                                                    ...base,
                                                    minHeight: '48px',
                                                    borderRadius: '4px',
                                                    borderColor: state.isFocused ? '#000' : '#d1d5db',
                                                    boxShadow: state.isFocused ? '0 0 0 1px #000' : 'none',
                                                    '&:hover': { borderColor: '#000' },
                                                }),
                                                placeholder: (base) => ({ ...base, color: '#9ca3af' }),
                                            }}
                                        />
                                    </div>

                                    <div className="mb-4">
                                        <label className="block text-black mb-1">Job Role</label>
                                        <CreatableSelect
                                            options={jobRoleOptions}
                                            value={experience.role ? { value: experience.role, label: experience.role } : null}
                                            placeholder="e.g., Software Engineer"
                                            isClearable
                                            onChange={(selected) => {
                                                handleExperienceChange(index, "role", selected ? selected.value : "");
                                            }}
                                            onCreateOption={async (inputValue) => {
                                                try {
                                                    const res = await createCompanyMasterData({ type: "JOB_ROLE", value: inputValue });
                                                    const savedValue = res.data.data.value;
                                                    setJobRoleOptions(prev => [...prev, { value: savedValue, label: savedValue }]);
                                                    handleExperienceChange(index, "role", savedValue);
                                                } catch (err) {
                                                    console.error("Error creating job role", err);
                                                }
                                            }}
                                            styles={{
                                                control: (base, state) => ({
                                                    ...base,
                                                    minHeight: '48px',
                                                    borderRadius: '4px',
                                                    borderColor: state.isFocused ? '#000' : '#d1d5db',
                                                    boxShadow: state.isFocused ? '0 0 0 1px #000' : 'none',
                                                    '&:hover': { borderColor: '#000' },
                                                }),
                                                placeholder: (base) => ({ ...base, color: '#9ca3af' }),
                                            }}
                                        />
                                    </div>

                                    <div className="flex items-center gap-2 mb-4">
                                        <input 
                                            type="checkbox" 
                                            id={`isCurrent-${index}`}
                                            checked={isCurrent || false}
                                            onChange={(e) => {
                                                handleExperienceChange(index, "isCurrent", e.target.checked);
                                                // Clear end date if currently working
                                                if (e.target.checked) {
                                                    handleExperienceChange(index, "endDate", null);
                                                }
                                            }}
                                        />
                                        <label htmlFor={`isCurrent-${index}`} className="text-black text-sm select-none">I currently work here</label>
                                    </div>

                                    <div className="flex gap-4 mb-4">
                                        <div className="flex-1">
                                            <label className="block text-black mb-1">Start Date</label>
                                            <DatePicker 
                                                selected={experience.startDate instanceof Date ? experience.startDate : (experience.startDate ? new Date(experience.startDate) : null)} 
                                                onChange={(date) => handleDateChange(index, "startDate", date)} 
                                                customInput={<CustomDateInput placeholder="Select start date" />} 
                                                showMonthYearPicker 
                                                dateFormat="MM/yyyy" 
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <label className="block text-black mb-1">End Date</label>
                                            <DatePicker 
                                                selected={experience.endDate instanceof Date ? experience.endDate : (experience.endDate ? new Date(experience.endDate) : null)} 
                                                onChange={(date) => handleDateChange(index, "endDate", date)} 
                                                customInput={<CustomDateInput placeholder={isCurrent ? "Present" : "Select end date"} disabled={isCurrent} />} 
                                                showMonthYearPicker 
                                                dateFormat="MM/yyyy" 
                                                minDate={experience.startDate instanceof Date ? experience.startDate : (experience.startDate ? new Date(experience.startDate) : null)}
                                                disabled={isCurrent}
                                            />
                                        </div>
                                    </div>
                                    
                                    <div className="mb-4">
                                        <label className="block text-black mb-1">Description</label>
                                        <textarea 
                                            value={experience.description || ''} 
                                            onChange={(e) => handleExperienceChange(index, "description", e.target.value)} 
                                            className="flex min-h-24 w-full p-3 border border-gray-300 rounded"
                                            placeholder="Briefly describe your responsibilities and achievements."
                                        ></textarea>
                                    </div>

                                    <div>
                                        <label className="block text-black mb-1">Experience Certificate (Optional)</label>
                                        <label className="flex items-center justify-between p-3 border border-gray-300 rounded cursor-pointer hover:bg-gray-50">
                                            <span className="text-[#666] truncate">
                                                {experience.experienceCertificate?.name || "Upload Experience Certificate (PDF, JPEG, PNG)"}
                                            </span>
                                            <UploadIcon className="w-5 h-5 text-gray-500"/>
                                            <input 
                                                type="file" 
                                                accept=".pdf,.jpg,.jpeg,.png" 
                                                className="hidden" 
                                                onChange={(e) => handleFileChange(index, e)}
                                            />
                                        </label>
                                    </div>
                                </div>
                            );
                        })}
                        <div className="flex justify-end mt-4">
                            <button type="button" onClick={handleAddExperience} className="text-blue-600 cursor-pointer">Add experience +</button>
                        </div>
                    </div>
                    
                    <div className="flex min-h-12 w-full gap-4 mt-8">
                        <button type="button" onClick={onBack} className="flex-1 self-stretch gap-2 text-black px-6 py-3 border rounded-md">Back</button>
                        <button type="button" onClick={onNext} className="flex-1 self-stretch bg-black gap-2 text-white px-6 py-3 border rounded-md">Next</button>
                    </div>
                </form>
            </div>
        </div>
    );
};