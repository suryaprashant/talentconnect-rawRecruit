import { useState, useEffect } from 'react';
import { Search, Eye, ChevronLeft, ChevronRight, Trash, Calendar, MapPin, Users, Clock } from 'lucide-react';
import { getCompanyHackathonsWithRegistrations, getCompanyCasestudiesWithRegistrations } from '@/lib/Company_AxiosInstance';
import toast from 'react-hot-toast';
import HackathonApplicantDetails from './HackathonApplicantDetails';
import CasestudyApplicantDetails from './CasestudyApplicantDetails';

export default function HostingManagement() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [eventType, setEventType] = useState('all'); // all, hackathon, casestudy, workshop
  const [error, setError] = useState(null);

  const itemsPerPage = 10;

  const fetchEvents = async () => {
    setLoading(true);
    setError(null);
    try {
      let allEvents = [];

      if (eventType === 'all' || eventType === 'hackathon') {
        const hackathonResponse = await getCompanyHackathonsWithRegistrations();
        if (hackathonResponse?.data?.success) {
          const hackathons = hackathonResponse.data.data.map(event => ({
            ...event,
            type: 'hackathon'
          }));
          allEvents = [...allEvents, ...hackathons];
        }
      }

      if (eventType === 'all' || eventType === 'casestudy') {
        const casestudyResponse = await getCompanyCasestudiesWithRegistrations();
        if (casestudyResponse?.data?.success) {
          const casestudies = casestudyResponse.data.data.map(event => ({
            ...event,
            type: 'casestudy'
          }));
          allEvents = [...allEvents, ...casestudies];
        }
      }

      // Sort by creation date (newest first)
      allEvents.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setEvents(allEvents);
    } catch (err) {
      console.error("Error fetching events:", err);
      setError(err.response?.data?.message || err.message || "Failed to fetch events.");
      setEvents([]);
      toast.error('Failed to fetch events');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [eventType]);

  const handleViewRegistrations = (event) => {
    setSelectedEvent(event);
  };

  const handleBack = () => {
    setSelectedEvent(null);
    fetchEvents(); // Refresh data when coming back
  };

  // Filter events based on search query
  const filteredEvents = events.filter(event =>
    event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination
  const totalPages = Math.ceil(filteredEvents.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentEvents = filteredEvents.slice(startIndex, endIndex);

  const getEventTypeColor = (type) => {
    switch (type) {
      case 'hackathon': return 'bg-blue-100 text-blue-800';
      case 'casestudy': return 'bg-purple-100 text-purple-800';
      case 'workshop': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getEventTypeIcon = (type) => {
    switch (type) {
      case 'hackathon': return '💻';
      case 'casestudy': return '📊';
      case 'workshop': return '🛠️';
      default: return '📅';
    }
  };

  if (selectedEvent) {
    if (selectedEvent.type === 'hackathon') {
      return (
        <HackathonApplicantDetails 
          hackathon={selectedEvent} 
          onClose={handleBack} 
        />
      );
    } else if (selectedEvent.type === 'casestudy') {
      return (
        <CasestudyApplicantDetails 
          casestudy={selectedEvent} 
          onClose={handleBack} 
        />
      );
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Hosting Management</h1>
          <p className="text-gray-600">Manage registrations for your hosted events</p>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Event Type Filter */}
            <div className="flex gap-2">
              <button
                onClick={() => setEventType('all')}
                className={`px-4 py-2 rounded-md font-medium transition-colors ${
                  eventType === 'all' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All Events
              </button>
              <button
                onClick={() => setEventType('hackathon')}
                className={`px-4 py-2 rounded-md font-medium transition-colors ${
                  eventType === 'hackathon' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                💻 Hackathons
              </button>
              <button
                onClick={() => setEventType('casestudy')}
                className={`px-4 py-2 rounded-md font-medium transition-colors ${
                  eventType === 'casestudy' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                📊 Case Studies
              </button>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent w-80"
              />
            </div>
          </div>
        </div>

        {/* Events List */}
        <div className="bg-white rounded-lg shadow-sm">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <div className="text-red-500 text-lg mb-2">Error loading events</div>
              <p className="text-gray-400">{error}</p>
              <button 
                onClick={fetchEvents}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Retry
              </button>
            </div>
          ) : currentEvents.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-500 text-lg">No events found</div>
              <p className="text-gray-400 mt-2">
                {searchQuery ? 'Try adjusting your search criteria.' : 'You haven\'t hosted any events yet.'}
              </p>
            </div>
          ) : (
            <>
              {/* Table Header */}
              <div className="grid grid-cols-12 gap-4 p-6 border-b border-gray-200 bg-gray-50 font-semibold text-gray-700">
                <div className="col-span-3">Event Details</div>
                <div className="col-span-2">Type</div>
                <div className="col-span-2">Date</div>
                <div className="col-span-3">Registrations</div>
                <div className="col-span-2">Actions</div>
              </div>

              {/* Table Body */}
              <div className="divide-y divide-gray-200">
                {currentEvents.map((event) => (
                  <div key={`${event.type}-${event._id}`} className="grid grid-cols-12 gap-4 p-6 hover:bg-gray-50 transition-colors">
                    {/* Event Details */}
                    <div className="col-span-3">
                      <div className="flex items-start space-x-3">
                        {event.bannerImage && (
                          <img 
                            src={event.bannerImage} 
                            alt={event.title}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-semibold text-gray-900 truncate">{event.title}</h3>
                          <p className="text-sm text-gray-600 line-clamp-2">{event.description}</p>
                          <div className="flex items-center text-sm text-gray-500 mt-1">
                            <MapPin className="w-4 h-4 mr-1" />
                            {event.location}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Type */}
                    <div className="col-span-2 flex items-center">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getEventTypeColor(event.type)}`}>
                        <span className="mr-1">{getEventTypeIcon(event.type)}</span>
                        {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                      </span>
                    </div>

                    {/* Date */}
                    <div className="col-span-2 flex items-center">
                      <div className="text-sm">
                        <div className="flex items-center text-gray-900">
                          <Calendar className="w-4 h-4 mr-1" />
                          {new Date(event.startDate).toLocaleDateString()}
                        </div>
                        <div className="text-gray-500">
                          to {new Date(event.endDate).toLocaleDateString()}
                        </div>
                      </div>
                    </div>

                    {/* Registrations */}
                    <div className="col-span-3 flex items-center">
                      <div className="text-sm">
                        <div className="flex items-center space-x-4">
                          <div className="text-center">
                            <div className="text-lg font-bold text-gray-900">
                              {event.registrationCounts?.total || 0}
                            </div>
                            <div className="text-xs text-gray-500">Total</div>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-bold text-yellow-600">
                              {event.registrationCounts?.pending || 0}
                            </div>
                            <div className="text-xs text-gray-500">Pending</div>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-bold text-green-600">
                              {event.registrationCounts?.confirmed || 0}
                            </div>
                            <div className="text-xs text-gray-500">Confirmed</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="col-span-2 flex items-center space-x-2">
                      <button
                        onClick={() => handleViewRegistrations(event)}
                        // className="inline-flex items-center px-3 py-2  rounded-md text-sm font-medium text-gray-700 bg-transparent hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
                  <div className="text-sm text-gray-700">
                    Showing {startIndex + 1} to {Math.min(endIndex, filteredEvents.length)} of {filteredEvents.length} events
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="p-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="px-3 py-1 text-sm font-medium">
                      {currentPage} of {totalPages}
                    </span>
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="p-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
