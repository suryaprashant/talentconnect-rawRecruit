{/*import { useEffect, useState } from 'react';
import { acceptCandidate, getApplicationsForJob, rejectCandidate } from '@/lib/Company_AxiosInstance';
import toast from 'react-hot-toast';
import useConversation from '@/statemanage/useConversation';
import { useNavigate } from 'react-router-dom';
import { 
  Send, User, Mail, Phone, Link, Briefcase, DollarSign, 
  Calendar, MapPin, Target, FileText, Building2, Globe, 
  ArrowUpRight, ClipboardList, Users, Award, ChevronLeft,
  Github, Linkedin, ExternalLink, X, Clock, CheckCircle, XCircle,
  MessageSquare
} from 'lucide-react';
import InterviewSchedulerPopup from '@/components/ui/ScheduleInterview';

const EmployerInternshipDetails = ({ job, onClose }) => {
  const jobId = job._id;
  const jobType = job.jobType;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [toggleScheduleInterviewPopup, setToggleScheduleInterviewPopup] = useState(false);
  const [selectedApplicantForInterview, setSelectedApplicantForInterview] = useState(null);
  const [applications, setApplications] = useState([]);
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [showApplicantModal, setShowApplicantModal] = useState(false);

  const navigate = useNavigate();
  const { setSelectedConversation } = useConversation();

  const getApplicants = async (jobId, jobType) => {
    setIsSubmitting(true);
    try {
      const response = await getApplicationsForJob(jobId, jobType, "Shortlisted");
      setApplications(response.data);
    } catch (error) {
      console.log("Error: ", error);
      toast.error('Failed to load shortlisted applicants');
    }
    setIsSubmitting(false);
  };

  const handleAction = async (actionCallback, applicantId, actionName) => {
    setIsSubmitting(true);
    try {
      await actionCallback(applicantId);
      // Refresh applications after action
      getApplicants(jobId, jobType);
    } catch (error) {
      console.log("Action error: ", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const acceptApplicant = async (applicationId) => {
    try {
      const response = await acceptCandidate(applicationId, job?.jobTitle);
      if (response?.data?.success === true) {
        toast.success("Candidate Accepted!");
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
      const response = await rejectCandidate(applicationId, job?.jobTitle);
      if (response?.data?.success === true) {
        toast.success("Candidate Rejected!");
      } else {
        toast.error(response.response?.data?.msg || 'Failed to reject candidate');
      }
    } catch (error) {
      console.log("Error: ", error);
      toast.error('Something went wrong!');
    }
  };

  useEffect(() => {
    getApplicants(jobId, jobType);
  }, [jobId, jobType]);

  const handleMessageClick = async (applicant) => {
    if (!applicant?.applicant?._id) {
      toast.error("Applicant data is missing.");
      return;
    }

    setIsProcessing(true);
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
    } finally {
      setIsProcessing(false);
    }
  };

  const handleViewApplicantDetails = (applicant) => {
    setSelectedApplicant(applicant);
    setShowApplicantModal(true);
  };

  const handleScheduleInterview = (applicant) => {
    setSelectedApplicant(applicant);
    setToggleScheduleInterviewPopup(true);
  };

  const ApplicantDetailsModal = () => {
    if (!selectedApplicant) return null;
    
    const applicant = selectedApplicant.applicant;
    const currentStatus = selectedApplicant.currentStatus || 'Shortlisted';
    
    return (
      <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            {/* Header *
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center">
                {applicant.profileImageUrl ? (
                  <img 
                    src={applicant.profileImageUrl} 
                    alt={applicant.name}
                    className="w-20 h-20 rounded-full object-cover mr-4"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center text-gray-600 text-lg mr-4">
                    {applicant.name?.charAt(0) || 'U'}
                  </div>
                )}
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{applicant.name}</h2>
                  <p className="text-gray-600 text-sm mt-1">
                    {applicant.degree} ({applicant.specialization})
                  </p>
                  <div className="flex items-center text-gray-500 text-sm mt-1">
                    <MapPin size={14} className="mr-1" />
                    <span>{applicant.locations || 'Location not specified'}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setShowApplicantModal(false)}
                className="text-gray-500 hover:text-gray-700 text-xl p-1"
              >
                <X size={24} />
              </button>
            </div>

            {/* Status Badge *
            <div className="mb-6">
              <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${
                currentStatus === 'Accepted' 
                  ? 'bg-gradient-to-r from-green-100 to-green-50 text-green-700 border border-green-200' 
                  : currentStatus === 'Shortlisted'
                  ? 'bg-gradient-to-r from-yellow-100 to-yellow-50 text-yellow-700 border border-yellow-200'
                  : currentStatus === 'Rejected'
                  ? 'bg-gradient-to-r from-red-100 to-red-50 text-red-700 border border-red-200'
                  : 'bg-gradient-to-r from-blue-100 to-blue-50 text-blue-700 border border-blue-200'
              }`}>
                {currentStatus === 'Shortlisted' && <CheckCircle size={16} className="mr-2" />}
                Status: {currentStatus}
              </span>
            </div>

            {/* Salary Information *
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
                <div className="flex items-center mb-2">
                  <DollarSign className="w-5 h-5 mr-2 text-blue-600" />
                  <h3 className="font-semibold text-gray-800">Current Salary</h3>
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {applicant.currentSalaryCurrency || 'N/A'} {applicant.currentSalaryAmount || '0'}
                </p>
              </div>
              <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl">
                <div className="flex items-center mb-2">
                  <DollarSign className="w-5 h-5 mr-2 text-green-600" />
                  <h3 className="font-semibold text-gray-800">Expected Salary</h3>
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {applicant.expectedSalaryCurrency || 'N/A'} {applicant.expectedSalaryAmount || '0'}
                </p>
              </div>
            </div>

            {/* Contact Information *
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="text-lg font-bold mb-4 text-gray-800">Contact Information</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center">
                    <Mail size={16} className="mr-2 text-gray-500 flex-shrink-0" />
                    <a href={`mailto:${applicant.email}`} className="text-blue-600 hover:underline">
                      {applicant.email || 'Not specified'}
                    </a>
                  </div>
                  <div className="flex items-center">
                    <Phone size={16} className="mr-2 text-gray-500 flex-shrink-0" />
                    <span>{applicant.phone || 'Not specified'}</span>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-bold mb-4 text-gray-800">Professional Details</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center">
                    <Briefcase size={16} className="mr-2 text-gray-500 flex-shrink-0" />
                    <span>Industry: {applicant.industry || 'Not specified'}</span>
                  </div>
                  <div className="flex items-center">
                    <ClipboardList size={16} className="mr-2 text-gray-500 flex-shrink-0" />
                    <span>Designation: {applicant.designation || 'Not specified'}</span>
                  </div>
                  <div className="flex items-center">
                    <Award size={16} className="mr-2 text-gray-500 flex-shrink-0" />
                    <span>Language: {applicant.language || 'Not specified'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Links Section *
            <div className="mb-6">
              <h3 className="text-lg font-bold mb-4 text-gray-800">Professional Links</h3>
              <div className="flex flex-wrap gap-3">
                {applicant.linkedIn && (
                  <a 
                    href={applicant.linkedIn.startsWith('http') ? applicant.linkedIn : `https://${applicant.linkedIn}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    <Linkedin size={16} className="mr-2" />
                    LinkedIn
                    <ExternalLink size={14} className="ml-1" />
                  </a>
                )}
                {applicant.github && (
                  <a 
                    href={applicant.github.startsWith('http') ? applicant.github : `https://${applicant.github}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <Github size={16} className="mr-2" />
                    GitHub
                    <ExternalLink size={14} className="ml-1" />
                  </a>
                )}
                {applicant.portfolio && (
                  <a 
                    href={applicant.portfolio.startsWith('http') ? applicant.portfolio : `https://${applicant.portfolio}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors"
                  >
                    <Link size={16} className="mr-2" />
                    Portfolio
                    <ExternalLink size={14} className="ml-1" />
                  </a>
                )}
                {applicant.cv && (
                  <a 
                    href={applicant.cv}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors"
                  >
                    <FileText size={16} className="mr-2" />
                    View CV
                    <ExternalLink size={14} className="ml-1" />
                  </a>
                )}
              </div>
            </div>

            {/* Skills Section *
            <div className="mb-6">
              <h3 className="text-lg font-bold mb-4 text-gray-800">Skills</h3>
              <div className="flex flex-wrap gap-2">
                {applicant.skills?.map((skill, index) => (
                  <span 
                    key={index} 
                    className="px-3 py-1.5 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 rounded-full text-sm font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Action Buttons *
            <div className="flex flex-col sm:flex-row gap-4 mt-8 pt-6 border-t border-gray-200">
              <button 
                onClick={() => handleMessageClick(selectedApplicant)}
                disabled={isProcessing}
                className="flex items-center justify-center flex-1 py-3 bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 text-blue-600 rounded-xl hover:bg-blue-100 transition-all duration-200 disabled:opacity-50"
              >
                <Send size={18} className="mr-2" />
                {isProcessing ? 'Processing...' : 'Message Candidate'}
              </button>
              <button 
                onClick={() => handleScheduleInterview(selectedApplicant)}
                className="flex items-center justify-center flex-1 py-3 bg-gradient-to-r from-yellow-50 to-yellow-100 border border-yellow-200 text-yellow-600 rounded-xl hover:bg-yellow-100 transition-all duration-200"
              >
                <Clock size={18} className="mr-2" />
                Schedule Interview
              </button>
              <button 
                onClick={() => handleAction(() => acceptApplicant(selectedApplicant._id), selectedApplicant._id, 'accept')}
                disabled={isSubmitting || currentStatus === 'Accepted'}
                className={`flex items-center justify-center flex-1 py-3 rounded-xl transition-all duration-200 ${
                  currentStatus === 'Accepted'
                    ? 'bg-gradient-to-r from-green-100 to-green-200 text-green-700 border border-green-300 cursor-not-allowed'
                    : 'bg-gradient-to-r from-green-50 to-green-100 border border-green-200 text-green-600 hover:bg-green-100'
                } disabled:opacity-50`}
              >
                <CheckCircle size={18} className="mr-2" />
                {currentStatus === 'Accepted' ? 'Already Accepted' : 'Accept Application'}
              </button>
              <button 
                onClick={() => handleAction(() => rejectApplicant(selectedApplicant._id), selectedApplicant._id, 'reject')}
                disabled={isSubmitting || currentStatus === 'Rejected'}
                className={`flex items-center justify-center flex-1 py-3 rounded-xl transition-all duration-200 ${
                  currentStatus === 'Rejected'
                    ? 'bg-gradient-to-r from-red-100 to-red-200 text-red-700 border border-red-300 cursor-not-allowed'
                    : 'bg-gradient-to-r from-red-50 to-red-100 border border-red-200 text-red-600 hover:bg-red-100'
                } disabled:opacity-50`}
              >
                <XCircle size={18} className="mr-2" />
                {currentStatus === 'Rejected' ? 'Already Rejected' : 'Reject Application'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#667eea]/10 via-[#f093fb]/5 to-[#764ba2]/10">
      <div className="container mx-auto px-4 py-8 pt-20">
        <div className="bg-white/90 backdrop-blur-sm border border-gray-100 rounded-2xl shadow-lg p-6">
          {/* Header *
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center">
              <button
                onClick={onClose}
                className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mr-4 group"
              >
                <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                Back
              </button>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent">
                  Shortlisted Internship Applicants
                </h1>
                <p className="text-gray-600 mt-1">
                  Manage shortlisted candidates for: {job?.jobTitle}
                </p>
              </div>
            </div>
            <div className="text-sm text-gray-500">
              {applications.length} shortlisted candidate{applications.length !== 1 ? 's' : ''}
            </div>
          </div>

          {/* Applicants List *
          {isSubmitting && applications.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#667eea]"></div>
              <p className="mt-4 text-gray-600">Loading shortlisted applicants...</p>
            </div>
          ) : applications.length === 0 ? (
            <div className="bg-gradient-to-r from-gray-50 to-white border border-gray-200 rounded-xl p-12 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-gray-100 to-gray-200 mb-4">
                <Users className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No shortlisted applicants</h3>
              <p className="text-gray-600">No candidates have been shortlisted for this internship yet.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {applications.map((application) => {
                const applicant = application.applicant;
                const currentStatus = application.currentStatus || 'Shortlisted';
                
                return (
                  <div key={application._id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      {/* Applicant Info *
                      <div className="flex items-center flex-1">
                        <div 
                          className="cursor-pointer"
                          onClick={() => handleViewApplicantDetails(application)}
                        >
                          {applicant.profileImageUrl ? (
                            <img 
                              src={applicant.profileImageUrl} 
                              alt={applicant.name}
                              className="w-16 h-16 rounded-full object-cover mr-4 hover:opacity-90 transition-opacity"
                            />
                          ) : (
                            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center text-gray-600 text-lg mr-4 hover:bg-gray-300 transition-colors">
                              {applicant.name?.charAt(0) || 'U'}
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <div 
                            className="cursor-pointer hover:text-[#667eea] transition-colors"
                            onClick={() => handleViewApplicantDetails(application)}
                          >
                            <h3 className="font-semibold text-gray-900 text-lg">{applicant.name}</h3>
                            <div className="flex items-center text-gray-600 text-sm mt-1">
                              <Briefcase size={14} className="mr-2" />
                              <span className="truncate">{applicant.degree} ({applicant.specialization})</span>
                            </div>
                          </div>
                          <div className="flex items-center text-gray-500 text-sm mt-2">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                              currentStatus === 'Shortlisted'
                                ? 'bg-gradient-to-r from-yellow-100 to-yellow-50 text-yellow-700 border border-yellow-200'
                                : currentStatus === 'Accepted'
                                ? 'bg-gradient-to-r from-green-100 to-green-50 text-green-700 border border-green-200'
                                : currentStatus === 'Rejected'
                                ? 'bg-gradient-to-r from-red-100 to-red-50 text-red-700 border border-red-200'
                                : 'bg-gradient-to-r from-blue-100 to-blue-50 text-blue-700 border border-blue-200'
                            }`}>
                              {currentStatus === 'Shortlisted' && <CheckCircle size={12} className="mr-1" />}
                              {currentStatus}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Quick Info *
                      <div className="flex flex-wrap gap-4 text-sm">
                        <div className="text-center">
                          <div className="font-semibold text-gray-800">
                            {applicant.currentSalaryCurrency || 'N/A'} {applicant.currentSalaryAmount || '0'}
                          </div>
                          <div className="text-xs text-gray-500">Current</div>
                        </div>
                        <div className="text-center">
                          <div className="font-semibold text-gray-800">
                            {applicant.expectedSalaryCurrency || 'N/A'} {applicant.expectedSalaryAmount || '0'}
                          </div>
                          <div className="text-xs text-gray-500">Expected</div>
                        </div>
                        <div className="text-center">
                          <div className="font-semibold text-gray-800">
                            {applicant.locations || 'N/A'}
                          </div>
                          <div className="text-xs text-gray-500">Location</div>
                        </div>
                      </div>

                      {/* Action Buttons *
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleViewApplicantDetails(application)}
                          className="p-2 bg-gradient-to-r from-gray-100 to-white border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 hover:text-[#667eea] hover:border-[#667eea]/50 transition-all duration-200"
                          title="View Details"
                        >
                          <User size={16} />
                        </button>
                        <button
                          onClick={() => handleMessageClick(application)}
                          disabled={isProcessing}
                          className="p-2 bg-gradient-to-r from-blue-100 to-blue-50 border border-blue-200 text-blue-600 rounded-lg hover:bg-blue-100 hover:text-blue-700 transition-all duration-200 disabled:opacity-50"
                          title="Message"
                        >
                          <Send size={16} />
                        </button>
                        <button
                          onClick={() => handleScheduleInterview(application)}
                          className="p-2 bg-gradient-to-r from-yellow-100 to-yellow-50 border border-yellow-200 text-yellow-600 rounded-lg hover:bg-yellow-100 hover:text-yellow-700 transition-all duration-200"
                          title="Schedule Interview"
                        >
                          <Clock size={16} />
                        </button>
                        {currentStatus !== 'Accepted' && (
                          <button
                            onClick={() => handleAction(() => acceptApplicant(application._id), application._id, 'accept')}
                            disabled={isSubmitting}
                            className="px-4 py-2 bg-gradient-to-r from-green-100 to-green-50 border border-green-200 text-green-700 rounded-lg hover:bg-green-100 hover:text-green-800 transition-all duration-200 disabled:opacity-50"
                          >
                            Accept
                          </button>
                        )}
                        {currentStatus !== 'Rejected' && (
                          <button
                            onClick={() => handleAction(() => rejectApplicant(application._id), application._id, 'reject')}
                            disabled={isSubmitting}
                            className="px-4 py-2 bg-gradient-to-r from-red-100 to-red-50 border border-red-200 text-red-700 rounded-lg hover:bg-red-100 hover:text-red-800 transition-all duration-200 disabled:opacity-50"
                          >
                            Reject
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Skills Preview *
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <div className="flex flex-wrap gap-2">
                        {applicant.skills?.slice(0, 5).map((skill, index) => (
                          <span 
                            key={index} 
                            className="px-3 py-1 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 rounded-full text-xs font-medium"
                          >
                            {skill}
                          </span>
                        ))}
                        {applicant.skills?.length > 5 && (
                          <span className="px-3 py-1 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-500 rounded-full text-xs font-medium">
                            +{applicant.skills.length - 5} more
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
      
      {/* Applicant Details Modal *
      {showApplicantModal && <ApplicantDetailsModal />}
      
      {/* Interview Scheduler Popup */}
      {/*{toggleScheduleInterviewPopup && selectedApplicant && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full">
            <button
              onClick={() => setToggleScheduleInterviewPopup(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-xl p-1"
            >
              <X size={24} />
            </button>
            <InterviewSchedulerPopup
              setToggleScheduleInterviewPopup={setToggleScheduleInterviewPopup}
              applicantId={selectedApplicant.applicant._id}
              applicantType={selectedApplicant.applicant.profileType}
              jobRole={job?.jobTitle}
            />
          </div>
        </div>
      )}*
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

export default EmployerInternshipDetails;*/}

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
  Code,
  Send,
  Download,
  Eye,
  X,
  Maximize2,
  CalendarClock
} from 'lucide-react';
import { format, isValid } from 'date-fns';

// ==================== DetailRow Component ====================
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

// ==================== Main Component ====================
const InternshipDetails = ({ job, onClose }) => {
  const [jobId, setJobId] = useState(job._id);
  const jobType = job.jobType;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toggleScheduleInterviewPopup, setToggleScheduleInterviewPopup] = useState(false);
  const [selectedApplicantForInterview, setSelectedApplicantForInterview] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const navigate = useNavigate();
  const { setSelectedConversation } = useConversation();

  const getApplicants = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getApplicationsForJob(jobId, jobType, "Shortlisted");
      setApplications(response.data || []);
    } catch (error) {
      console.log("Error: ", error);
      setError('Failed to load shortlisted applicants');
    } finally {
      setLoading(false);
      setIsSubmitting(false);
    }
  };

  const refreshList = () => getApplicants();

  const acceptApplicant = async (applicationId) => {
    setIsSubmitting(true);
    try {
      const response = await acceptCandidate(applicationId, job?.jobTitle || job?.jobRoles?.[0]);
      if (response?.data?.success === true) {
        toast.success("Candidate Accepted!");
        refreshList();
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
      const response = await rejectCandidate(applicationId, job?.jobTitle || job?.jobRoles?.[0]);
      if (response?.data?.success === true) {
        toast.success("Candidate Rejected!");
        refreshList();
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

  useEffect(() => {
    if (jobId) {
      getApplicants();
    }
  }, [jobId]);

  const handleScheduleInterview = (applicant) => {
    setSelectedApplicantForInterview(applicant);
    setToggleScheduleInterviewPopup(true);
  };

  // ==================== Handle Message Click ====================
  const handleMessageClick = async (applicant) => {
    if (!applicant?.applicant?._id) {
      toast.error("Applicant data is missing.");
      return;
    }

    const userId = applicant.applicant._id;
    setIsProcessing(true);
    
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

        console.log("Setting conversation for direct chat:", conversationUser);

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
      setIsProcessing(false);
    }
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
            Back to Shortlisted Internships
          </button>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center mb-4">
              <div className="p-3 bg-blue-100 rounded-md mr-4">
                <Building className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Shortlisted Applications for: {job?.jobTitle || job?.jobRoles?.[0] || 'Internship Position'}
                </h1>
                <div className="flex flex-wrap items-center gap-3 mt-2">
                  <span className="inline-flex items-center text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-lg">
                    <MapPin size={14} className="mr-1.5" />
                    {Array.isArray(job?.location) ? job.location.join(', ') : job?.location || 'Location not specified'}
                  </span>
                  <span className="inline-flex items-center text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-lg">
                    <FileText size={14} className="mr-1.5" />
                    Internship
                  </span>
                  <span className="inline-flex items-center text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-lg">
                    <Users size={14} className="mr-1.5" />
                    {applications.length} Shortlisted Candidate{applications.length !== 1 ? 's' : ''}
                  </span>
                  <span className="inline-flex items-center text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-lg">
                    <Calendar size={14} className="mr-1.5" />
                    End Date: {job?.expireAt ? safeFormatDate(job.expireAt) : 'Not specified'}
                  </span>
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

        {/* Applicants List */}
        {applications.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
              <Users className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No shortlisted candidates found</h3>
            <p className="text-gray-600">No candidates have been shortlisted for this internship yet.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {applications.map((applicant) => {
              const applicantData = applicant?.applicant || {};
              const currentStatus = applicant?.currentStatus || 'Shortlisted';
              
              return (
                <div key={applicant._id} className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all duration-200">
                  {/* Applicant Header */}
                  <div className="p-6 border-b border-gray-200">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                      <div className="flex items-start gap-4 mb-4 md:mb-0">
                        <div className="w-16 h-16 bg-blue-100 rounded-md flex items-center justify-center">
                          {applicantData?.profileImageUrl ? (
                            <img 
                              src={applicantData.profileImageUrl} 
                              alt={applicantData.name}
                              className="w-full h-full rounded-md object-cover"
                            />
                          ) : (
                            <User className="h-8 w-8 text-blue-600" />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-3 mb-1">
                            <h2 className="text-xl font-bold text-gray-900">{applicantData.name || 'N/A'}</h2>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              currentStatus === 'Accepted' 
                                ? 'bg-green-100 text-green-800'
                                : currentStatus === 'Rejected'
                                ? 'bg-red-100 text-red-800'
                                : currentStatus === 'Shortlisted'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}>
                              {currentStatus}
                            </span>
                          </div>
                          <div className="flex flex-wrap items-center gap-3 mt-2">
                            <span className="inline-flex items-center text-sm text-gray-600">
                              <GraduationCap size={14} className="mr-1.5" />
                              {applicantData.degree || 'N/A'} ({applicantData.specialization || 'N/A'})
                            </span>
                            <span className="inline-flex items-center text-sm text-gray-600">
                              <Briefcase size={14} className="mr-1.5" />
                              {applicantData.designation || 'Student'}
                            </span>
                            <span className="inline-flex items-center text-sm text-gray-600">
                              <MapPin size={14} className="mr-1.5" />
                              {applicantData.locations || 'Location not specified'}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Date Applied */}
                      <div className="text-sm text-gray-600">
                        Applied on: {safeFormatDate(applicant?.createdAt)}
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
                              value={applicantData.designation || 'Student'} 
                            />
                            <DetailRow 
                              icon={Building} 
                              label="Current Company/Institute" 
                              value={applicantData.currentCompany || applicantData.institute || 'Not specified'} 
                            />
                            <DetailRow 
                              icon={Calendar} 
                              label="Total Experience" 
                              value={applicantData.totalExperience || 'Fresher'} 
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

                    <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
                      {/* Message Button */}
                      <button
                        onClick={() => handleMessageClick(applicant)}
                        disabled={isProcessing || isSubmitting}
                        className={`flex items-center justify-center flex-1 py-2.5 font-medium rounded-lg transition-colors duration-200 ${
                          (isProcessing || isSubmitting) 
                            ? 'opacity-50 cursor-not-allowed bg-white border border-gray-300 text-blue-600' 
                            : 'bg-white border border-gray-300 text-blue-600 hover:bg-gray-50'
                        }`}
                      >
                        <MessageSquare size={16} className="mr-2" />
                        {isProcessing ? 'Processing...' : 'Message'}
                      </button>
                      
                      {/* Schedule Interview Button */}
                      <button
                        onClick={() => handleScheduleInterview(applicant)}
                        disabled={isSubmitting || currentStatus === 'Accepted'}
                        className={`flex items-center justify-center flex-1 py-2.5 font-medium rounded-lg transition-colors duration-200 ${
                          currentStatus === 'Accepted'
                            ? 'bg-green-100 text-green-700 cursor-not-allowed'
                            : 'bg-white border border-gray-300 text-yellow-600 hover:bg-gray-50'
                        } disabled:opacity-50`}
                      >
                        <CalendarClock size={16} className="mr-2" />
                        Schedule Interview
                      </button>
                      
                      {/* Accept Button */}
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
                        {currentStatus === 'Accepted' ? 'Accepted' : 'Accept'}
                      </button>
                      
                      {/* Reject Button */}
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
                        {currentStatus === 'Rejected' ? 'Rejected' : 'Reject'}
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
      {toggleScheduleInterviewPopup && selectedApplicantForInterview && job && (
        <InterviewSchedulerPopup
          setToggleScheduleInterviewPopup={setToggleScheduleInterviewPopup}
          application={selectedApplicantForInterview}
          job={job}
        />
      )}
    </div>
  );
};

export default InternshipDetails;