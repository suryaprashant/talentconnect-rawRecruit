import React from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useLegacyAuth } from '../../context/AuthProvider';
import toast from 'react-hot-toast';
import axiosInstance from '../../lib/axiosInstance';
import ReactGA from "react-ga4";
import heroImage from "../../assets/rawrecruit_transparent.png";
import logo from "../../assets/logo1.png";
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

const roleContent = {
  company: {
    title: "Hire Freshers Faster with Smart Campus Hiring",
    points: [
      {
        title: "Access Verified College Talent",
        desc: "Connect with verified colleges and final-year students across India. Build a reliable fresher pipeline faster."
      },
      {
        title: "Manage All Hiring in One Dashboard",
        desc: "Run on-campus, pool-campus, and off-campus drives from a single system designed for HR teams."
      },
      {
        title: "Track Hiring Progress in Real Time",
        desc: "Monitor applications, shortlist candidates, schedule interviews, and manage offers in one workflow."
      }
    ]
  },

  college: {
    title: "Increase Student Placements with Smart Hiring Tools",
    points: [
      {
        title: "Connect with Hiring Companies",
        desc: "Receive direct placement and internship requests from companies actively hiring freshers."
      },
      {
        title: "Manage Placement Drives Easily",
        desc: "Organize on-campus and pool-campus drives with structured communication and student tracking."
      },
      {
        title: "Improve Placement Performance",
        desc: "Track placement data, company engagement, and student progress to increase placement success."
      }
    ]
  },

  student: {
    title: "Find Fresher Jobs and Internships Faster",
    points: [
      {
        title: "Apply to Verified Opportunities",
        desc: "Discover real fresher jobs and internships posted directly by companies and colleges."
      },
      {
        title: "One Profile, Multiple Applications",
        desc: "Create your profile once and apply to multiple jobs without filling forms again."
      },
      {
        title: "Track Your Hiring Status",
        desc: "Stay updated on shortlisting, interviews, and job offers in one dashboard."
      }
    ]
  },

  fresher: {
    title: "Find Fresher Jobs and Internships Faster",
    points: [
      {
        title: "Apply to Verified Opportunities",
        desc: "Discover real fresher jobs and internships posted directly by companies."
      },
      {
        title: "One Profile, Multiple Applications",
        desc: "Create your profile once and apply to multiple jobs without filling forms again."
      },
      {
        title: "Track Your Hiring Status",
        desc: "Stay updated on shortlisting, interviews, and job offers in one dashboard."
      }
    ]
  },

  professional: {
    title: "Refer Talent and Support Hiring",
    points: [
      {
        title: "Refer Candidates Easily",
        desc: "Recommend candidates from your network to verified job opportunities."
      },
      {
        title: "Track Referral Progress",
        desc: "Monitor applications, interviews, and hiring decisions in one place."
      },
      {
        title: "Build Your Professional Reputation",
        desc: "Strengthen your credibility by connecting talent with hiring opportunities."
      }
    ]
  }
};

// Helper function for GA events
const trackGAEvent = (category, action, label) => {
  if (import.meta.env.VITE_GA_MEASUREMENT_ID && window.ReactGA) {
    ReactGA.event({
      category,
      action,
      label
    });
  }
};

const emailRegex =
  /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;


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
  const [authUser, setAuthUser] = useLegacyAuth();
  // const selectedRole = sessionStorage.getItem('tempSelectedRole') || localStorage.getItem('selectedRole');
  const [selectedRole, setSelectedRole] = useState(
    sessionStorage.getItem('tempSelectedRole') || ''
  );
  const [formData, setFormData] = useState({ email: '', password: '', confirmPassword: '' });
  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false); 
  const currentRole = selectedRole || "company";
  const content = roleContent[currentRole];
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [linkedinLoading, setLinkedinLoading] = useState(false);

  // Role display names
  const roleDisplayNames = {
    candidate: 'Candidate',
    student: 'Student',
    fresher: 'Fresher',
    college: 'College',
    company: 'Company',
    employer: 'Employer',
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
  const token = queryParams.get('token');
  const error = queryParams.get('error');

  // 1. If no token or error, just stop. This prevents the loop!
  if (!token && !error) return;

  if (error) {
    toast.error(decodeURIComponent(error));
    // Clear the URL error so it doesn't trigger again
    navigate('/signup', { replace: true });
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

  // Save to local storage
  setAuthUser({ user });
  localStorage.setItem('ChatAppUser', JSON.stringify(user));
  localStorage.setItem('token', token);
  
  // Set axios header
  axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;

  toast.success("LinkedIn authentication successful!");

  // Google Analytics event for LinkedIn signup
  trackGAEvent("Auth", "Signup Success", "LinkedIn");

  // Clear the URL query params
  navigate(location.pathname, { replace: true });

  // Handle redirection
  handleAuthRedirect(user, navigate);
}
}, [location.search, navigate]); // Dependencies are correct

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });


  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError('');

    if (!selectedRole) {
      toast.error("Please select a role");
      return;
    }

    //  EMAIL VALIDATION
    if (!emailRegex.test(formData.email)) {
      toast.error('Please enter a valid email address');
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);
    try {
        const response = await axios.post(
            `${import.meta.env.VITE_Backend_URL}/api/auth/send-otp`,
            { email: formData.email }
        );

        if (response.status === 200) {
            toast.success(response.data.message);
            setIsOtpSent(true); // Switch to OTP input view
        }
    } catch (err) {
        const errorMessage = err.response?.data?.message || 'Failed to send OTP.';
        setError(errorMessage);
        toast.error(errorMessage);
    } finally {
        setLoading(false);
    }
  };

  
  const handleVerifyAndSignup = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_Backend_URL}/api/auth/signup`,
        { 
            email: formData.email, 
            password: formData.password, 
            userType: selectedRole,
            otp: otp // Include OTP in payload
        },
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

  // Google Analytics event for email signup
  trackGAEvent("Auth", "Signup Success", "Email/Password");

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

  setAuthUser({ user });
  localStorage.setItem('ChatAppUser', JSON.stringify(user));
  localStorage.setItem('token', token);
  localStorage.setItem('selectedRole', user.userType);
  axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  
  // Google Analytics event for Google signup
  trackGAEvent("Auth", "Signup Success", "Google");
  
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

  const handleLogoClick = () => {
  navigate('/');
};

  return (
  <div className="bg-[#f4f7ff] min-h-screen font-[Inter] text-[#1b1c1d] flex flex-col">

    <main className="flex-grow flex items-center justify-center px-6 py-6 relative">

      {/* Background blur */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-[5%] right-[5%] w-[500px] h-[500px] bg-[#143694]/40 blur-[160px] rounded-full"></div>
        <div className="absolute bottom-[5%] left-[5%] w-[500px] h-[500px] bg-[#143694]/40 blur-[160px] rounded-full"></div>
      </div>

      {/* MAIN CARD */}
      <div className="relative z-10 w-full max-w-[1100px] flex flex-col md:flex-row bg-white rounded-xl shadow-[0_10px_40px_-10px_rgba(27,28,29,0.08)] overflow-hidden">

        {/* LEFT SIDE */}
        <div className="hidden md:flex md:w-5/12 bg-[#143694] p-10 flex-col justify-between text-white relative overflow-hidden">

          {/* Background glow */}
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/20 rounded-full blur-3xl -mr-32 -mt-32"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-300/10 rounded-full blur-3xl -ml-48 -mb-48"></div>
          </div>

          {/* CONTENT */}
          <div className="relative z-10">

            {/* LOGO */}
            {/* <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-white flex items-center justify-center rounded-lg">
                <span
                  className="material-symbols-outlined text-[#143694] cursor-pointer"
                  onClick={() => navigate("/")}
                >
                  <img src ={logo} ></img>
                </span>
              </div>
              <span
                className="text-xl font-extrabold tracking-tight bg-white text-primaryBrand  cursor-pointer"
                onClick={() => navigate("/")}
              >
                RawRecruit
              </span>
            </div> */}

            <div
              className="flex items-center gap-3 mb-6 px-3 py-2 rounded-xl bg-white backdrop-blur-sm cursor-pointer"
              onClick={() => navigate("/")}
            >
              <img src={logo} className="w-9 h-9" />
        
              <span className="text-xl font-bold tracking-tight text-primaryBrand">
                Raw<span className="text-[#1e4ed8]">Recruit</span>
              </span>
            </div>         
            {/* <div className="mb-6">
              <h2 className="font-[Manrope] text-3xl font-bold text-white">
                Join the Network
              </h2>
              {/* <p className="text-white/90 text-sm mt-2">
                Select your journey to begin your intentional connection.
              </p> 
            </div> */}
            {/* ROLE TAG */}
            <p className="text-xs uppercase tracking-widest text-white/70 mb-2">
              {currentRole.toUpperCase()}
            </p>

            {/* HEADING */}
            <h2 className="text-2xl md:text-2xl font-bold leading-tight mb-4 tracking-tight">
              {content?.title}
            </h2>

            {/* FEATURES */}
            <div className="space-y-6">
              {content?.points?.map((item, index) => (
                <div key={index} className="flex items-start gap-4">
                  <span className="material-symbols-outlined text-green-400 mt-1">
                    verified
                  </span>
                  <div>
                    <p className="font-semibold text-lg text-white/95">
                      {item.title}
                    </p>
                    <p className="text-sm opacity-70 text-white">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* FOOTER TEXT */}
          <div className="relative z-10 pt-10 border-t border-white/10 mt-auto">
            <p className="text-xs opacity-70 uppercase tracking-widest text-white">
              Global Operations Control
            </p>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="w-full md:w-7/12 p-8 md:p-6">

          {/* <div className="mb-6">
            <h2 className="font-[Manrope] text-3xl font-bold text-[#041627]">
              Join the Network
            </h2>
            <p className="text-gray-500 text-sm mt-2">
              Select your journey to begin your intentional connection.
            </p>
          </div> */}

          {/* ROLE SELECT */}
          <div className="grid grid-cols-5 gap-2 mt-6 mb-6">
            {["company", "college", "student", "fresher", "professional"].map((role) => (
              <button
                key={role}
                onClick={() => {
                  if (selectedRole === role) {
                    setSelectedRole("");
                    sessionStorage.removeItem("tempSelectedRole");
                  } else {
                    setSelectedRole(role);
                    sessionStorage.setItem("tempSelectedRole", role);
                  }
                }}
                className={`flex flex-col items-center p-3 rounded-xl border transition ${
                  selectedRole === role
                    ? "border-[#143694] bg-[#143694]/10"
                    : "border-gray-200"
                }`}
              >
                <span className="text-[10px] uppercase font-bold tracking-widest">
                  {role}
                </span>
              </button>
            ))}
          </div>

          {/* SOCIAL */}
          <div className="grid grid-cols-1 gap-4 mb-6">
            <button
              onClick={handleLinkedInClick}
              className="w-full flex items-center justify-center gap-3 py-3 border rounded-xl 
              hover:bg-[#143694]/5 hover:border-[#143694] transition"
            >
              <svg className="w-5 h-7 mr-1" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
               <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
              </svg>
              Continue with LinkedIn
            </button>

            <button
              onClick={handleGoogleClick}
              className="w-full flex items-center justify-center gap-3 py-3 border rounded-xl bg-primaryBrand text-white
              hover:bg-[#143694]/5 hover:border-[#143694] transition hover:text-black"
            >
              <svg className="w-5 h-5 mr-1" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path
                fill="currentColor" 
                d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.345-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z" />
              </svg>
              Sign up with Google
            </button>
          </div>

          {/* DIVIDER */}
          <div className="flex items-center mb-6">
            <div className="flex-grow border-t"></div>
            <span className="mx-4 text-xs uppercase text-gray-400">
              OR MANUAL ENTRY
            </span>
            <div className="flex-grow border-t"></div>
          </div>

          {/* FORM */}
          <form onSubmit={isOtpSent ? handleVerifyAndSignup : handleSendOtp} className="space-y-2">

            {!isOtpSent ? (
              <>
                <input
                  type="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  name="email"
                  className="w-full bg-gray-100 p-3 rounded-xl outline-none 
                  focus:ring-2 focus:ring-[#143694]/30 focus:border-[#143694]"
                />

                <input
                  type="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  name="password"
                  className="w-full bg-gray-100 p-3 rounded-xl 
                  focus:ring-2 focus:ring-[#143694]/30"
                />

                <input
                  type="password"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  name="confirmPassword"
                  className="w-full bg-gray-100 p-3 rounded-xl"
                />
              </>
            ) : (
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full text-center text-xl bg-gray-100 p-4 rounded-xl"
                placeholder="123456"
              />
            )}

            <button className="w-full bg-[#143694] text-white py-4 rounded-xl font-bold hover:bg-white hover:text-[#143694] border-2 border-[#143694] transition-all duration-300">
              {isOtpSent ? "Verify & Enter Portal" : "Enter Portal"}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t text-center text-sm text-gray-500">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-[#143694] font-semibold hover:underline"
            >
              Log In
            </Link>
          </div>

        </div>
      </div>
    </main>

    {/* FOOTER */}
    <footer className="py-10 text-center text-xs text-gray-500 border-t">
      © 2025 RawRecruit. Built for intentional connections.
    </footer>
  </div>
);
  // return (
  //   <div className="min-h-screen bg-gradient-to-br from-[#143694]/10 via-[#f093fb]/5 to-[#1e4ed8]/10">
  //     {/* Fixed background elements */}
  //     <div className="fixed inset-0 overflow-hidden pointer-events-none">
  //       <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-[#143694]/10 to-[#1e4ed8]/10 rounded-full blur-3xl"></div>
  //       <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-[#f093fb]/10 to-[#f5576c]/10 rounded-full blur-3xl"></div>
  //     </div>

  //     {/* Header - Same format as RoleSelection */}
  //     <header className="absolute top-6 left-1/2 transform -translate-x-1/2 w-[92%] max-w-6xl bg-white/70 backdrop-blur-xl rounded-2xl border border-white/40 shadow-2xl z-50">
  //       <div className="px-8 py-3 flex justify-between items-center">
  //         {/* RawRecruit Logo on left */}
  //         <button 
  //           onClick={handleLogoClick}
  //           className="focus:outline-none"
  //         >
  //           <img 
  //             src={heroImage} 
  //             alt="RawRecruit Logo" 
  //             className="h-16 w-auto object-contain"
  //           />
  //         </button>

  //         {/* Empty middle and right side since we only want the logo */}
  //         <div></div>
  //         <div></div>
  //       </div>
  //     </header>

  //     {/* Centered Signup Card */}
  //     <div className="min-h-screen flex items-center justify-center p-4 pt-32">
  //       <div className="relative w-full max-w-md">
  //         {/* Blur Background behind card */}
  //         <div className="absolute inset-0 bg-gradient-to-br from-[#143694]/5 to-[#1e4ed8]/5 backdrop-blur-sm rounded-2xl -inset-4 bottom-4"></div>
          
  //         {/* Main Signup Card */}
  //         <div className="relative bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-100 p-8">
  //           {/* Decorative top bar */}
  //           <div className="h-1 bg-gradient-to-r from-[#143694] via-[#f093fb] to-[#43e97b] rounded-t-2xl absolute top-0 left-0 right-0"></div>
            
  //           {/* Header */}
  //           <div className="text-center mb-8">
  //             <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#143694]/10 to-[#1e4ed8]/10 text-[#143694] px-4 py-2 rounded-full text-sm font-semibold mb-4 shadow-sm">
  //               <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
  //                 <path fillRule="evenodd" d="M9 4.5a.75.75 0 01.721.544l.813 2.846a3.75 3.75 0 002.576 2.576l2.846.813a.75.75 0 010 1.442l-2.846.813a3.75 3.75 0 00-2.576 2.576l-.813 2.846a.75.75 0 01-1.442 0l-.813-2.846a3.75 3.75 0 00-2.576-2.576l-2.846-.813a.75.75 0 010-1.442l2.846-.813A3.75 3.75 0 007.466 7.89l.813-2.846A.75.75 0 019 4.5zM18 1.5a.75.75 0 01.728.568l.258 1.036c.236.94.97 1.674 1.91 1.91l1.036.258a.75.75 0 010 1.456l-1.036.258c-.94.236-1.674.97-1.91 1.91l-.258 1.036a.75.75 0 01-1.456 0l-.258-1.036a2.625 2.625 0 00-1.91-1.91l-1.036-.258a.75.75 0 010-1.456l1.036-.258a2.625 2.625 0 001.91-1.91l.258-1.036A.75.75 0 0118 1.5zM16.5 15a.75.75 0 01.712.513l.394 1.183c.15.447.5.799.948.948l1.183.395a.75.75 0 010 1.422l-1.183.395c-.447.15-.799.5-.948.948l-.395 1.183a.75.75 0 01-1.422 0l-.395-1.183a1.5 1.5 0 00-.948-.948l-1.183-.395a.75.75 0 010-1.422l1.183-.395c.447-.15.799-.5.948-.948l.395-1.183A.75.75 0 0116.5 15z" clipRule="evenodd" />
  //               </svg>
  //               Sign Up
  //             </div>
              
  //             <h1 className="text-2xl font-bold text-gray-800 mb-2">
  //               Create Your Account
  //             </h1>
              
  //             {selectedRole && (
  //               <p className="text-gray-600">
  //                 Signing up as <span className="font-semibold text-[#143694]">{roleDisplayNames[selectedRole] || selectedRole}</span>
  //               </p>
  //             )}
  //           </div>

  //           {/* Signup Form */}
  //           <form onSubmit={isOtpSent ? handleVerifyAndSignup : handleSendOtp} className="space-y-4">
  //             {!isOtpSent ? (
  //               // --- Step 1: Form Inputs ---
  //               <>
  //                 <div>
  //                   <input
  //                     type="email"
  //                     name="email"
  //                     value={formData.email}
  //                     onChange={handleChange}
  //                     className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#143694]/30 focus:border-[#143694] transition-all duration-300 bg-white/80"
  //                     placeholder="Email Address"
  //                     required
  //                   />
  //                 </div>

  //                 <div>
  //                   <input
  //                     type="password"
  //                     name="password"
  //                     value={formData.password}
  //                     onChange={handleChange}
  //                     className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#143694]/30 focus:border-[#143694] transition-all duration-300 bg-white/80"
  //                     placeholder="Password"
  //                     required
  //                   />
  //                 </div>

  //                 <div>
  //                   <input
  //                     type="password"
  //                     name="confirmPassword"
  //                     value={formData.confirmPassword}
  //                     onChange={handleChange}
  //                     className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#143694]/30 focus:border-[#143694] transition-all duration-300 bg-white/80"
  //                     placeholder="Confirm Password"
  //                     required
  //                   />
  //                 </div>
  //               </>
  //             ) : (
  //               // --- Step 2: OTP Input ---
  //               <div className="animate-in fade-in slide-in-from-right-5 duration-300">
  //                 <div className="text-center mb-4">
  //                   <p className="text-sm text-gray-500">We sent a verification code to</p>
  //                   <p className="font-medium text-gray-800">{formData.email}</p>
  //                   <button 
  //                       type="button" 
  //                       onClick={() => setIsOtpSent(false)}
  //                       className="text-xs text-[#143694] underline mt-1"
  //                   >
  //                       Change Email
  //                   </button>
  //                 </div>
  //                 <input
  //                   type="text"
  //                   value={otp}
  //                   onChange={(e) => setOtp(e.target.value)}
  //                   className="w-full px-4 py-3 text-center text-2xl tracking-widest border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#143694]/30 focus:border-[#143694] transition-all duration-300 bg-white/80"
  //                   placeholder="123456"
  //                   maxLength="6"
  //                   required
  //                 />
  //               </div>
  //             )}

  //             {error && (
  //               <div className="p-3 bg-red-50 border border-red-200 rounded-xl">
  //                 <p className="text-red-600 text-sm">{error}</p>
  //               </div>
  //             )}

  //             <button
  //               type="submit"
  //               className="w-full bg-gradient-to-r from-[#143694] to-[#1e4ed8] text-white py-3.5 rounded-xl font-semibold hover:shadow-lg hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-md"
  //               disabled={loading}
  //             >
  //               {loading ? (
  //                 <span className="flex items-center justify-center gap-2">
  //                   <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
  //                     <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
  //                     <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  //                   </svg>
  //                   {isOtpSent ? "Verifying..." : "Sending OTP..."}
  //                 </span>
  //               ) : (
  //                 isOtpSent ? 'Verify & Register' : 'Continue'
  //               )}
  //             </button>
  //           </form>

  //           {/* Divider */}
  //           <div className="my-6 relative flex items-center">
  //             <div className="flex-grow border-t border-gray-200"></div>
  //             <span className="mx-4 text-gray-500 text-sm">Or continue with</span>
  //             <div className="flex-grow border-t border-gray-200"></div>
  //           </div>

  //           {/* Social Signup Buttons */}
  //           <div className="space-y-3">
  //             <button
  //               onClick={handleGoogleClick}
  //               className="w-full border border-gray-200 py-3 rounded-xl flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 transition-all duration-300 hover:shadow-sm"
  //               disabled={googleLoading || isOtpSent}
  //             >
  //               {googleLoading ? (
  //                 <span className="flex items-center justify-center gap-2">
  //                   <svg className="animate-spin h-5 w-5 text-gray-800" viewBox="0 0 24 24">
  //                     <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
  //                     <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  //                   </svg>
  //                   Signing up...
  //                 </span>
  //               ) : (
  //                 <>
  //                   <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  //                     <path d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.345-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z" />
  //                   </svg>
  //                   Sign up with Google
  //                 </>
  //               )}
  //             </button>

  //             <button
  //               onClick={handleLinkedInClick}
  //               className="w-full border border-gray-200 py-3 rounded-xl flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 transition-all duration-300 hover:shadow-sm"
  //               disabled={linkedinLoading || isOtpSent}
  //             >
  //               {linkedinLoading ? (
  //                 <span className="flex items-center justify-center gap-2">
  //                   <svg className="animate-spin h-5 w-5 text-gray-800" viewBox="0 0 24 24">
  //                     <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
  //                     <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  //                   </svg>
  //                   Signing up...
  //                 </span>
  //               ) : (
  //                 <>
  //                   <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  //                     <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
  //                   </svg>
  //                   Sign up with LinkedIn
  //                 </>
  //               )}
  //             </button>
  //           </div>

  //           {/* Login Link */}
  //           <p className="text-center mt-6 text-gray-600">
  //             Already have an account?{' '}
  //             <Link 
  //               to="/login" 
  //               className="text-[#143694] font-semibold hover:text-[#1e4ed8] hover:underline transition-colors"
  //             >
  //               Log In
  //             </Link>
  //           </p>
  //         </div>

  //         {/* Footer */}
  //         <div className="mt-6 text-center">
  //           <p className="text-gray-500 text-sm">
  //             © 2025 RawRecruit. All rights reserved.
  //           </p>
  //         </div>
  //       </div>
  //     </div>
  //   </div>
  // );
}

export default SignupPage;