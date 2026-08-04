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
  const [selectedJob, setSelectedJob] = useState(null);
  const [showJobDetail, setShowJobDetail] = useState(false);
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
      console.log("Fetched jobs:", response?.data); // Debug log
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
    // Check multiple possible fields for role/title
    if (job.jobRoles && Array.isArray(job.jobRoles) && job.jobRoles.length > 0) {
      return job.jobRoles[0]; // Return first job role from the array
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

  // Filter jobs based on search query
  const filteredJobs = jobs?.filter(job => {
    const searchLower = searchQuery.toLowerCase();
    const locationsMatch = Array.isArray(job.location)
      ? job.location.some(location =>
        location?.toLowerCase().includes(searchLower))
      : false;

    // Get job role for search - search in all roles
    const jobRole = displayAllJobRoles(job);
    
    return (
      jobRole.toLowerCase().includes(searchLower) ||
      locationsMatch ||
      (job._id?.toLowerCase().includes(searchLower))
    );
  });

  const totalItems = filteredJobs?.length || 0;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentJobs = filteredJobs?.slice(startIndex, startIndex + itemsPerPage);

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

  // Function to calculate end date (30 days after posting)
  const calculateEndDate = (createdAt) => {
    if (!createdAt) return 'N/A';
    
    try {
      const postDate = new Date(createdAt);
      const endDate = new Date(postDate);
      endDate.setDate(endDate.getDate() + 30);
      
      // Format the date
      return endDate.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: 'numeric'
      });
    } catch (error) {
      console.error('Error calculating end date:', error);
      return 'N/A';
    }
  };

  const showNewApplications = async (job) => {
    setSelectedJob(job);
    setIsVisited("true"); // frontend flag = new
    await fetchApplicationsForJob(job._id, false);
    setShowJobDetail(true);
  };

  const handleBackToList = () => {
    setShowJobDetail(false);
    setIsVisited('');
    fetchJobs();
  };

  // If showing job detail, render only the ApplicantDetails component
  if (showJobDetail && selectedJob) {
    return (
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
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#143694]/10 via-[#f093fb]/5 to-[#1e4ed8]/10">
      <div className="container mx-auto px-4 py-8 pt-22">
        {/* Header Section */}
        <div className="bg-white/90 backdrop-blur-sm border border-gray-100 rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div className="mb-4 md:mb-0">
              <div className="flex items-center mb-2">
                <div className="p-2 bg-gradient-to-br from-[#143694]/20 to-[#1e4ed8]/20 rounded-lg mr-3">
                  <Building2 className="h-5 w-5 text-[#143694]" />
                </div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-[#143694] to-[#1e4ed8] bg-clip-text text-transparent">
                  Manage Internship Applications
                </h1>
              </div>
              <p className="text-gray-600">
                Track Your Internship Listings and Streamline Candidate Applications
              </p>
              {/* Tabs */}
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 border-gray-200 pt-3">
                <button 
                  onClick={() => navigate('/job-management/on-campus-listings/employer')}
                  className="px-2 py-2 text-gray-500 hover:text-[#143694] font-medium text-sm transition-all"
                >
                  On-Campus
                </button>
                <button 
                  onClick={() => navigate('/job-management/pool-campus-listings/employer')}
                  className="px-2 py-2 text-gray-500 hover:text-[#143694] font-medium text-sm transition-all"
                >
                  Pool-Campus
                </button>

                <button 
                  onClick={() => navigate('/job-management/Off-campus/employer')}
                  className="px-2 py-2 text-gray-500 hover:text-[#143694] font-medium text-sm transition-all"
                >
                  Off-Campus
                </button>
                {/* Active */}
                <button 
                  className="px-6 py-2 bg-[#143694] text-white rounded-full font-medium text-sm shadow-sm"
                >
                  Internship
                </button>
              </div>
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
              <div className="col-span-3">Internship Role</div>
              <div className="col-span-2">Location</div>
              <div className="col-span-2">End Date</div>
              <div className="col-span-1 text-center">Views</div>
              <div className="col-span-2 text-center">New Applications</div>
              <div className="col-span-2 text-center">Actions</div>
            </div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-gray-100">
            {loading ? (
              <div className="p-12 text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#143694]"></div>
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
                console.log("Job data:", job); // Debug log to see the structure
                
                return (
                  <div key={job._id} className="p-4 hover:bg-gray-50/50 transition-all duration-200">
                    <div className="grid grid-cols-12 gap-4 items-center">
                      {/* Job Title/Role */}
                      <div className="col-span-3">
                        <div 
                          onClick={() => navigate(`/company-dashboard/Internship/${job._id}?isApplied=true`)}
                          className="group cursor-pointer"
                        >
                          <h3 className="font-semibold text-gray-900 group-hover:text-[#143694] transition-colors break-words whitespace-normal">
                            {jobRole}
                          </h3>
                          <div className="flex items-center gap-2 mt-1">
                            <FileText className="h-3 w-3 text-gray-400" />
                            <span className="text-sm text-gray-500">
                              {job?.internshipDuration || job?.duration || 'N/A Duration'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Location */}
                      <div className="col-span-2">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-3 w-3 text-gray-400 flex-shrink-0" />
                          <span className="text-gray-700 text-sm truncate">
                            {displayLocations(job?.location || job?.workLocation)}
                          </span>
                        </div>
                      </div>

                      {/* End Date */}
                      <div className="col-span-2">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-3 w-3 text-gray-400" />
                          <div className="flex flex-col">
                            <span className="text-gray-700 text-sm">
                              {calculateEndDate(job?.createdAt)}
                            </span>
                            {job?.expireAt && (
                              <span className="text-xs text-gray-500">
                                (Custom: {new Date(job.expireAt).toLocaleDateString('en-US', { 
                                  month: 'short', 
                                  day: 'numeric'
                                })})
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Views */}
                      <div className="col-span-1 text-center">
                        <span className="inline-flex items-center justify-center w-8 h-8 bg-gradient-to-r from-blue-100 to-blue-50 text-[#143694] rounded-full text-sm font-medium">
                          {job?.views || 0}
                        </span>
                      </div>

                      {/* New Applications */}
                      <div 
                        className="col-span-2 text-center cursor-pointer group"
                        onClick={() => showNewApplications(job)}
                      >
                        <span className="inline-flex items-center justify-center w-8 h-8 bg-gradient-to-r from-green-100 to-green-50 text-green-700 rounded-full text-sm font-medium group-hover:scale-110 transition-transform">
                          {job?.applicationCount || 0}
                        </span>
                      </div>

                      {/* Actions */}
                      <div className="col-span-2">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleViewApplications(job)}
                            className="p-2 bg-gradient-to-r from-gray-100 to-white border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 hover:text-[#143694] hover:border-[#143694]/50 transition-all duration-200"
                            title="View Applications"
                          >
                            {/* <Eye size={16} /> */}
                            viewed
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
            <div className="flex items-center justify-between p-4 border-t border-gray-100 bg-gradient-to-r from-gray-50 to-white">
              <button
                onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-gray-100 to-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                <ChevronLeft size={16} />
                Prev
              </button>

              <div className="flex gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1)?.map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-10 h-10 flex items-center justify-center rounded-xl text-sm font-medium transition-all duration-200 ${
                      currentPage === page 
                        ? 'bg-gradient-to-r from-[#143694] to-[#1e4ed8] text-white shadow-lg shadow-[#143694]/30' 
                        : 'bg-gradient-to-r from-gray-100 to-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages || totalPages === 0}
                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-gray-100 to-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
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