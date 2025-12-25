import React from 'react';
import { Building2, Users, Zap, Target } from 'lucide-react';

const serviceData = [
  {
    id: 1,
    title: "Unified Access",
    description:
      "Engage with pre-vetted students from multiple colleges in a single hiring event, giving your requirement team access to a wider and more diverse talent pool without the hassle of coordinating multiple campus visits.",
    icon: Users,
  },
  {
    id: 2,
    title: "Smart Efficiency",
    description:
      "Save valuable time, effort and costs by consolidating hiring efforts into one well-managed event. Streamline interviews, assessments, and selections while optimizing your recruitment budget.",
    icon: Zap,
  },
  {
    id: 3,
    title: "Amplified Branding",
    description:
      "Strengthen your employer brand by showcasing your company to students across campuses at once. Build recognition, trust and recall among fresh talent through a single impactful engagement.",
    icon: Target,
  },
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
            Tap into diverse talent from multiple institutions through one powerful drive. Pool Campus Connect enables centralized hiring that is efficient, cost-effective, and impactful.
          </p>
        </header>

        {/* Services - Square Cards with Hover */}
        <section className="mb-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {serviceData.map((service) => {
              const IconComponent = service.icon;
              return (
                <div
                  key={service.id}
                  className="group relative bg-white/90 backdrop-blur-sm border border-gray-100 rounded-lg shadow p-6 hover:shadow-md transition-all duration-200 flex flex-col h-96"
                >
                  {/* Purple hover overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[#667eea]/0 to-[#764ba2]/0 group-hover:from-[#667eea]/5 group-hover:to-[#764ba2]/5 rounded-lg transition-all duration-300"></div>
                  
                  {/* Purple border on hover */}
                  <div className="absolute inset-0 border-2 border-transparent group-hover:border-[#667eea]/20 rounded-lg transition-all duration-300"></div>
                  
                  <div className="relative z-10 h-full flex flex-col">
                    <div className="inline-flex items-center justify-center w-10 h-10 bg-gradient-to-br from-[#667eea]/20 to-[#764ba2]/20 rounded-lg mb-4">
                      <IconComponent className="h-5 w-5 text-[#667eea]" />
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