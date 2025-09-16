import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const EventRegistration = () => {
  const { event_ID } = useParams(); // 👈 Get event ID from URL
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    eventID: '', // Will be set via useEffect
    name: '',
    email: '',
    projectTitle: '',
    teamMembers: [{ name: '', email: '' }],
  });

  useEffect(() => {
    // Set eventID from URL into form state
    if (event_ID) {
      setFormData((prev) => ({ ...prev, eventID: event_ID }));
    }
  }, [event_ID]);

  const handleChange = (e, index = null) => {
    const { name, value } = e.target;
    if (index !== null) {
      const updatedTeam = [...formData.teamMembers];
      updatedTeam[index][name] = value;
      setFormData({ ...formData, teamMembers: updatedTeam });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const addTeamMember = () => {
    setFormData({
      ...formData,
      teamMembers: [...formData.teamMembers, { name: '', email: '' }],
    });
  };

  const removeTeamMember = (index) => {
    const updatedTeam = [...formData.teamMembers];
    updatedTeam.splice(index, 1);
    setFormData({ ...formData, teamMembers: updatedTeam });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log(formData);
      const response = await axios.post(`${import.meta.env.VITE_Backend_URL}/eventParticipation/register`, formData);
      console.log(response, "is the response");

      if (response.status === 200 || response.status === 201) {
        alert("Request submitted successfully!");
        setTimeout(() => {
          navigate(`/${localStorage.getItem('selectedRole')}-dashboard/hackathon/${event_ID}`);
        }, 1);
      }
    } catch (err) {
      alert("Failed to submit request: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-3xl mx-auto bg-white shadow-md rounded-lg p-8">
        <h1 className="text-3xl font-semibold text-center text-gray-800 mb-6">
          Hackathon Registration
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Show Event ID */}
          <div>
            {/* <label className="block mb-1 font-medium text-gray-700">Event ID</label> */}
            <input
              type="text"
              name="eventID"
              value={formData.eventID}
              readOnly
              hidden
              className="w-full px-4 py-2 border rounded-md bg-gray-100 cursor-not-allowed"
            />
          </div>

          {/* Main Participant Info */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 font-medium text-gray-700">Your Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium text-gray-700">Your Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
          </div>

          {/* Project Title */}
          <div>
            <label className="block mb-1 font-medium text-gray-700">Project Title/Team Name</label>
            <input
              type="text"
              name="projectTitle"
              value={formData.projectTitle}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Team Members */}
          <div>
            <label className="block mb-2 font-semibold text-gray-800">Team Members</label>
            {formData.teamMembers.map((member, index) => (
              <div key={index} className="grid md:grid-cols-2 gap-4 mb-4">
                <input
                  type="email"
                  name="email"
                  value={member.email}
                  onChange={(e) => handleChange(e, index)}
                  placeholder={`Member ${index + 1} Email`}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none"
                />
                <div className="flex gap-2">
                  <input
                    type="text"
                    name="name"
                    value={member.name}
                    onChange={(e) => handleChange(e, index)}
                    placeholder={`Member ${index + 1} Name`}
                    className="w-full px-4 py-2 border rounded-md focus:outline-none"
                  />
                  {formData.teamMembers.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeTeamMember(index)}
                      className="text-red-500 font-bold"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={addTeamMember}
              className="mt-2 text-blue-600 hover:underline"
            >
              + Add Another Member
            </button>
          </div>

          {/* Submit */}
          <div className="text-center">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md transition duration-200"
            >
              Submit Registration
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventRegistration;
