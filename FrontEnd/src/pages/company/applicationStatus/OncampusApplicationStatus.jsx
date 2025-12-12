import { useEffect, useState } from 'react';
import { Search, MapPin, Clock, Filter, ChevronDown, Calendar, Briefcase, Award, Building, CheckCircle } from 'lucide-react';
import { statusSteps, similarJobs } from '../../../constants/data.js';
import { getUserApplicationStatus } from '@/lib/User_AxiosInstance';
import { Link } from 'react-router-dom';

export default function OncampusApplicationStatus() {
  const [oncampusJobs, setOncampusJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  const fetchApplication = async () => {
  try {
    const response = await getUserApplicationStatus("On-campus");
    const rawData = response?.data?.data || [];

    console.log("🔍 FRONTEND - Raw API response:", rawData);
    
    if (rawData.length > 0) {
      const firstApp = rawData[0];
      console.log("🔍 Available keys in first app:", Object.keys(firstApp));
      console.log("🔍 collegeDetails:", firstApp.collegeDetails);
      
      // DEBUG: Check the exact structure
      console.log("🔍 DEEP DEBUG - collegeUniversityDetails:", 
        firstApp.collegeDetails?.collegeUniversityDetails
      );
      console.log("🔍 Is collegeUniversityDetails array?", 
        Array.isArray(firstApp.collegeDetails?.collegeUniversityDetails)
      );
    }
    
    // SIMPLIFIED NORMALIZATION
    // const normalized = rawData.map((item) => {
    //   const jobDetails = Array.isArray(item.jobDetails) && item.jobDetails.length > 0 
    //     ? item.jobDetails[0] 
    //     : {};
      
    //   const collegeDetails = item.collegeDetails || {};
      
    //   // EXTRACT COLLEGE NAME FROM collegeDetails
    //   let collegeName = "N/A";
      
    //   // Method 1: Check if collegeUniversityDetails exists
    //   const collegeUniv = collegeDetails.collegeUniversityDetails;
      
    //   if (Array.isArray(collegeUniv) && collegeUniv.length > 0) {
    //     // It's an array - take first item's collegeName
    //     collegeName = collegeUniv[0]?.collegeName || "N/A";
    //   } else if (collegeUniv && typeof collegeUniv === 'object') {
    //     // It's a single object
    //     collegeName = collegeUniv.collegeName || "N/A";
    //   }
      
    //   // Method 2: Fallback to other fields
    //   if (collegeName === "N/A") {
    //     collegeName = collegeDetails.collegeName || collegeDetails.name || "N/A";
    //   }
      
    //   console.log("🔍 Extracted college name:", collegeName);
    //   console.log("🔍 Raw collegeDetails:", collegeDetails);
      
    //   return {
    //     ...item,
    //     id: item._id,
    //     status: item.currentStatus ?? item.status ?? "Applied",
    //     date: item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "N/A",
        
    //     // Use the extracted college name
    //     company: collegeName,
        
    //     // Job details
    //     jobTitle: jobDetails?.designation ?? jobDetails?.jobTitle ?? "N/A",
    //     degree: Array.isArray(jobDetails?.degree) ? jobDetails.degree.join(", ") : "-",
    //     employmentType: jobDetails?.employmentType ?? "-",
    //     city: jobDetails?.city ?? "-",
    //     state: jobDetails?.state ?? (Array.isArray(jobDetails?.location) ? jobDetails.location[0] : "-"),
    //     country: jobDetails?.country ?? "-",
    //     skills: Array.isArray(jobDetails?.skills) ? jobDetails.skills.join(", ") : "-",
    //     description: jobDetails?.description ?? jobDetails?.jobDescription ?? "No description available",
        
    //     // Keep original arrays
    //     jobDetails: item.jobDetails || [],
    //     collegeDetails: item.collegeDetails,
    //     postedByDetails: item.postedByDetails || []
    //   };
    // });

    const normalized = rawData.map((item) => {
  const jobDetails = item.jobDetails?.[0] || {};
  const collegeDetails = item.collegeDetails?.[0] || {};
  
  // BRUTE FORCE: Try every possible field name
  let collegeName = "N/A";
  
  // First, log everything to see what we have
  console.log("🔍 FRONTEND - Raw item collegeDetails:", collegeDetails);
  console.log("🔍 collegeDetails keys:", Object.keys(collegeDetails));
  
  if (collegeDetails) {
    // Create a list of all possible field names that might contain college name
    const allPossibleFields = [];
    
    // Check all top-level fields
    Object.keys(collegeDetails).forEach(key => {
      const value = collegeDetails[key];
      if (typeof value === 'string' && value.length > 0 && value !== "N/A") {
        allPossibleFields.push({ source: `collegeDetails.${key}`, value });
      } else if (key === 'collegeUniversityDetails' && value && typeof value === 'object') {
        // Check nested collegeUniversityDetails
        Object.keys(value).forEach(subKey => {
          if (typeof value[subKey] === 'string' && value[subKey].length > 0) {
            allPossibleFields.push({ 
              source: `collegeDetails.collegeUniversityDetails.${subKey}`, 
              value: value[subKey] 
            });
          }
        });
      }
    });
    
    console.log("🔍 All possible fields with values:", allPossibleFields);
    
    // Try to find the most likely college name
    if (allPossibleFields.length > 0) {
      // Priority order for field names
      const priorityOrder = [
        'collegeName',
        'name',
        'institutionName',
        'universityName',
        'college',
        'institution',
        'university'
      ];
      
      // Find the highest priority field
      for (const priorityField of priorityOrder) {
        const found = allPossibleFields.find(f => 
          f.source.toLowerCase().includes(priorityField.toLowerCase())
        );
        if (found) {
          collegeName = found.value;
          console.log(`🔍 Found college name in ${found.source}: ${collegeName}`);
          break;
        }
      }
      
      // If no priority field found, take the first non-empty string
      if (collegeName === "N/A" && allPossibleFields.length > 0) {
        collegeName = allPossibleFields[0].value;
        console.log(`🔍 Using first available field ${allPossibleFields[0].source}: ${collegeName}`);
      }
    }
  }
  
  // If still N/A, check jobDetails for any college reference
  if (collegeName === "N/A" && jobDetails) {
    console.log("🔍 Checking jobDetails for college reference...");
    Object.keys(jobDetails).forEach(key => {
      const value = jobDetails[key];
      if (typeof value === 'string' && value.length > 0 && 
          (value.includes('College') || value.includes('University'))) {
        collegeName = value;
        console.log(`🔍 Found college reference in jobDetails.${key}: ${collegeName}`);
      }
    });
  }
  
  console.log("🔍 FINAL college name:", collegeName);
  
  return {
    ...item,
    id: item._id,
    status: item.currentStatus ?? item.status ?? "Applied",
    date: item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "N/A",
    company: collegeName,
    
    // Job details
    jobTitle: jobDetails?.designation ?? jobDetails?.jobTitle ?? "N/A",
    degree: Array.isArray(jobDetails?.degree) ? jobDetails.degree.join(", ") : "-",
    employmentType: jobDetails?.employmentType ?? "-",
    city: jobDetails?.city ?? "-",
    state: jobDetails?.state ?? (Array.isArray(jobDetails?.location) ? jobDetails.location[0] : "-"),
    country: jobDetails?.country ?? "-",
    skills: Array.isArray(jobDetails?.skills) ? jobDetails.skills.join(", ") : "-",
    description: jobDetails?.description ?? jobDetails?.jobDescription ?? "No description available",
    
    // Keep original arrays
    jobDetails: item.jobDetails || [],
    collegeDetails: item.collegeDetails || [],
    postedByDetails: item.postedByDetails || []
  };
});

    setOncampusJobs(normalized);
    if (normalized.length > 0) {
      setSelectedJob(normalized[0]);
    }
  } catch (error) {
    console.log("Error fetching applications: ", error);
    setOncampusJobs([]);
  }
};

  useEffect(() => {
    fetchApplication();
  }, []);

  const filteredJobs = oncampusJobs.filter(job =>
    (job?.jobTitle?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
    (job?.company?.toLowerCase() || "").includes(searchTerm.toLowerCase())
  );

  const getStatusIndex = (status) => {
    if (!status) return 0;
    return statusSteps.findIndex(step => step === status);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#667eea]/10 via-[#f093fb]/5 to-[#764ba2]/10">
      <div className="container mx-auto px-4 py-8 pt-22">
        {/* Header Section */}
        <div className="bg-white/90 backdrop-blur-sm border border-gray-100 rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div className="mb-4 md:mb-0">
              <div className="flex items-center mb-2">
                <div className="p-2 bg-gradient-to-br from-[#667eea]/20 to-[#764ba2]/20 rounded-lg mr-3">
                  <Award className="h-5 w-5 text-[#667eea]" />
                </div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent">
                  Application Status
                </h1>
              </div>
              <p className="text-gray-600">
                Your current on-campus application progress and details.
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Search Input */}
              <div className="relative">
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
              </div>
              
              {/* Sort Dropdown */}
              <div className="relative">
                <select
                  className="pl-4 pr-10 py-2.5 bg-gradient-to-r from-gray-50 to-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#667eea]/50 focus:border-transparent focus:outline-none appearance-none transition-all duration-200"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="newest">Sort by: Newest</option>
                  <option value="oldest">Sort by: Oldest</option>
                  <option value="company">Sort by: Company</option>
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
                <h2 className="text-lg font-semibold text-gray-900">Your Applications</h2>
                <p className="text-sm text-gray-500 mt-1">{filteredJobs.length} applications found</p>
              </div>
              
              <div className="flex-1 overflow-y-auto">
                {filteredJobs.length > 0 ? (
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
                          <span className="font-medium">{job.company?.charAt(0) || "C"}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-gray-900 truncate">{job.company}</h3>
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
                    <p className="text-gray-500">No applications found</p>
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
                          {idx === 0 && (
                            <span className="text-xs text-gray-400 mt-1">{selectedJob.date}</span>
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
                      <h2 className="text-2xl font-bold text-gray-900">{selectedJob.company}</h2>
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
                        {selectedJob.company?.charAt(0) || "C"}
                      </span>
                    </div>
                  </div>

                  {/* Current Status */}
                  <div className="mb-6 p-4 bg-gradient-to-r from-gray-50 to-white border border-gray-100 rounded-xl">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Current Status</h3>
                        <p className="text-lg font-semibold text-[#667eea]">{selectedJob.status}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Application ID</h3>
                        <p className="text-sm text-gray-700 font-mono">{selectedJob.id.substring(0, 8)}...</p>
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
                      to={`/company-dashboard/On-campus/${selectedJob?.jobDetails[0]?._id || selectedJob.id}?isApplied=true`} 
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
                  <Award className="h-12 w-12 text-gray-400" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-3">Select an Application</h3>
                <p className="text-gray-600 mb-8 max-w-md">
                  Choose an application from the list to view detailed status and progress information.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}