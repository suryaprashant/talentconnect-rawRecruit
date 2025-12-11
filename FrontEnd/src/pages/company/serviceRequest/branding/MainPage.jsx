import ServiceCard from './ServiceCard';
import { Building2, Target, Users, Globe } from 'lucide-react';

const serviceData = [
  {
    id: 1,
    title: "Campus Presence",
    description: "Host webinars, workshops and campus talks that put your brand in front of students early. Build trust and familiarity where future talent is being shaped.",
    icon: <Target className="h-10 w-10" />
  },
  {
    id: 2,
    title: "Engagement Kits",
    description: "Leave a lasting impression with customized merchandise, digital experiences and co-branded touchpoints. Make every interaction with your brand memorable.",
    icon: <Users className="h-10 w-10" />
  },
  {
    id: 3,
    title: "Digital Reach",
    description: "Amplify your employer story through curated content, social media campaigns and job spotlight promotions—targeted directly at students and early-career professionals.",
    icon: <Globe className="h-10 w-10" />
  }
];

export default function MainPage({ onRegisterClick, onRequestInfoClick }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#667eea]/5 via-[#f093fb]/5 to-[#764ba2]/5">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header Section - Exactly like workforce solution */}
        <header className="mb-12 text-center">
          <div className="flex items-center justify-center mb-6">
            <div className="p-4 bg-gradient-to-br from-[#667eea]/20 to-[#764ba2]/20 rounded-xl">
              <Building2 className="h-8 w-8 text-[#667eea]" />
            </div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent mb-4">
            Employer Branding: Be the brand they want to work for
          </h1>
          <p className="text-md text-gray-600 max-w-2xl mx-auto">
            Stand out in a competitive hiring market by building strong brand recall among students and early-career professionals.
          </p>
        </header>

        {/* Services Section - Exactly like workforce solution */}
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

        {/* CTA Section - Exactly like workforce solution */}
        <section className="flex justify-center">
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