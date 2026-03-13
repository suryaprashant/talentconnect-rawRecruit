import React, { useState, useEffect } from 'react';
import { X, User, Mail, Phone, Download, ExternalLink, GraduationCap, Briefcase } from 'lucide-react';
import { getReferralApplications ,updateApplicationStatusApi } from '@/lib/User_AxiosInstance';
import { ApplicationDetailModal } from './ApplicationDetailModal';
export default function ReferralApplicationsModal({ isOpen, jobId, jobTitle, viewType, onClose }) {
  const [applications, setApplications] = useState([]);
  const [selectedApp, setSelectedApp] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && jobId) {
      fetchApplications();
    }
  }, [isOpen, jobId ,viewType]);

 const fetchApplications = async () => {
  setLoading(true);
  try {
     const isVisited = viewType === 'new' ? false : true;

    const response = await getReferralApplications(jobId,isVisited);
    
    // Check if response.data.data exists (based on your JSON)
    const incomingData = response.data?.data || [];
    console.log("Fetched Applications:", incomingData); // Debugging log
    
    setApplications(incomingData);
  } catch (err) {
    console.error("API Error:", err);
    setApplications([]);
  } finally {
    setLoading(false);
  }
};

const handleAction = async (appId, action) => {
  try {
    // FIX: Match the name used in your import statement
    const response = await updateApplicationStatusApi(appId, action);
    
    // Check for response.data.success because that's what your backend returns
    if (response.data && response.data.success) {
      // 1. Close the detail modal
      setSelectedApp(null); 
      // 2. Refresh the list
      fetchApplications(); 
    }
  } catch (err) {
    console.error("Failed to update status:", err);
    alert("Could not update status. Check console for details.");
  }
};


  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        
        {/* Modal Header */}
        <div className="p-6 border-b flex justify-between items-center bg-gray-50">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Applicants for {jobTitle}</h2>
            <p className="text-sm text-gray-500">{applications.length} Candidates Found</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
              <p className="mt-4 text-gray-500">Fetching candidate profiles...</p>
            </div>
          ) : applications.length === 0 ? (
            <div className="text-center py-20 text-gray-500">
              No approved applications found for this role.
            </div>
          ) : (
            applications.map((app) => (
              <div 
                key={app._id} 
                onClick={() => setSelectedApp(app)} 
                className="border rounded-xl p-5 hover:border-blue-500 hover:shadow-md cursor-pointer transition-all bg-white shadow-sm"
              >
                <div className="flex flex-wrap justify-between items-start gap-4">
                  <div className="flex gap-4">
                    <div className="h-14 w-14 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                      {app.applicant.profileImage ? (
                        <img src={app.applicant.profileImage} alt="" className="h-full w-full rounded-full object-cover" />
                      ) : (
                        <User size={28} />
                      )}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{app.applicant.name}</h3>
                      <div className="flex flex-wrap gap-3 mt-1 text-sm text-gray-600">
                        <span className="flex items-center gap-1"><Mail size={14}/> {app.applicant.email || 'N/A'}</span>
                        <span className="flex items-center gap-1"><Phone size={14}/> {app.applicant.phone}</span>
                      </div>
                    </div>
                  </div>
                  
                 
                </div>

                <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 border-t pt-4">
                  <div className="text-sm">
                    <div className="flex items-center gap-2 text-gray-500 mb-1">
                      <GraduationCap size={16} /> <span className="font-semibold">Education</span>
                    </div>
                    <p className="text-gray-800">{app.applicant.degree}</p>
                    <p className="text-gray-500 text-xs">{app.applicant.college} ({app.applicant.yearOfGraduation})</p>
                  </div>

                  <div className="text-sm">
                    <div className="flex items-center gap-2 text-gray-500 mb-1">
                      <Briefcase size={16} /> <span className="font-semibold">Specialization</span>
                    </div>
                    <p className="text-gray-800">{app.applicant.specialization}</p>
                    <p className="text-gray-500 text-xs">Type: {app.applicantType}</p>
                  </div>

                 
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      {selectedApp && (
        <ApplicationDetailModal 
          application={selectedApp}
          onClose={() => setSelectedApp(null)}
          onAction={handleAction}
        />
      )}
    </div>
  );
}