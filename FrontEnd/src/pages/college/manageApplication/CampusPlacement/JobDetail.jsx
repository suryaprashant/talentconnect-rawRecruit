
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate,useLocation } from 'react-router-dom';
import { getApplicationByJobOfManagement, conversationWithCollege, rejectCompanyApplicationForCollege, shortlistCompanyByCollege } from '@/lib/College_AxiosIntance.js';
import useConversation from '@/statemanage/useConversation.js';
import { ArrowLeft, Briefcase, Globe, MapPin, Send, Phone, Linkedin, Mail, Building2 } from 'lucide-react';
import toast from 'react-hot-toast';


const Spinner = () => (
  <div className="flex justify-center items-center h-full">
    <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>
  </div>
);

const ApplicantCard = ({ applicationData, jobRole, onStatusChange }) => {
  const navigate = useNavigate();  
  const { setSelectedConversation } = useConversation();
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
            <h3 className="text-xl font-bold text-gray-800">{companyDetails?.companyName}</h3>
            <span className={`px-3 py-1 text-xs font-semibold rounded-full ${currentStatus === 'Shortlisted' ? 'bg-green-100 text-green-800' : currentStatus === 'Rejected' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
              }`}>
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
            <span className="mx-1"> | Established :{companyDetails?.establishedYear}</span>
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4 border-t pt-4">
        <button
          onClick={handleShortlist}
          disabled={isProcessing}
          className={`w-full text-white px-4 py-2 rounded-md font-semibold transition-colors text-center text-sm ${currentStatus === 'Shortlisted'
              ? 'bg-green-600 hover:bg-green-700'
              : 'bg-blue-600 hover:bg-blue-700'
            } ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isProcessing && currentStatus !== 'Rejected' ? 'Shortlisting...' : (currentStatus === 'Shortlisted' ? 'Shortlisted' : 'Shortlist')}
        </button>
        <button
          onClick={handleReject}
          disabled={isProcessing}
          className={`w-full text-white px-4 py-2 rounded-md font-semibold transition-colors text-center text-sm ${currentStatus === 'Rejected'
              ? 'bg-red-700 hover:bg-red-800'
              : 'bg-red-500 hover:bg-red-600'
            } ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isProcessing && currentStatus !== 'Shortlisted' ? 'Rejecting...' : (currentStatus === 'Rejected' ? 'Rejected' : 'Reject')}
        </button>
        <button
          onClick={handleMessageClick}
          disabled={isProcessing}
          className={`w-full bg-gray-500 text-white px-4 py-2 rounded-md font-semibold hover:bg-gray-600 transition-colors flex items-center justify-center text-center text-sm ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <Send size={14} className="mr-2" /> Message
        </button>
      </div>
    </div>
  );
};

function JobDetailPage() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const pathParts = useLocation().pathname.split('/').filter(Boolean); 
  const targetStatusKey = pathParts[pathParts.length - 2];
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [jobRole, setJobRole] = useState("On-campus");

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
        const response = await getApplicationByJobOfManagement(jobId, 'On-campus', targetStatusKey);
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
  }, [jobId,targetStatusKey]);

  if (loading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center"><Spinner /></div>;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center text-red-500">
        <h2 className="text-2xl font-bold mb-4">An Error Occurred</h2>
        <p>{error}</p>
        <button onClick={() => navigate(-1)} className="mt-6 bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 flex items-center">
          <ArrowLeft size={18} className="mr-2" /> Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-800">Applicant Colleges ({applicants.length})</h1>
          <button onClick={() => navigate(-1)} className="text-sm text-gray-600 hover:text-black font-semibold flex items-center">
            <ArrowLeft size={16} className="mr-1" /> Back to Jobs
          </button>
        </div>
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
              <p className="text-gray-500">There are no college applications for this job yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default JobDetailPage;
