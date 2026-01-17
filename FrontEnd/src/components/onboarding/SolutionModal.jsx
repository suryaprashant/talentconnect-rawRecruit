import React, { useEffect } from "react";

export const SolutionsModal = ({ isOpen, onClose }) => {
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
            RawRecruit Solutions
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
            {/* Intro Paragraph - Using same blue color */}
            <div className="bg-gradient-to-r from-blue-50 to-white p-4 rounded-xl border border-blue-200">
              <p className="text-gray-700 text-sm leading-relaxed">
                RawRecruit delivers tailored recruitment solutions that address the unique needs of colleges, employers, and fresh graduates. Our platform helps institutions improve placements, companies hire job-ready talent, and students build successful careers.
              </p>
            </div>

            {/* Solutions List - Using same list styling */}
            <div className="space-y-4">
              {/* Solutions for Colleges */}
              <section>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  Solutions for Colleges
                </h3>
                <ul className="list-disc list-inside space-y-1 ml-4 text-sm">
                  <li>On-Campus and Pool-Campus placement support</li>
                  <li>Student training and skill development programs</li>
                  <li>Placement analytics and insights</li>
                  <li>Campus branding and employer engagement</li>
                </ul>
              </section>

              {/* Solutions for Companies & Employers */}
              <section>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  Solutions for Companies & Employers
                </h3>
                <ul className="list-disc list-inside space-y-1 ml-4 text-sm">
                  <li>Fresher hiring through campus and off-campus channels</li>
                  <li>Workforce and staffing solutions</li>
                  <li>Application management and candidate evaluation</li>
                  <li>Employer branding and outreach</li>
                </ul>
              </section>

              {/* Solutions for Students & Freshers */}
              <section>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  Solutions for Students & Freshers
                </h3>
                <ul className="list-disc list-inside space-y-1 ml-4 text-sm">
                  <li>Access to fresher jobs and internships</li>
                  <li>Career counselling and guidance</li>
                  <li>Resume building and interview preparation</li>
                  <li>Career planning and skill enhancement</li>
                </ul>
              </section>

              {/* End-to-End Recruitment Enablement */}
              <section>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  End-to-End Recruitment Enablement
                </h3>
                <ul className="list-disc list-inside space-y-1 ml-4 text-sm">
                  <li>Transparent workflows for all stakeholders</li>
                  <li>Scalable solutions for institutions of all sizes</li>
                  <li>India-first approach for unique campus recruitment needs</li>
                </ul>
              </section>
            </div>

            {/* Contact CTA - Using same styling as Privacy contact section */}
            <section className="bg-gradient-to-r from-blue-50 to-white p-4 rounded-xl border border-blue-200">
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Get started with RawRecruit solutions today
              </h3>
              <p className="text-gray-600 text-sm mb-2">
                Join colleges, companies, and students already transforming their campus recruitment journey.
              </p>
              {/* <div className="text-sm">
                <span className="text-gray-600">Contact us: </span>
                <a 
                  href="mailto:solutions@rawrecruit.com" 
                  className="text-indigo-600 hover:text-indigo-800 font-medium"
                >
                  solutions@rawrecruit.com
                </a>
              </div> */}
            </section>
          </div>
        </div>

        {/* Footer - Using same button styling */}
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