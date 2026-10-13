import React, { useEffect, useState } from "react";

export const HelpCenterModal = ({ isOpen, onClose }) => {
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[65vh] flex flex-col animate-slideUp">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-xl font-bold bg-gradient-to-r from-indigo-600 via-[#143694] to-pink-600 bg-clip-text text-transparent">
            Help Center
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1 hover:bg-gray-100 rounded-full"
            aria-label="Close"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 scrollbar-hide">
          <div className="space-y-4">
            {/* Intro Section */}
            <div className="bg-gradient-to-r from-blue-50 to-white p-4 rounded-xl border border-blue-200">
              <p className="text-gray-700 text-sm leading-relaxed">
                The RawRecruit Help Center is designed to help you navigate the platform with ease. Whether you are a student, a college placement team, or a hiring organization, you'll find clear guidance, answers, and support resources here.
              </p>
              <p className="text-gray-700 text-sm leading-relaxed mt-2 font-medium">
                If you can't find what you're looking for, our support team is always ready to help.
              </p>
            </div>

            {/* Search Bar */}
            {/* <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for help articles, guides, or answers..."
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-sm"
              />
            </div> */}

            {/* Browse by Role */}
            <section>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Browse Help by Role
              </h3>
              <ul className="list-disc list-inside space-y-1 ml-4 text-sm">
                <li>For Students & Freshers: Job applications, career counselling, profile setup</li>
                <li>For Colleges & TPOs: Managing drives, coordinating with companies, placement tracking</li>
                <li>For Companies & Employers: Posting jobs, tracking applications, communication</li>
              </ul>
            </section>

            {/* Popular Help Topics */}
            <section>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Popular Help Topics
              </h3>
              <ul className="list-disc list-inside space-y-1 ml-4 text-sm">
                <li>Getting Started: Account creation, dashboards, and navigation</li>
                <li>Hiring & Placements: Campus recruitment, application workflows, candidate tracking</li>
                <li>Career & Training Services: Career counselling, training programs, mock interviews</li>
              </ul>
            </section>

            {/* Need More Help? */}
            <section className="bg-gradient-to-r from-blue-50 to-white p-4 rounded-xl border border-blue-200">
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Need More Help?
              </h3>
              <p className="text-gray-600 text-sm mb-2">
                If you need personalized assistance, reach out to us directly.
              </p>
              <div className="text-sm">
                <span className="text-gray-600">Email: </span>
                <a 
                  href="mailto:support@rawrecruit.com" 
                  className="text-indigo-600 hover:text-indigo-800 font-medium"
                >
                  support@rawrecruit.com
                </a>
              </div>
            </section>

            {/* Helpful Resources */}
            <section>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Helpful Resources
              </h3>
              <ul className="list-disc list-inside space-y-1 ml-4 text-sm">
                <li>Platform Guides: Step-by-step walkthroughs for all features</li>
                <li>Onboarding Help: First-time user tips and getting started guides</li>
                <li>Policy Information: Account policies, terms, and important information</li>
              </ul>
            </section>
          </div>
        </div>

        {/* Footer - Single Close Button */}
        <div className="p-4 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
          <button
            onClick={onClose}
            className="w-full bg-gradient-to-r from-indigo-600 via-[#143694] to-pink-600 text-white font-semibold py-2.5 px-6 rounded-full hover:shadow-lg transform hover:scale-105 transition-all duration-300"
          >
            Close
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};