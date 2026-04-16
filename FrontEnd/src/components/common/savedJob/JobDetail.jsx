{/*import { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useParams, useNavigate, Link  } from "react-router-dom";



const normalizeJob = (job) => {
  return {
    // Header
    title:
      job?.jobRoles?.[0] ||
      job?.jobType ||
      "Opportunity",

    company:
      job?.companyPosted?.companyDetails?.companyName ||
      job?.collegePosted?.collegeUniversityDetails?.collegeName ||
      "N/A",

    location:
      job?.location?.[0] ||
      job?.venue ||
      "Not specified",

    type:
      job?.employmentType?.[0] || "N/A",

    experience: null, // backend doesn’t provide this

    // Content
    aboutRole:
      job?.description || "No description provided",

    responsibilities:
      job?.selectionProcess?.join(", ") || "Not specified",

    skills: job?.skills || [],

    // Company info
    aboutCompany:
      job?.companyPosted?.companyDetails?.about ||
      job?.collegePosted?.collegeUniversityDetails?.collegeName ||
      "",

    companyInfo: null,

    logo:
      job?.companyPosted?.companyDetails?.logo ||
      job?.collegePosted?.profileImage ||
      null
  };
};


const JobDetail = () => {
  const { id } = useParams();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  const savedJob = location.state?.job;

  useEffect(() => {
  // ✅ Case 1: coming from Saved Opportunities
  if (savedJob) {
    setJob(normalizeJob(savedJob));
    setLoading(false);
    return;
  }

  // ✅ Case 2: direct access / normal job listing
  if (id) {
    fetchJobById(id);
    return;
  }

  // ❌ Invalid access
  navigate(-1);
}, [id, savedJob]);

const fetchJobById = async (id) => {
  try {
    const res = await axios.get(
      `http://localhost:5000/api/hiring-channels/view/${id}`
    );
    const apiJob = res.data?.[0]?.job;
    setJob(apiJob ? normalizeJob(apiJob) : null);
  } catch (err) {
    console.error(err);
  } finally {
    setLoading(false);
  }
};




  

  if (loading) return <div className="p-6">Loading...</div>;


  if (!job) {
    return <div className="container mx-auto px-4 py-8">Job not found</div>;
  }

  // Find related jobs based on similar skills or category
  {/*const relatedJobs = jobs
    .filter(j => j.id !== job.id && 
      (j.category === job.category || 
       j.skills.some(skill => job.skills.includes(skill))))
    .slice(0, 6);*/}

  {/*return (
    <div className="container mx-auto px-4 py-8 bg-white">
      <div className="mb-8">
        <div className="mb-6 bg-white rounded-lg shadow p-6">
          <div className="flex flex-col md:flex-row justify-between mb-6">
            <div className="flex items-start">
              <div className="w-16 h-16 bg-gray-200 flex items-center justify-center rounded-md">
                {job.logo ? (
                  <img src={job.logo} alt={`${job.company} logo`} className="w-12 h-12 object-contain" />
                ) : (
                  <div className="text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
              </div>
              <div className="ml-4">
                <h1 className="text-2xl font-bold">{job.title}</h1>
                <div className="text-gray-600">{job.company}</div>
                <div className="mt-2 flex flex-wrap">
                  <div className="flex items-center mr-4 mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>{job.location}</span>
                  </div>
                  <div className="flex items-center mr-4 mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span>{job.type}</span>
                  </div>
                  {job.experience && (
                    <div className="flex items-center mr-4 mb-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{job.experience}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="mt-4 md:mt-0 flex space-x-2">
              <button className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50">Save</button>
              <button className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800">Apply</button>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">Job description</h2>
            <div className="mb-6">
              <h3 className="font-medium mb-2">About The Role</h3>
              <p className="text-gray-700 mb-4">{job.aboutRole}</p>
            </div>
            <div className="mb-6">
              <h3 className="font-medium mb-2">What you'll do</h3>
              <p className="text-gray-700 mb-4">{job.responsibilities}</p>
            </div>
            {job.details && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {job.details.map((detail, index) => (
                  <div key={index} className="mb-4">
                    <h4 className="text-sm text-gray-500">{detail.label}</h4>
                    <p className="font-medium">{detail.value}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {job.skills && job.skills.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-4">Key Skills</h2>
              <div className="flex flex-wrap gap-2">
                {job.skills.map((skill, index) => (
                  <span key={index} className="px-3 py-1 bg-gray-100 rounded-full text-sm">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">About company</h2>
            <p className="text-gray-700 mb-4">{job.aboutCompany}</p>
            
            {job.companyInfo && (
              <div className="text-sm text-gray-600">
                <p>{job.companyInfo}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/*<RelatedJobs jobs={relatedJobs} />*/}
      
      {/*<div className="mt-6 bg-white">
        <Link to="/saved-jobs" className="text-blue-600 hover:text-blue-800">
          &larr; Back to all jobs
        </Link>
      </div>
    </div>
  );
};

export default JobDetail;*/}

import { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { MapPin, Building2, Briefcase, Calendar, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";
import { UnsaveOppurtunity } from '@/lib/Company_AxiosInstance';
import {useAuth} from "@/context/AuthContext";
import {
  ApplyForOncampusOppurtunity,
  ApplyForPoolcampusOppurtunity,
} from "@/lib/Company_AxiosInstance";

import {
  ApplyForOnCampus,
  ApplyForPoolCampus,
} from '@/lib/College_AxiosIntance';

// student / fresher
import {
  ApplyForOppurtunity,
  ApplyForInternship,
  ApplyForReferral,
} from "@/lib/User_AxiosInstance";


// Utility functions - keep all existing utility functions
const splitIntoMeaningfulPoints = (text) => {
  if (!text || typeof text !== 'string') return [];

  return text
    .split(/[\.\n;]+/)
    .map(line => line.trim())
    .filter(line => line.length > 5);
};

const normalizeSelectionProcess = (selectionProcess) => {
  if (!selectionProcess) return [];

  if (Array.isArray(selectionProcess)) {
    return selectionProcess.flatMap(step =>
      step.includes('+')
        ? step.split('+').map(s => s.trim())
        : splitIntoMeaningfulPoints(step)
    );
  }

  if (typeof selectionProcess === 'string') {
    if (selectionProcess.includes('+')) {
      return selectionProcess.split('+').map(s => s.trim());
    }
    return splitIntoMeaningfulPoints(selectionProcess);
  }

  return [];
};

const formatDate = (dateString) => {
  if (!dateString) return 'Not Specified';

  const date = new Date(dateString);
  if (isNaN(date.getTime())) return 'Not Specified';

  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

// Helper function to check if an array has valid data
const hasValidData = (arr) => {
  return arr && Array.isArray(arr) && arr.length > 0;
};

// Helper function to check if a value is meaningful
const hasValue = (value) => {
  if (value === null || value === undefined || value === '' || value === 'N/A' || value === 'Not Specified') return false;
  if (typeof value === 'number' && value === 0) return false;
  if (typeof value === 'string' && value.trim() === '') return false;
  return true;
};

// Helper function to check if an object has any meaningful values
const hasValidObject = (obj, keys = []) => {
  if (!obj || typeof obj !== 'object') return false;
  if (keys.length === 0) {
    return Object.values(obj).some(value => hasValue(value));
  }
  return keys.some(key => hasValue(obj[key]));
};

// Render tags function
const renderTags = (items) => {
  if (!items || items.length === 0) {
    return <span className="text-gray-500">Not Specified</span>;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item, index) => (
        <span
          key={index}
          className="px-3 py-1.5 bg-gradient-to-r from-[#143694]/10 to-[#1e4ed8]/10 text-[#143694] border border-[#143694]/20 rounded-full text-sm font-medium"
        >
          {item}
        </span>
      ))}
    </div>
  );
};

// Update the normalizeJobData function in your UnifiedJobDetail component
const normalizeJobData = (savedJob, userType) => {
  const job = savedJob?.job || savedJob;
  
  // Determine organization name based on available data
  let organizationName = 'Not Specified';
  let organizationLogo = null;
  
  // Check for company data first
  if (job?.companyPosted?.companyDetails?.companyName) {
    organizationName = job.companyPosted.companyDetails.companyName;
    // Use the same logic as JobList's getOrganizationLogo
    organizationLogo = job.companyPosted?.profileImageUrl || job.companyPosted?.companyDetails?.logo || null;
  } 
  // Check for college data
  else if (job?.collegePosted?.collegeUniversityDetails?.collegeName) {
    organizationName = job.collegePosted.collegeUniversityDetails.collegeName;
    // Use the same logic as JobList's getOrganizationLogo
    organizationLogo = job.collegePosted?.profileImageUrl || job.collegePosted?.profileImage || null;
  }
  // Check for employer data (if job is posted by employer)
  else if (job?.postedBy === 'employer' && job?.employerDetails?.companyName) {
    organizationName = job.employerDetails.companyName;
    organizationLogo = job.employerDetails.logo;
  }
  // Fallback to direct fields
  else if (job?.companyName) {
    organizationName = job.companyName;
  } else if (job?.collegeName) {
    organizationName = job.collegeName;
  }
  
  return {
    // Basic Info
    _id: job?._id || savedJob?._id,
    jobType: job?.jobType || savedJob?.jobType || 'N/A',
    jobStatus: job?.jobStatus || 'Pending',
    lookingFor: job?.lookingFor || 'Job',
    
    // Organization Info - Use the determined values
    organizationName: organizationName,
    organizationLogo: organizationLogo,
    
    // Job Details
    jobRoles: job?.jobRoles || [],
    description: job?.description || 'No description provided',
    location: job?.location || [],
    workLocation: job?.workLocation || [],
    
    // Employment Details
    employmentType: job?.employmentType || [],
    workMode: job?.workMode || [],
    degree: job?.degree || [],
    studentStreams: job?.studentStreams || [],
    
    // Package Details
    packageDetails: {
      currency: job?.packageDetails?.currency || 'INR',
      totalCTC: job?.packageDetails?.totalCTC || null,
      fixedPay: job?.packageDetails?.fixedPay || null,
      joiningBonus: job?.packageDetails?.joiningBonus || null,
    },
    
    // Skills & Requirements
    skills: job?.skills || [],
    certifications: job?.certifications || [],
    cgpa: job?.cgpa || 0,
    eligibilityCriteria: job?.eligibilityCriteria || '',
    minEducation: job?.minEducation || '',
    workAuthorization: job?.workAuthorization || '',
    
    // Hiring Process
    selectionProcess: job?.selectionProcess || [],
    rounds: job?.rounds || [],
    
    // Benefits & Amenities
    benefits: job?.benefits || [],
    amenitiesRequired: job?.amenitiesRequired || [],
    
    // Dates
    startDate: job?.startDate || null,
    endDate: job?.endDate || null,
    onlineTestDate: job?.onlineTestDate || null,
    interviewWindow: job?.interviewWindow || { start: null, end: null },
    offerRolloutDate: job?.offerRolloutDate || null,
    
    // Internship specific
    internshipDuration: job?.internshipDuration || null,
    numberOfOpenings: job?.numberOfOpenings || null,
    
    // Tags
    tags: job?.tags || [],
    
    // Contact Person
    contactPerson: job?.contactPerson || {},
    
    // Application Status (from saved job)
    currentStatus: savedJob?.currentStatus || null,
    isVisited: savedJob?.isVisited || false,
  };
};

const normalizeJobType = (jobType) => {
  if (!jobType) return null;

  const type = jobType.toLowerCase().replace(/[\s-_]/g, "")
   

  if (type.includes("oncampus")) return "oncampus";
  if (type.includes("poolcampus")) return "poolcampus";
  if (type.includes("offcampus")) return "offcampus";
  if (type.includes("intern")) return "internship";
  if (type.includes("referral")) return "referral";

  return null;
};


const  resolveApplyApi = ({ userType, jobType }) => {
  console.log('usertype',userType)
  const normalizedJobType = normalizeJobType(jobType);
  const normalizedUserType = userType?.toLowerCase();

  if (!normalizedUserType || !normalizedJobType) return null;

  // Company / Employer
  if (["company", "employer"].includes(normalizedUserType)) {
    if (normalizedJobType === "oncampus") return ApplyForOncampusOppurtunity;
    if (normalizedJobType === "poolcampus") return ApplyForPoolcampusOppurtunity;
  }

  // College
  if (normalizedUserType === "college") {
    if (normalizedJobType === "oncampus") return ApplyForOnCampus;
    if (normalizedJobType === "poolcampus") return ApplyForPoolCampus;
  }

  // Student / Fresher
  if (["student", "fresher"].includes(normalizedUserType)) {
    if (normalizedJobType === "offcampus") return ApplyForOppurtunity;
    if (normalizedJobType === "internship") return ApplyForInternship;
  }

  if(normalizedUserType === "professional"){
    return ApplyForReferral;
  }

  return null;
};



const UnifiedJobDetail = () => {
  const { role: userType } = useAuth();
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const savedJob = location.state?.job;

  useEffect(() => {
    if (savedJob) {
      setJob(normalizeJobData(savedJob, userType));
      setLoading(false);
      return;
    }

    if (id) {
      fetchJobById(id);
      return;
    }

    navigate(-1);
  }, [id, savedJob, userType]);

  const fetchJobById = async (id) => {
    try {
      setLoading(true);
      const res = await axios.get(
        `http://localhost:5000/api/hiring-channels/view/${id}`
      );
      const apiJob = res.data?.[0]?.job || res.data?.[0];
      setJob(apiJob ? normalizeJobData(apiJob, userType) : null);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Failed to load job details. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleBackToList = () => {
    window.history.back();
  };

  const handleUnsave = async (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    try {
      setIsSaving(true);
      const response = await UnsaveOppurtunity(job._id);
      if (response?.data?.success) {
        toast.success("Opportunity Unsaved");
        setTimeout(() => handleBackToList(), 1000);
      } else {
        toast.error("Failed to unsave");
      }
    } catch (err) {
      console.error('Error unsaving job:', err);
      toast.error('Something went wrong');
    } finally {
      setIsSaving(false);
    }
  };

  // const handleApply = async () => {
  //   console.log('clicked for collge')
  //   try {
  //     if (!userType) {
  //       toast.error("Please login to apply");
  //       return;
  //     }

  //     const applyApi = resolveApplyApi({
  //       userType,
  //       jobType: job.jobType,
  //     });

  //     console.log("DEBUG APPLY →", {
  //       userType,
  //       jobType: job.jobType,
  //       fullJob: job,
  //     });


  //     if (!applyApi) {
  //       toast.error("You are not allowed to apply for this opportunity");
  //       return;
  //     }

  //     setIsApplying(true);


  //     // internship uses internshipId, others use jobId
  //     const payloadId =
  //       job.jobType === "internship" ? job._id : job._id;

  //     const response = await applyApi(payloadId);

  //     if (response?.data?.success) {
  //       toast.success("Applied successfully 🎉");

  //       // optional: update UI status immediately
  //       setJob(prev => ({
  //         ...prev,
  //         currentStatus: "Applied",
  //       }));
  //     } else {
  //       toast.error(
  //         response?.response?.data?.message || "Failed to apply"
  //       );
  //     }
  //   } catch (err) {
  //     console.error("Apply error:", err);
  //     toast.error("Something went wrong");
  //   } finally {
  //     setIsApplying(false);
  //   }
  // };

  const handleApply = async () => {
  try {
    if (!userType) {
      toast.error("Please login to apply");
      return;
    }

    const applyApi = resolveApplyApi({
      userType,
      jobType: job.jobType,
    });
    console.log(applyApi)
    if (!applyApi) {
      toast.error("You are not allowed to apply for this opportunity");
      return;
    }

    setIsApplying(true);

    const response = await applyApi(job._id);

    if (response?.data?.success) {
      toast.success("Applied successfully 🎉");

      // ✅ Remove from saved jobs after successful application
      try {
        await UnsaveOppurtunity(job._id);
      } catch (unsaveErr) {
        // Non-blocking — application already succeeded
        console.warn("Unsave after apply failed:", unsaveErr);
      }

      // Navigate back so the saved list refreshes without this job
      setTimeout(() => handleBackToList(), 1000);

    } else {
      toast.error(
        response?.response?.data?.message || "Failed to apply"
      );
    }
  } catch (err) {
    console.error("Apply error:", err);
    toast.error("Something went wrong");
  } finally {
    setIsApplying(false);
  }
};
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${job?.jobRoles?.[0] || 'Opportunity'} at ${job?.organizationName}`,
        text: `Check out this opportunity for ${job?.jobRoles?.[0] || 'job'} at ${job?.organizationName}!`,
        url: window.location.href,
      })
        .catch((error) => console.log('Error sharing', error));
    } else {
      navigator.clipboard.writeText(window.location.href)
        .then(() => toast.success('Link copied to clipboard!'))
        .catch(() => toast.error('Failed to copy link'));
    }
  };


  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#143694]/5 via-[#f093fb]/5 to-[#1e4ed8]/5 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#143694] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading opportunity details...</p>
        </div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#143694]/5 via-[#f093fb]/5 to-[#1e4ed8]/5 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl font-semibold text-red-500">{error || "Opportunity not found"}</p>
          <button
            className="mt-4 px-4 py-2 bg-gradient-to-r from-[#143694] to-[#1e4ed8] text-white rounded-lg hover:shadow-lg hover:shadow-[#143694]/30 transition-all duration-200"
            onClick={() => fetchJobById(id)}
          >
            Try Again
          </button>
          <button
            className="mt-4 ml-4 bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg transition-all duration-200"
            onClick={handleBackToList}
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const displayTitle = job.jobRoles?.[0] || job.jobType || job.lookingFor || 'Opportunity';
  const displayLocations = [...new Set([...job.location, ...job.workLocation])].filter(Boolean);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#143694]/5 via-[#f093fb]/5 to-[#1e4ed8]/5">
      <main className="px-6 py-6">
        {/* Top Back Button */}
        <button onClick={handleBackToList} className="inline-flex items-center text-[#143694] hover:text-[#1e4ed8] mb-6 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back
        </button>

        <div className="bg-white/90 backdrop-blur-sm border border-gray-100 rounded-xl shadow-lg overflow-hidden">
          {/* Header Section - Using exact same logic as JobList */}
<div className="bg-gradient-to-r from-[#143694]/5 to-[#1e4ed8]/5 px-6 py-4">
  <div className="flex flex-col md:flex-row justify-between items-start md:items-center mt-2">
    <div className="flex items-center">
      {/* Logo with initials fallback - EXACT same as JobList */}
      <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 mr-4 relative bg-gradient-to-br from-[#143694] to-[#1e4ed8] flex items-center justify-center">
        {/* Background Layer: Initials are always here */}
        <span className="text-white font-bold text-sm absolute z-0">
          {job.organizationName ? 
            (() => {
              const words = job.organizationName.trim().split(/\s+/);
              if (words.length === 1) {
                return job.organizationName.substring(0, 2).toUpperCase();
              } else {
                return (words[0].charAt(0) + words[1].charAt(0)).toUpperCase();
              }
            })() : '?'
          }
        </span>

        {/* Foreground Layer: Logo hides initials if it loads successfully */}
        {job.organizationLogo && (
          <img 
            src={job.organizationLogo} 
            alt={job.organizationName || "Organization"} 
            className="w-full h-full object-cover relative z-10"
            onError={(e) => {
              // If the URL exists but image fails to fetch, hide the img tag
              e.target.style.display = 'none';
            }}
          />
        )}
      </div>
      
      <div>
        {/* Company Name - Highlighted and bold */}
        <h1 className="text-2xl font-bold bg-gradient-to-r from-[#143694] to-[#1e4ed8] bg-clip-text text-transparent">
          {job.organizationName || 'Not Specified'}
        </h1>
        {/* Job Role - Slightly less bold */}
        <p className="text-xl font-semibold text-gray-800 mt-1">
          {displayTitle}
        </p>
      </div>
    </div>
  </div>

  {/* Location below the date */}
  <div className="flex items-center text-sm text-gray-600 mt-4">
    <Calendar className="h-5 w-5 mr-1 text-[#143694]" />
    <span className="mr-4">
      {hasValue(job.startDate) ? `${formatDate(job.startDate)} - ${formatDate(job.endDate)}` : 'Not Specified'}
    </span>
    {displayLocations.length > 0 && (
      <>
        <MapPin className="h-5 w-5 mr-1 text-[#143694]" />
        <span>{displayLocations.join(', ')}</span>
      </>
    )}
  </div>

  {/* Action Buttons */}
  <div className="flex flex-wrap gap-2 mt-4">
    {job.currentStatus !== 'Applied' && (
      <button
        onClick={handleApply}
        disabled={isApplying}
        className="inline-flex items-center justify-center px-6 py-2 bg-gradient-to-r from-[#143694] to-[#1e4ed8] text-white text-sm font-medium rounded-lg hover:shadow-lg hover:shadow-[#143694]/30 transition-all duration-200"
      >
        <Briefcase className="h-4 w-4 mr-2" />
        {isApplying ? 'Applying...' : 'Apply Now'}
      </button>
    )}
    <button
      onClick={handleUnsave}
      disabled={isSaving}
      className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-50 transition-all duration-200"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 mr-1 ${isSaving ? 'text-[#143694]' : 'text-gray-400'}`} viewBox="0 0 20 20" fill={isSaving ? 'currentColor' : 'none'} stroke="currentColor">
        <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
      </svg>
      {isSaving ? 'Removing...' : 'Unsave'}
    </button>
    <button
      onClick={handleShare}
      className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-50 transition-all duration-200"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
        <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
      </svg>
      Share
    </button>
  </div>
</div>

          {/* Job Type Badge */}
          <div className="px-6 py-4">
            <span className="inline-block px-4 py-2 bg-gradient-to-r from-[#143694]/10 to-[#1e4ed8]/10 text-[#143694] rounded-full text-sm font-semibold border border-[#143694]/20">
              {job.jobType} • {job.lookingFor}
            </span>
          </div>

          {/* About the Role */}
          {hasValue(job.description) && job.description !== 'No description provided' && (
            <div className="px-6 py-6">
              <h2 className="text-xl font-bold bg-gradient-to-r from-[#143694] to-[#1e4ed8] bg-clip-text text-transparent mb-4">
                About the Role
              </h2>
              <p className="text-gray-700 whitespace-pre-wrap">
                {job.description}
              </p>
            </div>
          )}

          {/* Quick Overview */}
          <div className="px-6 py-6">
            <h2 className="text-xl font-bold bg-gradient-to-r from-[#143694] to-[#1e4ed8] bg-clip-text text-transparent mb-4">
              Quick Overview
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
              {hasValidData(job.degree) && (
                <div>
                  <div className="text-sm font-medium text-[#143694]">Degree</div>
                  <div className="mt-1 text-base text-gray-900">{job.degree.join(' / ') || 'Not Specified'}</div>
                </div>
              )}
              {hasValidData(job.employmentType) && (
                <div>
                  <div className="text-sm font-medium text-[#143694]">Employment Type</div>
                  <div className="mt-1 text-base text-gray-900">{job.employmentType.join(', ') || 'Not Specified'}</div>
                </div>
              )}
              {hasValidData(job.workMode) && (
                <div>
                  <div className="text-sm font-medium text-[#143694]">Work Mode</div>
                  <div className="mt-1 text-base text-gray-900">{job.workMode.join(', ') || 'Not Specified'}</div>
                </div>
              )}
            </div>
          </div>

          {/* Required Skills & Eligible Streams - Combined Section */}
          {(hasValidData(job.skills) || hasValidData(job.studentStreams)) && (
            <div className="px-6 py-6">
              <h2 className="text-xl font-bold bg-gradient-to-r from-[#143694] to-[#1e4ed8] bg-clip-text text-transparent mb-4">
                Required Skills & Eligible Streams
              </h2>
              
              {hasValidData(job.skills) && (
                <div className="mb-4">
                  <div className="text-sm font-medium text-[#143694] mb-2">Skills</div>
                  {renderTags(job.skills)}
                </div>
              )}
              
              {hasValidData(job.studentStreams) && (
                <div>
                  <div className="text-sm font-medium text-[#143694] mb-2">Eligible Streams</div>
                  {renderTags(job.studentStreams)}
                </div>
              )}
            </div>
          )}

          {/* Compensation & Benefits */}
          <div className="px-6 py-6">
            <h2 className="text-xl font-bold bg-gradient-to-r from-[#143694] to-[#1e4ed8] bg-clip-text text-transparent mb-4">
              Compensation & Benefits
            </h2>
            {(hasValue(job.packageDetails?.totalCTC) || hasValue(job.packageDetails?.fixedPay) || hasValue(job.packageDetails?.joiningBonus)) && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {hasValue(job.packageDetails?.totalCTC) && (
                  <div className="bg-gradient-to-br from-[#143694]/5 to-[#1e4ed8]/5 p-4 rounded-lg">
                    <div className="text-sm font-medium text-[#143694]">Total CTC</div>
                    <div className="text-xl font-bold text-gray-900">
                      {job.packageDetails.currency || 'INR'} {job.packageDetails.totalCTC?.toLocaleString() || 'Not Specified'}
                    </div>
                  </div>
                )}
                {hasValue(job.packageDetails?.fixedPay) && (
                  <div className="bg-gradient-to-br from-[#143694]/5 to-[#1e4ed8]/5 p-4 rounded-lg">
                    <div className="text-sm font-medium text-[#143694]">Fixed Pay</div>
                    <div className="text-xl font-bold text-gray-900">
                      {job.packageDetails.currency || 'INR'} {job.packageDetails.fixedPay?.toLocaleString() || 'N/A'}
                    </div>
                  </div>
                )}
                {hasValue(job.packageDetails?.joiningBonus) && (
                  <div className="bg-gradient-to-br from-[#143694]/5 to-[#1e4ed8]/5 p-4 rounded-lg">
                    <div className="text-sm font-medium text-[#143694]">Variable Pay</div>
                    <div className="text-xl font-bold text-gray-900">
                      {job.packageDetails.currency || 'INR'} {job.packageDetails.joiningBonus?.toLocaleString() || 'N/A'}
                    </div>
                  </div>
                )}
              </div>
            )}
            {hasValue(job.internshipDuration) && (
              <div className="mb-4">
                <div className="text-sm font-medium text-[#143694]">Internship Duration</div>
                <div className="text-base text-gray-900">{job.internshipDuration}</div>
              </div>
            )}
            {hasValue(job.numberOfOpenings) && (
              <div className="mb-4">
                <div className="text-sm font-medium text-[#143694]">Number of Openings</div>
                <div className="text-base text-gray-900">{job.numberOfOpenings}</div>
              </div>
            )}
            {hasValidData(job.benefits) && (
              <div>
                <h3 className="font-medium text-[#143694] mt-6 mb-3">Benefits Offered</h3>
                {renderTags(job.benefits)}
              </div>
            )}
          </div>

          {/* Eligibility Criteria */}
{(hasValue(job.eligibilityCriteria) || (job.cgpa && job.cgpa > 0) || hasValue(job.minEducation) || hasValue(job.workAuthorization)) && (
  <div className="px-6 py-6">
    <h2 className="text-xl font-bold bg-gradient-to-r from-[#143694] to-[#1e4ed8] bg-clip-text text-transparent mb-4">
      Eligibility Criteria
    </h2>
    
    {/* All criteria as bullet points in a single list */}
    <ul className="space-y-2">
      {/* CGPA */}
      {/* {job.cgpa && job.cgpa > 0 && (
        <li className="text-gray-700 flex items-start">
          <span className="mr-2 text-[#143694]">•</span>
          <span><span className="font-medium">Minimum CGPA:</span> {job.cgpa}</span>
        </li>
      )} */}

      {/* Minimum Education */}
      {/* {hasValue(job.minEducation) && (
        <li className="text-gray-700 flex items-start">
          <span className="mr-2 text-[#143694]">•</span>
          <span><span className="font-medium">Minimum Education:</span> {job.minEducation}</span>
        </li>
      )} */}

      {/* Work Authorization */}
      {/* {hasValue(job.workAuthorization) && (
        <li className="text-gray-700 flex items-start">
          <span className="mr-2 text-[#143694]">•</span>
          <span><span className="font-medium">Work Authorization:</span> {job.workAuthorization}</span>
        </li>
      )} */}

      {/* Additional Criteria - Split into multiple bullet points if it contains newlines */}
      {hasValue(job.eligibilityCriteria) && (
        <>
          {job.eligibilityCriteria.split('\n').map((point, index) => 
            point.trim() && (
              <li key={`criteria-${index}`} className="text-gray-700 flex items-start">
                <span className="mr-2 text-[#143694]">•</span>
                <span>{point.trim()}</span>
              </li>
            )
          )}
        </>
      )}
    </ul>
  </div>
)}

{/* Additional Requirements */}
{hasValidData(job.certifications) && (
  <div className="px-6 py-6">
    <h2 className="text-xl font-bold bg-gradient-to-r from-[#143694] to-[#1e4ed8] bg-clip-text text-transparent mb-4">
      Additional Requirements
    </h2>
    <div>
      <div className="text-sm font-medium text-[#143694] mb-2">Certifications</div>
      {renderTags(job.certifications)}
    </div>
  </div>
)}

          {/* Selection Process */}
          {(normalizeSelectionProcess(job.selectionProcess)?.length > 0 || hasValidData(job.rounds)) && (
            <div className="px-6 py-6">
              <div className="mb-4">
                <h2 className="text-xl font-bold bg-gradient-to-r from-[#143694] to-[#1e4ed8] bg-clip-text text-transparent mb-1">
                  Selection Process
                </h2>
                <div className="text-md text-gray-500">
                  Number of rounds: {job?.rounds || job?.selectionProcess?.length || 0}
                </div>
              </div>

              {normalizeSelectionProcess(job.selectionProcess)?.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {normalizeSelectionProcess(job.selectionProcess).map((step, index) => (
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
          )}

          {/* Important Dates */}
          {(hasValue(job.endDate) || hasValue(job.onlineTestDate) || hasValue(job.interviewWindow?.start) || hasValue(job.offerRolloutDate)) && (
            <div className="px-6 py-6">
              <h2 className="text-xl font-bold bg-gradient-to-r from-[#143694] to-[#1e4ed8] bg-clip-text text-transparent mb-4">
                Important Dates
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {hasValue(job.endDate) && formatDate(job.endDate) !== 'Not Specified' && (
                  <div className="border border-gray-300 rounded-lg p-4 text-center bg-gradient-to-br from-[#143694]/5 to-[#1e4ed8]/5">
                    <div className="text-sm font-medium text-[#143694]">Registration Deadline</div>
                    <div className="mt-1 text-lg font-medium text-gray-900">{formatDate(job.endDate)}</div>
                  </div>
                )}
                
                {hasValue(job.onlineTestDate) && formatDate(job.onlineTestDate) !== 'Not Specified' && (
                  <div className="border border-gray-300 rounded-lg p-4 text-center bg-gradient-to-br from-[#143694]/5 to-[#1e4ed8]/5">
                    <div className="text-sm font-medium text-[#143694]">Online Test Date</div>
                    <div className="mt-1 text-lg font-medium text-gray-900">{formatDate(job.onlineTestDate)}</div>
                  </div>
                )}
                
                {hasValue(job.interviewWindow?.start) && (
                  <div className="border border-gray-300 rounded-lg p-4 text-center bg-gradient-to-br from-[#143694]/5 to-[#1e4ed8]/5">
                    <div className="text-sm font-medium text-[#143694]">Interview Window</div>
                    <div className="mt-1 text-lg font-medium text-gray-900">
                      {formatDate(job.interviewWindow.start) === 'Not Specified' ? 'N/A' : `${formatDate(job.interviewWindow.start)} - ${formatDate(job.interviewWindow.end)}`}
                    </div>
                  </div>
                )}
                
                {hasValue(job.offerRolloutDate) && formatDate(job.offerRolloutDate) !== 'Not Specified' && (
                  <div className="border border-gray-300 rounded-lg p-4 text-center bg-gradient-to-br from-[#143694]/5 to-[#1e4ed8]/5">
                    <div className="text-sm font-medium text-[#143694]">Offer Rollout</div>
                    <div className="mt-1 text-lg font-medium text-gray-900">{formatDate(job.offerRolloutDate)}</div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Tags */}
          {hasValidData(job.tags) && (
            <div className="px-6 py-6">
              <h2 className="text-xl font-bold bg-gradient-to-r from-[#143694] to-[#1e4ed8] bg-clip-text text-transparent mb-4">
                Tags
              </h2>
              {renderTags(job.tags)}
            </div>
          )}

          {/* Amenities Required */}
          {hasValidData(job.amenitiesRequired) && (
            <div className="px-6 py-6">
              <h2 className="text-xl font-bold bg-gradient-to-r from-[#143694] to-[#1e4ed8] bg-clip-text text-transparent mb-4">
                Amenities Required
              </h2>
              <div className="text-base text-gray-900">{job.amenitiesRequired.join(', ') || 'None'}</div>
            </div>
          )}

          {/* Contact Person */}
          {hasValidObject(job.contactPerson, ['name', 'email', 'mobile', 'designation']) && (
            <div className="px-6 py-6">
              <h2 className="text-xl font-bold bg-gradient-to-r from-[#143694] to-[#1e4ed8] bg-clip-text text-transparent mb-4">
                Contact Person
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
                      {job.contactPerson.name || 'Not Specified'} 
                      <span className='text-sm text-gray-500 ml-2'>({job.contactPerson.designation || 'N/A'})</span>
                    </div>
                    {job.contactPerson.email && (
                      <div className="flex items-center mt-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#143694] mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <a href={`mailto:${job.contactPerson.email}`} className="text-[#143694] hover:text-[#1e4ed8] text-sm transition-colors">{job.contactPerson.email}</a>
                      </div>
                    )}
                    {job.contactPerson.mobile && (
                      <div className="flex items-center mt-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#143694] mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        <a href={`tel:${job.contactPerson.mobile}`} className="text-[#143694] hover:text-[#1e4ed8] text-sm transition-colors">{job.contactPerson.mobile}</a>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Apply Now Button at Bottom */}
          {job.currentStatus !== 'Applied' && job.jobStatus === 'Open' && (
            <div className="px-6 py-6 bg-gradient-to-r from-[#143694]/5 to-[#1e4ed8]/5">
              <div className="flex justify-center">
                <button 
                  className="inline-flex items-center justify-center px-8 py-3 bg-gradient-to-r from-[#143694] to-[#1e4ed8] text-white text-lg font-medium rounded-xl hover:shadow-lg hover:shadow-[#143694]/30 transition-all duration-200"
                  onClick={handleApply}
                  disabled={isApplying}
                >
                  {isApplying ? 'Applying...' : 'Apply Now'}
                </button>
              </div>
            </div>
          )}

          {/* Bottom Back Button */}
          <div className="px-6 py-6 border-t border-gray-100">
            <div className="flex justify-left">
              <button 
                onClick={handleBackToList} 
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
    </div>
  );
};

export default UnifiedJobDetail;