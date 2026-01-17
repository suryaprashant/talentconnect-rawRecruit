import React, { useEffect } from "react";

export const DemoModal = ({ isOpen, onClose }) => {
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
          <h2 className="text-xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            RawRecruit Demo
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
                Campus recruitment today involves multiple stakeholders, disconnected tools, and manual coordination. RawRecruit brings everything together—hiring channels, applications, colleges, companies, and students—into one structured platform.
              </p>
              <p className="text-gray-700 text-sm leading-relaxed mt-2 font-medium">
                This demo gives you a guided walkthrough of how RawRecruit simplifies fresher hiring and career-building at scale.
              </p>
            </div>

            {/* What You'll Experience */}
            <section>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                What You'll Experience in the Demo
              </h3>
              <ul className="list-disc list-inside space-y-1 ml-4 text-sm">
                <li>Hiring Channels Overview: On-Campus, Pool-Campus, Off-Campus workflows</li>
                <li>Dashboards for Every Role: Company, college, and student views</li>
                <li>Application & Candidate Management: Centralized tracking and workflows</li>
                <li>Career Development & Services: Training, guidance, and planning support</li>
              </ul>
            </section>

            {/* Who Should Book a Demo? */}
            <section>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Who Should Book a Demo?
              </h3>
              <ul className="list-disc list-inside space-y-1 ml-4 text-sm">
                <li>Colleges & TPOs: Improve placement outcomes and manage drives</li>
                <li>Companies & Employers: Hire fresh talent efficiently and reduce overhead</li>
                <li>Recruitment & Workforce Teams: Streamline fresher hiring operations</li>
              </ul>
            </section>

            {/* What Happens After the Demo? */}
            <section>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                What Happens After the Demo?
              </h3>
              <ul className="list-disc list-inside space-y-1 ml-4 text-sm">
                <li>Personalized walkthrough based on your role</li>
                <li>Answers to your recruitment and placement questions</li>
                <li>Clear next steps for onboarding and setup</li>
                <li>No commitments. No pressure. Just clarity.</li>
              </ul>
            </section>

            {/* Contact CTA */}
            <section className="bg-gradient-to-r from-blue-50 to-white p-4 rounded-xl border border-blue-200">
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Ready to see RawRecruit in action?
              </h3>
              <p className="text-gray-600 text-sm mb-2">
                Book a free demo to experience how we simplify campus recruitment.
              </p>
              {/* <div className="text-sm">
                <span className="text-gray-600">Contact us: </span>
                <a 
                  href="mailto:sales@rawrecruit.com" 
                  className="text-indigo-600 hover:text-indigo-800 font-medium"
                >
                  sales@rawrecruit.com
                </a>
              </div> */}
            </section>
          </div>
        </div>

        {/* Footer - Single Close Button */}
        <div className="p-4 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
          <button
            onClick={onClose}
            className="w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white font-semibold py-2.5 px-6 rounded-full hover:shadow-lg transform hover:scale-105 transition-all duration-300"
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