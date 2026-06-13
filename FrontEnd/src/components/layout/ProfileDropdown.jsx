import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FiUser, FiSettings, FiBell, FiHelpCircle, FiLogOut } from 'react-icons/fi';
import Cookies from "js-cookie";
import { useLegacyAuth } from '@/context/AuthProvider';

function StandardProfileDropdown() {
  const navigate = useNavigate();
const [authUser, setAuthUserStable] = useLegacyAuth();
  const handleLogout = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_Backend_URL}/api/auth/logout`, {}, { withCredentials: true });
      localStorage.clear();
      Cookies.remove("jwt", { path: '/' });
     //setAuth({ user: null, token: null });
     setAuthUserStable(null);
      navigate('/', { replace: true });
     //window.location.href = "/";
    } catch (error) {
      console.error('Logout failed:', error);
      localStorage.clear();
      alert('Logout failed. Please try again.');
    }
  };

  const getProfileRoute = () => {
    if (!authUser || !authUser.user) return '/';

    const userType = authUser.user.userType || '';
    // console.log("User type kya hai ", userType);
    // console.log(userType)
    switch (userType) {
      case 'student':
        return '/profile?editProfile=true';
      case 'fresher':
        return '/fresherprofile?editProfile=true';
      case 'college':
        return '/college-profile?editProfile=true';
      case 'company':
        return '/company-profile?editProfile=true';
      case 'professional':
        return '/profprofile?editProfile=true';
    }
  };
 if (!authUser) return null;
  const profileRoute = getProfileRoute();

  return (
    <div className="absolute right-0 z-50 w-48 mt-2 origin-top-right bg-white rounded-md shadow-lg dropdown-menu ring-1 ring-black ring-opacity-5">
      <div className="py-1">
        <Link to={profileRoute} className="dropdown-item">
          <FiUser className="mr-3 text-gray-400" />
          Profile
        </Link>
        {/*<Link to="/settings" className="dropdown-item">
          <FiSettings className="mr-3 text-gray-400" />
          Settings
        </Link>
        <Link to="/notifications" className="dropdown-item">
          <FiBell className="mr-3 text-gray-400" />
          Notifications
        </Link>*/}
        <Link to="/faq" className="dropdown-item">
          <FiHelpCircle className="mr-3 text-gray-400" />
          FAQs
        </Link>
        <div className="border-t border-gray-100"></div>
        <button onClick={handleLogout} className="dropdown-item">
          <FiLogOut className="mr-3 text-gray-400" />
          Logout
        </button>
      </div>
    </div>
  );
}

export default StandardProfileDropdown;