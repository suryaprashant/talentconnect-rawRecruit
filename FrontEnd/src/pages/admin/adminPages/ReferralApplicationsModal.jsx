import React, { useState, useEffect } from 'react';
import { X, User, Mail, Phone, GraduationCap, Briefcase, FileText, Loader2, Award, BookOpen } from 'lucide-react';
import axios from 'axios';
import StudentDetailModal from './StudentDetailModal'; // Importing the new component
import { getApplicationForReferral } from '@/lib/Admin_AxiosInstance';
export default function ReferralApplicationsModal({ isOpen, jobId, onClose, jobTitle }) {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedApp, setSelectedApp] = useState(null); // State for the detail popup

  useEffect(() => {
    if (isOpen && jobId) fetchApplications();
  }, [isOpen, jobId]);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const response = await getApplicationForReferral(jobId);
      setApplications(response.data?.data || []);
    } catch (error) {
      console.error("Error fetching applications:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity" onClick={onClose} />

      {/* Main Container */}
      <div className="relative w-full max-w-6xl h-[90vh] bg-gray-50 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-8 py-6 border-b bg-white flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{jobTitle || "Referral Applications"}</h2>
            <p className="text-gray-500 text-sm font-medium">{applications.length} Candidates Found</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-red-50 hover:text-red-500 rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Body (Applicant Grid) */}
        <div className="flex-1 overflow-y-auto p-8">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-full">
              <Loader2 className="animate-spin text-blue-600 mb-3" size={40} />
              <p className="text-gray-500 font-medium">Fetching candidates...</p>
            </div>
          ) : applications.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center">
              <User size={60} className="text-gray-300 mb-4" />
              <h3 className="text-xl font-semibold text-gray-400">No applications found for this role</h3>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {applications.map((app) => (
                <div key={app._id} className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="h-12 w-12 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold text-lg">
                      {app.applicant?.name?.[0]?.toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 leading-tight">{app.applicant?.name}</h3>
                      <span className="text-[10px] bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                        {app.applicantType || "External"}
                      </span>
                    </div>
                  </div>
                  
                  <div className="space-y-2 mb-6 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <GraduationCap size={14} className="text-gray-400" />
                      <span className="truncate">{app.applicant?.college || "Not specified"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Award size={14} className="text-gray-400" />
                      <span>CGPA: {app.applicant?.cgpa || "N/A"}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedApp(app)}
                    className="w-full py-2.5 bg-gray-900 hover:bg-gray-800 text-white rounded-xl text-sm font-semibold transition-all active:scale-95"
                  >
                    View Application
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* --- Detailed Student Modal --- */}
      <StudentDetailModal 
        application={selectedApp} 
        onClose={() => setSelectedApp(null)} 
      />
    </div>
  );
}