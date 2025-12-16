import { useEffect, useState } from 'react';
import { Search, MapPin, Clock, Filter, Calendar, Upload, Link as LinkIcon } from 'lucide-react';
import { getEventApplicationStatus } from '@/lib/User_AxiosInstance';
import { statusSteps } from '../../../../constants/data.js'
import axios from 'axios';

const EventStatus = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [formData, setFormData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchEventApplications = async () => {
    try {
      setIsLoading(true);
      const response = await getEventApplicationStatus();
      const firstEvent = response.data.data[0];
      const participant = firstEvent.participant;
      setEvents(response.data.data);
      setSelectedEvent(firstEvent);

      if (firstEvent?.participant) {
        setFormData({
          teamLeaderId: participant.teamLeaderId || '',
          eventID: participant.eventID || '',
          eventName: participant.eventName || '',
          name: participant.name || '',
          email: participant.email || '',
          projectTitle: participant.projectTitle || '',
          teamMembers: participant.teamMembers || [],
          rounds: (participant.rounds || []).map(round => ({
            roundNumber: round.roundNumber || '',
            rountStatus: round.rountStatus || '',
            inputType: round.inputType || '',
          })),
        });
      }
    } catch (error) {
      console.log("Error fetching event data: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  const onEventChange = (event) => {
    setSelectedEvent(event);
    const participant = event.participant;
    if (participant) {
      setFormData({
        teamLeaderId: participant.teamLeaderId || '',
        eventID: participant.eventID || '',
        eventName: participant.eventName || '',
        name: participant.name || '',
        email: participant.email || '',
        projectTitle: participant.projectTitle || '',
        teamMembers: participant.teamMembers || [],
        rounds: (participant.rounds || []).map(round => ({
          roundNumber: round.roundNumber || '',
          rountStatus: round.rountStatus || '',
          inputType: round.inputType || '',
        })),
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
  };

  const handleFileSubmit = async (e, roundNumber, id) => {
    e.preventDefault();
    const file = e.target.submissionFile.files[0];

    if (!file) {
      alert('Please select a file.');
      return;
    }

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
  };

  const getStatusIndex = (status) =>
    statusSteps.findIndex(step => step === status);

  const getEventTypeColor = (type) => {
    switch(type?.toLowerCase()) {
      case 'hackathon': return 'bg-gradient-to-r from-[#a5b4fc]/20 to-[#c4b5fd]/20 text-[#5b21b6] border border-[#a5b4fc]/30';
      case 'workshop': return 'bg-gradient-to-r from-[#bbf7d0]/20 to-[#86efac]/20 text-[#065f46] border border-[#bbf7d0]/30';
      case 'casestudy': return 'bg-gradient-to-r from-[#fde68a]/20 to-[#fcd34d]/20 text-[#92400e] border border-[#fde68a]/30';
      default: return 'bg-gradient-to-r from-[#a5b4fc]/20 to-[#c4b5fd]/20 text-[#5b21b6] border border-[#a5b4fc]/30';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#667eea]/10 via-[#f093fb]/5 to-[#764ba2]/10">
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#667eea]/10 via-[#f093fb]/5 to-[#764ba2]/10">
      {/* Pastel blur background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#667eea]/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 -left-20 w-60 h-60 bg-[#f093fb]/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-1/3 w-40 h-40 bg-[#764ba2]/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 flex flex-col h-screen">
        {/* Header */}
        <div className="bg-white/90 backdrop-blur-sm border-b border-white/50 py-4 px-6 shadow-lg shadow-purple-50/50">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent">Event Status</h1>
              <p className="text-gray-600 mt-1">Track the status of events you've registered for.</p>
            </div>
            
            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="flex flex-col">
                <span className="text-xs text-gray-500 mb-1">Total Events</span>
                <span className="px-3 py-2 text-sm font-medium bg-gradient-to-r from-[#a5b4fc]/20 to-[#c4b5fd]/20 text-[#5b21b6] border border-[#a5b4fc]/30 rounded-xl">
                  {events?.length || 0}
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
                  Events
                </span>
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
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl bg-white/50 focus:outline-none focus:ring-2 focus:ring-[#667eea]/30 focus:border-[#667eea] backdrop-blur-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Filter className="h-4 w-4 text-gray-400" />
              </div>
              <select
                className="pl-10 pr-8 py-2 border border-gray-200 rounded-xl bg-white/50 appearance-none focus:outline-none focus:ring-2 focus:ring-[#667eea]/30 focus:border-[#667eea] backdrop-blur-sm"
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

        {/* Main Content */}
        <div className="flex flex-1 overflow-hidden p-4 md:p-6">
          {/* Sidebar */}
          <div className="w-full md:w-72 bg-white/90 backdrop-blur-sm border border-white/50 rounded-2xl shadow-lg shadow-purple-50/50 overflow-y-auto mr-0 md:mr-6">
            {events?.length > 0 ? (
              events.map((event) => (
                <div
                  key={event._id}
                  onClick={() => onEventChange(event)}
                  className={`p-4 cursor-pointer border-b border-gray-100 hover:bg-gradient-to-r hover:from-[#667eea]/5 hover:to-[#764ba2]/5 transition-all duration-200 ${selectedEvent?._id === event._id ? 'bg-gradient-to-r from-[#667eea]/10 to-[#764ba2]/10' : ''
                    }`}
                >
                  <span className={`text-xs px-2 py-1 rounded-lg ${getEventTypeColor(event.type)}`}>
                    {event.type || 'Event'}
                  </span>
                  <h3 className="text-md font-semibold text-gray-900 mt-2">{event.title}</h3>
                  <p className="text-sm text-gray-600">{event.participant?.eventName || 'Event'}</p>
                  <div className="mt-2 flex items-center text-xs text-gray-500">
                    <Calendar className="h-3 w-3 mr-1" />
                    {new Date(event.startDate).toLocaleDateString()}
                    <span className="mx-2">•</span>
                    <MapPin className="h-3 w-3 mr-1" />
                    {event.venue}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-gray-600 p-4 text-center">No events found!</div>
            )}
          </div>

          {/* Main Panel */}
          <div className="flex-1 overflow-y-auto">
            {selectedEvent && (
              <div className="space-y-6">
                {/* Status Progress Bar */}
                <div className="bg-white/90 backdrop-blur-sm border border-white/50 rounded-2xl shadow-lg shadow-purple-50/50 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Application Progress</h3>
                  <div className="relative mb-2">
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-2 bg-gradient-to-r from-[#667eea] to-[#764ba2] rounded-full"
                        style={{
                          width: `${(getStatusIndex("Application sent") / (statusSteps.length - 1)) * 100}%`
                        }}
                      ></div>
                    </div>
                    <div className="flex justify-between mt-4">
                      {statusSteps.map((step, idx) => {
                        const currentIdx = getStatusIndex("Application sent");
                        const isActive = idx <= currentIdx;

                        return (
                          <div key={idx} className="flex flex-col items-center text-xs" style={{ width: `${100 / statusSteps.length}%` }}>
                            <div className={`w-6 h-6 rounded-full mb-1 flex items-center justify-center ${isActive ? 'bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white' : 'bg-gray-200 text-gray-500'}`}>
                              {idx + 1}
                            </div>
                            <span className={`text-center text-xs ${isActive ? 'text-[#667eea] font-medium' : 'text-gray-500'}`}>
                              {step}
                            </span>
                            {idx === 0 && <span className="text-gray-400 text-xs mt-1">{selectedEvent.date}</span>}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Event Card */}
                <div className="bg-white/90 backdrop-blur-sm border border-white/50 rounded-2xl shadow-lg shadow-purple-50/50 p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-2xl font-semibold bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent">{selectedEvent.title}</h2>
                      <p className="text-gray-600">{selectedEvent.subTitle}</p>
                      <div className="mt-3 text-sm text-gray-500 space-y-2">
                        <p>Event ID: {selectedEvent._id}</p>
                        <div className="flex items-center gap-2 flex-wrap">
                          <div className="flex items-center px-2 py-1 bg-gradient-to-r from-[#fde68a]/20 to-[#fcd34d]/20 text-[#92400e] border border-[#fde68a]/30 rounded-lg">
                            <Calendar className="h-4 w-4 mr-1" />
                            {new Date(selectedEvent.startDate).toLocaleDateString()} - {new Date(selectedEvent.endDate).toLocaleDateString()}
                          </div>
                          <div className="flex items-center px-2 py-1 bg-gradient-to-r from-[#bae6fd]/20 to-[#7dd3fc]/20 text-[#0369a1] border border-[#bae6fd]/30 rounded-lg">
                            <MapPin className="h-4 w-4 mr-1" />
                            {selectedEvent.location}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="w-16 h-16 bg-gradient-to-r from-[#667eea]/10 to-[#764ba2]/10 rounded-2xl flex items-center justify-center border border-[#667eea]/20">
                      <span className="text-2xl font-bold text-[#667eea]">{selectedEvent.title?.charAt(0) || 'E'}</span>
                    </div>
                  </div>

                  {/* Event Rounds */}
                  <div className="mt-8">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Event Rounds</h3>
                    <div className="border-l-2 border-gray-200 pl-6 relative space-y-8">
                      {selectedEvent.rounds?.map((round, index) => (
                        <div key={index} className="relative">
                          {/* Round Number Badge */}
                          <div
                            className="absolute w-8 h-8 bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white rounded-full flex items-center justify-center -left-10 text-sm font-semibold"
                            style={{ top: '-4px' }}
                          >
                            {round.roundNumber}
                          </div>

                          {/* Round Info */}
                          <div className="text-sm text-gray-500 mb-1">
                            {new Date(round.startDate).toLocaleDateString()} - {new Date(round.endDate).toLocaleDateString()}
                          </div>
                          <h4 className="text-md font-semibold text-gray-900">{round.roundName}</h4>
                          <p className="text-gray-600 mb-4">{round.description}</p>

                          {/* Submission Form */}
                          {round.inputType === 'link' ? (
                            <form onSubmit={(e) => handleSubmit(e, round.roundNumber, "link", selectedEvent.participant._id)} className="space-y-3">
                              <div className="relative">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                  <LinkIcon className="h-4 w-4 text-gray-400" />
                                </div>
                                <input
                                  name="submissionLink"
                                  type="url"
                                  placeholder="Enter submission link"
                                  className="w-full pl-10 p-3 border border-gray-200 rounded-xl bg-white/50 focus:outline-none focus:ring-2 focus:ring-[#667eea]/30 focus:border-[#667eea] backdrop-blur-sm"
                                  required
                                />
                              </div>
                              <div className="flex justify-end">
                                <button
                                  type="submit"
                                  className="bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white px-6 py-2 rounded-xl hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-200"
                                >
                                  Submit Link
                                </button>
                              </div>
                            </form>
                          ) : (
                            <form onSubmit={(e) => handleSubmit(e, round.roundNumber, "file", selectedEvent.participant._id)} className="space-y-3">
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                <Upload className="inline h-4 w-4 mr-1" />
                                Upload {round.inputType?.toUpperCase()} file
                              </label>
                              <div className="flex items-center gap-3">
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
                                  className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:border-0 file:rounded-xl file:bg-gradient-to-r file:from-[#667eea] file:to-[#764ba2] file:text-white hover:file:from-[#764ba2] hover:file:to-[#667eea] transition-all duration-200"
                                  required
                                />
                              </div>
                              <div className="flex justify-end">
                                <button
                                  type="submit"
                                  className="bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white px-6 py-2 rounded-xl hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-200"
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

                  {/* Horizontal Split: Participation & Notifications */}
                  <div className="flex flex-col md:flex-row gap-6 mt-8">
                    {/* Team Participation */}
                    <div className="bg-gradient-to-r from-[#bbf7d0]/10 to-[#86efac]/10 border border-[#bbf7d0]/30 rounded-2xl p-6 w-full md:w-1/2">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Participation Details</h3>
                      <p className="text-gray-700 mb-3">
                        <span className="font-medium text-gray-900">Team Name:</span> {selectedEvent.participant.projectTitle}
                      </p>
                      <p className="text-gray-900 font-medium mb-2">Participants:</p>
                      <ul className="space-y-2">
                        <li className="flex items-center">
                          <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                          <span className="text-gray-700">{selectedEvent.participant.name} (Team Leader)</span>
                        </li>
                        {selectedEvent.participant.teamMembers.map((member, idx) => (
                          <li key={idx} className="flex items-center ml-4">
                            <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                            <span className="text-gray-700">{member.name}</span>
                          </li>
                        ))}
                      </ul>
                      <button className="mt-4 bg-gradient-to-r from-[#10b981] to-[#059669] text-white px-4 py-2 rounded-xl hover:shadow-lg hover:shadow-green-500/30 transition-all duration-200">
                        Accept Invitation
                      </button>
                    </div>

                    {/* Notifications */}
                    <div className="bg-gradient-to-r from-[#fef3c7]/10 to-[#fde68a]/10 border border-[#fde68a]/30 rounded-2xl p-6 w-full md:w-1/2">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Notifications</h3>
                      {[1, 2].map((_, idx) => (
                        <div
                          key={idx}
                          className="relative w-full p-4 mb-4 text-gray-600 bg-white/50 backdrop-blur-sm rounded-2xl border border-gray-100 shadow-sm"
                        >
                          <div className="flex items-start">
                            {/* Icon */}
                            <div className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-r from-[#667eea]/20 to-[#764ba2]/20">
                              <svg
                                className="w-4 h-4 text-[#667eea]"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 18 20"
                              >
                                <path
                                  stroke="currentColor"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M16 1v5h-5M2 19v-5h5m10-4a8 8 0 0 1-14.947 3.97M1 10a8 8 0 0 1 14.947-3.97"
                                />
                              </svg>
                            </div>

                            {/* Content */}
                            <div className="ms-3 text-sm flex-1">
                              <span className="mb-1 block text-sm font-semibold text-gray-900">
                                {idx === 0 ? 'Notification Title' : 'Final Reminder'}
                              </span>
                              <div className="mb-2 text-sm">
                                {idx === 0
                                  ? 'This is the notification message with some relevant information for the user.'
                                  : 'Reminder to check in before the event day. Make sure to complete all requirements.'}
                              </div>
                              <p className="text-xs text-gray-500">Date: {idx === 0 ? '2025-10-01' : '2025-09-25'}</p>

                              {/* Buttons */}
                              <div className="grid grid-cols-2 gap-2 mt-3">
                                <button className="inline-flex justify-center w-full px-2 py-1.5 text-xs font-medium text-white bg-gradient-to-r from-[#667eea] to-[#764ba2] rounded-lg hover:shadow-md transition-all duration-200">
                                  {idx === 0 ? 'Take Action' : 'View Details'}
                                </button>
                                <button className="inline-flex justify-center w-full px-2 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-all duration-200">
                                  Dismiss
                                </button>
                              </div>
                            </div>

                            {/* Close Button */}
                            <button
                              type="button"
                              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                              aria-label="Close"
                            >
                              <svg
                                className="w-3 h-3"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 14 14"
                              >
                                <path
                                  stroke="currentColor"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                                />
                              </svg>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4">
                    <button className="text-[#667eea] font-medium hover:text-[#764ba2] transition-colors duration-200">
                      View full details
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventStatus;