import {
  UsersIcon,
  Zap,
  TrendingUp,
  Sparkles,
  ArrowRight,
  Info,
  FileText
} from 'lucide-react';

import { useNavigate } from 'react-router-dom';

const serviceData = [
  {
    id: 1,
    title: "Collaboration",
    bullets: [
      "Partner with multiple colleges for shared placement drives",
      "Combine student talent to attract more recruiters",
      "Strengthen inter-college placement networks",
      "Increase opportunities for all participating students"
    ],
    icon: <UsersIcon className="h-6 w-6 text-[#1e4ed8]" />
  },
  {
    id: 2,
    title: "Scale",
    bullets: [
      "Access larger hiring volumes through pooled drives",
      "Support bulk hiring requirements of companies",
      "Improve chances of recruiter participation",
      "Enable scalable placement execution"
    ],
    icon: <Zap className="h-6 w-6 text-[#1e4ed8]" />
  },
  {
    id: 3,
    title: "Efficiency",
    bullets: [
      "Reduce repetitive campus placement efforts",
      "Share infrastructure and coordination costs",
      "Optimize TPO time and resources",
      "Simplify multi-college placement management"
    ],
    icon: <TrendingUp className="h-6 w-6 text-[#1e4ed8]" />
  }
];

export default function MainPage({ onRegisterClick, onRequestInfoClick }) {
  const navigate = useNavigate();
  return (
    <>
      {/* Meta Title and Description */}
      <head>
        <title>Pool-Campus Placement for Colleges | RawRecruit</title>
        <meta 
          name="description" 
          content="Enable pool-campus placements with RawRecruit. Collaborate with colleges to attract more companies and improve placement outcomes." 
        />
      </head>

      <div className="min-h-screen bg-gradient-to-br from-[#f0e6f7]/60 via-[#d4e8f9]/55 to-[#cff7ea]/60 overflow-hidden">
        {/* <div className="container mx-auto px-4 pt-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 px-6 py-5 mb-0">
            {/* Header 
            <div className="flex items-center gap-3 mb-4">
              <h2 className="text-2xl md:text-[26px] font-semibold text-[#143694] tracking-tight">
                Service Request
              </h2>
            </div>

            
          </div>
        </div> */}
        {/* Background Blobs */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#fbcfe8]/20 rounded-full blur-3xl" />
          <div className="absolute top-1/3 -left-20 w-60 h-60 bg-[#143694]/20 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-1/3 w-40 h-40 bg-[#a7f3d0]/20 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 container mx-auto px-4 max-w-6xl flex flex-col py-4">

          {/* Header */}
          <header className="bg-white rounded-2xl shadow-sm border border-gray-200 px-6 py-6 mb-8 mt-5">

  <div className="flex flex-col gap-4">

    {/* Top Section */}
    <div className="flex flex-col md:flex-row justify-between items-start gap-4">

      <div>
        <h1 className="text-xl md:text-2xl font-semibold text-[#143694] tracking-tight">
          Pool-Campus Placement Solutions
        </h1>

        <p className="text-gray-600 text-sm md:text-base mt-1 max-w-2xl">
          Collaborative multi-college hiring to expand opportunities and improve placement outcomes
        </p>
      </div>

    </div>

    {/* Tabs */}
    <div className="flex flex-wrap items-center gap-2 border-gray-200 pt-0">

      <button 
        onClick={() => navigate('/service-request/campus-placement')}
        className="px-5 py-2 text-gray-600 hover:text-[#143694] hover:bg-gray-100 rounded-full text-sm transition-all"
      >
        Campus Placement
      </button>

      {/* Active */}
      <button 
        onClick={() => navigate('/service-request/poolcampus-placement')}
        className="px-5 py-2 bg-[#143694] text-white rounded-full font-medium text-sm shadow-sm"
      >
        PoolCampus
      </button>

      <button 
        onClick={() => navigate('/service-request/student-training-programs')}
        className="px-5 py-2 text-gray-600 hover:text-[#143694] hover:bg-gray-100 rounded-full text-sm transition-all"
      >
        Training Programs
      </button>

      <button 
        onClick={() => navigate('/service-request/seminars')}
        className="px-5 py-2 text-gray-600 hover:text-[#143694] hover:bg-gray-100 rounded-full text-sm transition-all"
      >
        Seminars
      </button>

      <button 
        onClick={() => navigate('/service-request/campus-branding')}
        className="px-5 py-2 text-gray-600 hover:text-[#143694] hover:bg-gray-100 rounded-full text-sm transition-all"
      >
        Branding
      </button>

    </div>

  </div>

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
                  <div className="absolute inset-0 bg-gradient-to-br from-[#143694]/0 to-[#1e4ed8]/0 group-hover:from-[#143694]/5 group-hover:to-[#1e4ed8]/5 rounded-lg transition-all duration-300"></div>
                  
                  {/* Blue border on hover */}
                  <div className="absolute inset-0 border-2 border-transparent group-hover:border-[#1e4ed8]/20 rounded-lg transition-all duration-300"></div>
                  
                  <div className="relative z-10 h-full flex flex-col">
                    <div className="inline-flex items-center justify-center w-10 h-10 bg-gradient-to-br from-[#143694]/30 to-[#1e4ed8]/20 rounded-lg mb-4">
                      {service.icon}
                    </div>

                    <h3 className="text-lg font-bold text-gray-900 mb-4">
                      {service.title}
                    </h3>

                    <ul className="space-y-3 flex-grow">
                      {service.bullets.map((bullet, index) => (
                        <li key={index} className="flex items-start">
                          <div className="flex-shrink-0 w-1.5 h-1.5 bg-[#1e4ed8] rounded-full mt-2 mr-3"></div>
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
              onClick={onRequestInfoClick}
              className="group flex items-center gap-2 bg-gradient-to-r from-[#143694] to-[#1e4ed8] text-white px-8 py-3.5 rounded-lg font-medium hover:shadow-lg hover:shadow-[#143694]/40 transition-all text-base flex items-center justify-center"
            >
              <FileText className="w-5 h-5" />
              <span>Register Now</span>
              {/* <span className="text-sm opacity-80">– Start Pool Placements</span> */}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            
            {/* White Request Info button on RIGHT */}
            <button
              onClick={onRegisterClick}
              className="group flex items-center gap-2 bg-white/90 backdrop-blur-sm border border-white/60 text-gray-800 px-8 py-3.5 rounded-lg font-medium hover:bg-white hover:shadow-lg transition-all text-base flex items-center justify-center"
            >
              <Info className="w-5 h-5" />
              <span>Request Info</span>
              {/* <span className="text-sm opacity-80">– Learn About Pool Hiring</span> */}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </section>

        </div>
      </div>
    </>
  );
}