// src/pages/students/Dashboard.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "@/components/dashboard/PageHeader";
import Button from "@/components/ui/Button";
import { useAuth } from "@/context/AuthProvider";
import ResumeUpload from "../../components/onboarding/steps/ResumeUpload.jsx";
import axios from "../../lib/User_AxiosInstance.js";

const RESUME_UPLOAD_ENDPOINT = `${import.meta.env.VITE_Backend_URL}/api/upload/resume`;

function Dashboard() {
  const [authUser] = useAuth();
  const navigate = useNavigate();

  // ChatAppUser now stores ONLY the user object
  const storedUser = (() => {
    try {
      return JSON.parse(localStorage.getItem("ChatAppUser"));
    } catch {
      return null;
    }
  })();

  const user = authUser?.user || storedUser || null;

  const [formData, setFormData] = useState({ resume: null });
  const [isUploading, setIsUploading] = useState(false);

  const [profileData, setProfileData] = useState({
    fullName: "",
    email: "",
    phone: "",
    location: "",
    linkedin: "",
    github: "",
    skills: [],
    profileImage: null,
  });

  const [profileLoading, setProfileLoading] = useState(true);

  // Seed from LinkedIn/auth immediately
  useEffect(() => {
    if (!user) return;
    setProfileData((prev) => ({
      ...prev,
      fullName: user.name || prev.fullName,
      email: user.email || prev.email,
      profileImage: user.profileImage || prev.profileImage,
    }));
  }, [user]);

  // Load onboarding profile (if exists)
  useEffect(() => {
    const fetchProfile = async () => {
      setProfileLoading(true);
      try {
        const res = await axios.get("/api/onboarding/me", { withCredentials: true });
        const data = res?.data;

        if (data) {
          setProfileData((prev) => ({
            ...prev,
            fullName: data.name || data.fullName || prev.fullName,
            email: data.email || prev.email,
            phone: data.phone || prev.phone,
            location: data.location || data.currentLocation || prev.location,
            linkedin: data.linkedin || prev.linkedin,
            github: data.github || prev.github,
            skills: Array.isArray(data.skills) ? data.skills : prev.skills,
            profileImage: data.profileImage || prev.profileImage,
          }));
        }
      } catch {
        // keep LinkedIn/auth fallback
      } finally {
        setProfileLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleInputChange = (e) => {
    const { name, files } = e.target;
    if (name === "resume" && files?.[0]) {
      setFormData((prev) => ({ ...prev, resume: files[0] }));
    }
  };

  const toggleEdit = () => {
    // kept only because ResumeUpload expects it
  };

  const handleResumeUpload = async () => {
    if (!formData.resume || isUploading) return;

    try {
      setIsUploading(true);

      const fd = new FormData();
      fd.append("resume", formData.resume); // must match multer field name

      const res = await fetch(RESUME_UPLOAD_ENDPOINT, { method: "POST", body: fd });
      if (!res.ok) throw new Error("Failed to parse resume. Please try again.");

      const parsed = await res.json();
      localStorage.setItem("resumeParsedDraft", JSON.stringify(parsed));

      navigate("/profile?editProfile=true");
    } catch (err) {
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  };

  const userName = user?.name || user?.email || "Welcome";

  return (
    <div className="p-6 space-y-6">
      <PageHeader title={`Hello, ${userName}`} />

      <section className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="text-sm text-gray-600">
          This section combines details fetched from LinkedIn with any additional fields extracted
          from your uploaded resume.
        </div>

        {profileLoading ? (
          <div className="p-4 text-sm text-gray-500">Loading profile…</div>
        ) : (
          <div className="mt-4 text-sm">
            <div>Email: {profileData.email || "Not available"}</div>
            <div>Skills: {profileData.skills?.length ? profileData.skills.join(", ") : "No skills available yet."}</div>
          </div>
        )}
      </section>

      {/* Candidate-only feature: Resume upload */}
      <section className="bg-white border border-gray-200 rounded-lg p-4 space-y-3">
        <ResumeUpload
          formData={formData}
          isEditable={true}
          handleInputChange={handleInputChange}
          toggleEdit={toggleEdit}
        />

        <Button disabled={!formData.resume || isUploading} onClick={handleResumeUpload}>
          {isUploading ? "Uploading..." : "Upload and Edit Profile"}
        </Button>
      </section>
    </div>
  );
}

export default Dashboard;
