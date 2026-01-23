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
import { ApplyForOppurtunity, getJobDetails, SaveOppurtunity, viewed } from '@/lib/User_AxiosInstance';
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
      const details = await getJobDetails(jobId);
      if (details && details.data && details.data[0]) {
        setJobDetail(details.data[0]);
        await viewed(details.data[0]._id);
        setError(null);
      } else {
        setError("Job details not found.");
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
        title: `${jobDetail?.jobTitle || 'Job'} at ${jobDetail?.companyPosted?.companyDetails?.companyName}`,
        text: `Check out this off-campus opportunity at ${jobDetail?.companyPosted?.companyDetails?.companyName}!`,
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
      if (response?.data?.success === true) {
        toast.success('Application submitted!');
        onClose();
      } else {
        toast.error(response.response?.data?.msg || "Could not apply.");
      }
    } catch (error) {
      console.log("Error: ", error);
      toast.error('Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getJobStatus = () => {
    if (!jobDetail?.startDate || !jobDetail?.endDate) {
      return { status: 'Unknown', color: 'bg-gray-100 text-gray-700' };
    }

    const now = new Date();
    const startDate = new Date(jobDetail.startDate);
    const endDate = new Date(jobDetail.endDate);

    if (now < startDate) {
      return { status: 'Upcoming', color: 'bg-blue-100 text-blue-700' };
    } else if (now >= startDate && now <= endDate) {
      return { status: 'Active', color: 'bg-green-100 text-green-700' };
    } else {
      return { status: 'Completed', color: 'bg-gray-100 text-gray-700' };
    }
  };

  const handleSave = async () => {
    if (!jobDetail?._id || !jobDetail?.jobType) return;
    
    try {
      const response = await SaveOppurtunity(jobDetail._id, jobDetail.jobType);
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
  const companyName = jobDetail?.companyPosted?.companyDetails?.companyName || 'Company';

  return (
    <>
      <div
        ref={modalRef}
        className="relative w-full h-full bg-white rounded-l-2xl overflow-hidden flex flex-col"
      >
        {/* Close button - only show in normal view or if specified */}
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
              {jobStatus.status === 'Completed' ? (
                <div className="text-sm font-medium text-[#667eea]">Registrations Completed</div>
              ) : (
                <div className="text-sm font-medium text-[#667eea]">Registration Open</div>
              )}

              <div className="flex items-center mb-2">
                <div className="w-12 h-12 bg-gradient-to-br from-[#667eea]/20 to-[#764ba2]/20 mr-3 flex items-center justify-center rounded-full overflow-hidden">
                  {jobDetail.companyPosted?.profileImage ? (
                    <img
                      src={jobDetail.companyPosted.profileImage}
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
                    {companyName} - {Array.isArray(jobDetail.jobRoles) 
                      ? jobDetail.jobRoles.join(', ') 
                      : jobDetail.jobRoles || 'N/A'}
                  </h1>
                  <div className="flex items-center text-sm text-gray-600 mt-1">
                    <Calendar className="h-4 w-4 mr-1 text-[#667eea]" />
                    <span>{formatDate(jobDetail?.startDate)} - {formatDate(jobDetail?.endDate)}</span>
                  </div>
                </div>
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
              {/* About Company */}
              <div className="px-6 py-6">
                <h2 className="text-xl font-bold bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent mb-4">
                  About {companyName}
                </h2>
                <p className="text-gray-700 mb-6">{jobDetail.companyPosted?.companyDetails?.description || 'No company description available.'}</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  <div className="bg-gradient-to-br from-[#667eea]/5 to-[#764ba2]/5 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-gray-900">{jobDetail.companyPosted?.companyDetails?.numberOfEmployees || 'N/A'}</div>
                    <div className="text-sm text-gray-600">Employees</div>
                  </div>
                  <div className="bg-gradient-to-br from-[#667eea]/5 to-[#764ba2]/5 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-gray-900">{jobDetail.companyPosted?.companyDetails?.industryType || 'N/A'}</div>
                    <div className="text-sm text-gray-600">Industry</div>
                  </div>
                  <div className="bg-gradient-to-br from-[#667eea]/5 to-[#764ba2]/5 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-gray-900">{jobDetail.companyPosted?.companyDetails?.country || 'N/A'}</div>
                    <div className="text-sm text-gray-600">Country</div>
                  </div>
                </div>
              </div>

              {/* Opportunity Details */}
              <div className="px-6 py-6">
                <h2 className="text-xl font-bold bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent mb-4">
                  Opportunity Details
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
                  <div>
                    <div className="text-sm font-medium text-[#667eea]">Job Roles</div>
                    {renderTags(jobDetail.jobRoles)}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-[#667eea]">Work Location</div>
                    {renderTags(jobDetail.location)}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-[#667eea]">Work Mode</div>
                    {renderTags(jobDetail.workMode)}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-[#667eea]">Employment Type</div>
                    {renderTags(jobDetail.employmentType)}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-[#667eea]">Industry Type</div>
                    <div className="mt-1 text-base text-gray-900 capitalize">{jobDetail.companyPosted?.companyDetails?.industryType || 'N/A'}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-[#667eea]">Department</div>
                    <div className="mt-1 text-base text-gray-900">{jobDetail.department || 'N/A'}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-[#667eea]">Drive Venue</div>
                    <div className="mt-1 text-base text-gray-900">{jobDetail.venue || 'N/A'}</div>
                  </div>
                </div>
              </div>

              {/* Candidate Requirements */}
              <div className="px-6 py-6">
                <h2 className="text-xl font-bold bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent mb-4">
                  Candidate Requirements
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
                  <div>
                    <div className="text-sm font-medium text-[#667eea]">Degree</div>
                    {renderTags(jobDetail.degree)}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-[#667eea]">Eligible Streams</div>
                    {renderTags(jobDetail.studentStreams)}
                  </div>
                  <div className="col-span-1 md:col-span-2">
                    <div className="text-sm font-medium text-[#667eea]">Required Skills</div>
                    {renderTags(jobDetail.skills)}
                  </div>
                </div>
              </div>

              {/* Compensation & Benefits */}
              <div className="px-6 py-6">
                <h2 className="text-xl font-bold bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent mb-4">
                  Compensation & Benefits
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-gradient-to-br from-[#667eea]/5 to-[#764ba2]/5 p-4 rounded-lg">
                    <div className="text-sm font-medium text-[#667eea]">Total CTC</div>
                    <div className="text-xl font-bold text-gray-900">
                      {jobDetail.packageDetails?.totalCTC
                        ? `${jobDetail.packageDetails.currency || ''} ${jobDetail.packageDetails.totalCTC.toLocaleString()}`
                        : 'Not Specified'}
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-[#667eea]/5 to-[#764ba2]/5 p-4 rounded-lg">
                    <div className="text-sm font-medium text-[#667eea]">Fixed Pay</div>
                    <div className="text-xl font-bold text-gray-900">
                      {jobDetail.packageDetails?.fixedPay
                        ? `${jobDetail.packageDetails.currency || ''} ${jobDetail.packageDetails.fixedPay.toLocaleString()}`
                        : 'N/A'}
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-[#667eea]/5 to-[#764ba2]/5 p-4 rounded-lg">
                    <div className="text-sm font-medium text-[#667eea]">Variable Pay</div>
                    <div className="text-xl font-bold text-gray-900">
                      {jobDetail.packageDetails?.joiningBonus
                        ? `${jobDetail.packageDetails.currency || ''} ${jobDetail.packageDetails.joiningBonus.toLocaleString()}`
                        : 'N/A'}
                    </div>
                  </div>
                </div>
                <h3 className="font-medium text-[#667eea] mt-6 mb-3">Benefits Offered</h3>
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
                      No benefits specified
                    </span>
                  )}
                </div>
              </div>

              {/* Hiring Process */}
              <div className="px-6 py-6">
                <h2 className="text-xl font-bold bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent mb-4">
                  Hiring Process
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
                  <div>
                    <div className="text-sm font-medium text-[#667eea]">Selection Process</div>
                    {renderTags(jobDetail.selectionProcess)}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-[#667eea]">Number of Rounds</div>
                    <div className="mt-1 text-base text-gray-900">{jobDetail.rounds?.join(', ') || 'N/A'}</div>
                  </div>
                </div>
              </div>

              {/* About the Role */}
              {jobDetail.description && (
                <div className="px-6 py-6">
                  <h2 className="text-xl font-bold bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent mb-4">
                    About the Role
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

              {/* Eligibility Criteria */}
              {jobDetail.eligibilityCriteria && (
                <div className="px-6 py-6">
                  <h2 className="text-xl font-bold bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent mb-4">
                    Eligibility Criteria
                  </h2>
                  <div className="text-gray-700">
                    {jobDetail.eligibilityCriteria ? (
                      <ul className="list-disc pl-5 space-y-2">
                        {splitIntoBullets(jobDetail.eligibilityCriteria).map((point, idx) => (
                          <li key={idx}>{point}</li>
                        ))}
                      </ul>
                    ) : (
                      <p>No criteria specified.</p>
                    )}
                  </div>
                </div>
              )}

              {/* Important Dates */}
              <div className="px-6 py-6">
                <h2 className="text-xl font-bold bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent mb-4">
                  Important Dates
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="border border-gray-300 rounded-lg p-4 text-center bg-gradient-to-br from-[#667eea]/5 to-[#764ba2]/5">
                    <div className="text-sm font-medium text-[#667eea]">Registration Deadline</div>
                    <div className="mt-1 text-lg font-medium text-gray-900">
                      {jobDetail.endDate ? new Date(jobDetail.endDate).toLocaleDateString('en-GB') : 'N/A'}
                    </div>
                  </div>
                  <div className="border border-gray-300 rounded-lg p-4 text-center bg-gradient-to-br from-[#667eea]/5 to-[#764ba2]/5">
                    <div className="text-sm font-medium text-[#667eea]">Test Date</div>
                    <div className="mt-1 text-lg font-medium text-gray-900">TBD</div>
                  </div>
                  <div className="border border-gray-300 rounded-lg p-4 text-center bg-gradient-to-br from-[#667eea]/5 to-[#764ba2]/5">
                    <div className="text-sm font-medium text-[#667eea]">Interview Window</div>
                    <div className="mt-1 text-lg font-medium text-gray-900">TBD</div>
                  </div>
                  <div className="border border-gray-300 rounded-lg p-4 text-center bg-gradient-to-br from-[#667eea]/5 to-[#764ba2]/5">
                    <div className="text-sm font-medium text-[#667eea]">Results</div>
                    <div className="mt-1 text-lg font-medium text-gray-900">TBD</div>
                  </div>
                </div>
              </div>

              {/* Apply Now Button at Bottom */}
              {!isApplied && jobStatus.status !== 'Completed' && (
                <div className="px-6 py-6 bg-gradient-to-r from-[#667eea]/5 to-[#764ba2]/5">
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