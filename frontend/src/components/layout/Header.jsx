import { useEffect, useRef, useState } from 'react'
import { FiMenu, FiBell, FiChevronDown } from 'react-icons/fi'
import SearchBar from '../ui/SearchBar'
import ProfileDropdown from './ProfileDropdown'
import Avatar from '../ui/Avatar'

function Header({ sidebarOpen, setSidebarOpen, profileOpen, setProfileOpen }) {
  const profileRef = useRef(null)
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false)
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [setProfileOpen])
  
  return (
    <header className="sticky top-0 z-10 flex items-center h-16 px-4 bg-white border-b border-gray-200 shadow-sm">
      {/* Mobile menu button */}
      <button
        type="button"
        className="p-2 mr-4 text-gray-500 rounded-md lg:hidden hover:text-gray-900 hover:bg-gray-100 focus:outline-none"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        <span className="sr-only">Open sidebar</span>
        <FiMenu className="w-6 h-6" aria-hidden="true" />
      </button>
      
      {/* Search */}
      <div className="flex-1 max-w-2xl mx-auto lg:max-w-xs">
        <SearchBar placeholder="Search" />
      </div>
      
      {/* Right section */}
      <div className="flex items-center ml-4 space-x-4">
        {/* Notifications */}
        <button
          type="button"
          className="relative p-1 text-gray-500 rounded-full hover:text-gray-900 hover:bg-gray-100 focus:outline-none"
        >
          <span className="sr-only">View notifications</span>
          <FiBell className="w-6 h-6" aria-hidden="true" />
          <span className="absolute top-0 right-0 block w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        
        {/* Profile dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            type="button"
            className="flex items-center max-w-xs text-sm rounded-full focus:outline-none"
            onClick={() => setProfileOpen(!profileOpen)}
          >
            <span className="sr-only">Open user menu</span>
            <Avatar name="John Doe" />
            <span className="hidden ml-2 mr-1 font-medium text-gray-700 md:block">
              Name Surname
            </span>
            <FiChevronDown
              className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
                profileOpen ? 'transform rotate-180' : ''
              }`}
            />
          </button>
          
          {/* Dropdown menu */}
          {profileOpen && <ProfileDropdown />}
        </div>
      </div>
    </header>
  )
}

export default Header