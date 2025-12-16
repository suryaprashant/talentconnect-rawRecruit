import { useEffect, useState } from 'react';
import { Search, MapPin, Clock, Filter } from 'lucide-react';
// import SimilarJobs from '../SimilarJobs';
import { statusSteps, similarJobs } from '../../../../constants/data.js';
import { getUserApplicationStatus } from '@/lib/User_AxiosInstance';
import { Link } from 'react-router-dom';

const OffcampusStatus = () => {
  const [offcampusJobs, setOffcampusJobs] = useState();
  const [selectedJob, setSelectedJob] = useState();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [isLoading, setIsLoading] = useState(true);

  const fetchApplication = async () => {
    try {
      setIsLoading(true);
      const response = await getUserApplicationStatus("Off-campus");
      const rawData = response?.data?.data || [];
      const normalized = rawData.map((item) => {
        const firstHistory = Array.isArray(item?.statusHistory) && item.statusHistory.length > 0 ? item.statusHistory[0] : null;
        const existingJobDetails = Array.isArray(item?.jobDetails) ? item.jobDetails : [];
        const existingCompanyDetails = Array.isArray(item?.companyDetails) ? item.companyDetails : [];

        const baseJobDetails = existingJobDetails[0] || {};
        const derivedWorkLocations = Array.isArray(baseJobDetails?.location) && baseJobDetails.location.length > 0
          ? baseJobDetails.location.join(", ")
          : baseJobDetails?.workLocations || "-";
        const safeJobDetails = existingJobDetails.length > 0
          ? [{
              ...baseJobDetails,
              jobTitle: baseJobDetails?.jobTitle || (Array.isArray(baseJobDetails?.jobRoles) ? baseJobDetails.jobRoles[0] : "N/A"),
              yearsOfExperience: baseJobDetails?.yearsOfExperience || "-",
              workLocations: derivedWorkLocations,
              jobDescription: baseJobDetails?.description || baseJobDetails?.jobDescription || ""
            }]
          : [{
              jobTitle: "N/A",
              yearsOfExperience: "-",
              workLocations: "-",
              jobRoles: ["N/A"],
              jobDescription: ""
            }];

        const safeCompanyDetails = existingCompanyDetails.length > 0
          ? existingCompanyDetails
          : [{ companyDetails: { companyName: "-" } }];

        return {
          ...item,
          id: item?._id,
          status: item?.currentStatus ?? item?.status ?? "",
          date: firstHistory?.date ?? item?.createdAt ?? "",
          jobDetails: safeJobDetails,
          companyDetails: safeCompanyDetails,
          experience: item?.experience ?? safeJobDetails?.[0]?.yearsOfExperience ?? "-"
        };
      });

      setOffcampusJobs(normalized);
      setSelectedJob(normalized[0]);
    } catch (error) {
      console.log("Error: ", error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchApplication();
  }, [])

  const filteredJobs = offcampusJobs?.filter(job =>
    job?.jobDetails[0]?.jobRoles[0]?.toLowerCase().includes(searchTerm.toLowerCase()) || job?.companyDetails[0]?.companyDetails?.companyName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusIndex = (status) => statusSteps.findIndex(step => step === status);

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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#667eea]/10 via-[#f093fb]/5 to-[#764ba2]/10">
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#667eea]/10 rounded-full blur-3xl"></div>
          <div className="absolute top-1/3 -left-20 w-60 h-60 bg-[#f093fb]/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-1/3 w-40 h-40 bg-[#764ba2]/10 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative z-10 flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#667eea]"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#667eea]/10 via-[#f093fb]/5 to-[#764ba2]/10">
      {/* Pastel blur background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#667eea]/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 -left-20 w-60 h-60 bg-[#f093fb]/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-1/3 w-40 h-40 bg-[#764ba2]/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 flex flex-col h-screen">
        {/* Header */}
        <div className="bg-white/90 backdrop-blur-sm border-b border-white/50 py-4 px-6 shadow-lg shadow-purple-50/50">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent">Application Status</h1>
              <p className="text-gray-600 mt-1">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros.</p>
            </div>
            
            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="flex flex-col">
                <span className="text-xs text-gray-500 mb-1">Total Applications</span>
                <span className="px-3 py-2 text-sm font-medium bg-gradient-to-r from-[#a5b4fc]/20 to-[#c4b5fd]/20 text-[#5b21b6] border border-[#a5b4fc]/30 rounded-xl">
                  {offcampusJobs?.length || 0}
                </span>
              </div>
              
              <div className="flex flex-col">
                <span className="text-xs text-gray-500 mb-1">Status</span>
                <span className="px-3 py-2 text-sm font-medium bg-gradient-to-r from-[#bbf7d0]/20 to-[#86efac]/20 text-[#065f46] border border-[#bbf7d0]/30 rounded-xl">
                  Active
                </span>
              </div>
              
              <div className="flex flex-col">
                <span className="text-xs text-gray-500 mb-1">Updated</span>
                <span className="px-3 py-2 text-sm font-medium bg-gradient-to-r from-[#fde68a]/20 to-[#fcd34d]/20 text-[#92400e] border border-[#fde68a]/30 rounded-xl">
                  Today
                </span>
              </div>
              
              <div className="flex flex-col">
                <span className="text-xs text-gray-500 mb-1">Type</span>
                <span className="px-3 py-2 text-sm font-medium bg-gradient-to-r from-[#fbcfe8]/20 to-[#f9a8d4]/20 text-[#9d174d] border border-[#fbcfe8]/30 rounded-xl">
                  Off-Campus
                </span>
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
                placeholder="Search applications..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl bg-white/50 focus:outline-none focus:ring-2 focus:ring-[#667eea]/30 focus:border-[#667eea] backdrop-blur-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Filter className="h-4 w-4 text-gray-400" />
              </div>
              <select
                className="pl-10 pr-8 py-2 border border-gray-200 rounded-xl bg-white/50 appearance-none focus:outline-none focus:ring-2 focus:ring-[#667eea]/30 focus:border-[#667eea] backdrop-blur-sm"
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

        {/* Main Content */}
        <div className="flex flex-1 overflow-hidden p-4 md:p-6">
          {/* Job List Sidebar */}
          <div className="w-full md:w-64 bg-white/90 backdrop-blur-sm border border-white/50 rounded-2xl shadow-lg shadow-purple-50/50 overflow-y-auto mr-0 md:mr-6">
            {filteredJobs?.length > 0 ? filteredJobs?.map(job => (
              <div
                key={job._id}
                className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gradient-to-r hover:from-[#667eea]/5 hover:to-[#764ba2]/5 transition-all duration-200 ${selectedJob?.id === job.id ? 'bg-gradient-to-r from-[#667eea]/10 to-[#764ba2]/10' : ''}`}
                onClick={() => setSelectedJob(job)}
              >
                <span className={`text-xs px-2 py-1 rounded-lg ${getStatusColor(job?.currentStatus || 'Applied')}`}>
                  {job?.currentStatus || 'Applied'}
                </span>
                <h3 className="font-medium text-gray-900 mt-2">{job.jobDetails[0].jobRoles[0]}</h3>
                <p className="text-sm text-gray-600">{job.companyDetails[0].companyDetails.companyName}</p>
                <div className="mt-2 flex items-center text-xs text-gray-500">
                  <Clock className="h-3 w-3 mr-1" />
                  <span>{job.jobDetails[0].yearsOfExperience}</span>
                  <span className="mx-2">•</span>
                  <MapPin className="h-3 w-3 mr-1" />
                  <span>{job.jobDetails[0].workLocations}</span>
                </div>
              </div>
            )) : (
              <div className='p-4 text-gray-600 text-center'>No applications found!</div>
            )}
          </div>

          {/* Job Details */}
          <div className="flex-1 overflow-y-auto">
            {selectedJob && (
              <div className="space-y-6">
                {/* Status Progress Bar */}
                <div className="bg-white/90 backdrop-blur-sm border border-white/50 rounded-2xl shadow-lg shadow-purple-50/50 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Application Progress</h3>
                  <div className="relative mb-2">
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-2 bg-gradient-to-r from-[#667eea] to-[#764ba2] rounded-full"
                        style={{
                          width: `${(getStatusIndex(selectedJob.status) / (statusSteps.length - 1)) * 100}%`
                        }}
                      ></div>
                    </div>
                    <div className="flex justify-between mt-4">
                      {statusSteps?.map((step, idx) => {
                        const currentIdx = getStatusIndex(selectedJob.status);
                        const isActive = idx <= currentIdx;

                        return (
                          <div key={idx} className="flex flex-col items-center text-xs" style={{ width: `${100 / statusSteps.length}%` }}>
                            <div className={`w-6 h-6 rounded-full mb-1 flex items-center justify-center ${isActive ? 'bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white' : 'bg-gray-200 text-gray-500'}`}>
                              {idx + 1}
                            </div>
                            <span className={`text-center text-xs ${isActive ? 'text-[#667eea] font-medium' : 'text-gray-500'}`}>
                              {step}
                            </span>
                            <span className="text-gray-400 text-xs mt-1">{idx === 0 ? selectedJob.date : ''}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Job Details Content */}
                <div className="bg-white/90 backdrop-blur-sm border border-white/50 rounded-2xl shadow-lg shadow-purple-50/50 p-6">
                  <div className="flex justify-between">
                    <div>
                      <h2 className="text-xl font-semibold bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent">{selectedJob.jobDetails[0].jobRoles[0]}</h2>
                      <p className="text-gray-600">{selectedJob.companyDetails[0].companyDetails.companyName}</p>
                      <div className="mt-3 text-sm text-gray-500">
                        <div className="flex items-center mt-1">
                          <Clock className="h-4 w-4 mr-1 text-gray-400" />
                          <span className="px-2 py-1 bg-gradient-to-r from-[#fde68a]/20 to-[#fcd34d]/20 text-[#92400e] border border-[#fde68a]/30 rounded-lg text-xs">
                            {selectedJob.experience}
                          </span>
                          <span className="mx-2">•</span>
                          <MapPin className="h-4 w-4 mr-1 text-gray-400" />
                          <span className="px-2 py-1 bg-gradient-to-r from-[#bae6fd]/20 to-[#7dd3fc]/20 text-[#0369a1] border border-[#bae6fd]/30 rounded-lg text-xs">
                            {selectedJob.jobDetails[0].workLocations}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="w-16 h-16 bg-gradient-to-r from-[#667eea]/10 to-[#764ba2]/10 rounded-2xl flex items-center justify-center border border-[#667eea]/20">
                      <span className="text-2xl font-bold text-[#667eea]">{selectedJob?.companyDetails[0].companyDetails.companyName?.charAt(0) || 'N'}</span>
                    </div>
                  </div>

                  <div className="mt-6">
                    <p className="text-gray-700">{selectedJob.jobDetails?.jobDescription}</p>
                  </div>

                  <div className="mt-6">
                    <h3 className="font-medium text-gray-900 mb-2">Activity on this role</h3>
                    <div className="flex border-t border-gray-100">
                      <div className="py-4 px-6 border-r border-gray-100">
                        <p className="text-lg font-semibold text-gray-900">1580</p>
                        <p className="text-sm text-gray-500">Total applications</p>
                      </div>
                      <div className="py-4 px-6">
                        <p className="text-lg font-semibold text-gray-900">83</p>
                        <p className="text-sm text-gray-500">Applications viewed by recruiter</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4">
                    <Link 
                      to={`/professional-dashboard/Job-listing/${selectedJob?.jobDetails[0]?._id}?isApplied=true`} 
                      className="text-[#667eea] text-sm font-medium hover:text-[#764ba2] transition-colors duration-200"
                    >
                      View full description
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OffcampusStatus;