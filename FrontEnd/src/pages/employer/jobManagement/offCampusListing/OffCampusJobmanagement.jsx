// import { useState, useEffect } from 'react';
// import {
//   Search, Eye, Edit, Users, FileText, Trash,
//   ChevronLeft, ChevronRight, Filter, X, Briefcase, Building2, Calendar, Users as UsersIcon, AlertCircle
// } from 'lucide-react';
// import ApplicantDetails from './OffCampusDetail';
// import { deleteJobById, getPostedJobs } from '@/lib/Company_AxiosInstance';

// export default function OffCampusJobManagement() {
//   // State variables
//   const [jobs, setJobs] = useState();
//   const [loading, setLoading] = useState(true);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [activeTab, setActiveTab] = useState('All Jobs');
//   const [showFilters, setShowFilters] = useState(false);
//   const [selectedJob, setSelectedJob] = useState(null);
//   const [showJobDetail, setShowJobDetail] = useState(false);

//   const itemsPerPage = 5;
//   const totalItems = jobs?.length;
//   const totalPages = Math.ceil(totalItems / itemsPerPage);
//   const startIndex = (currentPage - 1) * itemsPerPage;
//   const endIndex = Math.min(startIndex + itemsPerPage, totalItems);

//   const fetchJobs = async () => {
//     try {
//       const response = await getPostedJobs("Off-campus", "Applied");
//       setJobs(response?.data);
//     } catch (error) {
//       console.error("Error fetching jobs:", error);
//       setLoading(false);
//     }
//     setLoading(false);
//   };

//   useEffect(() => {
//     fetchJobs();
//   }, []);

//   // Filter jobs based on search query and active tab
//   const filteredJobs = jobs?.filter(job => {
//     const matchesSearch = job.jobRoles[0].toLowerCase().includes(searchQuery.toLowerCase()) ||
//       job.workMode.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       job.venue.toLowerCase().includes(searchQuery.toLowerCase());

//     if (activeTab === 'All Jobs') {
//       return matchesSearch;
//     } else if (activeTab === 'Published') {
//       return matchesSearch && job.status === 'Published';
//     } else if (activeTab === 'Drafts') {
//       return matchesSearch && job.status === 'Draft';
//     }

//     return matchesSearch;
//   });

//   // Current page data
//   const currentJobs = filteredJobs?.slice(startIndex, endIndex);

//   // Pagination controls
//   const handlePrevPage = () => {
//     setCurrentPage(prev => Math.max(prev - 1, 1));
//   };

//   const handleNextPage = () => {
//     setCurrentPage(prev => Math.min(prev + 1, totalPages));
//   };

//   const handlePageClick = (pageNumber) => {
//     setCurrentPage(pageNumber);
//   };

//   // Action handlers - these would connect to your backend API
//   const handleView = (jobId) => {
//     const job = jobs.find(j => j._id === jobId);
//     if (job) {
//       setSelectedJob(job);
//       setShowJobDetail(true);
//     }
//   };

//   const handleEdit = (jobId) => {
//     console.log(`Edit job with ID: ${jobId}`);
//     // In a real app: navigate to edit page or open edit modal
//   };

//   const handleApplications = (jobId) => {
//     console.log(`View applications for job ID: ${jobId}`);
//     // In a real app: navigate to applications page
//   };

//   const handleExport = (jobId) => {
//     console.log(`Export job with ID: ${jobId}`);
//     // In a real app: trigger API call to export job data
//   };

//   const handleDelete = async (jobId) => {
//     try {
//       const confirmed = window.confirm("This action can't be undone! Are you sure you want to delete the job?");
//       if (confirmed) {
//         const response = await deleteJobById(jobId);
//         fetchJobs();
//         alert(`Job with Id: ${jobId} deleted`);
//       }
//     } catch (error) {
//       console.log("Error: ", error);
//     }
//   };

  
//   const handleAcceptDrive = (jobId) => {
//     console.log(`Accept drive for job ID: ${jobId}`);
    
//     setShowJobDetail(false);
//   };

//   const handleShortlistDrive = (jobId) => {
//     console.log(`Shortlist drive for job ID: ${jobId}`);
//     // In a real app: call API to update status
//     setShowJobDetail(false);
//   };

//   const handleRejectDrive = (jobId) => {
//     console.log(`Reject drive for job ID: ${jobId}`);
   
//     setShowJobDetail(false);
//   };

  
//   if (showJobDetail && selectedJob) {
//     return (
//       <ApplicantDetails
//         job={selectedJob}
//         onClose={() => setShowJobDetail(false)}
//         onAccept={() => handleAcceptDrive(selectedJob._id)}
//         onShortlist={() => handleShortlistDrive(selectedJob._id)}
//         onReject={() => handleRejectDrive(selectedJob._id)}
//       />
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-[#143694]/10 via-[#f093fb]/5 to-[#1e4ed8]/10">
//       <div className="container mx-auto px-4 py-8 pt-22">
//         {/* Header Section */}
//         <div className="bg-white/90 backdrop-blur-sm border border-gray-100 rounded-2xl shadow-lg p-6 mb-6">
//           <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
//             <div className="mb-4 md:mb-0">
//               <div className="flex items-center mb-2">
//                 <div className="p-2 bg-gradient-to-br from-[#143694]/20 to-[#1e4ed8]/20 rounded-lg mr-3">
//                   <Building2 className="h-5 w-5 text-[#143694]" />
//                 </div>
//                 <h1 className="text-2xl font-bold bg-gradient-to-r from-[#143694] to-[#1e4ed8] bg-clip-text text-transparent">
//                   Manage Off-Campus Applications
//                 </h1>
//               </div>
//               <p className="text-gray-600">
//                 Track Your Job Listings and Streamline Candidate Applications
//               </p>
//             </div>
//           </div>

//           {/* Tabs */}
//           <div className="flex gap-1 mt-6 bg-gradient-to-r from-gray-50 to-white p-1 rounded-xl border border-gray-200">
//             <button
//               className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${activeTab === 'All Jobs' 
//                 ? 'bg-gradient-to-r from-[#143694] to-[#1e4ed8] text-white shadow-lg shadow-[#143694]/30' 
//                 : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
//               }`}
//               onClick={() => setActiveTab('All Jobs')}
//             >
//               All Jobs ({jobs?.length || 0})
//             </button>
//             <button
//               className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${activeTab === 'Published' 
//                 ? 'bg-gradient-to-r from-[#143694] to-[#1e4ed8] text-white shadow-lg shadow-[#143694]/30' 
//                 : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
//               }`}
//               onClick={() => setActiveTab('Published')}
//             >
//               Published
//             </button>
//             <button
//               className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${activeTab === 'Drafts' 
//                 ? 'bg-gradient-to-r from-[#143694] to-[#1e4ed8] text-white shadow-lg shadow-[#143694]/30' 
//                 : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
//               }`}
//               onClick={() => setActiveTab('Drafts')}
//             >
//               Drafts
//             </button>
//           </div>
//         </div>

//         {/* Search and Filters */}
//         <div className="bg-white/90 backdrop-blur-sm border border-gray-100 rounded-2xl shadow-lg p-6 mb-6">
//           <div className="flex flex-col md:flex-row items-center gap-4">
//             <div className="relative flex-grow">
//               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                 <Search className="h-4 w-4 text-gray-400" />
//               </div>
//               <input
//                 type="text"
//                 className="w-full pl-10 pr-4 py-2.5 bg-gradient-to-r from-gray-50 to-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#143694]/50 focus:border-transparent focus:outline-none transition-all duration-200"
//                 placeholder="Search by name or email"
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//               />
//             </div>

//             <button
//               className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all duration-200 ${showFilters 
//                 ? 'bg-gradient-to-r from-[#143694] to-[#1e4ed8] text-white shadow-lg shadow-[#143694]/30' 
//                 : 'bg-gradient-to-r from-gray-100 to-white border border-gray-200 text-gray-700 hover:bg-gray-50'
//               }`}
//               onClick={() => setShowFilters(!showFilters)}
//             >
//               <Filter className="h-4 w-4" />
//               Filters
//             </button>

//             <div className="text-sm text-gray-500">
//               Showing {startIndex + 1}-{Math.min(endIndex, filteredJobs?.length)} of {filteredJobs?.length}
//             </div>
//           </div>

//           {/* Filters Panel */}
//           {showFilters && (
//             <div className="mt-4 p-4 bg-gradient-to-r from-gray-50 to-white border border-gray-200 rounded-xl">
//               <div className="flex items-center justify-between mb-4">
//                 <h3 className="text-sm font-medium text-gray-900">Filters</h3>
//                 <button
//                   onClick={() => setShowFilters(false)}
//                   className="text-gray-500 hover:text-gray-700"
//                 >
//                   <X className="h-4 w-4" />
//                 </button>
//               </div>
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                 {/* Add filter options here if needed */}
//                 <div className="text-sm text-gray-500 text-center p-4">
//                   Filter options will appear here
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Jobs Table */}
//         <div className="bg-white/90 backdrop-blur-sm border border-gray-100 rounded-2xl shadow-lg overflow-hidden">
//           {/* Table Header */}
//           <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
//             <div className="grid grid-cols-12 gap-4 text-xs font-medium text-gray-700 uppercase tracking-wider">
//               <div className="col-span-4">Job Title</div>
//               <div className="col-span-2">Status</div>
//               <div className="col-span-2">Deadline</div>
//               <div className="col-span-2 text-center">Applications</div>
//               <div className="col-span-2 text-center">Actions</div>
//             </div>
//           </div>

//           {/* Table Body */}
//           <div className="divide-y divide-gray-100">
//             {loading ? (
//               <div className="p-12 text-center">
//                 <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#143694]"></div>
//                 <p className="mt-4 text-gray-600">Loading jobs...</p>
//               </div>
//             ) : currentJobs?.length === 0 ? (
//               <div className="p-12 text-center">
//                 <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-gray-100 to-gray-200 mb-4">
//                   <Search className="h-8 w-8 text-gray-400" />
//                 </div>
//                 <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs found</h3>
//                 <p className="text-gray-600">No jobs match your search criteria.</p>
//               </div>
//             ) : (
//               currentJobs?.map(job => (
//                 <div 
//                   key={job._id} 
//                   className="p-4 hover:bg-gray-50/50 transition-all duration-200 cursor-pointer group"
//                   onClick={() => handleView(job._id)}
//                 >
//                   <div className="grid grid-cols-12 gap-4 items-center">
//                     {/* Job Title */}
//                     <div className="col-span-4">
//                       <h3 className="font-semibold text-gray-900 group-hover:text-[#143694] transition-colors">
//                         {job?.jobRoles[0]}
//                       </h3>
//                       <div className="flex items-center gap-2 mt-1">
//                         <Briefcase className="h-3 w-3 text-gray-400" />
//                         <span className="text-sm text-gray-500">
//                           {job?.workMode} • {job?.location[0]}
//                         </span>
//                       </div>
//                     </div>

//                     {/* Status */}
//                     <div className="col-span-2">
//                       <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
//                         job?.status === 'Published'
//                           ? 'bg-gradient-to-r from-green-100 to-green-50 text-green-700'
//                           : 'bg-gradient-to-r from-gray-100 to-gray-50 text-gray-700'
//                       }`}>
//                         {job?.status}
//                       </span>
//                     </div>

//                     {/* Deadline */}
//                     <div className="col-span-2">
//                       <div className="flex items-center gap-2">
//                         <Calendar className="h-3 w-3 text-gray-400" />
//                         <span className="text-gray-700 text-sm">
//                           {new Date(job?.endDate).toUTCString().slice(0, 16)}
//                         </span>
//                       </div>
//                     </div>

//                     {/* Applications Count */}
//                     <div className="col-span-2 text-center">
//                       <span className="inline-flex items-center justify-center w-8 h-8 bg-gradient-to-r from-blue-100 to-blue-50 text-[#143694] rounded-full text-sm font-medium">
//                         {job?.applicationCount || 0}
//                       </span>
//                     </div>

//                     {/* Actions */}
//                     <div className="col-span-2" onClick={(e) => e.stopPropagation()}>
//                       <div className="flex items-center justify-center gap-2">
//                         <button 
//                           onClick={() => handleView(job._id)}
//                           className="p-2 bg-gradient-to-r from-gray-100 to-white border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 hover:text-[#143694] hover:border-[#143694]/50 transition-all duration-200"
//                           title="View Job"
//                         >
//                           <Eye size={16} />
//                         </button>
//                         <button 
//                           onClick={() => handleDelete(job._id)}
//                           className="p-2 bg-gradient-to-r from-red-100 to-red-50 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 hover:text-red-700 hover:border-red-300 transition-all duration-200"
//                           title="Delete Job"
//                         >
//                           <Trash size={16} />
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               ))
//             )}
//           </div>

//           {/* Pagination */}
//           {totalPages > 1 && (
//             <div className="flex items-center justify-between p-4 border-t border-gray-100 bg-gradient-to-r from-gray-50 to-white">
//               <button
//                 onClick={handlePrevPage}
//                 disabled={currentPage === 1}
//                 className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-gray-100 to-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
//               >
//                 <ChevronLeft size={16} />
//                 Prev
//               </button>

//               <div className="flex gap-2">
//                 {Array.from({ length: totalPages }, (_, i) => i + 1)?.map(page => (
//                   <button
//                     key={page}
//                     onClick={() => handlePageClick(page)}
//                     className={`w-10 h-10 flex items-center justify-center rounded-xl text-sm font-medium transition-all duration-200 ${
//                       currentPage === page 
//                         ? 'bg-gradient-to-r from-[#143694] to-[#1e4ed8] text-white shadow-lg shadow-[#143694]/30' 
//                         : 'bg-gradient-to-r from-gray-100 to-white border border-gray-200 text-gray-700 hover:bg-gray-50'
//                     }`}
//                   >
//                     {page}
//                   </button>
//                 ))}
//               </div>

//               <button
//                 onClick={handleNextPage}
//                 disabled={currentPage === totalPages}
//                 className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-gray-100 to-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
//               >
//                 Next
//                 <ChevronRight size={16} />
//               </button>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }



import { useState, useEffect } from 'react';
import { Search, Eye, Trash, Building2, MapPin, Calendar, Users, FileText, AlertCircle, ChevronLeft, ChevronRight, Briefcase } from 'lucide-react';
import ApplicantDetails from './OffCampusDetail';
import { Link, useNavigate } from 'react-router-dom';
import { deleteJobById, getPostedJobs } from '@/lib/Company_AxiosInstance';
import toast from 'react-hot-toast';

export default function OffCampusJobManagement() {
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
      const response = await getPostedJobs("Off-campus", "Applied");
      setJobs(response?.data || []);
    } catch (err) {
      console.error("Error fetching jobs:", err);
      setError(err.response?.data?.message || err.message || "Failed to fetch jobs.");
      setJobs([]);
    } finally {
      setLoading(false);
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

  const filteredJobs = jobs?.filter(job => {
    const searchLower = searchQuery.toLowerCase();
    
    const jobRolesMatch = Array.isArray(job.jobRoles) 
      ? job.jobRoles.some(role => role?.toLowerCase().includes(searchLower))
      : job.jobRoles?.[0]?.toLowerCase().includes(searchLower);
    
    const locationMatch = Array.isArray(job.location)
      ? job.location.some(loc => loc?.toLowerCase().includes(searchLower))
      : job.location?.[0]?.toLowerCase().includes(searchLower);

    return (
      jobRolesMatch || 
      locationMatch || 
      job.workMode?.toLowerCase().includes(searchLower) ||
      job._id?.toLowerCase().includes(searchLower)
    );
  });

  const totalItems = filteredJobs?.length || 0;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const currentJobs = filteredJobs?.slice(startIndex, endIndex);

  const handleViewApplicants = (job) => {
    if (job?.applicationCount === 0) {
      alert("No applicants have applied for this job yet.");
      return;
    }
    setSelectedJob(job);
    setShowJobDetail(true);
  };

  const handleViewJob = (job) => {
    // This is for the Eye icon - always try to show details even if applicationCount is 0
    setSelectedJob(job);
    setShowJobDetail(true);
  };

  const handleCloseDetail = () => {
    setShowJobDetail(false);
    setSelectedJob(null);
    fetchJobs(); // Refresh the job list when closing details
  };

  const displayLocations = (locations) => {
    if (!locations || locations.length === 0) return 'N/A';
    return Array.isArray(locations) ? locations.join(', ') : String(locations);
  };

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

  if (showJobDetail && selectedJob) {
    return (
      <ApplicantDetails
        job={selectedJob}
        onClose={handleCloseDetail}
        onUpdate={fetchJobs}
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
                  Manage Off-Campus Jobs
                </h1>
              </div>
              <p className="text-gray-600">
                Track Your Job Listings and Applicant Applications
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
                {/* Active */}
                <button 
                  className="px-6 py-2 bg-[#143694] text-white rounded-full font-medium text-sm shadow-sm"
                >
                  Off-Campus
                </button>

                <button 
                  onClick={() => navigate('/employer/job-management/Internship')}
                  className="px-2 py-2 text-gray-500 hover:text-[#143694] font-medium text-sm transition-all"
                >
                  Internship
                </button>

              </div>
            </div>
            
            {/* Search Bar */}
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
                    {/* Job Title */}
                    <div className="col-span-3">
                      <div 
                        onClick={() => navigate(`/company-dashboard/Off-campus/${job._id}?isApplied=true`)}
                        className="group cursor-pointer"
                      >
                        <h3 className="font-semibold text-gray-900 group-hover:text-[#143694] transition-colors">
                          {Array.isArray(job?.jobRoles) 
                            ? job.jobRoles.join(', ') 
                            : job?.jobRoles || 'N/A'
                          }
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <Briefcase className="h-3 w-3 text-gray-400" />
                          <span className="text-sm text-gray-500">{job?.workMode}</span>
                          <span className="text-gray-300">•</span>
                          <MapPin className="h-3 w-3 text-gray-400" />
                          <span className="text-sm text-gray-500 capitalize">{displayLocations(job.location)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Deadline */}
                    <div className="col-span-2">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-3 w-3 text-gray-400" />
                        <span className="text-gray-700 text-sm">
                          {new Date(job.endDate).toUTCString().slice(0, 16)}
                        </span>
                      </div>
                    </div>

                    {/* Views */}
                    <div className="col-span-2 text-center">
                      <span className="inline-flex items-center justify-center w-8 h-8 bg-gradient-to-r from-blue-100 to-blue-50 text-[#143694] rounded-full text-sm font-medium">
                        {job.views || 0}
                      </span>
                    </div>

                    {/* New Applications - Clickable count */}
                    <div 
                      className="col-span-3 text-center cursor-pointer group"
                      onClick={() => handleViewApplicants(job)}
                      title="View applications"
                    >
                      <span className="inline-flex items-center justify-center w-8 h-8 bg-gradient-to-r from-green-100 to-green-50 text-green-700 rounded-full text-sm font-medium group-hover:scale-110 transition-transform">
                        {job?.applicationCount || 0}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="col-span-2">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleViewJob(job)}
                          className="p-2 bg-gradient-to-r from-gray-100 to-white border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 hover:text-[#143694] hover:border-[#143694]/50 transition-all duration-200"
                          title="View job details"
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