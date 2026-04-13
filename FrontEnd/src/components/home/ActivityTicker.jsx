import { useEffect, useState } from "react";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_Backend_URL;

export default function LiveTicker() {
  const [tickerItems, setTickerItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTicker = async () => {
       try {
        const res = await axios.get(`${API_BASE_URL}/api/ticker`);

        if (res.data?.success) {
          setTickerItems(res.data.data);
        }
      } catch (error) {
        console.error("Ticker fetch error:", error);

        // 🔥 fallback (important UX)
        setTickerItems([
          "⚡ Rohit applied for Marketing Intern — 2 mins ago",
          "🏢 TechNova posted Software Developer role — 5 mins ago",
          "📊 12 new applications in the last hour",
          "🎓 Priya got shortlisted at StartupX — 8 mins ago",
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchTicker();

    // 🔥 optional: auto refresh every 30 sec
    const interval = setInterval(fetchTicker, 30000);

    return () => clearInterval(interval);
  }, []);

  if (loading) return null; // or loader

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