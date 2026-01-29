import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  MapPin, 
  Calendar, 
  DollarSign, 
  Briefcase, 
  Users, 
  Award,
  Globe,
  Mail,
  Phone,
  Linkedin,
  Share2,
  Save,
  CheckCircle,
  Building,
  GraduationCap,
  BookOpen,
  Tag,
  Clock,
  FileText
} from 'lucide-react';
import { ApplyForOppurtunity, getJobDetails, SaveOppurtunity } from '@/lib/User_AxiosInstance';
import toast from 'react-hot-toast';

// Utility function to format date
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';

  const date = new Date(dateString);
  if (isNaN(date.getTime())) return 'N/A';

  return date.toLocaleDateString('en-GB');
};



// Split long paragraph into meaningful bullet points
const splitIntoBullets = (text) => {
  if (!text || typeof text !== "string") return [];

  return text
    .split(/[\.\n;]+/)
    .map(line => line.trim())
    .filter(line => line.length > 5);
};

// Helper function to normalize selection process data
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

// Helper function to render array data as tags
const renderTags = (data) => {
  if (Array.isArray(data) && data.length > 0) {
    return (
      <div className="flex flex-wrap gap-2 mt-1">
        {data.map((item, index) => (
          <span key={index} className="bg-gradient-to-br from-[#667eea]/10 to-[#764ba2]/10 text-gray-800 text-sm font-medium px-3 py-1.5 rounded-full capitalize border border-gray-200">
            {item}
          </span>
        ))}
      </div>
    );
  }
  return <span className="text-gray-700">N/A</span>;
};

const OffCampusJobDetailModal = ({ jobId, isOpen, onClose, isApplied: propIsApplied, isSaved: propIsSaved, isInZoomedView = false }) => {
  const [jobDetail, setJobDetail] = useState(null);
  const [saved, setSaved] = useState(propIsSaved || false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const modalRef = useRef(null);
  const contentRef = useRef(null);

  const loadJobDetails = async () => {
    if (!jobId) return;
    
    try {
      setLoading(true);
      const details = await getJobDetails(jobId);
      console.log('Job details response:', details);
      
      if (details && details.data) {
        const jobData = details.data.data || details.data[0] || details.data;
        if (jobData) {
          setJobDetail(jobData);
          setError(null);
        } else {
          setError("Job details not found in response.");
        }
      } else {
        setError("No response data received.");
      }
    } catch (err) {
      console.error("Error loading job detail: ", err);
      setError("Failed to load job details. Please try again later.");
      setJobDetail(null);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    if (isOpen && jobId) {
      loadJobDetails();
    }
  }, [isOpen, jobId]);

  // Close modal on Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  // Prevent body scroll when modal is open (only for normal view)
  useEffect(() => {
    if (isOpen && !isInZoomedView) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, isInZoomedView]);

  // Close modal when clicking outside (only for normal view)
  useEffect(() => {
    if (!isInZoomedView) {
      const handleClickOutside = (e) => {
        if (modalRef.current && !modalRef.current.contains(e.target)) {
          onClose();
        }
      };
      if (isOpen) {
        document.addEventListener('mousedown', handleClickOutside);
      }
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen, onClose, isInZoomedView]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${jobDetail?.jobTitle || 'Job'} at ${jobDetail?.companyName || jobDetail?.companyPosted?.companyDetails?.companyName}`,
        text: `Check out this job opportunity at ${jobDetail?.companyName || jobDetail?.companyPosted?.companyDetails?.companyName}!`,
        url: window.location.href,
      })
        .catch((error) => console.log('Error sharing', error));
    } else {
      navigator.clipboard.writeText(window.location.href)
        .then(() => toast.success('Link copied to clipboard!'))
        .catch(() => toast.error('Failed to copy link'));
    }
  };

  const handleApply = async () => {
    if (!jobId) return;
    
    setIsSubmitting(true);
    try {
      const response = await ApplyForOppurtunity(jobId);
      console.log('Apply response:', response);
      if (response?.data?.success === true) {
        toast.success('Application submitted successfully!');
        onClose();
      } else {
        toast.error(response.response?.data?.msg || "Could not appaaly.");
      }
    } catch (error) {
      console.log("Error applying: ", error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getJobStatus = () => {
    if (!jobDetail?.startDate || !jobDetail?.endDate) {
      return { status: 'Active', color: 'bg-green-100 text-green-700' };
    }

    const now = new Date();
    const startDate = new Date(jobDetail.startDate);
    const endDate = new Date(jobDetail.endDate);

    if (now < startDate) {
      return { status: 'Upcoming', color: 'bg-blue-100 text-blue-700' };
    } else if (now >= startDate && now <= endDate) {
      return { status: 'Active', color: 'bg-green-100 text-green-700' };
    } else {
      return { status: 'Closed', color: 'bg-gray-100 text-gray-700' };
    }
  };

  const handleSave = async () => {
    if (!jobDetail?._id) return;
    
    try {
      const jobType = jobDetail?.jobType || "Off-campus";
      const response = await SaveOppurtunity(jobDetail._id, jobType);
      if (response?.data?.success === true) {
        toast.success('Job saved!');
        setSaved(true);
      } else {
        toast.error(response.response?.data?.msg || "Could not save.");
      }
    } catch (error) {
      console.log("Error: ", error);
      toast.error('Something went wrong');
    }
  };

  if (!isOpen) return null;

  // Render loading state
  if (loading) {
    return (
      <div className="relative w-full h-full bg-white flex items-center justify-center rounded-l-2xl">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#667eea]"></div>
      </div>
    );
  }

  // Render error state
  if (error || !jobDetail) {
    return (
      <div className="relative w-full h-full bg-white flex items-center justify-center rounded-l-2xl">
        <div className="p-8 max-w-md w-full">
          <div className="flex flex-col items-center text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-100 text-red-600 mb-4">
              <X className="h-6 w-6" />
            </div>
            <p className="text-lg font-medium text-gray-900 mb-4">{error || 'Job not found'}</p>
            <button
              onClick={onClose}
              className="px-6 py-3 bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white rounded-xl hover:shadow-lg hover:shadow-[#667eea]/30 transition-all duration-300"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  const jobStatus = getJobStatus();
  const isApplied = propIsApplied || jobDetail.isApplied || false;
  const companyName = jobDetail?.companyName || jobDetail?.companyPosted?.companyDetails?.companyName || 'Company';
  const workLocation = jobDetail?.workLocation?.join(', ') || jobDetail?.location || 'Not Specified';
  
  // Format salary
  const formatSalary = () => {
    if (jobDetail.salaryRange?.min || jobDetail.salaryRange?.max) {
      const min = jobDetail.salaryRange.min?.toLocaleString() || 'Negotiable';
      const max = jobDetail.salaryRange.max?.toLocaleString() || 'Negotiable';
      return min === max ? `₹${min}` : `₹${min} - ₹${max}`;
    }
    if (jobDetail.packageDetails?.totalCTC) {
      return `₹${jobDetail.packageDetails.totalCTC.toLocaleString()}`;
    }
    return 'Not Disclosed';
  };

  // Format work mode
  const formatWorkMode = () => {
    if (Array.isArray(jobDetail.workMode)) {
      return jobDetail.workMode.join(', ');
    }
    return jobDetail.workMode || 'Not specified';
  };

  // Get normalized selection process
  const selectionProcess = normalizeSelectionProcess(jobDetail.selectionProcess);

  return (
    <>
      <div
        ref={modalRef}
        className={`relative w-full h-full bg-white ${isInZoomedView ? '' : 'rounded-l-2xl'} overflow-hidden flex flex-col`}
      >
        {/* Close button - only show in normal view */}
        {!isInZoomedView && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-50 p-2 bg-white/90 backdrop-blur-sm hover:bg-gray-100 rounded-full shadow-lg transition-colors"
          >
            <X className="h-6 w-6 text-gray-700" />
          </button>
        )}

        {/* Main Content Area - Single scroll container */}
        <div ref={contentRef} className="flex-1 overflow-y-auto bg-gradient-to-br from-[#667eea]/5 via-[#f093fb]/5 to-[#764ba2]/5">
          <div className="p-6">
            {/* Header Section - Updated with location */}
            <div className="bg-gradient-to-r from-[#667eea]/5 to-[#764ba2]/5 px-6 py-5 rounded-xl mb-6">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-medium text-[#667eea]">
                      {jobStatus.status === 'Closed' ? 'Registrations Completed' : 'Registration Open'}
                    </span>
                  </div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent">
                    {companyName}
                  </h1>
                  
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 mt-3">
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="h-4 w-4 mr-2 text-[#667eea]" />
                      <span>Posted: {formatDate(jobDetail?.createdAt)}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="h-4 w-4 mr-2 text-[#667eea]" />
                      <span>{workLocation}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Save and Share buttons */}
              <div className="flex space-x-3 mt-4">
                {!saved && !isApplied && (
                  <button
                    onClick={handleSave}
                    disabled={saved}
                    className={`inline-flex items-center justify-center px-4 py-2 border ${saved ? 'border-gray-300 bg-gray-50 text-gray-400 cursor-not-allowed' : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'} text-sm font-medium rounded-lg transition-all duration-200`}
                  >
                    <Save className={`h-5 w-5 mr-2 ${saved ? 'text-[#667eea]' : 'text-gray-400'}`} fill={saved ? 'currentColor' : 'none'} />
                    {saved ? 'Saved' : 'Save'}
                  </button>
                )}
                <button
                  onClick={handleShare}
                  className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-50 transition-all duration-200"
                >
                  <Share2 className="h-5 w-5 mr-2 text-gray-400" />
                  Share
                </button>
              </div>
            </div>

            <div className="bg-white/90 backdrop-blur-sm border border-gray-100 rounded-xl shadow-lg overflow-hidden">
              {/* About Company */}
              <div className="px-6 py-6">
                <h2 className="text-xl font-bold bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent mb-4">
                  About {companyName}
                </h2>
                <p className="text-gray-700 mb-8">
                  {jobDetail.companyPosted?.companyDetails?.description || 
                   jobDetail.companyDescription || 
                   'No company description available.'}
                </p>
                
                {/* Company stats if available */}
                {jobDetail.companyPosted?.companyDetails && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                    {(jobDetail.companyPosted.companyDetails.numberOfEmployees || 
                      jobDetail.companyPosted.companyDetails.numberOfEmployees === 0) && (
                      <div className="bg-gradient-to-br from-[#667eea]/5 to-[#764ba2]/5 p-5 rounded-lg text-center">
                        <div className="text-3xl font-bold text-gray-900 mb-2">
                          {jobDetail.companyPosted.companyDetails.numberOfEmployees.toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-600 font-medium">Employees</div>
                      </div>
                    )}
                    {jobDetail.companyPosted.companyDetails.industryType && (
                      <div className="bg-gradient-to-br from-[#667eea]/5 to-[#764ba2]/5 p-5 rounded-lg text-center">
                        <div className="text-3xl font-bold text-gray-900 mb-2 truncate">
                          {jobDetail.companyPosted.companyDetails.industryType}
                        </div>
                        <div className="text-sm text-gray-600 font-medium">Industry</div>
                      </div>
                    )}
                    {jobDetail.companyPosted.companyDetails.country && (
                      <div className="bg-gradient-to-br from-[#667eea]/5 to-[#764ba2]/5 p-5 rounded-lg text-center">
                        <div className="text-3xl font-bold text-gray-900 mb-2">
                          {jobDetail.companyPosted.companyDetails.country}
                        </div>
                        <div className="text-sm text-gray-600 font-medium">Country</div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Job Description */}
              {jobDetail.description && (
                <div className="px-6 py-6 border-t border-gray-100">
                  <h2 className="text-xl font-bold bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent mb-4">
                    Job Description
                  </h2>
                  <div className="text-gray-700 whitespace-pre-wrap">
                    {jobDetail.description}
                  </div>
                </div>
              )}

              {/* Job Details */}
              <div className="px-6 py-6 border-t border-gray-100">
                <h2 className="text-xl font-bold bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent mb-4">
                  Job Details
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <div>
                      <div className="text-sm font-medium text-[#667eea] mb-1">Employment Type</div>
                      <div className="text-base text-gray-900">{jobDetail.employmentType?.join(', ') || 'Not Specified'}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-[#667eea] mb-1">Job Roles</div>
                      <div className="text-base text-gray-900">{jobDetail.jobRoles?.join(', ') || 'Not Specified'}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-[#667eea] mb-1">Work Mode</div>
                      <div className="text-base text-gray-900">{formatWorkMode()}</div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <div className="text-sm font-medium text-[#667eea] mb-1">Experience Level</div>
                      <div className="text-base text-gray-900">{jobDetail.experienceLevel || 'Entry Level'}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-[#667eea] mb-1">Job Location</div>
                      <div className="text-base text-gray-900">{workLocation}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-[#667eea] mb-1">Notice Period</div>
                      <div className="text-base text-gray-900">{jobDetail.noticePeriod || 'Immediate to 30 days'}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Job Overview - Stats */}
              <div className="px-6 py-6 border-t border-gray-100">
                <h2 className="text-xl font-bold bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent mb-4">
                  Job Overview
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                  <div className="bg-gradient-to-br from-[#667eea]/5 to-[#764ba2]/5 p-5 rounded-lg text-center">
                    <div className="flex items-center justify-center mb-2">
                      <DollarSign className="h-5 w-5 text-[#667eea] mr-2" />
                      <span className="text-sm font-medium text-[#667eea]">Salary Package</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">{formatSalary()}</div>
                  </div>
                  <div className="bg-gradient-to-br from-[#667eea]/5 to-[#764ba2]/5 p-5 rounded-lg text-center">
                    <div className="flex items-center justify-center mb-2">
                      <Briefcase className="h-5 w-5 text-[#667eea] mr-2" />
                      <span className="text-sm font-medium text-[#667eea]">Work Mode</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">{formatWorkMode()}</div>
                  </div>
                  <div className="bg-gradient-to-br from-[#667eea]/5 to-[#764ba2]/5 p-5 rounded-lg text-center">
                    <div className="flex items-center justify-center mb-2">
                      <Calendar className="h-5 w-5 text-[#667eea] mr-2" />
                      <span className="text-sm font-medium text-[#667eea]">Application Deadline</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">
                      {jobDetail.applicationDeadline ? formatDate(jobDetail.applicationDeadline) : 'Rolling Basis'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Required Skills */}
              {jobDetail?.skills && jobDetail?.skills.length > 0 && (
                <div className="px-6 py-6 border-t border-gray-100">
                  <h2 className="text-xl font-bold bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent mb-4">
                    Required Skills
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {jobDetail.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="bg-gradient-to-br from-[#667eea]/10 to-[#764ba2]/10 text-gray-800 px-3 py-1.5 rounded-md text-sm font-medium border border-gray-200"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Eligibility Criteria */}
              <div className="px-6 py-6 border-t border-gray-100">
                <h2 className="text-xl font-bold bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent mb-4">
                  Eligibility Criteria
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="space-y-4">
                    <div>
                      <div className="text-sm font-medium text-[#667eea] mb-1">Eligible Degrees</div>
                      <div className="text-base text-gray-900">{jobDetail?.degree?.join(' / ') || 'Not Specified'}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-[#667eea] mb-1">Eligible Streams</div>
                      <div className="text-base text-gray-900">{jobDetail?.studentStreams?.join(', ') || 'Not Specified'}</div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <div className="text-sm font-medium text-[#667eea] mb-1">Experience Level</div>
                      <div className="text-base text-gray-900">{jobDetail.experienceLevel || 'Entry Level'}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-[#667eea] mb-1">Additional Requirements</div>
                      <div className="text-base text-gray-900">{jobDetail.additionalCriteria || 'None'}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Compensation & Benefits */}
              <div className="px-6 py-6 border-t border-gray-100">
                <h2 className="text-xl font-bold bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent mb-4">
                  Compensation & Benefits
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div className="bg-gradient-to-br from-[#667eea]/5 to-[#764ba2]/5 p-5 rounded-lg text-center">
                    <div className="text-sm font-medium text-[#667eea] mb-2">Salary Package</div>
                    <div className="text-2xl font-bold text-gray-900">
                      {formatSalary()}
                    </div>
                  </div>
                  {jobDetail?.packageDetails?.fixedPay && (
                    <div className="bg-gradient-to-br from-[#667eea]/5 to-[#764ba2]/5 p-5 rounded-lg text-center">
                      <div className="text-sm font-medium text-[#667eea] mb-2">Fixed Pay</div>
                      <div className="text-2xl font-bold text-gray-900">
                        {`₹${jobDetail.packageDetails.fixedPay.toLocaleString()}`}
                      </div>
                    </div>
                  )}
                  {jobDetail?.packageDetails?.joiningBonus && (
                    <div className="bg-gradient-to-br from-[#667eea]/5 to-[#764ba2]/5 p-5 rounded-lg text-center">
                      <div className="text-sm font-medium text-[#667eea] mb-2">Joining Bonus</div>
                      <div className="text-2xl font-bold text-gray-900">
                        {`₹${jobDetail.packageDetails.joiningBonus.toLocaleString()}`}
                      </div>
                    </div>
                  )}
                </div>
                <h3 className="font-medium text-[#667eea] mt-6 mb-3">Benefits Offered</h3>
                <div className="flex flex-wrap gap-2">
                  {jobDetail?.benefits && jobDetail?.benefits.length > 0 ? (
                    jobDetail.benefits.map((benefit, index) => (
                      <span
                        key={index}
                        className="px-3 py-1.5 bg-gradient-to-r from-[#667eea]/10 to-[#764ba2]/10 text-[#667eea] border border-[#667eea]/20 rounded-full text-sm font-medium"
                      >
                        {benefit}
                      </span>
                    ))
                  ) : (
                    <span className="px-3 py-1.5 bg-gray-100 text-gray-600 border border-gray-200 rounded-full text-sm">
                      Competitive salary, Health insurance, Flexible work hours
                    </span>
                  )}
                </div>
              </div>

              {/* Selection Process - Matches on-campus version */}
              <div className="px-6 py-6 border-t border-gray-100">
                <div className="mb-4">
                  <h2 className="text-xl font-bold bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent mb-1">
                    Selection Process
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {normalizeSelectionProcess(jobDetail.selectionProcess)?.length > 0 ? (
                      normalizeSelectionProcess(jobDetail.selectionProcess).map((step, index) => (
                        <div
                          key={index}
                          className="group bg-white border border-gray-200 rounded-lg p-3 hover:border-[#667eea]/30 hover:shadow-sm transition-all duration-200"
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-6 h-6 rounded-full bg-gradient-to-r from-[#667eea] to-[#764ba2] flex items-center justify-center">
                              <span className="text-xs font-bold text-white">{index + 1}</span>
                            </div>
                            <p className="text-sm font-medium text-gray-900">
                              Round {index + 1}
                            </p>
                          </div>
                          <p className="text-xs text-gray-600">{step}</p>
                        </div>
                      ))
                    ) : (
                      <div className="text-gray-700">
                        {renderTags(jobDetail.selectionProcess)}
                      </div>
                    )}
                  </div>
                </div>

                {/*{selectionProcess.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {selectionProcess.map((step, index) => (
                      <div 
                        key={index}
                        className="group bg-white border border-gray-200 rounded-lg p-3 hover:border-[#667eea]/30 hover:shadow-sm transition-all duration-200"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-6 h-6 rounded-full bg-gradient-to-r from-[#667eea] to-[#764ba2] flex items-center justify-center">
                            <span className="text-xs font-bold text-white">{index + 1}</span>
                          </div>
                          <p className="text-sm font-medium text-gray-900">Round {index + 1}</p>
                        </div>
                        
                        <p className="text-xs text-gray-600 line-clamp-3">{step}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-gradient-to-br from-[#667eea]/5 to-[#764ba2]/5 rounded-lg p-4">
                    <p className="text-sm text-gray-500 text-center">Selection process details not provided.</p>
                  </div>
                )}*/}
              </div>


              {/* Important Dates */}
              {(jobDetail.endDate ||
  jobDetail.onlineTestDate ||
  jobDetail.interviewWindow ||
  jobDetail.offerRolloutDate) && (
  <div className="px-6 py-6 border-t border-gray-100">
    <h2 className="text-xl font-bold bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent mb-4">
      Important Dates
    </h2>

    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
      
      {/* Application Deadline */}
      <div className="bg-gradient-to-br from-[#667eea]/5 to-[#764ba2]/5 border border-gray-200 rounded-lg p-4">
        <p className="text-sm font-medium text-[#667eea]">
          Application Deadline
        </p>
        <p className="mt-1 text-lg font-semibold text-gray-900">
          {formatDate(jobDetail.endDate)}
        </p>
      </div>

      {/* Online Test Date */}
      <div className="bg-gradient-to-br from-[#667eea]/5 to-[#764ba2]/5 border border-gray-200 rounded-lg p-4">
        <p className="text-sm font-medium text-[#667eea]">
          Online Test Date
        </p>
        <p className="mt-1 text-lg font-semibold text-gray-900">
          {formatDate(jobDetail.onlineTestDate)}
        </p>
      </div>

      {/* Interview Window */}
      <div className="bg-gradient-to-br from-[#667eea]/5 to-[#764ba2]/5 border border-gray-200 rounded-lg p-4">
        <p className="text-sm font-medium text-[#667eea]">
          Interview Window
        </p>
        <p className="mt-1 text-lg font-semibold text-gray-900">
          {jobDetail.interviewWindow?.start
            ? `${formatDate(jobDetail.interviewWindow.start)} - ${formatDate(jobDetail.interviewWindow.end)}`
            : 'N/A'}
        </p>
      </div>

      {/* Offer Rollout */}
      <div className="bg-gradient-to-br from-[#667eea]/5 to-[#764ba2]/5 border border-gray-200 rounded-lg p-4">
        <p className="text-sm font-medium text-[#667eea]">
          Offer Rollout
        </p>
        <p className="mt-1 text-lg font-semibold text-gray-900">
          {formatDate(jobDetail.offerRolloutDate)}
        </p>
      </div>

    </div>
  </div>
)}




              {/* Contact Information if available */}
              {jobDetail.contactPerson && (
                <div className="px-6 py-6 border-t border-gray-100">
                  <h2 className="text-xl font-bold bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent mb-4">
                    Contact Person
                  </h2>
                  <div className="bg-gradient-to-br from-[#667eea]/5 to-[#764ba2]/5 p-4 rounded-lg">
                    <div className="flex items-start">
                      <div className="mr-3 flex-shrink-0">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#667eea]/20 to-[#764ba2]/20 flex items-center justify-center text-[#667eea]">
                          <Users className="h-6 w-6" />
                        </div>
                      </div>
                      <div>
                        <div className="text-base font-medium text-gray-900">
                          {jobDetail.contactPerson.name || 'Not Specified'} 
                          <span className='text-sm text-gray-500 ml-2'>({jobDetail.contactPerson.designation || 'N/A'})</span>
                        </div>
                        {jobDetail.contactPerson.email && (
                          <div className="flex items-center mt-1">
                            <Mail className="h-4 w-4 text-[#667eea] mr-1" />
                            <a href={`mailto:${jobDetail.contactPerson.email}`} className="text-[#667eea] hover:text-[#764ba2] text-sm transition-colors">{jobDetail.contactPerson.email}</a>
                          </div>
                        )}
                        {jobDetail.contactPerson.mobile && (
                          <div className="flex items-center mt-1">
                            <Phone className="h-4 w-4 text-[#667eea] mr-1" />
                            <a href={`tel:${jobDetail.contactPerson.mobile}`} className="text-[#667eea] hover:text-[#764ba2] text-sm transition-colors">{jobDetail.contactPerson.mobile}</a>
                          </div>
                        )}
                        {jobDetail.contactPerson.linkedin && (
                          <a href={jobDetail.contactPerson.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center mt-1 text-[#667eea] hover:text-[#764ba2] transition-colors">
                            <Linkedin className="h-4 w-4 mr-1" />
                            <span className="text-sm">LinkedIn</span>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Fixed Footer with Apply Now Button */}
        {!isApplied && jobStatus.status !== 'Closed' && (
          <div className="sticky bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-40">
            <div className="max-w-4xl mx-auto">
              <div className="flex justify-center">
                <button 
                  className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white font-medium rounded-lg hover:shadow-lg hover:shadow-[#667eea]/30 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={handleApply}
                  disabled={isSubmitting}
                >
                  <CheckCircle className="h-5 w-5 mr-2" />
                  {isSubmitting ? 'Applying...' : 'Apply Now'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default OffCampusJobDetailModal;