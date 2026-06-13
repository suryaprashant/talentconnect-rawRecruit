import { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { ApplyForReferral, getReferralJobById, SaveOppurtunity, viewed } from '@/lib/User_AxiosInstance';
import { 
  MapPin, 
  ArrowLeft, 
  Building2, 
  Users, 
  Navigation, 
  Briefcase, 
  Calendar, 
  DollarSign, 
  GraduationCap,
  BookOpen,
  Target,
  Award,
  FileText,
  Clock,
  CheckCircle,
  Star,
  ExternalLink
} from 'lucide-react';
import toast from 'react-hot-toast';

const StudentRefferalJobDetails = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // Converted to state to handle immediate UI updates
  const [isSaved, setIsSaved] = useState((searchParams.get('isSaved') || '').toLowerCase() === 'true');
  const isApplied = (searchParams.get('isApplied') || '').toLowerCase() === 'true';
  
  const [jobDetails, setJobDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadJobDetails = async () => {
    try {
      setIsLoading(true);
      const response = await getReferralJobById(jobId);
      setJobDetails(response.data);
      await viewed(response.data._id);
      setError(null);
    } catch (err) {
      setError('Failed to load details. Please try again later.');
      console.error('Error fetching details:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (jobId) {
      loadJobDetails();
    }
  }, [jobId]);

  const handleBackToList = () => {
    window.history.back();
  };

  const handleApply = async () => {
    try {
      const response = await ApplyForReferral(jobId);
      if (response?.data?.success === true) {
        toast.success('Application submitted!');
      } else {
        toast.error(response.response.data?.msg);
      }
    } catch (err) {
      console.error('Error applying for job:', err);
      toast.error('Something went wrong!');
    }
  };

  const handleSave = async () => {
    try {
      const response = await SaveOppurtunity(jobId, jobDetails?.jobType);
      if (response?.data?.success === true) {
        toast.success('Job saved!');
        setIsSaved(true); // Update UI immediately
      } else {
        toast.error(response.response.data?.msg);
      }
    } catch (err) {
      console.error('Error saving job:', err);
      toast.error('Something went wrong!');
    }
  };

  // Helper function to render array data as tags
  const renderTags = (data) => {
    if (Array.isArray(data) && data.length > 0) {
      return (
        <div className="flex flex-wrap gap-2 mt-1">
          {data.map((item, index) => (
            <span key={index} className="bg-gradient-to-br from-[#143694]/10 to-[#1e4ed8]/10 text-gray-800 text-xs font-medium px-2.5 py-1 rounded-full capitalize border border-gray-200">
              {item}
            </span>
          ))}
        </div>
      );
    }
    return <span className="text-gray-700">N/A</span>;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-[#143694]/5 via-[#f093fb]/5 to-[#1e4ed8]/5">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#143694]"></div>
      </div>
    );
  }

  if (error || !jobDetails) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-[#143694]/5 via-[#f093fb]/5 to-[#1e4ed8]/5">
        <div className="text-center p-4">
          <p className="text-xl font-semibold text-red-500">{error || "Job not found"}</p>
          <button
            className="mt-4 bg-gradient-to-r from-[#143694] to-[#1e4ed8] hover:shadow-lg hover:shadow-[#143694]/30 text-white px-4 py-2 rounded-lg transition-all duration-200"
            onClick={loadJobDetails}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#143694]/5 via-[#f093fb]/5 to-[#1e4ed8]/5">
      <div className="max-w-4xl mx-auto bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-gray-100 p-6 my-8">
        {/* Back Button - Top Left */}
        <button 
          onClick={handleBackToList} 
          className="inline-flex items-center text-[#143694] hover:text-[#1e4ed8] mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-1" />
          Back to Referral Jobs
        </button>

        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-br from-[#143694]/20 to-[#1e4ed8]/20 mr-4 flex items-center justify-center rounded-full overflow-hidden">
              {jobDetails.candidatePosted?.profileImage ? (
                <img
                  src={jobDetails.candidatePosted.profileImage}
                  alt={jobDetails.candidatePosted?.name || "Candidate Logo"}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://placehold.co/48x48/cccccc/000000?text=C';
                  }}
                />
              ) : (
                <svg className="w-8 h-8 text-[#143694]" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              )}
            </div>
            <div>
              <h2 className="text-xl font-bold bg-gradient-to-r from-[#143694] to-[#1e4ed8] bg-clip-text text-transparent">
                {jobDetails.jobTitle || 'Referral Opportunity'}
              </h2>
              <div className="flex items-center gap-2 mt-1">
                <span className="bg-gradient-to-r from-[#143694]/10 to-[#1e4ed8]/10 text-[#143694] text-xs font-medium px-2.5 py-1 rounded-full border border-[#143694]/20">
                  Referral Job
                </span>
                <span className="text-sm text-gray-600">
                  Posted by: {jobDetails.candidatePosted?.name || 'Anonymous'}
                </span>
              </div>
            </div>
          </div>
          <div className="flex space-x-2">
            {!isApplied && (
              <>
                {/* Only show Save button if NOT saved */}
                {!isSaved && (
                  <button 
                    onClick={handleSave} 
                    className="bg-gradient-to-br from-[#143694]/10 to-[#1e4ed8]/10 hover:from-[#143694]/20 hover:to-[#1e4ed8]/20 text-[#143694] font-bold py-2 px-5 rounded-lg transition-all duration-300 border border-gray-200"
                  >
                    Save
                  </button>
                )}
                {/* Always show Apply button if not applied (regardless of save status) */}
                <button 
                  className="px-4 py-2 bg-gradient-to-r from-[#143694] to-[#1e4ed8] text-white rounded-lg hover:shadow-lg hover:shadow-[#143694]/30 transition-all duration-200" 
                  onClick={handleApply}
                >
                  Apply
                </button>
              </>
            )}
          </div>
        </div>

        {/* About Referrer */}
        <section className="mb-8">
          <h3 className="text-lg font-semibold mb-3 bg-gradient-to-r from-[#143694] to-[#1e4ed8] bg-clip-text text-transparent">
            About the Referrer
          </h3>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-[#143694]/20 to-[#1e4ed8]/20 rounded-full flex items-center justify-center overflow-hidden">
              {jobDetails.candidatePosted?.profileImage ? (
                <img
                  src={jobDetails.candidatePosted.profileImage}
                  alt={jobDetails.candidatePosted?.name || "Referrer"}
                  className="w-full h-full object-cover"
                />
              ) : (
                <svg className="w-10 h-10 text-[#143694]" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              )}
            </div>
            <div>
              <h4 className="font-bold text-gray-900">{jobDetails.candidatePosted?.name || 'Anonymous Referrer'}</h4>
              <p className="text-gray-700 text-sm">{jobDetails.candidatePosted?.experiences?.[0]?.company || 'Current company not listed'}</p>
              <p className="text-gray-600 text-sm">{jobDetails.candidatePosted?.experiences?.[0]?.designation || 'Position not specified'}</p>
            </div>
          </div>
          <p className="text-gray-700">{jobDetails.candidatePosted?.experiences?.[0]?.description || 'No description available about the referrer.'}</p>
        </section>

        {/* Job Details */}
        <section className="mb-8">
          <h3 className="text-lg font-semibold mb-3 bg-gradient-to-r from-[#143694] to-[#1e4ed8] bg-clip-text text-transparent">
            Job Details
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex items-start">
              <Briefcase className="w-5 h-5 mt-1 mr-3 text-[#143694] flex-shrink-0" />
              <div>
                <div className="font-medium text-[#143694]">Job Title</div>
                <div className="text-gray-700">{jobDetails.jobTitle || 'N/A'}</div>
              </div>
            </div>
            <div className="flex items-start">
              <MapPin className="w-5 h-5 mt-1 mr-3 text-[#143694] flex-shrink-0" />
              <div>
                <div className="font-medium text-[#143694]">Location</div>
                {renderTags(jobDetails.location)}
              </div>
            </div>
            <div className="flex items-start">
              <Clock className="w-5 h-5 mt-1 mr-3 text-[#143694] flex-shrink-0" />
              <div>
                <div className="font-medium text-[#143694]">Experience Required</div>
                <div className="text-gray-700">{jobDetails.yearsOfExperience || '0'} years</div>
              </div>
            </div>
            <div className="flex items-start">
              <svg className="w-5 h-5 mt-1 mr-3 text-[#143694] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"></path>
              </svg>
              <div>
                <div className="font-medium text-[#143694]">Work Mode</div>
                <div className="text-gray-700 capitalize">{jobDetails.workMode || 'N/A'}</div>
              </div>
            </div>
            <div className="flex items-start">
              <svg className="w-5 h-5 mt-1 mr-3 text-[#143694] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <div>
                <div className="font-medium text-[#143694]">Employment Type</div>
                <div className="text-gray-700 capitalize">{jobDetails.employmentType || 'N/A'}</div>
              </div>
            </div>
            <div className="flex items-start">
              <Users className="w-5 h-5 mt-0.5 mr-3 text-[#143694] flex-shrink-0" />
              <div>
                <div className="font-medium text-[#143694]">Open Positions</div>
                <div className="text-gray-700">{jobDetails.numberOfOpenings || 'N/A'}</div>
              </div>
            </div>
          </div>
        </section>

        {/* Key Skills */}
        <section className="mb-8">
          <h3 className="text-lg font-semibold mb-3 bg-gradient-to-r from-[#143694] to-[#1e4ed8] bg-clip-text text-transparent">
            Key Skills Required
          </h3>
          {renderTags(jobDetails.skills)}
        </section>

        {/* Job Description */}
        <section className="mb-8">
          <h3 className="text-lg font-semibold mb-3 bg-gradient-to-r from-[#143694] to-[#1e4ed8] bg-clip-text text-transparent">
            Job Description
          </h3>
          <div className="bg-gradient-to-br from-[#143694]/5 to-[#1e4ed8]/5 border border-gray-200 p-4 rounded-lg">
            <p className="text-gray-700 whitespace-pre-wrap">{jobDetails.description || 'No description available.'}</p>
          </div>
        </section>

        {/* Responsibilities */}
        {jobDetails.responsibilities && (
          <section className="mb-8">
            <h3 className="text-lg font-semibold mb-3 bg-gradient-to-r from-[#143694] to-[#1e4ed8] bg-clip-text text-transparent">
              Responsibilities
            </h3>
            <div className="bg-gradient-to-br from-[#143694]/5 to-[#1e4ed8]/5 border border-gray-200 p-4 rounded-lg">
              <p className="text-gray-700 whitespace-pre-wrap">{jobDetails.responsibilities}</p>
            </div>
          </section>
        )}

        {/* Eligibility Criteria */}
        {jobDetails.eligibilityCriteria && (
          <section className="mb-8">
            <h3 className="text-lg font-semibold mb-3 bg-gradient-to-r from-[#143694] to-[#1e4ed8] bg-clip-text text-transparent">
              Eligibility Criteria
            </h3>
            <div className="bg-gradient-to-br from-[#143694]/5 to-[#1e4ed8]/5 border border-gray-200 p-4 rounded-lg">
              <p className="text-gray-700 whitespace-pre-wrap">{jobDetails.eligibilityCriteria}</p>
            </div>
          </section>
        )}

        {/* Compensation & Benefits */}
        <section className="mb-8">
          <h3 className="text-lg font-semibold mb-3 bg-gradient-to-r from-[#143694] to-[#1e4ed8] bg-clip-text text-transparent">
            Compensation & Benefits
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-gradient-to-br from-[#143694]/5 to-[#1e4ed8]/5 p-4 rounded-lg border border-gray-200">
              <div className="text-sm font-medium text-[#143694]">Total CTC</div>
              <div className="text-lg font-bold text-gray-900">
                {jobDetails?.packageDetails?.totalCTC
                  ? `${jobDetails.packageDetails.currency || ''} ${jobDetails.packageDetails.totalCTC.toLocaleString()}`
                  : 'Not Specified'}
              </div>
            </div>
            <div className="bg-gradient-to-br from-[#143694]/5 to-[#1e4ed8]/5 p-4 rounded-lg border border-gray-200">
              <div className="text-sm font-medium text-[#143694]">Fixed Pay</div>
              <div className="text-lg font-bold text-gray-900">
                {jobDetails?.packageDetails?.fixedPay
                  ? `${jobDetails.packageDetails.currency || ''} ${jobDetails.packageDetails.fixedPay.toLocaleString()}`
                  : 'N/A'}
              </div>
            </div>
            <div className="bg-gradient-to-br from-[#143694]/5 to-[#1e4ed8]/5 p-4 rounded-lg border border-gray-200">
              <div className="text-sm font-medium text-[#143694]">Joining Bonus</div>
              <div className="text-lg font-bold text-gray-900">
                {jobDetails?.packageDetails?.joiningBonus
                  ? `${jobDetails.packageDetails.currency || ''} ${jobDetails.packageDetails.joiningBonus.toLocaleString()}`
                  : 'N/A'}
              </div>
            </div>
          </div>
          
          <h4 className="font-medium text-[#143694] mb-2">Benefits Offered</h4>
          {renderTags(jobDetails.benefits)}
        </section>

        {/* Education Requirements */}
        <section className="mb-8">
          <h3 className="text-lg font-semibold mb-3 bg-gradient-to-r from-[#143694] to-[#1e4ed8] bg-clip-text text-transparent">
            Education Requirements
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex items-start">
              <GraduationCap className="w-5 h-5 mt-1 mr-3 text-[#143694] flex-shrink-0" />
              <div>
                <div className="font-medium text-[#143694]">Minimum Education</div>
                <div className="text-gray-700 capitalize">{jobDetails.minEducation || 'N/A'}</div>
              </div>
            </div>
            <div className="flex items-start">
              <BookOpen className="w-5 h-5 mt-1 mr-3 text-[#143694] flex-shrink-0" />
              <div>
                <div className="font-medium text-[#143694]">Preferred Streams</div>
                {renderTags(jobDetails.studentStreams)}
              </div>
            </div>
          </div>
        </section>

        {/* Additional Requirements */}
        <section className="mb-8">
          <h3 className="text-lg font-semibold mb-3 bg-gradient-to-r from-[#143694] to-[#1e4ed8] bg-clip-text text-transparent">
            Additional Requirements
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex items-start">
              <CheckCircle className="w-5 h-5 mt-1 mr-3 text-[#143694] flex-shrink-0" />
              <div>
                <div className="font-medium text-[#143694]">Certifications Required</div>
                <div className="text-gray-700">{jobDetails.certifications?.join(", ") || "No certification required"}</div>
              </div>
            </div>
            <div className="flex items-start">
              <Target className="w-5 h-5 mt-1 mr-3 text-[#143694] flex-shrink-0" />
              <div>
                <div className="font-medium text-[#143694]">Work Authorization</div>
                <div className="text-gray-700">{jobDetails.workAuthorization || 'N/A'}</div>
              </div>
            </div>
          </div>
        </section>

        {/* Referral Benefits */}
        <section className="mb-8">
          <h3 className="text-lg font-semibold mb-3 bg-gradient-to-r from-[#143694] to-[#1e4ed8] bg-clip-text text-transparent">
            Referral Benefits
          </h3>
          <div className="bg-gradient-to-br from-[#143694]/5 to-[#1e4ed8]/5 border border-gray-200 p-4 rounded-lg">
            <div className="flex items-center gap-3 mb-2">
              <Star className="w-5 h-5 text-yellow-500" />
              <span className="font-medium text-gray-900">Priority Consideration</span>
            </div>
            <p className="text-gray-700">
              This is a referral opportunity which typically means:
            </p>
            <ul className="list-disc list-inside text-gray-700 mt-2 space-y-1">
              <li>Direct connection to the hiring team</li>
              <li>Priority review of your application</li>
              <li>Potential for faster interview process</li>
              <li>Higher visibility among candidates</li>
            </ul>
          </div>
        </section>

        {/* Action Buttons */}
        <div className="flex justify-between items-center pt-6 border-t border-gray-200">
          <div className="text-sm text-gray-600">
            Job ID: <span className="font-mono">{jobDetails._id?.substring(0, 8)}...</span>
          </div>
          <div className="flex space-x-2">
            {!isApplied && (
              <>
                {/* Only show Save button if NOT saved */}
                {!isSaved && (
                  <button 
                    onClick={handleSave} 
                    className="bg-gradient-to-br from-[#143694]/10 to-[#1e4ed8]/10 hover:from-[#143694]/20 hover:to-[#1e4ed8]/20 text-[#143694] font-bold py-3 px-6 rounded-lg transition-all duration-300 border border-gray-200"
                  >
                    Save Opportunity
                  </button>
                )}
                {/* Always show Apply button if not applied (regardless of save status) */}
                <button 
                  className="px-6 py-3 bg-gradient-to-r from-[#143694] to-[#1e4ed8] text-white rounded-lg hover:shadow-lg hover:shadow-[#143694]/30 transition-all duration-200 font-medium" 
                  onClick={handleApply}
                >
                  Apply Now
                </button>
              </>
            )}
            {isApplied && (
              <span className="bg-green-100 text-green-800 font-bold py-3 px-6 rounded-lg">
                Applied Successfully
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentRefferalJobDetails;