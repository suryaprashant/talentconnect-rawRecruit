import { useState, useEffect } from 'react';
import {
  Search, Eye, Edit, Users, FileText, Trash,
  ChevronLeft, ChevronRight, Filter, X, Building2,
  MapPin, Calendar, Briefcase, Users as UsersIcon, AlertCircle
} from 'lucide-react';
import ApplicantDetails from './ApplicantDetails';
import { deleteJobById, getPostedJobs } from '@/lib/Company_AxiosInstance';
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

  const handleView = (job) => {
    setSelectedJob(job);
    setShowJobDetail(true);
  };

  const showNewApplication = async (job) => {
    try {
      setSelectedJob(job);
      setShowJobDetail(true);
      setIsVisited(false);
    } catch (error) {
      console.log(error);
    }
  }

  const handleEdit = (jobId) => {
    console.log(`Edit job with ID: ${jobId}`);
  };

  const handleDelete = async (jobId) => {
    try {
      const confirmed = window.confirm("This action can't be undone! Are you sure you want to delete the job?");
      if (confirmed) {
        await deleteJobById(jobId);
        fetchJobs();
        alert(`Job with Id: ${jobId} deleted`);
      }
    } catch (error) {
      console.log("Error: ", error);
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
    <div className="min-h-screen bg-gradient-to-br from-[#667eea]/10 via-[#f093fb]/5 to-[#764ba2]/10">
      <div className="container mx-auto px-4 py-8 pt-22">
        {/* Header Section */}
        <div className="bg-white/90 backdrop-blur-sm border border-gray-100 rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div className="mb-4 md:mb-0">
              <div className="flex items-center mb-2">
                <div className="p-2 bg-gradient-to-br from-[#667eea]/20 to-[#764ba2]/20 rounded-lg mr-3">
                  <Briefcase className="h-5 w-5 text-[#667eea]" />
                </div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent">
                  Manage Off-Campus Applications
                </h1>
              </div>
              <p className="text-gray-600">
                Track Your Job Listings and Streamline Candidate Applications
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
                placeholder="Search by role, location, or work mode"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div> */}
          </div>
        </div>

        {/* Tabs */}
        {/* <div className="bg-white/90 backdrop-blur-sm border border-gray-100 rounded-2xl shadow-lg mb-6 overflow-hidden">
          <div className="flex overflow-x-auto">
            {['All Jobs', 'Published', 'Drafts'].map(tab => (
              <button
                key={tab}
                className={`flex-1 px-6 py-4 text-sm font-medium transition-all duration-200 relative ${
                  activeTab === tab 
                    ? 'text-[#667eea]' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => {
                  setActiveTab(tab);
                  setCurrentPage(1);
                }}
              >
                <div className="flex items-center justify-center gap-2">
                  {tab}
                  <span className={`px-2 py-0.5 text-xs rounded-full ${
                    activeTab === tab 
                      ? 'bg-gradient-to-r from-[#667eea]/20 to-[#764ba2]/20 text-[#667eea]' 
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {getTabCount(tab)}
                  </span>
                </div>
                {activeTab === tab && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#667eea] to-[#764ba2]"></div>
                )}
              </button>
            ))}
          </div>
        </div> */}

        {/* Stats Bar */}
        {/* <div className="mb-6">
          <div className="flex items-center justify-between text-sm text-gray-600 px-2">
            <div>
              Showing <span className="font-semibold text-[#667eea]">{startIndex + 1}</span> - <span className="font-semibold text-[#667eea]">{Math.min(endIndex, filteredJobs?.length || 0)}</span> of <span className="font-semibold text-[#667eea]">{filteredJobs?.length || 0}</span> jobs
            </div>
            <button
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-gray-100 to-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-4 w-4" />
              Filters
            </button>
          </div>
        </div> */}

        {/* Jobs Table */}
        <div className="bg-white/90 backdrop-blur-sm border border-gray-100 rounded-2xl shadow-lg overflow-hidden">
          {/* Table Header */}
          <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
            <div className="grid grid-cols-12 gap-4 text-xs font-medium text-gray-700 uppercase tracking-wider">
              <div className="col-span-3">Job Title</div>
              <div className="col-span-2">Status</div>
              <div className="col-span-2">Deadline</div>
              <div className="col-span-1 text-center">Views</div>
              <div className="col-span-1 text-center">Applications</div>
              <div className="col-span-3 text-center">Actions</div>
            </div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-gray-100">
            {loading ? (
              <div className="p-12 text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#667eea]"></div>
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
                    {/* Job Title */}
                    <div className="col-span-3">
                      <div 
                        onClick={() => navigate(`/company-dashboard/Off-campus/${job._id}?isApplied=true`)}
                        className="group cursor-pointer"
                      >
                        <h3 className="font-semibold text-gray-900 group-hover:text-[#667eea] transition-colors line-clamp-1">
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

                    {/* Status */}
                    <div className="col-span-2">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        job?.status === 'Published'
                          ? 'bg-gradient-to-r from-green-100 to-green-50 text-green-700'
                          : 'bg-gradient-to-r from-gray-100 to-gray-50 text-gray-700'
                      }`}>
                        {job?.status}
                      </span>
                    </div>

                    {/* Deadline */}
                    <div className="col-span-2">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-3 w-3 text-gray-400" />
                        <span className="text-gray-700 text-sm">
                          {new Date(job?.endDate).toUTCString().slice(0, 16)}
                        </span>
                      </div>
                    </div>

                    {/* Views */}
                    <div className="col-span-1 text-center">
                      <span className="inline-flex items-center justify-center w-8 h-8 bg-gradient-to-r from-blue-100 to-blue-50 text-blue-700 rounded-full text-sm font-medium">
                        {job.views || 0}
                      </span>
                    </div>

                    {/* Applications */}
                    <div 
                      className="col-span-1 text-center cursor-pointer group"
                      onClick={() => showNewApplication(job)}
                    >
                      <span className="inline-flex items-center justify-center w-8 h-8 bg-gradient-to-r from-green-100 to-green-50 text-green-700 rounded-full text-sm font-medium group-hover:scale-110 transition-transform">
                        {job?.applicationCount || 0}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="col-span-3">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleView(job)}
                          className="p-2 bg-gradient-to-r from-gray-100 to-white border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 hover:text-[#667eea] hover:border-[#667eea]/50 transition-all duration-200"
                          title="View Job"
                        >
                          <Eye size={16} />
                        </button>
                        {/* <button
                          onClick={() => handleEdit(job._id)}
                          className="p-2 bg-gradient-to-r from-gray-100 to-white border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 hover:text-[#667eea] hover:border-[#667eea]/50 transition-all duration-200"
                          title="Edit Job"
                        >
                          <Edit size={16} />
                        </button> */}
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
          {/* {totalPages > 1 && (
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
          )} */}
        </div>
      </div>
    </div>
  );
}