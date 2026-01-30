import { useState, useEffect } from 'react';
import {
  Search, Eye, ChevronLeft, ChevronRight, Trash, Building2, MapPin,
  Calendar, Users, FileText, AlertCircle, Briefcase
} from 'lucide-react';
import ApplicantDetails from './internDetails';
import { deleteJobById, getPostedJobs } from '@/lib/Company_AxiosInstance';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function InternshipListing() {
  // State variables
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedJob, setSelectedJob] = useState(null);
  const [showJobDetail, setShowJobDetail] = useState(false);
  const [isVisited, setIsVisited] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const itemsPerPage = 10;

  const fetchJobs = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getPostedJobs("Internship", "Accepted");
      setJobs(response?.data || []);
    } catch (err) {
      console.error("Error fetching internships:", err);
      setError(err.response?.data?.message || err.message || "Failed to fetch accepted internships.");
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleDelete = async (jobId) => {
    try {
      const confirmed = window.confirm("This action can't be undone! Are you sure you want to delete the internship?");
      if (confirmed) {
        await deleteJobById(jobId);
        await fetchJobs();
        toast.success("Internship deleted successfully");
      }
    } catch (error) {
      console.error("Error deleting internship:", error);
      toast.error('Failed to delete internship');
    }
  };

  // Helper function to get job role/title from various possible fields
  const getJobRole = (job) => {
    if (job.jobRoles && Array.isArray(job.jobRoles) && job.jobRoles.length > 0) {
      return job.jobRoles[0];
    }
    return job.jobTitle || job.lookingFor || job.role || job.title || 'N/A';
  };

  // Helper function to display all job roles
  const displayAllJobRoles = (job) => {
    if (job.jobRoles && Array.isArray(job.jobRoles) && job.jobRoles.length > 0) {
      return job.jobRoles.join(', ');
    }
    return getJobRole(job);
  };

  // Helper function to calculate expireAt if missing
  const calculateExpireAt = (job) => {
    if (job.expireAt) {
      return job.expireAt;
    }
    
    if (job.createdAt) {
      const createdAt = new Date(job.createdAt);
      const expireDate = new Date(createdAt.getTime() + (29 * 24 * 60 * 60 * 1000));
      return expireDate.toISOString();
    }
    
    const defaultExpire = new Date(Date.now() + (29 * 24 * 60 * 60 * 1000));
    return defaultExpire.toISOString();
  };

  // Helper function to format expireAt date
  const formatExpireDate = (job) => {
    try {
      const expireAt = calculateExpireAt(job);
      return new Date(expireAt).toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: 'numeric'
      });
    } catch (error) {
      return 'N/A';
    }
  };

  // Helper function to get internship duration
  const getInternshipDuration = (job) => {
    if (job.internshipDuration) {
      return job.internshipDuration;
    }
    if (job.duration) {
      return job.duration;
    }
    if (job.timePeriod) {
      return job.timePeriod;
    }
    return 'N/A Duration';
  };

  // Helper function to display locations
  const displayLocations = (locations) => {
    if (!locations || locations.length === 0) return 'No Location';
    return Array.isArray(locations) ? locations.join(', ') : String(locations);
  };

  // Filter jobs based on search query
  const filteredJobs = jobs?.filter(job => {
    if (!searchQuery) return true;
    
    const searchLower = searchQuery.toLowerCase();
    const jobRole = displayAllJobRoles(job).toLowerCase();
    const locationsMatch = Array.isArray(job.location)
      ? job.location.some(location => location?.toLowerCase().includes(searchLower))
      : false;
    
    return (
      jobRole.includes(searchLower) ||
      locationsMatch ||
      (job._id?.toLowerCase().includes(searchLower))
    );
  });

  const totalItems = filteredJobs?.length || 0;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const currentJobs = filteredJobs?.slice(startIndex, endIndex);

  const handleView = async (job) => {
    try {
      setSelectedJob(job);
      setIsVisited("false");
      setShowJobDetail(true);
    } catch (error) {
      setSelectedJob(job);
      setIsVisited("false");
      setShowJobDetail(true);
    }
  };

  const showNewApplication = (job) => {
    setSelectedJob(job);
    setIsVisited("true");
    setShowJobDetail(true);
  };

  const onClose = () => {
    setShowJobDetail(false);
    setIsVisited('');
    fetchJobs();
  }

  const handlePrevPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  };

  const handlePageClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // If showing job detail, render the detail view
  if (showJobDetail && selectedJob) {
    return (
      <ApplicantDetails
        job={selectedJob}
        isVisited={isVisited}
        onClose={() => onClose()}
      />
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
                  Internship Accepted Applications
                </h1>
              </div>
              <p className="text-gray-600">
                Track Your Internships and Streamline Accepted Candidate Applications
              </p>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-gradient-to-r from-red-50 to-white border border-red-200 rounded-xl p-4 mb-6">
            <div className="flex items-start">
              <AlertCircle className="h-5 w-5 text-red-600 mr-3 mt-0.5" />
              <div>
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <p className="text-sm text-red-700 mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Internships Table */}
        <div className="bg-white/90 backdrop-blur-sm border border-gray-100 rounded-2xl shadow-lg overflow-hidden">
          {/* Table Header */}
          <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
            <div className="grid grid-cols-12 gap-4 text-xs font-medium text-gray-700 uppercase tracking-wider">
              <div className="col-span-4">Internship Role</div>
              <div className="col-span-2">End Date</div>
              <div className="col-span-1 text-center">Views</div>
              <div className="col-span-2 text-center">New Applications</div>
              <div className="col-span-3 text-center">Actions</div>
            </div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-gray-100">
            {loading ? (
              <div className="p-12 text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#667eea]"></div>
                <p className="mt-4 text-gray-600">Loading accepted internships...</p>
              </div>
            ) : currentJobs?.length === 0 ? (
              <div className="p-12 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-gray-100 to-gray-200 mb-4">
                  <Search className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No accepted internships found</h3>
                <p className="text-gray-600">No internships match your search criteria.</p>
              </div>
            ) : (
              currentJobs?.map(job => {
                const jobRole = displayAllJobRoles(job);
                const internshipDuration = getInternshipDuration(job);
                
                return (
                  <div key={job._id} className="p-4 hover:bg-gray-50/50 transition-all duration-200">
                    <div className="grid grid-cols-12 gap-4 items-center">
                      {/* Internship Role - col-span-4 */}
                      <div className="col-span-4">
                        <div 
                          onClick={() => navigate(`/company-dashboard/Internship/${job._id}?isApplied=true`)}
                          className="group cursor-pointer"
                        >
                          <h3 className="font-semibold text-gray-900 group-hover:text-[#667eea] transition-colors break-words whitespace-normal">
                            {jobRole}
                          </h3>
                          <div className="flex items-center gap-2 mt-1">
                            <Briefcase className="h-3 w-3 text-gray-400" />
                            <span className="text-sm text-gray-500">
                              {internshipDuration}
                            </span>
                            <span className="text-gray-300">•</span>
                            <MapPin className="h-3 w-3 text-gray-400" />
                            <span className="text-sm text-gray-500 capitalize">
                              {displayLocations(job?.location)}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* End Date - col-span-2 */}
                      <div className="col-span-2">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-3 w-3 text-gray-400" />
                          <span className="text-gray-700 text-sm">
                            {formatExpireDate(job)}
                          </span>
                        </div>
                      </div>

                      {/* Views - col-span-1 */}
                      <div className="col-span-1 text-center">
                        <span className="inline-flex items-center justify-center w-8 h-8 bg-gradient-to-r from-blue-100 to-blue-50 text-blue-700 rounded-full text-sm font-medium">
                          {job?.views || 0}
                        </span>
                      </div>

                      {/* Accepted Applications - col-span-2 */}
                      <div 
                        className="col-span-2 text-center cursor-pointer group"
                        onClick={() => handleView(job)}
                      >
                        <span className="inline-flex items-center justify-center w-8 h-8 bg-gradient-to-r from-green-100 to-green-50 text-green-700 rounded-full text-sm font-medium group-hover:scale-110 transition-transform">
                          {job?.applicationCount || 0}
                        </span>
                      </div>

                      {/* Actions - col-span-3 */}
                      <div className="col-span-3">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => showNewApplication(job)}
                            className="p-2 bg-gradient-to-r from-gray-100 to-white border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 hover:text-[#667eea] hover:border-[#667eea]/50 transition-all duration-200"
                            title="View Applications"
                          >
                            <Eye size={16} />
                          </button>
                          <button 
                            onClick={() => handleDelete(job._id)}
                            className="p-2 bg-gradient-to-r from-red-100 to-red-50 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 hover:text-red-700 hover:border-red-300 transition-all duration-200"
                            title="Delete Internship"
                          >
                            <Trash size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-t border-gray-100 bg-gradient-to-r from-gray-50 to-white">
              <div className="flex items-center gap-4">
                <button
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-gray-100 to-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  <ChevronLeft size={16} />
                  Prev
                </button>
                
                <div className="text-sm text-gray-600">
                  Page <span className="font-semibold text-[#667eea]">{currentPage}</span> of <span className="font-semibold">{totalPages}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  
                  if (i === 3 && totalPages > 5 && currentPage < totalPages - 2) {
                    return (
                      <div key="ellipsis" className="text-gray-400 px-2">
                        ...
                      </div>
                    );
                  }
                  
                  if (i === 4 && totalPages > 5 && currentPage < totalPages - 2) {
                    pageNum = totalPages;
                  }
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageClick(pageNum)}
                      className={`w-10 h-10 flex items-center justify-center rounded-xl text-sm font-medium transition-all duration-200 ${
                        currentPage === pageNum 
                          ? 'bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white shadow-lg shadow-[#667eea]/30' 
                          : 'bg-gradient-to-r from-gray-100 to-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages || totalPages === 0}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-gray-100 to-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                Next
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}