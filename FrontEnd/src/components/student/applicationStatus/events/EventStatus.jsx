import { useEffect, useState } from 'react';
import { Search, MapPin, Clock, Calendar, Briefcase, Award, CheckCircle, ArrowRight, Filter, Users, Upload, Link as LinkIcon } from 'lucide-react';
import { getEventApplicationStatus } from '@/lib/User_AxiosInstance';
import { statusSteps } from '../../../../constants/data.js';
import axios from 'axios';

const EventStatus = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [formData, setFormData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchEventApplications = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await getEventApplicationStatus();
      console.log("🔍 Event applications response:", response);
      
      if (!response || !response.data) {
        throw new Error("No response from API");
      }
      
      const eventsData = response.data.data || [];
      console.log(`🔍 Found ${eventsData.length} event applications`);
      
      if (eventsData.length === 0) {
        setEvents([]);
        setIsLoading(false);
        return;
      }
      
      // Transform event data to match our structure
      const transformedEvents = eventsData.map(event => {
        const participant = event.participant || {};
        const firstHistory = Array.isArray(event?.statusHistory) && event.statusHistory.length > 0 
          ? event.statusHistory[0] 
          : null;
        
        // Format date
        const date = firstHistory?.date 
          ? new Date(firstHistory.date).toUTCString().slice(0, 16)
          : event.createdAt 
            ? new Date(event.createdAt).toLocaleDateString()
            : "N/A";
        
        // Extract location
        const location = event.venue || event.location || "Location not specified";
        
        // Extract event type
        const eventType = event.type || "Event";
        
        // Team members
        const teamMembers = participant.teamMembers || [];
        const totalTeamMembers = teamMembers.length + 1; // +1 for team leader
        
        // Rounds
        const rounds = (event.rounds || []).map(round => ({
          roundNumber: round.roundNumber || '',
          roundName: round.roundName || `Round ${round.roundNumber}`,
          startDate: round.startDate || '',
          endDate: round.endDate || '',
          description: round.description || '',
          inputType: round.inputType || 'link',
          status: 'Pending'
        }));
        
        // Participant rounds
        const participantRounds = (participant.rounds || []).map(round => ({
          roundNumber: round.roundNumber || '',
          rountStatus: round.rountStatus || '',
          inputType: round.inputType || '',
        }));
        
        return {
          ...event,
          id: event._id,
          status: event.currentStatus || "Applied",
          date: date,
          title: event.title || "Untitled Event",
          subTitle: event.subTitle || "",
          eventType: eventType,
          location: location,
          startDate: event.startDate,
          endDate: event.endDate,
          teamLeader: participant.name || "Team Leader",
          teamMembers: teamMembers,
          totalTeamMembers: totalTeamMembers,
          projectTitle: participant.projectTitle || "Untitled Project",
          rounds: rounds,
          participantRounds: participantRounds,
          participantData: participant,
          _debug: {
            hasParticipant: !!participant,
            teamMembersCount: totalTeamMembers,
            roundsCount: rounds.length
          }
        };
      });
      
      console.log("✅ Final transformed events:", transformedEvents);
      setEvents(transformedEvents);
      
      if (transformedEvents.length > 0) {
        const firstEvent = transformedEvents[0];
        setSelectedEvent(firstEvent);
        
        if (firstEvent.participantData) {
          setFormData({
            teamLeaderId: firstEvent.participantData.teamLeaderId || '',
            eventID: firstEvent.participantData.eventID || '',
            eventName: firstEvent.participantData.eventName || '',
            name: firstEvent.participantData.name || '',
            email: firstEvent.participantData.email || '',
            projectTitle: firstEvent.participantData.projectTitle || '',
            teamMembers: firstEvent.participantData.teamMembers || [],
            rounds: firstEvent.participantRounds || [],
          });
        }
      }
      
    } catch (error) {
      console.error("❌ Error in fetchEventApplications:", error);
      setError(error.message || "Failed to fetch event applications");
    } finally {
      setIsLoading(false);
    }
  };

  const onEventChange = (event) => {
    setSelectedEvent(event);
    if (event.participantData) {
      setFormData({
        teamLeaderId: event.participantData.teamLeaderId || '',
        eventID: event.participantData.eventID || '',
        eventName: event.participantData.eventName || '',
        name: event.participantData.name || '',
        email: event.participantData.email || '',
        projectTitle: event.participantData.projectTitle || '',
        teamMembers: event.participantData.teamMembers || [],
        rounds: event.participantRounds || [],
      });
    }
  };

  const handleSubmit = async (e, roundNumber, source, id) => {
    e.preventDefault();
    if (source === "link") {
      await handleLinkSubmit(e, roundNumber, id);
    } else {
      await handleFileSubmit(e, roundNumber, id);
    }
  };

  const saveData = async (payload) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_Backend_URL}/eventParticipation/updateInputType`,
        payload
      );

      if (response.status === 200 || response.status === 201) {
        alert("Request submitted successfully!");
      }
    } catch (err) {
      alert("Failed to submit request: " + (err.response?.data?.message || err.message));
    }
  };

  useEffect(() => {
    fetchEventApplications();
  }, []);

  const handleLinkSubmit = async (e, roundNumber, id) => {
    e.preventDefault();
    const form = new FormData(e.target);
    const link = form.get('submissionLink');

    if (formData) {
      const updatedRounds = formData.rounds.map(round =>
        round.roundNumber === roundNumber
          ? { ...round, inputType: link }
          : round
      );

      setFormData(prev => ({
        ...prev,
        rounds: updatedRounds,
      }));
      const payload = { inputType: link, roundNumber, _id: id };
      await saveData(payload);
    }
  };

  const handleFileSubmit = async (e, roundNumber, id) => {
    e.preventDefault();
    const file = e.target.submissionFile.files[0];

    if (!file) {
      alert('Please select a file.');
      return;
    }

    if (formData) {
      const updatedRounds = formData.rounds.map(round =>
        round.roundNumber === roundNumber
          ? { ...round, inputType: file.name }
          : round
      );

      setFormData(prev => ({
        ...prev,
        rounds: updatedRounds,
      }));
      const payload = { inputType: file.name, roundNumber, _id: id };
      await saveData(payload);
    }
  };

  const filteredEvents = events.filter(event =>
    (event?.title?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
    (event?.eventType?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
    (event?.location?.toLowerCase() || "").includes(searchTerm.toLowerCase())
  );

  // Apply sorting
  const sortedEvents = [...filteredEvents].sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      case "oldest":
        return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
      case "organizer":
        return (a.title || "").localeCompare(b.title || "");
      default:
        return 0;
    }
  });

  const getStatusIndex = (status) => {
    if (!status) return 0;
    const index = statusSteps.findIndex(step => step.toLowerCase() === status.toLowerCase());
    return index >= 0 ? index : 0;
  };

  const getEventTypeColor = (type) => {
    switch(type?.toLowerCase()) {
      case 'hackathon': return 'bg-gradient-to-r from-[#a5b4fc]/20 to-[#c4b5fd]/20 text-[#5b21b6] border border-[#a5b4fc]/30';
      case 'workshop': return 'bg-gradient-to-r from-[#bbf7d0]/20 to-[#86efac]/20 text-[#065f46] border border-[#bbf7d0]/30';
      case 'casestudy': return 'bg-gradient-to-r from-[#fde68a]/20 to-[#fcd34d]/20 text-[#92400e] border border-[#fde68a]/30';
      default: return 'bg-gradient-to-r from-[#a5b4fc]/20 to-[#c4b5fd]/20 text-[#5b21b6] border border-[#a5b4fc]/30';
    }
  };

  const getCompanyInitials = (title) => {
    if (!title || title === "Untitled Event") return "EV";
    const words = title.split(' ').filter(word => word.length > 0);
    if (words.length === 1) return words[0].substring(0, 2).toUpperCase();
    return (words[0].charAt(0) + words[1].charAt(0)).toUpperCase();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#143694]/10 via-[#f093fb]/5 to-[#1e4ed8]/10">
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#143694]/10 rounded-full blur-3xl"></div>
          <div className="absolute top-1/3 -left-20 w-60 h-60 bg-[#f093fb]/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-1/3 w-40 h-40 bg-[#1e4ed8]/10 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative z-10 flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#143694]"></div>
        </div>
      </div>
    );
  }

  if (error && events.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#143694]/10 via-[#f093fb]/5 to-[#1e4ed8]/10 flex items-center justify-center p-4">
        <div className="bg-white/90 backdrop-blur-sm border border-white/50 rounded-2xl shadow-lg shadow-purple-50/50 p-6 max-w-md">
          <div className="text-red-500 mb-4 text-center">
            <svg className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2 text-center">Error Loading Events</h3>
          <p className="text-sm text-gray-600 mb-4 text-center">{error}</p>
          <button
            onClick={fetchEventApplications}
            className="w-full px-4 py-2 bg-gradient-to-r from-[#143694] to-[#1e4ed8] text-white rounded-xl hover:shadow-lg hover:shadow-[#143694]/40 transition-all duration-300"
          >
            Try Again
          </button>
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

      <div className="relative z-10 container mx-auto px-4 py-6">
        {/* Header */}
        <div className="bg-white/90 backdrop-blur-sm border border-white/50 rounded-2xl shadow-lg shadow-purple-50/50 p-5 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-gradient-to-br from-[#143694]/20 to-[#1e4ed8]/20 rounded-lg">
                <Award className="h-5 w-5 text-[#143694]" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-[#143694] to-[#1e4ed8] bg-clip-text text-transparent">
                  Event Application Status
                </h1>
                <p className="text-sm text-gray-600">
                  {events.length} event application(s) found
                </p>
              </div>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search events..."
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-[#143694]/30 focus:border-[#143694]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Filter className="h-4 w-4 text-gray-400" />
              </div>
              <select
                className="pl-10 pr-8 py-2.5 border border-gray-200 rounded-xl bg-white/50 backdrop-blur-sm appearance-none focus:outline-none focus:ring-2 focus:ring-[#143694]/30 focus:border-[#143694]"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="newest">Sort by: Newest</option>
                <option value="oldest">Sort by: Oldest</option>
                <option value="organizer">Sort by: Organizer</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg className="h-4 w-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Events List - Now showing 2 per row */}
          <div className="lg:col-span-1">
            <div className="bg-white/90 backdrop-blur-sm border border-white/50 rounded-2xl shadow-lg shadow-purple-50/50 h-full flex flex-col">
              <div className="p-4 border-b border-white/60">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-semibold text-gray-900">Events</h2>
                  <span className="text-xs font-medium px-2 py-1 bg-gradient-to-r from-[#143694]/10 to-[#1e4ed8]/10 text-[#143694] rounded-full">
                    {sortedEvents.length}
                  </span>
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto p-2">
                {sortedEvents.length > 0 ? (
                  <div className="grid grid-cols-2 gap-2">
                    {sortedEvents.map(event => (
                      <button
                        key={event.id}
                        onClick={() => onEventChange(event)}
                        className={`text-left p-3 rounded-xl transition-all duration-200 ${
                          selectedEvent?.id === event.id 
                            ? 'bg-gradient-to-r from-[#143694]/10 to-[#1e4ed8]/10 border border-[#143694]/20' 
                            : 'hover:bg-white/30 border border-transparent'
                        }`}
                      >
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center gap-2">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                              selectedEvent?.id === event.id 
                                ? 'bg-gradient-to-br from-[#143694] to-[#1e4ed8] text-white' 
                                : 'bg-white/50 border border-white/60 text-[#143694]'
                            }`}>
                              <span className="text-xs font-bold">{getCompanyInitials(event.title)}</span>
                            </div>
                          </div>
                          <div className="min-w-0">
                            <h3 className="text-sm font-semibold text-gray-900 truncate">{event.title}</h3>
                            <div className="mt-1.5 flex flex-col gap-1">
                              <div className="flex items-center text-xs text-gray-500">
                                <MapPin className="h-3 w-3 mr-1 text-[#143694]" />
                                <span className="truncate">{event.location}</span>
                              </div>
                              <span className={`text-xs px-1.5 py-0.5 rounded w-fit ${getEventTypeColor(event.eventType)}`}>
                                {event.eventType}
                              </span>
                            </div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="p-6 text-center">
                    <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-white/50 to-white/30 border border-white/60 mb-3">
                      <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <p className="text-sm text-gray-500">No event applications found</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Event Details */}
          <div className="lg:col-span-2">
            {selectedEvent ? (
              <div className="bg-white/90 backdrop-blur-sm border border-white/50 rounded-2xl shadow-lg shadow-purple-50/50 h-full flex flex-col">
                {/* Status Progress */}
                <div className="p-5 border-b border-white/60">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h2 className="text-lg font-bold text-gray-900">{selectedEvent.title}</h2>
                      <p className="text-sm text-gray-600">{selectedEvent.subTitle}</p>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#143694]/20 to-[#1e4ed8]/20 flex items-center justify-center border border-white/60">
                      <span className="text-lg font-bold text-[#143694]">
                        {getCompanyInitials(selectedEvent.title)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="relative">
                    <div className="flex justify-between mb-1">
                      {statusSteps?.slice(0, 4).map((step, idx) => {
                        const currentIdx = getStatusIndex(selectedEvent.status);
                        const isActive = idx <= currentIdx;
                        return (
                          <div key={idx} className="flex flex-col items-center" style={{ width: `${100 / 4}%` }}>
                            <div className={`w-6 h-6 rounded-full mb-1 flex items-center justify-center border-2 text-xs ${
                              isActive 
                                ? 'bg-gradient-to-r from-[#143694] to-[#1e4ed8] border-transparent text-white' 
                                : 'bg-white/50 border-white/60 text-gray-400'
                            }`}>
                              {isActive ? <CheckCircle className="h-3 w-3" /> : idx + 1}
                            </div>
                            <span className={`text-xs text-center ${isActive ? 'text-[#143694] font-medium' : 'text-gray-500'}`}>
                              {step.length > 10 ? step.substring(0, 10) + '...' : step}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                    <div className="h-1.5 bg-white/50 absolute left-6 right-6 top-3 -z-10">
                      <div
                        className="h-1.5 bg-gradient-to-r from-[#143694] to-[#1e4ed8] transition-all duration-300 rounded-full"
                        style={{
                          width: `${(getStatusIndex(selectedEvent.status) / (statusSteps.length - 1)) * 100}%`
                        }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Event Details Grid */}
                <div className="flex-1 p-5">
                  {/* Row 1: Event Type and Location */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="p-3 bg-gradient-to-r from-white/30 to-white/10 border border-white/60 rounded-xl">
                      <div className="flex items-center gap-2 mb-1">
                        <Briefcase className="h-4 w-4 text-[#143694]" />
                        <span className="text-xs font-medium text-gray-700">Event Type</span>
                      </div>
                      <p className="text-sm text-gray-900">{selectedEvent.eventType}</p>
                    </div>
                    
                    <div className="p-3 bg-gradient-to-r from-white/30 to-white/10 border border-white/60 rounded-xl">
                      <div className="flex items-center gap-2 mb-1">
                        <MapPin className="h-4 w-4 text-[#143694]" />
                        <span className="text-xs font-medium text-gray-700">Location</span>
                      </div>
                      <p className="text-sm text-gray-900">{selectedEvent.location}</p>
                    </div>
                  </div>

                  {/* Row 2: Event Dates and Team Members */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="p-3 bg-gradient-to-r from-white/30 to-white/10 border border-white/60 rounded-xl">
                      <div className="flex items-center gap-2 mb-1">
                        <Calendar className="h-4 w-4 text-[#143694]" />
                        <span className="text-xs font-medium text-gray-700">Event Dates</span>
                      </div>
                      <p className="text-sm text-gray-900">
                        {new Date(selectedEvent.startDate).toLocaleDateString()} - {new Date(selectedEvent.endDate).toLocaleDateString()}
                      </p>
                    </div>
                    
                    <div className="p-3 bg-gradient-to-r from-white/30 to-white/10 border border-white/60 rounded-xl">
                      <div className="flex items-center gap-2 mb-1">
                        <Users className="h-4 w-4 text-[#143694]" />
                        <span className="text-xs font-medium text-gray-700">Team Members</span>
                      </div>
                      <p className="text-sm text-gray-900">{selectedEvent.totalTeamMembers} members</p>
                    </div>
                  </div>

                  {/* Row 3: Project Title and Team Leader */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    {/* Project Title */}
                    <div className="p-3 bg-gradient-to-r from-white/30 to-white/10 border border-white/60 rounded-xl">
                      <div className="flex items-center gap-2 mb-1">
                        <svg className="h-4 w-4 text-[#143694]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span className="text-xs font-medium text-gray-700">Project Title</span>
                      </div>
                      <p className="text-sm text-gray-900">{selectedEvent.projectTitle}</p>
                    </div>
                    
                    {/* Team Leader */}
                    <div className="p-3 bg-gradient-to-r from-white/30 to-white/10 border border-white/60 rounded-xl">
                      <div className="flex items-center gap-2 mb-1">
                        <svg className="h-4 w-4 text-[#143694]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span className="text-xs font-medium text-gray-700">Team Leader</span>
                      </div>
                      <p className="text-sm text-gray-900">{selectedEvent.teamLeader}</p>
                    </div>
                  </div>

                  {/* Event Rounds */}
                  {selectedEvent.rounds && selectedEvent.rounds.length > 0 && (
                    <div className="mb-5">
                      <h3 className="text-sm font-medium text-gray-700 mb-2">Event Rounds</h3>
                      <div className="space-y-3">
                        {selectedEvent.rounds.map((round, index) => (
                          <div key={index} className="p-3 bg-gradient-to-r from-white/30 to-white/10 border border-white/60 rounded-xl">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <div className="w-6 h-6 bg-gradient-to-r from-[#143694] to-[#1e4ed8] text-white rounded-full flex items-center justify-center text-xs font-semibold">
                                  {round.roundNumber}
                                </div>
                                <span className="text-sm font-medium text-gray-900">{round.roundName}</span>
                              </div>
                              <span className="text-xs px-2 py-1 bg-amber-100 text-amber-700 rounded-lg border border-amber-200">
                                Pending
                              </span>
                            </div>
                            
                            <p className="text-sm text-gray-600 mb-3">{round.description}</p>
                            
                            {/* Submission Form */}
                            {round.inputType === 'link' ? (
                              <form onSubmit={(e) => handleSubmit(e, round.roundNumber, "link", selectedEvent.participantData?._id)} className="space-y-2">
                                <div className="relative">
                                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                    <LinkIcon className="h-4 w-4 text-gray-400" />
                                  </div>
                                  <input
                                    name="submissionLink"
                                    type="url"
                                    placeholder="Enter submission link"
                                    className="w-full pl-10 p-2 text-sm border border-gray-200 rounded-lg bg-white/50 focus:outline-none focus:ring-1 focus:ring-[#143694]/30 focus:border-[#143694] backdrop-blur-sm"
                                    required
                                  />
                                </div>
                                <div className="flex justify-end">
                                  <button
                                    type="submit"
                                    className="px-3 py-1.5 bg-gradient-to-r from-[#143694] to-[#1e4ed8] text-white text-xs rounded-lg hover:shadow-md hover:shadow-[#143694]/30 transition-all duration-200"
                                  >
                                    Submit Link
                                  </button>
                                </div>
                              </form>
                            ) : (
                              <form onSubmit={(e) => handleSubmit(e, round.roundNumber, "file", selectedEvent.participantData?._id)} className="space-y-2">
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                  <Upload className="inline h-3 w-3 mr-1" />
                                  Upload {round.inputType?.toUpperCase()} file
                                </label>
                                <div className="flex items-center gap-2">
                                  <input
                                    name="submissionFile"
                                    type="file"
                                    accept={
                                      round.inputType === 'doc'
                                        ? '.doc,.docx'
                                        : round.inputType === 'pdf'
                                          ? '.pdf'
                                          : round.inputType === 'ppt'
                                            ? '.ppt,.pptx'
                                            : '*'
                                    }
                                    className="block w-full text-xs text-gray-600 file:mr-2 file:py-1.5 file:px-3 file:border-0 file:rounded-lg file:bg-gradient-to-r file:from-[#143694] file:to-[#1e4ed8] file:text-white hover:file:from-[#1e4ed8] hover:file:to-[#143694] transition-all duration-200"
                                    required
                                  />
                                </div>
                                <div className="flex justify-end">
                                  <button
                                    type="submit"
                                    className="px-3 py-1.5 bg-gradient-to-r from-[#143694] to-[#1e4ed8] text-white text-xs rounded-lg hover:shadow-md hover:shadow-[#143694]/30 transition-all duration-200"
                                  >
                                    Submit File
                                  </button>
                                </div>
                              </form>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Team Members List */}
                  {selectedEvent.teamMembers.length > 0 && (
                    <div className="mb-5">
                      <h3 className="text-sm font-medium text-gray-700 mb-2">Team Members</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div className="p-2 bg-gradient-to-r from-[#bbf7d0]/10 to-[#86efac]/10 border border-[#bbf7d0]/30 rounded-lg">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span className="text-sm text-gray-700">{selectedEvent.teamLeader} (Leader)</span>
                          </div>
                        </div>
                        {selectedEvent.teamMembers.slice(0, 3).map((member, idx) => (
                          <div key={idx} className="p-2 bg-gradient-to-r from-[#dbeafe]/10 to-[#bfdbfe]/10 border border-[#dbeafe]/30 rounded-lg">
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-[#1e4ed8] rounded-full"></div>
                              <span className="text-sm text-gray-700">{member.name}</span>
                            </div>
                          </div>
                        ))}
                        {selectedEvent.teamMembers.length > 3 && (
                          <div className="p-2 bg-gradient-to-r from-white/30 to-white/10 border border-white/60 rounded-lg col-span-2">
                            <span className="text-sm text-gray-700">
                              +{selectedEvent.teamMembers.length - 3} more members
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Action Button */}
                  <div className="mt-auto">
                    <button 
                      onClick={() => alert('View full details clicked!')}
                      className="inline-flex items-center justify-center w-full px-4 py-2.5 bg-gradient-to-r from-[#143694] to-[#1e4ed8] text-white text-sm rounded-xl hover:shadow-lg hover:shadow-[#143694]/40 transition-all duration-300 group"
                    >
                      View Full Details
                      <ArrowRight className="h-3.5 w-3.5 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                    </button>
                  </div>
                </div>
              </div>
            ) : events.length === 0 ? (
              <div className="bg-white/90 backdrop-blur-sm border border-white/50 rounded-2xl shadow-lg shadow-purple-50/50 h-full flex flex-col items-center justify-center p-6">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-white/50 to-white/30 border border-white/60 mb-4">
                  <Award className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Event Applications</h3>
                <p className="text-sm text-gray-600 text-center">
                  You haven't applied to any events yet.
                </p>
              </div>
            ) : (
              <div className="bg-white/90 backdrop-blur-sm border border-white/50 rounded-2xl shadow-lg shadow-purple-50/50 h-full flex flex-col items-center justify-center p-6">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-white/50 to-white/30 border border-white/60 mb-4">
                  <Award className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Select an Event Application</h3>
                <p className="text-sm text-gray-600 text-center">
                  Choose an event application from the list to view detailed status
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventStatus;