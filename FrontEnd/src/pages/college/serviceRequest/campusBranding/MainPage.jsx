import ServiceCard from './ServiceCard';
import { Building2, Target, Users, Sparkles, ArrowRight, Info, FileText } from 'lucide-react';

const serviceData = [
  {
    id: 1,
    title: "Campus Presence",
    description: "Host webinars, workshops and campus talks that put your brand in front of students early. Build trust and familiarity where future talent is being shaped.",
    icon: "/images/custom-modules-icon.png",
    color: "blue",
    iconElement: <Building2 className="w-6 h-6" />
  },
  {
    id: 2,
    title: "Engagement Kits",
    description: "Leave a lasting impression with customized merchandise, digital experiences and co-branded touchpoints. Make every interaction with your brand memorable.",
    icon: "/images/onboarding-icon.png",
    color: "pink",
    iconElement: <Target className="w-6 h-6" />
  },
  {
    id: 3,
    title: "Digital Reach",
    description: "Amplify your employer story through curated content, social media campaigns and job spotlight promotions targeted directly at students.",
    icon: "/images/campus-enablement-icon.png",
    color: "green",
    iconElement: <Users className="w-6 h-6" />
  }
];

export default function MainPage({ onRequestInfoClick }) {
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
        {/* Header Section */}
        <header className="mb-12 text-center">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#3b82f6] to-[#8b5cf6] bg-clip-text text-transparent mb-4">
            Campus Branding: Make Your Campus the Talent Hub
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            Attract, engage and retain top talent right from the source.<br />
            Campus Branding helps your company build a lasting relationship with students, showcasing your brand and opportunities early on. Connect with the next generation of talent and establish a presence that resonates with future leaders.
          </p>
        </header>

        {/* Services Section */}
        <section className="mb-16">
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
            Request Info
            <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-200" />
          </button>
          <button
            className="group flex items-center gap-3 px-8 py-4 bg-white/90 backdrop-blur-sm border border-white/50 text-gray-800 rounded-2xl hover:bg-white hover:shadow-lg transition-all duration-200 text-lg font-medium"
          >
            <FileText className="w-5 h-5" />
            Register Now
            <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-200" />
          </button>
        </section>
      </div>
    </div>
  );
}