
{/*import { useState, useEffect } from 'react';
import JobListSection from '@/components/student/professionaDashboard/referralJobs/JobListSection';
import { getReferralJobListing } from '@/lib/User_AxiosInstance';

const RefferalListings = () => {
  const [profileJobs, setProfileJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchInternships = async () => {
    try {
      setIsLoading(true);
      const response = await getReferralJobListing();
      // Corrected: Access the 'data' property of the response.data.data object
      setProfileJobs(response.data.data);
      setError(null);
    } catch (error) {
      setError('Failed to load internships. Please try again later.');
      console.error('Error fetching internships:', error); // Use console.error for errors
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInternships();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#1e4ed8]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-red-500 text-center p-4">
          <p className="text-xl font-semibold">{error}</p>
          <button
            className="mt-4 bg-[#1e4ed8] hover:bg-blue-600 text-white px-4 py-2 rounded"
            onClick={() => fetchInternships()}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <JobListSection
        title="Referral jobs based on your profile"
        description="Explore internship opportunities tailored to your academic background and skills."
        jobs={profileJobs}
        userType={localStorage.getItem('selectedRole')} // Pass userType to JobListSection
      />

      {/* You can uncomment and use this section if you implement preference-based filtering */}
      {/* <JobListSection
        title="Internships based on your preferences"
        description="Discover internships matching your saved preferences."
        jobs={preferenceJobs}
        userType={localStorage.getItem('selectedRole')}
      /> 
    </div>
  );
};

export default RefferalListings;*/}

import { useState, useEffect, useMemo } from 'react';
import { ChevronDown, X, Filter, MapPin, Briefcase, RefreshCw, AlertCircle, Building, BookOpen, GraduationCap } from 'lucide-react';
import JobCard from '@/components/student/professionaDashboard/referralJobs/JobCard';
import { getReferralJobListing } from '@/lib/User_AxiosInstance';
import { City } from 'country-state-city';
import CreatableSelect from 'react-select/creatable'

function ReferralJobs({ compact = false, onJobSelect, selectedJobId }) {
  
  const [referralJobs, setReferralJobs] = useState([]);
  const [allJobs, setAllJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [filters, setFilters] = useState({
    workMode: [],
    degree: [],
    courses: [],
    employmentType: [],
    location: [],
    company: '',
    internship: false,
    fullTime: false
  });
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  //const [isModalOpen, setIsModalOpen] = useState(false);
  //const [selectedJob, setSelectedJob] = useState(null);
  const [sortBy, setSortBy] = useState('newest');

  const [showMainFilter, setShowMainFilter] = useState(false);
  const [openSubDropdowns, setOpenSubDropdowns] = useState({
    workMode: false,
    degree: false,
    courses: false,
    employmentType: false,
    location: false,
    company: false
  });

  const [filterOptions, setFilterOptions] = useState({
    workMode: [
      { label: 'Work from office' },
      { label: 'Hybrid' },
      { label: 'Remote' },
      { label: 'On-site' }
    ],
    degree: [
      { label: 'Polytechnic' },
      { label: 'Associate Degree' },
      { label: 'ITI' },
      { label: 'Diploma' },
      { label: 'Undergraduate' },
      { label: 'Postgraduate' }
    ],
    courses: [
      { label: 'Engineering' },
      { label: 'Pharmacy' },
      { label: 'Mechanical Engineering' },
      { label: 'Civil Engineering' },
      { label: 'Electrical' },
      { label: 'B.Tech' },
      { label: 'BBA' },
      { label: 'BSc' },
      { label: 'BCA' },
      { label: 'BE' },
      { label: 'BA' },
      { label: 'M.Tech' },
      { label: 'MBA' },
      { label: 'MA' },
      { label: 'MCA' },
      { label: 'MSc' }
    ],
    employmentType: [
      { label: 'Part-time' },
      { label: 'Contract' }
    ]
  });

  const cityOptions = useMemo(
    () =>
      City.getCitiesOfCountry('IN').map(city => ({
        value: city.name,
        label: city.name,
      })),
    []
  );

  const safeLocation = Array.isArray(filters.location) ? filters.location : [];

  // ── Fetch ──────────────────────────────────────────────────────────────────
  const fetchReferralJobs = async () => {
    try {
      setIsLoading(true);
      const response = await getReferralJobListing();
      console.log('referral', response);
      const fetchedJobs = response.data?.data || [];
      setAllJobs(fetchedJobs);
      setReferralJobs(fetchedJobs);

      if (fetchedJobs.length > 0) {
        extractFilterOptions(fetchedJobs);
      }

      setError(null);
    } catch (error) {
      setError('Failed to load referral jobs. Please try again later.');
      console.error(error);
      setAllJobs([]);
      setReferralJobs([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReferralJobs();
  }, []);

  // ── Extract filter options from data ──────────────────────────────────────
  const extractFilterOptions = (jobsData) => {
    const degrees = new Set();
    const courses = new Set();
    const employmentTypes = new Set();
    const workModes = new Set();

    jobsData.forEach(job => {
      if (Array.isArray(job.degree)) {
        job.degree.forEach(deg => { if (typeof deg === 'string') degrees.add(deg.trim()); });
      }
      if (Array.isArray(job.studentStreams)) {
        job.studentStreams.forEach(stream => {
          if (typeof stream === 'string' && stream !== 'All Streams') courses.add(stream.trim());
        });
      }
      if (Array.isArray(job.workMode)) {
        job.workMode.forEach(mode => { if (typeof mode === 'string') workModes.add(mode.trim()); });
      }
      if (Array.isArray(job.employmentType)) {
        job.employmentType.forEach(type => { if (typeof type === 'string') employmentTypes.add(type.trim()); });
      } else if (typeof job.employmentType === 'string') {
        employmentTypes.add(job.employmentType.trim());
      }
    });

    setFilterOptions(prev => ({
      ...prev,
      degree: degrees.size > 0 ? Array.from(degrees).map(label => ({ label })) : prev.degree,
      courses: courses.size > 0 ? Array.from(courses).map(label => ({ label })) : prev.courses,
      workMode: workModes.size > 0 ? Array.from(workModes).map(label => ({ label })) : prev.workMode,
      employmentType: employmentTypes.size > 0 ? Array.from(employmentTypes).map(label => ({ label })) : prev.employmentType,
    }));
  };

  // ── Filter + Sort ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (!Array.isArray(allJobs)) { setFilteredJobs([]); return; }

    let result = [...allJobs];

    if (selectedJobId) {
      result = result.filter(job => (job._id || job.id) !== selectedJobId);
    }

    if (filters.degree.length > 0) {
      result = result.filter(job =>
        Array.isArray(job.degree) &&
        filters.degree.some(sel => job.degree.some(d => d.toLowerCase() === sel.toLowerCase()))
      );
    }

    if (filters.courses.length > 0) {
      result = result.filter(job =>
        Array.isArray(job.studentStreams) &&
        filters.courses.some(sel => job.studentStreams.some(s => s.toLowerCase() === sel.toLowerCase()))
      );
    }

    if (filters.employmentType.length > 0) {
      result = result.filter(job => {
        if (Array.isArray(job.employmentType)) {
          return filters.employmentType.some(type =>
            job.employmentType.some(e => e.toLowerCase() === type.toLowerCase())
          );
        }
        return filters.employmentType.includes(job.employmentType);
      });
    }

    if (Array.isArray(filters.location) && filters.location.length > 0) {
      result = result.filter(job =>
        Array.isArray(job.location) &&
        filters.location.some(fl => job.location.some(l => l.toLowerCase() === fl.toLowerCase()))
      );
    }

    if (filters.workMode.length > 0) {
      result = result.filter(job =>
        Array.isArray(job.workMode) &&
        filters.workMode.some(sel => job.workMode.some(m => m.toLowerCase() === sel.toLowerCase()))
      );
    }

    if (filters.internship) result = result.filter(job => job.jobType === 'Internship');
    if (filters.fullTime) result = result.filter(job => job.jobType === 'Full-time');

    if (sortBy === 'newest') result.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    else if (sortBy === 'oldest') result.sort((a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0));
    else if (sortBy === 'company') result.sort((a, b) => (a.companyName || '').localeCompare(b.companyName || ''));
    else if (sortBy === 'salary') result.sort((a, b) => (b.salaryRange?.max || 0) - (a.salaryRange?.max || 0));

    setFilteredJobs(result);
  }, [filters, allJobs, sortBy, selectedJobId]);

  // ── Handlers ───────────────────────────────────────────────────────────────
  const handleFilterChange = (filterType, value) => {
    setFilters(prev => {
      if (Array.isArray(prev[filterType])) {
        return {
          ...prev,
          [filterType]: prev[filterType].includes(value)
            ? prev[filterType].filter(item => item !== value)
            : [...prev[filterType], value]
        };
      }
      return { ...prev, [filterType]: value };
    });
  };

  const removeFilter = (filterType, value) => {
    if (Array.isArray(filters[filterType])) {
      setFilters(prev => ({ ...prev, [filterType]: prev[filterType].filter(item => item !== value) }));
    } else if (filterType === 'internship' || filterType === 'fullTime') {
      setFilters(prev => ({ ...prev, [filterType]: false }));
    } else {
      setFilters(prev => ({ ...prev, [filterType]: '' }));
    }
  };

  const clearFilterSection = (filterType) => {
    setFilters(prev => ({ ...prev, [filterType]: [] }));
  };

  const clearAllFilters = () => {
    setFilters({ workMode: [], degree: [], courses: [], location: [], company: '', employmentType: [], internship: false, fullTime: false });
    setShowMainFilter(false);
    setOpenSubDropdowns({ workMode: false, degree: false, courses: false, employmentType: false, location: false, company: false });
  };

  const handleLocationMultiChange = (selectedOptions) => {
    setFilters(prev => ({ ...prev, location: selectedOptions ? selectedOptions.map(o => o.value) : [] }));
  };

  const toggleSubDropdown = (dropdown) => {
    setOpenSubDropdowns(prev => ({ ...prev, [dropdown]: !prev[dropdown] }));
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    Object.entries(filters).forEach(([key, value]) => {
      if (key === 'internship' || key === 'fullTime') { if (value) count++; }
      else if (Array.isArray(value)) { count += value.length; }
      else if (value && value !== '' && value !== 'Multi - Select') { count += 1; }
    });
    return count;
  };

  {/*const handleJobSelect = (job) => {
    setSelectedJob(job);
    setIsModalOpen(true);
    if (onJobSelect && typeof onJobSelect === 'function') onJobSelect(job);
  };*/}
  console.log("filteredjobs", filteredJobs);

  // ── Loading ────────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#143694]/10 via-[#f093fb]/5 to-[#1e4ed8]/10 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#143694] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading referral jobs...</p>
        </div>
      </div>
    );
  }

  // ── Error ──────────────────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#143694]/10 via-[#f093fb]/5 to-[#1e4ed8]/10 flex items-center justify-center">
        <div className="bg-white/90 backdrop-blur-sm border border-white/50 rounded-2xl shadow-lg shadow-purple-50/50 p-8 max-w-md text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#fca5a5]/30 to-[#ef4444]/20 rounded-full mb-4">
            <AlertCircle className="w-8 h-8 text-[#ef4444]" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{error}</h3>
          <button
            onClick={fetchReferralJobs}
            className="mt-4 px-6 py-3 bg-gradient-to-r from-[#143694] to-[#1e4ed8] text-white rounded-xl hover:shadow-lg hover:shadow-[#143694]/40 transition-all duration-200"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // ── Compact view (sidebar) ─────────────────────────────────────────────────
  if (compact) {
  return (
    <div className="p-3 space-y-4">
      {filteredJobs.map(job => (
        <div key={job._id} className="cursor-pointer">
          <JobCard
            job={job}
            onClick={(job) => {
              console.log('🟢 ReferralJobs passing job up:', job._id);
              onJobSelect?.(job);
            }}
          />
        </div>
      ))}
    </div>
  );
}

  // ── Full view ──────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#143694]/10 via-[#f093fb]/5 to-[#1e4ed8]/10">
      {/* Background blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#143694]/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 -left-20 w-60 h-60 bg-[#f093fb]/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-1/3 w-40 h-40 bg-[#1e4ed8]/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/4 right-1/4 w-48 h-48 bg-[#a5b4fc]/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/3 left-1/4 w-56 h-56 bg-[#fde68a]/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 pt-20">

        {/* Header */}
        <div className="mb-8 -mt-10">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-white/80 to-white/60 backdrop-blur-sm rounded-2xl"></div>
            <div className="relative flex flex-col lg:flex-row lg:items-center justify-between py-6 px-6 gap-4">
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-[#143694] to-[#1e4ed8] bg-clip-text text-transparent">
                  Referral Jobs
                </h1>
                <p className="text-gray-600 mt-2">
                  Referral jobs based on your profile and skills
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Active filter tags */}
        {getActiveFiltersCount() > 0 && (
          <div className="bg-white/90 backdrop-blur-sm border border-white/50 rounded-2xl shadow-lg shadow-purple-50/50 p-4 mb-4">
            <div className="flex items-center flex-wrap gap-2">
              <span className="text-sm font-medium text-gray-700 mr-2">Active filters:</span>

              {filters.workMode.map(mode => (
                <span key={mode} className="inline-flex items-center bg-gradient-to-r from-[#a5b4fc]/20 to-[#143694]/10 text-[#143694] px-3 py-1.5 rounded-lg text-sm backdrop-blur-sm">
                  {mode}
                  <button onClick={() => removeFilter('workMode', mode)} className="ml-2 text-[#143694] hover:text-[#5b21b6]"><X className="h-3 w-3" /></button>
                </span>
              ))}

              {filters.degree.map(degree => (
                <span key={degree} className="inline-flex items-center bg-gradient-to-r from-[#f9a8d4]/20 to-[#ec4899]/10 text-[#ec4899] px-3 py-1.5 rounded-lg text-sm backdrop-blur-sm">
                  {degree}
                  <button onClick={() => removeFilter('degree', degree)} className="ml-2 text-[#ec4899] hover:text-[#be185d]"><X className="h-3 w-3" /></button>
                </span>
              ))}

              {filters.courses.map(course => (
                <span key={course} className="inline-flex items-center bg-gradient-to-r from-[#fde68a]/20 to-[#f59e0b]/10 text-[#f59e0b] px-3 py-1.5 rounded-lg text-sm backdrop-blur-sm">
                  {course}
                  <button onClick={() => removeFilter('courses', course)} className="ml-2 text-[#f59e0b] hover:text-[#d97706]"><X className="h-3 w-3" /></button>
                </span>
              ))}

              {filters.employmentType.map(type => (
                <span key={type} className="inline-flex items-center bg-gradient-to-r from-[#a7f3d0]/20 to-[#10b981]/10 text-[#10b981] px-3 py-1.5 rounded-lg text-sm backdrop-blur-sm">
                  {type}
                  <button onClick={() => removeFilter('employmentType', type)} className="ml-2 text-[#10b981] hover:text-[#059669]"><X className="h-3 w-3" /></button>
                </span>
              ))}

              {Array.isArray(filters.location) && filters.location.map(loc => (
                <span key={loc} className="inline-flex items-center bg-gradient-to-r from-red-100 to-red-50 text-red-700 px-3 py-1.5 rounded-lg text-sm">
                  Location: {loc}
                  <button onClick={() => removeFilter('location', loc)} className="ml-2 text-red-600 hover:text-red-800"><X className="h-3 w-3" /></button>
                </span>
              ))}

              {filters.internship && (
                <span className="inline-flex items-center bg-gradient-to-r from-[#fbcfe8]/20 to-[#f472b6]/10 text-[#f472b6] px-3 py-1.5 rounded-lg text-sm backdrop-blur-sm">
                  Internship
                  <button onClick={() => removeFilter('internship', true)} className="ml-2 text-[#f472b6] hover:text-[#db2777]"><X className="h-3 w-3" /></button>
                </span>
              )}

              {filters.fullTime && (
                <span className="inline-flex items-center bg-gradient-to-r from-[#a7f3d0]/20 to-[#10b981]/10 text-[#10b981] px-3 py-1.5 rounded-lg text-sm backdrop-blur-sm">
                  Full-time
                  <button onClick={() => removeFilter('fullTime', true)} className="ml-2 text-[#10b981] hover:text-[#059669]"><X className="h-3 w-3" /></button>
                </span>
              )}
            </div>
          </div>
        )}

        {/* Filter bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <button
                onClick={() => setShowMainFilter(!showMainFilter)}
                className={`flex items-center gap-2 px-5 py-3 bg-white/90 backdrop-blur-sm border ${showMainFilter ? 'border-[#a5b4fc] ring-2 ring-[#a5b4fc]/10' : 'border-white/50 hover:border-[#a5b4fc]/50'} rounded-xl transition-all duration-200 shadow-sm hover:shadow-md`}
              >
                <Filter className="h-4 w-4 text-[#143694]" />
                <span className="text-sm font-medium text-gray-700">Filter</span>
                {getActiveFiltersCount() > 0 && (
                  <span className="px-2 py-0.5 bg-gradient-to-r from-[#a5b4fc] to-[#143694] text-white text-xs rounded-full">
                    {getActiveFiltersCount()}
                  </span>
                )}
                <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform duration-200 ${showMainFilter ? 'transform rotate-180' : ''}`} />
              </button>
            </div>

            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="flex items-center gap-2 px-5 py-3 bg-white/90 backdrop-blur-sm border border-white/50 rounded-xl hover:border-[#a5b4fc]/50 transition-all duration-200 appearance-none pr-10 text-sm font-medium text-gray-700 shadow-sm hover:shadow-md"
              >
                <option value="newest">Sort: Newest First</option>
                <option value="oldest">Sort: Oldest First</option>
                <option value="company">Sort: Company Name (A-Z)</option>
                <option value="salary">Sort: Highest Salary</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          <button
            onClick={clearAllFilters}
            disabled={getActiveFiltersCount() === 0}
            className="flex items-center gap-2 px-5 py-3 bg-white/90 backdrop-blur-sm border border-white/50 text-gray-600 hover:text-gray-900 hover:border-gray-300 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md text-sm font-medium"
          >
            <RefreshCw className="h-4 w-4" />
            Clear all filters
          </button>
        </div>

        {/* Filter panel */}
        {showMainFilter && (
          <div className="mt-4 bg-white/90 backdrop-blur-sm border border-white/50 rounded-2xl shadow-lg shadow-purple-50/50 relative p-6 z-50">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative">

              {/* Work Mode */}
              <div className="relative">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <Briefcase className="h-4 w-4 text-[#143694] mr-2" />
                    <span className="text-sm font-medium text-gray-700">Work Mode</span>
                    {filters.workMode.length > 0 && (
                      <span className="ml-2 px-2 py-0.5 bg-gradient-to-r from-[#a5b4fc] to-[#143694] text-white text-xs rounded-full">{filters.workMode.length}</span>
                    )}
                  </div>
                  {filters.workMode.length > 0 && (
                    <button onClick={() => clearFilterSection('workMode')} className="text-xs text-[#143694] hover:text-[#5b21b6] font-medium">Clear</button>
                  )}
                </div>
                <button
                  onClick={() => toggleSubDropdown('workMode')}
                  className="flex items-center justify-between w-full p-3 bg-gradient-to-r from-white/50 to-white/30 border border-white/50 rounded-xl hover:border-[#a5b4fc]/50 transition-all duration-200 mb-2 backdrop-blur-sm"
                >
                  <span className="text-sm text-gray-700">Select Work Mode</span>
                  <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform duration-200 ${openSubDropdowns.workMode ? 'transform rotate-180' : ''}`} />
                </button>
                {openSubDropdowns.workMode && (
                  <div className="mt-2 p-3 bg-white/50 backdrop-blur-sm rounded-lg border border-white/50 max-h-60 overflow-y-auto">
                    <div className="space-y-2">
                      {filterOptions.workMode.map((option, index) => (
                        <div key={option.label + index} className="flex items-center p-2 hover:bg-white/30 rounded transition-all duration-200">
                          <input
                            type="checkbox"
                            id={`workMode-${option.label}-${index}`}
                            checked={filters.workMode.includes(option.label)}
                            onChange={() => handleFilterChange('workMode', option.label)}
                            className="h-4 w-4 text-[#143694] focus:ring-[#a5b4fc]/50 border-gray-300 rounded"
                          />
                          <label htmlFor={`workMode-${option.label}-${index}`} className="ml-3 text-sm text-gray-700 cursor-pointer flex-1">
                            {option.label}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Degree */}
              <div className="relative">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <GraduationCap className="h-4 w-4 text-[#ec4899] mr-2" />
                    <span className="text-sm font-medium text-gray-700">Degree</span>
                    {filters.degree.length > 0 && (
                      <span className="ml-2 px-2 py-0.5 bg-[#ec4899] text-white text-xs rounded-full">{filters.degree.length}</span>
                    )}
                  </div>
                  {filters.degree.length > 0 && (
                    <button onClick={() => clearFilterSection('degree')} className="text-xs text-[#ec4899] hover:text-[#be185d] font-medium">Clear</button>
                  )}
                </div>
                <button
                  onClick={() => toggleSubDropdown('degree')}
                  className="flex items-center justify-between w-full p-3 bg-gradient-to-r from-white/50 to-white/30 border border-white/50 rounded-xl hover:border-[#f9a8d4]/50 transition-all duration-200 mb-2 backdrop-blur-sm"
                >
                  <span className="text-sm text-gray-700">Select Degree</span>
                  <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform duration-200 ${openSubDropdowns.degree ? 'transform rotate-180' : ''}`} />
                </button>
                {openSubDropdowns.degree && (
                  <div className="absolute z-[100] w-full mt-2 p-3 bg-white backdrop-blur-sm rounded-lg border border-white/50 max-h-60 overflow-y-auto">
                    <div className="space-y-2">
                      {filterOptions.degree.map((option, index) => (
                        <div key={option.label + index} className="flex items-center p-2 hover:bg-white/30 rounded transition-all duration-200">
                          <input
                            type="checkbox"
                            id={`degree-${option.label}-${index}`}
                            checked={filters.degree.includes(option.label)}
                            onChange={() => handleFilterChange('degree', option.label)}
                            className="h-4 w-4 text-[#ec4899] focus:ring-[#f9a8d4]/50 border-gray-300 rounded"
                          />
                          <label htmlFor={`degree-${option.label}-${index}`} className="ml-3 text-sm text-gray-700 cursor-pointer flex-1">
                            {option.label}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Courses */}
              <div className="relative">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <BookOpen className="h-4 w-4 text-[#f59e0b] mr-2" />
                    <span className="text-sm font-medium text-gray-700">Courses</span>
                    {filters.courses.length > 0 && (
                      <span className="ml-2 px-2 py-0.5 bg-[#f59e0b] text-white text-xs rounded-full">{filters.courses.length}</span>
                    )}
                  </div>
                  {filters.courses.length > 0 && (
                    <button onClick={() => clearFilterSection('courses')} className="text-xs text-[#f59e0b] hover:text-[#d97706] font-medium">Clear</button>
                  )}
                </div>
                <button
                  onClick={() => toggleSubDropdown('courses')}
                  className="flex items-center justify-between w-full p-3 bg-gradient-to-r from-white/50 to-white/30 border border-white/50 rounded-xl hover:border-[#fde68a]/50 transition-all duration-200 mb-2 backdrop-blur-sm"
                >
                  <span className="text-sm text-gray-700">Select Courses</span>
                  <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform duration-200 ${openSubDropdowns.courses ? 'transform rotate-180' : ''}`} />
                </button>
                {openSubDropdowns.courses && (
                  <div className="absolute z-[100] w-full mt-2 p-3 bg-white backdrop-blur-sm rounded-lg border border-white/50 max-h-60 overflow-y-auto">
                    <div className="space-y-2">
                      {filterOptions.courses.map((option, index) => (
                        <div key={option.label + index} className="flex items-center p-2 hover:bg-white/30 rounded transition-all duration-200">
                          <input
                            type="checkbox"
                            id={`course-${option.label}-${index}`}
                            checked={filters.courses.includes(option.label)}
                            onChange={() => handleFilterChange('courses', option.label)}
                            className="h-4 w-4 text-[#f59e0b] focus:ring-[#fde68a]/50 border-gray-300 rounded"
                          />
                          <label htmlFor={`course-${option.label}-${index}`} className="ml-3 text-sm text-gray-700 cursor-pointer flex-1">
                            {option.label}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Employment Type */}
              <div className="relative">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <Briefcase className="h-4 w-4 text-[#10b981] mr-2" />
                    <span className="text-sm font-medium text-gray-700">Employment Type</span>
                    {filters.employmentType.length > 0 && (
                      <span className="ml-2 px-2 py-0.5 bg-[#10b981] text-white text-xs rounded-full">{filters.employmentType.length}</span>
                    )}
                  </div>
                  {filters.employmentType.length > 0 && (
                    <button onClick={() => clearFilterSection('employmentType')} className="text-xs text-[#10b981] hover:text-[#059669] font-medium">Clear</button>
                  )}
                </div>
                <button
                  onClick={() => toggleSubDropdown('employmentType')}
                  className="flex items-center justify-between w-full p-3 bg-gradient-to-r from-white/50 to-white/30 border border-white/50 rounded-xl hover:border-[#a7f3d0]/50 transition-all duration-200 mb-2 backdrop-blur-sm"
                >
                  <span className="text-sm text-gray-700">Select Employment Type</span>
                  <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform duration-200 ${openSubDropdowns.employmentType ? 'transform rotate-180' : ''}`} />
                </button>
                {openSubDropdowns.employmentType && (
                  <div className="mt-2 p-3 bg-white/50 backdrop-blur-sm rounded-lg border border-white/50 max-h-60 overflow-y-auto">
                    <div className="space-y-2">
                      {filterOptions.employmentType.map((option, index) => (
                        <div key={option.label + index} className="flex items-center p-2 hover:bg-white/30 rounded transition-all duration-200">
                          <input
                            type="checkbox"
                            id={`employmentType-${option.label}-${index}`}
                            checked={filters.employmentType.includes(option.label)}
                            onChange={() => handleFilterChange('employmentType', option.label)}
                            className="h-4 w-4 text-[#10b981] focus:ring-[#a7f3d0]/50 border-gray-300 rounded"
                          />
                          <label htmlFor={`employmentType-${option.label}-${index}`} className="ml-3 text-sm text-gray-700 cursor-pointer flex-1">
                            {option.label}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Location */}
              <div className="relative">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 text-[#818cf8] mr-2" />
                    <span className="text-sm font-medium text-gray-700">Location</span>
                    {Array.isArray(filters.location) && filters.location.length > 0 && (
                      <span className="ml-2 px-2 py-0.5 bg-[#818cf8] text-white text-xs rounded-full">{filters.location.length}</span>
                    )}
                  </div>
                  {Array.isArray(filters.location) && filters.location.length > 0 && (
                    <button onClick={() => handleFilterChange('location', [])} className="text-xs text-[#143694] hover:text-[#1e4ed8]">Clear</button>
                  )}
                </div>
                <button
                  onClick={() => toggleSubDropdown('location')}
                  className="flex items-center justify-between w-full p-3 bg-gradient-to-r from-white/50 to-white/30 border border-white/50 rounded-xl hover:border-[#c7d2fe]/50 transition-all duration-200 mb-2 backdrop-blur-sm"
                >
                  <span className="text-sm text-gray-700">Select Location</span>
                  <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform duration-200 ${openSubDropdowns.location ? 'transform rotate-180' : ''}`} />
                </button>
                {openSubDropdowns.location && (
                  <div className="absolute z-[100] w-full mt-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <CreatableSelect
                      isMulti
                      options={cityOptions}
                      value={safeLocation.map(loc => ({ value: loc, label: loc }))}
                      onChange={handleLocationMultiChange}
                      placeholder="Select or type locations..."
                      menuPortalTarget={document.body}
                      menuPosition="fixed"
                      styles={{
                        control: (base) => ({ ...base, borderColor: '#e5e7eb', minHeight: '38px', fontSize: '14px', borderRadius: '0.75rem', backgroundColor: 'rgb(249 250 251)', }),
                        menu: (base) => ({ ...base, borderRadius: '0.5rem', fontSize: '14px', border: '1px solid #e5e7eb' }),
                        menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                        multiValue: (base) => ({ ...base, fontSize: '12px', backgroundColor: '#f3f4f6', borderRadius: '9999px' }),
                        multiValueRemove: (base) => ({ ...base, fontSize: '12px', color: '#6b7280', ':hover': { backgroundColor: '#e5e7eb', color: '#374151' } }),
                      }}
                    />
                  </div>
                )}
              </div>

            </div>
          </div>
        )}
        

        {/* Job Cards Grid */}
        <div className="bg-white/90 backdrop-blur-sm border border-white/50 rounded-2xl shadow-lg shadow-purple-50/50 p-6 min-h-[600px]">
          {filteredJobs.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                
                {filteredJobs.map(job => (
                  <div key={job._id} className="h-full flex">
                    <JobCard
                      job={job}
                      onClick={(job) => {
                        console.log('🟢 Full view passing job up:', job._id);
                        onJobSelect?.(job);
                      }}
                    />
                  </div>
                ))}
              </div>
              <div className="mt-10 text-center">
                <button className="px-8 py-3.5 bg-gradient-to-r from-[#143694] to-[#1e4ed8] text-white rounded-xl hover:shadow-lg hover:shadow-[#143694]/40 transition-all duration-200 text-base font-medium">
                  View All Opportunities
                </button>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-[#fde68a]/30 to-[#f59e0b]/20 mb-6">
                <Building className="h-12 w-12 text-[#f59e0b]" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">No Referral Jobs Found</h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto text-lg">
                No referral jobs match your current filter criteria. Try adjusting your filters to find more options.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <button
                  onClick={clearAllFilters}
                  className="px-8 py-3.5 bg-gradient-to-r from-[#143694] to-[#1e4ed8] text-white rounded-xl hover:shadow-lg hover:shadow-[#143694]/40 transition-all duration-200 text-base font-medium"
                >
                  Reset All Filters
                </button>
                <button
                  onClick={fetchReferralJobs}
                  className="px-8 py-3.5 bg-white/90 backdrop-blur-sm border border-white/50 text-gray-700 rounded-xl hover:shadow-lg hover:shadow-gray-100/40 transition-all duration-200 text-base font-medium"
                >
                  Refresh Page
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default ReferralJobs;