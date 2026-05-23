import React, { useState, useEffect, useRef } from 'react';
import { useAdmin } from '../../../context/AdminProvider';
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
  BarChart3,
  Eye,
  X,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
} from 'lucide-react';
import axios from 'axios';

/* ─────────────────────────────────────────────
   Shared styles
───────────────────────────────────────────── */
const GLOBAL_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
  @keyframes fadeIn  { from { opacity:0 } to { opacity:1 } }
  @keyframes slideUp { from { transform:translateY(28px);opacity:0 } to { transform:translateY(0);opacity:1 } }
  @keyframes spin    { to { transform:rotate(360deg) } }

  .rw-slider {
    -webkit-appearance:none; appearance:none;
    width:100%; height:6px; border-radius:999px;
    outline:none; cursor:pointer; transition:height .15s;
  }
  .rw-slider:hover { height:8px; }
  .rw-slider::-webkit-slider-thumb {
    -webkit-appearance:none; width:18px; height:18px;
    border-radius:50%; background:#fff; border:2.5px solid currentColor;
    box-shadow:0 2px 6px rgba(0,0,0,.2); cursor:pointer; transition:transform .15s;
  }
  .rw-slider::-webkit-slider-thumb:hover { transform:scale(1.2); }
  .rw-slider::-moz-range-thumb {
    width:18px; height:18px; border-radius:50%;
    background:#fff; border:2.5px solid currentColor; cursor:pointer;
  }
  .rw-row:hover { background:#f8fafc; }

  .threshold-slider {
    -webkit-appearance:none; appearance:none;
    width:100%; height:8px; border-radius:999px;
    outline:none; cursor:pointer; transition:height .15s;
  }
  .threshold-slider:hover { height:10px; }
  .threshold-slider::-webkit-slider-thumb {
    -webkit-appearance:none; width:24px; height:24px;
    border-radius:50%; background:#fff; border:3px solid currentColor;
    box-shadow:0 2px 8px rgba(0,0,0,.18); cursor:pointer; transition:transform .15s;
  }
  .threshold-slider::-webkit-slider-thumb:hover { transform:scale(1.15); }
  .threshold-slider::-moz-range-thumb {
    width:24px; height:24px; border-radius:50%;
    background:#fff; border:3px solid currentColor; cursor:pointer;
  }
`;

/* ─────────────────────────────────────────────
   Relevancy Weights config
───────────────────────────────────────────── */
const WEIGHT_KEYS = ['skills','jobRoles','experience','noticePeriod','noticePeriodDays','cgpa','batchYear','location','degree','stream','salary'];

const WEIGHT_META = {
  skills:     { label: 'Skills',      color: '#6366f1', group: 'core' },
  jobRoles:   { label: 'Job Roles',   color: '#1e40af', group: 'core' },
  experience: { label: 'Experience',  color: '#0ea5e9', group: 'core' },
  location:   { label: 'Location',    color: '#14b8a6', group: 'core' },
  salary:     { label: 'Salary',      color: '#f59e0b', group: 'core' },
  cgpa:       { label: 'CGPA',        color: '#10b981', group: 'academics' },
  batchYear:  { label: 'Batch Year',  color: '#1e4ed8', group: 'academics' },
  degree:     { label: 'Degree',      color: '#ec4899', group: 'academics' },
  stream:     { label: 'Stream',      color: '#f97316', group: 'academics' },
  noticePeriod:     { label: 'Notice Period',      color: '#0891b2', group: 'availability' },
noticePeriodDays: { label: 'Notice Period Days', color: '#06b6d4', group: 'availability' },
};

const DEFAULTS = {
  skills: 26, jobRoles: 16, experience: 14,
  noticePeriod: 5, noticePeriodDays: 3,
  cgpa: 2, batchYear: 7, location: 8,
  degree: 7, stream: 5, salary: 7,
};

/* ─────────────────────────────────────────────
   RelevancyWeightsModal  (harmonized palette)
───────────────────────────────────────────── */
const RelevancyWeightsModal = ({ isOpen, onClose }) => {
  const [weights, setWeights]   = useState({ ...DEFAULTS });
  const [fetching, setFetching] = useState(false);
  const [saving, setSaving]     = useState(false);
  const [status, setStatus]     = useState(null);
  const [errMsg, setErrMsg]     = useState('');
  const overlayRef              = useRef(null);

  useEffect(() => {
    if (!isOpen) return;
    setStatus(null);
    setFetching(true);
    axios
      .get(`${import.meta.env.VITE_Backend_URL}/api/admin/dashboard/relevancy-weights`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      })
      .then(res => {
        if (res.data?.success && res.data?.data) {
          const d = res.data.data;
          setWeights({
            skills:     d.skills     ?? DEFAULTS.skills,
            jobRoles:   d.jobRoles   ?? DEFAULTS.jobRoles,
            experience: d.experience ?? DEFAULTS.experience,
            cgpa:       d.cgpa       ?? DEFAULTS.cgpa,
            batchYear:  d.batchYear  ?? DEFAULTS.batchYear,
            location:   d.location   ?? DEFAULTS.location,
            degree:     d.degree     ?? DEFAULTS.degree,
            stream:     d.stream     ?? DEFAULTS.stream,
            salary:     d.salary     ?? DEFAULTS.salary,
            noticePeriod:     d.noticePeriod     ?? DEFAULTS.noticePeriod,
noticePeriodDays: d.noticePeriodDays ?? DEFAULTS.noticePeriodDays,
          });
        }
      })
      .catch(() => {})
      .finally(() => setFetching(false));
  }, [isOpen]);

  const total       = WEIGHT_KEYS.reduce((s, k) => s + (Number(weights[k]) || 0), 0);
  const remaining   = 100 - total;
  const isValid     = total === 100;

  const handleSlider  = (key, val) => { setWeights(p => ({ ...p, [key]: Number(val) })); setStatus(null); };
  const handleInput   = (key, val) => { const n = val === '' ? 0 : Math.min(100, Math.max(0, Number(val) || 0)); setWeights(p => ({ ...p, [key]: n })); setStatus(null); };
  const handleReset   = () => { setWeights({ ...DEFAULTS }); setStatus(null); };
  const handleOverlay = (e) => { if (e.target === overlayRef.current) onClose(); };

  const handleSave = async () => {
    if (!isValid) return;
    setSaving(true); setStatus(null);
    try {
      await axios.patch(
        `${import.meta.env.VITE_Backend_URL}/api/admin/dashboard/relevancy-weights`,
        weights,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}`, 'Content-Type': 'application/json' },
          withCredentials: true,
        }
      );
      setStatus('success');
    } catch (err) {
      setErrMsg(err?.response?.data?.error || 'Failed to update. Please try again.');
      setStatus('error');
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  const coreKeys         = WEIGHT_KEYS.filter(k => WEIGHT_META[k].group === 'core');
const availabilityKeys = WEIGHT_KEYS.filter(k => WEIGHT_META[k].group === 'availability');
const academicsKeys    = WEIGHT_KEYS.filter(k => WEIGHT_META[k].group === 'academics');
  const academicsSum  = academicsKeys.reduce((s, k) => s + (Number(weights[k]) || 0), 0);

  /* colour matching the dashboard purple card */
  const headerBg = 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)';

  return (
    <div ref={overlayRef} onClick={handleOverlay} style={{ position:'fixed', inset:0, background:'rgba(107,114,128,0.5)', backdropFilter:'blur(4px)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:1000, animation:'fadeIn .18s ease', padding:'16px' }}>
      <div style={{ background:'#fff', borderRadius:'16px', width:'100%', maxWidth:'580px', maxHeight:'92vh', display:'flex', flexDirection:'column', boxShadow:'0 20px 60px rgba(0,0,0,0.18)', animation:'slideUp .24s cubic-bezier(0.34,1.4,0.64,1)', overflow:'hidden' }}>

        {/* Header — purple to match the Settings card */}
        <div style={{ background: headerBg, padding:'22px 26px 18px', flexShrink:0 }}>
          <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between' }}>
            <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
              <div style={{ background:'rgba(255,255,255,0.2)', borderRadius:'10px', padding:'8px' }}>
                <BarChart3 size={20} color="#fff" />
              </div>
              <div>
                <h2 style={{ margin:0, color:'#fff', fontSize:'17px', fontWeight:700, fontFamily:"'DM Sans', sans-serif" }}>Relevancy Weights</h2>
                <p style={{ margin:'3px 0 0', color:'#ede9fe', fontSize:'12.5px', fontFamily:'sans-serif' }}>Configure how match scores are calculated</p>
              </div>
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
              <div style={{ background:'rgba(255,255,255,0.15)', border:`1.5px solid ${isValid ? 'rgba(167,243,208,0.7)' : 'rgba(252,165,165,0.6)'}`, borderRadius:'999px', padding:'4px 12px', fontSize:'13px', fontWeight:700, fontFamily:"'DM Sans', sans-serif", color: isValid ? '#d1fae5' : '#fee2e2' }}>
                {total}/100
              </div>
              <button onClick={onClose} style={{ background:'rgba(255,255,255,0.15)', border:'none', borderRadius:'8px', padding:'6px', cursor:'pointer', display:'flex' }}>
                <X size={16} color="#fff" />
              </button>
            </div>
          </div>
          {/* progress bar */}
          <div style={{ marginTop:'14px' }}>
            <div style={{ height:'5px', borderRadius:'999px', background:'rgba(255,255,255,0.2)', overflow:'hidden' }}>
              <div style={{ height:'100%', width:`${Math.min(total,100)}%`, background: isValid ? 'rgba(167,243,208,0.9)' : total > 100 ? 'rgba(252,165,165,0.9)' : 'rgba(253,230,138,0.9)', borderRadius:'999px', transition:'width .25s ease, background .3s ease' }} />
            </div>
            <div style={{ display:'flex', justifyContent:'space-between', marginTop:'5px' }}>
              <span style={{ color:'#ede9fe', fontSize:'11px', fontFamily:'sans-serif' }}>
                {isValid ? '✓ Weights sum to 100' : total < 100 ? `${remaining} remaining` : `${total - 100} over limit`}
              </span>
              <span style={{ color:'#c4b5fd', fontSize:'11px', fontFamily:'sans-serif' }}>
                Academics subtotal: <strong style={{ color:'#ede9fe' }}>{academicsSum}</strong>
              </span>
            </div>
          </div>
        </div>

        {/* Body */}
        <div style={{ overflowY:'auto', flex:1, padding:'20px 26px' }}>
          {fetching ? (
            <div style={{ textAlign:'center', padding:'48px 0', color:'#94a3b8', fontFamily:'sans-serif' }}>
              <div style={{ width:28, height:28, border:'3px solid #e2e8f0', borderTopColor:'#7c3aed', borderRadius:'50%', animation:'spin .7s linear infinite', margin:'0 auto 12px' }} />
              Loading current weights…
            </div>
          ) : (
            <>
              <SectionLabel label="Core Factors" />
              {coreKeys.map(key => (
                <WeightRow key={key} label={WEIGHT_META[key].label} color={WEIGHT_META[key].color} value={weights[key]} onChange={v => handleSlider(key, v)} onInputChange={v => handleInput(key, v)} />
              ))}
              <SectionLabel label="Availability" style={{ marginTop: '20px' }} />
{availabilityKeys.map(key => (
  <WeightRow key={key} label={WEIGHT_META[key].label} color={WEIGHT_META[key].color}
    value={weights[key]} onChange={v => handleSlider(key, v)} onInputChange={v => handleInput(key, v)} />
))}
              <SectionLabel label={`Academics  ·  subtotal ${academicsSum}`} style={{ marginTop:'20px' }} />
              {academicsKeys.map(key => (
                <WeightRow key={key} label={WEIGHT_META[key].label} color={WEIGHT_META[key].color} value={weights[key]} onChange={v => handleSlider(key, v)} onInputChange={v => handleInput(key, v)} />
              ))}
            </>
          )}
        </div>

        {/* Footer */}
        <div style={{ padding:'16px 26px 20px', borderTop:'1px solid #f1f5f9', flexShrink:0, background:'#fff' }}>
          {status === 'success' && (
            <div style={{ display:'flex', alignItems:'center', gap:'8px', background:'#f0fdf4', border:'1px solid #bbf7d0', borderRadius:'10px', padding:'10px 14px', marginBottom:'14px' }}>
              <CheckCircle2 size={15} color="#16a34a" />
              <span style={{ color:'#15803d', fontSize:'13px', fontFamily:'sans-serif' }}>Weights updated successfully!</span>
            </div>
          )}
          {status === 'error' && (
            <div style={{ display:'flex', alignItems:'center', gap:'8px', background:'#fef2f2', border:'1px solid #fecaca', borderRadius:'10px', padding:'10px 14px', marginBottom:'14px' }}>
              <AlertCircle size={15} color="#dc2626" />
              <span style={{ color:'#b91c1c', fontSize:'13px', fontFamily:'sans-serif' }}>{errMsg}</span>
            </div>
          )}
          {!isValid && !status && (
            <div style={{ display:'flex', alignItems:'center', gap:'8px', background:'#fffbeb', border:'1px solid #fde68a', borderRadius:'10px', padding:'10px 14px', marginBottom:'14px' }}>
              <AlertCircle size={15} color="#d97706" />
              <span style={{ color:'#92400e', fontSize:'13px', fontFamily:'sans-serif' }}>
                Total must equal 100. Currently: <strong>{total}</strong>{total < 100 ? ` (${remaining} short)` : ` (${total - 100} over)`}
              </span>
            </div>
          )}
          <div style={{ display:'flex', gap:'10px' }}>
            <button onClick={handleReset}
              style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:'6px', padding:'11px 16px', border:'1.5px solid #e2e8f0', borderRadius:'10px', background:'#fff', fontSize:'13.5px', fontWeight:600, fontFamily:"'DM Sans', sans-serif", color:'#64748b', cursor:'pointer' }}
              onMouseEnter={e => { e.currentTarget.style.background='#f8fafc'; }} onMouseLeave={e => { e.currentTarget.style.background='#fff'; }}>
              <RotateCcw size={14} /> Reset
            </button>
            <button onClick={onClose}
              style={{ flex:1, padding:'11px', border:'1.5px solid #e2e8f0', borderRadius:'10px', background:'#fff', fontSize:'13.5px', fontWeight:600, fontFamily:"'DM Sans', sans-serif", color:'#475569', cursor:'pointer' }}
              onMouseEnter={e => { e.currentTarget.style.background='#f8fafc'; }} onMouseLeave={e => { e.currentTarget.style.background='#fff'; }}>
              Cancel
            </button>
            <button onClick={handleSave} disabled={!isValid || saving}
              style={{ flex:2, padding:'11px', border:'none', borderRadius:'10px', background: !isValid || saving ? '#d1d5db' : 'linear-gradient(135deg, #7c3aed, #6d28d9)', fontSize:'13.5px', fontWeight:700, fontFamily:"'DM Sans', sans-serif", color:'#fff', cursor: !isValid || saving ? 'not-allowed' : 'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:'7px', transition:'opacity .15s' }}
              onMouseEnter={e => { if (!saving && isValid) e.currentTarget.style.opacity='0.88'; }} onMouseLeave={e => { e.currentTarget.style.opacity='1'; }}>
              {saving ? (
                <><span style={{ width:13, height:13, border:'2px solid rgba(255,255,255,.3)', borderTopColor:'#fff', borderRadius:'50%', display:'inline-block', animation:'spin .7s linear infinite' }} />Saving…</>
              ) : (
                <><BarChart3 size={14} />Save Weights</>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const SectionLabel = ({ label, style = {} }) => (
  <div style={{ fontSize:'11px', fontWeight:700, letterSpacing:'0.08em', textTransform:'uppercase', color:'#94a3b8', fontFamily:"'DM Sans', sans-serif", marginBottom:'10px', ...style }}>{label}</div>
);

const WeightRow = ({ label, color, value, onChange, onInputChange }) => (
  <div className="rw-row" style={{ display:'grid', gridTemplateColumns:'120px 1fr 54px', alignItems:'center', gap:'14px', padding:'9px 10px', borderRadius:'10px', marginBottom:'4px', transition:'background .15s' }}>
    <span style={{ fontSize:'13.5px', fontWeight:600, color:'#334155', fontFamily:"'DM Sans', sans-serif", whiteSpace:'nowrap' }}>{label}</span>
    <input type="range" min={0} max={100} step={1} value={value} onChange={e => onChange(e.target.value)} className="rw-slider" style={{ background:`linear-gradient(to right, ${color} ${value}%, #e2e8f0 ${value}%)`, color }} />
    <input type="number" min={0} max={100} value={value} onChange={e => onInputChange(e.target.value)}
      style={{ width:'100%', padding:'5px 6px', border:`1.5px solid ${color}44`, borderRadius:'7px', fontSize:'13px', fontWeight:700, fontFamily:"'DM Sans', sans-serif", color, textAlign:'center', background:`${color}08`, outline:'none' }}
      onFocus={e => { e.currentTarget.style.borderColor=color; }} onBlur={e => { e.currentTarget.style.borderColor=`${color}44`; }} />
  </div>
);

/* ─────────────────────────────────────────────
   ThresholdModal  (harmonized palette)
───────────────────────────────────────────── */
const ThresholdModal = ({ isOpen, onClose }) => {
  const [threshold, setThreshold] = useState(50);
  const [inputValue, setInputValue] = useState('50');
  const [status, setStatus]   = useState(null);
  const [loading, setLoading] = useState(false);
  const overlayRef            = useRef(null);

  const handleSliderChange = (e) => { const v = Number(e.target.value); setThreshold(v); setInputValue(String(v)); setStatus(null); };
  const handleInputChange  = (e) => { const r = e.target.value; setInputValue(r); const n = Number(r); if (!isNaN(n) && n >= 0 && n <= 100) setThreshold(n); setStatus(null); };
  const handleInputBlur    = () => { const n = Math.min(100, Math.max(0, Number(inputValue) || 0)); setThreshold(n); setInputValue(String(n)); };
  const handleOverlay      = (e) => { if (e.target === overlayRef.current) onClose(); };

  const handleSubmit = async () => {
    setLoading(true); setStatus(null);
    try {
      await axios.patch(
        `${import.meta.env.VITE_Backend_URL}/api/admin/dashboard/updateThreshold`,
        { threshold },
        { headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}`, 'Content-Type': 'application/json' }, withCredentials: true }
      );
      setStatus('success');
    } catch { setStatus('error'); }
    finally { setLoading(false); }
  };

  if (!isOpen) return null;

  /* Keep semantic track colour for the slider value indicator */
  const trackColor = threshold < 33 ? '#22c55e' : threshold < 66 ? '#f59e0b' : '#ef4444';
  /* Header matches the orange Applications card */
  const headerBg = 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)';

  return (
    <div ref={overlayRef} onClick={handleOverlay} style={{ position:'fixed', inset:0, background:'rgba(107,114,128,0.5)', backdropFilter:'blur(4px)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:1000, animation:'fadeIn .18s ease' }}>
      <div style={{ background:'#fff', borderRadius:'16px', width:'100%', maxWidth:'460px', margin:'0 16px', boxShadow:'0 20px 60px rgba(0,0,0,0.18)', animation:'slideUp .22s cubic-bezier(0.34,1.56,0.64,1)', overflow:'hidden' }}>

        {/* Header — orange to match Applications stat card */}
        <div style={{ background: headerBg, padding:'24px 28px 20px', display:'flex', alignItems:'flex-start', justifyContent:'space-between' }}>
          <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
            <div style={{ background:'rgba(255,255,255,0.2)', borderRadius:'10px', padding:'8px' }}>
              <SlidersHorizontal size={20} color="#fff" />
            </div>
            <div>
              <h2 style={{ margin:0, color:'#fff', fontSize:'17px', fontWeight:700, fontFamily:"'DM Sans', sans-serif" }}>Job Visibility Threshold</h2>
              <p style={{ margin:'3px 0 0', color:'#ffedd5', fontSize:'12.5px', fontFamily:'sans-serif' }}>Control which jobs are visible to candidates</p>
            </div>
          </div>
          <button onClick={onClose} style={{ background:'rgba(255,255,255,0.2)', border:'none', borderRadius:'8px', padding:'6px', cursor:'pointer', display:'flex' }}>
            <X size={16} color="#fff" />
          </button>
        </div>

        <div style={{ padding:'28px' }}>
          <div style={{ textAlign:'center', marginBottom:'28px' }}>
            <span style={{ fontSize:'64px', fontWeight:800, fontFamily:"'DM Sans', sans-serif", color:trackColor, lineHeight:1, transition:'color .3s ease', display:'block' }}>
              {threshold}<span style={{ fontSize:'28px', fontWeight:600, color:'#94a3b8' }}>%</span>
            </span>
            <p style={{ margin:'6px 0 0', fontSize:'13px', color:'#64748b', fontFamily:'sans-serif' }}>
              {threshold === 0 ? 'All jobs will be visible' : threshold === 100 ? 'No jobs will be visible' : `Jobs scoring above ${threshold}% match will be shown`}
            </p>
          </div>
          <div style={{ marginBottom:'20px' }}>
            <input type="range" min={0} max={100} step={1} value={threshold} onChange={handleSliderChange} className="threshold-slider"
              style={{ background:`linear-gradient(to right, ${trackColor} ${threshold}%, #e2e8f0 ${threshold}%)`, color:trackColor }} />
            <div style={{ display:'flex', justifyContent:'space-between', marginTop:'6px' }}>
              {['0%','25%','50%','75%','100%'].map(l => <span key={l} style={{ fontSize:'11px', color:'#94a3b8', fontFamily:'sans-serif' }}>{l}</span>)}
            </div>
          </div>
          <div style={{ marginBottom:'24px' }}>
            <label style={{ display:'block', fontSize:'12.5px', fontWeight:600, color:'#475569', marginBottom:'8px', fontFamily:"'DM Sans', sans-serif", letterSpacing:'0.04em', textTransform:'uppercase' }}>Or enter exact value</label>
            <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
              <input type="number" min={0} max={100} value={inputValue} onChange={handleInputChange} onBlur={handleInputBlur}
                style={{ width:'100px', padding:'10px 14px', fontSize:'16px', fontWeight:700, fontFamily:"'DM Sans', sans-serif", border:`2px solid ${trackColor}`, borderRadius:'10px', outline:'none', color:trackColor, textAlign:'center', background:'#fafafa' }} />
              <span style={{ color:'#64748b', fontSize:'13.5px', fontFamily:'sans-serif' }}>between 0 (show all) and 100 (hide all)</span>
            </div>
          </div>
          {status === 'success' && (
            <div style={{ display:'flex', alignItems:'center', gap:'8px', background:'#f0fdf4', border:'1px solid #bbf7d0', borderRadius:'10px', padding:'10px 14px', marginBottom:'16px' }}>
              <CheckCircle2 size={16} color="#16a34a" />
              <span style={{ color:'#15803d', fontSize:'13.5px', fontFamily:'sans-serif' }}>Threshold updated successfully to {threshold}%</span>
            </div>
          )}
          {status === 'error' && (
            <div style={{ display:'flex', alignItems:'center', gap:'8px', background:'#fef2f2', border:'1px solid #fecaca', borderRadius:'10px', padding:'10px 14px', marginBottom:'16px' }}>
              <AlertCircle size={16} color="#dc2626" />
              <span style={{ color:'#b91c1c', fontSize:'13.5px', fontFamily:'sans-serif' }}>Failed to update threshold. Please try again.</span>
            </div>
          )}
          <div style={{ display:'flex', gap:'10px' }}>
            <button onClick={onClose}
              style={{ flex:1, padding:'12px', border:'1.5px solid #e2e8f0', borderRadius:'10px', background:'#fff', fontSize:'14px', fontWeight:600, fontFamily:"'DM Sans', sans-serif", color:'#475569', cursor:'pointer' }}
              onMouseEnter={e => { e.currentTarget.style.background='#f8fafc'; }} onMouseLeave={e => { e.currentTarget.style.background='#fff'; }}>
              Cancel
            </button>
            <button onClick={handleSubmit} disabled={loading}
              style={{ flex:2, padding:'12px', border:'none', borderRadius:'10px', background: loading ? '#d1d5db' : 'linear-gradient(135deg, #f97316, #ea580c)', fontSize:'14px', fontWeight:700, fontFamily:"'DM Sans', sans-serif", color:'#fff', cursor: loading ? 'not-allowed' : 'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:'8px' }}>
              {loading ? (
                <><span style={{ width:14, height:14, border:'2px solid rgba(255,255,255,.3)', borderTopColor:'#fff', borderRadius:'50%', display:'inline-block', animation:'spin .7s linear infinite' }} />Updating…</>
              ) : (
                <><SlidersHorizontal size={15} />Apply Threshold</>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   Main Dashboard
───────────────────────────────────────────── */
const AdminDashboard = () => {
  const { adminUser, logout } = useAdmin();
  const [dashboardData, setDashboardData] = useState({
    totalUsers: 0,
    totalCompanies: 0,
    totalColleges: 0,
    totalApplications: 0,
    recentActivity: []
  });
  const [loading, setLoading]             = useState(true);
  const [thresholdOpen, setThresholdOpen] = useState(false);
  const [weightsOpen, setWeightsOpen]     = useState(false);

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

  const handleLogout = async () => { await logout(); };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  const stats = [
    { title: 'Total Users',   value: dashboardData.totalUsers || 0,       icon: Users,         color: 'bg-[#1e4ed8]',   change: '+12%' },
    { title: 'Companies',     value: dashboardData.totalCompanies || 0,   icon: Building2,     color: 'bg-green-500',  change: '+8%'  },
    { title: 'Colleges',      value: dashboardData.totalColleges || 0,    icon: GraduationCap, color: 'bg-purple-500', change: '+5%'  },
    { title: 'Applications',  value: dashboardData.totalJobApplicationSubmission || dashboardData.totalApplications || 0, icon: FileText, color: 'bg-orange-500', change: '+15%' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <style>{GLOBAL_STYLES}</style>

      {/* Header — original, unchanged */}
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
              <button
                onClick={handleLogout}
                className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">

        {/* Stats Grid — original, unchanged */}
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

        {/* Recent Activity — original, unchanged */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Recent Activity</h3>
            {dashboardData.recentActivity && dashboardData.recentActivity.length > 0 ? (
              <div className="space-y-3">
                {dashboardData.recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      <TrendingUp className="h-5 w-5 text-gray-400" />
                    </div>
                    <div className="flex-1 min-w-0">
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

        {/* Quick Actions — original 3 cards + 1 updated threshold card */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* original 3 — unchanged */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">User Management</h3>
            <p className="text-gray-500 mb-4">Manage users, companies, and colleges</p>
            <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-[#143694]">Manage Users</button>
          </div>
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Analytics</h3>
            <p className="text-gray-500 mb-4">View detailed analytics and reports</p>
            <button className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700">View Analytics</button>
          </div>
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Settings</h3>
            <p className="text-gray-500 mb-4 my-5">Configure system settings</p>
            <button className="w-full bg-[#143694] text-white py-2 px-4 my-4 rounded-md hover:bg-purple-700">Open Settings</button>
          </div>

          {/* Threshold card — now matches orange Applications stat card */}
          <div
            onClick={() => setThresholdOpen(true)}
            className="bg-white shadow rounded-lg p-6 cursor-pointer border-2 border-transparent hover:border-orange-200 hover:shadow-md transition-all duration-200"
            style={{ position:'relative', overflow:'hidden' }}
            onMouseEnter={e => { e.currentTarget.style.transform='translateY(-2px)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)'; }}
          >
            {/* coloured top accent bar */}
            <div style={{ position:'absolute', top:0, left:0, right:0, height:'4px', background:'linear-gradient(90deg, #f97316, #ea580c)' }} />
            <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'10px' }}>
              <div className="p-3 rounded-md bg-orange-500" style={{ display:'flex', flexShrink:0 }}>
                <Eye size={18} color="#fff" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">Job Visibility</h3>
            </div>
            <p className="text-gray-500 mb-4" style={{ fontSize:'14px' }}>
              Set the match-score threshold to control which jobs candidates see.
            </p>
            <button className="w-full bg-orange-500 text-white py-2 px-4 rounded-md hover:bg-orange-600 font-medium text-sm" style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:'6px' }}>
              <SlidersHorizontal size={14} />
              Update Threshold
            </button>
          </div>
        </div>

        {/* Relevancy Weights banner — now matches purple Settings card */}
        <div
          onClick={() => setWeightsOpen(true)}
          className="mt-6 bg-white shadow rounded-lg cursor-pointer border-2 border-transparent hover:border-purple-200 hover:shadow-md transition-all duration-200"
          style={{ position:'relative', overflow:'hidden' }}
          onMouseEnter={e => { e.currentTarget.style.transform='translateY(-2px)'; }}
          onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)'; }}
        >
          {/* coloured left accent bar */}
          <div style={{ position:'absolute', top:0, left:0, bottom:0, width:'4px', background:'linear-gradient(180deg, #7c3aed, #6d28d9)' }} />
          <div style={{ padding:'24px 28px', display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:'20px' }}>
            <div style={{ display:'flex', alignItems:'center', gap:'16px' }}>
              <div className="p-3 rounded-md bg-purple-500" style={{ display:'flex', flexShrink:0 }}>
                <BarChart3 size={22} color="#fff" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900" style={{ marginBottom:'4px' }}>Relevancy Weights</h3>
                <p className="text-gray-500" style={{ fontSize:'13.5px', maxWidth:'420px', lineHeight:1.5 }}>
                  Fine-tune how each factor — skills, experience, academics, location and more — contributes to candidate match scores.
                </p>
              </div>
            </div>
            <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end', gap:'12px' }}>
              <div style={{ display:'flex', gap:'6px', flexWrap:'wrap', justifyContent:'flex-end' }}>
                {[['Skills','bg-indigo-100 text-indigo-700'],['Experience','bg-sky-100 text-sky-700'],['Academics','bg-green-100 text-green-700'],['Location','bg-teal-100 text-teal-700'],['Salary','bg-amber-100 text-amber-700']].map(([f, cls]) => (
                  <span key={f} className={`${cls} text-xs font-semibold px-3 py-1 rounded-full`}>{f}</span>
                ))}
              </div>
              <button className="bg-[#143694] text-white py-2 px-5 rounded-md hover:bg-purple-700 font-medium text-sm" style={{ display:'flex', alignItems:'center', gap:'7px' }}>
                <BarChart3 size={14} />
                Configure Weights
              </button>
            </div>
          </div>
        </div>

      </main>

      <ThresholdModal        isOpen={thresholdOpen} onClose={() => setThresholdOpen(false)} />
      <RelevancyWeightsModal isOpen={weightsOpen}   onClose={() => setWeightsOpen(false)} />
    </div>
  );
};

export default AdminDashboard;