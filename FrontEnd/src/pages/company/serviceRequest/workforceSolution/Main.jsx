import ServiceCard from "./ServiceCard";
import { Building2, Users, Sparkles, Search, CheckCircle, Briefcase } from 'lucide-react';

// Main Landing Page Component
export default function MainPage({ onRegisterClick, numCards, addCard, onRequestInfoClick }) {
  // Show only the first numCards from serviceData
  const visibleCards = serviceData.slice(0, numCards);

  // For demo purposes, add extra cards if needed
  while (visibleCards.length < numCards) {
    visibleCards.push({
      id: visibleCards.length + 1,
      title: `Additional Service ${visibleCards.length + 1}`,
      description: "This is an additional service that can be dynamically added to showcase our expanding capabilities.",
      icon: <Briefcase className="h-10 w-10" />
    });
  }

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
            Elevate Your Talent Acquisition: Premier Workforce Solutions
          </h1>
          <p className="text-md text-gray-600 max-w-2xl mx-auto">
            Discover top-tier workforce solutions designed to streamline your hiring process and connect you with exceptional talent.
          </p>
        </header>

        {/* Services Section */}
        <section className="mb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {visibleCards.map((service) => (
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
            onClick={onRegisterClick}
            className="bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white px-8 py-3 rounded-lg font-medium hover:shadow-lg hover:shadow-[#667eea]/30 transition-all duration-200"
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
    title: "Recruitment",
    description: "Collaborate with companies and recruit qualified candidates for contract, RPO, and permanent positions.",
    icon: <Users className="h-10 w-10" />
  },
  {
    id: 2,
    title: "Staffing",
    description: "Talent Connect is a staffing firm that provides a personalized, results-driven professional service. Its goal is to match skilled candidates with appropriate positions.",
    icon: <Search className="h-10 w-10" />
  },
  {
    id: 3,
    title: "Thorough Candidate Evaluation",
    description: "Our rigorous screening and evaluation processes are designed to identify candidates' qualifications, technical skills, experience, and potential for your roles. This meticulous approach reduces hiring risks and increases the likelihood of successful long-term placements.",
    icon: <CheckCircle className="h-10 w-10" />
  }
];