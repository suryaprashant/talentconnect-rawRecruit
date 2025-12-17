import { useState } from 'react';
import { 
  FiTarget, 
  FiTrendingUp, 
  FiAward, 
  FiUsers, 
  FiPlus, 
  FiMessageCircle,
  FiBookOpen,
  FiBriefcase,
  FiCheckCircle
} from 'react-icons/fi';

function FresherCareerCraft() {
    const [features, setFeatures] = useState([
      {
        id: 1,
        title: "Personalized Career Path",
        description: "Get a customized career roadmap based on your skills, interests, and goals.",
        icon: FiTarget,
        color: "from-[#a5b4fc]/20 to-[#c4b5fd]/20",
        borderColor: "border-[#a5b4fc]/30",
        iconColor: "text-[#667eea]"
      },
      {
        id: 2,
        title: "Skill Development Plans",
        description: "Structured learning paths to develop in-demand skills for your chosen career.",
        icon: FiTrendingUp,
        color: "from-[#bbf7d0]/20 to-[#86efac]/20",
        borderColor: "border-[#bbf7d0]/30",
        iconColor: "text-[#059669]"
      },
      {
        id: 3,
        title: "Industry Mentorship",
        description: "Connect with experienced professionals for guidance and career advice.",
        icon: FiUsers,
        color: "from-[#fde68a]/20 to-[#fcd34d]/20",
        borderColor: "border-[#fde68a]/30",
        iconColor: "text-[#d97706]"
      },
    ]);
  
    const addFeature = () => {
      const newFeature = {
        id: features.length + 1,
        title: 'Interview Preparation',
        description: 'Comprehensive interview training with mock sessions and feedback.',
        icon: FiMessageCircle,
        color: "from-[#fbcfe8]/20 to-[#f9a8d4]/20",
        borderColor: "border-[#fbcfe8]/30",
        iconColor: "text-[#be185d]"
      };
      setFeatures([...features, newFeature]);
    };
  
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#667eea]/10 via-[#f093fb]/5 to-[#764ba2]/10">
        {/* Pastel blur background elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#667eea]/10 rounded-full blur-3xl"></div>
          <div className="absolute top-1/3 -left-20 w-60 h-60 bg-[#f093fb]/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-1/3 w-40 h-40 bg-[#764ba2]/10 rounded-full blur-3xl"></div>
        </div>
  
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-12 space-y-20">
          {/* Hero Section */}
          <section className="space-y-6">
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="md:w-1/2 space-y-6">
                <h1 className="text-4xl md:text-5xl font-bold leading-snug bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent">
                  Craft Your Perfect Career Path
                </h1>
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2 text-gray-600">
                    <FiCheckCircle className="w-5 h-5 text-[#667eea]" />
                    <p>Personalized career development strategies</p>
                  </div>
                </div>
              </div>
              <div className="md:w-1/2">
                <div className="bg-white/90 backdrop-blur-sm border border-white/50 rounded-2xl shadow-lg shadow-purple-50/50 p-6">
                  <p className="text-gray-600 leading-relaxed">
                    Our Career Craft program helps you build a successful career path through 
                    personalized guidance, skill development, and industry connections. 
                    We work with you to create a roadmap that aligns with your aspirations.
                  </p>
                  <div className="mt-4 flex items-center space-x-2 text-sm text-[#667eea]">
                    <FiBriefcase className="w-4 h-4" />
                    <span>Tailored for freshers and early-career professionals</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
  
          {/* Feature Cards */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature) => {
              const IconComponent = feature.icon;
              return (
                <div 
                  key={feature.id} 
                  className={`bg-gradient-to-br ${feature.color} backdrop-blur-sm border ${feature.borderColor} rounded-2xl shadow-lg hover:shadow-xl hover:shadow-purple-100/30 transition-all duration-300 transform hover:-translate-y-1 p-6`}
                >
                  <div className="w-16 h-16 bg-white/50 rounded-xl mb-4 flex items-center justify-center">
                    <IconComponent className={`w-8 h-8 ${feature.iconColor}`} />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600 mb-4">{feature.description}</p>
                  <button className="text-[#667eea] font-medium hover:text-[#764ba2] transition-colors duration-200 flex items-center">
                    Learn more
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                    </svg>
                  </button>
                </div>
              );
            })}
          </section>
  
          {/* Add Feature Button */}
          <div className="text-center">
            <button
              onClick={addFeature}
              className="inline-flex items-center bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-200 px-6 py-3 rounded-xl font-medium"
            >
              <FiPlus className="w-5 h-5 mr-2" />
              Discover More Features
            </button>
            <p className="text-sm text-gray-500 mt-3">
              Click to explore additional career development tools
            </p>
          </div>
  
          {/* Contact Section */}
          <section className="bg-white/90 backdrop-blur-sm border border-white/50 rounded-2xl shadow-lg shadow-purple-50/50 text-center py-12 px-6">
            <div className="max-w-2xl mx-auto">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-[#a5b4fc]/20 to-[#c4b5fd]/20 rounded-full mb-6">
                <FiBookOpen className="w-8 h-8 text-[#667eea]" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent mb-4">
                Ready to Craft Your Career?
              </h2>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Start your journey towards a fulfilling career with personalized guidance 
                and expert support every step of the way.
              </p>
              <div className="space-x-4">
                <button className="border border-[#667eea] text-[#667eea] hover:bg-[#667eea]/10 transition-all duration-200 px-6 py-3 rounded-xl font-medium">
                  <FiMessageCircle className="inline-block w-4 h-4 mr-2" />
                  Contact Us
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>
    );
  }
  
  export default FresherCareerCraft;