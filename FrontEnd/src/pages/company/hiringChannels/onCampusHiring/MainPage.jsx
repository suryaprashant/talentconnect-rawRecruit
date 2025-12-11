import ServiceCard from './ServiceCard';
import { Building2, Users, Sparkles } from 'lucide-react';

const serviceData = [
  {
    id: 1,
    title: "Partnerships",
    description: "At TalentConnect, we offer seamless on-campus hiring solutions in partnership with universities and colleges providing comprehensive end-to-end recruitment services. Our tailored approach ensures efficient hiring processes, connecting students directly with top employers. Let us enhance your campus recruitment with our expertise and extensive network.",
    icon: <Building2 className="h-10 w-10" />
  },
  {
    id: 2,
    title: "Talent Pipeline",
    description: "At TalentConnect we provide access to a steady pipeline of pre-screened candidates and a continuous supply of qualified talent. Our rigorous screening process guarantees that only the best candidates are presented. Streamline your hiring process. Rely on our expertise to maintain a robust talent pipeline for your organization needs.",
    icon: <Users className="h-10 w-10" />
  },
  {
    id: 3,
    title: "AI Talent Match",
    description: "At TalentConnect AI Talent Match utilizes advanced algorithms to intelligently connect employers with the most suitable candidates, ensuring you have a continuous supply of qualified talent. Our AI-driven screening process guarantees that only the best candidates are presented, streamlining your hiring process. Rely on our expertise to maintain your talent pipeline.",
    icon: <Sparkles className="h-10 w-10" />
  }
];

export default function MainPage({ onRegisterClick, onRequestInfoClick }) {
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
            OnCampus Connect: Hire Smarter
          </h1>
          <p className="text-md text-gray-600 max-w-2xl mx-auto">
            Our OnCampus Service brings career opportunities directly to students with top employers through campus recruitment drives and job events.
          </p>
        </header>

        {/* Services Section */}
        <section className="mb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {serviceData.map((service) => (
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
            onClick={onRequestInfoClick}
            className="bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white px-8 py-3 rounded-lg font-medium hover:shadow-lg hover:shadow-[#667eea]/30 transition-all duration-200"
          >
            Register Now
          </button>
          <button 
            onClick={onRegisterClick}
            className="bg-gray-800 text-white px-8 py-3 rounded-lg font-medium hover:bg-gray-900 transition-colors"
          >
            Request Info
          </button>
        </section>
      </div>
    </div>
  );
}