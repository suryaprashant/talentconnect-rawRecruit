import ServiceCard from './ServiceCard';
import { UsersIcon, Zap, TrendingUp, Sparkles, ArrowRight, Info, FileText } from 'lucide-react';

const serviceData = [
  {
    id: 1,
    title: "Unified Access",
    description: "Engage with pre-vetted students from multiple colleges in a single hiring event, giving your recruitment team access to a wider and more diverse talent pool without the hassle of coordinating multiple campus visits.",
    icon: "/images/custom-modules-icon.png",
    color: "blue",
    iconElement: <UsersIcon className="w-6 h-6" />
  },
  {
    id: 2,
    title: "Smart Efficiency",
    description: "Save valuable time, effort and costs by consolidating hiring efforts into one well-managed event. Streamline interviews, assessments, and selections while optimizing your recruitment budget.",
    icon: "",
    color: "pink",
    iconElement: <Zap className="w-6 h-6" />
  },
  {
    id: 3,
    title: "Amplified Branding",
    description: "Strengthen your employer brand by showcasing your company to students across campuses at once. Build recognition, trust and recall among fresh talent through a single impactful engagement.",
    icon: "/images/campus-enablement-icon.png",
    color: "green",
    iconElement: <TrendingUp className="w-6 h-6" />
  }
];

export default function MainPage({ onRegisterClick, onRequestInfoClick }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0e6f7]/60 via-[#d4e8f9]/55 to-[#cff7ea]/60">
      {/* Pastel blur background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#fbcfe8]/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 -left-20 w-60 h-60 bg-[#93c5fd]/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-1/3 w-40 h-40 bg-[#a7f3d0]/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/4 right-1/4 w-48 h-48 bg-[#c7d2fe]/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/3 left-1/4 w-56 h-56 bg-[#fde68a]/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 pt-20 max-w-6xl">
        {/* Header Section - Exactly as in the original structure */}
        <div className="mb-16 text-center">
    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#93c5fd]/30 to-[#3b82f6]/20 rounded-2xl mb-5">
      <Sparkles className="w-8 h-8 text-[#3b82f6]" />
    </div>
    <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#3b82f6] to-[#8b5cf6] bg-clip-text text-transparent mb-5">Pool Campus Connect: Hire Bigger</h1>
    <p className="text-lg text-gray-600 max-w-3xl mx-auto">
      Tap into diverse talent from multiple institutions through one powerful drive.<br />
      Pool Campus Connect brings students from several colleges together, making it easier for companies to conduct centralized hiring drives that are time-saving, cost-efficient, and great for brand visibility.
    </p>
  </div>

        {/* Services Section */}
        <section className="mb-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {serviceData.map((service) => (
              <div
                key={service.id}
                className="transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
              >
                <div className="bg-white/90 backdrop-blur-sm border border-white/50 rounded-2xl shadow-lg shadow-blue-50/50 overflow-hidden h-full hover:shadow-blue-100/50 transition-all duration-300">
                  <div className="p-8">
                    <div className={`mb-6 w-16 h-16 rounded-2xl flex items-center justify-center ${
                      service.color === 'blue' ? 'bg-gradient-to-br from-[#93c5fd]/30 to-[#3b82f6]/20' :
                      service.color === 'pink' ? 'bg-gradient-to-br from-[#f9a8d4]/30 to-[#ec4899]/20' :
                      'bg-gradient-to-br from-[#a7f3d0]/30 to-[#10b981]/20'
                    }`}>
                      {service.iconElement}
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{service.title}</h3>
                    <p className="text-gray-600 leading-relaxed mb-6">
                      {service.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Buttons */}
        <section className="flex flex-col sm:flex-row justify-center items-center gap-6 mb-12">
          <button
            onClick={onRequestInfoClick}
            className="group flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#93c5fd] to-[#3b82f6] text-white rounded-2xl hover:shadow-lg hover:shadow-[#93c5fd]/40 transition-all duration-200 text-lg font-medium"
          >
            <Info className="w-5 h-5" />
            Register Now
            <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-200" />
          </button>
          <button
            onClick={onRegisterClick}
            className="group flex items-center gap-3 px-8 py-4 bg-white/90 backdrop-blur-sm border border-white/50 text-gray-800 rounded-2xl hover:bg-white hover:shadow-lg transition-all duration-200 text-lg font-medium"
          >
            <FileText className="w-5 h-5" />
            Request Info
            <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-200" />
          </button>
        </section>
      </div>
    </div>
  );
}