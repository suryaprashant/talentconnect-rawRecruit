import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

// const JobCard = ({ job }) => {
//   return (
//     <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-lg hover:-translate-y-1">
//       <div className="relative h-40 bg-gray-200">
//         <img
//           src={job.companyPosted?.profileImage || '/default-company-logo.png'}
//           alt={`${job.companyPosted?.profileImage} logo`}
//           className="w-full h-full object-cover"
//         />
//       </div>
//       <div className="p-4">
//         <div className="text-center mb-4">
//           <h3 className="text-lg font-semibold text-gray-900">{job?.degree?.map((jb)=>(<span>{jb}</span>))}</h3>
//           <p className="text-sm text-gray-600">{job.university}</p>
//         </div>
//         <Link 
//           to={`/college-dashboard/on-campus-opportunities/${job._id}`}
//           className="block w-full py-2 px-4 text-center text-gray-700 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
//         >
//           Contact
//         </Link>
//       </div>
//     </div>
//   );
// };

// JobCard.propTypes = {
//   job: PropTypes.shape({
//     id: PropTypes.string.isRequired,
//     logo: PropTypes.string.isRequired,
//     company: PropTypes.string.isRequired,
//     degree: PropTypes.string.isRequired,
//     university: PropTypes.string.isRequired
//   }).isRequired
// };

// export default JobCard;

const JobCard = ({ job }) => {
  // Safely extract company data with proper fallbacks
  const companyName = job.companyPosted?.companyDetails?.companyName || 'Company';
  const logo = job.companyPosted?.profileImageUrl || '/default-company.png';

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-lg hover:-translate-y-1">
      <div className="relative h-40 bg-gray-200">
        <img
          src={logo}
          alt={`${companyName} logo`}
          className="w-full h-full object-cover"
          // onError={(e) => {
          //   e.target.src = '/default-company.png'; // Fallback if image fails to load
          // }}
        />
      </div>
      <div className="p-4">
        <div className="text-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">{companyName}</h3>
          <p className="text-sm text-gray-600">
            {job?.degree?.map((degree, index) => (
              <span key={index}>
                {degree}
                {index < job.degree.length - 1 ? ', ' : ''}
              </span>
            ))}
          </p>
        </div>
        <Link 
          to={`/college-dashboard/on-campus-opportunities/${job._id}`}
          className="block w-full py-2 px-4 text-center text-gray-700 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
        >
          Contact
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
    degree: PropTypes.arrayOf(PropTypes.string).isRequired
  }).isRequired
};

export default JobCard;