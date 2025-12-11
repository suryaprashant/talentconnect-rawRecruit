import { useState, useEffect } from 'react';
import {
    Search, Eye, ChevronLeft, ChevronRight, Trash, 
    Building2, MapPin, Calendar, Briefcase, AlertCircle
} from 'lucide-react';
import ApplicantDetails from './ApplicantDetails';
import { deleteJobById, getPostedJobs } from '@/lib/Company_AxiosInstance';

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
            const response = await getPostedJobs("Job-listing");
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

    // Filter jobs based on search query
    const filteredJobs = jobs?.filter(job => {
        const matchesSearch = job.jobTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
            job.workMode.toLowerCase().includes(searchQuery.toLowerCase()) ||
            job.venue.toLowerCase().includes(searchQuery.toLowerCase());

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
    const handleView = (jobId) => {
        const job = jobs.find(j => j._id === jobId);
        if (job) {
            setSelectedJob(job);
            setShowJobDetail(true);
        }
    };

    const handleEdit = (jobId) => {
        console.log(`Edit job with ID: ${jobId}`);
    };

    const handleApplications = (jobId) => {
        console.log(`View applications for job ID: ${jobId}`);
    };

    const handleExport = (jobId) => {
        console.log(`Export job with ID: ${jobId}`);
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
            />
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#667eea]/10 via-[#f093fb]/5 to-[#764ba2]/10">
            <div className="max-w-7xl mx-auto p-4 py-8">
                {/* Header Section */}
                <div className="bg-white/90 backdrop-blur-sm border border-gray-100 rounded-2xl shadow-lg p-6 mb-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                        <div className="mb-4 md:mb-0">
                            <div className="flex items-center mb-2">
                                <div className="p-2 bg-gradient-to-br from-[#667eea]/20 to-[#764ba2]/20 rounded-lg mr-3">
                                    <Building2 className="h-5 w-5 text-[#667eea]" />
                                </div>
                                <h1 className="text-2xl font-bold bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent">
                                    Accepted Job-listing Applications
                                </h1>
                            </div>
                            <p className="text-gray-600">
                                Track Your Job Listings and Streamline Accepted Candidate Applications
                            </p>
                        </div>
                        
                        {/* Search Bar */}
                        <div className="relative w-full md:w-96">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search className="h-4 w-4 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                className="w-full pl-10 pr-4 py-2.5 bg-gradient-to-r from-gray-50 to-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#667eea]/50 focus:border-transparent focus:outline-none transition-all duration-200"
                                placeholder="Search by job title, work mode, or venue"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                {/* Jobs Table */}
                <div className="bg-white/90 backdrop-blur-sm border border-gray-100 rounded-2xl shadow-lg overflow-hidden">
                    {/* Tabs */}
                    <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                        <button
                            className={`inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-gray-100 to-white border border-gray-200 text-gray-700 rounded-lg font-medium`}
                        >
                            All Jobs <span className="inline-flex items-center justify-center w-6 h-6 bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white rounded-full text-xs ml-1">{jobs?.length || 0}</span>
                        </button>
                    </div>

                    {/* Table Header */}
                    <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                        <div className="grid grid-cols-12 gap-4 text-xs font-medium text-gray-700 uppercase tracking-wider">
                            <div className="col-span-5">Job Title</div>
                            <div className="col-span-2">Status</div>
                            <div className="col-span-2">Deadline</div>
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
                                <div 
                                    key={job._id} 
                                    className="p-4 hover:bg-gray-50/50 transition-all duration-200 cursor-pointer"
                                    onClick={() => handleView(job._id)}
                                >
                                    <div className="grid grid-cols-12 gap-4 items-center">
                                        {/* Job Title */}
                                        <div className="col-span-5">
                                            <div className="group">
                                                <h3 className="font-semibold text-gray-900 group-hover:text-[#667eea] transition-colors line-clamp-1">
                                                    {job?.jobTitle}
                                                </h3>
                                                <div className="flex items-center gap-3 mt-1">
                                                    <span className="inline-flex items-center text-sm text-gray-500">
                                                        <Briefcase className="h-3 w-3 mr-1.5" />
                                                        {job?.workMode}
                                                    </span>
                                                    <span className="inline-flex items-center text-sm text-gray-500">
                                                        <MapPin className="h-3 w-3 mr-1.5" />
                                                        {job?.location?.[0] || 'N/A'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Status */}
                                        <div className="col-span-2">
                                            <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium ${job?.status === 'Published'
                                                ? 'bg-gradient-to-r from-green-100 to-green-50 text-green-700 border border-green-200'
                                                : 'bg-gradient-to-r from-gray-100 to-gray-50 text-gray-700 border border-gray-200'
                                                }`}>
                                                {job?.status || 'N/A'}
                                            </span>
                                        </div>

                                        {/* Deadline */}
                                        <div className="col-span-2">
                                            <div className="flex items-center gap-2">
                                                <Calendar className="h-3 w-3 text-gray-400" />
                                                <span className="text-gray-700 text-sm">
                                                    {job?.endDate ? new Date(job?.endDate).toUTCString().slice(0, 16) : 'N/A'}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="col-span-3" onClick={(e) => e.stopPropagation()}>
                                            <div className="flex items-center justify-center gap-2">
                                                <button 
                                                    onClick={() => handleView(job._id)}
                                                    className="p-2 bg-gradient-to-r from-gray-100 to-white border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 hover:text-[#667eea] hover:border-[#667eea]/50 transition-all duration-200"
                                                    title="View Job"
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
                                    Showing <span className="font-semibold text-[#667eea]">{startIndex + 1}</span>-<span className="font-semibold">{Math.min(endIndex, filteredJobs?.length)}</span> of <span className="font-semibold">{filteredJobs?.length}</span>
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
                                disabled={currentPage === totalPages}
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