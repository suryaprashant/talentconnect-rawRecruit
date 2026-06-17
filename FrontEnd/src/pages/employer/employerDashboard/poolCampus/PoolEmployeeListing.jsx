// import { useState, useEffect } from 'react';
// import FilterSection from '@/components/company/employerDashboard/FilterSection';
// import PoolCollegeCard from '@/components/company/employerDashboard/poolCampus/PoolCollegeCard';
// import { mockColleges } from '@/constants/mockData';

// const EmployerPoolEmployeeListing = () => {
//   const [colleges, setColleges] = useState([]);
//   const [filteredColleges, setFilteredColleges] = useState([]);
//   const [filters, setFilters] = useState({
//     workMode: [],
//     degree: [],
//     courses: [],
//     location: '',
//     college: '',
//     internship: false,
//     fullTime: false
//   });
  
//   // Simulating data fetch from backend
//   useEffect(() => {
//     // In a real app, this would be an API call
//     setColleges(mockColleges);
//     setFilteredColleges(mockColleges);
//   }, []);

//   // Filter colleges when filters change
//   useEffect(() => {
//     let result = [...colleges];
    
//     // Apply work mode filters
//     if (filters.workMode.length > 0) {
//       result = result.filter(college => 
//         filters.workMode.some(mode => college.workModes.includes(mode))
//       );
//     }
    
//     // Apply degree filters
//     if (filters.degree.length > 0) {
//       result = result.filter(college => 
//         filters.degree.some(deg => college.degrees.includes(deg))
//       );
//     }
    
//     // Apply course filters
//     if (filters.courses.length > 0) {
//       result = result.filter(college => 
//         filters.courses.some(course => college.courses.includes(course))
//       );
//     }
    
//     // Apply internship filter
//     if (filters.internship) {
//       result = result.filter(college => college.hasInternship);
//     }
    
//     // Apply full-time filter
//     if (filters.fullTime) {
//       result = result.filter(college => college.hasFullTime);
//     }
    
//     // Apply location filter
//     if (filters.location && filters.location !== 'Multi - Select') {
//       result = result.filter(college => college.location === filters.location);
//     }
    
//     // Apply college filter
//     if (filters.college && filters.college !== 'Multi - Select') {
//       result = result.filter(college => college.name.includes(filters.college));
//     }
    
//     setFilteredColleges(result);
//   }, [filters, colleges]);

//   const handleFilterChange = (filterType, value) => {
//     setFilters(prev => {
//       if (Array.isArray(prev[filterType])) {
//         // Handle array filters (checkboxes)
//         if (prev[filterType].includes(value)) {
//           return {
//             ...prev,
//             [filterType]: prev[filterType].filter(item => item !== value)
//           };
//         } else {
//           return {
//             ...prev,
//             [filterType]: [...prev[filterType], value]
//           };
//         }
//       } else {
//         // Handle single value filters (dropdowns, text inputs)
//         return {
//           ...prev,
//           [filterType]: value
//         };
//       }
//     });
//   };

//   const handleToggleFilter = (filterType) => {
//     setFilters(prev => ({
//       ...prev,
//       [filterType]: !prev[filterType]
//     }));
//   };

//   const clearFilter = (filterType) => {
//     setFilters(prev => ({
//       ...prev,
//       [filterType]: Array.isArray(prev[filterType]) ? [] : ''
//     }));
//   };

//   const clearAllFilters = () => {
//     setFilters({
//       workMode: [],
//       degree: [],
//       courses: [],
//       location: '',
//       college: '',
//       internship: false,
//       fullTime: false
//     });
//   };

//   return (
//     <div className="container mx-auto px-4 py-6">
//       <h1 className="text-2xl font-bold mb-2">Colleges Posting for On-Campus</h1>
//       <p className="text-gray-600 mb-6">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in arcu.</p>
      
//       <div className="flex flex-wrap items-center justify-between mb-4">
//         <div className="flex flex-wrap items-center gap-2">
//           {filters.internship && (
//             <span className="bg-gray-100 px-3 py-1 rounded-full text-sm flex items-center">
//               Internship
//               <button onClick={() => handleToggleFilter('internship')} className="ml-2 text-gray-500">×</button>
//             </span>
//           )}
//           {filters.fullTime && (
//             <span className="bg-gray-100 px-3 py-1 rounded-full text-sm flex items-center">
//               Full-time
//               <button onClick={() => handleToggleFilter('fullTime')} className="ml-2 text-gray-500">×</button>
//             </span>
//           )}
//           {(filters.internship || filters.fullTime) && (
//             <button onClick={clearAllFilters} className="text-sm text-gray-600 ml-2">Clear all</button>
//           )}
//         </div>
        
//         <div className="flex items-center">
//           <span className="text-sm text-gray-600 mr-4">Showing {filteredColleges.length} of {colleges.length}</span>
//           <div className="relative">
//             <select className="bg-white border border-gray-300 rounded py-1 px-3 appearance-none pr-8">
//               <option>Sort by</option>
//               <option>Newest</option>
//               <option>Oldest</option>
//               <option>A-Z</option>
//             </select>
//             <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
//               <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
//                 <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
//               </svg>
//             </div>
//           </div>
//         </div>
//       </div>
      
//       <div className="flex flex-col md:flex-row gap-6">
//         <div className="w-full md:w-72 flex-shrink-0">
//           <FilterSection 
//             filters={filters}
//             onFilterChange={handleFilterChange}
//             onClearFilter={clearFilter}
//           />
//         </div>
        
//         <div className="flex-grow">
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//             {filteredColleges.map(college => (
//               <PoolCollegeCard
//                 key={college.id}
//                 college={college}
//               />
//             ))}
//           </div>
          
//           <div className="mt-6 flex justify-center">
//             <button className="border border-gray-300 rounded px-4 py-2 text-sm">View all</button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default  EmployerPoolEmployeeListing;



import { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, X, Filter, SortAsc, Building2, MapPin, Users, Calendar, Briefcase, Search, GraduationCap, BookOpen, TrendingUp, RefreshCw, AlertCircle, Building } from 'lucide-react';
import PoolCollegeCard from '@/components/employer/employerDashboard/poolCampus/PoolCollegeCard';
import { getPoolCampusForCompany } from '../../../../lib/College_AxiosIntance';
import EmployerPoolDetailsModal from '@/components/employer/employerDashboard/poolCampus/EmployerPoolDetailsModal';

const PoolCollegeListingPage = ({ compact = false, onPoolSelect, selectedPoolId }) => {
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
  const [sortBy, setSortBy] = useState('newest');
  
  // Modal state
  const [selectedPool, setSelectedPool] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // State for dropdown visibility
  const [showMainFilter, setShowMainFilter] = useState(false);
  const [openSubDropdowns, setOpenSubDropdowns] = useState({
    workMode: false,
    degree: false,
    courses: false,
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
            degree: Array.from(degrees).map(label => label),
            courses: Array.from(courses).map(label => label)
        }));
    };

    useEffect(() => {
        if (!Array.isArray(postings)) {
            setFilteredPostings([]);
            return;
        }

        let result = [...postings];

        if (filters.workMode.length > 0) {
            result = result.filter(posting => filters.workMode.includes(posting.workMode));
        }

        if (filters.degree.length > 0) {
            result = result.filter(posting =>
                posting.degree && filters.degree.some(deg => posting.degree.includes(deg))
            );
        }

        if (filters.courses.length > 0) {
            result = result.filter(posting =>
                posting.studentStreams && filters.courses.some(course => posting.studentStreams.includes(course))
            );
        }

        if (filters.internship && !filters.fullTime) {
            result = result.filter(posting => ['Internship', 'Both'].includes(posting.lookingFor));
        }
        if (filters.fullTime && !filters.internship) {
            result = result.filter(posting => ['Job', 'Both'].includes(posting.lookingFor));
        }

        if (filters.location && filters.location !== 'Multi - Select') {
            result = result.filter(posting => posting.location && posting.location.includes(filters.location));
        }

        if (filters.college && filters.college.trim() !== '') {
            result = result.filter(posting =>
                posting.collegePosted?.collegeUniversityDetails?.collegeName
                .toLowerCase()
                .includes(filters.college.toLowerCase())
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

        setFilteredPostings(result);
    }, [filters, postings, sortBy]);

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

    const handlePoolSelect = (pool) => {
    console.log('Opening details for:', pool?.collegePosted?.collegeUniversityDetails?.collegeName);
    setSelectedPool(pool);
    setIsModalOpen(true);
    
    // Pass to parent if onPoolSelect exists (for compact mode)
    if (onPoolSelect && typeof onPoolSelect === 'function') {
      onPoolSelect(pool);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPool(null);
  };

  // COMPACT VIEW - For sidebar
  if (compact) {
    return (
      <div className="p-3 space-y-4">
        {filteredPostings
          .filter(pool => selectedPoolId ? pool._id !== selectedPoolId : true)
          .map((pool) => (
            <PoolCollegeCard 
              key={pool._id || pool.id} 
              college={pool} 
              onClick={onPoolSelect}
              compact={compact}
            />
          ))}
      </div>
    );
  }

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
            location: '',
            college: '',
            internship: false,
            fullTime: false
        });
        setShowMainFilter(false);
        setOpenSubDropdowns({
            workMode: false,
            degree: false,
            courses: false,
            location: false,
            college: false
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
            <div className="min-h-screen bg-gradient-to-br from-[#f0e6f7]/60 via-[#d4e8f9]/55 to-[#cff7ea]/60 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#143694] mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading pool campus postings...</p>
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
                        className="mt-4 px-6 py-3 bg-gradient-to-r from-[#143694] to-[#1e4ed8] text-white rounded-xl hover:shadow-lg hover:shadow-[#143694]/40 transition-all duration-200"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
    <div className="container mx-auto px-0 py-0">
            {/* Pastel blur background elements */}
            {/* <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#fbcfe8]/20 rounded-full blur-3xl"></div>
                <div className="absolute top-1/3 -left-20 w-60 h-60 bg-[#143694]/20 rounded-full blur-3xl"></div>
                <div className="absolute bottom-20 right-1/3 w-40 h-40 bg-[#a7f3d0]/20 rounded-full blur-3xl"></div>
                <div className="absolute top-1/4 right-1/4 w-48 h-48 bg-[#c7d2fe]/20 rounded-full blur-3xl"></div>
                <div className="absolute bottom-1/3 left-1/4 w-56 h-56 bg-[#fde68a]/10 rounded-full blur-3xl"></div>
            </div> */}

            <div className="container mx-auto px-0 py-0">
                {/* Header Section */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 px-6 py-6 mt-3 mb-6">

                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">

                        <div>
                        <div className="flex items-center gap-3 mb-2">

                            <div className="p-2 bg-[#143694]/10 rounded-lg">
                            <Building2 className="h-5 w-5 text-[#143694]" />
                            </div>

                            <h1 className="text-xl md:text-2xl font-semibold text-[#143694] tracking-tight">
                            Colleges Posting for Pool-Campus
                            </h1>

                        </div>

                        <p className="text-gray-600 text-sm md:text-base">
                            Discover and connect with colleges posting for pool-campus opportunities.
                        </p>

                        <div className="flex items-center gap-6 mt-4">

                            <button
                            onClick={() => navigate('/employer-dashboard/On-campus')}
                            className="text-gray-500 hover:text-[#143694] font-medium text-sm"
                            >
                            On-Campus
                            </button>

                            <button
                            className="px-6 py-2 bg-[#143694] text-white rounded-full font-medium text-sm shadow-sm"
                            >
                            Pool-Campus
                            </button>

                        </div>
                        </div>

                        <div className="relative w-full md:w-auto">
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="
                            w-full md:w-auto
                            px-4 py-2.5 pr-10
                            bg-gray-50 border border-gray-200 rounded-xl
                            text-sm text-gray-700
                            focus:ring-2 focus:ring-[#143694]/30
                            focus:border-[#143694]
                            appearance-none
                            "
                        >
                            <option value="newest">Sort: Newest</option>
                            <option value="oldest">Sort: Oldest</option>
                            <option value="a-z">Sort: A-Z</option>
                        </select>

                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                        </div>

                    </div>

                    </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
                    <div className="bg-white/90 backdrop-blur-sm border border-white/50 rounded-xl shadow-lg shadow-blue-100/50 p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Total Postings</p>
                                <p className="text-2xl font-bold text-[#1e4ed8]">{postings.length}</p>
                            </div>
                            <div className="p-2 bg-gradient-to-br from-[#143694]/30 to-[#1e4ed8]/20 rounded-lg">
                                <Building2 className="w-5 h-5 text-[#1e4ed8]" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white/90 backdrop-blur-sm border border-white/50 rounded-xl shadow-lg shadow-pink-100/50 p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Showing Results</p>
                                <p className="text-2xl font-bold text-[#ec4899]">{filteredPostings.length}</p>
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
                    <div
                        onClick={() => setShowMainFilter(!showMainFilter)}
                        className="bg-white border border-gray-100 rounded-xl shadow-sm p-4 flex items-center justify-between cursor-pointer hover:shadow-md transition-all"
                    >
                        <div>
                            <p className="text-lg text-gray-600">Filters</p>
                        </div>

                        <div className="p-2 bg-[#143694]/10 rounded-lg">
                            <Filter className="w-5 h-5 text-[#143694]" />
                        </div>
                    </div>
                </div>

                {/* Main Filter Section with Dropdown System */}
                <div className="mb-8">
                    {/* Active Filters Tags */}
                    {getActiveFiltersCount() > 0 && (
                        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-4 mb-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center flex-wrap gap-2">
                                <span className="text-sm font-medium text-gray-700 mr-2">Active filters:</span>
                                
                                {filters.workMode.map(mode => (
                                    <span key={mode} className="inline-flex items-center bg-gradient-to-r from-[#143694]/20 to-[#1e4ed8]/10 text-[#1e4ed8] px-3 py-1.5 rounded-lg text-sm backdrop-blur-sm">
                                        {mode}
                                        <button 
                                            onClick={() => removeFilter('workMode', mode)}
                                            className="ml-2 text-[#1e4ed8] hover:text-[#1d4ed8]"
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
                                <button
                                    onClick={clearAllFilters}
                                    className="
                                        px-4 py-2
                                        text-sm font-medium
                                        text-[#143694]
                                        bg-[#143694]/10
                                        border border-[#143694]/20
                                        rounded-lg
                                        hover:bg-[#143694]
                                        hover:text-white
                                        transition-all
                                    "
                                    >
                                    Clear all
                                    </button>

                            </div>
                        </div>
                    )}

                    {/* Filter Controls Row */}
                    {/* <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                        {/* Main Filter Button 
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <button
                                    onClick={() => setShowMainFilter(!showMainFilter)}
                                    className={`flex items-center gap-2 px-5 py-3 bg-white/90 backdrop-blur-sm border ${showMainFilter ? 'border-[#143694] ring-2 ring-[#143694]/10' : 'border-white/50 hover:border-[#143694]/50'} rounded-xl transition-all duration-200 shadow-sm hover:shadow-md`}
                                >
                                    <Filter className="h-4 w-4 text-[#1e4ed8]" />
                                    <span className="text-sm font-medium text-gray-700">Filter</span>
                                    {getActiveFiltersCount() > 0 && (
                                        <span className="px-2 py-0.5 bg-gradient-to-r from-[#143694] to-[#1e4ed8] text-white text-xs rounded-full">
                                            {getActiveFiltersCount()}
                                        </span>
                                    )}
                                    <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform duration-200 ${showMainFilter ? 'transform rotate-180' : ''}`} />
                                </button>
                            </div>

                            {/* Sort Dropdown 
                            {/* <div className="relative">
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="flex items-center gap-2 px-5 py-3 bg-white/90 backdrop-blur-sm border border-white/50 rounded-xl hover:border-[#143694]/50 transition-all duration-200 appearance-none pr-10 text-sm font-medium text-gray-700 shadow-sm hover:shadow-md"
                                >
                                    <option value="newest">Sort: Newest First</option>
                                    <option value="oldest">Sort: Oldest First</option>
                                    <option value="a-z">Sort: College Name (A-Z)</option>
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                            </div> 
                        </div>

                        {/* Clear All Button 
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
                    </div> */}

                    {/* Main Filter Dropdown */}
                    {showMainFilter && (
                        <div className="mt-4 bg-white/90 backdrop-blur-sm border border-white/50 rounded-2xl shadow-lg shadow-blue-50/50 p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {/* Work Mode Filter */}
                                {/* <div className="relative">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center">
                                            <Briefcase className="h-4 w-4 text-[#1e4ed8] mr-2" />
                                            <span className="text-sm font-medium text-gray-700">Work Mode</span>
                                            {filters.workMode.length > 0 && (
                                                <span className="ml-2 px-2 py-0.5 bg-gradient-to-r from-[#143694] to-[#1e4ed8] text-white text-xs rounded-full">
                                                    {filters.workMode.length}
                                                </span>
                                            )}
                                        </div>
                                        {filters.workMode.length > 0 && (
                                            <button
                                                onClick={() => clearFilterSection('workMode')}
                                                className="text-xs text-[#1e4ed8] hover:text-[#1d4ed8] font-medium"
                                            >
                                                Clear
                                            </button>
                                        )}
                                    </div>
                                    
                                    <button
                                        onClick={() => toggleSubDropdown('workMode')}
                                        className="flex items-center justify-between w-full p-3 bg-gradient-to-r from-white/50 to-white/30 border border-white/50 rounded-xl hover:border-[#143694]/50 transition-all duration-200 mb-2 backdrop-blur-sm"
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
                                                                className="h-4 w-4 text-[#1e4ed8] focus:ring-[#143694]/50 border-gray-300 rounded"
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
                                </div> */}

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
                                                className="w-full p-3 bg-white/80 backdrop-blur-sm border border-white/50 rounded-lg focus:ring-2 focus:ring-[#143694]/50 focus:border-transparent focus:outline-none transition-all duration-200 text-sm"
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
                                            <Search className="h-4 w-4 text-[#f472b6] mr-2" />
                                            <span className="text-sm font-medium text-gray-700">College Name</span>
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
                                        <span className="text-sm text-gray-700">Search College Name</span>
                                        <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform duration-200 ${openSubDropdowns.college ? 'transform rotate-180' : ''}`} />
                                    </button>
                                    
                                    {openSubDropdowns.college && (
                                        <div className="mt-2 p-3 bg-white/50 backdrop-blur-sm rounded-lg border border-white/50">
                                            <input
                                                type="text"
                                                value={filters.college}
                                                onChange={(e) => handleFilterChange('college', e.target.value)}
                                                placeholder="Type college name..."
                                                className="w-full p-3 bg-white/80 backdrop-blur-sm border border-white/50 rounded-lg focus:ring-2 focus:ring-[#143694]/50 focus:border-transparent focus:outline-none transition-all duration-200 text-sm"
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Results Header */}
                {/* <div className="mb-6">
                    <div className="bg-white/90 backdrop-blur-sm border border-white/50 rounded-2xl shadow-lg shadow-blue-50/50 p-6">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">
                                    Showing {filteredPostings.length} of {postings.length} Postings
                                </h3>
                                <p className="text-sm text-gray-600 mt-1">
                                    Filtered results based on your preferences
                                </p>
                            </div>
                            
                            <div className="text-sm text-gray-600">
                                <span className="font-medium">Sort by:</span>{' '}
                                {sortBy === 'newest' ? 'Newest First' : 
                                 sortBy === 'oldest' ? 'Oldest First' : 
                                 'College Name (A-Z)'}
                            </div>
                        </div>
                    </div>
                </div> */}

                {/* Postings Cards */}
      <div className="bg-white/90 backdrop-blur-sm border border-white/50 rounded-2xl shadow-lg shadow-blue-50/50 p-6 min-h-[600px]">
        {filteredPostings.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPostings.map(posting => (
                <div
                  key={posting._id || posting.id}
                  className="h-full flex"
                >
                  <div className="w-full bg-white/90 backdrop-blur-sm border border-white/50 rounded-2xl shadow-lg shadow-blue-50/50 overflow-hidden hover:shadow-xl hover:shadow-blue-100/50 transition-all duration-300 flex flex-col h-full">
                    <PoolCollegeCard 
                      college={posting} 
                      onClick={handlePoolSelect}
                    />
                  </div>
                </div>
              ))}
            </div>

                            {/* View All Button */}
                            <div className="mt-10 text-center">
                                <button className="px-8 py-3.5 bg-gradient-to-r from-[#143694] to-[#1e4ed8] text-white rounded-xl hover:shadow-lg hover:shadow-[#143694]/40 transition-all duration-200 text-base font-medium">
                                    View All Postings
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-center py-12">
                            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-[#fde68a]/30 to-[#f59e0b]/20 mb-6">
                                <Building2 className="h-12 w-12 text-[#f59e0b]" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-3">No Postings Found</h3>
                            <p className="text-gray-600 mb-8 max-w-md mx-auto text-lg">
                                No pool campus postings match your current filter criteria. Try adjusting your filters or search criteria to find more options.
                            </p>
                            <div className="flex flex-wrap gap-4 justify-center">
                                <button
                                    onClick={clearAllFilters}
                                    className="px-8 py-3.5 bg-gradient-to-r from-[#143694] to-[#1e4ed8] text-white rounded-xl hover:shadow-lg hover:shadow-[#143694]/40 transition-all duration-200 text-base font-medium"
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
            
        {/* Pool Detail Modal for normal view */}
      {isModalOpen && selectedPool && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          <div className="relative z-10 flex items-center justify-center h-full p-4">
            <EmployerPoolDetailsModal
              pool={selectedPool}
              isOpen={isModalOpen}
              onClose={handleCloseModal}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default PoolCollegeListingPage;