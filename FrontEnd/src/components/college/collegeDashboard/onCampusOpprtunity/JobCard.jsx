// import React from 'react';
// import { Link } from 'react-router-dom';
// import PropTypes from 'prop-types';

// const JobCard = ({ job }) => {
//   const companyName = job.companyPosted?.companyDetails?.companyName || 'Company';
//   const logo = job.companyPosted?.profileImageUrl || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQeRfV9n69zxuV4DQX7sYF7ql8ajx47wLioPeP-m4qFbHLkD9UNwfQSneRtkQEDnx-QxFs&usqp=CAU';

//   const getJobStatus = () => {
//     const now = new Date();
//     const startDate = new Date(job.startDate);
//     const endDate = new Date(job.endDate);

//     if (now < startDate) {
//       return { status: 'Pending', color: 'bg-yellow-400' };
//     } else if (now >= startDate && now <= endDate) {
//       return { status: 'Open', color: 'bg-green-500' };
//     } else {
//       return { status: 'Closed', color: 'bg-red-500' };
//     }
//   };

//   const jobStatus = getJobStatus();

//   return (
//     <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-lg hover:-translate-y-1">
//       <div className="relative h-40 bg-gray-200">
//         <img
//           src={logo}
//           alt={`${companyName} logo`}
//           className="w-full h-full object-cover"
//         />
//         {/* Job Status Badge */}
//         <div className={`absolute top-2 right-2 px-3 py-1 text-xs font-bold text-white rounded-full ${jobStatus.color}`}>
//           {jobStatus.status}
//         </div>
//       </div>
//       <div className="p-4">
//         <div className="text-center mb-4">
//           <h3 className="text-lg font-semibold text-gray-900">{companyName}</h3>
//           <p className="text-sm text-gray-600">
//             {job?.degree?.map((degree, index) => (
//               <span key={index}>
//                 {degree}
//                 {index < job.degree.length - 1 ? ', ' : ''}
//               </span>
//             ))}
//           </p>
//         </div>
//         <div className='flex m-2 gap-2 flex-wrap text-center mb-4 text-sm'>
//           {job?.tags?.map((tag, i) => (
//             <span className='bg-gray-300 p-1 rounded' key={i}>{tag}</span>
//           ))}
//         </div>
//         <Link
//           to={`/college-dashboard/On-campus/${job._id}`}
//           className="block w-full py-2 px-4 text-center text-gray-700 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
//         >
//           View Details
//         </Link>
//       </div>
//     </div>
//   );
// };

// JobCard.propTypes = {
//   job: PropTypes.shape({
//     _id: PropTypes.string.isRequired,
//     companyPosted: PropTypes.shape({
//       companyDetails: PropTypes.shape({
//         companyName: PropTypes.string
//       }),
//       profileImageUrl: PropTypes.string
//     }),
//     degree: PropTypes.arrayOf(PropTypes.string).isRequired,
//     startDate: PropTypes.string.isRequired,
//     endDate: PropTypes.string.isRequired
//   }).isRequired
// };

// export default JobCard;



import React, { useState } from 'react';
import { MapPin, Heart } from 'lucide-react';
import { SaveOppurtunity } from '@/lib/Company_AxiosInstance';
import toast from 'react-hot-toast';
// import JobDetailModal from './OnCampusDetailModal';

const pastelColors = [
  // Purple/Indigo gradient variants (primary theme colors)
  "bg-gradient-to-r from-[#a5b4fc]/20 to-[#c4b5fd]/20 text-[#5b21b6] border border-[#a5b4fc]/30",
  "bg-gradient-to-r from-[#c4b5fd]/20 to-[#a78bfa]/20 text-[#6d28d9] border border-[#c4b5fd]/30",
  "bg-gradient-to-r from-[#818cf8]/20 to-[#a5b4fc]/20 text-[#4f46e5] border border-[#818cf8]/30",
  
  // Green gradient variants
  "bg-gradient-to-r from-[#bbf7d0]/20 to-[#86efac]/20 text-[#065f46] border border-[#bbf7d0]/30",
  "bg-gradient-to-r from-[#86efac]/20 to-[#4ade80]/20 text-[#047857] border border-[#86efac]/30",
  "bg-gradient-to-r from-[#6ee7b7]/20 to-[#34d399]/20 text-[#059669] border border-[#6ee7b7]/30",
  
  // Pink gradient variants
  "bg-gradient-to-r from-[#fbcfe8]/20 to-[#f9a8d4]/20 text-[#9d174d] border border-[#fbcfe8]/30",
  "bg-gradient-to-r from-[#f9a8d4]/20 to-[#f472b6]/20 text-[#be185d] border border-[#f9a8d4]/30",
  "bg-gradient-to-r from-[#fda4af]/20 to-[#fb7185]/20 text-[#be123c] border border-[#fda4af]/30",
  
  // Yellow/Orange gradient variants
  "bg-gradient-to-r from-[#fde68a]/20 to-[#fcd34d]/20 text-[#92400e] border border-[#fde68a]/30",
  "bg-gradient-to-r from-[#fed7aa]/20 to-[#fdba74]/20 text-[#9a3412] border border-[#fed7aa]/30",
  "bg-gradient-to-r from-[#fdba74]/20 to-[#fb923c]/20 text-[#c2410c] border border-[#fdba74]/30",
  
  // Blue/Cyan gradient variants
  "bg-gradient-to-r from-[#bae6fd]/20 to-[#7dd3fc]/20 text-[#0369a1] border border-[#bae6fd]/30",
  "bg-gradient-to-r from-[#7dd3fc]/20 to-[#38bdf8]/20 text-[#0284c7] border border-[#7dd3fc]/30",
  "bg-gradient-to-r from-[#67e8f9]/20 to-[#22d3ee]/20 text-[#0e7490] border border-[#67e8f9]/30",
  
  // Teal/Emerald gradient variants
  "bg-gradient-to-r from-[#99f6e4]/20 to-[#5eead4]/20 text-[#0f766e] border border-[#99f6e4]/30",
  "bg-gradient-to-r from-[#5eead4]/20 to-[#2dd4bf]/20 text-[#115e59] border border-[#5eead4]/30",
  "bg-gradient-to-r from-[#2dd4bf]/20 to-[#14b8a6]/20 text-[#134e4a] border border-[#2dd4bf]/30",
  
  // Rose/Fuchsia gradient variants
  "bg-gradient-to-r from-[#fecdd3]/20 to-[#fda4af]/20 text-[#9f1239] border border-[#fecdd3]/30",
  "bg-gradient-to-r from-[#fda4af]/20 to-[#fb7185]/20 text-[#be123c] border border-[#fda4af]/30",
  "bg-gradient-to-r from-[#fb7185]/20 to-[#f43f5e]/20 text-[#be123c] border border-[#fb7185]/30",
  
  // Lime/Emerald gradient variants
  "bg-gradient-to-r from-[#d9f99d]/20 to-[#bef264]/20 text-[#3f6212] border border-[#d9f99d]/30",
  "bg-gradient-to-r from-[#bef264]/20 to-[#a3e635]/20 text-[#4d7c0f] border border-[#bef264]/30",
  "bg-gradient-to-r from-[#a3e635]/20 to-[#84cc16]/20 text-[#3f6212] border border-[#a3e635]/30",
  
  // Amber/Warm gradient variants
  "bg-gradient-to-r from-[#fef3c7]/20 to-[#fde68a]/20 text-[#92400e] border border-[#fef3c7]/30",
  "bg-gradient-to-r from-[#fde68a]/20 to-[#fcd34d]/20 text-[#b45309] border border-[#fde68a]/30",
  "bg-gradient-to-r from-[#fcd34d]/20 to-[#fbbf24]/20 text-[#d97706] border border-[#fcd34d]/30",
];

function getStableColor(id = "") {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash + id.charCodeAt(i) * 31) % pastelColors.length;
  }
  return pastelColors[hash];
}

const JobCard = ({ job, onClick, compact = false }) => {
  const [isSaved, setIsSaved] = useState(job.isSaved || false);
  const [imageError, setImageError] = useState(false);

  if (!job) return null;

  const companyName = job.companyPosted?.companyDetails?.companyName || 'Company';
  const logo = job.companyPosted?.profileImageUrl || '';

  const getJobStatus = () => {
    if (!job?.startDate || !job?.endDate) {
      return { status: 'Unknown', color: 'bg-gray-100 text-gray-700' };
    }
    
    const now = new Date();
    const startDate = new Date(job.startDate);
    const endDate = new Date(job.endDate);

    if (now < startDate) {
      return { status: 'Upcoming', color: 'bg-blue-100 text-blue-700' };
    } else if (now >= startDate && now <= endDate) {
      return { status: 'Active', color: 'bg-green-100 text-green-700' };
    } else {
      return { status: 'Completed', color: 'bg-gray-100 text-gray-700' };
    }
  };

  const handleCardClick = (e) => {
    // Don't trigger if clicking on save button or details button
    if (e.target.closest('button')) {
      return;
    }
    
    console.log('Card clicked for:', companyName);
    
    // Use onClick prop if provided
    if (onClick && typeof onClick === 'function') {
      onClick(job);
    }
  };

  const handleDetailsClick = (e) => {
    e.stopPropagation();
    console.log('Details button clicked for:', companyName);
    
    // Use onClick prop if provided
    if (onClick && typeof onClick === 'function') {
      onClick(job);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    e.stopPropagation();
  
    try {
      const response = await SaveOppurtunity(
        job._id,
        job.jobType
      );
  
      if (response?.data?.success === true) {
        setIsSaved(true);
        toast.success("Saved");
      } else {
        toast.error(response?.response?.data?.msg || "Unable to save");
      }
    } catch (error) {
      console.error("Save error:", error);
      toast.error("Something went wrong!");
    }
  };

  const getInitials = (name = '') => {
    if (!name) return '?';
    const words = name.trim().split(' ');
    if (words.length === 1) return words[0][0].toUpperCase();
    return (words[0][0] + words[1][0]).toUpperCase();
  };

  // Format location
  const formatLocation = () => 
    job.workLocation?.slice(0, 2).join(', ') || 'Location not specified';

  // Format package details
  const formatPackage = () => {
    if (job.packageDetails?.totalCTC) {
      return `₹${job.packageDetails.totalCTC.toLocaleString()}`;
    }
    return 'Not Disclosed';
  };

  // Get description text
  const getDescription = () => {
    return job.description || 
           job.jobDescription || 
           job.companyPosted?.companyDetails?.description || 
           'No description provided.';
  };

  const jobStatus = getJobStatus();
  const stableColor = getStableColor(job._id || companyName);
  const description = getDescription();

  return (
    <div 
      onClick={handleCardClick}
      className="
        w-full max-w-[350px] mx-auto rounded-2xl 
        border shadow-sm hover:shadow-lg transition overflow-hidden
        flex flex-col cursor-pointer h-full
      "
    >
      {/* TOP SECTION - Pastel background */}
      <div className={`${stableColor} p-4 flex-1 flex flex-col`}>
        {/* Status + Save */}
        <div className="flex justify-between items-start mb-2">
          <span className={`text-xs ${jobStatus.color} px-3 py-1 rounded-full font-medium`}>
            {jobStatus.status}
          </span>

          <button
            onClick={handleSave}
            className="bg-white p-2 rounded-full shadow hover:shadow-md transition z-10"
          >
            <Heart
              className={`h-5 w-5 ${isSaved ? "text-red-500 fill-red-500" : "text-gray-600"}`}
              fill={isSaved ? "currentColor" : "none"}
            />
          </button>
        </div>

        {/* Company Name + Position */}
        <div className="flex justify-between items-start gap-2 mb-3">
          <div className="flex-1 pr-2">
            <h3 className="text-black font-semibold text-lg truncate mb-4">
              {companyName}
            </h3>

            {/* Job Roles */}
            {job.jobRoles?.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-0">
                {job.jobRoles.slice(0, 3).map((role, index) => {
                  const roleColors = [
                    "bg-gradient-to-r from-blue-100 to-blue-50 text-blue-700",
                    "bg-gradient-to-r from-purple-100 to-purple-50 text-purple-700",
                    "bg-gradient-to-r from-pink-100 to-pink-50 text-pink-700",
                    "bg-gradient-to-r from-green-100 to-green-50 text-green-700",
                    "bg-gradient-to-r from-yellow-100 to-yellow-50 text-yellow-700",
                  ];
                  const colorClass = roleColors[index % roleColors.length];
                  
                  return (
                    <span 
                      key={index} 
                      className={`text-sm font-medium px-2 py-0.5 rounded-full border ${colorClass}`}
                    >
                      {role}
                    </span>
                  );
                })}
                {job.jobRoles.length > 3 && (
                  <span className="text-sm font-medium bg-gradient-to-r from-gray-100 to-gray-50 text-gray-700 px-2 py-0.5 rounded-full border">
                    +{job.jobRoles.length - 3}
                  </span>
                )}
              </div>
            )}
          </div>

          <div className="w-14 h-14 bg-white rounded-full shadow flex items-center justify-center overflow-hidden border shrink-0">
            {logo && !imageError ? (
              <img 
                src={logo} 
                alt={`${companyName} logo`}
                className="w-12 h-12 object-cover"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                <span className="text-sm font-semibold text-gray-700">
                  {getInitials(companyName)}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Employment Type Badge */}
        {job.employmentType && (
          <div className="mb-3">
            <span className="px-3 py-1 bg-blue-100 text-blue-700 border border-blue-300 rounded-full text-xs font-semibold">
              {Array.isArray(job.employmentType) ? job.employmentType.join(', ') : job.employmentType}
            </span>
          </div>
        )}

        {/* Streams */}
        {job.studentStreams?.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {job.studentStreams.slice(0, 3).map((stream, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-blue-100 text-blue-800 border border-blue-300 rounded-full text-xs"
              >
                {stream}
              </span>
            ))}
            {job.studentStreams.length > 3 && (
              <span className="px-2 py-1 text-xs text-gray-600">+{job.studentStreams.length - 3}</span>
            )}
          </div>
        )}

        {/* Hiring Process Steps */}
        {job.selectionProcess && (
          <div className="flex flex-wrap gap-2 mb-3">
            {(() => {
              const processes = typeof job.selectionProcess === 'string' 
                ? job.selectionProcess.split(' + ').slice(0, 3)
                : job.selectionProcess.slice(0, 3);
              
              return processes.map((step, index) => (
                <span
                  key={index}
                  className="px-3 py-1 border border-gray-300 text-gray-700 rounded-full text-xs bg-white/50"
                >
                  {step}
                </span>
              ));
            })()}
          </div>
        )}

        {/* Tags */}
        {job.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {job.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-gray-100 text-gray-800 border border-gray-300 rounded-full text-xs"
              >
                {tag}
              </span>
            ))}
            {job.tags.length > 3 && (
              <span className="px-2 py-1 text-xs text-gray-600">+{job.tags.length - 3}</span>
            )}
          </div>
        )}

        {/* Description */}
        <div className="flex-1">
          <p className="text-sm text-gray-700 line-clamp-2">
            {description}
          </p>
        </div>
      </div>

      {/* BOTTOM SECTION - White background */}
      <div className="p-4 bg-white border-t">
        <div className="flex justify-between items-center">
          <div>
            {/* Package */}
            <p className="font-semibold text-gray-900 text-sm">
              {formatPackage()}
            </p>

            {/* Location */}
            <div className="flex items-center gap-1 text-gray-700 text-xs mt-1">
              <MapPin className="h-4 w-4 text-gray-500" />
              <span className="line-clamp-1 max-w-[120px]">
                {formatLocation()}
              </span>
            </div>
          </div>

          <button
            onClick={handleDetailsClick}
            className="px-4 py-2 bg-black text-white rounded-xl text-sm font-medium hover:bg-gray-800 transition"
          >
            Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobCard;