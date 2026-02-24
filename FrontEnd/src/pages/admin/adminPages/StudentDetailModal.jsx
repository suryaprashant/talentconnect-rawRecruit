import React, { useState } from 'react';
import { 
  X, Mail, Phone, GraduationCap, FileText, Award, 
  ArrowLeft, CheckCircle, XCircle, Wrench, ShieldCheck, 
  Calendar, Loader2, BookOpen
} from 'lucide-react';

import { updateReferralApplicationStatus } from '@/lib/Admin_AxiosInstance'
import InterviewSchedulerPopupAdmin from './ScheduleInterviewAdmin';

export default function StudentDetailModal({ application, onClose, onStatusUpdate }) {
  const [updating, setUpdating] = useState(null); // stores 'Approved' or 'Rejected' to show specific loader
  const [toggleScheduleInterviewPopup, setToggleScheduleInterviewPopup] = useState(false);

  if (!application) return null;

  const { applicant, applicantType, _id } = application;

const handleStatusUpdate = async (statusAction) => {
  setUpdating(statusAction);
  
  try {
    // Calling the axios instance function
    const response = await updateReferralApplicationStatus(application._id, statusAction);

    if (response.data.success) {
      if (onStatusUpdate) onStatusUpdate(application._id, statusAction);
      onClose();
    }
  } catch (error) {
    console.error("❌ API Error:", error.response?.data || error.message);
    
    // Detailed error handling
    const errorMsg = error.response?.data?.message || "Check network connection";
    alert(`Update Failed: ${errorMsg}`);
  } finally {
    setUpdating(null);
  }
};

  const renderTags = (items, colorClass) => {
    const list = Array.isArray(items) ? items : (items ? items.split(',') : []);
    if (list.length === 0) return <span className="text-gray-400 text-sm italic">Not specified</span>;
    return (
      <div className="flex flex-wrap gap-2 mt-2">
        {list.map((item, index) => (
          <span key={index} className={`px-3 py-1 rounded-full text-xs font-medium ${colorClass}`}>
            {item.trim()}
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-md" onClick={onClose} />
      
      <div className="relative w-full max-w-6xl h-[90vh] bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-8 py-5 border-b flex items-center justify-between bg-white z-10">
          <div className="flex items-center gap-4">
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl text-gray-500 transition-colors">
              <ArrowLeft size={22} />
            </button>
            <h2 className="text-xl font-bold text-gray-900">Application Review</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-red-50 hover:text-red-500 rounded-full transition-colors">
            <X size={22} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto bg-slate-50/50">
          {/* Main Info Card */}
          <div className="bg-white m-6 rounded-2xl border border-gray-100 p-8 shadow-sm">
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="h-24 w-24 bg-indigo-600 rounded-2xl flex items-center justify-center text-3xl font-bold text-white shadow-lg">
                {applicant?.name?.[0]}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <h1 className="text-3xl font-bold text-gray-900">{applicant?.name}</h1>
                  <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-lg text-[10px] font-bold uppercase tracking-widest">
                    {applicantType}
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4 text-gray-600">
                  <div className="flex items-center gap-2 text-sm"><Mail size={16} className="text-indigo-400"/> {applicant?.email}</div>
                  <div className="flex items-center gap-2 text-sm"><Phone size={16} className="text-indigo-400"/> {applicant?.phone}</div>
                  <div className="flex items-center gap-2 text-sm"><Calendar size={16} className="text-indigo-400"/> Grad: {applicant?.gradYear || "N/A"}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="px-6 pb-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Education Card */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <h3 className="flex items-center gap-2 text-indigo-600 font-bold mb-5 border-b pb-2"><GraduationCap size={18}/> Education Details</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">College</label>
                  <p className="text-gray-800 font-semibold">{applicant?.college}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">Degree</label>
                    <p className="text-gray-800 font-semibold">{applicant?.degree || "N/A"}</p>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">Specialization</label>
                    <p className="text-gray-800 font-semibold">{applicant?.specialization || "N/A"}</p>
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">CGPA</label>
                  <p className="text-2xl font-black text-indigo-600">{applicant?.cgpa || "N/A"}</p>
                </div>
              </div>
            </div>

            {/* Tech & Skills Card */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <h3 className="flex items-center gap-2 text-indigo-600 font-bold mb-5 border-b pb-2"><Wrench size={18}/> Technical Profile</h3>
              <div className="space-y-6">
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase">Skills</label>
                  {renderTags(applicant?.skills, "bg-blue-100 text-blue-700")}
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase">Tools & Platforms</label>
                  {renderTags(applicant?.tools, "bg-purple-100 text-purple-700")}
                </div>
              </div>
            </div>

            {/* Certifications Card */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm lg:col-span-2">
              <h3 className="flex items-center gap-2 text-indigo-600 font-bold mb-4 border-b pb-2"><ShieldCheck size={18}/> Certifications</h3>
              {renderTags(applicant?.certifications, "bg-emerald-100 text-emerald-700")}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-8 py-6 border-t bg-white flex flex-wrap items-center justify-between gap-4">
          <div className="flex gap-3 items-center">
            {applicant?.resume ? (
              <a
                href={applicant.resume}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg"
              >
                <FileText size={18} />
                View Resume
              </a>
            ) : (
              <span className="text-gray-400 italic">No resume uploaded</span>
            )}

            {/* 🗓️ Schedule Interview */}
            <button
              onClick={() => setToggleScheduleInterviewPopup(true)}
              className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg"
            >
              <Calendar size={18} />
              Schedule Interview
            </button>
          </div>

          <div className="flex gap-3">
            <button 
              disabled={!!updating}
              onClick={() => handleStatusUpdate('Rejected')}
              className="flex items-center gap-2 px-8 py-3 border-2 border-red-100 text-red-600 hover:bg-red-50 rounded-xl font-bold transition-all disabled:opacity-50"
            >
              {updating === 'Rejected' ? <Loader2 className="animate-spin" size={18} /> : <XCircle size={18} />}
              Reject
            </button>
            <button 
              disabled={!!updating}
              onClick={() => handleStatusUpdate('Approved')}
              className="flex items-center gap-2 px-8 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100 disabled:opacity-50 min-w-[180px] justify-center"
            >
              {updating === 'Approved' ? <Loader2 className="animate-spin" size={18} /> : <CheckCircle size={18} />}
              Approve Applicant
            </button>
          </div>
        </div>
      </div>

      {toggleScheduleInterviewPopup && (
        <InterviewSchedulerPopupAdmin
          setToggleScheduleInterviewPopup={setToggleScheduleInterviewPopup}
          application={application}
          job={application.job} 
        />
      )}
    </div>
  );
}