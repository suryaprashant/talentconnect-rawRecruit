import React, { useEffect } from "react";
import { Target, Briefcase, FileText, Monitor, GraduationCap, MessageSquare, ArrowRight, CheckCircle } from "lucide-react";

export const FeaturesModal = ({ isOpen, onClose }) => {
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
            RawRecruit Features
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
            {/* Intro Paragraph - Using same blue color as Privacy modal */}
            <div className="bg-gradient-to-r from-blue-50 to-white p-4 rounded-xl border border-blue-200">
              <p className="text-gray-700 text-sm leading-relaxed">
                RawRecruit offers a comprehensive set of features that simplify campus recruitment and fresher hiring for colleges, companies, and students. From managing hiring channels to tracking applications and building career readiness, RawRecruit supports every stage of the recruitment journey.
              </p>
            </div>

            {/* Features List - Using same list styling as Terms/Privacy */}
            <div className="space-y-4">
              {/* Hiring Channels Management */}
              <section>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  Hiring Channels Management
                </h3>
                <ul className="list-disc list-inside space-y-1 ml-4 text-sm">
                  <li>On-Campus hiring for direct college recruitment</li>
                  <li>Pool-Campus hiring across multiple colleges</li>
                  <li>Off-Campus hiring for wider talent reach</li>
                </ul>
              </section>

              {/* Application & Candidate Tracking */}
              <section>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  Application & Candidate Tracking
                </h3>
                <ul className="list-disc list-inside space-y-1 ml-4 text-sm">
                  <li>Centralized application management</li>
                  <li>Shortlisting and acceptance workflows</li>
                  <li>Real-time hiring status visibility</li>
                </ul>
              </section>

              {/* College & Company Dashboards */}
              <section>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  College & Company Dashboards
                </h3>
                <ul className="list-disc list-inside space-y-1 ml-4 text-sm">
                  <li>Dedicated dashboards for colleges and recruiters</li>
                  <li>Role-based access and controls</li>
                  <li>Streamlined coordination between stakeholders</li>
                </ul>
              </section>

              {/* Career Development Tools */}
              <section>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  Career Development Tools
                </h3>
                <ul className="list-disc list-inside space-y-1 ml-4 text-sm">
                  <li>Career guidance and counselling for students</li>
                  <li>Skill readiness and training programs</li>
                  <li>Mock interviews and career planning support</li>
                </ul>
              </section>

              {/* Communication & Collaboration */}
              <section>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  Communication & Collaboration
                </h3>
                <ul className="list-disc list-inside space-y-1 ml-4 text-sm">
                  <li>Direct chat between colleges, companies, and candidates</li>
                  <li>Faster coordination and streamlined decision-making</li>
                  <li>Reduced delays in hiring timeline bottlenecks</li>
                </ul>
              </section>
            </div>

            {/* Soft CTA - Using same styling as Privacy contact section */}
            <section className="bg-gradient-to-r from-blue-50 to-white p-4 rounded-xl border border-blue-200">
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Explore how RawRecruit simplifies campus recruitment
              </h3>
              <p className="text-gray-600 text-sm mb-2">
                Join thousands of colleges and companies transforming their campus hiring experience.
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

        {/* Footer - Using same button styling as Terms/Privacy */}
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