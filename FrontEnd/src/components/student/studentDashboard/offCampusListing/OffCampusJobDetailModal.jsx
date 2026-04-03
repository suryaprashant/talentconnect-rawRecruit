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
  ExternalLink,
  Home,
  Globe as GlobeIcon,
  Hash,
  Mail as MailIcon,
  Phone as PhoneIcon,
  Map,
  Info,
  Target,
  IndianRupee,
  Settings,
  Layers,
  TrendingUp,
  Shield,
  Zap
} from 'lucide-react';
import { ApplyForOppurtunity, getJobDetails, SaveOppurtunity } from '@/lib/User_AxiosInstance';
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from 'react-router-dom';
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
        : splitIntoBullets(step)
    );
  }

  if (typeof selectionProcess === 'string') {
    if (selectionProcess.includes('+')) {
      return selectionProcess.split('+').map(s => s.trim());
    }
    return splitIntoBullets(selectionProcess);
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
  return <span className="text-gray-500 text-sm">Not specified</span>;
};
const LoginPromptModal = ({ isOpen, onClose }) => {
  const navigate=useNavigate()
  const onLogin = ()=>{
   navigate('/userselection')
  }

  if (!isOpen) return null;
 
  return (
    <div className="fixed inset-0 z-[60] overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 text-center">
        <div className="fixed inset-0 transition-opacity bg-gray-900 bg-opacity-50 backdrop-blur-sm" onClick={onClose}></div>

        <div className="inline-block align-middle bg-white rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:max-w-md sm:w-full p-8">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-indigo-100 mb-4">
              <Briefcase className="h-8 w-8 text-[#667eea]" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Ready to Apply?</h3>
            <p className="text-gray-600 mb-8">
              You need to be logged in  to apply for internships/jobs and track your applications.
            </p>
            
            <div className="flex flex-col gap-3">
              <button
                onClick={onLogin}
                className="w-full py-3 px-4 bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white font-bold rounded-xl hover:shadow-lg transition-all duration-200"
              >
                Login to Continue
              </button>
              <button
                onClick={onClose}
                className="w-full py-3 px-4 bg-gray-50 text-gray-700 font-semibold rounded-xl hover:bg-gray-100 transition-colors"
              >
                Maybe Later
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
// Simple Company Details Modal
const CompanyDetailsModal = ({ company, isOpen, onClose }) => {
  if (!isOpen || !company) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-white rounded-xl shadow-xl overflow-hidden">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-50 p-2 bg-white hover:bg-gray-100 rounded-full shadow-md transition-colors"
        >
          <X className="h-5 w-5 text-gray-700" />
        </button>

        {/* Header */}
        <div className="bg-gradient-to-r from-[#667eea] to-[#764ba2] p-5">
          <div className="flex items-center gap-3">
            {/* Company Logo with first letter fallback */}
            {company.logo ? (
              <img 
                src={company.logo} 
                alt={`${company.name} logo`}
                className="w-12 h-12 rounded-lg object-cover border-2 border-white shadow-md"
              />
            ) : (
              <div className="w-12 h-12 rounded-lg bg-white flex items-center justify-center border-2 border-white shadow-md">
                <span className="text-xl font-bold text-[#667eea]">
                  {company.name?.charAt(0)?.toUpperCase() || 'C'}
                </span>
              </div>
            )}
            <div>
              <h2 className="text-xl font-bold text-white">{company.name}</h2>
              {company.location && (
                <div className="flex items-center text-white/90 mt-1">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span className="text-sm">{company.location}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-5">
          <div className="space-y-4">
            {/* Company Details Grid */}
            <div className="grid grid-cols-2 gap-3">
              {/* Row 1 */}
              <div className="space-y-1">
                <div className="flex items-center text-sm text-gray-500">
                  <Building className="h-4 w-4 mr-2 text-[#667eea]" />
                  <span>Company</span>
                </div>
                <div className="text-sm font-medium text-gray-900 truncate">
                  {company.name || 'N/A'}
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center text-sm text-gray-500">
                  <Hash className="h-4 w-4 mr-2 text-[#667eea]" />
                  <span>Industry</span>
                </div>
                <div className="text-sm font-medium text-gray-900 truncate">
                  {company.industry || 'N/A'}
                </div>
              </div>

              {/* Row 2 */}
              <div className="space-y-1">
                <div className="flex items-center text-sm text-gray-500">
                  <Users className="h-4 w-4 mr-2 text-[#667eea]" />
                  <span>Employees</span>
                </div>
                <div className="text-sm font-medium text-gray-900">
                  {company.employees || 'N/A'}
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center text-sm text-gray-500">
                  <GlobeIcon className="h-4 w-4 mr-2 text-[#667eea]" />
                  <span>Country</span>
                </div>
                <div className="text-sm font-medium text-gray-900 truncate">
                  {company.country || 'N/A'}
                </div>
              </div>

              {/* Row 3 - City & State */}
              <div className="space-y-1">
                <div className="flex items-center text-sm text-gray-500">
                  <Map className="h-4 w-4 mr-2 text-[#667eea]" />
                  <span>City</span>
                </div>
                <div className="text-sm font-medium text-gray-900 truncate">
                  {company.city || 'N/A'}
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center text-sm text-gray-500">
                  <MapPin className="h-4 w-4 mr-2 text-[#667eea]" />
                  <span>State</span>
                </div>
                <div className="text-sm font-medium text-gray-900 truncate">
                  {company.state || 'N/A'}
                </div>
              </div>

              {/* Row 4 - Pincode & Website */}
              <div className="space-y-1">
                <div className="flex items-center text-sm text-gray-500">
                  <Home className="h-4 w-4 mr-2 text-[#667eea]" />
                  <span>Pincode</span>
                </div>
                <div className="text-sm font-medium text-gray-900">
                  {company.pincode || 'N/A'}
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center text-sm text-gray-500">
                  <ExternalLink className="h-4 w-4 mr-2 text-[#667eea]" />
                  <span>Website</span>
                </div>
                <div className="text-sm font-medium text-gray-900 truncate">
                  {company.website ? (
                    <a 
                      href={company.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-[#667eea] hover:text-[#764ba2] hover:underline"
                    >
                      {company.website.replace(/^https?:\/\//, '')}
                    </a>
                  ) : 'N/A'}
                </div>
              </div>
            </div>

            {/* Contact Info if available */}
            {(company.email || company.phone) && (
              <div className="pt-4 border-t border-gray-200">
                <h4 className="text-sm font-semibold text-gray-900 mb-2">Contact</h4>
                <div className="space-y-2">
                  {company.email && (
                    <div className="flex items-center text-sm">
                      <MailIcon className="h-4 w-4 mr-2 text-[#667eea]" />
                      <a 
                        href={`mailto:${company.email}`}
                        className="text-gray-700 hover:text-[#667eea] hover:underline truncate"
                      >
                        {company.email}
                      </a>
                    </div>
                  )}
                  {company.phone && (
                    <div className="flex items-center text-sm">
                      <PhoneIcon className="h-4 w-4 mr-2 text-[#667eea]" />
                      <a 
                        href={`tel:${company.phone}`}
                        className="text-gray-700 hover:text-[#667eea] hover:underline"
                      >
                        {company.phone}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-4 bg-gray-50">
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const OffCampusJobDetailModal = ({ jobId, matchScore, isOpen, onClose, isApplied: propIsApplied, isSaved: propIsSaved, isInZoomedView = false }) => {
  const [jobDetail, setJobDetail] = useState(null);
  const [saved, setSaved] = useState(propIsSaved || false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [showCompanyDetails, setShowCompanyDetails] = useState(false);
  const { isAuthenticated } = useAuth(); // Get auth status
  
  const [showLoginModal, setShowLoginModal] = useState(false);
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
    if (!isAuthenticated) {
      setShowLoginModal(true);
      return;
    }
    setIsSubmitting(true);
    try {
      const response = await ApplyForOppurtunity(jobId, matchScore);
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
    if (!isAuthenticated) {
      setShowLoginModal(true);
      return;
    }
    
    try {
      const jobType = jobDetail?.jobType || "Off-campus";
      const response = await SaveOppurtunity(jobDetail._id, jobType);
      if (response?.data?.success === true) {
        const newSavedState = !saved;
        setSaved(newSavedState);
        toast.success(newSavedState ? 'Job saved!' : 'Job removed from saved');
      } else {
        toast.error(response.response?.data?.msg || "Could not save.");
      }
    } catch (error) {
      console.log("Error: ", error);
      toast.error('Something went wrong');
    }
  };

  const handleCompanyClick = () => {
    setShowCompanyDetails(true);
  };

  const fixedPay = jobDetail?.packageDetails?.fixedPay ?? null;
  const variablePay = jobDetail?.packageDetails?.variablePay ?? jobDetail?.packageDetails?.variable ?? jobDetail?.packageDetails?.joiningBonus ?? null;

  // Define tabs
  const tabs = [
    { id: 'overview', label: 'Overview', icon: <Info className="h-4 w-4" /> },
    { id: 'requirements', label: 'Requirements', icon: <Target className="h-4 w-4" /> },
    { id: 'compensation', label: 'Compensation', icon: <IndianRupee className="h-4 w-4" /> },
    { id: 'process', label: 'Process', icon: <Settings className="h-4 w-4" /> },
  ];

  // Format salary
  const formatSalary = () => {
    if (jobDetail?.salaryRange?.min || jobDetail?.salaryRange?.max) {
      const min = jobDetail.salaryRange.min?.toLocaleString() || 'Negotiable';
      const max = jobDetail.salaryRange.max?.toLocaleString() || 'Negotiable';
      return min === max ? `₹${min}` : `₹${min} - ₹${max}`;
    }
    if (jobDetail?.packageDetails?.totalCTC) {
      return `₹${jobDetail.packageDetails.totalCTC.toLocaleString()}`;
    }
    return 'Not Disclosed';
  };

  // Format work mode
  const formatWorkMode = () => {
    if (Array.isArray(jobDetail?.workMode)) {
      return jobDetail.workMode.join(', ');
    }
    return jobDetail?.workMode || 'Not specified';
  };

  // Format work location
  const formatWorkLocation = () => {
    if (Array.isArray(jobDetail?.workLocation) && jobDetail.workLocation.length > 0) {
      return jobDetail.workLocation.join(', ');
    }
    return jobDetail?.location || 'Not Specified';
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
  const companyLogo = jobDetail?.companyPosted?.profileImageUrl || null;
  const companyLocation = jobDetail?.companyPosted?.companyDetails?.location || jobDetail?.location || 'Not Specified';
  const workLocation = formatWorkLocation();
  
  // Prepare company data for modal
  const companyData = {
    name: companyName,
    logo: companyLogo,
    location: companyLocation,
    description: jobDetail.companyPosted?.companyDetails?.description || jobDetail.companyDescription,
    industry: jobDetail.companyPosted?.companyDetails?.industryType,
    employees: jobDetail.companyPosted?.companyDetails?.numberOfEmployees,
    website: jobDetail.companyPosted?.companyDetails?.website,
    country: jobDetail.companyPosted?.companyDetails?.country,
    city: jobDetail.companyPosted?.companyDetails?.city,
    state: jobDetail.companyPosted?.companyDetails?.state,
    pincode: jobDetail.companyPosted?.companyDetails?.pincode,
    email: jobDetail.companyPosted?.companyDetails?.email,
    phone: jobDetail.companyPosted?.companyDetails?.phone
  };

  return (
    <>
      {/* Company Details Modal */}
      <CompanyDetailsModal
        company={companyData}
        isOpen={showCompanyDetails}
        onClose={() => setShowCompanyDetails(false)}
      />
    <LoginPromptModal 
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
       
      />

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
        <div ref={contentRef} className="flex-1 overflow-y-auto">
          <div className="p-6">
            {/* Header Section */}
            <div className="bg-gradient-to-r from-gray-50 to-white border border-gray-100 rounded-xl px-6 py-4 mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  {/* Company Logo */}
                  <button
                    onClick={handleCompanyClick}
                    className="group flex items-center gap-3 text-left hover:opacity-90 transition-opacity"
                  >
                    {companyLogo ? (
                      <div className="flex-shrink-0">
                        <img 
                          src={companyLogo} 
                          alt={`${companyName} logo`}
                          className="w-12 h-12 rounded-lg object-cover border border-gray-200 shadow-sm group-hover:shadow-md transition-shadow"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.style.display = 'none';
                            e.target.nextElementSibling.style.display = 'flex';
                          }}
                        />
                        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#667eea]/10 to-[#764ba2]/10 border border-gray-200 shadow-sm hidden items-center justify-center">
                          <span className="text-lg font-bold text-[#667eea]">
                            {companyName?.charAt(0)?.toUpperCase() || 'C'}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#667eea]/10 to-[#764ba2]/10 border border-gray-200 shadow-sm flex items-center justify-center flex-shrink-0 group-hover:shadow-md transition-shadow">
                        <span className="text-lg font-bold text-[#667eea]">
                          {companyName?.charAt(0)?.toUpperCase() || 'C'}
                        </span>
                      </div>
                    )}
                    
                    {/* Company Name and Location */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h1 className="text-xl font-bold text-gray-900 truncate">
                          {companyName}
                        </h1>
                        <ExternalLink className="h-4 w-4 text-[#667eea] opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                      </div>
                      <div className="flex items-center text-sm text-gray-600 mt-1">
                        <MapPin className="h-4 w-4 mr-2 text-[#667eea] flex-shrink-0" />
                        <span className="truncate">{companyLocation}</span>
                      </div>
                    </div>
                  </button>
                </div>
                
                {/* Save and Share buttons - Moved to header */}
                <div className="flex items-center gap-2">
                  {!saved && !isApplied && (
                    <button
                      onClick={handleSave}
                      disabled={saved}
                      className={`inline-flex items-center justify-center px-3 py-1.5 border ${saved ? 'border-gray-300 bg-gray-50 text-gray-400 cursor-not-allowed' : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'} text-sm font-medium rounded-lg transition-all duration-200`}
                    >
                      <Save className={`h-4 w-4 mr-1 ${saved ? 'text-[#667eea]' : 'text-gray-400'}`} fill={saved ? 'currentColor' : 'none'} />
                      {saved ? 'Saved' : 'Save'}
                    </button>
                  )}
                  <button
                    onClick={handleShare}
                    className="inline-flex items-center justify-center px-3 py-1.5 border border-gray-300 bg-white text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-50 transition-all duration-200"
                  >
                    <Share2 className="h-4 w-4 mr-1 text-gray-400" />
                    Share
                  </button>
                </div>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="mb-6">
              <div className="flex space-x-1 bg-white/50 backdrop-blur-sm border border-gray-100 rounded-xl p-1">
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center justify-center flex-1 py-2.5 px-3 rounded-lg text-sm font-medium transition-all duration-200 ${activeTab === tab.id 
                      ? 'bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'}`}
                  >
                    <span className="mr-2">{tab.icon}</span>
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Content Area */}
            <div className="space-y-4">
              
              {/* Overview Tab */}
              {activeTab === 'overview' && (
                <div className="space-y-4">
                  {/* Job Details Box */}
                  {console.log('her',jobDetail)}
                  <div className="bg-gradient-to-r from-gray-50 to-white border border-gray-100 rounded-xl p-5">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">Job Details</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-4">
                        <div>
                          <div className="text-sm font-medium text-[#667eea] mb-2">Job Roles</div>
                          {renderTags(jobDetail.jobRoles)}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-[#667eea] mb-2">Work Location</div>
                          <div className="text-base text-gray-900">{workLocation}</div>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-[#667eea] mb-2">Work Mode</div>
                          <div className="text-base text-gray-900">{formatWorkMode()}</div>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <div className="text-sm font-medium text-[#667eea] mb-2">Employment Type</div>
                          <div className="text-base text-gray-900">
                            {Array.isArray(jobDetail.employmentType) 
                              ? jobDetail.employmentType.join(', ') 
                              : jobDetail.employmentType || 'Not Specified'}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-[#667eea] mb-2">Experience Level</div>
                          <div className="text-base text-gray-900">{jobDetail.experienceLevel || 'Entry Level'}</div>
                        </div>
                        {/* <div>
                          <div className="text-sm font-medium text-[#667eea] mb-2">Notice Period</div>
                          <div className="text-base text-gray-900">{jobDetail.noticePeriod || 'Immediate to 30 days'}</div>
                        </div> */}
                      </div>
                    </div>
                  </div>

                  {/* Job Description Box */}
                  {jobDetail.description && (
                    <div className="bg-gradient-to-r from-gray-50 to-white border border-gray-100 rounded-xl p-5">
                      <h2 className="text-lg font-bold text-gray-900 mb-4">Job Description</h2>
                      <div className="text-gray-700 whitespace-pre-wrap">
                        {jobDetail.description}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Requirements Tab */}
{activeTab === 'requirements' && (
  <div className="space-y-4">
    {/* Eligibility Box */}
    <div className="bg-gradient-to-r from-gray-50 to-white border border-gray-100 rounded-xl p-5">
      <h2 className="text-lg font-bold text-gray-900 mb-4">Eligibility Criteria</h2>
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="text-sm font-medium text-[#667eea] mb-2">Eligible Degrees</div>
            <div className="text-base text-gray-900">{jobDetail?.degree?.join(' / ') || 'Not Specified'}</div>
          </div>
          <div>
            <div className="text-sm font-medium text-[#667eea] mb-2">Experience Level</div>
            <div className="text-base text-gray-900">{jobDetail.experienceLevel || 'Entry Level'}</div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="text-sm font-medium text-[#667eea] mb-2">Eligible Streams</div>
            <div className="text-base text-gray-900">{jobDetail?.studentStreams?.join(', ') || 'Not Specified'}</div>
          </div>

          <div>
            <div className="text-sm font-medium text-[#667eea] mb-2">CGPA Requirement</div>
            <div className="text-base text-gray-900">{jobDetail.cgpa ? `${jobDetail.cgpa} CGPA` : 'Not Specified'}</div>
          </div>
        </div>

        {/* Additional Requirements from Eligibility Criteria field - Display as bullet points */}
        {jobDetail.eligibilityCriteria && (
          <div className="pt-2">
            <div className="text-sm font-medium text-[#667eea] mb-2">Additional Criteria</div>
            <ul className="space-y-1">
              {jobDetail.eligibilityCriteria.split('\n').map((point, index) => 
                point.trim() && (
                  <li key={index} className="text-gray-700 flex items-start">
                    <span className="mr-2 text-[#667eea]">•</span>
                    <span>{point.trim()}</span>
                  </li>
                )
              )}
            </ul>
          </div>
        )}
      </div>
    </div>

    {/* Required Skills Box */}
    {jobDetail?.skills && jobDetail?.skills.length > 0 && (
      <div className="bg-gradient-to-r from-gray-50 to-white border border-gray-100 rounded-xl p-5">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Required Skills</h2>
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
  </div>
)}

              {/* Compensation Tab */}
              {activeTab === 'compensation' && (
                <div className="space-y-4">
                  {/* Compensation Details Box */}
                  <div className="bg-gradient-to-r from-gray-50 to-white border border-gray-100 rounded-xl p-5">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">Compensation Details</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      {/* Total Package Card */}
                      <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 border border-emerald-200 rounded-lg p-4">
                        <div className="flex items-center mb-2">
                          <div className="p-2 bg-emerald-100 rounded-lg mr-2">
                            <TrendingUp className="h-5 w-5 text-emerald-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-emerald-800 text-sm">Total Package</h3>
                            <p className="text-xs text-emerald-600">Annual CTC</p>
                          </div>
                        </div>
                        <div className="text-xl font-bold text-emerald-900 mt-2">
                          {formatSalary()}
                        </div>
                      </div>

                      {/* Fixed Pay Card */}
                      {fixedPay !== null && (
                        <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-4">
                          <div className="flex items-center mb-2">
                            <div className="p-2 bg-blue-100 rounded-lg mr-2">
                              <Shield className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-blue-800 text-sm">Fixed Pay</h3>
                              <p className="text-xs text-blue-600">Guaranteed</p>
                            </div>
                          </div>
                          <div className="text-xl font-bold text-blue-900 mt-2">
                            ₹{Number(fixedPay).toLocaleString()}
                          </div>
                        </div>
                      )}

                      {/* Variable Pay Card */}
                      {variablePay !== null && (
                        <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-lg p-4">
                          <div className="flex items-center mb-2">
                            <div className="p-2 bg-purple-100 rounded-lg mr-2">
                              <Zap className="h-5 w-5 text-purple-600" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-purple-800 text-sm">Variable Pay</h3>
                              <p className="text-xs text-purple-600">Performance based</p>
                            </div>
                          </div>
                          <div className="text-xl font-bold text-purple-900 mt-2">
                            ₹{Number(variablePay).toLocaleString()}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Benefits Section */}
                    <div>
                      <h3 className="font-medium text-[#667eea] mb-4">Benefits Offered</h3>
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
                          <>
                            <span className="px-3 py-1.5 bg-gradient-to-r from-[#667eea]/10 to-[#764ba2]/10 text-[#667eea] border border-[#667eea]/20 rounded-full text-sm font-medium">
                              Health Insurance
                            </span>
                            <span className="px-3 py-1.5 bg-gradient-to-r from-[#667eea]/10 to-[#764ba2]/10 text-[#667eea] border border-[#667eea]/20 rounded-full text-sm font-medium">
                              Flexible Work Hours
                            </span>
                            <span className="px-3 py-1.5 bg-gradient-to-r from-[#667eea]/10 to-[#764ba2]/10 text-[#667eea] border border-[#667eea]/20 rounded-full text-sm font-medium">
                              Paid Time Off
                            </span>
                            <span className="px-3 py-1.5 bg-gradient-to-r from-[#667eea]/10 to-[#764ba2]/10 text-[#667eea] border border-[#667eea]/20 rounded-full text-sm font-medium">
                              Learning Allowance
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Process Tab */}
              {activeTab === 'process' && (
                <div className="space-y-4">
                  {/* Selection Process Box */}
                  <div className="bg-gradient-to-r from-gray-50 to-white border border-gray-100 rounded-xl p-5">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">Selection Process</h2>

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

                  {/* Important Dates Box */}
                  {(jobDetail.endDate ||
                    jobDetail.onlineTestDate ||
                    jobDetail.interviewWindow ||
                    jobDetail.offerRolloutDate) && (
                    <div className="bg-gradient-to-r from-gray-50 to-white border border-gray-100 rounded-xl p-5">
                      <h2 className="text-lg font-bold text-gray-900 mb-4">Important Dates</h2>

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

                  {/* Contact Information Box */}
                  {jobDetail.contactPerson && (
                    <div className="bg-gradient-to-r from-gray-50 to-white border border-gray-100 rounded-xl p-5">
                      <h2 className="text-lg font-bold text-gray-900 mb-4">Contact Person</h2>
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
                  className="inline-flex items-center justify-center px-8 py-3 bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white font-medium rounded-lg hover:shadow-lg hover:shadow-[#667eea]/30 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
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