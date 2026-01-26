import { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { ApplyForInternship, getInternshipById, SaveOppurtunity, viewed } from '@/lib/User_AxiosInstance';
import { ArrowLeft, MapPin, Building2, Users, Calendar, Briefcase, DollarSign, Award, GraduationCap, FileText, Globe, Clock, CheckCircle, ChevronLeft } from 'lucide-react';
import toast from 'react-hot-toast';

const InternJobDetails = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const [jobDetails, setJobDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSaved, setIsSaved] = useState((searchParams.get('isSaved') || '').toLowerCase() === 'true');
  const [isApplied, setIsApplied] = useState((searchParams.get('isApplied') || '').toLowerCase() === 'true');
  const [isApplying, setIsApplying] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const loadJobDetails = async () => {
      try {
        setIsLoading(true);
        const response = await getInternshipById(jobId);
        setJobDetails(response.data);
        await viewed(response.data._id);
        setError(null);
      } catch (err) {
        setError('Failed to load internship details. Please try again later.');
        console.error('Error fetching internship details:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (jobId) {
      loadJobDetails();
    }
  }, [jobId]);

  const handleApply = async () => {
    try {
      setIsApplying(true);
      const response = await ApplyForInternship(jobId);
      
      if (response?.data?.success === true) {
        toast.success('Application submitted!');
        setIsApplied(true);
      } else {
        const errorMsg = response?.response?.data?.msg || 
                        response?.data?.msg || 
                        'Failed to apply. Please try again.';
        toast.error(errorMsg);
      }
    } catch (err) {
      console.error('Error applying for internship:', err);
      const errorMsg = err?.response?.data?.msg || 
                      err?.message || 
                      'Something went wrong!';
      toast.error(errorMsg);
    } finally {
      setIsApplying(false);
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const response = await SaveOppurtunity(jobId, jobDetails?.jobType || 'internship');
      
      if (response?.data?.success === true) {
        toast.success('Internship saved!');
        setIsSaved(true);
      } else {
        const errorMsg = response?.response?.data?.msg || 
                        response?.data?.msg || 
                        'Failed to save internship. Please try again.';
        toast.error(errorMsg);
      }
    } catch (err) {
      console.error('Error saving internship:', err);
      const errorMsg = err?.response?.data?.msg || 
                      err?.message || 
                      'Something went wrong!';
      toast.error(errorMsg);
    } finally {
      setIsSaving(false);
    }
  };

  const handleBackToList = () => {
    window.history.back();
  };

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

  // Helper function to render bullet points
  const renderBulletPoints = (text) => {
    if (!text) return <p className="text-gray-700">No information available.</p>;
    
    return (
      <ul className="space-y-2 text-gray-700">
        {text
          .split(/\n|\.\s+|;\s+/)
          .filter(point => point.trim().length > 0)
          .map((point, index) => (
            <li key={index} className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-[#667eea] to-[#764ba2] mt-2 flex-shrink-0"></div>
              <span>{point.trim()}</span>
            </li>
          ))}
      </ul>
    );
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-[#667eea]/5 via-[#f093fb]/5 to-[#764ba2]/5">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#667eea]"></div>
      </div>
    );
  }

  if (error || !jobDetails) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-[#667eea]/5 via-[#f093fb]/5 to-[#764ba2]/5">
        <div className="text-center p-4">
          <p className="text-xl font-semibold text-red-500">{error || "Internship not found"}</p>
          <button
            className="mt-4 bg-gradient-to-r from-[#667eea] to-[#764ba2] hover:shadow-lg hover:shadow-[#667eea]/30 text-white px-4 py-2 rounded-lg transition-all duration-200"
            onClick={() => navigate('/student-dashboard/Internship')}
          >
            Back to Internships
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#667eea]/5 via-[#f093fb]/5 to-[#764ba2]/5">
      <div className="max-w-4xl mx-auto bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-gray-100 p-6 my-8">
        {/* Back Button - Top Left */}
        <button 
          onClick={handleBackToList} 
          className="inline-flex items-center text-[#667eea] hover:text-[#764ba2] mb-6 transition-colors"
        >
          <ChevronLeft className="w-5 h-5 mr-1" />
          Back
        </button>

        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-[#667eea]/20 to-[#764ba2]/20 flex items-center justify-center rounded-full overflow-hidden flex-shrink-0">
              {jobDetails.companyPosted?.profileImage ? (
                <img
                  src={jobDetails.companyPosted.profileImage}
                  alt={jobDetails.companyPosted.companyDetails.companyName || "Company Logo"}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://placehold.co/48x48/cccccc/000000?text=Logo';
                  }}
                />
              ) : (
                <Building2 className="w-8 h-8 text-[#667eea]" />
              )}
            </div>
            <div>
              <h2 className="text-xl font-bold bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent">
                {jobDetails.jobTitle}
              </h2>
              <p className="text-gray-600 text-sm">at {jobDetails.companyPosted?.companyDetails?.companyName || 'N/A'}</p>
              <p className="text-xs text-gray-400 mt-1">Internship ID: {jobDetails._id}</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            {!isApplied && (
              <>
                {/* Save Button */}
                {!isSaved ? (
                  <button 
                    onClick={handleSave} 
                    disabled={isSaving}
                    className={`bg-gradient-to-br from-[#667eea]/10 to-[#764ba2]/10 hover:from-[#667eea]/20 hover:to-[#764ba2]/20 text-[#667eea] font-bold py-2 px-4 rounded-lg transition-all duration-300 border border-gray-200 text-sm ${
                      isSaving ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    {isSaving ? 'Saving...' : 'Save'}
                  </button>
                ) : (
                  <button 
                    className="bg-gradient-to-br from-green-500/10 to-green-600/10 text-green-600 font-bold py-2 px-4 rounded-lg border border-green-200 cursor-default text-sm"
                    disabled
                  >
                    ✓ Saved
                  </button>
                )}
                
                {/* Apply Button */}
                <button 
                  onClick={handleApply}
                  disabled={isApplying}
                  className={`px-4 py-2 bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white rounded-lg hover:shadow-lg hover:shadow-[#667eea]/30 transition-all duration-200 text-sm ${
                    isApplying ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {isApplying ? 'Applying...' : 'Apply'}
                </button>
              </>
            )}
            {isApplied && (
              <button 
                className="bg-gradient-to-r from-green-500 to-green-600 text-white font-bold py-2 px-4 rounded-lg cursor-default text-sm"
                disabled
              >
                ✓ Applied
              </button>
            )}
          </div>
        </div>

        {/* Quick Info Bar */}
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex items-center text-gray-600">
            <MapPin className="w-4 h-4 mr-1" />
            <span className="text-sm">{Array.isArray(jobDetails.location) ? jobDetails.location.join(', ') : jobDetails.location}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <Clock className="w-4 h-4 mr-1" />
            <span className="text-sm">{jobDetails.internshipDuration}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <DollarSign className="w-4 h-4 mr-1" />
            <span className="text-sm">
              {jobDetails.minPackage?.amount 
                ? `${jobDetails.minPackage.amount} ${jobDetails.minPackage.currency}` 
                : 'Not Specified'}
            </span>
          </div>
        </div>

        {/* About Company */}
        <section className="mb-8">
          <h3 className="text-lg font-semibold mb-3 bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent">
            About {jobDetails.companyPosted?.companyDetails?.companyName || "Company"}
          </h3>
          <p className="text-gray-700 mb-4">{jobDetails.companyPosted?.companyDetails?.description || 'No company description available.'}</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-[#667eea]/5 to-[#764ba2]/5 border border-gray-200 p-4 rounded-lg">
              <div className="font-bold text-lg">{jobDetails.companyPosted?.companyDetails?.numberOfEmployees || "N/A"}</div>
              <div className="text-sm text-gray-600">Employees</div>
            </div>
            <div className="bg-gradient-to-br from-[#667eea]/5 to-[#764ba2]/5 border border-gray-200 p-4 rounded-lg">
              <div className="font-bold text-lg capitalize">{jobDetails.companyPosted?.companyDetails?.industryType || "N/A"}</div>
              <div className="text-sm text-gray-600">Industry</div>
            </div>
            <div className="bg-gradient-to-br from-[#667eea]/5 to-[#764ba2]/5 border border-gray-200 p-4 rounded-lg">
              <div className="font-bold text-lg">{jobDetails.companyPosted?.companyDetails?.country || "N/A"}</div>
              <div className="text-sm text-gray-600">Country</div>
            </div>
          </div>
        </section>

        {/* Internship Details */}
        <section className="mb-8">
          <h3 className="text-lg font-semibold mb-3 bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent">
            Internship Details
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex items-start">
              <MapPin className="w-5 h-5 mt-1 mr-3 text-[#667eea] flex-shrink-0" />
              <div>
                <div className="font-medium text-[#667eea]">Location</div>
                <div className="text-gray-700">{Array.isArray(jobDetails.location) ? jobDetails.location.join(', ') : jobDetails.location}</div>
              </div>
            </div>
            <div className="flex items-start">
              <Clock className="w-5 h-5 mt-1 mr-3 text-[#667eea] flex-shrink-0" />
              <div>
                <div className="font-medium text-[#667eea]">Duration</div>
                <div className="text-gray-700">{jobDetails.internshipDuration || 'N/A'}</div>
              </div>
            </div>
            <div className="flex items-start">
              <Briefcase className="w-5 h-5 mt-1 mr-3 text-[#667eea] flex-shrink-0" />
              <div>
                <div className="font-medium text-[#667eea]">Work Mode</div>
                <div className="text-gray-700 capitalize">{jobDetails.workMode || 'N/A'}</div>
              </div>
            </div>
            <div className="flex items-start">
              <Users className="w-5 h-5 mt-1 mr-3 text-[#667eea] flex-shrink-0" />
              <div>
                <div className="font-medium text-[#667eea]">Number of Openings</div>
                <div className="text-gray-700">{jobDetails.numberOfOpenings || 'N/A'}</div>
              </div>
            </div>
            <div className="flex items-start">
              <DollarSign className="w-5 h-5 mt-1 mr-3 text-[#667eea] flex-shrink-0" />
              <div>
                <div className="font-medium text-[#667eea]">Stipend</div>
                <div className="text-gray-700">
                  {jobDetails.minPackage?.amount 
                    ? `${jobDetails.minPackage.amount} ${jobDetails.minPackage.currency}` 
                    : 'Not Specified'}
                </div>
              </div>
            </div>
            <div className="flex items-start">
              <Globe className="w-5 h-5 mt-1 mr-3 text-[#667eea] flex-shrink-0" />
              <div>
                <div className="font-medium text-[#667eea]">Work Authorization</div>
                <div className="text-gray-700 capitalize">{jobDetails.workAuthorization || 'N/A'}</div>
              </div>
            </div>
          </div>
        </section>

        {/* Internship Description */}
        <section className="mb-8">
          <h3 className="text-lg font-semibold mb-3 bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent">
            Internship Description
          </h3>
          {renderBulletPoints(jobDetails.description)}
        </section>

        {/* Eligibility Criteria */}
        <section className="mb-8">
          <h3 className="text-lg font-semibold mb-3 bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent">
            Eligibility Criteria
          </h3>
          {renderBulletPoints(jobDetails.eligibilityCriteria)}
        </section>

        {/* Key Skills */}
        <section className="mb-8">
          <h3 className="text-lg font-semibold mb-3 bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent">
            Key Skills Required
          </h3>
          {renderTags(jobDetails.skills)}
        </section>

        {/* Benefits & Perks */}
        <section className="mb-8">
          <h3 className="text-lg font-semibold mb-3 bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent">
            Benefits & Perks
          </h3>
          {renderTags(jobDetails.benefits)}
        </section>

        {/* Education Requirements */}
        <section className="mb-8">
          <h3 className="text-lg font-semibold mb-3 bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent">
            Education Requirements
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex items-start">
              <GraduationCap className="w-5 h-5 mt-1 mr-3 text-[#667eea] flex-shrink-0" />
              <div>
                <div className="font-medium text-[#667eea]">Minimum Education</div>
                <div className="text-gray-700 capitalize">{jobDetails.minEducation || 'N/A'}</div>
              </div>
            </div>
            <div className="flex items-start">
              <FileText className="w-5 h-5 mt-1 mr-3 text-[#667eea] flex-shrink-0" />
              <div>
                <div className="font-medium text-[#667eea]">Preferred Streams</div>
                {renderTags(jobDetails.studentStreams)}
              </div>
            </div>
          </div>
        </section>

        {/* Certificate Requirements */}
        <section className="mb-8">
          <h3 className="text-lg font-semibold mb-3 bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent">
            Certificate Requirements
          </h3>
          <div className="flex items-center">
            <CheckCircle className="w-5 h-5 mr-3 text-[#667eea] flex-shrink-0" />
            <div className="text-gray-700">{jobDetails.certifications || "Not Required"}</div>
          </div>
        </section>

        {/* Important Dates */}
        <section>
          <h3 className="text-lg font-semibold mb-3 bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent">
            Important Dates
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-[#667eea]/5 to-[#764ba2]/5 border border-gray-200 p-3 rounded-lg">
              <div className="text-sm text-[#667eea]">Application Deadline</div>
              <div className="font-medium text-red-600">
                {jobDetails.endDate ? new Date(jobDetails.endDate).toLocaleDateString('en-GB') : 'N/A'}
              </div>
            </div>
            <div className="bg-gradient-to-br from-[#667eea]/5 to-[#764ba2]/5 border border-gray-200 p-3 rounded-lg">
              <div className="text-sm text-[#667eea]">Internship Start</div>
              <div className="font-medium text-gray-700">Flexible</div>
            </div>
            <div className="bg-gradient-to-br from-[#667eea]/5 to-[#764ba2]/5 border border-gray-200 p-3 rounded-lg">
              <div className="text-sm text-[#667eea]">Interview Dates</div>
              <div className="font-medium text-gray-700">To be scheduled</div>
            </div>
            <div className="bg-gradient-to-br from-[#667eea]/5 to-[#764ba2]/5 border border-gray-200 p-3 rounded-lg">
              <div className="text-sm text-[#667eea]">Results</div>
              <div className="font-medium text-gray-700">Rolling basis</div>
            </div>
          </div>
        </section>

        {/* Company Location */}
        <section className="mt-8 pt-6 border-t border-gray-200">
          <h3 className="text-lg font-semibold mb-3 bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent">
            Company Location
          </h3>
          <div className="flex items-start">
            <MapPin className="w-5 h-5 mt-0.5 mr-3 text-[#667eea] flex-shrink-0" />
            <div>
              <div className="text-gray-700">
                {`${jobDetails.companyPosted?.companyDetails?.companyLocation || 'N/A'}, 
                ${jobDetails.companyPosted?.companyDetails?.state || ''}, 
                ${jobDetails.companyPosted?.companyDetails?.country || ''}`}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default InternJobDetails;