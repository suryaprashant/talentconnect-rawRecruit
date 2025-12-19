import { useEffect, useState } from 'react';
import { MapPin, Clock, Calendar, Briefcase, Award, Building, CheckCircle, ArrowRight, GraduationCap, FileText, Users, Eye, CheckSquare, TrendingUp } from 'lucide-react';
import { statusSteps } from '../../../constants/data.js';
import { getUserApplicationStatus } from '@/lib/User_AxiosInstance';
import { Link } from 'react-router-dom';

export default function OncampusApplicationStatus() {
  const [oncampusJobs, setOncampusJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
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

  const getStatusIndex = (status) => {
    if (!status) return 0;
    return statusSteps.findIndex(step => step === status);
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Accepted':
        return {
          bg: 'bg-gradient-to-r from-green-500/10 to-emerald-400/10',
          text: 'text-emerald-600',
          border: 'border-emerald-200',
          icon: 'bg-gradient-to-r from-green-500 to-emerald-500'
        };
      case 'Rejected':
        return {
          bg: 'bg-gradient-to-r from-red-500/10 to-rose-400/10',
          text: 'text-rose-600',
          border: 'border-rose-200',
          icon: 'bg-gradient-to-r from-red-500 to-rose-500'
        };
      case 'Shortlisted':
        return {
          bg: 'bg-gradient-to-r from-amber-500/10 to-yellow-400/10',
          text: 'text-amber-600',
          border: 'border-amber-200',
          icon: 'bg-gradient-to-r from-amber-500 to-yellow-500'
        };
      default:
        return {
          bg: 'bg-gradient-to-r from-blue-500/10 to-indigo-400/10',
          text: 'text-blue-600',
          border: 'border-blue-200',
          icon: 'bg-gradient-to-r from-blue-500 to-indigo-500'
        };
    }
  };

  // Calculate stats
  const totalApplications = oncampusJobs.length;
  const acceptedCount = oncampusJobs.filter(job => job.status === 'Accepted').length;
  const inProgressCount = oncampusJobs.filter(job => ['Applied', 'Shortlisted'].includes(job.status)).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0e6f7]/60 via-[#d4e8f9]/55 to-[#cff7ea]/60">
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-6">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-[#3b82f6] to-[#8b5cf6] bg-clip-text text-transparent">
                On Campus Application Status
              </h1>
              <p className="text-gray-600 mt-1">
                Track your On-Campus application progress and stay updated with the latest status
              </p>
            </div>
            
            <div className="relative">
              <select
                className="w-full md:w-auto pl-4 pr-10 py-2.5 bg-white/90 backdrop-blur-sm border border-white/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#93c5fd] focus:border-transparent appearance-none"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="newest">Sort by: Newest</option>
                <option value="oldest">Sort by: Oldest</option>
                <option value="company">Sort by: Company</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                <ArrowRight className="w-3 h-3 text-[#3b82f6] transform rotate-90" />
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white/90 backdrop-blur-sm border border-white/50 rounded-xl p-4 shadow-lg shadow-blue-50/30">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-[#3b82f6]/10 to-[#8b5cf6]/10 rounded-lg">
                  <FileText className="h-4 w-4 text-[#3b82f6]" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{totalApplications}</p>
                  <p className="text-sm text-gray-500">Total Applications</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white/90 backdrop-blur-sm border border-white/50 rounded-xl p-4 shadow-lg shadow-green-50/30">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-lg">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{acceptedCount}</p>
                  <p className="text-sm text-gray-500">Accepted</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white/90 backdrop-blur-sm border border-white/50 rounded-xl p-4 shadow-lg shadow-amber-50/30">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-amber-500/10 to-yellow-500/10 rounded-lg">
                  <TrendingUp className="h-4 w-4 text-amber-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{inProgressCount}</p>
                  <p className="text-sm text-gray-500">In Progress</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Job List Sidebar */}
          <div className="lg:w-2/5">
            <div className="bg-white/90 backdrop-blur-sm border border-white/50 rounded-xl shadow-lg shadow-blue-50/30 overflow-hidden">
              <div className="p-4 border-b border-white/50">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">Your Applications</h2>
                  <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-[#3b82f6]/10 text-[#3b82f6]">
                    {oncampusJobs.length}
                  </span>
                </div>
              </div>
              
              <div className="h-[500px] overflow-y-auto">
                {oncampusJobs.length > 0 ? (
                  oncampusJobs.map(job => {
                    const statusColor = getStatusColor(job.status);
                    return (
                      <div
                        key={job.id}
                        className={`p-4 border-b border-white/50 cursor-pointer transition-colors duration-150 ${
                          selectedJob?.id === job.id 
                            ? 'bg-gradient-to-r from-[#93c5fd]/10 to-[#3b82f6]/10' 
                            : 'hover:bg-white/30'
                        }`}
                        onClick={() => setSelectedJob(job)}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${
                            selectedJob?.id === job.id 
                              ? 'bg-gradient-to-r from-[#93c5fd] to-[#3b82f6] text-white' 
                              : 'bg-white/50 border border-white/50 text-[#3b82f6]'
                          }`}>
                            <Building className="h-4 w-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start mb-1">
                              <h3 className="font-medium text-gray-900 truncate text-sm">{job.company}</h3>
                              <span className={`px-2 py-1 text-xs font-medium rounded-full border ${statusColor.text} ${statusColor.bg} ${statusColor.border}`}>
                                {job.status}
                              </span>
                            </div>
                            <p className="text-sm text-gray-700 font-medium truncate mb-2">{job.jobTitle}</p>
                            
                            <div className="space-y-1">
                              <div className="flex items-center text-xs text-gray-500">
                                <GraduationCap className="w-3 h-3 mr-1.5 text-[#3b82f6] flex-shrink-0" />
                                <span className="truncate">{job.degree}</span>
                              </div>
                              <div className="flex items-center text-xs text-gray-500">
                                <MapPin className="w-3 h-3 mr-1.5 text-[#3b82f6] flex-shrink-0" />
                                <span className="truncate">{job.city}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="p-8 text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-[#93c5fd]/10 to-[#3b82f6]/10 mb-3">
                      <FileText className="h-5 w-5 text-[#3b82f6]" />
                    </div>
                    <p className="text-gray-500">No applications found</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Job Details */}
          <div className="lg:w-3/5">
            {selectedJob ? (
              <div className="bg-white/90 backdrop-blur-sm border border-white/50 rounded-xl shadow-lg shadow-blue-50/30 p-6 h-full">
                {/* Progress Bar */}
                <div className="mb-8">
                  <div className="flex justify-between mb-4 relative">
                    {statusSteps?.map((step, idx) => {
                      const currentIdx = getStatusIndex(selectedJob.status);
                      const isActive = idx <= currentIdx;

                      return (
                        <div key={idx} className="flex flex-col items-center relative z-10" style={{ width: `${100 / statusSteps.length}%` }}>
                          <div className={`relative w-8 h-8 rounded-full mb-2 flex items-center justify-center border-2 ${
                            isActive 
                              ? 'bg-gradient-to-r from-[#93c5fd] to-[#3b82f6] text-white border-transparent' 
                              : 'bg-white/50 border-white/50 text-gray-400'
                          }`}>
                            {isActive ? (
                              <CheckCircle className="h-4 w-4" />
                            ) : (
                              <span className="text-xs font-semibold">{idx + 1}</span>
                            )}
                          </div>
                          <span className={`text-xs text-center font-medium ${isActive ? 'text-[#3b82f6]' : 'text-gray-500'}`}>
                            {step}
                          </span>
                        </div>
                      );
                    })}
                    
                    <div className="absolute left-0 right-0 top-4 h-0.5 bg-white/50">
                      <div
                        className="h-0.5 bg-gradient-to-r from-[#93c5fd] to-[#3b82f6] rounded-full transition-all duration-300 ease-out"
                        style={{
                          width: `${(getStatusIndex(selectedJob.status) / (statusSteps.length - 1)) * 100}%`
                        }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-[#93c5fd]/10 to-[#3b82f6]/10">
                      <Clock className="h-3 w-3 text-[#3b82f6]" />
                      <span className="text-xs font-medium text-[#3b82f6]">
                        Current Status: <span className="font-bold">{selectedJob.status}</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Job Details Content */}
                <div className="space-y-6">
                  {/* Header Section */}
                  <div className="flex flex-col sm:flex-row gap-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <Building className="h-5 w-5 text-[#3b82f6]" />
                        <div>
                          <h2 className="text-xl font-bold text-gray-900">{selectedJob.company}</h2>
                          <p className="text-gray-700 font-medium">{selectedJob.jobTitle}</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3 mb-4">
                        <div className="bg-gradient-to-r from-white/30 to-white/10 rounded-lg p-3 border border-white/50">
                          <div className="flex items-center gap-2">
                            <Briefcase className="h-3.5 w-3.5 text-[#3b82f6]" />
                            <div>
                              <p className="text-xs text-gray-500">Employment Type</p>
                              <p className="text-sm font-medium text-gray-900">{selectedJob.employmentType}</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="bg-gradient-to-r from-white/30 to-white/10 rounded-lg p-3 border border-white/50">
                          <div className="flex items-center gap-2">
                            <GraduationCap className="h-3.5 w-3.5 text-[#3b82f6]" />
                            <div>
                              <p className="text-xs text-gray-500">Required Degree</p>
                              <p className="text-sm font-medium text-gray-900">{selectedJob.degree}</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="bg-gradient-to-r from-white/30 to-white/10 rounded-lg p-3 border border-white/50">
                          <div className="flex items-center gap-2">
                            <MapPin className="h-3.5 w-3.5 text-[#3b82f6]" />
                            <div>
                              <p className="text-xs text-gray-500">Location</p>
                              <p className="text-sm font-medium text-gray-900">{selectedJob.city}</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="bg-gradient-to-r from-white/30 to-white/10 rounded-lg p-3 border border-white/50">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-3.5 w-3.5 text-[#3b82f6]" />
                            <div>
                              <p className="text-xs text-gray-500">Applied Date</p>
                              <p className="text-sm font-medium text-gray-900">{selectedJob.date}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* College Logo */}
                    <div className="sm:w-40">
                      <div className="bg-gradient-to-br from-[#93c5fd]/10 to-[#3b82f6]/10 border border-[#93c5fd]/20 rounded-lg p-4 text-center">
                        <div className="w-16 h-16 mx-auto mb-3 bg-gradient-to-r from-[#93c5fd] to-[#3b82f6] rounded-lg flex items-center justify-center text-white text-lg font-bold">
                          {selectedJob.company?.charAt(0) || 'C'}
                        </div>
                        <h5 className="font-medium text-gray-900 text-sm truncate">{selectedJob.company}</h5>
                        <p className="text-xs text-gray-500 mt-1">Application ID</p>
                        <p className="text-xs font-mono text-gray-700">{selectedJob.id.substring(0, 6)}...</p>
                      </div>
                    </div>
                  </div>

                  {/* Skills Section */}
                  {selectedJob.skills && selectedJob.skills !== "-" && (
                    <div className="bg-gradient-to-r from-[#93c5fd]/10 to-[#3b82f6]/10 border border-[#93c5fd]/20 rounded-lg p-4">
                      <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <Award className="h-4 w-4 text-[#3b82f6]" />
                        Required Skills
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedJob.skills.split(", ").map((skill, index) => (
                          <span 
                            key={index} 
                            className="px-3 py-1.5 bg-white/80 text-gray-700 rounded-lg text-xs font-medium border border-white/60"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Job Description */}
                  <div className="bg-gradient-to-r from-white/30 to-white/10 border border-white/50 rounded-lg p-4">
                    <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <FileText className="h-4 w-4 text-[#3b82f6]" />
                      Job Description
                    </h3>
                    <div className="p-3 bg-white/40 rounded border border-white/60">
                      <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">{selectedJob.description}</p>
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="pt-2">
                    <Link 
                      to={`/company-dashboard/On-campus/${selectedJob?.jobDetails[0]?._id || selectedJob.id}?isApplied=true`}
                      className="group inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#93c5fd] to-[#3b82f6] text-white rounded-lg hover:shadow-lg hover:shadow-[#93c5fd]/40 transition-all duration-200 text-sm font-medium"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      View Full Details
                      <ArrowRight className="h-3.5 w-3.5 transform group-hover:translate-x-1 transition-transform duration-200" />
                    </Link>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white/90 backdrop-blur-sm border border-white/50 rounded-xl shadow-lg shadow-blue-50/30 p-8 text-center flex flex-col items-center justify-center h-full">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-[#93c5fd]/10 to-[#3b82f6]/10 mb-4">
                  <Award className="h-6 w-6 text-[#3b82f6]" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Select an Application</h3>
                <p className="text-gray-500 text-sm max-w-md">
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