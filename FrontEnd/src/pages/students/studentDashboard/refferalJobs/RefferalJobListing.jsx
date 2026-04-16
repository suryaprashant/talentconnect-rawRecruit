import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import JobListSection from '@/components/student/studentDashboard/referralJobs/JobListSection';
import { getReferralJobListing } from '@/lib/User_AxiosInstance';
import { 
  ChevronDown, 
  ChevronUp, 
  X, 
  Filter, 
  MapPin, 
  Search, 
  Briefcase, 
  Calendar, 
  TrendingUp, 
  RefreshCw, 
  AlertCircle, 
  Building, 
  DollarSign, 
  Clock, 
  Users, 
  GraduationCap, 
  BookOpen,
  Star,
  Target,
  Award
} from 'lucide-react';

const StudentRefferalJobListings = () => {
  const [profileJobs, setProfileJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [filters, setFilters] = useState({
    workMode: [],
    degree: [],
    courses: [],
    employmentType: [],
    location: '',
    company: '',
    referral: false,
    fullTime: false
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
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
      'Part-time',
      'Contract'
    ]
  });

  const navigate = useNavigate();

  const fetchInternships = async () => {
    try {
      setIsLoading(true);
      const response = await getReferralJobListing();
      const fetchedJobs = response.data?.data || [];
      setProfileJobs(fetchedJobs);
      setFilteredJobs(fetchedJobs);
      
      if (fetchedJobs.length > 0) {
        extractFilterOptions(fetchedJobs);
      }
      setError(null);
    } catch (error) {
      setError('Failed to load referral jobs. Please try again later.');
      console.error('Error fetching referral jobs:', error);
      setProfileJobs([]);
      setFilteredJobs([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInternships();
  }, []);

  const extractFilterOptions = (jobsData) => {
    const workModes = new Map();
    const degrees = new Set();
    const courses = new Set();
    const employmentTypes = new Set();

    jobsData.forEach(job => {
      if (job.workMode) {
        const mode = job.workMode;
        workModes.set(mode, (workModes.get(mode) || 0) + 1);
      }
      
      if (job.qualification) {
        if (Array.isArray(job.qualification)) {
          job.qualification.forEach(deg => {
            if (deg) degrees.add(deg.trim());
          });
        } else if (typeof job.qualification === 'string') {
          if (job.qualification) degrees.add(job.qualification.trim());
        }
      }
      
      if (job.course) {
        if (Array.isArray(job.course)) {
          job.course.forEach(course => {
            if (course) courses.add(course.trim());
          });
        } else if (typeof job.course === 'string') {
          if (job.course) courses.add(job.course.trim());
        }
      }
      
      if (job.jobType) {
        const type = job.jobType;
        employmentTypes.add(type);
      }
    });

    setFilterOptions(prev => ({
      ...prev,
      workMode: Array.from(workModes.entries()).map(([label, count]) => ({ label, count })),
      degree: Array.from(degrees).filter(label => label).map(label => label),
      courses: Array.from(courses).filter(label => label).map(label => label),
      employmentType: Array.from(employmentTypes).filter(label => label).map(label => label)
    }));
  };

  useEffect(() => {
    if (!Array.isArray(profileJobs)) {
      setFilteredJobs([]);
      return;
    }

    let result = [...profileJobs];

    if (filters.workMode.length > 0) {
      result = result.filter(job =>
        filters.workMode.some(mode => job.workMode === mode)
      );
    }

    if (filters.degree.length > 0) {
      result = result.filter(job => {
        const jobQualifications = Array.isArray(job.qualification) 
          ? job.qualification 
          : job.qualification ? [job.qualification] : [];
        
        return jobQualifications.some(qual => {
          const normalizedQual = qual?.toLowerCase().replace(/[\s.\-]/g, "").trim();
          return filters.degree.some(filterDeg => {
            const normalizedFilterDeg = filterDeg?.toLowerCase().replace(/[\s.\-]/g, "").trim();
            return normalizedQual === normalizedFilterDeg;
          });
        });
      });
    }

    if (filters.courses.length > 0) {
      result = result.filter(job => {
        const jobCourses = Array.isArray(job.course) 
          ? job.course 
          : job.course ? [job.course] : [];
        
        return jobCourses.some(course => {
          const normalizedCourse = course?.toLowerCase().replace(/[\s.\-]/g, "").trim();
          return filters.courses.some(filterCourse => {
            const normalizedFilterCourse = filterCourse?.toLowerCase().replace(/[\s.\-]/g, "").trim();
            return normalizedCourse === normalizedFilterCourse;
          });
        });
      });
    }

    if (filters.employmentType && filters.employmentType.length > 0) {
      result = result.filter(job =>
        filters.employmentType.some(filterValue =>
          job.jobType?.toLowerCase() === filterValue.toLowerCase()
        )
      );
    }

    if (filters.location && filters.location !== 'Multi - Select') {
      result = result.filter(job => {
        const jobLocation = job.location || job.workLocation || job.jobLocation;
        return jobLocation
          ? jobLocation.toLowerCase().includes(filters.location.toLowerCase())
          : false;
      });
    }

    if (filters.company && filters.company !== 'Multi - Select') {
      result = result.filter(job => {
        const companyName = job.companyName || job.company;
        return companyName
          ? companyName.toLowerCase().includes(filters.company.toLowerCase())
          : false;
      });
    }

    if (filters.referral) {
      result = result.filter(job => job.jobType === 'Referral' || job.isReferral === true);
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
        const nameA = a.companyName || a.company || '';
        const nameB = b.companyName || b.company || '';
        return nameA.localeCompare(nameB);
      });
    } else if (sortBy === 'salary') {
      result.sort((a, b) => (b.salaryRange?.max || b.salary || 0) - (a.salaryRange?.max || a.salary || 0));
    }

    setFilteredJobs(result);
  }, [filters, profileJobs, sortBy]);

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
      } else if (filterType === 'referral' || filterType === 'fullTime') {
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
    } else if (filterType === 'referral' || filterType === 'fullTime') {
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
      company: '',
      employmentType: [],
      referral: false,
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

  const getActiveFiltersCount = () => {
    let count = 0;
    Object.entries(filters).forEach(([key, value]) => {
      if (key === 'referral' || key === 'fullTime') {
        if (value) count++;
      } else if (Array.isArray(value)) {
        count += value.length;
      } else if (value && value !== '' && value !== 'Multi - Select') {
        count += 1;
      }
    });
    return count;
  };

  const toggleReferralFilter = () => {
    setFilters(prev => ({
      ...prev,
      referral: !prev.referral
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
      <div className="min-h-screen bg-gradient-to-br from-[#143694]/10 via-[#f093fb]/5 to-[#1e4ed8]/10 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#143694] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading referral jobs...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#143694]/10 via-[#f093fb]/5 to-[#1e4ed8]/10 flex items-center justify-center">
        <div className="bg-white/90 backdrop-blur-sm border border-white/50 rounded-2xl shadow-lg shadow-purple-50/50 p-8 max-w-md text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#fca5a5]/30 to-[#ef4444]/20 rounded-full mb-4">
            <AlertCircle className="w-8 h-8 text-[#ef4444]" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{error}</h3>
          <button
            onClick={fetchInternships}
            className="mt-4 px-6 py-3 bg-gradient-to-r from-[#143694] to-[#1e4ed8] text-white rounded-xl hover:shadow-lg hover:shadow-[#143694]/40 transition-all duration-200"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#143694]/10 via-[#f093fb]/5 to-[#1e4ed8]/10">
      {/* Pastel blur background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#143694]/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 -left-20 w-60 h-60 bg-[#f093fb]/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-1/3 w-40 h-40 bg-[#1e4ed8]/10 rounded-full blur-3xl"></div>
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
                <h1 className="text-3xl font-bold bg-gradient-to-r from-[#143694] to-[#1e4ed8] bg-clip-text text-transparent">
                  Referral Opportunities
                </h1>
                <p className="text-gray-600 mt-2">
                  Explore job opportunities tailored to your academic background and skills
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={fetchInternships}
                  className="flex items-center gap-2 px-5 py-3 bg-white/90 backdrop-blur-sm border border-white/50 text-gray-700 rounded-xl hover:shadow-md hover:border-[#a5b4fc]/50 transition-all duration-200"
                >
                  <RefreshCw className="h-4 w-4" />
                  <span className="text-sm font-medium">Refresh</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white/90 backdrop-blur-sm border border-white/50 rounded-xl shadow-lg shadow-purple-100/50 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Jobs</p>
                <p className="text-2xl font-bold text-[#143694]">{profileJobs.length}</p>
              </div>
              <div className="p-2 bg-gradient-to-br from-[#a5b4fc]/30 to-[#143694]/20 rounded-lg">
                <Building className="w-5 h-5 text-[#143694]" />
              </div>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-sm border border-white/50 rounded-xl shadow-lg shadow-pink-100/50 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Showing Results</p>
                <p className="text-2xl font-bold text-[#ec4899]">{filteredJobs.length}</p>
              </div>
              <div className="p-2 bg-gradient-to-br from-[#f9a8d4]/30 to-[#ec4899]/20 rounded-lg">
                <Target className="w-5 h-5 text-[#ec4899]" />
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
                <Filter className="w-5 h-5 text-[#f59e0b]" />
              </div>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-sm border border-white/50 rounded-xl shadow-lg shadow-emerald-100/50 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Referral Jobs</p>
                <p className="text-2xl font-bold text-[#10b981]">
                  {profileJobs.filter(job => job.isReferral || job.jobType === 'Referral').length}
                </p>
              </div>
              <div className="p-2 bg-gradient-to-br from-[#a7f3d0]/30 to-[#10b981]/20 rounded-lg">
                <Star className="w-5 h-5 text-[#10b981]" />
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
                  <span key={mode} className="inline-flex items-center bg-gradient-to-r from-[#a5b4fc]/20 to-[#143694]/10 text-[#143694] px-3 py-1.5 rounded-lg text-sm backdrop-blur-sm">
                    {mode}
                    <button 
                      onClick={() => removeFilter('workMode', mode)}
                      className="ml-2 text-[#143694] hover:text-[#5b21b6]"
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

                {filters.referral && (
                  <span className="inline-flex items-center bg-gradient-to-r from-[#fbcfe8]/20 to-[#f472b6]/10 text-[#f472b6] px-3 py-1.5 rounded-lg text-sm backdrop-blur-sm">
                    Referral
                    <button 
                      onClick={() => removeFilter('referral', true)}
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
            <div className="mt-4 bg-white/90 backdrop-blur-sm border border-white/50 rounded-2xl shadow-lg shadow-purple-50/50 p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Work Mode Filter */}
                <div className="relative">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <Briefcase className="h-4 w-4 text-[#143694] mr-2" />
                      <span className="text-sm font-medium text-gray-700">Work Mode</span>
                      {filters.workMode.length > 0 && (
                        <span className="ml-2 px-2 py-0.5 bg-gradient-to-r from-[#a5b4fc] to-[#143694] text-white text-xs rounded-full">
                          {filters.workMode.length}
                        </span>
                      )}
                    </div>
                    {filters.workMode.length > 0 && (
                      <button
                        onClick={() => clearFilterSection('workMode')}
                        className="text-xs text-[#143694] hover:text-[#5b21b6] font-medium"
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
                                className="h-4 w-4 text-[#143694] focus:ring-[#a5b4fc]/50 border-gray-300 rounded"
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
                        className="w-full p-3 bg-white/80 backdrop-blur-sm border border-white/50 rounded-lg focus:ring-2 focus:ring-[#a5b4fc]/50 focus:border-transparent focus:outline-none transition-all duration-200 text-sm"
                      >
                        <option value="">Select Location</option>
                        <option value="Multi - Select">Multi - Select</option>
                      </select>
                    </div>
                  )}
                </div>

                {/* Company Filter */}
                <div className="relative">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <Search className="h-4 w-4 text-[#f472b6] mr-2" />
                      <span className="text-sm font-medium text-gray-700">Company Name</span>
                      {filters.company && filters.company !== '' && filters.company !== 'Multi - Select' && (
                        <span className="ml-2 px-2 py-0.5 bg-[#f472b6] text-white text-xs rounded-full">
                          1
                        </span>
                      )}
                    </div>
                    {filters.company && filters.company !== '' && (
                      <button
                        onClick={() => handleFilterChange('company', '')}
                        className="text-xs text-[#f472b6] hover:text-[#db2777] font-medium"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                  
                  <button
                    onClick={() => toggleSubDropdown('company')}
                    className="flex items-center justify-between w-full p-3 bg-gradient-to-r from-white/50 to-white/30 border border-white/50 rounded-xl hover:border-[#fbcfe8]/50 transition-all duration-200 mb-2 backdrop-blur-sm"
                  >
                    <span className="text-sm text-gray-700">Search Company Name</span>
                    <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform duration-200 ${openSubDropdowns.company ? 'transform rotate-180' : ''}`} />
                  </button>
                  
                  {openSubDropdowns.company && (
                    <div className="mt-2 p-3 bg-white/50 backdrop-blur-sm rounded-lg border border-white/50">
                      <input
                        type="text"
                        value={filters.company}
                        onChange={(e) => handleFilterChange('company', e.target.value)}
                        placeholder="Type company name..."
                        className="w-full p-3 bg-white/80 backdrop-blur-sm border border-white/50 rounded-lg focus:ring-2 focus:ring-[#a5b4fc]/50 focus:border-transparent focus:outline-none transition-all duration-200 text-sm"
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
                  Showing {filteredJobs.length} of {profileJobs.length} Referral Jobs
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Filtered results based on your academic background and skills
                </p>
              </div>
              
              <div className="text-sm text-gray-600">
                <span className="font-medium">Sort by:</span>{' '}
                {sortBy === 'newest' ? 'Newest First' : 
                 sortBy === 'oldest' ? 'Oldest First' : 
                 sortBy === 'company' ? 'Company Name (A-Z)' : 
                 'Highest Salary'}
              </div>
            </div>
          </div>
        </div>

        {/* Job Cards Section */}
        <div className="bg-white/90 backdrop-blur-sm border border-white/50 rounded-2xl shadow-lg shadow-purple-50/50 p-6 min-h-[600px]">
          {filteredJobs.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredJobs.map(job => (
                  <div
                    key={job._id}
                    className="h-full flex transform transition-all duration-200 hover:scale-[1.02] cursor-pointer"
                    onClick={() => navigate(`/student-dashboard/Referral/${job._id}`)}
                  >
                    <div className="w-full">
                      {/* Custom Job Card Component */}
                      <div className="bg-gradient-to-br from-white/90 to-white/80 backdrop-blur-sm border border-white/50 rounded-xl shadow-lg shadow-purple-100/50 hover:shadow-xl hover:shadow-purple-200/50 transition-all duration-300 overflow-hidden">
                        {/* Job Header */}
                        <div className="p-5 border-b border-white/50">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h3 className="text-lg font-bold text-gray-900 mb-1">{job.title || job.position}</h3>
                              <div className="flex items-center gap-2 mb-2">
                                <Building className="h-4 w-4 text-[#143694]" />
                                <span className="text-sm text-gray-700 font-medium">{job.companyName || job.company}</span>
                              </div>
                            </div>
                            {(job.isReferral || job.jobType === 'Referral') && (
                              <span className="px-3 py-1 bg-gradient-to-r from-[#a5b4fc]/20 to-[#143694]/10 text-[#143694] text-xs font-medium rounded-full border border-[#a5b4fc]/30">
                                Referral
                              </span>
                            )}
                          </div>
                          
                          <div className="flex flex-wrap gap-2">
                            {job.jobType && (
                              <span className="px-3 py-1 bg-gradient-to-r from-[#f9a8d4]/20 to-[#ec4899]/10 text-[#ec4899] text-xs rounded-lg border border-[#f9a8d4]/30">
                                {job.jobType}
                              </span>
                            )}
                            {job.workMode && (
                              <span className="px-3 py-1 bg-gradient-to-r from-[#fde68a]/20 to-[#f59e0b]/10 text-[#f59e0b] text-xs rounded-lg border border-[#fde68a]/30">
                                {job.workMode}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Job Details */}
                        <div className="p-5">
                          <div className="space-y-3">
                            {job.location && (
                              <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4 text-gray-500" />
                                <span className="text-sm text-gray-700">{job.location}</span>
                              </div>
                            )}
                            
                            {job.salary && (
                              <div className="flex items-center gap-2">
                                <DollarSign className="h-4 w-4 text-gray-500" />
                                <span className="text-sm text-gray-700">{job.salary}</span>
                              </div>
                            )}
                            
                            {job.experience && (
                              <div className="flex items-center gap-2">
                                <Briefcase className="h-4 w-4 text-gray-500" />
                                <span className="text-sm text-gray-700">{job.experience} years</span>
                              </div>
                            )}
                            
                            {job.skills && Array.isArray(job.skills) && job.skills.length > 0 && (
                              <div className="pt-2">
                                <div className="flex flex-wrap gap-1.5">
                                  {job.skills.slice(0, 3).map((skill, index) => (
                                    <span key={index} className="px-2.5 py-1 bg-gray-100 text-gray-700 text-xs rounded-lg">
                                      {skill}
                                    </span>
                                  ))}
                                  {job.skills.length > 3 && (
                                    <span className="px-2.5 py-1 bg-gray-100 text-gray-500 text-xs rounded-lg">
                                      +{job.skills.length - 3} more
                                    </span>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Apply Button */}
                          <div className="mt-6 pt-4 border-t border-white/50">
                            <button className="w-full py-3 bg-gradient-to-r from-[#143694] to-[#1e4ed8] text-white rounded-xl hover:shadow-lg hover:shadow-[#143694]/40 transition-all duration-200 text-sm font-medium">
                              View Details
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* View All Button */}
              <div className="mt-10 text-center">
                <button className="px-8 py-3.5 bg-gradient-to-r from-[#143694] to-[#1e4ed8] text-white rounded-xl hover:shadow-lg hover:shadow-[#143694]/40 transition-all duration-200 text-base font-medium">
                  View All Referral Opportunities
                </button>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-[#fde68a]/30 to-[#f59e0b]/20 mb-6">
                <Award className="h-12 w-12 text-[#f59e0b]" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">No Referral Jobs Found</h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto text-lg">
                No referral jobs match your current filter criteria. Try adjusting your filters or check back later for new opportunities.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <button
                  onClick={clearAllFilters}
                  className="px-8 py-3.5 bg-gradient-to-r from-[#143694] to-[#1e4ed8] text-white rounded-xl hover:shadow-lg hover:shadow-[#143694]/40 transition-all duration-200 text-base font-medium"
                >
                  Reset All Filters
                </button>
                <button
                  onClick={fetchInternships}
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

export default StudentRefferalJobListings;