import { useState, useEffect } from 'react';
import JobListSection from '@/components/student/studentDashboard/referralJobs/JobListSection';
import { getReferralJobListing } from '@/lib/User_AxiosInstance';
import { FiRefreshCw, FiBriefcase } from 'react-icons/fi';

const RefferalJobListings = () => {
  const [profileJobs, setProfileJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchInternships = async () => {
    try {
      setIsLoading(true);
      const response = await getReferralJobListing();
      // Corrected: Access the 'data' property of the response.data.data object
      setProfileJobs(response.data.data);
      setError(null);
    } catch (error) {
      setError('Failed to load referral jobs. Please try again later.');
      console.error('Error fetching referral jobs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInternships();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#143694]/10 via-[#f093fb]/5 to-[#1e4ed8]/10 flex justify-center items-center">
        {/* Pastel blur background elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#143694]/10 rounded-full blur-3xl"></div>
          <div className="absolute top-1/3 -left-20 w-60 h-60 bg-[#f093fb]/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-1/3 w-40 h-40 bg-[#1e4ed8]/10 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative z-10 text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#143694] mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium bg-gradient-to-r from-[#143694] to-[#1e4ed8] bg-clip-text text-transparent">
            Loading referral opportunities...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#143694]/10 via-[#f093fb]/5 to-[#1e4ed8]/10 flex justify-center items-center">
        {/* Pastel blur background elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#143694]/10 rounded-full blur-3xl"></div>
          <div className="absolute top-1/3 -left-20 w-60 h-60 bg-[#f093fb]/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-1/3 w-40 h-40 bg-[#1e4ed8]/10 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative z-10 bg-white/90 backdrop-blur-sm border border-white/50 rounded-2xl shadow-lg shadow-purple-50/50 p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Unable to Load Jobs</h3>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              className="inline-flex items-center bg-gradient-to-r from-[#143694] to-[#1e4ed8] text-white hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-200 px-6 py-3 rounded-xl font-medium"
              onClick={() => fetchInternships()}
            >
              <FiRefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#143694]/10 via-[#f093fb]/5 to-[#1e4ed8]/10">
      {/* Pastel blur background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#143694]/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 -left-20 w-60 h-60 bg-[#f093fb]/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-1/3 w-40 h-40 bg-[#1e4ed8]/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="bg-white/90 backdrop-blur-sm border border-white/50 rounded-2xl shadow-lg shadow-purple-50/50 p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-[#143694] to-[#1e4ed8] bg-clip-text text-transparent mb-2">
                Referral Opportunities
              </h1>
              <p className="text-gray-600">
                Discover exclusive job opportunities through employee referrals
              </p>
            </div>
            <div className="hidden md:block">
              <div className="flex items-center space-x-2 bg-gradient-to-r from-[#a5b4fc]/20 to-[#c4b5fd]/20 p-3 rounded-xl">
                <FiBriefcase className="w-6 h-6 text-[#143694]" />
                <div>
                  <p className="text-sm text-gray-600">Available Jobs</p>
                  <p className="text-xl font-bold bg-gradient-to-r from-[#143694] to-[#1e4ed8] bg-clip-text text-transparent">
                    {profileJobs?.length || 0}
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Stats Cards */}
          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-gradient-to-r from-[#a5b4fc]/10 to-[#c4b5fd]/10 border border-[#a5b4fc]/20 rounded-xl">
              <p className="text-sm text-gray-600">Total Referrals</p>
              <p className="text-2xl font-bold bg-gradient-to-r from-[#143694] to-[#1e4ed8] bg-clip-text text-transparent">
                {profileJobs?.length || 0}
              </p>
            </div>
            <div className="p-4 bg-gradient-to-r from-[#bbf7d0]/10 to-[#86efac]/10 border border-[#bbf7d0]/20 rounded-xl">
              <p className="text-sm text-gray-600">High Priority</p>
              <p className="text-2xl font-bold bg-gradient-to-r from-[#059669] to-[#10b981] bg-clip-text text-transparent">
                0
              </p>
            </div>
            <div className="p-4 bg-gradient-to-r from-[#fde68a]/10 to-[#fcd34d]/10 border border-[#fde68a]/20 rounded-xl">
              <p className="text-sm text-gray-600">Application Pending</p>
              <p className="text-2xl font-bold bg-gradient-to-r from-[#d97706] to-[#f59e0b] bg-clip-text text-transparent">
                0
              </p>
            </div>
            <div className="p-4 bg-gradient-to-r from-[#fbcfe8]/10 to-[#f9a8d4]/10 border border-[#fbcfe8]/20 rounded-xl">
              <p className="text-sm text-gray-600">Recent Additions</p>
              <p className="text-2xl font-bold bg-gradient-to-r from-[#be185d] to-[#ec4899] bg-clip-text text-transparent">
                0
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white/90 backdrop-blur-sm border border-white/50 rounded-2xl shadow-lg shadow-purple-50/50 p-6">
          <JobListSection
            title="Referral jobs based on your profile"
            description="Explore exclusive job opportunities tailored to your academic background and skills through employee referrals."
            jobs={profileJobs}
            userType={localStorage.getItem('selectedRole')}
          />

          {/* Tips Section */}
          {profileJobs && profileJobs.length > 0 && (
            <div className="mt-8 p-6 bg-gradient-to-r from-[#fef3c7]/10 to-[#fde68a]/10 border border-[#fde68a]/20 rounded-xl">
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                <svg className="w-5 h-5 text-[#d97706] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                Tips for Referral Success
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-white/50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Connect First</p>
                  <p className="text-sm text-gray-700">Always establish a connection before requesting a referral</p>
                </div>
                <div className="p-4 bg-white/50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Customize Request</p>
                  <p className="text-sm text-gray-700">Personalize each referral request for better response</p>
                </div>
                <div className="p-4 bg-white/50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Follow Up</p>
                  <p className="text-sm text-gray-700">Politely follow up if you don't hear back within a week</p>
                </div>
              </div>
            </div>
          )}

          {/* No Jobs Message */}
          {(!profileJobs || profileJobs.length === 0) && !isLoading && (
            <div className="text-center py-12">
              <div className="max-w-md mx-auto">
                <div className="w-20 h-20 bg-gradient-to-r from-[#a5b4fc]/20 to-[#c4b5fd]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiBriefcase className="w-10 h-10 text-[#143694]" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Referral Jobs Available</h3>
                <p className="text-gray-600 mb-6">
                  Currently, there are no referral opportunities matching your profile. 
                  Check back later or expand your network to find more opportunities.
                </p>
                <div className="space-x-4">
                  <button
                    className="bg-gradient-to-r from-[#143694] to-[#1e4ed8] text-white hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-200 px-6 py-3 rounded-xl font-medium"
                    onClick={() => fetchInternships()}
                  >
                    <FiRefreshCw className="inline-block w-4 h-4 mr-2" />
                    Refresh Jobs
                  </button>
                  <button className="border border-[#143694] text-[#143694] hover:bg-[#143694]/10 transition-all duration-200 px-6 py-3 rounded-xl font-medium">
                    Update Profile
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Note */}
        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>
            Referral jobs are exclusive opportunities shared by company employees. 
            Always approach with professionalism and respect.
          </p>
        </div>
      </div>
    </div>
  );
};

export default RefferalJobListings;