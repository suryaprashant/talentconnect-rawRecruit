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
    icon: <Target className="h-6 w-6" />
  },
  {
    id: 2,
    title: "Engagement Kits",
    description:
      "Leave a lasting impression with customized merchandise, digital experiences and co-branded touchpoints. Make every interaction with your brand memorable.",
    icon: <Users className="h-6 w-6" />
  },
  {
    id: 3,
    title: "Digital Reach",
    description:
      "Amplify your employer story through curated content, social media campaigns and job spotlight promotions targeted directly at students.",
    icon: <Building2 className="h-6 w-6" />
  }
];

export default function MainPage({ onRegisterClick, onRequestInfoClick }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0e6f7]/60 via-[#d4e8f9]/55 to-[#cff7ea]/60 overflow-hidden">

      {/* Background Blobs - EXACT SAME */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#fbcfe8]/20 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -left-20 w-60 h-60 bg-[#93c5fd]/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-1/3 w-40 h-40 bg-[#a7f3d0]/20 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 container mx-auto px-4 max-w-6xl flex flex-col py-4">

        {/* Header - EXACT SAME */}
        <header className="mb-8 pt-2 text-center">
          <div className="flex items-center justify-center gap-3">
            <div className="p-2 bg-gradient-to-br from-[#93c5fd]/30 to-[#3b82f6]/20 rounded-lg">
              <Sparkles className="h-6 w-6 text-[#3b82f6]" />
            </div>
            <h1 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-[#3b82f6] to-[#8b5cf6] bg-clip-text text-transparent">
              Campus Branding: Make Your Campus the Talent Hub
            </h1>
          </div>

          <p className="text-sm text-gray-600 mt-4 max-w-xl mx-auto">
            Attract, engage and retain top talent right from the source. Campus Branding helps your company build long-term relationships with students and establish recall among leaders.
          </p>
        </header>

        {/* Services Section - EXACT SAME square cards */}
        <section className="mb-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {serviceData.map((service) => (
              <div
                key={service.id}
                className="group relative bg-white/90 backdrop-blur-sm border border-white/60 rounded-lg shadow-lg p-6 hover:shadow-xl transition-all duration-300 flex flex-col h-96"
              >
                {/* Blue hover overlay - EXACT SAME */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#93c5fd]/0 to-[#3b82f6]/0 group-hover:from-[#93c5fd]/5 group-hover:to-[#3b82f6]/5 rounded-lg transition-all duration-300"></div>
                
                {/* Blue border on hover - EXACT SAME */}
                <div className="absolute inset-0 border-2 border-transparent group-hover:border-[#3b82f6]/20 rounded-lg transition-all duration-300"></div>
                
                <div className="relative z-10 h-full flex flex-col">
                  <div className="inline-flex items-center justify-center w-10 h-10 bg-gradient-to-br from-[#93c5fd]/30 to-[#3b82f6]/20 rounded-lg mb-4">
                    <div className="text-[#3b82f6]">
                      {service.icon}
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-gray-900 mb-3">
                    {service.title}
                  </h3>

                  <p className="text-gray-600 text-sm leading-relaxed flex-grow overflow-y-auto">
                    {service.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA - EXACT SAME buttons with swapped positions */}
        <section className="flex justify-center gap-4 pt-2 pb-3">
          {/* Blue gradient Register Now button on LEFT - EXACT SAME */}
          <button
            onClick={onRegisterClick}
            className="group flex items-center gap-2 bg-gradient-to-r from-[#93c5fd] to-[#3b82f6] text-white px-8 py-3.5 rounded-lg font-medium hover:shadow-lg hover:shadow-[#93c5fd]/40 transition-all text-base"
          >
            <FileText className="w-5 h-5" />
            Register Now
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
          
          {/* White Request Info button on RIGHT - EXACT SAME */}
          <button
            onClick={onRequestInfoClick}
            className="group flex items-center gap-2 bg-white/90 backdrop-blur-sm border border-white/60 text-gray-800 px-8 py-3.5 rounded-lg font-medium hover:bg-white hover:shadow-lg transition-all text-base"
          >
            <Info className="w-5 h-5" />
            Request Info
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </section>

      </div>
    </div>
  );
}
