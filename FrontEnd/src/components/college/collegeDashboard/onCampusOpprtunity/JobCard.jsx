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



import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Building, User, Banknote, Monitor, Home, Building2 } from 'lucide-react';
import PropTypes from 'prop-types';

const JobCard = ({ job }) => {
  const companyName = job.companyPosted?.companyDetails?.companyName || 'Company';
  const logo = job.companyPosted?.profileImageUrl || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQeRfV9n69zxuV4DQX7sYF7ql8ajx47wLioPeP-m4qFbHLkD9UNwfQSneRtkQEDnx-QxFs&usqp=CAU';

  // Get job status based on dates
  const getJobStatus = () => {
    const now = new Date();
    const startDate = new Date(job.startDate);
    const endDate = new Date(job.endDate);

    if (now < startDate) {
      return { status: 'Pending', color: 'bg-yellow-400' };
    } else if (now >= startDate && now <= endDate) {
      return { status: 'Open', color: 'bg-green-500' };
    } else {
      return { status: 'Closed', color: 'bg-red-500' };
    }
  };

  const jobStatus = getJobStatus();

  // Format package details
  const formatPackage = () => {
    if (job.packageDetails?.totalCTC) {
      const currency = job.packageDetails.currency || 'INR';
      const amount = job.packageDetails.totalCTC.toLocaleString();
      return `${currency === 'INR' ? '₹' : currency} ${amount}`;
    }
    return 'Not specified';
  };

  // Format location
  const formatLocation = () => {
    if (job.workLocation && job.workLocation.length > 0) {
      return job.workLocation.join(', ');
    }
    return 'Not specified';
  };

  // Format job roles
  const formatJobRoles = () => {
    if (job.jobRoles && job.jobRoles.length > 0) {
      return job.jobRoles.join(', ');
    }
    return 'Not specified';
  };

  // Format streams
  const formatStreams = () => {
    if (job.studentStreams && job.studentStreams.length > 0) {
      return job.studentStreams;
    }
    return ['Not specified'];
  };

  // Format selection process
  const formatSelectionProcess = () => {
    if (job.selectionProcess && job.selectionProcess.length > 0) {
      if (typeof job.selectionProcess === 'string') {
        return job.selectionProcess.split(' + ');
      }
      return job.selectionProcess;
    }
    return ['Not specified'];
  };

  // Get work mode details with safe type checking
  const getWorkModeDetails = () => {
    // Safely handle workMode - check if it exists and is a string
    const workMode = job.workMode && typeof job.workMode === 'string' 
      ? job.workMode.toLowerCase() 
      : 'not specified';
    
    switch (workMode) {
      case 'remote':
        return {
          label: 'Remote',
          icon: Home,
          color: 'bg-blue-50 border-blue-200',
          textColor: 'text-blue-700',
          iconColor: 'text-blue-500'
        };
      case 'hybrid':
        return {
          label: 'Hybrid',
          icon: Monitor,
          color: 'bg-purple-50 border-purple-200',
          textColor: 'text-purple-700',
          iconColor: 'text-purple-500'
        };
      case 'onsite':
      case 'on-site':
        return {
          label: 'On-Site',
          icon: Building2,
          color: 'bg-green-50 border-green-200',
          textColor: 'text-green-700',
          iconColor: 'text-green-500'
        };
      case 'office':
        return {
          label: 'Office',
          icon: Building,
          color: 'bg-orange-50 border-orange-200',
          textColor: 'text-orange-700',
          iconColor: 'text-orange-500'
        };
      default:
        return {
          label: workMode === 'not specified' ? 'Not specified' : 
                 workMode.charAt(0).toUpperCase() + workMode.slice(1),
          icon: Building,
          color: 'bg-gray-50 border-gray-200',
          textColor: 'text-gray-700',
          iconColor: 'text-gray-500'
        };
    }
  };

  const workModeDetails = getWorkModeDetails();
  const WorkModeIcon = workModeDetails.icon;

  // Check if work mode should be displayed
  const shouldDisplayWorkMode = job.workMode && 
                               job.workMode !== 'Not specified' && 
                               job.workMode !== 'not specified' &&
                               workModeDetails.label !== 'Not specified';

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition duration-200">
      <div className="p-6">
        {/* Company Header */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gray-200 rounded-md flex items-center justify-center overflow-hidden">
              <img
                src={logo}
                alt={`${companyName} logo`}
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.target.src = "https://via.placeholder.com/48";
                }}
              />
            </div>
            <div className="ml-3">
              <h3 className="font-semibold text-gray-900">{companyName}</h3>
            </div>
          </div>
          <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-white mt-1 ${jobStatus.color}`}>
            {jobStatus.status}
          </div>
        </div>

        {/* Streams */}
        <div className="flex flex-wrap gap-2 mb-3">
          {formatStreams().map((stream, index) => (
            <span key={index} className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
              {stream}
            </span>
          ))}
        </div>

        {/* Position */}
        <div className="mb-3">
          <div className="flex items-center">
            <User className="h-4 w-4 text-gray-500 mr-2 flex-shrink-0" />
            <p className="text-sm font-medium text-gray-800">
              {formatJobRoles()}
            </p>
          </div>
        </div>

        {/* Location and Work Mode Row */}
        <div className="flex flex-wrap gap-4 mb-3">
          {/* Location */}
          <div className="flex items-center">
            <MapPin className="h-4 w-4 text-gray-500 mr-2 flex-shrink-0" />
            <p className="text-sm text-gray-700">
              {formatLocation()}
            </p>
          </div>

          {/* Work Mode */}
          {shouldDisplayWorkMode && (
            <div className={`flex items-center px-3 py-1 rounded-full border ${workModeDetails.color}`}>
              <WorkModeIcon className={`h-3 w-3 mr-1 ${workModeDetails.iconColor}`} />
              <span className={`text-xs font-medium ${workModeDetails.textColor}`}>
                {workModeDetails.label}
              </span>
            </div>
          )}
        </div>

        {/* Package */}
        <div className="mb-4">
          <div className="flex items-center">
            <Banknote className="h-4 w-4 text-gray-500 mr-2 flex-shrink-0" />
            <p className="text-sm text-gray-700">
              {formatPackage()}
            </p>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
          {job.description || 'No description provided.'}
        </p>

        {/* Hiring Process */}
        <div className="flex flex-wrap gap-2 mb-4">
          <div className="bg-yellow-50 border border-yellow-100 rounded-md px-3 py-1">
            <p className="text-xs font-medium text-yellow-800">Hiring Process</p>
          </div>
          {formatSelectionProcess().map((step, index) => (
            <React.Fragment key={index}>
              <div className="bg-gray-50 border border-gray-100 rounded-md px-3 py-1">
                <p className="text-xs text-gray-700">{step}</p>
              </div>
              {index < formatSelectionProcess().length - 1 && (
                <span className="text-gray-400">→</span>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Tags */}
        {job?.tags && job.tags.length > 0 && (
          <div className='flex flex-wrap gap-2 mb-4'>
            {job.tags.map((tag, i) => (
              <span className='bg-gray-200 px-2 py-1 rounded-full text-gray-700 text-xs' key={i}>
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Register Button */}
        <Link to={`/college-dashboard/On-campus/${job._id}`} className="block w-full">
          <button className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800 transition duration-200">
            View Details
          </button>
        </Link>
      </div>
    </div>
  );
};

JobCard.propTypes = {
  job: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    companyPosted: PropTypes.shape({
      companyDetails: PropTypes.shape({
        companyName: PropTypes.string
      }),
      profileImageUrl: PropTypes.string
    }),
    studentStreams: PropTypes.arrayOf(PropTypes.string),
    jobRoles: PropTypes.arrayOf(PropTypes.string),
    workLocation: PropTypes.arrayOf(PropTypes.string),
    packageDetails: PropTypes.shape({
      totalCTC: PropTypes.number,
      currency: PropTypes.string
    }),
    workMode: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number, // In case it's a number for some reason
      PropTypes.bool    // In case it's a boolean
    ]),
    description: PropTypes.string,
    selectionProcess: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.arrayOf(PropTypes.string)
    ]),
    tags: PropTypes.arrayOf(PropTypes.string),
    startDate: PropTypes.string.isRequired,
    endDate: PropTypes.string.isRequired
  }).isRequired
};

export default JobCard;