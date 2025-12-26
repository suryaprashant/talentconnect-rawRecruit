import {
  UsersIcon,
  Zap,
  TrendingUp,
  Sparkles,
  ArrowRight,
  Info,
  FileText
} from 'lucide-react';

const serviceData = [
  {
    id: 1,
    title: "Unified Access",
    description: "Engage with pre-vetted students from multiple colleges in a single hiring event, giving your recruitment team access to a wider and more diverse talent pool without coordinating multiple campus visits.",
    icon: <UsersIcon className="h-6 w-6 text-[#3b82f6]" />
  },
  {
    id: 2,
    title: "Smart Efficiency",
    description: "Save time, effort and costs by consolidating hiring into one well-managed event. Streamline interviews, assessments, and selections while optimizing your recruitment budget.",
    icon: <Zap className="h-6 w-6 text-[#3b82f6]" />
  },
  {
    id: 3,
    title: "Amplified Branding",
    description: "Showcase your company to students across campuses at once. Build recognition, trust and recall among fresh talent through a single impactful engagement.",
    icon: <TrendingUp className="h-6 w-6 text-[#3b82f6]" />
  }
];

export default function MainPage({ onRegisterClick, onRequestInfoClick }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0e6f7]/60 via-[#d4e8f9]/55 to-[#cff7ea]/60 overflow-hidden">

      {/* Background Blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#fbcfe8]/20 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -left-20 w-60 h-60 bg-[#93c5fd]/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-1/3 w-40 h-40 bg-[#a7f3d0]/20 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 container mx-auto px-4 max-w-6xl flex flex-col py-4">

        {/* Header */}
        <header className="mb-8 pt-2 text-center">
          <div className="flex items-center justify-center gap-3">
            <div className="p-2 bg-gradient-to-br from-[#93c5fd]/30 to-[#3b82f6]/20 rounded-lg">
              <Sparkles className="h-6 w-6 text-[#3b82f6]" />
            </div>
            <h1 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-[#3b82f6] to-[#8b5cf6] bg-clip-text text-transparent">
              Pool Campus Connect: Hire Bigger
            </h1>
          </div>

          <p className="text-sm text-gray-600 mt-4 max-w-xl mx-auto">
            Tap into diverse talent from multiple institutions through one powerful drive.
            Pool Campus Connect makes centralized hiring faster, cost-efficient, and
            impactful for employer branding.
          </p>
        </header>

        {/* Services Section - Square Cards with Blue Hover Effects */}
        <section className="mb-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {serviceData.map((service) => (
              <div
                key={service.id}
                className="group relative bg-white/90 backdrop-blur-sm border border-white/60 rounded-lg shadow-lg p-6 hover:shadow-xl transition-all duration-300 flex flex-col h-96"
              >
                {/* Blue hover overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#93c5fd]/0 to-[#3b82f6]/0 group-hover:from-[#93c5fd]/5 group-hover:to-[#3b82f6]/5 rounded-lg transition-all duration-300"></div>
                
                {/* Blue border on hover */}
                <div className="absolute inset-0 border-2 border-transparent group-hover:border-[#3b82f6]/20 rounded-lg transition-all duration-300"></div>
                
                <div className="relative z-10 h-full flex flex-col">
                  <div className="inline-flex items-center justify-center w-10 h-10 bg-gradient-to-br from-[#93c5fd]/30 to-[#3b82f6]/20 rounded-lg mb-4">
                    {service.icon}
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

        {/* CTA - Two buttons with CORRECTED redirection */}
        <section className="flex justify-center gap-4 pt-2 pb-3">
          {/* Blue gradient Register Now button on LEFT - Goes to onRegisterClick */}
          <button
            onClick={onRequestInfoClick}
            className="group flex items-center gap-2 bg-gradient-to-r from-[#93c5fd] to-[#3b82f6] text-white px-8 py-3.5 rounded-lg font-medium hover:shadow-lg hover:shadow-[#93c5fd]/40 transition-all text-base"
          >
            <FileText className="w-5 h-5" />
            Register Now
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
          
          {/* White Request Info button on RIGHT - Goes to onRequestInfoClick */}
          <button
            onClick={onRegisterClick}
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
