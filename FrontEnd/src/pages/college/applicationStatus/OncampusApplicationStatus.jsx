import { useEffect, useState } from 'react';
import { Search, MapPin, Clock, Calendar, Briefcase, Award, CheckCircle, Building, Users, FileText, ArrowRight } from 'lucide-react';
import { statusSteps } from '../../../constants/data.js';
import { getUserApplicationStatus } from '@/lib/User_AxiosInstance';
import { Link } from 'react-router-dom';

export default function OncampusApplicationStatus() {
  const [oncampusJobs, setOncampusJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchApplication = async () => {
    try {
      const response = await getUserApplicationStatus("On-campus");
      const rawData = response?.data?.data || [];

      console.log("🔍 FRONTEND - Raw API response:", rawData);

      const normalized = rawData.map((item) => {
        const jobDetails = item.jobDetails?.[0] || {};
        const collegeDetails = item.collegeDetails?.[0] || {};

        // Enhanced data extraction with better fallbacks
        let collegeName = "College/University";
        let collegeLogo = null;

        // Extract college name from multiple possible sources
        if (collegeDetails?.collegeName) collegeName = collegeDetails.collegeName;
        else if (collegeDetails?.collegeUniversityDetails?.collegeName) collegeName = collegeDetails.collegeUniversityDetails.collegeName;
        else if (collegeDetails?.name) collegeName = collegeDetails.name;
        else if (collegeDetails?.institutionName) collegeName = collegeDetails.institutionName;
        else if (collegeDetails?.companyName) collegeName = collegeDetails.companyName;
        else if (jobDetails?.companyName) collegeName = jobDetails.companyName;

        // Extract logo if available
        if (collegeDetails?.logo) collegeLogo = collegeDetails.logo;
        else if (collegeDetails?.collegeUniversityDetails?.logo) collegeLogo = collegeDetails.collegeUniversityDetails.logo;
        else if (collegeDetails?.companyDetails?.logo) collegeLogo = collegeDetails.companyDetails.logo;

        // Enhanced location extraction
        let location = "Location not specified";
        if (jobDetails?.city && jobDetails?.state) {
          location = `${jobDetails.city}, ${jobDetails.state}`;
        } else if (Array.isArray(jobDetails?.location) && jobDetails.location.length > 0) {
          location = jobDetails.location[0];
        } else if (Array.isArray(jobDetails?.workLocation) && jobDetails.workLocation.length > 0) {
          location = jobDetails.workLocation[0];
        } else if (jobDetails?.venue) {
          location = jobDetails.venue;
        } else if (jobDetails?.jobLocation) {
          location = jobDetails.jobLocation;
        }

        // Enhanced job title extraction
        let jobTitle = "Position/Designation";
        if (jobDetails?.designation) jobTitle = jobDetails.designation;
        else if (jobDetails?.jobTitle) jobTitle = jobDetails.jobTitle;
        else if (jobDetails?.lookingFor) jobTitle = jobDetails.lookingFor;
        else if (Array.isArray(jobDetails?.jobRoles) && jobDetails.jobRoles.length > 0) {
          jobTitle = jobDetails.jobRoles[0];
        } else if (jobDetails?.role) {
          jobTitle = jobDetails.role;
        }

        return {
          ...item,
          id: item._id,
          status: item.currentStatus ?? item.status ?? "Applied",
          date: item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "N/A",
          company: collegeName,
          companyLogo: collegeLogo,
          location: location,
          jobTitle: jobTitle,
          degree: Array.isArray(jobDetails?.degree) ? jobDetails.degree.join(", ") : 
                 jobDetails?.qualification || jobDetails?.education || "Degree requirements",
          employmentType: jobDetails?.employmentType || jobDetails?.jobType || "Full-time",
          skills: Array.isArray(jobDetails?.skills) ? jobDetails.skills : 
                 (jobDetails?.skillsRequired || []),
          description: jobDetails?.description || jobDetails?.jobDescription || "No description available",
          // Keep original arrays for reference
          jobDetails: item.jobDetails || [],
          collegeDetails: item.collegeDetails || []
        };
      });

      console.log("✅ Normalized data:", normalized);
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
    (job?.company?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
    (job?.location?.toLowerCase() || "").includes(searchTerm.toLowerCase())
  );

  const getStatusIndex = (status) => {
    if (!status) return 0;
    const index = statusSteps.findIndex(step => step.toLowerCase() === status.toLowerCase());
    return index >= 0 ? index : 0;
  };

  // Helper function to get initials for company logo
  const getCompanyInitials = (companyName) => {
    if (!companyName || companyName === "College/University") return "CU";
    const words = companyName.split(' ').filter(word => word.length > 0);
    if (words.length === 1) return words[0].substring(0, 2).toUpperCase();
    return (words[0].charAt(0) + words[1].charAt(0)).toUpperCase();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0e6f7]/60 via-[#d4e8f9]/55 to-[#cff7ea]/60">
      <div className="container mx-auto px-4 py-6">
        {/* Header Section with Blue Colors */}
        <div className="bg-white/90 backdrop-blur-sm border border-white/60 rounded-2xl shadow-lg p-5 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 bg-gradient-to-br from-[#93c5fd]/20 to-[#3b82f6]/20 rounded-lg">
              <Award className="h-5 w-5 text-[#3b82f6]" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-[#3b82f6] to-[#8b5cf6] bg-clip-text text-transparent">
                Application Status
              </h1>
              <p className="text-sm text-gray-600">
                Track your on-campus applications
              </p>
            </div>
          </div>
          
          {/* Search */}
          <div className="relative">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search applications..."
              className="w-full pl-10 pr-4 py-2.5 bg-white/50 backdrop-blur-sm border border-white/60 rounded-xl focus:ring-2 focus:ring-[#93c5fd] focus:border-transparent focus:outline-none text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Main Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 max-h-[calc(100vh-180px)]">
          {/* Applications List */}
          <div className="lg:col-span-1">
            <div className="bg-white/90 backdrop-blur-sm border border-white/60 rounded-2xl shadow-lg h-full flex flex-col">
              <div className="p-4 border-b border-white/60">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-semibold text-gray-900">Applications</h2>
                  <span className="text-xs font-medium px-2 py-1 bg-gradient-to-r from-[#93c5fd]/10 to-[#3b82f6]/10 text-[#3b82f6] rounded-full">
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
                            ? 'bg-gradient-to-r from-[#93c5fd]/10 to-[#3b82f6]/10 border border-[#3b82f6]/20' 
                            : 'hover:bg-white/30 border border-transparent'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          {job.companyLogo ? (
                            <img 
                              src={job.companyLogo} 
                              alt={job.company}
                              className="w-9 h-9 rounded-lg object-cover border border-white/60"
                              onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.nextSibling.style.display = 'flex';
                              }}
                            />
                          ) : null}
                          <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                            selectedJob?.id === job.id 
                              ? 'bg-gradient-to-br from-[#93c5fd] to-[#3b82f6] text-white' 
                              : 'bg-white/50 border border-white/60 text-[#3b82f6]'
                          }`}>
                            <span className="text-xs font-bold">{getCompanyInitials(job.company)}</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-sm font-semibold text-gray-900 truncate">{job.company}</h3>
                            <p className="text-xs text-gray-600 truncate">{job.jobTitle}</p>
                            <div className="mt-1.5 flex items-center text-xs text-gray-500 gap-2">
                              <span className="inline-flex items-center">
                                <MapPin className="h-3 w-3 mr-1 text-[#3b82f6]" />
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
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="p-6 text-center">
                    <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-white/50 to-white/30 border border-white/60 mb-3">
                      <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <p className="text-sm text-gray-500">No applications found</p>
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
                      <h2 className="text-lg font-bold text-gray-900">{selectedJob.company}</h2>
                      <p className="text-sm text-gray-600">{selectedJob.jobTitle}</p>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#93c5fd]/20 to-[#3b82f6]/20 flex items-center justify-center border border-white/60">
                      <span className="text-lg font-bold text-[#3b82f6]">
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
                                ? 'bg-gradient-to-r from-[#93c5fd] to-[#3b82f6] border-transparent text-white' 
                                : 'bg-white/50 border-white/60 text-gray-400'
                            }`}>
                              {isActive ? <CheckCircle className="h-3 w-3" /> : idx + 1}
                            </div>
                            <span className={`text-xs text-center ${isActive ? 'text-[#3b82f6] font-medium' : 'text-gray-500'}`}>
                              {step.length > 10 ? step.substring(0, 10) + '...' : step}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                    <div className="h-1.5 bg-white/50 absolute left-6 right-6 top-3 -z-10">
                      <div
                        className="h-1.5 bg-gradient-to-r from-[#93c5fd] to-[#3b82f6] transition-all duration-300 rounded-full"
                        style={{
                          width: `${(getStatusIndex(selectedJob.status) / (statusSteps.length - 1)) * 100}%`
                        }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Job Details Grid */}
                <div className="flex-1 p-5">
                  <div className="grid grid-cols-2 gap-4 mb-5">
                    <div className="p-3 bg-gradient-to-r from-white/30 to-white/10 border border-white/60 rounded-xl">
                      <div className="flex items-center gap-2 mb-1">
                        <Briefcase className="h-4 w-4 text-[#3b82f6]" />
                        <span className="text-xs font-medium text-gray-700">Type</span>
                      </div>
                      <p className="text-sm text-gray-900">{selectedJob.employmentType}</p>
                    </div>
                    
                    <div className="p-3 bg-gradient-to-r from-white/30 to-white/10 border border-white/60 rounded-xl">
                      <div className="flex items-center gap-2 mb-1">
                        <Calendar className="h-4 w-4 text-[#3b82f6]" />
                        <span className="text-xs font-medium text-gray-700">Education</span>
                      </div>
                      <p className="text-sm text-gray-900">{selectedJob.degree}</p>
                    </div>
                    
                    <div className="p-3 bg-gradient-to-r from-white/30 to-white/10 border border-white/60 rounded-xl">
                      <div className="flex items-center gap-2 mb-1">
                        <MapPin className="h-4 w-4 text-[#3b82f6]" />
                        <span className="text-xs font-medium text-gray-700">Location</span>
                      </div>
                      <p className="text-sm text-gray-900">{selectedJob.location}</p>
                    </div>
                    
                    <div className="p-3 bg-gradient-to-r from-white/30 to-white/10 border border-white/60 rounded-xl">
                      <div className="flex items-center gap-2 mb-1">
                        <Clock className="h-4 w-4 text-[#3b82f6]" />
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
                    <Link 
                      to={`/company-dashboard/On-campus/${selectedJob?.jobDetails[0]?._id || selectedJob.id}?isApplied=true`} 
                      className="inline-flex items-center justify-center w-full px-4 py-2.5 bg-gradient-to-r from-[#93c5fd] to-[#3b82f6] text-white text-sm rounded-xl hover:shadow-lg hover:shadow-[#93c5fd]/40 transition-all duration-300"
                    >
                      View Full Details
                      <ArrowRight className="h-3.5 w-3.5 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                    </Link>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white/90 backdrop-blur-sm border border-white/60 rounded-2xl shadow-lg h-full flex flex-col items-center justify-center p-6">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-white/50 to-white/30 border border-white/60 mb-4">
                  <Award className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Select an Application</h3>
                <p className="text-sm text-gray-600 text-center">
                  Choose an application from the list to view detailed status
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}