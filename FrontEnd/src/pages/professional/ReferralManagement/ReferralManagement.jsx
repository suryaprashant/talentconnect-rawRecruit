import { useState, useEffect } from 'react';
import { 
  Search, Eye, ChevronLeft, ChevronRight, 
  Building2, MapPin, Calendar, Briefcase, 
  AlertCircle, Trash2, Ban
} from 'lucide-react';
import toast from 'react-hot-toast';
import { getMyApprovedReferralpost, makeReferralJobInactive,permanentDeleteReferralJob } from '@/lib/User_AxiosInstance'; // ✅ ADD: makeReferralJobInactive
import ReferralApplicationsModal from './ReferralApplicationsModal';

export default function ReferralManagement() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState(null);
  const [viewType, setViewType] = useState('new');
  const [isAppModalOpen, setIsAppModalOpen] = useState(false);
  const [targetJob, setTargetJob] = useState(null);



  const itemsPerPage = 10;

  const fetchMyJobs = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getMyApprovedReferralpost();
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

  const handleViewApplicants = (job, viewType) => {
    setTargetJob(job);
    setViewType(viewType);
    setIsAppModalOpen(true);
  };

 const handleMakeInactive = async (jobId) => {
  const confirmed = window.confirm("This will deactivate the posting. Are you sure?");
  if (!confirmed) return;
  try {
    await makeReferralJobInactive(jobId);
    setJobs(prev => prev.filter(j => j._id !== jobId));
    toast.success("Posting deactivated successfully.");
  } catch (err) {
    console.error("❌ Deactivate ERROR:", err);
    toast.error(err.response?.data?.message || "Failed to deactivate. Try again.");
  }
};

const handlePermanentDelete = async (jobId) => {
  const confirmed = window.confirm("⚠️ This will PERMANENTLY delete the posting and cannot be undone! Are you sure?");
  if (!confirmed) return;
  try {
    await permanentDeleteReferralJob(jobId);
    setJobs(prev => prev.filter(j => j._id !== jobId));
    toast.success("Posting permanently deleted.");
  } catch (err) {
    console.error("❌ Permanent delete ERROR:", err);
    toast.error(err.response?.data?.message || "Failed to permanently delete. Try again.");
  }
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
    <div className="min-h-screen bg-gradient-to-br from-[#143694]/10 via-[#f093fb]/5 to-[#1e4ed8]/10">
      <div className="container mx-auto px-4 py-8 pt-22">

        {/* Header Section */}
        <div className="bg-white/90 backdrop-blur-sm border border-gray-100 rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div className="mb-4 md:mb-0">
              <div className="flex items-center mb-2">
                <div className="p-2 bg-gradient-to-br from-[#143694]/20 to-[#1e4ed8]/20 rounded-lg mr-3">
                  <Briefcase className="h-5 w-5 text-[#143694]" />
                </div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-[#143694] to-[#1e4ed8] bg-clip-text text-transparent">
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
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#143694]/50 focus:outline-none transition-all"
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
          {/* Table Header — ✅ CHANGE: col-span-3 → col-span-2 for Applicants to fit new button */}
          <div className="p-4 border-b border-gray-100 bg-gray-50/50">
            <div className="grid grid-cols-12 gap-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
              <div className="col-span-3">Job Info</div>
              <div className="col-span-2">Location</div>
              <div className="col-span-2">Posted Date</div>
              <div className="col-span-2">Apply By Date</div>
              <div className="col-span-3 text-center">Actions</div> {/* ✅ CHANGE: label to "Actions", col-span-4 */}
            </div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-gray-100 min-h-[400px]">
            {loading ? (
              <div className="p-12 text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#143694]"></div>
                <p className="mt-2 text-gray-500">Loading your postings...</p>
              </div>
            ) : currentJobs.length === 0 ? (
              <div className="p-12 text-center text-gray-500">
                <div className="mb-2 flex justify-center"><Briefcase size={40} className="text-gray-300" /></div>
                No referral postings found.
              </div>
            ) : (
              currentJobs.map((job) => (
                <div key={job._id} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="grid grid-cols-12 gap-4 items-center">

                    {/* Job Info */}
                    <div className="col-span-3">
                      <h3 className="font-semibold text-gray-900 truncate">{job.jobTitle}</h3>
                      <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                        <Building2 size={14} />
                        <span>{job.companyName}</span>
                      </div>
                    </div>

                    {/* Location — ✅ CHANGE: col-span-3 → col-span-2 */}
                    <div className="col-span-2">
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <MapPin size={14} className="text-gray-400" />
                        <span className="truncate">
                          {Array.isArray(job.location) ? job.location.join(', ') : (job.location || 'Remote')}
                        </span>
                      </div>
                    </div>

                    {/* Date — ✅ CHANGE: col-span-2 stays */}
                    <div className="col-span-2">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar size={14} className="text-gray-400" />
                        <span>{new Date(job.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="col-span-2">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar size={14} className="text-gray-400" />
                        <span>{new Date(job.endDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                    {/* ✅ ADD: Actions column with 3 buttons — col-span-4 */}
                  <div className="col-span-3">
  <div className="flex items-center justify-end gap-1 flex-wrap">
    <button
      onClick={() => handleViewApplicants(job, 'new')}
      className="flex items-center gap-1.5 px-2 py-1 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-all text-xs font-bold"
    >
      <Eye size={14} />
      New
    </button>
    <button
      onClick={() => handleViewApplicants(job, 'reviewed')}
      className="flex items-center gap-1.5 px-2 py-1 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-all text-xs font-bold"
    >
      <Eye size={14} />
      Reviewed
    </button>
    <button
      onClick={() => handleMakeInactive(job._id)}
      className="flex items-center gap-1.5 px-2 py-1 bg-orange-50 text-orange-600 rounded-lg hover:bg-orange-100 transition-all text-xs font-bold"
    >
      <Ban size={14} />
      Deactivate
    </button>
    <button
      onClick={() => handlePermanentDelete(job._id)}
      className="flex items-center gap-1.5 px-2 py-1 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-all text-xs font-bold"
    >
      <Trash2 size={14} />
      Delete
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

      {/* Existing Modal */}
      <ReferralApplicationsModal
        isOpen={isAppModalOpen}
        jobId={targetJob?._id}
        jobTitle={targetJob?.jobTitle}
        viewType={viewType}
        onClose={() => {
          setIsAppModalOpen(false);
          setTargetJob(null);
        }}
      />

      {/* ✅ ADD: Deactivate Confirmation Modal */}
    

    </div>
  );
}