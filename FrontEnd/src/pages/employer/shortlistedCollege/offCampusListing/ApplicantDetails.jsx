{/*import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { acceptCandidate, getApplicationsForJob, rejectCandidate } from '@/lib/Company_AxiosInstance';
import toast from 'react-hot-toast';
import useConversation from '@/statemanage/useConversation';
import { conversationWithCollege } from '@/lib/College_AxiosIntance';
import { Send, Mail, Phone, MapPin, Briefcase, GraduationCap, DollarSign, Building2, Globe } from 'lucide-react';
import InterviewSchedulerPopup from '@/components/ui/ScheduleInterview';

const ApplicantDetails = ({ job, onClose, onAccept, onShortlist, onReject }) => {
  const jobId = job._id;
  const jobType = job.jobType;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toggleScheduleInterviewPopup, setToggleScheduleInterviewPopup] = useState(false);
  const [applications, setApplications] = useState();
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
    };
    setIsSubmitting(false);
  }

  const acceptApplicant = async (applicantionId) => {
    try {
      const response = await acceptCandidate(applicantionId, job?.jobRoles);
      if (response?.data?.success === true) toast.success("Accepted!");
      else toast.error(response.response?.data?.msg);
    } catch (error) {
      console.log("Error: ", error);
      toast.error('Something went wrong!')
    }
  }

  const rejectApplicant = async (applicantionId) => {
    try {
      const response = await rejectCandidate(applicantionId, job?.jobRoles);
      if (response?.data?.success === true) toast.success("Rejected!");
      else toast.error(response.response?.data?.msg);
    } catch (error) {
      console.log("Error: ", error);
      toast.error('Something went wrong!')
    }
  }

  useEffect(() => {
    getApplicants(jobId, jobType);
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

  const openApplicantModal = (applicant) => {
    setSelectedApplicant(applicant);
    setShowApplicantModal(true);
  };

  // Applicant Modal Component
  const ApplicantModal = () => {
    if (!selectedApplicant) return null;
    
    const applicant = selectedApplicant.applicant;
    
    return (
      <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            {/* Header *
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{applicant.name}</h2>
                <p className="text-gray-600 text-sm mt-1">
                  {applicant.degree} ({applicant.specialization})
                </p>
              </div>
              <button
                onClick={() => setShowApplicantModal(false)}
                className="text-gray-500 hover:text-gray-700 text-xl p-1"
              >
                ✕
              </button>
            </div>

            {/* Applicant Details Grid *
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="space-y-3">
                <div className="flex items-center text-gray-700">
                  <Mail className="w-4 h-4 mr-3 text-blue-500" />
                  <span className="font-medium">Email:</span>
                  <span className="ml-2">{applicant.email || 'N/A'}</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <Phone className="w-4 h-4 mr-3 text-blue-500" />
                  <span className="font-medium">Phone:</span>
                  <span className="ml-2">{applicant.phone || 'N/A'}</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <MapPin className="w-4 h-4 mr-3 text-blue-500" />
                  <span className="font-medium">Location:</span>
                  <span className="ml-2">{applicant.locations || 'N/A'}</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <Briefcase className="w-4 h-4 mr-3 text-blue-500" />
                  <span className="font-medium">Industry:</span>
                  <span className="ml-2">{applicant.industry || 'N/A'}</span>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center text-gray-700">
                  <GraduationCap className="w-4 h-4 mr-3 text-blue-500" />
                  <span className="font-medium">Degree:</span>
                  <span className="ml-2">{applicant.degree || 'N/A'}</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <GraduationCap className="w-4 h-4 mr-3 text-blue-500" />
                  <span className="font-medium">Specialization:</span>
                  <span className="ml-2">{applicant.specialization || 'N/A'}</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <DollarSign className="w-4 h-4 mr-3 text-blue-500" />
                  <span className="font-medium">Current Salary:</span>
                  <span className="ml-2">{applicant.currentSalaryCurrency} {applicant.currentSalaryAmount || 'N/A'}</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <DollarSign className="w-4 h-4 mr-3 text-blue-500" />
                  <span className="font-medium">Expected Salary:</span>
                  <span className="ml-2">{applicant.expectedSalaryCurrency} {applicant.expectedSalaryAmount || 'N/A'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <button onClick={() => onClose()}>Back</button>
      <div className="bg-white min-h-screen flex">
        {/* Filters Sidebar *
        <div className="w-1/4 p-6 border-r border-gray-200">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Filters</h2>
            <button className="text-sm text-gray-500">Clear all</button>
          </div>
          <p className="text-sm text-gray-500 mb-4">Showing 0 of 100</p>
          <div className="relative mb-6">
            <input type="text" placeholder="Search by Job" className="w-full pl-10 pr-4 py-2 border rounded-md" />
            <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
          </div>
          <div className="mb-6">
            <h3 className="font-bold mb-2">Job status</h3>
            <button className="text-sm text-gray-500 mb-4">Clear</button>
            <div className="space-y-2">
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" />
                Active Jobs
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" />
                Closed Jobs
              </label>
              <label className="flex items-center">
                <input type="checkbox" checked className="mr-2" />
                Expired Jobs
              </label>
            </div>
          </div>
        </div>

        {/* Applicant Details *
        <div className="flex-1 p-8">
          <h1 className=''>{job?.jobRoles[0]}</h1>
          {
            applications?.map((applicant) => (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6" key={applicant._id}>
                {/* Header Section *
                <div className="p-6">
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center">
                      <div 
                        className="w-20 h-20 bg-gray-200 rounded-full mr-6 cursor-pointer hover:opacity-90 transition-opacity"
                        onClick={() => openApplicantModal(applicant)}
                      >
                        {applicant?.applicant.profileImageUrl ? (
                          <img 
                            src={applicant.applicant.profileImageUrl} 
                            alt={applicant.applicant.name}
                            className="w-full h-full rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full rounded-full flex items-center justify-center text-gray-500">
                            No Image
                          </div>
                        )}
                      </div>
                      <div>
                        <h1 
                          className="text-3xl font-bold hover:text-blue-600 cursor-pointer transition-colors"
                          onClick={() => openApplicantModal(applicant)}
                        >
                          {applicant?.applicant.name}
                        </h1>
                        <div 
                          className="flex items-center text-gray-600 text-sm mt-1 cursor-pointer hover:text-blue-600 transition-colors"
                          onClick={() => openApplicantModal(applicant)}
                        >
                          <MapPin size={14} className="mr-1" />
                          <span>{applicant?.applicant.locations}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-6">
                    <div className="flex items-center">
                      <p className="font-bold mr-2">Current Salary:</p> <span>{applicant?.applicant.currentSalaryCurrency} {applicant?.applicant.currentSalaryAmount}</span>
                    </div>
                    <div className="flex items-center">
                      <p className="font-bold mr-2">Expected Salary:</p> <span>{applicant?.applicant.expectedSalaryCurrency} {applicant?.applicant.expectedSalaryAmount}</span>
                    </div>
                    <div className="flex items-center">
                      <p className="font-bold mr-2">Email:</p> <span className="underline">{applicant?.applicant.email}</span>
                    </div>
                    <div className="flex items-center">
                      <p className="font-bold mr-2">Phone:</p> <span>{applicant?.applicant.phone}</span>
                    </div>
                  </div>

                  <div className="flex space-x-4 mb-8">
                    {applicant?.applicant.linkedIn && (
                      <a 
                        href={applicant.applicant.linkedIn.startsWith('http') ? applicant.applicant.linkedIn : `https://${applicant.applicant.linkedIn}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-6 py-2 border rounded-md hover:bg-gray-50 transition-colors"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="50" height="50" viewBox="0 0 30 30">
                          <path d="M15,3C8.373,3,3,8.373,3,15c0,5.623,3.872,10.328,9.092,11.63C12.036,26.468,12,26.28,12,26.047v-2.051 c-0.487,0-1.303,0-1.508,0c-0.821,0-1.551-0.353-1.905-1.009c-0.393-0.729-0.461-1.844-1.435-2.526 c-0.289-0.227-0.069-0.486,0.264-0.451c0.615,0.174,1.125,0.596,1.605,1.222c0.478,0.627,0.703,0.769,1.596,0.769 c0.433,0,1.081-0.025,1.691-0.121c0.328-0.833,0.895-1.6,1.588-1.962c-3.996-0.411-5.903-2.399-5.903-5.098 c0-1.162,0.495-2.286,1.336-3.233C9.053,10.647,8.706,8.73,9.435,8c1.798,0,2.885,1.166,3.146,1.481C13.477,9.174,14.461,9,15.495,9 c1.036,0,2.024,0.174,2.922,0.483C18.675,9.17,19.763,8,21.565,8c0.732,0.731,0.381,2.656,0.102,3.594 c0.836,0.945,1.328,2.066,1.328,3.226c0,2.697-1.904,4.684-5.894,5.097C18.199,20.49,19,22.1,19,23.313v2.734 c0,0.104-0.023,0.179-0.035,0.268C23.641,24.676,27,20.236,27,15C27,8.373,21.627,3,15,3z"></path>
                        </svg>
                      </a>
                    )}
                    {applicant?.applicant.github && (
                      <a 
                        href={applicant.applicant.github.startsWith('http') ? applicant.applicant.github : `https://${applicant.applicant.github}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-6 py-2 border rounded-md hover:bg-gray-50 transition-colors"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="50" height="50" viewBox="0 0 48 48">
                          <path fill="#0288D1" d="M42,37c0,2.762-2.238,5-5,5H11c-2.761,0-5-2.238-5-5V11c0-2.762,2.239-5,5-5h26c2.762,0,5,2.238,5,5V37z"></path>
                          <path fill="#FFF" d="M12 19H17V36H12zM14.485 17h-.028C12.965 17 12 15.888 12 14.499 12 13.08 12.995 12 14.514 12c1.521 0 2.458 1.08 2.486 2.499C17 15.887 16.035 17 14.485 17zM36 36h-5v-9.099c0-2.198-1.225-3.698-3.192-3.698-1.501 0-2.313 1.012-2.707 1.99C24.957 25.543 25 26.511 25 27v9h-5V19h5v2.616C25.721 20.5 26.85 19 29.738 19c3.578 0 6.261 2.25 6.261 7.274L36 36 36 36z"></path>
                        </svg>
                      </a>
                    )}
                    {applicant?.applicant.portfolio && (
                      <a 
                        href={applicant.applicant.portfolio.startsWith('http') ? applicant.applicant.portfolio : `https://${applicant.applicant.portfolio}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-6 py-2 border rounded-md hover:bg-gray-50 transition-colors"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
                        </svg>
                      </a>
                    )}
                    {applicant?.applicant.cv && (
                      <a 
                        href={applicant.applicant.cv}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-6 py-2 border rounded-md hover:bg-gray-50 transition-colors"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
                        </svg>
                      </a>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-y-4 text-sm text-gray-700">
                    <div className="flex items-center">
                      <p className="font-bold mr-2">Key Info:</p>
                      <div className="flex items-center">
                        <span className="mr-4">{applicant?.applicant.degree} ({applicant?.applicant.specialization})</span>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <p className="font-bold mr-2">Language:</p> <span className="mr-4"></span>
                    </div>
                    <div className="flex items-center">
                      <p className="font-bold mr-2">Designation:</p> <span>Backend Developer at TalentConnects</span>
                    </div>
                    <div className="flex items-center">
                      <p className="font-bold mr-2">Industry:</p> <span>{applicant?.applicant.industry}</span>
                    </div>
                  </div>

                  {/* Skills Section *
                  <div className="mt-8">
                    <p className="font-bold text-gray-700 mb-3">Skills:</p>
                    <div className="flex flex-wrap gap-2">
                      {applicant?.applicant.skills?.map((skill, index) => (
                        <span key={index} className="px-4 py-1.5 text-sm border rounded-full bg-gray-100 text-gray-700">{skill}</span>
                      ))}
                    </div>
                  </div>
                </div>
                <hr className="my-6 border-t border-gray-200" />

                {/* Action Buttons *
                <div className="flex justify-end p-6 space-x-4">
                  <button
                    onClick={() => handleMessageClick(applicant)}
                    disabled={isSubmitting}
                    className="px-6 py-2 shadow hover:shadow-md border rounded-md text-gray-700 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50"
                  >
                    <Send size={14} className="mr-2" /> Chat
                  </button>
                  <button
                    onClick={() => acceptApplicant(applicant?._id)}
                    disabled={isSubmitting}
                    className="px-6 py-2 shadow hover:shadow-md text-green-500 font-medium rounded-md hover:bg-gray-300 disabled:opacity-50"
                  >
                    Accept Candidate
                  </button>
                  <button
                    onClick={() => setToggleScheduleInterviewPopup(true)}
                    disabled={isSubmitting}
                    className="px-6 py-2 shadow hover:shadow-md text-yellow-500 font-medium rounded-md hover:bg-gray-300 disabled:opacity-50"
                  >
                    Schedule Interview
                  </button>
                  <button
                    onClick={() => rejectApplicant(applicant._id)}
                    disabled={isSubmitting}
                    className="px-6 py-2 shadow hover:shadow-md border rounded-md text-red-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    <svg className="inline-block w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    Reject Application
                  </button>
                </div>
                {toggleScheduleInterviewPopup && selectedApplicant && job && (
                  <InterviewSchedulerPopup
                    setToggleScheduleInterviewPopup={setToggleScheduleInterviewPopup}
                    application={selectedApplicant}
                    job={job}
                  />
                )}
              </div>
            ))
          }
        </div>
      </div>

      {/* Render the applicant modal *
      {showApplicantModal && <ApplicantModal />}
    </>
  );
};

export default ApplicantDetails;*/}

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
  User, 
  Mail, 
  Phone, 
  Link as LinkIcon, 
  Briefcase, 
  GraduationCap,
  Building,
  Globe,
  ExternalLink,
  ChevronLeft,
  CheckCircle,
  XCircle,
  MessageSquare,
  BriefcaseBusiness,
  Clock,
  Download,
  Eye,
  X,
  School,
  UserCircle,
  Building2,
  Award,
  BookOpen
} from 'lucide-react';
import { format, isValid } from 'date-fns';

// ==================== Helper Function for Logo Extraction ====================
const getApplicantLogo = (applicantData) => {
  if (!applicantData) return null;
  
  // Priority order for logo extraction
  const possiblePaths = [
    applicantData.profileImageUrl,
    applicantData.profileImage,
    applicantData.logo,
    applicantData.profilePicture,
    applicantData.avatar,
    applicantData.image,
    applicantData.profilePhoto,
    applicantData.photo,
    applicantData.thumbnail,
    applicantData.picture
  ];
  
  for (const path of possiblePaths) {
    if (path && typeof path === 'string' && path.trim() !== '') {
      if (
        path.startsWith('http') ||
        path.startsWith('https') ||
        path.startsWith('data:image') ||
        path.startsWith('/') ||
        path.includes('.jpg') ||
        path.includes('.jpeg') ||
        path.includes('.png') ||
        path.includes('.gif') ||
        path.includes('cloudinary') ||
        path.includes('gravatar')
      ) {
        return path;
      }
    }
  }
  
  return null;
};

// ==================== Applicant Details Modal Component ====================
const ApplicantDetailsModal = ({ isOpen, onClose, applicant, application }) => {
  if (!isOpen || !applicant) return null;

  const applicantData = applicant || {};
  const applicationData = application || {};
  const applicantLogo = getApplicantLogo(applicantData);

  const safeFormatDate = (dateString, formatStr = 'MMM d, yyyy') => {
    if (!dateString) return 'Not Specified';
    try {
      const date = new Date(dateString);
      return isValid(date) ? format(date, formatStr) : 'Invalid Date';
    } catch (error) {
      return 'Invalid Date';
    }
  };

  const ModalDetailRow = ({ icon: Icon, label, value, className = "" }) => {
    if (!value || (Array.isArray(value) && value.length === 0)) return null;
    
    let displayValue = value;
    if (Array.isArray(value)) {
      displayValue = value.join(', ');
    } else if (typeof value === 'object' && value !== null) {
      displayValue = JSON.stringify(value);
    }
    
    return (
      <div className={`flex items-start ${className}`}>
        {Icon && <Icon className="w-5 h-5 mr-3 mt-0.5 text-blue-500 flex-shrink-0" />}
        <div className="flex-1">
          <p className="font-semibold text-gray-700 text-sm mb-1">{label}</p>
          <p className="text-gray-900">{displayValue || 'Not specified'}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop with blur effect */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />
      
      {/* Small Modal Container */}
      <div className="relative bg-white rounded-xl w-full max-w-2xl overflow-hidden shadow-2xl animate-slideUp">
        {/* Modal Header with Logo */}
        <div className="sticky top-0 z-10 bg-gradient-to-r from-blue-600 to-indigo-600 p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm overflow-hidden">
                {applicantLogo ? (
                  <img 
                    src={applicantLogo} 
                    alt={applicantData.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextElementSibling.style.display = 'flex';
                    }}
                  />
                ) : null}
                <div className={`w-full h-full ${applicantLogo ? 'hidden' : 'flex'} items-center justify-center`}>
                  <User className="h-6 w-6 text-white" />
                </div>
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">{applicantData.name || 'N/A'}</h2>
                <div className="flex items-center gap-2 mt-1">
                  <span className="inline-flex items-center text-xs text-white/90">
                    <GraduationCap size={12} className="mr-1" />
                    {applicantData.degree || 'N/A'}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    applicationData.currentStatus === 'Accepted' 
                      ? 'bg-green-500 text-white'
                      : applicationData.currentStatus === 'Rejected'
                      ? 'bg-red-500 text-white'
                      : 'bg-yellow-500 text-white'
                  }`}>
                    {applicationData.currentStatus || 'Shortlisted'}
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-white hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Modal Content - 4:3 ratio layout */}
        <div className="p-5">
          <div className="space-y-6">
            {/* Contact and Education Details side by side with 4:3 ratio */}
            <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
              {/* Contact Information - 3 columns (3/7 = ~43%) */}
              <div className="lg:col-span-3">
                <h3 className="text-md font-bold mb-3 text-gray-800 flex items-center gap-2">
                  <UserCircle className="h-5 w-5 text-blue-600" />
                  Contact Information
                </h3>
                <div className="space-y-3 bg-gray-50 rounded-lg p-4 h-full">
                  <ModalDetailRow icon={Mail} label="Email" value={applicantData.email} />
                  <ModalDetailRow icon={Phone} label="Phone" value={applicantData.phone} />
                  <ModalDetailRow icon={MapPin} label="Location" value={applicantData.locations} />
                </div>
              </div>

              {/* Education Details - 4 columns (4/7 = ~57%) */}
              <div className="lg:col-span-4">
                <h3 className="text-md font-bold mb-3 text-gray-800 flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 text-blue-600" />
                  Education Details
                </h3>
                <div className="space-y-3 bg-gray-50 rounded-lg p-4 h-full">
                  <ModalDetailRow icon={School} label="Degree" value={applicantData.degree} />
                  <ModalDetailRow icon={BookOpen} label="Specialization" value={applicantData.specialization} />
                  <ModalDetailRow icon={Building2} label="Institute" value={applicantData.institute} />
                  <ModalDetailRow icon={Calendar} label="Graduation Year" value={applicantData.graduationYear} />
                  <ModalDetailRow icon={Award} label="CGPA/Percentage" value={applicantData.cgpa || applicantData.percentage} />
                </div>
              </div>
            </div>

            {/* Application Info - Full width below */}
            <div>
              <h3 className="text-md font-bold mb-3 text-gray-800 flex items-center gap-2">
                <Calendar className="h-5 w-5 text-blue-600" />
                Application Information
              </h3>
              <div className="space-y-3 bg-gray-50 rounded-lg p-4">
                <div className="flex items-start">
                  <Calendar className="w-5 h-5 mr-3 mt-0.5 text-blue-500 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="font-semibold text-gray-700 text-sm mb-1">Shortlisted On</p>
                    <p className="text-gray-900">{safeFormatDate(applicationData?.updatedAt || applicationData?.createdAt)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="border-t border-gray-200 p-4 bg-gray-50">
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-colors font-medium text-sm"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// DetailRow component for main applicant card
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
const ApplicantDetails = ({ job, applications, loading, error, isVisited, onRefresh, onClose }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [toggleScheduleInterviewPopup, setToggleScheduleInterviewPopup] = useState(false);
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [selectedApplicantModal, setSelectedApplicantModal] = useState({
    isOpen: false,
    applicant: null,
    application: null
  });

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

  // Accept applicant logic
  const acceptApplicant = async (applicationId) => {
    setIsSubmitting(true);
    try {
      console.log('Accepting application:', applicationId, 'with job roles:', job?.jobRoles);
      
      // Ensure jobRoles is an array or empty array
      const jobRoles = Array.isArray(job?.jobRoles) ? job.jobRoles : [];
      
      // Use your existing acceptCandidate function
      const response = await acceptCandidate(applicationId, jobRoles);
      console.log('Accept response:', response);
      
      if (response?.data?.success === true) {
        toast.success("Candidate Accepted!");
        onRefresh(); // Refresh the list
      } else {
        const errorMsg = response?.data?.msg || response?.response?.data?.msg || 'Failed to accept candidate';
        console.error('Accept error:', errorMsg);
        toast.error(errorMsg);
      }
    } catch (error) {
      console.error("Error accepting candidate:", error);
      
      // More detailed error handling
      if (error.response) {
        // Server responded with error status
        const errorMsg = error.response.data?.msg || error.response.data?.message || 'Server error occurred';
        toast.error(errorMsg);
        console.error('Server error details:', error.response.data);
      } else if (error.request) {
        // Request made but no response
        toast.error('Network error. Please check your connection.');
        console.error('Network error:', error.request);
      } else {
        // Something else happened
        toast.error(error.message || 'Something went wrong!');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reject applicant logic
  const rejectApplicant = async (applicationId) => {
    setIsSubmitting(true);
    try {
      console.log('Rejecting application:', applicationId, 'with job roles:', job?.jobRoles);
      
      // Ensure jobRoles is an array or empty array
      const jobRoles = Array.isArray(job?.jobRoles) ? job.jobRoles : [];
      
      // Use your existing rejectCandidate function
      const response = await rejectCandidate(applicationId, jobRoles);
      console.log('Reject response:', response);
      
      if (response?.data?.success === true) {
        toast.success("Candidate Rejected!");
        onRefresh(); // Refresh the list
      } else {
        const errorMsg = response?.data?.msg || response?.response?.data?.msg || 'Failed to reject candidate';
        console.error('Reject error:', errorMsg);
        toast.error(errorMsg);
      }
    } catch (error) {
      console.error("Error rejecting candidate:", error);
      
      // More detailed error handling
      if (error.response) {
        // Server responded with error status
        const errorMsg = error.response.data?.msg || error.response.data?.message || 'Server error occurred';
        toast.error(errorMsg);
        console.error('Server error details:', error.response.data);
      } else if (error.request) {
        // Request made but no response
        toast.error('Network error. Please check your connection.');
        console.error('Network error:', error.request);
      } else {
        // Something else happened
        toast.error(error.message || 'Something went wrong!');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleViewResume = async (applicant) => {
    const applicantData = applicant?.applicant || {};
    const applicantStr = JSON.stringify(applicantData);
    const urlMatch = applicantStr.match(/(https?:\/\/res\.cloudinary\.com\/[^"'\s]+)/);
    
    if (!urlMatch) return toast.error("No resume found");
    
    const cloudinaryUrl = urlMatch[0];
    
    toast.loading("Loading resume...");
    
    try {
      const response = await fetch(cloudinaryUrl);
      const blob = await response.blob();
      const pdfBlob = new Blob([blob], { type: 'application/pdf' });
      const pdfUrl = URL.createObjectURL(pdfBlob);
      
      const newTab = window.open('', '_blank');
      newTab.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>${applicantData.name || 'Applicant'} - Resume</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body, html { height: 100%; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 20px; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 2px 10px rgba(0,0,0,0.1); position: sticky; top: 0; z-index: 1000; }
            .header h1 { font-size: 18px; font-weight: 600; margin: 0; }
            .controls { display: flex; gap: 10px; }
            .controls button { background: white; color: #667eea; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer; font-weight: 500; font-size: 14px; transition: all 0.2s; display: flex; align-items: center; gap: 5px; }
            .controls button:hover { background: #f8fafc; transform: translateY(-1px); box-shadow: 0 2px 5px rgba(0,0,0,0.1); }
            .pdf-container { width: 100%; height: calc(100vh - 60px); }
            iframe { width: 100%; height: 100%; border: none; }
            .loading { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; color: #666; }
            .spinner { border: 3px solid #f3f3f3; border-top: 3px solid #667eea; border-radius: 50%; width: 40px; height: 40px; animation: spin 1s linear infinite; margin-bottom: 15px; }
            @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>📄 ${applicantData.name || 'Applicant'} - Resume</h1>
            <div class="controls">
              <button onclick="downloadPDF()">
                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Download
              </button>
              <button onclick="window.close()">
                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
                Close
              </button>
            </div>
          </div>
          <div class="pdf-container">
            <iframe src="${pdfUrl}" title="Resume PDF Viewer"></iframe>
          </div>
          <script>
            const pdfBlobUrl = "${pdfUrl}";
            function downloadPDF() {
              const link = document.createElement('a');
              link.href = pdfBlobUrl;
              link.download = '${applicantData.name || 'resume'}.pdf';
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            }
            window.addEventListener('beforeunload', () => {
              if (pdfBlobUrl.startsWith('blob:')) {
                URL.revokeObjectURL(pdfBlobUrl);
              }
            });
            setTimeout(() => {
              if (pdfBlobUrl.startsWith('blob:')) {
                URL.revokeObjectURL(pdfBlobUrl);
              }
            }, 10 * 60 * 1000);
          </script>
        </body>
        </html>
      `);
      newTab.document.close();
      toast.dismiss();
      toast.success("Resume opened in new tab!");
    } catch (error) {
      toast.dismiss();
      toast.error("Failed to load resume");
      console.error("Error:", error);
    }
  };

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
          profileImage: getApplicantLogo(applicant.applicant) || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png',
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

  // Open applicant details modal
  const openApplicantModal = (applicant) => {
    setSelectedApplicantModal({
      isOpen: true,
      applicant: applicant.applicant,
      application: applicant
    });
  };

  // Close applicant details modal
  const closeApplicantModal = () => {
    setSelectedApplicantModal({
      isOpen: false,
      applicant: null,
      application: null
    });
  };

  // Get all applicant locations
  const allApplicantLocations = getAllApplicantLocations();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Applicant Details Modal */}
      <ApplicantDetailsModal
        isOpen={selectedApplicantModal.isOpen}
        onClose={closeApplicantModal}
        applicant={selectedApplicantModal.applicant}
        application={selectedApplicantModal.application}
      />

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
              const applicantLogo = getApplicantLogo(applicantData);
              
              return (
                <div key={applicant._id} className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all duration-200">
                  {/* Applicant Header */}
                  <div className="p-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                      <div className="flex items-start gap-4 mb-4 md:mb-0">
                        <div className="relative w-16 h-16 rounded-md overflow-hidden bg-gradient-to-br from-yellow-100 to-orange-100 flex items-center justify-center">
                          {applicantLogo ? (
                            <img 
                              src={applicantLogo} 
                              alt={applicantData.name}
                              className="w-full h-full object-cover cursor-pointer hover:opacity-90 transition-opacity"
                              onClick={() => openApplicantModal(applicant)}
                              onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.nextElementSibling.style.display = 'flex';
                              }}
                            />
                          ) : null}
                          <div 
                            className={`w-full h-full ${applicantLogo ? 'hidden' : 'flex'} items-center justify-center cursor-pointer hover:opacity-90 transition-opacity`}
                            onClick={() => openApplicantModal(applicant)}
                          >
                            <User className="h-8 w-8 text-yellow-600" />
                          </div>
                        </div>
                        <div>
                          {/* CLICKABLE APPLICANT NAME */}
                          <div className="flex items-center gap-3 mb-1">
                            <button
                              onClick={() => openApplicantModal(applicant)}
                              className="text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors text-left group"
                            >
                              {applicantData.name || 'N/A'}
                            </button>
                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-300">
                              Shortlisted
                            </span>
                          </div>
                          {/* Basic info - REMOVED DEGREE AND SPECIALIZATION */}
                          <div className="flex flex-wrap items-center gap-3 mt-2">
                            <span className="inline-flex items-center text-sm text-gray-600">
                              <MapPin size={14} className="mr-1.5" />
                              {applicantData.locations || 'Location not specified'}
                            </span>
                            {applicantData.designation && (
                              <span className="inline-flex items-center text-sm text-gray-600">
                                <Briefcase size={14} className="mr-1.5" />
                                {applicantData.designation}
                              </span>
                            )}
                            {applicantData.currentCompany && (
                              <span className="inline-flex items-center text-sm text-gray-600">
                                <Building size={14} className="mr-1.5" />
                                {applicantData.currentCompany}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {/* Date Shortlisted */}
                      <div className="text-sm text-gray-600">
                        Shortlisted on: {safeFormatDate(applicant?.updatedAt || applicant?.createdAt)}
                      </div>
                    </div>
                  </div>

                  {/* Applicant Details - REMOVED CONTACT & EDUCATION SECTIONS */}
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      {/* Professional Details Only */}
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
                              icon={Clock} 
                              label="Total Experience" 
                              value={applicantData.totalExperience || 'N/A'} 
                            />
                          </div>
                        </div>
                      </div>

                      {/* Salary Information */}
                      <div className="space-y-6">
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

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
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