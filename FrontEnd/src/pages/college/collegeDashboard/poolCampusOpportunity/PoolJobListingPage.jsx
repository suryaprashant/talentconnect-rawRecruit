import React, { useState, useEffect } from 'react';
import JobCard from '@/components/college/collegeDashboard/poolCampusOpportunity/JobCard';
import { MapPin, Filter, Search, Briefcase, TrendingUp, Calendar, Users, X, RefreshCw, ChevronDown, ChevronUp, Building, GraduationCap, BookOpen, Tag, DollarSign, Check, Award } from 'lucide-react';
import { getCollegePostingForPoolcampus } from '@/lib/College_AxiosIntance';
import { useMemo } from 'react';
import { City } from 'country-state-city';
import CreatableSelect from 'react-select/creatable';
import PoolJobDetailModal from '@/components/college/collegeDashboard/poolCampusOpportunity/PoolDetailModal';
import { useNavigate } from 'react-router-dom';
const PoolJobListingPage = ({ compact = false, onJobSelect, selectedJobId }) => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    search: '',
    streams: [],
    minPackage: 0,
    locations: [],
    role: '',
    upcomingDrivesOnly: false,
    tags: [],
  });

  const [allJobs, setAllJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('relevance');
  
  // Modal state
  const [selectedJob, setSelectedJob] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // State for dropdown visibility
  const [showMainFilter, setShowMainFilter] = useState(false);
  const [openSubDropdowns, setOpenSubDropdowns] = useState({
    streams: false,
    package: false,
    locations: false,
    role: false,
    tags: false,
    upcoming: false
  });

  // Extract unique values from jobs for filters
  const [filterOptions, setFilterOptions] = useState({
    streams: [],
    locations: [],
    tags: []
  });

  // Function to fetch jobs from the backend
  const fetchJobs = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getCollegePostingForPoolcampus(); // Use existing function

      console.log('Pool campus response:', response);

      // Check response structure
      if (!response.data) {
        throw new Error('No data received from server');
      }

      const backendJobs = response.data?.data || response.data || [];
      
      if (!Array.isArray(backendJobs)) {
        console.log('Backend jobs is not array:', backendJobs);
        setAllJobs([]);
        setFilteredJobs([]);
        return;
      }

      const mappedJobs = backendJobs.map(backendJob => {
  // Extract company details
  const companyName = backendJob.companyPosted?.companyDetails?.companyName || 
                     backendJob.companyName || 
                     'N/A';
  
  const description = backendJob.description || 
                     backendJob.companyPosted?.companyDetails?.description || 
                     'No description provided.';
  
  // FIX: Use a reliable placeholder or check if logo exists
  const logo = backendJob.companyPosted?.profileImageUrl || 
              backendJob.logo || 
              null; // Set to null instead of broken URL
  
  // Extract location
  const location = backendJob.workLocation && backendJob.workLocation.length > 0
    ? backendJob.workLocation.join(', ')
    : (backendJob.location || 'Not specified');

        // Extract package details
        const packageDetails = backendJob.packageDetails;
        let minPackage = 'Not specified';
        let packageAmount = 0;
        if (packageDetails && packageDetails.totalCTC) {
          minPackage = `₹ ${packageDetails.totalCTC.toLocaleString()} ${packageDetails.currency || 'INR'}`;
          packageAmount = packageDetails.totalCTC;
        }

        // Extract streams
        const streams = backendJob.studentStreams && backendJob.studentStreams.length > 0 
          ? backendJob.studentStreams 
          : (backendJob.streams || ['Not specified']);

        // Extract job roles
        const jobRoles = backendJob.jobRoles || backendJob.position || ['Not specified'];

        return {
          id: backendJob._id || backendJob.id,
          companyName: companyName,
          logo: logo,
          isOnsite: backendJob.workMode === 'On-site',
          venue: backendJob.venue || 'Not specified',
          streams: streams,
          position: Array.isArray(jobRoles) ? jobRoles.join(', ') : jobRoles,
          location: location,
          package: minPackage,
          packageAmount: packageAmount,
          description: description,
          hiringProcess: backendJob.selectionProcess && backendJob.selectionProcess.length > 0 ? backendJob.selectionProcess : ['Not specified'],
          jobStatus: backendJob.jobStatus || '',
          workMode: backendJob.workMode,
          employmentType: backendJob.employmentType,
          placementStartDate: backendJob.startDate,
          placementEndDate: backendJob.endDate,
          tags: backendJob?.tags || [],
          createdAt: backendJob.createdAt,
          // Add these fields to match JobCard props
          _id: backendJob._id || backendJob.id,
          companyPosted: backendJob.companyPosted,
          jobRoles: Array.isArray(jobRoles) ? jobRoles : [jobRoles],
          studentStreams: streams,
          workLocation: backendJob.workLocation || backendJob.location,
          startDate: backendJob.startDate,
          endDate: backendJob.endDate,
          selectionProcess: backendJob.selectionProcess,
          packageDetails: backendJob.packageDetails,
          jobType: "Pool-campus",
          // Additional fields for filtering
          degree: backendJob.degree || streams,
          skills: backendJob.skills || [],
          urgent: backendJob.urgent || false
        };
      });
      
      console.log('Mapped jobs:', mappedJobs);
      setAllJobs(mappedJobs);
      setFilteredJobs(mappedJobs);

      // Extract unique filter options
      const uniqueStreams = [...new Set(mappedJobs.flatMap(job => job.streams).filter(Boolean))];
      const uniqueLocations = [...new Set(mappedJobs.map(job => job.location).filter(loc => loc && loc !== 'Not specified'))];
      const uniqueTags = [...new Set(mappedJobs.flatMap(job => [
        job.workMode,
        job.employmentType,
        ...(job.tags || [])
      ]).filter(tag => tag && tag !== 'Not specified'))];

      setFilterOptions({
        streams: uniqueStreams.map(label => ({ label })),
        locations: uniqueLocations,
        tags: uniqueTags.map(label => ({ label }))
      });
    } catch (err) {
      console.error("Error fetching pool campus jobs:", err);
      setError("Failed to fetch pool campus jobs. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const cityOptions = useMemo(() => {
    const cities = City.getCitiesOfCountry("IN") || [];
    return cities.map(city => ({
      value: city.name,
      label: city.name,
    }));
  }, []);

  useEffect(() => {
    fetchJobs();
  }, []);

  useEffect(() => {
    let result = allJobs;

    // Apply selected job filtering (for compact mode)
    if (selectedJobId) {
      result = result.filter(job => job._id !== selectedJobId);
    }

    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      result = result.filter(job =>
        job.companyName.toLowerCase().includes(searchTerm) ||
        (job.position && job.position.toLowerCase().includes(searchTerm)) ||
        (job.venue && job.venue.toLowerCase().includes(searchTerm))
      );
    }

    if (filters.streams.length > 0) {
      result = result.filter(job =>
        job.streams && filters.streams.some(filterStream => 
          job.streams.includes(filterStream)
        )
      );
    }

    if (filters.minPackage > 0) {
      result = result.filter(job => job.packageAmount >= filters.minPackage);
    }

    if (filters.locations.length > 0) {
      result = result.filter(job =>
        job.location && filters.locations.some(filterLoc => 
          job.location.toLowerCase().includes(filterLoc.toLowerCase())
        )
      );
    }

    if (filters.role) {
      result = result.filter(job =>
        job.position && job.position.toLowerCase().includes(filters.role.toLowerCase())
      );
    }

    if (filters.upcomingDrivesOnly) {
      const now = new Date();
      result = result.filter(job => {
        if (!job.placementStartDate) return false;
        const startDate = new Date(job.placementStartDate);
        return startDate > now;
      });
    }

    if (filters.tags.length > 0) {
      result = result.filter(job =>
        filters.tags.some(tag => {
          if (tag === 'Remote' || tag === 'On-site' || tag === 'Hybrid') {
            return job.workMode === tag;
          }
          if (tag === 'Full-time' || tag === 'Part-time' || tag === 'Contract') {
            return job.employmentType === tag;
          }
          return job.tags?.includes(tag);
        })
      );
    }

    // Apply sorting
    if (sortBy === 'date') {
      result.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    } else if (sortBy === 'package-high') {
      result.sort((a, b) => b.packageAmount - a.packageAmount);
    } else if (sortBy === 'package-low') {
      result.sort((a, b) => a.packageAmount - b.packageAmount);
    } else if (sortBy === 'company') {
      result.sort((a, b) => a.companyName.localeCompare(b.companyName));
    } else if (sortBy === 'newest') {
      result.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    } else if (sortBy === 'oldest') {
      result.sort((a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0));
    }

    setFilteredJobs(result);
  }, [filters, allJobs, sortBy, selectedJobId]);

  // ... (keep all other functions the same as before)

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
      } else if (filterType === 'minPackage') {
        return {
          ...prev,
          minPackage: value
        };
      } else if (filterType === 'role') {
        return {
          ...prev,
          role: value
        };
      } else if (filterType === 'upcomingDrivesOnly') {
        return {
          ...prev,
          upcomingDrivesOnly: value
        };
      }
      return prev;
    });
  };

  const handleLocationMultiChange = (selectedOptions) => {
    setFilters(prev => ({
      ...prev,
      locations: selectedOptions
        ? selectedOptions.map(opt => opt.value)
        : [],
    }));
  };

  const handleJobSelect = (job) => {
    console.log('Opening details for:', job?.companyName);
    setSelectedJob(job);
    setIsModalOpen(true);
    
    // Pass to parent if onJobSelect exists (for compact mode)
    if (onJobSelect && typeof onJobSelect === 'function') {
      onJobSelect(job);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedJob(null);
  };

  // COMPACT VIEW - For sidebar
  if (compact) {
    return (
      <div className="p-3 space-y-4">
        {filteredJobs.length > 0 ? (
          filteredJobs
            .filter(job => selectedJobId ? job._id !== selectedJobId : true)
            .map((job) => (
              <div 
                key={job._id || job.id} 
                className="w-full"
              >
                <JobCard 
                  job={job} 
                  onClick={onJobSelect}
                />
              </div>
            ))
        ) : (
          <div className="text-center py-8">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 mb-3">
              <Building className="h-6 w-6 text-gray-400" />
            </div>
            <p className="text-gray-500 text-sm">
              {selectedJobId 
                ? "No other pool campus opportunities to display" 
                : "No pool campus opportunities found"}
            </p>
          </div>
        )}
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
    } else if (filterType === 'minPackage') {
      setFilters(prev => ({ ...prev, minPackage: 0 }));
    } else if (filterType === 'role') {
      setFilters(prev => ({ ...prev, role: '' }));
    } else if (filterType === 'upcomingDrivesOnly') {
      setFilters(prev => ({ ...prev, upcomingDrivesOnly: false }));
    }
  };

  const clearFilterSection = (filterType) => {
    if (Array.isArray(filters[filterType])) {
      setFilters(prev => ({ ...prev, [filterType]: [] }));
    } else if (filterType === 'minPackage') {
      setFilters(prev => ({ ...prev, minPackage: 0 }));
    } else if (filterType === 'role') {
      setFilters(prev => ({ ...prev, role: '' }));
    } else if (filterType === 'upcomingDrivesOnly') {
      setFilters(prev => ({ ...prev, upcomingDrivesOnly: false }));
    }
  };

  const clearAllFilters = () => {
    setFilters({
      search: '',
      streams: [],
      minPackage: 0,
      locations: [],
      role: '',
      upcomingDrivesOnly: false,
      tags: [],
    });
    setShowMainFilter(false);
    setOpenSubDropdowns({
      streams: false,
      package: false,
      locations: false,
      role: false,
      tags: false,
      upcoming: false
    });
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    Object.values(filters).forEach(filter => {
      if (Array.isArray(filter)) {
        count += filter.length;
      } else if (filter && filter !== 0 && filter !== false) {
        count += 1;
      }
    });
    return count;
  };

  const getActiveFiltersDisplay = () => {
    const active = [];
    
    if (filters.streams.length > 0) {
      active.push(...filters.streams.map(stream => ({ type: 'streams', value: stream })));
    }
    
    if (filters.minPackage > 0) {
      active.push({ type: 'minPackage', value: `₹${filters.minPackage}L+` });
    }
    
    if (filters.locations.length > 0) {
      active.push(...filters.locations.map(location => ({ type: 'locations', value: location })));
    }
    
    if (filters.role) {
      active.push({ type: 'role', value: filters.role });
    }
    
    if (filters.upcomingDrivesOnly) {
      active.push({ type: 'upcomingDrivesOnly', value: 'Upcoming Drives' });
    }
    
    if (filters.tags.length > 0) {
      active.push(...filters.tags.map(tag => ({ type: 'tags', value: tag })));
    }
    
    return active;
  };

  const activeFiltersDisplay = getActiveFiltersDisplay();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f0e6f7]/60 via-[#d4e8f9]/55 to-[#cff7ea]/60 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#143694] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading pool campus opportunities...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f0e6f7]/60 via-[#d4e8f9]/55 to-[#cff7ea]/60 flex items-center justify-center">
        <div className="bg-white/90 backdrop-blur-sm border border-white/50 rounded-2xl shadow-lg shadow-blue-50/50 p-8 max-w-md text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#fca5a5]/30 to-[#ef4444]/20 rounded-full mb-4">
            <Building className="w-8 h-8 text-[#ef4444]" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Opportunities</h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={fetchJobs}
            className="px-6 py-3 bg-gradient-to-r from-[#143694] to-[#1e4ed8] text-white rounded-xl hover:shadow-lg hover:shadow-[#143694]/40 transition-all duration-200"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // ... (keep the rest of the JSX exactly the same as in your working code)
  // The rest of the component JSX remains unchanged
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0e6f7]/60 via-[#d4e8f9]/55 to-[#cff7ea]/60">
      {/* Pastel blur background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#fbcfe8]/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 -left-20 w-60 h-60 bg-[#143694]/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-1/3 w-40 h-40 bg-[#a7f3d0]/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/4 right-1/4 w-48 h-48 bg-[#c7d2fe]/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/3 left-1/4 w-56 h-56 bg-[#fde68a]/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 pt-20">
        {/* Header Section */}
        <div className="mb-8 -mt-10">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 px-6 py-5 mb-8 -mt-10">

            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
              <h2 className="text-2xl md:text-[26px] font-semibold text-[#143694] tracking-tight">
                Campus Opportunities 
              </h2>

              <span className="flex items-center justify-center w-7 h-7 bg-[#143694] text-white text-xs font-bold rounded-full">
                {allJobs.length}
              </span>
            </div>
            
            {/* Tabs */}
            <div className="flex items-center gap-6 border-gray-200 pb-2">

              {/* Inactive */}
              <button 
                onClick={() => navigate('/college-dashboard/On-campus')}
                className="px-3 py-2 text-gray-500 hover:text-[#143694] hover:bg-gray-100 rounded-md font-medium text-sm transition-all"
              >
                On-Campus
              </button>
              
              {/* Active */}
              <button 
                className="px-6 py-2 bg-[#143694] text-white rounded-full font-medium text-sm shadow-sm"
              >
                Pool-Campus
              </button>

            </div>

          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-white/80 to-white/60 backdrop-blur-sm rounded-2xl"></div>
            <div className="relative flex flex-col lg:flex-row lg:items-center justify-between py-6 px-6 gap-4">
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-[#1e4ed8] to-[#1e40af] bg-clip-text text-transparent">
                  Pool Campus Opportunities
                </h1>
                <p className="text-gray-600 mt-2">
                  Explore pool campus opportunities from various companies. Apply filters to find your perfect career match
                </p>
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
                <p className="text-2xl font-bold text-[#1e4ed8]">{allJobs.length}</p>
              </div>
              <div className="p-2 bg-gradient-to-br from-[#143694]/30 to-[#1e4ed8]/20 rounded-lg">
                <Briefcase className="w-5 h-5 text-[#1e4ed8]" />
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
                <Filter className="w-5 h-5 text-[#ec4899]" />
              </div>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-sm border border-white/50 rounded-xl shadow-lg shadow-amber-100/50 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Filters</p>
                <p className="text-2xl font-bold text-[#f59e0b]">{getActiveFiltersCount()}</p>
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
          {activeFiltersDisplay.length > 0 && (
            <div className="bg-white/90 backdrop-blur-sm border border-white/50 rounded-2xl shadow-lg shadow-blue-50/50 p-4 mb-4">
              <div className="flex items-center flex-wrap gap-2">
                <span className="text-sm font-medium text-gray-700 mr-2">Active filters:</span>
                
                {activeFiltersDisplay.map((filter, index) => {
                  let bgColor = 'from-[#143694]/20 to-[#1e4ed8]/10';
                  let textColor = 'text-[#1e4ed8]';
                  
                  if (filter.type === 'streams') {
                    bgColor = 'from-[#f9a8d4]/20 to-[#ec4899]/10';
                    textColor = 'text-[#ec4899]';
                  } else if (filter.type === 'minPackage') {
                    bgColor = 'from-[#fde68a]/20 to-[#f59e0b]/10';
                    textColor = 'text-[#f59e0b]';
                  } else if (filter.type === 'locations') {
                    bgColor = 'from-[#a7f3d0]/20 to-[#10b981]/10';
                    textColor = 'text-[#10b981]';
                  } else if (filter.type === 'tags') {
                    bgColor = 'from-[#c7d2fe]/20 to-[#818cf8]/10';
                    textColor = 'text-[#818cf8]';
                  } else if (filter.type === 'role') {
                    bgColor = 'from-[#fbcfe8]/20 to-[#f472b6]/10';
                    textColor = 'text-[#f472b6]';
                  } else if (filter.type === 'upcomingDrivesOnly') {
                    bgColor = 'from-[#d8b4fe]/20 to-[#a855f7]/10';
                    textColor = 'text-[#a855f7]';
                  }
                  
                  return (
                    <span key={index} className={`inline-flex items-center bg-gradient-to-r ${bgColor} ${textColor} px-3 py-1.5 rounded-lg text-sm backdrop-blur-sm`}>
                      {filter.value}
                      <button 
                        onClick={() => removeFilter(filter.type, filter.value)}
                        className="ml-2 hover:opacity-75"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  );
                })}
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
                {/* Streams Filter */}
                <div className="relative">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <GraduationCap className="h-4 w-4 text-[#ec4899] mr-2" />
                      <span className="text-sm font-medium text-gray-700">Streams</span>
                      {filters.streams.length > 0 && (
                        <span className="ml-2 px-2 py-0.5 bg-[#ec4899] text-white text-xs rounded-full">
                          {filters.streams.length}
                        </span>
                      )}
                    </div>
                    {filters.streams.length > 0 && (
                      <button
                        onClick={() => clearFilterSection('streams')}
                        className="text-xs text-[#ec4899] hover:text-[#be185d] font-medium"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                  
                  <button
                    onClick={() => toggleSubDropdown('streams')}
                    className="flex items-center justify-between w-full p-3 bg-gradient-to-r from-white/50 to-white/30 border border-white/50 rounded-xl hover:border-[#f9a8d4]/50 transition-all duration-200 mb-2 backdrop-blur-sm"
                  >
                    <span className="text-sm text-gray-700">Select Streams</span>
                    <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform duration-200 ${openSubDropdowns.streams ? 'transform rotate-180' : ''}`} />
                  </button>
                  
                  {openSubDropdowns.streams && (
                    <div className="mt-2 p-3 bg-white/50 backdrop-blur-sm rounded-lg border border-white/50 max-h-60 overflow-y-auto">
                      <div className="space-y-2">
                        {filterOptions.streams.map((stream, index) => (
                          <div key={stream.label + index} className="flex items-center p-2 hover:bg-white/30 rounded transition-all duration-200">
                            <input
                              type="checkbox"
                              id={`stream-${stream.label}-${index}`}
                              checked={filters.streams.includes(stream.label)}
                              onChange={() => handleFilterChange('streams', stream.label)}
                              className="h-4 w-4 text-[#ec4899] focus:ring-[#f9a8d4]/50 border-gray-300 rounded"
                            />
                            <label 
                              htmlFor={`stream-${stream.label}-${index}`}
                              className="ml-3 text-sm text-gray-700 cursor-pointer flex-1"
                            >
                              {stream.label}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Package Filter */}
                <div className="relative">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <DollarSign className="h-4 w-4 text-[#f59e0b] mr-2" />
                      <span className="text-sm font-medium text-gray-700">Minimum Package</span>
                      {filters.minPackage > 0 && (
                        <span className="ml-2 px-2 py-0.5 bg-[#f59e0b] text-white text-xs rounded-full">
                          1
                        </span>
                      )}
                    </div>
                    {filters.minPackage > 0 && (
                      <button
                        onClick={() => clearFilterSection('minPackage')}
                        className="text-xs text-[#f59e0b] hover:text-[#d97706] font-medium"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                  
                  <button
                    onClick={() => toggleSubDropdown('package')}
                    className="flex items-center justify-between w-full p-3 bg-gradient-to-r from-white/50 to-white/30 border border-white/50 rounded-xl hover:border-[#fde68a]/50 transition-all duration-200 mb-2 backdrop-blur-sm"
                  >
                    <span className="text-sm text-gray-700">
                      {filters.minPackage > 0 ? `₹${filters.minPackage}L+` : 'Select Minimum Package'}
                    </span>
                    <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform duration-200 ${openSubDropdowns.package ? 'transform rotate-180' : ''}`} />
                  </button>
                  
                  {openSubDropdowns.package && (
                    <div className="mt-2 p-3 bg-white/50 backdrop-blur-sm rounded-lg border border-white/50">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Min: ₹0L</span>
                          <span className="text-sm text-gray-600">Max: ₹50L+</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="50"
                          step="1"
                          value={filters.minPackage}
                          onChange={(e) => handleFilterChange('minPackage', parseInt(e.target.value))}
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                        />
                        <div className="text-center">
                          <span className="text-lg font-semibold text-[#f59e0b]">₹{filters.minPackage}L+</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {[5, 10, 15, 20, 30].map(amount => (
                            <button
                              key={amount}
                              onClick={() => handleFilterChange('minPackage', amount)}
                              className={`px-3 py-1.5 text-xs rounded-lg transition-all duration-200 ${
                                filters.minPackage === amount
                                  ? 'bg-gradient-to-r from-[#fde68a] to-[#f59e0b] text-gray-900 font-medium'
                                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                              }`}
                            >
                              ₹{amount}L+
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Locations Filter */}
                <div className="relative">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 text-gray-500 mr-2" />
                      <span className="text-sm font-medium text-gray-700">Location</span>
                      {Array.isArray(filters.locations) && filters.locations.length > 0 && (
                        <span className="ml-2 px-2 py-0.5 bg-[#143694] text-white text-xs rounded-full">
                          {filters.locations.length}
                        </span>
                      )}
                    </div>
                    {Array.isArray(filters.locations) && filters.locations.length > 0 && (
                      <button
                        onClick={() => setFilters(prev => ({ ...prev, locations: [] }))}
                        className="text-xs text-[#143694] hover:text-[#1e4ed8]"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                  
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleSubDropdown('locations');
                    }}
                    className="flex items-center justify-between w-full p-3 bg-gradient-to-r from-gray-50 to-white border border-gray-200 rounded-xl hover:border-gray-300 transition-all duration-200 mb-2"
                  >
                    <span className="text-sm text-gray-700">Select Location</span>
                    <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform duration-200 ${openSubDropdowns.locations ? 'transform rotate-180' : ''}`} />
                  </button>
                  
                  {openSubDropdowns.locations && (
                    <div
                      className="relative z-50 mt-2 p-3 bg-gray-50 rounded-lg border border-gray-200"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <CreatableSelect
                        isMulti
                        options={cityOptions}
                        value={(Array.isArray(filters.locations) ? filters.locations : []).map(loc => ({
                          value: loc,
                          label: loc,
                        }))}
                        onChange={handleLocationMultiChange}
                        placeholder="Select or type locations..."
                        menuPortalTarget={document.body}
                        menuPosition="fixed"
                        styles={{
                          menuPortal: base => ({ ...base, zIndex: 9999 }),
                          menu: base => ({ ...base, zIndex: 9999 }),
                          control: base => ({
                            ...base,
                            minHeight: '38px',
                            borderRadius: '0.75rem',
                            backgroundColor: 'rgb(249 250 251)',
                            borderColor: '#e5e7eb',
                          }),
                        }}
                      />
                    </div>
                  )}
                </div>

                {/* Role Filter */}
                <div className="relative">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <Briefcase className="h-4 w-4 text-[#f472b6] mr-2" />
                      <span className="text-sm font-medium text-gray-700">Role</span>
                      {filters.role && (
                        <span className="ml-2 px-2 py-0.5 bg-[#f472b6] text-white text-xs rounded-full">
                          1
                        </span>
                      )}
                    </div>
                    {filters.role && (
                      <button
                        onClick={() => clearFilterSection('role')}
                        className="text-xs text-[#f472b6] hover:text-[#db2777] font-medium"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                  
                  <button
                    onClick={() => toggleSubDropdown('role')}
                    className="flex items-center justify-between w-full p-3 bg-gradient-to-r from-white/50 to-white/30 border border-white/50 rounded-xl hover:border-[#fbcfe8]/50 transition-all duration-200 mb-2 backdrop-blur-sm"
                  >
                    <span className="text-sm text-gray-700">
                      {filters.role || 'Search Role'}
                    </span>
                    <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform duration-200 ${openSubDropdowns.role ? 'transform rotate-180' : ''}`} />
                  </button>
                  
                  {openSubDropdowns.role && (
                    <div className="mt-2 p-3 bg-white/50 backdrop-blur-sm rounded-lg border border-white/50">
                      <input
                        type="text"
                        placeholder="Type role name..."
                        value={filters.role}
                        onChange={(e) => handleFilterChange('role', e.target.value)}
                        className="w-full p-3 bg-white/80 backdrop-blur-sm border border-white/50 rounded-lg focus:ring-2 focus:ring-[#143694]/50 focus:border-transparent focus:outline-none transition-all duration-200 text-sm"
                      />
                    </div>
                  )}
                </div>

                {/* Tags Filter */}
                <div className="relative">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <Tag className="h-4 w-4 text-[#818cf8] mr-2" />
                      <span className="text-sm font-medium text-gray-700">Tags</span>
                      {filters.tags.length > 0 && (
                        <span className="ml-2 px-2 py-0.5 bg-[#818cf8] text-white text-xs rounded-full">
                          {filters.tags.length}
                        </span>
                      )}
                    </div>
                    {filters.tags.length > 0 && (
                      <button
                        onClick={() => clearFilterSection('tags')}
                        className="text-xs text-[#818cf8] hover:text-[#4f46e5] font-medium"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                  
                  <button
                    onClick={() => toggleSubDropdown('tags')}
                    className="flex items-center justify-between w-full p-3 bg-gradient-to-r from-white/50 to-white/30 border border-white/50 rounded-xl hover:border-[#c7d2fe]/50 transition-all duration-200 mb-2 backdrop-blur-sm"
                  >
                    <span className="text-sm text-gray-700">Select Tags</span>
                    <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform duration-200 ${openSubDropdowns.tags ? 'transform rotate-180' : ''}`} />
                  </button>
                  
                  {openSubDropdowns.tags && (
                    <div className="mt-2 p-3 bg-white/50 backdrop-blur-sm rounded-lg border border-white/50 max-h-60 overflow-y-auto">
                      <div className="space-y-2">
                        {filterOptions.tags.map((tag, index) => (
                          <div key={tag.label + index} className="flex items-center p-2 hover:bg-white/30 rounded transition-all duration-200">
                            <input
                              type="checkbox"
                              id={`tag-${tag.label}-${index}`}
                              checked={filters.tags.includes(tag.label)}
                              onChange={() => handleFilterChange('tags', tag.label)}
                              className="h-4 w-4 text-[#818cf8] focus:ring-[#c7d2fe]/50 border-gray-300 rounded"
                            />
                            <label 
                              htmlFor={`tag-${tag.label}-${index}`}
                              className="ml-3 text-sm text-gray-700 cursor-pointer flex-1"
                            >
                              {tag.label}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Upcoming Drives Filter */}
                <div className="relative">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 text-[#a855f7] mr-2" />
                      <span className="text-sm font-medium text-gray-700">Upcoming Drives</span>
                      {filters.upcomingDrivesOnly && (
                        <span className="ml-2 px-2 py-0.5 bg-[#a855f7] text-white text-xs rounded-full">
                          1
                        </span>
                      )}
                    </div>
                    {filters.upcomingDrivesOnly && (
                      <button
                        onClick={() => clearFilterSection('upcomingDrivesOnly')}
                        className="text-xs text-[#a855f7] hover:text-[#7c3aed] font-medium"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                  
                  <button
                    onClick={() => toggleSubDropdown('upcoming')}
                    className="flex items-center justify-between w-full p-3 bg-gradient-to-r from-white/50 to-white/30 border border-white/50 rounded-xl hover:border-[#d8b4fe]/50 transition-all duration-200 mb-2 backdrop-blur-sm"
                  >
                    <span className="text-sm text-gray-700">Upcoming Drives Only</span>
                    <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform duration-200 ${openSubDropdowns.upcoming ? 'transform rotate-180' : ''}`} />
                  </button>
                  
                  {openSubDropdowns.upcoming && (
                    <div className="mt-2 p-3 bg-white/50 backdrop-blur-sm rounded-lg border border-white/50">
                      <div className="flex items-center p-2 hover:bg-white/30 rounded transition-all duration-200">
                        <input
                          type="checkbox"
                          id="upcoming-drives"
                          checked={filters.upcomingDrivesOnly}
                          onChange={(e) => handleFilterChange('upcomingDrivesOnly', e.target.checked)}
                          className="h-4 w-4 text-[#a855f7] focus:ring-[#d8b4fe]/50 border-gray-300 rounded"
                        />
                        <label 
                          htmlFor="upcoming-drives"
                          className="ml-3 text-sm text-gray-700 cursor-pointer flex-1"
                        >
                          Show only upcoming pool campus drives
                        </label>
                      </div>
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
                  Showing {filteredJobs.length} of {allJobs.length} Opportunities
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Filtered results based on your preferences
                </p>
              </div>
              
              <div className="text-sm text-gray-600">
                <span className="font-medium">Sort by:</span>{' '}
                {sortBy === 'relevance' ? 'Relevance' : 
                 sortBy === 'date' ? 'Date Posted' : 
                 sortBy === 'package-high' ? 'Package (High to Low)' :
                 sortBy === 'package-low' ? 'Package (Low to High)' :
                 sortBy === 'newest' ? 'Newest First' :
                 sortBy === 'oldest' ? 'Oldest First' :
                 'Company Name (A-Z)'}
              </div>
            </div>
          </div>
        </div> */}

        {/* Job Cards Grid */}
        <div className="bg-white/90 backdrop-blur-sm border border-white/50 rounded-2xl shadow-lg shadow-blue-50/50 p-6 min-h-[600px]">
          {filteredJobs.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {filteredJobs.map(job => (
                  <div
                    key={job._id || job.id}
                    className="h-full flex"
                  >
                    <div className="w-full bg-white/90 backdrop-blur-sm border border-white/50 rounded-2xl shadow-lg shadow-blue-50/50 overflow-hidden hover:shadow-xl hover:shadow-blue-100/50 transition-all duration-300 flex flex-col h-full">
                      <JobCard 
                        job={job} 
                        onClick={handleJobSelect}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Load More Button */}
              <div className="mt-10 text-center">
                <button className="px-8 py-3.5 bg-gradient-to-r from-[#143694] to-[#1e4ed8] text-white rounded-xl hover:shadow-lg hover:shadow-[#143694]/40 transition-all duration-200 text-base font-medium">
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

      {/* Job Detail Modal for normal view */}
      {isModalOpen && selectedJob && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          <div className="relative z-10 flex items-center justify-center h-full p-4">
            <PoolJobDetailModal
              jobId={selectedJob._id || selectedJob.id}
              isOpen={isModalOpen}
              onClose={handleCloseModal}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default PoolJobListingPage;