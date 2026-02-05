import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { acceptCandidate, getApplicationsForJob, rejectCandidate, shortlistCandidate, getCollegeApplicationsForJob } from '@/lib/Company_AxiosInstance';
import toast from 'react-hot-toast';
import useConversation from '@/statemanage/useConversation';
import { conversationWithCollege } from '@/lib/College_AxiosIntance';

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
  School,
  UserCircle,
  Building2,
  Percent,
  Clock,
  Briefcase as BriefcaseIcon
} from 'lucide-react';
import { format, isValid } from 'date-fns';

// ==================== Helper Function for Logo Extraction ====================
const getApplicantLogo = (applicantData) => {
  if (!applicantData) return null;
  
  // Priority order for logo extraction
  const possiblePaths = [
    applicantData.profileImageUrl,      // Most common
    applicantData.profileImage,         // Alternative field
    applicantData.logo,                 // Direct logo field
    applicantData.profilePicture,       // Another possible field
    applicantData.avatar,               // Avatar field
    applicantData.image,                // Generic image field
    applicantData.profilePhoto,         // Profile photo field
    applicantData.photo,                // Photo field
    applicantData.thumbnail,            // Thumbnail
    applicantData.picture               // Picture field
  ];
  
  // Find the first valid URL
  for (const path of possiblePaths) {
    if (path && typeof path === 'string' && path.trim() !== '') {
      // Check if it looks like a valid URL or data URL
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
  
  // Get logo for modal
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

  // Modal DetailRow Component
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
              : applicationData.currentStatus === 'Shortlisted'
              ? 'bg-yellow-500 text-white'
              : 'bg-blue-500 text-white'
          }`}>
            {applicationData.currentStatus || 'Applied'}
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
            <p className="font-semibold text-gray-700 text-sm mb-1">Applied On</p>
            <p className="text-gray-900">{safeFormatDate(applicationData?.createdAt)}</p>
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

// ResumeViewerModal component remains the same...
const ResumeViewerModal = ({ isOpen, onClose, resumeUrl, applicantName, onDownload }) => {
  if (!isOpen || !resumeUrl) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/75 p-4">
      <div className="bg-white rounded-2xl w-full max-w-6xl h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-gray-900">{applicantName}'s Resume</h3>
              <p className="text-sm text-gray-500">View and download candidate's resume</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {onDownload && (
              <button
                onClick={onDownload}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all"
                title="Download Resume"
              >
                <Download className="h-4 w-4" />
                <span className="text-sm font-medium">Download</span>
              </button>
            )}
            <button
              onClick={() => window.open(resumeUrl, '_blank')}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              title="Open in new tab"
            >
              <Maximize2 className="h-5 w-5" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* PDF Viewer */}
        <div className="flex-1 overflow-hidden bg-gray-50">
          {resumeUrl.match(/\.(pdf|PDF)$/) || 
           resumeUrl.includes('pdf') || 
           resumeUrl.startsWith('data:application/pdf') ? (
            <iframe
              src={`${resumeUrl}#toolbar=0&navpanes=0&scrollbar=0`}
              title={`${applicantName} Resume`}
              className="w-full h-full border-0"
              style={{ backgroundColor: '#f8fafc' }}
            />
          ) : resumeUrl.includes('cloudinary.com') ? (
            <div className="h-full flex items-center justify-center">
              <iframe
                src={`${resumeUrl}?fl_attachment`}
                title={`${applicantName} Resume`}
                className="w-full h-full border-0"
              />
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center p-8">
                <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h4 className="text-lg font-semibold text-gray-700 mb-2">Resume Preview</h4>
                <p className="text-gray-500 mb-4">Opening resume in new window...</p>
                <button
                  onClick={() => window.open(resumeUrl, '_blank')}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700"
                >
                  <ExternalLink className="h-4 w-4" />
                  Open Resume
                </button>
              </div>
            </div>
          )}
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
const ApplicantDetails = ({ job, isVisited, onClose }) => {
  const [jobId, setJobId] = useState(job._id);
  const jobType = job.jobType;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedResume, setSelectedResume] = useState({
    url: null,
    name: null,
    applicantData: null
  });
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedApplicantModal, setSelectedApplicantModal] = useState({
    isOpen: false,
    applicant: null,
    application: null
  });

  const navigate = useNavigate();
  const { setSelectedConversation } = useConversation();

  const getApplicants = async (targetId, targetType, targetVisited) => {
    setLoading(true);
    setError(null);
    try {
      const response = await getApplicationsForJob(
        targetId, 
        targetType, 
        "Applied", 
        targetVisited
      );
      
      // Log the response to see what data we're getting
      console.log('🔍 Applicants API Response:', {
        count: response.data?.length,
        sampleApplicant: response.data?.[0]?.applicant,
        logoFields: response.data?.map(app => ({
          name: app.applicant?.name,
          profileImageUrl: app.applicant?.profileImageUrl,
          profileImage: app.applicant?.profileImage,
          logo: app.applicant?.logo
        }))
      });
      
      setApplications(response.data || []);
      if (targetVisited === "true" && response.data?.length > 0) {
        // await markApplicationsVisited(targetId, targetType, "Applied");
      }
    } catch (error) {
      console.log("Error: ", error);
      setError("Failed to load applicants");
    } finally {
      setLoading(false);
      setIsSubmitting(false);
    }
  };

  const refreshList = () => getApplicants(jobId, jobType, isVisited);

  const acceptApplicant = async (applicationId) => {
    setIsSubmitting(true);
    try {
      const response = await acceptCandidate(applicationId, job?.jobRoles);
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

  const shortlistApplicant = async (applicationId) => {
    setIsSubmitting(true);
    try {
      const response = await shortlistCandidate(applicationId, job?.jobRoles);
      if (response?.data?.success === true) {
        toast.success("Candidate Shortlisted!");
        refreshList();
      } else {
        toast.error(response.response?.data?.msg || 'Failed to shortlist candidate');
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
      getApplicants(jobId, jobType, isVisited);
    }
  }, [jobId, isVisited]);

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

  const safeFormatDate = (dateString, formatStr = 'MMM d, yyyy') => {
    if (!dateString) return 'Not Specified';
    try {
      const date = new Date(dateString);
      return isValid(date) ? format(date, formatStr) : 'Invalid Date';
    } catch (error) {
      return 'Invalid Date';
    }
  };

  const getAllApplicantLocations = () => {
    if (!applications || applications.length === 0) return [];
    
    const allLocations = applications
      .map(app => {
        const applicantData = app?.applicant || {};
        const location = 
          applicantData.locations || 
          applicantData.location || 
          applicantData.currentLocation ||
          applicantData.currentCity ||
          applicantData.city ||
          applicantData.preferredLocation ||
          applicantData.address;
        return location;
      })
      .filter(location => location != null && location !== '')
      .flatMap(location => {
        if (Array.isArray(location)) {
          return location.map(item => {
            if (typeof item === 'string') return item.trim();
            if (typeof item === 'number') return String(item);
            if (item && typeof item === 'object') {
              return item.city || item.name || item.location || JSON.stringify(item);
            }
            return String(item);
          }).filter(item => item && item.trim() !== '');
        } 
        else if (typeof location === 'string') {
          return location.split(/[,;|/]/)
            .map(loc => loc.trim())
            .filter(loc => loc !== '');
        }
        else if (typeof location === 'number') {
          return [String(location)];
        }
        else if (location && typeof location === 'object') {
          const extracted = [];
          if (location.city) extracted.push(location.city);
          if (location.state) extracted.push(location.state);
          if (location.country) extracted.push(location.country);
          if (location.name) extracted.push(location.name);
          if (location.address) extracted.push(location.address);
          return extracted.filter(item => item && item.trim() !== '');
        }
        return [String(location)].filter(item => item && item.trim() !== '');
      })
      .map(location => typeof location === 'string' ? location.trim() : String(location).trim())
      .filter(location => location && location !== '' && location !== 'null' && location !== 'undefined');
    
    return [...new Set(allLocations)];
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

      {/* Resume Viewer Modal */}
      <ResumeViewerModal
        isOpen={isResumeModalOpen}
        onClose={() => {
          setIsResumeModalOpen(false);
          setSelectedResume(null);
        }}
        resumeUrl={selectedResume?.url}
        applicantName={selectedResume?.name}
      />

      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-6">
          <button
            onClick={onClose}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ChevronLeft size={20} />
            Back to Drives
          </button>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center mb-4">
              <div className="p-3 bg-blue-100 rounded-md mr-4">
                <Building className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Applicants for: {job?.jobRoles?.[0] || 'Job Position'}
                </h1>
                <div className="flex flex-wrap items-center gap-3 mt-2">
                  <span className="inline-flex items-center text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-lg">
                    <FileText size={14} className="mr-1.5" />
                    {job?.jobType || 'Job Type'}
                  </span>
                  <span className="inline-flex items-center text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-lg">
                    <Users size={14} className="mr-1.5" />
                    {applications.length} Applicant{applications.length !== 1 ? 's' : ''}
                  </span>
                  
                  {(() => {
                    const locations = getAllApplicantLocations();
                    return locations.length > 0 && (
                      <span className="inline-flex items-center text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-lg">
                        <MapPin size={14} className="mr-1.5" />
                        Applicants from: {locations.slice(0, 3).join(', ')}
                        {locations.length > 3 && ` +${locations.length - 3} more`}
                      </span>
                    );
                  })()}
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
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No applicants found</h3>
            <p className="text-gray-600">No applicants have applied for this position yet.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {applications.map((applicant) => {
              const applicantData = applicant?.applicant || {};
              const currentStatus = applicant?.currentStatus || 'Applied';
              const applicantLogo = getApplicantLogo(applicantData);
              
              return (
                <div key={applicant._id} className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all duration-200">
                  {/* Applicant Header */}
                  <div className="p-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                      <div className="flex items-start gap-4 mb-4 md:mb-0">
                        <div className="relative w-16 h-16 rounded-md overflow-hidden bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
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
                            <User className="h-8 w-8 text-blue-600" />
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
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                              currentStatus === 'Accepted' 
                                ? 'bg-green-100 text-green-800 border border-green-300'
                                : currentStatus === 'Rejected'
                                ? 'bg-red-100 text-red-800 border border-red-300'
                                : currentStatus === 'Shortlisted'
                                ? 'bg-yellow-100 text-yellow-800 border border-yellow-300'
                                : 'bg-blue-100 text-blue-800 border border-blue-300'
                            }`}>
                              {currentStatus}
                            </span>
                          </div>
                          {/* Basic info */}
                          <div className="flex flex-wrap items-center gap-3 mt-2">
                            <span className="inline-flex items-center text-sm text-gray-600">
                              <MapPin size={14} className="mr-1.5" />
                              {applicantData.locations || 'Location not specified'}
                            </span>
                            {applicantData.degree && (
                              <span className="inline-flex items-center text-sm text-gray-600">
                                <GraduationCap size={14} className="mr-1.5" />
                                {applicantData.degree}
                              </span>
                            )}
                            {applicantData.designation && (
                              <span className="inline-flex items-center text-sm text-gray-600">
                                <Briefcase size={14} className="mr-1.5" />
                                {applicantData.designation}
                              </span>
                            )}
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
                    <div className="flex flex-col sm:flex-row gap-4">
                      <button
                        onClick={() => handleViewResume(applicant)}
                        disabled={false}
                        className={`flex items-center justify-center flex-1 py-2.5 font-medium rounded-lg transition-all duration-200 ${
                          !applicantData.resume && !applicantData.resumeUrl && !applicantData.cv
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700 shadow-sm hover:shadow'
                        }`}
                        title={!applicantData.resume && !applicantData.resumeUrl && !applicantData.cv ? 'No resume available' : 'View Resume'}
                      >
                        <Eye size={16} className="mr-2" />
                        View Resume
                      </button>
                      
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
                        onClick={() => shortlistApplicant(applicant._id)}
                        disabled={isSubmitting || currentStatus === 'Shortlisted'}
                        className={`flex items-center justify-center flex-1 py-2.5 font-medium rounded-lg transition-colors duration-200 ${
                          currentStatus === 'Shortlisted'
                            ? 'bg-yellow-100 text-yellow-700 cursor-not-allowed'
                            : 'bg-white border border-gray-300 text-yellow-600 hover:bg-gray-50'
                        } disabled:opacity-50`}
                      >
                        <Star size={16} className="mr-2" />
                        {currentStatus === 'Shortlisted' ? 'Shortlisted' : 'Shortlist'}
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
                        {currentStatus === 'Accepted' ? 'Accepted' : 'Accept'}
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
    </div>
  );
};

export default ApplicantDetails;