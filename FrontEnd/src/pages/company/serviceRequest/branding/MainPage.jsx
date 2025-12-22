import { Building2, Target, Users, Globe } from 'lucide-react';

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
        "This is an additional employer branding service that can be dynamically added to showcase our expanding capabilities.",
      icon: <Building2 className="h-6 w-6" />
    });
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#667eea]/5 via-[#f093fb]/5 to-[#764ba2]/5 overflow-hidden">
      <div className="container mx-auto px-4 max-w-6xl flex flex-col py-4">

        {/* Header */}
        <header className="mb-6 pt-2 text-center">
          <div className="flex items-center justify-center gap-3">
            <div className="p-2 bg-gradient-to-br from-[#667eea]/20 to-[#764ba2]/20 rounded-lg">
              <Building2 className="h-6 w-6 text-[#667eea]" />
            </div>

            <h1 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent">
              Employer Branding: Be the brand they want to work for
            </h1>
          </div>

          <p className="text-sm text-gray-600 mt-3 max-w-xl mx-auto">
            Stand out in a competitive hiring market by building strong brand recall among students and early-career professionals.
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
        <section className="flex justify-center pt-2 pb-3">
          <button
            onClick={onRegisterClick}
            className="bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white px-8 py-3 rounded-lg font-medium hover:shadow-lg hover:shadow-[#667eea]/30 transition-all"
          >
            Request Info
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
    title: "Campus Presence",
    description: "Host webinars, workshops and campus talks that put your brand in front of students early. Build trust and familiarity where future talent is being shaped.",
    icon: <Target className="h-6 w-6" />
  },
  {
    id: 2,
    title: "Engagement Kits",
    description: "Leave a lasting impression with customized merchandise, digital experiences and co-branded touchpoints. Make every interaction memorable.",
    icon: <Users className="h-6 w-6" />
  },
  {
    id: 3,
    title: "Digital Reach",
    description: "Amplify your employer story through curated content, social media campaigns and job spotlight promotions—targeted at students and early-career professionals.",
    icon: <Globe className="h-6 w-6" />
  }
];