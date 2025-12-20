
// import React, { useState, useEffect, useMemo } from 'react';
// import { useNavigate, useLocation, Link } from 'react-router-dom';
// import {
//   Search, Eye, Trash,
//   ChevronLeft, ChevronRight, Filter
// } from 'lucide-react';
// import { getCollegePostedJobs , deleteCollegeJob } from '@/lib/College_AxiosIntance';

// function JobManagementApplicationForPool() {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const pathParts = location.pathname.split('/').filter(Boolean);
//   const lastSegment = pathParts[pathParts.length - 1];

//   const [jobs, setJobs] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//    const [deletingJobId, setDeletingJobId] = useState(null);

//   const [currentPage, setCurrentPage] = useState(1);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [activeTab, setActiveTab] = useState('All Jobs');
//   const [showFilters, setShowFilters] = useState(false);

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

//   const processJobsWithStatus = (jobsData) => {
//     return jobsData.map(job => {
//       if (job.startDate && job.endDate) {
//         return {
//           ...job,
//           jobStatus: getJobStatus(job)
//         };
//       }
//       return job;
//     });
//   };

//   useEffect(() => {
//     const fetchJobs = async () => {
//       try {
//         setLoading(true);
//         setError(null);

//         const response = await getCollegePostedJobs('Pool-campus', lastSegment);

//         if (response.data && response.data.response && Array.isArray(response.data.response)) {
//           const processedJobs = processJobsWithStatus(response.data.response);
//           setJobs(processedJobs);
//         } else {
//           console.error('Unexpected API response format:', response);
//           setJobs([]);
//         }
//       } catch (err) {
//         setError("Failed to fetch jobs. Please try again later.");
//         console.error("Error fetching jobs:", err);
//         setJobs([]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchJobs();
//   }, [lastSegment]);

//   useEffect(() => {
//     const intervalId = setInterval(() => {
//       setJobs(prevJobs => processJobsWithStatus(prevJobs));
//     }, 60000);

//     return () => clearInterval(intervalId);
//   }, []);

//   const itemsPerPage = 5;

//   const filteredJobs = useMemo(() => {
//     if (!jobs || !Array.isArray(jobs)) return [];

//     return jobs.filter(job => {
//       const degree = Array.isArray(job.degree) ? job.degree.join(', ') : '';
//       const location = Array.isArray(job.location) ?
//         job.location.join(', ') :
//         job.location || '';

//       const matchesSearch =
//         degree.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         location.toLowerCase().includes(searchQuery.toLowerCase());

//       const status = job.jobStatus || '';

//       if (activeTab === 'All Jobs') {
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

//   const openJobsCount = useMemo(() => {
//     if (!jobs || !Array.isArray(jobs)) return 0;
//     return jobs.filter(job => job.jobStatus === 'Open').length;
//   }, [jobs]);

//   const pendingJobsCount = useMemo(() => {
//     if (!jobs || !Array.isArray(jobs)) return 0;
//     return jobs.filter(job => job.jobStatus === 'Pending').length;
//   }, [jobs]);

//   const closedJobsCount = useMemo(() => {
//     if (!jobs || !Array.isArray(jobs)) return 0;
//     return jobs.filter(job => job.jobStatus === 'Closed').length;
//   }, [jobs]);

//   const totalItems = filteredJobs.length;
//   const totalPages = Math.ceil(totalItems / itemsPerPage);
//   const startIndex = (currentPage - 1) * itemsPerPage;
//   const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
//   const currentJobs = filteredJobs.slice(startIndex, endIndex);

//   const handlePrevPage = () => {
//     setCurrentPage(prev => Math.max(prev - 1, 1));
//   };

//   const handleNextPage = () => {
//     setCurrentPage(prev => Math.min(prev + 1, totalPages));
//   };

//   const handlePageClick = (pageNumber) => {
//     setCurrentPage(pageNumber);
//   };

//   const handleView = (jobId, status = 'Applied') => {
//     navigate(`/manage-application/PoolCampus-placement/${jobId}?status=${status}`);
//   };

//   const handleDelete = async (jobId, e) => {
//         e.stopPropagation();
        
//         // Confirm before deleting
//         const isConfirmed = window.confirm('Are you sure you want to delete this job? This action cannot be undone.');
        
//         if (!isConfirmed) {
//             return;
//         }

//         try {
//             setDeletingJobId(jobId);
            
//             // Call the delete API
//             const response = await deleteCollegeJob(jobId);
            
//             if (response.success) {
//                 // Remove the deleted job from the state
//                 setJobs(prevJobs => prevJobs.filter(job => job._id !== jobId));
                
//                 // Show success message
//                 alert('Job deleted successfully!');
                
//                 // If we deleted the last item on the page, go back a page
//                 if (currentJobs.length === 1 && currentPage > 1) {
//                     setCurrentPage(prev => prev - 1);
//                 }
                
//                 // Refresh the job list
//                 await fetchJobs();
//             } else {
//                 // Show error message from server
//                 alert(response.msg || 'Failed to delete job. Please try again.');
//             }
//         } catch (error) {
//             console.error('Error deleting job:', error);
//             alert('An error occurred while deleting the job. Please try again.');
//         } finally {
//             setDeletingJobId(null);
//         }
//     };


//   const formatDate = (dateString) => {
//     if (!dateString) return 'N/A';
//     try {
//       return new Date(dateString).toLocaleDateString('en-US', {
//         year: 'numeric',
//         month: 'short',
//         day: 'numeric'
//       });
//     } catch (error) {
//       console.error("Error formatting date:", error);
//       return 'Invalid Date';
//     }
//   };

//   return (
//     <div className="min-h-screen bg-white">
//       <div className="max-w-7xl mx-auto p-4 bg-white">
//         <div className="flex justify-between items-center mt-10 mb-4">
//           <div>
//             <h1 className="text-3xl font-bold">Manage Pool-Campus Applications</h1>
//             <p className="text-gray-600 mt-2">Track Your Pool Campus Drives and Streamline Applications</p>
//           </div>
//           <button className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition-colors">
//             Post a Job
//           </button>
//         </div>

//         <div className="border rounded-md mt-10">
//           {/* Tabs */}
//           <div className="flex border-b">
//             <button
//               className={`px-4 py-2 ${activeTab === 'All Jobs' ? 'border-b-2 border-black font-medium' : ''}`}
//               onClick={() => setActiveTab('All Jobs')}
//             >
//               All Jobs ({jobs.length || 0})
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
//                 placeholder="Search jobs by degree, type, or location"
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

//           {/* Table */}
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
//                       <p className="mt-2">Loading jobs...</p>
//                     </td>
//                   </tr>
//                 ) : error ? (
//                   <tr>
//                     <td colSpan={6} className="text-center py-4 text-red-500">
//                       {error}
//                     </td>
//                   </tr>
//                 ) : currentJobs.length === 0 ? (
//                   <tr>
//                     <td colSpan={6} className="text-center py-4 text-gray-500">
//                       No jobs found matching your criteria.
//                     </td>
//                   </tr>
//                 ) : (
//                   currentJobs.map(job => {
//                     const jobId = job._id || job.id;
//                     const jobDegree = Array.isArray(job.degree) ? job.degree.join(', ') : 'N/A';
//                     const jobLocation = Array.isArray(job.location) ?
//                       job.location.join(', ') :
//                       job.location || 'N/A';
//                     const jobStatus = job.jobStatus || 'Unknown';
//                     const deadline = job.endDate || job.deadline;
//                     const views = job?.views ?? 0;
//                     const applications = job.applicationCount || job.applications || 0;
                    
//                     const isViewDisabled = applications === 0;
//                     const viewButtonClass = `transition-colors ${isViewDisabled ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:text-gray-700'}`;
                    
//                     return (
//                       <tr
//                         key={jobId}
//                         className="border-b hover:bg-gray-50 cursor-pointer transition-colors"
//                       >
//                         {/* Link for Preview */}
//                         <td className="px-4 py-3" onClick={() => navigate(`/college-dashboard/preview/Pool-campus/${job._id}?isApplied=true`)}>
//                           <div className="font-medium">{jobDegree}</div>
//                           <div className="text-sm text-gray-500">
//                             {jobLocation}
//                           </div>
//                         </td>
//                         <td className="px-4 py-3">
//                           <span className={`px-2 py-1 text-xs rounded-full ${jobStatus === 'Open'
//                             ? 'bg-green-100 text-green-800'
//                             : jobStatus === 'Closed'
//                               ? 'bg-red-100 text-red-800'
//                               : 'bg-gray-100 text-gray-800'
//                             }`}>
//                             {jobStatus}
//                           </span>
//                         </td>
//                         <td className="px-4 py-3">{formatDate(deadline)}</td>
//                         <td className="px-4 py-3">{views}</td>
//                         {/* Click to see applicants */}
//                         <td 
//                           className="px-4 py-3" 
//                           onClick={(e) => { 
//                             e.stopPropagation(); 
//                             if(!isViewDisabled) handleView(jobId, 'Applied'); 
//                           }}
//                         >
//                           {applications}
//                         </td>
//                         <td className="px-4 py-3">
//                           <div className="flex gap-2">
//                             <button 
//                               onClick={(e) => { 
//                                 e.stopPropagation(); 
//                                 if (!isViewDisabled) handleView(jobId, 'Applied'); 
//                               }} 
//                               className={viewButtonClass} 
//                               title={isViewDisabled ? "No applications to view" : "View Applicants"}
//                               disabled={isViewDisabled}
//                             >
//                               <Eye size={18} />
//                             </button>
//                             <Link
//                               to={`/college-dashboard/preview/Pool-campus/${job._id}?isApplied=true`}
//                               className="text-gray-500 hover:text-blue-600 p-1 rounded-md hover:bg-gray-200"
//                               title="View Job Description"
//                               onClick={e => e.stopPropagation()}
//                             >
//                               <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-file-search-corner-icon lucide-file-search-corner">
//                                 <path d="M11.1 22H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.706.706l3.589 3.588A2.4 2.4 0 0 1 20 8v3.25" />
//                                 <path d="M14 2v5a1 1 0 0 0 1 1h5" />
//                                 <path d="m21 22-2.88-2.88" />
//                                 <circle cx="16" cy="17" r="3" />
//                               </svg>
//                             </Link>
//                             <button onClick={(e) => handleDelete(jobId, e)} className="text-gray-500 hover:text-gray-700 transition-colors" title="Delete Job">
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
//                     className={`w-8 h-8 flex items-center justify-center rounded-md transition-colors ${currentPage === page
//                       ? 'bg-black text-white'
//                       : 'border hover:bg-gray-50'
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

// export default JobManagementApplicationForPool;


import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
  Search, Eye, Trash,
  ChevronLeft, ChevronRight, Filter,
  Calendar, MapPin, Users, Briefcase, AlertCircle, FileSearch
} from 'lucide-react';
import { getCollegePostedJobs, deleteCollegeJob } from '@/lib/College_AxiosIntance';

function JobManagementApplicationForPool() {
  const navigate = useNavigate();
  const location = useLocation();
  const pathParts = location.pathname.split('/').filter(Boolean);
  const lastSegment = pathParts[pathParts.length - 1];

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingJobId, setDeletingJobId] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('All Jobs');
  const [showFilters, setShowFilters] = useState(false);

  // Define jobType for Pool-campus
  const jobType = 'Pool-campus';

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

  const processJobsWithStatus = (jobsData) => {
    return jobsData.map(job => {
      if (job.startDate && job.endDate) {
        return {
          ...job,
          jobStatus: getJobStatus(job)
        };
      }
      return job;
    });
  };

  const fetchJobs = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await getCollegePostedJobs('Pool-campus', lastSegment);

      if (response.data && response.data.response && Array.isArray(response.data.response)) {
        const processedJobs = processJobsWithStatus(response.data.response);
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

  useEffect(() => {
    fetchJobs();
  }, [lastSegment]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setJobs(prevJobs => processJobsWithStatus(prevJobs));
    }, 60000);

    return () => clearInterval(intervalId);
  }, []);

  const itemsPerPage = 5;

  const filteredJobs = useMemo(() => {
    if (!jobs || !Array.isArray(jobs)) return [];

    return jobs.filter(job => {
      const degree = Array.isArray(job.degree) ? job.degree.join(', ') : '';
      const location = Array.isArray(job.location) ?
        job.location.join(', ') :
        job.location || '';

      const matchesSearch =
        degree.toLowerCase().includes(searchQuery.toLowerCase()) ||
        location.toLowerCase().includes(searchQuery.toLowerCase());

      const status = job.jobStatus || '';

      if (activeTab === 'All Jobs') {
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

  const openJobsCount = useMemo(() => {
    if (!jobs || !Array.isArray(jobs)) return 0;
    return jobs.filter(job => job.jobStatus === 'Open').length;
  }, [jobs]);

  const pendingJobsCount = useMemo(() => {
    if (!jobs || !Array.isArray(jobs)) return 0;
    return jobs.filter(job => job.jobStatus === 'Pending').length;
  }, [jobs]);

  const closedJobsCount = useMemo(() => {
    if (!jobs || !Array.isArray(jobs)) return 0;
    return jobs.filter(job => job.jobStatus === 'Closed').length;
  }, [jobs]);

  const totalItems = filteredJobs.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const currentJobs = filteredJobs.slice(startIndex, endIndex);

  const handlePrevPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  };

  const handlePageClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Function to build query parameters
  const buildQueryParams = (jobId, targetStatus, isVisited = false) => {
    const customParam = {
      jobId: jobId,
      jobType: jobType,
      targetStatus: targetStatus,
    };
    
    // Only add isVisited if it's true
    if (isVisited) {
      customParam.isVisited = isVisited;
    }
    
    return customParam;
  };

  // Function to navigate with query parameters
  const navigateWithParams = (jobId, targetStatus, isVisited = false) => {
    const customParam = buildQueryParams(jobId, targetStatus, isVisited);
    const queryString = new URLSearchParams(customParam).toString();
    
    // Navigate to Pool Campus job detail with query parameters
    // This matches your route: /manage-application/PoolCampus-placement/:jobId
    navigate(`/manage-application/PoolCampus-placement/${jobId}?${queryString}`);
  };

  // Handle Applications count click (with isVisited = true)
  const handleApplicationsClick = (jobId, targetStatus, e) => {
    e.stopPropagation();
    // Navigate with isVisited = true
    navigateWithParams(jobId, targetStatus, true);
  };

  // Handle Eye icon click (without isVisited)
  const handleViewJob = (jobId, targetStatus, e) => {
    e.stopPropagation();
    // Navigate without isVisited
    navigateWithParams(jobId, targetStatus, false);
  };

  // Handle row click for degree/location - goes to preview
  const handleRowClick = (jobId) => {
    navigate(`/college-dashboard/preview/Pool-campus/${jobId}?isApplied=true`);
  };

  const handleDelete = async (jobId, e) => {
    e.stopPropagation();
    
    const isConfirmed = window.confirm('Are you sure you want to delete this job? This action cannot be undone.');
    
    if (!isConfirmed) {
      return;
    }

    try {
      setDeletingJobId(jobId);
      
      const response = await deleteCollegeJob(jobId);
      
      if (response.data && response.data.success) {
        setJobs(prevJobs => prevJobs.filter(job => job._id !== jobId));
        alert('Job deleted successfully!');
        
        if (currentJobs.length === 1 && currentPage > 1) {
          setCurrentPage(prev => prev - 1);
        }
        
        await fetchJobs();
      } else {
        alert(response.data?.msg || response.msg || 'Failed to delete job. Please try again.');
      }
    } catch (error) {
      console.error('Error deleting job:', error);
      if (error.response?.data?.msg) {
        alert(error.response.data.msg);
      } else if (error.message) {
        alert(error.message);
      } else {
        alert('An error occurred while deleting the job. Please try again.');
      }
    } finally {
      setDeletingJobId(null);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      console.error("Error formatting date:", error);
      return 'Invalid Date';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0e6f7]/60 via-[#d4e8f9]/55 to-[#cff7ea]/60">
      {/* Pastel blur background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#fbcfe8]/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 -left-20 w-60 h-60 bg-[#93c5fd]/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-1/3 w-40 h-40 bg-[#a7f3d0]/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/4 right-1/4 w-48 h-48 bg-[#c7d2fe]/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/3 left-1/4 w-56 h-56 bg-[#fde68a]/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto p-6">
        {/* Header Section */}
        <div className="mb-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8">
            <div className="text-center md:text-left">
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#3b82f6] to-[#8b5cf6] bg-clip-text text-transparent mb-2">
                Manage Pool-Campus Applications
              </h1>
              <p className="text-gray-600 text-lg md:text-xl max-w-2xl">
                Track Your Pool Campus Drives and Streamline Applications
              </p>
            </div>
          </div>

          {/* Main Content Card */}
          <div className="bg-white/90 backdrop-blur-sm border border-white/50 rounded-2xl shadow-lg shadow-blue-50/50 overflow-hidden">
            {/* Tabs */}
            <div className="flex border-b border-white/50">
              <button
                className={`px-6 py-3 text-sm font-medium transition-all duration-200 ${activeTab === 'All Jobs' 
                  ? 'border-b-2 border-[#3b82f6] text-[#3b82f6]' 
                  : 'text-gray-600 hover:text-[#3b82f6] hover:bg-white/30'}`}
                onClick={() => setActiveTab('All Jobs')}
              >
                All Jobs ({jobs.length || 0})
              </button>
              <button
                className={`px-6 py-3 text-sm font-medium transition-all duration-200 ${activeTab === 'Open' 
                  ? 'border-b-2 border-[#3b82f6] text-[#3b82f6]' 
                  : 'text-gray-600 hover:text-[#3b82f6] hover:bg-white/30'}`}
                onClick={() => setActiveTab('Open')}
              >
                Open ({openJobsCount})
              </button>
              <button
                className={`px-6 py-3 text-sm font-medium transition-all duration-200 ${activeTab === 'Pending' 
                  ? 'border-b-2 border-[#3b82f6] text-[#3b82f6]' 
                  : 'text-gray-600 hover:text-[#3b82f6] hover:bg-white/30'}`}
                onClick={() => setActiveTab('Pending')}
              >
                Pending ({pendingJobsCount})
              </button>
              <button
                className={`px-6 py-3 text-sm font-medium transition-all duration-200 ${activeTab === 'Closed' 
                  ? 'border-b-2 border-[#3b82f6] text-[#3b82f6]' 
                  : 'text-gray-600 hover:text-[#3b82f6] hover:bg-white/30'}`}
                onClick={() => setActiveTab('Closed')}
              >
                Closed ({closedJobsCount})
              </button>
            </div>

            {/* Search and Filters */}
            <div className="p-6 border-b border-white/50">
              <div className="flex flex-col md:flex-row gap-4 items-center">
                <div className="relative flex-grow">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Search className="w-4 h-4 text-[#3b82f6]" />
                  </div>
                  <input
                    type="text"
                    className="w-full pl-10 pr-4 py-3 bg-white/50 backdrop-blur-sm border border-white/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#93c5fd] focus:border-transparent transition-all duration-200"
                    placeholder="Search jobs by degree, type, or location"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                <button
                  className="flex items-center gap-2 px-6 py-3 bg-white/50 backdrop-blur-sm border border-white/50 rounded-xl hover:bg-white/70 transition-all duration-200 text-gray-700 font-medium"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <Filter className="w-4 h-4 text-[#3b82f6]" />
                  Filters
                </button>

                <div className="text-sm text-gray-500 font-medium">
                  {totalItems > 0 ? `Showing ${startIndex + 1}-${endIndex} of ${totalItems}` : 'Showing 0-0 of 0'}
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-white/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Degree</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Deadline</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Views</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Applications</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="text-center py-8">
                        <div className="inline-block h-8 w-8 animate-spin rounded-full border-2 border-solid border-[#3b82f6] border-r-transparent"></div>
                        <p className="mt-2 text-gray-600">Loading jobs...</p>
                      </td>
                    </tr>
                  ) : error ? (
                    <tr>
                      <td colSpan={6} className="text-center py-8">
                        <div className="flex flex-col items-center">
                          <AlertCircle className="w-12 h-12 text-red-500 mb-2" />
                          <p className="text-red-500 font-medium">{error}</p>
                        </div>
                      </td>
                    </tr>
                  ) : currentJobs.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-8">
                        <div className="flex flex-col items-center">
                          <Search className="w-12 h-12 text-gray-400 mb-2" />
                          <p className="text-gray-500 text-lg">No jobs found matching your criteria.</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    currentJobs.map(job => {
                      const jobId = job._id || job.id;
                      const jobDegree = Array.isArray(job.degree) ? job.degree.join(', ') : 'N/A';
                      const jobLocation = Array.isArray(job.location) ?
                        job.location.join(', ') :
                        job.location || 'N/A';
                      const jobStatus = job.jobStatus || 'Unknown';
                      const targetStatus = jobStatus; // Using jobStatus as targetStatus
                      const deadline = job.endDate || job.deadline;
                      const views = job?.views ?? 0;
                      const applications = job.applicationCount || job.applications || 0;
                      
                      const isViewDisabled = applications === 0;
                      const viewButtonClass = `transition-all duration-200 ${isViewDisabled ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:text-[#3b82f6]'}`;
                      
                      return (
                        <tr
                          key={jobId}
                          className="border-b border-white/50 hover:bg-white/30 transition-colors duration-200"
                        >
                          <td 
                            className="px-6 py-4 cursor-pointer" 
                            onClick={() => handleRowClick(jobId)}
                          >
                            <div className="font-medium text-gray-900">{jobDegree}</div>
                            <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                              <MapPin className="w-3 h-3" />
                              {jobLocation}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-3 py-1 text-xs font-medium rounded-full ${jobStatus === 'Open'
                              ? 'bg-gradient-to-r from-[#a7f3d0]/20 to-[#34d399]/20 text-[#059669] border border-[#a7f3d0]/30'
                              : jobStatus === 'Closed'
                                ? 'bg-gradient-to-r from-[#fecaca]/20 to-[#f87171]/20 text-[#dc2626] border border-[#fecaca]/30'
                                : 'bg-gradient-to-r from-[#fde68a]/20 to-[#f59e0b]/20 text-[#d97706] border border-[#fde68a]/30'
                              }`}>
                              {jobStatus}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-1 text-gray-700">
                              <Calendar className="w-4 h-4 text-[#3b82f6]" />
                              {formatDate(deadline)}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-1 text-gray-700">
                              <Eye className="w-4 h-4 text-[#3b82f6]" />
                              {views}
                            </div>
                          </td>
                          <td 
                            className="px-6 py-4" 
                            onClick={(e) => handleApplicationsClick(jobId, targetStatus, e)}
                          >
                            <div className="flex items-center gap-1 text-gray-700 cursor-pointer hover:text-[#3b82f6] transition-colors duration-200">
                              <Users className="w-4 h-4 text-[#3b82f6]" />
                              {applications}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex gap-3">
                              <button 
                                onClick={(e) => { 
                                  e.stopPropagation(); 
                                  if (!isViewDisabled) handleViewJob(jobId, targetStatus, e); 
                                }} 
                                className={viewButtonClass} 
                                title={isViewDisabled ? "No applications to view" : "View Applicants"}
                                disabled={isViewDisabled}
                              >
                                <Eye size={18} />
                              </button>
                              <Link
                                to={`/college-dashboard/preview/Pool-campus/${jobId}?isApplied=true`}
                                className="text-gray-500 hover:text-[#3b82f6] p-1 rounded-md hover:bg-white/50 transition-all duration-200"
                                title="View Job Description"
                                onClick={e => e.stopPropagation()}
                              >
                                <FileSearch size={18} />
                              </Link>
                              <button 
                                onClick={(e) => handleDelete(jobId, e)} 
                                className={`text-gray-500 hover:text-red-500 transition-all duration-200 ${deletingJobId === jobId ? 'opacity-50 cursor-not-allowed' : ''}`} 
                                title="Delete Job"
                                disabled={deletingJobId === jobId}
                              >
                                {deletingJobId === jobId ? (
                                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-solid border-[#3b82f6] border-r-transparent"></div>
                                ) : (
                                  <Trash size={18} />
                                )}
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
              <div className="flex flex-col sm:flex-row items-center justify-between p-6 border-t border-white/50">
                <button
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                  className="flex items-center gap-2 px-6 py-3 bg-white/50 backdrop-blur-sm border border-white/50 rounded-xl disabled:opacity-50 hover:bg-white/70 transition-all duration-200 text-gray-700 font-medium mb-4 sm:mb-0"
                >
                  <ChevronLeft size={16} />
                  Prev
                </button>

                <div className="flex gap-2 mb-4 sm:mb-0">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => handlePageClick(page)}
                      className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-200 font-medium ${currentPage === page
                        ? 'bg-gradient-to-r from-[#93c5fd] to-[#3b82f6] text-white shadow-md shadow-[#93c5fd]/30'
                        : 'bg-white/50 backdrop-blur-sm border border-white/50 text-gray-700 hover:bg-white/70'
                        }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>

                <button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  className="flex items-center gap-2 px-6 py-3 bg-white/50 backdrop-blur-sm border border-white/50 rounded-xl disabled:opacity-50 hover:bg-white/70 transition-all duration-200 text-gray-700 font-medium"
                >
                  Next
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default JobManagementApplicationForPool;