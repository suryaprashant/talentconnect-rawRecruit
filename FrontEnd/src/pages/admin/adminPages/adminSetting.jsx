import React, { useState, useEffect } from "react";
import { AlertCircle, Search, Check, X, Send, Eye, Link as LinkIcon } from "lucide-react";
import axios from "axios";
import { toast } from "react-hot-toast";

const ServiceRequestManagement = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [statistics, setStatistics] = useState(null);
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

  const REQUEST_TYPES = [
    "Counselling",
    "onboarding-support",
    "seminar",
    "training",
    "workshop",
    "internship",
    "placement",
    "other"
  ];

  // Fetch service requests data
  const fetchRequests = async (page = 1) => {
    try {
      setLoading(true);
      const response = await axios.post(
        `${import.meta.env.VITE_Backend_URL}/api/admin/servicerequest/requests-board`,
        {
          page,
          limit: ITEMS_PER_PAGE,
          search: searchTerm,
          status: filterStatus,
          requestType: filterType
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
        setRequests(response.data.data.requests);
        setPagination(response.data.data.pagination);
        setStatistics(response.data.data.statistics);
        setCurrentPage(page);
      }
    } catch (error) {
      console.error("Error fetching service requests:", error);
      toast.error("Failed to fetch service requests");
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch and refetch on filter change
  useEffect(() => {
    fetchRequests(1);
  }, [searchTerm, filterStatus, filterType]);

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

  // Handle approve with message and link
  const handleApproveWithMessage = async () => {
    if (!selectedRequest) return;

    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_Backend_URL}/api/admin/servicerequest/${selectedRequest._id}/status`,
        {
          status: "approved",
          notificationMessage: approvalData.message,
          meetingLink: approvalData.meetingLink
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
        toast.success("Service request approved and notification sent!");
        setShowApprovalModal(false);
        setSelectedRequest(null);
        setApprovalData({ message: "", meetingLink: "" });
        // Refresh the list
        fetchRequests(currentPage);
      }
    } catch (error) {
      console.error("Error approving service request:", error);
      toast.error("Failed to approve service request");
    }
  };

  // Handle reject action
  const handleReject = async (requestId) => {
    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_Backend_URL}/api/admin/servicerequest/${requestId}/status`,
        {
          status: "rejected",
          notificationMessage: "Your service request has been rejected."
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
        toast.success("Service request rejected successfully");
        // Refresh the list
        fetchRequests(currentPage);
      }
    } catch (error) {
      console.error("Error rejecting service request:", error);
      toast.error("Failed to reject service request");
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
        return "bg-yellow-100 text-yellow-700";
      case "approved":
      case "in progress":
        return "bg-blue-100 text-[#143694]";
      case "completed":
        return "bg-green-100 text-green-700";
      case "rejected":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getTypeColor = (type) => {
    const colors = {
      careerCounseling: "bg-purple-100 text-purple-700",
      seminar: "bg-indigo-100 text-indigo-700",
      training: "bg-cyan-100 text-cyan-700",
      workshop: "bg-teal-100 text-teal-700",
      internship: "bg-lime-100 text-lime-700",
      placement: "bg-orange-100 text-orange-700",
      other: "bg-gray-100 text-gray-700"
    };
    return colors[type] || "bg-gray-100 text-gray-700";
  };
  return (
    <main className="min-h-screen">
      <div className="p-6 space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="responsive-title font-bold text-slate-900 mb-2">
              Service Request Management
            </h1>
            <p className="text-slate-600">
              Track and manage all service requests from colleges and companies
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <div className="inline-flex items-center rounded-md border font-semibold transition-colors border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80 text-lg px-3 py-1">
              {statistics?.total || 0} requests
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {[
            { count: statistics?.total || 0, label: "Total", color: "text-[#143694]" },
            { count: statistics?.pending || 0, label: "Pending", color: "text-yellow-700" },
            { count: statistics?.inProgress || 0, label: "In Progress", color: "text-slate-700" },
            { count: statistics?.completed || 0, label: "Completed", color: "text-green-700" },
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

        {/* Service Requests Table */}
        <div className="rounded-xl border bg-card text-card-foreground shadow">
          <div className="flex flex-col space-y-1.5 p-6">
            <div className="font-semibold leading-none tracking-tight flex items-center space-x-2">
              <AlertCircle className="w-5 h-5" />
              <span>All Service Requests</span>
            </div>
            <div className="text-sm text-muted-foreground">
              View and manage service requests
            </div>
          </div>

          {/* Search and Filters */}
          <div className="p-6 pt-0 flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 pl-10 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                placeholder="Search by requester name, email, organization..."
              />
            </div>
            
            {/* Status Filter */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="flex h-9 items-center justify-between w-full lg:w-48 border rounded-md px-3 py-2 text-sm shadow-sm bg-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="completed">Completed</option>
              <option value="rejected">Rejected</option>
            </select>

            {/* Type Filter */}
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="flex h-9 items-center justify-between w-full lg:w-48 border rounded-md px-3 py-2 text-sm shadow-sm bg-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <option value="all">All Types</option>
              {REQUEST_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Table */}
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full caption-bottom text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="p-2 text-left font-medium">Requester</th>
                  <th className="p-2 text-left font-medium">Type</th>
                  <th className="p-2 text-left font-medium">Status</th>
                  <th className="p-2 text-left font-medium">Organization</th>
                  <th className="p-2 text-left font-medium">Date</th>
                  <th className="p-2 text-center font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="6" className="p-8 text-center text-slate-500">
                      Loading service requests...
                    </td>
                  </tr>
                ) : requests.length > 0 ? (
                  requests.map((req) => (
                    <tr key={req._id} className="border-b hover:bg-slate-50">
                      <td className="p-2">
                        <div className="font-medium">{req.requesterName || "N/A"}</div>
                        <div className="text-xs text-slate-500">{req.requesterEmail || ""}</div>
                      </td>
                      <td className="p-2">
                        <div className={`inline-flex items-center rounded-md ${getTypeColor(req.serviceRequestType)} px-2 py-0.5 text-xs font-semibold`}>
                          {(req.serviceRequestType || "Other")
                            .split(/(?=[A-Z])/)
                            .join(" ")
                            .toUpperCase()}
                        </div>
                      </td>
                      <td className="p-2">
                        <div className={`inline-flex items-center rounded-md ${getStatusColor(req.status)} px-2 py-0.5 text-xs font-semibold`}>
                          {(req.status || "pending").charAt(0).toUpperCase() + (req.status || "pending").slice(1)}
                        </div>
                      </td>
                      <td className="p-2">{req.organizationName || "N/A"}</td>
                      <td className="p-2">
                        {req.createdAt ? new Date(req.createdAt).toLocaleDateString() : "N/A"}
                      </td>
                      <td className="p-2">
                        <div className="flex items-center justify-center gap-2">
                          {/* View button always available */}
                          <button
                            onClick={() => handleOpenViewModal(req)}
                            className="inline-flex items-center justify-center gap-1 rounded-md text-sm font-medium transition-colors bg-blue-600 text-white hover:bg-[#143694] h-8 px-3"
                            title="View"
                          >
                            <Eye className="w-4 h-4" />
                            View
                          </button>

                          {req.status?.toLowerCase() === 'pending' && (
                            <>
                              <button
                                onClick={() => handleOpenApprovalModal(req)}
                                className="inline-flex items-center justify-center gap-1 rounded-md text-sm font-medium transition-colors bg-green-600 text-white hover:bg-green-700 h-8 px-3"
                                title="Approve"
                              >
                                <Check className="w-4 h-4" />
                                Approve
                              </button>
                              <button
                                onClick={() => handleReject(req._id)}
                                className="inline-flex items-center justify-center gap-1 rounded-md text-sm font-medium transition-colors bg-red-600 text-white hover:bg-red-700 h-8 px-3"
                                title="Reject"
                              >
                                <X className="w-4 h-4" />
                                Reject
                              </button>
                            </>
                          )}
                          {req.status?.toLowerCase() !== 'pending' && (
                            <span className="text-xs text-slate-500"> </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="p-8 text-center text-slate-500">
                      No service requests found
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
                Page {pagination.currentPage} of {pagination.totalPages} • Total Requests: {pagination.totalServiceRequests}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => fetchRequests(pagination.currentPage - 1)}
                  disabled={pagination.currentPage === 1}
                  className="px-4 py-2 border rounded-md hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  onClick={() => fetchRequests(pagination.currentPage + 1)}
                  disabled={pagination.currentPage === pagination.totalPages}
                  className="px-4 py-2 border rounded-md hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Approval Modal */}
        {showApprovalModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                    <Send className="w-6 h-6" />
                    Approve Service Request
                  </h2>
                  <button
                    onClick={() => {
                      setShowApprovalModal(false);
                      setSelectedRequest(null);
                      setApprovalData({ message: "", meetingLink: "" });
                    }}
                    className="text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-4">
                {/* Request Details */}
                <div className="bg-slate-50 p-4 rounded-lg space-y-2">
                  <h3 className="font-semibold text-slate-700">Request Details</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-slate-500">Requester:</span>
                      <p className="font-medium">{selectedRequest?.requesterName}</p>
                    </div>
                    <div>
                      <span className="text-slate-500">Email:</span>
                      <p className="font-medium">{selectedRequest?.requesterEmail}</p>
                    </div>
                    <div>
                      <span className="text-slate-500">Type:</span>
                      <p className="font-medium">{selectedRequest?.serviceRequestType}</p>
                    </div>
                    <div>
                      <span className="text-slate-500">Organization:</span>
                      <p className="font-medium">{selectedRequest?.organizationName}</p>
                    </div>
                  </div>
                </div>

                {/* Message Input */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Message to Requester *
                  </label>
                  <textarea
                    value={approvalData.message}
                    onChange={(e) =>
                      setApprovalData({ ...approvalData, message: e.target.value })
                    }
                    rows={4}
                    maxLength={500}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1e4ed8] resize-none"
                    placeholder="Enter your message to the requester..."
                    required
                  />
                  <div className="flex justify-between items-center mt-1">
                    <p className="text-xs text-slate-500">
                      This message will be sent to the requester's notification box
                    </p>
                    <p className="text-xs text-slate-400">
                      {approvalData.message.length}/500
                    </p>
                  </div>
                </div>

                {/* Meeting Link Input */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                    <LinkIcon className="w-4 h-4" />
                    Meeting/Resource Link (Optional)
                  </label>
                  <input
                    type="url"
                    value={approvalData.meetingLink}
                    onChange={(e) =>
                      setApprovalData({ ...approvalData, meetingLink: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1e4ed8]"
                    placeholder="https://meet.google.com/xyz-abc-def or any relevant link"
                  />
                  <p className="text-xs text-slate-500 mt-1">
                    Add a meeting link, document, or any relevant resource for the requester
                  </p>
                </div>
              </div>

              <div className="p-6 border-t bg-slate-50 flex justify-end gap-3">
                <button
                  onClick={() => {
                    setShowApprovalModal(false);
                    setSelectedRequest(null);
                    setApprovalData({ message: "", meetingLink: "" });
                  }}
                  className="px-4 py-2 border border-slate-300 rounded-md text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleApproveWithMessage}
                  disabled={!approvalData.message.trim()}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  Approve & Send Notification
                </button>
              </div>
            </div>
          </div>
        )}

        {/* View Modal (read-only) */}
        {showViewModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b flex items-center justify-between">
                <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                  <Eye className="w-6 h-6" />
                  View Service Request
                </h2>
                <button
                  onClick={handleCloseViewModal}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div className="bg-slate-50 p-4 rounded-lg space-y-2">
                  <h3 className="font-semibold text-slate-700">Requester</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-slate-500">Name:</span>
                      <p className="font-medium">{viewRequest?.requesterName || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="text-slate-500">Email:</span>
                      <p className="font-medium">{viewRequest?.requesterEmail || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="text-slate-500">Phone:</span>
                      <p className="font-medium">{viewRequest?.phoneNumber || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="text-slate-500">Organization:</span>
                      <p className="font-medium">{viewRequest?.organizationName || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="text-slate-500">Submitted On:</span>
                      <p className="font-medium">{viewRequest?.createdAt ? new Date(viewRequest.createdAt).toLocaleString() : 'N/A'}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-lg border">
                  <h3 className="font-semibold text-slate-700 mb-2">Requested Date & Time</h3>
                  <div className="text-sm text-slate-600">
                    <p>
                      <strong>Date:</strong>{' '}
                      {viewRequest?.requestedDate ? new Date(viewRequest.requestedDate).toLocaleDateString() : 'Not specified'}
                    </p>
                    <p>
                      <strong>Time:</strong>{' '}
                      {viewRequest?.requestedTime || 'Not specified'}
                    </p>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-lg border">
                  <h3 className="font-semibold text-slate-700 mb-2">Message from Requester</h3>
                  <div className="text-sm text-slate-800 whitespace-pre-wrap">
                    {viewRequest?.message || 'No message provided.'}
                  </div>
                </div>
              </div>

              <div className="p-6 border-t bg-slate-50 flex justify-end">
                <button
                  onClick={handleCloseViewModal}
                  className="px-4 py-2 border border-slate-300 rounded-md text-slate-700 hover:bg-slate-100 transition-colors"
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
