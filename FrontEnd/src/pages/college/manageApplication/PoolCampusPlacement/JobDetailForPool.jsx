import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getApplicationByJobOfManagement } from '@/lib/College_AxiosIntance';
import { ArrowLeft, Briefcase, Globe, MapPin, Send, Phone, Linkedin, Mail, Building2 } from 'lucide-react';

const Spinner = () => (
    <div className="flex justify-center items-center h-full">
        <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>
    </div>
);

const ApplicantCard = ({ applicationData }) => {
    if (!applicationData || !applicationData.applicant) {
        return null;
    }

    const { applicant, currentStatus, createdAt } = applicationData;
    const { companyDetails, profileImageUrl, employerDetails } = applicant;

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
                        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                            currentStatus === 'Shortlisted' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                            {currentStatus}
                        </span>
                    </div>
                    
                    <div className="mt-2 space-y-1.5 text-sm text-gray-600">
                        <div className="flex items-center">
                            <Building2 size={14} className="mr-2.5 text-gray-400" />
                            <span>Type: {companyDetails?.companyType || 'N/A'}</span>
                        </div>
                        <div className="flex items-center">
                            <Briefcase size={14} className="mr-2.5 text-gray-400" />
                            <span>Industry: {companyDetails?.industryType || 'N/A'}</span>
                        </div>
                        <div className="flex items-center">
                            <MapPin size={14} className="mr-2.5 text-gray-400" />
                            <span>{companyDetails?.city || 'N/A'}, {companyDetails?.state || 'N/A'}</span>
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
                    </p>
                </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4 border-t pt-4">
                <button className="w-full bg-blue-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-blue-700 transition-colors text-center text-sm">Shortlist</button>
                <button className="w-full bg-red-500 text-white px-4 py-2 rounded-md font-semibold hover:bg-red-600 transition-colors text-center text-sm">Reject</button>
                <button className="w-full bg-gray-500 text-white px-4 py-2 rounded-md font-semibold hover:bg-gray-600 transition-colors flex items-center justify-center text-center text-sm">
                    <Send size={14} className="mr-2" /> Message
                </button>
            </div>
        </div>
    );
};

function JobDetail() {
    const { jobId } = useParams();
    const navigate = useNavigate();
    
    const [applicants, setApplicants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!jobId) {
            setError("Job ID is missing from the URL.");
            setLoading(false);
            return;
        }

        const fetchApplicants = async () => {
            try {
                const response = await getApplicationByJobOfManagement(jobId, 'Pool-campus');
                if (response.data && Array.isArray(response.data)) {
                    setApplicants(response.data);
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
    }, [jobId]);

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
                            <ApplicantCard key={application._id} applicationData={application} />
                        ))
                    ) : (
                        <div className="text-center py-12 bg-white rounded-lg border">
                            <p className="text-gray-500">There are no college applications for this job drive yet.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default JobDetail;
