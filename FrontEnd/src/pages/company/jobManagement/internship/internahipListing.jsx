import { useState, useEffect } from 'react';
import {
  Search, Eye, ChevronLeft, ChevronRight, Trash, Building2, MapPin,
  Calendar, Users, FileText, AlertCircle, Briefcase
} from 'lucide-react';
import ApplicantDetails from './internDetails';
import { deleteJobById, getPostedJobs, getOffCampusApplicationsForJob } from '@/lib/Company_AxiosInstance';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function InternshipListing() {
  // State variables
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('All Jobs');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [showJobDetail, setShowJobDetail] = useState(false);
  const [isVisited, setIsVisited] = useState('');
  const [error, setError] = useState(null);
  const [applications, setApplications] = useState([]);
  const [applicationsLoading, setApplicationsLoading] = useState(false);
  const [applicationsError, setApplicationsError] = useState(null);
  const [isVisited, setIsVisited] = useState();
  const navigate = useNavigate();

  const itemsPerPage = 10;

  const fetchJobs = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getPostedJobs("Internship", "Applied");
      console.log("Fetched jobs:", response?.data);
      setJobs(response?.data || []);
    } catch (err) {
      console.error("Error fetching internships:", err);
      setError(err.response?.data?.message || err.message || "Failed to fetch internships.");
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchApplicationsForJob = async (jobId, isVisited) => {
    setApplicationsLoading(true);
    setApplicationsError(null);

    try {
      const res = await getOffCampusApplicationsForJob(
        jobId,
        "Internship",
        "Applied",
        isVisited
      );

      setApplications(res?.data || []);
    } catch (err) {
      console.error(err);
      setApplications([]);
      setApplicationsError("Failed to fetch applications");
    } finally {
      setApplicationsLoading(false);
    }
  };


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

  // Filter jobs based on search query and active tab
  const filteredJobs = jobs?.filter(job => {
    const searchLower = searchQuery.toLowerCase();
    const jobRole = displayAllJobRoles(job).toLowerCase();
    const locationsMatch = Array.isArray(job.location)
      ? job.location.some(location => location?.toLowerCase().includes(searchLower))
      : false;
    
    const matchesSearch = jobRole.includes(searchLower) ||
      locationsMatch ||
      (job._id?.toLowerCase().includes(searchLower));

    if (activeTab === 'All Jobs') {
      return matchesSearch;
    } else if (activeTab === 'Published') {
      return matchesSearch && job.status === 'Published';
    } else if (activeTab === 'Drafts') {
      return matchesSearch && job.status === 'Draft';
    }

    return matchesSearch;
  });

  const totalItems = filteredJobs?.length || 0;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const currentJobs = filteredJobs?.slice(startIndex, endIndex);

  const displayLocations = (locations) => {
    if (!locations || locations.length === 0) return 'N/A';
    return Array.isArray(locations) ? locations.join(', ') : String(locations);
  };

  const handleViewApplications = async (job) => {
    setSelectedJob(job);
    setIsVisited("false"); // frontend flag = past
    await fetchApplicationsForJob(job._id, true); // backend filter
    setShowJobDetail(true);
  };


  const showNewApplications = async (job) => {
    setSelectedJob(job);
    setIsVisited("true"); // frontend flag = new
    await fetchApplicationsForJob(job._id, false);
    setShowJobDetail(true);
  };


  const handleBackToList = () => {
    setSelectedJob(null);
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

  const getTabCount = (tabName) => {
    if (!jobs) return 0;
    if (tabName === 'All Jobs') return jobs.length;
    if (tabName === 'Published') return jobs.filter(job => job.status === 'Published').length;
    if (tabName === 'Drafts') return jobs.filter(job => job.status === 'Draft').length;
    return 0;
  };

  // If showing job detail, render the detail view
  if (showJobDetail && selectedJob) {
    return (
<<<<<<< HEAD
      <ApplicantDetails
        job={selectedJob}
        isVisited={isVisited}
        onClose={() => onClose()}
      />
=======
      <div className="min-h-screen bg-gradient-to-br from-[#667eea]/10 via-[#f093fb]/5 to-[#764ba2]/10">
        <div className="container mx-auto px-4 py-8 pt-20">
          <div className="bg-white/90 backdrop-blur-sm border border-gray-100 rounded-2xl shadow-lg p-6">
            {/* Back Button */}
            <button
              onClick={handleBackToList}
              className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 group"
            >
              <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
              Back to internships
            </button>

            {/* Selected Job Header */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-gradient-to-br from-[#667eea]/20 to-[#764ba2]/20 rounded-xl">
                  <Building2 className="h-6 w-6 text-[#667eea]" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent">
                    Applications for: {jobRole}
                  </h2>
                  <div className="flex flex-wrap items-center gap-3 mt-2">
                    <span className={`inline-flex items-center text-sm px-3 py-1.5 rounded-lg ${
                      selectedJob?.status === 'Published'
                        ? 'bg-gradient-to-r from-green-100 to-green-50 text-green-700 border border-green-200'
                        : selectedJob?.status === 'Draft'
                        ? 'bg-gradient-to-r from-yellow-100 to-yellow-50 text-yellow-700 border border-yellow-200'
                        : 'bg-gradient-to-r from-gray-100 to-gray-50 text-gray-700 border border-gray-200'
                    }`}>
                      {selectedJob?.status || 'N/A'}
                    </span>
                    <span className="inline-flex items-center text-sm text-gray-600 bg-gradient-to-r from-gray-50 to-white px-3 py-1.5 rounded-lg">
                      <MapPin className="h-3 w-3 mr-1.5" />
                      {displayLocations(selectedJob?.location)}
                    </span>
                    <span className="inline-flex items-center text-sm text-gray-600 bg-gradient-to-r from-gray-50 to-white px-3 py-1.5 rounded-lg">
                      <Calendar className="h-3 w-3 mr-1.5" />
                      {selectedJob?.expireAt  ? new Date(selectedJob.expireAt ).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric',
                        year: 'numeric'
                      }) : 'N/A'}
                    </span>
                    <span className="inline-flex items-center text-sm text-gray-600 bg-gradient-to-r from-gray-50 to-white px-3 py-1.5 rounded-lg">
                      <Users className="h-3 w-3 mr-1.5" />
                      Total Applications: {selectedJob?.applicationCount || 0}
                    </span>
                    <span className="inline-flex items-center text-sm text-gray-600 bg-gradient-to-r from-gray-50 to-white px-3 py-1.5 rounded-lg">
                      <Eye className="h-3 w-3 mr-1.5" />
                      Views: {selectedJob?.views || 0}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Load Applicant Details Component */}
            <ApplicantDetails
              job={selectedJob}
              applications={applications}
              loading={applicationsLoading}
              error={applicationsError}
              isVisited={isVisited}
              onRefresh={() =>
                fetchApplicationsForJob(
                  selectedJob._id,
                  isVisited === "true" ? false : true
                )
              }
              onClose={handleBackToList}
            />
          </div>
        </div>
      </div>
>>>>>>> preprod
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
                  Manage Internship Applications
                </h1>
              </div>
              <p className="text-gray-600">
                Track Your Internship Listings and Streamline Candidate Applications
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
                <p className="mt-4 text-gray-600">Loading internships...</p>
              </div>
            ) : currentJobs?.length === 0 ? (
              <div className="p-12 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-gray-100 to-gray-200 mb-4">
                  <Search className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No internships found</h3>
                <p className="text-gray-600">No internships match your search criteria.</p>
              </div>
            ) : (
              currentJobs?.map(job => {
                const jobRole = displayAllJobRoles(job);
                
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
                              {job?.internshipDuration || job?.duration || 'N/A Duration'}
                            </span>
                            <span className="text-gray-300">•</span>
                            <MapPin className="h-3 w-3 text-gray-400" />
                            <span className="text-sm text-gray-500 capitalize">
                              {displayLocations(job?.location || job?.workLocation)}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* End Date - col-span-2 */}
                      <div className="col-span-2">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-3 w-3 text-gray-400" />
                          <span className="text-gray-700 text-sm">
                            {job?.expireAt ? new Date(job.expireAt).toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric',
                              year: 'numeric'
                            }) : 'N/A'}
                          </span>
                        </div>
                      </div>

                      {/* Views - col-span-1 */}
                      <div className="col-span-1 text-center">
                        <span className="inline-flex items-center justify-center w-8 h-8 bg-gradient-to-r from-blue-100 to-blue-50 text-blue-700 rounded-full text-sm font-medium">
                          {job?.views || 0}
                        </span>
                      </div>

                      {/* Applications - col-span-2 */}
                      <div 
<<<<<<< HEAD
                        className="col-span-2 text-center cursor-pointer group"
                        onClick={() => handleView(job)}
=======
                        className="col-span-1 text-center cursor-pointer group"
                        onClick={() => showNewApplications(job)}
>>>>>>> preprod
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