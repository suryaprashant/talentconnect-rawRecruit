import ServiceCard from './ServiceCard';
import { Building2, Users, Zap, Target } from 'lucide-react';

const serviceData = [
  {
    id: 1,
    title: "Unified Access",
    description: "Engage with pre-vetted students from multiple colleges in a single hiring event, giving your requirement team access to a wider and more diverse talent pool without the hassle of coordinating multiple campus visits.",
    icon: <Users className="h-10 w-10" />
  },
  {
    id: 2,
    title: "Smart Efficiency",
    description: "Save valuable time, effort and costs by consolidating hiring efforts into one well-managed event. Streamline interviews, assessments, and selections while optimizing your recruitment budget.",
    icon: <Zap className="h-10 w-10" />
  },
  {
    id: 3,
    title: "Amplified Branding",
    description: "Strengthen your employer brand by showcasing your company to students across campuses at once. Build recognition, trust and recall among fresh talent through a single impactful engagement.",
    icon: <Target className="h-10 w-10" />
  }
];

export default function MainPage({ onRegisterClick, onRequestInfoClick }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#667eea]/5 via-[#f093fb]/5 to-[#764ba2]/5">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header Section */}
        <header className="mb-12 text-center">
          <div className="flex items-center justify-center mb-6">
            <div className="p-4 bg-gradient-to-br from-[#667eea]/20 to-[#764ba2]/20 rounded-xl">
              <Building2 className="h-8 w-8 text-[#667eea]" />
            </div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent">
            Pool Campus Connect: Hire Bigger
          </h1>
          <p className="text-md text-gray-600 max-w-2xl mx-auto mt-4">
            Tap into diverse talent from multiple institutions through one powerful drive. Pool Campus Connect brings students from several colleges together, making it easier for companies to conduct centralized hiring drives that are time-saving, cost-efficient, and great for brand visibility.
          </p>
        </header>

        {/* Services Section */}
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

        {/* CTA Section */}
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