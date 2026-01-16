import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, ChevronUp, X, Filter, MapPin, Search, Briefcase, Calendar, TrendingUp, RefreshCw, AlertCircle, Building, DollarSign, Clock, Users, GraduationCap, BookOpen } from 'lucide-react';
import JobCard from '@/components/student/studentDashboard/offCampusListing/JobCard';
import { getRelaventOffcampusOpportunity } from '@/lib/User_AxiosInstance';
import { City } from 'country-state-city';
import CreatableSelect from 'react-select/creatable';

function FOffCampusListings() {
  const [offCampusJobs, setOffCampusJobs] = useState([]);
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
  const [sortBy, setSortBy] = useState('newest');

  // State for dropdown visibility
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
      { label: 'Work from office', count: 28692 },
      { label: 'Hybrid', count: 756 },
      { label: 'Remote', count: 709 },
      { label: 'On-site', count: 10 }
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

  const navigate = useNavigate();

  const handleJobClick = (jobId) => {
    navigate(`/fresher-dashboard/Off-campus/${jobId}`);
  };

  const fetchOffcampusOpportunity = async () => {
    try {
      setIsLoading(true);
      const response = await getRelaventOffcampusOpportunity();
      const fetchedJobs = response.data?.data || [];
      setOffCampusJobs(fetchedJobs);
      setFilteredJobs(fetchedJobs);
      
      if (fetchedJobs.length > 0) {
        extractFilterOptions(fetchedJobs);
      }
      setError(null);
    } catch (error) {
      setError('Failed to load jobs. Please try again later.')
      console.log(error);
      setOffCampusJobs([]);
      setFilteredJobs([]);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchOffcampusOpportunity();
  }, []);

 

{/*const extractFilterOptions = (jobsData) => {
  const degrees = new Set();
  const courses = new Set();
  const employmentTypes = new Set();

  jobsData.forEach(job => {
    // DEGREE
    if (Array.isArray(job.education?.degree)) {
      job.education.degree.forEach(deg => {
        if (typeof deg === "string") {
          degrees.add(deg.trim());
        }
      });
    } else if (typeof job.education?.degree === "string") {
      degrees.add(job.education.degree.trim());
    }

    // COURSE
    if (job.education?.course) {
      courses.add(job.education.course.trim());
    }

    // EMPLOYMENT TYPE
    if (Array.isArray(job.employmentType)) {
      job.employmentType.forEach(type => {
        if (typeof type === "string") {
          employmentTypes.add(type.trim());
        }
      });
    } else if (typeof job.employmentType === "string") {
      employmentTypes.add(job.employmentType.trim());
    }
  });

  setFilterOptions(prev => ({
    ...prev,
    // Only update if we found degrees, otherwise keep default
    degree: degrees.size > 0 
      ? Array.from(degrees).map(label => ({ label }))
      : prev.degree,  // ✅ Keep default values if no data found
    // Uncomment this if you want to extract courses from API
    // courses: Array.from(courses).map(label => ({ label })),
    employmentType: employmentTypes.size > 0
      ? Array.from(employmentTypes).map(label => ({ label }))
      : prev.employmentType,  // ✅ Keep default values if no data found
  }));
};*/}

const extractFilterOptions = (jobsData) => {
  const degrees = new Set();
  const courses = new Set();
  const employmentTypes = new Set();

  jobsData.forEach(job => {
    // Extract courses from API's "degree" field
    if (Array.isArray(job.degree)) {
      job.degree.forEach(deg => {
        if (typeof deg === "string") {
          courses.add(deg.trim()); // ✅ Add to courses, not degrees
        }
      });
    }

    // EMPLOYMENT TYPE
    if (Array.isArray(job.employmentType)) {
      job.employmentType.forEach(type => {
        if (typeof type === "string") {
          employmentTypes.add(type.trim());
        }
      });
    } else if (typeof job.employmentType === "string") {
      employmentTypes.add(job.employmentType.trim());
    }
  });

  setFilterOptions(prev => ({
    ...prev,
    // Keep static degree types
    degree: prev.degree, // Polytechnic, ITI, Diploma, Undergraduate, Postgraduate
    // Update courses dynamically from API
    courses: courses.size > 0
      ? Array.from(courses).map(label => ({ label }))
      : prev.courses,
    employmentType: employmentTypes.size > 0
      ? Array.from(employmentTypes).map(label => ({ label }))
      : prev.employmentType,
  }));
};


  useEffect(() => {
    if (!Array.isArray(offCampusJobs)) {
      setFilteredJobs([]);
      return;
    }

    let result = [...offCampusJobs];

    // Apply degree filters
    if (filters.degree.length > 0) {
  result = result.filter(job =>
    filters.degree.includes(job.education?.degree)
  );
}

    // Apply course filters - FILTER BY API's "degree" field
    if (filters.courses.length > 0) {
      result = result.filter(job =>
        Array.isArray(job.degree) &&
        filters.courses.some(selectedCourse =>
          job.degree.some(apiDegree => 
            apiDegree.toLowerCase().includes(selectedCourse.toLowerCase()) ||
            selectedCourse.toLowerCase().includes(apiDegree.toLowerCase())
          )
        )
      );
    }



    // Apply employment type filter
    if (filters.employmentType.length > 0) {
      result = result.filter(job => {
        if (Array.isArray(job.employmentType)) {
          return filters.employmentType.some(type =>
            job.employmentType.includes(type)
          );
        }
        return filters.employmentType.includes(job.employmentType);
      });
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

    if (filters.workMode.length > 0) {
      result = result.filter(job =>
        filters.workMode.some(mode => job.workMode === mode)
      );
    }

    if (filters.internship) {
      result = result.filter(job => job.jobType === 'Internship');
    }

    if (filters.fullTime) {
      result = result.filter(job => job.jobType === 'Full-time');
    }

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
    } else if (sortBy === 'salary') {
      result.sort((a, b) => (b.salaryRange?.max || 0) - (a.salaryRange?.max || 0));
    } else if (sortBy === 'deadline') {
      result.sort((a, b) => new Date(a.applicationDeadline || 0) - new Date(b.applicationDeadline || 0));
    }

    setFilteredJobs(result);
  }, [filters, offCampusJobs, sortBy]);

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
      location: [],
      company: '',
      employmentType: [],
      internship: false,
      fullTime: false
    });
    setShowMainFilter(false);
    setOpenSubDropdowns({
      workMode: false,
      degree: false,
      courses: false,
      employmentType: false,
      location: false,
      company: false
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#667eea]/10 via-[#f093fb]/5 to-[#764ba2]/10 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#667eea] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading opportunities...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#667eea]/10 via-[#f093fb]/5 to-[#764ba2]/10 flex items-center justify-center">
        <div className="bg-white/90 backdrop-blur-sm border border-white/50 rounded-2xl shadow-lg shadow-purple-50/50 p-8 max-w-md text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#fca5a5]/30 to-[#ef4444]/20 rounded-full mb-4">
            <AlertCircle className="w-8 h-8 text-[#ef4444]" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{error}</h3>
          <button
            onClick={fetchOffcampusOpportunity}
            className="mt-4 px-6 py-3 bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white rounded-xl hover:shadow-lg hover:shadow-[#667eea]/40 transition-all duration-200"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#667eea]/10 via-[#f093fb]/5 to-[#764ba2]/10">
      {/* Pastel blur background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#667eea]/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 -left-20 w-60 h-60 bg-[#f093fb]/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-1/3 w-40 h-40 bg-[#764ba2]/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/4 right-1/4 w-48 h-48 bg-[#a5b4fc]/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/3 left-1/4 w-56 h-56 bg-[#fde68a]/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 pt-20">
        {/* Header Section */}
        <div className="mb-8 -mt-10">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-white/80 to-white/60 backdrop-blur-sm rounded-2xl"></div>
            <div className="relative flex flex-col lg:flex-row lg:items-center justify-between py-6 px-6 gap-4">
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent">
                  Off-Campus Jobs based on your preferences
                </h1>
                <p className="text-gray-600 mt-2">
                  Discover opportunities that match your skills and career goals
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white/90 backdrop-blur-sm border border-white/50 rounded-xl shadow-lg shadow-purple-100/50 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Opportunities</p>
                <p className="text-2xl font-bold text-[#667eea]">{offCampusJobs.length}</p>
              </div>
              <div className="p-2 bg-gradient-to-br from-[#a5b4fc]/30 to-[#667eea]/20 rounded-lg">
                <Building className="w-5 h-5 text-[#667eea]" />
              </div>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-sm border border-white/50 rounded-xl shadow-lg shadow-emerald-100/50 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Applications</p>
                <p className="text-2xl font-bold text-[#10b981]">0</p>
              </div>
              <div className="p-2 bg-gradient-to-br from-[#a7f3d0]/30 to-[#10b981]/20 rounded-lg">
                <Clock className="w-5 h-5 text-[#10b981]" />
              </div>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-sm border border-white/50 rounded-xl shadow-lg shadow-amber-100/50 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Shortlisted</p>
                <p className="text-2xl font-bold text-[#f59e0b]">0</p>
              </div>
              <div className="p-2 bg-gradient-to-br from-[#fde68a]/30 to-[#f59e0b]/20 rounded-lg">
                <TrendingUp className="w-5 h-5 text-[#f59e0b]" />
              </div>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-sm border border-white/50 rounded-xl shadow-lg shadow-pink-100/50 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Interviews</p>
                <p className="text-2xl font-bold text-[#ec4899]">0</p>
              </div>
              <div className="p-2 bg-gradient-to-br from-[#f9a8d4]/30 to-[#ec4899]/20 rounded-lg">
                <Users className="w-5 h-5 text-[#ec4899]" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Filter Section with Dropdown System */}
        <div className="mb-8">
          {/* Active Filters Tags */}
          {getActiveFiltersCount() > 0 && (
            <div className="bg-white/90 backdrop-blur-sm border border-white/50 rounded-2xl shadow-lg shadow-purple-50/50 p-4 mb-4">
              <div className="flex items-center flex-wrap gap-2">
                <span className="text-sm font-medium text-gray-700 mr-2">Active filters:</span>
                
                {filters.workMode.map(mode => (
                  <span key={mode} className="inline-flex items-center bg-gradient-to-r from-[#a5b4fc]/20 to-[#667eea]/10 text-[#667eea] px-3 py-1.5 rounded-lg text-sm backdrop-blur-sm">
                    {mode}
                    <button 
                      onClick={() => removeFilter('workMode', mode)}
                      className="ml-2 text-[#667eea] hover:text-[#5b21b6]"
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
                
                {filters.company && filters.company !== 'Multi - Select' && (
                  <span className="inline-flex items-center bg-gradient-to-r from-[#fbcfe8]/20 to-[#f472b6]/10 text-[#f472b6] px-3 py-1.5 rounded-lg text-sm backdrop-blur-sm">
                    Company: {filters.company}
                    <button 
                      onClick={() => removeFilter('company', filters.company)}
                      className="ml-2 text-[#f472b6] hover:text-[#db2777]"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}

                {filters.internship && (
                  <span className="inline-flex items-center bg-gradient-to-r from-[#fbcfe8]/20 to-[#f472b6]/10 text-[#f472b6] px-3 py-1.5 rounded-lg text-sm backdrop-blur-sm">
                    Internship
                    <button 
                      onClick={() => removeFilter('internship', true)}
                      className="ml-2 text-[#f472b6] hover:text-[#db2777]"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}

                {filters.fullTime && (
                  <span className="inline-flex items-center bg-gradient-to-r from-[#a7f3d0]/20 to-[#10b981]/10 text-[#10b981] px-3 py-1.5 rounded-lg text-sm backdrop-blur-sm">
                    Full-time
                    <button 
                      onClick={() => removeFilter('fullTime', true)}
                      className="ml-2 text-[#10b981] hover:text-[#059669]"
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
                  className={`flex items-center gap-2 px-5 py-3 bg-white/90 backdrop-blur-sm border ${showMainFilter ? 'border-[#a5b4fc] ring-2 ring-[#a5b4fc]/10' : 'border-white/50 hover:border-[#a5b4fc]/50'} rounded-xl transition-all duration-200 shadow-sm hover:shadow-md`}
                >
                  <Filter className="h-4 w-4 text-[#667eea]" />
                  <span className="text-sm font-medium text-gray-700">Filter</span>
                  {getActiveFiltersCount() > 0 && (
                    <span className="px-2 py-0.5 bg-gradient-to-r from-[#a5b4fc] to-[#667eea] text-white text-xs rounded-full">
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
                  className="flex items-center gap-2 px-5 py-3 bg-white/90 backdrop-blur-sm border border-white/50 rounded-xl hover:border-[#a5b4fc]/50 transition-all duration-200 appearance-none pr-10 text-sm font-medium text-gray-700 shadow-sm hover:shadow-md"
                >
                  <option value="newest">Sort: Newest First</option>
                  <option value="oldest">Sort: Oldest First</option>
                  <option value="company">Sort: Company Name (A-Z)</option>
                  <option value="salary">Sort: Highest Salary</option>
                  <option value="deadline">Sort: Application Deadline</option>
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
            <div className="mt-4 bg-white/90 backdrop-blur-sm border border-white/50 rounded-2xl shadow-lg shadow-purple-50/50 relative p-6 z-50">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative">
                {/* Work Mode Filter */}
                <div className="relative">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <Briefcase className="h-4 w-4 text-[#667eea] mr-2" />
                      <span className="text-sm font-medium text-gray-700">Work Mode</span>
                      {filters.workMode.length > 0 && (
                        <span className="ml-2 px-2 py-0.5 bg-gradient-to-r from-[#a5b4fc] to-[#667eea] text-white text-xs rounded-full">
                          {filters.workMode.length}
                        </span>
                      )}
                    </div>
                    {filters.workMode.length > 0 && (
                      <button
                        onClick={() => clearFilterSection('workMode')}
                        className="text-xs text-[#667eea] hover:text-[#5b21b6] font-medium"
                      >
                        Clear
                      </button>
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
                          <div key={option.label + index} className="flex items-center justify-between p-2 hover:bg-white/30 rounded transition-all duration-200">
                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                id={`workMode-${option.label}-${index}`}
                                checked={filters.workMode.includes(option.label)}
                                onChange={() => handleFilterChange('workMode', option.label)}
                                className="h-4 w-4 text-[#667eea] focus:ring-[#a5b4fc]/50 border-gray-300 rounded"
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
                    <div className="absolute z-[100] w-full mt-2 p-3 bg-white backdrop-blur-sm rounded-lg border border-white/50 max-h-60 overflow-y-auto"  >
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
                    <div className="absolute z-[100] w-full mt-2 p-3 bg-white/50 backdrop-blur-sm rounded-lg border border-white/50 max-h-60 overflow-y-auto">
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
                    <div className="absolute z-[100] w-full mt-2 p-3 bg-white backdrop-blur-sm rounded-lg border border-white/50 max-h-60 overflow-y-auto">
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

        {/* Results Header */}
        <div className="mb-6">
          <div className="bg-white/90 backdrop-blur-sm border border-white/50 rounded-2xl shadow-lg shadow-purple-50/50 p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Showing {filteredJobs.length} of {offCampusJobs.length} Opportunities
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Filtered results based on your preferences
                </p>
              </div>
              
              <div className="text-sm text-gray-600">
                <span className="font-medium">Sort by:</span>{' '}
                {sortBy === 'newest' ? 'Newest First' : 
                 sortBy === 'oldest' ? 'Oldest First' : 
                 sortBy === 'company' ? 'Company Name (A-Z)' : 
                 sortBy === 'salary' ? 'Highest Salary' : 
                 'Application Deadline'}
              </div>
            </div>
          </div>
        </div>

        {/* Jobs Cards */}
        <div className="bg-white/90 backdrop-blur-sm border border-white/50 rounded-2xl shadow-lg shadow-purple-50/50 p-6 min-h-[600px]">
          {filteredJobs.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredJobs.map(job => (
                  <div
                    key={job._id}
                    className="h-full flex transform transition-all duration-200 hover:scale-[1.02]"
                  >
                    <div className="w-full" onClick={() => handleJobClick(job._id)}>
                      <JobCard job={job} />
                    </div>
                  </div>
                ))}
              </div>

              {/* View All Button */}
              <div className="mt-10 text-center">
                <button className="px-8 py-3.5 bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white rounded-xl hover:shadow-lg hover:shadow-[#667eea]/40 transition-all duration-200 text-base font-medium">
                  View All Opportunities
                </button>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-[#fde68a]/30 to-[#f59e0b]/20 mb-6">
                <Building className="h-12 w-12 text-[#f59e0b]" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">No Opportunities Found</h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto text-lg">
                We couldn't find any jobs matching your preferences. Try adjusting your search criteria.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <button
                  onClick={clearAllFilters}
                  className="px-8 py-3.5 bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white rounded-xl hover:shadow-lg hover:shadow-[#667eea]/40 transition-all duration-200 text-base font-medium"
                >
                  Reset All Filters
                </button>
                <button
                  onClick={fetchOffcampusOpportunity}
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

export default FOffCampusListings;