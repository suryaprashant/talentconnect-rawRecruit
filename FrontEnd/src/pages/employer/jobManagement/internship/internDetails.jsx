{/*import { useEffect, useState } from 'react';
import { acceptCandidate, getApplicationsForJob, rejectCandidate, shortlistCandidate } from '@/lib/Company_AxiosInstance';
import toast from 'react-hot-toast';
import { useChat } from '@/context/ChatContext';
import { useNavigate } from 'react-router-dom';
import { Send } from 'lucide-react';
import { conversationWithCollege } from '@/lib/College_AxiosIntance';

const InternshipDetails = ({ job, onClose }) => {
  const jobId = job._id;
  const jobType = job.jobType;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [applications, setApplications] = useState();

  const navigate = useNavigate();
  const { setSelectedConversation, setShowFloatingChat } = useChat();  

  const getApplicants = async (jobId, jobType) => {
    setIsSubmitting(true);
    try {
      const response = await getApplicationsForJob(jobId, jobType, "Applied");
      setApplications(response.data);
    } catch (error) {
      console.log("Error: ", error);
    };
    setIsSubmitting(false);
  }

  const acceptApplicant = async (applicantionId) => {
    try {
      const response = await acceptCandidate(applicantionId, job?.jobTitle);
      // console.log("shortlist: ", response)
      if (response?.data?.success === true) toast.success("Accpeted!");
      else toast.error(response.response?.data?.msg);
    } catch (error) {
      console.log("Error: ", error);
      toast.error('Something went wrong!')
    }
  }

  const shortlistApplicant = async (applicantionId) => {
    try {
      const response = await shortlistCandidate(applicantionId, job?.jobTitle);
      if (response?.data?.success === true) toast.success("Shortlisted!");
      else toast.error(response.response?.data?.msg);
    } catch (error) {
      console.log("Error: ", error);
      toast.error('Something went wrong!')
    }
  }

  const rejectApplicant = async (applicantionId) => {
    try {
      const response = await rejectCandidate(applicantionId, job?.jobTitle);
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
              setShowFloatingChat(true);
            }, 0);

      } else {
        toast.error('Failed to create conversation');
      }
    } catch (error) {
      console.error('Error starting chat:', error);
      toast.error('Error starting conversation');
    }
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
              <div className="bg-white rounded-lg shadow-sm border border-gray-200" key={applicant._id}>
                {/* Header Section *
                <div className="p-6">
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center">
                      <div className="w-20 h-20 bg-gray-200 rounded-full mr-6"></div>
                      <div>
                        <h1 className="text-3xl font-bold">{applicant?.applicant.name}</h1>
                        <p className="text-sm text-gray-600 mt-1">{applicant?.applicant.locations}</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-6">
                    <div className="flex items-center">
                      <p className="font-bold mr-2">Current Salary:</p> <span>{applicant?.applicant?.currentSalaryCurrency} {applicant?.applicant.currentSalaryAmount || "N/A"}</span>
                    </div>
                    <div className="flex items-center">
                      <p className="font-bold mr-2">Expected Salary:</p> <span>{applicant?.applicant.expectedSalaryCurrency} {applicant?.applicant.expectedSalaryAmount || "N/A"}</span>
                    </div>
                    <div className="flex items-center">
                      <p className="font-bold mr-2">Email:</p> <span className="underline">{applicant?.applicant.email}</span>
                    </div>
                    <div className="flex items-center">
                      <p className="font-bold mr-2">Phone:</p> <span>{applicant?.applicant.phone}</span>
                    </div>
                  </div>

                  <h3 className='font-bold text-gray-700 mb-2'>Related Links</h3>
                  <div className="flex space-x-4 mb-8">
                    <button className="px-6 py-2 border rounded-md">
                      {applicant?.applicant.linkedIn}
                      {/* <LinkedInLogo className="w-5 h-5" /> *
                      <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="50" height="50" viewBox="0 0 30 30">
                        <path d="M15,3C8.373,3,3,8.373,3,15c0,5.623,3.872,10.328,9.092,11.63C12.036,26.468,12,26.28,12,26.047v-2.051 c-0.487,0-1.303,0-1.508,0c-0.821,0-1.551-0.353-1.905-1.009c-0.393-0.729-0.461-1.844-1.435-2.526 c-0.289-0.227-0.069-0.486,0.264-0.451c0.615,0.174,1.125,0.596,1.605,1.222c0.478,0.627,0.703,0.769,1.596,0.769 c0.433,0,1.081-0.025,1.691-0.121c0.328-0.833,0.895-1.6,1.588-1.962c-3.996-0.411-5.903-2.399-5.903-5.098 c0-1.162,0.495-2.286,1.336-3.233C9.053,10.647,8.706,8.73,9.435,8c1.798,0,2.885,1.166,3.146,1.481C13.477,9.174,14.461,9,15.495,9 c1.036,0,2.024,0.174,2.922,0.483C18.675,9.17,19.763,8,21.565,8c0.732,0.731,0.381,2.656,0.102,3.594 c0.836,0.945,1.328,2.066,1.328,3.226c0,2.697-1.904,4.684-5.894,5.097C18.199,20.49,19,22.1,19,23.313v2.734 c0,0.104-0.023,0.179-0.035,0.268C23.641,24.676,27,20.236,27,15C27,8.373,21.627,3,15,3z"></path>
                      </svg>
                    </button>
                    <button className="px-6 py-2 border rounded-md">
                      {applicant?.applicant.github}
                      <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="50" height="50" viewBox="0 0 48 48">
                        <path fill="#0288D1" d="M42,37c0,2.762-2.238,5-5,5H11c-2.761,0-5-2.238-5-5V11c0-2.762,2.239-5,5-5h26c2.762,0,5,2.238,5,5V37z"></path><path fill="#FFF" d="M12 19H17V36H12zM14.485 17h-.028C12.965 17 12 15.888 12 14.499 12 13.08 12.995 12 14.514 12c1.521 0 2.458 1.08 2.486 2.499C17 15.887 16.035 17 14.485 17zM36 36h-5v-9.099c0-2.198-1.225-3.698-3.192-3.698-1.501 0-2.313 1.012-2.707 1.99C24.957 25.543 25 26.511 25 27v9h-5V19h5v2.616C25.721 20.5 26.85 19 29.738 19c3.578 0 6.261 2.25 6.261 7.274L36 36 36 36z"></path>
                      </svg>
                    </button>
                    <button className="px-6 py-2 border rounded-md">{applicant?.applicant.portfolio}
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
                      </svg>

                    </button>
                    <button className="px-6 py-2 border rounded-md">{applicant?.applicant.cv}
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
                      </svg>

                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-y-4 text-sm text-gray-700">
                    <div className="flex items-center">
                      <p className="font-bold mr-2">Key Info:</p>
                      <div className="flex items-center">
                        <span className="mr-4 capitalize">{applicant?.applicant.degree} ({applicant?.applicant.specialization})</span>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <p className="font-bold mr-2">Language:</p> <span className="mr-4">Not Specified</span>
                    </div>
                    <div className="flex items-center">
                      <p className="font-bold mr-2">Designation:</p> <span>Not Specified</span>
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
                  {/* <button className="px-6 py-2 shadow hover:shadow-md border rounded-md text-gray-700">View Details</button> *
                  <button
                    onClick={() => acceptApplicant(applicant._id)}
                    disabled={isSubmitting}
                    className="px-6 py-2 shadow hover:shadow-md text-green-500 font-medium rounded-md hover:bg-gray-300 disabled:opacity-50"
                  >
                    Accept Candidate
                  </button>
                  <button
                    onClick={() => shortlistApplicant(applicant._id)}
                    disabled={isSubmitting}
                    className="px-6 py-2 shadow hover:shadow-md text-yellow-500 font-medium rounded-md hover:bg-gray-300 disabled:opacity-50"
                  >
                    Shortlist Candidate
                  </button>
                  <button
                    onClick={() => rejectApplicant(applicant._id)}
                    disabled={isSubmitting}
                    className="px-6 py-2 shadow hover:shadow-md rounded-md text-red-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    <svg className="inline-block w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    Reject Application
                  </button>
                </div>
              </div>
            ))
          }
        </div>
      </div>
    </>
  );
};

export default InternshipDetails;*/}

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { acceptCandidate, getApplicationsForJob, rejectCandidate, shortlistCandidate } from '@/lib/Company_AxiosInstance';
import toast from 'react-hot-toast';
import { useChat } from '@/context/ChatContext';
import { conversationWithCollege } from '@/lib/College_AxiosIntance';
import { 
  Send, User, Mail, Phone, Link, Briefcase, DollarSign, 
  Calendar, MapPin, Target, FileText, Building2, Globe, 
  ArrowUpRight, ClipboardList, Users, Award, ChevronLeft,
  Github, Linkedin, ExternalLink, X, GraduationCap, Globe as GlobeIcon,
  CheckCircle, Clock, AlertCircle,
  IndianRupee
} from 'lucide-react';

const InternshipDetails = ({  job,
  applications,
  loading,
  error,
  isVisited,
  onRefresh,
  onClose,}) => {
  const jobId = job._id;
  const jobType = job.jobType;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [showApplicantModal, setShowApplicantModal] = useState(false);
  const navigate = useNavigate();
  const { setSelectedConversation, setShowFloatingChat } = useChat();  

  {/*const getApplicants = async (jobId, jobType, isVisited) => {
    setIsSubmitting(true);
    try {
      let response;
      if (isVisited === false) {
        response = await getApplicationsForJob(jobId, jobType, "Applied", isVisited);
      } else {
        response = await getApplicationsForJob(jobId, jobType, "Applied");
      }
      setApplications(response.data);
    } catch (error) {
      console.log("Error: ", error);
      toast.error('Failed to load applications');
    }
    setIsSubmitting(false);
  };*/}

  const handleAction = async (actionCallback, applicantId, actionName) => {
    setIsSubmitting(true);
    try {
      await actionCallback(applicantId);
      // Refresh applications after action
      onRefresh()
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
        onRefresh();
      } else {
        toast.error(response.response?.data?.msg || 'Failed to accept candidate');
      }
    } catch (error) {
      console.log("Error: ", error);
      toast.error('Something went wrong!');
    }
  };

  const shortlistApplicant = async (applicationId) => {
    try {
      const response = await shortlistCandidate(applicationId, job?.jobTitle);
      if (response?.data?.success === true) {
        toast.success("Candidate Shortlisted!");
        onRefresh();
      } else {
        toast.error(response.response?.data?.msg || 'Failed to shortlist candidate');
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
        onRefresh();
      } else {
        toast.error(response.response?.data?.msg || 'Failed to reject candidate');
      }
    } catch (error) {
      console.log("Error: ", error);
      toast.error('Something went wrong!');
    }
  };

  {/*useEffect(() => {
    if (isVisited === false) {
      getApplicants(jobId, jobType, false);
    } else {
      getApplicants(jobId, jobType, isVisited);
    }
  }, [jobId, jobType, isVisited]);*/}

  // Helper function to get applicant logo with fallbacks
  const getApplicantLogo = (applicant) => {
    if (!applicant) return null;
    
    // Try multiple possible paths for the applicant's profile image
    const possiblePaths = [
      applicant.profileImageUrl,        // Primary field
      applicant.profileImage,           // Alternative field name
      applicant.avatar,                 // Another possible field
      applicant.image,                  // Generic field
      applicant.photo,                  // Another possibility
      applicant.profilePicture,         // Yet another possibility
      applicant.profilePic,             // Short form
      applicant.profilePictureUrl       // Full URL field
    ];
    
    // Find the first valid URL
    const validLogo = possiblePaths.find(path => 
      path && typeof path === 'string' && path.trim() !== '' && 
      (path.startsWith('http') || path.startsWith('https') || path.startsWith('/'))
    );
    
    return validLogo || null;
  };

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
          profileImage: getApplicantLogo(applicant.applicant) || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png', // Use helper function
          userType: 'candidate',
          fullname: applicant.applicant.name || 'Unknown Applicant'
        };

        setSelectedConversation(conversationUser);

        setTimeout(() => {
              setShowFloatingChat(true);
            }, 0);

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

  const ApplicantDetailsModal = () => {
    if (!selectedApplicant) return null;
    
    const applicant = selectedApplicant.applicant;
    const currentStatus = selectedApplicant.currentStatus || 'Applied';
    const applicantLogo = getApplicantLogo(applicant); // Get logo using helper
    
    return (
      <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            {/* Header */}
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center">
                {applicantLogo ? (
                  <img 
                    src={applicantLogo} 
                    alt={applicant.name}
                    className="w-20 h-20 rounded-full object-cover mr-4"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextElementSibling.style.display = 'flex';
                    }}
                  />
                ) : null}
                <div 
                  className={`${applicantLogo ? 'hidden' : 'flex'} w-20 h-20 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 items-center justify-center text-gray-600 text-lg mr-4`}
                >
                  {applicant.name?.charAt(0) || 'U'}
                </div>
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

            {/* Salary Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
                <div className="flex items-center mb-2">
                  <IndianRupee className="w-5 h-5 mr-2 text-blue-600" />
                  <h3 className="font-semibold text-gray-800">Current Salary</h3>
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {applicant.currentSalaryCurrency} {applicant.currentSalaryAmount || '0'}
                </p>
              </div>
              <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl">
                <div className="flex items-center mb-2">
                  <IndianRupee className="w-5 h-5 mr-2 text-green-600" />
                  <h3 className="font-semibold text-gray-800">Expected Salary</h3>
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {applicant.expectedSalaryCurrency} {applicant.expectedSalaryAmount || '0'}
                </p>
              </div>
            </div>

            {/* Contact Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="text-lg font-bold mb-4 text-gray-800">Contact Information</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center">
                    <Mail size={16} className="mr-2 text-gray-500 flex-shrink-0" />
                    <a href={`mailto:${applicant.email}`} className="text-blue-600 hover:underline">
                      {applicant.email}
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
                    <GraduationCap size={16} className="mr-2 text-gray-500 flex-shrink-0" />
                    <span>Degree: {applicant.degree} ({applicant.specialization})</span>
                  </div>
                  <div className="flex items-center">
                    <ClipboardList size={16} className="mr-2 text-gray-500 flex-shrink-0" />
                    <span>Language: {applicant.language || 'Not specified'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Links Section */}
            <div className="mb-6">
              <h3 className="text-lg font-bold mb-4 text-gray-800">Professional Links</h3>
              <div className="flex flex-wrap gap-3">
                {applicant.linkedIn && (
                  <a 
                    href={applicant.linkedIn.startsWith('http') ? applicant.linkedIn : `https://${applicant.linkedIn}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 bg-blue-50 text-[#143694] rounded-lg hover:bg-blue-100 transition-colors"
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
                    <GlobeIcon size={16} className="mr-2" />
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

            {/* Skills Section */}
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

            {/* Action Buttons - Commented out as requested */}
            {/* <div className="flex flex-col sm:flex-row gap-4 mt-8 pt-6 border-t border-gray-200">
              <button 
                onClick={() => handleMessageClick(selectedApplicant)}
                disabled={isProcessing}
                className="flex items-center justify-center flex-1 py-3 bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 text-blue-600 rounded-xl hover:bg-blue-100 transition-all duration-200 disabled:opacity-50"
              >
                <Send size={18} className="mr-2" />
                {isProcessing ? 'Processing...' : 'Message Candidate'}
              </button>
              <button
                onClick={() => acceptApplicant(selectedApplicant._id)}
                disabled={isSubmitting}
                className="flex items-center justify-center flex-1 py-3 bg-gradient-to-r from-green-100 to-green-50 border border-green-200 text-green-700 rounded-xl hover:bg-green-100 transition-all duration-200 disabled:opacity-50"
              >
                <CheckCircle size={18} className="mr-2" />
                Accept Candidate
              </button>
              <button
                onClick={() => shortlistApplicant(selectedApplicant._id)}
                disabled={isSubmitting}
                className="flex items-center justify-center flex-1 py-3 bg-gradient-to-r from-yellow-100 to-yellow-50 border border-yellow-200 text-yellow-700 rounded-xl hover:bg-yellow-100 transition-all duration-200 disabled:opacity-50"
              >
                <Clock size={18} className="mr-2" />
                Shortlist Candidate
              </button>
              <button
                onClick={() => rejectApplicant(selectedApplicant._id)}
                disabled={isSubmitting}
                className="flex items-center justify-center flex-1 py-3 bg-gradient-to-r from-red-100 to-red-50 border border-red-200 text-red-700 rounded-xl hover:bg-red-100 transition-all duration-200 disabled:opacity-50"
              >
                <X size={18} className="mr-2" />
                Reject Application
              </button>
            </div> */}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#143694]/10 via-[#f093fb]/5 to-[#1e4ed8]/10">
      <div className="container mx-auto px-4 py-8 pt-20">
        <div className="bg-white/90 backdrop-blur-sm border border-gray-100 rounded-2xl shadow-lg p-6">
          {/* Header */}
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
                <h1 className="text-2xl font-bold bg-gradient-to-r from-[#143694] to-[#1e4ed8] bg-clip-text text-transparent">
                  {job?.jobTitle || 'Internship Applications'}
                </h1>
                <p className="text-gray-600 mt-1">
                  Manage candidate applications for this internship position
                </p>
              </div>
            </div>
            <div className="text-sm text-gray-500">
              {applications.length} candidate{applications.length !== 1 ? 's' : ''} applied
            </div>
          </div>

          {/* Applicants List */}
          {isSubmitting && applications.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#143694]"></div>
              <p className="mt-4 text-gray-600">Loading applications...</p>
            </div>
          ) : applications.length === 0 ? (
            <div className="bg-gradient-to-r from-gray-50 to-white border border-gray-200 rounded-xl p-12 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-gray-100 to-gray-200 mb-4">
                <Users className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No applications yet</h3>
              <p className="text-gray-600">No candidates have applied for this internship yet.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {applications.map((application) => {
                const applicant = application.applicant;
                const currentStatus = application.currentStatus || 'Applied';
                const applicantLogo = getApplicantLogo(applicant); // Get logo using helper
                
                return (
                  <div key={application._id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      {/* Applicant Info */}
                      <div className="flex items-center flex-1">
                        <div 
                          className="cursor-pointer"
                          onClick={() => handleViewApplicantDetails(application)}
                        >
                          {applicantLogo ? (
                            <img 
                              src={applicantLogo} 
                              alt={applicant.name}
                              className="w-16 h-16 rounded-full object-cover mr-4 hover:opacity-90 transition-opacity"
                              onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.nextElementSibling.style.display = 'flex';
                              }}
                            />
                          ) : null}
                          <div 
                            className={`${applicantLogo ? 'hidden' : 'flex'} w-16 h-16 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 items-center justify-center text-gray-600 text-lg mr-4 hover:bg-gray-300 transition-colors`}
                            onClick={() => handleViewApplicantDetails(application)}
                          >
                            {applicant.name?.charAt(0) || 'U'}
                          </div>
                        </div>
                        <div className="flex-1">
                          <div 
                            className="cursor-pointer hover:text-[#143694] transition-colors"
                            onClick={() => handleViewApplicantDetails(application)}
                          >
                            <h3 className="font-semibold text-gray-900 text-lg">{applicant.name}</h3>
                            <div className="flex items-center text-gray-600 text-sm mt-1">
                              <GraduationCap size={14} className="mr-2" />
                              <span className="truncate">{applicant.degree} ({applicant.specialization})</span>
                            </div>
                          </div>
                          <div className="flex items-center text-gray-500 text-sm mt-2">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              currentStatus === 'Accepted' 
                                ? 'bg-gradient-to-r from-green-100 to-green-50 text-green-700 border border-green-200' 
                                : currentStatus === 'Shortlisted'
                                ? 'bg-gradient-to-r from-yellow-100 to-yellow-50 text-yellow-700 border border-yellow-200'
                                : currentStatus === 'Rejected'
                                ? 'bg-gradient-to-r from-red-100 to-red-50 text-red-700 border border-red-200'
                                : 'bg-gradient-to-r from-blue-100 to-blue-50 text-[#143694] border border-blue-200'
                            }`}>
                              {currentStatus}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Quick Info - Commented out as requested */}
                      {/* <div className="flex flex-wrap gap-4 text-sm">
                        <div className="text-center">
                          <div className="font-semibold text-gray-800">
                            {applicant.currentSalaryCurrency} {applicant.currentSalaryAmount || '0'}
                          </div>
                          <div className="text-xs text-gray-500">Current Salary</div>
                        </div>
                        <div className="text-center">
                          <div className="font-semibold text-gray-800">
                            {applicant.expectedSalaryCurrency} {applicant.expectedSalaryAmount || '0'}
                          </div>
                          <div className="text-xs text-gray-500">Expected Salary</div>
                        </div>
                      </div> */}

                      {/* Action Buttons */}
                      <div className="flex items-center gap-2">
                        {/* <button
                          onClick={() => handleViewApplicantDetails(application)}
                          className="p-2 bg-gradient-to-r from-gray-100 to-white border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 hover:text-[#143694] hover:border-[#143694]/50 transition-all duration-200"
                          title="View Details"
                        >
                          <User size={16} />
                        </button> */}
                        <button
                          onClick={() => handleMessageClick(application)}
                          disabled={isProcessing}
                          className="p-2 bg-gradient-to-r from-blue-100 to-blue-50 border border-blue-200 text-blue-600 rounded-lg hover:bg-blue-100 hover:text-[#143694] transition-all duration-200 disabled:opacity-50"
                          title="Message"
                        >
                          <Send size={16} />
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
                        {currentStatus !== 'Shortlisted' && currentStatus !== 'Accepted' && (
                          <button
                            onClick={() => handleAction(() => shortlistApplicant(application._id), application._id, 'shortlist')}
                            disabled={isSubmitting}
                            className="px-4 py-2 bg-gradient-to-r from-yellow-100 to-yellow-50 border border-yellow-200 text-yellow-700 rounded-lg hover:bg-yellow-100 hover:text-yellow-800 transition-all duration-200 disabled:opacity-50"
                          >
                            Shortlist
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

                    {/* Skills Preview */}
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
      
      {/* Applicant Details Modal */}
      {showApplicantModal && <ApplicantDetailsModal />}
    </div>
  );
};

export default InternshipDetails;