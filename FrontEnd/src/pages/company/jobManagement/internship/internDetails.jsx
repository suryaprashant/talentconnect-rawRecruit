import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { acceptCandidate, getApplicationsForJob, rejectCandidate, shortlistCandidate } from '@/lib/Company_AxiosInstance';
import toast from 'react-hot-toast';
import useConversation from '@/statemanage/useConversation';
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
  const { setSelectedConversation } = useConversation();

  // Helper function to get applicant logo from multiple possible paths
  const getApplicantLogo = (applicant) => {
    if (!applicant) return null;
    
    // Check multiple possible paths where logo might be stored
    const possiblePaths = [
      applicant.profileImageUrl,           // Most common
      applicant.profileImage,              // Alternative field name
      applicant.profile?.profileImageUrl,  // Nested in profile object
      applicant.profile?.profileImage,     // Alternative nested
      applicant.logo,                      // Direct logo field
      applicant.imageUrl,                  // Alternative
      applicant.avatar,                    // Another alternative
      applicant.photo,                     // Another alternative
      applicant.profilePicture,            // Another alternative
    ];
    
    // Return first valid URL
    for (const path of possiblePaths) {
      if (path && typeof path === 'string' && path.trim() !== '') {
        return path;
      }
    }
    
    return null;
  };

  // Helper function to get applicant initials for fallback
  const getApplicantInitials = (applicant) => {
    if (!applicant?.name) return 'U';
    const words = applicant.name.trim().split(' ');
    if (words.length === 1) return words[0].charAt(0).toUpperCase();
    return (words[0].charAt(0) + words[words.length - 1].charAt(0)).toUpperCase();
  };

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
            .header { background: linear-gradient(135deg, #143694 0%, #1e4ed8 100%); color: white; padding: 15px 20px; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 2px 10px rgba(0,0,0,0.1); position: sticky; top: 0; z-index: 1000; }
            .header h1 { font-size: 18px; font-weight: 600; margin: 0; }
            .controls { display: flex; gap: 10px; }
            .controls button { background: white; color: #143694; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer; font-weight: 500; font-size: 14px; transition: all 0.2s; display: flex; align-items: center; gap: 5px; }
            .controls button:hover { background: #f8fafc; transform: translateY(-1px); box-shadow: 0 2px 5px rgba(0,0,0,0.1); }
            .pdf-container { width: 100%; height: calc(100vh - 60px); }
            iframe { width: 100%; height: 100%; border: none; }
            .loading { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; color: #666; }
            .spinner { border: 3px solid #f3f3f3; border-top: 3px solid #143694; border-radius: 50%; width: 40px; height: 40px; animation: spin 1s linear infinite; margin-bottom: 15px; }
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
        // Get applicant logo for conversation
        const applicantLogo = getApplicantLogo(applicant.applicant);
        
        const conversationUser = {
          _id: userId,
          name: applicant.applicant.name || 'Unknown Applicant',
          email: applicant.applicant.email || '',
          profileImage: applicantLogo || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png',
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

  const ApplicantDetailsModal = () => {
    if (!selectedApplicant) return null;
    
    const applicant = selectedApplicant.applicant;
    const currentStatus = selectedApplicant.currentStatus || 'Applied';
    const applicantLogo = getApplicantLogo(applicant);
    const applicantInitials = getApplicantInitials(applicant);
    
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
                    className="w-20 h-20 rounded-full object-cover mr-4 border-2 border-gray-200"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      if (e.target.nextElementSibling) {
                        e.target.nextElementSibling.style.display = 'flex';
                      }
                    }}
                  />
                ) : null}
                <div 
                  className={`${applicantLogo ? 'hidden' : 'flex'} w-20 h-20 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 items-center justify-center text-gray-600 text-2xl font-bold mr-4`}
                >
                  {applicantInitials}
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

            {/* Action Buttons */}
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
                const applicantLogo = getApplicantLogo(applicant);
                const applicantInitials = getApplicantInitials(applicant);
                
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
                              className="w-16 h-16 rounded-full object-cover mr-4 hover:opacity-90 transition-opacity border border-gray-200"
                              onError={(e) => {
                                e.target.style.display = 'none';
                                if (e.target.nextElementSibling) {
                                  e.target.nextElementSibling.style.display = 'flex';
                                }
                              }}
                            />
                          ) : null}
                          <div 
                            className={`${applicantLogo ? 'hidden' : 'flex'} w-16 h-16 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 items-center justify-center text-gray-600 text-lg mr-4 hover:bg-gray-300 transition-colors cursor-pointer`}
                            onClick={() => handleViewApplicantDetails(application)}
                          >
                            {applicantInitials}
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

                      {/* Quick Info */}
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
                          onClick={() => handleViewResume(application)}
                          disabled={
                            !application?.applicant?.resumeUrl &&
                            !application?.applicant?.resume &&
                            !application?.applicant?.cv
                          }
                          className={`p-2 border rounded-lg transition-all duration-200 ${
                            application?.applicant?.resumeUrl ||
                            application?.applicant?.resume ||
                            application?.applicant?.cv
                              ? 'bg-purple-100 text-purple-700 border-purple-200 hover:bg-purple-200'
                              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          }`}
                          title="View Resume"
                        >
                          <FileText size={16} />
                        </button>
                        
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