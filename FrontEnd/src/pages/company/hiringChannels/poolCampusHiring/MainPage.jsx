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

      <div className="min-h-screen bg-gradient-to-br from-[#143694]/5 via-[#f093fb]/5 to-[#1e4ed8]/5 overflow-hidden">
        {/* <div className="container mx-auto px-4 pt-8 max-w-6xl">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 px-6 py-5 mb-2">
            <div className="flex items-center gap-3 mb-3">
              <h2 className="text-3xl ml-1 mt-2 font-bold text-primaryBrand">Hiring Channels</h2>
            </div>
          </div>
        </div> */}
        <div className="container mx-auto px-4 max-w-6xl flex flex-col py-4">

          {/* Header */}
          <header className="bg-white rounded-2xl shadow-sm border border-gray-200 px-6 py-6 mb-8">

            {/* Top Section */}
            <div className="mb-4">
              <h1 className="text-xl md:text-2xl font-semibold text-[#143694] tracking-tight leading-snug">
                Pool-Campus Recruitment
              </h1>
              <p className="text-gray-600 text-sm md:text-base">
                Multi-college fresher hiring through shared campus recruitment drives
              </p>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-2 border-gray-200 pt-0">

              <button 
                onClick={() => navigate('/hiring-channels/on-campus-hiring')}
                className="px-4 py-1.5 text-gray-600 hover:text-[#1a3a8a] hover:bg-gray-100 rounded-full text-sm transition-all"
              >
                On-campus
              </button>

              {/* Active */}
              <button 
                className="px-4 py-1.5 bg-[#1a3a8a] text-white rounded-full text-sm font-medium shadow-sm"
              >
                Pool Campus
              </button>

              <button 
                onClick={() => navigate('/hiring-channels/off-campus-hiring')}
                className="px-4 py-1.5 text-gray-600 hover:text-[#1a3a8a] hover:bg-gray-100 rounded-full text-sm transition-all"
              >
                Off-campus
              </button>

              <button 
                onClick={() => navigate('/hiring-channels/post-an-internship')}
                className="px-4 py-1.5 text-gray-600 hover:text-[#1a3a8a] hover:bg-gray-100 rounded-full text-sm transition-all"
              >
                Internship
              </button>

            </div>

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
                    <div className="absolute inset-0 bg-gradient-to-br from-[#143694]/0 to-[#1e4ed8]/0 group-hover:from-[#143694]/5 group-hover:to-[#1e4ed8]/5 rounded-lg transition-all duration-300"></div>
                    
                    {/* Purple border on hover */}
                    <div className="absolute inset-0 border-2 border-transparent group-hover:border-[#143694]/20 rounded-lg transition-all duration-300"></div>
                    
                    <div className="relative z-10 h-full flex flex-col">
                      <div className="inline-flex items-center justify-center w-10 h-10 bg-gradient-to-br from-[#143694]/20 to-[#1e4ed8]/20 rounded-lg mb-4">
                        <IconComponent className="h-5 w-5 text-[#143694]" />
                      </div>
                      
                      <h3 className="text-lg font-bold text-gray-900 mb-4">
                        {service.title}
                      </h3>
                      
                      <ul className="space-y-3 flex-grow">
                        {service.bullets.map((bullet, index) => (
                          <li key={index} className="flex items-start">
                            <div className="flex-shrink-0 w-1.5 h-1.5 bg-[#143694] rounded-full mt-2 mr-3"></div>
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
              className="bg-gradient-to-r from-[#143694] to-[#1e4ed8] text-white px-8 py-3.5 rounded-lg font-medium hover:shadow-lg hover:shadow-[#143694]/30 transition-all text-base flex items-center justify-center gap-2"
            >
              <span>Register Now</span>
              {/* <span className="text-sm opacity-80">– Start Pool-Campus Hiring</span> */}
            </button>

            <button
              onClick={onRegisterClick}
              className="bg-[#1e4ed8] text-white px-8 py-3.5 rounded-lg font-medium hover:bg-primaryBrand hover:shadow-lg transition-colors text-base flex items-center justify-center gap-2"
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