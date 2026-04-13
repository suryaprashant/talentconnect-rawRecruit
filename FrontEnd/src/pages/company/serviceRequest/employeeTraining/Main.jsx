import { Target, Zap, GraduationCap, Users } from 'lucide-react';

// SEO Card Content
const serviceData = [
  {
    id: 1,
    title: "Custom Training Modules",
    bullets: [
      "Design role-specific training programs",
      "Focus on technical and functional skills",
      "Align learning with business requirements",
      "Improve job readiness and performance"
    ],
    icon: <Target className="h-6 w-6" />
  },
  {
    id: 2,
    title: "Faster Onboarding",
    bullets: [
      "Reduce ramp-up time for new hires",
      "Prepare candidates before Day One",
      "Support pre-joining and induction training",
      "Improve early productivity and confidence"
    ],
    icon: <Zap className="h-6 w-6" />
  },
  {
    id: 3,
    title: "Campus Enablement",
    bullets: [
      "Deliver training programs through colleges",
      "Prepare students to meet hiring standards",
      "Align academic learning with industry needs",
      "Improve placement and hiring outcomes"
    ],
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
      bullets: [
        "Industry-aligned training curriculum",
        "Practical, hands-on learning experiences",
        "Performance tracking and analytics",
        "Continuous learning and development support"
      ],
      icon: <Users className="h-6 w-6" />
    });
  }

  return (
    <>
      {/* Meta Title and Description */}
      <head>
        <title>Employee Training & Upskilling Programs | RawRecruit</title>
        <meta 
          name="description" 
          content="Upskill fresh hires with structured employee training programs designed to improve onboarding, performance, and job readiness." 
        />
      </head>

      <div className="min-h-screen bg-gradient-to-br from-[#667eea]/5 via-[#f093fb]/5 to-[#764ba2]/5 overflow-hidden">
        <div className="container mx-auto px-4 max-w-6xl flex flex-col py-4">

          {/* Header */}
          <header className="bg-white rounded-2xl shadow-sm border border-gray-200 px-6 py-8 mb-10 text-center">

            <h1 className="text-3xl md:text-4xl font-semibold text-[#143694] tracking-tight leading-snug mb-4">
              Employee Training and Upskilling Programs
            </h1>

            <h2 className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
              Structured training solutions to prepare candidates for real-world job performance.
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

          {/* CTA - SWAPPED POSITIONS */}
          <section className="flex justify-center gap-4 pt-2 pb-3">
            {/* Purple button on LEFT */}
            <button
              onClick={onRequestInfoClick} // This is Register Now
              className="
bg-[#143694] text-white 
px-8 py-3.5 rounded-lg font-medium 
flex items-center justify-center gap-2
text-base
shadow-sm hover:shadow-md 
hover:bg-[#1e4ed8] 
hover:-translate-y-[1px]
transition-all duration-200
"
            >
              <span>Register Now</span>
              {/* <span className="text-sm opacity-80">– Start Employee Training</span> */}
            </button>
            {/* Black button on RIGHT */}
            <button
              onClick={onRegisterClick} // This is Request Info
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
              {/* <span className="text-sm opacity-80">– Learn About Upskilling</span> */}
            </button>
          </section>

        </div>
      </div>
    </>
  );
}