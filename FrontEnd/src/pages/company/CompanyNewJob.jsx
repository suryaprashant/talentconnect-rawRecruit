import { useState } from "react";
import { useNavigate } from "react-router-dom";

const channels = [
  { value: "On-Campus",   label: "On-Campus",   desc: "Hire through college campus drives" },
  { value: "Pool-Campus", label: "Pool-Campus", desc: "Hire from multiple colleges at once" },
  { value: "Off-Campus",  label: "Off-Campus",  desc: "Direct hiring open to all students" },
  { value: "Internship",  label: "Internship",  desc: "Short-term internship positions" },
];

const CompanyNewJob = () => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState("");

  // Mapping the selection to your specific requested routes
  const handleNext = () => {
    if (!selected) return;

    let path = "";
    switch (selected) {
      case "On-Campus": path = "/hiring-channels/on-campus-hiring"; break;
      case "Pool-Campus": path = "/hiring-channels/pool-campus-hiring"; break;
      case "Off-Campus": path = "/hiring-channels/off-campus-hiring"; break;
      case "Internship": path = "/hiring-channels/post-an-internship"; break;
      default: path = "/company/jobs/form";
    }

    navigate(path, { state: { channel: selected } });
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-start justify-center pt-16 px-4">
      <div className="w-full max-w-2xl">

        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <button
            onClick={() => navigate(-1)}
            className="w-9 h-9 rounded-lg border border-gray-300 bg-white flex items-center justify-center hover:bg-gray-50 transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M10 3L5 8L10 13" stroke="#111" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Post a New Job</h2>
          </div>
        </div>

        {/* Heading */}
        <h3 className="text-base font-bold text-gray-900 mb-4">Choose Hiring Channel</h3>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
          {channels.map((c) => (
            <button
              key={c.value}
              onClick={() => setSelected(c.value)}
              className={`p-5 rounded-xl border-2 text-left transition-all bg-white ${
                selected === c.value
                  ? "border-blue-900 bg-blue-50"
                  : "border-gray-200 hover:border-blue-900/40"
              }`}
            >
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none" className="mb-3">
                <rect x="3" y="7" width="16" height="12" rx="1.5" stroke="#1e3a8a" strokeWidth="1.5"/>
                <path d="M7 7V5.5A1.5 1.5 0 0 1 8.5 4h5A1.5 1.5 0 0 1 15 5.5V7" stroke="#1e3a8a" strokeWidth="1.5"/>
                <line x1="11" y1="11" x2="11" y2="15" stroke="#1e3a8a" strokeWidth="1.5" strokeLinecap="round"/>
                <line x1="9" y1="13" x2="13" y2="13" stroke="#1e3a8a" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              <h4 className="font-bold text-gray-900 mb-1">{c.label}</h4>
              <p className="text-xs text-gray-500">{c.desc}</p>
            </button>
          ))}
        </div>

        {/* Next button */}
        <div className="flex justify-end">
          <button
            onClick={handleNext}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white transition-all ${
              selected ? "bg-blue-900 hover:bg-blue-800" : "bg-blue-900/40 cursor-not-allowed"
            }`}
          >
            Next
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M4 2L9 7L4 12" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

      </div>
    </div>
  );
};

export default CompanyNewJob;