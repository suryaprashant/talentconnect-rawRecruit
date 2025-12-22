import { Target, Zap, GraduationCap, Users } from 'lucide-react';

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
        <header className="mb-6 pt-2 text-center">
          <div className="flex items-center justify-center gap-3">
            <div className="p-2 bg-gradient-to-br from-[#667eea]/20 to-[#764ba2]/20 rounded-lg">
              <Users className="h-6 w-6 text-[#667eea]" />
            </div>

            <h1 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent">
              OnDemand Training: Upskill with Purpose
            </h1>
          </div>

          <p className="text-sm text-gray-600 mt-3 max-w-xl mx-auto">
            Bridge the gap between potential and performance with tailored training programs. 
            OnDemand Training empowers companies to offer job ready learning experiences.
          </p>
        </header>

        {/* Services Section */}
        <section className="flex-grow mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {visibleCards.map((service) => (
              <div
                key={service.id}
                className="bg-white/90 backdrop-blur-sm border border-gray-100 rounded-xl shadow p-5 hover:shadow-lg transition-all duration-200 flex flex-col"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-[#667eea]/20 to-[#764ba2]/20 rounded-lg mb-3">
                  <div className="text-[#667eea]">
                    {service.icon}
                  </div>
                </div>

                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {service.title}
                </h3>

                <p className="text-gray-600 text-sm leading-relaxed flex-grow">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="flex justify-center gap-4 pt-2 pb-3">
          <button
            onClick={onRegisterClick}
            className="bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white px-8 py-3 rounded-lg font-medium hover:shadow-lg hover:shadow-[#667eea]/30 transition-all"
          >
            Request Info
          </button>
          <button
            onClick={onRequestInfoClick}
            className="bg-gray-800 text-white px-8 py-3 rounded-lg font-medium hover:bg-gray-900 transition-colors"
          >
            Register Now
          </button>
        </section>

      </div>
    </div>
  );
}

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