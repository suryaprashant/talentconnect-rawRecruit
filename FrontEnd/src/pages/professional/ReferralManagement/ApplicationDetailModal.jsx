import React, { useState } from 'react';
import { 
  X, CheckCircle, XCircle, Download, User, 
  Mail, Phone, MapPin, Calendar, BookOpen, 
  Briefcase, Loader2 
} from 'lucide-react';

export function ApplicationDetailModal({ application, onClose, onAction }) {
  const [isProcessing, setIsProcessing] = useState(false);

  if (!application) return null;
  const { applicant } = application;

  // const handleStatusUpdate = async (id, status) => {
  //   setIsProcessing(true);
  //   await onAction(id, status);
  //   setIsProcessing(false);
  // };
  // Inside ApplicationDetailModal.jsx
const handleStatusUpdate = async (status) => {
  setIsProcessing(true);
  try {
    // Ensure application._id is the first argument
    await onAction(application._id, status); 
  } catch (error) {
    console.error("Action failed", error);
  } finally {
    setIsProcessing(false);
  }
};

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-[2px]">
      <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in duration-200">
        
        {/* Header Section */}
        <div className="relative h-40 bg-gradient-to-r from-indigo-600 to-purple-700 p-8">
          <button 
            onClick={onClose} 
            disabled={isProcessing}
            className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/40 rounded-full text-white transition-all disabled:opacity-50"
          >
            <X size={20} />
          </button>
          
          <div className="flex items-end gap-6 h-full translate-y-4">
            <div className="h-28 w-28 rounded-2xl border-4 border-white bg-white shadow-xl overflow-hidden flex-shrink-0">
              {applicant.profileImage ? (
                <img src={applicant.profileImage} className="h-full w-full object-cover" alt="Profile" />
              ) : (
                <div className="h-full w-full flex items-center justify-center bg-gray-100 text-gray-400">
                  <User size={48} />
                </div>
              )}
            </div>
            <div className="pb-4">
              <h2 className="text-3xl font-bold text-white leading-tight">{applicant.name}</h2>
              <p className="text-indigo-100 flex items-center gap-2">
                <Briefcase size={16} /> {applicant.degree}
              </p>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="pt-16 px-10 pb-8 overflow-y-auto max-h-[60vh]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <section>
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-4">Contact Info</h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-slate-600 text-sm">
                    <Mail size={18} className="text-slate-400"/> {applicant.email || "N/A"}
                  </div>
                  <div className="flex items-center gap-3 text-slate-600 text-sm">
                    <Phone size={18} className="text-slate-400"/> {applicant.phone}
                  </div>
                </div>
              </section>

              <section>
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-4">Academic Backgrounds</h4>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <p className="font-bold text-slate-900 text-sm">{applicant.college}</p>
                  <p className="text-xs text-slate-500 mt-1">{applicant.specialization} • CGPA: {applicant.cgpa}</p>
                </div>
              </section>
            </div>

            <div className="space-y-6">
              <section>
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-4">Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {applicant.skills?.map((skill, i) => (
                    <span key={i} className="px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-semibold rounded-md border border-indigo-100">
                      {skill}
                    </span>
                  ))}
                </div>
              </section>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 bg-slate-50 border-t flex gap-4">
         
          <div className="flex-1"></div>
          <button 
    disabled={isProcessing}
    onClick={() => handleStatusUpdate('Referred To Company')}
    className="px-6 py-3 bg-blue-50 text-[#143694] hover:bg-blue-100 rounded-xl font-bold transition-all text-sm disabled:opacity-50 border border-blue-200 flex items-center gap-2"
  >
   
    Refer to Company
  </button>

          <button 
            disabled={isProcessing}
            onClick={() => handleStatusUpdate('Rejected')}
            className="px-6 py-3 text-rose-600 hover:bg-rose-50 rounded-xl font-bold transition-all text-sm disabled:opacity-50"
          >
            Rejected By Company
          </button>
          <button 
            disabled={isProcessing}
            onClick={() => handleStatusUpdate('Accepted')}
            className="px-8 py-3 bg-slate-900 hover:bg-indigo-600 text-white rounded-xl font-bold transition-all shadow-lg shadow-slate-200 text-sm disabled:opacity-50 flex items-center gap-2"
          >
            {isProcessing ? <Loader2 size={18} className="animate-spin" /> : <CheckCircle size={18}/>}
            Accepted By Company
          </button>
        </div>
      </div>
    </div>
  );
}