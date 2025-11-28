// import { useState, useEffect } from 'react';
// import { Search, Eye, ChevronLeft, ChevronRight, Trash } from 'lucide-react';
// import CollegeRequestDetail from './acceptedDetailPage';
// import { acceptCandidate, deleteJobById, getCollegeApplicationsForJob, getPostedJobs, rejectCandidate, shortlistCandidate } from '@/lib/Company_AxiosInstance';
// import toast from 'react-hot-toast';
// import { Link, useNavigate } from 'react-router-dom';

// export default function OnCampusJobManagement() {
//   const [jobs, setJobs] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [selectedJob, setSelectedJob] = useState(null);
//   const [colleges, setColleges] = useState([]);
//   const [collegesLoading, setCollegesLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const navigate = useNavigate();

//   const itemsPerPage = 10;

//   const fetchJobs = async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const response = await getPostedJobs("On-campus", "Accepted");
//       console.log("Fetched jobs:", response?.data);
//       setJobs(response?.data || []);
//     } catch (err) {
//       console.error("Error fetching jobs:", err);
//       setError(err.response?.data?.message || err.message || "Failed to fetch drives.");
//       setJobs([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchCollegesForJob = async (jobId, jobType) => {
//     setCollegesLoading(true);
//     setError(null);
//     try {
//       const response = await getCollegeApplicationsForJob(jobId, jobType, "Accepted");
//       console.log("Fetched colleges for job:", response.data);
//       setColleges(response.data || []);
//     } catch (err) {
//       console.error("Error fetching colleges:", err);
//       setError(err.response?.data?.message || err.message || "Failed to fetch colleges.");
//       setColleges([]);
//     } finally {
//       setCollegesLoading(false);
//     }
//   };

//   const handleUpdateApplicationStatus = async (applicationId, status) => {
//     try {
//       let response;
//       switch (status) {
//         case "Shortlisted":
//           response = await shortlistCandidate(applicationId, selectedJob?.jobRoles);
//           break;
//         case "Rejected":
//           response = await rejectCandidate(applicationId, selectedJob?.jobRoles);
//           break;
//         case "Accepted":
//           response = await acceptCandidate(applicationId, selectedJob?.jobRoles);
//           break;
//         default:
//           alert("Invalid Action!");
//       }
//       if (response?.data?.success === true) {
//         toast.success(`Application status updated to: ${status}`);
//         // Refresh the colleges list after status update
//         if (selectedJob) {
//           fetchCollegesForJob(selectedJob._id, selectedJob.jobType);
//         }
//       } else {
//         toast.error(response?.response?.data?.msg || 'Failed to update status');
//       }
//     } catch (err) {
//       console.error("Error updating application status:", err);
//       setError(err.response?.data?.message || err.message || "Failed to update status.");
//       toast.error('Something went wrong!');
//     }
//   };

//   const handleDelete = async (jobId) => {
//     try {
//       const confirmed = window.confirm("This action can't be undone! Are you sure you want to delete the job?");
//       if (confirmed) {
//         await deleteJobById(jobId);
//         fetchJobs();
//         toast.success(`Job deleted successfully`);
//       }
//     } catch (error) {
//       console.log("Error: ", error);
//       toast.error('Failed to delete job');
//     }
//   };

//   useEffect(() => {
//     fetchJobs();
//   }, []);

//   const filteredJobs = jobs.filter(job => {
//     const searchLower = searchQuery.toLowerCase();

//     // Check job roles
//     const jobRolesMatch = Array.isArray(job.jobRoles)
//       ? job.jobRoles.some(role => role?.toLowerCase().includes(searchLower))
//       : false;

//     // Check locations - handle both workLocation and location fields
//     const locations = job.workLocation || job.location || [];
//     const locationsMatch = Array.isArray(locations)
//       ? locations.some(location => location?.toLowerCase().includes(searchLower))
//       : false;

//     return (
//       jobRolesMatch ||
//       locationsMatch ||
//       (job._id?.toLowerCase().includes(searchLower)) ||
//       (job.lookingFor?.toLowerCase().includes(searchLower))
//     );
//   });

//   const totalItems = filteredJobs.length;
//   const totalPages = Math.ceil(totalItems / itemsPerPage);
//   const startIndex = (currentPage - 1) * itemsPerPage;
//   const currentJobs = filteredJobs.slice(startIndex, startIndex + itemsPerPage);

//   const handleViewColleges = (job) => {
//     if (job.applicationCount === 0) {
//       alert("No colleges have applied for this drive yet.");
//       return;
//     }
//     setSelectedJob(job);
//     fetchCollegesForJob(job._id, job.jobType);
//   };

//   const handleBackToList = () => {
//     setSelectedJob(null);
//     setColleges([]);
//   };

//   const displayLocations = (job) => {
//     // Prioritize workLocation over location
//     const locations = job.workLocation || job.location || [];
//     if (!locations || locations.length === 0) return 'N/A';
//     return Array.isArray(locations) ? locations.join(', ') : String(locations);
//   };

//   const displayJobRoles = (job) => {
//     const jobRoles = job.jobRoles || [];
//     if (!jobRoles || jobRoles.length === 0) return 'N/A';
//     return Array.isArray(jobRoles) ? jobRoles.join(', ') : String(jobRoles);
//   };

//   if (selectedJob) {
//     return (
//       <div className="min-h-screen bg-gray-50 font-sans">
//         <div className="max-w-4xl mx-auto p-4">
//           <button
//             onClick={handleBackToList}
//             className="flex items-center text-gray-600 hover:text-black mb-6"
//           >
//             <ChevronLeft size={20} className="mr-1" />
//             Back to drives
//           </button>

//           {collegesLoading ? (
//             <div className="p-8 text-center bg-white rounded-lg shadow-sm">
//               <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-black border-r-transparent"></div>
//               <p className="mt-4 text-gray-600">Loading college applications...</p>
//             </div>
//           ) : error ? (
//             <div className="p-4 text-red-700 bg-red-100 border border-red-200 rounded-md">
//               Error: {error}
//             </div>
//           ) : colleges.length === 0 ? (
//             <div className="p-8 text-center text-gray-500 bg-white rounded-lg shadow-sm">
//               No colleges have applied for this drive yet.
//             </div>
//           ) : (
//             <div className="space-y-6">
//               {colleges.map(college => (
//                 <CollegeRequestDetail
//                   key={college._id}
//                   collegeApplication={college}
//                   driveDetails={selectedJob} // Pass drive details separately
//                   onAccept={() => handleUpdateApplicationStatus(college._id, 'Accepted')}
//                   onShortlist={() => handleUpdateApplicationStatus(college._id, 'Shortlisted')}
//                   onReject={() => handleUpdateApplicationStatus(college._id, 'Rejected')}
//                 />
//               ))}
//             </div>
//           )}
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-white font-sans">
//       <div className="max-w-7xl mx-auto p-4 bg-white">
//         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-10 mb-4 gap-4">
//           <div>
//             <h1 className="text-3xl font-bold text-gray-900">Accepted On-Campus Drives</h1>
//             <p className="text-gray-600 mt-2">Track Your Accepted On-Campus Drives and College Applications</p>
//           </div>
//         </div>

//         <div className="border border-gray-200 rounded-lg mt-10 overflow-hidden">
//           <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row items-center gap-4">
//             <div className="relative flex-grow w-full sm:max-w-sm">
//               <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
//                 <Search className="w-4 h-4 text-gray-500" />
//               </div>
//               <input
//                 type="text"
//                 className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
//                 placeholder="Search by job role or location"
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//               />
//             </div>
//           </div>

//           {error && (
//             <div className="p-4 text-red-700 bg-red-100 border border-red-200 rounded-md m-4">
//               Error: {error}
//             </div>
//           )}

//           <div className="overflow-x-auto">
//             <table className="w-full text-left text-gray-700">
//               <thead className="bg-gray-50 text-xs uppercase text-gray-700">
//                 <tr className="border-b border-gray-200">
//                   <th className="px-4 py-3">Job Roles</th>
//                   <th className="px-4 py-3">Work Locations</th>
//                   <th className="px-4 py-3">End Date</th>
//                   <th className="px-4 py-3">Views</th>
//                   <th className="px-4 py-3">Applications</th>
//                   <th className="px-4 py-3">Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {loading ? (
//                   <tr>
//                     <td colSpan="5" className="text-center py-8">
//                       <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-black border-r-transparent"></div>
//                       <p className="mt-4 text-gray-600">Loading drives...</p>
//                     </td>
//                   </tr>
//                 ) : currentJobs.length === 0 ? (
//                   <tr>
//                     <td colSpan="5" className="text-center py-8 text-gray-500">
//                       No drives found matching your criteria.
//                     </td>
//                   </tr>
//                 ) : (
//                   currentJobs.map(job => (
//                     <tr key={job._id} className="border-b border-gray-200 hover:bg-gray-50">
//                       <td className="px-4 py-4" onClick={() => navigate(`/company-dashboard/preview/On-campus/${job._id}?isApplied=true`)}>
//                         <div className="font-medium text-gray-900">
//                           {displayJobRoles(job)}
//                         </div>
//                         <div className="text-sm text-gray-500">
//                           {Array.isArray(job.employmentType) ? job.employmentType.join(', ') : job.employmentType || 'N/A Type'}
//                         </div>
//                       </td>
//                       <td className="px-4 py-4 capitalize">
//                         {displayLocations(job)}
//                       </td>
//                       <td className="px-4 py-4">
//                         {job.endDate ? new Date(job.endDate).toLocaleDateString() : 'N/A'}
//                       </td>
//                       <td className="px-4 py-4">{job?.views || 0}</td>
//                       <td className="px-4 py-4">{job.applicationCount || 0}</td>
//                       <td className="px-4 py-4">
//                         <div className="flex gap-2">
//                           <button
//                             onClick={() => handleViewColleges(job)}
//                             disabled={!job.applicationCount || job.applicationCount === 0}
//                             className="text-gray-500 hover:text-blue-600 p-1 rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
//                             title="View College Applications"
//                           >
//                             <Eye size={18} />
//                           </button>
//                           <button
//                             onClick={() => handleDelete(job._id)}
//                             className="text-gray-500 hover:text-red-600 p-1 rounded-md hover:bg-gray-200"
//                             title="Delete Job"
//                           >
//                             <Trash size={18} />
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   ))
//                 )}
//               </tbody>
//             </table>
//           </div>

//           <div className="flex items-center justify-between p-4 bg-gray-50 border-t border-gray-200">
//             <button
//               onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
//               disabled={currentPage === 1}
//               className="flex items-center gap-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 disabled:opacity-50"
//             >
//               <ChevronLeft size={16} />
//               Prev
//             </button>

//             <div className="flex gap-2">
//               {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
//                 <button
//                   key={page}
//                   onClick={() => setCurrentPage(page)}
//                   className={`w-8 h-8 flex items-center justify-center rounded-md text-sm font-medium ${currentPage === page ? 'bg-black text-white' : 'border border-gray-300 text-gray-700 hover:bg-gray-100'
//                     }`}
//                 >
//                   {page}
//                 </button>
//               ))}
//             </div>

//             <button
//               onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
//               disabled={currentPage === totalPages || totalPages === 0}
//               className="flex items-center gap-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 disabled:opacity-50"
//             >
//               Next
//               <ChevronRight size={16} />
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }



// import React, { useState, useEffect, useMemo } from 'react';
// import { Search, Eye, ChevronLeft, ChevronRight, Trash, Filter } from 'lucide-react';
// import CollegeRequestDetail from './acceptedDetailPage';
// import { acceptCandidate, deleteJobById, getCollegeApplicationsForJob, getPostedJobs, rejectCandidate, shortlistCandidate } from '@/lib/Company_AxiosInstance';
// import toast from 'react-hot-toast';
// import { useNavigate } from 'react-router-dom';

// export default function OnCampusJobManagement() {
//   const [jobs, setJobs] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [selectedJob, setSelectedJob] = useState(null);
//   const [colleges, setColleges] = useState([]);
//   const [collegesLoading, setCollegesLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [activeTab, setActiveTab] = useState('All Drives');
//   const [showFilters, setShowFilters] = useState(false);
//   const navigate = useNavigate();

//   const itemsPerPage = 5;

//   // Helper functions defined at the top to avoid reference errors
//   const displayDegree = (job) => {
//     const degree = job.degree || [];
//     if (!degree || degree.length === 0) return 'N/A';
//     return Array.isArray(degree) ? degree.join(', ') : String(degree);
//   };

//   // Function to determine job status based on dates
//   const getJobStatus = (job) => {
//     const currentDate = new Date();
//     const startDate = new Date(job.startDate);
//     const endDate = new Date(job.endDate);

//     if (currentDate < startDate) {
//       return 'Pending';
//     } else if (currentDate >= startDate && currentDate <= endDate) {
//       return 'Open';
//     } else {
//       return 'Closed';
//     }
//   };

//   // Process jobs to update their status based on dates
//   const processJobsWithStatus = (jobsData) => {
//     return jobsData.map(job => {
//       // Only update status if the job has both start and end dates
//       if (job.startDate && job.endDate) {
//         return {
//           ...job,
//           jobStatus: getJobStatus(job)
//         };
//       }
//       return job;
//     });
//   };

//   // Utility function to format dates
//   const formatDate = (dateString) => {
//     if (!dateString) return 'N/A';
//     try {
//       return new Date(dateString).toLocaleDateString('en-US', {
//         year: 'numeric', month: 'short', day: 'numeric'
//       });
//     } catch (error) {
//       console.error("Error formatting date:", error);
//       return 'Invalid Date';
//     }
//   };

//   const fetchJobs = async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const response = await getPostedJobs("On-campus", "Accepted");
//       console.log("Fetched jobs:", response?.data);
      
//       if (response.data && Array.isArray(response.data)) {
//         // Process jobs to update their status based on dates
//         const processedJobs = processJobsWithStatus(response.data);
//         setJobs(processedJobs);
//       } else {
//         console.error('Unexpected API response format:', response);
//         setJobs([]);
//       }
//     } catch (err) {
//       setError("Failed to fetch jobs. Please try again later.");
//       console.error("Error fetching jobs:", err);
//       setJobs([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchCollegesForJob = async (jobId, jobType) => {
//     setCollegesLoading(true);
//     setError(null);
//     try {
//       const response = await getCollegeApplicationsForJob(jobId, jobType, "Accepted");
//       console.log("Fetched colleges for job:", response.data);
//       setColleges(response.data || []);
//     } catch (err) {
//       console.error("Error fetching colleges:", err);
//       setError(err.response?.data?.message || err.message || "Failed to fetch colleges.");
//       setColleges([]);
//     } finally {
//       setCollegesLoading(false);
//     }
//   };

//   const handleUpdateApplicationStatus = async (applicationId, status) => {
//     try {
//       let response;
//       switch (status) {
//         case "Shortlisted":
//           response = await shortlistCandidate(applicationId, selectedJob?.jobRoles);
//           break;
//         case "Rejected":
//           response = await rejectCandidate(applicationId, selectedJob?.jobRoles);
//           break;
//         case "Accepted":
//           response = await acceptCandidate(applicationId, selectedJob?.jobRoles);
//           break;
//         default:
//           alert("Invalid Action!");
//       }
//       if (response?.data?.success === true) {
//         toast.success(`Application status updated to: ${status}`);
//         // Refresh the colleges list after status update
//         if (selectedJob) {
//           fetchCollegesForJob(selectedJob._id, selectedJob.jobType);
//         }
//       } else {
//         toast.error(response?.response?.data?.msg || 'Failed to update status');
//       }
//     } catch (err) {
//       console.error("Error updating application status:", err);
//       setError(err.response?.data?.message || err.message || "Failed to update status.");
//       toast.error('Something went wrong!');
//     }
//   };

//   const handleDelete = async (jobId) => {
//     try {
//       const confirmed = window.confirm("This action can't be undone! Are you sure you want to delete the job?");
//       if (confirmed) {
//         await deleteJobById(jobId);
//         fetchJobs();
//         toast.success(`Job deleted successfully`);
//       }
//     } catch (error) {
//       console.log("Error: ", error);
//       toast.error('Failed to delete job');
//     }
//   };

//   useEffect(() => {
//     fetchJobs();
//   }, []);

//   // Set up interval to check and update job statuses periodically
//   useEffect(() => {
//     const intervalId = setInterval(() => {
//       setJobs(prevJobs => processJobsWithStatus(prevJobs));
//     }, 60000); // Check every minute

//     return () => clearInterval(intervalId);
//   }, []);

//   // Memoized filtering logic
//   const filteredJobs = useMemo(() => {
//     if (!jobs || !Array.isArray(jobs)) return [];

//     return jobs.filter(job => {
//       const degree = displayDegree(job);
//       const jobTitle = job.jobTitle || '';

//       // Comprehensive search across degree and job title
//       const matchesSearch =
//         degree.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         jobTitle.toLowerCase().includes(searchQuery.toLowerCase());

//       const status = job.jobStatus || '';

//       // Filter based on the active tab
//       if (activeTab === 'All Drives') {
//         return matchesSearch;
//       } else if (activeTab === 'Open') {
//         return matchesSearch && status === 'Open';
//       } else if (activeTab === 'Pending') {
//         return matchesSearch && status === 'Pending';
//       } else if (activeTab === 'Closed') {
//         return matchesSearch && status === 'Closed';
//       }
//       return matchesSearch;
//     });
//   }, [jobs, searchQuery, activeTab]);

//   // Memoized counts for each status tab
//   const openJobsCount = useMemo(() => jobs.filter(job => job.jobStatus === 'Open').length, [jobs]);
//   const pendingJobsCount = useMemo(() => jobs.filter(job => job.jobStatus === 'Pending').length, [jobs]);
//   const closedJobsCount = useMemo(() => jobs.filter(job => job.jobStatus === 'Closed').length, [jobs]);

//   // Pagination calculations
//   const totalItems = filteredJobs.length;
//   const totalPages = Math.ceil(totalItems / itemsPerPage);
//   const startIndex = (currentPage - 1) * itemsPerPage;
//   const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
//   const currentJobs = filteredJobs.slice(startIndex, endIndex);

//   // Pagination handlers
//   const handlePrevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));
//   const handleNextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
//   const handlePageClick = (pageNumber) => setCurrentPage(pageNumber);

//   const handleViewColleges = (job) => {
//     if (job.applicationCount === 0) {
//       alert("No colleges have applied for this drive yet.");
//       return;
//     }
//     setSelectedJob(job);
//     fetchCollegesForJob(job._id, job.jobType);
//   };

//   const handleBackToList = () => {
//     setSelectedJob(null);
//     setColleges([]);
//   };

//   if (selectedJob) {
//     return (
//       <div className="min-h-screen bg-gray-50 font-sans">
//         <div className="max-w-4xl mx-auto p-4">
//           <button
//             onClick={handleBackToList}
//             className="flex items-center text-gray-600 hover:text-black mb-6"
//           >
//             <ChevronLeft size={20} className="mr-1" />
//             Back to drives
//           </button>

//           {collegesLoading ? (
//             <div className="p-8 text-center bg-white rounded-lg shadow-sm">
//               <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-black border-r-transparent"></div>
//               <p className="mt-4 text-gray-600">Loading college applications...</p>
//             </div>
//           ) : error ? (
//             <div className="p-4 text-red-700 bg-red-100 border border-red-200 rounded-md">
//               Error: {error}
//             </div>
//           ) : colleges.length === 0 ? (
//             <div className="p-8 text-center text-gray-500 bg-white rounded-lg shadow-sm">
//               No colleges have applied for this drive yet.
//             </div>
//           ) : (
//             <div className="space-y-6">
//               {colleges.map(college => (
//                 <CollegeRequestDetail
//                   key={college._id}
//                   collegeApplication={college}
//                   driveDetails={selectedJob}
//                   onAccept={() => handleUpdateApplicationStatus(college._id, 'Accepted')}
//                   onShortlist={() => handleUpdateApplicationStatus(college._id, 'Shortlisted')}
//                   onReject={() => handleUpdateApplicationStatus(college._id, 'Rejected')}
//                 />
//               ))}
//             </div>
//           )}
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-white font-sans">
//       <div className="max-w-7xl mx-auto p-4 bg-white">
//         <div className="flex justify-between items-center mt-10 mb-4">
//           <div>
//             <h1 className="text-3xl font-bold text-gray-900">Accepted On-Campus Drives</h1>
//             <p className="text-gray-600 mt-2">Track Your Accepted On-Campus Drives</p>
//           </div>
//         </div>

//         <div className="border rounded-md mt-10">
//           {/* Tabs */}
//           <div className="flex border-b">
//             <button
//               className={`px-4 py-2 ${activeTab === 'All Drives' ? 'border-b-2 border-black font-medium' : ''}`}
//               onClick={() => setActiveTab('All Drives')}
//             >
//               All Drives ({jobs.length || 0})
//             </button>
//             <button
//               className={`px-4 py-2 ${activeTab === 'Open' ? 'border-b-2 border-black font-medium' : ''}`}
//               onClick={() => setActiveTab('Open')}
//             >
//               Open ({openJobsCount})
//             </button>
//             <button
//               className={`px-4 py-2 ${activeTab === 'Pending' ? 'border-b-2 border-black font-medium' : ''}`}
//               onClick={() => setActiveTab('Pending')}
//             >
//               Pending ({pendingJobsCount})
//             </button>
//             <button
//               className={`px-4 py-2 ${activeTab === 'Closed' ? 'border-b-2 border-black font-medium' : ''}`}
//               onClick={() => setActiveTab('Closed')}
//             >
//               Closed ({closedJobsCount})
//             </button>
//           </div>

//           {/* Search and filters */}
//           <div className="p-4 border-b flex flex-wrap items-center gap-2">
//             <div className="relative flex-grow max-w-sm">
//               <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
//                 <Search className="w-4 h-4 text-gray-500" />
//               </div>
//               <input
//                 type="text"
//                 className="w-full pl-10 pr-4 py-2 border rounded-md"
//                 placeholder="Search by degree or job title..."
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//               />
//             </div>
//             <button
//               className="flex items-center gap-2 px-4 py-2 border rounded-md hover:bg-gray-50 transition-colors"
//               onClick={() => setShowFilters(!showFilters)}
//             >
//               <Filter className="w-4 h-4" />
//               Filters
//             </button>
//             <div className="ml-auto text-sm text-gray-500">
//               {totalItems > 0 ? `Showing ${startIndex + 1}-${endIndex} of ${totalItems}` : 'Showing 0-0 of 0'}
//             </div>
//           </div>

//           {error && (
//             <div className="p-4 text-red-700 bg-red-100 border border-red-200 rounded-md m-4">
//               Error: {error}
//             </div>
//           )}

//           <div className="overflow-x-auto">
//             <table className="w-full">
//               <thead className="bg-white">
//                 <tr className="border-b">
//                   <th className="px-4 py-3 text-left">Degree</th>
//                   <th className="px-4 py-3 text-left">Status</th>
//                   <th className="px-4 py-3 text-left">Deadline</th>
//                   <th className="px-4 py-3 text-left">Views</th>
//                   <th className="px-4 py-3 text-left">Applications</th>
//                   <th className="px-4 py-3 text-left">Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {loading ? (
//                   <tr>
//                     <td colSpan={6} className="text-center py-4">
//                       <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-solid border-black border-r-transparent"></div>
//                       <p className="mt-2">Loading drives...</p>
//                     </td>
//                   </tr>
//                 ) : error ? (
//                   <tr>
//                     <td colSpan={6} className="text-center py-4 text-red-500">{error}</td>
//                   </tr>
//                 ) : currentJobs.length === 0 ? (
//                   <tr>
//                     <td colSpan={6} className="text-center py-4 text-gray-500">
//                       No drives found matching your criteria.
//                     </td>
//                   </tr>
//                 ) : (
//                   currentJobs.map(job => {
//                     const jobId = job._id;
//                     const degree = displayDegree(job);
//                     const jobStatus = job.jobStatus || 'Unknown';
//                     const deadline = job.endDate;
//                     const views = job.views || 0;
//                     const applications = job.applicationCount || 0;
                    
//                     // Check if the eye icon (View) should be disabled
//                     const isViewDisabled = applications === 0;
//                     const viewButtonClass = `transition-colors ${isViewDisabled ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:text-gray-700'}`;
                    
//                     return (
//                       <tr
//                         key={jobId}
//                         className="border-b hover:bg-gray-50 cursor-pointer transition-colors"
//                       >
//                         <td className="px-4 py-3" onClick={() => navigate(`/company-dashboard/preview/On-campus/${job._id}?isApplied=true`)}>
//                           <div className="font-medium text-gray-900">{degree}</div>
//                         </td>
//                         <td className="px-4 py-3">
//                           <span className={`px-2 py-1 text-xs rounded-full ${jobStatus === 'Open' ? 'bg-green-100 text-green-800' :
//                             jobStatus === 'Closed' ? 'bg-red-100 text-red-800' :
//                               'bg-gray-100 text-gray-800'
//                             }`}>
//                             {jobStatus}
//                           </span>
//                         </td>
//                         <td className="px-4 py-3">{formatDate(deadline)}</td>
//                         <td className="px-4 py-3">{views}</td>
//                         <td 
//                           className="px-4 py-3" 
//                           onClick={(e) => { 
//                             e.stopPropagation(); 
//                             if (!isViewDisabled) handleViewColleges(job); 
//                           }}
//                         >
//                           {applications}
//                         </td>
//                         <td className="px-4 py-3">
//                           <div className="flex gap-2">
//                             <button 
//                               onClick={(e) => { 
//                                 e.stopPropagation(); 
//                                 if (!isViewDisabled) handleViewColleges(job); 
//                               }} 
//                               className={viewButtonClass} 
//                               title={isViewDisabled ? "No applications to view" : "View College Applications"}
//                               disabled={isViewDisabled}
//                             >
//                               <Eye size={18} />
//                             </button>
//                             <button 
//                               onClick={(e) => {
//                                 e.stopPropagation();
//                                 handleDelete(job._id);
//                               }} 
//                               className="text-gray-500 hover:text-red-600 transition-colors" 
//                               title="Delete Drive"
//                             >
//                               <Trash size={18} />
//                             </button>
//                           </div>
//                         </td>
//                       </tr>
//                     );
//                   })
//                 )}
//               </tbody>
//             </table>
//           </div>

//           {/* Pagination */}
//           {!loading && totalPages > 1 && (
//             <div className="flex items-center justify-between p-4">
//               <button
//                 onClick={handlePrevPage}
//                 disabled={currentPage === 1}
//                 className="flex items-center gap-1 px-4 py-2 border rounded-md disabled:opacity-50 hover:bg-gray-50 transition-colors"
//               >
//                 <ChevronLeft size={16} />
//                 Prev
//               </button>
//               <div className="flex gap-2">
//                 {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
//                   <button
//                     key={page}
//                     onClick={() => handlePageClick(page)}
//                     className={`w-8 h-8 flex items-center justify-center rounded-md transition-colors ${currentPage === page ? 'bg-black text-white' : 'border hover:bg-gray-50'
//                       }`}
//                   >
//                     {page}
//                   </button>
//                 ))}
//               </div>
//               <button
//                 onClick={handleNextPage}
//                 disabled={currentPage === totalPages}
//                 className="flex items-center gap-1 px-4 py-2 border rounded-md disabled:opacity-50 hover:bg-gray-50 transition-colors"
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

import React, { useState, useEffect, useMemo } from 'react';
import { Search, Eye, ChevronLeft, ChevronRight, Trash, Filter, Briefcase, Globe, MapPin, Send, Phone, Linkedin, Mail, Building2, Calendar, FileText, User } from 'lucide-react';
import { acceptCandidate, deleteJobById, getCollegeApplicationsForJob, getPostedJobs, rejectCandidate, shortlistCandidate } from '@/lib/Company_AxiosInstance';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export default function OnCampusJobManagement() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedJob, setSelectedJob] = useState(null);
  const [companies, setCompanies] = useState([]);
  const [companiesLoading, setCompaniesLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('All Drives');
  const [showFilters, setShowFilters] = useState(false);
  const navigate = useNavigate();

  const itemsPerPage = 5;

  // Helper functions defined at the top to avoid reference errors
  const displayDegree = (job) => {
    const degree = job.degree || [];
    if (!degree || degree.length === 0) return 'N/A';
    return Array.isArray(degree) ? degree.join(', ') : String(degree);
  };

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

  const fetchJobs = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getPostedJobs("On-campus", "Accepted");
      console.log("Fetched jobs:", response?.data);
      
      if (response.data && Array.isArray(response.data)) {
        // Process jobs to update their status based on dates
        const processedJobs = processJobsWithStatus(response.data);
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

  const fetchCompaniesForJob = async (jobId, jobType) => {
    setCompaniesLoading(true);
    setError(null);
    try {
      const response = await getCollegeApplicationsForJob(jobId, jobType, "Accepted");
      console.log("Fetched companies for job:", response.data);
      setCompanies(response.data || []);
    } catch (err) {
      console.error("Error fetching companies:", err);
      setError(err.response?.data?.message || err.message || "Failed to fetch companies.");
      setCompanies([]);
    } finally {
      setCompaniesLoading(false);
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
        // Refresh the companies list after status update
        if (selectedJob) {
          fetchCompaniesForJob(selectedJob._id, selectedJob.jobType);
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

  // Set up interval to check and update job statuses periodically
  useEffect(() => {
    const intervalId = setInterval(() => {
      setJobs(prevJobs => processJobsWithStatus(prevJobs));
    }, 60000); // Check every minute

    return () => clearInterval(intervalId);
  }, []);

  // Memoized filtering logic
  const filteredJobs = useMemo(() => {
    if (!jobs || !Array.isArray(jobs)) return [];

    return jobs.filter(job => {
      const degree = displayDegree(job);
      const jobTitle = job.jobTitle || '';

      // Comprehensive search across degree and job title
      const matchesSearch =
        degree.toLowerCase().includes(searchQuery.toLowerCase()) ||
        jobTitle.toLowerCase().includes(searchQuery.toLowerCase());

      const status = job.jobStatus || '';

      // Filter based on the active tab
      if (activeTab === 'All Drives') {
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

  const handleViewCompanies = (job) => {
    if (job.applicationCount === 0) {
      alert("No companies have applied for this drive yet.");
      return;
    }
    setSelectedJob(job);
    fetchCompaniesForJob(job._id, job.jobType);
  };

  const handleBackToList = () => {
    setSelectedJob(null);
    setCompanies([]);
  };

  // Company Card Component with company data
  const CompanyCard = ({ companyApplication, driveDetails, onReject }) => {
    const [currentStatus, setCurrentStatus] = useState(companyApplication.currentStatus);
    const [isProcessing, setIsProcessing] = useState(false);

    if (!companyApplication || !companyApplication.applicant) {
      return null;
    }

    const { _id: applicationId, applicant, createdAt } = companyApplication;
    const { companyDetails, employerDetails, profileImageUrl } = applicant;

    const handleReject = async (e) => {
      e.stopPropagation();
      if (isProcessing) return;

      if (currentStatus === 'Rejected') {
        toast('Company is already Rejected!', { icon: 'ℹ️' });
        return;
      }

      setIsProcessing(true);
      try {
        await onReject(applicationId);
        const newStatus = 'Rejected';
        setCurrentStatus(newStatus);
        toast.success(`Successfully Rejected ${companyDetails?.companyName}.`);
      } catch (error) {
        toast.error('Error rejecting application.');
        console.error("Reject error:", error);
      } finally {
        setIsProcessing(false);
      }
    };

    const getStatusColor = (status) => {
      switch (status) {
        case 'Shortlisted':
          return 'bg-green-100 text-green-800';
        case 'Rejected':
          return 'bg-red-100 text-red-800';
        case 'Accepted':
          return 'bg-purple-100 text-purple-800';
        default:
          return 'bg-blue-100 text-blue-800';
      }
    };

    return (
      <div className="bg-white p-5 rounded-lg border border-gray-200 transition-shadow hover:shadow-md">
        <div className="flex items-start space-x-4">
          <img
            src={profileImageUrl || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'}
            alt={`${companyDetails?.companyName} Logo`}
            className="w-20 h-20 rounded-md object-cover border"
          />
          <div className="flex-grow">
            <div className="flex justify-between items-start">
              <h3 className="text-xl font-bold text-gray-800">{companyDetails?.companyName}</h3>
              <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(currentStatus)}`}>
                {currentStatus}
              </span>
            </div>
            <div className="mt-2 space-y-1.5 text-sm text-gray-600">
              <div className="flex items-center">
                <Briefcase size={14} className="mr-2.5 text-gray-400" />
                <span>{companyDetails?.industryType || 'N/A'}</span>
              </div>
              <div className="flex items-center">
                <Building2 size={14} className="mr-2.5 text-gray-400" />
                <span>{companyDetails?.companyType || 'N/A'}</span>
              </div>
              <div className="flex items-center">
                <MapPin size={14} className="mr-2.5 text-gray-400" />
                <span>{companyDetails?.city || 'N/A'}, {companyDetails?.state || 'N/A'}</span>
              </div>
              <div className="flex items-center">
                <Globe size={14} className="mr-2.5 text-gray-400" />
                <a href={companyDetails?.websiteUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  {companyDetails?.websiteUrl ? 'Website' : 'No website provided'}
                </a>
              </div>
              <div className="flex items-center">
                <Mail size={14} className="mr-2.5 text-gray-400" />
                <a href={`mailto:${employerDetails?.workEmail}`} className="text-blue-600 hover:underline">
                  {employerDetails?.workEmail || 'No email provided'}
                </a>
              </div>
              <div className="flex items-center">
                <Phone size={14} className="mr-2.5 text-gray-400" />
                <span>{companyDetails?.phoneNumber || 'No phone provided'}</span>
              </div>
              <div className="flex items-center">
                <Linkedin size={14} className="mr-2.5 text-gray-400" />
                <a href={companyDetails?.companyLinkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  {companyDetails?.companyLinkedin ? 'LinkedIn Profile' : 'No LinkedIn provided'}
                </a>
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-2">
              Applied on: {new Date(createdAt).toLocaleDateString()}
              <span className="mx-1"> | Established: {companyDetails?.establishedYear || 'N/A'}</span>
            </p>
          </div>
        </div>
        
        {/* Contact Person Details */}
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-semibold text-gray-800 mb-2">Contact Person</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="flex items-center">
              <User size={16} className="mr-2 text-gray-500" />
              <span>{employerDetails?.name || 'N/A'}</span>
            </div>
            <div className="flex items-center">
              <Briefcase size={16} className="mr-2 text-gray-500" />
              <span>{employerDetails?.designation || 'N/A'}</span>
            </div>
            <div className="flex items-center">
              <Mail size={16} className="mr-2 text-gray-500" />
              <span>{employerDetails?.workEmail || 'N/A'}</span>
            </div>
            <div className="flex items-center">
              <Phone size={16} className="mr-2 text-gray-500" />
              <span>{employerDetails?.mobile || 'N/A'}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 border-t pt-4">
          <button
            onClick={handleReject}
            disabled={isProcessing}
            className={`w-full text-white px-4 py-2 rounded-md font-semibold transition-colors text-center text-sm ${
              currentStatus === 'Rejected' 
                ? 'bg-red-700 hover:bg-red-800' 
                : 'bg-red-500 hover:bg-red-600'
            } ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isProcessing ? 'Rejecting...' : (currentStatus === 'Rejected' ? 'Rejected' : 'Reject')}
          </button>
          <button
            onClick={() => {/* Add message functionality here */}}
            disabled={isProcessing}
            className={`w-full bg-gray-500 text-white px-4 py-2 rounded-md font-semibold hover:bg-gray-600 transition-colors flex items-center justify-center text-center text-sm ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <Send size={14} className="mr-2" /> Message
          </button>
        </div>
      </div>
    );
  };

  if (selectedJob) {
    return (
      <div className="min-h-screen bg-gray-50 font-sans">
        <div className="max-w-6xl mx-auto p-4">
          <button
            onClick={handleBackToList}
            className="flex items-center text-gray-600 hover:text-black mb-6"
          >
            <ChevronLeft size={20} className="mr-1" />
            Back to drives
          </button>

          {companiesLoading ? (
            <div className="p-8 text-center bg-white rounded-lg shadow-sm">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-black border-r-transparent"></div>
              <p className="mt-4 text-gray-600">Loading company applications...</p>
            </div>
          ) : error ? (
            <div className="p-4 text-red-700 bg-red-100 border border-red-200 rounded-md">
              Error: {error}
            </div>
          ) : companies.length === 0 ? (
            <div className="p-8 text-center text-gray-500 bg-white rounded-lg shadow-sm">
              No companies have applied for this drive yet.
            </div>
          ) : (
            <div className="space-y-4">
              {companies.map(company => (
                <CompanyCard
                  key={company._id}
                  companyApplication={company}
                  driveDetails={selectedJob}
                  onReject={(applicationId) => handleUpdateApplicationStatus(applicationId, 'Rejected')}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans">
      <div className="max-w-7xl mx-auto p-4 bg-white">
        <div className="flex justify-between items-center mt-10 mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Accepted On-Campus Drives</h1>
            <p className="text-gray-600 mt-2">Track Your Accepted On-Campus Drives</p>
          </div>
        </div>

        <div className="border rounded-md mt-10">
          {/* Tabs */}
          <div className="flex border-b">
            <button
              className={`px-4 py-2 ${activeTab === 'All Drives' ? 'border-b-2 border-black font-medium' : ''}`}
              onClick={() => setActiveTab('All Drives')}
            >
              All Drives ({jobs.length || 0})
            </button>
            <button
              className={`px-4 py-2 ${activeTab === 'Open' ? 'border-b-2 border-black font-medium' : ''}`}
              onClick={() => setActiveTab('Open')}
            >
              Open ({openJobsCount})
            </button>
            <button
              className={`px-4 py-2 ${activeTab === 'Pending' ? 'border-b-2 border-black font-medium' : ''}`}
              onClick={() => setActiveTab('Pending')}
            >
              Pending ({pendingJobsCount})
            </button>
            <button
              className={`px-4 py-2 ${activeTab === 'Closed' ? 'border-b-2 border-black font-medium' : ''}`}
              onClick={() => setActiveTab('Closed')}
            >
              Closed ({closedJobsCount})
            </button>
          </div>

          {/* Search and filters */}
          <div className="p-4 border-b flex flex-wrap items-center gap-2">
            <div className="relative flex-grow max-w-sm">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="w-4 h-4 text-gray-500" />
              </div>
              <input
                type="text"
                className="w-full pl-10 pr-4 py-2 border rounded-md"
                placeholder="Search by degree or job title..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button
              className="flex items-center gap-2 px-4 py-2 border rounded-md hover:bg-gray-50 transition-colors"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="w-4 h-4" />
              Filters
            </button>
            <div className="ml-auto text-sm text-gray-500">
              {totalItems > 0 ? `Showing ${startIndex + 1}-${endIndex} of ${totalItems}` : 'Showing 0-0 of 0'}
            </div>
          </div>

          {error && (
            <div className="p-4 text-red-700 bg-red-100 border border-red-200 rounded-md m-4">
              Error: {error}
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white">
                <tr className="border-b">
                  <th className="px-4 py-3 text-left">Degree</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-left">Deadline</th>
                  <th className="px-4 py-3 text-left">Views</th>
                  <th className="px-4 py-3 text-left">Applications</th>
                  <th className="px-4 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6} className="text-center py-4">
                      <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-solid border-black border-r-transparent"></div>
                      <p className="mt-2">Loading drives...</p>
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan={6} className="text-center py-4 text-red-500">{error}</td>
                  </tr>
                ) : currentJobs.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-4 text-gray-500">
                      No drives found matching your criteria.
                    </td>
                  </tr>
                ) : (
                  currentJobs.map(job => {
                    const jobId = job._id;
                    const degree = displayDegree(job);
                    const jobStatus = job.jobStatus || 'Unknown';
                    const deadline = job.endDate;
                    const views = job.views || 0;
                    const applications = job.applicationCount || 0;
                    
                    // Check if the eye icon (View) should be disabled
                    const isViewDisabled = applications === 0;
                    const viewButtonClass = `transition-colors ${isViewDisabled ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:text-gray-700'}`;
                    
                    return (
                      <tr
                        key={jobId}
                        className="border-b hover:bg-gray-50 cursor-pointer transition-colors"
                      >
                        <td className="px-4 py-3" onClick={() => navigate(`/company-dashboard/preview/On-campus/${job._id}?isApplied=true`)}>
                          <div className="font-medium text-gray-900">{degree}</div>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 text-xs rounded-full ${jobStatus === 'Open' ? 'bg-green-100 text-green-800' :
                            jobStatus === 'Closed' ? 'bg-red-100 text-red-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                            {jobStatus}
                          </span>
                        </td>
                        <td className="px-4 py-3">{formatDate(deadline)}</td>
                        <td className="px-4 py-3">{views}</td>
                        <td 
                          className="px-4 py-3" 
                          onClick={(e) => { 
                            e.stopPropagation(); 
                            if (!isViewDisabled) handleViewCompanies(job); 
                          }}
                        >
                          {applications}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2">
                            <button 
                              onClick={(e) => { 
                                e.stopPropagation(); 
                                if (!isViewDisabled) handleViewCompanies(job); 
                              }} 
                              className={viewButtonClass} 
                              title={isViewDisabled ? "No applications to view" : "View Company Applications"}
                              disabled={isViewDisabled}
                            >
                              <Eye size={18} />
                            </button>
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(job._id);
                              }} 
                              className="text-gray-500 hover:text-red-600 transition-colors" 
                              title="Delete Drive"
                            >
                              <Trash size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {!loading && totalPages > 1 && (
            <div className="flex items-center justify-between p-4">
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className="flex items-center gap-1 px-4 py-2 border rounded-md disabled:opacity-50 hover:bg-gray-50 transition-colors"
              >
                <ChevronLeft size={16} />
                Prev
              </button>
              <div className="flex gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => handlePageClick(page)}
                    className={`w-8 h-8 flex items-center justify-center rounded-md transition-colors ${currentPage === page ? 'bg-black text-white' : 'border hover:bg-gray-50'
                      }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className="flex items-center gap-1 px-4 py-2 border rounded-md disabled:opacity-50 hover:bg-gray-50 transition-colors"
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