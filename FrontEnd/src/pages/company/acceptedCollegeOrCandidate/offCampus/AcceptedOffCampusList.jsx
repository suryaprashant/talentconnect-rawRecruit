import { useState, useEffect } from 'react';
import {
    Eye, ChevronLeft, ChevronRight, Trash, Building2,
    MapPin, Calendar, FileText, AlertCircle, Briefcase
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
    const [error, setError] = useState(null);
    const [applications, setApplications] = useState([]);
    const [applicationsLoading, setApplicationsLoading] = useState(false);
    const [applicationsError, setApplicationsError] = useState(null);

    const navigate = useNavigate();

    const itemsPerPage = 10;
    const totalItems = jobs?.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;

    const fetchJobs = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await getPostedJobs("Off-campus", "Accepted");
            setJobs(response?.data);
        } catch (error) {
            console.error("Error fetching jobs:", error);
            setError(error.response?.data?.message || error.message || "Failed to fetch jobs.");
            setJobs([]);
        } finally {
            setLoading(false);
        }
    };

    const fetchApplicationsForJob = async (jobId, isVisited) => {
        setApplicationsLoading(true);
        setApplicationsError(null);

        try {
            const res = await getOffCampusApplicationsForJob(
                jobId,
                "Off-campus",
                "Accepted",
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
        const searchLower = searchQuery.toLowerCase();

        // Check job roles
        const jobRolesMatch = Array.isArray(job.jobRoles)
            ? job.jobRoles.some(role => role?.toLowerCase().includes(searchLower))
            : false;

        // Check work locations
        const workLocations = job.location || [];
        const workLocationsMatch = Array.isArray(workLocations)
            ? workLocations.some(location => location?.toLowerCase().includes(searchLower))
            : false;

        return (
            jobRolesMatch ||
            workLocationsMatch ||
            (job._id?.toLowerCase().includes(searchLower)) ||
            (job.workMode?.toLowerCase().includes(searchLower)) ||
            (job.venue?.toLowerCase().includes(searchLower))
        );
    }) || [];

    // Current page data
    const currentJobs = filteredJobs.slice(startIndex, startIndex + itemsPerPage);

    // Action handlers
    const handleView = async (job) => {
      try {
        await markApplicationsVisited(job._id, "Off-campus", "Accepted");
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
                await deleteJobById(jobId);
                fetchJobs();
                alert(`Job with Id: ${jobId} deleted`);
            }
        } catch (error) {
            console.log("Error: ", error);
        }
    };

    const onClose = () => {
        setShowJobDetail(false);
        setIsVisited('');
        fetchJobs();
    }

    // Display helper functions
    const displayWorkLocations = (job) => {
        const workLocations = job.location || [];
        if (!workLocations || workLocations.length === 0) return 'N/A';
        return Array.isArray(workLocations) ? workLocations.join(', ') : String(workLocations);
    };

    const displayJobRoles = (job) => {
        const jobRoles = job.jobRoles || [];
        if (!jobRoles || jobRoles.length === 0) return 'N/A';
        return Array.isArray(jobRoles) ? jobRoles.join(', ') : String(jobRoles);
    };

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
                onAccept={() => console.log(`Accept drive for job ID: ${selectedJob._id}`)}
                onShortlist={() => console.log(`Shortlist drive for job ID: ${selectedJob._id}`)}
                onReject={() => console.log(`Reject drive for job ID: ${selectedJob._id}`)}
            />
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#667eea]/10 via-[#f093fb]/5 to-[#764ba2]/10">
            <div className="container mx-auto px-4 pt-8">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 px-6 py-5 mb-6">

                    {/* Header */}
                    <div className="flex items-center gap-3 mb-4">
                    <h2 className="text-2xl md:text-[26px] font-semibold text-[#143694] tracking-tight">
                        Accepted Colleges / Candidates
                    </h2>

                    <span className="flex items-center justify-center w-7 h-7 bg-[#143694] text-white text-xs font-bold rounded-full">
                        {jobs?.length || 0}
                    </span>
                    </div>

                    {/* Tabs */}
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2  border-gray-200 pb-2">

                    <button 
                        onClick={() => navigate('/accepted/on-campus-listings')}
                        className="px-3 py-2 text-gray-500 hover:text-[#143694] hover:bg-gray-100 rounded-md font-medium text-sm transition-all"
                    >
                        On-Campus
                    </button>
                    
                    <button 
                        onClick={() => navigate('/accepted/pool-campus-listings')}
                        className="px-3 py-2 text-gray-500 hover:text-[#143694] hover:bg-gray-100 rounded-md font-medium text-sm transition-all"
                    >
                        Pool Campus
                    </button>
                    {/* Active */}
                    <button 
                        className="px-6 py-2 bg-[#143694] text-white rounded-full font-medium text-sm shadow-sm"
                    >
                        Off-Campus
                    </button>
                    <button 
                        onClick={() => navigate('/accepted/internship-listings')}
                        className="px-3 py-2 text-gray-500 hover:text-[#143694] hover:bg-gray-100 rounded-md font-medium text-sm transition-all"
                    >
                        Internship
                    </button>

                    </div>

                </div>
            </div>
    {/* --- END OF NAVIGATION HEADER --- */}
            <div className="container mx-auto px-4 py-8 pt-22">
                {/* Header Section */}
                <div className="bg-white/90 backdrop-blur-sm border border-gray-100 rounded-2xl shadow-lg p-6 mb-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                        <div className="mb-4 md:mb-0">
                            <div className="flex items-center mb-2">
                                <div className="p-2 bg-gradient-to-br from-[#667eea]/20 to-[#764ba2]/20 rounded-lg mr-3">
                                    <Building2 className="h-5 w-5 text-[#667eea]" />
                                </div>
                                <h1 className="text-2xl font-bold bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent">
                                    Accepted Off-Campus Drives
                                </h1>
                            </div>
                            <p className="text-gray-600">
                                Track Your Accepted Off-Campus Drives and Candidate Applications
                            </p>
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
                    {/* Table Header - 6 Columns matching On-Campus layout */}
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
                                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#667eea]"></div>
                                <p className="mt-4 text-gray-600">Loading drives...</p>
                            </div>
                        ) : currentJobs.length === 0 ? (
                            <div className="p-12 text-center">
                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-gray-100 to-gray-200 mb-4">
                                    <FileText className="h-8 w-8 text-gray-400" />
                                </div>
                                <h3 className="text-lg font-medium text-gray-900 mb-2">No drives found</h3>
                                <p className="text-gray-600">No drives match your search criteria.</p>
                            </div>
                        ) : (
                            currentJobs.map(job => (
                                <div key={job._id} className="p-4 hover:bg-gray-50/50 transition-all duration-200">
                                    <div className="grid grid-cols-12 gap-4 items-center">
                                        {/* Job Roles - col-span-3 */}
<div className="col-span-3">
  <div 
    onClick={() => navigate(`/company-dashboard/Off-campus/${job._id}?isApplied=true`)}
    className="group cursor-pointer"
  >
    <h3 className="font-semibold text-gray-900 group-hover:text-[#667eea] transition-colors">
      {displayJobRoles(job)}
    </h3>
    <div className="flex items-center gap-2 mt-1">
      <Briefcase className="h-3 w-3 text-gray-400" />
      <span className="text-sm text-gray-500 capitalize">
        {job.workMode || 'N/A'} • {job.venue || 'N/A'}
      </span>
    </div>
  </div>
</div>

                                        {/* Work Locations - col-span-3 */}
                                        <div className="col-span-2">
                                            <div className="flex items-center gap-2">
                                                <MapPin className="h-3 w-3 text-gray-400 flex-shrink-0" />
                                                <span className="text-gray-700 text-sm truncate capitalize">
                                                    {displayWorkLocations(job)}
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
                                            <span className="inline-flex items-center justify-center w-8 h-8 bg-gradient-to-r from-blue-100 to-blue-50 text-blue-700 rounded-full text-sm font-medium">
                                                {job?.views || 0}
                                            </span>
                                        </div>

                                        {/* New Applications - col-span-1 */}
                                        <div 
                                            className="col-span-3 text-center cursor-pointer group"
                                            onClick={() => showNewApplication(job)}
                                        >
                                            <span className="inline-flex items-center justify-center w-8 h-8 bg-gradient-to-r from-green-100 to-green-50 text-green-700 rounded-full text-sm font-medium group-hover:scale-110 transition-transform">
                                                {job?.applicationCount || 0}
                                            </span>
                                        </div>

                                        {/* Actions - col-span-2 */}
                                        <div className="col-span-1">
                                            <div className="flex items-center justify-center gap-2">
                                                <button
                                                    onClick={() => handleView(job)}
                                                    className="p-2 bg-gradient-to-r from-gray-100 to-white border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 hover:text-[#667eea] hover:border-[#667eea]/50 transition-all duration-200"
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

                    {/* Pagination - Simple Version */}
                    {totalPages > 1 && (
                        <div className="flex justify-center items-center gap-4 p-4 border-t border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                            <button
                                onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                                disabled={currentPage === 1}
                                className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-gray-100 to-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                            >
                                <ChevronLeft size={16} />
                                Prev
                            </button>
                            
                            <div className="text-sm text-gray-600">
                                Page <span className="font-semibold text-[#667eea]">{currentPage}</span> of <span className="font-semibold">{totalPages}</span>
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
}