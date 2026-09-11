import React, { useState } from 'react';
import axios from '../../lib/axiosInstance';
import { useNavigate } from 'react-router-dom';
import { useLegacyAuth } from '@/context/AuthProvider'; 

function AcceptInvitationModal({ invitation, onClose, onSuccess }) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const [authuser, setAuthuser] = useLegacyAuth(); 

    const handleAccept = async (workMode) => {
        setLoading(true);
        setError(null);
        try {
            const { data } = await axios.post(
                `${import.meta.env.VITE_Backend_URL}/api/team-member/accept-invitation`,
                { invitationId: invitation._id, workMode },
                { withCredentials: true }
            );
            
          
            if (data.user) {
                const updatedAuthUser = { ...authuser, user: data.user };
                setAuthuser(updatedAuthUser);
                localStorage.setItem('authUser', JSON.stringify(updatedAuthUser));
            }
            console.log(authuser)
          
            onSuccess(invitation._id);
            navigate('/invitation-accepted', { state: { companyName: data.companyName } });
            onClose(); 

        } catch (err) {
            console.error("Failed to accept invitation:", err);
            
            setError(err.response?.data?.message || 'An unexpected error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-xl">
                <h2 className="text-xl font-bold text-center">Join {invitation.companyName}</h2>
                <p className="mt-2 text-center text-gray-600">
                    How would you like to proceed? You can switch profiles later.
                </p>

                {error && (
                    <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md text-sm text-center">
                        {error}
                    </div>
                )}

                <div className="mt-6 space-y-4">
                    <button
                        onClick={() => handleAccept('company')}
                        disabled={loading}
                        className="w-full px-4 py-3 font-semibold text-white bg-black rounded-lg hover:bg-gray-800 disabled:bg-gray-400"
                    >
                        {loading ? 'Processing...' : `Work on behalf of ${invitation.companyName}`}
                    </button>
                    <button
                        onClick={() => handleAccept('independent')}
                        disabled={loading}
                        className="w-full px-4 py-3 font-semibold text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:bg-gray-400"
                    >
                        {loading ? 'Processing...' : 'Continue working independently'}
                    </button>
                </div>
                <div className="mt-6 text-center">
                    <button 
                        onClick={onClose} 
                        disabled={loading}
                        className="text-sm text-gray-500 hover:underline disabled:text-gray-300"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}

export default AcceptInvitationModal;