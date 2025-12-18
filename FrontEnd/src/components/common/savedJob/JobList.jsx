import { useState } from "react";
import { Link } from "react-router-dom";

const JobList = ({ jobs }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("date");

  const selectedRole = localStorage.getItem("selectedRole");
  const isCompany = selectedRole === "company";

  const filteredJobs =
    jobs?.filter((job) => {
      const name = isCompany
        ? job?.job?.collegePosted?.collegeUniversityDetails?.collegeName
        : job?.job?.companyPosted?.companyDetails?.companyName;

      const role = job?.job?.jobRoles?.[0];

      return (
        name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        role?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }) || [];

  const sortedJobs = [...filteredJobs].sort((a, b) => {
    if (sortBy === "date") {
      return new Date(b?.createdAt) - new Date(a?.createdAt);
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

          <div className="relative mt-4">
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#667eea]/50"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {sortedJobs.length > 0 ? (
            sortedJobs.map((job) => {
              const titleName = isCompany
                ? job?.job?.collegePosted?.collegeUniversityDetails?.collegeName
                : job?.job?.companyPosted?.companyDetails?.companyName;

              const locationText = isCompany
                ? job?.job?.venue
                : job?.job?.location?.[0];

              const roles = isCompany ? [] : job?.job?.jobRoles || [];

              return (
                <Link
                  key={job?.job?._id}
                  to={`/${selectedRole}-dashboard/${job?.jobType}/${job?.job?._id}?isSaved=true`}
                  className="group block"
                >
                  <div className="bg-white/90 backdrop-blur-sm border border-gray-100 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden">

                    {/* Header */}
                    <div className="p-6 border-b border-gray-100">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center mb-2">
                            <div className="p-2 bg-gradient-to-br from-[#667eea]/20 to-[#764ba2]/20 rounded-lg mr-3">
                              {/* ICON KEPT */}
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#667eea" className="w-5 h-5">
                                <path d="M7.5 5.25h9v3h-9z" />
                              </svg>
                            </div>

                            <div>
                              <h3 className="text-lg font-bold text-gray-900 group-hover:text-[#667eea] transition-colors">
                                {titleName || "Name"}
                              </h3>

                              <div className="flex items-center text-sm text-gray-600">
                                <span className="mr-3">{titleName}</span>
                                <span className="px-2 py-1 bg-gradient-to-r from-[#667eea]/10 to-[#764ba2]/10 text-[#667eea] rounded-full text-xs font-medium">
                                  {job?.jobType}
                                </span>
                              </div>
                            </div>
                          </div>

                          {!isCompany && (
                            <div className="flex flex-wrap gap-2 mt-3">
                              {roles.slice(0, 3).map((role, index) => (
                                <span
                                  key={index}
                                  className="px-3 py-1 bg-gradient-to-r from-gray-100 to-white text-gray-700 rounded-full text-xs font-medium"
                                >
                                  {role}
                                </span>
                              ))}
                            </div>
                          )}
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
                            {locationText || "Not specified"}
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
              );
            })
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
