import { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, X, Filter, SortAsc, Building2, MapPin, Users, Calendar, Briefcase, Search, GraduationCap, BookOpen, TrendingUp } from 'lucide-react';
import CollegeCard from '../../../components/company/employerDashboard/CollegeCard';
import { getRegisteredColleges } from '@/lib/Company_AxiosInstance';
import CreatableSelect from 'react-select/creatable';
import { useMemo } from 'react';
import { City } from 'country-state-city';

const CollegeListingPage = () => {
  const [colleges, setColleges] = useState([]);
  const [filteredColleges, setFilteredColleges] = useState([]);
  const [filters, setFilters] = useState({
    degree: [],
    courses: [],
    employmentType: [],
    location: [],
  });
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState('newest');

  // State for dropdown visibility
  const [showMainFilter, setShowMainFilter] = useState(false);
  const [openSubDropdowns, setOpenSubDropdowns] = useState({
    degree: false,
    courses: false,
    employmentType: false,
    location: false
  });
  
  // Sample filter options
  const [filterOptions, setFilterOptions] = useState({
    degree: [
      { label: 'Polytechnic' },
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
      { label: 'Fitter' },
      { label: 'Welding' },
      { label: 'Electronics' },
      { label: 'B.Tech' },
      { label: 'BBA' },
      { label: 'BSc' },
      { label: 'BCA' },
      { label: 'BE' },
      { label: 'BA' },
      { label: 'BBM' },
      { label: 'PUC Humanities Combinations' },
      { label: 'PUC Commerce Combinations' },
      { label: 'B.Pharma' },
      { label: 'D.Pharma' },
      { label: 'M.Tech' },
      { label: 'MBA' },
      { label: 'MA' },
      { label: 'MCA' },
      { label: 'ME' },
      { label: 'MSc' },
      { label: 'MCom' },
      { label: 'M.Pharma' }
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

  const safeLocation = Array.isArray(filters.location)
    ? filters.location
    : [];

  useEffect(() => {
    const getColleges = async () => {
      try {
        setIsLoading(true);
        const response = await getRegisteredColleges();
        console.log('API Response:', response.data?.data || []);

        const fetchedColleges = response.data?.data || [];
        setColleges(fetchedColleges);
        setFilteredColleges(fetchedColleges);
        
        // Extract filter options from actual data
        if (fetchedColleges.length > 0) {
          extractFilterOptions(fetchedColleges);
        }
      } catch (err) {
        setError('Failed to load colleges. Please try again later.');
        console.error('Error fetching colleges: ', err);
        setColleges([]);
        setFilteredColleges([]);
      } finally {
        setIsLoading(false);
      }
    };

    getColleges();
  }, []);

  const extractFilterOptions = (collegesData) => {
    const degrees = new Set();
    const courses = new Set();
    const employmentTypes = new Set();

    collegesData.forEach(college => {
      // Extract degrees
      if (college.degreeType && Array.isArray(college.degreeType)) {
        college.degreeType.forEach(deg => degrees.add(deg));
      }
      
      // Extract courses
      if (college.degree && Array.isArray(college.degree)) {
        college.degree.forEach(course => courses.add(course));
      }
      
      // Extract employment types
      if (college.employmentType && Array.isArray(college.employmentType)) {
        college.employmentType.forEach(type => employmentTypes.add(type));
      }
    });

    setFilterOptions(prev => ({
      ...prev,
      degree: Array.from(degrees).map(label => ({ label })),
      courses: Array.from(courses).map(label => ({ label })),
      employmentType: Array.from(employmentTypes).map(label => ({ label }))
    }));
  };

  useEffect(() => {
    if (!Array.isArray(colleges)) {
      setFilteredColleges([]);
      return;
    }

    let result = [...colleges];

    // Apply degree filters
    if (filters.degree.length > 0) {
      result = result.filter(college =>
        college.degreeType &&
        filters.degree.some(deg =>
          college.degreeType.some(colDeg => {
            return colDeg.toLowerCase() === deg.toLowerCase();
          })
        )
      );
    }

    // Apply course filters
    if (filters.courses.length > 0) {
      result = result.filter(college =>
        college.degree &&
        filters.courses.some(course => {
          const normalizedCourse = course?.toLowerCase().replace(/[\s.\-]/g, "").trim();
          return college.degree.some(c => {
            const normalizedC = c?.toLowerCase().replace(/[\s.\-]/g, "").trim();
            return normalizedC === normalizedCourse;
          });
        })
      );
    }

    // Apply employment type filter
    if (filters.employmentType && filters.employmentType.length > 0) {
      result = result.filter(college =>
        college.employmentType && Array.isArray(college.employmentType) &&
        filters.employmentType.some(filterValue =>
          college.employmentType.some(empType =>
            empType.toLowerCase() === filterValue.toLowerCase()
          )
        )
      );
    }

    // Apply location filter
    if (Array.isArray(filters.location) && filters.location.length > 0) {
      result = result.filter(college =>
        Array.isArray(college.location) &&
        filters.location.some(filterLoc =>
          college.location.some(
            loc => loc.toLowerCase() === filterLoc.toLowerCase()
          )
        )
      );
    }

    // Apply sorting
    if (sortBy === 'newest') {
      result.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    } else if (sortBy === 'oldest') {
      result.sort((a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0));
    } else if (sortBy === 'a-z') {
      result.sort((a, b) => {
        const nameA = a.collegePosted?.collegeUniversityDetails?.collegeName || '';
        const nameB = b.collegePosted?.collegeUniversityDetails?.collegeName || '';
        return nameA.localeCompare(nameB);
      });
    }

    setFilteredColleges(result);
  }, [filters, colleges, sortBy]);

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
      degree: [],
      courses: [],
      location: [],
      employmentType: [],
    });
    setShowMainFilter(false);
    setOpenSubDropdowns({
      degree: false,
      courses: false,
      employmentType: false,
      location: false
    });
  };

  const handleLocationMultiChange = (selectedOptions) => {
    setFilters(prev => ({
      ...prev,
      location: selectedOptions
        ? selectedOptions.map(opt => opt.value)
        : []
    }));
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
      <div className="min-h-screen bg-gradient-to-br from-[#667eea]/10 via-[#f093fb]/5 to-[#764ba2]/10 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#667eea]"></div>
          <p className="mt-4 text-gray-600">Loading colleges...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#667eea]/10 via-[#f093fb]/5 to-[#764ba2]/10 flex items-center justify-center">
        <div className="bg-white/90 backdrop-blur-sm border border-red-200 rounded-2xl shadow-lg p-8 max-w-md text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-100 text-red-600 mb-4">
            <X className="h-6 w-6" />
          </div>
          <p className="text-lg font-medium text-gray-900">{error}</p>
          <button
            className="mt-6 px-6 py-3 bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white rounded-xl hover:shadow-lg hover:shadow-[#667eea]/30 transition-all duration-300"
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#667eea]/10 via-[#f093fb]/5 to-[#764ba2]/10">
      <div className="container mx-auto px-4 py-8 pt-22">
        {/* Header Section */}
        <div className="bg-white/90 backdrop-blur-sm border border-gray-100 rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div className="mb-4 md:mb-0">
              <div className="flex items-center mb-2">
                <div className="p-2 bg-gradient-to-br from-[#667eea]/20 to-[#764ba2]/20 rounded-lg mr-3">
                  <Building2 className="h-5 w-5 text-[#667eea]" />
                </div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent">
                  Colleges Posting for On-Campus
                </h1>
              </div>
              <p className="text-gray-600">
                Discover and connect with colleges posting for on-campus opportunities
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all duration-200 appearance-none pr-10"
                >
                  <option value="newest">Sort: Newest</option>
                  <option value="oldest">Sort: Oldest</option>
                  <option value="a-z">Sort: A-Z</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>
              
              <button
                onClick={clearAllFilters}
                disabled={getActiveFiltersCount() === 0}
                className="px-4 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                Clear all
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards Section - Added below header */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white/90 backdrop-blur-sm border border-white/50 rounded-xl shadow-lg shadow-blue-100/50 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Colleges</p>
                <p className="text-2xl font-bold text-[#3b82f6]">{colleges.length}</p>
              </div>
              <div className="p-2 bg-gradient-to-br from-[#93c5fd]/30 to-[#3b82f6]/20 rounded-lg">
                <Building2 className="w-5 h-5 text-[#3b82f6]" />
              </div>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-sm border border-white/50 rounded-xl shadow-lg shadow-pink-100/50 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Showing Results</p>
                <p className="text-2xl font-bold text-[#ec4899]">{filteredColleges.length}</p>
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

        {/* Filter Section - Single button with nested dropdowns */}
        <div className="mb-6">
          {/* Active Filters Tags - Always visible */}
          {getActiveFiltersCount() > 0 && (
            <div className="bg-white/90 backdrop-blur-sm border border-gray-100 rounded-2xl shadow-lg p-4 mb-4">
              <div className="flex items-center flex-wrap gap-2">
                <span className="text-sm font-medium text-gray-700 mr-2">Active filters:</span>
                
                {filters.degree.map(degree => (
                  <span key={degree} className="inline-flex items-center bg-gradient-to-r from-purple-100 to-purple-50 text-purple-700 px-3 py-1.5 rounded-lg text-sm">
                    {degree}
                    <button 
                      onClick={() => removeFilter('degree', degree)}
                      className="ml-2 text-purple-600 hover:text-purple-800"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
                
                {filters.courses.map(course => (
                  <span key={course} className="inline-flex items-center bg-gradient-to-r from-green-100 to-green-50 text-green-700 px-3 py-1.5 rounded-lg text-sm">
                    {course}
                    <button 
                      onClick={() => removeFilter('courses', course)}
                      className="ml-2 text-green-600 hover:text-green-800"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
                
                {filters.employmentType.map(type => (
                  <span key={type} className="inline-flex items-center bg-gradient-to-r from-yellow-100 to-yellow-50 text-yellow-700 px-3 py-1.5 rounded-lg text-sm">
                    {type}
                    <button 
                      onClick={() => removeFilter('employmentType', type)}
                      className="ml-2 text-yellow-600 hover:text-yellow-800"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
                
                {Array.isArray(filters.location) &&
                  filters.location.map(loc => (
                    <span
                      key={loc}
                      className="inline-flex items-center bg-gradient-to-r from-red-100 to-red-50 text-red-700 px-3 py-1.5 rounded-lg text-sm"
                    >
                      Location: {loc}
                      <button
                        onClick={() => removeFilter('location', loc)}
                        className="ml-2 text-red-600 hover:text-red-800"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}

              </div>
            </div>
          )}

          {/* Main Filter Button and Dropdown Container */}
          <div className="relative">
            {/* Filter Button */}
            <div className="bg-white/90 backdrop-blur-sm border border-gray-100 rounded-2xl shadow-lg p-4">
              <button
                onClick={() => setShowMainFilter(!showMainFilter)}
                className={`flex items-center gap-2 px-4 py-2.5 bg-white border ${showMainFilter ? 'border-[#667eea] ring-2 ring-[#667eea]/10' : 'border-gray-200 hover:border-gray-300'} rounded-xl transition-all duration-200`}
              >
                <Filter className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">Filter</span>
                {getActiveFiltersCount() > 0 && (
                  <span className="px-2 py-0.5 bg-[#667eea] text-white text-xs rounded-full">
                    {getActiveFiltersCount()}
                  </span>
                )}
                <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform duration-200 ${showMainFilter ? 'transform rotate-180' : ''}`} />
              </button>
            </div>

            {/* Main Filter Dropdown - This will push content down */}
            {showMainFilter && (
              <div className="mt-4 bg-white/90 backdrop-blur-sm border border-gray-100 rounded-2xl shadow-lg p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* Degree Filter */}
                  <div className="relative">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center">
                        <GraduationCap className="h-4 w-4 text-gray-500 mr-2" />
                        <span className="text-sm font-medium text-gray-700">Degree</span>
                        {filters.degree.length > 0 && (
                          <span className="ml-2 px-2 py-0.5 bg-[#667eea] text-white text-xs rounded-full">
                            {filters.degree.length}
                          </span>
                        )}
                      </div>
                      {filters.degree.length > 0 && (
                        <button
                          onClick={() => clearFilterSection('degree')}
                          className="text-xs text-[#667eea] hover:text-[#764ba2]"
                        >
                          Clear
                        </button>
                      )}
                    </div>
                    
                    <button
                      onClick={() => toggleSubDropdown('degree')}
                      className="flex items-center justify-between w-full p-3 bg-gradient-to-r from-gray-50 to-white border border-gray-200 rounded-xl hover:border-gray-300 transition-all duration-200 mb-2"
                    >
                      <span className="text-sm text-gray-700">Select Degree</span>
                      <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform duration-200 ${openSubDropdowns.degree ? 'transform rotate-180' : ''}`} />
                    </button>
                    
                    {openSubDropdowns.degree && (
                      <div className="mt-2 p-3 bg-gray-50 rounded-lg border border-gray-200 max-h-60 overflow-y-auto">
                        <div className="space-y-2">
                          {filterOptions.degree.map((option, index) => (
                            <div key={option.label + index} className="flex items-center p-2 hover:bg-white rounded transition-all duration-200">
                              <input
                                type="checkbox"
                                id={`degree-${option.label}-${index}`}
                                checked={filters.degree.includes(option.label)}
                                onChange={() => handleFilterChange('degree', option.label)}
                                className="h-4 w-4 text-[#667eea] focus:ring-[#667eea]/50 border-gray-300 rounded"
                              />
                              <label 
                                htmlFor={`degree-${option.label}-${index}`}
                                className="ml-3 text-sm text-gray-700 cursor-pointer flex-1"
                              >
                                {option.label}
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
                        <BookOpen className="h-4 w-4 text-gray-500 mr-2" />
                        <span className="text-sm font-medium text-gray-700">Courses</span>
                        {filters.courses.length > 0 && (
                          <span className="ml-2 px-2 py-0.5 bg-[#667eea] text-white text-xs rounded-full">
                            {filters.courses.length}
                          </span>
                        )}
                      </div>
                      {filters.courses.length > 0 && (
                        <button
                          onClick={() => clearFilterSection('courses')}
                          className="text-xs text-[#667eea] hover:text-[#764ba2]"
                        >
                          Clear
                        </button>
                      )}
                    </div>
                    
                    <button
                      onClick={() => toggleSubDropdown('courses')}
                      className="flex items-center justify-between w-full p-3 bg-gradient-to-r from-gray-50 to-white border border-gray-200 rounded-xl hover:border-gray-300 transition-all duration-200 mb-2"
                    >
                      <span className="text-sm text-gray-700">Select Courses</span>
                      <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform duration-200 ${openSubDropdowns.courses ? 'transform rotate-180' : ''}`} />
                    </button>
                    
                    {openSubDropdowns.courses && (
                      <div className="mt-2 p-3 bg-gray-50 rounded-lg border border-gray-200 max-h-60 overflow-y-auto">
                        <div className="space-y-2">
                          {filterOptions.courses.map((option, index) => (
                            <div key={option.label + index} className="flex items-center p-2 hover:bg-white rounded transition-all duration-200">
                              <input
                                type="checkbox"
                                id={`course-${option.label}-${index}`}
                                checked={filters.courses.includes(option.label)}
                                onChange={() => handleFilterChange('courses', option.label)}
                                className="h-4 w-4 text-[#667eea] focus:ring-[#667eea]/50 border-gray-300 rounded"
                              />
                              <label 
                                htmlFor={`course-${option.label}-${index}`}
                                className="ml-3 text-sm text-gray-700 cursor-pointer flex-1"
                              >
                                {option.label}
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
                        <Briefcase className="h-4 w-4 text-gray-500 mr-2" />
                        <span className="text-sm font-medium text-gray-700">Employment Type</span>
                        {filters.employmentType.length > 0 && (
                          <span className="ml-2 px-2 py-0.5 bg-[#667eea] text-white text-xs rounded-full">
                            {filters.employmentType.length}
                          </span>
                        )}
                      </div>
                      {filters.employmentType.length > 0 && (
                        <button
                          onClick={() => clearFilterSection('employmentType')}
                          className="text-xs text-[#667eea] hover:text-[#764ba2]"
                        >
                          Clear
                        </button>
                      )}
                    </div>
                    
                    <button
                      onClick={() => toggleSubDropdown('employmentType')}
                      className="flex items-center justify-between w-full p-3 bg-gradient-to-r from-gray-50 to-white border border-gray-200 rounded-xl hover:border-gray-300 transition-all duration-200 mb-2"
                    >
                      <span className="text-sm text-gray-700">Select Employment Type</span>
                      <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform duration-200 ${openSubDropdowns.employmentType ? 'transform rotate-180' : ''}`} />
                    </button>
                    
                    {openSubDropdowns.employmentType && (
                      <div className="mt-2 p-3 bg-gray-50 rounded-lg border border-gray-200 max-h-60 overflow-y-auto">
                        <div className="space-y-2">
                          {filterOptions.employmentType.map((option, index) => (
                            <div key={option.label + index} className="flex items-center p-2 hover:bg-white rounded transition-all duration-200">
                              <input
                                type="checkbox"
                                id={`employmentType-${option.label}-${index}`}
                                checked={filters.employmentType.includes(option.label)}
                                onChange={() => handleFilterChange('employmentType', option.label)}
                                className="h-4 w-4 text-[#667eea] focus:ring-[#667eea]/50 border-gray-300 rounded"
                              />
                              <label 
                                htmlFor={`employmentType-${option.label}-${index}`}
                                className="ml-3 text-sm text-gray-700 cursor-pointer flex-1"
                              >
                                {option.label}
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
                        <MapPin className="h-4 w-4 text-gray-500 mr-2" />
                        <span className="text-sm font-medium text-gray-700">Location</span>
                        {Array.isArray(filters.location) && filters.location.length > 0 && (
                          <span className="ml-2 px-2 py-0.5 bg-[#667eea] text-white text-xs rounded-full">
                            {filters.location.length}
                          </span>
                        )}
                      </div>
                      {Array.isArray(filters.location) && filters.location.length > 0 && (
                        <button
                          onClick={() => handleFilterChange('location', [])}
                          className="text-xs text-[#667eea] hover:text-[#764ba2]"
                        >
                          Clear
                        </button>
                      )}
                    </div>
                    
                    <button
                      onClick={() => toggleSubDropdown('location')}
                      className="flex items-center justify-between w-full p-3 bg-gradient-to-r from-gray-50 to-white border border-gray-200 rounded-xl hover:border-gray-300 transition-all duration-200 mb-2"
                    >
                      <span className="text-sm text-gray-700">Select Location</span>
                      <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform duration-200 ${openSubDropdowns.location ? 'transform rotate-180' : ''}`} />
                    </button>
                    
                    {openSubDropdowns.location && (
                      <div className="mt-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <CreatableSelect
                          isMulti
                          options={cityOptions}
                          value={safeLocation.map(loc => ({ value: loc, label: loc }))}
                          onChange={handleLocationMultiChange}
                          placeholder="Select or type locations..."
                          menuPortalTarget={document.body}
                          menuPosition="fixed"
                          styles={{
                            control: (base) => ({
                              ...base,
                              borderColor: '#e5e7eb',
                              minHeight: '38px',
                              fontSize: '14px',
                              borderRadius: '0.75rem',
                              backgroundColor: 'rgb(249 250 251 / var(--tw-bg-opacity))',
                              backgroundImage:
                                'linear-gradient(to right, rgb(249 250 251), rgb(255 255 255))',
                            }),
                            menu: (base) => ({
                              ...base,
                              borderRadius: '0.5rem',
                              fontSize: '14px',
                              border: '1px solid #e5e7eb',
                            }),
                            menuPortal: (base) => ({
                              ...base,
                              zIndex: 9999,
                            }),
                            multiValue: (base) => ({
                              ...base,
                              fontSize: '12px',
                              backgroundColor: '#f3f4f6',
                              borderRadius: '9999px',
                            }),
                            multiValueRemove: (base) => ({
                              ...base,
                              fontSize: '12px',
                              color: '#6b7280',
                              ':hover': {
                                backgroundColor: '#e5e7eb',
                                color: '#374151',
                              },
                            }),
                          }}
                        />                         
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* College Cards Grid - Full width */}
        <div className="bg-white/90 backdrop-blur-sm border border-gray-100 rounded-2xl shadow-lg p-6 min-h-[600px]">
          {filteredColleges.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredColleges.map(college => (
                <CollegeCard
                  key={college._id || college.id}
                  college={college}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-r from-gray-100 to-gray-200 mb-6">
                <Building2 className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-3">No colleges found</h3>
              <p className="text-gray-600 mb-8 max-w-md">
                No colleges match your current filter criteria. Try adjusting your filters or search criteria to find more options.
              </p>
              <div className="flex flex-wrap gap-3 justify-center">
                <button
                  onClick={clearAllFilters}
                  className="px-6 py-3 bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white rounded-xl hover:shadow-lg hover:shadow-[#667eea]/30 transition-all duration-300"
                >
                  Clear All Filters
                </button>
                <button
                  onClick={() => window.location.reload()}
                  className="px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-300"
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

export default CollegeListingPage;