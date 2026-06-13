import { useState, useEffect, useRef } from 'react';
import { useChat } from '@/context/ChatContext';
import { 
  Send, 
  Calendar, 
  X, 
  Building2, 
  MapPin, 
  Globe, 
  Mail, 
  Phone, 
  Linkedin, 
  Users, 
  Briefcase,
  Share2,
  Save,
  CheckCircle,
  Award,
  IndianRupee
} from 'lucide-react';
import { format } from 'date-fns';
import { ApplyForPoolcampusOppurtunity, SaveOppurtunity, submitAlternateDates } from '@/lib/Company_AxiosInstance.js';
import toast from 'react-hot-toast';
import { viewed } from '@/lib/User_AxiosInstance';
import useConversation from '@/statemanage/useConversation';
import { conversationWithCollege } from '@/lib/College_AxiosIntance';

import { createPortal } from 'react-dom';
import { useAuth } from "@/context/AuthContext";

// ---------- LOGIN PROMPT COMPONENT ----------
const LoginPromptModal = ({ isOpen, onClose, onLogin }) => {
  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose} />
      
      {/* Card */}
      <div className="relative z-[100000] w-full max-w-sm bg-white rounded-3xl p-8 shadow-2xl text-center border border-white/20">
        <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-indigo-50 mb-6">
          <Building2 className="h-10 w-10 text-[#143694]" />
        </div>
        
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Login Required</h3>
        <p className="text-gray-600 mb-8 text-sm">
          Please log in to your company account to accept pool-campus invitations or suggest alternate dates.
        </p>
        
        <div className="flex flex-col gap-3">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              e.nativeEvent.stopImmediatePropagation(); 
              onLogin();
            }}
            className="w-full py-4 px-4 bg-gradient-to-r from-[#143694] to-[#1e4ed8] text-white font-bold rounded-2xl hover:opacity-90 shadow-lg cursor-pointer transition-all"
          >
            Login to Continue
          </button>
          
          <button
            type="button"
            onClick={onClose}
            className="w-full py-3 px-4 text-gray-400 font-medium hover:text-gray-600 transition-colors"
          >
            Maybe Later
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

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

const PoolCampusDetailModal = ({ college, isOpen, onClose, parentRef,  isApplied: propIsApplied, isSaved: propIsSaved }) => {
  console.log("🎯 PoolCampusDetailModal - Props received:", {
    isOpen,
    collegeExists: !!college,
    collegeId: college?._id,
    collegeName: college?.collegePosted?.collegeUniversityDetails?.collegeName
  });
  
  if (!isOpen) {
    console.log("🎯 Modal NOT rendering because isOpen is false");
    return null;
  }
  
  console.log("🎯 Modal SHOULD be rendering now");
  //const { isAuthenticated, loading: authLoading } = useAuth();
 // const [showLoginModal, setShowLoginModal] = useState(false);
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [posting, setPosting] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [showAlternateDateModal, setShowAlternateDateModal] = useState(false);
  const [selectedStartDate, setSelectedStartDate] = useState('');
  const [selectedEndDate, setSelectedEndDate] = useState('');
  const [dateError, setDateError] = useState('');
  
  const [showCollegeModal, setShowCollegeModal] = useState(false);
  
  // Add state for image error handling (same as CollegeCard)
  const [imageError, setImageError] = useState(false);

  const modalRef = useRef(null);
  // const collegeModalRef = useRef(null); // Ref for college details modal
  const contentRef = useRef(null);
  const { setSelectedConversation, setShowFloatingChat } = useChat();  
  // const { setSelectedConversation, setShowFloatingChat } = useChat();    

  // Helper function to get college initials (same as CollegeCard)
  const getInitials = (name) => {
    if (!name) return '?';
    const words = name.trim().split(' ');
    if (words.length === 1) return words[0][0].toUpperCase();
    return (words[0][0] + words[words.length - 1][0]).toUpperCase();
  };

  // Get college logo using the same logic as CollegeCard
  const getCollegeLogo = () => {
    if (!posting) return 'https://via.placeholder.com/48';
    
    const collegeDetails = posting.collegePosted;
    const logo = collegeDetails?.profileImage || posting.collegeLogo || 'https://via.placeholder.com/48';
    
    return logo;
  };

  const handleLoginRedirect = () => {
   // if (onNavigateAway) onNavigateAway();
    window.location.href = '/userselection';
  };

  const fetchPostingDetails = async () => {
    if (!college?._id) return;
    try {
      setLoading(true);
      setError(null);
      setPosting(college);
      await viewed(college._id);
    } catch (err) {
      console.error("Failed to fetch posting details:", err);
      setError('Could not load the requested resource. It might have been removed.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && college) {
      fetchPostingDetails();
    }
  }, [isOpen, college]);

  // Close modal on Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        if (showCollegeModal) {
          setShowCollegeModal(false);
        } else if (showAlternateDateModal) {
          setShowAlternateDateModal(false);
        } else {
          onClose();
        }
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose, showCollegeModal, showAlternateDateModal]);

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

  // Close main modal when clicking outside - updated to handle nested modals
 useEffect(() => {
    const handleClickOutside = (e) => {
      // 🛑 DON'T close main modal if login prompt or other sub-modals are active
      if (showCollegeModal || showAlternateDateModal || showLoginModal) return;
      
      if (parentRef?.current && !parentRef.current.contains(e.target)) {
        onClose();
      }
    };
    
    if (isOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose, showCollegeModal, showAlternateDateModal, showLoginModal]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Pool Campus Opportunity at ${posting?.collegePosted?.collegeUniversityDetails?.collegeName}`,
        text: `Check out this pool-campus opportunity at ${posting?.collegePosted?.collegeUniversityDetails?.collegeName}!`,
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
    if (!isAuthenticated) {
      setShowLoginModal(true);
      return;
    }
    try {
      const response = await SaveOppurtunity(jobId, posting?.jobType);
      if (response.data?.success === true) toast.success("Saved");
      else toast.error(response?.response?.data?.msg || "Failed to save");
    } catch (error) {
      console.log("Error: ", error);
      toast.error("Something went wrong!");
    }
  };

  const handleApply = async (jobId) => {
    if (!isAuthenticated) {
      setShowLoginModal(true);
      return;
    }
    try {
      const response = await ApplyForPoolcampusOppurtunity(jobId); 
      if (response.data?.success === true) {
        toast.success("Applied");
        onClose();
      } else {
        toast.error(response?.data?.msg || "Failed to apply");
      }
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
          setShowFloatingChat(true);
        }, 0);
        onClose();
        // setTimeout(() => {
        //   window.location.href = '/chat-application';
        // }, 100);

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

  // Alternate date modal handlers
  const handleAlternateDateClick = () => {
    setSelectedStartDate('');
    setSelectedEndDate('');
    setDateError('');
    setShowAlternateDateModal(true);
  };

  const handleCloseAlternateModal = () => {
    setShowAlternateDateModal(false);
    setDateError('');
  };

  // College modal handler
  const handleCloseCollegeModal = () => {
    setShowCollegeModal(false);
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
      const response = await submitAlternateDates(posting._id, {
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
      <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
        <div 
          // ref={collegeModalRef}
          className="bg-white/90 backdrop-blur-sm border border-gray-100 rounded-2xl shadow-lg p-6 max-w-md w-full"
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Suggest Alternate Dates</h3>
            <button
              onClick={handleCloseAlternateModal}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
          
          <div className="mb-6">
            <p className="text-sm text-gray-600 mb-4">
              Please select your preferred start and end dates for the pool-campus drive:
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
                    className="w-full pl-10 pr-3 py-2.5 bg-gradient-to-r from-gray-50 to-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#143694]/50 focus:border-transparent focus:outline-none transition-all duration-200"
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
                    className="w-full pl-10 pr-3 py-2.5 bg-gradient-to-r from-gray-50 to-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#143694]/50 focus:border-transparent focus:outline-none transition-all duration-200"
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
              onClick={handleCloseAlternateModal}
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
      <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
        <div 
          ref={collegeModalRef}
          className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        >
          <div className="p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{collegeName}</h2>
              </div>
              <button
                onClick={handleCloseCollegeModal}
                className="text-gray-500 hover:text-gray-700 text-xl p-1"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="space-y-3">
                <div className="flex items-center text-gray-700">
                  <Building2 className="w-4 h-4 mr-3 text-[#1e4ed8]" />
                  <span className="font-medium">College Type:</span>
                  <span className="ml-2">{collegeType || 'N/A'}</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <Calendar className="w-4 h-4 mr-3 text-[#1e4ed8]" />
                  <span className="font-medium">Established:</span>
                  <span className="ml-2">{establishedYear || 'N/A'}</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <Building2 className="w-4 h-4 mr-3 text-[#1e4ed8]" />
                  <span className="font-medium">University:</span>
                  <span className="ml-2">{universityName || 'N/A'}</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <MapPin className="w-4 h-4 mr-3 text-[#1e4ed8]" />
                  <span className="font-medium">City:</span>
                  <span className="ml-2">{city || 'N/A'}</span>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center text-gray-700">
                  <MapPin className="w-4 h-4 mr-3 text-[#1e4ed8]" />
                  <span className="font-medium">State:</span>
                  <span className="ml-2">{state || 'N/A'}</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <MapPin className="w-4 h-4 mr-3 text-[#1e4ed8]" />
                  <span className="font-medium">Country:</span>
                  <span className="ml-2">{country || 'N/A'}</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <MapPin className="w-4 h-4 mr-3 text-[#1e4ed8]" />
                  <span className="font-medium">Pincode:</span>
                  <span className="ml-2">{pincode || 'N/A'}</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <Globe className="w-4 h-4 mr-3 text-[#1e4ed8]" />
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

  if (!isOpen) return null;

  if (loading) {
    return (
      <div className="relative w-full h-full bg-white flex items-center justify-center rounded-l-2xl">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#143694]"></div>
      </div>
    );
  }

  if (error || !posting) {
    return (
      <div className="relative w-full h-full bg-white flex items-center justify-center rounded-l-2xl">
        <div className="p-8 max-w-md w-full">
          <div className="flex flex-col items-center text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-100 text-red-600 mb-4">
              <X className="h-6 w-6" />
            </div>
            <p className="text-lg font-medium text-gray-900 mb-4">{error || 'Posting not found'}</p>
            <button
              onClick={onClose}
              className="px-6 py-3 bg-gradient-to-r from-[#143694] to-[#1e4ed8] text-white rounded-xl hover:shadow-lg hover:shadow-[#143694]/30 transition-all duration-300"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  const collegeDetails = posting.collegePosted;
  const collegeUniDetails = collegeDetails?.collegeUniversityDetails || {};
  const collegeName = collegeDetails?.collegeUniversityDetails?.collegeName || 'the College';
  const formattedStartDate = formatDateSafe(posting.startDate);
  const formattedEndDate = formatDateSafe(posting.endDate);
  
  const city = collegeUniDetails.city || '';
  const state = collegeUniDetails.state || '';
  const location = [city, state].filter(Boolean).join(', ') || 'Location not specified';

  const isApplied = propIsApplied || posting.isApplied || false;
  const isSaved = propIsSaved || posting.isSaved || false;

  // Get the logo using the same logic as CollegeCard
  const logo = getCollegeLogo();

  return (
    <>
      <div
        ref={modalRef}
        className="relative w-full h-full bg-white rounded-l-2xl overflow-hidden flex flex-col"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-8 border-b bg-gradient-to-r from-gray-50 to-white flex-shrink-0">
          <div className="flex items-center gap-4">
            {/* College Logo - Same logic as CollegeCard */}
            <div 
              className="w-14 h-14 bg-white rounded-full shadow flex items-center justify-center overflow-hidden border cursor-pointer hover:opacity-90 transition-opacity"
              onClick={() => setShowCollegeModal(true)}
            >
              {logo && !imageError ? (
                <img 
                  src={logo} 
                  alt={`${collegeName} logo`}
                  className="w-12 h-12 object-cover"
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-sm font-semibold text-gray-700">
                    {getInitials(collegeName)}
                  </span>
                </div>
              )}
            </div>
            <div>
              <h2 
                className="text-2xl font-bold text-gray-900 hover:text-blue-600 cursor-pointer transition-colors"
                onClick={() => setShowCollegeModal(true)}
              >
                {collegeName}
              </h2>
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 mt-1">
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="h-4 w-4 mr-1 flex-shrink-0" />
                  <span>{formattedStartDate} - {formattedEndDate}</span>
                </div>
                <div className="hidden sm:block text-gray-400">|</div>
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
                  <span>{location}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-gray-100 to-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200 text-sm"
              title="Share"
            >
              <Share2 size={12} className="md:size-3" />
              <span className="ml-1">Share</span>
            </button>
            {!isSaved && !isApplied && (
              <button
                onClick={() => handleSave(posting._id)}
                className="inline-flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-blue-100 to-blue-50 border border-blue-200 text-[#143694] rounded-xl hover:bg-blue-50 transition-all duration-200 text-sm"
                title="Save"
              >
                <Save size={12} className="md:size-3" />
                <span className="ml-1">Save</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors ml-2"
            >
              <X className="h-6 w-6 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Main Content Area - Scrollable */}
        <div 
          ref={contentRef}
          className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
          style={{ borderRadius: '0 0 0 1rem' }}
        >
          {/* Statistics Cards - Horizontal Layout */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 p-6">
            {/* Min Package Card */}
            <div className="bg-gradient-to-r from-gray-50 to-white border border-gray-100 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-gradient-to-br from-blue-100 to-blue-50 rounded-lg">
                  <IndianRupee className="h-5 w-5 text-blue-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-gray-600 mb-1">Minimum Package</p>
                  <p className="text-base font-bold text-[#143694] truncate">
                    {posting.packageDetails?.totalCTC 
                      ? `${posting.packageDetails.currency || '₹'} ${posting.packageDetails.totalCTC.toLocaleString()}`
                      : 'N/A'
                    }
                  </p>
                </div>
              </div>
            </div>
            
            {/* Students to Place Card */}
            <div className="bg-gradient-to-r from-gray-50 to-white border border-gray-100 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-gradient-to-br from-green-100 to-green-50 rounded-lg">
                  <Users className="h-5 w-5 text-green-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-gray-600 mb-1">Students to Place</p>
                  <p className="text-base font-bold text-green-600 truncate">
                    {posting.noOfplacedStudents || 'N/A'}
                  </p>
                </div>
              </div>
            </div>
            
            {/* Employment Type Card */}
            <div className="bg-gradient-to-r from-gray-50 to-white border border-gray-100 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-gradient-to-br from-purple-100 to-purple-50 rounded-lg">
                  <Briefcase className="h-5 w-5 text-[#143694]" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-gray-600 mb-1">Employment Type</p>
                  <p className="text-sm font-medium text-[#143694] truncate">
                    {posting.employmentType?.join(', ') || 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="space-y-4 md:space-y-6 px-6 pb-6">
            {/* About This Opportunity */}
            <div className="bg-gradient-to-r from-gray-50 to-white border border-gray-100 rounded-xl p-4 md:p-6">
              <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-3 md:mb-4">
                About This Opportunity
              </h3>
              {posting.description ? (
                <div className="text-gray-700 leading-relaxed text-sm md:text-base whitespace-pre-line">
                  {posting.description}
                </div>
              ) : (
                <p className="text-gray-500 text-sm md:text-base">No description provided.</p>
              )}
            </div>

            {/* Contact Information */}
            <div className="bg-gradient-to-r from-gray-50 to-white border border-gray-100 rounded-xl p-4 md:p-6">
              <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-4">
                Point of Contact - Campus Placement
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="p-2.5 bg-gradient-to-br from-blue-100 to-blue-50 rounded-lg flex-shrink-0 mt-1">
                    <Users className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 text-base mb-1">College Placement Officer Contact:</h4>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                      <span className="font-medium text-base">{posting?.contactPerson?.name || 'Not specified'}</span>
                      <span className="text-gray-600 text-sm">({posting?.contactPerson?.designation || 'TPO'})</span>
                    </div>
                  </div>
                </div>

                {/* Contact Details in Single Row */}
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                  {posting?.contactPerson?.email && (
                    <div className="flex items-center gap-3 flex-1">
                      <div className="p-2.5 bg-gradient-to-br from-green-100 to-green-50 rounded-lg flex-shrink-0">
                        <Mail className="h-5 w-5 text-green-600" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs text-gray-600 mb-1">Email</p>
                        <a 
                          href={`mailto:${posting.contactPerson.email}`}
                          className="font-medium text-blue-600 hover:text-blue-800 text-sm truncate block"
                        >
                          {posting.contactPerson.email}
                        </a>
                      </div>
                    </div>
                  )}

                  {posting?.contactPerson?.mobile && (
                    <div className="flex items-center gap-3 flex-1">
                      <div className="p-2.5 bg-gradient-to-br from-purple-100 to-purple-50 rounded-lg flex-shrink-0">
                        <Phone className="h-5 w-5 text-[#143694]" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs text-gray-600 mb-1">Phone</p>
                        <a 
                          href={`tel:${posting.contactPerson.mobile}`}
                          className="font-medium text-blue-600 hover:text-blue-800 text-sm block"
                        >
                          {posting.contactPerson.mobile}
                        </a>
                      </div>
                    </div>
                  )}

                  {posting?.contactPerson?.linkedin && (
                    <div className="flex items-center gap-3 flex-1">
                      <div className="p-2.5 bg-gradient-to-br from-blue-100 to-blue-50 rounded-lg flex-shrink-0">
                        <Linkedin className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs text-gray-600 mb-1">LinkedIn</p>
                        <a 
                          href={posting.contactPerson.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium text-blue-600 hover:text-blue-800 text-sm truncate block"
                        >
                          {posting.contactPerson.linkedin}
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Tentative Dates */}
            {posting.proposedSchedule && (
              <div className="bg-gradient-to-r from-gray-50 to-white border border-gray-100 rounded-xl p-4 md:p-6">
                <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-3 md:mb-4">
                  Tentative Date to held Pool-Campus
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
            )}

            {/* Preferred Company Types */}
            {posting.companyType?.length > 0 && (
              <div className="bg-gradient-to-r from-gray-50 to-white border border-gray-100 rounded-xl p-4 md:p-6">
                <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-3 md:mb-4">
                  Preferred Company Types
                </h3>
                <div className="flex flex-wrap gap-2">
                  {posting.companyType.map((type, index) => (
                    <span 
                      key={index} 
                      className="px-3 py-1.5 text-sm bg-gradient-to-r from-gray-100 to-white border border-gray-200 text-gray-700 rounded-lg"
                    >
                      {type}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* College Student Details */}
            {(posting.roundDetails?.length > 0 || posting.studentStreams?.length > 0) && (
              <div className="bg-gradient-to-r from-gray-50 to-white border border-gray-100 rounded-xl p-4 md:p-6">
                <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-3 md:mb-4">
                  College Student Details
                </h3>
                <div className="overflow-x-auto rounded-lg">
                  {posting.roundDetails?.length > 0 ? (
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gradient-to-r from-gray-50 to-white">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">S.No.</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Branch</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">No. of Students</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Skills</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {posting.roundDetails
                          .filter(round => round.branch && round.students && round.skills)
                          .map((round, index) => (
                            <tr key={index} className="hover:bg-gray-50/50 transition-colors">
                              <td className="px-4 py-3 text-sm font-medium text-gray-900">{index + 1}</td>
                              <td className="px-4 py-3 text-sm text-gray-700">{round.branch || 'N/A'}</td>
                              <td className="px-4 py-3 text-sm text-gray-700">{round.students || 'N/A'}</td>
                              <td className="px-4 py-3 text-sm text-gray-700">{round.skills || 'N/A'}</td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  ) : (
                    posting.studentStreams?.length > 0 && posting.numberOfStudent?.length > 0 && (
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gradient-to-r from-gray-50 to-white">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">S.No.</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Branch</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">No. of Students</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Skills</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {posting.studentStreams
                            .filter((stream, index) => 
                              stream && 
                              posting.numberOfStudent?.[index] && 
                              (posting.roundSkills?.[index] || posting.skills?.[index])
                            )
                            .map((stream, index) => (
                              <tr key={index} className="hover:bg-gray-50/50 transition-colors">
                                <td className="px-4 py-3 text-sm font-medium text-gray-900">{index + 1}</td>
                                <td className="px-4 py-3 text-sm text-gray-700">{stream || 'N/A'}</td>
                                <td className="px-4 py-3 text-sm text-gray-700">
                                  {posting.numberOfStudent?.[index] || 'N/A'}
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-700">
                                  {posting.roundSkills?.[index] || posting.skills?.[index] || 'N/A'}
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    )
                  )}
                </div>
              </div>
            )}

            {/* Amenities Required */}
            {posting.amenitiesRequired?.length > 0 && (
              <div className="bg-gradient-to-r from-gray-50 to-white border border-gray-100 rounded-xl p-4 md:p-6">
                <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-3 md:mb-4">
                  Amenities Offered
                </h3>
                <div className="flex flex-wrap gap-2">
                  {posting.amenitiesRequired.map((amenity, index) => (
                    <span 
                      key={index} 
                      className="px-3 py-1.5 text-sm bg-gradient-to-r from-gray-100 to-white border border-gray-200 text-gray-700 rounded-lg"
                    >
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="border-t p-6 bg-gray-50 flex-shrink-0">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                onClick={handleMessageClick}
                disabled={isSubmitting || !posting?.collegePosted?.userId}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-gray-100 to-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-300 hover:text-[#143694] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base flex-1 sm:flex-none"
              >
                <Send size={16} className="md:size-4" />
                <span>{isSubmitting ? 'Connecting...' : 'Message Officer'}</span>
              </button>

              <button 
                onClick={handleAlternateDateClick}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-100 to-blue-50 border border-blue-200 text-[#143694] rounded-xl hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 text-sm md:text-base flex-1 sm:flex-none"
              >
                <Calendar size={16} className="md:size-4" />
                <span>Suggest Date</span>
              </button>
            </div>

            {!isApplied && (
              <button 
                onClick={() => handleApply(posting._id)}
                className="inline-flex items-center justify-center gap-2 bg-primaryBrand text-white px-6 py-2.5 rounded-xl hover:bg-[#1e4ed8] transition-all duration-200 font-medium text-sm md:text-base w-full sm:w-auto mt-3 sm:mt-0"
              >
                <CheckCircle size={16} className="md:size-4" />
                Accept Invitation
              </button>
            )}
          </div>
        </div>
      </div>
     <LoginPromptModal 
        isOpen={showLoginModal} 
        onClose={() => setShowLoginModal(false)} 
        onLogin={handleLoginRedirect} 
      />
      {/* Nested Modals */}
      <AlternateDateModal />
      <CollegeDetailsModal />
    </>
  );
};

export default PoolCampusDetailModal;