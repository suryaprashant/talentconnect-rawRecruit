import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export function FeatureModal({ config, onClose }) {
  const navigate = useNavigate();
  useEffect(() => {
    if (!config) return;
    const handler = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [config, onClose]);

  useEffect(() => {
    document.body.style.overflow = config ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [config]);

  if (!config) return null;
  const { title, content, buttons } = config;

  const handleButtonClick = (btn) => {
    sessionStorage.setItem("tempSelectedRole", btn.value);
    localStorage.setItem("selectedRole", btn.value);
    navigate("/signup");
    // TODO: add navigation / next step here when ready

  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(15,23,42,0.55)", backdropFilter: "blur(4px)" }}
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden"
        style={{ animation: "modalIn 0.22s cubic-bezier(0.34,1.56,0.64,1) both" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between p-6 pb-4 border-b border-slate-100">
          <h3 className="text-xl font-bold text-[#0f172a] leading-tight pr-4">{title}</h3>
          <button
            onClick={onClose}
            className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 transition-colors text-slate-500"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="p-6 text-slate-600 text-sm leading-relaxed space-y-3">
          {content || (
            <>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam quis nostrud.</p>
              <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident.</p>
              <p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium totam rem aperiam eaque ipsa.</p>
            </>
          )}
        </div>

        {/* Footer Buttons */}
        {buttons && buttons.length > 0 && (
          <div className="px-6 pb-6 flex gap-3">
            {buttons.map((btn, i) =>
              btn.variant === "fill" ? (
                <button
                  key={i}
                  onClick={() => handleButtonClick(btn)}
                  className="flex-1 py-2.5 px-4 rounded-xl font-semibold text-sm bg-gradient-to-r from-[#7c3aed] to-[#ec4899] text-white hover:opacity-90 transition-opacity duration-150"
                >
                  {btn.label}
                </button>
              ) : (
                <button
                  key={i}
                  onClick={() => handleButtonClick(btn)}
                  className="flex-1 py-2.5 px-4 rounded-xl font-semibold text-sm border-2 border-[#7c3aed] text-[#7c3aed] hover:bg-[#7c3aed] hover:text-white transition-all duration-150"
                >
                  {btn.label}
                </button>
              )
            )}
          </div>
        )}
      </div>

      <style>{`
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.92) translateY(12px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  );
}


export const FEATURE_MODAL_CONFIGS = {

  // ── Features Section ──────────────────────────────────────────────────────

  "On-Campus Recruitment": {
    content: (
      <>
        <p className="font-medium text-slate-700">Structured campus hiring through direct college–company collaboration.</p>
        <p>On-Campus Recruitment enables colleges and companies to coordinate placement drives on a centralized platform. Both institutions and employers can post recruitment requests, schedule drives, and manage hiring activities while students participate through their college placement process.</p>
      </>
    ),
    buttons: [
      { label: "For Companies", variant: "outline", value: "company" },
      { label: "For Colleges",  variant: "fill",    value: "college" },
    ],
  },

  "Pool Campus Recruitment": {
    content: (
      <>
        <p className="font-medium text-slate-700">Organize multi-college hiring drives with a wider talent pool.</p>
        <p>Pool Campus Recruitment allows colleges and companies to collaborate across multiple institutions for shared hiring drives. Recruitment requests can be initiated by either party, enabling companies to reach talent from several colleges through a single coordinated drive.</p>
      </>
    ),
    buttons: [
      { label: "For Companies", variant: "outline", value: "company" },
      { label: "For Colleges",  variant: "fill",    value: "college" },
    ],
  },

  "Off-Campus Recruitment": {
    content: (
      <>
        <p className="font-medium text-slate-700">Reach students directly with open job opportunities.</p>
        <p>Off-Campus Recruitment allows companies to publish job openings directly on the platform, enabling students from different colleges to discover opportunities and apply independently.</p>
      </>
    ),
    buttons: [
      { label: "For Companies", variant: "outline", value: "company" },
      { label: "For Colleges",  variant: "fill",    value: "college" },
    ],
  },

  "Internship Management": {
    content: (
      <>
        <p className="font-medium text-slate-700">Connect students with real-world internship opportunities.</p>
        <p>Companies can post internship opportunities on the platform, allowing students to explore and apply directly while colleges can monitor and support student participation.</p>
      </>
    ),
    buttons: [
      { label: "For Companies", variant: "outline", value: "company" },
      { label: "For Colleges",  variant: "fill",    value: "college" },
    ],
  },

  "Application Tracking System": {
    content: (
      <>
        <p className="font-medium text-slate-700">Track and manage the entire recruitment pipeline.</p>
        <p>The Application Tracking System provides a centralized dashboard to monitor candidate progress, manage recruitment stages, and maintain visibility across the hiring process.</p>
      </>
    ),
    buttons: undefined,
  },

  "Real-time Messaging System": {
    content: (
      <>
        <p className="font-medium text-slate-700">Enable seamless communication across the recruitment ecosystem.</p>
        <p>The Direct Messaging System allows companies, colleges, and students to communicate in real time, ensuring faster coordination, updates, and collaboration throughout the recruitment process.</p>
      </>
    ),
    buttons: undefined,
  },


  // ── How It Works Section ──────────────────────────────────────────────────

  "How It Works - Companies": {
    content: (
      <>
        <p className="font-medium text-slate-700">Structured campus hiring through direct college–company collaboration.</p>
        <p>On-Campus Recruitment enables colleges and companies to coordinate placement drives on a centralized platform. Both institutions and employers can post recruitment requests, schedule drives, and manage hiring activities while students participate through their college placement process.</p>
      </>
    ),
    buttons: [
      { label: "For Companies", variant: "fill", value: "company" },
    ],
  },

  "How It Works - Colleges": {
    content: (
      <>
        <p className="font-medium text-slate-700">Organize multi-college hiring drives with a wider talent pool.</p>
        <p>Pool Campus Recruitment allows colleges and companies to collaborate across multiple institutions for shared hiring drives. Recruitment requests can be initiated by either party, enabling companies to reach talent from several colleges through a single coordinated drive.</p>
      </>
    ),
    buttons: [
      { label: "For Colleges", variant: "fill", value: "college" },
    ],
  },

  "How It Works - Employers": {
    content: (
      <>
        <p className="font-medium text-slate-700">Reach students directly with open job opportunities.</p>
        <p>Off-Campus Recruitment allows companies to publish job openings directly on the platform, enabling students from different colleges to discover opportunities and apply independently.</p>
      </>
    ),
    buttons: [
      { label: "For Employers", variant: "fill", value: "employer" },
    ],
  },

  "How It Works - Candidates": {
    content: (
      <>
        <p className="font-medium text-slate-700">Connect students with real-world internship opportunities.</p>
        <p>Companies can post internship opportunities on the platform, allowing students to explore and apply directly while colleges can monitor and support student participation.</p>
      </>
    ),
    buttons: [
      { label: "Student",      variant: "outline", value: "student"      },
      { label: "Fresher",      variant: "outline", value: "fresher"      },
      { label: "Professional", variant: "fill",    value: "professional" },
    ],
  },
};