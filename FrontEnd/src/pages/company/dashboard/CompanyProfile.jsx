// src/pages/company/dashboard/CompanyProfile.jsx

import { useState, useEffect } from "react";
import { Globe, Users, Calendar } from "lucide-react";
import CompanyOverview from "./CompanyOverview";
import CompanyProfileForm from "./CompanyProfileForm";
import UserManagement from "./UserManagement";
import axios from "axios";
import { useAuth } from "@/context/AuthProvider";

export default function CompanyProfile() {
  const [activeTab, setActiveTab] = useState("Overview");
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Correct useAuth usage and derive LinkedIn user
  const [authUser] = useAuth();
  const linkedInUser = authUser?.user || null;

  useEffect(() => {
    fetchProfileData();
  }, []);

  const backendUrl =
    import.meta.env.VITE_Backend_URL || "http://localhost:5000";

  const fetchProfileData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `${backendUrl}/api/companyDashboard/getInformation`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          withCredentials: true,
        }
      );
      setProfileData(response.data.profile);
    } catch (err) {
      console.error("Error fetching profile:", err);
      setError("Failed to load profile data.");
    } finally {
      setLoading(false);
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

  const handleImageUpload = async (event, imageType) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append(
      imageType === "backgroundImage" ? "backgroundImage" : "profileImage",
      file
    );

    try {
      const response = await axios.put(
        `${backendUrl}/api/companyDashboard/updateInformation`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setProfileData(response.data.profile);
      alert(
        `${
          imageType === "backgroundImage" ? "Background" : "Profile"
        } image updated successfully!`
      );
    } catch (err) {
      console.error(`Error uploading ${imageType} image:`, err);
      alert(
        `Failed to upload ${imageType} image. Make sure it's a valid image file.`
      );
    }
  };

  // Derive display values with LinkedIn fallback
  const companyName =
    profileData?.companyDetails?.name ||
    profileData?.name ||
    linkedInUser?.name ||
    "Company Name";

  const companyTagline =
    profileData?.companyDetails?.tagline ||
    profileData?.tagline ||
    "Describe your company here.";

  const contactName =
    profileData?.primaryContact?.name ||
    linkedInUser?.name ||
    "Contact name";

  const contactEmail =
    profileData?.primaryContact?.email ||
    linkedInUser?.email ||
    "Contact email";

  const contactAvatarSrc =
    profileData?.profileImage || linkedInUser?.profileImage || null;

  const renderContent = () => {
    if (loading) return <p>Loading profile...</p>;
    if (error) return <p className="text-red-500">{error}</p>;

    if (!profileData) {
      return (
        <div className="rounded-lg border bg-white p-4">
          <p className="mb-2 text-gray-700">
            No company profile found. Please create one in the Profile tab.
          </p>
        </div>
      );
    }

    switch (activeTab) {
      case "Overview":
        return <CompanyOverview profileData={profileData} />;
      case "Profile":
        return (
          <CompanyProfileForm
            profileData={profileData}
            onProfileUpdated={setProfileData}
            onImageUpload={handleImageUpload}
          />
        );
      case "Users":
        return <UserManagement companyId={profileData._id} />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header / hero section – same structure, smarter data */}
      <section className="relative overflow-hidden rounded-lg bg-gray-900 text-white">
        {/* Background image if available */}
        {profileData?.backgroundImage && (
          <img
            src={profileData.backgroundImage}
            alt="Company background"
            className="absolute inset-0 h-full w-full object-cover opacity-60"
          />
        )}
        <div className="relative flex flex-col gap-4 p-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            {/* Avatar with LinkedIn fallback */}
            {contactAvatarSrc ? (
              <img
                src={contactAvatarSrc}
                alt={companyName}
                className="h-16 w-16 rounded-full border-2 border-white object-cover"
              />
            ) : (
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-700 text-2xl font-semibold">
                {companyName.charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <h1 className="text-xl font-semibold md:text-2xl">
                {companyName}
              </h1>
              <p className="text-sm text-gray-200">{companyTagline}</p>
              <p className="mt-1 text-xs text-gray-300">
                Contact: {contactName} · {contactEmail}
              </p>
            </div>
          </div>
          <div className="flex gap-4 text-xs md:text-sm">
            <div className="flex items-center gap-1">
              <Globe className="h-4 w-4" />
              <span>
                {profileData?.companyDetails?.website ||
                  profileData?.website ||
                  "Website not set"}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>
                {profileData?.companyDetails?.companySize ||
                  profileData?.companySize ||
                  "Size not set"}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>
                Founded{" "}
                {profileData?.companyDetails?.foundedYear ||
                  profileData?.foundedYear ||
                  "N/A"}
              </span>
            </div>
          </div>
        </div>
      </section>

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
