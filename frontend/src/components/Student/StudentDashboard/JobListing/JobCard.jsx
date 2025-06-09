import { useState } from 'react';
import { Link } from 'react-router-dom';

const JobCard = ({ job }) => {
  const [isSaved, setIsSaved] = useState(job.isSaved || false);
  
  const toggleSave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsSaved(!isSaved);
    // Here you would also call your API to save/unsave the job
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-5">
        <div className="flex justify-between">
          <div className="flex-grow">
            <Link to={`/student-dashboard/job-listing/${job._id}`} className="block">
              <h3 className="text-lg font-semibold text-gray-800 hover:text-blue-600 transition-colors mb-1">
                {job.title}
              </h3>
            </Link>
            <div className="flex flex-wrap text-sm text-gray-600 mb-2">
              <span className="mr-3">{job.location}</span>
              <span className="mr-3">•</span>
              <span className="mr-3">{job.jobType}</span>
              <span className="mr-3">•</span>
              <span>{job.workMode}</span>
            </div>
          </div>
          <button 
            onClick={toggleSave} 
            className="text-gray-400 hover:text-blue-500 focus:outline-none"
            aria-label={isSaved ? "Unsave job" : "Save job"}
          >
            {isSaved ? (
              <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
            )}
          </button>
        </div>
        
        <p className="text-gray-600 mb-4 line-clamp-3">
          {job.description}
        </p>
        
        <Link 
          to={`student-dashboard/job-listing/${job._id}`} 
          className="block w-full py-2 text-center text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50 transition-colors"
        >
          Apply now
        </Link>
      </div>
    </div>
  );
};

export default JobCard;