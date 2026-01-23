import { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Building2, 
  MapPin, 
  Calendar, 
  Users, 
  Briefcase,
  DollarSign,
  Award,
  Mail, 
  Phone, 
  Linkedin,
  Send,
  Share2,
  Save,
  CheckCircle,
  FileText,
  Download,
  ExternalLink,
  Home,
  GraduationCap,
  Star,
  Clock
} from 'lucide-react';
import toast from 'react-hot-toast';
import { ApplyForOncampusOppurtunity, SaveOppurtunity, submitAlternateDates } from '@/lib/Company_AxiosInstance.js';
import { viewed } from '@/lib/User_AxiosInstance';
import { conversationWithCollege } from '@/lib/College_AxiosIntance';
import useConversation from '@/statemanage/useConversation';
import { format } from 'date-fns';

const EmployerDetailsModal = ({ college, isOpen, onClose }) => {
  const modalRef = useRef(null);
  
  const [posting, setPosting] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAlternateDateModal, setShowAlternateDateModal] = useState(false);
  const [selectedStartDate, setSelectedStartDate] = useState('');
  const [selectedEndDate, setSelectedEndDate] = useState('');
  const [dateError, setDateError] = useState('');
  const [showCollegeModal, setShowCollegeModal] = useState(false);
  
  const { setSelectedConversation } = useConversation();

  // Format date safely
  const formatDateSafe = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'N/A';
      return format(date, 'MMM d, yyyy');
    } catch (err) {
      return 'N/A';
    }
  };

  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return '';
      return format(date, 'yyyy-MM-dd');
    } catch (err) {
      return '';
    }
  };

  // Fetch posting details
  const fetchPostingDetails = async () => {
    if (!college?._id) return;
    try {
      setLoading(true);
      setError(null);
      setPosting(college);
      await viewed(college._id);
    } catch (err) {
      console.error("Failed to fetch posting details:", err);
      setError('Could not load the requested resource.');
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

  // Handle share
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${posting?.lookingFor || 'Job'} at ${posting?.collegePosted?.collegeUniversityDetails?.collegeName}`,
        text: `Check out this opportunity for a ${posting?.lookingFor || 'job'} at ${posting?.collegePosted?.collegeUniversityDetails?.collegeName}!`,
        url: window.location.href,
      }).catch((error) => console.log('Error sharing', error));
    } else {
      navigator.clipboard.writeText(window.location.href)
        .then(() => toast.success('Link copied to clipboard!'))
        .catch(() => toast.error('Failed to copy link'));
    }
  };

  // Handle save
  const handleSave = async (jobId) => {
    try {
      const response = await SaveOppurtunity(jobId, posting?.jobType);
      if (response.data?.success === true) toast.success("Saved");
      else toast.error(response?.response?.data?.msg || "Failed to save");
    } catch (error) {
      console.log("Error: ", error);
      toast.error("Something went wrong!");
    }
  };

  // Handle apply
  const handleApply = async (jobId) => {
    try {
      const response = await ApplyForOncampusOppurtunity(jobId);
      if (response.data?.success === true) toast.success("Applied");
      else toast.error(response?.response?.data?.msg || "Failed to apply");
    } catch (error) {
      console.log("Error: ", error);
      toast.error("Something went wrong");
    }
  };

  // Handle message click
  const handleMessageClick = async () => {
    if (!posting?.contactPerson?.email) {
      toast.error("Contact person data is missing.");
      return;
    }

    const contactPerson = posting.contactPerson;
    setIsSubmitting(true);
    
    try {
      const response = await conversationWithCollege(contactPerson._id || contactPerson.email);
      if (response.data) {
        const conversationUser = {
          _id: contactPerson._id || contactPerson.email,
          name: contactPerson.name || 'Placement Officer',
          email: contactPerson.email || '',
          profileImage: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png',
          userType: 'college',
          fullname: contactPerson.name || 'Placement Officer',
          designation: contactPerson.designation || 'Placement Officer'
        };

        setSelectedConversation(conversationUser);
        onClose();
        setTimeout(() => {
          window.location.href = '/chat-application';
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

  // Alternate date modal handlers
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

  // Alternate Date Modal Component
  const AlternateDateModal = () => {
    if (!showAlternateDateModal) return null;

    return (
      <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
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

  // College Details Modal Component
  const CollegeDetailsModal = () => {
    if (!showCollegeModal || !posting?.collegePosted) return null;

    const collegeDetails = posting.collegePosted;
    const collegeUniDetails = collegeDetails.collegeUniversityDetails || {};
    
    return (
      <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{collegeUniDetails.collegeName || 'College'}</h2>
              </div>
              <button
                onClick={() => setShowCollegeModal(false)}
                className="text-gray-500 hover:text-gray-700 text-xl p-1"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="space-y-3">
                <div className="flex items-center text-gray-700">
                  <Building2 className="w-4 h-4 mr-3 text-blue-500" />
                  <span className="font-medium">College Type:</span>
                  <span className="ml-2">{collegeUniDetails.collegeType || 'N/A'}</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <Calendar className="w-4 h-4 mr-3 text-blue-500" />
                  <span className="font-medium">Established:</span>
                  <span className="ml-2">{collegeUniDetails.establishedYear || 'N/A'}</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <Building2 className="w-4 h-4 mr-3 text-blue-500" />
                  <span className="font-medium">University:</span>
                  <span className="ml-2">{collegeUniDetails.universityName || 'N/A'}</span>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center text-gray-700">
                  <MapPin className="w-4 h-4 mr-3 text-blue-500" />
                  <span className="font-medium">City:</span>
                  <span className="ml-2">{collegeUniDetails.city || 'N/A'}</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <MapPin className="w-4 h-4 mr-3 text-blue-500" />
                  <span className="font-medium">State:</span>
                  <span className="ml-2">{collegeUniDetails.state || 'N/A'}</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <MapPin className="w-4 h-4 mr-3 text-blue-500" />
                  <span className="font-medium">Country:</span>
                  <span className="ml-2">{collegeUniDetails.country || 'N/A'}</span>
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
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#667eea]"></div>
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
              className="px-6 py-3 bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white rounded-xl hover:shadow-lg hover:shadow-[#667eea]/30 transition-all duration-300"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  const collegeDetails = posting.collegePosted;
  const collegeName = collegeDetails?.collegeUniversityDetails?.collegeName || 'the College';
  const isApplied = posting.isApplied || false;
  const isSaved = posting.isSaved || false;

  return (
    <>
      <div
        ref={modalRef}
        className="relative w-full h-full bg-white rounded-l-2xl overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-gray-50 to-white flex-shrink-0">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-[#667eea]/20 to-[#764ba2]/20 rounded-xl cursor-pointer hover:opacity-90 transition-opacity"
                 onClick={() => setShowCollegeModal(true)}>
              <Building2 className="h-6 w-6 text-[#667eea]" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 hover:text-blue-600 cursor-pointer transition-colors"
                  onClick={() => setShowCollegeModal(true)}>
                {collegeName}
              </h2>
              <div className="flex flex-wrap items-center gap-2 mt-1">
                <span className="inline-flex items-center text-xs text-gray-600 bg-gradient-to-r from-gray-50 to-white px-2 py-1 rounded-lg">
                  <Calendar className="h-3 w-3 mr-1" />
                  {formatDateSafe(posting.startDate)} - {formatDateSafe(posting.endDate)}
                </span>
                {/* <span className="inline-flex items-center text-xs text-gray-600 bg-gradient-to-r from-gray-50 to-white px-2 py-1 rounded-lg">
                  <MapPin className="h-3 w-3 mr-1" />
                  {Array.isArray(posting.location) ? posting.location.join(', ') : posting.location || 'Location not specified'}
                </span> */}
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
                className="inline-flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-blue-100 to-blue-50 border border-blue-200 text-blue-700 rounded-xl hover:bg-blue-50 transition-all duration-200 text-sm"
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

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Statistics Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 p-6">
            {/* Min Package */}
            <div className="bg-gradient-to-r from-gray-50 to-white border border-gray-100 rounded-xl p-3 md:p-4 min-h-[80px]">
              <div className="flex items-center justify-between h-full">
                <div className="min-w-0">
                  <p className="text-xs md:text-sm text-gray-600 mb-1">Min Package</p>
                  <p className="text-sm md:text-base lg:text-lg font-bold text-[#667eea] leading-snug">
                    {posting.minPackage?.amount 
                      ? `${posting.minPackage.currency || ''} ${posting.minPackage.amount.toLocaleString()}`
                      : 'N/A'
                    }
                  </p>
                </div>
                <div className="p-2 md:p-3 bg-gradient-to-br from-blue-100 to-blue-50 rounded-lg flex-shrink-0 ml-2">
                  <DollarSign className="h-4 w-4 md:h-5 md:w-5 text-blue-600" />
                </div>
              </div>
            </div>
            
            {/* Employment Type */}
            <div className="bg-gradient-to-r from-gray-50 to-white border border-gray-100 rounded-xl p-3 md:p-4 min-h-[80px]">
              <div className="flex items-center justify-between h-full">
                <div className="min-w-0">
                  <p className="text-xs md:text-sm text-gray-600 mb-1">Employment Type</p>
                  <p className="text-xs md:text-sm font-medium text-purple-600 line-clamp-2 leading-tight">
                    {posting.employmentType || 'N/A'}
                  </p>
                </div>
                <div className="p-2 md:p-3 bg-gradient-to-br from-purple-100 to-purple-50 rounded-lg flex-shrink-0 ml-2">
                  <Briefcase className="h-4 w-4 md:h-5 md:w-5 text-purple-600" />
                </div>
              </div>
            </div>
            
            {/* Job Type */}
            <div className="bg-gradient-to-r from-gray-50 to-white border border-gray-100 rounded-xl p-3 md:p-4 min-h-[80px]">
              <div className="flex items-center justify-between h-full">
                <div className="min-w-0">
                  <p className="text-xs md:text-sm text-gray-600 mb-1">Job Type</p>
                  <p className="text-xs md:text-sm font-medium text-green-600 line-clamp-2 leading-tight">
                    {posting.jobType || 'N/A'}
                  </p>
                </div>
                <div className="p-2 md:p-3 bg-gradient-to-br from-green-100 to-green-50 rounded-lg flex-shrink-0 ml-2">
                  <Award className="h-4 w-4 md:h-5 md:w-5 text-green-600" />
                </div>
              </div>
            </div>
            
            {/* Work Mode */}
            <div className="bg-gradient-to-r from-gray-50 to-white border border-gray-100 rounded-xl p-3 md:p-4 min-h-[80px]">
              <div className="flex items-center justify-between h-full">
                <div className="min-w-0">
                  <p className="text-xs md:text-sm text-gray-600 mb-1">Work Mode</p>
                  <p className="text-xs md:text-sm font-medium text-yellow-600 line-clamp-2 leading-tight">
                    {posting.workMode || 'N/A'}
                  </p>
                </div>
                <div className="p-2 md:p-3 bg-gradient-to-br from-yellow-100 to-yellow-50 rounded-lg flex-shrink-0 ml-2">
                  <Clock className="h-4 w-4 md:h-5 md:w-5 text-yellow-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Sections */}
          <div className="space-y-4 md:space-y-6 px-6 pb-6">
            {/* About This Opportunity */}
            <div className="bg-gradient-to-r from-gray-50 to-white border border-gray-100 rounded-xl p-4 md:p-6">
              <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-3 md:mb-4">
                About This Opportunity
              </h3>
              {posting.description ? (
                <p className="text-gray-700 leading-relaxed text-sm md:text-base">
                  {posting.description}
                </p>
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

            {/* Student Batch Details */}
            {posting?.studentStreams?.length > 0 && (
              <div className="bg-gradient-to-r from-gray-50 to-white border border-gray-100 rounded-xl p-4 md:p-6">
                <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-3 md:mb-4">
                  Student Batch Details
                </h3>
                <div className="overflow-x-auto">
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
                      {posting.studentStreams.map((stream, index) => (
                        <tr key={index} className="hover:bg-gray-50/50 transition-colors">
                          <td className="px-3 py-2 md:px-4 md:py-3 text-sm font-medium text-gray-900">{index + 1}</td>
                          <td className="px-3 py-2 md:px-4 md:py-3 text-sm text-gray-700">{stream || 'N/A'}</td>
                          <td className="px-3 py-2 md:px-4 md:py-3 text-sm text-gray-700">
                            {posting?.numberOfStudent?.[index] || 'N/A'}
                          </td>
                          <td className="px-3 py-2 md:px-4 md:py-3 text-sm text-gray-700">
                            {posting?.skills?.[index] || 'N/A'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Proposed Schedule */}
            <div className="bg-gradient-to-r from-gray-50 to-white border border-gray-100 rounded-xl p-4 md:p-6">
              <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-3 md:mb-4">
                Proposed Schedule
              </h3>
              <p className="text-gray-700 mb-4 text-sm md:text-base">
                We have several available recruitment drive slots for the 2025 graduating batch.
                We believe our students align well with your hiring requirements and would be an excellent fit for your company.
                Our campus is equipped with state-of-the-art infrastructure and has a strong record of successful placement drives.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="font-medium mb-1 text-sm md:text-base">Preferred Drive Date:</p>
                  <p className="text-gray-700 text-sm md:text-base">{formatDateSafe(posting?.startDate)}</p>
                </div>
                <div>
                  <p className="font-medium mb-1 text-sm md:text-base">Alternative Dates:</p>
                  <p className="text-gray-700 text-sm md:text-base">{formatDateSafe(posting?.endDate)}</p>
                </div>
                <div>
                  <p className="font-medium mb-1 text-sm md:text-base">Preferred Mode:</p>
                  <p className="text-gray-700 text-sm md:text-base">{posting?.workMode || 'N/A'}</p>
                </div>
                <div>
                  <p className="font-medium mb-1 text-sm md:text-base">Time Slots Available:</p>
                  <p className="text-gray-700 text-sm md:text-base">Full day (9:00 AM - 5:00 PM)</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t p-6 bg-gray-50 flex-shrink-0">
          <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 md:gap-4">
            <div className="flex flex-wrap gap-2 md:gap-3">
              <button
                onClick={handleMessageClick}
                disabled={isSubmitting || !posting?.contactPerson?.email}
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
                onClick={() => handleApply(posting._id)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-black text-white px-4 py-2.5 md:px-6 md:py-2.5 rounded-xl hover:bg-gray-800 transition-all duration-200 font-medium text-sm md:text-base mt-3 sm:mt-0"
              >
                <CheckCircle size={14} className="md:size-4" />
                Accept Invitation
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Nested Modals */}
      <AlternateDateModal />
      <CollegeDetailsModal />
    </>
  );
};

export default EmployerDetailsModal;