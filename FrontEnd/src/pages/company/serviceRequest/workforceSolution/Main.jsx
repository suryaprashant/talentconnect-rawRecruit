import { Building2, Users, Search, CheckCircle, Briefcase } from "lucide-react";

// Sample service card data
const serviceData = [
  {
    id: 1,
    title: "Recruitment",
    description:
      "Collaborate with companies and recruit qualified candidates for contract, RPO, and permanent positions.",
    icon: <Users className="h-6 w-6" />
  },
  {
    id: 2,
    title: "Staffing",
    description:
      "A results-driven staffing service that matches skilled professionals with the right opportunities.",
    icon: <Search className="h-6 w-6" />
  },
  {
    id: 3,
    title: "Thorough Candidate Evaluation",
    description:
      "Rigorous screening to assess skills, experience, and role-fit—reducing hiring risks and improving long-term success.",
    icon: <CheckCircle className="h-6 w-6" />
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
        "This is an additional service that can be dynamically added to showcase our expanding capabilities.",
      icon: <Briefcase className="h-6 w-6" />
    });
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#667eea]/5 via-[#f093fb]/5 to-[#764ba2]/5 overflow-hidden">
      <div className="container mx-auto px-4 max-w-6xl flex flex-col py-4">

        {/* Header */}
        <header className="mb-8 pt-2 text-center">
          <div className="flex items-center justify-center gap-3">
            <div className="p-2 bg-gradient-to-br from-[#667eea]/20 to-[#764ba2]/20 rounded-lg">
              <Building2 className="h-6 w-6 text-[#667eea]" />
            </div>

            <h1 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent">
              Elevate Your Talent Acquisition
            </h1>
          </div>

          <p className="text-sm text-gray-600 mt-4 max-w-xl mx-auto">
            Discover workforce solutions that simplify hiring and connect you
            with exceptional talent.
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

        {/* CTA */}
        <section className="flex justify-center pt-2 pb-3">
          <button
            onClick={onRegisterClick}
            className="bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white px-8 py-3.5 rounded-lg font-medium hover:shadow-lg hover:shadow-[#667eea]/30 transition-all text-base"
          >
            Request Info
          </button>
        </section>

      </div>
    </div>
  );
}