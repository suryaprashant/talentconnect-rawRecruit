// import React, { useState, useEffect } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import { useAuth } from '@/context/AuthProvider';
// import { 
//     FiUser, 
//     FiSettings, 
//     FiLogOut, 
//     FiBriefcase, 
//     FiCheck,
//     FiBell,
//     FiHelpCircle,
//     FiXCircle // ✅ Added for the "Leave" icon
// } from 'react-icons/fi';
// import Avatar from '../ui/Avatar';
// // ✅ 1. Import the modal component you created earlier
// import LeaveCompanyModal from '../Employer/LeaveCompanyModal';

// function ProfileSwitchDropdown() {
//     // --- STATE AND HOOKS ---
//     const [authuser, setAuthuser] = useAuth();
//     const navigate = useNavigate();
//     const [companies, setCompanies] = useState([]);
//     const [isLoading, setIsLoading] = useState(true);
//     const [isSwitching, setIsSwitching] = useState(false);
    
//     // ✅ 2. Add state to manage the leave company modal and its submission
//     const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
//     const [companyToLeave, setCompanyToLeave] = useState(null);
//     const [isSubmittingLeave, setIsSubmittingLeave] = useState(false);


//     // --- DATA FETCHING ---
//     useEffect(() => {
//         const fetchCompanies = async () => {
//             try {
//                 const { data } = await axios.get(
//                     `${import.meta.env.VITE_Backend_URL}/api/team-member/my-companies`,
//                     { withCredentials: true }
//                 );
//                 setCompanies(data);
//             } catch (error) {
//                 console.error("Failed to fetch companies:", error);
//             } finally {
//                 setIsLoading(false);
//             }
//         };

//         fetchCompanies();
//     }, []);

//     // --- EVENT HANDLERS ---
//     const handleSwitchProfile = async (profileId) => {
//         // This logic is slightly incorrect in your code, it should be /api/auth/switch-profile
//         const endpoint = `${import.meta.env.VITE_Backend_URL}/api/team-member/switch-profile`;
//         if (authuser.user.activeCompanyId === profileId) return;
//         setIsSwitching(true);
//         try {
//             const { data } = await axios.post(
//                 endpoint,
//                 { profileId },
//                 { withCredentials: true }
//             );
//             const updatedAuthUser = { ...authuser, user: data.user };
//             setAuthuser(updatedAuthUser);
//             localStorage.setItem('authUser', JSON.stringify(updatedAuthUser));
//             window.location.reload();
//         } catch (error) {
//             console.error('Failed to switch profile:', error);
//             alert('Could not switch profile. Please try again.');
//             setIsSwitching(false);
//         }
//     };
    
//     const handleLogout = async () => {
//         try {
//             await axios.post(`${import.meta.env.VITE_Backend_URL}/api/auth/logout`, {}, { withCredentials: true });
//             localStorage.clear();
//             navigate('/', { replace: true });
//         } catch (error) {
//             console.error('Logout failed:', error);
//         }
//     };

//     //  3. Add handlers for the "Leave Company" flow
//     const handleOpenLeaveModal = (company) => {
//         setCompanyToLeave(company);
//         setIsLeaveModalOpen(true);
//     };

//     const handleConfirmLeave = async () => {
//         if (!companyToLeave) return;
//         setIsSubmittingLeave(true);
//         try {
//             const { data } = await axios.delete(
//                 `${import.meta.env.VITE_Backend_URL}/api/team-member/leave/${companyToLeave._id}`,
//                 { withCredentials: true }
//             );

//             // Update auth context and local storage with the user object returned from the backend
//             const updatedAuthUser = { ...authuser, user: data.user };
//             setAuthuser(updatedAuthUser);
//             localStorage.setItem('authUser', JSON.stringify(updatedAuthUser));
            
//             // Reload the page to reflect the user being removed from the company
//             window.location.reload();

//         } catch (error) {
//             console.error("Failed to leave company:", error);
//             // Display the specific error message from the backend if it exists
//             alert(error.response?.data?.message || "An error occurred. Could not leave the company.");
//             setIsSubmittingLeave(false);
//             setIsLeaveModalOpen(false);
//         }
//     };

//     // --- RENDER LOGIC ---
//     const activeCompanyProfile = companies.find(c => c._id === authuser.user.activeCompanyId);

//     //  4. The entire component must be wrapped in a React Fragment to include the modal
//     return (
//         <>
//             <div className="absolute right-0 z-50 w-64 mt-2 origin-top-right bg-white rounded-md shadow-lg dropdown-menu ring-1 ring-black ring-opacity-5">
//                 <div className="py-1">
//                     {/* Section 1: Current Profile */}
//                     <div className="px-4 py-3">
//                         <p className="text-xs text-gray-500">Currently working as</p>
//                         <div className="flex items-center mt-1">
//                             <Avatar 
//                                 src={activeCompanyProfile?.logo} 
//                                 name={activeCompanyProfile?.name || authuser.user.name} 
//                                 className="w-8 h-8 mr-2"
//                             />
//                             <span className="font-semibold text-gray-800 truncate">
//                                 {activeCompanyProfile?.name || 'Independent'}
//                             </span>
//                         </div>
//                     </div>

//                     {/* Section 2: Switch Profile */}
//                     <div className="border-t border-gray-100">
//                         <div className="px-4 pt-3 pb-1 text-xs font-semibold text-gray-500 uppercase">
//                             Switch Profile
//                         </div>
//                         <div className="py-1">
//                             <button onClick={() => handleSwitchProfile(null)} className="dropdown-switch-item group">
//                                 <FiUser className="w-5 h-5 mr-3 text-gray-400" />
//                                 <span className="flex-1 text-left"> Work as Independent</span>
//                                 {!authuser.user.activeCompanyId && <FiCheck className="w-5 h-5 text-black" />}
//                             </button>
                            
//                             {/*  5. Modified mapping to include the Leave button */}
//                             {companies.map(company => (
//                                 <div key={company._id} className="dropdown-switch-item group !p-0">
//                                     {/* Main button for switching */}
//                                     <button onClick={() => handleSwitchProfile(company._id)} className="flex items-center flex-grow h-full px-4 py-2 text-left">
//                                         <FiBriefcase className="w-5 h-5 mr-3 text-gray-400" />
//                                         <span className="flex-1">Work for {company.name}</span>
//                                         {authuser.user.activeCompanyId === company._id && <FiCheck className="w-5 h-5 text-black" />}
//                                     </button>
//                                     {/* Leave button, only visible on hover */}
//                                     <button 
//                                         onClick={() => handleOpenLeaveModal(company)} 
//                                         title={`Leave ${company.name}`}
//                                         className="px-3 py-2 text-gray-400 transition-opacity duration-150 opacity-0 group-hover:opacity-100 hover:text-red-600"
//                                     >
//                                         <FiXCircle className="w-4 h-4" />
//                                     </button>
//                                 </div>
//                             ))}
//                         </div>
//                     </div>

//                     {/* Section 3: Actions */}
//                     <div className="border-t border-gray-100">
//                         <div className="py-1">
//                             <Link to="/profile" className="dropdown-item">
//                                 <FiUser className="mr-3 text-gray-400" /> Edit Profile
//                             </Link>
//                             <Link to="/settings" className="dropdown-item">
//                                 <FiSettings className="mr-3 text-gray-400" /> Settings
//                             </Link>
//                             <Link to="/notifications" className="dropdown-item">
//                                 <FiBell className="mr-3 text-gray-400" /> Notifications
//                             </Link>
//                             <Link to="/faq" className="dropdown-item">
//                                 <FiHelpCircle className="mr-3 text-gray-400" /> FAQs
//                             </Link>
//                         </div>
//                     </div>
                    
//                     {/* Section 4: Logout */}
//                     <div className="border-t border-gray-100">
//                         <div className="py-1">
//                             <button onClick={handleLogout} className="dropdown-item">
//                                 <FiLogOut className="mr-3 text-gray-400" /> Logout
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//                 {isSwitching && (
//                   <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75"><p>Switching...</p></div>
//                 )}
//             </div>

//             {/*  6. Render the modal, passing state and handlers as props */}
//             <LeaveCompanyModal
//                 isOpen={isLeaveModalOpen}
//                 onClose={() => setIsLeaveModalOpen(false)}
//                 onConfirm={handleConfirmLeave}
//                 companyName={companyToLeave?.name}
//                 isSubmitting={isSubmittingLeave}
//             />
//         </>
//     );
// }

// export default ProfileSwitchDropdown;


// import React, { useState, useEffect } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import { useAuth } from '@/context/AuthProvider';
// import { 
//     FiUser, FiSettings, FiLogOut, FiBriefcase, 
//     FiCheck, FiBell, FiHelpCircle, FiXCircle 
// } from 'react-icons/fi';
// import Avatar from '../ui/Avatar';
// import LeaveCompanyModal from '../Employer/LeaveCompanyModal';

// function ProfileSwitchDropdown() {
//     // --- STATE AND HOOKS ---
//     const [authuser, setAuthuser] = useAuth(); // Get the context state and setter
//     const navigate = useNavigate();
//     const [companies, setCompanies] = useState([]);
//     const [isLoading, setIsLoading] = useState(true);
//     const [isSwitching, setIsSwitching] = useState(false);
    
//     // State for the leave company modal
//     const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
//     const [companyToLeave, setCompanyToLeave] = useState(null);
//     const [isSubmittingLeave, setIsSubmittingLeave] = useState(false);

//     // --- DATA FETCHING ---
//     useEffect(() => {
//         const fetchCompanies = async () => {
//             try {
//                 const { data } = await axios.get(
//                     `${import.meta.env.VITE_Backend_URL}/api/team-member/my-companies`,
//                     { withCredentials: true }
//                 );
//                 setCompanies(data);
//             } catch (error) {
//                 console.error("Failed to fetch companies:", error);
//             } finally {
//                 setIsLoading(false);
//             }
//         };
//         fetchCompanies();
//     }, []);

//     // --- EVENT HANDLERS ---
//     const handleSwitchProfile = async (profileId) => {
//         // Prevent switching to the same profile
//         if (authuser.user.activeCompanyId === profileId) return;

//         setIsSwitching(true);
//         try {
//             const { data } = await axios.post(
//                 `${import.meta.env.VITE_Backend_URL}/api/team-member/switch-profile`,
//                 { profileId },
//                 { withCredentials: true }
//             );
            
//             // ✅ THE FIX: Update state without reloading the page
//             const updatedAuthUser = { ...authuser, user: data.user };
            
//             // 1. Update the global context state
//             setAuthuser(updatedAuthUser); 
            
//             // 2. Update localStorage to persist the change for future sessions
//             localStorage.setItem('authUser', JSON.stringify(updatedAuthUser));
            
//             // 3. Remove the page reload. React will re-render automatically.
//             // window.location.reload(); 

//         } catch (error) {
//             console.error('Failed to switch profile:', error);
//             alert('Could not switch profile. Please try again.');
//         } finally {
//             setIsSwitching(false); // Stop the loading indicator
//         }
//     };
    
//     const handleLogout = async () => { /* ... existing code ... */ };
//     const handleOpenLeaveModal = (company) => { /* ... existing code ... */ };
//     const handleConfirmLeave = async () => { /* ... existing code, preferably without page reload ... */ };

//     // --- RENDER LOGIC ---
//     const activeCompanyProfile = companies.find(c => c._id === authuser.user.activeCompanyId);

//     return (
//         <>
//             <div className="absolute right-0 z-50 w-64 mt-2 origin-top-right bg-white rounded-md shadow-lg dropdown-menu ring-1 ring-black ring-opacity-5">
//                 <div className="py-1">
//                     {/* Section 1: Current Profile */}
//                     <div className="px-4 py-3">
//                         <p className="text-xs text-gray-500">Currently working as</p>
//                         <div className="flex items-center mt-1">
//                             <Avatar 
//                                 src={activeCompanyProfile?.logo} 
//                                 name={activeCompanyProfile?.name || authuser.user.name} 
//                                 className="w-8 h-8 mr-2"
//                             />
//                             <span className="font-semibold text-gray-800 truncate">
//                                 {activeCompanyProfile?.name || 'Independent'}
//                             </span>
//                         </div>
//                     </div>

//                     {/* Section 2: Switch Profile */}
//                     <div className="border-t border-gray-100">
//                         <div className="px-4 pt-3 pb-1 text-xs font-semibold text-gray-500 uppercase">
//                             Switch Profile
//                         </div>
//                         <div className="py-1">
//                             <button onClick={() => handleSwitchProfile(null)} className="dropdown-switch-item group">
//                                 <FiUser className="w-5 h-5 mr-3 text-gray-400" />
//                                 <span className="flex-1 text-left"> Work as Independent</span>
//                                 {!authuser.user.activeCompanyId && <FiCheck className="w-5 h-5 text-black" />}
//                             </button>
                            
//                             {companies.map(company => (
//                                 <div key={company._id} className="dropdown-switch-item group !p-0">
//                                     <button onClick={() => handleSwitchProfile(company._id)} className="flex items-center flex-grow h-full px-4 py-2 text-left">
//                                         <FiBriefcase className="w-5 h-5 mr-3 text-gray-400" />
//                                         <span className="flex-1">Work for {company.name}</span>
//                                         {/* This checkmark will now move instantly on switch */}
//                                         {authuser.user.activeCompanyId === company._id && <FiCheck className="w-5 h-5 text-black" />}
//                                     </button>
//                                     <button 
//                                         onClick={() => handleOpenLeaveModal(company)} 
//                                         title={`Leave ${company.name}`}
//                                         className="px-3 py-2 text-gray-400 transition-opacity duration-150 opacity-0 group-hover:opacity-100 hover:text-red-600"
//                                     >
//                                         <FiXCircle className="w-4 h-4" />
//                                     </button>
//                                 </div>
//                             ))}
//                         </div>
//                     </div>

//                     {/* Section 3 & 4: Actions & Logout */}
//                     {/* ... your existing Link and Logout button code ... */}
//                 </div>
//                 {isSwitching && (
//                   <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75"><p>Switching...</p></div>
//                 )}
//             </div>

//             {/* Leave Company Modal */}
//             <LeaveCompanyModal
//                 isOpen={isLeaveModalOpen}
//                 onClose={() => setIsLeaveModalOpen(false)}
//                 onConfirm={handleConfirmLeave}
//                 companyName={companyToLeave?.name}
//                 isSubmitting={isSubmittingLeave}
//             />
//         </>
//     );
// }

// export default ProfileSwitchDropdown;




// import React, { useState, useEffect } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import { useAuth } from '@/context/AuthProvider';
// import { 
//     FiUser, 
//     FiSettings, 
//     FiLogOut, 
//     FiBriefcase, 
//     FiCheck,
//     FiBell,
//     FiHelpCircle,
//     FiXCircle
// } from 'react-icons/fi';
// import Avatar from '../ui/Avatar';
// import LeaveCompanyModal from '../Employer/LeaveCompanyModal';

// function ProfileSwitchDropdown() {
//     // --- STATE AND HOOKS ---
//     const [authuser, setAuthuser] = useAuth();
//     const navigate = useNavigate();
//     const [companies, setCompanies] = useState([]);
//     const [isLoading, setIsLoading] = useState(true);
//     const [isSwitching, setIsSwitching] = useState(false);
    
//     // State to manage the leave company modal
//     const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
//     const [companyToLeave, setCompanyToLeave] = useState(null);
//     const [isSubmittingLeave, setIsSubmittingLeave] = useState(false);


//     // --- DATA FETCHING ---
//     useEffect(() => {
//         const fetchCompanies = async () => {
//             if (!authuser?.user) return; // Don't fetch if no user
//             try {
//                 const { data } = await axios.get(
//                     `${import.meta.env.VITE_Backend_URL}/api/team-member/my-companies`,
//                     { withCredentials: true }
//                 );
//                 setCompanies(data);
//             } catch (error) {
//                 console.error("Failed to fetch companies:", error);
//             } finally {
//                 setIsLoading(false);
//             }
//         };
//         fetchCompanies();
//     }, [authuser]); // Re-fetch if authuser changes

    
//     const handleSwitchProfile = async (profileId) => {
//         if (authuser.user.activeCompanyId === profileId) return;

//         setIsSwitching(true);
//         try {
//             const { data } = await axios.post(
//                 `${import.meta.env.VITE_Backend_URL}/api/team-member/switch-profile`,
//                 { profileId },
//                 { withCredentials: true }
//             );
            
       
//             const updatedAuthUser = { ...authuser, user: data.user };
          
//             setAuthuser(updatedAuthUser);
            
            
//             localStorage.setItem('authUser', JSON.stringify(updatedAuthUser));
            
         

//         } catch (error) {
//             console.error('Failed to switch profile:', error);
//             alert('Could not switch profile. Please try again.');
//         } finally {
//             setIsSwitching(false);
//         }
//     };
    
//     const handleLogout = async () => {
//         try {
//             await axios.post(`${import.meta.env.VITE_Backend_URL}/api/auth/logout`, {}, { withCredentials: true });
//             localStorage.clear();
//             setAuthuser(null); // Clear the auth context
//             navigate('/', { replace: true });
//         } catch (error) {
//             console.error('Logout failed:', error);
//         }
//     };

//     const handleOpenLeaveModal = (company) => {
//         setCompanyToLeave(company);
//         setIsLeaveModalOpen(true);
//     };

//     const handleConfirmLeave = async () => {
//         if (!companyToLeave) return;

//         setIsSubmittingLeave(true);
//         try {
//             const { data } = await axios.delete(
//                 `${import.meta.env.VITE_Backend_URL}/api/team-member/leave/${companyToLeave._id}`,
//                 { withCredentials: true }
//             );

      
//             const updatedAuthUser = { ...authuser, user: data.user };
//             setAuthuser(updatedAuthUser);
//             localStorage.setItem('authUser', JSON.stringify(updatedAuthUser));
            
          
            
//             // Close the modal upon success
//             setIsLeaveModalOpen(false);
//             setCompanyToLeave(null);

//         } catch (error) {
//             console.error("Failed to leave company:", error);
//             alert(error.response?.data?.message || "An error occurred. Could not leave the company.");
//         } finally {
//             setIsSubmittingLeave(false);
//         }
//     };

//     // --- RENDER LOGIC ---
//     const activeCompanyProfile = companies.find(c => c._id === authuser?.user?.activeCompanyId);

//     return (
//         <>
//             <div className="absolute right-0 z-50 w-64 mt-2 origin-top-right bg-white rounded-md shadow-lg dropdown-menu ring-1 ring-black ring-opacity-5">
//                 <div className="py-1">
//                     {/* Section 1: Current Profile */}
//                     <div className="px-4 py-3">
//                         <p className="text-xs text-gray-500">Currently working as</p>
//                         <div className="flex items-center mt-1">
//                             <Avatar 
//                                 src={activeCompanyProfile?.logo} 
//                                 name={activeCompanyProfile?.name || authuser?.user?.name} 
//                                 className="w-8 h-8 mr-2"
//                             />
//                             <span className="font-semibold text-gray-800 truncate">
//                                 {activeCompanyProfile?.name || 'Independent'}
//                             </span>
//                         </div>
//                     </div>

//                     {/* Section 2: Switch Profile */}
//                     <div className="border-t border-gray-100">
//                         <div className="px-4 pt-3 pb-1 text-xs font-semibold text-gray-500 uppercase">
//                             Switch Profile
//                         </div>
//                         <div className="py-1">
//                             <button onClick={() => handleSwitchProfile(null)} className="dropdown-switch-item group">
//                                 <FiUser className="w-5 h-5 mr-3 text-gray-400" />
//                                 <span className="flex-1 text-left"> Work as Independent</span>
//                                 {!authuser?.user?.activeCompanyId && <FiCheck className="w-5 h-5 text-black" />}
//                             </button>
                            
//                             {companies.map(company => (
//                                 <div key={company._id} className="dropdown-switch-item group !p-0">
//                                     <button onClick={() => handleSwitchProfile(company._id)} className="flex items-center flex-grow h-full px-4 py-2 text-left">
//                                         <FiBriefcase className="w-5 h-5 mr-3 text-gray-400" />
//                                         <span className="flex-1">Work for {company.name}</span>
//                                         {authuser?.user?.activeCompanyId === company._id && <FiCheck className="w-5 h-5 text-black" />}
//                                     </button>
//                                     <button 
//                                         onClick={() => handleOpenLeaveModal(company)} 
//                                         title={`Leave ${company.name}`}
//                                         className="px-3 py-2 text-gray-400 transition-opacity duration-150 opacity-0 group-hover:opacity-100 hover:text-red-600"
//                                     >
//                                         <FiXCircle className="w-4 h-4" />
//                                     </button>
//                                 </div>
//                             ))}
//                         </div>
//                     </div>

//                     {/* Section 3: Actions (Profile, Settings, etc.) */}
//                     <div className="border-t border-gray-100">
//                         <div className="py-1">
//                             <Link to="/profile" className="dropdown-item">
//                                 <FiUser className="mr-3 text-gray-400" /> Edit Profile
//                             </Link>
//                             <Link to="/settings" className="dropdown-item">
//                                 <FiSettings className="mr-3 text-gray-400" /> Settings
//                             </Link>
//                             <Link to="/notifications" className="dropdown-item">
//                                 <FiBell className="mr-3 text-gray-400" /> Notifications
//                             </Link>
//                             <Link to="/faq" className="dropdown-item">
//                                 <FiHelpCircle className="mr-3 text-gray-400" /> FAQs
//                             </Link>
//                         </div>
//                     </div>
                    
//                     {/* Section 4: Logout */}
//                     <div className="border-t border-gray-100">
//                         <div className="py-1">
//                             <button onClick={handleLogout} className="dropdown-item w-full text-left">
//                                 <FiLogOut className="mr-3 text-gray-400" /> Logout
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//                 {isSwitching && (
//                   <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75"><p>Switching...</p></div>
//                 )}
//             </div>

//             {/* Render the modal for leaving a company */}
//             <LeaveCompanyModal
//                 isOpen={isLeaveModalOpen}
//                 onClose={() => setIsLeaveModalOpen(false)}
//                 onConfirm={handleConfirmLeave}
//                 companyName={companyToLeave?.name}
//                 isSubmitting={isSubmittingLeave}
//             />
//         </>
//     );
// }

// export default ProfileSwitchDropdown;


// src/components/Employer/ProfileSwitchDropdown.jsx

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '@/context/AuthProvider';
import { 
    FiUser, FiSettings, FiLogOut, FiBriefcase, FiCheck,
    FiBell, FiHelpCircle, FiXCircle, FiLoader
} from 'react-icons/fi';
import Avatar from '../ui/Avatar';
import LeaveCompanyModal from './LeaveCompanyModal';

function ProfileSwitchDropdown() {
    // --- STATE AND HOOKS ---
    const [authuser, setAuthuser] = useAuth();
    const navigate = useNavigate();
    const [companies, setCompanies] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isSwitching, setIsSwitching] = useState(false);
    const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
    const [companyToLeave, setCompanyToLeave] = useState(null);
    const [isSubmittingLeave, setIsSubmittingLeave] = useState(false);

    // --- DATA FETCHING ---
    useEffect(() => {
        const fetchCompanies = async () => {
            if (!authuser?.user) return;
            setIsLoading(true);
            setError(null);
            try {
                const { data } = await axios.get(
                    `${import.meta.env.VITE_Backend_URL}/api/team-member/my-companies`,
                    { withCredentials: true }
                );
                setCompanies(data);
            } catch (err) {
                console.error("Failed to fetch companies:", err);
                setError("Could not load companies.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchCompanies();
    }, [authuser]); // ✅ Re-fetches when the user context changes

    // --- EVENT HANDLERS ---
    const handleStateUpdate = (updatedUser) => {
        const updatedAuthUser = { ...authuser, user: updatedUser };
        setAuthuser(updatedAuthUser);
        // Let the AuthProvider's useEffect handle saving to localStorage
    };

    const handleSwitchProfile = async (profileId) => {
        if (authuser.user.activeCompanyId === profileId) return;
        setIsSwitching(true);
        try {
            const { data } = await axios.post(
                `${import.meta.env.VITE_Backend_URL}/api/team-member/switch-profile`,
                { profileId }, { withCredentials: true }
            );
            // ✅ Update state correctly without reloading
            handleStateUpdate(data.user);
        } catch (error) {
            console.error('Failed to switch profile:', error);
            alert('Could not switch profile. Please try again.');
        } finally {
            setIsSwitching(false);
        }
    };
    
    const handleLogout = async () => {
        try {
            await axios.post(`${import.meta.env.VITE_Backend_URL}/api/auth/logout`, {}, { withCredentials: true });
            setAuthuser(null); // This will trigger the AuthProvider to clear localStorage
            navigate('/', { replace: true });
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    const handleOpenLeaveModal = (company) => {
        setCompanyToLeave(company);
        setIsLeaveModalOpen(true);
    };

    const handleConfirmLeave = async () => {
        if (!companyToLeave) return;
        setIsSubmittingLeave(true);
        try {
            const { data } = await axios.delete(
                `${import.meta.env.VITE_Backend_URL}/api/team-member/leave/${companyToLeave._id}`,
                { withCredentials: true }
            );
            // ✅ Update state correctly without reloading
            handleStateUpdate(data.user);
            setIsLeaveModalOpen(false);
            setCompanyToLeave(null);
        } catch (error) {
            console.error("Failed to leave company:", error);
            alert(error.response?.data?.message || "Could not leave the company.");
        } finally {
            setIsSubmittingLeave(false);
        }
    };

    // --- RENDER LOGIC ---
    const activeCompanyProfile = companies.find(c => c._id === authuser?.user?.activeCompanyId);

    const renderProfileList = () => {
        if (isLoading) return <div className="flex items-center p-2 text-gray-500"><FiLoader className="mr-2 animate-spin" /> Loading...</div>;
        if (error) return <div className="p-2 text-red-500">{error}</div>;
        return (
            <>
                <button onClick={() => handleSwitchProfile(null)} className="dropdown-switch-item group">
                    <FiUser className="w-5 h-5 mr-3 text-gray-400" />
                    <span className="flex-1 text-left">Work as Independent</span>
                    {!authuser?.user?.activeCompanyId && <FiCheck className="w-5 h-5 text-black" />}
                </button>
                {companies.map(company => (
                    <div key={company._id} className="dropdown-switch-item group !p-0">
                        <button onClick={() => handleSwitchProfile(company._id)} className="flex items-center flex-grow h-full px-4 py-2 text-left">
                            <FiBriefcase className="w-5 h-5 mr-3 text-gray-400" />
                            <span className="flex-1">Work for {company.name}</span>
                            {authuser?.user?.activeCompanyId === company._id && <FiCheck className="w-5 h-5 text-black" />}
                        </button>
                        <button 
                            onClick={() => handleOpenLeaveModal(company)} 
                            title={`Leave ${company.name}`}
                            className="px-3 py-2 text-gray-400 transition-opacity duration-150 opacity-0 group-hover:opacity-100 hover:text-red-600"
                        >
                            <FiXCircle className="w-4 h-4" />
                        </button>
                    </div>
                ))}
            </>
        );
    };

    return (
        <>
            <div className="absolute right-0 z-50 w-64 mt-2 origin-top-right bg-white rounded-md shadow-lg dropdown-menu ring-1 ring-black ring-opacity-5">
                {/* ... Main dropdown structure ... */}
                <div className="py-1">
                    <div className="px-4 py-3">
                        <p className="text-xs text-gray-500">Currently working as</p>
                        <div className="flex items-center mt-1">
                            <Avatar src={activeCompanyProfile?.logo} name={activeCompanyProfile?.name || authuser?.user?.name} className="w-8 h-8 mr-2" />
                            <span className="font-semibold text-gray-800 truncate">{activeCompanyProfile?.name || 'Independent'}</span>
                        </div>
                    </div>
                    <div className="border-t border-gray-100">
                        <div className="px-4 pt-3 pb-1 text-xs font-semibold text-gray-500 uppercase">Switch Profile</div>
                        <div className="py-1">{renderProfileList()}</div>
                    </div>
                    <div className="border-t border-gray-100">
                        <div className="py-1">
                            <Link to="/profile" className="dropdown-item"><FiUser className="mr-3 text-gray-400" /> Edit Profile</Link>
                              <Link to="/settings" className="dropdown-item">
                                      <FiSettings className="mr-3 text-gray-400" />
                                      Settings
                                    </Link>
                                    <Link to="/notifications" className="dropdown-item">
                                      <FiBell className="mr-3 text-gray-400" />
                                      Notifications
                                    </Link>
                                    <Link to="/faq" className="dropdown-item">
                                      <FiHelpCircle className="mr-3 text-gray-400" />
                                      FAQs
                                    </Link>
                        </div>
                    </div>
                    <div className="border-t border-gray-100">
                        <div className="py-1">
                            <button onClick={handleLogout} className="dropdown-item w-full text-left"><FiLogOut className="mr-3 text-gray-400" /> Logout</button>
                        </div>
                    </div>
                </div>
                {isSwitching && <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75"><p>Switching...</p></div>}
            </div>
            <LeaveCompanyModal isOpen={isLeaveModalOpen} onClose={() => setIsLeaveModalOpen(false)} onConfirm={handleConfirmLeave} companyName={companyToLeave?.name} isSubmitting={isSubmittingLeave} />
        </>
    );
}

export default ProfileSwitchDropdown;