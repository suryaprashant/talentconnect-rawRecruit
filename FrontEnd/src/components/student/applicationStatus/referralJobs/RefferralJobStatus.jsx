import { useEffect, useState } from 'react';
import { Search, MapPin, Clock, Calendar, Briefcase, Award, CheckCircle, ArrowRight, Filter } from 'lucide-react';
import { statusSteps } from '../../../../constants/data.js';
import { getUserApplicationStatus } from '@/lib/User_AxiosInstance';
import { getJobDetails } from '@/lib/User_AxiosInstance';
import { Link } from 'react-router-dom';

const ReferralStatus = () => {
  const [referralJobs, setReferralJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchApplication = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await getUserApplicationStatus("Referral");
      console.log("🔍 Step 1 - Referral Application list response:", response);
      
      if (!response || !response.data) {
        throw new Error("No response from API");
      }
      
      const rawData = response.data?.data || [];
      console.log(`🔍 Found ${rawData.length} referral applications`);
      
      if (rawData.length === 0) {
        setReferralJobs([]);
        setIsLoading(false);
        return;
      }
      
      // Fetch full job details for each application
      const detailedJobs = await Promise.all(
        rawData.map(async (item) => {
          try {
            const jobId = item.job || item.jobDetails?.[0]?._id || item._id;
            console.log(`🔍 Fetching referral job details for jobId: ${jobId}`);
            
            const jobResponse = await getJobDetails(jobId);
            const jobDetails = jobResponse.data[0]; // Note: getJobDetails returns array
            
            console.log(`✅ Successfully fetched referral job ${jobId}:`, {
              companyName: jobDetails.companyPosted?.companyDetails?.companyName,
              jobRoles: jobDetails.jobRoles,
              location: jobDetails.location
            });
            
            // Extract company name
            
 const companyName =
  item.referralCompany ||                                          // ← saved on application at apply time
  jobDetails.companyPosted?.companyDetails?.companyName ||
  item.referralPosterProfile?.currentCompany ||
  item.referralPosterProfile?.name ||
  "Company";

const companyLogo =
  jobDetails.companyPosted?.profileImageUrl ||
  item.referralPosterProfile?.profileImage ||
  null;
            
            // Extract job roles
            let jobRolesText = "Position";
            if (Array.isArray(jobDetails?.jobRoles) && jobDetails.jobRoles.length > 0) {
              jobRolesText = jobDetails.jobRoles.join(', ');
            } else if (jobDetails?.jobTitle) {
              jobRolesText = jobDetails.jobTitle;
            }
            
            // For the job title in the list, show just the first job role
            const firstJobRole = Array.isArray(jobDetails?.jobRoles) && jobDetails.jobRoles.length > 0 
              ? jobDetails.jobRoles[0] 
              : jobDetails?.jobTitle || "Position";
            
            // Location extraction
            const location = Array.isArray(jobDetails?.location) && jobDetails.location.length > 0 
              ? jobDetails.location.join(', ') 
              : jobDetails?.workLocations || "Location not specified";
            
            // Extract employment type
            const employmentType = Array.isArray(jobDetails?.employmentType) && jobDetails.employmentType.length > 0
              ? jobDetails.employmentType.join(', ')
              : "Full-time";
            
            // Extract work mode
            const workMode = Array.isArray(jobDetails?.workMode) && jobDetails.workMode.length > 0
              ? jobDetails.workMode.join(', ')
              : "Not specified";
            
            // Other fields
            const degree = Array.isArray(jobDetails?.degree) && jobDetails.degree.length > 0
              ? jobDetails.degree.join(', ')
              : "Degree requirements";
            
            const skills = Array.isArray(jobDetails?.skills) ? jobDetails.skills : [];
            
            const description = jobDetails?.description || "No description available";
            
            // Extract package details
            const packageDetails = jobDetails?.packageDetails || {};
            const salary = packageDetails?.totalCTC 
              ? `${packageDetails.currency || ''} ${packageDetails.totalCTC.toLocaleString()}` 
              : "Not specified";
            
            // Format date
            const firstHistory = Array.isArray(item?.statusHistory) && item.statusHistory.length > 0 ? item.statusHistory[0] : null;
            const date = firstHistory?.date 
              ? new Date(firstHistory.date).toUTCString().slice(0, 16)
              : item.createdAt 
                ? new Date(item.createdAt).toLocaleDateString()
                : "N/A";
            
            return {
              ...item,
              id: item._id,
              jobId: jobId,
              status: item.currentStatus || item.status || "Applied",
              date: date,
              company: companyName,
              companyLogo: companyLogo,
              // Use first job role as the job title for the list
              jobTitle: firstJobRole,
              // Store all job roles for the details view
              jobRoles: jobRolesText,
              employmentType: employmentType,
              workMode: workMode,
              location: location,
              degree: degree,
              skills: skills,
              description: description,
              salary: salary,
              fullJobDetails: jobDetails,
              _debug: {
                jobId: jobId,
                hasCompanyPosted: !!jobDetails.companyPosted,
                companyNameFound: companyName !== "Company",
                jobRoles: jobDetails.jobRoles,
                employmentType: employmentType
              }
            };
            
          } catch (jobError) {
            console.error(`❌ Error fetching referral job ${item.job}:`, jobError);
            return {
              ...item,
              id: item._id,
              status: item.currentStatus || item.status || "Applied",
              date: item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "N/A",
              company: "Company",
              companyLogo: null,
              jobTitle: "Position",
              jobRoles: "Position",
              employmentType: "Full-time",
              workMode: "Not specified",
              location: "Location not specified",
              degree: "Degree requirements",
              skills: [],
              description: "No description available",
              salary: "Not specified",
              fullJobDetails: null,
              _debug: { error: jobError.message }
            };
          }
        })
      );
      
      console.log("✅ Final detailed referral jobs:", detailedJobs);
      setReferralJobs(detailedJobs);
      if (detailedJobs.length > 0) {
        setSelectedJob(detailedJobs[0]);
      }
      
    } catch (error) {
      console.error("❌ Error in fetchApplication:", error);
      setError(error.message || "Failed to fetch applications");
      
      if (error.response?.data?.data) {
        const rawData = error.response.data.data;
        const fallbackJobs = rawData.map(item => ({
          ...item,
          id: item._id,
          status: item.currentStatus || "Applied",
          date: item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "N/A",
          company: "Company",
          companyLogo: null,
          jobTitle: "Position",
          jobRoles: "Position",
          employmentType: "Full-time",
          workMode: "Not specified",
          location: "Location not specified",
          degree: "Degree requirements",
          skills: [],
          description: "No description available",
          salary: "Not specified"
        }));
        setReferralJobs(fallbackJobs);
        if (fallbackJobs.length > 0) setSelectedJob(fallbackJobs[0]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchApplication();
  }, []);

// AFTER
const filteredJobs = referralJobs.filter(job => {
  const title = Array.isArray(job?.jobTitle) ? job.jobTitle.join(', ') : (job?.jobTitle || "");
  const company = Array.isArray(job?.company) ? job.company.join(', ') : (job?.company || "");
  const location = Array.isArray(job?.location) ? job.location.join(', ') : (job?.location || "");
  const term = searchTerm.toLowerCase();

  return (
    title.toLowerCase().includes(term) ||
    company.toLowerCase().includes(term) ||
    location.toLowerCase().includes(term)
  );
});

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
    const index = statusSteps.findIndex(step => step.toLowerCase() === status.toLowerCase());
    return index >= 0 ? index : 0;
  };

  const getStatusColor = (status) => {
    switch(status.toLowerCase()) {
      case 'applied': return 'bg-gradient-to-r from-[#a5b4fc]/20 to-[#c4b5fd]/20 text-[#5b21b6] border border-[#a5b4fc]/30';
      case 'under review': return 'bg-gradient-to-r from-[#fde68a]/20 to-[#fcd34d]/20 text-[#92400e] border border-[#fde68a]/30';
      case 'interview': return 'bg-gradient-to-r from-[#bbf7d0]/20 to-[#86efac]/20 text-[#065f46] border border-[#bbf7d0]/30';
      case 'accepted': return 'bg-gradient-to-r from-[#86efac]/20 to-[#4ade80]/20 text-[#047857] border border-[#86efac]/30';
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
      console.log(`🔄 Retrying fetch for referral job ${jobId}`);
      const jobResponse = await getJobDetails(jobId);
      const jobDetails = jobResponse.data[0];
      
      setReferralJobs(prev => prev.map(job => {
        if (job.jobId === jobId) {
          const companyName = jobDetails.companyPosted?.companyDetails?.companyName || "Company";
          
          // Extract job roles
          const firstJobRole = Array.isArray(jobDetails?.jobRoles) && jobDetails.jobRoles.length > 0 
            ? jobDetails.jobRoles[0] 
            : jobDetails?.jobTitle || "Position";
          
          const jobRolesText = Array.isArray(jobDetails?.jobRoles) && jobDetails.jobRoles.length > 0
            ? jobDetails.jobRoles.join(', ')
            : jobDetails?.jobTitle || "Position";
          
          return {
            ...job,
            company: companyName,
            companyLogo: jobDetails.companyPosted?.profileImageUrl,
            jobTitle: firstJobRole,
            jobRoles: jobRolesText,
            employmentType: Array.isArray(jobDetails?.employmentType) && jobDetails.employmentType.length > 0
              ? jobDetails.employmentType.join(', ')
              : job.employmentType,
            workMode: Array.isArray(jobDetails?.workMode) && jobDetails.workMode.length > 0
              ? jobDetails.workMode.join(', ')
              : job.workMode,
            location: Array.isArray(jobDetails?.location) && jobDetails.location.length > 0 
              ? jobDetails.location.join(', ') 
              : jobDetails?.workLocations || job.location,
            degree: Array.isArray(jobDetails?.degree) && jobDetails.degree.length > 0
              ? jobDetails.degree.join(', ')
              : job.degree,
            skills: Array.isArray(jobDetails?.skills) ? jobDetails.skills : job.skills,
            description: jobDetails?.description || job.description,
            salary: jobDetails?.packageDetails?.totalCTC 
              ? `${jobDetails.packageDetails.currency || ''} ${jobDetails.packageDetails.totalCTC.toLocaleString()}` 
              : job.salary,
            fullJobDetails: jobDetails
          };
        }
        return job;
      }));
      
    } catch (error) {
      console.error(`❌ Failed to retry referral job ${jobId}:`, error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#143694]/10 via-[#f093fb]/5 to-[#1e4ed8]/10">
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#143694]/10 rounded-full blur-3xl"></div>
          <div className="absolute top-1/3 -left-20 w-60 h-60 bg-[#f093fb]/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-1/3 w-40 h-40 bg-[#1e4ed8]/10 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative z-10 flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#143694]"></div>
        </div>
      </div>
    );
  }

  if (error && referralJobs.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#143694]/10 via-[#f093fb]/5 to-[#1e4ed8]/10 flex items-center justify-center p-4">
        <div className="bg-white/90 backdrop-blur-sm border border-white/50 rounded-2xl shadow-lg shadow-purple-50/50 p-6 max-w-md">
          <div className="text-red-500 mb-4 text-center">
            <svg className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2 text-center">Error Loading Applications</h3>
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
                <Award className="h-5 w-5 text-[#143694]" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-[#143694] to-[#1e4ed8] bg-clip-text text-transparent">
                  Referral Application Status
                </h1>
                <p className="text-sm text-gray-600">
                  {referralJobs.length} referral application(s) found
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
                placeholder="Search referral applications..."
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
          {/* Applications List - Now showing 2 per row */}
          <div className="lg:col-span-1">
            <div className="bg-white/90 backdrop-blur-sm border border-white/50 rounded-2xl shadow-lg shadow-purple-50/50 h-full flex flex-col">
              <div className="p-4 border-b border-white/60">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-semibold text-gray-900">Referrals</h2>
                  <span className="text-xs font-medium px-2 py-1 bg-gradient-to-r from-[#143694]/10 to-[#1e4ed8]/10 text-[#143694] rounded-full">
                    {sortedJobs.length}
                    console.log(sortedJobs)
                  </span>
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto p-2">
                
                {sortedJobs.length > 0 ? (
                  <div className="grid grid-cols-2 gap-2">
                    {sortedJobs.map(job => (
                      <button
                        key={job.id}
                        onClick={() => setSelectedJob(job)}
                        className={`text-left p-3 rounded-xl transition-all duration-200 ${
                          selectedJob?.id === job.id 
                            ? 'bg-gradient-to-r from-[#143694]/10 to-[#1e4ed8]/10 border border-[#143694]/20' 
                            : 'hover:bg-white/30 border border-transparent'
                        }`}
                      >
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center gap-2">
                            {job.companyLogo ? (
                              <img 
                                src={job.companyLogo} 
                                alt={job.company}
                                className="w-8 h-8 rounded-lg object-cover border border-white/60"
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                  if (e.target.nextSibling) {
                                    e.target.nextSibling.style.display = 'flex';
                                  }
                                }}
                              />
                            ) : null}
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                              selectedJob?.id === job.id 
                                ? 'bg-gradient-to-br from-[#143694] to-[#1e4ed8] text-white' 
                                : 'bg-white/50 border border-white/60 text-[#143694]'
                            }`}>
                              <span className="text-xs font-bold">{getCompanyInitials(job.company)}</span>
                            </div>
                          </div>
                          <div className="min-w-0">
                            <h3 className="text-sm font-semibold text-gray-900 truncate">{job.company}</h3>
                            <p className="text-xs text-gray-600 truncate">{job.jobTitle}</p>
                            <div className="mt-1.5 flex flex-col gap-1">
                              <div className="flex items-center text-xs text-gray-500">
                                <MapPin className="h-3 w-3 mr-1 text-[#143694]" />
                                <span className="truncate">{job.location}</span>
                              </div>
                              <span className={`text-xs px-1.5 py-0.5 rounded w-fit ${
                                job.status === 'Accepted' ? 'bg-green-100 text-green-700 border border-green-200' :
                                job.status === 'Shortlisted' ? 'bg-amber-100 text-amber-700 border border-amber-200' :
                                job.status === 'Rejected' ? 'bg-red-100 text-red-700 border border-red-200' :
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
                              Retry
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
                    <p className="text-sm text-gray-500">No referral applications found</p>
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
                      <p className="text-sm text-gray-600">{selectedJob.jobRoles}</p>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#143694]/20 to-[#1e4ed8]/20 flex items-center justify-center border border-white/60">
                      <span className="text-lg font-bold text-[#143694]">
                        {getCompanyInitials(selectedJob.company)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="relative">
                    <div className="flex justify-between mb-1">
                      {statusSteps?.slice(0, 4).map((step, idx) => {
                        const currentIdx = getStatusIndex(selectedJob.status);
                        const isActive = idx <= currentIdx;
                        return (
                          <div key={idx} className="flex flex-col items-center" style={{ width: `${100 / 4}%` }}>
                            <div className={`w-6 h-6 rounded-full mb-1 flex items-center justify-center border-2 text-xs ${
                              isActive 
                                ? 'bg-gradient-to-r from-[#143694] to-[#1e4ed8] border-transparent text-white' 
                                : 'bg-white/50 border-white/60 text-gray-400'
                            }`}>
                              {isActive ? <CheckCircle className="h-3 w-3" /> : idx + 1}
                            </div>
                            <span className={`text-xs text-center ${isActive ? 'text-[#143694] font-medium' : 'text-gray-500'}`}>
                              {step.length > 10 ? step.substring(0, 10) + '...' : step}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                    <div className="h-1.5 bg-white/50 absolute left-6 right-6 top-3 -z-10">
                      <div
                        className="h-1.5 bg-gradient-to-r from-[#143694] to-[#1e4ed8] transition-all duration-300 rounded-full"
                        style={{
                          width: `${(getStatusIndex(selectedJob.status) / (statusSteps.length - 1)) * 100}%`
                        }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Job Details Grid */}
                <div className="flex-1 p-5">
                  {/* Row 1: Job Type and Location */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="p-3 bg-gradient-to-r from-white/30 to-white/10 border border-white/60 rounded-xl">
                      <div className="flex items-center gap-2 mb-1">
                        <Briefcase className="h-4 w-4 text-[#143694]" />
                        <span className="text-xs font-medium text-gray-700">Job Type</span>
                      </div>
                      <p className="text-sm text-gray-900">{selectedJob.employmentType}</p>
                    </div>
                    
                    <div className="p-3 bg-gradient-to-r from-white/30 to-white/10 border border-white/60 rounded-xl">
                      <div className="flex items-center gap-2 mb-1">
                        <MapPin className="h-4 w-4 text-[#143694]" />
                        <span className="text-xs font-medium text-gray-700">Location</span>
                      </div>
                      <p className="text-sm text-gray-900">{selectedJob.location}</p>
                    </div>
                  </div>

                  {/* Row 2: Applied Date and Compensation */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="p-3 bg-gradient-to-r from-white/30 to-white/10 border border-white/60 rounded-xl">
                      <div className="flex items-center gap-2 mb-1">
                        <Calendar className="h-4 w-4 text-[#143694]" />
                        <span className="text-xs font-medium text-gray-700">Applied Date</span>
                      </div>
                      <p className="text-sm text-gray-900">{selectedJob.date}</p>
                    </div>
                    
                    {selectedJob.salary && (
                      <div className="p-3 bg-gradient-to-r from-white/30 to-white/10 border border-white/60 rounded-xl">
                        <div className="flex items-center gap-2 mb-1">
                          <svg className="h-4 w-4 text-[#143694]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="text-xs font-medium text-gray-700">Compensation</span>
                        </div>
                        <p className="text-sm text-gray-900">{selectedJob.salary}</p>
                      </div>
                    )}
                  </div>

                  {/* Row 3: Work Mode and Required Skills */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    {/* Work Mode */}
                    {selectedJob.workMode && selectedJob.workMode !== "Not specified" && (
                      <div className="p-3 bg-gradient-to-r from-white/30 to-white/10 border border-white/60 rounded-xl">
                        <div className="flex items-center gap-2 mb-1">
                          <Clock className="h-4 w-4 text-[#143694]" />
                          <span className="text-xs font-medium text-gray-700">Work Mode</span>
                        </div>
                        <p className="text-sm text-gray-900">{selectedJob.workMode}</p>
                      </div>
                    )}
                    
                    {/* Required Skills */}
                    {selectedJob.skills && selectedJob.skills.length > 0 && (
                      <div className={`p-3 bg-gradient-to-r from-white/30 to-white/10 border border-white/60 rounded-xl ${selectedJob.workMode && selectedJob.workMode !== "Not specified" ? 'md:col-span-1' : 'col-span-2'}`}>
                        <div className="flex items-center gap-2 mb-2">
                          <svg className="h-4 w-4 text-[#143694]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                          <span className="text-xs font-medium text-gray-700">Required Skills</span>
                        </div>
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
                    )}
                  </div>

                  {/* Row 4: Description (Full width) */}
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
                    <Link 
                      to={`/${localStorage.getItem("selectedRole")}-dashboard/Referral/${selectedJob?.fullJobDetails?._id || selectedJob.jobId || selectedJob.id}?isApplied=true`} 
                      className="inline-flex items-center justify-center w-full px-4 py-2.5 bg-gradient-to-r from-[#143694] to-[#1e4ed8] text-white text-sm rounded-xl hover:shadow-lg hover:shadow-[#143694]/40 transition-all duration-300 group"
                    >
                      View Full Details
                      <ArrowRight className="h-3.5 w-3.5 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                    </Link>
                  </div>
                </div>
              </div>
            ) : referralJobs.length === 0 ? (
              <div className="bg-white/90 backdrop-blur-sm border border-white/50 rounded-2xl shadow-lg shadow-purple-50/50 h-full flex flex-col items-center justify-center p-6">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-white/50 to-white/30 border border-white/60 mb-4">
                  <Award className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Referral Applications</h3>
                <p className="text-sm text-gray-600 text-center">
                  You haven't applied to any referral opportunities yet.
                </p>
              </div>
            ) : (
              <div className="bg-white/90 backdrop-blur-sm border border-white/50 rounded-2xl shadow-lg shadow-purple-50/50 h-full flex flex-col items-center justify-center p-6">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-white/50 to-white/30 border border-white/60 mb-4">
                  <Award className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Select a Referral Application</h3>
                <p className="text-sm text-gray-600 text-center">
                  Choose a referral application from the list to view detailed status
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReferralStatus;