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
      console.log(response.data.data[0]);

      setSelectedEvent(response.data.data[0]);
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
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm px-6 py-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Event Status</h1>
          <div className="flex space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search events"
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            </div>
            <select
              className="pl-3 pr-8 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="newest">Sort by: Newest</option>
              <option value="oldest">Sort by: Oldest</option>
              <option value="organizer">Sort by: Organizer</option>
            </select>
          </div>
        </div>
        <p className="text-sm text-gray-500 mt-2">Track the status of events you’ve registered for.</p>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-72 bg-white border-r border-gray-200 overflow-y-auto">
          {events?.length > 0 ? (
            events.map((event) => (
              <div
                key={event._id}
                onClick={() => setSelectedEvent(event)}
                className={`p-4 cursor-pointer hover:bg-blue-50 border-b ${selectedEvent?._id === event._id ? 'bg-blue-100' : ''
                  }`}
              >
                <h3 className="text-md font-semibold text-gray-800">{event.title}</h3>
                <p className="text-sm text-gray-600">{event.participant.eventName}</p>
                <div className="mt-2 flex items-center text-xs text-gray-500">
                  <Clock className="h-3 w-3 mr-1" />
                  {new Date(event.startDate).toLocaleDateString()}
                  <span className="mx-2">•</span>
                  <MapPin className="h-3 w-3 mr-1" />
                  {event.venue}
                </div>
              </div>
            ))
          ) : (
            <div className="text-red-500 p-4">No Events found!</div>
          )}
        </aside>

        {/* Main Panel */}
        <main className="flex-1 overflow-y-auto p-6">
          {selectedEvent && (
            <>
              {/* Status Progress Bar */}
              <div className="mb-8 relative">
                <div className="flex justify-between mb-2">
                  {statusSteps.map((step, idx) => {
                    const currentIdx = getStatusIndex("Application sent");
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
              {/* Event Card */}
              <section className="bg-white p-6 rounded-lg shadow mb-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-2xl font-semibold text-gray-800">{selectedEvent.title}</h2>
                    <p className="text-gray-600">{selectedEvent.subTitle}</p>
                    <div className="mt-3 text-sm text-gray-500 space-y-1">
                      <p>Event ID: {selectedEvent._id}</p>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        {new Date(selectedEvent.startDate).toLocaleDateString()} - {new Date(selectedEvent.endDate).toLocaleDateString()}
                        <span className="mx-2">•</span>
                        <MapPin className="h-4 w-4" />
                        {selectedEvent.location}
                      </div>
                    </div>
                  </div>
                  <div className="w-16 h-16 bg-gray-200 rounded-md flex items-center justify-center">
                    {/* Logo Placeholder */}
                  </div>
                </div>

                {/* Event Rounds */}
                <div className="mt-8">
                  <h3 className="text-lg font-semibold mb-4">Event Rounds</h3>
                  <div className="border-l-2 border-gray-200 pl-6 relative">
                    {selectedEvent.rounds?.map((round, index) => (
                      <div key={index} className="mb-8 relative">
                        <div
                          className="absolute w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center -left-10 text-sm font-semibold"
                          style={{ top: '-4px' }}
                        >
                          {round.roundNumber}
                        </div>
                        <div className="text-sm text-gray-500 mb-1">
                          {new Date(round.startDate).toLocaleDateString()} - {new Date(round.endDate).toLocaleDateString()}
                        </div>
                        <h4 className="text-md font-semibold text-gray-800">{round.roundName}</h4>
                        <p className="text-gray-600 mb-2">{round.description}</p>
                        {/* Conditional Input */}
                        {round.userInput === 'link' ? (
                          <div>
                            <input
                              type="url"
                              placeholder="Enter link"
                              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                            <button className='bg-blue'> submit </button>
                          </div>
                        ) : (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Upload //round.userInput.toUpperCase()// file:
                            </label>
                            <input
                              type="file"
                              accept={
                                round.userInput === 'doc'
                                  ? '.doc,.docx'
                                  : round.userInput === 'pdf'
                                    ? '.pdf'
                                    : round.userInput === 'ppt'
                                      ? '.ppt,.pptx'
                                      : '*'
                              }
                              className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:border-0 file:rounded-md file:bg-blue-500 file:text-white hover:file:bg-blue-600"
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                {/* Horizontal Split: Participation & Notifications */}
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Team Participation */}
                  <div className="bg-white p-2 rounded-lg w-full md:w-1/2">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Participation Details</h3>
                    <p className="text-gray-700">
                      <span className="font-medium">Team Name:</span> {selectedEvent.participant.projectTitle}
                    </p>
                    <p className="text-gray-700 mt-2 font-medium">Participants:</p>
                    <ul className="list-disc ml-6 text-gray-600">
                      <li>{selectedEvent.participant.name} (Team Leader)</li>
                      {selectedEvent.participant.teamMembers.map((member, idx) => (
                        <li key={idx}>{member.name}</li>
                      ))}
                    </ul>
                    <button className="mt-4 text-sm text-white bg-green-500 hover:bg-green-600 px-4 py-2 rounded-md">
                      Accept Invitation
                    </button>
                  </div>

                  {/* Notifications */}
                  <div className="bg-white p-2 rounded-lg w-full md:w-1/2">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Notifications</h3>
                    {[1, 2].map((_, idx) => (
                      <div
                        key={idx}
                        className="relative w-full max-w-md p-4 mb-4 text-gray-500 bg-white rounded-lg shadow-sm border dark:bg-gray-800 dark:text-gray-400"
                      >
                        <div className="flex items-start">
                          {/* Icon */}
                          <div className="inline-flex items-center justify-center w-8 h-8 text-blue-500 bg-blue-100 rounded-lg dark:text-blue-300 dark:bg-blue-900">
                            <svg
                              className="w-4 h-4"
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
                            <span className="mb-1 block text-sm font-semibold text-gray-900 dark:text-white">
                              {idx === 0 ? 'Notification Title' : 'Final Reminder'}
                            </span>
                            <div className="mb-2 text-sm font-normal">
                              {idx === 0
                                ? 'This is the notification message with some relevant information for the user.'
                                : 'Reminder to check in before the event day. Make sure to complete all requirements.'}
                            </div>
                            <p className="text-xs text-gray-400">Date: {idx === 0 ? '2025-10-01' : '2025-09-25'}</p>

                            {/* Buttons */}
                            <div className="grid grid-cols-2 gap-2 mt-3">
                              <button className="inline-flex justify-center w-full px-2 py-1.5 text-xs font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300 dark:bg-blue-500 dark:hover:bg-blue-600 dark:focus:ring-blue-800">
                                {idx === 0 ? 'Take Action' : 'View Details'}
                              </button>
                              <button className="inline-flex justify-center w-full px-2 py-1.5 text-xs font-medium text-gray-900 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:bg-gray-600 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-700">
                                Dismiss
                              </button>
                            </div>
                          </div>

                          {/* Close Button */}
                          <button
                            type="button"
                            className="absolute top-2 right-2 text-gray-400 hover:text-gray-900 dark:hover:text-white focus:outline-none"
                            aria-label="Close"
                            onClick={() => console.log('Dismissed')} // Optional: replace with dismiss logic
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
                  <button className="text-blue-600 font-medium hover:underline">View full details</button>
                </div>
              </section>


            </>
          )}
        </main>
      </div>
    </div>
  );

};

export default EventStatus;
