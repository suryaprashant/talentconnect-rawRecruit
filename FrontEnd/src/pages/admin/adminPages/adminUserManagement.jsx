import React, { useState, useEffect } from "react";
import { UserCheck, Building2, Briefcase, Users, Search, ChevronDown, Eye, Check, X, Trash2 } from "lucide-react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useAdmin } from "../../../context/AdminProvider";

const UserManagement = () => {
  const { adminUser } = useAdmin();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [statistics, setStatistics] = useState(null);
  const [pagination, setPagination] = useState(null);
  const [showStatusDropdown, setShowStatusDropdown] = useState(null);

  const ITEMS_PER_PAGE = 10;

  // Fetch users data
  const fetchUsers = async (page = 1) => {
    try {
      setLoading(true);
      const response = await axios.post(
        `${import.meta.env.VITE_Backend_URL}/api/admin/users/users-board`,
        {
          page,
          limit: ITEMS_PER_PAGE,
          search: searchTerm,
          userType: filterType,
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
        setUsers(response.data.data.users);
        setPagination(response.data.data.pagination);
        setStatistics(response.data.data.statistics);
        setCurrentPage(page);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch and refetch on filter change
  useEffect(() => {
    fetchUsers(1);
  }, [searchTerm, filterType, filterStatus]);

  // Get user type display
  const getUserTypeDisplay = (userType) => {
    const typeMap = {
      company: "Company",
      college: "College",
      candidate: "Candidate",
      student: "Student",
      fresher: "Fresher",
      professional: "Professional",
      employer: "Employer",
      admin: "Admin"
    };
    return typeMap[userType] || userType;
  };

  // Get user type icon
  const getUserTypeIcon = (userType) => {
    switch (userType) {
      case "company":
      case "employer":
        return <Briefcase className="w-4 h-4" />;
      case "college":
        return <Building2 className="w-4 h-4" />;
      default:
        return <UserCheck className="w-4 h-4" />;
    }
  };

  // Update user status
  const handleUpdateStatus = async (userId, newStatus) => {
    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_Backend_URL}/api/admin/users/${userId}/status`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
            "Content-Type": "application/json"
          },
          withCredentials: true
        }
      );

      if (response.data.success) {
        toast.success(`User status updated to ${newStatus}`);
        fetchUsers(currentPage);
        setShowStatusDropdown(null);
      }
    } catch (error) {
      console.error("Error updating user status:", error);
      toast.error("Failed to update user status");
    }
  };

  // Delete user
  const handleDeleteUser = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
      try {
        const response = await axios.delete(
          `${import.meta.env.VITE_Backend_URL}/api/admin/users/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("adminToken")}`
            },
            withCredentials: true
          }
        );

        if (response.data.success) {
          toast.success("User deleted successfully");
          fetchUsers(currentPage);
        }
      } catch (error) {
        console.error("Error deleting user:", error);
        toast.error("Failed to delete user");
      }
    }
  };

  // Get status badge color
  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-700";
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "blocked":
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
              User Management
            </h1>
            <p className="text-slate-600">
              Manage candidates, colleges, and companies on your platform
            </p>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Candidate Card */}
          <div className="rounded-xl border bg-card text-card-foreground shadow">
            <div className="flex flex-col space-y-1.5 p-6">
              <div className="font-semibold leading-none tracking-tight flex items-center space-x-2 capitalize">
                <UserCheck className="w-4 h-4" />
                <span>candidates ({statistics?.candidates?.total || 0})</span>
              </div>
            </div>
            <div className="p-6 pt-0 grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              {[
                { color: "blue", label: "Total", value: statistics?.candidates?.total || 0 },
                { color: "green", label: "Active", value: statistics?.candidates?.active || 0 },
                { color: "yellow", label: "Pending", value: statistics?.candidates?.pending || 0 },
                { color: "red", label: "Blocked", value: statistics?.candidates?.blocked || 0 },
              ].map((item) => (
                <div
                  key={item.label}
                  className={`text-center p-3 bg-${item.color}-50 rounded-lg`}
                >
                  <div className={`text-2xl font-bold text-${item.color}-700`}>
                    {item.value}
                  </div>
                  <div className={`text-sm text-${item.color}-600`}>
                    {item.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* College Card */}
          <div className="rounded-xl border bg-card text-card-foreground shadow">
            <div className="flex flex-col space-y-1.5 p-6">
              <div className="font-semibold leading-none tracking-tight flex items-center space-x-2 capitalize">
                <Building2 className="w-4 h-4" />
                <span>colleges ({statistics?.colleges?.total || 0})</span>
              </div>
            </div>
            <div className="p-6 pt-0 grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              {[
                { color: "blue", label: "Total", value: statistics?.colleges?.total || 0 },
                { color: "green", label: "Active", value: statistics?.colleges?.active || 0 },
                { color: "yellow", label: "Pending", value: statistics?.colleges?.pending || 0 },
                { color: "red", label: "Blocked", value: statistics?.colleges?.blocked || 0 },
              ].map((item) => (
                <div
                  key={item.label}
                  className={`text-center p-3 bg-${item.color}-50 rounded-lg`}
                >
                  <div className={`text-2xl font-bold text-${item.color}-700`}>
                    {item.value}
                  </div>
                  <div className={`text-sm text-${item.color}-600`}>
                    {item.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Company Card */}
          <div className="rounded-xl border bg-card text-card-foreground shadow">
            <div className="flex flex-col space-y-1.5 p-6">
              <div className="font-semibold leading-none tracking-tight flex items-center space-x-2 capitalize">
                <Briefcase className="w-4 h-4" />
                <span>companies ({statistics?.companies?.total || 0})</span>
              </div>
            </div>
            <div className="p-6 pt-0 grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              {[
                { color: "blue", label: "Total", value: statistics?.companies?.total || 0 },
                { color: "green", label: "Active", value: statistics?.companies?.active || 0 },
                { color: "yellow", label: "Pending", value: statistics?.companies?.pending || 0 },
                { color: "red", label: "Blocked", value: statistics?.companies?.blocked || 0 },
              ].map((item) => (
                <div
                  key={item.label}
                  className={`text-center p-3 bg-${item.color}-50 rounded-lg`}
                >
                  <div className={`text-2xl font-bold text-${item.color}-700`}>
                    {item.value}
                  </div>
                  <div className={`text-sm text-${item.color}-600`}>
                    {item.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* User Table */}
        <div className="rounded-xl border bg-card text-card-foreground shadow">
          <div className="flex flex-col space-y-1.5 p-6">
            <div className="font-semibold leading-none tracking-tight flex items-center space-x-2">
              <Users className="w-5 h-5" />
              <span>All Users</span>
            </div>
            <div className="text-sm text-muted-foreground">
              Search, filter, and manage all platform users
            </div>
          </div>

          {/* Search and Filters */}
          <div className="p-6 pt-0 flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 pl-10 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                placeholder="Search by name, email..."
              />
            </div>
            
            {/* User Type Filter */}
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="flex h-9 items-center justify-between w-full md:w-48 border rounded-md px-3 py-2 text-sm shadow-sm bg-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <option value="all">All Types</option>
              <option value="candidate">Candidates</option>
              <option value="college">Colleges</option>
              <option value="company">Companies</option>
            </select>

            {/* Status Filter */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="flex h-9 items-center justify-between w-full md:w-48 border rounded-md px-3 py-2 text-sm shadow-sm bg-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="blocked">Blocked</option>
            </select>
          </div>

          {/* Table */}
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full caption-bottom text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="p-2 text-left font-medium">User</th>
                  <th className="p-2 text-left font-medium">Type</th>
                  <th className="p-2 text-left font-medium">Status</th>
                  <th className="p-2 text-left font-medium">Registered</th>
                  <th className="p-2 text-left font-medium">Last Active</th>
                  <th className="p-2 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="6" className="p-8 text-center text-slate-500">
                      Loading users...
                    </td>
                  </tr>
                ) : users.length > 0 ? (
                  users.map((user) => (
                    <tr key={user._id} className="border-b hover:bg-slate-50">
                      <td className="p-2">
                        <div className="space-y-1">
                          <div className="font-medium">{user.name || "N/A"}</div>
                          <div className="text-sm text-slate-500">{user.email}</div>
                        </div>
                      </td>
                      <td className="p-2">
                        <div className="flex items-center space-x-2">
                          {getUserTypeIcon(user.userType)}
                          <span>{getUserTypeDisplay(user.userType)}</span>
                        </div>
                      </td>
                      <td className="p-2">
                        <div className={`inline-flex items-center rounded-md ${getStatusColor(user.status)} px-2 py-0.5 text-xs font-semibold`}>
                          {user.status}
                        </div>
                      </td>
                      <td className="p-2">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-2">
                        {new Date(user.updatedAt).toLocaleDateString()}
                      </td>
                      <td className="p-2 text-right">
                        <div className="flex items-center justify-end space-x-2 relative">
                          <button
                            onClick={() => setShowStatusDropdown(showStatusDropdown === user._id ? null : user._id)}
                            className="border rounded-md p-2 hover:bg-accent"
                            title="Change Status"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          
                          {/* Status Dropdown */}
                          {showStatusDropdown === user._id && (
                            <div className="absolute right-0 top-10 bg-white border rounded-md shadow-lg z-10">
                              {["active", "pending", "blocked"].map((status) => (
                                <button
                                  key={status}
                                  onClick={() => handleUpdateStatus(user._id, status)}
                                  className={`block w-full text-left px-4 py-2 text-sm hover:bg-slate-100 capitalize ${
                                    user.status === status ? "bg-slate-50 font-semibold" : ""
                                  }`}
                                >
                                  {status}
                                </button>
                              ))}
                            </div>
                          )}

                          <button
                            onClick={() => handleDeleteUser(user._id)}
                            className="border rounded-md p-2 text-red-600 hover:text-red-700 hover:bg-accent"
                            title="Delete User"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="p-8 text-center text-slate-500">
                      No users found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-between mt-6 px-6">
              <div className="text-sm text-slate-600">
                Page {pagination.currentPage} of {pagination.totalPages} • Total Users: {pagination.totalUsers}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => fetchUsers(pagination.currentPage - 1)}
                  disabled={pagination.currentPage === 1}
                  className="px-4 py-2 border rounded-md hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  onClick={() => fetchUsers(pagination.currentPage + 1)}
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

export default UserManagement;
