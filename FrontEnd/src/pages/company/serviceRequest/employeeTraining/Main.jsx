import ServiceCard from './ServiceCard';
import { Target, Zap, Users, GraduationCap } from 'lucide-react';

const serviceData = [
  {
    id: 1,
    title: "Custom Modules",
    description: "Design training programs aligned to your company's exact needs—technical skills, focus areas, or industry-specific know-how. Delivering your way online, hybrid, or in-person.",
    icon: <Target className="h-10 w-10" />
  },
  {
    id: 2,
    title: "Faster Onboarding",
    description: "Reduce ramp-up time for new hires by preparing them even before Day 1. Build confidence and capability with pre-joining or induction training.",
    icon: <Zap className="h-10 w-10" />
  },
  {
    id: 3,
    title: "Campus Enablement",
    description: "Offer colleges value-added programs that get students job ready, improve placement outcomes while aligning candidates to match your hiring standards.",
    icon: <GraduationCap className="h-10 w-10" />
  }
];

export default function MainPage({ onRegisterClick, onRequestInfoClick }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#667eea]/5 via-[#f093fb]/5 to-[#764ba2]/5">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <header className="mb-12 text-center">
          <div className="flex items-center justify-center mb-6">
            <div className="p-4 bg-gradient-to-br from-[#667eea]/20 to-[#764ba2]/20 rounded-xl">
              <Users className="h-8 w-8 text-[#667eea]" />
            </div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent mb-4">
            OnDemand Training: Upskill with Purpose
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Bridge the gap between potential and performance with tailored training programs. 
            OnDemand Training empowers companies to offer job ready learning experiences for 
            students or newly hired employees.
          </p>
        </header>

        <section className="mb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {serviceData.map((service) => (
              <div 
                key={service.id} 
                className="bg-white/90 backdrop-blur-sm border border-gray-100 rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-200"
              >
                <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-[#667eea]/20 to-[#764ba2]/20 rounded-lg mb-4">
                  <div className="text-[#667eea]">
                    {service.icon}
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {service.title}
                </h3>
                
                <p className="text-gray-600 text-sm leading-relaxed">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
          <button 
            onClick={onRequestInfoClick}
            className="bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white px-8 py-3 rounded-lg font-medium hover:shadow-lg hover:shadow-[#667eea]/30 transition-all duration-200"
          >
            Register Now
          </button>
          <button 
            onClick={onRegisterClick}
            className="bg-gray-800 text-white px-8 py-3 rounded-lg font-medium hover:bg-gray-900 transition-colors"
          >
            Request Info
          </button>
        </section>
      </div>
    </div>
  );
}