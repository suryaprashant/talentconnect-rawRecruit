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
  FileText,
  Download,
  Info,
  Navigation,
  ArrowLeft
} from 'lucide-react';
import { ApplyForOppurtunity, getJobDetails, SaveOppurtunity } from '@/lib/User_AxiosInstance';
import toast from 'react-hot-toast';

// Utility function to format date
const formatDate = (dateString) => {
  if (!dateString || dateString === 'Not Specified') return 'Not Specified';
  try {
    const date = new Date(dateString);
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

// Split long paragraph into meaningful bullet points
const splitIntoBullets = (text) => {
  if (!text || typeof text !== "string") return [];

  return text
    .split(/[\.\n,+]/)
    .map(s => s.trim())
    .filter(s => s.length > 3);
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

  const loadJobDetails = async () => {
    if (!jobId) return;
    
    try {
      setLoading(true);
      // Use getJobDetails instead of getOffCampusJobDetail
      const details = await getJobDetails(jobId);
      console.log('Job details response:', details);
      
      if (details && details.data) {
        // Check different response formats
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
      // Use ApplyForOppurtunity instead of ApplyForOffCampusJob
      const response = await ApplyForOppurtunity(jobId);
      console.log('Apply response:', response);
      if (response?.data?.success === true) {
        toast.success('Application submitted successfully!');
        onClose();
      } else {
        toast.error(response.response?.data?.msg || "Could not apply.");
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
      // For off-campus jobs, use jobType from jobDetail or default to "Off-campus"
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

  // Format location
  const formatLocation = () => {
    if (Array.isArray(jobDetail.location)) {
      return jobDetail.location.join(', ');
    }
    return jobDetail.location || 'Not specified';
  };

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
        <div className="flex-1 overflow-y-auto bg-gradient-to-br from-[#667eea]/5 via-[#f093fb]/5 to-[#764ba2]/5">
          <div className="p-6">
            {/* Header Section */}
            <div className="bg-gradient-to-r from-[#667eea]/5 to-[#764ba2]/5 px-6 py-4 rounded-xl mb-6">
              {jobStatus.status === 'Closed' ? (
                <div className="text-sm font-medium text-[#667eea]">Registrations Completed</div>
              ) : (
                <div className="text-sm font-medium text-[#667eea]">Registration Open</div>
              )}

              <div className="flex items-center mb-2">
                <div className="w-12 h-12 bg-gradient-to-br from-[#667eea]/20 to-[#764ba2]/20 mr-3 flex items-center justify-center rounded-full overflow-hidden">
                  {jobDetail.companyPosted?.profileImageUrl ? (
                    <img
                      src={jobDetail.companyPosted.profileImageUrl}
                      alt={companyName}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://placehold.co/48x48/cccccc/000000?text=Logo';
                      }}
                    />
                  ) : (
                    <Building className="h-6 w-6 text-[#667eea]" />
                  )}
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent">
                    {jobDetail.jobTitle || 'Job Position'} at {companyName}
                  </h1>
                  <div className="flex items-center text-sm text-gray-600 mt-1">
                    <Calendar className="h-4 w-4 mr-1 text-[#667eea]" />
                    <span>Posted: {formatDate(jobDetail?.createdAt)}</span>
                  </div>
                </div>
              </div>

              {/* Job Type Badge */}
              <div className="mb-3">
                <span className="px-3 py-1 bg-gradient-to-r from-[#667eea]/20 to-[#764ba2]/20 text-[#667eea] rounded-full text-sm font-medium border border-[#667eea]/30">
                  {jobDetail.jobType || 'Full-time'}
                </span>
              </div>

              {/* Save and Share buttons */}
              <div className="flex space-x-2 mt-4">
                {!saved && !isApplied && (
                  <button
                    onClick={handleSave}
                    disabled={saved}
                    className={`inline-flex items-center justify-center px-4 py-2 border ${saved ? 'border-gray-300 bg-gray-50 text-gray-400 cursor-not-allowed' : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'} text-sm font-medium rounded-lg transition-all duration-200`}
                  >
                    <Save className={`h-5 w-5 mr-1 ${saved ? 'text-[#667eea]' : 'text-gray-400'}`} fill={saved ? 'currentColor' : 'none'} />
                    {saved ? 'Saved' : 'Save'}
                  </button>
                )}
                <button
                  onClick={handleShare}
                  className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-50 transition-all duration-200"
                >
                  <Share2 className="h-5 w-5 mr-1 text-gray-400" />
                  Share
                </button>
              </div>
            </div>

            <div className="bg-white/90 backdrop-blur-sm border border-gray-100 rounded-xl shadow-lg overflow-hidden">
              {/* Job Overview */}
              <div className="px-6 py-6">
                <h2 className="text-xl font-bold bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent mb-4">
                  Job Overview
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="bg-gradient-to-br from-[#667eea]/5 to-[#764ba2]/5 p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                      <DollarSign className="h-5 w-5 text-[#667eea] mr-2" />
                      <span className="text-sm font-medium text-[#667eea]">Salary Package</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">{formatSalary()}</div>
                  </div>
                  <div className="bg-gradient-to-br from-[#667eea]/5 to-[#764ba2]/5 p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                      <Briefcase className="h-5 w-5 text-[#667eea] mr-2" />
                      <span className="text-sm font-medium text-[#667eea]">Work Mode</span>
                    </div>
                    <div className="text-lg font-medium text-gray-900">{formatWorkMode()}</div>
                  </div>
                  <div className="bg-gradient-to-br from-[#667eea]/5 to-[#764ba2]/5 p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                      <MapPin className="h-5 w-5 text-[#667eea] mr-2" />
                      <span className="text-sm font-medium text-[#667eea]">Location</span>
                    </div>
                    <div className="text-lg font-medium text-gray-900">{formatLocation()}</div>
                  </div>
                  <div className="bg-gradient-to-br from-[#667eea]/5 to-[#764ba2]/5 p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                      <Calendar className="h-5 w-5 text-[#667eea] mr-2" />
                      <span className="text-sm font-medium text-[#667eea]">Application Deadline</span>
                    </div>
                    <div className="text-lg font-medium text-gray-900">
                      {jobDetail.applicationDeadline ? formatDate(jobDetail.applicationDeadline) : 'Rolling Basis'}
                    </div>
                  </div>
                </div>
              </div>

              {/* About Company */}
              <div className="px-6 py-6 border-t border-gray-100">
                <h2 className="text-xl font-bold bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent mb-4">
                  About {companyName}
                </h2>
                <p className="text-gray-700 mb-6">
                  {jobDetail.companyPosted?.companyDetails?.description || 
                   jobDetail.companyDescription || 
                   'No company description available.'}
                </p>
              </div>

              {/* Job Details */}
              <div className="px-6 py-6 border-t border-gray-100">
                <h2 className="text-xl font-bold bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent mb-4">
                  Job Details
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
                  <div>
                    <div className="text-sm font-medium text-[#667eea]">Employment Type</div>
                    {renderTags(jobDetail.employmentType)}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-[#667eea]">Experience Level</div>
                    <div className="mt-1 text-base text-gray-900">{jobDetail.experienceLevel || 'Entry Level'}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-[#667eea]">Required Skills</div>
                    {renderTags(jobDetail.skills)}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-[#667eea]">Required Degree</div>
                    {renderTags(jobDetail.degree)}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-[#667eea]">Eligible Streams</div>
                    {renderTags(jobDetail.studentStreams)}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-[#667eea]">Job Roles</div>
                    {renderTags(jobDetail.jobRoles)}
                  </div>
                </div>
              </div>

              {/* Job Description */}
              {jobDetail.description && (
                <div className="px-6 py-6 border-t border-gray-100">
                  <h2 className="text-xl font-bold bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent mb-4">
                    Job Description
                  </h2>
                  <div className="text-gray-700">
                    {jobDetail.description ? (
                      <ul className="list-disc pl-5 space-y-2">
                        {splitIntoBullets(jobDetail.description).map((point, idx) => (
                          <li key={idx}>{point}</li>
                        ))}
                      </ul>
                    ) : (
                      <p>No description available.</p>
                    )}
                  </div>
                </div>
              )}

              {/* Responsibilities */}
              {jobDetail.responsibilities && (
                <div className="px-6 py-6 border-t border-gray-100">
                  <h2 className="text-xl font-bold bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent mb-4">
                    Key Responsibilities
                  </h2>
                  <div className="text-gray-700">
                    {jobDetail.responsibilities ? (
                      <ul className="list-disc pl-5 space-y-2">
                        {splitIntoBullets(jobDetail.responsibilities).map((point, idx) => (
                          <li key={idx}>{point}</li>
                        ))}
                      </ul>
                    ) : (
                      <p>No responsibilities specified.</p>
                    )}
                  </div>
                </div>
              )}

              {/* Benefits */}
              <div className="px-6 py-6 border-t border-gray-100">
                <h2 className="text-xl font-bold bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent mb-4">
                  Benefits
                </h2>
                <div className="flex flex-wrap gap-2">
                  {jobDetail?.benefits?.length > 0 ? (
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

              {/* Selection Process */}
              {jobDetail.selectionProcess && (
                <div className="px-6 py-6 border-t border-gray-100">
                  <h2 className="text-xl font-bold bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent mb-4">
                    Selection Process
                  </h2>
                  <div className="text-gray-700">
                    {renderTags(jobDetail.selectionProcess)}
                  </div>
                </div>
              )}

              {/* Important Dates */}
              <div className="px-6 py-6 border-t border-gray-100">
                <h2 className="text-xl font-bold bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent mb-4">
                  Important Dates
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="border border-gray-300 rounded-lg p-4 text-center bg-gradient-to-br from-[#667eea]/5 to-[#764ba2]/5">
                    <div className="text-sm font-medium text-[#667eea]">Application Deadline</div>
                    <div className="mt-1 text-lg font-medium text-gray-900">
                      {jobDetail.applicationDeadline ? formatDate(jobDetail.applicationDeadline) : 'Rolling Basis'}
                    </div>
                  </div>
                  <div className="border border-gray-300 rounded-lg p-4 text-center bg-gradient-to-br from-[#667eea]/5 to-[#764ba2]/5">
                    <div className="text-sm font-medium text-[#667eea]">Expected Start Date</div>
                    <div className="mt-1 text-lg font-medium text-gray-900">
                      {jobDetail.startDate ? formatDate(jobDetail.startDate) : 'Immediate'}
                    </div>
                  </div>
                  <div className="border border-gray-300 rounded-lg p-4 text-center bg-gradient-to-br from-[#667eea]/5 to-[#764ba2]/5">
                    <div className="text-sm font-medium text-[#667eea]">Notice Period</div>
                    <div className="mt-1 text-lg font-medium text-gray-900">
                      {jobDetail.noticePeriod || 'Immediate to 30 days'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Apply Now Button at Bottom */}
              {!isApplied && jobStatus.status !== 'Closed' && (
                <div className="px-6 py-6 bg-gradient-to-r from-[#667eea]/5 to-[#764ba2]/5 border-t border-gray-100">
                  <div className="flex justify-center">
                    <button 
                      className="inline-flex items-center justify-center px-8 py-3 bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white text-lg font-medium rounded-xl hover:shadow-lg hover:shadow-[#667eea]/30 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={handleApply}
                      disabled={isSubmitting}
                    >
                      <CheckCircle className="h-5 w-5 mr-2" />
                      {isSubmitting ? 'Applying...' : 'Apply Now'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OffCampusJobDetailModal;