import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { MapPin, Building, Calendar, Globe, Mail, Phone, Linkedin, CheckCircle, Info, Download, ExternalLink } from 'lucide-react';
import { ApplyForPoolCampus, SaveOppurtunity, getPoolCampusJobById } from '@/lib/College_AxiosIntance';
import toast from 'react-hot-toast';
import { viewed } from '@/lib/User_AxiosInstance';
import { useAuth } from "@/context/AuthContext";

// Utility function to format date
const formatDate = (dateString) => {
    if (!dateString || dateString === 'Not Specified') return 'Not Specified';
    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) { // Check for invalid date
            return 'Not Specified';
        }
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    } catch (error) {
        console.error("Error formatting date:", error);
        return 'Not Specified';
    }
};

// Split long paragraph into meaningful bullet points
const splitIntoBullets = (text) => {
  if (!text || typeof text !== "string") return [];

  // Split by full stop, comma, newline, or +
  return text
    .split(/[\.\n,+]/)
    .map(s => s.trim())
    .filter(s => s.length > 3);
};

// Normalize selection rounds
const normalizeSelectionProcess = (process) => {
  if (!process) return [];

  // Case 1: already an array of rounds
  if (Array.isArray(process)) {
    if (process.length === 1 && typeof process[0] === "string") {
      return splitIntoBullets(process[0]);
    }
    return process;
  }

  // Case 2: single string
  if (typeof process === "string") {
    return splitIntoBullets(process);
  }

  return [];
};

// Helper function to get company logo
const getCompanyLogo = (jobDetails) => {
  if (!jobDetails) return null;
  
  console.log('🔍 Logo extraction for pool campus:', {
    jobId: jobDetails._id,
    profileImageUrl: jobDetails.companyPosted?.profileImageUrl,
    profileImage: jobDetails.companyPosted?.profileImage,
    companyDetailsLogo: jobDetails.companyPosted?.companyDetails?.companyLogo,
    companyPostedKeys: jobDetails.companyPosted ? Object.keys(jobDetails.companyPosted) : []
  });
  
  // Priority order
  const possiblePaths = [
    jobDetails.companyPosted?.profileImageUrl,    // Correct path after backend fix
    jobDetails.companyPosted?.profileImage,       // Fallback if backend hasn't been updated
    jobDetails.companyPosted?.companyDetails?.companyLogo, // Alternative location
    jobDetails.logo,                               // Direct logo on job
    jobDetails.profileImageUrl                     // Direct profileImageUrl on job
  ];
  
  for (const path of possiblePaths) {
    if (path && typeof path === 'string' && path.trim() !== '') {
      console.log('✅ Selected logo:', path);
      return path;
    }
  }
  
  console.log('❌ No logo found');
  return null;
};

// Company Details Modal Component
const CompanyDetailsModal = ({ company, isOpen, onClose }) => {
  if (!isOpen || !company) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div 
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" 
          onClick={onClose}
        ></div>

        {/* Modal panel */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#143694]/5 to-[#1e4ed8]/5 px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {/* Company Logo with first letter fallback */}
                {/* {company.logo ? (
                  <div className="w-12 h-12 rounded-lg bg-white border-2 border-white shadow-md overflow-hidden">
                    <img 
                      src={company.logo} 
                      alt={`${company.companyName} logo`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextElementSibling.style.display = 'flex';
                      }}
                    />
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#143694] to-[#1e4ed8] hidden items-center justify-center text-white font-bold text-lg">
                      {company.companyName?.charAt(0) || 'C'}
                    </div>
                  </div>
                ) : (
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#143694] to-[#1e4ed8] flex items-center justify-center text-white font-bold text-lg shadow-sm">
                    {company.companyName?.charAt(0) || 'C'}
                  </div>
                )} */}
                <h3 className="text-xl font-bold text-gray-900">
                  {company.companyName || 'Company Details'}
                </h3>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500 focus:outline-none"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="px-6 py-4">
            <div className="space-y-6">
              {/* About Section */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">About</h4>
                <p className="text-gray-700 text-sm leading-relaxed">
                  {company.description || 'No description provided.'}
                </p>
              </div>

              {/* Company Details Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-[#143694]/5 to-[#1e4ed8]/5 p-3 rounded-lg">
                  <div className="text-sm font-medium text-gray-600">Employees</div>
                  <div className="text-lg font-semibold text-gray-900 mt-1">
                    {company.numberOfEmployees || 'N/A'}
                  </div>
                </div>
                <div className="bg-gradient-to-br from-[#143694]/5 to-[#1e4ed8]/5 p-3 rounded-lg">
                  <div className="text-sm font-medium text-gray-600">Industry</div>
                  <div className="text-lg font-semibold text-gray-900 mt-1">
                    {company.industryType || 'N/A'}
                  </div>
                </div>
                <div className="bg-gradient-to-br from-[#143694]/5 to-[#1e4ed8]/5 p-3 rounded-lg">
                  <div className="text-sm font-medium text-gray-600">Country</div>
                  <div className="text-lg font-semibold text-gray-900 mt-1">
                    {company.country || 'N/A'}
                  </div>
                </div>
                <div className="bg-gradient-to-br from-[#143694]/5 to-[#1e4ed8]/5 p-3 rounded-lg">
                  <div className="text-sm font-medium text-gray-600">Type</div>
                  <div className="text-lg font-semibold text-gray-900 mt-1">
                    {company.companyType || 'N/A'}
                  </div>
                </div>
              </div>

              {/* Additional Info */}
              <div className="pt-4 border-t border-gray-200">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Contact Information</h4>
                <div className="space-y-2">
                  {company.contactPerson && (
                    <div className="flex items-center">
                      <svg className="h-5 w-5 text-[#143694] mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span className="text-gray-700 text-sm">{company.contactPerson}</span>
                    </div>
                  )}
                  {company.email && (
                    <div className="flex items-center">
                      <svg className="h-5 w-5 text-[#143694] mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <a href={`mailto:${company.email}`} className="text-gray-700 text-sm hover:text-[#143694]">
                        {company.email}
                      </a>
                    </div>
                  )}
                  {company.phone && (
                    <div className="flex items-center">
                      <svg className="h-5 w-5 text-[#143694] mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <a href={`tel:${company.phone}`} className="text-gray-700 text-sm hover:text-[#143694]">
                        {company.phone}
                      </a>
                    </div>
                  )}
                  {company.website && (
                    <div className="flex items-center">
                      <ExternalLink className="h-5 w-5 text-[#143694] mr-2" />
                      <a 
                        href={company.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-gray-700 text-sm hover:text-[#143694] truncate"
                      >
                        {company.website.replace(/^https?:\/\//, '')}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
            <div className="flex justify-end">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#143694]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const PoolJobDetailsPage = () => {
    const { id } = useParams();
    const [searchParams] = useSearchParams();
    const isApplied = (searchParams.get('isApplied') || '').toLowerCase() === 'true';
    const isSaved = (searchParams.get('isSaved') || '').toLowerCase() === 'true';
    const [jobDetails, setJobDetails] = useState(null);
    const [isloading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [saved, setSaved] = useState(false);
    const [showCompanyModal, setShowCompanyModal] = useState(false);
    const navigate = useNavigate();
    const { isAuthenticated, loading } = useAuth();
    
    const handleGoBack = () => {
        navigate(-1);
    };

    useEffect(() => {
        const fetchJobDetails = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await getPoolCampusJobById(id);
                
                // Debug the API response
                console.log('🔍 Pool Campus Page - API Response:', {
                    jobId: id,
                    hasData: !!response.data,
                    companyPosted: response.data?.companyPosted,
                    profileImageUrl: response.data?.companyPosted?.profileImageUrl,
                    profileImage: response.data?.companyPosted?.profileImage,
                    companyDetailsLogo: response.data?.companyPosted?.companyDetails?.companyLogo,
                    // Normalize if needed
                    needsNormalization: !response.data?.companyPosted?.profileImageUrl && !!response.data?.companyPosted?.profileImage
                });
                
                // If backend returns profileImage instead of profileImageUrl, normalize it
                let normalizedData = response.data;
                if (response.data?.companyPosted?.profileImage && !response.data?.companyPosted?.profileImageUrl) {
                    console.log('🔄 Normalizing: Copying profileImage to profileImageUrl');
                    normalizedData = {
                        ...response.data,
                        companyPosted: {
                            ...response.data.companyPosted,
                            profileImageUrl: response.data.companyPosted.profileImage
                        }
                    };
                }
                
                setJobDetails(normalizedData);
                await viewed(normalizedData._id);
            } catch (err) {
                console.error("Error fetching job details:", err);
                setError("Failed to fetch job details. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchJobDetails();
        }
    }, [id]);

    const handleApply = async () => {
        if (loading) return;

        // 🔐 Not logged in
        if (!isAuthenticated) {
          toast.error("Please login to apply");
          return;
        }
        try {
            const response = await ApplyForPoolCampus(id);
            if (response.data?.success === true) toast.success("Applied!");
            else toast.error(response.response?.data?.msg || "Could not apply.");
        } catch (error) {
            console.log("Error: ", error);
            toast.error('Something went wrong');
        }
    };

    const handleSave = async (jobId, jobType) => {
        if (!jobId || !jobType) return;
        try {
            const response = await SaveOppurtunity(jobId, jobType);
            if (response.data?.success === true) {
                toast.success("Saved!");
                setSaved(true); // Update save state on success
            }
            else toast.error(response.response?.data?.msg || "Could not save.");
        } catch (error) {
            console.log("Error: ", error);
            toast.error('Something went wrong');
        }
    };

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: `Pool Campus Drive at ${jobDetails?.companyPosted?.companyDetails?.companyName}`,
                text: `Check out this pool campus opportunity at ${jobDetails?.companyPosted?.companyDetails?.companyName}!`,
                url: window.location.href,
            })
                .catch((error) => console.log('Error sharing', error));
        } else {
            navigator.clipboard.writeText(window.location.href)
                .then(() => toast.success('Link copied to clipboard!'))
                .catch(() => toast.error('Failed to copy link'));
        }
    };

    const getJobStatus = () => {
        if (!jobDetails?.startDate || !jobDetails?.endDate) {
            return { status: 'Unknown', color: 'bg-gray-100 text-gray-700' };
        }

        const now = new Date();
        const startDate = new Date(jobDetails.startDate);
        const endDate = new Date(jobDetails.endDate);

        if (now < startDate) {
            return { status: 'Upcoming', color: 'bg-blue-100 text-[#143694]' };
        } else if (now >= startDate && now <= endDate) {
            return { status: 'Active', color: 'bg-green-100 text-green-700' };
        } else {
            return { status: 'Completed', color: 'bg-gray-100 text-gray-700' };
        }
    };

    // Get company logo
    const companyLogo = getCompanyLogo(jobDetails);
    
    // Prepare company data for modal from job data
    const getCompanyData = () => {
        if (!jobDetails) return {};
        
        return {
            companyName: jobDetails?.companyPosted?.companyDetails?.companyName,
            description: jobDetails?.companyPosted?.companyDetails?.description,
            numberOfEmployees: jobDetails?.companyPosted?.companyDetails?.numberOfEmployees,
            industryType: jobDetails?.companyPosted?.companyDetails?.industryType,
            country: jobDetails?.companyPosted?.companyDetails?.country,
            companyType: jobDetails?.companyPosted?.companyDetails?.companyType,
            contactPerson: jobDetails?.contactPerson?.name,
            email: jobDetails?.contactPerson?.email || jobDetails?.companyPosted?.companyDetails?.email,
            phone: jobDetails?.contactPerson?.mobile || jobDetails?.companyPosted?.companyDetails?.phone,
            website: jobDetails?.companyPosted?.companyDetails?.website,
            logo: companyLogo // Add the logo here
        };
    };

    if (isloading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-[#143694]/5 via-[#f093fb]/5 to-[#1e4ed8]/5 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#143694] mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading registration details...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-[#143694]/5 via-[#f093fb]/5 to-[#1e4ed8]/5 flex items-center justify-center">
                <div className="text-center">
                    <p className="mt-4 text-red-600">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-4 px-4 py-2 bg-gradient-to-r from-[#143694] to-[#1e4ed8] text-white rounded-lg hover:shadow-lg hover:shadow-[#143694]/30 transition-all duration-200"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    if (!jobDetails) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-[#143694]/5 via-[#f093fb]/5 to-[#1e4ed8]/5 flex items-center justify-center text-center p-4">
                <div>
                    <h2 className="text-2xl font-semibold mb-2 bg-gradient-to-r from-[#143694] to-[#1e4ed8] bg-clip-text text-transparent">
                        Job not found
                    </h2>
                    <p className="text-gray-600 mb-4">The opportunity you're looking for doesn't exist or has been removed.</p>
                    <button onClick={() => handleGoBack()} className="text-[#143694] hover:text-[#1e4ed8] transition-colors">
                        Back
                    </button>
                </div>
            </div>
        );
    }
    
    const jobStatus = getJobStatus();
    const companyData = getCompanyData();

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#143694]/5 via-[#f093fb]/5 to-[#1e4ed8]/5">
            <main className="px-6 py-6 max-w-7xl mx-auto">
                {/* Top Back Button */}
                <button onClick={() => handleGoBack()} className="inline-flex items-center text-[#143694] hover:text-[#1e4ed8] mb-6 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                    </svg>
                    Back
                </button>

                <div className="bg-white/90 backdrop-blur-sm border border-gray-100 rounded-xl shadow-lg overflow-hidden">
                    {/* Header Section - Reorganized */}
                    <div className="bg-gradient-to-r from-[#143694]/5 to-[#1e4ed8]/5 px-6 py-4">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            {/* Left side: Status and Company Name */}
                            <div className="flex-1 min-w-0">
                                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                                    <div className="flex items-center text-sm text-gray-600">
                                        <Calendar className="h-5 w-5 mr-1 text-[#143694]" />
                                        <span>{formatDate(jobDetails?.startDate)} - {formatDate(jobDetails?.endDate)}</span>
                                    </div>
                                </div>
                                
                                <div className="flex items-start gap-3">
                                    {/* Company Logo/Initial */}
                                    {/* <button 
                                        onClick={() => setShowCompanyModal(true)}
                                        className="group"
                                    >
                                        {companyLogo ? (
                                            <div className="w-12 h-12 rounded-lg bg-white border border-gray-200 shadow-sm overflow-hidden group-hover:shadow-md transition-shadow">
                                                <img 
                                                    src={companyLogo} 
                                                    alt={`${companyData.companyName} logo`}
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => {
                                                        console.error('❌ Logo failed to load:', companyLogo);
                                                        e.target.style.display = 'none';
                                                        e.target.nextElementSibling.style.display = 'flex';
                                                    }}
                                                />
                                                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#143694] to-[#1e4ed8] hidden items-center justify-center text-white font-bold text-lg">
                                                    {companyData.companyName?.charAt(0) || 'C'}
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#143694] to-[#1e4ed8] flex items-center justify-center text-white font-bold text-lg shadow-sm group-hover:opacity-90 transition-opacity">
                                                {companyData.companyName?.charAt(0) || 'C'}
                                            </div>
                                        )}
                                    </button> */}
                                    
                                    {/* Company Name and Click Hint */}
                                    <div>
                                        <button 
                                            onClick={() => setShowCompanyModal(true)}
                                            className="text-left group"
                                        >
                                            <div className="flex items-center gap-2">
                                                <h1 className="text-2xl font-bold text-gray-900 group-hover:text-[#143694] transition-colors">
                                                    {companyData.companyName || 'Not Specified'}
                                                </h1>
                                                <ExternalLink className="h-5 w-5 text-[#143694] opacity-0 group-hover:opacity-100 transition-opacity" />
                                            </div>
                                            
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Right side: Save and Share buttons */}
                            <div className="flex items-center gap-2 mt-4 sm:mt-0">
                                {!isSaved && (
                                    <button
                                        onClick={() => handleSave(jobDetails?._id, "Pool-campus")}
                                        disabled={saved}
                                        className={`inline-flex items-center justify-center px-4 py-2 border ${saved ? 'border-gray-300 bg-gray-50 text-gray-400 cursor-not-allowed' : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'} text-sm font-medium rounded-lg transition-all duration-200 shadow-sm`}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 mr-1 ${saved ? 'text-[#143694]' : 'text-gray-400'}`} viewBox="0 0 20 20" fill={saved ? 'currentColor' : 'none'} stroke="currentColor">
                                            <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                                        </svg>
                                        {saved ? 'Saved' : 'Save'}
                                    </button>
                                )}
                                <button
                                    onClick={handleShare}
                                    className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-50 transition-all duration-200 shadow-sm"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                                    </svg>
                                    Share
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Job Description */}
                    <div className="px-6 py-6">
                        <h2 className="text-xl font-bold bg-gradient-to-r from-[#143694] to-[#1e4ed8] bg-clip-text text-transparent mb-4">
                            Job Description
                        </h2>
                        <div className="text-gray-700 whitespace-pre-wrap">
                            {jobDetails?.description ? (
                                jobDetails.description
                            ) : (
                                <p>No job description provided.</p>
                            )}
                        </div>
                    </div>

                    {/* Job Details */}
                    <div className="px-6 py-6">
                        <h2 className="text-xl font-bold bg-gradient-to-r from-[#143694] to-[#1e4ed8] bg-clip-text text-transparent mb-4">
                            Job Details
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
                            <div>
                                <div className="text-sm font-medium text-[#143694]">Employment Type</div>
                                <div className="mt-1 text-base text-gray-900">{jobDetails?.employmentType?.join(', ') || 'Not Specified'}</div>
                            </div>
                            <div>
                                <div className="text-sm font-medium text-[#143694]">Job Roles</div>
                                <div className="mt-1 text-base text-gray-900">{jobDetails?.jobRoles?.join(', ') || 'Not Specified'}</div>
                            </div>
                            <div>
                                <div className="text-sm font-medium text-[#143694]">Work Mode</div>
                                <div className="mt-1 text-base text-gray-900">{jobDetails?.workMode?.join(', ') || 'Not Specified'}</div>
                            </div>
                            <div>
                                <div className="text-sm font-medium text-[#143694]">Number of rounds to be held</div>
                                <div className="mt-1 text-base text-gray-900">{jobDetails?.rounds?.join(', ') || 'Not Specified'}</div>
                            </div>
                            <div>
                                <div className="text-sm font-medium text-[#143694]">Job Location</div>
                                <div className="mt-1 text-base text-gray-900">{jobDetails?.workLocation?.join(', ') || 'Not Specified'}</div>
                            </div>
                            <div>
                                <div className="text-sm font-medium text-[#143694]">Preferred Hiring Mode</div>
                                <div className="mt-1 text-base text-gray-900">{jobDetails?.companyHiringPreference?.preferredMode || 'Not Specified'}</div>
                            </div>
                        </div>
                    </div>

                    {/* Required Skills */}
                    <div className="px-6 py-6">
                        <h2 className="text-xl font-bold bg-gradient-to-r from-[#143694] to-[#1e4ed8] bg-clip-text text-transparent mb-4">
                            Required Skills
                        </h2>
                        <div className="flex flex-wrap gap-2">
                            {jobDetails?.skills?.length > 0 ? (
                                jobDetails.skills.map((skill, index) => (
                                    <span key={index} className="bg-gradient-to-br from-[#143694]/10 to-[#1e4ed8]/10 text-gray-800 px-3 py-1.5 rounded-md text-sm font-medium border border-gray-200">
                                        {skill}
                                    </span>
                                ))
                            ) : (
                                <p className="text-gray-500">No specific skills mentioned.</p>
                            )}
                        </div>
                    </div>

                    {/* Amenity/Facility Required */}
                    <div className="px-6 py-6">
                        <h2 className="text-xl font-bold bg-gradient-to-r from-[#143694] to-[#1e4ed8] bg-clip-text text-transparent mb-4">
                            Amenity/Facility Required
                        </h2>
                        <div className="flex flex-wrap gap-2">
                            {jobDetails?.amenitiesRequired?.length > 0 ? (
                                jobDetails.amenitiesRequired.map((amenity, index) => (
                                    <span key={index} className="bg-gradient-to-br from-[#143694]/10 to-[#1e4ed8]/10 text-gray-800 px-3 py-1.5 rounded-md text-sm font-medium border border-gray-200">
                                        {amenity}
                                    </span>
                                ))
                            ) : (
                                <p className="text-gray-500">No amenities specified.</p>
                            )}
                        </div>
                    </div>

                    {/* Eligibility Criteria */}
                    <div className="px-6 py-6">
                        <h2 className="text-xl font-bold bg-gradient-to-r from-[#143694] to-[#1e4ed8] bg-clip-text text-transparent mb-4">
                            Eligibility Criteria
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8 mb-6">
                            <div>
                                <div className="text-sm font-medium text-[#143694]">Drive Open To (College Type)</div>
                                <div className="mt-1 text-base text-gray-900">{jobDetails?.collegeTypes?.join(', ') || 'Not Specified'}</div>
                            </div>
                            <div>
                                <div className="text-sm font-medium text-[#143694]">Eligible College Categories</div>
                                <div className="mt-1 text-base text-gray-900">{jobDetails?.collegeCategories?.join(', ') || 'Not Specified'}</div>
                            </div>
                            <div>
                                <div className="text-sm font-medium text-[#143694]">Eligible Degrees / Streams</div>
                                <div className="mt-1 text-base text-gray-900">{jobDetails?.studentStreams?.join(', ') || 'Not Specified'}</div>
                            </div>
                            <div>
                                <div className="text-sm font-medium text-[#143694]">Minimum Students Required</div>
                                <div className="mt-1 text-base text-gray-900">{jobDetails?.minimumStudents || 'Not Specified'}</div>
                            </div>
                        </div>
                        {(jobDetails?.eligibilityCriteria || jobDetails?.additionalEligibilityCriteria || jobDetails?.additionalCriteria) && (
                            <div className="mt-6">
                                <div className="text-sm font-medium text-[#143694] mb-2">Additional Criteria</div>
                                <ul className="list-disc pl-5 text-base text-gray-700 space-y-2">
                                    {splitIntoBullets(
                                        jobDetails.eligibilityCriteria || 
                                        jobDetails.additionalEligibilityCriteria || 
                                        jobDetails.additionalCriteria
                                    ).map((point, idx) => (
                                        <li key={idx}>{point}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>

                    {/* Compensation & Benefits */}
                    <div className="px-6 py-6">
                        <h2 className="text-xl font-bold bg-gradient-to-r from-[#143694] to-[#1e4ed8] bg-clip-text text-transparent mb-4">
                            Compensation & Benefits
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                            <div className="bg-gradient-to-br from-[#143694]/5 to-[#1e4ed8]/5 p-4 rounded-lg">
                                <div className="text-sm font-medium text-[#143694]">Total CTC</div>
                                <div className="text-xl font-bold text-gray-900">
                                    {jobDetails?.packageDetails?.totalCTC
                                        ? `${jobDetails.packageDetails.currency || ''} ${jobDetails.packageDetails.totalCTC.toLocaleString()}`
                                        : 'Not Specified'}
                                </div>
                            </div>
                            <div className="bg-gradient-to-br from-[#143694]/5 to-[#1e4ed8]/5 p-4 rounded-lg">
                                <div className="text-sm font-medium text-[#143694]">Fixed Pay</div>
                                <div className="text-xl font-bold text-gray-900">
                                    {jobDetails?.packageDetails?.fixedPay
                                        ? `${jobDetails.packageDetails.currency || ''} ${jobDetails.packageDetails.fixedPay.toLocaleString()}`
                                        : 'N/A'}
                                </div>
                            </div>
                            <div className="bg-gradient-to-br from-[#143694]/5 to-[#1e4ed8]/5 p-4 rounded-lg">
                                <div className="text-sm font-medium text-[#143694]">Variable Pay</div>
                                <div className="text-xl font-bold text-gray-900">
                                    {jobDetails?.packageDetails?.joiningBonus
                                        ? `${jobDetails.packageDetails.currency || ''} ${jobDetails.packageDetails.joiningBonus.toLocaleString()}`
                                        : 'N/A'}
                                </div>
                            </div>
                        </div>
                        <h3 className="font-medium text-[#143694] mt-6 mb-3">Benefits Offered</h3>
                        <div className="flex flex-wrap gap-2">
                            {jobDetails?.benefits?.length > 0 ? (
                                jobDetails.benefits.map((benefit, index) => (
                                    <span
                                        key={index}
                                        className="px-3 py-1.5 bg-gradient-to-r from-[#143694]/10 to-[#1e4ed8]/10 text-[#143694] border border-[#143694]/20 rounded-full text-sm font-medium"
                                    >
                                        {benefit}
                                    </span>
                                ))
                            ) : (
                                <span className="px-3 py-1.5 bg-gray-100 text-gray-600 border border-gray-200 rounded-full text-sm">
                                    No benefits specified
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Selection Process */}
                    <div className="px-6 py-6">
                        <div className="mb-4">
                            <h2 className="text-xl font-bold bg-gradient-to-r from-[#143694] to-[#1e4ed8] bg-clip-text text-transparent mb-1">
                                Selection Process
                            </h2>
                            <div className="text-md text-gray-500">
                                Number of rounds: {normalizeSelectionProcess(jobDetails?.selectionProcess).length}
                            </div>
                        </div>

                        {normalizeSelectionProcess(jobDetails?.selectionProcess).length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                {normalizeSelectionProcess(jobDetails.selectionProcess).map((step, index) => (
                                    <div 
                                        key={index}
                                        className="group bg-white border border-gray-200 rounded-lg p-3 hover:border-[#143694]/30 hover:shadow-sm transition-all duration-200"
                                    >
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className="w-6 h-6 rounded-full bg-gradient-to-r from-[#143694] to-[#1e4ed8] flex items-center justify-center">
                                                <span className="text-xs font-bold text-white">{index + 1}</span>
                                            </div>
                                            <p className="text-sm font-medium text-gray-900">Round {index + 1}</p>
                                        </div>
                                        
                                        <p className="text-xs text-gray-600 line-clamp-3">{step}</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="bg-gradient-to-br from-[#143694]/5 to-[#1e4ed8]/5 rounded-lg p-4">
                                <p className="text-sm text-gray-500 text-center">Selection process details not provided.</p>
                            </div>
                        )}
                    </div>

                    {/* Important Dates */}
                    <div className="px-6 py-6">
                        <h2 className="text-xl font-bold bg-gradient-to-r from-[#143694] to-[#1e4ed8] bg-clip-text text-transparent mb-4">
                            Important Dates
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="border border-gray-300 rounded-lg p-4 text-center bg-gradient-to-br from-[#143694]/5 to-[#1e4ed8]/5">
                                <div className="text-sm font-medium text-[#143694]">Registration Deadline</div>
                                <div className="mt-1 text-lg font-medium text-gray-900">{formatDate(jobDetails?.endDate)}</div>
                            </div>
                            <div className="border border-gray-300 rounded-lg p-4 text-center bg-gradient-to-br from-[#143694]/5 to-[#1e4ed8]/5">
                                <div className="text-sm font-medium text-[#143694]">Online Test Date</div>
                                <div className="mt-1 text-lg font-medium text-gray-900">{formatDate(jobDetails.onlineTestDate)}</div>
                            </div>
                            <div className="border border-gray-300 rounded-lg p-4 text-center bg-gradient-to-br from-[#143694]/5 to-[#1e4ed8]/5">
                                <div className="text-sm font-medium text-[#143694]">Interview Window</div>
                                <div className="mt-1 text-lg font-medium text-gray-900">
                                    {formatDate(jobDetails.interviewWindow?.start) === 'Not Specified' ? 'N/A' : `${formatDate(jobDetails.interviewWindow?.start)} - ${formatDate(jobDetails.interviewWindow?.end)}`}
                                </div>
                            </div>
                            <div className="border border-gray-300 rounded-lg p-4 text-center bg-gradient-to-br from-[#143694]/5 to-[#1e4ed8]/5">
                                <div className="text-sm font-medium text-[#143694]">Offer Rollout</div>
                                <div className="mt-1 text-lg font-medium text-gray-900">{formatDate(jobDetails.offerRolloutDate)}</div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Person */}
                    <div className="px-6 py-6">
                        <h2 className="text-xl font-bold bg-gradient-to-r from-[#143694] to-[#1e4ed8] bg-clip-text text-transparent mb-4">
                            Company Placement Officer Contact
                        </h2>

                        <div className="bg-gradient-to-br from-[#143694]/5 to-[#1e4ed8]/5 p-4 rounded-lg">
                            <div className="flex items-start">
                                <div className="mr-3 flex-shrink-0">
                                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#143694]/20 to-[#1e4ed8]/20 flex items-center justify-center text-[#143694]">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                    </div>
                                </div>
                                <div>
                                    <div className="text-base font-medium text-gray-900">
                                        {jobDetails?.contactPerson?.name || 'Not Specified'} 
                                        <span className='text-sm text-gray-500 ml-2'>({jobDetails?.contactPerson?.designation || 'N/A'})</span>
                                    </div>
                                    {jobDetails?.contactPerson?.email && (
                                        <div className="flex items-center mt-1">
                                            <Mail className="h-4 w-4 text-[#143694] mr-1.5" />
                                            <a href={`mailto:${jobDetails.contactPerson.email}`} className="text-[#143694] hover:text-[#1e4ed8] text-sm transition-colors">
                                                {jobDetails.contactPerson.email}
                                            </a>
                                        </div>
                                    )}
                                    {jobDetails?.contactPerson?.mobile && (
                                        <div className="flex items-center mt-1">
                                            <Phone className="h-4 w-4 text-[#143694] mr-1.5" />
                                            <a href={`tel:${jobDetails.contactPerson.mobile}`} className="text-[#143694] hover:text-[#1e4ed8] text-sm transition-colors">
                                                {jobDetails.contactPerson.mobile}
                                            </a>
                                        </div>
                                    )}
                                    {jobDetails?.contactPerson?.linkedin && (
                                        <a href={jobDetails.contactPerson.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center mt-1 text-[#143694] hover:text-[#1e4ed8] transition-colors">
                                            <Linkedin className="h-4 w-4 mr-1.5" />
                                            <span className="text-sm">LinkedIn Profile</span>
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Register Now Button at Bottom */}
                    {!isApplied && jobStatus.status !== 'Completed' && (
                        <div className="px-6 py-6 bg-gradient-to-r from-[#143694]/5 to-[#1e4ed8]/5">
                            <div className="flex justify-center">
                                <button 
                                    className="inline-flex items-center justify-center px-8 py-3 bg-gradient-to-r from-[#143694] to-[#1e4ed8] text-white text-lg font-medium rounded-xl hover:shadow-lg hover:shadow-[#143694]/30 transition-all duration-200"
                                    onClick={handleApply}
                                >
                                    Register Now
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Bottom Back Button */}
                    <div className="px-6 py-6">
                        <div className="flex justify-left">
                            <button 
                                onClick={() => handleGoBack()} 
                                className="inline-flex items-center px-6 py-3 bg-white text-[#143694] border border-[#143694] hover:bg-gradient-to-r hover:from-[#143694] hover:to-[#1e4ed8] hover:text-white rounded-xl transition-all duration-200"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                                </svg>
                                Back
                            </button>
                        </div>
                    </div>
                </div>
            </main>

            {/* Company Details Modal */}
            <CompanyDetailsModal
                company={companyData}
                isOpen={showCompanyModal}
                onClose={() => setShowCompanyModal(false)}
            />
        </div>
    );
};

export default PoolJobDetailsPage;