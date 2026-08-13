import { useState, useEffect } from 'react';
import {
  Search, Eye, ChevronLeft, ChevronRight, Trash,
  Building2, MapPin, Calendar, Briefcase,
  FileText, AlertCircle, CheckCircle2, XCircle
} from 'lucide-react';
import { getAcceptedReferralJobs } from '@/lib/Admin_AxiosInstance';
import ReferralDetailModal from './ReferralDetailModal';
import toast from 'react-hot-toast';
import ReferralApplicationsModal from './ReferralApplicationsModal';

export default function ManageReferral() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedJob, setSelectedJob] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState(null);

  const itemsPerPage = 10;

  const fetchJobs = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getAcceptedReferralJobs();
      // Adjust normalization based on your API structure
      const jobsData = response.data?.data || response.data || [];
      setJobs(Array.isArray(jobsData) ? jobsData : []);
    } catch (err) {
      console.error("❌ API ERROR:", err);
      setError(err.response?.data?.message || err.message || "Failed to fetch referrals.");
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);




  const [isAppModalOpen, setIsAppModalOpen] = useState(false);
  const [targetJob, setTargetJob] = useState(null);

  const handleViewApplicants = (job) => {
    setTargetJob(job);
    setIsAppModalOpen(true);
  };

  // Filtering logic
  const filteredJobs = jobs.filter((job) => {
    const searchLower = String(searchQuery || "").toLowerCase();

    const titleMatch = String(job.jobTitle || "")
      .toLowerCase()
      .includes(searchLower);

    const companyMatch = String(job.companyName || "")
      .toLowerCase()
      .includes(searchLower);

    const locationMatch = Array.isArray(job.location)
      ? job.location.some((loc) =>
        String(
          typeof loc === "object" ? loc.city || loc.name || "" : loc
        )
          .toLowerCase()
          .includes(searchLower)
      )
      : String(job.location || "")
        .toLowerCase()
        .includes(searchLower);

    return titleMatch || companyMatch || locationMatch;
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
                  Manage Pending Referrals
                </h1>
              </div>
              <p className="text-gray-600">Review and moderate employee referral postings</p>
            </div>

            {/* Search Bar */}
            <div className="relative w-full md:w-96">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#143694]/50 focus:outline-none transition-all"
                placeholder="Search by role, company, or city"
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
              <div className="col-span-3 text-center">Actions</div>
            </div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-gray-100">
            {loading ? (
              <div className="p-12 text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#143694]"></div>
                <p className="mt-2 text-gray-500">Fetching referrals...</p>
              </div>
            ) : currentJobs.length === 0 ? (
              <div className="p-12 text-center text-gray-500">
                <div className="mb-2 flex justify-center"><Briefcase size={40} className="text-gray-300" /></div>
                No pending referrals found.
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
                        <span>{new Date(job.createdAt).toLocaleDateString('en-IN')}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="col-span-3">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleViewApplicants(job)}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-all text-xs font-medium"
                          title="View Applicant"
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

      {/* Reusing your Detail Modal for Admin Approval/Rejection */}

      <ReferralApplicationsModal
        isOpen={isAppModalOpen}
        jobId={targetJob?._id}
        jobTitle={targetJob?.jobTitle}
        onClose={() => {
          setIsAppModalOpen(false);
          setTargetJob(null);
        }}
      />
    </div>
  );
}