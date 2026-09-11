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
import { useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();
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
        {/* Background blobs - Keeping original */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#fbcfe8]/20 rounded-full blur-3xl" />
          <div className="absolute top-1/3 -left-20 w-60 h-60 bg-[#143694]/20 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-1/3 w-40 h-40 bg-[#a7f3d0]/20 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 container mx-auto px-4 max-w-6xl flex flex-col py-4">

          {/* Header - Updated with SEO content */}
          <header className="bg-white rounded-2xl shadow-sm border border-gray-200 px-6 py-6 mb-8 mt-5">

  <div className="flex flex-col gap-4">

    {/* Top Section */}
    <div className="flex flex-col md:flex-row justify-between items-start gap-4">

      <div>
        <h1 className="text-xl md:text-2xl font-semibold text-[#143694] tracking-tight">
          On-Campus Placement Solutions
        </h1>

        <p className="text-gray-600 text-sm md:text-base mt-1 max-w-2xl">
          Helping colleges deliver structured placements and stronger outcomes
        </p>
      </div>

    </div>

    {/* Tabs */}
    <div className="flex flex-wrap items-center gap-2 border-gray-200 pt-0">

      {/* Active */}
      <button 
        onClick={() => navigate('/service-request/campus-placement')}
        className="px-5 py-2 bg-[#143694] text-white rounded-full font-medium text-sm shadow-sm"
      >
        Campus Placement
      </button>

      {/* Others */}
      <button 
        onClick={() => navigate('/service-request/poolcampus-placement')}
        className="px-5 py-2 text-gray-600 hover:text-[#143694] hover:bg-gray-100 rounded-full text-sm transition-all"
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
                  {/* Blue hover overlay - using original blue gradient */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[#143694]/0 to-[#1e4ed8]/0 group-hover:from-[#143694]/5 group-hover:to-[#1e4ed8]/5 rounded-lg transition-all duration-300"></div>
                  
                  {/* Blue border on hover - matching original theme */}
                  <div className="absolute inset-0 border-2 border-transparent group-hover:border-[#1e4ed8]/20 rounded-lg transition-all duration-300"></div>
                  
                  <div className="relative z-10 h-full flex flex-col">
                    <div className="inline-flex items-center justify-center w-10 h-10 bg-gradient-to-br from-[#143694]/30 to-[#1e4ed8]/20 rounded-lg mb-4">
                      <div className="text-[#1e4ed8]">
                        {service.icon}
                      </div>
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

          {/* CTA - Two buttons with swapped positions but original colors */}
          <section className="flex justify-center gap-4 pt-2 pb-3">
            {/* Blue gradient Register Now button on LEFT */}
            <button
              onClick={onRegisterClick}
              className="group flex items-center gap-2 bg-gradient-to-r from-[#143694] to-[#1e4ed8] text-white px-8 py-3.5 rounded-lg font-medium hover:shadow-lg hover:shadow-[#143694]/40 transition-all text-base flex items-center justify-center"
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