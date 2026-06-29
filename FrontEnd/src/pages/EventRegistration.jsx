import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../lib/axiosInstance';
import { getEventDetail } from '@/lib/User_AxiosInstance';

// Dummy participants for suggestion filtering (you can replace with live data)
const dummyParticipants = [
  { teamMemberId: "68c96e21ae6c1d433000a001", name: "Alice Smith", email: "alice@example.com" },
  { teamMemberId: "68c96e21ae6c1d433000a002", name: "Bob Johnson", email: "bob@example.com" },
  { teamMemberId: "68c96e21ae6c1d433000a003", name: "Charlie Lee", email: "charlie@example.com" },
  { teamMemberId: "68c96e21ae6c1d433000a004", name: "Diana Prince", email: "diana@example.com" },
];

const EventRegistration = () => {
  const { event_ID, event_name } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [formData, setFormData] = useState({
    teamLeaderId: '',
    eventID: '',
    eventName:'',
    name: '',
    email: '',
    projectTitle: '',
    teamMembers: [{ teamMemberId: '', name: '', email: '' }],
  });

  const [teamSearchResults, setTeamSearchResults] = useState([]);
  const [teamSuggestionIndex, setTeamSuggestionIndex] = useState(null);

  // ✅ Fetch event details by ID
  const getEvent = async () => {
    try {
      const response = await getEventDetail(event_ID,event_name);
      setEvent(response?.data?.data);
    } catch (error) {
      console.error("Failed to fetch event: ", error);
    }
  };

  useEffect(() => {
    if (event_ID) {
      setFormData((prev) => ({ ...prev, 
        eventID: event_ID,
        eventName: event_name 
      }));
    }
  }, [event_ID,event_name]);

  const handleChange = (e, index = null) => {
    const { name, value } = e.target;

    if (index !== null) {
      const updatedTeam = [...formData.teamMembers];
      updatedTeam[index][name] = value;

      // Auto-suggest + auto-fill from dummyParticipants
      if (name === "email") {
        const matches = dummyParticipants.filter((p) =>
          p.email.toLowerCase().includes(value.toLowerCase())
        );
        setTeamSearchResults(matches);
        setTeamSuggestionIndex(index);

        const exact = matches.find((p) => p.email.toLowerCase() === value.toLowerCase());
        if (exact) {
          updatedTeam[index] = {
            teamMemberId: exact.teamMemberId,
            name: exact.name,
            email: exact.email,
          };
          setTeamSearchResults([]);
          setTeamSuggestionIndex(null);
        } else {
          updatedTeam[index].teamMemberId = '';
        }
      }

      setFormData({ ...formData, teamMembers: updatedTeam });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // ✅ Select a team member from suggestion dropdown
  const selectTeamMemberSuggestion = (member, index) => {
    const updatedTeam = [...formData.teamMembers];
    updatedTeam[index] = {
      teamMemberId: member.teamMemberId,
      name: member.name,
      email: member.email,
    };
    setFormData({ ...formData, teamMembers: updatedTeam });
    setTeamSearchResults([]);
    setTeamSuggestionIndex(null);
  };

  // ✅ Check if duplicate emails exist
  const hasDuplicateEmails = () => {
    const emails = formData.teamMembers.map((m) => m.email.toLowerCase());
    const emailSet = new Set(emails);
    return emails.length !== emailSet.size;
  };

  // ✅ Add team member if max limit not reached
  const addTeamMember = () => {
    if (formData.teamMembers.length < (event?.maxTeamMembers || 2)) {
      setFormData({
        ...formData,
        teamMembers: [...formData.teamMembers, { teamMemberId: '', name: '', email: '' }],
      });
    }
  };

  // ✅ Remove team member
  const removeTeamMember = (index) => {
    const updatedTeam = [...formData.teamMembers];
    updatedTeam.splice(index, 1);
    setFormData({ ...formData, teamMembers: updatedTeam });
  };
  // ✅ Form submission with validation
  const handleSubmit = async (e) => {
    e.preventDefault();

    const minTeam = event?.minTeamMembers || 0;
    const maxTeam = event?.maxTeamMembers || 5;

    // Validation checks
    if (hasDuplicateEmails()) {
      alert("Team members cannot have duplicate emails.");
      return;
    }

    if (formData.teamMembers.length < minTeam) {
      alert(`At least ${minTeam} team members are required.`);
      return;
    }

    if (formData.teamMembers.length > maxTeam) {
      alert(`You can have at most ${maxTeam} team members.`);
      return;
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_Backend_URL}/eventParticipation/register`,
        formData
      );

      if (response.status === 200 || response.status === 201) {
        alert("Registration successful!");
        setTimeout(() => {
          navigate(`/${localStorage.getItem('selectedRole')}-events/${event_name}/${event_ID}`);
        }, 500);
      }
    } catch (err) {
      alert("Registration failed: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-3xl mx-auto bg-white shadow-md rounded-lg p-8">
        <h1 className="text-3xl font-semibold text-center text-gray-800 mb-6">
          {event?.title || 'Hackathon Registration'}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
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
            <label className="block mb-1 font-medium text-gray-700">Project Title / Team Name</label>
            <input
              type="text"
              name="projectTitle"
              value={formData.projectTitle}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Team Members */}
          {event?.participationType !== 'Individual' && (
            <div>
              <label className="block mb-2 font-semibold text-gray-800">Team Members</label>

              {formData.teamMembers.map((member, index) => (
                <div key={index} className="grid md:grid-cols-2 gap-4 mb-4 relative">
                  {/* Email with suggestions */}
                  <div className="relative">
                    <input
                      type="email"
                      name="email"
                      value={member.email}
                      onChange={(e) => handleChange(e, index)}
                      placeholder={`Member ${index + 1} Email`}
                      className="w-full px-4 py-2 border rounded-md focus:outline-none"
                      autoComplete="off"
                      required
                    />
                    {teamSuggestionIndex === index && teamSearchResults.length > 0 && (
                      <ul className="absolute z-10 bg-white border rounded-md w-full mt-1 shadow-md max-h-40 overflow-y-auto">
                        {teamSearchResults.map((item) => (
                          <li
                            key={item.teamMemberId}
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                            onClick={() => selectTeamMemberSuggestion(item, index)}
                          >
                            {item.email} — {item.name}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  {/* Name and Remove button */}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      name="name"
                      value={member.name}
                      onChange={(e) => handleChange(e, index)}
                      placeholder={`Member ${index + 1} Name`}
                      className="w-full px-4 py-2 border rounded-md focus:outline-none"
                      required
                    />
                    {formData.teamMembers.length > (event?.minTeamMembers || 1) && (
                      <button
                        type="button"
                        onClick={() => removeTeamMember(index)}
                        className="text-red-500 font-bold"
                        title="Remove Member"
                      >
                        ✕
                      </button>
                    )}
                  </div>

                  <input type="hidden" name="teamMemberId" value={member.teamMemberId || ''} />
                </div>
              ))}

              {/* Validation display for duplicates */}
              {hasDuplicateEmails() && (
                <p className="text-red-600 text-sm mb-2">
                  Duplicate team member emails detected.
                </p>
              )}

              {/* Add Member Button */}
              <button
                type="button"
                onClick={addTeamMember}
                disabled={formData.teamMembers.length >= (event?.maxTeamMembers || 5)}
                className={`mt-2 text-blue-600 hover:underline ${formData.teamMembers.length >= (event?.maxTeamMembers || 5)
                  ? 'opacity-50 cursor-not-allowed'
                  : ''
                  }`}
              >
                + Add Another Member
              </button>
            </div>
          )}


          {/* Submit Button */}
          <div className="text-center">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-[#143694] text-white font-medium py-2 px-6 rounded-md transition duration-200"
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
