import { Building2, Users, Search, CheckCircle, Briefcase } from "lucide-react";

// SEO Card Content
const serviceData = [
  {
    id: 1,
    title: "Recruitment",
    bullets: [
      "Support hiring for contract, RPO, and permanent roles",
      "Source qualified candidates across experience levels",
      "Align recruitment with business requirements",
      "Improve hiring speed and quality"
    ],
    icon: <Users className="h-6 w-6" />
  },
  {
    id: 2,
    title: "Staffing",
    bullets: [
      "Deploy flexible staffing solutions for business needs",
      "Match skilled professionals to the right roles",
      "Scale teams based on demand",
      "Optimize workforce planning and utilization"
    ],
    icon: <Search className="h-6 w-6" />
  },
  {
    id: 3,
    title: "Candidate Evaluation",
    bullets: [
      "Conduct structured candidate screening",
      "Assess skills, experience, and role fit",
      "Reduce hiring risk through better evaluation",
      "Improve long-term hiring outcomes"
    ],
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
      bullets: [
        "Custom workforce solution tailored to your needs",
        "Scalable talent acquisition strategies",
        "Industry-specific hiring expertise",
        "Data-driven recruitment optimization"
      ],
      icon: <Briefcase className="h-6 w-6" />
    });
  }

  return (
    <>
      {/* Meta Title and Description */}
      <head>
        <title>Workforce Solutions for Hiring | RawRecruit</title>
        <meta 
          name="description" 
          content="Simplify hiring with workforce solutions covering recruitment, staffing, and candidate evaluation through RawRecruit." 
        />
      </head>

      <div className="min-h-screen bg-gradient-to-br from-[#667eea]/5 via-[#f093fb]/5 to-[#764ba2]/5 overflow-hidden">
        <div className="container mx-auto px-4 max-w-6xl flex flex-col py-4">

          {/* Header */}
          <header className="bg-white rounded-2xl shadow-sm border border-gray-200 px-6 py-8 mb-10 text-center">

            <h1 className="text-3xl md:text-4xl font-semibold text-[#143694] tracking-tight leading-snug mb-4">
              Workforce Solutions for Smarter Hiring
            </h1>

            <h2 className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
              End-to-end workforce support to streamline recruitment and build reliable talent pipelines.
            </h2>

          </header>

          {/* Services Section - Square Cards */}
          <section className="mb-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {visibleCards.map((service) => (
                <div
                  key={service.id}
                  className="group relative bg-white/90 backdrop-blur-sm border border-gray-100 rounded-lg shadow p-6 hover:shadow-md transition-all duration-200 flex flex-col min-h-[320px]"
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

                    <h3 className="text-lg font-bold text-gray-900 mb-4">
                      {service.title}
                    </h3>

                    <ul className="space-y-3 flex-grow">
                      {service.bullets.map((bullet, index) => (
                        <li key={index} className="flex items-start">
                          <div className="flex-shrink-0 w-1.5 h-1.5 bg-[#667eea] rounded-full mt-2 mr-3"></div>
                          <span className="text-gray-600 text-sm">{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* CTA */}
          <section className="flex justify-center pt-2 pb-3">
            <button
              onClick={onRegisterClick}
              className="
bg-[#143694] text-white 
px-8 py-3.5 rounded-lg font-medium 
flex items-center justify-center gap-2 text-base
shadow-sm hover:shadow-md 
hover:bg-[#1e4ed8] 
hover:-translate-y-[1px]
transition-all duration-200
"
            >
              <span>Request Info</span>
              {/* <span className="text-sm opacity-80">– Simplify Your Hiring Today</span> */}
            </button>
          </section>

        </div>
      </div>
    </>
  );
}