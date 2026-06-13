import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Search, Eye, ChevronLeft, ChevronRight,
    Calendar, MapPin, AlertCircle, Archive, RotateCcw
} from 'lucide-react';
import { getCollegePostedJobs } from '@/lib/College_AxiosIntance';

const JOB_TYPES = [
    { label: 'On-Campus', jobType: 'On-campus', key: 'campus-placement' },
    { label: 'Pool-Campus', jobType: 'Pool-campus', key: 'poolCampus-placement' },
];

function CollegeInactiveJobs() {
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState(JOB_TYPES[0]);
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    const itemsPerPage = 5;

    const fetchJobs = async (tab) => {
        try {
            setLoading(true);
            setError(null);
            setJobs([]);

            // pass active=false to get inactive jobs
            const response = await getCollegePostedJobs(tab.jobType, tab.key, false);

            if (response.data?.response && Array.isArray(response.data.response)) {
                setJobs(response.data.response);
            } else {
                setJobs([]);
            }
        } catch (err) {
            setError('Failed to fetch inactive jobs. Please try again.');
            console.error('Error fetching inactive jobs:', err);
            setJobs([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchJobs(activeTab);
        setCurrentPage(1);
        setSearchQuery('');
    }, [activeTab]);

    const filteredJobs = useMemo(() => {
        if (!jobs || !Array.isArray(jobs)) return [];
        const q = searchQuery.toLowerCase();
        return jobs.filter(job => {
            const degree = Array.isArray(job.degree) ? job.degree.join(', ') : '';
            const location = Array.isArray(job.location) ? job.location.join(', ') : job.location || '';
            return degree.toLowerCase().includes(q) || location.toLowerCase().includes(q);
        });
    }, [jobs, searchQuery]);

    const totalPages = Math.ceil(filteredJobs.length / itemsPerPage);
    const currentJobs = filteredJobs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        try {
            return new Date(dateString).toLocaleDateString('en-US', {
                year: 'numeric', month: 'short', day: 'numeric'
            });
        } catch {
            return 'Invalid Date';
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#f0e6f7]/60 via-[#d4e8f9]/55 to-[#cff7ea]/60">

            {/* Background blobs */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#fbcfe8]/20 rounded-full blur-3xl"></div>
                <div className="absolute top-1/3 -left-20 w-60 h-60 bg-[#143694]/20 rounded-full blur-3xl"></div>
                <div className="absolute bottom-20 right-1/3 w-40 h-40 bg-[#a7f3d0]/20 rounded-full blur-3xl"></div>
            </div>

            {/* Top Nav */}
            <div className="relative z-10 max-w-7xl mx-auto px-6 pt-8">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 px-6 py-5 mb-2">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-[#143694]/10 rounded-lg">
                            <Archive className="h-5 w-5 text-[#143694]" />
                        </div>
                        <h2 className="text-2xl md:text-[26px] font-semibold text-[#143694] tracking-tight">
                            Inactive Jobs
                        </h2>
                        <span className="flex items-center justify-center w-7 h-7 bg-[#143694] text-white text-xs font-bold rounded-full">
                            {jobs.length}
                        </span>
                    </div>

                    {/* Tab Nav */}
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pb-2">
                        {JOB_TYPES.map((tab) => (
                            <button
                                key={tab.jobType}
                                onClick={() => setActiveTab(tab)}
                                className={`px-6 py-2 rounded-full font-medium text-sm transition-all ${
                                    activeTab.jobType === tab.jobType
                                        ? 'bg-[#143694] text-white shadow-sm'
                                        : 'text-gray-500 hover:text-[#143694]'
                                }`}
                            >
                                {tab.label}
                            </button>
                        ))}

                        {/* Back to active */}
                        <button
                            onClick={() => navigate('/manage-application/campus-placement')}
                            className="ml-auto flex items-center gap-1.5 px-4 py-2 text-[#143694] border border-[#143694]/30 rounded-full text-sm font-medium hover:bg-[#143694]/5 transition-all"
                        >
                            <RotateCcw size={14} />
                            Active Jobs
                        </button>
                    </div>
                </div>
            </div>

            <div className="relative z-10 max-w-7xl mx-auto p-6">

                {/* Header Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 px-6 py-6 mb-8">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                      

                        {/* Search */}
                        <div className="relative w-full md:w-72">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search className="h-4 w-4 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                className="w-full pl-10 pr-4 py-2.5 bg-gradient-to-r from-gray-50 to-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#143694]/50 focus:border-transparent focus:outline-none transition-all duration-200 text-sm"
                                placeholder="Search by degree or location"
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
{console.log(jobs)}
                    {/* Table Header */}
                    <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                        <div className="grid grid-cols-12 gap-4 text-xs font-medium text-gray-700 uppercase tracking-wider">
                            <div className="col-span-4">Degree / Location</div>
                            <div className="col-span-3">End Date</div>
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
                        ) : error ? (
                            <div className="p-12 text-center">
                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-50 mb-4">
                                    <AlertCircle className="h-8 w-8 text-red-400" />
                                </div>
                                <h3 className="text-lg font-medium text-gray-900 mb-2">Error loading jobs</h3>
                                <p className="text-red-500">{error}</p>
                            </div>
                        ) : currentJobs.length === 0 ? (
                            <div className="p-12 text-center">
                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-gray-100 to-gray-200 mb-4">
                                    <Archive className="h-8 w-8 text-gray-400" />
                                </div>
                                <h3 className="text-lg font-medium text-gray-900 mb-2">No inactive jobs</h3>
                                <p className="text-gray-600">
                                    No inactive {activeTab.label} jobs found.
                                </p>
                            </div>
                        ) : (
                            currentJobs.map(job => {
                                const jobId = job._id || job.id;
                                const jobDegree = Array.isArray(job.degree) ? job.degree.join(', ') : 'N/A';
                                const jobAddress = job.collegeAddress;
                                const addressString = jobAddress?.city
                                    ? `${jobAddress.city}, ${jobAddress.state}`
                                    : (Array.isArray(job.location) ? job.location.join(', ') : job.location || 'N/A');

                                return (
                                    <div key={jobId} className="p-4 hover:bg-gray-50/50 transition-all duration-200">
                                        <div className="grid grid-cols-12 gap-4 items-center">

                                            {/* Degree / Location */}
                                            <div className="col-span-4">
                                                <h3 className="font-semibold text-gray-900">
                                                    {jobDegree}
                                                </h3>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <MapPin className="h-3 w-3 text-gray-400" />
                                                    <span className="text-sm text-gray-500 capitalize">{addressString}</span>
                                                </div>
                                            </div>

                                            {/* End Date */}
                                            <div className="col-span-3">
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="h-3 w-3 text-red-400" />
                                                    <span className="text-red-400 text-sm font-medium">
                                                        {formatDate(job.endDate)}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Views */}
                                            <div className="col-span-2 text-center">
                                                <span className="inline-flex items-center justify-center w-8 h-8 bg-gradient-to-r from-blue-100 to-blue-50 text-[#143694] rounded-full text-sm font-medium">
                                                    {job?.views ?? 0}
                                                </span>
                                            </div>

                                            {/* Applications */}
                                            <div className="col-span-2 text-center">
                                                <span className="inline-flex items-center justify-center w-8 h-8 bg-gradient-to-r from-green-100 to-green-50 text-green-700 rounded-full text-sm font-medium">
                                                    {job?.applicationCount || 0}
                                                </span>
                                            </div>

                                            {/* Status */}
                                            <div className="col-span-1 text-center">
                                                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-red-50 text-red-500 border border-red-100">
                                                    Inactive
                                                </span>
                                            </div>

                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>

                    {/* Pagination */}
                    {!loading && totalPages > 1 && (
                        <div className="flex flex-col sm:flex-row items-center justify-between p-6 border-t border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                            <button
                                onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                                disabled={currentPage === 1}
                                className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 rounded-xl disabled:opacity-50 hover:bg-gray-50 transition-all duration-200 text-gray-700 font-medium mb-4 sm:mb-0"
                            >
                                <ChevronLeft size={16} />
                                Prev
                            </button>

                            <div className="flex gap-2 mb-4 sm:mb-0">
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                    <button
                                        key={page}
                                        onClick={() => setCurrentPage(page)}
                                        className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-200 font-medium ${
                                            currentPage === page
                                                ? 'bg-gradient-to-r from-[#143694] to-[#1e4ed8] text-white shadow-md shadow-[#143694]/30'
                                                : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                                        }`}
                                    >
                                        {page}
                                    </button>
                                ))}
                            </div>

                            <button
                                onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 rounded-xl disabled:opacity-50 hover:bg-gray-50 transition-all duration-200 text-gray-700 font-medium"
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

export default CollegeInactiveJobs;