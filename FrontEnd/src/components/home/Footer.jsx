import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Rocket, Linkedin } from "lucide-react";

const Footer = ({
  handleLogoClick,
  setIsFeaturesModalOpen,
  setIsSolutionsModalOpen,
  setIsDemoModalOpen,
  setIsAboutModalOpen,
  setIsCareersModalOpen,
  setIsHelpCenterModalOpen,
  setIsContactModalOpen,
  setIsTermsModalOpen,
}) => {
  const navigate = useNavigate();
  const footerRef = useRef(null);

  return (
    <footer
      ref={footerRef}
      className="relative bg-[#0f1729] text-white pt-16 pb-8 px-6"
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-6">

          {/* Brand */}
          <div>
            <button
              onClick={handleLogoClick}
              className="flex items-center gap-3 mb-6 group"
            >
              {/* <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl blur opacity-30 group-hover:opacity-50 transition-opacity"></div>
                <div className="relative bg-gradient-to-br from-gray-800 to-gray-900 p-2 rounded-xl shadow-lg border border-gray-700/60 group-hover:shadow-xl transition-shadow duration-300">
                  <Rocket className="w-6 h-6 text-transparent fill-[url(#gradient)] group-hover:fill-[url(#gradient-hover)]" />

                  <svg className="absolute w-0 h-0">
                    <defs>
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#a855f7" />
                        <stop offset="100%" stopColor="#ec4899" />
                      </linearGradient>
                      <linearGradient id="gradient-hover" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#60a5fa" />
                        <stop offset="100%" stopColor="#c084fc" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
              </div> */}

              <span className="text-2xl font-bold bg-gradient-to-r text-white bg-clip-text text-transparent transition-all duration-300">
                RawRecruit
              </span>
            </button>

            <p className="text-gray-400 mb-6">
              Unified platform for campus recruitment connecting colleges, companies, and students.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() =>
                  window.open(
                    "https://www.linkedin.com/company/talentsconnectss/",
                    "_blank"
                  )
                }
                className="w-8 h-8 rounded-lg bg-gray-800/50 border border-gray-700/50 flex items-center justify-center hover:bg-gray-700/50 transition-colors"
              >
                <Linkedin className="w-4 h-4 text-gray-400" />
              </button>
            </div>
          </div>

          {/* Product */}
          <div>
            <h3 className="text-lg font-bold mb-6 text-gray-200">Product</h3>
            <ul className="space-y-3">
              <li>
                <button
                  onClick={() => setIsFeaturesModalOpen(true)}
                  className="text-gray-400 hover:text-white transition"
                >
                  Features
                </button>
              </li>
              <li>
                <button
                  onClick={() => setIsSolutionsModalOpen(true)}
                  className="text-gray-400 hover:text-white transition"
                >
                  Solutions
                </button>
              </li>
              <li>
                <button
                  onClick={() => setIsDemoModalOpen(true)}
                  className="text-gray-400 hover:text-white transition"
                >
                  Demo
                </button>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-lg font-bold mb-6 text-gray-200">Company</h3>
            <ul className="space-y-3">
              <li>
                <button
                  onClick={() => setIsAboutModalOpen(true)}
                  className="text-gray-400 hover:text-white transition"
                >
                  About
                </button>
              </li>
              <li>
                <button
                  onClick={() => setIsCareersModalOpen(true)}
                  className="text-gray-400 hover:text-white transition"
                >
                  Careers
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate("/blogs")}
                  className="text-gray-400 hover:text-white transition"
                >
                  Blogs
                </button>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-bold mb-6 text-gray-200">Support</h3>
            <ul className="space-y-3">
              <li>
                <button
                  onClick={() => setIsHelpCenterModalOpen(true)}
                  className="text-gray-400 hover:text-white transition"
                >
                  Help Center
                </button>
              </li>
              <li>
                <button
                  onClick={() => setIsContactModalOpen(true)}
                  className="text-gray-400 hover:text-white transition"
                >
                  Contact
                </button>
              </li>
              <li>
                <button
                  onClick={() => setIsTermsModalOpen(true)}
                  className="text-gray-400 hover:text-white transition"
                >
                  Terms
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate("/privacypolicy")}
                  className="text-gray-400 hover:text-white transition"
                >
                  Privacy
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate("/delete")}
                  className="text-gray-400 hover:text-white transition"
                >
                  Delete your Account
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom */}
        <div className="border-t border-gray-800/50 pt-8 text-center text-gray-400">
          <p>© {new Date().getFullYear()} RawRecruit. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;