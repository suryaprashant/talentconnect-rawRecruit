import React, { useEffect } from "react";

export const TermsModal = ({ isOpen, onClose }) => {
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
            Terms & Conditions
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
            {/* 1. Acceptance of Terms */}
            <section>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Acceptance of Terms
              </h3>
              <p className="leading-relaxed text-sm">
                By accessing or using RawRecruit, you agree to comply with these Terms & Conditions. If you do not agree, please do not use the platform.
              </p>
            </section>

            {/* 2. Platform Usage */}
            <section>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Platform Usage
              </h3>
              <p className="leading-relaxed mb-2 text-sm">
                RawRecruit provides recruitment, placement, and career development services for:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4 text-sm">
                <li>Students and fresh graduates</li>
                <li>Colleges and educational institutions</li>
                <li>Companies and employers</li>
              </ul>
              <p className="leading-relaxed text-sm mt-2">
                Users agree to use the platform only for lawful and intended purposes.
              </p>
            </section>

            {/* 3. User Responsibilities */}
            <section>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                User Responsibilities
              </h3>
              <p className="leading-relaxed mb-2 text-sm">
                You agree to:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4 text-sm">
                <li>Provide accurate and up-to-date information</li>
                <li>Maintain confidentiality of login credentials</li>
                <li>Not misuse the platform or submit false data</li>
                <li>Respect other users and platform rules</li>
              </ul>
            </section>

            {/* 4. Account Suspension */}
            <section>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Account Suspension
              </h3>
              <p className="leading-relaxed mb-2 text-sm">
                RawRecruit reserves the right to suspend or terminate accounts if:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4 text-sm">
                <li>False or misleading information is provided</li>
                <li>Platform policies are violated</li>
                <li>Activities are deemed harmful or unlawful</li>
              </ul>
            </section>

            {/* 5. Intellectual Property */}
            <section>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Intellectual Property
              </h3>
              <p className="leading-relaxed text-sm">
                All content, logos, designs, and platform materials belong to RawRecruit and may not be copied, modified, or distributed without permission.
              </p>
            </section>

            {/* 6. Third-Party Links */}
            <section>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Third-Party Links
              </h3>
              <p className="leading-relaxed text-sm">
                The platform may contain links to third-party websites. RawRecruit is not responsible for external content or privacy practices.
              </p>
            </section>

            {/* 7. Limitation of Liability */}
            <section>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Limitation of Liability
              </h3>
              <p className="leading-relaxed mb-2 text-sm">
                RawRecruit is not responsible for:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4 text-sm">
                <li>Hiring or placement decisions made by users</li>
                <li>Losses arising from misuse of the platform</li>
                <li>Technical disruptions beyond reasonable control</li>
              </ul>
              <p className="leading-relaxed text-sm font-medium mt-2">
                Use of the platform is at your own risk.
              </p>
            </section>

            {/* 8. Governing Law */}
            <section>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Governing Law
              </h3>
              <p className="leading-relaxed text-sm">
                These Terms shall be governed by the laws of India, and disputes shall be subject to the jurisdiction of Indian courts.
              </p>
            </section>

            {/* 9. Changes to Terms */}
            <section>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Changes to Terms
              </h3>
              <p className="leading-relaxed text-sm">
                We may revise these Terms from time to time. Continued use of the platform constitutes acceptance of updated terms.
              </p>
            </section>

            {/* 10. Contact Information */}
            <section>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Contact Information
              </h3>
              <p className="leading-relaxed text-sm mb-2">
                For questions related to Terms & Conditions:
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
          </div>
        </div>

        {/* Footer */}
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