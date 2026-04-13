import {
  Eye,
  Target,
  Share2,
  Sparkles,
  ArrowRight,
  Info,
  FileText
} from 'lucide-react';

const serviceData = [
  {
    id: 1,
    title: "Presence",
    bullets: [
      "Increase campus visibility among hiring companies",
      "Host branding-led talks, events, and activities",
      "Showcase your institution's talent ecosystem",
      "Strengthen first impressions with recruiters"
    ],
    icon: <Eye className="h-6 w-6 text-[#3b82f6]" />
  },
  {
    id: 2,
    title: "Reputation",
    bullets: [
      "Build credibility through consistent campus branding",
      "Highlight placement outcomes and academic strengths",
      "Improve trust with recruiters and partners",
      "Position the college as a preferred hiring destination"
    ],
    icon: <Target className="h-6 w-6 text-[#3b82f6]" />
  },
  {
    id: 3,
    title: "Reach",
    bullets: [
      "Promote campus achievements through digital channels",
      "Share placement success stories and updates",
      "Extend brand visibility beyond physical campus events",
      "Attract wider industry and student attention"
    ],
    icon: <Share2 className="h-6 w-6 text-[#3b82f6]" />
  }
];

export default function MainPage({ onRegisterClick, onRequestInfoClick }) {
  return (
    <>
      {/* Meta Title and Description */}
      <head>
        <title>Campus Branding Solutions for Colleges | RawRecruit</title>
        <meta 
          name="description" 
          content="Strengthen your college brand with campus branding solutions. Attract companies, students, and talent through visibility and reputation." 
        />
      </head>

      <div className="min-h-screen bg-gradient-to-br from-[#f0e6f7]/60 via-[#d4e8f9]/55 to-[#cff7ea]/60 overflow-hidden">

        {/* Background Blobs - EXACT SAME */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#fbcfe8]/20 rounded-full blur-3xl" />
          <div className="absolute top-1/3 -left-20 w-60 h-60 bg-[#93c5fd]/20 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-1/3 w-40 h-40 bg-[#a7f3d0]/20 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 container mx-auto px-4 max-w-6xl flex flex-col py-4">

          {/* Header - EXACT SAME */}
          <header className="bg-white rounded-2xl shadow-sm border border-gray-200 px-6 py-8 mb-8 mt-4 text-center">

            <div className="flex items-center justify-center gap-3 mb-4">
              
              <div className="p-2 bg-[#143694]/10 rounded-lg">
                <Sparkles className="h-6 w-6 text-[#143694]" />
              </div>

              <h1 className="text-3xl md:text-4xl font-semibold text-[#143694] tracking-tight leading-snug">
                Campus Branding Solutions for Colleges
              </h1>

            </div>

            <h2 className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
              Position your campus as a trusted talent hub for companies and students.
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
                  {/* Blue hover overlay - EXACT SAME */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[#93c5fd]/0 to-[#3b82f6]/0 group-hover:from-[#93c5fd]/5 group-hover:to-[#3b82f6]/5 rounded-lg transition-all duration-300"></div>
                  
                  {/* Blue border on hover - EXACT SAME */}
                  <div className="absolute inset-0 border-2 border-transparent group-hover:border-[#3b82f6]/20 rounded-lg transition-all duration-300"></div>
                  
                  <div className="relative z-10 h-full flex flex-col">
                    <div className="inline-flex items-center justify-center w-10 h-10 bg-gradient-to-br from-[#93c5fd]/30 to-[#3b82f6]/20 rounded-lg mb-4">
                      {service.icon}
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

          {/* CTA - Two buttons with descriptive subtitles */}
          <section className="flex flex-col sm:flex-row justify-center gap-4 pt-2 pb-3">
            {/* Register Now button on LEFT */}
            {/* <button
              onClick={onRegisterClick}
              className="group flex items-center gap-2 bg-gradient-to-r from-[#93c5fd] to-[#3b82f6] text-white px-6 py-3.5 rounded-lg font-medium hover:shadow-lg hover:shadow-[#93c5fd]/40 transition-all text-base flex items-center justify-center"
            >
              <FileText className="w-5 h-5" />
              <div className="flex flex-col items-start">
                <span className="font-semibold">Register Now</span>
                <span className="text-xs opacity-90">– Enable Campus Branding</span>
              </div>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
             */}
            {/* Request Info button on RIGHT */}
            <button
              onClick={onRequestInfoClick}
              className="group flex items-center gap-2 bg-white/90 backdrop-blur-sm border border-white/60 text-gray-800 px-6 py-3.5 rounded-lg font-medium hover:bg-white hover:shadow-lg transition-all text-base flex items-center justify-center"
            >
              <Info className="w-5 h-5" />
              <div className="flex flex-col items-start">
                <span className="font-semibold">Request Info</span>
                {/* <span className="text-xs opacity-90">– Learn How Branding Works</span> */}
              </div>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </section>

        </div>
      </div>
    </>
  );
}
