import React from 'react';
import { Building2, Users, Zap, Target } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
export default function MainPage({ onRegisterClick, onRequestInfoClick }) {4
  const navigate = useNavigate(); 
  // SEO Card Content
  const serviceData = [
    {
      id: 1,
      title: "Multi-College Hiring",
      bullets: [
        "Access students from multiple colleges",
        "Conduct shared pool-campus recruitment drives",
        "Expand talent reach beyond a single campus",
        "Improve fresher hiring scale and efficiency"
      ],
      icon: Users,
    },
    {
      id: 2,
      title: "Cost-Effective Recruitment",
      bullets: [
        "Reduce cost per hire across campuses",
        "Optimize hiring budgets with shared drives",
        "Minimize repeated campus visits",
        "Achieve higher hiring ROI"
      ],
      icon: Zap,
    },
    {
      id: 3,
      title: "Centralized Coordination",
      bullets: [
        "Manage pool-campus drives from one platform",
        "Coordinate schedules across colleges",
        "Track participation and hiring progress",
        "Simplify multi-college recruitment operations"
      ],
      icon: Target,
    },
  ];

  return (
    <>
      {/* Meta Title and Description */}
      <head>
        <title>Pool-Campus Recruitment for Companies | RawRecruit</title>
        <meta 
          name="description" 
          content="Hire freshers from multiple colleges through pool-campus recruitment. RawRecruit enables scalable, cost-effective campus hiring." 
        />
      </head>

      <div className="min-h-screen bg-gradient-to-br from-[#667eea]/5 via-[#f093fb]/5 to-[#764ba2]/5 overflow-hidden">
        <div className="container mx-auto px-4 pt-8 max-w-6xl">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 px-6 py-5 mb-2">
            <div className="flex items-center gap-3 mb-3">
              <h2 className="text-3xl ml-1 mt-2 font-bold text-primaryBrand">Hiring Channels</h2>
            </div>
            
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 border-gray-200 pb-1">
              <button 
                onClick={() => navigate('/hiring-channels/on-campus-hiring')}
                className="px-2 py-2 text-gray-500 hover:text-[#1a3a8a] font-medium text-sm transition-all"
              >
                On-campus Hiring
              </button>
              
              {/* Pool Campus: Active Highlight */}
              <button 
                className="px-6 py-2 bg-[#1a3a8a] text-white rounded-full font-medium text-sm transition-all shadow-md"
              >
                Pool Campus Hiring
              </button>

              <button 
                onClick={() => navigate('/hiring-channels/off-campus-hiring')}
                className="px-2 py-2 text-gray-500 hover:text-[#1a3a8a] font-medium text-sm transition-all"
              >
                Off-campus Hiring
              </button>

              <button 
                onClick={() => navigate('/hiring-channels/post-an-internship')}
                className="px-2 py-2 text-gray-500 hover:text-[#1a3a8a] font-medium text-sm transition-all"
              >
                Post an Internship
              </button>
            </div>
          </div>
        </div>
        <div className="container mx-auto px-4 max-w-6xl flex flex-col py-4">

          {/* Header */}
          <header className="bg-white rounded-2xl shadow-sm border border-gray-200 px-6 py-8 mb-10 text-center">

            <h1 className="text-3xl md:text-4xl font-semibold text-[#143694] tracking-tight leading-snug mb-4">
              Pool-Campus Recruitment for Companies
            </h1>

            <h2 className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
              Multi-college fresher hiring through shared campus recruitment drives.
            </h2>

          </header>

          {/* Services - Square Cards with Bullet Points */}
          <section className="mb-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {serviceData.map((service) => {
                const IconComponent = service.icon;
                return (
                  <div
                    key={service.id}
                    className="group relative bg-white/90 backdrop-blur-sm border border-gray-100 rounded-lg shadow p-6 hover:shadow-md transition-all duration-200 flex flex-col min-h-[320px]"
                  >
                    {/* Purple hover overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-[#667eea]/0 to-[#764ba2]/0 group-hover:from-[#667eea]/5 group-hover:to-[#764ba2]/5 rounded-lg transition-all duration-300"></div>
                    
                    {/* Purple border on hover */}
                    <div className="absolute inset-0 border-2 border-transparent group-hover:border-[#667eea]/20 rounded-lg transition-all duration-300"></div>
                    
                    <div className="relative z-10 h-full flex flex-col">
                      <div className="inline-flex items-center justify-center w-10 h-10 bg-gradient-to-br from-[#667eea]/20 to-[#764ba2]/20 rounded-lg mb-4">
                        <IconComponent className="h-5 w-5 text-[#667eea]" />
                      </div>
                      
                      <h3 className="text-lg font-bold text-gray-900 mb-4">
                        {service.title}
                      </h3>
                      
                      <ul className="space-y-3 flex-grow">
                        {service.bullets.map((bullet, index) => (
                          <li key={index} className="flex items-start">
                            <div className="flex-shrink-0 w-1.5 h-1.5 bg-[#667eea] rounded-full mt-2 mr-3"></div>
                            <span className="text-gray-600 text-sm">{bullet}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* CTA Section */}
          <section className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
            <button
              onClick={onRequestInfoClick}
              className="bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white px-8 py-3.5 rounded-lg font-medium hover:shadow-lg hover:shadow-[#667eea]/30 transition-all text-base flex items-center justify-center gap-2"
            >
              <span>Register Now</span>
              {/* <span className="text-sm opacity-80">– Start Pool-Campus Hiring</span> */}
            </button>

            <button
              onClick={onRegisterClick}
              className="bg-gray-800 text-white px-8 py-3.5 rounded-lg font-medium hover:bg-gray-900 hover:shadow-lg transition-colors text-base flex items-center justify-center gap-2"
            >
              <span>Request Info</span>
              {/* <span className="text-sm opacity-80">– Learn How Pool-Campus Hiring Works</span> */}
            </button>
          </section>

        </div>
      </div>
    </>
  );
}