// src/pages/auth/SignupPage.jsx
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthProvider";
import toast from "react-hot-toast";
import axiosInstance from "../../lib/axiosInstance";

// Centralized routes
const ONBOARDING_ROUTES = {
  candidate: "/student-form",
  student: "/student-form",
  fresher: "/student-form",
  professional: "/student-form",
  company: "/company-form",
  college: "/college-onboarding",
  employer: "/onboardingflowForm",
};

const DASHBOARD_ROUTES = {
  student: "/home",
  fresher: "/home",
  professional: "/home",
  company: "/company-profile",
  college: "/college-profile",
  employer: "/employer-profile",
};

const normalizeUserType = (t) => {
  const v = (t || "").toString().trim().toLowerCase();
  return v === "candidate" ? "student" : v || "student";
};

const handleAuthRedirect = (user, navigate) => {
  if (!user) return;

  const userType = normalizeUserType(user.userType);
  const onboardingCompleted = Boolean(user.onboardingCompleted);
  const authProvider = user.authProvider;
  const isLinkedIn = authProvider === "linkedin";

  // If onboarding not completed AND not LinkedIn, send to onboarding
  if (!onboardingCompleted && !isLinkedIn) {
    const route = ONBOARDING_ROUTES[userType] || "/onboarding";
    toast.success("Let's get you set up!");
    navigate(route, { replace: true });
  } else {
    // Finished onboarding OR LinkedIn users → dashboard
    const route = DASHBOARD_ROUTES[userType] || "/home";
    toast.success("Welcome!");
    navigate(route, { replace: true });
  }
};

function SignupPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [authUser, setAuthUser] = useAuth();

  // Prefer tempSelectedRole set on the chooser screen; fallback to persisted role
  const selectedRole = sessionStorage.getItem("tempSelectedRole") || localStorage.getItem("selectedRole");

  const [formData, setFormData] = useState({ email: "", password: "", confirmPassword: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [linkedinLoading, setLinkedinLoading] = useState(false);

  // Load Google script
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // LinkedIn callback handler
  useEffect(() => {
    const qs = new URLSearchParams(location.search);
    const linkedinError = qs.get("error");
    const linkedinToken = qs.get("token");

    if (linkedinError) {
      toast.error(decodeURIComponent(linkedinError));
      navigate("/signup", { replace: true });
      return;
    }

    if (!linkedinToken) return;

    toast.success("LinkedIn authentication successful!");

    const rawProfileImage = qs.get("profileImage");
    const safeProfileImage =
      !rawProfileImage ||
      rawProfileImage === "undefined" ||
      rawProfileImage === "null" ||
      rawProfileImage === "[object Object]"
        ? null
        : rawProfileImage;

    // FIX: do NOT fallback to selectedRole here; require backend to send userType
    const qsUserType = (qs.get("userType") || "").trim();
    if (!qsUserType) {
      toast.error("LinkedIn login missing role. Please try again.");
      navigate("/signup", { replace: true });
      return;
    }

    const rawUser = {
      _id: qs.get("userId"),
      email: qs.get("email"),
      name: qs.get("name"),
      userType: qsUserType,
      profileImage: safeProfileImage,
      onboardingCompleted: qs.get("onboardingCompleted") === "true",
      authProvider: "linkedin",
    };

    const normalizedUserType = normalizeUserType(rawUser.userType);

    const authPayloadUser = {
      _id: rawUser._id,
      email: rawUser.email,
      userType: normalizedUserType,
      name: rawUser.name || rawUser.email,
      profileImage: rawUser.profileImage || null,
      onboardingCompleted: Boolean(rawUser.onboardingCompleted),
      authProvider: "linkedin",
    };

    setAuthUser({ user: authPayloadUser, token: linkedinToken });
    localStorage.setItem("ChatAppUser", JSON.stringify(authPayloadUser));
    localStorage.setItem("token", linkedinToken);
    localStorage.setItem("selectedRole", normalizedUserType);

    axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${linkedinToken}`;

    handleAuthRedirect(authPayloadUser, navigate);
  }, [location.search, navigate, selectedRole, setAuthUser]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_Backend_URL}/api/auth/signup`,
        { email: formData.email, password: formData.password, userType: selectedRole },
        { withCredentials: true }
      );

      if (response.status === 201) {
        toast.success("Signup successful!");
        const { user, token } = response.data;

        sessionStorage.removeItem("tempSelectedRole");

        const normalizedUserType = normalizeUserType(user.userType || selectedRole);

        const authPayloadUser = {
          _id: user._id,
          email: user.email,
          userType: normalizedUserType,
          name: user.basicDetails?.name || user.name || user.email,
          profileImage: user.profileImage || null,
          onboardingCompleted: Boolean(user.onboardingCompleted),
          authProvider: user.authProvider,
        };

        setAuthUser({ user: authPayloadUser, token });
        localStorage.setItem("ChatAppUser", JSON.stringify(authPayloadUser));
        localStorage.setItem("token", token);
        localStorage.setItem("selectedRole", normalizedUserType);

        axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        handleAuthRedirect(authPayloadUser, navigate);
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Signup failed.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async (code) => {
    setGoogleLoading(true);
    try {
      localStorage.removeItem("token");
      document.cookie = "jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

      const response = await axios.post(
        `${import.meta.env.VITE_Backend_URL}/api/auth/google`,
        { code, userType: selectedRole },
        { withCredentials: true }
      );

      if (response.data.success) {
        toast.success("Google authentication successful!");
        const { user, token } = response.data;

        const normalizedUserType = normalizeUserType(user.userType || selectedRole);

        const authPayloadUser = {
          _id: user._id,
          email: user.email,
          userType: normalizedUserType,
          name: user.basicDetails?.name || user.name || user.email,
          profileImage: user.profileImage || null,
          onboardingCompleted: Boolean(user.onboardingCompleted),
          authProvider: user.authProvider,
        };

        setAuthUser({ user: authPayloadUser, token });
        localStorage.setItem("ChatAppUser", JSON.stringify(authPayloadUser));
        localStorage.setItem("token", token);
        localStorage.setItem("selectedRole", normalizedUserType);

        axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        handleAuthRedirect(authPayloadUser, navigate);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Google authentication failed");
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleGoogleClick = () => {
    if (window.google) {
      const client = window.google.accounts.oauth2.initCodeClient({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        scope: "email profile openid",
        callback: (res) => handleGoogleSignIn(res.code),
        error_callback: () => toast.error("Google login failed. Please try again."),
      });
      client.requestCode();
    }
  };

  const handleLinkedInClick = () => {
    if (!selectedRole) {
      toast.error("Please select a role before signing up with LinkedIn.");
      return;
    }
    setLinkedinLoading(true);
    window.location.href = `${import.meta.env.VITE_Backend_URL}/api/auth/linkedin?userType=${selectedRole}`;
  };

  // NOTE: leaving your JSX return as-is (you had it truncated in the attachment)
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white shadow-sm rounded-lg p-6">
        <h1 className="text-xl font-semibold text-gray-900 mb-1">Create your account</h1>
        <p className="text-sm text-gray-600 mb-6">
          Sign up to get started as a <span className="font-medium">{selectedRole || "role"}</span>.
        </p>

        {error ? (
          <div className="mb-4 rounded border border-red-200 bg-red-50 text-red-700 px-3 py-2 text-sm">
            {error}
          </div>
        ) : null}

        <div className="space-y-3">
          <button
            type="button"
            onClick={handleLinkedInClick}
            disabled={linkedinLoading}
            className="w-full inline-flex items-center justify-center gap-2 rounded-md border border-[#0A66C2] bg-[#0A66C2] px-4 py-2.5 text-white hover:bg-[#0a57a6] disabled:opacity-60"
          >
            <svg width="18" height="18" viewBox="0 0 34 34" fill="none" aria-hidden="true">
              <path fill="#fff" d="M34,34H0V0h34V34z" opacity="0"></path>
              <path fill="#fff" d="M8,27H3V13h5V27z M5.5,11.4C4,11.4,3,10.3,3,9s1-2.4,2.5-2.4C7,6.6,8,7.7,8,9S7,11.4,5.5,11.4z M31,27h-5v-7.3 c0-1.8-0.7-3.1-2.2-3.1c-1.2,0-1.9,0.8-2.2,1.5C21.4,18.5,21.4,19,21.4,19V27h-5c0,0,0.1-13,0-14h5v2c0.7-1,1.9-2.4,4.7-2.4 c3.4,0,5.9,2.2,5.9,7V27z"></path>
            </svg>
            {linkedinLoading ? "Redirecting to LinkedIn..." : "Continue with LinkedIn"}
          </button>

          <button
            type="button"
            onClick={handleGoogleClick}
            disabled={googleLoading}
            className="w-full inline-flex items-center justify-center gap-2 rounded-md border bg-white px-4 py-2.5 text-gray-800 hover:bg-gray-50 disabled:opacity-60"
          >
            {googleLoading ? "Connecting Google..." : "Continue with Google"}
          </button>
        </div>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-white px-2 text-gray-500">or use email</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            name="email"
            required
            placeholder="Email address"
            value={formData.email}
            onChange={handleChange}
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <input
            type="password"
            name="password"
            required
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <input
            type="password"
            name="confirmPassword"
            required
            placeholder="Confirm password"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-indigo-600 px-4 py-2.5 text-white hover:bg-indigo-700 disabled:opacity-60"
          >
            {loading ? "Creating account..." : "Sign up"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="text-indigo-600 hover:underline">
            Log In
          </Link>
        </p>

        <p className="mt-8 text-center text-xs text-gray-400">© 2025 TalentConnects</p>
      </div>
    </div>
  );
}

export default SignupPage;
