import { useEffect, useState } from 'react';
import { getHackathonRegistrations, confirmHackathonRegistration, rejectHackathonRegistration } from '@/lib/Company_AxiosInstance';
import toast from 'react-hot-toast';

const HackathonApplicantDetails = ({ hackathon, onClose }) => {
  const [registrations, setRegistrations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchRegistrations = async () => {
    setIsLoading(true);
    try {
      const response = await getHackathonRegistrations(hackathon._id);
      if (response?.data?.success) {
        setRegistrations(response.data.data);
      } else {
        toast.error('Failed to fetch registrations');
      }
    } catch (error) {
      console.error('Error fetching registrations:', error);
      toast.error('Something went wrong!');
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmRegistration = async (registrationId) => {
    try {
      const response = await confirmHackathonRegistration(registrationId);
      if (response?.data?.success) {
        toast.success('Registration confirmed successfully!');
        fetchRegistrations(); // Refresh the list
      } else {
        toast.error(response?.data?.message || 'Failed to confirm registration');
      }
    } catch (error) {
      console.error('Error confirming registration:', error);
      toast.error('Something went wrong!');
    }
  };

  const handleRejectRegistration = async (registrationId, reason = '') => {
    try {
      const response = await rejectHackathonRegistration(registrationId, { reason });
      if (response?.data?.success) {
        toast.success('Registration rejected successfully!');
        fetchRegistrations(); // Refresh the list
      } else {
        toast.error(response?.data?.message || 'Failed to reject registration');
      }
    } catch (error) {
      console.error('Error rejecting registration:', error);
      toast.error('Something went wrong!');
    }
  };

  useEffect(() => {
    fetchRegistrations();
  }, [hackathon._id]);

  const filteredRegistrations = registrations.filter(registration => {
    const matchesFilter = filter === 'all' || registration.registrationStatus.toLowerCase() === filter;
    const matchesSearch = registration.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         registration.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (registration.projectTitle && registration.projectTitle.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'Confirmed': return 'text-green-600 bg-green-100';
      case 'Rejected': return 'text-red-600 bg-red-100';
      case 'Pending': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <div className="bg-blue-600 text-white p-6">
        <button 
          onClick={onClose}
          className="mb-4 flex items-center text-blue-100 hover:text-white"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
          </svg>
          Back to Hackathons
        </button>
        <h1 className="text-3xl font-bold">{hackathon.title}</h1>
        <p className="text-blue-100 mt-2">Manage registrations for this hackathon</p>
      </div>

      <div className="flex">
        {/* Filters Sidebar */}
        <div className="w-1/4 p-6 border-r border-gray-200 bg-gray-50">
          <div className="mb-6">
            <h2 className="text-xl font-bold mb-4">Filters</h2>
            
            {/* Search */}
            <div className="relative mb-6">
              <input 
                type="text" 
                placeholder="Search by name, email, or project" 
                className="w-full pl-10 pr-4 py-2 border rounded-md"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>

            {/* Status Filter */}
            <div className="mb-6">
              <h3 className="font-bold mb-2">Registration Status</h3>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input 
                    type="radio" 
                    name="filter" 
                    value="all"
                    checked={filter === 'all'}
                    onChange={(e) => setFilter(e.target.value)}
                    className="mr-2" 
                  />
                  All Registrations
                </label>
                <label className="flex items-center">
                  <input 
                    type="radio" 
                    name="filter" 
                    value="pending"
                    checked={filter === 'pending'}
                    onChange={(e) => setFilter(e.target.value)}
                    className="mr-2" 
                  />
                  Pending
                </label>
                <label className="flex items-center">
                  <input 
                    type="radio" 
                    name="filter" 
                    value="confirmed"
                    checked={filter === 'confirmed'}
                    onChange={(e) => setFilter(e.target.value)}
                    className="mr-2" 
                  />
                  Confirmed
                </label>
                <label className="flex items-center">
                  <input 
                    type="radio" 
                    name="filter" 
                    value="rejected"
                    checked={filter === 'rejected'}
                    onChange={(e) => setFilter(e.target.value)}
                    className="mr-2" 
                  />
                  Rejected
                </label>
              </div>
            </div>

            <div className="text-sm text-gray-500">
              Showing {filteredRegistrations.length} of {registrations.length} registrations
            </div>
          </div>
        </div>

        {/* Registrations List */}
        <div className="flex-1 p-8">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#1e4ed8]"></div>
            </div>
          ) : filteredRegistrations.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-500 text-lg">No registrations found</div>
              <p className="text-gray-400 mt-2">
                {filter === 'all' ? 'No one has registered for this hackathon yet.' : `No ${filter} registrations found.`}
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredRegistrations.map((registration) => (
                <div key={registration._id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  {/* Header Section */}
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center">
                      <div className="w-16 h-16 bg-gray-200 rounded-full mr-4 flex items-center justify-center">
                        <span className="text-xl font-bold text-gray-600">
                          {registration.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900">{registration.name}</h3>
                        <p className="text-gray-600">{registration.email}</p>
                        {registration.projectTitle && (
                          <p className="text-sm text-blue-600 font-medium mt-1">
                            Project: {registration.projectTitle}
                          </p>
                        )}
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(registration.registrationStatus)}`}>
                      {registration.registrationStatus}
                    </span>
                  </div>

                  {/* User Details */}
                  {registration.userDetails && (
                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-6">
                      <div className="flex items-center">
                        <span className="font-bold mr-2">Phone:</span> 
                        <span>{registration.userDetails.phone || 'Not provided'}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="font-bold mr-2">Location:</span> 
                        <span>{registration.userDetails.locations || 'Not provided'}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="font-bold mr-2">Education:</span> 
                        <span>{registration.userDetails.degree} ({registration.userDetails.specialization})</span>
                      </div>
                      <div className="flex items-center">
                        <span className="font-bold mr-2">Industry:</span> 
                        <span>{registration.userDetails.industry || 'Not specified'}</span>
                      </div>
                    </div>
                  )}

                  {/* Team Members */}
                  {registration.teamMembers && registration.teamMembers.length > 0 && (
                    <div className="mb-6">
                      <h4 className="font-bold text-gray-700 mb-2">Team Members:</h4>
                      <div className="space-y-2">
                        {registration.teamMembers.map((member, index) => (
                          <div key={index} className="flex items-center text-sm text-gray-600">
                            <span className="font-medium">{member.name}</span>
                            <span className="mx-2">-</span>
                            <span>{member.email}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Skills */}
                  {registration.userDetails?.skills && registration.userDetails.skills.length > 0 && (
                    <div className="mb-6">
                      <h4 className="font-bold text-gray-700 mb-2">Skills:</h4>
                      <div className="flex flex-wrap gap-2">
                        {registration.userDetails.skills.map((skill, index) => (
                          <span key={index} className="px-3 py-1 text-sm border rounded-full bg-gray-100 text-gray-700">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Links */}
                  {registration.userDetails && (
                    <div className="mb-6">
                      <h4 className="font-bold text-gray-700 mb-2">Links:</h4>
                      <div className="flex space-x-4">
                        {registration.userDetails.linkedIn && (
                          <a href={registration.userDetails.linkedIn} target="_blank" rel="noopener noreferrer" 
                             className="text-blue-600 hover:underline text-sm">LinkedIn</a>
                        )}
                        {registration.userDetails.github && (
                          <a href={registration.userDetails.github} target="_blank" rel="noopener noreferrer" 
                             className="text-blue-600 hover:underline text-sm">GitHub</a>
                        )}
                        {registration.userDetails.portfolio && (
                          <a href={registration.userDetails.portfolio} target="_blank" rel="noopener noreferrer" 
                             className="text-blue-600 hover:underline text-sm">Portfolio</a>
                        )}
                        {registration.userDetails.cv && (
                          <a href={registration.userDetails.cv} target="_blank" rel="noopener noreferrer" 
                             className="text-blue-600 hover:underline text-sm">Resume</a>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  {registration.registrationStatus === 'Pending' && (
                    <div className="flex justify-end space-x-4">
                      <button
                        onClick={() => handleConfirmRegistration(registration._id)}
                        className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors font-medium"
                      >
                        Confirm Registration
                      </button>
                      <button
                        onClick={() => {
                          const reason = prompt('Please provide a reason for rejection (optional):');
                          handleRejectRegistration(registration._id, reason || '');
                        }}
                        className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors font-medium"
                      >
                        Reject Registration
                      </button>
                    </div>
                  )}

                  {registration.registrationStatus === 'Rejected' && registration.rejectionReason && (
                    <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                      <span className="text-sm font-medium text-red-800">Rejection Reason: </span>
                      <span className="text-sm text-red-700">{registration.rejectionReason}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HackathonApplicantDetails;
