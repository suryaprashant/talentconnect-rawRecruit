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
console.log(response.data.data);

      setEvents(response.data.data);
      setFilteredEvents(response.data.data);
    } catch (error) {
      console.log("Error: ", error);
    }
  }

  useEffect(() => {
    loadEvents();
  }, []);

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
      <h1 className="text-2xl font-bold mb-2">{event_name}</h1>
      <p className="text-gray-600 mb-6">Discover upcoming {event_name} and innovation challenges.</p>

      <SearchBar onSearch={handleSearch} onSort={handleSort} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredEvents?.map(event => (
          <EventCard key={event._id} event={event} event_name={event_name} />
        ))}
      </div>
    </div>
  );
};

export default EventList;