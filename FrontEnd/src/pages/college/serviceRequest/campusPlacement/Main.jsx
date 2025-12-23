import ServiceCard from './ServiceCard';
import {
  Building2,
  Target,
  Users,
  Sparkles,
  ArrowRight,
  Info,
  FileText
} from 'lucide-react';

const serviceData = [
  {
    id: 1,
    title: "Campus Presence",
    description:
      "Host webinars, workshops and campus talks that put your brand in front of students early. Build trust and familiarity where future talent is being shaped.",
    color: "blue",
    iconElement: <Building2 className="w-7 h-7 text-[#3b82f6]" />
  },
  {
    id: 2,
    title: "Engagement Kits",
    description:
      "Leave a lasting impression with customized merchandise, digital experiences and co-branded touchpoints. Make every interaction with your brand memorable.",
    color: "pink",
    iconElement: <Target className="w-7 h-7 text-[#ec4899]" />
  },
  {
    id: 3,
    title: "Digital Reach",
    description:
      "Amplify your employer story through curated content, social media campaigns and job spotlight promotions targeted directly at students.",
    color: "green",
    iconElement: <Users className="w-7 h-7 text-[#10b981]" />
  }
];

export default function MainPage({ onRegisterClick, onRequestInfoClick }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0e6f7]/60 via-[#d4e8f9]/55 to-[#cff7ea]/60">

      {/* Background blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#fbcfe8]/20 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -left-20 w-60 h-60 bg-[#93c5fd]/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-1/3 w-40 h-40 bg-[#a7f3d0]/20 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 container mx-auto px-4 pt-16 max-w-6xl">

        {/* Header */}
        <header className="mb-12 text-center">
          {/* Icon + Heading in one row */}
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="w-14 h-14 flex items-center justify-center rounded-2xl bg-gradient-to-br from-[#93c5fd]/30 to-[#3b82f6]/20">
              <Sparkles className="w-7 h-7 text-[#3b82f6]" />
            </div>

            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#3b82f6] to-[#8b5cf6] bg-clip-text text-transparent">
              Revolutionizing Campus Recruitment
            </h1>
          </div>

          {/* Text below */}
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Our solutions connect colleges with skilled employers, enable targeted
            engagement, and amplify employer branding through data-driven strategies.
          </p>
        </header>

        {/* Cards */}
        <section className="mb-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {serviceData.map((service) => (
              <div
                key={service.id}
                className="transition-all duration-300 hover:-translate-y-2"
              >
                <div className="bg-white/90 backdrop-blur-sm border border-white/60 rounded-2xl shadow-lg p-7 h-full hover:shadow-xl transition-all">
                  
                  <div
                    className={`mb-5 w-14 h-14 rounded-2xl flex items-center justify-center ${
                      service.color === 'blue'
                        ? 'bg-gradient-to-br from-[#93c5fd]/30 to-[#3b82f6]/20'
                        : service.color === 'pink'
                        ? 'bg-gradient-to-br from-[#f9a8d4]/30 to-[#ec4899]/20'
                        : 'bg-gradient-to-br from-[#a7f3d0]/30 to-[#10b981]/20'
                    }`}
                  >
                    {service.iconElement}
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {service.title}
                  </h3>

                  <p className="text-gray-600 text-sm leading-relaxed">
                    {service.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Buttons – immediately after cards */}
        <section className="flex flex-col sm:flex-row justify-center items-center gap-5 pb-10">
          <button
            onClick={onRequestInfoClick}
            className="group flex items-center gap-3 px-9 py-4 bg-gradient-to-r from-[#93c5fd] to-[#3b82f6] text-white rounded-2xl text-lg font-semibold hover:shadow-lg hover:shadow-[#93c5fd]/40 transition-all"
          >
            <Info className="w-5 h-5" />
            Request Info
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={onRegisterClick}
            className="group flex items-center gap-3 px-9 py-4 bg-white/90 backdrop-blur-sm border border-white/60 text-gray-800 rounded-2xl text-lg font-semibold hover:bg-white hover:shadow-lg transition-all"
          >
            <FileText className="w-5 h-5" />
            Register Now
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </section>

      </div>
    </div>
  );
}
