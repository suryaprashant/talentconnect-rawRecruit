import { Building2, Target, Users, Globe } from 'lucide-react';

// SEO Card Content
const serviceData = [
  {
    id: 1,
    title: "Campus Presence",
    bullets: [
      "Host webinars, workshops, and campus talks",
      "Showcase your brand directly to students",
      "Build early trust and familiarity",
      "Strengthen visibility across colleges"
    ],
    icon: <Target className="h-6 w-6" />
  },
  {
    id: 2,
    title: "Engagement Kits",
    bullets: [
      "Deliver customized on-campus engagement materials",
      "Create memorable brand touchpoints",
      "Improve student interaction and recall",
      "Support long-term employer awareness"
    ],
    icon: <Users className="h-6 w-6" />
  },
  {
    id: 3,
    title: "Digital Reach",
    bullets: [
      "Promote your employer brand through curated content",
      "Run targeted digital and social campaigns",
      "Highlight roles and career opportunities",
      "Reach students and early-career professionals at scale"
    ],
    icon: <Globe className="h-6 w-6" />
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
        "Custom employer brand strategy development",
        "Brand perception surveys and analytics",
        "Employee advocacy program setup",
        "Talent community building and engagement"
      ],
      icon: <Building2 className="h-6 w-6" />
    });
  }

  return (
    <>
      {/* Meta Title and Description */}
      <head>
        <title>Employer Branding Solutions for Hiring | RawRecruit</title>
        <meta 
          name="description" 
          content="Build a strong employer brand among students and freshers through campus presence, engagement programs, and digital outreach with RawRecruit." 
        />
      </head>

      <div className="min-h-screen bg-gradient-to-br from-[#667eea]/5 via-[#f093fb]/5 to-[#764ba2]/5 overflow-hidden">
        <div className="container mx-auto px-4 max-w-6xl flex flex-col py-4">

          {/* Header */}
          <header className="mb-10 pt-2 text-center">
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent mb-4">
              Employer Branding Solutions
            </h1>
            <h2 className="text-lg md:text-xl text-gray-700 max-w-2xl mx-auto">
              Build trust, visibility, and brand recall among students and early-career professionals
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

          {/* CTA - Two buttons like other pages */}
          <section className="flex justify-center gap-4 pt-2 pb-3">
            <button
              onClick={onRegisterClick}
              className="bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white px-8 py-3.5 rounded-lg font-medium hover:shadow-lg hover:shadow-[#667eea]/30 transition-all text-base flex items-center justify-center gap-2"
            >
              <span>Request Info</span>
              {/* <span className="text-sm opacity-80">– Enhance Your Employer Brand</span> */}
            </button>
          </section>

        </div>
      </div>
    </>
  );
}