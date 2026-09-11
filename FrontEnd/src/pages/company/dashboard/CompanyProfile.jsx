import { useState, useEffect } from 'react';
import { Globe, Users, Calendar, Image, Upload, Building2, Briefcase, MapPin } from 'lucide-react';
import CompanyOverview from './CompanyOverview';
import CompanyProfileForm from './CompanyProfileForm';
import UserManagement from './UserManagement';
import axios from '../../../lib/axiosInstance';
import { useLegacyAuth } from '@/context/AuthProvider';

export default function CompanyProfile() {
  const [activeTab, setActiveTab] = useState('Overview');
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { auth } = useLegacyAuth();

  const backendUrl = import.meta.env.VITE_Backend_URL || 'http://localhost:5000';

  const fetchProfileData = async () => {
    setLoading(true);
    setError(null);

    try {
      console.log('Fetching profile data...');
      const response = await axios.get(`${backendUrl}/api/companyDashboard/getInformation`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        withCredentials: true,
      });
      console.log('Profile data fetched:', response.data);
      setProfileData(response.data.profile);
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError('Failed to load profile data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, []);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const fromEditProfile = urlParams.get('editProfile');

    if (fromEditProfile === 'true') {
      setActiveTab('Profile');
      const newUrl = window.location.pathname;
      window.history.replaceState({}, '', newUrl);
    }
  }, []);
 
  const handleImageUpload = async (event, imageType) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append(imageType === 'backgroundImage' ? 'backgroundImage' : 'profileImage', file);

    try {
      const response = await axios.put(`${backendUrl}/api/companyDashboard/updateInformation`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setProfileData(response.data.profile);
      alert(`${imageType === 'backgroundImage' ? 'Background' : 'Profile'} image updated successfully!`);
    } catch (err) {
      console.error(`Error uploading ${imageType} image:`, err);
      alert(`Failed to upload ${imageType} image. Make sure it's a valid image file.`);
    }
  };

  const renderContent = () => {
    if (loading) return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-10 w-10 border-[3px] border-[#143694] border-t-transparent"></div>
          <p className="mt-3 text-gray-600">Loading company profile...</p>
        </div>
      </div>
    );

    if (error) return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center max-w-md p-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-100 text-red-600 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-lg font-medium text-gray-900">{error}</p>
          <button
            onClick={fetchProfileData}
            className="mt-4 px-4 py-2 bg-[#143694] text-white text-sm rounded-lg hover:bg-[#5a6fd8] transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );

    if (!profileData) return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center max-w-md p-8">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-gray-100 mb-4">
            <Building2 className="h-6 w-6 text-gray-400" />
          </div>
          <p className="text-gray-600">No company profile data available.</p>
        </div>
      </div>
    );

    switch (activeTab) {
      case 'Overview':
        return <CompanyOverview profileData={profileData} />;
      case 'Profile':
        return <CompanyProfileForm profileData={profileData} onProfileUpdate={fetchProfileData} />;
      case 'Users':
        return <UserManagement />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Banner */}
      <div className="relative h-48">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#143694]/20 via-[#f093fb]/10 to-[#1e4ed8]/20"></div>

        {profileData?.backgroundImageUrl && (
          <div className="absolute inset-0">
            <img
              src={profileData.backgroundImageUrl}
              alt="Banner"
              className="w-full h-full object-cover opacity-15"
            />
          </div>
        )}

        {/* Content Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#143694]/15 via-[#f093fb]/8 to-[#1e4ed8]/15 backdrop-blur-sm"></div>

        {/* Banner Upload Overlay */}
        <label
          htmlFor="backgroundImageUpload"
          className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-2 cursor-pointer hover:bg-white transition-colors shadow-sm"
        >
          <Upload className="h-4 w-4 text-gray-700" />
        </label>
        <input
          id="backgroundImageUpload"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleImageUpload(e, 'backgroundImage')}
        />
      </div>

      {/* Main Container */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-10">
        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
          {/* Profile Header */}
          <div className="px-8 pt-8 pb-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              {/* Profile Image */}
              <div className="relative">
                <label htmlFor="profileImageUpload" className="relative group cursor-pointer">
                  <div className="w-32 h-32 rounded-full border-4 border-white shadow-lg overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                    {profileData?.profileImageUrl ? (
                      <img
                        src={profileData.profileImageUrl}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Building2 className="h-16 w-16 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Upload className="h-6 w-6 text-white" />
                  </div>
                </label>
                <input
                  id="profileImageUpload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleImageUpload(e, 'profileImage')}
                />
              </div>

              {/* Company Info */}
              <div className="flex-1">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                  {profileData?.companyDetails?.companyName || 'Company Name'}
                </h1>

                <div className="flex flex-wrap items-center gap-4 mt-3">
                  {profileData?.companyDetails?.industryType && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <Briefcase className="h-4 w-4 text-[#143694]" />
                      <span className="text-sm">{profileData.companyDetails.industryType}</span>
                    </div>
                  )}

                  {profileData?.companyDetails?.companyLocation && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin className="h-4 w-4 text-[#143694]" />
                      <span className="text-sm">{profileData.companyDetails.companyLocation}</span>
                    </div>
                  )}

                  <div className="flex items-center gap-2 text-gray-600">
                    <Users className="h-4 w-4 text-[#143694]" />
                    <span className="text-sm">{profileData?.companyDetails?.numberOfEmployees || 'N/A'} Employees</span>
                  </div>

                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="h-4 w-4 text-[#143694]" />
                    <span className="text-sm">Est. {profileData?.companyDetails?.establishedYear || 'N/A'}</span>
                  </div>
                </div>

                {/* Social Links */}
                <div className="flex flex-wrap items-center gap-3 mt-4">
                  {profileData?.companyDetails?.companyLinkedin && (
                    <a
                      href={profileData.companyDetails.companyLinkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-[#143694] rounded-lg hover:bg-blue-100 transition-colors text-sm"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"></path>
                      </svg>
                      LinkedIn
                    </a>
                  )}
                  {profileData?.companyDetails?.websiteUrl && (
                    <a
                      href={profileData.companyDetails.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors text-sm"
                    >
                      <Globe className="h-4 w-4" />
                      Website
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-t border-gray-100">
            <nav className="flex">
              {['Overview', 'Profile', 'Users'].map((tab) => (
                <button
                  key={tab}
                  className={`flex-1 px-6 py-4 text-sm font-medium transition-colors relative ${
                    activeTab === tab
                      ? 'text-[#143694]'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                  {activeTab === tab && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#143694]"></div>
                  )}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="pb-8">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}