import React from 'react';
import ServiceCard from './ServiceCard';
import { Building2, Users, Sparkles } from 'lucide-react';

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
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#667eea]/5 via-[#f093fb]/5 to-[#764ba2]/5 overflow-hidden">
      <div className="container mx-auto px-4 max-w-6xl flex flex-col py-4">
        
        {/* Header */}
        <header className="mb-8 pt-2">
          <div className="flex items-center justify-center gap-3">
            <div className="p-2 bg-gradient-to-br from-[#667eea]/20 to-[#764ba2]/20 rounded-lg">
              <Building2 className="h-6 w-6 text-[#667eea]" />
            </div>
            <h1 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent">
              Pool Campus Connect: Hire Bigger
            </h1>
          </div>
          <p className="text-center text-sm text-gray-600 mt-4 max-w-xl mx-auto">
            Our OnCampus Service brings career opportunities directly to students with top employers through campus recruitment drives and job events.
          </p>
        </header>

        {/* Services */}
        <section className="mb-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {serviceData.map((service) => {
              const IconComponent = service.icon;
              return (
                <div
                  key={service.id}
                  className="bg-white/90 backdrop-blur-sm border border-gray-100 rounded-lg shadow p-4 hover:shadow-md transition-all duration-200 h-full flex flex-col"
                >
                  <div className="inline-flex items-center justify-center w-10 h-10 bg-gradient-to-br from-[#667eea]/20 to-[#764ba2]/20 rounded-lg mb-3">
                    <IconComponent className="h-5 w-5 text-[#667eea]" />
                  </div>
                  <h3 className="text-base font-bold text-gray-900 mb-2">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {service.description}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* CTA */}
        <section className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
          <button
            onClick={onRequestInfoClick}
            className="bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white px-8 py-3.5 rounded-lg font-medium hover:shadow-lg transition-all text-base"
          >
            Register Now
          </button>
          <button
            onClick={onRegisterClick}
            className="bg-gray-800 text-white px-8 py-3.5 rounded-lg font-medium hover:bg-gray-900 transition-colors text-base"
          >
            Request Info
          </button>
        </section>

      </div>
    </div>
  );
}
