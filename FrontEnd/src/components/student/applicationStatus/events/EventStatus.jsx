import { useEffect, useState } from 'react';
import { Search, MapPin, Clock } from 'lucide-react';
import { getEventApplicationStatus } from '@/lib/User_AxiosInstance';
import { statusSteps } from '../../../../constants/data.js'
const EventStatus = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  const fetchEventApplications = async () => {
    try {
      const response = await getEventApplicationStatus();
      console.log("data", response.data.data);

      setEvents(response.data.data);
      setSelectedEvent({
        status: "Awaiting recruiter action",
        date: "2025-10-01"
      }
      );
    } catch (error) {
      console.log("Error fetching event data: ", error);
    }
  };

  useEffect(() => {
    fetchEventApplications();
  }, []);

  // const filteredEvents = events?.filter(event =>
  //   event?.eventName.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //   event?.organizer?.toLowerCase().includes(searchTerm.toLowerCase())
  // );

  const getStatusIndex = (status) =>
    statusSteps.findIndex(step => step === status);

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 py-4 px-6">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-semibold text-gray-800">Event Status</h1>
          <div className="flex space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search events"
                className="pl-9 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            </div>
            <div className="relative">
              <select
                className="pl-3 pr-8 py-2 border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="newest">Sort by: Newest</option>
                <option value="oldest">Sort by: Oldest</option>
                <option value="organizer">Sort by: Organizer</option>
              </select>
            </div>
          </div>
        </div>
        <p className="text-gray-500 mt-1">Track the status of events you’ve registered for.</p>
      </div>

      {/* Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-64 bg-white border-r border-gray-200 overflow-y-auto">
          {events?.length > 0 ? (
            events.map(event => (
              <div
                key={event._id}
                className={`p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50 ${selectedEvent?._id === event._id ? 'bg-gray-100' : ''}`}
                onClick={() => setSelectedEvent(event)}
              >
                <h3 className="font-medium">Event Name</h3>
                <p className="text-sm text-gray-600">Event Orgnizer</p>
                <div className="mt-2 flex items-center text-xs text-gray-500">
                  <Clock className="h-3 w-3 mr-1" />
                  <span>Event</span>
                  <span className="mx-2">•</span>
                  <MapPin className="h-3 w-3 mr-1" />
                  <span>Location</span>
                </div>
              </div>
            ))
          ) : (
            <div className='text-red-500 p-4'>No Events found!</div>
          )}
        </div>

        {/* Event Details */}
        <div className="flex-1 overflow-y-auto p-6">
          {selectedEvent && (
            <>
              {/* Status Progress Bar */}
              <div className="mb-8 relative">
                <div className="flex justify-between mb-2">
                  {statusSteps.map((step, idx) => {
                    const currentIdx = getStatusIndex(selectedEvent.status);
                    const isActive = idx <= currentIdx;

                    return (
                      <div key={idx} className="flex flex-col items-center text-xs" style={{ width: `${100 / statusSteps.length}%` }}>
                        <div className={`w-4 h-4 rounded-full mb-1 ${isActive ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
                        <span className={`text-center ${isActive ? 'text-blue-500 font-medium' : 'text-gray-500'}`}>
                          {step}
                        </span>
                        {idx === 0 && <span className="text-gray-400 text-xs">{selectedEvent.date}</span>}
                      </div>
                    );
                  })}
                </div>
                <div className="h-1 bg-gray-200 absolute left-0 right-0 top-2">
                  <div
                    className="h-1 bg-blue-500"
                    style={{
                      width: `${(getStatusIndex(selectedEvent.status) / (statusSteps.length - 1)) * 100}%`
                    }}
                  ></div>
                </div>
              </div>

              {/* Event Details */}
              <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
                <div className="flex justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800">EventName</h2>{/* {selectedEvent.eventName} */}
                    <p className="text-gray-600">Organizer</p>
                    <div className="mt-2 text-sm text-gray-500">
                      <p>Event ID: EventId</p>
                      <div className="flex items-center mt-1">
                        <Clock className="h-4 w-4 mr-1" />
                        <span>Date</span>
                        <span className="mx-2">•</span>
                        <MapPin className="h-4 w-4 mr-1" />
                        <span>Location</span>
                      </div>
                    </div>
                  </div>
                  <div className="w-16 h-16 bg-gray-200 rounded-md flex items-center justify-center">
                    {/* Placeholder for logo */}
                  </div>
                </div>

                <div className="mt-6">
                  <p className="text-gray-700">Upload the synopsys</p>
                </div>
                <button className="text-sm text-white bg-blue-500 hover:bg-blue-600 px-3 py-1 rounded-md">
                  Uplaod Pdf
                </button>
                <div className="mt-4">
                  <button className="text-blue-500 text-sm font-medium">View full details</button>
                </div>
              </div>
              {/* Team Participation Info */}
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Team Participation</h3>

                {/* {participationData.filter(p => p.eventID === selectedEvent._id).map((team, index) => ( */}
                <div className="mb-6 border-b pb-4"> {/*key={team._id}*/}
                  <p className="text-gray-700"><span className="font-medium">Team Leader:</span>TeamName </p>{/*%{team.name}%*/}
                  <p className="text-gray-700 mt-2 font-medium">Participants:</p>
                  <ul className="list-disc ml-6 text-gray-600">
                    {/* <li>{team.name} (Team Leader)</li>
        {team.teamMembers.map((member, idx) => (
          <li key={idx}>{member.name}</li>
        ))} */}
                    <li>TeamMemeber 1</li>
                    <li>TeamMemeber 1</li>
                    <li>TeamMemeber 1</li>
                  </ul>
                </div>
                {/* // ))} */}

                {/* Fallback if no teams found */}
                {/* {participationData.filter(p => p.eventID === selectedEvent._id).length === 0 && (
    <p className="text-gray-500">No participation data available for this event.</p>
  )} */}
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Notifications</h3>

                <div className="mb-6 border-b pb-4 relative">
                  {/* X Button */}
                  <button className="absolute top-2 right-2 text-gray-400 hover:text-red-500 transition-colors">
                    ✕
                  </button>

                  <p className="text-gray-700">
                    <span className="font-medium">Title:</span> Notification Title
                  </p>
                  <p className="text-gray-600 mt-1">
                    This is the notification message with some relevant information for the user.
                  </p>
                  <p className="text-xs text-gray-400 mt-2">Date: 2025-10-01</p>

                  {/* Action Button */}
                  <div className="mt-3">
                    <button className="text-sm text-white bg-blue-500 hover:bg-blue-600 px-3 py-1 rounded-md">
                      Take Action
                    </button>
                  </div>
                </div>

                <div className="mb-6 border-b pb-4 relative">
                  <button className="absolute top-2 right-2 text-gray-400 hover:text-red-500 transition-colors">
                    ✕
                  </button>

                  <p className="text-gray-700">
                    <span className="font-medium">Title:</span> Final Reminder
                  </p>
                  <p className="text-gray-600 mt-1">
                    Reminder to check in before the event day. Make sure to complete all requirements.
                  </p>
                  <p className="text-xs text-gray-400 mt-2">Date: 2025-09-25</p>

                  <div className="mt-3">
                    <button className="text-sm text-white bg-blue-500 hover:bg-blue-600 px-3 py-1 rounded-md">
                      View Details
                    </button>
                  </div>
                </div>
              </div>

            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventStatus;
