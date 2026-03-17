import React from "react";
import { createPortal } from "react-dom";
import { X, Mail, Linkedin, Building2, UserCircle, Briefcase, ExternalLink } from "lucide-react";

const ReferrerDetailModal = ({ referrer, isOpen, onClose }) => {
  if (!isOpen || !referrer) return null;

  const formatUrl = (url) => {
    if (!url) return "#";
    return url.startsWith("http") ? url : `https://${url}`;
  };

  // Check if linkedin exists and isn't just an empty string
  const hasLinkedin = referrer.linkedin && referrer.linkedin.trim() !== "";

  return createPortal(
    <div className="fixed inset-0 z-[999999] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white w-full max-w-md rounded-xl shadow-2xl p-6" onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-slate-900">Referrer Details</h2>
          <button onClick={onClose} className="hover:bg-slate-100 p-1 rounded-full transition-colors">
            <X size={20} className="text-slate-500" />
          </button>
        </div>

        {/* Profile Header */}
        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-100">
          <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200">
            <UserCircle size={40} className="text-slate-400" />
          </div>
          <div>
            <p className="font-bold text-lg text-slate-900">{referrer.name || "Name Not Provided"}</p>
            <p className="text-sm font-medium text-indigo-600 capitalize">
              {referrer.profileType || "Member"}
            </p>
          </div>
        </div>

        <div className="space-y-5">
          {/* Company Field */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-slate-50 flex items-center justify-center border border-slate-100">
              <Building2 size={18} className="text-slate-500"/>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Current Company</p>
              <p className="text-sm font-semibold text-slate-700">
                {referrer.currentCompany && referrer.currentCompany.trim() !== "" 
                  ? referrer.currentCompany 
                  : "Not Specified"}
              </p>
            </div>
          </div>

          {/* LinkedIn Field - Only clickable if link exists */}
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center border ${hasLinkedin ? 'bg-blue-50 border-blue-100' : 'bg-slate-50 border-slate-100'}`}>
              <Linkedin size={18} className={hasLinkedin ? "text-blue-600" : "text-slate-400"}/>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">LinkedIn Profile</p>
              {hasLinkedin ? (
                <a
                  href={formatUrl(referrer.linkedin)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-sm font-bold text-blue-600 hover:underline"
                >
                  View LinkedIn Profile <ExternalLink size={12} />
                </a>
              ) : (
                <p className="text-sm font-semibold text-slate-400 italic">Not Linked</p>
              )}
            </div>
          </div>

          {/* Contact Email */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-slate-50 flex items-center justify-center border border-slate-100">
              <Mail size={18} className="text-slate-500"/>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Email Address</p>
              <p className="text-sm font-semibold text-slate-700">{referrer.email}</p>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <button 
            onClick={onClose}
            className="w-full py-3 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ReferrerDetailModal;