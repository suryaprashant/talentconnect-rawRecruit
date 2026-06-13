// import { useState, useEffect } from 'react';
// import {
//     Search, Eye, Edit, Users, FileText, Trash,
//     ChevronLeft, ChevronRight, Filter, X, Building2, MapPin, Calendar, AlertCircle, Briefcase
// } from 'lucide-react';
// import ApplicantDetails from './ApplicantDetails';
// import { deleteJobById, getEmployerJobs } from '@/lib/Company_AxiosInstance';

// export default function OffCampusJobManagement() {
//     // State variables
//     const [jobs, setJobs] = useState();
//     const [loading, setLoading] = useState(true);
//     const [currentPage, setCurrentPage] = useState(1);
//     const [searchQuery, setSearchQuery] = useState('');
//     const [showFilters, setShowFilters] = useState(false);
//     const [selectedJob, setSelectedJob] = useState(null);
//     const [showJobDetail, setShowJobDetail] = useState(false);

//     const itemsPerPage = 5;
//     const totalItems = jobs?.length;
//     const totalPages = Math.ceil(totalItems / itemsPerPage);
//     const startIndex = (currentPage - 1) * itemsPerPage;
//     const endIndex = Math.min(startIndex + itemsPerPage, totalItems);

//     const fetchJobs = async () => {
//         try {
//             const response = await getEmployerJobs("Off-campus");
//             setJobs(response?.data);
//         } catch (error) {
//             console.error("Error fetching jobs:", error);
//             setLoading(false);
//         }
//         setLoading(false);
//     };

//     useEffect(() => {
//         fetchJobs();
//     }, []);

//     // Filter jobs based on search query and active tab
//     const filteredJobs = jobs?.filter(job => {
//         const matchesSearch = job.jobRoles[0].toLowerCase().includes(searchQuery.toLowerCase()) ||
//             job.workMode.toLowerCase().includes(searchQuery.toLowerCase()) ||
//             job.venue.toLowerCase().includes(searchQuery.toLowerCase());

//         return matchesSearch;
//     });

//     // Current page data
//     const currentJobs = filteredJobs?.slice(startIndex, endIndex);

//     // Pagination controls
//     const handlePrevPage = () => {
//         setCurrentPage(prev => Math.max(prev - 1, 1));
//     };

//     const handleNextPage = () => {
//         setCurrentPage(prev => Math.min(prev + 1, totalPages));
//     };

//     const handlePageClick = (pageNumber) => {
//         setCurrentPage(pageNumber);
//     };

//     // Action handlers
//     const handleView = (jobId) => {
//         const job = jobs.find(j => j._id === jobId);
//         if (job) {
//             setSelectedJob(job);
//             setShowJobDetail(true);
//         }
//     };

//     const handleEdit = (jobId) => {
//         console.log(`Edit job with ID: ${jobId}`);
//     };

//     const handleApplications = (jobId) => {
//         console.log(`View applications for job ID: ${jobId}`);
//     };

//     const handleExport = (jobId) => {
//         console.log(`Export job with ID: ${jobId}`);
//     };

//     const handleDelete = async (jobId) => {
//         try {
//             const confirmed = window.confirm("This action can't be undone! Are you sure you want to delete the job?");
//             if (confirmed) {
//                 const response = await deleteJobById(jobId);
//                 fetchJobs();
//                 alert(`Job with Id: ${jobId} deleted`);
//             }
//         } catch (error) {
//             console.log("Error: ", error);
//         }
//     };

//     // College request detail handlers
//     const handleAcceptDrive = (jobId) => {
//         console.log(`Accept drive for job ID: ${jobId}`);
//         setShowJobDetail(false);
//     };

//     const handleShortlistDrive = (jobId) => {
//         console.log(`Shortlist drive for job ID: ${jobId}`);
//         setShowJobDetail(false);
//     };

//     const handleRejectDrive = (jobId) => {
//         console.log(`Reject drive for job ID: ${jobId}`);
//         setShowJobDetail(false);
//     };

//     // If showing job detail, render the detail view
//     if (showJobDetail && selectedJob) {
//         return (
//             <ApplicantDetails
//                 job={selectedJob}
//                 onClose={() => setShowJobDetail(false)}
//                 onAccept={() => handleAcceptDrive(selectedJob._id)}
//                 onShortlist={() => handleShortlistDrive(selectedJob._id)}
//                 onReject={() => handleRejectDrive(selectedJob._id)}
//             />
//         );
//     }

//     return (
//         <div className="min-h-screen bg-gradient-to-br from-[#143694]/10 via-[#f093fb]/5 to-[#1e4ed8]/10">
//             <div className="max-w-7xl mx-auto p-4 py-8">
//                 {/* Header Section */}
//                 <div className="bg-white/90 backdrop-blur-sm border border-gray-100 rounded-2xl shadow-lg p-6 mb-6">
//                     <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
//                         <div className="mb-4 md:mb-0">
//                             <div className="flex items-center mb-2">
//                                 <div className="p-2 bg-gradient-to-br from-[#143694]/20 to-[#1e4ed8]/20 rounded-lg mr-3">
//                                     <Building2 className="h-5 w-5 text-[#143694]" />
//                                 </div>
//                                 <h1 className="text-2xl font-bold bg-gradient-to-r from-[#143694] to-[#1e4ed8] bg-clip-text text-transparent">
//                                     Shortlisted Off-Campus Applications
//                                 </h1>
//                             </div>
//                             <p className="text-gray-600">
//                                 Track Your Off-Campus and Streamline Shortlisted Candidate Applications
//                             </p>
//                         </div>
                        
//                         {/* Search Bar */}
//                         <div className="relative w-full md:w-96">
//                             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                                 <Search className="h-4 w-4 text-gray-400" />
//                             </div>
//                             <input
//                                 type="text"
//                                 className="w-full pl-10 pr-4 py-2.5 bg-gradient-to-r from-gray-50 to-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#143694]/50 focus:border-transparent focus:outline-none transition-all duration-200"
//                                 placeholder="Search by job role or location"
//                                 value={searchQuery}
//                                 onChange={(e) => setSearchQuery(e.target.value)}
//                             />
//                         </div>
//                     </div>
//                 </div>

//                 {/* Jobs Table */}
//                 <div className="bg-white/90 backdrop-blur-sm border border-gray-100 rounded-2xl shadow-lg overflow-hidden">
//                     {/* Table Header */}
//                     <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
//                         <div className="grid grid-cols-12 gap-4 text-xs font-medium text-gray-700 uppercase tracking-wider">
//                             <div className="col-span-4">Job Title</div>
//                             <div className="col-span-2">Status</div>
//                             <div className="col-span-3">Deadline</div>
//                             <div className="col-span-3 text-center">Actions</div>
//                         </div>
//                     </div>

//                     {/* Table Body */}
//                     <div className="divide-y divide-gray-100">
//                         {loading ? (
//                             <div className="p-12 text-center">
//                                 <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#143694]"></div>
//                                 <p className="mt-4 text-gray-600">Loading jobs...</p>
//                             </div>
//                         ) : currentJobs?.length === 0 ? (
//                             <div className="p-12 text-center">
//                                 <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-gray-100 to-gray-200 mb-4">
//                                     <Search className="h-8 w-8 text-gray-400" />
//                                 </div>
//                                 <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs found</h3>
//                                 <p className="text-gray-600">No jobs match your search criteria.</p>
//                             </div>
//                         ) : (
//                             currentJobs?.map(job => (
//                                 <div 
//                                     key={job._id} 
//                                     className="p-4 hover:bg-gray-50/50 transition-all duration-200 cursor-pointer"
//                                     onClick={() => handleView(job._id)}
//                                 >
//                                     <div className="grid grid-cols-12 gap-4 items-center">
//                                         {/* Job Title */}
//                                         <div className="col-span-4">
//                                             <div className="group">
//                                                 <h3 className="font-semibold text-gray-900 group-hover:text-[#143694] transition-colors line-clamp-1">
//                                                     {job?.jobRoles[0]}
//                                                 </h3>
//                                                 <div className="flex items-center gap-3 mt-1">
//                                                     <span className="inline-flex items-center text-sm text-gray-500">
//                                                         <Briefcase className="h-3 w-3 mr-1.5" />
//                                                         {job?.workMode}
//                                                     </span>
//                                                     <span className="inline-flex items-center text-sm text-gray-500">
//                                                         <MapPin className="h-3 w-3 mr-1.5" />
//                                                         {job?.location[0]}
//                                                     </span>
//                                                 </div>
//                                             </div>
//                                         </div>

//                                         {/* Status */}
//                                         <div className="col-span-2">
//                                             <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium ${job?.status === 'Published'
//                                                 ? 'bg-gradient-to-r from-green-100 to-green-50 text-green-700 border border-green-200'
//                                                 : 'bg-gradient-to-r from-gray-100 to-gray-50 text-gray-700 border border-gray-200'
//                                                 }`}>
//                                                 {job?.status}
//                                             </span>
//                                         </div>

//                                         {/* Deadline */}
//                                         <div className="col-span-3">
//                                             <div className="flex items-center gap-2">
//                                                 <Calendar className="h-3 w-3 text-gray-400" />
//                                                 <span className="text-gray-700 text-sm">
//                                                     {job?.endDate ? new Date(job?.endDate).toUTCString().slice(0, 16) : 'N/A'}
//                                                 </span>
//                                             </div>
//                                         </div>

//                                         {/* Actions */}
//                                         <div className="col-span-3" onClick={(e) => e.stopPropagation()}>
//                                             <div className="flex items-center justify-center gap-2">
//                                                 <button 
//                                                     onClick={() => handleView(job._id)}
//                                                     className="p-2 bg-gradient-to-r from-gray-100 to-white border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 hover:text-[#143694] hover:border-[#143694]/50 transition-all duration-200"
//                                                     title="View Job"
//                                                 >
//                                                     <Eye size={16} />
//                                                 </button>
//                                                 <button 
//                                                     onClick={() => handleDelete(job._id)}
//                                                     className="p-2 bg-gradient-to-r from-red-100 to-red-50 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 hover:text-red-700 hover:border-red-300 transition-all duration-200"
//                                                     title="Delete Job"
//                                                 >
//                                                     <Trash size={16} />
//                                                 </button>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </div>
//                             ))
//                         )}
//                     </div>

//                     {/* Pagination */}
//                     {totalPages > 1 && (
//                         <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-t border-gray-100 bg-gradient-to-r from-gray-50 to-white">
//                             <div className="flex items-center gap-4">
//                                 <button
//                                     onClick={handlePrevPage}
//                                     disabled={currentPage === 1}
//                                     className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-gray-100 to-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
//                                 >
//                                     <ChevronLeft size={16} />
//                                     Prev
//                                 </button>
                                
//                                 <div className="text-sm text-gray-600">
//                                     Showing <span className="font-semibold text-[#143694]">{startIndex + 1}</span>-<span className="font-semibold">{Math.min(endIndex, filteredJobs?.length)}</span> of <span className="font-semibold">{filteredJobs?.length}</span>
//                                 </div>
//                             </div>

//                             <div className="flex items-center gap-2">
//                                 {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
//                                     let pageNum;
//                                     if (totalPages <= 5) {
//                                         pageNum = i + 1;
//                                     } else if (currentPage <= 3) {
//                                         pageNum = i + 1;
//                                     } else if (currentPage >= totalPages - 2) {
//                                         pageNum = totalPages - 4 + i;
//                                     } else {
//                                         pageNum = currentPage - 2 + i;
//                                     }
                                    
//                                     if (i === 3 && totalPages > 5 && currentPage < totalPages - 2) {
//                                         return (
//                                             <div key="ellipsis" className="text-gray-400 px-2">
//                                                 ...
//                                             </div>
//                                         );
//                                     }
                                    
//                                     if (i === 4 && totalPages > 5 && currentPage < totalPages - 2) {
//                                         pageNum = totalPages;
//                                     }
                                    
//                                     return (
//                                         <button
//                                             key={pageNum}
//                                             onClick={() => handlePageClick(pageNum)}
//                                             className={`w-10 h-10 flex items-center justify-center rounded-xl text-sm font-medium transition-all duration-200 ${
//                                                 currentPage === pageNum 
//                                                     ? 'bg-gradient-to-r from-[#143694] to-[#1e4ed8] text-white shadow-lg shadow-[#143694]/30' 
//                                                     : 'bg-gradient-to-r from-gray-100 to-white border border-gray-200 text-gray-700 hover:bg-gray-50'
//                                             }`}
//                                         >
//                                             {pageNum}
//                                         </button>
//                                     );
//                                 })}
//                             </div>

//                             <button
//                                 onClick={handleNextPage}
//                                 disabled={currentPage === totalPages}
//                                 className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-gray-100 to-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
//                             >
//                                 Next
//                                 <ChevronRight size={16} />
//                             </button>
//                         </div>
//                     )}
//                 </div>
//             </div>
//         </div>
//     );
// }



{/*import { useState, useEffect } from 'react';
import { Search, Eye, ChevronLeft, ChevronRight, Trash, Building2, MapPin, Calendar, Users, FileText, AlertCircle } from 'lucide-react';
import ApplicantDetails from './ApplicantDetails';
import { deleteJobById, getPostedJobs } from '@/lib/Company_AxiosInstance';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

export default function OffCampusJobManagement() {
  const [jobs, setJobs] = useState();
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState('All Jobs');
    const [selectedJob, setSelectedJob] = useState(null);
    const [showJobDetail, setShowJobDetail] = useState(false);
    const [isVisited, setIsVisited] = useState();

  const itemsPerPage = 10;
  const totalItems = jobs?.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, totalItems);


  const fetchJobs = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getPostedJobs("Off-campus", "Shortlisted");
      console.log("Fetched Off-campus jobs:", response?.data);
      setJobs(response?.data || []);
    } catch (err) {
      console.error("Error fetching jobs:", err);
      setError(err.response?.data?.message || err.message || "Failed to fetch jobs.");
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };
  

  const fetchApplicantsForJob = async (jobId, jobType) => {
    setApplicantsLoading(true);
    setError(null);
    try {
      // This would need to be implemented with your actual API
      // For now, I'll leave it as a placeholder
      console.log("Fetching applicants for job:", jobId, jobType);
      setApplicants([]); // Placeholder - replace with actual API call
    } catch (err) {
      console.error("Error fetching applicants:", err);
      setError(err.response?.data?.message || err.message || "Failed to fetch applicants.");
      setApplicants([]);
    } finally {
      setApplicantsLoading(false);
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
    
    // Check locations
    const locations = job.location || [];
    const locationsMatch = Array.isArray(locations)
      ? locations.some(location => location?.toLowerCase().includes(searchLower))
      : false;

    return (
      jobRolesMatch ||
      locationsMatch ||
      (job._id?.toLowerCase().includes(searchLower)) ||
      (job.workMode?.toLowerCase().includes(searchLower))
    );
  });

  //const totalItems = filteredJobs.length;
  //const totalPages = Math.ceil(totalItems / itemsPerPage);
  //const startIndex = (currentPage - 1) * itemsPerPage;
  //const currentJobs = filteredJobs.slice(startIndex, startIndex + itemsPerPage);

  const handleViewApplicants = (job) => {
    if (job.applicationCount === 0) {
      alert("No applicants have applied for this job yet.");
      return;
    }
    setSelectedJob(job);
    fetchApplicantsForJob(job._id, job.jobType);
  };

  const handleBackToList = () => {
    setSelectedJob(null);
    setApplicants([]);
  };

  const displayLocations = (job) => {
    const locations = job.location || [];
    if (!locations || locations.length === 0) return 'N/A';
    return Array.isArray(locations) ? locations.join(', ') : String(locations);
  };

  const displayJobRoles = (job) => {
    const jobRoles = job.jobRoles || [];
    if (!jobRoles || jobRoles.length === 0) return 'N/A';
    return Array.isArray(jobRoles) ? jobRoles.join(', ') : String(jobRoles);
  };

  if (selectedJob) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#143694]/10 via-[#f093fb]/5 to-[#1e4ed8]/10">
        <div className="max-w-4xl mx-auto p-4 py-8">
          <button
            onClick={handleBackToList}
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6 group"
          >
            <ChevronLeft size={20} className="mr-1 group-hover:-translate-x-1 transition-transform" />
            Back to jobs
          </button>

          <div className="bg-white/90 backdrop-blur-sm border border-gray-100 rounded-2xl shadow-lg p-6">
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-gradient-to-br from-[#143694]/20 to-[#1e4ed8]/20 rounded-xl">
                  <Building2 className="h-6 w-6 text-[#143694]" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-[#143694] to-[#1e4ed8] bg-clip-text text-transparent">
                    Shortlisted Applicants for: {displayJobRoles(selectedJob)}
                  </h2>
                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    <span className="inline-flex items-center text-sm text-gray-600 bg-gradient-to-r from-gray-50 to-white px-3 py-1 rounded-lg">
                      <MapPin className="h-3 w-3 mr-1.5" />
                      {displayLocations(selectedJob)}
                    </span>
                    <span className="inline-flex items-center text-sm text-gray-600 bg-gradient-to-r from-gray-50 to-white px-3 py-1 rounded-lg">
                      <FileText className="h-3 w-3 mr-1.5" />
                      {selectedJob.workMode} • {Array.isArray(selectedJob.employmentType) ? selectedJob.employmentType.join(', ') : selectedJob.employmentType || 'N/A Type'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {applicantsLoading ? (
              <div className="flex flex-col items-center justify-center p-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#143694]"></div>
                <p className="mt-4 text-gray-600">Loading applicant applications...</p>
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
            ) : applicants.length === 0 ? (
              <div className="bg-gradient-to-r from-gray-50 to-white border border-gray-200 rounded-xl p-12 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-gray-100 to-gray-200 mb-4">
                  <Users className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No applicants have applied</h3>
                <p className="text-gray-600">No applicants have applied for this job yet.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {applicants.map(applicant => (
                  <ApplicantDetails
                    key={applicant._id}
                    job={applicant}
                    onClose={handleBackToList}
                    onUpdate={fetchJobs}
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
    <div className="min-h-screen bg-gradient-to-br from-[#143694]/10 via-[#f093fb]/5 to-[#1e4ed8]/10">
      <div className="max-w-7xl mx-auto p-4 py-8">
        {/* Header Section 
        <div className="bg-white/90 backdrop-blur-sm border border-gray-100 rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div className="mb-4 md:mb-0">
              <div className="flex items-center mb-2">
                <div className="p-2 bg-gradient-to-br from-[#143694]/20 to-[#1e4ed8]/20 rounded-lg mr-3">
                  <Building2 className="h-5 w-5 text-[#143694]" />
                </div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-[#143694] to-[#1e4ed8] bg-clip-text text-transparent">
                  Shortlisted Off-Campus Drives
                </h1>
              </div>
              <p className="text-gray-600">
                Track and manage your shortlisted off-campus candidate applications
              </p>
            </div>
            
            {/* Search Bar 
            <div className="relative w-full md:w-96">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                className="w-full pl-10 pr-4 py-2.5 bg-gradient-to-r from-gray-50 to-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#143694]/50 focus:border-transparent focus:outline-none transition-all duration-200"
                placeholder="Search by job role or location"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Error Display 
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

        {/* Jobs Table *
        <div className="bg-white/90 backdrop-blur-sm border border-gray-100 rounded-2xl shadow-lg overflow-hidden">
          {/* Table Header 
          <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
            <div className="grid grid-cols-12 gap-4 text-xs font-medium text-gray-700 uppercase tracking-wider">
              <div className="col-span-4">Job Roles</div>
              <div className="col-span-3">Location</div>
              <div className="col-span-2">End Date</div>
              <div className="col-span-1 text-center">New Applications</div>
              <div className="col-span-2 text-center">Actions</div>
            </div>
          </div>

          {/* Table Body 
          <div className="divide-y divide-gray-100">
            {loading ? (
              <div className="p-12 text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#143694]"></div>
                <p className="mt-4 text-gray-600">Loading jobs...</p>
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
              currentJobs.map(job => (
                <div key={job._id} className="p-4 hover:bg-gray-50/50 transition-all duration-200">
                  <div className="grid grid-cols-12 gap-4 items-center">
                    {/* Job Roles - Clickable Link 
                    <div className="col-span-4">
                      <Link
                        to={`/company-dashboard/Off-campus/${job._id}?isApplied=true`}
                        className="group cursor-pointer block"
                      >
                        <div className="font-semibold text-gray-900 group-hover:text-[#143694] transition-colors">
                          {displayJobRoles(job)}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <FileText className="h-3 w-3 text-gray-400" />
                          <span className="text-sm text-gray-500">
                            {job.workMode} • {Array.isArray(job.employmentType) ? job.employmentType.join(', ') : job.employmentType || 'N/A Type'}
                          </span>
                        </div>
                      </Link>
                    </div>

                    {/* Location 
                    <div className="col-span-3">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-3 w-3 text-gray-400 flex-shrink-0" />
                        <span className="text-gray-700 text-sm capitalize truncate">
                          {displayLocations(job)}
                        </span>
                      </div>
                    </div>

                    {/* End Date *
                    <div className="col-span-2">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-3 w-3 text-gray-400" />
                        <span className="text-gray-700 text-sm">
                          {job.endDate ? new Date(job.endDate).toLocaleDateString() : 'N/A'}
                        </span>
                      </div>
                    </div>

                    {/* Applications - Clickable to View Applicants *
                    <div className="col-span-1 text-center">
                      <div
                        onClick={() => handleViewApplicants(job)}
                        className="inline-flex items-center justify-center w-8 h-8 text-sm font-medium rounded-full transition-all duration-200 bg-gradient-to-r from-blue-100 to-blue-50 text-[#143694] hover:bg-gradient-to-r hover:from-blue-200 hover:to-blue-100 hover:shadow-md hover:shadow-blue-100 cursor-pointer"
                        title="View Applicant Applications"
                      >
                        {job.applicationCount || 0}
                      </div>
                    </div>

                    {/* Actions *
                    <div className="col-span-2">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleViewApplicants(job)}
                          disabled={!job.applicationCount || job.applicationCount === 0}
                          className="p-2 bg-gradient-to-r from-gray-100 to-white border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 hover:text-[#143694] hover:border-[#143694]/50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                          title="View Applicant Applications"
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

          {/* Pagination *
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
                      onClick={() => setCurrentPage(pageNum)}
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
}*/}

import { useState, useEffect } from 'react';
import {
    Eye, Trash, ChevronLeft, ChevronRight, Building2, 
    MapPin, Calendar, Briefcase, FileText
} from 'lucide-react';
import ApplicantDetails from './ApplicantDetails';
import { deleteJobById, getPostedJobs, getOffCampusApplicationsForJob } from '@/lib/Company_AxiosInstance';
import { useNavigate } from 'react-router-dom';

export default function OffCampusJobManagement() {
    // State variables
    const [jobs, setJobs] = useState();
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState('All Jobs');
    const [selectedJob, setSelectedJob] = useState(null);
    const [showJobDetail, setShowJobDetail] = useState(false);
    const [isVisited, setIsVisited] = useState();
    const [applications, setApplications] = useState([]);
    const [applicationsLoading, setApplicationsLoading] = useState(false);
    const [applicationsError, setApplicationsError] = useState(null);

    const navigate = useNavigate();

    const itemsPerPage = 10; // Changed to 10 for better fit with 6 columns
    const totalItems = jobs?.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, totalItems);

    const fetchJobs = async () => {
        try {
            const response = await getPostedJobs("Off-campus", "Shortlisted");
            setJobs(response?.data);
        } catch (error) {
            console.error("Error fetching jobs:", error);
            setLoading(false);
        }
        setLoading(false);
    };

    const fetchApplicationsForJob = async (jobId, isVisited) => {
      setApplicationsLoading(true);
      setApplicationsError(null);

      try {
        const res = await getOffCampusApplicationsForJob(
          jobId,
          "Off-campus",
          "Shortlisted",
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

    // Action handlers
    {/*const handleView = (job) => {
        setSelectedJob(job);
        setShowJobDetail(true);
    };*/}

    const handleView = async (job) => {
      try {
        await markApplicationsVisited(job._id, "Off-campus", "Shortlisted");
        await fetchJobs(); // update counts

        setSelectedJob(job);
        setIsVisited("false"); // show ALL
        await fetchApplicationsForJob(job._id, true);

        setShowJobDetail(true);
      } catch (err) {
        setSelectedJob(job);
        setIsVisited("false");
        await fetchApplicationsForJob(job._id, true);
        setShowJobDetail(true);
      }
    };



    const showNewApplication = async (job) => {
      setSelectedJob(job);
      setIsVisited("true"); // frontend flag for ApplicantDetails

      // backend filter
      await fetchApplicationsForJob(job._id, false);

      setShowJobDetail(true);
    };


    const handleDelete = async (jobId) => {
        try {
            const confirmed = window.confirm("This action can't be undone! Are you sure you want to delete the job?");
            if (confirmed) {
                const response = await deleteJobById(jobId);
                fetchJobs();
                alert(`Job with Id: ${jobId} deleted`);
            }
        } catch (error) {
            console.log("Error: ", error);
        }
    };

    // College request detail handlers
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
              applications={applications}          // 🔥 ADD
              loading={applicationsLoading}         // 🔥 ADD
              error={applicationsError}             // 🔥 ADD
              isVisited={isVisited}
              onRefresh={() =>
                fetchApplicationsForJob(
                  selectedJob._id,
                  isVisited === "true" ? false : true
                )
              }
              onClose={() => onClose()}
              onAccept={() => handleAcceptDrive(selectedJob._id)}
              onShortlist={() => handleShortlistDrive(selectedJob._id)}
              onReject={() => handleRejectDrive(selectedJob._id)}
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
                                    Shortlisted Off-Campus Drives
                                </h1>
                            </div>
                            <p className="text-gray-600">
                                Track Your Shortlisted Off-Campus Drives and Candidate Applications
                            </p>
                        </div>
                    </div>

                    {/* Tabs */}
                    {/* <div className="flex border-b border-gray-200 mt-6">
                        {['All Jobs', 'Published', 'Drafts'].map((tab) => (
                            <button
                                key={tab}
                                className={`px-6 py-3 font-medium text-sm transition-all duration-200 relative ${
                                    activeTab === tab 
                                        ? 'text-[#143694]' 
                                        : 'text-gray-600 hover:text-gray-900'
                                }`}
                                onClick={() => setActiveTab(tab)}
                            >
                                {tab}
                                {tab === 'All Jobs' && jobs && (
                                    <span className="ml-2 bg-gradient-to-r from-[#143694]/10 to-[#1e4ed8]/10 text-[#143694] text-xs px-2 py-0.5 rounded-full">
                                        {jobs.length}
                                    </span>
                                )}
                                {activeTab === tab && (
                                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#143694] to-[#1e4ed8]"></div>
                                )}
                            </button>
                        ))}
                    </div> */}
                </div>

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
                                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#143694]"></div>
                                <p className="mt-4 text-gray-600">Loading drives...</p>
                            </div>
                        ) : currentJobs?.length === 0 ? (
                            <div className="p-12 text-center">
                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-gray-100 to-gray-200 mb-4">
                                    <FileText className="h-8 w-8 text-gray-400" />
                                </div>
                                <h3 className="text-lg font-medium text-gray-900 mb-2">No drives found</h3>
                                <p className="text-gray-600">No drives match your search criteria.</p>
                            </div>
                        ) : (
                            currentJobs?.map(job => (
                                <div key={job._id} className="p-4 hover:bg-gray-50/50 transition-all duration-200">
                                    <div className="grid grid-cols-12 gap-4 items-center">
                                        {/* Job Roles - col-span-3 */}
                                        <div className="col-span-3">
                                          <div 
                                            onClick={() => navigate(`/company-dashboard/Off-campus/${job._id}?isApplied=true`)}
                                            className="group cursor-pointer"
                                          >
                                            <h3 className="font-semibold text-gray-900 group-hover:text-[#143694] transition-colors">
                                              {Array.isArray(job?.jobRoles) 
                                                ? job.jobRoles.join(', ') 
                                                : job?.jobRoles || 'Untitled Job'
                                              }
                                            </h3>
                                            <div className="flex items-center gap-2 mt-1">
                                              <Briefcase className="h-3 w-3 text-gray-400" />
                                              <span className="text-sm text-gray-500 capitalize">
                                                {job?.workMode || 'N/A'}
                                              </span>
                                            </div>
                                          </div>
                                        </div>

                                        {/* Work Locations - col-span-3 */}
                                        <div className="col-span-2">
                                            <div className="flex items-center gap-2">
                                                <MapPin className="h-3 w-3 text-gray-400 flex-shrink-0" />
                                                <span className="text-gray-700 text-sm truncate capitalize">
                                                    {job?.location?.[0] || 'N/A'}
                                                    {job?.location?.length > 1 && ` +${job.location.length - 1} more`}
                                                </span>
                                            </div>
                                        </div>

                                        {/* End Date - col-span-2 */}
                                        <div className="col-span-2">
                                            <div className="flex items-center gap-2">
                                                <Calendar className="h-3 w-3 text-gray-400" />
                                                <span className="text-gray-700 text-sm">
                                                    {job?.endDate ? new Date(job?.endDate).toLocaleDateString() : 'N/A'}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Views - col-span-1 */}
                                        <div className="col-span-1 text-center">
                                            <span className="inline-flex items-center justify-center w-8 h-8 bg-gradient-to-r from-blue-100 to-blue-50 text-[#143694] rounded-full text-sm font-medium">
                                                {job?.views || 0}
                                            </span>
                                        </div>

                                        {/* Applications - col-span-1 */}
                                        <div 
                                            className="col-span-3 text-center cursor-pointer group"
                                            onClick={() => showNewApplication(job)}
                                        >
                                            <span className="inline-flex items-center justify-center w-8 h-8 bg-gradient-to-r from-orange-100 to-orange-50 text-orange-700 rounded-full text-sm font-medium group-hover:scale-110 transition-transform">
                                                {job?.applicationCount || 0}
                                            </span>
                                        </div>

                                        {/* Actions - col-span-2 */}
                                        <div className="col-span-1">
                                            <div className="flex items-center justify-center gap-2">
                                                <button
                                                    onClick={() => handleView(job)}
                                                    className="p-2 bg-gradient-to-r from-gray-100 to-white border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 hover:text-[#143694] hover:border-[#143694]/50 transition-all duration-200"
                                                    title="View Job Details"
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
                </div>
            </div>
        </div>
    );
}