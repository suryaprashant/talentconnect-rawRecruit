import { Target, Zap, GraduationCap, Users } from 'lucide-react';

// Sample service card data
const serviceData = [
  {
    id: 1,
    title: "Custom Modules",
    description: "Design training programs aligned to your company's exact needs—technical skills, focus areas, or industry-specific know-how.",
    icon: <Target className="h-6 w-6" />
  },
  {
    id: 2,
    title: "Faster Onboarding",
    description: "Reduce ramp-up time for new hires by preparing them even before Day 1. Build confidence with pre-joining or induction training.",
    icon: <Zap className="h-6 w-6" />
  },
  {
    id: 3,
    title: "Campus Enablement",
    description: "Offer colleges value-added programs that get students job ready and align candidates to match your hiring standards.",
    icon: <GraduationCap className="h-6 w-6" />
  }
];

// Main Landing Page Component
export default function MainPage({
  onRegisterClick,
  numCards,
  addCard,
  onRequestInfoClick
}) {
  // Show only the first numCards from serviceData
  const visibleCards = serviceData.slice(0, numCards);

  // For demo purposes, add extra cards if needed
  while (visibleCards.length < numCards) {
    visibleCards.push({
      id: visibleCards.length + 1,
      title: `Additional Service ${visibleCards.length + 1}`,
      description:
        "This is an additional service that can be dynamically added to showcase our expanding training capabilities.",
      icon: <Users className="h-6 w-6" />
    });
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#667eea]/5 via-[#f093fb]/5 to-[#764ba2]/5 overflow-hidden">
      <div className="container mx-auto px-4 max-w-6xl flex flex-col py-4">

        {/* Header */}
        <header className="mb-8 pt-2 text-center">
          <div className="flex items-center justify-center gap-3">
            <div className="p-2 bg-gradient-to-br from-[#667eea]/20 to-[#764ba2]/20 rounded-lg">
              <Users className="h-6 w-6 text-[#667eea]" />
            </div>

            <h1 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent">
              OnDemand Training: Upskill with Purpose
            </h1>
          </div>

          <p className="text-sm text-gray-600 mt-4 max-w-xl mx-auto">
            Bridge the gap between potential and performance with tailored training programs. 
            OnDemand Training empowers companies to offer job ready learning experiences.
          </p>
        </header>

        {/* Services Section - Square Cards */}
        <section className="mb-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {visibleCards.map((service) => (
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
                    <div className="text-[#667eea]">
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

        {/* CTA - SWAPPED POSITIONS */}
        <section className="flex justify-center gap-4 pt-2 pb-3">
          {/* Purple button on LEFT */}
          <button
            onClick={onRequestInfoClick} // This is Register Now
            className="bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white px-8 py-3.5 rounded-lg font-medium hover:shadow-lg hover:shadow-[#667eea]/30 transition-all text-base"
          >
            Register Now
          </button>
          {/* Black button on RIGHT */}
          <button
            onClick={onRegisterClick} // This is Request Info
            className="bg-gray-800 text-white px-8 py-3.5 rounded-lg font-medium hover:bg-gray-900 transition-colors text-base"
          >
            Request Info
          </button>
        </section>

      </div>
    </div>
  );
}