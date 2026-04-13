import { useState, useEffect } from 'react';
import { Search, Eye, ChevronLeft, ChevronRight, Trash, Building2, MapPin, Calendar, Users, FileText, AlertCircle } from 'lucide-react';
import CollegeRequestDetail from './CollegeRequestDetail';
import { acceptCandidate, deleteJobById, getCollegeApplicationsForJob, getPostedJobs, rejectCandidate, shortlistCandidate } from '@/lib/Company_AxiosInstance';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export default function PoolCampusJobManagement() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedJob, setSelectedJob] = useState(null);
  const [colleges, setColleges] = useState([]);
  const [collegesLoading, setCollegesLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isVisited, setIsVisited] = useState();

  const navigate = useNavigate();

  const itemsPerPage = 10;

  const fetchJobs = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getPostedJobs("Pool-campus", "Accepted");
      console.log("Fetched jobs:", response?.data);
      setJobs(response?.data || []);
    } catch (err) {
      console.error("Error fetching jobs:", err);
      setError(err.response?.data?.message || err.message || "Failed to fetch drives.");
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  {/*const fetchCollegesForJob = async (jobId, jobType, isVisited) => {
    setCollegesLoading(true);
    setError(null);
    try {
      let response;
      if (isVisited === false) response = await getCollegeApplicationsForJob(jobId, jobType, "Accepted", isVisited);
      else {
        response = await getCollegeApplicationsForJob(jobId, jobType, "Accepted");
      }
      setColleges(response.data || []);
    } catch (err) {
      console.error("Error fetching colleges:", err);
      setError(err.response?.data?.message || err.message || "Failed to fetch colleges.");
      setColleges([]);
    } finally {
      setCollegesLoading(false);
    }
  };*/}

  const fetchCollegesForJob = async (jobId, jobType, filterVisited = null) => {
    setCollegesLoading(true);
    setError(null);
    
    try {
      const response = await getCollegeApplicationsForJob(
        jobId,
        jobType,
        "Accepted",
        filterVisited
      );
    
      setColleges(response?.data || []);
    } catch (err) {
      console.error("Error fetching colleges:", err);
      setError(
        err.response?.data?.message ||
        err.message ||
        "Failed to fetch colleges."
      );
      setColleges([]);
    } finally {
      setCollegesLoading(false);
    }
  };


  const handleUpdateApplicationStatus = async (applicationId, status) => {
    try {
      let response;
      switch (status) {
        case "Shortlisted":
          response = await shortlistCandidate(applicationId, selectedJob?.jobRoles);
          break;
        case "Rejected":
          response = await rejectCandidate(applicationId, selectedJob?.jobRoles);
          break;
        case "Accepted":
          response = await acceptCandidate(applicationId, selectedJob?.jobRoles);
          break;
        default:
          alert("Invalid Action!");
      }
      if (response?.data?.success === true) {
        toast.success(`Application status updated to: ${status}`);
        // Refresh the colleges list after status update
        if (selectedJob) {
          fetchCollegesForJob(
            selectedJob._id,
            selectedJob.jobType,
            isVisited === "true" ? false : true
          );

        }
      } else {
        toast.error(response?.response?.data?.msg || 'Failed to update status');
      }
    } catch (err) {
      console.error("Error updating application status:", err);
      setError(err.response?.data?.message || err.message || "Failed to update status.");
      toast.error('Something went wrong!');
    }
  };

  const handleDelete = async (jobId) => {
    try {
      const confirmed = window.confirm("This action can't be undone! Are you sure you want to delete the job?");
      if (confirmed) {
        await deleteJobById(jobId);
        fetchJobs();
        toast.success(`Job deleted successfully`);
      }
    } catch (error) {
      console.log("Error: ", error);
      toast.error('Failed to delete job');
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const filteredJobs = jobs.filter(job => {
    const searchLower = searchQuery.toLowerCase();

    // Check job roles
    const jobRolesMatch = Array.isArray(job.jobRoles)
      ? job.jobRoles.some(role => role?.toLowerCase().includes(searchLower))
      : false;

    // Check work locations
    const workLocations = job.workLocation || [];
    const workLocationsMatch = Array.isArray(workLocations)
      ? workLocations.some(location => location?.toLowerCase().includes(searchLower))
      : false;

    return (
      jobRolesMatch ||
      workLocationsMatch ||
      (job._id?.toLowerCase().includes(searchLower)) ||
      (job.lookingFor?.toLowerCase().includes(searchLower))
    );
  });

  const totalItems = filteredJobs.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentJobs = filteredJobs.slice(startIndex, startIndex + itemsPerPage);

  const handleViewColleges = async (job) => {
    setSelectedJob(job);
    setIsVisited("false"); // all accepted
    await fetchCollegesForJob(job._id, job.jobType, true);
  };


  const showNewApplication = async (job) => {
    try {
      setSelectedJob(job);
      setIsVisited("true"); // new accepted
      await fetchCollegesForJob(job._id, job.jobType, false);
    } catch (error) {
      console.log(error);
    }
  };


  const handleBackToList = () => {
    setSelectedJob(null);
    setColleges([]);
    setIsVisited('');
    fetchJobs();
  };

  const displayWorkLocations = (job) => {
    const workLocations = job.workLocation || [];
    if (!workLocations || workLocations.length === 0) return 'N/A';
    return Array.isArray(workLocations) ? workLocations.join(', ') : String(workLocations);
  };

  const displayJobRoles = (job) => {
    const jobRoles = job.jobRoles || [];
    if (!jobRoles || jobRoles.length === 0) return 'N/A';
    return Array.isArray(jobRoles) ? jobRoles.join(', ') : String(jobRoles);
  };

  if (selectedJob) {
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
              Back to drives
            </button>

            {/* Selected Job Header */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-gradient-to-br from-[#667eea]/20 to-[#764ba2]/20 rounded-xl">
                  <Building2 className="h-6 w-6 text-[#667eea]" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent">
                    Applications forasd: {displayJobRoles(selectedJob)}
                  </h2>
                  <div className="flex flex-wrap items-center gap-3 mt-2">
                    <span className="inline-flex items-center text-sm text-gray-600 bg-gradient-to-r from-gray-50 to-white px-3 py-1.5 rounded-lg">
                      <MapPin className="h-3 w-3 mr-1.5" />
                      {displayWorkLocations(selectedJob)}
                    </span>
                    <span className="inline-flex items-center text-sm text-gray-600 bg-gradient-to-r from-gray-50 to-white px-3 py-1.5 rounded-lg">
                      <FileText className="h-3 w-3 mr-1.5" />
                      {Array.isArray(selectedJob.employmentType) ? selectedJob.employmentType.join(', ') : selectedJob.employmentType || 'N/A Type'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Colleges List */}
            {collegesLoading ? (
              <div className="flex flex-col items-center justify-center p-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#667eea]"></div>
                <p className="mt-4 text-gray-600">Loading college applications...</p>
              </div>
            ) : error ? (
              <div className="p-4 bg-gradient-to-r from-red-50 to-white border border-red-200 rounded-xl">
                <div className="flex items-start">
                  <AlertCircle className="h-5 w-5 text-red-600 mr-3 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-medium text-red-800">Error</h3>
                    <p className="text-sm text-red-700 mt-1">{error}</p>
                  </div>
                </div>
              </div>
            ) : colleges.length === 0 ? (
              <div className="bg-gradient-to-r from-gray-50 to-white border border-gray-200 rounded-xl p-12 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-gray-100 to-gray-200 mb-4">
                  <Users className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No colleges have applied</h3>
                <p className="text-gray-600">No colleges have applied for this drive yet.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {colleges.map(college => (
                  <CollegeRequestDetail
                    key={college._id}
                    collegeApplication={college}
                    driveDetails={selectedJob}
                    onAccept={() => handleUpdateApplicationStatus(college._id, 'Accepted')}
                    onShortlist={() => handleUpdateApplicationStatus(college._id, 'Shortlisted')}
                    onReject={() => handleUpdateApplicationStatus(college._id, 'Rejected')}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#667eea]/10 via-[#f093fb]/5 to-[#764ba2]/10">
      
              <div className="container mx-auto px-4 pt-8">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 px-6 py-5 mb-6">

                    {/* Header */}
                    <div className="flex items-center gap-3 mb-4">
                    <h2 className="text-2xl md:text-[26px] font-semibold text-[#143694] tracking-tight">
                        Accepted Colleges / Candidates
                    </h2>

                    <span className="flex items-center justify-center w-7 h-7 bg-[#143694] text-white text-xs font-bold rounded-full">
                        {jobs?.length || 0}
                    </span>
                    </div>

                    {/* Tabs */}
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2  border-gray-200 pb-2">

                    <button 
                        onClick={() => navigate('/accepted/on-campus-listings')}
                        className="px-3 py-2 text-gray-500 hover:text-[#143694] hover:bg-gray-100 rounded-md font-medium text-sm transition-all"
                    >
                        On-Campus
                    </button>
                    
                    {/* Active */}
                    <button 
                        className="px-6 py-2 bg-[#143694] text-white rounded-full font-medium text-sm shadow-sm"
                    >
                        Pool Campus
                    </button>

                    <button 
                        onClick={() => navigate('/accepted/Off-campus')}
                        className="px-3 py-2 text-gray-500 hover:text-[#143694] hover:bg-gray-100 rounded-md font-medium text-sm transition-all"
                    >
                        Off-Campus
                    </button>

                    <button 
                        onClick={() => navigate('/accepted/internship-listings')}
                        className="px-3 py-2 text-gray-500 hover:text-[#143694] hover:bg-gray-100 rounded-md font-medium text-sm transition-all"
                    >
                        Internship
                    </button>

                    </div>

                </div>
            </div>
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
                  Accepted Pool-Campus Drives
                </h1>
              </div>
              <p className="text-gray-600">
                Track Your Accepted Pool-Campus Drives
              </p>
            </div>
            
            {/* Search Bar */}
            {/* <div className="relative w-full md:w-96">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                className="w-full pl-10 pr-4 py-2.5 bg-gradient-to-r from-gray-50 to-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#667eea]/50 focus:border-transparent focus:outline-none transition-all duration-200"
                placeholder="Search by job role or work location"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div> */}
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

        {/* Drives Table */}
        <div className="bg-white/90 backdrop-blur-sm border border-gray-100 rounded-2xl shadow-lg overflow-hidden">
          {/* Table Header */}
          <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
            <div className="grid grid-cols-12 gap-4 text-xs font-medium text-gray-700 uppercase tracking-wider">
              <div className="col-span-3">Job Roles</div>
              <div className="col-span-2">Work Locations</div>
              <div className="col-span-2">End Date</div>
              <div className="col-span-1 text-center">Views</div>
              <div className="col-span-3 text-center">New Applications</div>
              <div className="col-span-1 text-center">Actions</div>
            </div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-gray-100">
            {loading ? (
              <div className="p-12 text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#667eea]"></div>
                <p className="mt-4 text-gray-600">Loading drives...</p>
              </div>
            ) : currentJobs.length === 0 ? (
              <div className="p-12 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-gray-100 to-gray-200 mb-4">
                  <Search className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No drives found</h3>
                <p className="text-gray-600">No drives match your search criteria.</p>
              </div>
            ) : (
              currentJobs.map(job => (
                <div key={job._id} className="p-4 hover:bg-gray-50/50 transition-all duration-200">
                  <div className="grid grid-cols-12 gap-4 items-center">
                    {/* Job Roles */}
<div className="col-span-3">
  <div 
    onClick={() => navigate(`/company-dashboard/preview/Pool-campus/${job._id}?isApplied=true`)}
    className="group cursor-pointer"
  >
    <h3 className="font-semibold text-gray-900 group-hover:text-[#667eea] transition-colors">
      {displayJobRoles(job)}
    </h3>
    <div className="flex items-center gap-2 mt-1">
      <FileText className="h-3 w-3 text-gray-400" />
      <span className="text-sm text-gray-500">
        {Array.isArray(job.employmentType) ? job.employmentType.join(', ') : job.employmentType || 'N/A Type'}
      </span>
    </div>
  </div>
</div>

                    {/* Work Locations */}
                    <div className="col-span-2">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-3 w-3 text-gray-400 flex-shrink-0" />
                        <span className="text-gray-700 text-sm capitalize truncate">
                          {displayWorkLocations(job)}
                        </span>
                      </div>
                    </div>

                    {/* End Date */}
                    <div className="col-span-2">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-3 w-3 text-gray-400" />
                        <span className="text-gray-700 text-sm">
                          {job.endDate ? new Date(job.endDate).toLocaleDateString() : 'N/A'}
                        </span>
                      </div>
                    </div>

                    {/* Views */}
                    <div className="col-span-1 text-center">
                      <span className="inline-flex items-center justify-center w-8 h-8 bg-gradient-to-r from-blue-100 to-blue-50 text-blue-700 rounded-full text-sm font-medium">
                        {job?.views || 0}
                      </span>
                    </div>

                    {/* Applications */}
                    <div 
                      className="col-span-3 text-center cursor-pointer group"
                      onClick={() => showNewApplication(job)}
                    >
                      <span className="inline-flex items-center justify-center w-8 h-8 bg-gradient-to-r from-green-100 to-green-50 text-green-700 rounded-full text-sm font-medium group-hover:scale-110 transition-transform">
                        {job.applicationCount || 0}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="col-span-1">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleViewColleges(job)}
                          className="p-2 bg-gradient-to-r from-gray-100 to-white border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 hover:text-[#667eea] hover:border-[#667eea]/50 transition-all duration-200"
                          title="View College Applications"
                        >
                          <Eye size={16} />
                        </button>
                        <button 
                          onClick={() => handleDelete(job._id)}
                          className="p-2 bg-gradient-to-r from-red-100 to-red-50 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 hover:text-red-700 hover:border-red-300 transition-all duration-200"
                          title="Delete Job"
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

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-t border-gray-100 bg-gradient-to-r from-gray-50 to-white">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
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
                      onClick={() => setCurrentPage(pageNum)}
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
                onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
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