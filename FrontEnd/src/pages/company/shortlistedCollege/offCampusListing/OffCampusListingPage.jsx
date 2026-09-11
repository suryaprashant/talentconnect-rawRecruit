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
            {/* <div className="container mx-auto px-4 pt-8">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 px-6 py-5 mb-0">
                {/* Header 
                <div className="flex items-center gap-3 mb-4">
                    <h2 className="text-2xl md:text-[26px] font-semibold text-[#143694] tracking-tight">
                    Shortlisted Colleges / Candidates
                    </h2>

                    <span className="flex items-center justify-center w-7 h-7 bg-[#143694] text-white text-xs font-bold rounded-full">
                    {jobs?.length || 0}
                    </span>
                </div>
                </div>
            </div> */}
            <div className="container mx-auto px-4 py-8 pt-22">
                {/* Header Section */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 px-6 py-6 mt-1 mb-8">

  {/* HEADER */}
  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">

    <div>

      <div className="flex items-center gap-3 mb-2">
        
        <div className="p-2 bg-[#143694]/10 rounded-lg">
          <Building2 className="h-5 w-5 text-[#143694]" />
        </div>

        <h1 className="text-xl md:text-2xl font-semibold text-[#143694] tracking-tight leading-snug">
          Shortlisted Off-Campus Drives
        </h1>

      </div>

      <p className="text-gray-600 text-sm md:text-base">
        Track your shortlisted off-campus drives and candidate applications.
      </p>
                        {/* Tabs */}
                <div className="flex flex-wrap items-center gap-x-6 gap-y-2  border-gray-200 pt-3">
                    
                    {/* Others */}
                    <button 
                    onClick={() => navigate('/shortlisted/on-campus-listings')}
                    className="px-3 py-2 text-gray-500 hover:text-[#143694] hover:bg-gray-100 rounded-md font-medium text-sm transition-all"
                    >
                    On-Campus
                    </button>

                    <button 
                    onClick={() => navigate('/shortlisted/pool-campus-listings')}
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
                    onClick={() => navigate('/shortlisted/internship-listings')}
                    className="px-3 py-2 text-gray-500 hover:text-[#143694] hover:bg-gray-100 rounded-md font-medium text-sm transition-all"
                    >
                    Internship
                    </button>

                    

                </div>
    </div>

  </div>

  {/* TABS (clean version - optional) */}
  {/*
  <div className="flex border-b border-gray-200 mt-6 gap-6">

    {['All Jobs', 'Published', 'Drafts'].map((tab) => (
      <button
        key={tab}
        onClick={() => setActiveTab(tab)}
        className={`relative pb-3 text-sm font-medium transition-all ${
          activeTab === tab
            ? 'text-[#143694]'
            : 'text-gray-500 hover:text-gray-900'
        }`}
      >
        {tab}

        {tab === 'All Jobs' && jobs && (
          <span className="ml-2 bg-[#143694]/10 text-[#143694] text-xs px-2 py-0.5 rounded-full">
            {jobs.length}
          </span>
        )}

        {activeTab === tab && (
          <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#143694] rounded-full"></div>
        )}
      </button>
    ))}

  </div>
  */}

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
                            <div className="col-span-2 text-center">New Applications</div>
                            <div className="col-span-2 text-center">Actions</div>
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
                                                {job?.workMode || 'N/A'} • {job?.venue || 'N/A'}
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
                                                    {job?.endDate ? new Date(job?.endDate).toLocaleDateString('en-US', {
                                                                month: 'short',
                                                                day: 'numeric',
                                                                year: 'numeric'
                                                            }) : 'N/A'}
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
                                            className="col-span-2 text-center cursor-pointer group"
                                            onClick={() => showNewApplication(job)}
                                        >
                                            <span className="inline-flex items-center justify-center w-8 h-8 bg-gradient-to-r from-orange-100 to-orange-50 text-orange-700 rounded-full text-sm font-medium group-hover:scale-110 transition-transform">
                                                {job?.applicationCount || 0}
                                            </span>
                                        </div>

                                        {/* Actions - col-span-2 */}
                                        <div className="col-span-2">
                                            <div className="flex items-center justify-center gap-2">
                                                <button
                                                    onClick={() => handleView(job)}
                                                    className="p-2 bg-gradient-to-r from-gray-100 to-white border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 hover:text-[#143694] hover:border-[#143694]/50 transition-all duration-200"
                                                    title="View Job Details"
                                                >
                                                    {/* <Eye size={16} /> */}
                                                    viewed Applications
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