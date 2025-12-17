import { useState } from 'react';
import { Link } from 'react-router-dom';

const JobList = ({ jobs }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date');

  // 🔹 FIXED: paths updated for new backend response
  const filteredJobs = jobs?.filter(job =>
    job?.job?.jobRoles?.[0]?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job?.job?.companyPosted?.companyDetails?.companyName
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase())
  ) || [];

  const sortedJobs = [...filteredJobs].sort((a, b) => {
    if (sortBy === 'date') {
      return new Date(b?.createdAt) - new Date(a?.createdAt);
    }
    if (sortBy === 'company') {
      return (
        a?.job?.companyPosted?.companyDetails?.companyName || ''
      ).localeCompare(
        b?.job?.companyPosted?.companyDetails?.companyName || ''
      );
    }
    return 0;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#667eea]/10 via-[#f093fb]/5 to-[#764ba2]/10">
      <div className="container mx-auto px-4 py-8 pt-22">

        {/* Header */}
        <div className="bg-white/90 backdrop-blur-sm border border-gray-100 rounded-2xl shadow-lg p-6 mb-6">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent">
            Saved Opportunities
          </h1>
          <p className="text-gray-600 mt-2">Browse your saved opportunities</p>

          {/* Search */}
          <div className="relative mt-4">
            <input
              type="text"
              placeholder="Search by role or company..."
              className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#667eea]/50"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {sortedJobs.length > 0 ? (
            sortedJobs.map(job => (
              <Link
                key={job?.job?._id}
                to={`/${localStorage.getItem("selectedRole")}-dashboard/${job?.jobType}/${job?.job?._id}?isSaved=true`}
                className="group block"
              >
                <div className="bg-white/90 backdrop-blur-sm border border-gray-100 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden">

                  {/* Header */}
                  <div className="p-6 border-b border-gray-100">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center mb-2">
                          <div className="p-2 bg-gradient-to-br from-[#667eea]/20 to-[#764ba2]/20 rounded-lg mr-3">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#667eea" className="w-5 h-5">
                              <path fillRule="evenodd" d="M7.5 5.25a3 3 0 013-3h3a3 3 0 013 3v.205c.933.085 1.857.197 2.774.334 1.454.218 2.476 1.483 2.476 2.917v3.033c0 1.211-.734 2.352-1.936 2.752A24.726 24.726 0 0112 15.75c-2.73 0-5.357-.442-7.814-1.259-1.202-.4-1.936-1.541-1.936-2.752V8.706c0-1.434 1.022-2.7 2.476-2.917A48.814 48.814 0 017.5 5.455V5.25z" />
                            </svg>
                          </div>

                          <div>
                            <h3 className="text-lg font-bold text-gray-900 group-hover:text-[#667eea] transition-colors">
                              {job?.job?.companyPosted?.companyDetails?.companyName || "Company"}
                            </h3>

                            <div className="flex items-center text-sm text-gray-600">
                              <span className="mr-3">
                                {job?.job?.companyPosted?.companyDetails?.companyName || "Company"}
                              </span>
                              <span className="px-2 py-1 bg-gradient-to-r from-[#667eea]/10 to-[#764ba2]/10 text-[#667eea] rounded-full text-xs font-medium">
                                {job?.jobType}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Roles */}
                        <div className="flex flex-wrap gap-2 mt-3">
                          {job?.job?.jobRoles?.slice(0, 3).map((role, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-gradient-to-r from-gray-100 to-white text-gray-700 rounded-full text-xs font-medium"
                            >
                              {role}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="p-2 bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 rounded-lg">
                        ⭐
                      </div>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-6">
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <div className="text-gray-600 mb-1">Location</div>
                        <div className="font-medium">
                          {job?.job?.location?.[0] || "Not specified"}
                        </div>
                      </div>

                      <div>
                        <div className="text-gray-600 mb-1">Start Date</div>
                        <div className="font-medium">
                          {job?.job?.startDate
                            ? new Date(job.job.startDate).toLocaleDateString()
                            : "N/A"}
                        </div>
                      </div>

                      <div>
                        <div className="text-gray-600 mb-1">End Date</div>
                        <div className="font-medium">
                          {job?.job?.endDate
                            ? new Date(job.job.endDate).toLocaleDateString()
                            : "N/A"}
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-2 bg-white/90 rounded-2xl shadow-lg p-8 text-center">
              <h3 className="text-xl font-bold">No Saved Opportunities</h3>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobList;
