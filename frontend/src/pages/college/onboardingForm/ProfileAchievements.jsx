// pages/ProfileAchievements.jsx
import { useState } from 'react';

export default function ProfileAchievements({ formData, updateFormData, nextStep, prevStep }) {
  const [workshop, setWorkshop] = useState({
    name: '',
    startDate: '',
    endDate: '',
    executor: ''
  });

  const [volunteering, setVolunteering] = useState({
    name: '',
    startDate: '',
    endDate: '',
    executor: ''
  });

  const [award, setAward] = useState({
    name: '',
    startDate: '',
    endDate: '',
    organization: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    updateFormData(name, value);
  };

  const handleWorkshopChange = (e) => {
    const { name, value } = e.target;
    setWorkshop({
      ...workshop,
      [name]: value
    });
  };

  const addWorkshop = () => {
    updateFormData('workshops', [...formData.workshops, workshop]);
    setWorkshop({
      name: '',
      startDate: '',
      endDate: '',
      executor: ''
    });
  };

  const handleVolunteeringChange = (e) => {
    const { name, value } = e.target;
    setVolunteering({
      ...volunteering,
      [name]: value
    });
  };

  const addVolunteering = () => {
    updateFormData('volunteering', [...formData.volunteering, volunteering]);
    setVolunteering({
      name: '',
      startDate: '',
      endDate: '',
      executor: ''
    });
  };

  const handleAwardChange = (e) => {
    const { name, value } = e.target;
    setAward({
      ...award,
      [name]: value
    });
  };

  const addAward = () => {
    updateFormData('awards', [...formData.awards, award]);
    setAward({
      name: '',
      startDate: '',
      endDate: '',
      organization: ''
    });
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">College Profile & Achievements</h1>
      <p className="mb-6">Showcase your institution's key highlights, achievements, and online presence!</p>
      
      <div className="space-y-8">
        <div>
          <label className="block font-medium mb-1">College Website *</label>
          <input
            type="url"
            name="collegeWebsite"
            value={formData.collegeWebsite}
            onChange={handleChange}
            placeholder="http://www.nature.io"
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>
        
        <div>
          <label className="block font-medium mb-1">LinkedIn Profile *</label>
          <input
            type="url"
            name="unicefinProfile"
            value={formData.unicefinProfile}
            onChange={handleChange}
            placeholder="http://www.nature.io"
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>
        
        <div className=" border-gray-200 pt-8">
          <h3 className="font-bold  mb-4 ">Workshops & Training Programs</h3>
          <div className="space-y-4">
            <div>
              <label className="block font-medium mb-1">Workshop Name *</label>
              <input
                type="text"
                name="name"
                value={workshop.name}
                onChange={handleWorkshopChange}
                placeholder="Placeholder"
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-medium mb-1">Start Date</label>
                <input
                  type="date"
                  name="startDate"
                  value={workshop.startDate}
                  onChange={handleWorkshopChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block font-medium mb-1">End Date</label>
                <input
                  type="date"
                  name="endDate"
                  value={workshop.endDate}
                  onChange={handleWorkshopChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>
            
            <div>
              <label className="block font-medium mb-1">Executor</label>
              <input
                type="text"
                name="executor"
                value={workshop.executor}
                onChange={handleWorkshopChange}
                placeholder="Placeholder"
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            
            <button
              onClick={addWorkshop}
              className="px-4 py-2 bg-black flex justify-end text-white rounded-md hover:bg-blue-700"
            >
              Add workshop
            </button>
          </div>
        </div>
        
        <div className=" border-gray-200 pt-8">
          <h3 className="font-bold mb-4">Volunteering & Community Engagement</h3>
          <div className="space-y-4">
            <div>
              <label className="block font-medium mb-1">Event Name *</label>
              <input
                type="text"
                name="name"
                value={volunteering.name}
                onChange={handleVolunteeringChange}
                placeholder="Placeholder"
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-medium mb-1">Start Date</label>
                <input
                  type="date"
                  name="startDate"
                  value={volunteering.startDate}
                  onChange={handleVolunteeringChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block font-medium mb-1">End Date</label>
                <input
                  type="date"
                  name="endDate"
                  value={volunteering.endDate}
                  onChange={handleVolunteeringChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>
            
            <div>
              <label className="block font-medium mb-1">Executor</label>
              <input
                type="text"
                name="executor"
                value={volunteering.executor}
                onChange={handleVolunteeringChange}
                placeholder="Placeholder"
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            
            <button
              onClick={addVolunteering}
              className="px-4 py-2 bg-black text-white rounded-md hover:bg-blue-700"
            >
              Add volunteering experience
            </button>
          </div>
        </div>
        
        <div className=" border-gray-200 pt-8">
          <h3 className="font-bold mb-4">Awards & Recognitions</h3>
          <div className="space-y-4">
            <div>
              <label className="block font-medium mb-1">Award Name *</label>
              <input
                type="text"
                name="name"
                value={award.name}
                onChange={handleAwardChange}
                placeholder="Placeholder"
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-medium mb-1">Start Date</label>
                <input
                  type="date"
                  name="startDate"
                  value={award.startDate}
                  onChange={handleAwardChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block font-medium mb-1">End Date</label>
                <input
                  type="date"
                  name="endDate"
                  value={award.endDate}
                  onChange={handleAwardChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>
            
            <div>
              <label className="block font-medium mb-1">Awarding Organizations *</label>
              <input
                type="text"
                name="organization"
                value={award.organization}
                onChange={handleAwardChange}
                placeholder="Placeholder"
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            
            <button
              onClick={addAward}
              className="px-4 py-2 bg-black text-white rounded-md hover:bg-blue-700"
            >
              Add award
            </button>
          </div>
        </div>
      </div>
      
      <div className="flex justify-between mt-8">
        <button 
          onClick={prevStep}
          className="px-6 py-2 border border-gray-300 rounded-md"
        >
          Back
        </button>
        <button 
          onClick={nextStep}
          className="px-6 py-2 bg-black text-white rounded-md hover:bg-blue-700"
        >
          Next
        </button>
      </div>
    </div>
  );
}