import { useState, useEffect, useCallback } from 'react';
import { Search, ChevronDown, Check, Plus, Edit, Trash2, X, Mail, AlertTriangle, Users, Filter, UserPlus } from 'lucide-react';

// Use the backend URL you provided. In a real Vite app, this would be in a .env file.
const backendUrl = import.meta.env.VITE_Backend_URL || 'http://localhost:5000';

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [selectedStatuses, setSelectedStatuses] = useState([]);

  // Modal states
  const [showAddEmployerModal, setShowAddEmployerModal] = useState(false);
  const [showAssignRoleModal, setShowAssignRoleModal] = useState(false);
  
  // State for the invitation flow
  const [inviteEmail, setInviteEmail] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedUserToInvite, setSelectedUserToInvite] = useState(null);
  const [selectedRole, setSelectedRole] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  // Fetch all team members for the company
  const fetchTeamMembers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${backendUrl}/api/team-member/list-members`, {
        credentials: 'include', // Sends cookies (like the jwt token) with the request
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch team members.');
      }

      const data = await response.json();
      setUsers(data);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching team members:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTeamMembers();
  }, [fetchTeamMembers]);
  
  // Search for an employer by email
  const handleSearchEmployer = async (email) => {
      setInviteEmail(email);
      if (email.length < 3) { // Don't search for very short strings
        setSearchResults([]);
        return;
      }
      setIsSearching(true);
      try {
        const response = await fetch(`${backendUrl}/api/team-member/search-employers?email=${email}`, {
          credentials: 'include',
        });
        if (!response.ok) {
           throw new Error('Search failed');
        }
        const data = await response.json();
        setSearchResults(data);
      } catch (err) {
        console.error('Error searching employers:', err);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
  };

  const handleSelectUserToInvite = (user) => {
    setSelectedUserToInvite(user);
    setInviteEmail(user.email);
    setShowAddEmployerModal(false);
    setShowAssignRoleModal(true);
  };
  
  const handleSendInvitation = async () => {
    if (!selectedUserToInvite || !selectedRole) {
      alert('Please select a user and a role.');
      return;
    }

    try {
        const response = await fetch(`${backendUrl}/api/team-member/invite`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({
                email: selectedUserToInvite.email,
                role: selectedRole,
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Failed to send invitation.');
        }

        alert('Invitation sent successfully!');
        closeAllModals();
        fetchTeamMembers(); // Refresh the list to show the new pending member

    } catch (err) {
        console.error('Error sending invitation:', err);
        alert(`Error: ${err.message}`);
    }
  };

  const getRoleCount = (role) => {
    if (role === 'all') return users.length;
    return users.filter(user => user.userType.toLowerCase() === role.toLowerCase()).length;
  };

  const getStatusCount = (status) => {
    return users.filter(user => user.status.toLowerCase() === status.toLowerCase()).length;
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = selectedRoles.length === 0 || selectedRoles.includes('all') || 
                        selectedRoles.map(role => role.toLowerCase()).includes(user.userType.toLowerCase());
    
    const matchesStatus = selectedStatuses.length === 0 || 
                          selectedStatuses.map(status => status.toLowerCase()).includes(user.status.toLowerCase());
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleSearchChange = (e) => setSearchTerm(e.target.value);

  const handleRoleChange = (role) => {
    setSelectedRoles(prev => {
        const newRoles = prev.includes('all') || role === 'all' ? [] : [...prev];
        if (role === 'all') {
            return prev.includes('all') ? [] : ['all'];
        }
        if (newRoles.includes(role)) {
            return newRoles.filter(r => r !== role);
        } else {
            return [...newRoles, role];
        }
    });
  };

  const handleStatusChange = (status) => {
    setSelectedStatuses(prev => {
      if (prev.includes(status)) {
        return prev.filter(s => s !== status);
      } else {
        return [...prev, status];
      }
    });
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    setSelectedRoles([]);
    setSelectedStatuses([]);
  };
  
  const closeAllModals = () => {
    setShowAddEmployerModal(false);
    setShowAssignRoleModal(false);
    setInviteEmail('');
    setSearchResults([]);
    setSelectedUserToInvite(null);
    setSelectedRole('');
  };
  
  const handleDeleteUser = (userId) => {
    // Note: You should implement a backend endpoint for deleting users
    console.log("Delete user:", userId);
    if (window.confirm("Are you sure you want to delete this user? This is a mock action.")) {
      setUsers(users.filter(user => user.id !== userId));
    }
  };
  
  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-[#143694]/10 via-[#f093fb]/5 to-[#1e4ed8]/10">
        <div className="container mx-auto px-4 py-8 pt-22">
          {/* Header Section */}
          <div className="bg-white/90 backdrop-blur-sm border border-gray-100 rounded-2xl shadow-lg p-8 mb-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
              <div className="flex items-center mb-4 md:mb-0">
                <div className="p-3 bg-gradient-to-br from-[#143694]/20 to-[#1e4ed8]/20 rounded-xl mr-4">
                  <Users className="h-6 w-6 text-[#143694]" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-[#143694] to-[#1e4ed8] bg-clip-text text-transparent">
                    Manage Users
                  </h1>
                  <p className="text-gray-600 mt-1">
                    Manage your team members
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setShowAddEmployerModal(true)}
                className="px-6 py-3 bg-gradient-to-r from-[#143694] to-[#1e4ed8] text-white rounded-xl hover:shadow-lg hover:shadow-[#143694]/30 transition-all duration-300 flex items-center gap-2"
              >
                <UserPlus className="h-4 w-4" /> Add Existing Employer
              </button>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-6">
            {/* Sidebar Filters */}
            <div className="lg:w-64">
              <div className="bg-white/90 backdrop-blur-sm border border-gray-100 rounded-2xl shadow-lg p-6">
                <div className="mb-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-gradient-to-br from-gray-100 to-gray-50 rounded-lg">
                      <Filter className="h-4 w-4 text-gray-600" />
                    </div>
                    <div>
                      <h2 className="text-sm font-medium text-gray-900">Filters</h2>
                      <p className="text-xs text-gray-500 mt-1">Showing {filteredUsers.length} of {users.length}</p>
                    </div>
                  </div>
                  <button 
                    onClick={clearAllFilters}
                    className="w-full px-4 py-2 text-sm text-gray-600 hover:text-[#143694] hover:bg-gradient-to-r hover:from-[#143694]/5 hover:to-[#1e4ed8]/5 rounded-xl transition-all duration-200"
                  >
                    Clear all filters
                  </button>
                </div>
                
                {/* Roles Filter */}
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-3">
                    <h2 className="text-sm font-medium text-gray-700">Role ({selectedRoles.length})</h2>
                  </div>
                  <div className="space-y-2">
                    {['all', 'Admin', 'Recruiter', 'Viewer'].map(role => (
                        <div key={role} className="flex items-center p-2 hover:bg-gray-50 rounded-lg transition-all duration-200">
                            <div className="relative flex items-center">
                              <input 
                                type="checkbox" 
                                className="h-4 w-4 text-[#143694] focus:ring-[#143694]/50 border-gray-300 rounded"
                                checked={selectedRoles.includes(role.toLowerCase()) || (role === 'all' && selectedRoles.includes('all'))}
                                onChange={() => handleRoleChange(role.toLowerCase())} 
                              />
                              <label className="ml-3 block text-sm text-gray-700 cursor-pointer">
                                {role === 'all' ? 'All users' : role}
                                <span className="ml-2 text-xs px-2 py-1 bg-gradient-to-r from-gray-100 to-gray-50 text-gray-600 rounded-full">
                                  {getRoleCount(role)}
                                </span>
                              </label>
                            </div>
                        </div>
                    ))}
                  </div>
                </div>

                {/* Status Filter */}
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <h2 className="text-sm font-medium text-gray-700">Status ({selectedStatuses.length})</h2>
                  </div>
                  <div className="space-y-2">
                    {['Active', 'Pending', 'Inactive'].map(status => (
                      <div key={status} className="flex items-center p-2 hover:bg-gray-50 rounded-lg transition-all duration-200">
                        <div className="relative flex items-center">
                          <input 
                            type="checkbox" 
                            className="h-4 w-4 text-[#143694] focus:ring-[#143694]/50 border-gray-300 rounded"
                            checked={selectedStatuses.includes(status.toLowerCase())}
                            onChange={() => handleStatusChange(status.toLowerCase())} 
                          />
                          <label className="ml-3 block text-sm text-gray-700 cursor-pointer">
                            {status}
                            <span className="ml-2 text-xs px-2 py-1 bg-gradient-to-r from-gray-100 to-gray-50 text-gray-600 rounded-full">
                              {getStatusCount(status)}
                            </span>
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content Area */}
<div className="flex-1 flex flex-col lg:flex-row gap-6 items-stretch">

  {/* All Users Panel */}
  <div className="flex-1 bg-white/90 backdrop-blur-sm border border-gray-100 rounded-2xl shadow-lg
                  overflow-hidden h-full min-h-[500px] flex flex-col">

    {/* Header */}
    <div className="p-6 border-b border-gray-100">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-lg font-semibold text-gray-900">All Users ({users.length})</h2>

        <div className="relative flex-1 md:max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>

          <input 
            type="text" 
            placeholder="Search by name or email" 
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#143694]/50 focus:border-transparent focus:outline-none transition-all duration-200"
            value={searchTerm} 
            onChange={handleSearchChange} 
          />
        </div>
      </div>
    </div>

    {/* Users Table */}
    <div className="overflow-x-auto flex-1">
      {loading && (
        <div className="p-8 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#143694]"></div>
          <p className="mt-2 text-gray-600">Loading users...</p>
        </div>
      )}

      {error && (
        <div className="p-8 text-center">
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl max-w-md mx-auto">
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      )}

      {!loading && !error && (
        <table className="min-w-full divide-y divide-gray-200 h-full">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 w-8">
                <input type="checkbox" className="h-4 w-4 text-[#143694] border-gray-300 rounded" />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Team Members</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-200">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50/50 transition-all duration-200">
                  <td className="px-6 py-4">
                    <input type="checkbox" className="h-4 w-4 text-[#143694] border-gray-300 rounded" />
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0 bg-gradient-to-br from-[#143694]/20 to-[#1e4ed8]/20 rounded-full flex items-center justify-center mr-3">
                        <span className="text-sm font-medium text-[#143694]">{user.name.charAt(0)}</span>
                      </div>
                      <div className="text-sm font-medium text-gray-900">{user.name}</div>
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                      user.status === 'Active'
                        ? 'bg-green-100 text-green-800'
                        : user.status === 'Pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {user.status}
                    </span>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className="px-3 py-1.5 bg-blue-100 text-blue-800 rounded-lg text-xs font-medium">
                      {user.userType}
                    </span>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 hover:text-gray-900 transition">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="p-2 hover:bg-red-50 rounded-lg text-red-600 hover:text-red-800 transition"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-12">
                  <div className="flex flex-col items-center">
                    <Users className="h-12 w-12 text-gray-400 mb-4" />
                    <p className="text-gray-500">No team members found.</p>
                    <p className="text-sm text-gray-400 mt-1">Try adjusting your search or filters</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>

  </div>
</div>

          </div>
        </div>
      </div>

      {/* Modal 1: Add Existing Employer */}
      {showAddEmployerModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white/95 backdrop-blur-sm border border-gray-100 rounded-2xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div className="flex items-center">
                <div className="p-2 bg-gradient-to-br from-[#143694]/20 to-[#1e4ed8]/20 rounded-lg mr-3">
                  <UserPlus className="h-5 w-5 text-[#143694]" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Add Existing Employer</h3>
              </div>
              <button 
                onClick={closeAllModals}
                className="p-2 hover:bg-gray-100 rounded-lg transition-all duration-200"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            <div className="p-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Employer's Work Email</label>
              <input
                type="email"
                placeholder="Start typing to search by email..."
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#143694]/50 focus:border-transparent focus:outline-none transition-all duration-200"
                value={inviteEmail}
                onChange={(e) => handleSearchEmployer(e.target.value)}
              />
              {isSearching && (
                <div className="mt-3 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#143694]"></div>
                  <span className="ml-2 text-sm text-gray-500">Searching...</span>
                </div>
              )}
              {searchResults.length > 0 && (
                <ul className="border border-gray-200 rounded-xl mt-3 max-h-60 overflow-y-auto shadow-sm">
                  {searchResults.map(user => (
                    <li 
                      key={user._id} 
                      onClick={() => handleSelectUserToInvite(user)}
                      className="p-4 hover:bg-gradient-to-r hover:from-[#143694]/5 hover:to-[#1e4ed8]/5 cursor-pointer border-b last:border-b-0 transition-all duration-200"
                    >
                      <p className="font-medium text-gray-900">{user.name}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </li>
                  ))}
                </ul>
              )}
              {searchResults.length === 0 && inviteEmail.length > 2 && !isSearching && (
                <div className="text-center py-8">
                  <Mail className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-sm text-gray-600">No employer found with this email address.</p>
                </div>
              )}
            </div>
            <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-100">
              <button 
                onClick={closeAllModals}
                className="px-4 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all duration-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 2: Assign Role */}
      {showAssignRoleModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white/95 backdrop-blur-sm border border-gray-100 rounded-2xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div className="flex items-center">
                <div className="p-2 bg-gradient-to-br from-[#143694]/20 to-[#1e4ed8]/20 rounded-lg mr-3">
                  <Users className="h-5 w-5 text-[#143694]" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Assign Role</h3>
              </div>
              <button 
                onClick={closeAllModals}
                className="p-2 hover:bg-gray-100 rounded-lg transition-all duration-200"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            <div className="p-6">
              <div className="mb-6 p-4 bg-gradient-to-r from-gray-50 to-white border border-gray-100 rounded-xl">
                <p className="text-sm text-gray-500 mb-1">Assigning role to:</p>
                <p className="font-medium text-gray-900">{selectedUserToInvite?.name}</p>
                <p className="text-sm text-gray-500">{selectedUserToInvite?.email}</p>
              </div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Role</label>
              <div className="relative">
                <select 
                  value={selectedRole} 
                  onChange={(e) => setSelectedRole(e.target.value)} 
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#143694]/50 focus:border-transparent focus:outline-none appearance-none transition-all duration-200"
                >
                  <option value="">Choose a role...</option>
                  <option value="Admin">Admin</option>
                  <option value="Recruiter">Recruiter</option>
                  <option value="Viewer">Viewer</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
              {selectedRole === 'Admin' && (
                <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 border border-yellow-200 rounded-xl p-4 mt-4">
                  <div className="flex items-start">
                    <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <h4 className="text-sm font-medium text-yellow-800">Admin Role Selected</h4>
                      <p className="text-sm text-yellow-700 mt-1">This role grants full access and control.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-100">
              <button 
                onClick={closeAllModals}
                className="px-4 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all duration-200"
              >
                Cancel
              </button>
              <button 
                onClick={handleSendInvitation} 
                disabled={!selectedRole}
                className="px-4 py-2.5 bg-gradient-to-r from-[#143694] to-[#1e4ed8] text-white text-sm font-medium rounded-xl hover:shadow-lg hover:shadow-[#143694]/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                Confirm and Assign
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}