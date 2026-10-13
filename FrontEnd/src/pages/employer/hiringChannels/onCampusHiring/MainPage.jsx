import React from 'react';
import ServiceCard from './ServiceCard';
import { Building2, Users, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const serviceData = [
  {
    id: 1,
    title: "Partnerships",
    description: "At TalentConnect, we offer seamless on-campus hiring solutions in partnership with universities and colleges providing comprehensive end-to-end recruitment services. Our tailored approach ensures efficient hiring processes, connecting students directly with top employers. Let us enhance your campus recruitment with our expertise and extensive network.",
    icon: Building2
  },
  {
    id: 2,
    title: "Talent Pipeline",
    description: "At TalentConnect we provide access to a steady pipeline of pre-screened candidates and a continuous supply of qualified talent. Our rigorous screening process guarantees that only the best candidates are presented. Streamline your hiring process. Rely on our expertise to maintain a robust talent pipeline for your organization needs.",
    icon: Users
  },
  {
    id: 3,
    title: "AI Talent Match",
    description: "At TalentConnect AI Talent Match utilizes advanced algorithms to intelligently connect employers with the most suitable candidates, ensuring you have a continuous supply of qualified talent. Our AI-driven screening process guarantees that only the best candidates are presented, streamlining your hiring process. Rely on our expertise to maintain your talent pipeline.",
    icon: Sparkles
  }
];

export default function MainPage({ onRegisterClick, onRequestInfoClick }) {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#143694]/5 via-[#f093fb]/5 to-[#1e4ed8]/5 overflow-hidden">
      <div className="container mx-auto px-4 max-w-6xl flex flex-col py-4">
        
        {/* Header */}
        <header className="bg-white rounded-2xl shadow-sm border border-gray-200 px-6 py-6 mt-5 mb-8">

            {/* Top Row */}
            <div className="flex items-start justify-between flex-wrap gap-4 mb-4">

              {/* Left: Title */}
              <div>
                <h1 className="text-xl md:text-2xl font-semibold text-[#143694] tracking-tight leading-snug">
                  On-Campus Recruitment
                </h1>
                <p className="text-gray-600 text-sm md:text-base">
                  Hire top college talent through structured campus drives
                </p>
              </div>

            </div>

            {/* Tabs Row */}
            <div className="flex items-center gap-2 border-gray-200 pt-0">

              {/* Active */}
              <button className="px-4 py-1.5 bg-[#1a3a8a] text-white rounded-full text-sm font-medium shadow-sm">
                On-campus
              </button>

              {/* Others */}
              <button 
                onClick={() => navigate('/hiring-channels/pool-campus-hiring/employer')}
                className="px-4 py-1.5 text-gray-600 hover:text-[#1a3a8a] hover:bg-gray-100 rounded-full text-sm transition-all"
              >
                Pool Campus
              </button>

              <button 
                onClick={() => navigate('/hiring-channels/off-campus-hiring/employer')}
                className="px-4 py-1.5 text-gray-600 hover:text-[#1a3a8a] hover:bg-gray-100 rounded-full text-sm transition-all"
              >
                Off-campus
              </button>

              <button 
                onClick={() => navigate('/hiring-channels/post-an-internship/employer')}
                className="px-4 py-1.5 text-gray-600 hover:text-[#1a3a8a] hover:bg-gray-100 rounded-full text-sm transition-all"
              >
                Internship
              </button>

            </div>

          </header>

        {/* Services - Square Cards */}
        <section className="mb-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {serviceData.map((service) => {
              const IconComponent = service.icon;
              return (
                <div
                  key={service.id}
                  className="group relative bg-white/90 backdrop-blur-sm border border-gray-100 rounded-lg shadow p-6 hover:shadow-md transition-all duration-200 flex flex-col h-96" // Fixed height for square shape
                >
                  {/* Purple hover overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[#143694]/0 to-[#1e4ed8]/0 group-hover:from-[#143694]/5 group-hover:to-[#1e4ed8]/5 rounded-lg transition-all duration-300"></div>
                  
                  {/* Purple border on hover */}
                  <div className="absolute inset-0 border-2 border-transparent group-hover:border-[#143694]/20 rounded-lg transition-all duration-300"></div>
                  
                  <div className="relative z-10 h-full flex flex-col">
                    <div className="inline-flex items-center justify-center w-10 h-10 bg-gradient-to-br from-[#143694]/20 to-[#1e4ed8]/20 rounded-lg mb-4">
                      <IconComponent className="h-5 w-5 text-[#143694]" />
                    </div>
                    <h3 className="text-base font-bold text-gray-900 mb-3">
                      {service.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed flex-grow overflow-y-auto">
                      {service.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* CTA */}
        <section className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
          <button
            onClick={onRequestInfoClick}
            className="bg-gradient-to-r from-[#143694] to-[#1e4ed8] text-white px-8 py-3.5 rounded-lg font-medium hover:shadow-lg transition-all text-base"
          >
            Register Now
          </button>
          <button
            onClick={onRegisterClick}
            className="bg-[#1e4ed8] text-white px-8 py-3.5 rounded-lg font-medium hover:bg-primaryBrand hover:shadow-lg transition-colors text-base flex items-center justify-center gap-2"
          >
            Request Info
          </button>
        </section>

      </div>
    </div>
  );
}