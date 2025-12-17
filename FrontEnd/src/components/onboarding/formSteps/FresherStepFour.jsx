import React, { useState, useEffect, useRef, useMemo } from "react";
import { ChevronDownIcon, X, Target, MapPin, Briefcase, Building, DollarSign, Calendar, Plus } from "lucide-react";
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
    <div className="flex items-center bg-gradient-to-r from-[#e0e7ff]/20 to-[#c7d2fe]/20 border border-[#e0e7ff]/30 text-gray-700 text-sm px-3 py-1.5 rounded-full">
        <span>{item}</span>
        <button
            type="button"
            onClick={onRemove}
            className="ml-2 text-gray-500 hover:text-red-500 transition-colors"
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

    // Custom reusable MultiSelect Dropdown component
    const MultiSelectDropdown = ({ field, options, label, ref }) => {
        return (
            <div ref={ref} className="relative">
                <label className="block text-gray-700 font-medium text-sm mb-2">{label}</label>

                {/* Selected Tags */}
                {(formData[field] || []).length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                        {(formData[field] || []).map(item => (
                            <SelectedTag
                                key={item}
                                item={item}
                                onRemove={() => removeSelectedItem(field, item)}
                            />
                        ))}
                    </div>
                )}

                {/* Dropdown Trigger */}
                <div
                    className="flex items-center justify-between p-4 w-full border border-gray-300 rounded-xl cursor-pointer hover:border-[#667eea] transition-all duration-200"
                    onClick={(e) => { e.stopPropagation(); toggleDropdown(field); }}
                >
                    <div className="flex items-center">
                        {field === "industry" ? (
                            <Building className="w-5 h-5 text-gray-400 mr-3" />
                        ) : (
                            <Briefcase className="w-5 h-5 text-gray-400 mr-3" />
                        )}
                        <span className={(formData[field] || []).length > 0 ? "text-gray-700" : "text-gray-400"}>
                            {(formData[field] || []).length > 0
                                ? `Selected ${(formData[field] || []).length} ${(formData[field] || []).length === 1 ? 'item' : 'items'}`
                                : `Select ${label.toLowerCase()}`}
                        </span>
                    </div>
                    <ChevronDownIcon className={`w-5 h-5 text-gray-400 transition-transform ${dropdownOpen[field] ? "rotate-180" : ""}`} />
                </div>

                {/* Dropdown Menu */}
                {dropdownOpen[field] && (
                    <div
                        className="absolute z-20 mt-1 w-full bg-white border border-gray-300 rounded-xl shadow-lg"
                        onMouseDown={(e) => e.stopPropagation()}
                    >
                        <ul className="max-h-60 overflow-y-auto">
                            {options.map((option) => (
                                <li
                                    key={option}
                                    onClick={(e) => { e.stopPropagation(); handleMultiSelect(field, option); }}
                                    className={`px-4 py-3 hover:bg-gradient-to-r from-[#667eea]/5 to-[#764ba2]/5 cursor-pointer transition-all duration-200 border-b border-gray-100 last:border-b-0 ${
                                        (formData[field] || []).includes(option)
                                            ? "bg-gradient-to-r from-[#667eea]/10 to-[#764ba2]/10 text-[#5b21b6]"
                                            : ""
                                    }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-700">{option}</span>
                                        {(formData[field] || []).includes(option) && (
                                            <svg className="w-5 h-5 text-[#667eea]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                        )}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#667eea]/10 via-[#f093fb]/5 to-[#764ba2]/10">
            {/* Pastel blur background elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#667eea]/10 rounded-full blur-3xl"></div>
                <div className="absolute top-1/3 -left-20 w-60 h-60 bg-[#f093fb]/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-20 right-1/3 w-40 h-40 bg-[#764ba2]/10 rounded-full blur-3xl"></div>
            </div>

            <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
                <div className="bg-white/90 backdrop-blur-sm border border-white/50 rounded-2xl shadow-lg shadow-purple-50/50 p-8 w-full max-w-2xl">
                    
                    {/* Header with gradient */}
                    <div className="text-center mb-8">
                        <div className="w-20 h-20 rounded-2xl bg-gradient-to-r from-[#667eea]/20 to-[#764ba2]/20 flex items-center justify-center mx-auto mb-4">
                            <Target className="w-10 h-10 text-[#667eea]" />
                        </div>
                        <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent mb-2">
                            Career Goals & Experience
                        </h1>
                        <p className="text-gray-600 mb-4">
                            Let us know your job interests and preferred locations so we can recommend the best opportunities for you.
                        </p>
                    </div>

                    {/* Wider Form Section */}
                    <div className="space-y-6">
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

                        {/* Preferred Job Locations */}
                        <div>
                            <label className="block text-gray-700 font-medium text-sm mb-2">Preferred Job Locations</label>
                            <div className="flex items-center p-1">
                                <MapPin className="w-5 h-5 text-gray-400 mr-3 flex-shrink-0" />
                                <CreatableSelect
                                    isMulti
                                    options={locationOptions}
                                    value={selectedLocationsValue}
                                    onChange={handleLocationChange}
                                    placeholder="Select or type to add locations..."
                                    styles={{
                                        control: (base, state) => ({
                                            ...base,
                                            border: 'none',
                                            minHeight: '40px',
                                            backgroundColor: 'transparent',
                                            boxShadow: 'none',
                                            '&:hover': {
                                                border: 'none'
                                            }
                                        }),
                                        container: (base) => ({
                                            ...base,
                                            width: '100%'
                                        }),
                                        valueContainer: (base) => ({
                                            ...base,
                                            padding: '0'
                                        }),
                                        input: (base) => ({
                                            ...base,
                                            margin: '0',
                                            padding: '0',
                                            color: '#374151'
                                        }),
                                        placeholder: (base) => ({
                                            ...base,
                                            color: '#9ca3af',
                                            margin: '0'
                                        }),
                                        menu: (base) => ({
                                            ...base,
                                            borderRadius: '12px',
                                            border: '1px solid #e5e7eb',
                                            zIndex: 50,
                                            marginTop: '8px'
                                        }),
                                        option: (base, state) => ({
                                            ...base,
                                            backgroundColor: state.isSelected 
                                                ? 'rgba(102, 126, 234, 0.1)' 
                                                : state.isFocused 
                                                ? 'rgba(102, 126, 234, 0.05)' 
                                                : 'white',
                                            color: state.isSelected ? '#5b21b6' : '#374151',
                                            cursor: 'pointer',
                                            padding: '12px 16px',
                                            '&:active': {
                                                backgroundColor: 'rgba(102, 126, 234, 0.1)'
                                            }
                                        }),
                                        multiValue: (base) => ({
                                            ...base,
                                            backgroundColor: 'rgba(102, 126, 234, 0.1)',
                                            borderRadius: '9999px',
                                            border: '1px solid rgba(102, 126, 234, 0.2)'
                                        }),
                                        multiValueLabel: (base) => ({
                                            ...base,
                                            color: '#5b21b6',
                                            padding: '4px 8px',
                                            fontWeight: '500'
                                        }),
                                        multiValueRemove: (base) => ({
                                            ...base,
                                            borderRadius: '0 9999px 9999px 0',
                                            color: '#8b5cf6',
                                            ':hover': {
                                                backgroundColor: 'rgba(102, 126, 234, 0.2)',
                                                color: '#5b21b6',
                                            },
                                        }),
                                    }}
                                />
                            </div>
                        </div>

                        {/* Expected Salary */}
                        <div>
                            <label className="block text-gray-700 font-medium text-sm mb-2">Expected Salary</label>
                            <div className="flex items-center gap-3">
                                <div className="relative flex-1">
                                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        id="expectedSalaryAmount"
                                        name="expectedSalaryAmount"
                                        type="text"
                                        value={formData.expectedSalaryAmount || ""}
                                        onChange={handleChange}
                                        placeholder="e.g., 50000"
                                        className="w-full p-4 pl-10 border border-gray-300 rounded-xl focus:outline-none focus:border-[#667eea] focus:shadow-[0_0_0_3px_rgba(102,126,234,0.1)] text-gray-700 placeholder-gray-400"
                                    />
                                </div>
                                <div className="relative w-32">
                                    <select
                                        id="expectedSalaryCurrency"
                                        name="expectedSalaryCurrency"
                                        value={formData.expectedSalaryCurrency || "INR"}
                                        onChange={handleChange}
                                        className="appearance-none w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:border-[#667eea] focus:shadow-[0_0_0_3px_rgba(102,126,234,0.1)] text-gray-700 pr-10"
                                    >
                                        <option value="INR">INR</option>
                                        <option value="USD">USD</option>
                                        <option value="EUR">EUR</option>
                                    </select>
                                    <ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                                </div>
                            </div>
                        </div>

                        {/* Looking For */}
                        <div>
                            <label className="block text-gray-700 font-medium text-sm mb-2">Looking for</label>
                            <div className="grid grid-cols-3 gap-3">
                                {["Job", "Internship", "Both"].map((option) => (
                                    <button
                                        key={option}
                                        type="button"
                                        className={`p-3 border rounded-xl transition-all duration-200 font-medium ${
                                            isLookingForActive(option)
                                                ? "bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white border-transparent shadow-lg shadow-purple-500/30"
                                                : "text-gray-700 border-gray-300 hover:border-[#667eea] hover:bg-gradient-to-r hover:from-[#667eea]/5 hover:to-[#764ba2]/5"
                                        }`}
                                        onClick={() => handleLookingForChange(option)}
                                    >
                                        {option}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Employment Type */}
                        <div>
                            <label className="block text-gray-700 font-medium text-sm mb-2">Employment Type</label>
                            <div className="grid grid-cols-3 gap-3">
                                {employmentTypeOptions.map((option) => (
                                    <button
                                        key={option}
                                        type="button"
                                        className={`p-3 border rounded-xl transition-all duration-200 font-medium capitalize ${
                                            currentEmploymentType.includes(option)
                                                ? "bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white border-transparent shadow-lg shadow-purple-500/30"
                                                : "text-gray-700 border-gray-300 hover:border-[#667eea] hover:bg-gradient-to-r hover:from-[#667eea]/5 hover:to-[#764ba2]/5"
                                        }`}
                                        onClick={() => handleMultiSelect("employmentType", option)}
                                    >
                                        {option}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Internships/Trainings */}
                        <div>
                            <label className="block text-gray-700 font-medium text-sm mb-2">Internships/Trainings</label>
                            {(formData.experiences || []).map((exp, index) => (
                                <div key={index} className="p-6 border border-gray-300 rounded-xl mt-4 relative bg-gradient-to-r from-[#f8fafc] to-[#f1f5f9]">
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveExperience(index)}
                                        className="absolute top-3 right-3 p-1.5 rounded-full bg-gradient-to-r from-[#fecaca]/20 to-[#fca5a5]/20 border border-[#fecaca]/30 text-red-500 hover:from-[#fecaca]/30 hover:to-[#fca5a5]/30 transition-all duration-200"
                                    >
                                        <X size={16} />
                                    </button>
                                    
                                    {/* Company Dropdown */}
                                    <div className="relative mt-2">
                                        <label className="block text-gray-700 font-medium text-sm mb-2">Company</label>
                                        <div className="flex items-center">
                                            <Building className="w-5 h-5 text-gray-400 mr-3" />
                                            <div className="relative flex-grow">
                                                <select
                                                    name="company"
                                                    value={exp.company}
                                                    onChange={(e) => handleExperienceChange(index, e)}
                                                    className="appearance-none w-full p-4 bg-transparent border border-gray-300 rounded-xl focus:outline-none focus:border-[#667eea] focus:shadow-[0_0_0_3px_rgba(102,126,234,0.1)] text-gray-700 pr-10"
                                                >
                                                    <option value="" disabled>Select Company</option>
                                                    {companyOptions.map(company => (
                                                        <option key={company} value={company}>{company}</option>
                                                    ))}
                                                </select>
                                                <ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Role Dropdown */}
                                    <div className="relative mt-4">
                                        <label className="block text-gray-700 font-medium text-sm mb-2">Role</label>
                                        <div className="flex items-center">
                                            <Briefcase className="w-5 h-5 text-gray-400 mr-3" />
                                            <div className="relative flex-grow">
                                                <select
                                                    name="role"
                                                    value={exp.role}
                                                    onChange={(e) => handleExperienceChange(index, e)}
                                                    className="appearance-none w-full p-4 bg-transparent border border-gray-300 rounded-xl focus:outline-none focus:border-[#667eea] focus:shadow-[0_0_0_3px_rgba(102,126,234,0.1)] text-gray-700 pr-10"
                                                >
                                                    <option value="" disabled>Select Role</option>
                                                    {roleOptions.map(role => (
                                                        <option key={role} value={role}>{role}</option>
                                                    ))}
                                                </select>
                                                <ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Date Range */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                        <div>
                                            <label className="block text-gray-700 font-medium text-sm mb-2">Start Date</label>
                                            <div className="flex items-center">
                                                <Calendar className="w-5 h-5 text-gray-400 mr-3" />
                                                <DatePicker
                                                    selected={exp.startDate ? new Date(exp.startDate) : null}
                                                    onChange={(date) => handleDateChange(index, "startDate", date)}
                                                    selectsStart
                                                    startDate={exp.startDate ? new Date(exp.startDate) : null}
                                                    endDate={exp.endDate ? new Date(exp.endDate) : null}
                                                    placeholderText="Select start date"
                                                    className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:border-[#667eea] focus:shadow-[0_0_0_3px_rgba(102,126,234,0.1)] text-gray-700"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-gray-700 font-medium text-sm mb-2">End Date</label>
                                            <div className="flex items-center">
                                                <Calendar className="w-5 h-5 text-gray-400 mr-3" />
                                                <DatePicker
                                                    selected={exp.endDate ? new Date(exp.endDate) : null}
                                                    onChange={(date) => handleDateChange(index, "endDate", date)}
                                                    selectsEnd
                                                    startDate={exp.startDate ? new Date(exp.startDate) : null}
                                                    endDate={exp.endDate ? new Date(exp.endDate) : null}
                                                    minDate={exp.startDate ? new Date(exp.startDate) : null}
                                                    placeholderText="Select end date"
                                                    className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:border-[#667eea] focus:shadow-[0_0_0_3px_rgba(102,126,234,0.1)] text-gray-700"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Description */}
                                    <div className="mt-4">
                                        <label className="block text-gray-700 font-medium text-sm mb-2">Description</label>
                                        <textarea
                                            name="description"
                                            value={exp.description}
                                            onChange={(e) => handleExperienceChange(index, e)}
                                            className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:border-[#667eea] focus:shadow-[0_0_0_3px_rgba(102,126,234,0.1)] text-gray-700 placeholder-gray-400 min-h-[100px]"
                                            placeholder="Describe your role, responsibilities, and achievements..."
                                        />
                                    </div>
                                </div>
                            ))}
                            
                            {/* Add Experience Button */}
                            <div className="flex justify-end mt-4">
                                <button
                                    type="button"
                                    onClick={handleAddExperience}
                                    className="flex items-center px-4 py-2 bg-gradient-to-r from-[#667eea]/10 to-[#764ba2]/10 border border-[#667eea]/30 rounded-xl text-[#5b21b6] hover:bg-gradient-to-r hover:from-[#667eea]/20 hover:to-[#764ba2]/20 hover:shadow-md transition-all duration-200 font-medium"
                                >
                                    <Plus className="w-4 h-4 mr-2" />
                                    Add experience
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-between mt-8">
                        <button
                            type="button"
                            onClick={onBack}
                            className="flex items-center justify-center px-8 py-3 bg-white/70 backdrop-blur-sm border border-gray-200 rounded-xl text-gray-700 hover:bg-white/90 hover:shadow-md transition-all duration-200 font-medium"
                        >
                            Back
                        </button>
                        <button
                            type="button"
                            onClick={handleClick}
                            className="flex items-center justify-center px-8 py-3 bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white rounded-xl hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-200 font-medium"
                        >
                            Next
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
};