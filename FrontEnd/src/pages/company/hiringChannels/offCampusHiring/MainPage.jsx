import React from 'react';
import { Building2, Target, Users, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function MainPage({ onRegisterClick, onRequestInfoClick }) {
  const navigate = useNavigate();
  // SEO Card Content
  const serviceData = [
    {
      id: 1,
      title: "Skill-Based Hiring",
      bullets: [
        "Focus on skills over resumes",
        "Evaluate candidates through profiles and assessments",
        "Identify job-ready freshers efficiently",
        "Improve off-campus hiring quality"
      ],
      icon: Target,
    },
    {
      id: 2,
      title: "Application Management",
      bullets: [
        "Centralize off-campus job applications",
        "Screen and shortlist candidates efficiently",
        "Track hiring progress in one place",
        "Improve recruitment visibility and control"
      ],
      icon: Users,
    },
    {
      id: 3,
      title: "Targeted Outreach",
      bullets: [
        "Launch role-specific off-campus hiring drives",
        "Reach candidates by role, location, or experience",
        "Engage a wider pool of fresh graduates",
        "Improve response and hiring efficiency"
      ],
      icon: Zap,
    },
  ];

  return (
    <>
      {/* Meta Title and Description */}
      <head>
        <title>Off-Campus Recruitment for Companies | RawRecruit</title>
        <meta 
          name="description" 
          content="Hire freshers and entry-level talent beyond campus boundaries through structured off-campus recruitment with RawRecruit." 
        />
      </head>

      <div className="min-h-screen bg-gradient-to-br from-[#143694]/5 via-[#f093fb]/5 to-[#1e4ed8]/5 overflow-hidden">
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
              
              <button 
                onClick={() => navigate('/hiring-channels/pool-campus-hiring')}
                className="px-2 py-2 text-gray-500 hover:text-[#1a3a8a] font-medium text-sm transition-all"
              >
                Pool Campus Hiring
              </button>

              {/* Off-campus: Active Highlight */}
              <button 
                className="px-6 py-2 bg-[#1a3a8a] text-white rounded-full font-medium text-sm transition-all shadow-md"
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
              Off-Campus Recruitment for Companies
            </h1>

            <h2 className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
              Flexible fresher hiring beyond campuses through open recruitment channels.
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
              {/* <span className="text-sm opacity-80">– Start Off-Campus Hiring</span> */}
            </button>

            <button
              onClick={onRegisterClick}
              className="bg-[#1e4ed8] text-white px-8 py-3.5 rounded-lg font-medium hover:bg-primaryBrand hover:shadow-lg transition-colors text-base flex items-center justify-center gap-2"
            >
              <span>Request Info</span>
              {/* <span className="text-sm opacity-80">– Learn How Off-Campus Hiring Works</span> */}
            </button>
          </section>

        </div>
      </div>
    </>
  );
}