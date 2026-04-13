import {
  Building2,
  Target,
  Users,
  Sparkles,
  ArrowRight,
  Info,
  FileText,
  Globe
} from 'lucide-react';

const serviceData = [
  {
    id: 1,
    title: "Planning",
    bullets: [
      "Organize structured on-campus placement drives",
      "Plan company visits and recruitment schedules",
      "Simplify coordination for TPOs and placement teams",
      "Ensure smooth execution of campus hiring"
    ],
    icon: <Target className="h-6 w-6" />
  },
  {
    id: 2,
    title: "Engagement",
    bullets: [
      "Attract more recruiters to campus placements",
      "Build long-term relationships with hiring companies",
      "Increase employer participation and trust",
      "Strengthen the college's placement reputation"
    ],
    icon: <Users className="h-6 w-6" />
  },
  {
    id: 3,
    title: "Visibility",
    bullets: [
      "Improve student participation in placements",
      "Increase placement ratios and success rates",
      "Showcase strong placement records",
      "Support better student admissions through results"
    ],
    icon: <Globe className="h-6 w-6" />
  }
];

export default function MainPage({ onRegisterClick, onRequestInfoClick }) {
  return (
    <>
      {/* Meta Title and Description */}
      <head>
        <title>On-Campus Placement for Colleges | RawRecruit</title>
        <meta 
          name="description" 
          content="Manage structured on-campus placements with RawRecruit. Connect colleges with companies to improve placement outcomes and admissions." 
        />
      </head>

      <div className="min-h-screen bg-gradient-to-br from-[#f0e6f7]/60 via-[#d4e8f9]/55 to-[#cff7ea]/60 overflow-hidden">

        {/* Background blobs - Keeping original */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#fbcfe8]/20 rounded-full blur-3xl" />
          <div className="absolute top-1/3 -left-20 w-60 h-60 bg-[#93c5fd]/20 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-1/3 w-40 h-40 bg-[#a7f3d0]/20 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 container mx-auto px-4 max-w-6xl flex flex-col py-4">

          {/* Header - Updated with SEO content */}
          <header className="bg-white rounded-2xl shadow-sm border border-gray-200 px-6 py-8 mb-8 mt-4 text-center">

            <h1 className="text-3xl md:text-4xl font-semibold text-[#143694] tracking-tight leading-snug mb-4">
              On-Campus Placement Solutions for Colleges
            </h1>

            <h2 className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
              Helping colleges deliver structured placements, stronger outcomes, and higher student trust.
            </h2>

          </header>

          {/* Services Section - Square Cards with Bullet Points */}
          <section className="mb-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {serviceData.map((service) => (
                <div
                  key={service.id}
                  className="group relative bg-white/90 backdrop-blur-sm border border-white/60 rounded-lg shadow-lg p-6 hover:shadow-xl transition-all duration-300 flex flex-col min-h-[320px]"
                >
                  {/* Blue hover overlay - using original blue gradient */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[#93c5fd]/0 to-[#3b82f6]/0 group-hover:from-[#93c5fd]/5 group-hover:to-[#3b82f6]/5 rounded-lg transition-all duration-300"></div>
                  
                  {/* Blue border on hover - matching original theme */}
                  <div className="absolute inset-0 border-2 border-transparent group-hover:border-[#3b82f6]/20 rounded-lg transition-all duration-300"></div>
                  
                  <div className="relative z-10 h-full flex flex-col">
                    <div className="inline-flex items-center justify-center w-10 h-10 bg-gradient-to-br from-[#93c5fd]/30 to-[#3b82f6]/20 rounded-lg mb-4">
                      <div className="text-[#3b82f6]">
                        {service.icon}
                      </div>
                    </div>

                    <h3 className="text-lg font-bold text-gray-900 mb-4">
                      {service.title} 
                    </h3>

                    <ul className="space-y-3 flex-grow">
                      {service.bullets.map((bullet, index) => (
                        <li key={index} className="flex items-start">
                          <div className="flex-shrink-0 w-1.5 h-1.5 bg-[#3b82f6] rounded-full mt-2 mr-3"></div>
                          <span className="text-gray-600 text-sm">{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* CTA - Two buttons with swapped positions but original colors */}
          <section className="flex justify-center gap-4 pt-2 pb-3">
            {/* Blue gradient Register Now button on LEFT */}
            <button
              onClick={onRegisterClick}
              className="group flex items-center gap-2 bg-gradient-to-r from-[#93c5fd] to-[#3b82f6] text-white px-8 py-3.5 rounded-lg font-medium hover:shadow-lg hover:shadow-[#93c5fd]/40 transition-all text-base flex items-center justify-center"
            >
              <FileText className="w-5 h-5" />
              <span>Register Now</span>
              {/* <span className="text-sm opacity-80">– Start Campus Placements</span> */}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            
            {/* White Request Info button on RIGHT */}
            <button
              onClick={onRequestInfoClick}
              className="group flex items-center gap-2 bg-white/90 backdrop-blur-sm border border-white/60 text-gray-800 px-8 py-3.5 rounded-lg font-medium hover:bg-white hover:shadow-lg transition-all text-base flex items-center justify-center"
            >
              <Info className="w-5 h-5" />
              <span>Request Info</span>
              {/* <span className="text-sm opacity-80">– Learn About Placements</span> */}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </section>

        </div>
      </div>
    </>
  );
}