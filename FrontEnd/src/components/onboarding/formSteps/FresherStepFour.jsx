import React, { useState, useEffect, useRef, useMemo } from "react";
import { ProgressIndicator } from "../ProgressIndicator";
import { ChevronDownIcon, X } from "lucide-react";
import { useRole } from "@/context/RoleContext/RoleContext";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { City } from 'country-state-city';
import CreatableSelect from 'react-select/creatable';

// --- STATIC OPTIONS ---
const industryOptions = [
    "Technology",
    "Finance",
    "Healthcare",
    "Education",
    "Manufacturing",
    "E-commerce",
];
const jobRoleOptions = [
    "Software Developer",
    "UI/UX Designer",
    "Project Manager",
    "Data Analyst",
    "Marketing Specialist",
    "DevOps Engineer",
];
const employmentTypeOptions = ["part time", "full time", "contract"];
const companyOptions = [
    "Google",
    "Microsoft",
    "Amazon",
    "TCS",
    "Infosys",
    "Wipro"
];
const roleOptions = [
    "Software Developer",
    "UI/UX Designer",
    "Project Manager",
    "Data Analyst",
    "Marketing Specialist"
];


const SelectedTag = ({ item, onRemove }) => (
    <div className="flex items-center bg-gray-200 text-sm px-3 py-1 rounded-full text-black">
        <span>{item}</span>
        <button
            type="button"
            onClick={onRemove}
            className="ml-2 text-gray-600 hover:text-black"
        >
            <X size={14} />
        </button>
    </div>
);


export const FresherStepFour = ({ onNext, onBack }) => {
    const { formData, updateFormData } = useRole();

    // --- Location Options (React-Select) ---
    const locationOptions = useMemo(() => {
        return City.getCitiesOfCountry("IN")
            ?.map((city) => ({
                value: city.name,
                label: city.name,
            }))
            ?.sort((a, b) => a.label.localeCompare(b.label));
    }, []);

    const [dropdownOpen, setDropdownOpen] = useState({
        industry: false,
        jobRoles: false,
    });

    const industryRef = useRef(null);
    const jobRolesRef = useRef(null);

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            const refs = { industry: industryRef, jobRoles: jobRolesRef };
            for (const field in refs) {
                if (dropdownOpen[field] && refs[field].current && !refs[field].current.contains(event.target)) {
                    setDropdownOpen(prev => ({ ...prev, [field]: false }));
                }
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [dropdownOpen]);

    // --- HANDLERS ---

    const toggleDropdown = (field) => {
        setDropdownOpen((prev) => ({
            ...Object.keys(prev).reduce((acc, key) => ({ ...acc, [key]: false }), {}),
            [field]: !prev[field]
        }));
    };

    const handleMultiSelect = (field, value) => {
        const currentValues = Array.isArray(formData[field]) ? formData[field] : [];
        const newValues = currentValues.includes(value)
            ? currentValues.filter((v) => v !== value)
            : [...currentValues, value];
        updateFormData({ [field]: newValues });
    };

    const removeSelectedItem = (field, value) => {
        const currentValues = Array.isArray(formData[field]) ? formData[field] : [];
        const newValues = currentValues.filter(item => item !== value);
        updateFormData({ [field]: newValues });
    };


    const handleChange = (e) => {
        const { name, value } = e.target;
        updateFormData({ [name]: value });
    };

    // Handler for Locations (React-Select)
    const handleLocationChange = (selectedOptions) => {
        const locations = selectedOptions ? selectedOptions.map(opt => opt.value) : [];
        updateFormData({ locations });
    };

    const selectedLocationsValue = (formData.locations || []).map(loc => ({
        label: loc,
        value: loc
    }));

    // Handler for Looking For
    const handleLookingForChange = (option) => {
        let newVal;
        if (option === 'Both') {
            newVal = ['Internship', 'Job'];
        } else {
            newVal = option;
        }
        updateFormData({ lookingFor: newVal });
    };

    const isLookingForActive = (option) => {
        const val = formData.lookingFor;
        if (option === 'Both') {
            return Array.isArray(val) && val.includes('Job') && val.includes('Internship');
        }
        if (val === option) return true;
        if (Array.isArray(val) && val.includes(option) && val.length === 1) return true;
        return false;
    };

    const handleAddExperience = () => {
        const currentExperiences = formData.experiences || [];
        const newExperiences = [...currentExperiences, {
            company: "",
            role: "",
            startDate: null,
            endDate: null,
            description: ""
        }];
        updateFormData({ experiences: newExperiences });
    };

    const handleExperienceChange = (index, e) => {
        const { name, value } = e.target;
        const newExperiences = [...(formData.experiences || [])];
        newExperiences[index] = { ...newExperiences[index], [name]: value };
        updateFormData({ experiences: newExperiences });
    };

    const handleDateChange = (index, field, date) => {
        const newExperiences = [...(formData.experiences || [])];
        newExperiences[index] = { ...newExperiences[index], [field]: date };
        updateFormData({ experiences: newExperiences });
    };

    const handleRemoveExperience = (index) => {
        const newExperiences = [...(formData.experiences || [])];
        newExperiences.splice(index, 1);
        updateFormData({ experiences: newExperiences });
    };

    const handleClick = () => {
        onNext();
    }

    const currentEmploymentType = Array.isArray(formData.employmentType) ? formData.employmentType : [];

    // Custom reusable MultiSelect Dropdown component (for Industry and Job Roles)
    const MultiSelectDropdown = ({ field, options, label, ref }) => {
        const displayLabel = `Select   ${label.toLowerCase()}`;

        return (
            <div ref={ref} className="w-full mt-6 max-md:max-w-full relative">
                <label className="block text-black max-md:max-w-full">{label}</label>

                <div className="flex flex-wrap gap-2 mt-2 mb-2">
                    {(formData[field] || []).map(item => (
                        <SelectedTag
                            key={item}
                            item={item}
                            onRemove={() => removeSelectedItem(field, item)}
                        />
                    ))}
                </div>

                <div
                    className="flex justify-between items-center min-h-12 w-full p-3 border border-gray-300 rounded cursor-pointer text-[#666] hover:border-gray-400"
                    onClick={(e) => { e.stopPropagation(); toggleDropdown(field); }}
                >
                    <span className={(formData[field] || []).length > 0 ? "text-black" : "text-[#666]"}>
                        {displayLabel}
                    </span>
                    <ChevronDownIcon className={`w-6 h-6 transition-transform ${dropdownOpen[field] ? "rotate-180" : ""}`} />
                </div>

                {dropdownOpen[field] && (
                    <div
                        className="absolute z-20 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg"
                        onMouseDown={(e) => e.stopPropagation()}
                    >
                        <ul className="max-h-60 overflow-y-auto">
                            {options.map((option) => (
                                <li
                                    key={option}
                                    onClick={(e) => { e.stopPropagation(); handleMultiSelect(field, option); }}
                                    className={`p-2 hover:bg-gray-100 cursor-pointer text-black ${
                                        (formData[field] || []).includes(option) ? "bg-gray-100 font-medium" : ""
                                        }`}
                                >
                                    {option}
                                    {(formData[field] || []).includes(option) && <span className="float-right text-gray-500">✓</span>}
                                </li>
                            ))}
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
                        Awesome! Let's define your career goals and skills!
                    </h2>
                    <p className="text-base font-normal leading-6 mt-2 max-md:max-w-full">
                        Let us know your job interests and preferred locations so we can
                        recommend the best opportunities for you.
                    </p>
                </div>

                <form className="w-full text-base font-normal mt-8 max-md:max-w-full">

                    {/* Interested Industry Type (Multi-Select Dropdown) */}
                    <MultiSelectDropdown
                        field="industry"
                        options={industryOptions}
                        label="Interested Industry Type"
                        ref={industryRef}
                    />

                    {/* Interested Job Roles (Multi-Select Dropdown) */}
                    <MultiSelectDropdown
                        field="jobRoles"
                        options={jobRoleOptions}
                        label="Interested Job Roles"
                        ref={jobRolesRef}
                    />

                    {/* Preferred Job Locations (CreatableSelect) */}
                    <div className="w-full mt-6 max-md:max-w-full">
                        <label className="block text-black mb-2">Preferred Job Locations</label>
                        <CreatableSelect
                            isMulti
                            options={locationOptions}
                            value={selectedLocationsValue}
                            onChange={handleLocationChange}
                            placeholder="Select or type to add locations..."
                            styles={{
                                control: (base) => ({
                                    ...base,
                                    borderColor: '#d1d5db',
                                    minHeight: '48px',
                                    borderRadius: '0.25rem', // rounded
                                    backgroundColor: 'white',
                                    padding: '2px',
                                    boxShadow: 'none',
                                    '&:hover': {
                                        borderColor: '#9ca3af'
                                    },
                                    '&:focus-within': {
                                        borderColor: '#000',
                                        boxShadow: '0 0 0 1px #000'
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
                                }),
                                multiValue: (base) => ({
                                    ...base,
                                    backgroundColor: '#e5e7eb',
                                    borderRadius: '9999px',
                                }),
                                multiValueRemove: (base) => ({
                                    ...base,
                                    borderRadius: '0 9999px 9999px 0',
                                    color: '#4b5563',
                                    ':hover': {
                                        backgroundColor: '#d1d5db',
                                        color: 'black',
                                    },
                                }),
                            }}
                        />
                    </div>


                    {/* Expected Salary */}
                    <div className="w-full mt-6 max-md:max-w-full">
                        <label htmlFor="expectedSalary" className="block text-black">
                            Expected Salary
                        </label>
                        <div className="flex items-center gap-2 mt-2">
                            <div className="relative w-24">
                                <select
                                    id="expectedSalaryCurrency"
                                    name="expectedSalaryCurrency"
                                    value={formData.expectedSalaryCurrency || "INR"}
                                    onChange={handleChange}
                                    className="items-center appearance-none flex min-h-12 w-full gap-2 text-[#666] whitespace-nowrap p-3 border border-gray-300 rounded"
                                >
                                    <option value="INR">INR</option>
                                    <option value="USD">USD</option>
                                    <option value="EUR">EUR</option>
                                </select>
                                <ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 pointer-events-none" />
                            </div>
                            <div className="flex-1">
                                <input
                                    id="expectedSalaryAmount"
                                    name="expectedSalaryAmount"
                                    type="text"
                                    value={formData.expectedSalaryAmount || ""}
                                    onChange={handleChange}
                                    placeholder="e.g., 50000"
                                    className="w-full min-h-12 p-3 border border-gray-300 rounded"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Looking For (Updated logic) */}
                    <div className="w-full mt-6 max-md:max-w-full">
                        <label className="block text-black">Looking for</label>
                        <div className="flex w-full gap-4 text-black whitespace-nowrap flex-wrap mt-2">
                            {["Job", "Internship", "Both"].map((option) => (
                                <button
                                    key={option}
                                    type="button"
                                    className={`self-stretch gap-2 px-4 py-2 border rounded-md ${isLookingForActive(option) ? "bg-black text-white" : ""}`}
                                    onClick={() => handleLookingForChange(option)}
                                >
                                    {option}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Employment type (Multi-Select Toggles) */}
                    <div className="w-full mt-6 max-md:max-w-full">
                        <label className="block text-black">Employment type</label>
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

                    {/* Internships/Trainings */}
                    <div className="w-full mt-6 max-md:max-w-full">
                        <label className="block text-black">Internships/Trainings</label>
                        {(formData.experiences || []).map((exp, index) => (
                            <div key={index} className="p-4 border rounded-md mt-4 relative">
                                <button
                                    type="button"
                                    onClick={() => handleRemoveExperience(index)}
                                    className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
                                >
                                    <X size={18} />
                                </button>
                                {/* Company Dropdown */}
                                <div className="relative mt-2">
                                    <select
                                        name="company"
                                        value={exp.company}
                                        onChange={(e) => handleExperienceChange(index, e)}
                                        className="items-center appearance-none flex min-h-12 w-full gap-2 text-[#666] whitespace-nowrap p-3 border border-gray-300 rounded"
                                    >
                                        <option value="" disabled>Select Company</option>
                                        {companyOptions.map(company => (
                                            <option key={company} value={company}>{company}</option>
                                        ))}
                                    </select>
                                    <ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-6 h-6 pointer-events-none" />
                                </div>
                                {/* Role Dropdown */}
                                <div className="relative mt-4">
                                    <select
                                        name="role"
                                        value={exp.role}
                                        onChange={(e) => handleExperienceChange(index, e)}
                                        className="items-center appearance-none flex min-h-12 w-full gap-2 text-[#666] whitespace-nowrap p-3 border border-gray-300 rounded"
                                    >
                                        <option value="" disabled>Select Role</option>
                                        {roleOptions.map(role => (
                                            <option key={role} value={role}>{role}</option>
                                        ))}
                                    </select>
                                    <ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-6 h-6 pointer-events-none" />
                                </div>
                                <div className="flex w-full gap-6 mt-4">
                                    <div className="flex-1">
                                        <label className="block text-black">Start Date</label>
                                        <DatePicker
                                            selected={exp.startDate ? new Date(exp.startDate) : null}
                                            onChange={(date) => handleDateChange(index, "startDate", date)}
                                            selectsStart
                                            startDate={exp.startDate ? new Date(exp.startDate) : null}
                                            endDate={exp.endDate ? new Date(exp.endDate) : null}
                                            placeholderText="Select start date"
                                            className="w-full min-h-12 p-3 border border-gray-300 rounded mt-2"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <label className="block text-black">End Date</label>
                                        <DatePicker
                                            selected={exp.endDate ? new Date(exp.endDate) : null}
                                            onChange={(date) => handleDateChange(index, "endDate", date)}
                                            selectsEnd
                                            startDate={exp.startDate ? new Date(exp.startDate) : null}
                                            endDate={exp.endDate ? new Date(exp.endDate) : null}
                                            minDate={exp.startDate ? new Date(exp.startDate) : null}
                                            placeholderText="Select end date"
                                            className="w-full min-h-12 p-3 border border-gray-300 rounded mt-2"
                                        />
                                    </div>
                                </div>
                                <div className="w-full mt-4">
                                    <textarea
                                        name="description"
                                        value={exp.description}
                                        onChange={(e) => handleExperienceChange(index, e)}
                                        className="flex min-h-24 w-full gap-2 text-[#666] p-3 border border-gray-300 rounded"
                                        placeholder="Describe your role..."
                                    ></textarea>
                                </div>
                            </div>
                        ))}
                        <div className="flex justify-end mt-4">
                            <button
                                type="button"
                                onClick={handleAddExperience}
                                className="text-blue-600 cursor-pointer"
                            >
                                Add experience +
                            </button>
                        </div>
                    </div>

                    <div className="flex min-h-12 w-full gap-2.5 whitespace-nowrap mt-6 max-md:max-w-full">
                        <div className="flex gap-4">
                            <button
                                type="button"
                                onClick={onBack}
                                className="self-stretch gap-2 text-black px-6 py-3 border rounded-md max-md:px-5 cursor-pointer"
                            >
                                Back
                            </button>
                            <button
                                type="button"
                                onClick={handleClick}
                                className="self-stretch bg-black gap-2 text-white px-6 py-3 border rounded-md max-md:px-5 cursor-pointer"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};