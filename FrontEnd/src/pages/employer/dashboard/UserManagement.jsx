import { useState, useEffect, useMemo } from 'react';
import { Search, Trash2, X, Users, Filter, UserPlus } from 'lucide-react'; 
import axios from 'axios';

export default function EmployerUserManagement() {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedGroup, setSelectedGroup] = useState('all');
    const [userToDelete, setUserToDelete] = useState(null); 
    const [isDeleting, setIsDeleting] = useState(false); 

    useEffect(() => {
        const fetchTeamMembers = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_Backend_URL}/api/team-member/companies-member`,
                    { withCredentials: true }
                );
                setUsers(response.data);
            } catch (err) {
                console.error("Failed to fetch team members:", err);
                setError("Could not load user data. Please try again later.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchTeamMembers();
    }, []);

    const handleConfirmDelete = async () => {
        if (!userToDelete) return;

        setIsDeleting(true);
        try {
            await axios.delete(
                `${import.meta.env.VITE_Backend_URL}/api/team-member/remove/${userToDelete.id}`,
                { withCredentials: true }
            );

            console.log("Successfully removed user.");
            setUsers(currentUsers => currentUsers.filter(u => u.id !== userToDelete.id));
            setUserToDelete(null);

        } catch (err) {
            const errorMessage = err.response?.data?.message || "An unexpected error occurred.";
            console.error("Failed to delete user:", errorMessage);
            alert(`Error: ${errorMessage}`); 
        } finally {
            setIsDeleting(false);
        }
    };

    const groupCounts = useMemo(() => {
        return {
            all: users.length,
            owner: users.filter(u => u.userType === 'Owner').length,
            admin: users.filter(u => u.userType === 'Admin').length,
            recruiter: users.filter(u => u.userType === 'Recruiter').length,
        };
    }, [users]);

    const filteredUsers = users.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              user.email.toLowerCase().includes(searchTerm.toLowerCase());
        
        if (selectedGroup === 'all') return matchesSearch;
        return matchesSearch && user.userType.toLowerCase().includes(selectedGroup);
    });
    
    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-10 w-10 border-[3px] border-[#667eea] border-t-transparent"></div>
                    <p className="mt-3 text-gray-600">Loading team members...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center max-w-md p-8">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-100 text-red-600 mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <p className="text-lg font-medium text-gray-900">{error}</p>
                    <button 
                        onClick={() => window.location.reload()}
                        className="mt-4 px-4 py-2 bg-[#667eea] text-white text-sm rounded-lg hover:bg-[#5a6fd8] transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="flex flex-col w-full bg-gradient-to-br from-[#667eea]/10 via-[#f093fb]/5 to-[#764ba2]/10 min-h-screen">
                <div className="container mx-auto py-6 px-4">
                    <div className="mb-6 bg-white/90 backdrop-blur-sm border border-gray-100 rounded-2xl shadow-lg p-6">
                        <h2 className="text-xl font-bold bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent mb-2">
                            Manage Users
                        </h2>
                        <p className="text-gray-600">
                            Add, remove, or edit permissions for your team members.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                        {/* Sidebar */}
                        <div className="lg:col-span-1">
                            <div className="bg-white/90 backdrop-blur-sm border border-gray-100 rounded-2xl shadow-lg p-6">
                                <div className="mb-6">
                                    <div className="flex items-center mb-4">
                                        <div className="p-3 bg-gradient-to-br from-[#667eea]/20 to-[#764ba2]/20 rounded-xl mr-3">
                                            <Users className="w-5 h-5 text-[#667eea]" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-900">User Groups</h3>
                                            <p className="text-sm text-gray-600">Filter by user type</p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex justify-between items-center mb-4">
                                        <h2 className="text-sm font-medium text-gray-700">Filters</h2>
                                        <button 
                                            onClick={() => { setSearchTerm(''); setSelectedGroup('all'); }} 
                                            className="text-xs bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent hover:from-[#5a6fd8] hover:to-[#6b46c1]"
                                        >
                                            Clear all
                                        </button>
                                    </div>
                                    
                                    <p className="text-sm text-gray-500 mb-6 p-2 bg-gradient-to-r from-gray-50 to-white rounded-lg">
                                        Showing {filteredUsers.length} of {users.length} users
                                    </p>
                                </div>
                                
                                <div>
                                    <h2 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                                        <Filter className="h-4 w-4 mr-2 text-[#667eea]" />
                                        Groups
                                    </h2>
                                    <div className="space-y-2">
                                        {['all', 'owner', 'admin', 'recruiter'].map(group => (
                                            groupCounts[group] > 0 || group === 'all' ? (
                                                <label 
                                                    key={group}
                                                    className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all duration-200 ${
                                                        selectedGroup === group 
                                                            ? 'bg-gradient-to-r from-[#667eea]/10 to-[#764ba2]/10 border border-[#667eea]/20' 
                                                            : 'bg-gray-50 hover:bg-gray-100'
                                                    }`}
                                                >
                                                    <div className="flex items-center">
                                                        <div className={`h-4 w-4 rounded-full border-2 flex items-center justify-center mr-3 ${
                                                            selectedGroup === group 
                                                                ? 'border-[#667eea] bg-[#667eea]' 
                                                                : 'border-gray-300'
                                                        }`}>
                                                            {selectedGroup === group && (
                                                                <div className="h-2 w-2 rounded-full bg-white"></div>
                                                            )}
                                                        </div>
                                                        <span className="text-sm text-gray-700 capitalize">
                                                            {group === 'all' ? 'All Users' : group}
                                                        </span>
                                                    </div>
                                                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                                                        selectedGroup === group 
                                                            ? 'bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white' 
                                                            : 'bg-gray-200 text-gray-700'
                                                    }`}>
                                                        {groupCounts[group]}
                                                    </span>
                                                    <input 
                                                        type="radio"
                                                        name="group-filter"
                                                        className="hidden"
                                                        checked={selectedGroup === group}
                                                        onChange={() => setSelectedGroup(group)} 
                                                    />
                                                </label>
                                            ) : null
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Main Content */}
                        <div className="lg:col-span-3">
                            <div className="bg-white/90 backdrop-blur-sm border border-gray-100 rounded-2xl shadow-lg overflow-hidden">
                                <div className="p-6 border-b border-gray-100">
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                        <div>
                                            <h2 className="text-lg font-bold text-gray-900">All Users ({users.length})</h2>
                                            <p className="text-sm text-gray-600 mt-1">Manage your team's access and roles.</p>
                                        </div>
                                        {/* <button className="px-4 py-2.5 bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white text-sm rounded-xl hover:shadow-lg hover:shadow-[#667eea]/30 transition-all duration-300 flex items-center gap-2">
                                            <UserPlus size={16} />
                                            Add User
                                        </button> */}
                                    </div>
                                </div>
                                
                                <div className="p-6 border-b border-gray-100">
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Search className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            type="text"
                                            placeholder="Search by name or email..."
                                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#667eea]/50 focus:border-transparent focus:outline-none transition-all duration-200 bg-gradient-to-r from-gray-50 to-white"
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                        />
                                    </div>
                                </div>
                                
                                {users.length === 0 ? (
                                    <div className="text-center py-12 px-4">
                                        <div className="p-4 inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 mb-4">
                                            <Users className="h-8 w-8 text-gray-400" />
                                        </div>
                                        <h3 className="text-lg font-medium text-gray-900 mb-2">No team members yet</h3>
                                    </div>
                                ) : (
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full divide-y divide-gray-100">
                                            <thead>
                                                <tr className="bg-gradient-to-r from-gray-50 to-white">
                                                    <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                                        Name
                                                    </th>
                                                    <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                                        Email
                                                    </th>
                                                    <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                                        Status
                                                    </th>
                                                    <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                                        Role
                                                    </th>
                                                    <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                                        Actions
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-100">
                                                {filteredUsers.map((user) => (
                                                    <tr key={user.id} className="hover:bg-gradient-to-r hover:from-gray-50/50 hover:to-white/50 transition-colors duration-150">
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="flex items-center">
                                                                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center text-gray-600 font-medium text-sm mr-3">
                                                                    {user.name.charAt(0).toUpperCase()}
                                                                </div>
                                                                <div>
                                                                    <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="text-sm text-gray-600">{user.email}</div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                                                                user.status === 'Active' 
                                                                    ? 'bg-gradient-to-r from-green-100 to-green-50 text-green-800' 
                                                                    : 'bg-gradient-to-r from-gray-100 to-gray-50 text-gray-800'
                                                            }`}>
                                                                {user.status}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <span className={`text-sm font-medium ${
                                                                user.userType === 'Owner' 
                                                                    ? 'text-purple-600' 
                                                                    : user.userType === 'Admin' 
                                                                    ? 'text-blue-600' 
                                                                    : 'text-green-600'
                                                            }`}>
                                                                {user.userType}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                            {user.userType !== 'Owner' && (
                                                                <button 
                                                                    onClick={() => setUserToDelete(user)} 
                                                                    className="flex items-center gap-1 text-red-600 hover:text-red-800 transition-colors duration-200 p-2 rounded-lg hover:bg-red-50"
                                                                    aria-label={`Remove ${user.name}`}
                                                                >
                                                                    <Trash2 className="h-4 w-4" />
                                                                    <span className="hidden sm:inline">Remove</span>
                                                                </button>
                                                            )}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Confirmation Modal */}
            {userToDelete && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center">
                                <div className="p-2 bg-gradient-to-br from-red-100 to-red-50 rounded-lg mr-3">
                                    <Trash2 className="h-5 w-5 text-red-600" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900">Confirm Deletion</h3>
                            </div>
                            <button 
                                onClick={() => setUserToDelete(null)} 
                                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100"
                            >
                                <X className="h-6 w-6" />
                            </button>
                        </div>
                        <p className="text-sm text-gray-600 mb-6 p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl">
                            Are you sure you want to remove <strong className="font-medium text-gray-900">{userToDelete.name}</strong> from the team? This action cannot be undone.
                        </p>
                        <div className="flex justify-end gap-3">
                            <button 
                                onClick={() => setUserToDelete(null)}
                                className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200 disabled:opacity-50"
                                disabled={isDeleting}
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={handleConfirmDelete}
                                className="px-5 py-2.5 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:shadow-lg hover:shadow-red-600/30 transition-all duration-200 disabled:opacity-50 flex items-center gap-2"
                                disabled={isDeleting}
                            >
                                {isDeleting ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                                        Deleting...
                                    </>
                                ) : (
                                    'Confirm Delete'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}