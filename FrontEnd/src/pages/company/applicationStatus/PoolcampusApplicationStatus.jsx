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
import { Search, MapPin, Clock, Filter, ChevronDown, Calendar, Briefcase, Award, Building, CheckCircle, Users } from 'lucide-react';
import { statusSteps, similarJobs } from '../../../constants/data.js';
import { getUserApplicationStatus } from '@/lib/User_AxiosInstance';
import { Link } from 'react-router-dom';

export default function PoolcampusApplicationStatus() {
  const [poolJobs, setPoolJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  const fetchApplication = async () => {
    try {
      const response = await getUserApplicationStatus("Pool-campus");
      const rawData = response?.data?.data || [];
      
      // Fixed normalization with proper defensive checks
      const normalized = rawData.map((item) => {
        // Safe access to jobDetails with proper null checks
        const jobDetails = item?.jobDetails || [];
        const jobDetail = jobDetails.length > 0 ? jobDetails[0] : {};
        
        // Safe access to companyDetails with proper null checks
        const companyDetails = item?.companyDetails || [];
        const companyDetail = companyDetails.length > 0 ? companyDetails[0] : {};
        
        return {
          ...item,
          id: item._id,
          status: item.currentStatus ?? item.status ?? "",
          date: item.createdAt ?? "",
          // fields adapted to your data with safe access:
          jobTitle: jobDetail?.designation ?? jobDetail?.jobTitle ?? "N/A",
          company: companyDetail?.collegeUniversityDetails?.collegeName ?? 
                  companyDetail?.companyDetails?.companyName ?? 
                  jobDetail?.contactPerson?.designation ?? 
                  "-",
          degree: Array.isArray(jobDetail?.degree) ? jobDetail.degree.join(", ") : "-",
          employmentType: Array.isArray(jobDetail?.employmentType) ? jobDetail.employmentType.join(", ") : "-",
          city: jobDetail?.city ?? "-",
          state: jobDetail?.state ?? (Array.isArray(jobDetail?.location) ? jobDetail.location[0] : "-"),
          country: jobDetail?.country ?? "-",
          skills: Array.isArray(jobDetail?.skills) ? jobDetail.skills.join(", ") : "-",
          description: jobDetail?.description ?? "No description available",
          // Keep the original arrays for safe access in the component
          jobDetails: jobDetails,
          companyDetails: companyDetails
        };
      });

      setPoolJobs(normalized);
      if (normalized.length > 0) {
        setSelectedJob(normalized[0]);
      }
    } catch (error) {
      console.log("Error: ", error);
      setPoolJobs([]);
    }
  };

  useEffect(() => {
    fetchApplication();
  }, []);

  const filteredJobs = poolJobs?.filter(job =>
    (job?.jobTitle?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
    (job?.company?.toLowerCase() || "").includes(searchTerm.toLowerCase())
  );

  const getStatusIndex = (status) => statusSteps.findIndex(step => step === status);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#667eea]/10 via-[#f093fb]/5 to-[#764ba2]/10">
      <div className="container mx-auto px-4 py-8 pt-22">
        {/* Header Section */}
        <div className="bg-white/90 backdrop-blur-sm border border-gray-100 rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div className="mb-4 md:mb-0">
              <div className="flex items-center mb-2">
                <div className="p-2 bg-gradient-to-br from-[#667eea]/20 to-[#764ba2]/20 rounded-lg mr-3">
                  <Users className="h-5 w-5 text-[#667eea]" />
                </div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent">
                  Pool Campus Application Status
                </h1>
              </div>
              <p className="text-gray-600">
                Your current pool campus application progress and details.
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Search Input */}
              {/* <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search applications..."
                  className="pl-10 pr-4 py-2.5 bg-gradient-to-r from-gray-50 to-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#667eea]/50 focus:border-transparent focus:outline-none transition-all duration-200 w-full md:w-64"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div> */}
              
              {/* Sort Dropdown */}
              <div className="relative">
                <select
                  className="pl-4 pr-10 py-2.5 bg-gradient-to-r from-gray-50 to-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#667eea]/50 focus:border-transparent focus:outline-none appearance-none transition-all duration-200"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="newest">Sort by: Newest</option>
                  <option value="oldest">Sort by: Oldest</option>
                  <option value="company">Sort by: College</option>
                </select>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-6 min-h-[600px]">
          {/* Job List Sidebar */}
          <div className="lg:w-96 flex-shrink-0">
            <div className="bg-white/90 backdrop-blur-sm border border-gray-100 rounded-2xl shadow-lg h-full flex flex-col">
              <div className="p-4 border-b border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900">Your Pool Applications</h2>
                <p className="text-sm text-gray-500 mt-1">{filteredJobs?.length || 0} applications found</p>
              </div>
              
              <div className="flex-1 overflow-y-auto">
                {filteredJobs && filteredJobs.length > 0 ? (
                  filteredJobs.map(job => (
                    <div
                      key={job.id}
                      className={`p-4 border-b border-gray-100 cursor-pointer transition-all duration-200 ${
                        selectedJob?.id === job.id 
                          ? 'bg-gradient-to-r from-[#667eea]/10 to-[#764ba2]/10' 
                          : 'hover:bg-gray-50/50'
                      }`}
                      onClick={() => setSelectedJob(job)}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                          selectedJob?.id === job.id 
                            ? 'bg-gradient-to-br from-[#667eea] to-[#764ba2] text-white' 
                            : 'bg-gradient-to-br from-gray-100 to-gray-200 text-gray-700'
                        }`}>
                          <span className="font-medium">
                            {job?.companyDetails?.[0]?.collegeUniversityDetails?.collegeName?.charAt(0) || 
                             job?.company?.charAt(0) || 
                             "C"}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-gray-900 truncate">
                            {job?.companyDetails?.[0]?.collegeUniversityDetails?.collegeName || job?.company || "Unknown College"}
                          </h3>
                          <p className="text-sm text-gray-600 truncate">{job.jobTitle}</p>
                          <div className="mt-2 flex items-center text-xs text-gray-500 flex-wrap gap-2">
                            <span className="inline-flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              {job.degree}
                            </span>
                            <span className="inline-flex items-center">
                              <MapPin className="h-3 w-3 mr-1" />
                              {job.city}, {job.state}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-gray-100 to-gray-200 mb-4">
                      <Search className="h-6 w-6 text-gray-400" />
                    </div>
                    <p className="text-gray-500">No pool applications found</p>
                    <p className="text-sm text-gray-400 mt-1">Try adjusting your search</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Job Details */}
          <div className="flex-1">
            {selectedJob ? (
              <div className="bg-white/90 backdrop-blur-sm border border-gray-100 rounded-2xl shadow-lg p-6 h-full flex flex-col">
                {/* Status Progress Bar */}
                <div className="mb-8 relative">
                  <div className="flex justify-between mb-2">
                    {statusSteps?.map((step, idx) => {
                      const currentIdx = getStatusIndex(selectedJob.status);
                      const isActive = idx <= currentIdx;
                      const isCurrent = idx === currentIdx;
                      return (
                        <div key={idx} className="flex flex-col items-center text-sm" style={{ width: `${100 / statusSteps.length}%` }}>
                          <div className={`w-8 h-8 rounded-full mb-2 flex items-center justify-center border-2 ${
                            isActive 
                              ? 'bg-gradient-to-r from-[#667eea] to-[#764ba2] border-[#667eea] text-white' 
                              : 'bg-white border-gray-300 text-gray-400'
                          }`}>
                            {isActive ? <CheckCircle className="h-4 w-4" /> : idx + 1}
                          </div>
                          <span className={`text-center font-medium ${isActive ? 'text-[#667eea]' : 'text-gray-500'}`}>
                            {step}
                          </span>
                          {idx === 0 && selectedJob.date && (
                            <span className="text-xs text-gray-400 mt-1">
                              {new Date(selectedJob.date).toLocaleDateString()}
                            </span>
                          )}
                          {isCurrent && (
                            <span className="text-xs font-medium text-[#667eea] mt-1">Current</span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  <div className="h-1 bg-gray-200 absolute left-8 right-8 top-4 -z-10">
                    <div
                      className="h-1 bg-gradient-to-r from-[#667eea] to-[#764ba2] transition-all duration-300"
                      style={{
                        width: `${(getStatusIndex(selectedJob.status) / (statusSteps.length - 1)) * 100}%`
                      }}
                    ></div>
                  </div>
                </div>

                {/* Job Details Content */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">
                        {selectedJob?.companyDetails?.[0]?.collegeUniversityDetails?.collegeName || selectedJob?.company || "Unknown College"}
                      </h2>
                      <p className="text-lg text-gray-600 mt-1">{selectedJob.jobTitle}</p>
                      <div className="mt-4 flex flex-wrap gap-3">
                        <span className="inline-flex items-center px-3 py-1.5 bg-gradient-to-r from-blue-100 to-blue-50 text-blue-700 rounded-lg text-sm">
                          <Briefcase className="h-3 w-3 mr-1.5" />
                          {selectedJob.employmentType}
                        </span>
                        <span className="inline-flex items-center px-3 py-1.5 bg-gradient-to-r from-green-100 to-green-50 text-green-700 rounded-lg text-sm">
                          <Calendar className="h-3 w-3 mr-1.5" />
                          {selectedJob.degree}
                        </span>
                        <span className="inline-flex items-center px-3 py-1.5 bg-gradient-to-r from-purple-100 to-purple-50 text-purple-700 rounded-lg text-sm">
                          <MapPin className="h-3 w-3 mr-1.5" />
                          {selectedJob.city}, {selectedJob.state}
                        </span>
                      </div>
                    </div>
                    <div className="flex-shrink-0 w-16 h-16 rounded-xl bg-gradient-to-br from-[#667eea]/20 to-[#764ba2]/20 flex items-center justify-center">
                      <span className="text-2xl font-bold text-[#667eea]">
                        {selectedJob?.companyDetails?.[0]?.collegeUniversityDetails?.collegeName?.charAt(0) || 
                         selectedJob?.company?.charAt(0) || 
                         "C"}
                      </span>
                    </div>
                  </div>

                  {/* Current Status */}
                  <div className="mb-6 p-4 bg-gradient-to-r from-gray-50 to-white border border-gray-100 rounded-xl">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Current Status</h3>
                        <p className="text-lg font-semibold text-[#667eea]">{selectedJob.status || "Applied"}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Application ID</h3>
                        <p className="text-sm text-gray-700 font-mono">{selectedJob.id?.substring(0, 8) || "N/A"}...</p>
                      </div>
                    </div>
                  </div>

                  {/* Skills */}
                  {selectedJob.skills && selectedJob.skills !== "-" && (
                    <div className="mb-6">
                      <h3 className="text-sm font-medium text-gray-700 mb-2">Required Skills</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedJob.skills.split(", ").map((skill, index) => (
                          <span key={index} className="px-3 py-1.5 bg-gradient-to-r from-gray-100 to-gray-50 text-gray-700 rounded-lg text-sm">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Job Description */}
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
                    <div className="p-4 bg-gradient-to-r from-gray-50/50 to-white/50 border border-gray-100 rounded-xl">
                      <p className="text-gray-700 leading-relaxed">{selectedJob.description}</p>
                    </div>
                  </div>

                  {/* View Full Description Button */}
                  <div className="mt-auto">
                    <Link 
                      to={`/company-dashboard/Pool-campus/${selectedJob?.jobDetails?.[0]?._id || selectedJob.id}?isApplied=true`} 
                      className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white rounded-xl hover:shadow-lg hover:shadow-[#667eea]/30 transition-all duration-300"
                    >
                      View Full Description
                      <ChevronDown className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white/90 backdrop-blur-sm border border-gray-100 rounded-2xl shadow-lg p-12 text-center flex flex-col items-center justify-center h-full">
                <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-r from-gray-100 to-gray-200 mb-6">
                  <Users className="h-12 w-12 text-gray-400" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-3">Select a Pool Application</h3>
                <p className="text-gray-600 mb-8 max-w-md">
                  Choose a pool campus application from the list to view detailed status and progress information.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}