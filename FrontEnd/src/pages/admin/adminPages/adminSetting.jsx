import React, { useState, useEffect } from "react";
import { AlertCircle, Search, Check, X, Send, Eye, Link as LinkIcon, Calendar, Clock, User, Mail, Phone, Building, MessageSquare, Video } from "lucide-react";
import axios from "../../../lib/axiosInstance";
import { toast } from "react-hot-toast";

const ServiceRequestManagement = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [statistics, setStatistics] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    completed: 0,
    rejected: 0
  });
  const [pagination, setPagination] = useState(null);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [approvalData, setApprovalData] = useState({
    message: "",
    meetingLink: ""
  });
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewRequest, setViewRequest] = useState(null);

  const ITEMS_PER_PAGE = 10;

  // Map status from API to display format
  const mapStatusToDisplay = (status) => {
    const statusMap = {
      'pending': 'pending',
      'resolved': 'completed',
      'rejected': 'rejected'
    };
    return statusMap[status] || status;
  };

  // Map display status back to API status
  const mapDisplayStatusToApi = (status) => {
    const statusMap = {
      'all': 'all',
      'pending': 'pending',
      'approved': 'pending',
      'completed': 'resolved',
      'rejected': 'rejected'
    };
    return statusMap[status] || status;
  };

  // Fetch service requests data using ReqInfo APIs
  const fetchRequests = async (page = 1) => {
    try {
      setLoading(true);
      
      let url = `${import.meta.env.VITE_Backend_URL}/api/rawrecruit/all?page=${page}&limit=${ITEMS_PER_PAGE}`;
      
      if (filterStatus !== 'all') {
        const apiStatus = mapDisplayStatusToApi(filterStatus);
        if (apiStatus !== 'all') {
          url += `&status=${apiStatus}`;
        }
      }

      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          "Content-Type": "application/json"
        },
        withCredentials: true
      });

      if (response.data) {
        const transformedRequests = response.data.data.map(req => ({
          _id: req._id,
          requesterName: req.name || 'N/A',
          requesterEmail: req.email || '',
          phoneNumber: req.phone || '',
          serviceRequestType: req.serviceType || 'other',
          status: mapStatusToDisplay(req.status),
          organizationName: req.organization || 'N/A',
          createdAt: req.createdAt || req.date,
          requestedDate: req.date || 'Not specified',
          requestedTime: req.time || 'Not specified',
          message: req.message || 'No message provided',
          adminMessage: req.adminMessage || '',
          meetingLink: req.meetingLink || '',
          resolvedAt: req.resolvedAt || null,
          rejectedAt: req.rejectedAt || null,
          ...req
        }));

        setRequests(transformedRequests);
        setPagination({
          currentPage: response.data.pagination.page,
          totalPages: response.data.pagination.pages,
          totalServiceRequests: response.data.pagination.total
        });
        setCurrentPage(page);
      }
    } catch (error) {
      console.error("Error fetching service requests:", error);
      toast.error("Failed to fetch service requests");
    } finally {
      setLoading(false);
    }
  };

  // Fetch statistics using ReqInfo API
  const fetchStatistics = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_Backend_URL}/api/rawrecruit/stats`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
            "Content-Type": "application/json"
          },
          withCredentials: true
        }
      );

      console.log("data",response.data);

      if (response.data) {
        setStatistics({
          total: response.data.data.total || 0,
          pending: response.data.data.pending || 0,
          
          completed: response.data.data.resolved || 0,
          
          rejected: response.data.data.rejected || 0
        });
      }
    } catch (error) {
      console.error("Error fetching statistics:", error);
    }
  };

  // Initial fetch and refetch on filter change
  useEffect(() => {
    fetchRequests(1);
    fetchStatistics();
  }, [filterStatus]);

  // Handle search with debounce
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      fetchRequests(1);
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm]);

  // Handle opening approval modal
  const handleOpenApprovalModal = (request) => {
    setSelectedRequest(request);
    setApprovalData({
      message: `Your service request for "${request.serviceRequestType}" has been approved!`,
      meetingLink: ""
    });
    setShowApprovalModal(true);
  };

  // Handle opening view modal (read-only)
  const handleOpenViewModal = (request) => {
    setViewRequest(request);
    setShowViewModal(true);
  };

  // Handle approve with message - using resolve API with notification
  const handleApproveWithMessage = async () => {
    if (!selectedRequest) return;

    try {
      const response = await axios.put(
        `${import.meta.env.VITE_Backend_URL}/api/rawrecruit/${selectedRequest._id}/resolve`,
        {
          adminMessage: approvalData.message,
          meetingLink: approvalData.meetingLink || ''
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
            "Content-Type": "application/json"
          },
          withCredentials: true
        }
      );

      if (response.data) {
        toast.success(`Request approved successfully!`);
        if (approvalData.meetingLink) {
          toast.success(`Meeting Link: ${approvalData.meetingLink}`);
        }
        
        setShowApprovalModal(false);
        setSelectedRequest(null);
        setApprovalData({ message: "", meetingLink: "" });
        fetchRequests(currentPage);
        fetchStatistics();
      }
    } catch (error) {
      console.error("Error approving service request:", error);
      toast.error("Failed to approve service request");
    }
  };

  // Handle reject action with message prompt
  const handleReject = async (requestId) => {
    const rejectMessage = prompt("Enter rejection message:", "Your service request has been rejected.");
    
    if (rejectMessage === null) return;

    try {
      const response = await axios.put(
        `${import.meta.env.VITE_Backend_URL}/api/rawrecruit/${requestId}/reject`,
        {
          adminMessage: rejectMessage || "Your service request has been rejected."
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
            "Content-Type": "application/json"
          },
          withCredentials: true
        }
      );

      if (response.data) {
        toast.success("Service request rejected successfully");
        fetchRequests(currentPage);
        fetchStatistics();
      }
    } catch (error) {
      console.error("Error rejecting service request:", error);
      toast.error("Failed to reject service request");
    }
  };

  // Handle delete request
  const handleDelete = async (requestId) => {
    if (!window.confirm('Are you sure you want to delete this request?')) return;

    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_Backend_URL}/api/rawrecruit/${requestId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
            "Content-Type": "application/json"
          },
          withCredentials: true
        }
      );

      if (response.data) {
        toast.success("Service request deleted successfully");
        fetchRequests(currentPage);
        fetchStatistics();
      }
    } catch (error) {
      console.error("Error deleting service request:", error);
      toast.error("Failed to delete service request");
    }
  };

  const handleCloseViewModal = () => {
    setShowViewModal(false);
    setViewRequest(null);
  };

  const getStatusColor = (status) => {
    const statusLower = (status || '').toLowerCase();
    switch (statusLower) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "approved":
      case "in progress":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "completed":
        return "bg-green-100 text-green-800 border-green-200";
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusBadgeIcon = (status) => {
    const statusLower = (status || '').toLowerCase();
    switch (statusLower) {
      case "pending":
        return <Clock className="w-3 h-3" />;
      case "approved":
      case "in progress":
        return <Check className="w-3 h-3" />;
      case "completed":
        return <Check className="w-3 h-3" />;
      case "rejected":
        return <X className="w-3 h-3" />;
      default:
        return null;
    }
  };

  const getTypeColor = (type) => {
    const colors = {
      'on-campus': "bg-purple-100 text-purple-800 border-purple-200",
      'off-campus': "bg-indigo-100 text-indigo-800 border-indigo-200",
      counselling: "bg-cyan-100 text-cyan-800 border-cyan-200",
      'onboarding-support': "bg-teal-100 text-teal-800 border-teal-200",
      seminar: "bg-lime-100 text-lime-800 border-lime-200",
      training: "bg-orange-100 text-orange-800 border-orange-200",
      workshop: "bg-pink-100 text-pink-800 border-pink-200",
      internship: "bg-blue-100 text-blue-800 border-blue-200",
      placement: "bg-green-100 text-green-800 border-green-200",
      other: "bg-gray-100 text-gray-800 border-gray-200"
    };
    return colors[type] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    try {
      return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return 'N/A';
    }
  };

  const formatDateTime = (date) => {
    if (!date) return 'N/A';
    try {
      return new Date(date).toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'N/A';
    }
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="p-6 space-y-6 animate-fade-in max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1 flex items-center gap-2">
              <AlertCircle className="w-6 h-6 text-blue-600" />
              Service Request Management
            </h1>
            <p className="text-gray-600 text-sm">
              Track and manage all service requests from colleges and companies
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <div className="inline-flex items-center rounded-lg bg-blue-50 text-blue-700 px-4 py-2 font-semibold border border-blue-200">
              <span className="text-lg">{statistics?.total || 0}</span>
              <span className="ml-2 text-sm font-normal">Total Requests</span>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {[
            { count: statistics?.total || 0, label: "Total", color: "bg-blue-50 text-blue-700 border-blue-200", icon: "📊" },
            { count: statistics?.pending || 0, label: "Pending", color: "bg-yellow-50 text-yellow-700 border-yellow-200", icon: "⏳" },
            { count: statistics?.total-statistics?.completed  || 0, label: "In Progress", color: "bg-purple-50 text-purple-700 border-purple-200", icon: "🔄" },
            { count: statistics?.completed || 0, label: "Completed", color: "bg-green-50 text-green-700 border-green-200", icon: "✅" },
            { count: statistics?.rejected || 0, label: "Rejected", color: "bg-red-50 text-red-700 border-red-200", icon: "❌" },
          ].map((item, i) => (
            <div
              key={i}
              className={`rounded-xl border ${item.color} shadow-sm p-4 text-center transition-all hover:shadow-md`}
            >
              <div className="text-2xl mb-1">{item.icon}</div>
              <div className="text-2xl font-bold">{item.count}</div>
              <div className="text-sm font-medium">{item.label}</div>
            </div>
          ))}
        </div>

        {/* Service Requests Table */}
        <div className="rounded-xl border bg-white shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-blue-600" />
                  All Service Requests
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  View and manage service requests
                </p>
              </div>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="p-6 flex flex-col lg:flex-row lg:items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                placeholder="Search by requester name, email..."
              />
            </div>
            
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition bg-white min-w-[180px]"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="completed">Completed</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Requester</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Type</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Status</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Date</th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="5" className="px-4 py-8 text-center text-gray-500">
                      <div className="flex items-center justify-center gap-2">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                        Loading service requests...
                      </div>
                    </td>
                  </tr>
                ) : requests.length > 0 ? (
                  requests
                    .filter(req => {
                      if (!searchTerm) return true;
                      const searchLower = searchTerm.toLowerCase();
                      return (
                        (req.requesterName?.toLowerCase() || '').includes(searchLower) ||
                        (req.requesterEmail?.toLowerCase() || '').includes(searchLower)
                      );
                    })
                    .map((req) => (
                      <tr key={req._id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                        <td className="px-4 py-3">
                          <div className="font-medium text-gray-900">{req.requesterName}</div>
                          <div className="text-xs text-gray-500">{req.requesterEmail}</div>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getTypeColor(req.serviceRequestType)}`}>
                            {(req.serviceRequestType || "Other")
                              .replace(/-/g, ' ')
                              .toUpperCase()}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(req.status)}`}>
                            {getStatusBadgeIcon(req.status)}
                            {(req.status || "pending").charAt(0).toUpperCase() + (req.status || "pending").slice(1)}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-600">
                          {formatDate(req.createdAt)}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-center gap-2 flex-wrap">
                            {/* View Button */}
                            <button
                              onClick={() => handleOpenViewModal(req)}
                              className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded-lg hover:bg-blue-700 transition"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              View
                            </button>

                            {req.status?.toLowerCase() === 'pending' && (
                              <>
                                {/* Approve Button */}
                                <button
                                  onClick={() => handleOpenApprovalModal(req)}
                                  className="inline-flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white text-xs font-medium rounded-lg hover:bg-green-700 transition"
                                >
                                  <Check className="w-3.5 h-3.5" />
                                  Approve
                                </button>
                                {/* Reject Button */}
                                <button
                                  onClick={() => handleReject(req._id)}
                                  className="inline-flex items-center gap-1 px-3 py-1.5 bg-red-600 text-white text-xs font-medium rounded-lg hover:bg-red-700 transition"
                                >
                                  <X className="w-3.5 h-3.5" />
                                  Reject
                                </button>
                              </>
                            )}
                            
                            {/* Delete Button */}
                            <button
                              onClick={() => handleDelete(req._id)}
                              className="inline-flex items-center gap-1 px-3 py-1.5 bg-gray-600 text-white text-xs font-medium rounded-lg hover:bg-gray-700 transition"
                            >
                              <X className="w-3.5 h-3.5" />
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-4 py-8 text-center text-gray-500">
                      No service requests found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
              <div className="text-sm text-gray-600">
                Page {pagination.currentPage} of {pagination.totalPages} • Total: {pagination.totalServiceRequests}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => fetchRequests(pagination.currentPage - 1)}
                  disabled={pagination.currentPage === 1}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  Previous
                </button>
                <button
                  onClick={() => fetchRequests(pagination.currentPage + 1)}
                  disabled={pagination.currentPage === pagination.totalPages}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Approval Modal */}
        {showApprovalModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white z-10 p-6 border-b border-gray-200 rounded-t-xl">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <Send className="w-5 h-5 text-green-600" />
                    Approve Service Request
                  </h2>
                  <button
                    onClick={() => {
                      setShowApprovalModal(false);
                      setSelectedRequest(null);
                      setApprovalData({ message: "", meetingLink: "" });
                    }}
                    className="text-gray-400 hover:text-gray-600 transition"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-4">
                {/* Request Details */}
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Request Details
                  </h3>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-gray-500">Requester:</span>
                      <p className="font-medium text-gray-900">{selectedRequest?.requesterName}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Email:</span>
                      <p className="font-medium text-gray-900">{selectedRequest?.requesterEmail}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Type:</span>
                      <p className="font-medium text-gray-900 capitalize">{selectedRequest?.serviceRequestType?.replace(/-/g, ' ')}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Requested Date:</span>
                      <p className="font-medium text-gray-900">{selectedRequest?.requestedDate}</p>
                    </div>
                  </div>
                </div>

                {/* Message Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <MessageSquare className="w-4 h-4 inline mr-1" />
                    Message to Requester *
                  </label>
                  <textarea
                    value={approvalData.message}
                    onChange={(e) =>
                      setApprovalData({ ...approvalData, message: e.target.value })
                    }
                    rows={4}
                    maxLength={500}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition resize-none"
                    placeholder="Enter your message to the requester..."
                  />
                  <div className="flex justify-between items-center mt-1">
                    <p className="text-xs text-gray-500">
                      This message will be sent to the requester
                    </p>
                    <p className="text-xs text-gray-400">
                      {approvalData.message.length}/500
                    </p>
                  </div>
                </div>

                {/* Meeting Link Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Video className="w-4 h-4 inline mr-1" />
                    Meeting/Resource Link (Optional)
                  </label>
                  <input
                    type="url"
                    value={approvalData.meetingLink}
                    onChange={(e) =>
                      setApprovalData({ ...approvalData, meetingLink: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                    placeholder="https://meet.google.com/xyz-abc-def"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Add a meeting link or any relevant resource for the requester
                  </p>
                </div>
              </div>

              <div className="sticky bottom-0 bg-gray-50 p-6 border-t border-gray-200 rounded-b-xl flex justify-end gap-3">
                <button
                  onClick={() => {
                    setShowApprovalModal(false);
                    setSelectedRequest(null);
                    setApprovalData({ message: "", meetingLink: "" });
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleApproveWithMessage}
                  disabled={!approvalData.message.trim()}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  Approve & Send
                </button>
              </div>
            </div>
          </div>
        )}

        {/* View Modal (read-only) */}
        {showViewModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white z-10 p-6 border-b border-gray-200 rounded-t-xl">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <Eye className="w-5 h-5 text-blue-600" />
                    Service Request Details
                  </h2>
                  <button
                    onClick={handleCloseViewModal}
                    className="text-gray-400 hover:text-gray-600 transition"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-4">
                {/* Requester Information */}
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Requester Information
                  </h3>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-gray-500">Name:</span>
                      <p className="font-medium text-gray-900">{viewRequest?.requesterName || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Email:</span>
                      <p className="font-medium text-gray-900">{viewRequest?.requesterEmail || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Phone:</span>
                      <p className="font-medium text-gray-900">{viewRequest?.phoneNumber || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Status:</span>
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(viewRequest?.status)}`}>
                        {getStatusBadgeIcon(viewRequest?.status)}
                        {(viewRequest?.status || "pending").charAt(0).toUpperCase() + (viewRequest?.status || "pending").slice(1)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Request Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <h3 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Requested Date & Time
                    </h3>
                    <div className="text-sm space-y-1">
                      <p className="text-gray-600">
                        <strong>Date:</strong> {viewRequest?.requestedDate || 'Not specified'}
                      </p>
                      <p className="text-gray-600">
                        <strong>Time:</strong> {viewRequest?.requestedTime || 'Not specified'}
                      </p>
                      <p className="text-gray-600">
                        <strong>Type:</strong> <span className="capitalize">{viewRequest?.serviceRequestType?.replace(/-/g, ' ') || 'Other'}</span>
                      </p>
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <h3 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Timeline
                    </h3>
                    <div className="text-sm space-y-1">
                      <p className="text-gray-600">
                        <strong>Submitted:</strong> {formatDateTime(viewRequest?.createdAt)}
                      </p>
                      {viewRequest?.resolvedAt && (
                        <p className="text-gray-600">
                          <strong>Resolved:</strong> {formatDateTime(viewRequest.resolvedAt)}
                        </p>
                      )}
                      {viewRequest?.rejectedAt && (
                        <p className="text-gray-600">
                          <strong>Rejected:</strong> {formatDateTime(viewRequest.rejectedAt)}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Message from Requester */}
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <h3 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" />
                    Message from Requester
                  </h3>
                  <div className="text-sm text-gray-700 whitespace-pre-wrap bg-gray-50 p-3 rounded-lg border border-gray-100">
                    {viewRequest?.message || 'No message provided.'}
                  </div>
                </div>

                {/* Admin Response */}
                {(viewRequest?.adminMessage || viewRequest?.meetingLink) && (
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <h3 className="font-semibold text-blue-700 mb-2 flex items-center gap-2">
                      <Send className="w-4 h-4" />
                      Admin Response
                    </h3>
                    {viewRequest?.adminMessage && (
                      <div className="text-sm text-gray-700 mb-3 bg-white p-3 rounded-lg border border-blue-100">
                        {viewRequest.adminMessage}
                      </div>
                    )}
                    {viewRequest?.meetingLink && (
                      <div className="flex items-center gap-2 text-sm">
                        <Video className="w-4 h-4 text-blue-600" />
                        <a 
                          href={viewRequest.meetingLink} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 hover:underline font-medium"
                        >
                          {viewRequest.meetingLink}
                        </a>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="sticky bottom-0 bg-gray-50 p-6 border-t border-gray-200 rounded-b-xl flex justify-end">
                <button
                  onClick={handleCloseViewModal}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default ServiceRequestManagement;