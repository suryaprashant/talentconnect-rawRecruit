import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { getPoolCampusJobByIdForCompany } from '../../../lib/College_AxiosIntance';
import { format } from 'date-fns';
import { ApplyForOncampusOppurtunity, SaveOppurtunity, submitAlternateDates } from '@/lib/Company_AxiosInstance.js';
import toast from 'react-hot-toast';
import { viewed } from '@/lib/User_AxiosInstance';
import useConversation from '@/statemanage/useConversation';
import { conversationWithCollege } from '@/lib/College_AxiosIntance';
import { 
  Send, 
  Calendar, 
  X, 
  ArrowLeft, 
  Building2, 
  MapPin, 
  Globe, 
  Mail, 
  Phone, 
  Linkedin, 
  ExternalLink, 
  Users, 
  Briefcase,
  GraduationCap,
  Star,
  AlertCircle,
  ChevronLeft,
  Share2,
  Save,
  CheckCircle,
  Eye,
  Award,
  BookOpen,
  Clock,
  DollarSign,
  TrendingUp
} from 'lucide-react';

const formatDateSafe = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return 'N/A';
    }
    return format(date, 'MMM d, yyyy');
  } catch (err) {
    return 'N/A';
  }
};

const formatDateForInput = (dateString) => {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return '';
    }
    return format(date, 'yyyy-MM-dd');
  } catch (err) {
    return '';
  }
};

const CollegeDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isApplied = (searchParams.get('isApplied') || '').toLowerCase() === 'true';
  const isSaved = (searchParams.get('isSaved') || '').toLowerCase() === 'true';
  const [posting, setPosting] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [showAlternateDateModal, setShowAlternateDateModal] = useState(false);
  const [selectedStartDate, setSelectedStartDate] = useState('');
  const [selectedEndDate, setSelectedEndDate] = useState('');
  const [dateError, setDateError] = useState('');
  const [originalStartDate, setOriginalStartDate] = useState('');
  const [originalEndDate, setOriginalEndDate] = useState('');
  
  // College Details Modal State
  const [showCollegeModal, setShowCollegeModal] = useState(false);

  // Add zoom state
  const [zoomLevel, setZoomLevel] = useState(1);
  const containerRef = useRef(null);
  
  const { setSelectedConversation } = useConversation();  

  const fetchPostingDetails = async () => {
    if (!id) return;
    try {
      setLoading(true);
      setError(null);
      const response = await getPoolCampusJobByIdForCompany(id);
      if (response && response.data) {
        setPosting(response.data);
        await viewed(response.data._id);
      } else {
        throw new Error('Posting not found.');
      }
    } catch (err) {
      console.error("Failed to fetch posting details:", err);
      setError('Could not load the requested resource. It might have been removed.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPostingDetails();
  }, [id]);

  useEffect(() => {
    if (posting?.proposedSchedule) {
      const startDate = formatDateForInput(posting.proposedSchedule.startDate);
      const endDate = formatDateForInput(posting.proposedSchedule.endDate);
      
      setOriginalStartDate(startDate);
      setOriginalEndDate(endDate);
    }
  }, [posting]);

  // Add keyboard shortcuts for zoom
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ctrl + Plus for zoom in
      if ((e.ctrlKey || e.metaKey) && (e.key === '+' || e.key === '=')) {
        e.preventDefault();
        setZoomLevel(prev => Math.min(prev + 0.1, 1.5));
      }
      // Ctrl + Minus for zoom out
      if ((e.ctrlKey || e.metaKey) && e.key === '-') {
        e.preventDefault();
        setZoomLevel(prev => Math.max(prev - 0.1, 0.8));
      }
      // Ctrl + 0 for reset zoom
      if ((e.ctrlKey || e.metaKey) && e.key === '0') {
        e.preventDefault();
        setZoomLevel(1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleBack = () => {
    navigate('/company-dashboard/On-campus');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${posting?.jobTitle || 'Job'} at ${posting?.companyPosted?.companyDetails?.companyName}`,
        text: `Check out this opportunity for a ${posting?.jobTitle || 'job'} at ${posting?.companyPosted?.companyDetails?.companyName}!`,
        url: window.location.href,
      })
        .catch((error) => console.log('Error sharing', error));
    } else {
      navigator.clipboard.writeText(window.location.href)
        .then(() => toast.success('Link copied to clipboard!'))
        .catch(() => toast.error('Failed to copy link'));
    }
  };

  const handleSave = async (jobId) => {
    try {
      const response = await SaveOppurtunity(jobId, posting?.jobType);
      if (response.data?.success === true) toast.success("Saved");
      else toast.error(response?.response.data.msg);
    } catch (error) {
      console.log("Error: ", error);
      toast.error("Something went wrong!");
    }
  };

  const handleApply = async (jobId) => {
    try {
      const response = await ApplyForOncampusOppurtunity(jobId); 
      if (response.data?.success === true) toast.success("Applied");
      else toast.error(response?.response.data.msg);
    } catch (error) {
      console.log("Error: ", error);
      toast.error(`Something went wrong`);
    }
  };

  const handleMessageClick = async () => {
    if (!posting?.collegePosted?.userId) {
      toast.error("Coordinator ID is missing. Cannot start chat.");
      return;
    }

    const collegeUserId = posting.collegePosted.userId;
    const collegeDetails = posting.collegePosted;
    const collegeName = collegeDetails?.collegeUniversityDetails?.collegeName || 'College';

    setIsSubmitting(true);
    try {
      const response = await conversationWithCollege(collegeUserId);
      
      if (response.data) {
        const conversationUser = {
          _id: collegeUserId,
          name: collegeName,
          email: collegeDetails?.placementCoordinatorDetails?.officialEmail || '',
          profileImage: collegeDetails?.profileImage || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png',
          userType: 'college',
          fullname: collegeName
        };

        setSelectedConversation(conversationUser);

        setTimeout(() => {
          navigate('/chat-application');
        }, 100);

      } else {
        toast.error('Failed to create conversation');
      }
    } catch (error) {
      console.error('Error starting chat:', error);
      toast.error('Error starting conversation');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAlternateDateClick = () => {
    setSelectedStartDate('');
    setSelectedEndDate('');
    setDateError('');
    setShowAlternateDateModal(true);
  };

  const handleCloseModal = () => {
    setShowAlternateDateModal(false);
    setDateError('');
  };

  const validateDates = () => {
    if (!selectedStartDate || !selectedEndDate) {
      setDateError('Both start and end dates are required');
      return false;
    }

    const start = new Date(selectedStartDate);
    const end = new Date(selectedEndDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (start < today) {
      setDateError('Start date cannot be in the past');
      return false;
    }

    if (end <= start) {
      setDateError('End date must be after start date');
      return false;
    }

    setDateError('');
    return true;
  };

  const handleDateSubmit = async () => {
    if (!validateDates()) return;

    setIsSubmitting(true);
    try {
      const response = await submitAlternateDates(id, {
        startDate: selectedStartDate,
        endDate: selectedEndDate
      });

      if (response.data?.success === true) {
        toast.success('Alternate dates submitted successfully! Email sent to college.');
        setShowAlternateDateModal(false);
        setSelectedStartDate('');
        setSelectedEndDate('');
      } else {
        toast.error(response.data?.msg || 'Failed to submit alternate dates');
      }
    } catch (error) {
      console.error('Error submitting alternate dates:', error);
      toast.error('Failed to submit alternate dates');
    } finally {
      setIsSubmitting(false);
    }
  };

  const AlternateDateModal = () => {
    if (!showAlternateDateModal) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white/90 backdrop-blur-sm border border-gray-100 rounded-2xl shadow-lg p-6 max-w-md w-full">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Suggest Alternate Dates</h3>
            <button
              onClick={handleCloseModal}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
          
          <div className="mb-6">
            <p className="text-sm text-gray-600 mb-4">
              Please select your preferred start and end dates for the on-campus drive.
            </p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Proposed Start Date
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    type="date"
                    value={selectedStartDate}
                    onChange={(e) => setSelectedStartDate(e.target.value)}
                    className="w-full pl-10 pr-3 py-2.5 bg-gradient-to-r from-gray-50 to-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#667eea]/50 focus:border-transparent focus:outline-none transition-all duration-200"
                    min={formatDateForInput(new Date())}
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Proposed End Date
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    type="date"
                    value={selectedEndDate}
                    onChange={(e) => setSelectedEndDate(e.target.value)}
                    className="w-full pl-10 pr-3 py-2.5 bg-gradient-to-r from-gray-50 to-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#667eea]/50 focus:border-transparent focus:outline-none transition-all duration-200"
                    min={selectedStartDate || formatDateForInput(new Date())}
                  />
                </div>
              </div>
              
              {dateError && (
                <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">{dateError}</p>
              )}
            </div>
          </div>
          
          <div className="flex justify-end gap-3">
            <button
              onClick={handleCloseModal}
              className="px-4 py-2.5 text-sm font-medium text-gray-700 bg-gradient-to-r from-gray-100 to-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all duration-200"
            >
              Cancel
            </button>
            <button
              onClick={handleDateSubmit}
              disabled={isSubmitting}
              className="px-4 py-2.5 text-sm font-medium text-white bg-black rounded-xl hover:bg-gray-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Dates'}
            </button>
          </div>
        </div>
      </div>
    );
  };

  // --- COLLEGE DETAILS MODAL ---
  const CollegeDetailsModal = () => {
    if (!showCollegeModal || !posting?.collegePosted) return null;

    const collegeDetails = posting.collegePosted;
    const collegeUniDetails = collegeDetails.collegeUniversityDetails || {};
    const collegeName = collegeUniDetails.collegeName || 'College';
    const collegeType = collegeUniDetails.collegeType || 'Not Specified';
    const universityName = collegeUniDetails.universityName || 'Not Specified';
    const city = collegeUniDetails.city || 'Not Specified';
    const state = collegeUniDetails.state || 'Not Specified';
    const country = collegeUniDetails.country || 'Not Specified';
    const pincode = collegeUniDetails.pincode || 'Not Specified';
    const establishedYear = collegeUniDetails.establishedYear;
    const collegeWebsite = collegeDetails.profileAchievements?.collegeWebsite;

    return (
      <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            {/* Header */}
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{collegeName}</h2>
              </div>
              <button
                onClick={() => setShowCollegeModal(false)}
                className="text-gray-500 hover:text-gray-700 text-xl p-1"
              >
                ✕
              </button>
            </div>

            {/* College Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="space-y-3">
                <div className="flex items-center text-gray-700">
                  <Building2 className="w-4 h-4 mr-3 text-blue-500" />
                  <span className="font-medium">College Type:</span>
                  <span className="ml-2">{collegeType || 'N/A'}</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <Calendar className="w-4 h-4 mr-3 text-blue-500" />
                  <span className="font-medium">Established:</span>
                  <span className="ml-2">{establishedYear || 'N/A'}</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <Building2 className="w-4 h-4 mr-3 text-blue-500" />
                  <span className="font-medium">University:</span>
                  <span className="ml-2">{universityName || 'N/A'}</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <MapPin className="w-4 h-4 mr-3 text-blue-500" />
                  <span className="font-medium">City:</span>
                  <span className="ml-2">{city || 'N/A'}</span>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center text-gray-700">
                  <MapPin className="w-4 h-4 mr-3 text-blue-500" />
                  <span className="font-medium">State:</span>
                  <span className="ml-2">{state || 'N/A'}</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <MapPin className="w-4 h-4 mr-3 text-blue-500" />
                  <span className="font-medium">Country:</span>
                  <span className="ml-2">{country || 'N/A'}</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <MapPin className="w-4 h-4 mr-3 text-blue-500" />
                  <span className="font-medium">Pincode:</span>
                  <span className="ml-2">{pincode || 'N/A'}</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <Globe className="w-4 h-4 mr-3 text-blue-500" />
                  <span className="font-medium">Website:</span>
                  {collegeWebsite ? (
                    <a 
                      href={collegeWebsite.startsWith('http') ? collegeWebsite : `https://${collegeWebsite}`} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="ml-2 text-blue-600 hover:underline"
                    >
                      Visit Website
                    </a>
                  ) : (
                    <span className="ml-2">Not provided</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Update your main container with zoom controls and responsive classes
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-[#667eea]/10 via-[#f093fb]/5 to-[#764ba2]/10">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#667eea]"></div>
      </div>
    );
  }

  if (error || !posting) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#667eea]/10 via-[#f093fb]/5 to-[#764ba2]/10">
        <div className="container mx-auto px-4 py-8 pt-22">
          <button 
            onClick={handleBack}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 group"
          >
            <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            Back to Colleges
          </button>
          <div className="bg-white/90 backdrop-blur-sm border border-gray-100 rounded-2xl shadow-lg p-6">
            <div className="bg-gradient-to-r from-red-50 to-white border border-red-200 rounded-xl p-4">
              <div className="flex items-start">
                <AlertCircle className="h-5 w-5 text-red-600 mr-3 mt-0.5" />
                <div>
                  <h3 className="text-sm font-medium text-red-800">Error</h3>
                  <p className="text-sm text-red-700 mt-1">{error || 'Posting not found'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const collegeDetails = posting.collegePosted;
  const collegeName = collegeDetails?.collegeUniversityDetails?.collegeName || 'the College';
  const coordinator = collegeDetails?.placementCoordinatorDetails;

  const formattedStartDate = formatDateSafe(posting.startDate);
  const formattedEndDate = formatDateSafe(posting.endDate);

  return (
    <div 
      ref={containerRef}
      className="min-h-screen bg-gradient-to-br from-[#667eea]/10 via-[#f093fb]/5 to-[#764ba2]/10"
      style={{
        transform: `scale(${zoomLevel})`,
        transformOrigin: 'top left',
        width: zoomLevel !== 1 ? `${100/zoomLevel}%` : '100%',
        height: zoomLevel !== 1 ? `${100/zoomLevel}%` : '100%',
      }}
    >
      {/* Zoom Controls - Fixed at top right */}
      <div className="fixed top-4 right-4 z-50 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200 p-2 flex items-center gap-2">
        <button
          onClick={() => setZoomLevel(prev => Math.max(prev - 0.1, 0.8))}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          title="Zoom Out (Ctrl -)"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
          </svg>
        </button>
        <span className="text-sm font-medium px-2 min-w-[60px] text-center">
          {Math.round(zoomLevel * 100)}%
        </span>
        <button
          onClick={() => setZoomLevel(prev => Math.min(prev + 0.1, 1.5))}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          title="Zoom In (Ctrl +)"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
        <div className="h-6 w-px bg-gray-300"></div>
        <button
          onClick={() => setZoomLevel(1)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-sm"
          title="Reset Zoom (Ctrl 0)"
        >
          100%
        </button>
      </div>

      <div className="px-4 md:px-6 py-6 max-w-7xl mx-auto">
        {/* Main Container - Update padding and margins for better spacing */}
        <div className="bg-white/90 backdrop-blur-sm border border-gray-100 rounded-2xl shadow-lg p-4 md:p-6">
          {/* Back Button */}
          <div className="flex justify-between items-center mb-6">
            <button
              onClick={handleBack}
              className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 group"
            >
              <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
              Back to Colleges
            </button>
            
            {/* Responsive actions */}
            {/* <div className="flex items-center gap-2">
              <button
                onClick={handleShare}
                className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2.5 bg-gradient-to-r from-gray-100 to-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200 text-sm"
              >
                <Share2 size={14} className="md:size-4" />
                <span className="hidden md:inline">Share</span>
                <span className="md:hidden">Share</span>
              </button>
              {!isSaved && !isApplied && (
                <button
                  onClick={() => handleSave(id)}
                  className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2.5 bg-gradient-to-r from-blue-100 to-blue-50 border border-blue-200 text-blue-700 rounded-xl hover:bg-blue-50 transition-all duration-200 text-sm"
                >
                  <Save size={14} className="md:size-4" />
                  <span className="hidden md:inline">Save</span>
                  <span className="md:hidden">Save</span>
                </button>
              )}
            </div> */}
          </div>

          {/* College Header - Make it more compact on mobile */}
<div className="mb-6 md:mb-8">
  <div className="flex flex-col md:flex-row justify-between items-start gap-4 md:gap-6 mb-4 md:mb-6">
    <div className="flex items-start gap-3 md:gap-4 w-full">
      <div 
        className="p-2 md:p-3 bg-gradient-to-br from-[#667eea]/20 to-[#764ba2]/20 rounded-xl cursor-pointer hover:opacity-90 transition-opacity flex-shrink-0"
        onClick={() => setShowCollegeModal(true)}
      >
        <Building2 className="h-5 w-5 md:h-6 md:w-6 text-[#667eea]" />
      </div>
      <div className="min-w-0 flex-1">
        <h2 
          className="text-lg md:text-2xl font-bold bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent mb-2 hover:text-blue-600 cursor-pointer transition-colors truncate"
          onClick={() => setShowCollegeModal(true)}
        >
          {collegeName}
        </h2>
        <div 
          className="flex flex-wrap items-center gap-2 cursor-pointer hover:text-blue-600 transition-colors"
          onClick={() => setShowCollegeModal(true)}
        >
          <span className="inline-flex items-center text-xs md:text-sm text-gray-600 bg-gradient-to-r from-gray-50 to-white px-2 py-1 md:px-3 md:py-1.5 rounded-lg hover:from-blue-50 hover:to-blue-100">
            <Calendar className="h-3 w-3 mr-1" />
            {formattedStartDate} - {formattedEndDate}
          </span>
          <span className="inline-flex items-center text-xs md:text-sm text-gray-600 bg-gradient-to-r from-gray-50 to-white px-2 py-1 md:px-3 md:py-1.5 rounded-lg hover:from-blue-50 hover:to-blue-100">
            <MapPin className="h-3 w-3 mr-1" />
            {posting.location?.join(', ') || 'Location not specified'}
          </span>
        </div>
      </div>
    </div>

    {/* Logo/Image section - Updated with smaller size and moved share/save buttons here */}
    <div className="flex items-center justify-between w-full sm:w-auto sm:justify-end gap-3 md:gap-4">
      {/* Share and Save buttons moved here */}
      <div className="flex items-center gap-2">
        <button
          onClick={handleShare}
          className="inline-flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-gray-100 to-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200 text-xs md:text-sm"
          title="Share"
        >
          <Share2 size={12} className="md:size-3" />
          <span className="ml-1">Share</span>
        </button>
        {!isSaved && !isApplied && (
          <button
            onClick={() => handleSave(id)}
            className="inline-flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-blue-100 to-blue-50 border border-blue-200 text-blue-700 rounded-xl hover:bg-blue-50 transition-all duration-200 text-xs md:text-sm"
            title="Save"
          >
            <Save size={12} className="md:size-3" />
            <span className="ml-1">Save</span>
          </button>
        )}
      </div>
      
      {/* Smaller Logo/Image */}
      <div 
        className="w-10 h-10 md:w-14 md:h-14 bg-gradient-to-br from-[#667eea]/20 to-[#764ba2]/20 rounded-lg md:rounded-xl flex items-center justify-center overflow-hidden cursor-pointer hover:opacity-90 transition-opacity flex-shrink-0"
        onClick={() => setShowCollegeModal(true)}
      >
        {collegeDetails?.profileImage ? (
          <img 
            src={collegeDetails?.profileImage} 
            alt={`${collegeName} Logo`} 
            className="w-full h-full object-cover"
          />
        ) : (
          <Building2 className="h-5 w-5 md:h-6 md:w-6 text-[#667eea]" />
        )}
      </div>
    </div>
  </div>
</div>

          {/* Statistics Cards - Responsive with consistent height */}
<div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
  {/* Min Package Card */}
  <div className="bg-gradient-to-r from-gray-50 to-white border border-gray-100 rounded-xl p-3 md:p-4 min-h-[80px] md:min-h-[90px]">
    <div className="flex items-center justify-between h-full">
      <div className="min-w-0">
        <p className="text-xs md:text-sm text-gray-600 mb-1">Min Package</p>
        <p className="text-sm md:text-base lg:text-lg font-bold text-[#667eea] leading-snug">
          {posting.packageDetails?.totalCTC 
            ? `${posting.packageDetails.currency} ${posting.packageDetails.totalCTC.toLocaleString()}`
            : 'N/A'
          }
        </p>
      </div>
      <div className="p-2 md:p-3 bg-gradient-to-br from-blue-100 to-blue-50 rounded-lg flex-shrink-0 ml-2">
        <DollarSign className="h-4 w-4 md:h-5 md:w-5 text-blue-600" />
      </div>
    </div>
  </div>
  
  {/* Students to Place Card */}
  <div className="bg-gradient-to-r from-gray-50 to-white border border-gray-100 rounded-xl p-3 md:p-4 min-h-[80px] md:min-h-[90px]">
    <div className="flex items-center justify-between h-full">
      <div className="min-w-0">
        <p className="text-xs md:text-sm text-gray-600 mb-1">Students to Place</p>
        <p className="text-sm md:text-base lg:text-lg font-bold text-green-600 leading-snug">
          {posting.noOfplacedStudents || 'N/A'}
        </p>
      </div>
      <div className="p-2 md:p-3 bg-gradient-to-br from-green-100 to-green-50 rounded-lg flex-shrink-0 ml-2">
        <Users className="h-4 w-4 md:h-5 md:w-5 text-green-600" />
      </div>
    </div>
  </div>
  
  {/* Employment Type Card */}
  <div className="bg-gradient-to-r from-gray-50 to-white border border-gray-100 rounded-xl p-3 md:p-4 min-h-[80px] md:min-h-[90px]">
    <div className="flex items-center justify-between h-full">
      <div className="min-w-0">
        <p className="text-xs md:text-sm text-gray-600 mb-1">Employment Type</p>
        <p className="text-xs md:text-sm font-medium text-purple-600 line-clamp-2 leading-tight">
          {posting.employmentType?.join(', ') || 'N/A'}
        </p>
      </div>
      <div className="p-2 md:p-3 bg-gradient-to-br from-purple-100 to-purple-50 rounded-lg flex-shrink-0 ml-2">
        <Briefcase className="h-4 w-4 md:h-5 md:w-5 text-purple-600" />
      </div>
    </div>
  </div>
  
  {/* Looking For Card */}
  <div className="bg-gradient-to-r from-gray-50 to-white border border-gray-100 rounded-xl p-3 md:p-4 min-h-[80px] md:min-h-[90px]">
    <div className="flex items-center justify-between h-full">
      <div className="min-w-0">
        <p className="text-xs md:text-sm text-gray-600 mb-1">Looking For</p>
        <p className="text-xs md:text-sm font-medium text-yellow-600 line-clamp-2 leading-tight">
          {posting.lookingFor || 'N/A'}
        </p>
      </div>
      <div className="p-2 md:p-3 bg-gradient-to-br from-yellow-100 to-yellow-50 rounded-lg flex-shrink-0 ml-2">
        <Award className="h-4 w-4 md:h-5 md:w-5 text-yellow-600" />
      </div>
    </div>
  </div>
</div>

          {/* Use a scrollable container for content that might overflow */}
          <div className="space-y-4 md:space-y-6 max-h-[calc(100vh-300px)] md:max-h-none overflow-y-auto pr-2">
            {/* About This Opportunity */}
            <div className="bg-gradient-to-r from-gray-50 to-white border border-gray-100 rounded-xl p-4 md:p-6">
              <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-3 md:mb-4">
                About This Opportunity
              </h3>
              {posting.description ? (
                <ul className="list-disc list-inside space-y-2 text-gray-700 leading-relaxed text-sm md:text-base">
                  {(() => {
                    const sentences = posting.description
                      .replace(/\n+/g, ' ')
                      .split('.')
                      .map(s => s.trim())
                      .filter(Boolean);

                    const bullets = [];
                    let buffer = '';

                    sentences.forEach(sentence => {
                      if (sentence.length < 25) {
                        buffer += sentence + ' ';
                      } else {
                        bullets.push((buffer + sentence).trim());
                        buffer = '';
                      }
                    });

                    if (buffer.trim()) {
                      bullets.push(buffer.trim());
                    }

                    return bullets.map((point, idx) => (
                      <li key={idx}>{point}.</li>
                    ));
                  })()}
                </ul>
              ) : (
                <p className="text-gray-500 text-sm md:text-base">No description provided.</p>
              )}
            </div>

            {/* Contact Information */}
            <div className="bg-gradient-to-r from-gray-50 to-white border border-gray-100 rounded-xl p-4 md:p-6">
              <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-3 md:mb-4">
                Point of Contact - Campus Placement Officer
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3 md:gap-4">
                  <div className="p-2 md:p-3 bg-gradient-to-br from-blue-100 to-blue-50 rounded-lg flex-shrink-0">
                    <Users className="h-4 w-4 md:h-5 md:w-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 text-sm md:text-base">College Placement Officer Contact:</h4>
                    <div className="flex items-center mt-1">
                      <span className="font-medium text-sm md:text-base">{posting?.contactPerson?.name || 'Not specified'}</span>
                      <span className="text-gray-600 ml-2 text-sm">({posting?.contactPerson?.designation || 'TPO'})</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-green-100 to-green-50 rounded-lg flex-shrink-0">
                      <Mail className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <p className="text-xs md:text-sm text-gray-600">Email</p>
                      <a 
                        href={`mailto:${posting?.contactPerson?.email}`}
                        className="font-medium text-blue-600 hover:text-blue-800 text-sm md:text-base truncate block"
                      >
                        {posting?.contactPerson?.email || 'No email provided'}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-purple-100 to-purple-50 rounded-lg flex-shrink-0">
                      <Phone className="h-4 w-4 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-xs md:text-sm text-gray-600">Phone</p>
                      <a 
                        href={`tel:${posting?.contactPerson?.mobile}`}
                        className="font-medium text-blue-600 hover:text-blue-800 text-sm md:text-base"
                      >
                        {posting?.contactPerson?.mobile || 'No mobile provided'}
                      </a>
                    </div>
                  </div>
                </div>

                {posting?.contactPerson?.linkedin && (
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-blue-100 to-blue-50 rounded-lg flex-shrink-0">
                      <Linkedin className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-xs md:text-sm text-gray-600">LinkedIn</p>
                      <a 
                        href={posting.contactPerson.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-blue-600 hover:text-blue-800 text-sm md:text-base truncate block"
                      >
                        {posting.contactPerson.linkedin}
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Tentative Dates */}
            <div className="bg-gradient-to-r from-gray-50 to-white border border-gray-100 rounded-xl p-4 md:p-6">
              <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-3 md:mb-4">
                Tentative Dates to held On-Campus
              </h3>
              <div className="grid md:grid-cols-3 gap-4 md:gap-6">
                <div className="bg-gradient-to-r from-blue-50 to-white border border-blue-100 rounded-lg p-3 md:p-4">
                  <p className="text-xs md:text-sm text-gray-600 mb-1">Proposed Start Date</p>
                  <p className="font-medium text-gray-900 text-sm md:text-base">{formatDateSafe(posting.proposedSchedule?.startDate)}</p>
                </div>
                <div className="bg-gradient-to-r from-blue-50 to-white border border-blue-100 rounded-lg p-3 md:p-4">
                  <p className="text-xs md:text-sm text-gray-600 mb-1">Proposed End Date</p>
                  <p className="font-medium text-gray-900 text-sm md:text-base">{formatDateSafe(posting.proposedSchedule?.endDate)}</p>
                </div>
                <div className="bg-gradient-to-r from-blue-50 to-white border border-blue-100 rounded-lg p-3 md:p-4">
                  <p className="text-xs md:text-sm text-gray-600 mb-1">Preferred Mode</p>
                  <p className="font-medium text-gray-900 text-sm md:text-base">{posting.proposedSchedule?.preferredMode || 'N/A'}</p>
                </div>
              </div>
            </div>

            {/* Preferred Company Types */}
            <div className="bg-gradient-to-r from-gray-50 to-white border border-gray-100 rounded-xl p-4 md:p-6">
              <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-3 md:mb-4">
                Preferred Company Types
              </h3>
              <div className="flex flex-wrap gap-2">
                {posting.companyType?.length > 0 ? (
                  posting.companyType.map((type, index) => (
                    <span 
                      key={index} 
                      className="px-2 py-1 md:px-3 md:py-1.5 text-xs md:text-sm bg-gradient-to-r from-gray-100 to-white border border-gray-200 text-gray-700 rounded-lg hover:from-[#667eea]/10 hover:to-[#764ba2]/10 hover:border-[#667eea]/30 transition-all duration-200"
                    >
                      {type}
                    </span>
                  ))
                ) : <p className="text-xs md:text-sm text-gray-500">No specific company types listed.</p>}
              </div>
            </div>

            {/* College Student Details */}
            <div className="bg-gradient-to-r from-gray-50 to-white border border-gray-100 rounded-xl p-4 md:p-6">
              <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-3 md:mb-4">
                College Student Details
              </h3>
              <div className="overflow-x-auto">
                {posting.roundDetails?.length > 0 ? (
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gradient-to-r from-gray-50 to-white">
                      <tr>
                        <th className="px-3 py-2 md:px-4 md:py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">S.No.</th>
                        <th className="px-3 py-2 md:px-4 md:py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Branch</th>
                        <th className="px-3 py-2 md:px-4 md:py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">No. of Students</th>
                        <th className="px-3 py-2 md:px-4 md:py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Skills</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {posting.roundDetails.map((round, index) => (
                        <tr key={index} className="hover:bg-gray-50/50 transition-colors">
                          <td className="px-3 py-2 md:px-4 md:py-3 text-sm font-medium text-gray-900">{index + 1}</td>
                          <td className="px-3 py-2 md:px-4 md:py-3 text-sm text-gray-700">{round.branch || 'N/A'}</td>
                          <td className="px-3 py-2 md:px-4 md:py-3 text-sm text-gray-700">{round.students || 'N/A'}</td>
                          <td className="px-3 py-2 md:px-4 md:py-3 text-sm text-gray-700">{round.skills || 'N/A'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  posting.studentStreams?.length > 0 && posting.numberOfStudent?.length > 0 ? (
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gradient-to-r from-gray-50 to-white">
                        <tr>
                          <th className="px-3 py-2 md:px-4 md:py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">S.No.</th>
                          <th className="px-3 py-2 md:px-4 md:py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Branch</th>
                          <th className="px-3 py-2 md:px-4 md:py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">No. of Students</th>
                          <th className="px-3 py-2 md:px-4 md:py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Skills</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {posting.studentStreams
                          .map((stream, index) => ({
                            stream,
                            students: posting.numberOfStudent?.[index],
                            skills:
                              posting.roundSkills?.[index] ??
                              (Array.isArray(posting.skills) ? posting.skills[index] : null),
                          }))
                          .filter(item =>
                            item.stream &&
                            item.students &&
                            item.skills
                          )
                          .map((item, index) => (
                          
                          <tr key={index} className="hover:bg-gray-50/50 transition-colors">
                            <td className="px-3 py-2 md:px-4 md:py-3 text-sm font-medium text-gray-900">{index + 1}</td>
                            <td className="px-3 py-2 md:px-4 md:py-3 text-sm text-gray-700">{item.stream}</td>
                            <td className="px-3 py-2 md:px-4 md:py-3 text-sm text-gray-700">
                              {item.students}
                            </td>
                            <td className="px-3 py-2 md:px-4 md:py-3 text-sm text-gray-700">
                              {item.skills}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <p className="text-xs md:text-sm text-gray-500">No round details provided.</p>
                  )
                )}
              </div>
            </div>

            {/* Amenities Offered */}
            <div className="bg-gradient-to-r from-gray-50 to-white border border-gray-100 rounded-xl p-4 md:p-6">
              <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-3 md:mb-4">
                Amenities Offered
              </h3>
              <div className="flex flex-wrap gap-2">
                {posting.amenitiesRequired?.length > 0 ? (
                  posting.amenitiesRequired.map((amenity, index) => (
                    <span 
                      key={index} 
                      className="px-2 py-1 md:px-3 md:py-1.5 text-xs md:text-sm bg-gradient-to-r from-gray-100 to-white border border-gray-200 text-gray-700 rounded-lg hover:from-[#667eea]/10 hover:to-[#764ba2]/10 hover:border-[#667eea]/30 transition-all duration-200"
                    >
                      {amenity}
                    </span>
                  ))
                ) : <p className="text-xs md:text-sm text-gray-500">No amenities listed.</p>}
              </div>
            </div>
          </div>

          {/* Action Buttons - Make them responsive */}
          <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 md:gap-4 pt-4 md:pt-6 border-t border-gray-200 mt-4 md:mt-6">
            <div className="flex flex-wrap gap-2 md:gap-3">
              <button
                onClick={handleMessageClick}
                disabled={isSubmitting || !posting?.collegePosted?.userId}
                className="inline-flex items-center gap-2 px-3 py-2 md:px-4 md:py-2.5 bg-gradient-to-r from-gray-100 to-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-300 hover:text-[#667eea] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base"
              >
                <Send size={14} className="md:size-4" />
                <span className="hidden sm:inline">{isSubmitting ? 'Connecting...' : 'Message Officer'}</span>
                <span className="sm:hidden">{isSubmitting ? '...' : 'Message'}</span>
              </button>

              <button 
                onClick={handleAlternateDateClick}
                className="inline-flex items-center gap-2 px-3 py-2 md:px-4 md:py-2.5 bg-gradient-to-r from-blue-100 to-blue-50 border border-blue-200 text-blue-700 rounded-xl hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 text-sm md:text-base"
              >
                <Calendar size={14} className="md:size-4" />
                <span className="hidden sm:inline">Alternate Date</span>
                <span className="sm:hidden">Date</span>
              </button>
            </div>

            {!isApplied && (
              <button 
                onClick={() => handleApply(id)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-black text-white px-4 py-2.5 md:px-6 md:py-2.5 rounded-xl hover:bg-gray-800 transition-all duration-200 font-medium text-sm md:text-base"
              >
                <CheckCircle size={14} className="md:size-4" />
                Accept Invitation
              </button>
            )}
          </div>
        </div>

        <AlternateDateModal />
        <CollegeDetailsModal />
      </div>
    </div>
  );
};

export default CollegeDetailPage;