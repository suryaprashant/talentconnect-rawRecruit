import { useState } from "react";
import { Link } from "react-router-dom";
import { Heart } from 'lucide-react';
import { UnsaveOppurtunity } from '@/lib/Company_AxiosInstance';
import toast from 'react-hot-toast';

const JobList = ({ jobs }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("date");

  const selectedRole = localStorage.getItem("selectedRole");
  const isCompany = selectedRole === "company" || selectedRole === "employer";


  // Function to get initials from name
  const getInitials = (name) => {
    if (!name) return "?";
    
    // Remove extra spaces and split by spaces
    const words = name.trim().split(/\s+/);
    
    if (words.length === 1) {
      // Single word - take first 2 characters
      return name.substring(0, 2).toUpperCase();
    } else {
      // Multiple words - take first letter of first two words
      return (words[0].charAt(0) + words[1].charAt(0)).toUpperCase();
    }
  };

  // Function to get logo URL or initials
  const getLogoOrInitials = (job) => {
    if (isCompany) {
      // For college
      const logoUrl = job?.job?.collegePosted?.collegeUniversityDetails?.logo;
      const collegeName = job?.job?.collegePosted?.collegeUniversityDetails?.collegeName;
      
      if (logoUrl) {
        return (
          <img 
            src={logoUrl} 
            alt={collegeName || "College"} 
            className="w-10 h-10 rounded-lg object-cover"
            onError={(e) => {
              // If image fails to load, show initials
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
        );
      }
      
      // Show initials if no logo
      return (
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#667eea] to-[#764ba2] flex items-center justify-center text-white font-bold text-sm">
          {getInitials(collegeName)}
        </div>
      );
    } else {
      // For student (viewing company)
      const logoUrl = job?.job?.companyPosted?.companyDetails?.logo;
      const companyName = job?.job?.companyPosted?.companyDetails?.companyName;
      
      if (logoUrl) {
        return (
          <img 
            src={logoUrl} 
            alt={companyName || "Company"} 
            className="w-10 h-10 rounded-lg object-cover"
            onError={(e) => {
              // If image fails to load, show initials
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
        );
      }
      
      // Show initials if no logo
      return (
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#667eea] to-[#764ba2] flex items-center justify-center text-white font-bold text-sm">
          {getInitials(companyName)}
        </div>
      );
    }
  };

  const filteredJobs =
  jobs?.filter((job) => {
    const name = isCompany
      ? job?.job?.collegePosted?.collegeUniversityDetails?.collegeName
      : job?.job?.companyPosted?.companyDetails?.companyName;

    const role = job?.job?.jobRoles?.[0];

    // ✅ if name is missing (employer case), do NOT filter it out
    if (!name && !role) return true;

    return (
      name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      role?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }) || [];

  const sortedJobs = [...filteredJobs].sort((a, b) => {
    if (sortBy === "date") {
      return new Date(b?.createdAt) - new Date(a?.createdAt);
    }
    return 0;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#667eea]/10 via-[#f093fb]/5 to-[#764ba2]/10">
      <div className="container mx-auto px-4 py-8 pt-22">

        {/* Header */}
        <div className="bg-white/90 backdrop-blur-sm border border-gray-100 rounded-2xl shadow-lg p-6 mb-6">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent">
            Saved Opportunities
          </h1>
          <p className="text-gray-600 mt-2">Browse your saved opportunities</p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {sortedJobs.length > 0 ? (
            sortedJobs.map((job) => {
              const titleName = isCompany
                ? job?.job?.collegePosted?.collegeUniversityDetails?.collegeName
                : job?.job?.companyPosted?.companyDetails?.companyName;

              const locationText = isCompany
                ? job?.job?.venue
                : job?.job?.location?.[0];

              const roles = isCompany ? [] : job?.job?.jobRoles || [];

              return (
                <Link
                  key={job?.job?._id}
                  to={`/${selectedRole}-dashboard/${job?.jobType}/${job?.job?._id}?isSaved=true`}
                  className="group block"
                >
                  
                  <div className="bg-white/90 backdrop-blur-sm border border-gray-100 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden">

                    {/* Header */}
                    <div className="p-6 border-b border-gray-100">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4">
                          {/* Logo or Initials Container */}
                          <div className="relative">
                            {getLogoOrInitials(job)}
                          </div>

                          <div>
                            <h3 className="text-lg font-bold text-gray-900 group-hover:text-[#667eea] transition-colors line-clamp-1">
                              {titleName || "Name"}
                            </h3>

                            <div className="flex items-center text-sm text-gray-600 mt-1">
                              <span className="mr-3 capitalize">{job?.jobType || "Job"}</span>
                              <span className="px-2 py-1 bg-gradient-to-r from-[#667eea]/10 to-[#764ba2]/10 text-[#667eea] rounded-full text-xs font-medium">
                                Saved
                              </span>
                            </div>

                            {!isCompany && roles.length > 0 && (
                              <div className="flex flex-wrap gap-2 mt-3">
                                {roles.slice(0, 3).map((role, index) => (
                                  <span
                                    key={index}
                                    className="px-3 py-1 bg-gradient-to-r from-gray-100 to-white text-gray-700 rounded-full text-xs font-medium"
                                  >
                                    {role}
                                  </span>
                                ))}
                                {roles.length > 3 && (
                                  <span className="px-3 py-1 bg-gradient-to-r from-gray-100 to-white text-gray-700 rounded-full text-xs font-medium">
                                    +{roles.length - 3} more
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        </div>

                       <button
  onClick={async (e) => {
    e.preventDefault(); // Prevent Link navigation
    e.stopPropagation(); // Prevent Link navigation
    
    try {
      const response = await UnsaveOppurtunity(job?.job?._id);
      if (response?.data?.success) {
        toast.success("Opportunity Unsaved");
        // Option 1: Refresh the whole page to update the list
        window.location.reload(); 
        
        // Option 2: If you have a refresh function from props, use it:
        // props.fetchJobs(); 
      } else {
        toast.error("Failed to unsave");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    }
  }}
  className="p-2 bg-red-50 hover:bg-red-100 rounded-lg transition-colors group/heart"
  title="Unsave"
>
  <Heart className="h-5 w-5 text-red-500 fill-red-500 group-hover/heart:fill-none transition-all" />
</button>
                      </div>
                    </div>

                    {/* Body */}
                    <div className="p-6">
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <div className="text-gray-600 mb-1 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                            </svg>
                            Location
                          </div>
                          <div className="font-medium line-clamp-1">
                            {locationText || "Not specified"}
                          </div>
                        </div>

                        <div>
                          <div className="text-gray-600 mb-1 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                            </svg>
                            Start Date
                          </div>
                          <div className="font-medium">
                            {job?.job?.startDate
                              ? new Date(job.job.startDate).toLocaleDateString()
                              : "N/A"}
                          </div>
                        </div>

                        <div>
                          <div className="text-gray-600 mb-1 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                            </svg>
                            End Date
                          </div>
                          <div className="font-medium">
                            {job?.job?.endDate
                              ? new Date(job.job.endDate).toLocaleDateString()
                              : "N/A"}
                          </div>
                        </div>
                      </div>
                    </div>

                  </div>
                </Link>
              );
            })
          ) : (
            <div className="col-span-2 bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-12 text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-gray-100 to-gray-200 mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No Saved Opportunities</h3>
              <p className="text-gray-600">You haven't saved any opportunities yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobList;