import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import JobCard from '@/components/student/studentDashboard/offCampusListing/JobCard';
import { getRelaventOffcampusOpportunity } from '@/lib/User_AxiosInstance';
import { FiSearch, FiFilter } from 'react-icons/fi';

function OffCampusJobs() {
  const [offCampusJobs, setOffCampusJobs] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleJobClick = (jobId) => {
    navigate(`/student-dashboard/Off-campus/${jobId}`);
  };

  const fetchOffcampusOpportunity = async () => {
    try {
      setIsLoading(true);
      const response = await getRelaventOffcampusOpportunity();
      setOffCampusJobs(response.data.data);
      setError(null);
    } catch (error) {
      setError('Failed to load jobs. Please try again later.')
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchOffcampusOpportunity();
  }, []);

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
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#667eea]"></div>
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
          <div className="bg-white/90 backdrop-blur-sm border border-white/50 rounded-2xl shadow-lg shadow-purple-50/50 p-8 text-center max-w-md">
            <div className="text-red-500 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Oops! Something went wrong</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              className="bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white px-6 py-3 rounded-xl hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-200 font-medium"
              onClick={fetchOffcampusOpportunity}
            >
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

      <div className="relative z-10 p-6">
        {/* Header with theme */}
        <div className="bg-white/90 backdrop-blur-sm border border-white/50 rounded-2xl shadow-lg shadow-purple-50/50 p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent mb-2">
                Off-Campus Jobs
              </h1>
              <p className="text-gray-600">
                Based on your preferences and profile matching
              </p>
            </div>
            
            {/* Pastel color pills in grid layout */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="flex flex-col">
                <span className="text-xs text-gray-500 mb-1">Status</span>
                <span className="px-3 py-2 text-sm font-medium bg-gradient-to-r from-[#bbf7d0]/20 to-[#86efac]/20 text-[#065f46] border border-[#bbf7d0]/30 rounded-xl">
                  Active
                </span>
              </div>
              
              <div className="flex flex-col">
                <span className="text-xs text-gray-500 mb-1">Total Jobs</span>
                <span className="px-3 py-2 text-sm font-medium bg-gradient-to-r from-[#a5b4fc]/20 to-[#c4b5fd]/20 text-[#5b21b6] border border-[#a5b4fc]/30 rounded-xl">
                  {offCampusJobs?.length || 0}
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
                  Off-Campus
                </span>
              </div>
            </div>
          </div>

          {/* Search and Filter Section */}
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <FiSearch className="w-4 h-4 text-gray-400" />
              </div>
              <input
                type="search"
                className="block w-full p-3 pl-10 text-sm border border-gray-200 rounded-xl bg-white/50 focus:outline-none focus:ring-2 focus:ring-[#667eea]/30 focus:border-[#667eea] backdrop-blur-sm"
                placeholder="Search jobs, companies, or keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <FiFilter className="w-4 h-4 text-gray-400" />
              </div>
              <select
                className="block w-full p-3 pl-10 pr-8 text-sm border border-gray-200 rounded-xl bg-white/50 focus:outline-none focus:ring-2 focus:ring-[#667eea]/30 focus:border-[#667eea] backdrop-blur-sm appearance-none"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="">Sort by</option>
                <option value="recent">Most Recent</option>
                <option value="salary">Highest Salary</option>
                <option value="company">Company Name</option>
                <option value="deadline">Application Deadline</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Job Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          {offCampusJobs?.map(job => (
            <div key={job._id} className="transform transition-all duration-200 hover:scale-[1.02] hover:shadow-xl">
              <JobCard job={job} onClick={handleJobClick} />
            </div>
          ))}
        </div>

        {/* No Jobs State */}
        {offCampusJobs?.length === 0 && !isLoading && !error && (
          <div className="bg-white/90 backdrop-blur-sm border border-white/50 rounded-2xl shadow-lg shadow-purple-50/50 p-8 text-center">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Jobs Found</h3>
            <p className="text-gray-600 mb-6">
              We couldn't find any off-campus jobs matching your profile. Check back later or update your preferences.
            </p>
            <button
              className="bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white px-6 py-3 rounded-xl hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-200 font-medium"
              onClick={fetchOffcampusOpportunity}
            >
              Refresh Jobs
            </button>
          </div>
        )}

        {/* View All Button */}
        {offCampusJobs?.length > 0 && (
          <div className="flex justify-end">
            <button className="flex items-center px-6 py-3 bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white rounded-xl hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-200 font-medium">
              View all opportunities
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default OffCampusJobs;