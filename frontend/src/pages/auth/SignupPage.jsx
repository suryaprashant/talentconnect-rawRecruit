// import { useLocation, useNavigate } from 'react-router-dom';
// import { useState } from 'react';
// import axios from 'axios';
// import { useAuth } from '../../context/AuthProvider';
// import toast from 'react-hot-toast';

// function SignupPage() {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const [authUser, setAuthUser] = useAuth();
//   const userType = localStorage.getItem('selectedRole') || 'student';

//   const [formData, setFormData] = useState({
//     email: '',
//     password: '',
//     confirmPassword: '',
//   });
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');
//     setLoading(true);

//     if (formData.password !== formData.confirmPassword) {
//       setError('Passwords do not match');
//       setLoading(false);
//       return;
//     }

//     try {
//       const response = await axios.post('http://localhost:5000/api/auth/signup', {
//         email: formData.email,
//         password: formData.password,
//         userType: userType,
//       }, { withCredentials: true ,
//         headers: {
//             'Content-Type': 'application/json'
//         }

//       });

//       if (response.status === 201) {
//         toast.success('Signup successful!');
//         localStorage.setItem('authUser', JSON.stringify(response.data));
//         setAuthUser(response.data);

//         // Store token if available in response
//         if (response.data.token) {
//           localStorage.setItem('token', response.data.token);
//         }

//         // Navigate based on userType
//         const onboardingRoutes = {
//           candidate: '/student-form',
//           company: '/company-form',
//           college: '/college-onboarding',
//           employer: '/employer-onboarding'
//         };
        
//         navigate(onboardingRoutes[userType]);
//       }
//     } catch (err) {
//       console.error('Signup Error:', err.response?.data || err.message);
//       const errorMessage = err.response?.data?.message || 'An unexpected error occurred during signup.';
//       setError(errorMessage);
//       toast.error(errorMessage);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleLinkedInLogin = () => {
//     const clientId = '77h8xw3kje71lm';
//     const redirectUri = encodeURIComponent('http://localhost:5173/auth/linkedin/callback');
//     const state = Math.random().toString(36).substring(2);
//     const scope = encodeURIComponent('r_liteprofile r_emailaddress');

//     const linkedInAuthUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&state=${state}&scope=${scope}`;

//     sessionStorage.setItem('linkedin_oauth_state', state);
//     window.location.href = linkedInAuthUrl;
//   };

//   return (
//     <div className="min-h-screen flex">
//       {/* Left Side - Form */}
//       <div className="w-full md:w-1/2 flex flex-col p-8">
//         {/* Logo */}
//         <div className="mb-10">
//           <h1 className="text-xl font-italic font-bold">Logo</h1>
//         </div>

//         {/* Sign Up Form */}
//         <div className="flex-grow flex flex-col justify-center max-w-md mx-auto w-full">
//           <h1 className="text-3xl font-bold mb-2">Sign Up - {userType}</h1>
//           <p className="text-gray-600 mb-8">Sign up to get started as a {userType}.</p>

//           <form onSubmit={handleSubmit} className="space-y-4">
//             <div>
//               <input
//                 type="email"
//                 name="email"
//                 value={formData.email}
//                 onChange={handleChange}
//                 className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-black"
//                 placeholder="Email"
//                 required
//               />
//             </div>

//             <div>
//               <input
//                 type="password"
//                 name="password"
//                 value={formData.password}
//                 onChange={handleChange}
//                 className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-black"
//                 placeholder="Password"
//                 required
//               />
//             </div>

//             <div>
//               <input
//                 type="password"
//                 name="confirmPassword"
//                 value={formData.confirmPassword}
//                 onChange={handleChange}
//                 className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-black"
//                 placeholder="Confirm Password"
//                 required
//               />
//             </div>
            
//             {error && <p className="text-red-500 text-sm">{error}</p>}

//             <button
//               type="submit"
//               className="w-full bg-black text-white py-3 hover:bg-gray-800 transition-colors disabled:opacity-50"
//               disabled={loading}
//             >
//               {loading ? 'Signing up...' : 'Sign up'}
//             </button>
//           </form>

//           <div className="my-6 relative flex items-center">
//             <div className="flex-grow border-t border-gray-300"></div>
//             <div className="flex-grow border-t border-gray-300"></div>
//           </div>

//           <button className="w-full border border-gray-300 py-3 flex items-center justify-center mb-3 hover:bg-gray-50">
//             <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//               <path d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.345-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z"/>
//             </svg>
//             Sign up with Google
//           </button>

//           <button 
//             onClick={handleLinkedInLogin}
//             className="w-full border border-gray-300 py-3 flex items-center justify-center hover:bg-gray-50"
//           >
//             <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//               <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
//             </svg>
//             Sign up with LinkedIn
//           </button>

//           <p className="text-center mt-6">
//             Already have an account? <a href="/login" className="text-black hover:underline">Log In</a>
//           </p>
//         </div>

//         {/* Footer */}
//         <div className="mt-auto">
//           <p className="text-sm text-gray-500">© 2025 TalentConnects</p>
//         </div>
//       </div>

//       {/* Right Side - Image Placeholder */}
//       <div className="hidden md:flex md:w-1/2 bg-gray-200 items-center justify-center">
//         <div className="w-48 h-48 bg-gray-300 flex items-center justify-center">
//           <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
//           </svg>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default SignupPage;






// import { useLocation, useNavigate, Link } from 'react-router-dom'; // Add Link
// import { useState } from 'react';
// import axios from 'axios';
// import { useAuth } from '../../context/AuthProvider';
// import toast from 'react-hot-toast';
// import axiosInstance from '../../lib/axiosInstance'; // Import axiosInstance

// function SignupPage() {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const [authUser, setAuthUser] = useAuth();
//   const userType = localStorage.getItem('selectedRole') || 'student'; // Default to 'student' if not set

//   const [formData, setFormData] = useState({
//     email: '',
//     password: '',
//     confirmPassword: '',
//   });
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');
//     setLoading(true);

//     if (formData.password !== formData.confirmPassword) {
//       setError('Passwords do not match');
//       setLoading(false);
//       return;
//     }

//     try {
//       const response = await axios.post(`${import.meta.env.VITE_Backend_URL}/api/auth/signup`, {
//         email: formData.email,
//         password: formData.password,
//         userType: userType,
//       }, {
//         withCredentials: true,
//         headers: {
//           'Content-Type': 'application/json'
//         }
//       });

//       if (response.status === 201) {
//         toast.success('Signup successful!');
//         // Store user data in localStorage using the consistent key
//         localStorage.setItem('ChatAppUser', JSON.stringify(response.data));
//         localStorage.setItem('token', response.data.token); // Still useful for the axios instance

//         // Set auth context
//         setAuthUser(response.data); // Update authUser in context

//         // Dynamically set Authorization header for axiosInstance
//         axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;

//         // Navigate based on userType
//         const onboardingRoutes = {
//           candidate: '/student-form',
//           company: '/company-form',
//           college: '/college-onboarding',
//           employer: '/employer-onboarding', // Added employer as it's a potential userType
//           fresher: '/student-form', // Assuming freshers go through a similar form
//           professional: '/student-form' // Assuming professionals go through a similar form
//         };
        
//         // Use a fallback if userType doesn't match a defined route
//         navigate(onboardingRoutes[userType] || '/home'); // Redirect to home as a default fallback
//       }
//     } catch (err) {
//       console.error('Signup Error:', err.response?.data || err.message);
//       const errorMessage = err.response?.data?.message || 'An unexpected error occurred during signup.';
//       setError(errorMessage);
//       toast.error(errorMessage);
//     } finally {
//       setLoading(false);
//     }
//   };




import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthProvider';
import toast from 'react-hot-toast';
import axiosInstance from '../../lib/axiosInstance';
import { useRole } from '../../context/RoleContext/RoleContext'; // Add
import { useGoogleLogin } from '@react-oauth/google';

function SignupPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [authUser, setAuthUser] = useAuth();
  const { selectedRole } = useRole(); // Get selectedRole from RoleContext

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading , setGoogleLoading] = useState(false) ;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

 const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      console.log('Sending userType:', selectedRole); // Debug log
      const response = await axios.post(`${import.meta.env.VITE_Backend_URL}/api/auth/signup`, {
        email: formData.email,
        password: formData.password,
        userType: selectedRole, // Use selectedRole directly
      }, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 201) {
        toast.success('Signup successful!');
        localStorage.setItem('ChatAppUser', JSON.stringify(response.data));
        localStorage.setItem('token', response.data.token);
        setAuthUser(response.data);
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;

        // Clear the selectedRole from context and localStorage
       // clearRole();

        const onboardingRoutes = {
          candidate: '/student-form',
          company: '/company-form',
          college: '/college-onboarding',
          employer: '/employer-onboarding',
        };
        
        navigate(onboardingRoutes[selectedRole] || '/home');
      }
    } catch (err) {
      console.error('Signup Error:', err.response?.data || err.message);
      const errorMessage = err.response?.data?.message || 'An unexpected error occurred during signup.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

     // New Google Login Success Handler
  const handleGoogleSuccess = async (googleResponse) => {
    setGoogleLoading(true); // Set loading while we process Google response
    try {
      // The 'credential' property contains the ID token
      const tokenId = googleResponse.credential;

      const response = await axios.post(
        `${import.meta.env.VITE_Backend_URL}/api/auth/google`,
        { tokenId, userType: selectedRole }, // Send selectedRole to backend
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status === 200) {
        toast.success('Google login successful!');
        localStorage.setItem('ChatAppUser', JSON.stringify(response.data));
        localStorage.setItem('token', response.data.token);
        setAuthUser(response.data);
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;

        const onboardingRoutes = {
          candidate: '/student-form',
          company: '/company-form',
          college: '/college-onboarding',
          employer: '/employer-onboarding',
        };
        navigate(onboardingRoutes[selectedRole] || '/home');
      } else {
        toast.error(response.data.message || 'Google login failed');
      }
    } catch (error) {
      console.error('Google Login Error:', error.response?.data || error.message);
      const errorMessage = error.response?.data?.message || 'Google login failed';
      toast.error(errorMessage);
    } finally {
      setGoogleLoading(false); // Reset loading state
    }
  };

  // Google Login Error Handler
  const handleGoogleError = () => {
    console.log('Google Login Failed');
    toast.error('Google login failed. Please try again.');
    setGoogleLoading(false); // Ensure loading is reset on error
  };

  // Initialize the useGoogleLogin hook
  const googleLogin = useGoogleLogin({
    onSuccess: handleGoogleSuccess,
    onError: handleGoogleError,
    flow: 'implicit', // 'implicit' for ID token flow, 'auth-code' for authorization code flow (more secure)
                      // 'implicit' is simpler for direct ID token use on frontend for initial setup
                      // If you want more security, you might switch to 'auth-code' and exchange it on backend
  });



  const handleLinkedInLogin = () => {
    const clientId = '77h8xw3kje71lm';
    const redirectUri = encodeURIComponent('http://localhost:5173/auth/linkedin/callback');
    const state = Math.random().toString(36).substring(2);
    const scope = encodeURIComponent('r_liteprofile r_emailaddress');

    const linkedInAuthUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&state=${state}&scope=${scope}`;

    sessionStorage.setItem('linkedin_oauth_state', state);
    window.location.href = linkedInAuthUrl;
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Form */}
      <div className="w-full md:w-1/2 flex flex-col p-8">
        {/* Logo */}
        <div className="mb-10">
          <h1 className="text-xl font-italic font-bold">Logo</h1>
        </div>

        {/* Sign Up Form */}
        <div className="flex-grow flex flex-col justify-center max-w-md mx-auto w-full">
          <h1 className="text-3xl font-bold mb-2">Sign Up - {selectedRole}</h1>
          <p className="text-gray-600 mb-8">Sign up to get started as a {selectedRole}.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-black"
                placeholder="Email"
                required
              />
            </div>

            <div>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-black"
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
                className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-black"
                placeholder="Confirm Password"
                required
              />
            </div>
            
            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button
              type="submit"
              className="w-full bg-black text-white py-3 hover:bg-gray-800 transition-colors disabled:opacity-50"
              disabled={loading}
            >
              {loading ? 'Signing up...' : 'Sign up'}
            </button>
          </form>

          <div className="my-6 relative flex items-center">
            <div className="flex-grow border-t border-gray-300"></div>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>

           {/* Modified Google Button */}
          <button
            onClick={() => {
              setGoogleLoading(true); // Set loading state immediately on click
              googleLogin(); // Trigger the Google login flow
            }}
            className="w-full border border-gray-300 py-3 flex items-center justify-center mb-3 hover:bg-gray-50 disabled:opacity-50"
            disabled={googleLoading}
          >
            {googleLoading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-gray-800 mr-3" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing up with Google...
              </>
            ) : (
              <>
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.345-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z"/>
                </svg>
                Sign up with Google
              </>
            )}
          </button>

          <button 
            onClick={handleLinkedInLogin}
            className="w-full border border-gray-300 py-3 flex items-center justify-center hover:bg-gray-50"
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
            </svg>
            Sign up with LinkedIn
          </button>

          <p className="text-center mt-6">
            Already have an account? <Link to="/login" className="text-black hover:underline">Log In</Link>
          </p>
        </div>

        {/* Footer */}
        <div className="mt-auto">
          <p className="text-sm text-gray-500">© 2025 TalentConnects</p>
        </div>
      </div>

      {/* Right Side - Image Placeholder */}
      <div className="hidden md:flex md:w-1/2 bg-gray-200 items-center justify-center">
        <div className="w-48 h-48 bg-gray-300 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
      </div>
    </div>
  );
}

export default SignupPage;