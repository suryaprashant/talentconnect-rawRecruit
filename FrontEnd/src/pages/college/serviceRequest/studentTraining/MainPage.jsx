import {
  FileText,
  Users,
  TrendingUp,
  Sparkles,
  ArrowRight,
  Info
} from 'lucide-react';

const serviceData = [
  {
    id: 1,
    title: "Readiness",
    bullets: [
      "Improve student preparedness for campus placements",
      "Strengthen resumes with role-relevant skills",
      "Align student profiles with recruiter expectations",
      "Increase placement participation and confidence"
    ],
    icon: <FileText className="h-6 w-6 text-[#3b82f6]" />
  },
  {
    id: 2,
    title: "Confidence",
    bullets: [
      "Prepare students for interviews and assessments",
      "Conduct mock interviews and guided practice",
      "Improve communication and presentation skills",
      "Reduce interview anxiety and drop-outs"
    ],
    icon: <Users className="h-6 w-6 text-[#3b82f6]" />
  },
  {
    id: 3,
    title: "Identity",
    bullets: [
      "Help students build a strong professional identity",
      "Guide students on personal and career branding",
      "Highlight strengths, projects, and achievements",
      "Improve student visibility to recruiters"
    ],
    icon: <TrendingUp className="h-6 w-6 text-[#3b82f6]" />
  }
];

export default function MainPage({ onRegisterClick, onRequestInfoClick }) {
  return (
    <>
      {/* Meta Title and Description */}
      <head>
        <title>Student Training Programs for Colleges | RawRecruit</title>
        <meta 
          name="description" 
          content="Enhance student employability with structured training programs. RawRecruit helps colleges prepare students for placements and careers." 
        />
      </head>

      <div className="min-h-screen bg-gradient-to-br from-[#f0e6f7]/60 via-[#d4e8f9]/55 to-[#cff7ea]/60 overflow-hidden">

        {/* Background Blobs */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#fbcfe8]/20 rounded-full blur-3xl" />
          <div className="absolute top-1/3 -left-20 w-60 h-60 bg-[#93c5fd]/20 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-1/3 w-40 h-40 bg-[#a7f3d0]/20 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 container mx-auto px-4 max-w-6xl flex flex-col py-4">

          {/* Header */}
          <header className="mb-10 pt-2 text-center">
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#3b82f6] to-[#8b5cf6] bg-clip-text text-transparent mb-4">
              Student Training Programs for Colleges
            </h1>
            <h2 className="text-lg md:text-xl text-gray-700 max-w-2xl mx-auto">
              Preparing students with job-ready skills to improve placement outcomes and career readiness
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
                  {/* Blue hover overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[#93c5fd]/0 to-[#3b82f6]/0 group-hover:from-[#93c5fd]/5 group-hover:to-[#3b82f6]/5 rounded-lg transition-all duration-300"></div>
                  
                  {/* Blue border on hover */}
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
          <section className="flex justify-center gap-4 pt-2 pb-3">
            {/* Blue gradient Register Now button on LEFT */}
            <button
              onClick={onRegisterClick}
              className="group flex items-center gap-2 bg-gradient-to-r from-[#93c5fd] to-[#3b82f6] text-white px-8 py-3.5 rounded-lg font-medium hover:shadow-lg hover:shadow-[#93c5fd]/40 transition-all text-base flex items-center justify-center"
            >
              <FileText className="w-5 h-5" />
              <span>Register Now</span>
              {/* <span className="text-sm opacity-80">– Enable Student Training Programs</span> */}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            
            {/* White Request Info button on RIGHT */}
            <button
              onClick={onRequestInfoClick}
              className="group flex items-center gap-2 bg-white/90 backdrop-blur-sm border border-white/60 text-gray-800 px-8 py-3.5 rounded-lg font-medium hover:bg-white hover:shadow-lg transition-all text-base flex items-center justify-center"
            >
              <Info className="w-5 h-5" />
              <span>Request Info</span>
              {/* <span className="text-sm opacity-80">– Learn How Student Training Works</span> */}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </section>

        </div>
      </div>
    </>
  );
}