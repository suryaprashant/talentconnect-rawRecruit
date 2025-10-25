import React, { useState, useEffect } from "react";
import { Briefcase, Search, ChevronDown } from "lucide-react";
import axios from "axios";
import { toast } from "react-hot-toast";

const JobDriveManagement = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [statistics, setStatistics] = useState(null);
  const [pagination, setPagination] = useState(null);

  const ITEMS_PER_PAGE = 10;

  // Fetch jobs data
  const fetchJobs = async (page = 1) => {
    try {
      setLoading(true);
      const response = await axios.post(
        `${import.meta.env.VITE_Backend_URL}/api/admin/job-n-drive/jobs-board`,
        {
          page,
          limit: ITEMS_PER_PAGE,
          search: searchTerm,
          jobType: filterType
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
            "Content-Type": "application/json"
          },
          withCredentials: true
        }
      );

      if (response.data.success) {
        setJobs(response.data.data.jobs);
        setPagination(response.data.data.pagination);
        setStatistics(response.data.data.statistics);
        setCurrentPage(page);
      }
    } catch (error) {
      console.error("Error fetching jobs:", error);
      toast.error("Failed to fetch jobs");
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch and refetch on filter change
  useEffect(() => {
    fetchJobs(1);
  }, [searchTerm, filterType]);

  const getStatusColor = (status) => {
    switch (status) {
      case "Open":
        return "bg-green-100 text-green-700";
      case "Closed":
        return "bg-red-100 text-red-700";
      case "Pending":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <main className="min-h-screen">
      <div className="p-6 space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="responsive-title font-bold text-slate-900 mb-2">
              Job & Drive Management
            </h1>
            <p className="text-slate-600">
              Manage all job postings, internships, and campus drives
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <div className="inline-flex items-center rounded-md border font-semibold transition-colors border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80 text-lg px-3 py-1">
              {statistics?.total || 0} positions
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {[
            { count: statistics?.total || 0, label: "Total Jobs", color: "text-blue-700" },
            { count: statistics?.fullTime || 0, label: "Full-time", color: "text-green-700" },
            { count: statistics?.internship || 0, label: "Internships", color: "text-purple-700" },
            { count: statistics?.oncampus || 0, label: "On-campus", color: "text-orange-700" },
            { count: statistics?.offcampus || 0, label: "Off-campus", color: "text-teal-700" },
          ].map((item, i) => (
            <div
              key={i}
              className="rounded-xl border bg-card text-card-foreground shadow text-center"
            >
              <div className="p-6 pt-6">
                <div className={`text-2xl font-bold ${item.color}`}>
                  {item.count}
                </div>
                <div className="text-sm text-slate-600">{item.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Jobs Table */}
        <div className="rounded-xl border bg-card text-card-foreground shadow">
          <div className="flex flex-col space-y-1.5 p-6">
            <div className="font-semibold leading-none tracking-tight flex items-center space-x-2">
              <Briefcase className="w-5 h-5" />
              <span>All Positions</span>
            </div>
            <div className="text-sm text-muted-foreground">
              Browse and manage all job postings and opportunities
            </div>
          </div>

          {/* Search and Filter */}
          <div className="p-6 pt-0 flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 pl-10 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                placeholder="Search by title, company, or location..."
              />
            </div>
            
            {/* Job Type Filter */}
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="flex h-9 items-center justify-between w-full md:w-48 border rounded-md px-3 py-2 text-sm shadow-sm bg-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <option value="all">All Types</option>
              <option value="Full-time">Full-time</option>
              <option value="Internship">Internship</option>
              <option value="On-campus">On-campus</option>
              <option value="Off-campus">Off-campus</option>
            </select>
          </div>

          {/* Table */}
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full caption-bottom text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="p-2 text-left font-medium">Job Title</th>
                  <th className="p-2 text-left font-medium">Company</th>
                  <th className="p-2 text-left font-medium">Type</th>
                  <th className="p-2 text-left font-medium">Location</th>
                  <th className="p-2 text-left font-medium">Posted</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="5" className="p-8 text-center text-slate-500">
                      Loading jobs...
                    </td>
                  </tr>
                ) : jobs.length > 0 ? (
                  jobs.map((job) => (
                    <tr key={job._id} className="border-b hover:bg-slate-50">
                      <td className="p-2">
                        <div className="font-medium">{job.jobTitle || "N/A"}</div>
                      </td>
                      <td className="p-2">{job.companyName || "N/A"}</td>
                      <td className="p-2">
                        <div className="inline-flex items-center rounded-md bg-blue-100 text-blue-700 px-2 py-0.5 text-xs font-semibold">
                          {job.jobType || "N/A"}
                        </div>
                      </td>
                      <td className="p-2">{job.location || "N/A"}</td>
                      <td className="p-2">
                        {job.createdAt ? new Date(job.createdAt).toLocaleDateString() : "N/A"}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="p-8 text-center text-slate-500">
                      No jobs found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-between mt-6 px-6 pb-6">
              <div className="text-sm text-slate-600">
                Page {pagination.currentPage} of {pagination.totalPages} • Total Jobs: {pagination.totalJobs}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => fetchJobs(pagination.currentPage - 1)}
                  disabled={pagination.currentPage === 1}
                  className="px-4 py-2 border rounded-md hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  onClick={() => fetchJobs(pagination.currentPage + 1)}
                  disabled={pagination.currentPage === pagination.totalPages}
                  className="px-4 py-2 border rounded-md hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default JobDriveManagement;
