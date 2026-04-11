const tickerItems = [
  "⚡ Rohit applied for Marketing Intern — 2 mins ago",
  "🏢 TechNova posted Software Developer role — 5 mins ago",
  "📊 12 new applications in the last hour",
  "🎓 Priya got shortlisted at StartupX — 8 mins ago",
];

export default function LiveTicker() {
  return (
    <div className="w-full bg-[#143694] text-white py-3 overflow-hidden">
      <div
        className="whitespace-nowrap flex gap-10 px-4 text-sm font-medium"
        style={{
          animation: "marquee 20s linear infinite",
        }}
      >
        {[...tickerItems, ...tickerItems].map((item, i) => (
          <span key={i}>{item}</span>
        ))}
      </div>

      {/* KEYFRAMES */}
      <style>
        {`
          @keyframes marquee {
            0% { transform: translateX(0%); }
            100% { transform: translateX(-50%); }
          }
        `}
      </style>
    </div>
  );
}