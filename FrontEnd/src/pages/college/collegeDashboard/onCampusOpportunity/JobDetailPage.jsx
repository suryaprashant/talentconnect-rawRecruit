import { ApplyForOnCampus, getCompanyPostingForOncampusDetail, SaveOppurtunity } from '@/lib/College_AxiosIntance';
import { viewed } from '@/lib/User_AxiosInstance';
import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';

// Utility function to format date
const formatDate = (dateString) => {
  if (!dateString || dateString === 'Not Specified') return 'Not Specified';

  try {
    const date = new Date(dateString);
    // Check for invalid date
    if (isNaN(date.getTime())) {
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

// ---------- TEXT TO BULLETS ----------
const splitIntoMeaningfulPoints = (text) => {
  if (!text || typeof text !== 'string') return [];

  return text
    // split by full stop, newline, or semicolon
    .split(/[\.\n;]+/)
    .map(line => line.trim())
    .filter(line => line.length > 5); // ignore junk
};

const normalizeSelectionProcess = (selectionProcess) => {
  if (!selectionProcess) return [];

  // Case 1: already an array → return clean
  if (Array.isArray(selectionProcess)) {
    return selectionProcess.flatMap(step =>
      step.includes('+')
        ? step.split('+').map(s => s.trim())
        : splitIntoMeaningfulPoints(step)
    );
  }

  // Case 2: string → split by + or sentences
  if (typeof selectionProcess === 'string') {
    if (selectionProcess.includes('+')) {
      return selectionProcess.split('+').map(s => s.trim());
    }
    return splitIntoMeaningfulPoints(selectionProcess);
  }

  return [];
};

const JobDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isApplied = (searchParams.get('isApplied') || '').toLowerCase() === 'true';
  const isSaved = (searchParams.get('isSaved') || '').toLowerCase() === 'true';
  const [job, setJob] = useState(null);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState(null);

  const loadJobDetail = async () => {
  try {
    const response = await getCompanyPostingForOncampusDetail(id);
    
    // Check if response and response.data exist before using them
    if (response && response.data) {
      setJob(response.data);
      // Use optional chaining (?.) to prevent crashes
      await viewed(response.data?._id);
      setError(null);
    } else {
      setError("Job details not found.");
    }
  } catch (error) {
    console.error("Error loading job detail: ", error);
    setError("Failed to load job details. Please try again later.");
    setJob(null); // Clear previous job state on error
  }
};
  useEffect(() => {
    loadJobDetail();
  }, [id]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${job?.jobTitle || 'Job'} at ${job?.companyPosted?.companyDetails?.companyName}`,
        text: `Check out this opportunity for a ${job?.jobTitle || 'job'} at ${job?.companyPosted?.companyDetails?.companyName}!`,
        url: window.location.href,
      })
        .catch((error) => console.log('Error sharing', error));
    } else {
      navigator.clipboard.writeText(window.location.href)
        .then(() => alert('Link copied to clipboard!'))
        .catch(() => alert('Failed to copy link'));
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleApply = async () => {
    try {
      const response = await ApplyForOnCampus(id);
      if (response.data?.success === true) toast.success("Applied!");
      else toast.error(response.response?.data?.msg || "Could not apply.");
    } catch (error) {
      console.log("Error: ", error);
      toast.error('Something went wrong');
    }
  };

//console.log(jo)
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


  const handleSave = async (jobId, jobType) => {
    if (!jobId || !jobType) return;
    try {
      const response = await SaveOppurtunity(jobId, jobType);
      if (response.data?.success === true) {
        toast.success("Saved!");
        setSaved(true); // Update save state
      }
      else toast.error(response.response?.data?.msg || "Could not save.");
    } catch (error) {
      console.log("Error: ", error);
      toast.error('Something went wrong');
    }
  };
////////////////////////////////////////////////


if (error) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#667eea]/5 via-[#f093fb]/5 to-[#764ba2]/5 flex items-center justify-center">
        <div className="text-center">
          <p className="mt-4 text-red-600">{error}</p>
          <button
            onClick={loadJobDetail}
            className="mt-4 px-4 py-2 bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white rounded-lg hover:shadow-lg hover:shadow-[#667eea]/30 transition-all duration-200"
            >
            Retry
          </button>
        </div>
      </div>
    );
  }
  
  if (!job) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#667eea]/5 via-[#f093fb]/5 to-[#764ba2]/5 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#667eea] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading registration details...</p>
        </div>
      </div>
    );
    
  }
const jobStatus = getJobStatus();


  return (
    <div className="min-h-screen bg-gradient-to-br from-[#667eea]/5 via-[#f093fb]/5 to-[#764ba2]/5">
     <main className="px-6 py-6">
        <button onClick={() => handleGoBack()} className="inline-flex items-center text-[#667eea] hover:text-[#764ba2] mb-6 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back
        </button>

        <div className="bg-white/90 backdrop-blur-sm border border-gray-100 rounded-xl shadow-lg overflow-hidden">
          {/* Header Section */}
          <div className="border-b border-gray-200 bg-gradient-to-r from-[#667eea]/5 to-[#764ba2]/5 px-6 py-4">
            {
              jobStatus.status ==='Completed' && (

                <div className="text-sm font-medium text-[#667eea]">Registrations Completed</div>
              )
            }
  {
              jobStatus.status !='Completed' && (

                <div className="text-sm font-medium text-[#667eea]">Registration Open</div>
              )
            }

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mt-2">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent">
                {job?.companyPosted?.companyDetails?.companyName || 'Not Specified'}
              </h1>
              {/* <div className="flex items-center mt-2 md:mt-0">
                <a
                  href={job?.companyPosted?.companyDetails?.collegeWebsite ? `https://${job.companyPosted.companyDetails.collegeWebsite.replace(/^https?:\/\//, '')}` : '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#667eea] hover:text-[#764ba2] text-sm mr-6 transition-colors"
                  title="Visit Company Website"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div> */}
            </div>

            <div className="flex flex-col sm:flex-row justify-between mt-4">
              <div className="flex items-center text-sm text-gray-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-[#667eea]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>{formatDate(job?.startDate)} - {formatDate(job?.endDate)}</span>
              </div>
              <div className="flex items-center mt-2 sm:mt-0 text-sm text-gray-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-[#667eea]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>{job?.workLocation?.join(', ') || 'Not Specified'}</span>
              </div>
            </div>

            <div className="flex space-x-2 mt-4">
              {!isApplied && (<>
                <button 
                  className="inline-flex items-center justify-center px-4 py-2 bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white text-sm font-medium rounded-lg hover:shadow-lg hover:shadow-[#667eea]/30 transition-all duration-200" 
                  onClick={handleApply}
                >
                  Register Now
                </button>
                {!isSaved && (<button
                  onClick={() => handleSave(job?._id, job?.jobType)}
                  disabled={saved}
                  className={`inline-flex items-center justify-center px-4 py-2 border ${saved ? 'border-gray-300 bg-gray-50 text-gray-400 cursor-not-allowed' : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'} text-sm font-medium rounded-lg transition-all duration-200`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 mr-1 ${saved ? 'text-[#667eea]' : 'text-gray-400'}`} viewBox="0 0 20 20" fill={saved ? 'currentColor' : 'none'} stroke="currentColor">
                    <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                  </svg>
                  {saved ? 'Saved' : 'Save'}
                </button>)}
              </>)}
              <button
                onClick={handleShare}
                className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-50 transition-all duration-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                </svg>
                Share
              </button>
            </div>
          </div>

          {/* About Section */}
          <div className="px-6 py-6">
            <h2 className="text-xl font-bold bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent mb-4">
              About {job?.companyPosted?.companyDetails?.companyName || 'the Company'}
            </h2>
            <p className="text-gray-700 mb-6">{job?.companyPosted?.companyDetails?.description || 'No description provided.'}</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-gradient-to-br from-[#667eea]/5 to-[#764ba2]/5 p-4 rounded-lg">
                <div className="text-2xl font-bold text-gray-900">{job?.companyPosted?.companyDetails?.numberOfEmployees || 'N/A'}</div>
                <div className="text-sm text-gray-600">Employees</div>
              </div>
              <div className="bg-gradient-to-br from-[#667eea]/5 to-[#764ba2]/5 p-4 rounded-lg">
                <div className="text-2xl font-bold text-gray-900">{job?.companyPosted?.companyDetails?.industryType || 'N/A'}</div>
                <div className="text-sm text-gray-600">Industries</div>
              </div>
              <div className="bg-gradient-to-br from-[#667eea]/5 to-[#764ba2]/5 p-4 rounded-lg">
                <div className="text-2xl font-bold text-gray-900">{job?.country || job?.companyPosted?.companyDetails?.country || 'N/A'}</div>
                <div className="text-sm text-gray-600">Countries</div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="px-6 py-6 border-t border-gray-200">
            <h2 className="text-xl font-bold bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent mb-4">
              {job.lookingFor} Description
            </h2>
            <div className="prose max-w-none text-gray-700">
              <div className="prose max-w-none text-gray-700">
  {job?.description ? (
    <ul className="list-disc pl-5 space-y-1">
      {splitIntoMeaningfulPoints(job.description).map((point, index) => (
        <li key={index}>{point}</li>
      ))}
    </ul>
  ) : (
    <p>No job description provided.</p>
  )}
</div>
            </div>
          </div>

          {/* Job Details */}
          <div className="px-6 py-6 border-t border-gray-200">
            <h2 className="text-xl font-bold bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent mb-4">
              Job Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
              <div>
                <div className="text-sm font-medium text-[#667eea]">Looking For</div>
                <div className="mt-1 text-base text-gray-900">{job?.lookingFor || 'Not Specified'}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-[#667eea]">Employment Type</div>
                <div className="mt-1 text-base text-gray-900">{job?.employmentType?.join(', ') || 'Not Specified'}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-[#667eea]">Job Roles</div>
                <div className="mt-1 text-base text-gray-900">{job?.jobRoles?.join(', ') || 'Not Specified'}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-[#667eea]">Work Mode</div>
                <div className="mt-1 text-base text-gray-900">{job?.workMode?.join(', ') || 'Not Specified'}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-[#667eea]">Preferred Hiring Mode</div>
                <div className="mt-1 text-base text-gray-900">{job?.companyHiringPreference?.preferredMode || 'Not Specified'}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-[#667eea]">Amenities/Facilities Required</div>
                <div className="mt-1 text-base text-gray-900">{job?.amenitiesRequired?.join(', ') || 'None'}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-[#667eea]">Job Location</div>
                <div className="mt-1 text-base text-gray-900">{job?.workLocation?.join(', ') || 'Not Specified'}</div>
              </div>
            </div>
          </div>

          {/* Required Skills */}
          <div className="px-6 py-6 border-t border-gray-200">
            <h2 className="text-xl font-bold bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent mb-4">
              Required Skills
            </h2>
            <div className="flex flex-wrap gap-2">
              {job?.skills && job?.skills.length > 0 ? (
                job.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="bg-gradient-to-br from-[#667eea]/10 to-[#764ba2]/10 text-gray-800 px-3 py-1.5 rounded-md text-sm font-medium border border-gray-200"
                  >
                    {skill}
                  </span>
                ))
              ) : (
                <p className="text-gray-500">No specific skills mentioned.</p>
              )}
            </div>
          </div>

          {/* Eligibility Criteria */}
          <div className="px-6 py-6 border-t border-gray-200">
            <h2 className="text-xl font-bold bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent mb-4">
              Eligibility Criteria
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8 mb-4">
              <div>
                <div className="text-sm font-medium text-[#667eea]">Eligible Degrees</div>
                <div className="mt-1 text-base text-gray-900">{job?.degree?.join(' / ') || 'Not Specified'}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-[#667eea]">Eligible Streams</div>
                <div className="mt-1 text-base text-gray-900">{job?.studentStreams?.join(', ') || 'Not Specified'}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-[#667eea]">Eligible College Categories</div>
                <div className="mt-1 text-base text-gray-900">{job?.collegeCategories?.join(', ') || 'Not Specified'}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-[#667eea]">Minimum Students Required</div>
                <div className="mt-1 text-base text-gray-900">{job?.minimumStudents || 'Not Specified'}</div>
              </div>
            </div>
            {job?.eligibilityCriteria && (
  <div>
    <div className="text-sm font-medium text-[#667eea]">Additional Criteria</div>
    <ul className="mt-1 list-disc pl-5 text-base text-gray-700 space-y-1">
      {splitIntoMeaningfulPoints(job.eligibilityCriteria).map((point, index) => (
        <li key={index}>{point}</li>
      ))}
    </ul>
  </div>
)}

          </div>

          {/* Compensation & Benefits */}
          <div className="px-6 py-6 border-t border-gray-200">
            <h2 className="text-xl font-bold bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent mb-4">
              Compensation & Benefits
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-gradient-to-br from-[#667eea]/5 to-[#764ba2]/5 p-4 rounded-lg">
                <div className="text-sm font-medium text-[#667eea]">Total CTC</div>
                <div className="text-xl font-bold text-gray-900">
                  {job?.packageDetails?.totalCTC
                    ? `${job.packageDetails.currency || ''} ${job.packageDetails.totalCTC.toLocaleString()}`
                    : 'Not Specified'}
                </div>
              </div>
              <div className="bg-gradient-to-br from-[#667eea]/5 to-[#764ba2]/5 p-4 rounded-lg">
                <div className="text-sm font-medium text-[#667eea]">Fixed Pay</div>
                <div className="text-xl font-bold text-gray-900">
                  {job?.packageDetails?.fixedPay
                    ? `${job.packageDetails.currency || ''} ${job.packageDetails.fixedPay.toLocaleString()}`
                    : 'N/A'}
                </div>
              </div>
              <div className="bg-gradient-to-br from-[#667eea]/5 to-[#764ba2]/5 p-4 rounded-lg">
                <div className="text-sm font-medium text-[#667eea]">Variable Pay</div>
                <div className="text-xl font-bold text-gray-900">
                  {job?.packageDetails?.joiningBonus
                    ? `${job.packageDetails.currency || ''} ${job.packageDetails.joiningBonus.toLocaleString()}`
                    : 'N/A'}
                </div>
              </div>
            </div>
            <h3 className="font-medium text-[#667eea] mt-6 mb-3">Benefits Offered</h3>
<div className="flex flex-wrap gap-2">
  {job?.benefits && job?.benefits.length > 0 ? (
    job.benefits.map((benefit, index) => (
      <span
        key={index}
        className="px-3 py-1.5 bg-gradient-to-r from-[#667eea]/10 to-[#764ba2]/10 text-[#667eea] border border-[#667eea]/20 rounded-full text-sm font-medium"
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

          {/* Selection Process - Grid Style */}
<div className="px-6 py-4 border-t border-gray-200">
  <div className="mb-4">
    <h2 className="text-xl font-bold bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent mb-1">
      Selection Process
    </h2>
    <div className="text-md text-gray-500">
      Number of rounds: {job?.rounds || job?.selectionProcess?.length || 0}
    </div>
  </div>

  {job?.selectionProcess && job?.selectionProcess?.length > 0 ? (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {normalizeSelectionProcess(job.selectionProcess).map((step, index) => (
        <div 
          key={index}
          className="group bg-white border border-gray-200 rounded-lg p-3 hover:border-[#667eea]/30 hover:shadow-sm transition-all duration-200"
        >
          <div className="flex items-center gap-2 mb-2">
            {/* Round number badge */}
            <div className="w-6 h-6 rounded-full bg-gradient-to-r from-[#667eea] to-[#764ba2] flex items-center justify-center">
              <span className="text-xs font-bold text-white">{index + 1}</span>
            </div>
            <p className="text-sm font-medium text-gray-900">Round {index + 1}</p>
          </div>
          
          {/* Step content */}
          <p className="text-xs text-gray-600 line-clamp-3">{step}</p>
        </div>
      ))}
    </div>
  ) : (
    <div className="bg-gradient-to-br from-[#667eea]/5 to-[#764ba2]/5 rounded-lg p-4">
      <p className="text-sm text-gray-500 text-center">Selection process details not provided.</p>
    </div>
  )}
</div>

          {/* Important Dates */}
          <div className="px-6 py-6 border-t border-gray-200">
            <h2 className="text-xl font-bold bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent mb-4">
              Important Dates
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="border border-gray-300 rounded-lg p-4 text-center bg-gradient-to-br from-[#667eea]/5 to-[#764ba2]/5">
                <div className="text-sm font-medium text-[#667eea]">Registration Deadline</div>
                <div className="mt-1 text-lg font-medium text-gray-900">{formatDate(job?.endDate)}</div>
              </div>
              <div className="border border-gray-300 rounded-lg p-4 text-center bg-gradient-to-br from-[#667eea]/5 to-[#764ba2]/5">
                <div className="text-sm font-medium text-[#667eea]">Online Test Date</div>
                <div className="mt-1 text-lg font-medium text-gray-900">{formatDate(job?.onlineTestDate)}</div>
              </div>
              <div className="border border-gray-300 rounded-lg p-4 text-center bg-gradient-to-br from-[#667eea]/5 to-[#764ba2]/5">
                <div className="text-sm font-medium text-[#667eea]">Interview Window</div>
                <div className="mt-1 text-lg font-medium text-gray-900">
                  {formatDate(job?.interviewWindow?.start) === 'Not Specified' ? 'N/A' : `${formatDate(job?.interviewWindow?.start)} - ${formatDate(job?.interviewWindow?.end)}`}
                </div>
              </div>
              <div className="border border-gray-300 rounded-lg p-4 text-center bg-gradient-to-br from-[#667eea]/5 to-[#764ba2]/5">
                <div className="text-sm font-medium text-[#667eea]">Offer Rollout</div>
                <div className="mt-1 text-lg font-medium text-gray-900">{formatDate(job?.offerRolloutDate)}</div>
              </div>
            </div>
          </div>

          {/* Contact Person */}
          <div className="px-6 border-t border-gray-200">
            <h2 className="text-xl font-bold bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent mb-4 pt-6">
              Contact Person
            </h2>

            <div className="bg-gradient-to-br from-[#667eea]/5 to-[#764ba2]/5 p-4 rounded-lg">
              <div className="flex items-start">
                <div className="mr-3 flex-shrink-0">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#667eea]/20 to-[#764ba2]/20 flex items-center justify-center text-[#667eea]">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                </div>
                <div>
                  <div className="text-base font-medium text-gray-900">
                    {job?.contactPerson?.name || 'Not Specified'} 
                    <span className='text-sm text-gray-500 ml-2'>({job?.contactPerson?.designation || 'N/A'})</span>
                  </div>
                  {job?.contactPerson?.email && (
                    <div className="flex items-center mt-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#667eea] mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <a href={`mailto:${job.contactPerson.email}`} className="text-[#667eea] hover:text-[#764ba2] text-sm transition-colors">{job.contactPerson.email}</a>
                    </div>
                  )}
                  {job?.contactPerson?.mobile && (
                    <div className="flex items-center mt-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#667eea] mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <a href={`tel:${job.contactPerson.mobile}`} className="text-[#667eea] hover:text-[#764ba2] text-sm transition-colors">{job.contactPerson.mobile}</a>
                    </div>
                  )}
                  {job?.contactPerson?.linkedin && (
                    <a href={job.contactPerson.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center mt-1 text-[#667eea] hover:text-[#764ba2] transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.761 0 5-2.239 5-5v-14c0-2.761-2.239-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.783-1.75-1.75s.784-1.75 1.75-1.75 1.75.783 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-1.339-.025-3.059-1.868-3.059-1.87 0-2.158 1.46-2.158 2.965v5.698h-3v-11h2.889v1.336h.04c.401-.762 1.383-1.563 2.83-1.563 3.029 0 3.588 1.993 3.588 4.582v6.645z" />
                      </svg>
                      <span className="text-sm">LinkedIn</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default JobDetailPage;