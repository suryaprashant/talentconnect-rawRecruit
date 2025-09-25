import React, { useState, useEffect } from 'react';
import EventCard from './EventCard';
import SearchBar from './SearchBar';
import { getWorkShops, getCaseStudy, getHackathons } from '@/lib/User_AxiosInstance';
import { useParams } from 'react-router-dom';
// import { Events } from '@/constants/hackthonData';

const EventList = ({ event_name }) => {
  const [events, setEvents] = useState();
  const [filteredEvents, setFilteredEvents] = useState();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('');

  const loadEvents = async () => {
    try {
      // console.log(event_name,"is event name");

      let response;
      switch (event_name) {
        case 'hackathon':
          response = await getHackathons();
          // console.log("hackathon",response);
          break;
        case 'workshop':
          response = await getWorkShops();
          // console.log("WorkShop");
          break;
        case 'casestudy':
          response = await getCaseStudy();
          break;
        default:
          response = await getHackathons();
          break;
      }
console.log("Full response:", response);
      console.log("Response data:", response.data);
      console.log("Events data:", response.data.data);

      if (response.data && response.data.data) {
        setEvents(response.data.data);
        setFilteredEvents(response.data.data);
      } else {
        console.log("No events data found in response");
        setEvents([]);
        setFilteredEvents([]);
      }
    } catch (error) {
      console.log("Error fetching events: ", error);
      setEvents([]);
      setFilteredEvents([]);
    }
  }

  useEffect(() => {
    loadEvents();
  }, [event_name]);

  useEffect(() => {
    if (!events) return;

    let filtered = events.filter(event =>
      event.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
  }, [searchTerm, sortBy, events]);

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleSort = (option) => {
    setSortBy(option);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-2 capitalize">{event_name}</h1>
      <p className="text-gray-600 mb-6">Discover upcoming {event_name} and innovation challenges.</p>

      <SearchBar onSearch={handleSearch} onSort={handleSort} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredEvents?.length > 0 ? (
          filteredEvents.map(event => (
            <EventCard key={event._id} event={event} event_name={event_name} />
          ))
        ) : (
          <div className="col-span-full text-center py-8">
            <p className="text-gray-500 text-lg">No {event_name} events found.</p>
            <p className="text-gray-400 text-sm mt-2">Check the browser console for more details.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventList;