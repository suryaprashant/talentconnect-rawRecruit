import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { getApplicationByJobOfManagement, conversationWithCollege, rejectCompanyApplicationForCollege, shortlistCompanyByCollege, acceptCompanies } from '@/lib/College_AxiosIntance.js';
import useConversation from '@/statemanage/useConversation.js';
import { ArrowLeft, Briefcase, Globe, MapPin, Send, Phone, Linkedin, Mail, Building2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useChat } from '@/context/ChatContext';
const CompanyDetailsModal = ({ isOpen, onClose, company }) => {
  if (!isOpen || !company) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-black"
        >
          ✕
        </button>

        <h2 className="text-2xl font-bold mb-2">{company.companyName}</h2>
        <p className="text-sm text-gray-600 mb-4">{company.description || 'No description available.'}</p>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div><b>Industry:</b> {company.industryType || 'N/A'}</div>
          <div><b>Company Type:</b> {company.companyType || 'N/A'}</div>
          <div><b>Founded:</b> {company.establishedYear || 'N/A'}</div>
          <div><b>Employees:</b> {company.numberOfEmployees || 'N/A'}</div>
          <div><b>Phone:</b> {company.phoneNumber || 'N/A'}</div>
          <div><b>Alt Phone:</b> {company.alternatePhoneNumber || 'N/A'}</div>
          <div><b>Email:</b> {company.workEmail || 'N/A'}</div>
          <div><b>City:</b> {company.city || 'N/A'}</div>
          <div><b>State:</b> {company.state || 'N/A'}</div>
          <div><b>Country:</b> {company.country || 'N/A'}</div>
          <div><b>Pincode:</b> {company.pincode || 'N/A'}</div>
        </div>

        {/* Links */}
        <div className="mt-4 flex gap-4 text-sm">
          {company.websiteUrl && (
            <a
              href={company.websiteUrl}
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 hover:underline"
            >
              Website
            </a>
          )}
          {company.companyLinkedin && (
            <a
              href={company.companyLinkedin}
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 hover:underline"
            >
              LinkedIn
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

const Spinner = () => (
  <div className="flex justify-center items-center h-full">
    <div className="w-12 h-12 border-4 border-[#143694] border-t-[#1e4ed8] rounded-full animate-spin"></div>
  </div>
);

const ApplicantCard = ({ applicationData, jobRole, onStatusChange }) => {
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const { setSelectedConversation, setShowFloatingChat } = useChat();  
  const [currentStatus, setCurrentStatus] = useState(applicationData.currentStatus);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!applicationData || !applicationData.applicant) {
    return null;
  }

  const { _id: applicationId, applicant, createdAt } = applicationData;
  const { companyDetails, profileImageUrl, employerDetails, userId } = applicant;

  const handleMessageClick = async (e) => {
    e.stopPropagation();
    try {
      const response = await conversationWithCollege(userId);
      if (response.data) {
        const conversationUser = {
          _id: userId,
          name: companyDetails?.companyName || 'Unknown Company',
          email: employerDetails?.workEmail || '',
          profileImage: profileImageUrl || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png',
          userType: 'company',
          fullname: companyDetails?.companyName || 'Unknown Company'
        };

        console.log("Setting conversation for direct chat:", conversationUser);
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

  const handleShortlist = async (e) => {
    e.stopPropagation();
    if (isProcessing) return;

    if (currentStatus === 'Shortlisted') {
      toast('Company is already Shortlisted!', { icon: 'ℹ️' });
      return;
    }

    setIsProcessing(true);
    try {
      const response = await shortlistCompanyByCollege(applicationId, jobRole);

      if (response.data && response.data.success) {
        const newStatus = 'Shortlisted';
        setCurrentStatus(newStatus);
        onStatusChange(applicationId, newStatus);
        toast.success(`Successfully Shortlisted ${companyDetails?.companyName}.`);
      } else {
        toast.error(response.data?.msg || 'Failed to shortlist company.');
      }
    } catch (error) {
      toast.error('Error shortlisting application.');
      console.error("Shortlist error:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async (e) => {
    e.stopPropagation();
    if (isProcessing) return;

    if (currentStatus === 'Rejected') {
      toast('Company is already Rejected!', { icon: 'ℹ️' });
      return;
    }

    setIsProcessing(true);
    try {
      const response = await rejectCompanyApplicationForCollege(applicationId, jobRole);

      if (response.data && response.data.success) {
        const newStatus = 'Rejected';
        setCurrentStatus(newStatus);
        onStatusChange(applicationId, newStatus);
        toast.success(`Successfully Rejected ${companyDetails?.companyName}.`);
      } else {
        toast.error(response.data?.msg || 'Failed to reject company.');
      }
    } catch (error) {
      toast.error('Error rejecting application.');
      console.error("Reject error:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAccept = async (e) => {
    e.stopPropagation();
    if (isProcessing) return;

    if (currentStatus === 'Accepted') {
      toast('Company is already Accepted!', { icon: 'ℹ️' });
      return;
    }

    setIsProcessing(true);
    try {
      const response = await acceptCompanies(applicationId, jobRole);

      if (response.data && response.data.success) {
        const newStatus = 'Accepted';
        setCurrentStatus(newStatus);
        onStatusChange(applicationId, newStatus);
        toast.success(`Successfully Accepted ${companyDetails?.companyName}.`);
      } else {
        toast.error(response.data?.msg || 'Failed to accept company.');
      }
    } catch (error) {
      toast.error('Error accepting application.');
      console.error("Accept error:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Shortlisted':
        return 'bg-green-100 text-green-800';
      case 'Rejected':
        return 'bg-red-100 text-red-800';
      case 'Accepted':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  const getButtonClass = (status, currentStatus, isProcessing) => {
    const baseClass = `w-full text-white px-4 py-2 rounded-md font-semibold transition-colors text-center text-sm ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`;
    
    switch (status) {
      case 'Shortlisted':
        return `${baseClass} ${currentStatus === 'Shortlisted' ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-[#143694]'}`;
      case 'Rejected':
        return `${baseClass} ${currentStatus === 'Rejected' ? 'bg-red-700 hover:bg-red-800' : 'bg-red-500 hover:bg-red-600'}`;
      case 'Accepted':
        return `${baseClass} ${currentStatus === 'Accepted' ? 'bg-[#143694] hover:bg-purple-700' : 'bg-purple-500 hover:bg-[#143694]'}`;
      default:
        return baseClass;
    }
  };

  const getButtonText = (status, currentStatus, isProcessing) => {
    if (isProcessing && currentStatus !== status) {
      return `${status}ing...`;
    }
    return currentStatus === status ? status : status;
  };

  return (
    <div className="bg-white p-5 rounded-lg border border-gray-200 transition-shadow hover:shadow-md">
      <div className="flex items-start space-x-4">
        <img
          src={profileImageUrl || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSJEApBPkYRaZmScBMYKaEu2hX5pvqzJpXEIA&s'}
          alt={`${companyDetails?.companyName} Logo`}
          className="w-20 h-20 rounded-md object-cover border"
        />
        <div className="flex-grow">
          <div className="flex justify-between items-start">
            <h3
              onClick={() => setShowModal(true)}
              className="text-xl font-bold text-blue-600 hover:underline cursor-pointer"
            >
              {companyDetails?.companyName}
            </h3>

            <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(currentStatus)}`}>
              {currentStatus}
            </span>
          </div>
          <div className="mt-2 space-y-1.5 text-sm text-gray-600">
            <div className="flex items-center">
              <Briefcase size={14} className="mr-2.5 text-gray-400" />
              <span>{companyDetails?.industryType || 'N/A'}</span>
            </div>
            <div className="flex items-center">
              <Building2 size={14} className="mr-2.5 text-gray-400" />
              <span>{companyDetails?.companyType || 'N/A'}</span>
            </div>
            <div className="flex items-center">
              <MapPin size={14} className="mr-2.5 text-gray-400" />
              <span>{companyDetails?.city || 'N/A'}, {companyDetails?.state || 'N/A'}</span>
            </div>
            <div className="flex items-center">
              <Globe size={14} className="mr-2.5 text-gray-400" />
              <a href={companyDetails?.websiteUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                {companyDetails?.websiteUrl ? 'Website' : 'No website provided'}
              </a>
            </div>
            <div className="flex items-center">
              <Mail size={14} className="mr-2.5 text-gray-400" />
              <a href={`mailto:${employerDetails?.workEmail}`} className="text-blue-600 hover:underline">
                {employerDetails?.workEmail || 'No email provided'}
              </a>
            </div>
            <div className="flex items-center">
              <Phone size={14} className="mr-2.5 text-gray-400" />
              <span>{companyDetails?.phoneNumber || 'No phone provided'}</span>
            </div>
            <div className="flex items-center">
              <Linkedin size={14} className="mr-2.5 text-gray-400" />
              <a href={companyDetails?.companyLinkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                {companyDetails?.companyLinkedin ? 'LinkedIn Profile' : 'No LinkedIn provided'}
              </a>
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-2">
            Applied on: {new Date(createdAt).toLocaleDateString()}
            <span className="mx-1"> | Established: {companyDetails?.establishedYear}</span>
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4 border-t pt-4">
        <button
          onClick={handleReject}
          disabled={isProcessing}
          className={getButtonClass('Rejected', currentStatus, isProcessing)}
        >
          {getButtonText('Reject', currentStatus, isProcessing)}
        </button>
        <button
          onClick={handleAccept}
          disabled={isProcessing}
          className={getButtonClass('Accepted', currentStatus, isProcessing)}
        >
          {getButtonText('Accept', currentStatus, isProcessing)}
        </button>
        <button
          onClick={handleMessageClick}
          disabled={isProcessing}
          className={`w-full bg-gray-500 text-white px-4 py-2 rounded-md font-semibold hover:bg-gray-600 transition-colors flex items-center justify-center text-center text-sm ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <Send size={14} className="mr-2" /> Message
        </button>
      </div>
      <CompanyDetailsModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        company={companyDetails}
      />
    </div>
  );
};

const PoolCampusApplicantsPage = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  
  const queryParams = new URLSearchParams(location.search);
  const targetStatus = queryParams.get('targetStatus');
  const isVisited = queryParams.get('isVisited');
  
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [jobRole, setJobRole] = useState("Pool-campus");

  const handleApplicantStatusChange = (applicationId, newStatus) => {
    setApplicants(prevApplicants =>
      prevApplicants.map(app =>
        app._id === applicationId ? { ...app, currentStatus: newStatus } : app
      )
    );
  };

  useEffect(() => {
    if (!jobId) {
      setError("Job ID is missing from the URL.");
      setLoading(false);
      return;
    }

    const fetchApplicants = async () => {
      try {
        const response = await getApplicationByJobOfManagement(
          jobId, 
          'Pool-campus', // Changed from 'On-campus' to 'Pool-campus'
          targetStatus,
          isVisited
        );
        
        if (response.data && Array.isArray(response.data)) {
          setApplicants(response.data);
          if (response.data.length > 0 && response.data[0].job && response.data[0].job.jobTitle) {
            setJobRole(response.data[0].job.jobTitle);
          }
        } else {
          throw new Error("Invalid data format received from server.");
        }
      } catch (err) {
        setError(err.message || "Failed to fetch applicants.");
        console.error("API Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchApplicants();
  }, [jobId, targetStatus, isVisited]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f0e6f7]/60 via-[#d4e8f9]/55 to-[#cff7ea]/60 flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f0e6f7]/60 via-[#d4e8f9]/55 to-[#cff7ea]/60 flex flex-col items-center justify-center text-red-500">
        <h2 className="text-2xl font-bold mb-4">An Error Occurred</h2>
        <p>{error}</p>
        <button onClick={() => navigate(-1)} className="mt-6 bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 flex items-center">
          <ArrowLeft size={18} className="mr-2" /> Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0e6f7]/60 via-[#d4e8f9]/55 to-[#cff7ea]/60">
      {/* Pastel blur background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#fbcfe8]/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 -left-20 w-60 h-60 bg-[#143694]/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-1/3 w-40 h-40 bg-[#a7f3d0]/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="mb-6">
          <button onClick={() => navigate(-1)} className="text-sm text-gray-600 hover:text-black font-semibold flex items-center">
            <ArrowLeft size={16} className="mr-1" /> Back to Pool Campus Opportunities
          </button>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#1e4ed8] to-[#1e40af] bg-clip-text text-transparent mb-2 mt-4">
            Pool Campus Applicants ({applicants.length})
          </h1>
          <p className="text-gray-600 text-sm mb-4">
            Viewing {isVisited === 'false' ? 'new ' : ''}applications {targetStatus ? `with status: ${targetStatus}` : ''}
          </p>
        </div>
        
        <div className="bg-white/90 backdrop-blur-sm border border-white/50 rounded-2xl shadow-lg shadow-blue-50/50 overflow-hidden p-6 mt-4">
          <div className="space-y-4">
            {applicants.length > 0 ? (
              applicants.map(application => (
                <ApplicantCard
                  key={application._id}
                  applicationData={application}
                  jobRole={jobRole}
                  onStatusChange={handleApplicantStatusChange}
                />
              ))
            ) : (
              <div className="text-center py-12 bg-white rounded-lg border">
                <p className="text-gray-500">There are no pool campus applications for this job yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PoolCampusApplicantsPage;