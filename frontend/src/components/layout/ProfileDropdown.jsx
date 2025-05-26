import { Link } from 'react-router-dom'
import { FiUser, FiSettings, FiBell, FiHelpCircle, FiLogOut } from 'react-icons/fi'

function ProfileDropdown() {
  return (
    <div className="absolute right-0 z-50 w-48 mt-2 origin-top-right bg-white rounded-md shadow-lg dropdown-menu">
      <div className="py-1 bg-white rounded-md ring-1 ring-black ring-opacity-5">
        <Link to="/profile" className="dropdown-item">
          <FiUser className="text-gray-500" />
          Edit Profile
        </Link>
        <Link to="/settings" className="dropdown-item">
          <FiSettings className="text-gray-500" />
          Settings
        </Link>
        <Link to="/notifications" className="dropdown-item">
          <FiBell className="text-gray-500" />
          Notifications
        </Link>
        <Link to="/faq" className="dropdown-item">
          <FiHelpCircle className="text-gray-500" />
          FAQs
        </Link>
        <button className="dropdown-item">
          <FiLogOut className="text-gray-500" />
          Logout
        </button>
      </div>
    </div>
  )
}

export default ProfileDropdown