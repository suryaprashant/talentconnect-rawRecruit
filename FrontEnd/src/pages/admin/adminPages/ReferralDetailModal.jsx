import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { 
  X, MapPin, Briefcase, ShieldCheck, 
  GraduationCap, Share2, CheckCircle2, 
  Building2, Mail, Linkedin, UserCircle,
  Clock, Laptop, Award, Users, Calendar,
  Target, Info, XCircle, Loader2
} from 'lucide-react';
import { updateReferralStatus } from '@/lib/Admin_AxiosInstance';
import ReferrerDetailModal from './ReferrerDetailModal';

const ReferralDetailModal = ({ job, isOpen, onClose, onRefresh }) => {
  // --- 1. HOOKS (Must always be at the top) ---
  const modalContentRef = useRef(null);
  const [loadingAction, setLoadingAction] = useState(null);
  const [isReferrerModalOpen, setIsReferrerModalOpen] = useState(false);
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  // --- 2. EARLY RETURN (Only after hooks are declared) ---
  if (!isOpen || !job) return null;

  // --- 3. EVENT HANDLERS ---
  const handleStatusUpdate = async (status) => {
    setLoadingAction(status); // Start spinner on the clicked button
    try {
      // Ensure job._id exists and status is exactly what the backend expects
      const response = await updateReferralStatus(job._id, status);
      
      if (response.data.success) {
        alert(`Job ${status} successfully!`);
        onClose(); // Close the modal
        if (onRefresh) onRefresh(); // Refresh the list on the dashboard
      }
    } catch (error) {
      console.error("Update error:", error);
      alert(error.response?.data?.message || `Failed to update status to ${status}`);
    } finally {
      setLoadingAction(null); // Stop spinner
    }
  };

  // --- 4. DATA MAPPING ---
  const referrer = job?.candidatePosted || {};
  const location = job?.location?.[0] || "Remote";
  const workMode = job?.workMode?.[0] || "On-site";
  const experience = job?.yearsOfExperience || "0-1 Years";
  const openings = job?.numberOfOpenings || 0;
  
  const expiryDate = job?.expireAt ? new Date(job.expireAt) : null;
  const daysLeft = expiryDate ? Math.ceil((expiryDate - new Date()) / (1000 * 60 * 60 * 24)) : null;

  const ctc = job?.packageDetails?.totalCTC 
    ? `${job.packageDetails.currency === 'INR' ? '₹' : '$'}${job.packageDetails.totalCTC.toLocaleString()}`
    : "Not Disclosed";

  return createPortal(
    <div 
      className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6" 
      onClick={(e) => modalContentRef.current && !modalContentRef.current.contains(e.target) && onClose()}
    >
      <div className="absolute inset-0 bg-slate-600/20 backdrop-blur-[2px] transition-opacity" />

      <div 
        ref={modalContentRef} 
        className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200"
      >
        
        {/* Header */}
        <div className="border-b border-slate-100 p-5 sm:p-6 bg-white">
          <div className="flex justify-between items-start gap-4">
            <div className="flex gap-4 items-center min-w-0">
              <div className="w-12 h-12 bg-indigo-50 border border-indigo-100 rounded-lg flex items-center justify-center shrink-0">
                <Building2 className="h-6 w-6 text-indigo-600" />
              </div>
              <div className="min-w-0">
                <h1 className="text-lg font-bold text-slate-900 truncate leading-tight">{job?.jobTitle}</h1>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-slate-500 text-xs font-medium">
                  <span className="flex items-center gap-1"><MapPin size={14} className="text-slate-400"/> {location}</span>
                  <span className="text-slate-300">•</span>
                  <span className="flex items-center gap-1"><Laptop size={14} className="text-slate-400"/> {workMode}</span>
                  <span className="text-slate-300">•</span>
                  <span className="text-indigo-600 font-semibold">{job?.jobType}</span>
                </div>
              </div>
            </div>
            <div className="flex gap-1 shrink-0">
              <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-md transition-colors"><Share2 size={18} /></button>
              <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-md transition-colors"><X size={18} /></button>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 custom-scrollbar space-y-8">
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <MetricBox label="Experience" value={experience} icon={<Briefcase size={12}/>} />
            <MetricBox label="Openings" value={openings} icon={<Users size={12}/>} />
            <MetricBox label="Employment" value={job?.employmentType?.[0]} icon={<Clock size={12}/>} />
            <MetricBox label="Work Mode" value={workMode} icon={<Laptop size={12}/>} />
            <div className="bg-indigo-600 rounded-lg p-3 ">
              <p className="text-[10px] font-medium  uppercase text-white tracking-wider">Package</p>
              <p className="text-sm text-white font-bold truncate">{ctc}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <section>
                <SectionTitle title="Description" icon={<Info size={14}/>} />
                <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">
                  {job?.description}
                </p>
              </section>

              <section>
                <SectionTitle title="Eligibility & Streams" icon={<GraduationCap size={14}/>} />
                <p className="text-sm text-slate-600 mb-3">{job?.eligibilityCriteria}</p>
                <div className="flex flex-wrap gap-1.5">
                  {job?.studentStreams?.map(s => (
                    <span key={s} className="px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-100 rounded text-[11px] font-semibold">{s}</span>
                  ))}
                </div>
              </section>

              <section>
                <SectionTitle title="Required Skills" icon={<Target size={14}/>} />
                <div className="flex flex-wrap gap-1.5">
                  {job?.skills?.length > 0 ? job.skills.map(s => (
                    <span key={s} className="px-2 py-0.5 bg-slate-100 text-slate-600 border border-slate-200 rounded text-[11px] font-semibold">{s}</span>
                  )) : <span className="text-xs text-slate-400 italic">No specific skills listed</span>}
                </div>
              </section>
            </div>

            <div className="space-y-8">
              <section className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                <SectionTitle title="Additional Info" icon={<Award size={14}/>} />
                <div className="space-y-4">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">Certifications</p>
                    {job?.certifications?.length > 0 ? job.certifications.map(c => (
                      <div key={c} className="flex items-center gap-2 text-xs text-slate-600 mb-1">
                        <div className="w-1 h-1 bg-indigo-400 rounded-full" /> {c}
                      </div>
                    )) : <p className="text-xs text-slate-400 italic">None required</p>}
                  </div>
                  <div className="pt-2 border-t border-slate-200">
                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Deadline</p>
                    <div className="flex items-center gap-2 text-xs font-semibold text-orange-600">
                      <Calendar size={14} /> {daysLeft !== null ? `Expires in ${daysLeft} days` : 'No date set'}
                    </div>
                  </div>
                </div>
              </section>
               {console.log(referrer)}
              <section
                className="cursor-pointer hover:bg-slate-50 p-2 rounded-lg transition"
                onClick={() => setIsReferrerModalOpen(true)}
              >
                <SectionTitle title="Referrer" icon={<UserCircle size={14}/>} />
                <div className="flex items-center gap-3 mt-3">
                  <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 overflow-hidden shrink-0">
                    {referrer.profileImageUrl ? <img src={referrer.profileImageUrl} className="w-full h-full object-cover" /> : <UserCircle className="w-full h-full text-slate-300" />}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-slate-900 truncate leading-none">{referrer.name || 'Anonymous'}</p>
                    <p className="text-xs text-slate-500 truncate mt-1">{referrer.currentCompany || "N/A"}</p>
                  </div>
                </div>
                <div className="flex gap-3 mt-4">
                  {referrer.linkedin && (
                    <a href={referrer.linkedin} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-indigo-600"><Linkedin size={16} /></a>
                  )}
                  <a href={`mailto:${referrer.email}`} className="text-slate-400 hover:text-indigo-600"><Mail size={16} /></a>
                  <div className="ml-auto flex items-center gap-1 text-[10px] font-bold text-green-600 uppercase">
                    <ShieldCheck size={12} /> Verified
                  </div>
                </div>
                <p className="text-[10px] text-slate-400 mt-1">
                  Click to view full profile
                </p>
              </section>
            </div>
          </div>
        </div>

        {/* Footer Action */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-100 flex gap-4 justify-end">
          <button 
            disabled={loadingAction !== null}
            onClick={() => handleStatusUpdate('Rejected')}
            className="flex-1 sm:flex-none px-10 py-2.5 bg-white border border-red-200 text-red-600 hover:bg-red-50 text-sm font-bold rounded-lg flex items-center justify-center gap-2 disabled:opacity-50 transition-all"
          >
            {loadingAction === 'Rejected' ? <Loader2 size={16} className="animate-spin" /> : <XCircle size={16} />}
            Reject
          </button>
          
          <button 
            disabled={loadingAction !== null}
            onClick={() => handleStatusUpdate('Approved')}
            className="flex-1 sm:flex-none px-10 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-lg shadow-md flex items-center justify-center gap-2 disabled:opacity-50 transition-all"
          >
            {loadingAction === 'Approved' ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle2 size={16} />}
            Approve
          </button>
        </div>
      </div>
      <ReferrerDetailModal
        referrer={referrer}
        isOpen={isReferrerModalOpen}
        onClose={() => setIsReferrerModalOpen(false)}
      />
    </div>,
    document.body
  );
};

// Sub-components
const MetricBox = ({ label, value, icon }) => (
  <div className="bg-white border border-slate-100 rounded-lg p-3">
    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight flex items-center gap-1 mb-1">
      {icon} {label}
    </p>
    <p className="text-xs font-bold text-slate-700 truncate">{value || 'N/A'}</p>
  </div>
);

const SectionTitle = ({ title, icon }) => (
  <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 mb-3">
    <span className="text-indigo-500">{icon}</span> {title}
  </h3>
);

export default ReferralDetailModal;