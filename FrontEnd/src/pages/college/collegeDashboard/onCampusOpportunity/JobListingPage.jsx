import React, { useState, useEffect } from 'react';
import JobCard from '@/components/college/collegeDashboard/onCampusOpprtunity/JobCard';
import { Filter, ChevronDown, ChevronUp, X, Search, Briefcase, Calendar, Users, MapPin, TrendingUp, RefreshCw, AlertCircle, Building, GraduationCap, BookOpen } from 'lucide-react';
import { getCompanyPostingForOncampus } from '@/lib/College_AxiosIntance';

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
  const [sortBy, setSortBy] = useState('newest');

  // State for dropdown visibility
  const [showMainFilter, setShowMainFilter] = useState(false);
  const [openSubDropdowns, setOpenSubDropdowns] = useState({
    workMode: false,
    degree: false,
    courses: false,
    employmentType: false,
    location: false,
    college: false
  });

  // Mock filter options (replace with your actual data)
  const [filterOptions, setFilterOptions] = useState({
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
  });

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
    if (filters.degree && filters.degree.length > 0) {
      result = result.filter(college => {
        const degreeList = Array.isArray(college.degree)
          ? college.degree
          : college.degree
            ? [college.degree]
            : [];

        return filters.degree.some(course => {
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

    // Apply sorting
    if (sortBy === 'newest') {
      result.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    } else if (sortBy === 'oldest') {
      result.sort((a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0));
    } else if (sortBy === 'company') {
      result.sort((a, b) => {
        const nameA = a.companyName || '';
        const nameB = b.companyName || '';
        return nameA.localeCompare(nameB);
      });
    }

    setFilteredjobPosted(result);
  }, [filters, jobPosted, searchQuery, sortBy]);

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

  const toggleSubDropdown = (dropdown) => {
    setOpenSubDropdowns(prev => ({
      ...prev,
      [dropdown]: !prev[dropdown]
    }));
  };

  const removeFilter = (filterType, value) => {
    if (Array.isArray(filters[filterType])) {
      setFilters(prev => ({
        ...prev,
        [filterType]: prev[filterType].filter(item => item !== value)
      }));
    } else {
      setFilters(prev => ({
        ...prev,
        [filterType]: ''
      }));
    }
  };

  const clearFilterSection = (filterType) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: []
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
    setShowMainFilter(false);
    setOpenSubDropdowns({
      workMode: false,
      degree: false,
      courses: false,
      employmentType: false,
      location: false,
      college: false
    });
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    Object.values(filters).forEach(filter => {
      if (Array.isArray(filter)) {
        count += filter.length;
      } else if (filter && filter !== '' && filter !== 'Multi - Select') {
        count += 1;
      }
    });
    return count;
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
              {/* <div className="w-full lg:w-96">
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
              </div> */}
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
                  {getActiveFiltersCount()}
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

        {/* Main Filter Section with Dropdown System */}
        <div className="mb-8">
          {/* Active Filters Tags */}
          {getActiveFiltersCount() > 0 && (
            <div className="bg-white/90 backdrop-blur-sm border border-white/50 rounded-2xl shadow-lg shadow-blue-50/50 p-4 mb-4">
              <div className="flex items-center flex-wrap gap-2">
                <span className="text-sm font-medium text-gray-700 mr-2">Active filters:</span>
                
                {filters.workMode.map(mode => (
                  <span key={mode} className="inline-flex items-center bg-gradient-to-r from-[#93c5fd]/20 to-[#3b82f6]/10 text-[#3b82f6] px-3 py-1.5 rounded-lg text-sm backdrop-blur-sm">
                    {mode}
                    <button 
                      onClick={() => removeFilter('workMode', mode)}
                      className="ml-2 text-[#3b82f6] hover:text-[#1d4ed8]"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
                
                {filters.degree.map(deg => (
                  <span key={deg} className="inline-flex items-center bg-gradient-to-r from-[#f9a8d4]/20 to-[#ec4899]/10 text-[#ec4899] px-3 py-1.5 rounded-lg text-sm backdrop-blur-sm">
                    {deg}
                    <button 
                      onClick={() => removeFilter('degree', deg)}
                      className="ml-2 text-[#ec4899] hover:text-[#be185d]"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
                
                {filters.courses.map(course => (
                  <span key={course} className="inline-flex items-center bg-gradient-to-r from-[#fde68a]/20 to-[#f59e0b]/10 text-[#f59e0b] px-3 py-1.5 rounded-lg text-sm backdrop-blur-sm">
                    {course}
                    <button 
                      onClick={() => removeFilter('courses', course)}
                      className="ml-2 text-[#f59e0b] hover:text-[#d97706]"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
                
                {filters.employmentType.map(type => (
                  <span key={type} className="inline-flex items-center bg-gradient-to-r from-[#a7f3d0]/20 to-[#10b981]/10 text-[#10b981] px-3 py-1.5 rounded-lg text-sm backdrop-blur-sm">
                    {type}
                    <button 
                      onClick={() => removeFilter('employmentType', type)}
                      className="ml-2 text-[#10b981] hover:text-[#059669]"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
                
                {filters.location && filters.location !== 'Multi - Select' && (
                  <span className="inline-flex items-center bg-gradient-to-r from-[#c7d2fe]/20 to-[#818cf8]/10 text-[#818cf8] px-3 py-1.5 rounded-lg text-sm backdrop-blur-sm">
                    Location: {filters.location}
                    <button 
                      onClick={() => removeFilter('location', filters.location)}
                      className="ml-2 text-[#818cf8] hover:text-[#4f46e5]"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}
                
                {filters.college && filters.college !== 'Multi - Select' && (
                  <span className="inline-flex items-center bg-gradient-to-r from-[#fbcfe8]/20 to-[#f472b6]/10 text-[#f472b6] px-3 py-1.5 rounded-lg text-sm backdrop-blur-sm">
                    College: {filters.college}
                    <button 
                      onClick={() => removeFilter('college', filters.college)}
                      className="ml-2 text-[#f472b6] hover:text-[#db2777]"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Filter Controls Row */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            {/* Main Filter Button */}
            <div className="flex items-center gap-4">
              <div className="relative">
                <button
                  onClick={() => setShowMainFilter(!showMainFilter)}
                  className={`flex items-center gap-2 px-5 py-3 bg-white/90 backdrop-blur-sm border ${showMainFilter ? 'border-[#93c5fd] ring-2 ring-[#93c5fd]/10' : 'border-white/50 hover:border-[#93c5fd]/50'} rounded-xl transition-all duration-200 shadow-sm hover:shadow-md`}
                >
                  <Filter className="h-4 w-4 text-[#3b82f6]" />
                  <span className="text-sm font-medium text-gray-700">Filter</span>
                  {getActiveFiltersCount() > 0 && (
                    <span className="px-2 py-0.5 bg-gradient-to-r from-[#93c5fd] to-[#3b82f6] text-white text-xs rounded-full">
                      {getActiveFiltersCount()}
                    </span>
                  )}
                  <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform duration-200 ${showMainFilter ? 'transform rotate-180' : ''}`} />
                </button>
              </div>

              {/* Sort Dropdown */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="flex items-center gap-2 px-5 py-3 bg-white/90 backdrop-blur-sm border border-white/50 rounded-xl hover:border-[#93c5fd]/50 transition-all duration-200 appearance-none pr-10 text-sm font-medium text-gray-700 shadow-sm hover:shadow-md"
                >
                  <option value="newest">Sort: Newest First</option>
                  <option value="oldest">Sort: Oldest First</option>
                  <option value="company">Sort: Company Name (A-Z)</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Clear All Button */}
            <div>
              <button
                onClick={clearAllFilters}
                disabled={getActiveFiltersCount() === 0}
                className="flex items-center gap-2 px-5 py-3 bg-white/90 backdrop-blur-sm border border-white/50 text-gray-600 hover:text-gray-900 hover:border-gray-300 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md text-sm font-medium"
              >
                <RefreshCw className="h-4 w-4" />
                Clear all filters
              </button>
            </div>
          </div>

          {/* Main Filter Dropdown */}
          {showMainFilter && (
            <div className="mt-4 bg-white/90 backdrop-blur-sm border border-white/50 rounded-2xl shadow-lg shadow-blue-50/50 p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Work Mode Filter */}
                <div className="relative">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <Briefcase className="h-4 w-4 text-[#3b82f6] mr-2" />
                      <span className="text-sm font-medium text-gray-700">Work Mode</span>
                      {filters.workMode.length > 0 && (
                        <span className="ml-2 px-2 py-0.5 bg-gradient-to-r from-[#93c5fd] to-[#3b82f6] text-white text-xs rounded-full">
                          {filters.workMode.length}
                        </span>
                      )}
                    </div>
                    {filters.workMode.length > 0 && (
                      <button
                        onClick={() => clearFilterSection('workMode')}
                        className="text-xs text-[#3b82f6] hover:text-[#1d4ed8] font-medium"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                  
                  <button
                    onClick={() => toggleSubDropdown('workMode')}
                    className="flex items-center justify-between w-full p-3 bg-gradient-to-r from-white/50 to-white/30 border border-white/50 rounded-xl hover:border-[#93c5fd]/50 transition-all duration-200 mb-2 backdrop-blur-sm"
                  >
                    <span className="text-sm text-gray-700">Select Work Mode</span>
                    <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform duration-200 ${openSubDropdowns.workMode ? 'transform rotate-180' : ''}`} />
                  </button>
                  
                  {openSubDropdowns.workMode && (
                    <div className="mt-2 p-3 bg-white/50 backdrop-blur-sm rounded-lg border border-white/50 max-h-60 overflow-y-auto">
                      <div className="space-y-2">
                        {filterOptions.workMode.map((option, index) => (
                          <div key={option.label + index} className="flex items-center justify-between p-2 hover:bg-white/30 rounded transition-all duration-200">
                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                id={`workMode-${option.label}-${index}`}
                                checked={filters.workMode.includes(option.label)}
                                onChange={() => handleFilterChange('workMode', option.label)}
                                className="h-4 w-4 text-[#3b82f6] focus:ring-[#93c5fd]/50 border-gray-300 rounded"
                              />
                              <label 
                                htmlFor={`workMode-${option.label}-${index}`}
                                className="ml-3 text-sm text-gray-700 cursor-pointer flex-1"
                              >
                                {option.label}
                              </label>
                            </div>
                            {option.count && (
                              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                {option.count.toLocaleString()}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Degree Filter */}
                <div className="relative">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <GraduationCap className="h-4 w-4 text-[#ec4899] mr-2" />
                      <span className="text-sm font-medium text-gray-700">Degree</span>
                      {filters.degree.length > 0 && (
                        <span className="ml-2 px-2 py-0.5 bg-[#ec4899] text-white text-xs rounded-full">
                          {filters.degree.length}
                        </span>
                      )}
                    </div>
                    {filters.degree.length > 0 && (
                      <button
                        onClick={() => clearFilterSection('degree')}
                        className="text-xs text-[#ec4899] hover:text-[#be185d] font-medium"
                      >
                        Clear
                      </button>
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
                    <div className="mt-2 p-3 bg-white/50 backdrop-blur-sm rounded-lg border border-white/50 max-h-60 overflow-y-auto">
                      <div className="space-y-2">
                        {filterOptions.degree.map((option, index) => (
                          <div key={option + index} className="flex items-center p-2 hover:bg-white/30 rounded transition-all duration-200">
                            <input
                              type="checkbox"
                              id={`degree-${option}-${index}`}
                              checked={filters.degree.includes(option)}
                              onChange={() => handleFilterChange('degree', option)}
                              className="h-4 w-4 text-[#ec4899] focus:ring-[#f9a8d4]/50 border-gray-300 rounded"
                            />
                            <label 
                              htmlFor={`degree-${option}-${index}`}
                              className="ml-3 text-sm text-gray-700 cursor-pointer flex-1"
                            >
                              {option}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Courses Filter */}
                <div className="relative">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <BookOpen className="h-4 w-4 text-[#f59e0b] mr-2" />
                      <span className="text-sm font-medium text-gray-700">Courses</span>
                      {filters.courses.length > 0 && (
                        <span className="ml-2 px-2 py-0.5 bg-[#f59e0b] text-white text-xs rounded-full">
                          {filters.courses.length}
                        </span>
                      )}
                    </div>
                    {filters.courses.length > 0 && (
                      <button
                        onClick={() => clearFilterSection('courses')}
                        className="text-xs text-[#f59e0b] hover:text-[#d97706] font-medium"
                      >
                        Clear
                      </button>
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
                    <div className="mt-2 p-3 bg-white/50 backdrop-blur-sm rounded-lg border border-white/50 max-h-60 overflow-y-auto">
                      <div className="space-y-2">
                        {filterOptions.courses.map((option, index) => (
                          <div key={option + index} className="flex items-center p-2 hover:bg-white/30 rounded transition-all duration-200">
                            <input
                              type="checkbox"
                              id={`course-${option}-${index}`}
                              checked={filters.courses.includes(option)}
                              onChange={() => handleFilterChange('courses', option)}
                              className="h-4 w-4 text-[#f59e0b] focus:ring-[#fde68a]/50 border-gray-300 rounded"
                            />
                            <label 
                              htmlFor={`course-${option}-${index}`}
                              className="ml-3 text-sm text-gray-700 cursor-pointer flex-1"
                            >
                              {option}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Employment Type Filter */}
                <div className="relative">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <Briefcase className="h-4 w-4 text-[#10b981] mr-2" />
                      <span className="text-sm font-medium text-gray-700">Employment Type</span>
                      {filters.employmentType.length > 0 && (
                        <span className="ml-2 px-2 py-0.5 bg-[#10b981] text-white text-xs rounded-full">
                          {filters.employmentType.length}
                        </span>
                      )}
                    </div>
                    {filters.employmentType.length > 0 && (
                      <button
                        onClick={() => clearFilterSection('employmentType')}
                        className="text-xs text-[#10b981] hover:text-[#059669] font-medium"
                      >
                        Clear
                      </button>
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
                          <div key={option + index} className="flex items-center p-2 hover:bg-white/30 rounded transition-all duration-200">
                            <input
                              type="checkbox"
                              id={`employmentType-${option}-${index}`}
                              checked={filters.employmentType.includes(option)}
                              onChange={() => handleFilterChange('employmentType', option)}
                              className="h-4 w-4 text-[#10b981] focus:ring-[#a7f3d0]/50 border-gray-300 rounded"
                            />
                            <label 
                              htmlFor={`employmentType-${option}-${index}`}
                              className="ml-3 text-sm text-gray-700 cursor-pointer flex-1"
                            >
                              {option}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Location Filter */}
                <div className="relative">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 text-[#818cf8] mr-2" />
                      <span className="text-sm font-medium text-gray-700">Location</span>
                      {filters.location && filters.location !== '' && filters.location !== 'Multi - Select' && (
                        <span className="ml-2 px-2 py-0.5 bg-[#818cf8] text-white text-xs rounded-full">
                          1
                        </span>
                      )}
                    </div>
                    {filters.location && filters.location !== '' && (
                      <button
                        onClick={() => handleFilterChange('location', '')}
                        className="text-xs text-[#818cf8] hover:text-[#4f46e5] font-medium"
                      >
                        Clear
                      </button>
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
                    <div className="mt-2 p-3 bg-white/50 backdrop-blur-sm rounded-lg border border-white/50">
                      <select
                        value={filters.location}
                        onChange={(e) => handleFilterChange('location', e.target.value)}
                        className="w-full p-3 bg-white/80 backdrop-blur-sm border border-white/50 rounded-lg focus:ring-2 focus:ring-[#93c5fd]/50 focus:border-transparent focus:outline-none transition-all duration-200 text-sm"
                      >
                        <option value="">Select Location</option>
                        <option value="Multi - Select">Multi - Select</option>
                      </select>
                    </div>
                  )}
                </div>

                {/* College Filter */}
                <div className="relative">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <Building className="h-4 w-4 text-[#f472b6] mr-2" />
                      <span className="text-sm font-medium text-gray-700">College</span>
                      {filters.college && filters.college !== '' && filters.college !== 'Multi - Select' && (
                        <span className="ml-2 px-2 py-0.5 bg-[#f472b6] text-white text-xs rounded-full">
                          1
                        </span>
                      )}
                    </div>
                    {filters.college && filters.college !== '' && (
                      <button
                        onClick={() => handleFilterChange('college', '')}
                        className="text-xs text-[#f472b6] hover:text-[#db2777] font-medium"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                  
                  <button
                    onClick={() => toggleSubDropdown('college')}
                    className="flex items-center justify-between w-full p-3 bg-gradient-to-r from-white/50 to-white/30 border border-white/50 rounded-xl hover:border-[#fbcfe8]/50 transition-all duration-200 mb-2 backdrop-blur-sm"
                  >
                    <span className="text-sm text-gray-700">Select College</span>
                    <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform duration-200 ${openSubDropdowns.college ? 'transform rotate-180' : ''}`} />
                  </button>
                  
                  {openSubDropdowns.college && (
                    <div className="mt-2 p-3 bg-white/50 backdrop-blur-sm rounded-lg border border-white/50">
                      <select
                        value={filters.college}
                        onChange={(e) => handleFilterChange('college', e.target.value)}
                        className="w-full p-3 bg-white/80 backdrop-blur-sm border border-white/50 rounded-lg focus:ring-2 focus:ring-[#93c5fd]/50 focus:border-transparent focus:outline-none transition-all duration-200 text-sm"
                      >
                        <option value="">Select College</option>
                        <option value="Multi - Select">Multi - Select</option>
                      </select>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Results Header */}
        <div className="mb-6">
          <div className="bg-white/90 backdrop-blur-sm border border-white/50 rounded-2xl shadow-lg shadow-blue-50/50 p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Showing {filteredjobPosted.length} of {jobPosted.length} Opportunities
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Filtered results based on your preferences
                </p>
              </div>
              
              <div className="text-sm text-gray-600">
                <span className="font-medium">Sort by:</span>{' '}
                {sortBy === 'newest' ? 'Newest First' : 
                 sortBy === 'oldest' ? 'Oldest First' : 
                 'Company Name (A-Z)'}
              </div>
            </div>
          </div>
        </div>

        {/* Job Cards */}
        <div className="bg-white/90 backdrop-blur-sm border border-white/50 rounded-2xl shadow-lg shadow-blue-50/50 p-6 min-h-[600px]">
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
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-[#fde68a]/30 to-[#f59e0b]/20 mb-6">
                <Briefcase className="h-12 w-12 text-[#f59e0b]" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">No Opportunities Found</h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto text-lg">
                No job postings match your current filters. Try adjusting your filters or search terms.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <button
                  onClick={clearAllFilters}
                  className="px-8 py-3.5 bg-gradient-to-r from-[#93c5fd] to-[#3b82f6] text-white rounded-xl hover:shadow-lg hover:shadow-[#93c5fd]/40 transition-all duration-200 text-base font-medium"
                >
                  Reset All Filters
                </button>
                <button
                  onClick={() => window.location.reload()}
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
};

export default JobsListingPage;