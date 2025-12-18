// src/pages/students/Profile.jsx
import { useAuth } from "@/context/AuthProvider";
import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Button from "@/components/ui/Button";
import Avatar from "@/components/ui/Avatar";
import Badge from "@/components/ui/Badge";
import { FiLinkedin, FiGithub, FiGlobe, FiUploadCloud } from "react-icons/fi";
import axios from "axios";

// Helpers to read from localStorage
function readStoredUser() {
  try {
    const raw = localStorage.getItem("ChatAppUser");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function readResumeDraft() {
  try {
    const raw = localStorage.getItem("resumeParsedDraft");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function clearResumeDraft() {
  localStorage.removeItem("resumeParsedDraft");
}

function Profile() {
  const [activeTab, setActiveTab] = useState("overview");
  const [isProfileEditing, setIsProfileEditing] = useState(false);
  const [hasOnboardingData, setHasOnboardingData] = useState(true);
  const navigate = useNavigate();

  const [authUser] = useAuth();
  const storedUser = useMemo(() => readStoredUser(), []);
  const user = authUser?.user || storedUser || null;

  const [profileData, setProfileData] = useState({
    profileImageUrl: "",
    backgroundImageUrl: "",
    resumeUrl: "",
    fullName: "",
    email: "",
    phone: "",
    about: "",
    college: "",
    degree: "",
    yearOfGraduation: "",
    cgpa: "",
    skills: [],
    linkedin: "",
    github: "",
    portfolio: "",
  });

  const [profileImageFile, setProfileImageFile] = useState(null);
  const [backgroundImageFile, setBackgroundImageFile] = useState(null);
  const [resumeFile, setResumeFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch onboarding profile; fall back to LinkedIn/auth user
  useEffect(() => {
    const fetchUserProfileData = async () => {
      setLoading(true);
      setError(null);
      try {
        const backendUrl = import.meta.env.VITE_Backend_URL;
        const response = await axios.get(`${backendUrl}/api/onboarding/me`, {
          withCredentials: true,
        });

        if (response.data) {
          const fetched = response.data;
          setHasOnboardingData(true);
          setProfileData((prev) => ({
            ...prev,
            fullName: fetched.name || prev.fullName || user?.name || "",
            email: fetched.email || prev.email || user?.email || "",
            phone: fetched.phone || prev.phone,
            about:
              fetched.about ||
              prev.about ||
              "Tell recruiters a bit about yourself.",
            college: fetched.college || prev.college,
            degree: fetched.degree || prev.degree,
            yearOfGraduation:
              fetched.yearOfGraduation || prev.yearOfGraduation,
            cgpa: fetched.cgpa || prev.cgpa,
            skills: Array.isArray(fetched.skills)
              ? fetched.skills
              : typeof fetched.skills === "string" && fetched.skills
              ? fetched.skills.split(",").map((s) => s.trim())
              : prev.skills,
            linkedin: fetched.linkedin || prev.linkedin,
            github: fetched.github || prev.github,
            portfolio: fetched.portfolio || prev.portfolio,
            profileImageUrl:
              fetched.profileImage ||
              prev.profileImageUrl ||
              user?.profileImage ||
              "",
            backgroundImageUrl:
              fetched.backgroundImage || prev.backgroundImageUrl,
            resumeUrl: fetched.resume || prev.resumeUrl,
          }));
        }
      } catch (err) {
        // If profile does not exist yet, seed from LinkedIn/Auth user
        if (
          err.response &&
          (err.response.status === 404 || err.response.status === 401)
        ) {
          setHasOnboardingData(false);
          if (user) {
            setProfileData((prev) => ({
              ...prev,
              fullName: user.name || prev.fullName || "",
              email: user.email || prev.email || "",
              profileImageUrl:
                user.profileImage || prev.profileImageUrl || "",
            }));
            setError(null);
          }
        } else {
          setError("Failed to load profile data. Please fill out your profile.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfileData();
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  // Support /profile?editProfile=true from dashboard + merge resumeParsedDraft
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const fromEditProfile = params.get("editProfile");

    if (fromEditProfile === "true") {
      setActiveTab("profile");

      const draft = readResumeDraft();
      if (draft && typeof draft === "object") {
        setProfileData((prev) => {
          const skills =
            Array.isArray(draft.skills)
              ? draft.skills
              : typeof draft.skills === "string" && draft.skills
              ? draft.skills.split(",").map((s) => s.trim())
              : prev.skills;

          return {
            ...prev,
            fullName: draft.name || draft.fullName || prev.fullName,
            email: draft.email || prev.email,
            phone: draft.phone || prev.phone,
            college: draft.college || prev.college,
            degree: draft.degree || prev.degree,
            yearOfGraduation:
              draft.yearOfGraduation || prev.yearOfGraduation,
            cgpa: draft.cgpa || prev.cgpa,
            linkedin: draft.linkedin || prev.linkedin,
            github: draft.github || prev.github,
            portfolio: draft.portfolio || prev.portfolio,
            skills,
            about: draft.about || prev.about,
          };
        });
        clearResumeDraft();
      }

      const newUrl = window.location.pathname;
      window.history.replaceState({}, "", newUrl);
    }
  }, []);

  const handleProfileDataChange = (field, value) =>
    setProfileData((prev) => ({ ...prev, [field]: value }));

  // Upload a single file field immediately (profileImage, backgroundImage, resume)
  const handleImmediateFileUpload = async (file, fieldName) => {
    if (!file) return;

    const formData = new FormData();
    formData.append(fieldName, file);

    try {
      const backendUrl = import.meta.env.VITE_Backend_URL;
      const token = localStorage.getItem("token");
      const endpoint = `${backendUrl}/api/onboarding/update`;

      const response = await axios.put(endpoint, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });

      if (response.data && response.data.data) {
        const saved = response.data.data;

        if (fieldName === "profileImage") {
          handleProfileDataChange("profileImageUrl", saved.profileImage || "");
        }
        if (fieldName === "backgroundImage") {
          handleProfileDataChange(
            "backgroundImageUrl",
            saved.backgroundImage || "",
          );
        }
        if (fieldName === "resume") {
          handleProfileDataChange("resumeUrl", saved.resume || "");
        }
      }
    } catch (err) {
      console.error(`Error uploading ${fieldName}:`, err);
      setError(`Failed to upload ${fieldName}. Please try again.`);
    } finally {
      if (fieldName === "profileImage") setProfileImageFile(null);
      if (fieldName === "backgroundImage") setBackgroundImageFile(null);
      if (fieldName === "resume") setResumeFile(null);
    }
  };

  const handleFileChange = async (event, fileType) => {
    const file = event.target.files[0];
    if (!file) return;

    if (fileType === "profileImage") {
      setProfileImageFile(file);
      handleProfileDataChange("profileImageUrl", URL.createObjectURL(file));
      await handleImmediateFileUpload(file, "profileImage");
    } else if (fileType === "backgroundImage") {
      setBackgroundImageFile(file);
      handleProfileDataChange(
        "backgroundImageUrl",
        URL.createObjectURL(file),
      );
      await handleImmediateFileUpload(file, "backgroundImage");
    } else if (fileType === "resume") {
      setResumeFile(file);
      handleProfileDataChange("resumeUrl", file.name);
      await handleImmediateFileUpload(file, "resume");
    }
  };

  const handleSaveChanges = async () => {
    setLoading(true);
    setError(null);

    try {
      const backendUrl = import.meta.env.VITE_Backend_URL;
      const token = localStorage.getItem("token");

      const formData = new FormData();
      formData.append("name", profileData.fullName || "");
      formData.append("email", profileData.email || "");
      formData.append("phone", profileData.phone || "");
      formData.append("about", profileData.about || "");
      formData.append("college", profileData.college || "");
      formData.append("degree", profileData.degree || "");
      formData.append(
        "yearOfGraduation",
        profileData.yearOfGraduation || "",
      );
      formData.append("cgpa", profileData.cgpa || "");
      formData.append("linkedin", profileData.linkedin || "");
      formData.append("github", profileData.github || "");
      formData.append("portfolio", profileData.portfolio || "");
      formData.append(
        "skills",
        Array.isArray(profileData.skills)
          ? profileData.skills.join(",")
          : profileData.skills || "",
      );

      const endpoint = `${backendUrl}/api/onboarding/update`;
      const response = await axios.put(endpoint, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });

      if (response.data && response.data.data) {
        const saved = response.data.data;
        setProfileData((prev) => ({
          ...prev,
          fullName: saved.name || prev.fullName,
          email: saved.email || prev.email,
          phone: saved.phone || prev.phone,
          about: saved.about || prev.about,
          college: saved.college || prev.college,
          degree: saved.degree || prev.degree,
          yearOfGraduation:
            saved.yearOfGraduation || prev.yearOfGraduation,
          cgpa: saved.cgpa || prev.cgpa,
          linkedin: saved.linkedin || prev.linkedin,
          github: saved.github || prev.github,
          portfolio: saved.portfolio || prev.portfolio,
          skills: Array.isArray(saved.skills)
            ? saved.skills
            : typeof saved.skills === "string" && saved.skills
            ? saved.skills.split(",").map((s) => s.trim())
            : prev.skills,
        }));
      }

      setIsProfileEditing(false);
      setHasOnboardingData(true);
    } catch (err) {
      console.error("Error saving profile changes:", err);
      setError(
        `Failed to save changes: ${
          err.response?.data?.details || err.message
        }`,
      );
    } finally {
      setLoading(false);
    }
  };

  const handleStartEditing = () => setIsProfileEditing(true);

  const addSkill = (e) => {
    e.preventDefault();
    const value = e.target.elements.skill?.value?.trim();
    if (!value) return;

    setProfileData((prev) => ({
      ...prev,
      skills: [...(prev.skills || []), value],
    }));
    e.target.reset();
  };

  const removeSkill = (skill) =>
    setProfileData((prev) => ({
      ...prev,
      skills: (prev.skills || []).filter((s) => s !== skill),
    }));

  const renderOverview = () => (
    <div className="space-y-6">
      <section className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-sm font-semibold text-gray-900 mb-2">About</h3>
        <p className="text-sm text-gray-700 whitespace-pre-line">
          {profileData.about ||
            "Add a short summary so recruiters understand your background."}
        </p>
      </section>

      <section className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-sm font-semibold text-gray-900 mb-2">
          Education
        </h3>
        <dl className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
          <div>
            <dt className="font-medium text-gray-500">
              Degree & Institution
            </dt>
            <dd>
              {profileData.degree || "N/A"}{" "}
              {profileData.college && (
                <>
                  {"at "}
                  {profileData.college}
                </>
              )}
            </dd>
          </div>
          <div>
            <dt className="font-medium text-gray-500">Graduation</dt>
            <dd>{profileData.yearOfGraduation || "N/A"}</dd>
          </div>
          <div>
            <dt className="font-medium text-gray-500">
              CGPA / Percentage
            </dt>
            <dd>{profileData.cgpa || "N/A"}</dd>
          </div>
        </dl>
      </section>

      <section className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-sm font-semibold text-gray-900 mb-2">Skills</h3>
        {profileData.skills && profileData.skills.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {profileData.skills.map((skill) => (
              <Badge key={skill}>{skill}</Badge>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-600">
            No skills added yet. Upload your resume or edit your profile to
            add skills.
          </p>
        )}
      </section>
    </div>
  );

  const renderProfileForm = () => (
    <div className="space-y-6">
      <section className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="text-sm">
            <span className="text-gray-700">Full name</span>
            <input
              type="text"
              className="mt-1 block w-full rounded-md border-gray-300 text-sm"
              value={profileData.fullName}
              onChange={(e) =>
                handleProfileDataChange("fullName", e.target.value)
              }
            />
          </label>
          <label className="text-sm">
            <span className="text-gray-700">Email</span>
            <input
              type="email"
              className="mt-1 block w-full rounded-md border-gray-300 text-sm"
              value={profileData.email}
              onChange={(e) =>
                handleProfileDataChange("email", e.target.value)
              }
            />
          </label>
          <label className="text-sm">
            <span className="text-gray-700">Phone</span>
            <input
              type="text"
              className="mt-1 block w-full rounded-md border-gray-300 text-sm"
              value={profileData.phone}
              onChange={(e) =>
                handleProfileDataChange("phone", e.target.value)
              }
            />
          </label>
        </div>

        <label className="text-sm block">
          <span className="text-gray-700">About</span>
          <textarea
            rows={4}
            className="mt-1 block w-full rounded-md border-gray-300 text-sm"
            value={profileData.about}
            onChange={(e) =>
              handleProfileDataChange("about", e.target.value)
            }
          />
        </label>
      </section>

      <section className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
        <h3 className="text-sm font-semibold text-gray-900">Education</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="text-sm">
            <span className="text-gray-700">College</span>
            <input
              type="text"
              className="mt-1 block w-full rounded-md border-gray-300 text-sm"
              value={profileData.college}
              onChange={(e) =>
                handleProfileDataChange("college", e.target.value)
              }
            />
          </label>
          <label className="text-sm">
            <span className="text-gray-700">Degree</span>
            <input
              type="text"
              className="mt-1 block w-full rounded-md border-gray-300 text-sm"
              value={profileData.degree}
              onChange={(e) =>
                handleProfileDataChange("degree", e.target.value)
              }
            />
          </label>
          <label className="text-sm">
            <span className="text-gray-700">Graduation year</span>
            <input
              type="text"
              className="mt-1 block w-full rounded-md border-gray-300 text-sm"
              value={profileData.yearOfGraduation}
              onChange={(e) =>
                handleProfileDataChange("yearOfGraduation", e.target.value)
              }
            />
          </label>
          <label className="text-sm">
            <span className="text-gray-700">CGPA / Percentage</span>
            <input
              type="text"
              className="mt-1 block w-full rounded-md border-gray-300 text-sm"
              value={profileData.cgpa}
              onChange={(e) =>
                handleProfileDataChange("cgpa", e.target.value)
              }
            />
          </label>
        </div>
      </section>

      <section className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
        <h3 className="text-sm font-semibold text-gray-900">Skills</h3>
        <form onSubmit={addSkill} className="flex gap-2">
          <input
            name="skill"
            type="text"
            placeholder="Add a skill"
            className="flex-1 rounded-md border-gray-300 text-sm"
          />
          <Button type="submit" size="sm" variant="outline">
            Add
          </Button>
        </form>
        <div className="flex flex-wrap gap-2 mt-2">
          {profileData.skills &&
            profileData.skills.map((skill) => (
              <Badge
                key={skill}
                onClick={() => removeSkill(skill)}
                className="cursor-pointer"
              >
                {skill}
              </Badge>
            ))}
        </div>
      </section>
    </div>
  );

  if (loading) {
    return (
      <div className="p-8 text-sm text-gray-500">Loading profile…</div>
    );
  }

  return (
    // NOTE: no Layout or Sidebar here; App.jsx already wraps this with <Layout>
    <div className="space-y-6">
      {/* Cover + avatar header */}
      <section className="relative rounded-lg overflow-hidden border border-gray-200 bg-white">
        <div className="h-32 bg-gradient-to-r from-purple-500 to-indigo-500">
          {profileData.backgroundImageUrl && (
            <img
              src={profileData.backgroundImageUrl}
              alt="Background"
              className="w-full h-full object-cover"
            />
          )}
        </div>

        <div className="px-6 pb-4 -mt-10 flex items-end justify-between">
          <div className="flex items-end gap-4">
            <div className="relative">
              <Avatar
                size="lg"
                src={profileData.profileImageUrl}
                alt={profileData.fullName || "Profile"}
              />
              <button
                type="button"
                className="absolute -bottom-1 -right-1 inline-flex items-center justify-center w-7 h-7 rounded-full bg-white border border-gray-200 shadow-sm text-gray-600 hover:bg-gray-50"
                onClick={() =>
                  document.getElementById("profileImageUpload").click()
                }
              >
                <FiUploadCloud className="w-4 h-4" />
              </button>
              <input
                id="profileImageUpload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleFileChange(e, "profileImage")}
              />
            </div>

            <div className="pb-2">
              <h1 className="text-xl font-semibold text-gray-900">
                {profileData.fullName || user?.name || "Your profile"}
              </h1>
              <p className="text-sm text-gray-600">
                {profileData.email || user?.email || "Email not available"}
              </p>
              <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                {profileData.linkedin && (
                  <a
                    href={profileData.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 hover:text-blue-600"
                  >
                    <FiLinkedin /> LinkedIn
                  </a>
                )}
                {profileData.github && (
                  <a
                    href={profileData.github}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 hover:text-gray-900"
                  >
                    <FiGithub /> GitHub
                  </a>
                )}
                {profileData.portfolio && (
                  <a
                    href={profileData.portfolio}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 hover:text-indigo-600"
                  >
                    <FiGlobe /> Portfolio
                  </a>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 pb-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                document.getElementById("backgroundImageUpload").click()
              }
            >
              Change cover
            </Button>
            <input
              id="backgroundImageUpload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleFileChange(e, "backgroundImage")}
            />

            {!isProfileEditing ? (
              <Button
                variant="primary"
                size="sm"
                onClick={handleStartEditing}
              >
                Edit profile
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsProfileEditing(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleSaveChanges}
                  disabled={loading}
                >
                  Save changes
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-6 px-2 sm:px-0 text-sm">
          <button
            type="button"
            className={
              activeTab === "overview"
                ? "border-b-2 border-black text-black px-1.5 py-2"
                : "border-b-2 border-transparent text-gray-500 hover:text-gray-700 px-1.5 py-2"
            }
            onClick={() => setActiveTab("overview")}
          >
            Overview
          </button>
          <button
            type="button"
            className={
              activeTab === "profile"
                ? "border-b-2 border-black text-black px-1.5 py-2"
                : "border-b-2 border-transparent text-gray-500 hover:text-gray-700 px-1.5 py-2"
            }
            onClick={() => setActiveTab("profile")}
          >
            Profile details
          </button>
          <button
            type="button"
            className={
              activeTab === "resume"
                ? "border-b-2 border-black text-black px-1.5 py-2"
                : "border-b-2 border-transparent text-gray-500 hover:text-gray-700 px-1.5 py-2"
            }
            onClick={() => setActiveTab("resume")}
          >
            Resume
          </button>
        </nav>
      </div>

      {/* Content area */}
      {error && (
        <div className="rounded-md bg-red-50 border border-red-200 px-4 py-2 text-sm text-red-700">
          {error}
        </div>
      )}

      {activeTab === "overview" && renderOverview()}
      {activeTab === "profile" && renderProfileForm()}
      {activeTab === "resume" && (
        <section className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-gray-900">
                Current resume
              </h3>
              <p className="text-xs text-gray-600">
                Upload a new resume to update your parsed profile details.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                document.getElementById("resume-upload").click()
              }
            >
              <FiUploadCloud className="w-4 h-4 mr-1" />
              Upload resume
            </Button>
            <input
              id="resume-upload"
              type="file"
              accept=".pdf,.doc,.docx"
              className="hidden"
              onChange={(e) => handleFileChange(e, "resume")}
            />
          </div>

          <div className="text-sm text-gray-700">
            {resumeFile
              ? `Selected file: ${resumeFile.name}`
              : profileData.resumeUrl
              ? `Current resume: ${profileData.resumeUrl}`
              : "No resume uploaded yet."}
          </div>
        </section>
      )}
    </div>
  );
}

export default Profile;
