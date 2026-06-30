import { useState } from 'react';
import { 
  Calendar, MapPin, FileText, Users, ArrowUpRight, User, 
  Mail, Phone, Link, Briefcase, Target, ClipboardList,
  Globe, Building2, Award, GraduationCap, Users2,
  ExternalLink, X, Eye, Send
} from 'lucide-react';
import { format, isValid } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import useConversation from '@/statemanage/useConversation.js';
import { conversationWithCollege } from '@/lib/College_AxiosIntance.js';
import toast from 'react-hot-toast';
import { useChat } from '@/context/ChatContext';
const DetailRow = ({ icon: Icon, label, value }) => {
    if (!value || (Array.isArray(value) && value.length === 0)) return null;
    
    let displayValue = value;
    if (Array.isArray(value)) {
        displayValue = value.join(', ');
    } else if (typeof value === 'object') {
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

const CollegeRequestDetail = ({ collegeApplication, driveDetails, onAccept, onShortlist, onReject }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false); // Add this state
    const [showCollegeModal, setShowCollegeModal] = useState(false);
    
    const navigate = useNavigate(); // Add this
    const { setSelectedConversation, setShowFloatingChat } = useChat();   // Add this

    // Debug logging to see what data we're receiving
    console.log("College Application:", collegeApplication);
    console.log("Drive Details:", driveDetails);

    const safeFormatDate = (dateString, formatStr = 'MMM d, yyyy') => {
        if (!dateString) return 'Not Specified';
        try {
            const date = new Date(dateString);
            return isValid(date) ? format(date, formatStr) : 'Invalid Date';
        } catch (error) {
            return 'Invalid Date';
        }
    };

    const handleAction = async (actionCallback) => {
        setIsSubmitting(true);
        try {
            await actionCallback();
        } catch (error) {
            console.log("Action error: ", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Add message button logic
    const handleMessageClick = async (e) => {
        e.stopPropagation();
        setIsProcessing(true);
        
        try {
            // Get the college's user ID from the application
            const userId = collegeApplication?.applicant?._id || collegeApplication?.applicant?.userId;
            
            if (!userId) {
                toast.error('Cannot start chat: User ID not found');
                return;
            }
            
            const response = await conversationWithCollege(userId);
            if (response.data) {
                const conversationUser = {
                    _id: userId,
                    name: collegeApplication?.applicant?.collegeUniversityDetails?.collegeName || 'Unknown College',
                    email: collegeApplication?.applicant?.placementCoordinatorDetails?.officialEmail || '',
                    profileImage: collegeApplication?.applicant?.profileImage || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png',
                    userType: 'college',
                    fullname: collegeApplication?.applicant?.collegeUniversityDetails?.collegeName || 'Unknown College'
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

    // Extract college data
    const applicationId = collegeApplication?._id;
    const appliedAt = collegeApplication?.createdAt || collegeApplication?.appliedAt;
    const currentStatus = collegeApplication?.currentStatus || 'Applied';

    // College Details
    const collegeDetails = collegeApplication?.applicant?.collegeUniversityDetails || {};
    const collegeName = collegeDetails.collegeName || 'Not Specified';
    const collegeType = collegeDetails.collegeType || 'Not Specified';
    const universityName = collegeDetails.universityName || 'Not Specified';
    const city = collegeDetails.city || 'Not Specified';
    const state = collegeDetails.state || 'Not Specified';
    const country = collegeDetails.country || 'Not Specified';
    const pincode = collegeDetails.pincode || 'Not Specified';
    const establishedYear = collegeDetails.establishedYear;
    const accreditation = collegeDetails.accreditation || [];
    const ranking = collegeDetails.ranking;
    const campusArea = collegeDetails.campusArea;
    const totalStudents = collegeDetails.totalStudents;
    const facultyCount = collegeDetails.facultyCount;
    const profileImage = collegeApplication?.applicant?.profileImage;
    const backgroundImage = collegeApplication?.applicant?.backgroundImage;

    // Academic Programs
    const academicPrograms = collegeDetails.academicPrograms || [];
    const studentStreams = collegeDetails.studentStreams || [];

    // Infrastructure
    const infrastructure = collegeDetails.infrastructure || [];
    const hostelFacilities = collegeDetails.hostelFacilities;

    // Placement Statistics
    const placementStats = collegeApplication?.applicant?.placementStatistics || {};
    const placementRate = placementStats.placementRate;
    const highestPackage = placementStats.highestPackage;
    const averagePackage = placementStats.averagePackage;
    const topRecruiters = placementStats.topRecruiters || [];

    // Placement Coordinator Details
    const coordinatorDetails = collegeApplication?.applicant?.placementCoordinatorDetails || {};
    const contactPerson = coordinatorDetails.coordinatorName || 'Not Specified';
    const contactDesignation = coordinatorDetails.designation || 'Not Specified';
    const email = coordinatorDetails.officialEmail || 'Not Specified';
    const mobile = coordinatorDetails.officialMobile || 'Not Specified';
    const linkedin = coordinatorDetails.linkedInUrl;
    const alternateContact = coordinatorDetails.alternateContact;

    // Profile Achievements
    const achievements = collegeApplication?.applicant?.profileAchievements || {};
    const collegeWebsite = achievements.collegeWebsite;
    const linkedinProfile = achievements.linkedInProfile;
    const collegeBrochure = achievements.collegeBrochure;
    const accreditationDocuments = achievements.accreditationDocuments || [];

    // DRIVE DETAILS - Now coming from the separate prop
    const lookingFor = Array.isArray(driveDetails?.jobRoles) 
        ? driveDetails.jobRoles.join(', ') 
        : driveDetails?.jobRoles || driveDetails?.lookingFor || 'Not Specified';
    
    const employmentType = Array.isArray(driveDetails?.employmentType) 
        ? driveDetails.employmentType.join(', ') 
        : driveDetails?.employmentType || 'Not Specified';
    
    const workLocations = driveDetails?.workLocation || driveDetails?.location || [];
    const startDate = driveDetails?.startDate;
    const endDate = driveDetails?.endDate;
    const minimumStudents = driveDetails?.minimumStudents || 'Not Specified';
    const packageDetails = driveDetails?.packageDetails || {};
    const workMode = Array.isArray(driveDetails?.workMode) 
        ? driveDetails.workMode.join(', ') 
        : driveDetails?.workMode || 'Not Specified';
    
    const venue = driveDetails?.venue;
    const collegeCategories = driveDetails?.collegeCategories || [];

    // College Details Modal Component - Matching the same UI pattern
const CollegeDetailsModal = () => (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm">
        <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto 
            absolute top-6 left-6">
            <div className="p-6">
                {/* Header */}
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">{collegeName}</h2>
                        <p className="text-gray-600 text-sm mt-1">
                            {collegeType ? `${collegeType} College` : 'Educational Institution'}
                        </p>
                    </div>
                    <button
                        onClick={() => setShowCollegeModal(false)}
                        className="text-gray-500 hover:text-gray-700 text-xl p-1"
                    >
                        ✕
                    </button>
                </div>

                {/* College Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="space-y-3">
                        <div className="flex items-center text-gray-700">
                            <Building2 className="w-4 h-4 mr-3 text-[#1e4ed8]" />
                            <span className="font-medium">College Type:</span>
                            <span className="ml-2">{collegeType || 'N/A'}</span>
                        </div>
                        <div className="flex items-center text-gray-700">
                            <Calendar className="w-4 h-4 mr-3 text-[#1e4ed8]" />
                            <span className="font-medium">Established:</span>
                            <span className="ml-2">{establishedYear || 'N/A'}</span>
                        </div>
                        <div className="flex items-center text-gray-700">
                            <Users className="w-4 h-4 mr-3 text-[#1e4ed8]" />
                            <span className="font-medium">University:</span>
                            <span className="ml-2">{universityName || 'N/A'}</span>
                        </div>
                        <div className="flex items-center text-gray-700">
                            <MapPin className="w-4 h-4 mr-3 text-[#1e4ed8]" />
                            <span className="font-medium">City:</span>
                            <span className="ml-2">{city || 'N/A'}</span>
                        </div>
                    </div>
                    
                    <div className="space-y-3">
                        <div className="flex items-center text-gray-700">
                            <MapPin className="w-4 h-4 mr-3 text-[#1e4ed8]" />
                            <span className="font-medium">State:</span>
                            <span className="ml-2">{state || 'N/A'}</span>
                        </div>
                        <div className="flex items-center text-gray-700">
                            <MapPin className="w-4 h-4 mr-3 text-[#1e4ed8]" />
                            <span className="font-medium">Country:</span>
                            <span className="ml-2">{country || 'N/A'}</span>
                        </div>
                        <div className="flex items-center text-gray-700">
                            <MapPin className="w-4 h-4 mr-3 text-[#1e4ed8]" />
                            <span className="font-medium">Pincode:</span>
                            <span className="ml-2">{pincode || 'N/A'}</span>
                        </div>
                        <div className="flex items-center text-gray-700">
                            <Globe className="w-4 h-4 mr-3 text-[#1e4ed8]" />
                            <span className="font-medium">Website:</span>
                            {collegeWebsite ? (
                                <a 
                                    href={collegeWebsite.startsWith('http') ? collegeWebsite : `https://${collegeWebsite}`} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="ml-2 text-[#1e4ed8] hover:underline"
                                >
                                    Visit Website
                                </a>
                            ) : (
                                <span className="ml-2">Not provided</span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Links Section */}
                {(collegeWebsite || linkedinProfile) && (
                    <div className="border-t border-gray-100 pt-6">
                        <h3 className="font-bold text-gray-800 mb-4">College Links</h3>
                        <div className="flex gap-4">
                            {collegeWebsite && (
                                <a
                                    href={collegeWebsite.startsWith('http') ? collegeWebsite : `https://${collegeWebsite}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 text-[#1e4ed8] hover:text-[#2563eb] transition-colors"
                                >
                                    <Globe className="w-4 h-4" />
                                    <span>Website</span>
                                </a>
                            )}
                            {linkedinProfile && (
                                <a
                                    href={linkedinProfile.startsWith('http') ? linkedinProfile : `https://${linkedinProfile}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 text-[#1e4ed8] hover:text-[#2563eb] transition-colors"
                                >
                                    <Link className="w-4 h-4" />
                                    <span>LinkedIn</span>
                                </a>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    </div>
);

    return (
        <>
            <div className="bg-white p-6 rounded-lg shadow-sm mb-6 border border-gray-200">
                {/* College Header */}
                <div className="pb-4 mb-4">
                    <div className="flex items-center">
                        {profileImage ? (
                            <img 
                                src={profileImage} 
                                alt={collegeName} 
                                className="w-16 h-16 rounded-md object-cover flex-shrink-0 cursor-pointer hover:opacity-90 transition-opacity"
                                onClick={() => setShowCollegeModal(true)}
                            />
                        ) : (
                            <div 
                                className="w-16 h-16 bg-gray-200 rounded-md flex-shrink-0 flex items-center justify-center text-gray-500 text-xs cursor-pointer hover:bg-gray-300 transition-colors"
                                onClick={() => setShowCollegeModal(true)}
                            >
                                No Image
                            </div>
                        )}
                        <div className="ml-4 flex-grow">
                            <h1 
                                className="text-xl font-bold text-gray-900 hover:text-blue-600 cursor-pointer transition-colors"
                                onClick={() => setShowCollegeModal(true)}
                            >
                                {collegeName}
                            </h1>
                            <div 
                                className="flex items-center text-gray-600 text-sm mt-1 cursor-pointer hover:text-blue-600 transition-colors"
                                onClick={() => setShowCollegeModal(true)}
                            >
                                <MapPin size={14} className="mr-1" />
                                <span>{[city, state].filter(Boolean).join(', ')}</span>
                            </div>
                        </div>
                        
                    </div>
                </div>

                {/* Main Drive Details Section */}
                <div className="mb-6">
                    <h3 className="text-lg font-bold mb-4 text-gray-800">Drive Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                        <DetailRow icon={Target} label="Job Roles" value={lookingFor} />
                        <DetailRow icon={Briefcase} label="Employment Type" value={employmentType} />
                        <DetailRow icon={MapPin} label="Work Locations" value={workLocations} />
                        <DetailRow icon={MapPin} label="Venue" value={venue} />
                        <DetailRow icon={Users} label="Work Mode" value={workMode} />
                        <DetailRow icon={Users} label="Minimum Students" value={minimumStudents} />
                        <DetailRow icon={Calendar} label="Drive Period" value={`${safeFormatDate(startDate)} to ${safeFormatDate(endDate)}`} />
                        <DetailRow icon={Users} label="College Categories" value={collegeCategories} />
                        <DetailRow icon={GraduationCap} label="Student Streams" value={studentStreams} />
                    </div>

                    {/* Package Details */}
                    {(packageDetails.totalCTC || packageDetails.fixedPay) && (
                        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                            <h4 className="font-semibold text-gray-800 mb-2">Package Details</h4>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {packageDetails.totalCTC && (
                                    <div>
                                        <span className="font-medium">Total CTC: </span>
                                        <span>{packageDetails.currency} {packageDetails.totalCTC}</span>
                                    </div>
                                )}
                                {packageDetails.fixedPay && (
                                    <div>
                                        <span className="font-medium">Fixed Pay: </span>
                                        <span>{packageDetails.currency} {packageDetails.fixedPay}</span>
                                    </div>
                                )}
                                {packageDetails.joiningBonus && (
                                    <div>
                                        <span className="font-medium">Joining Bonus: </span>
                                        <span>{packageDetails.currency} {packageDetails.joiningBonus}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Placement Statistics Quick View */}
                {(placementRate || highestPackage || averagePackage) && (
                    <div className="mb-6">
                        <h3 className="text-lg font-bold mb-4 text-gray-800">Placement Statistics</h3>
                        {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {placementRate && (
                                <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
                                    <div className="text-2xl font-bold text-blue-600">{placementRate}%</div>
                                    <div className="text-sm text-gray-600 mt-1">Placement Rate</div>
                                </div>
                            )}
                            {highestPackage && (
                                <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
                                    <div className="text-2xl font-bold text-green-600">₹{highestPackage} LPA</div>
                                    <div className="text-sm text-gray-600 mt-1">Highest Package</div>
                                </div>
                            )}
                            {averagePackage && (
                                <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200">
                                    <div className="text-2xl font-bold text-[#143694]">₹{averagePackage} LPA</div>
                                    <div className="text-sm text-gray-600 mt-1">Average Package</div>
                                </div>
                            )}
                        </div> */}
                    </div>
                )}

                {/* Coordinator and Application Status */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                        <h3 className="text-lg font-bold mb-4 text-gray-800">Drive Coordinator</h3>
                        <div className="space-y-3 text-sm">
                            <div className="flex items-center">
                                <User size={16} className="mr-2 text-gray-500 flex-shrink-0" />
                                <span>{contactPerson} ({contactDesignation})</span>
                            </div>
                            <div className="flex items-center">
                                <Mail size={16} className="mr-2 text-gray-500 flex-shrink-0" />
                                <a href={`mailto:${email}`} className="text-blue-600 hover:underline">
                                    {email}
                                </a>
                            </div>
                            <div className="flex items-center">
                                <Phone size={16} className="mr-2 text-gray-500 flex-shrink-0" />
                                <a href={`tel:${mobile}`} className="text-blue-600 hover:underline">
                                    {mobile}
                                </a>
                            </div>
                            {alternateContact && (
                                <div className="flex items-center">
                                    <Phone size={16} className="mr-2 text-gray-500 flex-shrink-0" />
                                    <a href={`tel:${alternateContact}`} className="text-blue-600 hover:underline">
                                        Alternate: {alternateContact}
                                    </a>
                                </div>
                            )}
                            {linkedin && (
                                <a
                                    href={linkedin.startsWith('http') ? linkedin : `https://${linkedin}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center text-blue-600 hover:underline"
                                >
                                    <Link size={16} className="mr-2 flex-shrink-0" />
                                    <span>Coordinator LinkedIn</span>
                                </a>
                            )}
                        </div>
                    </div>
                    <div>
                        <h3 className="text-lg font-bold mb-4 text-gray-800">Application Status</h3>
                        <div className="space-y-3 text-sm">
                            <div className="flex items-center">
                                <Calendar size={16} className="mr-2 text-gray-500 flex-shrink-0" />
                                <span>Applied on: {safeFormatDate(appliedAt)}</span>
                            </div>
                            <div className="flex items-center">
                                <FileText size={16} className="mr-2 text-gray-500 flex-shrink-0" />
                                <span>
                                    Current Status: <span className={`font-semibold ${
                                        currentStatus === 'Accepted' ? 'text-green-600' : 
                                        currentStatus === 'Rejected' ? 'text-red-600' : 
                                        currentStatus === 'Shortlisted' ? 'text-yellow-600' : 
                                        'text-blue-600'
                                    }`}>
                                        {currentStatus}
                                    </span>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* College Links and Documents */}
                <div className="mb-6">
                    <h3 className="text-lg font-bold mb-4 text-gray-800">College Resources</h3>
                    <div className="flex flex-wrap gap-4 text-sm">
                        {collegeWebsite && (
                            <a
                                href={collegeWebsite.startsWith('http') ? collegeWebsite : `https://${collegeWebsite}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center text-blue-600 hover:underline px-3 py-1 bg-blue-50 rounded-lg"
                            >
                                <Globe className="w-4 h-4 mr-2" />
                                College Website
                                <ArrowUpRight size={14} className="ml-1" />
                            </a>
                        )}
                        {linkedinProfile && (
                            <a
                                href={linkedinProfile.startsWith('http') ? linkedinProfile : `https://${linkedinProfile}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center text-blue-600 hover:underline px-3 py-1 bg-blue-50 rounded-lg"
                            >
                                <Link className="w-4 h-4 mr-2" />
                                College LinkedIn
                                <ArrowUpRight size={14} className="ml-1" />
                            </a>
                        )}
                        {collegeBrochure && (
                            <a
                                href={collegeBrochure}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center text-green-600 hover:underline px-3 py-1 bg-green-50 rounded-lg"
                            >
                                <FileText className="w-4 h-4 mr-2" />
                                College Brochure
                                <ArrowUpRight size={14} className="ml-1" />
                            </a>
                        )}
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mt-6">
                    <button
                        onClick={() => handleAction(() => onReject(applicationId))}
                        disabled={isSubmitting || currentStatus === 'Rejected'}
                        className={`flex-1 justify-center py-2 font-medium rounded-md transition-colors duration-200 ${
                            currentStatus === 'Rejected'
                                ? 'bg-red-100 text-red-700 cursor-not-allowed'
                                : 'bg-white border border-gray-300 text-red-500 hover:bg-gray-100'
                        } disabled:opacity-50`}
                    >
                        {currentStatus === 'Rejected' ? 'Already Rejected' : (isSubmitting ? 'Processing...' : 'Reject Drive')}
                    </button>
                    <button
                        onClick={handleMessageClick}
                        disabled={isProcessing || isSubmitting}
                        className={`flex items-center justify-center flex-1 py-2 font-medium rounded-md transition-colors duration-200 ${
                            (isProcessing || isSubmitting) 
                                ? 'opacity-50 cursor-not-allowed bg-white border border-gray-300 text-[#1e4ed8]' 
                                : 'bg-white border border-gray-300 text-[#1e4ed8] hover:bg-blue-50'
                        }`}
                    >
                        <Send className="w-5 h-5 mr-2" />
                        {isProcessing ? 'Processing...' : 'Message Coordinator'}
                    </button>
                </div>
            </div>

            {/* Render the college details modal */}
            {showCollegeModal && <CollegeDetailsModal />}
        </>
    );
};

export default CollegeRequestDetail;