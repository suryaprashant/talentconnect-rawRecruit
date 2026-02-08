import { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams, Navigate } from 'react-router-dom';
import { ApplyForInternship, getInternshipById, SaveOppurtunity, viewed } from '@/lib/User_AxiosInstance';
import { ArrowLeft, MapPin, Building2, Users, Briefcase, DollarSign, GraduationCap, FileText, Globe, Clock, CheckCircle, Share2, IndianRupee, Info } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from "@/context/AuthContext";

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

// Company Details Modal Component
const CompanyDetailsModal = ({ company, isOpen, onClose }) => {
  if (!isOpen || !company) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div 
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" 
          onClick={onClose}
        ></div>

        {/* Modal panel */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#667eea]/5 to-[#764ba2]/5 px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#667eea] to-[#764ba2] flex items-center justify-center text-white font-bold text-lg shadow-sm">
                  {company.companyName?.charAt(0) || 'C'}
                </div>
                <h3 className="text-xl font-bold text-gray-900">
                  {company.companyName || 'Company Details'}
                </h3>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500 focus:outline-none"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="px-6 py-4">
            <div className="space-y-6">
              {/* About Section */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">About</h4>
                <p className="text-gray-700 text-sm leading-relaxed">
                  {company.description || 'No description provided.'}
                </p>
              </div>

              {/* Company Details Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-[#667eea]/5 to-[#764ba2]/5 p-3 rounded-lg">
                  <div className="text-sm font-medium text-gray-600">Employees</div>
                  <div className="text-lg font-semibold text-gray-900 mt-1">
                    {company.numberOfEmployees || 'N/A'}
                  </div>
                </div>
                <div className="bg-gradient-to-br from-[#667eea]/5 to-[#764ba2]/5 p-3 rounded-lg">
                  <div className="text-sm font-medium text-gray-600">Industry</div>
                  <div className="text-lg font-semibold text-gray-900 mt-1">
                    {company.industryType || 'N/A'}
                  </div>
                </div>
                <div className="bg-gradient-to-br from-[#667eea]/5 to-[#764ba2]/5 p-3 rounded-lg">
                  <div className="text-sm font-medium text-gray-600">Country</div>
                  <div className="text-lg font-semibold text-gray-900 mt-1">
                    {company.country || 'N/A'}
                  </div>
                </div>
                <div className="bg-gradient-to-br from-[#667eea]/5 to-[#764ba2]/5 p-3 rounded-lg">
                  <div className="text-sm font-medium text-gray-600">Type</div>
                  <div className="text-lg font-semibold text-gray-900 mt-1">
                    {company.companyType || 'N/A'}
                  </div>
                </div>
              </div>

              {/* Additional Info */}
              {/* <div className="pt-4 border-t border-gray-200">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Contact Information</h4>
                <div className="space-y-2">
                  {company.email && (
                    <div className="flex items-center">
                      <svg className="h-5 w-5 text-[#667eea] mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <span className="text-gray-700 text-sm">{company.email}</span>
                    </div>
                  )}
                  {company.website && (
                    <div className="flex items-center">
                      <svg className="h-5 w-5 text-[#667eea] mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                      </svg>
                      <span className="text-gray-700 text-sm">{company.website}</span>
                    </div>
                  )}
                </div>
              </div> */}
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
            <div className="flex justify-end">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#667eea]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const InternJobDetails = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { isAuthenticated, loading } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false); // New state
  
  const [jobDetails, setJobDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSaved, setIsSaved] = useState((searchParams.get('isSaved') || '').toLowerCase() === 'true');
  const [isApplied, setIsApplied] = useState((searchParams.get('isApplied') || '').toLowerCase() === 'true');
  const [isApplying, setIsApplying] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [showCompanyModal, setShowCompanyModal] = useState(false);
  
  const handleShare = async () => {
    const shareData = {
      title: jobDetails?.jobTitle || 'Internship Opportunity',
      text: `Check out this internship opportunity at ${jobDetails?.companyPosted?.companyDetails?.companyName || 'this company'}!`,
      url: window.location.href,
    };
  
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast.success('Link copied to clipboard!');
      }
    } catch (err) {
      console.error('Error sharing:', err);
    }
  };

  useEffect(() => {
    const loadJobDetails = async () => {
      try {
        setIsLoading(true);
        const response = await getInternshipById(jobId);
        setJobDetails(response.data);
        await viewed(response.data._id);
        console.log("Internship Details:", response.data);
        setError(null);
      } catch (err) {
        setError('Failed to load internship details. Please try again later.');
        console.error('Error fetching internship details:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (jobId) {
      loadJobDetails();
    }
  }, [jobId]);

  // Helper function to get initials for logo fallback
  const getInitials = (name = '') => {
    if (!name) return '?';
    const words = name.trim().split(' ');
    if (words.length === 1) return words[0][0].toUpperCase();
    return (words[0][0] + words[words.length - 1][0]).toUpperCase();
  };

  // Get company logo using comprehensive logic like Header
  const getCompanyLogo = () => {
    if (!jobDetails) return null;
    
    // Comprehensive logo fetching logic - check multiple possible fields
    const logo = 
      jobDetails.companyPosted?.profileImageUrl ||
      jobDetails.companyPosted?.profileImage ||
      jobDetails.companyPosted?.companyDetails?.profileImageUrl ||
      jobDetails.companyPosted?.companyDetails?.companyLogo ||
      jobDetails.collegePosted?.profileImage ||
      jobDetails.collegePosted?.profileImageUrl ||
      null;
    
    return logo;
  };

  // Prepare company data for modal
  const getCompanyData = () => {
    if (!jobDetails) return {};
    
    return {
      companyName: jobDetails?.companyPosted?.companyDetails?.companyName,
      description: jobDetails?.companyPosted?.companyDetails?.description,
      numberOfEmployees: jobDetails?.companyPosted?.companyDetails?.numberOfEmployees,
      industryType: jobDetails?.companyPosted?.companyDetails?.industryType,
      country: jobDetails?.companyPosted?.companyDetails?.country,
      companyType: jobDetails?.companyPosted?.companyDetails?.companyType,
      email: jobDetails?.companyPosted?.companyDetails?.email,
      website: jobDetails?.companyPosted?.companyDetails?.website
    };
  };

  const handleApply = async () => {
    if (loading) return;

    // 🔐 Not logged in
  
    // 🔐 Check if logged in
    if (!isAuthenticated) {
      setShowLoginModal(true); // Open Modal instead of just a Toast
      return;
    }
    
    
    try {
      setIsApplying(true);
      const response = await ApplyForInternship(jobId);
      console.log("Apply response:", response);
      
      if (response?.data?.success === true) {
        toast.success('Application submitted!');
        setIsApplied(true);
      } else {
        const errorMsg = response?.response?.data?.msg || 
                        response?.data?.msg || 
                        'Failed to apply. Please try again.';
        toast.error(errorMsg);
      }
    } catch (err) {
      console.error('Error applying for internship:', err);
      const errorMsg = err?.response?.data?.msg || 
                      err?.message || 
                      'Something went wrong!';
      toast.error(errorMsg);
    } finally {
      setIsApplying(false);
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const response = await SaveOppurtunity(jobId, jobDetails?.jobType || 'internship');
      console.log("Save response:", response);
      
      if (response?.data?.success === true) {
        toast.success('Internship saved!');
        setIsSaved(true);
      } else {
        const errorMsg = response?.response?.data?.msg || 
                        response?.data?.msg || 
                        'Failed to save internship. Please try again.';
        toast.error(errorMsg);
      }
    } catch (err) {
      console.error('Error saving internship:', err);
      const errorMsg = err?.response?.data?.msg || 
                      err?.message || 
                      'Something went wrong!';
      toast.error(errorMsg);
    } finally {
      setIsSaving(false);
    }
  };

  const handleBackToList = () => {
    window.history.back();
  };

  // Helper function to render array data as tags
  const renderTags = (data) => {
    if (Array.isArray(data) && data.length > 0) {
      return (
        <div className="flex flex-wrap gap-2 mt-1">
          {data.map((item, index) => (
            <span key={index} className="bg-gradient-to-br from-[#667eea]/10 to-[#764ba2]/10 text-gray-800 text-xs font-medium px-2.5 py-1 rounded-full capitalize border border-gray-200">
              {item}
            </span>
          ))}
        </div>
      );
    }
    return <span className="text-gray-700">N/A</span>;
  };

  // Format stipend with rupee sign - USING SAME LOGIC AS InternshipDetailModal
  const formatStipend = () => {
    if (!jobDetails) return 'Not specified';
    
    // Check multiple possible fields for stipend - SAME LOGIC AS IN MODAL
    const stipendAmount = jobDetails.stipendAmount || 
                         jobDetails.stipend?.amount || 
                         jobDetails.salary ||
                         jobDetails.minPackage?.amount;
    
    const stipendCurrency = jobDetails.stipend?.currency || '₹';
    const stipendFrequency = jobDetails.stipend?.frequency || '/month';
    
    if (stipendAmount) {
      // Format number with commas
      const formattedAmount = stipendAmount.toLocaleString('en-IN');
      return `${stipendCurrency} ${formattedAmount}${stipendFrequency}`;
    }
    
    // Check for package details as fallback
    if (jobDetails.packageDetails?.totalCTC) {
      const formattedAmount = jobDetails.packageDetails.totalCTC.toLocaleString('en-IN');
      return `${formattedAmount}`;
    }
    
    return 'Not specified';
  };

  // Calculate application deadline (30 days after posting)
  const getApplicationDeadline = () => {
    if (!jobDetails?.createdAt) return null;
    
    const postingDate = new Date(jobDetails.createdAt);
    const deadline = new Date(postingDate);
    deadline.setDate(deadline.getDate() + 30);
    
    return deadline;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-[#667eea]/5 via-[#f093fb]/5 to-[#764ba2]/5">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#667eea]"></div>
      </div>
    );
  }

  if (error || !jobDetails) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-[#667eea]/5 via-[#f093fb]/5 to-[#764ba2]/5">
        <div className="text-center p-4">
          <p className="text-xl font-semibold text-red-500">{error || "Internship not found"}</p>
          <button
            className="mt-4 bg-gradient-to-r from-[#667eea] to-[#764ba2] hover:shadow-lg hover:shadow-[#667eea]/30 text-white px-4 py-2 rounded-lg transition-all duration-200"
            onClick={() => navigate('/student-dashboard/Internship')}
          >
            Back to Internships
          </button>
        </div>
      </div>
    );
  }

  const applicationDeadline = getApplicationDeadline();
  const companyName = jobDetails?.companyPosted?.companyDetails?.companyName || 'N/A';
  const companyLogo = getCompanyLogo();
  const companyData = getCompanyData();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#667eea]/5 via-[#f093fb]/5 to-[#764ba2]/5">
      <div className="max-w-4xl mx-auto bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-gray-100 p-6 my-8">
        {/* Top Back Button */}
        <button 
          onClick={handleBackToList} 
          className="inline-flex items-center text-[#667eea] hover:text-[#764ba2] mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-1" />
          Back
        </button>

        {/* Header - Modified to make company name clickable */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-16 h-16 bg-white rounded-full shadow flex items-center justify-center overflow-hidden border shrink-0">
              {companyLogo && !imageError ? (
                <button 
                  onClick={() => setShowCompanyModal(true)}
                  className="w-full h-full group"
                >
                  <img
                    src={companyLogo}
                    alt={companyName}
                    className="w-14 h-14 object-cover group-hover:opacity-90 transition-opacity"
                    onError={() => setImageError(true)}
                  />
                </button>
              ) : (
                <button 
                  onClick={() => setShowCompanyModal(true)}
                  className="w-full h-full flex items-center justify-center group"
                >
                  <div className="w-14 h-14 bg-gradient-to-br from-[#667eea]/10 to-[#764ba2]/10 rounded-full flex items-center justify-center group-hover:opacity-90 transition-opacity">
                    <span className="text-lg font-bold text-[#667eea]">
                      {getInitials(companyName)}
                    </span>
                  </div>
                </button>
              )}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-1">
                {jobDetails.jobTitle}
              </h1>
              {/* LARGER AND BOLDER COMPANY NAME - NOW CLICKABLE */}
              <button 
                onClick={() => setShowCompanyModal(true)}
                className="text-left group"
              >
                <p className="text-xl font-bold bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent mr-2 group-hover:text-[#667eea] transition-colors">
                  {companyName}
                </p>
                {/* <div className="flex items-center text-xs text-gray-500 mt-1">
                  <Info className="w-3 h-3 mr-1" />
                  Click to view company details
                </div> */}
              </button>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <button 
              onClick={handleShare}
              className="inline-flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-gray-700 font-bold py-2 px-4 rounded-lg transition-all duration-300 border border-gray-200 text-sm shadow-sm"
              title="Share Internship"
            >
              <Share2 className="w-4 h-4 text-[#667eea]" />
              <span className="hidden sm:inline">Share</span>
            </button>
            {!isApplied && (
              <>
                {/* Save Button */}
                {!isSaved ? (
                  <button 
                    onClick={handleSave} 
                    disabled={isSaving}
                    className={`bg-gradient-to-br from-[#667eea]/10 to-[#764ba2]/10 hover:from-[#667eea]/20 hover:to-[#764ba2]/20 text-[#667eea] font-bold py-2 px-4 rounded-lg transition-all duration-300 border border-gray-200 text-sm ${
                      isSaving ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    {isSaving ? 'Saving...' : 'Save'}
                  </button>
                ) : (
                  <button 
                    className="bg-gradient-to-br from-green-500/10 to-green-600/10 text-green-600 font-bold py-2 px-4 rounded-lg border border-green-200 cursor-default text-sm"
                    disabled
                  >
                    ✓ Saved
                  </button>
                )}
                
                {/* Apply Button */}
                <button 
                  onClick={handleApply}
                  disabled={isApplying}
                  className={`px-4 py-2 bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white rounded-lg hover:shadow-lg hover:shadow-[#667eea]/30 transition-all duration-200 text-sm ${
                    isApplying ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {isApplying ? 'Applying...' : 'Apply'}
                </button>
              </>
            )}
            {isApplied && (
              <button 
                className="bg-gradient-to-r from-green-500 to-green-600 text-white font-bold py-2 px-4 rounded-lg cursor-default text-sm"
                disabled
              >
                ✓ Applied
              </button>
            )}
          </div>
        </div>

        {/* Quick Info Bar */}
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex items-center text-gray-600">
            <MapPin className="w-4 h-4 mr-1" />
            <span className="text-sm">{Array.isArray(jobDetails.location) ? jobDetails.location.join(', ') : jobDetails.location}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <Clock className="w-4 h-4 mr-1" />
            <span className="text-sm">{jobDetails.internshipDuration}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <IndianRupee className="w-4 h-4 mr-1" />
            <span className="text-sm">
              {formatStipend()}
            </span>
          </div>
        </div>

        {/* About Company */}
        <section className="mb-8">
          <h3 className="text-lg font-semibold mb-3 bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent">
            About {companyName}
          </h3>
          <p className="text-gray-700 mb-4">{jobDetails.companyPosted?.companyDetails?.description || 'No company description available.'}</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-[#667eea]/5 to-[#764ba2]/5 border border-gray-200 p-4 rounded-lg">
              <div className="font-bold text-lg">{jobDetails.companyPosted?.companyDetails?.numberOfEmployees || "N/A"}</div>
              <div className="text-sm text-gray-600">Employees</div>
            </div>
            <div className="bg-gradient-to-br from-[#667eea]/5 to-[#764ba2]/5 border border-gray-200 p-4 rounded-lg">
              <div className="font-bold text-lg capitalize">{jobDetails.companyPosted?.companyDetails?.industryType || "N/A"}</div>
              <div className="text-sm text-gray-600">Industry</div>
            </div>
            <div className="bg-gradient-to-br from-[#667eea]/5 to-[#764ba2]/5 border border-gray-200 p-4 rounded-lg">
              <div className="font-bold text-lg">{jobDetails.companyPosted?.companyDetails?.country || "N/A"}</div>
              <div className="text-sm text-gray-600">Country</div>
            </div>
          </div>
        </section>

        {/* Internship Details */}
        <section className="mb-8">
          <h3 className="text-lg font-semibold mb-3 bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent">
            Internship Details
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex items-start">
              <MapPin className="w-5 h-5 mt-1 mr-3 text-[#667eea] flex-shrink-0" />
              <div>
                <div className="font-medium text-[#667eea]">Location</div>
                {renderTags(jobDetails.location)}
              </div>
            </div>
            <div className="flex items-start">
              <Clock className="w-5 h-5 mt-1 mr-3 text-[#667eea] flex-shrink-0" />
              <div>
                <div className="font-medium text-[#667eea]">Duration</div>
                <div className="text-gray-700">{jobDetails.internshipDuration || 'N/A'}</div>
              </div>
            </div>
            <div className="flex items-start">
              <Briefcase className="w-5 h-5 mt-1 mr-3 text-[#667eea] flex-shrink-0" />
              <div>
                <div className="font-medium text-[#667eea]">Work Mode</div>
                <div className="text-gray-700 capitalize">{jobDetails.workMode || 'N/A'}</div>
              </div>
            </div>
            <div className="flex items-start">
              <Users className="w-5 h-5 mt-1 mr-3 text-[#667eea] flex-shrink-0" />
              <div>
                <div className="font-medium text-[#667eea]">Number of Openings</div>
                <div className="text-gray-700">{jobDetails.numberOfOpenings || 'N/A'}</div>
              </div>
            </div>
            <div className="flex items-start">
              <IndianRupee className="w-5 h-5 mt-1 mr-3 text-[#667eea] flex-shrink-0" />
              <div>
                <div className="font-medium text-[#667eea]">Stipend</div>
                <div className="text-gray-700">
                  {formatStipend()}
                </div>
              </div>
            </div>
            <div className="flex items-start">
              <Globe className="w-5 h-5 mt-1 mr-3 text-[#667eea] flex-shrink-0" />
              <div>
                <div className="font-medium text-[#667eea]">Work Authorization</div>
                <div className="text-gray-700 capitalize">{jobDetails.workAuthorization || 'N/A'}</div>
              </div>
            </div>
          </div>
        </section>

        {/* Internship Description */}
        <section className="mb-8">
          <h3 className="text-lg font-semibold mb-3 bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent">
            Internship Description
          </h3>
          <p className="text-gray-700 whitespace-pre-wrap">
            {jobDetails.description || 'No description available.'}
          </p>
        </section>

        {/* Eligibility Criteria */}
        <section className="mb-8">
          <h3 className="text-lg font-semibold mb-3 bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent">
            Eligibility Criteria
          </h3>
          <p className="text-gray-700 whitespace-pre-wrap">
            {jobDetails.eligibilityCriteria || 'No criteria specified.'}
          </p>
        </section>

        {/* Key Skills */}
        <section className="mb-8">
          <h3 className="text-lg font-semibold mb-3 bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent">
            Key Skills Required
          </h3>
          {renderTags(jobDetails.skills)}
        </section>

        {/* Benefits & Perks */}
        <section className="mb-8">
          <h3 className="text-lg font-semibold mb-3 bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent">
            Benefits & Perks
          </h3>
          {renderTags(jobDetails.benefits)}
        </section>

        {/* Education Requirements */}
        <section className="mb-8">
          <h3 className="text-lg font-semibold mb-3 bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent">
            Education Requirements
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex items-start">
              <GraduationCap className="w-5 h-5 mt-1 mr-3 text-[#667eea] flex-shrink-0" />
              <div>
                <div className="font-medium text-[#667eea]">Minimum Education</div>
                <div className="text-gray-700 capitalize">{jobDetails.minEducation || 'N/A'}</div>
              </div>
            </div>
            <div className="flex items-start">
              <FileText className="w-5 h-5 mt-1 mr-3 text-[#667eea] flex-shrink-0" />
              <div>
                <div className="font-medium text-[#667eea]">Preferred Streams</div>
                {renderTags(jobDetails.studentStreams)}
              </div>
            </div>
          </div>
        </section>

        {/* Certificate Requirements */}
        <section className="mb-8">
          <h3 className="text-lg font-semibold mb-3 bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent">
            Certificate Requirements
          </h3>
          <div className="flex items-center">
            <CheckCircle className="w-5 h-5 mr-3 text-[#667eea] flex-shrink-0" />
            <div className="text-gray-700">{jobDetails.certifications || "Not Required"}</div>
          </div>
        </section>

        {/* Important Dates - UPDATED with calculated deadline */}
        <section className="mb-8">
          <h3 className="text-lg font-semibold mb-3 bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent">
            Important Dates
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-[#667eea]/5 to-[#764ba2]/5 border border-gray-200 p-3 rounded-lg">
              <div className="text-sm text-[#667eea]">Application Deadline</div>
              <div className="font-medium text-red-600">
                {applicationDeadline 
                  ? applicationDeadline.toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    })
                  : 'N/A'}
              </div>
            </div>
            <div className="bg-gradient-to-br from-[#667eea]/5 to-[#764ba2]/5 border border-gray-200 p-3 rounded-lg">
              <div className="text-sm text-[#667eea]">Internship Start</div>
              <div className="font-medium text-gray-700">Flexible</div>
            </div>
            <div className="bg-gradient-to-br from-[#667eea]/5 to-[#764ba2]/5 border border-gray-200 p-3 rounded-lg">
              <div className="text-sm text-[#667eea]">Interview Dates</div>
              <div className="font-medium text-gray-700">To be scheduled</div>
            </div>
            <div className="bg-gradient-to-br from-[#667eea]/5 to-[#764ba2]/5 border border-gray-200 p-3 rounded-lg">
              <div className="text-sm text-[#667eea]">Results</div>
              <div className="font-medium text-gray-700">Rolling basis</div>
            </div>
          </div>
        </section>

        {/* Bottom Back Button */}
        <section className="mt-8 pt-6 border-t border-gray-200">
          <div className="flex justify-left">
            <button 
              onClick={() => handleBackToList()} 
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

      {/* Company Details Modal */}
      <CompanyDetailsModal
        company={companyData}
        isOpen={showCompanyModal}
        onClose={() => setShowCompanyModal(false)}
      />
      <LoginPromptModal 
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
       
      />
 
    </div>
  );
};

export default InternJobDetails;