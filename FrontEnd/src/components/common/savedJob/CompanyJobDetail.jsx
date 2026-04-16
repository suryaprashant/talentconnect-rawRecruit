// src/components/common/savedJob/CompanyJobDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { 
  Building2, 
  MapPin, 
  Calendar, 
  IndianRupee,
  Briefcase, 
  Users, 
  Send,
  Share2,
  Save,
  CheckCircle,
  Mail,
  Phone,
  Linkedin,
  Globe,
  X,
  ArrowLeft
} from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { useAuth } from '@/context/AuthContext';
import { UnsaveOppurtunity } from '@/lib/Company_AxiosInstance';
import { 
  ApplyForOncampusOppurtunity, 
  ApplyForPoolcampusOppurtunity 
} from '@/lib/Company_AxiosInstance';

// Utility functions
const splitIntoMeaningfulPoints = (text) => {
  if (!text || typeof text !== 'string') return [];

  return text
    .split(/[\.\n;]+/)
    .map(line => line.trim())
    .filter(line => line.length > 5);
};

const formatDate = (dateString) => {
  if (!dateString) return 'Not Specified';

  const date = new Date(dateString);
  if (isNaN(date.getTime())) return 'Not Specified';

  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

const formatDateSafe = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'N/A';
    return format(date, 'MMM d, yyyy');
  } catch {
    return 'N/A';
  }
};

// Helper function to check if an array has valid data
const hasValidData = (arr) => {
  return arr && Array.isArray(arr) && arr.length > 0;
};

// Helper function to check if a value is meaningful
const hasValue = (value) => {
  if (value === null || value === undefined || value === '' || value === 'N/A' || value === 'Not Specified') return false;
  if (typeof value === 'number' && value === 0) return false;
  if (typeof value === 'string' && value.trim() === '') return false;
  return true;
};

// Helper function to check if an object has any meaningful values
const hasValidObject = (obj, keys = []) => {
  if (!obj || typeof obj !== 'object') return false;
  if (keys.length === 0) {
    return Object.values(obj).some(value => hasValue(value));
  }
  return keys.some(key => hasValue(obj[key]));
};

// Render tags function
const renderTags = (items) => {
  if (!items || items.length === 0) {
    return <span className="text-gray-500">Not Specified</span>;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item, index) => (
        <span
          key={index}
          className="px-3 py-1.5 bg-gradient-to-r from-[#143694]/10 to-[#1e4ed8]/10 text-[#143694] border border-[#143694]/20 rounded-full text-sm font-medium"
        >
          {item}
        </span>
      ))}
    </div>
  );
};

// Helper function to get initials
const getInitials = (name) => {
  if (!name) return '?';
  const words = name.trim().split(' ');
  if (words.length === 1) return words[0][0].toUpperCase();
  return (words[0][0] + words[words.length - 1][0]).toUpperCase();
};

const CompanyJobDetail = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [job, setJob] = useState(location.state?.job || null);
  const [loading, setLoading] = useState(!location.state?.job);
  const [isSaving, setIsSaving] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Fetch job if not in state
  useEffect(() => {
    if (!job && id) {
      fetchJobDetails();
    }
  }, [id]);

  const fetchJobDetails = async () => {
    try {
      setLoading(true);
      // Your API call to fetch job by id
      // const response = await fetch(`/api/jobs/${id}`);
      // setJob(response.data);
    } catch (error) {
      console.error('Error fetching job:', error);
      toast.error('Failed to load job details');
    } finally {
      setLoading(false);
    }
  };

  const handleBackToList = () => {
    navigate(-1);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${job?.jobRoles?.[0] || 'Opportunity'} at ${job?.collegePosted?.collegeUniversityDetails?.collegeName || job?.companyName || 'Company'}`,
        text: `Check out this opportunity for a ${job?.jobRoles?.[0] || 'job'} at ${job?.collegePosted?.collegeUniversityDetails?.collegeName || job?.companyName || 'Company'}!`,
        url: window.location.href,
      })
        .catch((error) => console.log('Error sharing', error));
    } else {
      navigator.clipboard.writeText(window.location.href)
        .then(() => toast.success('Link copied to clipboard!'))
        .catch(() => toast.error('Failed to copy link'));
    }
  };

  const handleUnsave = async () => {
    try {
      setIsSaving(true);
      const response = await UnsaveOppurtunity(job._id);
      if (response?.data?.success) {
        toast.success("Opportunity Unsaved");
        setTimeout(() => handleBackToList(), 1000);
      } else {
        toast.error("Failed to unsave");
      }
    } catch (err) {
      console.error('Error unsaving job:', err);
      toast.error('Something went wrong');
    } finally {
      setIsSaving(false);
    }
  };

// const handleApply = async () => {
//   try {
//     setIsApplying(true);

//     // Normalize the job type to handle various string formats
//     const rawType = job?.jobType || "";
//     const normalizedType = rawType.toLowerCase().replace(/[^a-z]/g, ""); 

//     let response;

//     if (normalizedType === "oncampus") {
//       response = await ApplyForOncampusOppurtunity(job._id);
//     } else if (normalizedType === "poolcampus") {
//       response = await ApplyForPoolcampusOppurtunity(job._id);
//     } else {
//       console.warn("Unknown job type detected:", rawType);
//       toast.error("Invalid opportunity type");
//       setIsApplying(false);
//       return;
//     }

//     if (response?.data?.success) {
//       toast.success(user?.role === 'company' ? "Invitation Accepted" : "Applied Successfully");
      
//       // Update local state so the 'Apply' button hides immediately
//       setJob(prev => ({
//         ...prev,
//         isApplied: true
//       }));
//     } else {
//       toast.error(response?.data?.message || "Failed to process request");
//     }
//   } catch (err) {
//     console.error("Application Error:", err);
//     toast.error(err.response?.data?.message || "Something went wrong");
//   } finally {
//     setIsApplying(false);
//   }
// };

const handleApply = async () => {
  try {
    setIsApplying(true);

    const rawType = job?.jobType || "";
    const normalizedType = rawType.toLowerCase().replace(/[^a-z]/g, "");

    let response;

    if (normalizedType === "oncampus") {
      response = await ApplyForOncampusOppurtunity(job._id);
    } else if (normalizedType === "poolcampus") {
      response = await ApplyForPoolcampusOppurtunity(job._id);
    } else {
      console.warn("Unknown job type detected:", rawType);
      toast.error("Invalid opportunity type");
      setIsApplying(false);
      return;
    }

    if (response?.data?.success) {
      toast.success(user?.role === 'company' ? "Invitation Accepted" : "Applied Successfully");

      // ✅ Remove from saved jobs after successful application
      try {
        await UnsaveOppurtunity(job._id);
      } catch (unsaveErr) {
        // Non-blocking — application already succeeded
        console.warn("Unsave after apply failed:", unsaveErr);
      }

      // Navigate back so the saved list refreshes without this job
      setTimeout(() => handleBackToList(), 1000);
    } else {
      toast.error(response?.data?.message || "Failed to process request");
    }
  } catch (err) {
    console.error("Application Error:", err);
    toast.error(err.response?.data?.message || "Something went wrong");
  } finally {
    setIsApplying(false);
  }
};

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#143694]/5 via-[#f093fb]/5 to-[#1e4ed8]/5 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#143694] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading opportunity details...</p>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#143694]/5 via-[#f093fb]/5 to-[#1e4ed8]/5 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl font-semibold text-red-500">Opportunity not found</p>
          <button
            className="mt-4 px-4 py-2 bg-gradient-to-r from-[#143694] to-[#1e4ed8] text-white rounded-lg hover:shadow-lg hover:shadow-[#143694]/30 transition-all duration-200"
            onClick={fetchJobDetails}
          >
            Try Again
          </button>
          <button
            className="mt-4 ml-4 bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg transition-all duration-200"
            onClick={handleBackToList}
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // Get organization details from college structure
  const collegeDetails = job.collegePosted;
  const collegeUniDetails = collegeDetails?.collegeUniversityDetails || {};
  const organizationName = collegeUniDetails.collegeName || job.companyName || 'Organization';
  const organizationLogo = job.logo || collegeDetails?.profileImage;
  
  const city = collegeUniDetails.city || '';
  const state = collegeUniDetails.state || '';
  const location_display = [city, state].filter(Boolean).join(', ') || 'Location not specified';

  // Get contact person details
  const contactPerson = job.contactPerson || {};

  // Get package details
  const packageDetails = job.packageDetails || {};
  const totalCTC = packageDetails.totalCTC;
  const currency = packageDetails.currency || '₹';

  // Get proposed schedule
  const proposedSchedule = job.proposedSchedule || {};
  
  // Get round details for student streams
  const roundDetails = job.roundDetails || [];
  const studentStreams = job.studentStreams || [];
  const numberOfStudent = job.numberOfStudent || [];
  const roundSkills = job.roundSkills || [];

  const displayTitle = job.jobRoles?.[0] || job.jobType || 'On-Campus Drive';
  const postingIsApplied = job.isApplied || false;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#143694]/5 via-[#f093fb]/5 to-[#1e4ed8]/5">
      <main className="px-6 py-6">
        {/* Top Back Button */}
        <button onClick={handleBackToList} className="inline-flex items-center text-[#143694] hover:text-[#1e4ed8] mb-6 transition-colors">
          <ArrowLeft className="h-5 w-5 mr-1" />
          Back 
        </button>

        <div className="bg-white/90 backdrop-blur-sm border border-gray-100 rounded-xl shadow-lg overflow-hidden">
          {/* Header Section - UnifiedJobDetail style */}
          <div className="bg-gradient-to-r from-[#143694]/5 to-[#1e4ed8]/5 px-6 py-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mt-2">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center flex-shrink-0 mr-4">
                  {organizationLogo && !imageError ? (
                    <img
                      src={organizationLogo}
                      alt={organizationName}
                      className="w-10 h-10 object-contain"
                      onError={() => setImageError(true)}
                    />
                  ) : (
                    <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                      <span className="text-sm font-semibold text-gray-700">
                        {getInitials(organizationName)}
                      </span>
                    </div>
                  )}
                </div>
                <div>
                  {/* Organization Name - Gradient text */}
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-[#143694] to-[#1e4ed8] bg-clip-text text-transparent">
                    {organizationName}
                  </h1>
                  {/* Job Role */}
                  <p className="text-xl font-semibold text-gray-800 mt-1">
                    {displayTitle}
                  </p>
                </div>
              </div>
            </div>

            {/* Location and Date */}
            <div className="flex flex-wrap items-center text-sm text-gray-600 mt-4 gap-4">
              <div className="flex items-center">
                <Calendar className="h-5 w-5 mr-1 text-[#143694]" />
                <span>
                  {hasValue(job.startDate) ? `${formatDate(job.startDate)} - ${formatDate(job.endDate)}` : 'Dates Not Specified'}
                </span>
              </div>
              <div className="flex items-center">
                <MapPin className="h-5 w-5 mr-1 text-[#143694]" />
                <span>{location_display}</span>
              </div>
            </div>

            {/* Three Action Buttons - Share, Unsave, Apply */}
            <div className="flex flex-wrap gap-2 mt-4">
              <button
                onClick={handleShare}
                className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-50 transition-all duration-200"
              >
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </button>
              
              <button
                onClick={handleUnsave}
                disabled={isSaving}
                className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-50 transition-all duration-200"
              >
                <Save className={`h-4 w-4 mr-2 ${isSaving ? 'text-[#143694]' : 'text-gray-400'}`} />
                {isSaving ? 'Removing...' : 'Unsave'}
              </button>

              {!postingIsApplied && (
                <button
                  onClick={handleApply}
                  disabled={isApplying}
                  className="inline-flex items-center justify-center px-6 py-2 bg-gradient-to-r from-[#143694] to-[#1e4ed8] text-white text-sm font-medium rounded-lg hover:shadow-lg hover:shadow-[#143694]/30 transition-all duration-200"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  {isApplying ? 'Applying...' : 'Apply'}
                </button>
              )}
            </div>

            {/* Statistics Cards - From CollegeDetailModal */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-6">
              {/* Min Package Card */}
              <div className="bg-gradient-to-r from-gray-50 to-white border border-gray-100 rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-gradient-to-br from-blue-100 to-blue-50 rounded-lg">
                    <IndianRupee className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-gray-600 mb-1">Min Package</p>
                    <p className="text-base font-bold text-[#143694] truncate">
                      {totalCTC 
                        ? `${currency} ${totalCTC.toLocaleString()}`
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
                      {job.noOfplacedStudents || 'N/A'}
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
                      {typeof job.employmentType === 'string' 
                        ? job.employmentType 
                        : Array.isArray(job.employmentType) 
                          ? job.employmentType.join(', ') 
                          : 'N/A'
                      }
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Job Type Badge - UnifiedJobDetail style */}
          <div className="px-6 py-4">
            <span className="inline-block px-4 py-2 bg-gradient-to-r from-[#143694]/10 to-[#1e4ed8]/10 text-[#143694] rounded-full text-sm font-semibold border border-[#143694]/20">
              {job.jobType || 'On-Campus'} • {job.lookingFor || 'Full Time'}
            </span>
          </div>

          {/* About This Opportunity - From CollegeDetailModal */}
          {hasValue(job.description) && (
            <div className="px-6 py-6">
              <h2 className="text-xl font-bold bg-gradient-to-r from-[#143694] to-[#1e4ed8] bg-clip-text text-transparent mb-4">
                About This Opportunity
              </h2>
              <p className="text-gray-700 whitespace-pre-wrap">
                {job.description}
              </p>
            </div>
          )}

          {/* Contact Information - From CollegeDetailModal */}
          <div className="px-6 py-6">
            <h2 className="text-xl font-bold bg-gradient-to-r from-[#143694] to-[#1e4ed8] bg-clip-text text-transparent mb-4">
              Point of Contact - Campus Placement Officer
            </h2>
            <div className="bg-gradient-to-br from-[#143694]/5 to-[#1e4ed8]/5 p-4 rounded-lg">
              <div className="flex items-start gap-4">
                <div className="p-2.5 bg-gradient-to-br from-blue-100 to-blue-50 rounded-lg flex-shrink-0 mt-1">
                  <Users className="h-5 w-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 text-base mb-1">College Placement Officer Contact:</h4>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                    <span className="font-medium text-base">{contactPerson?.name || 'Not specified'}</span>
                    <span className="text-gray-600 text-sm">({contactPerson?.designation || 'TPO'})</span>
                  </div>
                </div>
              </div>

              {/* Contact Details */}
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 mt-4">
                {contactPerson?.email && (
                  <div className="flex items-center gap-3 flex-1">
                    <div className="p-2.5 bg-gradient-to-br from-green-100 to-green-50 rounded-lg flex-shrink-0">
                      <Mail className="h-5 w-5 text-green-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-gray-600 mb-1">Email</p>
                      <a 
                        href={`mailto:${contactPerson.email}`}
                        className="font-medium text-blue-600 hover:text-blue-800 text-sm truncate block"
                      >
                        {contactPerson.email}
                      </a>
                    </div>
                  </div>
                )}

                {contactPerson?.mobile && (
                  <div className="flex items-center gap-3 flex-1">
                    <div className="p-2.5 bg-gradient-to-br from-purple-100 to-purple-50 rounded-lg flex-shrink-0">
                      <Phone className="h-5 w-5 text-[#143694]" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-gray-600 mb-1">Phone</p>
                      <a 
                        href={`tel:${contactPerson.mobile}`}
                        className="font-medium text-blue-600 hover:text-blue-800 text-sm block"
                      >
                        {contactPerson.mobile}
                      </a>
                    </div>
                  </div>
                )}

                {contactPerson?.linkedin && (
                  <div className="flex items-center gap-3 flex-1">
                    <div className="p-2.5 bg-gradient-to-br from-blue-100 to-blue-50 rounded-lg flex-shrink-0">
                      <Linkedin className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-gray-600 mb-1">LinkedIn</p>
                      <a 
                        href={contactPerson.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-blue-600 hover:text-blue-800 text-sm truncate block"
                      >
                        {contactPerson.linkedin}
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Tentative Dates - From CollegeDetailModal */}
          {proposedSchedule && (
            <div className="px-6 py-6">
              <h2 className="text-xl font-bold bg-gradient-to-r from-[#143694] to-[#1e4ed8] bg-clip-text text-transparent mb-4">
                Tentative Dates to held On-Campus
              </h2>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-[#143694]/5 to-[#1e4ed8]/5 p-4 rounded-lg">
                  <div className="text-sm font-medium text-[#143694]">Proposed Start Date</div>
                  <div className="text-lg font-semibold text-gray-900">{formatDateSafe(proposedSchedule?.startDate)}</div>
                </div>
                <div className="bg-gradient-to-br from-[#143694]/5 to-[#1e4ed8]/5 p-4 rounded-lg">
                  <div className="text-sm font-medium text-[#143694]">Proposed End Date</div>
                  <div className="text-lg font-semibold text-gray-900">{formatDateSafe(proposedSchedule?.endDate)}</div>
                </div>
                <div className="bg-gradient-to-br from-[#143694]/5 to-[#1e4ed8]/5 p-4 rounded-lg">
                  <div className="text-sm font-medium text-[#143694]">Preferred Mode</div>
                  <div className="text-lg font-semibold text-gray-900">{proposedSchedule?.preferredMode || 'N/A'}</div>
                </div>
              </div>
            </div>
          )}

          {/* Preferred Company Types - From CollegeDetailModal */}
          {hasValidData(job.companyType) && (
            <div className="px-6 py-6">
              <h2 className="text-xl font-bold bg-gradient-to-r from-[#143694] to-[#1e4ed8] bg-clip-text text-transparent mb-4">
                Preferred Company Types
              </h2>
              {renderTags(job.companyType)}
            </div>
          )}

          {/* College Student Details - From CollegeDetailModal */}
          {(roundDetails.length > 0 || studentStreams.length > 0) && (
            <div className="px-6 py-6">
              <h2 className="text-xl font-bold bg-gradient-to-r from-[#143694] to-[#1e4ed8] bg-clip-text text-transparent mb-4">
                College Student Details
              </h2>
              <div className="overflow-x-auto rounded-lg border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gradient-to-r from-[#143694]/5 to-[#1e4ed8]/5">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-[#143694] uppercase">S.No.</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-[#143694] uppercase">Branch</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-[#143694] uppercase">No. of Students</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-[#143694] uppercase">Skills</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {roundDetails.length > 0 ? (
                      roundDetails.map((round, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm text-gray-900">{index + 1}</td>
                          <td className="px-4 py-3 text-sm text-gray-700">{round.branch || 'N/A'}</td>
                          <td className="px-4 py-3 text-sm text-gray-700">{round.students || 'N/A'}</td>
                          <td className="px-4 py-3 text-sm text-gray-700">{round.skills || 'N/A'}</td>
                        </tr>
                      ))
                    ) : (
                      studentStreams.map((stream, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm text-gray-900">{index + 1}</td>
                          <td className="px-4 py-3 text-sm text-gray-700">{stream || 'N/A'}</td>
                          <td className="px-4 py-3 text-sm text-gray-700">{numberOfStudent[index] || 'N/A'}</td>
                          <td className="px-4 py-3 text-sm text-gray-700">{roundSkills[index] || (Array.isArray(job.skills) ? job.skills[index] : job.skills) || 'N/A'}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Amenities Offered - From CollegeDetailModal */}
          {hasValidData(job.amenitiesRequired) && (
            <div className="px-6 py-6">
              <h2 className="text-xl font-bold bg-gradient-to-r from-[#143694] to-[#1e4ed8] bg-clip-text text-transparent mb-4">
                Amenities Offered
              </h2>
              {renderTags(job.amenitiesRequired)}
            </div>
          )}

          {/* College Website - From CollegeDetailModal */}
          {collegeDetails?.profileAchievements?.collegeWebsite && (
            <div className="px-6 py-6">
              <h2 className="text-xl font-bold bg-gradient-to-r from-[#143694] to-[#1e4ed8] bg-clip-text text-transparent mb-4">
                College Website
              </h2>
              <a 
                href={collegeDetails.profileAchievements.collegeWebsite}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-[#143694] hover:text-[#1e4ed8]"
              >
                <Globe className="h-5 w-5 mr-2" />
                <span className="truncate">Visit College Website</span>
              </a>
            </div>
          )}

          {/* Footer Buttons - From CollegeDetailModal */}
          {/* <div className="px-6 py-6 border-t border-gray-100 bg-gradient-to-r from-[#143694]/5 to-[#1e4ed8]/5">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  onClick={() => toast.success('Message feature coming soon')}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-gray-100 to-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-300 hover:text-[#143694] transition-all duration-200 text-sm md:text-base flex-1 sm:flex-none"
                >
                  <Send size={16} className="md:size-4" />
                  <span>Message Officer</span>
                </button>

                <button 
                  onClick={() => toast.success('Alternate date feature coming soon')}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-100 to-blue-50 border border-blue-200 text-[#143694] rounded-xl hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 text-sm md:text-base flex-1 sm:flex-none"
                >
                  <Calendar size={16} className="md:size-4" />
                  <span>Alternate Date</span>
                </button>
              </div>

              {!postingIsApplied && (
                <button 
                  onClick={handleApply}
                  disabled={isApplying}
                  className="inline-flex items-center justify-center gap-2 bg-black text-white px-6 py-2.5 rounded-xl hover:bg-gray-800 transition-all duration-200 font-medium text-sm md:text-base w-full sm:w-auto mt-3 sm:mt-0"
                >
                  <CheckCircle size={16} className="md:size-4" />
                  {isApplying ? 'Applying...' : 'Accept Invitation'}
                </button>
              )}
            </div>
          </div> */}

          {/* Bottom Back Button - UnifiedJobDetail style */}
          <div className="px-6 py-6 border-t border-gray-100">
            <div className="flex justify-left">
              <button 
                onClick={handleBackToList} 
                className="inline-flex items-center px-6 py-3 bg-white text-[#143694] border border-[#143694] hover:bg-gradient-to-r hover:from-[#143694] hover:to-[#1e4ed8] hover:text-white rounded-xl transition-all duration-200"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CompanyJobDetail;