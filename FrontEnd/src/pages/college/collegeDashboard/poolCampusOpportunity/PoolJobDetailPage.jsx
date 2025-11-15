import React, { useEffect, useState } from 'react';
import { useParams, Link, useSearchParams, useNavigate } from 'react-router-dom';
import { MapPin, Building, Calendar, Globe, Mail, Phone, Linkedin, CheckCircle, Info, Download } from 'lucide-react';
import { ApplyForPoolCampus, SaveOppurtunity, getPoolCampusJobById } from '@/lib/College_AxiosIntance';
import toast from 'react-hot-toast';
import { viewed } from '@/lib/User_AxiosInstance';

// Utility function to format date
const formatDate = (dateString) => {
    if (!dateString || dateString === 'Not Specified') return 'Not Specified';
    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) { // Check for invalid date
            return 'Not Specified';
        }
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    } catch (error) {
        console.error("Error formatting date:", error);
        return 'Not Specified';
    }
};

const PoolJobDetailsPage = () => {
    const { id } = useParams();
    const [searchParams] = useSearchParams();
    const isApplied = (searchParams.get('isApplied') || '').toLowerCase() === 'true';
    const isSaved = (searchParams.get('isSaved') || '').toLowerCase() === 'true';
    const [jobDetails, setJobDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [saved, setSaved] = useState(false);
    const navigate = useNavigate();
    const handleGoBack = () => {
        navigate(-1);
    };

    useEffect(() => {
        const fetchJobDetails = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await getPoolCampusJobById(id);
                setJobDetails(response.data);
                await viewed(response.data._id);
            } catch (err) {
                console.error("Error fetching job details:", err);
                setError("Failed to fetch job details. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchJobDetails();
        }
    }, [id]);

    const handleApply = async () => {
        try {
            const response = await ApplyForPoolCampus(id);
            if (response.data?.success === true) toast.success("Applied!");
            else toast.error(response.response?.data?.msg || "Could not apply.");
        } catch (error) {
            console.log("Error: ", error);
            toast.error('Something went wrong');
        }
    };

    const handleSave = async (jobId, jobType) => {
        if (!jobId || !jobType) return;
        try {
            const response = await SaveOppurtunity(jobId, jobType);
            if (response.data?.success === true) {
                toast.success("Saved!");
                setSaved(true); // Update save state on success
            }
            else toast.error(response.response?.data?.msg || "Could not save.");
        } catch (error) {
            console.log("Error: ", error);
            toast.error('Something went wrong');
        }
    };

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: `Pool Campus Drive at ${jobDetails?.companyPosted?.companyDetails?.companyName}`,
                text: `Check out this pool campus opportunity at ${jobDetails?.companyPosted?.companyDetails?.companyName}!`,
                url: window.location.href,
            })
                .catch((error) => console.log('Error sharing', error));
        } else {
            navigator.clipboard.writeText(window.location.href)
                .then(() => alert('Link copied to clipboard!'))
                .catch(() => alert('Failed to copy link'));
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading registration details...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center text-center p-4">
                <div>
                    <p className="text-red-600 text-xl">{error}</p>
                    <button onClick={() => window.location.reload()} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    if (!jobDetails) {
        return (
            <div className="min-h-screen flex items-center justify-center text-center p-4">
                <div>
                    <h2 className="text-2xl font-semibold mb-2">Job not found</h2>
                    <p className="text-gray-600 mb-4">The opportunity you're looking for doesn't exist or has been removed.</p>
                    <button onClick={() => handleGoBack()} className="text-blue-600 hover:text-blue-800">
                        Back
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <button onClick={() => handleGoBack()} className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                    </svg>
                    Back
                </button>

                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    {/* Header Section */}
                    <div className="border-b border-gray-200 p-6">
                        <div className="bg-green-50 text-green-800 py-2 px-4 text-sm mb-6 rounded-md flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            Registration Open
                        </div>
                        <div className="flex flex-col md:flex-row justify-between">
                            <div className="flex items-start mb-4 md:mb-0">
                                <div className="w-14 h-14 bg-gray-200 rounded-md flex items-center justify-center mr-4 overflow-hidden">
                                    {jobDetails.companyPosted?.profileImageUrl ? (
                                        <img
                                            src={jobDetails.companyPosted.profileImageUrl}
                                            alt={`${jobDetails.companyPosted?.companyDetails?.companyName} logo`}
                                            className="w-full h-full object-contain"
                                        />
                                    ) : (
                                        <Building className="w-8 h-8 text-gray-500" />
                                    )}
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900">{jobDetails.companyPosted?.companyDetails?.companyName || 'Not Specified'}</h1>
                                    <div className="flex items-center mt-1">
                                        <Calendar className="h-4 w-4 text-gray-500 mr-2" />
                                        <p className="text-sm text-gray-600">{formatDate(jobDetails.startDate)} - {formatDate(jobDetails.endDate)}</p>
                                    </div>
                                    <div className="flex items-center mt-1">
                                        <Globe className="h-4 w-4 text-gray-500 mr-2" />
                                        <a
                                            href={jobDetails.companyPosted?.companyDetails?.websiteUrl ? `https://${jobDetails.companyPosted.companyDetails.websiteUrl}` : '#'}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-sm text-blue-600 hover:text-blue-800"
                                        >
                                            {jobDetails.companyPosted?.companyDetails?.websiteUrl || 'Not specified'}
                                        </a>
                                    </div>
                                    {/* Hiring Venue  */}
                                    <div className="flex items-center mt-1">
                                        <MapPin className="h-4 w-4 text-gray-500 mr-2" />
                                        <p className="text-sm text-gray-600">{jobDetails?.venue || 'Venue Not Specified'}</p>
                                    </div>

                                    <div className="flex space-x-2 mt-5">
                                        {!isApplied && (<>
                                            <button
                                                onClick={handleApply}
                                                className="bg-black text-white px-5 py-2 rounded-md hover:bg-gray-800 transition duration-200">
                                                Register Now
                                            </button>
                                            {!isSaved && (<button
                                                onClick={() => handleSave(jobDetails?._id, "Pool-campus")}
                                                disabled={saved}
                                                className={`inline-flex items-center justify-center px-4 py-2 border ${saved ? 'border-gray-400 bg-gray-100 text-gray-500 cursor-not-allowed' : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'} text-sm font-medium rounded-md focus:outline-none`}
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 mr-2 ${saved ? 'text-blue-600' : 'text-gray-500'}`} viewBox="0 0 20 20" fill={saved ? 'currentColor' : 'none'} stroke="currentColor">
                                                    <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                                                </svg>
                                                {saved ? 'Saved' : 'Save'}
                                            </button>)}
                                        </>)}
                                        <button
                                            onClick={handleShare}
                                            className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                                                <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                                            </svg>
                                            Share
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* All subsequent sections */}
                    <div className="px-6 py-6 border-t border-gray-200">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">About {jobDetails.companyPosted?.companyDetails?.companyName || 'the Company'}</h2>
                        <p className="text-gray-700 mb-6">{jobDetails.companyPosted?.companyDetails?.description || 'No description provided.'}</p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <div className="text-2xl font-bold text-gray-900">{jobDetails.companyPosted?.companyDetails?.numberOfEmployees || 'N/A'}</div>
                                <div className="text-sm text-gray-600">Employees</div>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <div className="text-2xl font-bold text-gray-900">{jobDetails.companyPosted?.companyDetails?.industryType || 'N/A'}</div>
                                <div className="text-sm text-gray-600">Industries</div>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <div className="text-2xl font-bold text-gray-900">{jobDetails.companyPosted?.companyDetails?.country || 'N/A'}</div>
                                <div className="text-sm text-gray-600">Countries</div>
                            </div>
                        </div>
                    </div>

                    <div className="px-6 py-6 border-t border-gray-200">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Job Description</h2>
                        <div className="prose max-w-none text-gray-700">
                            <p className="mb-4">{jobDetails?.description || 'No job description provided.'}</p>
                        </div>
                    </div>

                    <div className="px-6 py-6 border-t border-gray-200">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Job Details</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
                            <div>
                                <div className="text-sm font-medium text-gray-500">Employment Type</div>
                                <div className="mt-1 text-base text-gray-900">{jobDetails?.employmentType?.join(', ') || 'Not Specified'}</div>
                            </div>
                            <div>
                                <div className="text-sm font-medium text-gray-500">Job Roles</div>
                                <div className="mt-1 text-base text-gray-900">{jobDetails?.jobRoles?.join(', ') || 'Not Specified'}</div>
                            </div>
                            <div>
                                <div className="text-sm font-medium text-gray-500">Work Mode</div>
                                <div className="mt-1 text-base text-gray-900">{jobDetails?.workMode?.join(', ') || 'Not Specified'}</div>
                            </div>
                            <div>
                                <div className="text-sm font-medium text-gray-500">Number of rounds to be held</div>
                                <div className="mt-1 text-base text-gray-900">{jobDetails?.rounds?.join(', ') || 'Not Specified'}</div>
                            </div>
                            <div>
                                <div className="text-sm font-medium text-gray-500">Job Location</div>
                                <div className="mt-1 text-base text-gray-900">{jobDetails?.workLocation?.join(', ') || 'Not Specified'}</div>
                            </div>
                            {/* --- NEWLY ADDED --- */}
                            <div>
                                <div className="text-sm font-medium text-gray-500">Preferred Hiring Mode</div>
                                <div className="mt-1 text-base text-gray-900">{jobDetails?.companyHiringPreference?.preferredMode || 'Not Specified'}</div>
                            </div>
                            {/* --- END NEW --- */}
                        </div>
                    </div>

                    <div className="px-6 py-6 border-t border-gray-200">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Required Skills</h2>
                        <div className="flex flex-wrap gap-2">
                            {jobDetails?.skills?.length > 0 ? (
                                jobDetails.skills.map((skill, index) => (
                                    <span key={index} className="bg-gray-100 text-gray-800 px-3 py-1.5 rounded-md text-sm font-medium">
                                        {skill}
                                    </span>
                                ))
                            ) : (
                                <p className="text-gray-500">No specific skills mentioned.</p>
                            )}
                        </div>
                    </div>

                    <div className="px-6 py-6 border-t border-gray-200">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Amenity/Facility Required</h2>
                        <div className="flex flex-wrap gap-2">
                            {jobDetails?.amenitiesRequired?.length > 0 ? (
                                jobDetails.amenitiesRequired.map((amenity, index) => (
                                    <span key={index} className="bg-gray-100 text-gray-800 px-3 py-1.5 rounded-md text-sm font-medium">
                                        {amenity}
                                    </span>
                                ))
                            ) : (
                                <p className="text-gray-500">No amenities specified.</p>
                            )}
                        </div>
                    </div>

                    {/* --- SECTION UNCOMMENTED AND POPULATED --- */}
                    <div className="px-6 py-6 border-t border-gray-200">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Eligibility Criteria</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8 mb-4">
                            <div>
                                <div className="text-sm font-medium text-gray-500">Drive Open To (College Type)</div>
                                <div className="mt-1 text-base text-gray-900">{jobDetails?.collegeTypes?.join(', ') || 'Not Specified'}</div>
                            </div>
                            <div>
                                <div className="text-sm font-medium text-gray-500">Eligible College Categories</div>
                                <div className="mt-1 text-base text-gray-900">{jobDetails?.collegeCategories?.join(', ') || 'Not Specified'}</div>
                            </div>
                            <div>
                                <div className="text-sm font-medium text-gray-500">Eligible Degrees / Streams</div>
                                <div className="mt-1 text-base text-gray-900">{jobDetails?.studentStreams?.join(', ') || 'Not Specified'}</div>
                            </div>
                            <div>
                                <div className="text-sm font-medium text-gray-500">Minimum Students Required</div>
                                <div className="mt-1 text-base text-gray-900">{jobDetails?.minimumStudents || 'Not Specified'}</div>
                            </div>
                        </div>
                        {(typeof jobDetails.eligibilityCriteria === 'string' && jobDetails.eligibilityCriteria) && (
                            <div>
                                <div className="text-sm font-medium text-gray-500">Additional Criteria</div>
                                <p className="mt-1 text-base text-gray-700">{jobDetails.eligibilityCriteria}</p>
                            </div>
                        )}
                    </div>
                    {/* --- END SECTION --- */}

                    <div className="px-6 py-6 border-t border-gray-200">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Compensation & Benefits</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <div className="text-sm font-medium text-gray-500">Total CTC</div>
                                <div className="text-xl font-bold text-gray-900">
                                    {jobDetails?.packageDetails?.totalCTC
                                        ? `${jobDetails.packageDetails.currency || ''} ${jobDetails.packageDetails.totalCTC.toLocaleString()}`
                                        : 'Not Specified'}
                                </div>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <div className="text-sm font-medium text-gray-500">Fixed Pay</div>
                                <div className="text-xl font-bold text-gray-900">
                                    {jobDetails?.packageDetails?.fixedPay
                                        ? `${jobDetails.packageDetails.currency || ''} ${jobDetails.packageDetails.fixedPay.toLocaleString()}`
                                        : 'N/A'}
                                </div>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <div className="text-sm font-medium text-gray-500">Variable Pay</div>
                                <div className="text-xl font-bold text-gray-900">
                                    {jobDetails?.packageDetails?.joiningBonus
                                        ? `${jobDetails.packageDetails.currency || ''} ${jobDetails.packageDetails.joiningBonus.toLocaleString()}`
                                        : 'N/A'}
                                </div>
                            </div>
                        </div>
                        <h3 className="font-medium text-gray-900 mt-6 mb-2">Benefits Offered</h3>
                        <ul className="list-disc pl-5 space-y-1 text-gray-700">
                            {jobDetails?.benefits?.length > 0 ? jobDetails.benefits.map((benefit, index) => (
                                <li key={index}>{benefit}</li>
                            )) : <li>No benefits specified.</li>}
                        </ul>
                    </div>

                    <div className="px-6 py-6 border-t border-gray-200">
                        <h2 className="text-xl font-bold text-gray-900 mb-6">Selection Process</h2>
                        {jobDetails?.selectionProcess?.length > 0 ? (
                            <div className="relative">
                                <div className="absolute left-4 top-0 h-full w-0.5 bg-blue-200"></div>
                                <div className="space-y-6 pl-10">
                                    {jobDetails.selectionProcess.map((step, index) => (
                                        <div key={index} className="relative flex items-start">
                                            <div className="absolute -left-10 flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white font-semibold">
                                                {index + 1}
                                            </div>
                                            <div className="min-w-0 flex-1 rounded-lg bg-gray-50 p-4 border border-gray-200">
                                                <p className="font-medium text-gray-900">{step}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                <p className="text-gray-500 text-center">Selection process details not provided.</p>
                            </div>
                        )}
                    </div>

                    {/* --- SECTION UPDATED WITH DYNAMIC DATA --- */}
                    <div className="px-6 py-6 border-t border-gray-200">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Important Dates</h2>
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="border border-gray-200 p-4 rounded-md">
                                <p className="text-sm text-gray-500 mb-1">Registration Deadline</p>
                                <p className="font-medium">{formatDate(jobDetails.endDate)}</p>
                            </div>
                            <div className="border border-gray-200 p-4 rounded-md">
                                <p className="text-sm text-gray-500 mb-1">Online Test Date</p>
                                <p className="font-medium">{formatDate(jobDetails.onlineTestDate)}</p>
                            </div>
                            <div className="border border-gray-200 p-4 rounded-md">
                                <p className="text-sm text-gray-500 mb-1">Interview Window</p>
                                <p className="font-medium">{formatDate(jobDetails.interviewWindow?.start)} - {formatDate(jobDetails.interviewWindow?.end)}</p>
                            </div>
                            <div className="border border-gray-200 p-4 rounded-md">
                                <p className="text-sm text-gray-500 mb-1">Offer Rollout</p>
                                <p className="font-medium">{formatDate(jobDetails.offerRolloutDate)}</p>
                            </div>
                        </div>
                    </div>
                    {/* --- END SECTION --- */}


                    <div className="px-6 py-6 border-t border-gray-200">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Company Placement Officer Contact:</h2>
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <div className="flex items-start">
                                <div className="mr-3 flex-shrink-0">
                                    <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-600">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                    </div>
                                </div>
                                <div>
                                    <div className="text-base font-medium text-gray-900">{jobDetails?.contactPerson?.name || 'Not Specified'} <span className='text-sm text-gray-500 '>({jobDetails?.contactPerson?.designation || 'N/A'})</span></div>
                                    {jobDetails?.contactPerson?.email && (
                                        <div className="flex items-center mt-1">
                                            <Mail className="h-4 w-4 text-gray-500 mr-1.5" />
                                            <a href={`mailto:${jobDetails.contactPerson.email}`} className="text-blue-600 hover:text-blue-800 text-sm">{jobDetails.contactPerson.email}</a>
                                        </div>
                                    )}
                                    {jobDetails?.contactPerson?.mobile && (
                                        <div className="flex items-center mt-1">
                                            <Phone className="h-4 w-4 text-gray-500 mr-1.5" />
                                            <a href={`tel:${jobDetails.contactPerson.mobile}`} className="text-blue-600 hover:text-blue-800 text-sm">{jobDetails.contactPerson.mobile}</a>
                                        </div>
                                    )}
                                    {jobDetails?.contactPerson?.linkedin && (
                                        <a href={jobDetails.contactPerson.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center mt-1 text-blue-600 hover:text-blue-800">
                                            <Linkedin className="h-4 w-4 text-gray-500 mr-1.5" />
                                            <span className="text-sm">LinkedIn Profile</span>
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default PoolJobDetailsPage;