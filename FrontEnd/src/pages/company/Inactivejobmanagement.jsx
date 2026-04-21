import { useState, useEffect } from 'react';
import { Search, Eye, ChevronLeft, ChevronRight, Building2, MapPin, Calendar, Users, FileText, AlertCircle, RotateCcw, Archive } from 'lucide-react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { getPostedJobs } from '@/lib/Company_AxiosInstance';
import toast from 'react-hot-toast';

const JOB_TYPES = [
  { label: 'On-Campus', value: 'On-campus' },
  { label: 'Pool-Campus', value: 'Pool-campus' },
  { label: 'Off-Campus', value: 'Off-campus' },
  { label: 'Internship', value: 'Internship' },
];

export default function InactiveJobManagement() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('On-campus');
  const navigate = useNavigate();

  const itemsPerPage = 10;

  const fetchJobs = async (jobType) => {
    setLoading(true);
    setError(null);
    setJobs([]);

    try {
      const response = await getPostedJobs(jobType, 'Applied', false); // active=false
      const jobsData =
        Array.isArray(response?.data)
          ? response.data
          : Array.isArray(response?.data?.jobs)
            ? response.data.jobs
            : Array.isArray(response?.data?.data)
              ? response.data.data
              : [];
      setJobs(jobsData);
    } catch (err) {
      console.error('Error fetching inactive jobs:', err);
      setError(err.response?.data?.message || err.message || 'Failed to fetch inactive jobs.');
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs(activeTab);
    setCurrentPage(1);
  }, [activeTab]);

  const handleTabChange = (jobType) => {
    setActiveTab(jobType);
    setSearchQuery('');
  };

  const displayLocations = (location, workLocation) => {
    const finalLocation =
      Array.isArray(location) && location.length > 0
        ? location
        : Array.isArray(workLocation) && workLocation.length > 0
          ? workLocation
          : null;
    if (!finalLocation) return 'N/A';
    return finalLocation.join(', ');
  };

  const filteredJobs = Array.isArray(jobs)
    ? jobs.filter(job => {
        const searchLower = searchQuery.toLowerCase();
        const locationsMatch = Array.isArray(job.location)
          ? job.location.some(loc => loc?.toLowerCase().includes(searchLower))
          : false;
        return (
          job.lookingFor?.toLowerCase().includes(searchLower) ||
          locationsMatch ||
          job._id?.toLowerCase().includes(searchLower) ||
          (Array.isArray(job.jobRoles)
            ? job.jobRoles.some(r => r?.toLowerCase().includes(searchLower))
            : job.jobRoles?.toLowerCase().includes(searchLower))
        );
      })
    : [];

  const totalItems = filteredJobs.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentJobs = filteredJobs.slice(startIndex, startIndex + itemsPerPage);

  const formatDate = (date) => {
    if (!date) return 'N/A';
    try {
      return new Date(date).toUTCString().slice(0, 16);
    } catch {
      return 'N/A';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#143694]/10 via-[#f093fb]/5 to-[#1e4ed8]/10">

      {/* Top Nav */}
      <div className="container mx-auto px-4 pt-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 px-6 py-5 mb-0">
          <div className="flex items-center mb-4">
            <div className="p-2 bg-[#143694]/10 rounded-lg mr-3">
              <Archive className="h-5 w-5 text-[#143694]" />
            </div>
            <h2 className="text-2xl md:text-[26px] font-semibold text-[#143694] tracking-tight">
              Inactive Jobs
            </h2>
            <span className="ml-3 flex items-center justify-center w-7 h-7 bg-[#143694] text-white text-xs font-bold rounded-full">
              {jobs.length}
            </span>
          </div>

          {/* Tab Nav */}
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 border-gray-200 pb-2">
            {JOB_TYPES.map(({ label, value }) => (
              <button
                key={value}
                onClick={() => handleTabChange(value)}
                className={`px-6 py-2 rounded-full font-medium text-sm transition-all ${
                  activeTab === value
                    ? 'bg-[#143694] text-white shadow-sm'
                    : 'text-gray-500 hover:text-[#143694]'
                }`}
              >
                {label}
              </button>
            ))}

            {/* Link back to active jobs */}
            <button
              onClick={() => navigate('/job-management/On-campus')}
              className="ml-auto flex items-center gap-1.5 px-4 py-2 text-[#143694] border border-[#143694]/30 rounded-full text-sm font-medium hover:bg-[#143694]/5 transition-all"
            >
              <RotateCcw size={14} />
              Active Jobs
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 pt-8">

        {/* Header Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 px-6 py-5 mb-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center">
              <div className="p-2 bg-[#143694]/10 rounded-lg mr-3">
                <Archive className="h-5 w-5 text-[#143694]" />
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-semibold text-[#143694] tracking-tight">
                  Inactive / Expired {JOB_TYPES.find(t => t.value === activeTab)?.label} Jobs
                </h1>
                <p className="text-gray-600 text-sm mt-0.5">
                  Jobs that have been deactivated or expired.
                </p>
              </div>
            </div>

            {/* Search */}
            <div className="relative w-full md:w-72">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                className="w-full pl-10 pr-4 py-2.5 bg-gradient-to-r from-gray-50 to-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#143694]/50 focus:border-transparent focus:outline-none transition-all duration-200 text-sm"
                placeholder="Search by role or location"
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              />
            </div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-gradient-to-r from-red-50 to-white border border-red-200 rounded-xl p-4 mb-6">
            <div className="flex items-start">
              <AlertCircle className="h-5 w-5 text-red-600 mr-3 mt-0.5" />
              <div>
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <p className="text-sm text-red-700 mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Table */}
        <div className="bg-white/90 backdrop-blur-sm border border-gray-100 rounded-2xl shadow-lg overflow-hidden">

          {/* Table Header */}
          <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
            <div className="grid grid-cols-12 gap-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
              <div className="col-span-3">Role / Offering</div>
              <div className="col-span-2">Locations</div>
              <div className="col-span-2">End Date</div>
              <div className="col-span-2 text-center">Views</div>
              <div className="col-span-2 text-center">Applications</div>
              <div className="col-span-1 text-center">Status</div>
            </div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-gray-100">
            {loading ? (
              <div className="p-12 text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#143694]"></div>
                <p className="mt-4 text-gray-600">Loading inactive jobs...</p>
              </div>
            ) : currentJobs.length === 0 ? (
              <div className="p-12 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-gray-100 to-gray-200 mb-4">
                  <Archive className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No inactive jobs</h3>
                <p className="text-gray-600 text-sm">
                  No inactive {JOB_TYPES.find(t => t.value === activeTab)?.label} jobs found.
                </p>
              </div>
            ) : (
              currentJobs.map(job => (
                <div
                  key={job._id}
                  className="p-4 hover:bg-gray-50/50 transition-all duration-200 opacity-75 hover:opacity-100"
                >
                  <div className="grid grid-cols-12 gap-4 items-center">

                    {/* Role */}
                    <div className="col-span-3">
                      <div
                        onClick={() => navigate(`/company-dashboard/preview/${activeTab}/${job._id}?isApplied=true`)}
                        className="group cursor-pointer"
                      >
                        <h3 className="font-semibold text-gray-900 group-hover:text-[#143694] transition-colors">
                          {Array.isArray(job.jobRoles)
                            ? job.jobRoles.join(', ')
                            : job.jobRoles || 'N/A'}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <FileText className="h-3 w-3 text-gray-400" />
                          <span className="text-sm text-gray-500">
                            {Array.isArray(job.employmentType)
                              ? job.employmentType.join(', ')
                              : job.employmentType || 'N/A Type'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Locations */}
                    <div className="col-span-2">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-3 w-3 text-gray-400 flex-shrink-0" />
                        <span className="text-gray-700 text-sm capitalize truncate">
                          {displayLocations(job.location, job.workLocation)}
                        </span>
                      </div>
                    </div>

                    {/* End Date */}
                    <div className="col-span-2">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-3 w-3 text-red-300" />
                        <span className="text-red-400 text-sm font-medium">
                          {formatDate(job.endDate)}
                        </span>
                      </div>
                    </div>

                    {/* Views */}
                    <div className="col-span-2 text-center">
                      <span className="inline-flex items-center justify-center w-8 h-8 bg-gradient-to-r from-blue-100 to-blue-50 text-[#143694] rounded-full text-sm font-medium">
                        {job?.views || 0}
                      </span>
                    </div>

                    {/* Applications */}
                    <div className="col-span-2 text-center">
                      <span className="inline-flex items-center justify-center w-8 h-8 bg-gradient-to-r from-green-100 to-green-50 text-green-700 rounded-full text-sm font-medium">
                        {job?.applicationCount || 0}
                      </span>
                    </div>

                    {/* Status Badge */}
                    <div className="col-span-1 text-center">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-red-50 text-red-500 border border-red-100">
                        Inactive
                      </span>
                    </div>

                  </div>
                </div>
              ))
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between p-4 border-t border-gray-100 bg-gradient-to-r from-gray-50 to-white">
              <button
                onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-gray-100 to-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                <ChevronLeft size={16} />
                Prev
              </button>

              <div className="flex gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-10 h-10 flex items-center justify-center rounded-xl text-sm font-medium transition-all duration-200 ${
                      currentPage === page
                        ? 'bg-gradient-to-r from-[#143694] to-[#1e4ed8] text-white shadow-lg shadow-[#143694]/30'
                        : 'bg-gradient-to-r from-gray-100 to-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages || totalPages === 0}
                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-gray-100 to-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                Next
                <ChevronRight size={16} />
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}