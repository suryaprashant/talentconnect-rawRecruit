import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthProvider';
import toast from 'react-hot-toast';
import axiosInstance from '../../lib/axiosInstance';

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
  fresher: '/fresherhome',
  professional: '/Profhome',
  company: '/home',
  college: '/home',
  employer: '/home'
};

const handleAuthRedirect = (user, navigate) => {
  if (!user) return;
  const { userType, onboardingCompleted } = user;
  
  console.log('Redirecting user:', { userType, onboardingCompleted });
  
  if (!onboardingCompleted) {
    const route = ONBOARDING_ROUTES[userType] || '/onboarding';
    toast.success("Let's get you set up!");
    

    navigate(route);
  } else {
    const route = DASHBOARD_ROUTES[userType] || '/home';
    toast.success("Welcome back!");
    navigate(route);
  }
};

function SignupPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [authUser, setAuthUser] = useAuth();
  const selectedRole = sessionStorage.getItem('tempSelectedRole') || localStorage.getItem('selectedRole');

  const [formData, setFormData] = useState({ email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [linkedinLoading, setLinkedinLoading] = useState(false);

  // Role display names
  const roleDisplayNames = {
    candidate: 'Candidate',
    college: 'College',
    company: 'Company',
    employer: 'Employer',
    student: 'Student',
    fresher: 'Fresher',
    professional: 'Professional'
  };

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
    const queryParams = new URLSearchParams(location.search);
    const linkedinError = queryParams.get('error');
    const linkedinToken = queryParams.get('token');
    
    if (linkedinError) {
      toast.error(decodeURIComponent(linkedinError));
      navigate('/signup', { replace: true });
    } else if (linkedinToken) {
      toast.success('LinkedIn authentication successful!');
      const user = {
        _id: queryParams.get('userId'),
        email: queryParams.get('email'),
        name: queryParams.get('name'),
        userType: queryParams.get('userType'),
        profileImage: queryParams.get('profileImage'),
        onboardingCompleted: queryParams.get('onboardingCompleted') === 'true',
      };
      
      setAuthUser({ user });
      localStorage.setItem('ChatAppUser', JSON.stringify(user));
      localStorage.setItem('token', linkedinToken);
      axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${linkedinToken}`;
      
      handleAuthRedirect(user, navigate);
    }
  }, [location.search, navigate, setAuthUser]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      setLoading(false);
      return;
    }
    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters long');
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
        toast.success('Signup successful!');
        const { user, token } = response.data;

         sessionStorage.removeItem('tempSelectedRole');
        
        setAuthUser({ user });
        localStorage.setItem('ChatAppUser', JSON.stringify(user));
        localStorage.setItem('token', token);

         localStorage.setItem('selectedRole', user.userType);
         
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        handleAuthRedirect(user, navigate);
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Signup failed.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async (code) => {
    setGoogleLoading(true);
    try {
        localStorage.removeItem('token');
        document.cookie = 'jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      
      const response = await axios.post(
        `${import.meta.env.VITE_Backend_URL}/api/auth/google`,
        { code, userType: selectedRole },
        { withCredentials: true }
      );

      if (response.data.success) {
        toast.success('Google authentication successful!');
        const { user, token } = response.data;

        console.log('Google auth response user:', user);

        setAuthUser({ user });
        localStorage.setItem('ChatAppUser', JSON.stringify(user));
        localStorage.setItem('token', token);
        localStorage.setItem('selectedRole', user.userType);
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        handleAuthRedirect(user, navigate);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Google authentication failed');
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
        error_callback: () => toast.error('Google login failed. Please try again.'),
      });
      client.requestCode();
    }
  };
  
  const handleLinkedInClick = () => {
    if (!selectedRole) {
      toast.error('Please select a role before signing up with LinkedIn.');
      return;
    }
    setLinkedinLoading(true);
    window.location.href = `${import.meta.env.VITE_Backend_URL}/api/auth/linkedin?userType=${selectedRole}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#667eea]/10 via-[#f093fb]/5 to-[#764ba2]/10">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-[#667eea]/10 to-[#764ba2]/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-[#f093fb]/10 to-[#f5576c]/10 rounded-full blur-3xl"></div>
      </div>

      {/* Top Left Logo */}
      <div className="absolute top-6 left-6 flex items-center gap-2">
        <div className="relative">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#667eea" className="w-8 h-8">
            <path fillRule="evenodd" d="M9.315 7.584C12.195 3.883 16.695 1.5 21.75 1.5a.75.75 0 01.75.75c0 5.056-2.383 9.555-6.084 12.436A6.75 6.75 0 019.75 22.5a.75.75 0 01-.75-.75v-4.131A15.838 15.838 0 016.382 15H2.25a.75.75 0 01-.75-.75 6.75 6.75 0 017.815-6.666zM15 6.75a2.25 2.25 0 100 4.5 2.25 2.25 0 000-4.5z" clipRule="evenodd" />
            <path d="M5.26 17.242a.75.75 0 10-.897-1.203 5.243 5.243 0 00-2.05 5.022.75.75 0 00.625.627 5.243 5.243 0 005.022-2.051.75.75 0 10-1.202-.897 3.744 3.744 0 01-3.008 1.51c0-1.23.592-2.323 1.51-3.008z" />
          </svg>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#f5576c" className="w-4 h-4 absolute -top-1 -right-1">
            <path fillRule="evenodd" d="M9 4.5a.75.75 0 01.721.544l.813 2.846a3.75 3.75 0 002.576 2.576l2.846.813a.75.75 0 010 1.442l-2.846.813a3.75 3.75 0 00-2.576 2.576l-.813 2.846a.75.75 0 01-1.442 0l-.813-2.846a3.75 3.75 0 00-2.576-2.576l-2.846-.813a.75.75 0 010-1.442l2.846-.813A3.75 3.75 0 007.466 7.89l.813-2.846A.75.75 0 019 4.5zM18 1.5a.75.75 0 01.728.568l.258 1.036c.236.94.97 1.674 1.91 1.91l1.036.258a.75.75 0 010 1.456l-1.036.258c-.94.236-1.674.97-1.91 1.91l-.258 1.036a.75.75 0 01-1.456 0l-.258-1.036a2.625 2.625 0 00-1.91-1.91l-1.036-.258a.75.75 0 010-1.456l1.036-.258a2.625 2.625 0 001.91-1.91l.258-1.036A.75.75 0 0118 1.5zM16.5 15a.75.75 0 01.712.513l.394 1.183c.15.447.5.799.948.948l1.183.395a.75.75 0 010 1.422l-1.183.395c-.447.15-.799.5-.948.948l-.395 1.183a.75.75 0 01-1.422 0l-.395-1.183a1.5 1.5 0 00-.948-.948l-1.183-.395a.75.75 0 010-1.422l1.183-.395c.447-.15.799-.5.948-.948l.395-1.183A.75.75 0 0116.5 15z" clipRule="evenodd" />
          </svg>
        </div>
        <span className="text-2xl font-bold bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent">
          RawRecruit
        </span>
      </div>

      {/* Centered Signup Card */}
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="relative w-full max-w-md">
          {/* Blur Background behind card */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#667eea]/5 to-[#764ba2]/5 backdrop-blur-sm rounded-2xl -inset-4 bottom-4"></div>
          
          {/* Main Signup Card */}
          <div className="relative bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-100 p-8">
            {/* Decorative top bar */}
            <div className="h-1 bg-gradient-to-r from-[#667eea] via-[#f093fb] to-[#43e97b] rounded-t-2xl absolute top-0 left-0 right-0"></div>
            
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#667eea]/10 to-[#764ba2]/10 text-[#667eea] px-4 py-2 rounded-full text-sm font-semibold mb-4 shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                  <path fillRule="evenodd" d="M9 4.5a.75.75 0 01.721.544l.813 2.846a3.75 3.75 0 002.576 2.576l2.846.813a.75.75 0 010 1.442l-2.846.813a3.75 3.75 0 00-2.576 2.576l-.813 2.846a.75.75 0 01-1.442 0l-.813-2.846a3.75 3.75 0 00-2.576-2.576l-2.846-.813a.75.75 0 010-1.442l2.846-.813A3.75 3.75 0 007.466 7.89l.813-2.846A.75.75 0 019 4.5zM18 1.5a.75.75 0 01.728.568l.258 1.036c.236.94.97 1.674 1.91 1.91l1.036.258a.75.75 0 010 1.456l-1.036.258c-.94.236-1.674.97-1.91 1.91l-.258 1.036a.75.75 0 01-1.456 0l-.258-1.036a2.625 2.625 0 00-1.91-1.91l-1.036-.258a.75.75 0 010-1.456l1.036-.258a2.625 2.625 0 001.91-1.91l.258-1.036A.75.75 0 0118 1.5zM16.5 15a.75.75 0 01.712.513l.394 1.183c.15.447.5.799.948.948l1.183.395a.75.75 0 010 1.422l-1.183.395c-.447.15-.799.5-.948.948l-.395 1.183a.75.75 0 01-1.422 0l-.395-1.183a1.5 1.5 0 00-.948-.948l-1.183-.395a.75.75 0 010-1.422l1.183-.395c.447-.15.799-.5.948-.948l.395-1.183A.75.75 0 0116.5 15z" clipRule="evenodd" />
                </svg>
                Sign Up
              </div>
              
              <h1 className="text-2xl font-bold text-gray-800 mb-2">
                Create Your Account
              </h1>
              
              {selectedRole && (
                <p className="text-gray-600">
                  Signing up as <span className="font-semibold text-[#667eea]">{roleDisplayNames[selectedRole] || selectedRole}</span>
                </p>
              )}
            </div>

            {/* Signup Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#667eea]/30 focus:border-[#667eea] transition-all duration-300 bg-white/80"
                  placeholder="Email Address"
                  required
                />
              </div>

              <div>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#667eea]/30 focus:border-[#667eea] transition-all duration-300 bg-white/80"
                  placeholder="Password"
                  required
                />
              </div>

              <div>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#667eea]/30 focus:border-[#667eea] transition-all duration-300 bg-white/80"
                  placeholder="Confirm Password"
                  required
                />
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white py-3.5 rounded-xl font-semibold hover:shadow-lg hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-md"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating Account...
                  </span>
                ) : (
                  'Create Account'
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="my-6 relative flex items-center">
              <div className="flex-grow border-t border-gray-200"></div>
              <span className="mx-4 text-gray-500 text-sm">Or continue with</span>
              <div className="flex-grow border-t border-gray-200"></div>
            </div>

            {/* Social Signup Buttons */}
            <div className="space-y-3">
              <button
                onClick={handleGoogleClick}
                className="w-full border border-gray-200 py-3 rounded-xl flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 transition-all duration-300 hover:shadow-sm"
                disabled={googleLoading}
              >
                {googleLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-gray-800" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing up...
                  </span>
                ) : (
                  <>
                    <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.345-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z" />
                    </svg>
                    Sign up with Google
                  </>
                )}
              </button>

              <button
                onClick={handleLinkedInClick}
                className="w-full border border-gray-200 py-3 rounded-xl flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 transition-all duration-300 hover:shadow-sm"
                disabled={linkedinLoading}
              >
                {linkedinLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-gray-800" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing up...
                  </span>
                ) : (
                  <>
                    <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
                    </svg>
                    Sign up with LinkedIn
                  </>
                )}
              </button>
            </div>

            {/* Login Link */}
            <p className="text-center mt-6 text-gray-600">
              Already have an account?{' '}
              <Link 
                to="/login" 
                className="text-[#667eea] font-semibold hover:text-[#764ba2] hover:underline transition-colors"
              >
                Log In
              </Link>
            </p>
          </div>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-gray-500 text-sm">
              © 2025 RawRecruit. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignupPage;