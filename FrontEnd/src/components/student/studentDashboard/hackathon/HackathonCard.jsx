import { useState } from "react";
import { Link } from "react-router-dom";
import { MapPinIcon, HeartIcon } from "@heroicons/react/24/outline";

const pastelColors = [
  "bg-pink-100",
  "bg-blue-100",
  "bg-green-100",
  "bg-yellow-100",
  "bg-purple-100",
  "bg-indigo-100",
  "bg-teal-100",
  "bg-rose-100",
  "bg-cyan-100",
  "bg-lime-100",
];

function getStableColor(id = "") {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash + id.charCodeAt(i) * 31) % pastelColors.length;
  }
  return pastelColors[hash];
}

const HackathonCard = ({ hackathon }) => {
  const [isSaved, setIsSaved] = useState(hackathon.isSaved || false);

  const title = hackathon.title || hackathon.jobTitle || "Hackathon";
  const logo = hackathon.bannerImage || "https://cdn-icons-png.flaticon.com/512/25/25231.png";
  const stableColor = getStableColor(hackathon._id || title);

  return (
    <div className="w-full max-w-[350px] min-h-[430px] mx-auto rounded-2xl 
      border shadow-sm hover:shadow-lg transition overflow-hidden
      flex flex-col">

      {/* TOP SECTION */}
      <div className={`${stableColor} p-4 pb-6 rounded-b-2xl flex-grow`}>

        {/* Date + Save */}
        <div className="flex justify-between items-start">
          <span className="text-xs bg-white px-3 py-1 rounded-full font-medium">
            {new Date(hackathon.startDate || hackathon.createdAt).toLocaleDateString('en-IN')}
          </span>

          <button
            onClick={(e) => {
              e.preventDefault();
              setIsSaved(!isSaved);
            }}
            className="bg-white p-2 rounded-full shadow"
          >
            <HeartIcon
              className={`h-5 w-5 ${isSaved ? "text-red-500" : "text-gray-600"}`}
            />
          </button>
        </div>

        {/* Logo + Title */}
        <div className="mt-3 flex justify-between items-start">
          <div>
            <h3 className="text-black font-semibold text-lg mt-1">{title}</h3>
            <p className="text-gray-900 font-extrabold text-2xl leading-snug">
              {hackathon.organizer || "Organizer"}
            </p>
          </div>

          <div className="w-14 h-14 bg-white rounded-full shadow flex items-center justify-center overflow-hidden border">
            <img src={logo} alt="logo" className="w-12 h-12 object-cover" />
          </div>
        </div>

        {/* Urgent / Featured Pill */}
        {hackathon.urgent && (
          <div className="mt-3">
            <span className="px-3 py-1 bg-red-100 text-red-700 border border-red-300 rounded-full text-xs font-semibold">
              Urgent / Featured
            </span>
          </div>
        )}

        {/* Technologies */}
        {hackathon.technologies?.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {hackathon.technologies.map((tech) => (
              <span
                key={tech}
                className="px-3 py-1 border border-gray-300 text-gray-700 rounded-full text-xs"
                style={{ backgroundColor: "transparent" }}
              >
                {tech}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* BOTTOM SECTION */}
      <div className="p-4 bg-white flex justify-between items-center border-t">
        <div>
          <div className="flex items-center gap-1 text-gray-700 text-xs">
            <MapPinIcon className="h-4 w-4 text-gray-500" />
            <span>{hackathon.location || "Online"}</span>
          </div>
          <div className="text-gray-900 font-semibold text-sm mt-1">
            {hackathon.mode || "Virtual"}
          </div>
        </div>

        <Link
          to={`/${localStorage.getItem("selectedRole")}-dashboard/hackathon/${hackathon._id}`}
          className="px-4 py-2 bg-black text-white rounded-xl text-sm font-medium hover:bg-gray-800 transition"
        >
          Apply Now
        </Link>
      </div>
    </div>
  );
};

export default HackathonCard;
