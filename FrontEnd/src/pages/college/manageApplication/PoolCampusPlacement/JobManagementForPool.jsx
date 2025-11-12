import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useJobs } from '@/context/College/JobManagement/JobContext';
import {
    Search, Eye, Trash,
    ChevronLeft, ChevronRight, Filter
} from 'lucide-react';
import { getCollegePostedJobs } from '@/lib/College_AxiosIntance';

function JobManagementApplication() {
    const navigate = useNavigate();
    const pathParts = useLocation().pathname.split('/').filter(Boolean); // remove empty strings
    const lastSegment = pathParts[pathParts.length - 1];

    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState('All Jobs');
    const [showFilters, setShowFilters] = useState(false);

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

    // Fetch jobs from backend when the component mounts
    useEffect(() => {
        const fetchJobs = async () => {
            try {
                setLoading(true);
                setError(null);

                // Fetching 'Pool-campus' jobs as requested
                const response = await getCollegePostedJobs('Pool-campus', lastSegment);

                if (response.data && response.data.response && Array.isArray(response.data.response)) {
                    // Process jobs to update their status based on dates
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

        fetchJobs();
    }, [lastSegment]);

    // Set up interval to check and update job statuses periodically
    useEffect(() => {
        const intervalId = setInterval(() => {
            setJobs(prevJobs => processJobsWithStatus(prevJobs));
        }, 60000); // Check every minute

        return () => clearInterval(intervalId);
    }, []);

    const itemsPerPage = 5;

    // Memoized filtering logic to avoid re-calculating on every render
    const filteredJobs = useMemo(() => {
        if (!jobs || !Array.isArray(jobs)) return [];

        return jobs.filter(job => {
            const jobTitle = job.jobTitle || '';
            const degree = Array.isArray(job.degree) ? job.degree.join(', ') : '';
            const location = Array.isArray(job.location) ? job.location.join(', ') : job.location || '';

            // Comprehensive search across multiple fields
            const matchesSearch =
                jobTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
                degree.toLowerCase().includes(searchQuery.toLowerCase()) ||
                location.toLowerCase().includes(searchQuery.toLowerCase());

            const status = job.jobStatus || '';

            // Filter based on the active tab
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

    // Action handlers
    const handleView = (jobId) => {
        navigate(`/manage-application/PoolCampus-placement/${jobId}`);
    };

    const handleEdit = (jobId, e) => {
        e.stopPropagation();
        console.log(`Edit job with ID: ${jobId}`);
    };

    const handleApplications = (jobId, e) => {
        e.stopPropagation();
        console.log(`View applications for job ID: ${jobId}`);
    };

    const handleExport = (jobId, e) => {
        e.stopPropagation();
        console.log(`Export job with ID: ${jobId}`);
    };

    const handleDelete = (jobId, e) => {
        e.stopPropagation();
        console.log(`Delete job with ID: ${jobId}`);
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

    return (
        <div className="min-h-screen bg-white">
            <div className="max-w-7xl mx-auto p-4 bg-white">
                <div className="flex justify-between items-center mt-10 mb-4">
                    <div>
                        <h1 className="text-3xl font-bold">Manage Pool-Campus Applications</h1>
                        <p className="text-gray-600 mt-2">Track Your Job Listings and Streamline Candidate Applications</p>
                    </div>
                    <button className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition-colors">
                        Post a Job
                    </button>
                </div>

                <div className="border rounded-md mt-10">
                    {/* Tabs */}
                    <div className="flex border-b">
                        <button
                            className={`px-4 py-2 ${activeTab === 'All Jobs' ? 'border-b-2 border-black font-medium' : ''}`}
                            onClick={() => setActiveTab('All Jobs')}
                        >
                            All Jobs ({jobs.length || 0})
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
                                placeholder="Search by title, degree, location..."
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

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-white">
                                <tr className="border-b">
                                    <th className="px-4 py-3 text-left">Job Title</th>
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
                                            <p className="mt-2">Loading jobs...</p>
                                        </td>
                                    </tr>
                                ) : error ? (
                                    <tr>
                                        <td colSpan={6} className="text-center py-4 text-red-500">{error}</td>
                                    </tr>
                                ) : currentJobs.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="text-center py-4 text-gray-500">
                                            No jobs found matching your criteria.
                                        </td>
                                    </tr>
                                ) : (
                                    currentJobs.map(job => {
                                        const jobId = job._id || job.id;
                                        // const jobTitle = job.jobTitle || 'Untitled Job';
                                        const jobDegree = Array.isArray(job.degree) ? job.degree.join(', ') : '';
                                        const jobLocation = Array.isArray(job.location) ? job.location.join(', ') : job.location || 'N/A';
                                        const jobStatus = job.jobStatus || 'Unknown';
                                        const deadline = job.endDate || job.deadline;
                                        const views = job.views || 0;
                                        const applications = job.applicationCount || job.applications || 0;

                                        return (
                                            <tr
                                                key={jobId}
                                                className="border-b hover:bg-gray-50 cursor-pointer transition-colors"
                                                onClick={() => handleView(jobId)}
                                            >
                                                <td className="px-4 py-3">
                                                    <div className="font-medium">{jobDegree}</div>

                                                    <div className="text-sm text-gray-500">{jobLocation}</div>
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
                                                <td className="px-4 py-3">{applications}</td>
                                                <td className="px-4 py-3">
                                                    <div className="flex gap-2">
                                                        <button onClick={(e) => { e.stopPropagation(); handleView(jobId); }} className="text-gray-500 hover:text-gray-700 transition-colors" title="View Job"><Eye size={18} /></button>
                                                        <Link
                                                            to={`/college-dashboard/preview/Pool-campus/${job._id}?isApplied=true`}
                                                            disabled={job.applicationCount === 0}
                                                            className="text-gray-500 hover:text-blue-600 p-1 rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                                            title="View Job Description"
                                                            onClick={e => e.stopPropagation()}
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-file-search-corner-icon lucide-file-search-corner"><path d="M11.1 22H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.706.706l3.589 3.588A2.4 2.4 0 0 1 20 8v3.25" /><path d="M14 2v5a1 1 0 0 0 1 1h5" /><path d="m21 22-2.88-2.88" /><circle cx="16" cy="17" r="3" /></svg>
                                                        </Link>
                                                        {/* <button onClick={(e) => handleEdit(jobId, e)} className="text-gray-500 hover:text-gray-700 transition-colors" title="Edit Job"><Edit size={18} /></button>
                                                        <button onClick={(e) => handleApplications(jobId, e)} className="text-gray-500 hover:text-gray-700 transition-colors" title="View Applications"><Users size={18} /></button>
                                                        <button onClick={(e) => handleExport(jobId, e)} className="text-gray-500 hover:text-gray-700 transition-colors" title="Export Job Data"><FileText size={18} /></button> */}
                                                        <button onClick={(e) => handleDelete(jobId, e)} className="text-gray-500 hover:text-gray-700 transition-colors" title="Delete Job"><Trash size={18} /></button>
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

export default JobManagementApplication;