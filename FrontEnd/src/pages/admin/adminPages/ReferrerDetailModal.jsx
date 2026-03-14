import React from "react";
import { createPortal } from "react-dom";
import { X, Mail, Linkedin, Building2, UserCircle, Briefcase } from "lucide-react";

const ReferrerDetailModal = ({ referrer, isOpen, onClose }) => {
  if (!isOpen || !referrer) return null;

  return createPortal(
    <div className="fixed inset-0 z-[999999] flex items-center justify-center p-4">
      
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />

      <div
        className="relative bg-white w-full max-w-md rounded-xl shadow-xl p-6"
        onClick={(e) => e.stopPropagation()}
      >

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-slate-900">
            Referrer Details
          </h2>
          <button onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Profile */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center">
            <UserCircle size={36} className="text-slate-400" />
          </div>

          <div>
            <p className="font-bold text-slate-900">{referrer.name}</p>
            <p className="text-sm text-slate-500">{referrer.profileType}</p>
          </div>
        </div>

        {/* Details */}
        <div className="space-y-4 text-sm">

          <div className="flex items-center gap-3">
            <Mail size={16} className="text-slate-400"/>
            <span>{referrer.email}</span>
          </div>

          <div className="flex items-center gap-3">
            <Building2 size={16} className="text-slate-400"/>
            <span>{referrer.currentCompany || "Not specified"}</span>
          </div>

          <div className="flex items-center gap-3">
            <Briefcase size={16} className="text-slate-400"/>
            {referrer.totalYearsOfExperience 
              ? `${referrer.totalYearsOfExperience} Years Experience`
              : "Experience not specified"}
          </div>

          {referrer.linkedin && (
            <a
              href={referrer.linkedin}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 text-indigo-600 hover:underline"
            >
              <Linkedin size={16} />
              View LinkedIn Profile
            </a>
          )}

        </div>
      </div>
    </div>,
    document.body
  );
};

export default ReferrerDetailModal;