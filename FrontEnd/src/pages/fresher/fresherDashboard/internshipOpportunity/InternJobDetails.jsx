import { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { ApplyForInternship, getInternshipById, SaveOppurtunity, viewed } from '@/lib/User_AxiosInstance';
import { ArrowLeft, MapPin, Building2, Users, Briefcase, DollarSign, GraduationCap, FileText, Globe, Clock, CheckCircle, Share2, IndianRupee } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from "@/context/AuthContext";

const InternJobDetails = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { isAuthenticated, loading } = useAuth();
  
  const [jobDetails, setJobDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSaved, setIsSaved] = useState((searchParams.get('isSaved') || '').toLowerCase() === 'true');
  const [isApplied, setIsApplied] = useState((searchParams.get('isApplied') || '').toLowerCase() === 'true');
  const [isApplying, setIsApplying] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const handleShare = async () => {
    const shareData = {
      title: jobDetails?.jobTitle || 'Internship Opportunity',
      text: `Check out this internship opportunity at ${jobDetails?.companyPosted?.companyDetails?.companyName || 'this company'}!`,
      url: window.location.href,
    };
  
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast.success('Link copied to clipboard!');
      }
    } catch (err) {
      console.error('Error sharing:', err);
    }
  };

  useEffect(() => {
    const loadJobDetails = async () => {
      try {
        setIsLoading(true);
        const response = await getInternshipById(jobId);
        setJobDetails(response.data);
        await viewed(response.data._id);
        console.log("Internship Details:", response.data);
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
    if (loading) return;

  // 🔐 Not logged in
  if (!isAuthenticated) {
    toast.error("Please login to apply");
    return;
  }
    try {
      setIsApplying(true);
      const response = await ApplyForInternship(jobId);
      console.log("Apply response:", response);
      
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
      console.log("Save response:", response);
      
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

  // Format currency with rupee sign
  const formatCurrency = (amount, currency) => {
    if (!amount) return 'Not Specified';
    
    // Convert to Indian Rupee format
    const formatter = new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency || 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
    
    return formatter.format(amount);
  };

  // Get company location properly
  const getCompanyLocation = () => {
    if (!jobDetails?.companyPosted?.companyDetails) return 'N/A';
    
    const { companyLocation, state, country } = jobDetails.companyPosted.companyDetails;
    
    const locationParts = [];
    if (companyLocation) locationParts.push(companyLocation);
    if (state) locationParts.push(state);
    if (country) locationParts.push(country);
    
    return locationParts.length > 0 ? locationParts.join(', ') : 'N/A';
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
        {/* Top Back Button */}
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
              <p className="text-gray-600">at {jobDetails.companyPosted?.companyDetails?.companyName || 'N/A'}</p>
            </div>
          </div>
          <div className="flex space-x-2">
            <button 
              onClick={handleShare}
              className="bg-white hover:bg-gray-50 text-[#667eea] font-bold py-2 px-3 rounded-lg transition-all duration-300 border border-[#667eea]/20 shadow-sm flex items-center gap-2"
              title="Share Internship"
            >
              <Share2 className="w-5 h-5" />
              <span className="hidden sm:inline">Share</span>
            </button>
            {!isApplied && (
              <>
                {/* Save Button */}
                {!isSaved ? (
                  <button 
                    onClick={handleSave} 
                    disabled={isSaving}
                    className={`bg-gradient-to-br from-[#667eea]/10 to-[#764ba2]/10 hover:from-[#667eea]/20 hover:to-[#764ba2]/20 text-[#667eea] font-bold py-2 px-5 rounded-lg transition-all duration-300 border border-gray-200 ${
                      isSaving ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    {isSaving ? 'Saving...' : 'Save'}
                  </button>
                ) : (
                  <button 
                    className="bg-gradient-to-br from-green-500/10 to-green-600/10 text-green-600 font-bold py-2 px-5 rounded-lg border border-green-200 cursor-default"
                    disabled
                  >
                    ✓ Saved
                  </button>
                )}
                
                {/* Apply Button */}
                <button 
                  onClick={handleApply}
                  disabled={isApplying}
                  className={`px-4 py-2 bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white rounded-lg hover:shadow-lg hover:shadow-[#667eea]/30 transition-all duration-200 ${
                    isApplying ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {isApplying ? 'Applying...' : 'Apply'}
                </button>
              </>
            )}
            {isApplied && (
              <button 
                className="bg-gradient-to-r from-green-500 to-green-600 text-white font-bold py-2 px-5 rounded-lg cursor-default"
                disabled
              >
                ✓ Applied
              </button>
            )}
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
                {renderTags(jobDetails.location)}
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
              <IndianRupee className="w-5 h-5 mt-1 mr-3 text-[#667eea] flex-shrink-0" />
              <div>
                <div className="font-medium text-[#667eea]">Stipend</div>
                <div className="text-gray-700">
                  {formatCurrency(jobDetails.minPackage?.amount, jobDetails.minPackage?.currency)}
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

        {/* Internship Description - KEPT AS ORIGINAL TEXT */}
        <section className="mb-8">
          <h3 className="text-lg font-semibold mb-3 bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent">
            Internship Description
          </h3>
          <p className="text-gray-700 whitespace-pre-wrap">
            {jobDetails.description || 'No description available.'}
          </p>
        </section>

        {/* Eligibility Criteria - KEPT AS ORIGINAL TEXT */}
        <section className="mb-8">
          <h3 className="text-lg font-semibold mb-3 bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent">
            Eligibility Criteria
          </h3>
          <p className="text-gray-700 whitespace-pre-wrap">
            {jobDetails.eligibilityCriteria || 'No criteria specified.'}
          </p>
        </section>

        {/* Key Skills */}
        <section className="mb-8">
          <h3 className="text-lg font-semibold mb-3 bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent">
            Key Skills Required
          </h3>
          {renderTags(jobDetails.skills)}
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

        {/* Benefits & Perks */}
        <section className="mb-8">
          <h3 className="text-lg font-semibold mb-3 bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent">
            Benefits & Perks
          </h3>
          {renderTags(jobDetails.benefits)}
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
        <section className="mb-8">
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

        {/* Company Location - IMPROVED */}
        <section className="mb-8 pt-6 border-t border-gray-200">
          <h3 className="text-lg font-semibold mb-3 bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent">
            Company Location
          </h3>
          <div className="flex items-start">
            <MapPin className="w-5 h-5 mt-0.5 mr-3 text-[#667eea] flex-shrink-0" />
            <div>
              <div className="text-gray-700">
                {getCompanyLocation()}
              </div>
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
};

export default InternJobDetails;