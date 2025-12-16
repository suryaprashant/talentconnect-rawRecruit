import { useState, useEffect } from 'react';
import JobListSection from '@/components/student/studentDashboard/referralJobs/JobListSection';
import { getReferralJobListing } from '@/lib/User_AxiosInstance';
import { FiRefreshCw, FiFilter } from 'react-icons/fi';

const StudentRefferalJobListings = () => {
  const [profileJobs, setProfileJobs] = useState([]);
  const [preferenceJobs, setPreferenceJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');

  const fetchInternships = async () => {
    try {
      setIsLoading(true);
      const response = await getReferralJobListing();
      setProfileJobs(response.data.data);
      setError(null);
    } catch (error) {
      setError('Failed to load internships. Please try again later.');
      console.error('Error fetching internships:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInternships();
  }, []);

  const filterButtons = [
    { id: 'all', label: 'All Jobs' },
    { id: 'referral', label: 'Referral Only' },
    { id: 'profile', label: 'Profile Match' },
    { id: 'preference', label: 'My Preferences' },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#667eea]/10 via-[#f093fb]/5 to-[#764ba2]/10">
        {/* Pastel blur background elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#667eea]/10 rounded-full blur-3xl"></div>
          <div className="absolute top-1/3 -left-20 w-60 h-60 bg-[#f093fb]/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-1/3 w-40 h-40 bg-[#764ba2]/10 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative z-10 flex justify-center items-center h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#667eea] mx-auto mb-4"></div>
            <p className="text-gray-600 font-medium">Loading referral jobs...</p>
            <p className="text-sm text-gray-500 mt-2">Matching opportunities to your profile</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#667eea]/10 via-[#f093fb]/5 to-[#764ba2]/10">
        {/* Pastel blur background elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#667eea]/10 rounded-full blur-3xl"></div>
          <div className="absolute top-1/3 -left-20 w-60 h-60 bg-[#f093fb]/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-1/3 w-40 h-40 bg-[#764ba2]/10 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative z-10 flex justify-center items-center h-screen">
          <div className="bg-white/90 backdrop-blur-sm border border-white/50 rounded-2xl shadow-lg shadow-purple-50/50 p-8 text-center max-w-md mx-4">
            <div className="text-red-500 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Unable to Load Jobs</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              className="bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white px-6 py-3 rounded-xl hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-200 font-medium flex items-center justify-center mx-auto"
              onClick={fetchInternships}
            >
              <FiRefreshCw className="w-5 h-5 mr-2" />
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#667eea]/10 via-[#f093fb]/5 to-[#764ba2]/10">
      {/* Pastel blur background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#667eea]/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 -left-20 w-60 h-60 bg-[#f093fb]/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-1/3 w-40 h-40 bg-[#764ba2]/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 p-4 md:p-6">
        {/* Header Section */}
        <div className="bg-white/90 backdrop-blur-sm border border-white/50 rounded-2xl shadow-lg shadow-purple-50/50 p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent mb-2">
                Referral Opportunities
              </h1>
              <p className="text-gray-600">
                Explore job opportunities tailored to your academic background and skills.
              </p>
            </div>
            
            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="flex flex-col">
                <span className="text-xs text-gray-500 mb-1">Total Jobs</span>
                <span className="px-3 py-2 text-sm font-medium bg-gradient-to-r from-[#a5b4fc]/20 to-[#c4b5fd]/20 text-[#5b21b6] border border-[#a5b4fc]/30 rounded-xl">
                  {profileJobs?.length || 0}
                </span>
              </div>
              
              <div className="flex flex-col">
                <span className="text-xs text-gray-500 mb-1">Status</span>
                <span className="px-3 py-2 text-sm font-medium bg-gradient-to-r from-[#bbf7d0]/20 to-[#86efac]/20 text-[#065f46] border border-[#bbf7d0]/30 rounded-xl">
                  Active
                </span>
              </div>
              
              <div className="flex flex-col">
                <span className="text-xs text-gray-500 mb-1">Updated</span>
                <span className="px-3 py-2 text-sm font-medium bg-gradient-to-r from-[#fde68a]/20 to-[#fcd34d]/20 text-[#92400e] border border-[#fde68a]/30 rounded-xl">
                  Today
                </span>
              </div>
              
              <div className="flex flex-col">
                <span className="text-xs text-gray-500 mb-1">Type</span>
                <span className="px-3 py-2 text-sm font-medium bg-gradient-to-r from-[#fbcfe8]/20 to-[#f9a8d4]/20 text-[#9d174d] border border-[#fbcfe8]/30 rounded-xl">
                  Referral
                </span>
              </div>
            </div>
          </div>

          {/* Filter Buttons */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <FiFilter className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Filter by:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {filterButtons.map((filter) => (
                <button
                  key={filter.id}
                  className={`px-4 py-2 text-sm font-medium rounded-xl transition-all duration-200 ${
                    activeFilter === filter.id
                      ? 'bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white shadow-lg shadow-purple-500/30'
                      : 'bg-white/50 backdrop-blur-sm border border-gray-200 text-gray-700 hover:bg-gray-50'
                  }`}
                  onClick={() => setActiveFilter(filter.id)}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          {/* Refresh Button */}
          <div className="flex justify-end">
            <button
              className="flex items-center px-4 py-2 text-sm font-medium bg-white/70 backdrop-blur-sm border border-gray-200 rounded-xl text-gray-700 hover:bg-white/90 hover:shadow-md transition-all duration-200"
              onClick={fetchInternships}
            >
              <FiRefreshCw className="w-4 h-4 mr-2" />
              Refresh Jobs
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          {/* Profile-Based Jobs */}
          {profileJobs?.length > 0 ? (
            <JobListSection
              title="Referral jobs based on your profile"
              description="Explore internship opportunities tailored to your academic background and skills."
              jobs={profileJobs}
              userType={localStorage.getItem('selectedRole')}
            />
          ) : (
            <div className="bg-white/90 backdrop-blur-sm border border-white/50 rounded-2xl shadow-lg shadow-purple-50/50 p-8 text-center">
              <div className="text-gray-400 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Referral Jobs Found</h3>
              <p className="text-gray-600 mb-6">
                We couldn't find any referral jobs matching your profile. Check back later or update your preferences.
              </p>
              <button
                className="bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white px-6 py-3 rounded-xl hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-200 font-medium"
                onClick={fetchInternships}
              >
                Refresh Jobs
              </button>
            </div>
          )}

          {/* Placeholder for Preference-Based Jobs (Optional) */}
          {/* {preferenceJobs?.length > 0 && (
            <JobListSection
              title="Internships based on your preferences"
              description="Discover internships matching your saved preferences."
              jobs={preferenceJobs}
              userType={localStorage.getItem('selectedRole')}
            />
          )} */}

          {/* Bottom Action Section */}
          {profileJobs?.length > 0 && (
            <div className="bg-white/90 backdrop-blur-sm border border-white/50 rounded-2xl shadow-lg shadow-purple-50/50 p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    Need more opportunities?
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Update your profile preferences to get better job matches.
                  </p>
                </div>
                <div className="flex gap-3">
                  <button className="px-4 py-2 text-sm font-medium bg-white/70 backdrop-blur-sm border border-gray-200 rounded-xl text-gray-700 hover:bg-white/90 hover:shadow-md transition-all duration-200">
                    Update Preferences
                  </button>
                  <button className="px-4 py-2 text-sm font-medium bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white rounded-xl hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-200">
                    View All Jobs
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentRefferalJobListings;