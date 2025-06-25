// import { useState } from 'react';
// import { Globe, Users, Calendar } from 'lucide-react';
// import Overview from './CompanyOverview';
// import EmployerProfileForm from './CompanyProfileForm';
// import EmployerUserManagement from './UserManagement';

// export default function EmployerProfile() {
//   const [activeTab, setActiveTab] = useState('Overview');

//   const renderContent = () => {
//     switch (activeTab) {
//       case 'Overview':
//         return <Overview />;
//       case 'Profile':
//         return <EmployerProfile />;
//       case 'Users':
//         return <EmployerUserManagement />;
//       default:
//         return null;
//     }
//   };

//   return (
//     <div className="flex flex-col w-full bg-gray-100 min-h-screen">
//       {/* Header Banner */}
//       <div className="w-full h-32 bg-gray-300"></div>

//       {/* Profile Section */}
//       <div className="bg-white pb-4">
//         <div className="relative px-4">
//           {/* Profile Image */}
//           <div className="absolute -top-16 left-4">
//             <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center border-4 border-white">
//               <div className="text-gray-400">
//                 <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
//                 </svg>
//               </div>
//             </div>
//           </div>

//           {/* Profile Info */}
//           <div className="pt-16 pb-2 pl-2">
//             <h1 className="text-xl font-bold">Employee Name</h1>
//             <p className="text-gray-500 text-sm">Designation</p>
//           </div>
//         </div>

//         {/* Company Info */}
//         <div className="px-6 pt-4">
//           <h2 className="text-2xl font-bold">Company Name</h2>

//           <div className="flex flex-wrap items-center gap-6 mt-2">
//             <div className="flex items-center gap-2 text-sm text-gray-600">
//               <Users size={16} className="text-gray-500" />
//               <span>11-50 Employees</span>
//             </div>

//             <div className="flex items-center gap-2 text-sm text-gray-600">
//               <Calendar size={16} className="text-gray-500" />
//               <span>Established Year: July 1, 2023</span>
//             </div>
//           </div>

//           {/* Social Links */}
//           <div className="flex justify-between mt-4">
//             <div></div>
//             <div className="flex gap-2">
//               <a href="#" className="flex items-center justify-center w-8 h-8 border border-gray-300 rounded">
//                 <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
//                   <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"></path>
//                 </svg>
//               </a>
//               <a href="#" className="border border-gray-300 rounded px-4 py-1 text-sm flex items-center">
//                 <Globe size={14} className="mr-1 text-gray-600" />
//                 Website
//               </a>
//             </div>
//           </div>
//         </div>

//         {/* Tabs */}
//         <div className="flex border-b mt-4">
//           {['Overview', 'Profile', 'Users'].map((tab) => (
//             <button
//               key={tab}
//               className={`px-6 py-2 ${activeTab === tab ? 'border-b-2 border-black font-medium' : 'text-gray-500'}`}
//               onClick={() => setActiveTab(tab)}
//             >
//               {tab}
//             </button>
//           ))}
//         </div>
//       </div>

//       {/* Tab Content */}
//       <div className="p-4">
//         {renderContent()}
//       </div>
//     </div>
//   );
// }

import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import { Globe, Users, Calendar, Camera } from 'lucide-react'; // Added Camera icon
import Overview from './CompanyOverview';
import EmployerProfileForm from './CompanyProfileForm';
import EmployerUserManagement from './UserManagement';

export default function EmployerProfile() {
  const [activeTab, setActiveTab] = useState('Overview');
  const [employerData, setEmployerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false); // New state for upload loading
  const [uploadError, setUploadError] = useState(null); // New state for upload errors

  // Refs for hidden file inputs
  const profileImageInputRef = useRef(null);
  const backgroundImageInputRef = useRef(null);

  // Memoize fetchEmployerData to prevent unnecessary re-creation
  const fetchEmployerData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${import.meta.env.VITE_Backend_URL}/api/dashboard/employer-data`, {
        withCredentials: true,
      });
      setEmployerData(response.data.profile);
    } catch (err) {
      console.error('Error fetching employer data:', err);
      if (err.response?.status === 404) {
        setEmployerData(null); // Explicitly set to null if not found
        setError('No employer profile found. Please create one.');
      } else {
        setError(err.response?.data?.message || 'Failed to fetch employer data.');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEmployerData();
  }, [fetchEmployerData]);

  const handleProfileUpdated = (updatedProfile) => {
    setEmployerData(updatedProfile); // Update the state with the new data
    setActiveTab('Overview'); // Switch back to Overview after successful update
  };

  // --- Image Upload Logic ---
  const handleImageUpload = async (event, imageType) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploadingImage(true);
    setUploadError(null);

    const formData = new FormData();
    formData.append('image', file); // 'image' is the field name expected by Multer on backend
    formData.append('imageType', imageType); // 'profile' or 'background'

    try {
      // Calling the NEW dedicated image upload endpoint
      const response = await axios.post(`${import.meta.env.VITE_Backend_URL}/api/dashboard/upload-single-image`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // Crucial for file uploads
        },
        withCredentials: true, // Send cookies with the request
      });

      const newImageUrl = response.data.imageUrl;

      setEmployerData((prevData) => {
        // This logic ensures that if no profile existed before, we create a basic structure
        // with the uploaded image URL, preparing it for subsequent full profile creation.
        // If profile exists, it updates the specific image URL.
        const currentEmployerDetails = prevData?.employerDetails || {};
        const updatedEmployerDetails = { ...currentEmployerDetails };

        if (imageType === 'profile') {
          updatedEmployerDetails.profileImageUrl = newImageUrl;
        } else if (imageType === 'background') {
          updatedEmployerDetails.backgroundImageUrl = newImageUrl;
        }

        return {
          ...prevData,
          employerDetails: updatedEmployerDetails,
          // Ensure other top-level fields are initialized if prevData was null
          companyDetails: prevData?.companyDetails || {},
          hiringPreferences: prevData?.hiringPreferences || {},
        };
      });

    } catch (err) {
      console.error(`Error uploading ${imageType} image:`, err);
      setUploadError(err.response?.data?.message || `Failed to upload ${imageType} image.`);
    } finally {
      setUploadingImage(false);
      // Reset file input to allow uploading the same file again if needed
      event.target.value = ''; // Important for subsequent uploads of the same file
    }
  };

  const renderContent = () => {
    if (loading) {
      return <div className="p-4 text-center text-gray-600">Loading profile...</div>;
    }

    if (!employerData && activeTab !== 'Profile') {
      return (
        <div className="p-4 text-center text-gray-700">
          <p className="mb-4">{error || 'No employer profile found. Please create one to get started.'}</p>
          <button
            onClick={() => setActiveTab('Profile')}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Create Your Profile
          </button>
        </div>
      );
    }

    switch (activeTab) {
      case 'Overview':
        return <Overview employerData={employerData} />;
      case 'Profile':
        return <EmployerProfileForm employerData={employerData} onProfileUpdated={handleProfileUpdated} />;
      case 'Users':
        return <EmployerUserManagement />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col w-full bg-gray-100 min-h-screen">
      {/* Header Banner */}
      <div
        className="w-full h-32 bg-gray-300 relative group cursor-pointer overflow-hidden"
        onClick={() => backgroundImageInputRef.current.click()}
      >
        {/* Display existing background image or a placeholder */}
        {employerData?.employerDetails?.backgroundImageUrl ? (
          <img
            src={employerData.employerDetails.backgroundImageUrl}
            alt="Company Background"
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-300 text-gray-500 text-sm group-hover:bg-gray-400 transition-colors">
            <Camera size={24} className="mr-2" /> Upload Background Image
          </div>
        )}
        {/* Hidden file input for background image */}
        <input
          type="file"
          ref={backgroundImageInputRef}
          className="hidden"
          accept="image/*"
          onChange={(e) => handleImageUpload(e, 'background')}
        />
        {/* Loading and error indicators for background image upload */}
        {uploadingImage && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white">
            Uploading...
          </div>
        )}
        {uploadError && (
          <div className="absolute inset-0 flex items-center justify-center bg-red-800 bg-opacity-75 text-white text-sm">
            {uploadError}
          </div>
        )}
      </div>

      {/* Profile Section */}
      <div className="bg-white pb-4">
        <div className="relative px-4">
          {/* Profile Image */}
          <div
            className="absolute -top-16 left-4 w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center border-4 border-white overflow-hidden group cursor-pointer"
            onClick={() => profileImageInputRef.current.click()}
          >
            {/* Display existing profile image or a placeholder */}
            {employerData?.employerDetails?.profileImageUrl ? (
              <img
                src={employerData.employerDetails.profileImageUrl}
                alt="Profile"
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            ) : (
              <div className="text-gray-400 flex flex-col items-center justify-center text-sm group-hover:bg-gray-300 w-full h-full transition-colors">
                <Camera size={24} /> Upload
              </div>
            )}
            {/* Hidden file input for profile image */}
            <input
              type="file"
              ref={profileImageInputRef}
              className="hidden"
              accept="image/*"
              onChange={(e) => handleImageUpload(e, 'profile')}
            />
          </div>

          {/* Profile Info */}
          <div className="pt-16 pb-2 pl-2">
            <h1 className="text-3xl font-bold">{employerData?.employerDetails?.name || 'Your Name'}</h1>
            <p className="text-gray-500 text-sm">{employerData?.employerDetails?.designation || 'Your Designation'}</p>
          </div>
        </div>

        {/* Company Info */}
        <div className="px-6 pt-4">
          <h2 className="text-xl font-bold">Company :  {employerData?.companyDetails?.companyName || 'Company Name'}</h2>

          <div className="flex flex-wrap items-center gap-6 mt-2">
            {/* Note: numberOfEmployees and companyWebsite are not in your EmployerOnboarding schema.
                If you need them, please add them to the schema. Using optional chaining for now.
            */}
            {employerData?.companyDetails?.numberOfEmployees && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Users size={16} className="text-gray-500" />
                <span>{employerData.companyDetails.numberOfEmployees} Employees</span>
              </div>
            )}

            {employerData?.companyDetails?.establishedYear && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar size={16} className="text-gray-500" />
                <span>Established Year: {employerData.companyDetails.establishedYear}</span>
              </div>
            )}
          </div>

          {/* Social Links */}
          <div className="flex justify-between mt-4">
            <div></div>
            <div className="flex gap-2">
              {employerData?.employerDetails?.linkedIn && (
                <a href={employerData.employerDetails.linkedIn} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-8 h-8 border border-gray-300 rounded">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"></path>
                  </svg>
                </a>
              )}
              {employerData?.companyDetails?.companyWebsite && (
                <a href={employerData.companyDetails.companyWebsite} target="_blank" rel="noopener noreferrer" className="border border-gray-300 rounded px-4 py-1 text-sm flex items-center">
                  <Globe size={14} className="mr-1 text-gray-600" />
                  Website
                </a>
              )}
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