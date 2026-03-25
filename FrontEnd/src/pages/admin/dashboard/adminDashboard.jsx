import React, { useState, useEffect, useRef } from 'react';
import {
  Users,
  Building2,
  GraduationCap,
  FileText,
  TrendingUp,
  Shield,
  LogOut,
  Settings,
  SlidersHorizontal,
  X,
  CheckCircle2,
  AlertCircle,
  Eye
} from 'lucide-react';
import axios from 'axios';

/* ─────────────────────────────────────────────
   Threshold Modal
───────────────────────────────────────────── */
const ThresholdModal = ({ isOpen, onClose }) => {
  const [threshold, setThreshold] = useState(50);
  const [inputValue, setInputValue] = useState('50');
  const [status, setStatus] = useState(null); // 'success' | 'error' | null
  const [loading, setLoading] = useState(false);
  const overlayRef = useRef(null);

  const handleSliderChange = (e) => {
    const val = Number(e.target.value);
    setThreshold(val);
    setInputValue(String(val));
    setStatus(null);
  };

  const handleInputChange = (e) => {
    const raw = e.target.value;
    setInputValue(raw);
    const num = Number(raw);
    if (!isNaN(num) && num >= 0 && num <= 100) {
      setThreshold(num);
    }
    setStatus(null);
  };

  const handleInputBlur = () => {
    const num = Math.min(100, Math.max(0, Number(inputValue) || 0));
    setThreshold(num);
    setInputValue(String(num));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setStatus(null);
    try {
      await axios.patch(
        `${import.meta.env.VITE_Backend_URL}/api/admin/dashboard/updateThreshold`,
        { threshold },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        }
      );
      setStatus('success');
    } catch {
      setStatus('error');
    } finally {
      setLoading(false);
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) onClose();
  };

  if (!isOpen) return null;

  // colour ramp for the track fill
  const trackColor =
    threshold < 33
      ? '#22c55e'
      : threshold < 66
      ? '#f59e0b'
      : '#ef4444';

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(15,23,42,0.55)',
        backdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 1000,
        animation: 'fadeIn 0.18s ease',
      }}
    >
      <div style={{
        background: '#fff',
        borderRadius: '20px',
        width: '100%',
        maxWidth: '460px',
        margin: '0 16px',
        boxShadow: '0 32px 80px rgba(0,0,0,0.22)',
        animation: 'slideUp 0.22s cubic-bezier(0.34,1.56,0.64,1)',
        overflow: 'hidden',
      }}>
        {/* Modal header */}
        <div style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)',
          padding: '24px 28px 20px',
          display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              background: 'rgba(255,255,255,0.12)',
              borderRadius: '10px', padding: '8px',
            }}>
              <SlidersHorizontal size={20} color="#7dd3fc" />
            </div>
            <div>
              <h2 style={{ margin: 0, color: '#f0f9ff', fontSize: '17px', fontWeight: 700, fontFamily: "'DM Sans', sans-serif" }}>
                Job Visibility Threshold
              </h2>
              <p style={{ margin: '3px 0 0', color: '#93c5fd', fontSize: '12.5px', fontFamily: 'sans-serif' }}>
                Control which jobs are visible to candidates
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255,255,255,0.1)', border: 'none',
              borderRadius: '8px', padding: '6px', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'background 0.15s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
          >
            <X size={16} color="#cbd5e1" />
          </button>
        </div>

        {/* Modal body */}
        <div style={{ padding: '28px' }}>
          {/* Big percentage display */}
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <span style={{
              fontSize: '64px', fontWeight: 800,
              fontFamily: "'DM Sans', sans-serif",
              color: trackColor,
              lineHeight: 1,
              transition: 'color 0.3s ease',
              display: 'block',
            }}>
              {threshold}
              <span style={{ fontSize: '28px', fontWeight: 600, color: '#94a3b8' }}>%</span>
            </span>
            <p style={{
              margin: '6px 0 0', fontSize: '13px', color: '#64748b',
              fontFamily: 'sans-serif',
            }}>
              {threshold === 0
                ? 'All jobs will be visible'
                : threshold === 100
                ? 'No jobs will be visible'
                : `Jobs scoring above ${threshold}% match will be shown`}
            </p>
          </div>

          {/* Slider */}
          <div style={{ marginBottom: '20px' }}>
            <style>{`
              @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;600;700;800&display=swap');

              @keyframes fadeIn { from { opacity:0 } to { opacity:1 } }
              @keyframes slideUp { from { transform:translateY(24px); opacity:0 } to { transform:translateY(0); opacity:1 } }

              .threshold-slider {
                -webkit-appearance: none;
                appearance: none;
                width: 100%;
                height: 8px;
                border-radius: 999px;
                outline: none;
                cursor: pointer;
                transition: height 0.15s;
              }
              .threshold-slider:hover { height: 10px; }
              .threshold-slider::-webkit-slider-thumb {
                -webkit-appearance: none;
                width: 24px; height: 24px;
                border-radius: 50%;
                background: #fff;
                border: 3px solid currentColor;
                box-shadow: 0 2px 8px rgba(0,0,0,0.18);
                cursor: pointer;
                transition: transform 0.15s, box-shadow 0.15s;
              }
              .threshold-slider::-webkit-slider-thumb:hover {
                transform: scale(1.15);
                box-shadow: 0 4px 16px rgba(0,0,0,0.22);
              }
              .threshold-slider::-moz-range-thumb {
                width: 24px; height: 24px;
                border-radius: 50%;
                background: #fff;
                border: 3px solid currentColor;
                box-shadow: 0 2px 8px rgba(0,0,0,0.18);
                cursor: pointer;
              }
            `}</style>
            <input
              type="range"
              min={0} max={100} step={1}
              value={threshold}
              onChange={handleSliderChange}
              className="threshold-slider"
              style={{
                background: `linear-gradient(to right, ${trackColor} ${threshold}%, #e2e8f0 ${threshold}%)`,
                color: trackColor,
              }}
            />
            <div style={{
              display: 'flex', justifyContent: 'space-between',
              marginTop: '6px',
            }}>
              {['0%', '25%', '50%', '75%', '100%'].map(l => (
                <span key={l} style={{ fontSize: '11px', color: '#94a3b8', fontFamily: 'sans-serif' }}>{l}</span>
              ))}
            </div>
          </div>

          {/* Number input */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'block', fontSize: '12.5px', fontWeight: 600,
              color: '#475569', marginBottom: '8px',
              fontFamily: "'DM Sans', sans-serif", letterSpacing: '0.04em', textTransform: 'uppercase',
            }}>
              Or enter exact value
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <input
                type="number"
                min={0} max={100}
                value={inputValue}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
                style={{
                  width: '100px',
                  padding: '10px 14px',
                  fontSize: '16px', fontWeight: 700,
                  fontFamily: "'DM Sans', sans-serif",
                  border: `2px solid ${trackColor}`,
                  borderRadius: '10px',
                  outline: 'none',
                  color: trackColor,
                  textAlign: 'center',
                  transition: 'border-color 0.3s',
                  background: '#fafafa',
                }}
              />
              <span style={{ color: '#64748b', fontSize: '13.5px', fontFamily: 'sans-serif' }}>
                between 0 (show all) and 100 (hide all)
              </span>
            </div>
          </div>

          {/* Status messages */}
          {status === 'success' && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              background: '#f0fdf4', border: '1px solid #bbf7d0',
              borderRadius: '10px', padding: '10px 14px',
              marginBottom: '16px',
            }}>
              <CheckCircle2 size={16} color="#16a34a" />
              <span style={{ color: '#15803d', fontSize: '13.5px', fontFamily: 'sans-serif' }}>
                Threshold updated successfully to {threshold}%
              </span>
            </div>
          )}
          {status === 'error' && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              background: '#fef2f2', border: '1px solid #fecaca',
              borderRadius: '10px', padding: '10px 14px',
              marginBottom: '16px',
            }}>
              <AlertCircle size={16} color="#dc2626" />
              <span style={{ color: '#b91c1c', fontSize: '13.5px', fontFamily: 'sans-serif' }}>
                Failed to update threshold. Please try again.
              </span>
            </div>
          )}

          {/* Actions */}
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={onClose}
              style={{
                flex: 1, padding: '12px',
                border: '1.5px solid #e2e8f0',
                borderRadius: '10px', background: '#fff',
                fontSize: '14px', fontWeight: 600,
                fontFamily: "'DM Sans', sans-serif",
                color: '#475569', cursor: 'pointer',
                transition: 'background 0.15s, border-color 0.15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.borderColor = '#cbd5e1'; }}
              onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.borderColor = '#e2e8f0'; }}
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              style={{
                flex: 2, padding: '12px',
                border: 'none', borderRadius: '10px',
                background: loading ? '#94a3b8' : 'linear-gradient(135deg, #0f172a, #1e40af)',
                fontSize: '14px', fontWeight: 700,
                fontFamily: "'DM Sans', sans-serif",
                color: '#fff', cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'opacity 0.15s, transform 0.1s',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              }}
              onMouseEnter={e => { if (!loading) e.currentTarget.style.opacity = '0.9'; }}
              onMouseLeave={e => { e.currentTarget.style.opacity = '1'; }}
            >
              {loading ? (
                <>
                  <span style={{
                    width: 14, height: 14,
                    border: '2px solid rgba(255,255,255,0.3)',
                    borderTopColor: '#fff',
                    borderRadius: '50%',
                    display: 'inline-block',
                    animation: 'spin 0.7s linear infinite',
                  }} />
                  Updating…
                </>
              ) : (
                <>
                  <SlidersHorizontal size={15} />
                  Apply Threshold
                </>
              )}
            </button>
          </div>
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

/* ─────────────────────────────────────────────
   Main Dashboard
───────────────────────────────────────────── */
const AdminDashboard = () => {
  const adminUser = { name: 'Admin' }; // replace with useAdmin()
  const [dashboardData, setDashboardData] = useState({
    totalUsers: 0, totalCompanies: 0, totalColleges: 0, totalApplications: 0, recentActivity: []
  });
  const [loading, setLoading] = useState(true);
  const [thresholdOpen, setThresholdOpen] = useState(false);

  useEffect(() => { fetchDashboardData(); }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_Backend_URL}/api/admin/dashboard/overview`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}`, 'Content-Type': 'application/json' },
          withCredentials: true,
        }
      );
      if (response.data.success) setDashboardData(response.data.data);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-teal-500" />
      </div>
    );
  }

  const stats = [
    { title: 'Total Users', value: dashboardData.totalUsers || 0, icon: Users, color: 'bg-blue-500', change: '+12%' },
    { title: 'Companies', value: dashboardData.totalCompanies || 0, icon: Building2, color: 'bg-green-500', change: '+8%' },
    { title: 'Colleges', value: dashboardData.totalColleges || 0, icon: GraduationCap, color: 'bg-purple-500', change: '+5%' },
    { title: 'Applications', value: dashboardData.totalJobApplicationSubmission || dashboardData.totalApplications || 0, icon: FileText, color: 'bg-orange-500', change: '+15%' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Shield className="h-8 w-8 text-teal-600 mr-3" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-sm text-gray-500">Welcome back, {adminUser?.name || 'Admin'}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-400 hover:text-gray-600">
                <Settings className="h-5 w-5" />
              </button>
              <button className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className={`p-3 rounded-md ${stat.color}`}>
                      <stat.icon className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">{stat.title}</dt>
                      <dd className="text-2xl font-bold text-gray-900">{stat.value}</dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-5 py-3">
                <div className="text-sm">
                  <span className="text-green-600 font-medium">{stat.change}</span>
                  <span className="text-gray-500"> from last month</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Activity */}
        <div className="bg-white shadow rounded-lg mb-8">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Recent Activity</h3>
            {dashboardData.recentActivity?.length > 0 ? (
              <div className="space-y-3">
                {dashboardData.recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <TrendingUp className="h-5 w-5 text-gray-400 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-gray-900">{activity.description}</p>
                      <p className="text-xs text-gray-500">{activity.timestamp}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">No recent activity to display</p>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">User Management</h3>
            <p className="text-gray-500 mb-4">Manage users, companies, and colleges</p>
            <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700">
              Manage Users
            </button>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Analytics</h3>
            <p className="text-gray-500 mb-4">View detailed analytics and reports</p>
            <button className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700">
              View Analytics
            </button>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Settings</h3>
            <p className="text-gray-500 mb-4">Configure system settings</p>
            <button className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700">
              Open Settings
            </button>
          </div>

          {/* ── Threshold Block ── */}
          <div
            onClick={() => setThresholdOpen(true)}
            style={{
              background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)',
              borderRadius: '12px',
              padding: '24px',
              cursor: 'pointer',
              boxShadow: '0 4px 20px rgba(15,23,42,0.25)',
              transition: 'transform 0.18s, box-shadow 0.18s',
              position: 'relative', overflow: 'hidden',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-3px)';
              e.currentTarget.style.boxShadow = '0 8px 32px rgba(15,23,42,0.35)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 20px rgba(15,23,42,0.25)';
            }}
          >
            {/* decorative circle */}
            <div style={{
              position: 'absolute', top: '-20px', right: '-20px',
              width: '80px', height: '80px',
              borderRadius: '50%',
              background: 'rgba(125,211,252,0.08)',
            }} />
            <div style={{
              display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px',
            }}>
              <div style={{
                background: 'rgba(125,211,252,0.15)',
                borderRadius: '8px', padding: '7px',
                display: 'flex',
              }}>
                <Eye size={18} color="#7dd3fc" />
              </div>
              <h3 style={{
                margin: 0, color: '#f0f9ff',
                fontSize: '15px', fontWeight: 700,
                fontFamily: "'DM Sans', sans-serif",
              }}>
                Job Visibility
              </h3>
            </div>
            <p style={{
              margin: '0 0 16px',
              color: '#93c5fd', fontSize: '13px',
              fontFamily: 'sans-serif', lineHeight: 1.5,
            }}>
              Set the match-score threshold to control which jobs candidates see.
            </p>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              background: 'rgba(125,211,252,0.12)',
              border: '1px solid rgba(125,211,252,0.25)',
              borderRadius: '8px',
              padding: '7px 14px',
              color: '#7dd3fc',
              fontSize: '13px', fontWeight: 600,
              fontFamily: "'DM Sans', sans-serif",
            }}>
              <SlidersHorizontal size={14} />
              Update Threshold
            </div>
          </div>
        </div>
      </main>

      <ThresholdModal isOpen={thresholdOpen} onClose={() => setThresholdOpen(false)} />
    </div>
  );
};

export default AdminDashboard;