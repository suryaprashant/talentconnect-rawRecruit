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
  Info
} from 'lucide-react';
import { ApplyForPoolCampus, SaveOppurtunity, getPoolCampusJobById } from '@/lib/College_AxiosIntance';
import { viewed } from '@/lib/User_AxiosInstance';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

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

// Normalize selection rounds
const normalizeSelectionProcess = (process) => {
  if (!process) return [];

  if (Array.isArray(process)) {
    if (process.length === 1 && typeof process[0] === "string") {
      return splitIntoBullets(process[0]);
    }
    return process;
  }

  if (typeof process === "string") {
    return splitIntoBullets(process);
  }

  return [];
};

const PoolJobDetailModal = ({ jobId, isOpen, onClose, isApplied: propIsApplied, isSaved: propIsSaved }) => {
  const navigate = useNavigate();
  const [jobDetails, setJobDetails] = useState(null);
  const [saved, setSaved] = useState(propIsSaved || false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const modalRef = useRef(null);

  const loadJobDetail = async () => {
    if (!jobId) return;
    
    try {
      setLoading(true);
      const response = await getPoolCampusJobById(jobId);
      
      if (response && response.data) {
        setJobDetails(response.data);
        await viewed(response.data?._id);
        setError(null);
      } else {
        setError("Job details not found.");
      }
    } catch (error) {
      console.error("Error loading job detail: ", error);
      setError("Failed to load job details. Please try again later.");
      setJobDetails(null);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    if (isOpen && jobId) {
      loadJobDetail();
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

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

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

  const handleApply = async () => {
    if (!jobId) return;
    
    setIsSubmitting(true);
    try {
      const response = await ApplyForPoolCampus(jobId);
      if (response.data?.success === true) {
        toast.success("Applied!");
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
    if (!jobDetails?.startDate || !jobDetails?.endDate) {
      return { status: 'Unknown', color: 'bg-gray-100 text-gray-700' };
    }

    const now = new Date();
    const startDate = new Date(jobDetails.startDate);
    const endDate = new Date(jobDetails.endDate);

    if (now < startDate) {
      return { status: 'Upcoming', color: 'bg-blue-100 text-blue-700' };
    } else if (now >= startDate && now <= endDate) {
      return { status: 'Active', color: 'bg-green-100 text-green-700' };
    } else {
      return { status: 'Completed', color: 'bg-gray-100 text-gray-700' };
    }
  };

  const handleSave = async () => {
    if (!jobDetails?._id) return;
    
    try {
      const response = await SaveOppurtunity(jobDetails._id, "Pool-campus");
      if (response.data?.success === true) {
        toast.success("Saved!");
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

  if (loading) {
    return (
      <div className="relative w-full h-full bg-white flex items-center justify-center rounded-l-2xl">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#667eea]"></div>
      </div>
    );
  }

  if (error || !jobDetails) {
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
  const isApplied = propIsApplied || jobDetails.isApplied || false;
  const companyName = jobDetails?.companyPosted?.companyDetails?.companyName || 'Company';

  return (
    <>
      <div
        ref={modalRef}
        className="relative w-full h-full bg-white rounded-l-2xl overflow-hidden flex flex-col"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-50 p-2 bg-white/90 backdrop-blur-sm hover:bg-gray-100 rounded-full shadow-lg transition-colors"
        >
          <X className="h-6 w-6 text-gray-700" />
        </button>

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

              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mt-2">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent">
                  {companyName}
                </h1>
              </div>

              <div className="flex flex-col sm:flex-row justify-between mt-4">
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="h-5 w-5 mr-1 text-[#667eea]" />
                  <span>{formatDate(jobDetails?.startDate)} - {formatDate(jobDetails?.endDate)}</span>
                </div>
                <div className="flex items-center mt-2 sm:mt-0 text-sm text-gray-600">
                  <MapPin className="h-5 w-5 mr-1 text-[#667eea]" />
                  <span>{jobDetails?.workLocation?.join(', ') || 'Not Specified'}</span>
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
              {/* About Section */}
              <div className="px-6 py-6">
                <h2 className="text-xl font-bold bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent mb-4">
                  About {companyName}
                </h2>
                <p className="text-gray-700 mb-6">{jobDetails?.companyPosted?.companyDetails?.description || 'No description provided.'}</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  <div className="bg-gradient-to-br from-[#667eea]/5 to-[#764ba2]/5 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-gray-900">{jobDetails?.companyPosted?.companyDetails?.numberOfEmployees || 'N/A'}</div>
                    <div className="text-sm text-gray-600">Employees</div>
                  </div>
                  <div className="bg-gradient-to-br from-[#667eea]/5 to-[#764ba2]/5 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-gray-900">{jobDetails?.companyPosted?.companyDetails?.industryType || 'N/A'}</div>
                    <div className="text-sm text-gray-600">Industries</div>
                  </div>
                  <div className="bg-gradient-to-br from-[#667eea]/5 to-[#764ba2]/5 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-gray-900">{jobDetails?.companyPosted?.companyDetails?.country || 'N/A'}</div>
                    <div className="text-sm text-gray-600">Countries</div>
                  </div>
                </div>
              </div>

              {/* Job Description */}
              <div className="px-6 py-6">
                <h2 className="text-xl font-bold bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent mb-4">
                  Job Description
                </h2>
                <div className="text-gray-700">
                  {jobDetails?.description ? (
                    <ul className="list-disc pl-5 space-y-2">
                      {splitIntoBullets(jobDetails.description).map((point, idx) => (
                        <li key={idx}>{point}</li>
                      ))}
                    </ul>
                  ) : (
                    <p>No job description provided.</p>
                  )}
                </div>
              </div>

              {/* Job Details */}
              <div className="px-6 py-6">
                <h2 className="text-xl font-bold bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent mb-4">
                  Job Details
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
                  <div>
                    <div className="text-sm font-medium text-[#667eea]">Employment Type</div>
                    <div className="mt-1 text-base text-gray-900">{jobDetails?.employmentType?.join(', ') || 'Not Specified'}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-[#667eea]">Job Roles</div>
                    <div className="mt-1 text-base text-gray-900">{jobDetails?.jobRoles?.join(', ') || 'Not Specified'}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-[#667eea]">Work Mode</div>
                    <div className="mt-1 text-base text-gray-900">{jobDetails?.workMode?.join(', ') || 'Not Specified'}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-[#667eea]">Number of rounds to be held</div>
                    <div className="mt-1 text-base text-gray-900">{jobDetails?.rounds?.join(', ') || 'Not Specified'}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-[#667eea]">Job Location</div>
                    <div className="mt-1 text-base text-gray-900">{jobDetails?.workLocation?.join(', ') || 'Not Specified'}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-[#667eea]">Preferred Hiring Mode</div>
                    <div className="mt-1 text-base text-gray-900">{jobDetails?.companyHiringPreference?.preferredMode || 'Not Specified'}</div>
                  </div>
                </div>
              </div>

              {/* Required Skills */}
              {jobDetails?.skills?.length > 0 && (
                <div className="px-6 py-6">
                  <h2 className="text-xl font-bold bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent mb-4">
                    Required Skills
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {jobDetails.skills.map((skill, index) => (
                      <span key={index} className="bg-gradient-to-br from-[#667eea]/10 to-[#764ba2]/10 text-gray-800 px-3 py-1.5 rounded-md text-sm font-medium border border-gray-200">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Amenity/Facility Required */}
              {jobDetails?.amenitiesRequired?.length > 0 && (
                <div className="px-6 py-6">
                  <h2 className="text-xl font-bold bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent mb-4">
                    Amenity/Facility Required
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {jobDetails.amenitiesRequired.map((amenity, index) => (
                      <span key={index} className="bg-gradient-to-br from-[#667eea]/10 to-[#764ba2]/10 text-gray-800 px-3 py-1.5 rounded-md text-sm font-medium border border-gray-200">
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Eligibility Criteria */}
              <div className="px-6 py-6">
                <h2 className="text-xl font-bold bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent mb-4">
                  Eligibility Criteria
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8 mb-6">
                  <div>
                    <div className="text-sm font-medium text-[#667eea]">Drive Open To (College Type)</div>
                    <div className="mt-1 text-base text-gray-900">{jobDetails?.collegeTypes?.join(', ') || 'Not Specified'}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-[#667eea]">Eligible College Categories</div>
                    <div className="mt-1 text-base text-gray-900">{jobDetails?.collegeCategories?.join(', ') || 'Not Specified'}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-[#667eea]">Eligible Degrees / Streams</div>
                    <div className="mt-1 text-base text-gray-900">{jobDetails?.studentStreams?.join(', ') || 'Not Specified'}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-[#667eea]">Minimum Students Required</div>
                    <div className="mt-1 text-base text-gray-900">{jobDetails?.minimumStudents || 'Not Specified'}</div>
                  </div>
                </div>
                {(jobDetails?.eligibilityCriteria || jobDetails?.additionalEligibilityCriteria || jobDetails?.additionalCriteria) && (
                  <div className="mt-6">
                    <div className="text-sm font-medium text-[#667eea] mb-2">Additional Criteria</div>
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
                <h2 className="text-xl font-bold bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent mb-4">
                  Compensation & Benefits
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-gradient-to-br from-[#667eea]/5 to-[#764ba2]/5 p-4 rounded-lg">
                    <div className="text-sm font-medium text-[#667eea]">Total CTC</div>
                    <div className="text-xl font-bold text-gray-900">
                      {jobDetails?.packageDetails?.totalCTC
                        ? `${jobDetails.packageDetails.currency || ''} ${jobDetails.packageDetails.totalCTC.toLocaleString()}`
                        : 'Not Specified'}
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-[#667eea]/5 to-[#764ba2]/5 p-4 rounded-lg">
                    <div className="text-sm font-medium text-[#667eea]">Fixed Pay</div>
                    <div className="text-xl font-bold text-gray-900">
                      {jobDetails?.packageDetails?.fixedPay
                        ? `${jobDetails.packageDetails.currency || ''} ${jobDetails.packageDetails.fixedPay.toLocaleString()}`
                        : 'N/A'}
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-[#667eea]/5 to-[#764ba2]/5 p-4 rounded-lg">
                    <div className="text-sm font-medium text-[#667eea]">Variable Pay</div>
                    <div className="text-xl font-bold text-gray-900">
                      {jobDetails?.packageDetails?.joiningBonus
                        ? `${jobDetails.packageDetails.currency || ''} ${jobDetails.packageDetails.joiningBonus.toLocaleString()}`
                        : 'N/A'}
                    </div>
                  </div>
                </div>
                <h3 className="font-medium text-[#667eea] mt-6 mb-3">Benefits Offered</h3>
                <div className="flex flex-wrap gap-2">
                  {jobDetails?.benefits?.length > 0 ? (
                    jobDetails.benefits.map((benefit, index) => (
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

              {/* Selection Process */}
              <div className="px-6 py-6">
                <div className="mb-4">
                  <h2 className="text-xl font-bold bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent mb-1">
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
                )}
              </div>

              {/* Important Dates */}
              <div className="px-6 py-6">
                <h2 className="text-xl font-bold bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent mb-4">
                  Important Dates
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="border border-gray-300 rounded-lg p-4 text-center bg-gradient-to-br from-[#667eea]/5 to-[#764ba2]/5">
                    <div className="text-sm font-medium text-[#667eea]">Registration Deadline</div>
                    <div className="mt-1 text-lg font-medium text-gray-900">{formatDate(jobDetails?.endDate)}</div>
                  </div>
                  <div className="border border-gray-300 rounded-lg p-4 text-center bg-gradient-to-br from-[#667eea]/5 to-[#764ba2]/5">
                    <div className="text-sm font-medium text-[#667eea]">Online Test Date</div>
                    <div className="mt-1 text-lg font-medium text-gray-900">{formatDate(jobDetails.onlineTestDate)}</div>
                  </div>
                  <div className="border border-gray-300 rounded-lg p-4 text-center bg-gradient-to-br from-[#667eea]/5 to-[#764ba2]/5">
                    <div className="text-sm font-medium text-[#667eea]">Interview Window</div>
                    <div className="mt-1 text-lg font-medium text-gray-900">
                      {formatDate(jobDetails.interviewWindow?.start) === 'Not Specified' ? 'N/A' : `${formatDate(jobDetails.interviewWindow?.start)} - ${formatDate(jobDetails.interviewWindow?.end)}`}
                    </div>
                  </div>
                  <div className="border border-gray-300 rounded-lg p-4 text-center bg-gradient-to-br from-[#667eea]/5 to-[#764ba2]/5">
                    <div className="text-sm font-medium text-[#667eea]">Offer Rollout</div>
                    <div className="mt-1 text-lg font-medium text-gray-900">{formatDate(jobDetails.offerRolloutDate)}</div>
                  </div>
                </div>
              </div>

              {/* Contact Person */}
              {jobDetails?.contactPerson && (
                <div className="px-6 py-6">
                  <h2 className="text-xl font-bold bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent mb-4">
                    Company Placement Officer Contact
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
                          {jobDetails.contactPerson.name || 'Not Specified'} 
                          <span className='text-sm text-gray-500 ml-2'>({jobDetails.contactPerson.designation || 'N/A'})</span>
                        </div>
                        {jobDetails.contactPerson.email && (
                          <div className="flex items-center mt-1">
                            <Mail className="h-4 w-4 text-[#667eea] mr-1.5" />
                            <a href={`mailto:${jobDetails.contactPerson.email}`} className="text-[#667eea] hover:text-[#764ba2] text-sm transition-colors">
                              {jobDetails.contactPerson.email}
                            </a>
                          </div>
                        )}
                        {jobDetails.contactPerson.mobile && (
                          <div className="flex items-center mt-1">
                            <Phone className="h-4 w-4 text-[#667eea] mr-1.5" />
                            <a href={`tel:${jobDetails.contactPerson.mobile}`} className="text-[#667eea] hover:text-[#764ba2] text-sm transition-colors">
                              {jobDetails.contactPerson.mobile}
                            </a>
                          </div>
                        )}
                        {jobDetails.contactPerson.linkedin && (
                          <a href={jobDetails.contactPerson.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center mt-1 text-[#667eea] hover:text-[#764ba2] transition-colors">
                            <Linkedin className="h-4 w-4 mr-1.5" />
                            <span className="text-sm">LinkedIn Profile</span>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Register Now Button at Bottom */}
              {!isApplied && jobStatus.status !== 'Completed' && (
                <div className="px-6 py-6 bg-gradient-to-r from-[#667eea]/5 to-[#764ba2]/5">
                  <div className="flex justify-center">
                    <button 
                      className="inline-flex items-center justify-center px-8 py-3 bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white text-lg font-medium rounded-xl hover:shadow-lg hover:shadow-[#667eea]/30 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={handleApply}
                      disabled={isSubmitting}
                    >
                      <CheckCircle className="h-5 w-5 mr-2" />
                      {isSubmitting ? 'Applying...' : 'Register Now'}
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

export default PoolJobDetailModal;