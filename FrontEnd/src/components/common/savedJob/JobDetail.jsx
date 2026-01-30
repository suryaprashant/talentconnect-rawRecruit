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
} from "@/lib/User_AxiosInstance";


// Utility functions
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
  if (!dateString) return 'N/A';

  const date = new Date(dateString);
  if (isNaN(date.getTime())) return 'N/A';

  return date.toLocaleDateString('en-GB');
};

// Helper function to check if an array has valid data
const hasValidData = (arr) => {
  return arr && Array.isArray(arr) && arr.length > 0;
};

// Helper function to check if a value is meaningful (not null, undefined, 0, empty string, or 'N/A')
const hasValue = (value) => {
  if (value === null || value === undefined || value === '' || value === 'N/A') return false;
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

const renderTags = (items) => {
  if (!items || items.length === 0) {
    return <span className="text-gray-500">N/A</span>;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item, index) => (
        <span
          key={index}
          className="px-3 py-1 bg-gradient-to-r from-[#667eea]/10 to-[#764ba2]/10 text-[#667eea] rounded-full text-sm border border-[#667eea]/20"
        >
          {item}
        </span>
      ))}
    </div>
  );
};

// Normalization function for all three dashboard types
const normalizeJobData = (savedJob, userType) => {
  // savedJob could be from company, college, or student dashboard
  const job = savedJob?.job || savedJob;
  
  return {
    // Basic Info
    _id: job?._id || savedJob?._id,
    jobType: job?.jobType || savedJob?.jobType || 'N/A',
    jobStatus: job?.jobStatus || 'Pending',
    lookingFor: job?.lookingFor || 'Job',
    
    // Company/College Info
    companyName: job?.companyPosted?.companyDetails?.companyName || null,
    collegeName: job?.collegePosted?.collegeUniversityDetails?.collegeName || null,
    companyLogo: job?.companyPosted?.companyDetails?.logo || null,
    collegeLogo: job?.collegePosted?.profileImage || null,
    
    // Display name based on user type
    organizationName: userType === 'company' 
      ? job?.collegePosted?.collegeUniversityDetails?.collegeName
      : job?.companyPosted?.companyDetails?.companyName,
    
    organizationLogo: userType === 'company'
      ? job?.collegePosted?.profileImage
      : job?.companyPosted?.companyDetails?.logo,
    
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

  const type = jobType
    .toLowerCase()
    .replace(/[\s-_]/g, ""); // remove space, dash, underscore

  if (type.includes("oncampus")) return "oncampus";
  if (type.includes("poolcampus")) return "poolcampus";
  if (type.includes("offcampus")) return "offcampus";
  if (type.includes("intern")) return "internship";

  return null;
};


const resolveApplyApi = ({ userType, jobType }) => {
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
    // Case 1: coming from Saved Opportunities
    if (savedJob) {
      setJob(normalizeJobData(savedJob, userType));
      setLoading(false);
      return;
    }

    // Case 2: direct access / normal job listing
    if (id) {
      fetchJobById(id);
      return;
    }

    // Invalid access
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
      // Add your unsave API call here - replace with your actual API function
       const response = await UnsaveOppurtunity(job._id);
       if (response?.data?.success) {
         toast.success("Opportunity Unsaved");
         //window.location.reload(); // or use your refresh function
         
       } else {
         toast.error("Failed to unsave");
       }
      
      // Temporary success message - remove when you add real API
      //toast.success('Job removed from saved list!');
      setTimeout(() => handleBackToList(), 1000);
    } catch (err) {
      console.error('Error unsaving job:', err);
      toast.error('Something went wrong');
    } finally {
      setIsSaving(false);
    }
  };

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

      console.log("DEBUG APPLY →", {
        userType,
        jobType: job.jobType,
        fullJob: job,
      });


      if (!applyApi) {
        toast.error("You are not allowed to apply for this opportunity");
        return;
      }

      setIsApplying(true);

      // internship uses internshipId, others use jobId
      const payloadId =
        job.jobType === "internship" ? job._id : job._id;

      const response = await applyApi(payloadId);

      if (response?.data?.success) {
        toast.success("Applied successfully 🎉");

        // optional: update UI status immediately
        setJob(prev => ({
          ...prev,
          currentStatus: "Applied",
        }));
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


  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-[#667eea]/5 via-[#f093fb]/5 to-[#764ba2]/5">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#667eea]"></div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-[#667eea]/5 via-[#f093fb]/5 to-[#764ba2]/5">
        <div className="text-center p-4">
          <p className="text-xl font-semibold text-red-500">{error || "Job not found"}</p>
          <button
            className="mt-4 bg-gradient-to-r from-[#667eea] to-[#764ba2] hover:shadow-lg hover:shadow-[#667eea]/30 text-white px-4 py-2 rounded-lg transition-all duration-200"
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

  let headerStatusClasses = '';
  switch (job.jobStatus) {
    case 'Open':
      headerStatusClasses = 'text-green-600';
      break;
    case 'Closed':
      headerStatusClasses = 'text-red-600';
      break;
    case 'Pending':
      headerStatusClasses = 'text-yellow-600';
      break;
    default:
      headerStatusClasses = 'text-gray-600';
  }

  const displayTitle = job.jobRoles?.[0] || job.jobType || job.lookingFor || 'Opportunity';
  const displayLocations = [...new Set([...job.location, ...job.workLocation])].filter(Boolean);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#667eea]/5 via-[#f093fb]/5 to-[#764ba2]/5 p-4 md:p-6 lg:p-8">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-[#667eea] to-[#764ba2] p-6 md:p-8 text-white">
          <button
            onClick={handleBackToList}
            className="mb-4 flex items-center text-white/90 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Jobs
          </button>

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center flex-shrink-0">
                {job.organizationLogo ? (
                  <img
                    src={job.organizationLogo}
                    alt={job.organizationName}
                    className="w-12 h-12 object-contain"
                  />
                ) : (
                  <Building2 className="w-8 h-8 text-[#667eea]" />
                )}
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold mb-2">{displayTitle}</h1>
                <p className="text-white/90 text-lg mb-2">{job.organizationName || 'N/A'}</p>
                <div className="flex flex-wrap gap-3 text-sm">
                  {displayLocations.length > 0 && (
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span>{displayLocations.join(', ')}</span>
                    </div>
                  )}
                  {job.employmentType?.[0] && (
                    <div className="flex items-center gap-1">
                      <Briefcase className="w-4 h-4" />
                      <span>{job.employmentType.join(', ')}</span>
                    </div>
                  )}
                  {job.workMode?.[0] && (
                    <span className="px-3 py-1 bg-white/20 rounded-full">
                      {job.workMode.join(', ')}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2 w-full md:w-auto">
              <span className={`px-4 py-2 rounded-lg text-center font-medium bg-white/20 ${headerStatusClasses}`}>
                {job.jobStatus}
              </span>
              {job.currentStatus && (
                <span className="px-4 py-2 rounded-lg text-center font-medium bg-white/20">
                  {job.currentStatus}
                </span>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={handleApply}
              disabled={isApplying || job.currentStatus === 'Applied'}
              className="px-6 py-3 bg-white text-[#667eea] rounded-xl font-semibold hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex-grow sm:flex-grow-0"
            >
              {isApplying ? 'Applying...' : job.currentStatus === 'Applied' ? 'Already Applied' : 'Apply Now'}
            </button>
            <button
              onClick={handleUnsave}
              disabled={isSaving}
              className="px-6 py-3 bg-white/20 text-white border border-white/50 rounded-xl font-semibold hover:bg-white/30 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex-grow sm:flex-grow-0"
            >
              {isSaving ? 'Removing...' : 'Unsave'}
            </button>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-6 md:p-8">
          {/* Job Type Badge */}
          <div className="mb-6">
            <span className="inline-block px-4 py-2 bg-gradient-to-r from-[#667eea]/10 to-[#764ba2]/10 text-[#667eea] rounded-full text-sm font-semibold border border-[#667eea]/20">
              {job.jobType} • {job.lookingFor}
            </span>
          </div>

          {/* Quick Stats */}
          {(hasValidData(job.degree) || hasValidData(job.studentStreams) || hasValidData(job.skills)) && (
            <section className="mb-8">
              <h3 className="text-lg font-semibold mb-3 bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent">
                Quick Overview
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {hasValidData(job.degree) && (
                  <div className="flex items-start">
                    <svg className="w-5 h-5 mt-1 mr-3 text-[#667eea] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                    </svg>
                    <div>
                      <div className="font-medium text-[#667eea]">Degree</div>
                      {renderTags(job.degree)}
                    </div>
                  </div>
                )}
                {hasValidData(job.studentStreams) && (
                  <div className="flex items-start">
                    <svg className="w-5 h-5 mt-1 mr-3 text-[#667eea] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                    </svg>
                    <div>
                      <div className="font-medium text-[#667eea]">Eligible Streams</div>
                      {renderTags(job.studentStreams)}
                    </div>
                  </div>
                )}
                {hasValidData(job.skills) && (
                  <div className="flex items-start col-span-1 sm:col-span-2">
                    <svg className="w-5 h-5 mt-1 mr-3 text-[#667eea] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                    </svg>
                    <div>
                      <div className="font-medium text-[#667eea]">Required Skills</div>
                      {renderTags(job.skills)}
                    </div>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* Compensation & Benefits */}
          {(hasValue(job.packageDetails?.totalCTC) || hasValue(job.packageDetails?.fixedPay) || hasValue(job.packageDetails?.joiningBonus) || hasValue(job.internshipDuration) || hasValue(job.numberOfOpenings) || hasValidData(job.benefits)) && (
            <section className="mb-8">
              <h3 className="text-lg font-semibold mb-3 bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent">
                Compensation & Benefits
              </h3>
              {(hasValue(job.packageDetails?.totalCTC) || hasValue(job.packageDetails?.fixedPay) || hasValue(job.packageDetails?.joiningBonus)) && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  {hasValue(job.packageDetails?.totalCTC) && (
                    <div className="bg-gradient-to-br from-[#667eea]/5 to-[#764ba2]/5 p-4 rounded-lg border border-gray-200">
                      <div className="text-sm font-medium text-[#667eea]">Total CTC</div>
                      <div className="text-lg font-bold text-gray-900">
                        {job.packageDetails.currency || 'INR'} {job.packageDetails.totalCTC.toLocaleString()}
                      </div>
                    </div>
                  )}
                  {hasValue(job.packageDetails?.fixedPay) && (
                    <div className="bg-gradient-to-br from-[#667eea]/5 to-[#764ba2]/5 p-4 rounded-lg border border-gray-200">
                      <div className="text-sm font-medium text-[#667eea]">Fixed Pay</div>
                      <div className="text-lg font-bold text-gray-900">
                        {job.packageDetails.currency || 'INR'} {job.packageDetails.fixedPay.toLocaleString()}
                      </div>
                    </div>
                  )}
                  {hasValue(job.packageDetails?.joiningBonus) && (
                    <div className="bg-gradient-to-br from-[#667eea]/5 to-[#764ba2]/5 p-4 rounded-lg border border-gray-200">
                      <div className="text-sm font-medium text-[#667eea]">Variable Pay</div>
                      <div className="text-lg font-bold text-gray-900">
                        {job.packageDetails.currency || 'INR'} {job.packageDetails.joiningBonus.toLocaleString()}
                      </div>
                    </div>
                  )}
                </div>
              )}
              {hasValue(job.internshipDuration) && (
                <div className="mb-4 p-4 bg-gradient-to-br from-[#667eea]/5 to-[#764ba2]/5 rounded-lg border border-gray-200">
                  <div className="text-sm font-medium text-[#667eea]">Internship Duration</div>
                  <div className="text-lg font-bold text-gray-900">{job.internshipDuration}</div>
                </div>
              )}
              {hasValue(job.numberOfOpenings) && (
                <div className="mb-4 p-4 bg-gradient-to-br from-[#667eea]/5 to-[#764ba2]/5 rounded-lg border border-gray-200">
                  <div className="text-sm font-medium text-[#667eea]">Number of Openings</div>
                  <div className="text-lg font-bold text-gray-900">{job.numberOfOpenings}</div>
                </div>
              )}
              {hasValidData(job.benefits) && (
                <>
                  <h4 className="font-medium text-[#667eea] mb-2">Benefits Offered</h4>
                  {renderTags(job.benefits)}
                </>
              )}
            </section>
          )}

          {/* Hiring Process */}
          {(normalizeSelectionProcess(job.selectionProcess)?.length > 0 || hasValidData(job.rounds)) && (
            <section className="mb-8">
              <h3 className="text-lg font-semibold mb-3 bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent">
                Hiring Process
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {normalizeSelectionProcess(job.selectionProcess)?.length > 0 && (
                  <div className="flex items-start">
                    <svg className="w-5 h-5 mt-1 mr-3 text-[#667eea] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                    </svg>
                    <div className="col-span-1 sm:col-span-2">
                      <div className="font-medium text-[#667eea] mb-2">Selection Process</div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {normalizeSelectionProcess(job.selectionProcess).map((step, index) => (
                          <div
                            key={index}
                            className="border border-gray-200 rounded-lg p-3 bg-white"
                          >
                            <div className="flex items-center gap-2 mb-1">
                              <div className="w-6 h-6 rounded-full bg-gradient-to-r from-[#667eea] to-[#764ba2] flex items-center justify-center">
                                <span className="text-xs font-bold text-white">{index + 1}</span>
                              </div>
                              <span className="text-sm font-medium text-gray-800">
                                Round {index + 1}
                              </span>
                            </div>
                            <p className="text-xs text-gray-600">{step}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                {hasValidData(job.rounds) && (
                  <div className="flex items-start">
                    <svg className="w-5 h-5 mt-1 mr-3 text-[#667eea] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                    </svg>
                    <div>
                      <div className="font-medium text-[#667eea]">Number of Rounds</div>
                      <div className="text-gray-700">{job.rounds.join(', ')}</div>
                    </div>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* About the Role */}
          {hasValue(job.description) && job.description !== 'No description provided' && (
            <section className="mb-8">
              <h3 className="text-lg font-semibold mb-3 bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent">
                About the Role
              </h3>
              <p className="text-gray-700 whitespace-pre-wrap">
                {job.description}
              </p>
            </section>
          )}

          {/* Eligibility Criteria */}
          {(hasValue(job.eligibilityCriteria) || (job.cgpa && job.cgpa > 0)) && (
            <section className="mb-8">
              <h3 className="text-lg font-semibold mb-3 bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent">
                Eligibility Criteria
              </h3>
              {hasValue(job.eligibilityCriteria) && (
                <p className="text-gray-700 whitespace-pre-wrap mb-3">
                  {job.eligibilityCriteria}
                </p>
              )}
              {job.cgpa && job.cgpa > 0 && (
                <div className="p-3 bg-gradient-to-br from-[#667eea]/5 to-[#764ba2]/5 rounded-lg border border-gray-200">
                  <span className="text-sm font-medium text-[#667eea]">Minimum CGPA: </span>
                  <span className="text-gray-900 font-bold">{job.cgpa}</span>
                </div>
              )}
            </section>
          )}

          {/* Additional Requirements */}
          {(hasValidData(job.certifications) || hasValue(job.minEducation) || hasValue(job.workAuthorization)) && (
            <section className="mb-8">
              <h3 className="text-lg font-semibold mb-3 bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent">
                Additional Requirements
              </h3>
              <div className="space-y-4">
                {hasValidData(job.certifications) && (
                  <div>
                    <div className="font-medium text-[#667eea] mb-2">Certifications</div>
                    {renderTags(job.certifications)}
                  </div>
                )}
                {hasValue(job.minEducation) && (
                  <div>
                    <div className="font-medium text-[#667eea] mb-2">Minimum Education</div>
                    <p className="text-gray-700">{job.minEducation}</p>
                  </div>
                )}
                {hasValue(job.workAuthorization) && (
                  <div>
                    <div className="font-medium text-[#667eea] mb-2">Work Authorization</div>
                    <p className="text-gray-700">{job.workAuthorization}</p>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* Important Dates */}
          {(hasValue(job.endDate) || hasValue(job.onlineTestDate) || hasValue(job.interviewWindow?.start) || hasValue(job.offerRolloutDate)) && (
            <section className="mb-8">
              <h3 className="text-lg font-semibold mb-3 bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent">
                Important Dates
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {hasValue(job.endDate) && formatDate(job.endDate) !== 'N/A' && (
                  <div className="bg-gradient-to-br from-[#667eea]/5 to-[#764ba2]/5 border border-gray-200 p-3 rounded-lg">
                    <div className="text-sm text-[#667eea]">Registration Deadline</div>
                    <div className="font-medium text-red-600">
                      {formatDate(job.endDate)}
                    </div>
                  </div>
                )}
                
                {hasValue(job.onlineTestDate) && formatDate(job.onlineTestDate) !== 'N/A' && (
                  <div className="bg-gradient-to-br from-[#667eea]/5 to-[#764ba2]/5 border border-gray-200 p-3 rounded-lg">
                    <div className="text-sm text-[#667eea]">Online Test Date</div>
                    <div className="font-medium text-gray-700">
                      {formatDate(job.onlineTestDate)}
                    </div>
                  </div>
                )}
                
                {hasValue(job.interviewWindow?.start) && (
                  <div className="bg-gradient-to-br from-[#667eea]/5 to-[#764ba2]/5 border border-gray-200 p-3 rounded-lg">
                    <div className="text-sm text-[#667eea]">Interview Window</div>
                    <div className="font-medium text-gray-700">
                      {formatDate(job.interviewWindow.start)} - {formatDate(job.interviewWindow.end)}
                    </div>
                  </div>
                )}
                
                {hasValue(job.offerRolloutDate) && formatDate(job.offerRolloutDate) !== 'N/A' && (
                  <div className="bg-gradient-to-br from-[#667eea]/5 to-[#764ba2]/5 border border-gray-200 p-3 rounded-lg">
                    <div className="text-sm text-[#667eea]">Offer Rollout</div>
                    <div className="font-medium text-gray-700">
                      {formatDate(job.offerRolloutDate)}
                    </div>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* Tags */}
          {hasValidData(job.tags) && (
            <section className="mb-8">
              <h3 className="text-lg font-semibold mb-3 bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent">
                Tags
              </h3>
              {renderTags(job.tags)}
            </section>
          )}

          {/* Amenities Required (for on-campus) */}
          {hasValidData(job.amenitiesRequired) && (
            <section className="mb-8">
              <h3 className="text-lg font-semibold mb-3 bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent">
                Amenities Required
              </h3>
              {renderTags(job.amenitiesRequired)}
            </section>
          )}

          {/* Contact Person */}
          {hasValidObject(job.contactPerson, ['name', 'email', 'mobile', 'designation']) && (
            <section className="mb-8">
              <h3 className="text-lg font-semibold mb-3 bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent">
                Contact Person
              </h3>
              <div className="bg-gradient-to-br from-[#667eea]/5 to-[#764ba2]/5 p-4 rounded-lg border border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {hasValue(job.contactPerson.name) && (
                    <div>
                      <div className="text-sm font-medium text-[#667eea]">Name</div>
                      <div className="text-gray-900">{job.contactPerson.name}</div>
                    </div>
                  )}
                  {hasValue(job.contactPerson.designation) && (
                    <div>
                      <div className="text-sm font-medium text-[#667eea]">Designation</div>
                      <div className="text-gray-900">{job.contactPerson.designation}</div>
                    </div>
                  )}
                  {hasValue(job.contactPerson.email) && (
                    <div>
                      <div className="text-sm font-medium text-[#667eea]">Email</div>
                      <div className="text-gray-900">{job.contactPerson.email}</div>
                    </div>
                  )}
                  {hasValue(job.contactPerson.mobile) && (
                    <div>
                      <div className="text-sm font-medium text-[#667eea]">Mobile</div>
                      <div className="text-gray-900">{job.contactPerson.mobile}</div>
                    </div>
                  )}
                </div>
              </div>
            </section>
          )}

          {/* Bottom Back Button */}
          <section className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex justify-left">
              <button 
                onClick={handleBackToList} 
                className="inline-flex items-center px-6 py-3 bg-white text-[#667eea] border border-[#667eea] hover:bg-gradient-to-r hover:from-[#667eea] hover:to-[#764ba2] hover:text-white rounded-xl transition-all duration-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
                Back
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default UnifiedJobDetail;