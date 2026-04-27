import { useState, useEffect } from 'react';
import {
  Search, Eye, Edit, Users, FileText, Trash,
  ChevronLeft, ChevronRight, Filter, X, Building2,Trash2,
  MapPin, Calendar, Briefcase, Users as UsersIcon, AlertCircle,Ban
} from 'lucide-react';
import ApplicantDetails from './ApplicantDetails';
import { deleteJobById, getPostedJobs,permanentDeleteJobById } from '@/lib/Company_AxiosInstance';
import { Link, useNavigate } from 'react-router-dom';


export default function OffCampusJobManagement() {
  // State variables
  const [jobs, setJobs] = useState();
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('All Jobs');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [showJobDetail, setShowJobDetail] = useState(false);
  const [isVisited, setIsVisited] = useState();
  const navigate = useNavigate();

  const itemsPerPage = 10;
  const totalItems = jobs?.length || 0;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const response = await getPostedJobs("Off-campus", "Applied");
      setJobs(response?.data);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  // Filter jobs based on search query and active tab
  const filteredJobs = jobs?.filter(job => {
    const matchesSearch = job.jobRoles[0].toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.workMode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.venue.toLowerCase().includes(searchQuery.toLowerCase());

    if (activeTab === 'All Jobs') {
      return matchesSearch;
    } else if (activeTab === 'Published') {
      return matchesSearch && job.status === 'Published';
    } else if (activeTab === 'Drafts') {
      return matchesSearch && job.status === 'Draft';
    }

    return matchesSearch;
  });

  // Current page data
  const currentJobs = filteredJobs?.slice(startIndex, endIndex);

  // Pagination controls
  const handlePrevPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  };

  const handlePageClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleView = async (job) => {
    try {
      // 1. Mark as read on the backend first
      await markApplicationsVisited(job._id, "Off-campus", "Applied");
      
      // 2. Refresh dashboard to update counts
      await fetchJobs(); 
      
      // 3. Open details and show everyone (isVisited="false" means "do not filter by unvisited")
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
    setIsVisited("true"); // Show ONLY unvisited
    setShowJobDetail(true);
  };

  const handleEdit = (jobId) => {
    console.log(`Edit job with ID: ${jobId}`);
  };

  const handleDelete = async (jobId) => {
    try {
     // const confirmed = window.confirm("This action can't be undone! Are you sure you want to delete the job?");
     const confirmed = window.confirm(
        "Are you sure you want to mark this job as Inactive? It will no longer be visible to new applicants."
      );
      if (confirmed) {
        await deleteJobById(jobId);
        fetchJobs();
        alert(`Job with Id: ${jobId} deleted`);
      }
    } catch (error) {
      console.log("Error: ", error);
    }
  };

  const handlePermanentDelete = async (jobId) => {
  const confirmed = window.confirm("⚠️ This will PERMANENTLY delete the job and cannot be undone! Are you sure?");
  if (confirmed) {
    try {
      await permanentDeleteJobById(jobId);
      fetchJobs();
      alert("Job permanently deleted.");
    } catch (error) {
      console.error("Error permanently deleting job:", error);
    }
  }
};

  const handleAcceptDrive = (jobId) => {
    console.log(`Accept drive for job ID: ${jobId}`);
    setShowJobDetail(false);
  };

  const handleShortlistDrive = (jobId) => {
    console.log(`Shortlist drive for job ID: ${jobId}`);
    setShowJobDetail(false);
  };

  const handleRejectDrive = (jobId) => {
    console.log(`Reject drive for job ID: ${jobId}`);
    setShowJobDetail(false);
  };

  const onClose = () => {
    setShowJobDetail(false);
    setIsVisited('');
    fetchJobs();
  }

  // If showing job detail, render the detail view
  if (showJobDetail && selectedJob) {
    return (
      <ApplicantDetails
        job={selectedJob}
        isVisited={isVisited}
        onClose={() => onClose()}
        onAccept={() => handleAcceptDrive(selectedJob._id)}
        onShortlist={() => handleShortlistDrive(selectedJob._id)}
        onReject={() => handleRejectDrive(selectedJob._id)}
      />
    );
  }

  const getTabCount = (tabName) => {
    if (!jobs) return 0;
    if (tabName === 'All Jobs') return jobs.length;
    if (tabName === 'Published') return jobs.filter(job => job.status === 'Published').length;
    if (tabName === 'Drafts') return jobs.filter(job => job.status === 'Draft').length;
    return 0;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#143694]/10 via-[#f093fb]/5 to-[#1e4ed8]/10">
      {/* <div className="container mx-auto px-4 pt-8">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 px-6 py-5 mb-0">

        {/* Header *
        <div className="flex items-center gap-3 mb-4">
          <h2 className="text-2xl md:text-[26px] font-semibold text-[#143694] tracking-tight">
            Job Management
          </h2>

          <span className="flex items-center justify-center w-7 h-7 bg-[#143694] text-white text-xs font-bold rounded-full">
            {jobs?.length || 0}
          </span>
        </div>

        

      </div>
    </div> */}
      <div className="container mx-auto px-4 py-8 pt-22">
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 px-6 py-6 mt-1 mb-8">

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            
            <div className="mb-4 md:mb-0">

              <div className="flex items-center mb-2">
                
                <div className="p-2 bg-[#143694]/10 rounded-lg mr-3">
                  <Briefcase className="h-5 w-5 text-[#143694]" />
                </div>

                <h1 className="text-xl md:text-2xl font-semibold text-[#143694] tracking-tight">
                  Manage Off-Campus Applications
                </h1>

              </div>

              <p className="text-gray-600 text-sm md:text-base">
                Track your job listings and streamline candidate applications.
              </p>

              {/* Tabs */}
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 border-gray-200 pt-3">

                <button 
                  onClick={() => navigate('/job-management/On-campus')}
                  className="px-2 py-2 text-gray-500 hover:text-[#143694] font-medium text-sm transition-all"
                >
                  On-Campus
                </button>
                
                {/* Others */}
                <button 
                  onClick={() => navigate('/job-management/Pool-campus')}
                  className="px-2 py-2 text-gray-500 hover:text-[#143694] font-medium text-sm transition-all"
                >
                  Pool-Campus
                </button>

                {/* Active */}
                <button 
                  className="px-6 py-2 bg-[#143694] text-white rounded-full font-medium text-sm shadow-sm"
                >
                  Off-Campus
                </button>
                <button 
                  onClick={() => navigate('/job-management/Internship')}
                  className="px-2 py-2 text-gray-500 hover:text-[#143694] font-medium text-sm transition-all"
                >
                  Internship
                </button>

              </div>

            </div>

          </div>

        </div>

        {/* Jobs Table */}
        <div className="bg-white/90 backdrop-blur-sm border border-gray-100 rounded-2xl shadow-lg overflow-hidden">
          {/* Table Header */}
          <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
            <div className="grid grid-cols-12 gap-4 text-xs font-medium text-gray-700 uppercase tracking-wider">
              <div className="col-span-3">Job Title</div>
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
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#143694]"></div>
                <p className="mt-4 text-gray-600">Loading jobs...</p>
              </div>
            ) : currentJobs?.length === 0 ? (
              <div className="p-12 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-gray-100 to-gray-200 mb-4">
                  <Search className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs found</h3>
                <p className="text-gray-600">No jobs match your search criteria.</p>
              </div>
            ) : (
              currentJobs?.map(job => (
                <div key={job._id} className="p-4 hover:bg-gray-50/50 transition-all duration-200">
                  <div className="grid grid-cols-12 gap-4 items-center">
                    {/* Job Title - col-span-4 (increased from 3) */}
                    <div className="col-span-3">
                      <div 
                        onClick={() => navigate(`/company-dashboard/Off-campus/${job._id}?isApplied=true`)}
                        className="group cursor-pointer"
                      >
                        <h3 className="font-semibold text-gray-900 group-hover:text-[#143694] transition-colors">
                          {job?.jobRoles?.map((title, ind) => title).join(', ')}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <Briefcase className="h-3 w-3 text-gray-400" />
                          <span className="text-sm text-gray-500">{job?.workMode}</span>
                          <span className="text-gray-300">•</span>
                          <MapPin className="h-3 w-3 text-gray-400" />
                          <span className="text-sm text-gray-500 capitalize">{job?.location[0]}</span>
                        </div>
                      </div>
                    </div>

                    {/* Deadline - col-span-2 */}
                    <div className="col-span-2">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-3 w-3 text-gray-400" />
                        <span className="text-gray-700 text-sm">
                          {new Date(job?.endDate).toLocaleDateString('en-US', {
                                                                month: 'short',
                                                                day: 'numeric',
                                                                year: 'numeric'
                                                            })}
                        </span>
                      </div>
                    </div>

                    {/* Views - col-span-1 */}
                    <div className="col-span-2 text-center">
                      <span className="inline-flex items-center justify-center w-8 h-8 bg-gradient-to-r from-blue-100 to-blue-50 text-[#143694] rounded-full text-sm font-medium">
                        {job.views || 0}
                      </span>
                    </div>

                    {/* Applications - col-span-2 (increased from 1) */}
                    <div 
                      className="col-span-3 text-center cursor-pointer group"
                      onClick={() => handleView(job)}
                    >
                      <span className="inline-flex items-center justify-center w-8 h-8 bg-gradient-to-r from-green-100 to-green-50 text-green-700 rounded-full text-sm font-medium group-hover:scale-110 transition-transform">
                        {job?.applicationCount || 0}
                      </span>
                    </div>

                    {/* Actions - col-span-3 */}
                    <div className="col-span-2">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => showNewApplication(job)}
                          className="p-2 bg-gradient-to-r from-gray-100 to-white border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 hover:text-[#143694] hover:border-[#143694]/50 transition-all duration-200"
                          title="View Job"
                        >
                          <Eye size={16} />
                        </button>
                        <button 
                          onClick={() => handleDelete(job._id)}
                          className="p-2 bg-gradient-to-r from-red-100 to-red-50 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 hover:text-red-700 hover:border-red-300 transition-all duration-200"
                         title="Mark as Inactive"
                        >
                          <Ban size={16} />
                        </button>
                        <button
  onClick={() => handlePermanentDelete(job._id)}
  className="p-2 bg-gradient-to-r from-red-100 to-red-50 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 hover:text-red-700 hover:border-red-300 transition-all duration-200"
  title="Permanently Delete Job"
>
  <Trash2 size={16} />
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
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-gray-100 to-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  <ChevronLeft size={16} />
                  Prev
                </button>
                
                <div className="text-sm text-gray-600">
                  Page <span className="font-semibold text-[#143694]">{currentPage}</span> of <span className="font-semibold">{totalPages}</span>
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
                          ? 'bg-gradient-to-r from-[#143694] to-[#1e4ed8] text-white shadow-lg shadow-[#143694]/30' 
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