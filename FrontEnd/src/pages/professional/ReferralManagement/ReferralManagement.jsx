import { useState, useEffect } from 'react';
import { 
  Search, Eye, ChevronLeft, ChevronRight, 
  Building2, MapPin, Calendar, Briefcase, 
  AlertCircle 
} from 'lucide-react';
import axios from 'axios'; // Or your Professional Axios Instance
// import ReferralApplicationsModal from './ReferralApplicationsModal';

export default function ReferralManagement() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState(null);

  const [isAppModalOpen, setIsAppModalOpen] = useState(false);
  const [targetJob, setTargetJob] = useState(null);

  const itemsPerPage = 10;

  const fetchMyJobs = async () => {
    setLoading(true);
    setError(null);
    try {
      // Updated API URL with your specific query parameters
      // Note: Use backticks if you need to make the jobId dynamic via a variable
      const response = await axios.get(
        'http://localhost:5000/api/student-dashboard/referral-jobs', 
        
      );

      // Accessing the data based on common backend structures
      const jobsData = response.data?.data || response.data || [];
      setJobs(Array.isArray(jobsData) ? jobsData : []);
    } catch (err) {
      console.error("❌ API ERROR:", err);
      setError(err.response?.data?.message || "Failed to fetch approved referrals.");
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyJobs();
  }, []);

  const handleViewApplicants = (job) => {
    setTargetJob(job);
    setIsAppModalOpen(true);
  };

  // Filtering logic
  const filteredJobs = jobs.filter(job => {
    const searchLower = searchQuery.toLowerCase();
    const locationString = Array.isArray(job.location) ? job.location.join(' ') : (job.location || '');
    
    return (
      job.jobTitle?.toLowerCase().includes(searchLower) ||
      job.companyName?.toLowerCase().includes(searchLower) ||
      locationString.toLowerCase().includes(searchLower)
    );
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredJobs.length / itemsPerPage);
  const currentJobs = filteredJobs.slice(
    (currentPage - 1) * itemsPerPage, 
    currentPage * itemsPerPage
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#667eea]/10 via-[#f093fb]/5 to-[#764ba2]/10">
      <div className="container mx-auto px-4 py-8 pt-22">
        
        {/* Header Section */}
        <div className="bg-white/90 backdrop-blur-sm border border-gray-100 rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div className="mb-4 md:mb-0">
              <div className="flex items-center mb-2">
                <div className="p-2 bg-gradient-to-br from-[#667eea]/20 to-[#764ba2]/20 rounded-lg mr-3">
                  <Briefcase className="h-5 w-5 text-[#667eea]" />
                </div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent">
                  My Referral Postings
                </h1>
              </div>
              <p className="text-gray-600">Track and manage candidates for the jobs you've referred</p>
            </div>
            
            {/* Search Bar */}
            <div className="relative w-full md:w-96">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#667eea]/50 focus:outline-none transition-all"
                placeholder="Search your roles or locations..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 flex items-center text-red-700">
            <AlertCircle className="h-5 w-5 mr-3" />
            {error}
          </div>
        )}

        {/* Management Table */}
        <div className="bg-white/90 backdrop-blur-sm border border-gray-100 rounded-2xl shadow-lg overflow-hidden">
          {/* Table Header */}
          <div className="p-4 border-b border-gray-100 bg-gray-50/50">
            <div className="grid grid-cols-12 gap-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
              <div className="col-span-4">Job Info</div>
              <div className="col-span-3">Location</div>
              <div className="col-span-2">Posted Date</div>
              <div className="col-span-3 text-center">Applicants</div>
            </div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-gray-100 min-h-[400px]">
            {loading ? (
              <div className="p-12 text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#667eea]"></div>
                <p className="mt-2 text-gray-500">Loading your postings...</p>
              </div>
            ) : currentJobs.length === 0 ? (
              <div className="p-12 text-center text-gray-500">
                <div className="mb-2 flex justify-center"><Briefcase size={40} className="text-gray-300"/></div>
                No referral postings found.
              </div>
            ) : (
              currentJobs.map((job) => (
                <div key={job._id} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="grid grid-cols-12 gap-4 items-center">
                    
                    {/* Job Info */}
                    <div className="col-span-4">
                      <h3 className="font-semibold text-gray-900 truncate">{job.jobTitle}</h3>
                      <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                        <Building2 size={14} />
                        <span>{job.companyName}</span>
                      </div>
                    </div>

                    {/* Location */}
                    <div className="col-span-3">
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <MapPin size={14} className="text-gray-400" />
                        <span className="truncate">
                          {Array.isArray(job.location) ? job.location.join(', ') : (job.location || 'Remote')}
                        </span>
                      </div>
                    </div>

                    {/* Date */}
                    <div className="col-span-2">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar size={14} className="text-gray-400" />
                        <span>{new Date(job.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="col-span-3">
                      <div className="flex items-center justify-center">
                        <button
                          onClick={() => handleViewApplicants(job)}
                          className="flex items-center gap-1.5 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-all text-xs font-bold"
                        >
                          <Eye size={14} />
                          View Applicants 
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="p-4 flex items-center justify-between border-t border-gray-100 bg-gray-50/30">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 border rounded-lg disabled:opacity-50 hover:bg-white transition-all"
              >
                <ChevronLeft size={20} />
              </button>
              <span className="text-sm font-medium text-gray-600">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-2 border rounded-lg disabled:opacity-50 hover:bg-white transition-all"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Applications Modal
      {/* <ReferralApplicationsModal 
        isOpen={isAppModalOpen}
        jobId={targetJob?._id}
        jobTitle={targetJob?.jobTitle}
        onClose={() => {
          setIsAppModalOpen(false);
          setTargetJob(null);
        }} */}
    
    </div>
  );
}