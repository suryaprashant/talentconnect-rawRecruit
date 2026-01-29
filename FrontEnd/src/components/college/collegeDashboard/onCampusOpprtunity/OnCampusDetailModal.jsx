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
import { ApplyForOnCampus, getCompanyPostingForOncampusDetail, SaveOppurtunity } from '@/lib/College_AxiosIntance';
import { viewed } from '@/lib/User_AxiosInstance';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "@/context/AuthContext";

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

const JobDetailModal = ({ jobId, isOpen, onClose, isApplied: propIsApplied, isSaved: propIsSaved }) => {
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [saved, setSaved] = useState(propIsSaved || false);
  const [isloading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { isAuthenticated, loading } = useAuth();
  
  const modalRef = useRef(null);
  const contentRef = useRef(null);

  const loadJobDetail = async () => {
    if (!jobId) return;
    
    try {
      setLoading(true);
      const response = await getCompanyPostingForOncampusDetail(jobId);
      
      if (response && response.data) {
        setJob(response.data);
        await viewed(response.data?._id);
        setError(null);
      } else {
        setError("Job details not found.");
      }
    } catch (error) {
      console.error("Error loading job detail: ", error);
      setError("Failed to load job details. Please try again later.");
      setJob(null);
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
        title: `${job?.jobTitle || 'Job'} at ${job?.companyPosted?.companyDetails?.companyName}`,
        text: `Check out this opportunity for a ${job?.jobTitle || 'job'} at ${job?.companyPosted?.companyDetails?.companyName}!`,
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
    if (loading) return;

  // 🔐 Not logged in
  if (!isAuthenticated) {
    toast.error("Please login to apply");
    return;
  }
    if (!jobId) return;
    
    setIsSubmitting(true);
    try {
      const response = await ApplyForOnCampus(jobId);
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

  const handleSave = async () => {
    if (!job?._id || !job?.jobType) return;
    
    try {
      const response = await SaveOppurtunity(job._id, job.jobType);
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

  if (isloading) {
    return (
      <div className="relative w-full h-full bg-white flex items-center justify-center rounded-l-2xl">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#667eea]"></div>
      </div>
    );
  }

  if (error || !job) {
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
  const isApplied = propIsApplied || job.isApplied || false;
  const companyName = job?.companyPosted?.companyDetails?.companyName || 'Company';
  const workLocation = job?.workLocation?.join(', ') || 'Not Specified';

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
        <div ref={contentRef} className="flex-1 overflow-y-auto bg-gradient-to-br from-[#667eea]/5 via-[#f093fb]/5 to-[#764ba2]/5">
          <div className="p-6">
            {/* Header Section */}
            <div className="bg-gradient-to-r from-[#667eea]/5 to-[#764ba2]/5 px-6 py-5 rounded-xl mb-6">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-medium text-[#667eea]">
                      {jobStatus.status === 'Completed' ? 'Registrations Completed' : 'Registration Open'}
                    </span>
                  </div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent">
                    {companyName}
                  </h1>
                  
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 mt-3">
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="h-4 w-4 mr-2 text-[#667eea]" />
                      <span>{formatDate(job?.startDate)} - {formatDate(job?.endDate)}</span>
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
              {/* About Section */}
              <div className="px-6 py-6">
                <h2 className="text-xl font-bold bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent mb-4">
                  About {companyName}
                </h2>
                <p className="text-gray-700 mb-8">{job?.companyPosted?.companyDetails?.description || 'No description provided.'}</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                  <div className="bg-gradient-to-br from-[#667eea]/5 to-[#764ba2]/5 p-5 rounded-lg text-center">
                    <div className="text-3xl font-bold text-gray-900 mb-2">{job?.companyPosted?.companyDetails?.numberOfEmployees || 'N/A'}</div>
                    <div className="text-sm text-gray-600 font-medium">Employees</div>
                  </div>
                  <div className="bg-gradient-to-br from-[#667eea]/5 to-[#764ba2]/5 p-5 rounded-lg text-center">
                    <div className="text-3xl font-bold text-gray-900 mb-2">{job?.companyPosted?.companyDetails?.industryType || 'N/A'}</div>
                    <div className="text-sm text-gray-600 font-medium">Industries</div>
                  </div>
                  <div className="bg-gradient-to-br from-[#667eea]/5 to-[#764ba2]/5 p-5 rounded-lg text-center">
                    <div className="text-3xl font-bold text-gray-900 mb-2">{job?.country || job?.companyPosted?.companyDetails?.country || 'N/A'}</div>
                    <div className="text-sm text-gray-600 font-medium">Countries</div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="px-6 py-6 border-t border-gray-100">
                <h2 className="text-xl font-bold bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent mb-4">
                  {job.lookingFor} Description
                </h2>
                <div className="text-gray-700 whitespace-pre-wrap">
                  {job?.description || 'No job description provided.'}
                </div>
              </div>

              {/* Job Details */}
              <div className="px-6 py-6 border-t border-gray-100">
                <h2 className="text-xl font-bold bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent mb-4">
                  Job Details
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <div>
                      <div className="text-sm font-medium text-[#667eea] mb-1">Looking For</div>
                      <div className="text-base text-gray-900">{job?.lookingFor || 'Not Specified'}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-[#667eea] mb-1">Employment Type</div>
                      <div className="text-base text-gray-900">{job?.employmentType?.join(', ') || 'Not Specified'}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-[#667eea] mb-1">Job Roles</div>
                      <div className="text-base text-gray-900">{job?.jobRoles?.join(', ') || 'Not Specified'}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-[#667eea] mb-1">Work Mode</div>
                      <div className="text-base text-gray-900">{job?.workMode?.join(', ') || 'Not Specified'}</div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <div className="text-sm font-medium text-[#667eea] mb-1">Preferred Hiring Mode</div>
                      <div className="text-base text-gray-900">{job?.companyHiringPreference?.preferredMode || 'Not Specified'}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-[#667eea] mb-1">Amenities/Facilities Required</div>
                      <div className="text-base text-gray-900">{job?.amenitiesRequired?.join(', ') || 'None'}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-[#667eea] mb-1">Job Location</div>
                      <div className="text-base text-gray-900">{workLocation}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Required Skills */}
              {job?.skills && job?.skills.length > 0 && (
                <div className="px-6 py-6 border-t border-gray-100">
                  <h2 className="text-xl font-bold bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent mb-4">
                    Required Skills
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {job.skills.map((skill, index) => (
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
                      <div className="text-base text-gray-900">{job?.degree?.join(' / ') || 'Not Specified'}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-[#667eea] mb-1">Eligible Streams</div>
                      <div className="text-base text-gray-900">{job?.studentStreams?.join(', ') || 'Not Specified'}</div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <div className="text-sm font-medium text-[#667eea] mb-1">Eligible College Categories</div>
                      <div className="text-base text-gray-900">{job?.collegeCategories?.join(', ') || 'Not Specified'}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-[#667eea] mb-1">Minimum Students Required</div>
                      <div className="text-base text-gray-900">{job?.minimumStudents || 'Not Specified'}</div>
                    </div>
                  </div>
                </div>
                
                {/* Additional Criteria */}
                {(job?.eligibilityCriteria || job?.additionalEligibilityCriteria || job?.additionalCriteria) && (
                  <div className="mt-6">
                    <div className="text-sm font-medium text-[#667eea] mb-3">Additional Criteria</div>
                    <div className="space-y-2">
                      {splitIntoMeaningfulPoints(
                        job.eligibilityCriteria || 
                        job.additionalEligibilityCriteria || 
                        job.additionalCriteria
                      ).map((point, index) => {
                        // Special handling for specific criteria
                        if (point.toLowerCase().includes('minimum') && point.toLowerCase().includes('60%')) {
                          return (
                            <div key={index} className="flex items-start">
                              <div className="w-1.5 h-1.5 rounded-full bg-[#667eea] mt-2 mr-3 flex-shrink-0"></div>
                              <span className="text-base text-gray-700">Minimum 60% marks required</span>
                            </div>
                          );
                        } else if (point.toLowerCase().includes('fresher')) {
                          return (
                            <div key={index} className="flex items-start">
                              <div className="w-1.5 h-1.5 rounded-full bg-[#667eea] mt-2 mr-3 flex-shrink-0"></div>
                              <span className="text-base text-gray-700">Freshers preferred</span>
                            </div>
                          );
                        } else if (point.toLowerCase().includes('urgent')) {
                          return (
                            <div key={index} className="flex items-start">
                              <div className="w-1.5 h-1.5 rounded-full bg-[#667eea] mt-2 mr-3 flex-shrink-0"></div>
                              <span className="text-base text-gray-700">Urgent hiring</span>
                            </div>
                          );
                        } else if (point.toLowerCase().includes('remote')) {
                          return (
                            <div key={index} className="flex items-start">
                              <div className="w-1.5 h-1.5 rounded-full bg-[#667eea] mt-2 mr-3 flex-shrink-0"></div>
                              <span className="text-base text-gray-700">Remote work location available</span>
                            </div>
                          );
                        }
                        return (
                          <div key={index} className="flex items-start">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#667eea] mt-2 mr-3 flex-shrink-0"></div>
                            <span className="text-base text-gray-700">{point}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Compensation & Benefits */}
              <div className="px-6 py-6 border-t border-gray-100">
                <h2 className="text-xl font-bold bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent mb-4">
                  Compensation & Benefits
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div className="bg-gradient-to-br from-[#667eea]/5 to-[#764ba2]/5 p-5 rounded-lg text-center">
                    <div className="text-sm font-medium text-[#667eea] mb-2">Total CTC</div>
                    <div className="text-2xl font-bold text-gray-900">
                      {job?.packageDetails?.totalCTC
                        ? `${job.packageDetails.currency || ''} ${job.packageDetails.totalCTC.toLocaleString()}`
                        : 'Not Specified'}
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-[#667eea]/5 to-[#764ba2]/5 p-5 rounded-lg text-center">
                    <div className="text-sm font-medium text-[#667eea] mb-2">Fixed Pay</div>
                    <div className="text-2xl font-bold text-gray-900">
                      {job?.packageDetails?.fixedPay
                        ? `${job.packageDetails.currency || ''} ${job.packageDetails.fixedPay.toLocaleString()}`
                        : 'N/A'}
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-[#667eea]/5 to-[#764ba2]/5 p-5 rounded-lg text-center">
                    <div className="text-sm font-medium text-[#667eea] mb-2">Variable Pay</div>
                    <div className="text-2xl font-bold text-gray-900">
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

              {/* Selection Process */}
              <div className="px-6 py-6 border-t border-gray-100">
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
              <div className="px-6 py-6 border-t border-gray-100">
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
              {job?.contactPerson && (
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
                          {job.contactPerson.name || 'Not Specified'} 
                          <span className='text-sm text-gray-500 ml-2'>({job.contactPerson.designation || 'N/A'})</span>
                        </div>
                        {job.contactPerson.email && (
                          <div className="flex items-center mt-1">
                            <Mail className="h-4 w-4 text-[#667eea] mr-1" />
                            <a href={`mailto:${job.contactPerson.email}`} className="text-[#667eea] hover:text-[#764ba2] text-sm transition-colors">{job.contactPerson.email}</a>
                          </div>
                        )}
                        {job.contactPerson.mobile && (
                          <div className="flex items-center mt-1">
                            <Phone className="h-4 w-4 text-[#667eea] mr-1" />
                            <a href={`tel:${job.contactPerson.mobile}`} className="text-[#667eea] hover:text-[#764ba2] text-sm transition-colors">{job.contactPerson.mobile}</a>
                          </div>
                        )}
                        {job.contactPerson.linkedin && (
                          <a href={job.contactPerson.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center mt-1 text-[#667eea] hover:text-[#764ba2] transition-colors">
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

        {/* Fixed Footer with Register Now Button */}
        {!isApplied && jobStatus.status !== 'Completed' && (
  <div className="sticky bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-40">
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-center">
        <button 
          className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white font-medium rounded-lg hover:shadow-lg hover:shadow-[#667eea]/30 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handleApply}
          disabled={isSubmitting}
        >
          <CheckCircle className="h-5 w-5 mr-2" />
          {isSubmitting ? 'Applying...' : 'Register Now'}
        </button>
      </div>
    </div>
  </div>
)}
      </div>
    </>
  );
};

export default JobDetailModal;