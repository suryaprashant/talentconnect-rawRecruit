import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import ReactGA from "react-ga4";
import { TermsModal } from '@/components/onboarding/Terms&conditionModal'; 
import heroImage from "../../assets/RR-Tagline.png";

// Helper function for GA events
const trackGAEvent = (category, action, label) => {
  if (import.meta.env.VITE_GA_MEASUREMENT_ID && window.ReactGA) {
    ReactGA.event({
      category,
      action,
      label
    });
  }
};

const RoleSelection = () => {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState('');
  const [hoveredRole, setHoveredRole] = useState('');
  const [isLegalModalOpen, setIsLegalModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({
    title: '',
    content: ''
  });

  // Move handleFooterLinkClick inside the component
  const handleFooterLinkClick = (type) => {
    const contentMap = {
      privacy: {
        title: 'Privacy Policy',
        content: 'This is the privacy policy content...' // Add your actual content
      },
      terms: {
        title: 'Terms of Service',
        content: 'This is the terms of service content...' // Add your actual content
      },
      contact: {
        title: 'Contact Us',
        content: 'This is the contact information...' // Add your actual content
      }
    };
    
    setModalContent(contentMap[type]);
    setIsLegalModalOpen(true);
  };

  const roles = [
    {
      key: 'student',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10">
          <path d="M4.5 6.375a4.125 4.125 0 118.25 0 4.125 4.125 0 01-8.25 0zM14.25 8.625a3.375 3.375 0 116.75 0 3.375 3.375 0 01-6.75 0zM1.5 19.125a7.125 7.125 0 0114.25 0v.003l-.001.119a.75.75 0 01-.363.63 13.067 13.067 0 01-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 01-.364-.63l-.001-.122zM17.25 19.128l-.001.144a2.25 2.25 0 01-.233.96 10.088 10.088 0 005.06-1.01.75.75 0 00.42-.643 a4.875 4.875 0 00-6.957-4.611 8.586 8.586 0 011.71 5.157v.003z" />
        </svg>
      ),
      title: 'Student',
      description: 'Looking for job opportunities, internships, or placements? Register to explore careers and connect with top employers.',
      gradient: 'from-[#667eea] to-[#764ba2]',
      features: ['Job opportunities', 'Career growth', 'Industry connections']
    },
    {
      key: 'fresher',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10">
          <path d="M4.5 6.375a4.125 4.125 0 118.25 0 4.125 4.125 0 01-8.25 0zM14.25 8.625a3.375 3.375 0 116.75 0 3.375 3.375 0 01-6.75 0zM1.5 19.125a7.125 7.125 0 0114.25 0v.003l-.001.119a.75.75 0 01-.363.63 13.067 13.067 0 01-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 01-.364-.63l-.001-.122zM17.25 19.128l-.001.144a2.25 2.25 0 01-.233.96 10.088 10.088 0 005.06-1.01.75.75 0 00.42-.643 a4.875 4.875 0 00-6.957-4.611 8.586 8.586 0 011.71 5.157v.003z" />
        </svg>
      ),
      title: 'Fresher',
      description: 'Looking for job opportunities, internships, or placements? Register to explore careers and connect with top employers.',
      gradient: 'from-[#667eea] to-[#764ba2]',
      features: ['Job opportunities', 'Career growth', 'Industry connections']
    },
    {
      key: 'professional',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10">
          <path d="M4.5 6.375a4.125 4.125 0 118.25 0 4.125 4.125 0 01-8.25 0zM14.25 8.625a3.375 3.375 0 116.75 0 3.375 3.375 0 01-6.75 0zM1.5 19.125a7.125 7.125 0 0114.25 0v.003l-.001.119a.75.75 0 01-.363.63 13.067 13.067 0 01-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 01-.364-.63l-.001-.122zM17.25 19.128l-.001.144a2.25 2.25 0 01-.233.96 10.088 10.088 0 005.06-1.01.75.75 0 00.42-.643 a4.875 4.875 0 00-6.957-4.611 8.586 8.586 0 011.71 5.157v.003z" />
        </svg>
      ),
      title: 'Professional',
      description: 'Looking for job opportunities, internships, or placements? Register to explore careers and connect with top employers.',
      gradient: 'from-[#667eea] to-[#764ba2]',
      features: ['Job opportunities', 'Career growth', 'Industry connections']
    },
    {
      key: 'college',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10">
          <path d="M11.584 2.376a.75.75 0 01.832 0l9 6a.75.75 0 11-.832 1.248L12 3.901 3.416 9.624a.75.75 0 01-.832-1.248l9-6z" />
          <path fillRule="evenodd" d="M20.25 10.332v9.918H21a.75.75 0 010 1.5H3a.75.75 0 010-1.5h.75v-9.918a.75.75 0 01.634-.74A49.109 49.109 0 0112 9c2.59 0 5.134.202 7.616.592a.75.75 0 01.634.74zm-7.5 2.418a.75.75 0 00-1.5 0v6.75a.75.75 0 001.5 0v-6.75zm3-.75a.75.75 0 01.75.75v6.75a.75.75 0 01-1.5 0v-6.75a.75.75 0 01.75-.75zM9 12.75a.75.75 0 00-1.5 0v6.75a.75.75 0 001.5 0v-6.75z" clipRule="evenodd" />
          <path d="M12 7.875a1.125 1.125 0 100-2.25 1.125 1.125 0 000 2.25z" />
        </svg>
      ),
      title: 'College',
      description: 'Representing an educational institution? Register as a college to manage placement drives, invite employers, and track student hiring.',
      gradient: 'from-[#f093fb] to-[#f5576c]',
      features: ['Placement management', 'Employer network', 'Student tracking']
    },
    {
      key: 'company',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10">
          <path fillRule="evenodd" d="M4.5 2.25a.75.75 0 000 1.5v16.5h-.75a.75.75 0 000 1.5h16.5a.75.75 0 000-1.5h-.75V3.75a.75.75 0 000-1.5h-15zM9 6a.75.75 0 000 1.5h1.5a.75.75 0 000-1.5H9zm-.75 3.75A.75.75 0 019 9h1.5a.75.75 0 010 1.5H9a.75.75 0 01-.75-.75zM9 12a.75.75 0 000 1.5h1.5a.75.75 0 000-1.5H9zm3.75-5.25A.75.75 0 0113.5 6H15a.75.75 0 010 1.5h-1.5a.75.75 0 01-.75-.75zM13.5 9a.75.75 0 000 1.5H15A.75.75 0 0015 9h-1.5zm-.75 3.75a.75.75 0 01.75-.75H15a.75.75 0 010 1.5h-1.5a.75.75 0 01-.75-.75zM9 19.5v-2.25a.75.75 0 01.75-.75h4.5a.75.75 0 01.75.75v2.25a.75.75 0 01-.75.75h-4.5A.75.75 0 019 19.5z" clipRule="evenodd" />
        </svg>
      ),
      title: 'Company',
      description: 'Need to hire talent? Register as a company to post job openings, manage applications, and connect with students from top colleges.',
      gradient: 'from-[#4facfe] to-[#00f2fe]',
      features: ['Talent acquisition', 'Campus recruitment', 'HR solutions']
    },
    {
      key: 'employer',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10">
          <path fillRule="evenodd" d="M8.25 6.75a3.75 3.75 0 117.5 0 3.75 3.75 0 01-7.5 0zM15.75 9.75a3 3 0 116 0 3 3 0 01-6 0zM2.25 9.75a3 3 0 116 0 3 3 0 01-6 0zM6.31 15.117A6.745 6.745 0 0112 12a6.745 6.745 0 016.709 7.498.75.75 0 01-.372.568A12.696 12.696 0 0112 21.75c-2.305 0-4.47-.612-6.337-1.684a.75.75 0 01-.372-.568 6.787 6.787 0 011.019-4.38z" clipRule="evenodd" />
          <path d="M5.082 14.254a8.287 8.287 0 00-1.308 5.135 9.687 9.687 0 01-1.764-.44l-.115-.04a.563.563 0 01-.373-.487l-.01-.121a3.75 3.75 0 013.57-4.047zM20.226 19.389a8.287 8.287 0 00-1.308-5.135 a3.75 3.75 0 013.57 4.047l-.01.121a.563.563 0 01-.373.486l-.115.04c-.567.2-1.156.349-1.764.441z" />
        </svg>
      ),
      title: 'Employer',
      description: 'Seeking skilled professionals? Register as an employer to access a pool of qualified candidates and streamline your hiring process.',
      gradient: 'from-[#43e97b] to-[#38f9d7]',
      features: ['Candidate pool', 'Hiring tools', 'Recruitment support']
    },
  ];

  const handleContinue = () => {
    if (selectedRole) {
      sessionStorage.setItem('tempSelectedRole', selectedRole);
      localStorage.setItem('selectedRole', selectedRole);
      
      // Track final selection confirmation
      trackGAEvent("Role Selection", "Continue Clicked", selectedRole);
      
      navigate('/signup');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#667eea]/10 via-[#f093fb]/5 to-[#764ba2]/10">
      <div className="flex-1 flex flex-col">
        {/* Header in your format */}
        <header className="absolute top-6 left-1/2 transform -translate-x-1/2 w-[92%] max-w-6xl bg-white/70 backdrop-blur-xl rounded-2xl border border-white/40 shadow-2xl z-50">
          <div className="px-8 py-3 flex justify-between items-center">
            {/* RawRecruit Logo on left */}
            <button 
              onClick={() => navigate('/')}
              className="focus:outline-none"
            >
              <img 
                src={heroImage} 
                alt="RawRecruit Logo" 
                className="h-16 w-auto object-contain"
              />
            </button>

            {/* Empty middle and right side since we only want the logo */}
            <div></div>
            <div></div>
          </div>
        </header>

        {/* Main content area with proper padding for fixed header */}
        <div className="pt-24 flex-1 flex flex-col px-4 sm:px-6">
          <div className="max-w-7xl mx-auto w-full">
            {/* Back Button and Get Started badge in same container */}
            <div className="relative mb-12 mt-12">
              {/* Get Started badge centered */}
              <div className="flex justify-center">
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white px-5 py-2 rounded-full text-sm font-semibold shadow-md">
                  {/* Sparkles Icon */}
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                    <path fillRule="evenodd" d="M9 4.5a.75.75 0 01.721.544l.813 2.846a3.75 3.75 0 002.576 2.576l2.846.813a.75.75 0 010 1.442l-2.846.813a3.75 3.75 0 00-2.576 2.576l-.813 2.846a.75.75 0 01-1.442 0l-.813-2.846a3.75 3.75 0 00-2.576-2.576l-2.846-.813a.75.75 0 010-1.442l2.846-.813A3.75 3.75 0 007.466 7.89l.813-2.846A.75.75 0 019 4.5zM18 1.5a.75.75 0 01.728.568l.258 1.036c.236.94.97 1.674 1.91 1.91l1.036.258a.75.75 0 010 1.456l-1.036.258c-.94.236-1.674.97-1.91 1.91l-.258 1.036a.75.75 0 01-1.456 0l-.258-1.036a2.625 2.625 0 00-1.91-1.91l-1.036-.258a.75.75 0 010-1.456l1.036-.258a2.625 2.625 0 001.91-1.91l.258-1.036A.75.75 0 0118 1.5zM16.5 15a.75.75 0 01.712.513l.394 1.183c.15.447.5.799.948.948l1.183.395a.75.75 0 010 1.422l-1.183.395c-.447.15-.799.5-.948.948l-.395 1.183a.75.75 0 01-1.422 0l-.395-1.183a1.5 1.5 0 00-.948-.948l-1.183-.395a.75.75 0 010-1.422l1.183-.395c.447-.15.799-.5.948-.948l.395-1.183A.75.75 0 0116.5 15z" clipRule="evenodd" />
                  </svg>
                  Get Started
                </div>
              </div>
            </div>

            {/* Main title and description */}
            <div className="text-center mb-12">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                Get Started with <span className="text-[#667eea]">TalentConnect</span>
              </h1>
              <p className="text-gray-600 max-w-2xl mx-auto mb-2">
                Get started by selecting the user type that best describes you. This helps us personalize your experience.
              </p>
            </div>

            {/* Role Cards - Modified grid to show all 5 in a row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-8 max-w-7xl mx-auto">
              {roles.map((role) => (
                <div
                  key={role.key}
                  onClick={() => {
                    setSelectedRole(role.key);
                    // Track which role user is selecting
                    trackGAEvent("Role Selection", "Role Selected", role.key);
                  }}
                  onMouseEnter={() => setHoveredRole(role.key)}
                  onMouseLeave={() => setHoveredRole('')}
                  className={`
                    relative bg-white p-4 rounded-2xl shadow-lg border border-gray-100 
                    transition-all duration-500 cursor-pointer h-full flex flex-col min-h-[320px]
                    ${selectedRole === role.key
                      ? 'ring-2 ring-offset-2 ring-[#667eea] transform scale-[1.02]'
                      : 'hover:shadow-xl hover:-translate-y-1'
                    }
                  `}
                >
                  {/* Gradient accent */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${role.gradient} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-300`} />

                  {/* Selection indicator */}
                  {selectedRole === role.key && (
                    <div className="absolute -top-2 -right-2 bg-[#667eea] text-white p-1.5 rounded-full shadow-lg z-10">
                      {/* CheckCircle Icon */}
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                        <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}

                  {/* Icon */}
                  <div className={`mb-3 p-2.5 rounded-xl bg-gradient-to-br ${role.gradient} w-12 h-12 flex items-center justify-center text-white shadow-md flex-shrink-0`}>
                    {role.icon}
                  </div>

                  {/* Title */}
                  <h3 className="text-base font-bold text-gray-800 mb-2 leading-tight">{role.title}</h3>

                  {/* Description */}
                  <p className="text-gray-600 text-xs mb-3 leading-relaxed flex-grow">
                    {role.description}
                  </p>

                  {/* Features */}
                  <div className="mb-3">
                    {role.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-1.5 mb-1 text-xs">
                        <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-br ${role.gradient} flex-shrink-0`} />
                        <span className="text-gray-700 truncate">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* Continue indicator */}
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100 mt-auto">
                    <span className={`font-medium text-xs transition-all duration-300 ${selectedRole === role.key
                        ? 'text-[#667eea]'
                        : 'text-gray-500 group-hover:text-[#667eea]'
                      }`}>
                      {selectedRole === role.key ? 'Selected ✓' : 'Continue'}
                    </span>
                    {/* ChevronRight Icon */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className={`w-4 h-4 transition-transform duration-300 ${hoveredRole === role.key ? 'translate-x-1 text-[#667eea]' : 'text-gray-400'
                        }`}
                    >
                      <path fillRule="evenodd" d="M16.28 11.47a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 01-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 011.06-1.06l7.5 7.5z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              ))}
            </div>

            {/* Continue Button */}
            <div className="text-center">
              <button
                onClick={handleContinue}
                disabled={!selectedRole}
                className={`
                  group bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white 
                  px-10 py-3 rounded-full font-bold text-base
                  hover:shadow-xl hover:scale-105 transition-all duration-300
                  disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
                  shadow-lg inline-flex items-center gap-2
                `}
              >
                {selectedRole ? 'Continue' : 'Select a Role to Continue'}
                {/* ArrowRight Icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-4 h-4 group-hover:translate-x-2 transition-transform"
                >
                  <path fillRule="evenodd" d="M12.97 3.97a.75.75 0 011.06 0l7.5 7.5a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 11-1.06-1.06l6.22-6.22H3a.75.75 0 010-1.5h16.19l-6.22-6.22a.75.75 0 010-1.06z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-auto py-8 px-4 text-center text-gray-500 text-sm border-t border-gray-200">
          <p className="mb-2">© 2025 TalentConnects. All rights reserved.</p>
          <div className="flex justify-center gap-6 text-xs">
            <button 
              onClick={() => handleFooterLinkClick('privacy')}
              className="hover:text-gray-700 transition-colors"
            >
              Privacy Policy
            </button>
            <button 
              onClick={() => handleFooterLinkClick('terms')}
              className="hover:text-gray-700 transition-colors"
            >
              Terms of Service
            </button>
            <button 
              onClick={() => handleFooterLinkClick('contact')}
              className="hover:text-gray-700 transition-colors"
            >
              Contact
            </button>
          </div>
        </footer>
      </div>

      {/* Terms Modal */}
      <TermsModal
        isOpen={isLegalModalOpen}
        onClose={() => setIsLegalModalOpen(false)}
      />
    </div>
  );
};

export default RoleSelection;