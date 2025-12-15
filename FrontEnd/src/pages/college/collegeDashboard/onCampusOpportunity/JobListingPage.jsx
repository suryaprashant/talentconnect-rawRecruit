import React, { useState, useEffect } from 'react';
import JobCard from '@/components/college/collegeDashboard/onCampusOpprtunity/JobCard';
import FilterSection from '@/components/college/collegeDashboard/FilterSection';
import { getCompanyPostingForOncampus } from '@/lib/College_AxiosIntance';
import { Filter, ChevronDown, Search, Briefcase, Calendar, Users, MapPin, TrendingUp, RefreshCw, AlertCircle, X, ChevronRight, Building } from 'lucide-react';

const JobsListingPage = () => {
  const [jobPosted, setjobPosted] = useState([]);
  const [filteredjobPosted, setFilteredjobPosted] = useState([]);
  const [filters, setFilters] = useState({
    workMode: [],
    degree: [],
    courses: [],
    employmentType: [],
    location: '',
    college: '',
  });
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFilters, setExpandedFilters] = useState({
    workMode: true,
    degree: false,
    courses: false,
    employmentType: false,
    location: false,
    college: false,
  });

  // Mock filter options (replace with your actual data)
  const filterOptions = {
    workMode: [
      { label: 'Work from office', count: 28692 },
      { label: 'Hybrid', count: 756 },
      { label: 'Remote', count: 709 }
    ],
    degree: [
      'Polytechnic',
      'ITI',
      'Diploma',
      'Undergraduate',
      'Postgraduate'
    ],
    courses: [
      'Engineering',
      'Pharmacy',
      'Mechanical Engineering',
      'Civil Engineering',
      'Electrical',
      'Fitter',
      'Welding',
      'Electronics',
      'B.Tech',
      'BBA',
      'BSc',
      'BCA',
      'BE',
      'BA',
      'BBM',
      'PUC Humanities Combinations',
      'PUC Commerce Combinations',
      'B.Pharma',
      'D.Pharma',
      'M.Tech',
      'MBA',
      'MA',
      'MCA',
      'ME',
      'MSc',
      'MCom',
      'M.Pharma'
    ],
    employmentType: [
      'Full-time',
      'Part-time',
      'Contract'
    ]
  };

  useEffect(() => {
    const getjobPosted = async () => {
      try {
        setIsLoading(true);
        const response = await getCompanyPostingForOncampus();
        console.log(response.data?.data || []);

        const fetchedjobPosted = response.data?.data || [];
        setjobPosted(fetchedjobPosted);
        setFilteredjobPosted(fetchedjobPosted);
      } catch (err) {
        setError('Failed to load job postings. Please try again later.');
        console.error('Error fetching job postings: ', err);
        setjobPosted([]);
        setFilteredjobPosted([]);
      } finally {
        setIsLoading(false);
      }
    };

    getjobPosted();
  }, []);

  useEffect(() => {
    if (!Array.isArray(jobPosted)) {
      setFilteredjobPosted([]);
      return;
    }

    let result = [...jobPosted];
    
    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(job =>
        job.companyName?.toLowerCase().includes(query) ||
        job.title?.toLowerCase().includes(query) ||
        job.description?.toLowerCase().includes(query)
      );
    }

    // Apply work mode filters
    if (filters.workMode.length > 0) {
      result = result.filter(workmode =>
        workmode.workModes && filters.workMode.some(mode => workmode.workModes.includes(mode))
      );
    }

    // Apply degree filters
    if (filters.courses && filters.courses.length > 0) {
      result = result.filter(college => {
        const degreeList = Array.isArray(college.degree)
          ? college.degree
          : college.degree
            ? [college.degree]
            : [];

        return filters.courses.some(course => {
          const normalizedCourse = course?.toLowerCase().replace(/[\s.\-]/g, "").trim();

          return degreeList.some(c => {
            const normalizedC = c?.toLowerCase().replace(/[\s.\-]/g, "").trim();
            return normalizedC === normalizedCourse;
          });
        });
      });
    }

    // Apply course filters
    if (filters.courses && filters.courses.length > 0) {
      result = result.filter(college => {
        const degreeList = Array.isArray(college.degree)
          ? college.degree
          : college.degree
            ? [college.degree]
            : [];

        return filters.courses.some(course => {
          const normalizedCourse = course?.toLowerCase().replace(/[\s.\-]/g, "").trim();

          return degreeList.some(c => {
            const normalizedC = c?.toLowerCase().replace(/[\s.\-]/g, "").trim();
            return normalizedC === normalizedCourse;
          });
        });
      });
    }

    // Apply employment type filter
    if (filters.employmentType && filters.employmentType.length > 0) {
      result = result.filter(emp =>
        emp.employmentType && Array.isArray(emp.employmentType) &&
        filters.employmentType.some(filterValue =>
          emp.employmentType.some(empType =>
            empType.toLowerCase() === filterValue.toLowerCase()
          )
        )
      );
    }

    // Apply location filter
    if (filters.location && filters.location !== 'Multi - Select') {
      result = result.filter(jobloc => {
        return Array.isArray(jobloc.location) &&
          jobloc.location.some(loc => loc.toLowerCase() === filters.location.toLowerCase());
      });
    }

    // Apply college name filter
    if (filters.college && filters.college !== 'Multi - Select') {
      result = result.filter(name => {
        const collegeName = name.collegePosted?.collegeUniversityDetails?.collegeName;
        return collegeName
          ? collegeName.toLowerCase().includes(filters.college.toLowerCase())
          : false;
      });
    }

    setFilteredjobPosted(result);
  }, [filters, jobPosted, searchQuery]);

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => {
      if (Array.isArray(prev[filterType])) {
        if (prev[filterType].includes(value)) {
          return {
            ...prev,
            [filterType]: prev[filterType].filter(item => item !== value)
          };
        } else {
          return {
            ...prev,
            [filterType]: [...prev[filterType], value]
          };
        }
      } else {
        return {
          ...prev,
          [filterType]: value
        };
      }
    });
  };

  const toggleFilterSection = (filterType) => {
    setExpandedFilters(prev => ({
      ...prev,
      [filterType]: !prev[filterType]
    }));
  };

  const clearFilter = (filterType) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: Array.isArray(prev[filterType]) ? [] : ''
    }));
  };

  const clearAllFilters = () => {
    setFilters({
      workMode: [],
      degree: [],
      courses: [],
      location: '',
      college: '',
      employmentType: [],
    });
    setSearchQuery('');
  };

  // Custom filter sections
  const renderFilterSection = (title, filterKey, options, withCounts = false) => {
    const isExpanded = expandedFilters[filterKey];
    const hasActiveFilters = Array.isArray(filters[filterKey]) 
      ? filters[filterKey].length > 0 
      : filters[filterKey];

    return (
      <div className="mb-6 last:mb-0">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => toggleFilterSection(filterKey)}
            className="flex items-center justify-between w-full text-left group"
          >
            <div className="flex items-center gap-3">
              <span className="text-base font-semibold text-gray-900 group-hover:text-[#3b82f6] transition-colors duration-200">
                {title}
              </span>
              {hasActiveFilters && (
                <span className="text-xs bg-[#3b82f6] text-white px-2 py-0.5 rounded-full">
                  {Array.isArray(filters[filterKey]) ? filters[filterKey].length : 1}
                </span>
              )}
            </div>
            <div className="flex items-center gap-3">
              {hasActiveFilters && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    clearFilter(filterKey);
                  }}
                  className="text-sm text-[#3b82f6] hover:text-[#1d4ed8] font-medium transition-colors duration-200"
                >
                  Clear
                </button>
              )}
              <ChevronRight className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`} />
            </div>
          </button>
        </div>
        
        {isExpanded && (
          <div className="space-y-3 pl-1">
            {options.map((option, index) => {
              const label = typeof option === 'string' ? option : option.label;
              const count = typeof option === 'object' ? option.count : null;
              const isSelected = Array.isArray(filters[filterKey]) 
                ? filters[filterKey].includes(label)
                : filters[filterKey] === label;

              return (
                <div key={index} className="flex items-center justify-between group">
                  <button
                    onClick={() => handleFilterChange(filterKey, label)}
                    className="flex items-center gap-3 py-2 hover:text-[#3b82f6] transition-all duration-200 w-full text-left"
                  >
                    <div className={`w-5 h-5 rounded border flex items-center justify-center flex-shrink-0 ${isSelected ? 'bg-[#3b82f6] border-[#3b82f6]' : 'border-gray-300 group-hover:border-[#93c5fd]'}`}>
                      {isSelected && (
                        <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    <span className={`text-sm ${isSelected ? 'text-[#3b82f6] font-medium' : 'text-gray-700'} truncate`}>
                      {label}
                    </span>
                  </button>
                  {count !== null && (
                    <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-lg flex-shrink-0">
                      {count.toLocaleString()}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f0e6f7]/60 via-[#d4e8f9]/55 to-[#cff7ea]/60 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#93c5fd] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading job opportunities...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f0e6f7]/60 via-[#d4e8f9]/55 to-[#cff7ea]/60 flex items-center justify-center">
        <div className="bg-white/90 backdrop-blur-sm border border-white/50 rounded-2xl shadow-lg shadow-blue-50/50 p-8 max-w-md text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#fca5a5]/30 to-[#ef4444]/20 rounded-full mb-4">
            <AlertCircle className="w-8 h-8 text-[#ef4444]" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{error}</h3>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-6 py-3 bg-gradient-to-r from-[#93c5fd] to-[#3b82f6] text-white rounded-xl hover:shadow-lg hover:shadow-[#93c5fd]/40 transition-all duration-200"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0e6f7]/60 via-[#d4e8f9]/55 to-[#cff7ea]/60">
      {/* Pastel blur background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#fbcfe8]/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 -left-20 w-60 h-60 bg-[#93c5fd]/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-1/3 w-40 h-40 bg-[#a7f3d0]/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/4 right-1/4 w-48 h-48 bg-[#c7d2fe]/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/3 left-1/4 w-56 h-56 bg-[#fde68a]/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 pt-20">
        {/* Header Section */}
        <div className="mb-8 -mt-10">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-white/80 to-white/60 backdrop-blur-sm rounded-2xl"></div>
            <div className="relative flex flex-col lg:flex-row lg:items-center justify-between py-6 px-6 gap-4">
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-[#3b82f6] to-[#8b5cf6] bg-clip-text text-transparent">
                  On-Campus Opportunities
                </h1>
                <p className="text-gray-600 mt-2">
                  Explore companies posting for on-campus opportunities at your college
                </p>
              </div>
              <div className="w-full lg:w-96">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search companies, positions, keywords..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white/90 backdrop-blur-sm border border-white/50 rounded-xl focus:ring-2 focus:ring-[#93c5fd] focus:border-transparent focus:outline-none shadow-sm"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white/90 backdrop-blur-sm border border-white/50 rounded-xl shadow-lg shadow-blue-100/50 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Opportunities</p>
                <p className="text-2xl font-bold text-[#3b82f6]">{jobPosted.length}</p>
              </div>
              <div className="p-2 bg-gradient-to-br from-[#93c5fd]/30 to-[#3b82f6]/20 rounded-lg">
                <Briefcase className="w-5 h-5 text-[#3b82f6]" />
              </div>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-sm border border-white/50 rounded-xl shadow-lg shadow-pink-100/50 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Showing Results</p>
                <p className="text-2xl font-bold text-[#ec4899]">{filteredjobPosted.length}</p>
              </div>
              <div className="p-2 bg-gradient-to-br from-[#f9a8d4]/30 to-[#ec4899]/20 rounded-lg">
                <Filter className="w-5 h-5 text-[#ec4899]" />
              </div>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-sm border border-white/50 rounded-xl shadow-lg shadow-amber-100/50 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Filters</p>
                <p className="text-2xl font-bold text-[#f59e0b]">
                  {Object.values(filters).filter(f => Array.isArray(f) ? f.length > 0 : f).length}
                </p>
              </div>
              <div className="p-2 bg-gradient-to-br from-[#fde68a]/30 to-[#f59e0b]/20 rounded-lg">
                <TrendingUp className="w-5 h-5 text-[#f59e0b]" />
              </div>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-sm border border-white/50 rounded-xl shadow-lg shadow-emerald-100/50 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Last Updated</p>
                <p className="text-2xl font-bold text-[#10b981]">Today</p>
              </div>
              <div className="p-2 bg-gradient-to-br from-[#a7f3d0]/30 to-[#10b981]/20 rounded-lg">
                <Calendar className="w-5 h-5 text-[#10b981]" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filter Sidebar */}
          <div className="w-full lg:w-96 flex-shrink-0">
            <div className="bg-white/90 backdrop-blur-sm border border-white/50 rounded-2xl shadow-lg shadow-blue-50/50 p-6 sticky top-6">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#93c5fd]/30 to-[#3b82f6]/20 rounded-xl flex items-center justify-center">
                    <Filter className="w-5 h-5 text-[#3b82f6]" />
                  </div>
                  <span>Filters</span>
                </h2>
                <button
                  onClick={clearAllFilters}
                  className="text-base text-[#3b82f6] hover:text-[#1d4ed8] transition-colors duration-200 flex items-center gap-2 font-medium"
                >
                  <RefreshCw className="w-4 h-4" />
                  Clear All
                </button>
              </div>
              
              {/* Custom Filter Sectionsr */}
              <div className="space-y-6">
                {renderFilterSection("Work mode", "workMode", filterOptions.workMode, true)}
                {renderFilterSection("Degree", "degree", filterOptions.degree)}
                {renderFilterSection("Courses", "courses", filterOptions.courses)}
                {renderFilterSection("Employment Type", "employmentType", filterOptions.employmentType)}
                
                {/* Location Filter */}
                <div className="mb-6 last:mb-0">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-base font-semibold text-gray-900">Location</span>
                    {filters.location && (
                      <button
                        onClick={() => clearFilter('location')}
                        className="text-sm text-[#3b82f6] hover:text-[#1d4ed8] font-medium"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                  <select
                    value={filters.location}
                    onChange={(e) => handleFilterChange('location', e.target.value)}
                    className="w-full bg-white/50 backdrop-blur-sm border border-white/50 rounded-xl py-3 px-4 text-base focus:outline-none focus:ring-2 focus:ring-[#93c5fd] focus:border-transparent"
                  >
                    <option value="">Multi - Select</option>
                  </select>
                </div>
                
                {/* College Filter */}
                <div className="mb-6 last:mb-0">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-base font-semibold text-gray-900">College</span>
                    {filters.college && (
                      <button
                        onClick={() => clearFilter('college')}
                        className="text-sm text-[#3b82f6] hover:text-[#1d4ed8] font-medium"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                  <select
                    value={filters.college}
                    onChange={(e) => handleFilterChange('college', e.target.value)}
                    className="w-full bg-white/50 backdrop-blur-sm border border-white/50 rounded-xl py-3 px-4 text-base focus:outline-none focus:ring-2 focus:ring-[#93c5fd] focus:border-transparent"
                  >
                    <option value="">Multi - Select</option>
                  </select>
                </div>
              </div>

              {/* Active Filters */}
              <div className="mt-10 pt-8 border-t border-gray-200/50">
                <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <span>Active Filters</span>
                  {Object.values(filters).some(f => Array.isArray(f) ? f.length > 0 : f) && (
                    <span className="text-xs bg-[#3b82f6] text-white px-2 py-1 rounded-full">
                      {Object.values(filters).filter(f => Array.isArray(f) ? f.length > 0 : f).length}
                    </span>
                  )}
                </h3>
                <div className="flex flex-wrap gap-3">
                  {Object.entries(filters).map(([key, value]) => {
                    if (Array.isArray(value) && value.length > 0) {
                      return value.map((item, index) => (
                        <span
                          key={`${key}-${index}`}
                          className="inline-flex items-center bg-gradient-to-r from-[#93c5fd]/20 to-[#3b82f6]/10 text-[#3b82f6] text-sm px-4 py-2 rounded-xl backdrop-blur-sm"
                        >
                          <span className="font-medium">{item}</span>
                          <button
                            onClick={() => handleFilterChange(key, item)}
                            className="ml-3 text-[#3b82f6] hover:text-[#1d4ed8]"
                          >
                            ×
                          </button>
                        </span>
                      ));
                    }
                    if (value && !Array.isArray(value)) {
                      return (
                        <span
                          key={key}
                          className="inline-flex items-center bg-gradient-to-r from-[#f9a8d4]/20 to-[#ec4899]/10 text-[#ec4899] text-sm px-4 py-2 rounded-xl backdrop-blur-sm"
                        >
                          <span className="font-medium">{value}</span>
                          <button
                            onClick={() => clearFilter(key)}
                            className="ml-3 text-[#ec4899] hover:text-[#be185d]"
                          >
                            ×
                          </button>
                        </span>
                      );
                    }
                    return null;
                  })}
                  {Object.values(filters).every(f => !f || (Array.isArray(f) && f.length === 0)) && (
                    <span className="text-sm text-gray-500 italic">No active filters</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Job Cards */}
          <div className="flex-grow">
            {/* Results Header */}
            <div className="bg-white/90 backdrop-blur-sm border border-white/50 rounded-2xl shadow-lg shadow-blue-50/50 p-6 mb-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Showing {filteredjobPosted.length} of {jobPosted.length} Opportunities
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Filtered results based on your preferences
                  </p>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="text-sm text-gray-600">
                    Sort by:
                  </div>
                  <div className="relative">
                    <select className="appearance-none bg-white/50 backdrop-blur-sm border border-white/50 rounded-xl py-2.5 pl-4 pr-10 text-base focus:outline-none focus:ring-2 focus:ring-[#93c5fd] focus:border-transparent">
                      <option>Newest First</option>
                      <option>Oldest First</option>
                      <option>Company Name (A-Z)</option>
                      <option>Highest Salary</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>

            {/* Job Cards Grid */}
            {filteredjobPosted.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredjobPosted.map(jobPosted => (
                    <div
                      key={jobPosted._id || jobPosted.id}
                      className="h-full flex"
                    >
                      <div className="w-full bg-white/90 backdrop-blur-sm border border-white/50 rounded-2xl shadow-lg shadow-blue-50/50 overflow-hidden hover:shadow-xl hover:shadow-blue-100/50 transition-all duration-300 flex flex-col h-full">
                        <JobCard job={jobPosted} />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Load More Button */}
                <div className="mt-10 text-center">
                  <button className="px-8 py-3.5 bg-gradient-to-r from-[#93c5fd] to-[#3b82f6] text-white rounded-xl hover:shadow-lg hover:shadow-[#93c5fd]/40 transition-all duration-200 text-base font-medium">
                    View All Opportunities
                  </button>
                </div>
              </>
            ) : (
              <div className="bg-white/90 backdrop-blur-sm border border-white/50 rounded-2xl shadow-lg shadow-blue-50/50 p-12 text-center">
                <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-[#fde68a]/30 to-[#f59e0b]/20 rounded-full mb-6">
                  <Briefcase className="w-12 h-12 text-[#f59e0b]" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">No Opportunities Found</h3>
                <p className="text-gray-600 mb-8 max-w-md mx-auto text-lg">
                  No job postings match your current filters. Try adjusting your filters or search terms.
                </p>
                <button
                  onClick={clearAllFilters}
                  className="px-8 py-3.5 bg-gradient-to-r from-[#93c5fd] to-[#3b82f6] text-white rounded-xl hover:shadow-lg hover:shadow-[#93c5fd]/40 transition-all duration-200 text-base font-medium"
                >
                  Reset All Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobsListingPage;