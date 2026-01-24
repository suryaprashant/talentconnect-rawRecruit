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
  Map
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
  return <span className="text-gray-500 text-sm">Not specified</span>;
};

const InternshipDetailModal = ({ jobId, isOpen, onClose, isApplied: propIsApplied, isSaved: propIsSaved, isInZoomedView = false, onApplySuccess }) => {
  const [jobDetail, setJobDetail] = useState(null);
  const [saved, setSaved] = useState(propIsSaved || false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  
  const modalRef = useRef(null);

  const loadJobDetails = async () => {
    if (!jobId) return;
    
    try {
      setLoading(true);
      const details = await getJobDetails(jobId);
      if (details && details.data && details.data[0]) {
        const jobData = details.data[0];
        setJobDetail(jobData);
        
        // Mark as viewed
        await viewed(jobData._id);
        
        // Ensure the job type is set to "Internship"
        if (!jobData.jobType || (jobData.jobType !== "Internship" && jobData.jobType !== "internship")) {
          console.log("🔍 Job type detected as:", jobData.jobType, "Forcing to Internship");
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
        title: `${jobDetail?.jobTitle || 'Internship'} at ${jobDetail?.companyPosted?.companyDetails?.companyName}`,
        text: `Check out this internship opportunity at ${jobDetail?.companyPosted?.companyDetails?.companyName}!`,
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
      console.log("🔍 Job detail structure:", {
        jobId: jobId,
        jobTitle: jobDetail.jobTitle,
        jobType: jobDetail.jobType,
        company: jobDetail.companyPosted?.companyDetails?.companyName
      });

      const response = await ApplyForOppurtunity(jobId);
      console.log("📦 Application response:", response);

      if (response?.data?.success === true) {
        const successMessage = response.data.msg || 'Application submitted successfully!';
        toast.success(successMessage);
        
        // Notify parent component about successful application
        if (onApplySuccess) {
          onApplySuccess({
            jobId: jobId,
            jobTitle: jobDetail.jobTitle || jobDetail.internshipRole,
            company: jobDetail.companyPosted?.companyDetails?.companyName,
            jobType: "Internship"
          });
        }
        
        // Close modal after successful application
        setTimeout(() => {
          onClose();
        }, 1500);
      } else {
        const errorMsg = response?.data?.msg || response?.response?.data?.msg || "Could not apply.";
        console.error("❌ Application failed:", errorMsg);
        toast.error(errorMsg);
      }
    } catch (error) {
      console.error("❌ Error applying for internship:", error);
      console.error("Error details:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      
      const errorMessage = error.response?.data?.msg || 'Something went wrong. Please try again.';
      toast.error(errorMessage);
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
    if (!jobDetail?._id) return;
    
    try {
      // Ensure we're saving with "Internship" job type
      const jobType = "Internship";
      console.log("💾 Saving internship with jobType:", jobType);
      
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

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <Info className="h-4 w-4" /> },
    { id: 'requirements', label: 'Requirements', icon: <Target className="h-4 w-4" /> },
    { id: 'benefits', label: 'Compensation', icon: <DollarSign className="h-4 w-4" /> },
    { id: 'process', label: 'Process', icon: <TrendingUpIcon className="h-4 w-4" /> },
  ];

  if (!isOpen) return null;

  // Render loading state
  if (loading) {
    return (
      <div className={`relative w-full h-full bg-white ${isInZoomedView ? 'rounded-l-2xl' : 'rounded-2xl'} flex items-center justify-center`}>
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#667eea] mb-4"></div>
          <p className="text-gray-600">Loading internship details...</p>
        </div>
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
  const companyName = jobDetail?.companyPosted?.companyDetails?.companyName || 'Company';
  
  // For internships, show stipend instead of CTC
  const hasStipend = jobDetail?.stipend || jobDetail?.stipendAmount;
  
  // Determine the main internship role/title
  const internshipRole = Array.isArray(jobDetail.jobRoles) && jobDetail.jobRoles.length > 0 
    ? jobDetail.jobRoles.join(', ') 
    : jobDetail.jobTitle || 'Internship Position';
  
  // Extract internship-specific fields
  const duration = jobDetail?.duration || jobDetail?.internshipDuration || 'Not specified';
  const workMode = Array.isArray(jobDetail?.workMode) && jobDetail.workMode.length > 0
    ? jobDetail.workMode.join(', ')
    : 'Not specified';

  // Format stipend for display
  const formatStipend = () => {
    if (!hasStipend) return 'Not specified';
    
    if (typeof jobDetail.stipend === 'object') {
      const stipend = jobDetail.stipend;
      return `${stipend.currency || '₹'} ${stipend.amount || 'N/A'}${stipend.frequency ? '/' + stipend.frequency : ''}`;
    }
    
    return jobDetail.stipendAmount || jobDetail.stipend || 'Not specified';
  };

  return (
    <>
      {/* Backdrop - Only show when not in zoomed view */}
      {!isInZoomedView && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity" />
        </div>
      )}
      
      {/* Modal Container */}
      <div className={`
        ${isInZoomedView ? 'relative h-full w-full' : 'fixed inset-0 z-50 flex items-center justify-center p-4'}
      `}>
        <div 
          ref={modalRef}
          className={`
            ${isInZoomedView ? 'h-full rounded-l-2xl' : 'w-full max-w-6xl rounded-2xl max-h-[90vh]'}
            bg-white shadow-2xl overflow-hidden flex flex-col
          `}
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
                <div className="flex justify-between items-start mb-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${jobStatus.color}`}>
                    {jobStatus.status === 'Completed' ? 'Registrations Completed' : 'Registration Open'}
                  </span>
                  <div className="flex items-center space-x-2">
                    {hasStipend && (
                      <span className="px-3 py-1 bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-700 rounded-full text-xs font-semibold flex items-center">
                        <DollarSign className="h-3 w-3 mr-1" />
                        Stipend: {formatStipend()}
                      </span>
                    )}
                    {duration !== 'Not specified' && (
                      <span className="px-3 py-1 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 rounded-full text-xs font-semibold flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {duration}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center mb-3">
                  <div className="w-14 h-14 bg-gradient-to-br from-[#667eea]/20 to-[#764ba2]/20 mr-4 flex items-center justify-center rounded-full overflow-hidden border-2 border-white">
                    {jobDetail.companyPosted?.profileImage ? (
                      <img
                        src={jobDetail.companyPosted.profileImage}
                        alt={companyName}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://placehold.co/56x56/cccccc/000000?text=Logo';
                        }}
                      />
                    ) : (
                      <Building className="h-7 w-7 text-[#667eea]" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent">
                      {internshipRole}
                    </h1>
                    <div className="flex items-center">
                      <p className="text-lg font-medium text-gray-700">{companyName}</p>
                      <span className="ml-2 px-2 py-0.5 bg-gradient-to-r from-[#667eea]/20 to-[#764ba2]/20 text-[#667eea] text-xs font-medium rounded">
                        Internship
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center text-sm text-gray-600 mt-1 gap-4">
                      <span className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1 text-[#667eea]" />
                        {Array.isArray(jobDetail.location) 
                          ? jobDetail.location.join(', ') 
                          : jobDetail.location || 'Location not specified'}
                      </span>
                      <span className="flex items-center">
                        <Clock className="h-4 w-4 mr-1 text-[#667eea]" />
                        {workMode}
                      </span>
                      {jobDetail.startDate && (
                        <span className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1 text-[#667eea]" />
                          Start: {formatDate(jobDetail.startDate)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2 mt-4">
                  {!saved && !isApplied && (
                    <button
                      onClick={handleSave}
                      className={`inline-flex items-center justify-center px-4 py-2 border ${saved 
                        ? 'bg-gradient-to-r from-[#667eea]/10 to-[#764ba2]/10 border-[#667eea]/20 text-[#667eea]' 
                        : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'} text-sm font-medium rounded-lg transition-all duration-200`}
                    >
                      {saved ? (
                        <>
                          <Heart className="h-5 w-5 mr-1 text-red-500" fill="currentColor" />
                          Saved
                        </>
                      ) : (
                        <>
                          <Bookmark className="h-5 w-5 mr-1 text-gray-400" />
                          Save
                        </>
                      )}
                    </button>
                  )}
                  <button
                    onClick={handleShare}
                    className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-50 transition-all duration-200"
                  >
                    <Share2 className="h-5 w-5 mr-1 text-gray-400" />
                    Share
                  </button>
                  {jobDetail.companyPosted?.companyDetails?.website && (
                    <a
                      href={jobDetail.companyPosted.companyDetails.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-50 transition-all duration-200"
                    >
                      <ExternalLink className="h-5 w-5 mr-1 text-gray-400" />
                      Website
                    </a>
                  )}
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

              {/* Tab Content */}
              <div className="bg-white/90 backdrop-blur-sm border border-gray-100 rounded-xl shadow-lg overflow-hidden">
                
                {/* Overview Tab */}
                {activeTab === 'overview' && (
                  <div className="px-6 py-6">
                    {/* About Company */}
                    <div className="mb-8">
                      <h2 className="text-xl font-bold bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent mb-4">
                        About {companyName}
                      </h2>
                      <p className="text-gray-700 mb-6 leading-relaxed">
                        {jobDetail.companyPosted?.companyDetails?.description || 
                         `${companyName} is a dynamic organization offering valuable internship opportunities for students and recent graduates to gain practical experience and develop professional skills.`}
                      </p>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-gradient-to-br from-[#667eea]/5 to-[#764ba2]/5 p-4 rounded-lg">
                          <div className="text-xl font-bold text-gray-900">
                            {jobDetail.companyPosted?.companyDetails?.numberOfEmployees || 'N/A'}
                          </div>
                          <div className="text-sm text-gray-600 flex items-center mt-1">
                            <Users2 className="h-4 w-4 mr-1" />
                            Employees
                          </div>
                        </div>
                        <div className="bg-gradient-to-br from-[#667eea]/5 to-[#764ba2]/5 p-4 rounded-lg">
                          <div className="text-xl font-bold text-gray-900">
                            {jobDetail.companyPosted?.companyDetails?.industryType || 'N/A'}
                          </div>
                          <div className="text-sm text-gray-600 flex items-center mt-1">
                            <BriefcaseBusiness className="h-4 w-4 mr-1" />
                            Industry
                          </div>
                        </div>
                        <div className="bg-gradient-to-br from-[#667eea]/5 to-[#764ba2]/5 p-4 rounded-lg">
                          <div className="text-xl font-bold text-gray-900">
                            {jobDetail.companyPosted?.companyDetails?.country || 'N/A'}
                          </div>
                          <div className="text-sm text-gray-600 flex items-center mt-1">
                            <Globe className="h-4 w-4 mr-1" />
                            Country
                          </div>
                        </div>
                        <div className="bg-gradient-to-br from-[#667eea]/5 to-[#764ba2]/5 p-4 rounded-lg">
                          <div className="text-xl font-bold text-gray-900">
                            {jobDetail.companyPosted?.companyDetails?.foundedYear || 'N/A'}
                          </div>
                          <div className="text-sm text-gray-600 flex items-center mt-1">
                            <Calendar className="h-4 w-4 mr-1" />
                            Founded
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Internship Details */}
                    <div className="mb-8">
                      <h2 className="text-xl font-bold bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent mb-4">
                        Internship Details
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
                        <div>
                          <div className="text-sm font-medium text-[#667eea] flex items-center mb-1">
                            <Briefcase className="h-4 w-4 mr-2" />
                            Internship Role
                          </div>
                          {renderTags(jobDetail.jobRoles)}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-[#667eea] flex items-center mb-1">
                            <Map className="h-4 w-4 mr-2" />
                            Work Location
                          </div>
                          {renderTags(jobDetail.location)}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-[#667eea] flex items-center mb-1">
                            <Clock className="h-4 w-4 mr-2" />
                            Work Mode
                          </div>
                          {renderTags(jobDetail.workMode)}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-[#667eea] flex items-center mb-1">
                            <Calendar className="h-4 w-4 mr-2" />
                            Duration
                          </div>
                          <div className="text-lg font-medium text-gray-900">
                            {duration}
                          </div>
                        </div>
                        {jobDetail.startDate && (
                          <div>
                            <div className="text-sm font-medium text-[#667eea] flex items-center mb-1">
                              <Calendar className="h-4 w-4 mr-2" />
                              Start Date
                            </div>
                            <div className="text-lg font-medium text-gray-900">
                              {formatDate(jobDetail.startDate)}
                            </div>
                          </div>
                        )}
                        <div>
                          <div className="text-sm font-medium text-[#667eea] flex items-center mb-1">
                            <GraduationCap className="h-4 w-4 mr-2" />
                            Type
                          </div>
                          <div className="text-lg font-medium text-gray-900">
                            {Array.isArray(jobDetail.employmentType) 
                              ? jobDetail.employmentType.join(', ') 
                              : jobDetail.employmentType || 'Internship'}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* About the Internship */}
                    {jobDetail.description && (
                      <div className="mb-8">
                        <h2 className="text-xl font-bold bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent mb-4">
                          About the Internship
                        </h2>
                        <div className="text-gray-700 leading-relaxed">
                          {jobDetail.description.split('\n').map((paragraph, idx) => (
                            <p key={idx} className="mb-3">{paragraph}</p>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Learning Outcomes */}
                    {jobDetail.learningOutcomes && (
                      <div className="mb-8">
                        <h2 className="text-xl font-bold bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent mb-4">
                          Learning Outcomes
                        </h2>
                        <div className="bg-gradient-to-br from-[#667eea]/5 to-[#764ba2]/5 rounded-lg p-5">
                          <ul className="space-y-3">
                            {splitIntoBullets(jobDetail.learningOutcomes).map((point, idx) => (
                              <li key={idx} className="flex items-start">
                                <Zap className="h-5 w-5 text-[#667eea] mr-2 mt-0.5 flex-shrink-0" />
                                <span className="text-gray-700">{point}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Requirements Tab */}
                {activeTab === 'requirements' && (
                  <div className="px-6 py-6">
                    <h2 className="text-xl font-bold bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent mb-6">
                      Internship Requirements
                    </h2>

                    <div className="space-y-8">
                      {/* Academic Requirements */}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                          <GraduationCap className="h-5 w-5 text-[#667eea] mr-2" />
                          Academic Requirements
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="bg-gradient-to-br from-[#667eea]/5 to-[#764ba2]/5 p-4 rounded-lg">
                            <div className="text-sm font-medium text-[#667eea] mb-2">Required Degrees</div>
                            {renderTags(jobDetail.degree)}
                          </div>
                          <div className="bg-gradient-to-br from-[#667eea]/5 to-[#764ba2]/5 p-4 rounded-lg">
                            <div className="text-sm font-medium text-[#667eea] mb-2">Eligible Streams</div>
                            {renderTags(jobDetail.studentStreams)}
                          </div>
                          <div className="bg-gradient-to-br from-[#667eea]/5 to-[#764ba2]/5 p-4 rounded-lg">
                            <div className="text-sm font-medium text-[#667eea] mb-2">Year of Study</div>
                            <div className="text-gray-800">
                              {jobDetail.yearOfStudy || 'All years'}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Skills Required */}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                          <Target className="h-5 w-5 text-[#667eea] mr-2" />
                          Skills Required
                        </h3>
                        <div className="bg-gradient-to-br from-[#667eea]/5 to-[#764ba2]/5 p-5 rounded-lg">
                          <div className="flex flex-wrap gap-3">
                            {jobDetail.skills?.map((skill, index) => (
                              <span
                                key={index}
                                className="px-4 py-2 bg-gradient-to-r from-white to-gray-50 text-gray-800 border border-gray-200 rounded-full text-sm font-medium shadow-sm"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Additional Requirements */}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                          <Shield className="h-5 w-5 text-[#667eea] mr-2" />
                          Additional Requirements
                        </h3>
                        <div className="bg-gradient-to-br from-[#667eea]/5 to-[#764ba2]/5 p-5 rounded-lg">
                          <div className="space-y-4">
                            {jobDetail.eligibilityCriteria && (
                              <div>
                                <div className="font-medium text-[#667eea] mb-2">Eligibility Criteria</div>
                                <ul className="list-disc pl-5 space-y-2 text-gray-700">
                                  {splitIntoBullets(jobDetail.eligibilityCriteria).map((point, idx) => (
                                    <li key={idx}>{point}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            {jobDetail.prerequisites && (
                              <div>
                                <div className="font-medium text-[#667eea] mb-2">Prerequisites</div>
                                <p className="text-gray-700">{jobDetail.prerequisites}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Benefits Tab */}
                {activeTab === 'benefits' && (
                  <div className="px-6 py-6">
                    <h2 className="text-xl font-bold bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent mb-6">
                      Compensation & Benefits
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                      {/* Stipend Card */}
                      <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 border border-emerald-200 rounded-xl p-5">
                        <div className="flex items-center mb-3">
                          <div className="p-2 bg-emerald-100 rounded-lg mr-3">
                            <DollarSign className="h-6 w-6 text-emerald-600" />
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
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Internship Benefits</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[
                          { icon: <Rocket className="h-5 w-5" />, text: 'Hands-on Experience' },
                          { icon: <TrendingUp className="h-5 w-5" />, text: 'Skill Development' },
                          { icon: <Users className="h-5 w-5" />, text: 'Mentorship' },
                          { icon: <Briefcase className="h-5 w-5" />, text: 'Potential Job Offer' },
                          { icon: <Network className="h-5 w-5" />, text: 'Networking Opportunities' },
                          { icon: <BookOpen className="h-5 w-5" />, text: 'Learning Resources' },
                        ].map((benefit, index) => (
                          <div key={index} className="flex items-center p-4 bg-gradient-to-br from-gray-50 to-white border border-gray-100 rounded-lg">
                            <div className="p-2 bg-gradient-to-br from-[#667eea]/10 to-[#764ba2]/10 rounded-lg mr-3">
                              {benefit.icon}
                            </div>
                            <span className="text-gray-800">{benefit.text}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Process Tab */}
                {activeTab === 'process' && (
                  <div className="px-6 py-6">
                    <h2 className="text-xl font-bold bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent mb-6">
                      Application Process
                    </h2>

                    {/* Timeline */}
                    <div className="relative mb-10">
                      <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#667eea] to-[#764ba2]"></div>
                      
                      {[
                        { step: 1, title: 'Application Submission', desc: 'Submit your application through our portal' },
                        { step: 2, title: 'Resume Screening', desc: 'Profile and qualification evaluation' },
                        { step: 3, title: 'Assessment', desc: 'Online test or assignment' },
                        { step: 4, title: 'Interview', desc: 'Technical or HR interview' },
                        { step: 5, title: 'Selection', desc: 'Final selection decision' },
                        { step: 6, title: 'Onboarding', desc: 'Start of internship' },
                      ].map((item, index) => (
                        <div key={index} className="relative mb-8 ml-12">
                          <div className="absolute -left-9 top-0 w-8 h-8 rounded-full bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white flex items-center justify-center font-bold text-sm">
                            {item.step}
                          </div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">{item.title}</h3>
                          <p className="text-gray-600">{item.desc}</p>
                        </div>
                      ))}
                    </div>

                    {/* Selection Process Details */}
                    <div className="mb-8">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Selection Process Details</h3>
                      <div className="bg-gradient-to-br from-[#667eea]/5 to-[#764ba2]/5 rounded-lg p-5">
                        {jobDetail.selectionProcess ? (
                          <ul className="space-y-3">
                            {splitIntoBullets(jobDetail.selectionProcess).map((process, idx) => (
                              <li key={idx} className="flex items-start">
                                <div className="p-1 bg-white rounded-full mr-3 mt-0.5">
                                  <div className="w-2 h-2 bg-[#667eea] rounded-full"></div>
                                </div>
                                <span className="text-gray-700">{process}</span>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-gray-600">Selection process details will be shared with shortlisted candidates.</p>
                        )}
                      </div>
                    </div>

                    {/* Important Dates */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Important Dates</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="border border-gray-300 rounded-lg p-4 text-center bg-gradient-to-br from-[#667eea]/5 to-[#764ba2]/5">
                          <div className="text-sm font-medium text-[#667eea]">Application Deadline</div>
                          <div className="mt-1 text-lg font-medium text-gray-900">
                            {formatDate(jobDetail.endDate)}
                          </div>
                        </div>
                        {jobDetail.startDate && (
                          <div className="border border-gray-300 rounded-lg p-4 text-center bg-gradient-to-br from-[#667eea]/5 to-[#764ba2]/5">
                            <div className="text-sm font-medium text-[#667eea]">Internship Start Date</div>
                            <div className="mt-1 text-lg font-medium text-gray-900">
                              {formatDate(jobDetail.startDate)}
                            </div>
                          </div>
                        )}
                        <div className="border border-gray-300 rounded-lg p-4 text-center bg-gradient-to-br from-[#667eea]/5 to-[#764ba2]/5">
                          <div className="text-sm font-medium text-[#667eea]">Interview Dates</div>
                          <div className="mt-1 text-lg font-medium text-gray-900">To be announced</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Apply Now Button at Bottom */}
                {!isApplied && jobStatus.status !== 'Completed' && (
                  <div className="px-6 py-6 bg-gradient-to-r from-[#667eea]/5 to-[#764ba2]/5">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">Ready to Apply?</h3>
                        <p className="text-gray-600">Submit your internship application before the deadline</p>
                      </div>
                      <button 
                        className="inline-flex items-center justify-center px-8 py-3.5 bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white text-lg font-medium rounded-xl hover:shadow-lg hover:shadow-[#667eea]/30 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={handleApply}
                        disabled={isSubmitting}
                      >
                        <CheckCircle className="h-5 w-5 mr-2" />
                        {isSubmitting ? 'Applying...' : 'Apply for Internship'}
                      </button>
                    </div>
                  </div>
                )}

                {/* Already Applied Message */}
                {isApplied && (
                  <div className="px-6 py-6 bg-gradient-to-r from-green-50 to-emerald-50 border-t border-emerald-100">
                    <div className="flex items-center justify-center">
                      <CheckCircle className="h-6 w-6 text-emerald-600 mr-2" />
                      <span className="text-emerald-800 font-medium">You have already applied for this internship</span>
                    </div>
                  </div>
                )}

                {/* Closed Job Message */}
                {jobStatus.status === 'Completed' && !isApplied && (
                  <div className="px-6 py-6 bg-gradient-to-r from-gray-50 to-gray-100 border-t border-gray-200">
                    <div className="flex items-center justify-center">
                      <Calendar className="h-6 w-6 text-gray-500 mr-2" />
                      <span className="text-gray-700 font-medium">This internship is no longer accepting applications</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default InternshipDetailModal;