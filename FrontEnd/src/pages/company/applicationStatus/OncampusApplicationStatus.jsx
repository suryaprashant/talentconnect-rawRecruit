import { useEffect, useState } from 'react';
import { Search, MapPin, Clock, Calendar, Briefcase, Users, CheckCircle, XCircle, ArrowRight, GraduationCap } from 'lucide-react';
import { getUserApplicationStatus } from '@/lib/User_AxiosInstance';
import { getOnCampusJobById } from '@/lib/College_AxiosIntance';
import CollegeDetailModal from '@/components/company/employerDashboard/CollegeDetailModal';
import { useNavigate } from 'react-router-dom'; // <--- ADD THIS
const onCampusStatusSteps = ["Applied", "Shortlisted", "Accepted"];

export default function OncampusApplicationStatus() {
  const navigate = useNavigate(); // <--- ADD THIS
  const [oncampusJobs, setOncampusJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalCollege, setModalCollege] = useState(null);

  // Helper functions to extract college data
  const extractCollegeName = (jobDetails) => {
    if (!jobDetails) return "College";
    
    // Try from collegePosted first
    if (jobDetails.collegePosted?.collegeUniversityDetails?.collegeName) {
      return jobDetails.collegePosted.collegeUniversityDetails.collegeName;
    }
    
    // Try from collegePosted directly
    if (jobDetails.collegePosted?.collegeName) {
      return jobDetails.collegePosted.collegeName;
    }
    
    // Try from postedBy
    if (jobDetails.postedBy?.collegeName) {
      return jobDetails.postedBy.collegeName;
    }
    
    // Try from title/name
    if (jobDetails.title) {
      return jobDetails.title;
    }
    
    return "College";
  };

  const extractCollegeLogo = (jobDetails) => {
    if (!jobDetails) return null;
    
    return jobDetails.collegePosted?.profileImageUrl || 
           jobDetails.collegePosted?.profileImage || 
           jobDetails.companyPosted?.profileImageUrl ||
           null;
  };

  const extractDegree = (jobDetails) => {
    if (!jobDetails) return "Various Streams";
    
    if (Array.isArray(jobDetails.studentStreams) && jobDetails.studentStreams.length > 0) {
      return jobDetails.studentStreams.join(", ");
    }
    if (Array.isArray(jobDetails.degree) && jobDetails.degree.length > 0) {
      return jobDetails.degree.join(", ");
    }
    if (Array.isArray(jobDetails.degreeType) && jobDetails.degreeType.length > 0) {
      return jobDetails.degreeType.join(", ");
    }
    
    return "Various Streams";
  };

  const fetchApplication = async () => {
  try {
    setLoading(true);
    setError(null);
    
    const response = await getUserApplicationStatus("On-campus");
    console.log("🔍 Step 1 - On-campus Application list response:", response);
    
    const rawData = response.data?.data || [];
    console.log(`🔍 Found ${rawData.length} on-campus applications`);
    
    if (rawData.length === 0) {
      setOncampusJobs([]);
      setLoading(false);
      return;
    }
    
    // Filter out jobs with invalid IDs first
    const validJobs = rawData.filter(item => {
      const jobId = item.job || item.jobDetails?.[0]?._id || item._id;
      return jobId && jobId.length > 0;
    });
    
    console.log(`🔍 Valid jobs after filtering: ${validJobs.length}`);
    
    const detailedJobs = await Promise.all(
  validJobs.map(async (item, index) => {
    try {
      const jobDetails = item.jobDetails;
      const collegeDetails = item.collegeDetails;

      // 🔒 safety check
      if (!jobDetails || !collegeDetails) {
        console.warn("Missing job or college details", item);
        return null;
      }

      const collegeName =
        collegeDetails?.collegeUniversityDetails?.collegeName || "College";

      const location =
        Array.isArray(jobDetails.location) && jobDetails.location.length > 0
          ? jobDetails.location.join(", ")
          : "Location not specified";

      const degree =
        Array.isArray(jobDetails.degree) && jobDetails.degree.length > 0
          ? jobDetails.degree.join(", ")
          : "Various Streams";

      const employmentType =
        Array.isArray(jobDetails.employmentType) && jobDetails.employmentType.length > 0
          ? jobDetails.employmentType.join(", ")
          : "Full-time";

      return {
        ...item,
        id: item._id,
        jobId: item.job,

        status: item.currentStatus,
        date: new Date(item.createdAt).toLocaleDateString(),

        collegeName,
        collegeLogo: collegeDetails.profileImage || null,

        location,
        degree,
        employmentType,

        skills: jobDetails.skills || [],
        description: jobDetails.description || "No description available",

        // ⭐ THIS feeds BOTH page + modal
        fullJobDetails: {
          ...jobDetails,
          collegePosted: collegeDetails
        }
      };

    } catch (error) {
      console.error("❌ Error mapping application:", error);
      return null;
    }
  })
);

    
    console.log("✅ Step 3 - Final detailed on-campus jobs:", detailedJobs);
    
    // Filter out any null/undefined entries
    const validDetailedJobs = detailedJobs.filter(job => job !== null && job !== undefined);
    
    setOncampusJobs(validDetailedJobs);
    if (validDetailedJobs.length > 0) {
      setSelectedJob(validDetailedJobs[0]);
    }
    
  } catch (error) {
    console.error("❌ Error in fetchApplication:", error);
    setError(error.message || "Failed to fetch applications");
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

  const handleViewFullDetails = (job) => {
  if (!job?.fullJobDetails) {
    alert("College details not available");
    return;
  }

  setModalCollege({
    ...job.fullJobDetails,
    isApplied: true,
    currentStatus: job.status,
    applicationDate: job.date
  });

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
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#1e4ed8] mx-auto"></div>
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
      {/* <div className="container mx-auto px-4 pt-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 px-6 py-5 mb-2">
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-2xl font-bold text-[#00153d]">Your Application Status</h2>
            <span className="flex items-center justify-center w-6 h-6 bg-[#1a3a8a] text-white text-xs font-bold rounded-full">
              {oncampusJobs.length}
            </span>
          </div>
          
          
        </div>
      </div> */}
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="bg-white/90 backdrop-blur-sm border border-white/60 rounded-2xl shadow-lg p-5 mt-3 mb-8">

          {/* Top Section */}
          <div className="flex items-start justify-between gap-4 mb-4 flex-wrap">

            {/* Left: Title */}
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-gradient-to-br from-[#143694]/20 to-[#1e4ed8]/20 rounded-lg">
                <Users className="h-5 w-5 text-[#143694]" />
              </div>

              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-[#143694] to-[#1e4ed8] bg-clip-text text-transparent">
                  On-Campus College Applications
                </h1>
                <p className="text-sm text-gray-600">
                  {oncampusJobs.length} college application(s) found
                </p>
              </div>
            </div>

            {/* Right: Search */}
            <div className="relative w-full sm:w-80">
              <div className= "absolute left-2 top-1/2 -translate-y-1/2 p-1.5 z-10">
                <Search className="h-4 w-4 text-gray-700" />
              </div>
              <input
                type="text"
                placeholder="Search by college name, degree, or location..."
                className="w-full pl-10 pr-4 py-2.5 bg-white/50 backdrop-blur-sm border border-[#1e4ed8] rounded-xl focus:ring-2 focus:ring-[#143694] focus:border-transparent focus:outline-none text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Bottom Tabs */}
          <div className="flex items-center gap-4 border-gray-200 pt-0">

            {/* Active */}
            <button className="px-6 py-2 bg-[#1a3a8a] text-white rounded-full font-medium text-sm shadow-md">
              On-Campus
            </button>

            {/* Navigate */}
            <button
              onClick={() => navigate('/company/application-status/poolcampus')}
              className="px-6 py-2 text-gray-500 hover:text-[#1a3a8a] font-medium text-sm transition-all"
            >
              Pool-Campus
            </button>

          </div>
        </div>

        {/* Main Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Applications List */}
          <div className="lg:col-span-1">
            <div className="bg-white/90 backdrop-blur-sm border border-white/60 rounded-2xl shadow-lg h-full flex flex-col">
              <div className="p-4 border-b border-white/60">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-semibold text-gray-900">College Applications</h2>
                  <span className="text-xs font-medium px-2 py-1 bg-gradient-to-r from-[#143694]/10 to-[#1e4ed8]/10 text-[#143694] rounded-full">
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
                            ? 'bg-gradient-to-r from-[#143694]/10 to-[#1e4ed8]/10 border border-[#143694]/20' 
                            : 'hover:bg-white/30 border border-transparent'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          {/* College Logo/Initials */}
                          {job.collegeLogo ? (
                            <div className="relative w-9 h-9">
                              <img 
                                src={job.collegeLogo} 
                                alt={job.collegeName}
                                className="w-full h-full rounded-lg object-cover border border-gray-200"
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                  const initialsDiv = e.target.nextElementSibling;
                                  if (initialsDiv && initialsDiv.classList.contains('initials-fallback')) {
                                    initialsDiv.style.display = 'flex';
                                  }
                                }}
                              />
                              {/* Fallback initials */}
                              <div 
                                className={`initials-fallback absolute inset-0 rounded-lg flex items-center justify-center ${
                                  selectedJob?.id === job.id 
                                    ? 'bg-gradient-to-br from-[#143694] to-[#1e4ed8] text-white' 
                                    : 'bg-gradient-to-br from-gray-100 to-gray-200 text-gray-700'
                                }`}
                                style={{ display: 'none' }}
                              >
                                <span className="text-xs font-bold">{getCollegeInitials(job.collegeName)}</span>
                              </div>
                            </div>
                          ) : (
                            <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                              selectedJob?.id === job.id 
                                ? 'bg-gradient-to-br from-[#143694] to-[#1e4ed8] text-white' 
                                : 'bg-gradient-to-br from-gray-100 to-gray-200 text-gray-700'
                            }`}>
                              <span className="text-xs font-bold">{getCollegeInitials(job.collegeName)}</span>
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <h3 className="text-sm font-semibold text-gray-900 truncate">
                              {job.collegeName}
                            </h3>
                            <div className="flex items-center gap-1 mt-1">
                              <GraduationCap className="h-3 w-3 text-gray-500" />
                              <p className="text-xs text-gray-600 truncate">{job.degree}</p>
                            </div>
                            <div className="mt-1.5 flex items-center text-xs text-gray-500 gap-2">
                              <span className="inline-flex items-center">
                                <MapPin className="h-3 w-3 mr-1" />
                                {job.location}
                              </span>
                              <span className={`text-xs px-1.5 py-0.5 rounded ${
                                job.status === 'Accepted' ? 'bg-green-100 text-green-700 border border-green-200' :
                                job.status === 'Shortlisted' ? 'bg-amber-100 text-amber-700 border border-amber-200' :
                                job.status === 'Rejected' ? 'bg-red-100 text-red-700 border border-red-200' :
                                'bg-blue-100 text-[#143694] border border-blue-200'
                              }`}>
                                {job.status}
                              </span>
                            </div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="p-6 text-center">
                    <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-gray-100 to-gray-200 mb-3">
                      <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <p className="text-sm text-gray-500">No college applications found</p>
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
                      <div className="flex items-center gap-2 mt-1">
                        <GraduationCap className="h-4 w-4 text-[#143694]" />
                        <p className="text-sm text-gray-600">{selectedJob.degree}</p>
                      </div>
                    </div>
                    {/* College Logo */}
                    {selectedJob.collegeLogo ? (
                      <div className="relative w-12 h-12">
                        <img 
                          src={selectedJob.collegeLogo} 
                          alt={selectedJob.collegeName}
                          className="w-full h-full rounded-xl object-cover border border-white/60"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            const initialsDiv = e.target.nextElementSibling;
                            if (initialsDiv) {
                              initialsDiv.style.display = 'flex';
                            }
                          }}
                        />
                        {/* Fallback initials */}
                        <div 
                          className="initials-fallback absolute inset-0 rounded-xl bg-gradient-to-br from-[#143694]/20 to-[#1e4ed8]/20 flex items-center justify-center"
                          style={{ display: 'none' }}
                        >
                          <span className="text-lg font-bold text-[#143694]">
                            {getCollegeInitials(selectedJob.collegeName)}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#143694]/20 to-[#1e4ed8]/20 flex items-center justify-center">
                        <span className="text-lg font-bold text-[#143694]">
                          {getCollegeInitials(selectedJob.collegeName)}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  {/* Status bar */}
                  {selectedJob.status.toLowerCase() === 'rejected' ? (
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
                    <div className="relative">
                      <div className="flex justify-between mb-1">
                        {onCampusStatusSteps.map((step, idx) => {
                          const currentIdx = getStatusIndex(selectedJob.status);
                          const isActive = idx <= currentIdx;
                          return (
                            <div key={idx} className="flex flex-col items-center" style={{ width: `${100 / 3}%` }}>
                              <div className={`w-8 h-8 rounded-full mb-1 flex items-center justify-center border-2 text-xs ${
                                isActive 
                                  ? 'bg-gradient-to-r from-[#143694] to-[#1e4ed8] border-[#143694] text-white'
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
                        <Briefcase className="h-4 w-4 text-[#143694]" />
                        <span className="text-xs font-medium text-gray-700">Employment Type</span>
                      </div>
                      <p className="text-sm text-gray-900">{selectedJob.employmentType}</p>
                    </div>
                    
                    <div className="p-3 bg-gradient-to-r from-white/30 to-white/10 border border-white/60 rounded-xl">
                      <div className="flex items-center gap-2 mb-1">
                        <GraduationCap className="h-4 w-4 text-[#143694]" />
                        <span className="text-xs font-medium text-gray-700">Streams/Degree</span>
                      </div>
                      <p className="text-sm text-gray-900">{selectedJob.degree}</p>
                    </div>
                    
                    <div className="p-3 bg-gradient-to-r from-white/30 to-white/10 border border-white/60 rounded-xl">
                      <div className="flex items-center gap-2 mb-1">
                        <MapPin className="h-4 w-4 text-[#143694]" />
                        <span className="text-xs font-medium text-gray-700">Location</span>
                      </div>
                      <p className="text-sm text-gray-900">{selectedJob.location}</p>
                    </div>
                    
                    <div className="p-3 bg-gradient-to-r from-white/30 to-white/10 border border-white/60 rounded-xl">
                      <div className="flex items-center gap-2 mb-1">
                        <Calendar className="h-4 w-4 text-[#143694]" />
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
                      className="inline-flex items-center justify-center w-full px-4 py-2.5 bg-gradient-to-r from-[#143694] to-[#1e4ed8] text-white text-sm rounded-xl hover:shadow-lg hover:shadow-[#143694]/40 transition-all duration-300"
                    >
                      View College Details
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
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Select a College Application</h3>
                <p className="text-sm text-gray-600 text-center">
                  Choose an on-campus application from the list to view detailed status
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
            {isModalOpen && (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
    <div 
      className="absolute inset-0 bg-black/50 backdrop-blur-sm" 
      onClick={handleCloseModal}
    />
    <div className="relative z-10 w-full max-w-6xl h-[90vh] overflow-y-auto rounded-2xl bg-white">
      {modalCollege ? (
        <CollegeDetailModal
          college={modalCollege}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          isApplied={true}
        />
      ) : (
        <div className="p-6 text-center">
          <div className="text-red-500 mb-4">
            <XCircle className="h-12 w-12 mx-auto" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Unable to Load Details</h3>
          <p className="text-gray-600 mb-4">College information is incomplete.</p>
          <button
            onClick={handleCloseModal}
            className="px-4 py-2 bg-[#1e4ed8] text-white rounded-lg"
          >
            Close
          </button>
        </div>
      )}
    </div>
  </div>
)}
    </div>
  );
}