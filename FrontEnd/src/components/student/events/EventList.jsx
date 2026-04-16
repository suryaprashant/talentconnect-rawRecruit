import React, { useState, useEffect } from 'react';
import EventCard from './EventCard';
import SearchBar from './SearchBar';
import { getWorkShops, getCaseStudy, getHackathons } from '@/lib/User_AxiosInstance';
import { FiCalendar, FiTrendingUp, FiAward, FiSearch, FiFilter } from 'react-icons/fi';

const EventList = ({ event_name }) => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadEvents = async () => {
    try {
      setIsLoading(true);
      let response;
      switch (event_name) {
        case 'hackathon':
          response = await getHackathons();
          break;
        case 'workshop':
          response = await getWorkShops();
          break;
        case 'casestudy':
          response = await getCaseStudy();
          break;
        default:
          response = await getHackathons();
          break;
      }

      if (response.data && response.data.data) {
        setEvents(response.data.data);
        setFilteredEvents(response.data.data);
        setError(null);
      } else {
        console.log("No events data found in response");
        setEvents([]);
        setFilteredEvents([]);
      }
    } catch (error) {
      console.log("Error fetching events: ", error);
      setError('Failed to load events. Please try again later.');
      setEvents([]);
      setFilteredEvents([]);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadEvents();
  }, [event_name]);

  useEffect(() => {
    if (!events || events.length === 0) return;

    let filtered = events.filter(event =>
      event.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.organizer?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (activeFilter === 'upcoming') {
      const now = new Date();
      filtered = filtered.filter(event => new Date(event.startDate) > now);
    } else if (activeFilter === 'ongoing') {
      const now = new Date();
      filtered = filtered.filter(event => 
        new Date(event.startDate) <= now && new Date(event.endDate) >= now
      );
    }

    if (sortBy === 'date') {
      filtered.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
    } else if (sortBy === 'popularity') {
      filtered.sort((a, b) => (b.registeredUsers || 0) - (a.registeredUsers || 0));
    } else if (sortBy === 'prize') {
      const getPrizeTotal = (event) => {
        return (event.rewardsAndBenefits || []).reduce((sum, reward) => sum + (reward.amount || 0), 0);
      };
      filtered.sort((a, b) => getPrizeTotal(b) - getPrizeTotal(a));
    }

    setFilteredEvents(filtered);
  }, [searchTerm, sortBy, activeFilter, events]);

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleSort = (option) => {
    setSortBy(option);
  };

  const filterButtons = [
    { id: 'all', label: 'All Events', icon: <FiCalendar className="w-4 h-4 mr-2" /> },
    { id: 'upcoming', label: 'Upcoming', icon: <FiTrendingUp className="w-4 h-4 mr-2" /> },
    { id: 'ongoing', label: 'Ongoing', icon: <FiAward className="w-4 h-4 mr-2" /> },
  ];

  const getEventStats = () => {
    const now = new Date();
    const upcomingCount = events.filter(e => new Date(e.startDate) > now).length;
    const ongoingCount = events.filter(e => 
      new Date(e.startDate) <= now && new Date(e.endDate) >= now
    ).length;
    const totalPrize = events.reduce((sum, event) => {
      return sum + (event.rewardsAndBenefits || []).reduce((s, r) => s + (r.amount || 0), 0);
    }, 0);

    return { upcomingCount, ongoingCount, totalPrize };
  };

  const stats = getEventStats();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#143694]/10 via-[#f093fb]/5 to-[#1e4ed8]/10">
        {/* Pastel blur background elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#143694]/10 rounded-full blur-3xl"></div>
          <div className="absolute top-1/3 -left-20 w-60 h-60 bg-[#f093fb]/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-1/3 w-40 h-40 bg-[#1e4ed8]/10 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative z-10 flex justify-center items-center h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#143694] mx-auto mb-4"></div>
            <p className="text-gray-600 font-medium">Loading {event_name} events...</p>
            <p className="text-sm text-gray-500 mt-2">Discovering exciting opportunities for you</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#143694]/10 via-[#f093fb]/5 to-[#1e4ed8]/10">
        {/* Pastel blur background elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#143694]/10 rounded-full blur-3xl"></div>
          <div className="absolute top-1/3 -left-20 w-60 h-60 bg-[#f093fb]/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-1/3 w-40 h-40 bg-[#1e4ed8]/10 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative z-10 flex justify-center items-center h-screen">
          <div className="bg-white/90 backdrop-blur-sm border border-white/50 rounded-2xl shadow-lg shadow-purple-50/50 p-8 text-center max-w-md mx-4">
            <div className="text-red-500 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Unable to Load Events</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              className="bg-gradient-to-r from-[#143694] to-[#1e4ed8] text-white px-6 py-3 rounded-xl hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-200 font-medium"
              onClick={loadEvents}
            >
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

      <div className="relative z-10 p-4 md:p-6">
        {/* Header Section */}
        <div className="bg-white/90 backdrop-blur-sm border border-white/50 rounded-2xl shadow-lg shadow-purple-50/50 p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-[#143694] to-[#1e4ed8] bg-clip-text text-transparent mb-2 capitalize">
                {event_name.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
              </h1>
              <p className="text-gray-600">
                Discover upcoming {event_name} and innovation challenges to showcase your skills.
              </p>
            </div>
            
            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="flex flex-col">
                <span className="text-xs text-gray-500 mb-1">Total Events</span>
                <span className="px-3 py-2 text-sm font-medium bg-gradient-to-r from-[#a5b4fc]/20 to-[#c4b5fd]/20 text-[#5b21b6] border border-[#a5b4fc]/30 rounded-xl">
                  {events.length}
                </span>
              </div>
              
              <div className="flex flex-col">
                <span className="text-xs text-gray-500 mb-1">Upcoming</span>
                <span className="px-3 py-2 text-sm font-medium bg-gradient-to-r from-[#bbf7d0]/20 to-[#86efac]/20 text-[#065f46] border border-[#bbf7d0]/30 rounded-xl">
                  {stats.upcomingCount}
                </span>
              </div>
              
              <div className="flex flex-col">
                <span className="text-xs text-gray-500 mb-1">Ongoing</span>
                <span className="px-3 py-2 text-sm font-medium bg-gradient-to-r from-[#fde68a]/20 to-[#fcd34d]/20 text-[#92400e] border border-[#fde68a]/30 rounded-xl">
                  {stats.ongoingCount}
                </span>
              </div>
              
              <div className="flex flex-col">
                <span className="text-xs text-gray-500 mb-1">Total Prize</span>
                <span className="px-3 py-2 text-sm font-medium bg-gradient-to-r from-[#fbcfe8]/20 to-[#f9a8d4]/20 text-[#9d174d] border border-[#fbcfe8]/30 rounded-xl">
                  ${stats.totalPrize.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Filter Buttons */}
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-3">
              <FiFilter className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Filter by status:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {filterButtons.map((filter) => (
                <button
                  key={filter.id}
                  className={`flex items-center px-4 py-2 text-sm font-medium rounded-xl transition-all duration-200 ${
                    activeFilter === filter.id
                      ? 'bg-gradient-to-r from-[#143694] to-[#1e4ed8] text-white shadow-lg shadow-purple-500/30'
                      : 'bg-white/50 backdrop-blur-sm border border-gray-200 text-gray-700 hover:bg-gray-50'
                  }`}
                  onClick={() => setActiveFilter(filter.id)}
                >
                  {filter.icon}
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          {/* Search and Sort */}
          <div className="mt-6">
            <SearchBar onSearch={handleSearch} onSort={handleSort} />
          </div>
        </div>

        {/* Events Grid */}
        <div className="mb-6">
          {filteredEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map(event => (
                <div key={event._id} className="transform transition-all duration-200 hover:scale-[1.02] hover:shadow-xl">
                  <EventCard key={event._id} event={event} event_name={event_name} />
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white/90 backdrop-blur-sm border border-white/50 rounded-2xl shadow-lg shadow-purple-50/50 p-8 text-center">
              <div className="text-gray-400 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  {event_name === 'hackathon' ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  ) : event_name === 'workshop' ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  )}
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No {event_name} events found
              </h3>
              <p className="text-gray-600 mb-6">
                {searchTerm 
                  ? `No events match "${searchTerm}"` 
                  : `There are currently no ${event_name} events available. Check back soon!`}
              </p>
              <div className="flex gap-3 justify-center">
                <button
                  className="px-4 py-2 text-sm font-medium bg-white/70 backdrop-blur-sm border border-gray-200 rounded-xl text-gray-700 hover:bg-white/90 hover:shadow-md transition-all duration-200"
                  onClick={() => {
                    setSearchTerm('');
                    setActiveFilter('all');
                  }}
                >
                  Clear Filters
                </button>
                <button
                  className="px-4 py-2 text-sm font-medium bg-gradient-to-r from-[#143694] to-[#1e4ed8] text-white rounded-xl hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-200"
                  onClick={loadEvents}
                >
                  Refresh Events
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Action Section */}
        {filteredEvents.length > 0 && (
          <div className="bg-white/90 backdrop-blur-sm border border-white/50 rounded-2xl shadow-lg shadow-purple-50/50 p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  Want to stay updated?
                </h3>
                <p className="text-gray-600 text-sm">
                  Subscribe to get notifications about upcoming events and opportunities.
                </p>
              </div>
              <div className="flex gap-3">
                <button className="px-4 py-2 text-sm font-medium bg-white/70 backdrop-blur-sm border border-gray-200 rounded-xl text-gray-700 hover:bg-white/90 hover:shadow-md transition-all duration-200">
                  Subscribe
                </button>
                <button className="px-4 py-2 text-sm font-medium bg-gradient-to-r from-[#143694] to-[#1e4ed8] text-white rounded-xl hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-200">
                  View All Events
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventList;