import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { 
  X, MapPin, Briefcase, ShieldCheck, 
  Users, Zap, Clock, MessageSquare, 
  GraduationCap, Award, Calendar, 
  Share2, Save, CheckCircle2, Building2, 
  DollarSign, Mail, Linkedin, UserCircle,
  ExternalLink
} from 'lucide-react';

const ReferralDetailModal = ({ job, isOpen, onClose }) => {
  const modalRef = useRef(null);

  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen) return null;

  const referrer = job?.candidatePosted || {};
  const location = job?.location?.[0] || "Remote";
  const ctc = job?.packageDetails?.totalCTC 
    ? `${job.packageDetails.currency === 'INR' ? '₹' : '$'}${job.packageDetails.totalCTC.toLocaleString()}`
    : "Not Disclosed";

  return createPortal(
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
      {/* SUBTLE BACKDROP: Reduced blur and opacity */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] transition-opacity" 
        onClick={onClose} 
      />

      <div 
        ref={modalRef}
        className="relative w-full max-w-4xl max-h-[92vh] bg-white rounded-[32px] shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-300"
      >
        {/* Header Action Bar */}
        <div className="absolute top-6 right-6 z-50 flex gap-2">
          <button className="p-2.5 bg-white/80 backdrop-blur-md border border-slate-200 rounded-full shadow-sm hover:bg-white transition-all active:scale-90 text-slate-600">
             <Share2 size={18} />
          </button>
          <button 
            onClick={onClose}
            className="p-2.5 bg-slate-100 hover:bg-slate-200 rounded-full transition-all group"
          >
            <X className="h-5 w-5 text-slate-600 group-hover:rotate-90 transition-transform" />
          </button>
        </div>

        {/* 1. TOP BRANDING SECTION */}
        <div className="bg-white px-8 pt-10 pb-6 shrink-0 border-b border-slate-50">
          <div className="flex gap-6 items-center">
            <div className="w-20 h-20 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-xl shadow-indigo-100 shrink-0">
              <Building2 className="h-10 w-10 text-white" />
            </div>
            <div className="min-w-0">
              <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase italic leading-tight truncate">
                {job?.jobTitle || "Job Opportunity"}
              </h1>
              <div className="flex items-center gap-3 mt-2 text-slate-500 font-bold text-sm">
                <span className="flex items-center gap-1.5"><MapPin size={16} className="text-indigo-500"/> {location}</span>
                <span className="text-slate-300">•</span>
                <span className="flex items-center gap-1.5"><Briefcase size={16} className="text-indigo-500"/> {referrer.currentCompany}</span>
              </div>
            </div>
          </div>
        </div>

        {/* 2. SCROLLABLE CONTENT */}
        <div className="flex-1 overflow-y-auto p-8 pt-4 custom-scrollbar bg-white">
          <div className="space-y-8">
            
            {/* Metric Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-slate-50/80 p-5 rounded-2xl border border-slate-100">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Employment</p>
                <p className="font-bold text-slate-800">{job?.employmentType?.[0] || 'Full-time'}</p>
              </div>
              <div className="bg-slate-50/80 p-5 rounded-2xl border border-slate-100">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Experience</p>
                <p className="font-bold text-slate-800">{job?.yearsOfExperience || '0-2'} Years</p>
              </div>
              <div className="bg-indigo-50/50 p-5 rounded-2xl border border-indigo-100/50">
                <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1 text-center">CTC Package</p>
                <p className="font-black text-indigo-600 text-center text-lg">{ctc}</p>
              </div>
            </div>

            {/* Job Description */}
            <section>
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                <div className="h-px w-6 bg-slate-200"></div> Description
              </h3>
              <div className="text-slate-600 leading-relaxed text-lg whitespace-pre-wrap font-medium pl-2 border-l-2 border-slate-100">
                {job?.description || "No description provided."}
              </div>
            </section>

            {/* Eligibility */}
            <section className="bg-slate-50 p-6 rounded-3xl border border-slate-100 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-5">
                <GraduationCap size={80} />
              </div>
              <h3 className="font-black text-slate-900 uppercase text-xs mb-3 flex items-center gap-2">
                <GraduationCap className="h-4 w-4 text-indigo-600" /> Eligibility Criteria
              </h3>
              <p className="text-slate-700 font-bold leading-relaxed">
                {job?.eligibilityCriteria || "Open to all relevant Engineering and Computer Science graduates."}
              </p>
            </section>

            {/* Referrer Details Section */}
            <section className="pt-4">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                <div className="h-px w-6 bg-slate-200"></div> Posted By
              </h3>
              <div className="flex flex-col md:flex-row items-center gap-6 p-6 rounded-[28px] border border-slate-100 shadow-sm bg-white">
                <div className="relative shrink-0">
                  <div className="w-20 h-20 rounded-2xl border border-slate-100 flex items-center justify-center overflow-hidden bg-slate-50">
                    {referrer.profileImageUrl ? (
                      <img src={referrer.profileImageUrl} className="w-full h-full object-cover" alt="" />
                    ) : (
                      <UserCircle className="h-12 w-12 text-slate-300" />
                    )}
                  </div>
                  <div className="absolute -bottom-1 -right-1 bg-green-500 p-1 rounded-full border-2 border-white shadow-sm">
                    <ShieldCheck className="h-3.5 w-3.5 text-white" />
                  </div>
                </div>

                <div className="flex-1 text-center md:text-left">
                  <h4 className="text-xl font-black text-slate-900 uppercase italic tracking-tight leading-none">
                    {referrer.name || "Verified Member"}
                  </h4>
                  <p className="text-indigo-600 font-bold text-xs mt-2 uppercase tracking-wider flex items-center justify-center md:justify-start gap-1">
                    <Building2 size={12}/> {referrer.currentCompany || "Verified Org"}
                  </p>
                  
                  <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-4">
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-lg text-xs font-bold text-slate-500 border border-slate-100">
                      <Mail size={14} className="text-slate-400" /> {referrer.email || "N/A"}
                    </div>
                    {referrer.linkedin && (
                      <a 
                        href={referrer.linkedin} 
                        target="_blank" 
                        className="flex items-center gap-2 px-3 py-1.5 bg-[#0077b5]/5 rounded-lg text-xs font-bold text-[#0077b5] border border-[#0077b5]/10 hover:bg-[#0077b5]/10 transition-colors"
                      >
                        <Linkedin size={14} fill="currentColor" className="text-transparent" /> LinkedIn Profile
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* 3. FIXED CTA FOOTER */}
        <div className="p-6 bg-white border-t border-slate-50 flex justify-center shrink-0">
          <button className="w-full max-w-sm py-4 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-black rounded-2xl shadow-xl shadow-indigo-100 transition-all flex items-center justify-center gap-3 active:scale-95 group uppercase tracking-[0.2em] text-xs">
            <CheckCircle2 size={18} className="group-hover:scale-110 transition-transform" />
            Request Referral
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ReferralDetailModal;