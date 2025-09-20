import React, { useState, useEffect } from 'react';
import EventCard from './EventCard';
import SearchBar from './SearchBar';
import { getEvents } from '@/lib/User_AxiosInstance';
import { useParams} from 'react-router-dom';
// import { Events } from '@/constants/hackthonData';

const EventList = () => {
  const { event_name } = useParams();
  const [events, setEvents] = useState();
  const [filteredEvents, setFilteredEvents] = useState();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('');

  const loadEvents = async () => {
    try {
      const response = await getEvents();
      // console.log("loaded", response);
      setEvents(response.data.data);
    } catch (error) {
      console.log("Error: ", error);
    }
  }
  useEffect(() => {
    loadEvents();
  }, []);

  useEffect(() => {
    // Filter events based on search term
    let filtered = events?.filter(event =>
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Sort events based on sort option
    if (sortBy === 'date') {
      filtered = [...filtered].sort((a, b) => new Date(a.dateTime.split(' - ')[0]) - new Date(b.dateTime.split(' - ')[0]));
    } else if (sortBy === 'popularity') {
      filtered = [...filtered].sort((a, b) => b.registeredUsers - a.registeredUsers);
    } else if (sortBy === 'prize') {
      // This is simplified; in a real app you'd need more complex logic for prize values
      filtered = [...filtered].sort((a, b) => (b.prizes?.length || 0) - (a.prizes?.length || 0));
    }

    setFilteredEvents(filtered);
  }, [searchTerm, sortBy]);

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
        {events?.map(event => (
          <EventCard key={event._id} event={event} />
        ))}
      </div>
    </div>
  );
};

export default EventList;