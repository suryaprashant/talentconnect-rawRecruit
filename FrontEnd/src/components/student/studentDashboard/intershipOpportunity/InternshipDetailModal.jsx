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
  ArrowLeft,
  Star,
  Target,
  Users2,
  Bookmark,
  ExternalLink,
  TrendingUp,
  Shield,
  Zap,
  Heart,
  BriefcaseBusiness,
  Code,
  Layers,
  BarChart,
  Cpu,
  Database,
  Palette,
  Megaphone,
  ShoppingBag,
  GraduationCap as GradCap,
  Rocket,
  TrendingUp as TrendingUpIcon,
  Users as UsersIcon,
  Map,
  IndianRupee,
  BadgePercent,
  Home,
  Globe as GlobeIcon,
  Hash,
  Mail as MailIcon,
  Phone as PhoneIcon
} from 'lucide-react';
import { ApplyForInternship, getJobDetails, SaveOppurtunity, viewed } from '@/lib/User_AxiosInstance';
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
  return <span className="text-gray-500 text-sm">Not specified</span>;
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

const InternshipDetailModal = ({ jobId, isOpen, onClose, isApplied: propIsApplied, isSaved: propIsSaved, isInZoomedView = false, onApplySuccess }) => {
  const [jobDetail, setJobDetail] = useState(null);
  const [saved, setSaved] = useState(propIsSaved || false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [showCompanyDetails, setShowCompanyDetails] = useState(false);
  
  const modalRef = useRef(null);
  const contentRef = useRef(null);

  const loadJobDetails = async () => {
    if (!jobId) return;
    
    try {
      setLoading(true);
      const details = await getJobDetails(jobId);
      console.log('Internship details:', details);
      
      if (details && details.data) {
        const jobData = details.data[0] || details.data.data || details.data;
        console.log('Processed internship data:', jobData);
        setJobDetail(jobData);
        
        // Mark as viewed
        if (jobData._id) {
          await viewed(jobData._id);
        }
        
        setError(null);
      } else {
        setError("Internship details not found.");
      }
    } catch (err) {
      console.error("Error loading internship detail: ", err);
      setError("Failed to load internship details. Please try again later.");
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
        title: `${jobDetail?.jobTitle || 'Internship'} at ${jobDetail?.companyPosted?.companyDetails?.companyName || jobDetail?.companyName || 'Company'}`,
        text: `Check out this internship opportunity at ${jobDetail?.companyPosted?.companyDetails?.companyName || jobDetail?.companyName || 'Company'}!`,
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
    if (!jobId || !jobDetail) return;
    
    setIsSubmitting(true);
    try {
      console.log("🎯 Applying for internship with jobId:", jobId);
      const response = await ApplyForInternship(jobId);
      console.log("📦 Application response:", response);

      if (response?.data?.success === true) {
        const successMessage = response.data.msg || 'Application submitted successfully!';
        toast.success(successMessage);
        
        if (onApplySuccess) {
          onApplySuccess({
            jobId: jobId,
            jobTitle: jobDetail.jobTitle || jobDetail.internshipRole,
            company: jobDetail.companyPosted?.companyDetails?.companyName || jobDetail.companyName,
            jobType: "Internship"
          });
        }
        
        setTimeout(() => {
          onClose();
        }, 1500);
      } else {
        const errorMsg = response?.data?.msg || response?.response?.data?.msg || "Could not apply.";
        toast.error(errorMsg);
      }
    } catch (error) {
      console.error("❌ Error applying for internship:", error);
      const errorMessage = error.response?.data?.msg || 'Something went wrong. Please try again.';
      toast.error(errorMessage);
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
      const jobType = "Internship";
      const response = await SaveOppurtunity(jobDetail._id, jobType);
      if (response?.data?.success === true) {
        const newSavedState = !saved;
        setSaved(newSavedState);
        toast.success(newSavedState ? 'Internship saved!' : 'Internship removed from saved');
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

  // Update tabs to remove 'process' tab
  const tabs = [
    { id: 'overview', label: 'Overview', icon: <Info className="h-4 w-4" /> },
    { id: 'requirements', label: 'Requirements', icon: <Target className="h-4 w-4" /> },
    { id: 'benefits', label: 'Compensation', icon: <IndianRupee className="h-4 w-4" /> },
  ];

  // Format stipend with rupee sign
  const formatStipend = () => {
    if (!jobDetail) return 'Not specified';
    
    // Check multiple possible fields for stipend
    const stipendAmount = jobDetail.stipendAmount || jobDetail.stipend?.amount || jobDetail.salary;
    const stipendCurrency = jobDetail.stipend?.currency || '₹';
    const stipendFrequency = jobDetail.stipend?.frequency || '/month';
    
    if (stipendAmount) {
      // Format number with commas
      const formattedAmount = stipendAmount.toLocaleString('en-IN');
      return `${stipendCurrency} ${formattedAmount}${stipendFrequency}`;
    }
    
    // Check for package details as fallback
    if (jobDetail.packageDetails?.totalCTC) {
      const formattedAmount = jobDetail.packageDetails.totalCTC.toLocaleString('en-IN');
      return `₹ ${formattedAmount}`;
    }
    
    return 'Not specified';
  };

  if (!isOpen) return null;

  // Render loading state
  if (loading) {
    return (
      <div className={`relative w-full h-full bg-white ${isInZoomedView ? 'rounded-l-2xl' : 'rounded-2xl'} flex items-center justify-center`}>
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#667eea]"></div>
      </div>
    );
  }

  // Render error state
  if (error || !jobDetail) {
    return (
      <div className={`relative w-full h-full bg-white ${isInZoomedView ? 'rounded-l-2xl' : 'rounded-2xl'} flex items-center justify-center`}>
        <div className="p-8 max-w-md w-full">
          <div className="flex flex-col items-center text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-100 text-red-600 mb-4">
              <X className="h-6 w-6" />
            </div>
            <p className="text-lg font-medium text-gray-900 mb-4">{error || 'Internship not found'}</p>
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
  const companyName = jobDetail?.companyPosted?.companyDetails?.companyName || jobDetail?.companyName || 'Company';
  const companyLogo = jobDetail?.companyPosted?.companyDetails?.companyLogo || null;
  const companyLocation = jobDetail?.companyPosted?.companyDetails?.location || jobDetail?.location?.[0] || 'Not Specified';
  
  const internshipRole = Array.isArray(jobDetail.jobRoles) && jobDetail.jobRoles.length > 0 
    ? jobDetail.jobRoles.join(', ') 
    : jobDetail.jobTitle || 'Internship Position';
  
  const duration = jobDetail?.duration || jobDetail?.internshipDuration || 'Not specified';
  const workMode = Array.isArray(jobDetail?.workMode) && jobDetail.workMode.length > 0
    ? jobDetail.workMode.join(', ')
    : 'Not specified';

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
            {/* Header Section */}
            <div className="bg-gradient-to-r from-[#667eea]/5 to-[#764ba2]/5 px-6 py-5 rounded-xl mb-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-medium text-[#667eea]">
                      {jobStatus.status === 'Closed' ? 'Registrations Completed' : 'Registration Open'}
                    </span>
                  </div>
                  
                  {/* Company Logo and Name Section */}
                  <div className="flex items-center gap-3 mb-4">
                    {/* Company Logo with first letter fallback */}
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
                          <h1 className="text-2xl font-bold bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent truncate">
                            {companyName}
                          </h1>
                          <ExternalLink className="h-5 w-5 text-[#667eea] opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                        </div>
                        <div className="flex items-center text-sm text-gray-600 mt-1">
                          <MapPin className="h-4 w-4 mr-2 text-[#667eea] flex-shrink-0" />
                          <span className="truncate">{companyLocation}</span>
                        </div>
                      </div>
                    </button>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 mt-3">
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="h-4 w-4 mr-2 text-[#667eea]" />
                      <span>Posted: {formatDate(jobDetail?.createdAt)}</span>
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

            <div className="bg-white/90 backdrop-blur-sm border border-gray-100 rounded-xl shadow-lg overflow-hidden">
              
              {/* Overview Tab */}
              {activeTab === 'overview' && (
                <div className="px-6 py-6">
                  {/* About Company */}
                  <div className="mb-8">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-xl font-bold bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent">
                        About {companyName}
                      </h2>
                      {/* <button
                        onClick={handleCompanyClick}
                        className="inline-flex items-center text-sm text-[#667eea] hover:text-[#764ba2] transition-colors"
                      >
                        View Company Details
                        <ExternalLink className="h-4 w-4 ml-1" />
                      </button> */}
                    </div>
                    <p className="text-gray-700 mb-8">
                      {jobDetail.companyPosted?.companyDetails?.description || 
                       jobDetail.companyDescription || 
                       'No company description available.'}
                    </p>
                    
                    {/* Company Stats */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                      <div className="bg-gradient-to-br from-[#667eea]/5 to-[#764ba2]/5 p-5 rounded-lg text-center">
                        <div className="text-3xl font-bold text-gray-900 mb-2">
                          {jobDetail.companyPosted?.companyDetails?.numberOfEmployees?.toLocaleString() || 'N/A'}
                        </div>
                        <div className="text-sm text-gray-600 font-medium">Employees</div>
                      </div>
                      <div className="bg-gradient-to-br from-[#667eea]/5 to-[#764ba2]/5 p-5 rounded-lg text-center">
                        <div className="text-3xl font-bold text-gray-900 mb-2">
                          {jobDetail.companyPosted?.companyDetails?.industryType || 'N/A'}
                        </div>
                        <div className="text-sm text-gray-600 font-medium">Industry</div>
                      </div>
                      <div className="bg-gradient-to-br from-[#667eea]/5 to-[#764ba2]/5 p-5 rounded-lg text-center">
                        <div className="text-3xl font-bold text-gray-900 mb-2">
                          {jobDetail.companyPosted?.companyDetails?.country || 'N/A'}
                        </div>
                        <div className="text-sm text-gray-600 font-medium">Country</div>
                      </div>
                    </div>
                  </div>

                  {/* Internship Details */}
                  <div className="px-6 py-6 border-t border-gray-100">
                    <h2 className="text-xl font-bold bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent mb-4">
                      Internship Details
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <div className="text-sm font-medium text-[#667eea] mb-1">Internship Role</div>
                          {renderTags(jobDetail.jobRoles)}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-[#667eea] mb-1">Work Location</div>
                          {renderTags(jobDetail.location)}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-[#667eea] mb-1">Work Mode</div>
                          {renderTags(jobDetail.workMode)}
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <div className="text-sm font-medium text-[#667eea] mb-1">Duration</div>
                          <div className="text-base text-gray-900">{duration}</div>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-[#667eea] mb-1">Start Date</div>
                          <div className="text-base text-gray-900">{formatDate(jobDetail.startDate)}</div>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-[#667eea] mb-1">Employment Type</div>
                          <div className="text-base text-gray-900">
                            {Array.isArray(jobDetail.employmentType) 
                              ? jobDetail.employmentType.join(', ') 
                              : jobDetail.employmentType || 'Internship'}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* About the Internship */}
                  {jobDetail.description && (
                    <div className="px-6 py-6 border-t border-gray-100">
                      <h2 className="text-xl font-bold bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent mb-4">
                        About the Internship
                      </h2>
                      <div className="text-gray-700 whitespace-pre-wrap">
                        {jobDetail.description}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Requirements Tab */}
              {activeTab === 'requirements' && (
                <div className="px-6 py-6">
                  <h2 className="text-xl font-bold bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent mb-4">
                    Internship Requirements
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="space-y-4">
                      <div>
                        <div className="text-sm font-medium text-[#667eea] mb-1">Required Degrees</div>
                        {renderTags(jobDetail.degree)}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-[#667eea] mb-1">Eligible Streams</div>
                        {renderTags(jobDetail.studentStreams)}
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <div className="text-sm font-medium text-[#667eea] mb-1">Year of Study</div>
                        <div className="text-base text-gray-900">
                          {jobDetail.yearOfStudy || 'All years'}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-[#667eea] mb-1">Experience Level</div>
                        <div className="text-base text-gray-900">
                          {jobDetail.experienceLevel || 'Fresher'}
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
                </div>
              )}

              {/* Compensation Tab - FIXED */}
              {activeTab === 'benefits' && (
                <div className="px-6 py-6">
                  <h2 className="text-xl font-bold bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent mb-6">
                    Compensation & Benefits
                  </h2>

                  {/* Stipend Details */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {/* Stipend Card */}
                    <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 border border-emerald-200 rounded-xl p-5">
                      <div className="flex items-center mb-3">
                        <div className="p-2 bg-emerald-100 rounded-lg mr-3">
                          <IndianRupee className="h-6 w-6 text-emerald-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-emerald-800">Monthly Stipend</h3>
                          <p className="text-sm text-emerald-600">During internship</p>
                        </div>
                      </div>
                      <div className="text-2xl font-bold text-emerald-900">
                        {formatStipend()}
                      </div>
                    </div>

                    {/* Certificate Card */}
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-5">
                      <div className="flex items-center mb-3">
                        <div className="p-2 bg-blue-100 rounded-lg mr-3">
                          <Award className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-blue-800">Certificate</h3>
                          <p className="text-sm text-blue-600">Upon completion</p>
                        </div>
                      </div>
                      <div className="text-lg font-medium text-blue-900">
                        Provided
                      </div>
                    </div>

                    {/* Letter of Recommendation Card */}
                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-xl p-5">
                      <div className="flex items-center mb-3">
                        <div className="p-2 bg-purple-100 rounded-lg mr-3">
                          <FileText className="h-6 w-6 text-purple-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-purple-800">Letter of Recommendation</h3>
                          <p className="text-sm text-purple-600">Performance based</p>
                        </div>
                      </div>
                      <div className="text-lg font-medium text-purple-900">
                        Available
                      </div>
                    </div>
                  </div>

                  {/* Additional Benefits */}
                  <div className="px-6 py-6 border-t border-gray-100">
                    <h2 className="text-xl font-bold bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent mb-4">
                      Internship Benefits
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
                        <>
                          <span className="px-3 py-1.5 bg-gradient-to-r from-[#667eea]/10 to-[#764ba2]/10 text-[#667eea] border border-[#667eea]/20 rounded-full text-sm font-medium">
                            Hands-on Experience
                          </span>
                          <span className="px-3 py-1.5 bg-gradient-to-r from-[#667eea]/10 to-[#764ba2]/10 text-[#667eea] border border-[#667eea]/20 rounded-full text-sm font-medium">
                            Skill Development
                          </span>
                          <span className="px-3 py-1.5 bg-gradient-to-r from-[#667eea]/10 to-[#764ba2]/10 text-[#667eea] border border-[#667eea]/20 rounded-full text-sm font-medium">
                            Mentorship
                          </span>
                          <span className="px-3 py-1.5 bg-gradient-to-r from-[#667eea]/10 to-[#764ba2]/10 text-[#667eea] border border-[#667eea]/20 rounded-full text-sm font-medium">
                            Networking Opportunities
                          </span>
                        </>
                      )}
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

export default InternshipDetailModal;