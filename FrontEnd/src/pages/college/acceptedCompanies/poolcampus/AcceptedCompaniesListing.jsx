import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, Eye, ChevronLeft, ChevronRight, Trash, Filter, 
  Briefcase, Globe, MapPin, Send, Phone, Linkedin, Mail, 
  Building2, Calendar, FileText, User, AlertCircle, Users 
} from 'lucide-react';
import { acceptCandidate, getCollegeApplicationsForJob, getPostedJobs, rejectCandidate, shortlistCandidate } from '@/lib/Company_AxiosInstance';
import toast from 'react-hot-toast';
import { deleteCollegeJob ,conversationWithCollege} from '@/lib/College_AxiosIntance';
import { useNavigate } from 'react-router-dom';
import useConversation from '@/statemanage/useConversation.js';

export default function PoolCampusJobManagement() {
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
      // Pool-campus specific API call preserved
      const response = await getPostedJobs("Pool-campus", "Accepted");
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

  const fetchCompaniesForJob = async (jobId, jobType,isVisited) => {
    setCompaniesLoading(true);
    setError(null);
    try {
      const response = await getCollegeApplicationsForJob(jobId, jobType, "Accepted",isVisited);
      console.log("Fetched companies for job:", response.data);
      setCompanies(response.data || []);
      if (isVisited === "false") {
      fetchJobs(); 
    }
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
        await deleteCollegeJob(jobId);
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
      // FIXED: Use venue field for location
      const location = job.venue || '';

      // Comprehensive search across degree and job title and location
      const matchesSearch =
        degree.toLowerCase().includes(searchQuery.toLowerCase()) ||
        jobTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        location.toLowerCase().includes(searchQuery.toLowerCase());

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
    // Disabled logic removed. Always fetches/displays now.
    setSelectedJob(job);
    fetchCompaniesForJob(job._id, job.jobType,"false");
  };

  const handleViewAllCompanies = (job) => {
    // Disabled logic removed. Always fetches/displays now.
    setSelectedJob(job);
    
    fetchCompaniesForJob(job._id, job.jobType,undefined);
  };

  const handleBackToList = () => {
    setSelectedJob(null);
    setCompanies([]);
  };

  // Company Card Component with company data
  const CompanyCard = ({ companyApplication, driveDetails, onReject }) => {
    const [currentStatus, setCurrentStatus] = useState(companyApplication.currentStatus);
    const [isProcessing, setIsProcessing] = useState(false);
    const [showModal, setShowModal] = useState(false);

    if (!companyApplication || !companyApplication.applicant) {
      return null;
    }

       const navigate = useNavigate();
      const { setSelectedConversation } = useConversation();
    
     // const { applicant } = companyApplication;
     const { _id: applicationId, applicant, createdAt } = companyApplication;
      const { companyDetails, employerDetails, profileImageUrl, userId } = applicant;
    
    
        const handleMessageClick = async (e) => {
        e.stopPropagation();
    
        if (!userId) {
          toast.error("Company user not found");
          return;
        }
     console.log("Chatting with company:", {
      userId,
      companyDetails
    });
        try {
          const response = await conversationWithCollege(userId);
    
          if (response.data) {
            const conversationUser = {
              _id: userId, // 
              name: companyDetails?.companyName || 'Unknown Company',
              fullname: companyDetails?.companyName || 'Unknown Company',
              email: employerDetails?.workEmail || '',
              profileImage:
                profileImageUrl ||
                'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png',
              userType: 'company' // 
            };
    
            setSelectedConversation(conversationUser);
            navigate('/chat-application');
          } else {
            toast.error('Failed to create conversation');
          }
        } catch (error) {
          console.error('Chat error:', error);
          toast.error('Error starting conversation');
        }
      };

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
          return 'bg-gradient-to-r from-[#a7f3d0]/20 to-[#34d399]/20 text-[#059669] border border-[#a7f3d0]/30';
        case 'Rejected':
          return 'bg-gradient-to-r from-[#fecaca]/20 to-[#f87171]/20 text-[#dc2626] border border-[#fecaca]/30';
        case 'Accepted':
          return 'bg-gradient-to-r from-[#c7d2fe]/20 to-[#818cf8]/20 text-[#4f46e5] border border-[#c7d2fe]/30';
        default:
          return 'bg-gradient-to-r from-[#93c5fd]/20 to-[#3b82f6]/20 text-[#1d4ed8] border border-[#93c5fd]/30';
      }
    };

    const CompanyDetailsModal = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{companyDetails?.companyName}</h2>
              <p className="text-gray-600 text-sm mt-1">{companyDetails?.description || 'No description available'}</p>
            </div>
            <button
              onClick={() => setShowModal(false)}
              className="text-gray-500 hover:text-gray-700 text-xl p-1"
            >
              ✕
            </button>
          </div>

          {/* Company Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="space-y-3">
              <div className="flex items-center text-gray-700">
                <Briefcase className="w-4 h-4 mr-3 text-[#3b82f6]" />
                <span className="font-medium">Industry:</span>
                <span className="ml-2">{companyDetails?.industryType || 'N/A'}</span>
              </div>
              <div className="flex items-center text-gray-700">
                <Building2 className="w-4 h-4 mr-3 text-[#3b82f6]" />
                <span className="font-medium">Company Type:</span>
                <span className="ml-2">{companyDetails?.companyType || 'N/A'}</span>
              </div>
              <div className="flex items-center text-gray-700">
                <Users className="w-4 h-4 mr-3 text-[#3b82f6]" />
                <span className="font-medium">Employees:</span>
                <span className="ml-2">{companyDetails?.numberOfEmployees || 'N/A'}</span>
              </div>
              <div className="flex items-center text-gray-700">
                <Calendar className="w-4 h-4 mr-3 text-[#3b82f6]" />
                <span className="font-medium">Established:</span>
                <span className="ml-2">{companyDetails?.establishedYear || 'N/A'}</span>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center text-gray-700">
                <MapPin className="w-4 h-4 mr-3 text-[#3b82f6]" />
                <span className="font-medium">Location:</span>
                <span className="ml-2">
                  {[companyDetails?.city, companyDetails?.state, companyDetails?.country]
                    .filter(Boolean)
                    .join(', ') || 'N/A'}
                </span>
              </div>
              <div className="flex items-center text-gray-700">
                <Phone className="w-4 h-4 mr-3 text-[#3b82f6]" />
                <span className="font-medium">Phone:</span>
                <span className="ml-2">{companyDetails?.phoneNumber || 'Not provided'}</span>
              </div>
              <div className="flex items-center text-gray-700">
                <Phone className="w-4 h-4 mr-3 text-[#3b82f6]" />
                <span className="font-medium">Alt Phone:</span>
                <span className="ml-2">{companyDetails?.alternatePhoneNumber || 'Not provided'}</span>
              </div>
              <div className="flex items-center text-gray-700">
                <Mail className="w-4 h-4 mr-3 text-[#3b82f6]" />
                <span className="font-medium">Email:</span>
                <span className="ml-2">{employerDetails?.workEmail || 'Not provided'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

    return (
      <>
        <div className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl border border-white/50 shadow-sm hover:shadow-lg transition-all duration-300">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-shrink-0">
              <img
                src={profileImageUrl || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'}
                alt={`${companyDetails?.companyName} Logo`}
                className="w-24 h-24 rounded-xl object-cover border-2 border-white/50 shadow-sm"
              />
            </div>
        
            <div className="flex-grow">
              <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                <div>
                  <h3
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowModal(true);
                    }}
                    className="text-2xl font-bold bg-gradient-to-r from-[#3b82f6] to-[#8b5cf6] bg-clip-text text-transparent hover:underline cursor-pointer"
                  >
                    {companyDetails?.companyName}
                  </h3>
                  <div className="flex items-center gap-3 mt-2">
                    <span className={`px-3 py-1.5 text-sm font-medium rounded-full ${getStatusColor(currentStatus)}`}>
                      {currentStatus}
                    </span>
                    <span className="text-sm text-gray-500 flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      Applied: {new Date(createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <div className="space-y-3">
                  <div className="flex items-center text-gray-700">
                    <Briefcase className="w-4 h-4 mr-3 text-[#3b82f6]" />
                    <span className="font-medium">Industry:</span>
                    <span className="ml-2">{companyDetails?.industryType || 'N/A'}</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <Building2 className="w-4 h-4 mr-3 text-[#3b82f6]" />
                    <span className="font-medium">Company Type:</span>
                    <span className="ml-2">{companyDetails?.companyType || 'N/A'}</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <MapPin className="w-4 h-4 mr-3 text-[#3b82f6]" />
                    <span className="font-medium">Location:</span>
                    <span className="ml-2">{companyDetails?.city || 'N/A'}, {companyDetails?.state || 'N/A'}</span>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center text-gray-700">
                    <Globe className="w-4 h-4 mr-3 text-[#3b82f6]" />
                    <span className="font-medium">Website:</span>
                    <a href={companyDetails?.websiteUrl} target="_blank" rel="noopener noreferrer" 
                       className="ml-2 text-[#3b82f6] hover:underline truncate">
                      {companyDetails?.websiteUrl || 'Not provided'}
                    </a>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <Phone className="w-4 h-4 mr-3 text-[#3b82f6]" />
                    <span className="font-medium">Phone:</span>
                    <span className="ml-2">{companyDetails?.phoneNumber || 'Not provided'}</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <Linkedin className="w-4 h-4 mr-3 text-[#3b82f6]" />
                    <span className="font-medium">LinkedIn:</span>
                    <a href={companyDetails?.companyLinkedin} target="_blank" rel="noopener noreferrer" 
                       className="ml-2 text-[#3b82f6] hover:underline truncate">
                      {companyDetails?.companyLinkedin ? 'View Profile' : 'Not provided'}
                    </a>
                  </div>
                </div>
              </div>

              {/* Contact Person Details */}
              <div className="mt-6 p-5 bg-gradient-to-r from-[#f0f9ff]/30 to-[#e0f2fe]/30 rounded-xl border border-blue-50">
                <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <User className="w-5 h-5 text-[#3b82f6]" />
                  Contact Person Details
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center text-gray-700">
                    <User className="w-4 h-4 mr-3 text-[#3b82f6]" />
                    <div>
                      <span className="font-medium">Name:</span>
                      <span className="ml-2">{employerDetails?.name || 'N/A'}</span>
                    </div>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <Briefcase className="w-4 h-4 mr-3 text-[#3b82f6]" />
                    <div>
                      <span className="font-medium">Designation:</span>
                      <span className="ml-2">{employerDetails?.designation || 'N/A'}</span>
                    </div>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <Mail className="w-4 h-4 mr-3 text-[#3b82f6]" />
                    <div>
                      <span className="font-medium">Email:</span>
                      <a href={`mailto:${employerDetails?.workEmail}`} 
                         className="ml-2 text-[#3b82f6] hover:underline">
                        {employerDetails?.workEmail || 'N/A'}
                      </a>
                    </div>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <Phone className="w-4 h-4 mr-3 text-[#3b82f6]" />
                    <div>
                      <span className="font-medium">Mobile:</span>
                      <span className="ml-2">{employerDetails?.mobile || 'N/A'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6 pt-6 border-t border-white/50">
                <button
                  onClick={handleReject}
                  disabled={isProcessing || currentStatus === 'Rejected'}
                  className={`group flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 text-sm ${
                    currentStatus === 'Rejected'
                      ? 'bg-gradient-to-r from-red-700 to-red-800 text-white cursor-not-allowed'
                      : 'bg-gradient-to-r from-red-500 to-red-600 text-white hover:shadow-lg hover:shadow-red-500/30 hover:-translate-y-0.5'
                  } ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {isProcessing ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-r-transparent"></div>
                      Rejecting...
                    </>
                  ) : currentStatus === 'Rejected' ? (
                    'Already Rejected'
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      Reject Application
                    </>
                  )}
                </button>
                <button
                  onClick={handleMessageClick}
                  disabled={isProcessing}
                  className={`group flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-gray-500/30 hover:-translate-y-0.5 transition-all duration-300 text-sm ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <Send className="w-4 h-4" />
                  Send Message
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Render the modal conditionally */}
        {showModal && <CompanyDetailsModal />}
      </>
    );
  };

  if (selectedJob) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f0e6f7]/60 via-[#d4e8f9]/55 to-[#cff7ea]/60">
        {/* Pastel blur background elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#fbcfe8]/20 rounded-full blur-3xl"></div>
          <div className="absolute top-1/3 -left-20 w-60 h-60 bg-[#93c5fd]/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-1/3 w-40 h-40 bg-[#a7f3d0]/20 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 max-w-6xl mx-auto p-6">
          <button
            onClick={handleBackToList}
            className="group flex items-center gap-2 text-gray-600 hover:text-[#3b82f6] mb-8 transition-all duration-200 font-medium"
          >
            <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform duration-200" />
            Back to drives
          </button>

          {companiesLoading ? (
            <div className="p-12 text-center bg-white/90 backdrop-blur-sm border border-white/50 rounded-2xl shadow-lg">
              <div className="inline-block h-12 w-12 animate-spin rounded-full border-3 border-solid border-[#3b82f6] border-r-transparent"></div>
              <p className="mt-6 text-gray-600 text-lg font-medium">Loading company applications...</p>
            </div>
          ) : error ? (
            <div className="p-6 text-red-700 bg-gradient-to-r from-red-50/80 to-red-100/80 backdrop-blur-sm border border-red-200 rounded-2xl">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-6 h-6" />
                <div>
                  <p className="font-semibold">Error loading applications</p>
                  <p className="text-sm mt-1">{error}</p>
                </div>
              </div>
            </div>
          ) : companies.length === 0 ? (
            <div className="p-12 text-center bg-white/90 backdrop-blur-sm border border-white/50 rounded-2xl shadow-lg">
              <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-700 mb-2">No Applications Yet</h3>
              <p className="text-gray-500">No companies have applied for this drive yet.</p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Company Applications</h2>
                <p className="text-gray-600">Total applications: <span className="font-semibold text-[#3b82f6]">{companies.length}</span></p>
              </div>
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
                Accepted Pool-Campus Drives
              </h1>
              <p className="text-gray-600 text-lg md:text-xl max-w-2xl">
                Track Your Accepted Pool-Campus Drives
              </p>
            </div>
          </div>

          {/* Main Content Card */}
          <div className="bg-white/90 backdrop-blur-sm border border-white/50 rounded-2xl shadow-lg shadow-blue-50/50 overflow-hidden">
            {/* Tabs */}
            <div className="flex border-b border-white/50">
              <button
                className={`px-6 py-3 text-sm font-medium transition-all duration-200 ${activeTab === 'All Drives' 
                  ? 'border-b-2 border-[#3b82f6] text-[#3b82f6]' 
                  : 'text-gray-600 hover:text-[#3b82f6] hover:bg-white/30'}`}
                onClick={() => setActiveTab('All Drives')}
              >
                All Drives ({jobs.length || 0})
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

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-white/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Degree</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Deadline</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Views</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">New Applications</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="text-center py-8">
                        <div className="inline-block h-8 w-8 animate-spin rounded-full border-2 border-solid border-[#3b82f6] border-r-transparent"></div>
                        <p className="mt-2 text-gray-600">Loading drives...</p>
                      </td>
                    </tr>
                  ) : currentJobs.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-8">
                        <div className="flex flex-col items-center">
                          <Search className="w-12 h-12 text-gray-400 mb-2" />
                          <p className="text-gray-500 text-lg">No drives found matching your criteria.</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    currentJobs.map(job => {
                      const jobId = job._id;
                      const degree = displayDegree(job);
                      // FIXED: Fetch venue location
                      const jobLocation = job.venue || 'N/A';
                      const jobStatus = job.jobStatus || 'Unknown';
                      const deadline = job.endDate;
                      const views = job.views || 0;
                      const applications = job.applicationCount || 0;
                      
                      return (
                        <tr
                          key={jobId}
                          className="border-b border-white/50 hover:bg-white/30 transition-colors duration-200"
                        >
                          {/* FIXED: Degree Column with Venue as subtitle and correct navigation */}
                          <td 
                            className="px-6 py-4 cursor-pointer" 
                            onClick={() => navigate(`/college-dashboard/preview/Pool-campus/${job._id}?isApplied=true`)}
                          >
                            <div className="font-medium text-gray-900 whitespace-normal break-words">{degree}</div>
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
                            className="px-6 py-4 cursor-pointer"
                            onClick={(e) => { 
                              e.stopPropagation(); 
                              handleViewCompanies(job); 
                            }}
                          >
                            <div className="flex items-center gap-1 text-gray-700">
                              <Users className="w-4 h-4 text-[#3b82f6]" />
                              {applications}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex gap-3">
                              <button 
                                onClick={(e) => { 
                                  e.stopPropagation(); 
                                  handleViewAllCompanies(job); 
                                }} 
                                className="transition-all duration-200 text-gray-500 hover:text-[#3b82f6]" 
                                title="View Company Applications"
                              >
                                <Eye size={18} />
                              </button>
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDelete(job._id);
                                }} 
                                className="text-gray-500 hover:text-red-500 transition-all duration-200" 
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