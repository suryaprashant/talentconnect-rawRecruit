import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from '../../lib/axiosInstance';
import { useLegacyAuth } from '../../context/AuthProvider';
import toast from 'react-hot-toast';
import axiosInstance from '../../lib/axiosInstance';
import ReactGA from "react-ga4";
import heroImage from "../../assets/rawrecruit_transparent.png";
import logo from "../../assets/logo1.png";
import { Briefcase, CheckCircle, ShieldCheck } from 'lucide-react';
// --- Reusable Onboarding/Dashboard Routes ---
const ONBOARDING_ROUTES = {
  candidate: '/student-form',
  student: '/student-form',
  fresher: '/student-form',
  professional: '/student-form',
  company: '/company-form',
  college: '/college-onboarding',
  employer: '/onboardingflowForm'
};

const DASHBOARD_ROUTES = {
  student: '/home',
  fresher: '/home',
  professional: '/home',
  company: '/home',
  college: '/home',
  employer: '/home'
};

const HIRING_CHANNEL_ROUTES = {
  company: {
    'on-campus': '/hiring-channels/on-campus-hiring',
    'pool-campus': '/hiring-channels/pool-campus-hiring',
    'off-campus': '/hiring-channels/off-campus-hiring'
  },
  college: {
    'on-campus': '/service-request/campus-placement',
    'pool-campus': '/service-request/poolcampus-placement'
  },
  employer: {
    'on-campus': '/hiring-channels/on-campus-hiring/employer',
    'pool-campus': '/hiring-channels/pool-campus-hiring/employer',
    'off-campus': '/hiring-channels/off-campus-hiring/employer'
  }
};

const trackGAEvent = (category, action, label) => {
  if (import.meta.env.VITE_GA_MEASUREMENT_ID && window.ReactGA) {
    ReactGA.event({
      category,
      action,
      label
    });
  }
};

// --- Reusable Redirect Logic ---
const handleAuthRedirect = (user, navigate) => {
  if (!user) return;
  const { userType, onboardingCompleted } = user;
  
  const redirectAfterAuth = localStorage.getItem('redirectAfterAuth');
   
  if (redirectAfterAuth) {
    const hiringChannelType = getHiringChannelType(redirectAfterAuth);
    const userSpecificRoute = HIRING_CHANNEL_ROUTES[userType]?.[hiringChannelType];
    
    if (userSpecificRoute && onboardingCompleted) {
      localStorage.removeItem('redirectAfterAuth');
      navigate(userSpecificRoute);
      toast.success(`Welcome to ${hiringChannelType.replace('-', ' ')} hiring!`);
    } else if (!onboardingCompleted) {
      const onboardingRoute = ONBOARDING_ROUTES[userType] || '/onboarding';
      toast.success("Let's complete your profile first!");
      navigate(onboardingRoute);
    } else {
      const dashboardRoute = DASHBOARD_ROUTES[userType] || '/home';
      localStorage.removeItem('redirectAfterAuth');
      navigate(dashboardRoute);
      toast.success("Welcome back!");
    }
  } else if (!onboardingCompleted) {
    const route = ONBOARDING_ROUTES[userType] || '/onboarding';
    toast.success("Let's complete your profile!");
    navigate(route);
  } else {
    const route = DASHBOARD_ROUTES[userType] || '/home';
    toast.success("Welcome back!");
    navigate(route);
  }
};

const getHiringChannelType = (url) => {
  if (url.includes('on-campus')) return 'on-campus';
  if (url.includes('pool-campus')) return 'pool-campus';
  if (url.includes('off-campus')) return 'off-campus';
  return null;
};

function LoginPage() {
  const navigate = useNavigate();
  const [authUser, setAuthUser] = useLegacyAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [linkedinLoading, setLinkedinLoading] = useState(false);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const token = queryParams.get('token');
    const authError = queryParams.get('error');

    if (!token && !authError) return;

    if (authError) {
      toast.error(decodeURIComponent(authError));
      navigate('/login', { replace: true });
      return;
    }

    if (token) {
  const user = {
    _id: queryParams.get('userId'),
    email: queryParams.get('email'),
    name: decodeURIComponent(queryParams.get('name') || ''),
    userType: queryParams.get('userType'),
    profileImage: queryParams.get('profileImage'),
    onboardingCompleted: queryParams.get('onboardingCompleted') === 'true',
  };

  // 1. Save to Context & Storage
  setAuthUser({ user });
  localStorage.setItem('ChatAppUser', JSON.stringify(user));
  localStorage.setItem('token', token);
  localStorage.setItem('selectedRole', user.userType);
  
  // 2. Set Axios Header
  axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;

  toast.success("Welcome back!");

  // 3. Clear URL to prevent loop
  navigate(window.location.pathname, { replace: true });

  // Google Analytics event
  trackGAEvent("Auth", "Login Success", "LinkedIn");
  
  // 4. Redirect based on onboarding status
  handleAuthRedirect(user, navigate);
}
  }, [navigate, setAuthUser]);

  const handleLinkedInLogin = () => {
    setLinkedinLoading(true);
    // Note: We pass a default userType. Backend will prioritize 
    // the user's ACTUAL role found in the database.
    window.location.href = `${import.meta.env.VITE_Backend_URL}/api/auth/linkedin?userType=company`;
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const response = await axios.post(`${import.meta.env.VITE_Backend_URL}/api/auth/login`, {
        email: formData.email,
        password: formData.password,
      }, {
        withCredentials: true,
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.status === 200) {
  const { token, user } = response.data;
  sessionStorage.removeItem('tempSelectedRole');

  setAuthUser({
    user: {
      _id: user._id,
      email: user.email,
      userType: user.userType,
      name: user.basicDetails?.name,
      profileImage: user.profileImage,
      onboardingCompleted: user.onboardingCompleted
    },
    token: token
  });

  localStorage.setItem('ChatAppUser', JSON.stringify(user));
  localStorage.setItem('token', token);
  localStorage.setItem('selectedRole', user.userType);
  axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;

  // Google Analytics event
  trackGAEvent("Auth", "Login Success", "Email/Password");

  handleAuthRedirect(user, navigate);
}
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'An unexpected error occurred during login.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async (code) => {
    setGoogleLoading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_Backend_URL}/api/auth/google`,
        { code },
        { withCredentials: true, headers: { 'Content-Type': 'application/json' } }
      );

      if (response.data.success) {
  const { user, isNewUser, token } = response.data;

  if (isNewUser) {
    toast.error('Account not found. Please sign up first with Google.');
    navigate('/signup');
    return;
  }

  toast.success('Google login successful!');

  setAuthUser({
    user: {
      _id: user._id,
      email: user.email,
      userType: user.userType,
      name: user.name,
      profileImage: user.profileImage,
      onboardingCompleted: user.onboardingCompleted
    },
    token: token
  });

  localStorage.setItem('ChatAppUser', JSON.stringify(user));
  localStorage.setItem('token', token);
  localStorage.setItem('selectedRole', user.userType);
  axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;

  // Google Analytics event
  trackGAEvent("Auth", "Login Success", "Google");

  handleAuthRedirect(user, navigate);
}
    } catch (error) {
      if (error.response?.status === 404) {
        toast.error('Account not found. Please sign up first.');
        navigate('/signup');
      } else {
        toast.error(error.response?.data?.message || 'Google authentication failed');
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleGoogleClick = () => {
    if (window.google) {
      const client = window.google.accounts.oauth2.initCodeClient({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        scope: 'email profile openid',
        callback: (response) => handleGoogleSignIn(response.code),
        error_callback: () => {
          toast.error('Google login failed. Please try again.');
          setGoogleLoading(false);
        }
      });
      client.requestCode();
    }
  };

  const handleLogoClick = () => {
  navigate('/');
};

  return (
  <div className="bg-white min-h-screen font-[Inter] text-[#1b1c1d] flex flex-col">

    <main className="flex-grow flex items-start pt-4 justify-center px-6 py-6 relative">

      {/* Background blur */}
      <div className="absolute inset-0 pointer-events-none z-0">

        {/* Top Right Blob */}
        <div className="absolute top-[5%] right-[5%] w-[500px] h-[500px] 
        bg-[#143694]/40 blur-[160px] rounded-full"></div>

        {/* Bottom Left Blob */}
        <div className="absolute bottom-[5%] left-[5%] w-[500px] h-[500px] 
        bg-[#143694]/40 blur-[160px] rounded-full"></div>

      </div>

      {/* MAIN CARD */}
      <div className="relative z-10 w-full max-w-[900px] flex flex-col md:flex-row bg-white/80 backdrop-blur-md rounded-xl shadow-[0_10px_40px_-10px_rgba(27,28,29,0.08)] overflow-hidden">

        {/* LEFT SIDE (SAME AS SIGNUP) */}
        <div className="hidden md:flex md:w-5/12 bg-primaryBrand p-12 flex-col justify-between text-white relative overflow-hidden">

          {/* Background Glow */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-300/10 rounded-full blur-3xl"></div>
          </div>

          <div className="relative z-10">

            {/* Logo (unchanged) */}
            <div
              className="flex items-center gap-3 mb-6 px-3 py-2 rounded-xl bg-white backdrop-blur-sm cursor-pointer"
              onClick={() => navigate("/")}
            >
              <img src={logo} className="w-9 h-9" />
        
              <span className="text-xl font-bold tracking-tight text-primaryBrand">
                Raw<span className="text-[#1e4ed8]">Recruit</span>
              </span>
            </div>

            {/* Heading */}
            <div className="mb-10">
              <h1 className="text-4xl font-bold leading-tight mb-4">
                Welcome Back 
              </h1>
              <p className="text-base text-white/80 max-w-sm">
                Continue your hiring or application journey seamlessly.
              </p>
            </div>

            {/* Features (MATCHING SIGNUP STYLE) */}
            <div className="space-y-6">

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 flex items-center justify-center rounded-lg ">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <p className="font-semibold text-white">
                    Access Your Dashboard
                  </p>
                  <p className="text-sm text-white/70">
                    Manage jobs, applications, and interviews in one place.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 flex items-center justify-center rounded-lg ">
                  <Briefcase className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <p className="font-semibold text-white">
                    Continue Your Journey
                  </p>
                  <p className="text-sm text-white/70">
                    Pick up right where you left off — hiring or applying.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 flex items-center justify-center rounded-lg">
                  <ShieldCheck className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <p className="font-semibold text-white">
                    Secure & Reliable
                  </p>
                  <p className="text-sm text-white/70">
                    Your data is protected with enterprise-grade security.
                  </p>
                </div>
              </div>

            </div>
          </div>

          {/* Footer */}
          <div className="text-xs text-white/50 border-t border-white/10 pt-6">
            Global Hiring Network
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="w-full md:w-7/12 p-8 md:p-6">

          {/* Header */}
          <div className="mb-6">
            <h2 className="text-3xl font-bold text-primaryBrand">
              Login to RawRecruit
            </h2>
            <p className="text-primary text-sm mt-2">
              Continue your journey seamlessly
            </p>
          </div>

          {/* Social */}
          <div className="grid grid-cols-1 gap-4 mb-6">
            <button
              onClick={handleLinkedInLogin}
              className="w-full flex items-center justify-center gap-3 py-3 border rounded-xl 
              hover:bg-[#143694]/5 hover:border-[#143694] transition"
            >
              <svg className="w-5 h-7 mr-1" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
               <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
              </svg>
              LinkedIn
            </button>

            <button
              onClick={handleGoogleClick}
              className="w-full flex items-center justify-center gap-3 py-3 border rounded-xl 
              hover:bg-[#143694]/5 hover:border-[#143694] transition"
            >
              <svg className="w-5 h-5 mr-1" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.345-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z" />
              </svg>
              Google
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center mb-6">
            <div className="flex-grow border-t"></div>
            <span className="mx-4 text-xs text-gray-400">
              OR CONTINUE WITH EMAIL
            </span>
            <div className="flex-grow border-t"></div>
          </div>

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-4">

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full bg-gray-100 p-3 rounded-xl outline-none 
              focus:ring-2 focus:ring-[#143694]/30 focus:border-[#143694]"
              placeholder="Email"
            />

            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full bg-gray-100 p-3 rounded-xl outline-none 
                focus:ring-2 focus:ring-[#143694]/30 focus:border-[#143694]"
              placeholder="Password"
            />

            <div className="text-right">
              <Link to="/forgot-password" className="text-sm text-primaryBrand hover:underline">
                Forgot Password?
              </Link>
            </div>

            {error && (
              <p className="text-red-500 text-sm">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#143694] text-white py-4 rounded-xl font-bold 
              hover:bg-white hover:text-[#143694] border-2 border-[#143694] transition-all duration-300"
            >
              {loading ? "Logging in..." : "Enter Portal"}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 pt-6 border-t text-center text-sm text-gray-500">
            Don’t have an account?{" "}
            <Link to="/signup" className="text-primaryBrand font-semibold hover:underline">
              Sign Up
            </Link>
          </div>

        </div>
      </div>
    </main>

    <footer className="py-10 text-center text-xs text-gray-500 border-t">
      © 2025 RawRecruit. Built for intentional connections.
    </footer>
  </div>
);
}

export default LoginPage;