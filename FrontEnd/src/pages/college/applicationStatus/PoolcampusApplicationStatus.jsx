import { useEffect, useState } from 'react';
import { Search, MapPin, Clock, Calendar, Building, Award, ArrowRight, CheckCircle, GraduationCap, Briefcase, ChevronDown } from 'lucide-react';
import { statusSteps, similarJobs } from '../../../constants/data.js';
import { getUserApplicationStatus } from '@/lib/User_AxiosInstance';
import { Link } from 'react-router-dom';

export default function PoolCampusApplicationStatus() {
    const [poolcampusJobs, setPoolcampusJobs] = useState();
    const [selectedJob, setSelectedJob] = useState();
    const [searchTerm, setSearchTerm] = useState("");
    const [sortBy, setSortBy] = useState("newest");

    const fetchApplication = async () => {
        try {
            const response = await getUserApplicationStatus("Pool-campus");
            const rawData = response?.data?.data || [];
            const normalized = rawData?.map((item) => {
                const firstHistory = Array.isArray(item?.statusHistory) && item.statusHistory.length > 0 ? item.statusHistory[0] : null;
                const existingJobDetails = Array.isArray(item?.jobDetails) ? item.jobDetails : [];
                const existingCompanyDetails = Array.isArray(item?.companyDetails) ? item.companyDetails : [];

                const safeJobDetails = existingJobDetails.length > 0
                    ? existingJobDetails
                    : [{
                        jobTitle: "N/A",
                        yearsOfExperience: "-",
                        workLocations: "-",
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

            setPoolcampusJobs(normalized);
            setSelectedJob(normalized[0]);
        } catch (error) {
            console.log("Error: ", error);
        }
    }

    useEffect(() => {
        fetchApplication();
    }, [])

    const filteredJobs = poolcampusJobs?.filter(job =>
        job?.jobDetails[0]?.jobTitle?.toLowerCase().includes(searchTerm.toLowerCase()) || job?.companyDetails[0].companyDetails.companyName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatusIndex = (status) => statusSteps.findIndex(step => step === status);

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

            <div className="relative z-10">
                {/* Header */}
                <div className="bg-white/90 backdrop-blur-sm border-b border-white/50 py-6 px-6">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
                            <div className="text-center lg:text-left">
                                <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-[#3b82f6] to-[#8b5cf6] bg-clip-text text-transparent mb-2">
                                    Pool Campus Application Status
                                </h1>
                                <p className="text-gray-600 max-w-2xl">
                                    Track your Pool Campus application progress and stay updated with the latest status
                                </p>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Search applications..."
                                        className="pl-10 pr-4 py-3 bg-white/50 backdrop-blur-sm border border-white/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#93c5fd] focus:border-transparent transition-all duration-200 w-full"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                    <Search className="absolute left-3 top-3 h-4 w-4 text-[#3b82f6]" />
                                </div>
                                <div className="relative">
                                    <select
                                        className="pl-4 pr-10 py-3 bg-white/50 backdrop-blur-sm border border-white/50 rounded-xl appearance-none focus:outline-none focus:ring-2 focus:ring-[#93c5fd] focus:border-transparent transition-all duration-200 w-full"
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value)}
                                    >
                                        <option value="newest">Sort by: Newest</option>
                                        <option value="oldest">Sort by: Oldest</option>
                                        <option value="company">Sort by: Company</option>
                                    </select>
                                    <div className="absolute right-3 top-3 pointer-events-none">
                                        <ChevronDown className="h-4 w-4 text-[#3b82f6]" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="max-w-7xl mx-auto p-6">
                    <div className="bg-white/90 backdrop-blur-sm border border-white/50 rounded-2xl shadow-lg shadow-blue-50/50 overflow-hidden">
                        <div className="flex flex-col lg:flex-row min-h-[600px]">
                            {/* Job List Sidebar */}
                            <div className="lg:w-1/3 border-r border-white/50">
                                <div className="p-6 border-b border-white/50">
                                    <h2 className="text-lg font-semibold text-gray-800 mb-2">Your Pool Campus Applications</h2>
                                    <p className="text-sm text-gray-500">{filteredJobs?.length || 0} applications found</p>
                                </div>
                                <div className="overflow-y-auto h-[500px]">
                                    {filteredJobs?.map(job => (
                                        <div
                                            key={job._id}
                                            className={`p-6 border-b border-white/50 cursor-pointer transition-all duration-200 ${selectedJob?.id === job.id ? 'bg-gradient-to-r from-[#93c5fd]/10 to-[#3b82f6]/10' : 'hover:bg-white/30'}`}
                                            onClick={() => setSelectedJob(job)}
                                        >
                                            <div className="flex justify-between items-start mb-2">
                                                <h3 className="font-medium text-gray-900 line-clamp-1">
                                                    {job.jobDetails[0].jobRoles?.map((l, i) => (<span key={i}>{l + ', '}</span>))}
                                                </h3>
                                                <span className={`px-2 py-1 text-xs rounded-full ${job.currentStatus === 'Accepted' 
                                                    ? 'bg-gradient-to-r from-[#a7f3d0]/20 to-[#34d399]/20 text-[#059669] border border-[#a7f3d0]/30'
                                                    : job.currentStatus === 'Rejected'
                                                    ? 'bg-gradient-to-r from-[#fecaca]/20 to-[#f87171]/20 text-[#dc2626] border border-[#fecaca]/30'
                                                    : 'bg-gradient-to-r from-[#fde68a]/20 to-[#f59e0b]/20 text-[#d97706] border border-[#fde68a]/30'
                                                }`}>
                                                    {job?.currentStatus}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-600 mb-3">{job.companyDetails[0].companyDetails.companyName}</p>
                                            <div className="mt-2 flex flex-wrap items-center text-xs text-gray-500 gap-2">
                                                <div className="flex items-center">
                                                    <Clock className="h-3 w-3 mr-1 text-[#3b82f6]" />
                                                    <span>{job.jobDetails[0].employmentType}</span>
                                                </div>
                                                <div className="flex items-center">
                                                    <MapPin className="h-3 w-3 mr-1 text-[#3b82f6]" />
                                                    {job.jobDetails[0].location?.slice(0, 2).map((l, i) => (<span key={i}>{l + ', '}</span>))}
                                                </div>
                                            </div>
                                            <div className="mt-3 flex items-center text-xs text-gray-400">
                                                <Calendar className="h-3 w-3 mr-1" />
                                                <span>{new Date(job.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Job Details */}
                            <div className="lg:w-2/3 overflow-y-auto">
                                {selectedJob && (
                                    <div className="p-6">
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
                                                    className="h-1 bg-gradient-to-r from-[#93c5fd] to-[#3b82f6] rounded-full"
                                                    style={{
                                                        width: `${(getStatusIndex(selectedJob.status) / (statusSteps.length - 1)) * 100}%`
                                                    }}
                                                ></div>
                                            </div>
                                        </div>

                                        {/* Job Details Content */}
                                        <div className="bg-white/50 backdrop-blur-sm p-6 rounded-xl border border-white/50 mb-6">
                                            <div className="flex flex-col lg:flex-row justify-between gap-6">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <Building className="h-5 w-5 text-[#3b82f6]" />
                                                        <h3 className="text-lg font-semibold text-gray-900">
                                                            {selectedJob.jobDetails[0].jobRoles?.map((l, i) => (<span key={i}>{l + ', '}</span>))}
                                                        </h3>
                                                    </div>
                                                    <p className="text-gray-600 mb-4">{selectedJob.companyDetails[0].companyDetails.companyName}</p>
                                                    
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                                        <div className="flex items-center gap-2 text-gray-700">
                                                            <Clock className="h-4 w-4 text-[#3b82f6]" />
                                                            <span className="text-sm">{selectedJob.jobDetails[0].employmentType}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2 text-gray-700">
                                                            <MapPin className="h-4 w-4 text-[#3b82f6]" />
                                                            <span className="text-sm">
                                                                {selectedJob.jobDetails[0].location?.map((l, i) => (<span key={i}>{l + ', '}</span>))}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <div className="mt-4">
                                                        <h4 className="font-medium text-gray-800 mb-2">Application Details</h4>
                                                        <div className="space-y-3">
                                                            <div className="flex justify-between text-sm">
                                                                <span className="text-gray-500">Application ID:</span>
                                                                <span className="text-gray-700 font-medium">{selectedJob._id.substring(0, 8)}...</span>
                                                            </div>
                                                            <div className="flex justify-between text-sm">
                                                                <span className="text-gray-500">Applied Date:</span>
                                                                <span className="text-gray-700 font-medium">
                                                                    {new Date(selectedJob.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                                                                </span>
                                                            </div>
                                                            <div className="flex justify-between text-sm">
                                                                <span className="text-gray-500">Current Status:</span>
                                                                <span className={`font-medium ${selectedJob.currentStatus === 'Accepted' 
                                                                    ? 'text-[#059669]'
                                                                    : selectedJob.currentStatus === 'Rejected'
                                                                    ? 'text-[#dc2626]'
                                                                    : 'text-[#d97706]'
                                                                }`}>
                                                                    {selectedJob.currentStatus}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="mt-6">
                                                        <h4 className="font-medium text-gray-800 mb-3">Job Description</h4>
                                                        <p className="text-gray-700 text-sm leading-relaxed">
                                                            {selectedJob.jobDetails[0]?.description || 'No description available'}
                                                        </p>
                                                    </div>

                                                    <div className="mt-6">
                                                        <Link 
                                                            to={`/college-dashboard/Pool-campus/${selectedJob.jobDetails[0]?._id}?isApplied=true`}
                                                            className="group inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#93c5fd] to-[#3b82f6] text-white rounded-xl hover:shadow-lg hover:shadow-[#93c5fd]/40 transition-all duration-200 text-sm font-medium"
                                                        >
                                                            View Full Job Description
                                                            <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform duration-200" />
                                                        </Link>
                                                    </div>
                                                </div>
                                                
                                                <div className="lg:w-48">
                                                    <div className="bg-gradient-to-br from-[#93c5fd]/10 to-[#3b82f6]/10 border border-[#93c5fd]/20 rounded-xl p-6 text-center">
                                                        <div className="w-16 h-16 mx-auto bg-gradient-to-r from-[#93c5fd] to-[#3b82f6] rounded-full flex items-center justify-center text-white text-xl font-bold mb-4">
                                                            {selectedJob?.companyDetails[0].companyDetails.companyName?.charAt(0) || 'C'}
                                                        </div>
                                                        <h5 className="font-medium text-gray-800 mb-1">
                                                            {selectedJob.companyDetails[0].companyDetails.companyName}
                                                        </h5>
                                                        <p className="text-xs text-gray-500">Company Logo</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};