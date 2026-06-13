import { useState, useRef, useEffect } from 'react';
import { Globe, Users, Calendar, Upload, Edit2, Building2, MapPin, ExternalLink, Briefcase } from 'lucide-react';
import CollegeDescription from './CollegeDescription';
import ProfileForm from './ProfileForm';
import axios from 'axios';
import { useLegacyAuth } from '@/context/AuthProvider';

// Configure axios to send cookies with requests
axios.defaults.withCredentials = true;

export default function CollegeProfile() {
  const [activeTab, setActiveTab] = useState('Overview');
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [backgroundImageFile, setBackgroundImageFile] = useState(null);
  const [profileImageUrl, setProfileImageUrl] = useState(null);
  const [backgroundImageUrl, setBackgroundImageUrl] = useState(null);
  const [onboardingData, setOnboardingData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { auth } = useLegacyAuth();

  const profileInputRef = useRef(null);
  const backgroundInputRef = useRef(null);
  const backendUrl = import.meta.env.VITE_Backend_URL;


  //console.log('ok')
 const handleCollegeImageUpload = async (event, imageType) => {
   const file = event.target.files[0];
   console.log(123)
   if (!file) return;

  // 1. Instant preview for UX
  const reader = new FileReader();
  reader.onloadend = () => {
    if (imageType === 'collegeImage') setProfileImageUrl(reader.result);
    if (imageType === 'backgroundImage') setBackgroundImageUrl(reader.result);
  };
  reader.readAsDataURL(file);

  // 2. Prepare Data
  const formData = new FormData();
  formData.append(imageType, file); // This matches the 'name' in Multer

  try {
    const response = await axios.put(
      `${backendUrl}/api/college/update-profile`, 
      formData,
      { withCredentials: true }
    );

    
    // 🔹 FIX: Map the backend structure to your local states
   const updatedProfile = response.data.profile;
   setOnboardingData(updatedProfile);   
    
   if (imageType === 'collegeImage') {
  setProfileImageUrl(updatedProfile.profileImage); // Use profileImage from backend
} else if (imageType === 'backgroundImage') {
  setBackgroundImageUrl(updatedProfile.backgroundImage); // Use backgroundImage from backend
}

    alert("Image updated successfully!");
  } catch (error) {
    console.error('Upload failed:', error);
  }

 
};
   

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const backendUrl = import.meta.env.VITE_Backend_URL;
        const response = await axios.get(`${backendUrl}/api/college-onboarding/profile-data`, {
          withCredentials: true,
        });
        const data = response.data.data;

        if (data) {
            setOnboardingData(data);
        // Match your Onboarding Schema field names
        setProfileImageUrl(data.profileImage || null); 
        setBackgroundImageUrl(data.backgroundImage || null);
        } else {
          setOnboardingData(null);
        }
      } catch (err) {
        console.error('Error fetching college onboarding data:', err);
        if (axios.isAxiosError(err) && err.response) {
          if (err.response.status === 404) {
            setError('No college profile data found for your account. Please complete the "Profile" tab to create one.');
          } else if (err.response.status === 401) {
            setError('Authentication required. Please log in.');
          } else {
            setError(err.response.data.message || 'Failed to load profile data.');
          }
        } else {
          setError('An unexpected error occurred.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
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

  const handleProfileImageClick = () => {
    profileInputRef.current.click();
  };

  const handleBackgroundImageClick = () => {
    backgroundInputRef.current.click();
  };

  // const handleImageChange = (e, setImageFileState, setImageUrlState) => {
  //   const file = e.target.files[0];
  //   if (file) {
  //     setImageFileState(file);
  //     const reader = new FileReader();
  //     reader.onloadend = () => {
  //       setImageUrlState(reader.result);
  //     };
  //     reader.readAsDataURL(file);
  //   }
  // };

  const handleProfileUpdate = (updatedData) => {
    setOnboardingData(updatedData);
    setProfileImageUrl(updatedData.placementCoordinatorDetails?.profilePictureUrl || null);
    setBackgroundImageUrl(updatedData.profileAchievements?.backgroundImageUrl || null);
    setActiveTab('Overview');
  };

  const renderContent = () => {
    if (loading) return (
      <div className="flex items-center justify-center min-h-[400px] bg-white rounded-xl">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-10 w-10 border-[3px] border-[#1e4ed8] border-t-transparent"></div>
          <p className="mt-3 text-gray-600">Loading college profile...</p>
        </div>
      </div>
    );

    if (error && !onboardingData && activeTab !== 'Profile') {
      return (
        <div className="flex items-center justify-center min-h-[400px] bg-white rounded-xl">
          <div className="text-center max-w-md p-8">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-100 text-red-600 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-lg font-medium text-gray-900">{error}</p>
            <p className="text-sm text-gray-600 mt-2">You can create your profile in the "Profile" tab.</p>
            <button
              onClick={() => setActiveTab('Profile')}
              className="mt-4 px-6 py-3 bg-gradient-to-r from-[#143694] to-[#1e4ed8] text-white rounded-xl hover:shadow-lg hover:shadow-[#143694]/40 transition-all duration-200"
            >
              Go to Profile Form
            </button>
          </div>
        </div>
      );
    }

    if (!onboardingData && activeTab === 'Overview') return (
      <div className="flex items-center justify-center min-h-[400px] bg-white rounded-xl">
        <div className="text-center max-w-md p-8">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-gray-100 mb-4">
            <Building2 className="h-6 w-6 text-gray-400" />
          </div>
          <p className="text-gray-600">No college profile data available.</p>
        </div>
      </div>
    );

    switch (activeTab) {
      case 'Overview':
        return <CollegeDescription onboardingData={onboardingData} />;
      case 'Profile':
        return (
          <ProfileForm
            onboardingData={onboardingData}
            profileImageFile={profileImageFile}
            backgroundImageFile={backgroundImageFile}
            setProfileImageFile={setProfileImageFile}
            setBackgroundImageFile={setBackgroundImageFile}
            setProfileImageUrl={setProfileImageUrl}
            setBackgroundImageUrl={setBackgroundImageUrl}
            onProfileUpdate={handleProfileUpdate}
          />
        );
      default:
        return null;
    }
  };

  const coordinatorName = onboardingData?.placementCoordinatorDetails?.coordinatorName || 'Not Set';
  const designation = onboardingData?.placementCoordinatorDetails?.designation || 'Not Set';
  const collegeName = onboardingData?.collegeUniversityDetails?.collegeName || 'College Name';
  const linkedinUrl = onboardingData?.placementCoordinatorDetails?.linkedinUrl || '#';
  const collegeWebsite = onboardingData?.profileAchievements?.collegeWebsite || '#';
  const establishedYear = onboardingData?.collegeUniversityDetails?.establishedYear ?
    new Date(onboardingData.collegeUniversityDetails.establishedYear).getFullYear() : 'N/A';
  
  const city = onboardingData?.collegeUniversityDetails?.city || '';
  const state = onboardingData?.collegeUniversityDetails?.state || '';
  const country = onboardingData?.collegeUniversityDetails?.country || '';
  const collegeLocation = onboardingData?.collegeUniversityDetails?.collegeLocation || '';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Banner */}
      {/* Header Banner */}
<div className="relative h-48 cursor-pointer group" onClick={handleBackgroundImageClick}>
  {/* Background Gradient */}
  <div className="absolute inset-0 bg-gradient-to-br from-[#143694]/20 via-[#1e4ed8]/10 to-[#1e40af]/20"></div>

  {backgroundImageUrl && (
    <div className="absolute inset-0">
      <img
        src={backgroundImageUrl}
        alt="Banner"
        className="w-full h-full object-cover opacity-15"
      />
    </div>
  )}

  {/* Content Overlay */}
  <div className="absolute inset-0 bg-gradient-to-br from-[#143694]/15 via-[#1e4ed8]/8 to-[#1e40af]/15 backdrop-blur-sm"></div>

  {/* Banner Upload Icon - Now clearly visible on hover */}
  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-2 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm">
    <Upload className="h-4 w-4 text-gray-700" />
  </div>

  {/* Hidden Background Input */}
  <input
    type="file"
    ref={backgroundInputRef}
    onChange={(e) => handleCollegeImageUpload(e, 'backgroundImage')} 
    accept="image/*"
    className="hidden"
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
                <div className="relative group cursor-pointer" onClick={handleProfileImageClick}>
                  <div className="w-32 h-32 rounded-full border-4 border-white shadow-lg overflow-hidden bg-gradient-to-br from-[#143694]/20 to-[#1e4ed8]/10">
                    {profileImageUrl ? (
                      <img
                        src={profileImageUrl}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="w-20 h-20 bg-gradient-to-br from-[#143694]/30 to-[#1e4ed8]/20 rounded-full flex items-center justify-center">
                          <Building2 className="h-12 w-12 text-white" />
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Upload className="h-6 w-6 text-white" />
                  </div>
                </div>
              <input
    type="file"
    ref={profileInputRef}
    onChange={(e) => handleCollegeImageUpload(e, 'collegeImage')} // Changed from handleImageChange
    accept="image/*"
    className="hidden"
  />
              </div>

              {/* College Info */}
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                      {collegeName}
                    </h1>
                    
                    {/* Coordinator Info */}
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-8 h-8 bg-gradient-to-br from-[#f9a8d4]/20 to-[#ec4899]/10 rounded-lg flex items-center justify-center">
                        <Users className="w-4 h-4 text-[#ec4899]" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{coordinatorName}</p>
                        <p className="text-xs text-gray-500">{designation}</p>
                      </div>
                    </div>
                  </div>
                  
                  {activeTab !== 'Profile' && onboardingData && (
                    <button
                      onClick={() => setActiveTab('Profile')}
                      className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#143694]/10 to-[#1e4ed8]/10 text-[#1e4ed8] rounded-lg hover:from-[#143694]/20 hover:to-[#1e4ed8]/20 transition-all duration-200"
                    >
                      <Edit2 className="w-4 h-4" />
                      Edit Profile
                    </button>
                  )}
                </div>

                {/* College Details */}
                <div className="flex flex-wrap items-center gap-4 mt-4">
                  {/* {collegeLocation && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin className="h-4 w-4 text-[#1e4ed8]" />
                      <span className="text-sm">{collegeLocation}</span>
                    </div>
                  )} */}

                  {(city || state || country) && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin className="h-4 w-4 text-[#1e4ed8]" />
                      <span className="text-sm">
                        {[city, state, country].filter(Boolean).join(', ') || 'Location not specified'}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="h-4 w-4 text-[#1e4ed8]" />
                    <span className="text-sm">Est. {establishedYear}</span>
                  </div>
                </div>

                {/* Social Links */}
                <div className="flex flex-wrap items-center gap-3 mt-4">
                  {linkedinUrl && linkedinUrl !== '#' && (
                    <a
                      href={linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-[#143694] rounded-lg hover:bg-blue-100 transition-all duration-200 text-sm"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"></path>
                      </svg>
                      LinkedIn
                    </a>
                  )}
                  
                  {collegeWebsite && collegeWebsite !== '#' && (
                    <a
                      href={collegeWebsite}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-all duration-200 text-sm"
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
              {['Overview', 'Profile'].map((tab) => (
                <button
                  key={tab}
                  className={`flex-1 px-6 py-4 text-sm font-medium transition-colors relative ${
                    activeTab === tab
                      ? 'text-[#1e4ed8]'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                  {activeTab === tab && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#1e4ed8]"></div>
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