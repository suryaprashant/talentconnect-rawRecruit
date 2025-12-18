// src/pages/employerDashboard/CompanyProfile.jsx

import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import axios from "axios";
import { Globe, Users, Calendar, Camera } from "lucide-react";
import Overview from "./CompanyOverview";
import EmployerProfileForm from "./CompanyProfileForm";
import EmployerUserManagement from "./UserManagement";
import { useAuth } from "@/context/AuthProvider";

export default function EmployerProfile() {
  const [activeTab, setActiveTab] = useState("Overview");
  const [employerData, setEmployerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadError, setUploadError] = useState(null);

  const profileImageInputRef = useRef(null);
  const backgroundImageInputRef = useRef(null);

  // LinkedIn-authenticated user
  const [authUser] = useAuth();
  const linkedInUser = authUser?.user || null;

  const fetchEmployerData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_Backend_URL}/api/dashboard/employer-data`,
        {
          withCredentials: true,
        }
      );
      setEmployerData(response.data.profile);
    } catch (err) {
      console.error("Error fetching employer data:", err);
      if (err.response?.status === 404) {
        setEmployerData(null);
        setError("No employer profile found. Please create one.");
      } else {
        setError(
          err.response?.data?.message || "Failed to fetch employer data."
        );
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEmployerData();
  }, [fetchEmployerData]);

  const handleProfileUpdated = (updatedProfile) => {
    setEmployerData(updatedProfile);
    setActiveTab("Overview");
  };

  const handleImageUpload = async (event, imageType) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploadingImage(true);
    setUploadError(null);

    const formData = new FormData();
    formData.append("image", file);
    formData.append("imageType", imageType);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_Backend_URL}/api/dashboard/upload-single-image`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );

      const newImageUrl = response.data.imageUrl;

      setEmployerData((prevData) => ({
        ...prevData,
        ...(imageType === "profile" && { profileImageUrl: newImageUrl }),
        ...(imageType === "background" && { backgroundImageUrl: newImageUrl }),
        employerDetails: prevData?.employerDetails || {},
        companyDetails: prevData?.companyDetails || {},
      }));
    } catch (err) {
      console.error(`Error uploading ${imageType} image:`, err);
      setUploadError(
        err.response?.data?.message ||
          `Failed to upload ${imageType} image.`
      );
    } finally {
      setUploadingImage(false);
      event.target.value = "";
    }
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const fromEditProfile = urlParams.get("editProfile");
    if (fromEditProfile === "true") {
      setActiveTab("Profile");
      const newUrl = window.location.pathname;
      window.history.replaceState({}, "", newUrl);
    }
  }, []);

  // Display values with LinkedIn fallback
  const employerName =
    employerData?.employerDetails?.name ||
    linkedInUser?.name ||
    "Your Name";

  const employerEmail =
    employerData?.employerDetails?.email ||
    linkedInUser?.email ||
    "Email not set";

  const profileImageSrc =
    employerData?.profileImageUrl || linkedInUser?.profileImage || null;

  const designation =
    employerData?.employerDetails?.designation || "Your Designation";

  const renderContent = () => {
    if (loading) {
      return (
        <div className="rounded-lg border bg-white p-4">
          <p>Loading employer profile...</p>
        </div>
      );
    }

    if (error && !employerData) {
      return (
        <div className="rounded-lg border bg-white p-4">
          <p className="mb-2 text-red-500">{error}</p>
          <p className="text-sm text-gray-600">
            Please complete the Profile tab to create your employer profile.
          </p>
        </div>
      );
    }

    switch (activeTab) {
      case "Overview":
        return <Overview employerData={employerData} />;
      case "Profile":
        return (
          <EmployerProfileForm
            employerData={employerData}
            onProfileUpdated={handleProfileUpdated}
            onImageUpload={handleImageUpload}
            uploadingImage={uploadingImage}
            uploadError={uploadError}
            profileImageInputRef={profileImageInputRef}
            backgroundImageInputRef={backgroundImageInputRef}
          />
        );
      case "Users":
        return (
          <EmployerUserManagement employerProfile={employerData} />
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with LinkedIn-aware data */}
      <section className="relative overflow-hidden rounded-lg bg-gray-900 text-white">
        {employerData?.backgroundImageUrl && (
          <img
            src={employerData.backgroundImageUrl}
            alt="Background"
            className="absolute inset-0 h-full w-full object-cover opacity-60"
          />
        )}
        <div className="relative flex flex-col gap-4 p-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              {profileImageSrc ? (
                <img
                  src={profileImageSrc}
                  alt={employerName}
                  className="h-16 w-16 rounded-full border-2 border-white object-cover"
                />
              ) : (
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-700 text-2xl font-semibold">
                  {employerName.charAt(0).toUpperCase()}
                </div>
              )}
              <button
                type="button"
                onClick={() => profileImageInputRef.current?.click()}
                className="absolute bottom-0 right-0 flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-xs"
              >
                <Camera className="h-3 w-3" />
              </button>
            </div>
            <div>
              <h1 className="text-xl font-semibold md:text-2xl">
                {employerName}
              </h1>
              <p className="text-sm text-gray-200">{designation}</p>
              <p className="mt-1 text-xs text-gray-300">
                {employerEmail}
              </p>
            </div>
          </div>

          <div className="flex gap-4 text-xs md:text-sm">
            <div className="flex items-center gap-1">
              <Globe className="h-4 w-4" />
              <span>
                {employerData?.companyDetails?.website ||
                  "Website not set"}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>
                {employerData?.companyDetails?.companySize ||
                  "Company size not set"}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>
                Founded{" "}
                {employerData?.companyDetails?.foundedYear || "N/A"}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Hidden file inputs controlled by header buttons */}
      <input
        type="file"
        accept="image/*"
        ref={profileImageInputRef}
        className="hidden"
        onChange={(e) => handleImageUpload(e, "profile")}
      />
      <input
        type="file"
        accept="image/*"
        ref={backgroundImageInputRef}
        className="hidden"
        onChange={(e) => handleImageUpload(e, "background")}
      />

      {/* Tabs */}
      <div className="flex gap-2 border-b">
        {["Overview", "Profile", "Users"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm ${
              activeTab === tab
                ? "border-b-2 border-blue-600 font-semibold text-blue-600"
                : "text-gray-600"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {renderContent()}
    </div>
  );
}
