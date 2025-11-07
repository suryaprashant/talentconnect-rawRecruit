import { useState, useEffect } from 'react';
import {
    Search, Eye, Edit, Users, FileText, Trash,
    ChevronLeft, ChevronRight, Filter
} from 'lucide-react';
import ApplicantDetails from './ApplicantDetails';
import { deleteJobById, getPostedJobs } from '@/lib/Company_AxiosInstance';
import { Link } from 'react-router-dom';

export default function OffCampusJobManagement() {
    // State variables
    const [jobs, setJobs] = useState();
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [selectedJob, setSelectedJob] = useState(null);
    const [showJobDetail, setShowJobDetail] = useState(false);

    const itemsPerPage = 5;
    const totalItems = jobs?.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, totalItems);

    const fetchJobs = async () => {
        try {
            const response = await getPostedJobs("Job-listing", "Shortlisted");
            console.log(response.data.response);
            setJobs(response?.data);

        } catch (error) {
            console.error("Error fetching jobs:", error);
            setLoading(false);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchJobs();
    }, []);

    // Filter jobs based on search query and active tab
    const filteredJobs = jobs?.filter(job => {
        const matchesSearch = job.jobTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
            job.workMode.toLowerCase().includes(searchQuery.toLowerCase()) ||
            job.venue.toLowerCase().includes(searchQuery.toLowerCase());

        // if (activeTab === 'All Jobs') {
        //     return matchesSearch;
        // } else if (activeTab === 'Published') {
        //     return matchesSearch && job.status === 'Published';
        // } else if (activeTab === 'Drafts') {
        //     return matchesSearch && job.status === 'Draft';
        // }

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

    // Action handlers - these would connect to your backend API
    const handleView = (jobId) => {
        const job = jobs.find(j => j._id === jobId);
        if (job) {
            setSelectedJob(job);
            setShowJobDetail(true);
        }
    };

    const handleEdit = (jobId) => {
        console.log(`Edit job with ID: ${jobId}`);
        // In a real app: navigate to edit page or open edit modal
    };

    const handleApplications = (jobId) => {
        console.log(`View applications for job ID: ${jobId}`);
        // In a real app: navigate to applications page
    };

    const handleExport = (jobId) => {
        console.log(`Export job with ID: ${jobId}`);
        // In a real app: trigger API call to export job data
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

    // If showing job detail, render the detail view
    if (showJobDetail && selectedJob) {
        return (
            <ApplicantDetails
                job={selectedJob}
                onClose={() => setShowJobDetail(false)}
            // onAccept={() => handleAcceptDrive(selectedJob._id)}
            // onShortlist={() => handleShortlistDrive(selectedJob._id)}
            // onReject={() => handleRejectDrive(selectedJob._id)}
            />
        );
    }

    return (
        <div className="min-h-screen bg-white">
            <div className="max-w-7xl mx-auto p-4 bg-white">
                <div className="flex justify-between items-center mt-10 mb-4">
                    <div>
                        <h1 className="text-3xl font-bold">Shortlisted Job-listing Applications</h1>
                        <p className="text-gray-600 mt-2">Track Your Job Listings and Streamline Shortlisted Candidate Applications</p>
                    </div>
                    {/* <button className="bg-black text-white px-4 py-2 rounded-md">
            Post a Job
          </button> */}
                </div>

                <div className="border rounded-md mt-10">
                    {/* Tabs */}
                    <div className="flex border-b">
                        <button
                            className={`px-4 py-2 border-b-2 border-black font-medium`}
                        >
                            All Jobs ({jobs?.length})
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
                                placeholder="Search by name or email"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        <button
                            className="flex items-center gap-2 px-4 py-2 border rounded-md"
                            onClick={() => setShowFilters(!showFilters)}
                        >
                            <Filter className="w-4 h-4" />
                            Filters
                        </button>

                        <div className="ml-auto text-sm text-gray-500">
                            Showing {startIndex + 1}-{Math.min(endIndex, filteredJobs?.length)} of {filteredJobs?.length}
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
                                    {/* <th className="px-4 py-3 text-left">Views</th> */}
                                    <th className="px-4 py-3 text-left">Applications</th>
                                    <th className="px-4 py-3 text-left">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan="6" className="text-center py-4">
                                            <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-solid border-black border-r-transparent"></div>
                                            <p className="mt-2">Loading jobs...</p>
                                        </td>
                                    </tr>
                                ) : currentJobs?.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="text-center py-4 text-gray-500">
                                            No jobs found matching your criteria.
                                        </td>
                                    </tr>
                                ) : (
                                    currentJobs?.map(job => (
                                        <tr
                                            key={job._id}
                                            className="border-b hover:bg-gray-50 cursor-pointer"
                                            onClick={() => handleView(job._id)}
                                        >
                                            <td className="px-4 py-3">
                                                <div className="font-medium">{job?.jobTitle}</div>
                                                <div className="text-sm text-gray-500">
                                                    {job?.workMode} • {job?.location[0]}
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className={`px-2 py-1 text-xs rounded-full ${job?.status === 'Published'
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-gray-100 text-gray-800'
                                                    }`}>
                                                    {job?.status}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3">{new Date(job?.endDate).toUTCString().slice(0, 16)}</td>
                                            {/* <td className="px-4 py-3">{job.views}</td> */}
                                            <td className="px-4 py-3">{job?.applicationCount}</td>
                                            <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                                                <div className="flex gap-2">
                                                    <button onClick={() => handleView(job._id)} className="text-gray-500 hover:text-gray-700" title="View Job">
                                                        <Eye size={18} />
                                                    </button>
                                                    <Link
                                                        to={`/company-dashboard/Job-listing/${job._id}?isApplied=true`}
                                                        disabled={job.applicationCount === 0}
                                                        className="text-gray-500 hover:text-blue-600 p-1 rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                                        title="View Job Description"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-file-search-corner-icon lucide-file-search-corner"><path d="M11.1 22H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.706.706l3.589 3.588A2.4 2.4 0 0 1 20 8v3.25" /><path d="M14 2v5a1 1 0 0 0 1 1h5" /><path d="m21 22-2.88-2.88" /><circle cx="16" cy="17" r="3" /></svg>
                                                    </Link>
                                                    {/* <button onClick={() => handleEdit(job._id)} className="text-gray-500 hover:text-gray-700" title="Edit Job">
                            <Edit size={18} />
                          </button>
                          <button onClick={() => handleApplications(job._id)} className="text-gray-500 hover:text-gray-700" title="View Applications">
                            <Users size={18} />
                          </button>
                          <button onClick={() => handleExport(job._id)} className="text-gray-500 hover:text-gray-700" title="Export Job Data">
                            <FileText size={18} />
                          </button> */}
                                                    <button onClick={() => handleDelete(job._id)} className="text-gray-500 hover:text-gray-700" title="Delete Job">
                                                        <Trash size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="flex items-center justify-between p-4">
                        <button
                            onClick={handlePrevPage}
                            disabled={currentPage === 1}
                            className="flex items-center gap-1 px-4 py-2 border rounded-md disabled:opacity-50"
                        >
                            <ChevronLeft size={16} />
                            Prev
                        </button>

                        <div className="flex gap-2">
                            {Array.from({ length: totalPages }, (_, i) => i + 1)?.map(page => (
                                <button
                                    key={page}
                                    onClick={() => handlePageClick(page)}
                                    className={`w-8 h-8 flex items-center justify-center rounded-md ${currentPage === page
                                        ? 'bg-black text-white'
                                        : 'border hover:bg-gray-50'
                                        }`}
                                >
                                    {page}
                                </button>
                            ))}
                        </div>

                        <button
                            onClick={handleNextPage}
                            disabled={currentPage === totalPages}
                            className="flex items-center gap-1 px-4 py-2 border rounded-md disabled:opacity-50"
                        >
                            Next
                            <ChevronRight size={16} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}