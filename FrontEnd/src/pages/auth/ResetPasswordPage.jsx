import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import {validateResetToken , resetPassword} from '../../lib/User_AxiosInstance' ;

function ResetPasswordPage() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ 
    password: '', 
    confirmPassword: '' 
  });
  const [loading, setLoading] = useState(false);
  const [validating, setValidating] = useState(true);
  const [validToken, setValidToken] = useState(false);
  const [email, setEmail] = useState('');
  const [passwordError, setPasswordError] = useState('');

  useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        toast.error('No reset token provided');
        setValidating(false);
        return;
      }

      console.log('🔍 Frontend: Validating token:', token);
      
      try {
        const response = await validateResetToken(token);
        
        console.log('✅ Frontend: Token validation response:', response.data);
        
        if (response.data.success) {
          setValidToken(true);
          setEmail(response.data.email);
          toast.success('Reset link is valid');
        } else {
          toast.error(response.data.message || 'Invalid reset link');
        }
      } catch (error) {
        console.error('❌ Frontend: Token validation error:', error.response?.data || error.message);
        const errorMessage = error.response?.data?.message || 'Invalid or expired reset link';
        toast.error(errorMessage);
      } finally {
        setValidating(false);
      }
    };

    validateToken();
  }, [token]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setPasswordError('');
  };

  const validatePassword = () => {
    if (formData.password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setPasswordError('Passwords do not match');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validatePassword()) {
      return;
    }

    setLoading(true);
    
    try {
      console.log('🔄 Frontend: Submitting password reset with token');
      
      const response = await resetPassword(token, formData.password);

      console.log('✅ Frontend: Reset response:', response.data);

      if (response.data.success) {
        toast.success('Password reset successfully! Redirecting to login...');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        toast.error(response.data.message || 'Failed to reset password');
      }
    } catch (error) {
      console.error('❌ Frontend: Reset error:', error.response?.data || error.message);
      const errorMessage = error.response?.data?.message || 'Failed to reset password. Please try again.';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Debug information
  useEffect(() => {
    console.log('🔧 Frontend Debug Info:');
    console.log('   Token from URL:', token);
    console.log('   Validating:', validating);
    console.log('   Valid Token:', validToken);
    console.log('   Email:', email);
  }, [token, validating, validToken, email]);

  if (validating) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#143694]/10 via-[#f093fb]/5 to-[#1e4ed8]/10 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#143694] mx-auto"></div>
          <p className="mt-4 text-gray-600">Validating reset link...</p>
          <p className="mt-2 text-sm text-gray-500">Token: {token?.substring(0, 20)}...</p>
        </div>
      </div>
    );
  }

  if (!validToken) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#143694]/10 via-[#f093fb]/5 to-[#1e4ed8]/10">
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-[#143694]/10 to-[#1e4ed8]/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-[#f093fb]/10 to-[#f5576c]/10 rounded-full blur-3xl"></div>
        </div>

        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="relative w-full max-w-md">
            <div className="absolute inset-0 bg-gradient-to-br from-[#143694]/5 to-[#1e4ed8]/5 backdrop-blur-sm rounded-2xl -inset-x-4 bottom-4"></div>
            
            <div className="relative bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-100 p-8 text-center">
              <div className="h-1 bg-gradient-to-r from-[#f5576c] via-[#f093fb] to-[#f5576c] rounded-t-2xl absolute top-0 left-0 right-0"></div>
              
              <div className="text-red-500 mb-6">
                <svg className="w-20 h-20 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Invalid Reset Link</h2>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
                <p className="text-sm text-gray-700 mb-2">
                  <strong>Common reasons:</strong>
                </p>
                <ul className="text-xs text-gray-600 text-left space-y-1">
                  <li className="flex items-start gap-2">
                    <span className="text-red-500">•</span>
                    The link has expired (valid for 15 minutes only)
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500">•</span>
                    The link was already used
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500">•</span>
                    Invalid or malformed token
                  </li>
                </ul>
              </div>
              
              <div className="space-y-4">
                <Link 
                  to="/forgot-password" 
                  className="block w-full bg-gradient-to-r from-[#143694] to-[#1e4ed8] text-white py-3.5 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 shadow-md"
                >
                  Request New Reset Link
                </Link>
                
                <Link 
                  to="/login" 
                  className="block w-full border border-gray-200 py-3 rounded-xl flex items-center justify-center hover:bg-gray-50 transition-all duration-300 text-gray-700"
                >
                  Back to Login
                </Link>
              </div>
              
              {/* Debug info (remove in production) */}
              {process.env.NODE_ENV === 'development' && (
                <div className="mt-6 p-3 bg-gray-100 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">Debug Info:</p>
                  <p className="text-xs text-gray-500 break-all">Token: {token}</p>
                  <p className="text-xs text-gray-500">Token length: {token?.length} chars</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#143694]/10 via-[#f093fb]/5 to-[#1e4ed8]/10">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-[#143694]/10 to-[#1e4ed8]/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-[#f093fb]/10 to-[#f5576c]/10 rounded-full blur-3xl"></div>
      </div>

      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="relative w-full max-w-md">
          <div className="absolute inset-0 bg-gradient-to-br from-[#143694]/5 to-[#1e4ed8]/5 backdrop-blur-sm rounded-2xl -inset-x-4 bottom-4"></div>
          
          <div className="relative bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-100 p-8">
            <div className="h-1 bg-gradient-to-r from-[#43e97b] via-[#143694] to-[#1e4ed8] rounded-t-2xl absolute top-0 left-0 right-0"></div>
            
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#43e97b]/10 to-[#143694]/10 text-[#43e97b] px-4 py-2 rounded-full text-sm font-semibold mb-4 shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                  <path fillRule="evenodd" d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3c0-2.9-2.35-5.25-5.25-5.25zm3.75 8.25v-3a3.75 3.75 0 10-7.5 0v3h7.5z" clipRule="evenodd" />
                </svg>
                Set New Password
              </div>
              
              <h1 className="text-2xl font-bold text-gray-800 mb-2">
                Create New Password
              </h1>
              
              <p className="text-gray-600">
                Enter a new password for your account
              </p>
              
              {email && (
                <div className="mt-3 inline-flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full">
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                  </svg>
                  <span className="text-sm text-gray-700">{email}</span>
                </div>
              )}
              
              <div className="mt-2 text-sm text-green-600 bg-green-50 px-3 py-1 rounded-lg inline-block">
                ✓ Valid reset link
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    New Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#143694]/30 focus:border-[#143694] transition-all duration-300 bg-white/80"
                    placeholder="Enter new password (min. 6 characters)"
                    required
                    minLength="6"
                    disabled={loading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#143694]/30 focus:border-[#143694] transition-all duration-300 bg-white/80"
                    placeholder="Confirm new password"
                    required
                    minLength="6"
                    disabled={loading}
                  />
                </div>

                {passwordError && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-xl">
                    <p className="text-red-600 text-sm flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      {passwordError}
                    </p>
                  </div>
                )}

                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <p className="text-sm text-gray-700 mb-2">
                    <strong>Password requirements:</strong>
                  </p>
                  <ul className="text-xs text-gray-600 space-y-1">
                    <li className="flex items-center gap-2">
                      <svg className={`w-4 h-4 ${formData.password.length >= 6 ? 'text-green-500' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                      </svg>
                      At least 6 characters long
                    </li>
                    <li className="flex items-center gap-2">
                      <svg className={`w-4 h-4 ${formData.password === formData.confirmPassword && formData.password ? 'text-green-500' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                      </svg>
                      Passwords must match
                    </li>
                  </ul>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-[#43e97b] to-[#143694] text-white py-3.5 rounded-xl font-semibold hover:shadow-lg hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-md"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Resetting Password...
                  </span>
                ) : (
                  'Reset Password'
                )}
              </button>
            </form>

            <div className="mt-8 text-center">
              <Link 
                to="/login" 
                className="inline-flex items-center text-gray-600 hover:text-gray-800 transition-colors"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                </svg>
                Back to Login
              </Link>
            </div>
          </div>

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

export default ResetPasswordPage;