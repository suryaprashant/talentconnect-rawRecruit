import React, { useState } from 'react';
import { MapPin, Heart, Building2, Briefcase, Users, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';

// Reusing your pastel color palette for consistency
const pastelColors = [
  "bg-gradient-to-r from-[#a5b4fc]/15 to-[#c4b5fd]/15 text-[#5b21b6] border border-[#a5b4fc]/25",
  "bg-gradient-to-r from-[#c4b5fd]/15 to-[#a78bfa]/15 text-[#6d28d9] border border-[#c4b5fd]/25",
  "bg-gradient-to-r from-[#bbf7d0]/15 to-[#86efac]/15 text-[#047857] border border-[#bbf7d0]/25",
  "bg-gradient-to-r from-[#fbcfe8]/15 to-[#f9a8d4]/15 text-[#9d174d] border border-[#fbcfe8]/25",
  "bg-gradient-to-r from-[#bae6fd]/15 to-[#7dd3fc]/15 text-[#0369a1] border border-[#bae6fd]/25",
  "bg-gradient-to-r from-[#99f6e4]/15 to-[#5eead4]/15 text-[#0f766e] border border-[#99f6e4]/25",
  "bg-gradient-to-r from-[#fef3c7]/15 to-[#fde68a]/15 text-[#92400e] border border-[#fef3c7]/25",
];

function getStableColor(id = "") {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash + id.charCodeAt(i) * 31) % pastelColors.length;
  }
  return pastelColors[hash];
}

const ReferralCard = ({ job, onClick }) => {
 
  const [isSaved, setIsSaved] = useState(false);

  if (!job) return null;

  const referrerName = job.candidatePosted?.name || 'Anonymous';
  const companyName = job.candidatePosted?.currentCompany || 'Verified Company';
  const stableColor = getStableColor(job._id || job.jobTitle);

  const handleSave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsSaved(!isSaved);
    toast.success(isSaved ? "Removed from saved" : "Saved");
  };

const handleDetailsClick = (e) => {
    e.stopPropagation(); // Stops the parent div's onClick from firing twice
    
    if (onClick) onClick(job); // This triggers handleOpenDetails in the parent!
  };

  // Logic for display helpers
  const formatPackage = () => {
    if (job.packageDetails?.totalCTC) {
      const currency = job.packageDetails.currency === 'INR' ? '₹' : '$';
      return `${currency}${job.packageDetails.totalCTC.toLocaleString()}`;
    }
    return 'Not Disclosed';
  };

  return (
    <div 
      onClick={() => onClick && onClick(job)}
      className="w-full max-w-[350px] mx-auto rounded-2xl border shadow-sm hover:shadow-lg transition overflow-hidden flex flex-col cursor-pointer h-full bg-white"
    >
      {/* TOP SECTION - Pastel background */}
      <div className={`${stableColor} p-4 flex-1 flex flex-col`}>
        
        {/* Header: Job Type + Save */}
        <div className="flex justify-between items-start mb-2">
          <span className="text-xs bg-white/60 text-gray-700 px-3 py-1 rounded-full font-semibold border border-white/40">
            {job.jobType}
          </span>

          {/* <button
            onClick={handleSave}
            className="bg-white p-2 rounded-full shadow hover:shadow-md transition z-10"
          >
            <Heart
              className={`h-5 w-5 ${isSaved ? "text-red-500 fill-red-500" : "text-gray-600"}`}
            />
          </button> */}
        </div>

        {/* Job Title + Company */}
        <div className="mb-3">
          <h3 className="text-black font-bold text-lg leading-tight uppercase line-clamp-1">
            {job.jobTitle}
          </h3>
          <div className="flex items-center gap-1 mt-1 text-gray-700">
            <Building2 className="h-3.5 w-3.5" />
            <span className="text-sm font-medium truncate">{companyName}</span>
          </div>
        </div>

        {/* Streams/Categories Badges */}
        {job.studentStreams?.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {job.studentStreams.slice(0, 2).map((stream, index) => (
              <span 
                key={index} 
                className="text-[10px] uppercase tracking-wider font-bold bg-white/40 px-2 py-0.5 rounded border border-white/20"
              >
                {stream}
              </span>
            ))}
          </div>
        )}

        {/* Work Mode & Experience */}
        <div className="space-y-1.5 mb-3">
          <div className="flex items-center gap-2 text-xs text-gray-700">
            <Briefcase className="h-3.5 w-3.5 text-gray-500" />
            <span>{job.employmentType?.[0] || 'Full-time'} • {job.workMode?.[0] || 'On-site'}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-700">
            <Users className="h-3.5 w-3.5 text-gray-500" />
            <span>Referrer: <span className="font-semibold">{referrerName}</span></span>
          </div>
        </div>

        {/* Description Snippet */}
        <div className="flex-1">
          <p className="text-xs text-gray-600 line-clamp-2 italic">
            "{job.description || 'No additional details provided...'}"
          </p>
        </div>
      </div>

      {/* BOTTOM SECTION - White background */}
      <div className="p-4 bg-white border-t">
        <div className="flex justify-between items-center">
          <div>
            <p className="font-bold text-gray-900 text-sm">
              {formatPackage()}
            </p>
            <div className="flex items-center gap-1 text-gray-500 text-[10px] mt-1 uppercase font-semibold">
              <MapPin className="h-3 w-3" />
              <span className="truncate max-w-[100px]">
                {job.location?.[0] || 'Remote'}
              </span>
              <span className="mx-1">•</span>
              <Calendar className="h-3 w-3" />
              <span>{new Date(job.createdAt).toLocaleDateString('en-IN')}</span>
            </div>
          </div>

          <button
            onClick={handleDetailsClick}
            className="px-4 py-2 bg-black text-white rounded-xl text-xs font-bold hover:bg-gray-800 transition uppercase tracking-tighter"
          >
            Review Post
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReferralCard;