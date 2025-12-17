import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import JobCard from '@/components/student/studentDashboard/offCampusListing/JobCard';
import { getRelaventOffcampusOpportunity } from '@/lib/User_AxiosInstance';
import { FiSearch, FiChevronDown } from 'react-icons/fi';

function FOffCampusListings() {
  const [offCampusJobs, setOffCampusJobs] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleJobClick = (jobId) => {
    navigate(`/fresher-dashboard/Off-campus/${jobId}`);
  };

  const fetchOffcampusOpportunity = async () => {
    try {
      setIsLoading(true);
      const response = await getRelaventOffcampusOpportunity();
      setOffCampusJobs(response.data.data);
      console.log("res..", response.data.data);
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
      <div className="min-h-screen bg-gradient-to-br from-[#667eea]/10 via-[#f093fb]/5 to-[#764ba2]/10 flex justify-center items-center">
        {/* Pastel blur background elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#667eea]/10 rounded-full blur-3xl"></div>
          <div className="absolute top-1/3 -left-20 w-60 h-60 bg-[#f093fb]/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-1/3 w-40 h-40 bg-[#764ba2]/10 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative z-10">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#667eea]"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading opportunities...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#667eea]/10 via-[#f093fb]/5 to-[#764ba2]/10 flex justify-center items-center">
        {/* Pastel blur background elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#667eea]/10 rounded-full blur-3xl"></div>
          <div className="absolute top-1/3 -left-20 w-60 h-60 bg-[#f093fb]/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-1/3 w-40 h-40 bg-[#764ba2]/10 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative z-10 bg-white/90 backdrop-blur-sm border border-white/50 rounded-2xl shadow-lg shadow-purple-50/50 p-8 max-w-md">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Something went wrong</h3>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              className="bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-200 px-6 py-3 rounded-xl font-medium"
              onClick={() => fetchOffcampusOpportunity()}
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

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="bg-white/90 backdrop-blur-sm border border-white/50 rounded-2xl shadow-lg shadow-purple-50/50 p-6 mb-8">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent mb-2">
            Off-Campus Jobs based on your preferences
          </h1>
          <p className="text-gray-600">Discover opportunities that match your skills and career goals</p>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white/90 backdrop-blur-sm border border-white/50 rounded-2xl shadow-lg shadow-purple-50/50 p-6 mb-8">
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                <FiSearch className="w-4 h-4 text-gray-400" />
              </div>
              <input
                type="search"
                className="block w-full p-3 pl-12 text-sm border border-gray-200 rounded-xl bg-white/50 focus:outline-none focus:ring-2 focus:ring-[#667eea]/30 focus:border-[#667eea] transition-all duration-200"
                placeholder="Search by job title, company, or skills..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="relative">
              <select
                className="block w-full p-3 pl-4 pr-10 text-sm border border-gray-200 rounded-xl bg-white/50 focus:outline-none focus:ring-2 focus:ring-[#667eea]/30 focus:border-[#667eea] appearance-none transition-all duration-200"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="" className="text-gray-500">Sort by</option>
                <option value="recent" className="text-gray-700">Most Recent</option>
                <option value="salary" className="text-gray-700">Highest Salary</option>
                <option value="company" className="text-gray-700">Company Name</option>
                <option value="deadline" className="text-gray-700">Application Deadline</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <FiChevronDown className="w-4 h-4 text-gray-400" />
              </div>
            </div>
          </div>
          
          {/* Stats Section */}
          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-gradient-to-r from-[#a5b4fc]/10 to-[#c4b5fd]/10 border border-[#a5b4fc]/20 rounded-xl">
              <p className="text-sm text-gray-600">Total Opportunities</p>
              <p className="text-2xl font-bold bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent">
                {offCampusJobs?.length || 0}
              </p>
            </div>
            <div className="p-4 bg-gradient-to-r from-[#bbf7d0]/10 to-[#86efac]/10 border border-[#bbf7d0]/20 rounded-xl">
              <p className="text-sm text-gray-600">Active Applications</p>
              <p className="text-2xl font-bold bg-gradient-to-r from-[#059669] to-[#10b981] bg-clip-text text-transparent">
                0
              </p>
            </div>
            <div className="p-4 bg-gradient-to-r from-[#fde68a]/10 to-[#fcd34d]/10 border border-[#fde68a]/20 rounded-xl">
              <p className="text-sm text-gray-600">Shortlisted</p>
              <p className="text-2xl font-bold bg-gradient-to-r from-[#d97706] to-[#f59e0b] bg-clip-text text-transparent">
                0
              </p>
            </div>
            <div className="p-4 bg-gradient-to-r from-[#fbcfe8]/10 to-[#f9a8d4]/10 border border-[#fbcfe8]/20 rounded-xl">
              <p className="text-sm text-gray-600">Interviews</p>
              <p className="text-2xl font-bold bg-gradient-to-r from-[#be185d] to-[#ec4899] bg-clip-text text-transparent">
                0
              </p>
            </div>
          </div>
        </div>

        {/* Jobs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {offCampusJobs?.map(job => (
            <div 
              key={job._id} 
              className="bg-white/90 backdrop-blur-sm border border-white/50 rounded-2xl shadow-lg shadow-purple-50/50 hover:shadow-xl hover:shadow-purple-100/30 transition-all duration-300 transform hover:-translate-y-1 overflow-hidden"
            >
              <JobCard job={job} onClick={handleJobClick} />
            </div>
          ))}
        </div>

        {/* No Results Message */}
        {(!offCampusJobs || offCampusJobs.length === 0) && !isLoading && (
          <div className="text-center py-12">
            <div className="bg-white/90 backdrop-blur-sm border border-white/50 rounded-2xl shadow-lg shadow-purple-50/50 p-8 max-w-md mx-auto">
              <div className="w-16 h-16 bg-gradient-to-r from-[#a5b4fc]/20 to-[#c4b5fd]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-[#667eea]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Opportunities Found</h3>
              <p className="text-gray-600 mb-6">We couldn't find any jobs matching your preferences. Try adjusting your search criteria.</p>
              <button
                className="bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-200 px-6 py-3 rounded-xl font-medium"
                onClick={() => {
                  setSearchQuery('');
                  setSortBy('');
                }}
              >
                Clear Filters
              </button>
            </div>
          </div>
        )}

        {/* View All Button */}
        {offCampusJobs && offCampusJobs.length > 0 && (
          <div className="flex justify-end mt-8">
            <button className="bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-200 px-6 py-3 rounded-xl font-medium">
              View All Opportunities
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default FOffCampusListings;