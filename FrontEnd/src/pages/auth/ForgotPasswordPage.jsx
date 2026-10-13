import { useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { requestPasswordReset } from '../../lib/User_AxiosInstance'; 
import logo from "../../assets/logo1.png";
function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await requestPasswordReset(email);
      
      if (response.data.success) {
        toast.success('Check your email for reset instructions!');
        setSubmitted(true);
      } else {
        toast.error(response.data.message || 'Something went wrong');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to send reset link. Please try again.';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

 return (
  <div className="min-h-screen bg-gradient-to-br from-[#143694]/5 via-white to-[#143694]/10">

    {/* Background decorative elements */}
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-[#143694]/10 to-[#1e4ed8]/10 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-[#1e4ed8]/10 to-[#143694]/10 rounded-full blur-3xl"></div>
    </div>

    {/* Logo */}
    <div className="absolute top-6 left-6 flex items-center gap-3 cursor-pointer">
      <img src={logo} className="w-9 h-9" />

      <span className="text-xl font-bold tracking-tight text-primaryBrand">
        Raw<span className="text-[#1e4ed8]">Recruit</span>
      </span>
    </div>

    {/* Centered Card */}
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="relative w-full max-w-md">

        {/* Blur Background */}
        <div className="absolute inset-0 bg-[#143694]/5 backdrop-blur-sm rounded-2xl -inset-x-4 bottom-4"></div>

        {/* Main Card */}
        <div className="relative bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-100 p-8">

          {/* Top bar */}
          <div className="h-1 bg-[#143694] rounded-t-2xl absolute top-0 left-0 right-0"></div>

          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-[#143694]/10 text-[#143694] px-4 py-2 rounded-full text-sm font-semibold mb-4 shadow-sm">
              Reset Password
            </div>

            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              Forgot Your Password?
            </h1>

            <p className="text-gray-600">
              {submitted
                ? "Check your email for reset instructions"
                : "Enter your email to receive a reset link"}
            </p>
          </div>

          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#143694]/30 focus:border-[#143694] transition-all duration-300 bg-white/80"
                placeholder="Enter your email address"
                required
                disabled={loading}
              />

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#143694] hover:bg-[#1e4ed8] text-white py-3.5 rounded-xl font-semibold hover:shadow-lg hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-md"
              >
                {loading ? "Sending..." : "Send Reset Link"}
              </button>
            </form>
          ) : (
            <div className="text-center space-y-6">

              <div className="text-green-500 text-4xl">✓</div>

              <div>
                <p className="text-gray-700 font-medium">
                  We've sent password reset instructions to
                </p>
                <p className="text-[#143694] font-bold text-lg mt-1">{email}</p>
              </div>

              <div className="bg-[#143694]/5 border border-[#143694]/20 rounded-xl p-4">
                <p className="text-sm text-gray-600">
                  <strong>Note:</strong> The reset link will expire in 15 minutes.
                  Check your spam folder if you don't see the email.
                </p>
              </div>

              <button
                onClick={() => {
                  setSubmitted(false);
                  setEmail("");
                }}
                className="w-full border border-gray-200 py-3 rounded-xl hover:bg-gray-50 transition-all duration-300 hover:shadow-sm text-gray-700"
              >
                Send another reset link
              </button>
            </div>
          )}

          {/* Back to Login */}
          <div className="mt-8 text-center">
            <Link
              to="/login"
              className="inline-flex items-center text-[#143694] hover:text-[#1e4ed8] hover:underline transition-colors"
            >
              ← Back to Login
            </Link>
          </div>
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

export default ForgotPasswordPage;