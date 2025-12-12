import { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, X, Filter, Building2, MapPin, Search, GraduationCap, BookOpen, Briefcase, Calendar, Users } from 'lucide-react';
import CollegeCard from '../../../components/company/employerDashboard/CollegeCard';
import { getRegisteredColleges } from '@/lib/Company_AxiosInstance';

const EmployerListingPage = () => {
  const [colleges, setColleges] = useState([]);
  const [filteredColleges, setFilteredColleges] = useState([]);
  const [filters, setFilters] = useState({
    workMode: [],
    degree: [],
    courses: [],
    employmentType: [],
    location: '',
    college: '',
    internship: false,
    fullTime: false
  });
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState('newest');

  const [openSections, setOpenSections] = useState({
    workMode: false,
    degree: false,
    courses: false,
    employmentType: false,
    location: false,
    college: false
  });

  const [filterOptions, setFilterOptions] = useState({
    workMode: [
      { label: 'Work from office', count: 28692 },
      { label: 'Hybrid', count: 756 },
      { label: 'Remote', count: 709 }
    ],
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

  useEffect(() => {
    const getColleges = async () => {
      try {
        setIsLoading(true);
        const response = await getRegisteredColleges();
        const fetchedColleges = response.data?.data || [];
        setColleges(fetchedColleges);
        setFilteredColleges(fetchedColleges);
        
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
    const workModes = new Map();
    const degrees = new Set();
    const courses = new Set();
    const employmentTypes = new Set();

    collegesData.forEach(college => {
      if (college.workModes && Array.isArray(college.workModes)) {
        college.workModes.forEach(mode => {
          workModes.set(mode, (workModes.get(mode) || 0) + 1);
        });
      }
      
      if (college.degreeType && Array.isArray(college.degreeType)) {
        college.degreeType.forEach(deg => degrees.add(deg));
      }
      
      if (college.degree && Array.isArray(college.degree)) {
        college.degree.forEach(course => courses.add(course));
      }
      
      if (college.employmentType && Array.isArray(college.employmentType)) {
        college.employmentType.forEach(type => employmentTypes.add(type));
      }
    });

    setFilterOptions(prev => ({
      ...prev,
      workMode: Array.from(workModes.entries()).map(([label, count]) => ({ label, count })),
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

    if (filters.workMode.length > 0) {
      result = result.filter(college =>
        college.workModes && filters.workMode.some(mode => college.workModes.includes(mode))
      );
    }

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

    if (filters.location && filters.location !== 'Multi - Select') {
      result = result.filter(college => {
        return Array.isArray(college.location) &&
          college.location.some(loc => loc.toLowerCase() === filters.location.toLowerCase());
      });
    }

    if (filters.college && filters.college !== 'Multi - Select') {
      result = result.filter(college => {
        const collegeName = college.collegePosted?.collegeUniversityDetails?.collegeName;
        return collegeName
          ? collegeName.toLowerCase().includes(filters.college.toLowerCase())
          : false;
      });
    }

    if (filters.internship) {
      result = result.filter(college => college.hasInternship);
    }

    if (filters.fullTime) {
      result = result.filter(college => college.hasFullTime);
    }

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
      } else if (filterType === 'internship' || filterType === 'fullTime') {
        return {
          ...prev,
          [filterType]: value
        };
      } else {
        return {
          ...prev,
          [filterType]: value
        };
      }
    });
  };

  const toggleSection = (section) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const removeFilter = (filterType, value) => {
    if (Array.isArray(filters[filterType])) {
      setFilters(prev => ({
        ...prev,
        [filterType]: prev[filterType].filter(item => item !== value)
      }));
    } else if (filterType === 'internship' || filterType === 'fullTime') {
      setFilters(prev => ({
        ...prev,
        [filterType]: false
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
      internship: false,
      fullTime: false
    });
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    Object.entries(filters).forEach(([key, value]) => {
      if (key === 'internship' || key === 'fullTime') {
        if (value) count++;
      } else if (Array.isArray(value)) {
        count += value.length;
      } else if (value && value !== '' && value !== 'Multi - Select') {
        count += 1;
      }
    });
    return count;
  };

  const toggleInternshipFilter = () => {
    setFilters(prev => ({
      ...prev,
      internship: !prev.internship
    }));
  };

  const toggleFullTimeFilter = () => {
    setFilters(prev => ({
      ...prev,
      fullTime: !prev.fullTime
    }));
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

        {/* Active Filters */}
        {getActiveFiltersCount() > 0 && (
          <div className="bg-white/90 backdrop-blur-sm border border-gray-100 rounded-2xl shadow-lg p-4 mb-6">
            <div className="flex items-center flex-wrap gap-2">
              <div className="flex items-center gap-2 mr-3">
                <Filter className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">Active Filters:</span>
              </div>
              
              {filters.workMode.map(mode => (
                <span key={mode} className="inline-flex items-center bg-gradient-to-r from-blue-100 to-blue-50 text-blue-700 px-3 py-1.5 rounded-lg text-sm">
                  {mode}
                  <button 
                    onClick={() => removeFilter('workMode', mode)}
                    className="ml-2 text-blue-600 hover:text-blue-800"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
              
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
              
              {filters.location && filters.location !== 'Multi - Select' && (
                <span className="inline-flex items-center bg-gradient-to-r from-red-100 to-red-50 text-red-700 px-3 py-1.5 rounded-lg text-sm">
                  Location: {filters.location}
                  <button 
                    onClick={() => removeFilter('location', filters.location)}
                    className="ml-2 text-red-600 hover:text-red-800"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
              
              {filters.college && filters.college !== 'Multi - Select' && (
                <span className="inline-flex items-center bg-gradient-to-r from-indigo-100 to-indigo-50 text-indigo-700 px-3 py-1.5 rounded-lg text-sm">
                  College: {filters.college}
                  <button 
                    onClick={() => removeFilter('college', filters.college)}
                    className="ml-2 text-indigo-600 hover:text-indigo-800"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}

              {filters.internship && (
                <span className="inline-flex items-center bg-gradient-to-r from-pink-100 to-pink-50 text-pink-700 px-3 py-1.5 rounded-lg text-sm">
                  Internship
                  <button 
                    onClick={() => removeFilter('internship', true)}
                    className="ml-2 text-pink-600 hover:text-pink-800"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}

              {filters.fullTime && (
                <span className="inline-flex items-center bg-gradient-to-r from-teal-100 to-teal-50 text-teal-700 px-3 py-1.5 rounded-lg text-sm">
                  Full-time
                  <button 
                    onClick={() => removeFilter('fullTime', true)}
                    className="ml-2 text-teal-600 hover:text-teal-800"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
            </div>
          </div>
        )}

        {/* Quick Filter Toggles */}
        <div className="bg-white/90 backdrop-blur-sm border border-gray-100 rounded-2xl shadow-lg p-4 mb-6">
          <div className="flex flex-wrap gap-4">
            <label className={`flex items-center px-4 py-2.5 rounded-xl cursor-pointer transition-all duration-200 ${
              filters.internship 
                ? 'bg-gradient-to-r from-pink-100 to-pink-200 text-pink-700 border border-pink-300' 
                : 'bg-gradient-to-r from-gray-50 to-white text-gray-700 border border-gray-200 hover:border-gray-300'
            }`}>
              <input
                type="checkbox"
                checked={filters.internship}
                onChange={toggleInternshipFilter}
                className="hidden"
              />
              <span className="font-medium">Internship</span>
            </label>

            <label className={`flex items-center px-4 py-2.5 rounded-xl cursor-pointer transition-all duration-200 ${
              filters.fullTime 
                ? 'bg-gradient-to-r from-teal-100 to-teal-200 text-teal-700 border border-teal-300' 
                : 'bg-gradient-to-r from-gray-50 to-white text-gray-700 border border-gray-200 hover:border-gray-300'
            }`}>
              <input
                type="checkbox"
                checked={filters.fullTime}
                onChange={toggleFullTimeFilter}
                className="hidden"
              />
              <span className="font-medium">Full-time</span>
            </label>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-6 min-h-[600px]">
          {/* Filter Sidebar */}
          <div className="lg:w-80 flex-shrink-0">
            <div className="bg-white/90 backdrop-blur-sm border border-gray-100 rounded-2xl shadow-lg h-full flex flex-col">
              <div className="p-6 flex-1 overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
                  <span className="text-sm text-gray-500">
                    {filteredColleges.length} of {colleges.length} colleges
                  </span>
                </div>

                {/* Work Mode Filter */}
                <div className="mb-6">
                  <button
                    onClick={() => toggleSection('workMode')}
                    className="flex items-center justify-between w-full p-3 bg-gradient-to-r from-gray-50 to-white border border-gray-200 rounded-xl hover:border-[#667eea]/50 transition-all duration-200 mb-3"
                  >
                    <div className="flex items-center">
                      <Briefcase className="h-4 w-4 text-gray-500 mr-2" />
                      <span className="font-medium text-gray-700">Work Mode</span>
                      {filters.workMode.length > 0 && (
                        <span className="ml-2 px-2 py-0.5 bg-[#667eea] text-white text-xs rounded-full">
                          {filters.workMode.length}
                        </span>
                      )}
                    </div>
                    {openSections.workMode ? (
                      <ChevronUp className="h-4 w-4 text-gray-500" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-gray-500" />
                    )}
                  </button>
                  
                  {openSections.workMode && (
                    <div className="pl-2">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs text-gray-500">
                          {filterOptions.workMode.length} options
                        </span>
                        {filters.workMode.length > 0 && (
                          <button
                            onClick={() => clearFilterSection('workMode')}
                            className="text-xs text-[#667eea] hover:text-[#764ba2]"
                          >
                            Clear
                          </button>
                        )}
                      </div>
                      <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                        {filterOptions.workMode.map((option, index) => (
                          <div key={option.label + index} className="flex items-center p-2 hover:bg-gray-50 rounded-lg transition-all duration-200">
                            <input
                              type="checkbox"
                              id={`workMode-${option.label}-${index}`}
                              checked={filters.workMode.includes(option.label)}
                              onChange={() => handleFilterChange('workMode', option.label)}
                              className="h-4 w-4 text-[#667eea] focus:ring-[#667eea]/50 border-gray-300 rounded"
                            />
                            <label 
                              htmlFor={`workMode-${option.label}-${index}`}
                              className="ml-3 text-sm text-gray-700 cursor-pointer flex-1"
                            >
                              {option.label}
                              {option.count && (
                                <span className="ml-2 text-xs text-gray-500">({option.count})</span>
                              )}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Degree Filter */}
                <div className="mb-6">
                  <button
                    onClick={() => toggleSection('degree')}
                    className="flex items-center justify-between w-full p-3 bg-gradient-to-r from-gray-50 to-white border border-gray-200 rounded-xl hover:border-[#667eea]/50 transition-all duration-200 mb-3"
                  >
                    <div className="flex items-center">
                      <GraduationCap className="h-4 w-4 text-gray-500 mr-2" />
                      <span className="font-medium text-gray-700">Degree</span>
                      {filters.degree.length > 0 && (
                        <span className="ml-2 px-2 py-0.5 bg-[#667eea] text-white text-xs rounded-full">
                          {filters.degree.length}
                        </span>
                      )}
                    </div>
                    {openSections.degree ? (
                      <ChevronUp className="h-4 w-4 text-gray-500" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-gray-500" />
                    )}
                  </button>
                  
                  {openSections.degree && (
                    <div className="pl-2">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs text-gray-500">
                          {filterOptions.degree.length} options
                        </span>
                        {filters.degree.length > 0 && (
                          <button
                            onClick={() => clearFilterSection('degree')}
                            className="text-xs text-[#667eea] hover:text-[#764ba2]"
                          >
                            Clear
                          </button>
                        )}
                      </div>
                      <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                        {filterOptions.degree.map((option, index) => (
                          <div key={option.label + index} className="flex items-center p-2 hover:bg-gray-50 rounded-lg transition-all duration-200">
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
                <div className="mb-6">
                  <button
                    onClick={() => toggleSection('courses')}
                    className="flex items-center justify-between w-full p-3 bg-gradient-to-r from-gray-50 to-white border border-gray-200 rounded-xl hover:border-[#667eea]/50 transition-all duration-200 mb-3"
                  >
                    <div className="flex items-center">
                      <BookOpen className="h-4 w-4 text-gray-500 mr-2" />
                      <span className="font-medium text-gray-700">Courses</span>
                      {filters.courses.length > 0 && (
                        <span className="ml-2 px-2 py-0.5 bg-[#667eea] text-white text-xs rounded-full">
                          {filters.courses.length}
                        </span>
                      )}
                    </div>
                    {openSections.courses ? (
                      <ChevronUp className="h-4 w-4 text-gray-500" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-gray-500" />
                    )}
                  </button>
                  
                  {openSections.courses && (
                    <div className="pl-2">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs text-gray-500">
                          {filterOptions.courses.length} options
                        </span>
                        {filters.courses.length > 0 && (
                          <button
                            onClick={() => clearFilterSection('courses')}
                            className="text-xs text-[#667eea] hover:text-[#764ba2]"
                          >
                            Clear
                          </button>
                        )}
                      </div>
                      <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                        {filterOptions.courses.map((option, index) => (
                          <div key={option.label + index} className="flex items-center p-2 hover:bg-gray-50 rounded-lg transition-all duration-200">
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
                <div className="mb-6">
                  <button
                    onClick={() => toggleSection('employmentType')}
                    className="flex items-center justify-between w-full p-3 bg-gradient-to-r from-gray-50 to-white border border-gray-200 rounded-xl hover:border-[#667eea]/50 transition-all duration-200 mb-3"
                  >
                    <div className="flex items-center">
                      <Briefcase className="h-4 w-4 text-gray-500 mr-2" />
                      <span className="font-medium text-gray-700">Employment Type</span>
                      {filters.employmentType.length > 0 && (
                        <span className="ml-2 px-2 py-0.5 bg-[#667eea] text-white text-xs rounded-full">
                          {filters.employmentType.length}
                        </span>
                      )}
                    </div>
                    {openSections.employmentType ? (
                      <ChevronUp className="h-4 w-4 text-gray-500" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-gray-500" />
                    )}
                  </button>
                  
                  {openSections.employmentType && (
                    <div className="pl-2">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs text-gray-500">
                          {filterOptions.employmentType.length} options
                        </span>
                        {filters.employmentType.length > 0 && (
                          <button
                            onClick={() => clearFilterSection('employmentType')}
                            className="text-xs text-[#667eea] hover:text-[#764ba2]"
                          >
                            Clear
                          </button>
                        )}
                      </div>
                      <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                        {filterOptions.employmentType.map((option, index) => (
                          <div key={option.label + index} className="flex items-center p-2 hover:bg-gray-50 rounded-lg transition-all duration-200">
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
                <div className="mb-6">
                  <button
                    onClick={() => toggleSection('location')}
                    className="flex items-center justify-between w-full p-3 bg-gradient-to-r from-gray-50 to-white border border-gray-200 rounded-xl hover:border-[#667eea]/50 transition-all duration-200 mb-3"
                  >
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 text-gray-500 mr-2" />
                      <span className="font-medium text-gray-700">Location</span>
                      {filters.location && filters.location !== '' && filters.location !== 'Multi - Select' && (
                        <span className="ml-2 px-2 py-0.5 bg-[#667eea] text-white text-xs rounded-full">
                          1
                        </span>
                      )}
                    </div>
                    {openSections.location ? (
                      <ChevronUp className="h-4 w-4 text-gray-500" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-gray-500" />
                    )}
                  </button>
                  
                  {openSections.location && (
                    <div className="pl-2">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs text-gray-500">Select location</span>
                        {filters.location && filters.location !== '' && (
                          <button
                            onClick={() => handleFilterChange('location', '')}
                            className="text-xs text-[#667eea] hover:text-[#764ba2]"
                          >
                            Clear
                          </button>
                        )}
                      </div>
                      <select
                        value={filters.location}
                        onChange={(e) => handleFilterChange('location', e.target.value)}
                        className="w-full p-3 bg-gradient-to-r from-gray-50 to-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#667eea]/50 focus:border-transparent focus:outline-none transition-all duration-200"
                      >
                        <option value="">Select Location</option>
                        <option value="Multi - Select">Multi - Select</option>
                        {/* Add actual locations from data */}
                      </select>
                    </div>
                  )}
                </div>

                {/* College Name Filter */}
                <div>
                  <button
                    onClick={() => toggleSection('college')}
                    className="flex items-center justify-between w-full p-3 bg-gradient-to-r from-gray-50 to-white border border-gray-200 rounded-xl hover:border-[#667eea]/50 transition-all duration-200 mb-3"
                  >
                    <div className="flex items-center">
                      <Search className="h-4 w-4 text-gray-500 mr-2" />
                      <span className="font-medium text-gray-700">College Name</span>
                      {filters.college && filters.college !== '' && filters.college !== 'Multi - Select' && (
                        <span className="ml-2 px-2 py-0.5 bg-[#667eea] text-white text-xs rounded-full">
                          1
                        </span>
                      )}
                    </div>
                    {openSections.college ? (
                      <ChevronUp className="h-4 w-4 text-gray-500" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-gray-500" />
                    )}
                  </button>
                  
                  {openSections.college && (
                    <div className="pl-2">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs text-gray-500">Search college name</span>
                        {filters.college && filters.college !== '' && (
                          <button
                            onClick={() => handleFilterChange('college', '')}
                            className="text-xs text-[#667eea] hover:text-[#764ba2]"
                          >
                            Clear
                          </button>
                        )}
                      </div>
                      <input
                        type="text"
                        value={filters.college}
                        onChange={(e) => handleFilterChange('college', e.target.value)}
                        placeholder="Type college name..."
                        className="w-full p-3 bg-gradient-to-r from-gray-50 to-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#667eea]/50 focus:border-transparent focus:outline-none transition-all duration-200"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* College Cards Grid */}
          <div className="flex-1">
            {filteredColleges.length > 0 ? (
              <div className="bg-white/90 backdrop-blur-sm border border-gray-100 rounded-2xl shadow-lg p-6 h-full">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredColleges.map(college => (
                    <CollegeCard
                      key={college._id || college.id}
                      college={college}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-white/90 backdrop-blur-sm border border-gray-100 rounded-2xl shadow-lg p-12 text-center flex flex-col items-center justify-center h-full">
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
    </div>
  );
};

export default EmployerListingPage;