import React, { useEffect } from "react";

export const AboutModal = ({ isOpen, onClose }) => {
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
            About RawRecruit
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
                RawRecruit is a recruitment and career development platform built to simplify how colleges, companies, and students connect. We focus on making campus recruitment structured, transparent, and outcome-driven—so fresh talent can transition smoothly from education to employment.
              </p>
              <p className="text-gray-700 text-sm leading-relaxed mt-2 font-medium">
                Our goal is simple: reduce friction in fresher hiring while improving career readiness and placement outcomes.
              </p>
            </div>

            {/* Why RawRecruit Exists */}
            <section>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Why RawRecruit Exists
              </h3>
              <p className="text-gray-700 text-sm leading-relaxed mb-3">
                Campus recruitment often involves fragmented processes, manual coordination, and limited visibility for stakeholders. RawRecruit was created to address these challenges by bringing hiring channels, applications, and career services into one unified platform.
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4 text-sm">
                <li>Colleges: Manage placements more efficiently</li>
                <li>Companies: Hire fresh talent with confidence</li>
                <li>Students: Build clarity and readiness for early careers</li>
              </ul>
            </section>

            {/* What We Do */}
            <section>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                What We Do
              </h3>
              <ul className="list-disc list-inside space-y-1 ml-4 text-sm">
                <li>Campus Recruitment Enablement: On-Campus and Pool-Campus hiring coordination</li>
                <li>Fresher Hiring Solutions: Off-Campus hiring opportunities and centralized tracking</li>
                <li>Career Development Support: Career guidance, skill readiness, and mock interviews</li>
              </ul>
            </section>

            {/* Who We Serve */}
            <section>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Who We Serve
              </h3>
              <ul className="list-disc list-inside space-y-1 ml-4 text-sm">
                <li>Colleges & Institutions: TPOs, universities, career development cells</li>
                <li>Companies & Employers: HR teams, early-career hiring programs, staffing teams</li>
                <li>Students & Fresh Graduates: Final-year students, freshers, early professionals</li>
              </ul>
            </section>

            {/* Our Approach */}
            <section>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Our Approach
              </h3>
              <ul className="list-disc list-inside space-y-1 ml-4 text-sm">
                <li>Role-specific workflows for clarity</li>
                <li>Data-driven visibility without complexity</li>
                <li>Scalable systems built for India's hiring ecosystem</li>
                <li>Career-first thinking, not just placements</li>
              </ul>
            </section>

            {/* Our Mission */}
            <section className="bg-gradient-to-r from-blue-50 to-white p-4 rounded-xl border border-blue-200">
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Our Mission
              </h3>
              <p className="text-gray-700 text-sm leading-relaxed">
                To empower colleges, companies, and students with a transparent and efficient platform that improves hiring outcomes and supports long-term career growth.
              </p>
            </section>

            {/* Looking Ahead */}
            <section>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Looking Ahead
              </h3>
              <p className="text-gray-700 text-sm leading-relaxed">
                RawRecruit continues to evolve alongside the changing needs of education and employment. As hiring expectations shift, we remain focused on building tools that support sustainable recruitment and meaningful career development.
              </p>
            </section>

            {/* Contact CTA */}
            <section className="bg-gradient-to-r from-blue-50 to-white p-4 rounded-xl border border-blue-200">
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Learn more about RawRecruit
              </h3>
              <p className="text-gray-600 text-sm mb-2">
                Explore how we're transforming campus recruitment and career development.
              </p>
              {/* <div className="text-sm">
                <span className="text-gray-600">Contact us: </span>
                <a 
                  href="mailto:info@rawrecruit.com" 
                  className="text-indigo-600 hover:text-indigo-800 font-medium"
                >
                  info@rawrecruit.com
                </a>
              </div> */}
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