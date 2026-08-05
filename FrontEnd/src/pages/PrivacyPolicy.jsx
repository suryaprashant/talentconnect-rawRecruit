import React from "react";
import { ShieldCheck } from "lucide-react";
import { Helmet } from "react-helmet-async";

const PrivacyPolicy = () => {
  return (
    <>
      <Helmet prioritizeSeoTags>
        <title>Privacy Policy | RawRecruit</title>

        <meta
          name="description"
          content="Read RawRecruit's Privacy Policy to understand how we collect, use, and protect your personal information."
        />

        <link rel="canonical" href="https://rawrecruit.in/privacypolicy" />
      </Helmet>
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        {/* Hero Section */}
        <div className="pt-28 pb-16 text-center px-6">
          <div className="flex justify-center mb-6">
            <div className="bg-gradient-to-r from-[#143694] to-pink-600 p-4 rounded-2xl shadow-lg">
              <ShieldCheck className="text-white w-8 h-8" />
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Privacy Policy
          </h1>

          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Your privacy matters to us. This policy explains how RawRecruit
            collects, uses, and protects your information while using our campus
            recruitment platform.
          </p>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto px-6 pb-20">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 space-y-10">
            {/* Section */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">
                Information We Collect
              </h2>

              <p className="text-gray-600 leading-relaxed">
                RawRecruit may collect personal information including your name,
                email address, organization details, and recruitment-related
                information when you create an account or interact with the
                platform.
              </p>
            </div>

            {/* Section */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">
                How We Use Your Information
              </h2>

              <p className="text-gray-600 leading-relaxed">
                We use the information we collect to provide recruitment
                services, improve platform functionality, and enable connections
                between colleges, companies, employers, and candidates.
              </p>
            </div>

            {/* Section */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">
                Data Protection
              </h2>

              <p className="text-gray-600 leading-relaxed">
                RawRecruit implements industry-standard security measures to
                protect personal data from unauthorized access, misuse, or
                disclosure.
              </p>
            </div>

            {/* Section */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">
                Data Sharing
              </h2>

              <p className="text-gray-600 leading-relaxed">
                We only share information with relevant recruitment stakeholders
                such as colleges, companies, and hiring partners when necessary
                for recruitment processes.
              </p>
            </div>

            {/* Section */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">
                Your Rights
              </h2>

              <p className="text-gray-600 leading-relaxed">
                You have the right to access, update, or request deletion of
                your personal information. If you wish to make such requests,
                please contact our support team.
              </p>
            </div>

            {/* Section */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">
                Contact Us
              </h2>

              <p className="text-gray-600 leading-relaxed">
                If you have questions about this privacy policy or how your data
                is handled, please contact the RawRecruit support team.
              </p>
            </div>
          </div>

          {/* Footer note */}
          <p className="text-center text-sm text-gray-500 mt-8">
            Last updated: {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </>
  );
};

export default PrivacyPolicy;
