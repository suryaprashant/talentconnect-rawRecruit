import React, { useState, useEffect } from "react";
import { FileText, Search } from "lucide-react";
import axios from "axios";
import { toast } from "react-hot-toast";

const ApplicationManagement = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [statistics, setStatistics] = useState(null);
  const [pagination, setPagination] = useState(null);

  const ITEMS_PER_PAGE = 10;

  // Fetch applications data
  const fetchApplications = async (page = 1) => {
    try {
      setLoading(true);
      const response = await axios.post(
        `${import.meta.env.VITE_Backend_URL}/api/admin/application/applications-board`,
        {
          page,
          limit: ITEMS_PER_PAGE,
          search: searchTerm,
          status: filterStatus
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
        setApplications(response.data.data.applications);
        setPagination(response.data.data.pagination);
        setStatistics(response.data.data.statistics);
        setCurrentPage(page);
      }
    } catch (error) {
      console.error("Error fetching applications:", error);
      toast.error("Failed to fetch applications");
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch and refetch on filter change
  useEffect(() => {
    fetchApplications(1);
  }, [searchTerm, filterStatus]);

  const getStatusColor = (status) => {
    switch (status) {
      case "Applied":
      case "Application Sent":
        return "bg-blue-100 text-blue-700";
      case "Shortlisted":
      case "Interview Scheduled":
        return "bg-purple-100 text-purple-700";
      case "Offer Extended":
      case "Accepted":
        return "bg-green-100 text-green-700";
      case "Rejected":
        return "bg-red-100 text-red-700";
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
              Application Management
            </h1>
            <p className="text-slate-600">
              Track and manage all job applications from candidates
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <div className="inline-flex items-center rounded-md border font-semibold transition-colors border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80 text-lg px-3 py-1">
              {statistics?.total || 0} applications
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {[
            { count: statistics?.total || 0, label: "Total", color: "text-blue-700" },
            { count: statistics?.applied || 0, label: "Applied", color: "text-slate-700" },
            { count: statistics?.shortlisted || 0, label: "Shortlisted", color: "text-purple-700" },
            { count: statistics?.accepted || 0, label: "Accepted", color: "text-green-700" },
            { count: statistics?.rejected || 0, label: "Rejected", color: "text-red-700" },
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

        {/* Applications Table */}
        <div className="rounded-xl border bg-card text-card-foreground shadow">
          <div className="flex flex-col space-y-1.5 p-6">
            <div className="font-semibold leading-none tracking-tight flex items-center space-x-2">
              <FileText className="w-5 h-5" />
              <span>All Applications</span>
            </div>
            <div className="text-sm text-muted-foreground">
              View and manage job applications
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
                placeholder="Search by candidate name, email, job title..."
              />
            </div>
            
            {/* Status Filter */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="flex h-9 items-center justify-between w-full md:w-48 border rounded-md px-3 py-2 text-sm shadow-sm bg-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <option value="all">All Status</option>
              <option value="Applied">Applied</option>
              <option value="Shortlisted">Shortlisted</option>
              <option value="Interview Scheduled">Interview Scheduled</option>
              <option value="Offer Extended">Offer Extended</option>
              <option value="Accepted">Accepted</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

          {/* Table */}
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full caption-bottom text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="p-2 text-left font-medium">Candidate</th>
                  <th className="p-2 text-left font-medium">Job Title</th>
                  <th className="p-2 text-left font-medium">Company</th>
                  <th className="p-2 text-left font-medium">Status</th>
                  <th className="p-2 text-left font-medium">Applied Date</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="5" className="p-8 text-center text-slate-500">
                      Loading applications...
                    </td>
                  </tr>
                ) : applications.length > 0 ? (
                  applications.map((app) => (
                    <tr key={app._id} className="border-b hover:bg-slate-50">
                      <td className="p-2">
                        <div className="font-medium">{app.candidateName || "N/A"}</div>
                        <div className="text-xs text-slate-500">{app.candidateEmail || ""}</div>
                      </td>
                      <td className="p-2">{app.jobTitle || "N/A"}</td>
                      <td className="p-2">{app.companyName || "N/A"}</td>
                      <td className="p-2">
                        <div className={`inline-flex items-center rounded-md ${getStatusColor(app.currentStatus)} px-2 py-0.5 text-xs font-semibold`}>
                          {app.currentStatus || "Pending"}
                        </div>
                      </td>
                      <td className="p-2">
                        {app.createdAt ? new Date(app.createdAt).toLocaleDateString() : "N/A"}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="p-8 text-center text-slate-500">
                      No applications found
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
                Page {pagination.currentPage} of {pagination.totalPages} • Total Applications: {pagination.totalApplications}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => fetchApplications(pagination.currentPage - 1)}
                  disabled={pagination.currentPage === 1}
                  className="px-4 py-2 border rounded-md hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  onClick={() => fetchApplications(pagination.currentPage + 1)}
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

export default ApplicationManagement;
