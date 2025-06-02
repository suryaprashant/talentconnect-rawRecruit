import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Building, User, Banknote } from 'lucide-react';

const JobCard = ({ job }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition duration-200">
      <div className="p-6">
        {/* Company Header */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gray-200 rounded-md flex items-center justify-center">
              <img
                src={job.logo || "https://via.placeholder.com/48"}
                alt={`${job.companyName} logo`}
                className="w-8 h-8 object-contain"
                onError={(e) => {
                  e.target.src = "https://via.placeholder.com/48";
                }}
              />
            </div>
            <div className="ml-3">
              <h3 className="font-semibold text-gray-900">{job.companyName}</h3>
            </div>
          </div>
          <div className="bg-gray-100 px-3 py-1 rounded-full text-xs font-medium text-gray-800">
            {job.isOnsite ? 'On-site' : 'Remote'}
          </div>
        </div>
        
        {/* Venue */}
        <div className="mb-3">
          <div className="flex items-start mb-1">
            <MapPin className="h-4 w-4 text-gray-500 mt-0.5 mr-2 flex-shrink-0" />
            <div>
              <p className="text-sm text-gray-500 font-medium">Venue</p>
              <p className="text-sm text-gray-800">{job.venue}</p>
            </div>
          </div>
        </div>
        
        {/* Streams */}
        <div className="flex flex-wrap gap-2 mb-3">
          {job.streams.map((stream, index) => (
            <span key={index} className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
              {stream}
            </span>
          ))}
        </div>
        
        {/* Position */}
        <div className="mb-3">
          <div className="flex items-center">
            <User className="h-4 w-4 text-gray-500 mr-2 flex-shrink-0" />
            <p className="text-sm font-medium text-gray-800">{job.position}</p>
          </div>
        </div>
        
        {/* Location */}
        <div className="mb-3">
          <div className="flex items-center">
            <Building className="h-4 w-4 text-gray-500 mr-2 flex-shrink-0" />
            <p className="text-sm text-gray-700">{job.location}</p>
          </div>
        </div>
        
        {/* Package */}
        <div className="mb-4">
          <div className="flex items-center">
            <Banknote className="h-4 w-4 text-gray-500 mr-2 flex-shrink-0" />
            <p className="text-sm text-gray-700">₹ {job.package}</p>
          </div>
        </div>
        
        {/* Description */}
        <p className="text-sm text-gray-600 mb-4">
          {job.description}
        </p>
        
        {/* Hiring Process */}
        <div className="flex flex-wrap gap-2 mb-4">
          <div className="bg-yellow-50 border border-yellow-100 rounded-md px-3 py-1">
            <p className="text-xs font-medium text-yellow-800">Hiring Process</p>
          </div>
          {job.hiringProcess.map((step, index) => (
            <React.Fragment key={index}>
              <div className="bg-gray-50 border border-gray-100 rounded-md px-3 py-1">
                <p className="text-xs text-gray-700">{step}</p>
              </div>
              {index < job.hiringProcess.length - 1 && (
                <span className="text-gray-400">→</span>
              )}
            </React.Fragment>
          ))}
        </div>
        
        {/* Register Button */}
        <Link to={`/college-dashboard/pool-campus-opportunities/${job.id}`} className="block w-full">
          <button className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800 transition duration-200">
            Register Now
          </button>
        </Link>
      </div>
    </div>
  );
};

export default JobCard;