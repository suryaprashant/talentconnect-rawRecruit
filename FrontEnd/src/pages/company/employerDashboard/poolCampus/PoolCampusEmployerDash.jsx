import { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { getPoolCampusJobByIdForCompany } from '../../../../lib/College_AxiosIntance';
import { format } from 'date-fns';
import { ApplyForPoolcampusOppurtunity, SaveOppurtunity } from '@/lib/Company_AxiosInstance';
import toast from 'react-hot-toast';

// --- NEW HELPER ---
// Formats dates but returns 'N/A' if the date is invalid
const formatDateSafe = (dateString) => {
    if (!dateString) return 'N/A';
    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) {
            return 'N/A';
        }
        return format(date, 'MMM d, yyyy');
    } catch (err) {
        return 'N/A';
    }
};
// --- END NEW HELPER ---

const PoolCampusEmployeeDash = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const isApplied = (searchParams.get('isApplied') || '').toLowerCase() === 'true';
    const isSaved = (searchParams.get('isSaved') || '').toLowerCase() === 'true';
    const [posting, setPosting] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchPostingDetails = async () => {
        if (!id) return;
        try {
            setLoading(true);
            setError(null);
            const response = await getPoolCampusJobByIdForCompany(id);
            if (response && response.data) {
                setPosting(response.data);
            } else {
                throw new Error('Posting not found.');
            }
        } catch (err) {
            console.error("Failed to fetch posting details:", err);
            setError('Could not load the requested resource. It might have been removed.');
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchPostingDetails();
    }, [id]);

    // ADDED: Back button handler
    const handleBack = () => {
        navigate(-1); // Go back to previous page (listing page)
    };

    const handleSave = async (jobId) => {
        try {
            const response = await SaveOppurtunity(jobId, posting?.jobType);
            if (response.data?.success === true) toast.success("Saved");
            else toast.error(response?.response.data.msg);
        } catch (error) {
            console.log("Error: ", error);
            toast.error("Something went wrong!");
        }
    };

    const handleApply = async (jobId) => {
        try {
            const response = await ApplyForPoolcampusOppurtunity(jobId);
            if (response.data?.success === true) toast.success("Applied");
            else toast.error(response?.response.data.msg);
        } catch (error) {
            console.log("Error: ", error);
            toast.error(`Something went wrong`);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error || !posting) {
        return (
            <div className="flex flex-col items-center justify-center h-screen">
                <h2 className="text-2xl font-bold mb-4">{error || 'Posting not found'}</h2>
                <button
                    onClick={() => navigate('/company-dashboard/Pool-campus')}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    Back
                </button>
            </div>
        );
    }

    // Convenience variables for easier access
    const collegeDetails = posting.collegePosted;
    const collegeName = collegeDetails?.collegeUniversityDetails?.collegeName || 'the College';
    const coordinator = collegeDetails?.placementCoordinatorDetails;

    return (
        <div className="container mx-auto px-4 py-8">
            {/* ADDED: Back button at the top */}
            <button 
                onClick={handleBack}
                className="flex items-center text-blue-500 hover:text-blue-700 mb-4 transition-colors"
            >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Listing
            </button>
            
            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex flex-col md:flex-row justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-semibold">Pool-Campus Drive Request from:</h1>
                        <h2 className="text-3xl font-bold mb-2">{collegeName}</h2>
                        <div className="flex items-center mb-1">
                            <svg className="w-4 h-4 mr-1 text-gray-600" fill="currentColor" viewBox="0 0 20 20"><path d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1z" /></svg>
                            <span className="text-gray-600 text-sm">
                                {formatDateSafe(posting.startDate)} - {formatDateSafe(posting.endDate)}
                            </span>

                            <a
                                href={collegeDetails?.profileAchievements?.collegeWebsite || '#'}
                                target="_blank"
                                rel="noopener noreferrer"
                                title="Visit College Website"
                                className="flex items-center hover:text-blue-500 ml-5"
                            >
                                <svg className="w-5 h-5 text-gray-600 hover:text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
                                </svg>
                            </a>
                        </div>
                        <div className="flex items-center mb-1 ">
                            <svg className="w-4 h-4 mr-1 text-gray-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /></svg>
                            <span className="text-gray-600 text-sm">{posting.location?.join(', ') || 'Location not specified'}</span>
                        </div>
                    </div>

                    <div className="flex flex-col md:items-end mt-2">
                        <div className="w-32 h-32 bg-gray-200 flex items-center justify-center rounded mb-4 overflow-hidden">
                            {collegeDetails?.profileImage ? (
                                <img src={collegeDetails?.profileImage} alt={`${collegeName} Logo`} className="w-full h-full object-cover" />
                            ) : (
                                <svg className="w-16 h-16 text-gray-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg>
                            )}
                        </div>
                        {!isApplied && (<div className="flex gap-2">
                            <button
                                className="border border-blue-500 text-blue-500 px-4 py-2 rounded text-sm"
                                onClick={() => handleApply(id)}
                            >
                                Accept Invitation
                            </button>
                            {!isSaved && (<button
                                className="border border-gray-300 text-gray-600 px-4 py-2 rounded text-sm"
                                onClick={() => handleSave(id)}
                            >
                                Save
                            </button>)}
                        </div>)}
                    </div>
                </div>

                <div className="border-t border-gray-200 pt-6">
                    <h3 className="text-xl font-bold mb-4">About This Opportunity</h3>
                    <p className="text-gray-700 mb-6">{posting.description || 'No description provided.'}</p>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        <div className="bg-white p-4 rounded border border-gray-200">
                            <h4 className="font-bold text-2xl text-blue-600">{posting.packageDetails?.totalCTC ? `${posting.packageDetails.currency} ${posting.packageDetails.totalCTC.toLocaleString()}` : 'N/A'}</h4>
                            <p className="text-gray-600 text-sm">Minimum Package</p>
                        </div>
                        <div className="bg-white p-4 rounded border border-gray-200">
                            <h4 className="font-bold text-2xl text-blue-600">{posting.noOfplacedStudents || 'N/A'}</h4>
                            <p className="text-gray-600 text-sm">Min. Students to Place</p>
                        </div>
                        <div className="bg-white p-4 rounded border border-gray-200">
                            <h4 className="font-bold text-2xl text-blue-600">{posting.employmentType?.join(', ') || 'N/A'}</h4>
                            <p className="text-gray-600 text-sm">Employment Type</p>
                        </div>
                        {/* <div className="bg-white p-4 rounded border border-gray-200">
                            <h4 className="font-bold text-2xl text-blue-600">{posting.workMode?.join(', ') || 'N/A'}</h4>
                            <p className="text-gray-600 text-sm">Work Mode</p>
                        </div> */}
                    </div>

                    <div className="mb-8">
                        <h3 className="text-xl font-bold mb-4">Point of Contact - Campus Placement</h3>
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h4 className="font-bold mb-2">College Placement Officer Contact:</h4>
                            <div className="flex items-center mb-2">
                                <span className="font-medium">{posting?.contactPerson?.name || 'Not specified'}</span>
                                <span className="text-gray-600 ml-2">({posting?.contactPerson?.designation || 'TPO'})</span>
                            </div>
                            <div className="flex items-center text-blue-600 mb-2">
                                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" /><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" /></svg>
                                <a href={`mailto:${posting?.contactPerson?.email}`}>{posting?.contactPerson?.email || 'No email provided'}</a>
                            </div>
                            <div className="flex items-center text-blue-600">
                                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20"><path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" /></svg>
                                <a href={`tel:${posting?.contactPerson?.mobile}`}>{posting?.contactPerson?.mobile || 'No mobile provided'}</a>
                            </div>
                            <div className="flex items-center text-blue-600 mt-2">
                                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M16 0H4C1.79 0 0 1.79 0 4v12c0 2.21 1.79 4 4 4h12c2.21 0 4-1.79 4-4V4c0-2.21-1.79-4-4-4zM6.5 16H3V7h3.5v9zm-1.75-10a1.75 1.75 0 110-3.5A1.75 1.75 0 014.75 6zm11.25 10h-3.5v-5c0-1.38-.28-2.5-2-2.5s-2 .88-2 2v5H7V7h3v1h-.01c1-.88 2-.88 3-.88s3 .88 3 .88V16z" />
                                </svg>
                                {posting?.contactPerson?.linkedin ? (
                                    <a href={posting.contactPerson.linkedin} target="_blank" rel="noopener noreferrer">
                                        {posting.contactPerson.linkedin}
                                    </a>
                                ) : (
                                    <span>N/A</span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* --- NEW SECTION: Proposed Schedule --- */}
                    <div className="bg-white rounded-lg shadow-sm p-6 mb-6 border">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4">Tentative Date to held Pool-Campus</h2>
                        <div className="grid md:grid-cols-3 gap-x-8 gap-y-4">
                            <div><p className="text-sm text-gray-500">Proposed Start Date</p><p className="font-medium text-gray-800">{formatDateSafe(posting.proposedSchedule?.startDate)}</p></div>
                            <div><p className="text-sm text-gray-500">Proposed End Date</p><p className="font-medium text-gray-800">{formatDateSafe(posting.proposedSchedule?.endDate)}</p></div>
                            <div><p className="text-sm text-gray-500">Preferred Mode</p><p className="font-medium text-gray-800">{posting.proposedSchedule?.preferredMode || 'N/A'}</p></div>
                        </div>
                    </div>

                    {/* --- NEW SECTION: Company Type --- */}
                    <div className="bg-white rounded-lg shadow-sm p-6 mb-6 border">
                        <h2 className="text-lg font-semibold text-gray-800 mb-3">Preferred Company Types</h2>
                        <div className="flex flex-wrap gap-2">
                            {posting.companyType?.length > 0 ? (
                                posting.companyType.map((type, index) => (
                                    <span key={index} className="bg-gray-100 text-gray-700 text-sm font-medium px-3 py-1.5 rounded-full">{type}</span>
                                ))
                            ) : <p className="text-sm text-gray-500">No specific company types listed.</p>}
                        </div>
                    </div>

                  

                    {/* --- UPDATED: Hiring Round Details (Table Format) --- */}
                    <div className="bg-white rounded-lg shadow-sm p-6 mb-6 border">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4">College Student Details</h2>
                        <div className="overflow-x-auto">
                            {posting.roundDetails?.length > 0 ? (
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">S.No.</th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Branch</th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">No. of Students</th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Skills</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {posting.roundDetails.map((round, index) => (
                                            <tr key={index}>
                                                <td className="px-4 py-2 text-sm font-medium text-gray-900">{index + 1}</td>
                                                <td className="px-4 py-2 text-sm text-gray-700">{round.branch || 'N/A'}</td>
                                                <td className="px-4 py-2 text-sm text-gray-700">{round.students || 'N/A'}</td>
                                                <td className="px-4 py-2 text-sm text-gray-700">{round.skills || 'N/A'}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                // Fallback display if roundDetails doesn't exist but we have studentStreams and numberOfStudent
                                posting.studentStreams?.length > 0 && posting.numberOfStudent?.length > 0 ? (
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">S.No.</th>
                                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Branch</th>
                                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">No. of Students</th>
                                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Skills</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {posting.studentStreams.map((stream, index) => (
                                                <tr key={index}>
                                                    <td className="px-4 py-2 text-sm font-medium text-gray-900">{index + 1}</td>
                                                    <td className="px-4 py-2 text-sm text-gray-700">{stream || 'N/A'}</td>
                                                    <td className="px-4 py-2 text-sm text-gray-700">
                                                        {posting.numberOfStudent?.[index] || 'N/A'}
                                                    </td>
                                                    <td className="px-4 py-2 text-sm text-gray-700">
                                                        {/* Display skills exactly as stored in the array for this specific index */}
                                                        {posting.roundSkills?.[index] || posting.skills?.[index] || 'N/A'}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                ) : (
                                    <p className="text-sm text-gray-500">No round details provided.</p>
                                )
                            )}
                        </div>
                    </div>

                 

                    {/* --- NEW SECTION: Amenities Required --- */}
                    <div className="bg-white rounded-lg shadow-sm p-6 mb-6 border">
                        <h2 className="text-lg font-semibold text-gray-800 mb-3">Amenities Required</h2>
                        <div className="flex flex-wrap gap-2">
                            {posting.amenitiesRequired?.length > 0 ? (
                                posting.amenitiesRequired.map((amenity, index) => (
                                    <span key={index} className="bg-gray-100 text-gray-700 text-sm font-medium px-3 py-1.5 rounded-full">{amenity}</span>
                                ))
                            ) : <p className="text-sm text-gray-500">No amenities listed.</p>}
                        </div>
                    </div>

                    <div className="mt-8 flex flex-col sm:flex-row justify-between">
                        <div className="flex gap-2 mb-4 sm:mb-0">
                            <button className="flex items-center border border-gray-300 rounded px-4 py-2 text-sm text-gray-700">Message Officer</button>
                            <button className="flex items-center border border-gray-300 rounded px-4 py-2 text-sm text-gray-700">Suggest Alternate Date</button>
                        </div>
                        {!isApplied && (<div className="flex gap-2">
                            <button className="bg-blue-600 text-white px-6 py-2 rounded font-medium" onClick={() => handleApply(id)}>Accept Invitation</button>
                            {/* <button className="border border-red-500 text-red-500 px-6 py-2 rounded font-medium">Reject Invitation</button> */}
                        </div>)}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PoolCampusEmployeeDash;