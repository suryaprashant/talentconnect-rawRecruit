
import { useState, useEffect, useCallback } from 'react';
import { Search, ChevronDown, Check, Plus, Edit, Trash2, X, Mail, AlertTriangle } from 'lucide-react';

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
      <div className="flex flex-col h-screen bg-gray-100">
        {/* Top Header Bar */}
        <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between shadow-sm">
          <h1 className="text-xl font-semibold text-gray-800">Manage Users</h1>
          <button 
            onClick={() => setShowAddEmployerModal(true)}
            className="px-4 py-2 bg-black text-white rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 flex items-center"
          >
            <Plus className="h-4 w-4 mr-2" /> Add Existing Employer
          </button>
        </div>

        {/* Main Content Area */}
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <div className="w-64 bg-white border-r border-gray-200 p-6 flex-shrink-0">
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-sm font-medium text-gray-700">Filters</h2>
                <button onClick={clearAllFilters} className="text-xs text-blue-600 hover:text-blue-800">Clear all</button>
              </div>
              <p className="text-xs text-gray-500 mb-4">Showing {filteredUsers.length} of {users.length}</p>
            </div>
            
            {/* Filters sections (Roles, Status) - No change needed here */}
             {/* Roles Filter */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-sm font-medium text-gray-700">Role ({selectedRoles.length})</h2>
              </div>
              <div className="space-y-2">
                {['all', 'Admin', 'Recruiter', 'Viewer'].map(role => (
                    <div key={role} className="flex items-center">
                        <input 
                          type="checkbox" 
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          checked={selectedRoles.includes(role.toLowerCase()) || (role === 'all' && selectedRoles.includes('all'))}
                          onChange={() => handleRoleChange(role.toLowerCase())} 
                        />
                        <label className="ml-2 block text-sm text-gray-700">{role === 'all' ? 'All users' : role}({getRoleCount(role)})</label>
                    </div>
                ))}
              </div>
            </div>

            {/* Status Filter */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-sm font-medium text-gray-700">Status ({selectedStatuses.length})</h2>
              </div>
              <div className="space-y-2">
                {['Active', 'Pending', 'Inactive'].map(status => (
                  <div key={status} className="flex items-center">
                    <input 
                      type="checkbox" 
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      checked={selectedStatuses.includes(status.toLowerCase())}
                      onChange={() => handleStatusChange(status.toLowerCase())} 
                    />
                    <label className="ml-2 block text-sm text-gray-700">{status}({getStatusCount(status)})</label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content (Table Area) */}
          <div className="flex-1 p-6 overflow-auto">
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm h-full flex flex-col">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-800">All Users ({users.length})</h2>
              </div>
              
              <div className="p-4 flex items-center">
                <div className="relative flex-1 mr-2">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Search className="h-5 w-5 text-gray-400" /></div>
                  <input type="text" placeholder="Search by name or email" className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full" value={searchTerm} onChange={handleSearchChange} />
                </div>
              </div>
              
              {/* Users Table */}
              <div className="overflow-x-auto flex-1">
                {loading && <p className="p-4 text-center">Loading users...</p>}
                {error && <p className="p-4 text-center text-red-500">{error}</p>}
                {!loading && !error && (
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-4 py-3 w-8"><input type="checkbox" className="h-4 w-4" /></th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Team Members</th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">User type</th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredUsers.length > 0 ? filteredUsers.map((user) => (
                        <tr key={user.id} className="hover:bg-gray-50">
                          <td className="px-4 py-4"><input type="checkbox" className="h-4 w-4" /></td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.name}</td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                user.status === 'Active' ? 'bg-green-100 text-green-800' :
                                user.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-gray-100 text-gray-800'
                            }`}>{user.status}</span>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{user.userType}</td>
                          <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex items-center space-x-2">
                               <button className="text-gray-600 hover:text-gray-900"><Edit className="h-4 w-4" /></button>
                               <button onClick={() => handleDeleteUser(user.id)} className="text-red-600 hover:text-red-900"><Trash2 className="h-4 w-4" /></button>
                            </div>
                          </td>
                        </tr>
                      )) : (
                        <tr>
                            <td colSpan="6" className="text-center py-8 text-gray-500">No team members found.</td>
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

      {/* Modal 1: Add Existing Employer */}
      {showAddEmployerModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-medium">Add Existing Employer</h3>
              <button onClick={closeAllModals}><X className="h-5 w-5" /></button>
            </div>
            <div className="p-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Employer's Work Email</label>
              <input
                type="email"
                placeholder="Start typing to search by email..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                value={inviteEmail}
                onChange={(e) => handleSearchEmployer(e.target.value)}
              />
              {isSearching && <p className="text-sm text-gray-500 mt-2">Searching...</p>}
              {searchResults.length > 0 && (
                <ul className="border border-gray-200 rounded-md mt-2 max-h-40 overflow-y-auto">
                    {searchResults.map(user => (
                        <li 
                            key={user._id} 
                            onClick={() => handleSelectUserToInvite(user)}
                            className="p-3 hover:bg-gray-100 cursor-pointer border-b last:border-b-0"
                        >
                            <p className="font-medium">{user.name}</p>
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
             <div className="flex items-center justify-end space-x-3 p-4 border-t">
                 <button onClick={closeAllModals} className="px-4 py-2 text-sm font-medium">Cancel</button>
             </div>
          </div>
        </div>
      )}

      {/* Modal 2: Assign Role */}
      {showAssignRoleModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-medium">Assign Role</h3>
              <button onClick={closeAllModals}><X className="h-5 w-5" /></button>
            </div>
            <div className="p-6">
              <div className="mb-4">
                 <p className="text-sm text-gray-500">Assigning role to:</p>
                 <p className="font-medium text-gray-900">{selectedUserToInvite?.name} ({selectedUserToInvite?.email})</p>
              </div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Role</label>
              <div className="relative">
                <select value={selectedRole} onChange={(e) => setSelectedRole(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md appearance-none">
                  <option value="">Choose a role...</option>
                  <option value="Admin">Admin</option>
                  <option value="Recruiter">Recruiter</option>
                  <option value="Viewer">Viewer</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4" />
              </div>
               {selectedRole === 'Admin' && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mt-4">
                    <div className="flex items-start">
                        <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5 mr-3" />
                        <div>
                            <h4 className="text-sm font-medium text-yellow-800">Admin Role Selected</h4>
                            <p className="text-sm text-yellow-700 mt-1">This role grants full access and control.</p>
                        </div>
                    </div>
                </div>
              )}
            </div>
            <div className="flex items-center justify-end space-x-3 p-4 border-t">
              <button onClick={closeAllModals} className="px-4 py-2 text-sm font-medium">Cancel</button>
              <button onClick={handleSendInvitation} disabled={!selectedRole} className="px-4 py-2 bg-black text-white text-sm font-medium rounded-md disabled:opacity-50">Confirm and Assign</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}