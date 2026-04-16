import { useState, useEffect } from 'react';
import {
    Search, Eye, ChevronLeft, ChevronRight, Trash, 
    Building2, MapPin, Calendar, Briefcase, AlertCircle, FileText
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
    const [selectedJob, setSelectedJob] = useState(null);
    const [showJobDetail, setShowJobDetail] = useState(false);

    const itemsPerPage = 5;
    const totalItems = jobs?.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, totalItems);

    const fetchJobs = async () => {
        try {
            const response = await getPostedJobs("Off-campus", "Accepted");
            console.log("Fetched jobs:", response?.data); // Debug
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
        const matchesSearch = job.jobRoles[0].toLowerCase().includes(searchQuery.toLowerCase()) ||
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

    // Action handlers - MODIFIED: Separate functions for applications count and Eye icon
    const handleViewApplicants = (job) => {
        console.log("handleViewApplicants called for job:", job); // Debug
        console.log("Application count:", job?.applicationCount); // Debug
        
        if (!job?.applicationCount || job.applicationCount === 0) {
            alert("No applicants have applied for this job yet.");
            return;
        }
        setSelectedJob(job);
        setShowJobDetail(true);
    };

    const handleViewJob = (job) => {
        console.log("handleViewJob called for job:", job); // Debug
        console.log("Application count:", job?.applicationCount); // Debug
        
        // Eye icon should always open detail page, even if no applicants
        setSelectedJob(job);
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

    // If showing job detail, render the detail view
    if (showJobDetail && selectedJob) {
        return (
            <ApplicantDetails
                job={selectedJob}
                onClose={() => setShowJobDetail(false)}
                onAccept={() => handleAcceptDrive(selectedJob._id)}
                onShortlist={() => handleShortlistDrive(selectedJob._id)}
                onReject={() => handleRejectDrive(selectedJob._id)}
            />
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#143694]/10 via-[#f093fb]/5 to-[#1e4ed8]/10">
            <div className="max-w-7xl mx-auto p-4 py-8">
                {/* Header Section */}
                <div className="bg-white/90 backdrop-blur-sm border border-gray-100 rounded-2xl shadow-lg p-6 mb-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                        <div className="mb-4 md:mb-0">
                            <div className="flex items-center mb-2">
                                <div className="p-2 bg-gradient-to-br from-[#143694]/20 to-[#1e4ed8]/20 rounded-lg mr-3">
                                    <Building2 className="h-5 w-5 text-[#143694]" />
                                </div>
                                <h1 className="text-2xl font-bold bg-gradient-to-r from-[#143694] to-[#1e4ed8] bg-clip-text text-transparent">
                                    Accepted Off-Campus Applications
                                </h1>
                            </div>
                            <p className="text-gray-600">
                                Track Your Off-Campus and Streamline Shortlisted Candidate Applications
                            </p>
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

                {/* Jobs Table */}
                <div className="bg-white/90 backdrop-blur-sm border border-gray-100 rounded-2xl shadow-lg overflow-hidden">
                    {/* Table Header */}
                    <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                        <div className="grid grid-cols-12 gap-4 text-xs font-medium text-gray-700 uppercase tracking-wider">
                            <div className="col-span-3">Job Title</div>
                            <div className="col-span-2">Work Locations</div>
                            <div className="col-span-2">Deadline</div>
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
                                <div 
                                    key={job._id} 
                                    className="p-4 hover:bg-gray-50/50 transition-all duration-200"
                                >
                                    <div className="grid grid-cols-12 gap-4 items-center">
                                        {/* Job Title - Clickable Link for Job Preview */}
<div className="col-span-3">
  <Link
    to={`/company-dashboard/Off-campus/${job._id}?isApplied=true`}
    className="group cursor-pointer block"
  >
    <h3 className="font-semibold text-gray-900 group-hover:text-[#143694] transition-colors line-clamp-1">
      {Array.isArray(job?.jobRoles) 
        ? job.jobRoles.join(', ') 
        : job?.jobRoles?.[0] || 'N/A'
      }
    </h3>
    <div className="flex items-center gap-3 mt-1">
      <span className="inline-flex items-center text-sm text-gray-500">
        <Briefcase className="h-3 w-3 mr-1.5" />
        {job?.workMode}
      </span>
    </div>
  </Link>
</div>

                                        {/* Work locations */}
                                        <div className="col-span-2">
                                            <span className="inline-flex items-center text-sm text-gray-500">
                                                        <MapPin className="h-3 w-3 mr-1.5" />
                                                        {job?.location[0]}
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

                                        {/* Applications - Clickable to View Applicants */}
                                        <div 
                                            className="col-span-3 text-center cursor-pointer group"
                                            onClick={() => handleViewApplicants(job)}
                                            title="View Applicant Applications"
                                        >
                                            <div className="inline-flex items-center justify-center w-8 h-8 text-sm font-medium rounded-full transition-all duration-200 bg-gradient-to-r from-blue-100 to-blue-50 text-[#143694] hover:bg-gradient-to-r hover:from-blue-200 hover:to-blue-100 hover:shadow-md hover:shadow-blue-100 group-hover:scale-110">
                                                {job?.applicationCount || 0}
                                            </div>
                                        </div>

                                        {/* Actions - Only Eye and Trash buttons */}
                                        <div className="col-span-2">
                                            <div className="flex items-center justify-center gap-2">
                                                <button 
                                                    onClick={() => handleViewJob(job)}
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
                                    Showing <span className="font-semibold text-[#143694]">{startIndex + 1}</span>-<span className="font-semibold">{Math.min(endIndex, filteredJobs?.length)}</span> of <span className="font-semibold">{filteredJobs?.length}</span>
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