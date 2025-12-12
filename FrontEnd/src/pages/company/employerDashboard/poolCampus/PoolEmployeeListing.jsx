import { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, X, Filter, SortAsc, Building2, MapPin, Users, Calendar, Briefcase, Search, GraduationCap, BookOpen, Clock, DollarSign } from 'lucide-react';
import PoolCollegeCard from '@/components/company/employerDashboard/poolCampus/PoolCollegeCard';
import { getPoolCampusForCompany } from '../../../../lib/College_AxiosIntance';

const PoolEmployeeListing = () => {
    const [postings, setPostings] = useState([]);
    const [filteredPostings, setFilteredPostings] = useState([]);
    const [filters, setFilters] = useState({
        workMode: [],
        degree: [],
        courses: [],
        location: '',
        college: '',
        internship: false,
        fullTime: false
    });
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    
    // State for which filter sections are closed
    const [openSections, setOpenSections] = useState({
        workMode: false,
        degree: false,
        courses: false,
        employmentType: false,
        location: false,
        college: false
    });
    
    // Sample filter options
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
        ]
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const response = await getPoolCampusForCompany();
                const fetchedPostings = response.data?.data || [];
                
                setPostings(fetchedPostings);
                setFilteredPostings(fetchedPostings);
                
                // Extract filter options from actual data
                if (fetchedPostings.length > 0) {
                    extractFilterOptions(fetchedPostings);
                }
            } catch (err) {
                setError('Failed to load postings. Please try again later.');
                console.error("Error fetching pool campus data:", err);
                setPostings([]);
                setFilteredPostings([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    const extractFilterOptions = (postingsData) => {
        const workModes = new Map();
        const degrees = new Set();
        const courses = new Set();

        postingsData.forEach(posting => {
            // Count work modes
            if (posting.workMode) {
                workModes.set(posting.workMode, (workModes.get(posting.workMode) || 0) + 1);
            }
            
            // Extract degrees
            if (posting.degree && Array.isArray(posting.degree)) {
                posting.degree.forEach(deg => degrees.add(deg));
            }
            
            // Extract courses
            if (posting.studentStreams && Array.isArray(posting.studentStreams)) {
                posting.studentStreams.forEach(course => courses.add(course));
            }
        });

        setFilterOptions(prev => ({
            ...prev,
            workMode: Array.from(workModes.entries()).map(([label, count]) => ({ label, count })),
            degree: Array.from(degrees).map(label => ({ label })),
            courses: Array.from(courses).map(label => ({ label }))
        }));
    };

    useEffect(() => {
        if (!Array.isArray(postings)) {
            setFilteredPostings([]);
            return;
        }

        let result = [...postings];

        // Apply work mode filters
        if (filters.workMode.length > 0) {
            result = result.filter(posting => filters.workMode.includes(posting.workMode));
        }

        // Apply degree filters
        if (filters.degree.length > 0) {
            result = result.filter(posting =>
                posting.degree && filters.degree.some(deg => posting.degree.includes(deg))
            );
        }

        // Apply course filters
        if (filters.courses.length > 0) {
            result = result.filter(posting =>
                posting.studentStreams && filters.courses.some(course => posting.studentStreams.includes(course))
            );
        }

        // Apply employment type filters
        if (filters.internship && !filters.fullTime) {
            result = result.filter(posting => ['Internship', 'Both'].includes(posting.lookingFor));
        }
        if (filters.fullTime && !filters.internship) {
            result = result.filter(posting => ['Job', 'Both'].includes(posting.lookingFor));
        }

        // Apply location filter
        if (filters.location && filters.location !== 'Multi - Select') {
            result = result.filter(posting => posting.location && posting.location.includes(filters.location));
        }

        // Apply college name filter
        if (filters.college && filters.college.trim() !== '') {
            result = result.filter(posting =>
                posting.collegePosted?.collegeUniversityDetails?.collegeName
                .toLowerCase()
                .includes(filters.college.toLowerCase())
            );
        }

        setFilteredPostings(result);
    }, [filters, postings]);

    const handleFilterChange = (filterType, value) => {
        setFilters(prev => {
            if (Array.isArray(prev[filterType])) {
                const newArray = prev[filterType].includes(value) ?
                    prev[filterType].filter(item => item !== value) :
                    [...prev[filterType], value];
                return { ...prev, [filterType]: newArray };
            } else {
                return { ...prev, [filterType]: value };
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
        if (filterType === 'internship' || filterType === 'fullTime') {
            setFilters(prev => ({
                ...prev,
                [filterType]: false
            }));
        } else {
            setFilters(prev => ({
                ...prev,
                [filterType]: Array.isArray(prev[filterType]) ? [] : ''
            }));
        }
    };

    const clearAllFilters = () => {
        setFilters({
            workMode: [],
            degree: [],
            courses: [],
            location: '',
            college: '',
            internship: false,
            fullTime: false
        });
    };

    const getActiveFiltersCount = () => {
        let count = 0;
        Object.entries(filters).forEach(([key, value]) => {
            if (key === 'internship' || key === 'fullTime') {
                if (value) count += 1;
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
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#667eea]"></div>
                    <p className="mt-4 text-gray-600">Loading pool campus postings...</p>
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
                                    Colleges Posting for Pool-Campus
                                </h1>
                            </div>
                            <p className="text-gray-600">
                                Explore pool-campus drives posted by various colleges.
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
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
                            
                            {/* Work Mode Filters */}
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
                            
                            {/* Degree Filters */}
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
                            
                            {/* Course Filters */}
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
                            
                            {/* Internship Filter */}
                            {filters.internship && (
                                <span className="inline-flex items-center bg-gradient-to-r from-yellow-100 to-yellow-50 text-yellow-700 px-3 py-1.5 rounded-lg text-sm">
                                    Internship
                                    <button 
                                        onClick={() => removeFilter('internship', true)}
                                        className="ml-2 text-yellow-600 hover:text-yellow-800"
                                    >
                                        <X className="h-3 w-3" />
                                    </button>
                                </span>
                            )}
                            
                            {/* Full-time Filter */}
                            {filters.fullTime && (
                                <span className="inline-flex items-center bg-gradient-to-r from-orange-100 to-orange-50 text-orange-700 px-3 py-1.5 rounded-lg text-sm">
                                    Full-time
                                    <button 
                                        onClick={() => removeFilter('fullTime', true)}
                                        className="ml-2 text-orange-600 hover:text-orange-800"
                                    >
                                        <X className="h-3 w-3" />
                                    </button>
                                </span>
                            )}
                            
                            {/* Location Filter */}
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
                            
                            {/* College Name Filter */}
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
                        </div>
                    </div>
                )}

                {/* Main Content - Equal Height Container */}
                <div className="flex flex-col lg:flex-row gap-6 min-h-[600px]">
                    {/* Filter Sidebar - Fixed width with same height */}
                    <div className="lg:w-80 flex-shrink-0">
                        <div className="bg-white/90 backdrop-blur-sm border border-gray-100 rounded-2xl shadow-lg h-full flex flex-col">
                            <div className="p-6 flex-1 overflow-y-auto">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
                                    <span className="text-sm text-gray-500">
                                        {filteredPostings.length} of {postings.length} results
                                    </span>
                                </div>

                                {/* Work Mode Filter Section */}
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

                                {/* Degree Filter Section */}
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

                                {/* Courses Filter Section */}
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

                                {/* Employment Type Filter Section */}
                                <div className="mb-6">
                                    <button
                                        onClick={() => toggleSection('employmentType')}
                                        className="flex items-center justify-between w-full p-3 bg-gradient-to-r from-gray-50 to-white border border-gray-200 rounded-xl hover:border-[#667eea]/50 transition-all duration-200 mb-3"
                                    >
                                        <div className="flex items-center">
                                            <Clock className="h-4 w-4 text-gray-500 mr-2" />
                                            <span className="font-medium text-gray-700">Employment Type</span>
                                            {(filters.internship || filters.fullTime) && (
                                                <span className="ml-2 px-2 py-0.5 bg-[#667eea] text-white text-xs rounded-full">
                                                    {(filters.internship ? 1 : 0) + (filters.fullTime ? 1 : 0)}
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
                                                    2 options
                                                </span>
                                                {(filters.internship || filters.fullTime) && (
                                                    <button
                                                        onClick={() => {
                                                            clearFilterSection('internship');
                                                            clearFilterSection('fullTime');
                                                        }}
                                                        className="text-xs text-[#667eea] hover:text-[#764ba2]"
                                                    >
                                                        Clear
                                                    </button>
                                                )}
                                            </div>
                                            <div className="space-y-2">
                                                <div className="flex items-center p-2 hover:bg-gray-50 rounded-lg transition-all duration-200">
                                                    <input
                                                        type="checkbox"
                                                        id="internship"
                                                        checked={filters.internship}
                                                        onChange={() => handleFilterChange('internship', !filters.internship)}
                                                        className="h-4 w-4 text-[#667eea] focus:ring-[#667eea]/50 border-gray-300 rounded"
                                                    />
                                                    <label 
                                                        htmlFor="internship"
                                                        className="ml-3 text-sm text-gray-700 cursor-pointer flex-1"
                                                    >
                                                        Internship
                                                    </label>
                                                </div>
                                                <div className="flex items-center p-2 hover:bg-gray-50 rounded-lg transition-all duration-200">
                                                    <input
                                                        type="checkbox"
                                                        id="fullTime"
                                                        checked={filters.fullTime}
                                                        onChange={() => handleFilterChange('fullTime', !filters.fullTime)}
                                                        className="h-4 w-4 text-[#667eea] focus:ring-[#667eea]/50 border-gray-300 rounded"
                                                    />
                                                    <label 
                                                        htmlFor="fullTime"
                                                        className="ml-3 text-sm text-gray-700 cursor-pointer flex-1"
                                                    >
                                                        Full-time
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Location Filter Section */}
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
                                            </select>
                                        </div>
                                    )}
                                </div>

                                {/* College Name Filter Section */}
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

                    {/* College Cards Grid - Takes remaining width with same height */}
                    <div className="flex-1">
                        {filteredPostings.length > 0 ? (
                            <div className="bg-white/90 backdrop-blur-sm border border-gray-100 rounded-2xl shadow-lg p-6 h-full">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {filteredPostings.map(posting => (
                                        <PoolCollegeCard
                                            key={posting._id || posting.id}
                                            college={posting}
                                        />
                                    ))}
                                </div>
                                
                                {filteredPostings.length > 0 && (
                                    <div className="mt-8 flex justify-center">
                                        <button className="px-6 py-3 bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white rounded-xl hover:shadow-lg hover:shadow-[#667eea]/30 transition-all duration-300">
                                            View all ({filteredPostings.length})
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="bg-white/90 backdrop-blur-sm border border-gray-100 rounded-2xl shadow-lg p-12 text-center flex flex-col items-center justify-center h-full">
                                <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-r from-gray-100 to-gray-200 mb-6">
                                    <Building2 className="h-12 w-12 text-gray-400" />
                                </div>
                                <h3 className="text-2xl font-semibold text-gray-900 mb-3">No pool campus postings found</h3>
                                <p className="text-gray-600 mb-8 max-w-md">
                                    No pool-campus drives match your current filter criteria. Try adjusting your filters or search criteria to find more options.
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

export default PoolEmployeeListing;