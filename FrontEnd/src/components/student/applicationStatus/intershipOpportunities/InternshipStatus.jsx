import { useEffect, useState } from 'react';
import { Search, MapPin, Clock, Calendar, Briefcase, Award, CheckCircle, ArrowRight, Filter, X, Building } from 'lucide-react';
import { getUserApplicationStatus } from '@/lib/User_AxiosInstance';
import { getJobDetails } from '@/lib/User_AxiosInstance';
import { useAuth } from "@/context/AuthContext";
import InternshipDetailModal from './../../studentDashboard/intershipOpportunity/InternshipDetailModal';
import { toast } from 'react-hot-toast';

const InternshipStatus = () => {
  const { user, loading } = useAuth();
  
  // Early return BEFORE any hooks
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#143694]/10 via-[#f093fb]/5 to-[#1e4ed8]/10">
        <div className="relative z-10 flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#143694]"></div>
        </div>
      </div>
    );
  }

  // Now declare all hooks AFTER the early return
  const [internshipJobs, setInternshipJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalJobId, setModalJobId] = useState(null);
  const [isAppliedInModal, setIsAppliedInModal] = useState(true);

  const role = user?.userType;

  // Define internship specific status steps - Updated to 3-step flow
  const internshipStatusSteps = ['Applied', 'Shortlisted', 'Accepted'];

  const fetchApplication = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await getUserApplicationStatus("Internship");
      console.log("🔍 Step 1 - Internship Application list response:", response);
      
      if (!response || !response.data) {
        throw new Error("No response from API");
      }
      
      const rawData = response.data?.data || [];
      console.log(`🔍 Found ${rawData.length} internship applications`);
      
      if (rawData.length === 0) {
        setInternshipJobs([]);
        setIsLoading(false);
        return;
      }
      
      // Fetch full job details for each application
      const detailedJobs = await Promise.all(
        rawData.map(async (item) => {
          try {
            // Try multiple possible job ID sources
            const jobId = item.job || item.jobDetails?._id || item.jobDetails?.[0]?._id || item._id;
            console.log(`🔍 Fetching internship details for jobId: ${jobId}`);
            
            const jobResponse = await getJobDetails(jobId);
            const jobDetails = jobResponse.data[0] || jobResponse.data;
            
            console.log(`✅ Successfully fetched internship ${jobId}:`, {
              companyName: jobDetails.companyPosted?.companyDetails?.companyName || jobDetails.companyDetails?.companyName,
              jobTitle: jobDetails.jobTitle,
              location: jobDetails.location
            });
            
            // Extract company name from multiple possible sources
            const companyName = 
              jobDetails.companyPosted?.companyDetails?.companyName || 
              jobDetails.companyDetails?.companyName || 
              item.companyDetails?.companyName ||
              item.companyProfile?.companyDetails?.companyName || 
              "Company";
            
            // Extract company logo from multiple possible sources
            const companyLogo = 
              jobDetails.companyPosted?.profileImageUrl || 
              jobDetails.companyDetails?.profileImageUrl ||
              item.companyProfile?.profileImage ||
              item.companyProfile?.profileImageUrl ||
              jobDetails.profileImageUrl ||
              null;
            
            // Extract job title from multiple possible sources
            const jobTitle = 
              jobDetails.jobTitle || 
              jobDetails.position || 
              item.jobDetails?.jobTitle || 
              "Internship Position";
            
            // Extract internship role/position
            const internshipRole = Array.isArray(jobDetails?.jobRoles) && jobDetails.jobRoles.length > 0
              ? jobDetails.jobRoles.join(', ')
              : jobTitle;
            
            // Location extraction
            const location = Array.isArray(jobDetails?.location) && jobDetails.location.length > 0 
              ? jobDetails.location.join(', ') 
              : (jobDetails?.workLocations || item.jobDetails?.location?.join(', ') || "Location not specified");
            
            // Extract work mode
            const workMode = Array.isArray(jobDetails?.workMode) && jobDetails.workMode.length > 0
              ? jobDetails.workMode.join(', ')
              : (item.jobDetails?.workMode?.join(', ') || "Not specified");
            
            // Extract internship duration
            const duration = jobDetails?.duration || jobDetails?.internshipDuration || "Not specified";
            
            // Extract stipend/salary
            let stipend = "Not specified";
            if (jobDetails?.stipend) {
              if (typeof jobDetails.stipend === 'object') {
                stipend = `${jobDetails.stipend.currency || ''} ${jobDetails.stipend.amount || jobDetails.stipend}${jobDetails.stipend.frequency ? '/' + jobDetails.stipend.frequency : ''}`;
              } else {
                stipend = jobDetails.stipend;
              }
            } else if (jobDetails?.salary) {
              stipend = jobDetails.salary;
            }
            
            // Extract skills
            const skills = Array.isArray(jobDetails?.skills) 
              ? jobDetails.skills 
              : (Array.isArray(jobDetails?.requiredSkills) ? jobDetails.requiredSkills : []);
            
            // Description
            const description = jobDetails?.description || jobDetails?.jobDescription || item.jobDetails?.description || "No description available";
            
            // Extract start date
            const startDate = jobDetails?.startDate || jobDetails?.internshipStartDate || "Flexible";
            
            return {
              ...item,
              id: item._id,
              jobId: jobId,
              status: item.currentStatus || item.status || "Applied",
              date: item.createdAt ? new Date(item.createdAt).toLocaleDateString() : (item.date || "N/A"),
              company: companyName,
              companyLogo: companyLogo,
              jobTitle: jobTitle,
              internshipRole: internshipRole,
              workMode: workMode,
              location: location,
              duration: duration,
              stipend: stipend,
              skills: skills,
              description: description,
              startDate: startDate,
              fullJobDetails: jobDetails,
              _debug: {
                jobId: jobId,
                companyNameFound: companyName !== "Company",
                jobTitleFound: jobTitle !== "Internship Position",
                logoUrl: companyLogo
              }
            };
            
          } catch (jobError) {
            console.error(`❌ Error fetching internship job ${item.job}:`, jobError);
            return {
              ...item,
              id: item._id,
              status: item.currentStatus || item.status || "Applied",
              date: item.createdAt ? new Date(item.createdAt).toLocaleDateString() : (item.date || "N/A"),
              company: "Company",
              companyLogo: null,
              jobTitle: "Internship Position",
              internshipRole: "Internship Position",
              workMode: "Not specified",
              location: "Location not specified",
              duration: "Not specified",
              stipend: "Not specified",
              skills: [],
              description: "No description available",
              startDate: "Flexible",
              fullJobDetails: null,
              _debug: { error: jobError.message }
            };
          }
        })
      );
      
      console.log("✅ Final detailed internship jobs:", detailedJobs);
      setInternshipJobs(detailedJobs);
      if (detailedJobs.length > 0) {
        setSelectedJob(detailedJobs[0]);
      }
      
    } catch (error) {
      console.error("❌ Error in fetchApplication:", error);
      setError(error.message || "Failed to fetch internship applications");
      
      if (error.response?.data?.data) {
        const rawData = error.response.data.data;
        const fallbackJobs = rawData.map(item => ({
          ...item,
          id: item._id,
          status: item.currentStatus || "Applied",
          date: item.createdAt ? new Date(item.createdAt).toLocaleDateString() : (item.date || "N/A"),
          company: "Company",
          companyLogo: null,
          jobTitle: "Internship Position",
          internshipRole: "Internship Position",
          workMode: "Not specified",
          location: "Location not specified",
          duration: "Not specified",
          stipend: "Not specified",
          skills: [],
          description: "No description available",
          startDate: "Flexible"
        }));
        setInternshipJobs(fallbackJobs);
        if (fallbackJobs.length > 0) setSelectedJob(fallbackJobs[0]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchApplication();
  }, []);

  const filteredJobs = internshipJobs.filter(job =>
    (job?.jobTitle?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
    (job?.company?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
    (job?.location?.toLowerCase() || "").includes(searchTerm.toLowerCase())
  );

  // Apply sorting
  const sortedJobs = [...filteredJobs].sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      case "oldest":
        return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
      case "company":
        return a.company.localeCompare(b.company);
      default:
        return 0;
    }
  });

  const getStatusIndex = (status) => {
    if (!status) return 0;
    const lowerStatus = status.toLowerCase();
    
    // If rejected, show 0% progress (stays at Applied step)
    if (lowerStatus === 'rejected') return 0;
    
    // For normal 3-step progression
    if (lowerStatus === 'applied') return 0;
    if (lowerStatus === 'shortlisted') return 1;
    if (lowerStatus === 'accepted') return 2;
    
    // Map old statuses to new ones for compatibility
    if (lowerStatus === 'under review' || lowerStatus === 'review') return 1; // Map to Shortlisted
    if (lowerStatus === 'interview' || lowerStatus === 'interviewed') return 1; // Map to Shortlisted
    if (lowerStatus === 'selected') return 2; // Map to Accepted
    
    return 0;
  };

  const handleViewFullDetails = (job) => {
    console.log('Opening modal for internship:', job?.jobId || job?.id);
    setModalJobId(job.jobId || job.id);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setModalJobId(null);
  };

  const getStatusColor = (status) => {
    switch(status.toLowerCase()) {
      case 'applied': return 'bg-gradient-to-r from-[#a5b4fc]/20 to-[#c4b5fd]/20 text-[#5b21b6] border border-[#a5b4fc]/30';
      case 'shortlisted': return 'bg-gradient-to-r from-[#fde68a]/20 to-[#fcd34d]/20 text-[#92400e] border border-[#fde68a]/30';
      case 'accepted': return 'bg-gradient-to-r from-[#bbf7d0]/20 to-[#86efac]/20 text-[#065f46] border border-[#bbf7d0]/30';
      case 'rejected': return 'bg-gradient-to-r from-[#fda4af]/20 to-[#fb7185]/20 text-[#be123c] border border-[#fda4af]/30';
      default: return 'bg-gradient-to-r from-[#a5b4fc]/20 to-[#c4b5fd]/20 text-[#5b21b6] border border-[#a5b4fc]/30';
    }
  };

  const getCompanyInitials = (companyName) => {
    if (!companyName || companyName === "Company") return "CO";
    const words = companyName.split(' ').filter(word => word.length > 0);
    if (words.length === 1) return words[0].substring(0, 2).toUpperCase();
    return (words[0].charAt(0) + words[1].charAt(0)).toUpperCase();
  };

  const retryFetchJob = async (jobId) => {
    try {
      console.log(`🔄 Retrying fetch for internship ${jobId}`);
      const jobResponse = await getJobDetails(jobId);
      const jobDetails = jobResponse.data[0] || jobResponse.data;
      
      setInternshipJobs(prev => prev.map(job => {
        if (job.jobId === jobId) {
          const companyName = 
            jobDetails.companyPosted?.companyDetails?.companyName || 
            jobDetails.companyDetails?.companyName || 
            job.company;
          
          const companyLogo = 
            jobDetails.companyPosted?.profileImageUrl || 
            jobDetails.companyDetails?.profileImageUrl ||
            job.companyLogo ||
            null;
          
          const jobTitle = 
            jobDetails.jobTitle || 
            jobDetails.position || 
            job.jobTitle;
          
          const internshipRole = Array.isArray(jobDetails?.jobRoles) && jobDetails.jobRoles.length > 0
            ? jobDetails.jobRoles.join(', ')
            : jobTitle;
          
          return {
            ...job,
            company: companyName,
            companyLogo: companyLogo,
            jobTitle: jobTitle,
            internshipRole: internshipRole,
            workMode: Array.isArray(jobDetails?.workMode) && jobDetails.workMode.length > 0
              ? jobDetails.workMode.join(', ')
              : job.workMode,
            location: Array.isArray(jobDetails?.location) && jobDetails.location.length > 0 
              ? jobDetails.location.join(', ') 
              : jobDetails?.workLocations || job.location,
            duration: jobDetails?.duration || jobDetails?.internshipDuration || job.duration,
            stipend: jobDetails?.stipend 
              ? `${jobDetails.stipend.currency || ''} ${jobDetails.stipend.amount || jobDetails.stipend}${jobDetails.stipend.frequency ? '/' + jobDetails.stipend.frequency : ''}`
              : job.stipend,
            skills: Array.isArray(jobDetails?.skills) 
              ? jobDetails.skills 
              : (Array.isArray(jobDetails?.requiredSkills) ? jobDetails.requiredSkills : job.skills),
            description: jobDetails?.description || jobDetails?.jobDescription || job.description,
            startDate: jobDetails?.startDate || jobDetails?.internshipStartDate || job.startDate,
            fullJobDetails: jobDetails
          };
        }
        return job;
      }));
      
    } catch (error) {
      console.error(`❌ Failed to retry internship ${jobId}:`, error);
    }
  };

  // Fix image rendering in JSX
  const renderCompanyLogo = (job, isLarge = false) => {
    const sizeClass = isLarge ? 'w-12 h-12' : 'w-9 h-9';
    const logoContainerClass = isLarge ? 'w-12 h-12 flex-shrink-0' : 'w-9 h-9 flex-shrink-0';
    
    return (
      <div className={logoContainerClass}>
        {job.companyLogo ? (
          <img 
            src={job.companyLogo} 
            alt={job.company}
            className={`${sizeClass} rounded-lg object-cover border border-white/60`}
            onError={(e) => { 
              e.target.style.display = 'none'; 
              const fallback = e.target.nextSibling;
              if (fallback) fallback.style.display = 'flex'; 
            }}
          />
        ) : null}
        <div 
          className={`${job.companyLogo ? 'hidden' : 'flex'} ${sizeClass} rounded-lg items-center justify-center font-bold ${
            isLarge ? 'text-lg' : 'text-xs'
          } ${
            selectedJob?.id === job.id 
              ? 'bg-gradient-to-br from-[#143694] to-[#1e4ed8] text-white' 
              : 'bg-white/50 border border-white/60 text-[#143694]'
          }`}
          style={job.companyLogo ? {} : { display: job.companyLogo ? 'none' : 'flex' }}
        >
          {getCompanyInitials(job.company)}
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#143694]/10 via-[#f093fb]/5 to-[#1e4ed8]/10">
        <div className="relative z-10 flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#143694]"></div>
        </div>
      </div>
    );
  }

  if (error && internshipJobs.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#143694]/10 via-[#f093fb]/5 to-[#1e4ed8]/10 flex items-center justify-center p-4">
        <div className="bg-white/90 backdrop-blur-sm border border-white/50 rounded-2xl shadow-lg shadow-purple-50/50 p-6 max-w-md">
          <div className="text-red-500 mb-4 text-center">
            <svg className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2 text-center">Error Loading Internship Applications</h3>
          <p className="text-sm text-gray-600 mb-4 text-center">{error}</p>
          <button
            onClick={fetchApplication}
            className="w-full px-4 py-2 bg-gradient-to-r from-[#143694] to-[#1e4ed8] text-white rounded-xl hover:shadow-lg hover:shadow-[#143694]/40 transition-all duration-300"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#143694]/10 via-[#f093fb]/5 to-[#1e4ed8]/10">
      {/* Pastel blur background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#143694]/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 -left-20 w-60 h-60 bg-[#f093fb]/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-1/3 w-40 h-40 bg-[#1e4ed8]/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-6">
        {/* Header */}
        <div className="bg-white/90 backdrop-blur-sm border border-white/50 rounded-2xl shadow-lg shadow-purple-50/50 p-5 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-gradient-to-br from-[#143694]/20 to-[#1e4ed8]/20 rounded-lg">
                <Building className="h-5 w-5 text-[#143694]" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-[#143694] to-[#1e4ed8] bg-clip-text text-transparent">
                  Internship Application Status
                </h1>
                <p className="text-sm text-gray-600">
                  {internshipJobs.length} internship application(s) found
                </p>
              </div>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search internship applications..."
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-[#143694]/30 focus:border-[#143694]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Filter className="h-4 w-4 text-gray-400" />
              </div>
              <select
                className="pl-10 pr-8 py-2.5 border border-gray-200 rounded-xl bg-white/50 backdrop-blur-sm appearance-none focus:outline-none focus:ring-2 focus:ring-[#143694]/30 focus:border-[#143694]"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="newest">Sort by: Newest</option>
                <option value="oldest">Sort by: Oldest</option>
                <option value="company">Sort by: Company</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg className="h-4 w-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Applications List */}
          <div className="lg:col-span-1">
            <div className="bg-white/90 backdrop-blur-sm border border-white/50 rounded-2xl shadow-lg shadow-purple-50/50 h-full flex flex-col">
              <div className="p-4 border-b border-white/60">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-semibold text-gray-900">Internship Applications</h2>
                  <span className="text-xs font-medium px-2 py-1 bg-gradient-to-r from-[#143694]/10 to-[#1e4ed8]/10 text-[#143694] rounded-full">
                    {sortedJobs.length}
                  </span>
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto p-2">
                {sortedJobs.length > 0 ? (
                  <div className="space-y-2">
                    {sortedJobs.map(job => (
                      <button
                        key={job.id}
                        onClick={() => setSelectedJob(job)}
                        className={`w-full text-left p-3 rounded-xl transition-all duration-200 ${
                          selectedJob?.id === job.id 
                            ? 'bg-gradient-to-r from-[#143694]/10 to-[#1e4ed8]/10 border border-[#143694]/20' 
                            : 'hover:bg-white/30 border border-transparent'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          {renderCompanyLogo(job, false)}
                          <div className="flex-1 min-w-0">
                            <h3 className="text-sm font-semibold text-gray-900 truncate">{job.company}</h3>
                            <p className="text-xs text-gray-600 truncate">{job.jobTitle}</p>
                            <div className="mt-1.5 flex items-center text-xs text-gray-500 gap-2">
                              <span className="inline-flex items-center">
                                <MapPin className="h-3 w-3 mr-1 text-[#143694]" />
                                {job.location}
                              </span>
                              <span className={`text-xs px-1.5 py-0.5 rounded ${
                                job.status.toLowerCase() === 'accepted' || job.status.toLowerCase() === 'selected'
                                  ? 'bg-green-100 text-green-700 border border-green-200' :
                                job.status.toLowerCase() === 'shortlisted'
                                  ? 'bg-amber-100 text-amber-700 border border-amber-200' :
                                job.status.toLowerCase() === 'rejected'
                                  ? 'bg-red-100 text-red-700 border border-red-200' :
                                'bg-purple-100 text-purple-700 border border-purple-200'
                              }`}>
                                {job.status}
                              </span>
                            </div>
                          </div>
                        </div>
                        {job._debug?.error && (
                          <div className="mt-2 text-right">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                retryFetchJob(job.jobId);
                              }}
                              className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200"
                            >
                              Retry Fetch
                            </button>
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="p-6 text-center">
                    <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-white/50 to-white/30 border border-white/60 mb-3">
                      <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <p className="text-sm text-gray-500">No internship applications found</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Status and Details */}
          <div className="lg:col-span-2">
            {selectedJob ? (
              <div className="bg-white/90 backdrop-blur-sm border border-white/50 rounded-2xl shadow-lg shadow-purple-50/50 h-full flex flex-col">
                {/* Status Progress */}
                <div className="p-5 border-b border-white/60">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h2 className="text-lg font-bold text-gray-900">{selectedJob.company}</h2>
                      <p className="text-sm text-gray-600">{selectedJob.internshipRole}</p>
                    </div>
                    {renderCompanyLogo(selectedJob, true)}
                  </div>
                  
                  {/* Updated Progress Bar for Internship - 3-step flow */}
                  {selectedJob.status.toLowerCase() === 'rejected' ? (
                    // Rejected Status - Simple 2-step bar with X icons
                    <div className="relative">
                      <div className="flex justify-between mb-1">
                        <div className="flex flex-col items-center" style={{ width: '50%' }}>
                          <div className="w-8 h-8 rounded-full mb-1 flex items-center justify-center border-2 bg-red-100 border-red-300 text-red-700">
                            <X className="h-4 w-4" />
                          </div>
                          <span className="text-xs text-center text-red-700 font-medium">
                            Applied
                          </span>
                        </div>
                        <div className="flex flex-col items-center" style={{ width: '50%' }}>
                          <div className="w-8 h-8 rounded-full mb-1 flex items-center justify-center border-2 bg-red-500 border-red-500 text-white">
                            <X className="h-4 w-4" />
                          </div>
                          <span className="text-xs text-center text-red-700 font-medium">
                            Rejected
                          </span>
                        </div>
                      </div>
                      <div className="h-1.5 bg-white/50 absolute left-[25%] right-[25%] top-4 -z-10">
                        <div className="h-1.5 bg-gradient-to-r from-red-400 to-red-500 rounded-full w-full"></div>
                      </div>
                    </div>
                  ) : (
                    // Normal Internship Status Flow - 3-step bar
                    <div className="relative">
                      <div className="flex justify-between mb-1">
                        {internshipStatusSteps.map((step, idx) => {
                          const currentIdx = getStatusIndex(selectedJob.status);
                          const isActive = idx <= currentIdx;
                          return (
                            <div key={idx} className="flex flex-col items-center" style={{ width: `${100 / 3}%` }}>
                              <div className={`w-8 h-8 rounded-full mb-1 flex items-center justify-center border-2 text-xs ${
                                isActive 
                                  ? 'bg-gradient-to-r from-[#143694] to-[#1e4ed8] border-transparent text-white'
                                  : 'bg-white/50 border-white/60 text-gray-400'
                              }`}>
                                {isActive ? <CheckCircle className="h-4 w-4" /> : idx + 1}
                              </div>
                              <span className={`text-xs text-center ${isActive ? 'text-[#143694] font-medium' : 'text-gray-500'}`}>
                                {step}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                      <div className="h-1.5 bg-white/50 absolute left-[16.5%] right-[16.5%] top-4 -z-10">
                        <div
                          className="h-1.5 bg-gradient-to-r from-[#143694] to-[#1e4ed8] transition-all duration-300 rounded-full"
                          style={{
                            width: `${(getStatusIndex(selectedJob.status) / (internshipStatusSteps.length - 1)) * 100}%`
                          }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Job Details Grid */}
                <div className="flex-1 p-5">
                  {/* Row 1: Location and Work Mode */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="p-3 bg-gradient-to-r from-white/30 to-white/10 border border-white/60 rounded-xl">
                      <div className="flex items-center gap-2 mb-1">
                        <MapPin className="h-4 w-4 text-[#143694]" />
                        <span className="text-xs font-medium text-gray-700">Location</span>
                      </div>
                      <p className="text-sm text-gray-900">{selectedJob.location}</p>
                    </div>
                    
                    <div className="p-3 bg-gradient-to-r from-white/30 to-white/10 border border-white/60 rounded-xl">
                      <div className="flex items-center gap-2 mb-1">
                        <Clock className="h-4 w-4 text-[#143694]" />
                        <span className="text-xs font-medium text-gray-700">Work Mode</span>
                      </div>
                      <p className="text-sm text-gray-900">{selectedJob.workMode}</p>
                    </div>
                  </div>

                  {/* Row 2: Applied Date and Duration */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="p-3 bg-gradient-to-r from-white/30 to-white/10 border border-white/60 rounded-xl">
                      <div className="flex items-center gap-2 mb-1">
                        <Calendar className="h-4 w-4 text-[#143694]" />
                        <span className="text-xs font-medium text-gray-700">Applied Date</span>
                      </div>
                      <p className="text-sm text-gray-900">{selectedJob.date}</p>
                    </div>
                    
                    {selectedJob.duration && selectedJob.duration !== "Not specified" && (
                      <div className="p-3 bg-gradient-to-r from-white/30 to-white/10 border border-white/60 rounded-xl">
                        <div className="flex items-center gap-2 mb-1">
                          <svg className="h-4 w-4 text-[#143694]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6 3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="text-xs font-medium text-gray-700">Duration</span>
                        </div>
                        <p className="text-sm text-gray-900">{selectedJob.duration}</p>
                      </div>
                    )}
                  </div>

                  {/* Row 3: Stipend and Start Date */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    {/* Stipend */}
                    {selectedJob.stipend && selectedJob.stipend !== "Not specified" && (
                      <div className="p-3 bg-gradient-to-r from-white/30 to-white/10 border border-white/60 rounded-xl">
                        <div className="flex items-center gap-2 mb-1">
                          <svg className="h-4 w-4 text-[#143694]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="text-xs font-medium text-gray-700">Stipend</span>
                        </div>
                        <p className="text-sm text-gray-900">{selectedJob.stipend}</p>
                      </div>
                    )}
                    
                    {/* Start Date */}
                    {selectedJob.startDate && selectedJob.startDate !== "Flexible" && (
                      <div className={`p-3 bg-gradient-to-r from-white/30 to-white/10 border border-white/60 rounded-xl ${selectedJob.stipend && selectedJob.stipend !== "Not specified" ? 'md:col-span-1' : 'col-span-2'}`}>
                        <div className="flex items-center gap-2 mb-1">
                          <svg className="h-4 w-4 text-[#143694]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span className="text-xs font-medium text-gray-700">Start Date</span>
                        </div>
                        <p className="text-sm text-gray-900">{selectedJob.startDate}</p>
                      </div>
                    )}
                  </div>

                  {/* Row 4: Required Skills */}
                  {selectedJob.skills && selectedJob.skills.length > 0 && (
                    <div className="mb-5">
                      <div className="flex items-center gap-2 mb-2">
                        <svg className="h-4 w-4 text-[#143694]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        <span className="text-xs font-medium text-gray-700">Required Skills</span>
                      </div>
                      <div className="p-3 bg-gradient-to-r from-white/30 to-white/10 border border-white/60 rounded-xl">
                        <div className="flex flex-wrap gap-1.5">
                          {selectedJob.skills.slice(0, 4).map((skill, index) => (
                            <span key={index} className="px-2 py-1 bg-white/80 text-gray-700 rounded-lg text-xs font-medium border border-white/60">
                              {skill}
                            </span>
                          ))}
                          {selectedJob.skills.length > 4 && (
                            <span className="px-2 py-1 bg-white/80 text-gray-700 rounded-lg text-xs font-medium border border-white/60">
                              +{selectedJob.skills.length - 4} more
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Row 5: Description (Full width) */}
                  {selectedJob.description && selectedJob.description !== "No description available" && (
                    <div className="mb-5">
                      <div className="flex items-center gap-2 mb-2">
                        <svg className="h-4 w-4 text-[#143694]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span className="text-xs font-medium text-gray-700">Description</span>
                      </div>
                      <div className="p-3 bg-gradient-to-r from-white/30 to-white/10 border border-white/60 rounded-xl">
                        <p className="text-sm text-gray-700 line-clamp-4">
                          {selectedJob.description}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Action Button */}
                  <div className="mt-auto">
                    <button 
                      onClick={() => handleViewFullDetails(selectedJob)}
                      className="inline-flex items-center justify-center w-full px-4 py-2.5 bg-gradient-to-r from-[#143694] to-[#1e4ed8] text-white text-sm rounded-xl hover:shadow-lg hover:shadow-[#143694]/40 transition-all duration-300 group"
                    >
                      View Full Details
                      <ArrowRight className="h-3.5 w-3.5 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                    </button>
                  </div>
                </div>
              </div>
            ) : internshipJobs.length === 0 ? (
              <div className="bg-white/90 backdrop-blur-sm border border-white/50 rounded-2xl shadow-lg shadow-purple-50/50 h-full flex flex-col items-center justify-center p-6">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-white/50 to-white/30 border border-white/60 mb-4">
                  <Building className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Internship Applications</h3>
                <p className="text-sm text-gray-600 text-center">
                  You haven't applied to any internships yet.
                </p>
              </div>
            ) : (
              <div className="bg-white/90 backdrop-blur-sm border border-white/50 rounded-2xl shadow-lg shadow-purple-50/50 h-full flex flex-col items-center justify-center p-6">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-white/50 to-white/30 border border-white/60 mb-4">
                  <Building className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Select an Internship Application</h3>
                <p className="text-sm text-gray-600 text-center">
                  Choose an internship application from the list to view detailed status
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      {isModalOpen && modalJobId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm" 
            onClick={handleCloseModal}
          />
          <div className="relative z-10 w-full max-w-6xl h-[90vh] overflow-y-auto rounded-2xl bg-white">
            <InternshipDetailModal
              jobId={modalJobId}
              isOpen={isModalOpen}
              onClose={handleCloseModal}
              isApplied={true} // Since we're in status page, user has already applied
              onApplySuccess={(applicationData) => {
                console.log("✅ New internship application submitted:", applicationData);
                if (typeof toast !== 'undefined') {
                  toast.success("Application submitted successfully!");
                }
                fetchApplication();
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default InternshipStatus;