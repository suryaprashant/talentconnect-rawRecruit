import React, { useEffect } from "react";

// Complete Terms & Services Modal Component
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
          <h2 className="text-xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Terms & Services
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1 hover:bg-gray-100 rounded-full"
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
            <section>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                1. Introduction
              </h3>
              <p className="leading-relaxed text-sm">
                Welcome to RawRecruit. These Terms and Conditions govern your
                use of our campus recruitment platform. By accessing or using
                our services, you agree to be bound by these terms.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                2. Services Provided
              </h3>
              <p className="leading-relaxed mb-2 text-sm">
                RawRecruit connects colleges and companies for fresher
                recruitment and career-building through innovative hiring
                solutions. Our platform provides:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4 text-sm">
                <li>Campus recruitment management tools</li>
                <li>Job posting and application tracking</li>
                <li>Student profile management</li>
                <li>Interview scheduling and coordination</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                3. User Responsibilities
              </h3>
              <p className="leading-relaxed mb-2 text-sm">
                As a user of RawRecruit, you agree to:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4 text-sm">
                <li>Provide accurate and complete information</li>
                <li>
                  Maintain the confidentiality of your account credentials
                </li>
                <li>Not misuse or abuse the platform</li>
                <li>Comply with all applicable laws and regulations</li>
                <li>Respect intellectual property rights</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                4. Privacy & Data Protection
              </h3>
              <p className="leading-relaxed text-sm">
                We are committed to protecting your privacy. All personal
                information collected through our platform is handled in
                accordance with our Privacy Policy and applicable data
                protection laws.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                5. Limitation of Liability
              </h3>
              <p className="leading-relaxed text-sm">
                RawRecruit shall not be liable for any indirect, incidental,
                special, consequential, or punitive damages resulting from your
                use or inability to use the service.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                6. Modifications
              </h3>
              <p className="leading-relaxed text-sm">
                We reserve the right to modify these terms at any time.
                Continued use of the platform after changes constitutes
                acceptance of the modified terms.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                7. Contact Information
              </h3>
              <p className="leading-relaxed text-sm">
                For questions about these Terms & Services, please contact us at
                support@rawrecruit.com
              </p>
            </section>

            <section>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                8. Account Termination
              </h3>
              <p className="leading-relaxed text-sm">
                We reserve the right to suspend or terminate your account if you
                violate these terms or engage in fraudulent activities. You may
                also request account deletion at any time.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                9. Intellectual Property
              </h3>
              <p className="leading-relaxed text-sm">
                All content, features, and functionality on RawRecruit are owned
                by us and protected by copyright, trademark, and other
                intellectual property laws.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                10. Dispute Resolution
              </h3>
              <p className="leading-relaxed text-sm">
                Any disputes arising from these terms will be resolved through
                binding arbitration in accordance with applicable laws.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                11. Third-Party Services
              </h3>
              <p className="leading-relaxed text-sm">
                Our platform may contain links to third-party websites or
                services. We are not responsible for the content or practices of
                these external sites.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                12. Payment Terms
              </h3>
              <p className="leading-relaxed mb-2 text-sm">
                For paid services, the following terms apply:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4 text-sm">
                <li>All fees are in USD unless otherwise stated</li>
                <li>Payments are non-refundable except as required by law</li>
                <li>Subscription renewals are automatic unless cancelled</li>
                <li>Price changes will be communicated 30 days in advance</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                13. Governing Law
              </h3>
              <p className="leading-relaxed text-sm">
                These terms are governed by the laws of the jurisdiction in
                which RawRecruit operates, without regard to conflict of law
                principles.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                14. Updates and Notifications
              </h3>
              <p className="leading-relaxed text-sm">
                By using our platform, you consent to receive important updates,
                notifications, and promotional communications via email or
                in-app messages.
              </p>
            </section>
          </div>
        </div>

        {/* Footer */}
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
