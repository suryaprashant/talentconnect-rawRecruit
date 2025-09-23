import React from 'react';
import HackathonList from '@/components/student/events/hackathon/HackthonList';
import EventList from '@/components/student/events/EventList';
const Hackathon = () => {
  return (
    <div className='bg-white'>
      <EventList event_name="hackathon" />
    </div>
  );
};

export default Hackathon;
