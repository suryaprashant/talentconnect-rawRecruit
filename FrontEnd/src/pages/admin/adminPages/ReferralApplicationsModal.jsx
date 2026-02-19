import React, { useState, useEffect } from 'react';
import { X, User, Mail, Phone, GraduationCap, Calendar, MapPin, Briefcase, FileText, Loader2, Link as LinkIcon } from 'lucide-react';
import axios from 'axios';

export default function ReferralApplicationsModal({ isOpen, jobId, onClose, jobTitle }) {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && jobId) fetchApplications();
  }, [isOpen, jobId]);

  

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:5000/api/admin/dashboard/referral-applications?jobId=${jobId}`, {
        withCredentials: true 
      });
      setApplications(response.data?.data || []);
    } catch (error) {
      console.error("Error fetching applications:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

return (
  <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
    
    {/* Overlay */}
    <div
      className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    />

    {/* Modal */}
    <div className="relative w-full max-w-6xl h-[92vh] bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 fade-in duration-200">

      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-5 right-5 z-20 p-3 bg-white hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-xl shadow-md transition-all active:scale-95"
      >
        <X size={22} />
      </button>

      {/* Header */}
      <div className="px-8 py-6 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
          {jobTitle || "Referral Applications"}
        </h2>
        <p className="text-gray-500 mt-1 text-sm">
          {applications.length} candidate{applications.length !== 1 ? "s" : ""} applied
        </p>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto p-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-full">
            <Loader2 className="animate-spin text-blue-600 mb-3" size={40} />
            <p className="text-gray-500 font-medium">
              Loading applications...
            </p>
          </div>
        ) : applications.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center">
            <User size={56} className="text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-400">
              No applications yet
            </h3>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {applications.map((app) => (
              <div
                key={app._id}
                className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm hover:shadow-lg transition-all"
              >
                {/* User Header */}
                <div className="flex items-center gap-4 mb-5">
                  <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-lg">
                    {app.applicant?.name?.[0]?.toUpperCase() || "?"}
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {app.applicant?.name || "Unknown"}
                    </h3>
                    <p className="text-xs text-gray-500 uppercase font-medium">
                      {app.applicantType || "Applicant"}
                    </p>
                  </div>
                </div>

                {/* Info grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-600 mb-5">
                  <div className="flex items-center gap-2">
                    <Mail size={14} />
                    <span className="truncate">
                      {app.applicant?.email || "N/A"}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Phone size={14} />
                    <span>{app.applicant?.phone || "N/A"}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <GraduationCap size={14} />
                    <span className="truncate">
                      {app.applicant?.college || "N/A"}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Briefcase size={14} />
                    <span>GPA: {app.applicant?.cgpa || "N/A"}</span>
                  </div>
                </div>

                {/* Resume button */}
                {app.applicant?.resume ? (
                  <a
                    href={app.applicant.resume}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-all active:scale-95"
                  >
                    <FileText size={16} />
                    View Resume
                  </a>
                ) : (
                  <div className="w-full py-3 bg-gray-100 text-gray-400 rounded-xl text-center font-medium">
                    Resume not provided
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  </div>
);

}