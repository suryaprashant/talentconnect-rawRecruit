import ServiceCard from './ServiceCard';

const serviceData = [
  {
    id: 1,
    title: "Skill-Based",
    description: "Prioritize what matters most-skills. Identify the right candidates through assessments, portfolio, or hands-on challenges, not just resumes and academic scores.",
    icon: "/images/custom-modules-icon.png"
  },
  {
    id: 2,
    title: "Intern-to-Hire",
    description: "Run Internship programs designed to convert top performers into full-time employees. Reduce hiring risks and build a strong talent pipeline with real time evaluation.",
    icon: "/images/onboarding-icon.png"
  },
  {
    id: 3,
    title: "Targeted Outreach",
    description: "Launch focused hiring campaigns based on job roles experiences or location. Get curated candidates pools and personalized engagement strategies that align with your goals.",
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
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#667eea]">
                <path d="M8 21h8a2 2 0 0 0 2-2v-2H6v2a2 2 0 0 0 2 2Z" />
                <path d="M19 17V5a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v12" />
                <path d="M10 7h4" />
                <path d="M10 11h4" />
                <path d="M10 15h4" />
              </svg>
            </div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent mb-4">
            OffCampus Access: <br /> Hire Beyond Boundaries
          </h1>
          <p className="text-md text-gray-600 max-w-2xl mx-auto">
            Reach top talent across cities, domains, and institutions—without stepping on campus. 
            OffCampus Access helps companies connect with graduates and job seekers outside the traditional 
            college setting. Whether you're hiring based on skills, offering internships, or launching a targeted 
            campaign, OffCampus Access gives you flexibility, reach, and efficiency.
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
                  {service.icon ? (
                    <img src={service.icon} alt={service.title} className="h-8 w-8 text-[#667eea]" />
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 text-[#667eea]">
                      <path d="M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z" />
                      <path d="M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />
                      <path d="M12 2v2" />
                      <path d="M12 22v-2" />
                      <path d="m17 20.66-1-1.73" />
                      <path d="M11 10.27 7 3.34" />
                      <path d="m20.66 17-1.73-1" />
                      <path d="m3.34 7 1.73 1" />
                      <path d="M14 12h8" />
                      <path d="M2 12h2" />
                      <path d="m20.66 7-1.73 1" />
                      <path d="m3.34 17 1.73-1" />
                      <path d="m17 3.34-1 1.73" />
                      <path d="m11 13.73-4 6.93" />
                    </svg>
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