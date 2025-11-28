import React from "react";
import { Link } from "react-router-dom";

const HackathonCard = ({ hackathon }) => {

  function getTimeDifference(createdAt) {
    const now = new Date();
    const createdDate = new Date(createdAt);
    const diffInMs = now - createdDate;

    const seconds = Math.floor(diffInMs / 1000);
    const minutes = Math.floor(diffInMs / (1000 * 60));
    const hours = Math.floor(diffInMs / (1000 * 60 * 60));
    const days = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (seconds < 60) return `${seconds}s ago`;
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  }

  return (
    <Link
      to={`/${localStorage.getItem("selectedRole")}-dashboard/hackathon/${hackathon._id}`}
      className="block border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all bg-white"
    >
      <div className="flex gap-4">
        {/* Banner Image */}
        <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
          <img src={hackathon.bannerImage} className="w-full h-full object-cover" alt="" />
        </div>

        <div className="flex flex-col flex-grow">
          {/* Top Row */}
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center text-xs text-gray-500 mb-1">
                <span>{new Date(hackathon.startDate).toLocaleDateString()}</span>
                <span className="mx-2">•</span>
                <span>Cash & Swags</span>
                <span className="mx-2">•</span>
                <span>{hackathon.registeredUsers} Registered</span>
              </div>

              <h3 className="font-semibold text-lg">{hackathon.title}</h3>
            </div>

            {/* Time Ago */}
            <div className="flex items-center text-xs text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {getTimeDifference(hackathon.createdAt)}
            </div>
          </div>

          {/* Description */}
          <p className="text-sm text-gray-600 mt-1 line-clamp-2">
            {hackathon.description}
          </p>

          {/* Tech Stack Tags (PASTEL COLORS) */}
          <div className="flex flex-wrap gap-2 mt-3">
            {hackathon.technologies?.map((tech, i) => (
              <span
                key={i}
                className="px-3 py-1 rounded-md text-xs font-medium"
                style={{
                  background: "#FCE7F3", // pastel pink (change for variety)
                }}
              >
                {tech}
              </span>
            ))}
          </div>

          {/* LOCATION + MODE (Black and white, icon style) */}
          <div className="flex gap-6 mt-3 text-sm text-gray-700">
            {/* Location */}
            <div className="flex items-center gap-1">
              <span className="text-black text-lg">📍</span>
              <span>{hackathon.location || "Online"}</span>
            </div>

            {/* Mode */}
            <div className="flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
              </svg>
              <span>{hackathon.mode || "Virtual"}</span>
            </div>
          </div>

          {/* Apply Now Button */}
          <button className="mt-4 bg-black text-white px-4 py-2 rounded-md text-sm font-medium w-fit">
            Apply Now
          </button>
        </div>
      </div>
    </Link>
  );
};

export default HackathonCard;