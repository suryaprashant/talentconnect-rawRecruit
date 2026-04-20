// import { useEffect, useState } from 'react';
// import { Search, MapPin, Clock } from 'lucide-react';
// import { statusSteps, similarJobs } from '../../../constants/data.js';
// import { getUserApplicationStatus } from '@/lib/User_AxiosInstance';
// import { Link } from 'react-router-dom';

// export default function PoolcampusApplicationStatus() {
//   const [oncampusJobs, setOncampusJobs] = useState([]);
//   const [selectedJob, setSelectedJob] = useState(null);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [sortBy, setSortBy] = useState("newest");

//   const fetchApplication = async () => {
//     try {
//       const response = await getUserApplicationStatus("Pool-campus");
//       const rawData = response?.data?.data || [];
//       // Adapted normalization to match your actual data shape
//       const normalized = rawData.map((item) => {
//         // Defensive checks to avoid undefined errors
//         const jobDetail = Array.isArray(item.jobDetails) && item.jobDetails.length > 0 ? item.jobDetails[0] : {};
//         return {
//           ...item,
//           id: item._id,
//           status: item.currentStatus ?? item.status ?? "",
//           date: item.createdAt ?? "",
//           // fields adapted to your data:
//           jobTitle: jobDetail?.designation ?? "N/A",
//           company: jobDetail?.contactPerson?.designation ?? "-", // Or use another identifier for company
//           degree: jobDetail?.degree?.join(", ") ?? "-",
//           employmentType: jobDetail?.employmentType ?? "-",
//           city: jobDetail?.city ?? "-",
//           state: jobDetail?.state ?? jobDetail?.location[0],
//           country: jobDetail?.country ?? "-",
//           skills: Array.isArray(jobDetail?.skills) ? jobDetail.skills.join(", ") : "-",
//           description: jobDetail?.description
//         };
//       });

//       setOncampusJobs(normalized);
//       setSelectedJob(normalized[0] || null);
//     } catch (error) {
//       console.log("Error: ", error);
//     }
//   };

//   useEffect(() => {
//     fetchApplication();
//   }, []);

//   const filteredJobs = oncampusJobs?.filter(job =>
//     (job?.jobTitle?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
//     (job?.company?.toLowerCase() || "").includes(searchTerm.toLowerCase())
//   );

//   const getStatusIndex = (status) => statusSteps.findIndex(step => step === status);

//   return (
//     <div className="flex flex-col h-screen bg-gray-100">
//       {/* Header */}
//       <div className="bg-white border-b border-gray-200 py-4 px-6">
//         <div className="flex justify-between items-center">
//           <h1 className="text-xl font-semibold text-gray-800">Application Status</h1>
//           <div className="flex space-x-4">
//             <div className="relative">
//               <input
//                 type="text"
//                 placeholder="Search"
//                 className="pl-9 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1e4ed8]"
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//               />
//               <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
//             </div>
//             <div className="relative">
//               <select
//                 className="pl-3 pr-8 py-2 border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-[#1e4ed8]"
//                 value={sortBy}
//                 onChange={(e) => setSortBy(e.target.value)}
//               >
//                 <option value="newest">Sort by: Newest</option>
//                 <option value="oldest">Sort by: Oldest</option>
//                 <option value="company">Sort by: Company</option>
//               </select>
//               <div className="absolute right-3 top-3 pointer-events-none">
//                 <svg className="h-4 w-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
//                   <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
//                 </svg>
//               </div>
//             </div>
//           </div>
//         </div>
//         <p className="text-gray-500 mt-1">
//           Your current on-campus application progress and details.
//         </p>
//       </div>

//       {/* Main Content */}
//       <div className="flex flex-1 overflow-hidden">
//         {/* Job List Sidebar */}
//         <div className="w-64 bg-white border-r border-gray-200 overflow-y-auto">
//           {filteredJobs?.map(job => (
//             <div
//               key={job.id}
//               className={`p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50 ${selectedJob?.id === job.id ? 'bg-gray-100' : ''}`}
//               onClick={() => setSelectedJob(job)}
//             >
//               <h3 className="font-medium">{job?.companyDetails[0]?.collegeUniversityDetails?.collegeName}</h3>
//               {/* <p className="text-sm text-gray-600">{job.company}</p> */}
//               <div className="mt-2 flex items-center text-xs text-gray-500">
//                 <Clock className="h-3 w-3 mr-1" />
//                 <span>{job.degree}</span>
//                 <span className="mx-2">•</span>
//                 <MapPin className="h-3 w-3 mr-1" />
//                 <span>{job.city}, {job.state}</span>
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* Job Details */}
//         <div className="flex-1 overflow-y-auto p-6">
//           {selectedJob && (
//             <>
//               {/* Status Progress Bar */}
//               <div className="mb-8 relative">
//                 <div className="flex justify-between mb-2">
//                   {statusSteps?.map((step, idx) => {
//                     const currentIdx = getStatusIndex(selectedJob.status);
//                     const isActive = idx <= currentIdx;
//                     return (
//                       <div key={idx} className="flex flex-col items-center text-xs" style={{ width: `${100 / statusSteps.length}%` }}>
//                         <div className={`w-4 h-4 rounded-full mb-1 ${isActive ? 'bg-[#1e4ed8]' : 'bg-gray-300'}`}></div>
//                         <span className={`text-center ${isActive ? 'text-[#1e4ed8] font-medium' : 'text-gray-500'}`}>
//                           {step}
//                         </span>
//                         <span className="text-gray-400 text-xs">{idx === 0 ? selectedJob.date : ''}</span>
//                       </div>
//                     );
//                   })}
//                 </div>
//                 <div className="h-1 bg-gray-200 absolute left-0 right-0 top-2">
//                   <div
//                     className="h-1 bg-[#1e4ed8]"
//                     style={{
//                       width: `${(getStatusIndex(selectedJob.status) / (statusSteps.length - 1)) * 100}%`
//                     }}
//                   ></div>
//                 </div>
//               </div>

//               {/* Job Details Content */}
//               <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
//                 <div className="flex justify-between">
//                   <div>
//                     <h3 className="font-medium">{selectedJob?.companyDetails[0]?.collegeUniversityDetails?.collegeName}</h3>
//                     {/* <p className="text-gray-600">{selectedJob.company}</p> */}
//                     <div className="mt-2 text-sm text-gray-500">
//                       <p>Job ID: {selectedJob.id}</p>
//                       <div className="flex items-center mt-1">
//                         <Clock className="h-4 w-4 mr-1" />
//                         <span>{selectedJob.degree}</span>
//                         <span className="mx-2">•</span>
//                         <MapPin className="h-4 w-4 mr-1" />
//                         <span>{selectedJob.city}, {selectedJob.state}, {selectedJob.country}</span>
//                       </div>
//                       <div>
//                         <span className="text-xs text-gray-400">Skills: {selectedJob.skills}</span>
//                       </div>
//                     </div>
//                   </div>
//                   <div className="w-16 h-16 bg-gray-200 rounded-md flex items-center justify-center">
//                     {/* optionally display company/college initials here */}
//                   </div>
//                 </div>

//                 <div className="mt-6">
//                   <p className="text-gray-700">
//                     Job Type: {selectedJob.employmentType}
//                   </p>
//                 </div>
//                 <div>
//                   <h3 className='font-semibold mt-2'>Description</h3>
//                   <p>{selectedJob.description}</p>
//                 </div>

//                 {/* <div className="mt-6">
//                   <h3 className="font-medium mb-2">Activity on this role</h3>
//                   <div className="flex border-t border-gray-200">
//                     <div className="py-4 px-6 border-r border-gray-200">
//                       <p className="text-lg font-semibold">1580</p>
//                       <p className="text-sm text-gray-500">Total applications</p>
//                     </div>
//                     <div className="py-4 px-6">
//                       <p className="text-lg font-semibold">83</p>
//                       <p className="text-sm text-gray-500">Applications viewed by recruiter</p>
//                     </div>
//                   </div>
//                 </div> */}

//                 <div className="mt-4">
//                   <Link to={`/company-dashboard/Pool-campus/${selectedJob?.jobDetails[0]?._id}?isApplied=true`} className="text-[#1e4ed8] text-sm font-medium">View full description</Link>
//                 </div>
//               </div>
//             </>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }


import { useEffect, useState } from 'react';
import { Search, MapPin, Clock, Calendar, Briefcase, Users, CheckCircle, XCircle, ArrowRight, GraduationCap } from 'lucide-react';
import { statusSteps } from '../../../constants/data.js';
import { getUserApplicationStatus } from '@/lib/User_AxiosInstance';
import { getPoolCampusJobById } from '@/lib/College_AxiosIntance';
import { getRegisteredColleges } from '@/lib/Company_AxiosInstance';
import PoolCampusDetailModal from '@/components/company/employerDashboard/poolCampus/PoolDetailModal';
import { useNavigate } from 'react-router-dom';
const poolCampusStatusSteps = ["Applied", "Shortlisted", "Accepted"];

export default function PoolcampusApplicationStatus() {
  const navigate = useNavigate();
  const [poolJobs, setPoolJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalCollege, setModalCollege] = useState(null);

  // Add this helper function at the top of your component
const extractCollegeName = (job) => {
  if (!job) return "College";
  
  // Try from extracted collegeName first
  if (job.collegeName && job.collegeName !== "College") {
    return job.collegeName;
  }
  
  // Fallback to fullJobDetails if available
  const jobDetails = job.fullJobDetails;
  if (!jobDetails) return "College";
  
  // Try every possible path
  const possiblePaths = [
    jobDetails.collegeName,
    jobDetails.collegePosted?.collegeName,
    jobDetails.collegePosted?.name,
    jobDetails.collegePosted?.collegeUniversityDetails?.collegeName,
    jobDetails.collegePosted?.collegeDetails?.collegeName,
    jobDetails.collegePosted?.universityDetails?.collegeName,
    jobDetails.postedBy?.collegeName,
    jobDetails.postedBy?.name,
    jobDetails.companyPosted?.companyDetails?.companyName,
    jobDetails.title,
    jobDetails.name
  ];
  
  for (const path of possiblePaths) {
    if (path && typeof path === 'string' && path.trim() !== '') {
      return path;
    }
  }
  
  return "College";
};

// Also add for degree
const extractDegree = (job) => {
  if (!job) return "Various Streams";
  
  if (job.degree && job.degree !== "Various Streams") {
    return job.degree;
  }
  
  const jobDetails = job.fullJobDetails;
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
    
    const response = await getUserApplicationStatus("Pool-campus");
    console.log("🔍 Application list response:", response);
    
    const rawData = response.data?.data || [];
    
    if (rawData.length === 0) {
      setPoolJobs([]);
      setLoading(false);
      return;
    }
    
    const detailedJobs = await Promise.all(
      rawData.map(async (item) => {
        try {
          const jobId = item.job;
          const jobDetails = item.jobDetails;
          const collegeDetails = item.collegeDetails;

          
         
          // IMPROVED COLLEGE NAME EXTRACTION
          let collegeName = "College";

          // Try to find college name from jobDetails
          if (jobDetails.collegeName && jobDetails.collegeName !== "College") {
            collegeName = jobDetails.collegeName;
          } 
          // Check collegePosted structure
          else if (jobDetails.collegePosted) {
            // Try all possible paths in order of likelihood
            const possiblePaths = [
              jobDetails.collegePosted.collegeUniversityDetails?.collegeName,
              jobDetails.collegePosted.name,
              jobDetails.collegePosted.collegeName,
              jobDetails.collegePosted.collegeDetails?.collegeName,
              jobDetails.collegePosted.universityDetails?.collegeName,
              jobDetails.collegePosted.institutionName,
              jobDetails.collegePosted.title
            ];
            
            for (const path of possiblePaths) {
              if (path && typeof path === 'string' && path.trim() !== '') {
                collegeName = path.trim();
                break;
              }
            }
          } 
          // Check postedBy structure
          else if (jobDetails.postedBy) {
            collegeName = jobDetails.postedBy.collegeName || 
                          jobDetails.postedBy.name || 
                          "College";
          }

          console.log(`✅ College name for job ${jobId}: ${collegeName}`);
          
          // Get degree - same logic as before
          let degree = "Various Streams";
          if (Array.isArray(jobDetails.studentStreams) && jobDetails.studentStreams.length > 0) {
            degree = jobDetails.studentStreams.join(", ");
          } else if (Array.isArray(jobDetails.degree) && jobDetails.degree.length > 0) {
            degree = jobDetails.degree.join(", ");
          } else if (Array.isArray(jobDetails.degreeType) && jobDetails.degreeType.length > 0) {
            degree = jobDetails.degreeType.join(", ");
          }
          
          // Get location
          let location = "Location not specified";
          if (Array.isArray(jobDetails.location) && jobDetails.location.length > 0) {
            location = jobDetails.location.join(", ");
          } else if (jobDetails.venue) {
            location = jobDetails.venue;
          } else if (Array.isArray(jobDetails.workLocation) && jobDetails.workLocation.length > 0) {
            location = jobDetails.workLocation.join(", ");
          }
          
          // Get logo
          let collegeLogo = null;
          if (jobDetails.collegePosted) {
            collegeLogo = jobDetails.collegePosted.profileImage || 
                         jobDetails.collegePosted.profileImageUrl || 
                         jobDetails.collegePosted.logo;
          }

          // Debug logging
          console.log(`📊 Final job object for ${jobId}:`, {
            collegeName,
            collegeLogo,
            jobDetailsCollegePosted: jobDetails.collegePosted,
            hasCollegeUniversityDetails: !!jobDetails.collegePosted?.collegeUniversityDetails,
            collegeUniversityDetails: jobDetails.collegePosted?.collegeUniversityDetails
          });
          
          return {
            ...item,
            id: item._id,
            jobId: item.job,

            status: item.currentStatus,
            date: new Date(item.createdAt).toLocaleDateString(),

            collegeName:
              collegeDetails?.collegeUniversityDetails?.collegeName || "College",

            collegeLogo: collegeDetails?.profileImage || null,

            location:
              Array.isArray(jobDetails.location) && jobDetails.location.length > 0
                ? jobDetails.location.join(", ")
                : jobDetails.venue || "Location not specified",

            degree:
              Array.isArray(jobDetails.degree) && jobDetails.degree.length > 0
                ? jobDetails.degree.join(", ")
                : "Various Streams",

            employmentType:
              Array.isArray(jobDetails.employmentType) && jobDetails.employmentType.length > 0
                ? jobDetails.employmentType.join(", ")
                : "Campus Placement",

            skills: jobDetails.skills || [],
            description: jobDetails.description || "No description available",

            // ⭐ THIS is the magic line (page + modal both)
            fullJobDetails: {
              ...jobDetails,
              collegePosted: collegeDetails
            }
          };

          
        } catch (jobError) {
          console.error(`❌ Error fetching job ${item.job}:`, jobError);
          return {
            ...item,
            id: item._id,
            jobId: item.job || item._id,
            status: item.currentStatus || item.status || "Applied",
            date: item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "N/A",
            collegeName: "College",
            collegeLogo: null,
            location: "Location not specified",
            degree: "Various Streams",
            employmentType: "Campus Placement",
            skills: [],
            description: "No description available",
            fullJobDetails: null,
            _debug: {
              collegeNameFound: false,
              collegeNameSource: "error",
              error: jobError.message
            }
          };
        }
      })
    );
    
    console.log("✅ Final jobs:", detailedJobs);
    setPoolJobs(detailedJobs);
    if (detailedJobs.length > 0) {
      setSelectedJob(detailedJobs[0]);
    }
    
  } catch (error) {
    console.error("❌ Error:", error);
    setError(error.message || "Failed to fetch applications");
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchApplication();
  }, []);

  const filteredJobs = poolJobs.filter(job =>
    (job?.degree?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
    (job?.collegeName?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
    (job?.location?.toLowerCase() || "").includes(searchTerm.toLowerCase())
  );

  // Get status index for progress calculation
  const getStatusIndex = (status) => {
    if (!status) return 0;
    const lowerStatus = status.toLowerCase();
    
    // If rejected, show 0% progress (stays at Applied step)
    if (lowerStatus === 'rejected') return 0;
    
    // For normal progression
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

  // Add retry function for individual jobs
  const retryFetchJob = async (jobId) => {
    try {
      console.log(`🔄 Retrying fetch for pool campus job ${jobId}`);
      const jobResponse = await getPoolCampusJobById(jobId);
      const jobDetails = jobResponse.data;
      
      setPoolJobs(prev => prev.map(job => {
        if (job.jobId === jobId) {
          const companyName = jobDetails.companyPosted?.companyDetails?.companyName || 
                             jobDetails.collegePosted?.collegeDetails?.collegeName ||
                             "Company/College";
          
          const companyLogo = jobDetails.companyPosted?.profileImageUrl ||
                              jobDetails.collegePosted?.profileImageUrl ||
                              null;
          
          return {
            ...job,
            company: companyName,
            companyLogo: companyLogo,
            location: jobDetails?.venue || jobDetails?.workLocation?.[0] || job.location,
            jobTitle: Array.isArray(jobDetails?.jobRoles) && jobDetails.jobRoles.length > 0 
              ? jobDetails.jobRoles[0] 
              : jobDetails?.lookingFor || job.jobTitle,
            degree: Array.isArray(jobDetails?.studentStreams) && jobDetails.studentStreams.length > 0
              ? jobDetails.studentStreams.join(", ")
              : job.degree,
            employmentType: Array.isArray(jobDetails?.employmentType) && jobDetails.employmentType.length > 0
              ? jobDetails.employmentType.join(", ")
              : job.employmentType,
            skills: Array.isArray(jobDetails?.skills) ? jobDetails.skills : job.skills,
            description: jobDetails?.description || job.description,
            fullJobDetails: jobDetails
          };
        }
        return job;
      }));
      
    } catch (error) {
      console.error(`❌ Failed to retry pool campus job ${jobId}:`, error);
    }
  };

  const handleViewFullDetails = (job) => {
    if (job?.fullJobDetails) {
      // Debug: Log what we're getting
      console.log('🔍 Job full details:', job.fullJobDetails);
      console.log('🔍 Job collegeName:', job.collegeName);
      
      // Create a college object matching what PoolCampusDetailModal expects
      const collegeForModal = {
        _id: job.jobId,
        // CRITICAL FIX: Ensure collegePosted has the right structure
        collegePosted: job.fullJobDetails.collegePosted || {
          // Provide fallback with collegeName
          collegeUniversityDetails: {
            collegeName: job.collegeName || "College"
          },
          profileImage: job.collegeLogo,
          // Add other required fields if available
          placementCoordinatorDetails: job.fullJobDetails.contactPerson || {},
          profileAchievements: job.fullJobDetails.collegeDetails || {}
        },
        startDate: job.fullJobDetails.startDate,
        endDate: job.fullJobDetails.endDate,
        location: job.fullJobDetails.location || [job.location],
        degreeType: job.fullJobDetails.degree || [job.degree],
        employmentType: job.fullJobDetails.employmentType || [job.employmentType],
        packageDetails: job.fullJobDetails.packageDetails,
        noOfplacedStudents: job.fullJobDetails.noOfplacedStudents,
        amenitiesRequired: job.fullJobDetails.amenitiesRequired,
        companyType: job.fullJobDetails.companyType,
        description: job.fullJobDetails.description,
        jobType: "Pool-campus",
        contactPerson: job.fullJobDetails.contactPerson,
        proposedSchedule: job.fullJobDetails.proposedSchedule,
        studentStreams: job.fullJobDetails.studentStreams,
        roundDetails: job.fullJobDetails.roundDetails,
        lookingFor: job.fullJobDetails.lookingFor,
        numberOfStudent: job.fullJobDetails.numberOfStudent,
        roundSkills: job.fullJobDetails.roundSkills,
        skills: job.fullJobDetails.skills,
        // Add any other fields needed by the modal
        ...job.fullJobDetails,
        // Ensure collegeName is accessible at root level too
        collegeName: job.collegeName
      };
      
      console.log('🔍 College for modal:', collegeForModal);
      console.log('🔍 College name in modal data:', 
        collegeForModal.collegePosted?.collegeUniversityDetails?.collegeName || 
        collegeForModal.collegeName
      );
      
      setModalCollege(collegeForModal);
      setIsModalOpen(true);
    } else {
      console.error('No full job details available');
      alert('Unable to load college details. Please try again later.');
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setModalCollege(null);
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#143694]/10 via-[#f093fb]/5 to-[#1e4ed8]/10 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#143694] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading pool campus applications...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error && poolJobs.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#143694]/10 via-[#f093fb]/5 to-[#1e4ed8]/10 flex items-center justify-center p-4">
        <div className="bg-white/90 backdrop-blur-sm border border-gray-100 rounded-2xl shadow-lg p-6 max-w-md">
          <div className="text-red-500 mb-4 text-center">
            <svg className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2 text-center">Error Loading Applications</h3>
          <p className="text-sm text-gray-600 mb-4 text-center">{error}</p>
          <button
            onClick={fetchApplication}
            className="w-full px-4 py-2 bg-gradient-to-r from-[#143694] to-[#1e4ed8] text-white rounded-xl hover:shadow-lg hover:shadow-[#143694]/30 transition-all duration-300"
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
              {poolJobs.length}
            </span>
          </div>
        </div>
      </div> */}
      <div className="container mx-auto px-4 py-6">
        {/* Header Section */}
        <div className="bg-white/90 backdrop-blur-sm border border-gray-100 rounded-2xl shadow-lg p-5 mb-6">

          {/* Top Section */}
          <div className="flex items-start justify-between gap-4 mb-4 flex-wrap">

            {/* Left: Title */}
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-gradient-to-br from-[#143694]/20 to-[#1e4ed8]/20 rounded-lg">
                <Users className="h-5 w-5 text-[#143694]" />
              </div>

              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-[#143694] to-[#1e4ed8] bg-clip-text text-transparent">
                  Pool Campus College Applications
                </h1>
                <p className="text-sm text-gray-600">
                  {poolJobs.length} college application(s) found
                </p>
              </div>
            </div>

            {/* Right: Search */}
            <div className="relative w-full sm:w-80">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10">
                <Search className="h-5 w-5 text-[#143694]" />
              </div>

              <input
                type="text"
                placeholder="Search by college name, degree, or location..."
                className="w-full pl-11 pr-4 py-2.5 bg-white border border-[#1e4ed8] rounded-xl focus:ring-2 focus:ring-[#143694] focus:outline-none text-sm placeholder:text-gray-400"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Bottom Tabs */}
          <div className="flex items-center gap-4 border-gray-200 pt-0">

            {/* Navigate */}
            <button 
              onClick={() => navigate('/company/application-status/oncampus')}
              className="px-6 py-2 text-gray-500 hover:text-[#1a3a8a] font-medium text-sm transition-all"
            >
              On-Campus
            </button>

            {/* Active */}
            <button 
              className="px-6 py-2 bg-[#1a3a8a] text-white rounded-full font-medium text-sm shadow-md"
            >
              Pool-Campus
            </button>

          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 max-h-[calc(100vh-180px)]">
          {/* Applications List */}
          <div className="lg:col-span-1">
            <div className="bg-white/90 backdrop-blur-sm border border-gray-100 rounded-2xl shadow-lg h-full flex flex-col">
              <div className="p-4 border-b border-gray-100">
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
                    {filteredJobs.map((job) => (
                      <button
                        key={job.id}
                        onClick={() => setSelectedJob(job)}
                        className={`w-full text-left p-3 rounded-xl transition-all duration-200 ${
                          selectedJob?.id === job.id 
                            ? 'bg-gradient-to-r from-[#143694]/10 to-[#1e4ed8]/10 border border-[#143694]/20' 
                            : 'hover:bg-gray-50/50 border border-transparent'
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
                            {/* College Name */}
                            <h3 className="text-sm font-semibold text-gray-900 truncate">
                              {job.collegeName}
                            </h3>
                            {/* Degree instead of Job Title */}
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
              <div className="bg-white/90 backdrop-blur-sm border border-gray-100 rounded-2xl shadow-lg h-full flex flex-col">
                {/* Status Progress */}
                <div className="p-5 border-b border-gray-100">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h2 className="text-lg font-bold text-gray-900">{selectedJob.collegeName}</h2>
                      {/* Show Degree with GraduationCap icon */}
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
                          className="w-full h-full rounded-xl object-cover border border-gray-200"
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
                      <div className="h-1.5 bg-gray-200 absolute left-[25%] right-[25%] top-4 -z-10 rounded-full">
                        <div className="h-1.5 bg-gradient-to-r from-red-400 to-red-500 rounded-full w-full"></div>
                      </div>
                    </div>
                  ) : (
                    // Normal Status Flow - 3-step bar
                    <div className="relative">
                      <div className="flex justify-between mb-1">
                        {poolCampusStatusSteps.map((step, idx) => {
                          const currentIdx = getStatusIndex(selectedJob.status);
                          const isActive = idx <= currentIdx;
                          return (
                            <div key={idx} className="flex flex-col items-center" style={{ width: `${100 / 3}%` }}>
                              <div className={`w-8 h-8 rounded-full mb-1 flex items-center justify-center border-2 text-xs ${
                                isActive 
                                  ? 'bg-gradient-to-r from-[#143694] to-[#1e4ed8] border-[#143694] text-white'
                                  : 'bg-white border-gray-300 text-gray-400'
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
                      <div className="h-1.5 bg-gray-200 absolute left-[16.5%] right-[16.5%] top-4 -z-10 rounded-full">
                        <div
                          className="h-1.5 bg-gradient-to-r from-[#143694] to-[#1e4ed8] transition-all duration-300 rounded-full"
                          style={{
                            width: `${(getStatusIndex(selectedJob.status) / (poolCampusStatusSteps.length - 1)) * 100}%`
                          }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>

                {/* College Details Grid */}
                <div className="flex-1 p-5">
                  <div className="grid grid-cols-2 gap-4 mb-5">
                    <div className="p-3 bg-gradient-to-r from-gray-50/50 to-white/50 border border-gray-100 rounded-xl">
                      <div className="flex items-center gap-2 mb-1">
                        <Briefcase className="h-4 w-4 text-[#143694]" />
                        <span className="text-xs font-medium text-gray-700">Employment Type</span>
                      </div>
                      <p className="text-sm text-gray-900">{selectedJob.employmentType}</p>
                    </div>
                    
                    <div className="p-3 bg-gradient-to-r from-gray-50/50 to-white/50 border border-gray-100 rounded-xl">
                      <div className="flex items-center gap-2 mb-1">
                        <GraduationCap className="h-4 w-4 text-[#143694]" />
                        <span className="text-xs font-medium text-gray-700">Streams/Degree</span>
                      </div>
                      <p className="text-sm text-gray-900">{selectedJob.degree}</p>
                    </div>
                    
                    <div className="p-3 bg-gradient-to-r from-gray-50/50 to-white/50 border border-gray-100 rounded-xl">
                      <div className="flex items-center gap-2 mb-1">
                        <MapPin className="h-4 w-4 text-[#143694]" />
                        <span className="text-xs font-medium text-gray-700">Location</span>
                      </div>
                      <p className="text-sm text-gray-900">{selectedJob.location}</p>
                    </div>
                    
                    <div className="p-3 bg-gradient-to-r from-gray-50/50 to-white/50 border border-gray-100 rounded-xl">
                      <div className="flex items-center gap-2 mb-1">
                        <Calendar className="h-4 w-4 text-[#143694]" />
                        <span className="text-xs font-medium text-gray-700">Applied On</span>
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
                          <span key={index} className="px-2 py-1 bg-gradient-to-r from-gray-100 to-gray-50 text-gray-700 rounded-lg text-xs">
                            {skill}
                          </span>
                        ))}
                        {selectedJob.skills.length > 5 && (
                          <span className="px-2 py-1 bg-gradient-to-r from-gray-100 to-gray-50 text-gray-700 rounded-lg text-xs">
                            +{selectedJob.skills.length - 5} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Description */}
                  <div className="mb-5">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Description</h3>
                    <div className="p-3 bg-gradient-to-r from-gray-50/50 to-white/50 border border-gray-100 rounded-xl">
                      <p className="text-sm text-gray-700 line-clamp-3">
                        {selectedJob.description}
                      </p>
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="mt-auto">
                    <button 
                      onClick={() => handleViewFullDetails(selectedJob)}
                      className="inline-flex items-center justify-center w-full px-4 py-2.5 bg-gradient-to-r from-[#143694] to-[#1e4ed8] text-white text-sm rounded-xl hover:shadow-lg hover:shadow-[#143694]/30 transition-all duration-300"
                    >
                      View College Details
                      <ArrowRight className="h-3.5 w-3.5 ml-2" />
                    </button>
                  </div>
                </div>
              </div>
            ) : poolJobs.length === 0 ? (
              <div className="bg-white/90 backdrop-blur-sm border border-gray-100 rounded-2xl shadow-lg h-full flex flex-col items-center justify-center p-6">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-gray-100 to-gray-200 mb-4">
                  <Users className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Pool Applications</h3>
                <p className="text-sm text-gray-600 text-center">
                  You haven't applied to any pool campus drives yet.
                </p>
              </div>
            ) : (
              <div className="bg-white/90 backdrop-blur-sm border border-gray-100 rounded-2xl shadow-lg h-full flex flex-col items-center justify-center p-6">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-gray-100 to-gray-200 mb-4">
                  <Users className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Select a College Application</h3>
                <p className="text-sm text-gray-600 text-center">
                  Choose a pool campus application from the list to view detailed status
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Modal */}
      {isModalOpen && modalCollege && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm" 
            onClick={handleCloseModal}
          />
          <div className="relative z-10 w-full max-w-6xl h-[90vh] overflow-y-auto rounded-2xl bg-white">
            <PoolCampusDetailModal
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