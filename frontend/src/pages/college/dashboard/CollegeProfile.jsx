import { useState, useRef } from 'react';
import { Globe, Users, Calendar } from 'lucide-react';
import CollegeDescription from './CollegeDescription';
import ProfileForm from './ProfileForm';
import UserManagements from './UserManagements';

export default function CollegeProfile() {
  const [activeTab, setActiveTab] = useState('Overview');
  const [profileImage, setProfileImage] = useState(null);
  const [backgroundImage, setBackgroundImage] = useState(null);
  const profileInputRef = useRef(null);
  const backgroundInputRef = useRef(null);

  const handleProfileImageClick = () => {
    profileInputRef.current.click();
  };

  const handleBackgroundImageClick = () => {
    backgroundInputRef.current.click();
  };

  const handleImageChange = (e, setImage) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'Overview':
        return <CollegeDescription />;
      case 'Profile':
        return <ProfileForm />;
      case 'Users':
        return <UserManagements />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col w-full bg-gray-100 min-h-screen">
      {/* Header Banner with upload functionality */}
      <div 
        className="w-full h-32 bg-gray-300 relative cursor-pointer"
        onClick={handleBackgroundImageClick}
      >
        {backgroundImage && (
          <img 
            src={backgroundImage} 
            alt="Background" 
            className="w-full h-full object-cover"
          />
        )}
        <input
          type="file"
          ref={backgroundInputRef}
          onChange={(e) => handleImageChange(e, setBackgroundImage)}
          accept="image/*"
          className="hidden"
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 hover:bg-opacity-20 transition-all duration-300">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-8 w-8 text-white opacity-0 hover:opacity-100" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </div>
      </div>

      {/* Profile Section */}
      <div className="bg-white pb-4">
        <div className="relative px-4">
          {/* Profile Image */}
          <div className="absolute -top-16 left-4">
            <div 
              className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center border-4 border-white cursor-pointer overflow-hidden"
              onClick={handleProfileImageClick}
            >
              {profileImage ? (
                <img 
                  src={profileImage} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
            </div>
            <input
              type="file"
              ref={profileInputRef}
              onChange={(e) => handleImageChange(e, setProfileImage)}
              accept="image/*"
              className="hidden"
            />
          </div>

          {/* Profile Info */}
          <div className="pt-16 pb-2 pl-2">
            <h1 className="text-xl font-bold">Coordinator Name</h1>
            <p className="text-gray-500 text-sm">Designation</p>
          </div>
        </div>

        {/* College Info */}
        <div className="px-6 pt-4">
          <h2 className="text-2xl font-bold">College Name</h2>

          <div className="flex flex-wrap items-center gap-6 mt-2">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Users size={16} className="text-gray-500" />
              <span>11-50 Employees</span>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar size={16} className="text-gray-500" />
              <span>Established Year: July 1, 2023</span>
            </div>
          </div>

          {/* Social Links */}
          <div className="flex justify-between mt-4">
            <div></div>
            <div className="flex gap-2">
              <a href="#" className="flex items-center justify-center w-8 h-8 border border-gray-300 rounded">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"></path>
                </svg>
              </a>
              <a href="#" className="border border-gray-300 rounded px-4 py-1 text-sm flex items-center">
                <Globe size={14} className="mr-1 text-gray-600" />
                Website
              </a>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b mt-4">
          {['Overview', 'Profile', 'Users'].map((tab) => (
            <button
              key={tab}
              className={`px-6 py-2 ${activeTab === tab ? 'border-b-2 border-black font-medium' : 'text-gray-500'}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="p-4">
        {renderContent()}
      </div>
    </div>
  );
}