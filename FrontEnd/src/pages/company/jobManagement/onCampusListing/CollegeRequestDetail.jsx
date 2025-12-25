import { useState } from 'react';
import { Calendar, MapPin, FileText, Users, CheckCircle, ArrowUpRight, User, Mail, Phone, Link, Briefcase, DollarSign, Target, ClipboardList } from 'lucide-react';
import { format, isValid } from 'date-fns';
import CollegeInfoModal from '@/components/college/collegeDashboard/collegeInfoModal';

const DetailRow = ({ icon: Icon, label, value }) => {
  if (!value || (Array.isArray(value) && value.length === 0)) return null;
  return (
    <div className="flex items-start">
      <Icon className="w-5 h-5 mr-3 mt-1 text-gray-500 flex-shrink-0" />
      <div>
        <p className="font-semibold text-gray-800">{label}</p>
        <p className="text-gray-600 capitalize">{Array.isArray(value) ? value.join(', ') : value}</p>
      </div>
    </div>
  );
};

// 1. Accept 'jobDetails' as a new prop
const CollegeRequestDetail = ({ collegeApplication, jobDetails, onAccept, onShortlist, onReject }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalPos, setModalPos] = useState(null);
  const [showCollegeModal, setShowCollegeModal] = useState(false);


  const safeFormatDate = (dateString, formatStr = 'MMM d, yyyy') => {
    if (!dateString) return 'Not Specified';
    const date = new Date(dateString);
    return isValid(date) ? format(date, formatStr) : 'Invalid Date';
  };

  const handleAction = async (actionCallback) => {
    setIsSubmitting(true);
    try {
      await actionCallback();
    } catch (error) {
      console.log("error: ", error);
    }
    finally {
      setIsSubmitting(false);
    }
  };

  // 2. Destructure data from the correct prop
  
  // --- Data from collegeApplication (the application itself) ---
  const {
    appliedAt = collegeApplication.createdAt,
    currentStatus = collegeApplication.currentStatus,

    // College Info (from nested applicant)
    collegeName = collegeApplication?.applicant?.collegeUniversityDetails?.collegeName,
    city = collegeApplication?.applicant?.collegeUniversityDetails?.city,
    state = collegeApplication?.applicant?.collegeUniversityDetails?.state,
    profileImage = collegeApplication.applicant?.profileImage,
    collegeWebsite = collegeApplication?.applicant?.profileAchievements?.collegeWebsite,
    linkedinProfile = collegeApplication?.applicant?.profileAchievements?.linkedInProfile,
    
    // Coordinator Info (from nested applicant)
    contactPerson = collegeApplication?.applicant?.placementCoordinatorDetails?.coordinatorName,
    contactDesignation = collegeApplication?.applicant?.placementCoordinatorDetails?.designation,
    email = collegeApplication?.applicant?.placementCoordinatorDetails?.officialEmail,
    mobile = collegeApplication?.applicant?.placementCoordinatorDetails?.officialMobile,
    linkedin = collegeApplication?.applicant?.placementCoordinatorDetails?.linkedInUrl,
    
    // These might be on the applicant profile, adjust path if needed
    placementRate = 'Not Specified', 
    highestPackage = 'Not Specified',
    averagePackage = 'Not Specified',
    
    // These were null in your code, keeping as-is
    collegeProfilePdf = null,
    collegeDescriptionPdf = null,
  } = collegeApplication || {};

  // --- Data from jobDetails (the job posting) ---
  const {
    jobRoles = jobDetails?.jobRoles || [], // Use jobRoles for 'Role'
    lookingFor = jobDetails?.lookingFor || 'Not Specified', // 'Job', 'Internship', 'Both'
    employmentType = jobDetails?.employmentType || [],
    preferredLocations = jobDetails?.location || [], // Schema field is 'location'
    // Get salary from nested packageDetails
    minimumSalary = jobDetails?.packageDetails?.totalCTC || jobDetails?.packageDetails?.fixedPay, 
    startDate = jobDetails?.startDate || '',
    endDate = jobDetails?.endDate || '',
    rounds = jobDetails?.rounds || [],
    selectionProcess = jobDetails?.selectionProcess || [],
    minimumStudents = jobDetails?.minimumStudents || 'Not Specified',
  } = jobDetails || {};


  return (
    <div className="bg-white p-6 rounded-lg shadow-sm mb-6 border border-gray-200">
      {/* College Header */}
      <div className="pb-4 border-b border-gray-200 mb-4">
        <div className="flex items-center">
          {profileImage ? (
            <img src={profileImage} alt={collegeName} className="w-16 h-16 rounded-md object-cover flex-shrink-0" />
          ) : (
            <div className="w-16 h-16 bg-gray-200 rounded-md flex-shrink-0 flex items-center justify-center text-gray-500 text-xs">No Image</div>
          )}
          <div className="ml-4 flex-grow">
            <h1
              className="text-xl font-bold text-blue-600 cursor-pointer hover:underline"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();

                setModalPos({
                  top: rect.top + window.scrollY,
                  left: rect.left + window.scrollX,
                  right: rect.right + window.scrollX,
                  height: rect.height
                });
              
                setShowCollegeModal(true);
              }}



            >           
              {collegeName || 'College Name Not Found'}
            </h1>

            <div className="flex items-center text-gray-600 text-sm mt-1">
              <MapPin size={14} className="mr-1" />
              <span>{[city, state].filter(Boolean).join(', ')}</span>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
          <div className="text-center"><div className="font-bold text-lg">{placementRate}{placementRate !== 'Not Specified' && '%'}</div><div className="text-sm text-gray-600">Placement Rate</div></div>
          <div className="text-center"><div className="font-bold text-lg">{highestPackage}{highestPackage !== 'Not Specified' && ' LPA'}</div><div className="text-sm text-gray-600">Highest Package</div></div>
          <div className="text-center"><div className="font-bold text-lg">{averagePackage}{averagePackage !== 'Not Specified' && ' LPA'}</div><div className="text-sm text-gray-600">Average Package</div></div>
        </div>
      </div>

      {/* 3. Use the corrected variables in the JSX */}
      <div className="mb-6">
        <h3 className="text-lg font-bold mb-4 text-gray-800">Drive Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
          <DetailRow icon={Target} label="Role(s)" value={jobRoles} />
          <DetailRow icon={Briefcase} label="Looking For" value={lookingFor} />
          <DetailRow icon={Briefcase} label="Employment Type" value={employmentType} />
          <DetailRow icon={MapPin} label="Work Locations" value={preferredLocations} />
          <DetailRow icon={DollarSign} label="Salary (LPA)" value={minimumSalary || 'Not Specified'} />
          <DetailRow icon={Users} label="Minimum Students" value={minimumStudents} />
          <DetailRow icon={Calendar} label="Drive Period" value={`${safeFormatDate(startDate)} to ${safeFormatDate(endDate)}`} />
          {/* <DetailRow icon={ClipboardList} label="Rounds" value={rounds} />
          <DetailRow icon={ClipboardList} label="Selection Process" value={selectionProcess} /> */}
        </div>
      </div>

      {/* Proposed date (Empty in your code) */}
      <div>

      </div>

      {/* Coordinator and Application Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <h3 className="text-lg font-bold mb-4 text-gray-800">Drive Coordinator</h3>
          <div className="space-y-3 text-sm">
            <div className="flex items-center"><User size={16} className="mr-2 text-gray-500 flex-shrink-0" /><span>{contactPerson || 'N/A'} {contactDesignation && `(${contactDesignation})`}</span></div>
            <div className="flex items-center"><Mail size={16} className="mr-2 text-gray-500 flex-shrink-0" /><span>{email || 'N/A'}</span></div>
            <div className="flex items-center"><Phone size={16} className="mr-2 text-gray-500 flex-shrink-0" /><span>{mobile || 'N/A'}</span></div>
            {linkedin && <a href={linkedin.startsWith('http') ? linkedin : `https://${linkedin}`} target="_blank" rel="noopener noreferrer" className="flex items-center text-blue-600 hover:underline"><Link size={16} className="mr-2 flex-shrink-0" /><span>Coordinator LinkedIn</span></a>}
          </div>
        </div>
        <div>
          <h3 className="text-lg font-bold mb-4 text-gray-800">College Application Status</h3>
          <div className="space-y-3 text-sm">
            <div className="flex items-center"><Calendar size={16} className="mr-2 text-gray-500 flex-shrink-0" /><span>Applied on: {safeFormatDate(appliedAt)}</span></div>
            <div className="flex items-center"><FileText size={16} className="mr-2 text-gray-500 flex-shrink-0" /><span>Current Status: <span className="font-semibold">{currentStatus}</span></span></div>
          </div>
        </div>
      </div>

      {/* College Links and Documents */}
      <div className="mb-6">
        <h3 className="text-lg font-bold mb-4 text-gray-800">College Resources</h3>
        <div className="flex flex-wrap gap-4 text-sm">
          {collegeWebsite && <a href={collegeWebsite.startsWith('http') ? collegeWebsite : `https://www.${collegeWebsite}`} target="_blank" rel="noopener noreferrer" className="flex items-center text-blue-600 hover:underline"><Link size={16} className="mr-2" />College Website <ArrowUpRight size={16} className="ml-1" /></a>}
          {linkedinProfile && <a href={linkedinProfile.startsWith('http') ? linkedinProfile : `https://www.${linkedinProfile}`} target="_blank" rel="noopener noreferrer" className="flex items-center text-blue-600 hover:underline"><Link size={16} className="mr-2" />College LinkedIn <ArrowUpRight size={16} className="ml-1" /></a>}
          {collegeProfilePdf && <a href={collegeProfilePdf} target="_blank" rel="noopener noreferrer" className="flex items-center text-blue-600 hover:underline"><FileText size={16} className="mr-2" />Profile PDF <ArrowUpRight size={16} className="ml-1" /></a>}
          {collegeDescriptionPdf && <a href={collegeDescriptionPdf} target="_blank" rel="noopener noreferrer" className="flex items-center text-blue-600 hover:underline"><FileText size={16} className="mr-2" />Description PDF <ArrowUpRight size={16} className="ml-1" /></a>}
        </div>
      </div>

      {/* 4. Fixed Action Buttons */}
      {/* The onAccept/onShortlist/onReject props already have the ID bound from the parent.
          You can call them directly inside handleAction. */}
      <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mt-6">
        <button onClick={() => handleAction(onAccept)} disabled={isSubmitting} className="flex-1 justify-center bg-white text-green-500 py-2 font-medium rounded-md hover:bg-gray-300 disabled:opacity-50 transition-colors duration-200">
          {isSubmitting ? 'Processing...' : 'Accept Application'}
        </button>
        <button onClick={() => handleAction(onShortlist)} disabled={isSubmitting} className="flex-1 justify-center bg-white border border-gray-300 text-yellow-500 py-2 font-medium rounded-md hover:bg-gray-300 disabled:opacity-50 transition-colors duration-200">
          {isSubmitting ? 'Processing...' : 'Shortlist Application'}
        </button>
        <button onClick={() => handleAction(onReject)} disabled={isSubmitting} className="flex-1 justify-center bg-white border border-gray-300 text-red-500 py-2 font-medium rounded-md hover:bg-gray-300 disabled:opacity-50 transition-colors duration-200">
          {isSubmitting ? 'Processing...' : 'Reject Application'}
        </button>
      </div>
      {showCollegeModal && modalPos && (
        <CollegeInfoModal
          college={collegeApplication.applicant}
          position={modalPos}
          onClose={() => setShowCollegeModal(false)}
        />
      )}


    </div>
  );
};

export default CollegeRequestDetail;