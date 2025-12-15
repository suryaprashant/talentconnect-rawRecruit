import { useEffect, useState } from 'react';
import { Search, MapPin, Clock, Filter, ChevronDown, Calendar, Briefcase, Award, Building, CheckCircle, ArrowRight, GraduationCap, CheckSquare } from 'lucide-react';
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

      const normalized = rawData.map((item) => {
        const jobDetails = item.jobDetails?.[0] || {};
        const collegeDetails = item.collegeDetails?.[0] || {};
        
        let collegeName = "N/A";
        
        if (collegeDetails) {
          const allPossibleFields = [];
          
          Object.keys(collegeDetails).forEach(key => {
            const value = collegeDetails[key];
            if (typeof value === 'string' && value.length > 0 && value !== "N/A") {
              allPossibleFields.push({ source: `collegeDetails.${key}`, value });
            } else if (key === 'collegeUniversityDetails' && value && typeof value === 'object') {
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
          
          const priorityOrder = [
            'collegeName',
            'name',
            'institutionName',
            'universityName',
            'college',
            'institution',
            'university'
          ];
          
          for (const priorityField of priorityOrder) {
            const found = allPossibleFields.find(f => 
              f.source.toLowerCase().includes(priorityField.toLowerCase())
            );
            if (found) {
              collegeName = found.value;
              break;
            }
          }
          
          if (collegeName === "N/A" && allPossibleFields.length > 0) {
            collegeName = allPossibleFields[0].value;
          }
        }
        
        if (collegeName === "N/A" && jobDetails) {
          Object.keys(jobDetails).forEach(key => {
            const value = jobDetails[key];
            if (typeof value === 'string' && value.length > 0 && 
                (value.includes('College') || value.includes('University'))) {
              collegeName = value;
            }
          });
        }
        
        return {
          ...item,
          id: item._id,
          status: item.currentStatus ?? item.status ?? "Applied",
          date: item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "N/A",
          company: collegeName,
          
          jobTitle: jobDetails?.designation ?? jobDetails?.jobTitle ?? "N/A",
          degree: Array.isArray(jobDetails?.degree) ? jobDetails.degree.join(", ") : "-",
          employmentType: jobDetails?.employmentType ?? "-",
          city: jobDetails?.city ?? "-",
          state: jobDetails?.state ?? (Array.isArray(jobDetails?.location) ? jobDetails.location[0] : "-"),
          country: jobDetails?.country ?? "-",
          skills: Array.isArray(jobDetails?.skills) ? jobDetails.skills.join(", ") : "-",
          description: jobDetails?.description ?? jobDetails?.jobDescription ?? "No description available",
          
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
        <div className="mb-12 text-center">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#3b82f6] to-[#8b5cf6] bg-clip-text text-transparent mb-2">
            Application Status
          </h1>
          <p className="text-gray-600 text-lg md:text-xl max-w-3xl mx-auto">
            Track your On-Campus application progress and stay updated with the latest status
          </p>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white/90 backdrop-blur-sm border border-white/50 rounded-2xl shadow-lg shadow-blue-50/50 p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="w-4 h-4 text-[#3b82f6]" />
              </div>
              <input
                type="text"
                placeholder="Search applications by job title or company..."
                className="w-full pl-10 pr-4 py-3 bg-white/50 backdrop-blur-sm border border-white/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#93c5fd] focus:border-transparent transition-all duration-200"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="relative">
              <select
                className="w-full md:w-auto pl-4 pr-10 py-3 bg-white/50 backdrop-blur-sm border border-white/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#93c5fd] focus:border-transparent appearance-none transition-all duration-200"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="newest">Sort by: Newest</option>
                <option value="oldest">Sort by: Oldest</option>
                <option value="company">Sort by: Company</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                <ChevronDown className="w-4 h-4 text-[#3b82f6]" />
              </div>
            </div>
            
            <div className="text-sm text-gray-500 font-medium">
              {filteredJobs.length} applications found
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Job List Sidebar */}
          <div className="lg:w-1/3">
            <div className="bg-white/90 backdrop-blur-sm border border-white/50 rounded-2xl shadow-lg shadow-blue-50/50 overflow-hidden">
              <div className="p-6 border-b border-white/50">
                <h2 className="text-lg font-semibold text-gray-800 mb-2">Your Applications</h2>
                <p className="text-sm text-gray-500">Select an application to view details</p>
              </div>
              
              <div className="h-[500px] overflow-y-auto">
                {filteredJobs.length > 0 ? (
                  filteredJobs.map(job => (
                    <div
                      key={job.id}
                      className={`p-6 border-b border-white/50 cursor-pointer transition-all duration-200 ${
                        selectedJob?.id === job.id 
                          ? 'bg-gradient-to-r from-[#93c5fd]/10 to-[#3b82f6]/10' 
                          : 'hover:bg-white/30'
                      }`}
                      onClick={() => setSelectedJob(job)}
                    >
                      <div className="flex items-start gap-4">
                        <div className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center ${
                          selectedJob?.id === job.id 
                            ? 'bg-gradient-to-r from-[#93c5fd] to-[#3b82f6] text-white' 
                            : 'bg-white/50 border border-white/50 text-gray-700'
                        }`}>
                          <span className="font-bold">{job.company?.charAt(0) || "C"}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-medium text-gray-900 truncate">{job.company}</h3>
                            <span className={`px-2 py-1 text-xs rounded-full ${job.status === 'Accepted' 
                              ? 'bg-gradient-to-r from-[#a7f3d0]/20 to-[#34d399]/20 text-[#059669] border border-[#a7f3d0]/30'
                              : job.status === 'Rejected'
                              ? 'bg-gradient-to-r from-[#fecaca]/20 to-[#f87171]/20 text-[#dc2626] border border-[#fecaca]/30'
                              : 'bg-gradient-to-r from-[#fde68a]/20 to-[#f59e0b]/20 text-[#d97706] border border-[#fde68a]/30'
                            }`}>
                              {job.status}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 truncate mb-3">{job.jobTitle}</p>
                          <div className="flex flex-wrap items-center text-xs text-gray-500 gap-2">
                            <div className="flex items-center">
                              <GraduationCap className="w-3 h-3 mr-1 text-[#3b82f6]" />
                              <span>{job.degree}</span>
                            </div>
                            <div className="flex items-center">
                              <MapPin className="w-3 h-3 mr-1 text-[#3b82f6]" />
                              <span>{job.city}, {job.state}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-[#93c5fd]/10 to-[#3b82f6]/10 mb-4">
                      <Search className="h-6 w-6 text-[#3b82f6]" />
                    </div>
                    <p className="text-gray-500">No applications found</p>
                    <p className="text-sm text-gray-400 mt-1">Try adjusting your search criteria</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Job Details */}
          <div className="lg:w-2/3">
            {selectedJob ? (
              <div className="bg-white/90 backdrop-blur-sm border border-white/50 rounded-2xl shadow-lg shadow-blue-50/50 p-8 h-full">
                {/* Status Progress Bar */}
                <div className="mb-8 relative">
                  <div className="flex justify-between mb-8">
                    {statusSteps?.map((step, idx) => {
                      const currentIdx = getStatusIndex(selectedJob.status);
                      const isActive = idx <= currentIdx;

                      return (
                        <div key={idx} className="flex flex-col items-center text-sm relative" style={{ width: `${100 / statusSteps.length}%` }}>
                          <div className={`w-8 h-8 rounded-full mb-3 flex items-center justify-center border-2 ${isActive 
                            ? 'bg-gradient-to-r from-[#93c5fd] to-[#3b82f6] text-white border-transparent' 
                            : 'bg-white/50 border-white/50 text-gray-400'
                          }`}>
                            {isActive ? <CheckCircle className="h-4 w-4" /> : <span>{idx + 1}</span>}
                          </div>
                          <span className={`text-center font-medium ${isActive ? 'text-[#3b82f6]' : 'text-gray-500'}`}>
                            {step}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                  <div className="h-1 bg-white/50 absolute left-0 right-0 top-4">
                    <div
                      className="h-1 bg-gradient-to-r from-[#93c5fd] to-[#3b82f6] rounded-full transition-all duration-300"
                      style={{
                        width: `${(getStatusIndex(selectedJob.status) / (statusSteps.length - 1)) * 100}%`
                      }}
                    ></div>
                  </div>
                </div>

                {/* Job Details Content */}
                <div className="space-y-6">
                  <div className="flex flex-col lg:flex-row justify-between gap-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Building className="h-5 w-5 text-[#3b82f6]" />
                        <h2 className="text-xl font-semibold text-gray-900">{selectedJob.company}</h2>
                      </div>
                      <p className="text-gray-600 text-lg mb-4">{selectedJob.jobTitle}</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <div className="flex items-center gap-2 text-gray-700">
                          <Briefcase className="h-4 w-4 text-[#3b82f6]" />
                          <span className="text-sm">{selectedJob.employmentType}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-700">
                          <GraduationCap className="h-4 w-4 text-[#3b82f6]" />
                          <span className="text-sm">{selectedJob.degree}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-700">
                          <MapPin className="h-4 w-4 text-[#3b82f6]" />
                          <span className="text-sm">{selectedJob.city}, {selectedJob.state}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-700">
                          <Calendar className="h-4 w-4 text-[#3b82f6]" />
                          <span className="text-sm">Applied: {selectedJob.date}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="lg:w-48">
                      <div className="bg-gradient-to-br from-[#93c5fd]/10 to-[#3b82f6]/10 border border-[#93c5fd]/20 rounded-xl p-6 text-center">
                        <div className="w-16 h-16 mx-auto bg-gradient-to-r from-[#93c5fd] to-[#3b82f6] rounded-full flex items-center justify-center text-white text-xl font-bold mb-4">
                          {selectedJob.company?.charAt(0) || 'C'}
                        </div>
                        <h5 className="font-medium text-gray-800 mb-1">
                          {selectedJob.company}
                        </h5>
                        <p className="text-xs text-gray-500">College Logo</p>
                      </div>
                    </div>
                  </div>

                  {/* Current Status Card */}
                  <div className="bg-gradient-to-r from-[#93c5fd]/10 to-[#3b82f6]/10 border border-[#93c5fd]/20 rounded-xl p-6">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Current Status</h3>
                        <p className="text-lg font-semibold text-[#3b82f6]">{selectedJob.status}</p>
                      </div>
                      <div className="h-8 w-px bg-[#93c5fd]/30 hidden md:block"></div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Application ID</h3>
                        <p className="text-sm text-gray-700 font-mono">{selectedJob.id.substring(0, 8)}...</p>
                      </div>
                      <div className="h-8 w-px bg-[#93c5fd]/30 hidden md:block"></div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Applied Date</h3>
                        <p className="text-sm text-gray-700">{selectedJob.date}</p>
                      </div>
                    </div>
                  </div>

                  {/* Skills Section */}
                  {selectedJob.skills && selectedJob.skills !== "-" && (
                    <div>
                      <h3 className="text-lg font-medium text-gray-800 mb-3">Required Skills</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedJob.skills.split(", ").map((skill, index) => (
                          <span key={index} className="px-3 py-1.5 bg-gradient-to-r from-[#93c5fd]/10 to-[#3b82f6]/10 text-[#3b82f6] rounded-lg text-sm border border-[#93c5fd]/20">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Job Description */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-800 mb-3">Job Description</h3>
                    <div className="p-4 bg-gradient-to-r from-white/30 to-white/10 border border-white/50 rounded-xl">
                      <p className="text-gray-700 leading-relaxed">{selectedJob.description}</p>
                    </div>
                  </div>

                  {/* View Full Description Button */}
                  <div className="pt-4">
                    <Link 
                      to={`/company-dashboard/On-campus/${selectedJob?.jobDetails[0]?._id || selectedJob.id}?isApplied=true`}
                      className="group inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#93c5fd] to-[#3b82f6] text-white rounded-xl hover:shadow-lg hover:shadow-[#93c5fd]/40 transition-all duration-200 text-sm font-medium"
                    >
                      View Full Job Description
                      <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform duration-200" />
                    </Link>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white/90 backdrop-blur-sm border border-white/50 rounded-2xl shadow-lg shadow-blue-50/50 p-12 text-center flex flex-col items-center justify-center h-full">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-[#93c5fd]/10 to-[#3b82f6]/10 mb-6">
                  <Award className="h-10 w-10 text-[#3b82f6]" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Select an Application</h3>
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