import React, { useEffect } from "react";

export const PrivacyModal = ({ isOpen, onClose }) => {
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
          <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 via-[#143694] to-pink-600 bg-clip-text text-transparent">
            Privacy Policy
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
          <div className="space-y-4 text-gray-700">
            {/* 1. Introduction */}
            <section>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Introduction
              </h3>
              <p className="leading-relaxed text-sm">
                RawRecruit ("we", "our", "us") is committed to protecting the privacy of users who access our platform, including students, colleges, companies, employers, and visitors. This Privacy Policy explains how we collect, use, store, and protect your personal information when you use RawRecruit.
              </p>
              <p className="leading-relaxed text-sm mt-2">
                By using our website or services, you agree to the practices described in this policy.
              </p>
            </section>

            {/* 2. Information We Collect */}
            <section>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Information We Collect
              </h3>
              
              <h4 className="font-bold text-gray-800 mb-2 text-sm">
                1. Information You Provide
              </h4>
              <ul className="list-disc list-inside space-y-1 ml-4 text-sm mb-3">
                <li>Name, email address, phone number</li>
                <li>Educational details (for students)</li>
                <li>Company or college information</li>
                <li>Job preferences, resumes, and profiles</li>
                <li>Messages, support requests, and feedback</li>
              </ul>

              <h4 className="font-bold text-gray-800 mb-2 text-sm">
                2. Information Collected Automatically
              </h4>
              <ul className="list-disc list-inside space-y-1 ml-4 text-sm">
                <li>IP address and device information</li>
                <li>Browser type and usage data</li>
                <li>Pages visited and actions performed</li>
                <li>Cookies and similar tracking technologies</li>
              </ul>
            </section>

            {/* 3. How We Use Your Information */}
            <section>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                How We Use Your Information
              </h3>
              <p className="leading-relaxed mb-2 text-sm">
                We use collected information to:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4 text-sm">
                <li>Provide and operate our recruitment services</li>
                <li>Facilitate hiring, placements, and career services</li>
                <li>Improve platform functionality and user experience</li>
                <li>Communicate updates, alerts, and support messages</li>
                <li>Maintain security and prevent misuse</li>
              </ul>
            </section>

            {/* 4. Information Sharing */}
            <section>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Information Sharing
              </h3>
              <p className="leading-relaxed mb-2 text-sm">
                We do not sell personal data.
              </p>
              <p className="leading-relaxed mb-2 text-sm">
                Information may be shared:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4 text-sm">
                <li>Between colleges, companies, and candidates for recruitment purposes</li>
                <li>With trusted service providers for platform operations</li>
                <li>When required by law or regulatory authorities</li>
              </ul>
            </section>

            {/* 5. Data Security */}
            <section>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Data Security
              </h3>
              <p className="leading-relaxed text-sm">
                We implement reasonable technical and organizational measures to protect personal information from unauthorized access, misuse, or disclosure. However, no system is completely secure.
              </p>
            </section>

            {/* 6. Cookies Policy */}
            <section>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Cookies Policy
              </h3>
              <p className="leading-relaxed mb-2 text-sm">
                RawRecruit uses cookies to:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4 text-sm mb-3">
                <li>Improve site performance</li>
                <li>Understand user behavior</li>
                <li>Personalize user experience</li>
              </ul>
              <p className="leading-relaxed text-sm">
                You may disable cookies through your browser settings.
              </p>
            </section>

            {/* 7. Your Rights */}
            <section>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Your Rights
              </h3>
              <p className="leading-relaxed mb-2 text-sm">
                You may:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4 text-sm mb-3">
                <li>Access or update your information</li>
                <li>Request correction or deletion of your data</li>
                <li>Withdraw consent where applicable</li>
              </ul>
              <p className="leading-relaxed text-sm">
                Requests can be sent to:{" "}
                <a 
                  href="mailto:privacy@rawrecruit.com" 
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  privacy@rawrecruit.com
                </a>
              </p>
            </section>

            {/* 8. Changes to This Policy */}
            <section>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Changes to This Policy
              </h3>
              <p className="leading-relaxed text-sm">
                We may update this Privacy Policy periodically. Changes will be posted on this page with an updated date.
              </p>
            </section>

            {/* 9. Contact Us */}
            <section>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Contact Us
              </h3>
              <p className="leading-relaxed text-sm mb-2">
                For privacy-related questions, contact:
              </p>
              <div className="text-sm">
                <span className="text-gray-600">Email: </span>
                <a 
                  href="mailto:support@rawrecruit.com" 
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  support@rawrecruit.com
                </a>
              </div>
            </section>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
          <button
            onClick={onClose}
            className="w-full bg-gradient-to-r from-blue-600 via-[#143694] to-pink-600 text-white font-semibold py-2.5 px-6 rounded-full hover:shadow-lg transform hover:scale-105 transition-all duration-300"
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