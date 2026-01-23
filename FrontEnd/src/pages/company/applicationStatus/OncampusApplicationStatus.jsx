import { useEffect, useState } from 'react';
import { Search, MapPin, Clock, Calendar, Briefcase, Users, CheckCircle, XCircle, ArrowRight, GraduationCap } from 'lucide-react';
import { getUserApplicationStatus } from '@/lib/User_AxiosInstance';
import { getOnCampusJobById } from '@/lib/College_AxiosIntance'; // Make sure this exists
import CollegeDetailModal from '@/components/company/employerDashboard/CollegeDetailModal';

const onCampusStatusSteps = ["Applied", "Shortlisted", "Accepted"];

export default function OncampusApplicationStatus() {
  const [oncampusJobs, setOncampusJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalCollege, setModalCollege] = useState(null);

  const fetchApplication = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await getUserApplicationStatus("On-campus");
      console.log("🔍 Step 1 - On-campus Application list response:", response);
      
      if (!response || !response.data) {
        throw new Error("No response from API");
      }
      
      const rawData = response.data?.data || [];
      console.log(`🔍 Found ${rawData.length} on-campus applications`);
      
      if (rawData.length === 0) {
        setOncampusJobs([]);
        setLoading(false);
        return;
      }
      
      console.log("🔍 Step 2 - Fetching job details for each application...");
      
      const detailedJobs = await Promise.all(
        rawData.map(async (item) => {
          try {
            const jobId = item.job || item.jobDetails?.[0]?._id || item._id;
            console.log(`🔍 Fetching on-campus job details for jobId: ${jobId}`);
            
            const jobResponse = await getOnCampusJobById(jobId);
            const jobDetails = jobResponse.data;
            
            console.log(`✅ Successfully fetched job ${jobId}:`, {
              collegeName: jobDetails.collegePosted?.collegeUniversityDetails?.collegeName,
              degree: jobDetails.degree || jobDetails.studentStreams?.[0]
            });
            
            // Extract college details
            const collegeName = item.companyProfile?.companyDetails?.companyName || 
                                jobDetails.collegePosted?.collegeUniversityDetails?.collegeName || 
                                "College";
            
            const collegeLogo = item.companyProfile?.profileImage || 
                                item.companyProfile?.profileImageUrl || 
                                jobDetails.collegePosted?.profileImageUrl || 
                                jobDetails.collegePosted?.profileImage || 
                                null;
            
            const location = jobDetails?.venue || 
                             jobDetails?.location?.join(', ') || 
                             "Location not specified";
            
            // Use degree/streams instead of job title
            const degree = Array.isArray(jobDetails?.studentStreams) && jobDetails.studentStreams.length > 0
              ? jobDetails.studentStreams.join(", ")
              : Array.isArray(jobDetails?.degree) && jobDetails.degree.length > 0
              ? jobDetails.degree.join(", ")
              : "Degree not specified";
            
            const employmentType = Array.isArray(jobDetails?.employmentType) && jobDetails.employmentType.length > 0
              ? jobDetails.employmentType[0]
              : "Full-time";
            
            const skills = Array.isArray(jobDetails?.skills) ? jobDetails.skills : [];
            const description = jobDetails?.description || "No description available";
            
            return {
              ...item,
              id: item._id,
              jobId: jobId,
              status: item.currentStatus || item.status || "Applied",
              date: item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "N/A",
              collegeName: collegeName,
              collegeLogo: collegeLogo,
              location: location,
              degree: degree,
              employmentType: employmentType,
              skills: skills,
              description: description,
              fullJobDetails: jobDetails,
              _debug: {
                jobId: jobId,
                hasCollegePosted: !!jobDetails.collegePosted,
                collegeNameFound: collegeName !== "College"
              }
            };
            
          } catch (jobError) {
            console.error(`❌ Error fetching on-campus job ${item.job}:`, jobError);
            return {
              ...item,
              id: item._id,
              status: item.currentStatus || item.status || "Applied",
              date: item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "N/A",
              collegeName: "College",
              collegeLogo: null,
              location: "Location not specified",
              degree: "Degree not specified",
              employmentType: "Full-time",
              skills: [],
              description: "No description available",
              fullJobDetails: null,
              _debug: { error: jobError.message }
            };
          }
        })
      );
      
      console.log("✅ Step 3 - Final detailed on-campus jobs:", detailedJobs);
      setOncampusJobs(detailedJobs);
      if (detailedJobs.length > 0) {
        setSelectedJob(detailedJobs[0]);
      }
      
    } catch (error) {
      console.error("❌ Error in fetchApplication:", error);
      setError(error.message || "Failed to fetch applications");
      
      // Fallback to basic data if available
      if (error.response?.data?.data) {
        const rawData = error.response.data.data;
        const fallbackJobs = rawData.map(item => ({
          ...item,
          id: item._id,
          status: item.currentStatus || "Applied",
          date: item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "N/A",
          collegeName: item.company || "College",
          collegeLogo: null,
          location: item.location || "Location not specified",
          degree: "Degree not specified",
          employmentType: "Full-time",
          skills: [],
          description: "No description available"
        }));
        setOncampusJobs(fallbackJobs);
        if (fallbackJobs.length > 0) setSelectedJob(fallbackJobs[0]);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplication();
  }, []);

  const filteredJobs = oncampusJobs.filter(job =>
    (job?.degree?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
    (job?.collegeName?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
    (job?.location?.toLowerCase() || "").includes(searchTerm.toLowerCase())
  );

  const getStatusIndex = (status) => {
    if (!status) return 0;
    const lowerStatus = status.toLowerCase();
    
    if (lowerStatus === 'rejected') return 0;
    if (lowerStatus === 'applied') return 0;
    if (lowerStatus === 'shortlisted') return 1;
    if (lowerStatus === 'accepted') return 2;
    
    return 0;
  };

  const getCollegeInitials = (collegeName) => {
    if (!collegeName || collegeName === "College") return "CO";
    const words = collegeName.split(' ').filter(word => word.length > 0);
    if (words.length === 1) return words[0].substring(0, 2).toUpperCase();
    return (words[0].charAt(0) + words[1].charAt(0)).toUpperCase();
  };

  const retryFetchJob = async (jobId) => {
    try {
      console.log(`🔄 Retrying fetch for on-campus job ${jobId}`);
      const jobResponse = await getOnCampusJobById(jobId);
      const jobDetails = jobResponse.data;
      
      setOncampusJobs(prev => prev.map(job => {
        if (job.jobId === jobId) {
          const collegeName = jobDetails.collegePosted?.collegeUniversityDetails?.collegeName || "College";
          console.log(`✅ Updated on-campus job ${jobId}: ${collegeName}`);
          
          const degree = Array.isArray(jobDetails?.studentStreams) && jobDetails.studentStreams.length > 0
            ? jobDetails.studentStreams.join(", ")
            : Array.isArray(jobDetails?.degree) && jobDetails.degree.length > 0
            ? jobDetails.degree.join(", ")
            : "Degree not specified";
          
          return {
            ...job,
            collegeName: collegeName,
            collegeLogo: jobDetails.collegePosted?.profileImageUrl || jobDetails.collegePosted?.profileImage,
            location: jobDetails?.venue || jobDetails?.location?.join(', ') || job.location,
            degree: degree,
            employmentType: Array.isArray(jobDetails?.employmentType) && jobDetails.employmentType.length > 0
              ? jobDetails.employmentType[0]
              : job.employmentType,
            skills: Array.isArray(jobDetails?.skills) ? jobDetails.skills : job.skills,
            description: jobDetails?.description || job.description,
            fullJobDetails: jobDetails
          };
        }
        return job;
      }));
      
    } catch (error) {
      console.error(`❌ Failed to retry on-campus job ${jobId}:`, error);
    }
  };

  const handleViewFullDetails = (job) => {
    console.log('Opening modal for job:', job?.collegeName);
    setModalCollege(job.fullJobDetails || job);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setModalCollege(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f0e6f7]/60 via-[#d4e8f9]/55 to-[#cff7ea]/60 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#3b82f6] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading on-campus applications...</p>
        </div>
      </div>
    );
  }

  if (error && oncampusJobs.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f0e6f7]/60 via-[#d4e8f9]/55 to-[#cff7ea]/60 flex items-center justify-center p-4">
        <div className="bg-white/90 backdrop-blur-sm border border-white/60 rounded-2xl shadow-lg p-6 max-w-md">
          <div className="text-red-500 mb-4 text-center">
            <svg className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2 text-center">Error Loading Applications</h3>
          <p className="text-sm text-gray-600 mb-4 text-center">{error}</p>
          <button
            onClick={fetchApplication}
            className="w-full px-4 py-2 bg-gradient-to-r from-[#93c5fd] to-[#3b82f6] text-white rounded-xl hover:shadow-lg hover:shadow-[#93c5fd]/40 transition-all duration-300"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#667eea]/10 via-[#f093fb]/5 to-[#764ba2]/10">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="bg-white/90 backdrop-blur-sm border border-white/60 rounded-2xl shadow-lg p-5 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-gradient-to-br from-[#667eea]/20 to-[#764ba2]/20 rounded-lg">
                <Users className="h-5 w-5 text-[#667eea]" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent">
                  On-Campus Application Status
                </h1>
                <p className="text-sm text-gray-600">
                  {oncampusJobs.length} application(s) found
                </p>
              </div>
            </div>
          </div>
          
          {/* Search */}
          <div className="relative">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search on-campus applications..."
              className="w-full pl-10 pr-4 py-2.5 bg-white/50 backdrop-blur-sm border border-white/60 rounded-xl focus:ring-2 focus:ring-[#667eea] focus:border-transparent focus:outline-none text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Main Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Applications List */}
          <div className="lg:col-span-1">
            <div className="bg-white/90 backdrop-blur-sm border border-white/60 rounded-2xl shadow-lg h-full flex flex-col">
              <div className="p-4 border-b border-white/60">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-semibold text-gray-900">On-Campus Applications</h2>
                  <span className="text-xs font-medium px-2 py-1 bg-gradient-to-r from-[#667eea]/10 to-[#764ba2]/10 text-[#667eea] rounded-full">
                    {filteredJobs.length}
                  </span>
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto p-2">
                {filteredJobs.length > 0 ? (
                  <div className="space-y-2">
                    {filteredJobs.map(job => (
                      <button
                        key={job.id}
                        onClick={() => setSelectedJob(job)}
                        className={`w-full text-left p-3 rounded-xl transition-all duration-200 ${
                          selectedJob?.id === job.id 
                            ? 'bg-gradient-to-r from-[#667eea]/10 to-[#764ba2]/10 border border-[#667eea]/20' 
                            : 'hover:bg-white/30 border border-transparent'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          {/* Logo Container */}
                          <div className="w-9 h-9 flex-shrink-0 relative">
                            {job.collegeLogo ? (
                              <img 
                                src={job.collegeLogo} 
                                alt={job.collegeName}
                                className="w-9 h-9 rounded-lg object-cover border border-white/60 absolute inset-0 z-10"
                                onError={(e) => { e.target.style.display = 'none'; }}
                              />
                            ) : null}
                            <div className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold text-xs ${
                              selectedJob?.id === job.id 
                                ? 'bg-gradient-to-br from-[#667eea] to-[#764ba2] text-white' 
                                : 'bg-white/50 border border-white/60 text-[#667eea]'
                            }`}>
                              {getCollegeInitials(job.collegeName)}
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-sm font-semibold text-gray-900 truncate">
                              {job.collegeName}
                              {job._debug?.collegeNameFound === false && (
                                <span className="ml-1 text-xs text-red-500" title="Could not fetch college name">
                                  ⚠️
                                </span>
                              )}
                            </h3>
                            <p className="text-xs text-gray-600 truncate">{job.degree}</p>
                            <div className="mt-1.5 flex items-center text-xs text-gray-500 gap-2">
                              <span className="inline-flex items-center">
                                <MapPin className="h-3 w-3 mr-1 text-[#667eea]" />
                                {job.location}
                              </span>
                              <span className={`text-xs px-1.5 py-0.5 rounded ${
                                job.status === 'Accepted' ? 'bg-green-100 text-green-700 border border-green-200' :
                                job.status === 'Shortlisted' ? 'bg-amber-100 text-amber-700 border border-amber-200' :
                                job.status === 'Rejected' ? 'bg-red-100 text-red-700 border border-red-200' :
                                'bg-blue-100 text-blue-700 border border-blue-200'
                              }`}>
                                {job.status}
                              </span>
                            </div>
                          </div>
                        </div>
                        {/* Debug retry button for failed fetches */}
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
                    <p className="text-sm text-gray-500">No on-campus applications found</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Status and Details */}
          <div className="lg:col-span-2">
            {selectedJob ? (
              <div className="bg-white/90 backdrop-blur-sm border border-white/60 rounded-2xl shadow-lg h-full flex flex-col">
                {/* Status Progress */}
                <div className="p-5 border-b border-white/60">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h2 className="text-lg font-bold text-gray-900">{selectedJob.collegeName}</h2>
                      <p className="text-sm text-gray-600">{selectedJob.degree}</p>
                    </div>
                    <div className="w-12 h-12 flex-shrink-0 relative">
                      {selectedJob.collegeLogo ? (
                        <img 
                          src={selectedJob.collegeLogo} 
                          alt={selectedJob.collegeName}
                          className="w-12 h-12 rounded-xl object-cover border border-white/60 absolute inset-0 z-10"
                          onError={(e) => { e.target.style.display = 'none'; }}
                        />
                      ) : null}
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#667eea]/20 to-[#764ba2]/20 flex items-center justify-center border border-white/60 font-bold text-lg text-[#667eea]">
                        {getCollegeInitials(selectedJob.collegeName)}
                      </div>
                    </div>
                  </div>
                  
                  {selectedJob.status.toLowerCase() === 'rejected' ? (
                    // Rejected Status - Simple 2-step bar
                    <div className="relative">
                      <div className="flex justify-between mb-1">
                        <div className="flex flex-col items-center" style={{ width: '50%' }}>
                          <div className="w-8 h-8 rounded-full mb-1 flex items-center justify-center border-2 bg-red-100 border-red-300 text-red-700">
                            <XCircle className="h-4 w-4" />
                          </div>
                          <span className="text-xs text-center text-red-700 font-medium">
                            Applied
                          </span>
                        </div>
                        <div className="flex flex-col items-center" style={{ width: '50%' }}>
                          <div className="w-8 h-8 rounded-full mb-1 flex items-center justify-center border-2 bg-red-500 border-red-500 text-white">
                            <XCircle className="h-4 w-4" />
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
                    // Normal Status Flow - 3-step bar
                    <div className="relative">
                      <div className="flex justify-between mb-1">
                        {onCampusStatusSteps.map((step, idx) => {
                          const currentIdx = getStatusIndex(selectedJob.status);
                          const isActive = idx <= currentIdx;
                          return (
                            <div key={idx} className="flex flex-col items-center" style={{ width: `${100 / 3}%` }}>
                              <div className={`w-8 h-8 rounded-full mb-1 flex items-center justify-center border-2 text-xs ${
                                isActive 
                                  ? 'bg-[#667eea] border-[#667eea] text-white'
                                  : 'bg-white/50 border-white/60 text-gray-400'
                              }`}>
                                {isActive ? <CheckCircle className="h-4 w-4" /> : idx + 1}
                              </div>
                              <span className={`text-xs text-center ${isActive ? 'text-[#667eea] font-medium' : 'text-gray-500'}`}>
                                {step}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                      <div className="h-1.5 bg-white/50 absolute left-[16.5%] right-[16.5%] top-4 -z-10">
                        <div
                          className="h-1.5 bg-gradient-to-r from-[#667eea] to-[#764ba2] transition-all duration-300 rounded-full"
                          style={{
                            width: `${(getStatusIndex(selectedJob.status) / (onCampusStatusSteps.length - 1)) * 100}%`
                          }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>

                {/* College Details Grid */}
                <div className="flex-1 p-5">
                  <div className="grid grid-cols-2 gap-4 mb-5">
                    <div className="p-3 bg-gradient-to-r from-white/30 to-white/10 border border-white/60 rounded-xl">
                      <div className="flex items-center gap-2 mb-1">
                        <Briefcase className="h-4 w-4 text-[#667eea]" />
                        <span className="text-xs font-medium text-gray-700">Employment Type</span>
                      </div>
                      <p className="text-sm text-gray-900">{selectedJob.employmentType}</p>
                    </div>
                    
                    <div className="p-3 bg-gradient-to-r from-white/30 to-white/10 border border-white/60 rounded-xl">
                      <div className="flex items-center gap-2 mb-1">
                        <GraduationCap className="h-4 w-4 text-[#667eea]" />
                        <span className="text-xs font-medium text-gray-700">Degree/Stream</span>
                      </div>
                      <p className="text-sm text-gray-900">{selectedJob.degree}</p>
                    </div>
                    
                    <div className="p-3 bg-gradient-to-r from-white/30 to-white/10 border border-white/60 rounded-xl">
                      <div className="flex items-center gap-2 mb-1">
                        <MapPin className="h-4 w-4 text-[#667eea]" />
                        <span className="text-xs font-medium text-gray-700">Location</span>
                      </div>
                      <p className="text-sm text-gray-900">{selectedJob.location}</p>
                    </div>
                    
                    <div className="p-3 bg-gradient-to-r from-white/30 to-white/10 border border-white/60 rounded-xl">
                      <div className="flex items-center gap-2 mb-1">
                        <Calendar className="h-4 w-4 text-[#667eea]" />
                        <span className="text-xs font-medium text-gray-700">Applied</span>
                      </div>
                      <p className="text-sm text-gray-900">{selectedJob.date}</p>
                    </div>
                  </div>

                  {/* Skills */}
                  {selectedJob.skills && selectedJob.skills.length > 0 && (
                    <div className="mb-5">
                      <h3 className="text-sm font-medium text-gray-700 mb-2">Required Skills</h3>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedJob.skills.slice(0, 5).map((skill, index) => (
                          <span key={index} className="px-2 py-1 bg-white/80 text-gray-700 rounded-lg text-xs font-medium border border-white/60">
                            {skill}
                          </span>
                        ))}
                        {selectedJob.skills.length > 5 && (
                          <span className="px-2 py-1 bg-white/80 text-gray-700 rounded-lg text-xs font-medium border border-white/60">
                            +{selectedJob.skills.length - 5} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Description */}
                  <div className="mb-5">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Description</h3>
                    <div className="p-3 bg-gradient-to-r from-white/30 to-white/10 border border-white/60 rounded-xl">
                      <p className="text-sm text-gray-700 line-clamp-3">
                        {selectedJob.description}
                      </p>
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="mt-auto">
                    <button 
                      onClick={() => handleViewFullDetails(selectedJob)}
                      className="inline-flex items-center justify-center w-full px-4 py-2.5 bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white text-sm rounded-xl hover:shadow-lg hover:shadow-[#667eea]/40 transition-all duration-300"
                    >
                      View Full Details
                      <ArrowRight className="h-3.5 w-3.5 ml-2" />
                    </button>
                  </div>
                </div>
              </div>
            ) : oncampusJobs.length === 0 ? (
              <div className="bg-white/90 backdrop-blur-sm border border-white/60 rounded-2xl shadow-lg h-full flex flex-col items-center justify-center p-6">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-white/50 to-white/30 border border-white/60 mb-4">
                  <Users className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No On-Campus Applications</h3>
                <p className="text-sm text-gray-600 text-center">
                  You haven't applied to any on-campus drives yet.
                </p>
              </div>
            ) : (
              <div className="bg-white/90 backdrop-blur-sm border border-white/60 rounded-2xl shadow-lg h-full flex flex-col items-center justify-center p-6">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-white/50 to-white/30 border border-white/60 mb-4">
                  <Users className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Select an Application</h3>
                <p className="text-sm text-gray-600 text-center">
                  Choose an on-campus application from the list to view detailed status
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Modal - Just like the Pool Campus version */}
      {isModalOpen && modalCollege && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm" 
            onClick={handleCloseModal}
          />
          <div className="relative z-10 w-full max-w-6xl h-[90vh] overflow-y-auto rounded-2xl bg-white">
            <CollegeDetailModal
              college={modalCollege}
              isOpen={isModalOpen}
              onClose={handleCloseModal}
              isApplied={true}
            />
          </div>
        </div>
      )}
    </div>
  );
}