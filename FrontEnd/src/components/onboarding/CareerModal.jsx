import React, { useEffect } from "react";

export const CareersModal = ({ isOpen, onClose }) => {
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
            Careers at RawRecruit
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
                At RawRecruit, we're building technology that improves how students start their careers and how organizations discover fresh talent. Our work sits at the intersection of education, recruitment, and career development.
              </p>
              <p className="text-gray-700 text-sm leading-relaxed mt-2 font-medium">
                We're looking for people who value clarity, ownership, and long-term impact over hype.
              </p>
            </div>

            {/* Why Work at RawRecruit */}
            <section>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Why Work at RawRecruit
              </h3>
              <ul className="list-disc list-inside space-y-1 ml-4 text-sm">
                <li>Meaningful Impact: Help students transition from campus to corporate roles</li>
                <li>Ownership & Responsibility: Work on real problems with clear accountability</li>
                <li>Growth-Focused Culture: Learn by building and improving continuously</li>
              </ul>
            </section>

            {/* Who We're Looking For */}
            <section>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Who We're Looking For
              </h3>
              <ul className="list-disc list-inside space-y-1 ml-4 text-sm">
                <li>Think clearly and communicate simply</li>
                <li>Care about users and long-term quality</li>
                <li>Take responsibility for their work</li>
                <li>Prefer progress over perfection</li>
                <li>Value collaboration over ego</li>
                <li>Are curious and continuously learning</li>
              </ul>
            </section>

            {/* Teams You Can Join */}
            <section>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Teams You Can Join
              </h3>
              <ul className="list-disc list-inside space-y-1 ml-4 text-sm">
                <li>Product & Engineering: Build scalable systems and features</li>
                <li>Design & UX: Create intuitive, user-focused experiences</li>
                <li>Marketing & Growth: Tell clear product stories</li>
                <li>Sales & Partnerships: Work with colleges and companies</li>
                <li>Operations & Partnerships: Manage coordination and processes</li>
                <li>Customer Success & Support: Help users succeed</li>
              </ul>
            </section>

            {/* How We Work */}
            <section>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                How We Work
              </h3>
              <ul className="list-disc list-inside space-y-1 ml-4 text-sm">
                <li>Transparent communication</li>
                <li>Structured yet flexible workflows</li>
                <li>Feedback-driven improvement</li>
                <li>Respect for focus and balance</li>
              </ul>
            </section>

            {/* Early Career Opportunities */}
            <section>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Early Career Opportunities
              </h3>
              <p className="text-gray-700 text-sm leading-relaxed">
                We support early-career professionals who want to learn by doing. If you're passionate about building practical skills and contributing meaningfully, RawRecruit offers an environment where learning and responsibility go hand in hand.
              </p>
            </section>

            {/* Join the Journey */}
            <section className="bg-gradient-to-r from-blue-50 to-white p-4 rounded-xl border border-blue-200">
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Join the Journey
              </h3>
              <p className="text-gray-600 text-sm mb-2">
                If you're interested in building products that support real career journeys, we'd love to hear from you.
              </p>
              {/* <div className="text-sm">
                <span className="text-gray-600">Contact us: </span>
                <a 
                  href="mailto:careers@rawrecruit.com" 
                  className="text-indigo-600 hover:text-indigo-800 font-medium"
                >
                  careers@rawrecruit.com
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