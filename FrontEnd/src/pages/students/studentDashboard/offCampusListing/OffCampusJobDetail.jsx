import { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { ApplyForOppurtunity, getJobDetails, SaveOppurtunity, viewed } from '@/lib/User_AxiosInstance';
import { MapPin, ArrowLeft, Building2, Users, Navigation } from 'lucide-react';
import toast from 'react-hot-toast';

function OffCampusJobDetail() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // Converted to state to handle immediate UI updates
  const [isSaved, setIsSaved] = useState((searchParams.get('isSaved') || '').toLowerCase() === 'true');
  // keeping isApplied as is, or you can convert to state if you want immediate update on apply too
  const isApplied = (searchParams.get('isApplied') || '').toLowerCase() === 'true';
  
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [jobDetail, setJobDetail] = useState(null);

  const loadJobDetails = async () => {
    try {
      setIsLoading(true);
      const details = await getJobDetails(jobId);
      setJobDetail(details.data[0]);
      await viewed(details.data[0]._id);

      setError(null);
    } catch (err) {
      setError('Failed to load job details. Please try again later.');
      // console.error('Error fetching job details:', err);
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
    navigate('/student-dashboard/Off-campus');
  };

  const handleApply = async () => {
    try {
      const response = await ApplyForOppurtunity(jobId);
      if (response?.data?.success === true) toast.success('Application submitted!');
      else toast.error(response.response.data?.msg);
    } catch (err) {
      // console.error('Error applying for job:', err);
      toast.error('Something went wrong!');
    }
  };

  const handleSave = async () => {
    try {
      const response = await SaveOppurtunity(jobId, jobDetail?.jobType);
      // console.log("Applicaiton: ", response);
      if (response?.data?.success === true) {
        toast.success('Job saved!');
        setIsSaved(true); // Update UI immediately
      } 
      else toast.error(response.response.data?.msg);
    } catch (err) {
      // console.error('Error applying for job:', err);
      toast.error('Something went wrong!');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-[#667eea]/5 via-[#f093fb]/5 to-[#764ba2]/5">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#667eea]"></div>
      </div>
    );
  }

  if (error || !jobDetail) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-[#667eea]/5 via-[#f093fb]/5 to-[#764ba2]/5">
        <div className="text-center p-4">
          <p className="text-xl font-semibold text-red-500">{error || "Job not found"}</p>
          <button
            className="mt-4 bg-gradient-to-r from-[#667eea] to-[#764ba2] hover:shadow-lg hover:shadow-[#667eea]/30 text-white px-4 py-2 rounded-lg transition-all duration-200"
            onClick={loadJobDetails}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  let headerStatusClasses = '';
  switch (jobDetail.jobStatus) {
    case 'Open':
      headerStatusClasses = 'text-green-600';
      break;
    case 'Closed':
      headerStatusClasses = 'text-red-600';
      break;
    case 'Pending':
      headerStatusClasses = 'text-yellow-600';
      break;
    default:
      headerStatusClasses = 'text-gray-600';
  }

  // Helper function to render array data as tags
  const renderTags = (data) => {
    if (Array.isArray(data) && data.length > 0) {
      return (
        <div className="flex flex-wrap gap-2 mt-1">
          {data.map((item, index) => (
            <span key={index} className="bg-gradient-to-br from-[#667eea]/10 to-[#764ba2]/10 text-gray-800 text-xs font-medium px-2.5 py-1 rounded-full capitalize border border-gray-200">
              {item}
            </span>
          ))}
        </div>
      );
    }
    return <span className="text-gray-700">N/A</span>;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#667eea]/5 via-[#f093fb]/5 to-[#764ba2]/5">
      <div className="max-w-4xl mx-auto bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-gray-100 p-6 my-8">
        {/* Back Button - Top Left */}
        <button 
          onClick={handleBackToList} 
          className="inline-flex items-center text-[#667eea] hover:text-[#764ba2] mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-1" />
          Back
        </button>

        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-br from-[#667eea]/20 to-[#764ba2]/20 mr-4 flex items-center justify-center rounded-full overflow-hidden">
              {jobDetail.companyPosted?.profileImage ? (
                <img
                  src={jobDetail.companyPosted.profileImage}
                  alt={jobDetail.companyPosted.companyDetails.companyName || "Company Logo"}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://placehold.co/48x48/cccccc/000000?text=Logo';
                  }}
                />
              ) : (
                <svg className="w-8 h-8 text-[#667eea]" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              )}
            </div>
            <div>
              <h2 className="text-xl font-bold bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent">
                {jobDetail.companyPosted?.companyDetails?.companyName || "N/A"} - 
                {Array.isArray(jobDetail.jobRoles) 
                  ? jobDetail.jobRoles.join(', ') 
                  : jobDetail.jobRoles || 'N/A'}
              </h2>
            </div>
          </div>
          <div className="flex space-x-2">
            {!isApplied && (
              <>
                {/* Only show Save button if NOT saved */}
                {!isSaved && (
                  <button 
                    onClick={handleSave} 
                    className="bg-gradient-to-br from-[#667eea]/10 to-[#764ba2]/10 hover:from-[#667eea]/20 hover:to-[#764ba2]/20 text-[#667eea] font-bold py-2 px-5 rounded-lg transition-all duration-300 border border-gray-200"
                  >
                    Save
                  </button>
                )}
                {/* Always show Apply button if not applied (regardless of save status) */}
                <button 
                  className="px-4 py-2 bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white rounded-lg hover:shadow-lg hover:shadow-[#667eea]/30 transition-all duration-200" 
                  onClick={handleApply}
                >
                  Apply
                </button>
              </>
            )}
          </div>
        </div>

        {/* About Company */}
        <section className="mb-8">
          <h3 className="text-lg font-semibold mb-3 bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent">
            About {jobDetail.companyPosted?.companyDetails?.companyName || "Company"}
          </h3>
          <p className="text-gray-700 mb-4">{jobDetail.companyPosted?.companyDetails?.description || 'No company description available.'}</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-[#667eea]/5 to-[#764ba2]/5 border border-gray-200 p-4 rounded-lg">
              <div className="font-bold text-lg">{jobDetail.companyPosted?.companyDetails?.numberOfEmployees || "N/A"}</div>
              <div className="text-sm text-gray-600">Employees</div>
            </div>
            <div className="bg-gradient-to-br from-[#667eea]/5 to-[#764ba2]/5 border border-gray-200 p-4 rounded-lg">
              <div className="font-bold text-lg capitalize">{jobDetail.companyPosted?.companyDetails?.industryType || "N/A"}</div>
              <div className="text-sm text-gray-600">Industry</div>
            </div>
            <div className="bg-gradient-to-br from-[#667eea]/5 to-[#764ba2]/5 border border-gray-200 p-4 rounded-lg">
              <div className="font-bold text-lg">{jobDetail.companyPosted?.companyDetails?.country || "N/A"}</div>
              <div className="text-sm text-gray-600">Country</div>
            </div>
          </div>
        </section>

        {/* Opportunity Details */}
        <section className="mb-8">
          <h3 className="text-lg font-semibold mb-3 bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent">
            Opportunity Details
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex items-start">
              <svg className="w-5 h-5 mt-1 mr-3 text-[#667eea] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
              </svg>
              <div>
                <div className="font-medium text-[#667eea]">Job Roles</div>
                {renderTags(jobDetail.jobRoles)}
              </div>
            </div>
            <div className="flex items-start">
              <MapPin className="w-5 h-5 mt-1 mr-3 text-[#667eea] flex-shrink-0" />
              <div>
                <div className="font-medium text-[#667eea]">Work Location</div>
                {renderTags(jobDetail.location)}
              </div>
            </div>
            <div className="flex items-start">
              <svg className="w-5 h-5 mt-1 mr-3 text-[#667eea] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"></path>
              </svg>
              <div>
                <div className="font-medium text-[#667eea]">Work Mode</div>
                {renderTags(jobDetail.workMode)}
              </div>
            </div>
            <div className="flex items-start">
              <svg className="w-5 h-5 mt-1 mr-3 text-[#667eea] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <div>
                <div className="font-medium text-[#667eea]">Employment Type</div>
                {renderTags(jobDetail.employmentType)}
              </div>
            </div>
            <div className="flex items-start">
              <Building2 className="w-5 h-5 mt-0.5 mr-3 text-[#667eea] flex-shrink-0" />
              <div>
                <div className="font-medium text-[#667eea]">Industry Type</div>
                <div className="text-gray-700 capitalize">{jobDetail.companyPosted?.companyDetails?.industryType || 'N/A'}</div>
              </div>
            </div>
            <div className="flex items-start">
              <Users className="w-5 h-5 mt-0.5 mr-3 text-[#667eea] flex-shrink-0" />
              <div>
                <div className="font-medium text-[#667eea]">Department</div>
                <div className="text-gray-700">{jobDetail.department || 'N/A'}</div>
              </div>
            </div>
            {/* ADDED: Drive Venue */}
            <div className="flex items-start">
              <Navigation className="w-5 h-5 mt-0.5 mr-3 text-[#667eea] flex-shrink-0" />
              <div>
                <div className="font-medium text-[#667eea]">Drive Venue</div>
                <div className="text-gray-700">{jobDetail.venue || 'N/A'}</div>
              </div>
            </div>
          </div>
        </section>

        {/* Candidate Requirements */}
        <section className="mb-8">
          <h3 className="text-lg font-semibold mb-3 bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent">
            Candidate Requirements
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex items-start">
              <svg className="w-5 h-5 mt-1 mr-3 text-[#667eea] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M12 14l9-5-9-5-9 5 9 5z"></path>
                <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"></path>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222"></path>
              </svg>
              <div>
                <div className="font-medium text-[#667eea]">Degree</div>
                {renderTags(jobDetail.degree)}
              </div>
            </div>
            <div className="flex items-start">
              <svg className="w-5 h-5 mt-1 mr-3 text-[#667eea] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
              </svg>
              <div>
                <div className="font-medium text-[#667eea]">Eligible Streams</div>
                {renderTags(jobDetail.studentStreams)}
              </div>
            </div>
            <div className="flex items-start col-span-1 sm:col-span-2">
              <svg className="w-5 h-5 mt-1 mr-3 text-[#667eea] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
              <div>
                <div className="font-medium text-[#667eea]">Required Skills</div>
                {renderTags(jobDetail.skills)}
              </div>
            </div>
          </div>
        </section>

        {/* Compensation & Benefits */}
        <section className="mb-8">
          <h3 className="text-lg font-semibold mb-3 bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent">
            Compensation & Benefits 
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-gradient-to-br from-[#667eea]/5 to-[#764ba2]/5 p-4 rounded-lg border border-gray-200">
              <div className="text-sm font-medium text-[#667eea]">Total CTC</div>
              <div className="text-lg font-bold text-gray-900">
                {jobDetail.packageDetails?.totalCTC
                  ? `${jobDetail.packageDetails.currency || ''} ${jobDetail.packageDetails.totalCTC.toLocaleString()}`
                  : 'Not Specified'}
              </div>
            </div>
            <div className="bg-gradient-to-br from-[#667eea]/5 to-[#764ba2]/5 p-4 rounded-lg border border-gray-200">
              <div className="text-sm font-medium text-[#667eea]">Fixed Pay</div>
              <div className="text-lg font-bold text-gray-900">
                {jobDetail.packageDetails?.fixedPay
                  ? `${jobDetail.packageDetails.currency || ''} ${jobDetail.packageDetails.fixedPay.toLocaleString()}`
                  : 'N/A'}
              </div>
            </div>
            <div className="bg-gradient-to-br from-[#667eea]/5 to-[#764ba2]/5 p-4 rounded-lg border border-gray-200">
              <div className="text-sm font-medium text-[#667eea]">Variable Pay</div>
              <div className="text-lg font-bold text-gray-900">
                {jobDetail.packageDetails?.joiningBonus
                  ? `${jobDetail.packageDetails.currency || ''} ${jobDetail.packageDetails.joiningBonus.toLocaleString()}`
                  : 'N/A'}
              </div>
            </div>
          </div>
          <h4 className="font-medium text-[#667eea] mb-2">Benefits Offered</h4>
          {renderTags(jobDetail.benefits)}
        </section>

        {/* Hiring Process */}
        <section className="mb-8">
          <h3 className="text-lg font-semibold mb-3 bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent">
            Hiring Process
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex items-start">
              <svg className="w-5 h-5 mt-1 mr-3 text-[#667eea] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
              </svg>
              <div>
                <div className="font-medium text-[#667eea]">Selection Process</div>
                {renderTags(jobDetail.selectionProcess)}
              </div>
            </div>
            <div className="flex items-start">
              <svg className="w-5 h-5 mt-1 mr-3 text-[#667eea] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
              </svg>
              <div>
                <div className="font-medium text-[#667eea]">Number of Rounds</div>
                <div className="text-gray-700">{jobDetail.rounds?.join(', ') || 'N/A'}</div>
              </div>
            </div>
          </div>
        </section>

        {/* About the role - KEPT AS ORIGINAL TEXT */}
        <section className="mb-8">
          <h3 className="text-lg font-semibold mb-3 bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent">
            About the Role
          </h3>
          <p className="text-gray-700 whitespace-pre-wrap">{jobDetail.description || 'No description available.'}</p>
        </section>

        {/* Eligibility Criteria - KEPT AS ORIGINAL TEXT */}
        <section className="mb-8">
          <h3 className="text-lg font-semibold mb-3 bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent">
            Eligibility Criteria
          </h3>
          <p className="text-gray-700 whitespace-pre-wrap">{jobDetail.eligibilityCriteria || 'No criteria specified.'}</p>
        </section>

        {/* Important Dates */}
        <section className="mb-8">
          <h3 className="text-lg font-semibold mb-3 bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent">
            Important Dates
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-[#667eea]/5 to-[#764ba2]/5 border border-gray-200 p-3 rounded-lg">
              <div className="text-sm text-[#667eea]">Registration Deadline</div>
              <div className="font-medium text-red-600">
                {jobDetail.endDate ? new Date(jobDetail.endDate).toLocaleDateString('en-GB') : 'N/A'}
              </div>
            </div>
            <div className="bg-gradient-to-br from-[#667eea]/5 to-[#764ba2]/5 border border-gray-200 p-3 rounded-lg">
              <div className="text-sm text-[#667eea]">Test Date</div>
              <div className="font-medium text-gray-700">TBD</div>
            </div>
            <div className="bg-gradient-to-br from-[#667eea]/5 to-[#764ba2]/5 border border-gray-200 p-3 rounded-lg">
              <div className="text-sm text-[#667eea]">Interview Window</div>
              <div className="font-medium text-gray-700">TBD</div>
            </div>
            <div className="bg-gradient-to-br from-[#667eea]/5 to-[#764ba2]/5 border border-gray-200 p-3 rounded-lg">
              <div className="text-sm text-[#667eea]">Results</div>
              <div className="font-medium text-gray-700">TBD</div>
            </div>
          </div>
        </section>

        {/* Bottom Back Button */}
        <section className="mt-8 pt-6 border-t border-gray-200">
          <div className="flex justify-left">
            <button 
              onClick={() => handleBackToList()} 
              className="inline-flex items-center px-6 py-3 bg-white text-[#667eea] border border-[#667eea] hover:bg-gradient-to-r hover:from-[#667eea] hover:to-[#764ba2] hover:text-white rounded-xl transition-all duration-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              Back
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}

export default OffCampusJobDetail;