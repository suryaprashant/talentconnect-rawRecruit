import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Shield, Eye, EyeOff, Users, TrendingUp } from "lucide-react";
import { toast } from "react-hot-toast";
import { useAdmin } from "../../../context/AdminProvider";

const AdminLogin = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAdmin();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!form.email || !form.password) {
      setError("Please enter both email and password.");
      setLoading(false);
      return;
    }

    try {
      const result = await login(form.email, form.password);
      console.log(result, " is the result I am getting");
      
      if (result.success) {
        toast.success("Admin login successful!");
        navigate("/admin/dashboard");
      } else {
        setError(result.message);
        toast.error(result.message);
      }
    } catch (err) {
      console.error('Admin Login Error:', err);
      const errorMessage = "Login failed. Please try again.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-teal-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Left Info Section */}
        <div className="hidden lg:flex flex-col justify-center p-8 animate-slide-right">
          <div className="space-y-8">
            <div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent mb-4">
                RawRecruit
              </h1>
              <p className="text-xl text-slate-600 mb-8">
                Comprehensive Admin Panel for Campus Recruitment Management
              </p>
            </div>

            {/* Features */}
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-teal-500 to-[#1e4ed8] flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">User Management</h3>
                  <p className="text-slate-600">Manage candidates, colleges, and companies</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">Analytics Dashboard</h3>
                  <p className="text-slate-600">Real-time insights and performance metrics</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-yellow-400 to-amber-500 flex items-center justify-center">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">Secure Access</h3>
                  <p className="text-slate-600">
                    Protected admin interface with role-based access
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Login Card */}
        <div className="flex justify-center animate-slide-up">
          <div className="rounded-xl bg-white/70 backdrop-blur-lg text-card-foreground w-full max-w-md border shadow-2xl">
            <div className="flex flex-col p-6 space-y-2 text-center pb-8">
              <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-r from-teal-500 to-[#1e4ed8] flex items-center justify-center mb-4">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <div className="tracking-tight text-2xl font-bold text-slate-900">
                Admin Login
              </div>
              <div className="text-sm text-slate-600">
                Enter your credentials to access the admin panel
              </div>
            </div>

            <div className="p-6 pt-0">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-slate-700">
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    value={form.email}
                    onChange={handleChange}
                    className="w-full h-12 rounded-md border border-slate-200 px-3 py-2 focus:border-teal-500 focus:ring-teal-500 focus:outline-none transition"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-medium text-slate-700">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={form.password}
                      onChange={handleChange}
                      className="w-full h-12 rounded-md border border-slate-200 px-3 py-2 pr-12 focus:border-teal-500 focus:ring-teal-500 focus:outline-none transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2 top-2.5 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {error && <div className="text-red-500 text-sm text-center">{error}</div>}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 bg-gradient-to-r from-teal-500 to-[#1e4ed8] text-white font-medium rounded-md shadow hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Signing In..." : "Sign In"}
                </button>
              </form>

              <div className="mt-6 p-4 bg-slate-50 rounded-lg border text-xs text-slate-600 text-center">
                <p className="mb-2 font-semibold">Demo Credentials:</p>
                <p>
                  Email:{" "}
                  <span className="font-mono bg-white px-2 py-1 rounded">admin@rawrecruit.com</span>
                  <br />
                  Password:{" "}
                  <span className="font-mono bg-white px-2 py-1 rounded">admin123</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
