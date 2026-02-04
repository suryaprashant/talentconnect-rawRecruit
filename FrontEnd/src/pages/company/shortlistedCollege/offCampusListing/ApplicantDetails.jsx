import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { acceptCandidate, getApplicationsForJob, rejectCandidate } from '@/lib/Company_AxiosInstance';
import toast from 'react-hot-toast';
import useConversation from '@/statemanage/useConversation';
import { conversationWithCollege } from '@/lib/College_AxiosIntance';
import InterviewSchedulerPopup from '@/components/ui/ScheduleInterview';
import { 
  Calendar, 
  MapPin, 
  FileText, 
  Users, 
  ArrowUpRight, 
  User, 
  Mail, 
  Phone, 
  Link as LinkIcon, 
  Briefcase, 
  DollarSign, 
  Target, 
  ClipboardList,
  Award,
  BookOpen,
  GraduationCap,
  Building,
  Globe,
  ExternalLink,
  ChevronLeft,
  CheckCircle,
  XCircle,
  Star,
  MessageSquare,
  BriefcaseBusiness,
  Clock,
  Send,
  Download
} from 'lucide-react';
import { format, isValid } from 'date-fns';

const DetailRow = ({ icon: Icon, label, value }) => {
    if (!value || (Array.isArray(value) && value.length === 0)) return null;
    
    let displayValue = value;
    if (Array.isArray(value)) {
        displayValue = value.join(', ');
    } else if (typeof value === 'object' && value !== null) {
        displayValue = JSON.stringify(value);
    }
    
    return (
        <div className="flex items-start">
            <Icon className="w-5 h-5 mr-3 mt-1 text-gray-500 flex-shrink-0" />
            <div>
                <p className="font-semibold text-gray-800">{label}</p>
                <p className="text-gray-600">{displayValue}</p>
            </div>
        </div>
    );
};

const ApplicantDetails = ({ job,
  applications,
  loading,
  error,
  isVisited,
  onRefresh,
  onClose,
 }) => {
  const [jobId, setJobId] = useState(job._id);
  const jobType = job.jobType;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toggleScheduleInterviewPopup, setToggleScheduleInterviewPopup] = useState(false);
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  
  const navigate = useNavigate();
  const { setSelectedConversation } = useConversation();

  // Function to extract all unique applicant locations
  const getAllApplicantLocations = () => {
    if (!applications || !Array.isArray(applications) || applications.length === 0) {
      return [];
    }
    
    const locationSet = new Set();
    
    applications.forEach((app) => {
      try {
        const applicantData = app?.applicant || {};
        
        // Check multiple possible location fields
        const locationFields = [
          applicantData.locations,
          applicantData.location,
          applicantData.currentLocation,
          applicantData.currentCity,
          applicantData.city,
          applicantData.preferredLocation,
          applicantData.address
        ];
        
        locationFields.forEach(field => {
          if (field != null && field !== '') {
            // Handle arrays
            if (Array.isArray(field)) {
              field.forEach(item => {
                if (item != null && item !== '') {
                  const str = String(item).trim();
                  if (str && str !== 'null' && str !== 'undefined') {
                    locationSet.add(str);
                  }
                }
              });
            }
            // Handle strings
            else if (typeof field === 'string') {
              // Split by common separators
              field.split(/[,;|]/).forEach(part => {
                const trimmed = part.trim();
                if (trimmed && trimmed !== 'null' && trimmed !== 'undefined') {
                  locationSet.add(trimmed);
                }
              });
            }
            // Handle other types
            else {
              const str = String(field).trim();
              if (str && str !== 'null' && str !== 'undefined') {
                locationSet.add(str);
              }
            }
          }
        });
        
      } catch (err) {
        console.warn('Error processing applicant location:', err);
        // Continue with next applicant
      }
    });
    
    return Array.from(locationSet);
  };

  const acceptApplicant = async (applicationId) => {
    setIsSubmitting(true);
    try {
      const response = await acceptCandidate(applicationId, job?.jobRoles);
      if (response?.data?.success === true) {
        toast.success("Candidate Accepted!");
        onRefresh();
      } else {
        toast.error(response.response?.data?.msg || 'Failed to accept candidate');
      }
    } catch (error) {
      console.log("Error: ", error);
      toast.error('Something went wrong!');
    } finally {
      setIsSubmitting(false);
    }
  };

  const rejectApplicant = async (applicationId) => {
    setIsSubmitting(true);
    try {
      const response = await rejectCandidate(applicationId, job?.jobRoles);
      if (response?.data?.success === true) {
        toast.success("Candidate Rejected!");
        onRefresh();
      } else {
        toast.error(response.response?.data?.msg || 'Failed to reject candidate');
      }
    } catch (error) {
      console.log("Error: ", error);
      toast.error('Something went wrong!');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMessageClick = async (applicant) => {
    if (!applicant?.applicant?._id) {
      toast.error("Applicant data is missing.");
      return;
    }

    const userId = applicant.applicant._id;
    try {
      const response = await conversationWithCollege(userId);
      if (response.data) {
        const conversationUser = {
          _id: userId,
          name: applicant.applicant.name || 'Unknown Applicant',
          email: applicant.applicant.email || '',
          profileImage: applicant.applicant.profileImageUrl || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png',
          userType: 'candidate',
          fullname: applicant.applicant.name || 'Unknown Applicant'
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
    }
  };

  const handleScheduleInterview = (applicant) => {
    setSelectedApplicant(applicant);
    setToggleScheduleInterviewPopup(true);
  };

  const safeFormatDate = (dateString, formatStr = 'MMM d, yyyy') => {
    if (!dateString) return 'Not Specified';
    try {
      const date = new Date(dateString);
      return isValid(date) ? format(date, formatStr) : 'Invalid Date';
    } catch (error) {
      return 'Invalid Date';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Get all applicant locations
  const allApplicantLocations = getAllApplicantLocations();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-6">
          <button
            onClick={onClose}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ChevronLeft size={20} />
            Back to drives
          </button>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center mb-4">
              <div className="p-3 bg-blue-100 rounded-md mr-4">
                <Building className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Shortlisted Applicants for: {job?.jobRoles?.[0] || 'Job Position'}
                </h1>
                <div className="flex flex-wrap items-center gap-3 mt-2">
                  {/* <span className="inline-flex items-center text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-lg">
                    <MapPin size={14} className="mr-1.5" />
                    {Array.isArray(job?.jobLocations) ? job.jobLocations.join(', ') : job?.jobLocations || 'Location not specified'}
                  </span> */}
                  <span className="inline-flex items-center text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-lg">
                    <FileText size={14} className="mr-1.5" />
                    {job?.jobType || 'Job Type'}
                  </span>
                  <span className="inline-flex items-center text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-lg">
                    <Users size={14} className="mr-1.5" />
                    {applications.length} Shortlisted Applicant{applications.length !== 1 ? 's' : ''}
                  </span>
                  
                  {/* All Applicant Locations */}
                  {allApplicantLocations.length > 0 && (
                    <span className="inline-flex items-center text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-lg">
                      <MapPin size={14} className="mr-1.5" />
                      Applicants from: {allApplicantLocations.slice(0, 3).join(', ')}
                      {allApplicantLocations.length > 3 && ` +${allApplicantLocations.length - 3} more`}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center text-red-700">
              <XCircle className="h-5 w-5 mr-2" />
              <p>{error}</p>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="flex flex-col items-center justify-center p-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Loading applicants...</p>
          </div>
        ) : applications.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
              <Users className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No shortlisted applicants found</h3>
            <p className="text-gray-600">No applicants have been shortlisted for this position yet.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {applications.map((applicant) => {
              const applicantData = applicant?.applicant || {};
              const currentStatus = applicant?.currentStatus || 'Shortlisted';
              
              return (
                <div key={applicant._id} className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all duration-200">
                  {/* Applicant Header - REMOVED BORDER */}
                  <div className="p-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                      <div className="flex items-start gap-4 mb-4 md:mb-0">
                        <div className="w-16 h-16 bg-yellow-100 rounded-md flex items-center justify-center">
                          {applicantData?.profileImageUrl ? (
                            <img 
                              src={applicantData.profileImageUrl} 
                              alt={applicantData.name}
                              className="w-full h-full rounded-md object-cover"
                            />
                          ) : (
                            <User className="h-8 w-8 text-yellow-600" />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-3 mb-1">
                            <h2 className="text-xl font-bold text-gray-900">{applicantData.name || 'N/A'}</h2>
                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                              Shortlisted
                            </span>
                          </div>
                          <div className="flex flex-wrap items-center gap-3 mt-2">
                            <span className="inline-flex items-center text-sm text-gray-600">
                              <GraduationCap size={14} className="mr-1.5" />
                              {applicantData.degree || 'N/A'} ({applicantData.specialization || 'N/A'})
                            </span>
                            {/* <span className="inline-flex items-center text-sm text-gray-600">
                              <Briefcase size={14} className="mr-1.5" />
                              {applicantData.designation || 'Not specified'}
                            </span> */}
                            <span className="inline-flex items-center text-sm text-gray-600">
                              <MapPin size={14} className="mr-1.5" />
                              {applicantData.locations || 'Location not specified'}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Date Applied */}
                      <div className="text-sm text-gray-600">
                        Shortlisted on: {safeFormatDate(applicant?.updatedAt || applicant?.createdAt)}
                      </div>
                    </div>
                  </div>

                  {/* Applicant Details */}
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      {/* Left Column - Contact & Education */}
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-lg font-bold mb-4 text-gray-800">Contact Information</h3>
                          <div className="space-y-3 text-sm">
                            <DetailRow icon={Mail} label="Email" value={applicantData.email} />
                            <DetailRow icon={Phone} label="Phone" value={applicantData.phone} />
                          </div>
                        </div>
                        
                        <div>
                          <h3 className="text-lg font-bold mb-4 text-gray-800">Education Details</h3>
                          <div className="space-y-3 text-sm">
                            <DetailRow 
                              icon={GraduationCap} 
                              label="Degree & Specialization" 
                              value={`${applicantData.degree || 'N/A'} - ${applicantData.specialization || 'N/A'}`} 
                            />
                            <DetailRow 
                              icon={BookOpen} 
                              label="Institute" 
                              value={applicantData.institute || 'N/A'} 
                            />
                            <DetailRow 
                              icon={Calendar} 
                              label="Graduation Year" 
                              value={applicantData.graduationYear || 'N/A'} 
                            />
                            <DetailRow 
                              icon={Award} 
                              label="CGPA/Percentage" 
                              value={applicantData.cgpa || applicantData.percentage || 'N/A'} 
                            />
                          </div>
                        </div>
                      </div>

                      {/* Right Column - Professional Details & Salary */}
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-lg font-bold mb-4 text-gray-800">Professional Details</h3>
                          <div className="space-y-3 text-sm">
                            <DetailRow 
                              icon={BriefcaseBusiness} 
                              label="Current Designation" 
                              value={applicantData.designation || 'Not specified'} 
                            />
                            <DetailRow 
                              icon={Building} 
                              label="Current Company" 
                              value={applicantData.currentCompany || 'Not specified'} 
                            />
                            <DetailRow 
                              icon={Calendar} 
                              label="Total Experience" 
                              value={applicantData.totalExperience || 'N/A'} 
                            />
                          </div>
                        </div>
                        
                        <div>
                          <h3 className="text-lg font-bold mb-4 text-gray-800">Salary Information</h3>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                              <p className="text-xs text-gray-500 mb-1">Current Salary</p>
                              <p className="font-medium">
                                {applicantData.currentSalaryCurrency || 'N/A'} {applicantData.currentSalaryAmount || ''}
                              </p>
                            </div>
                            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                              <p className="text-xs text-gray-500 mb-1">Expected Salary</p>
                              <p className="font-medium">
                                {applicantData.expectedSalaryCurrency || 'N/A'} {applicantData.expectedSalaryAmount || ''}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Skills Section */}
                    <div className="mb-6">
                      <h3 className="text-lg font-bold mb-4 text-gray-800">Skills</h3>
                      <div className="flex flex-wrap gap-2">
                        {applicantData.skills?.slice(0, 8).map((skill, index) => (
                          <span 
                            key={index} 
                            className="px-3 py-1.5 text-xs bg-gray-100 border border-gray-300 text-gray-700 rounded-lg"
                          >
                            {skill}
                          </span>
                        ))}
                        {(!applicantData.skills || applicantData.skills.length === 0) && (
                          <span className="text-gray-500 text-sm">No skills listed</span>
                        )}
                      </div>
                    </div>

                    {/* Links Section */}
                    <div className="mb-6">
                      <h3 className="text-lg font-bold mb-4 text-gray-800">Professional Links</h3>
                      <div className="flex flex-wrap gap-3">
                        {applicantData.linkedIn && (
                          <a 
                            href={applicantData.linkedIn} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-3 py-2 bg-blue-100 border border-blue-200 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors duration-200"
                          >
                            <Globe size={14} />
                            <span className="text-sm">LinkedIn</span>
                            <ExternalLink size={12} />
                          </a>
                        )}
                        {applicantData.github && (
                          <a 
                            href={applicantData.github} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-3 py-2 bg-gray-100 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                          >
                            <Globe size={14} />
                            <span className="text-sm">GitHub</span>
                            <ExternalLink size={12} />
                          </a>
                        )}
                        {applicantData.portfolio && (
                          <a 
                            href={applicantData.portfolio} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-3 py-2 bg-purple-100 border border-purple-200 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors duration-200"
                          >
                            <LinkIcon size={14} />
                            <span className="text-sm">Portfolio</span>
                            <ExternalLink size={12} />
                          </a>
                        )}
                        {applicantData.cv && (
                          <a 
                            href={applicantData.cv} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-3 py-2 bg-gray-100 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                          >
                            <Download size={14} />
                            <span className="text-sm">View CV</span>
                            <ExternalLink size={12} />
                          </a>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons - REMOVED BORDER */}
                    <div className="flex flex-col sm:flex-row gap-4">
                      <button
                        onClick={() => handleMessageClick(applicant)}
                        disabled={isSubmitting}
                        className="flex items-center justify-center flex-1 py-2.5 font-medium bg-white border border-gray-300 text-blue-600 rounded-lg hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50"
                      >
                        <MessageSquare size={16} className="mr-2" />
                        Message Candidate
                      </button>
                      
                      <button
                        onClick={() => handleScheduleInterview(applicant)}
                        disabled={isSubmitting}
                        className="flex items-center justify-center flex-1 py-2.5 font-medium bg-white border border-gray-300 text-blue-600 rounded-lg hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50"
                      >
                        <Calendar size={16} className="mr-2" />
                        Schedule Interview
                      </button>
                      
                      <button
                        onClick={() => acceptApplicant(applicant._id)}
                        disabled={isSubmitting || currentStatus === 'Accepted'}
                        className={`flex items-center justify-center flex-1 py-2.5 font-medium rounded-lg transition-colors duration-200 ${
                          currentStatus === 'Accepted'
                            ? 'bg-green-100 text-green-700 cursor-not-allowed'
                            : 'bg-white border border-gray-300 text-green-600 hover:bg-gray-50'
                        } disabled:opacity-50`}
                      >
                        <CheckCircle size={16} className="mr-2" />
                        {currentStatus === 'Accepted' ? 'Already Accepted' : (isSubmitting ? 'Processing...' : 'Accept Candidate')}
                      </button>
                      
                      <button
                        onClick={() => rejectApplicant(applicant._id)}
                        disabled={isSubmitting || currentStatus === 'Rejected'}
                        className={`flex items-center justify-center flex-1 py-2.5 font-medium rounded-lg transition-colors duration-200 ${
                          currentStatus === 'Rejected'
                            ? 'bg-red-100 text-red-700 cursor-not-allowed'
                            : 'bg-white border border-gray-300 text-red-600 hover:bg-gray-50'
                        } disabled:opacity-50`}
                      >
                        <XCircle size={16} className="mr-2" />
                        {currentStatus === 'Rejected' ? 'Already Rejected' : (isSubmitting ? 'Processing...' : 'Reject Candidate')}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Interview Scheduler Popup */}
      {toggleScheduleInterviewPopup && selectedApplicant && job && (
        <InterviewSchedulerPopup
          setToggleScheduleInterviewPopup={setToggleScheduleInterviewPopup}
          application={selectedApplicant}
          job={job}
        />
      )}

    </div>
  );
};

export default ApplicantDetails;