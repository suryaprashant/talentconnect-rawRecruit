import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { acceptCandidate, getApplicationsForJob, rejectCandidate } from '@/lib/Company_AxiosInstance';
import toast from 'react-hot-toast';
import useConversation from '@/statemanage/useConversation';
import { conversationWithCollege } from '@/lib/College_AxiosIntance';
import InterviewSchedulerPopup from '@/components/ui/ScheduleInterview';
import { 
  Send, 
  Linkedin, 
  Github, 
  Link, 
  FileText, 
  Calendar, 
  MapPin, 
  ArrowLeft, 
  Mail, 
  Phone, 
  Briefcase, 
  GraduationCap, 
  User,
  Building2,
  Users,
  AlertCircle,
  ChevronLeft,
  FileCheck,
  CheckCircle,
  XCircle,
  MessageSquare,
  ExternalLink,
  Clock
} from 'lucide-react';

const ApplicantDetails = ({ job, isVisited, onClose, onAccept, onShortlist, onReject }) => {
  const [jobId, setJobId] = useState(job._id);
  const jobType = job.jobType;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [applications, setApplications] = useState([]);
  const [toggleScheduleInterviewPopup, setToggleScheduleInterviewPopup] = useState(false);
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const { setSelectedConversation } = useConversation();

  const getApplicants = async (jobId, jobType, isVisited) => {
    setLoading(true);
    setError(null);
    try {
      let response;
      if (isVisited === false) {
        response = await getApplicationsForJob(jobId, jobType, "Shortlisted", isVisited);
      } else {
        response = await getApplicationsForJob(jobId, jobType, "Shortlisted");
      }
      setApplications(response.data || []);
    } catch (error) {
      console.log("Error: ", error);
      setError('Failed to load applicants');
      toast.error('Failed to load applicants');
    } finally {
      setLoading(false);
    }
  };

  const acceptApplicant = async (applicationId) => {
    try {
      const response = await acceptCandidate(applicationId, job?.jobRoles);
      if (response?.data?.success === true) {
        toast.success("Candidate Accepted!");
        getApplicants(jobId, jobType, isVisited);
      } else {
        toast.error(response.response?.data?.msg || 'Failed to accept candidate');
      }
    } catch (error) {
      console.log("Error: ", error);
      toast.error('Something went wrong!');
    }
  };

  const rejectApplicant = async (applicationId) => {
    try {
      const response = await rejectCandidate(applicationId, job?.jobRoles);
      if (response?.data?.success === true) {
        toast.success("Candidate Rejected!");
        getApplicants(jobId, jobType, isVisited);
      } else {
        toast.error(response.response?.data?.msg || 'Failed to reject candidate');
      }
    } catch (error) {
      console.log("Error: ", error);
      toast.error('Something went wrong!');
    }
  };

  useEffect(() => {
    if (isVisited === false) {
      getApplicants(jobId, jobType, false);
    } else {
      getApplicants(jobId, jobType);
    }
  }, [jobId]);

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

  // Calculate statistics
  const acceptedCount = applications.filter(app => app.status === 'Accepted').length;
  const rejectedCount = applications.filter(app => app.status === 'Rejected').length;
  const pendingCount = applications.filter(app => !app.status || app.status === 'Applied' || app.status === 'Shortlisted').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#667eea]/10 via-[#f093fb]/5 to-[#764ba2]/10">
      <div className="container mx-auto px-4 py-8 pt-22">
        {/* Main Container */}
        <div className="bg-white/90 backdrop-blur-sm border border-gray-100 rounded-2xl shadow-lg p-6">
          {/* Back Button */}
          <button
            onClick={onClose}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 group"
          >
            <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            Back to drives
          </button>

          {/* Job Header Section */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-gradient-to-br from-[#667eea]/20 to-[#764ba2]/20 rounded-xl">
                <Building2 className="h-6 w-6 text-[#667eea]" />
              </div>
              <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent">
                  Applicants for: {job?.jobRoles[0] || 'Job Position'}
                </h2>
                <div className="flex flex-wrap items-center gap-3 mt-2">
                  <span className="inline-flex items-center text-sm text-gray-600 bg-gradient-to-r from-gray-50 to-white px-3 py-1.5 rounded-lg">
                    <MapPin className="h-3 w-3 mr-1.5" />
                    {Array.isArray(job?.jobLocations) ? job.jobLocations.join(', ') : job?.jobLocations || 'Location not specified'}
                  </span>
                  <span className="inline-flex items-center text-sm text-gray-600 bg-gradient-to-r from-gray-50 to-white px-3 py-1.5 rounded-lg">
                    <FileText className="h-3 w-3 mr-1.5" />
                    {job?.jobType || 'Job Type'}
                  </span>
                  <span className="inline-flex items-center text-sm text-gray-600 bg-gradient-to-r from-gray-50 to-white px-3 py-1.5 rounded-lg">
                    <Users className="h-3 w-3 mr-1.5" />
                    {applications.length} Applicant{applications.length !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="bg-gradient-to-r from-red-50 to-white border border-red-200 rounded-xl p-4 mb-6">
              <div className="flex items-start">
                <AlertCircle className="h-5 w-5 text-red-600 mr-3 mt-0.5" />
                <div>
                  <h3 className="text-sm font-medium text-red-800">Error</h3>
                  <p className="text-sm text-red-700 mt-1">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Loading State */}
          {loading ? (
            <div className="flex flex-col items-center justify-center p-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#667eea]"></div>
              <p className="mt-4 text-gray-600">Loading applicants...</p>
            </div>
          ) : applications.length === 0 ? (
            <div className="bg-gradient-to-r from-gray-50 to-white border border-gray-200 rounded-xl p-12 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-gray-100 to-gray-200 mb-4">
                <Users className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No applicants found</h3>
              <p className="text-gray-600">No applicants have applied for this position yet.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {applications.map((applicant) => (
                <div key={applicant._id} className="bg-gradient-to-r from-gray-50 to-white border border-gray-100 rounded-xl p-6 hover:shadow-lg transition-all duration-200">
                  {/* Applicant Header */}
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                    <div className="flex items-start gap-4 mb-4 md:mb-0">
                      <div className="w-16 h-16 bg-gradient-to-br from-[#667eea]/20 to-[#764ba2]/20 rounded-xl flex items-center justify-center">
                        {applicant?.applicant?.profileImageUrl ? (
                          <img 
                            src={applicant.applicant.profileImageUrl} 
                            alt={applicant.applicant.name}
                            className="w-full h-full rounded-xl object-cover"
                          />
                        ) : (
                          <User className="h-8 w-8 text-[#667eea]" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="text-xl font-bold text-gray-900">{applicant?.applicant.name}</h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            applicant?.status === 'Accepted' 
                              ? 'bg-gradient-to-r from-green-100 to-green-50 text-green-700 border border-green-200'
                              : applicant?.status === 'Rejected'
                              ? 'bg-gradient-to-r from-red-100 to-red-50 text-red-700 border border-red-200'
                              : 'bg-gradient-to-r from-blue-100 to-blue-50 text-blue-700 border border-blue-200'
                          }`}>
                            {applicant?.status || 'Applied'}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-3 mt-2">
                          <span className="inline-flex items-center text-sm text-gray-600">
                            <GraduationCap className="h-3 w-3 mr-1.5" />
                            {applicant?.applicant.degree} ({applicant?.applicant.specialization})
                          </span>
                          <span className="inline-flex items-center text-sm text-gray-600">
                            <Briefcase className="h-3 w-3 mr-1.5" />
                            {applicant?.applicant.designation || 'Not specified'}
                          </span>
                          <span className="inline-flex items-center text-sm text-gray-600">
                            <MapPin className="h-3 w-3 mr-1.5" />
                            {applicant?.applicant.locations || 'Location not specified'}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Status Badge */}
                    <div className="flex flex-col items-end gap-2">
                      <div className="text-sm text-gray-600">Applied on: {new Date(applicant?.createdAt).toLocaleDateString()}</div>
                    </div>
                  </div>

                  {/* Applicant Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    {/* Left Column - Contact & Professional Info */}
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-semibold text-gray-700 mb-2">Contact Information</h4>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Mail className="h-4 w-4" />
                            <span>{applicant?.applicant.email}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Phone className="h-4 w-4" />
                            <span>{applicant?.applicant.phone || 'Not provided'}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-semibold text-gray-700 mb-2">Salary Information</h4>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="bg-gradient-to-r from-gray-50 to-white border border-gray-200 rounded-lg p-3">
                            <p className="text-xs text-gray-500">Current</p>
                            <p className="font-medium">
                              {applicant?.applicant.currentSalaryCurrency || 'N/A'} {applicant?.applicant.currentSalaryAmount || ''}
                            </p>
                          </div>
                          <div className="bg-gradient-to-r from-gray-50 to-white border border-gray-200 rounded-lg p-3">
                            <p className="text-xs text-gray-500">Expected</p>
                            <p className="font-medium">
                              {applicant?.applicant.expectedSalaryCurrency || 'N/A'} {applicant?.applicant.expectedSalaryAmount || ''}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right Column - Skills & Links */}
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-semibold text-gray-700 mb-2">Skills</h4>
                        <div className="flex flex-wrap gap-2">
                          {applicant?.applicant.skills?.slice(0, 8).map((skill, index) => (
                            <span 
                              key={index} 
                              className="px-3 py-1.5 text-xs bg-gradient-to-r from-gray-100 to-white border border-gray-200 text-gray-700 rounded-lg hover:from-[#667eea]/10 hover:to-[#764ba2]/10 hover:border-[#667eea]/30 transition-all duration-200"
                            >
                              {skill}
                            </span>
                          ))}
                          {(!applicant?.applicant.skills || applicant.applicant.skills.length === 0) && (
                            <span className="text-gray-500 text-sm">No skills listed</span>
                          )}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-semibold text-gray-700 mb-2">Links</h4>
                        <div className="flex flex-wrap gap-2">
                          {applicant?.applicant.linkedIn && (
                            <a 
                              href={applicant.applicant.linkedIn} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 px-3 py-2 bg-gradient-to-r from-blue-100 to-blue-50 border border-blue-200 text-blue-700 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-all duration-200"
                            >
                              <Linkedin size={14} />
                              <span className="text-sm">LinkedIn</span>
                            </a>
                          )}
                          {applicant?.applicant.github && (
                            <a 
                              href={applicant.applicant.github} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 px-3 py-2 bg-gradient-to-r from-gray-100 to-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all duration-200"
                            >
                              <Github size={14} />
                              <span className="text-sm">GitHub</span>
                            </a>
                          )}
                          {applicant?.applicant.portfolio && (
                            <a 
                              href={applicant.applicant.portfolio} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 px-3 py-2 bg-gradient-to-r from-purple-100 to-purple-50 border border-purple-200 text-purple-700 rounded-lg hover:bg-purple-50 hover:border-purple-300 transition-all duration-200"
                            >
                              <Link size={14} />
                              <span className="text-sm">Portfolio</span>
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-3 pt-6 border-t border-gray-200">
                    <button
                      onClick={() => handleMessageClick(applicant)}
                      disabled={isSubmitting}
                      className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-gray-100 to-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-300 hover:text-[#667eea] transition-all duration-200 disabled:opacity-50"
                    >
                      <MessageSquare size={16} />
                      Message
                    </button>
                    
                    <button
                      onClick={() => handleScheduleInterview(applicant)}
                      disabled={isSubmitting || applicant?.status === 'Accepted'}
                      className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-100 to-blue-50 border border-blue-200 text-blue-700 rounded-xl hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 disabled:opacity-50"
                    >
                      <Calendar size={16} />
                      Schedule Interview
                    </button>
                    
                    <button
                      onClick={() => acceptApplicant(applicant?._id)}
                      disabled={isSubmitting || applicant?.status === 'Accepted'}
                      className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all duration-200 disabled:opacity-50 ${
                        applicant?.status === 'Accepted'
                          ? 'bg-gradient-to-r from-green-100 to-green-50 border border-green-200 text-green-700 cursor-not-allowed'
                          : 'bg-gradient-to-r from-green-100 to-green-50 border border-green-200 text-green-700 hover:bg-green-50 hover:border-green-300'
                      }`}
                    >
                      <CheckCircle size={16} />
                      Accept Candidate
                    </button>
                    
                    <button
                      onClick={() => rejectApplicant(applicant._id)}
                      disabled={isSubmitting || applicant?.status === 'Rejected'}
                      className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all duration-200 disabled:opacity-50 ${
                        applicant?.status === 'Rejected'
                          ? 'bg-gradient-to-r from-red-100 to-red-50 border border-red-200 text-red-700 cursor-not-allowed'
                          : 'bg-gradient-to-r from-red-100 to-red-50 border border-red-200 text-red-700 hover:bg-red-50 hover:border-red-300'
                      }`}
                    >
                      <XCircle size={16} />
                      Reject Application
                    </button>
                    
                    <button
                      onClick={() => window.open(applicant?.applicant?.cv, '_blank')}
                      disabled={!applicant?.applicant?.cv}
                      className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-gray-100 to-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-300 hover:text-[#667eea] transition-all duration-200 disabled:opacity-50"
                    >
                      <ExternalLink size={16} />
                      View CV
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Interview Scheduler Popup */}
        {toggleScheduleInterviewPopup && selectedApplicant && (
          <InterviewSchedulerPopup
            setToggleScheduleInterviewPopup={setToggleScheduleInterviewPopup}
            applicantId={selectedApplicant.applicant._id}
            applicantType={selectedApplicant.applicant.profileType}
            jobRole={job?.jobRoles[0]}
            applicantName={selectedApplicant.applicant.name}
          />
        )}
      </div>
    </div>
  );
};

export default ApplicantDetails;