import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
  Search, Eye, Trash,
  ChevronLeft, ChevronRight, Filter,
  Calendar, MapPin, Users, Briefcase, AlertCircle
} from 'lucide-react';
import { getCollegePostedJobs, deleteCollegeJob } from '@/lib/College_AxiosIntance';

function ApplicationPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const pathParts = location.pathname.split('/').filter(Boolean);
  const lastSegment = pathParts[pathParts.length - 1];

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingJobId, setDeletingJobId] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('All Jobs');
  const [showFilters, setShowFilters] = useState(false);

  // Function to determine job status based on dates
  const getJobStatus = (job) => {
    const currentDate = new Date();
    const startDate = new Date(job.startDate);
    const endDate = new Date(job.endDate);

    if (currentDate < startDate) {
      return 'Pending';
    } else if (currentDate >= startDate && currentDate <= endDate) {
      return 'Open';
    } else {
      return 'Closed';
    }
  };

  // Process jobs to update their status based on dates
  const processJobsWithStatus = (jobsData) => {
    return jobsData.map(job => {
      // Only update status if the job has both start and end dates
      if (job.startDate && job.endDate) {
        return {
          ...job,
          jobStatus: getJobStatus(job)
        };
      }
      return job;
    });
  };

  // Fetch jobs function
  const fetchJobs = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetching 'On-campus' jobs as requested
      const response = await getCollegePostedJobs('On-campus', lastSegment);

      if (response.data && response.data.response && Array.isArray(response.data.response)) {
        // Process jobs to update their status based on dates
        const processedJobs = processJobsWithStatus(response.data.response);
        setJobs(processedJobs);
      } else {
        console.error('Unexpected API response format:', response);
        setJobs([]);
      }
    } catch (err) {
      setError("Failed to fetch jobs. Please try again later.");
      console.error("Error fetching jobs:", err);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch jobs from backend when the component mounts
  useEffect(() => {
    fetchJobs();
  }, [lastSegment]);

  // Set up interval to check and update job statuses periodically
  useEffect(() => {
    const intervalId = setInterval(() => {
      setJobs(prevJobs => processJobsWithStatus(prevJobs));
    }, 60000); // Check every minute

    return () => clearInterval(intervalId);
  }, []);

  const itemsPerPage = 5;

  // Memoized filtering logic
  const filteredJobs = useMemo(() => {
    if (!jobs || !Array.isArray(jobs)) return [];

    return jobs.filter(job => {
      const jobTitle = job.jobTitle || '';
      const degree = Array.isArray(job.degree) ? job.degree.join(', ') : '';
      const location = Array.isArray(job.location) ? job.location.join(', ') : job.location || '';

      // Comprehensive search
      const matchesSearch =
        jobTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        degree.toLowerCase().includes(searchQuery.toLowerCase()) ||
        location.toLowerCase().includes(searchQuery.toLowerCase());

      const status = job.jobStatus || '';

      // Filter based on the active tab
      if (activeTab === 'All Jobs') {
        return matchesSearch;
      } else if (activeTab === 'Open') {
        return matchesSearch && status === 'Open';
      } else if (activeTab === 'Pending') {
        return matchesSearch && status === 'Pending';
      } else if (activeTab === 'Closed') {
        return matchesSearch && status === 'Closed';
      }
      return matchesSearch;
    });
  }, [jobs, searchQuery, activeTab]);

  // Memoized counts for each status tab
  const openJobsCount = useMemo(() => jobs.filter(job => job.jobStatus === 'Open').length, [jobs]);
  const pendingJobsCount = useMemo(() => jobs.filter(job => job.jobStatus === 'Pending').length, [jobs]);
  const closedJobsCount = useMemo(() => jobs.filter(job => job.jobStatus === 'Closed').length, [jobs]);

  // Pagination calculations
  const totalItems = filteredJobs.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const currentJobs = filteredJobs.slice(startIndex, endIndex);

  // Pagination handlers
  const handlePrevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));
  const handleNextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
  const handlePageClick = (pageNumber) => setCurrentPage(pageNumber);

  // Action handlers
  const handleViewNewApplications = (jobId, e) => {
    e.stopPropagation();
    navigate(`/registered/on-campus-opportunities/${jobId}/applicants?targetStatus=Shortlisted&isVisited=false`);
  };

  const handleViewAllApplications = (jobId, e) => {
    e.stopPropagation();
    navigate(`/registered/on-campus-opportunities/${jobId}/applicants?targetStatus=Shortlisted`);
  };

  // Handle Degree column click - Navigate to CollegeDetailPage
  const handleDegreeClick = (job) => {
    // Prepare data structure for CollegeDetailPage
    const collegeData = {
      // The structure expected by CollegeDetailPage
      _id: job._id,
      isApplied: false,
      isSaved: false,
      collegePosted: job.collegePosted || job.collegeDetails,
      company: job.companyName || job.company,
      description: job.description,
      location: job.location,
      jobTitle: job.jobTitle,
      employmentType: job.employmentType,
      packageDetails: job.packageDetails,
      noOfplacedStudents: job.noOfplacedStudents || job.noOfStudents,
      lookingFor: job.lookingFor || job.jobTitle,
      proposedSchedule: job.proposedSchedule,
      companyType: job.companyType,
      roundDetails: job.roundDetails,
      studentStreams: job.studentStreams,
      numberOfStudent: job.numberOfStudent,
      amenitiesRequired: job.amenitiesRequired,
      contactPerson: job.contactPerson,
      startDate: job.startDate,
      endDate: job.endDate,
      jobType: job.jobType || 'On-campus'
    };
    
    // Navigate to CollegeDetailPage with state data
    navigate(`/company/employerDashboard/college-detail/${job._id}`, {
      state: {
        applicationData: collegeData,
        isApplied: false,
        isSaved: false
      }
    });
  };

  const handleDelete = async (jobId, e) => {
    e.stopPropagation();
    
    // Confirm before deleting
    const isConfirmed = window.confirm('Are you sure you want to delete this job? This action cannot be undone.');
    
    if (!isConfirmed) {
      return;
    }

    try {
      setDeletingJobId(jobId);
      
      // Call the delete API
      const response = await deleteCollegeJob(jobId);
      
      if (response.data && response.data.success) {
        // Remove the deleted job from the state
        setJobs(prevJobs => prevJobs.filter(job => job._id !== jobId));
        
        // Show success message
        alert('Job deleted successfully!');
        
        // If we deleted the last item on the page, go back a page
        if (currentJobs.length === 1 && currentPage > 1) {
          setCurrentPage(prev => prev - 1);
        }
        
        // Refresh the job list
        await fetchJobs();
      } else {
        // Show error message from server
        alert(response.data?.msg || response.msg || 'Failed to delete job. Please try again.');
      }
    } catch (error) {
      console.error('Error deleting job:', error);
      if (error.response?.data?.msg) {
        alert(error.response.data.msg);
      } else if (error.message) {
        alert(error.message);
      } else {
        alert('An error occurred while deleting the job. Please try again.');
      }
    } finally {
      setDeletingJobId(null);
    }
  };

  // Utility function to format dates
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric', month: 'short', day: 'numeric'
      });
    } catch (error) {
      console.error("Error formatting date:", error);
      return 'Invalid Date';
    }
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

      <div className="relative z-10 max-w-7xl mx-auto p-6">
        {/* Header Section */}
        {/* --- START OF SHORTLISTED NAVIGATION --- */}
    <div className="relative z-10 max-w-7xl mx-auto px-6 pt-8">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-6">
          <h2 className="text-2xl font-bold text-[#00153d]">Shortlisted Companies</h2>
          <span className="flex items-center justify-center w-6 h-6 bg-[#1a3a8a] text-white text-xs font-bold rounded-full">
            {jobs.length}
          </span>
        </div>
        
        <div className="flex items-center gap-6 border-b border-gray-200 pb-1">
          {/* On-Campus: Active Highlight */}
          <button 
            className="px-6 py-2 bg-[#1a3a8a] text-white rounded-full font-medium text-sm transition-all shadow-md"
          >
            On-Campus
          </button>
          
          <button 
            onClick={() => navigate('/registered/pool-campus-opportunities')}
            className="px-2 py-2 text-gray-500 hover:text-[#1a3a8a] font-medium text-sm transition-all"
          >
            Pool-Campus
          </button>
        </div>
      </div>
    </div>
    {/* --- END OF NAVIGATION --- */}
        <div className="mb-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8">
            <div className="text-center md:text-left">
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#3b82f6] to-[#8b5cf6] bg-clip-text text-transparent mb-2">
                Manage On-Campus Applications
              </h1>
              <p className="text-gray-600 text-lg md:text-xl max-w-2xl">
                Track Your On Campus Drives and Streamline Applications
              </p>
            </div>
            <button className="group flex items-center gap-3 px-8 py-3 bg-gradient-to-r from-[#93c5fd] to-[#3b82f6] text-white rounded-xl hover:shadow-lg hover:shadow-[#93c5fd]/40 transition-all duration-200 text-base font-medium">
              <Briefcase className="w-5 h-5" />
              Post a Job
              <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
          </div>

          {/* Main Content Card */}
          <div className="bg-white/90 backdrop-blur-sm border border-white/50 rounded-2xl shadow-lg shadow-blue-50/50 overflow-hidden">
            {/* Tabs */}
            {/* <div className="flex border-b border-white/50">
              <button
                className={`px-6 py-3 text-sm font-medium transition-all duration-200 ${activeTab === 'All Jobs' 
                  ? 'border-b-2 border-[#3b82f6] text-[#3b82f6]' 
                  : 'text-gray-600 hover:text-[#3b82f6] hover:bg-white/30'}`}
                onClick={() => setActiveTab('All Jobs')}
              >
                All Jobs ({jobs.length || 0})
              </button>
              <button
                className={`px-6 py-3 text-sm font-medium transition-all duration-200 ${activeTab === 'Open' 
                  ? 'border-b-2 border-[#3b82f6] text-[#3b82f6]' 
                  : 'text-gray-600 hover:text-[#3b82f6] hover:bg-white/30'}`}
                onClick={() => setActiveTab('Open')}
              >
                Open ({openJobsCount})
              </button>
              <button
                className={`px-6 py-3 text-sm font-medium transition-all duration-200 ${activeTab === 'Pending' 
                  ? 'border-b-2 border-[#3b82f6] text-[#3b82f6]' 
                  : 'text-gray-600 hover:text-[#3b82f6] hover:bg-white/30'}`}
                onClick={() => setActiveTab('Pending')}
              >
                Pending ({pendingJobsCount})
              </button>
              <button
                className={`px-6 py-3 text-sm font-medium transition-all duration-200 ${activeTab === 'Closed' 
                  ? 'border-b-2 border-[#3b82f6] text-[#3b82f6]' 
                  : 'text-gray-600 hover:text-[#3b82f6] hover:bg-white/30'}`}
                onClick={() => setActiveTab('Closed')}
              >
                Closed ({closedJobsCount})
              </button>
            </div> */}

            {/* Table - 5 Columns */}
<div className="bg-white/90 backdrop-blur-sm border border-gray-100 rounded-2xl shadow-lg overflow-hidden">
  {/* Table Header */}
  <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
    <div className="grid grid-cols-12 gap-4 text-xs font-medium text-gray-700 uppercase tracking-wider">
      <div className="col-span-3">Degree</div>
      <div className="col-span-2">Deadline</div>
      <div className="col-span-2 text-center">Views</div>
      <div className="col-span-3 text-center">New Applications</div>
      <div className="col-span-2 text-center">Actions</div>
    </div>
  </div>

  {/* Table Body */}
  <div className="divide-y divide-gray-100">
    {loading ? (
      <div className="p-12 text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#3b82f6]"></div>
        <p className="mt-4 text-gray-600">Loading jobs...</p>
      </div>
    ) : error ? (
      <div className="p-12 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-red-100 to-red-50 mb-4">
          <AlertCircle className="h-8 w-8 text-red-500" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Error loading jobs</h3>
        <p className="text-red-500 font-medium">{error}</p>
      </div>
    ) : currentJobs.length === 0 ? (
      <div className="p-12 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-gray-100 to-gray-200 mb-4">
          <Search className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs found</h3>
        <p className="text-gray-600">No jobs match your search criteria.</p>
      </div>
    ) : (
      currentJobs.map(job => {
        const jobId = job._id || job.id;
        const jobDegree = Array.isArray(job.degree) ? job.degree.join(', ') : job.degree || 'N/A';
        const jobLocation = Array.isArray(job.location) ? job.location.join(', ') : job.location || 'N/A';
        const deadline = job.endDate || job.deadline;
        const views = job.views || 0;
        const applications = job.applicationCount || job.applications || 0;

        return (
          <div key={jobId} className="p-4 hover:bg-gray-50/50 transition-all duration-200">
            <div className="grid grid-cols-12 gap-4 items-center">
              {/* Degree Column - col-span-3 */}
              <div className="col-span-3">
                <div 
                  onClick={() => handleDegreeClick(job)}
                  className="group cursor-pointer"
                >
                  <h3 className="font-semibold text-gray-900 group-hover:text-[#3b82f6] transition-colors line-clamp-2">
                    {jobDegree}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <MapPin className="h-3 w-3 text-gray-400" />
                    <span className="text-sm text-gray-500 line-clamp-1">{jobLocation}</span>
                  </div>
                </div>
              </div>
              
              {/* Deadline Column - col-span-2 */}
              <div className="col-span-2">
                <div className="flex items-center gap-2">
                  <Calendar className="h-3 w-3 text-gray-400" />
                  <span className="text-gray-700 text-sm">
                    {formatDate(deadline)}
                  </span>
                </div>
              </div>
              
              {/* Views Column - col-span-2 */}
              <div className="col-span-2 text-center">
                <div className="flex items-center justify-center">
                  <span className="inline-flex items-center justify-center w-8 h-8 bg-gradient-to-r from-blue-100 to-blue-50 text-blue-700 rounded-full text-sm font-medium">
                    {views}
                  </span>
                </div>
              </div>
              
              {/* New Applications Column - col-span-3 */}
              <div 
                className="col-span-3 text-center cursor-pointer group"
                onClick={(e) => handleViewNewApplications(jobId, e)}
              >
                <div className="flex items-center justify-center">
                  <span className="inline-flex items-center justify-center w-8 h-8 bg-gradient-to-r from-green-100 to-green-50 text-green-700 rounded-full text-sm font-medium group-hover:scale-110 transition-transform">
                    {applications}
                  </span>
                </div>
              </div>
              
              {/* Actions Column - col-span-2 */}
              <div className="col-span-2">
                <div className="flex items-center justify-center gap-2">
                  <button
                    onClick={(e) => handleViewAllApplications(jobId, e)}
                    className="p-2 bg-gradient-to-r from-gray-100 to-white border border-gray-200 text-gray-600 rounded-lg hover:text-[#3b82f6] hover:bg-gray-50 hover:border-[#3b82f6]/50 transition-all duration-200"
                    title="View All Applications"
                  >
                    <Eye size={16} />
                  </button>
                  <button 
                    onClick={(e) => handleDelete(jobId, e)} 
                    className={`p-2 bg-gradient-to-r from-red-100 to-red-50 border border-red-200 rounded-lg transition-all duration-200 ${
                      deletingJobId === jobId 
                        ? 'opacity-50 cursor-not-allowed' 
                        : 'text-red-600 hover:text-red-700 hover:bg-red-50 hover:border-red-300'
                    }`}
                    title="Delete Job"
                    disabled={deletingJobId === jobId}
                  >
                    {deletingJobId === jobId ? (
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-solid border-[#3b82f6] border-r-transparent"></div>
                    ) : (
                      <Trash size={16} />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })
    )}
  </div>
</div>

            {/* Pagination */}
            {!loading && totalPages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between p-6 border-t border-white/50">
                <button
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                  className="flex items-center gap-2 px-6 py-3 bg-white/50 backdrop-blur-sm border border-white/50 rounded-xl disabled:opacity-50 hover:bg-white/70 transition-all duration-200 text-gray-700 font-medium mb-4 sm:mb-0"
                >
                  <ChevronLeft size={16} />
                  Prev
                </button>

                <div className="flex gap-2 mb-4 sm:mb-0">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => handlePageClick(page)}
                      className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-200 font-medium ${currentPage === page
                        ? 'bg-gradient-to-r from-[#93c5fd] to-[#3b82f6] text-white shadow-md shadow-[#93c5fd]/30'
                        : 'bg-white/50 backdrop-blur-sm border border-white/50 text-gray-700 hover:bg-white/70'
                        }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>

                <button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  className="flex items-center gap-2 px-6 py-3 bg-white/50 backdrop-blur-sm border border-white/50 rounded-xl disabled:opacity-50 hover:bg-white/70 transition-all duration-200 text-gray-700 font-medium"
                >
                  Next
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ApplicationPage;