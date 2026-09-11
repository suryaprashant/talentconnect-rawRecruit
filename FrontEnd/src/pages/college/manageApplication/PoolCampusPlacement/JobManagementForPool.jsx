
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
  Search, Eye, 
  ChevronLeft, ChevronRight, Filter,Trash2,
  Calendar, MapPin, Users, Briefcase, AlertCircle, FileSearch,Ban
} from 'lucide-react';
import { getCollegePostedJobs, deleteCollegeJob,permanentDeleteCollegeJob } from '@/lib/College_AxiosIntance';

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
    const startDate = new Date(job?.proposedSchedule?.startDate);
    const endDate = new Date(job?.proposedSchedule?.endDate);

    if (currentDate < startDate) {
      return 'Pending';
    } else if (currentDate >= startDate && currentDate <= endDate) {
      return 'Open';
    } else {
      return 'Closed';
    }
  };
const handlePermanentDelete = async (jobId, e) => {
  e.stopPropagation();
  const isConfirmed = window.confirm('⚠️ This will PERMANENTLY delete the job and cannot be undone! Are you sure?');
  if (!isConfirmed) return;

  try {
    setDeletingJobId(jobId);
    await permanentDeleteCollegeJob(jobId);
    setJobs(prevJobs => prevJobs.filter(job => job._id !== jobId));
    alert('Job permanently deleted!');
    if (currentJobs.length === 1 && currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
    await fetchJobs();
  } catch (error) {
    console.error('Error permanently deleting job:', error);
    alert('An error occurred while permanently deleting the job.');
  } finally {
    setDeletingJobId(null);
  }
};
  const processJobsWithStatus = (jobsData) => {
    return jobsData.map(job => {
      if (job?.proposedSchedule?.startDate && job?.proposedSchedule?.endDate) {
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
      const location = job.venue || '';

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
  const navigateWithParams = (jobId, targetStatus, isVisited) => {
    const customParam = {
      jobId: jobId,
      jobType: 'Pool-campus',
      targetStatus: targetStatus,
    };
    
    // Only send the flag if we specifically want to filter "New"
    if (isVisited === "false" || isVisited === false) {
      customParam.isVisited = "false";
    }
    
    const queryString = new URLSearchParams(customParam).toString();
    navigate(`/manage-application/PoolCampus-placement/${jobId}?${queryString}`);
  };

  // Handle Applications count click (with isVisited = true)
  const handleApplicationsClick = (jobId, targetStatus, e) => {
    e.stopPropagation();
    const isVisited = "false"
    
    navigateWithParams(jobId, targetStatus, isVisited);
  };

  // Handle Eye icon click (without isVisited)
  const handleViewJob = (jobId, targetStatus, e) => {
    e.stopPropagation();
    // Navigate without isVisited
    navigateWithParams(jobId, targetStatus, undefined);
  };

  // Handle row click for degree/location - goes to preview
  const handleRowClick = (jobId) => {
    navigate(`/college-dashboard/preview/Pool-campus/${jobId}?isApplied=true`);
  };

  const handleDelete = async (jobId, e) => {
    e.stopPropagation();
    
  //  const isConfirmed = window.confirm('Are you sure you want to delete this job? This action cannot be undone.');
    const isConfirmed = window.confirm('Are you sure you want to mark this job as Inactive? It will no longer be visible to new applicants.');
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
      {/* <div className="relative z-10 max-w-7xl mx-auto px-6 pt-8">

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 px-6 py-5 mb-2">
          {/* Header 
          <div className="flex items-center gap-3 mb-4">
            <h2 className="text-2xl md:text-[26px] font-semibold text-[#143694] tracking-tight">
              Manage Applications
            </h2>

            <span className="flex items-center justify-center w-7 h-7 bg-[#143694] text-white text-xs font-bold rounded-full">
              {jobs.length}
            </span>
          </div>
          
          
        </div>

      </div> */}
      {/* Pastel blur background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#fbcfe8]/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 -left-20 w-60 h-60 bg-[#143694]/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-1/3 w-40 h-40 bg-[#a7f3d0]/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/4 right-1/4 w-48 h-48 bg-[#c7d2fe]/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/3 left-1/4 w-56 h-56 bg-[#fde68a]/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto p-6">
        {/* Header Section */}
        <div className="mb-12">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 px-6 py-6 mt-3 mb-8">

            <div className="flex flex-col gap-4">

              {/* Top Section */}
              <div>
                <h1 className="text-xl md:text-2xl font-semibold text-[#143694] tracking-tight leading-snug">
                  Manage Pool-Campus Applications
                </h1>

                <p className="text-gray-600 text-sm md:text-base mt-1 max-w-2xl">
                  Track your pool campus drives and streamline applications efficiently
                </p>
              </div>

              {/* Tabs */}
              <div className="flex items-center gap-3 border-gray-200 pt-0">

                {/* Inactive */}
                <button 
                  onClick={() => navigate('/manage-application/campus-placement')}
                  className="px-5 py-2 text-gray-500 hover:text-[#143694] hover:bg-gray-100 rounded-full font-medium text-sm transition-all"
                >
                  On-Campus
                </button>

                {/* Active */}
                <button 
                  className="px-5 py-2 bg-[#143694] text-white rounded-full font-medium text-sm shadow-sm"
                >
                  Pool-Campus
                </button>

              </div>

            </div>

          </div>

          {/* Main Content Card */}
          <div className="bg-white/90 backdrop-blur-sm border border-white/50 rounded-2xl shadow-lg shadow-blue-50/50 overflow-hidden">
            {/* Tabs */}
            {/* <div className="flex border-b border-white/50">
              <button
                className={`px-6 py-3 text-sm font-medium transition-all duration-200 ${activeTab === 'All Jobs' 
                  ? 'border-b-2 border-[#1e4ed8] text-[#1e4ed8]' 
                  : 'text-gray-600 hover:text-[#1e4ed8] hover:bg-white/30'}`}
                onClick={() => setActiveTab('All Jobs')}
              >
                All Jobs ({jobs.length || 0})
              </button>
              <button
                className={`px-6 py-3 text-sm font-medium transition-all duration-200 ${activeTab === 'Open' 
                  ? 'border-b-2 border-[#1e4ed8] text-[#1e4ed8]' 
                  : 'text-gray-600 hover:text-[#1e4ed8] hover:bg-white/30'}`}
                onClick={() => setActiveTab('Open')}
              >
                Open ({openJobsCount})
              </button>
              <button
                className={`px-6 py-3 text-sm font-medium transition-all duration-200 ${activeTab === 'Pending' 
                  ? 'border-b-2 border-[#1e4ed8] text-[#1e4ed8]' 
                  : 'text-gray-600 hover:text-[#1e4ed8] hover:bg-white/30'}`}
                onClick={() => setActiveTab('Pending')}
              >
                Pending ({pendingJobsCount})
              </button>
              <button
                className={`px-6 py-3 text-sm font-medium transition-all duration-200 ${activeTab === 'Closed' 
                  ? 'border-b-2 border-[#1e4ed8] text-[#1e4ed8]' 
                  : 'text-gray-600 hover:text-[#1e4ed8] hover:bg-white/30'}`}
                onClick={() => setActiveTab('Closed')}
              >
                Closed ({closedJobsCount})
              </button>
            </div> */}

            {/* Table - 5 Columns */}
<div className="bg-white/90 backdrop-blur-sm border border-gray-100 rounded-2xl shadow-lg overflow-hidden">
  {/* Table Header */}
  <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
    <div className="grid grid-cols-12 gap-4 text-xs font-medium text-gray-700 uppercase tracking-wider">
      <div className="col-span-3">Degree</div>
      <div className="col-span-2">Deadline</div>
      <div className="col-span-2 text-center">Views</div>
      <div className="col-span-2 text-center">New Applications</div>
      <div className="col-span-2 text-center">Actions</div>
    </div>
  </div>

  {/* Table Body */}
  <div className="divide-y divide-gray-100">
    {loading ? (
      <div className="p-12 text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#1e4ed8]"></div>
        <p className="mt-4 text-gray-600">Loading jobs...</p>
      </div>
    ) : error ? (
      <div className="p-12 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-red-100 to-red-50 mb-4">
          <AlertCircle className="h-8 w-8 text-red-500" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Error loading jobs</h3>
        <p className="text-red-500 font-medium">{error}</p>
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
      currentJobs.map(job => {
        const jobId = job._id || job.id;
        const jobDegree = Array.isArray(job.degree) ? job.degree.join(', ') : 'N/A';
        const jobLocation = job.venue || 'N/A';
        const jobStatus = job.jobStatus || 'Unknown';
        const targetStatus = jobStatus;
        const deadline = job?.proposedSchedule?.endDate || job.deadline;
        const views = job?.views ?? 0;
        const applications = job.applicationCount || job.applications || 0;
        
        const isViewDisabled = false;
        
        return (
          <div key={jobId} className="p-4 hover:bg-gray-50/50 transition-all duration-200">
            <div className="grid grid-cols-12 gap-4 items-center">
              {/* Degree Column - col-span-3 */}
              <div className="col-span-3">
                <div 
                  onClick={() => handleRowClick(jobId)}
                  className="group cursor-pointer"
                >
                  <h3 className="font-semibold text-gray-900 group-hover:text-[#1e4ed8] transition-colors line-clamp-2">
                    {jobDegree}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <MapPin className="h-3 w-3 text-gray-400" />
                    <span className="text-sm text-gray-500 line-clamp-1">{jobLocation}</span>
                  </div>
                </div>
              </div>
              
              {/* Deadline Column - col-span-3 */}
              <div className="col-span-2">
                <div className="flex items-center gap-2">
                  <Calendar className="h-3 w-3 text-gray-400" />
                  <span className="text-gray-700 text-sm">
                    {formatDate(deadline)}
                  </span>
                </div>
              </div>
              
              {/* Views Column - col-span-2 */}
              <div className="col-span-2 text-center">
                <div className="flex items-center justify-center">
                  <span className="inline-flex items-center justify-center w-8 h-8 bg-gradient-to-r from-blue-100 to-blue-50 text-[#143694] rounded-full text-sm font-medium">
                    {views}
                  </span>
                </div>
              </div>
              
              {/* New Applications Column - col-span-3 */}
              <div 
                className="col-span-2 text-center cursor-pointer group"
                onClick={(e) => handleApplicationsClick(jobId, targetStatus, e)}
              >
                <div className="flex items-center justify-center">
                  <span className="inline-flex items-center justify-center w-8 h-8 bg-gradient-to-r from-green-100 to-green-50 text-green-700 rounded-full text-sm font-medium group-hover:scale-110 transition-transform">
                    {applications}
                  </span>
                </div>
              </div>
              
              {/* Actions Column - col-span-1 */}
              <div className="col-span-2">
                <div className="flex items-center justify-center gap-2">
                  <button
                    onClick={(e) => { 
                      e.stopPropagation(); 
                      handleViewJob(jobId, targetStatus, e); 
                    }}
                    className={`p-2 bg-gradient-to-r from-gray-100 to-white border border-gray-200 rounded-lg transition-all duration-200 ${
                      isViewDisabled 
                        ? 'text-gray-300 cursor-not-allowed' 
                        : 'text-gray-600 hover:text-[#1e4ed8] hover:bg-gray-50 hover:border-[#1e4ed8]/50'
                    }`}
                    title={isViewDisabled ? "No applications to view" : "View Applicants"}
                    disabled={isViewDisabled}
                  >
                    {/* <Eye size={16} /> */}
                    viewed Applications
                  </button>
                  <button 
                    onClick={(e) => handleDelete(jobId, e)} 
                    className={`p-2 bg-gradient-to-r from-red-100 to-red-50 border border-red-200 rounded-lg transition-all duration-200 ${
                      deletingJobId === jobId 
                        ? 'opacity-50 cursor-not-allowed' 
                        : 'text-red-600 hover:text-red-700 hover:bg-red-50 hover:border-red-300'
                    }`}
                    title="Inactive Job"
                    disabled={deletingJobId === jobId}
                  >
                    {deletingJobId === jobId ? (
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-solid border-[#1e4ed8] border-r-transparent"></div>
                    ) : (
                      <Ban size={16} />
                    )}
                  </button>
                  <button
  onClick={(e) => handlePermanentDelete(jobId, e)}
  className={`p-2 bg-gradient-to-r from-red-100 to-red-50 border border-red-200 rounded-lg transition-all duration-200 ${
    deletingJobId === jobId
      ? 'opacity-50 cursor-not-allowed'
      : 'text-red-600 hover:text-red-700 hover:bg-red-50 hover:border-red-300'
  }`}
  title="Permanently Delete Job"
  disabled={deletingJobId === jobId}
>
  <Trash2 size={16} />
</button>
                </div>
              </div>
            </div>
          </div>
        );
      })
    )}
  </div>
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
                        ? 'bg-gradient-to-r from-[#143694] to-[#1e4ed8] text-white shadow-md shadow-[#143694]/30'
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