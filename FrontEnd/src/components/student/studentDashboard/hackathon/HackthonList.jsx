import React, { useState, useEffect } from 'react';
import HackathonCard from './HackathonCard';
import SearchBar from './SearchBar';
import { getHackathons } from '@/lib/User_AxiosInstance';
import { FiSearch, FiFilter, FiCalendar, FiUsers, FiAward, FiLoader } from 'react-icons/fi';

const HackathonList = () => {
  const [hackathons, setHackathons] = useState([]);
  const [filteredHackathons, setFilteredHackathons] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadHackathons = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await getHackathons();
      const hackathonData = response.data.data || [];
      setHackathons(hackathonData);
      setFilteredHackathons(hackathonData);
    } catch (error) {
      console.log("Error: ", error);
      setError('Failed to load hackathons. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadHackathons();
  }, []);

  useEffect(() => {
    let filtered = [...hackathons];

    // Filter hackathons based on search term
    if (searchTerm) {
      filtered = filtered.filter(hackathon =>
        hackathon.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        hackathon.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        hackathon.organizer?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort hackathons based on sort option
    if (sortBy === 'date') {
      filtered = filtered.sort((a, b) => new Date(a.startDate || a.date) - new Date(b.startDate || b.date));
    } else if (sortBy === 'popularity') {
      filtered = filtered.sort((a, b) => (b.participants || 0) - (a.participants || 0));
    } else if (sortBy === 'prize') {
      filtered = filtered.sort((a, b) => {
        const prizeA = a.prizePool || a.prizes?.[0]?.value || 0;
        const prizeB = b.prizePool || b.prizes?.[0]?.value || 0;
        return prizeB - prizeA;
      });
    }

    setFilteredHackathons(filtered);
  }, [searchTerm, sortBy, hackathons]);

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleSort = (option) => {
    setSortBy(option);
  };

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
            Loading hackathons...
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
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Hackathons</h3>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              className="inline-flex items-center bg-gradient-to-r from-[#143694] to-[#1e4ed8] text-white hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-200 px-6 py-3 rounded-xl font-medium"
              onClick={() => loadHackathons()}
            >
              <FiLoader className="w-4 h-4 mr-2" />
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  const totalParticipants = hackathons.reduce((sum, hack) => sum + (hack.participants || 0), 0);
  const totalPrizePool = hackathons.reduce((sum, hack) => sum + (hack.prizePool || 0), 0);
  const upcomingHackathons = hackathons.filter(h => new Date(h.startDate || h.date) > new Date()).length;

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
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-[#143694] to-[#1e4ed8] bg-clip-text text-transparent mb-2">
                Hackathons & Innovation Challenges
              </h1>
              <p className="text-gray-600">
                Join exciting coding competitions and showcase your skills
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-2 bg-gradient-to-r from-[#a5b4fc]/20 to-[#c4b5fd]/20 p-3 rounded-xl">
                <FiCalendar className="w-5 h-5 text-[#143694]" />
                <div>
                  <p className="text-sm text-gray-600">Total Events</p>
                  <p className="text-xl font-bold bg-gradient-to-r from-[#143694] to-[#1e4ed8] bg-clip-text text-transparent">
                    {hackathons.length}
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="p-4 bg-gradient-to-r from-[#a5b4fc]/10 to-[#c4b5fd]/10 border border-[#a5b4fc]/20 rounded-xl">
              <div className="flex items-center space-x-2">
                <FiUsers className="w-5 h-5 text-[#143694]" />
                <div>
                  <p className="text-sm text-gray-600">Total Participants</p>
                  <p className="text-2xl font-bold bg-gradient-to-r from-[#143694] to-[#1e4ed8] bg-clip-text text-transparent">
                    {totalParticipants.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
            <div className="p-4 bg-gradient-to-r from-[#bbf7d0]/10 to-[#86efac]/10 border border-[#bbf7d0]/20 rounded-xl">
              <div className="flex items-center space-x-2">
                <FiAward className="w-5 h-5 text-[#059669]" />
                <div>
                  <p className="text-sm text-gray-600">Total Prize Pool</p>
                  <p className="text-2xl font-bold bg-gradient-to-r from-[#059669] to-[#10b981] bg-clip-text text-transparent">
                    ${totalPrizePool.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
            <div className="p-4 bg-gradient-to-r from-[#fde68a]/10 to-[#fcd34d]/10 border border-[#fde68a]/20 rounded-xl">
              <div className="flex items-center space-x-2">
                <FiCalendar className="w-5 h-5 text-[#d97706]" />
                <div>
                  <p className="text-sm text-gray-600">Upcoming</p>
                  <p className="text-2xl font-bold bg-gradient-to-r from-[#d97706] to-[#f59e0b] bg-clip-text text-transparent">
                    {upcomingHackathons}
                  </p>
                </div>
              </div>
            </div>
            <div className="p-4 bg-gradient-to-r from-[#fbcfe8]/10 to-[#f9a8d4]/10 border border-[#fbcfe8]/20 rounded-xl">
              <div className="flex items-center space-x-2">
                <FiFilter className="w-5 h-5 text-[#be185d]" />
                <div>
                  <p className="text-sm text-gray-600">Active</p>
                  <p className="text-2xl font-bold bg-gradient-to-r from-[#be185d] to-[#ec4899] bg-clip-text text-transparent">
                    {hackathons.filter(h => h.status === 'active').length}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="bg-gradient-to-r from-[#a5b4fc]/5 to-[#c4b5fd]/5 p-4 rounded-xl border border-[#a5b4fc]/10">
            <SearchBar onSearch={handleSearch} onSort={handleSort} />
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="text-sm text-gray-500">Quick filters:</span>
              <button
                onClick={() => handleSort('date')}
                className={`px-3 py-1 text-sm rounded-full transition-all duration-200 ${sortBy === 'date' ? 'bg-[#143694] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                Recent
              </button>
              <button
                onClick={() => handleSort('popularity')}
                className={`px-3 py-1 text-sm rounded-full transition-all duration-200 ${sortBy === 'popularity' ? 'bg-[#143694] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                Popular
              </button>
              <button
                onClick={() => handleSort('prize')}
                className={`px-3 py-1 text-sm rounded-full transition-all duration-200 ${sortBy === 'prize' ? 'bg-[#143694] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                High Prize
              </button>
              <button
                onClick={() => setSearchTerm('')}
                className="px-3 py-1 text-sm rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all duration-200"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Hackathons Grid */}
        <div className="bg-white/90 backdrop-blur-sm border border-white/50 rounded-2xl shadow-lg shadow-purple-50/50 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Available Hackathons</h2>
              <p className="text-gray-600 text-sm">
                Showing {filteredHackathons.length} of {hackathons.length} hackathons
              </p>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <FiSearch className="w-4 h-4" />
              <span>{searchTerm ? `Search: "${searchTerm}"` : 'No search filter'}</span>
            </div>
          </div>

          {filteredHackathons.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredHackathons.map(hackathon => (
                <div key={hackathon._id} className="bg-gradient-to-br from-white/50 to-white/30 backdrop-blur-sm border border-white/50 rounded-xl shadow-lg hover:shadow-xl hover:shadow-purple-100/30 transition-all duration-300 transform hover:-translate-y-1">
                  <HackathonCard hackathon={hackathon} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="max-w-md mx-auto">
                <div className="w-20 h-20 bg-gradient-to-r from-[#a5b4fc]/20 to-[#c4b5fd]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiSearch className="w-10 h-10 text-[#143694]" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Hackathons Found</h3>
                <p className="text-gray-600 mb-6">
                  {searchTerm 
                    ? `No hackathons match your search for "${searchTerm}". Try different keywords.`
                    : 'No hackathons are currently available. Check back soon!'}
                </p>
                {searchTerm && (
                  <button
                    className="bg-gradient-to-r from-[#143694] to-[#1e4ed8] text-white hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-200 px-6 py-3 rounded-xl font-medium"
                    onClick={() => setSearchTerm('')}
                  >
                    Clear Search
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Tips Section */}
          {filteredHackathons.length > 0 && (
            <div className="mt-8 p-6 bg-gradient-to-r from-[#fef3c7]/10 to-[#fde68a]/10 border border-[#fde68a]/20 rounded-xl">
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                <svg className="w-5 h-5 text-[#d97706] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                Hackathon Tips
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-white/50 rounded-lg">
                  <p className="text-sm font-medium text-gray-600 mb-1">Form a Strong Team</p>
                  <p className="text-sm text-gray-700">Combine diverse skills - coding, design, and presentation</p>
                </div>
                <div className="p-4 bg-white/50 rounded-lg">
                  <p className="text-sm font-medium text-gray-600 mb-1">Plan Before Coding</p>
                  <p className="text-sm text-gray-700">Spend time planning your solution and architecture</p>
                </div>
                <div className="p-4 bg-white/50 rounded-lg">
                  <p className="text-sm font-medium text-gray-600 mb-1">Focus on Presentation</p>
                  <p className="text-sm text-gray-700">A great demo can win even with simpler code</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HackathonList;