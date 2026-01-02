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
//                 className="pl-9 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//               />
//               <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
//             </div>
//             <div className="relative">
//               <select
//                 className="pl-3 pr-8 py-2 border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
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
//                         <div className={`w-4 h-4 rounded-full mb-1 ${isActive ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
//                         <span className={`text-center ${isActive ? 'text-blue-500 font-medium' : 'text-gray-500'}`}>
//                           {step}
//                         </span>
//                         <span className="text-gray-400 text-xs">{idx === 0 ? selectedJob.date : ''}</span>
//                       </div>
//                     );
//                   })}
//                 </div>
//                 <div className="h-1 bg-gray-200 absolute left-0 right-0 top-2">
//                   <div
//                     className="h-1 bg-blue-500"
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
//                   <Link to={`/company-dashboard/Pool-campus/${selectedJob?.jobDetails[0]?._id}?isApplied=true`} className="text-blue-500 text-sm font-medium">View full description</Link>
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
import { Search, MapPin, Clock, Calendar, Briefcase, Users, CheckCircle } from 'lucide-react';
import { statusSteps } from '../../../constants/data.js';
import { getUserApplicationStatus } from '@/lib/User_AxiosInstance';
import { Link } from 'react-router-dom';

export default function PoolcampusApplicationStatus() {
  const [poolJobs, setPoolJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchApplication = async () => {
    try {
      const response = await getUserApplicationStatus("Pool-campus");
      const rawData = response?.data?.data || [];

      console.log("🔍 POOL CAMPUS - Raw API response:", rawData);
      
      if (rawData.length > 0) {
        const firstItem = rawData[0];
        console.log("🔍 First item structure:", firstItem);
        console.log("🔍 jobDetails structure:", firstItem.jobDetails);
        console.log("🔍 collegeDetails structure:", firstItem.collegeDetails);
        console.log("🔍 postedByDetails structure:", firstItem.postedByDetails);
      }

      const normalized = rawData.map((item) => {
        const jobDetails = item.jobDetails?.[0] || {};
        const collegeDetails = item.collegeDetails?.[0] || {};
        
        let collegeName = "College/University";
        if (collegeDetails?.collegeUniversityDetails?.collegeName) {
          collegeName = collegeDetails.collegeUniversityDetails.collegeName;
        } else if (collegeDetails?.collegeName) {
          collegeName = collegeDetails.collegeName;
        } else if (jobDetails?.collegeName) {
          collegeName = jobDetails.collegeName;
        }
        
        let jobTitle = "Pool Campus Drive";
        if (jobDetails?.lookingFor) {
          jobTitle = jobDetails.lookingFor;
        }
        else if (jobDetails?.eventName || jobDetails?.driveName) {
          jobTitle = jobDetails.eventName || jobDetails.driveName;
        }
        else if (jobDetails?.designation) {
          jobTitle = jobDetails.designation;
        }
        else if (jobDetails?.jobTitle) {
          jobTitle = jobDetails.jobTitle;
        }
        else if (jobDetails?.role) {
          jobTitle = jobDetails.role;
        }
        else if (!jobDetails?.lookingFor && !jobDetails?.designation) {
          const degree = Array.isArray(jobDetails?.degree) ? jobDetails.degree[0] : 
                        jobDetails?.qualification || jobDetails?.education;
          
          const batch = jobDetails?.batch || 
                       jobDetails?.academicYear || 
                       jobDetails?.graduationYear;
          
          if (degree && batch) {
            jobTitle = `${degree} ${batch} Recruitment`;
          } else if (degree) {
            jobTitle = `${degree}`;
          } else if (batch) {
            jobTitle = `Batch ${batch} Campus Drive`;
          } else {
            jobTitle = `${collegeName} Campus Recruitment`;
          }
        }
        
        let location = "Location not specified";
        if (jobDetails?.venue) {
          location = jobDetails.venue;
        }
        else if (jobDetails?.location) {
          if (Array.isArray(jobDetails.location)) {
            location = jobDetails.location[0] || "Location not specified";
          } else {
            location = jobDetails.location;
          }
        }
        else if (jobDetails?.collegeLocation) {
          location = jobDetails.collegeLocation;
        }
        else if (jobDetails?.jobLocation) {
          location = jobDetails.jobLocation;
        }
        else if (collegeDetails?.collegeUniversityDetails?.collegeLocation) {
          location = collegeDetails.collegeUniversityDetails.collegeLocation;
        }
        
        let companyLogo = null;
        if (collegeDetails?.collegeUniversityDetails?.logo) {
          companyLogo = collegeDetails.collegeUniversityDetails.logo;
        }
        else if (collegeDetails?.logo) {
          companyLogo = collegeDetails.logo;
        }
        else if (collegeDetails?.profileImage) {
          companyLogo = collegeDetails.profileImage;
        }
        
        let skills = [];
        if (Array.isArray(jobDetails?.skills)) {
          skills = jobDetails.skills;
        } else if (Array.isArray(jobDetails?.skillsRequired)) {
          skills = jobDetails.skillsRequired;
        } else if (jobDetails?.skills) {
          skills = jobDetails.skills.split(',').map(skill => skill.trim());
        }
        
        let degree = "Any Degree";
        if (Array.isArray(jobDetails?.degree) && jobDetails.degree.length > 0) {
          degree = jobDetails.degree.join(", ");
        } else if (jobDetails?.qualification) {
          degree = jobDetails.qualification;
        } else if (jobDetails?.education) {
          degree = jobDetails.education;
        } else if (jobDetails?.degreeRequired) {
          degree = jobDetails.degreeRequired;
        }
        
        let employmentType = "Campus Placement";
        if (jobDetails?.employmentType) {
          if (Array.isArray(jobDetails.employmentType)) {
            employmentType = jobDetails.employmentType.join(", ");
          } else {
            employmentType = jobDetails.employmentType;
          }
        } else if (jobDetails?.jobType) {
          employmentType = jobDetails.jobType;
        }
        
        let description = jobDetails?.description || jobDetails?.jobDescription || "Description not available";
        if (description === "Description not available" || !description.trim()) {
          description = `Campus recruitment drive at ${collegeName}. Open for eligible students to apply for various positions.`;
        }
        
        const batch = jobDetails?.batch || 
                      jobDetails?.academicYear || 
                      jobDetails?.graduationYear || 
                      "Current Batch";
        
        const driveType = item.jobType === "Pool-campus" ? "Pool Campus" : 
                         item.jobType === "On-campus" ? "On-Campus" : "Campus Drive";
        
        return {
          ...item,
          id: item._id,
          status: item.currentStatus ?? item.status ?? "Applied",
          date: item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "N/A",
          company: collegeName,
          companyLogo: companyLogo,
          location: location,
          jobTitle: jobTitle,
          degree: degree,
          employmentType: employmentType,
          skills: skills,
          description: description,
          batch: batch,
          driveType: driveType,
          isCollegePosting: true,
          postingType: driveType,
          jobDetails: item.jobDetails || [],
          collegeDetails: item.collegeDetails || []
        };
      });

      console.log("✅ Normalized data:", normalized);
      setPoolJobs(normalized);
      if (normalized.length > 0) {
        setSelectedJob(normalized[0]);
      }
    } catch (error) {
      console.log("Error fetching pool applications: ", error);
      setPoolJobs([]);
    }
  };

  useEffect(() => {
    fetchApplication();
  }, []);

  const filteredJobs = poolJobs.filter(job =>
    (job?.jobTitle?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
    (job?.company?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
    (job?.location?.toLowerCase() || "").includes(searchTerm.toLowerCase())
  );

  const getStatusIndex = (status) => {
    if (!status) return 0;
    const index = statusSteps.findIndex(step => step.toLowerCase() === status.toLowerCase());
    return index >= 0 ? index : 0;
  };

  const getCompanyInitials = (companyName) => {
    if (!companyName || companyName === "College/University") return "CU";
    const words = companyName.split(' ');
    if (words.length === 1) return words[0].substring(0, 2).toUpperCase();
    return (words[0].charAt(0) + words[1].charAt(0)).toUpperCase();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#667eea]/10 via-[#f093fb]/5 to-[#764ba2]/10">
      <div className="container mx-auto px-4 py-6">
        {/* Compact Header Section - Matched styling */}
        <div className="bg-white/90 backdrop-blur-sm border border-gray-100 rounded-2xl shadow-lg p-5 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 bg-gradient-to-br from-[#667eea]/20 to-[#764ba2]/20 rounded-lg">
              <Users className="h-5 w-5 text-[#667eea]" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent">
                Pool Campus Applications
              </h1>
              <p className="text-sm text-gray-600">
                Track your pool campus application progress
              </p>
            </div>
          </div>
          
          {/* Compact Search - Matched styling */}
          <div className="relative">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search applications..."
              className="w-full pl-10 pr-4 py-2.5 bg-gradient-to-r from-gray-50 to-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#667eea]/50 focus:border-transparent focus:outline-none text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Compact Main Layout - Matched grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 max-h-[calc(100vh-180px)]">
          {/* Compact Applications List - Matched styling */}
          <div className="lg:col-span-1">
            <div className="bg-white/90 backdrop-blur-sm border border-gray-100 rounded-2xl shadow-lg h-full flex flex-col">
              <div className="p-4 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-semibold text-gray-900">Applications</h2>
                  <span className="text-xs font-medium px-2 py-1 bg-gradient-to-r from-[#667eea]/10 to-[#764ba2]/10 text-[#667eea] rounded-full">
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
                            ? 'bg-gradient-to-r from-[#667eea]/10 to-[#764ba2]/10 border border-[#667eea]/20' 
                            : 'hover:bg-gray-50/50 border border-transparent'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          {/* Logo/Initials with matched styling */}
                          {job.companyLogo ? (
                            <img 
                              src={job.companyLogo} 
                              alt={job.company}
                              className="w-9 h-9 rounded-lg object-cover border border-gray-200"
                              onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.nextSibling.style.display = 'flex';
                              }}
                            />
                          ) : null}
                          <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                            selectedJob?.id === job.id 
                              ? 'bg-gradient-to-br from-[#667eea] to-[#764ba2] text-white' 
                              : 'bg-gradient-to-br from-gray-100 to-gray-200 text-gray-700'
                          }`}>
                            <span className="text-xs font-bold">{getCompanyInitials(job.company)}</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-sm font-semibold text-gray-900 truncate">{job.company}</h3>
                            <p className="text-xs text-gray-600 truncate">{job.jobTitle}</p>
                            <div className="mt-1.5 flex items-center text-xs text-gray-500 gap-2">
                              <span className="inline-flex items-center">
                                <MapPin className="h-3 w-3 mr-1" />
                                {job.location}
                              </span>
                              <span className="text-xs px-1.5 py-0.5 bg-gradient-to-r from-gray-100 to-gray-50 text-gray-600 rounded">
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
                    <p className="text-sm text-gray-500">No applications found</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Compact Status and Details - Matched styling */}
          <div className="lg:col-span-2">
            {selectedJob ? (
              <div className="bg-white/90 backdrop-blur-sm border border-gray-100 rounded-2xl shadow-lg h-full flex flex-col">
                {/* Status Progress - Matched styling */}
                <div className="p-5 border-b border-gray-100">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h2 className="text-lg font-bold text-gray-900">{selectedJob.company}</h2>
                      <p className="text-sm text-gray-600">{selectedJob.jobTitle}</p>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#667eea]/20 to-[#764ba2]/20 flex items-center justify-center">
                      <span className="text-lg font-bold text-[#667eea]">
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
                                ? 'bg-gradient-to-r from-[#667eea] to-[#764ba2] border-[#667eea] text-white' 
                                : 'bg-white border-gray-300 text-gray-400'
                            }`}>
                              {isActive ? <CheckCircle className="h-3 w-3" /> : idx + 1}
                            </div>
                            <span className={`text-xs text-center ${isActive ? 'text-[#667eea] font-medium' : 'text-gray-500'}`}>
                              {step.length > 10 ? step.substring(0, 10) + '...' : step}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                    <div className="h-1.5 bg-gray-200 absolute left-6 right-6 top-3 -z-10">
                      <div
                        className="h-1.5 bg-gradient-to-r from-[#667eea] to-[#764ba2] transition-all duration-300"
                        style={{
                          width: `${(getStatusIndex(selectedJob.status) / (statusSteps.length - 1)) * 100}%`
                        }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Job Details - Compact Grid - Matched styling */}
                <div className="flex-1 p-5">
                  <div className="grid grid-cols-2 gap-4 mb-5">
                    <div className="p-3 bg-gradient-to-r from-gray-50/50 to-white/50 border border-gray-100 rounded-xl">
                      <div className="flex items-center gap-2 mb-1">
                        <Briefcase className="h-4 w-4 text-[#667eea]" />
                        <span className="text-xs font-medium text-gray-700">Type</span>
                      </div>
                      <p className="text-sm text-gray-900">{selectedJob.employmentType}</p>
                    </div>
                    
                    <div className="p-3 bg-gradient-to-r from-gray-50/50 to-white/50 border border-gray-100 rounded-xl">
                      <div className="flex items-center gap-2 mb-1">
                        <Calendar className="h-4 w-4 text-[#667eea]" />
                        <span className="text-xs font-medium text-gray-700">Education</span>
                      </div>
                      <p className="text-sm text-gray-900">{selectedJob.degree}</p>
                    </div>
                    
                    <div className="p-3 bg-gradient-to-r from-gray-50/50 to-white/50 border border-gray-100 rounded-xl">
                      <div className="flex items-center gap-2 mb-1">
                        <MapPin className="h-4 w-4 text-[#667eea]" />
                        <span className="text-xs font-medium text-gray-700">Location</span>
                      </div>
                      <p className="text-sm text-gray-900">{selectedJob.location}</p>
                    </div>
                    
                    <div className="p-3 bg-gradient-to-r from-gray-50/50 to-white/50 border border-gray-100 rounded-xl">
                      <div className="flex items-center gap-2 mb-1">
                        <Clock className="h-4 w-4 text-[#667eea]" />
                        <span className="text-xs font-medium text-gray-700">Applied</span>
                      </div>
                      <p className="text-sm text-gray-900">{selectedJob.date}</p>
                    </div>
                  </div>

                  {/* Skills - Compact - Matched styling */}
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

                  {/* Description - Compact - Matched styling */}
                  {/* <div className="mb-5">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Description</h3>
                    <div className="p-3 bg-gradient-to-r from-gray-50/50 to-white/50 border border-gray-100 rounded-xl">
                      <p className="text-sm text-gray-700 line-clamp-3">
                        {selectedJob.description}
                      </p>
                    </div>
                  </div> */}

                  {/* Action Button - Matched styling */}
                  <div className="mt-auto">
                    <Link 
                      to={`/company-dashboard/Pool-campus/${selectedJob?.jobDetails?.[0]?._id || selectedJob.id}?isApplied=true`} 
                      className="inline-flex items-center justify-center w-full px-4 py-2.5 bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white text-sm rounded-xl hover:shadow-lg hover:shadow-[#667eea]/30 transition-all duration-300"
                    >
                      View Full Details
                    </Link>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white/90 backdrop-blur-sm border border-gray-100 rounded-2xl shadow-lg h-full flex flex-col items-center justify-center p-6">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-gray-100 to-gray-200 mb-4">
                  <Users className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Select an Application</h3>
                <p className="text-sm text-gray-600 text-center">
                  Choose a pool campus application from the list to view detailed status
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}