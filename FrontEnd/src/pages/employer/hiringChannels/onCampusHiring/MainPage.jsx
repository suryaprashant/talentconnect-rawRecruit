import ServiceCard from './ServiceCard';

const serviceData = [
  {
    id: 1,
    title: "Partneships",
    description: "At TalentConnect, we offer seamless on-campus hiring solutions in partnership wih universities and colleges providing comprehensive end-to-end recruitment services. Our tailored approach ensures efficient hiring processes, connecting students directly with the top employers. Let us enhance your campus recruitment with our expertise and expensive network .",
    icon: "/images/custom-modules-icon.png"
  },
  {
    id: 2,
    title: "Talent Pipeline",
    description: "At TalentConnect we provide access to a steady pipeline of pre-screened candidates supply of qualified talent. Our rigorous screening process gaurantees that only the best candidatesare presented. Streamline your hiring process. Rely on our expertise to maintain a robust talent pipeline for your organization needs.",
    icon: "/images/onboarding-icon.png"
  },
  {
    id: 3,
    title: "AI Talent Match",
    description: "At TalentConnect AI Talent Match utilizes advanced algorithm to intelligently connect employers with the most suitable candidates, ensuring you have a continous supply of qualified talent. Our AI-driven screening process gaurantees that only the best candidates are presented, streamlining your hiring process. Rely on your pipeline for your organization needs.",
    icon: "/images/campus-enablement-icon.png"
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
              <div className="text-[#667eea]">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-building-2">
                  <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z" />
                  <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" />
                  <path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2" />
                  <path d="M10 6h4" />
                  <path d="M10 10h4" />
                  <path d="M10 14h4" />
                  <path d="M10 18h4" />
                </svg>
              </div>
            </div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent">
            OnCampus Connect: <br /> Hire Smarter
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Our OnCampus Service brings career opportunities directly to student them eith top employers through campus recruitment drives and job events.
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
                  {service.icon.startsWith('/') ? (
                    <img src={service.icon} alt={service.title} className="h-8 w-8 text-[#667eea]" />
                  ) : (
                    <div className="text-[#667eea]">
                      {service.icon}
                    </div>
                  )}
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