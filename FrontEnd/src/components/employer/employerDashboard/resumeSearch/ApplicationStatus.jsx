import { useState } from "react";
import CandidateCard from "./CandidateCard";

function ApplicationStatus({ candidates, filters, updateFilters, shortlistCandidate, onBackToSearch }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [expandedFilters, setExpandedFilters] = useState({
    industry: false,
    functionalArea: false,
    skills: false,
    basic: false,
    salary: false,
    availability: false,
    experience: false,
    education: false,
    demographics: false,
    preferences: false,
    authorization: false,
    additional: false
  });

  const handleFilterChange = (e) => {
    const { name, type, checked, value } = e.target;

    if (type === "checkbox") {
      const [category, key] = name.split(".");
      updateFilters({
        [category]: {
          ...filters[category],
          [key]: checked,
        },
      });
    } else if (type === "range") {
      const [category, key] = name.split(".");
      updateFilters({
        [category]: {
          ...filters[category],
          [key]: value,
        },
      });
    } else {
      updateFilters({ [name]: value });
    }
  };

  const handleMultiSelect = (category, key, value) => {
    const currentValues = filters[category][key] || [];
    const newValues = currentValues.includes(value)
      ? currentValues.filter(v => v !== value)
      : [...currentValues, value];
    
    updateFilters({
      [category]: {
        ...filters[category],
        [key]: newValues,
      },
    });
  };

  const clearFilter = (filterType) => {
    const defaultFilters = {
      jobStatus: { active: false, expired: false },
      postedBy: { me: false, user2: false, user3: false, user4: false, user5: false },
      industry: { IT: false, BFSI: false, Healthcare: false, Manufacturing: false, EdTech: false, Retail: false, Automotive: false, Pharma: false },
      functionalArea: { ProductManagement: false, HR: false, Sales: false, Finance: false, RnD: false, QA: false, Marketing: false, Operations: false },
      skills: { selected: [] },
      basic: { jobTitle: "", locations: [], experience: { min: 0, max: 20 } },
      salary: { current: { min: 0, max: 50 }, expected: { min: 0, max: 100 } },
      availability: { timeToAvailability: "", travel: "" },
      experience: { 
        pastEmployerType: { MNC: false, Startup: false, Government: false, Big4: false, Unicorn: false },
        topCompanies: { FAANG: false, TCS: false, Accenture: false, Deloitte: false, Infosys: false },
        international: false,
        clientSite: false,
        leadership: false
      },
      education: { premiumInstitute: false, graduationYear: { min: 2000, max: 2024 } },
      demographics: { 
        gender: { Male: false, Female: false, Other: false },
        ethnicity: { Asian: false, White: false, Black: false, Hispanic: false, Other: false },
        maritalStatus: { Single: false, Married: false }
      },
      preferences: {
        workMode: { Remote: false, Hybrid: false, Onsite: false },
        employmentType: { FullTime: false, PartTime: false, Contract: false, Freelance: false },
        openToShift: { Day: false, Night: false, Rotational: false }
      },
      authorization: {
        visaStatus: { H1B: false, L1: false, PR: false, Citizen: false }
      },
      additional: {
        certifications: [],
        languages: [],
        tools: [],
        hackathonParticipation: false,
        entrepreneurialExp: false,
        codingCompetitionLinks: [] 
      },
      metadata: {
        lastUpdated: { min: "", max: "" } 
      }
    };
    
    updateFilters({ [filterType]: defaultFilters[filterType] });
  };

  const clearAllFilters = () => {
    updateFilters({
      search: "",
      jobStatus: { active: false, expired: false },
      postedBy: { me: false, user2: false, user3: false, user4: false, user5: false },
      industry: { IT: false, BFSI: false, Healthcare: false, Manufacturing: false, EdTech: false, Retail: false, Automotive: false, Pharma: false },
      functionalArea: { ProductManagement: false, HR: false, Sales: false, Finance: false, RnD: false, QA: false, Marketing: false, Operations: false },
      skills: { selected: [] },
      basic: { jobTitle: "", locations: [], experience: { min: 0, max: 20 } },
      salary: { current: { min: 0, max: 50 }, expected: { min: 0, max: 100 } },
      availability: { timeToAvailability: "", travel: "" },
      experience: { 
        pastEmployerType: { MNC: false, Startup: false, Government: false, Big4: false, Unicorn: false },
        topCompanies: { FAANG: false, TCS: false, Accenture: false, Deloitte: false, Infosys: false },
        international: false,
        clientSite: false,
        leadership: false
      },
      education: { premiumInstitute: false, graduationYear: { min: 2000, max: 2024 } },
      demographics: { 
        gender: { Male: false, Female: false, Other: false },
        maritalStatus: { Single: false, Married: false }
      },
      preferences: {
        workMode: { Remote: false, Hybrid: false, Onsite: false },
        employmentType: { FullTime: false, PartTime: false, Contract: false, Freelance: false },
        openToShift: { Day: false, Night: false, Rotational: false }
      },
      authorization: {
        visaStatus: { H1B: false, L1: false, PR: false, Citizen: false }
      },
      additional: {
        certifications: [],
        languages: [],
        hackathonParticipation: false,
        entrepreneurialExp: false
      }
    });
    setSearchQuery("");
  };

  const toggleFilterSection = (section) => {
    setExpandedFilters(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const filteredCandidates = (candidates || []).filter((candidate) => {
    // Search query filter
    if (searchQuery && 
        !candidate.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !candidate.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()))) {
      return false;
    }

    // Job status filter
    if (filters.jobStatus?.active && candidate.status !== "active") return false;
    if (filters.jobStatus?.expired && candidate.status !== "expired") return false;

    // Posted by filter
    const postedByFilters = Object.entries(filters.postedBy || {}).filter(([_, value]) => value);
    if (postedByFilters.length > 0) {
      const postedByKeys = postedByFilters.map(([key]) => key);
      if (!postedByKeys.includes(candidate.postedBy)) return false;
    }

    // Industry filter
    const industryFilters = Object.entries(filters.industry || {}).filter(([_, value]) => value);
    if (industryFilters.length > 0) {
      const industryKeys = industryFilters.map(([key]) => key);
      if (!industryKeys.includes(candidate.industry)) return false;
    }

    // Functional Area filter
    const functionalAreaFilters = Object.entries(filters.functionalArea || {}).filter(([_, value]) => value);
    if (functionalAreaFilters.length > 0) {
      const functionalAreaKeys = functionalAreaFilters.map(([key]) => key);
      if (!functionalAreaKeys.includes(candidate.functionalArea)) return false;
    }

    // Skills filter
    if (filters.skills?.selected?.length > 0) {
      const hasRequiredSkills = filters.skills.selected.every(skill =>
        candidate.skills.some(candidateSkill => 
          candidateSkill.toLowerCase().includes(skill.toLowerCase())
        )
      );
      if (!hasRequiredSkills) return false;
    }

    // Experience range filter
    if (filters.basic?.experience) {
      const exp = candidate.experience || 0;
      if (exp < filters.basic.experience.min || exp > filters.basic.experience.max) return false;
    }

    // Salary filters
    if (filters.salary?.current) {
      const currentSalary = candidate.currentSalary || 0;
      if (currentSalary < filters.salary.current.min || currentSalary > filters.salary.current.max) return false;
    }

    // Work mode preference
    const workModeFilters = Object.entries(filters.preferences?.workMode || {}).filter(([_, value]) => value);
    if (workModeFilters.length > 0) {
      const workModeKeys = workModeFilters.map(([key]) => key);
      if (!workModeKeys.includes(candidate.workModePreference)) return false;
    }

  
  // Client site
if (filters.experience?.clientSite && !candidate.clientSite) return false;

// Leadership
if (filters.experience?.leadership && !candidate.leadership) return false;

// Premium Institute
if (filters.education?.premiumInstitute && !candidate.premiumInstitute) return false;

// Gender
const genderFilters = Object.entries(filters.demographics?.gender || {}).filter(([_, v]) => v);
if (genderFilters.length > 0 && !genderFilters.map(([k]) => k).includes(candidate.gender)) return false;

// Ethnicity
const ethnicityFilters = Object.entries(filters.demographics?.ethnicity || {}).filter(([_, v]) => v);
if (ethnicityFilters.length > 0 && !ethnicityFilters.map(([k]) => k).includes(candidate.ethnicity)) return false;

// Languages
if (filters.additional?.languages?.length > 0) {
  const hasLanguages = filters.additional.languages.every(l =>
    candidate.languages?.includes(l)
  );
  if (!hasLanguages) return false;
}

// Tools
if (filters.additional?.tools?.length > 0) {
  const hasTools = filters.additional.tools.every(t =>
    candidate.tools?.includes(t)
  );
  if (!hasTools) return false;
}

// Hackathon / Entrepreneurial
if (filters.additional?.hackathonParticipation && !candidate.hackathonParticipation) return false;
if (filters.additional?.entrepreneurialExp && !candidate.entrepreneurialExp) return false;

// Last profile update
if (filters.metadata?.lastUpdated?.min || filters.metadata?.lastUpdated?.max) {
  const updatedDate = new Date(candidate.lastUpdated || "1970-01-01");
  if (filters.metadata.lastUpdated.min && updatedDate < new Date(filters.metadata.lastUpdated.min)) return false;
  if (filters.metadata.lastUpdated.max && updatedDate > new Date(filters.metadata.lastUpdated.max)) return false;
}

  return true;
  });
  const sortedCandidates = [...filteredCandidates].sort((a, b) => {
    if (sortBy === "newest") {
      return new Date(b.appliedDate) - new Date(a.appliedDate);
    } else if (sortBy === "oldest") {
      return new Date(a.appliedDate) - new Date(a.appliedDate);
    } else if (sortBy === "nameAsc") {
      return a.name.localeCompare(b.name);
    } else if (sortBy === "nameDesc") {
      return b.name.localeCompare(a.name);
    } else if (sortBy === "experience") {
      return (b.experience || 0) - (a.experience || 0);
    } else if (sortBy === "salary") {
      return (b.currentSalary || 0) - (a.currentSalary || 0);
    }
    return 0;
  });

  const FilterSection = ({ title, children, sectionKey }) => (
    <div className="border-t pt-4 mb-4">
      <div className="mb-2 flex justify-between items-center">
        <button
          onClick={() => toggleFilterSection(sectionKey)}
          className="flex items-center space-x-1 font-medium text-sm hover:text-teal-600"
        >
          <span>{title}</span>
          <svg 
            className={`w-4 h-4 transition-transform ${expandedFilters[sectionKey] ? 'rotate-90' : ''}`}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
          </svg>
        </button>
        <button
          onClick={() => clearFilter(sectionKey)}
          className="text-xs hover:text-gray-500 text-teal-700"
        >
          Clear
        </button>
      </div>
      {expandedFilters[sectionKey] && <div className="space-y-2">{children}</div>}
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto p-4">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-teal-700 py-4 mb-6">
        <h1 className="text-xl font-semibold">Application Status</h1>
        <div className="flex items-center space-x-2">
          <div className="relative">
            <input
              type="text"
              placeholder="Search candidates, skills, companies..."
              className="py-1 px-3 pl-8 border border-gray-300 rounded text-sm w-64"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <svg className="absolute left-2 top-2 text-gray-400 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </div>
          <div className="flex items-center space-x-1">
            <span className="text-sm">Sort by:</span>
            <select
              className="py-1 px-2 border border-gray-300 rounded text-sm"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="nameAsc">Name (A-Z)</option>
              <option value="nameDesc">Name (Z-A)</option>
              <option value="experience">Experience (High to Low)</option>
              <option value="salary">Salary (High to Low)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Layout */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Enhanced Sidebar with comprehensive filters */}
        <div className="lg:w-1/4">
          <div className="bg-white p-4 rounded shadow max-h-screen overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold">Advanced Filters</h2>
              <button
                onClick={clearAllFilters}
                className="text-sm text-teal-600 hover:text-teal-800"
              >
                Clear all
              </button>
            </div>

            <div className="text-xs text-gray-500 mb-4">
              Showing {sortedCandidates.length} of {candidates?.length || 0} candidates
            </div>

            {/* Job Status */}
            <FilterSection title="Job Status" sectionKey="jobStatus">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="jobStatus.active"
                  checked={filters.jobStatus?.active || false}
                  onChange={handleFilterChange}
                  className="mr-2"
                />
                <span className="text-sm">Active Jobs</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="jobStatus.expired"
                  checked={filters.jobStatus?.expired || false}
                  onChange={handleFilterChange}
                  className="mr-2"
                />
                <span className="text-sm">Expired Jobs</span>
              </label>
            </FilterSection>

            {/* Industry/Domain */}
            <FilterSection title="Industry / Domain" sectionKey="industry">
              {['IT', 'BFSI', 'Healthcare', 'Manufacturing', 'EdTech', 'Retail', 'Automotive', 'Pharma'].map(industry => (
                <label key={industry} className="flex items-center">
                  <input
                    type="checkbox"
                    name={`industry.${industry}`}
                    checked={filters.industry?.[industry] || false}
                    onChange={handleFilterChange}
                    className="mr-2"
                  />
                  <span className="text-sm">{industry}</span>
                </label>
              ))}
            </FilterSection>

            {/* Functional Area */}
            <FilterSection title="Functional Area" sectionKey="functionalArea">
              {['ProductManagement', 'HR', 'Sales', 'Finance', 'RnD', 'QA', 'Marketing', 'Operations'].map(area => (
                <label key={area} className="flex items-center">
                  <input
                    type="checkbox"
                    name={`functionalArea.${area}`}
                    checked={filters.functionalArea?.[area] || false}
                    onChange={handleFilterChange}
                    className="mr-2"
                  />
                  <span className="text-sm">{area.replace(/([A-Z])/g, ' $1').trim()}</span>
                </label>
              ))}
            </FilterSection>

            {/* Basic Filters */}
            <FilterSection title="Basic Information" sectionKey="basic">
              <div>
                <label className="block text-sm font-medium mb-1">Job Title</label>
                <input
                  type="text"
                  name="basic.jobTitle"
                  value={filters.basic?.jobTitle || ""}
                  onChange={handleFilterChange}
                  placeholder="e.g. Software Engineer"
                  className="w-full p-2 border border-gray-300 rounded text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Experience Range (years)</label>
                <div className="flex space-x-2">
                  <input
                    type="number"
                    name="basic.experience.min"
                    value={filters.basic?.experience?.min || 0}
                    onChange={handleFilterChange}
                    placeholder="Min"
                    className="w-full p-1 border border-gray-300 rounded text-sm"
                    min="0"
                    max="50"
                  />
                  <input
                    type="number"
                    name="basic.experience.max"
                    value={filters.basic?.experience?.max || 20}
                    onChange={handleFilterChange}
                    placeholder="Max"
                    className="w-full p-1 border border-gray-300 rounded text-sm"
                    min="0"
                    max="50"
                  />
                </div>
              </div>
            </FilterSection>

            {/* Salary Filters */}
            <FilterSection title="Salary Range (LPA)" sectionKey="salary">
              <div>
                <label className="block text-sm font-medium mb-1">Current Salary</label>
                <div className="flex space-x-2">
                  <input
                    type="number"
                    name="salary.current.min"
                    value={filters.salary?.current?.min || 0}
                    onChange={handleFilterChange}
                    placeholder="Min"
                    className="w-full p-1 border border-gray-300 rounded text-sm"
                  />
                  <input
                    type="number"
                    name="salary.current.max"
                    value={filters.salary?.current?.max || 50}
                    onChange={handleFilterChange}
                    placeholder="Max"
                    className="w-full p-1 border border-gray-300 rounded text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Expected Salary</label>
                <div className="flex space-x-2">
                  <input
                    type="number"
                    name="salary.expected.min"
                    value={filters.salary?.expected?.min || 0}
                    onChange={handleFilterChange}
                    placeholder="Min"
                    className="w-full p-1 border border-gray-300 rounded text-sm"
                  />
                  <input
                    type="number"
                    name="salary.expected.max"
                    value={filters.salary?.expected?.max || 100}
                    onChange={handleFilterChange}
                    placeholder="Max"
                    className="w-full p-1 border border-gray-300 rounded text-sm"
                  />
                </div>
              </div>
            </FilterSection>

            {/* Work Preferences */}
            <FilterSection title="Work Preferences" sectionKey="preferences">
              <div>
                <label className="block text-sm font-medium mb-1">Work Mode</label>
                {['Remote', 'Hybrid', 'Onsite'].map(mode => (
                  <label key={mode} className="flex items-center">
                    <input
                      type="checkbox"
                      name={`preferences.workMode.${mode}`}
                      checked={filters.preferences?.workMode?.[mode] || false}
                      onChange={handleFilterChange}
                      className="mr-2"
                    />
                    <span className="text-sm">{mode}</span>
                  </label>
                ))}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Employment Type</label>
                {['FullTime', 'PartTime', 'Contract', 'Freelance'].map(type => (
                  <label key={type} className="flex items-center">
                    <input
                      type="checkbox"
                      name={`preferences.employmentType.${type}`}
                      checked={filters.preferences?.employmentType?.[type] || false}
                      onChange={handleFilterChange}
                      className="mr-2"
                    />
                    <span className="text-sm">{type.replace(/([A-Z])/g, ' $1').trim()}</span>
                  </label>
                ))}
              </div>
            </FilterSection>

            {/* Experience Type */}
            <FilterSection title="Experience Details" sectionKey="experience">
              {/* Existing checkboxes */}
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="experience.clientSite"
                  checked={filters.experience?.clientSite || false}
                  onChange={handleFilterChange}
                  className="mr-2"
                />
                <span className="text-sm">Client Site Experience</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="experience.leadership"
                  checked={filters.experience?.leadership || false}
                  onChange={handleFilterChange}
                  className="mr-2"
                />
                <span className="text-sm">Leadership Experience</span>
              </label>
            </FilterSection>


            {/* Education */}
            <FilterSection title="Education" sectionKey="education">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="education.premiumInstitute"
                  checked={filters.education?.premiumInstitute || false}
                  onChange={handleFilterChange}
                  className="mr-2"
                />
                <span className="text-sm">Premium Institute (IIT/NIT/IIM)</span>
              </label>
              <div>
                <label className="block text-sm font-medium mb-1">Graduation Year</label>
                <div className="flex space-x-2">
                  <input
                    type="number"
                    name="education.graduationYear.min"
                    value={filters.education?.graduationYear?.min || 2000}
                    onChange={handleFilterChange}
                    placeholder="From"
                    className="w-full p-1 border border-gray-300 rounded text-sm"
                    min="1990"
                    max="2024"
                  />
                  <input
                    type="number"
                    name="education.graduationYear.max"
                    value={filters.education?.graduationYear?.max || 2024}
                    onChange={handleFilterChange}
                    placeholder="To"
                    className="w-full p-1 border border-gray-300 rounded text-sm"
                    min="1990"
                    max="2024"
                  />
                </div>
              </div>
            </FilterSection>

            {/* Authorization */}
              <FilterSection title="Work Authorization" sectionKey="authorization">
                {['H1B', 'L1', 'PR', 'Citizen'].map(visa => (
                  <label key={visa} className="flex items-center">
                    <input
                      type="checkbox"
                      name={`authorization.visaStatus.${visa}`}
                      checked={filters.authorization?.visaStatus?.[visa] || false}
                      onChange={handleFilterChange}
                      className="mr-2"
                    />
                    <span className="text-sm">{visa}</span>
                  </label>
                ))}
              </FilterSection>
              <FilterSection title="Demographics" sectionKey="demographics">
                  <div>
                    <label className="block text-sm font-medium mb-1">Gender</label>
                    {['Male', 'Female', 'Other'].map(g => (
                      <label key={g} className="flex items-center">
                        <input
                          type="checkbox"
                          name={`demographics.gender.${g}`}
                          checked={filters.demographics?.gender?.[g] || false}
                          onChange={handleFilterChange}
                          className="mr-2"
                        />
                        <span className="text-sm">{g}</span>
                      </label>
                    ))}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Ethnicity</label>
                    {['Asian', 'White', 'Black', 'Hispanic', 'Other'].map(e => (
                      <label key={e} className="flex items-center">
                        <input
                          type="checkbox"
                          name={`demographics.ethnicity.${e}`}
                          checked={filters.demographics?.ethnicity?.[e] || false}
                          onChange={handleFilterChange}
                          className="mr-2"
                        />
                        <span className="text-sm">{e}</span>
                      </label>
                    ))}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Marital Status</label>
                    {['Single', 'Married'].map(m => (
                      <label key={m} className="flex items-center">
                        <input
                          type="checkbox"
                          name={`demographics.maritalStatus.${m}`}
                          checked={filters.demographics?.maritalStatus?.[m] || false}
                          onChange={handleFilterChange}
                          className="mr-2"
                        />
                        <span className="text-sm">{m}</span>
                      </label>
                    ))}
                  </div>
                </FilterSection>

                <FilterSection title="Tools & Platforms" sectionKey="additional">
                  {['AWS', 'Salesforce', 'SAP', 'GitHub', 'Jira'].map(tool => (
                    <label key={tool} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={filters.additional?.tools?.includes(tool) || false}
                        onChange={() => handleMultiSelect("additional", "tools", tool)}
                        className="mr-2"
                      />
                      <span className="text-sm">{tool}</span>
                    </label>
                  ))}
                </FilterSection>


            <button
              onClick={onBackToSearch}
              className="mt-6 w-full bg-teal-600 text-white py-2 rounded hover:bg-teal-700"
            >
              Back to Search
            </button>
          </div>
        </div>

        {/* Candidate list */}
        <div className="lg:w-3/4">
          {sortedCandidates.length === 0 ? (
            <div className="bg-white p-8 rounded shadow text-center">
              <p className="text-gray-500">
                No candidates found matching your filters.
              </p>
              <button
                onClick={clearAllFilters}
                className="mt-4 text-teal-600 hover:text-teal-800 font-medium"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {sortedCandidates.map((candidate) => (
                <CandidateCard
                  key={candidate.id}
                  candidate={candidate}
                  onShortlist={() => shortlistCandidate(candidate.id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ApplicationStatus;