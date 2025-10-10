import { useState, useEffect } from 'react';
import { Search, Eye, ChevronLeft, ChevronRight, Trash, Calendar, MapPin, Users, Clock, Edit, Trash2, Send, Upload, X } from 'lucide-react';
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
              <button
                onClick={() => setEventType('workshop')}
                className={`px-4 py-2 rounded-md font-medium transition-colors ${
                  eventType === 'workshop' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                🛠️ Workshops
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
                <div className="col-span-3 text-center">Event Details</div>
                <div className="col-span-2 text-center">Type</div>
                <div className="col-span-2 text-center">Date</div>
                <div className="col-span-3 text-center">Registrations</div>
                <div className="col-span-2 text-center">Actions</div>
              </div>

              {/* Table Body */}
              <div className="divide-y divide-gray-200">
                {currentEvents.map((event) => (
                  <div key={`${event.type}-${event._id}`} className="grid grid-cols-12 gap-4 p-6 hover:bg-gray-50 transition-colors">
                    {/* Event Details */}
                    <div className="col-span-3 text-center">
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
                    <div className="col-span-2 flex items-center justify-center">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getEventTypeColor(event.type)}`}>
                        <span className="mr-1">{getEventTypeIcon(event.type)}</span>
                        {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                      </span>
                    </div>

                    {/* Date */}
                    <div className="col-span-2 flex items-center justify-center">
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
                    <div className="col-span-3 flex items-center justify-center">
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
                    <div className="col-span-2 flex items-center space-x-1 justify-center">
                      <button
                        onClick={() => handleViewRegistrations(event)}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                        title="View Registrations"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleSendFile(event)}
                        className="p-1.5 text-green-600 hover:bg-green-50 rounded-md transition-colors"
                        title="Send File to Confirmed Users"
                        disabled={event.registrationCounts?.confirmed === 0}
                      >
                        <Send className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleEdit(event)}
                        className="p-1.5 text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
                        title="Edit Event"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(event)}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded-md transition-colors"
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

      {/* Send File Modal */}
        {showSendFileModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-900">Send File to Users</h2>
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
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              {/* Recipient Selection */}
              <div className="mb-4">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showCandidateSelection}
                    onChange={(e) => {
                      setShowCandidateSelection(e.target.checked);
                      if (!e.target.checked) {
                        setSelectedCandidates([]);
                      }
                    }}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Send to specific candidates (otherwise sends to all {selectedEventForFile?.registrationCounts?.confirmed || 0} confirmed users)
                  </span>
                </label>
              </div>

              {/* Candidate Selection List */}
              {showCandidateSelection && (
                <div className="mb-4 border border-gray-200 rounded-lg p-3 max-h-48 overflow-y-auto">
                  <p className="text-sm font-medium text-gray-700 mb-2">Select Recipients:</p>
                  {confirmedCandidates.length === 0 ? (
                    <p className="text-sm text-gray-500">Loading candidates...</p>
                  ) : (
                    <div className="space-y-2">
                      {confirmedCandidates.map((candidate) => (
                        <label key={candidate._id} className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
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
                            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-700">
                            {candidate.name} ({candidate.email})
                          </span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              )}
              
              {/* Upload Method Toggle */}
              <div className="mb-4 flex gap-2">
                <button
                  onClick={() => setUploadMethod('upload')}
                  className={`flex-1 px-4 py-2 rounded-md font-medium transition-colors ${
                    uploadMethod === 'upload' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Upload className="w-4 h-4 inline mr-2" />
                  Upload File
                </button>
                <button
                  onClick={() => setUploadMethod('url')}
                  className={`flex-1 px-4 py-2 rounded-md font-medium transition-colors ${
                    uploadMethod === 'url' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  File URL
                </button>
              </div>
              
              <div className="space-y-4">
                {uploadMethod === 'upload' ? (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select File <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="file"
                      onChange={(e) => setSelectedFile(e.target.files[0])}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt,.zip,.jpg,.jpeg,.png"
                    />
                    {selectedFile && (
                      <div className="mt-2 p-2 bg-blue-50 rounded-md">
                        <p className="text-sm text-blue-700">
                          📎 Selected: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        File URL <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="url"
                        value={fileData.fileUrl}
                        onChange={(e) => setFileData({ ...fileData, fileUrl: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="https://example.com/file.pdf"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        File Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={fileData.fileName}
                        onChange={(e) => setFileData({ ...fileData, fileName: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Event Schedule.pdf"
                      />
                    </div>
                  </>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message (Optional)
                  </label>
                  <textarea
                    value={fileData.message}
                    onChange={(e) => setFileData({ ...fileData, message: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Additional message to include in the email..."
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
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
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                  disabled={uploading}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSendFileSubmit}
                  disabled={uploading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {uploading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      {uploadMethod === 'upload' ? 'Uploading...' : 'Sending...'}
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
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
