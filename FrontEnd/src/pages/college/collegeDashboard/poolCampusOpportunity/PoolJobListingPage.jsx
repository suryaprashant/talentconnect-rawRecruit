import React, { useState, useEffect } from 'react';
import JobFilters from '@/components/college/collegeDashboard/poolCampusOpportunity/JobFilters';
import JobCard from '@/components/college/collegeDashboard/poolCampusOpportunity/JobCard';
import { MapPin, Filter, Search, Briefcase, TrendingUp, Calendar, Users, X, RefreshCw, ChevronDown } from 'lucide-react';
import axios from 'axios';

const PoolJobListingPage = () => {
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
  const [totalJobs, setTotalJobs] = useState(0);

  // Function to fetch jobs from the backend
  const fetchJobs = async () => {
    setLoading(true);
    setError(null);
    try {
      const backendUrl = import.meta.env.VITE_Backend_URL || 'http://localhost:5000';
      const response = await axios.get(`${backendUrl}/api/student-dashboard/getAllPoolCampusJobs`);

      const mappedJobs = response.data.data.map(backendJob => {
        const companyName = backendJob.companyPosted?.companyDetails?.companyName || 'N/A';
        const description = backendJob.description || backendJob.companyPosted?.companyDetails?.description || 'No description provided.';
        const logo = backendJob.companyPosted?.profileImageUrl || 'https://via.placeholder.com/48';
        const location = backendJob.workLocation && backendJob.workLocation.length > 0
          ? backendJob.workLocation.join(', ')
          : 'Not specified';
        
        const packageDetails = backendJob.packageDetails;
        let minPackage = 'Not specified';
        if (packageDetails && packageDetails.totalCTC) {
            minPackage = `₹ ${packageDetails.totalCTC.toLocaleString()} ${packageDetails.currency || 'INR'}`;
        }

        return {
          id: backendJob._id,
          companyName: companyName,
          logo: logo,
          isOnsite: backendJob.workMode === 'On-site',
          venue: backendJob.venue || 'Not specified',
          streams: backendJob.studentStreams && backendJob.studentStreams.length > 0 ? backendJob.studentStreams : ['Not specified'],
          position: backendJob.jobRoles && backendJob.jobRoles.length > 0 ? backendJob.jobRoles.join(', ') : 'Not specified',
          location: location,
          package: minPackage,
          description: description,
          hiringProcess: backendJob.selectionProcess && backendJob.selectionProcess.length > 0 ? backendJob.selectionProcess : ['Not specified'],
          jobStatus: backendJob.jobStatus || '',
          workMode: backendJob.workMode,
          employmentType: backendJob.employmentType,
          placementStartDate: backendJob.startDate,
          placementEndDate: backendJob.endDate,
          tags: backendJob?.tags,
        };
      });
      setAllJobs(mappedJobs);
      setFilteredJobs(mappedJobs);
      setTotalJobs(mappedJobs.length);
    } catch (err) {
      console.error("Error fetching pool campus jobs:", err);
      setError("Failed to fetch jobs. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  useEffect(() => {
    let result = allJobs;

    if (filters.search) {
      result = result.filter(job =>
        job.companyName.toLowerCase().includes(filters.search.toLowerCase()) ||
        job.position.toLowerCase().includes(filters.search.toLowerCase()) ||
        job.venue.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    if (filters.streams.length > 0) {
      result = result.filter(job =>
        filters.streams.some(filterStream => job.streams.includes(filterStream))
      );
    }

    if (filters.minPackage > 0) {
      result = result.filter(job => {
        const jobPackageAmount = parseFloat(job.package.replace(/[^0-9.]/g, ''));
        return !isNaN(jobPackageAmount) && jobPackageAmount >= filters.minPackage;
      });
    }

    if (filters.locations.length > 0 && filters.locations[0] !== 'All Locations') {
      result = result.filter(job =>
        filters.locations.some(filterLoc => job.location.includes(filterLoc))
      );
    }

    if (filters.role) {
      result = result.filter(job =>
        job.position.toLowerCase().includes(filters.role.toLowerCase())
      );
    }

    if (filters.upcomingDrivesOnly) {
      const now = new Date();
      result = result.filter(job => {
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
          return false;
        })
      );
    }

    setFilteredJobs(result);
    setTotalJobs(result.length);
  }, [filters, allJobs]);

  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handleTagFilter = (tag) => {
    if (filters.tags.includes(tag)) {
      handleFilterChange({ tags: filters.tags.filter(t => t !== tag) });
    } else {
      handleFilterChange({ tags: [...filters.tags, tag] });
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
  };

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
                  Pool Campus Opportunities
                </h1>
                <p className="text-gray-600 mt-2">
                  Explore pool campus opportunities from various companies. Apply filters to find your perfect career match.
                </p>
              </div>
              <div className="w-full lg:w-96">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search companies, positions, venues..."
                    value={filters.search}
                    onChange={(e) => handleFilterChange({ search: e.target.value })}
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
                <p className="text-2xl font-bold text-[#3b82f6]">{allJobs.length}</p>
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
                <p className="text-2xl font-bold text-[#f59e0b]">
                  {Object.values(filters).filter(f => 
                    Array.isArray(f) ? f.length > 0 : f && f !== 0 && f !== false
                  ).length}
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
          <div className="w-full lg:w-80 flex-shrink-0">
            <div className="bg-white/90 backdrop-blur-sm border border-white/50 rounded-2xl shadow-lg shadow-blue-50/50 p-6 sticky top-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-[#93c5fd]/30 to-[#3b82f6]/20 rounded-lg flex items-center justify-center">
                    <Filter className="w-4 h-4 text-[#3b82f6]" />
                  </div>
                  Filters
                </h2>
                <button
                  onClick={clearAllFilters}
                  className="text-sm text-[#3b82f6] hover:text-[#1d4ed8] transition-colors duration-200 flex items-center gap-1"
                >
                  <RefreshCw className="w-3 h-3" />
                  Clear All
                </button>
              </div>

              {/* Active Filter Tags */}
              {filters.tags.length > 0 && (
                <div className="mb-6">
                  <div className="flex flex-wrap gap-2">
                    {filters.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center bg-gradient-to-r from-[#93c5fd]/20 to-[#3b82f6]/10 text-[#3b82f6] text-xs px-3 py-1.5 rounded-full backdrop-blur-sm"
                      >
                        {tag}
                        <button
                          onClick={() => handleTagFilter(tag)}
                          className="ml-2 text-[#3b82f6] hover:text-[#1d4ed8]"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="mb-6">
                <p className="text-sm text-gray-600">
                  Showing <span className="font-semibold text-[#3b82f6]">{filteredJobs.length}</span> of{" "}
                  <span className="font-semibold text-gray-900">{allJobs.length}</span> jobs
                </p>
              </div>

              <JobFilters
                filters={filters}
                onChange={handleFilterChange}
              />

              {/* Active Filters Summary */}
              <div className="mt-8 pt-6 border-t border-gray-200/50">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Active Filters</h3>
                <div className="flex flex-wrap gap-2">
                  {filters.streams.length > 0 && (
                    <span className="text-xs text-gray-600">
                      Streams: {filters.streams.length}
                    </span>
                  )}
                  {filters.minPackage > 0 && (
                    <span className="text-xs text-gray-600">
                      Min Package: ₹{filters.minPackage}L
                    </span>
                  )}
                  {filters.locations.length > 0 && filters.locations[0] !== 'All Locations' && (
                    <span className="text-xs text-gray-600">
                      Locations: {filters.locations.length}
                    </span>
                  )}
                  {filters.role && (
                    <span className="text-xs text-gray-600">
                      Role: {filters.role}
                    </span>
                  )}
                  {filters.upcomingDrivesOnly && (
                    <span className="text-xs text-gray-600">
                      Upcoming Drives Only
                    </span>
                  )}
                  {Object.values(filters).every(f => 
                    !f || (Array.isArray(f) && f.length === 0) || f === 0 || f === false
                  ) && (
                    <span className="text-xs text-gray-500 italic">No active filters</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Job Listings */}
          <div className="flex-grow">
            {/* Results Header */}
            <div className="bg-white/90 backdrop-blur-sm border border-white/50 rounded-2xl shadow-lg shadow-blue-50/50 p-6 mb-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {filteredJobs.length} Pool Campus Opportunities
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Filtered from {allJobs.length} total opportunities
                  </p>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="text-sm text-gray-600">Sort by:</div>
                  <div className="relative">
                    <select className="appearance-none bg-white/50 backdrop-blur-sm border border-white/50 rounded-xl py-2.5 pl-4 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-[#93c5fd] focus:border-transparent">
                      <option>Relevance</option>
                      <option>Date Posted</option>
                      <option>Package (High to Low)</option>
                      <option>Package (Low to High)</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="bg-white/90 backdrop-blur-sm border border-white/50 rounded-2xl shadow-lg shadow-blue-50/50 p-12 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#93c5fd] mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading pool campus opportunities...</p>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="bg-white/90 backdrop-blur-sm border border-white/50 rounded-2xl shadow-lg shadow-blue-50/50 p-12 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#fca5a5]/30 to-[#ef4444]/20 rounded-full mb-6">
                  <MapPin className="w-8 h-8 text-[#ef4444]" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Opportunities</h3>
                <p className="text-gray-600 mb-6">{error}</p>
                <button
                  onClick={fetchJobs}
                  className="px-6 py-3 bg-gradient-to-r from-[#93c5fd] to-[#3b82f6] text-white rounded-xl hover:shadow-lg hover:shadow-[#93c5fd]/40 transition-all duration-200"
                >
                  Try Again
                </button>
              </div>
            )}

            {/* Jobs Grid */}
            {!loading && !error && filteredJobs.length > 0 && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                  {filteredJobs.map((job) => (
                    <div
                      key={job.id}
                      className="h-full"
                    >
                      <div className="w-full bg-white/90 backdrop-blur-sm border border-white/50 rounded-2xl shadow-lg shadow-blue-50/50 overflow-hidden hover:shadow-xl hover:shadow-blue-100/50 transition-all duration-300 flex flex-col h-full">
                        <div className="p-6 flex flex-col h-full">
                          <JobCard job={job} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Load More Button */}
                <div className="mt-10 text-center">
                  <button className="px-8 py-3 bg-gradient-to-r from-[#93c5fd] to-[#3b82f6] text-white rounded-xl hover:shadow-lg hover:shadow-[#93c5fd]/40 transition-all duration-200">
                    View All Opportunities
                  </button>
                </div>
              </>
            )}

            {/* Empty State */}
            {!loading && !error && filteredJobs.length === 0 && (
              <div className="bg-white/90 backdrop-blur-sm border border-white/50 rounded-2xl shadow-lg shadow-blue-50/50 p-12 text-center">
                <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-[#fde68a]/30 to-[#f59e0b]/20 rounded-full mb-6">
                  <MapPin className="w-12 h-12 text-[#f59e0b]" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">No Opportunities Found</h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  No pool campus jobs match your current filters. Try adjusting your filters or search terms.
                </p>
                <button
                  onClick={clearAllFilters}
                  className="px-8 py-3.5 bg-gradient-to-r from-[#93c5fd] to-[#3b82f6] text-white rounded-xl hover:shadow-lg hover:shadow-[#93c5fd]/40 transition-all duration-200"
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

export default PoolJobListingPage;