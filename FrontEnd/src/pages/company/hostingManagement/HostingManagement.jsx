import { useState, useEffect } from 'react';
import { Search, Eye, ChevronLeft, ChevronRight, Trash, Calendar, MapPin, Users, Clock, Edit, Trash2, Send, Upload, X, Trophy, Briefcase, Target, Filter, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import { getCompanyHackathonsWithRegistrations, getCompanyCasestudiesWithRegistrations, getCompanyWorkshopsWithRegistrations, deleteHackathon, deleteCasestudy, deleteWorkshop, sendFileToHackathonUsers, sendFileToCasestudyUsers, sendFileToWorkshopUsers, getHackathonRegistrations, getCasestudyRegistrations, getWorkshopRegistrations } from '@/lib/Company_AxiosInstance';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import HackathonApplicantDetails from './HackathonApplicantDetails';
import CasestudyApplicantDetails from './CasestudyApplicantDetails';
import WorkshopApplicantDetails from './WorkshopApplicantDetails';

export default function HostingManagement() {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [eventType, setEventType] = useState('all'); // all, hackathon, casestudy, workshop
  const [error, setError] = useState(null);
  const [showSendFileModal, setShowSendFileModal] = useState(false);
  const [selectedEventForFile, setSelectedEventForFile] = useState(null);
  const [fileData, setFileData] = useState({ fileUrl: '', fileName: '', message: '' });
  const [uploadMethod, setUploadMethod] = useState('upload'); // 'upload' or 'url'
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [showCandidateSelection, setShowCandidateSelection] = useState(false);
  const [selectedCandidates, setSelectedCandidates] = useState([]);
  const [confirmedCandidates, setConfirmedCandidates] = useState([]);

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

      if (eventType === 'all' || eventType === 'workshop') {
        const workshopResponse = await getCompanyWorkshopsWithRegistrations();
        if (workshopResponse?.data?.success) {
          const workshops = workshopResponse.data.data.map(event => ({
            ...event,
            type: 'workshop'
          }));
          allEvents = [...allEvents, ...workshops];
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

  const handleEdit = (event) => {
    // Navigate to the appropriate edit page based on event type
    switch (event.type) {
      case 'hackathon':
        navigate(`/company/hosting/host-hackathon`, { state: { editMode: true, eventId: event._id, eventData: event } });
        break;
      case 'casestudy':
        navigate(`/company/hosting/host-case-studies`, { state: { editMode: true, eventId: event._id, eventData: event } });
        break;
      case 'workshop':
        navigate(`/company/hosting/host-workshop`, { state: { editMode: true, eventId: event._id, eventData: event } });
        break;
      default:
        toast.error('Unknown event type');
    }
  };

  const handleDelete = async (event) => {
    if (!window.confirm(`Are you sure you want to delete "${event.title}"? This action cannot be undone.`)) {
      return;
    }

    try {
      let response;
      switch (event.type) {
        case 'hackathon':
          response = await deleteHackathon(event._id);
          break;
        case 'casestudy':
          response = await deleteCasestudy(event._id);
          break;
        case 'workshop':
          response = await deleteWorkshop(event._id);
          break;
        default:
          toast.error('Unknown event type');
          return;
      }

      if (response?.data?.success) {
        toast.success(`${event.type.charAt(0).toUpperCase() + event.type.slice(1)} deleted successfully!`);
        fetchEvents(); // Refresh the list
      } else {
        toast.error(response?.data?.message || 'Failed to delete event');
      }
    } catch (error) {
      console.error('Error deleting event:', error);
      toast.error('Failed to delete event');
    }
  };

  const handleSendFile = async (event) => {
    if (event.registrationCounts?.confirmed === 0) {
      toast.error('No confirmed registrations to send file to');
      return;
    }
    setSelectedEventForFile(event);
    setShowSendFileModal(true);
    
    // Fetch confirmed candidates for this event
    try {
      let response;
      switch (event.type) {
        case 'hackathon':
          response = await getHackathonRegistrations(event._id);
          break;
        case 'casestudy':
          response = await getCasestudyRegistrations(event._id);
          break;
        case 'workshop':
          response = await getWorkshopRegistrations(event._id);
          break;
      }
      
      if (response?.data?.success) {
        const confirmed = response.data.data.filter(reg => reg.registrationStatus === 'Confirmed');
        setConfirmedCandidates(confirmed);
      }
    } catch (error) {
      console.error('Error fetching candidates:', error);
    }
  };

  const handleSendFileSubmit = async () => {
    // Validate input based on upload method
    if (uploadMethod === 'upload' && !selectedFile) {
      toast.error('Please select a file to upload');
      return;
    }
    
    if (uploadMethod === 'url' && (!fileData.fileUrl || !fileData.fileName)) {
      toast.error('Please provide file URL and file name');
      return;
    }

    // Validate candidate selection if enabled
    if (showCandidateSelection && selectedCandidates.length === 0) {
      toast.error('Please select at least one candidate');
      return;
    }

    setUploading(true);

    try {
      let response;
      const formData = new FormData();
      
      if (uploadMethod === 'upload') {
        formData.append('file', selectedFile);
      } else {
        formData.append('fileUrl', fileData.fileUrl);
        formData.append('fileName', fileData.fileName);
      }
      
      formData.append('message', fileData.message);
      
      // Add selected candidates if any
      if (showCandidateSelection && selectedCandidates.length > 0) {
        // Append each candidate ID separately for proper array handling
        selectedCandidates.forEach(id => {
          formData.append('selectedCandidates[]', id);
        });
      }

      switch (selectedEventForFile.type) {
        case 'hackathon':
          response = await sendFileToHackathonUsers(selectedEventForFile._id, formData);
          break;
        case 'casestudy':
          response = await sendFileToCasestudyUsers(selectedEventForFile._id, formData);
          break;
        case 'workshop':
          response = await sendFileToWorkshopUsers(selectedEventForFile._id, formData);
          break;
        default:
          toast.error('Unknown event type');
          setUploading(false);
          return;
      }

      if (response?.data?.success) {
        toast.success(response.data.message || 'File sent successfully!');
        setShowSendFileModal(false);
        setFileData({ fileUrl: '', fileName: '', message: '' });
        setSelectedFile(null);
        setSelectedEventForFile(null);
        setUploadMethod('upload');
        setShowCandidateSelection(false);
        setSelectedCandidates([]);
        setConfirmedCandidates([]);
      } else {
        toast.error(response?.data?.message || 'Failed to send file');
      }
    } catch (error) {
      console.error('Error sending file:', error);
      toast.error('Failed to send file');
    } finally {
      setUploading(false);
    }
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
      case 'hackathon': return 'from-blue-400 to-blue-600';
      case 'casestudy': return 'from-purple-400 to-[#143694]';
      case 'workshop': return 'from-green-400 to-green-600';
      default: return 'from-gray-400 to-gray-600';
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

  const getEventTypeGradient = (type) => {
    switch (type) {
      case 'hackathon': return 'bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200';
      case 'casestudy': return 'bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200';
      case 'workshop': return 'bg-gradient-to-r from-green-50 to-green-100 border-green-200';
      default: return 'bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200';
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
    } else if (selectedEvent.type === 'workshop') {
      return (
        <WorkshopApplicantDetails 
          workshop={selectedEvent} 
          onClose={handleBack} 
        />
      );
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#143694]/5 via-[#f093fb]/5 to-[#1e4ed8]/5 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white/90 backdrop-blur-sm border border-gray-100 rounded-2xl shadow-lg p-8 mb-6">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="p-3 bg-gradient-to-br from-[#143694]/20 to-[#1e4ed8]/20 rounded-xl mr-4">
                <Trophy className="h-8 w-8 text-[#143694]" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-[#143694] to-[#1e4ed8] bg-clip-text text-transparent">
                Hosting Management
              </h1>
            </div>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Manage registrations and participants for your hosted events. View, edit, and communicate with your event attendees.
            </p>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white/90 backdrop-blur-sm border border-gray-100 rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
            {/* Event Type Filter */}
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setEventType('all')}
                className={`px-5 py-2.5 rounded-xl font-medium transition-all duration-200 flex items-center gap-2 ${
                  eventType === 'all' 
                    ? 'bg-gradient-to-r from-[#143694] to-[#1e4ed8] text-white shadow-lg shadow-[#143694]/30' 
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100 hover:shadow-md'
                }`}
              >
                <Filter className="w-4 h-4" />
                All Events
              </button>
              <button
                onClick={() => setEventType('hackathon')}
                className={`px-5 py-2.5 rounded-xl font-medium transition-all duration-200 flex items-center gap-2 ${
                  eventType === 'hackathon' 
                    ? 'bg-gradient-to-r from-[#1e4ed8] to-blue-600 text-white shadow-lg shadow-[#1e4ed8]/30' 
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100 hover:shadow-md'
                }`}
              >
                💻 Hackathons
              </button>
              <button
                onClick={() => setEventType('casestudy')}
                className={`px-5 py-2.5 rounded-xl font-medium transition-all duration-200 flex items-center gap-2 ${
                  eventType === 'casestudy' 
                    ? 'bg-gradient-to-r from-purple-500 to-[#143694] text-white shadow-lg shadow-purple-500/30' 
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100 hover:shadow-md'
                }`}
              >
                📊 Case Studies
              </button>
              <button
                onClick={() => setEventType('workshop')}
                className={`px-5 py-2.5 rounded-xl font-medium transition-all duration-200 flex items-center gap-2 ${
                  eventType === 'workshop' 
                    ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg shadow-green-500/30' 
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100 hover:shadow-md'
                }`}
              >
                🛠️ Workshops
              </button>
            </div>

            {/* Search */}
            <div className="relative">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search events by title, location, or type..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#143694]/50 focus:border-transparent w-80 bg-white/80 backdrop-blur-sm"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Events List */}
        <div className="bg-white/90 backdrop-blur-sm border border-gray-100 rounded-2xl shadow-lg">
          {loading ? (
            <div className="flex flex-col justify-center items-center h-96">
              <div className="animate-spin rounded-full h-20 w-20 border-b-2 border-[#143694]"></div>
              <p className="mt-4 text-gray-600">Loading events...</p>
            </div>
          ) : error ? (
            <div className="text-center py-16 px-4">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-red-50 to-red-100 rounded-2xl mb-4">
                <AlertCircle className="w-8 h-8 text-red-500" />
              </div>
              <div className="text-red-600 text-xl font-semibold mb-2">Error loading events</div>
              <p className="text-gray-400 mb-6">{error}</p>
              <button 
                onClick={fetchEvents}
                className="px-6 py-3 bg-gradient-to-r from-[#143694] to-[#1e4ed8] text-white rounded-xl hover:shadow-lg hover:shadow-[#143694]/30 transition-all duration-200"
              >
                Retry
              </button>
            </div>
          ) : currentEvents.length === 0 ? (
            <div className="text-center py-16 px-4">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl mb-4">
                <FileText className="w-8 h-8 text-gray-500" />
              </div>
              <div className="text-gray-700 text-xl font-semibold mb-2">No events found</div>
              <p className="text-gray-400 mb-6">
                {searchQuery ? 'Try adjusting your search criteria.' : 'You haven\'t hosted any events yet.'}
              </p>
            </div>
          ) : (
            <>
              {/* Table Header */}
              <div className="grid grid-cols-12 gap-4 p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100 font-semibold text-gray-700 rounded-t-2xl">
                <div className="col-span-3 text-center">Event Details</div>
                <div className="col-span-2 text-center">Type</div>
                <div className="col-span-2 text-center">Date</div>
                <div className="col-span-3 text-center">Registrations</div>
                <div className="col-span-2 text-center">Actions</div>
              </div>

              {/* Table Body */}
              <div className="divide-y divide-gray-100">
                {currentEvents.map((event) => (
                  <div key={`${event.type}-${event._id}`} className={`grid grid-cols-12 gap-4 p-6 hover:bg-gray-50/50 transition-all duration-200 ${getEventTypeGradient(event.type)}`}>
                    {/* Event Details */}
                    <div className="col-span-3">
                      <div className="flex items-start space-x-4">
                        {event.bannerImage ? (
                          <img 
                            src={event.bannerImage} 
                            alt={event.title}
                            className="w-20 h-20 object-cover rounded-xl shadow-sm"
                          />
                        ) : (
                          <div className="w-20 h-20 bg-gradient-to-br from-gray-200 to-gray-300 rounded-xl flex items-center justify-center">
                            <Trophy className="w-8 h-8 text-gray-500" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">{event.title}</h3>
                          <p className="text-sm text-gray-600 line-clamp-2 mb-2">{event.description}</p>
                          <div className="flex items-center text-sm text-gray-500">
                            <MapPin className="w-4 h-4 mr-2" />
                            {event.location}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Type */}
                    <div className="col-span-2 flex items-center justify-center">
                      <span className={`inline-flex items-center px-4 py-2 rounded-xl text-sm font-medium bg-gradient-to-r ${getEventTypeColor(event.type)} text-white shadow-sm`}>
                        <span className="mr-2">{getEventTypeIcon(event.type)}</span>
                        {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                      </span>
                    </div>

                    {/* Date */}
                    <div className="col-span-2 flex items-center justify-center">
                      <div className="text-center">
                        <div className="flex items-center justify-center text-gray-900 mb-1">
                          <Calendar className="w-4 h-4 mr-2" />
                          {new Date(event.startDate).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </div>
                        <div className="text-sm text-gray-500">
                          to {new Date(event.endDate).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric' 
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Registrations */}
                    <div className="col-span-3 flex items-center justify-center">
                      <div className="grid grid-cols-3 gap-3">
                        <div className="text-center p-2 bg-white rounded-lg shadow-sm">
                          <div className="text-lg font-bold text-gray-900">
                            {event.registrationCounts?.total || 0}
                          </div>
                          <div className="text-xs text-gray-500">Total</div>
                        </div>
                        <div className="text-center p-2 bg-yellow-50 rounded-lg shadow-sm">
                          <div className="text-lg font-bold text-yellow-600">
                            {event.registrationCounts?.pending || 0}
                          </div>
                          <div className="text-xs text-gray-500">Pending</div>
                        </div>
                        <div className="text-center p-2 bg-green-50 rounded-lg shadow-sm">
                          <div className="text-lg font-bold text-green-600">
                            {event.registrationCounts?.confirmed || 0}
                          </div>
                          <div className="text-xs text-gray-500">Confirmed</div>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="col-span-2 flex items-center justify-center space-x-2">
                      <button
                        onClick={() => handleViewRegistrations(event)}
                        className="p-2.5 text-white bg-gradient-to-r from-[#1e4ed8] to-blue-600 rounded-xl hover:shadow-lg hover:shadow-[#1e4ed8]/30 transition-all duration-200"
                        title="View Registrations"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleSendFile(event)}
                        className="p-2.5 text-white bg-gradient-to-r from-green-500 to-green-600 rounded-xl hover:shadow-lg hover:shadow-green-500/30 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Send File to Confirmed Users"
                        disabled={event.registrationCounts?.confirmed === 0}
                      >
                        <Send className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleEdit(event)}
                        className="p-2.5 text-white bg-gradient-to-r from-gray-500 to-gray-600 rounded-xl hover:shadow-lg hover:shadow-gray-500/30 transition-all duration-200"
                        title="Edit Event"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(event)}
                        className="p-2.5 text-white bg-gradient-to-r from-red-500 to-red-600 rounded-xl hover:shadow-lg hover:shadow-red-500/30 transition-all duration-200"
                        title="Delete Event"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100 rounded-b-2xl">
                  <div className="text-sm text-gray-700">
                    Showing {startIndex + 1} to {Math.min(endIndex, filteredEvents.length)} of {filteredEvents.length} events
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="p-2.5 border border-gray-300 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white transition-all duration-200"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="px-4 py-2 text-sm font-medium bg-white border border-gray-300 rounded-xl">
                      {currentPage} of {totalPages}
                    </span>
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="p-2.5 border border-gray-300 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white transition-all duration-200"
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

      {/* Send File Modal */}
      {showSendFileModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white/95 backdrop-blur-sm border border-gray-200 rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center">
                <div className="p-2 bg-gradient-to-br from-green-50 to-green-100 rounded-xl mr-3">
                  <Send className="h-5 w-5 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Send File to Participants</h2>
              </div>
              <button
                onClick={() => {
                  setShowSendFileModal(false);
                  setFileData({ fileUrl: '', fileName: '', message: '' });
                  setSelectedFile(null);
                  setSelectedEventForFile(null);
                  setUploadMethod('upload');
                  setShowCandidateSelection(false);
                  setSelectedCandidates([]);
                  setConfirmedCandidates([]);
                }}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            {/* Event Info */}
            <div className="mb-6 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl">
              <p className="text-sm text-gray-700">
                Sending file for: <span className="font-semibold text-gray-900">{selectedEventForFile?.title}</span>
              </p>
              <p className="text-sm text-gray-500 mt-1">
                {selectedEventForFile?.registrationCounts?.confirmed || 0} confirmed registrations
              </p>
            </div>

            {/* Recipient Selection */}
            <div className="mb-6">
              <label className="flex items-center space-x-3 cursor-pointer p-3 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl">
                <input
                  type="checkbox"
                  checked={showCandidateSelection}
                  onChange={(e) => {
                    setShowCandidateSelection(e.target.checked);
                    if (!e.target.checked) {
                      setSelectedCandidates([]);
                    }
                  }}
                  className="w-5 h-5 text-blue-600 rounded-lg focus:ring-[#1e4ed8]"
                />
                <div>
                  <span className="text-sm font-medium text-gray-700">
                    Send to specific candidates
                  </span>
                  <p className="text-xs text-gray-500 mt-1">
                    {showCandidateSelection ? 
                      "Select specific recipients below" : 
                      "Will send to all confirmed users"}
                  </p>
                </div>
              </label>
            </div>

            {/* Candidate Selection List */}
            {showCandidateSelection && (
              <div className="mb-6 border border-gray-200 rounded-xl p-4 max-h-64 overflow-y-auto bg-gradient-to-r from-gray-50 to-gray-100">
                <p className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                  <Users className="w-4 h-4 mr-2" />
                  Select Recipients ({confirmedCandidates.length} available)
                </p>
                {confirmedCandidates.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-4">Loading candidates...</p>
                ) : (
                  <div className="space-y-2">
                    {confirmedCandidates.map((candidate) => (
                      <label key={candidate._id} className="flex items-center space-x-3 cursor-pointer hover:bg-white/50 p-3 rounded-lg transition-colors">
                        <input
                          type="checkbox"
                          checked={selectedCandidates.includes(candidate._id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedCandidates([...selectedCandidates, candidate._id]);
                            } else {
                              setSelectedCandidates(selectedCandidates.filter(id => id !== candidate._id));
                            }
                          }}
                          className="w-4 h-4 text-blue-600 rounded focus:ring-[#1e4ed8]"
                        />
                        <div className="flex-1">
                          <span className="text-sm font-medium text-gray-700">
                            {candidate.name}
                          </span>
                          <p className="text-xs text-gray-500">{candidate.email}</p>
                        </div>
                        <CheckCircle className={`w-4 h-4 ${selectedCandidates.includes(candidate._id) ? 'text-green-500' : 'text-gray-300'}`} />
                      </label>
                    ))}
                  </div>
                )}
              </div>
            )}
            
            {/* Upload Method Toggle */}
            <div className="mb-6 grid grid-cols-2 gap-4">
              <button
                onClick={() => setUploadMethod('upload')}
                className={`p-4 rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
                  uploadMethod === 'upload' 
                    ? 'bg-gradient-to-r from-[#1e4ed8] to-blue-600 text-white shadow-lg shadow-[#1e4ed8]/30' 
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100 hover:shadow-md'
                }`}
              >
                <Upload className="w-5 h-5" />
                Upload File
              </button>
              <button
                onClick={() => setUploadMethod('url')}
                className={`p-4 rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
                  uploadMethod === 'url' 
                    ? 'bg-gradient-to-r from-purple-500 to-[#143694] text-white shadow-lg shadow-purple-500/30' 
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100 hover:shadow-md'
                }`}
              >
                <FileText className="w-5 h-5" />
                File URL
              </button>
            </div>
            
            <div className="space-y-6">
              {uploadMethod === 'upload' ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Select File <span className="text-red-500">*</span>
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-[#1e4ed8] transition-colors">
                    <input
                      type="file"
                      onChange={(e) => setSelectedFile(e.target.files[0])}
                      className="hidden"
                      id="file-upload"
                      accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt,.zip,.jpg,.jpeg,.png"
                    />
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 mb-2">Click to upload or drag and drop</p>
                      <p className="text-sm text-gray-500">PDF, DOC, PPT, XLS, ZIP, JPG, PNG (Max 10MB)</p>
                    </label>
                  </div>
                  {selectedFile && (
                    <div className="mt-4 p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-xl">
                      <div className="flex items-center">
                        <FileText className="w-5 h-5 text-green-600 mr-3" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-green-700">
                            📎 Selected: {selectedFile.name}
                          </p>
                          <p className="text-xs text-green-600">
                            {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                        <button
                          onClick={() => setSelectedFile(null)}
                          className="p-1 text-red-500 hover:bg-red-50 rounded-lg"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      File URL <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="url"
                      value={fileData.fileUrl}
                      onChange={(e) => setFileData({ ...fileData, fileUrl: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#143694]/50 focus:border-transparent transition-all duration-200"
                      placeholder="https://example.com/file.pdf"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      File Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={fileData.fileName}
                      onChange={(e) => setFileData({ ...fileData, fileName: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#143694]/50 focus:border-transparent transition-all duration-200"
                      placeholder="Event Schedule.pdf"
                    />
                  </div>
                </>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Message (Optional)
                </label>
                <textarea
                  value={fileData.message}
                  onChange={(e) => setFileData({ ...fileData, message: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#143694]/50 focus:border-transparent transition-all duration-200"
                  placeholder="Add a personal message to include with the file..."
                />
              </div>
            </div>

            <div className="flex justify-end space-x-4 mt-8 pt-6 border-t border-gray-200">
              <button
                onClick={() => {
                  setShowSendFileModal(false);
                  setFileData({ fileUrl: '', fileName: '', message: '' });
                  setSelectedFile(null);
                  setSelectedEventForFile(null);
                  setUploadMethod('upload');
                  setShowCandidateSelection(false);
                  setSelectedCandidates([]);
                  setConfirmedCandidates([]);
                }}
                className="px-6 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-all duration-200"
                disabled={uploading}
              >
                Cancel
              </button>
              <button
                onClick={handleSendFileSubmit}
                disabled={uploading}
                className="px-6 py-3 bg-gradient-to-r from-[#143694] to-[#1e4ed8] text-white rounded-xl hover:shadow-lg hover:shadow-[#143694]/30 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                {uploading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    {uploadMethod === 'upload' ? 'Uploading...' : 'Sending...'}
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Send File
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}