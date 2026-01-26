import { useState, useEffect } from 'react';
import {
  Search, Eye, ChevronLeft, ChevronRight, Trash, Building2, Calendar,
  AlertCircle, Users, MapPin, FileText
} from 'lucide-react';
import ApplicantDetails from './internDetails';
import { deleteJobById, getPostedJobs } from '@/lib/Company_AxiosInstance';
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
  const navigate = useNavigate();

  const itemsPerPage = 10;

  const fetchJobs = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getPostedJobs("Internship", "Applied");
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

  // Filter jobs based on search query
  const filteredJobs = jobs?.filter(job => {
    if (!searchQuery) return true;
    
    const searchLower = searchQuery.toLowerCase();
    
    // Safely convert values to strings before calling toLowerCase()
    const jobTitleStr = job.jobTitle ? String(job.jobTitle).toLowerCase() : '';
    const statusStr = job.status ? String(job.status).toLowerCase() : '';
    const workModeStr = job.workMode ? String(job.workMode).toLowerCase() : '';
    const locationStr = job.location?.[0] ? String(job.location[0]).toLowerCase() : '';
    
    return (
      jobTitleStr.includes(searchLower) ||
      statusStr.includes(searchLower) ||
      workModeStr.includes(searchLower) ||
      locationStr.includes(searchLower)
    );
  });

  const totalItems = filteredJobs?.length || 0;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentJobs = filteredJobs?.slice(startIndex, startIndex + itemsPerPage);

  const handleViewApplications = (job) => {
    setSelectedJob(job);
    setShowJobDetail(true);
  };

  const handleBackToList = () => {
    setSelectedJob(null);
    setShowJobDetail(false);
  };

  // If showing job detail, render the detail view
  if (showJobDetail && selectedJob) {
    return (
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
                    Applications for: {selectedJob?.jobTitle || 'N/A'}
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
                      {selectedJob?.location?.[0] || 'No Location'}
                    </span>
                    <span className="inline-flex items-center text-sm text-gray-600 bg-gradient-to-r from-gray-50 to-white px-3 py-1.5 rounded-lg">
                      <Calendar className="h-3 w-3 mr-1.5" />
                      {selectedJob?.endDate ? new Date(selectedJob.endDate).toLocaleDateString('en-US', { 
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
              onClose={handleBackToList}
            />
          </div>
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
                  Manage Internship Applications
                </h1>
              </div>
              <p className="text-gray-600">
                Track Your Internship Listings and Streamline Candidate Applications
              </p>
            </div>
            
            {/* Search Bar */}
            <div className="relative w-full md:w-96">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                className="w-full pl-10 pr-4 py-2.5 bg-gradient-to-r from-gray-50 to-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#667eea]/50 focus:border-transparent focus:outline-none transition-all duration-200"
                placeholder="Search by job title, status, or location"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
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
          {/* Table Header - Original UI */}
          <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
            <div className="grid grid-cols-12 gap-4 text-xs font-medium text-gray-700 uppercase tracking-wider">
              <div className="col-span-3">Internship Role</div>
              <div className="col-span-3">Location</div>
              <div className="col-span-2">End Date</div>
              <div className="col-span-1 text-center">Views</div>
              <div className="col-span-1 text-center">New Applications</div>
              <div className="col-span-2 text-center">Actions</div>
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
              currentJobs?.map(job => (
                <div key={job._id} className="p-4 hover:bg-gray-50/50 transition-all duration-200">
                  <div className="grid grid-cols-12 gap-4 items-center">
                    {/* Job Title/Role - Original layout */}
                    <div className="col-span-3">
                      <div 
                        onClick={() => navigate(`/company-dashboard/Internship/${job._id}?isApplied=true`)}
                        className="group cursor-pointer"
                      >
                        <h3 className="font-semibold text-gray-900 group-hover:text-[#667eea] transition-colors break-words whitespace-normal">
                          {job?.jobTitle || 'N/A'}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <FileText className="h-3 w-3 text-gray-400" />
                          <span className="text-sm text-gray-500">
                            {job?.internshipDuration || job?.duration || 'N/A Duration'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Location - Original layout */}
                    <div className="col-span-3">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-3 w-3 text-gray-400 flex-shrink-0" />
                        <span className="text-gray-700 text-sm truncate">
                          {job?.location?.[0] || 'No Location'}
                        </span>
                      </div>
                    </div>

                    {/* End Date - Original layout */}
                    <div className="col-span-2">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-3 w-3 text-gray-400" />
                        <span className="text-gray-700 text-sm">
                          {job?.endDate ? new Date(job.endDate).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric',
                            year: 'numeric'
                          }) : 'N/A'}
                        </span>
                      </div>
                    </div>

                    {/* Views - Original layout */}
                    <div className="col-span-1 text-center">
                      <span className="inline-flex items-center justify-center w-8 h-8 bg-gradient-to-r from-blue-100 to-blue-50 text-blue-700 rounded-full text-sm font-medium">
                        {job?.views || 0}
                      </span>
                    </div>

                    {/* New Applications - Original layout */}
                    <div 
                      className="col-span-1 text-center cursor-pointer group"
                      onClick={() => handleViewApplications(job)}
                    >
                      <span className="inline-flex items-center justify-center w-8 h-8 bg-gradient-to-r from-green-100 to-green-50 text-green-700 rounded-full text-sm font-medium group-hover:scale-110 transition-transform">
                        {job?.applicationCount || 0}
                      </span>
                    </div>

                    {/* Actions - Original layout */}
                    <div className="col-span-2">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleViewApplications(job)}
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
              ))
            )}
          </div>

          {/* Pagination - Original layout */}
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
                        ? 'bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white shadow-lg shadow-[#667eea]/30' 
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